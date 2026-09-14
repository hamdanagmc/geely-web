import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/writeClient';
import { nGeniusService } from '@/lib/services/ngenius';
import { processSuccessfulPayment } from '@/lib/services/prebookingProcess';

/**
 * Maximum age (in hours) a booking can remain `pending` before the
 * reconciliation cron force-closes it as `failed`.
 */
const MAX_PENDING_AGE_HOURS = 48;

/**
 * Maps a raw nGenius payment state string to our internal status.
 */
function mapNGeniusState(state: string): 'successful' | 'failed' | 'pending' {
  const s = state.toUpperCase();
  if (s === 'CAPTURED' || s === 'PURCHASED') return 'successful';
  if (s === 'FAILED' || s === 'REVERSED' || s === 'CANCELLED') return 'failed';
  return 'pending';
}

/**
 * GET /api/pre-booking/reconcile
 *
 * Called by Vercel Cron every hour (schedule: "0 * * * *").
 * Vercel automatically passes `Authorization: Bearer <CRON_SECRET>` header.
 *
 * For each `pending` vehiclePreBooking document it:
 *   1. Checks if the booking is older than MAX_PENDING_AGE_HOURS -> force-fails it
 *   2. Queries nGenius for the real payment status
 *   3. If successful -> calls processSuccessfulPayment() (Keyloop + emails included)
 *   4. If failed     -> patches Sanity to `failed`
 *   5. If still pending -> just updates `lastReconciledAt` timestamp
 */
export async function GET(req: Request) {
  // Auth guard
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('[reconcile] CRON_SECRET env var is not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    console.warn('[reconcile] Unauthorized request — invalid or missing Authorization header');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cronRunAt = new Date().toISOString();
  console.log(`[reconcile] Cron run started at ${cronRunAt}`);

  // Fetch all pending pre-bookings (writeClient = no CDN cache, always fresh)
  // Only consider bookings that have been pending for at least 15 minutes
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const pendingBookings = await writeClient.fetch<PendingBooking[]>(
    `*[_type == "vehiclePreBooking" && paymentStatus == "pending" && _createdAt <= $cutoff] | order(_createdAt asc) {
      _id,
      _rev,
      _createdAt,
      fullName,
      email,
      mobile,
      location,
      pageUrl,
      orderReference,
      ngeniusOrderReference,
      amount,
      currency,
      lastReconciledAt
    }`,
    { cutoff: fifteenMinutesAgo }
  );

  console.log(`[reconcile] Found ${pendingBookings.length} pending booking(s)`);

  const results = {
    total: pendingBookings.length,
    resolved_successful: 0,
    resolved_failed: 0,
    still_pending: 0,
    timed_out: 0,
    errors: 0,
  };

  for (const booking of pendingBookings) {
    const now = new Date();
    const createdAt = new Date(booking._createdAt);
    const ageHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    const ngeniusRef = booking.orderReference || "";

    if (!ngeniusRef) {
      console.warn(`[reconcile] Booking ${booking._id} has no order reference — skipping`);
      results.errors++;
      continue;
    }

    // Stale booking timeout: force-fail bookings older than MAX_PENDING_AGE_HOURS
    if (ageHours > MAX_PENDING_AGE_HOURS) {
      console.log(`[reconcile] Booking ${booking._id} is ${ageHours.toFixed(1)}h old — force-failing`);
      try {
        await writeClient
          .patch(booking._id)
          .set({
            paymentStatus: 'failed',
            lastReconciledAt: now.toISOString(),
            reconciliationNote: `reconciliation_timeout after ${ageHours.toFixed(1)}h`,
          })
          .commit();
        results.timed_out++;
        results.resolved_failed++;
      } catch (err) {
        console.error(`[reconcile] Failed to timeout booking ${booking._id}:`, err);
        results.errors++;
      }
      continue;
    }

    // Query nGenius for payment status
    let orderDetails: any;
    try {
      orderDetails = await nGeniusService.getPaymentStatus(ngeniusRef);
    } catch (err) {
      console.error(`[reconcile] nGenius API error for booking ${booking._id} (ref: ${ngeniusRef}):`, err);
      try {
        await writeClient.patch(booking._id).set({ lastReconciledAt: now.toISOString() }).commit();
      } catch {
        // best-effort
      }
      results.errors++;
      continue;
    }

    const rawState = orderDetails._embedded?.payment?.[0]?.state || orderDetails.status || 'UNKNOWN';
    const mappedStatus = mapNGeniusState(rawState);
    const paymentId = orderDetails._embedded?.payment?.[0]?._id || orderDetails._id || '';
    const amount = (orderDetails.amount?.value || 0) / 100;
    const currency = orderDetails.amount?.currencyCode || booking.currency || 'AED';

    console.log(`[reconcile] Booking ${booking._id} — nGenius: ${rawState} → ${mappedStatus}`);

    try {
      if (mappedStatus === 'successful') {
        // Reuse existing flow: atomic Sanity update + Keyloop + emails
        await processSuccessfulPayment(ngeniusRef, {
          paymentId,
          amount,
          currency,
          paymentStatus: 'successful',
          fallbackFullName: booking.fullName || orderDetails.billingAddress?.firstName || 'Customer',
          fallbackEmail: booking.email || orderDetails.emailAddress || '',
          fallbackMobile: booking.mobile || orderDetails.merchantDefinedData?.mobile || 'N/A',
          fallbackLocation: booking.location || orderDetails.merchantDefinedData?.location || 'N/A',
          fallbackPageUrl: booking.pageUrl || orderDetails.merchantDefinedData?.pageUrl || '',
        });

        // processSuccessfulPayment already patched status; add reconciliation metadata
        await writeClient
          .patch(booking._id)
          .set({ lastReconciledAt: now.toISOString(), reconciliationNote: 'resolved_via_cron' })
          .commit();

        results.resolved_successful++;
        console.log(`[reconcile] Booking ${booking._id} resolved as SUCCESSFUL`);

      } else if (mappedStatus === 'failed') {
        await writeClient
          .patch(booking._id)
          .set({
            paymentId,
            amount,
            currency,
            paymentStatus: 'failed',
            transactionDate: now.toISOString(),
            lastReconciledAt: now.toISOString(),
            reconciliationNote: `resolved_via_cron — nGenius state: ${rawState}`,
          })
          .commit();

        results.resolved_failed++;
        console.log(`[reconcile] Booking ${booking._id} resolved as FAILED (${rawState})`);

      } else {
        // Still pending: update the reconciliation timestamp only
        await writeClient
          .patch(booking._id)
          .set({ lastReconciledAt: now.toISOString() })
          .commit();

        results.still_pending++;
        console.log(`[reconcile] Booking ${booking._id} still PENDING (nGenius: ${rawState})`);
      }
    } catch (err) {
      console.error(`[reconcile] Error processing booking ${booking._id}:`, err);
      results.errors++;
    }
  }

  console.log(`[reconcile] Cron run complete`, results);

  return NextResponse.json({ ok: true, cronRunAt, ...results });
}

// Local type — mirrors the GROQ projection above
interface PendingBooking {
  _id: string;
  _rev: string;
  _createdAt: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  location?: string;
  pageUrl?: string;
  orderReference?: string;
  ngeniusOrderReference?: string;
  amount?: number;
  currency?: string;
  lastReconciledAt?: string;
}

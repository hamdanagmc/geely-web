import { writeClient } from '@/sanity/lib/writeClient';
import type { Booking, Outcome, Payment } from '../types';

export async function findPendingBookings(cutoff: string): Promise<string[]> {
  'use step';
  console.log(`[reconcile-step:bookings] findPendingBookings cutoff=${cutoff}`);
  const ids = await writeClient.fetch<string[]>(
    `*[_type == "vehiclePreBooking" && paymentStatus == "pending" && _createdAt <= $cutoff]
      | order(_createdAt asc)._id`, { cutoff },
  );
  console.log(`[reconcile-step:bookings] findPendingBookings returned ${ids.length} id(s)`);
  return ids;
}

export async function readBooking(id: string): Promise<Booking | null> {
  'use step';
  const booking = await writeClient.fetch<Booking | null>(
    `*[_id == $id][0]{_id, _rev, _createdAt, paymentStatus, orderReference,
      fullName, email, mobile, location, pageUrl, currency, reconciliationRunId}`, { id },
  );
  return booking;
}

export async function savePayment(id: string, payment: Payment, runId: string, orderReference?: string):
  Promise<{ outcome: Outcome; booking: Booking | null }>
{
  'use step';
  console.log(`[reconcile-step:bookings] savePayment start for ${id} runId=${runId} orderReference=${orderReference} payment=${JSON.stringify(payment)}`);
  // Re-read: another cron or webhook may have updated the booking.
  const booking = await writeClient.fetch<Booking | null>(`*[_id == $id][0]`, { id });
  if (!booking) return { outcome: 'skipped', booking: null };
  // Recover a successful commit whose step result was not persisted yet.
  console.log(`[reconcile-step:bookings] savePayment read booking ${id} with paymentStatus=${booking.paymentStatus} reconciliationRunId=${booking.reconciliationRunId}`);
  if (booking.paymentStatus === 'successful' && booking.reconciliationRunId === runId) {
    console.log(`[reconcile-step:bookings] booking ${id} already resolved by run ${runId} — skipping`);
    return { outcome: 'resolved_successful', booking };
  }
  if (booking.paymentStatus !== 'pending') return { outcome: 'skipped', booking: null };

  const now = new Date();
  const ageHours = (now.getTime() - new Date(booking._createdAt).getTime()) / 3_600_000;
  // Check the gateway before expiry; unknown states remain pending for investigation.
  const expired = payment.status === 'pending' && payment.rawState === 'STARTED' && ageHours > 48;
  const status = expired ? 'failed' : payment.status;
  const fields: Record<string, unknown> = { lastReconciledAt: now.toISOString() };
  console.log(`[reconcile-step:bookings] savePayment booking ${id} age=${ageHours.toFixed(1)}h expired=${expired} status=${status}`);
  if (status !== 'pending') {
    Object.assign(fields, {
      paymentStatus: status,
      paymentId: payment.paymentId,
      amount: payment.amount,
      currency: payment.currency,
      transactionDate: now.toISOString(),
      reconciliationRunId: runId,
      reconciliationNote: expired
        ? `reconciliation_timeout after ${ageHours.toFixed(1)}h`
        : `resolved_via_workflow - nGenius state: ${payment.rawState}`,
    });
  }
  // A revision conflict throws so the SDK retries with a fresh record.
  await writeClient.patch(id).ifRevisionId(booking._rev).set(fields).commit();
  console.log(`[reconcile-step:bookings] savePayment committed for ${id}`);
  return {
    outcome: expired ? 'timed_out' : status === 'successful' ? 'resolved_successful'
      : status === 'failed' ? 'resolved_failed' : 'still_pending',
    booking,
  };
}

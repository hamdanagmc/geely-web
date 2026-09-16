import { getWorkflowMetadata } from 'workflow';
import { findPendingBookings, readBooking, savePayment } from './steps/bookings';
import { checkPayment } from './steps/payment';
import { saveKeyloopBooking, sendCustomerEmail, sendCrmEmail } from './steps/notifications';
import type { BookingDetails } from '@/lib/services/email';

export async function reconcileBookings(cronRunAt: string) {
  'use workflow';
  const { workflowRunId } = getWorkflowMetadata();
  const cutoff = new Date(new Date(cronRunAt).getTime() - 15 * 60_000).toISOString();
  console.log(`[reconcile] Workflow started: runId=${workflowRunId}, cronRunAt=${cronRunAt}, cutoff=${cutoff}`);
  const ids = await findPendingBookings(cutoff);
  console.log(`[reconcile] Found ${ids.length} pending booking(s) to process`);
  const results = {
    total: ids.length,
    resolved_successful: 0,
    resolved_failed: 0,
    still_pending: 0,
    timed_out: 0,
    skipped: 0,
    errors: 0,
  };
  const failures: string[] = [];

  // Steps run in separate requests; the batch is not tied to the cron timeout.
  for (const id of ids) {
    try {
      console.log(`[reconcile] Processing booking ${id}`);
      const booking = await readBooking(id);
      if (!booking || booking.paymentStatus !== 'pending') {
        results.skipped++;
        continue;
      }
      if (!booking.orderReference) throw new Error(`Booking ${id} has no order reference`);
      const payment = await checkPayment(booking.orderReference, booking.currency || 'AED');
      const saved = await savePayment(id, payment, workflowRunId, booking.orderReference);
      results[saved.outcome]++;
      if (saved.outcome === 'timed_out') results.resolved_failed++;
      if (saved.outcome === 'resolved_successful' && saved.booking) {
        const details: BookingDetails = {
          fullName: saved.booking.fullName || 'Customer',
          email: saved.booking.email || '',
          mobile: saved.booking.mobile || 'N/A',
          location: saved.booking.location || 'N/A',
          pageUrl: saved.booking.pageUrl || '',
          orderReference: booking.orderReference,
          paymentId: payment.paymentId,
          amount: payment.amount,
          currency: payment.currency,
        };
        const notifications = await Promise.allSettled([
          saveKeyloopBooking(details), sendCustomerEmail(details), sendCrmEmail(details),
        ]);
        if (notifications.some(result => result.status === 'rejected')) {
          throw new Error(`Booking ${id}: post-payment step failed after retries`);
        }
      }
      console.log(`[reconcile] Booking ${id}: ${payment.rawState} -> ${saved.outcome}`);
    } catch (error) {
      results.errors++;
      failures.push(id);
      console.error(`[reconcile] Booking ${id} failed:`, error);
    }
  }
  console.log('[reconcile] Workflow complete', { cronRunAt, ...results });
  // Keep failed runs visible while still checking every booking.
  if (failures.length) throw new Error(`Reconciliation failed for bookings: ${failures.join(', ')}`);
  return { cronRunAt, ...results };
}

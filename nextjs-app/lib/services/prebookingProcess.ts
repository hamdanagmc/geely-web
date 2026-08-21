import { writeClient } from '@/sanity/lib/writeClient';
import { savePreBookingQuoteForm } from '@/app/actions/keyloop/preBooking';
import { emailService } from '@/lib/services/email';

export async function processSuccessfulPayment(orderRef: string, paymentDetails: any) {
  console.log(`[processSuccessfulPayment] Initiating for orderReference: ${orderRef}`);
  const { paymentId, amount, currency, paymentStatus: mappedStatus } = paymentDetails;
  console.log(`paymentDetails:`, JSON.stringify(paymentDetails, null, 2));
  try {
    // 1. Fetch the pending record
    const query = `*[_type == "vehiclePreBooking" && orderReference == $orderReference][0]`;
    const pendingRecord = await writeClient.fetch(query, { orderReference: orderRef });

    if (!pendingRecord) {
      console.log(`[processSuccessfulPayment] No pending record found for orderReference: ${orderRef}. Falling back to create.`);

      // Try to create since it doesn't exist
      try {
        const created = await writeClient.create({
          _type: 'vehiclePreBooking',
          fullName: paymentDetails.fallbackFullName || 'Customer',
          email: paymentDetails.fallbackEmail || '',
          mobile: paymentDetails.fallbackMobile || 'N/A',
          location: paymentDetails.fallbackLocation || 'N/A',
          pageUrl: paymentDetails.fallbackPageUrl || '',
          orderReference: orderRef,
          paymentId,
          amount,
          currency,
          paymentStatus: mappedStatus,
          transactionDate: new Date().toISOString(),
        });
        console.log(`[processSuccessfulPayment] Created Sanity record ${created._id} with status ${mappedStatus}`);

        // Since we created it, we are guaranteed to be the ones processing it
        if (mappedStatus === 'successful') {
          await handleKeyloopAndEmails(created, orderRef, paymentId, amount, currency);
        }
        return { success: true, paymentStatus: mappedStatus, pendingRecord: created };
      } catch (err) {
        console.error(`[processSuccessfulPayment] Failed to create Sanity record for ${orderRef}:`, err);
        throw err;
      }
    }

    console.log(`[processSuccessfulPayment] Found pendingRecord: ${pendingRecord._id}, current status: ${pendingRecord.paymentStatus}`);

    // If it's already successful, we don't process Keyloop and Emails again
    if (pendingRecord.paymentStatus === 'successful') {
      console.log(`[processSuccessfulPayment] Record ${pendingRecord._id} is already successful. Skipping processing.`);
      return { success: true, paymentStatus: pendingRecord.paymentStatus, pendingRecord };
    }

    // 2. Atomically update Sanity
    try {
      console.log(`[processSuccessfulPayment] Attempting atomic update for ${pendingRecord._id} with revision ${pendingRecord._rev}`);
      await writeClient
        .patch(pendingRecord._id, { ifRevisionID: pendingRecord._rev })
        .set({
          paymentId,
          amount,
          currency,
          paymentStatus: mappedStatus,
          transactionDate: new Date().toISOString(),
        })
        .commit();

      console.log(`[processSuccessfulPayment] Atomic update SUCCESS for ${pendingRecord._id}`);

      // Update pendingRecord object so handleKeyloopAndEmails has latest data
      const updatedRecord = { ...pendingRecord, paymentId, amount, currency, paymentStatus: mappedStatus };

      // 3. We successfully got the lock! Now handle Keyloop & Emails asynchronously
      if (mappedStatus === 'successful') {
        await handleKeyloopAndEmails(updatedRecord, orderRef, paymentId, amount, currency);
      }

      return { success: true, paymentStatus: mappedStatus, pendingRecord: updatedRecord };

    } catch (patchErr: any) {
      if (patchErr.statusCode === 409) {
        console.log(`[processSuccessfulPayment] Conflict! Another process already updated ${pendingRecord._id}. Skipping.`);
        // Fetch the latest state to return to client
        const latestRecord = await writeClient.fetch(`*[_id == $id][0]`, { id: pendingRecord._id });
        return { success: true, paymentStatus: latestRecord?.paymentStatus, pendingRecord: latestRecord };
      }
      throw patchErr;
    }

  } catch (err) {
    console.error(`[processSuccessfulPayment] Unexpected error processing order ${orderRef}:`, err);
    throw err;
  }
}

async function handleKeyloopAndEmails(pending: any, orderRef: string, paymentId: string, amount: number, currency: string) {
  console.log(`[handleKeyloopAndEmails] Starting post-processing for order: ${orderRef}`);

  const fullName = pending.fullName || '';
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';

  const mappedValues = {
    fname: firstName,
    lname: lastName,
    email: pending.email,
    countrymobileNoCode: (pending.mobile || '').substring(0, 4) || '',
    phone: (pending.mobile || '').substring(4) || '',
    selectedModelTitle: pending.location || '',
    title: '',
    location: pending.location || '',
    comments: '',
  };

  const bookingDetails = {
    fullName: pending.fullName,
    email: pending.email,
    mobile: pending.mobile,
    location: pending.location,
    pageUrl: pending.pageUrl,
    orderReference: orderRef,
    paymentId: paymentId || pending.paymentId || '',
    amount: amount || pending.amount || 0,
    currency: currency || pending.currency || 'AED',
  };

  // Helper function to retry promises
  async function withRetry<T>(fn: () => Promise<T>, name: string, retries = 3, delayMs = 1000): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        if (attempt === retries) throw err;
        console.warn(`[handleKeyloopAndEmails] ${name} attempt ${attempt} failed, retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    throw new Error('Unreachable');
  }

  // Run external calls in parallel with retries, catching all errors
  const keyloopPromise = withRetry(() => savePreBookingQuoteForm(mappedValues), 'Keyloop save')
    .then(res => console.log(`[handleKeyloopAndEmails] Keyloop save SUCCESS:`, res))
    .catch(err => console.error(`[handleKeyloopAndEmails] Keyloop save FAILED after retries:`, err));

  const customerEmailPromise = withRetry(() => emailService.sendCustomerConfirmationEmail(bookingDetails), 'Customer email')
    .then(() => console.log(`[handleKeyloopAndEmails] Customer confirmation email SENT`))
    .catch(err => console.error(`[handleKeyloopAndEmails] Customer confirmation email FAILED after retries:`, err));

  const crmEmailPromise = withRetry(() => emailService.sendCrmNotificationEmail(bookingDetails), 'CRM email')
    .then(() => console.log(`[handleKeyloopAndEmails] CRM notification email SENT`))
    .catch(err => console.error(`[handleKeyloopAndEmails] CRM notification email FAILED after retries:`, err));

  // Await all so they finish before serverless function exits
  await Promise.allSettled([keyloopPromise, customerEmailPromise, crmEmailPromise]);
  console.log(`[handleKeyloopAndEmails] Finished post-processing for order: ${orderRef}`);
}

import { NextResponse } from 'next/server';
import { nGeniusService } from '@/lib/services/ngenius';
import { writeClient } from '@/sanity/lib/writeClient';
import { processSuccessfulPayment } from '@/lib/services/prebookingProcess';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderRef = url.searchParams.get('orderReference') || url.searchParams.get('orderRef') || url.searchParams.get('reference');

    if (!orderRef) {
      return NextResponse.json({ error: 'Missing orderReference' }, { status: 400 });
    }

    console.log(`[verify] start - orderReference=${orderRef} url=${req.url}`);
    const nStart = Date.now();
    const orderDetails = await nGeniusService.getPaymentStatus(orderRef);
    console.log(`[verify] nGenius returned for ${orderRef} in ${Date.now() - nStart}ms`);

    const paymentStatus = orderDetails._embedded?.payment?.[0]?.state || 'UNKNOWN';
    const amount = (orderDetails.amount?.value || 0) / 100;
    const currency = orderDetails.amount?.currencyCode || 'AED';
    const paymentId = orderDetails._embedded?.payment?.[0]?._id || orderDetails._id;

    const mappedStatus = paymentStatus === 'CAPTURED' || paymentStatus === 'PURCHASED' ? 'successful' : paymentStatus === 'FAILED' || paymentStatus === 'REVERSED' || paymentStatus === 'CANCELLED' ? 'failed' : 'pending';

    if (mappedStatus === 'successful') {
        try {
            console.log(`[verify] Payment successful, passing to processSuccessfulPayment`);
            const processResult = await processSuccessfulPayment(orderRef, {
                paymentId,
                amount,
                currency,
                paymentStatus: 'successful',
                fallbackFullName: orderDetails.billingAddress?.firstName || 'Customer',
                fallbackEmail: orderDetails.emailAddress,
                fallbackMobile: orderDetails.merchantDefinedData?.mobile || 'N/A',
                fallbackLocation: orderDetails.merchantDefinedData?.location || 'N/A',
                fallbackPageUrl: orderDetails.merchantDefinedData?.pageUrl || '',
            });
            return NextResponse.json({ 
                success: true, 
                paymentStatus: processResult.paymentStatus, 
                pendingRecord: processResult.pendingRecord, 
                isAlreadyProcessed: true 
            });
        } catch (err: any) {
             console.error('[verify] error in processSuccessfulPayment', err);
             return NextResponse.json({ success: false, error: 'Failed to process successful payment' }, { status: 500 });
        }
    } else {
         // If it's failed or pending, just update the status without emails/Keyloop
         // Fetch the record to update it
         const query = `*[_type == "vehiclePreBooking" && orderReference == $orderReference][0]`;
         const pendingRecord = await writeClient.fetch(query, { orderReference: orderRef });
         
         if (pendingRecord) {
            try {
              await writeClient.patch(pendingRecord._id).set({
                paymentId,
                amount,
                currency,
                paymentStatus: mappedStatus,
                transactionDate: new Date().toISOString(),
              }).commit();
              console.log('[verify] updated Sanity record', pendingRecord._id, 'status=', mappedStatus);
            } catch (err) {
              console.error('[verify] failed to update Sanity record', pendingRecord._id, err);
            }
            const updated = await writeClient.fetch(query, { orderReference: orderRef });
            return NextResponse.json({ success: true, paymentStatus: updated.paymentStatus, pendingRecord: updated, isAlreadyProcessed: false });
         } else {
             try {
                const created = await writeClient.create({
                  _type: 'vehiclePreBooking',
                  fullName: orderDetails.billingAddress?.firstName || 'Customer',
                  email: orderDetails.emailAddress,
                  mobile: orderDetails.merchantDefinedData?.mobile || 'N/A',
                  location: orderDetails.merchantDefinedData?.location || 'N/A',
                  pageUrl: orderDetails.merchantDefinedData?.pageUrl || '',
                  orderReference: orderRef,
                  paymentId,
                  amount,
                  currency,
                  paymentStatus: mappedStatus,
                  transactionDate: new Date().toISOString(),
                });
                console.log('[verify] created Sanity record', created._id, 'status=', mappedStatus);
                return NextResponse.json({ success: true, paymentStatus: created.paymentStatus, pendingRecord: created, isAlreadyProcessed: false });
              } catch (err) {
                console.error('[verify] failed to create Sanity record', err);
                return NextResponse.json({ success: false, error: 'Failed to update/create record' }, { status: 500 });
              }
         }
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: error.message || 'Failed to verify payment' }, { status: 500 });
  }
}

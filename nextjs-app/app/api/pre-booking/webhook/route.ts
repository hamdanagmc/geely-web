"use server"
import { NextResponse } from 'next/server';
import { processSuccessfulPayment } from '@/lib/services/prebookingProcess';
import { writeClient } from '@/sanity/lib/writeClient';

export async function POST(req: Request) {
  try {
    console.log('==> [webhook] Received POST request for nGenius webhook');
    const rawBody = await req.text();
    const signature = req.headers.get('x-ngenius-webhook');
    const webhookSecret = process.env.NGENIUS_WEBHOOK_SECRET;
    console.log('==> [webhook] Signature header:', signature);
    if (!webhookSecret) {
      console.error('NGENIUS_WEBHOOK_SECRET is not set in environment variables.');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (signature !== webhookSecret) {
      console.warn('Invalid Ngenius webhook token received.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const eventName = body.eventName || body.eventType || 'UNKNOWN';
    console.log(`==> [webhook] Valid webhook received for event: ${eventName}`);
    console.log('==> [webhook] Webhook payload:', JSON.stringify(body, null, 2));
    const orderRef = body.order?.reference || body.orderReference || body.eventId;

    if (!orderRef) {
      return NextResponse.json({ error: 'No order reference provided' }, { status: 400 });
    }

    // Use payment status from the webhook payload (no extra API call)
    const payloadOrder = body.order || {};
    const paymentStatus = (payloadOrder._embedded?.payment?.[0]?.state || body.eventName || '').toUpperCase() || 'UNKNOWN';
    const amount = (payloadOrder.amount?.value || 0) / 100;
    const currency = payloadOrder.amount?.currencyCode || 'AED';
    const paymentId = payloadOrder._embedded?.payment?.[0]?._id || payloadOrder._id || '';

    console.log(`==> [webhook] Order ${orderRef} — payload payment state: ${paymentStatus}`);

    // Handle events by payload state
    switch (eventName) {
      case 'CAPTURED':
      case 'PURCHASED':
        console.log(`==> [webhook] Order ${orderRef} marked as successful. Passing to processSuccessfulPayment.`);
        
        try {
          await processSuccessfulPayment(orderRef, {
            paymentId,
            amount,
            currency,
            paymentStatus: 'successful',
            fallbackFullName: payloadOrder.billingAddress?.firstName || 'Customer',
            fallbackEmail: payloadOrder.emailAddress,
            fallbackLocation: payloadOrder.merchantDefinedData?.location || 'N/A',
            fallbackMobile: payloadOrder.merchantDefinedData?.mobile || 'N/A',
            fallbackPageUrl: payloadOrder.merchantDefinedData?.pageUrl || '',
          });
        } catch (err) {
          console.error(`==> [webhook] Error in processSuccessfulPayment for ${orderRef}:`, err);
          // Return 500 if the process fails so NGenius can retry
          return NextResponse.json({ error: 'Failed to process successful payment' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Payment processed successfully' });
      
      case 'FAILED':
      case 'REVERSED':
      case 'CANCELLED':
        console.log(`==> [webhook] Order ${orderRef} marked as failed/reversed/cancelled. Updating Sanity record.`);
        
        try {
            // Fetch the pending record from Sanity
            const query = `*[_type == "vehiclePreBooking" && orderReference == $orderReference][0]`;
            const pendingRecord = await writeClient.fetch(query, { orderReference: orderRef });

            if (pendingRecord) {
              await writeClient.patch(pendingRecord._id).set({
                paymentId,
                amount,
                currency,
                paymentStatus: 'failed',
                transactionDate: new Date().toISOString(),
              }).commit();
              console.log(`==> [webhook] Updated Sanity record to 'failed' for orderReference: ${orderRef}`);
            } else {
              // Fallback: create if pending record was somehow not found
              await writeClient.create({
                _type: 'vehiclePreBooking',
                fullName: payloadOrder.billingAddress?.firstName || 'Customer',
                email: payloadOrder.emailAddress,
                mobile: payloadOrder.merchantDefinedData?.mobile || 'N/A',
                location: payloadOrder.merchantDefinedData?.location || 'N/A',
                pageUrl: payloadOrder.merchantDefinedData?.pageUrl || '',
                orderReference: orderRef,
                paymentId,
                amount,
                currency,
                paymentStatus: 'failed',
                transactionDate: new Date().toISOString(),
              });
              console.log(`==> [webhook] Created new Sanity record as 'failed' (no pending record found) for orderReference: ${orderRef}`);
            }
        } catch (sanityError) {
            console.error('Failed to update record in Sanity for failed payment:', sanityError);
            return NextResponse.json({ error: 'Failed to update Sanity for failed payment' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Payment failed' });
      
      default:
        console.log(`==> [webhook] Order ${orderRef} is in intermediate state '${paymentStatus}', no action taken.`);
        return NextResponse.json({ success: true, message: `Payment state: ${paymentStatus}` });
    }
      
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    console.log('[webhook] GET probe received', { url: req.url, headers: Object.fromEntries(req.headers) });
  } catch (e) {
    console.log('[webhook] GET probe received (failed to read headers)');
  }
  return NextResponse.json({ ok: true, message: 'Webhook endpoint (GET probe)' });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'POST,GET,OPTIONS',
    },
  });
}

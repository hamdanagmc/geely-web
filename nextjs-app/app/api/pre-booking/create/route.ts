import { type NextRequest, NextResponse } from 'next/server';
import { nGeniusService } from '@/lib/services/ngenius';
import { writeClient } from '@/sanity/lib/writeClient';
import { client as sanityClient } from '@/sanity/lib/client';
import { settingsQuery } from '@/sanity/lib/queries';

// Authoritative server-side amount for pre-booking (prevent client tampering)
const DEFAULT_PREBOOK_AMOUNT = 1000; // AED

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("==> [api/pre-booking/create] Received request body:", body);
    const { fullName, email, mobile, vehicleModel, location, pageUrl, redirectUrl, currency } = body;

    const chosenLocation = location ;

    // Validate inputs — amount is set server-side to avoid tampering
    if (!fullName || !email || !mobile || !chosenLocation) {
      console.warn("==> [api/pre-booking/create] Validation failed. Missing required fields.", { fullName, email, mobile, chosenLocation });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a unique order reference under 37 chars
    const orderReference = `PB-${crypto.randomUUID().replace(/-/g, '')}`.substring(0, 36);

    // 1. Create the nGenius order FIRST so we have the nGenius order reference (_id)
    // Determine server-side authoritative amount from Sanity settings (fallback to default)
    let expectedAmount = DEFAULT_PREBOOK_AMOUNT;
    try {
      // Fetch settings with no-cache to ensure dynamic latest value
      const settings = await sanityClient.fetch(settingsQuery, {}, { cache: 'no-store' });
      if (settings?.preBookingAmountGeelyM9 && typeof settings.preBookingAmountGeelyM9 === 'number') {
        expectedAmount = settings.preBookingAmountGeelyM9;
      }
    } catch (e) {
      console.warn('Failed to fetch pre-booking amount from Sanity, falling back to default', e);
    }

    console.log(`==> [api/pre-booking/create] Creating nGenius order for ${orderReference} with amount ${expectedAmount} ${currency || "AED"}`);
    const order = await nGeniusService.createPaymentOrder({
      amount: expectedAmount,
      currency: currency || "AED",
      reference: orderReference,
      customerEmail: email,
      customerName: fullName,
      mobile: mobile,
      location: chosenLocation,
      pageUrl: pageUrl || '',
      redirectUrl: redirectUrl || 'https://geely.ae/en/prebook-thankyou',
    });

    if (!order._links || !order._links.payment || !order._links.payment.href) {
      console.error("==> [api/pre-booking/create] No payment link returned from nGenius. Order response:", JSON.stringify(order, null, 2));
      throw new Error('No payment link returned from nGenius');
    }
    console.log(`Order Response from nGenius: ${JSON.stringify(order, null, 2)}`);
    const ngeniusOrderReference = order._id;
    console.log(`==> [api/pre-booking/create] nGenius order created. ID: ${ngeniusOrderReference}, Payment URL: ${order._links.payment.href}`);

    // 2. Now create the pending record in Sanity with the nGenius order reference
    try {
      await writeClient.create({
        _type: 'vehiclePreBooking',
        fullName,
        email,
        mobile,
        location: chosenLocation,
        pageUrl: pageUrl || '',
        orderReference: ngeniusOrderReference.substring(ngeniusOrderReference.lastIndexOf(':') + 1),
        ngeniusOrderReference,
        amount: expectedAmount,
        currency: currency || "AED",
        paymentStatus: 'pending',
        transactionDate: new Date().toISOString(),
      });
      console.log(`==> [api/pre-booking/create] Created pending Sanity record for orderReference: ${orderReference}, ngeniusOrderReference: ${ngeniusOrderReference}`);
    } catch (sanityError) {
      console.error('Failed to create pending record in Sanity:', sanityError);
      // nGenius order already created — log the error but don't block the payment flow
      // The webhook will still update the record when payment completes
    }

    return NextResponse.json({
      success: true,
      paymentUrl: order._links.payment.href,
      orderReference,
    });

  } catch (error: any) {
    console.error('Error creating pre-booking payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}

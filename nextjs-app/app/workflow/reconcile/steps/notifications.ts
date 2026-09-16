import { FatalError } from 'workflow';
import { savePreBookingQuoteForm } from '@/app/actions/keyloop/preBooking';
import { emailService, type BookingDetails } from '@/lib/services/email';

export async function saveKeyloopBooking(details: BookingDetails) {
  'use step';
  console.log(`[reconcile-step:notifications] saveKeyloopBooking for ${details.orderReference || 'unknown ref'} name=${details.fullName}`);
  const parts = details.fullName.trim().split(/\s+/);
  const response = await savePreBookingQuoteForm({
    fname: parts[0] || '',
    lname: parts.slice(1).join(' '),
    email: details.email,
    countrymobileNoCode: details.mobile.substring(0, 4),
    phone: details.mobile.substring(4),
    selectedModelTitle: details.location,
    title: '',
    location: details.location,
    comments: '',
  });
  // The action returns failures rather than throwing; surface them for SDK retries.
  if (!response.status) throw new Error(response.message || 'Keyloop submission failed');
}

export async function sendCustomerEmail(details: BookingDetails) {
  'use step';
  console.log(`[reconcile-step:notifications] sendCustomerEmail to=${details.email}`);
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_GEELY_PRE_BOOKING_CUSTOMER_TEMPLATE_EN) {
    throw new FatalError('Customer email SendGrid configuration is missing');
  }
  const result = await emailService.sendCustomerConfirmationEmail(details);
  if (result instanceof Error) throw result;
}

export async function sendCrmEmail(details: BookingDetails) {
  'use step';
  console.log(`[reconcile-step:notifications] sendCrmEmail to list=${process.env.PRE_BOOKING_CRM_EMAILS}`);
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_GEELY_PRE_BOOKING_CRM_TEMPLATE_EN
      || !process.env.PRE_BOOKING_CRM_EMAILS) {
    throw new FatalError('CRM email SendGrid configuration is missing');
  }
  const result = await emailService.sendCrmNotificationEmail(details);
  if (result instanceof Error) throw result;
}

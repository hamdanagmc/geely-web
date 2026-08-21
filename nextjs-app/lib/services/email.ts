import { sendEmail } from '@/app/utils/sendgrid';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
} else {
  console.warn('SENDGRID_API_KEY is not set.');
}

const CUSTOMER_TEMPLATE_ID = process.env.SENDGRID_GEELY_PRE_BOOKING_CUSTOMER_TEMPLATE_EN || '';
const CRM_TEMPLATE_ID = process.env.SENDGRID_GEELY_PRE_BOOKING_CRM_TEMPLATE_EN || '';
const CRM_EMAILS = process.env.PRE_BOOKING_CRM_EMAILS || "";

export interface BookingDetails {
  fullName: string;
  email: string;
  mobile: string;
  location: string;
  pageUrl?: string;
  orderReference: string;
  paymentId: string;
  amount: number;
  currency: string;
}

export const emailService = {
  /**
   * Send a booking confirmation email to the customer
   */
  async sendCustomerConfirmationEmail(details: BookingDetails) {
    if (!apiKey) {
      console.warn('Skipping sendCustomerConfirmationEmail: SendGrid API Key missing.');
      return;
    }

    const dynamicTemplateData = {
      vehicleName: details.location,
      referenceNo: details.orderReference,
    }

    if (!CUSTOMER_TEMPLATE_ID) {
      console.warn('SENDGRID_CUSTOMER_TEMPLATE_ID is missing. Falling back to simple text email.');
      return new Error("SENDGRID_CUSTOMER_TEMPLATE_ID is missing");
    }

    try {
      await sendEmail({
        to: details.email,
        templateId: CUSTOMER_TEMPLATE_ID,
        dynamicTemplateData,
      });
      console.log(`Confirmation email sent to ${details.email}`);
    } catch (error) {
      console.error('Error sending customer confirmation email:', error);
      throw new Error('Failed to send customer email');
    }
  },

  /**
   * Send a notification email to the CRM team
   */
  async sendCrmNotificationEmail(details: BookingDetails) {
    if (!apiKey) {
      console.warn('Skipping sendCrmNotificationEmail: SendGrid API Key missing.');
      return;
    }
    let recipients: Array<{ email: string }> | string = CRM_EMAILS
    if (CRM_EMAILS.includes(",")) {
      recipients = CRM_EMAILS.split(",").map((email) => ({ email: email.trim() }));
    }

    const dynamicTemplateData = {
      fname: details.fullName,
      email: details.email,
      phone: details.mobile,
      vehicleType: details.location,
      pageUrl: details.pageUrl || '',
    }

    if (!CRM_TEMPLATE_ID) {
      console.warn('SENDGRID_CRM_TEMPLATE_ID is missing. Falling back to simple text email.');
      return new Error("SENDGRID_CRM_TEMPLATE_ID is missing");
    }

    try {
      await sendEmail({
        to: recipients || "",
        templateId: CRM_TEMPLATE_ID,
        dynamicTemplateData,
      });
      console.log(`CRM notification email sent to ${JSON.stringify(recipients)}`);
    } catch (error) {
      console.error('Error sending CRM notification email:', error);
      throw new Error('Failed to send CRM email');
    }
  },
};

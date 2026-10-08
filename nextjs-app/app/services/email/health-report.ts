"use server"

import { sendEmail } from "@/app/utils/sendgrid";

export async function sendHealthReportEmail(subject: string, text: string) {
    
    console.log("==> sendHealthReportEmail() ", subject, text);
    try {

        const toEmail = process.env.ALERT_EMAIL_TO;
        if (!toEmail) {
            console.log("Server Side Error (CRM Email sending ) : ", "Invalid To Email");
            return { status: false, msg: 'Invalid To Email' };
        }

        const recipients = toEmail
            .split(",")
            .map(email => ({ email: email.trim() }));
        console.log(recipients);

        await sendEmail({
            to: recipients || "",
            templateId: process.env.SENDGRID_HEALTH_REPORT_TEMPLATE_EN ?? "",
            dynamicTemplateData: {
                subject,
                text,
            },
        });
        console.log("CRM Email Sent Success to - " + JSON.stringify(recipients, null, 2));
        return { status: true, msg: 'Email sent successfully' };
    } catch (error: any) {
        console.log("Server Side Error (CRM Email sending ) : ", error.message);
        return { status: false, msg: 'Something went wrong while sending email' };
    }
}
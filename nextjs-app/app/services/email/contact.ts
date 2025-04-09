"use server"
import { sendEmail } from "../../utils/sendgrid";
import { getEmailTemplate } from "./util";

export async function sendContactCustomerEmail(firstName : string, toEmail : string, currentLocale : string, templateName: string) {
    console.log("==> sendContactCustomerEmail() ", firstName, toEmail, currentLocale, templateName);
    try {
        console.log("==> sendContactCustomerEmail() ", firstName, toEmail, currentLocale);
        if (!currentLocale) {
            console.log("Server Side Error (Contact Email sending ) : ", "Invalid locale");
            return { status: false, msg: 'Invalid Locale' };
        }
        if(!toEmail || !firstName) {
            console.log("Server Side Error (Customer Email sending ) : ", "Invalid To Email or Invalid firstname");
            return { status: false, msg: "Invalid To Email or Invalid firstname" };
        }
        await sendEmail({
            to: toEmail || "",
            templateId: getEmailTemplate(currentLocale, templateName) ?? "",
            dynamicTemplateData: {
                firstName,
            },
        });
        console.log("Contact Customer Email Sent Success to - " + toEmail );
        return { status: true, msg: 'Email sent successfully' };
    } catch (error : any) {
        console.log("Server Side Error (Contact Customer Email sending ) : ", error.message);
        return { status: false, msg: 'Something went wrong while sending email' };
    }
}
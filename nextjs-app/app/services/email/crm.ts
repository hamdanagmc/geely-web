"use server"
import { CRMEmailProps } from "@/app/types/common";
import { sendEmail } from "../../utils/sendgrid";

export async function sendCRMEmail(props : CRMEmailProps, currentLocale : string, formType: string, notes: string) {
    console.log("==> sendContactCustomerEmail() ", props, currentLocale, formType);
    try {
        if (!currentLocale) {
            console.log("Server Side Error (CRM Email sending ) : ", "Invalid locale");
            return { status: false, msg: 'Invalid Locale' };
        }
        const toEmail = process.env.SENDGRID_CRM_TO_EMAIL;
        if (!toEmail) {
            console.log("Server Side Error (CRM Email sending ) : ", "Invalid To Email");
            return { status: false, msg: 'Invalid To Email' };
        }
        
        
        await sendEmail({
            to: toEmail || "",
            templateId: (currentLocale === 'en' ? process.env.SENDGRID_CRM_TEMPLATE_EN : process.env.SENDGRID_CRM_TEMPLATE_AR) ?? "",
            dynamicTemplateData: {
                fname : props.fname,
                lname : props.lname,
                email : props.email,
                phone : props.phone,
                formType : formType,
                notes : notes,
            },
        });
        console.log("CRM Email Sent Success to - " + toEmail );
        return { status: true, msg: 'Email sent successfully' };
    } catch (error : any) {
        console.log("Server Side Error (CRM Email sending ) : ", error.message);
        return { status: false, msg: 'Something went wrong while sending email' };
    }
}
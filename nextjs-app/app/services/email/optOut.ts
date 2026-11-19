"use server"
import { OptOutFormFields } from "@/app/types/email";
import { validateCsrfToken } from "@/app/utils/csrf";
import { sendEmail } from "@/app/utils/sendgrid";

export async function sendCRMOptOutEmail(props: OptOutFormFields, currentLocale: string, formType: string, pageUrl: string, csrfToken: string) {
    console.log("==> sendCRMOptOutEmail() ", props, currentLocale, formType);

    // Validate CSRF token
    if (!(await validateCsrfToken(csrfToken))) {
        return {
            status: false,
            message: "Invalid CSRF token",
            data: null,
        };
    }
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
            templateId: process.env.SENDGRID_OPT_OUT_FORM_TEMPLATE_EN ?? "",
            dynamicTemplateData: {
                name: props.name,
                email: props.email,
                phone: props.countrymobileNoCode + props.phone,
                stopMarketing: props.stopMarketing.toUpperCase(),
                formType: formType,
                lang: currentLocale.toUpperCase(),
                pageUrl: pageUrl,
            },
        });
        console.log("CRM Email Sent Success to - " + toEmail);
        return { status: true, msg: 'Email sent successfully' };
    } catch (error: any) {
        console.log("Server Side Error (CRM Email sending ) : ", error.message);
        return { status: false, msg: 'Something went wrong while sending email' };
    }
}
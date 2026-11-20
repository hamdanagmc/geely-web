"use server"
import { ServiceBookingProps } from "@/app/types/email";
import { sendEmail } from "../../utils/sendgrid";

export async function sendCRMServideBookingEmail(props: ServiceBookingProps, currentLocale: string, formType: string, pageUrl: string) {
    console.log("==> sendCRMServideBookingEmail() ", props, currentLocale, formType);
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
            templateId: process.env.SENDGRID_CRM_SERVICE_BOOKING_TEMPLATE_EN ?? "",
            dynamicTemplateData: {
                fname: props.fname,
                email: props.email,
                phone: props.phone,
                vehicleType: props.vehicleType,
                serviceCenter: props.serviceCenter,
                recommendedService: props.recommendedService,
                dateAndTime: props.dateAndTime,
                timeSlot: props.timeSlot,
                appointmentId: props.appointmentId,
                mileage : props?.mileage,
                country : props?.country,
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

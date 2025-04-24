"use server"
import { ContactEmailFields, FleetSalesFormProps, OfferFormProps, RequestQuoteProps, ServiceBookingProps } from "@/app/types/email";
import { sendEmail } from "../../utils/sendgrid";

export async function sendCRMContactEmail(props: ContactEmailFields, currentLocale: string, formType: string, pageUrl: string) {
    console.log("==> sendCRMContactEmail() ", props, currentLocale, formType);
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
            templateId: process.env.SENDGRID_CRM_CONTACT_TEMPLATE_EN ?? "",
            dynamicTemplateData: {
                title: props.title,
                fname: props.fname,
                lname: props.lname,
                email: props.email,
                phone: props.countrymobileNoCode + props.phone,
                type: props.type,
                location: props.location,
                comments: props.comments,
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

export async function sendCRMRequestQuoteEmail(props: RequestQuoteProps, currentLocale: string, formType: string, pageUrl: string) {
    console.log("==> sendCRMRequestQuoteEmail() ", props, currentLocale, formType);
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
            templateId: process.env.SENDGRID_CRM_REQUEST_QUOTE_TEMPLATE_EN ?? "",
            dynamicTemplateData: {
                title: props.title,
                fname: props.fname,
                lname: props.lname,
                email: props.email,
                phone: props.countrymobileNoCode + props.phone,
                make: props.carTypes.toString(),
                model: props.selectedModelTitle,
                location: props.location,
                comments: props.comments,
                formType,
                lang: currentLocale.toUpperCase(),
                pageUrl,
            },
        });
        console.log("CRM Email Sent Success to - " + toEmail);
        return { status: true, msg: 'Email sent successfully' };
    } catch (error: any) {
        console.log("Server Side Error (CRM Email sending ) : ", error.message);
        return { status: false, msg: 'Something went wrong while sending email' };
    }
}
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
                title: props.title,
                fname: props.fname,
                lname: props.lname,
                email: props.email,
                phone: props.countrymobileNoCode + props.phone,
                vehicleType: props.vehicleType,
                modelYear: props.modelYear.toString(),
                serviceCenter: props.serviceCenter,
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

export async function sendCRMFleetSalesEmail(props: FleetSalesFormProps, currentLocale: string, formType: string, pageUrl: string) {
    console.log("==> sendCRMFleetSalesEmail() ", props, currentLocale, formType);
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
            templateId: process.env.SENDGRID_CRM_FLEET_SALES_TEMPLATE_EN ?? "",
            dynamicTemplateData: {
                title: props.title,
                fname: props.fname,
                lname: props.lname,
                email: props.email,
                phone: props.countrymobileNoCode + props.phone,
                fleetSize: props.fleetSize,
                comments: props.comments,
                companyName: props.companyName,
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

export async function sendCRMOfferEmail(props: OfferFormProps, currentLocale: string, formType: string, pageUrl: string) {
    console.log("==> sendCRMOfferEmail() ", props, currentLocale, formType);
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
            templateId: process.env.SENDGRID_CRM_OFFER_TEMPLATE_EN ?? "",
            dynamicTemplateData: {
                title: props.title,
                fname: props.firstName,
                lname: props.lastName,
                email: props.email,
                phone: props.phoneNo,
                vehicle: props.vehicle,
                location: props.location,
                comments: props.comment,
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

export async function sendCRMBrochureEmail(props: BrochureFormProps, currentLocale: string, formType: string, pageUrl: string) {
    console.log("==> sendCRMBrochureEmail() ", props, currentLocale, formType);
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
            templateId: process.env.SENDGRID_CRM_BROCHURE_FORM_TEMPLATE_EN ?? "",
            dynamicTemplateData: {
                title: props.title,
                fname: props.fname,
                lname: props.lname,
                email: props.email,
                phone: props.countrymobileNoCode + props.phone,
                contactYou: props.contactYou,
                selectedVehicles: props.brochure_check.toString(),
                comments: props.comments,
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

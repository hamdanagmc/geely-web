"use server"

import { CommonResponse } from "@/app/types/common";
import { validateCsrfToken } from "@/app/utils/csrf";
import verifyRecaptcha from "@/app/utils/recaptcha";
import axios from 'axios';

const API_KEY = process.env.KEYLOOP_API_KEY;
const BRANCH_ID = process.env.KEYLOOP_BRANCH_ID;
const ENDPOINT_URL = process.env.KEYLOOP_ENDPOINT_URL;


export async function saveServiceBookingForm(data: ServiceBookingFormPayload, csrfToken: string, recaptchaToken: string, currentLocale : string): Promise<CommonResponse> {

    const recaptchaResponse = await verifyRecaptcha(recaptchaToken);
    console.log(recaptchaResponse)
    if (!recaptchaResponse.status) {
        console.log("Recaptcha verification failed");
        return {
            status: false,
            message: "Recaptcha verification failed",
            data: null,
        };
    }
    console.log("Recaptcha verified successfully");

    // Validate CSRF token
    if (!(await validateCsrfToken(csrfToken))) {
        return {
            status: false,
            message: "Invalid CSRF token",
            data: null,
        };
    }

    //keyloop Logic

    var payload = JSON.stringify({
        "enquiry": {
            "apikey": API_KEY,
            "lead": {
                "origin": `Geely Service Booking - ${currentLocale.toUpperCase()}`,
                "source": "WEBENQUIRY",
                "branch": BRANCH_ID,
                "idnumber": "",
                "allocate": ""
            },
            "contact": {
                "title": data.title,
                "firstname": data.fname,
                "surname": data.lname,
                "email": data.email,
                "phone": `${data.countrymobileNoCode} ${data.phone}`,
                "mobile": `${data.countrymobileNoCode} ${data.phone}`,
                "source": ""
            },
            "seeks": {
                "newused": "NEW",
                "make": "",
                "model": "",
                "stocknumber": "",
                "regnumber": "",
                "notes": `VehicleType : ${data.vehicleType}, Model Year : ${data.modelYear}, Service Center : ${data.serviceCenter}`
            },
            "tradein": {
                "registration": "",
                "make": "",
                "model": "",
                "mileage": "",
                "year": "",
                "notes": ""
            },
            "mkagree": {
                "updatemkagree": "true",
                "dealersms": false,
                "dealeremail": false,
                "dealerletter": false,
                "dealerphone": false,
                "partssms": false,
                "partsemail": false,
                "partsletter": false,
                "partsphone": false,
                "salessms": false,
                "salesemail": false,
                "salesletter": false,
                "salesphone": false,
                "servicesms": false,
                "serviceemail": false,
                "serviceletter": false,
                "servicephone": false
            }
        }
    });
    console.log("Payload", payload)
    var config = {
        method: 'post',
        url: ENDPOINT_URL,
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'BIGipServer~gb_dmz~app-r1.cdkglobalonline.com_pool=352940132.20480.0000'
        },
        data: payload
    };

    var response: KeyloopResponse;
    try {
        const axiosResponse = await axios(config);
        console.log(JSON.stringify(axiosResponse.data));
        response = axiosResponse.data as KeyloopResponse;
        console.log("Keyloop API Respnse : ", response);
        if(response.InboundEnquiryResponse.status !== "1") {
            return {
                status: false,
                message: "Failed to submit keyloop service booking form",
                data: response,
            }
        }
        return {
            status: true,
            message: "Service Booking form submitted successfully",
            data: response,
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: "Failed to submit service booking form",
            data: null,
        };
    }
}
"use server"
import { CommonResponse } from "@/app/types/common";
import axios from "axios";
import { SERVICE_BOOKING_API_URL, SERVICE_BOOKING_TENANT_ID } from "./api";
import { getStoredToken, storeToken } from "./tokenHelper";

export async function generateToken(): Promise<CommonResponse> {
    console.log("Checking for stored token in cookies...");
    const storedToken = await getStoredToken();
    if (storedToken) {
        return {
            status: true,
            message: "Token retrieved from cookies",
            data: { token: storedToken },
        };
    }
    console.log(`generating basic auth using ${process.env.SERVICE_BOOKING_API_KEY} and ${process.env.SERVICE_BOOKING_API_SECRET}`);
    const auth = Buffer.from(
        `${process.env.SERVICE_BOOKING_API_KEY}:${process.env.SERVICE_BOOKING_API_SECRET}`
    ).toString('base64');

    
    var config = {
        method: 'get',
        url: `${SERVICE_BOOKING_API_URL}/api/leads/generate-token/${SERVICE_BOOKING_TENANT_ID}`,
        headers: {
            Authorization: `Basic ${auth}`,
        },
    };
    console.log(`Requesting new token with config: ${JSON.stringify(config)}`);
    try {
        const axiosResponse = await axios(config);
        var response = axiosResponse.data;
        console.log("generateToken() API Response : ", response);

        if (response && response.token) {

            const expiresInMinutes = process.env.SERVICE_BOOKING_AUTHORIZATION_TOKEN_EXPIRES_IN_MINUTES;
            if(!expiresInMinutes || isNaN(Number(expiresInMinutes)) || Number(expiresInMinutes) <= 0) {
                console.log("Missing SERVICE_BOOKING_AUTHORIZATION_TOKEN_EXPIRES_IN_MINUTES env variable or invalid value, defaulting it to not store token in cookies.");
            } else {
                const expiresAt =
                    response.expires_at ||
                    new Date(Date.now() + parseInt(expiresInMinutes) * 60 * 1000).toISOString();
                await storeToken(response.token, expiresAt);
            }
            return {
                status: true,
                message: "Token fetched and stored successfully",
                data: response,
            }
        }
      
        return {
            status: false,
            message: "Invalid token response from API",
            data: response,
        }
    } catch (error) {
        console.error("generateToken() Error: ", error);
        return {
            status: false,
            message: "Failed to generate token",
            data: null,
        };
    }
}

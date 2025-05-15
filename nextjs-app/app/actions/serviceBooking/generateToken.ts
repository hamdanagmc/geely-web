"use server"
import { CommonResponse } from "@/app/types/common";
import axios from "axios";
import { SERVICE_BOOKING_API_URL, SERVICE_BOOKING_TENANT_ID } from "./api";

export async function generateToken() : Promise<CommonResponse>{
    var config = {
        method: 'get',
        url: `${SERVICE_BOOKING_API_URL}/api/leads/generate-token/${SERVICE_BOOKING_TENANT_ID}`,
    };

    try {
        const axiosResponse = await axios(config);
        var response = axiosResponse.data;
        console.log("generateToken() API Response : ", response);  
        return {
            status: true,
            message: "Token fetched successfully",
            data: response,
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: "Failed to submit brochure form",
            data: null,
        };
    }

}
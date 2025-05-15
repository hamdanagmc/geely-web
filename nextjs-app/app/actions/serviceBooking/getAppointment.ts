"use server";
import axios from 'axios';
import { SERVICE_BOOKING_API_TOKEN, SERVICE_BOOKING_API_URL } from './api';
import { CommonResponse } from '@/app/types/common';

export async function getAppointment(regNumber: string, locale: string): Promise<CommonResponse> {
    if (!regNumber) {
        throw new Error("Invalid parameter: 'regNumber' is required.");
    }
    if (!locale) {
        throw new Error("Invalid parameter: 'locale' is required.");
    }

    const url = `${SERVICE_BOOKING_API_URL}/api/service/appointments`;
    const config = {
        method: 'get',
        url,
        headers: {
            'Authorization': SERVICE_BOOKING_API_TOKEN,
            'x-l10n-locale': locale,
        },
        params: { regNumber },
    };

    try {
        const response = await axios(config);
        console.log("getAppointment() API Response : ", response.data);
        return {
            status: true,
            message: "Appointment fetched successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('Error fetching appointment:', error);
        throw new Error('Failed to fetch appointment.');
    }
}
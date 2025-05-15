"use server";
import axios from 'axios';
import { SERVICE_BOOKING_API_TOKEN, SERVICE_BOOKING_API_URL } from './api';
import { CommonResponse } from '@/app/types/common';

export async function getServiceLocations(locale : string): Promise<CommonResponse> {
    if (!locale) {
        throw new Error("Invalid parameter: 'locale' is required.");
    }
    const url = `${SERVICE_BOOKING_API_URL}/api/service-locations`;
    const config = {
        method: 'get',
        url,
        headers: {
            'Authorization': SERVICE_BOOKING_API_TOKEN,
            'x-l10n-locale': locale,
        },
        params: { type: 'workshop' },
    };

    try {
        const response = await axios(config);
        console.log("getServiceLocations() API Response : ", response.data);
        return {
            status: true,
            message: "Service locations fetched successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('Error fetching service locations:', error);
        throw new Error('Failed to fetch service locations.');
    }
}
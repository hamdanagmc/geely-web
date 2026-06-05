"use server";
import axios from 'axios';
import { getAuthToken, SERVICE_BOOKING_API_URL } from './api';
import { CommonResponse } from '@/app/types/common';

export async function getRecommendedServices(locale: string): Promise<CommonResponse> {
    if (!locale) {
        throw new Error("Invalid parameter: 'locale' is required.");
    }
    const url = `${SERVICE_BOOKING_API_URL}/api/service/recommended-services`;
    const apiToken = await getAuthToken();
    const config = {
        method: 'get',
        url,
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'x-l10n-locale': locale,
        },
        params: { type: 'workshop' },
    };

    try {
        const response = await axios(config);
        console.log("getRecommendedServices() API Response : ", response.data);
        return {
            status: true,
            message: "Recommended services fetched successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('Error fetching recommended services:', error);
        throw new Error('Failed to fetch recommended services.');
    }
}
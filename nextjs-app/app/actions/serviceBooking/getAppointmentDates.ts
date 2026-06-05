"use server";
import axios from 'axios';
import { getAuthToken, SERVICE_BOOKING_API_URL } from './api';
import { CommonResponse } from '@/app/types/common';
import { AppointmentDatesPayload } from './types';

function validateAppointmentDatesPayload(payload: AppointmentDatesPayload): void {
    const { dealershipLocationId, make, serviceProductIds } = payload;

    if (!dealershipLocationId || typeof dealershipLocationId !== 'number') {
        throw new Error("Invalid parameter: 'dealershipLocationId' must be a number.");
    }
    if (!make || typeof make !== 'string') {
        throw new Error("Invalid parameter: 'make' must be a string.");
    }
    if (!serviceProductIds || !Array.isArray(serviceProductIds) || serviceProductIds.length === 0) {
        throw new Error("Invalid parameter: 'serviceProductIds' must be a non-empty array of strings.");
    }
}

export async function getAppointmentDates(payload: AppointmentDatesPayload): Promise<CommonResponse> {
    console.log("getAppointmentDates() API Payload : ", payload);
    validateAppointmentDatesPayload(payload);

    const url = `${SERVICE_BOOKING_API_URL}/api/service/appointment-dates`;
    const apiToken = await getAuthToken();
    const config = {
        method: 'post',
        url,
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
        },
        data: payload,
    };

    try {
        const response = await axios(config);
        console.log("getAppointmentDates() API Response : ", response.data);
        return {
            status: true,
            message: "Appointment dates fetched successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('Error fetching appointment dates:', error);
        throw new Error('Failed to fetch appointment dates.');
    }
}
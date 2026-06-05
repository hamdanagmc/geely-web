"use server";
import axios from 'axios';
import { getAuthToken, SERVICE_BOOKING_API_URL } from './api';
import { CommonResponse } from '@/app/types/common';
import { AppointmentTimeSlotsPayload } from './types';

function validateAppointmentTimeSlotsPayload(payload: AppointmentTimeSlotsPayload): void {
    const { selectedDate, dealershipLocationId, make, serviceProductIds } = payload;

    if (!selectedDate || typeof selectedDate !== 'string') {
        throw new Error("Invalid parameter: 'selectedDate' must be a string.");
    }
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

export async function getAppointmentTimeSlots(payload: AppointmentTimeSlotsPayload): Promise<CommonResponse> {
    console.log("getAppointmentTimeSlots() API Payload : ", payload);
    validateAppointmentTimeSlotsPayload(payload);

    const url = `${SERVICE_BOOKING_API_URL}/api/service/appointment-time`;
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
        console.log("getAppointmentTimeSlots() API Response : ", response.data);
        return {
            status: true,
            message: "Appointment time slots fetched successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('Error fetching appointment time slots:', error);
        throw new Error('Failed to fetch appointment time slots.');
    }
}
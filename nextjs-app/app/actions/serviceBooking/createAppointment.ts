import axios from 'axios';
import { SERVICE_BOOKING_API_TOKEN, SERVICE_BOOKING_API_URL } from './api';
import { CommonResponse } from '@/app/types/common';
import { CreateAppointmentPayload } from './types';

"use server";

function validateCreateAppointmentPayload(payload: CreateAppointmentPayload): void {
    const { dealershipLocationId, dropOffTime, licensePlateNo, mileage, serviceProductIds, startDate, vehicleId } = payload;

    if (!dealershipLocationId || typeof dealershipLocationId !== 'number') {
        throw new Error("Invalid parameter: 'dealershipLocationId' must be a number.");
    }
    if (!dropOffTime || typeof dropOffTime !== 'string') {
        throw new Error("Invalid parameter: 'dropOffTime' must be a string.");
    }
    if (!licensePlateNo || typeof licensePlateNo !== 'string') {
        throw new Error("Invalid parameter: 'licensePlateNo' must be a string.");
    }
    if (!mileage || typeof mileage !== 'number') {
        throw new Error("Invalid parameter: 'mileage' must be a number.");
    }
    if (!serviceProductIds || !Array.isArray(serviceProductIds) || serviceProductIds.length === 0) {
        throw new Error("Invalid parameter: 'serviceProductIds' must be a non-empty array of strings.");
    }
    if (!startDate || typeof startDate !== 'string') {
        throw new Error("Invalid parameter: 'startDate' must be a string.");
    }
    if (!vehicleId || typeof vehicleId !== 'number') {
        throw new Error("Invalid parameter: 'vehicleId' must be a number.");
    }
}

export async function createAppointment(payload: CreateAppointmentPayload): Promise<CommonResponse> {
    console.log("createAppointment() API Payload : ", payload);
    validateCreateAppointmentPayload(payload);

    const url = `${SERVICE_BOOKING_API_URL}/api/service`;
    const config = {
        method: 'post',
        url,
        headers: {
            'Authorization': SERVICE_BOOKING_API_TOKEN,
            'Content-Type': 'application/json',
        },
        data: payload,
    };

    try {
        const response = await axios(config);
        console.log("createAppointment() API Response : ", response.data);
        return {
            status: true,
            message: "Appointment created successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw new Error('Failed to create appointment.');
    }
}
"use server";
import axios from 'axios';
import { SERVICE_BOOKING_API_TOKEN, SERVICE_BOOKING_API_URL } from './api';
import { CommonResponse } from '@/app/types/common';
import { CreateAppointmentPayload } from './types';

function validateCreateAppointmentPayload(payload: CreateAppointmentPayload): string[] {
    const errors: string[] = [];
    const { dealershipLocationId, dropOffTime, licensePlateNo, mileage, serviceProductIds, startDate, vehicleId } = payload;

    if (!dealershipLocationId || typeof dealershipLocationId !== 'number') {
        errors.push("Invalid parameter: 'dealershipLocationId' must be a number.");
    }
    if (!dropOffTime || typeof dropOffTime !== 'string') {
        errors.push("Invalid parameter: 'dropOffTime' must be a string.");
    }
    if (!licensePlateNo || typeof licensePlateNo !== 'string') {
        errors.push("Invalid parameter: 'licensePlateNo' must be a string.");
    }
    if (!mileage || typeof mileage !== 'number') {
        errors.push("Invalid parameter: 'mileage' must be a number.");
    }
    if (!serviceProductIds || !Array.isArray(serviceProductIds) || serviceProductIds.length === 0) {
        errors.push("Invalid parameter: 'serviceProductIds' must be a non-empty array of strings.");
    }
    if (!startDate || typeof startDate !== 'string') {
        errors.push("Invalid parameter: 'startDate' must be a string.");
    }
    if (!vehicleId || typeof vehicleId !== 'number') {
        errors.push("Invalid parameter: 'vehicleId' must be a number.");
    }

    return errors;
}

export async function createAppointment(payload: CreateAppointmentPayload): Promise<CommonResponse> {
    console.log("createAppointment() API Payload : ", payload);
    const errors = validateCreateAppointmentPayload(payload);
    if (errors.length > 0) {
        console.error("createAppointment() API Validation Errors: ", errors.join(", "));
        return {
            status: false,
            message: "Validation failed: " + errors.join(", "),
            data: errors,
        };
    }

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
        return {
            status: false,
            message: "Failed to create appointment" + (error instanceof Error ? `: ${error.message}` : ''),
            data: null,
        };
    }
}
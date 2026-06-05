"use server";
import axios from 'axios';
import { getAuthToken, SERVICE_BOOKING_API_URL } from './api';
import { CommonResponse } from '@/app/types/common';

export async function deleteAppointment(appointmentId: string): Promise<CommonResponse> {
    if (!appointmentId) {
        throw new Error("Invalid parameter: 'appointmentId' is required.");
    }

    const url = `${SERVICE_BOOKING_API_URL}/api/service/appointments`;
    const apiToken = await getAuthToken();
    const config = {
        method: 'delete',
        url,
        headers: {
            'Authorization': `Bearer ${apiToken}`,
        },
        params: { appointmentId },
    };

    try {
        const response = await axios(config);
        console.log("deleteAppointment() API Response : ", response.data);
        return {
            status: true,
            message: "Appointment deleted successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('Error deleting appointment:', error);
        throw new Error('Failed to delete appointment.');
    }
}
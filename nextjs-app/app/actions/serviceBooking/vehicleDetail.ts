"use server"
import axios from 'axios';
import { SERVICE_BOOKING_API_TOKEN, SERVICE_BOOKING_API_URL } from './api';
import { CommonResponse } from '@/app/types/common';

export async function getVehicleDetailByVin(vin: string): Promise<CommonResponse> {
    if (!vin) {
        throw new Error("Invalid parameter: 'vin' is required.");
    }

    const url = `${SERVICE_BOOKING_API_URL}/api/service/vehicle-details`;
    const config = {
        method: 'get',
        url,
        headers: {
            'Authorization': SERVICE_BOOKING_API_TOKEN,
        },
        params: { vin },
    };

    try {
        const response = await axios(config);
        console.log("getVehicleDetailByVin() API Response : ", response.data);
        return {
            status: true,
            message: "Vehicle details fetched successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('Error fetching vehicle details by VIN:', error);
        throw new Error('Failed to fetch vehicle details by VIN.');
    }
}

export async function getVehicleDetailByVehicleNumber(vehicleNumber: string): Promise<CommonResponse> {
    if (!vehicleNumber) {
        throw new Error("Invalid parameter: 'vehicleNumber' is required.");
    }

    const url = `${SERVICE_BOOKING_API_URL}/api/service/vehicle-details`;
    const config = {
        method: 'get',
        url,
        headers: {
            'Authorization': '43a33e25408884bc600652d8',
        },
        params: { vehicleNumber },
    };

    try {
        const response = await axios(config);
        console.log("getVehicleDetailByVehicleNumber() API Response : ", response.data);
        return {
            status: true,
            message: "Vehicle details fetched successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('Error fetching vehicle details by vehicle number:', error);
        throw new Error('Failed to fetch vehicle details by vehicle number.');
    }
}
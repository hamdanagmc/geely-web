"use server"

import axios from 'axios';
import { SERVICE_BOOKING_API_TOKEN, SERVICE_BOOKING_API_URL } from './api';
import { CommonResponse } from '@/app/types/common';

export async function findCustomerByName(name: string): Promise<CommonResponse> {
    if (!name) {
        throw new Error("Invalid parameter: 'name' is required.");
    }

    const url = `${SERVICE_BOOKING_API_URL}/api/service/find-customer`;
    const config = {
        method: 'get',
        url,
        headers: {
            'Authorization': SERVICE_BOOKING_API_TOKEN,
        },
        params: { givenName: name },
    };

    try {
        const response = await axios(config);
        console.log("findCustomerByName() API Response : ", response.data);
        return {
            status: true,
            message: "Customer details fetched successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('Error fetching customer details by name:', error);
        throw new Error('Failed to fetch customer details by name.');
    }
}

export async function findCustomerByPhone(phone: string): Promise<CommonResponse> {
    if (!phone) {
        throw new Error("Invalid parameter: 'phone' is required.");
    }

    const url = `${SERVICE_BOOKING_API_URL}/api/service/find-customer`;
    const config = {
        method: 'get',
        url,
        headers: {
            'Authorization': '43a33e25408884bc600652d8',
        },
        params: { phone },
    };

    try {
        const response = await axios(config);
        console.log("findCustomerByPhone() API Response : ", response.data);
        return {
            status: true,
            message: "Customer details fetched successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('Error fetching customer details by phone:', error);
        throw new Error('Failed to fetch customer details by phone.');
    }
}

export async function findCustomerByEmail(email: string): Promise<CommonResponse> {
    if (!email) {
        throw new Error("Invalid parameter: 'email' is required.");
    }

    const url = `${SERVICE_BOOKING_API_URL}/api/service/find-customer`;
    const config = {
        method: 'get',
        url,
        headers: {
            'Authorization': '43a33e25408884bc600652d8',
        },
        params: { email },
    };

    try {
        const response = await axios(config);
        console.log("findCustomerByEmail() API Response : ", response.data);
        return {
            status: true,
            message: "Customer details fetched successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('Error fetching customer details by email:', error);
        throw new Error('Failed to fetch customer details by email.');
    }
}
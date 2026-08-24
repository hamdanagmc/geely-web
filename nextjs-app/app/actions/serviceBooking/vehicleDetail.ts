"use server";

import axios, { AxiosError } from 'axios';
import { getAuthToken, SERVICE_BOOKING_API_URL } from './api';
import { CommonResponse } from '@/app/types/common';

/**
 * Shared function to make GET request for vehicle details.
 */
const fetchVehicleDetails = async (params: Record<string, string>): Promise<CommonResponse> => {
  const url = `${SERVICE_BOOKING_API_URL}/api/service/vehicle-details`;

  const apiToken = await getAuthToken();
  const config = {
    method: 'get',
    url,
    headers: {
      'Authorization': `Bearer ${apiToken}`,
    },
    params,
  };

  try {
    console.log("Vehicle Details API Config:", config);
    const response = await axios(config);
    console.log("Vehicle Details API Response:", response.data);

    return {
      status: true,
      message: "Vehicle details fetched successfully",
      data: response.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log('Axios Error:', {
      message: axiosError.message,
      code: axiosError.code,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    });
  
    return {
      status: false,
      message: `Failed to fetch vehicle details: ${axiosError.response?.status} - ${axiosError.message}`,
      data: null,
    };
  }
  
};

/**
 * Fetch vehicle details by VIN number.
 */
export async function getVehicleDetailByVin(vin: string): Promise<CommonResponse> {
  if (!vin) {
    throw new Error("Invalid parameter: 'vin' is required.");
  }

  return fetchVehicleDetails({ vin });
}

/**
 * Fetch vehicle details by vehicle number (plate).
 */
export async function getVehicleDetailByVehicleNumber(vehicleNumber: string): Promise<CommonResponse> {
  if (!vehicleNumber) {
    throw new Error("Invalid parameter: 'vehicleNumber' is required.");
  }

  return fetchVehicleDetails({ vehicleNumber });
}

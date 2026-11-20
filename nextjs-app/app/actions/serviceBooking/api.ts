import "server-only";
import { generateToken } from "./generateToken";

export const SERVICE_BOOKING_API_URL = process.env.SERVICE_BOOKING_BASE_URL;
export const SERVICE_BOOKING_TENANT_ID = process.env.SERVICE_BOOKING_TENANT_ID;
export const SERVICE_BOOKING_API_TOKEN = process.env.SERVICE_BOOKING_API_TOKEN;

/**
 * Retrieves a valid auth token (from cookie or API).
 * @returns The token string.
 */
export async function getAuthToken(): Promise<string> {
    // Checked here, not at module load, so a missing var only breaks service booking, not every page.
    if (!SERVICE_BOOKING_API_URL || !SERVICE_BOOKING_TENANT_ID ) {
        console.error("Missing environment variables for Service Booking API");
        throw new Error("Missing environment variables for Service Booking API");
    }
    const response = await generateToken();
    if (response.status && response.data?.token) {
        return response.data.token;
    }
    
    console.warn("Failed to get dynamic token returning empty string. ");
    return "";
}

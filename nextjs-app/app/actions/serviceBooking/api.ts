import "server-only";

export const SERVICE_BOOKING_API_URL = process.env.SERVICE_BOOKING_BASE_URL;
export const SERVICE_BOOKING_TENANT_ID = process.env.SERVICE_BOOKING_TENANT_ID;
export const SERVICE_BOOKING_API_TOKEN = process.env.SERVICE_BOOKING_API_TOKEN;

if (!SERVICE_BOOKING_API_URL || !SERVICE_BOOKING_TENANT_ID || !SERVICE_BOOKING_API_TOKEN) {
    console.error("Missing environment variables for Service Booking API");
    throw new Error("Missing environment variables for Service Booking API");
}
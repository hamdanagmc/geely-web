"use server";

import { cookies } from "next/headers";
import { encryptToken, decryptToken } from "@/app/utils/encryption";

const TOKEN_COOKIE_NAME = "_sbt";

/**
 * Retrieves the token from the encrypted cookie and checks for expiry.
 * @returns The decrypted token if valid and not expired, otherwise null.
 */
export async function getStoredToken(): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        const encryptedToken = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

        if (!encryptedToken) {
            console.log("No token found in cookies.");
            return null;
        }

        const decryptedData = await decryptToken(encryptedToken);
        const { token, expiresAt } = JSON.parse(decryptedData);
        
        const expiryTime = new Date(expiresAt).getTime();
        const currentTime = Date.now();
        const buffer = 60000; // 1 minute buffer

        if (isNaN(expiryTime)) {
            console.error("Invalid expiry date format in stored token:", expiresAt);
            return null;
        }

        console.log(`Checking token expiry: Expiry=${new Date(expiryTime).toISOString()}, Now=${new Date(currentTime).toISOString()}`);

        if (expiryTime > currentTime + buffer) {
            return token;
        }
        
        console.log(`Stored token has expired or is about to expire. (Expiry: ${expiresAt})`);
    } catch (error) {
        console.error("Error retrieving or decrypting stored token:", error);
    }

    return null;
}

/**
 * Encrypts and stores the token in a secure cookie.
 * @param token The token string to store.
 * @param expiresAt The ISO date string or timestamp when the token expires.
 */
export async function storeToken(token: string, expiresAt: string) {
    try {
        const cookieStore = await cookies();
        const tokenData = JSON.stringify({ token, expiresAt });
        const encrypted = await encryptToken(tokenData);

        // Set cookie with the same expiry as the token
        let expiryDate = new Date(expiresAt);
        
        if (isNaN(expiryDate.getTime())) {
            console.error("Attempted to store token with invalid expiry date:", expiresAt);
            // Default to 5 minutes if invalid
            expiryDate = new Date(Date.now() + 5 * 60 * 1000);
            expiresAt = expiryDate.toISOString();
        }

        console.log(`Storing token in cookie. Expires at: ${expiryDate.toISOString()}`);
        
        cookieStore.set(TOKEN_COOKIE_NAME, encrypted, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: expiryDate,
        });
    } catch (error) {
        console.error("Error storing token in cookie (This usually happens if called during server-side rendering):", error);
    }
}

"use server";
import { getPromoCodes } from "../common/sanityData";

export async function validatePromoCode(promoCode: string): Promise<String > {
    try {
        const response = await getPromoCodes();
        if (response.codes.length === 0) {
            return "No promo codes available! Contact support for more info.";
        }
        const allCodes = response.codes as string[];
        const lowerCaseCodes = allCodes.map(code => code.toLowerCase());
        if (!lowerCaseCodes.includes(promoCode.toLowerCase())) {
            return "Invalid promo code";
        }
        return "Success! Promo code applied.";
    }
    catch (error) {
        console.error("Error validating promo code:", error);
        return "An error occurred while validating the promo code. Please try again later.";
    }
}
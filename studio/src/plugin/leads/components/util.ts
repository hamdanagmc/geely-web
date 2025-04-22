import { Lead } from "./LeadsTool";
export type FilterProps = {
    locations: string[];
    vehicleModels: string[];
    pageUrls: string[];
}
export function getLeadFilters(leads: Lead[]): FilterProps {
    const uniqueLocations = new Set();
    const uniqueVehicleModels = new Set();
    const uniquePageUrls = new Set();

    leads.forEach((lead) => {
        // Location
        if (lead.location && lead.location.trim() !== "") {
            uniqueLocations.add(lead.location.trim());
        }

        // Vehicle Models (may be comma-separated)
        if (lead.vehicleModel && lead.vehicleModel.trim() !== "") {
            lead.vehicleModel.split(",").forEach((model) => {
                if (model.trim()) {
                    uniqueVehicleModels.add(model.trim());
                }
            });
        }

        // Page URLs (strip query params)
        if (lead.pageUrl && lead.pageUrl.trim() !== "") {
            try {
                const url = new URL(lead.pageUrl);
                const cleanUrl = `${url.origin}${url.pathname}`;
                uniquePageUrls.add(cleanUrl);
            } catch (err) {
                console.warn("Invalid URL:", lead.pageUrl);
            }
        }
    });

    // Convert Sets to Arrays
    const locations = [...uniqueLocations];
    const vehicleModels = [...uniqueVehicleModels];
    const pageUrls = [...uniquePageUrls];

    return {
        locations,
        vehicleModels,
        pageUrls,
    } as FilterProps;
}
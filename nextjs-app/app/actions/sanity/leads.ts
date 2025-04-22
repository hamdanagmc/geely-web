"use server"
import { client } from "@/sanity/lib/client";
import { API_TOKEN } from "@/sanity/lib/token";
import { CommonResponse, LeadProps } from "@/app/types/common";

const sanityClient = client.withConfig({ token: API_TOKEN })

export async function saveLeads(props: LeadProps): Promise<CommonResponse> {
    console.log("Saving lead data to Sanity:", props);
    const mutations = [
        {
            create: {
                _type: 'lead',
                title: props.title,
                firstName: props.firstName,
                lastName: props.lastName,
                email: props.email,
                phone: props.phone,
                fleetSize: props.fleetSize,
                companyName: props.companyName,
                comments: props.comments,
                formType: props.formType,
                vehicleMake: props.vehicleMake,
                vehicleModel: props.vehicleModel,
                location: props.location,
                modelYear: props.modelYear,
                serviceCenter: props.serviceCenter,
                type: props.type,
                contactYou: props.contactYou,
                pageUrl: props.pageUrl,
            },
        },
    ];

    try {
        // Send the mutation to the Sanity client
        const data = await sanityClient.create(mutations[0].create);

        if (!data) {
            return { status: false, message: 'Something went wrong in saving lead data', data: null }
        }

        console.log("Server Response: Lead Data saved to Sanity");
        return { status: true, message: "Success", data: data };

    } catch (error) {
        console.error("Error saving Lead data to Sanity:", error);
        return { status: false, message: "Failed to save Rent document.", data: null };
    }
}

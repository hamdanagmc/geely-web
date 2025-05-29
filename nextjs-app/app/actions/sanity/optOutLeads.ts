"use server"
import { client } from "@/sanity/lib/client";
import { API_TOKEN } from "@/sanity/lib/token";
import { CommonResponse, OptOutLeadProps } from "@/app/types/common";

const sanityClient = client.withConfig({ token: API_TOKEN })

export async function saveOptOutLeads(props: OptOutLeadProps): Promise<CommonResponse> {
    console.log("Saving Opt Out lead data to Sanity:", props);
    const mutations = [
        {
            create: {
                _type: 'optOutLead',
                name: props.name,
                email: props.email,
                phone: props.phone,
                stopMarketing: props.stopMarketing,
            },
        },
    ];

    try {
        // Send the mutation to the Sanity client
        const data = await sanityClient.create(mutations[0].create);

        if (!data) {
            return { status: false, message: 'Something went wrong in saving lead data', data: null }
        }

        console.log("Server Response: Opt Out Lead Data saved to Sanity");
        return { status: true, message: "Success", data: data };

    } catch (error) {
        console.error("Error saving Opt Out Lead data to Sanity:", error);
        return { status: false, message: "Failed to save Opt Out Lead document.", data: null };
    }
}

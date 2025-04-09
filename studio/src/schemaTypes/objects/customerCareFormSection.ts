import { defineField, defineType } from "sanity";


export const customerCareFormSection = defineType({
    name: "customerCareFormSection",
    title: "Customer Care Form Section",
    type: "object",
    fields: [
        defineField({
            name: 'nameLabel',
            type: 'string',
            title: 'Name Label',
        }),
        defineField({
            name: 'namePlaceholder',
            type: 'string',
            title: 'Name Placeholder',
        }),
        defineField({
            name: "emailLabel",
            type: "string",
            title: "Email Label",
        }),
        defineField({
            name: "emailPlaceholder",
            type: "string",
            title: "Email Placeholder",
        }),
        defineField({
            name: "phoneLabel",
            type: "string",
            title: "Phone Number Label",
        }),
        defineField({
            name: "phonePlaceholder",
            type: "string",
            title: "Phone Number Placeholder",
        }),
        defineField({
            name: "complaintTypeLabel",
            type: "string",
            title: "Complaint Type Label",
        }),
        defineField({
            name: "complaintTypes",
            type: "array",
            title: "Complaint Types",
            of: [{ type: "string" }],
        }),
        defineField({
            name: "complaintLabel",
            type: "string",
            title: "Complaint Label",
        }),
        defineField({
            name: "complaintPlaceholder",
            type: "string",
            title: "Complaint Placeholder",
        }),
        defineField({
            name: "submitButtonLabel",
            type: "string",
            title: "Submit Button Label",
        }),
    ],
});
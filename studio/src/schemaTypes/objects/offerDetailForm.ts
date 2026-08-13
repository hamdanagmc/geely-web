import { defineField, defineType } from "sanity";

export const offerDetailForm = defineType({
    name: "offerDetailForm",
    title: "Offer Detail Form",
    type: "object",
    fields: [
        
        defineField({
            name: "titlePlaceholder",
            type: "string",
            title: "Title Placeholder",
        }),
        defineField({
            name: "titleDropdownValues",
            type: "array",
            title: "Title Dropdown Values",
            of: [{ type: "string" }],
        }),
       
        defineField({
            name: "firstNamePlaceholder",
            type: "string",
            title: "First Name Placeholder",
        }),
        
        defineField({
            name: "lastNamePlaceholder",
            type: "string",
            title: "Last Name Placeholder",
        }),
        
        defineField({
            name: "emailPlaceholder",
            type: "string",
            title: "Email Placeholder",
        }),
        
        defineField({
            name: "locationPlaceholder",
            type: "string",
            title: "Location Placeholder",
        }),
        defineField({
            name: "locationDropdownValues",
            type: "array",
            title: "Location Dropdown Values",
            of: [{ type: "string" }],
        }),
        
        defineField({
            name: "vehiclePlaceholder",
            type: "string",
            title: "Vehicle Placeholder",
        }),
        defineField({
            name: "vehicleDropdownValues",
            type: "array",
            title: "Vehicle Dropdown Values",
            of: [{ type: "string" }],
        }),
        
        defineField({
            name: "phonePlaceholder",
            type: "string",
            title: "Phone Number Placeholder",
        }),
        
        defineField({
            name: "commentsPlaceholder",
            type: "string",
            title: "Comments Placeholder",
        }),
        defineField({
            name: "privacyPolicyLabel",
            type: "blockContent",
            title: "Privacy Policy Label",
        }),
        defineField({
            name: 'termsAndConditionsLabel',
            type: 'blockContent',
            title: 'Terms & Conditions Label',
        }),
        defineField({
            name: "submitButtonLabel",
            type: "string",
            title: "Submit Button Label",
        }),
        defineField({
            name: "link",
            type: "reference",
            title: "Select Thank You Page",
            to: [{ type: "page" }],
            readOnly: true,
            deprecated : {reason: "This field is deprecated and will be removed in the future."}
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Offer Detail Form",
            };
        },
    },
});

import { de } from "date-fns/locale";
import { defineField, defineType } from "sanity";

export default defineType({
    name: 'customerDetails',
    title: 'Customer Details',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Main Heading',
            type: 'string',
        }),
        defineField({
            name: 'customerNameFull',
            title: 'Welcome back text',
            type: 'string',
        }),
        defineField({
            name: 'restartButton',
            title: 'Restart Button',
            type: 'string',
        }),
        defineField({
            name : 'restartButtonLink',
            type : 'reference',
            title : 'Select Detail Page',
            to : [{type : 'page'}]
          }),
        defineField({
            name: "customerdetails",
            title: "Customer Details",
            type: "object",
            fields: [
                defineField({
                    name: "customerNameLabel",
                    title: "Customer Name Label",
                    type: "string",
                }),
                defineField({
                    name: "PhoneNumberLabel",
                    title: "Phone Number Label",
                    type: "string",
                }),
                defineField({
                    name: "rigisterEmailAddressLabel",
                    title: "Email Address Label",
                    type: "string",
                }),
                defineField({
                    name: "addressLine1Label",
                    title: "Address Line 1 Label",
                    type: "string",
                }),
                defineField({
                    name: "areaLocalityLabel",
                    title: "Area / Locality Label",
                    type: "string",
                }),
                defineField({
                    name: "countrylabel",
                    title: "Country Label",
                    type: "string",
                }),
                defineField({
                    name: "vehicleLabel",
                    title: "Vehicle Label",
                    type: "string",
                }),
                defineField({
                    name: "vinLabel",
                    title: "VIN Label",
                    type: "string",
                }),
                defineField({
                    name: "licensePlateNo",
                    title: "License Plate No.",
                    type: "string",
                }),
            ]
        }),
        defineField({
            name: 'detailForm',
            title: 'Detail Form',
            type: 'object',
            fields: [
                defineField({
                    name: 'serviceCenterLebel',
                    title: 'Service Center Label',
                    type: 'string',
                }),
                defineField({
                    name: 'serviceCenterPlaceholder',
                    title: 'Service Center Placeholder',
                    type: 'string',
                }),
                defineField({
                    name: 'serviceLabel',
                    title: 'Recommended Service Label',
                    type: 'string',
                }),
                defineField({
                    name: 'servicePlaceholder',
                    title: 'Recommended Service Placeholder',
                    type: 'string',
                }),
                defineField({
                    name: 'dateLabel',
                    title: 'Date Label',
                    type: 'string',
                }),
                defineField({
                    name: 'datePlaceholder',
                    title: 'Date Placeholder',
                    type: 'string',
                }),
                defineField({
                    name: 'timeLabel',
                    title: 'Time Label',
                    type: 'string',
                }),
                defineField({
                    name: 'timePlaceholder',
                    title: 'Time Placeholder',
                    type: 'string',
                }),
            ]
        }),
        defineField({
            name: 'mileageLabel',
            title: 'Mileage Label',
            type: 'string',
        }),
        defineField({
            name: 'mileagePlaceholder',
            title: 'Mileage Placeholder',
            type: 'string',
        }),
        defineField({
            name: 'mileageDropdown',
            title: 'Mileage Dropdown',
            type: 'object',
            fields: [
                defineField({
                    name: 'label',
                    title: 'Label',
                    type: 'string',
                }),
                defineField({
                    name: 'options',
                    title: 'Options',
                    type: 'array',
                    of: [{ type: 'number' }],
                }),
            ],
        }),
        defineField({
            name: 'submitButton',
            title: 'Submit Button',
            type: 'callToAction',
        }),
    ]
})
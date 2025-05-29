import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'appointmentBooked',
    title: 'Appointment Booked',
    type: 'object',
    fields: [
        defineField({
            name: 'subHeading',
            title: 'Sub Heading',
            type: 'blockContent',
        }),
        defineField({
            name: "confirmationDetails",
            title: "Confirmation Details",
            type: "object",
            fields: [
                defineField({
                    name: "bookingIDLabel",
                    title: "Booking ID Label",
                    type: "string",
                }),
                defineField({
                    name: "licensePlateNoLabel",
                    title: "License Plate No. Label",
                    type: "string",
                }),
                defineField({
                    name: "serviceLabel",
                    title: "Service Label",
                    type: "string",
                }),
                defineField({
                    name: "startDateLabel",
                    title: "Start Date Label",
                    type: "string",
                }),
                defineField({
                    name: "dropOffTime",
                    title: "Drop Off Time Label",
                    type: "string",
                }),
                defineField({
                    name: "workshopLabel",
                    title: "Workshop Label",
                    type: "string",
                }),
                defineField({
                    name: "CityCountryLabel",
                    title: "City, Country",
                    type: "string",
                }),
                defineField({
                    name: "countryLabel",
                    title: "Country Label",
                    type: "string",
                }),
                defineField({
                    name: "locationLabel",
                    title: "Location Label",
                    type: "string",
                }),
            ]
        }),
        defineField({
            name: 'helpText',
            title: 'Help Text',
            type: 'string',
        }),
        defineField({
            name: 'bookButton',
            title: 'Book Button',
            type: 'callToAction',
        }),
        defineField({
            name: 'exploreButton',
            title: 'Explore Button',
            type: 'callToAction',
        }),
    ],
});
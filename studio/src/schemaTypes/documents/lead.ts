import { defineField, defineType } from 'sanity';

export const lead = defineType({
    name: 'lead',
    type: 'document',
    title: 'Lead',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            title: 'Title',
        }),
        defineField({
            name: 'firstName',
            type: 'string',
            title: 'First Name',
        }),
        defineField({
            name: 'lastName',
            type: 'string',
            title: 'Last Name',
        }),
        defineField({
            name: 'email',
            type: 'string',
            title: 'Email',
        }),
        defineField({
            name: 'phone',
            type: 'string',
            title: 'Phone',
        }),
        defineField({
            name: 'fleetSize',
            type: 'string',
            title: 'Fleet Size',
        }),
        defineField({
            name: 'companyName',
            type: 'string',
            title: 'Company Name',
        }),
        defineField({
            name: 'comments',
            type: 'text',
            title: 'Comments',
        }),
        defineField({
            name: 'formType',
            type: 'string',
            title: 'Form Type',
        }),
        defineField({
            name: 'vehicleMake',
            type: 'string',
            title: 'Vehicle Make',
        }),
        defineField({
            name: 'vehicleModel',
            type: 'string',
            title: 'Vehicle Model',
        }),
        defineField({
            name: 'location',
            type: 'string',
            title: 'Location',
        }),
        defineField({
            name: 'modelYear',
            type: 'string',
            title: 'Model Year',
        }),
        defineField({
            name: 'serviceCenter',
            type: 'string',
            title: 'Service Center',
        }),
        defineField({
            name: 'type',
            type: 'string',
            title: 'Type',
        }),
        defineField({
            name: 'contactYou',
            type: 'string',
            title: 'Contact You',
        }),
        defineField({
            name: 'promoCode',
            type: 'string',
            title: 'Promo Code',
        }),
        defineField({
            name: 'pageUrl',
            type: 'string',
            title: 'Page Url',
        }),
        defineField({
            name: 'referring_url',
            type: 'string',
            title: 'Referring URL',
        }),
    ],
});
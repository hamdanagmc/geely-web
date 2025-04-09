import { defineField, defineType } from 'sanity';

export const serviceBookingForm = defineType({
    name: 'serviceBookingForm',
    type: 'object',
    title: 'Service Booking Form',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            title: 'Title',
        }),
        defineField({
            name: 'subTitle',
            type: 'string',
            title: 'Sub Title',
        }),
        defineField({
            name: 'formTitle',
            type: 'string',
            title: 'Form Title',
        }),
        defineField({
            name: 'formTitlePlaceholder',
            type: 'string',
            title: 'Form Title Placeholder',
        }),
        defineField({
            name: 'formTitleTypes',
            type: 'array',
            title: 'Form Title Type',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'firstNameLabel',
            type: 'string',
            title: 'First Name Label',
        }),
        defineField({
            name: 'firstNamePlaceholder',
            type: 'string',
            title: 'First Name Placeholder',
        }),
        defineField({
            name: 'lastNameLabel',
            type: 'string',
            title: 'Last Name Label',
        }),
        defineField({
            name: 'lastNamePlaceholder',
            type: 'string',
            title: 'Last Name Placeholder',
        }),
        defineField({
            name: 'emailAddressLabel',
            type: 'string',
            title: 'Email Address Label',
        }),
        defineField({
            name: 'emailAddressPlaceholder',
            type: 'string',
            title: 'Email Address Placeholder',
        }),
        defineField({
            name: 'phoneNumberLabel',
            type: 'string',
            title: 'Phone Number Label',
        }),
        defineField({
            name: 'phoneNumberPlaceholder',
            type: 'string',
            title: 'Phone Number Placeholder',
        }),
        defineField({
            name: 'vehicleTypeLabel',
            type: 'string',
            title: 'Vehicle Type / Model Label',
        }),
        defineField({
            name: 'vehicleTypes',
            type: 'array',
            title: 'Vehicle Type / Model',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'modelYearLabel',
            type: 'string',
            title: 'Model Year Label',
        }),
        defineField({
            name: 'modelYears',
            type: 'array',
            title: 'Model Years',
            of: [{ type: 'number' }]
        }),
        defineField({
            name: 'serviceTypeLabel',
            type: 'string',
            title: 'Service Type Label',
        }),
        defineField({
            name: 'serviceTypePlaceholder',
            type: 'string',
            title: 'Service Type Placeholder',
        }),
        defineField({
            name: 'serviceTypes',
            type: 'array',
            title: 'Create Service Types',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'serviceCenterLabel',
            type: 'string',
            title: 'Service Center Label',
        }),
        defineField({
            name: 'serviceCenters',
            type: 'array',
            title: 'Create A Service Center',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'termsAndConditionsLabel',
            type: 'string',
            title: 'Terms & Conditions Label',
        }),
        defineField({
            name: 'termsAndConditionsLinkText',
            type: 'string',
        }),
        defineField({
            name: 'termsAndConditionsLink',
            type: 'string',
        }),
        defineField({
            name: 'submitLabel',
            type: 'string',
        })
    ],
    preview: {
        prepare() {
            return {
                title : 'Service Booking Form'
            }
        }
    },
});

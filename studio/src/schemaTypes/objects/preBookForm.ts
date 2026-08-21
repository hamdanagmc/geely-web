import { defineField, defineType } from 'sanity';

export const preBookForm = defineType({
    name: 'preBookForm',
    title: 'Pre-Book Form',
    type: 'object',
    fields: [
        
        defineField({
            name: 'formTitle',
            type: 'string',
            title: 'Form Title',
        }),
        defineField({
            name: 'formSubTitle',
            type: 'string',
            title: 'Form Subtitle',
        }),
        defineField({
            name: 'fullNameLabel',
            type: 'string',
            title: 'Full Name Label',
        }),
        defineField({
            name: 'fullNamePlaceholder',
            type: 'string',
            title: 'Full Name Placeholder',
        }),
        defineField({
            name: 'emailPlaceholder',
            title: 'Email Placeholder',
            type: 'object',
            fields: [
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({ name: 'placeholder', title: 'Placeholder', type: 'string' })
            ]
        }),
        defineField({
            name: 'phone',
            title: 'Phone',
            type: 'object',
            fields: [
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({ name: 'placeholder', title: 'Placeholder', type: 'string' })
            ]
        }),
        defineField({
            name : 'locations',
            title : 'Locations',
            type : 'array',
            of :[
                defineField({
                    name : 'locationItem',
                    type : 'string'
                })
            ]
        }),
        defineField({
            name: 'locationLabel',
            title: 'Location Select Label',
            type: 'string',
            description: 'Label to display for the location select input in the front-end',
        }),
        defineField({
            name: 'termsAndConditions',
            title: 'Terms and Conditions',
            type: 'object',
            fields: [
                defineField({ name: 'label', title: 'Terms and Conditions Text', type: 'string' }),
                defineField({ name: 'termsAndConditionsTitle', title: 'Terms and Conditions Heading', type: 'string' }),
                defineField({ name: 'link', title: 'link', type: 'string' })
            ]
        }),
        defineField({
            name: 'submitLabel',
            title: 'Submit Button Label',
            type: 'string',
        }),
        defineField({
            name : 'link',
            type : 'reference',
            title : 'Select thankyou Page',
            to : [{type : 'page'}]
          }),
    ],
    preview : {
        prepare () {
            return {
                title : 'Pre-Book Form'
            }
        }
    }
});

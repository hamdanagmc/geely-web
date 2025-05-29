import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'customerLookup',
    title: 'Customer Lookup',
    type: 'object',
    fields: [
        defineField({
            name: 'Heading',
            title: 'Heading',
            type: 'string',
        }),
        defineField({
            name: 'subHeading',
            type: 'blockContent',
            title: 'Sub Heading'
        }),
        defineField({
            name: 'form',
            title: 'Form',
            type: 'object',
            fields: [
                defineField({
                    name: 'licensePlateLabel',
                    title: 'License Plate Label',
                    type: 'string',
                }),
                defineField({
                    name: 'licensePlatePlaceholder',
                    title: 'License Plate Placeholder',
                    type: 'string',
                }),
                defineField({
                    name: 'plateNoPlaceholder',
                    title: 'Plate No Placeholder',
                    type: 'string',
                }),
                defineField({
                    name: 'sourcePlaceholder',
                    title: 'Source Placeholder',
                    type: 'string',
                }),
                defineField({
                    name: 'orLabel',
                    title: 'OR Label',
                    type: 'string'
                }),
                defineField({
                    name: 'vinNumberLabel',
                    title: 'Vin Number Lable',
                    type: 'string',
                }),
                defineField({
                    name: 'vinNoPlaceholder',
                    title: 'Vin No ',
                    type: 'string'
                }),
                defineField({
                    name: 'termsAndCondition',
                    title: 'Terms And Condition',
                    type: 'string'
                }),
                defineField({
                    name: 'termsAndConditionColor',
                    title: 'Terms And Condition Label',
                    type: 'string'
                }),
                defineField({
                    name: 'termsAndConditionLink',
                    title: 'Select Page Link',
                    type: 'reference', // Using the existing link schema
                    to: [{ type: 'page' }]
                }),
                defineField({
                    name: 'buttomText',
                    title: 'Button Text',
                    type: 'string',
                }),
            ]
        }),
    ]
});

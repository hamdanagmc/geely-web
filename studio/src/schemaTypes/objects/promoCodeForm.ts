import { defineField, defineType } from 'sanity';

export const promoCodeForm = defineType({
    name: 'promoCodeForm',
    title: 'Promo Code Form',
    type: 'object',
    fields: [
        defineField({
            name : 'stepOneLabel',
            type : 'string',
        }),
        defineField({
            name : 'chooseYourCarLabel',
            type : 'string',
        }),
        defineField({
            name : 'sedanLabel',
            type : 'string',
        }),
        defineField({
            name : 'suvLabel',
            type : 'string',
        }),
        defineField({
            name : 'stepTwoLabel',
            type : 'string',
        }),
        defineField({
            name : 'selectModelLabel',
            type : 'string',
        }),
        defineField({
            name : 'models',
            type : 'array',
            of :[
                defineField({
                    name : 'model',
                    type : 'object',
                    fields :[
                        defineField({
                            name : 'image',
                            type : 'customImage',
                            description: " image size should be 266x132 pixles",
                            title : 'Thumbnail Image'
                        }),
                        defineField({
                            name : 'title',
                            type : 'string',
                            title : 'Model Title'
                        }),
                        defineField({
                            name: "category",
                            type: "string",
                            title: "Select Category",
                            options: {
                              list: [
                                { title: "SUV", value: "suv" },
                                { title: "Sedan", value: "sedan" },
                              ],
                              layout: "radio",
                            },
                          }),
                    ]
                })
            ]
        }),
        defineField({
            name : 'stepThreeLabel',
            type : 'string',
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
            name: 'numberOfCarsLabel',
            title: 'Number of Cars Required Label',
            type: 'string',
        }),
        defineField({
            name: 'locationLabel',
            type: 'string',
            title: 'Select the location Label',
        }),
        defineField({
            name: 'locationPlaceholder',
            type: 'string',
            title: 'Location Placeholder',
        }),
        defineField({
            name: 'locationTypes',
            type: 'array',
            title: 'Location Types',
            of: [{ type: 'string' }]
        }),
        defineField({
                  name: "commentsLabel",
                  type: "string",
                  title: "Comments Label",
                }),
                defineField({
                  name: "commentsPlaceholder",
                  type: "string",
                  title: "Comments Placeholder",
                }),
        defineField({
                  name: "promoCodeLabel",
                  type: "string",
                  title: "Promo Code Label",
                }),
                defineField({
                  name: "promoCodePlaceholder",
                  type: "string",
                  title: "Promo Code Placeholder",
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
                title : 'Promo Code Form'
            }
        }
    }
});

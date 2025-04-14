import { defineField, defineType } from "sanity";

export const contactFormSection = defineType({
  name: "contactFormSection",
  title: "Form with map",
  type: "object",
  fields: [
    defineField({
      name: "map",
      title: "Map",
      type: "iframe",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "mobile",
      title: "Mobile Number",
      type: "string",
    }),
    defineField({
      name: 'form',
      type: 'object',
      title: 'Form',
      fields: [
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
          name: 'typeLabel',
          type: 'string',
          title: 'Type Label',
        }),
        defineField({
          name: 'typePlaceholder',
          type: 'string',
          title: 'Type Placeholder',
        }),
        defineField({
          name: 'typeOptions',
          type: 'array',
          title: 'Add Type Options',
          of: [{ type: 'string' }]
        }),

        defineField({
          name: 'locationLabel',
          type: 'string',
          title: 'Location Label',
        }),
        defineField({
          name: 'locationPlaceholder',
          type: 'string',
          title: 'Location Placeholder',
        }),
        defineField({
          name: 'locationOption',
          type: 'array',
          title: 'Add Location',
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
          name: "submitButtonLabel",
          type: "string",
          title: "Submit Button Label",
        }),
        defineField({
          name : 'link',
          type : 'reference',
          title : 'Select thankyou Page',
          to : [{type : 'page'}]
        }),
      ]
    })
  ],
});
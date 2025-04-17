import { defineField, defineType } from "sanity";

export const brochureDownloadFormSection = defineType({
  name: "brochureDownloadFormSection",
  title: "Brochure Download Contact Form",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Main Heading",
      type: "string",
    }),
    defineField({
      name: "subHeading",
      title: "Sub Heading",
      type: "string",
    }),
    defineField({
      name: 'form',
      type: 'object',
      title: 'Form Fields',
      fields: [
        defineField({
          name: 'downloadValues',
          type: 'array',
          title: 'Download Checkbox Values',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', type: 'string', title: 'Title' },
                { name: 'logo', type: 'customImage', title: 'Logo' },
                { name: 'image', type: 'customImage', title: 'Image' },
                { name: 'financeText', type: 'string', title: 'Finance Text' },
                { name: 'leaseText', type: 'string', title: 'Lease Text' },
                {
                  name: 'brochureFile', type: 'file', title: 'Brochure File',
                  options: {
                    accept: 'application/pdf',
                  },
                },
              ]
            }
          ]
        }),
        defineField({
          name: "heading",
          title: "Form Heading",
          type: "string",
        }),
        defineField({
          name: "subHeading",
          title: "Form Sub Heading",
          type: "string",
        }),
        defineField({
          name: 'titleLabel',
          type: 'string',
          title: 'Title Label',
        }),
        defineField({
          name: 'titlePlaceholder',
          type: 'string',
          title: 'Title Placeholder',
        }),
        defineField({
          name: 'titleDropdownValues',
          type: 'array',
          title: 'Title Dropdown Values',
          of: [{ type: 'string' }]
        }),
        defineField({
          name: 'firstNameLabel',
          type: 'string',
          title: 'Name Label',
        }),
        defineField({
          name: 'firstNamePlaceholder',
          type: 'string',
          title: 'Name Placeholder',
        }),
        defineField({
          name: 'lastNameLabel',
          type: 'string',
          title: 'Name Label',
        }),
        defineField({
          name: 'lastNamePlaceholder',
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
          name: "countryCodePlaceholder",
          type: "string",
          title: "Country Code Placeholder",
        }),
        defineField({
          name: "phonePlaceholder",
          type: "string",
          title: "Phone Number Placeholder",
        }),
        defineField({
          name: "contactYouLabel",
          type: "string",
          title: "Contact you heading",
        }),
        defineField({
          name: "contactYouYes",
          type: "string",
          title: "Contact you yes label",
        }),
        defineField({
          name: "contactYouNo",
          type: "string",
          title: "Contact you no label",
        }),
        defineField({
          name: "messagelabel",
          type: "string",
          title: "Message Label",
        }),
        defineField({
          name: "messagePlaceholder",
          type: "string",
          title: "Message Placeholder",
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
          name: "submitButtonLabel",
          type: "string",
          title: "Submit Button Label",
        }),
        defineField({
          name: 'link',
          type: 'reference',
          title: 'Select thankyou Page',
          to: [{ type: 'page' }]
        }),
      ]
    })
  ],
  preview: {
    select: {
      formTitle: "title",
    },
    prepare(selection) {
      const { formTitle } = selection;
      return {
        title: "Brochure Download Contact Form",
        subtitle: formTitle ? `Form: ${formTitle}` : "No form title set",
      };
    },
  },
});
import { defineField, defineType } from "sanity";

export const fleetContactFormSection = defineType({
  name: "fleetContactFormSection",
  title: "Fleet Sales Contact Form",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Form Title",
      type: "string",
    }),
    defineField({
      name: 'form',
      type: 'object',
      title: 'Form Fields',
      fields: [
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
          name: "fleetSizeLabel",
          type: "string",
          title: "Fleet Size Label",
        }),
        defineField({
          name: "fleetSizePlaceholder",
          type: "string",
          title: "Fleet Size Placeholder",
        }),
        defineField({
          name: 'fleetSizeDropdownValues',
          type: 'array',
          title: 'Fleet Size Dropdown Values',
          of: [{ type: 'string' }]
        }),
        defineField({
          name: "companyNameLabel",
          type: "string",
          title: "Company Name Label",
        }),
        defineField({
          name: "companyNamePlaceholder",
          type: "string",
          title: "Company Name Placeholder",
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
          name: 'termsAndConditionsLabel',
          type: 'blockContent',
          title: 'Terms & Conditions Label',
        }),
        defineField({
          name: "submitButtonLabel",
          type: "string",
          title: "Submit Button Label",
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
        title: "Fleet Sales Contact Form",
        subtitle: formTitle ? `Form: ${formTitle}` : "No form title set",
      };
    },
  },
});
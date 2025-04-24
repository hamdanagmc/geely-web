import { defineField, defineType } from "sanity";

export const optOutForm = defineType({
  name: "optOutForm",
  title: "Opt Out Form",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Form Heading",
      type: "string",
    }),
    defineField({
      name: 'nameLabel',
      type: 'string',
      title: 'Name Label',
    }),
    defineField({
      name: 'namePlaceholder',
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
      name: "stopMarketingLabel",
      type: "string",
      title: "Stop Marketing Communication Label",
    }),
    defineField({
      name: "yesLabel",
      type: "string",
      title: "Yes Radio Label",
    }),
    defineField({
      name: "noLabel",
      type: "string",
      title: "No Radio Label",
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

  ],
});
// parallaxWithRichText.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export const thankyouBanner = defineType({
  name: 'thankyouBanner',
  type: 'object',
  title: 'Thank you Banner Component',
  fields: [
    defineField({
      name: 'backgroundImage',
      type: 'customImage',
      description: 'image size should be 1440x500 pixels',
      title: 'Background Image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mobileImage',
      type: 'customImage',
      description: 'image size should be 750x1650 pixels',
      title: 'mobile Image',
      options: { hotspot: true },
    }),
  ],
});
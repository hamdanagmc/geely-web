// preBookHeroBannerComponent.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';
export const preBookHeroBannerComponent = defineType({
  name: 'preBookHeroBannerComponent',
  type: 'object',
  title: 'Pre-Book Hero Banner Component',
  fields: [
    defineField({
      name: 'desktopImage',
      type: 'image',
      title: 'Desktop Image',
      description: 'Image displayed on larger screens and size should be 1220x434 pixels.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mobileImage', // Optional: Separate mobile image
      type: 'image',
      title: 'Mobile Image',
      description: 'Optional: Image displayed on smaller screens.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'titleLogo',
      type: 'image',
      title: 'Title Logo',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ButtonText',
      type: 'string',
      title: 'Button CTA Text 1',
    }),

    defineField({
      name: 'ButtonText2',
      type: 'string',
      title: 'Button CTA Text 2',
    }),
    defineField({
      name: 'link',
      type: 'reference',
      title: 'Select Page or Car',
      to: [{ type: 'page' }, { type: 'car' }]
    }),
    defineField({
      name: 'fullNameLabel',
      type: 'string',
      title: 'Full Name Label',
    }),
  ],
});

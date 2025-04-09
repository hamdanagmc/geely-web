import { defineType, defineField } from 'sanity';

export const heroBrochureDownload =  defineType({
  name: 'heroBrochureDownload',
  type: 'object',
  title: 'Hero Brochure Download',
  fields: [
    defineField({
      name: 'backgroundImage',
      type: 'customImage',
      description:"image size should be 1520x300 pixels",
      title: 'Background Image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mobileImage',
      type: 'customImage',
      description:"image size should be 400x600 pixels",
      title: 'Mobile Image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
  ],
  preview: {
    select: {
      title: 'text',
      media: 'backgroundImage.image',
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title: 'Hero Brochure Download',
        media,
      };
    },
  },
});
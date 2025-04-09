import { defineType, defineField } from 'sanity';

export const heroFleetSales =  defineType({
  name: 'heroFleetSales',
  type: 'object',
  title: 'Hero Fleet Sales',
  fields: [
    defineField({
      name: 'backgroundImage',
      type: 'customImage',
      description:"image size should be 1800x1000 pixels",
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
      name: 'text',
      type: 'text',
      title: 'Text',
    }),
    defineField({
      name: 'cta',
      type: 'callToAction', 
      title: 'Call to action'
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
        title: 'Hero Fleet Sales',
        media,
      };
    },
  },
});
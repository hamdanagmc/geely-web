// parallaxSection.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'parallaxSection',
  type: 'object',
  title: 'Text with background image',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
    defineField({
      name: 'buttonText',
      type: 'string',
      title: 'Button Text',
    }),
    defineField({
      name: 'buttonLink',
      type: 'string', // Use 'url' type for links
      title: 'Button Link',
    }),
    defineField({
      name: 'backgroundImage',
      type: 'customImage',
      description: 'image size should be 1600x580 pixels',
      title: 'Background Image',
      options: { hotspot: true },
    }),
  ],
});
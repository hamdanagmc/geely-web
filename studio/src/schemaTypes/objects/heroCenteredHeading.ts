// parallaxWithRichText.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'heroCenteredHeading',
  type: 'object',
  title: 'Hero centered heading',
  fields: [
    defineField({
      name: 'backgroundImage',
      type: 'image',
      description: 'image size should be 2500x1500 pixels',
      title: 'Background Image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mobileImage',
      type: 'image',
      description: 'image size should be 750x1650 pixels',
      title: 'mobile Image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'richText',
      type: 'array', // Array of blocks for rich text
      title: 'Rich Text Content',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'titleNumber',
      type: 'string',
      title: 'Sub Title',
    }),
  ],
});
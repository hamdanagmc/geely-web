// parallaxWithRichText.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'parallaxWithRichText',
  type: 'object',
  title: 'Hero with description',
  fields: [
    defineField({
      name: 'backgroundImage',
      type: 'image',
      title: 'Background Image',
      description: 'image size should be 2560x1182 pixels',
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
  ],
});
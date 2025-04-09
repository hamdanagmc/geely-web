// backgroundWithCaption.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'backgroundWithCaption',
  type: 'object',
  title: 'Hero with title',
  fields: [
    defineField({
      name: 'backgroundImage',
      type: 'image',
      title: 'Background Image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'preTitle', // Text above the main title
      type: 'string',
      title: 'Pre-Title Text',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
  ],
});
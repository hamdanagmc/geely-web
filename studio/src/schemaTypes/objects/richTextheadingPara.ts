import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'richTextheadingPara',
  type: 'object',
  title: 'Text big heading',
  fields: [
    {
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [
        {
          type: 'block', // Use the 'block' type for rich text
          styles: [ // Define the heading styles you want
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'H5', value: 'h5' },
            { title: 'H6', value: 'h6' },
            { title: 'Paragraph', value: 'paragraph' }, // Include paragraph style
          ],
          marks: { // Optionally configure marks (bold, italic, etc.)
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
      ],
    },
    defineField({
      name: 'htmlId',
      type: 'string',
      title: 'ID Attribute',
      description: 'Unique identifier for the banner component',
    }),
  ],
  preview: {
    select: {
      title: 'content',
    }
  },
});

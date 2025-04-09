// valuesSlider.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'imageTextSlider',
  type: 'object',
  title: 'Image on left slider',
  fields: [
    defineField({
      name: 'slides',
      type: 'array',
      title: 'Slides',
      of: [
        {
          type: 'object',
          name: 'slide',
          title: 'Slide',
          fields: [
            defineField({
              name: 'image',
              type: 'customImage',
              description: 'image size should be 892x691 pixels',
              title: 'Image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'title',
              type: 'string',
              title: 'Title',
            }),
            defineField({
              name: 'text',
              type: 'array', // Use an array of blocks for rich text
              title: 'Text',
              of: [{ type: 'block' }],
            }),
          ],
        },
      ],
    }),
  ],
});

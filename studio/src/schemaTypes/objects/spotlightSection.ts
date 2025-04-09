// spotlight.ts (Combined Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'spotlightSection', // Main type (section)
  type: 'object',
  title: 'Spotlight Section',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Section Title',
    }),
    defineField({
      name: 'cards',
      type: 'array',
      title: 'Spotlight Cards',
      of: [
        { // Define the card type inline
          type: 'object',
          name: 'spotlightCard', // Give the card type a name
          title: 'Spotlight Card',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Card Title',
            }),
            defineField({
              name: 'description',
              type: 'text',
              title: 'Card Description',
            }),
            defineField({
              name: 'image',
              type: 'customImage',
              description: 'image size shoule be 620x464 pixels ',
              title: 'Card Image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'bgImage',
              type: 'image',
              title: 'BG Image',
              description: 'image size should be 463x235 pixels',
              options: { hotspot: true },
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
  ],
});
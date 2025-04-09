// cardHoverComponent.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'cardHoverComponent',
  type: 'object',
  title: 'Offers grid',
  fields: [
    defineField({
      name: 'cards',
      type: 'array',
      title: 'Cards',
      of: [
        {
          type: 'object',
          name: 'card',
          title: 'Card',
          fields: [
            defineField({
              name: 'image',
              type: 'customImage',
              title: 'Image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'title',
              type: 'string',
              title: 'Title',
            }),
            defineField({
              name: 'link', // URL for the "Request a Call Back" button
              type: 'string',
              title: 'Link URL',
            }),
          ],
        },
      ],
    }),
  ],
});
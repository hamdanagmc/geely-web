import { defineField, defineType } from 'sanity';
import { i18n } from '../../../language';

export const vehicle = defineType({
  name: 'vehicle',
  type: 'document',
  title: 'Vehicle 360',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Vehicle Name'
    }),
    defineField({
      name: 'exteriorImages',
      type: 'array',
      title: 'Exterior Images',
      of: [
        {
          type: 'object',
          name: 'colorOption',
          title: 'Color Option',
          fields: [
            defineField({
              name: 'color',
              type: 'reference',
              title: 'Color',
              to: [{ type: 'color' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'images360',
              type: 'array',
              title: '360° Images',
              description:"image size should be 1196x426 pixels",
              of: [{ type: 'image', options: { hotspot: true } }],
              validation: (Rule) => Rule.min(1),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'interiorImages',
      type: 'array',
      title: 'Interior Images',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'year',
      media: 'titleImage',
    },
  },
});
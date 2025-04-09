import { defineField } from "sanity";

// schemas/efficientPerformanceSection.ts
export default {
  name: 'comfortSlider',
  title: 'Vehicle cards slider',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              name: 'image',
              title: 'Image',
              type: 'customImage',
            },
            {
              name: 'mobileImage',
              title: 'Mobile Image (Optional)',
              type: 'customImage',
            },
          ],
        },
      ],
    },
    defineField({
      name: 'htmlId',
      type: 'string',
      title: 'ID Attribute',
      description: 'Unique identifier for the banner component'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'slides.0.image.image',
    },
  },
};

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
              readOnly: true,
              deprecated: { reason: 'This field will be removed in future versions.' }
            },
            {
              name: 'mobileImage',
              title: 'Mobile Image (Optional)',
              type: 'customImage',
              readOnly: true,
              deprecated: { reason: 'This field will be removed in future versions.' }
            },
            defineField({
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Video', value: 'video' },
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'optionImage',
              title: 'Image',
              type: 'customImage',
              hidden: ({ parent }) => parent?.mediaType !== 'image',
            }),
            defineField({
              name: 'optionMobileImage',
              title: 'Mobile Image (Optional)',
              type: 'customImage',
              hidden: ({ parent }) => parent?.mediaType !== 'image',
            }),
            defineField({
              name: 'videoId',
              title: 'Vimeo Video ID',
              type: 'string',
              description: "video size should be 720x540 pixels",
              readOnly: true,
              deprecated: {
                reason:
                  "Use the Mux Video field instead. Vimeo Video ID field will be removed in future versions!",
              },
              hidden: ({ parent }) => parent?.mediaType !== 'video',
            }),
            defineField({
              name: "video",
              type: "mux.video",
              title: "Mux Video",
              description: "Please upload video from Mux",
              readOnly: true,
              hidden: ({ parent }) => parent?.mediaType !== 'video',
            }),
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

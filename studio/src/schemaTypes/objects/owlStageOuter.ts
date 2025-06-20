// schemas/stylishDesignSection.ts
import { defineField, defineType } from 'sanity';

export const owlStageOuter = defineType({
  name: 'owlStageOuter',
  title: 'Vehcile specification slider',
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
              description: 'image size should be 1560x750 pixels ',
              readOnly: true,
              deprecated: { reason: 'This field will be removed in future versions.' }
            },
            {
              name: 'mobileImage',
              title: 'Mobile Image (Optional)',
              description: "image size should be 375x600 pixels",
              readOnly: true,
              deprecated: { reason: 'This field will be removed in future versions.' },
              type: 'customImage',
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
              description: 'image size should be 1560x750 pixels ',
              hidden: ({ parent }) => parent?.mediaType !== 'image',
            }),
            defineField({
              name: 'optionMobileImage',
              title: 'Mobile Image (Optional)',
              type: 'customImage',
              description: "image size should be 375x600 pixels",
              hidden: ({ parent }) => parent?.mediaType !== 'image',
            }),
            defineField({
              name: 'videoId',
              title: 'Vimeo Video ID',
              type: 'string',
              description: "video size should be 1560x750 pixels",
              hidden: ({ parent }) => parent?.mediaType !== 'video',
            }),
            defineField({
              name: 'mobileVideoId',
              title: 'Vimeo Mobile Video ID',
              type: 'string',
              description: "video size should be 375x600 pixels",
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
      media: 'slides[0].image',
    },
    prepare({ title, media }) {
      return {
        title: title ?? 'Vehicle Specification Slider',
        media: media,
      };
    },
  },
});


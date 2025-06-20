// featureHighlightsComponent.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'featureHighlightsComponent',
  type: 'object',
  title: 'Slider with heading',
  fields: [

    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'tabs',
      type: 'array',
      title: 'Tabs',
      of: [
        {
          type: 'object',
          name: 'tab',
          title: 'Tab',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label',
            }),
            defineField({
              name: 'highlights',
              type: 'array',
              title: 'Highlights',
              of: [
                {
                  type: 'object',
                  name: 'highlight',
                  title: 'Highlight',
                  fields: [
                    defineField({
                      name: 'image',
                      type: 'customImage',
                      title: 'Image',
                      options: { hotspot: true },
                      readOnly:true,
                      deprecated: { reason: 'This field will be removed in future versions.' }
                    }),
                    defineField({
                      name: 'mobileImage', // Separate mobile image
                      type: 'customImage',
                      title: 'Mobile Image',
                      options: { hotspot: true },
                      readOnly:true,
                      deprecated: { reason: 'This field will be removed in future versions.' }
                    }),
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
                      description: 'image size should be auto width and height 540 pixels ',
                      hidden: ({ parent }) => parent?.mediaType !== 'image',
                    }),
                    defineField({
                      name: 'optionMobileImage',
                      title: 'Mobile Image (Optional)',
                      type: 'customImage',
                      description: 'image size should be auto width and height 540 pixels ',
                      hidden: ({ parent }) => parent?.mediaType !== 'image',
                    }),
                    defineField({
                      name: 'videoId',
                      title: 'Video ID',
                      type: 'string',
                      hidden: ({ parent }) => parent?.mediaType !== 'video',
                    }),
                    defineField({
                      name: 'title',
                      type: 'string',
                      title: 'Title',
                    }),
                    defineField({
                      name: 'description',
                      type: 'text',
                      title: 'Description',
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
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
      tabs: 'tabs',
    },
    prepare(selection) {
      const { title, tabs } = selection;
      return {
        title: title,
        subtitle: `Tabs: ${tabs ? tabs.length : 0}`,
      };
    },
  },
});

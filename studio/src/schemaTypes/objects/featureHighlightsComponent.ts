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
                    }),
                    defineField({
                      name: 'mobileImage', // Separate mobile image
                      type: 'customImage',
                      title: 'Mobile Image',
                      options: { hotspot: true },
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
      name : 'htmlId',
      type : 'string',
      title : 'ID Attribute',
      description : 'Unique identifier for the banner component'
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

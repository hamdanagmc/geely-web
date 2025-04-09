// stickyTabsComponent.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'stickyTabsComponent',
  type: 'object',
  title: 'Sticky list',
  fields: [
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
              name: 'scrollToId',
              type: 'string',
              title: 'Scroll To ID',
              description: 'Enter the ID of the section to scroll to (e.g., feature_highlights_section).',
            }),
            defineField({
              name: 'downloadType',
              type: 'string',
              title: 'Download Type',
              options: {
                layout: 'radio',
                list: [{ title: 'Link', value: 'link' }, { title: 'File', value: 'file' }]
              }
            }),
            defineField({
              name: 'downloadLink',
              type: 'url',
              title: 'Download Link',
              hidden: ({ parent }) =>  parent?.downloadType !== 'link', 
            }),
            defineField({
              name: 'downloadFile',
              type: 'file',
              title: 'Download File',
              options: {
                accept: 'application/pdf',
              },
              hidden: ({ parent }) => parent?.downloadType !== 'file',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      tabs: 'tabs',
    },
    prepare(selection) {
      const { tabs } = selection;
      const length = tabs ? tabs.length : 0;
      return {
        title: 'Sticky Tabs',
        subtitle: `Tabs: ${length}`,
      };
    },
  },
});

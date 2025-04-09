// shoppingTools.ts (Sanity Schema)
import { defineType } from 'sanity';

export default defineType({
  name: 'shoppingTools',
  type: 'object',
  title: 'Shopping Tools',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'tools',
      type: 'array',
      title: 'Tools',
      of: [
        {
          type: 'object',
          name: 'tool',
          title: 'Tool',
          fields: [
            { name: 'image', type: 'image', title: 'Image', description:"icon size should be 45x39 pixels", options: { hotspot: true } },
            { name: 'altText', type: 'string', title: 'Alt Text (for image)' },
            { name: 'link', type: 'string', title: 'Link' },
            { name: 'label', type: 'string', title: 'Label' },
          ],
        },
      ],
    },
  ],
});
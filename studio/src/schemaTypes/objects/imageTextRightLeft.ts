// schemas/diversificationSection.js
import { Rule } from '@sanity/types';
export default {
    name: 'imageTextRightLeft',
    title: 'Text with image Left or Right',
    type: 'object',
    fields: [
      {
        name: 'image',
        title: 'Image',
        type: 'customImage',
        options: {
          hotspot: true,
        },
        validation: (Rule: Rule) => Rule.required(),
      },
      {
        name: 'content',
        title: 'Content (Rich Text)',
        type: 'array',
        of: [{ type: 'block' }], // Use Sanity's rich text editor
        validation: (Rule: Rule) => Rule.required(),
      },
      {
        name: 'imagePosition',
        title: 'Image Position',
        type: 'string',
        options: {
          list: [
            { title: 'Left', value: 'left' },
            { title: 'Right', value: 'right' },
          ],
          layout: 'radio', // Use radio buttons for selection
        },
        initialValue: 'left', // Default position is left
      },
    ],
  };
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'richText',
  type: 'object',
  title: 'Rich Text',
  fields: [
    {
      name: 'content',
      type: 'blockContent',
      title: 'Content',
    },
    defineField({
      name: 'htmlId',
      type: 'string',
      title: 'ID Attribute',
      description: 'Unique identifier for the banner component',
    }),
    defineField({
      name: 'imageCenter',
      type: 'boolean',
      title: 'Center Image',
      description: 'Enable to center align the image',
      initialValue: false,
    }),
    defineField({
      name: 'containerWidth',
      type: 'boolean',
      title: 'Container Width',
      description: 'Enable to use container width',
      initialValue: false,
    }),

  ],
  preview: {
    select: {
      subtitle: 'content',
    },
    prepare(selection) {
      const { subtitle } = selection;
      return {
        title: `Rich Text`,
      };
    },
  }
});
import { defineField, defineType } from 'sanity';

export const thankyouRichText = defineType({
  name: 'thankyouRichText',
  type: 'object',
  title: 'Thank You Rich Text with Button',
  fields: [
    {
      name: 'content',
      type: 'blockContent',
      title: 'Content',
    },
    defineField({
      name: 'callToActionButton',
      type: 'callToAction',
      title: 'Explore Button',
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
        subtitle: subtitle ? `${subtitle[0].children[0].text}` : 'No content',
      };
    },
  }
});
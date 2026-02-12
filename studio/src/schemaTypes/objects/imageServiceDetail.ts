import { defineField, defineType } from "sanity";
import { Rule } from '@sanity/types';

export const imageServiceDetail = defineType({
  name: "imageServiceDetail",
  title: "UAE-specific service details",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),

    defineField({
      name: "listItem",
      type: "array",
      title: "Service List",
      of: [
        {
          type: "object",
          name: "serviceItem",
          title: "Service Item",
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'customImage',
              options: {
                hotspot: true,
              },
              validation: (Rule: Rule) => Rule.required(),
            },),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
          ],
        },
      ],
    }),
  ],
});

import { defineField, defineType, Rule } from "sanity";

export const serviceHighlight = defineType({
  name: "serviceHighlight",
  title: "Service Highlight Section",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Highlight Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "serviceHighlightItem",
          title: "Service Highlight Item",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),

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
              name: 'icon',
              title: 'Icon',
              type: 'customImage',
              options: {
                hotspot: true,
              },
              validation: (Rule: Rule) => Rule.required(),
            },),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.min(3).max(3).error("Exactly 3 items required"),
    }),
  ],
});

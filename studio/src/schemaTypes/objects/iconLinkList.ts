import { defineArrayMember, defineField, defineType } from "sanity";

export const iconLinkList = defineType({
    name: 'iconLinkList',
    type: 'object',
    title: 'Icon Link List',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            description: 'A title for the list of links (optional)',
        }),
        defineField({
            type: "array",
            name: "links",
            of: [
                defineArrayMember({ type: 'iconLinkItem', }),
            ],
        }),
    ],
    preview: {
        select: {
          title: 'title',
          linkCount: 'links.length',
        },
        prepare({ title, linkCount }) {
          return {
            title: title || 'Untitled Link List',
            subtitle: `${linkCount || 0} links`,
          }
        },
      },
});
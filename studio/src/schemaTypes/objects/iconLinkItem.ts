import { defineField, defineType } from "sanity";

export const iconLinkItem = defineType({
    name: 'iconLinkItem',
    title: 'Icon Link Item',
    type: 'object',
    fields: [
        defineField({
            name: 'icon',
            title: 'Icon',
            type: 'customImage',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required().error('Icon is required'),
        }),
        defineField({
            name: 'linkText',
            title: 'Link Text',
            type: 'string',
            validation: (Rule) => Rule.required().error('Link text is required'),
        }),
        defineField({
            name: 'link',
            title: 'Link',
            type: 'link', // Using the existing `link` schema
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'linkText',
            subtitle: 'link.href',
        },
        prepare({ title, subtitle }) {
            return {
                title: title || 'Untitled Link',
                subtitle: subtitle || 'No URL provided',
            }
        },
    },
});


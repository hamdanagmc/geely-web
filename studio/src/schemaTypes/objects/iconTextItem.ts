import { defineType, defineField } from 'sanity';

export const iconTextItem = defineType({
    name: 'iconTextItem',
    type: 'object',
    title: 'Icon Text Item',
    fields: [
        defineField({
            name: 'icon',
            type: 'customImage',
            description: 'icon size should be 55x55 pixels',
            title: 'Icon',
            options: { hotspot: true },
        }),
        defineField({
            name: 'title',
            type: 'string',
            title: 'Title'
        }),
        defineField({
            name: 'text',
            type: 'text',
            title: 'Text',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'icon.image',
        },
        prepare(selection) {
            const { title, media } = selection;
            return {
                title: title ?? 'No title provided',
                media,
            };
        },
    },
});
import { defineType, defineField } from "sanity";

export const referenceComponent = defineType({
    name: 'referenceComponent',
    type: 'object',
    title: 'Reference Component',
    fields: [
        defineField({
            name: 'type',
            type: 'string',
            title: 'Type',
            options: {
                list: [
                    { title: 'Page', value: 'page' },
                    { title: 'Car', value: 'car' },
                    { title: 'News', value: 'news' },
                ],
                layout: 'radio',
            },
        }),
        defineField({
            name: 'pageReference',
            type: 'reference',
            title: 'Page Reference',
            to: [{ type: 'page' }],
            hidden: ({ parent }) => parent?.type !== 'page',
        }),
        defineField({
            name: 'carReference',
            type: 'reference',
            title: 'Car Reference',
            to: [{ type: 'car' }],
            hidden: ({ parent }) => parent?.type !== 'car',
        }),
        defineField({
            name: 'newsReference',
            type: 'reference',
            title: 'News Reference',
            to: [{ type: 'news' }],
            hidden: ({ parent }) => parent?.type !== 'news',
        }),
    ],
});
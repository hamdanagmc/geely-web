import { defineField, defineType } from "sanity";

export const fleetTextImage = defineType({
    name: 'fleetTextImage',
    type: 'object',
    title: 'Fleet Text with image',
    fields: [
        defineField({
            name: 'backgroundImage',
            description: 'image size should be 1600x580 pixels',
            type: 'customImage',
            title: 'Background Image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'text',
            type: 'text',
            title: 'Text',
        }),
    ],
    preview: {
        select: {
            title: 'text',
            media: 'backgroundImage.image',
        },
        prepare(selection) {
            const { title, media } = selection;
            return {
                title: 'Fleet Text with image',
                media,
            };
        },
    },
})
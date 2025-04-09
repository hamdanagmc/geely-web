import { defineField, defineType } from "sanity";

export const imagesAndVideosSection = defineType({
    name: 'imagesAndVideosSection',
    type: 'object',
    title: 'Images and videos section',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
        }),
        defineField({
            name: 'imagesTabLabel',
            type: 'string',
        }),
        defineField({
            name: 'videosTabLabel',
            type: 'string',
        }),
        defineField({
            name: 'modelGalleryList',
            type: 'array',
            of: [
                { type: 'modelGallery' }
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            imagesTabLabel: 'imagesTabLabel',
            videosTabLabel: 'videosTabLabel',
        },
        prepare(selection) {
            const { title, imagesTabLabel, videosTabLabel } = selection;
            return {
                title: title ?? 'Images and Videos Section',
                subtitle: `${imagesTabLabel} / ${videosTabLabel}`,
            };
        },
    }
})
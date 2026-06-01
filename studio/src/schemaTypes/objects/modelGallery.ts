import { defineField, defineType } from "sanity";

export const modelGallery = defineType({
    name: 'modelGallery',
    type: 'object',
    title: 'Model Gallery',
    fields: [
        defineField({ name: 'name', title: 'Model Name', type: 'string' }),
        defineField({ name: 'image', title: 'Model Image', type: 'image', description: "image size should be 266x132 pixels" }),
        defineField({ name: 'dataId', title: 'Data ID', type: 'string' }),
        defineField({
            name: 'imageList',
            type: 'array',
            title: 'Image List',
            description: "image size should be 1024x548 pixels",
            of: [
                defineField({
                    type: 'image',
                    name: 'image',
                    options: {
                        hotspot: true,
                    },
                    fields: [
                        defineField({
                            name: 'altText',
                            type: 'string',
                            title: 'Alternative Text',
                            validation: rule => rule.required().error("please fill this field"),
                        }),
                    ]
                })
            ],
        }),
        defineField({
            name: 'videoList',
            type: 'array',
            title: 'Video List',
            readOnly: true,
            of: [
                defineField({
                    name: 'videoId',
                    title: 'Video Vimeo Id',
                    type: 'string',
                    validation: rule => rule.required(),
                    readOnly: true,
                    description: 'Please provide video id from vimeo'
                }),
            ],
        }),
        defineField({
            name: 'videoListMux',
            type: 'array',
            title: 'Video List',
            of: [
                defineField({
                    name: "video",
                    type: "mux.video",
                    title: "Mux Video",
                    description: "Please upload video from Mux",
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: 'name',
            imageList: 'imageList',
            videoList: 'videoList',
        },
        prepare(selection) {
            const { title, imageList, videoList } = selection;
            const imageCount = imageList ? imageList.length : 0;
            const videoCount = videoList ? videoList.length : 0;
            return {
                title: title ?? `Model Gallery`,
                subtitle: `${imageCount} images, ${videoCount} videos`,
            };
        },
    },
})

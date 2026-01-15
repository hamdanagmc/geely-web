import { defineField, defineType } from "sanity";

export const sparePartsModel = defineType({
    name: 'sparePartsModel',
    title: 'Spare Parts Model',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'bgImage',
            title: 'Background Image',
            type: 'customImage',
        }),
        defineField({
            name: 'selectTrimPlaceholder',
            title: 'Select Trim Placeholder',
            type: 'string',
        }),
        defineField({
            name: 'selectModelPlaceholder',
            title: 'Select Model Placeholder',
            type: 'string',
        }),
        defineField({
            name: 'displayDataText',
            title: 'Display Data Text',
            type: 'string',
        }),
        defineField({
            name: 'buttonText',
            title: 'Button Text',
            type: 'string',
        })
    ],
    preview: {
        select: {
            title: 'title',
        },
        prepare(selection) {
            const { title } = selection;
            return {
                title: 'Spare Parts Model',
            };
        }
    },
})
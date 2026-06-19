import { defineField, defineType } from "sanity";

export const serviceCostModel = defineType({
    name: 'serviceCostModel',
    title: 'Service Cost Model',
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
            name: 'termAndConditionText',
            title: 'Terms and Condition Text',
            type: 'blockContent',
        }),
        defineField({
            name: 'pdfLabel',
            title: 'PDF Label',
            type: 'string',
        }),
        defineField({
            name: 'downloadButtonText',
            title: 'Download Button Text',
            type: 'string',
        }),
        defineField({
            name: 'pdfFile',
            type: 'file',
            title: 'PDF File',
            options: {
                accept: 'application/pdf',
            },

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
                title: 'Service Cost Model',
            };
        }
    },
})
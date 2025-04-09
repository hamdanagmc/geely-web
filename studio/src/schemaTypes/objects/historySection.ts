import { defineField, defineType } from "sanity";

export const historySection = defineType ({
    name : 'historySection',
    type : 'object',
    title : 'History Section',
    fields : [
        defineField({
            name : 'items',
            type : 'array',
            of :[
                {type : 'historyItem'}
            ]
        })
    ],
    preview: {
        select: {
            subtitle: 'items.length'
        },
        prepare(selection) {
            const {  subtitle } = selection;
            return {
                title: 'History Section',
                subtitle: 'items - ' + subtitle,
            };
        }
    }
})
import { defineField, defineType } from "sanity";

export const iconTextList = defineType({
    name :'iconTextList',
    type :  'object',
    title : 'Icon Text List',

    fields : [
        defineField({
            name : 'titleText',
            type : 'text',
            title : 'Title Text',
        }),
        defineField({
            name : 'items',
            type : 'array',
            title : 'Items',
            of : [{type : 'iconTextItem'}]
        }),
    ],
    preview: {
        select: {
            items: 'items'
        },
        prepare(selection) {
            const { items } = selection;
            return {
                title: `Icon Text List (${items?.length || 0} items)`
            };
        }
    }
})
import { defineField, defineType } from "sanity";

export const networkListSection = defineType({
    name : 'networkListSection',
    type : 'object',
    title : 'Geely Network List Section',
    fields : [
        defineField({
            name : 'foundLabel',
            type : 'string',
            title : 'Found Label',
        }),
        defineField({
            name : 'limit',
            type : 'number',
            title : 'Limit',
        }),
    ],
    preview : {
        select : {
            limit : 'limit',
        },
        prepare({limit}) {
            return {
                title : 'Geely Network List List Section',
                subtitle : limit
            }
        }
    }
})
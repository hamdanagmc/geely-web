import { defineField, defineType } from "sanity";

export const termsAndConditionSection = defineType({
    name : 'termsAndConditionSection',
    type : 'object',
    title : 'Terms & Condition Section',
    fields : [
        defineField({
            name : 'title',
            type : 'string',
        }),
        defineField({
            name : 'richText1',
            type : 'blockContent',
            title : 'First Column Rich Text'
        }),
        defineField({
            name : 'richText2',
            type : 'blockContent',
            title : 'Second Column Rich Text'
        }),
    ],
    preview : {
        select : {
            title : 'title',
        }
    }
})
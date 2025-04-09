import { defineArrayMember, defineField, defineType } from "sanity";

export const historyItem = defineType({
    name : 'historyItem',
    type : 'object',
    title : 'History Item',
    fields : [
        
        defineField({
            name : 'year',
            type : 'number',
        }),
        defineField({
            name : 'imageList',
            type : 'array',
            description : 'image size should be 1200x640 pixels',
            of :[
                {type : 'customImage'}
            ]
        }),
        defineField({
            name : 'textList',
            type : 'array',
            of :[
                defineArrayMember({type : 'text'})
            ]
        }),
    ]
})
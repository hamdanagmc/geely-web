import { defineField, defineType } from "sanity";

export const vehicleListSection = defineType({
    name : 'vehicleListSection',
    type : 'object',
    title : 'Vehicle List Section',
    fields : [
        defineField({
            name : 'title',
            type : 'string',
            title : 'title',
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
                title : 'Vehicle List Section',
                subtitle : limit
            }
        }
    }
})
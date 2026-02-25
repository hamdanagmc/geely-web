import { defineField, defineType } from "sanity";

export const promoCodes = defineType({
    name: 'promoCodes',
    title: 'Promo Codes',
    type: 'document',
    fields: [
        defineField({
            name: 'codes',
            type: 'array',
            of: [
                defineField({
                    name: 'code',
                    type: 'string',
                    title: 'Promo Code'
                }),
            ]
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Promo Codes',
            }
        },
    },
});
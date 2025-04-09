import { defineType } from 'sanity';

export const sideKickSection = defineType({
    name: 'sideKickSection',
    type: 'object',
    title: 'Side Kick Section',
    fields: [
        {
            name: 'logo',
            type: 'customImage',
            title: 'Logo'
        },
        {
            name: 'iconLinkList1',
            type: 'iconLinkList',
            title: 'Icon Link List 1',
        },
        {
            name: 'iconLinkList2',
            type: 'iconLinkList',
            title: 'Icon Link List 2',
        }
    ]
});
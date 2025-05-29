import { defineField, defineType } from 'sanity';

export const optOutLead = defineType({
    name: 'optOutLead',
    type: 'document',
    title: 'Opt Out Lead',
    fields: [
        defineField({
            name: 'name',
            type: 'string',
            title: 'Name',
        }),
        defineField({
            name: 'email',
            type: 'string',
            title: 'Email',
        }),
        defineField({
            name: 'phone',
            type: 'string',
            title: 'Phone',
        }),
        defineField({
            name: 'stopMarketing',
            type: 'string',
            title: 'Do you wish to stop marketing emails?',
        }),
        
    ],
});
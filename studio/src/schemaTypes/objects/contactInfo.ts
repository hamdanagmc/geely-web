import { defineField, defineType } from "sanity";

export const contactInfo = defineType({
    name: 'contactInfo',
    type: 'object',
    title: 'Contact Info',
    fields: [
        defineField({
            name: 'heading',
            type: 'string',
            title: 'Heading',
        }),
        defineField({
            name: 'subHeading',
            type: 'string',
            title: 'Sub Heading',
        }),
        defineField({
            name: 'contactMessage',
            type: 'blockContent',
            title: 'Contact Message',
        }),
        defineField({
            name: 'emailLabel',
            type: 'string',
            title: 'Email Label',
        }),
        defineField({
            name: 'email',
            type: 'string',
            title: 'Email',
        }),
        defineField({
            name: 'phoneLabel',
            type: 'string',
            title: 'Phone Label',
        }),
        defineField({
            name: 'phone',
            type: 'string',
            title: 'Phone',
        }),
        defineField({
            name: 'whatsappLink',
            type: 'url',
            title: 'WhatsApp Link',
        }),
        defineField({
            name: 'image',
            type: 'customImage',
            description: 'image size should be 415x415 pixels',
            title: 'Image',
        }),
    ],
    preview: {
        select: {
            title: 'heading',
            subtitle: 'subHeading',
            media: 'image',
        },
    },
});
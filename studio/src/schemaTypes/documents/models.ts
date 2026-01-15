import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType, validation } from "sanity";
import { i18n } from "../../../language";

export const models = defineType({
    name: 'models',
    type: 'document',
    title: 'Models',
    icon: DocumentIcon,
    fields: [
        defineField({
            name: 'modelName',
            type: 'string',
            title: 'Model Name',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            validation: (Rule) => Rule.required(),
            options: {
                source: 'modelName',
                maxLength: 96,
            },
        }),	
        defineField({
            name : 'trimCheck',
            type : 'string',
            title : 'Trim Check',
            options :{
                list :[
                    {title : "Trim", value : 'trim'}
                ],
                layout : 'radio'
            }
        }),
        defineField({
            name : 'names',
            title : 'Names',
            type : 'array',
            of : [{type : 'string'}]
        }),
        defineField({
            name: 'language',
            title: 'Language',
            type: 'string',
            options: {
                list: i18n.languages.map((l) => l.id),
                layout: 'dropdown',
            },
            readOnly: true,
        }),

    ],
    preview: {
        select: {
            title: 'modelName',
        },
    },
})
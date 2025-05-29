import { defineType,defineField } from "sanity";

export const appointmentError=defineType({
    name: 'appointmentError',
    title: 'Appointment Error',
    type: 'object',
    fields:[
          defineField({
                    name: 'heading',
                    title: 'Heading',
                    type: 'string'
                }),
                defineField({
                    name: 'subHeadingOne',
                    title: 'Sub Heading One',
                    type: 'string'
                }),
                defineField({
                     name: 'subHeadingTwo',
                    title: 'Sub Heading Two',
                    type: 'string'
                }),
                defineField({
                    name: 'helpText',
                    title: 'Help Text',
                    type: 'string',
                }),
                defineField({
                    name: 'tryAgainButton',
                    title: 'Try Again Button',
                    type: 'string',
                }),
                defineField({
                    name : 'tryAgainLink',
                    type : 'reference',
                    title : 'Try Again Button Link',
                    to : [{type : 'page'}]
                  }),
    ]

})
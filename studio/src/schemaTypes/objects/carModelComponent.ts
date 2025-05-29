// carModelComponent.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'carModelComponent',
  type: 'object',
  title: 'Vehicle Card',
  fields: [
    defineField({
      name: 'mainTitle',
      type: 'string',
      title: 'block Title',
    }),
    defineField({
      name: 'carModels',
      type: 'array',
      title: 'Car Models',
      of: [
        {
          type: 'object',
          name: 'carModel',
          title: 'Car Model',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              description: 'image size should be 950x730 pixels',
              title: 'Image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'carTitleLogo',
              type: 'image',
              description:"image size should be 1070x184 pixels",
              title: 'Car Title Logo',
              options: { hotspot: true },
            }),
            defineField({
              name: 'carTitleLogoHover',
              type: 'image',
              description:"image size should be 679x117 pixels",
              title: 'Car Title Logo Hover',
              options: { hotspot: true },
            }),
            defineField({
              name: 'title',
              type: 'string',
              title: 'Title',
            }),
            defineField({
              name: 'subtitle',
              type: 'string',
              title: 'Subtitle',
            }),
            defineField({
              name: 'spec1',
              type: 'string',
              title: 'Spec 1',
            }),
            defineField({
              name: 'spec2',
              type: 'string',
              title: 'Spec 2',
            }),
            defineField({
              name: 'spec3',
              type: 'string',
              title: 'Spec 3',
            }),
            defineField({
              name: 'specDetails',
              type: 'array',
              title: 'Spec Details',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'icon',
                      description:'icon size should be 30x30 pixels',
                      type: 'image',
                      title: 'Icon',
                      options: { hotspot: true },
                    }),
                    defineField({
                      name: 'description',
                      type: 'string',
                      title: 'Description',
                      readOnly : true,
                      deprecated : {reason : 'Use Rich Text field instead! This field will be removed in future version.'}
                    }),
                    defineField({
                      name: 'richText',
                      type: 'richText',
                      title: 'Description',
                    }),
                  ],
                },
              ],
            }),
            defineField({
              name: 'exploreLink',
              type: 'object',
              title: 'Explore Link',
              fields : [
                defineField({
                  name : 'text',
                  type : 'string',
                  title : 'Link Text',
                }),
                defineField({
                  name : 'link',
                  type : 'reference',
                  title : 'Select Car Detail Page',
                  to : [{type : 'car'}],
                  readOnly: true,
                  deprecated: {
                  reason: 'deprecated for future use',
                  }
                }),
                defineField({
                  name: 'externalLink',
                  type: 'link',
                  title: 'External Link'
                })
              ]
            }),
            defineField({
              name: 'getQuoteLink',
              type: 'object',
              title: 'Get Quote Link',
              fields : [
                defineField({
                  name : 'text',
                  type : 'string',
                  title : 'Link Text',
                }),
                defineField({
                  name : 'link',
                  type : 'string',
                  title : 'Link',
                }),
              ]
            }),
            defineField({
              name: 'testDriveLink',
              type: 'object',
              title: 'Test Drive Link',
              fields : [
                defineField({
                  name : 'text',
                  type : 'string',
                  title : 'Link Text',
                }),
                defineField({
                  name : 'link',
                  type : 'string',
                  title : 'Link',
                }),
              ]
            }),
            defineField({
              name: 'imagePosition',
              type: 'string',
              title: 'Image Position',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Right', value: 'right' },
                ],
                layout: 'radio',
              },
              initialValue: 'left',
            }),
            defineField({
              name: 'cardPosition',
              type: 'string',
              title: 'Card Position',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Right', value: 'right' },
                ],
                layout: 'radio',
              },
              initialValue: 'right',
            }),
            defineField({
              name: 'cardBackgroundColor',
              type: 'object',
              title: 'Card Background Color',
              fields: [{ name: 'hex', type: 'string', title: 'Hex' }],
            }),
            defineField({
              name: 'cardBackgroundImage',
              type: 'image',
              title: 'Card Background Image',
              description: 'image size should be 606x737 pixels',
              options: { hotspot: true },
            }),
          ],
        },
      ],
    }),
  ],
});

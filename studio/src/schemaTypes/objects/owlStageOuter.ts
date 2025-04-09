// schemas/stylishDesignSection.ts
import {  defineField, defineType } from 'sanity';

export const owlStageOuter = defineType({
    name: 'owlStageOuter',
    title: 'Vehcile specification slider',
    type: 'object',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
      },
      {
        name: 'slides',
        title: 'Slides',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Title',
                type: 'string',
              },
              {
                name: 'description',
                title: 'Description',
                type: 'text',
              },
              {
                name: 'image',
                title: 'Image',
                type: 'customImage',
                description: 'image size should be 1560x750 pixels ',
              },
              {
                name: 'mobileImage',
                title: 'Mobile Image (Optional)',
                description:"image size should be 375x600 pixels",
                type: 'customImage',
              },
            ],
          },
        ],
      },
      defineField({
        name : 'htmlId',
        type : 'string',
        title : 'ID Attribute',
        description : 'Unique identifier for the banner component'
      }),
    ],
    preview: {
      select: {
        title: 'title',
        media: 'slides[0].image',
      },
      prepare({title, media}) {
        return {
          title: title ?? 'Vehicle Specification Slider',
          media: media,
        };
      },
    },
  });
  

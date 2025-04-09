// imageGallery.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'imageGallery',
  type: 'object',
  title: 'Image Gallery',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'images',
      type: 'array',
      title: 'Images',
      description:"image size should be 1200x700 pixels",
      of: [
        {
          type: 'image',
          options: { hotspot: true }, // Allow image cropping/focus
          fields: [ // Add fields to each image
            {
              name: 'altText',
              type: 'string',
              title: 'Alt Text',
            },
            {
                name: 'caption',
                type: 'string',
                title: 'Caption',
            }
          ],
        },
      ],
    }),
  ],
});
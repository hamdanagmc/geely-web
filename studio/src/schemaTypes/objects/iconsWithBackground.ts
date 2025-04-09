

// schemas/iconsWithBackground.js  (Schema file name)
export default {
  name: 'iconsWithBackground', // Schema name
  title: 'Icons with Background', // Title in Sanity Studio
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'icons', // Renamed from coreValues to icons
      title: 'Icons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image', // Or 'icon' if using icon libraries
              title: 'Image/Icon',
              type: 'image', // Or 'string' if using icon libraries
              options: {
                hotspot: true, // If using image uploads
              },
              // validation: (Rule) => Rule.required(), // Make required if necessary
            },
            {
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
          ],
        },
      ],
    },
  ],
};
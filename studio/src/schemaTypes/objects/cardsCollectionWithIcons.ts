// schemas/cardsCollectionWithIcons.js
export default {
    name: 'cardsCollectionWithIcons',
    title: 'Icons with grid & heading',
    type: 'object',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text', // Or 'array', of: [{ type: 'block' }] for rich text
      },
      {
        name: 'cards',
        title: 'Cards',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'icon', // Could be an image or a string for an icon library
                title: 'Icon/Image',
                type: 'customImage', // Or 'string' if using icon library names
                options: {
                  hotspot: true, // If using image uploads
                },
              },
              {
                name: 'title',
                title: 'Title',
                type: 'string',
                validation: (Rule: any) => Rule.required(),
              },
              {
                name: 'description',
                title: 'Description',
                type: 'text', // Or 'array', of: [{ type: 'block' }] for rich text
                validation: (Rule: any) => Rule.required(),
              },
            ],
          },
        ],
      },
    ],
  };
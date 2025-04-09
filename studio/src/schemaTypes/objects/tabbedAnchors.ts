// schemas/tabbedAnchors.js
export default {
    name: 'tabbedAnchors',
    title: 'Text with anchors',
    type: 'object',
    fields: [
      {
        name: 'tabs',
        title: 'Tabs',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'label',
                title: 'Label',
                type: 'string',
                validation: (Rule: any) => Rule.required(),
              },
              {
                name: 'content',
                title: 'Content',
                type: 'array',
                of: [{ type: 'block' }], // Use Sanity's rich text editor
                validation: (Rule: any) => Rule.required(),
              },
              {
                name: 'anchorId', // For linking/navigation
                title: 'Anchor ID',
                type: 'string',
                description: 'Unique ID for the tab (e.g., legal-statement, product-service).  Use lowercase and hyphens.',
                validation: (Rule: any) => Rule.required(),
              },
            ],
          },
        ],
      },
    ],
  };

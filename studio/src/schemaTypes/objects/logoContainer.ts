// schemas/logoContainer.js
// import { RuleType } from '@sanity/types'; // Removed as RuleType is not exported

import { description } from "../../lib/initialValues";

export default {
    name: 'logoContainer',
    title: 'Logo grid',
    type: 'object',
    fields: [
      {
        name: 'logos',
        title: 'Logos',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'image',
                title: 'Logo Image',
                description:'image size should be 50x50 pixels',
                type: 'customImage',
                options: {
                  hotspot: true,
                },
                validation: (Rule: any) => Rule.required(),
              },
              {
                name: 'link',
                title: 'Link (URL)',
                type: 'string', // Use 'url' type for URLs
                description: 'Optional URL to link the logo to.',
              },
            ],
          },
        ],
        validation: (Rule: any) => Rule.min(1).error('At least one logo is required'),
      },
    ],
  };
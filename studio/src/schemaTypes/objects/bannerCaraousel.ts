import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'bannerCarousel',
  type: 'object',
  title: 'Hero slider',
  fields: [
    defineField({
      name: 'textAlign',
      type: 'boolean',
      title: 'Text Align Top',
      description: 'Enable text alignment at top of banner',
      initialValue: false,
    }),

    defineField({
      name: 'slides',
      type: 'array',
      title: 'Slides',
      of: [
        {
          type: 'object',
          name: 'slide',
          title: 'Slide',
          fields: [
            {
              name: 'desktopImage',
              type: 'customImage',
              title: 'Desktop Image',
              description: 'Image size should be 2500x1500 pixels',
              options: { hotspot: true },
            },
            {
              name: 'mobileImage',
              type: 'customImage',
              title: 'Mobile Image',
              description: 'Image size should be 750x1650 pixels',
              options: { hotspot: true },
            },
            {
              name: 'tabImage',
              type: 'customImage',
              title: 'Tablet Image',
              description: 'Image size should be 1024x1366 pixels',
              options: { hotspot: true },
            },
            {
              name: 'logoImage',
              type: 'customImage',
              title: 'Logo Image',
              description: 'Image size should be 50x50 pixels',
              options: { hotspot: true },
            },
            { name: 'headingText', type: 'string', title: 'Heading Text' },
            { name: 'learnMoreTitle', type: 'string', title: 'Learn More Title' },
            { name: 'learnMoreLink', type: 'string', title: 'Learn More Link' },
            { name: 'testDriveTitle', type: 'string', title: 'Test Drive Title' },
            { name: 'testDriveLink', type: 'string', title: 'Test Drive Link' },
            {
              name: 'link',
              type: 'reference',
              title: 'Select Car Detail Page',
              to: [{ type: 'car' }],
            },
          ],
        },
      ],
    }),
  ],
});

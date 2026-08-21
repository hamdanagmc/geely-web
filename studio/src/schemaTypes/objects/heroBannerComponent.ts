// heroBannerComponent.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'heroBannerComponent',
  type: 'object',
  title: 'Hero Banner Component',
  fields: [
    defineField({
      name: 'htmlId',
      type: 'string',
      title: 'ID Attribute',
      description: 'Unique identifier for the banner component'
    }),
    defineField({
      name: 'desktopImage',
      type: 'image',
      title: 'Desktop Image',
      description: 'Image displayed on larger screens and size should be 1220x434 pixels.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mobileImage', // Optional: Separate mobile image
      type: 'image',
      title: 'Mobile Image',
      description: 'Optional: Image displayed on smaller screens.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'videoId',
      type: 'string',
      title: 'Vimeo Video ID',
      readOnly: true,
      deprecated: { reason: "Use the Vimeo Video ID field instead. This field will be removed in future versions!" },
      description: 'Please provide video id from vimeo'
    }),
    defineField({
      name: 'video',
      type: 'mux.video',
      title: 'Video',
      description: 'Please upload video',
    }),
    defineField({
      name: 'titleLogo',
      type: 'image',
      title: 'Title Logo',
      options: { hotspot: true },
    }),
    defineField({
      name: 'brandTitle',
      type: 'string',
      title: 'Brand Title',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Heading Text',
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Sub Heading Text',
    }),
    defineField({
      name: 'testDriveTitle',
      type: 'string',
      title: 'Test Drive Button Title',
    }),
    defineField({
      name: 'testDriveLink',
      type: 'string',
      title: 'Test Drive Button Link',
    }),
    defineField({
      name: 'link',
      type: 'reference',
      title: 'Select Car Detail Page',
      to: [{ type: 'car' }]
    }),
    defineField({
      name: 'brochureTitle',
      type: 'string',
      title: 'Brochure Button Title',
    }),
    defineField({
      name: 'brochurePageLink',
      title: 'Select Page Link',
      type: 'reference', // Using the existing link schema
      to: [{ type: 'page' }]
    }),
    defineField({
      name: 'preBook',
      title: 'Pre-book Button Display Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'enable',
          title: 'Enable Pre-book Button',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'preBookButton',
          title: 'Pre-book Button Title',
          type: 'string',
          hidden: ({ parent }) => !parent?.enable,
        }),
        defineField({
          name: 'preBookButtonLink',
          title: 'Select Page Link',
          type: 'reference',
          to: [{ type: 'page' }],
          hidden: ({ parent }) => !parent?.enable,
        }),
        defineField({
          name: 'price',
          title: 'Price',
          type: 'number',
          hidden: ({ parent }) => !parent?.enable,
          validation: (Rule) =>
            Rule.custom((value, context) => {
              if ((context.parent as any)?.enable && (value === undefined || value === null)) {
                return 'Price is required when Pre-book is enabled';
              }
              return true;
            }),
        }),
      ],
    }),
  ],
});

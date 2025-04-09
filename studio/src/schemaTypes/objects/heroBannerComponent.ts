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
      description: 'Please provide video id from vimeo'
    }),
    defineField({
      name: 'video',
      type: 'mux.video',
      title: 'Video',
      description: 'Please upload video',
      readOnly: true,
      deprecated: { reason: "Use the Vimeo Video ID field instead. This field will be removed in future versions!" }
    }),
    defineField({
      name: 'titleLogo',
      type: 'image',
      title: 'Title Logo',
      options: { hotspot: true },
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title Text',
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle Text',
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
      name : 'link',
      type : 'reference',
      title : 'Select Car Detail Page',
      to : [{type : 'car'}]
    }),
    defineField({
      name: 'brochureTitle',
      type: 'string',
      title: 'Brochure Button Title',
    }),
    defineField({
      name: 'brochureFile',
      type: 'file',
      title: 'Brochure File',
      options: {
        accept: 'application/pdf',
      },
      
    }),
  ],
});

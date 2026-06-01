import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'heroVideoComponent',
  type: 'object',
  title: 'Vehicle hero with video (Mux)',
  fields: [
    defineField({
      name : 'htmlId',
      type : 'string',
      title : 'ID Attribute',
      description : 'Unique identifier for the banner component'
    }),
    defineField({
      name : 'videoId',
      type : 'string',
      title : 'Vimeo Video ID',
      readOnly: true,
      deprecated: { reason: "Use the Vimeo Video ID field instead. This field will be removed in future versions!" },
      description : 'Please provide video id from vimeo'
    }),
    defineField({
      name: 'video',
      type: 'mux.video',
      title: 'Video',
      description: 'Please upload video',
    }),
    defineField({
      name: 'muted',
      type: 'boolean',
      title: 'Muted',
      description: 'Should the video be muted by default?',
      initialValue: true, // Default to muted
    }),
    defineField({
      name: 'loop',
      type: 'boolean',
      title: 'Loop',
      description: 'Should the video loop?',
      initialValue: true, // Default to loop
    }),
    defineField({
      name: 'autoplay',
      type: 'boolean',
      title: 'Autoplay',
      description: 'Should the video autoplay?',
      initialValue: true, // Default to autoplay
    }),
     defineField({
      name: 'overlayText',
      type: 'string',
      title: 'Overlay Text',
      description: 'Text to display over the video (optional).',
    }),
    defineField({
      name: 'overlayButton',
      type: 'object',
      title: 'Overlay Button',
      fields: [
        { name: 'text', type: 'string', title: 'Button Text' },
        { name: 'link', type: 'url', title: 'Button Link' },
      ],
      description: 'Button to display over the video (optional).',
    }),
  ],
  preview: {
    select: {
      title: 'overlayText',
      media: 'posterImage',
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title: title || 'No overlay text',
        media,
      };
    },
  },
});
// historyVision.ts (Sanity Schema)
import { defineType } from 'sanity';

export default defineType({
  name: 'historyVision',
  type: 'object',
  title: 'Hover image grid',
  fields: [
    {
      name: 'spacing',
      type: 'boolean',
      description: 'Enable spacing above and below the image',
      title: 'Spacing (Top & Bottom)',
    },
    {
      name: 'historyImage',
      type: 'customImage',
      description: 'image size should be 881x730 pixels',
      title: 'History Image',
      options: { hotspot: true },
    },
    {
      name: 'historyTitle',
      type: 'string',
      title: 'History Title',
    },
    {
      name: 'historyDescription',
      type: 'text', // Use 'text' for multi-line descriptions
      title: 'History Description',
    },
    {
      name: 'historyFileTitle',
      type: 'string',
      title: 'History File Title',
    },
    {
      name: 'historyFile',
      type: 'file',
      title: 'History PDF File',
      options: {
        accept: 'application/pdf',
      }, 
    },
    {
      name: 'visionImage',
      type: 'customImage',
      description: 'image size should be 881x730 pixels',
      title: 'Vision Image',
      options: { hotspot: true },
    },
    {
      name: 'visionTitle',
      type: 'string',
      title: 'Vision Title',
    },
    {
      name: 'visionDescription',
      type: 'text',
      title: 'Vision Description',
    },
    {
      name: 'visionFileTitle',
      type: 'string',
      title: 'Vision File Title',
    },
    {
      name: 'visionFile',
      type: 'file',
      title: 'Vision PDF File',
      options: {
        accept: 'application/pdf',
      }, 
    },
  ],
});


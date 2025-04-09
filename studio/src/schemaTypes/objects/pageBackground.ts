// pageBackground.ts (Sanity Schema)
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'pageBackground',
  type: 'object',
  title: 'Hero only image',
  fields: [
    defineField({
      name: 'desktopImage',
      type: 'customImage',
      description:"image size should be 2500x1500 pixels",
      title: 'Desktop Background Image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'tabletImage',
      type: 'customImage',
      title: 'Tablet Background Image',
      description: 'image size should be 1024x1366 pixels',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mobileImage',
      description: 'image size should be 750x1651 pixels',
      type: 'customImage',
      title: 'Mobile Background Image',
      options: { hotspot: true },
    }),
    defineField({
        name: 'position',
        type: 'string',
        title: 'Background Position',
        description: 'Choose how to position the background image',
        options: {
          list: [
            { title: 'Top', value: 'top' },
            { title: 'Center', value: 'center' },
            { title: 'Bottom', value: 'bottom' },
            { title: 'Left', value: 'left' },
            { title: 'Right', value: 'right' },
            { title: 'Top Left', value: 'top left' },
            { title: 'Top Right', value: 'top right' },
            { title: 'Bottom Left', value: 'bottom left' },
            { title: 'Bottom Right', value: 'bottom right' },
          ],
        },
      }),
      defineField({
        name: 'size',
        type: 'string',
        title: 'Background Size',
        description: 'Choose how to size the background image',
        options: {
          list: [
            { title: 'Contain', value: 'contain' },
            { title: 'Cover', value: 'cover' },
            { title: 'Auto', value: 'auto' },
            { title: '100% 100%', value: '100% 100%' },
          ],
        },
      }),
  ],
  preview: {
    select: {
      title: 'desktopImage.image',
      media: 'desktopImage.image',
    },
    prepare(selection) {
      const { title, media } = selection;
      let updatedTitle = title ? title.asset.url : '';
      return {
        title: 'Hero Image',
        subtitle: updatedTitle,
        media,
      };
    },
  }
});

import { defineArrayMember, defineField, defineType } from 'sanity';
import { i18n } from '../../../language';

export const offer = defineType({
  name: 'offer',
  type: 'document',
  title: 'Offer',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'subTitle',
      title: 'Sub Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'offerDetailLabel',
      title: 'Offer Details Button Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      description:'image size should be 600x400 pixels',
      type: 'customImage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Detail Page Image',
      description:"image size should be 1536x525 pixels",

      type: 'customImage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name : 'link',
      type : 'reference',
      title : 'Select thankyou Page',
      to : [{type : 'page'}]
     }),

    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: i18n.languages.map((l) => l.id),
        layout: 'dropdown',
      },
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subTitle',
      media: 'thumbnail',
    },
  },
});
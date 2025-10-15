import { defineArrayMember, defineField, defineType } from 'sanity';
import { i18n } from '../../../language';

export const offer = defineType({
  name: 'offer',
  type: 'document',
  title: 'Offer',
  groups: [
    {
      name: 'basic',
      title: 'Basic',
    },
    {
      name: 'advanced',
      title: 'Advanced',
    },
    {
      name: 'form',
      title: 'Offer Detail Form',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group : 'basic',
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
      group : 'basic',
    }),
    defineField({
      name: 'subTitle',
      title: 'Sub Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group : 'basic',
    }),
    defineField({
      name: 'offerDetailLabel',
      title: 'Offer Details Button Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group : 'basic',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      description:'image size should be 600x400 pixels',
      type: 'customImage',
      validation: (Rule) => Rule.required(),
      group : 'basic',
    }),
    defineField({
      name: 'mainImage',
      title: 'Detail Page Image',
      description:"image size should be 1536x525 pixels",

      type: 'customImage',
      validation: (Rule) => Rule.required(),
      group : 'basic',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      group : 'basic',
    }),
    defineField({
      name : 'link',
      type : 'reference',
      title : 'Select thankyou Page',
      to : [{type : 'page'}],
      group : 'basic',
     }),

     defineField({
      name: 'offerDetailForm',
      title: 'Offer Detail Form',
      type: 'offerDetailForm',
      group: 'form',
    }),

    //hide from the site
    defineField({
      name: 'isHidden',
      title: 'Hide Offer from the site',
      type: 'boolean',
      initialValue: false,
      group : 'advanced',
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
      group : 'advanced',
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
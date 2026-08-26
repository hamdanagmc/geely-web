import { defineField, defineType } from 'sanity'

const getStatusObjectField = (name: string, title: string) => defineField({
  name,
  title,
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Supports {{username}}',
    }),
    defineField({
      name: 'paragraph',
      title: 'Paragraph',
      type: 'blockContent',
      description: 'Supports {{bookingReference}} and {{paymentStatus}}',
    }),
    defineField({
      name: 'ctaHeadingText',
      title: 'CTA Heading Text',
      type: 'string',
    }),
    defineField({
      name: 'cta',
      title: 'CTA Link',
      type: 'link',
    }),
  ]
})

export const preBookThankyouComponent = defineType({
  name: 'preBookThankyouComponent',
  title: 'PreBook Thankyou Component',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional heading to show on the thank you page',
    }),
    defineField({
      name: 'showBookingReference',
      title: 'Show booking reference',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'notes',
      title: 'Notes / instructions',
      type: 'text',
    }),
    getStatusObjectField('successObject', 'Success Block'),
    getStatusObjectField('pendingObject', 'Pending Block'),
    getStatusObjectField('failedObject', 'Failed Block'),
  ],
})

export default preBookThankyouComponent

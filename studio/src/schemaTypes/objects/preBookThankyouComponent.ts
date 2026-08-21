import { defineType } from 'sanity'

export const preBookThankyouComponent = defineType({
  name: 'preBookThankyouComponent',
  title: 'PreBook Thankyou Component',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional heading to show on the thank you page',
    },
    {
      name: 'showBookingReference',
      title: 'Show booking reference',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'notes',
      title: 'Notes / instructions',
      type: 'text',
    },
  ],
})

export default preBookThankyouComponent

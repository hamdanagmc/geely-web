// showrooms.ts (Sanity Schema)
import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import { i18n } from '../../../language'

export default defineType({
  name: 'showrooms',
  type: 'object',
  title: 'Showrooms',
  fields: [
    defineField({
      name: 'showroomList',
      type: 'array',
      title: 'Showroom List',
      of: [
        {
          type: 'object',
          name: 'showroom',
          title: 'Showroom',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Title',
            }),
            defineField({
              name: 'mapImage',
              type: 'image',
              title: 'Map Image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'mapLink',
              type: 'url',
              title: 'Map Link',
            }),
            defineField({
              name: 'address',
              type: 'array',
              title: 'Address',
              of: [{ type: 'string' }], // Array of strings for address lines
            }),
            defineField({
              name: 'phoneNumber',
              type: 'string',
              title: 'Phone Number',
            }),
            defineField({
              name: 'workingHours',
              type: 'array',
              title: 'Working Hours',
              of: [{ type: 'string' }], // Array of strings for working hours
            }),
            defineField({
                name: 'isQuickService',
                type: 'boolean',
                title: 'Is Quick Service?',
                description: 'Check if this is a quick service location'
            })
          ],
        },
      ],
    }),
  ],
});
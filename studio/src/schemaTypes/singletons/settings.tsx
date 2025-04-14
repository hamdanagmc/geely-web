import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import * as demo from '../../lib/initialValues'

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      name: 'social',
      title: 'Social',
    },
    
  ],

  fields: [

    defineField({
      name: 'facebookLink',
      title: 'Facebook Link',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'instagramLink',
      title: 'Instagram Link',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'twitterLink',
      title: 'Twitter Link',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'youtubeLink',
      title: 'YouTube Link',
      type: 'url',
      group: 'social',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})

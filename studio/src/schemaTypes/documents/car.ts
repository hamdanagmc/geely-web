import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import { i18n } from '../../../language'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const car = defineType({
  name: 'car',
  title: 'Car',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'basic', title: 'Basic' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'basic',
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
      group: 'basic',
    }),
    
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [{type: 'heroVideoComponent'}, {type: 'heroBannerComponent'}, {type: 'stickyTabsComponent'}, {type: 'featureHighlightsComponent'}, {type:'car360'}, {type:'richText'}, {type: 'richTextheadingPara'}, 
        {type:"owlStageOuter"}, {type:'comfortSlider'}], 
      options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
      group: 'basic',
    }),
    defineField({
      title: "Seo",
      name: "seo",
      type: "seoMetaFields",
      group: 'seo',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: i18n.languages.map(l => l.id),
        layout: 'dropdown',
      },
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      locale : 'language',
    },
    prepare({ title, subtitle, locale }) {
      return {
        title,
        subtitle : `locale : ${locale}, slug : ${subtitle}`,
      }
    }
  }
})
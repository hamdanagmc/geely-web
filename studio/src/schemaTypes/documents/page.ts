import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { i18n } from '../../../language'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
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
      name: "blackBackground",
      type: "boolean",
      title: "Active White Background",
      description: "Toggle to enable Text black and white Background",
      initialValue: false, // Default value (optional)
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',

      of: [
        { type: 'callToAction' },
        { type: 'infoSection' },
        { type: 'customImage' },
        { type: 'bannerCarousel' },
        { type: 'richTextheadingPara' },
        { type: 'historyVision' },
        { type: 'shoppingTools' },
        { type: 'listCars' },
        { type: 'imageGallery' },
        { type: 'pageBackground' },
        { type: 'spotlightSection' },
        { type: 'parallaxSection' },
        { type: 'richText' },
        { type: 'backgroundWithCaption' },
        { type: 'imageTextSlider' },
        { type: 'parallaxWithRichText' },
        { type: 'heroImageSlider' },
        { type: 'cardHoverComponent' },
        { type: 'carModelComponent' },
        { type: 'image' },
        { type: 'newsList' },
        { type: 'tabbedAnchors' },
        { type: 'imageTextRightLeft' },
        { type: 'iconsWithBackground' },
        { type: 'logoContainer' },
        { type: 'cardsCollectionWithIcons' },
        { type: 'iframe' },
        { type: 'contactFormSection' },
        { type: 'customerCareFormSection' },
        { type: 'iconLinkList' },
        { type: 'referenceComponent' },
        { type: 'sideKickSection' },
        { type: 'heroCenteredHeading' },
        { type: 'vehicleListSection' },
        { type: 'networkListSection' },
        { type: 'requestQuoteForm' },
        { type: 'serviceBookingForm' },
        { type: 'imagesAndVideosSection' },
        { type: 'termsAndConditionSection' },
        { type: 'historySection' },
        { type: 'orderServiceSection' },
        { type: 'heroVideoComponent' },

        { type: 'heroFleetSales' },
        { type: 'iconTextList' },
        { type: 'fleetTextImage' },
        { type: 'contactInfo' },
        { type: 'fleetVehicleList' },
        { type: 'fleetContactFormSection' },
        { type: 'heroBrochureDownload' },
        { type: 'brochureDownloadFormSection' },
        { type: 'thankyouRichText' },
        { type: 'thankyouBanner' }
      ],

      options: {
        insertMenu: {
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
      title: 'Seo',
      name: 'seo',
      type: 'seoMetaFields',
      group: 'seo',
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
      subtitle: 'slug.current',
      locale: 'language',
    },
    prepare({ title, subtitle, locale }) {
      return {
        title,
        subtitle: `locale : ${locale}, slug : ${subtitle}`,
      };
    },
  },
});

/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import { defineConfig, isKeyedObject } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/schemaTypes'
import { structure } from './src/structure'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'
import { assist } from '@sanity/assist'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { documentInternationalization } from '@sanity/document-internationalization';
import { i18n } from './language'
import { languageFilter } from '@sanity/language-filter'
import { muxInput } from 'sanity-plugin-mux-input';
import { media } from 'sanity-plugin-media';
import { seoMetaFields } from "sanity-plugin-seo";
import { leadPlugin } from './src/plugin/leads/plugin'
import { optOutLeadPlugin } from './src/plugin/optOutLeads/plugin'
import { table } from '@sanity/table'
import { DeleteByDateRangeTool } from './src/tools/DeleteByDateRange'
import { TrashIcon } from '@sanity/icons'
import { promoLeadPlugin } from './src/plugin/promoLeads/plugin'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// URL for preview functionality, defaults to localhost:3000 if not set
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

// Define the home location for the presentation tool
const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation

// resolveHref() is a convenience function that resolves the URL
// path for different document types and used in the presentation tool.
function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'post':
      return slug ? `/posts/${slug}` : undefined
    case 'page':
      return slug ? `/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}

// Main Sanity configuration
export default defineConfig({
  name: 'default',
  title: 'Geely UAE',

  projectId,
  dataset,

  plugins: [
    // internationalization
    documentInternationalization({
      supportedLanguages: i18n.languages,
      schemaTypes: [`page`, `fragment`,'car', 'news', 'offer', 'models', 'serviceCost', 'sparePart' ], 
      // Optional
      // Customizes the name of the language field
      languageField: `language`, // defauts to "language"
    }),
    internationalizedArray({
      languages: i18n.languages,
      defaultLanguages: [i18n.base ? i18n.base : 'en'],
      fieldTypes: ['string', 'text'],
    }),
    languageFilter({
      supportedLanguages: i18n.languages,
      defaultLanguages: [i18n.base ? i18n.base : 'en'],
      documentTypes: [`page`, `fragment`, 'car', 'carColor','news', 'offer', 'models', 'serviceCost', 'sparePart'],
      filterField: (enclosingType, member, selectedLanguageIds) => {
        if (
          enclosingType.jsonType === 'object' &&
          enclosingType.name.startsWith('internationalizedArray') &&
          'kind' in member
        ) {
          const language = isKeyedObject(member.field.path[1]) ? member.field.path[1]._key : null

          return language ? selectedLanguageIds.includes(language) : false
        }

        // Filter internationalized objects
        // `localeString` must be registered as a custom schema type
        if (enclosingType.jsonType === 'object' && enclosingType.name.startsWith('locale')) {
          return selectedLanguageIds.includes(member.name)
        }

        return true
      },
    }),
    // Presentation tool configuration for Visual Editing
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/presentation-resolver-api#57720a5678d9
        mainDocuments: defineDocuments([
          {
            route: '/:slug',
            filter: `_type == "page" && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/posts/:slug',
            filter: `_type == "post" && slug.current == $slug || _id == $slug`,
          },
        ]),
        // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'positive',
          }),
          page: defineLocations({
            select: {
              name: 'name',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Untitled',
                  href: resolveHref('page', doc?.slug)!,
                },
              ],
            }),
          }),
          post: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('post', doc?.slug)!,
                },
                {
                  title: 'Home',
                  href: '/',
                } satisfies DocumentLocation,
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
        },
      },
    }),
    structureTool({
      structure, // Custom studio structure configuration, imported from ./src/structure.ts
    }),
    // Additional plugins for enhanced functionality
    unsplashImageAsset(),
    assist(),
    visionTool(),
    media(),
    muxInput({
      mp4_support: 'standard',
    }),
    seoMetaFields(),
    leadPlugin(),
    optOutLeadPlugin(),
    promoLeadPlugin(),
    table(),
  ],

  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: schemaTypes,
  },
  /*tools: (prevTools) => {
    return [
      ...prevTools, // Keep the existing tools like Structure and Vision
      {
        name: 'bulk-delete-by-date',
        title: 'Bulk Delete',
        component: DeleteByDateRangeTool,
        icon: TrashIcon, // Assign the icon
      },
    ]
  },*/
})

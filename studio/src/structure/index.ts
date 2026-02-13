import { ColorWheelIcon, ComponentIcon, FolderIcon, UlistIcon, EarthGlobeIcon, TiersIcon, CogIcon, DocumentIcon } from '@sanity/icons'
import type { StructureBuilder, StructureResolver } from 'sanity/structure'
import { i18n } from '../../language'

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      S.listItem()
        .title("Pages")
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Languages')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`${language.id.toUpperCase()} Pages`)
                  .schemaType('page')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Pages`)
                      .schemaType('page')
                      .filter('_type == "page" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('page-language', {
                          id: 'page-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              S.divider(),
              S.listItem()
                .title(`All Pages`)
                .schemaType('page')
                .icon(FolderIcon)
                .child(
                  S.documentList()
                    .id('all-pages')
                    .title('All Pages')
                    .schemaType('page')
                    .filter('_type == "page"')
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' || params.template === `page`
                    )
                ),
            ])
        ),
        S.listItem()
          .title("Models")
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Languages')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`${language.id.toUpperCase()} Models`)
                  .schemaType('models')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Models`)
                      .schemaType('models')
                      .filter('_type == "models" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('models-language', {
                          id: 'models-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              S.divider(),
              S.listItem()
                .title(`All Models`)
                .schemaType('models')
                .icon(FolderIcon)
                .child(
                  S.documentList()
                    .id('all-models')
                    .title('All Models')
                    .schemaType('models')
                    .filter('_type == "models"')
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' || params.template === `models`
                    )
                ),
            ])
        ),

        /*S.listItem()
          .title("Spare Parts")
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Languages')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`${language.id.toUpperCase()} Spare Part`)
                  .schemaType('sparePart')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Spare Parts`)
                      .schemaType('sparePart')
                      .filter('_type == "sparePart" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('sparePart-language', {
                          id: 'sparePart-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              S.divider(),
              S.listItem()
                .title(`All Spare Parts`)
                .schemaType('sparePart')
                .icon(FolderIcon)
                .child(
                  S.documentList()
                    .id('all-spareParts')
                    .title('All Spare Parts')
                    .schemaType('sparePart')
                    .filter('_type == "sparePart"')
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' || params.template === `sparePart`
                    )
                ),
            ])
        ),

        S.listItem()
          .title("Service Cost")
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Languages')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`${language.id.toUpperCase()} Service Cost`)
                  .schemaType('serviceCost')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Service Cost`)
                      .schemaType('serviceCost')
                      .filter('_type == "serviceCost" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('serviceCost-language', {
                          id: 'serviceCost-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              S.divider(),
              S.listItem()
                .title(`All Service Cost`)
                .schemaType('serviceCost')
                .icon(FolderIcon)
                .child(
                  S.documentList()
                    .id('all-serviceCost')
                    .title('All Service Cost')
                    .schemaType('serviceCost')
                    .filter('_type == "serviceCost"')
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' || params.template === `serviceCost`
                    )
                ),
            ])
        ),*/

      S.listItem()
        .title("Car Pages")
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Languages')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`${language.id.toUpperCase()} Cars`)
                  .schemaType('car')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Cars`)
                      .schemaType('car')
                      .filter('_type == "car" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('car-language', {
                          id: 'car-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              S.divider(),
              S.listItem()
                .title(`All Cars`)
                .schemaType('car')
                .icon(FolderIcon)
                .child(
                  S.documentList()
                    .id('all-cars')
                    .title('All cars')
                    .schemaType('car')
                    .filter('_type == "car"')
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' || params.template === `car`
                    )
                ),
            ])
        ),

        S.listItem()
        .title("Offers")
        .icon(TiersIcon)
        .child(
          S.list()
            .title('Languages')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`${language.id.toUpperCase()} Offers`)
                  .schemaType('offer')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Offers`)
                      .schemaType('offer')
                      .filter('_type == "offer" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('offer-language', {
                          id: 'offer-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              S.divider(),
              S.listItem()
                .title(`All Offers`)
                .schemaType('offer')
                .icon(FolderIcon)
                .child(
                  S.documentList()
                    .id('all-offers')
                    .title('All offers')
                    .schemaType('offer')
                    .filter('_type == "offer"')
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' || params.template === `offer`
                    )
                ),
            ])
        ),

      
      S.listItem()
        .title("News")
        .icon(UlistIcon)
        .child(
          S.list()
            .title('Languages')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .schemaType('news')
                  .title(`${language.id.toUpperCase()} News`)
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} News`)
                      .schemaType('news')
                      .filter('_type == "news" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('news-language', {
                          id: 'news-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })

                  )
              ),
              S.divider(),
              S.listItem()
                .title(`All News`)
                .schemaType('news')
                .icon(FolderIcon)
                .child(
                  S.documentList()
                    .id('all-news')
                    .title('All News')
                    .schemaType('news')
                    .filter('_type == "news"')
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' || params.template === `news`
                    )

                ),
            ])
        ),

      S.listItem()
        .title("Header/Footer/SideKick")
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Language')
            .items([
              ...i18n.languages.map((language) =>
                S.listItem()
                  .title(`${language.id.toLocaleUpperCase()}`)
                  .schemaType('fragment')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id(language.id)
                      .title(`${language.title} Fragment`)
                      .schemaType('fragment')
                      .filter('_type == "fragment" && language == $language')
                      .params({ language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('fragment-language', {
                          id: 'fragment-language',
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName, params) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === 'edit') {
                          // return params?.language === language.id
                          return false
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true
                        }

                        // Template name structure example: "page-en"
                        const languageValue = params?.template?.split(`-`).pop()

                        return languageValue === language.id
                      })
                  )
              ),
              // I have only added this item so that search results when clicked will load this list
              // If the intent checker above could account for it, I'd remove this item
            ])
        ),
      S.documentTypeListItem('geelyNetwork').title('Geely Networks').icon(EarthGlobeIcon),
      S.documentTypeListItem('vehicle').title('Vehicle 360').icon(ComponentIcon),
      S.documentTypeListItem('color').title('Colors').icon(ColorWheelIcon),
      //S.documentTypeListItem('lead').title('Leads').icon(ColorWheelIcon),
      //S.documentTypeListItem('optOutLead').title('Opt Out Leads').icon(DocumentIcon),
      
      /*S.listItem()
        .title('Site Utils')
        .child(
          S.list()
            .title('Site Utils')
            .items([
              S.listItem()
                  .title(`Colors`)
                  .schemaType('color')
                  .icon(FolderIcon)
                  .child(
                    S.documentList()
                      .id('color-id')
                      .title(`Colors`)
                      .schemaType('color')
                      .filter('_type == "color"')
                  )
            ])
         
        )
        .icon(ControlsIcon),*/

      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])

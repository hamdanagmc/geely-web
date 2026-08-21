import { defineQuery, groq } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`;

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current,
    "car": car->slug.current,
  }
`;

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`;

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    blackBackground,
    heading,
    subheading,
    seo,
    redirect,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "carModelComponent" => {
        carModels[]{
          ...,
          exploreLink {
            text,
            link -> {
              _id,
              title,
              "slug": slug.current
            },
            externalLink{
              type,
              linkType,
              openInNewTab,
              href,
              path,
              "car": car->{
                _id,
                title,
                "slug": slug.current
              },
              "page": page->{
                _id,
                title,
                "slug": slug.current
              }
            }
          },
            getQuoteLink{
              text,
              quoteLink{
                type,
                linkType,
                openInNewTab,
                href,
                path,
                "car": car->{
                  _id,
                  title,
                  "slug": slug.current
                },
                "page": page->{
                  _id,
                  title,
                  "slug": slug.current
                }
              } 
            },
            testDriveLink{
              text,
              drivelink{
                type,
                linkType,
                openInNewTab,
                href,
                path,
                "car": car->{
                  _id,
                  title,
                  "slug": slug.current
                },
                "page": page->{
                  _id,
                  title,
                  "slug": slug.current
                }
              } 
            }
        }
      },
       _type == "contactFormSection" => {
          ...,
          form{
            ...,
            termsAndConditionsLabel[]{
              ...,
              markDefs[]{
                ...,
                ${linkReference}
              }
            },
            link -> {
              _id,
              title,
              "slug": slug.current
            }
          }
      },
      _type == "optOutForm" => {
          
          ...,
          link -> {
              _id,
              title,
              "slug": slug.current
            }
      },
      _type == "brochureDownloadFormSection" => {
          ...,
          form{
          ...,
          link -> {
              _id,
              title,
              "slug": slug.current
            }
          }
      },
      _type == "requestQuoteForm" => {
          ...,
          termsAndConditionsLabel[]{
            ...,
            markDefs[]{
              ...,
              ${linkReference}
            }
          },
          link -> {
              _id,
              title,
              "slug": slug.current
            }
      },
      _type == "preBookHeroBannerComponent" => {
          ...,
          link -> {
              _type,
              _id,
              title,
              "slug": slug.current
          }
      },
      _type == "vehiclePromoBanner" => {
          ...,
          link -> {
              _id,
              title,
              "slug": slug.current
          }
      },
      _type == "promoCodeForm" => {
          ...,
          link -> {
              _id,
              title,
              "slug": slug.current
            }
      },
      _type == "fleetContactFormSection" => {
          ...,
          form{
            ...,
            termsAndConditionsLabel[]{
              ...,
              markDefs[]{
                ...,
                ${linkReference}
              }
            },
            link -> {
              _id,
              title,
              "slug": slug.current
            }
          }
      },
      _type == "serviceBookingForm" => {
          ...,
          link -> {
              _id,
              title,
              "slug": slug.current
          }
      },
      _type == "customerLookup" => {
          ...,
          form{
            ...,
            termsAndConditionsLabel[]{
              ...,
              markDefs[]{
                ...,
                ${linkReference}
              }
            },
            termsAndConditionLink -> {
                _id,
                title,
                "slug": slug.current
            }
          }
      },
      _type == "bannerCarousel" => {
        ...,
        link -> {
              _id,
              title,
              "slug": slug.current
            }
      },
      _type == "thankyouRichText" => {
        ...,
        callToActionButton{
        ...,
        link { _type, linkType, openInNewTab, href, path, "page": page->{ _id, title, "slug": slug.current } },
         }
      },

      
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
      _type == "heroVideoComponent" => {
        video {
          asset-> {
            playbackId,
            assetId,
            filename
          }
        }
      },
      _type == "appointmentBooked" => {
          ...,
          exploreButton {
            ...,
          ${linkFields},
        },
        bookButton {
            ...,
          ${linkFields},
        }
      },
      _type == "appointmentError" => {
          ...,
          tryAgainLink -> {
              _id,
              title,
              "slug": slug.current
            }
      },
      _type == "customerDetails" => {
          ...,
          restartButtonLink -> {
              _id,
              title,
              "slug": slug.current
            }
      },
      _type == "imagesAndVideosSection" => {
        ...,
        modelGalleryList[]{
          ...,
          videoListMux[]{
            ...,
            asset->{
              playbackId,
              assetId,
              filename
            }
          }
        }
      },
      _type == "featureHighlightsComponent" => {
        ...,
        tabs[]{
          ...,
          highlights[]{
            ...,
            muxVideo {
              asset-> {
                playbackId,
                assetId,
                filename
              }
            }
          }
        }
      },
      _type == "comfortSlider" => {
        ...,
        slides[]{
          ...,
          video {
            asset-> {
              playbackId,
              assetId,
              filename
            }
          }
        }
      }
    }
  }
`);



export const getNewsDetailQuery = defineQuery(`
  *[_type == 'news' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    blackBackground,
    thumbnail,
    seo,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "carModelComponent" => {
        carModels[]{
          ...,
          exploreLink {
          text,
          link -> {
              _id,
              title,
              "slug": slug.current
          }
        }
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`);

export const getHomePageQuery = (locale: string) => {
  const slug = locale === "ar" ? "ar/home" : "home";
  return defineQuery(`
    *[_type == "page" && slug.current == "${slug}" && language == "${locale}"][0]{
      _id,
      _type,
      name,
      slug,
      heading,
      subheading,
      seo,
      "pageBuilder": pageBuilder[]{
        ...,
        _type == "callToAction" => {
          ...,
          ${linkFields},
        },
        _type == "listCars" => {
        cars[]{
          ...,
          exploreLink {
          text,
          link -> {
              _id,
              title,
              "slug": slug.current
          }
        }
        }
      },
      _type == "bannerCarousel" => {
        slides[]{
          ...,
          link -> {
              _id,
              title,
              "slug": slug.current
            }
        }
      },
      },
    }
  `);
};

export const getFleetPageQuery = (locale: string) => {
  const slug = locale === "ar" ? "ar/fleet-sales" : "fleet-sales";
  return defineQuery(`
    *[_type == "page" && slug.current == "${slug}" && language == "${locale}"][0]{
      _id,
      _type,
      name,
      slug,
      heading,
      subheading,
      seo,
      "pageBuilder": pageBuilder[]{
        ...,
        _type == "callToAction" => {
          ...,
          ${linkFields},
        },
        _type == "fleetContactFormSection" => {
          ...,
          form{
            ...,
            termsAndConditionsLabel[]{
              ...,
              markDefs[]{
                ...,
                ${linkReference}
              }
            },
            link -> {
              _id,
              title,
              "slug": slug.current
            }
          }
      },
        _type == "listCars" => {
        cars[]{
          ...,
          exploreLink {
          text,
          link -> {
              _id,
              title,
              "slug": slug.current
          }
        }
        }
      },
      },
    }
  `);
};

export const getNewsPageQuery = (locale: string) => {
  const slug = locale === "ar" ? "ar/news" : "news";
  return defineQuery(`
    *[_type == "page" && slug.current == "${slug}" && language == "${locale}"][0]{
      _id,
      _type,
      name,
      slug,
      heading,
      subheading,
      seo,
      "pageBuilder": pageBuilder[]{
        ...,
        _type == "callToAction" => {
          ...,
          ${linkFields},
        },
        _type == "listCars" => {
          ...,
          "vehicles": cars[]->{
              _id,
              name,
              "slug": slug.current,
              "image": image.asset->url,
              "titleImage": titleImage.asset->url
            },
        },
        _type == "quoteCtaSection" => {
          ...,
          "slugReference": ^.slug.current
        }
      },
    }
  `);
};

export const getOfferPageQuery = (locale: string) => {
  const slug = locale === "ar" ? "ar/offers" : "offers";
  return defineQuery(`
    *[_type == "page" && slug.current == "${slug}" && language == "${locale}"][0]{
      _id,
      _type,
      name,
      slug,
      heading,
      subheading,
      "pageBuilder": pageBuilder[]{
        ...,
      },
    }
  `);
};


export const getCarsQuery = defineQuery(`
  *[_type == 'car' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    seo,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "car360" => {
        ...,
        selectedCar->{
          _id,
          name,
          exteriorImages[]{
            color->{
              _id,
              name,
              hexCode
            },
            images360[]{
              asset->{
                url
              }
            }
          },
          interiorImages[]{
            asset->{
              url
            }
          }
        }
      },
      _type == "heroBannerComponent" => {
        video {
      asset-> {
      playbackId,
      assetId,
      filename,
    }
     }
      },
      link -> {
              _id,
              title,
              "slug": slug.current
            },
            brochurePageLink -> {
              _id,
              title,
              "slug": slug.current
            },
            linkOpenInNewTab,
            preBook {
    enable,
    preBookButton,
    price,
    preBookButtonLink->{
      _id,
      title,
      "slug": slug.current
    }
  },
      _type == "featureHighlightsComponent" => {
        ...,
        tabs[]{
          ...,
          highlights[]{
            ...,
            muxVideo {
              asset-> {
                playbackId,
                assetId,
                filename
              }
            }
          }
        }
      },
      _type == "heroVideoComponent" => {
        video {
          asset-> {
            playbackId,
            assetId,
            filename
          }
        }
      },
      _type == "comfortSlider" => {
      ...,
      slides[]{
        ...,
        video {
          asset-> {
            playbackId,
            assetId,
            filename
          }
        }
        }
      },
      _type == "owlStageOuter" => {
      ...,
      slides[]{
            ...,
        video {
          asset-> {
            playbackId,
            assetId,
            filename
          }
        },
        mobileVideo {
          asset-> {
            playbackId,
            assetId,
            filename
          }
        }
}
      },
    }
  }
`);

export const getOfferDetailQuery = defineQuery(`
  *[_type == 'offer' && slug.current == $slug][0]{
     ...,
     offerDetailForm {
       ...,
       privacyPolicyLabel[]{
         ...,
         markDefs[]{
           ...,
           ${linkReference}
         }
       },
       termsAndConditionsLabel[]{
         ...,
         markDefs[]{
           ...,
           ${linkReference}
         }
       }
     },
     preBookLink -> {
        _type,
        _id,
        title,
        "slug": slug.current
     },
     link -> {
              "slug": slug.current
          }
  }
`);



export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);

export const carsSlugs = defineQuery(`
  *[_type == "cars" && defined(slug.current)]
  {"slug": slug.current}
`);


//custom queries
export const headerQuery = defineQuery(`
  *[_type == "fragment" && type == "Header" && language == $language][0] {
    header {
      logo, blackLogo, searchIcon, searchIconBlack, mapIcon, mapIconBlack, toggleMenuIcon, toggleMenuIconBlack 
        { altText, image { asset { _ref } } },
      navigation {
        navItems[] {
          _key, title, hasSubPages,
          link { _type, linkType, openInNewTab, href, path, "page": page->{ _id, title, "slug": slug.current } },
          navigation {
            navItems[] {
              _key, title,
              link { _type, linkType, openInNewTab, href, path, "page": page->{ _id, title, "slug": slug.current } }
            }
          }
        }
      }
    }
  }
  `);


export const footerQuery = defineQuery(`
  *[_type == "fragment" && type == "Footer" && language == $language][0] {
    footer {
      copyrightText,
      footerLogo {
        altText,
        image {
          asset {
            _ref
          }
        }
      },
      footerLogo2 {
        altText,
        image {
          asset {
            _ref
          }
        }
      },
      linkList {
        title,
        links[] {
          _key,
          linkText,
          link {
            _type,
            linkType,
            openInNewTab,
            href,
            path,
            "car": car->{
              _id,
              title,
              "slug": slug.current
            },
            "page": page->{
            _id,
            title,
            "slug": slug.current
          }
          }
        }
      },
      linkList1 {
        title,
        links[] {
          _key,
          linkText,
          link {
            _type,
            linkType,
            openInNewTab,
            href,
            path,
            "page": page->{
              _id,
              title,
              "slug": slug.current
            },
            "car": car->{
              _id,
              title,
              "slug": slug.current
            },
          }
        }
      },
      linkList2 {
        title,
        links[] {
          _key,
          linkText,
          link {
            _type,
            linkType,
            openInNewTab,
            href,
            path,
            "page": page->{
              _id,
              title,
              "slug": slug.current
            },
            "car": car->{
              _id,
              title,
              "slug": slug.current
            },
          }
        }
      },
      imageLinkArray[]{
      ...,
      pageLink -> {
              _id,
              title,
              "slug": slug.current
            }
      },
      linkList3 {
        title,
        links[] {
          _key,
          linkText,
          link {
            _type,
            linkType,
            openInNewTab,
            href,
            path,
            "page": page->{
              _id,
              title,
              "slug": slug.current
            },
            "car": car->{
              _id,
              title,
              "slug": slug.current
            },
          }
        }
      }
    }
  }
`);

export const sideQuickQuery = defineQuery(`
  *[_type == "fragment" && type == "SideKick" && language == $language][0] {
    sideKickSection {
...,
      iconLinkList1 {
        title,
        links[] {
          _key,
          linkText,
          ...,
          link {
            _type,
            linkType,
            openInNewTab,
            href,
            path,
            "page": page->{
              _id,
              title,
              "slug": slug.current
            },
            "car": car->{
              _id,
              title,
              "slug": slug.current
            },
          }
        }
      },
      iconLinkList2 {
        title,
        links[] {
          _key,
          linkText,
          ...,
          link {
            _type,
            linkType,
            openInNewTab,
            href,
            path,
            "page": page->{
              _id,
              title,
              "slug": slug.current
            },
            "car": car->{
              _id,
              title,
              "slug": slug.current
            },
          }
        }
      },
    }
  }
`);

export const siteSettingQuery = (locale: string) => {
  return defineQuery(`
    *[_type == "settings"][0] {
  ...,
  }
  `);
};

export const getNewsQuery = (locale: string) => {
  return defineQuery(`
    *[_type == "news" && language == "${locale}"]
    | order(publishDate desc)
  `);
};



export const getOffersQuery = (locale: string) => {
  return defineQuery(`
    *[_type == "offer" && language == "${locale}" && isHidden != true]
  `);
};

export const getCarListQuery = groq`
*[_type == "carList"][0] {
  ...,
  "cars": cars[]{
    ...,
    "carData": @->{
      name,
      image,
      "slug": slug.current
    }
  }
}`;

export const getAllVehiclesQuery = (locale: string) => `
  *[_type == "vehicle" && language == "${locale}"]`;

export const getGeelyNetworkQuery = (locale: string) => `
  *[_type == "geelyNetwork"] {
  ...,
    "title": select("${locale}" == "en" => titleLocale.en, titleLocale.ar),
    "addresslabelLocale": select("${locale}" == "en" => addresslabelLocale.en, addresslabelLocale.ar),
    "addressField": select("${locale}" == "en" => addressFieldLocale.en, addressFieldLocale.ar),
    "showroomTimingsLabelLocale": select("${locale}" == "en" => showroomTimingsLabelLocale.en, showroomTimingsLabelLocale.ar),
    "showroomTimings": select("${locale}" == "en" => showroomTimingsLocale.en, showroomTimingsLocale.ar)
  }
`;

export const getAllModelsQuery = defineQuery(`
  *[_type == "models" && language == $locale] {
    modelName
  }
`);

export const getServiceTableQuery = defineQuery(`
  *[_type == "serviceCost" && language == $locale && modelName->modelName == $model][0] {
    _type,
    serviceCostTable{
      rows[]{
        _key,
        cells
      }
    } 
  }
`);



export const getSparePartsTableQuery = defineQuery(`
  *[_type == "sparePart" && language == $locale && modelName->modelName == $model][0] {
    _type,
    sparePartTable{
      rows[]{
        _key,
        cells
      }
    }
  }
`);


export const getAllSparePartsForModelQuery = defineQuery(`
  *[_type == "sparePart" && language == $locale && modelName->modelName == $model] {
    _id,
    hasTrim,
    trimName
  }
`);


export const getPromoCodesQuery = defineQuery(`
*[_type== 'promoCodes'][0]{
  codes
}
`);
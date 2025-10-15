import type { NextConfig } from "next"
const withNextIntl = require("next-intl/plugin")()

const nextConfig: NextConfig = {
  poweredByHeader: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/actions/sitemap",
      },
    ]
  },
  async redirects() {
    return [
      // English pages
      // Home page
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
      // Car pages
      {
        source: "/all-new-coolray",
        destination: "/en/car/coolray",
        permanent: true,
      },
      {
        source: "/emgrand",
        destination: "/en/car/emgrand",
        permanent: true,
      },
      {
        source: "/starray",
        destination: "/en/car/starray",
        permanent: true,
      },
      {
        source: "/monjaro",
        destination: "/en/car/monjaro",
        permanent: true,
      },
      {
        source: "/okavango",
        destination: "/en/car/okavango",
        permanent: true,
      },
      {
        source: "/preface",
        destination: "/en/car/preface",
        permanent: true,
      },
      {
        source: "/tugella",
        destination: "/en/vehicles",
        permanent: true,
      },
      {
        source: "/geometry-c",
        destination: "/en/car/geometry-c",
        permanent: true,
      },
      // Main sections
      {
        source: "/vehicles",
        destination: "/en/vehicles",
        permanent: true,
      },
      {
        source: "/offers",
        destination: "/en/offers",
        permanent: true,
      },
      {
        source: "/safety",
        destination: "/en/about-geely",
        permanent: true,
      },
      {
        source: "/brochure-download",
        destination: "/en/brochure-download",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/en/contact-us",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/en/about-geely",
        permanent: true,
      },
      {
        source: "/certified_selection",
        destination: "https://shop.geely.ae/en/certified-selection",
        permanent: true,
      },
      {
        source: "/service-booking",
        destination: "/en/service-booking",
        permanent: true,
      },
      {
        source: "/cityray_pre-order",
        destination: "/en/offers/the-all-new-cityray",
        permanent: true,
      },
      {
        source: "/warranty",
        destination: "/en/vehicles",
        permanent: true,
      },
      {
        source: "/geely-network",
        destination: "/en/geely-network",
        permanent: true,
      },
      {
        source: "/news-all",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/research-development",
        destination: "/en/innovation",
        permanent: true,
      },
      {
        source: "/fleet-sales",
        destination: "/en/fleet-sales",
        permanent: true,
      },
      {
        source: "/legal-disclaimer",
        destination: "/en/legal-statement",
        permanent: true,
      },
      {
        source: "/request-test-drive",
        destination: "/en/request-test-drive",
        permanent: true,
      },
      {
        source: "/images-and-videos",
        destination: "/en/images-and-videos",
        permanent: true,
      },
      {
        source: "/company-vision",
        destination: "/en/our-vision",
        permanent: true,
      },
      {
        source: "/innovation",
        destination: "/en/innovation",
        permanent: true,
      },
      {
        source: "/geely-history",
        destination: "/en/our-history",
        permanent: true,
      },
      {
        source: "/our-history",
        destination: "/en/our-history",
        permanent: true,
      },
      {
        source: "/request-a-quote",
        destination: "/en/request-a-quote",
        permanent: true,
      },
      {
        source: "/corporate-social-responsibility",
        destination: "/en/corporate-social-responsibility",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/en/privacy-policy",
        permanent: true,
      },
      // Special offers
      {
        source: "/ramadan_offer",
        destination: "/en/offers/amazing-ramadan-offer",
        permanent: true,
      },
      {
        source: "/starray_offer",
        destination: "/en/offers/starray",
        permanent: true,
      },
      {
        source: "/abu-dhabi-showroom-opening",
        destination: "/en/offers/abu-dhabi-opening-offer",
        permanent: true,
      },
      {
        source: "/summer_campaign",
        destination: "/en/offers/winter-is-the-new-summer",
        permanent: true,
      },
      {
        source: "/winter_offer",
        destination: "/en/offers",
        permanent: true,
      },
      {
        source: "/spring_offer",
        destination: "/en/offers",
        permanent: true,
      },
      {
        source: "/back_to_school_offer",
        destination: "/en/offers",
        permanent: true,
      },
      {
        source: "/global_village",
        destination: "/en/offers",
        permanent: true,
      },
      {
        source: "/preface_offer",
        destination: "/en/offers",
        permanent: true,
      },
      {
        source: "/okavango_offer",
        destination: "/en/offers",
        permanent: true,
      },
      {
        source: "/okavango_pre_launch_offer",
        destination: "/en/offers",
        permanent: true,
      },
      {
        source: "/preface_pre_launch",
        destination: "/en/vehicles",
        permanent: true,
      },
      {
        source: "/starray_pre_launch",
        destination: "/en/car/starray",
        permanent: true,
      },
      {
        source: "/new_preface",
        destination: "/en/car/preface",
        permanent: true,
      },
      {
        source: "/starray_car_uae",
        destination: "/en/car/starray",
        permanent: true,
      },
      {
        source: "/service-network",
        destination: "/en/geely-network",
        permanent: true,
      },
      {
        source: "/geely_map_address",
        destination: "/en/geely-network",
        permanent: true,
      },
      {
        source: "/design-philosophy",
        destination: "/en/innovation",
        permanent: true,
      },
      {
        source: "/intec",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/home-two",
        destination: "/en",
        permanent: true,
      },

      // News and Events - Updated with full URL handling from the provided list
      // News articles with specific slugs
      {
        source: "/news/agmc-geely-welcomes-customers-in-abu-dhabi-with-first-geely-boutique-in-mushrif-mall",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/geely-enters-seven-seater-segment-in-the-uae-with-launch-of-all-new-okavango-suv",
        destination: "/en/car/okavango",
        permanent: true,
      },
      {
        source: "/news/agmc-appointed-as-the-official-distributor-of-geely-auto-in-the-united-arab-emirates",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/geely-auto-group-unveils-intelligent-geely-2025-strategy",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/dubai-police-inducts-all-new-geely-tugella-vehicles-into-fleet-of-patrol-cars",
        destination: "/en/news",
        permanent: true,
      },
      {
        source:
          "/news/launch-of-all-new-geely-starray-brings-futuristic-design-and-advanced-technologies-to-suv-fans-in-the-uae",
        destination: "/en/news",
        permanent: true,
      },
      {
        source:
          "/news/geely-agmc-expands-its-uae-network-to-sharjah-with-launch-of-contemporary-new-showroom-and-service-centre",
        destination: "/en/news",
        permanent: true,
      },
      {
        source:
          "/news/geely-agmc-celebrates-launch-of-state-of-the-art-distribution-centre-in-dubai-for-rapid-delivery-of-spare-parts-across-the-uae-and-middle-east",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news-all",
        destination: "/en/news",
        permanent: true,
      },
      {
        source:
          "/news/geely-agmc-introduces-affordable-luxury-to-uae-and-invites-drivers-to-stand-tall-with-launch-of-flagship-monjaro-suv",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/first-look-at-new-geely-coupe-suv",
        destination: "/en/news/first-look-at-new-geely-coupe-suv",
        permanent: true,
      },
      {
        source:
          "/news/agmc-geely-launches-all-new-tugella-to-bring-superior-elegance-and-aerodynamic-performance-to-the-uaes-suv-enthusiasts",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/dubai-police-expands-its-fleet-with-geely-tugella",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/geely-blends-innovation-comfort-and-style-in-all-new-preface-for-the-uae",
        destination: "/en/news",
        permanent: true,
      },
      {
        source:
          "/news/agmc-geely-partners-with-global-village-as-first-ever-exclusive-automotive-sponsor-for-season-28",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/geely-auto-new-flagship-cma-based-coupe-suv-launched",
        destination: "/en/news/geely-auto-new-flagship-cma-based-coupe-suv-launched",
        permanent: true,
      },
      {
        source: "/news/geely-auto-continues-to-gain-market-share-in-chinese-market",
        destination: "/en/news/geely-auto-continues-to-gain-market-share-in-chinese-market",
        permanent: true,
      },
      {
        source: "/news/geely-auto-group-targets-3-65-million-annual-sales-by-2025",
        destination: "/en/news/geely-auto-group-targets-3-65-million-annual-sales-by-2025",
        permanent: true,
      },
      {
        source: "/news/geely-presents-vision-starburst",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/geely-jointly-developed-cma-based-vehicle-sales-exceed-600000",
        destination: "/en/news/geely-jointly-developed-cma-based-vehicle-sales-exceed-600-000",
        permanent: true,
      },
      {
        source:
          "/news/geely-reinforces-uae-sales-and-service-network-with-opening-of-brand-new-showroom-in-ras-al-khaimah",
        destination: "/en/news",
        permanent: true,
      },
      {
        source:
          "/news/geely-uae-finds-impressive-new-home-in-dubai-with-the-launch-of-the-state-of-art-and-ev-centric-showroom-and-service-centre",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/geely-auto-enters-d-segment-with-brands-biggest-suv-to-date",
        destination: "/en/news/geely-auto-enters-d-segment-with-brand-s-biggest-suv-to-date",
        permanent: true,
      },
      {
        source:
          "/news/geely-uae-unveils-the-future-of-intelligent-mobility-with-state-of-the-art-showroom-and-service-facility-in-abu-dhabi",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/geely-auto-group-unveils-smart-2",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/geely-auto-becomes-official-partner-to-2022-asian-games",
        destination: "/en/news/geely-auto-becomes-official-partner-to-2022-asian-games",
        permanent: true,
      },
      {
        source: "/news/the-best-is-back-azkarra-is-the-most-intelligent-connected-suv-of-its-generation",
        destination: "/en/news/the-best-is-back-azkarra-is-the-most-intelligent-connected-suv-of-its-generation",
        permanent: true,
      },
      {
        source: "/news/interior-of-geelys-new-sports-coupe-suv-unveiled",
        destination: "/en/news/interior-of-geely-s-new-sports-coupe-suv-unveiled",
        permanent: true,
      },
      {
        source: "/news/geely-auto-sets-vision-for-future-of-autonomous-drive-at-dragon-bay-forum",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/geely-auto-2020-sales-reach-1-32-million-units",
        destination: "/en/news/geely-auto-2020-sales-reach-1-32-million-units",
        permanent: true,
      },
      {
        source:
          "/news/geely-auto-2019-financial-results-released-showing-revenue-of-97-4-billion-and-increased-market-share",
        destination:
          "/en/news/geely-auto-2019-financial-results-released-showing-revenue-of-97-4-billion-and-increased-market",
        permanent: true,
      },
      {
        source: "/news/geely-auto-2018-sales-reach-1-5-million-units-increasing-over-20-from-previous-year",
        destination: "/en/news/geely-auto-2018-sales-reach-1-5-million-units-increasing-over-20-from-previous-year",
        permanent: true,
      },
      {
        source: "/news/geely-auto-2020-financial-results-released",
        destination: "/en/news/geely-auto-2020-financial-results-released",
        permanent: true,
      },
      {
        source: "/news/geely-auto-and-lg-chem-to-establish-joint-venture-company-to-produce-batteries-in-china",
        destination: "/en/news/geely-auto-and-lg-chem-to-establish-joint-venture-company-to-produce-batteries-in-china",
        permanent: true,
      },
      {
        source: "/news/geely-automobile-holding-sales-volume-for-june-2020-was-110129-units",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/geely-auto-group-launches-leishen-global-powertrain-brand",
        destination: "/en/news/geely-auto-group-launches-leishen-global-powertrain-brand",
        permanent: true,
      },
      {
        source: "/news/geely-unleashes-the-all-new-coolray-turbocharged-four-cylinder-2",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/news/geely-automobile-holding-sales-volume-for-1h-2021-reach-630237-units-up-19-yoy",
        destination: "/en/news/geely-automobile-holding-sales-volume-for-1h-2021-reach-630-237-units-up-19-yoy",
        permanent: true,
      },
      {
        source: "/news/dubai-police-expands-its-fleet-with-geely-tugella/#!",
        destination: "/en/news",
        permanent: true,
      },

      // Events with specific slugs
      {
        source: "/events/leishen-power-geelys-new-powertrain-technology-brand",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/events/press-release-geely-auto-group-unveils-intelligent-geely-2025-strategy",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/events/press-release-geely-auto-group-unveils-intelligent-geely-2025-strategy",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/events/leishen-power-information-about-geelys-new-powertrain-technology-brand",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news/news/geely-auto-and-lg-chem-to-establish-joint-venture-company-to-produce-batteries-in-china",
        permanent: true,
      },
      {
        source: "/events/geely-debut-live-show-in-auto-shanghai-2021",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/events/2018-gaic-global-distributor-conference",
        destination: "/en/news",
        permanent: true,
      },

      // Generic news and events redirects
      {
        source: "/events",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/events/:slug",
        destination: "/en/news",
        permanent: true,
      },
      {
        source: "/events-all",
        destination: "/en/news",
        permanent: true,
      },
      // Brochure pages
      {
        source: "/brochure/:slug",
        destination: "/en/brochure-download",
        permanent: true,
      },

      // Arabic pages - Using has condition for query parameters
      // Home page
      {
        source: "/",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar",
        permanent: true,
        locale: false,
      },
      // Car pages
      {
        source: "/all-new-coolray",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/car/coolray",
        permanent: true,
        locale: false,
      },
      {
        source: "/emgrand",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/car/emgrand",
        permanent: true,
        locale: false,
      },
      {
        source: "/starray",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/car/starray",
        permanent: true,
        locale: false,
      },
      {
        source: "/monjaro",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/car/monjaro",
        permanent: true,
        locale: false,
      },
      {
        source: "/okavango",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/car/okavango",
        permanent: true,
        locale: false,
      },
      {
        source: "/preface",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/car/preface",
        permanent: true,
        locale: false,
      },
      {
        source: "/tugella",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/vehicles",
        permanent: true,
        locale: false,
      },
      {
        source: "/geometry-c",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/car/geometry-c",
        permanent: true,
        locale: false,
      },
      // Main sections
      {
        source: "/vehicles",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/vehicles",
        permanent: true,
        locale: false,
      },
      {
        source: "/offers",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/offers",
        permanent: true,
        locale: false,
      },
      // Also add a version with trailing slash
      {
        source: "/offers/",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/offers",
        permanent: true,
        locale: false,
      },
      {
        source: "/safety",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/vehicles",
        permanent: true,
        locale: false,
      },
      {
        source: "/brochure-download",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/brochure-download",
        permanent: true,
        locale: false,
      },
      {
        source: "/contact-us",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/contact-us",
        permanent: true,
        locale: false,
      },
      {
        source: "/about-us",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/about-geely",
        permanent: true,
        locale: false,
      },
      {
        source: "/service-booking",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/service-booking",
        permanent: true,
        locale: false,
      },
      {
        source: "/warranty",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/vehicles",
        permanent: true,
        locale: false,
      },
      {
        source: "/geely-network",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/geely-network",
        permanent: true,
        locale: false,
      },
      {
        source: "/fleet-sales",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/fleet-sales",
        permanent: true,
        locale: false,
      },
      {
        source: "/legal-disclaimer",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/legal-statement",
        permanent: true,
        locale: false,
      },
      {
        source: "/request-a-quote",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/request-a-quote",
        permanent: true,
        locale: false,
      },
      {
        source: "/company-vision",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/our-vision",
        permanent: true,
        locale: false,
      },
      {
        source: "/our-history",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/our-history",
        permanent: true,
        locale: false,
      },
      {
        source: "/corporate-social-responsibility",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/corporate-social-responsibility",
        permanent: true,
        locale: false,
      },
      {
        source: "/service-network",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/geely-network",
        permanent: true,
        locale: false,
      },
      {
        source: "/intec",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar",
        permanent: true,
        locale: false,
      },
      {
        source: "/home-two",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar",
        permanent: true,
        locale: false,
      },
      {
        source: "/certified_selection",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar",
        permanent: true,
        locale: false,
      },
      {
        source: "/new_preface",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/car/preface",
        permanent: true,
        locale: false,
      },
      // Special offers
      {
        source: "/ramadan_offer",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/offers/amazing-ramadan-offer",
        permanent: true,
        locale: false,
      },
      {
        source: "/preface_offer",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/offers",
        permanent: true,
        locale: false,
      },
      {
        source: "/okavango_offer",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/offers",
        permanent: true,
        locale: false,
      },
      {
        source: "/starray_offer",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/offers",
        permanent: true,
        locale: false,
      },
      {
        source: "/global_village",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/offers",
        permanent: true,
        locale: false,
      },
      {
        source: "/preface_pre_launch",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/car/preface",
        permanent: true,
        locale: false,
      },

      // News and Events with Arabic lang parameter - Updated from the provided list
      // News articles with specific slugs
      {
        source: "/news/geely-auto-group-unveils-intelligent-geely-2025-strategy",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/geely-enters-seven-seater-segment-in-the-uae-with-launch-of-all-new-okavango-suv",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/dubai-police-inducts-all-new-geely-tugella-vehicles-into-fleet-of-patrol-cars",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source:
          "/news/launch-of-all-new-geely-starray-brings-futuristic-design-and-advanced-technologies-to-suv-fans-in-the-uae",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source:
          "/news/geely-agmc-expands-its-uae-network-to-sharjah-with-launch-of-contemporary-new-showroom-and-service-centre",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source:
          "/news/geely-agmc-celebrates-launch-of-state-of-the-art-distribution-centre-in-dubai-for-rapid-delivery-of-spare-parts-across-the-uae-and-middle-east",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source:
          "/news/geely-agmc-introduces-affordable-luxury-to-uae-and-invites-drivers-to-stand-tall-with-launch-of-flagship-monjaro-suv",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/agmc-geely-welcomes-customers-in-abu-dhabi-with-first-geely-boutique-in-mushrif-mall",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/agmc-appointed-as-the-official-distributor-of-geely-auto-in-the-united-arab-emirates",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/first-look-at-new-geely-coupe-suv",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/geely-auto-new-flagship-cma-based-coupe-suv-launched",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/geely-auto-continues-to-gain-market-share-in-chinese-market",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/geely-auto-group-targets-3-65-million-annual-sales-by-2025",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/en/news/geely-auto-group-targets-3-65-million-annual-sales-by-2025",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/geely-auto-enters-d-segment-with-brands-biggest-suv-to-date",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news/geely-auto-enters-d-segment-with-brand-s-biggest-suv-to-date",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/geely-auto-undergoes-an-evolution-at-shanghai-auto",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news/geely-auto-undergoes-an-evolution-at-shanghai-auto",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/geely-auto-2020-financial-results-released",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news/geely-auto-2020-financial-results-released",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/geely-auto-and-lg-chem-to-establish-joint-venture-company-to-produce-batteries-in-china",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/en/news/geely-auto-and-lg-chem-to-establish-joint-venture-company-to-produce-batteries-in-china",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/geely-automobile-holding-sales-volume-for-1h-2021-reach-630237-units-up-19-yoy",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news/geely-automobile-holding-sales-volume-for-1h-2021-reach-630-237-units-up-19-yoy",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/interior-of-geelys-new-sports-coupe-suv-unveiled",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news/geely-auto-new-flagship-cma-based-coupe-suv-launched",
        permanent: true,
        locale: false,
      },
      {
        source: "/events/geely-auto-group-launches-leishen-global-powertrain-brand",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news/geely-auto-group-launches-leishen-global-powertrain-brand",
        permanent: true,
        locale: false,
      },
      {
        source:
          "/news/agmc-geely-launches-all-new-tugella-to-bring-superior-elegance-and-aerodynamic-performance-to-the-uaes-suv-enthusiasts",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source:
          "/news/geely-reinforces-uae-sales-and-service-network-with-opening-of-brand-new-showroom-in-ras-al-khaimah",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/autocar-magazine-recognizes-peter-horbury-with-lifetime-achievement-award",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news/autocar-magazine-recognizes-peter-horbury-with-lifetime-achievement-awardd",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/stefan-sielaff-to-be-appointed-as-vice-president-of-global-design-at-geely-auto-group",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news/stefan-sielaff-to-be-appointed-as-vice-president-of-global-design-at-geely-auto-group",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/جيلي-تحتفل-بإطلاق-مركز-توزيع-حديث-في-دب",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/المركز-الميكانيكي-للخليج-العربي-موزع",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/المركز-الميكانيكي-للخليج-العربي-يطرح",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/جيلي-الإمارات-تحطّ-رحالها-في-دبي-مع-اف",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },

      // Generic news and events redirects with Arabic lang parameter
      {
        source: "/news",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/news/:slug",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news/:slug",
        permanent: true,
        locale: false,
      },
      {
        source: "/events",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/events/:slug",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/geely-events",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/en/news",
        permanent: true,
        locale: false,
      },
      {
        source: "/geely-all-media-center-2",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/news",
        permanent: true,
        locale: false,
      },
      // Brochure pages
      {
        source: "/brochure/:slug",
        has: [
          {
            type: "query",
            key: "lang",
            value: "ar",
          },
        ],
        destination: "/ar/brochure-download",
        permanent: true,
        locale: false,
      },
      // Handle URLs with hash fragments
      {
        source: "/:path*/#:hash*",
        destination: "/:path*",
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "geelyksa.com",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: "false",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self' https://vimeo.com/;
              script-src 'self' 'unsafe-inline' 'unsafe-eval'
                https://vimeo.com/ https://*.vercel.app https://vercel.live
                https://cdn.sanity.io http://uae.fw-cdn.com
                https://agmc-768475558000719353-aaa2c72fa980a2717295684.freshchat.com
                https://www.google.com/ https://www.gstatic.com/
                https://www.googletagmanager.com https://*.cookiebot.com/
                https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/
                https://connect.facebook.net https://snap.licdn.com
                https://sc-static.net https://analytics.tiktok.com
                https://tr.snapchat.com https://static.ads-twitter.com https://analytics.google.com https://googleads.g.doubleclick.net
                https://c.amazon-adsystem.com https://ad.doubleclick.net https://15181648.fls.doubleclick.net 
                https://www.googleadservices.com https://bat.bing.com https://trackback.gotrackier.com https://trk.betrck.com
                https://googleads.g.doubleclick.net https://www.google.com https://www.google-analytics.com https://d1v2u6by4izioz.cloudfront.net
                https://cdn.pixel.platformance.io https://us-assets.i.posthog.com/ https://us.i.posthog.com/ https://pixel.data.platformrce.io https://gmt.gotrackier.com https://pixel.data.platformance.io https://events.data.platformance.io;
              
              connect-src 'self' https://vimeo.com/ https://*.sanity.io https://*.vercel.app
                https://app-uae.freshmarketer.com https://www.google-analytics.com
                https://*.cookiebot.com https://cdn.cookielaw.org https://*.freshmarketer.ae
                https://www.google.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/
                https://px.ads.linkedin.com https://tr.snapchat.com
                https://analytics.tiktok.com https://analytics.google.com  https://stats.g.doubleclick.net 
                https://*.ads.linkedin.com https://*.snapchat.com https://ara.paa-reporting-advertising.amazon
                https://aax-eu.amazon-adsystem.com https://ad.doubleclick.net https://c.amazon-adsystem.com https://15181648.fls.doubleclick.net
                https://www.googleadservices.com https://www.google.co.in https://google.com https://bat.bing.com https://adservice.google.com https://www.facebook.com
                https://cdn.pixel.platformance.io https://us.i.posthog.com/ https://d34iy6sn17nn1e.cloudfront.net https://us-assets.i.posthog.com https://pixel.data.platformance.io;
        
              img-src 'self' data: https://*.sanity.io https://*.vercel.app blob:
                https://www.googletagmanager.com https://px.ads.linkedin.com
                https://*.ads.linkedin.com https://www.facebook.com https://tr.snapchat.com https://analytics.tiktok.com
                https://www.google.co.in https://t.co https://analytics.twitter.com https://ad.doubleclick.net
                https://www.google.com https://www.linkedin.com https://bat.bing.com https://googleads.g.doubleclick.net
                https://www.googleadservices.com https://adservice.google.com https://cdn.pixel.platformance.io https://us.i.posthog.com/ https://adscholars10770037.o18.click https://connect.facebook.net https://trackback.gotrackier.com;
        
              style-src 'self' 'unsafe-inline'
                https://agmc-768475558000719353-aaa2c72fa980a2717295684.freshchat.com https://www.gstatic.com;
        
              font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com data:;
        
              frame-src 'self' https://*.vimeo.com/ https://vimeo.com/ https://vercel.live/
                https://agmc-768475558000719353-aaa2c72fa980a2717295684.freshchat.com
                https://www.google.com/ https://*.cookiebot.com/
                https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/
                https://www.youtube.com https://www.youtube-nocookie.com https://tr.snapchat.com
                https://geely-ae.vercel.app/ https://td.doubleclick.net
                https://13442784.fls.doubleclick.net https://www.googletagmanager.com https://www.facebook.com
                https://aax-eu.amazon-adsystem.com https://c.amazon-adsystem.com https://ad.doubleclick.net https://15181648.fls.doubleclick.net
                https://www.googleadservices.com https://trackback.gotrackier.com https://trk.betrck.com https://bat.bing.com
                https://googleads.g.doubleclick.net https://thinkabout88.gotrackier.io/ https://track.valueleadme.com https://tracking.sksdigital.co https://gmt.gotrackier.com https://pixel.data.platformance.io;
            `.replace(/\s{2,}/g, " "),
          },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Powered-By", value: "" },
          { key: "Server", value: "" },
          { key: "Set-Cookie", value: "NEXT_LOCALE=en;Path=/;HttpOnly; Secure; SameSite=Lax" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ]
        
      },
      // Cache fonts for 1 year
    {
      source: '/fonts/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    // Cache images for 1 year (you wrote 7 days, but max-age shows 1 year)
    {
      source: '/images/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    // Cache Google Fonts for 1 year (can also reduce to 30 days if desired)
    {
      source: '/:path*{/}fonts.googleapis.com/:rest*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    ]
  },
}
module.exports = withNextIntl(nextConfig)

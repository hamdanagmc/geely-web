import type { Metadata } from "next";
import PageBuilderPage from "@/app/components/PageBuilder";
import {getOfferPageQuery, getOffersQuery } from "@/sanity/lib/queries";
import { GetPageQueryResult, Offer } from "@/sanity.types";
import { PageOnboarding } from "@/app/components/Onboarding";
import { sanityFetchCustom } from "@/sanity/lib/client";
import Footer from "@/app/components/websites/Footer";
import Header from "@/app/components/websites/Header";
import { getFooter, getHeader,getSideQuickData,getSiteSettingData } from "@/app/actions/common/sanityData";
import Offerlist from "@/app/components/websites/Offerlist";
import { notFound } from "next/navigation";

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const { data: page } = await sanityFetchCustom({
    query: getOfferPageQuery(locale),
    params: { locale },
    tags: ["page:" + locale === "ar" ? "ar/offers" : "offers"],
  });

  return {
    title: page?.name || "Geely UAE",
    description: page?.heading || "Geely UAE",
  } satisfies Metadata;
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const [headerData,footerData,sideQuickData,siteSettingData,offers, page] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSideQuickData(locale),
    getSiteSettingData(locale),
    sanityFetchCustom({
      query: getOffersQuery(locale),
      params: { locale },
      tags: ["offer"],
    }),
    sanityFetchCustom({
      query: getOfferPageQuery(locale),
      params: { locale },
      tags: ["page:" + locale === "ar" ? "ar/offers" : "offers"],
    }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  return (
    <div className="main_page">
       <Header siteSettingData={siteSettingData} sideQuickData={sideQuickData} pageBg={page?.blackBackground || false} locale={locale} fragment={headerData} />
       <PageBuilderPage page={page as GetPageQueryResult} />
       <Offerlist offers={offers} />
      <Footer siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
    </div>
  );
}
import type { Metadata } from "next";
import PageBuilderPage from "@/app/components/PageBuilder";
import { getNewsPageQuery, getNewsQuery } from "@/sanity/lib/queries";
import { GetPageQueryResult, News } from "@/sanity.types";
import { PageOnboarding } from "@/app/components/Onboarding";
import { sanityFetchCustom } from "@/sanity/lib/client";
import Footer from "@/app/components/websites/Footer";
import Header from "@/app/components/websites/Header";
import { getFooter, getHeader,getSideQuickData,getSiteSettingData } from "@/app/actions/common/sanityData";
import NewsList from "@/app/components/websites/NewsList";
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
    query: getNewsPageQuery(locale),
    params: { locale },
    tags: ["page:" + locale === "ar" ? "ar/news" : "news"],
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

  const [headerData,footerData,sideQuickData,siteSettingData, news, page] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSideQuickData(locale),
    getSiteSettingData(locale),
    sanityFetchCustom({
      query: getNewsQuery(locale),
      params: { locale },
      tags: ["news"],
    }),
    sanityFetchCustom({
      query: getNewsPageQuery(locale),
      params: { locale },
      tags: ["page:" + locale === "ar" ? "ar/news" : "news"],
    }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  return (
    <div className="main_page">
       <Header siteSettingData={siteSettingData} sideQuickData={sideQuickData} pageBg={page?.blackBackground || false} locale={locale} fragment={headerData} />
       <PageBuilderPage page={page as GetPageQueryResult} />
       <NewsList news={news as News[]} />
      <Footer siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
    </div>
  );
}
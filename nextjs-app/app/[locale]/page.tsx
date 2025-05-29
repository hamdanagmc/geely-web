import type { Metadata } from "next";
import PageBuilderPage from "@/app/components/PageBuilder";
import { getHomePageQuery } from "@/sanity/lib/queries";
import { GetPageQueryResult } from "@/sanity.types";
import { PageOnboarding } from "@/app/components/Onboarding";
import { sanityFetchCustom } from "@/sanity/lib/client";
import Footer from "@/app/components/websites/Footer";
import Header from "@/app/components/websites/Header";
import Cookie from "@/app/components/websites/cookie";
import { getFooter, getHeader,getSideQuickData, getSiteSettingData } from "@/app/actions/common/sanityData";
import { notFound } from "next/navigation";
import App from "next/app";


type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params; // Await the promise first
  const { locale } = params; // Destructure params

  const page = await sanityFetchCustom({
    query: getHomePageQuery(locale),
      params: { locale },
      tags: ["page"],
  });

  return {
    title: page?.seo?.metaTitle,
    description: page?.seo?.metaDescription,
  } satisfies Metadata;
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const [headerData,footerData,sideQuickData,siteSettingData, page] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSideQuickData(locale),
    getSiteSettingData(locale),
    sanityFetchCustom({
      query: getHomePageQuery(locale),
      params: { locale },
      tags: ["page"],
    }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  return (
    <div className="main_page">
      <Header siteSettingData={siteSettingData} sideQuickData={sideQuickData} pageBg={false} locale={locale} fragment={headerData} />
      <PageBuilderPage page={page as GetPageQueryResult} />      
      <Footer siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
    </div>
  );
}
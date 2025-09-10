import type { Metadata } from "next";
import PageBuilderPage from "@/app/components/PageBuilder";
import { getPageQuery } from "@/sanity/lib/queries";
import { GetPageQueryResult } from "@/sanity.types";
import { PageOnboarding } from "@/app/components/Onboarding";
import { sanityFetchCustom } from "@/sanity/lib/client";
import Footer from "@/app/components/websites/Footer";
import Header from "@/app/components/websites/Header";
import { getHeader, getFooter, getSideQuickData,getSiteSettingData } from "@/app/actions/common/sanityData";
import { notFound,redirect  } from "next/navigation";

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
  const { locale, slug } = params; // Destructure params

  // Adjust slug based on locale
  const updatedSlug = locale === "ar" ? `ar/${slug}` : slug;

  const page = await sanityFetchCustom({
    query: getPageQuery,
    params: { slug: updatedSlug },
    tags: [`page:${updatedSlug}`],
  });

  return {
    title: page?.seo?.metaTitle,
    description: page?.heading,
  } satisfies Metadata;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { locale, slug } = params;
  const updatedSlug = locale === "ar" ? `ar/${slug}` : slug;

  const [headerData, footerData, sideQuickData,siteSettingData, page] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSideQuickData(locale),
    getSiteSettingData(locale),
    sanityFetchCustom({
      query: getPageQuery,
      params: { slug: updatedSlug },
      tags: ["page:" + (await props.params).slug],
    }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  if (page?.redirect?.redirectlink?.page?.slug) {
    //redirect to internal page
    redirect(`/${locale}/${page?.redirect?.redirectlink?.page?.slug}`);
  } else if (page?.redirect?.redirectlink?.href) {
    //redirect to external link
    redirect(page?.redirect?.redirectlink?.href);
  }
  else if (page?.redirect?.redirectlink?.car?.slug) {
    //redirect to car pages
    redirect(`/${locale}/car/${page?.redirect?.redirectlink?.car.slug}`);
  }

  return (
    <div className={`main_page innerPage ${page?.blackBackground ? "textBlack" : ""}`}>
      <Header siteSettingData={siteSettingData} sideQuickData = {sideQuickData} pageBg={page?.blackBackground || false} locale={locale} fragment={headerData} />
      <PageBuilderPage page={page as GetPageQueryResult} />
      <Footer siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
    </div>
  );
}

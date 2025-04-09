import type { Metadata } from "next";
import PageBuilderPage from "@/app/components/PageBuilder";
import { getPageQuery } from "@/sanity/lib/queries";
import { GetPageQueryResult } from "@/sanity.types";
import { PageOnboarding } from "@/app/components/Onboarding";
import { sanityFetchCustom } from "@/sanity/lib/client";
import Footer from "@/app/components/websites/Footer";
import Header from "@/app/components/websites/Header";
import { getHeader, getFooter, getSideQuickData } from "@/app/actions/common/sanityData";
import { notFound } from "next/navigation";

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

  const [headerData, footerData, sideQuickData, page] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSideQuickData(locale),
    sanityFetchCustom({
      query: getPageQuery,
      params: { slug: updatedSlug },
      tags: ["page:" + (await props.params).slug],
    }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  return (
    <div className={`main_page innerPage ${page?.blackBackground ? "textBlack" : ""}`}>
      <Header sideQuickData = {sideQuickData} pageBg={page?.blackBackground || false} locale={locale} fragment={headerData} />
      <PageBuilderPage page={page as GetPageQueryResult} />
      <Footer locale={locale} fragment={footerData} />
    </div>
  );
}

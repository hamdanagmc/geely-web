import type { Metadata } from "next";
import PageBuilderPage from "@/app/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { getCarsQuery, carsSlugs } from "@/sanity/lib/queries";
import { sanityFetchCustom } from "@/sanity/lib/client";
import { GetCarsQueryResult } from "@/sanity.types";
import { getFooter, getHeader,getSideQuickData } from "@/app/actions/common/sanityData";
import Header from "@/app/components/websites/Header";
import Footer from "@/app/components/websites/Footer";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { locale, slug } = params;

  // Adjust slug based on locale
  const updatedSlug = locale === "ar" ? `ar/${slug}` : slug;

  const page = await sanityFetchCustom({
    query: getCarsQuery,
    params: { slug: updatedSlug },
    tags: [`car:${updatedSlug}`],
  });

  return {
    title: page?.seo?.metaTitle,
    description: page?.seo?.metaDescription,
  } satisfies Metadata;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { locale, slug } = params;
  const updatedSlug = locale === "ar" ? `ar/${slug}` : slug;

  const [headerData,footerData,sideQuickData,page] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSideQuickData(locale),
    sanityFetchCustom({
      query: getCarsQuery,
      params: { slug: updatedSlug },
      tags: ["car:" + (await props.params).slug],
    }),
  ]);

  if (!page?._id) {
      return notFound();
    }

  return (
    <div className="carDetailPage">
     <Header sideQuickData = {sideQuickData} pageBg={false} locale={locale} fragment={headerData} />
      <PageBuilderPage page={page as GetCarsQueryResult} />
      <Footer locale={locale} fragment={footerData} />
    </div>
  );
}

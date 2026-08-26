import type { Metadata } from "next";
import { getOfferDetailQuery } from "@/sanity/lib/queries";
import { PageOnboarding } from "@/app/components/Onboarding";
import { sanityFetchCustom } from "@/sanity/lib/client";
import { getFooter, getHeader,getSideQuickData,getSiteSettingData } from "@/app/actions/common/sanityData";
import Header from "@/app/components/websites/Header";
import Footer from "@/app/components/websites/Footer";
import OfferDetail from "@/app/components/websites/OfferDetail";
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
    query: getOfferDetailQuery,
    params: { slug: updatedSlug },
    tags: [`offer:${updatedSlug}`],
  });

  return {
    title: page?.title,
    description: page?.title,
  } satisfies Metadata;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { locale, slug } = params;
  const updatedSlug = locale === "ar" ? `ar/${slug}` : slug;

  const [headerData,footerData,sideQuickData,siteSettingData,page] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSideQuickData(locale),
    getSiteSettingData(locale),
    sanityFetchCustom({
      query: getOfferDetailQuery,
      params: { slug: updatedSlug },
      tags: ["offer:" + (await props.params).slug],
    }),
  ]);

  if (!page?._id) {
      return notFound();
    }

  return (
    <div className={`main_page innerPage textBlack`}>
     <Header siteSettingData={siteSettingData} sideQuickData={sideQuickData} pageBg={true} locale={locale} fragment={headerData} />
      <OfferDetail siteSettingData={siteSettingData} offer={{ ...page, link: page.link && page.link.slug ? { _ref: page.link.slug, _type: "reference" } : undefined }} />
     <Footer siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
    </div>
  );
}

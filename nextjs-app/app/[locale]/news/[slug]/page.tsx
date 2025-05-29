import type { Metadata } from "next";
import PageBuilderPage from "@/app/components/PageBuilder";
import { getNewsDetailQuery, getNewsQuery } from "@/sanity/lib/queries";
import { sanityFetchCustom } from "@/sanity/lib/client";
import { GetPageQueryResult, News } from "@/sanity.types";
import { getFooter, getHeader,getSideQuickData, getSiteSettingData } from "@/app/actions/common/sanityData";
import Header from "@/app/components/websites/Header";
import Footer from "@/app/components/websites/Footer";
import ImageComp from "@/app/components/CustomImage";
import Link from "next/link";
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
    query: getNewsDetailQuery,
    params: { slug: updatedSlug },
    tags: [`news:${updatedSlug}`],
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

  const [headerData, footerData,sideQuickData,siteSettingData, page, news] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
    getSideQuickData(locale),
    getSiteSettingData(locale),
    sanityFetchCustom({
      query: getNewsDetailQuery,
      params: { slug: updatedSlug },
      tags: ["news:" + (await props.params).slug],
    }),
    sanityFetchCustom({
      query: getNewsQuery(locale),
      params: { locale },
    }),
  ]);

  if (!page?._id) {
        return notFound();
      }

  return (
   <div className={`main_page innerPage newsDetailPage textBlack`}>
      <Header siteSettingData={siteSettingData} sideQuickData = {sideQuickData} pageBg={true} locale={locale} fragment={headerData} />
      <div className="mainBanner pt-24">
        {page?.thumbnail?.altText && (
          <ImageComp
            block={page.thumbnail}
            imageClassName="object-cover w-full h-full"
            width={1600}
            height={700}
          />
        )}
      </div>
      <div className="max-w-[1440px] mx-auto px-4 py-4 md:px-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <PageBuilderPage page={page as unknown as GetPageQueryResult} />
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-4 recentNews">
            <div className="bg-[#FAF9F8] rounded-[4px] p-6">
              <h2 className="text-[16px] font-bold mb-4 pb-2 border-b border-[#454545]/20">
                RECENT NEWS
              </h2>
              <div>
                {news?.slice(0,5).map((newsItem: News, index: any) => (
                  <div
                    key={index}
                    className="py-4 border-b border-[#454545]/20"
                  >
                    <div className="md:flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="relative md:w-[120px] md:h-[80px] mb-5 md:mb-0 flex-shrink-0">
                        {newsItem?.thumbnail?.altText && (
                          <ImageComp
                            block={newsItem.thumbnail}
                            imageClassName="object-cover rounded-[4px]"
                            width={600}
                            height={500}
                          />
                        )}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <h3 className="font-medium text-[14px]">
                          {newsItem?.title}
                        </h3>
                        <Link
                          href={`/${locale}/news/${newsItem?.slug?.current
                            ?.split("/")
                            .filter((segment) => segment !== "")
                            .pop()}`}
                          className="w-fit text-black border-black bg-transparent hover:bg-[#194BFF] hover:text-white hover:border-[#194BFF] transition-colors"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
    </div>
  );
}

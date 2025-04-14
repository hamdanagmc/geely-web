import Header from "@/app/components/websites/Header";
import type { Metadata } from "next";
import Link from "next/link";
import { getFooter, getHeader, getSideQuickData,getSiteSettingData } from "@/app/actions/common/sanityData";
import Footer from "../components/websites/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: "Page Not Found - Geely UAE",
    description:"Geely UAE",
  } satisfies Metadata;
}

export default async function Page({ params }: { params: { locale?: string } }) {
  const locale = params?.locale ?? "en";

  const [headerData,footerData,siteSettingData, sideQuickData] = await Promise.all([
      getHeader(locale),
      getFooter(locale),
      getSiteSettingData(locale),
      getSideQuickData(locale),
    ]);


  return (
    <div className="notFoundPage">
    <Header siteSettingData={siteSettingData} sideQuickData={sideQuickData} pageBg={false} locale={locale} fragment={headerData} />
     <div className="notFound min-h-screen px-5 relative flex flex-col justify-center text-center items-center">
      <div className="relative z-10">
      <h1 className="geelyBlod md:text-[2rem] mt-3 mb-5 md:leading-[39px]">Sorry, this page could not be found      </h1>
      <p className="text-[18px] leading-[26px]">We couldn’t find the page you were looking for, or maybe it never<br/> existed. Try heading back to the home page.
      </p>
      <Link className="btn mt-5 text-[18px] leading-[26px] inline-block text-white font-medium bg-[#194bff] px-[15px] py-[10px] rounded-md" href={`/en`}>Back Home</Link>
      </div>
      </div>
    <Footer siteSettingData={siteSettingData} locale={locale} fragment={footerData} />
  </div>
  );
}

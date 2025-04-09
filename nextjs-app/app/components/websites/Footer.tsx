import Image from "next/image";
import Link from "next/link";
import { FooterQueryResult } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { StickyLinks } from "./StickyLinks";

type FooterProps = {
  locale: string;
  fragment: FooterQueryResult;
};

export default function Footer({ locale, fragment }: FooterProps) {
  const getLinkHref = (link: any) => {
    if (link?.linkType === "href") {
      return link.href ?? "#";
    } else if (link?.linkType === "path") {
      return link.path ?? "#";
    } else if (link?.linkType === "car") {
      return `/${locale}/car/${link.car.slug}`;
    } else if (link?.page?.slug) {
      let slug = link.page.slug;
      // Remove locale prefix if it exists (e.g., "ar/pagelink" -> "pagelink")
      if (slug.startsWith(`${locale}/`)) {
        slug = slug.replace(`${locale}/`, "");
      }
      return `/${locale}/${slug}`;
    } else {
      return "#";
    }
  };


  return (
    <>
    <StickyLinks/>
    
    <footer className={`bg-[#21262A] text-white`}>
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 py-[50px] md:pt-[130px] md:pb-[100px]">
        <div className="md:flex block">
          {/* Logos Section */}
          <div className="space-y-8 md:w-[41%] w-full min-w-[41%]">
            <div className="flex items-center gap-4 md:mt-[-10px]">
              <div className="relative w-[174px] h-[38px]">
                {fragment?.footer?.footerLogo?.image?.asset && (
                  <Image
                    src={
                      urlForImage(fragment?.footer?.footerLogo?.image)?.url() ||
                      ""
                    }
                    alt={fragment?.footer?.footerLogo?.altText || ""}
                    fill
                    priority
                    className="object-contain"
                  />
                )}
              </div>
              <div className="w-px h-6 bg-white/80" />
              <div className="relative w-[85px] h-[20px]">
                {fragment?.footer?.footerLogo2?.image?.asset?._ref && (
                  <Image
                    src={
                      urlForImage(
                        fragment?.footer?.footerLogo2?.image
                      )?.url() || ""
                    }
                    alt={fragment?.footer?.footerLogo2?.altText || ""}
                    fill
                    priority
                    className="object-contain"
                  />
                )}
              </div>
            </div>
            <p className="text-[1rem] leading-7 text-white/60">
              {fragment?.footer?.copyrightText ||
                "© Copyright 2025 Geely All rights reserved."}
            </p>
            <div className="flex items-center gap-4 text-sm text-white/60">
            <ul className="flex gap-3">
              {fragment?.footer?.linkList?.links?.map((link, index) => (
                
                  <li className="flex justify-center items-center" key={index}>
                    <Link
                      href={getLinkHref(link.link)}
                      className="hover:text-white transition-colors"
                    >
                      {link.linkText}
                    </Link>
                    {index <
                    (fragment?.footer?.linkList?.links?.length || 0) - 1 && (
                    <div className="w-px ltr:ml-2 rtl:mr-2 h-4 bg-white/20" />
                  )}
                  </li>
                  
               
              ))}
               </ul>
            </div>
            <div className="socialLinks">

              <ul className="flex gap-6">
      <li><Link href="#"><Image src="/images/fb.svg" width={25} height={25} className="max-h-[25px]" alt="facebook icon"/></Link></li>
      <li><Link href="#"><Image src="/images/yt.svg" width={25} height={25} className="max-h-[25px]" alt="facebook icon"/></Link></li>
      <li><Link href="#"><Image src="/images/x.svg" width={25} height={25} className="max-h-[25px]" alt="facebook icon"/></Link></li>
      <li><Link href="#"><Image src="/images/ig.svg" width={25} height={25} className="max-h-[25px]" alt="facebook icon"/></Link></li>
                </ul>
            </div>
          </div>

          {/* Models Column */}
          <div className="md:w-[17%] min-w-[17%] w-full md:mt-0 mt-8">
            <h3 className="text-[20px] leading-7 font-medium mb-6">
              {fragment?.footer?.linkList1?.title || "Models"}
            </h3>
            <ul className="space-y-3">
              {fragment?.footer?.linkList1?.links?.map((link) => (
                <li key={link._key}>
                  <Link
                    href={getLinkHref(link.link)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {link.linkText}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links Column */}
          <div className="[28%] min-w-[28%] w-full md:mt-0 mt-8">
            <h3 className="text-[20px] leading-7 font-medium mb-6">
              {fragment?.footer?.linkList2?.title || "Useful Links"}
            </h3>
            <ul className="space-y-3">
              {fragment?.footer?.linkList2?.links?.map((link) => (
                <li key={link._key}>
                  <Link
                    href={getLinkHref(link.link)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {link.linkText}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Geely Column */}
          <div className="[14%] min-w-[14%] w-full md:mt-0 mt-8">
            <h3 className="text-[20px] leading-7 font-medium mb-6">
              {fragment?.footer?.linkList3?.title || "About Geely"}
            </h3>
            <ul className="space-y-3">
              {fragment?.footer?.linkList3?.links?.map((link) => (
                <li key={link._key}>
                  <Link
                    href={getLinkHref(link.link)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {link.linkText}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}

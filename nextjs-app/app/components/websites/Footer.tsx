import Image from "next/image";
import Link from "next/link";
import { FooterQueryResult, SettingsQueryResult } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { StickyLinks } from "./StickyLinks";

type FooterProps = {
  locale: string;
  fragment: FooterQueryResult;
  siteSettingData: SettingsQueryResult
};

export default function Footer({ locale, fragment, siteSettingData }: FooterProps) {
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
      <StickyLinks fragment = {fragment} />

      <footer className={`bg-[#21262A] text-white`}>
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 py-[50px] md:pt-[130px] md:pb-[100px]">
          <div className="md:flex block">
            {/* Logos Section */}
            <div className="space-y-8 md:w-[41%] w-full min-w-[41%]">
              <div className="flex items-center gap-4 md:mt-[-10px]">
                <div className="relative w-[190px] h-[50px]">
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
                  <li><Link target="_blank" href={siteSettingData?.facebookLink || '#'}><Image src="/images/fb.svg" width={25} height={25} className="max-h-[25px]" alt="facebook icon" /></Link></li>
                  <li><Link target="_blank" href={siteSettingData?.youtubeLink || '#'}><Image src="/images/yt.svg" width={25} height={25} className="max-h-[25px]" alt="facebook icon" /></Link></li>
                  <li><Link target="_blank" href={siteSettingData?.twitterLink || '#'}><Image src="/images/x.svg" width={25} height={25} className="max-h-[25px]" alt="facebook icon" /></Link></li>
                  <li><Link target="_blank" href={siteSettingData?.instagramLink || '#'}><Image src="/images/ig.svg" width={25} height={25} className="max-h-[25px]" alt="facebook icon" /></Link></li>
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
      <div className="whatsApp fixed z-[10000] md:bottom-[14px] bottom-1 md:ltr:right-2 ltr:right-1 md:rtl:left-2 rtl:left-1">
        <Link className="m-[7px] block flex-shrink-0 opacity-100 w-[50px] h-[50px] rounded-full order-2 p-[5px] box-border cursor-pointer overflow-hidden shadow-[0_1px_7px_rgba(136,136,136,0.4)] transition-all duration-500 relative z-[200] bg-[#4dc247] no-underline" href="https://wa.me/97146058666" target="_blank" aria-label="Go to whatsapp">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{
            width: "100%",
            height: "100%",
            fill: "rgb(255, 255, 255)",
            stroke: "none"
          }}><path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z"></path></svg>
        </Link>
      </div>
    </>
  );
}

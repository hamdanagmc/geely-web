"use client"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import type { HeaderQueryResult, SideQuickQueryResult, SettingsQueryResult } from "@/sanity.types"
import SidePanel from "./SidePanel"
import ImageComp from "../CustomImage"
import { usePathname, useRouter } from "next/navigation"

type FooterProps = {
  locale: string
  fragment: HeaderQueryResult
  pageBg: boolean
  sideQuickData: SideQuickQueryResult
  siteSettingData : SettingsQueryResult
}

function Header({ locale, fragment, pageBg, sideQuickData,siteSettingData }: FooterProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null)
  const [activeMobileSubMenu, setActiveMobileSubMenu] = useState<string | null>(null)

  const pathname = usePathname()
  const router = useRouter()

  const pathSegments = pathname.split("/")
  const currentLocale = pathSegments[1] || "en"
  const isRTL = currentLocale === "ar"
  const switchLanguage = (lang: string) => {
    if (lang != currentLocale) {
      const newPath = `/${lang}${pathname.replace(`/${currentLocale}`, "")}`
      router.push(newPath)
    }
  }

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
      <header className={`w-full absolute z-50 pt-[26px]`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <nav className="flex relative items-end justify-between">
            {/* Logo */}
            <div className="relative w-[100px]  self-start h-8">
              <Link href={`/${currentLocale}`}>
                {pageBg && fragment?.header?.blackLogo?.altText ? (
                  <ImageComp
                    block={fragment?.header?.blackLogo}
                    imageClassName="object-contain max-h-[47px] blackTheme"
                    width={140}
                    height={47}
                  />
                ) : (
                  fragment?.header?.logo && (
                    <ImageComp
                      block={fragment?.header?.logo}
                      imageClassName="object-contain max-h-[47px] whiteTheme"
                      width={140}
                      height={47}
                    />
                  )
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex desktopmenu navItems items-center space-x-8 rtl:space-x-reverse">
              {fragment?.header?.navigation?.navItems?.map((item) => (
                <li
                  key={item._key}
                  className="relative"
                  onMouseEnter={() => item.hasSubPages && setActiveSubMenu(item._key)}
                  onMouseLeave={() => setActiveSubMenu(null)}
                >
                  <Link
                    href={getLinkHref(item.link)}
                    target={item.link?.openInNewTab ? "_blank" : undefined}
                    className="text-white hover:text-white/80 font-medium transition-colors"
                  >
                    {item.title}
                  </Link>

                  {/* Sub Menu */}
                  {item.hasSubPages && (
                    <ul className="absolute top-full ltr:left-[-20px] rtl:right-[-20px] mt-0 w-72 bg-white">
                      {item.navigation?.navItems?.map((subItem) => (
                        <li
                          key={subItem._key}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          <Link
                            href={getLinkHref(subItem.link)}
                            target={subItem.link?.openInNewTab ? "_blank" : undefined}
                            className="block px-4 font-medium py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {/* Right Side Controls */}
            <div className="flex items-center mt-[12px] ltr:space-x-6">
              {currentLocale === "en" && (
                <button
                  onClick={() => switchLanguage("ar")}
                  className="text-white rtl:ml-4 hover:text-white/80 transition-colors langBtnAr text-[1rem]"
                >
                  العربية
                </button>
              )}
              {currentLocale === "ar" && (
                <button
                  onClick={() => switchLanguage("en")}
                  className="text-white rtl:ml-4 hover:text-white/80 transition-colors langBtnAr text-[1rem]"
                >
                  EN
                </button>
              )}
              <Link
                href={`/${currentLocale}/geely-network`}
                className="text-white hover:text-white/80 rtl:ml-4 transition-colors"
              >
                {pageBg && fragment?.header?.mapIconBlack?.altText ? (
                  <ImageComp
                    block={fragment?.header?.mapIconBlack}
                    imageClassName="object-cover blackTheme"
                    width={21}
                    height={25}
                  />
                ) : (
                  fragment?.header?.mapIcon && (
                    <ImageComp
                      block={fragment?.header?.mapIcon}
                      imageClassName="object-cover whiteTheme"
                      width={21}
                      height={25}
                    />
                  )
                )}
              </Link>
              <Link href="#" className="text-white hidden hover:text-white/80 rtl:ml-4 transition-colors">
                {pageBg && fragment?.header?.searchIconBlack?.altText ? (
                  <ImageComp
                    block={fragment?.header?.searchIconBlack}
                    imageClassName="object-cover blackTheme"
                    width={30}
                    height={50}
                  />
                ) : (
                  fragment?.header?.searchIcon && (
                    <ImageComp
                      block={fragment?.header?.searchIcon}
                      imageClassName="object-cover whiteTheme"
                      width={30}
                      height={50}
                    />
                  )
                )}
              </Link>

              <button
                onClick={() => setIsSidePanelOpen(true)}
                className="text-white md:block hidden  hover:text-white/80 transition-colors"
              >
                {pageBg && fragment?.header?.toggleMenuIconBlack?.altText ? (
                  <ImageComp
                    block={fragment?.header?.toggleMenuIconBlack as any}
                    imageClassName="object-cover blackTheme"
                    width={25}
                    height={27}
                  />
                ) : (
                  fragment?.header?.toggleMenuIcon && (
                    <ImageComp
                      block={fragment?.header?.toggleMenuIcon}
                      imageClassName="object-cover whiteTheme"
                      width={25}
                      height={27}
                    />
                  )
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white hover:text-white/80 transition-colors lg:hidden"
              >
                {pageBg && fragment?.header?.toggleMenuIconBlack?.altText ? (
                  <ImageComp
                    block={fragment?.header?.toggleMenuIconBlack as any}
                    imageClassName="object-cover blackTheme"
                    width={21}
                    height={25}
                  />
                ) : (
                  fragment?.header?.toggleMenuIcon && (
                    <ImageComp
                      block={fragment?.header?.toggleMenuIcon}
                      imageClassName="object-cover whiteTheme"
                      width={21}
                      height={25}
                    />
                  )
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-95 z-[100] transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`h-full w-full flex flex-col transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : isRTL ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4">
            <Image src="/images/logo.svg" className="h-[52px] ml-0" width={80} height={47} alt="Geely Logo" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-white/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <ul className="flex flex-col items-center space-y-4 mt-8">
            {fragment?.header?.navigation?.navItems?.map((item) => (
              <li key={item._key} className="relative w-full">
                <div className="flex justify-between items-center w-full px-4">
                  <Link
                    href={getLinkHref(item.link)}
                    target={item.link?.openInNewTab ? "_blank" : undefined}
                    className="text-white hover:text-white/80 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.hasSubPages && (
                    <button
                      onClick={() => setActiveMobileSubMenu(activeMobileSubMenu === item._key ? null : item._key)}
                      className="text-white hover:text-white/80 transition-colors"
                    >
                      <ChevronDown
                        className={`w-5 h-5 transform transition-transform duration-300 ${activeMobileSubMenu === item._key ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>
                {item.hasSubPages && (
                  <ul
                    className={`mt-2 space-y-2 px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      activeMobileSubMenu === item._key ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.navigation?.navItems?.map((subItem) => (
                      <li key={subItem._key}>
                        <Link
                          href={getLinkHref(subItem.link)}
                          target={subItem.link?.openInNewTab ? "_blank" : undefined}
                          className="text-white text-[14px] hover:text-white/80 font-medium transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          {/* Content */}
          <div className="flex-1 mt-8 px-4">
            {/* Shopping Tools Section */}
            <div className="mb-12">
              <h2 className="text-[20px] text-white font-semibold mb-5">
                {sideQuickData?.sideKickSection?.iconLinkList1?.title}
              </h2>
              <div className="space-y-[15px]">
                {sideQuickData?.sideKickSection?.iconLinkList1?.links?.map((link) => (
                  <Link
                    href={getLinkHref(link.link)}
                    key={link._key}
                    className="flex text-white items-center gap-4 text-white/ hover:text-white transition-colors"
                  >
                    {link?.icon?.altText && (
                      <ImageComp block={link.icon} imageClassName="object-cover" width={24} height={24} />
                    )}

                    {link.linkText}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-auto p-6">
            <div className="flex items-center gap-6 mb-6">
              <Link href={siteSettingData?.facebookLink || "#"} className="text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link href={siteSettingData?.instagramLink || "#"} className="text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link href={siteSettingData?.twitterLink || "#"} className="text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link href={siteSettingData?.youtubeLink || "#"} className="text-white transition-colors">
                <Youtube className="w-6 h-6" />
              </Link>
            </div>
            <p className="text-sm text-white">© Copyright 2025 Geely All rights reserved.</p>
          </div>
        </div>
      </div>

      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        sideQuickData={sideQuickData}
        siteSettingData={siteSettingData}
        locale={locale}
      />
    </>
  )
}

export default Header


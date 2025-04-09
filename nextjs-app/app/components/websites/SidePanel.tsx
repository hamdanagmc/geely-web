import { useEffect, useState } from "react";
import type React from "react";
import { SideQuickQueryResult } from "@/sanity.types";
import ImageComp from "../CustomImage";
import { X, ShipWheelIcon as SteeringWheel } from "lucide-react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  sideQuickData: SideQuickQueryResult;
  locale: string;
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  sideQuickData,
  locale,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 100); // Delay of 300ms
    } else {
      setIsVisible(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;


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
    <div className="fixed inset-0 z-50 bg-black/50">
      <div
  className={`fixed inset-y-0 ltr:right-0 rtl:left-0 w-full max-w-[400px] bg-[#21262A] text-white transform transition-transform duration-300 ease-in-out ${
    isVisible
      ? "ltr:translate-x-0 rtl:translate-x-0"
      : "ltr:translate-x-full rtl:-translate-x-full"
  }`}
>

        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="relative w-[178px] h-[24px]">
              {sideQuickData?.sideKickSection?.logo?.altText && (
                <ImageComp
                  block={sideQuickData?.sideKickSection?.logo}
                  imageClassName="h-[24px]"
                  width={178}
                  height={24}
                />
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6">
            {/* Shopping Tools Section */}
            <div className="mb-12">
              <h2 className="text-[20px] font-semibold mb-5">
                {sideQuickData?.sideKickSection?.iconLinkList1?.title}
              </h2>
              <div className="space-y-[15px]">
                {sideQuickData?.sideKickSection?.iconLinkList1?.links?.map(
                  (link) => (
                    <Link
                      href={getLinkHref(link.link)}
                      key={link._key}
                      className="flex items-center gap-4 text-white/ hover:text-white transition-colors"
                    >
                      {link?.icon?.altText && (
                        <ImageComp
                          block={link.icon}
                          imageClassName="object-cover"
                          width={24}
                          height={24}
                        />
                      )}

                      {link.linkText}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Customer Care Section */}
            <div className="mb-12">
              <h2 className="text-[20px] font-semibold mb-5">
                {sideQuickData?.sideKickSection?.iconLinkList2?.title}
              </h2>
              <div className="space-y-[15px]">
                {sideQuickData?.sideKickSection?.iconLinkList2?.links?.map(
                  (link, index) => (
                    <Link
                      href={getLinkHref(link.link)}
                      key={link._key}
                      className="flex items-center gap-4 text-white/ hover:text-white transition-colors"
                    >
                      {link?.icon?.altText && (
                        <ImageComp
                          block={link.icon}
                          imageClassName="object-cover"
                          width={24}
                          height={24}
                        />
                      )}
                      {link.linkText}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto p-6">
            <div className="flex items-center gap-6 mb-6">
              <a
                href="#"
                className="text-white/ hover:text-white transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-white/ hover:text-white transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-white/ hover:text-white transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-white/ hover:text-white transition-colors"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
            <p className="text-sm text-white/">
              © Copyright 2025 Geely All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;

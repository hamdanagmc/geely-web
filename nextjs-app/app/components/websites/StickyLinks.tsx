"use client";
import React from "react";
import Link from "next/link";
import { FooterQueryResult } from "@/sanity.types";
import ImageComp from "../CustomImage";
import useDeviceDetection from "../../hooks/useDeviceDetection"

type FooterProps = {
  fragment: FooterQueryResult;
};

export const StickyLinks = ({ fragment }: FooterProps) => {
  const { currentLocale } = useDeviceDetection()
  return (
    <>
      <div
        data-we-section="floating_bar"
        className={`sticky-links sticky_sidebar fixed top-1/2 transform -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] z-50`}
      >
        <ul className="space-y-3">
          {fragment?.footer?.imageLinkArray?.map((link, index) => (
            <li key={index} className="relative">
              <Link data-we-cta href={`/${currentLocale}/${(link?.pageLink as any)?.slug?.replace(/^ar\//, "") || ""}`}>
                <span>{link.title}</span>
                {link?.image?.altText && (
                  <ImageComp
                    block={link?.image}
                    imageClassName=""
                    width={20}
                    height={20}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

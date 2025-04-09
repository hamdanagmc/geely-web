"use client";  
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const StickyLinks = () => {
  const t = useTranslations("stickyLinks");
  return (
    <>
      <div
        className={`sticky-links sticky_sidebar fixed top-1/2 transform -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] z-50`}
      >
        <ul className="space-y-3">
          <li className="relative">
            <Link href="/request-test-drive">
              <span>{t('testDrive')}</span>
              <Image
                src="/images/test_drive.webp.svg"
                alt=""
                width={20}
                height={16}
              />
            </Link>
          </li>
          <li className="relative">
            <Link href="/request-a-quote">
              <span>{t('getQuote')}</span>
              <Image
                src="/images/quote.webp.svg"
                alt=""
                width={20}
                height={16}
              />
            </Link>
          </li>
          <li className="relative ">
            <Link href="/contact-us">
              <span>{t('contactNow')}</span>
              <Image
                src="/images/whatsapp.webp.svg"
                alt=""
                width={20}
                height={16}
              />
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

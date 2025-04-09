"use client";
import { ContactInfo } from "@/sanity.types";
import ImageComp from "../CustomImage";
import Image from "next/image";
import { type PortableTextBlock } from "next-sanity";
import PortableText from "@/app/components/PortableText";

type ContactInfoProps = {
  block: ContactInfo;
};

export default function ContactInfoComp({ block }: ContactInfoProps) {
  return (
    <div className={`bg-white md:py-16 py-12 pb-4 px-4 md:px-8`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
          <div className="mb-8 md:mb-0 md:max-w-2xl">
            <h2 className="text-[#313d48] text-3xl md:text-4xl font-bold mb-2">
              {block?.heading}
            </h2>
            <h3 className="text-[#313d48] text-2xl md:text-3xl font-bold mb-6">
              {block?.subHeading}
            </h3>
            <div className="contactInfoText">
              {block?.contactMessage?.length && (
                <PortableText
                  className="text-[#606060] text-lg mb-2"
                  value={block.contactMessage as PortableTextBlock[]}
                />
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <div>
                <p className="text-[#606060]">
                  <span className="geelyBold text-[20px] font-bold">
                    {block?.emailLabel}
                  </span>
                  {block?.email && (
                    <a
                      href={`mailto: ${block?.email}`}
                      className="text-[#313d48] hover:underline"
                    >
                      {block?.email}
                    </a>
                  )}
                </p>
              </div>
              <div>
                <p className="text-[#606060]">
                  <span className="geelyBold text-[20px] font-bold">
                    {block?.phoneLabel}
                  </span>
                  {block?.phone && (
                    <a
                      href={`tel:${block?.phone}`}
                      className="text-[#313d48] hover:underline"
                    >
                      {block?.phone}
                    </a>
                  )}
                </p>
              </div>
            </div>

            <a
              href={block?.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#28d146] text-white font-medium py-3 px-6 rounded-full hover:bg-opacity-90 transition-all"
            >
              <Image src="/images/whatsapp-fleet.png" width={20} height={20} alt="whatsapp" />
              {block?.phone}
            </a>
          </div>

          <div className="relative md:w-auto w-full">
            <div className="w-full authorImg h-auto md:w-80 md:h-80 rounded-full overflow-hidden">
              {block?.image?.altText && (
                <ImageComp
                  block={block?.image}
                  imageClassName="object-cover w-full"
                  width={320}
                  height={320}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

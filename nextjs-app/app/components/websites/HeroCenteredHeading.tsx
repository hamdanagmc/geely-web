"use client";
import { HeroCenteredHeading } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import Image from "next/image";
import { type PortableTextBlock } from "next-sanity";
import PortableText from "@/app/components/PortableText";
import useDeviceDetection from "../../hooks/useDeviceDetection";

type HeroCenteredHeadingProps = {
  block: HeroCenteredHeading;
};

export default function HeroCenteredHeadingComponent({
  block,
}: HeroCenteredHeadingProps) {
  const { isMobileDevice } = useDeviceDetection();
  return (
    <section className="relative w-full heroCenteredHdg h-[100vh] md:h-[800px] overflow-hidden">
      {block.backgroundImage?.asset && !isMobileDevice && (
        <Image
          src={urlForImage(block.backgroundImage)?.url() || ""}
          alt={block.title || ""}
          fill
          priority
          className="object-cover"
        />
      )}
      {block.mobileImage?.asset && isMobileDevice && (
        <Image
          src={urlForImage(block.mobileImage)?.url() || ""}
          alt={block.title || ""}
          fill
          priority
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-[1360px] w-full px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-white text-[24px] geelyBold uppercase md:text-[28px] lg:text-[32px] font-bold mb-6">
              {block.title}
            </h1>
            {block?.richText?.length && (
              <PortableText
                className="text-white text-white/90 text-[16px] md:text-[17px] lg:text-[18px] mb-8"
                value={block.richText as PortableTextBlock[]}
              />
            )}
            {block?.titleNumber && (
              <p className="text-white geelyBold uppercase text-[24px] md:text-[28px] lg:text-[32px] font-semibold">
                {block.titleNumber}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

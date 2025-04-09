import { type PortableTextBlock } from "next-sanity";

import PortableText from "@/app/components/PortableText";
import { SpotlightSection } from "@/sanity.types";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import ImageComp from "../CustomImage";

type SpotlightSectionProps = {
  block: SpotlightSection;
  index: number;
};

export default function SpotlightComp({ block }: SpotlightSectionProps) {
  return (
    <section className={`md:py-16 py-8 spotlightSection`}>
      <div className=" mx-5 md:mx-[30px] xl:mx-10 md:px-8">
         {block?.title && <h2 className="geelyBold uppercase md:text-[36px] text-[24px] font-bold text-center mb-8 md:mb-12">{block?.title}</h2> }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {block?.cards?.map((section) => (
            <div
              key={section?._key}
              className="bg-[] rounded-lg overflow-hidden"
              style={{
                background: section?.bgImage?.asset
                  ? `url(${urlForImage(section?.bgImage)?.url()})`
                  : undefined,
                backgroundSize: "cover",
              }}
            >
              <div className="relative w-full aspect-[16/9]">
                {section?.image?.altText && (
                  <ImageComp block={section?.image} width={325} imageClassName="w-full" height={243} />
                )}
              </div>
              <div className="p-5 xl:p-[30px]">
                <h3 className=" xl:text-xl text-[18px] leading-tight uppercase font-medium mb-4 geelyBold">
                  {section?.title}
                </h3>
                <p className="text-base font-normal">{section?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

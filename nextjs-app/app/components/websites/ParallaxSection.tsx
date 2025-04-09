import { ParallaxSection } from "@/sanity.types";
import Link from "next/link";
import ImageComp from "../CustomImage";

type ParallaxSectionProps = {
  block: ParallaxSection;
  index: number;
};

export default function CTA({ block }: ParallaxSectionProps) {
  return (
    <section
      className={`relative w-full h-[600px] md:h-[600px] bg-black`}
    >
      {/* Background Image with Opacity */}
      <div className="absolute inset-0 opacity-80">
        {block?.backgroundImage?.altText && (
          <ImageComp
            block={block?.backgroundImage}
            imageClassName="object-cover w-full h-full"
            width={1440}
            height={800}
          />
        )}
      </div>

      {/* Content Container */}
      <div className="relative h-full  mx-auto  px-5 md:px-8">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="">
            <h2 className="text-[21px] leading-[28px] md:text-[26px] md:leading-[34px] lg:text-[30px] lg:leading-[39px] font-bold text-white mb-6 md:mb-8">
              {block?.title}
            </h2>
            <p className="lg:text-[18px]  lg:leading-[26px] text-[17px] leading-[24px] w-full md:w-[85%] lg:w-[65%]  m-auto text-white/90 mb-8 md:mb-10">
              {block?.description}
            </p>
            {block?.buttonLink && (
              <Link
                href={block?.buttonLink || "#"}
                className="inline-flex items-center justify-center h-12 px-8 text-sm font-medium text-white transition-colors border border-white hover:bg-white hover:text-black"
              >
                {block?.buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

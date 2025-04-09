"use client";
import { HeroFleetSales } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import Image from "next/image";
import { type PortableTextBlock } from "next-sanity";
import PortableText from "@/app/components/PortableText";
import { ParallaxProvider, useParallax } from "react-scroll-parallax";
import { useRef } from "react";
import ImageComp from "../CustomImage";
import Link from "next/link";
import useDeviceDetection from "../../hooks/useDeviceDetection"

const ParallaxContent = ({ block }: { block: HeroFleetSales }) => {
  const target = useRef<HTMLDivElement>(null);
  const { ref } = useParallax<HTMLDivElement>({
    speed: -20,
    targetElement: target.current || undefined,
  });
  const { isMobileDevice } = useDeviceDetection()

  return (
    <section className="relative w-full heroFleetSales parallaxWithRichText min-h-[600px] md:h-screen overflow-hidden">
      {!isMobileDevice && block?.backgroundImage?.altText && (
        <div ref={target} className="absolute inset-0 h-[120%] -top-[10%]">
          <div className="relative w-full h-full" ref={ref}>
            <ImageComp
              block={block.backgroundImage}
              imageClassName="object-cover object-bottom w-full"
              width={1600}
              height={700}
            />
          </div>
        </div>
      )}
      {isMobileDevice && block?.mobileImage?.altText && (
        <div ref={target} className="absolute inset-0 h-auto -top-[0]">
          <div className="relative w-full h-full" ref={ref}>
            <ImageComp
              block={block.mobileImage}
              imageClassName="object-cover object-bottom"
              width={700}
              height={800}
            />
          </div>
        </div>
      )}
      
      <div className="absolute z-10 md:bottom-[230px] bottom-5 left-1/2 -translate-x-1/2 w-full max-w-[1360px]">
        <div className="md:max-w-[460px] w-[calc(100%-40px)] md:m-0 ltr:ml-5 rtl:mr-5 md:p-[35px] p-5 text-white bg-[#0000003D]">
          <div className=" text-white/90">
            <h3>{block?.text}</h3>
            {block?.cta?.buttonText && (
              <Link href="#registerForm">{block?.cta?.buttonText}</Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function HeroFleetSalesComp({
  block,
}: {
  block: HeroFleetSales;
}) {
  return (
    <ParallaxProvider>
      <ParallaxContent block={block} />
    </ParallaxProvider>
  );
}

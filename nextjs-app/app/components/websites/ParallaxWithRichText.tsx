"use client";
import { ParallaxWithRichText } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import Image from "next/image";
import { type PortableTextBlock } from "next-sanity";
import PortableText from "@/app/components/PortableText";
import { ParallaxProvider, useParallax } from "react-scroll-parallax";
import { useRef } from "react";

const ParallaxContent = ({ block }: { block: ParallaxWithRichText }) => {
  const target = useRef<HTMLDivElement>(null);
  const { ref } = useParallax<HTMLDivElement>({
    speed: -20,
    targetElement: target.current || undefined
  });

  return (
    <section className="relative w-full parallaxWithRichText min-h-[600px] h-screen overflow-hidden">
      {block.backgroundImage?.asset && (
        <div ref={target} className="absolute inset-0 h-[120%] -top-[10%]">
          <div className="relative w-full h-full" ref={ref}>
            <Image
              src={urlForImage(block.backgroundImage)?.url() || ""}
              alt={block?.title || ''}
              fill
              priority
              className="object-cover object-bottom"
            />
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute md:top-[180px] top-28 left-1/2 -translate-x-1/2 w-full max-w-[1360px]">
        <div className="max-w-2xl px-4 text-white">
          <h1 className="text-[21px] md:text-[28px] lg:text-[32px] font-bold mb-6">
            {block.title}
          </h1>
          <div className="space-y-6 text-white/90">
          {block?.richText?.length && (
              <PortableText
                className="text-white"
                value={block.richText as PortableTextBlock[]}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function ParallaxWithRichTextComp({ block }: { block: ParallaxWithRichText }) {
  return (
    <ParallaxProvider>
      <ParallaxContent block={block} />
    </ParallaxProvider>
  );
}
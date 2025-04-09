"use client";
import { BackgroundWithCaption } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import Image from "next/image";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

type BackgroundWithCaptionProps = {
  block: BackgroundWithCaption;
};

export default function BackgroundWithCaptionComponent({ block }: BackgroundWithCaptionProps) {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 1000,
      easing: 'ease-out',
    });
  }, []);
  return (
    <section className="relative backgroundWC w-full h-screen min-h-[600px] overflow-hidden">
      {block.backgroundImage?.asset && (
        <Image
          src={urlForImage(block.backgroundImage)?.url() || ""}
          alt={block?.title || ''}
          className="object-cover w-full h-full"
          width={1440}
          height={900}
        />
      )}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute top-[180px] left-1/2 -translate-x-1/2 w-full max-w-[1360px]">
        <div className="max-w-3xl px-4">
        <p 
            data-aos="fade-up" 
            data-aos-delay="100"
            className="text-white/90 md:text-[22px] text-[22px] leading-tight mb-2 font-light"
          >
            {block?.preTitle}
          </p>
          <h1 
            data-aos="fade-up" 
            data-aos-delay="200"
            className="text-white md:text-[36px] text-[24px] leading-tight font-bold tracking-wide"
          >
            {block?.title}
          </h1>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ImageGallery } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";

type ImageGalleryProps = {
  block: ImageGallery;
  index: number;
};

export default function ImageGalleryComponent({ block }: ImageGalleryProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full bg-white py-16 md:py-18 md:pb-20 imgGallery overflow-hidden">
      <div className="mx-auto ">
        <h2 className="text-center text-[32px] leading-[39px] geelyBold uppercase font-bold mb-12">{block?.title}</h2>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={1.3}
            centeredSlides={true}
            spaceBetween={10}
            loop={true}
            onSwiper={setSwiper}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="!overflow-visible"
          >
            {block?.images?.map((image, index) => (
              <SwiperSlide key={index}>
                {({ isActive }) => (
                  <div
                    className={`relative aspect-video transition-all duration-500 ${isActive ? "opacity-100" : "opacity-50 scale-95"}`}
                  >
                    <Image
                      src={urlForImage(image)?.url() || "/images/banner1.jpg"}
                      alt={`Gallery image ${index + 1}`}
                      width={1600}
                      height={700}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          

          {/* Custom Pagination */}
          <div className="flex justify-center gap-3 mt-8">
            {block?.images?.map((_, index) => (
              <button
                key={index}
                onClick={() => swiper?.slideToLoop(index)}
                className={`h-[3px] transition-all duration-300 ${
                  activeIndex === index ? "w-6 bg-black" : "w-4 bg-black/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

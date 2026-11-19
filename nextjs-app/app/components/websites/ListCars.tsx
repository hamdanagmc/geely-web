"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ListCars } from "@/sanity.types";
import ImageComp from "../CustomImage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Swiper as SwiperType } from "swiper";
import useDeviceDetection from "../../hooks/useDeviceDetection";
import { trackWebEngage } from "@/app/lib/webengage";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const carSlug = (car: any): string =>
  car?.exploreLink?.link?.slug?.split("/").filter(Boolean).pop() ?? "";

type CarModelsCarouselProps = {
  block: ListCars;
};

export default function CarModelsCarousel({ block }: CarModelsCarouselProps) {
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const { currentLocale } = useDeviceDetection();
  const trackedSlides = useRef(new Set<number>());
  const touchStartIndex = useRef(0);

  // Carousel Interacted: user actions only (never autoplay), once per slide per page view.
  const trackSlide = (action: "tab_click" | "swipe" | "arrow", index: number) => {
    if (trackedSlides.current.has(index)) return;
    trackedSlides.current.add(index);
    trackWebEngage("Carousel Interacted", {
      carousel_id: "home_model_tabs",
      action,
      slide_position: index + 1,
      model_id: carSlug(block.cars?.[index]),
    });
  };

  // Handle client-side rendering for Swiper
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section className="pt-[72px] carModelsCarousel pb-8 bg-[#D0D7EB]">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8">
        <h2 className="text-[32px] leading-[39px] font-bold text-center geelyBold uppercase mb-10">
          {block.title}
        </h2>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay]}
            spaceBetween={24}
            slidesPerView={2}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onTouchStart={(swiper) => {
              touchStartIndex.current = swiper.realIndex;
            }}
            onTouchEnd={(swiper) => {
              // Swiper picks the new slide right after touchEnd fires.
              setTimeout(() => {
                if (swiper.realIndex !== touchStartIndex.current) trackSlide("swipe", swiper.realIndex);
              });
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              bulletClass:
                "swiper-pagination-bullet w-2 h-2 rounded-full bg-gray-300 inline-block mx-1",
              bulletActiveClass: "swiper-pagination-bullet-active bg-black",
            }}
            autoplay={{
              delay: 3000, 
              disableOnInteraction: false, 
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
            }}
            className="!pb-12"
          >
            {block.cars?.map((car, index) => (
              <SwiperSlide key={car._key}>
                <Link
                  href={`/${currentLocale}/car/${carSlug(car)}`}
                  onClick={() => trackSlide("tab_click", index)}
                  className="w-full flex flex-col items-center"
                >
                  <div className="relative w-full flex items-center justify-center mb-3 overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105">
                    {car?.carImage?.altText && (
                      <ImageComp
                        block={car?.carImage}
                        imageClassName="object-contain h-[105px] w-full"
                        width={215}
                        height={105}
                      />
                    )}
                  </div>
                  <h3 className="text-[18px] font-normal uppercase text-center">
                    {car?.carTitle}
                  </h3>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation buttons */}
          <button
            onClick={() => {
              swiperRef.current?.slidePrev();
              trackSlide("arrow", swiperRef.current?.realIndex ?? 0);
            }}
            className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:block"
            aria-label="Previous models"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M15 18L9 12L15 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={() => {
              swiperRef.current?.slideNext();
              trackSlide("arrow", swiperRef.current?.realIndex ?? 0);
            }}
            className="absolute -right-12 top-1/2 -translate-y-1/2 hidden lg:block"
            aria-label="Next models"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M9 18L15 12L9 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Custom pagination */}
          <div className="swiper-pagination hidden mt-6 flex justify-center"></div>
        </div>
      </div>
    </section>
  );
}

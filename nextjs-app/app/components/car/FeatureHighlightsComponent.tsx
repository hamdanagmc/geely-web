"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { FeatureHighlightsComponent } from "@/sanity.types";
import type { Swiper as SwiperType } from "swiper";
import ImageComp from "../CustomImage";
import useDeviceDetection from "../../hooks/useDeviceDetection";
import Vimeo from "@u-wave/react-vimeo"

type FeatureHighlightsComponentProps = {
  block: FeatureHighlightsComponent;
  index: number;
};

export default function FeatureHighlightsComp({
  block,
}: FeatureHighlightsComponentProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { isMobileDevice } = useDeviceDetection();

  return (
    <section
      id={`${block?.htmlId}`}
      className="bg-black text-white py-12 md:py-16 overflow-hidden uniFeatureSlider">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 ">
        <h2 className="text-center text-[28px] md:text-[36px] leading-[42px] font-medium mb-8 md:mb-[74px] custom-tracking">
          {block.title}
        </h2>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            centeredSlides={false}
            spaceBetween={0}
            breakpoints={{
              768: {
                slidesPerView: "auto",
                centeredSlides: true,
                spaceBetween: 20,
              },
            }}
            loop={true}
            autoplay={{ delay: 7000, disableOnInteraction: false }}
            onSwiper={setSwiper}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="!overflow-visible"
          >
            {block?.tabs?.[0]?.highlights?.map((slide, index) => (
              <SwiperSlide key={slide._key} className="!w-auto">
                <div className="relative h-[540px] bg-gray-900 rounded-lg overflow-hidden">

                  {!slide?.mediaType && slide?.image?.altText && !isMobileDevice && (
                    <ImageComp
                      block={slide?.image}
                      imageClassName="object-cover w-full h-full"
                      width={620}
                      height={500}
                    />
                  )}
                  {!slide?.mediaType && slide?.mobileImage?.altText && isMobileDevice && (
                    <ImageComp
                      block={slide?.mobileImage}
                      imageClassName="object-cover w-full h-full"
                      width={620}
                      height={624}
                    />
                  )}

                  {slide?.mediaType == 'image' && slide?.optionImage?.altText && !isMobileDevice && (
                    <ImageComp
                      block={slide?.optionImage}
                      imageClassName="object-cover w-full h-full"
                      width={620}
                      height={500}
                    />
                  )}
                  {slide?.mediaType == 'image' && slide?.optionMobileImage?.altText && isMobileDevice && (
                    <ImageComp
                      block={slide?.optionMobileImage}
                      imageClassName="object-cover w-full h-full"
                      width={620}
                      height={624}
                    />
                  )}

                  {slide?.mediaType === 'video' && slide?.videoId && (
                    <Vimeo
                      video={slide.videoId}
                      autoplay
                      loop
                      muted
                      controls={false}
                      responsive
                      background={true}
                      dnt={true}
                      className={`video-player ${slide.videoSize === '334x540' ? 'md:w-[334px] w-full h-[540px]' : 'w-[720px] h-[540px]'
                        } static inset-0 object-cover`}
                      onError={(error) => {
                        console.error("Vimeo Player Error:", error);
                      }}
                    />
                  )}



                  <div
                    className={`absolute inset-0 ${activeIndex === index
                      ? "bg-transparent"
                      : "bg-gradient-to-t from-black/80 to-transparent"
                      }`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-xl geelyBold  md:text-[26px] font-bold mb-2 md:mb-3 tracking-wider leading-8">
                      {slide?.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-200">
                      {slide?.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination */}
          <div className="flex justify-center gap-3 mt-8">
            {block?.tabs?.[0]?.highlights?.map((_, index) => (
              <button
                key={index}
                onClick={() => swiper?.slideToLoop(index)}
                className={`h-[3px] transition-all duration-300 ${activeIndex === index ? "w-6 bg-white" : "w-5 bg-white/40"
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

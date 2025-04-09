"use client"

import { useState, useEffect } from "react"
import type { ImageTextSlider } from "@/sanity.types"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Controller } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import ImageComp from "../CustomImage"
import type { PortableTextBlock } from "next-sanity"
import PortableText from "@/app/components/PortableText"

type ImageTextSliderProps = {
  block: ImageTextSlider
  index: number
}

export default function ImageTextSliderComponent({ block }: ImageTextSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [imageSwiper, setImageSwiper] = useState<SwiperType | null>(null)
  const [textSwiper, setTextSwiper] = useState<SwiperType | null>(null)

  const totalSlides = block?.slides?.length || 0

  useEffect(() => {
    if (imageSwiper && textSwiper) {
      imageSwiper.controller.control = textSwiper
      textSwiper.controller.control = imageSwiper
    }
  }, [imageSwiper, textSwiper])

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex)
  }

  const goToSlide = (index: number) => {
    if (imageSwiper && textSwiper) {
      imageSwiper.slideToLoop(index)
    }
  }

  return (
    <section className="flex imageTextSliderComp flex-col lg:flex-row w-full min-h-[600px]">
      {/* Image Section */}
      <div className="relative w-full lg:w-[60%] md:h-[400px] lg:h-auto overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Controller]}
          onSwiper={setImageSwiper}
          onSlideChange={handleSlideChange}
          slidesPerView={1}
          loop={true}
          className="h-full"
        >
          {block?.slides?.map((slide, index) => (
            <SwiperSlide key={index}>
              {slide?.image?.altText && (
                <ImageComp
                  block={slide?.image}
                  imageClassName="object-cover w-full h-full object-center"
                  width={892}
                  height={669}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-[40%] md:p-8 px-4 py-6 lg:p-16 flex flex-col justify-between text-white">
        <Swiper
          modules={[Navigation, Pagination, Controller]}
          onSwiper={setTextSwiper}
          onSlideChange={handleSlideChange}
          slidesPerView={1}
          loop={true}
          className="w-full"
        >
          {block?.slides?.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="space-y-8">
                <h2 className="md:text-[25px] text-[21px] font-bold geelyBold uppercase text-black tracking-wide">{slide.title}</h2>
                {slide?.text?.length && <PortableText className="" value={slide.text as PortableTextBlock[]} />}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation with Centered Number */}
        <div className="md:mt-12 mt-8 md:mb-0 mb-4 flex gap-2 md:justify-end justify-center">
          {/* Previous Button */}
          {activeIndex > 0 && (
            <button
              onClick={() => goToSlide(activeIndex - 1)}
              className="group flex items-center text-black gap-2 hover:text-white/80 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
            </button>
          )}

          {/* Slide Number (Always Centered) */}
          <span className="text-[18px] font-medium text-black">
            {activeIndex + 1}/{totalSlides}
          </span>

          {/* Next Button */}
          {activeIndex < totalSlides - 1 && (
            <button
              onClick={() => goToSlide(activeIndex + 1)}
              className="group flex items-center text-black gap-2 hover:text-white/80 transition-colors"
            >
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

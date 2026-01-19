"use client"

import { useState, useEffect } from "react"
import type { OwlStageOuter } from "@/sanity.types"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Controller, Autoplay, Pagination } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import ImageComp from "../CustomImage"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import Vimeo from "@u-wave/react-vimeo"

type OwlStageOuterProps = {
  block: OwlStageOuter
  index: number
}

export default function OwlStageOuterComp({ block, index }: OwlStageOuterProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [imageSwiper, setImageSwiper] = useState<SwiperType | null>(null)
  const totalSlides = block?.slides?.length ?? 0
  const { isMobileDevice } = useDeviceDetection()

  useEffect(() => {
    if (imageSwiper) {
      imageSwiper.autoplay.start() // Ensure autoplay starts
    }
  }, [imageSwiper])

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex)
  }

  const goToSlide = (direction: "prev" | "next") => {
    if (imageSwiper) {
      direction === "prev" ? imageSwiper.slidePrev() : imageSwiper.slideNext()
    }
  }

  // Custom bullet pagination for mobile
  const renderCustomBullets = () => {
    if (!isMobileDevice || totalSlides <= 1) return null

    return (
      <div className="custom-bullets absolute left-1/2 -translate-x-1/2 bottom-24 z-20 flex items-center justify-center gap-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => imageSwiper?.slideTo(i)}
            className={`w-6 h-[3px] transition-all duration-300 ${activeIndex === i ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    )
  }

  return (
    <section
      id={`${block?.htmlId}`}
      className={`${block?.title ? "sectTileAb" : "sectTile"} sectTileMain owlStageVideo relative bg-gradient-to-b from-neutral-800 to-neutral-900 text-white overflow-hidden owlStageComp`}
    >
      <div className="absolute secTileTop md:top-[60px] top-[25px] text-center z-10 left-1/2 -translate-x-1/2 mb-8 md:mb-12">
        {block?.title && (
          <h2 className="text-[36px] custom-tracking leading-[44px] geelyBold  font-bold mb-2">
            {block?.title}
          </h2>
        )}
        {block?.description && (
          <p className="text-[18px] leading-[26px] text-white-300 max-w-5xl md:min-w-[1030px] mx-auto">
            {block?.description}
          </p>
        )}
      </div>



      {/* Image Swiper */}
      <Swiper
        modules={[Navigation, Controller, Autoplay, Pagination]}
        onSwiper={setImageSwiper}
        onSlideChange={handleSlideChange}
        slidesPerView={1}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop={true}
        className="h-full"
      >
        {block.slides?.map((slide, slideIndex) => (
          <SwiperSlide key={slide._key}>
            {!slide?.mediaType && slide?.image?.altText && !isMobileDevice && (
              <ImageComp block={slide.image} imageClassName="object-cover w-full h-full" width={1600} height={800} />
            )}
            {!slide?.mediaType && slide?.mobileImage?.altText && isMobileDevice && (
              <ImageComp
                block={slide.mobileImage}
                imageClassName="object-cover w-full h-full"
                width={1600}
                height={800}
              />
            )}

            {slide?.mediaType == 'image' && slide?.optionImage?.altText && !isMobileDevice && (
              <ImageComp
                block={slide?.optionImage}
                imageClassName="object-cover w-full h-full" width={1600} height={800}
              />
            )}
            {slide?.mediaType == 'image' && slide?.optionMobileImage?.altText && isMobileDevice && (
              <ImageComp
                block={slide?.optionMobileImage}
                imageClassName="object-cover w-full h-full"
                width={1600}
                height={800}
              />
            )}

            {slide?.mediaType == 'video' && !isMobileDevice && slide?.videoId && (
              <Vimeo
                video={slide.videoId}
                autoplay
                loop
                muted
                controls={false}
                responsive
                background={true}
                dnt={true}
                className="w-full h-[83vh] static inset-0 object-cover"
                onError={(error) => {
                  console.error("Vimeo Player Error:", error)
                }}
              />
            )}

            {slide?.mediaType == 'video' && isMobileDevice && slide?.mobileVideoId && (
              <Vimeo
                video={slide.mobileVideoId}
                autoplay
                loop
                muted
                controls={false}
                responsive
                background={true}
                dnt={true}
                className="w-full h-[83vh] static inset-0 object-cover"
                onError={(error) => {
                  console.error("Vimeo Player Error:", error)
                }}
              />
            )}

            {/* Footer */}
            <div className="mt-8 md:mt-12 absolute footertxtBtm ltr:md:left-[60px] ltr:left-[10px] rtl:md:right-[60px] rtl:right-[10px] bottom-10">
              <div className="max-w-3xl">
                <h3 className="text-[26px] leading-6 geelyBold  font-bold mb-2">{slide?.title}</h3>
                <p className="text-[18px] leading-[26px] text-white-300">{slide?.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Custom Bullets for Mobile */}

      {renderCustomBullets()}

      {/* Navigation Controls */}
      <div className="mt-8 bulletsRight flex gap-4 justify-end">
        {totalSlides > 1 && (
          <button
            onClick={() => goToSlide("prev")}
            className="group flex items-center text-white/80 gap-2 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          </button>
        )}
        <span className="text-[16px] font-medium text-white">
          {totalSlides > 0 ? `${activeIndex + 1}/${totalSlides}` : "0/0"}
        </span>
        {totalSlides > 1 && (
          <button
            onClick={() => goToSlide("next")}
            className="group flex items-center text-white/80 gap-2 hover:text-white transition-colors"
          >
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </section>
  )
}


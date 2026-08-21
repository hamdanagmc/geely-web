"use client"
import type { BannerCarousel } from "@/sanity.types"
import { useEffect, useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, EffectFade } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/effect-fade"
import "aos/dist/aos.css"
import AOS from "aos"
import { urlForImage } from "@/sanity/lib/utils"
import Link from "next/link"
import ImageComp from "../CustomImage"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { useTestDrive } from "../../context/TestDriveContext";
import { useRouter } from "next/navigation"
import Image from "next/image"

type BannerCarouselProps = {
  block: BannerCarousel
  index: number
}

export default function BannerCarouselComp({ block }: BannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { isMobileDevice, currentLocale } = useDeviceDetection()
  const swiperRef = useRef<SwiperType | null>(null)
  const { setTestDrive } = useTestDrive();
  const router = useRouter();

  const handleTestDriveSelection = (testDriveIdOrName: string) => {
    setTestDrive(testDriveIdOrName);
    router.push(`/${currentLocale}/request-test-drive`);
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: false })
  }, [])

  const handleDotClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index)
    }
  }

  return (
    <Swiper
      modules={[Autoplay, Navigation, EffectFade]}
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      effect="fade"
      autoplay={false}
      navigation={false}
      className="w-full h-screen bannerCarousel"
      onSwiper={(swiper) => {
        swiperRef.current = swiper
      }}
      onSlideChange={(swiper) => {
        setActiveIndex(swiper.realIndex)
        setTimeout(() => AOS.refresh(), 300)
      }}
    >
      {block?.slides?.map((slide, index) => (
        <SwiperSlide key={index} className="relative w-full h-full">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"

          >{isMobileDevice && slide?.mobileImage?.altText ? (
            <Image
              src={urlForImage(slide?.mobileImage?.image ?? "")?.url() ?? "/placeholder.svg"}
              alt={slide?.mobileImage?.altText || ""}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              quality={90}
            />
          ) : slide?.desktopImage?.altText ? (
            <Image
              src={urlForImage(slide?.desktopImage?.image)?.url() || "/placeholder.svg"}
              alt={slide?.desktopImage?.altText || ""}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              quality={90}
            />
          ) : null}</div>

          {/* Content Overlay */}
          <div className={`absolute ${block?.textAlign ? 'heroTopAlign' : 'items-center'} banner_Text_main inset-0 flex max-w-[1440px] m-auto flex-col`}>
            {/* Logo and Title */}
            <div
              key={activeIndex}
              data-aos={activeIndex === index ? "fade-right" : ""}
              className={`flex-1 w-full banner_Text p-6 sm:p-8 md:p-12 flex ${block?.textAlign ? 'items-start' : 'items-center'} `}
            >
              <div className="space-y-4 bannerSlideLeft sm:space-y-6">
                <div className="relative w-[200px] banner_logo h-[30px] sm:w-[300px] sm:h-[45px] md:w-[280px] md:h-[80px]">
                  {slide?.logoImage?.altText && (
                    <ImageComp
                      block={slide?.logoImage}
                      imageClassName="object-contain object-left"
                      width={280}
                      height={80}
                    />
                  )}
                </div>
                <h2 className="text-white md:max-w-[600px] geelyBold text-xl sm:text-2xl md:text-[52px] md:leading-[62px] font-light tracking-wide leading-tight">
                  {slide?.headingText}
                </h2>
              </div>
            </div>

            {/* Bottom Controls */}
            {isMobileDevice && (
              <div className="p-6 sm:p-8 banner_Text_btm md:p-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
                {/* Custom Pagination Dots */}
                <div className="flex md:mt-3 gap-3 order-2 sm:order-1">
                  {block?.slides?.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() => handleDotClick(dotIndex)}
                      className={`w-6 h-[3px] rounded-none transition-all duration-300 ${activeIndex === dotIndex ? "w-6 bg-white" : "bg-white/40"
                        }`}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-4 banner_Text_btn order-1 sm:order-2">
                  {slide?.learnMoreTitle && (
                    <Link
                      href={`/${currentLocale}/car/${(slide?.link as any)?.slug
                        ?.split('/')
                        .filter((segment: string) => segment !== '')
                        .pop()}`}
                      className="px-4 linktype1 sm:px-6 font-medium md:px-8 py-2 sm:py-[13px] border border-white text-white text-sm sm:text-[15px] hover:bg-white/10 transition-colors rounded-[4px]"
                    >
                      {slide?.learnMoreTitle}
                    </Link>
                  )}
                  {slide?.testDriveTitle && (
                    <button
                      onClick={() => handleTestDriveSelection((slide?.link as unknown as { title?: string })?.title || "")}
                      className="px-4 linktype2 font-medium sm:px-6 md:px-8 py-2 sm:py-[13px] bg-white text-[#194BFF] text-sm sm:text-[15px] hover:bg-white/90 transition-colors rounded-[4px]"
                    >
                      {slide?.testDriveTitle}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Bottom Controls */}
          {!isMobileDevice && (
            <div className="p-6 sm:p-8 absolute bottom-2 w-full banner_Text_btm md:pl-[40px] md:pr-[30px] py-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
              {/* Custom Pagination Dots */}
              <div className="flex md:mt-3 gap-3 order-2 sm:order-1">
                {block?.slides?.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => handleDotClick(dotIndex)}
                    className={`w-6 h-[3px] rounded-none transition-all duration-300 ${activeIndex === dotIndex ? "w-6 bg-white" : "bg-white/40"
                      }`}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                  />
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 banner_Text_btn order-1 sm:order-2">
                {slide?.learnMoreTitle && (
                  <Link
                    href={slide?.link ? `/${currentLocale}/car/${(slide?.link as any)?.slug
                      ?.split('/')
                      .filter((segment: string) => segment !== '')
                      .pop()}` : slide.carDetailPath || ""}
                    className="px-4 linktype1 sm:px-6 font-medium md:px-8 py-2 sm:py-[13px] border border-white text-white text-sm sm:text-[15px] hover:bg-white/10 transition-colors rounded-[4px]"
                  >
                    {slide?.learnMoreTitle}
                  </Link>
                )}
                {slide?.testDriveTitle && (
                  <button
                    onClick={() => handleTestDriveSelection((slide?.link as unknown as { title?: string })?.title || "")}
                    className="px-4 linktype2 font-medium sm:px-6 md:px-8 py-2 sm:py-[13px] bg-white text-[#194BFF] text-sm sm:text-[15px] hover:bg-white/90 transition-colors rounded-[4px]"
                  >
                    {slide?.testDriveTitle}
                  </button>
                )}
              </div>
            </div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  )
}


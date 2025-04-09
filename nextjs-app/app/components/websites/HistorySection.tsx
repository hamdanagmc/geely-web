"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import "swiper/css/autoplay"
import type { HistorySection } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils"

type HistorySectionProps = {
  block: HistorySection
  index: number
}

export default function HistorySectionComp({ block }: HistorySectionProps) {
  const allYears = block.items
    ? [...new Set(block.items.map((item) => item.year).filter(Boolean))].sort((a, b) => (b || 0) - (a || 0))
    : []

  const [selectedYear, setSelectedYear] = useState<number | undefined>(allYears[0])
  const swiperRef = useRef<any>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleYearClick = (year: number | undefined) => {
    if (year) {
      setSelectedYear(year)
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideTo(0)
      }
    }
  }

  const itemsForSelectedYear = block.items ? block.items.filter((item) => item.year === selectedYear) : []

  return (
    <section className={`min-h-screen historyComp`}>
      <div className="md:py-16 py-8 lg:flex justify-end">
        {/* Timeline - Mobile/Tablet */}
        <div className="lg:hidden overflow-x-auto mb-8 bg-[#E8E7E7]">
          <div className="inline-flex items-center gap-6 min-w-max p-4">
            <span className="text-lg font-medium">
              Till
              <br /> Now
            </span>
            {allYears.map((year) => (
              <button
                key={year}
                onClick={() => handleYearClick(year)}
                className="relative flex flex-row-reverse items-center gap-6 cursor-pointer"
              >
                <span
                  className={`w-[10px] timeline_dot h-[10px] rounded-full ${
                    year === selectedYear ? "timeline_dot" : "bg-[#D1D5DB]"
                  }`}
                ></span>
                <span
                  className={`text-3xl year w-[75px]  ${
                    year === selectedYear ? "grad_clr font-medium" : "text-gray-400 yearNot text-2xl"
                  }`}
                >
                  {year}
                </span>
              </button>
            ))}
            <span className="text-lg font-medium">Then</span>
          </div>
        </div>
        {/* Main Content */}
        <div className="lg:max-w-[1100px] md:mx-[70px] mx-[15px] history-swiper-container" ref={contentRef}>
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".history-pagination",
              bulletClass: "history-pagination-bullet",
              bulletActiveClass: "history-pagination-bullet-active",
            }}
            className="mb-8"
          >
            {itemsForSelectedYear.map((item) => (
              <SwiperSlide key={item._key}>
                <div className="bg-white rounded-lg overflow-hidden">
                  {item.imageList && item.imageList.length > 0 && (
                    <div className="relative w-full aspect-video bg-gray-100">
                      <Swiper
                        modules={[EffectFade, Navigation, Pagination, Autoplay]}
                        navigation
                        autoplay={{
                          delay: 4000,
                          disableOnInteraction: false,
                        }}
                        pagination={{
                          clickable: true,
                          bulletClass: "history-pagination-bullet",
                          bulletActiveClass: "history-pagination-bullet-active",
                        }}
                        className="w-full h-full"
                      >
                        {item.imageList.map((imageItem) => (
                          <SwiperSlide key={imageItem._key}>
                            {imageItem.image?.asset && (
                              <Image
                                src={urlForImage(imageItem.image)?.url() || ""}
                                alt={imageItem.altText || "History image"}
                                fill
                                className="object-center object-cover"
                              />
                            )}
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}
                  <div className="py-6">
                    {item.textList && item.textList.length > 0 && (
                      <ul className="list-disc">
                        {item.textList.map((text, index) => (
                          <li key={index} className="text-[16px] text-gray-600 leading-relaxed mb-2">
                            {text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="history-pagination mt-4"></div>
          </Swiper>
        </div>

        {/* Timeline - Desktop */}
        <div className="hidden desktopTimeline lg:block lg:w-[210px] relative">
          <div className="sticky h-full top-8 bg-[#f5f5f5] py-8 pl-[35px] pr-[65px] right-[45px]">
            <div className="text-lg ml-8 font-medium mb-8">Till Now</div>

            {/* Vertical Timeline */}
            <div className="relative after:content-[''] after:absolute after:w-[1px] after:h-full after:ltr:left-[103.5px] after:rtl:right-[103.5px] after:bg-opacity-25 after:top-0 after:bg-black">
              {/* Years */}
              <div className="space-y-[30px]">
                {allYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearClick(year)}
                    className="relative flex flex-row-reverse items-center gap-6 cursor-pointer"
                  >
                    <span
                      className={`w-[10px] timeline_dot h-[10px] rounded-full ${
                        year === selectedYear ? "timeline_dot" : "bg-[#D1D5DB]"
                      }`}
                    ></span>
                    <span
                      className={`text-3xl year w-[75px]  ${
                        year === selectedYear ? "grad_clr font-medium" : "text-gray-400 yearNot text-2xl"
                      }`}
                    >
                      {year}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-lg font-medium mt-8">Then</div>
          </div>
        </div>
      </div>

      {/* Add custom styles for pagination */}
      <style jsx global>{`
        .history-pagination {
          display: flex;
          justify-content: center;
          margin-top: 16px;
          position: relative;
          bottom: 0;
          width: 100%;
        }
        
        .history-pagination-bullet {
          width: 6px;
          height: 2px;
          background: #D1D5DB;
          margin: 0 3px;
          display: inline-block;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .history-pagination-bullet-active {
          background: #000;
          width: 12px;
        }
      `}</style>
    </section>
  )
}


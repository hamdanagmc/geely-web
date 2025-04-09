"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const specifications = [
  {
    title: "ULTIMATE SPACE",
    description:
      "The Preface sets a new standard for roominess with its long, wide body and generous rear legroom, ensuring comfort for every passenger.",
    subTitle: "CLASS-LEADING LENGTH",
    subDescription: "The 4825mm length gives Preface the longest body in its class, offering ample space for comfort.",
    measurement: "4825mm",
    image: "/placeholder.svg?height=600&width=1200&text=Preface+Side+View",
  },
  {
    title: "COMMANDING PRESENCE",
    description: "With its bold stance and elevated ride height, the Preface commands attention on every road.",
    subTitle: "IMPRESSIVE HEIGHT",
    subDescription: "A perfect balance of ground clearance and aerodynamics for optimal performance.",
    measurement: "1500mm",
    image: "/placeholder.svg?height=600&width=1200&text=Preface+Front+View",
  },
  {
    title: "PERFECT PROPORTIONS",
    description: "Expertly crafted dimensions create a harmonious balance between style and functionality.",
    subTitle: "OPTIMAL WIDTH",
    subDescription: "The wide stance provides excellent stability and spacious interior comfort.",
    measurement: "1892mm",
    image: "/placeholder.svg?height=600&width=1200&text=Preface+Rear+View",
  },
  {
    title: "STABLE FOUNDATION",
    description: "A long wheelbase ensures superior stability and generous interior space.",
    subTitle: "EXTENDED WHEELBASE",
    subDescription: "The extended wheelbase provides exceptional ride comfort and handling.",
    measurement: "2800mm",
    image: "/placeholder.svg?height=600&width=1200&text=Preface+Top+View",
  },
]

export default function OwlCarousel() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="relative bg-gradient-to-b from-neutral-800 to-neutral-900 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          onSwiper={setSwiper}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {specifications.map((spec, index) => (
            <SwiperSlide key={index}>
              <div className="py-16 md:py-24">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                  <h2 className="text-[30px] font-bold mb-4">{spec.title}</h2>
                  <p className="text-[18px] text-gray-300 max-w-3xl mx-auto">{spec.description}</p>
                </div>

                {/* Main Image with Measurement */}
                <div className="relative">
                  <div className="relative h-[300px] md:h-[400px] lg:h-[500px] mx-auto">
                    <Image
                      src={spec.image || "/placeholder.svg"}
                      alt="Vehicle specification"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>

                  {/* Measurement Line */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl">
                    <div className="relative h-8">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-white/40"></div>
                      <div className="absolute left-0 top-1/2 h-4 w-px -translate-y-1/2 bg-white"></div>
                      <div className="absolute right-0 top-1/2 h-4 w-px -translate-y-1/2 bg-white"></div>
                    </div>
                    <div className="text-center mt-2 text-xl font-medium">{spec.measurement}</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 md:mt-12">
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-[24px] font-bold mb-3">{spec.subTitle}</h3>
                    <p className="text-[18px] text-gray-300">{spec.subDescription}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4">
          <div className="text-sm">
            {activeIndex + 1} / {specifications.length}
          </div>
          <button
            onClick={() => swiper?.slideNext()}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Next specification"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Custom Pagination */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {specifications.map((_, index) => (
            <button
              key={index}
              onClick={() => swiper?.slideToLoop(index)}
              className={`h-[2px] transition-all duration-300 ${
                activeIndex === index ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}


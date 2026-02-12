"use client";

import { useState } from "react";
import { ServiceHighlight } from "@/sanity.types";
import ImageComp from "../CustomImage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type ServiceHighlightProps = {
  block: ServiceHighlight;
  index: number;
};

export default function ServiceHighlightComp({
  block,
}: ServiceHighlightProps) {
  const [active, setActive] = useState(1);

  return (
    <section className="w-full md:px-[30px]">
      <div className="hidden lg:flex h-[700px] w-full overflow-hidden">
        {block?.items?.map((item, index) => {
          const isActive = active === index;

          return (
            <div
              key={index}
              onMouseEnter={() => setActive(index)}
              className={`
                relative cursor-pointer overflow-hidden
                transition-[flex] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isActive ? "flex-[3]" : "flex-[1]"}
              `}
            >
              {/* Background Image */}
              <div
                className={`
                  absolute inset-0 transition-transform duration-700 ease-out
                  ${isActive ? "scale-105" : "scale-100"}
                `}
              >
                {item.image?.altText && (
                  <ImageComp
                    block={item.image}
                    imageClassName="object-cover w-full h-full"
                    width={820}
                    height={350}
                  />
                )}
              </div>

              {/* Overlay */}
              <div
                className={`absolute inset-0 transition-all duration-700 ${isActive ? "bg-black/20" : "bg-black/50"
                  }`}
              />

              {/* Content */}
              <div className="absolute bottom-10 left-10 text-white max-w-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="iconTop">
                    {item.icon?.altText && (
                      <ImageComp
                        block={item.icon}
                        imageClassName="object-contain"
                        width={20}
                        height={20}
                      />
                    )}
                  </div>
                  <h3 className="tracking-[3px] text-[18px] font-semibold">
                    {item.title}
                  </h3>
                </div>

                <p
                  className={`text-base leading-relaxed text-white/90 transition-all duration-500 ${isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 hidden translate-y-4"
                    }`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lg:hidden py-10 ltr:pl-4 rtl:pr-4">
        <Swiper
          spaceBetween={20}
          slidesPerView={1.1}
          loop={true}
          className="!overflow-visible"
        >
          {block?.items?.map((item, index) => (
            <SwiperSlide key={index}>
              <div className=" overflow-hidden bg-white">
                <div className="relative h-[370px] w-full">
                  {item.image?.altText && (
                    <ImageComp
                      block={item.image}
                      imageClassName="object-cover rounded-[8px] w-full h-full"
                      width={820}
                      height={350}
                    />
                  )}
                </div>

                <div className="py-6">
                  <div className="flex items-center gap-3 mb-3">
                    {item.icon?.altText && (
                      <ImageComp
                        block={item.icon}
                        imageClassName="object-contain"
                        width={20}
                        height={20}
                      />
                    )}
                    <h3 className="tracking-[3px] text-[18px] font-semibold">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
}

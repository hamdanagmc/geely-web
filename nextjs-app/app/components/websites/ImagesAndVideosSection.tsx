"use client";
import type { ImagesAndVideosSection } from "@/sanity.types";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { urlForImage } from "@/sanity/lib/utils";
import MuxVideo from "@mux/mux-video-react";
import { ArrowLeft, ArrowRight, Share2 } from "lucide-react";
import useDeviceDetection from "../../hooks/useDeviceDetection";

const activeSlideStyles = `
  .swiper-slide {
    transition: transform 300ms ease;
    transform: scale(0.85);
  }
  
  .swiper-slide-active {
    transform: scale(1);
    z-index: 1;
  }
  
  .swiper-slide-prev, .swiper-slide-next {
    z-index: 0;
  }
`;

type ImagesAndVideosSectionProps = {
  block: ImagesAndVideosSection & {
    modelGalleryList?: Array<{
      videoListMux?: Array<{
        asset?: {
          playbackId?: string | null;
          assetId?: string | null;
          filename?: string | null;
        } | null;
      }>;
    }>;
  };
  index: number;
};

export default function ImagesAndVideosSectionComp({ block }: ImagesAndVideosSectionProps) {
  const [activeTab, setActiveTab] = useState<"images" | "video">("images");
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [videoSwiper, setVideoSwiper] = useState<SwiperType | null>(null);
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const playersRef = useRef<{ [key: number]: any }>({});
  const { isMobileDevice } = useDeviceDetection();
  console.log("block",block)

  // Get the current model
  const currentModel = block?.modelGalleryList?.[activeModelIndex];

  // Reset active indices when model changes
  useEffect(() => {
    setActiveImageIndex(0);
    setActiveVideoIndex(0);
  }, [activeModelIndex]);

  useEffect(() => {
    if (activeTab === "video" && currentModel?.videoListMux) {
      Object.entries(playersRef.current).forEach(([key, player]) => {
        const index = Number(key); // Cast the key to a number
        if (player && player.pause && player.play) {
          if (index === activeVideoIndex) {
            player.play();
          } else {
            player.pause();
          }
        }
      });
    }
  }, [activeVideoIndex, activeTab, currentModel?.videoListMux]);

  const handleThumbClick = (index: number) => {
    setActiveModelIndex(index);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-12">
      <style jsx global>{activeSlideStyles}</style>

      <h2 className="text-3xl font-bold text-center mb-8">{block.title}</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-sm overflow-hidden">
          <button
            className={`px-10 py-3 text-sm uppercase font-medium transition-colors ${
              activeTab === "images" ? "bg-black text-white" : "bg-white text-black border border-black"
            }`}
            onClick={() => setActiveTab("images")}
          >
            {block.imagesTabLabel || "IMAGES"}
          </button>
          <button
            className={`px-10 py-3 text-sm uppercase font-medium transition-colors ${
              activeTab === "video" ? "bg-black text-white" : "bg-white text-black border border-black"
            }`}
            onClick={() => setActiveTab("video")}
          >
            {block.videosTabLabel || "VIDEO"}
          </button>
        </div>
      </div>

      {/* Thumbnails Swiper */}
      <div className="mb-8 max-w-[780px] imgSwiperTop m-auto relative">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={2}
          slidesPerView={4}
          modules={[Navigation]}
          className="car-thumbs-swiper px-12"
          navigation={{
            nextEl: ".thumb-next",
            prevEl: ".thumb-prev",
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 2,
            },
          }}
        >
          {block?.modelGalleryList?.map((model, index) => (
            <SwiperSlide key={model._key} onClick={() => handleThumbClick(index)}>
              <div
                className={`cursor-pointer transition-all duration-300 ${
                  activeModelIndex === index ? "border-2 border-black" : "border border-gray-200"
                }`}
              >
                <div className="relative">
                  {activeModelIndex === index && (
                    <div className="absolute top-0 rounded-full right-0 w-6 h-6 bg-black flex items-center justify-center z-10 -translate-y-1/2 translate-x-1/2">
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4.00016 6.58597L10.2931 0.292969L11.7073 1.70718L4.00016 9.41418L0.292969 5.70697L1.70718 4.29276L4.00016 6.58597Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="imgSwiperTop-inner">
                    {model?.imageList?.[0]?.asset && (
                      <Image
                        src={urlForImage(model.imageList[0])?.url() || "/placeholder.svg?height=120&width=200"}
                        alt={model.imageList[0]?.altText || ""}
                        width={130}
                        height={65}
                        className="w-full h-auto object-contain mb-3"
                      />
                    )}
                    <h3 className="text-center font-medium text-sm uppercase">{model.name || ""}</h3>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="thumb-prev absolute left-[-20px] top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button className="thumb-next absolute right-[-20px] top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center">
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative">
        {activeTab === "images" && (
          <div className="relative overflow-hidden">
            {/* Main Image */}
            <div className="relative md:h-[600px] pb-14 max-w-[1300px] mx-auto z-10 overflow-visible">
              {currentModel?.imageList && currentModel.imageList.length > 0 ? (
                <Swiper
                  onSwiper={setMainSwiper}
                  spaceBetween={20}
                  slidesPerView={1.3}
                  centeredSlides={true}
                  modules={[Navigation, Pagination, EffectCoverflow]}
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination-images",
                    bulletClass: "inline-block w-3 h-3 bg-gray-300 mx-1",
                    bulletActiveClass: "bg-black",
                  }}
                  navigation={{
                    nextEl: ".main-next-images",
                    prevEl: ".main-prev-images",
                  }}
                  onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                  className="h-full"
                  loop={true}
                  slideToClickedSlide={true}
                  effect="coverflow"
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 1.5,
                    slideShadows: false,
                  }}
                >
                  {currentModel.imageList.map((image, idx) => (
                    <SwiperSlide key={image._key}>
                      <div className="relative md:h-[540px] aspect-[16/9] bg-white rounded-md overflow-hidden transform transition-all duration-300">
                        <Image
                          src={urlForImage(image)?.url() || "/placeholder.svg?height=600&width=1200"}
                          alt={image.altText || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="md:h-[540px] aspect-[16/9] bg-gray-100 flex items-center justify-center">
                  <p>No images available</p>
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {!isMobileDevice && (
              <div>
                <button className="main-prev-images absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <button className="main-next-images absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-white" />
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className="swiper-pagination-images absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 justify-center"></div>
          </div>
        )}

        {activeTab === "video" && (
          <div className="relative overflow-hidden">
            {/* Main Video Swiper */}
            <div className="relative md:h-[600px] pb-14 max-w-[1300px] mx-auto z-10 overflow-visible">
              {currentModel?.videoListMux && currentModel.videoListMux.length > 0 ? (
                <Swiper
                  onSwiper={setVideoSwiper}
                  spaceBetween={20}
                  slidesPerView={1.3}
                  centeredSlides={true}
                  modules={[Navigation, Pagination, EffectCoverflow]}
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination-videos",
                    bulletClass: "inline-block w-3 h-3 bg-gray-300 mx-1",
                    bulletActiveClass: "bg-black",
                  }}
                  navigation={{
                    nextEl: ".main-next-videos",
                    prevEl: ".main-prev-videos",
                  }}
                  onSlideChange={(swiper) => {
                    setActiveVideoIndex(swiper.realIndex); // Update the active video index using realIndex
                    // Pause all videos except the active one
                    Object.entries(playersRef.current).forEach(([key, player]) => {
                      const index = Number(key); // Cast the key to a number
                      if (player && player.pause && player.play) {
                        if (index === swiper.realIndex) {
                          player.play();
                        } else {
                          player.pause();
                        }
                      }
                    });
                  }}
                  className="h-full"
                  loop={true}
                  slideToClickedSlide={true}
                  effect="coverflow"
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 1.5,
                    slideShadows: false,
                  }}
                >
                  {currentModel.videoListMux.map((videoItem, idx) => {
                    const playbackId = (videoItem as any)?.asset?.playbackId;

                    return (
                      <SwiperSlide key={`video-${idx}`}>
                        <div className="relative md:h-[540px] aspect-[16/9] bg-black rounded-md overflow-hidden transform transition-all duration-300">
                          {playbackId ? (
                            <MuxVideo
                              playbackId={playbackId}
                              autoPlay={idx === activeVideoIndex}
                              loop
                              muted
                              controls={false}
                              className="w-full h-[100%] static inset-0 object-cover"
                              onError={(error) => {
                                console.error("Mux Video Player Error:", error);
                                setVideoError(true);
                              }}
                              ref={(player) => {
                                if (player) {
                                  playersRef.current[idx] = player;
                                } else {
                                  delete playersRef.current[idx];
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-[75%] bg-gray-900 flex items-center justify-center">
                              <p className="text-gray-500">Video not available</p>
                            </div>
                          )}
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              ) : (
                <div className="md:h-[540px] aspect-[16/9] bg-gray-100 flex items-center justify-center">
                  <p>No videos available</p>
                </div>
              )}

              {/* Share Button */}
              <button className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center z-20">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Arrows */}
            {!isMobileDevice && (
              <div>
                <button className="main-prev-videos absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <button className="main-next-videos absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-white" />
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className="swiper-pagination-videos absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 justify-center"></div>
          </div>
        )}
      </div>
    </div>
  );
}
"use client"
import type { HeroBannerComponent } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils"
import { urlForPDF } from "@/sanity/lib/utils"
import Image from "next/image"
import Link from "next/link"
import Vimeo from "@u-wave/react-vimeo"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { useState } from "react"
import { useTestDrive } from "../../context/TestDriveContext";
import { useRouter } from "next/navigation"

type HeroBannerComponentProps = {
  block: HeroBannerComponent & {
    videoId?: string
  }
  index: number
}

export default function HeroBannerComp({ block }: HeroBannerComponentProps) {
  const { currentLocale } = useDeviceDetection()
  const [videoError, setVideoError] = useState(false)
  const { setTestDrive } = useTestDrive();
  const router = useRouter();
  
  // Check if videoId exists
  if (!block?.videoId && !videoError) {
    console.warn("No videoId found for video block:", block)
    setVideoError(true)
  }

  const handleTestDriveSelection = (testDriveIdOrName: string) => {
    setTestDrive(testDriveIdOrName);
    router.push(`/${currentLocale}/request-test-drive`);
  };

  return (
    <section className={`relative w-full heroBannerComp min-h-[928px] bg-[#BFBFCB] overflow-hidden`}>
      {/* Layer 1: Bottom Rectangle */}
      <div className="absolute inset-x-0 bottom-0 h-[40%] bg-[#BFBFCB] z-[11] opacity-99" />

      {/* Video Layer */}
      {block?.videoId && !videoError && (
        <Vimeo
          video={block.videoId}
          autoplay
          loop
          muted
          controls={false}
          responsive
          background={true}
          dnt={true}
          className="w-full h-[75%] static inset-0 object-cover"
          onError={(error) => {
            console.error("Vimeo Player Error:", error)
            setVideoError(true)
          }}
        />
      )}

      {/* Layer 2: Car Image */}
      <div
        className="absolute heroBannerImg inset-0 z-[12] flex items-center justify-center"
        style={{ transform: "translateY(8.5%)" }}
      >
        <div className="relative heroBannerImgCntr w-full max-w-[1220px] h-[430px]">
          {block.desktopImage?.asset && (
            <Image
              src={urlForImage(block.desktopImage)?.url() || ""}
              alt={block.title || ""}
              fill
              priority
              className="object-cover"
            />
          )}
        </div>
      </div>

      {/* Layer 3: Content */}
      <div className="absolute heroBannerCnt inset-x-0 bottom-0 h-[30%] flex z-[12] items-end pb-[50px]">
        <div className="w-full pl-[60px] pr-[60px] mx-auto flex items-end justify-between">
          {/* Left side content */}
          <div className="flex heroBannerContent flex-col items-start">
            <div className="relative heroBannerLft w-[640px] h-[60px] mb-5">
              {block.titleLogo?.asset && (
                <Image
                  src={urlForImage(block.titleLogo)?.url() || ""}
                  alt={block.title || ""}
                  fill
                  priority
                  className="object-contain object-left"
                />
              )}
            </div>
            <p className="text-[26px] leading-[34px] text-black">{block.subtitle || "Perfected Presence"}</p>
          </div>

          {/* Right side buttons */}
          <div className="flex heroBannerBtn gap-5 flex-row">
            {block.testDriveLink && (
              <button
              onClick={() => handleTestDriveSelection((block?.link as unknown as { title?: string })?.title || "")}
                className="px-6 py-3 text-[17px] font-medium leading-5 bg-transparent hover:bg-[#194bff] hover:text-[#fff] hover:border-[#194bff] text-black border border-black rounded-[3px]"
              >
                {block?.testDriveTitle}
              </button>
            )}
            {block.brochurePageLink && (
                <Link
                href={`/${currentLocale}/${(block?.brochurePageLink as any)?.slug?.replace(/^ar\//, "") || ""}`}
                className="px-[18px] py-3 text-[17px] font-medium leading-5 bg-black hover:bg-[#194bff] text-white rounded-[3px]"
                >
                {block?.brochureTitle}
                </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}


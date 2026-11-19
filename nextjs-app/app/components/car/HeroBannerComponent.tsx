"use client"
import type { HeroBannerComponent } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils"
import { urlForPDF } from "@/sanity/lib/utils"
import Image from "next/image"
import Link from "next/link"
import MuxVideo from "@mux/mux-video-react"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { useState } from "react"
import { useTestDrive } from "../../context/TestDriveContext";
import { useRouter } from "next/navigation"

type HeroBannerComponentProps = {
  block: HeroBannerComponent & {
    videoId?: string
    video?: {
      asset?: {
        playbackId?: string | null
        assetId?: string | null
        filename?: string | null
      } | null
    } | null
  }
  index: number
}

export default function HeroBannerComp({ block }: HeroBannerComponentProps) {
  const { currentLocale } = useDeviceDetection()
  const [videoError, setVideoError] = useState(false)
  const { setTestDrive } = useTestDrive();
  const router = useRouter();
  const playbackId = block?.video?.asset?.playbackId;

  // Check if playbackId exists
  if (!playbackId && !videoError) {
    console.warn("No playbackId found for video block:", block)
    setVideoError(true)
  }

  const handleTestDriveSelection = (testDriveIdOrName: string) => {
    setTestDrive(testDriveIdOrName);
    router.push(`/${currentLocale}/request-test-drive`);
  };

  return (
    <section data-we-section="model_hero" className={`relative w-full heroBannerComp md:min-h-[840px] md:h-[100vh] bg-[#BFBFCB] overflow-hidden`}>
      {/* Layer 1: Bottom Rectangle */}
      <div className="absolute heroImgCmpLayer inset-x-0 bottom-0 h-[40%] bg-[#BFBFCB] z-[11] opacity-99" />
     
      {/* Video Layer */}
      {playbackId && !block?.fullWidth && (
        <MuxVideo
          playbackId={playbackId}
          autoPlay="muted"
          loop
          muted
          preferPlayback="mse"
          playsInline
          controls={false}
          className="w-full h-[75%] static inset-0 object-cover"
        />
      )}

      {/* Layer 2: Car Image */}
      <div
        className={`${block?.fullWidth ? 'items-start' : 'items-center'} absolute heroBannerImg inset-0 z-[12] flex justify-center`}
      >
        <div className={`${block?.fullWidth ? 'md:min-h-[75vh] min-h-[55vw] fullWidthImage md:mb-0 mb-10' : 'max-w-[1220px] heroBannerImgCntr h-[430px]'} relative w-full`}>
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
            {block?.subtitle && <p className="text-[26px] leading-[34px] text-black">{block.subtitle}</p> }
          </div>

          {/* Right side buttons */}
          <div className="flex heroBannerBtn gap-5 flex-row">
            {block.testDriveLink && (
              <button
              data-we-cta="test_drive"
              onClick={() => handleTestDriveSelection((block?.link as unknown as { title?: string })?.title || "")}
                className="px-6 py-3 text-[17px] font-medium leading-5 bg-transparent hover:bg-[#194bff] hover:text-[#fff] hover:border-[#194bff] text-black border border-black rounded-[3px]"
              >
                {block?.testDriveTitle}
              </button>
            )}
            {block.brochurePageLink && (
                <Link
                data-we-cta="brochure"
                href={`/${currentLocale}/${(block?.brochurePageLink as any)?.slug?.replace(/^ar\//, "") || ""}`}
                className="px-[18px] py-3 text-[17px] font-medium leading-5 bg-black hover:bg-[#194bff] text-white rounded-[3px]"
                >
                {block?.brochureTitle}
                </Link>
            )}

             {block?.preBook && block?.preBook?.preBookButtonLink && (
                <Link
                data-we-cta="pre_book"
                onClick={() => setTestDrive(block?.brandTitle || "")}
                href={`/${currentLocale}/${(block?.preBook?.preBookButtonLink as any)?.slug?.replace(/^ar\//, "") || ""}`}
                className="px-6 py-3 text-[17px] font-medium leading-5 bg-transparent hover:bg-[#194bff] hover:text-[#fff] hover:border-[#194bff] text-black border border-black rounded-[3px]"
                >
                {block?.preBook?.preBookButton}
                </Link>
            )}

          </div>
        </div>
      </div>

    </section>
  )
}


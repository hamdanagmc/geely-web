"use client"
import useDeviceDetection from "@/app/hooks/useDeviceDetection"
import type { PreBookHeroBannerComponent } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils"
import Image from "next/image"
import Link from "next/link"

type PreBookHeroBannerComponentProps = {
  block: Omit<PreBookHeroBannerComponent, 'link'> & {
    ButtonText?: string;
    ButtonText2?: string;
    link?: { slug?: string; _type?: string };
  }
}

export default function PreBookHeroBannerComponent({ block }: PreBookHeroBannerComponentProps) {
  const { isMobileDevice, currentLocale } = useDeviceDetection()

  const handleScrollToPreBook = () => {
    const preBookSection = document.getElementById("preBookNow")
    if (preBookSection) {
      preBookSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const getLinkHref = () => {
    if (!block.link?.slug) return "#"
    const slug = block.link.slug.replace(/^ar\//, "")
    if (block.link._type === "car") {
      return `/${currentLocale}/car/${slug}`
    }
    return `/${currentLocale}/${slug}`
  }

  return (
    <section className={`relative w-full heroBannerComp preBookHeroBannerMain min-h-[760px] h-[100vh] bg-[#BFBFCB] overflow-hidden`}>
      {/* Layer 1: Bottom Rectangle */}
      <div className="absolute heroImgCmpLayer inset-x-0 bottom-0 h-[40%] bg-[#BFBFCB] z-[11] opacity-99" />

      {/* Layer 2: Car Image */}
      <div
        className="absolute heroBannerImg inset-0 z-[12] flex items-center justify-center"
      >
        <div className="relative preBookHeroBanner heroBannerImgCntr w-full h-full">
          {block.desktopImage?.asset && block?.mobileImage && (
            <Image
              src={isMobileDevice ? urlForImage(block.mobileImage)?.url() || '' : urlForImage(block.desktopImage)?.url() || ''}
              alt={'banner image'}
              fill
              priority
              className="object-cover"
            />
          )}
        </div>
      </div>

      {/* Layer 3: Content */}
      <div className="absolute inset-0 z-[13] flex flex-col items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center text-center mt-[20vh] pointer-events-auto">
          {block.titleLogo?.asset && (
            <div className="relative w-[400px] h-[60px] mb-5">
              <Image
                src={urlForImage(block.titleLogo)?.url() || ""}
                alt={"logo"}
                fill
                priority
                className="object-contain object-center"
              />
            </div>
          )}
        </div>

        {/* CTAs at the bottom */}
        <div className="absolute bottom-[60px] flex flex-col md:flex-row gap-4 justify-center items-center pointer-events-auto w-full px-6">
          {block.ButtonText && (
            <button
              onClick={handleScrollToPreBook}
              className="w-full md:w-auto px-6 md:px-[55px] py-[13px] text-[17px] font-medium leading-[1] bg-white text-black border border-white hover:bg-transparent hover:text-white transition-colors duration-300 rounded-[2px]"
            >
              {block.ButtonText}
            </button>
          )}

          {block.ButtonText2 && block.link?.slug && (
            <Link
              href={getLinkHref()}
              className="w-full md:w-auto px-6 md:px-[55px] py-[13px] text-[17px] font-medium leading-[1] bg-transparent text-white border border-white hover:bg-white hover:text-black transition-colors duration-300 rounded-[2px] text-center"
            >
              {block.ButtonText2}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}


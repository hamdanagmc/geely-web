"use client"
import type { CarModelComponent } from "@/sanity.types"
import Image from "next/image"
import { urlForImage } from "@/sanity/lib/utils"
import Link from "next/link"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import { usePathname } from "next/navigation"
import type { PortableTextBlock } from "next-sanity"
import PortableText from "@/app/components/PortableText"
import { useTestDrive } from "../../context/TestDriveContext"
import { useRouter } from "next/navigation"

type CarModelComponentProps = {
  block: CarModelComponent
  index: number
}

export default function CarModelComp({ block }: CarModelComponentProps) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out",
      once: false,
      mirror: true,
      anchorPlacement: "center-bottom",
    })
  }, [])

  const pathname = usePathname()
  const pathSegments = pathname.split("/")
  const currentLocale = pathSegments[1] || "en"
  const { setTestDrive } = useTestDrive()
  const router = useRouter()

  const getLinkHref = (link: any) => {
    if (link?.linkType === "href") {
      console.log("sfdsf");
      return link.href ?? "#";
    } else if (link?.linkType === "path") {
      return link.path ?? "#";
    } else if (link?.linkType === "car") {
      return `/${currentLocale}/car/${link.car.slug}`;
    } else if (link?.page?.slug) {
      let slug = link.page.slug;
      // Remove locale prefix if it exists (e.g., "ar/pagelink" -> "pagelink")
      if (slug.startsWith(`${currentLocale}/`)) {
        slug = slug.replace(`${currentLocale}/`, "");
      }
      return `/${currentLocale}/${slug}`;
    } else {
      return "#";
    }
  };

  const handleTestDriveSelection = (testDriveIdOrName: string, type: string) => {
    setTestDrive(testDriveIdOrName)
    if (type === "getQuote") router.push(`/${currentLocale}/request-a-quote`)
    else router.push(`/${currentLocale}/request-test-drive`)
  }

  return (
    <div className="w-full overflow-x-hidden pt-24 carItemlist">
      <h1 className="text-center text-[36px] pb-10 pt-6 leading-tight font-bold">{block?.mainTitle}</h1>
      {block?.carModels?.map((vehicle, index) => {
        const isEven = index % 2 === 0
        return (
          <div
            key={vehicle?._key}
            className={`md:flex w-full carItem h-auto lg:h-[680px] ${isEven ? "" : "md:flex-row-reverse flex-col-reverse"}`}
          >
            {/* Hero Image Section */}
            <div className={`w-full lg:w-[62%] carLeftImg h-64 md:h-full relative overflow-hidden`}>
              {vehicle.image && (
                <Image
                  src={urlForImage(vehicle.image)?.url() || ""}
                  alt={vehicle.title || ""}
                  fill
                  className="object-center object-cover"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 62vw"
                  priority={index === 0}
                />
              )}
            </div>

            {/* Content Section */}
            <div
              className={`w-full lg:w-[38%] carRightTxt flex items-center justify-center relative`}
              style={{
                backgroundColor: vehicle.cardBackgroundColor?.hex || "transparent",
              }}
            >
              {/* Background Image using Next.js Image */}
              {vehicle.cardBackgroundImage && (
                <div className="absolute inset-0 z-0">
                  <Image
                    src={urlForImage(vehicle.cardBackgroundImage)?.url() || ""}
                    alt=""
                    fill
                    className="object-cover"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 38vw"
                    priority={index === 0}
                  />
                </div>
              )}

              <div
                className="flex flex-col carRightTxt-inn justify-between py-16 w-full px-[60px] relative z-10"
                data-aos={isEven ? "fade-left" : "fade-right"}
              >
                {/* Header */}
                <div>
                  <div className="flex items-start gap-[10px] mb-5">
                    <div className="relative max-w-[160px] w-full h-[27px]">
                      {vehicle.carTitleLogo && (
                        <Image
                          src={urlForImage(vehicle.carTitleLogo)?.url() || ""}
                          alt={vehicle.title || ""}
                          fill
                          className="object-contain object-left"
                          quality={90}
                        />
                      )}
                    </div>
                    <p className="md:text-xl text-[15px]">{vehicle.subtitle}</p>
                  </div>

                  {/* Separator */}
                  <div className="w-full h-px bg-black my-5" />

                  {/* Specs */}
                  <div className="flex justify-center items-center mb-6 relative">
                    {vehicle.spec1 && (
                      <div className="flex justify-center items-center">
                        <div className="font-normal text-[1rem] lg:text-[20px]">{vehicle.spec1}</div>
                        <div className="h-6 w-px bg-black mx-[34px]"></div>
                      </div>
                    )}
                    {vehicle.spec2 && (
                      <div className="flex justify-center items-center">
                        <div className="font-normal text-[1rem] lg:text-[20px]">{vehicle.spec2}</div>
                        <div className="h-6 w-px bg-black mx-[34px]"></div>
                      </div>
                    )}
                    {vehicle.spec3 && (
                      <div className="flex justify-center items-center">
                        <div className="font-normal text-[1rem] lg:text-[20px]">{vehicle.spec3}</div>
                      </div>
                    )}
                  </div>

                  {/* Separator */}
                  <div className="w-full h-px bg-black my-5" />
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6 mt-2">
                  {vehicle.specDetails?.map((feature, index) => (
                    <div key={feature._key} className="flex justify-start items-start mt-[5px]">
                      <div className="relative w-[26px] h-[26px] ltr:mr-[15px] rtl:ml-[15px] mb-[4px] flex-shrink-0">
                        {feature.icon && (
                          <Image
                            src={urlForImage(feature.icon)?.url() || ""}
                            alt={feature.description || "Feature Icon"}
                            fill
                            quality={90}
                          />
                        )}
                      </div>
                      {feature?.richText?.content && (
                        <PortableText
                          className="md:text-[18px] md:leading-[26px] text-[15px] leading-[23px]"
                          value={feature.richText.content as PortableTextBlock[]}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-[21px]">
                   {(vehicle.exploreLink?.externalLink?.href || vehicle.exploreLink?.externalLink?.car || vehicle.exploreLink?.externalLink?.page) && (
                    <Link
                      href={getLinkHref(vehicle.exploreLink?.externalLink)}
                      target={vehicle.exploreLink.externalLink?.href ? "_blank" : undefined}
                      className="w-full h-12 border border-black bg-transparent hover:bg-[#194BFF] hover:text-white hover:border-[#194BFF] rounded-[3px] font-medium transition-colors flex items-center justify-center"
                    >
                      {vehicle.exploreLink.text || "Explore"}
                    </Link>
                  )}
                  {vehicle.getQuoteLink && (
                    <button
                      onClick={() =>
                        handleTestDriveSelection(
                          (vehicle?.exploreLink?.link as unknown as { title?: string })?.title || "",
                          "getQuote",
                        )
                      }
                      className="w-full h-12 getQuote border border-black bg-transparent hover:bg-[#194BFF] hover:text-white hover:border-[#194BFF] rounded-[3px] font-medium transition-colors flex items-center justify-center"
                    >
                      {vehicle.getQuoteLink.text || "Get Quote"}
                    </button>
                  )}
                  {vehicle.testDriveLink && (
                    <button
                      onClick={() =>
                        handleTestDriveSelection(
                          (vehicle.exploreLink?.link as unknown as { title?: string })?.title || "",
                          "testDrive",
                        )
                      }
                      className="w-full h-12 test bg-black hover:bg-[#194BFF] rounded-[3px] font-semibold text-white transition-colors flex items-center justify-center"
                    >
                      {vehicle.testDriveLink.text || "Test Drive"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

"use client"

import { useState, useMemo, useEffect } from "react"
import { Check } from "lucide-react"
import NextImage from "next/image"
import type { Car360, ExteriorImage } from "../../types/car360"
import dynamic from "next/dynamic"
import { CustomImageTurntable } from "./CustomImageTurntable"
import { firstThisPageView, modelFromPath, setWebEngageAttributes, slugify, trackWebEngage } from "@/app/lib/webengage"

type Car360Props = {
  block: Car360
  index: number
}

const DynamicPanoramaViewer = dynamic(() => import("@/app/components/websites/PanoramaViewer"), {
  ssr: false,
})

export default function Car360Comp({ block }: Car360Props) {
  const [activeTab, setActiveTab] = useState<"exterior" | "interior">("exterior")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [previousColor, setPreviousColor] = useState<string>("")
  const [isColorTransitioning, setIsColorTransitioning] = useState(false)
  const [colorTransitionProgress, setColorTransitionProgress] = useState(1) // 0 to 1
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const bgColor = "#EAE9E8" // Define background color once to ensure consistency

  // Model 360 Interacted: "rotated" once per view per page view.
  const track360 = (interaction: "opened" | "rotated" | "view_switched", view_type: "exterior" | "interior") => {
    if (interaction === "rotated" && !firstThisPageView(`360_rotated:${view_type}`)) return
    trackWebEngage("Model 360 Interacted", { model_id: modelFromPath(location.pathname), view_type, interaction })
  }

  // Colour Selected; also keeps last_colour_interest for creatives in that colour.
  const trackColour = (colour_name: string) => {
    const colour_id = slugify(colour_name)
    trackWebEngage("Colour Selected", { model_id: modelFromPath(location.pathname), colour_type: "exterior", colour_id, colour_name })
    setWebEngageAttributes({ last_colour_interest: colour_id })
  }

  const colorOptions = useMemo(() => {
    return (
      block.selectedCar?.exteriorImages?.map((exterior: ExteriorImage) => ({
        id: exterior.color.name,
        color: `${exterior.color.hexCode}`,
        images: exterior.images360.map((img) => img.asset.url),
      })) || []
    )
  }, [block.selectedCar?.exteriorImages])

  // Get the first interior image URL or use fallback
  const interiorImageUrl = useMemo(() => {
    if (
      block.selectedCar?.interiorImages &&
      block.selectedCar.interiorImages.length > 0 &&
      block.selectedCar.interiorImages[0]?.asset?.url
    ) {
      return block.selectedCar.interiorImages[0].asset.url
    }
    return "/images/panorama.webp" // Fallback image
  }, [block.selectedCar?.interiorImages])

  useEffect(() => {
    if (colorOptions.length > 0 && !selectedColor) {
      setSelectedColor(colorOptions[0].id)
    }
  }, [colorOptions, selectedColor])

  const currentImages = useMemo(() => {
    return colorOptions.find((option) => option.id === selectedColor)?.images || []
  }, [selectedColor, colorOptions])

  const previousImages = useMemo(() => {
    return colorOptions.find((option) => option.id === previousColor)?.images || []
  }, [previousColor, colorOptions])

  // Handle color change with smooth transition
  useEffect(() => {
    if (!selectedColor || selectedColor === previousColor) return

    // Start transition
    if (previousColor) {
      setIsColorTransitioning(true)
      setColorTransitionProgress(0)

      // Animate transition
      const startTime = performance.now()
      const duration = 500 // 500ms transition

      const animateTransition = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        setColorTransitionProgress(progress)

        if (progress < 1) {
          requestAnimationFrame(animateTransition)
        } else {
          setIsColorTransitioning(false)
          setPreviousColor(selectedColor)
        }
      }

      requestAnimationFrame(animateTransition)
    } else {
      // First time setting color, no transition needed
      setPreviousColor(selectedColor)
    }
  }, [selectedColor, previousColor])

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error.message)
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  // For the hidden grid section
  const structuredSpecs = useMemo(() => {
    if (Array.isArray(block?.specList)) {
      return block.specList.map((spec) => ({
        value: spec.value || "",
        unit: spec.unit || "",
      }))
    }
    return []
  }, [block?.specList])

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!block.selectedCar) {
    return <div className="text-center">No car data available</div>
  }

  return (
    <>
      {/* Modal for Panorama Viewer */}
      {isOpen && activeTab === "interior" && (
        <div className="fixed inset-0 panoramaViewer flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative panoramaViewerPopup max-h-[calc(screen-60px)] max-w-[80%] bg-white rounded-lg shadow-lg w-full p-6" onPointerDownCapture={(e) => !(e.target as Element).closest("button") && track360("rotated", "interior")}>
            {/* Close Button */}
            <button
              onClick={() => {
                setIsOpen(false)
                setActiveTab("exterior")
              }}
              className="absolute top-[5px] z-[11] ltr:right-[5px] rtl:left-[5px] text-gray-600 hover:text-gray-900"
            >
              <NextImage src="/images/close-btn.svg" alt="Close" width={24} height={24} />
            </button>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold",
                zIndex: 8,
              }}
            >
              Loading...
            </div>

            {/* Panorama Viewer */}
            <DynamicPanoramaViewer imageUrl={interiorImageUrl} />
          </div>
        </div>
      )}
      <div
        id={`${block?.htmlId}`}
        className={`${activeTab === "exterior" ? "pb-10 pt-[60px] px-4" : ""} w-full relative min-h-[850px] car360Comp`}
        style={{ backgroundColor: bgColor }}
      >
        {/* Header */}
        {activeTab === "exterior" && (
          <div className="max-w-5xl mx-auto text-center mb-5 relative">
            <h1 className="text-5xl font-bold mb-4">{block.heading}</h1>
            <p className="text-gray-700 text-lg car360CompDes">
              {block?.subHeading ||
                `View the ${block.selectedCar.name}'s bold and refined ${activeTab}
                , highlighting its sleek lines and striking design features.`}
            </p>
          </div>
        )}
        {/* Tabs */}
        {activeTab === "exterior" && (
          <div className="flex justify-center items-start space-x-4 rtl:space-x-reverse mb-12 relative">
            <button
              onClick={() => setActiveTab("exterior")}
              className={`text-[22px] leading-8 font-medium px-4 py-1 ${
                activeTab === "exterior" ? "text-black border-black" : "text-gray-400"
              }`}
            >
              {block?.exteriorLabel || "Exterior"}
            </button>
            {interiorImageUrl != '/images/panorama.webp' && (
              <>
            <span className="text-black mt-[6px] h-[18px] text-xl">|</span>
            <button
              onClick={() => {
                setActiveTab("interior")
                setIsOpen(true)
                track360("opened", "interior")
              }}
              className={`text-[22px] leading-8 font-medium px-4 py-1 text-gray-400`}
            >
              {block?.interiorLabel || "Interior"}
            </button>
            </>
            )}
          </div>
        )}

        {/* Color selector */}
        {colorOptions.length > 0 && activeTab === "exterior" && (
          <div className="absolute colorBox ltr:left-[60px] rtl:right-[60px] bottom-[42%] flex flex-col space-y-3 z-10">
            {colorOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedColor(option.id)
                  if (option.id !== selectedColor) trackColour(option.id)
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                  selectedColor === option.id ? "border-teal-600" : "border-gray-200"
                }`}
                aria-label={`Select ${option.id} color`}
                style={{ background: `${option.color}` }}
                disabled={isColorTransitioning}
              >
                {selectedColor === option.id && <Check className="text-white" size={18} />}
              </button>
            ))}
          </div>
        )}

        {/* Car Display Section */}
        <div className={`relative ${activeTab === "exterior" ? "max-w-6xl mb-8" : "w-full"} mx-auto`}>
          {activeTab === "exterior" && (
            <>
              {/* Car image turntable */}
              <div className="flex justify-center pt-[34px] relative" onPointerDownCapture={() => track360("rotated", "exterior")}>
                {/* Current color images */}
                <div
                  className="mix-blend-multiply"
                  style={{
                    opacity: isColorTransitioning ? colorTransitionProgress : 1,
                  }}
                >
                  {currentImages.length > 0 ? (
                    <CustomImageTurntable
                      images={currentImages}
                      width={810}
                      height={300}
                      dragSensitivity={1.5}
                    />
                  ) : (
                    <div style={{ width: "810px", height: "300px", backgroundColor: bgColor }}>
                      No images available for this color
                    </div>
                  )}
                </div>

                {/* Previous color images - shown during transition */}
                {isColorTransitioning && previousImages.length > 0 && (
                  <div
                    className="mix-blend-multiply absolute top-[34px]"
                    style={{
                      opacity: 1 - colorTransitionProgress,
                    }}
                  >
                    <CustomImageTurntable
                      images={previousImages}
                      width={810}
                      height={300}
                      dragSensitivity={1.5}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {activeTab === "exterior" && (
          <div className="spec_360_container relative">
            <div className="spec-whell-number">
              <p>
                {block?.specificationTitle} <span>{block?.specificationSubTitle}</span>
              </p>
            </div>
            <div className="spec_360_block">
              <ul className="spec_360_list">
                {Array.isArray(block?.specList) &&
                  block?.specList.map((spec, index) => (
                    <li key={index}>
                      <span>
                        {spec.label || ""}&nbsp;
                        <span className="unit">{spec.unit || ""}</span>
                      </span>{" "}
                      <strong>{spec.value || ""}</strong>
                      <div className="divider"></div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

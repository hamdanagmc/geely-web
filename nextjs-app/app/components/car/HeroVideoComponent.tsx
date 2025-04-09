"use client"
import type { HeroVideoComponent } from "@/sanity.types"
import { useRef, useState } from "react"
import Vimeo from "@u-wave/react-vimeo"

type HeroVideoComponentProps = {
  block: HeroVideoComponent
  index: number
}

export default function HeroVideoVimeo({ block }: HeroVideoComponentProps) {
  const videoId = block?.videoId

  const playerRef = useRef<any>(null)
  const [isMuted, setIsMuted] = useState(true) 
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (!videoId) {
    console.warn("No Vimeo ID found for video block:", block)
    return (
      <div className="w-full bg-gray-200 flex items-center justify-center p-10 rounded-lg">
        <p className="text-gray-600">Video not available</p>
      </div>
    )
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const onReady = () => {
    setIsReady(true)
  }

  return (
    <div className="relative">
      <Vimeo
        video={videoId}
        autoplay
        loop={block?.loop ?? true}
        muted={isMuted}
        controls={false}
        responsive
        onReady={onReady}
        className="w-full mx-auto rounded-lg shadow-lg"
        onError={(error) => {
          console.error("Vimeo Player Error:", error)
          setHasError(true)
        }}
        background={true}
        dnt={true}
      />
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-600">Error loading video</p>
        </div>
      )}
      {isReady && !hasError && (
        <button
          onClick={toggleMute}
          className="absolute top-[20px] font-bold hover:bg-[#00adef] left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg z-10"
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      )}
    </div>
  )
}


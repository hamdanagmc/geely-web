"use client"
import type { HeroVideoComponent } from "@/sanity.types"
import { useRef, useState } from "react"
import MuxVideo from "@mux/mux-video-react"

type HeroVideoComponentProps = {
  block: HeroVideoComponent & {
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

export default function HeroVideoMux({ block }: HeroVideoComponentProps) {
  const playbackId = block?.video?.asset?.playbackId

  const playerRef = useRef<any>(null)
  const [isMuted, setIsMuted] = useState(true) 
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (!playbackId) {
    console.warn("No Mux playback ID found for video block:", block)
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
      <MuxVideo
        playbackId={playbackId}
        autoPlay
        loop={block?.loop ?? true}
        muted={isMuted}
        controls={false}
        onCanPlay={onReady}
        className="w-full mx-auto rounded-lg shadow-lg"
        onError={(error) => {
          console.error("Mux Video Player Error:", error)
          setHasError(true)
        }}
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


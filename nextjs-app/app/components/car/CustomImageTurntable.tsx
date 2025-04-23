"use client"

import React, { useRef, useEffect, useState } from "react"
import Image from "next/image"

interface CustomImageTurntableProps {
  images: string[]
  width: number
  height: number
  dragSensitivity?: number
  backgroundColor?: string
}

export function CustomImageTurntable({
  images,
  width,
  height,
  dragSensitivity = 1.5,
  backgroundColor = "#EAE9E8",
}: CustomImageTurntableProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({})
  const [allImagesLoaded, setAllImagesLoaded] = useState(false)

  // Preload images
  useEffect(() => {
    if (images.length === 0 || typeof window === "undefined") return

    const preloadImages = async () => {
      const loadedImages: Record<number, boolean> = {}

      await Promise.all(
        images.map((src, index) => {
          return new Promise<void>((resolve) => {
            // Create a new Image element for preloading
            const img = new window.Image()
            // Use the Next.js image loader URL format to ensure Vercel caching
            const nextImageUrl = `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=90`
            img.src = nextImageUrl
            img.onload = () => {
              loadedImages[index] = true
              setImagesLoaded((prev) => ({ ...prev, [index]: true }))
              resolve()
            }
            img.onerror = () => {
              resolve()
            }
          })
        }),
      )

      setAllImagesLoaded(true)
    }

    preloadImages()
  }, [images])

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || images.length === 0) return

    const deltaX = e.clientX - startX
    const sensitivity = dragSensitivity * 10 // Adjust sensitivity

    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? -1 : 1
      const totalImages = images.length

      setCurrentIndex((prev) => {
        const newIndex = (prev + direction + totalImages) % totalImages
        return newIndex
      })

      setStartX(e.clientX)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)

    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId)
    }
  }

  // Calculate which images should be preloaded
  const visibleIndices = React.useMemo(() => {
    if (images.length === 0) return []

    const totalImages = images.length
    const indices = [currentIndex]

    // Add adjacent images for smoother transitions
    indices.push((currentIndex - 1 + totalImages) % totalImages)
    indices.push((currentIndex + 1) % totalImages)

    return indices
  }, [currentIndex, images.length])

  return (
    <div
      ref={containerRef}
      className="relative cursor-grab"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        touchAction: "none",
        userSelect: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={images.length - 1}
      aria-valuenow={currentIndex}
      aria-valuetext={`${currentIndex + 1} of ${images.length}`}
      tabIndex={0}
    >
      {isDragging && <div className="absolute inset-0 cursor-grabbing z-10" />}

      {/* Background layer */}
      <div className="absolute inset-0" />

      {/* Images */}
      {images.map((src, index) => {
        const isVisible = visibleIndices.includes(index)

        // Only render visible images for performance
        if (!isVisible && allImagesLoaded) return null

        return (
          <div
            key={`image-${index}`}
            className="absolute inset-0"
            style={{
              opacity: index === currentIndex ? 1 : 0,
            }}
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={`Turntable image ${index + 1}`}
              fill
              sizes={`${width}px`}
              priority={index === currentIndex || index === 0}
              className="object-contain mix-blend-multiply"
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
              quality={90}
              draggable={false}
              // Add loader to ensure consistent URL format
              loader={({ src, width, quality }) => {
                return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 90}`
              }}
            />
          </div>
        )
      })}

      {/* Loading indicator */}
      {!allImagesLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ opacity: 0.8 }}
        >
          <div className="text-lg">Loading...</div>
        </div>
      )}
    </div>
  )
}

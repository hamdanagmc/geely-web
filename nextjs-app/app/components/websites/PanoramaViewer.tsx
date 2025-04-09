"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import * as PANOLENS from "panolens"

interface PanoramaViewerProps {
  imageUrl: string
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ imageUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create a panorama
    const panorama = new PANOLENS.ImagePanorama(imageUrl)

    // Create a viewer
    const viewer = new PANOLENS.Viewer({
      container: containerRef.current,
      autoRotate: false,
      controlBar: true,
    })

    // Add the panorama to the viewer
    viewer.add(panorama)

    // Clean up function
    return () => {
      viewer.dispose()
    }
  }, [imageUrl])

  return <div className="panoramaRefCntr" ref={containerRef} style={{ width: "100%", height: "590px" }} />
}

export default PanoramaViewer


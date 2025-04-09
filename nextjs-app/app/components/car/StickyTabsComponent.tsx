"use client"

import { useState, useEffect, useRef } from "react"
import type { StickyTabsComponent } from "@/sanity.types"
import { Download } from "lucide-react"
import Link from "next/link"
import { urlForPDF } from "@/sanity/lib/utils"

type Tab = {
  _key: string
  label: string
  isDownloadLink?: boolean
  downloadLink?: string
  scrollToId?: string
}

type StickyTabsComponentProps = {
  block: StickyTabsComponent
  index: number
}

export default function StickyTabsComponentComp({ block }: StickyTabsComponentProps) {
  const [activeItem, setActiveItem] = useState<string>("")
  const [isScrolling, setIsScrolling] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [originalOffset, setOriginalOffset] = useState<number | null>(null)

  const tabRef = useRef<HTMLDivElement>(null)
   
  console.log("pdf", block)
  // Set initial active tab
  useEffect(() => {
    if (block?.tabs?.length) {
      setActiveItem(block.tabs[0].label || "")
    }
  }, [block?.tabs])

  // Handle click to scroll or download
  const handleTabClick = (tab: Tab) => {
    if (!tab) return

    setActiveItem(tab.label || "")

    // Handle download link
    if (tab.isDownloadLink && tab.downloadLink) {
      window.open(tab.downloadLink, "_blank")
      return
    }

    // Handle scroll to section with offset
    if (tab.scrollToId) {
      setIsScrolling(true)

      const scrollToElement = () => {
        const element = tab.scrollToId ? document.getElementById(tab.scrollToId) : null
        if (element) {
          const yOffset = -50 // 👈 Offset from top
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset
          window.scrollTo({ top: y, behavior: "smooth" })

          setTimeout(() => setIsScrolling(false), 1000)
        } else {
          setTimeout(scrollToElement, 200)
        }
      }

      scrollToElement()
    }
  }

  // Update active tab based on scroll position
  useEffect(() => {
    if (!block?.tabs || isScrolling) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const tab of block.tabs || []) {
        if (!tab.scrollToId) continue

        const element = document.getElementById(tab.scrollToId)
        if (!element) continue

        const { offsetTop, offsetHeight } = element

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveItem(tab.label || "")
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [block?.tabs, isScrolling])

  // Detect when the component reaches the top of the window and update its sticky state
  useEffect(() => {
    if (!tabRef.current) return

    setOriginalOffset(tabRef.current.offsetTop) // Store initial position

    const handleSticky = () => {
      if (!tabRef.current || originalOffset === null) return
      const scrollY = window.scrollY

      if (scrollY >= originalOffset) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener("scroll", handleSticky)
    return () => window.removeEventListener("scroll", handleSticky)
  }, [originalOffset])

  return (
    <>
    <div
      ref={tabRef}
      className={`w-full bg-white shadow-md transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 w-full z-50" : "relative"
      }`}
    >
      <div className="container mx-auto px-4 md:px-[60px]">
        <div className="overflow-x-auto scrollbar-hide">
          <nav className="flex min-w-max py-5 gap-[30px]">
            {block?.tabs?.map((tab) => (
              tab.label=="Detailed Specifications" ?
              <Link 
                href={urlForPDF(tab.downloadFile) || "#"}
                target={tab.downloadFile ? "_blank" : undefined}
                key={tab._key}
                className={`whitespace-nowrap text-[14px] leading-7 hover:font-semibold transition-colors flex items-center gap-2 ${
                  activeItem === (tab.label || "") ? "font-semibold text-black" : "text-gray-600 hover:text-black"
                }`}
              >
                {tab.label}
              </Link>: <button
                key={tab._key}
                onClick={() => handleTabClick({ ...tab, label: tab.label || "" })}
                className={`whitespace-nowrap text-[14px] leading-7 hover:font-semibold transition-colors flex items-center gap-2 ${
                  activeItem === (tab.label || "") ? "font-semibold text-black" : "text-gray-600 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
    <div className={`${
        isSticky ? "mb-[60px]" : "mb-0"}`}></div>
    </>
  )
}

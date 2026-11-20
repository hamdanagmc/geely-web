"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { setCookie, getCookie } from "cookies-next"
import { trackWebEngage } from "@/app/lib/webengage"
import { X, Menu } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

// Custom Switch component
function Switch({
  checked,
  onCheckedChange,
  disabled,
}: {
  checked: boolean
  onCheckedChange?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onCheckedChange}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
        ${checked ? "bg-green-500" : "bg-gray-200"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
          transition duration-200 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  )
}

// Custom Button component
function Button({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: "default" | "outline" | "blue"
  size?: "default" | "sm"
  className?: string
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variantStyles = {
    default: "bg-black text-white hover:bg-gray-800",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    blue: "bg-white text-blue-500 hover:bg-gray-100",
  }

  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 text-sm",
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </button>
  )
}

interface CookieOption {
  id: string
  title: string
  description: string
  required?: boolean
  enabled: boolean
}

interface CookieConsentProps {
  onClose?: () => void
  // Opened from the footer "Cookie settings" link: show even when a choice is already saved.
  reopen?: boolean
  style?: "banner" | "modal"
}

// Cookie configuration for consistent settings
const COOKIE_CONFIG = {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: "/",
  sameSite: "lax" as const,
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
  // One answer for geely.ae, nev.geely.ae and shop.geely.ae (Tracking Rules: consent gate).
  domain: typeof window !== "undefined" && window.location.hostname.endsWith("geely.ae") ? ".geely.ae" : undefined,
}

export function CookieConsent({ onClose, style = "modal", reopen = false }: CookieConsentProps = {}) {
  const [showConsent, setShowConsent] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = useTranslations("cookieBanner")
  const [cookieOptions, setCookieOptions] = useState<CookieOption[]>([
    {
      id: "necessary",
      title: "Strictly Necessary Cookies",
      description: "These cookies are essential for the website to function properly and cannot be disabled.",
      required: true,
      enabled: true,
    },
    {
      id: "analytics",
      title: "3rd Party Cookies",
      description:
        "This website uses Google Analytics to collect anonymous information such as the number of visitors to the site, and the most popular pages. Keeping this cookie enabled helps us to improve our website.",
      enabled: true,
    },
  ])

  // Check for existing consent on component mount
  useEffect(() => {
    const checkConsent = () => {
      const consentCookie = getCookie("consent")

      // Only show consent popup if no consent cookie exists, or the visitor reopened it
      if (!consentCookie || reopen) {
        setShowConsent(true)
      }
      if (consentCookie) {
        // Load saved preferences if they exist
        try {
          const savedPreferences = localStorage.getItem("cookiePreferences")
          if (savedPreferences) {
            const preferences = JSON.parse(savedPreferences)
            setCookieOptions((prev) =>
              prev.map((option) => ({
                ...option,
                enabled: preferences[option.id] !== undefined ? preferences[option.id] : option.enabled,
              })),
            )
          }
        } catch (error) {
          console.error("Error loading cookie preferences:", error)
        }
      }
    }

    // Small delay to ensure proper hydration
    const timer = setTimeout(checkConsent, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleToggle = (id: string) => {
    setCookieOptions(
      cookieOptions.map((option) => (option.id === id ? { ...option, enabled: !option.enabled } : option)),
    )
  }

  const saveConsentSettings = (consentValue: string, preferences: Record<string, boolean>, banner_action = "save_settings") => {
    // Set the main consent cookie with proper configuration
    setCookie("consent", consentValue, COOKIE_CONFIG)

    // Save detailed preferences to localStorage
    try {
      localStorage.setItem("cookiePreferences", JSON.stringify(preferences))
    } catch (error) {
      console.error("Error saving cookie preferences:", error)
    }

    // Trigger GTM script load if analytics is enabled
    if (preferences.analytics && typeof window !== "undefined") {
      // Start WebEngage now that analytics is allowed, then record the choice.
      (window as any).__weStart?.()
      // ponytail: the banner has no separate marketing category yet, so marketing_cookies is false.
      trackWebEngage("Cookie Preferences Saved", { analytics_cookies: true, marketing_cookies: !!preferences.marketing, banner_action })
      window.dispatchEvent(new Event("updateGTMConsent"))
    } else if (typeof window !== "undefined" && (window as any).webengage) {
      // Analytics turned off while WebEngage is running: reload so the loader leaves it off.
      window.location.reload()
    }
  }

  const handleEnableAll = () => {
    const updatedOptions = cookieOptions.map((option) => ({ ...option, enabled: true }))
    setCookieOptions(updatedOptions)

    const preferences = updatedOptions.reduce((acc, option) => ({ ...acc, [option.id]: option.enabled }), {})

    saveConsentSettings("all", preferences, "accept_all")
    setShowConsent(false)
    if (onClose) onClose()
  }

  const handleSaveSettings = () => {
    const preferences = cookieOptions.reduce((acc, option) => ({ ...acc, [option.id]: option.enabled }), {})

    const analyticsEnabled = cookieOptions.find((o) => o.id === "analytics")?.enabled
    const consentValue = analyticsEnabled ? "all" : "necessary"

    saveConsentSettings(consentValue, preferences)
    setShowConsent(false)
    if (onClose) onClose()
  }

  const acceptConsent = () => {
    // Enable all options
    const updatedOptions = cookieOptions.map((option) => ({ ...option, enabled: true }))
    setCookieOptions(updatedOptions)

    const preferences = updatedOptions.reduce((acc, option) => ({ ...acc, [option.id]: option.enabled }), {})

    saveConsentSettings("all", preferences, "accept_all")
    setShowConsent(false)
    if (onClose) onClose()
  }

  const declineConsent = () => {
    // Disable analytics but keep necessary cookies
    const updatedOptions = cookieOptions.map((option) => (option.required ? option : { ...option, enabled: false }))
    setCookieOptions(updatedOptions)

    const preferences = updatedOptions.reduce((acc, option) => ({ ...acc, [option.id]: option.enabled }), {})

    saveConsentSettings("necessary", preferences)
    setShowConsent(false)
    if (onClose) onClose()
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  if (!showConsent) {
    return null
  }

  // Modal style (default)
  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black p-4">
      <div className="flex w-full consentPopup max-w-[1170px] max-h-[90vh] bg-white rounded-lg shadow-lg flex-col md:flex-row">
        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Image src="/images/new-logo-black.png.webp" width={241} height={40} alt="logo" />
          </div>
          <div className="flex gap-2">
            <button onClick={toggleMobileMenu} className="p-2 text-gray-500 hover:text-gray-700">
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setShowConsent(false)
                if (onClose) onClose()
              }}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Left sidebar - hidden on mobile unless toggled */}
        <div
          className={`${mobileMenuOpen ? "block" : "hidden"} md:block contentLft w-full md:w-[40%] bg-gray-50 p-4 md:p-6 border-b md:border-r md:border-b-0`}
        >
          <div className="hidden md:block mb-8">
            <Image src="/images/new-logo-black.png.webp" width={241} height={40} alt="logo" />
          </div>

          <nav className="">
            <button
              onClick={() => {
                setActiveTab("overview")
                setMobileMenuOpen(false)
              }}
              className={`w-full mb-4 text-left px-5 text-[#000] py-3 rounded font-medium text-[15px] uppercase ${
                activeTab === "overview" ? "bg-white border" : "bg-gray-100"
              }`}
            >
              {t("privacyOverviewHdg")}
            </button>
            <button
              onClick={() => {
                setActiveTab("necessary")
                setMobileMenuOpen(false)
              }}
              className={`w-full mb-4 text-left px-5 text-[#000] py-3 rounded font-medium text-[15px] uppercase ${
                activeTab === "necessary" ? "bg-white border" : "bg-gray-100"
              }`}
            >
              {t("strictlyNecessaryCookies")}
            </button>
            <button
              onClick={() => {
                setActiveTab("analytics")
                setMobileMenuOpen(false)
              }}
              className={`w-full text-left px-5 text-[#000] py-3 rounded font-medium text-[15px] uppercase ${
                activeTab === "analytics" ? "bg-white border" : "bg-gray-100"
              }`}
            >
              {t("thirdPartyCookiesHdg")}
            </button>
          </nav>
        </div>

        {/* Right content */}
        <div className="flex-1 relative contentRft flex flex-col">
          <div className="hidden md:flex justify-between items-center md:p-0 p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              {activeTab === "overview" && t("privacyOverviewHdg")}
              {activeTab === "necessary" && t("strictlyNecessaryCookies")}
              {activeTab === "analytics" && t("thirdPartyCookiesHdg")}
            </h2>
            <button
              onClick={() => {
                setShowConsent(false)
                if (onClose) onClose()
              }}
              className="text-gray-500 consentCloseBtn hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile title */}
          <div className={`md:hidden ${mobileMenuOpen ? "hidden" : "block"} md:p-0 p-4`}>
            <h2 className="text-xl font-bold">
              {activeTab === "overview" && t("privacyOverviewHdg")}
              {activeTab === "necessary" && t("strictlyNecessaryCookies")}
              {activeTab === "analytics" && t("thirdPartyCookiesHdg")}
            </h2>
          </div>

          <div className={`flex-1 overflow-auto p-4 md:p-0 ${mobileMenuOpen ? "hidden" : "block"} md:block`}>
            {activeTab === "overview" && (
              <div className="prose max-w-none text-sm md:text-base">
                <p>{t("privacyOverviewContent")}</p>
              </div>
            )}

            {activeTab === "necessary" && (
              <div className="space-y-4 text-sm md:text-base">
                <p>{t("strictlyNecessaryCookiesContent")}</p>
                <div className="flex switchBtn items-center cursor-not-allowed justify-start">
                  <Switch checked={true} disabled />
                  <span className="font-medium ltr:ml-2 rtl:mr-2 text-[#ccc]">Enabled</span>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-4 text-sm md:text-base">
                <p>{t("thirdPartyCookiesContent")}</p>
                <div className="flex switchBtn items-center justify-start">
                  <Switch
                    checked={cookieOptions.find((o) => o.id === "analytics")?.enabled || false}
                    onCheckedChange={() => handleToggle("analytics")}
                  />
                  <span className="font-medium ltr:ml-2 rtl:mr-2 text-[#2e9935]">Enabled</span>
                </div>
              </div>
            )}
          </div>

          <div
            className={`p-4 md:pt-8 md-pb-0 border-t consentBtn flex justify-between gap-4 ${mobileMenuOpen ? "hidden" : "block"} md:flex`}
          >
            <Button variant="outline" onClick={handleEnableAll}>
              {t("enableAll")}
            </Button>
            <Button onClick={handleSaveSettings}>{t("saveSettings")}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

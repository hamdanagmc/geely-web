"use client";

import { X } from "lucide-react";
import { CookieConsent } from "./CookieConsent";
import { useState, useEffect } from "react";
import { hasCookie } from "cookies-next";
import { useTranslations } from "next-intl";

export default function Cookie() {
  const [isVisible, setIsVisible] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const t = useTranslations("cookieBanner");

  // Footer "Cookie settings" link (a plain button in a server component) reopens the modal.
  useEffect(() => {
    const open = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.("[data-cookie-settings]")) setShowConsent(true);
    };
    document.addEventListener("click", open);
    return () => document.removeEventListener("click", open);
  }, []);

  useEffect(() => {
    if (hasCookie("consent")) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [showConsent]);

  return (
    <>
      {isVisible && !showConsent && (
        <div>
          <div className="fixed cookieConsentBtm bottom-0 left-0 right-0 bg-[#eae9e8] py-3 px-4 z-[100]">
            <div className="max-w-[640px] mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 text-center sm:text-left">
                <p className="text-sm">
                {t('content')}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowConsent(true)}
                    className="px-6 py-2 text-sm border border-black rounded hover:bg-black/5 transition-colors"
                  >
                    {t('settingButton')}
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors"
                    aria-label="Close cookie notice"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showConsent && (
            <CookieConsent reopen onClose={() => setShowConsent(false)} />
          )}
    </>
  );
}

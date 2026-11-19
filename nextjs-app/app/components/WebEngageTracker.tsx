"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { modelFromPath, offerFromPath, pageType, slugify, trackWebEngage } from "@/app/lib/webengage";

// destination_site for hand-offs to the other Geely sites.
const CROSS_SITES: Record<string, string> = { "shop.geely.ae": "geely_cpo", "riddara.ae": "riddara" };

// cta_name from where a CTA goes, when the element doesn't name it (data-we-cta="name").
const CTA_BY_PATH: [RegExp, string][] = [
  [/\/request-test-drive/, "test_drive"],
  [/\/request-a-quote/, "quote"],
  [/\/brochure-download/, "brochure"],
  [/\/contact-us/, "contact"],
  [/\/service-booking/, "service_booking"],
  [/\/geely-network/, "our_locations"],
  [/\/offers\/./, "offer_details"],
  [/\/vehicles/, "explore_models"],
  [/\/car\/./, "learn_more"],
];

// target_form: the form_name the CTA opens, blank if none.
const FORM_BY_CTA: Record<string, string> = {
  test_drive: "test_drive",
  quote: "quote",
  brochure: "brochure",
  contact: "contact",
  service_booking: "service_booking",
  pre_book: "m9_prebooking",
  offer_details: "offer_enquiry",
};

/*
 * Navigation events from the Geely data model, from one click listener. Components opt in
 * with data attributes, and each click sends at most one event (Banner > CTA > Cross-site > Navigation):
 *   data-we-banner="<banner_id>" + data-we-banner-name/-pos  -> Banner Clicked
 *   data-we-cta[="<cta_name>"] + data-we-section on a parent  -> CTA Clicked
 *   <a> to shop.geely.ae / riddara.ae                         -> Cross-site Link Clicked
 *   data-we-nav="<nav_area>" + data-we-nav-cat on a parent    -> Navigation Clicked
 * data-we-model / data-we-offer on a parent set model_id / offer_id (default: from the URL).
 * data-we-dest gives a <button> its destination_path.
 */
function onClick(e: MouseEvent) {
  const el = (e.target as Element | null)?.closest?.("a, button");
  if (!el) return;

  const href = el.getAttribute("href");
  const url = href && href !== "#" ? new URL(href, location.href) : null;
  const internal = url?.origin === location.origin;
  const dest = el.getAttribute("data-we-dest") ?? (url ? (internal ? url.pathname : url.href) : "");
  const ctx = (attr: string) => el.closest(`[${attr}]`)?.getAttribute(attr) ?? "";
  const label = slugify(el.textContent || el.getAttribute("aria-label") || el.querySelector("img")?.alt);
  const path = location.pathname;
  const model_id = ctx("data-we-model") || modelFromPath(path);
  const offer_id = ctx("data-we-offer") || offerFromPath(path);

  const banner = el.closest("[data-we-banner]");
  if (banner) {
    if (!dest) return; // slide dots and other controls
    return trackWebEngage("Banner Clicked", {
      banner_id: banner.getAttribute("data-we-banner") ?? "",
      banner_name: banner.getAttribute("data-we-banner-name") ?? "",
      banner_position: Number(banner.getAttribute("data-we-banner-pos") ?? 1),
      model_id,
      offer_id,
      destination_path: dest,
    });
  }

  if (el.hasAttribute("data-we-cta")) {
    const cta_name = el.getAttribute("data-we-cta") || CTA_BY_PATH.find(([re]) => re.test(dest))?.[1] || label;
    return trackWebEngage("CTA Clicked", {
      cta_name,
      target_form: FORM_BY_CTA[cta_name] ?? "",
      cta_section: ctx("data-we-section") || (pageType(path) === "model" ? "model_body" : ""),
      model_id,
      offer_id,
    });
  }

  const site = url && CROSS_SITES[url.hostname.replace(/^www\./, "")];
  if (url && site) {
    trackWebEngage("Cross-site Link Clicked", {
      destination_site: site,
      link_label: label,
      link_section: el.closest("footer") ? "footer" : el.closest("header, [data-we-nav=header]") ? "header" : "body",
    });
    // Leaving in the same tab would cancel the SDK request, so send first, then go.
    if (el.getAttribute("target") !== "_blank" && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      // ponytail: fixed 300 ms head start for the SDK request; switch to a beacon if WebEngage exposes one.
      setTimeout(() => location.assign(url.href), 300);
    }
    return;
  }

  const nav_area = ctx("data-we-nav");
  if (nav_area && internal) {
    trackWebEngage("Navigation Clicked", {
      nav_area,
      nav_category: slugify(ctx("data-we-nav-cat")),
      nav_label: label,
      destination_path: dest,
    });
  }
}

export default function WebEngageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    document.addEventListener("click", onClick, true); // capture: runs before Link/router navigation
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Page Engaged: 75% scroll or 60 s active time, whichever first, once per page view.
  useEffect(() => {
    if (!["model", "offer", "innovation", "content"].includes(pageType(pathname))) return;

    let seconds = 0;
    let done = false;
    const fire = (engagement_type: string) => {
      if (done) return;
      done = true;
      trackWebEngage("Page Engaged", { engagement_type, model_id: modelFromPath(pathname) });
    };
    const onScroll = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight * 0.75) fire("scroll_75");
    };
    // ponytail: "active" = tab visible; add an idle check (no input for N s) if idle tabs skew it.
    const timer = setInterval(() => {
      if (document.visibilityState === "visible" && ++seconds >= 60) fire("time_60s");
    }, 1000);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}

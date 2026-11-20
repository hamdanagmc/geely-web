"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  modelFromPath,
  offerFromPath,
  pageType,
  resendPageEvents,
  setWebEngageAttributes,
  slugify,
  trackPageEvent,
  trackWebEngage,
} from "@/app/lib/webengage";
import { modelRef } from "@/app/lib/webengage-reference";

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

// Content Viewed: route -> content_type.
const CONTENT_TYPES: Record<string, string> = {
  news: "news",
  "about-geely": "about",
  "corporate-social-responsibility": "csr",
  "our-history": "history",
  "our-vision": "vision",
  "geely-care": "care_plus",
  warranty: "warranty",
};

// English slug of where a link goes ("/ar/service-booking" -> "service_booking"), so Arabic
// pages send the same values as English ones (Tracking Rules: values).
const destSlug = (dest: string) =>
  slugify(dest.replace(/^https?:\/\/[^/]+/, "").replace(/^\/(en|ar)(?=\/|$)/, "").split("/").filter(Boolean).pop() || "home");

/*
 * Click events from the Geely data model, from one click listener. Components opt in with data
 * attributes; each click sends at most one event:
 *   tel: / wa.me links                                        -> Call Clicked / WhatsApp Clicked / Location Interaction
 *   data-we-banner="<banner_id>" + data-we-banner-name/-pos   -> Banner Clicked
 *   data-we-cta[="<cta_name>"] + data-we-section on a parent  -> CTA Clicked
 *   <a> to shop.geely.ae / riddara.ae                         -> Cross-site Link Clicked
 *   data-we-nav="<nav_area>" + data-we-nav-cat on a parent    -> Navigation Clicked
 * data-we-model / data-we-offer on a parent set model_id / offer_id (default: from the URL).
 * data-we-showroom (+ -emirate, -location-type) marks a Service Network card.
 * data-we-dest gives a <button> its destination_path.
 */
function onClick(e: MouseEvent) {
  const el = (e.target as Element | null)?.closest?.("a, button");
  if (!el) return;

  const href = el.getAttribute("href");
  const url = href && href !== "#" && !href.startsWith("tel:") ? new URL(href, location.href) : null;
  const internal = url?.origin === location.origin;
  const dest = el.getAttribute("data-we-dest") ?? (url ? (internal ? url.pathname : url.href) : "");
  const ctx = (attr: string) => el.closest(`[${attr}]`)?.getAttribute(attr) ?? "";
  const path = location.pathname;
  const model_id = ctx("data-we-model") || modelFromPath(path);
  const offer_id = ctx("data-we-offer") || offerFromPath(path);
  const showroom = el.closest("[data-we-showroom]");

  // Service Network card: directions or call.
  if (showroom && (href?.startsWith("tel:") || (url && !internal))) {
    return trackWebEngage("Location Interaction", {
      action: href?.startsWith("tel:") ? "call" : "directions",
      showroom_id: showroom.getAttribute("data-we-showroom"),
      location_type: showroom.getAttribute("data-we-location-type"),
      emirate: showroom.getAttribute("data-we-emirate"),
    });
  }

  if (href?.startsWith("tel:")) {
    const roadside = /road-side-assistance/.test(path);
    trackWebEngage("Call Clicked", {
      phone_type: href.replace(/\D/g, "").endsWith("80043359") ? "toll_free" : roadside ? "roadside" : "showroom",
    });
    return setWebEngageAttributes({ preferred_contact_channel: "call", is_geely_owner_web: roadside || undefined });
  }

  if (url && /(^|\.)(wa\.me|whatsapp\.com)$/.test(url.hostname)) {
    trackWebEngage("WhatsApp Clicked", { model_id });
    return setWebEngageAttributes({ preferred_contact_channel: "whatsapp" });
  }

  const banner = el.closest("[data-we-banner]");
  if (banner) {
    if (!dest) return; // slide dots and other controls
    return trackWebEngage("Banner Clicked", {
      banner_id: banner.getAttribute("data-we-banner"),
      banner_name: banner.getAttribute("data-we-banner-name"),
      banner_position: Number(banner.getAttribute("data-we-banner-pos") ?? 1),
      model_id,
      offer_id,
      destination_path: dest,
    });
  }

  if (el.hasAttribute("data-we-cta")) {
    // React renders a bare `data-we-cta` as "true": that means "work the name out from the link".
    const named = el.getAttribute("data-we-cta");
    const cta_name =
      (named !== "true" && named) || CTA_BY_PATH.find(([re]) => re.test(dest))?.[1] || destSlug(dest);
    return trackWebEngage("CTA Clicked", {
      cta_name,
      target_form: FORM_BY_CTA[cta_name],
      cta_section: ctx("data-we-section") || (pageType(path) === "model" ? "model_body" : undefined),
      model_id,
      offer_id,
    });
  }

  const site = url && CROSS_SITES[url.hostname.replace(/^www\./, "")];
  if (url && site) {
    trackWebEngage("Cross-site Link Clicked", {
      destination_site: site,
      link_label: destSlug(url.href),
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
      nav_label: destSlug(dest),
      destination_path: dest,
    });
  }
}

// Genesys Messenger (live chat). Same queue stub as Genesys' own snippet, so subscribing works
// whichever script runs first. ponytail: verify event names/direction against a real chat on staging.
let chatHadMessage = false;
let chatSubscribed = false;
function trackLiveChat() {
  if (chatSubscribed) return; // effects run twice under StrictMode
  chatSubscribed = true;
  const w = window as any;
  w.Genesys ||= function (...args: unknown[]) {
    (w.Genesys.q ||= []).push(args);
  };
  w.Genesys("subscribe", "Messenger.opened", () =>
    trackWebEngage("Live Chat Opened", { model_id: modelFromPath(location.pathname) }),
  );
  w.Genesys("subscribe", "Messenger.closed", () => trackWebEngage("Live Chat Closed", { had_conversation: chatHadMessage }));
  w.Genesys("subscribe", "MessagingService.conversationCleared", () => (chatHadMessage = false));
  w.Genesys("subscribe", "MessagingService.messagesReceived", ({ data }: any) => {
    if (chatHadMessage || !data?.messages?.some((m: any) => m.direction === "Inbound")) return; // Inbound = from the visitor
    chatHadMessage = true;
    trackWebEngage("Live Chat Message Sent", {
      model_id: modelFromPath(location.pathname),
      offer_id: offerFromPath(location.pathname),
    });
    setWebEngageAttributes({ last_chat_date: new Date() });
  });
}

export default function WebEngageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    document.addEventListener("click", onClick, true); // capture: runs before Link/router navigation
    // Back/forward cache restores the old page without re-running effects: re-send its page views.
    const onPageShow = (e: PageTransitionEvent) => e.persisted && resendPageEvents();
    window.addEventListener("pageshow", onPageShow);
    trackLiveChat();
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  // Page events known from the route alone. Offer Viewed and Vehicle Category Viewed come from
  // their components, which hold the data.
  useEffect(() => {
    const type = pageType(pathname);
    const segment = pathname.split("/")[2] ?? "";
    if (type === "model") {
      const model_id = modelFromPath(pathname);
      const m = modelRef(model_id);
      trackPageEvent("Model Viewed", { model_id, model_name: m?.name, powertrain: m?.powertrain, body_type: m?.body_type });
    } else if (type === "innovation") {
      trackPageEvent("Innovation Page Viewed", { innovation_topic: slugify(segment) });
    } else if (type === "content") {
      // First page heading outside the header, footer and menus.
      const heading = [...document.querySelectorAll("h1, h2")].find((h) => !h.closest("header, footer, [data-we-nav]"));
      const content_title = (heading?.textContent || document.title).trim();
      trackPageEvent("Content Viewed", {
        content_type: CONTENT_TYPES[segment],
        content_title,
        model_id: modelRef(content_title)?.id,
      });
    }
  }, [pathname]);

  // Page Engaged: 75% scroll or 60 s active time, whichever first, once per page view.
  useEffect(() => {
    if (!["model", "offer_detail", "innovation", "content"].includes(pageType(pathname))) return;

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

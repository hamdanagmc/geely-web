import { LeadProps } from "@/app/types/common";

// Identify a lead in WebEngage (https://docs.webengage.com/docs/web-tracking-users).
// The site has no accounts, so the lowercased email is the unique user ID.
export function identifyWebEngageUser({ email, firstName, lastName, phone }: LeadProps) {
  const we = (window as any).webengage;
  if (!we || !email) return;

  we.user.login(email.trim().toLowerCase());
  we.user.setAttribute("we_email", email.trim());
  if (firstName) we.user.setAttribute("we_first_name", firstName);
  if (lastName) we.user.setAttribute("we_last_name", lastName);

  const e164 = (phone || "").replace(/\s/g, ""); // "+971 50..." -> "+97150..."
  if (e164.startsWith("+")) we.user.setAttribute("we_phone", e164);
}

// "Surging Power!" -> "surging_power". Keeps Arabic letters as-is.
export const slugify = (s?: string | null) =>
  (s ?? "").trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_+|_+$/g, "");

const stripLocale = (path: string) => path.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";

// ponytail: page_type values guessed from routes; swap for the agreed Value Dictionary when it lands.
export function pageType(path: string) {
  const p = stripLocale(path);
  if (p === "/") return "home";
  if (/^\/(car\/|geely-m9)/.test(p)) return "model";
  if (/^\/offers\/./.test(p)) return "offer";
  if (/^\/(innovation|more-on-ev)/.test(p)) return "innovation";
  if (/^\/(news|about-geely|our-vision|our-history|corporate-social-responsibility|geely-care|warranty)/.test(p)) return "content";
  if (/^\/(request-test-drive|request-a-quote|brochure-download|service-booking|contact-us|fleet-sales)/.test(p)) return "form";
  return p.split("/")[1].replace(/-/g, "_"); // vehicles, offers, geely_network, ...
}

export const modelFromPath = (path: string) =>
  stripLocale(path).match(/^\/car\/([^/]+)/)?.[1] ?? (/^\/geely-m9/.test(stripLocale(path)) ? "m9" : "");

export const offerFromPath = (path: string) => stripLocale(path).match(/^\/offers\/([^/]+)/)?.[1] ?? "";

// Custom event (https://docs.webengage.com/docs/web-tracking-events) with the
// "Sent with every event" attributes from the Geely data model. UTMs come from the SDK.
export function trackWebEngage(event: string, attrs: Record<string, string | number | boolean> = {}) {
  const we = (window as any).webengage;
  if (!we) return;
  const path = window.location.pathname;
  we.track(event, {
    site: "geely_main",
    page_language: /^\/ar(\/|$)/.test(path) ? "ar" : "en",
    page_type: pageType(path),
    ...attrs,
  });
}

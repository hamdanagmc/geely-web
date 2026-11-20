import { useEffect, useRef } from "react";
import { LeadProps } from "@/app/types/common";
import { modelRef } from "./webengage-reference";

type Value = string | number | boolean | Date | null | undefined;
export type Attrs = Record<string, Value>;

// Undefined until analytics consent starts the SDK (see the loader in app/[locale]/layout.tsx).
const sdk = () => (window as any).webengage;

// Tracking wrapper rule: never send empty values (an attribute's type locks on its first value).
const clean = (attrs: Attrs) =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([, v]) => v !== undefined && v !== null && v !== "" && !Number.isNaN(v instanceof Date ? v.getTime() : v),
    ),
  );

// "Surging Power!" -> "surging_power". Keeps Arabic letters as-is.
export const slugify = (s?: string | null) =>
  (s ?? "").trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_+|_+$/g, "");

const stripLocale = (path: string) => path.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";

// ponytail: page_type values guessed from routes; swap for the agreed Value Dictionary when it lands.
export function pageType(path: string) {
  const p = stripLocale(path);
  if (p === "/") return "home";
  if (/^\/(car\/|geely-m9)/.test(p)) return "model";
  if (/^\/offers\/./.test(p)) return "offer_detail";
  if (/^\/(innovation|more-on-ev)/.test(p)) return "innovation";
  if (/^\/(news|about-geely|our-vision|our-history|corporate-social-responsibility|geely-care|warranty)/.test(p)) return "content";
  if (/^\/(request-test-drive|request-a-quote|brochure-download|service-booking|contact-us|fleet-sales)/.test(p)) return "form";
  return p.split("/")[1].replace(/-/g, "_"); // vehicles, offers, geely_network, ...
}

export const modelFromPath = (path: string) => {
  const p = stripLocale(path);
  const slug = p.match(/^\/car\/([^/]+)/)?.[1] ?? (/^\/geely-m9/.test(p) ? "m9" : "");
  return modelRef(slug)?.id ?? slug.replace(/-/g, "_");
};

export const offerFromPath = (path: string) => stripLocale(path).match(/^\/offers\/([^/]+)/)?.[1] ?? "";

// UAE time: "2026-11-28T09:30:00" or "2026-11-28" -> Date at +04:00. Strings with an offset keep it.
export const uaeDate = (s?: string | null) =>
  s ? new Date(/(z|[+-]\d\d:?\d\d)$/i.test(s) ? s : `${s.length === 10 ? `${s}T00:00:00` : s}+04:00`) : undefined;

// Custom event (https://docs.webengage.com/docs/web-tracking-events) with the
// "Sent with every event" attributes from the Geely data model. UTMs come from the SDK.
export function trackWebEngage(event: string, attrs: Attrs = {}) {
  sdk()?.track(
    event,
    clean({
      site: "geely_main",
      page_language: document.documentElement.lang === "ar" ? "ar" : "en",
      page_type: pageType(location.pathname),
      ...attrs,
    }),
  );
}

// Custom user attributes (never we_-prefixed) and the we_ system ones, in one user_update.
export function setWebEngageAttributes(attrs: Attrs) {
  const a = clean(attrs);
  if (Object.keys(a).length) sdk()?.user.setAttribute(a);
}

// Identify a lead (https://docs.webengage.com/docs/web-tracking-users). Login first, then attributes.
// ponytail: the user ID is the lowercased email until the MDM customer ID middleware exists.
export function identifyWebEngageUser({ email, firstName, lastName, phone, companyName }: LeadProps) {
  if (!sdk() || !email) return;
  sdk().user.login(email.trim().toLowerCase());
  setWebEngageAttributes({
    we_email: email.trim(),
    we_first_name: firstName,
    we_last_name: lastName,
    // "+971 0501234567" -> "+971501234567": E.164 drops the local trunk 0.
    we_phone: phone?.startsWith("+") ? phone.replace(/^(\+\d+)\s+0+/, "$1").replace(/\s/g, "") : undefined,
    we_company: companyName,
  });
}

// Once-per-page-view bookkeeping (Tracking Rules: de-duplication, bfcache re-sends page views).
let view = { path: "", keys: new Set<string>(), pageEvents: [] as [string, Attrs][] };
const currentView = () =>
  view.path === location.pathname ? view : (view = { path: location.pathname, keys: new Set(), pageEvents: [] });

export const firstThisPageView = (key: string) => {
  const v = currentView();
  if (v.keys.has(key)) return false;
  v.keys.add(key);
  return true;
};

// Page events (Model Viewed, Offer Viewed, ...): once per page view, also under React StrictMode.
export function trackPageEvent(event: string, attrs: Attrs = {}) {
  if (!firstThisPageView(event)) return;
  currentView().pageEvents.push([event, attrs]);
  trackWebEngage(event, attrs);
}

export const resendPageEvents = () => currentView().pageEvents.forEach(([e, a]) => trackWebEngage(e, a));

type FormikLike = { submitCount: number; isSubmitting: boolean; errors: object };

// Form funnel events for one Formik form. Spread `startProps` on the form's wrapper: the first
// pointer / focus inside it is "Form Started" (pre-filled values don't count as interaction).
// Form Submit Failed (validation) runs on its own; step / failed / submitted are for the form to call.
export function useWebEngageForm(formik: FormikLike, form_name: string, context: Attrs = {}) {
  const ctx = useRef(context);
  ctx.current = context;

  const start = () => {
    if (firstThisPageView(`Form Started:${form_name}`)) trackWebEngage("Form Started", { form_name, ...ctx.current });
  };

  // Formik flips isSubmitting back to false without calling onSubmit when validation fails.
  const { submitCount, isSubmitting, errors } = formik;
  useEffect(() => {
    const error_field = Object.keys(errors)[0];
    if (submitCount && !isSubmitting && error_field) {
      trackWebEngage("Form Submit Failed", { form_name, error_type: "validation", error_field });
    }
  }, [submitCount, isSubmitting]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    startProps: { onPointerDownCapture: start, onFocusCapture: start },
    step: (step_number: number, step_name: string, attrs: Attrs = {}) => {
      if (firstThisPageView(`step:${form_name}:${step_number}`)) {
        trackWebEngage("Form Step Completed", { form_name, step_number, step_name, ...attrs });
      }
    },
    failed: (message?: string) =>
      trackWebEngage("Form Submit Failed", {
        form_name,
        error_type: /recaptcha/i.test(message ?? "") ? "recaptcha" : "server",
      }),
    // Call after identifyWebEngageUser (login > attributes > event).
    // ponytail: identity_status is always logged_in and mdm_match_type is absent until MDM login exists.
    submitted: (event: string, attrs: Attrs = {}) =>
      trackWebEngage(event, {
        form_name,
        form_submission_id: crypto.randomUUID(),
        identity_status: "logged_in",
        ...attrs,
      }),
  };
}

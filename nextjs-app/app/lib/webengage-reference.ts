// Reference values for WebEngage attributes (Geely Website Data Model: Model / Showroom Reference).
// `match` recognises a model or showroom in URL slugs and in English or Arabic CMS labels.
// ponytail: stand-in until AGMC shares the reference sheets; confirm ids, powertrain and add is_new_launch then.

type ModelRef = { id: string; name: string; body_type?: "suv" | "sedan"; powertrain?: "ice" | "phev" | "ev"; match: RegExp };

// Order matters: more specific patterns first (EX5 EM-i before EX5).
export const MODELS: ModelRef[] = [
  { id: "ex5_emi", name: "Geely EX5 EM-i", body_type: "suv", powertrain: "phev", match: /ex5[\s_-]*em[\s_-]*i/i },
  { id: "ex5", name: "Geely EX5", body_type: "suv", powertrain: "ev", match: /ex5/i },
  { id: "m9", name: "Geely M9", body_type: "suv", powertrain: "phev", match: /m9/i },
  { id: "coolray", name: "Coolray", body_type: "suv", powertrain: "ice", match: /coolray|كولراي/i },
  { id: "monjaro_emi", name: "Monjaro EM-i", body_type: "suv", powertrain: "phev", match: /monjaro[\s_-]*em[\s_-]*i|مونجارو\s*EM-?i/i },
  { id: "monjaro", name: "Monjaro", body_type: "suv", powertrain: "ice", match: /monjaro|مونجارو/i },
  { id: "starray_plus", name: "Starray Plus", body_type: "suv", powertrain: "ice", match: /starray|ستاراي/i },
  { id: "preface", name: "Preface", body_type: "sedan", powertrain: "ice", match: /preface|بريفيس/i },
  { id: "cityray", name: "Cityray", body_type: "suv", powertrain: "ice", match: /cityray|سيتي\s?راي/i },
  { id: "okavango", name: "Okavango", body_type: "suv", powertrain: "ice", match: /okavango|[أا]وكافانجو/i },
  { id: "emgrand", name: "Emgrand", body_type: "sedan", powertrain: "ice", match: /emgrand|[أا]مجراند/i },
  { id: "gx3_pro", name: "GX3 Pro", body_type: "suv", powertrain: "ice", match: /gx3/i },
  { id: "geometry_c", name: "Geometry C", powertrain: "ev", match: /geometry/i },
  { id: "riddara", name: "Riddara", match: /riddara|ريدارا/i },
];

export const modelRef = (text?: string | null) => (text ? MODELS.find((m) => m.match.test(text)) : undefined);

// Showrooms / service centres. Sheikh Zayed Road first: one Arabic label also contains "Deira".
const SHOWROOMS: { id: string; emirate: string; match: RegExp }[] = [
  { id: "dxb_szr", emirate: "dubai", match: /zayed|زايد/i },
  { id: "dxb_deira", emirate: "dubai", match: /deira|ديرة/i },
  { id: "auh_airport", emirate: "abu_dhabi", match: /airport|المطار/i },
  { id: "auh_musaffah", emirate: "abu_dhabi", match: /mus+af+ah|مصفح/i },
  { id: "aln", emirate: "abu_dhabi", match: /al[\s-]?ain|العين/i },
  { id: "shj", emirate: "sharjah", match: /sharjah|الشارقة/i },
  { id: "rak", emirate: "ras_al_khaimah", match: /ras\s?al|ر[أا]س الخيمة/i },
];

export const showroomRef = (text?: string | null) => (text ? SHOWROOMS.find((s) => s.match.test(text)) : undefined);

// Service Network card title -> location_type (blank when the title doesn't say).
export const locationType = (title?: string | null) => {
  const service = /service|صيانة|خدمة/i.test(title ?? "");
  const sales = /showroom|sales|معرض|مبيعات/i.test(title ?? "");
  return service && sales ? "sales_service" : service ? "service" : sales ? "sales" : undefined;
};

// Plate source codes used by the service-booking lookup.
export const PLATE_EMIRATES: Record<string, string> = {
  AUH: "abu_dhabi",
  DXB: "dubai",
  SHJ: "sharjah",
  AJM: "ajman",
  UAQ: "umm_al_quwain",
  FUJ: "fujairah",
  RAK: "ras_al_khaimah",
};

// Model ids mentioned in a text (offer title, slug), sorted: eligible_models is a comma-separated string.
// Each match is cut out before the next model is tried, so "Monjaro EM-i" isn't also "Monjaro".
export const modelsIn = (text?: string | null) => {
  let rest = text ?? "";
  const ids: string[] = [];
  for (const m of MODELS) {
    if (!m.match.test(rest)) continue;
    ids.push(m.id);
    rest = rest.replace(new RegExp(m.match.source, "gi"), " ");
  }
  return ids.sort();
};

// Offer slug / title -> offer_type. ponytail: keyword guess until the Offer Reference lands.
export const offerType = (text?: string | null) =>
  /leas/i.test(text ?? "") ? "leasing"
  : /service|maintenance/i.test(text ?? "") ? "service"
  : /launch/i.test(text ?? "") ? "launch"
  : undefined;

// Contact / Care+ "type" dropdown (English or Arabic label) -> query_type.
export const queryType = (label?: string | null) =>
  /complaint|شكوى/i.test(label ?? "") ? "complaint"
  : /part|قطع/i.test(label ?? "") ? "parts_query"
  : /service|صيانة/i.test(label ?? "") ? "service_query"
  : /sales|مبيعات/i.test(label ?? "") ? "sales_query"
  : "general_query";

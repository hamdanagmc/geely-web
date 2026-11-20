import { NextRequest, NextResponse } from "next/server";

/*
 * Stand-in for the service-booking API, so the booking flow can be tested end to end on dev.
 * Same paths and response shapes as the real API behind SERVICE_BOOKING_BASE_URL.
 *
 * Enable on a non-production deployment only:
 *   SERVICE_BOOKING_MOCK=true
 *   SERVICE_BOOKING_BASE_URL=https://<this host>/api/mock-service-booking
 *   SERVICE_BOOKING_TENANT_ID / SERVICE_BOOKING_API_KEY / SERVICE_BOOKING_API_SECRET = any non-empty value
 * It answers 404 unless SERVICE_BOOKING_MOCK=true, and never on geely.ae.
 *
 * ponytail: bookings are not stored (serverless has no shared memory); add storage if a
 * booking-status page ever needs to read them back.
 */

// Plate lookups arrive as "<number>-<code>-<emirate>": enter 11111 / A / Dubai in the form.
const VEHICLES = [
  {
    plateNumber: "11111-A-DXB",
    chassisNumber: "TESTVIN0000000001",
    givenName: "Test",
    familyName: "Coolray",
    email: "test.coolray@example.com",
    mobile: "+971500000001",
    vehicleMakeCode: "GEELY",
    vehicleVariantCode: "COOLRAY",
    vehicleModal: "Coolray",
    modelCode: "COOLRAY",
    variantCode: "FLAGSHIP",
    modalYear: 2025,
    sabVehicleId: 900001,
    userId: 800001,
  },
  {
    plateNumber: "22222-B-AUH",
    chassisNumber: "TESTVIN0000000002",
    givenName: "Test",
    familyName: "Monjaro",
    email: "test.monjaro@example.com",
    mobile: "+971500000002",
    vehicleMakeCode: "GEELY",
    vehicleVariantCode: "MONJARO",
    vehicleModal: "Monjaro",
    modelCode: "MONJARO",
    variantCode: "FLAGSHIP",
    modalYear: 2024,
    sabVehicleId: 900002,
    userId: 800002,
  },
  {
    plateNumber: "33333-C-SHJ",
    chassisNumber: "TESTVIN0000000003",
    givenName: "Test",
    familyName: "Okavango",
    email: "test.okavango@example.com",
    mobile: "+971500000003",
    vehicleMakeCode: "GEELY",
    vehicleVariantCode: "OKAVANGO",
    vehicleModal: "Okavango",
    modelCode: "OKAVANGO",
    variantCode: "PREMIUM",
    modalYear: 2023,
    sabVehicleId: 900003,
    userId: 800003,
  },
];

// Ids must be numbers: createAppointment rejects anything else.
const LOCATIONS = [
  { id: 101, name: "Geely - Sheikh Zayed Road Dubai (TEST)", city: "Dubai", country: "UAE", latitude: 25.1586, longitude: 55.2276 },
  { id: 102, name: "Geely – Abu Dhabi – Musaffah (TEST)", city: "Abu Dhabi", country: "UAE", latitude: 24.3528, longitude: 54.5097 },
  { id: 103, name: "Geely - Sharjah (TEST)", city: "Sharjah", country: "UAE", latitude: 25.3239, longitude: 55.4176 },
];

const SERVICES = [
  { serviceProductId: "TEST-10K", description: "10,000 km service (TEST)" },
  { serviceProductId: "TEST-20K", description: "20,000 km service (TEST)" },
  { serviceProductId: "TEST-AC", description: "AC check (TEST)" },
];

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

// The next 5 days, YYYY-MM-DD.
const nextDays = () =>
  Array.from({ length: 5 }, (_, i) => new Date(Date.now() + (i + 1) * 86_400_000).toISOString().slice(0, 10));

async function handle(req: NextRequest) {
  if (process.env.SERVICE_BOOKING_MOCK !== "true" || req.nextUrl.hostname.endsWith("geely.ae")) {
    return json({ message: "Not found" }, 404);
  }

  // The site's actions call `${SERVICE_BOOKING_BASE_URL}/api/...`, so requests arrive as
  // /api/mock-service-booking/api/service/...: drop both prefixes.
  const path = req.nextUrl.pathname.replace(/^\/api\/mock-service-booking\/(api\/)?/, "");
  const q = req.nextUrl.searchParams;
  const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};

  if (req.method === "GET" && path.startsWith("leads/generate-token/")) {
    return json({ token: "mock-token", expires_at: new Date(Date.now() + 3_600_000).toISOString() });
  }

  if (req.method === "GET" && path === "service/vehicle-details") {
    const plate = q.get("vehicleNumber")?.toUpperCase();
    const vin = q.get("vin")?.toUpperCase();
    const vehicle = VEHICLES.find((v) => (plate && v.plateNumber === plate) || (vin && v.chassisNumber === vin));
    return vehicle ? json({ data: vehicle }) : json({ message: "Vehicle not found" }, 404);
  }

  if (req.method === "GET" && path === "service-locations") return json({ data: LOCATIONS });

  if (req.method === "GET" && path === "service/recommended-services") return json({ result: SERVICES });

  if (req.method === "POST" && path === "service/appointment-dates") {
    return json({ result: { availableDates: nextDays() } });
  }

  if (req.method === "POST" && path === "service/appointment-time") {
    const date = String(body.selectedDate ?? nextDays()[0]).slice(0, 10);
    return json({
      result: {
        timeSlots: ["09:00", "10:30", "13:00", "15:30"].map((timeSlot, i) => ({
          timeSlot,
          startDateTime: `${date}T${timeSlot}:00`,
          advisorId: 700 + i,
        })),
      },
    });
  }

  if (req.method === "POST" && path === "service") {
    if (!VEHICLES.some((v) => v.sabVehicleId === body.vehicleId)) return json({ message: "Unknown vehicleId" }, 400);
    // The site shows the part after the last "-" as the booking reference.
    return json({ result: { data: { appointmentId: `MOCK-${Math.floor(100000 + Math.random() * 900000)}` } } });
  }

  return json({ message: `Mock has no ${req.method} /${path}` }, 404);
}

export { handle as GET, handle as POST };

import { timingSafeEqual, randomUUID } from "node:crypto";
import { sendHealthReportEmail } from "@/app/services/email/health-report";
import { NextResponse } from 'next/server';

export const runtime = "nodejs";
export const maxDuration = 60;

type Config = {
  healthUrl: string;
  environment: string;
};
type Check = { ok: boolean; detail: string };

function reply(body: unknown, status = 200): Response {
  console.log("[apisix-monitor] Replying with", status, JSON.stringify(body));
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function config(): Config {
  const target = new URL(required("NGENIUS_APISIX_URL") + "/_health/ready");
  if (
    !["http:", "https:"].includes(target.protocol) ||
    target.username || target.password || target.search || target.hash ||
    target.pathname !== "/_health/ready"
  ) throw new Error("APISIX_HEALTH_URL must point directly to /_health/ready without credentials or query parameters.");

  const from = required("SENDGRID_FROM_EMAIL");
  const to = [...new Set(required("ALERT_EMAIL_TO").split(",").map((v) => v.trim()).filter(Boolean))];
  const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
  if (!email.test(from) || to.length === 0 || to.length > 50 || to.some((v) => !email.test(v))) {
    throw new Error("Set valid sender/recipient addresses; recipients must be comma-separated (maximum 50).");
  }
  return {
    healthUrl: target.toString(),
    environment: (process.env.MONITOR_ENVIRONMENT || "Production").replace(/[\r\n]/g, " ").slice(0, 80),
  };
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function checkOnce(healthUrl: string): Promise<Check> {
  const nonce = randomUUID();
  const url = new URL(healthUrl);
  url.searchParams.set("nonce", nonce);
  try {
    // A fresh URL plus no-store and nonce validation rejects stale cached results.
    // Do NOT forward CRON_SECRET, SendGrid credentials or APISIX administrator keys.
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      redirect: "manual",
      headers: { Accept: "application/json", "Cache-Control": "no-cache" },
      signal: AbortSignal.timeout(10_000),
    });
    if (![200, 503].includes(response.status)) {
      await response.body?.cancel();
      return { ok: false, detail: `Unexpected HTTP ${response.status} from the health endpoint.` };
    }
    let body: unknown;
    try { body = await response.json(); }
    catch { return { ok: false, detail: "Health endpoint returned unreadable JSON." }; }
    if (!object(body) || body.service !== "apisix" || body.nonce !== nonce || !object(body.checks)) {
      return { ok: false, detail: "Health response was invalid, unexpected or stale." };
    }
    const failures: string[] = [];
    if (body.checks.etcd !== true) failures.push("etcd health check failed");
    if (body.checks.dashboard !== true) failures.push("dashboard HTTP check failed");
    if (failures.length) return { ok: false, detail: failures.join("; ") };
    if (response.status !== 200 || body.status !== "ok") {
      return { ok: false, detail: "Gateway reported an unhealthy state." };
    }
    return { ok: true, detail: "APISIX, etcd and dashboard checks passed." };
  } catch (error) {
    const timeout = error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name);
    return { ok: false, detail: timeout ? "Health request timed out after 10 seconds." : "Connection, DNS or TLS failure contacting the health endpoint." };
  }
}

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return reply({ error: "Monitoring is not configured." }, 500);
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(request.headers.get("authorization") || "");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return reply({ error: "Unauthorized" }, 401);
  }

  const test = request.headers.get("x-monitor-test");
  if (test && test !== "email" && test !== "outage") return reply({ error: "Unknown test mode." }, 400);
  let c: Config;
  try { c = config(); }
  catch (error) {
    const message = error instanceof Error ? error.message : "Invalid monitor configuration.";
    console.error("[apisix-monitor] Configuration error:", message);
    return reply({ error: "Invalid monitor configuration. Check server-side environment variables." }, 500);
  }

  const results: Check[] = [];
  if (test !== "email") {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 2_000));
      const result = test === "outage"
        ? { ok: false, detail: "SIMULATED outage; the real server was not stopped or checked." }
        : await checkOnce(c.healthUrl);
      results.push(result);
      console.log(`[apisix-monitor] Attempt ${attempt + 1}: ${result.ok ? "healthy" : "unhealthy"} - ${result.detail}`);
      if (result.ok) return reply({ status: "healthy", attempts: results.length, emailAccepted: false });
    }
  }

  const now = new Date();
  const when = `${now.toISOString()} / ${now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`;
  const subject = test
    ? `[TEST] [${c.environment}] APISIX ${test === "email" ? "email notification" : "simulated outage"}`
    : `[${c.environment}] APISIX infrastructure check failed`;
  const text = [
    test ? "This is an authenticated manual test. It is NOT evidence of a real outage." : "The APISIX infrastructure health check failed twice.",
    `Environment: ${c.environment}`,
    `Checked at: ${when}`,
    `Endpoint: ${c.healthUrl}`,
    ...results.map((r, i) => `Attempt ${i + 1}: ${r.detail}`),
    "",
    "Check the EC2 instance, Docker, etcd, APISIX and dashboard.",
    "A dashboard-only failure does not establish that payment verification is unavailable.",
    "This check does not retrieve N-Genius orders or validate transaction/payment status.",
    "No incident state is stored by this monitor. Each unsuccessful hourly invocation sends a new email; healthy runs are silent.",
  ].join("\n");
  try {
    await sendHealthReportEmail(subject, text);
    return reply({ status: test ? "test" : "unhealthy", attempts: results.length, emailAccepted: true });
  } catch (error) {
    // Never log API keys, order data, email contents, or request headers.
    const detail = error instanceof Error && error.message.startsWith("SendGrid rejected")
      ? error.message : "SendGrid request failed or timed out; acceptance is unknown.";
    console.error("[apisix-monitor]", detail);
    return reply({ status: "notification_failed", emailAccepted: false, error: detail }, 502);
  }
}

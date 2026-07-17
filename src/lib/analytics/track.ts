// src/lib/analytics/track.ts
// Client-side visitor/event tracker for the platform analytics endpoints.

const API_URL = "http://localhost:3001/api";
const SESSION_KEY = "avertune_session_id";
const IDENTIFIED_KEY = "avertune_session_identified";
const LAST_PAGEVIEW_KEY = "avertune_last_pageview";

const BATCH_FLUSH_INTERVAL_MS = 4000;
const MAX_BATCH_SIZE = 25;
const PAGEVIEW_DEDUPE_MS = 3000;

interface QueuedEvent {
  session_id: string;
  event_name: string;
  path: string;
  properties: Record<string, unknown>;
}

let queue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let pageEnteredAt = 0;

// ── Consent ──────────────────────────────────────────────────────────────────

/** Analytics cookies are only used if the person has accepted the analytics category. */
function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("cookie_consent");
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.analytics === true;
  } catch {
    return false;
  }
}

// ── Session ──────────────────────────────────────────────────────────────────

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

async function simpleFingerprint(): Promise<string> {
  if (typeof window === "undefined") return "server";
  const parts = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}`,
    new Date().getTimezoneOffset(),
  ].join("|");

  try {
    const data = new TextEncoder().encode(parts);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const hex = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `fp_${hex.slice(0, 24)}`;
  } catch {
    return `fp_${parts.length}_${parts.charCodeAt(0)}`;
  }
}

function detectDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Safari/") && !ua.includes("Chrome")) return "Safari";
  return "Other";
}

function detectOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad/.test(ua)) return "iOS";
  return "Other";
}

function getUtmParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
  };
}

function getReferralCode(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  return params.get("ref") ?? params.get("referral_code") ?? undefined;
}

// ── Network ──────────────────────────────────────────────────────────────────

async function post(path: string, body: unknown) {
  try {
    await fetch(`${API_URL}/analytics/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Analytics failures must never break the app.
  }
}

// ── Identify (once per session) ─────────────────────────────────────────────

/** Call once on first page load to register device/browser/UTM info. */
export async function identifySession() {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (sessionStorage.getItem(IDENTIFIED_KEY)) return;

  const session_id = getSessionId();
  const fingerprint = await simpleFingerprint();

  sessionStorage.setItem(IDENTIFIED_KEY, "1");

  await post("identify", {
    session_id,
    fingerprint,
    device_type: detectDeviceType(),
    browser: detectBrowser(),
    os: detectOS(),
    referrer: document.referrer || undefined,
    landing_page: window.location.pathname,
    referral_code: getReferralCode(),
    ...getUtmParams(),
  });
}

// ── Page views (deduped, with duration) ─────────────────────────────────────

/** Call on every route change. Deduped client-side same as the API (3s window). */
export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  const now = Date.now();
  const last = sessionStorage.getItem(LAST_PAGEVIEW_KEY);
  if (last) {
    const [lastPath, lastTime] = last.split("|");
    if (lastPath === path && now - Number(lastTime) < PAGEVIEW_DEDUPE_MS) {
      return;
    }
  }
  sessionStorage.setItem(LAST_PAGEVIEW_KEY, `${path}|${now}`);

  const duration_ms = pageEnteredAt ? now - pageEnteredAt : 0;
  pageEnteredAt = now;

  void post("pageview", {
    session_id: getSessionId(),
    path,
    referrer: document.referrer || undefined,
    title: title ?? document.title,
    duration_ms,
    referral_code: getReferralCode(),
  });
}

// ── Events (single + batched) ────────────────────────────────────────────────

function flush() {
  if (queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  if (batch.length === 1) {
    void post("event", batch[0]);
  } else {
    void post("batch", { events: batch });
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, BATCH_FLUSH_INTERVAL_MS);
}

/**
 * Track a user action (signup, generate, copy, upgrade_click, subscribe, etc.).
 * Fire-and-forget, batched, consent-aware. Safe to call anywhere — never throws.
 */
export function track(
  eventName: string,
  properties: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  try {
    queue.push({
      session_id: getSessionId(),
      event_name: eventName,
      path: window.location.pathname,
      properties,
    });

    if (queue.length >= MAX_BATCH_SIZE) {
      flush();
    } else {
      scheduleFlush();
    }
  } catch {
    // Never let tracking break the calling code.
  }
}

/** Force an immediate flush — useful before navigation/unload. */
export function flushAnalytics() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  flush();
}

// ── Session end (sendBeacon on unload) ──────────────────────────────────────

function endSession() {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  flushAnalytics();

  const duration_ms = pageEnteredAt ? Date.now() - pageEnteredAt : 0;
  const payload = JSON.stringify({
    session_id: getSessionId(),
    duration_ms,
    exit_page: window.location.pathname,
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${API_URL}/analytics/session/end`,
        new Blob([payload], { type: "application/json" }),
      );
    } else {
      void post("session/end", JSON.parse(payload));
    }
  } catch {
    // Never let tracking break the calling code.
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", endSession);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushAnalytics();
    }
  });
}

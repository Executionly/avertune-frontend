// lib/analytics.js
import { api } from "./apiClient";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

let sessionId = null;
let fingerprint = null;
let analyticsEnabled = true;
let lastPageviewPath = null;
let lastPageviewTime = 0;
let sessionStartTime = null;

// Generate a random session ID
function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create session ID
function getSessionId() {
  if (!sessionId) {
    sessionId = localStorage.getItem("analytics_session_id");
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem("analytics_session_id", sessionId);
    }
  }
  return sessionId;
}

// Load fingerprint once
async function loadFingerprint() {
  if (fingerprint) return fingerprint;
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    fingerprint = result.visitorId;
    return fingerprint;
  } catch (err) {
    console.warn("FingerprintJS failed:", err);
    fingerprint = "unknown";
    return fingerprint;
  }
}

// Identify session on first page load
export async function identifySession(referralCode = null) {
  if (!analyticsEnabled) return;
  const session_id = getSessionId();
  const fp = await loadFingerprint();
  const deviceType = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ? "mobile"
    : "desktop";
  const browser =
    navigator.userAgent
      .split(" ")
      .find(
        (s) =>
          s.includes("Chrome") || s.includes("Firefox") || s.includes("Safari"),
      ) || "Unknown";
  const os = navigator.platform || "Unknown";
  const referrer = document.referrer || "";
  const landingPage = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  const referralCodeFromUrl = urlParams.get("ref") || referralCode;

  const payload = {
    session_id,
    fingerprint: fp,
    device_type: deviceType,
    browser,
    os,
    referrer,
    landing_page: landingPage,
    referral_code: referralCodeFromUrl,
    utm_source: urlParams.get("utm_source"),
    utm_medium: urlParams.get("utm_medium"),
    utm_campaign: urlParams.get("utm_campaign"),
  };

  try {
    await api.post("/analytics/identify", payload);
    sessionStartTime = Date.now();
  } catch (err) {
    console.warn("Analytics identify failed:", err);
  }
}

// Track page view (call on route change)
export async function trackPageview(path, title = "") {
  if (!analyticsEnabled) return;
  const now = Date.now();
  // Deduplicate: ignore if same path within 3 seconds
  if (lastPageviewPath === path && now - lastPageviewTime < 3000) return;
  lastPageviewPath = path;
  lastPageviewTime = now;

  const session_id = getSessionId();
  const urlParams = new URLSearchParams(window.location.search);
  const referralCode = urlParams.get("ref");

  const payload = {
    session_id,
    path,
    referrer: document.referrer || "",
    title: title || document.title,
    duration_ms: sessionStartTime ? now - sessionStartTime : 0,
    referral_code: referralCode,
  };

  try {
    await api.post("/analytics/pageview", payload);
  } catch (err) {
    console.warn("Analytics pageview failed:", err);
  }
}

// Track a single event
export async function trackEvent(eventName, properties = {}) {
  if (!analyticsEnabled) return;
  const session_id = getSessionId();
  const payload = {
    session_id,
    event_name: eventName,
    path: window.location.pathname,
    properties,
  };

  try {
    await api.post("/analytics/event", payload);
  } catch (err) {
    console.warn("Analytics event failed:", err);
  }
}

// End session on page unload (sendBeacon)
export function endSession() {
  if (!analyticsEnabled || !sessionId) return;
  const duration = sessionStartTime ? Date.now() - sessionStartTime : 0;
  const payload = {
    session_id: sessionId,
    duration_ms: duration,
    exit_page: window.location.pathname,
  };
  // Use sendBeacon for reliable delivery on unload
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    navigator.sendBeacon(`${api.defaults.baseURL}/analytics/session/end`, blob);
  } else {
    api.post("/analytics/session/end", payload).catch(() => {});
  }
}

// Initialize analytics (call once in App.jsx or main.jsx)
export function initAnalytics() {
  // Set up beforeunload event to end session
  window.addEventListener("beforeunload", () => {
    endSession();
  });
  // Identify session on load
  identifySession();
}

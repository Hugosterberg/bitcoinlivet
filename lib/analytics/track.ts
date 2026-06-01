/**
 * Lightweight analytics event tracking.
 *
 * Fires a conversion/interaction event to whatever is loaded:
 *  - Google Analytics 4 (gtag)
 *  - Google Tag Manager (dataLayer)
 *  - Microsoft Clarity (custom event/tag)
 *
 * Safe to call anywhere on the client — it no-ops when nothing is loaded
 * (e.g. before cookie consent), so callers never need to guard.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
    clarity?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
  }
}

/** Conversion/interaction events we care about across the app. */
export type AnalyticsEvent =
  | "newsletter_subscribe"
  | "sign_up"
  | "login"
  | "lesson_complete"
  | "course_complete";

/** Map our events to Meta's standard events for ad conversion optimization. */
const META_STANDARD: Partial<Record<AnalyticsEvent, string>> = {
  newsletter_subscribe: "Subscribe",
  sign_up: "CompleteRegistration",
};

export function trackEvent(
  event: AnalyticsEvent,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;

  // GA4
  window.gtag?.("event", event, params);
  // GTM
  window.dataLayer?.push({ event, ...params });
  // Clarity — flag the session with the event name for filtering.
  window.clarity?.("event", event);
  // Meta Pixel — standard event when mapped, else a custom event.
  const metaStandard = META_STANDARD[event];
  if (metaStandard) window.fbq?.("track", metaStandard);
  else window.fbq?.("trackCustom", event, params);
}

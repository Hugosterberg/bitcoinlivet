"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny client store for the cookie-consent choice, backed by localStorage and
 * read via useSyncExternalStore (hydration-safe). Gates the optional analytics
 * (GA4 + Clarity); cookieless Vercel Analytics runs regardless.
 */

const STORAGE_KEY = "bitcoinlivet:cookie-consent:v1";

export type Consent = "granted" | "denied";

let value: Consent | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded(): Consent | null {
  if (typeof window === "undefined") return null;
  if (!loaded) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      value = raw === "granted" || raw === "denied" ? raw : null;
    } catch {
      value = null;
    }
    loaded = true;
  }
  return value;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function setConsent(next: Consent) {
  value = next;
  loaded = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Ignore storage failures (privacy mode, quota).
  }
  listeners.forEach((l) => l());
}

/** Clears the saved choice so the banner shows again ("Cookie-inställningar"). */
export function resetConsent() {
  value = null;
  loaded = true;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
  listeners.forEach((l) => l());
}

const noopSubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;
const getNull = () => null;

export function useConsent(): { consent: Consent | null; hydrated: boolean } {
  const consent = useSyncExternalStore(subscribe, ensureLoaded, getNull);
  const hydrated = useSyncExternalStore(noopSubscribe, getTrue, getFalse);
  return { consent, hydrated };
}

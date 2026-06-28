import "server-only";

import { Resend } from "resend";

/**
 * Resend integration for newsletter / platform-news emails.
 *
 * Consent model: only people who have *accepted* are ever added as contacts to
 * the Resend Audience —
 *   - homepage newsletter form (explicit opt-in), and
 *   - account signup with the marketing-consent box ticked.
 * Broadcasts are sent to that audience, so a send can only reach people who
 * accepted. Resend also appends a compliant unsubscribe link automatically.
 *
 * All values are server-only secrets (never NEXT_PUBLIC).
 */

type EmailLocale = "sv" | "en";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
/**
 * Optional per-locale audience for the English domain. When set, en subscribers
 * are added here and sv subscribers to RESEND_AUDIENCE_ID, so broadcasts can be
 * sent in the right language. Falls back to the single audience when unset.
 */
export const RESEND_AUDIENCE_ID_EN = process.env.RESEND_AUDIENCE_ID_EN;
/** Verified sender, e.g. "bitcoinlivet <noreply@bitcoinlivet.se>". */
export const RESEND_FROM =
  process.env.RESEND_FROM ?? "bitcoinlivet <onboarding@resend.dev>";
/** Optional English sender, e.g. "bitcoinerlife <noreply@bitcoinerlife.xyz>". */
export const RESEND_FROM_EN = process.env.RESEND_FROM_EN;

/** Picks the sender for a locale, falling back to the default sender. */
export function fromForLocale(locale?: EmailLocale): string {
  return locale === "en" && RESEND_FROM_EN ? RESEND_FROM_EN : RESEND_FROM;
}

/** True when sending + audience sync are wired up. */
export const isResendConfigured = Boolean(RESEND_API_KEY && RESEND_AUDIENCE_ID);

/** Resolves the audience for a locale, falling back to the default audience. */
export function audienceForLocale(locale?: EmailLocale): string | undefined {
  if (locale === "en" && RESEND_AUDIENCE_ID_EN) return RESEND_AUDIENCE_ID_EN;
  return RESEND_AUDIENCE_ID;
}

function getResend(): Resend {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY saknas (se docs/RESEND.md).");
  }
  return new Resend(RESEND_API_KEY);
}

/**
 * Adds a consented email to the news Audience (per-locale when configured).
 * Best-effort and never throws — Supabase remains the source of truth for
 * consent, so a transient Resend failure must not break signup / subscribe.
 */
export async function addNewsletterContact(
  email: string,
  locale?: EmailLocale,
): Promise<void> {
  const audienceId = audienceForLocale(locale);
  if (!RESEND_API_KEY || !audienceId) return;
  try {
    const resend = getResend();
    await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
  } catch {
    // Ignore — the address is still recorded (with consent) in Supabase.
  }
}

/**
 * Sends a broadcast to the whole consented Audience. Used by the protected
 * admin route. Throws on failure so the caller can report it.
 */
export async function sendNewsletterBroadcast({
  subject,
  html,
  name,
  locale,
}: {
  subject: string;
  html: string;
  /** Internal label shown in the Resend dashboard. */
  name?: string;
  /** Target the per-locale audience (falls back to the default audience). */
  locale?: EmailLocale;
}): Promise<string> {
  const audienceId = audienceForLocale(locale);
  if (!RESEND_API_KEY || !audienceId) {
    throw new Error("Resend är inte konfigurerat (RESEND_API_KEY / RESEND_AUDIENCE_ID).");
  }

  const resend = getResend();

  const created = await resend.broadcasts.create({
    audienceId,
    from: fromForLocale(locale),
    subject,
    html,
    name: name ?? subject,
  });
  if (created.error || !created.data) {
    throw new Error(created.error?.message ?? "Kunde inte skapa broadcast.");
  }

  const sent = await resend.broadcasts.send(created.data.id);
  if (sent.error) {
    throw new Error(sent.error.message);
  }

  return created.data.id;
}

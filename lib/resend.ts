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

const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
/** Verified sender, e.g. "bitcoinlivet <noreply@bitcoinlivet.se>". */
export const RESEND_FROM =
  process.env.RESEND_FROM ?? "bitcoinlivet <onboarding@resend.dev>";

/** True when sending + audience sync are wired up. */
export const isResendConfigured = Boolean(RESEND_API_KEY && RESEND_AUDIENCE_ID);

function getResend(): Resend {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY saknas (se docs/RESEND.md).");
  }
  return new Resend(RESEND_API_KEY);
}

/**
 * Adds a consented email to the news Audience. Best-effort and never throws —
 * Supabase remains the source of truth for consent, so a transient Resend
 * failure must not break signup / subscribe.
 */
export async function addNewsletterContact(email: string): Promise<void> {
  if (!isResendConfigured) return;
  try {
    const resend = getResend();
    await resend.contacts.create({
      email,
      audienceId: RESEND_AUDIENCE_ID!,
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
}: {
  subject: string;
  html: string;
  /** Internal label shown in the Resend dashboard. */
  name?: string;
}): Promise<string> {
  if (!isResendConfigured) {
    throw new Error("Resend är inte konfigurerat (RESEND_API_KEY / RESEND_AUDIENCE_ID).");
  }

  const resend = getResend();

  const created = await resend.broadcasts.create({
    audienceId: RESEND_AUDIENCE_ID!,
    from: RESEND_FROM,
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

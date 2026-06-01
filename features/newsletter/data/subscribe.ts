"use server";

import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { addNewsletterContact } from "@/lib/resend";
import { rateLimit } from "@/lib/rate-limit";
import {
  isValidEmail,
  type SubscribeState,
} from "@/features/newsletter/types";

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Server Action that adds an email to the newsletter list.
 *
 * - Validates the email format server-side (never trust the client).
 * - Stores it via the `subscribe_to_newsletter` RPC, which dedupes silently
 *   (no double opt-in, no email sent). See supabase/migrations/0001_newsletter.sql.
 *
 * Designed for `useActionState`: takes the previous state + FormData.
 */
export async function subscribeToNewsletter(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  // Honeypot: a hidden field real users never fill. If set, it's a bot —
  // pretend success without storing anything.
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "ok", message: "Tack! Du är med på listan." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!isValidEmail(email)) {
    return {
      status: "invalid",
      message: "Kontrollera e-postadressen och försök igen.",
    };
  }

  // Throttle bursts from one client (best-effort, per server instance).
  if (!rateLimit(`newsletter:${await clientIp()}`, 5, 10 * 60 * 1000)) {
    return {
      status: "error",
      message: "För många försök. Vänta en stund och försök igen.",
    };
  }

  if (!isSupabaseConfigured) {
    // Don't pretend to subscribe before the backend exists.
    return {
      status: "unconfigured",
      message: "Anmälan är inte aktiverad ännu. Försök igen senare.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc("subscribe_to_newsletter", {
      p_email: email,
    });
    if (error) throw error;

    // Submitting the newsletter form is itself an opt-in → add to the
    // Resend send list. Best-effort; never blocks the thank-you.
    await addNewsletterContact(email);

    return {
      status: "ok",
      message: "Tack! Du är med på listan.",
    };
  } catch {
    return {
      status: "error",
      message: "Något gick fel. Försök igen om en stund.",
    };
  }
}

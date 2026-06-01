"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { addNewsletterContact } from "@/lib/resend";
import {
  isValidEmail,
  type SubscribeState,
} from "@/features/newsletter/types";

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
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!isValidEmail(email)) {
    return {
      status: "invalid",
      message: "Kontrollera e-postadressen och försök igen.",
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

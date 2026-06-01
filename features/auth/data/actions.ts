"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { addNewsletterContact } from "@/lib/resend";

/**
 * Server-only side-effect for signup with marketing consent: add the email to
 * the Supabase newsletter list and the Resend send Audience. Kept on the server
 * because the Resend key must never reach the browser. Auth itself happens on
 * the client (see AuthForm) so the session cookie is set without a race.
 */
export async function recordSignupConsent(email: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await createClient();
  await supabase.rpc("subscribe_to_newsletter", { p_email: email });
  await addNewsletterContact(email);
}

export type UpdatePasswordResult = { ok: boolean; error?: string };

/**
 * Sets a new password for the user in the current (recovery) session. Run on
 * the server so it reads the session cookie reliably — the user arrives here
 * via the auth callback after clicking the reset link.
 */
export async function updatePassword(
  password: string,
): Promise<UpdatePasswordResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: "Inloggning är inte aktiverad ännu." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Lösenordet måste vara minst 8 tecken." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Återställningslänken är ogiltig eller har gått ut." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { ok: false, error: "Kunde inte uppdatera lösenordet. Försök igen." };
  }
  return { ok: true };
}

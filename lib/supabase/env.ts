/**
 * Resolves the public Supabase environment variables.
 *
 * The site works fully without Supabase configured (anonymous localStorage
 * progress, placeholder-free newsletter that degrades gracefully). These
 * helpers let callers detect whether the integration is wired up yet, so
 * nothing throws at build time before the project exists.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  // New Supabase projects expose a "publishable" key; either works client-side.
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** True when both public env vars are present and Supabase can be used. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Narrowing helper that asserts the config exists. */
export function requireSupabaseEnv(): { url: string; anonKey: string } {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase är inte konfigurerat. Sätt NEXT_PUBLIC_SUPABASE_URL och " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY (se docs/SUPABASE.md).",
    );
  }
  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
}

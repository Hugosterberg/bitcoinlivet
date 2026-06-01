"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/supabase/types";
import { requireSupabaseEnv } from "@/lib/supabase/env";

/**
 * Browser Supabase client for Client Components.
 *
 * Call only after checking `isSupabaseConfigured`; it throws if the public
 * env vars are missing so misconfiguration fails loudly in development.
 */
export function createClient() {
  const { url, anonKey } = requireSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}

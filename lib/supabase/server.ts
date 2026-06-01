import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/lib/supabase/types";
import { requireSupabaseEnv } from "@/lib/supabase/env";

/**
 * Server Supabase client for Server Components, Server Actions and Route
 * Handlers. Reads/writes the auth cookies via `next/headers`.
 *
 * `cookies()` is async in Next 16, so this helper is async too. The cookie
 * `setAll` is wrapped in try/catch because Server Components cannot mutate
 * cookies — session refresh happens in `middleware.ts` instead.
 */
export async function createClient() {
  const { url, anonKey } = requireSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — safe to ignore, middleware
          // refreshes the session cookies on the next request.
        }
      },
    },
  });
}

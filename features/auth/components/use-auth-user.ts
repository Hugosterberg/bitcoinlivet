"use client";

import { useEffect, useState } from "react";

export type AuthUser = { id: string; email: string | null };

export type AuthUserState = {
  user: AuthUser | null;
  loading: boolean;
  signedIn: boolean;
};

/**
 * Client-side auth state for global UI (header, sign-in prompt).
 *
 * Reads from `/api/auth/me`, where the server resolves the session from the
 * cookie reliably. Sign in / out both trigger a full-page reload, so this
 * re-runs on every load and the UI always reflects the real state — no
 * dependency on the browser Supabase client's cookie-read timing.
 */
export function useAuthUser(): AuthUserState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((data: { user: AuthUser | null }) => {
        if (!active) return;
        setUser(data.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { user, loading, signedIn: Boolean(user) };
}

"use client";

import { useEffect } from "react";

import { useAuthUser } from "@/features/auth/components/use-auth-user";
import {
  hydrateFromServer,
  revertToLocalMode,
} from "@/features/education/components/progress-provider";
import { loadServerProgress } from "@/features/education/data/progress-sync";

/**
 * Bridges account progression into the client store, fully client-side so the
 * education pages stay statically rendered (good for SEO).
 *
 * - Signed in  → load the user's server progression and seed the store.
 * - Signed out → keep the anonymous localStorage store.
 */
export function ProgressSync() {
  const { signedIn, loading } = useAuthUser();

  useEffect(() => {
    if (loading) return;
    let active = true;

    if (signedIn) {
      loadServerProgress().then((data) => {
        if (active) hydrateFromServer(data);
      });
    } else {
      revertToLocalMode();
    }

    return () => {
      active = false;
    };
  }, [signedIn, loading]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  getLocalProgressSnapshot,
  hydrateFromServer,
} from "@/features/education/components/progress-provider";
import { mergeLocalIntoAccount } from "@/features/education/data/progress-sync";

/**
 * Runs once when a signed-in user lands on their account: merges any anonymous
 * localStorage progress into their account so nothing earned before signing up
 * is lost. Idempotent — re-running merges the same union again harmlessly.
 */
export function AccountSync({ userId }: { userId: string }) {
  const router = useRouter();

  useEffect(() => {
    const flag = `bitcoinlivet:merged:${userId}`;
    if (typeof window === "undefined" || window.localStorage.getItem(flag)) {
      return;
    }

    const local = getLocalProgressSnapshot();
    const hasLocal = Object.keys(local.lessons).length > 0;

    void (async () => {
      const merged = hasLocal
        ? await mergeLocalIntoAccount(local)
        : null;
      try {
        window.localStorage.setItem(flag, "1");
      } catch {
        // Ignore storage failures.
      }
      if (merged) {
        hydrateFromServer(merged);
        // Re-render server components (e.g. the account stats) with the merged data.
        router.refresh();
      }
    })();
  }, [userId, router]);

  return null;
}

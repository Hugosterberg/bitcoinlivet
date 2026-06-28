"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SignOut } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Signs out on the client (clears the cookie synchronously), then does a
 * full-page navigation to "/". The hard reload makes SSR and the header read
 * the cleared session.
 */
export function SignOutButton() {
  const t = useTranslations("account");
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    if (isSupabaseConfigured) {
      await createClient().auth.signOut();
    }
    window.location.assign("/");
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="h-10 rounded-full px-5 text-sm"
      disabled={pending}
      onClick={handleSignOut}
    >
      <SignOut weight="bold" aria-hidden />
      {pending ? t("signingOut") : t("signOut")}
    </Button>
  );
}

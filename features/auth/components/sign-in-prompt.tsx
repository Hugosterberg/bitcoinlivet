"use client";

import Link from "next/link";
import { FloppyDisk, UserCirclePlus, SignIn, Trophy } from "@phosphor-icons/react";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { useAuthUser } from "@/features/auth/components/use-auth-user";

/**
 * Calm, on-brand nudge shown on the education pages to signed-out visitors:
 * create an account (or log in) so XP and completed lessons are saved across
 * devices. Renders nothing when signed in, still loading, or when Supabase
 * isn't configured — so it never flickers or nags logged-in users.
 */
export function SignInPrompt() {
  const { signedIn, loading } = useAuthUser();

  if (!isSupabaseConfigured || loading || signedIn) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-bitcoin/25 bg-graphite p-6 sm:p-7">
      <div
        aria-hidden
        className="absolute right-[-12%] top-[-60%] h-56 w-56 rounded-full bg-bitcoin/15 blur-[90px]"
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-bitcoin-muted text-bitcoin">
            <FloppyDisk size={22} weight="fill" aria-hidden />
          </span>
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Spara dina poäng och avklarade kurser
            </h2>
            <p className="mt-1 max-w-xl text-pretty text-sm/6 text-muted-foreground">
              Skapa ett konto eller logga in så sparas din XP, dina märken och
              dina genomförda lektioner, så att du kan fortsätta där du slutade
              på alla dina enheter.
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <li className="inline-flex items-center gap-1.5">
                <Trophy size={14} weight="fill" className="text-bitcoin" aria-hidden />
                XP och märken sparade
              </li>
              <li className="inline-flex items-center gap-1.5">
                <FloppyDisk size={14} weight="fill" className="text-bitcoin" aria-hidden />
                Synkas mellan enheter
              </li>
            </ul>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            href="/konto"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-bitcoin px-5 text-sm font-semibold text-bitcoin-foreground transition-opacity hover:opacity-90"
          >
            <UserCirclePlus size={17} weight="fill" aria-hidden />
            Skapa konto
          </Link>
          <Link
            href="/konto"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-bitcoin/50 hover:text-bitcoin"
          >
            <SignIn size={17} weight="bold" aria-hidden />
            Logga in
          </Link>
        </div>
      </div>
    </div>
  );
}

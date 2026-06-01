import type { Metadata } from "next";
import Link from "next/link";
import { UserCircle, GraduationCap, ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/ui/disclaimer";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/features/auth/data/session";
import { loadServerProgress } from "@/features/education/data/progress-sync";
import { AccountStats } from "@/features/education/components/account-stats";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AccountSync } from "@/features/auth/components/account-sync";
import { SignOutButton } from "@/features/auth/components/sign-out-button";

export const metadata: Metadata = {
  title: "Konto",
  description:
    "Logga in för att spara din kursprogression och fortsätta där du slutade, på alla dina enheter.",
  alternates: { canonical: "/konto" },
  robots: { index: false },
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  const progress = user ? await loadServerProgress() : null;

  return (
    <div className="py-14 sm:py-20">
      <Container className="max-w-2xl">
        <header className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
            Ditt konto
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {user ? "Inloggad" : "Logga in eller skapa konto"}
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            Med ett konto sparas din kursprogression, XP och dina märken så att
            du kan fortsätta där du slutade, på vilken enhet du vill.
          </p>
        </header>

        <div className="mt-10">
          {!isSupabaseConfigured ? (
            <Card className="p-6 text-sm/6 text-muted-foreground">
              Inloggning är inte aktiverad ännu. Din progression sparas så länge
              lokalt i den här webbläsaren. Se{" "}
              <code className="text-foreground">docs/SUPABASE.md</code> för att
              aktivera konton.
            </Card>
          ) : user ? (
            <>
              <Card className="p-6 sm:p-8">
                {/* Merge anonymous localStorage progress into the account once. */}
                <AccountSync userId={user.id} />

                <div className="flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-bitcoin-muted text-bitcoin">
                    <UserCircle size={26} weight="fill" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Inloggad som</p>
                    <p className="truncate font-heading text-lg font-semibold tracking-tight text-foreground">
                      {user.email ?? "ditt konto"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button asChild className="h-10 rounded-full px-5 text-sm">
                    <Link href="/utbildning">
                      <GraduationCap weight="bold" aria-hidden />
                      Till Bitcoinskolan
                      <ArrowRight weight="bold" aria-hidden />
                    </Link>
                  </Button>
                  <SignOutButton />
                </div>
              </Card>

              {progress ? <AccountStats data={progress} /> : null}
            </>
          ) : (
            <AuthForm />
          )}
        </div>

        <Disclaimer className="mt-12">
          Vi sparar bara det som behövs för din inlärning. bitcoinlivet erbjuder
          utbildning, inte finansiell rådgivning.
        </Disclaimer>
      </Container>
    </div>
  );
}

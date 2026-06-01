import type { Metadata } from "next";
import Link from "next/link";
import { LockKey, Warning } from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/features/auth/data/session";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Återställ lösenord",
  description: "Välj ett nytt lösenord för ditt bitcoinlivet-konto.",
  alternates: { canonical: "/aterstall" },
  robots: { index: false },
};

export default async function ResetPage() {
  // The auth callback established a recovery session before redirecting here.
  const user = await getCurrentUser();

  return (
    <div className="py-14 sm:py-20">
      <Container className="max-w-2xl">
        <header className="mx-auto max-w-md text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-bitcoin-muted text-bitcoin">
            <LockKey size={24} weight="fill" aria-hidden />
          </span>
          <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Välj ett nytt lösenord
          </h1>
          <p className="mt-4 text-pretty text-base/7 text-muted-foreground">
            Skriv in ditt nya lösenord nedan, så loggar vi in dig direkt.
          </p>
        </header>

        <div className="mt-10">
          {user ? (
            <ResetPasswordForm />
          ) : (
            <Card className="mx-auto max-w-md p-6 text-center text-sm/6 text-muted-foreground">
              <Warning
                size={22}
                weight="fill"
                aria-hidden
                className="mx-auto mb-3 text-amber-400"
              />
              Länken är ogiltig eller har gått ut. Be om en ny
              återställningslänk från{" "}
              <Link href="/konto" className="font-medium text-bitcoin hover:underline">
                inloggningssidan
              </Link>
              .
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}

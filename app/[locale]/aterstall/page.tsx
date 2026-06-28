import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LockKey, Warning } from "@phosphor-icons/react/dist/ssr";

import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/features/auth/data/session";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return {
    title: t("resetPageMetaTitle"),
    description: t("resetPageMetaDesc"),
    alternates: { canonical: "/aterstall" },
    robots: { index: false },
  };
}

export default async function ResetPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
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
            {t("resetPageTitle")}
          </h1>
          <p className="mt-4 text-pretty text-base/7 text-muted-foreground">
            {t("resetPageLead")}
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
              {t("resetLinkInvalid")}
              <Link href="/konto" className="font-medium text-bitcoin hover:underline">
                {t("resetSignInPage")}
              </Link>
              .
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { UserCircle, GraduationCap, ArrowRight } from "@phosphor-icons/react/dist/ssr";

import type { Locale } from "@/i18n/routing";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: { canonical: "/konto" },
    robots: { index: false },
  };
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account");
  const user = await getCurrentUser();
  const progress = user ? await loadServerProgress() : null;

  return (
    <div className="py-14 sm:py-20">
      <Container className="max-w-2xl">
        <header className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {user ? t("loggedIn") : t("signInOrCreate")}
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            {t("lead")}
          </p>
        </header>

        <div className="mt-10">
          {!isSupabaseConfigured ? (
            <Card className="p-6 text-sm/6 text-muted-foreground">
              {t("notEnabled")}{" "}
              <code className="text-foreground">docs/SUPABASE.md</code>
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
                    <p className="text-sm text-muted-foreground">{t("loggedInAs")}</p>
                    <p className="font-heading text-lg font-semibold tracking-tight text-foreground break-all">
                      {user.email ?? t("yourAccount")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button asChild className="h-10 rounded-full px-5 text-sm">
                    <Link href="/utbildning">
                      <GraduationCap weight="bold" aria-hidden />
                      {t("toSchool")}
                      <ArrowRight weight="bold" aria-hidden />
                    </Link>
                  </Button>
                  <SignOutButton />
                </div>
              </Card>

              {progress ? <AccountStats data={progress} locale={locale} /> : null}
            </>
          ) : (
            <AuthForm />
          )}
        </div>

        <Disclaimer className="mt-12">
          {t("disclaimer")}
        </Disclaimer>
      </Container>
    </div>
  );
}

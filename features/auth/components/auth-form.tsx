"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Warning,
  EnvelopeSimple,
  LockKey,
  Eye,
  EyeSlash,
  SignIn,
  UserCirclePlus,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isValidEmail } from "@/features/newsletter/types";
import { recordSignupConsent } from "@/features/auth/data/actions";
import { trackEvent } from "@/lib/analytics/track";

type Tab = "in" | "up";

const fieldBase =
  "h-12 w-full rounded-xl border border-input bg-background/80 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-bitcoin/40 focus-visible:border-bitcoin/70 focus-visible:ring-2 focus-visible:ring-bitcoin/25";

const iconClass =
  "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-bitcoin";

const submitClass =
  "rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bitcoin/30 active:translate-y-0";

export function AuthForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [tab, setTab] = useState<Tab>("in");
  const [resetView, setResetView] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pending, setPending] = useState(false);

  function switchTab(next: Tab) {
    setTab(next);
    setResetView(false);
    setError("");
    setInfo("");
  }

  function showReset(next: boolean) {
    setResetView(next);
    setError("");
    setInfo("");
  }

  async function handleResetRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");

    const email = String(event.currentTarget.email.value ?? "").trim().toLowerCase();
    if (!isSupabaseConfigured) {
      setError(t("errNotEnabled"));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t("errCheckEmail"));
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/aterstall`,
    });
    setPending(false);
    if (resetError) {
      setError(t("errResetFailed"));
      return;
    }
    // Always show success (don't reveal whether the address exists).
    setInfo(t("resetSent"));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");

    const form = event.currentTarget;
    const email = String(form.email.value ?? "").trim().toLowerCase();
    const password = String(form.password.value ?? "");

    // Honeypot — a bot filled the hidden field; silently ignore.
    const honeypot = (form.elements.namedItem("company") as HTMLInputElement | null)?.value;
    if (honeypot && honeypot.length > 0) return;

    if (!isSupabaseConfigured) {
      setError(t("errNotEnabled"));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t("errCheckEmail"));
      return;
    }

    setPending(true);
    // Auth runs on the client so the session cookie is written synchronously,
    // then a full-page navigation lets SSR + header read it.
    const supabase = createClient();

    if (tab === "in") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(t("errWrongCredentials"));
        setPending(false);
        return;
      }
      trackEvent("login", { method: "password" });
      window.location.assign("/konto");
      return;
    }

    // Sign up
    if (password.length < 8) {
      setError(t("errPwTooShort"));
      setPending(false);
      return;
    }
    const consent = Boolean(
      (form.elements.namedItem("marketing_consent") as HTMLInputElement | null)
        ?.checked,
    );

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // If email confirmation is on, the link routes through our callback on
        // the current domain (not Supabase's Site URL), so it works in prod.
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/konto`,
        data: {
          marketing_consent: consent,
          marketing_consent_at: consent ? new Date().toISOString() : null,
          preferred_language: locale,
        },
      },
    });
    if (signUpError) {
      setError(t("errSignupFailed"));
      setPending(false);
      return;
    }

    trackEvent("sign_up", { method: "password", marketing_consent: consent });

    if (consent) {
      await recordSignupConsent(email);
    }

    if (!data.session) {
      // Email confirmation is on → no session yet.
      setInfo(t("confirmEmail"));
      setPending(false);
      return;
    }

    window.location.assign("/konto");
  }

  const alerts = (
    <>
      {error ? (
        <p
          role="alert"
          className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 duration-300 animate-in fade-in slide-in-from-top-1"
        >
          <Warning size={16} weight="fill" aria-hidden />
          {error}
        </p>
      ) : null}
      {info ? (
        <p
          role="status"
          className="inline-flex items-center gap-2 text-sm font-medium text-bitcoin duration-300 animate-in fade-in slide-in-from-top-1"
        >
          <EnvelopeSimple size={16} weight="fill" aria-hidden />
          {info}
        </p>
      ) : null}
    </>
  );

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-border bg-graphite/60 p-6 shadow-xl shadow-black/20 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-bitcoin/15 blur-3xl"
      />

      <div className="relative">
        {resetView ? (
          <div className="text-center">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">{t("resetTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("resetLead")}
            </p>

            <form onSubmit={handleResetRequest} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="reset-email" className="text-sm font-medium text-foreground">
                  {t("emailLabel")}
                </label>
                <div className="group relative">
                  <EnvelopeSimple size={18} aria-hidden className={iconClass} />
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={t("emailPlaceholder")}
                    className={cn(fieldBase, "pl-11 pr-4")}
                  />
                </div>
              </div>

              {alerts}

              <Button
                type="submit"
                size="xl"
                className={submitClass}
                disabled={pending}
              >
                {pending ? t("sending") : t("sendResetLink")}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => showReset(false)}
              className="mt-5 cursor-pointer text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-bitcoin"
            >{t("backToSignIn")}</button>
          </div>
        ) : (
          <>
            <div
              role="tablist"
              aria-label={t("tablistLabel")}
              className="grid grid-cols-2 gap-1 rounded-full border border-border bg-background/60 p-1"
            >
              {(
                [
                  ["in", t("signIn")],
                  ["up", t("signUp")],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  role="tab"
                  type="button"
                  aria-selected={tab === value}
                  onClick={() => switchTab(value)}
                  className={cn(
                    "h-10 cursor-pointer rounded-full text-sm font-medium transition-all duration-200",
                    tab === value
                      ? "bg-bitcoin text-bitcoin-foreground shadow-lg shadow-bitcoin/25"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              {/* Honeypot — hidden from people, catches bots. */}
              <div aria-hidden className="pointer-events-none absolute left-[-9999px] opacity-0">
                <label>{t("leaveEmpty")}<input type="text" name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="auth-email" className="text-sm font-medium text-foreground">
                  {t("emailLabel")}
                </label>
                <div className="group relative">
                  <EnvelopeSimple size={18} aria-hidden className={iconClass} />
                  <input
                    id="auth-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={t("emailPlaceholder")}
                    className={cn(fieldBase, "pl-11 pr-4")}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="auth-password" className="text-sm font-medium text-foreground">{t("passwordLabel")}</label>
                <div className="group relative">
                  <LockKey size={18} aria-hidden className={iconClass} />
                  <input
                    id="auth-password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    required
                    minLength={tab === "up" ? 8 : undefined}
                    autoComplete={tab === "up" ? "new-password" : "current-password"}
                    placeholder={tab === "up" ? t("pwPlaceholderSignup") : t("pwPlaceholderSignin")}
                    className={cn(fieldBase, "pl-11 pr-12")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? t("hidePassword") : t("showPassword")}
                    className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {showPw ? (
                      <EyeSlash size={18} aria-hidden />
                    ) : (
                      <Eye size={18} aria-hidden />
                    )}
                  </button>
                </div>
              </div>

              {tab === "up" ? (
                <label className="group flex cursor-pointer items-start gap-3 text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <input
                    type="checkbox"
                    name="marketing_consent"
                    className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-input bg-background text-bitcoin accent-bitcoin focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span>
                    {t("marketingConsent")}
                  </span>
                </label>
              ) : null}

              {alerts}

              <Button
                type="submit"
                size="xl"
                className={submitClass}
                disabled={pending}
              >
                {pending ? (
                  t("oneMoment")
                ) : tab === "in" ? (
                  <>
                    <SignIn size={18} weight="bold" aria-hidden />
                    {t("signIn")}
                  </>
                ) : (
                  <>
                    <UserCirclePlus size={18} weight="fill" aria-hidden />
                    {t("signUp")}
                  </>
                )}
              </Button>
            </form>

            {tab === "in" ? (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => showReset(true)}
                  className="cursor-pointer text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-bitcoin"
                >{t("forgotPassword")}</button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

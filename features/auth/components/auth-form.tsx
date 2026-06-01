"use client";

import { useState, type FormEvent } from "react";
import { Warning, EnvelopeSimple } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isValidEmail } from "@/features/newsletter/types";
import { recordSignupConsent } from "@/features/auth/data/actions";

type Tab = "in" | "up";

export function AuthForm() {
  const [tab, setTab] = useState<Tab>("in");
  const [resetView, setResetView] = useState(false);
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
      setError("Inloggning är inte aktiverad ännu (se docs/SUPABASE.md).");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Kontrollera e-postadressen.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/aterstall`,
    });
    setPending(false);
    if (resetError) {
      setError("Kunde inte skicka återställningslänk. Försök igen.");
      return;
    }
    // Always show success (don't reveal whether the address exists).
    setInfo("Om adressen finns hos oss har vi skickat en återställningslänk.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");

    const form = event.currentTarget;
    const email = String(form.email.value ?? "").trim().toLowerCase();
    const password = String(form.password.value ?? "");

    if (!isSupabaseConfigured) {
      setError("Inloggning är inte aktiverad ännu (se docs/SUPABASE.md).");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Kontrollera e-postadressen.");
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
        setError("Fel e-post eller lösenord.");
        setPending(false);
        return;
      }
      window.location.assign("/konto");
      return;
    }

    // Sign up
    if (password.length < 8) {
      setError("Lösenordet måste vara minst 8 tecken.");
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
        data: {
          marketing_consent: consent,
          marketing_consent_at: consent ? new Date().toISOString() : null,
        },
      },
    });
    if (signUpError) {
      setError("Kunde inte skapa konto. Försök igen.");
      setPending(false);
      return;
    }

    if (consent) {
      await recordSignupConsent(email);
    }

    if (!data.session) {
      // Email confirmation is on → no session yet.
      setInfo("Konto skapat. Bekräfta din e-post för att logga in.");
      setPending(false);
      return;
    }

    window.location.assign("/konto");
  }

  if (resetView) {
    return (
      <div className="mx-auto w-full max-w-md text-center">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          Återställ lösenord
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Skriv in din e-postadress, så skickar vi en länk för att välja ett nytt
          lösenord.
        </p>

        <form onSubmit={handleResetRequest} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="reset-email" className="text-sm font-medium text-foreground">
              E-postadress
            </label>
            <input
              id="reset-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="din@epost.se"
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-400"
            >
              <Warning size={16} weight="fill" aria-hidden />
              {error}
            </p>
          ) : null}

          {info ? (
            <p
              role="status"
              className="inline-flex items-center gap-2 text-sm font-medium text-bitcoin"
            >
              <EnvelopeSimple size={16} weight="fill" aria-hidden />
              {info}
            </p>
          ) : null}

          <Button type="submit" size="xl" className="rounded-xl" disabled={pending}>
            {pending ? "Skickar …" : "Skicka återställningslänk"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => showReset(false)}
          className="mt-5 text-sm font-medium text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
        >
          Tillbaka till inloggning
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div
        role="tablist"
        aria-label="Logga in eller skapa konto"
        className="grid grid-cols-2 gap-1 rounded-full border border-border bg-card p-1"
      >
        {(
          [
            ["in", "Logga in"],
            ["up", "Skapa konto"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            role="tab"
            type="button"
            aria-selected={tab === value}
            onClick={() => switchTab(value)}
            className={`h-10 rounded-full text-sm font-medium transition-colors ${
              tab === value
                ? "bg-bitcoin text-bitcoin-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="auth-email" className="text-sm font-medium text-foreground">
            E-postadress
          </label>
          <input
            id="auth-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="din@epost.se"
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="auth-password"
            className="text-sm font-medium text-foreground"
          >
            Lösenord
          </label>
          <input
            id="auth-password"
            name="password"
            type="password"
            required
            minLength={tab === "up" ? 8 : undefined}
            autoComplete={tab === "up" ? "new-password" : "current-password"}
            placeholder={tab === "up" ? "Minst 8 tecken" : "Ditt lösenord"}
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {tab === "up" ? (
          <label className="flex cursor-pointer items-start gap-3 text-left text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="marketing_consent"
              className="mt-0.5 size-4 shrink-0 rounded border-input bg-background text-bitcoin accent-bitcoin focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span>
              Ja, bitcoinlivet får skicka mig nyheter och uppdateringar om
              plattformen via e-post. Du kan avregistrera dig när som helst.
            </span>
          </label>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-400"
          >
            <Warning size={16} weight="fill" aria-hidden />
            {error}
          </p>
        ) : null}

        {info ? (
          <p
            role="status"
            className="inline-flex items-center gap-2 text-sm font-medium text-bitcoin"
          >
            <EnvelopeSimple size={16} weight="fill" aria-hidden />
            {info}
          </p>
        ) : null}

        <Button type="submit" size="xl" className="rounded-xl" disabled={pending}>
          {pending ? "Ett ögonblick …" : tab === "in" ? "Logga in" : "Skapa konto"}
        </Button>
      </form>

      {tab === "in" ? (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => showReset(true)}
            className="text-sm font-medium text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
          >
            Glömt lösenord?
          </button>
        </div>
      ) : null}
    </div>
  );
}

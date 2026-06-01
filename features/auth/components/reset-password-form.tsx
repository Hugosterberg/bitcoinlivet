"use client";

import { useState, type FormEvent } from "react";
import { Warning, LockKey, Eye, EyeSlash } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/features/auth/data/actions";

const fieldBase =
  "h-12 w-full rounded-xl border border-input bg-background/80 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-bitcoin/40 focus-visible:border-bitcoin/70 focus-visible:ring-2 focus-visible:ring-bitcoin/25";
const iconClass =
  "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-bitcoin";

/**
 * Sets a new password. Shown on /aterstall after the user follows a reset link
 * (the auth callback established a recovery session). On success it does a
 * full-page navigation to /konto so the header reflects the logged-in state.
 */
export function ResetPasswordForm() {
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const password = String(form.password.value ?? "");
    const confirm = String(form.confirm.value ?? "");

    if (password.length < 8) {
      setError("Lösenordet måste vara minst 8 tecken.");
      return;
    }
    if (password !== confirm) {
      setError("Lösenorden matchar inte.");
      return;
    }

    setPending(true);
    const result = await updatePassword(password);
    if (!result.ok) {
      setError(result.error ?? "Något gick fel.");
      setPending(false);
      return;
    }
    window.location.assign("/konto");
  }

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-border bg-graphite/60 p-6 shadow-xl shadow-black/20 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-bitcoin/15 blur-3xl"
      />
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Nytt lösenord
          </label>
          <div className="group relative">
            <LockKey size={18} aria-hidden className={iconClass} />
            <input
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Minst 8 tecken"
              className={cn(fieldBase, "pl-11 pr-12")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Dölj lösenord" : "Visa lösenord"}
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {showPw ? <EyeSlash size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="confirm" className="text-sm font-medium text-foreground">
            Bekräfta lösenord
          </label>
          <div className="group relative">
            <LockKey size={18} aria-hidden className={iconClass} />
            <input
              id="confirm"
              name="confirm"
              type={showPw ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Upprepa lösenordet"
              className={cn(fieldBase, "pl-11 pr-4")}
            />
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 duration-300 animate-in fade-in slide-in-from-top-1"
          >
            <Warning size={16} weight="fill" aria-hidden />
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="xl"
          className="rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bitcoin/30 active:translate-y-0"
          disabled={pending}
        >
          {pending ? "Sparar …" : "Spara nytt lösenord"}
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { Warning } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { updatePassword } from "@/features/auth/data/actions";

/**
 * Sets a new password. Shown on /aterstall after the user follows a reset link
 * (the auth callback established a recovery session). On success it does a
 * full-page navigation to /konto so the header reflects the logged-in state.
 */
export function ResetPasswordForm() {
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
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Nytt lösenord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Minst 8 tecken"
          className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor="confirm" className="text-sm font-medium text-foreground">
          Bekräfta lösenord
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Upprepa lösenordet"
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

      <Button type="submit" size="xl" className="rounded-xl" disabled={pending}>
        {pending ? "Sparar …" : "Spara nytt lösenord"}
      </Button>
    </form>
  );
}

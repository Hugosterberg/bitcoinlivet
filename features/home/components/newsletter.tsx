"use client";

import { useActionState } from "react";
import { EnvelopeSimple, CheckCircle, Warning } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { subscribeToNewsletter } from "@/features/newsletter/data/subscribe";
import { initialSubscribeState } from "@/features/newsletter/types";

export function Newsletter() {
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initialSubscribeState,
  );

  const subscribed = state.status === "ok";
  const errored =
    state.status === "invalid" ||
    state.status === "error" ||
    state.status === "unconfigured";

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-graphite px-6 py-12 sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="absolute right-[-10%] top-[-40%] h-72 w-72 rounded-full bg-bitcoin/15 blur-[100px]"
          />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-bitcoin-muted text-bitcoin">
              <EnvelopeSimple size={24} weight="bold" aria-hidden />
            </span>
            <h2 className="mt-6 text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Häng med när sidan växer
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base/7 text-muted-foreground">
              Skriv upp dig på listan, så hör jag av mig när jag lägger till nya
              funktioner eller annat viktigt och hjälpsamt här. Det blir sällan,
              inget spam och ingen hype, och du kan avregistrera dig när du vill.
            </p>

            {subscribed ? (
              <p
                role="status"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-bitcoin/30 bg-bitcoin-muted px-4 py-2.5 text-sm font-medium text-bitcoin"
              >
                <CheckCircle size={18} weight="fill" aria-hidden />
                {state.message}
              </p>
            ) : (
              <form
                action={formAction}
                className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  E-postadress
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  placeholder="din@epost.se"
                  aria-invalid={errored || undefined}
                  className="h-12 w-full rounded-full border border-input bg-background px-5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button
                  type="submit"
                  size="xl"
                  className="rounded-full"
                  disabled={pending}
                >
                  {pending ? "Skriver upp …" : "Skriv upp mig"}
                </Button>
              </form>
            )}

            {errored ? (
              <p
                role="alert"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-400"
              >
                <Warning size={16} weight="fill" aria-hidden />
                {state.message}
              </p>
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                Vi sparar bara din e-postadress för utskicken. Detta är inte
                finansiell rådgivning.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

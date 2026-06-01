"use client";

import { useActionState, useEffect } from "react";
import { EnvelopeSimple, CheckCircle, Warning } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { subscribeToNewsletter } from "@/features/newsletter/data/subscribe";
import { initialSubscribeState } from "@/features/newsletter/types";
import { trackEvent } from "@/lib/analytics/track";

export function Newsletter() {
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initialSubscribeState,
  );

  const subscribed = state.status === "ok";

  useEffect(() => {
    if (state.status === "ok") {
      trackEvent("newsletter_subscribe", { location: "home" });
    }
  }, [state.status]);
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
                {/* Honeypot — hidden from people, catches bots. */}
                <div aria-hidden className="pointer-events-none absolute left-[-9999px] opacity-0">
                  <label>
                    Lämna tomt
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <label htmlFor="newsletter-email" className="sr-only">
                  E-postadress
                </label>
                <div className="group relative w-full">
                  <EnvelopeSimple
                    size={18}
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-bitcoin"
                  />
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    placeholder="din@epost.se"
                    aria-invalid={errored || undefined}
                    className="h-12 w-full rounded-full border border-input bg-background pl-11 pr-5 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-bitcoin/40 focus-visible:border-bitcoin/70 focus-visible:ring-2 focus-visible:ring-bitcoin/25"
                  />
                </div>
                <Button
                  type="submit"
                  size="xl"
                  className="rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bitcoin/30 active:translate-y-0"
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
                Din e-postadress sparas endast för utskick om nytt som händer på bitcoinlivet som du kan tänkas vilja veta om.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

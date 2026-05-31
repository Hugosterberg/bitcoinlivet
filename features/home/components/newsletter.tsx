"use client";

import { useState, type FormEvent } from "react";
import { EnvelopeSimple, CheckCircle } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO(newsletter): connect to a real email provider (e.g. an API route).
    if (!email) return;
    setSubmitted(true);
  }

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

            {submitted ? (
              <p
                role="status"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-bitcoin/30 bg-bitcoin-muted px-4 py-2.5 text-sm font-medium text-bitcoin"
              >
                <CheckCircle size={18} weight="fill" aria-hidden />
                Tack! Du är med på listan (demo).
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  E-postadress
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.se"
                  className="h-12 w-full rounded-full border border-input bg-background px-5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button type="submit" size="xl" className="rounded-full">
                  Skriv upp mig
                </Button>
              </form>
            )}

            <p className="mt-4 text-xs text-muted-foreground">
              Platshållare för anmälningslistan. Detta är inte finansiell
              rådgivning.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

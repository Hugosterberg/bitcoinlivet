import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { GlossaryExplorer } from "@/components/glossary/glossary-explorer";
import { sortedGlossary } from "@/lib/glossary";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ordlista: Bitcoinbegrepp förklarade",
  description:
    "En lugn ordlista över Bitcoinbegrepp på svenska: sats, halvering, UTXO, cold storage, köpkraft, sunda pengar och mer, enkelt förklarat utan hype.",
  alternates: { canonical: "/ordlista" },
  openGraph: {
    title: "Ordlista · Bitcoinlivet",
    description:
      "Bitcoinbegrepp förklarade på svenska, sats, halvering, UTXO, köpkraft och mer.",
    url: "/ordlista",
    type: "website",
  },
};

export default function GlossaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Bitcoinordlista",
    url: `${siteConfig.url}/ordlista`,
    hasDefinedTerm: sortedGlossary.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
    })),
  };

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
            Ordlista
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Bitcoinbegrepp, förklarade
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            Stöter du på ett ord du inte känner igen? Här samlar vi begreppen
            kring Bitcoin, sparande och pengar, från de vanligaste till de mest
            tekniska. Filtrera på nivå så hittar du det som är värt att läsa
            just för dig.
          </p>
        </header>

        <div className="mt-10">
          <GlossaryExplorer terms={sortedGlossary} />
        </div>

        <Card className="mt-14 flex flex-col gap-3 p-6 sm:p-8">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            Vill du lära dig steg för steg?
          </h2>
          <p className="max-w-2xl text-base/7 text-muted-foreground">
            Ordlistan är ett uppslagsverk. För en sammanhängande resa från
            nybörjare till trygg, prova den interaktiva Bitcoinskolan.
          </p>
          <Link
            href="/utbildning"
            className="text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
          >
            Till Bitcoinskolan
          </Link>
        </Card>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

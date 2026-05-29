import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  GraduationCap,
  ShieldCheck,
  InstagramLogo,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/ui/disclaimer";
import { TipJar } from "@/components/sections/tip-jar";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Om Bitcoinlivet",
  description:
    "Bitcoinlivet är en svensk, hypefri guide till Bitcoin, sparande och köpkraft. Här är vårt uppdrag och vår syn på sundare pengar.",
  alternates: { canonical: "/om" },
  openGraph: {
    title: "Om Bitcoinlivet",
    description:
      "En svensk, hypefri guide till Bitcoin, sparande och köpkraft.",
    url: "/om",
    type: "website",
  },
};

const focusAreas = [
  {
    icon: GraduationCap,
    title: "Utbildning först",
    description:
      "Vi förklarar grunderna ordentligt så att du kan fatta egna, lugna beslut, inte följa andras.",
  },
  {
    icon: Compass,
    title: "Långsiktigt perspektiv",
    description:
      "Vi tänker i år och decennier. Sparande och sundare pengar handlar om tålamod, inte tajming.",
  },
  {
    icon: ShieldCheck,
    title: "Utan hype",
    description:
      "Inga prisprognoser, inga heta tips. Vi håller oss till principer som står sig över tid.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-14 sm:py-20">
      <Container className="max-w-4xl">
        {/* Intro */}
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
            Om oss
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Sundare pengar, förklarat på svenska
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            Bitcoinlivet är en svensk plattform för dig som är nyfiken på Bitcoin
            men trött på hype, säljsnack och kortsiktigt brus. Vi förklarar
            Bitcoin, sparande, inflation och köpkraft, lugnt, sakligt och i din
            egen takt.
          </p>
        </header>

        {/* Mission */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Vårt uppdrag
          </h2>
          <div className="mt-5 space-y-5 text-base/7 text-muted-foreground">
            <p>
              Vårt mål är enkelt: att göra Bitcoin begripligt utan att förenkla
              för mycket. Vi tror att fler fattar bättre ekonomiska beslut när de
              förstår hur pengar fungerar, varför de tappar värde över tid, vad
              köpkraft egentligen är, och varför ett begränsat utbud spelar roll.
            </p>
            <p>
              Vi säljer ingenting och ger inga råd om köp eller försäljning.
              Istället bygger vi verktyg, grafer och guider som hjälper dig att
              tänka själv.
            </p>
          </div>
        </section>

        {/* Educational focus */}
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Vad vi fokuserar på
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {focusAreas.map((area) => (
              <Card key={area.title} className="p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-bitcoin-muted text-bitcoin">
                  <area.icon size={22} weight="bold" aria-hidden />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight text-foreground">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm/6 text-muted-foreground">
                  {area.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Bitcoin matters */}
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Varför Bitcoin är värt att förstå
          </h2>
          <div className="mt-5 space-y-5 text-base/7 text-muted-foreground">
            <p>
              Vanliga pengar kan skapas i obegränsad mängd. Det är en av de
              främsta anledningarna till att din köpkraft urholkas över tid.
              Bitcoin gör något ovanligt: utbudet är fast, det kommer aldrig att
              finnas mer än 21 miljoner.
            </p>
            <p>
              Man behöver inte vara övertygad för att tycka att idén är värd att
              förstå. Att begripa knapphet, inflation och tid gör dig till en
              klokare sparare oavsett vad du till slut väljer att göra.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="h-10 rounded-full px-5 text-sm">
              <Link href="/blog">
                Läs guiderna
                <ArrowRight weight="bold" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10 rounded-full px-5 text-sm">
              <Link href="/data">Se Bitcoindata</Link>
            </Button>
          </div>
        </section>

        {/* Creator section placeholder */}
        <section className="mt-16">
          <Card className="overflow-hidden">
            <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
              {/* TODO(instagram): byt ut platshållaren mot en riktig porträttbild och bio från @bitcoinlivet. */}
              <div
                aria-hidden
                className="grid size-20 place-items-center rounded-2xl bg-bitcoin font-heading text-3xl font-bold text-bitcoin-foreground"
              >
                ₿
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                  Personen bakom Bitcoinlivet
                </h2>
                <p className="mt-2 max-w-2xl text-sm/6 text-muted-foreground">
                  {/* TODO(instagram): infoga en kort, personlig presentation baserad på @bitcoinlivet. */}
                  Bitcoinlivet drivs av en svensk Bitcoin-entusiast med ett mål:
                  att dela kunskap lugnt och begripligt. Innehållet bygger vidare
                  på samma idéer som delas på Instagram, fördjupat och samlat på
                  ett ställe.
                </p>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-bitcoin/50 hover:text-bitcoin"
                >
                  <InstagramLogo size={18} weight="fill" aria-hidden />
                  Följ {siteConfig.instagramHandle}
                </a>
              </div>
            </div>
          </Card>
        </section>

        {/* Lightning tip jar */}
        <section className="mt-16">
          <TipJar />
        </section>

        <Disclaimer className="mt-12">
          Bitcoinlivet erbjuder utbildning, inte finansiell rådgivning. Gör
          alltid din egen research innan du fattar ekonomiska beslut.
        </Disclaimer>
      </Container>
    </div>
  );
}

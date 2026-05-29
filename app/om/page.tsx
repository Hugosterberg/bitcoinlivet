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
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Om bitcoinlivet",
  description:
    "bitcoinlivet är en svensk, hypefri guide till Bitcoin, sparande och köpkraft. Här berättar jag om min resa och varför jag tror på sundare pengar.",
  alternates: { canonical: "/om" },
  openGraph: {
    title: "Om bitcoinlivet",
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
      "Jag förklarar grunderna ordentligt så att du kan fatta egna, lugna beslut, inte följa andras.",
  },
  {
    icon: Compass,
    title: "Långsiktigt perspektiv",
    description:
      "Jag tänker i år och decennier. Sparande och sundare pengar handlar om tålamod, inte tajming.",
  },
  {
    icon: ShieldCheck,
    title: "Utan hype",
    description:
      "Inga prisprognoser, inga heta tips. Jag håller mig till principer som står sig över tid.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-14 sm:py-20">
      <Container className="max-w-4xl">
        {/* Intro */}
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
            Om mig
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Sundare pengar, förklarat på svenska
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            bitcoinlivet är jag, en svensk som är nyfiken på Bitcoin men less på
            hype, säljsnack och kortsiktigt brus. Här förklarar jag Bitcoin,
            sparande, inflation och köpkraft, lugnt, sakligt och i din egen takt.
          </p>
        </header>

        {/* Mission */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Mitt mål
          </h2>
          <div className="mt-5 space-y-5 text-base/7 text-muted-foreground">
            <p>
              Mitt mål är enkelt: att göra Bitcoin begripligt utan att förenkla
              för mycket. Jag tror att fler fattar bättre ekonomiska beslut när de
              förstår hur pengar fungerar, varför de tappar värde över tid, vad
              köpkraft egentligen är, och varför ett begränsat utbud spelar roll.
            </p>
            <p>
              Jag säljer ingenting och ger inga råd om köp eller försäljning.
              Istället bygger jag verktyg, grafer och guider som hjälper dig att
              tänka själv.
            </p>
          </div>
        </section>

        {/* Educational focus */}
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Vad jag fokuserar på
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

        {/* Creator story */}
        <section className="mt-16">
          <Card className="overflow-hidden">
            <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-start sm:p-8">
              <div
                aria-hidden
                className="grid size-20 place-items-center rounded-2xl bg-bitcoin font-heading text-3xl font-bold text-bitcoin-foreground"
              >
                ₿
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                  Personen bakom bitcoinlivet
                </h2>
                <div className="mt-3 max-w-2xl space-y-4 text-sm/6 text-muted-foreground">
                  <p>
                    Jag är anonym, men jag är en person, inte ett företag.
                    bitcoinlivet är jag: någon som har fastnat för Bitcoin på
                    riktigt och lagt tusentals timmar på att läsa, lyssna och
                    försöka förstå. Jag tror att sundare pengar kan ge mig ett
                    friare liv i det långa loppet, och det är därför sidan heter
                    just bitcoinlivet.
                  </p>
                  <p>
                    Vägen hit var inte spikrak. Jag studerade åt det tekniska
                    hållet och fastnade för ”blockchain”, vilket snabbt ledde mig
                    in i ”krypto”. Som många andra tyckte jag först att Bitcoin
                    var lite gammalt, långsamt och tråkigt, det fanns ju nyare
                    projekt med coolare visioner. Men jag fortsatte läsa, och det
                    tog flera år innan jag kom tillbaka till Bitcoin och förstod
                    det på djupet.
                  </p>
                  <p>
                    När det väl klickade fanns ingen väg tillbaka. Egentligen är
                    det bara två saker som skulle kunna få mig att sluta tro på
                    Bitcoin: att en avgörande egenskap i protokollet ändras,
                    eller att Bitcoin går till noll. Kommer en sådan grundläggande
                    förändring att ske? Det tror jag inte. De stora förändringar
                    jag kan se framför mig handlar om att skydda protokollet mot
                    nya hot, inte om att rucka på det som gör det värdefullt. Och
                    så länge tillräckligt många tycker att det är värt att ha
                    tillgång till, kommer det inte att försvinna.
                  </p>
                  <p>
                    Jag hann spara i Bitcoin i några år innan jag gjorde ett dyrt
                    misstag: jag laddade ner en falsk kopia av en app till min
                    plånbok och blev lurad att lämna ifrån mig min hemliga
                    återställningsfras. Jag förlorade mer än en halv bitcoin och
                    fick börja om från noll. Många runt omkring mig antog att det
                    var där jag skulle inse att Bitcoin var dåligt och sluta. För
                    mig blev det tvärtom. Jag förstod att om pengar ska fungera så
                    bra, och bara ha en enda verklig ägare, så måste de fungera
                    precis så här. Ansvaret att skydda sina nycklar ligger hos en
                    själv, oavsett hur misstaget går till.
                  </p>
                  <p>
                    Det är den resan, med både insikterna och misstagen, som jag
                    vill dela. Lugnt och med fakta och data vill jag visa hur ett
                    liv kan se ut om man sparar i bra pengar i stället för dåliga,
                    och varför jag tror att svaret på bra pengar är Bitcoin. Inte
                    som rådgivning, utan som något jag själv tror på och vill
                    förklara så ärligt jag kan.
                  </p>
                </div>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-bitcoin/50 hover:text-bitcoin"
                >
                  <InstagramLogo size={18} weight="fill" aria-hidden />
                  Följ {siteConfig.instagramHandle}
                </a>
              </div>
            </div>
          </Card>
        </section>

        <Disclaimer className="mt-12">
          bitcoinlivet erbjuder utbildning, inte finansiell rådgivning. Gör
          alltid din egen research innan du fattar ekonomiska beslut.
        </Disclaimer>
      </Container>
    </div>
  );
}

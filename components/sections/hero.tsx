import Link from "next/link";
import { ArrowRight, Lightning } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import { getBitcoinMarket } from "@/lib/live-data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

export async function Hero() {
  const market = await getBitcoinMarket();

  const stats = [
    {
      label: "Maxutbud",
      value: formatNumber(market.maxSupply),
      sub: "bitcoin, för alltid",
    },
    {
      label: "Utgivet hittills",
      value: formatPercent(market.issuedPercent).replace("+", ""),
      sub: `${formatNumber(Math.round(market.circulatingSupply))} BTC`,
    },
    {
      label: market.live ? "Bitcoinpris" : "Exempelpris",
      value: formatCurrency(market.priceSek),
      sub: market.live ? "per bitcoin · live" : "per bitcoin",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="absolute inset-0 bg-grid" />
      <div
        aria-hidden
        className="absolute left-1/2 top-[-20%] h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-bitcoin/15 blur-[120px]"
      />
      <Container className="relative py-20 sm:py-28 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="bitcoin" className="px-3 py-1">
            <Lightning size={14} weight="fill" aria-hidden />
            Svensk Bitcoinutbildning
          </Badge>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Förstå Bitcoin.{" "}
            <span className="text-bitcoin">Tänk långsiktigt.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg/8 text-muted-foreground">
            Bitcoinlivet är en lugn, datadriven guide till Bitcoin, sparande,
            inflation och köpkraft. Inga snabba pengar och ingen hype, bara
            tydliga förklaringar för dig som vill förstå sundare pengar.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="xl" className="rounded-full">
              <Link href="/data">
                Utforska Bitcoindata
                <ArrowRight weight="bold" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="rounded-full"
            >
              <Link href="/blog">Läs guiderna</Link>
            </Button>
          </div>
        </div>

        <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card p-6 text-center">
              <dt className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                {stat.value}
              </dd>
              <dd className="mt-1 text-xs text-muted-foreground">{stat.sub}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { getSiteConfig } from "@/lib/site";
import { HalvingCountdown } from "@/features/bitcoin-data/components/halving-countdown";
import { StatTile } from "@/features/bitcoin-data/components/stat-tile";
import { getBitcoinMarket } from "@/features/bitcoin-data/data/live-data";
import {
  BLOCKS_PER_DAY,
  BLOCKS_PER_HALVING,
  DIFFICULTY_ADJUSTMENT_BLOCKS,
  DIFFICULTY_ADJUSTMENT_DAYS,
  halvingHistory,
  getSupplyTimeline,
  MINUTES_PER_BLOCK,
} from "@/features/bitcoin-data/data/metrics";
import { formatNumber, formatShare } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "halving" });
  const site = getSiteConfig(locale);
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: { canonical: "/halvering" },
    openGraph: {
      title: `${t("ogTitle")} · ${site.name}`,
      description: t("ogDesc"),
      url: "/halvering",
      type: "website",
    },
  };
}

export const revalidate = 300;

export default async function HalvingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("halving");

  const market = await getBitcoinMarket();
  const supply = getSupplyTimeline(
    market.circulatingSupply,
    market.maxSupply,
  );
  const fmtYears = (v: number, decimals = 1) =>
    v.toLocaleString("sv-SE", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            {t("lead")}
          </p>
        </header>

        {/* Live countdown + explainer */}
        <section className="mt-12 grid items-start gap-5 lg:grid-cols-2">
          <HalvingCountdown />
          <Card className="flex flex-col gap-4 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              {t("whatIsTitle")}
            </h2>
            <p className="text-base/7 text-muted-foreground">
              {t("whatIsP1", { blocks: formatNumber(BLOCKS_PER_HALVING) })}
            </p>
            <p className="text-base/7 text-muted-foreground">
              {t("whatIsP2")}
            </p>
            <Link
              href="/artiklar/bitcoin-sunda-pengar"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
            >
              {t("readSoundMoney")}
              <ArrowRight size={15} weight="bold" aria-hidden />
            </Link>
          </Card>
        </section>

        {/* Block & time */}
        <section aria-label={t("blockTimeLabel")} className="mt-5">
          <Card className="p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              {t("blockTimeTitle")}
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {t("blockTimeIntro", { minutes: MINUTES_PER_BLOCK })}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label={t("statTargetTime")}
                value={t("statTargetTimeValue", { minutes: MINUTES_PER_BLOCK })}
                sub={t("statTargetTimeSub")}
              />
              <StatTile
                label={t("statBlocksPerHalving")}
                value={formatNumber(BLOCKS_PER_HALVING)}
                sub={t("statBlocksPerHalvingSub")}
              />
              <StatTile
                label={t("statDifficulty")}
                value={t("statDifficultyValue", { blocks: formatNumber(DIFFICULTY_ADJUSTMENT_BLOCKS) })}
                sub={t("statDifficultySub", { days: DIFFICULTY_ADJUSTMENT_DAYS })}
              />
              <StatTile
                label={t("statBlocksPerDay")}
                value={t("statBlocksPerDayValue", { blocks: BLOCKS_PER_DAY })}
                sub={t("statBlocksPerDaySub", { minutes: MINUTES_PER_BLOCK })}
              />
            </div>

            <div className="mt-6 rounded-xl border border-border/60 bg-background/40 p-4 sm:p-5">
              <h3 className="text-sm font-medium text-foreground">
                {t("whyNotExactTitle")}
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>{t("whyNotExact1", { minutes: MINUTES_PER_BLOCK })}</li>
                <li>{t("whyNotExact2", { days: DIFFICULTY_ADJUSTMENT_DAYS })}</li>
                <li>{t("whyNotExact3")}</li>
              </ul>
            </div>
          </Card>
        </section>

        {/* Current epoch supply */}
        <section aria-label={t("supplyLabel")} className="mt-5">
          <Card className="p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              {t("supplyTitle")}
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {t("supplyIntro", {
                reward: fmtYears(supply.currentReward, 4),
                nextReward: fmtYears(supply.currentReward / 2, 4),
              })}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label={t("statRewardNow")}
                value={`${fmtYears(supply.currentReward, 4)} BTC`}
                sub={t("statRewardNowSub")}
              />
              <StatTile
                label={t("statNewSupplyPerDay")}
                value={t("statNewSupplyPerDayValue", { btc: formatNumber(Math.round(supply.perDay)) })}
                sub={t("statNewSupplyPerDaySub", { blocks: BLOCKS_PER_DAY })}
              />
              <StatTile
                label={t("statIssuedShare")}
                value={formatShare(supply.issuedPercent)}
                sub={t("statIssuedShareSub", {
                  issued: formatNumber(Math.round(market.circulatingSupply)),
                  max: formatNumber(market.maxSupply),
                })}
              />
              <StatTile
                label={t("statRemaining")}
                value={t("statRemainingValue", { btc: formatNumber(Math.round(supply.remaining)) })}
                sub={t("statRemainingSub", { year: supply.lastCoinYear })}
              />
            </div>
          </Card>
        </section>

        {/* History table */}
        <section className="mt-5">
          <Card className="p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              {t("historyTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("historyIntro")}
            </p>

            <div className="mt-6 w-full overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="border-b border-border px-3 py-2 font-semibold">
                      {t("colHalving")}
                    </th>
                    <th className="border-b border-border px-3 py-2 font-semibold">
                      {t("colBlock")}
                    </th>
                    <th className="border-b border-border px-3 py-2 font-semibold">
                      {t("colTime")}
                    </th>
                    <th className="border-b border-border px-3 py-2 text-right font-semibold">
                      {t("colReward")}
                    </th>
                    <th className="border-b border-border px-3 py-2 font-semibold">
                      {t("colStatus")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {halvingHistory.map((event) => (
                    <tr key={event.number} className="align-middle">
                      <td className="border-b border-border px-3 py-3 font-medium text-foreground">
                        {event.number === 0 ? t("genesis") : `#${event.number}`}
                      </td>
                      <td className="border-b border-border px-3 py-3 tabular-nums text-muted-foreground">
                        {formatNumber(event.block)}
                      </td>
                      <td className="border-b border-border px-3 py-3 tabular-nums text-muted-foreground">
                        {event.date}
                      </td>
                      <td className="border-b border-border px-3 py-3 text-right tabular-nums text-foreground">
                        {formatNumber(event.rewardAfter, {
                          maximumFractionDigits: 4,
                        })}{" "}
                        BTC
                      </td>
                      <td className="border-b border-border px-3 py-3">
                        {event.past ? (
                          <Badge variant="outline">{t("statusPast")}</Badge>
                        ) : (
                          <Badge variant="bitcoin">{t("statusUpcoming")}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Why it matters */}
        <section className="mt-5">
          <Card className="flex flex-col gap-4 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              {t("whyMattersTitle")}
            </h2>
            <p className="max-w-3xl text-base/7 text-muted-foreground">
              {t("whyMattersP1")}
            </p>
            <p className="max-w-3xl text-base/7 text-muted-foreground">
              {t("whyMattersP2")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/data"
                className="text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
              >
                {t("seeDataLive")}
              </Link>
              <Link
                href="/utbildning"
                className="text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
              >
                {t("learnInSchool")}
              </Link>
            </div>
          </Card>
        </section>

        <Disclaimer className="mt-10 max-w-2xl">
          {t("disclaimer", { minutes: MINUTES_PER_BLOCK })}
        </Disclaimer>
      </Container>
    </div>
  );
}

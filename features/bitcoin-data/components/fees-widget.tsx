import { getTranslations } from "next-intl/server";
import { Lightning, Gauge } from "@phosphor-icons/react/dist/ssr";

import { Card } from "@/components/ui/card";
import type { RecommendedFees } from "@/features/bitcoin-data/data/live-data";

export async function FeesWidget({ fees }: { fees: RecommendedFees | null }) {
  const t = await getTranslations("feesWidget");

  const TIERS: {
    key: keyof Omit<RecommendedFees, "live">;
    label: string;
    hint: string;
  }[] = [
    { key: "fastestFee", label: t("fastest"), hint: "~10 min" },
    { key: "halfHourFee", label: t("halfHour"), hint: "~30 min" },
    { key: "hourFee", label: t("hour"), hint: "~60 min" },
    { key: "economyFee", label: t("economy"), hint: t("economyHint") },
  ];

  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-bitcoin-muted text-bitcoin">
            <Lightning size={20} weight="fill" aria-hidden />
          </span>
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              {t("title")}
            </h3>
            <p className="text-xs text-muted-foreground">{t("source")}</p>
          </div>
        </div>
        {fees?.live ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
            {t("live")}
          </span>
        ) : null}
      </div>

      {fees ? (
        <>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            {TIERS.map((tier) => (
              <div
                key={tier.key}
                className="rounded-xl border border-border bg-background/40 p-4"
              >
                <dt className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>{tier.label}</span>
                  <span>{tier.hint}</span>
                </dt>
                <dd className="mt-1 font-heading text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                  {fees[tier.key]}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    sat/vB
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            {t("note")}
          </p>
        </>
      ) : (
        <div className="mt-6 flex min-h-[160px] flex-col items-center justify-center gap-3 text-center">
          <Gauge size={28} weight="bold" aria-hidden className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t("unavailable")}
          </p>
        </div>
      )}
    </Card>
  );
}

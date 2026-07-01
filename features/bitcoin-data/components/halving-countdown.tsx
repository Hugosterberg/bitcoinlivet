"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Timer, ArrowClockwise, WarningCircle } from "@phosphor-icons/react";

import { Card } from "@/components/ui/card";
import {
  DIFFICULTY_ADJUSTMENT_DAYS,
  getHalvingInfo,
  MINUTES_PER_BLOCK,
  type HalvingInfo,
} from "@/features/bitcoin-data/data/metrics";
import { formatNumber, formatDate } from "@/lib/format";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; info: HalvingInfo };

const HEIGHT_ENDPOINT = "https://mempool.space/api/blocks/tip/height";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3 sm:p-4">
      <dt className="text-xs font-medium leading-snug text-muted-foreground [overflow-wrap:anywhere]">
        {label}
      </dt>
      <dd className="mt-1 font-heading text-lg font-semibold tracking-tight text-foreground tabular-nums sm:text-xl">
        {value}
      </dd>
    </div>
  );
}

export function HalvingCountdown() {
  const t = useTranslations("halvingCountdown");
  const locale = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch(HEIGHT_ENDPOINT, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const height = Number.parseInt(text, 10);
        if (!Number.isFinite(height)) throw new Error("Ogiltigt svar");
        setState({ status: "ready", info: getHalvingInfo(height) });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "error" });
      });

    return () => controller.abort();
  }, [reloadKey]);

  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-bitcoin-muted text-bitcoin">
            <Timer size={20} weight="bold" aria-hidden />
          </span>
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              {t("title")}
            </h3>
            <p className="text-xs text-muted-foreground">{t("source")}</p>
          </div>
        </div>
        {state.status === "ready" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
            {t("live")}
          </span>
        ) : null}
      </div>

      <div className="mt-6 min-h-[180px]">
        {state.status === "loading" ? (
          <div className="space-y-3" aria-busy="true" aria-live="polite">
            <span className="sr-only">{t("loading")}</span>
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          </div>
        ) : null}

        {state.status === "error" ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <WarningCircle size={28} weight="bold" aria-hidden className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t("error")}
            </p>
            <button
              type="button"
              onClick={() => {
                setState({ status: "loading" });
                setReloadKey((k) => k + 1);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-bitcoin/50 hover:text-bitcoin"
            >
              <ArrowClockwise size={15} weight="bold" aria-hidden />
              {t("retry")}
            </button>
          </div>
        ) : null}

        {state.status === "ready" ? (
          <div>
            <div className="rounded-xl bg-bitcoin-muted p-4">
              <p className="text-xs font-medium text-bitcoin">
                {t("blocksLeft", { number: state.info.halvingNumber })}
              </p>
              <p className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                {formatNumber(state.info.blocksRemaining, {}, locale)}
              </p>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label={t("blockHeightNow")} value={formatNumber(state.info.height, {}, locale)} />
              <Stat
                label={t("halvingBlock")}
                value={formatNumber(state.info.nextHalvingBlock, {}, locale)}
              />
              <Stat
                label={t("targetTime")}
                value={t("targetTimeValue", { minutes: MINUTES_PER_BLOCK })}
              />
              <Stat
                label={t("estimatedDate")}
                value={formatDate(state.info.estimatedDate, locale)}
              />
            </dl>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("throughEpoch")}</span>
                <span className="tabular-nums">
                  {t("epochPercent", {
                    percent: formatNumber(state.info.epochProgress, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }, locale),
                  })}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-bitcoin"
                  style={{ width: `${state.info.epochProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4">
              <p className="text-sm font-medium text-foreground">
                {t("whyApproxTitle")}
              </p>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                <li>{t("whyApprox1", { minutes: MINUTES_PER_BLOCK })}</li>
                <li>{t("whyApprox2", { days: DIFFICULTY_ADJUSTMENT_DAYS })}</li>
                <li>{t("whyApprox3")}</li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

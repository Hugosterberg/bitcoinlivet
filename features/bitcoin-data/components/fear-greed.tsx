import { getTranslations } from "next-intl/server";
import { Gauge } from "@phosphor-icons/react/dist/ssr";

import { Card } from "@/components/ui/card";
import type { FearGreed } from "@/features/bitcoin-data/data/live-data";

const R = 80;
const CX = 100;
const CY = 100;

/** Point on the gauge arc for a 0–100 value. */
function pointFor(value: number, radius: number) {
  const angle = Math.PI - (Math.min(100, Math.max(0, value)) / 100) * Math.PI;
  return {
    x: CX + radius * Math.cos(angle),
    y: CY - radius * Math.sin(angle),
  };
}

export async function FearGreedWidget({ data }: { data: FearGreed | null }) {
  const t = await getTranslations("fearGreed");
  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-bitcoin-muted text-bitcoin">
            <Gauge size={20} weight="fill" aria-hidden />
          </span>
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              {t("title")}
            </h3>
            <p className="text-xs text-muted-foreground">{t("source")}</p>
          </div>
        </div>
        {data?.live ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
            {t("live")}
          </span>
        ) : null}
      </div>

      {data ? (
        <>
          <div className="mt-4 flex flex-col items-center">
            <svg viewBox="0 0 200 116" className="w-full max-w-[260px]" role="img" aria-label={t("ariaIndex", { value: data.value, label: data.label })}>
              <defs>
                <linearGradient id="fngArc" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--destructive)" />
                  <stop offset="50%" stopColor="var(--bitcoin)" />
                  <stop offset="100%" stopColor="oklch(0.72 0.17 150)" />
                </linearGradient>
              </defs>
              <path
                d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
                fill="none"
                stroke="url(#fngArc)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* needle */}
              {(() => {
                const tip = pointFor(data.value, R - 6);
                return (
                  <line
                    x1={CX}
                    y1={CY}
                    x2={tip.x}
                    y2={tip.y}
                    stroke="var(--foreground)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                );
              })()}
              <circle cx={CX} cy={CY} r="6" fill="var(--foreground)" />
            </svg>
            <div className="-mt-2 text-center">
              <p className="font-heading text-4xl font-semibold tracking-tight text-foreground tabular-nums">
                {data.value}
              </p>
              <p className="mt-0.5 text-sm font-medium text-bitcoin">{data.label}</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            {t("note")}
          </p>
        </>
      ) : (
        <div className="mt-6 flex min-h-[180px] flex-col items-center justify-center gap-3 text-center">
          <Gauge size={28} weight="bold" aria-hidden className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t("unavailable")}
          </p>
        </div>
      )}
    </Card>
  );
}

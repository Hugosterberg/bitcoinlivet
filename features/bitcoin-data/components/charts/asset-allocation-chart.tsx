"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useLocale, useTranslations } from "next-intl";

import type { AssetSlice } from "@/features/bitcoin-data/data/live-data";
import { ChartTooltipCard } from "./chart-theme";

export function AssetAllocationChart({
  data,
  height = 280,
}: {
  data: AssetSlice[];
  height?: number;
}) {
  const t = useTranslations("charts");
  const tAssets = useTranslations("assets");
  const locale = useLocale();
  const numTag = locale === "en" ? "en-US" : "sv-SE";
  const assetLabel = (slice: AssetSlice): string =>
    slice.labelKey ? tAssets(slice.labelKey) : slice.name;
  const percent = (value: number): string =>
    `${value.toLocaleString(numTag, { maximumFractionDigits: value < 1 ? 2 : 1 })} %`;
  const trillions = (valueUsd: number): string =>
    t("trillionsUsd", {
      value: (valueUsd / 1_000_000_000_000).toLocaleString(numTag, {
        maximumFractionDigits: 1,
      }),
    });
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="valueUsd"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="88%"
          paddingAngle={0}
        >
          {data.map((slice) => (
            // Edge in the slice's own colour — no black border or gap, so even
            // the thin company slivers read as their colour.
            <Cell key={slice.name} fill={slice.color} stroke={slice.color} strokeWidth={1} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const slice = payload[0].payload as AssetSlice;
            return (
              <ChartTooltipCard
                title={assetLabel(slice)}
                rows={[
                  {
                    label: t("share"),
                    value: percent(slice.percent),
                    color: slice.color,
                  },
                  { label: t("value"), value: trillions(slice.valueUsd) },
                ]}
              />
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

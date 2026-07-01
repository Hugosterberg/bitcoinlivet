"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useLocale, useTranslations } from "next-intl";

import type { YearPrice } from "@/features/bitcoin-data/data/live-data";
import { currencyForLocale, formatCompact, formatCurrency } from "@/lib/format";
import { axisTick, chartColors, ChartTooltipCard } from "./chart-theme";

export function BtcPriceChart({
  height = 320,
  data,
}: {
  height?: number;
  /** Yearly close points, in the active locale's currency. */
  data: YearPrice[];
}) {
  const t = useTranslations("charts");
  const locale = useLocale();
  const currency = currencyForLocale(locale);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: 4 }}
      >
        <defs>
          <linearGradient id="btcPriceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.bitcoin} stopOpacity={0.45} />
            <stop offset="100%" stopColor={chartColors.bitcoin} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={chartColors.grid} vertical={false} />
        <XAxis
          dataKey="year"
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          minTickGap={16}
        />
        <YAxis
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          width={64}
          tickFormatter={(v: number) => formatCompact(v, { style: "currency", currency }, locale)}
        />
        <Tooltip
          cursor={{ stroke: chartColors.bitcoin, strokeOpacity: 0.3 }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <ChartTooltipCard
                title={label}
                rows={[
                  {
                    label: t("priceYearEnd"),
                    value: formatCurrency(Number(payload[0].value), locale),
                    color: chartColors.bitcoin,
                  },
                ]}
              />
            ) : null
          }
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={chartColors.bitcoin}
          strokeWidth={2}
          fill="url(#btcPriceFill)"
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

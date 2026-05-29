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

import { priceHistory } from "@/features/bitcoin-data/data/metrics";
import { formatCompact, formatCurrency } from "@/lib/format";
import { axisTick, chartColors, ChartTooltipCard } from "./chart-theme";

export function BtcPriceChart({ height = 320 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={priceHistory}
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
          tickFormatter={(v: number) => formatCompact(v, { style: "currency", currency: "SEK" })}
        />
        <Tooltip
          cursor={{ stroke: chartColors.bitcoin, strokeOpacity: 0.3 }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <ChartTooltipCard
                title={label}
                rows={[
                  {
                    label: "Pris (årsslut)",
                    value: formatCurrency(Number(payload[0].value), "SEK"),
                    color: chartColors.bitcoin,
                  },
                ]}
              />
            ) : null
          }
        />
        <Area
          type="monotone"
          dataKey="priceSek"
          stroke={chartColors.bitcoin}
          strokeWidth={2}
          fill="url(#btcPriceFill)"
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

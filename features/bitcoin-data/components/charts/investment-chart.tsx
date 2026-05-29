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

import type { InvestmentPoint } from "@/features/bitcoin-data/data/live-data";
import { formatCompact, formatCurrency, formatNumber } from "@/lib/format";
import { axisTick, chartColors, ChartTooltipCard } from "./chart-theme";

export function InvestmentChart({
  data,
  height = 320,
}: {
  data: InvestmentPoint[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
        <defs>
          <linearGradient id="investedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.gray} stopOpacity={0.3} />
            <stop offset="100%" stopColor={chartColors.gray} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="valueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.bitcoin} stopOpacity={0.45} />
            <stop offset="100%" stopColor={chartColors.bitcoin} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={chartColors.grid} vertical={false} />
        <XAxis
          dataKey="label"
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
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
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const point = payload[0].payload as InvestmentPoint;
            return (
              <ChartTooltipCard
                title={label}
                rows={[
                  {
                    label: "Värde",
                    value: formatCurrency(point.value),
                    color: chartColors.bitcoin,
                  },
                  {
                    label: "Investerat",
                    value: formatCurrency(point.invested),
                    color: chartColors.gray,
                  },
                  {
                    label: "Innehav",
                    value: `${formatNumber(point.btc, { maximumFractionDigits: 5 })} BTC`,
                  },
                ]}
              />
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="invested"
          name="Investerat"
          stroke={chartColors.gray}
          strokeWidth={2}
          fill="url(#investedFill)"
          activeDot={{ r: 3, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          name="Värde"
          stroke={chartColors.bitcoin}
          strokeWidth={2}
          fill="url(#valueFill)"
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

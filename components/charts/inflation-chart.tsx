"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { inflationHistory, type InflationPoint } from "@/lib/metrics";
import { axisTick, chartColors, ChartTooltipCard } from "./chart-theme";

export function InflationChart({
  height = 320,
  data = inflationHistory,
}: {
  height?: number;
  data?: InflationPoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: 4 }}
      >
        <CartesianGrid stroke={chartColors.grid} vertical={false} />
        <XAxis
          dataKey="year"
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          minTickGap={8}
        />
        <YAxis
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          width={36}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          cursor={{ fill: "color-mix(in oklch, var(--foreground) 6%, transparent)" }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <ChartTooltipCard
                title={label}
                rows={[
                  {
                    label: "Inflation",
                    value: `${Number(payload[0].value).toLocaleString("sv-SE")} %`,
                    color: chartColors.bitcoin,
                  },
                ]}
              />
            ) : null
          }
        />
        <Bar dataKey="inflation" radius={[4, 4, 0, 0]} maxBarSize={44}>
          {data.map((point) => (
            <Cell
              key={point.year}
              fill={point.inflation >= 4 ? chartColors.bitcoin : chartColors.gray}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

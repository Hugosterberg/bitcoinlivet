"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { purchasingPower } from "@/lib/metrics";
import { axisTick, chartColors, ChartTooltipCard } from "./chart-theme";

export function PurchasingPowerChart({ height = 320 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={purchasingPower}
        margin={{ top: 8, right: 8, bottom: 0, left: 4 }}
      >
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
          width={36}
          domain={["dataMin - 10", "dataMax + 10"]}
        />
        <Tooltip
          cursor={{ stroke: chartColors.gray, strokeOpacity: 0.3 }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <ChartTooltipCard
                title={`${label} (index, start = 100)`}
                rows={[
                  {
                    label: "Kontanter",
                    value: String(payload.find((p) => p.dataKey === "kontanter")?.value ?? ""),
                    color: chartColors.gray,
                  },
                  {
                    label: "Knappa pengar",
                    value: String(payload.find((p) => p.dataKey === "hardPengar")?.value ?? ""),
                    color: chartColors.bitcoin,
                  },
                ]}
              />
            ) : null
          }
        />
        <Line
          type="monotone"
          dataKey="kontanter"
          stroke={chartColors.gray}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Line
          type="monotone"
          dataKey="hardPengar"
          stroke={chartColors.bitcoin}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

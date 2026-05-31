"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { AssetSlice } from "@/features/bitcoin-data/data/live-data";
import { ChartTooltipCard } from "./chart-theme";

function biljoner(valueUsd: number): string {
  return `${(valueUsd / 1_000_000_000_000).toLocaleString("sv-SE", {
    maximumFractionDigits: 1,
  })} biljoner USD`;
}

function percent(value: number): string {
  return `${value.toLocaleString("sv-SE", {
    maximumFractionDigits: value < 1 ? 2 : 1,
  })} %`;
}

export function AssetAllocationChart({
  data,
  height = 280,
}: {
  data: AssetSlice[];
  height?: number;
}) {
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
                title={slice.name}
                rows={[
                  {
                    label: "Andel",
                    value: percent(slice.percent),
                    color: slice.color,
                  },
                  { label: "Värde", value: biljoner(slice.valueUsd) },
                ]}
              />
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

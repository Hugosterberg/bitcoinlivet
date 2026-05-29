"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { AssetSlice } from "@/features/bitcoin-data/data/live-data";
import { assetColor } from "@/features/bitcoin-data/data/assets";
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
          innerRadius="58%"
          outerRadius="86%"
          paddingAngle={1.5}
          stroke="var(--color-background)"
          strokeWidth={2}
        >
          {data.map((slice) => (
            <Cell key={slice.name} fill={assetColor(slice.name)} />
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
                    color: assetColor(slice.name),
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

import type { ComponentProps } from "react";
import {
  Coins,
  CurrencyBtc,
  Stack,
  ChartLineUp,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

import type { ModuleIconKey } from "@/features/education/data/courses";

const ICONS = {
  coins: Coins,
  bitcoin: CurrencyBtc,
  stack: Stack,
  chart: ChartLineUp,
  shield: ShieldCheck,
} as const;

export function ModuleIcon({
  icon,
  ...props
}: { icon: ModuleIconKey } & ComponentProps<typeof Coins>) {
  const Cmp = ICONS[icon];
  return <Cmp {...props} />;
}

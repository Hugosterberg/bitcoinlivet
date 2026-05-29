import type { ComponentProps } from "react";
import {
  Stack,
  Timer,
  ShareNetwork,
  ShieldCheck,
  Lightning,
  TrendUp,
  Eye,
} from "@phosphor-icons/react/dist/ssr";

import type { FunctionIconKey } from "@/features/functions/data/functions";

const ICONS = {
  supply: Stack,
  halving: Timer,
  decentralisation: ShareNetwork,
  security: ShieldCheck,
  payments: Lightning,
  purchasingPower: TrendUp,
  transparency: Eye,
} as const;

/** Renders the Phosphor icon for a Bitcoin-function key. Server-compatible. */
export function FunctionIcon({
  icon,
  ...props
}: { icon: FunctionIconKey } & ComponentProps<typeof Stack>) {
  const Icon = ICONS[icon];
  return <Icon {...props} />;
}

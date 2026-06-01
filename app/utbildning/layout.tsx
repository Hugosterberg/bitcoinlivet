import type { ReactNode } from "react";

import { ProgressProvider } from "@/features/education/components/progress-provider";
import { ProgressSync } from "@/features/education/components/progress-sync";

export default function UtbildningLayout({ children }: { children: ReactNode }) {
  // Session + progression are resolved client-side (see ProgressSync) so these
  // pages stay statically rendered. Anonymous visitors use localStorage.
  return (
    <ProgressProvider>
      <ProgressSync />
      {children}
    </ProgressProvider>
  );
}

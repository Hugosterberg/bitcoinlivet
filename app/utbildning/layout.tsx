import type { ReactNode } from "react";

import { ProgressProvider } from "@/features/education/components/progress-provider";

export default function UtbildningLayout({ children }: { children: ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}

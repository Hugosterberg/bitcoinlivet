import type { ReactNode } from "react";

import { ProgressProvider } from "@/components/education/progress-provider";

export default function UtbildningLayout({ children }: { children: ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}

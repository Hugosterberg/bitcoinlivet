import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";

export default async function Loading() {
  const t = await getTranslations("common");
  return (
    <div className="py-20" aria-busy="true" aria-live="polite">
      <Container>
        <span className="sr-only">{t("loadingContent")}</span>
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="mt-5 h-12 w-2/3 animate-pulse rounded-lg bg-muted" />
        <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

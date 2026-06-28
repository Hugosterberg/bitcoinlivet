"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Warning } from "@phosphor-icons/react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorPage");

  useEffect(() => {
    // TODO(observability): forward to an error reporting service.
    console.error(error);
  }, [error]);

  return (
    <div className="py-24">
      <Container className="flex max-w-xl flex-col items-center text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <Warning size={28} weight="bold" aria-hidden />
        </span>
        <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground">
          {t("lead")}
        </p>
        <Button onClick={reset} size="xl" className="mt-8 rounded-full">
          {t("retry")}
        </Button>
      </Container>
    </div>
  );
}

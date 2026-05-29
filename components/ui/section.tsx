import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

type SectionProps<T extends ElementType> = {
  as?: T;
  className?: string;
  /** Width of the inner container. */
  containerClassName?: string;
  /** Render without the inner Container (e.g. for full-bleed content). */
  bleed?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Vertical section wrapper enforcing consistent spacing rhythm.
 */
export function Section<T extends ElementType = "section">({
  as,
  className,
  containerClassName,
  bleed = false,
  children,
  ...props
}: SectionProps<T>) {
  const Component = as ?? "section";
  return (
    <Component className={cn("py-16 sm:py-20 lg:py-24", className)} {...props}>
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </Component>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Heading level for correct document outline. */
  as?: "h1" | "h2" | "h3";
};

/**
 * Reusable eyebrow + title + description block for section intros.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-bitcoin uppercase">
          {eyebrow}
        </span>
      ) : null}
      <Heading className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-pretty text-base/7 text-muted-foreground sm:text-lg/8",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

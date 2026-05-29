import type { MDXComponents } from "mdx/types";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { linkifyGlossary } from "@/features/glossary/components/glossary-linkify";

/**
 * Global MDX component mapping. Required by @next/mdx in the App Router.
 * Styles markdown output to match the Bitcoinlivet editorial design system.
 */
export function useMDXComponents(
  components: MDXComponents = {},
): MDXComponents {
  return {
    h1: ({ className, ...props }) => (
      <h1
        className={cn(
          "mt-2 scroll-m-20 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl",
          className,
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn(
          "mt-12 scroll-m-20 border-t border-border pt-8 text-2xl font-semibold tracking-tight text-foreground first:mt-0 first:border-0 first:pt-0",
          className,
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cn(
          "mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-foreground",
          className,
        )}
        {...props}
      />
    ),
    p: ({ className, children, ...props }) => (
      <p
        className={cn(
          "mt-5 text-base/7 text-muted-foreground first:mt-0",
          className,
        )}
        {...props}
      >
        {linkifyGlossary(children)}
      </p>
    ),
    a: ({ className, href = "#", ...props }) => (
      <Link
        href={href}
        className={cn(
          "font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 transition-colors hover:decoration-bitcoin",
          className,
        )}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul
        className={cn(
          "mt-5 ml-1 list-disc space-y-2 pl-5 text-base/7 text-muted-foreground marker:text-bitcoin/70",
          className,
        )}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn(
          "mt-5 ml-1 list-decimal space-y-2 pl-5 text-base/7 text-muted-foreground marker:text-muted-foreground",
          className,
        )}
        {...props}
      />
    ),
    li: ({ className, children, ...props }) => (
      <li className={className} {...props}>
        {linkifyGlossary(children)}
      </li>
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          "mt-6 border-l-2 border-bitcoin/60 pl-5 text-lg/8 font-medium text-foreground italic",
          className,
        )}
        {...props}
      />
    ),
    hr: ({ className, ...props }) => (
      <hr className={cn("my-10 border-border", className)} {...props} />
    ),
    strong: ({ className, ...props }) => (
      <strong
        className={cn("font-semibold text-foreground", className)}
        {...props}
      />
    ),
    code: ({ className, ...props }) => (
      <code
        className={cn(
          "rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground",
          className,
        )}
        {...props}
      />
    ),
    pre: ({ className, ...props }) => (
      <pre
        className={cn(
          "mt-6 overflow-x-auto rounded-xl border border-border bg-graphite p-4 font-mono text-sm text-foreground",
          className,
        )}
        {...props}
      />
    ),
    table: ({ className, ...props }) => (
      <div className="mt-6 w-full overflow-x-auto">
        <table
          className={cn("w-full border-collapse text-left text-sm", className)}
          {...props}
        />
      </div>
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn(
          "border-b border-border px-3 py-2 font-semibold text-foreground",
          className,
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td
        className={cn(
          "border-b border-border px-3 py-2 text-muted-foreground",
          className,
        )}
        {...props}
      />
    ),
    ...components,
  };
}

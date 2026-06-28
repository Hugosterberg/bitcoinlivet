"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  glossaryLevels,
  levelMeta,
  type GlossaryLevel,
  type GlossaryTerm,
} from "@/features/glossary/data/glossary";

type LevelFilter = GlossaryLevel | null;

function matches(term: GlossaryTerm, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    term.term.toLowerCase().includes(q) ||
    term.definition.toLowerCase().includes(q)
  );
}

function LevelBadge({ level }: { level: GlossaryLevel }) {
  const meta = levelMeta(level);
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} aria-hidden />
      {meta.label}
    </span>
  );
}

export function GlossaryExplorer({ terms }: { terms: GlossaryTerm[] }) {
  const t = useTranslations("glossaryExplorer");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LevelFilter>(null);
  const deferredQuery = useDeferredValue(query);

  const counts = useMemo(() => {
    const map = new Map<GlossaryLevel, number>();
    for (const t of terms) map.set(t.level, (map.get(t.level) ?? 0) + 1);
    return map;
  }, [terms]);

  const filtered = useMemo(
    () =>
      terms.filter(
        (t) => (level ? t.level === level : true) && matches(t, deferredQuery),
      ),
    [terms, level, deferredQuery],
  );

  const groups = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const t of filtered) {
      const letter = t.term.charAt(0).toUpperCase();
      const list = map.get(letter) ?? [];
      list.push(t);
      map.set(letter, list);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div>
      {/* Search */}
      <label className="relative block">
        <span className="sr-only">{t("searchLabel")}</span>
        <MagnifyingGlass
          size={18}
          weight="bold"
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-12 w-full rounded-full border border-input bg-background pl-11 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label={t("clearSearch")}
            className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={15} weight="bold" aria-hidden />
          </button>
        ) : null}
      </label>

      {/* Level filter */}
      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("showLevel")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLevel(null)}
            aria-pressed={level === null}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              level === null
                ? "border-bitcoin/40 bg-bitcoin-muted text-bitcoin"
                : "border-border text-muted-foreground hover:border-bitcoin/40 hover:text-foreground",
            )}
          >
            {t("all")}
            <span className="text-xs tabular-nums opacity-70">{terms.length}</span>
          </button>
          {glossaryLevels.map((l) => {
            const isActive = level === l.level;
            return (
              <button
                key={l.level}
                type="button"
                onClick={() => setLevel(l.level)}
                aria-pressed={isActive}
                title={l.description}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-bitcoin/40 bg-bitcoin-muted text-bitcoin"
                    : "border-border text-muted-foreground hover:border-bitcoin/40 hover:text-foreground",
                )}
              >
                <span className={cn("size-2 rounded-full", l.dotClass)} aria-hidden />
                {l.label}
                <span className="text-xs tabular-nums opacity-70">
                  {counts.get(l.level) ?? 0}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {level === null
            ? t("allTermsHint")
            : levelMeta(level).description + "."}
        </p>
      </div>

      {/* Letter index */}
      {groups.length > 0 ? (
        <nav aria-label={t("jumpToLetter")} className="mt-8 flex flex-wrap gap-2">
          {groups.map(([letter]) => (
            <a
              key={letter}
              href={`#bokstav-${letter}`}
              className="grid size-10 place-items-center rounded-lg border border-border text-sm font-medium text-muted-foreground transition-colors hover:border-bitcoin/50 hover:text-bitcoin"
            >
              {letter}
            </a>
          ))}
        </nav>
      ) : null}

      {/* Groups */}
      {groups.length > 0 ? (
        <div className="mt-10 space-y-12">
          {groups.map(([letter, letterTerms]) => (
            <section
              key={letter}
              id={`bokstav-${letter}`}
              aria-label={t("termsStartingWith", { letter })}
              className="scroll-mt-24"
            >
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-bitcoin">
                {letter}
              </h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {letterTerms.map((t) => (
                  <Card key={t.slug} id={t.slug} className="scroll-mt-24 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <dt className="font-heading text-base font-semibold tracking-tight text-foreground">
                        {t.term}
                      </dt>
                      <LevelBadge level={t.level} />
                    </div>
                    <dd className="mt-2 text-sm/6 text-muted-foreground">
                      {t.definition}
                    </dd>
                  </Card>
                ))}
              </dl>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
          <p className="font-heading text-lg font-semibold text-foreground">
            {t("noMatches")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("tryAnother")}
          </p>
        </div>
      )}
    </div>
  );
}

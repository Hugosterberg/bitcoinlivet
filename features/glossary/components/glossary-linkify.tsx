import { Fragment, type ReactNode } from "react";
import Link from "next/link";

import { glossary } from "@/features/glossary/data/glossary";

/**
 * Auto-links glossary terms found in long-form body text (blog articles and
 * Bitcoinskolan lessons) to their entry in the ordlista. The marking is kept
 * deliberately subtle: a soft Bitcoin-orange word with a dotted underline, so
 * it reads as "a term you can tap" without turning the text into a sea of
 * links. Headings, existing links and code are left untouched because only
 * plain string nodes are processed (see {@link linkifyGlossary}).
 */

const LINK_CLASS =
  "text-bitcoin/90 underline decoration-dotted decoration-bitcoin/40 underline-offset-[3px] transition-colors hover:text-bitcoin hover:decoration-bitcoin/80";

/** Escapes a string for safe use inside a RegExp. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Derives the searchable phrases for a glossary term. A term like
 * "Sats (satoshi)" yields both "Sats" and "satoshi"; "HD-plånbok /
 * deriveringsväg" yields both halves. Phrases shorter than two characters are
 * dropped.
 */
function phrasesFor(term: string): string[] {
  const out: string[] = [];
  const withoutParens = term.replace(/\s*\([^)]*\)/g, "").trim();
  for (const part of withoutParens.split("/")) {
    const trimmed = part.trim();
    if (trimmed.length >= 2) out.push(trimmed);
  }
  const paren = term.match(/\(([^)]+)\)/);
  if (paren) {
    const inner = paren[1].trim();
    if (inner.length >= 2) out.push(inner);
  }
  return out;
}

/** Lowercased phrase → glossary slug. */
const slugByPhrase = new Map<string, string>();
for (const t of glossary) {
  for (const phrase of phrasesFor(t.term)) {
    const key = phrase.toLowerCase();
    if (!slugByPhrase.has(key)) slugByPhrase.set(key, t.slug);
  }
}

// Longest phrases first so multi-word/compound terms win over their prefixes
// (e.g. "Blockkedja" before "Block"). Matching is case-insensitive, so the
// lowercased keys are all we need.
const sortedPhrases = [...slugByPhrase.keys()].sort((a, b) => b.length - a.length);

/**
 * Optional Swedish definite/plural noun endings (longest first), so that
 * "halvering" also matches "halveringen"/"halveringar" and "block" matches
 * "blocket". Only applied to longer single-word terms (see {@link canInflect})
 * to avoid turning short words into false matches (e.g. "sats" → "satsar").
 */
const SUFFIX = "(?:erna|arna|orna|en|et|er|ar|or|na|n|t|s)";

/** Whether a phrase is safe to match with an optional inflection suffix. */
function canInflect(phrase: string): boolean {
  return phrase.length >= 5 && /^\p{L}+$/u.test(phrase);
}

const alternatives = sortedPhrases.map((phrase) =>
  canInflect(phrase) ? `${escapeRegExp(phrase)}${SUFFIX}?` : escapeRegExp(phrase),
);

const TERM_RE = new RegExp(
  `(^|[^\\p{L}\\p{N}_])(${alternatives.join("|")})(?![\\p{L}\\p{N}_])`,
  "giu",
);

const SUFFIXES = new Set([
  "erna", "arna", "orna", "en", "et", "er", "ar", "or", "na", "n", "t", "s",
]);

/**
 * Resolves a matched word (possibly inflected) back to a glossary slug. Checks
 * the longest phrases first; an inflected match is accepted when the remainder
 * after the base phrase is a known suffix.
 */
function slugForMatch(matched: string): string | undefined {
  const lower = matched.toLowerCase();
  const exact = slugByPhrase.get(lower);
  if (exact) return exact;
  for (const phrase of sortedPhrases) {
    if (lower.length > phrase.length && lower.startsWith(phrase)) {
      const rest = lower.slice(phrase.length);
      if (SUFFIXES.has(rest)) return slugByPhrase.get(phrase);
    }
  }
  return undefined;
}

/** Splits a plain string into text and glossary-term links. */
function linkifyString(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;

  for (const match of text.matchAll(TERM_RE)) {
    const matchIndex = match.index ?? 0;
    const boundary = match[1] ?? "";
    const termText = match[2];
    const start = matchIndex + boundary.length;

    if (start > last) out.push(text.slice(last, start));

    const slug = slugForMatch(termText);
    if (slug) {
      out.push(
        <Link key={`${keyPrefix}-${n}`} href={`/ordlista#${slug}`} className={LINK_CLASS}>
          {termText}
        </Link>,
      );
    } else {
      out.push(termText);
    }
    n += 1;
    last = start + termText.length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Linkifies glossary terms in `children`. Only top-level string nodes are
 * transformed; React elements (existing links, bold, code, …) pass through
 * untouched, so nothing is ever double-linked.
 */
export function linkifyGlossary(children: ReactNode): ReactNode {
  if (typeof children === "string") {
    return <>{linkifyString(children, "g")}</>;
  }
  if (Array.isArray(children)) {
    return children.map((child, i) =>
      typeof child === "string" ? (
        <Fragment key={i}>{linkifyString(child, `g${i}`)}</Fragment>
      ) : (
        child
      ),
    );
  }
  return children;
}

/**
 * Locale-aware formatters. The Swedish site formats in sv-SE / SEK, the English
 * site in en-US / USD. Locale is an optional trailing argument that defaults to
 * Swedish, so existing call sites keep working; pass the active locale on pages
 * that render in English.
 */

export type FormatLocale = "sv" | "en";

const LOCALE_TAG: Record<string, string> = { sv: "sv-SE", en: "en-US" };
const CURRENCY: Record<string, "SEK" | "USD"> = { sv: "SEK", en: "USD" };

function tag(locale: string): string {
  return LOCALE_TAG[locale] ?? "sv-SE";
}

/** The display currency for a locale (sv → SEK, en → USD). */
export function currencyForLocale(locale: string): "SEK" | "USD" {
  return CURRENCY[locale] ?? "SEK";
}

/** There are 100,000,000 satoshis in one bitcoin. */
export const SATS_PER_BTC = 100_000_000;

/**
 * Replaces the non-breaking spaces that sv-SE uses as thousands separators
 * with regular spaces, so long formatted numbers can wrap inside narrow
 * containers (metric cards, tiles) instead of overflowing. Use only for values
 * shown in width-constrained boxes; keep the non-breaking version in prose.
 */
export function wrappable(value: string): string {
  const nbsp = String.fromCharCode(0xa0);
  const narrowNbsp = String.fromCharCode(0x202f);
  return value.split(nbsp).join(" ").split(narrowNbsp).join(" ");
}

export function formatCurrency(
  value: number,
  locale: string = "sv",
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(tag(locale), {
    style: "currency",
    currency: currencyForLocale(locale),
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale: string = "sv",
): string {
  return new Intl.NumberFormat(tag(locale), options).format(value);
}

/** Compact notation for large numbers, e.g. "1,3 bn kr". */
export function formatCompact(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale: string = "sv",
): string {
  return new Intl.NumberFormat(tag(locale), {
    notation: "compact",
    maximumFractionDigits: 1,
    ...options,
  }).format(value);
}

/**
 * Spells out a large amount using magnitude words for readability, e.g.
 * 13_567_161_605_324 → "13,6 biljoner kronor" (sv) / "13.6 trillion dollars"
 * (en). Falls back to the plain number for smaller values.
 *
 * Powers map 1:1 between the locales: biljon/trillion 10¹², miljard/billion
 * 10⁹, miljon/million 10⁶.
 */
export function formatAmountWords(
  value: number,
  locale: string = "sv",
): string {
  const unit = locale === "en" ? "dollars" : "kronor";
  const words =
    locale === "en"
      ? { t: "trillion", b: "billion", m: "million" }
      : { t: "biljoner", b: "miljarder", m: "miljoner" };
  const abs = Math.abs(value);
  const scales = [
    { limit: 1e12, div: 1e12, word: words.t },
    { limit: 1e9, div: 1e9, word: words.b },
    { limit: 1e6, div: 1e6, word: words.m },
  ] as const;

  for (const s of scales) {
    if (abs >= s.limit) {
      const n = value / s.div;
      const decimals = Math.abs(n) >= 100 ? 0 : 1;
      const num = formatNumber(
        n,
        { minimumFractionDigits: decimals, maximumFractionDigits: decimals },
        locale,
      );
      return `${num} ${s.word} ${unit}`;
    }
  }
  return `${formatNumber(Math.round(value), {}, locale)} ${unit}`;
}

export function formatPercent(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale: string = "sv",
): string {
  return new Intl.NumberFormat(tag(locale), {
    style: "percent",
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
    ...options,
  }).format(value / 100);
}

/**
 * Formats a 0–100 *share* (e.g. percent of supply issued) without a leading
 * sign. Use this instead of {@link formatPercent} for shares, where the "+"
 * that suits a 24h change reads as noise. E.g. 94.5 → "94,5 %".
 */
export function formatShare(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale: string = "sv",
): string {
  return formatPercent(value, { signDisplay: "auto", ...options }, locale);
}

export function formatSats(sats: number, locale: string = "sv"): string {
  return `${formatNumber(Math.round(sats), {}, locale)} sats`;
}

export function btcToSats(btc: number): number {
  return Math.round(btc * SATS_PER_BTC);
}

export function satsToBtc(sats: number): number {
  return sats / SATS_PER_BTC;
}

export function formatDate(input: string | Date, locale: string = "sv"): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat(tag(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateShort(
  input: string | Date,
  locale: string = "sv",
): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat(tag(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

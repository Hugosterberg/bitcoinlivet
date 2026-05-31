/**
 * Locale-aware formatters (sv-SE). Centralised so number, currency and
 * date formatting stay consistent across metrics, charts and content.
 */

const LOCALE = "sv-SE";

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
  currency: "SEK" | "USD" | "EUR" = "SEK",
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(LOCALE, options).format(value);
}

/** Compact notation for large numbers, e.g. "1,3 bn kr". */
export function formatCompact(
  value: number,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(LOCALE, {
    notation: "compact",
    maximumFractionDigits: 1,
    ...options,
  }).format(value);
}

/**
 * Spells out a large amount using Swedish magnitude words for readability,
 * e.g. 13_567_161_605_324 → "13,6 biljoner kronor". Falls back to the plain
 * number for smaller values where words add no clarity.
 *
 * Swedish scale: miljon 10⁶, miljard 10⁹, biljon 10¹².
 */
export function formatAmountWords(value: number, unit = "kronor"): string {
  const abs = Math.abs(value);
  const scales = [
    { limit: 1e12, div: 1e12, word: "biljoner" },
    { limit: 1e9, div: 1e9, word: "miljarder" },
    { limit: 1e6, div: 1e6, word: "miljoner" },
  ] as const;

  for (const s of scales) {
    if (abs >= s.limit) {
      const n = value / s.div;
      const decimals = Math.abs(n) >= 100 ? 0 : 1;
      const num = formatNumber(n, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      return `${num} ${s.word} ${unit}`;
    }
  }
  return `${formatNumber(Math.round(value))} ${unit}`;
}

export function formatPercent(
  value: number,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(LOCALE, {
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
): string {
  return formatPercent(value, { signDisplay: "auto", ...options });
}

export function formatSats(sats: number): string {
  return `${formatNumber(Math.round(sats))} sats`;
}

export function btcToSats(btc: number): number {
  return Math.round(btc * SATS_PER_BTC);
}

export function satsToBtc(sats: number): number {
  return sats / SATS_PER_BTC;
}

export function formatDate(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat(LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateShort(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat(LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Personlig DCA-konfiguration för investeringsgrafen på datasidan.
 *
 * Grafen beräknas i första hand LIVE: investerat belopp = antal dagar ×
 * `dailySek`, och värdet beräknas mot historiska BTC/SEK-priser som hämtas
 * från CoinGecko. Inget är hårdkodat utom själva regeln nedan.
 *
 * ⚠️ Vill du visa de EXAKTA siffrorna från dina månadsinlägg på Instagram?
 * Fyll i `instagramSnapshots` nedan så används de i stället för den
 * automatiskt beräknade serien. Lämna listan tom för live-beräkning.
 */

export const dcaConfig = {
  /** Belopp i kronor som köps varje dag. */
  dailySek: 200,
  /** Startdatum (ISO) för det dagliga köpet. */
  startDate: "2024-06-01",
} as const;

export type MonthlySnapshot = {
  /** Månad i format YYYY-MM, t.ex. "2024-06". */
  month: string;
  /** Totalt investerat hittills i kronor. */
  invested: number;
  /** Portföljens värde vid månadens slut i kronor. */
  value: number;
};

/**
 * Manuella månadsvärden från dina Instagram-statusinlägg.
 * Exempel:
 *   { month: "2024-06", invested: 6000, value: 6250 },
 *   { month: "2024-07", invested: 12200, value: 13100 },
 */
export const instagramSnapshots: MonthlySnapshot[] = [];

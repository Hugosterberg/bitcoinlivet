/** Outcome of a newsletter subscribe attempt, surfaced to the form UI. */
export type SubscribeStatus = "idle" | "ok" | "invalid" | "error" | "unconfigured";

export type SubscribeState = {
  status: SubscribeStatus;
  /** Swedish, user-facing message tied to the status. */
  message: string;
};

export const initialSubscribeState: SubscribeState = {
  status: "idle",
  message: "",
};

/**
 * Pragmatic email format check. Mirrors the browser's native `type="email"`
 * validation closely enough for an opt-in list, without overfitting RFC 5322.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

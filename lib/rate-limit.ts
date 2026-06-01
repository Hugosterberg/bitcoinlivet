/**
 * Tiny in-memory fixed-window rate limiter.
 *
 * Best-effort: state lives in the running server instance (reused across
 * requests on Vercel Fluid Compute), so it throttles bursts without external
 * infrastructure. For hard, cross-instance limits use Vercel WAF or Upstash.
 */

type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();

/**
 * Returns true if the action is allowed for `key`, false if the limit is hit.
 * `max` requests are allowed per `windowMs`.
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    // Opportunistic cleanup so the map can't grow unbounded.
    if (buckets.size > 5000) {
      for (const [k, w] of buckets) if (now > w.resetAt) buckets.delete(k);
    }
    return true;
  }

  if (existing.count >= max) return false;
  existing.count += 1;
  return true;
}

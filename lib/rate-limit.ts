/**
 * Simple in-memory sliding-window rate limiter.
 * Works well for single-instance / serverless with short windows.
 * For multi-instance production, swap for @upstash/ratelimit + Redis.
 */

const requests = new Map<string, number[]>();

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetInMs: number;
}

/**
 * Check whether a key (e.g. userId) has exceeded the allowed
 * number of requests within the given window.
 *
 * @param key       Unique identifier (userId, IP, etc.)
 * @param limit     Max requests allowed in the window
 * @param windowMs  Window size in milliseconds (default 60 s)
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number = 60_000,
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get existing timestamps and prune expired ones
  const timestamps = (requests.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    const oldestInWindow = timestamps[0];
    return {
      success: false,
      remaining: 0,
      resetInMs: oldestInWindow + windowMs - now,
    };
  }

  timestamps.push(now);
  requests.set(key, timestamps);

  return {
    success: true,
    remaining: limit - timestamps.length,
    resetInMs: windowMs,
  };
}

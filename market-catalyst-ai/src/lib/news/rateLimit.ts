// ---------------------------------------------------------------------------
// Best-effort request limiting for the public /api/news* and /api/events*
// routes. This is an in-memory limiter: it works correctly within a single
// running server process, but on serverless platforms (Vercel) each
// function instance keeps its own counters, so the effective limit is
// "per warm instance," not a hard global ceiling. That's an acceptable
// trade-off for a free, dependency-free starting point — for a stricter
// global limit, swap this for a shared store like Upstash Redis
// (`@upstash/ratelimit`) without changing any calling code, since callers
// only depend on `checkRateLimit`'s return shape.
// ---------------------------------------------------------------------------

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

export function getClientKey(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown-client";
}

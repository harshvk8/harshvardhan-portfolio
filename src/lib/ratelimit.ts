import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * IP rate limiting for the public AI endpoints (the scheduling assistant).
 * Backed by Upstash Redis when configured; a no-op otherwise so local dev
 * and preview deploys work without the env vars. Set both on the production
 * deployment so the Claude-backed endpoint can't be run up by anyone.
 *
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/** 8 chat messages per 5 minutes per IP. */
export const chatLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(8, "5 m"), prefix: "rl:sched:msg" })
  : null;

/** 40 requests per day per IP across the scheduling endpoints. */
export const dayLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(40, "24 h"), prefix: "rl:sched:day" })
  : null;

/** 3 confirmed bookings per day per IP. */
export const confirmLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "24 h"),
      prefix: "rl:sched:confirm",
    })
  : null;

export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}

/** Runs the given limiters in order; returns false if any is exceeded. */
export async function withinLimits(ip: string, limiters: (Ratelimit | null)[]): Promise<boolean> {
  for (const limiter of limiters) {
    if (!limiter) continue;
    const { success } = await limiter.limit(ip);
    if (!success) return false;
  }
  return true;
}

const OFF_TOPIC_TTL_SECONDS = 24 * 60 * 60;

/**
 * Server-side, per-IP off-topic strike count for the scheduling chat. Backed
 * by Redis when configured, so a caller can't reset it by omitting prior
 * turns from the request body (unlike counting warnings out of the client-
 * supplied message history). Returns null when Redis isn't configured — the
 * caller falls back to the transcript heuristic in that case.
 */
export async function getOffTopicStrikes(ip: string): Promise<number | null> {
  if (!redis) return null;
  const count = await redis.get<number>(`rl:sched:offtopic:${ip}`);
  return count ?? 0;
}

/** Increments the strike count (creating it with a 24h TTL) and returns the new value. */
export async function addOffTopicStrike(ip: string): Promise<number | null> {
  if (!redis) return null;
  const key = `rl:sched:offtopic:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, OFF_TOPIC_TTL_SECONDS);
  return count;
}

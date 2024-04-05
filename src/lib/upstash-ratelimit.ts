import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./upstash-redis";

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 s"),
  analytics: true,
  //   Prefix for the keys in Redis
  prefix: "ratelimit",
});

export const emailSendingQuotaLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 d"),
  analytics: true,
  prefix: "email_sending_quota_limit",
});

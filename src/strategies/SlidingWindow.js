import { RedisRespository } from "../redis/RedisRepository.js";
import { redisLimitKey } from "../redis/keys.js";

export class SlidingWindow {
  constructor(options) {
    this.limit = options.limit;
    this.window = options.window * 1000;
    this.strategy = options.strategy;
    this.keyGenerator = options.keyGenerator;
    this.redisRepo = new RedisRespository(options.redis);
  }

  async consume(userKey) {
    const finalKey = redisLimitKey(this.strategy, userKey);
    const now = Date.now();

    // Remove expired requests
    const windowStart = now - this.window;
    await this.redisRepo.removeExpired(finalKey, windowStart);

    // Count active requests
    const count = await this.redisRepo.count(finalKey);

    // Reject
    if (count >= this.limit) {
      const oldest = await this.redisRepo.oldestStamp(finalKey);

      let retryAfter = 0;

      if (oldest !== null) {
        retryAfter = Math.ceil(Math.max(0, oldest + this.window - now) / 1000);
      }

      return {
        allowed: false,
        remaining: 0,
        limit: this.limit,
        retryAfter,
      };
    }

    // Accept request
    await this.redisRepo.addStamp(finalKey, now);

    return {
      allowed: true,
      remaining: this.limit - (count + 1),
      limit: this.limit,
      retryAfter: 0,
    };
  }
}

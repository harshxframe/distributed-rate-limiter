import { redisLimitKey } from "../redis/keys.js";
import { RedisRespository } from "../redis/RedisRepository.js";

export class TokenBucket {
  constructor(options) {
    this.limit = options.limit;
    this.window = options.window * 1000;
    this.strategy = options.strategy;
    this.keyGenerator = options.keyGenerator;
    this.redisRepo = new RedisRespository(options.redis);
    this.refilRate = options.limit / this.window;
  }

  async consume(userKey) {
    const final_key = redisLimitKey(this.strategy, userKey);
    const now = Date.now();
    const bucket = await this.redisRepo.getBucket(final_key);
    
    if (Object.keys(bucket).length == 0) {
      await this.redisRepo.saveBucket(final_key, {
        tokens: this.limit - 1,
        lastRefill: now,
      });
      return {
        allowed: true,
        remaining: this.limit - 1,
        limit: this.limit,
        retryAfter: 0,
      };
    }

    const elapsed = now - bucket.lastRefill;
    const newTokens = elapsed * this.refilRate;
    const addToken = bucket.tokens + newTokens;
    const finalToken = Math.min(this.limit, addToken);
    bucket["tokens"] = Number(finalToken.toFixed(6));
    bucket["lastRefill"] = now;
    const missingTokens = 1 - bucket.tokens;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      await this.redisRepo.saveBucket(final_key, bucket);
      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        limit: this.limit,
        retryAfter: 0,
      };
    }

    const retryAfter = Math.ceil(missingTokens / this.refilRate / 1000);
    await this.redisRepo.saveBucket(final_key, bucket);
    return {
      allowed: false,
      remaining: Math.floor(bucket.tokens),
      limit: this.limit,
      retryAfter: retryAfter,
    };
  }
}

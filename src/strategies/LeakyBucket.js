import { redisLimitKey } from "../redis/keys.js";
import { RedisRespository } from "../redis/RedisRepository.js";

export class LeakyBucket {
  constructor(options) {
    this.limit = options.limit;                 // bucket capacity
    this.window = options.window * 1000;        // ms
    this.strategy = options.strategy;
    this.keyGenerator = options.keyGenerator;
    this.redisRepo = new RedisRespository(options.redis);

    // requests leaked per millisecond
    this.leakRate = this.limit / this.window;
  }

  async consume(userKey) {
    const finalKey = redisLimitKey(this.strategy, userKey);

    const now = Date.now();

    let lastLeak = await this.redisRepo.getLastLeakTime(finalKey);

    if (!lastLeak) {
      lastLeak = now;
      await this.redisRepo.saveLastLeakTime(finalKey, now);
    }

    // Calculate how many requests should have leaked
    const elapsed = now - lastLeak;

    const requestsToLeak = Math.floor(elapsed * this.leakRate);

    // Remove leaked requests
    for (let i = 0; i < requestsToLeak; i++) {
      const value = await this.redisRepo.popItem(finalKey);

      if (!value) break;
    }

    // Preserve leftover elapsed time
    if (requestsToLeak > 0) {
      const consumedTime = requestsToLeak / this.leakRate;
      await this.redisRepo.saveLastLeakTime(
        finalKey,
        lastLeak + consumedTime
      );
    }

    const size = await this.redisRepo.size(finalKey);

    if (size >= this.limit) {
      const retryAfter = Math.ceil((1 / this.leakRate) / 1000);

      return {
        allowed: false,
        remaining: 0,
        limit: this.limit,
        retryAfter,
      };
    }

    await this.redisRepo.pushItem(finalKey, now);

    return {
      allowed: true,
      remaining: this.limit - (size + 1),
      limit: this.limit,
      retryAfter: 0,
    };
  }
}
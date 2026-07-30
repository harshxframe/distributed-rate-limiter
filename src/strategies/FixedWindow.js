import { redisLimitKey } from "../redis/keys.js";
import { RedisRespository } from "../redis/RedisRepository.js";

export class FixedWindow {
  constructor(options) {
    this.limit = options.limit;
    this.window = options.window;
    this.strategy = options.strategy;
    this.keyGenerator = options.keyGenerator;
    this.redisRepo = new RedisRespository(options.redis);
  }

  //Try to read user, If exist check count and If allowed increment and return true.
  //If Not exist create one.

  async consume(userKey) {
    const final_key = redisLimitKey(this.strategy, userKey);
    const count = await this.redisRepo.increment(final_key);

    if (count === 1) {
      await this.redisRepo.expire(final_key, this.window);
    }
    const retryAfter = await this.redisRepo.ttl(final_key);
    const allowed = count <= this.limit;
    const remaining = count > this.limit? 0 : this.limit - count;

    return {
      allowed: allowed,
      remaining: remaining,
      limit: this.limit,
      retryAfter: retryAfter,
    };
  }
}

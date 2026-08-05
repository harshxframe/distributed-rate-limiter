export class RedisRespository {
  constructor(redis) {
    this.redis = redis;
  }

  async Store(data, key, ttl) {
    const value = JSON.stringify(data);
    return this.redis.set(key, value, { EX: ttl, NX: true });
  }

  async Read(key) {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async Update(data, key) {
    const value = JSON.stringify(data);
    const isUpdated = await this.redis.set(key, value, {
      XX: true,
      KEEPTTL: true,
    });
    return isUpdated === "OK";
  }

  async Delete(key) {
    return this.redis.del(key);
  }

  //++++++++++++++++++++++++++++++++++++++++++++
  async increment(key) {
    return await this.redis.incr(key);
  }

  async expire(key, ttl) {
    return await this.redis.expire(key, ttl);
  }

  async ttl(key) {
    return await this.redis.ttl(key);
  }

  //++++++++++++++++++++++++++++++++++++++++++
  // Need to implement redis repo for sliding window.

  async removeExpired(key, windowStart) {
    return await this.redis.zRemRangeByScore(key, "-inf", `(${windowStart}`);
  }

  async count(key) {
    return await this.redis.zCard(key);
  }

  async addStamp(key, now) {
    await this.redis.zAdd(key, {
      score: Number(now),
      value: crypto.randomUUID(),
    });
  }

  async oldestStamp(key) {
    const result = await this.redis.zRangeWithScores(key, 0, 0);
    if (result.length === 0) return null;
    return result[0].score;
  }

  // ++++++++++++++++++++++++++++++++++++++++++++
  async saveBucket(key, bucket) {
    await this.redis.hSet(key, bucket);
  }

  async getBucket(key) {
    const obj = await this.redis.hGetAll(key);
    if (Object.keys(obj).length === 0) {
      return {};
    }

    return {
      tokens: Number(obj.tokens),
      lastRefill: Number(obj.lastRefill),
    };
  }

  async deleteBucket(key) {
    await this.redis.hDel(key);
  }

  // +++++++++++++++++++++++++++++++++++++++++++
  async pushItem(key, value) {
    return await this.redis.rPush(key, String(value));
  }

  async popItem(key) {
    return await this.redis.lPop(key);
  }

  async getAllItems(key) {
    return await this.redis.lRange(key, 0, -1);
  }

  async size(key) {
    return await this.redis.lLen(key);
  }

  async peek(key) {
    return await this.redis.lIndex(key, 0);
  }

  async clear(key) {
    return await this.redis.del(key);
  }
  async saveLastLeakTime(key, timestamp) {
    return await this.redis.set(`${key}:lastLeak`, String(timestamp));
  }

  async getLastLeakTime(key) {
    const value = await this.redis.get(`${key}:lastLeak`);
    return value ? Number(value) : null;
  }

  async deleteLastLeakTime(key) {
    return await this.redis.del(`${key}:lastLeak`);
  }
}

/*
get()
set()
del()
incr()
expire()
ttl()

zadd()
zcount()
zremrangebyscore()

lpush()
rpop()
llen()
*/

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
}

export const redisLimitKey = (strategy, key) => {
  return `rate-limiter:${strategy}:${key}`;
};

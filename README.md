# Rate Limiter

A rate limiter built from scratch in Node.js and Redis to understand how different rate limiting algorithms work internally.

This project implements multiple algorithms instead of relying on existing libraries. The goal was to learn how modern rate limiters work, understand their trade-offs, and explore concurrency issues that appear in distributed systems.

---

## What I Built

- Fixed Window
- Sliding Window
- Token Bucket
- Leaky Bucket
- Express middleware
- Redis integration
- Custom key generators
- Standard rate limit headers
- Retry-After support
- Custom limit exceeded handler

---

## Why I Built It

Most developers use rate limiting libraries without understanding how they work internally.

This project was built to explore:

- How different rate limiting algorithms work
- The trade-offs between different strategies
- Redis data structures used by each algorithm
- Concurrency and race conditions
- How Redis can be used for scalable rate limiting

---

## Algorithms

| Algorithm | Accuracy | Burst Handling | Redis Memory | Best For |
|-----------|----------|----------------|--------------|----------|
| Fixed Window | Medium | Allows bursts at window boundaries | Low | Internal APIs |
| Sliding Window | High | Better burst control | Medium | Public APIs |
| Token Bucket | High | Excellent | Low | Authentication & API Gateways |
| Leaky Bucket | High | Constant request flow | Medium | Queues & Traffic Shaping |

---

## Quick Example

```js
RateLimiter({
    strategy: "SlidingWindow",
    limit: 100,
    window: 60000,
    redis,
    keyGenerator: req => req.ip
});
```

---

## Configuration

| Option | Description |
|---------|-------------|
| limit | Maximum requests allowed |
| window | Time window (milliseconds) |
| strategy | Rate limiting algorithm |
| redis | Connected Redis client |
| keyGenerator | Generates unique identifier |
| headers | Enables rate limit headers |
| identifier | Rate limit policy name |
| message | Default error message |
| onLimitReached | Custom callback |

---

## Current Status

### Completed

- ✅ Fixed Window
- ✅ Sliding Window
- ✅ Token Bucket
- ✅ Leaky Bucket
- ✅ Redis integration
- ✅ Express middleware
- ✅ Retry-After support
- ✅ Response headers
- ✅ High concurrency testing

### In Progress

- ⏳ Atomic Redis Lua scripts
- ⏳ EVALSHA optimization

### Planned

- Cluster testing
- Multi-node benchmarking
- TypeScript support
- Better documentation
- Performance benchmarks

---

## What I Learned

While building this project I explored:

- Redis Strings
- Redis Sorted Sets
- Redis Lists
- Rate limiting algorithms
- Redis expiration
- Concurrency
- Race conditions
- Distributed system fundamentals

One interesting finding was that a naive JavaScript implementation of Sliding Window suffers from race conditions under heavy concurrency, which is why production implementations usually rely on Redis Lua scripts for atomic execution.

---

## License

MIT
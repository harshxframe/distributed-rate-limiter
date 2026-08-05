import net from "node:net";

export const redisLimitKey = (strategy, key) => {
  if (typeof key === "string") {
    // IPv4-mapped IPv6
    if (key.startsWith("::ffff:")) {
      key = key.substring(7);
    }

    // localhost
    if (key === "::1") {
      key = "127.0.0.1";
    }

    // Normalize IP formatting only if it's actually an IP
    if (net.isIP(key)) {
      key = key.toLowerCase();
    }
  }

  return `rate-limiter:${strategy}:${key}`;
};
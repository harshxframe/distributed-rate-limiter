import { createStrategy } from "./strategies/StrategyFactory.js";
import { head_validator } from "./validators/head_validator.js";

export function RateLimiter({ limit, window, strategy, keyGenerator, redis, onLimitReached }) {
  try {
    const options = {
      limit,
      window: Math.ceil(window / 1000),
      strategy,
      keyGenerator,
      redis,
    };
    head_validator(options);

    const strategyInstance = createStrategy(options);

    return async (req, res, next) => {
      const key = keyGenerator(req);
      if (typeof key != "string" || key.trim() === "") {
        throw new Error("Key not valid");
      }
      const response = await strategyInstance.consume(key);
      if (!response.allowed) {
        return onLimitReached(req, res, next, response);
      }
      req.RateLimiter = response;
      next();
    };
  } catch (e) {
    console.error("\n=======================================================");
    console.error("[RATE LIMITER INITIALIZATION CRITICAL ERROR]");
    console.error("=======================================================");
    console.error(`\nReason: ${e.message}`);
    console.error("=======================================================\n");
    process.exit(1);
  }
}

import { createStrategy } from "./strategies/StrategyFactory.js";
import { head_validator } from "./validators/head_validator.js";

export function RateLimiter({ limit, window, strategy, keyGenerator, redis }) {
  try {
    const options = {
      limit,
      window,
      strategy,
      keyGenerator,
      redis,
    };
    head_validator(options);
    const strategyInstance = createStrategy(options);

    return (req, res, next) => {
      next();
    };
  } catch (e) {
    throw e;
  }
}

import { createStrategy } from "./strategies/StrategyFactory.js";
import { attachHeader } from "./utils/addHeaders.js";
import { head_validator } from "./validators/head_validator.js";

export function RateLimiter({
  limit,
  window,
  strategy,
  keyGenerator,
  redis,
  message,
  onLimitReached,
  headers,
  identifier
}) {
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
      const result = await strategyInstance.consume(key);
      identifier = identifier || "default";
      result["identifier"] = identifier;
      req.rateLimit = result; 
      headers? attachHeader(res, result, identifier):()=>{};

      
      if (!result.allowed) {
        if (onLimitReached) {
          return onLimitReached(req, res, next, result);
        }
        return res.status(429).json({
          success: false,
          message: message || "Limit exceeded",
          retryAfter: result.retryAfter,
        });
      }



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

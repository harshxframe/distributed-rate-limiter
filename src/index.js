import { head_validator } from "./validators/head_validator.js";

function RateLimiter({ limit, window, strategy, keyGenerator, redis }) {
  try {
    const obj = {
      limit,
      window,
      strategy,
      keyGenerator,
      redis,
    };
    head_validator(obj);


  } catch (e) {
    console.log(e.message);
  }
}

RateLimiter({limit:100, window:60000, keyGenerator:()=>{return "key"}});
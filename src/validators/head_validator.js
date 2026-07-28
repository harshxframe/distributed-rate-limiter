import { strategies } from "../constants/strategies.js";

export function head_validator(obj) {
  const { limit, window, strategy, keyGenerator, redis } = obj;

  if (typeof limit != "number" || limit <= 0) {
    throw new Error("Configration incorrect");
  }
  if (typeof window != "number" || window <= 0) {
    throw new Error("Configration incorrect");
  }
  if (
    (!redis && typeof redis?.get != "function") ||
    typeof redis?.set != "function" ||
    typeof redis?.incr != "function" ||
    typeof redis?.expire != "function" ||
    typeof redis?.eval != "function"
  ) {
    throw new Error("Redis Configration incorrect");
  }
  if (typeof keyGenerator != "function") {
    throw new Error("KeyGenerator Configration incorrect");
  }

  if (!strategies[strategy]) {
    throw new Error("Strategy Configuration incorrect");
  }
}

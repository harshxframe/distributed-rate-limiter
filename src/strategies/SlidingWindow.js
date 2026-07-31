import { RedisRespository } from "../redis/RedisRepository.js";

RedisRespository

export class SlidingWindow{
     constructor(options) {
        this.limit = options.limit;
        this.window = options.window;
        this.strategy = options.strategy;
        this.keyGenerator = options.keyGenerator;
        this.redisRepo = new RedisRespository(options.redis);
      }

      // When the request came 
      consume(userKey){
        

      }









}
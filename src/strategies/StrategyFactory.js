import { FixedWindow } from "./FixedWindow.js";
import { SlidingWindow } from "./SlidingWindow.js";
import { TokenBucket } from "./TokenBucket.js";


export function createStrategy(options){
switch(options.strategy){
case "FixedWindow":
    return new FixedWindow(options);
case "SlidingWindow":
    return new SlidingWindow(options);
case "TokenBucket":
    return new TokenBucket(options);

default:
    throw new Error("Strategy not valid");
}
}
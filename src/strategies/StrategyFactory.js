import { FixedWindow } from "./FixedWindow.js";
import { SlidingWindow } from "./SlidingWindow.js";


export function createStrategy(options){
switch(options.strategy){
case "FixedWindow":
    return new FixedWindow(options);
case "SlidingWindow":
    return new SlidingWindow(options);

default:
    throw new Error("Strategy not valid");
}
}
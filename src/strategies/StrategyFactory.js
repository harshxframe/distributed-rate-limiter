import { FixedWindow } from "./FixedWindow.js";


export function createStrategy(options){
switch(options.strategy){
case "FixedWindow":
    return new FixedWindow(options);

default:
    throw new Error("Strategy not valid");
}
}
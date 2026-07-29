export class FixedWindow {
  constructor(options) {
    console.log(options);
    ((this.limit = options.limit),
      (this.window = options.window),
      (this.strategy = options.strategy),
      (this.keyGenerator = options.keyGenerator),
      (this.redis = options.redis));
  }
  run() {}
}

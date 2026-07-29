import express from "express";
import { createClient } from "redis";
import { RateLimiter } from "../src/index.js";

const app = express();

const client = await createRedisClient();

app.use(RateLimiter({
    limit:10,
    window:60000,
    strategy:"FixedWindow",
    keyGenerator:()=> "abc",
    redis:client
}));
app.get("/", async (req, res) => {
  await client.set("key", "value");
  const value = await client.get("key");

  res.send(value);
});

app.listen(2020, () => {
  console.log("Server started");
});

async function createRedisClient() {
  const client = createClient();

  client.on("error", (err) => {
    console.error(err);
  });

  await client.connect();

  return client;
}
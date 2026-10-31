import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => console.log("Gateway connected to Redis"));
redis.on("error", (err) => console.log("Gateway Redis error:", err));

export default redis;
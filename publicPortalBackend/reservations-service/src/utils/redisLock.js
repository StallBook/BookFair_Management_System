import { createClient } from "redis";
import { randomUUID } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    database: 2
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

await redisClient.connect();


export const acquireLock = async (key, ttl = 5000) => {
    const token = randomUUID();

    // SET key value NX PX ttl  => only set if not exists
    const result = await redisClient.set(key, token, {
        NX: true,
        PX: ttl,
    });

    if (result === "OK") {
        console.log(`Lock acquired: ${key}`);
        return token;
    }

    console.log(`Lock unavailable: ${key}`);
    return null;
};


export const releaseLock = async (key, token) => {
    if (!key || !token) return;

    const storedToken = await redisClient.get(key);
    if (storedToken === token) {
        await redisClient.del(key);
        console.log(`Lock released: ${key}`);
    } else {
        console.warn(`Lock release skipped — token mismatch for ${key}`);
    }
};

export default redisClient;

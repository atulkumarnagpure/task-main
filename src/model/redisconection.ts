import { createClient } from "redis";

export const redisClient = createClient({
    url: "redis://localhost:6379"
});

redisClient.on("error", (err) => {
    console.error(" Redis Error:", err.message);
});

redisClient.on("connect", () => {
    console.log("Redis connecting...");
});

redisClient.on("ready", () => {
    console.log(" Redis connected");
});

redisClient.on("end", () => {
    console.log(" Redis connection closed");
});

export async function connectRedis() {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (err: any) {
        console.error(" Failed to connect Redis:", err.message);
        process.exit(1); 
    }
}

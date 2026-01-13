"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.connectRedis = connectRedis;
const redis_1 = require("redis");
exports.redisClient = (0, redis_1.createClient)({
    url: "redis://localhost:6379"
});
// 🔴 Always listen for errors
exports.redisClient.on("error", (err) => {
    console.error("❌ Redis Error:", err.message);
});
// 🟢 Optional but useful logs
exports.redisClient.on("connect", () => {
    console.log("🔗 Redis connecting...");
});
exports.redisClient.on("ready", () => {
    console.log("✅ Redis connected");
});
exports.redisClient.on("end", () => {
    console.log("⚠️ Redis connection closed");
});
// ✅ Proper async connect wrapper
async function connectRedis() {
    try {
        if (!exports.redisClient.isOpen) {
            await exports.redisClient.connect();
        }
    }
    catch (err) {
        console.error("❌ Failed to connect Redis:", err.message);
        process.exit(1); // fail fast (recommended)
    }
}

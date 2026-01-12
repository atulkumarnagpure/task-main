"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userratelimiterbyIp = exports.userratelimiter = void 0;
exports.rateLimiter = rateLimiter;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.userratelimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    keyGenerator: (req) => {
        console.log(req?.users, "--------req------");
        return req?.users?.id;
    },
    handler: (req, res) => {
        res.status(400).json({
            success: false,
            message: "To many request. per minute 5 request is allow.."
        });
    },
    standardHeaders: true,
    legacyHeaders: false
});
exports.userratelimiterbyIp = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 20,
    keyGenerator: (req) => {
        return req?.req?.ip;
    },
    handler: (req, res) => {
        res.status(400).json({
            success: false,
            message: "To many request. Each Ip have  20 request per minut is allow.."
        });
    },
    standardHeaders: true,
    legacyHeaders: false
});
const USER_LIMIT = 5;
const IP_LIMIT = 20;
const WINDOW_MS = 60 * 1000;
const userLimits = new Map();
const ipLimits = new Map();
function rateLimiter(req, res, next) {
    const userId = req.header("userId");
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
    if (!userId)
        return res.status(400).json({ message: "UserId is required.." });
    const now = Date.now();
    const userData = userLimits.get(userId);
    console.log(userData, "------------userData--------");
    if (!userData || now - userData.startTime > WINDOW_MS) {
        userLimits.set(userId, { count: 1, startTime: now });
    }
    else {
        userData.count++;
        if (userData.count > USER_LIMIT) {
            return res.status(400).json({
                success: false,
                message: "User rate limit exceeded (5 requests per minute)"
            });
        }
    }
    const ipData = ipLimits.get(ip);
    if (!ipData || now - ipData.startTime > WINDOW_MS) {
        ipLimits.set(ip, { count: 1, startTime: now });
    }
    else {
        ipData.count++;
        if (ipData.count > IP_LIMIT) {
            return res.status(400).json({
                success: false,
                message: "IP rate limit exceeded (20 requests per minute)"
            });
        }
    }
    next();
}

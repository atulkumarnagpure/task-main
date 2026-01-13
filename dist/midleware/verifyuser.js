"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = rateLimiter;
const mysqlconnectin_1 = require("../model/mysqlconnectin");
// ==============================rate limiter=============================
// export const userratelimiter = rateLimit({
//     windowMs: 60 * 1000,
//     max: 5,
//     keyGenerator: (req: Request): string => {
//         console.log((req as any)?.users, "--------req------");
//         return (req as any)?.users?.id;
//     },
//     handler: (req: Request, res: Response) => {
//         res.status(400).json({
//             success: false,
//             message: "To many request. per minute 5 request is allow.."
//         });
//     },
//     standardHeaders: true,
//     legacyHeaders: false
// });
// export const userratelimiterbyIp = rateLimit({
//     windowMs: 60 * 1000,
//     max: 20,
//     keyGenerator: (req: Request): string => {
//         return (req as any)?.req?.ip;
//     },
//     handler: (req: Request, res: Response) => {
//         res.status(400).json({
//             success: false,
//             message: "To many request. Each Ip have  20 request per minut is allow.."
//         });
//     },
//     standardHeaders: true,
//     legacyHeaders: false
// });
//================================system memory==========================================
// type RateData = {
//     count: number;
//     startTime: number;
// };
// const USER_LIMIT = 5;
// const IP_LIMIT = 20;
// const WINDOW_MS = 60 * 1000;
// const userLimits = new Map<string, RateData>();
// const ipLimits = new Map<string, RateData>();
// export function rateLimiter(req: Request, res: Response, next: NextFunction) {
//     const userId = req.header("userId");
//     const ip: any = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.ip;
//     if (!userId) return res.status(400).json({ message: "UserId is required.." })
//     const now = Date.now()
//     const userData = userLimits.get(userId);
//     console.log(userData, "------------userData--------");
//     if (!userData || now - userData?.startTime > WINDOW_MS) {
//         console.log("------------1");
//         userLimits.set(userId, { count: 1, startTime: now });
//     } else {
//         console.log('--0');
//         userData.count++;
//         if (userData?.count > USER_LIMIT) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User rate limit exceeded (5 requests per minute)"
//             });
//         }
//     }
//     const ipData = ipLimits.get(ip);
//     if (!ipData || now - ipData.startTime > WINDOW_MS) {
//         ipLimits.set(ip, { count: 1, startTime: now });
//     } else {
//         ipData.count++;
//         if (ipData.count > IP_LIMIT) {
//             return res.status(400).json({
//                 success: false,
//                 message: "IP rate limit exceeded (20 requests per minute)"
//             });
//         }
//     }
//     next();
// }
// =======================mysql================================================
async function checkLimit(key, limit, now) {
    const [rows] = await mysqlconnectin_1.mysqldb.query("SELECT count, start_time FROM rate_limits WHERE rate_key = ?", [key]);
    if (rows?.length === 0) {
        await mysqlconnectin_1.mysqldb.query("INSERT INTO rate_limits (rate_key, count, start_time) VALUES (?, ?, ?)", [key, 1, now]);
        return true;
    }
    const { count, start_time } = rows[0];
    if (now - start_time > WINDOW_MS) {
        await mysqlconnectin_1.mysqldb.query("UPDATE rate_limits SET count = 1, start_time = ? WHERE rate_key = ?", [now, key]);
        return true;
    }
    if (count >= limit)
        return false;
    await mysqlconnectin_1.mysqldb.query("UPDATE rate_limits SET count = count + 1 WHERE rate_key = ?", [key]);
    return true;
}
const USER_LIMIT = 5;
const IP_LIMIT = 20;
const WINDOW_MS = 60 * 1000;
async function rateLimiter(req, res, next) {
    try {
        const userId = req.header("userId");
        if (!userId) {
            return res.status(400).json({ message: "UserId required" });
        }
        const ip = req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.ip;
        const now = Date.now();
        const userAllowed = await checkLimit(`user:${userId}`, USER_LIMIT, now);
        if (!userAllowed) {
            return res.status(429).json({
                message: "User rate limit exceeded (5/min)"
            });
        }
        const ipAllowed = await checkLimit(`ip:${ip}`, IP_LIMIT, now);
        if (!ipAllowed) {
            return res.status(429).json({
                message: "IP rate limit exceeded (20/min)"
            });
        }
        next();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Rate limiter error" });
    }
}
//=====================================rediss==================
// const USER_LIMIT = 5;
// const IP_LIMIT = 20;
// const WINDOW_SEC = 60;
// async function checkLimit(key: string, limit: number): Promise<boolean> {
//     const count = await redisClient.incr(key);
//     if (count === 1) {
//         await redisClient.expire(key, WINDOW_SEC);
//     }
//     return count <= limit;
// }
// export async function rateLimiter(
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) {
//     try {
//         const userId = req.header("userId");
//         if (!userId) {
//             return res.status(400).json({ message: "UserId required" });
//         }
//         const ip =(req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.ip;
//         const userKey = `rate:user:${userId}`;
//         const ipKey = `rate:ip:${ip}`;
//         const userAllowed = await checkLimit(userKey, USER_LIMIT);
//         if (!userAllowed) {
//             return res.status(429).json({
//                 message: "User rate limit exceeded (5/min)"
//             });
//         }
//         const ipAllowed = await checkLimit(ipKey, IP_LIMIT);
//         if (!ipAllowed) {
//             return res.status(429).json({
//                 message: "IP rate limit exceeded (20/min)"
//             });
//         }
//         next();
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Rate limiter error" });
//     }
// }

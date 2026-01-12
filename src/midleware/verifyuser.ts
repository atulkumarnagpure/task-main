import { NextFunction, Request, Response } from "express";
import { mysqldb } from "../model/mysqlconnectin";
import rateLimit from "express-rate-limit";


export const userratelimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    keyGenerator: (req: Request): string => {
        console.log((req as any)?.users, "--------req------");
        return (req as any)?.users?.id;
    },
    handler: (req: Request, res: Response) => {
        res.status(400).json({
            success: false,
            message: "To many request. per minute 5 request is allow.."
        });

    },
    standardHeaders: true,
    legacyHeaders: false

});

export const userratelimiterbyIp = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    keyGenerator: (req: Request): string => {
        return (req as any)?.req?.ip;
    },
    handler: (req: Request, res: Response) => {
        res.status(400).json({
            success: false,
            message: "To many request. Each Ip have  20 request per minut is allow.."
        });

    },
    standardHeaders: true,
    legacyHeaders: false



});

type RateData = {
    count: number;
    startTime: number;
};


const USER_LIMIT = 5;
const IP_LIMIT = 20;
const WINDOW_MS = 60 * 1000;

const userLimits = new Map<string, RateData>();
const ipLimits = new Map<string, RateData>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
    const userId = req.header("userId");
    const ip: any = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.ip;

    if (!userId) return res.status(400).json({ message: "UserId is required.." })

    const now = Date.now()
    const userData = userLimits.get(userId);
    console.log(userData, "------------userData--------");
    if (!userData || now - userData.startTime > WINDOW_MS) {
        userLimits.set(userId, { count: 1, startTime: now });
    } else {
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
    } else {
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
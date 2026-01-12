import { NextFunction, Request, Response } from "express";
import { mysqldb } from "../model/mysqlconnectin";
import rateLimit from "express-rate-limit";

// export const rateLimiter = async (header: any) => {

//     console.log(header?.userid, "-----------header");


//     const data: any = await mysqldb.query(`SELECT * FROM usercount where userid=${header?.userid}`)

//     console.log(data[0][0]?.requestCount, "-----------count------");

//     // await mysqldb.mysqldb

// }



const userratelimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    keyGenerator: (req: Request): string => {
        console.log(req, "--------req------");
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
        console.log(req, "--------req------");
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

export default userratelimiter

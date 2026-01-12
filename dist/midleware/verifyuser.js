"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userratelimiterbyIp = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// export const rateLimiter = async (header: any) => {
//     console.log(header?.userid, "-----------header");
//     const data: any = await mysqldb.query(`SELECT * FROM usercount where userid=${header?.userid}`)
//     console.log(data[0][0]?.requestCount, "-----------count------");
//     // await mysqldb.mysqldb
// }
const userratelimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    keyGenerator: (req) => {
        console.log(req, "--------req------");
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
        console.log(req, "--------req------");
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
exports.default = userratelimiter;

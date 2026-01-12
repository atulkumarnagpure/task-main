import { Request, Response, Router } from "express";
import { usersData } from "../component/getdata";
import userratelimiter, { userratelimiterbyIp } from "../midleware/verifyuser";

const route = Router()
route.use('/data',
    //      async (req: any, res: any, next: any) => {
    //     // rateLimiter(req.headers)
    //      next();
    // }
    userratelimiter, userratelimiterbyIp, usersData);

export default route
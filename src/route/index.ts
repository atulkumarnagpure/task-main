import { Request, Response, Router } from "express";
import { usersData } from "../component/getdata";
import  { userratelimiterbyIp ,userratelimiter, rateLimiter} from "../midleware/verifyuser";

const route = Router()
route.use('/data',rateLimiter,usersData);

export default route
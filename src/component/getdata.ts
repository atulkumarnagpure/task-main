import { Request, Response, Router } from "express";
import { mysqldb } from "../model/mysqlconnectin";

export const usersData = Router().get('/get-users-detail', async (req: Request, res: Response) => {
    try {
        
        const data: any = await mysqldb.query("SELECT * FROM users")
        if (!data[0]) return res.status(401).json({ message: "Users not exist.." })

        console.log(data[0]);
        return res.status(200).json({
            result: data[0],
            message: "Data fetch succesfully.."
        })
    } catch (error) {
        console.log(error, "-----------");
        return res.status(500).json({ error: "server error.." })
    }
})
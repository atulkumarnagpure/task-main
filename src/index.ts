import express  from "express";
import { port } from "./config/envconfig";
import { mysqlconection } from "./model/mysqlconnectin";
import route from "./route";
import { connectRedis } from "./model/redisconection";


const app=express()

app.use(express.json());
app.use('/',route)

app.listen(port,async()=>{
    await connectRedis()
    await mysqlconection()
    console.log(`server runing on ${port}`);
})
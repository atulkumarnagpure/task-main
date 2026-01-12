import express  from "express";
import { port } from "./config/envconfig";
import { mysqlconection } from "./model/mysqlconnectin";
import route from "./route";


const app=express()

app.use(express.json());
app.use('/',route)

app.listen(port,async()=>{
    await mysqlconection()
    console.log(`server runing on ${port}`);
})
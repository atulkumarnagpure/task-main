"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const envconfig_1 = require("./config/envconfig");
const mysqlconnectin_1 = require("./model/mysqlconnectin");
const route_1 = __importDefault(require("./route"));
const redisconection_1 = require("./model/redisconection");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', route_1.default);
app.listen(envconfig_1.port, async () => {
    await (0, redisconection_1.connectRedis)();
    await (0, mysqlconnectin_1.mysqlconection)();
    console.log(`server runing on ${envconfig_1.port}`);
});

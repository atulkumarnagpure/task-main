"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlconection = exports.mysqldb = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
exports.mysqldb = promise_1.default.createPool({
    host: 'localhost',
    user: "root",
    password: "Atul@1234",
    database: "testdb"
});
exports.mysqlconection = (async () => {
    try {
        await exports.mysqldb.getConnection();
        console.log("Mysql connected..");
    }
    catch (error) {
        console.error("MySQL Connection Failed:", error);
    }
});

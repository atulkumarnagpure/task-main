"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersData = void 0;
const express_1 = require("express");
const mysqlconnectin_1 = require("../model/mysqlconnectin");
exports.usersData = (0, express_1.Router)().get('/get-users-detail', async (req, res) => {
    try {
        const data = await mysqlconnectin_1.mysqldb.query("SELECT * FROM users");
        if (!data[0])
            return res.status(401).json({ message: "Users not exist.." });
        console.log(data[0]);
        return res.status(200).json({
            result: data[0],
            message: "Data fetch succesfully.."
        });
    }
    catch (error) {
        console.log(error, "-----------");
        return res.status(500).json({ error: "server error.." });
    }
});

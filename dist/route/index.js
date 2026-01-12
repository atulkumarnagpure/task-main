"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getdata_1 = require("../component/getdata");
const verifyuser_1 = require("../midleware/verifyuser");
const route = (0, express_1.Router)();
route.use('/data', verifyuser_1.rateLimiter, getdata_1.usersData);
exports.default = route;

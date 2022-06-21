"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
require("dotenv").config();
const Client_1 = require("./structures/Client");
exports.client = new Client_1.Bot("data.csv", ["discord_id", "wallet_addr"]);
exports.client.start();

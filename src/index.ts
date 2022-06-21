require("dotenv").config();
import { Bot } from "./structures/Client";

export const client = new Bot("data.csv", ["discord_id", "wallet_addr"]);

client.start();

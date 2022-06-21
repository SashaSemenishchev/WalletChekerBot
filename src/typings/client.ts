import { ApplicationCommandDataResolvable } from "discord.js";
import { CsvWriter } from "./CsvWriter";

export interface RegisterCommandsOptions {
    guildId?: string;
    commands: ApplicationCommandDataResolvable[];
}

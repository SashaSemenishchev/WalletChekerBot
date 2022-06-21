import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection,
    CommandInteractionOptionResolver
} from "discord.js";
import { CommandType, ExtendedInteraction } from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";
import { CsvWriter } from "../typings/CsvWriter";

const globPromise = promisify(glob);

export class Bot extends Client {
    commands: Collection<string, CommandType> = new Collection();
    writer: CsvWriter;

    constructor(dataFile: string, rowNames: string[]) {
        super({ intents: 32767 });
        this.writer = new CsvWriter(dataFile, rowNames);
        this.on("guildCreate", (guild) => {
            try {
                guild.commands.set(this.slashCommands);
            } catch (e) {
                console.error(e);
            }
        });
    }

    start() {
        this.registerModules();
        this.login(process.env.botToken);
    }
    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            
        this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering commands to ${guildId}`);
        } else {
            console.log(commands);
            this.application?.commands.set(commands);
            console.log("Registering global commands");
        }
    }
    slashCommands: ApplicationCommandDataResolvable[] = [];
    async registerModules() {
        // Commands

        await this.createCommand("../commands/ping.ts");

        this.on("ready", () => {
            this.registerCommands({
                commands: this.slashCommands,
                guildId: process.env.guildId
            });
        });

        this.createEvent("../events/interactionCreate.ts");
        this.createEvent("../events/ready.ts");
    }

    async createEvent(filePath: string) {
        const event: Event<keyof ClientEvents> = await this.importFile(
            filePath
        );
        this.on(event.event, event.run);

    }

    async createCommand(filePath: string) {
        console.log(filePath)
        const command: CommandType = await this.importFile(filePath);
        if (!command.name) return;
        console.log(command);

        this.commands.set(command.name, command);
        this.slashCommands.push(command);
    }
}

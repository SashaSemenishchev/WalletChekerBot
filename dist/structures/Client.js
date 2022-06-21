"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const glob_1 = tslib_1.__importDefault(require("glob"));
const util_1 = require("util");
const CsvWriter_1 = require("../typings/CsvWriter");
const globPromise = (0, util_1.promisify)(glob_1.default);
class Bot extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    writer;
    constructor(dataFile, rowNames) {
        super({ intents: 32767 });
        this.writer = new CsvWriter_1.CsvWriter(dataFile, rowNames);
        this.on("guildCreate", (guild) => {
            try {
                guild.commands.set(this.slashCommands);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    start() {
        this.registerModules();
        this.login(process.env.botToken);
    }
    async importFile(filePath) {
        return (await Promise.resolve().then(() => tslib_1.__importStar(require(filePath))))?.default;
    }
    async registerCommands({ commands, guildId }) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering commands to ${guildId}`);
        }
        else {
            console.log(commands);
            this.application?.commands.set(commands);
            console.log("Registering global commands");
        }
    }
    slashCommands = [];
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
    async createEvent(filePath) {
        const event = await this.importFile(filePath);
        this.on(event.event, event.run);
    }
    async createCommand(filePath) {
        console.log(filePath);
        const command = await this.importFile(filePath);
        if (!command.name)
            return;
        console.log(command);
        this.commands.set(command.name, command);
        this.slashCommands.push(command);
    }
}
exports.Bot = Bot;

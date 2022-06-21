"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../structures/Command");
exports.default = new Command_1.Command({
    name: "postcheck",
    description: "Posts an embed with users can interact",
    run: async ({ interaction }) => {
        if (!interaction.member.permissions.has([discord_js_1.Permissions.FLAGS.ADMINISTRATOR, discord_js_1.Permissions.FLAGS.MANAGE_GUILD])) {
            return await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }
        await interaction.deferReply({ ephemeral: true });
        await interaction.followUp({ content: "Successfully finished!", ephemeral: true });
        // send an embed with interaction buttons
        await interaction.channel.send({ content: null, embeds: [], components: [
                new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton().setStyle("PRIMARY").setCustomId("set_addr").setLabel("Set wallet address"), new discord_js_1.MessageButton().setStyle("SUCCESS").setCustomId("check_addr").setLabel("Check wallet address")),
            ] });
    }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const discord_js_1 = require("discord.js");
const __1 = require("..");
const Event_1 = require("../structures/Event");
exports.default = new Event_1.Event("interactionCreate", async (interaction) => {
    // Chat Input Commands
    if (interaction.isCommand()) {
        const command = __1.client.commands.get(interaction.commandName);
        if (!command) {
            return;
        }
        command.run({
            args: interaction.options,
            client: __1.client,
            interaction: interaction
        });
    }
    else if (interaction.isButton()) {
        if (interaction.customId === "set_addr") {
            let modal = new discord_js_1.Modal().setCustomId("modal_set_addr").setTitle("Set Wallet Address");
            let row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.TextInputComponent()
                .setCustomId('wallet_addr')
                .setLabel("Adress")
                // Paragraph means multiple lines of text.
                .setStyle('PARAGRAPH'));
            modal.addComponents(row);
            await interaction.showModal(modal);
        }
        else if (interaction.customId === "check_addr") {
            // todo: check modal address
            await interaction.deferReply({ ephemeral: true });
            let interactionData = __1.client.writer.getRowByFirstValue(interaction.user.id.toString());
            if (interactionData.length > 0) {
                await interaction.followUp({ content: `Your wallet address is \`${interactionData[1]}\``, ephemeral: true });
            }
            else {
                await interaction.followUp({ content: "You have not set a wallet address yet.", ephemeral: true });
            }
        }
    }
    else if (interaction.isModalSubmit()) {
        if (interaction.customId === "modal_set_addr") {
            let address = interaction.fields.getTextInputValue('wallet_addr');
            let onCurve = false;
            try {
                onCurve = web3_js_1.PublicKey.isOnCurve(address);
            }
            catch (e) {
                onCurve = false;
            }
            if (onCurve) {
                let userId = interaction.user.id.toString();
                __1.client.writer.updateRow(userId, [userId, address]);
                interaction.reply({ content: "Successfully set your wallet address", ephemeral: true });
            }
            else {
                interaction.reply({ content: "Invalid address", ephemeral: true });
            }
        }
    }
});

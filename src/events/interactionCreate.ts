import { PublicKey } from "@solana/web3.js";
import { time } from "console";
import { CommandInteractionOptionResolver, MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from "discord.js";
import { writer } from "repl";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";
import {setTimeout} from "node:timers/promises"

export default new Event("interactionCreate", async (interaction) => {
    // Chat Input Commands
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            return;
        }
        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        });
    } else if(interaction.isButton()) {
        if(interaction.customId === "set_addr") {
            let modal = new Modal().setCustomId("modal_set_addr").setTitle("Set Wallet Address");
            let row = new MessageActionRow<ModalActionRowComponent>().addComponents(new TextInputComponent()
			.setCustomId('wallet_addr')
			.setLabel("Adress")
		    // Paragraph means multiple lines of text.
			.setStyle('PARAGRAPH'))
            modal.addComponents(row)
            await interaction.showModal(modal)
        } else if(interaction.customId === "check_addr") {
            // todo: check modal address
            await interaction.deferReply({ephemeral: true});
            let interactionData = client.writer.getRowByFirstValue(interaction.user.id.toString());
            console.log(interactionData)
            if(interactionData.length > 0) {
                await interaction.followUp({content: `Your wallet address is \`${interactionData[1]}\``, ephemeral: true});
            } else {
                await interaction.followUp({content: "You have not set a wallet address yet.", ephemeral: true});
            }
        }
    } else if(interaction.isModalSubmit()) {
        if(interaction.customId === "modal_set_addr") {
            let address = interaction.fields.getTextInputValue('wallet_addr')
            let onCurve: boolean = false
            try {
                onCurve = PublicKey.isOnCurve(address)
            } catch (e) {
                onCurve = false
            }
            if(onCurve) {
                client.writer.writeRow([interaction.user.id, address])
                interaction.reply({content: "Successfully set your wallet address", ephemeral: true})
            } else {
                interaction.reply({content: "Invalid address", ephemeral: true})
            }
        }
    }
});

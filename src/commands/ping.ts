import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import { client } from "..";
import { Command } from "../structures/Command";

export default new Command({
    name: "postcheck",
    description: "Posts an embed with users can interact",
    run: async ({ interaction }) => {
        if(!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR, Permissions.FLAGS.MANAGE_GUILD])) {
            return await interaction.reply({content: "You do not have permission to use this command.", ephemeral: true});
        }
        await interaction.deferReply({ ephemeral: true });
        await interaction.followUp({content: "Successfully finished!", ephemeral: true});
        // send an embed with interaction buttons
        await interaction.channel.send({content: null, embeds: [
            
        ], components: [
            new MessageActionRow().addComponents(
                new MessageButton().setStyle("PRIMARY").setCustomId("set_addr").setLabel("Set wallet address"),
                new MessageButton().setStyle("SUCCESS").setCustomId("check_addr").setLabel("Check wallet address")
            ),
        ]})
    }
});



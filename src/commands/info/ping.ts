import { Command } from "../../structures/Command";

export default new Command({
    name: "postcheckwallet",
    description: "Posts an embed with users can interact",
    run: async ({ interaction }) => {
        interaction.followUp("Pong3");
    }
});



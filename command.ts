import Discord from "discord.js";
import BotState from "./BotState";

interface Command {
    name: string,
    description: string,
    aliases: string[],
    execute(client: Discord.Client, state: BotState, message: Discord.Message, args: string[]): void;

}
export default Command;
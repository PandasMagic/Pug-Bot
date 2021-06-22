import Discord from "discord.js";
import BotState from "./BotState";
import {PermissionHelper} from "./util/PermissionHelper";
import { ServerState } from "./util/ServerState";

interface Command {
    name: string,
    description: string,
    aliases: string[],
    disabled?: boolean,
    hidden?: boolean,
    required_permissions: PermissionHelper.Permission[];
    // permissions: [];
    execute(client: Discord.Client, state: BotState, serverState: ServerState, message: Discord.Message, args: string[]): void;

}
export default Command;
import Discord from 'discord.js'
import Command from './command';
class BotState {
    commands: Discord.Collection<String, Command>;
    prefix =  '.';
    constructor() {
        this.commands = new Discord.Collection();
    }

}
export default BotState;
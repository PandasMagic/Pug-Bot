import Discord from 'discord.js'
import Command from './command';
import ClanApiClient from './util/ClanApiClient';
import LocalClanState from './util/LocalClanState';
class BotState {
    commands: Discord.Collection<String, Command>;
    prefix =  '.';
    clanState: LocalClanState;
    clanClient: ClanApiClient;
    constructor() {
        this.commands = new Discord.Collection();

    }

}
export default BotState;
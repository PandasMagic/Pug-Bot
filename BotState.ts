import Discord from 'discord.js'
import { JsonDB } from 'node-json-db';
import Command from './command';
import ClanApiClient from './util/ClanApiClient';
import LocalClanState from './util/LocalClanState';

class BotState {
    commands: Discord.Collection<String, Command>;
    prefix = '.';
    clanState: Discord.Collection<Discord.Guild, LocalClanState>;
    clanClient: ClanApiClient;
    db: JsonDB;
    constructor() {
        this.commands = new Discord.Collection();
        this.clanState = new Discord.Collection();
        this.clanClient = null;
    }

}
export default BotState
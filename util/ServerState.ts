import Discord from 'discord.js'
import LocalClanState from './LocalClanState';

// class ServerState {
//     prefix = '.';
//     // clanState: Discord.Collection<Discord.Guild, LocalClanState>;
//     clanstate: LocalClanState;
//     constructor() {
//         // this.clanState = new Discord.Collection();

//     }

// }

interface ServerState {
    prefix: string;
    clanstate: LocalClanState;

}
function getDefaultServerState(): ServerState {
    return {
        prefix: '.',
        clanstate: null
    }
}
// class ServerState
export { getDefaultServerState, ServerState };
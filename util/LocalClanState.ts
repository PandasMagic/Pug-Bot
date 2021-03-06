import { getDiffieHellman } from 'crypto';
import fs from 'fs'
import ClanApiClient, { ClanStatus, MemberStatus } from './ClanApiClient';
interface LocalClanData {
    gid: string,
    members: LocalMemberData[],
    name: string,
    fid: string,
    motto: string,
    discord: string,

}
interface LocalMemberData {
    id: string,
    name: string,
    deployed: boolean,
    weeklyScore: number,
    cpPoints: number,
    lastDeployed: number,
    lastPointUpdated: number
}

class LocalClanState {
    clanData: LocalClanData;
    filePath: string;
    constructor(filename) {
        this.filePath = filename;
        if (fs.existsSync(filename)) {
            let filedata = fs.readFileSync(filename).toString();
            this.clanData = JSON.parse(filedata);

        } else {
            this.clanData = {
                gid: '2',
                name: 'PClan',
                fid: '2622',
                motto: 'PClient Gang (You must join our discord and post in applications to join)',
                discord: 'https://discord.gg/aGgkTSS3Dd',
                members: []
            }
        }
    }
    getDeployedMembers() : LocalMemberData[]{
        let deployed = []
        for (let mem of this.clanData.members) {
            if (mem.deployed) {
                deployed.push(mem);
            }
        }
        return deployed;

    }
    async update(clanstatus: ClanStatus) {
        this.clanData.name = clanstatus.name;
        this.clanData.fid = clanstatus.fid;
        this.clanData.motto = clanstatus.motto;
        this.clanData.discord = clanstatus.discord;
        for (let member of clanstatus.members) {
            let localmem = this.clanData.members.find((elem) => { return elem.id == member.id })
            if (!localmem) { //Create new local Mem
                console.log("PlayerName")
                console.log(member.playerName)
                let stats = await ClanApiClient.getPlayerStats(member.playerName);
                // console.log(stats)
                //https://ev.io/user/19945?_format=json
                let weeklyscore = stats['field_weekly_score'][0]['value'];
                this.clanData.members.push({
                    id: member.id,
                    name: member.playerName,
                    deployed: member.deployed,
                    weeklyScore: weeklyscore,
                    cpPoints: -1,
                    lastDeployed: 0,
                    lastPointUpdated: 0.
                })
            } else {
                if (!localmem.deployed && member.deployed) { //User got deployed
                    console.log("Detected Deployment: " + localmem.name);
                    localmem.lastDeployed = Date.now();
                }
                localmem.deployed = member.deployed;
            }


        }


        for (let memberindex in this.clanData.members) {
            let member = this.clanData.members[memberindex]
            let remotemem = clanstatus.members.find((elem) => { return elem.id == member.id })
            if (!remotemem) {
                // this.clanData.members.splice(memberindex, 1);
                console.log("TODO REMOVE USERS no longer in clan!: " + member.name);
            }
        }

    }
    generateClanStatus(): ClanStatus {
        return {
            gid: this.clanData.gid,
            name: this.clanData.name,
            fid: this.clanData.fid,
            motto: this.clanData.motto,
            discord: this.clanData.discord,
            members: this.generateMemberStatusList()
        }
    }
    generateMemberStatusList(): MemberStatus[] {
        let memberStatus: MemberStatus[] = [];
        for (let mem of this.clanData.members) {
            memberStatus.push({
                playerName: mem.name,
                id: mem.id,
                deployed: mem.deployed,
            })
        }
        return memberStatus
    }
    save() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.clanData, null, 2))
    }

}
export default LocalClanState;
export type { LocalMemberData }
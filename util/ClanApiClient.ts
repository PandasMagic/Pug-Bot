import axios from "axios";
import querystring from 'querystring';
import { parse } from 'node-html-parser';
interface MemberStatus {
    playerName: string;
    id: string;
    deployed: boolean;
}
interface ClanStatus {
    gid: string,
    name: string,
    fid: string,
    motto: string,
    discord: string,
    members: MemberStatus[]
}
function Default_OPTIONS() {
    return {
        withCredentials: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.37',
            'referer': "https://ev.io",
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 303; // Reject only if the status code is greater than 302
        }
    }

}
class ClanApiClient {
    cookie: string | undefined;
    constructor() {

    }
    async login(username: string, password: string) {

        let data = {
            name: username,
            pass: password,
            form_build_id: 'form-oaozRAXJJpKjjNdtlZUuJwJnL61WiZPnqWsrB79ljLs',
            form_id: 'user_login_form',
            op: 'Log in'
        }
        let out = await axios.post('https://ev.io/user/login', querystring.encode(data), Default_OPTIONS()) //TODO parse out errors and return them them.
        if('set-cookie' in out.headers && out.headers['set-cookie'].length > 0){
            this.cookie = out.headers['set-cookie'][0];
             return out.headers['set-cookie'][0];
        }else{
            throw new Error("Auth Error");
        }
        
       
    }
    static async getPlayerStats(name:string){
        let out = await axios.get('https://ev.io/stats-by-un/' + encodeURIComponent(name), Default_OPTIONS())
        return out.data[0];
    }
    async getClanData(gid: string): Promise<ClanStatus> {
        this.checkLoggedIn();
        let options = Default_OPTIONS()
        options.headers['cookie'] = this.cookie;
        let out = await axios.get('https://ev.io/group/' + gid + '/edit', options)
        if (out.status == 403) {
            throw new Error("Access Denied");
        }
        var root = parse(out.data);
        let clanName = root.querySelector('#edit-label-0-value').getAttribute('value')
        let insignia_fid = root.querySelector('[name="field_insignia[0][fids]"]').getAttribute('value')
        let moto = root.querySelector('#edit-field-motto-0-value').getAttribute('value')
        let discordLink = root.querySelector('#edit-field-discord-link-0-uri').getAttribute('value')
        let members: MemberStatus[] = [];
        let clanstatus: ClanStatus = {
            gid: gid,
            name: clanName,
            fid: insignia_fid,
            motto: moto,
            discord: discordLink,
            members: members
        }
        for (let i of root.querySelectorAll('.checkbox')) {
            let inputelem = i.querySelector('input');
            let playerName = i.childNodes[1].childNodes[1].childNodes[0].childNodes[0].rawText
            let fieldname = inputelem.getAttribute('name');
            let value = inputelem.getAttribute('value');
            let deployed = inputelem.getAttribute('checked') != undefined;

            let clanMember: MemberStatus = {
                playerName: playerName,
                id: value,
                deployed: deployed
            }
            members.push(clanMember);
        }

        return clanstatus;
    }
    async updateClanStatus(status: ClanStatus) { //Needs auth
        this.checkLoggedIn();
        let options = Default_OPTIONS()
        options.headers['cookie'] = this.cookie;
        let getFormid = await axios.get('https://ev.io/group/' + status.gid + '/edit', options)
        let formhtml = parse(getFormid.data);
        if (getFormid.status == 403) {
            throw new Error("Access Denied");
        }
        let build_id = formhtml.querySelector("[name='form_build_id']").getAttribute('value')
        let form_token = formhtml.querySelector("[name='form_token']").getAttribute('value')
        let data = {
            "label[0][value]": status.name,
            "form_build_id": build_id,
            "form_token": form_token,
            "form_id": "group_clan_edit_form",
            "field_insignia[0][fids]": status.fid,
            "field_insignia[0][display]": 1,
            "field_motto[0][value]": status.motto,
            "field_discord_link[0][uri]": status.discord,
            "op": "Save"
        }

        for (let mem of status.members) {
            if (mem.deployed) {
                data['field_deployed[' + mem.id + ']'] = mem.id;
            }
        }
        let out = await axios.post('https://ev.io/group/' + status.gid + '/edit', querystring.encode(data), options)
        // console.log(out);
        return;
    }
    private checkLoggedIn(){
        if(!this.cookie){
            throw new Error("You must be logged in to access this page");
        }
    }
}

export default ClanApiClient;
export type {MemberStatus,ClanStatus}
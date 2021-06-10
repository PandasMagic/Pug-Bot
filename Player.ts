interface PlayerData {
    name : string;
    id: string;
    fieldname: string;
    deployed: boolean;
    lastDeployed: Date;
    score: string;
    scoreLastUpdated: Date;
  
    // randomizeNames: boolean;
  }
class Player {
    name : string;
    id: string;
    fieldname: string;
    deployed: boolean;
    lastDeployed: Date;
    score: string;
    scoreLastUpdated: Date;
    discordUser: string;
    constructor(data :PlayerData){
        this.name = data.name;
        this.id = data.id;
        this.fieldname = data.fieldname;
        this.deployed = data.deployed;
        this.lastDeployed = data.lastDeployed;
        this.score = data.score;
        this.scoreLastUpdated = data.scoreLastUpdated;
    }
}
export default Player
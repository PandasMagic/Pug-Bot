class PartyConnection {
    constructor(lobbyid, alias) {
      let t = {
        "namespace": "prod",
        "clientMetadata": "",
        "joinKind": {
          "type": "New",
          "lobbyId": lobbyid,
          "alias": alias
        }
      }
      let that = this; //Jank shit
      console.log(t)
      this.pcon = new WebSocket("wss://matchmaker2.ev.io/party/ws?req=" + encodeURIComponent(JSON.stringify(t)));
      let hasMovedLeader = false;
      this.pcon.onopen = () => {
        console.log('Party Socket Opened...')
      }
      this.pcon.onmessage = async (e) => {
        let msgd = JSON.parse(e.data)
  
        console.log(msgd);
        if (msgd.type == "Init") {
          this.state = msgd
          this.partyd = msgd;
        } else if (msgd.type == "Update") {
          console.log(msgd.switchLobby)
          if (msgd.switchLobby) {
            console.log("Change Lobby")
            let t = {
              buildIdentifier: await getBuildId(), //TODO FIX
              mmLobbyId: msgd.switchLobby.lobbyId,
              mmPlayerToken: msgd.switchLobby.playerToken,
              token: sToken,
              uid: profileinfo[0].uid[0].value
            }
            if (this.onLobbyChange) {
              this.onLobbyChange(t, msgd.switchLobby.lobbyHost)
            }
          }
          if (!hasMovedLeader) {
            for (let member of msgd.state.members) {
              console.log(member);
              if (!member.isLeader) {
                hasMovedLeader = true;
                that.pcon.send(JSON.stringify({
                  "type": "Transfer",
                  "partyMemberId": member.partyMemberId
                }))
                break;
              }
            }
          }
        }
      }
  
    }
    join(gamecon) {
      gamecon.sendRequest(11, {
        partyMemberToken: this.state.partyMemberToken
      }) //TODO Make named method in GameConnection class
    }
  
    // pcon.send
  
  }
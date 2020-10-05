const { Invite } = require('discord.js');
const RconClient = require('rcon-client');
console.log(RconClient)

async function init() {


    const rcon = await RconClient.Rcon.connect({
        host: "", port: 25575, password: ""
    })
    console.log(await rcon.send("list"))

const responses = await Promise.all([
        rcon.send("whitelist list")
    ])

    for (response of responses) {
        console.log(response)
    }

    rcon.end()
}

init()

const { Invite } = require('discord.js');
const RconClient = require('rcon-client');
console.log(RconClient)

async function init() {


    const rcon = await RconClient.Rcon.connect({
        host: "mc.boisecodeworks.com", port: 25575, password: "Pizza3.1415"
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

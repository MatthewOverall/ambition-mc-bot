// Load up the discord.js library
const Discord = require("discord.js");
const execAsync = require("./execAsync");
const fs = require('fs');

process.on('message', (m) => {
    console.log('CHILD got message:', m);
});

// Causes the parent to print: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = loadConfig();
console.log(config);
console.log(config.token);
console.log(config.prefix);
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.once("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`With ${client.guilds.cache.size} servers!`);
    let channel = client.channels.cache.get('756626658223718494')
    if (channel) {
        channel.send({embed: {
            color: 3066993,
            description: "**UHC Bot has started successfully!**"
          }});
    }
});

client.on("message", async message => {

    // This event will run on every single message received, from any channel or DM.

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if (message.content.indexOf(config.prefix) !== 0) return;

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Let's go with a few common example commands! Feel free to delete or change those.

    if (command === "ping") {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await client.channels.cache.get("756626658223718494").send("Ping?");
        message.reply(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }

    if (command === "backup") {

        // message.channel.send("backup started...");
        // try {
        //     let result = await execAsync("./ftp-sync.sh");
        //     console.log(result);
        //     message.channel.send("backup completed...");
        // } catch (ex) {
        //     message.channel.send("backup failed :( \r " + ex);
        // }
    } else {
        console.log(`command recieved ${command} ${args.join(' ')}`)
        process.send({ command: `${config.prefix}uhc.${command} ${args.join(' ')}`.trim()})
    }
});

client.login(config.token);


function loadConfig() {
    let configJson = fs.readFileSync('./config.json');
    let config = JSON.parse(configJson);

    return config;
}

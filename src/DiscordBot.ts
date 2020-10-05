import Discord from 'discord.js'
import { McServerConfig } from '../config'
import AmbitionClient from './AmbitionClient'


export default class DiscordBot extends Discord.Client {

  get config() { return this.client.config }
  channelServerMap: Map<string, McServerConfig> = new Map()
  commandList = []
  constructor(private client: AmbitionClient) {
    super()
    this.config.servers.forEach(x => this.channelServerMap.set(x.channelId, x))
    this.on('message', this.onMessageReceived)
    client.commands.forEach((v, k) => {
      // maybe check to see if it's a discord command
      this.commandList.push(k)
    })
    console.log(this.commandList)
  }
  async start() {
    await this.login(this.config.token)
  }
  async onMessageReceived(message: Discord.Message) {
    let prefix = this.config.prefix

    if (message.author.bot) { return }
    if (!this.channelServerMap.has(message.channel.id)) { return }
    if (!message.content.startsWith(prefix)) { return }

    const command = message.content.substring(prefix.length).split(" ");
    if (!this.commandList.includes(command[0])) {
      // not a valid discord command
      return
    }
    let serverId = this.channelServerMap.get(message.channel.id).id

    let commandData = {
      name: command[0],
      args: command.slice(1),
      target: serverId,
      user: {
        name: message.member.user.username,
        roles: message.member.roles.cache.map(x => x.name)
      }
    }

    const response = await this.client.onCommandReceived(message, commandData)
    if(!response.isSuccess){
     let embed = this.client.errorEmbed(response.errorMessage)
       await message.channel.send(embed)
    }
  }
}

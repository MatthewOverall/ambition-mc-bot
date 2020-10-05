import { Command, CommandData, CommandResult } from "../Command";
import McServer from "../McServer";

export default class ListCommand extends Command {
  constructor(client) {
    super(client, {
      name: "Online",
      usage: "online [--all]",
      alias: "o",
      description: "Sends the list of all online players across servers",
    })
  }

  protected async run(sender: any, commandData: CommandData): Promise<CommandResult> {
    const server = this.client.getServerById(commandData.target)
    let response = await this.getOnlinePlayers(server)
    if(sender.channel){
      sender.channel.send(response)
    }
    return CommandResult.Success(commandData)
  }

  async getOnlinePlayers(server : McServer) {
    let data = await server.runRconCommand("list");
    let response = data.split(" ");
    let online = {
      onlineCount: response[2],
      maxCount: (response[6] == "of") ? response[7] : response[6],
      players: response.slice(9) 
    };

    if (online.onlineCount === '0') {
      online.players = ["No online players"]
    }

    let embed = this.client.createEmbed("result")
      .setTitle("Online players on " + server.config.displayName)
      .addField(`${online.onlineCount}/${online.maxCount}`, online.players.join("\n").replace(/([_*~`])/g, "\\$1"));

    return embed;
  }

  toString() {
    return this.info;
  }
}

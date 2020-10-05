import { Command, CommandData, CommandResult } from "../Command";
import McServer from "../McServer";

export default class MsptCommand extends Command {
  constructor(client) {
    super(client,
      {
        "name": "Mspt",
        "usage": "mspt [--all]",
        "alias": "tps",
        "description": "Sends the mspt and tps the game is running at"
      }
    )
  }
  protected async run(sender: any, commandData: CommandData): Promise<CommandResult> {
    const server = this.client.getServerById(commandData.target)
    let response = await this.queryMSPT(server)
    if (sender.channel) {
      sender.channel.send(response)
    }
    return CommandResult.Success(commandData)
  }


  async queryMSPT(server: McServer) {
    let data = await server.runRconCommand("script run reduce(last_tick_times(),_a+_,0)/100;");
    let mspt = parseFloat(data.split(" ")[2]);
    let tps;

    if (mspt <= 50) {
      tps = 20.0;
    } else {
      tps = 1000 / mspt;
    }
    let embed = this.client.createEmbed("result")
    if (mspt >= 50) {
      embed
        .setTitle(`TPS: ${tps.toFixed(1)} MSPT: ${mspt.toFixed(1)}`)
        .setColor("#ff483b");
    } else if (mspt <= 25) {
      embed
        .setTitle(`TPS: ${tps.toFixed(1)} MSPT: ${mspt.toFixed(1)}`)
        .setColor("#27f207");
    } else {
      embed
        .setTitle(`TPS: ${tps.toFixed(1)} MSPT: ${mspt.toFixed(1)}`)
        .setColor("#f2a007");
    }
    return embed
  }
}

import { Command, CommandData, CommandResult } from "../Command";
import McServer from "../McServer";

export default class ScoreboardCommand extends Command {

  constructor(client) {
    super(client, {
      name: "Scoreboard",
      usage: "scoreboard <objective> --w",
      alias: "sb",
      description: "Creates an image of the ingame scoreboard associated to that objective"
    })
  }

  protected async run(sender: any, commandData: CommandData): Promise<CommandResult> {
    const objective = commandData.args[0]
    const whiteListOnly = commandData.args[1] === '--w'
    const server = this.client.getServerById(commandData.target)
    const scores = await this.getScores(server, objective, whiteListOnly)
    console.log(scores)
    const embed = this.client.createEmbed()
    embed.setTitle(`Scoreboard: ${objective}`)
    embed.setDescription('```' + scores.map(s =>  `${s[0]}:`.padEnd(16, ' ') + s[1]).join('\n') + '```')
   
    sender.channel.send(embed)
    return CommandResult.Success(commandData, scores)
  }

  async getScores(server: McServer, objective: string, whiteListOnly: boolean) {
    let players = await this.getPlayers(server, whiteListOnly);

    // Get scores for each player
    let scores = [];
    for (let i = 0; i < players.length; i++) {
      let player = players[i];
      let resp = await server.runRconCommand(`scoreboard players get ${player} ${objective}`);
      if (resp.includes("Can't get value of")) continue;
      if (resp.includes("Unknown scoreboard objective")) break;
      scores.push([player, resp.split(" ")[2]]);
    }

    scores.sort((a, b) => {
      return b[1] - a[1];
    });

    scores.push([
      "Total",
      (scores.length == 0) ? 0 : String(scores.reduce((a, b) => {
        return a + parseInt(b[1]);
      }, 0))
    ]);

    return scores;
  }
  async getPlayers(server: McServer, whiteListOnly: boolean) {
    let resp: string;
    if (whiteListOnly) {
      resp = await server.runRconCommand("whitelist list");
    } else {
      resp = await server.runRconCommand("scoreboard players list");
    }

    let players = resp.substring(resp.indexOf(":") + 2).split(", ");
    return players;
  }
}

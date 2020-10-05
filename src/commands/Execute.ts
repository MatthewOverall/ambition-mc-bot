import { Command, CommandData, CommandResult } from "../Command";
import Discord from "discord.js";
const invalidCommands = [
  "Incorrect argument for command",
  "Unknown or incomplete command",
  "Expected whitespace to end one argument, but found trailing data",
  "Could not parse command:",
  "<--[HERE]",
  "No player was found",
  "An unexpected error occurred trying to execute that command"
]

export default class Execute extends Command {
  constructor(client) {
    super(client, {
      name: "Execute",
      usage: "execute",
      description: "Execute a command on a server from a bridge channel",
      alias: 'run'
    })
  }

  protected async run(sender: any, commandData: CommandData): Promise<CommandResult> {
    const server = this.client.getServerById(commandData.target)
    let command = commandData.args.join(" ");
    let response = await server.runRconCommand(command);

    let embedType = "result";
    console.log(response);
    for (let i = 0; i < invalidCommands.length; i++) {
      let error = invalidCommands[i];
      if (response.includes(error)) {
        embedType = "error";
        break;
      }
    }

    // let endOfTitle = response.length - command.length - "<--[HERE]".length;
    // let title = response.substring(0, endOfTitle);
    // let description = response.substring(endOfTitle);
    let embed = this.client.createEmbed(embedType)
      .setDescription(response);
    if (sender.channel) {
      await sender.channel.send(embed)
    }
    return CommandResult.Success(commandData)
  }
}



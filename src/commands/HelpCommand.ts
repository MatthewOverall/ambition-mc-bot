import { Command, CommandData, CommandResult } from "../Command";
import McServer from "../McServer";

export default class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "Help",
      usage: "help",
      description: "Shows a list of all commands the bot can run.",
    })
  }

  protected async run(sender: any, commandData: CommandData): Promise<CommandResult> {
    let response = this.buildHelpDescription()
    if (sender.channel && response) {
      sender.channel.send(response)
    }
    return CommandResult.Success(commandData)
  }
  buildHelpDescription() {
    let allCommandInfo = []
    this.client.commands.forEach(cmd => {
      if (!allCommandInfo.includes(cmd.info)) {
        allCommandInfo.push(cmd.info)
      }
    })
    console.log(allCommandInfo)
    const embed = this.client.createEmbed()
    embed.setTitle(`Ambitious Bot Help`)
    embed.setColor(10181046)
    embed.setDescription(`\u200b`)
    allCommandInfo.forEach(cmdInfo => {
      let lines = [
        `Usage: ${cmdInfo.usage}`,
        `Descrption: ${cmdInfo.description}`
      ]
      embed.addField(`${cmdInfo.name}`, lines.join('\n'))
    });
    return embed
  }
}

import { Command, CommandData, CommandResult } from "../Command";
import McServer from "../McServer";

export default class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "Help",
      usage: "help",
      description: "Displays this panel.",
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
    embed.setColor(0x7ff1e9)
    embed.setTimestamp()
    embed.setFooter("No really that's all the commands")
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

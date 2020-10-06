import { Command, CommandData, CommandResult } from "../Command";
import McServer from "../McServer";

export default class ServiceCommand extends Command {
  constructor(client) {
    super(client, {
      name: "Service",
      usage: "service [--start|--stop|--restart]",
      description: "Used to control the availability of the server",
    })
  }

  protected async run(sender: any, commandData: CommandData): Promise<CommandResult> {
    const server = this.client.getServerById(commandData.target)
    const option = commandData.args[0]
    let response: string

    if (option === '--start') {
      response = await server.start()
    }
    if (option === '--stop') {
      response = await server.stop()
    }
    if (option === '--restart') {
      response = await server.stop()
      response = await server.start()
    }

    if (sender.channel) {
      await sender.channel.send(response)
    }
    return CommandResult.Success(commandData)
  }
}

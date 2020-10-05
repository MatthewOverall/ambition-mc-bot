import AmbitionClient from "./AmbitionClient"

type CommandInfo = {
  name: string
  usage: string
  description: string
  alias?: string
}

export abstract class Command {
  constructor(
    public client: AmbitionClient,
    public info: CommandInfo
  ) { }

  async runCommand(sender: any, commandData: CommandData) {
    console.log(`Running command: ${commandData.name}`)
    return await this.run(sender, commandData)
  }
  protected abstract async run(sender: any, commandData: CommandData): Promise<CommandResult>
}

export type CommandData = {
  name: string
  args: string[]
  target: string
  user: {
    name: string
    roles: string[]
  }
}

export class CommandResult {
  constructor(
    public commandData: CommandData,
    public isSuccess: boolean,
    public resultData?: any,
    public errorMessage?: string
  ) { }

  static NotFound(commandData: CommandData): CommandResult {
    return this.Error(commandData, "command not found")
  }
  static Error(commandData: CommandData, reason: string, resultData?: any): CommandResult {
    return new CommandResult(commandData, false, resultData, reason)
  }
  static Success(commandData: CommandData, resultData?: any) {
    return new CommandResult(commandData, true, resultData)
  }
}

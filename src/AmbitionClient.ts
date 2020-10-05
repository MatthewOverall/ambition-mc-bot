import { AppConfig } from "../config";
import McServer from "./McServer";
import Discord from "discord.js";
import fs from "fs";
import path from 'path'
import { Command, CommandData, CommandResult } from "./Command";

export default class AmbitionClient {

  servers: Map<string, McServer> = new Map()
  commands: Map<string, Command> = new Map()

  constructor(public config: AppConfig) {
    this.config.servers.forEach(s => this.servers.set(s.id, new McServer(s)));
    this.commands = new Map(Object.entries(this.readCommands((path.join(__dirname, 'commands')))))
    console.log(this.commands)
  }
  getServerById(id) {
    return this.servers.get(id);
  }
  readCommands(module) {
    const commands = {};
    fs.readdirSync(module).forEach(file => {
      if (!file.endsWith('.js')) return
      const commandPath = path.join(module, file)
      const command = new (require(commandPath).default)(this);
      commands[command.info.usage.split(" ")[0]] = command;
      let alias;
      if ((alias = command.info.alias) != undefined) {
        commands[alias] = command;
      }
    })
    return commands;
  }
  async onCommandReceived(sender: object, commandData: CommandData) {
    const cmdInstance = this.commands.get(commandData.name);
    if (!cmdInstance) {
      return CommandResult.NotFound(commandData);
    }
    if (commandData.target && !this.getServerById(commandData.target)) {
      return CommandResult.Error(commandData, 'Invalid Target Server...')
    }
    try {
      const result = await cmdInstance.runCommand(sender, commandData);
      return result;
    } catch (e) {
      return CommandResult.Error(commandData, e)
    }
  }
  // async runCommand(serverId, command){
  //     const server = this.getServer(serverId)
  //     if(!server){
  //         console.warn(`server '${serverId}' not registered`)
  //         return
  //     }
  //     let resp = await server.runCommand(command)
  //     console.log(resp)
  // }
  // filterServer(rcon, message) {
  // 	if (message.charAt(0) === this.prefix) return;

  // 	let author = message.substring(1, message.indexOf(">"));
  // 	let command = message.split(" ");
  // 	command[1] = command[1].substring(1);

  // 	this.parseServerCommand(rcon, author, command[1], command.slice(2));
  // }


  // parseServerCommand(rcon, authorName, command, ...args) {
  // 	let cmd = this.serverCommands[command];
  // 	if (cmd === undefined) return;

  // 	cmd.run(rcon, authorName, ...args);
  // }

  createEmbed(color?: string) {
    switch (color) {
      case "result":
        color = "#7fe254";
        break;
      case "error":
        color = "#f54f38";
        break;
      default:
        color = "#7fe254";
        break;
    }

    return new Discord.MessageEmbed()
      .setColor(color);
  }

  /**
   * Returns a predefined common error embed.<br>
   * Possible errors are:
   * - `bridge`: "You must be in a bridge channel to do that!"
   * - `args`: "Invalid arguments! Do !help for more info."
   * - `unexpected`: "An unexpected error has occured while performing that command"
   *
   * @param {String} error
   * @return {Discord.MessageEmbed}
   */
  errorEmbed(error) {
    switch (error) {
      case "bridge":
        return this.createEmbed("error")
          .setTitle("You must be in a bridge channel to do that!");
      case "args":
        return this.createEmbed("error")
          .setTitle("Invalid arguments! Do " + this.config.prefix + "help for more info.");
      case "unexpected":
        return this.createEmbed("error")
          .setTitle("An unexpected error has occured while performing that command");
    }
  }
}

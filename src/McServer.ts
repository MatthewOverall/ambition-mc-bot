
import { Rcon } from 'rcon-client'
import { McServerConfig } from '../config'
import shell from 'shelljs'

export default class McServer {

  rcon: Rcon
  constructor(public config: McServerConfig) { }
  async getRcon() {
    if (this.rcon && this.rcon.authenticated) {
      return this.rcon
    }
    try {
      let rcon = await Rcon.connect({
        host: this.config.host, port: this.config.rconPort, password: this.config.rconPass
      })
      this.rcon = rcon
    } catch (e) {
      console.error(`Unable to connect to ${this.config.id}.`)
    }
    return this.rcon
  }
  async getStatus() {
    if (this.rcon.authenticated) {
      return ServerStatus.Online
    } else {
      return ServerStatus.Offline
    }
  }

  async stop() {
    if (await this.getStatus() == ServerStatus.Online) {
      await this.runRconCommand('save-all')
      await this.runRconCommand('stop')
    }
    return 'stopped'
  }
  async start() {
    return 'started'
  }
  async runRconCommand(command: string) {
    await this.getRcon()
    if (!this.rcon) { throw `Unable to connect to **${this.config.id}**.` }
    return await (this.rcon.send(command))
  }

  async getServiceStatus() {
    let result = shell.exec(`/opt/minecraft/instances/service.sh is-active ${this.config.id}`)
    console.log(result)
    return result
  }
}

export enum ServerStatus {
  Unknown,
  Online,
  Offline,
  Starting,
  Stopping
}

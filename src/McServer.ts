
import { Rcon } from 'rcon-client'
import { McServerConfig } from '../config'



export default class McServer {
  rcon: Rcon
  constructor(public config: McServerConfig) { }
  async getRcon() {
    if (this.rcon) {
      return this.rcon
    }
    try {
      let rcon = await Rcon.connect({
        host: this.config.host, port: this.config.rconPort, password: this.config.rconPass
      })
      this.rcon = rcon
    } catch (e) {
      console.error(`${this.config.id}: Unable to connect to server.`)
    }
    return this.rcon
  }
  async runRconCommand(command: string) {
    await this.getRcon()
    if (!this.rcon) { throw `${this.config.id}: Unable to connect to server.` }
    return await (this.rcon.send(command))
  }
}

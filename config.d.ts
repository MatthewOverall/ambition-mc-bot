export type AppConfig = { 
  readonly token: string
  readonly prefix: string
  readonly servers: McServerConfig[]
}

export type McServerConfig = {
  readonly id: string;
  readonly displayName: string;
  readonly host: string;
  readonly rconPort: number;
  readonly rconPass: string;
  readonly channelId: string;
  readonly cwd: string;
  readonly startCommand: string;
}


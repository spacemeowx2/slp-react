
export interface LPInterfaces {
  interfaces: {
    name: string
    description: string
    ips: string[]
  }[]
}

export interface LPStatus {
  status: 'None' | 'Running'
}

export interface LPSettings {
  netif: string
  relayServer: string
  socks5Server: string
  pmtu: number
  fakeInternet: boolean
  broadcast: boolean
}

export type LPAllState = LPInterfaces & LPStatus & { config: LPSettings, lastConfig: LPSettings }
export type LPAllCmd = 'listIf' | 'status' | 'start' | 'stop' | 'config'
export interface LPCommandMap {
  listIf: LPInterfaces
}

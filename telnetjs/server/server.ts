import WebSocket from 'ws'
import uuid from 'uuid'
import { TCP } from '../common/types'
import { ProxyClient } from './proxy-client'

interface ProxyClientHashMap {
  [key: string]: ProxyClient
}

export class Server {
  proxyClients: ProxyClientHashMap

  constructor(wsPort: number, tcpConfig: TCP.Config) {
    this.proxyClients = {}

    const wss: WebSocket.Server = new WebSocket.Server({
      port: wsPort
    })

    console.log(`WS Server listening on ${wsPort}, proxying to ${tcpConfig.host}:${tcpConfig.port}`)

    // TODO cleanup old ProxyClients
    wss.on('connection', (ws: WebSocket) => {
      const clientId = uuid.v4()
      const client = new ProxyClient(clientId, ws, tcpConfig)
      this.proxyClients[clientId] = client
    })

    const exitSignals = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM']
    exitSignals.forEach((eventType) => {
      process.on(eventType, (...args) => {
        console.log({ eventType, args })
      })
    })

    process.on('uncaughtException', (err, origin) => {
      console.error({ err, origin })
    })

    process.on('unhandledRejection', (reason, promise) => {
      console.error({ reason, promise })
    })
  }
}


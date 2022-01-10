import WebSocket from 'ws'
import uuid from 'uuid'
import { TCP } from '../common/types'
import { ProxyClient } from './proxy-client'

export class Server {
  proxyClients: { [clientId: string]: ProxyClient }

  constructor(wsPort: number, tcpConfig: TCP.Config) {
    this.proxyClients = {}

    const wss: WebSocket.Server = new WebSocket.Server({
      port: wsPort
    })

    console.log(`WS Server listening on ${wsPort}, proxying to ${tcpConfig.host}:${tcpConfig.port}`)

    wss.on('connection', (ws: WebSocket) => {
      const clientId = uuid.v4()
      const client = new ProxyClient(clientId, ws, tcpConfig)
      this.proxyClients[clientId] = client

      console.log(`Created client ${clientId}`);

      client.onClose(() => {
        console.log(`Client ${clientId} closed connection`)
        delete this.proxyClients[clientId]
      })
    })

    const exitSignals = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM']
    exitSignals.forEach((eventType) => {
      process.on(eventType, (...args) => {
        console.log(`Received ${eventType}`)
        for (const [clientId, proxyClient] of Object.entries(this.proxyClients)) {
          console.log(`Destroying client ${clientId}`)
          proxyClient.destroy()
        }

        process.exit(0)
      })
    })

    process.on('uncaughtException', (err, origin) => {
      console.error({ type: 'uncaughtException', err, origin })
    })

    process.on('unhandledRejection', (reason, promise) => {
      console.error({ type: 'unhandledRejection', reason, promise })
    })
  }
}


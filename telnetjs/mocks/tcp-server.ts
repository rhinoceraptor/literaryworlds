import { promisify } from 'bluebird'
import * as net from 'net'
import { TCP } from '../common/types'

export class MockTcpServer {
  server: net.Server
  clients: Array<net.Socket>

  constructor(tcpConfig: TCP.Config) {
    this.clients = []
    this.server = net.createServer((client: net.Socket) => {
      this.clients.push(client)
      console.log('client connected')
    })

    this.server.listen(tcpConfig.port)
  }

  destroy(): Promise<void> {
    this.clients.forEach((client: net.Socket) => {
      client.destroy()
    })

    return promisify(this.server.close, { context: this.server })()
  }
}


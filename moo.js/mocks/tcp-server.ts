import { promisify } from 'bluebird'
import * as net from 'net'
import { TCP } from '../common/types'

export class MockTcpServer {
  server: net.Server
  clients: Array<net.Socket>
  receivedMessages: Array<string>

  constructor(tcpConfig: TCP.Config) {
    this.clients = []
    this.receivedMessages = []
    this.server = net.createServer((client: net.Socket) => {
      this.clients.push(client)
      client.on('data', data => this.receivedMessages.push(data.toString()))
    })

    this.server.listen(tcpConfig.port)
  }

  sendMessage(message: string): void {
    this.clients.forEach(client => client.write(message))
  }

  destroy(): Promise<void> {
    this.clients.forEach((client: net.Socket) => {
      client.destroy()
    })

    return promisify(this.server.close, { context: this.server })()
  }
}


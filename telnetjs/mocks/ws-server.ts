import WebSocket from 'ws'
import { promisify } from 'bluebird'
import { identity } from 'ramda'

export class MockWsServer {
  server: WebSocket.Server
  clients: Array<WebSocket>
  recvdMessages: Array<string>
  sentMessages: Array<string>

  constructor(port: number, respondToMessages = identity) {
    this.server = new WebSocket.Server({ port })
    this.clients = []
    this.recvdMessages = []
    this.sentMessages = []

    this.server.on('connection', (ws: WebSocket) => {
      this.clients.push(ws)

      ws.on('message', (message: string) => {
        this.recvdMessages.push(message)
        const response = respondToMessages(message)
        this.sentMessages.push(response)
        ws.send(response)
      })
    })
  }

  destroy(): Promise<void> {
    this.clients.forEach((client: WebSocket) => client.close())
    return promisify(this.server.close, { context: this.server })()
  }
}



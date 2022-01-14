import WebSocket from 'ws'
import { identity } from 'ramda'

type TransformMessageFunction = (message: string) => string

export class MockWsServer {
  port: number
  transformMessage: TransformMessageFunction
  server?: WebSocket.Server
  clients: Array<WebSocket>
  recvdMessages: Array<string>
  sentMessages: Array<string>

  constructor(port: number, transformMessage = identity) {
    this.port = port
    this.transformMessage = transformMessage
    this.clients = []
    this.recvdMessages = []
    this.sentMessages = []
  }

  init(): Promise<void> {
    return new Promise((resolve) => {
      this.server = new WebSocket.Server({ port: this.port })

      this.server.on('listening', () => resolve())

      this.server.on('connection', (ws: WebSocket) => {
        this.clients.push(ws)

        ws.on('message', (message: string) => {
          this.recvdMessages.push(message)
          const response = this.transformMessage(message)
          this.sentMessages.push(response)
          ws.send(response)
        })
      })
    })
  }

  destroy(): Promise<void> {
    return new Promise((resolve) => {
      this.clients.forEach((client: WebSocket) => client.close())
      this.server?.close(() => resolve())
    })
  }
}



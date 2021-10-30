import WebSocket from 'ws'
import { WS } from '../common/types'

export class MockWsClient {
  receivedMessages: Array<string>
  client: WebSocket

  constructor(port: number) {
    this.receivedMessages = []
    this.client = new WebSocket(`ws://localhost:${port}`)
    this.client.on('message', (message: string) => {
      this.receivedMessages = [...this.receivedMessages, message];
    })
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      this.client.on('open', () => resolve())
    })
  }

  send(event: WS.InboundEvent): void {
    this.client.send(JSON.stringify(event))
  }

  destroy(): Promise<void> {
    return new Promise(resolve => {
      this.client.on('close', () => resolve())
      this.client.close()
    })
  }
}



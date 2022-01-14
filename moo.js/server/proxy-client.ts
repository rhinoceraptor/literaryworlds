import * as net from 'net'
import WebSocket from 'ws'
import { WS, TCP } from '../common/types'

export class ProxyClient {
  id: string
  ws: WebSocket
  tcpSocket?: net.Socket
  tcpConfig: TCP.Config
  destroyed: boolean
  onCloseCallback?: () => void

  constructor(id: string, ws: WebSocket, tcpConfig: TCP.Config) {
    this.id = id
    this.ws = ws
    this.tcpConfig = tcpConfig
    this.destroyed = false

    // https://nodejs.org/api/net.html#net_net_createconnection
    this.tcpSocket = net.createConnection(
      this.tcpConfig.port,
      this.tcpConfig.host,
      this.handleTcpCxnReady.bind(this)
    )

    this.tcpSocket.on('data', this.handleTcpRecvData.bind(this))
    this.tcpSocket.on('error', this.handleTcpRecvError.bind(this))
    this.tcpSocket.on('close', this.handleTcpRecvClose.bind(this))

    this.ws.on('message', (message: string) => {
      try {
        const event: WS.InboundEvent = JSON.parse(message.toString())
        this.handleWsEvent(event)
      } catch (error) {
        console.trace({ incomingWsError: error })
        this.emitWsEvent({ type: 'invalid_json_message' })
      }
    })

    this.ws.on('error', (wsClientErrorEvent: WebSocket.ErrorEvent) => {
      console.trace({ wsClientErrorEvent })
      this.destroy()
    })

    this.ws.on('close', (wsClientCloseEvent: WebSocket.CloseEvent) => {
      console.log({ wsClientCloseEvent })
      this.destroy()
    })
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      this.tcpSocket?.on('ready', () => resolve())
    })
  }

  onClose(fn: () => void): void {
    this.onCloseCallback = fn
  }

  handleWsEvent(event: WS.InboundEvent): void {
    switch(event.type) {
      case 'data':
        return this.handleWsData(event.data.toString())
    }
  }

  handleWsData(data: string): void {
    this.tcpSocket?.write(data + '\r\n')
  }

  emitWsEvent(event: WS.OutboundEvent): void {
    this.ws.send(JSON.stringify(event))
  }

  handleTcpCxnReady(): void {
    this.emitWsEvent({ type: 'tcp_ready' })
  }

  // https://nodejs.org/api/net.html#net_event_data
  handleTcpRecvData(data: TCP.Data): void {
    this.emitWsEvent({ type: 'data', data: data.toString() })
  }

  // https://nodejs.org/api/net.html#net_event_error_1
  handleTcpRecvError(error: Error): void {
    console.trace({ handleTcpRecvError: error })
    this.emitWsEvent({ type: 'tcp_cxn_error' })
  }

  // https://nodejs.org/api/net.html#net_event_close_1
  handleTcpRecvClose(hadError: boolean): void {
    if (this.destroyed) {
      return
    }

    console.trace({ handleTcpRecvClose: hadError })
    this.emitWsEvent({ type: 'tcp_cxn_close' })
  }

  destroy(): void {
    this.emitWsEvent({ type: 'server_shutdown' })
    this.destroyed = true
    this.tcpSocket?.destroy()
    this.ws.close()
    this.onCloseCallback && this.onCloseCallback()
  }
}

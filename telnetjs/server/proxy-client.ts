import * as net from 'net'
import * as WebSocket from 'ws'
import { WS, TCP } from './types'

export class ProxyClient {
  ws: WebSocket
  tcpSocket?: net.Socket
  tcpConfig: TCP.Config

  constructor(ws: WebSocket, tcpConfig: TCP.Config) {
    this.ws = ws
    this.tcpConfig = tcpConfig

    // https://nodejs.org/api/net.html#net_net_createconnection
    this.tcpSocket = net.createConnection(
      this.tcpConfig.port,
      this.tcpConfig.host,
      this.handleTcpCxnReady
    )

    this.tcpSocket.on('data', this.handleTcpRecvData)
    this.tcpSocket.on('error', this.handleTcpRecvError)
    this.tcpSocket.on('close', this.handleTcpRecvClose)

    this.ws.on('message', this.handleWsEvent)
  }

  handleWsEvent(event: WS.InboundEvent) {
    switch(event.type) {
      case 'data':
        return this.handleWsData(event.data.toString())
    }
  }

  handleWsData(data: string) {
    this.tcpSocket?.write(data + '\r\n')
  }

  emitWsEvent(event: WS.OutboundEvent) {
    this.ws.send(event)
  }

  handleTcpCxnReady() {
    this.emitWsEvent({ type: 'tcp_ready' })
  }

  // https://nodejs.org/api/net.html#net_event_data
  handleTcpRecvData(data: TCP.Data) {
    this.emitWsEvent({ type: 'data', data: data.toString() })
  }

  // https://nodejs.org/api/net.html#net_event_error_1
  handleTcpRecvError(error: Error) {
    console.trace(error)
    this.emitWsEvent({ type: 'tcp_cxn_error' })
  }

  // https://nodejs.org/api/net.html#net_event_close_1
  handleTcpRecvClose(hadError: boolean) {
    console.trace({ hadError })
    this.emitWsEvent({ type: 'tcp_cxn_close' })
  }

  destroy() {
    this.tcpSocket?.destroy()
  }
}

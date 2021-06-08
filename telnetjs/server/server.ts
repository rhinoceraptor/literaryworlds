import * as net from 'net'
import * as WebSocket from 'ws'
import { WS, TCP } from './types'

const createServer = (wsPort: number): WebSocket.Server =>
  new WebSocket.Server({
    port: wsPort
  })

class TcpProxyClient {
  ws: WebSocket
  tcpSocket?: net.Socket
  tcpConfig: TCP.Config

  constructor(ws: WebSocket, tcpHost: TCP.Host) {
    this.ws = ws
    this.tcpConfig = {
      host: tcpHost
    }

    this.ws.on('message', this.handleWsEvent)
  }

  handleWsEvent(event: WS.InboundEvent) {
  }

  emitWsEvent(event: WS.OutboundEvent) {
    this.ws.send(event)
  }

  configureTcp(tcpPort: TCP.Port) {
    this.tcpConfig.port = tcpPort

    // https://nodejs.org/api/net.html#net_net_createconnection
    this.tcpSocket = net.createConnection(this.tcpConfig.port, this.tcpConfig.host, this.handleTcpCxnReady)

    this.tcpSocket.on('data', this.handleTcpRecvData)
    this.tcpSocket.on('error', this.handleTcpRecvError)
    this.tcpSocket.on('close', this.handleTcpRecvClose)
  }

  handleTcpCxnReady() {
    this.emitWsEvent({ event: 'tcp_ready' })
  }

  // https://nodejs.org/api/net.html#net_event_data
  handleTcpRecvData(data: TCP.Data) {
    this.emitWsEvent({ event: 'data', data: data.toString() })
  }

  // https://nodejs.org/api/net.html#net_event_error_1
  handleTcpRecvError(error: Error) {
    console.trace(error)
    this.emitWsEvent({ event: 'tcp_cxn_error' })
  }

  // https://nodejs.org/api/net.html#net_event_close_1
  handleTcpRecvClose(hadError: boolean) {
    console.trace({ hadError })
    this.emitWsEvent({ event: 'tcp_cxn_close' })
  }
}

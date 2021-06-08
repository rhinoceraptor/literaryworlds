import * as net from 'net'
import * as WebSocket from 'ws'
import { TcpData, TcpConfig, TcpHost, TcpPort } from './types'

const createServer = (wsPort: number): WebSocket.Server =>
  new WebSocket.Server({
    port: wsPort
  })

class TcpProxyClient {
  ws: WebSocket
  tcpSocket?: net.Socket
  tcpConfig: TcpConfig

  constructor(ws: WebSocket, tcpHost: TcpHost) {
    this.ws = ws
    this.tcpConfig = {
      host: tcpHost
    }

    this.ws.on('configure_tcp', this.configureTcp)
  }

  configureTcp(tcpPort: TcpPort) {
    this.tcpConfig.port = tcpPort

    // https://nodejs.org/api/net.html#net_net_createconnection
    this.tcpSocket = net.createConnection(this.tcpConfig.port, this.tcpConfig.host, this.handleTcpCxnReady)

    this.tcpSocket.on('data', this.handleTcpRecvData)
    this.tcpSocket.on('error', this.handleTcpRecvError)
    this.tcpSocket.on('close', this.handleTcpRecvClose)
  }

  handleTcpCxnReady() {
    this.ws.send({ event: 'tcp_ready' })
  }

  // https://nodejs.org/api/net.html#net_event_data
  handleTcpRecvData(data: TcpData) {
    this.ws.send({ event: 'data', data: data.toString() })
  }

  // https://nodejs.org/api/net.html#net_event_error_1
  handleTcpRecvError(error: Error) {
    console.trace(error)
    this.ws.send({ event: 'tcp_connection_error' })
  }

  // https://nodejs.org/api/net.html#net_event_close_1
  handleTcpRecvClose(hadError: boolean) {
    console.trace({ hadError })
    this.ws.send({ event: 'tcp_connection_close' })
  }
}

import * as WebSocket from 'ws'
import { TCP } from './types'
import { ProxyClient } from './proxy-client'

const tcpConfig: TCP.Config = {
  host: process.env.TCP_HOST || '127.0.0.1',
  port: parseInt(process.env.TCP_PORT || '7777', 10)
}

const wsPort = parseInt(process.env.WEBSOCKET_LISTEN_PORT || '8080', 10)

const wss: WebSocket.Server = new WebSocket.Server({
  port: wsPort
})

console.log(`WS Server listening on ${wsPort}, proxying to ${tcpConfig.host}:${tcpConfig.port}`)

wss.on('connection', (ws: WebSocket) => {
  new ProxyClient(ws, tcpConfig)
})



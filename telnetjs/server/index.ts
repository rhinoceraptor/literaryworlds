import * as WebSocket from 'ws'
import { TCP } from './types'
import { ProxyClient } from './proxy-client'

const tcpConfig: TCP.Config = {
  host: process.env.TCP_HOST || '127.0.0.1',
  port: parseInt(process.env.TCP_PORT || '7777')
}

const wsPort = parseInt(process.env.WEBSOCKET_LISTEN_PORT || '8080', 10)

const wss: WebSocket.Server = new WebSocket.Server({
  port: wsPort
})

wss.on('connection', (ws: WebSocket) => {
  new ProxyClient(ws, tcpConfig)
})



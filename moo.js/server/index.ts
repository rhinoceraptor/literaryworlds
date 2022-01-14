import { Server } from './server'
import { TCP } from '../common/types'

const wsPort: number = parseInt(process.env.WEBSOCKET_LISTEN_PORT || '8080', 10);
const tcpConfig: TCP.Config = {
  host: process.env.TCP_HOST || '127.0.0.1',
  port: parseInt(process.env.TCP_PORT || '7777', 10)
}

new Server(wsPort, tcpConfig)

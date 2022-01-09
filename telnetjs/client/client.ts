import WebSocket from 'ws'

const wsPort = parseInt(process.env.WEBSOCKET_LISTEN_PORT || '8080', 10)
const wsHost = process.env.WEBSOCKET_HOST

const wsc: WebSocket = new WebSocket(`ws://${wsHost}:${wsPort}`)


import WebSocket from 'ws'
import { TextConsole } from './text-console'
import { Moo } from '../common/types'

const wsPort = parseInt(process.env.WEBSOCKET_LISTEN_PORT || '8080', 10)
const wsHost = process.env.WEBSOCKET_HOST

export class Client {
  websocket: WebSocket
  console?: TextConsole

  constructor(params: Moo.Params, socket: WebSocket) {
    this.websocket = socket

    const consoleOutput = document.getElementById('console-output')
    const consoleInput = document.getElementById('console-input')
    const enCoreIFrame = document.querySelector('[name=web_frame]')

    if (!consoleOutput || !consoleInput || !enCoreIFrame) {
      console.error({
        message: 'DOM element(s) not found',
        consoleOutput,
        consoleInput
      })
      return
    }

    this.console = new TextConsole(consoleOutput, consoleInput, enCoreIFrame)

    this.console.onCommandEntered((command: string) => {
      this.websocket.send({
        type: 'data',
        data: command
      })
    })

    this.websocket.on('close', () => this.console?.informConnectionLost())
    this.websocket.on('error', () => this.console?.informConnectionLost())
    this.websocket.on('message', data => this.console?.outputData(data.toString()))
  }
}

const getParams = (): Moo.Params => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = (<any>window).params

  return {
    mooName: params.MOOname || '',
    hostName: params.HostName || '',
    socketServer: params.SocketServer || '',
    autologin: params.autologin || '',
    port: params.port || '',
    font: params.font || '',
    fontsize: params.fontsize || '',
    localecho : params.localecho || ''
  }
}

new Client(getParams(), new WebSocket(`ws://${wsHost}:${wsPort}`))


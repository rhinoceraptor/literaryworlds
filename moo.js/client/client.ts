import { TextConsole } from './text-console'
import { Moo, WebSocketEvents } from '../common/types'

const wsHost = process.env.WEBSOCKET_HOST as string

export class Client {
  params: Moo.Params
  websocket: WebSocket
  console?: TextConsole

  constructor(params: Moo.Params, socket: WebSocket) {
    this.params = params
    this.websocket = socket

    const consoleOutput = document.getElementById('console-output')
    const consoleInput = <HTMLInputElement>document.getElementById('console-input')
    const enCoreIFrame = window?.top?.document?.querySelector('[name=web_frame]')

    if (!consoleOutput || !consoleInput) {
      console.error({
        message: 'DOM element(s) not found',
        consoleOutput,
        consoleInput,
        enCoreIFrame
      })
      return
    }

    this.console = enCoreIFrame
      ? new TextConsole(consoleOutput, consoleInput, enCoreIFrame)
      : new TextConsole(consoleOutput, consoleInput)

    this.console.onCommandEntered((command: string) => {
      console.log(command)
      this.websocket.send(JSON.stringify({
        type: 'data',
        data: command
      }))
    })

    this.websocket.addEventListener('close', () => this.console?.informConnectionLost())
    this.websocket.addEventListener('error', () => this.console?.informConnectionLost())
    this.websocket.addEventListener('message', (message, ...rest) => {
      console.log({ message, rest })
      try {
        const event: WebSocketEvents.ServerToClient = JSON.parse(message?.data?.toString())
        this.handleEvent(event)
      } catch (e) {
        console.trace(e)
      }
    })
  }

  handleEvent(event: WebSocketEvents.ServerToClient): void {
    const isType = (type: string) => event.type === type

    switch (true) {
      case (isType('tcp_ready')):
        this.console?.informReady()
        if (this.params.autologin) {
          this.websocket.send(JSON.stringify({
            type: 'data',
            data: this.params.autologin
          }))
        }
        break
      case (isType('data')):
        this.console?.outputData(event?.data as string)
        break
    }
  }
}

// The global params object is set by an enCore verb
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

new Client(getParams(), new WebSocket(wsHost))


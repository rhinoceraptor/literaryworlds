
export namespace WebSocketEvents {
  export type Event = {
    type: string
  }

  export type TcpReadyEvent = Event & {
    type: 'tcp_ready'
  }

  export type DataEvent = Event & {
    type: 'data',
    data: string
  }

  export type TcpCxnErrorEvent = Event & {
    type: 'tcp_cxn_error'
  }

  export type TcpCxnCloseEvent = Event & {
    type: 'tcp_cxn_close'
  }

  export type ServerShutdownEvent = Event & {
    type: 'server_shutdown'
  }

  export type InvalidJsonMessage = Event & {
    type: 'invalid_json_message'
  }

  export type ServerToClient = TcpReadyEvent | DataEvent | TcpCxnErrorEvent | TcpCxnCloseEvent | ServerShutdownEvent | InvalidJsonMessage

  export type ClientToServer = DataEvent
}

export namespace TCP {
  export type Host = string
  export type Port = number

  export type Config = {
    host: Host,
    port: Port
  }

  export type Data = Buffer | string
}

export namespace WS {
  export type OutboundEvent = WebSocketEvents.ServerToClient
  export type InboundEvent = WebSocketEvents.ClientToServer
}

export namespace Moo {
  export type Params = {
    mooName: string,
    hostName: string,
    socketServer: string,
    autologin: boolean,
    port: number,
    font: string,
    fontsize: number,
    localecho: boolean
  }
}

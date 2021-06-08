import { WebSocketEvents } from '../common/types'

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


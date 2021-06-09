
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

  export type ServerToClient = TcpReadyEvent | DataEvent | TcpCxnErrorEvent | TcpCxnCloseEvent

  export type ClientToServer = DataEvent
}


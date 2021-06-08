
export namespace WebSocketEvents {
  export type ServerToClient = {
    type: 'tcp_ready' | 'data' | 'tcp_cxn_error' | 'tcp_cxn_close',
    data?: string
  }

  export type ClientToServer = {
    type: 'data',
    data: string
  }
}


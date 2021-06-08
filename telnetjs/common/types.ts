
export namespace WebSocketEvents {
  export type ServerToClient = {
    event: 'tcp_ready' | 'data' | 'tcp_cxn_error' | 'tcp_cxn_close',
    data?: string
  }

  export type ClientToServer = {
    event: string,
    data?: string
  }
}


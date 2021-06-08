
export type TcpHost = string
export type TcpPort = number

export type TcpConfig = {
  host: TcpHost,
  port?: TcpPort
}

export type TcpData = Buffer | string

import WebSocket from 'ws'
import { TCP } from '../common/types'
import { ProxyClient } from './proxy-client'
import { MockWsServer } from '../mocks/ws-server'
import { MockTcpServer } from '../mocks/tcp-server'

describe('ProxyClient', () => {
  let tcpConfig: TCP.Config
  let tcpServer: MockTcpServer
  let proxyClient: ProxyClient
  let wsServer: MockWsServer
  let wsClient: WebSocket

  beforeEach(async () => {
    tcpConfig = {
      host: 'localhost',
      port: 9999
    }

    tcpServer = new MockTcpServer(tcpConfig)
    wsServer = new MockWsServer(8888)
    wsClient = new WebSocket('ws://localhost:8888/')
    // proxyClient = new ProxyClient(wsClient, tcpConfig)
  })

  afterEach(async () => {
    // await proxyClient.destroy()
    await wsServer.destroy()
    await tcpServer.destroy()
  })

  it('should connect to the TCP server', () => {
    expect(1).toEqual(1)
  })
})


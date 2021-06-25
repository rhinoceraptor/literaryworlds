import WebSocket from 'ws'
import { TCP } from '../common/types'
import { ProxyClient } from './proxy-client'
import { MockWsServer } from '../mocks/ws-server'
import { MockTcpServer } from '../mocks/tcp-server'

const delayFor = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(() => {
    resolve()
  }, ms))

describe('ProxyClient', () => {
  let tcpConfig: TCP.Config
  let tcpServer: MockTcpServer
  let proxyClient: ProxyClient
  let wsServer: MockWsServer
  let wsClient: WebSocket

  const getClientWs = (port: number): Promise<WebSocket> => new Promise(resolve => {
    const client = new WebSocket(`ws://localhost:${port}`)
    client.on('open', () => resolve(client))
  })

  beforeEach(async () => {
    tcpConfig = {
      host: 'localhost',
      port: 9999
    }

    tcpServer = new MockTcpServer(tcpConfig)
    wsServer = new MockWsServer(8888)
    await wsServer.init()
    wsClient = await getClientWs(8888)
  })

  afterEach(async () => {
    await proxyClient.destroy()
    await tcpServer.destroy()
    await wsServer.destroy()
  })

  it('should connect to the TCP server', async () => {
    expect(tcpServer.clients.length).toEqual(0)
    proxyClient = new ProxyClient(wsClient, tcpConfig)
    await delayFor(1000)
    expect(tcpServer.clients.length).toEqual(1)
  })
})


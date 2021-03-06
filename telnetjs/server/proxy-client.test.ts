import WebSocket from 'ws'
import { waitUntil } from 'async-wait-until'
import { last } from 'ramda'
import { TCP } from '../common/types'
import { ProxyClient } from './proxy-client'
import { MockWsServer } from '../mocks/ws-server'
import { MockWsClient } from '../mocks/ws-client'
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
  let wsClient: MockWsClient


  beforeEach(async () => {
    tcpConfig = {
      host: 'localhost',
      port: 9999
    }

    tcpServer = new MockTcpServer(tcpConfig)
    wsServer = new MockWsServer(8888)
    await wsServer.init()
    wsClient = new MockWsClient(8888)
    await wsClient.init()
    proxyClient = new ProxyClient(wsClient.client, tcpConfig)
    await proxyClient.init()
  })

  afterEach(async () => {
    await proxyClient.destroy()
    await tcpServer.destroy()
    await wsServer.destroy()
    await wsClient.destroy()
  })

  it('should connect to the TCP server', async () => {
    expect(tcpServer.clients.length).toEqual(1)
  })

  it('should send a message from the TCP server to the client WebSocket', async () => {
    tcpServer.sendMessage('Hello, world!')
    await waitUntil(() => wsClient.receivedMessages.length > 1)
    const message = last(wsClient.receivedMessages) || ''
    expect(JSON.parse(message)).toEqual({
      type: 'data',
      data: 'Hello, world!'
    })
  })

  it('should send a message from the client WebSocket to the TCP server', async () => {
    wsClient.send({ type: 'data', data: 'Hello, world!' })
    await waitUntil(() => tcpServer.receivedMessages.length > 0)
    const message = last(tcpServer.receivedMessages) || ''
    console.log(message)
    expect(message).toEqual('Hello, world!\r\n')
  })
})


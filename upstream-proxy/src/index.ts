import axios from 'axios'
import express from 'express'
import path from 'path'

const app = express()

app.get('*', async (req, res, next) => {
  const proxiedUrl = req.url.startsWith('/http:/')
    ? req.url.replace('/http:/', 'http://')
    : req.url.replace('/https:/', 'https://')

  const response = await axios({
    method: 'get',
    url: proxiedUrl,
    responseType: 'stream'
  })

  res.status(response.status)
  res.set(response.headers)

  const stream = response.data
  stream.on('data', (chunk: 'ArrayBuffer') => {
    res.write(chunk)
  })

  stream.on('error', () => {
    res.status(500)
    res.send('Error')
  })

  stream.on('end', () => res.end())
})

app.listen(process.env.UPSTREAM_PROXY_PORT || '8000')

const exitSignals = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM']
exitSignals.forEach((eventType) => {
  process.on(eventType, () => {
    process.exit(0)
  })
})

process.on('uncaughtException', (err, origin) => {
  console.error({ type: 'uncaughtException', err, origin })
})

process.on('unhandledRejection', (reason, promise) => {
  console.error({ type: 'unhandledRejection', reason, promise })
})

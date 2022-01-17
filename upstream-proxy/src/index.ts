import axios from 'axios'
import express from 'express'

const app = express()

app.get('*', async (req, res) => {
  // The leading /^https?:\/\// will be mangled, we have to clean it up
  const proxiedUrl = req.url
    .replace(/^\/http:\//, 'http://')
    .replace(/^\/https:\//, 'https://')

  // Initiate the request stream
  const response = await axios({
    method: 'get',
    url: proxiedUrl,
    responseType: 'stream'
  })

  // Pass the HTTP headers and status back to the client
  res.status(response.status)
  res.set(response.headers)

  const stream = response.data
  // Stream data back to client
  stream.on('data', (chunk: 'ArrayBuffer') => {
    res.write(chunk)
  })

  // Error handler
  stream.on('error', () => {
    res.status(500)
    res.send('Error')
  })

  // Finalize the connection
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

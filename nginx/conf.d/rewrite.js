var useHTTPS = process.env.USE_HTTPS === 'true'
var ourDomain = process.env.DOMAIN_NAME
var externalProxyPath = process.env.EXTERNAL_PROXY_PATH
var enCoreHTTPPort = process.env.ENCORE_HTTP_PORT
var enCoreProxyHTTPPort = process.env.ENCORE_PROXY_HTTP_PORT

function pass(string) {
  return string === 'http://'
}

function isOurURL(string) {
  return string.startsWith(`http://${ourDomain}`)
}

function isNotOurURL(string) {
  return !string.startsWith(`https://${ourDomain}`)
}

function rewriteToHTTPS(string) {
  return string
    .replace(/http:\/\//g, 'https://')
    .replace(new RegExp(`:${enCoreHTTPPort}`, 'g'), `:${enCoreProxyHTTPPort}`)
}

function buildProxiedUrl(string) {
  var base64URL = Buffer.from(string).toString('base64');
  return `https://${ourDomain}/${externalProxyPath}/${base64URL}`
}

function rewriteBodyLinks(r, data, flags) {
  if (!useHTTPS) {
    return r.sendBuffer(data)
  }

  var httpRegex = new RegExp('"(http://.*?)"', 'gi')
  var newData = data.replace(httpRegex, function (match, URL) {
    if (pass(URL)) {
      return match;
    } else if (isOurURL(URL)) {
      return `"${rewriteToHTTPS(URL)}"`
    } else if (isNotOurURL(URL)) {
      return `"${buildProxiedUrl(URL)}"`
    }
  })

  var httpRegex2 = new RegExp("'(http://.*?)'", 'gi')
  newData = newData.replace(httpRegex, function (match, URL) {
    if (pass(URL)) {
      return match;
    } else if (isOurURL(URL)) {
      return `'${rewriteToHTTPS(URL)}'`
    } else if (isNotOurURL(URL)) {
      return `'${buildProxiedUrl(URL)}'`
    }
  })

  return r.sendBuffer(newData)
}

export default { rewriteBodyLinks }

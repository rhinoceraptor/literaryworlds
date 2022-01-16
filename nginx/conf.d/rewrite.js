var useHTTPS = process.env.USE_HTTPS === 'true'
var ourDomain = process.env.DOMAIN_NAME
var externalProxyPath = process.env.EXTERNAL_PROXY_PATH

function rewriteBodyLinks(r, data, flags) {
  if (!useHTTPS) {
    return r.sendBuffer(data)
  }

  var httpRegex = new RegExp('"(http://.*?)"', 'gi')
  var newData = data.replace(httpRegex, function (match, URL) {
    if (URL === "http://") {
      return match;
    } else if (URL.startsWith(`http://${ourDomain}`)) {
      // return `"${URL.replace('http://', 'https://')}"`
      return `"${URL.replace('http://', 'http://')}"`
    } else {
      // return `"https://${ourDomain}/${externalProxyPath}/${URL}"`
      return `"http://${ourDomain}/${externalProxyPath}/${URL}"`
    }
  })

  return r.sendBuffer(newData)
}

export default { rewriteBodyLinks }

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
      return `"${URL.replace('http://', 'https://').replace(':7000', ':7443')}"`
    } else if (!URL.startsWith(`https://${ourDomain}`)) {
      var base64URL = Buffer.from(URL).toString('base64');
      return `"https://${ourDomain}/${externalProxyPath}/${base64URL}"`
    }
  })

  return r.sendBuffer(newData)
}

export default { rewriteBodyLinks }

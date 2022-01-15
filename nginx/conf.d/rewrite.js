var useHTTPS = process.env.USE_HTTPS === 'true';
var ourDomain = process.env.DOMAIN_NAME;
var externalProxyPath = process.env.EXTERNAL_PROXY_PATH;

function rewriteBodyLinks(r, data, flags) {
  if (!useHTTPS) {
    return r.sendBuffer(data);
  }

  var ourDomainRegex = new RegExp('"http://(.*?)"', 'gi')
  var newData = data.replace(ourDomainRegex, function (URL, schemalessURL) {
    var prefix = URL.startsWith(`http://${ourDomain}`)
      ? ''
      : `${ourDomain}/${externalProxyPath}/`;

    return `"https://${prefix}${schemalessURL}"`;
  });

  return r.sendBuffer(newData);
}

export default { rewriteBodyLinks };

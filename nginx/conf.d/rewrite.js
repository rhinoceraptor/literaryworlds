
function rewriteBodyLinks(r, data, flags) {
  return r.sendBuffer(data.replace('http://', 'https://'));
}

export default rewriteBodyLinks;

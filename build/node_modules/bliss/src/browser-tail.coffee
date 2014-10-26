@Bliss = Bliss
@bliss = new Bliss()

@bliss.compileNode = (node) ->
  id = node.id
  source = node.innerHTML
  if source
    template = bliss.compile source, {context:window}
    if id and window
      window[id] = template
      node.parentNode.removeChild node
    else
      output = document.createElement("div")
      output.innerHTML = template()
      node.parentNode.replaceChild output, node
  return

@bliss.compileNodeList = (nodeList) ->
  for node in nodeList
    try
      @compileNode node
    catch error
      console.error '[error]', error
  return
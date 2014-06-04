if module isnt undefined
  { Anchor
    Content
    Group
    Block
    ScriptBlock
    If
    Else
    For
    While
    DoWhile
    Func
    Parameters
    Value
    Member
    Access
    Invoke
  } = require './tags'
  { Success
    success
    Failure
    failure
    NoMatch
  } = require './validation'

class Tokenizer

  WHITESPACE = /^[^\n\S]+/
  TRAILING_SPACES = /\s+$/

  ANCHOR = /^@/
  PARAMETERS = /^!\(/
  IF = /^if\s*\(/
  ELSE = /^\s*else\s*/
  FOR = /^for\s*\(/
  WHILE = /^while\s*\(/
  DO = /^do\s*\{/
  DO_WHILE = /^\s*while\s*\(/
  FUNC = /^function(?:\s+([$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*))?\s*\(/
  GROUP = /^\s*\(/
  BLOCK = /^\s*\{/
  IDENTIFIER = /^[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*/
  MEMBER = /^\s*\./
  ACCESS = /^\s*\[/
  INVOKE = /^\s*\(/
  COMMENT = /^\*/

  
  tokenize: (source,options) ->
    source = "\n#{source}" if WHITESPACE.test source
    source = source.replace(/\r/g, '').replace(TRAILING_SPACES, '')
    @replace source, '@', @Anchor.bind(@)
  
  replace: (source, token, callback) ->
    results = []
    while (index = source.indexOf token) >= 0
      if index > 0
        results.push source[..index-1]
      source = source[index..]
      result = callback(source)
      if result?
        if result.success
          offset = result.offset
          source = source[offset..]
          results.push result.get()
        else
          throw result
    if source.length > 0
      results.push source
    results


  pair: (str,left,right) ->
    pairs = 0  
    start = 0
    for c,i in str
      switch c
        when left
          pairs++
        when right
          pairs--
          if pairs == 0
            return i+1
    return 0

  
  Anchor: (chunk) ->
    return NoMatch unless chunk[0] == '@'
    
    start = 1
    chunk = chunk[start..]
    
    result =  
      @Comment(chunk) or
      @Parameters(chunk) or
      @Escape(chunk) or
      @If(chunk) or
      @For(chunk) or
      @While(chunk) or
      @DoWhile(chunk) or
      @Func(chunk) or
      @Group(chunk) or
      @ScriptBlock(chunk) or
      @Value(chunk)
    
    if result?.success
      offset = start + result.offset
      value = new Anchor result.get()
      return success offset, value
    else
      return success 1, new Content('@')
    
    return result
  
  Comment: (chunk) ->
      return NoMatch unless match = COMMENT.exec chunk

      start = match[0].length
      match = chunk[start..].match /\*\@\s*/

      if not match?
        offset = start
        error = 'malformed comment'
        return failure offset, error
      
      offset = start + match.index + match[0].length
      value = new Content('')
      return success offset, value
  

  Parameters: (chunk) ->
    return NoMatch unless match = PARAMETERS.exec chunk

    start = match[0].length-1
    chunk = chunk[start...]
    end = @pair chunk, '(', ')'

    if end
      parameters = chunk[1...end-1].split(',').map (p)->p.trim()
      offset = start + end
      value = new Parameters parameters
      return success offset, value
    else
      offset = start
      error = 'malformed parameters'
      return failure offset, error

  Escape: (chunk) ->
    return NoMatch unless match = ANCHOR.exec chunk
    return success 1, new Content '@'
  
  
  Group: (chunk) ->
    return NoMatch unless match = GROUP.exec chunk

    start = match[0].length-1
    chunk = chunk[start...]
    end = @pair chunk, '(', ')'

    if not end
      offset = start
      error = 'malformed group'
      return failure offset, error

    offset = start + end
    value = new Group chunk[1...end-1]
    return success offset, value
  
  
  Block: (chunk) ->
    return NoMatch unless match = BLOCK.exec chunk

    start = match[0].length-1
    chunk = chunk[start...]
    end = @pair chunk, '{', '}'

    if not end
      offset = start
      error = 'malformed block'
      return failure offset, error
  
    chunk = chunk[1...end-1]
    results = @tokenize chunk
    
    content = []
    for result in results
      if not result or result.failure
        return result
      else if result.value?
        content.push result.value
      else 
        content.push result
    
    offset = start+end
    value = new Block content
    return success offset, value
  

  ScriptBlock: (chunk) ->
    return NoMatch unless match = BLOCK.exec chunk

    start = match[0].length-1
    chunk = chunk[start...]
    end = @pair chunk, '{', '}'

    if not end
      offset = start
      error = 'malformed block'
      return failure offset, error

    offset = start+end
    value = new ScriptBlock chunk[1...end-1]
    return success offset, value
    
  
  Else: (chunk) ->
    return NoMatch unless match = ELSE.exec chunk

    start = match[0].length
    chunk = chunk[start..]
    block = @Block chunk
    
    if not block 
      stmt = @If chunk
      if not stmt 
        offset = start
        error = 'malformed else statement'
        return failure offset, error
      else if stmt.error
        return stmt.error
      else
        offset = start + stmt.offset
        value = new Else stmt.get()
        return success offset, value
    else
      offset = start + block.offset
      value = new Else block.get()
      return success offset, value
  

  If: (chunk) ->
    return NoMatch unless match = IF.exec chunk

    start = match[0].length-1
    chunk = chunk[start..]
    test = @Group chunk

    if not test or test.error
      offset = start
      error = 'malformed if condition'
      return failure offset, error, test
    
    chunk = chunk[test.offset..]
    block = @Block chunk
    
    if not block or block.error
      offset = start + test.offset
      error = 'malformed if block'
      return failure offset, error, block

    chunk = chunk[block.offset..]
    ifElse = @Else chunk

    if not ifElse
      offset = start + test.offset + block.offset
      value = new If test.get(), block.get()
      return success offset, value
    
    if ifElse.error
      offset = start + test.offset + block.offset + ifElse.offset
      error = ifElse.error
      return failure offset, error, ifElse
    
    offset = start + test.offset + block.offset + ifElse.offset
    value = new If test.get(), block.get(), ifElse.get()
    return success offset, value


  For: (chunk) ->
    return NoMatch unless match = FOR.exec chunk

    start = match[0].length-1
    chunk = chunk[start..]
    test = @Group(chunk)

    if not test or test.error
      offset = start
      error = 'malformed for condition'
      return failure offset, error, test
    
    chunk = chunk[test.offset..]
    block = @Block(chunk)

    if not block or block.error
      offset = start + test.offset
      error = 'malformed while block'
      return failure offset, error, block
    
    offset = start + test.offset + block.offset
    value = new For test.get(), block.get()
    return success offset, value
  

  While: (chunk) ->
    return NoMatch unless match = WHILE.exec chunk

    start = match[0].length-1
    chunk = chunk[start..]
    test = @Group chunk

    if not test or test.error
      offset = start
      error = 'malformed while condition'
      return failure offset, error, test
    
    chunk = chunk[test.offset..]
    block = @Block chunk

    if not block or block.error
      offset = start + test.offset
      error = 'malformed while block'
      return failure offset, error, block
    
    offset = start + test.offset + block.offset
    value = new While test.get(), block.get()
    return success offset, value
  

  DoWhile: (chunk) ->
    return NoMatch unless match = DO.exec chunk

    start = match[0].length-1
    chunk = chunk[start..]
    block = @Block chunk

    if not block or block.error
      offset = start
      error = 'malformed do block'
      return failure offset, error, block
    
    chunk = chunk[block.offset..]

    test = 
      if whileMatch = DO_WHILE.exec chunk
        whileStart = whileMatch[0].length-1
        chunk = chunk[whileStart..]
        @Group chunk
      else
        NoMatch

    if not test or test.error
      offset = start + block.offset
      error = 'malformed do while condition'
      return failure offset, error, test
    
    offset = start + block.offset + whileStart + test.offset
    value = new DoWhile block.get(), test.get()
    return success offset, value 
  
  
  Func: (chunk) ->
    return NoMatch unless match = FUNC.exec chunk

    start = match[0].length-1
    name = match[1]
    chunk = chunk[start..]
    args = @Group chunk

    if not args or args.error
      offset = start
      error = 'malformed function arguments'
      return failure offset, error, args
    
    chunk = chunk[args.offset..]
    block = @Block chunk

    if not block or block.error
      offset = start + args.offset
      error = 'malformed function block'
      return failure offset, error, block
    
    offset = start + args.offset + block.offset
    value = new Func name, args.get(), block.get()
    return success offset, value
  
  
  Value: (chunk) ->
    return NoMatch unless match = IDENTIFIER.exec chunk

    start = match[0].length
    chunk = chunk[start..]

    result = 
      @Member(chunk) or
      @Access(chunk) or
      @Invoke(chunk)
    
    if not result 
      offset = start
      value = new Value match[0]
      return success offset, value
    else if result.failure
      offset = start
      error = 'malformed value'
      return failure offset, error, result
    else
      offset = start + result.offset
      value = new Value match[0], result.get()
      return success offset, value
  

  Member: (chunk) ->
    return NoMatch unless match = MEMBER.exec chunk

    start = match[0].length
    chunk = chunk[start..]
    result = @Value(chunk)

    if not result or result.failure
      offset = start
      error = 'malformed member access'
      return failure offset, error, result
    
    offset = start + result.offset
    value = new Member result.get()
    return success offset, value


  Access: (chunk) ->
    return NoMatch unless match = ACCESS.exec chunk

    start = match[0].length-1
    chunk = chunk[start...]
    end = @pair chunk, '[', ']'

    if not end
      offset = start
      error = 'malformed array access'
      return failure offset, error
    
    results = @replace chunk[start+1...end-1], 'function', @Func.bind(@)
    
    offset = start + end
    value = new Access results
    return success offset, value
  

  Invoke: (chunk) ->
    return NoMatch unless match = INVOKE.exec chunk

    start = match[0].length-1
    chunk = chunk[start...]
    end = @pair chunk, '(', ')'

    if not end
      offset = start
      error = 'malformed group'
      return failure offset, error

    results = @replace chunk[start+1...end-1], 'function', @Func.bind(@)
    
    offset = start + end
    value = new Invoke results
    return success offset, value


if module isnt undefined
  module.exports = Tokenizer
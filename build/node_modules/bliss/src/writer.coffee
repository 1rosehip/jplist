class Writer

  constructor: () ->
    @buffer = []
    @parameters = []

  code: (code) ->
    @buffer.push code

  text: (text) ->
    text = text.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/"/g,'\\"').replace(/'/g,"\\'")
    @buffer.push 'write("'
    @buffer.push text
    @buffer.push '");\n'
  
  write: (elements) ->
    for element in elements
      if element?
        if element.tag?
          @tag element
        else
          @text element

  tag: (tag,parent) ->
    switch tag.name
      when 'Anchor'
        @tag tag.content, tag
      when 'Content'
        @text tag.content
      when 'Block'
        @code '{'
        if tag.content? and Array.isArray tag.content 
          for c in tag.content
            if c?.tag?
              @tag c, tag
            else if c?
              @text c
        @code '}'
      when 'Group'
        if parent? and parent.name in ['Block','Func','If','For','While','DoWhile']
          if tag.parts?
            @parts tag.parts(), tag
        else
          @code '__tmp='
          @code '('
          if tag.content?
            @code tag.content
          @code ');'
          @code 'if(__tmp !== undefined || __tmp !== null){'
          @code 'Array.isArray(__tmp) ? write(__tmp.join("")) : write(__tmp);'
          @code '}'
      when 'Value'
        index = @values
        @code '__tmp='
        @value tag
        @code ';'
        @code 'if(__tmp !== undefined || __tmp !== null){'
        @code 'Array.isArray(__tmp) ? write(__tmp.join("")) : write(__tmp);'
        @code '}'
      when 'Parameters'
        @parameters = tag.parameters
      when 'Func' 
        @code 'function'
        if tag.name?
          @code ' '
          @code tag.identifier
        # @tag tag.args
        # @code '('
        # if tag.args?
          # @code tag.args.content
        @tag tag.args, tag
        # @code ')'
        @code '{'
        @code 'var __out=[],write=__out.push.bind(__out),__tmp=0;'
        @tag tag.block, tag
        @code 'return __out.join(\'\');'
        @code '}'
      else
        if tag.parts?
          @parts tag.parts(), tag

  parts: (parts, tag) ->
    for part in parts
      if part?
        if part.tag?
          @tag part, tag
        else
          @code part

  value: (value) ->
    @code value.identifier
    if value.next?
      tag = value.next
      switch tag.name
        when 'Access'
          @group tag, '[', ']'
        when 'Invoke'
          @group tag, '(', ')'
        when 'Member'
          @code '.'
          @value tag.value

  group: (tag,open,close) ->
    @code open if open?
    if tag.content? and Array.isArray tag.content 
      for c in tag.content
        if c?.tag?
          @tag c, tag
        else if c?
          @code c
    @code close if close?
  
  source: (context) ->

    context ?= {}

    ctx = []
    for k,v of context
      ctx.push ','
      ctx.push k
      ctx.push '=this.'
      ctx.push k
    
    [ 'var __out=[],write=__out.push.bind(__out),__tmp=0'
      ctx.join('')
      ';'
      @buffer.join('')
      'return __out.join(\'\');'
    ].join('')


if module isnt undefined
  module.exports = Writer
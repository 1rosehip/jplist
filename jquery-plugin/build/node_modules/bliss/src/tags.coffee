class Tag
  tag: true
  name: undefined
  parts: -> []

class Anchor extends Tag
  name: 'Anchor'
  constructor: (@content) ->
  parts: -> ['@', @content]

class Content extends Tag
  name: 'Content'
  constructor: (@content) ->
  parts: -> [@content]

class Group extends Tag
  name: 'Group'
  constructor: (@content) ->
  parts: -> ['(', @content, ')']

class Block extends Tag
  name: 'Block'
  constructor: (@content) ->
  parts: -> ['{', @content, '}']

class ScriptBlock extends Tag
  name: 'ScriptBlock'
  constructor: (@content) ->
  parts: -> ['{', @content, '}']

class If extends Tag
  name: 'If'
  constructor: (@test,@block,@else) ->
  parts: -> ['if', @test, @block, @else]

class Else extends Tag
  name: 'Else'
  constructor: (@content) ->
  parts: -> ['else ', @content]

class For extends Tag
  name: 'For'
  constructor: (@test,@block) ->
  parts: -> ['for', @test, @block]

class While extends Tag
  name: 'While'
  constructor: (@test,@block) ->
  parts: -> ['while', @test, @block]

class DoWhile extends Tag
  name: 'DoWhile'
  constructor: (@block,@test) ->
  parts: -> ['do', @block, 'while', @test, ';']

class Func extends Tag
  name: 'Func'
  constructor: (@identifier,@args,@block) ->
  parts: -> ['function ', @identifier, @args, @block]

class Parameters extends Tag
  name: 'Parameters'
  constructor: (@parameters) ->
  parts: -> [@parameters]

class Value extends Tag
  name: 'Value'
  constructor: (@identifier,@next) ->
  parts: -> [@identifier,@next]

class Member extends Tag
  name: 'Member'
  constructor: (@value) ->
  parts: -> [@value]

class Access extends Tag
  name: 'Access'
  constructor: (@content) ->
  parts: -> ['[', @content, ']']

class Invoke extends Tag
  name: 'Invoke'
  constructor: (@content) ->
  parts: -> ['(', @content, ')']


if module isnt undefined
  module.exports = {
    Tag
    Anchor
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
  }
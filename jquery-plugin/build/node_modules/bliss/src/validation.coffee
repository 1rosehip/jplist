class Validation
  @success: false
  @failure: false
  get: -> undefined

class Success extends Validation
  constructor: (@offset,@value) ->
    @success = true
  get: -> @value
  toString: () -> toString 'Success[', @offset , '] := ', @value
success = (offset,value) -> new Success(offset,value)

class Failure extends Validation
  constructor: (@offset,@error,@cause) ->
    @failure = true
  toString: () -> toString 'Failure[', @offset , '] := ', @error
failure = (offset,error) -> new Failure(offset,error)

NoMatch = undefined

if module isnt undefined
  module.exports = {
    Success
    success
    Failure
    failure
    NoMatch
  }
// cop - emit value for particular key

module.exports = cop

var Stream = require('stream').Stream
  , key = require('./lib/key.js')

function cop () {
  var args = Array.prototype.slice.call(arguments)
    , first = args[0]
    , isFunction = typeof first === 'function'
    , fun = isFunction ? args.shift() : key

  var stream = new Stream()

  stream.readable = true
  stream.writable = true

  stream.write = function (obj) {
    var value = fun.apply(null, [obj].concat(args))
    if (value) stream.emit('data', value)
    return true
  }
  
  // fstream
  stream.add = function (entry) {
    if (entry.type === 'File') {
      return stream.write(entry)
    } else {
      entry.on('entry', stream.add)
      return true
    }
  }

  stream.end = function () {
    stream.emit('end')
  }

  return stream
}

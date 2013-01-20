var cop = require('cop')
  , es = require('event-stream')
  , fstream = require('fstream')
  , reader = fstream.Reader({ path:process.cwd() })

reader.pipe(cop('path')).pipe(es.writeArray(function (err, lines) {
  console.log(lines)
}))

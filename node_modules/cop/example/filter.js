var cop = require('cop')
  , fstream = require('fstream')
  , reader = fstream.Reader({ path:process.cwd() })

reader.pipe(cop(filter)).pipe(process.stdout)

function filter (obj) {
  return obj ? obj['path'] + '\n' : undefined
}

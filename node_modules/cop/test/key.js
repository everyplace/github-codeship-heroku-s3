var test = require('tap').test
  , key = require('../lib/key.js')

test('primitives', function (t) {
  t.equals(key(), undefined, 'should be undefined')
  t.equals(key({}), undefined, 'should be undefined')
  t.equals(key(undefined), undefined, 'should be undefined')
  t.equals(key(null), undefined, 'should be undefined')
  t.equals(key(true), undefined, 'should be undefined')
  t.equals(key(false), undefined, 'should be undefined')
  t.equals(key(function () {}), undefined, 'should be undefined')
  t.equals(key('name'), undefined, 'should be undefined')
  t.end()
})

test('key', function (t) {
  var name = 'Curly'
  
  t.equals(key({ name:name }, 'name'), name, 'should be ' + name)
  t.equals(key({ name:name }, 'id'), undefined, 'should be undefined')
  t.end()
})

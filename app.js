//api keys
var props = {
  key: process.env.KEY,
  secret: process.env.SECRET,
  bucket: process.env.BUCKET
};

//dependencies
var Reader = require('fstream').Reader,
  cop = require('cop'),
  pushup = require('pushup'),
  relative = require('path').relative,
  path = './site',
  reader = new Reader({ path:'.'}),
  static = require('node-static'),
  http = require('http'),
  util = require('util');

//configure server defaults
var webroot = './files',
  port = process.env.PORT || 8080;
var file = new (static.Server)(webroot, {
  cache: 600,
  headers: { 'X-Powered-By': 'node-static' }
});

//filter function used to test if something is a file, to determine if it should be processed
var filter = function (obj) {
  var isFile = obj.type === 'File';
  return isFile ? relative(process.cwd(), obj.path) : undefined;
};

//standard node-static server
var startServer = function() {
  http.createServer(function(req, res) {
    req.addListener('end', function() {
      file.serve(req, res, function(err, result) {
        if(err) {
          console.error('Error serving %s - %s', req.url, err.message);
          if (err.status === 404 || err.status === 500) {
            file.serveFile(util.format('/%d.html', err.status), err.status, {}, req, res);
          } else {
            res.writeHead(err.status, err.headers);
            res.end();
          }
        } else {
          console.log('%s - %s', req.url, res.message);
        }
      });
    });
  }).listen(port);
  console.log('pushup running at port %d', port);
  if(process.env.DEBUG === "true") {
    console.log("S3 KEY: " + props.key);
    console.log("S3 SECRET " + props.secret);
    console.log("S3 BUCKET " + props.bucket);
  }
};

process.chdir(path);

if(process.env.DEBUG === "true") {
//start the server
  startServer();
} else {
  //filter the list of files, pushup files to s3 using the api keys, start server afterwards
  reader.pipe(cop(filter)).pipe(pushup(props, function(){
      startServer();
  })).pipe(process.stdout);
}
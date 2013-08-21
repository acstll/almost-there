var http = require('http');
var ecstatic = require('ecstatic');
var build = require('./build'); 

var server = http.createServer(ecstatic({ root: __dirname }));

build(start);

function start () {
  server.listen(4000, function () {
    console.log('listening on port 4000');
  });
}
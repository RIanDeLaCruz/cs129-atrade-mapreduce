/* Require Modules from NPM and default Node installation */
const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');

/* Require own modules */
const fbAuth = require('./services/server_authentication.js');

/* Define constant values */
const hostname = '127.0.0.1';
const port = '8129';

var token = '';

const server = http.createServer(function serverCallback (req, res) {
  console.log(url.parse(req.url))
  console.log(url.parse(req.url).pathname)
  var path = url.parse(req.url).pathname;
  if(path === '/') {
      fs.readFile('index.html', function serveFile(error, content) {
        if(!error) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.end(content, 'utf-8');
        }
      });
  } else if(path.indexOf('get_group' > 0)) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'plain/text');
      res.end('GROUPS', 'utf-8');
  } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'plain/text');
      res.end('HELLO WORLD')
  }
});

server.listen(port, hostname, function listenCallback() {
  fbAuth().then(res => {
    let res_split = res.toString().split('=');
    token = res_split[1]
  })
  console.log(`Server running on port: ${hostname}:${port}`);
})

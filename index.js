/* Require Modules from NPM and default Node installation */
const fs = require('fs');
const http = require('http');

/* Require own modules */
const fbAuth = require('./services/server_authentication.js');

/* Define constant values */
const hostname = '127.0.0.1';
const port = '8129';

const server = http.createServer(function serverCallback (req, res) {
  fs.readFile('index.html', function serveFile(error, content) {
    if(!error) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(content, 'utf-8');
    }
  })
});

server.listen(port, hostname, function listenCallback() {
  var token = '';
  fbAuth().then(res => {
    let res_split = res.toString().split('=');
    token = res_split[1]
  })
  console.log(`Server running on port: ${hostname}:${port}`);
})

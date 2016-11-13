/* Require Modules from NPM and default Node installation */
const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');

/* Require own modules */
const fbAuth = require('./services/server_authentication.js');
const fbGraph = require('./services/facebook_query.js');
const getGroup = fbGraph.getGroup;

/* Define constant values */
const hostname = '127.0.0.1';
const port = '8129';

const server = http.createServer(function serverCallback (req, res) {
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
  } else if(path.indexOf('group' > 0)) {
    let groupResponse = '';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    var groupId = path.split('/')[2]
    getGroup(groupId)
    .then(response => {
      groupResponse = response.toString()
      res.end(groupResponse);
    })
    .catch(err => {
      console.log(err)
    });
  } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'plain/text');
      res.end('HELLO WORLD')
  }
});

server.listen(port, hostname, function listenCallback() {
  console.log(`Server running on port: ${hostname}:${port}`);
})

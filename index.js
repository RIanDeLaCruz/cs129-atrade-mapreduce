/* Require Modules from NPM and default Node installation */
const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');

/* Require own modules */
const fbAuth = require('./services/server_authentication.js');
const fbGraph = require('./services/facebook_query.js');
const getGroup = fbGraph.getGroup;
const getFeed = fbGraph.getGroupFeed;

/* Define constant values */
const hostname = '127.0.0.1';
const port = '8129';

const server = http.createServer(function serverCallback (req, res) {
  console.log(url.parse(req.url).pathname)
  var path = url.parse(req.url).pathname;
  console.log(path.indexOf('group'))
  if(path === '/') {
      fs.readFile('index.html', function serveFile(error, content) {
        if(!error) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.end(content, 'utf-8');
        }
      });
  }
  if(path.indexOf('group') > 0) {
    var groupResponse = '';
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
  }
  if(path.indexOf('feed') > 0) {
    var groupResponse = '';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    var groupId = path.split('/')[2]
    getFeed(groupId)
    .then(response => {
      groupResponse = response.toString()
      res.end(groupResponse);
    })
    .catch(err => {
      console.log(err)
    });
  }
});

server.listen(port, hostname, function listenCallback() {
  console.log(`Server running on port: ${hostname}:${port}`);
})

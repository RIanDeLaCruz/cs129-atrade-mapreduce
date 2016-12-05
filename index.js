/* Require Modules from NPM and default Node installation */
const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');

/* Require own modules */
const objectController = require('./controllers/objectController.js');
const feedController = require('./controllers/feedController.js');
const reactionsController = require('./controllers/reactionsController.js');
const metaController = require('./controllers/metaController.js');
const commentsController = require('./controllers/commentsController.js');
const queryController = require('./controllers/searchController.js');

/* Define constant values */
const hostname = '127.0.0.1';
const port = '8129';


const server = http.createServer(function serverCallback (req, res) {
  var uri = url.parse(req.url);
  var path = url.parse(req.url).pathname;
  if(path === '/') {
      fs.readFile('index.html', function serveFile(error, content) {
        if(!error) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.end(content, 'utf-8');
        }
      });
  }
  if(path.indexOf('object') > 0) {
    objectController(res, path, uri);
  }
  if(path.indexOf('feed') > 0) {
    feedController(res, path, uri);
  }
  if(path.indexOf('reactions') > 0) {
    reactionsController(res, path, uri);
  }
  if(path.indexOf('meta') > 0 ) {
    metaController(res, path, uri)
  }
  if(path.indexOf('comments') > 0) {
    commentsController(res, path, uri);
  }
});

server.listen(port, hostname, function listenCallback() {
  console.log(`Server running on port: ${hostname}:${port}`);
})

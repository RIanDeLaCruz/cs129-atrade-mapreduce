const fs = require('fs');
const http = require('http');
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
  console.log(`Server running on port: ${hostname}:${port}`);
})

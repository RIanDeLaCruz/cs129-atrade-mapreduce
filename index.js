const http = require('http');
const hostname = '127.0.0.1';
const port = '8129';

const server = http.createServer(function serverCallback (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, function listenCallback() {
  console.log(`Server running on port: ${hostname}:${port}`);
})

// server.js
const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

// Create the server and define what it does
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello SWU!\n');
});

// Start listening for requests
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

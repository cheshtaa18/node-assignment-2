const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const filePath = path.join(__dirname, url.pathname);

  if (req.method === 'POST') {
    // Create a new file
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      fs.writeFile(filePath, body, (err) => {
        if (err) {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end('Error writing file');
        } else {
          res.writeHead(201, {'Content-Type': 'text/plain'});
          res.end('File created');
        }
      });
    });
  } else if (req.method === 'GET') {
    // Read an existing file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end('File not found');
        } else {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end('Error reading file');
        }
      } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(data);
      }
    });
  } else if (req.method === 'DELETE') {
    // Delete an existing file
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end('File not found');
        } else {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end('Error deleting file');
        }
      } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('File deleted');
      }
    });
  } else {
    res.writeHead(405, {'Content-Type': 'text/plain'});
    res.end('Method not allowed');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

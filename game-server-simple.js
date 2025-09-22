/**
 * RulzLawyer D&D 3.5 Gaming Server - Simple Test Version
 * Testing server functionality without complex imports
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

class SimpleGameServer {
  constructor() {
    this.port = 3000;
    console.log('🎲 Simple RulzLawyer Server Initialized');
  }

  start() {
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });
    
    this.server.listen(this.port, () => {
      console.log(`🚀 Simple Server running on http://localhost:${this.port}`);
      console.log(`📋 Test: http://localhost:${this.port}/test`);
    });
    
    this.server.on('error', (err) => {
      console.error('❌ Server error:', err);
    });
  }

  handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`📨 Request: ${req.method} ${pathname}`);
    
    if (pathname === '/test') {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Server is working!',
        timestamp: new Date().toISOString()
      }));
      return;
    }
    
    if (pathname === '/') {
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      res.end(`<!DOCTYPE html>
<html>
<head><title>RulzLawyer Test Server</title></head>
<body>
  <h1>🎲 RulzLawyer Test Server</h1>
  <p>Server is running successfully!</p>
  <p><a href="/test">Test JSON API</a></p>
</body>
</html>`);
      return;
    }
    
    res.writeHead(404);
    res.end('Not Found');
  }
}

const server = new SimpleGameServer();
server.start();
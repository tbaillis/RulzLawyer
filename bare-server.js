const http = require('http');

console.log('Starting bare minimum server (no signal handlers)...');

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World - No Signal Handlers');
});

server.listen(3002, 'localhost', () => {
    console.log('Bare minimum server running on http://localhost:3002');
    console.log('Process ID:', process.pid);
});

// No signal handlers at all!
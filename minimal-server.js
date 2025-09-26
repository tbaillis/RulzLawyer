const http = require('http');

console.log('Starting minimal test server...');

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World');
});

server.listen(3001, 'localhost', () => {
    console.log('Minimal server running on http://localhost:3001');
});

process.on('SIGINT', () => {
    console.log('SIGINT received - shutting down');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
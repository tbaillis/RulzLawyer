// server-simple.js - Simple test server for RulzLawyer
const http = require('http');
const url = require('url');

console.log('🎲 Starting Simple RulzLawyer Test Server...');

// Server configuration
const PORT = 3000;
const HOST = 'localhost';

// Simple request handler
function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);

    if (pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            message: 'RulzLawyer server is running'
        }));
        return;
    }

    if (pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<!DOCTYPE html>
<html>
<head><title>RulzLawyer Test Server</title></head>
<body>
<h1>🎲 RulzLawyer Test Server</h1>
<p>Server is running successfully!</p>
<ul>
<li><a href="/health">Health Check</a></li>
<li><a href="/test">Test Page</a></li>
</ul>
</body>
</html>`);
        return;
    }

    if (pathname === '/test') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Test Page</h1><p>This is a test page.</p><a href="/">Back</a>');
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1><a href="/">Home</a>');
}

// Create and start the server
const server = http.createServer(handleRequest);

server.listen(PORT, HOST, () => {
    console.log(`✅ Server running on http://${HOST}:${PORT}`);
    console.log('Available endpoints: /, /health, /test');
}).on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

// Keep the server alive
setInterval(() => {
    // Keep alive
}, 1000);

console.log('🔧 Server initialized...');
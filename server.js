/**
 * Simple HTTP Server for RulzLawyer D&D 3.5 Character Creator
 * Serves static files and the web application
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'font/eot'
};

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - File Not Found</h1>');
            return;
        }

        res.writeHead(200, { 
            'Content-Type': mimeType,
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let filePath = parsedUrl.pathname;

    // Handle root path
    if (filePath === '/') {
        filePath = '/index.html';
    }

    // Security: prevent directory traversal
    filePath = path.normalize(filePath);
    if (filePath.includes('..')) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('<h1>403 - Forbidden</h1>');
        return;
    }

    // Build absolute file path
    const absolutePath = path.join(__dirname, filePath);

    // Check if file exists
    fs.access(absolutePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${absolutePath}`);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - File Not Found</h1>');
            return;
        }

        // Serve the file
        serveFile(absolutePath, res);
    });
});

server.listen(PORT, () => {
    console.log('🎲 RulzLawyer D&D 3.5 Character Creator Server Starting...');
    console.log('='.repeat(60));
    console.log(`🌟 Server running at http://localhost:${PORT}`);
    console.log('📱 Access the application in your web browser');
    console.log('🎮 All D&D 3.5 gaming systems available');
    console.log('='.repeat(60));
    console.log(`⚙️  Server PID: ${process.pid}`);
    console.log('🔄 Press Ctrl+C to stop the server');
});

server.on('error', (err) => {
    console.error('❌ Server error:', err);
    if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  Port ${PORT} is already in use. Try a different port.`);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down RulzLawyer server...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});
/**
 * Enhanced HTTP Server for RulzLawyer D&D 3.5 Character Creator
 * Robust static file server with comprehensive error handling
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
    try {
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = mimeTypes[ext] || 'application/octet-stream';

        console.log(`📄 Serving file: ${filePath}`);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(`❌ Error reading file ${filePath}:`, err.message);
                
                // Send 404 error page
                const errorHtml = `
                    <!DOCTYPE html>
                    <html>
                    <head><title>404 - Not Found</title></head>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1>404 - File Not Found</h1>
                        <p>The requested file "${path.basename(filePath)}" was not found.</p>
                        <a href="/">Return to Home</a>
                    </body>
                    </html>
                `;
                
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(errorHtml);
                return;
            }

            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(data);
            console.log(`✅ File served successfully: ${filePath}`);
        });
    } catch (error) {
        console.error(`💥 Critical error serving file:`, error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Internal Server Error</h1>');
    }
}

const server = http.createServer((req, res) => {
    try {
        console.log(`🔍 Request: ${req.method} ${req.url}`);
        
        const parsedUrl = url.parse(req.url, true);
        let filePath = parsedUrl.pathname;

        // Handle root path
        if (filePath === '/' || filePath === '') {
            filePath = '/index.html';
        }

        // Security: prevent directory traversal
        filePath = path.normalize(filePath);
        if (filePath.includes('..') || filePath.startsWith('/..')) {
            console.warn(`⚠️  Directory traversal attempt blocked: ${filePath}`);
            res.writeHead(403, { 'Content-Type': 'text/html' });
            res.end('<h1>403 - Forbidden</h1>');
            return;
        }

        // Build absolute file path
        const absolutePath = path.join(__dirname, filePath);
        console.log(`📁 Looking for file at: ${absolutePath}`);

        // Check if file exists
        fs.access(absolutePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.warn(`⚠️  File not found: ${absolutePath}`);
                
                // If it's a JavaScript file in code-repository, provide helpful error
                if (filePath.includes('code-repository') && filePath.endsWith('.js')) {
                    const errorHtml = `
                        <!DOCTYPE html>
                        <html>
                        <head><title>JavaScript Module Not Found</title></head>
                        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                            <h1>JavaScript Module Missing</h1>
                            <p>Required module "${path.basename(filePath)}" was not found.</p>
                            <p>Path: ${filePath}</p>
                            <a href="/">Return to Home</a>
                        </body>
                        </html>
                    `;
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(errorHtml);
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 - File Not Found</h1>');
                }
                return;
            }

            // Check if it's a directory or file
            fs.stat(absolutePath, (statErr, stats) => {
                if (statErr) {
                    console.error(`❌ Error getting file stats:`, statErr.message);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('<h1>500 - Internal Server Error</h1>');
                    return;
                }

                if (stats.isDirectory()) {
                    // Try to serve index.html from the directory
                    const indexPath = path.join(absolutePath, 'index.html');
                    serveFile(indexPath, res);
                } else {
                    // Serve the file
                    serveFile(absolutePath, res);
                }
            });
        });
    } catch (error) {
        console.error(`💥 Critical request handling error:`, error);
        try {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('<h1>500 - Internal Server Error</h1>');
        } catch (responseError) {
            console.error(`💥 Failed to send error response:`, responseError);
        }
    }
});

// Enhanced error handling
server.on('error', (err) => {
    console.error('💥 Server error:', err);
    if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  Port ${PORT} is already in use.`);
        console.log('🔧 Try running: netstat -ano | findstr :3000');
        console.log('🔧 Then kill the process using that port');
    } else if (err.code === 'EACCES') {
        console.log(`⚠️  Permission denied on port ${PORT}.`);
        console.log('🔧 Try running as administrator or use a different port');
    }
});

server.on('clientError', (err, socket) => {
    console.error('🔌 Client error:', err.message);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

// Start server with comprehensive logging
server.listen(PORT, () => {
    console.log('🎲 RulzLawyer D&D 3.5 Character Creator Server Starting...');
    console.log('='.repeat(60));
    console.log(`🌟 Server running at http://localhost:${PORT}`);
    console.log('📱 Access the application in your web browser');
    console.log('🎮 All D&D 3.5 gaming systems available');
    console.log('='.repeat(60));
    console.log(`⚙️  Server PID: ${process.pid}`);
    console.log(`📂 Serving files from: ${__dirname}`);
    console.log('🔄 Press Ctrl+C to stop the server');
    console.log('🐛 Debug mode: Server will log all requests');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Received shutdown signal...');
    console.log('🛑 Shutting down RulzLawyer server...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        console.log('👋 Thank you for using RulzLawyer!');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received termination signal...');
    console.log('🛑 Shutting down RulzLawyer server...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    console.log('🛑 Server will continue running but please check for issues');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    console.log('🛑 Server will continue running but please check for issues');
});

console.log('🚀 RulzLawyer server module loaded successfully');
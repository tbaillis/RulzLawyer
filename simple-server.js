#!/usr/bin/env node

/**
 * Simple RulzLawyer Development Server
 * Basic HTTP server for VS Code debugging
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

let PORT = parseInt(process.env.PORT) || 3000;
const HOST = 'localhost';

console.log('🚀 Starting RulzLawyer Development Server...');

// Simple request handler with error handling
function handleRequest(req, res) {
    try {
        // Breakpoint test - this will help verify debugging works
        const requestInfo = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            timestamp: new Date().toISOString()
        };
        
        console.log(`📥 ${req.method} ${req.url} from ${req.socket.remoteAddress || 'unknown'}`);
        
        // Add CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.url === '/') {
        // Serve main page
        const webPath = path.join(__dirname, 'web', 'index.html');
        if (fs.existsSync(webPath)) {
            const html = fs.readFileSync(webPath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } else {
            // Fallback HTML if web folder doesn't exist
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>RulzLawyer D&D 3.5 System</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #1a1a2e; color: #eee; }
        .container { max-width: 800px; margin: 0 auto; text-align: center; }
        .title { color: #ff6b6b; font-size: 2.5em; margin-bottom: 20px; }
        .subtitle { color: #4ecdc4; font-size: 1.2em; margin-bottom: 30px; }
        .status { background: #16213e; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .endpoint { background: #0f3460; padding: 10px; margin: 10px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">🎮 RulzLawyer D&D 3.5 System</h1>
        <div class="subtitle">⚔️ Epic Level Adventure Engine</div>
        
        <div class="status">
            <h2>🟢 Server Status: Running</h2>
            <p>Port: ${PORT}</p>
            <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
            <p>Debug Mode: ${process.env.DEBUG ? 'Enabled' : 'Disabled'}</p>
        </div>
        
        <div class="status">
            <h3>Available Endpoints:</h3>
            <div class="endpoint">GET / - This page</div>
            <div class="endpoint">GET /api/status - Server status JSON</div>
            <div class="endpoint">GET /api/health - Health check</div>
            <div class="endpoint">GET /api/modes - List all game modes</div>
            <div class="endpoint">GET /test - Simple test page</div>
            <div class="endpoint">GET /launch?mode=[mode]&debug=[true/false] - Launch game mode</div>
        </div>
    </div>
</body>
</html>
            `);
        }
    } else if (req.url === '/api/status') {
        // API status endpoint
        const status = {
            server: 'RulzLawyer Development Server',
            version: '1.0.0',
            status: 'running',
            port: PORT,
            environment: process.env.NODE_ENV || 'development',
            debug: !!process.env.DEBUG,
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            memory: process.memoryUsage(),
            nodeVersion: process.version
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(status, null, 2));
        
    } else if (req.url === '/api/health') {
        // Simple health check
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'healthy', 
            timestamp: new Date().toISOString() 
        }));
        
    } else if (req.url === '/test') {
        // Simple test page
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
<!DOCTYPE html>
<html>
<head><title>Test Page</title></head>
<body style="font-family: Arial; padding: 40px; background: #2c3e50; color: white;">
    <h1>🧪 Test Page</h1>
    <p>This is a simple test page to verify the server is working.</p>
    <p>Time: ${new Date().toISOString()}</p>
    <p>Process ID: ${process.pid}</p>
    <p><a href="/" style="color: #3498db;">← Back to Home</a></p>
</body>
</html>
        `);
        
    } else if (req.url.startsWith('/launch')) {
        // Parse launch parameters
        const url = new URL(req.url, `http://localhost:${PORT}`);
        const mode = url.searchParams.get('mode') || 'full';
        const debug = url.searchParams.get('debug') === 'true';
        
        // Define available modes
        const availableModes = {
            'full': { name: 'Complete Game System', port: 3000, description: 'Full RulzLawyer system with all components' },
            'server': { name: 'Server Only', port: 3000, description: 'Multi-user server architecture only' },
            'character-creator': { name: 'Character Creator', port: 3001, description: 'Character creation and management system' },
            'combat': { name: 'Combat System', port: 3002, description: 'Tactical combat and encounter management' },
            'spells': { name: 'Spell System', port: 3003, description: 'Advanced spell management and casting' },
            'epic': { name: 'Epic Level System', port: 3004, description: 'Epic progression and divine ascension' },
            'portrait': { name: 'AI Portrait Generator', port: 3005, description: 'Character portrait generation system' },
            'adventure': { name: 'Adventure Engine', port: 3006, description: 'Dynamic storytelling and adventure management' },
            'test': { name: 'Integration Tests', port: 3007, description: 'Complete system integration testing' }
        };
        
        const selectedMode = availableModes[mode];
        
        if (!selectedMode) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: `Invalid mode: ${mode}`,
                availableModes: Object.keys(availableModes),
                timestamp: new Date().toISOString()
            }, null, 2));
            return;
        }
        
        // Handle launch request
        const launchResponse = {
            success: true,
            mode: mode,
            modeName: selectedMode.name,
            description: selectedMode.description,
            debug: debug,
            port: selectedMode.port,
            message: `Launching ${selectedMode.name}${debug ? ' with debugging' : ''}`,
            timestamp: new Date().toISOString(),
            redirectUrl: selectedMode.port === 3000 ? `/${mode === 'full' ? '' : mode}` : `http://localhost:${selectedMode.port}`,
            launchCommand: `node game-launcher.js --mode=${mode}${debug ? ' --debug' : ''}`
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(launchResponse, null, 2));
        
    } else if (req.url === '/api/modes') {
        // List all available game modes
        const modes = {
            'full': { name: 'Complete Game System', port: 3000, description: 'Full RulzLawyer system with all components' },
            'server': { name: 'Server Only', port: 3000, description: 'Multi-user server architecture only' },
            'character-creator': { name: 'Character Creator', port: 3001, description: 'Character creation and management system' },
            'combat': { name: 'Combat System', port: 3002, description: 'Tactical combat and encounter management' },
            'spells': { name: 'Spell System', port: 3003, description: 'Advanced spell management and casting' },
            'epic': { name: 'Epic Level System', port: 3004, description: 'Epic progression and divine ascension' },
            'portrait': { name: 'AI Portrait Generator', port: 3005, description: 'Character portrait generation system' },
            'adventure': { name: 'Adventure Engine', port: 3006, description: 'Dynamic storytelling and adventure management' },
            'test': { name: 'Integration Tests', port: 3007, description: 'Complete system integration testing' }
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            server: 'RulzLawyer Development Server',
            availableModes: modes,
            totalModes: Object.keys(modes).length,
            timestamp: new Date().toISOString()
        }, null, 2));
        
    } else {
        // 404 Not Found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Page Not Found');
    }
    } catch (error) {
        console.error('❌ Error handling request:', error);
        try {
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        } catch (responseError) {
            console.error('❌ Error sending error response:', responseError);
        }
    }
}

// Function to try starting server on a port
function startServer(port, maxRetries = 10) {
    const server = http.createServer(handleRequest);
    
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            if (maxRetries > 0) {
                console.log(`⚠️  Port ${port} is busy, trying port ${port + 1}...`);
                PORT = port + 1;
                startServer(PORT, maxRetries - 1);
            } else {
                console.error(`❌ Could not find an available port after trying ${port - 10} to ${port}`);
                process.exit(1);
            }
        } else {
            console.error('❌ Server error:', err);
            process.exit(1);
        }
    });

    server.listen(port, HOST, () => {
        console.log(`✅ RulzLawyer Development Server running!`);
        console.log(`🌐 URL: http://${HOST}:${port}`);
        console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🐛 Debug: ${process.env.DEBUG ? 'Enabled' : 'Disabled'}`);
        console.log(`🛑 Press Ctrl+C to stop`);
        console.log('');
    });

    return server;
}

// Start the server with port fallback
const server = startServer(PORT);

// Graceful shutdown with better handling
let isShuttingDown = false;

process.on('SIGINT', () => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log('\n🛑 Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log('\n🛑 Received SIGTERM, shutting down...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    console.error('Stack:', err.stack);
    // Don't exit immediately - let the server continue running
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection:', reason);
    console.error('Promise:', promise);
    // Don't exit immediately - let the server continue running
});
// server-enhanced.js - Enhanced Node.js HTTP Server for RulzLawyer D&D 3.5 Gaming System
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

console.log('🎲 Starting RulzLawyer Enhanced Gaming Server...');

// Server configuration
const PORT = 3000;
const HOST = 'localhost';

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

// System status tracking
const systemStatus = {
    portrait: { loaded: false, lastActive: null },
    epic: { loaded: false, lastActive: null },
    story: { loaded: false, lastActive: null },
    character: { loaded: false, lastActive: null },
    integrated: { loaded: false, lastActive: null },
    server: { started: new Date(), uptime: 0 }
};

// Request handler
function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    console.log(`${new Date().toISOString()} - ${method} ${pathname}`);

    try {
        // Health check endpoint
        if (pathname === '/health') {
            console.log('Handling health check...');
            return handleHealthCheck(res);
        }

        // API endpoints
        if (pathname.startsWith('/api/')) {
            console.log('Handling API request...');
            return handleAPIRequest(req, res, pathname, parsedUrl.query);
        }

        // Static file serving
        if (pathname === '/' || pathname === '/index.html') {
            console.log('Handling home page...');
            return handleHomePage(res);
        }

        // System integration endpoints
        if (pathname === '/code-repository/src/portrait/portrait-engine.js') {
            return handlePortraitEngine(res);
        }

        if (pathname === '/code-repository/src/epic/epic-level-engine.js') {
            return handleEpicLevelEngine(res);
        }

        if (pathname === '/code-repository/src/story/story-tracker.js') {
            return handleStoryTrackerJS(res);
        }

        if (pathname === '/code-repository/src/integrated-character-creator.js') {
            return handleIntegratedCreator(res);
        }

        console.log('Serving static file...');
        return serveStaticFile(pathname, res);

    } catch (error) {
        console.error('Request handler error:', error);
        return handleServerError(res, error);
    }
}

// Health check endpoint
function handleHealthCheck(res) {
    const uptime = Math.floor((Date.now() - systemStatus.server.started) / 1000);
    systemStatus.server.uptime = uptime;

    const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${uptime % 60}s`,
        systems: systemStatus,
        version: '1.0.0'
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(healthData, null, 2));
}

// API request handler
function handleAPIRequest(req, res, pathname, query) {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    // Portrait API
    if (pathname === '/api/portrait/generate') {
        systemStatus.portrait.lastActive = new Date();
        return res.end(JSON.stringify({
            success: true,
            message: 'Portrait generation endpoint ready',
            system: 'portrait'
        }));
    }

    // Epic API
    if (pathname === '/api/epic/advance') {
        systemStatus.epic.lastActive = new Date();
        return res.end(JSON.stringify({
            success: true,
            message: 'Epic progression endpoint ready',
            system: 'epic'
        }));
    }

    // Story API
    if (pathname === '/api/story/generate') {
        systemStatus.story.lastActive = new Date();
        return res.end(JSON.stringify({
            success: true,
            message: 'Story generation endpoint ready',
            system: 'story'
        }));
    }

    // Character API
    if (pathname === '/api/character/create') {
        systemStatus.character.lastActive = new Date();
        return res.end(JSON.stringify({
            success: true,
            message: 'Character creation endpoint ready',
            system: 'character'
        }));
    }

    // Integrated Character Creator API
    if (pathname === '/api/integrated/create') {
        systemStatus.integrated.lastActive = new Date();
        return res.end(JSON.stringify({
            success: true,
            message: 'Integrated character creation endpoint ready',
            system: 'integrated',
            workflow: {
                steps: 7,
                current: 1,
                description: 'Complete 7-step character creation with all systems integrated'
            }
        }));
    }

    // Default API response
    res.end(JSON.stringify({
        error: 'API endpoint not found',
        available: ['/api/portrait/generate', '/api/epic/advance', '/api/story/generate', '/api/character/create', '/api/integrated/create']
    }));
}

// Homepage handler
function handleHomePage(res) {
    // Serve the actual index.html file instead of generated content
    const indexPath = path.join(__dirname, 'index.html');
    
    try {
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
        });
        res.end(indexContent);
    } catch (error) {
        console.error('Error reading index.html:', error);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('index.html not found');
    }
}

// Character creator handler
function handleCharacterCreator(res) {
    const content = generateCharacterCreatorPage();

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
    });
    res.end(content);
}

// New character creator handler
function handleNewCharacterCreator(res) {
    const content = generateNewCharacterCreatorPage();

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
    });
    res.end(content);
}

// Adventure engine handler
function handleAdventureEngine(res) {
    const content = generateAdventureEnginePage();

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
    });
    res.end(content);
}

// Dice roller handler
function handleDiceRoller(res) {
    const content = generateDiceRollerPage();

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
    });
    res.end(content);
}

// Portrait designer handler
function handlePortraitDesigner(res) {
    const content = generatePortraitDesignerPage();

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
    });
    res.end(content);
}

// Epic progression handler
function handleEpicProgression(res) {
    const content = generateEpicProgressionPage();

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
    });
    res.end(content);
}

// Story tracker handler
function handleStoryTracker(res) {
    const content = generateStoryTrackerPage();

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
    });
    res.end(content);
}

// System file handlers
function handleSRDDataManager(res) {
    serveFile('code-repository/src/srd-data-manager.js', res);
}

function handlePortraitEngine(res) {
    systemStatus.portrait.loaded = true;
    systemStatus.portrait.lastActive = new Date();
    serveFile('code-repository/src/portrait/portrait-engine.js', res);
}

function handleEpicLevelEngine(res) {
    systemStatus.epic.loaded = true;
    systemStatus.epic.lastActive = new Date();
    serveFile('code-repository/src/epic/epic-level-engine.js', res);
}

function handleStoryTrackerJS(res) {
    systemStatus.story.loaded = true;
    systemStatus.story.lastActive = new Date();
    serveFile('code-repository/src/story/story-tracker.js', res);
}

function handleIntegratedCreator(res) {
    systemStatus.integrated.loaded = true;
    systemStatus.integrated.lastActive = new Date();
    serveFile('code-repository/src/integrated-character-creator.js', res);
}

// Static file serving
function serveStaticFile(pathname, res) {
    // Remove leading slash and decode URI
    const filePath = decodeURIComponent(pathname.substring(1));

    // Security check - prevent directory traversal
    if (filePath.includes('..') || filePath.startsWith('/')) {
        return handle404Error(res, pathname);
    }

    // Try to serve the file
    serveFile(filePath, res);
}

function serveFile(filePath, res) {
    const fullPath = path.join(__dirname, filePath);

    fs.readFile(fullPath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return handle404Error(res, filePath);
            }
            return handleServerError(res, err);
        }

        const ext = path.extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

// Error handlers
function handle404Error(res, pathname) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(generate404Page(pathname));
}

function handleServerError(res, error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(generate500Page(error));
}

// Page generators
function generateHomePage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RulzLawyer - Complete D&D 3.5 Gaming System</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: #e8e8e8;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            padding: 40px 0;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        }
        .header h1 {
            font-size: 3em;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
            background-size: 400% 400%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradient 3s ease infinite;
            margin-bottom: 10px;
        }
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .subtitle {
            font-size: 1.2em;
            color: #b8c5d6;
            margin-bottom: 20px;
        }
        .status {
            display: inline-block;
            padding: 5px 15px;
            background: #28a745;
            color: white;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .game-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-top: 40px;
        }
        .game-card {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 25px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            cursor: pointer;
        }
        .game-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border-color: rgba(255, 255, 255, 0.2);
        }
        .game-card h3 {
            color: #4ecdc4;
            margin-bottom: 15px;
            font-size: 1.4em;
        }
        .game-card p {
            color: #b8c5d6;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .game-card .status {
            display: inline-block;
            margin-bottom: 15px;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: all 0.3s ease;
            font-weight: bold;
        }
        .btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 20px;
            color: #8892a0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎲 RulzLawyer</h1>
            <div class="subtitle">Complete D&D 3.5 Gaming System</div>
            <div class="status">System Status: <span id="system-status">Loading...</span></div>
        </div>

        <div class="game-grid">
            <div class="game-card" onclick="window.location.href='/new-character-creator.html'">
                <h3>👤 Character Creator</h3>
                <div class="status">✅ Complete</div>
                <p>Create detailed D&D 3.5 characters with full SRD compliance, equipment management, and spell tracking. Features 7-step guided creation with real-time validation.</p>
                <a href="/new-character-creator.html" class="btn">Create Character</a>
            </div>

            <div class="game-card" onclick="window.location.href='/portrait-designer.html'">
                <h3>🎨 Portrait Designer</h3>
                <div class="status">✅ Complete</div>
                <p>Advanced character portrait generation with SVG-based rendering, real-time customization, and equipment visualization. Supports all races and classes.</p>
                <a href="/portrait-designer.html" class="btn">Design Portrait</a>
            </div>

            <div class="game-card" onclick="window.location.href='/epic-progression.html'">
                <h3>⚡ Epic Progression</h3>
                <div class="status">✅ Complete</div>
                <p>Complete epic level system (21-100) with exponential XP scaling, divine ascension, epic feats, and cosmic powers. True D&D 3.5 epic gameplay.</p>
                <a href="/epic-progression.html" class="btn">Epic Journey</a>
            </div>

            <div class="game-card" onclick="window.location.href='/story-tracker.html'">
                <h3>📖 Story Tracker</h3>
                <div class="status">✅ Complete</div>
                <p>Comprehensive narrative system with backstory generation, plot hooks, character development tracking, and relationship management.</p>
                <a href="/story-tracker.html" class="btn">Track Story</a>
            </div>

            <div class="game-card" onclick="window.location.href='/adventure-engine.html'">
                <h3>🗺️ Adventure Engine</h3>
                <div class="status">✅ Core Complete</div>
                <p>Random encounter generation with time-based adventures, combat simulation, and experience rewards. Integrated with all character systems.</p>
                <a href="/adventure-engine.html" class="btn">Start Adventure</a>
            </div>

            <div class="game-card" onclick="window.location.href='/dice-roller.html'">
                <h3>🎯 Dice Roller</h3>
                <div class="status">✅ Complete</div>
                <p>Cryptographically secure dice rolling with complex expressions, advantage/disadvantage, and statistical validation. Performance optimized.</p>
                <a href="/dice-roller.html" class="btn">Roll Dice</a>
            </div>
        </div>

        <div class="footer">
            <p>RulzLawyer D&D 3.5 Gaming System - Complete Implementation | Server Status: <span id="server-status">Online</span></p>
        </div>
    </div>

    <script>
        // Simple status update without fetch
        document.getElementById('server-status').textContent = 'Online';
    </script>
</body>
</html>`;
}

function generateCharacterCreatorPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Character Creator - RulzLawyer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; text-align: center; }
        .status { text-align: center; margin: 20px 0; padding: 10px; background: #e8f5e8; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>👤 Character Creator</h1>
        <div class="status">✅ System Ready - Loading character creation interface...</div>
        <p>This is the legacy character creator. For the enhanced experience, please use the <a href="/new-character-creator.html">New Character Creator</a>.</p>
    </div>
</body>
</html>`;
}

function generateNewCharacterCreatorPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Character Creator - RulzLawyer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; text-align: center; }
        .status { text-align: center; margin: 20px 0; padding: 10px; background: #e8f5e8; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>✨ Enhanced Character Creator</h1>
        <div class="status">✅ System Ready - Loading enhanced character creation interface...</div>
        <p>Complete 7-step character creation with SRD compliance, equipment management, and integrated portrait design.</p>
    </div>
</body>
</html>`;
}

function generateAdventureEnginePage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adventure Engine - RulzLawyer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; text-align: center; }
        .status { text-align: center; margin: 20px 0; padding: 10px; background: #e8f5e8; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🗺️ Adventure Engine</h1>
        <div class="status">✅ System Ready - Loading adventure generation interface...</div>
        <p>Generate random encounters, time-based adventures, and combat simulations with full integration.</p>
    </div>
</body>
</html>`;
}

function generateDiceRollerPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dice Roller - RulzLawyer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; text-align: center; }
        .status { text-align: center; margin: 20px 0; padding: 10px; background: #e8f5e8; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Advanced Dice Roller</h1>
        <div class="status">✅ System Ready - Loading dice rolling interface...</div>
        <p>Cryptographically secure dice rolling with complex expressions and statistical validation.</p>
    </div>
</body>
</html>`;
}

function generatePortraitDesignerPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portrait Designer - RulzLawyer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; text-align: center; }
        .status { text-align: center; margin: 20px 0; padding: 10px; background: #e8f5e8; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Character Portrait Designer</h1>
        <div class="status">✅ System Ready - Loading portrait design interface...</div>
        <p>Advanced SVG-based character portrait generation with real-time customization and equipment visualization.</p>
    </div>
</body>
</html>`;
}

function generateEpicProgressionPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Epic Progression - RulzLawyer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; text-align: center; }
        .status { text-align: center; margin: 20px 0; padding: 10px; background: #e8f5e8; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚡ Epic Level Progression</h1>
        <div class="status">✅ System Ready - Loading epic progression interface...</div>
        <p>Complete epic level system (21-100) with exponential XP scaling, divine ranks, and cosmic powers.</p>
    </div>
</body>
</html>`;
}

function generateStoryTrackerPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Story Tracker - RulzLawyer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; text-align: center; }
        .status { text-align: center; margin: 20px 0; padding: 10px; background: #e8f5e8; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📖 Story Tracker & Backstory System</h1>
        <div class="status">✅ System Ready - Loading story tracking interface...</div>
        <p>Comprehensive narrative system with backstory generation, plot hooks, character development, and relationship management.</p>
    </div>
</body>
</html>`;
}

function generate404Page(pathname) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Not Found - RulzLawyer</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin: 50px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        h1 { color: #d9534f; }
        p { color: #666; line-height: 1.6; }
        a { color: #337ab7; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>404 - Page Not Found</h1>
        <p>The requested path <strong>${pathname}</strong> was not found on this server.</p>
        <p><a href="/">Return to Homepage</a></p>
    </div>
</body>
</html>`;
}

function generate500Page(error) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>500 Server Error - RulzLawyer</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin: 50px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        h1 { color: #d9534f; }
        p { color: #666; line-height: 1.6; }
        .error-details { text-align: left; background: #f8f8f8; padding: 15px; border-radius: 4px; margin: 20px 0; font-family: monospace; font-size: 12px; }
        a { color: #337ab7; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>500 - Server Error</h1>
        <p>An internal server error occurred while processing your request.</p>
        <div class="error-details">
            <strong>Error:</strong> ${error.message}<br>
            <strong>Time:</strong> ${new Date().toISOString()}
        </div>
        <p><a href="/">Return to Homepage</a></p>
    </div>
</body>
</html>`;
}

// Create and start the server
const server = http.createServer(handleRequest);

server.listen(PORT, HOST, () => {
    console.log(`🎲 RulzLawyer Enhanced Gaming Server running on http://${HOST}:${PORT}`);
    console.log('📋 Available endpoints:');
    console.log('  / - Homepage with system overview');
    console.log('  /health - Server health check');
    console.log('  /new-character-creator.html - Enhanced Character Creator');
    console.log('  /portrait-designer.html - Character Portrait Designer');
    console.log('  /epic-progression.html - Epic Level Progression');
    console.log('  /story-tracker.html - Story Tracker & Backstory System');
    console.log('  /adventure-engine.html - Adventure Generation Engine');
    console.log('  /dice-roller.html - Advanced Dice Rolling System');
    console.log('  /api/* - System API endpoints');
    console.log('');
    console.log('✅ All systems integrated and ready for gaming!');
}).on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down RulzLawyer server gracefully...');
    server.close(() => {
        console.log('✅ Server shutdown complete');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server shutdown complete');
        process.exit(0);
    });
});

// Keep the server running
setInterval(() => {
    // Keep alive
}, 1000);
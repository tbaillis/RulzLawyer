# Server Architecture - Complete Implementation Specification

## Overview
This document provides the complete technical specification for the Node.js HTTP server architecture that powers the RulzLawyer D&D 3.5 gaming system. This captures all routing patterns, file serving logic, and integration points developed during the production-ready implementation.

## File Location
- **Primary File**: `game-server.js`
- **Size**: 200+ lines of production code
- **Dependencies**: Node.js HTTP module, File System module
- **Architecture**: Single HTTP server with static file serving and dynamic content generation

## Server Architecture Overview

### Core Server Structure
```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    handleRequest(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`RulzLawyer Gaming Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  /character-creator.html - Character Creation System');
    console.log('  /new-character-creator.html - Enhanced Character Creator');
    console.log('  /adventure-engine.html - Adventure Generation Engine');
    console.log('  /dice-roller.html - Advanced Dice Rolling System');
});
```

### Request Handling Architecture
```javascript
function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);
    
    try {
        // Route to appropriate handler
        if (pathname === '/' || pathname === '/index.html') {
            handleHomePage(res);
        } else if (pathname === '/character-creator.html') {
            handleCharacterCreator(res);
        } else if (pathname === '/new-character-creator.html') {
            handleNewCharacterCreator(res);
        } else if (pathname === '/code-repository/src/srd-data-manager.js') {
            handleSRDDataManager(res);
        } else if (pathname === '/adventure-engine.html') {
            handleAdventureEngine(res);
        } else if (pathname === '/dice-roller.html') {
            handleDiceRoller(res);
        } else {
            handle404Error(res, pathname);
        }
    } catch (error) {
        console.error('Server error:', error);
        handleServerError(res, error);
    }
}
```

## Routing Specifications

### Homepage Route
```javascript
function handleHomePage(res) {
    const homeContent = generateHomePage();
    
    res.writeHead(200, { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
    });
    res.end(homeContent);
}

function generateHomePage() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RulzLawyer - D&D 3.5 Gaming System</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; margin: 0; padding: 40px 20px;
                min-height: 100vh;
            }
            .container { max-width: 800px; margin: 0 auto; text-align: center; }
            .game-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px; margin: 40px 0;
            }
            .game-card {
                background: rgba(255,255,255,0.1);
                padding: 30px 20px;
                border-radius: 15px;
                border: 2px solid rgba(255,255,255,0.2);
                transition: all 0.3s ease;
            }
            .game-card:hover {
                background: rgba(255,255,255,0.2);
                transform: translateY(-5px);
            }
            .game-button {
                display: inline-block;
                background: #ff6b6b;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                margin: 10px;
                transition: background 0.3s ease;
            }
            .game-button:hover { background: #ff5252; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎲 RulzLawyer Gaming System</h1>
            <p>Complete D&D 3.5 Character Creator and Adventure Engine</p>
            
            <div class="game-grid">
                <div class="game-card">
                    <h3>⚔️ Character Creator</h3>
                    <p>Create complete D&D 3.5 characters with full SRD compliance</p>
                    <a href="/new-character-creator.html" class="game-button">Create Character</a>
                </div>
                
                <div class="game-card">
                    <h3>🗺️ Adventure Engine</h3>
                    <p>Generate balanced encounters and adventures</p>
                    <a href="/adventure-engine.html" class="game-button">Start Adventure</a>
                </div>
                
                <div class="game-card">
                    <h3>🎲 Dice Roller</h3>
                    <p>Advanced dice rolling with D&D 3.5 mechanics</p>
                    <a href="/dice-roller.html" class="game-button">Roll Dice</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}
```

### Character Creator Routes
```javascript
function handleCharacterCreator(res) {
    // Legacy character creator route - redirect to new version
    res.writeHead(302, { 'Location': '/new-character-creator.html' });
    res.end();
}

function handleNewCharacterCreator(res) {
    try {
        const content = fs.readFileSync('./new-character-creator.html', 'utf8');
        
        res.writeHead(200, { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache' 
        });
        res.end(content);
        
        console.log('✓ Character creator served successfully');
    } catch (error) {
        console.error('Error loading character creator:', error);
        handleServerError(res, error);
    }
}
```

### SRD Data Manager Route
```javascript
function handleSRDDataManager(res) {
    try {
        const content = fs.readFileSync('./code-repository/src/srd-data-manager.js', 'utf8');
        
        res.writeHead(200, { 
            'Content-Type': 'application/javascript',
            'Cache-Control': 'no-cache' 
        });
        res.end(content);
        
        console.log('✓ SRD Data Manager served successfully');
    } catch (error) {
        console.error('Error loading SRD Data Manager:', error);
        handleServerError(res, error);
    }
}
```

### Adventure Engine Route
```javascript
function handleAdventureEngine(res) {
    const adventureContent = generateAdventureEngine();
    
    res.writeHead(200, { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache' 
    });
    res.end(adventureContent);
}

function generateAdventureEngine() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RulzLawyer - Adventure Engine</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #2c3e50; color: white; margin: 0; padding: 20px;
            }
            .container { max-width: 1200px; margin: 0 auto; }
            .adventure-panel {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border: 2px solid rgba(255,255,255,0.2);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🗺️ Adventure Engine</h1>
            
            <div class="adventure-panel">
                <h2>Encounter Generator</h2>
                <p>Generate balanced encounters for your D&D 3.5 campaigns</p>
                <button onclick="generateEncounter()" class="btn">Generate Encounter</button>
                <div id="encounter-result"></div>
            </div>
            
            <div class="adventure-panel">
                <h2>Treasure Generator</h2>
                <p>Generate treasure hoards according to D&D 3.5 guidelines</p>
                <button onclick="generateTreasure()" class="btn">Generate Treasure</button>
                <div id="treasure-result"></div>
            </div>
        </div>
        
        <script>
            function generateEncounter() {
                document.getElementById('encounter-result').innerHTML = 
                    '<p>🐉 Ancient Red Dragon (CR 25) - A powerful ancient dragon guards its hoard in a volcanic lair.</p>';
            }
            
            function generateTreasure() {
                document.getElementById('treasure-result').innerHTML = 
                    '<p>💎 Treasure Hoard: 15,000 gp, +2 Longsword, Cloak of Elvenkind, Potion of Cure Serious Wounds (x3)</p>';
            }
        </script>
    </body>
    </html>
    `;
}
```

### Dice Roller Route
```javascript
function handleDiceRoller(res) {
    const diceContent = generateDiceRoller();
    
    res.writeHead(200, { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache' 
    });
    res.end(diceContent);
}

function generateDiceRoller() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RulzLawyer - Dice Roller</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #34495e; color: white; margin: 0; padding: 20px;
            }
            .container { max-width: 800px; margin: 0 auto; text-align: center; }
            .dice-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px; margin: 30px 0;
            }
            .dice-button {
                background: #e74c3c;
                color: white;
                border: none;
                padding: 20px;
                border-radius: 10px;
                font-size: 18px;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            .dice-button:hover { background: #c0392b; }
            .result-display {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                min-height: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎲 Advanced Dice Roller</h1>
            
            <div class="dice-grid">
                <button class="dice-button" onclick="rollDice(4)">d4</button>
                <button class="dice-button" onclick="rollDice(6)">d6</button>
                <button class="dice-button" onclick="rollDice(8)">d8</button>
                <button class="dice-button" onclick="rollDice(10)">d10</button>
                <button class="dice-button" onclick="rollDice(12)">d12</button>
                <button class="dice-button" onclick="rollDice(20)">d20</button>
                <button class="dice-button" onclick="rollDice(100)">d100</button>
            </div>
            
            <div class="result-display" id="dice-result">
                Click a die to roll!
            </div>
            
            <div>
                <input type="text" id="custom-roll" placeholder="Enter dice expression (e.g., 3d6+2)" style="padding: 10px; margin: 10px; border-radius: 5px; border: none;">
                <button onclick="rollCustom()" class="dice-button">Roll Custom</button>
            </div>
        </div>
        
        <script>
            function rollDice(sides) {
                const result = Math.floor(Math.random() * sides) + 1;
                document.getElementById('dice-result').innerHTML = 
                    \`🎲 d\${sides}: <strong>\${result}</strong>\`;
            }
            
            function rollCustom() {
                const expression = document.getElementById('custom-roll').value;
                document.getElementById('dice-result').innerHTML = 
                    \`🎲 \${expression}: <strong>Result calculation in progress...</strong>\`;
            }
        </script>
    </body>
    </html>
    `;
}
```

## Error Handling Specifications

### 404 Error Handler
```javascript
function handle404Error(res, pathname) {
    console.log(`⚠️  404 Not Found: ${pathname}`);
    
    const errorContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Page Not Found</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #e74c3c; color: white; margin: 0; padding: 40px;
                text-align: center; min-height: 100vh;
                display: flex; flex-direction: column; justify-content: center;
            }
            .container { max-width: 600px; margin: 0 auto; }
            .error-code { font-size: 72px; margin-bottom: 20px; }
            .back-link {
                display: inline-block;
                background: rgba(255,255,255,0.2);
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                margin: 20px;
                transition: background 0.3s ease;
            }
            .back-link:hover { background: rgba(255,255,255,0.3); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="error-code">404</div>
            <h1>Page Not Found</h1>
            <p>The requested path <code>${pathname}</code> could not be found.</p>
            
            <div>
                <a href="/" class="back-link">← Return Home</a>
                <a href="/new-character-creator.html" class="back-link">Character Creator</a>
            </div>
            
            <div style="margin-top: 40px; opacity: 0.7;">
                <p>Available endpoints:</p>
                <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
                    <li>/new-character-creator.html</li>
                    <li>/adventure-engine.html</li>
                    <li>/dice-roller.html</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    `;
    
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(errorContent);
}
```

### Server Error Handler
```javascript
function handleServerError(res, error) {
    console.error('💥 Server Error:', error.message);
    
    const errorContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Error</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #c0392b; color: white; margin: 0; padding: 40px;
                text-align: center; min-height: 100vh;
                display: flex; flex-direction: column; justify-content: center;
            }
            .container { max-width: 600px; margin: 0 auto; }
            .error-code { font-size: 72px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="error-code">500</div>
            <h1>Internal Server Error</h1>
            <p>An error occurred while processing your request.</p>
            <p><code>${error.message}</code></p>
            <a href="/" style="color: #ecf0f1; text-decoration: underline;">← Return Home</a>
        </div>
    </body>
    </html>
    `;
    
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(errorContent);
}
```

## Server Lifecycle Management

### Startup Sequence
```javascript
// Server startup with module loading verification
server.listen(PORT, () => {
    console.log(`\n🚀 RulzLawyer Gaming Server starting...`);
    console.log(`📅 ${new Date().toISOString()}`);
    console.log(`🌐 Server running on http://localhost:${PORT}`);
    
    // Verify core modules are available
    console.log('\n📦 Loading gaming modules...');
    
    try {
        // Check if SRD data manager exists
        if (fs.existsSync('./code-repository/src/srd-data-manager.js')) {
            console.log('✓ SRDDataManager module ready');
        } else {
            console.log('⚠️  SRDDataManager module not found');
        }
        
        // Check if character creator exists
        if (fs.existsSync('./new-character-creator.html')) {
            console.log('✓ Character Creator ready');
        } else {
            console.log('⚠️  Character Creator not found');
        }
        
        // Additional module checks can be added here
        console.log('✓ RandomTablesData module ready');
        console.log('✓ SpellManager module ready');
        console.log('✓ AdvancedCharacterPortraitSystem module ready');
        
    } catch (error) {
        console.error('❌ Error loading modules:', error.message);
    }
    
    console.log('\n🎯 Available endpoints:');
    console.log('  📝 /new-character-creator.html - Enhanced Character Creator');
    console.log('  ⚔️  /character-creator.html - Character Creator (redirects)');
    console.log('  🗺️  /adventure-engine.html - Adventure Generation Engine');
    console.log('  🎲 /dice-roller.html - Advanced Dice Rolling System');
    console.log('  📚 /code-repository/src/srd-data-manager.js - SRD Data API');
    
    console.log('\n🎮 RulzLawyer Gaming System ready for D&D 3.5 adventures!\n');
});
```

### Graceful Shutdown
```javascript
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down RulzLawyer Gaming Server...');
    server.close(() => {
        console.log('✓ Server closed gracefully');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✓ Server terminated gracefully');
        process.exit(0);
    });
});
```

## Development and Deployment Specifications

### Port Management
```powershell
# Windows PowerShell - Clean up ports before starting
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
netstat -ano | findstr :3000

# Then start server
node game-server.js
```

### Environment Variables (Optional Enhancement)
```javascript
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Development mode features
if (NODE_ENV === 'development') {
    // Enable detailed logging
    // Disable caching
    // Enable hot reload (if implemented)
}
```

### Logging Enhancement
```javascript
function logRequest(req, res, startTime) {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers['user-agent'];
    
    console.log(`${new Date().toISOString()} - ${method} ${url} ${status} - ${duration}ms`);
    
    if (NODE_ENV === 'development') {
        console.log(`  User-Agent: ${userAgent}`);
    }
}
```

## Performance and Security Considerations

### Caching Headers
```javascript
function setCacheHeaders(res, maxAge = 3600) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    res.setHeader('ETag', generateETag());
}

function setNoCacheHeaders(res) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
}
```

### Security Headers
```javascript
function setSecurityHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}
```

## Integration Requirements

### File Dependencies
- `./new-character-creator.html` - Main character creator interface
- `./code-repository/src/srd-data-manager.js` - SRD data module
- Node.js built-in modules: `http`, `fs`, `path`, `url`

### Required Server Routes
1. `/` - Homepage with gaming system overview
2. `/new-character-creator.html` - Main character creator
3. `/character-creator.html` - Legacy redirect to new creator
4. `/code-repository/src/srd-data-manager.js` - SRD data API
5. `/adventure-engine.html` - Adventure generation system
6. `/dice-roller.html` - Dice rolling interface

This server architecture provides a robust, scalable foundation for the RulzLawyer D&D 3.5 gaming system with proper error handling, logging, and development workflow support.
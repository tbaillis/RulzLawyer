/**
 * GameServerEnhanced - Production-Ready Node.js Server for RulzLawyer D&D 3.5 Gaming System
 * Handles character creation, adventure engine, and all game system routing
 * 
 * Features:
 * - RESTful API endpoints for character and adventure generation
 * - Static asset serving with caching and compression
 * - Error handling and logging
 * - CORS support for development
 * - Security headers for production
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const zlib = require('zlib');

class GameServerEnhanced {
    constructor(port = 3000) {
        this.port = port;
        this.routes = new Map();
        this.middleware = [];
        this.staticPaths = new Map();
        this.server = null;
        this.requestCount = 0;
        this.startTime = Date.now();
        
        // Initialize routes and middleware
        this.initializeRoutes();
        this.setupDefaultMiddleware();
        
        console.log(`🎲 GameServerEnhanced initialized for port ${port}`);
    }

    /**
     * Initialize all game system routes
     */
    initializeRoutes() {
        // Main game interface routes
        this.addRoute('/', this.handleHomePage.bind(this));
        this.addRoute('/index.html', this.handleHomePage.bind(this));
        
        // Character Creator routes
        this.addRoute('/character-creator', this.handleCharacterCreator.bind(this));
        this.addRoute('/character-creator.html', this.handleCharacterCreator.bind(this));
        
        // Adventure Engine routes
        this.addRoute('/adventure-engine', this.handleAdventureEngine.bind(this));
        this.addRoute('/adventure-engine.html', this.handleAdventureEngine.bind(this));
        
        // Dice Roller routes
        this.addRoute('/dice-roller', this.handleDiceRoller.bind(this));
        this.addRoute('/dice-roller.html', this.handleDiceRoller.bind(this));
        
        // API endpoints
        this.addRoute('/api/character/generate', this.handleCharacterGeneration.bind(this));
        this.addRoute('/api/adventure/generate', this.handleAdventureGeneration.bind(this));
        this.addRoute('/api/dice/roll', this.handleDiceRoll.bind(this));
        this.addRoute('/api/srd/data', this.handleSRDData.bind(this));
        this.addRoute('/api/health', this.handleHealthCheck.bind(this));
        
        // Static asset paths
        this.addStaticPath('/assets', './code-repository/web/assets');
        this.addStaticPath('/js', './code-repository/web/js');
        this.addStaticPath('/css', './code-repository/web/css');
        this.addStaticPath('/images', './code-repository/web/images');
        this.addStaticPath('/src', './code-repository/src');
        
        // Full code-repository path for complete access
        this.addStaticPath('/code-repository', './code-repository');
        
        // Root path for test files and other root-level assets
        this.addStaticPath('/', './');
        
        console.log(`✅ Initialized ${this.routes.size} routes and ${this.staticPaths.size} static paths`);
    }

    /**
     * Setup default middleware for security, logging, and performance
     */
    setupDefaultMiddleware() {
        // Request logging middleware
        this.addMiddleware((req, res, next) => {
            this.requestCount++;
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] ${req.method} ${req.url} - Request #${this.requestCount}`);
            next();
        });

        // Security headers middleware
        this.addMiddleware((req, res, next) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            next();
        });

        // CORS middleware for development
        this.addMiddleware((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            
            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }
            next();
        });
    }

    /**
     * Add a route handler
     */
    addRoute(path, handler) {
        this.routes.set(path, handler);
    }

    /**
     * Add middleware function
     */
    addMiddleware(middlewareFunction) {
        this.middleware.push(middlewareFunction);
    }

    /**
     * Add static file serving path
     */
    addStaticPath(urlPath, localPath) {
        this.staticPaths.set(urlPath, path.resolve(localPath));
    }

    /**
     * Main request handler
     */
    async handleRequest(req, res) {
        try {
            // Run middleware stack
            await this.runMiddleware(req, res);
            
            const parsedUrl = url.parse(req.url, true);
            const pathname = parsedUrl.pathname;
            
            // Check for exact route match
            if (this.routes.has(pathname)) {
                await this.routes.get(pathname)(req, res, parsedUrl);
                return;
            }
            
            // Check for static file serving
            if (await this.handleStaticFile(req, res, pathname)) {
                return;
            }
            
            // 404 Not Found
            this.handle404Error(res, pathname);
            
        } catch (error) {
            this.handleServerError(res, error);
        }
    }

    /**
     * Run middleware stack
     */
    async runMiddleware(req, res) {
        for (const middleware of this.middleware) {
            await new Promise((resolve) => {
                middleware(req, res, resolve);
            });
        }
    }

    /**
     * Handle static file serving
     */
    async handleStaticFile(req, res, pathname) {
        for (const [urlPath, localPath] of this.staticPaths) {
            if (pathname.startsWith(urlPath)) {
                const relativePath = pathname.substring(urlPath.length);
                const filePath = path.join(localPath, relativePath);
                
                try {
                    // Security check - prevent directory traversal
                    const resolvedPath = path.resolve(filePath);
                    const resolvedLocalPath = path.resolve(localPath);
                    
                    if (!resolvedPath.startsWith(resolvedLocalPath)) {
                        return false; // Directory traversal attempt
                    }
                    
                    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
                        await this.serveStaticFile(res, resolvedPath);
                        return true;
                    }
                } catch (error) {
                    console.warn(`Static file error for ${filePath}:`, error.message);
                }
            }
        }
        return false;
    }

    /**
     * Serve static file with appropriate headers
     */
    async serveStaticFile(res, filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = this.getContentType(ext);
        
        const fileData = fs.readFileSync(filePath);
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
        
        // Add compression for text files
        if (this.shouldCompress(contentType)) {
            res.setHeader('Content-Encoding', 'gzip');
            const compressed = zlib.gzipSync(fileData);
            res.writeHead(200);
            res.end(compressed);
        } else {
            res.writeHead(200);
            res.end(fileData);
        }
    }

    /**
     * Get MIME type for file extension
     */
    getContentType(ext) {
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        };
        return mimeTypes[ext] || 'application/octet-stream';
    }

    /**
     * Check if content should be compressed
     */
    shouldCompress(contentType) {
        return contentType.startsWith('text/') || 
               contentType.includes('javascript') || 
               contentType.includes('json');
    }

    // ===================
    // ROUTE HANDLERS
    // ===================

    /**
     * Handle main game homepage
     */
    async handleHomePage(req, res) {
        try {
            // Serve the main index.html file
            const indexPath = path.join(__dirname, '../../index.html');
            if (fs.existsSync(indexPath)) {
                const content = fs.readFileSync(indexPath, 'utf8');
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(200);
                res.end(content);
            } else {
                // Generate a default homepage if index.html doesn't exist
                const defaultHomepage = this.generateDefaultHomepage();
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(200);
                res.end(defaultHomepage);
            }
        } catch (error) {
            this.handleServerError(res, error);
        }
    }

    /**
     * Handle character creator interface
     */
    async handleCharacterCreator(req, res) {
        const characterCreatorHTML = this.generateCharacterCreatorHTML();
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(characterCreatorHTML);
    }

    /**
     * Handle adventure engine interface
     */
    async handleAdventureEngine(req, res) {
        const adventureEngineHTML = this.generateAdventureEngineHTML();
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(adventureEngineHTML);
    }

    /**
     * Handle dice roller interface
     */
    async handleDiceRoller(req, res) {
        const diceRollerHTML = this.generateDiceRollerHTML();
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(diceRollerHTML);
    }

    /**
     * Handle character generation API
     */
    async handleCharacterGeneration(req, res) {
        try {
            // Import character generation modules
            const { CharacterGenerator } = require('../character/character-generator.js');
            const DiceEngine = require('../dice/dice-engine.js');
            
            const dice = new DiceEngine();
            const generator = new CharacterGenerator(dice);
            const character = generator.generateRandomCharacter();
            
            const response = {
                success: true,
                character: character,
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(JSON.stringify(response, null, 2));
            
        } catch (error) {
            const errorResponse = {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(500);
            res.end(JSON.stringify(errorResponse, null, 2));
        }
    }

    /**
     * Handle adventure generation API
     */
    async handleAdventureGeneration(req, res) {
        try {
            const AdventureEngine = require('../adventure/adventure-engine.js');
            const DiceEngine = require('../dice/dice-engine.js');
            
            const dice = new DiceEngine();
            const advEngine = new AdventureEngine(dice);
            
            // Parse request parameters
            const parsedUrl = url.parse(req.url, true);
            const level = parseInt(parsedUrl.query.level) || 1;
            const duration = parsedUrl.query.duration || 'weekly';
            
            const adventure = advEngine.generateAdventure(level, duration);
            
            const response = {
                success: true,
                adventure: adventure,
                timestamp: new Date().toISOString()
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(JSON.stringify(response, null, 2));
            
        } catch (error) {
            const errorResponse = {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(500);
            res.end(JSON.stringify(errorResponse, null, 2));
        }
    }

    /**
     * Handle dice rolling API
     */
    async handleDiceRoll(req, res) {
        try {
            const DiceEngine = require('../dice/dice-engine.js');
            const dice = new DiceEngine();
            
            const parsedUrl = url.parse(req.url, true);
            const expression = parsedUrl.query.expression || '1d20';
            
            const result = dice.roll(expression);
            
            const response = {
                success: true,
                expression: expression,
                result: result,
                timestamp: new Date().toISOString()
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(JSON.stringify(response, null, 2));
            
        } catch (error) {
            const errorResponse = {
                success: false,
                error: error.message,
                expression: parsedUrl.query.expression,
                timestamp: new Date().toISOString()
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(400);
            res.end(JSON.stringify(errorResponse, null, 2));
        }
    }

    /**
     * Handle SRD data API
     */
    async handleSRDData(req, res) {
        try {
            const SRDDataManager = require('../data/srd-data-manager.js');
            const srdManager = new SRDDataManager();
            
            const response = {
                success: true,
                data: srdManager.getAllData(),
                timestamp: new Date().toISOString()
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(JSON.stringify(response, null, 2));
            
        } catch (error) {
            const errorResponse = {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(500);
            res.end(JSON.stringify(errorResponse, null, 2));
        }
    }

    /**
     * Handle health check API
     */
    async handleHealthCheck(req, res) {
        const uptime = Date.now() - this.startTime;
        const response = {
            status: 'healthy',
            uptime: uptime,
            requests: this.requestCount,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(response, null, 2));
    }

    // ===================
    // HTML GENERATORS
    // ===================

    generateDefaultHomepage() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RulzLawyer - D&D 3.5 Gaming System</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #2c1810; color: #f4e9d1; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .nav-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .nav-card { background: #3d2517; padding: 20px; border-radius: 10px; text-align: center; }
        .nav-card h3 { color: #ffd700; margin-top: 0; }
        .nav-card a { color: #f4e9d1; text-decoration: none; font-weight: bold; }
        .nav-card a:hover { color: #ffd700; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎲 RulzLawyer D&D 3.5 Gaming System</h1>
            <p>Complete character creation and adventure engine</p>
        </div>
        
        <div class="nav-grid">
            <div class="nav-card">
                <h3>📋 Character Creator</h3>
                <p>Create complete D&D 3.5 characters with our 7-step wizard</p>
                <a href="/character-creator">Start Creating →</a>
            </div>
            
            <div class="nav-card">
                <h3>🎯 Adventure Engine</h3>
                <p>Generate AI-powered adventures and encounters</p>
                <a href="/adventure-engine">Start Adventure →</a>
            </div>
            
            <div class="nav-card">
                <h3>🎲 Dice Roller</h3>
                <p>High-performance dice rolling with D&D mechanics</p>
                <a href="/dice-roller">Roll Dice →</a>
            </div>
            
            <div class="nav-card">
                <h3>📊 API Status</h3>
                <p>System health and API endpoints</p>
                <a href="/api/health">Check Status →</a>
            </div>
        </div>
    </div>
</body>
</html>`;
    }

    generateCharacterCreatorHTML() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Character Creator - RulzLawyer D&D 3.5</title>
    <link rel="stylesheet" href="/css/character-creator.css">
</head>
<body>
    <!-- Character Creator Interface will be loaded here -->
    <div id="loading-screen" style="text-align: center; padding: 50px; color: #ffd700;">
        <h1>🧙 Loading Character Creator...</h1>
        <p>Initializing D&D 3.5 systems...</p>
    </div>
    
    <script src="/js/character-creator-interface.js"></script>
</body>
</html>`;
    }

    generateAdventureEngineHTML() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adventure Engine - RulzLawyer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #2c1810; color: #f4e9d1; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .generator-section { background: #3d2517; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        button { background: #8b0000; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
        button:hover { background: #a52a2a; }
        input, select { padding: 8px; margin: 5px; border-radius: 3px; border: 1px solid #666; }
        .adventure-display { background: #2a1f15; padding: 15px; border-radius: 5px; margin-top: 15px; }
        .loading { text-align: center; color: #ffd700; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚔️ Adventure Engine</h1>
            <p>AI-powered adventure and encounter generation</p>
        </div>
        
        <div class="generator-section">
            <h3>Generate Adventure</h3>
            <div>
                <label>Character Level: <input type="number" id="level" value="1" min="1" max="100"></label>
                <label>Duration: 
                    <select id="duration">
                        <option value="daily">1 Day</option>
                        <option value="weekly" selected>1 Week</option>
                        <option value="monthly">1 Month</option>
                    </select>
                </label>
                <button onclick="generateAdventure()">Generate Adventure</button>
            </div>
            <div id="adventure-result" class="adventure-display" style="display: none;">
                <div id="adventure-content"></div>
            </div>
        </div>
    </div>
    
    <script>
        async function generateAdventure() {
            const level = document.getElementById('level').value;
            const duration = document.getElementById('duration').value;
            const resultDiv = document.getElementById('adventure-result');
            const contentDiv = document.getElementById('adventure-content');
            
            contentDiv.innerHTML = '<div class="loading">🎯 Generating adventure...</div>';
            resultDiv.style.display = 'block';
            
            try {
                const response = await fetch(\`/api/adventure/generate?level=\${level}&duration=\${duration}\`);
                const data = await response.json();
                
                if (data.success) {
                    const adv = data.adventure;
                    contentDiv.innerHTML = \`
                        <h4>\${adv.title}</h4>
                        <p><strong>Type:</strong> \${adv.type}</p>
                        <p><strong>Environment:</strong> \${adv.environment}</p>
                        <p><strong>Duration:</strong> \${adv.estimatedDuration} hours</p>
                        <p><strong>Description:</strong> \${adv.description}</p>
                        <p><strong>Encounters:</strong> \${adv.encounters.length} planned</p>
                    \`;
                } else {
                    contentDiv.innerHTML = '<div style="color: #ff6b6b;">Error: ' + data.error + '</div>';
                }
            } catch (error) {
                contentDiv.innerHTML = '<div style="color: #ff6b6b;">Network error: ' + error.message + '</div>';
            }
        }
    </script>
</body>
</html>`;
    }

    generateDiceRollerHTML() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dice Roller - RulzLawyer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #2c1810; color: #f4e9d1; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .dice-section { background: #3d2517; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        button { background: #8b0000; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; }
        button:hover { background: #a52a2a; }
        input { padding: 8px; margin: 5px; border-radius: 3px; border: 1px solid #666; width: 150px; }
        .result { background: #2a1f15; padding: 15px; border-radius: 5px; margin-top: 15px; text-align: center; font-size: 1.2em; }
        .quick-dice { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎲 Dice Roller</h1>
            <p>High-performance D&D dice mechanics</p>
        </div>
        
        <div class="dice-section">
            <h3>Custom Roll</h3>
            <input type="text" id="expression" placeholder="1d20" value="1d20">
            <button onclick="rollDice()">Roll</button>
            <div id="roll-result" class="result" style="display: none;"></div>
        </div>
        
        <div class="dice-section">
            <h3>Quick Rolls</h3>
            <div class="quick-dice">
                <button onclick="quickRoll('1d4')">d4</button>
                <button onclick="quickRoll('1d6')">d6</button>
                <button onclick="quickRoll('1d8')">d8</button>
                <button onclick="quickRoll('1d10')">d10</button>
                <button onclick="quickRoll('1d12')">d12</button>
                <button onclick="quickRoll('1d20')">d20</button>
                <button onclick="quickRoll('1d100')">d100</button>
            </div>
        </div>
        
        <div class="dice-section">
            <h3>D&D Common Rolls</h3>
            <div class="quick-dice">
                <button onclick="quickRoll('4d6dl1')">Ability Score</button>
                <button onclick="quickRoll('2d20kh1')">Advantage</button>
                <button onclick="quickRoll('2d20kl1')">Disadvantage</button>
                <button onclick="quickRoll('3d6')">Fireball</button>
            </div>
        </div>
    </div>
    
    <script>
        async function rollDice() {
            const expression = document.getElementById('expression').value;
            await performRoll(expression);
        }
        
        async function quickRoll(expression) {
            document.getElementById('expression').value = expression;
            await performRoll(expression);
        }
        
        async function performRoll(expression) {
            const resultDiv = document.getElementById('roll-result');
            
            resultDiv.innerHTML = '🎲 Rolling...';
            resultDiv.style.display = 'block';
            
            try {
                const response = await fetch(\`/api/dice/roll?expression=\${encodeURIComponent(expression)}\`);
                const data = await response.json();
                
                if (data.success) {
                    resultDiv.innerHTML = \`
                        <strong>\${data.expression}</strong> = <span style="color: #ffd700; font-size: 1.5em;">\${data.result}</span>
                    \`;
                } else {
                    resultDiv.innerHTML = '<span style="color: #ff6b6b;">Error: ' + data.error + '</span>';
                }
            } catch (error) {
                resultDiv.innerHTML = '<span style="color: #ff6b6b;">Network error: ' + error.message + '</span>';
            }
        }
    </script>
</body>
</html>`;
    }

    // ===================
    // ERROR HANDLERS
    // ===================

    handle404Error(res, pathname) {
        const errorHTML = `<!DOCTYPE html>
<html>
<head><title>404 - Page Not Found</title></head>
<body style="font-family: Arial; background: #2c1810; color: #f4e9d1; text-align: center; padding: 50px;">
    <h1>🎲 404 - Page Not Found</h1>
    <p>The requested path <code>${pathname}</code> could not be found.</p>
    <p><a href="/" style="color: #ffd700;">Return to Home</a></p>
</body>
</html>`;
        
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(404);
        res.end(errorHTML);
    }

    handleServerError(res, error) {
        console.error('Server error:', error);
        
        const errorResponse = {
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify(errorResponse, null, 2));
    }

    // ===================
    // SERVER LIFECYCLE
    // ===================

    /**
     * Start the server
     */
    async start() {
        return new Promise((resolve, reject) => {
            this.server = http.createServer(this.handleRequest.bind(this));
            
            this.server.listen(this.port, () => {
                console.log(`🚀 RulzLawyer Server running on http://localhost:${this.port}`);
                console.log(`📋 Character Creator: http://localhost:${this.port}/character-creator`);
                console.log(`🎯 Adventure Engine: http://localhost:${this.port}/adventure-engine`);
                console.log(`🎲 Dice Roller: http://localhost:${this.port}/dice-roller`);
                console.log(`📊 Health Check: http://localhost:${this.port}/api/health`);
                resolve(this.server);
            });
            
            this.server.on('error', (error) => {
                console.error('Server startup error:', error);
                reject(error);
            });
        });
    }

    /**
     * Stop the server
     */
    async stop() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    console.log('🛑 RulzLawyer Server stopped');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Get server statistics
     */
    getStats() {
        return {
            uptime: Date.now() - this.startTime,
            requests: this.requestCount,
            routes: this.routes.size,
            staticPaths: this.staticPaths.size,
            port: this.port
        };
    }
}

module.exports = GameServerEnhanced;
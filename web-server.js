/**
 * RulzLawyer Web Server - Express.js Development Server
 * Provides web interface and API endpoints for the D&D 3.5 system
 * 
 * Features:
 * - Static file serving for web interface
 * - API endpoints for game system integration
 * - WebSocket support for real-time updates
 * - Development and production mode support
 * - CORS and security middleware
 * - Health monitoring and system status
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { Server } = require('socket.io');
const debug = require('debug');

// Initialize debug namespace
const log = debug('rulzlawyer:webserver');

class RulzLawyerWebServer {
    constructor(options = {}) {
        this.config = {
            port: options.port || process.env.PORT || 3000,
            host: options.host || 'localhost',
            environment: process.env.NODE_ENV || 'development',
            webRoot: path.join(__dirname, 'web'),
            enableCORS: options.cors !== false,
            enableCompression: options.compression !== false,
            enableLogging: options.logging !== false,
            ...options
        };
        
        // Initialize Express app
        this.app = express();
        this.server = null;
        this.io = null;
        
        // System status
        this.status = {
            mode: process.env.RULZLAWYER_MODE || 'full',
            version: process.env.RULZLAWYER_VERSION || '2.0.0',
            uptime: Date.now(),
            activeConnections: 0,
            totalRequests: 0
        };
        
        // Connected game systems
        this.gameSystems = new Map();
        
        log('RulzLawyer Web Server initialized');
    }

    /**
     * Initialize the web server
     */
    async initialize() {
        log('Initializing web server...');
        
        try {
            this.setupMiddleware();
            this.setupRoutes();
            this.setupWebSocket();
            this.setupErrorHandling();
            
            // Create HTTP server
            this.server = http.createServer(this.app);
            
            // Initialize Socket.IO
            this.io = new Server(this.server, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"]
                }
            });
            
            this.setupSocketHandlers();
            
            log('Web server components initialized');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize web server:', error);
            throw error;
        }
    }

    /**
     * Setup Express middleware
     */
    setupMiddleware() {
        // Security middleware
        if (this.config.environment === 'production') {
            this.app.use(helmet());
        }
        
        // CORS middleware
        if (this.config.enableCORS) {
            this.app.use(cors({
                origin: this.config.environment === 'production' ? false : true,
                credentials: true
            }));
        }
        
        // Compression middleware
        if (this.config.enableCompression) {
            this.app.use(compression());
        }
        
        // Logging middleware
        if (this.config.enableLogging) {
            this.app.use(morgan(this.config.environment === 'production' ? 'combined' : 'dev'));
        }
        
        // Body parsing middleware
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        
        // Request counter middleware
        this.app.use((req, res, next) => {
            this.status.totalRequests++;
            next();
        });
        
        // Static file serving
        this.app.use(express.static(this.config.webRoot));
        
        log('Middleware configured');
    }

    /**
     * Setup API routes
     */
    setupRoutes() {
        // API Status endpoint
        this.app.get('/api/status', (req, res) => {
            res.json({
                ...this.status,
                uptime: Date.now() - this.status.uptime,
                timestamp: new Date().toISOString()
            });
        });
        
        // Launch game system endpoint
        this.app.post('/launch', async (req, res) => {
            try {
                const { mode = 'full', debug = false } = req.query;
                
                log(`Launch request for mode: ${mode}, debug: ${debug}`);
                
                // Here we would integrate with the actual game launcher
                // For now, simulate a successful launch
                
                res.json({
                    success: true,
                    mode: mode,
                    debug: debug === 'true',
                    message: `${mode} mode launched successfully`,
                    timestamp: new Date().toISOString()
                });
                
                // Emit status update to connected clients
                this.io.emit('system-status', {
                    type: 'launched',
                    mode: mode,
                    debug: debug === 'true'
                });
                
            } catch (error) {
                log('Launch error:', error);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });
        
        // Run tests endpoint
        this.app.post('/api/test', async (req, res) => {
            try {
                log('Test execution request received');
                
                // Simulate test execution
                const testResults = {
                    success: true,
                    total: 25,
                    passed: 23,
                    failed: 2,
                    duration: '45.2s',
                    timestamp: new Date().toISOString()
                };
                
                res.json(testResults);
                
                // Emit test results to connected clients
                this.io.emit('test-results', testResults);
                
            } catch (error) {
                log('Test execution error:', error);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });
        
        // Character creation endpoint
        this.app.post('/api/character/create', async (req, res) => {
            try {
                const characterData = req.body;
                log('Character creation request:', characterData.name);
                
                // Here we would integrate with the character creation system
                res.json({
                    success: true,
                    character: {
                        id: Date.now().toString(),
                        ...characterData,
                        created: new Date().toISOString()
                    }
                });
                
            } catch (error) {
                log('Character creation error:', error);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });
        
        // System health check
        this.app.get('/api/health', (req, res) => {
            const health = {
                status: 'healthy',
                uptime: Date.now() - this.status.uptime,
                mode: this.status.mode,
                version: this.status.version,
                memory: process.memoryUsage(),
                cpu: process.cpuUsage(),
                connections: this.status.activeConnections,
                requests: this.status.totalRequests
            };
            
            res.json(health);
        });
        
        // Fallback to index.html for SPA routing
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(this.config.webRoot, 'index.html'));
        });
        
        log('Routes configured');
    }

    /**
     * Setup WebSocket functionality
     */
    setupWebSocket() {
        // WebSocket is initialized in the initialize() method
        log('WebSocket setup prepared');
    }

    /**
     * Setup Socket.IO event handlers
     */
    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            this.status.activeConnections++;
            log(`Client connected: ${socket.id}`);
            
            // Send welcome message with system status
            socket.emit('system-status', {
                type: 'connected',
                mode: this.status.mode,
                version: this.status.version
            });
            
            // Handle character data requests
            socket.on('character-request', (data) => {
                log('Character data requested:', data);
                // Integrate with character system
                socket.emit('character-response', {
                    success: true,
                    data: data
                });
            });
            
            // Handle spell system requests
            socket.on('spell-request', (data) => {
                log('Spell data requested:', data);
                // Integrate with spell system
                socket.emit('spell-response', {
                    success: true,
                    data: data
                });
            });
            
            // Handle combat requests
            socket.on('combat-action', (data) => {
                log('Combat action:', data);
                // Integrate with combat system
                this.io.emit('combat-update', {
                    type: 'action',
                    data: data,
                    timestamp: new Date().toISOString()
                });
            });
            
            // Handle disconnection
            socket.on('disconnect', () => {
                this.status.activeConnections--;
                log(`Client disconnected: ${socket.id}`);
            });
        });
        
        log('Socket.IO handlers configured');
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                error: 'Not Found',
                message: `Cannot ${req.method} ${req.url}`,
                timestamp: new Date().toISOString()
            });
        });
        
        // Error handler
        this.app.use((error, req, res, next) => {
            log('Server error:', error);
            
            res.status(error.status || 500).json({
                error: error.name || 'Internal Server Error',
                message: this.config.environment === 'development' ? error.message : 'Something went wrong',
                timestamp: new Date().toISOString()
            });
        });
        
        log('Error handling configured');
    }

    /**
     * Start the web server
     */
    async start() {
        return new Promise((resolve, reject) => {
            try {
                this.server.listen(this.config.port, this.config.host, () => {
                    console.log(`🌐 RulzLawyer Web Server running on http://${this.config.host}:${this.config.port}`);
                    console.log(`📝 Environment: ${this.config.environment}`);
                    console.log(`🎯 Mode: ${this.status.mode}`);
                    console.log(`🔗 WebSocket enabled for real-time updates`);
                    console.log(`📁 Serving static files from: ${this.config.webRoot}`);
                    
                    log('Web server started successfully');
                    resolve();
                });
                
                this.server.on('error', (error) => {
                    console.error('❌ Web server error:', error);
                    reject(error);
                });
                
            } catch (error) {
                console.error('❌ Failed to start web server:', error);
                reject(error);
            }
        });
    }

    /**
     * Stop the web server
     */
    async stop() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    console.log('🛑 RulzLawyer Web Server stopped');
                    log('Web server stopped');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Register a game system for integration
     */
    registerGameSystem(name, system) {
        this.gameSystems.set(name, system);
        log(`Game system registered: ${name}`);
    }

    /**
     * Get system statistics
     */
    getStats() {
        return {
            ...this.status,
            uptime: Date.now() - this.status.uptime,
            registeredSystems: Array.from(this.gameSystems.keys())
        };
    }
}

// Export for both standalone use and module import
module.exports = RulzLawyerWebServer;

// If run directly, start the server
if (require.main === module) {
    const webServer = new RulzLawyerWebServer();
    
    async function startServer() {
        try {
            await webServer.initialize();
            await webServer.start();
            
            // Graceful shutdown
            process.on('SIGINT', async () => {
                console.log('\n🛑 Received SIGINT, shutting down gracefully...');
                await webServer.stop();
                process.exit(0);
            });
            
            process.on('SIGTERM', async () => {
                console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
                await webServer.stop();
                process.exit(0);
            });
            
        } catch (error) {
            console.error('❌ Failed to start web server:', error);
            process.exit(1);
        }
    }
    
    startServer();
}
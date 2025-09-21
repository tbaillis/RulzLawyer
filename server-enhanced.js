/**
 * RulzLawyer Enhanced HTTP Server
 * 
 * A professional-grade HTTP server for the D&D 3.5 Character Creator and Adventure Engine.
 * Features include static file serving, CORS support, error handling, logging, and development tools.
 * 
 * Requirements Traceability:
 * - REQ-001: Web-based D&D 3.5 character creation tool
 * - US-001: Character creation core user story
 * - TS-001: Technical architecture specification
 * 
 * @version 1.0
 * @created September 21, 2025
 * @location server-enhanced.js
 */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { URL } = require('url');

class RulzLawyerServer {
  constructor(port = 3000, hostname = 'localhost') {
    this.port = port;
    this.hostname = hostname;
    this.server = null;
    this.mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg'
    };
    this.corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    };
    this.startTime = Date.now();
  }

  /**
   * Initialize and start the server
   */
  async start() {
    try {
      // Port cleanup - ensure port 3000 is available
      await this.cleanupPort();
      
      // Create HTTP server
      this.server = http.createServer((req, res) => this.handleRequest(req, res));
      
      // Start listening
      return new Promise((resolve, reject) => {
        this.server.listen(this.port, this.hostname, (err) => {
          if (err) {
            this.logError(`Server failed to start: ${err.message}`);
            reject(err);
          } else {
            this.logSuccess(`🚀 RulzLawyer Server running at http://${this.hostname}:${this.port}/`);
            this.logInfo('📋 Available endpoints:');
            this.logInfo('   • http://localhost:3000/ - Main application');
            this.logInfo('   • http://localhost:3000/character-creator - Character creation wizard');
            this.logInfo('   • http://localhost:3000/adventure-engine - Adventure generation');
            this.logInfo('   • http://localhost:3000/health - Server health check');
            resolve();
          }
        });
      });
    } catch (error) {
      this.logError(`Failed to start server: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle incoming HTTP requests
   */
  async handleRequest(req, res) {
    const startTime = Date.now();
    const { method, url } = req;
    
    try {
      // Add CORS headers
      this.addCorsHeaders(res);
      
      // Handle OPTIONS requests for CORS preflight
      if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }
      
      // Parse URL
      const parsedUrl = new URL(url, `http://${req.headers.host}`);
      const pathname = parsedUrl.pathname;
      
      // Log request
      this.logRequest(method, pathname, req.headers['user-agent']);
      
      // Route requests
      if (pathname === '/health') {
        await this.handleHealthCheck(res);
      } else if (pathname === '/api/system-info') {
        await this.handleSystemInfo(res);
      } else {
        await this.handleStaticFile(pathname, res);
      }
      
      // Log response time
      const responseTime = Date.now() - startTime;
      this.logInfo(`✅ ${method} ${pathname} - ${responseTime}ms`);
      
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handle static file serving
   */
  async handleStaticFile(pathname, res) {
    try {
      // Default to index.html for root requests
      let filePath = pathname === '/' ? '/index.html' : pathname;
      
      // Security: prevent directory traversal
      filePath = path.normalize(filePath);
      if (filePath.includes('..')) {
        this.send404(res, 'Path traversal not allowed');
        return;
      }
      
      // Construct absolute file path
      const fullPath = path.join(process.cwd(), filePath);
      
      // Check if file exists and serve it
      try {
        const stats = await fs.stat(fullPath);
        if (!stats.isFile()) {
          this.send404(res, 'Not a file');
          return;
        }

        // Determine MIME type
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = this.mimeTypes[ext] || 'application/octet-stream';

        // Read and serve file
        const content = await fs.readFile(fullPath);

        res.writeHead(200, {
          'Content-Type': mimeType,
          'Content-Length': content.length,
          'Cache-Control': 'public, max-age=3600',
          'ETag': `"${stats.mtime.getTime()}-${stats.size}"`
        });

        res.end(content);
        
      } catch (error) {
        if (error.code === 'ENOENT') {
          this.send404(res, 'File not found');
        } else {
          this.logError(`Error serving static file ${pathname}: ${error.message}`);
          this.send500(res, 'Internal server error');
        }
        return;
      }
      
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handle health check endpoint
   */
  async handleHealthCheck(res) {
    const uptime = Date.now() - this.startTime;
    const healthData = {
      status: 'healthy',
      uptime: uptime,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      service: 'RulzLawyer D&D 3.5 Character Creator',
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    };
    
    this.sendJson(res, healthData);
  }

  /**
   * Handle system info endpoint
   */
  async handleSystemInfo(res) {
    const systemInfo = {
      server: 'RulzLawyer Enhanced Server',
      version: '1.0.0',
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      features: [
        'D&D 3.5 Character Creation',
        'Adventure Engine',
        'Dice Rolling System',
        'Character Sheets',
        'Random Tables',
        'SRD Compliance'
      ]
    };
    
    this.sendJson(res, systemInfo);
  }

  /**
   * Add CORS headers to response
   */
  addCorsHeaders(res) {
    Object.entries(this.corsHeaders).forEach(([header, value]) => {
      res.setHeader(header, value);
    });
  }

  /**
   * Send JSON response
   */
  sendJson(res, data, statusCode = 200) {
    const json = JSON.stringify(data, null, 2);
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(json)
    });
    res.end(json);
  }

  /**
   * Send 404 Not Found
   */
  send404(res, message = 'Not Found') {
    const errorPage = this.generateErrorPage(404, 'Not Found', message);
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'Content-Length': Buffer.byteLength(errorPage)
    });
    res.end(errorPage);
  }

  /**
   * Send 500 Internal Server Error
   */
  send500(res, message = 'Internal Server Error') {
    const errorPage = this.generateErrorPage(500, 'Internal Server Error', message);
    res.writeHead(500, {
      'Content-Type': 'text/html',
      'Content-Length': Buffer.byteLength(errorPage)
    });
    res.end(errorPage);
  }

  /**
   * Generate HTML error page
   */
  generateErrorPage(code, title, message) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${code} - ${title} | RulzLawyer</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: #fff;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .error-container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .error-code { font-size: 4rem; font-weight: bold; margin: 0; }
        .error-title { font-size: 1.5rem; margin: 1rem 0; }
        .error-message { margin: 1rem 0; opacity: 0.8; }
        .home-link { 
            display: inline-block; 
            margin-top: 1rem; 
            padding: 0.5rem 1rem; 
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            text-decoration: none;
            color: #fff;
            transition: background 0.3s;
        }
        .home-link:hover { background: rgba(255, 255, 255, 0.3); }
        .dice { font-size: 2rem; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="dice">🎲</div>
        <h1 class="error-code">${code}</h1>
        <h2 class="error-title">${title}</h2>
        <p class="error-message">${message}</p>
        <a href="/" class="home-link">⚔️ Return to RulzLawyer</a>
    </div>
</body>
</html>`;
  }

  /**
   * Handle errors
   */
  handleError(error, res) {
    this.logError(`Request error: ${error.message}`);
    this.send500(res, 'Something went wrong');
  }

  /**
   * Clean up port 3000 before starting
   */
  async cleanupPort() {
    if (process.platform === 'win32') {
      try {
        // Windows port cleanup - only check for LISTENING processes
        const { exec } = require('child_process');
        await new Promise((resolve, reject) => {
          exec('netstat -ano | findstr :3000 | findstr LISTENING', (error, stdout, stderr) => {
            if (stdout && stdout.trim()) {
              this.logWarning('⚠️  Port 3000 is actively in use, attempting cleanup...');
              // Extract PID and kill specific process
              const lines = stdout.trim().split('\n');
              const pids = lines.map(line => {
                const parts = line.trim().split(/\s+/);
                return parts[parts.length - 1];
              }).filter(pid => pid && pid !== '0');
              
              if (pids.length > 0) {
                exec(`taskkill /F /PID ${pids.join(' /PID ')}`, (killError) => {
                  if (killError) {
                    this.logWarning('Port cleanup completed (some processes may not have been killed)');
                  } else {
                    this.logSuccess('✅ Port cleanup successful');
                  }
                  resolve();
                });
              } else {
                resolve();
              }
            } else {
              resolve();
            }
          });
        });
      } catch (error) {
        this.logWarning(`Port cleanup warning: ${error.message}`);
      }
    }
    
    // Wait a moment for port to be freed
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          this.logInfo('🛑 Server shutdown complete');
          resolve();
        });
      });
    }
  }

  // Logging methods
  logSuccess(message) {
    console.log(`\x1b[32m✅ ${message}\x1b[0m`);
  }

  logInfo(message) {
    console.log(`\x1b[36mℹ️  ${message}\x1b[0m`);
  }

  logWarning(message) {
    console.log(`\x1b[33m⚠️  ${message}\x1b[0m`);
  }

  logError(message) {
    console.error(`\x1b[31m❌ ${message}\x1b[0m`);
  }

  logRequest(method, path, userAgent) {
    const timestamp = new Date().toISOString();
    console.log(`\x1b[90m[${timestamp}] ${method} ${path} - ${userAgent || 'Unknown'}\x1b[0m`);
  }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RulzLawyerServer;
}

// Auto-start if run directly
if (require.main === module) {
  const server = new RulzLawyerServer();
  
  // Handle shutdown gracefully
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutdown signal received...');
    await server.shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Terminate signal received...');
    await server.shutdown();
    process.exit(0);
  });

  // Start server
  server.start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
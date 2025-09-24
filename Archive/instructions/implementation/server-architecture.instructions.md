---
description: "Server architecture implementation guidance"
applyTo: "**/server/**,**/game-server/**,**/*server*"
---

# Server Architecture Implementation Guide

## Core Requirements
Build a Node.js HTTP server that serves the complete D&D 3.5 gaming system with proper routing, error handling, and static file serving.

## Server Structure
```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    handleRequest(req, res);
});

function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Route to appropriate handler with comprehensive logging
    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);
    
    try {
        // Implement all required routes
        routeRequest(pathname, res);
    } catch (error) {
        handleServerError(res, error);
    }
}
```

## Required Routes

### Homepage Route (`/`)
- Gaming system overview with navigation links
- Modern CSS with gradient backgrounds and card layouts
- Links to character creator, adventure engine, dice roller

### Character Creator Routes
- `/new-character-creator.html` - Main character creator interface
- `/character-creator.html` - Legacy redirect to new version
- Must serve complete HTML file with embedded JavaScript and CSS

### SRD Data Route
- `/code-repository/src/srd-data-manager.js` - SRD data module
- Content-Type: `application/javascript`
- Enable browser caching for performance

### Additional Gaming Routes
- `/adventure-engine.html` - Adventure generation system
- `/dice-roller.html` - Dice rolling interface
- Generate dynamic content with embedded functionality

## Error Handling

### 404 Error Handler
```javascript
function handle404Error(res, pathname) {
    const errorContent = generateStylized404Page(pathname);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(errorContent);
}
```
- Stylized error page with navigation back to main system
- List available endpoints for debugging
- Consistent branding and design

### 500 Error Handler
- Comprehensive error logging with stack traces
- User-friendly error page without exposing internals
- Graceful degradation with recovery suggestions

## File Serving Strategy

### Static File Types
```javascript
const contentTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
};
```

### Cache Headers
- Development: `Cache-Control: no-cache` for rapid iteration
- Production: Appropriate caching for static assets
- ETag support for conditional requests

## Security Considerations
```javascript
function setSecurityHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
}
```

## Server Lifecycle Management

### Startup Sequence
- Port cleanup: Kill existing Node.js processes
- Module verification: Check required files exist
- Graceful startup with comprehensive logging
- Health check endpoints

### Shutdown Handling
```javascript
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    server.close(() => {
        console.log('✓ Server closed');
        process.exit(0);
    });
});
```

## Development Workflow
```powershell
# Required pre-startup sequence
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
node game-server.js
```

## Integration Points
- Must serve complete character creator with SRD data dependency
- Support for all gaming modules (tables, portraits, spells)
- WebSocket support for future real-time features
- Session management for character persistence

## Performance Requirements
- Page load times <3 seconds
- Static asset compression
- Concurrent request handling
- Memory usage monitoring

## Testing Requirements
- Test all route handlers with valid/invalid requests
- Verify file serving for all content types
- Load testing for concurrent users
- Error condition testing (missing files, malformed requests)
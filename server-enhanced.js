/**
 * RulzLawyer Game Server Startup
 * Launches the production-ready server with all game systems
 */

const GameServerEnhanced = require('./code-repository/server/game-server-enhanced.js');

// Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('🎲 Starting RulzLawyer D&D 3.5 Gaming System...');
console.log(`📍 Environment: ${NODE_ENV}`);
console.log(`🌐 Port: ${PORT}`);

// Create and start server
const server = new GameServerEnhanced(PORT);

// Graceful shutdown handler
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await server.stop();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    await server.stop();
    process.exit(0);
});

// Start the server
server.start().catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});
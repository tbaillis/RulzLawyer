#!/usr/bin/env node

/**
 * RulzLawyer Game Server Launcher
 * Starts the enhanced server from the organized code repository
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🎲 Starting RulzLawyer D&D 3.5 Gaming System...');
console.log('📁 Server location: code-repository/server/server-enhanced.js');

// Launch the server from the organized location
const serverPath = path.join(__dirname, 'code-repository', 'server', 'server-enhanced.js');

const serverProcess = exec(`node "${serverPath}"`, (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Server startup error:', error);
        return;
    }
    if (stderr) {
        console.error('⚠️ Server stderr:', stderr);
    }
    console.log('📋 Server output:', stdout);
});

serverProcess.stdout.on('data', (data) => {
    console.log(data.toString());
});

serverProcess.stderr.on('data', (data) => {
    console.error(data.toString());
});

serverProcess.on('exit', (code) => {
    console.log(`🔚 Server process exited with code ${code}`);
});

console.log('✅ Server launcher started');
console.log('🌐 Once running, access at: http://localhost:3000');
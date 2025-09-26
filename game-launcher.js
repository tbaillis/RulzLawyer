#!/usr/bin/env node

/**
 * RulzLawyer D&D 3.5 System - Main Game Launcher
 * Complete D&D 3.5 Character Creator and Adventure Engine System
 * 
 * Features:
 * - Multi-mode launcher supporting different system components
 * - Development and production environment support
 * - Debug mode with Node.js inspector integration
 * - Web interface integration
 * - Comprehensive error handling and logging
 * - Command-line interface with help system
 * - Graceful shutdown handling
 * - System health monitoring
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { program } = require('commander');
const chalk = require('chalk');
const debug = require('debug');

// Initialize debug namespace
const log = debug('rulzlawyer:launcher');

class RulzLawyerGameLauncher {
    constructor() {
        this.version = '2.0.0';
        this.modes = {
            'full': {
                name: 'Complete Game System',
                description: 'Full RulzLawyer system with all components',
                script: 'code-repository/server/multi-user-server-architecture.js',
                port: 3000,
                features: ['server', 'character', 'combat', 'spells', 'epic', 'portrait', 'adventure', 'web']
            },
            'server': {
                name: 'Server Only',
                description: 'Multi-user server architecture only',
                script: 'code-repository/server/multi-user-server-architecture.js',
                port: 3000,
                features: ['server', 'websocket', 'multiplayer']
            },
            'character-creator': {
                name: 'Character Creator',
                description: 'Character creation and management system',
                script: 'code-repository/src/character/character-creation-wizard.js',
                port: 3001,
                features: ['character', 'creation', 'sheets']
            },
            'combat': {
                name: 'Combat System',
                description: 'Tactical combat and encounter management',
                script: 'code-repository/src/combat/tactical-combat-system.js',
                port: 3002,
                features: ['combat', 'tactics', 'encounters']
            },
            'spells': {
                name: 'Spell System',
                description: 'Advanced spell management and casting',
                script: 'code-repository/src/spells/advanced-spell-manager.js',
                port: 3003,
                features: ['spells', 'magic', 'casting']
            },
            'epic': {
                name: 'Epic Level System',
                description: 'Epic progression and divine ascension',
                script: 'code-repository/src/epic/epic-level-manager.js',
                port: 3004,
                features: ['epic', 'divine', 'ascension']
            },
            'portrait': {
                name: 'AI Portrait Generator',
                description: 'Character portrait generation system',
                script: 'code-repository/src/portrait/character-portrait-generator.js',
                port: 3005,
                features: ['portraits', 'ai', 'graphics']
            },
            'adventure': {
                name: 'Adventure Engine',
                description: 'Dynamic storytelling and adventure management',
                script: 'code-repository/src/story/narrative-adventure-system.js',
                port: 3006,
                features: ['adventure', 'storytelling', 'narrative']
            },
            'test': {
                name: 'Integration Tests',
                description: 'Complete system integration testing',
                script: 'code-repository/examples/complete-system-integration-demo.js',
                port: null,
                features: ['testing', 'integration', 'validation']
            }
        };
        
        this.currentProcess = null;
        this.isShuttingDown = false;
        
        // Bind shutdown handlers
        this.setupShutdownHandlers();
        
        log('RulzLawyer Game Launcher initialized');
    }

    /**
     * Initialize the command-line interface
     */
    initializeCLI() {
        program
            .name('rulzlawyer')
            .description('RulzLawyer D&D 3.5 System - Epic Level Adventure Engine')
            .version(this.version)
            .option('-m, --mode <mode>', 'game mode to start', 'full')
            .option('-d, --debug [level]', 'enable debug mode', false)
            .option('-p, --port <port>', 'specify port number')
            .option('-w, --web', 'enable web interface', false)
            .option('-e, --env <environment>', 'set environment (development/production)', 'development')
            .option('--list-modes', 'list available game modes')
            .option('--health-check', 'perform system health check')
            .option('--install-deps', 'install Node.js dependencies')
            .helpOption('-h, --help', 'display help for command');

        program.parse();
        
        const options = program.opts();
        
        // Handle special commands
        if (options.listModes) {
            this.displayAvailableModes();
            process.exit(0);
        }
        
        if (options.healthCheck) {
            this.performHealthCheck();
            process.exit(0);
        }
        
        if (options.installDeps) {
            this.installDependencies();
            return;
        }
        
        return options;
    }

    /**
     * Display startup banner
     */
    displayBanner() {
        console.log();
        console.log(chalk.cyan('🎮 RulzLawyer D&D 3.5 System'));
        console.log(chalk.magenta('⚔️  Epic Level Adventure Engine'));
        console.log(chalk.green('🎭 AI Portraits | 🗡️ Tactical Combat | ✨ 400+ Spells | 🏛️ Divine Ascension'));
        console.log(chalk.gray('='.repeat(80)));
        console.log();
    }

    /**
     * Display available game modes
     */
    displayAvailableModes() {
        console.log();
        console.log(chalk.cyan('🎮 Available Game Modes'));
        console.log(chalk.gray('='.repeat(30)));
        console.log();
        
        Object.entries(this.modes).forEach(([key, mode]) => {
            console.log(chalk.yellow(`  ${key.padEnd(18)} - ${mode.name}`));
            console.log(chalk.gray(`    ${mode.description}`));
            console.log(chalk.blue(`    Features: ${mode.features.join(', ')}`));
            if (mode.port) {
                console.log(chalk.gray(`    Default Port: ${mode.port}`));
            }
            console.log();
        });
    }

    /**
     * Perform system health check
     */
    async performHealthCheck() {
        console.log();
        console.log(chalk.cyan('🏥 RulzLawyer System Health Check'));
        console.log(chalk.gray('='.repeat(40)));
        console.log();
        
        let issues = 0;
        
        // Check Node.js version
        try {
            const nodeVersion = process.version;
            const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);
            
            if (majorVersion >= 16) {
                console.log(chalk.green(`✅ Node.js: ${nodeVersion} (OK)`));
            } else {
                console.log(chalk.red(`❌ Node.js: ${nodeVersion} (requires v16+)`));
                issues++;
            }
        } catch (error) {
            console.log(chalk.red('❌ Node.js: Version check failed'));
            issues++;
        }
        
        // Check npm
        try {
            const { execSync } = require('child_process');
            const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
            console.log(chalk.green(`✅ npm: v${npmVersion}`));
        } catch (error) {
            console.log(chalk.red('❌ npm: Not found or not working'));
            issues++;
        }
        
        // Check required files
        const requiredFiles = [
            'package.json',
            'code-repository/server/multi-user-server-architecture.js',
            'code-repository/src/character/character-sheet-renderer.js',
            'code-repository/src/spells/advanced-spell-manager.js',
            'code-repository/src/epic/epic-level-manager.js',
            'code-repository/src/portrait/character-portrait-generator.js'
        ];
        
        let missingFiles = 0;
        requiredFiles.forEach(file => {
            if (fs.existsSync(file)) {
                console.log(chalk.green(`✅ ${file}`));
            } else {
                console.log(chalk.red(`❌ ${file} (missing)`));
                missingFiles++;
                issues++;
            }
        });
        
        // Check node_modules
        if (fs.existsSync('node_modules')) {
            console.log(chalk.green('✅ Dependencies: Installed'));
        } else {
            console.log(chalk.yellow('⚠️  Dependencies: Not installed (run --install-deps)'));
            issues++;
        }
        
        // Summary
        console.log();
        if (issues === 0) {
            console.log(chalk.green('🎮 RulzLawyer is ready to launch! 🚀'));
        } else {
            console.log(chalk.yellow(`⚠️  ${issues} issue(s) detected. Please review the above.`));
        }
        console.log();
    }

    /**
     * Install Node.js dependencies
     */
    async installDependencies() {
        console.log(chalk.yellow('📦 Installing RulzLawyer dependencies...'));
        console.log();
        
        try {
            const { execSync } = require('child_process');
            execSync('npm install', { stdio: 'inherit' });
            console.log();
            console.log(chalk.green('✅ Dependencies installed successfully!'));
        } catch (error) {
            console.log();
            console.log(chalk.red('❌ Failed to install dependencies'));
            console.error(error.message);
            process.exit(1);
        }
    }

    /**
     * Validate launch parameters
     */
    validateLaunchParameters(options) {
        const { mode, port, env } = options;
        
        // Validate mode
        if (!this.modes[mode]) {
            console.error(chalk.red(`❌ Error: Unknown mode '${mode}'`));
            console.log(chalk.yellow('Available modes:'));
            Object.keys(this.modes).forEach(m => {
                console.log(chalk.gray(`  - ${m}`));
            });
            process.exit(1);
        }
        
        // Validate port
        if (port) {
            const portNum = parseInt(port);
            if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
                console.error(chalk.red(`❌ Error: Invalid port number '${port}'`));
                process.exit(1);
            }
        }
        
        // Validate environment
        if (!['development', 'production'].includes(env)) {
            console.error(chalk.red(`❌ Error: Invalid environment '${env}'`));
            console.log(chalk.yellow('Valid environments: development, production'));
            process.exit(1);
        }
        
        // Check if script exists
        const modeConfig = this.modes[mode];
        if (modeConfig.script && !fs.existsSync(modeConfig.script)) {
            console.error(chalk.red(`❌ Error: Script not found: ${modeConfig.script}`));
            console.log(chalk.yellow('Please ensure all system files are present'));
            process.exit(1);
        }
    }

    /**
     * Setup environment variables
     */
    setupEnvironment(options) {
        const { mode, port, debug, env, web } = options;
        const modeConfig = this.modes[mode];
        
        // Set environment
        process.env.NODE_ENV = env;
        
        // Set port
        const targetPort = port || modeConfig.port || 3000;
        process.env.PORT = targetPort.toString();
        
        // Set debug
        if (debug) {
            const debugLevel = debug === true ? 'rulzlawyer:*' : `rulzlawyer:${debug}`;
            process.env.DEBUG = debugLevel;
        }
        
        // Set web mode
        if (web) {
            process.env.WEB_ENABLED = 'true';
        }
        
        // Set mode-specific environment
        process.env.RULZLAWYER_MODE = mode;
        process.env.RULZLAWYER_VERSION = this.version;
        
        log(`Environment configured for ${mode} mode`);
    }

    /**
     * Launch the game system
     */
    async launchGame(options) {
        const { mode, debug, env } = options;
        const modeConfig = this.modes[mode];
        
        console.log(chalk.yellow(`🎯 Starting RulzLawyer in '${mode}' mode...`));
        console.log(chalk.gray(`📝 Environment: ${env}`));
        console.log(chalk.gray(`🔌 Port: ${process.env.PORT}`));
        
        if (debug) {
            console.log(chalk.gray('🐛 Debug: Enabled'));
        }
        
        console.log();
        
        // Prepare spawn arguments
        const nodeArgs = [];
        const scriptPath = modeConfig.script || 'index.js';
        
        // Add debug inspector for development
        if (debug && env === 'development') {
            nodeArgs.push('--inspect');
            console.log(chalk.cyan('🔍 Debug inspector enabled'));
        }
        
        // Add the script path
        nodeArgs.push(scriptPath);
        
        // For test mode, don't run as background process
        if (mode === 'test') {
            return this.runTestMode(nodeArgs);
        }
        
        // Spawn the Node.js process
        try {
            this.currentProcess = spawn('node', nodeArgs, {
                stdio: 'inherit',
                env: process.env
            });
            
            // Handle process events
            this.currentProcess.on('error', (error) => {
                console.error(chalk.red(`❌ Process error: ${error.message}`));
                process.exit(1);
            });
            
            this.currentProcess.on('exit', (code, signal) => {
                if (!this.isShuttingDown) {
                    if (code === 0) {
                        console.log(chalk.yellow('🎮 RulzLawyer system stopped normally'));
                    } else {
                        console.error(chalk.red(`❌ Process exited with code ${code}`));
                    }
                }
            });
            
            // Wait for process to start
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (this.currentProcess && !this.currentProcess.killed) {
                console.log(chalk.green(`✅ ${modeConfig.name} started successfully!`));
                
                if (process.env.PORT) {
                    console.log(chalk.cyan(`🌍 Server running on http://localhost:${process.env.PORT}`));
                }
                
                console.log(chalk.gray('Press Ctrl+C to stop the server'));
                console.log();
            }
            
        } catch (error) {
            console.error(chalk.red(`❌ Failed to start ${modeConfig.name}: ${error.message}`));
            process.exit(1);
        }
    }

    /**
     * Run test mode
     */
    async runTestMode(nodeArgs) {
        console.log(chalk.cyan('🧪 Running RulzLawyer Integration Tests...'));
        console.log();
        
        try {
            const testProcess = spawn('node', nodeArgs, {
                stdio: 'inherit',
                env: process.env
            });
            
            testProcess.on('error', (error) => {
                console.error(chalk.red(`❌ Test error: ${error.message}`));
                process.exit(1);
            });
            
            testProcess.on('exit', (code) => {
                if (code === 0) {
                    console.log();
                    console.log(chalk.green('✅ All tests passed!'));
                } else {
                    console.log();
                    console.log(chalk.red(`❌ Tests failed with code ${code}`));
                    process.exit(code);
                }
            });
            
        } catch (error) {
            console.error(chalk.red(`❌ Failed to run tests: ${error.message}`));
            process.exit(1);
        }
    }

    /**
     * Setup graceful shutdown handlers
     */
    setupShutdownHandlers() {
        const shutdown = (signal) => {
            if (this.isShuttingDown) return;
            
            this.isShuttingDown = true;
            console.log();
            console.log(chalk.yellow(`🛑 Received ${signal}, shutting down gracefully...`));
            
            if (this.currentProcess && !this.currentProcess.killed) {
                this.currentProcess.kill('SIGTERM');
                
                // Force kill after 10 seconds
                setTimeout(() => {
                    if (!this.currentProcess.killed) {
                        console.log(chalk.red('⚠️  Force killing process...'));
                        this.currentProcess.kill('SIGKILL');
                    }
                }, 10000);
            }
            
            setTimeout(() => {
                console.log(chalk.cyan('🎮 Thank you for playing! May your adventures be epic! ⚔️'));
                console.log();
                process.exit(0);
            }, 1000);
        };
        
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('uncaughtException', (error) => {
            console.error(chalk.red('❌ Uncaught Exception:'), error);
            shutdown('EXCEPTION');
        });
        process.on('unhandledRejection', (reason, promise) => {
            console.error(chalk.red('❌ Unhandled Rejection at:'), promise, 'reason:', reason);
            shutdown('REJECTION');
        });
    }

    /**
     * Main entry point
     */
    async run() {
        try {
            this.displayBanner();
            
            const options = this.initializeCLI();
            if (!options) return; // Special command was handled
            
            this.validateLaunchParameters(options);
            this.setupEnvironment(options);
            
            await this.launchGame(options);
            
        } catch (error) {
            console.error(chalk.red('❌ Fatal error:'), error.message);
            if (options.debug) {
                console.error(error.stack);
            }
            process.exit(1);
        }
    }
}

// Main execution
if (require.main === module) {
    const launcher = new RulzLawyerGameLauncher();
    launcher.run().catch(error => {
        console.error(chalk.red('❌ Launch failed:'), error.message);
        process.exit(1);
    });
}

module.exports = RulzLawyerGameLauncher;
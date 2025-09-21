/**
 * RulzLawyer Complete D&D 3.5 Gaming Application
 * Main application controller that initializes all game systems
 * 
 * Features:
 * - Complete D&D 3.5 SRD integration
 * - Character creation and management
 * - Spell system with full casting mechanics
 * - Equipment and inventory management
 * - Adventure generation with encounters
 * - Advanced dice rolling system
 * 
 * @version 2.0 
 * @date September 20, 2025
 * @location RulzLawyer/app.js
 */

class RulzLawyerGameEngine {
    constructor() {
        this.version = '2.0';
        this.diceEngine = null;
        this.characterManager = null;
        this.adventureEngine = null;
        this.spellManager = null;
        this.equipmentManager = null;
        this.storageManager = null;
        this.randomTablesIndex = null;
        
        console.log('🎲 RulzLawyer Game Engine starting up...');
        this.initializeEngine();
    }

    async initializeEngine() {
        try {
            console.log('⚙️ Initializing core systems...');
            
            // Initialize core systems in dependency order
            this.initializeDiceEngine();
            this.initializeSpellManager();
            this.initializeEquipmentManager();
            this.initializeCharacterManager();
            this.initializeAdventureEngine();
            this.initializeStorageManager();
            this.initializeRandomTables();
            
            // Perform system validation
            this.validateSystems();
            
            console.log('✅ All systems operational!');
            console.log(`🌟 RulzLawyer v${this.version} ready for adventure!`);
            
            // Set global reference for web interface
            window.gameEngine = this;
            
        } catch (error) {
            console.error('❌ Critical failure during engine initialization:', error);
            this.handleCriticalError(error);
        }
    }

    initializeDiceEngine() {
        console.log('🎲 Loading dice engine...');
        if (typeof DiceEngine !== 'undefined') {
            this.diceEngine = new DiceEngine();
            console.log('✅ Dice engine loaded successfully');
        } else {
            throw new Error('DiceEngine not available');
        }
    }

    initializeSpellManager() {
        console.log('✨ Loading spell management system...');
        if (typeof SpellManager !== 'undefined') {
            this.spellManager = new SpellManager();
            console.log(`✅ Spell manager loaded with ${Object.keys(this.spellManager.spellDatabase).length} spells`);
        } else {
            throw new Error('SpellManager not available');
        }
    }

    initializeEquipmentManager() {
        console.log('⚔️ Loading equipment management system...');
        if (typeof EquipmentManager !== 'undefined') {
            this.equipmentManager = new EquipmentManager();
            console.log('✅ Equipment manager loaded with complete item database');
        } else {
            throw new Error('EquipmentManager not available');
        }
    }

    initializeCharacterManager() {
        console.log('👤 Loading character management system...');
        if (typeof CharacterManager !== 'undefined') {
            this.characterManager = new CharacterManager();
            
            // Inject dependencies properly
            this.characterManager.dice = this.diceEngine;
            this.characterManager.spellManager = this.spellManager;
            this.characterManager.equipmentManager = this.equipmentManager;
            
            console.log('✅ Character manager loaded with SRD integration');
        } else {
            throw new Error('CharacterManager not available');
        }
    }

    initializeAdventureEngine() {
        console.log('🗺️ Loading adventure generation system...');
        if (typeof AdventureEngine !== 'undefined') {
            this.adventureEngine = new AdventureEngine();
            
            // Inject dependencies
            this.adventureEngine.diceEngine = this.diceEngine;
            this.adventureEngine.characterManager = this.characterManager;
            
            console.log('✅ Adventure engine loaded and ready');
        } else {
            throw new Error('AdventureEngine not available');
        }
    }

    initializeStorageManager() {
        console.log('💾 Loading storage management system...');
        if (typeof StorageManager !== 'undefined') {
            this.storageManager = new StorageManager();
            console.log('✅ Storage manager ready');
        } else {
            throw new Error('StorageManager not available');
        }
    }

    initializeRandomTables() {
        console.log('📊 Loading random tables system...');
        if (typeof RandomTablesIndex !== 'undefined') {
            this.randomTablesIndex = new RandomTablesIndex();
            
            // Inject dependencies
            this.randomTablesIndex.diceEngine = this.diceEngine;
            
            console.log('✅ Random tables system loaded');
        } else {
            console.log('⚠️ RandomTablesIndex not available (optional)');
        }
    }

    validateSystems() {
        console.log('🔍 Validating system integration...');
        
        const validationTests = [
            {
                name: 'Dice Engine',
                test: () => this.diceEngine && this.diceEngine.roll('1d20') > 0
            },
            {
                name: 'Character Creation',
                test: () => {
                    const char = this.characterManager.createCharacter({
                        name: 'Test Character',
                        race: 'human',
                        class: 'fighter',
                        level: 1
                    });
                    return char && char.name === 'Test Character';
                }
            },
            {
                name: 'Spell System',
                test: () => {
                    return this.spellManager && 
                           Object.keys(this.spellManager.spellDatabase).length > 0;
                }
            },
            {
                name: 'Equipment System',
                test: () => {
                    return this.equipmentManager && 
                           this.equipmentManager.weapons && 
                           Object.keys(this.equipmentManager.weapons).length > 0;
                }
            }
        ];

        const results = validationTests.map(test => {
            try {
                const passed = test.test();
                console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASS' : 'FAIL'}`);
                return passed;
            } catch (error) {
                console.log(`❌ ${test.name}: ERROR - ${error.message}`);
                return false;
            }
        });

        const allPassed = results.every(result => result);
        
        if (allPassed) {
            console.log('🎉 All systems validated successfully!');
        } else {
            console.warn('⚠️ Some systems failed validation but engine will continue');
        }
    }

    handleCriticalError(error) {
        console.error('💥 CRITICAL ENGINE FAILURE:', error);
        
        // Display user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            color: #ff6b6b;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            font-family: 'Cinzel', serif;
            z-index: 10000;
        `;
        
        errorDiv.innerHTML = `
            <h1 style="font-size: 3rem; margin-bottom: 1rem; text-align: center;">
                ⚠️ Critical System Failure
            </h1>
            <p style="font-size: 1.2rem; text-align: center; max-width: 600px; margin-bottom: 2rem;">
                The RulzLawyer game engine has encountered a critical error and cannot continue.
                Please refresh the page to restart the application.
            </p>
            <p style="font-size: 1rem; text-align: center; opacity: 0.7;">
                Error: ${error.message}
            </p>
            <button onclick="location.reload()" 
                    style="margin-top: 2rem; padding: 1rem 2rem; background: #d4af37; 
                           color: #1a1a2e; border: none; border-radius: 8px; font-size: 1rem; 
                           cursor: pointer; font-family: 'Cinzel', serif;">
                Restart Application
            </button>
        `;
        
        document.body.appendChild(errorDiv);
    }

    // Public API methods for external access
    getSystemInfo() {
        return {
            version: this.version,
            systems: {
                diceEngine: !!this.diceEngine,
                characterManager: !!this.characterManager,
                adventureEngine: !!this.adventureEngine,
                spellManager: !!this.spellManager,
                equipmentManager: !!this.equipmentManager,
                storageManager: !!this.storageManager,
                randomTablesIndex: !!this.randomTablesIndex
            },
            ready: this.isReady()
        };
    }

    isReady() {
        return !!(this.diceEngine && this.characterManager && this.spellManager && this.equipmentManager);
    }

    // Convenience methods for common operations
    createQuickCharacter(name, race = 'human', characterClass = 'fighter', level = 1) {
        if (!this.isReady()) {
            throw new Error('Game engine not ready');
        }
        
        return this.characterManager.createCharacter({
            name,
            race,
            class: characterClass,
            level
        });
    }

    rollDice(expression) {
        if (!this.diceEngine) {
            throw new Error('Dice engine not available');
        }
        
        return this.diceEngine.roll(expression);
    }

    generateAdventure(options = {}) {
        if (!this.adventureEngine) {
            throw new Error('Adventure engine not available');
        }
        
        return this.adventureEngine.generateAdventure(options);
    }

    // Debug and development methods
    debugInfo() {
        console.group('🔧 RulzLawyer Debug Information');
        console.log('Version:', this.version);
        console.log('System Status:', this.getSystemInfo());
        console.log('Dice Engine:', this.diceEngine);
        console.log('Character Manager:', this.characterManager);
        console.log('Spell Manager:', this.spellManager);
        console.log('Equipment Manager:', this.equipmentManager);
        console.log('Adventure Engine:', this.adventureEngine);
        console.groupEnd();
    }

    // Performance monitoring
    getPerformanceMetrics() {
        if (typeof performance !== 'undefined') {
            return {
                loadTime: performance.now(),
                memory: performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
                } : null
            };
        }
        return null;
    }
}

// Global initialization
let gameEngine;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing RulzLawyer Game Engine...');
    
    try {
        gameEngine = new RulzLawyerGameEngine();
        window.gameEngine = gameEngine; // Make available globally
        
        // Development helpers
        if (typeof window !== 'undefined') {
            window.debugRulzLawyer = () => gameEngine.debugInfo();
            window.rlPerformance = () => gameEngine.getPerformanceMetrics();
        }
        
    } catch (error) {
        console.error('Failed to initialize game engine:', error);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RulzLawyerGameEngine;
} else if (typeof window !== 'undefined') {
    window.RulzLawyerGameEngine = RulzLawyerGameEngine;
}
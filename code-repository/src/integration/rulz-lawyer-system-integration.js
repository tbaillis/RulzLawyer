/**
 * RulzLawyerSystemIntegration - Master System Coordinator
 * 
 * Comprehensive integration hub that connects all D&D 3.5 systems:
 * - Character Creation & Management
 * - Inventory & Equipment Systems  
 * - Combat & Initiative Management
 * - Spell System & Magic
 * - Adventure Generation & Orchestration
 * 
 * This class serves as the central coordinator for the entire RulzLawyer
 * D&D 3.5 Character Creator and Adventure Engine ecosystem.
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class RulzLawyerSystemIntegration {
    constructor() {
        // Core system components
        this.dataManager = null;
        this.diceEngine = null;
        this.characterSystem = null;
        
        // Advanced systems
        this.inventoryIntegration = null;
        this.combatIntegration = null;
        this.spellSystem = null;
        this.adventureEngine = null;
        
        // System state
        this.initialized = false;
        this.systemStatus = {
            core: false,
            inventory: false,
            combat: false,
            spells: false,
            adventure: false
        };
        
        // Integration configuration
        this.config = {
            enableFullIntegration: true,
            enableCombatAutomation: true,
            enableSpellTracking: true,
            enableInventorySharing: true,
            enableAdventureLogging: true,
            debugMode: false
        };
        
        // Event system for cross-system communication
        this.eventBus = new Map();
        this.eventHistory = [];
        
        console.log('🎲 RulzLawyer System Integration initializing...');
    }

    /**
     * Initialize all systems in proper dependency order
     */
    async initialize(dependencies = {}) {
        try {
            console.log('🔧 Starting system initialization...');
            
            // Phase 1: Core Systems
            await this.initializeCoreSystemsss(dependencies);
            
            // Phase 2: Advanced Systems
            await this.initializeAdvancedSystems();
            
            // Phase 3: System Integration
            await this.establishSystemIntegrations();
            
            // Phase 4: Validation
            await this.validateSystemIntegration();
            
            this.initialized = true;
            console.log('✅ RulzLawyer System Integration fully initialized!');
            
            return this.getSystemStatus();
            
        } catch (error) {
            console.error('❌ System initialization failed:', error);
            throw error;
        }
    }

    /**
     * Initialize core systems (Phase 1)
     */
    async initializeCoreSystemsss(dependencies) {
        console.log('📚 Initializing core systems...');
        
        // Data Manager - Foundation for all systems
        if (dependencies.dataManager) {
            this.dataManager = dependencies.dataManager;
        } else {
            const { DataManager } = await import('../integration/data-manager.js');
            this.dataManager = new DataManager();
            await this.dataManager.initialize();
        }
        
        // Dice Engine - Core randomization system
        if (dependencies.diceEngine) {
            this.diceEngine = dependencies.diceEngine;
        } else {
            const { DiceEngine } = await import('../dice/dice-engine.js');
            this.diceEngine = new DiceEngine();
        }
        
        // Character System - Character creation and management
        if (dependencies.characterSystem) {
            this.characterSystem = dependencies.characterSystem;
        } else {
            const { CharacterCreationWizard } = await import('../character/character-creation-wizard.js');
            this.characterSystem = new CharacterCreationWizard(this.dataManager, this.diceEngine);
        }
        
        this.systemStatus.core = true;
        console.log('✅ Core systems initialized');
    }

    /**
     * Initialize advanced systems (Phase 2)
     */
    async initializeAdvancedSystems() {
        console.log('⚙️ Initializing advanced systems...');
        
        // Inventory Integration System
        try {
            const { InventoryIntegration } = await import('../inventory/inventory-integration.js');
            this.inventoryIntegration = new InventoryIntegration(
                this.dataManager, 
                this.diceEngine, 
                this.characterSystem
            );
            this.systemStatus.inventory = true;
            console.log('✅ Inventory Integration System initialized');
        } catch (error) {
            console.warn('⚠️ Inventory Integration System failed to initialize:', error.message);
        }
        
        // Combat Integration System
        try {
            const { CombatIntegration } = await import('../combat/combat-integration.js');
            this.combatIntegration = new CombatIntegration(
                this.dataManager, 
                this.diceEngine, 
                this.inventoryIntegration
            );
            this.systemStatus.combat = true;
            console.log('✅ Combat Integration System initialized');
        } catch (error) {
            console.warn('⚠️ Combat Integration System failed to initialize:', error.message);
        }
        
        // Spell System Foundation
        try {
            const { SpellSystemFoundation } = await import('../spells/spell-system-foundation.js');
            this.spellSystem = new SpellSystemFoundation(this.dataManager, this.diceEngine);
            this.systemStatus.spells = true;
            console.log('✅ Spell System Foundation initialized');
        } catch (error) {
            console.warn('⚠️ Spell System Foundation failed to initialize:', error.message);
        }
        
        // Adventure Engine
        try {
            const { AdventureEngine } = await import('../adventure/adventure-engine.js');
            this.adventureEngine = new AdventureEngine(
                this.diceEngine,
                this.characterSystem,
                this.dataManager,
                {
                    inventoryIntegration: this.inventoryIntegration,
                    combatIntegration: this.combatIntegration,
                    spellSystem: this.spellSystem
                }
            );
            this.systemStatus.adventure = true;
            console.log('✅ Adventure Engine initialized');
        } catch (error) {
            console.warn('⚠️ Adventure Engine failed to initialize:', error.message);
        }
    }

    /**
     * Establish cross-system integrations (Phase 3)
     */
    async establishSystemIntegrations() {
        console.log('🔗 Establishing system integrations...');
        
        // Connect combat system to spell system
        if (this.combatIntegration && this.spellSystem) {
            this.combatIntegration.setSpellSystem(this.spellSystem);
            this.spellSystem.setCombatSystem(this.combatIntegration);
            console.log('🔮⚔️ Combat-Spell integration established');
        }
        
        // Connect inventory system to combat system
        if (this.inventoryIntegration && this.combatIntegration) {
            this.combatIntegration.setInventorySystem(this.inventoryIntegration);
            this.inventoryIntegration.setCombatSystem(this.combatIntegration);
            console.log('💰⚔️ Inventory-Combat integration established');
        }
        
        // Connect adventure engine to all systems
        if (this.adventureEngine) {
            if (this.inventoryIntegration) {
                this.adventureEngine.inventoryIntegration = this.inventoryIntegration;
            }
            if (this.combatIntegration) {
                this.adventureEngine.combatIntegration = this.combatIntegration;
            }
            if (this.spellSystem) {
                this.adventureEngine.spellSystem = this.spellSystem;
            }
            console.log('🎲 Adventure Engine fully integrated');
        }
        
        // Setup event system connections
        this.setupEventSystemIntegrations();
    }

    /**
     * Setup event system for cross-system communication
     */
    setupEventSystemIntegrations() {
        // Combat events
        this.registerEventHandler('combat_start', (data) => {
            if (this.spellSystem) {
                this.spellSystem.startCombatTracking(data.combatId);
            }
        });
        
        this.registerEventHandler('combat_end', (data) => {
            if (this.spellSystem) {
                this.spellSystem.endCombatTracking(data.combatId);
            }
            if (this.inventoryIntegration && data.loot) {
                this.inventoryIntegration.distributeLoot(data.party, data.loot);
            }
        });
        
        // Spell events
        this.registerEventHandler('spell_cast', (data) => {
            if (this.combatIntegration && data.inCombat) {
                this.combatIntegration.processSpellEffects(data.spell, data.targets);
            }
        });
        
        // Inventory events
        this.registerEventHandler('item_equipped', (data) => {
            if (this.combatIntegration) {
                this.combatIntegration.updateCharacterStats(data.character);
            }
        });
        
        // Adventure events
        this.registerEventHandler('adventure_start', (data) => {
            this.emitEvent('system_state_change', {
                type: 'adventure_active',
                adventure: data.adventure
            });
        });
        
        console.log('📡 Event system integrations established');
    }

    /**
     * Validate system integration (Phase 4)
     */
    async validateSystemIntegration() {
        console.log('🔍 Validating system integration...');
        
        const validationResults = {
            coreIntegration: this.validateCoreIntegration(),
            dataFlow: this.validateDataFlow(),
            eventSystem: this.validateEventSystem(),
            systemDependencies: this.validateSystemDependencies()
        };
        
        const allValid = Object.values(validationResults).every(result => result.valid);
        
        if (allValid) {
            console.log('✅ System integration validation passed');
        } else {
            console.warn('⚠️ System integration validation found issues:', validationResults);
        }
        
        return validationResults;
    }

    // ===== CHARACTER CREATION WORKFLOW =====

    /**
     * Create character with full system integration
     */
    async createIntegratedCharacter(characterOptions = {}) {
        if (!this.initialized) {
            throw new Error('System not initialized');
        }
        
        console.log('👤 Creating integrated character...');
        
        // Create base character
        const character = await this.characterSystem.createCharacter(characterOptions);
        
        // Initialize inventory
        if (this.inventoryIntegration) {
            character.inventory = await this.inventoryIntegration.initializeCharacterInventory(character);
        }
        
        // Initialize spell tracking
        if (this.spellSystem && this.characterSystem.isSpellcaster(character)) {
            character.spellbook = await this.spellSystem.initializeSpellbook(character);
        }
        
        // Initialize combat stats
        if (this.combatIntegration) {
            character.combatStats = await this.combatIntegration.calculateCombatStats(character);
        }
        
        this.emitEvent('character_created', {
            character: character,
            systems: this.getActiveSystemsList()
        });
        
        console.log(`✅ Integrated character created: ${character.name}`);
        
        return character;
    }

    // ===== ADVENTURE MANAGEMENT =====

    /**
     * Start new adventure with full integration
     */
    async startIntegratedAdventure(adventureOptions = {}) {
        if (!this.adventureEngine) {
            throw new Error('Adventure Engine not available');
        }
        
        console.log('🗺️ Starting integrated adventure...');
        
        const adventure = await this.adventureEngine.generateIntegratedAdventure(adventureOptions);
        
        this.emitEvent('adventure_start', {
            adventure: adventure,
            integratedSystems: this.getActiveSystemsList()
        });
        
        console.log(`🎲 Adventure started: "${adventure.title}"`);
        
        return adventure;
    }

    // ===== EVENT SYSTEM =====

    /**
     * Register event handler
     */
    registerEventHandler(eventType, handler) {
        if (!this.eventBus.has(eventType)) {
            this.eventBus.set(eventType, []);
        }
        this.eventBus.get(eventType).push(handler);
    }

    /**
     * Emit event to all registered handlers
     */
    emitEvent(eventType, eventData) {
        const handlers = this.eventBus.get(eventType) || [];
        
        const event = {
            type: eventType,
            data: eventData,
            timestamp: Date.now(),
            systemState: this.getSystemStatus()
        };
        
        // Execute handlers
        handlers.forEach(handler => {
            try {
                handler(event.data);
            } catch (error) {
                console.error(`Event handler error for ${eventType}:`, error);
            }
        });
        
        // Log event
        this.eventHistory.push(event);
        
        // Limit event history size
        if (this.eventHistory.length > 1000) {
            this.eventHistory = this.eventHistory.slice(-800);
        }
        
        if (this.config.debugMode) {
            console.log(`📡 Event emitted: ${eventType}`, event);
        }
    }

    // ===== SYSTEM STATUS AND UTILITIES =====

    /**
     * Get comprehensive system status
     */
    getSystemStatus() {
        return {
            initialized: this.initialized,
            systems: this.systemStatus,
            activeFeatures: {
                characterCreation: !!this.characterSystem,
                inventoryManagement: !!this.inventoryIntegration,
                combatResolution: !!this.combatIntegration,
                spellcasting: !!this.spellSystem,
                adventureGeneration: !!this.adventureEngine
            },
            integrationLevel: this.calculateIntegrationLevel(),
            eventSystemActive: this.eventBus.size > 0,
            lastActivity: Date.now()
        };
    }

    /**
     * Calculate integration level percentage
     */
    calculateIntegrationLevel() {
        const systemCount = Object.keys(this.systemStatus).length;
        const activeCount = Object.values(this.systemStatus).filter(Boolean).length;
        return Math.round((activeCount / systemCount) * 100);
    }

    /**
     * Get list of active systems
     */
    getActiveSystemsList() {
        return Object.entries(this.systemStatus)
            .filter(([_, active]) => active)
            .map(([system, _]) => system);
    }

    /**
     * Validate core integration
     */
    validateCoreIntegration() {
        const required = ['dataManager', 'diceEngine', 'characterSystem'];
        const missing = required.filter(system => !this[system]);
        
        return {
            valid: missing.length === 0,
            missing: missing,
            message: missing.length > 0 ? `Missing core systems: ${missing.join(', ')}` : 'Core integration valid'
        };
    }

    /**
     * Validate data flow between systems
     */
    validateDataFlow() {
        // Test data flow between integrated systems
        try {
            if (this.characterSystem && this.inventoryIntegration) {
                // Test character-inventory data flow
                const testCharacter = { name: 'TestChar', level: 1 };
                this.inventoryIntegration.validateCharacterData(testCharacter);
            }
            
            return { valid: true, message: 'Data flow validation passed' };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    /**
     * Validate event system
     */
    validateEventSystem() {
        const hasHandlers = this.eventBus.size > 0;
        const canEmit = typeof this.emitEvent === 'function';
        
        return {
            valid: hasHandlers && canEmit,
            handlerCount: this.eventBus.size,
            message: hasHandlers ? 'Event system operational' : 'No event handlers registered'
        };
    }

    /**
     * Validate system dependencies
     */
    validateSystemDependencies() {
        const dependencies = [];
        
        // Check if combat system has required dependencies
        if (this.combatIntegration && !this.inventoryIntegration) {
            dependencies.push('Combat system requires inventory integration');
        }
        
        // Check if adventure engine has required dependencies
        if (this.adventureEngine && !this.characterSystem) {
            dependencies.push('Adventure engine requires character system');
        }
        
        return {
            valid: dependencies.length === 0,
            issues: dependencies,
            message: dependencies.length === 0 ? 'All dependencies satisfied' : 'Dependency issues found'
        };
    }

    /**
     * Shutdown and cleanup
     */
    async shutdown() {
        console.log('🔄 Shutting down RulzLawyer System Integration...');
        
        // Clear event handlers
        this.eventBus.clear();
        this.eventHistory = [];
        
        // Reset system status
        Object.keys(this.systemStatus).forEach(key => {
            this.systemStatus[key] = false;
        });
        
        // Clear system references
        this.dataManager = null;
        this.diceEngine = null;
        this.characterSystem = null;
        this.inventoryIntegration = null;
        this.combatIntegration = null;
        this.spellSystem = null;
        this.adventureEngine = null;
        
        this.initialized = false;
        
        console.log('✅ System integration shutdown complete');
    }
}

// Global export for both browser and Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RulzLawyerSystemIntegration;
} else if (typeof window !== 'undefined') {
    window.RulzLawyerSystemIntegration = RulzLawyerSystemIntegration;
}
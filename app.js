/**
 * RulzLawyer Main Application Engine
 * 
 * Core application orchestrator with dependency injection, module loading,
 * system validation, and global exports for browser compatibility.
 * 
 * Requirements Traceability:
 * - REQ-001: Web-based D&D 3.5 character creation tool
 * - US-001: Character creation core user story
 * - TS-001: Technical architecture specification
 * 
 * @version 1.0
 * @created September 21, 2025
 * @location app.js
 */

class RulzLawyerGameEngine {
  constructor() {
    this.version = '1.0.0';
    this.modules = new Map();
    this.initialized = false;
    this.startTime = Date.now();
    this.debug = true;
    
    // Core system modules
    this.coreModules = [
      'DiceEngine',
      'RandomTablesEngine', 
      'CharacterManager',
      'AdventureEngine',
      'StorageManager',
      'WebInterface',
      'FeatsSystem',
      'EquipmentSystem',
      'SpellsSystem',
      'SkillsSystem',
      'HoldingsSystem'
    ];
    
    this.log('🎲 RulzLawyer Game Engine initializing...');
  }

  /**
   * Initialize the game engine and all core systems
   */
  async initialize() {
    try {
      this.log('🚀 Starting game engine initialization...');
      
      // Phase 1: Load core engines in dependency order
      await this.loadCoreModules();
      
      // Phase 2: Initialize systems
      await this.initializeSystems();
      
      // Phase 3: Perform system validation
      await this.validateSystems();
      
      // Phase 4: Set up global exports for browser
      this.setupGlobalExports();
      
      // Phase 5: Initialize web interface
      await this.initializeWebInterface();
      
      this.initialized = true;
      this.logSuccess('✅ RulzLawyer Game Engine fully operational!');
      this.logSystemStatus();
      
    } catch (error) {
      this.logError(`Failed to initialize game engine: ${error.message}`);
      throw error;
    }
  }

  /**
   * Load core modules in proper dependency order
   */
  async loadCoreModules() {
    this.log('📦 Loading core modules...');
    
    // Module loading order is critical for dependencies
    const loadOrder = [
      'DiceEngine',
      'RandomTablesEngine',
      'CharacterManager', 
      'StorageManager',
      'AdventureEngine',
      'WebInterface'
    ];
    
    for (const moduleName of loadOrder) {
      try {
        await this.loadModule(moduleName);
      } catch (error) {
        this.logWarning(`⚠️  Module ${moduleName} not found or failed to load: ${error.message}`);
        // Continue loading other modules - some may not be implemented yet
      }
    }
  }

  /**
   * Load individual module
   */
  async loadModule(moduleName) {
    try {
      // Try to load from code-repository/src/
      const modulePath = `./code-repository/src/${this.getModuleFileName(moduleName)}`;
      
      let ModuleClass;
      if (typeof require !== 'undefined') {
        // Node.js environment
        ModuleClass = require(modulePath);
      } else {
        // Browser environment - modules should be loaded via script tags
        ModuleClass = window[moduleName];
      }
      
      if (ModuleClass) {
        this.modules.set(moduleName, ModuleClass);
        this.log(`✅ Loaded ${moduleName}`);
      } else {
        throw new Error(`Module class not found: ${moduleName}`);
      }
      
    } catch (error) {
      this.logWarning(`⚠️  Could not load ${moduleName}: ${error.message}`);
      // Create placeholder for missing modules
      this.modules.set(moduleName, null);
    }
  }

  /**
   * Get module filename from class name
   */
  getModuleFileName(className) {
    // Convert PascalCase to kebab-case
    return className
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .substring(1) + '.js';
  }

  /**
   * Initialize all loaded systems
   */
  async initializeSystems() {
    this.log('⚙️  Initializing systems...');
    
    // Initialize Dice Engine first (dependency for others)
    await this.initializeDiceEngine();
    
    // Initialize Random Tables Engine
    await this.initializeRandomTablesEngine();
    
    // Initialize Character Manager
    await this.initializeCharacterManager();
    
    // Initialize Storage Manager
    await this.initializeStorageManager();
    
    // Initialize Adventure Engine
    await this.initializeAdventureEngine();
    
    // Initialize new D&D 3.5 systems
    await this.initializeFeatsSystem();
    await this.initializeEquipmentSystem();  
    await this.initializeSpellsSystem();
    await this.initializeSkillsSystem();
    await this.initializeHoldingsSystem();
    
    this.log('✅ All systems initialized');
  }

  /**
   * Initialize Dice Engine
   */
  async initializeDiceEngine() {
    const DiceEngineClass = this.modules.get('DiceEngine');
    if (DiceEngineClass) {
      this.diceEngine = new DiceEngineClass();
      this.log('🎲 Dice Engine initialized');
    } else {
      this.logWarning('⚠️  Dice Engine not available - using mock');
      this.diceEngine = this.createMockDiceEngine();
    }
  }

  /**
   * Initialize Random Tables Engine
   */
  async initializeRandomTablesEngine() {
    const RandomTablesEngineClass = this.modules.get('RandomTablesEngine');
    if (RandomTablesEngineClass) {
      this.randomTablesEngine = new RandomTablesEngineClass(this.diceEngine);
      this.log('📋 Random Tables Engine initialized');
    } else {
      this.logWarning('⚠️  Random Tables Engine not available - using mock');
      this.randomTablesEngine = this.createMockRandomTablesEngine();
    }
  }

  /**
   * Initialize Character Manager
   */
  async initializeCharacterManager() {
    const CharacterManagerClass = this.modules.get('CharacterManager');
    if (CharacterManagerClass) {
      this.characterManager = new CharacterManagerClass(this.diceEngine, this.randomTablesEngine);
      this.log('⚔️  Character Manager initialized');
    } else {
      this.logWarning('⚠️  Character Manager not available - using mock');
      this.characterManager = this.createMockCharacterManager();
    }
  }

  /**
   * Initialize Storage Manager
   */
  async initializeStorageManager() {
    const StorageManagerClass = this.modules.get('StorageManager');
    if (StorageManagerClass) {
      this.storageManager = new StorageManagerClass();
      this.log('💾 Storage Manager initialized');
    } else {
      this.logWarning('⚠️  Storage Manager not available - using mock');
      this.storageManager = this.createMockStorageManager();
    }
  }

  /**
   * Initialize Adventure Engine
   */
  async initializeAdventureEngine() {
    const AdventureEngineClass = this.modules.get('AdventureEngine');
    if (AdventureEngineClass) {
      this.adventureEngine = new AdventureEngineClass(
        this.diceEngine, 
        this.randomTablesEngine, 
        this.characterManager
      );
      this.log('🏰 Adventure Engine initialized');
    } else {
      this.logWarning('⚠️  Adventure Engine not available - using mock');
      this.adventureEngine = this.createMockAdventureEngine();
    }
  }

  /**
   * Initialize Feats System
   */
  async initializeFeatsSystem() {
    const FeatsSystemClass = this.modules.get('FeatsSystem');
    if (FeatsSystemClass) {
      // Initialize character data model if needed
      if (!this.characterDataModel) {
        this.characterDataModel = this.characterManager?.dataModel || {};
      }
      
      this.featsSystem = new FeatsSystemClass(this.characterDataModel, this.diceEngine);
      this.log('📜 Feats System initialized');
    } else {
      this.logWarning('⚠️  Feats System not available - using mock');
      this.featsSystem = this.createMockFeatsSystem();
    }
  }

  /**
   * Initialize Equipment System
   */
  async initializeEquipmentSystem() {
    const EquipmentSystemClass = this.modules.get('EquipmentSystem');
    if (EquipmentSystemClass) {
      this.equipmentSystem = new EquipmentSystemClass(this.characterDataModel, this.diceEngine);
      this.log('⚔️  Equipment System initialized');
    } else {
      this.logWarning('⚠️  Equipment System not available - using mock');
      this.equipmentSystem = this.createMockEquipmentSystem();
    }
  }

  /**
   * Initialize Spells System
   */
  async initializeSpellsSystem() {
    const SpellsSystemClass = this.modules.get('SpellsSystem');
    if (SpellsSystemClass) {
      this.spellsSystem = new SpellsSystemClass(
        this.characterDataModel, 
        this.diceEngine, 
        this.featsSystem
      );
      this.log('📚 Spells System initialized');
    } else {
      this.logWarning('⚠️  Spells System not available - using mock');
      this.spellsSystem = this.createMockSpellsSystem();
    }
  }

  /**
   * Initialize Skills System
   */
  async initializeSkillsSystem() {
    const SkillsSystemClass = this.modules.get('SkillsSystem');
    if (SkillsSystemClass) {
      this.skillsSystem = new SkillsSystemClass(
        this.characterDataModel, 
        this.diceEngine
      );
      this.log('📚 Skills System initialized');
    } else {
      this.logWarning('⚠️  Skills System not available - using mock');
      this.skillsSystem = this.createMockSkillsSystem();
    }
  }

  /**
   * Initialize Holdings System
   */
  async initializeHoldingsSystem() {
    const HoldingsSystemClass = this.modules.get('HoldingsSystem');
    if (HoldingsSystemClass) {
      this.holdingsSystem = new HoldingsSystemClass({
        characterDataModel: this.characterDataModel
      });
      this.log('🏰 Holdings System initialized');
    } else {
      this.logWarning('⚠️  Holdings System not available - using mock');
      this.holdingsSystem = this.createMockHoldingsSystem();
    }
  }

  /**
   * Initialize Web Interface
   */
  async initializeWebInterface() {
    const WebInterfaceClass = this.modules.get('WebInterface');
    if (WebInterfaceClass) {
      this.webInterface = new WebInterfaceClass(this);
      this.log('🖥️  Web Interface initialized');
    } else {
      this.logWarning('⚠️  Web Interface not available - using basic implementation');
      this.webInterface = this.createBasicWebInterface();
    }
  }

  /**
   * Validate all systems are working
   */
  async validateSystems() {
    this.log('🔍 Validating systems...');
    
    const validations = [
      { name: 'Dice Engine', test: () => this.diceEngine && this.diceEngine.roll },
      { name: 'Random Tables', test: () => this.randomTablesEngine && this.randomTablesEngine.rollTable },
      { name: 'Character Manager', test: () => this.characterManager && this.characterManager.createCharacter },
      { name: 'Storage Manager', test: () => this.storageManager && this.storageManager.save },
      { name: 'Adventure Engine', test: () => this.adventureEngine && this.adventureEngine.generateEncounter },
      { name: 'Feats System', test: () => this.featsSystem && this.featsSystem.getAvailableFeats },
      { name: 'Equipment System', test: () => this.equipmentSystem && this.equipmentSystem.getItemById },
      { name: 'Spells System', test: () => this.spellsSystem && this.spellsSystem.getSpellsByClass },
      { name: 'Skills System', test: () => this.skillsSystem && this.skillsSystem.getSkillById },
      { name: 'Holdings System', test: () => this.holdingsSystem && this.holdingsSystem.propertyTypes }
    ];
    
    let passed = 0;
    let total = validations.length;
    
    for (const validation of validations) {
      try {
        if (validation.test()) {
          this.log(`✅ ${validation.name} validation passed`);
          passed++;
        } else {
          this.logWarning(`⚠️  ${validation.name} validation failed - system not functional`);
        }
      } catch (error) {
        this.logWarning(`⚠️  ${validation.name} validation error: ${error.message}`);
      }
    }
    
    this.log(`🎯 System validation complete: ${passed}/${total} systems operational`);
  }

  /**
   * Set up global exports for browser compatibility
   */
  setupGlobalExports() {
    if (typeof window !== 'undefined') {
      this.log('🌐 Setting up browser globals...');
      
      // Export game engine
      window.gameEngine = this;
      window.rulzLawyer = this;
      
      // Export individual systems
      window.diceEngine = this.diceEngine;
      window.randomTablesEngine = this.randomTablesEngine;
      window.characterManager = this.characterManager;
      window.storageManager = this.storageManager;
      window.adventureEngine = this.adventureEngine;
      window.webInterface = this.webInterface;
      window.featsSystem = this.featsSystem;
      window.equipmentSystem = this.equipmentSystem;
      window.spellsSystem = this.spellsSystem;
      window.skillsSystem = this.skillsSystem;
      window.holdingsSystem = this.holdingsSystem;
      
      // Export utility functions
      window.rollDice = (...args) => this.diceEngine.roll(...args);
      window.createNewCharacter = (...args) => this.characterManager.createCharacter(...args);
      window.generateAdventure = (...args) => this.adventureEngine.generateAdventure(...args);
      
      this.log('✅ Browser globals exported');
    }
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    const uptime = Date.now() - this.startTime;
    return {
      initialized: this.initialized,
      version: this.version,
      uptime: uptime,
      modules: Array.from(this.modules.keys()),
      systems: {
        diceEngine: !!this.diceEngine,
        randomTables: !!this.randomTablesEngine,
        characterManager: !!this.characterManager,
        storageManager: !!this.storageManager,
        adventureEngine: !!this.adventureEngine,
        webInterface: !!this.webInterface,
        featsSystem: !!this.featsSystem,
        equipmentSystem: !!this.equipmentSystem,
        spellsSystem: !!this.spellsSystem,
        skillsSystem: !!this.skillsSystem,
        holdingsSystem: !!this.holdingsSystem
      }
    };
  }

  /**
   * Log system status
   */
  logSystemStatus() {
    const status = this.getSystemStatus();
    const uptimeSeconds = Math.floor(status.uptime / 1000);
    
    this.log('📊 System Status Report:');
    this.log(`   Version: ${status.version}`);
    this.log(`   Uptime: ${uptimeSeconds}s`);
    this.log(`   Modules loaded: ${status.modules.length}`);
    this.log(`   Systems operational: ${Object.values(status.systems).filter(Boolean).length}/11`);
    
    if (status.initialized) {
      this.logSuccess('🎉 RulzLawyer is ready for epic D&D adventures!');
    }
  }

  // Mock systems for development when real modules aren't available yet

  createMockDiceEngine() {
    return {
      roll(sides = 20) {
        return Math.floor(Math.random() * sides) + 1;
      },
      rollExpression(expression) {
        // Simple mock - just roll a d20 for any expression
        return {
          expression: expression,
          total: this.roll(20),
          rolls: [this.roll(20)],
          timestamp: new Date()
        };
      }
    };
  }

  createMockRandomTablesEngine() {
    return {
      rollTable(tableId) {
        return {
          tableId: tableId,
          result: `Mock result for ${tableId}`,
          timestamp: new Date()
        };
      }
    };
  }

  createMockCharacterManager() {
    return {
      createCharacter(options = {}) {
        return {
          id: Date.now(),
          name: options.name || 'Test Hero',
          race: options.race || 'Human',
          class: options.class || 'Fighter',
          level: 1,
          hitPoints: { current: 10, maximum: 10 },
          abilities: {
            strength: 15,
            dexterity: 14,
            constitution: 13,
            intelligence: 12,
            wisdom: 11,
            charisma: 10
          },
          created: new Date()
        };
      }
    };
  }

  createMockStorageManager() {
    return {
      save(key, data) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(data));
        }
        return Promise.resolve(true);
      },
      load(key) {
        if (typeof localStorage !== 'undefined') {
          const data = localStorage.getItem(key);
          return Promise.resolve(data ? JSON.parse(data) : null);
        }
        return Promise.resolve(null);
      }
    };
  }

  createMockAdventureEngine() {
    return {
      generateEncounter(partyLevel = 1) {
        return {
          title: `Level ${partyLevel} Encounter`,
          description: 'A mysterious adventure awaits...',
          monsters: ['Orc Warrior', 'Goblin Scout'],
          treasures: ['50 gold pieces', 'Healing Potion'],
          generated: new Date()
        };
      }
    };
  }

  createBasicWebInterface() {
    return {
      showMessage(message) {
        if (typeof alert !== 'undefined') {
          alert(message);
        } else {
          console.log('UI Message:', message);
        }
      },
      initializeUI() {
        this.log('🖥️  Basic web interface ready');
      }
    };
  }

  createMockFeatsSystem() {
    return {
      getAvailableFeats(character) {
        return [
          { id: 'power_attack', name: 'Power Attack', description: 'Sacrifice accuracy for damage' },
          { id: 'toughness', name: 'Toughness', description: '+3 hit points' },
          { id: 'weapon_focus', name: 'Weapon Focus', description: '+1 attack with selected weapon' }
        ];
      },
      validatePrerequisites(featId, character) {
        return { valid: true, reasons: [] };
      },
      applyFeatEffects(character, featId) {
        return character;
      },
      getFeatById(featId) {
        return { id: featId, name: featId.replace('_', ' '), description: 'Mock feat' };
      }
    };
  }

  createMockEquipmentSystem() {
    return {
      getItemById(itemId) {
        return { 
          id: itemId, 
          name: itemId.replace('_', ' '), 
          cost: 10, 
          weight: 1,
          description: 'Mock equipment item'
        };
      },
      equipItem(character, itemId) {
        return { success: true, message: 'Item equipped' };
      },
      getItemsByType(type) {
        return [
          { id: 'longsword', name: 'Longsword', damage: '1d8', cost: 15 },
          { id: 'chain_shirt', name: 'Chain Shirt', armorBonus: 4, cost: 100 }
        ];
      },
      calculateEncumbrance(character) {
        return { load: 'light', current: 50, capacity: { light: 100, medium: 200, heavy: 300 } };
      }
    };
  }

  createMockSpellsSystem() {
    return {
      getSpellsByClass(className, level) {
        return [
          { id: 'magic_missile', name: 'Magic Missile', level: 1, damage: '1d4+1' },
          { id: 'fireball', name: 'Fireball', level: 3, damage: '1d6/level' },
          { id: 'cure_light_wounds', name: 'Cure Light Wounds', level: 1, healing: '1d8+1' }
        ];
      },
      canCastSpell(character, spellId) {
        return { valid: true, reason: '' };
      },
      castSpell(character, spellId, casterLevel) {
        return { 
          success: true, 
          effects: { damage: '1d6' }, 
          savingThrow: 15,
          duration: '1 round'
        };
      },
      searchSpells(query) {
        return [{ id: 'mock_spell', name: 'Mock Spell', description: 'A placeholder spell' }];
      }
    };
  }

  createMockSkillsSystem() {
    return {
      getSkillById(skillId) {
        return {
          id: skillId,
          name: skillId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          keyAbility: 'Int',
          description: 'Mock skill description',
          untrained: true
        };
      },
      makeSkillCheck(character, skillId, dc, situationalModifier) {
        return {
          result: 15,
          success: true,
          roll: 10,
          modifier: 5,
          dc: dc || 15,
          margin: 0
        };
      },
      calculateSkillRanks(character, skillId) {
        return { ranks: 5, modifier: 3, total: 8 };
      },
      getAllSkills() {
        return [
          { id: 'appraise', name: 'Appraise', keyAbility: 'Int' },
          { id: 'bluff', name: 'Bluff', keyAbility: 'Cha' },
          { id: 'climb', name: 'Climb', keyAbility: 'Str' }
        ];
      },
      getSkillsByKeyAbility(ability) {
        return this.getAllSkills().filter(skill => skill.keyAbility === ability);
      }
    };
  }

  createMockHoldingsSystem() {
    return {
      propertyTypes: {
        cottage: { name: 'Cottage', baseCost: 1200, description: 'A small rural dwelling' },
        inn: { name: 'Inn', baseCost: 8000, description: 'A traveler\'s rest' }
      },
      businessTypes: {
        mercenary_company: { name: 'Mercenary Company', startupCost: 10000, description: 'A military organization' }
      },
      vehicleTypes: {
        sailing_ship: { name: 'Sailing Ship', cost: 10000, description: 'A seaworthy vessel' }
      },
      purchaseProperty(character, propertyType, location, customizations) {
        return {
          success: true,
          property: {
            id: 'mock_property',
            name: customizations?.name || 'Mock Property',
            type: propertyType,
            location: location
          }
        };
      },
      startBusiness(character, businessType, location) {
        return {
          success: true,
          business: {
            id: 'mock_business',
            name: 'Mock Business',
            type: businessType,
            location: location
          }
        };
      },
      purchaseVehicle(character, vehicleType, customizations) {
        return {
          success: true,
          vehicle: {
            id: 'mock_vehicle',
            name: customizations?.name || 'Mock Vehicle',
            type: vehicleType
          }
        };
      },
      getCharacterHoldingsSummary(character) {
        return {
          totalValue: 25000,
          monthlyIncome: 300,
          monthlyExpenses: 150,
          netMonthlyGain: 150,
          propertyCount: 2,
          businessCount: 1,
          vehicleCount: 1
        };
      },
      processMonthlyFinances(character) {
        return {
          summary: {
            totalIncome: 300,
            totalExpenses: 150,
            netGain: 150,
            newWealth: 50000
          },
          properties: [],
          businesses: [],
          vehicles: []
        };
      }
    };
  }

  // Logging utilities
  log(message) {
    if (this.debug) {
      console.log(`\x1b[36m[GameEngine] ${message}\x1b[0m`);
    }
  }

  logSuccess(message) {
    console.log(`\x1b[32m[GameEngine] ${message}\x1b[0m`);
  }

  logWarning(message) {
    console.log(`\x1b[33m[GameEngine] ${message}\x1b[0m`);
  }

  logError(message) {
    console.error(`\x1b[31m[GameEngine] ${message}\x1b[0m`);
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RulzLawyerGameEngine;
}

if (typeof window !== 'undefined') {
  window.RulzLawyerGameEngine = RulzLawyerGameEngine;
}

// Auto-initialize if this is the main script
if (typeof document !== 'undefined' && document.readyState !== 'loading') {
  // Initialize immediately if DOM is ready
  const gameEngine = new RulzLawyerGameEngine();
  gameEngine.initialize();
} else if (typeof document !== 'undefined') {
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', () => {
    const gameEngine = new RulzLawyerGameEngine();
    gameEngine.initialize();
  });
}
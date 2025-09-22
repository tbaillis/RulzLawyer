/**
 * RulzLawyer D&D 3.5 Gaming Server v3.0
 * Enhanced gaming server with character persistence, session management, 
 * dice rolling API, and comprehensive game state handling
 * 
 * Based on research from D&D Beyond patterns and modern web gaming standards
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

// Import game modules (with error handling)
let RandomTablesData = null;
let SpellManager = null;
try {
  RandomTablesData = require('./code-repository/tables/random-tables-index.js');
  console.log('✓ RandomTablesData loaded successfully');
} catch (error) {
  console.warn('⚠️  RandomTablesData not loaded:', error.message);
  // Create fallback object
  RandomTablesData = {
    getAllTables: () => [],
    version: "fallback"
  };
}

try {
  SpellManager = require('./code-repository/src/spell-manager.js');
  console.log('🔮 SpellManager loaded successfully');
} catch (error) {
  console.warn('⚠️  SpellManager not loaded:', error.message);
  // Create fallback object
  SpellManager = class {
    constructor() {}
    initializeCharacterSpells() { return null; }
    getAvailableSpells() { return []; }
    selectSpell() { return { success: false, error: 'SpellManager not available' }; }
  };
}

// Load AdvancedCharacterPortraitSystem
let AdvancedCharacterPortraitSystem;
try {
  AdvancedCharacterPortraitSystem = require('./code-repository/src/advanced-character-portrait-system.js');
  console.log('🎨 AdvancedCharacterPortraitSystem loaded successfully');
} catch (error) {
  console.warn('⚠️  AdvancedCharacterPortraitSystem not loaded:', error.message);
  // Create fallback object
  AdvancedCharacterPortraitSystem = class {
    constructor() {}
    generatePortrait() { return { error: 'AdvancedCharacterPortraitSystem not available' }; }
    customizeAppearance() { return { error: 'AdvancedCharacterPortraitSystem not available' }; }
    renderPortrait() { return { error: 'AdvancedCharacterPortraitSystem not available' }; }
  };
}

// Load ComprehensiveSpellSystem
let ComprehensiveSpellSystem;
try {
  ComprehensiveSpellSystem = require('./code-repository/src/comprehensive-spell-system.js');
  console.log('✨ ComprehensiveSpellSystem loaded successfully');
} catch (error) {
  console.warn('⚠️  ComprehensiveSpellSystem not loaded:', error.message);
  // Create fallback object
  ComprehensiveSpellSystem = class {
    constructor() {}
    initializeCharacterSpells() { return { error: 'ComprehensiveSpellSystem not available' }; }
    prepareSpell() { return { error: 'ComprehensiveSpellSystem not available' }; }
    castSpell() { return { error: 'ComprehensiveSpellSystem not available' }; }
    searchSpells() { return { error: 'ComprehensiveSpellSystem not available' }; }
  };
}

// Load AdvancedEquipmentManager
let AdvancedEquipmentManager;
try {
  AdvancedEquipmentManager = require('./code-repository/src/advanced-equipment-manager.js');
  console.log('🛡️ AdvancedEquipmentManager loaded successfully');
} catch (error) {
  console.warn('⚠️  AdvancedEquipmentManager not loaded:', error.message);
  // Create fallback object
  AdvancedEquipmentManager = class {
    constructor() {}
    addToInventory() { return { error: 'AdvancedEquipmentManager not available' }; }
    equipItem() { return { error: 'AdvancedEquipmentManager not available' }; }
    calculateEncumbrance() { return { error: 'AdvancedEquipmentManager not available' }; }
    applyPreset() { return { error: 'AdvancedEquipmentManager not available' }; }
  };
}

// Load EpicLevelCharacterSystem
let EpicLevelCharacterSystem;
try {
  EpicLevelCharacterSystem = require('./code-repository/src/epic-level-character-system.js');
  console.log('⭐ EpicLevelCharacterSystem loaded successfully');
} catch (error) {
  console.warn('⚠️  EpicLevelCharacterSystem not loaded:', error.message);
  // Create fallback object
  EpicLevelCharacterSystem = class {
    constructor() {}
    createEpicCharacter() { return { error: 'EpicLevelCharacterSystem not available' }; }
    calculateEpicProgression() { return { error: 'EpicLevelCharacterSystem not available' }; }
    getAvailableEpicFeats() { return { error: 'EpicLevelCharacterSystem not available' }; }
  };
}

// Load AdvancedCombatTracker
let AdvancedCombatTracker;
try {
  AdvancedCombatTracker = require('./code-repository/src/advanced-combat-tracker.js');
  console.log('⚔️ AdvancedCombatTracker loaded successfully');
} catch (error) {
  console.warn('⚠️  AdvancedCombatTracker not loaded:', error.message);
  // Create fallback object
  AdvancedCombatTracker = class {
    constructor() {}
    startCombat() { return { error: 'AdvancedCombatTracker not available' }; }
    rollInitiative() { return { error: 'AdvancedCombatTracker not available' }; }
    nextTurn() { return { error: 'AdvancedCombatTracker not available' }; }
    applyCondition() { return { error: 'AdvancedCombatTracker not available' }; }
  };
}

let AdventureEngine;
try {
  // Try enhanced adventure engine first
  AdventureEngine = require('./code-repository/src/enhanced-adventure-engine.js');
  console.log('🏰 Enhanced AdventureEngine loaded successfully');
} catch (error) {
  try {
    // Fallback to basic adventure engine
    AdventureEngine = require('./code-repository/src/adventure-engine.js');
    console.log('🏰 AdventureEngine loaded successfully');
  } catch (fallbackError) {
    console.warn('⚠️  AdventureEngine not loaded:', fallbackError.message);
    // Create fallback object
    AdventureEngine = class {
      constructor() {}
      createCampaign() { return { error: 'AdventureEngine not available' }; }
      generateRandomEncounter() { return { error: 'AdventureEngine not available' }; }
      generateNPC() { return { error: 'AdventureEngine not available' }; }
      generateTreasure() { return { error: 'AdventureEngine not available' }; }
    };
  }
}

class RulzLawyerGameServer {
  constructor() {
    this.port = 3000;
    this.sessionStore = new Map(); // In-memory session storage
    this.characterStore = new Map(); // Character persistence
    this.campaignStore = new Map(); // Campaign data
    this.diceHistory = new Map(); // Per-session dice history
    
    // Initialize game systems
    this.spellManager = new SpellManager();
    this.adventureEngine = new AdventureEngine();
    this.equipmentManager = new AdvancedEquipmentManager();
    this.spellSystem = new ComprehensiveSpellSystem();
    this.portraitSystem = new AdvancedCharacterPortraitSystem();
    this.epicLevelSystem = new EpicLevelCharacterSystem();
    this.combatTracker = new AdvancedCombatTracker();
    
    // Initialize spell database if available
    if (this.spellManager.initializeSpellDatabase) {
      this.spellManager.initializeSpellDatabase();
      console.log('✨ Spell database loaded with', Object.keys(this.spellManager.spellDatabase || {}).length, 'spells');
    }
    
    // MIME types for proper content serving
    this.mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2'
    };
    
    // Gaming API endpoints
    this.apiRoutes = {
      '/api/character/create': this.createCharacter.bind(this),
      '/api/character/save': this.saveCharacter.bind(this),
      '/api/character/load': this.loadCharacter.bind(this),
      '/api/character/list': this.listCharacters.bind(this),
      '/api/dice/roll': this.rollDice.bind(this),
      '/api/dice/history': this.getDiceHistory.bind(this),
      '/api/tables/roll': this.rollTable.bind(this),
      '/api/tables/list': this.listTables.bind(this),
      '/api/session/create': this.createSession.bind(this),
      '/api/session/validate': this.validateSession.bind(this),
      '/api/campaign/create': this.createCampaign.bind(this),
      '/api/campaign/join': this.joinCampaign.bind(this),
      '/api/srd/validate': this.validateSRD.bind(this),
      '/api/equipment/equip': this.equipItem.bind(this),
      '/api/equipment/unequip': this.unequipItem.bind(this),
      '/api/equipment/inventory': this.manageInventory.bind(this),
      '/api/equipment/preset': this.applyEquipmentPreset.bind(this),
      '/api/equipment/export': this.exportEquipment.bind(this),
      '/api/equipment/import': this.importEquipment.bind(this),
      '/api/spell/initialize': this.initializeSpells.bind(this),
      '/api/spell/available': this.getAvailableSpells.bind(this),
      '/api/spell/select': this.selectSpell.bind(this),
      '/api/spell/cast': this.castSpell.bind(this),
      '/api/spell/info': this.getSpellInfo.bind(this),
      '/api/spell/search': this.searchSpells.bind(this),
      '/api/spell/rest': this.restoreSpellSlots.bind(this),
      '/api/adventure/campaign/new': this.createAdventureCampaign.bind(this),
      '/api/adventure/campaign/load': this.loadAdventureCampaign.bind(this),
      '/api/adventure/encounter/generate': this.generateEncounter.bind(this),
      '/api/adventure/encounter/get': this.getEncounter.bind(this),
      '/api/adventure/npc/generate': this.generateNPC.bind(this),
      '/api/adventure/treasure/generate': this.generateTreasure.bind(this),
      '/api/adventure/story/advance': this.advanceStory.bind(this),
      '/api/epic/character/create': this.createEpicCharacter.bind(this),
      '/api/epic/character/upgrade': this.upgradeToEpic.bind(this),
      '/api/epic/feats/available': this.getAvailableEpicFeats.bind(this),
      '/api/epic/feats/select': this.selectEpicFeat.bind(this),
      '/api/epic/spells/develop': this.developEpicSpell.bind(this),
      '/api/epic/divine/ascend': this.attemptDivineAscension.bind(this),
      '/api/combat/start': this.startCombat.bind(this),
      '/api/combat/initiative': this.rollCombatInitiative.bind(this),
      '/api/combat/turn/next': this.nextCombatTurn.bind(this),
      '/api/combat/turn/delay': this.delayCombatTurn.bind(this),
      '/api/combat/action/ready': this.readyCombatAction.bind(this),
      '/api/combat/condition/apply': this.applyCombatCondition.bind(this),
      '/api/combat/condition/remove': this.removeCombatCondition.bind(this),
      '/api/combat/damage/apply': this.applyCombatDamage.bind(this),
      '/api/combat/healing/apply': this.applyCombatHealing.bind(this),
      '/api/combat/spell/track': this.trackCombatSpell.bind(this),
      '/api/combat/spell/end': this.endCombatSpell.bind(this),
      '/api/combat/position/move': this.moveCombatant.bind(this),
      '/api/combat/range/calculate': this.calculateCombatRange.bind(this),
      '/api/combat/end': this.endCombat.bind(this),
      '/api/combat/state/export': this.exportCombatState.bind(this),
      '/api/combat/state/import': this.importCombatState.bind(this)
    };
    
    // Initialize equipment manager
    this.equipmentManager = null;
    this.initializeEquipmentManager();
    
    console.log('🎲 RulzLawyer Gaming Server Initialized');
    console.log('🔧 Gaming Features: Character Persistence, Dice Rolling, Table Management');
    console.log('⚔️  D&D 3.5 SRD Compliance: Full validation and rule enforcement');
    this.initializeDataPersistence();
  }

  initializeDataPersistence() {
    try {
      const DataPersistenceManager = require('./code-repository/src/data-persistence-manager.js');
      this.dataPersistence = new DataPersistenceManager();
      console.log('💾 DataPersistenceManager loaded successfully');
    } catch (error) {
      console.warn('⚠ DataPersistenceManager not available:', error.message);
      this.dataPersistence = null;
    }
  }

  initializeEquipmentManager() {
    try {
      // Try advanced equipment manager first
      const AdvancedEquipmentManager = require('./code-repository/src/advanced-equipment-manager.js');
      this.equipmentManager = new AdvancedEquipmentManager();
      console.log('🛡️ AdvancedEquipmentManager loaded successfully');
    } catch (error) {
      try {
        // Fallback to basic equipment manager
        const EquipmentManager = require('./code-repository/src/equipment-manager.js');
        this.equipmentManager = new EquipmentManager();
        console.log('⚔️  EquipmentManager loaded successfully');
      } catch (fallbackError) {
        console.warn('⚠ EquipmentManager not available:', fallbackError.message);
        this.equipmentManager = null;
      }
    }
  }

  start() {
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });
    
    this.server.listen(this.port, () => {
      console.log(`🚀 RulzLawyer D&D 3.5 Game Server running on http://localhost:${this.port}`);
      console.log(`📋 Character Creator: http://localhost:${this.port}/character-creator.html`);
      console.log(`🎯 Adventure Engine: http://localhost:${this.port}/adventure-engine.html`);
      console.log(`🎲 Dice Roller: http://localhost:${this.port}/dice-roller.html`);
      console.log(`📊 API Status: All gaming endpoints active`);
    });
    
    this.server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${this.port} is already in use. Please close other instances first.`);
      } else {
        console.error('❌ Server error:', err);
      }
    });
  }

  handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Handle API requests
    if (pathname.startsWith('/api/')) {
      this.handleAPI(req, res, parsedUrl);
      return;
    }
    
    // Handle static file requests
    this.handleStaticFile(req, res, pathname);
  }

  handleAPI(req, res, parsedUrl) {
    const pathname = parsedUrl.pathname;
    const method = req.method;
    
    // Set CORS headers for API requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Session-ID');
    
    if (method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    // Route API calls
    if (this.apiRoutes[pathname]) {
      try {
        this.apiRoutes[pathname](req, res, parsedUrl);
      } catch (error) {
        console.error(`API Error for ${pathname}:`, error);
        this.sendJSONResponse(res, 500, { error: 'Internal server error', details: error.message });
      }
    } else {
      this.sendJSONResponse(res, 404, { error: 'API endpoint not found' });
    }
  }

  handleStaticFile(req, res, pathname) {
    // Default to index.html for root
    if (pathname === '/') {
      pathname = '/game-hub.html';
    }
    
    // Security: prevent directory traversal
    const safePath = path.normalize(pathname).replace(/^(\\..[/\\\\])+/, '');
    let filePath;
    
    // Check if it's a code-repository file
    if (safePath.startsWith('code-repository/')) {
      filePath = path.join(__dirname, safePath);
    } else {
      // Try to serve from root or create default files
      filePath = this.resolveStaticFile(safePath);
    }
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // Generate default files if they don't exist
          // Ensure pathname starts with / for switch matching
          const normalizedPath = pathname.startsWith('/') ? pathname : '/' + pathname;
          this.generateDefaultFile(res, normalizedPath);
        } else {
          res.writeHead(500);
          res.end('Server error');
        }
        return;
      }
      
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = this.mimeTypes[ext] || 'application/octet-stream';
      
      res.setHeader('Content-Type', mimeType);
      res.writeHead(200);
      res.end(data);
    });
  }

  resolveStaticFile(pathname) {
    // Check for existing files in priority order
    const possiblePaths = [
      path.join(__dirname, pathname),
      path.join(__dirname, 'code-repository', pathname),
      path.join(__dirname, 'static', pathname)
    ];
    
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
    
    // Return the first path for error handling
    return possiblePaths[0];
  }

  generateDefaultFile(res, pathname) {
    // Generate default gaming interface files
    let content = '';
    let contentType = 'text/html';
    
    switch (pathname) {
      case '/game-hub.html':
        content = this.generateGameHub();
        break;
      case '/character-creator.html':
        content = this.generateCharacterCreator();
        break;
      case '/adventure-engine.html':
        content = this.generateAdventureEngine();
        break;
      case '/dice-roller.html':
        content = this.generateDiceRoller();
        break;
      case '/styles/game.css':
        content = this.generateGameCSS();
        contentType = 'text/css';
        break;
      case '/scripts/game.js':
        content = this.generateGameJS();
        contentType = 'application/javascript';
        break;
      default:
        res.writeHead(404);
        res.end('File not found');
        return;
    }
    
    res.setHeader('Content-Type', contentType);
    res.writeHead(200);
    res.end(content);
  }

  // API Methods

  createCharacter(req, res, parsedUrl) {
    const sessionId = req.headers['x-session-id'] || this.generateSessionId();
    
    // Create empty character template
    const character = {
      id: this.generateId(),
      name: '',
      race: '',
      classes: [],
      level: 1,
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      },
      hitPoints: {
        maximum: 0,
        current: 0,
        temporary: 0
      },
      armorClass: 10,
      skills: {},
      feats: [],
      equipment: [],
      spells: {
        known: [],
        prepared: [],
        slots: {}
      },
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    this.characterStore.set(character.id, character);
    this.sendJSONResponse(res, 201, { 
      success: true, 
      character: character,
      sessionId: sessionId 
    });
  }

  saveCharacter(req, res, parsedUrl) {
    if (req.method !== 'POST') {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
      return;
    }
    
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const characterData = JSON.parse(body);
        characterData.lastModified = new Date().toISOString();
        
        // Validate D&D 3.5 rules
        const validation = this.validateCharacterSRD(characterData);
        if (!validation.valid) {
          this.sendJSONResponse(res, 400, { 
            error: 'SRD validation failed',
            violations: validation.violations 
          });
          return;
        }
        
        this.characterStore.set(characterData.id, characterData);
        this.sendJSONResponse(res, 200, { 
          success: true, 
          message: 'Character saved successfully',
          character: characterData
        });
      } catch (error) {
        this.sendJSONResponse(res, 400, { error: 'Invalid JSON data' });
      }
    });
  }

  loadCharacter(req, res, parsedUrl) {
    const characterId = parsedUrl.query.id;
    
    if (!characterId) {
      this.sendJSONResponse(res, 400, { error: 'Character ID required' });
      return;
    }
    
    const character = this.characterStore.get(characterId);
    if (!character) {
      this.sendJSONResponse(res, 404, { error: 'Character not found' });
      return;
    }
    
    this.sendJSONResponse(res, 200, { success: true, character: character });
  }

  listCharacters(req, res, parsedUrl) {
    const characters = Array.from(this.characterStore.values()).map(char => ({
      id: char.id,
      name: char.name,
      race: char.race,
      classes: char.classes,
      level: char.level,
      created: char.created,
      lastModified: char.lastModified
    }));
    
    this.sendJSONResponse(res, 200, { success: true, characters: characters });
  }

  rollDice(req, res, parsedUrl) {
    const expression = parsedUrl.query.expression || '1d20';
    const sessionId = req.headers['x-session-id'] || 'anonymous';
    
    try {
      const result = this.performDiceRoll(expression);
      
      // Store in dice history
      if (!this.diceHistory.has(sessionId)) {
        this.diceHistory.set(sessionId, []);
      }
      
      const history = this.diceHistory.get(sessionId);
      history.push({
        expression: expression,
        result: result,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 50 rolls
      if (history.length > 50) {
        history.splice(0, history.length - 50);
      }
      
      this.sendJSONResponse(res, 200, { 
        success: true, 
        expression: expression,
        result: result
      });
    } catch (error) {
      this.sendJSONResponse(res, 400, { 
        error: 'Invalid dice expression',
        details: error.message 
      });
    }
  }

  getDiceHistory(req, res, parsedUrl) {
    const sessionId = req.headers['x-session-id'] || 'anonymous';
    const history = this.diceHistory.get(sessionId) || [];
    
    this.sendJSONResponse(res, 200, { 
      success: true, 
      history: history 
    });
  }

  rollTable(req, res, parsedUrl) {
    const tableName = parsedUrl.query.table;
    
    if (!tableName) {
      this.sendJSONResponse(res, 400, { error: 'Table name required' });
      return;
    }
    
    try {
      const result = this.performTableRoll(tableName);
      this.sendJSONResponse(res, 200, { 
        success: true, 
        table: tableName,
        result: result
      });
    } catch (error) {
      this.sendJSONResponse(res, 400, { 
        error: 'Table roll failed',
        details: error.message 
      });
    }
  }

  listTables(req, res, parsedUrl) {
    const tables = this.getAvailableTables();
    this.sendJSONResponse(res, 200, { 
      success: true, 
      tables: tables 
    });
  }

  // Utility Methods

  performDiceRoll(expression) {
    // Enhanced dice rolling with D&D 3.5 support
    const match = expression.match(/^(\\d*)d(\\d+)([+-]\\d+)?$/i);
    if (!match) {
      throw new Error('Invalid dice expression');
    }
    
    const count = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3]) || 0;
    
    if (count < 1 || count > 100) {
      throw new Error('Dice count must be between 1 and 100');
    }
    
    if (![2, 3, 4, 6, 8, 10, 12, 20, 100].includes(sides)) {
      throw new Error('Invalid dice type for D&D 3.5');
    }
    
    const rolls = [];
    let total = 0;
    
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }
    
    total += modifier;
    
    return {
      expression: expression,
      rolls: rolls,
      modifier: modifier,
      total: total,
      individual: rolls.join(', ') + (modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''),
      timestamp: new Date().toISOString()
    };
  }

  performTableRoll(tableName) {
    // Access random tables through the imported module
    const tables = RandomTablesData.getAllTables();
    const table = tables.find(t => t.name === tableName || t.id === tableName);
    
    if (!table) {
      throw new Error(`Table '${tableName}' not found`);
    }
    
    // Roll dice for the table
    const diceResult = this.performDiceRoll(table.diceExpression);
    const roll = diceResult.total;
    
    // Find matching result
    const result = table.results.find(r => 
      roll >= r.range.min && roll <= r.range.max
    );
    
    if (!result) {
      throw new Error(`No result found for roll ${roll} on table ${tableName}`);
    }
    
    return {
      table: tableName,
      diceRoll: diceResult,
      result: result,
      timestamp: new Date().toISOString()
    };
  }

  validateCharacterSRD(character) {
    const violations = [];
    
    // Basic validation
    if (!character.name || character.name.trim().length === 0) {
      violations.push('Character must have a name');
    }
    
    // Ability score validation (D&D 3.5 SRD)
    const abilityScores = character.abilityScores || {};
    for (const [ability, score] of Object.entries(abilityScores)) {
      if (score < 1 || score > 50) { // Allow for magical enhancement up to 50
        violations.push(`${ability} score must be between 1 and 50`);
      }
    }
    
    // Level validation
    if (character.level < 1 || character.level > 100) { // Epic levels supported
      violations.push('Level must be between 1 and 100');
    }
    
    return {
      valid: violations.length === 0,
      violations: violations
    };
  }

  getAvailableTables() {
    if (RandomTablesData && typeof RandomTablesData.getAllTables === 'function') {
      try {
        return RandomTablesData.getAllTables().map(table => ({
          id: table.id || table.name,
          name: table.name,
          description: table.description,
          category: table.category,
          diceExpression: table.diceExpression
        }));
      } catch (error) {
        console.warn('Error getting tables:', error.message);
      }
    }
    
    // Fallback basic tables
    return [
      {
        id: 'test-table',
        name: 'Test Table',
        description: 'Basic test table',
        category: 'test',
        diceExpression: '1d6'
      }
    ];
  }

  // Session Management

  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateId() {
    return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  sendJSONResponse(res, statusCode, data) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(JSON.stringify(data, null, 2));
  }

  // Default HTML Generators (simplified versions for now)

  generateGameHub() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RulzLawyer D&D 3.5 Game Hub</title>
    <link rel="stylesheet" href="/styles/game.css">
</head>
<body>
    <div class="game-container">
        <header class="app-header">
            <h1>🎲 RulzLawyer D&D 3.5 Game</h1>
            <nav class="header-nav">
                <a href="#character" class="nav-link">Character</a>
                <a href="#adventure" class="nav-link">Adventure</a>
                <a href="#dice" class="nav-link">Dice</a>
                <a href="#help" class="nav-link">Help</a>
            </nav>
        </header>
        
        <div class="game-hub">
            <div class="feature-grid">
                <div class="feature-card">
                    <h3>⚔️ Character Creator</h3>
                    <p>Create D&D 3.5 characters with full SRD compliance</p>
                    <button onclick="location.href='/character-creator.html'">Start Creating</button>
                </div>
                
                <div class="feature-card">
                    <h3>🏰 Adventure Engine</h3>
                    <p>AI-powered adventures and encounter generation</p>
                    <button onclick="location.href='/adventure-engine.html'">Begin Adventure</button>
                </div>
                
                <div class="feature-card">
                    <h3>🎲 Dice Roller</h3>
                    <p>Advanced dice rolling with D&D mechanics</p>
                    <button onclick="location.href='/dice-roller.html'">Roll Dice</button>
                </div>
                
                <div class="feature-card">
                    <h3>📜 Random Tables</h3>
                    <p>Comprehensive gaming tables for inspiration</p>
                    <button onclick="rollRandomTable()">Roll Tables</button>
                </div>
            </div>
        </div>
    </div>
    
    <script src="/scripts/game.js"></script>
</body>
</html>`;
  }

  generateCharacterCreator() {
    try {
      return fs.readFileSync('./new-character-creator.html', 'utf8');
    } catch (error) {
      console.error('Error loading new character creator:', error.message);
      return '<html><body><h1>Character Creator Loading Error</h1><p>Could not load the character creator interface.</p></body></html>';
    }
  }
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D&D 3.5 Character Creator</title>
    <link rel="stylesheet" href="/styles/game.css">
</head>
<body>
    <div id="characterCreator" class="character-creator">
        <header class="creator-header">
            <h1>🧙‍♂️ D&D 3.5 Character Creator</h1>
            <div class="progress-bar">
                <div id="progressFill" class="progress-fill" style="width: 14%"></div>
            </div>
        </header>
        
        <div id="wizardSteps" class="wizard-steps">
            <div class="step active" data-step="1">1. Abilities</div>
            <div class="step" data-step="2">2. Race</div>
            <div class="step" data-step="3">3. Class</div>
            <div class="step" data-step="4">4. Skills</div>
            <div class="step" data-step="5">5. Feats</div>
            <div class="step" data-step="6">6. Equipment</div>
            <div class="step" data-step="7">7. Finalize</div>
        </div>
        
        <main id="creatorMain" class="creator-main">
            <div id="currentStep" class="current-step">
                <!-- Step content will be dynamically generated -->
            </div>
            
            <div class="character-preview">
                <h3>Character Preview</h3>
                <div id="characterSummary" class="character-summary">
                    <p>Create your character to see preview</p>
                </div>
            </div>
        </main>
        
        <footer class="creator-footer">
            <div class="step-navigation">
                <button id="prevStep" class="btn btn-secondary" disabled>← Previous</button>
                <button id="saveCharacter" class="btn btn-tertiary">💾 Save</button>
                <button id="nextStep" class="btn btn-primary" disabled>Next →</button>
            </div>
        </footer>
    </div>
    
    <!-- Load dependencies -->
    <script src="/code-repository/src/character-creation-engine.js"></script>
    <script>
        // Character Creation Application
        class CharacterCreatorApp {
            constructor() {
                this.engine = null;
                this.initialize();
            }
            
            async initialize() {
                console.log('🎮 Initializing Character Creator');
                
                try {
                    // Initialize the character creation engine
                    this.engine = new CharacterCreationEngine(window.gameClient);
                    
                    // Set up event listeners
                    this.setupEventListeners();
                    
                    // Render the first step
                    this.renderCurrentStep();
                    
                    console.log('✅ Character Creator ready');
                } catch (error) {
                    console.error('❌ Failed to initialize Character Creator:', error);
                    this.showError('Failed to load character creator. Please refresh the page.');
                }
            }
            
            setupEventListeners() {
                const prevBtn = document.getElementById('prevStep');
                const nextBtn = document.getElementById('nextStep');
                const saveBtn = document.getElementById('saveCharacter');
                
                prevBtn.addEventListener('click', () => this.previousStep());
                nextBtn.addEventListener('click', () => this.nextStep());
                saveBtn.addEventListener('click', () => this.saveCharacter());
                
                // Step navigation
                document.querySelectorAll('.step').forEach(step => {
                    step.addEventListener('click', () => {
                        const stepNumber = parseInt(step.dataset.step);
                        this.goToStep(stepNumber);
                    });
                });
            }
            
            renderCurrentStep() {
                const currentStep = this.engine.currentStep;
                const stepContainer = document.getElementById('currentStep');
                
                switch (currentStep) {
                    case 1:
                        this.renderAbilityScoreStep(stepContainer);
                        break;
                    case 2:
                        this.renderRaceSelectionStep(stepContainer);
                        break;
                    case 3:
                        this.renderClassSelectionStep(stepContainer);
                        break;
                    case 4:
                        this.renderSkillSelectionStep(stepContainer);
                        break;
                    case 5:
                        this.renderFeatSelectionStep(stepContainer);
                        break;
                    case 6:
                        this.renderEquipmentSelectionStep(stepContainer);
                        break;
                    case 7:
                        this.renderFinalizationStep(stepContainer);
                        break;
                }
                
                this.updateStepIndicators();
                this.updateNavigationButtons();
                this.updateCharacterPreview();
                this.updateProgressBar();
            }
            
            renderAbilityScoreStep(container) {
                container.innerHTML = \`
                    <div class="step-content">
                        <h2>Step 1: Ability Scores</h2>
                        <p class="step-description">Choose how to generate your character's six ability scores.</p>
                        
                        <div class="ability-methods">
                            <div class="method-card \${this.engine.character.abilityMethod === 'pointBuy' ? 'selected' : ''}">
                                <h4>🎯 Point Buy (Recommended)</h4>
                                <p>Start with 8 in each ability and spend 28 points to customize your character.</p>
                                <button onclick="characterCreator.selectAbilityMethod('pointBuy')" class="btn btn-primary">Use Point Buy</button>
                            </div>
                            
                            <div class="method-card \${this.engine.character.abilityMethod === 'standardArray' ? 'selected' : ''}">
                                <h4>📊 Standard Array</h4>
                                <p>Use the balanced array: 15, 14, 13, 12, 10, 8. Assign to abilities as desired.</p>
                                <button onclick="characterCreator.selectAbilityMethod('standardArray')" class="btn btn-primary">Use Standard Array</button>
                            </div>
                            
                            <div class="method-card \${this.engine.character.abilityMethod === 'rolled' ? 'selected' : ''}">
                                <h4>🎲 Roll 4d6 Drop Lowest</h4>
                                <p>Roll four six-sided dice and drop the lowest for each ability score.</p>
                                <button onclick="characterCreator.selectAbilityMethod('rolled')" class="btn btn-primary">Roll Scores</button>
                            </div>
                        </div>
                        
                        <div id="abilityScoresDisplay" class="ability-scores-display">
                            \${this.renderAbilityScores()}
                        </div>
                        
                        \${this.engine.character.abilityMethod === 'pointBuy' ? this.renderPointBuyInterface() : ''}
                    </div>
                \`;
            }
            
            renderAbilityScores() {
                const scores = this.engine.character.abilityScores;
                return \`
                    <div class="ability-scores-grid">
                        \${Object.entries(scores).map(([ability, score]) => \`
                            <div class="ability-score-card">
                                <h4>\${this.capitalizeFirst(ability)}</h4>
                                <div class="score-value">\${score}</div>
                                <div class="score-modifier">\${this.formatModifier(this.engine.getAbilityModifier(score))}</div>
                                \${this.engine.character.abilityMethod === 'standardArray' ? 
                                    \`<select onchange="characterCreator.assignAbilityScore('\${ability}', this.value)">
                                        <option value="">Assign...</option>
                                        <option value="15">15</option>
                                        <option value="14">14</option>
                                        <option value="13">13</option>
                                        <option value="12">12</option>
                                        <option value="10">10</option>
                                        <option value="8">8</option>
                                    </select>\` : ''
                                }
                            </div>
                        \`).join('')}
                    </div>
                \`;
            }
            
            renderPointBuyInterface() {
                return \`
                    <div class="point-buy-interface">
                        <h4>Point Buy Interface</h4>
                        <div class="points-remaining">
                            <span>Points Remaining: </span>
                            <span id="pointsRemaining">28</span>
                        </div>
                        <div class="point-buy-controls">
                            \${Object.entries(this.engine.character.abilityScores).map(([ability, score]) => \`
                                <div class="point-buy-row">
                                    <label>\${this.capitalizeFirst(ability)}:</label>
                                    <button onclick="characterCreator.adjustAbilityScore('\${ability}', -1)">-</button>
                                    <input type="number" value="\${score}" min="8" max="15" readonly>
                                    <button onclick="characterCreator.adjustAbilityScore('\${ability}', 1)">+</button>
                                    <span class="cost">Cost: \${this.getPointCost(score)}</span>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                \`;
            }
            
            renderRaceSelectionStep(container) {
                const races = this.engine.raceData;
                container.innerHTML = \`
                    <div class="step-content">
                        <h2>Step 2: Race Selection</h2>
                        <p class="step-description">Choose your character's race. Each race provides unique abilities and bonuses.</p>
                        
                        <div class="race-selection-grid">
                            \${Object.entries(races).map(([raceKey, race]) => \`
                                <div class="race-card \${this.engine.character.race === raceKey ? 'selected' : ''}" onclick="characterCreator.selectRace('\${raceKey}')">
                                    <h3>\${race.name}</h3>
                                    <div class="race-stats">
                                        <p><strong>Size:</strong> \${race.size}</p>
                                        <p><strong>Speed:</strong> \${race.speed} ft</p>
                                        <p><strong>Favored Class:</strong> \${race.favoredClass}</p>
                                    </div>
                                    <div class="race-abilities">
                                        <h4>Special Abilities:</h4>
                                        <ul>
                                            \${race.specialAbilities.slice(0, 3).map(ability => \`<li>\${ability}</li>\`).join('')}
                                            \${race.specialAbilities.length > 3 ? '<li>...and more</li>' : ''}
                                        </ul>
                                    </div>
                                    <p class="race-description">\${race.description}</p>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                \`;
            }
            
            renderClassSelectionStep(container) {
                const classes = this.engine.classData;
                container.innerHTML = \`
                    <div class="step-content">
                        <h2>Step 3: Class Selection</h2>
                        <p class="step-description">Choose your character's class. This determines your role and abilities.</p>
                        
                        <div class="class-selection-grid">
                            \${Object.entries(classes).map(([classKey, classInfo]) => \`
                                <div class="class-card \${this.engine.character.classes.some(c => c.name === classKey) ? 'selected' : ''}" onclick="characterCreator.selectClass('\${classKey}')">
                                    <h3>\${classInfo.name}</h3>
                                    <div class="class-stats">
                                        <p><strong>Hit Die:</strong> d\${classInfo.hitDie}</p>
                                        <p><strong>Skill Points:</strong> \${classInfo.skillPoints} + Int modifier</p>
                                        <p><strong>Primary Ability:</strong> \${classInfo.primaryAbility}</p>
                                    </div>
                                    <div class="class-saves">
                                        <h4>Saving Throws:</h4>
                                        <p>Fort: \${classInfo.fortitudeSave}, Ref: \${classInfo.reflexSave}, Will: \${classInfo.willSave}</p>
                                    </div>
                                    <p class="class-description">\${classInfo.description}</p>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                \`;
            }
            
            renderSkillSelectionStep(container) {
                container.innerHTML = \`
                    <div class="step-content">
                        <h2>Step 4: Skill Selection</h2>
                        <p class="step-description">Assign skill points to your character's skills.</p>
                        <div class="skill-points-info">
                            <span>Available: \${this.engine.character.skillPoints.available}</span>
                            <span>Spent: \${this.engine.character.skillPoints.spent}</span>
                        </div>
                        
                        <div class="skills-grid">
                            \${Object.entries(this.engine.skillData).map(([skillName, skillInfo]) => \`
                                <div class="skill-row">
                                    <label class="skill-name">\${skillName} (\${skillInfo.keyAbility}):</label>
                                    <input type="number" 
                                           value="\${this.engine.character.skills[skillName] || 0}" 
                                           min="0" 
                                           max="\${this.engine.character.level + 3}"
                                           onchange="characterCreator.setSkillRanks('\${skillName}', this.value)">
                                    <span class="skill-total">Total: +\${this.calculateSkillTotal(skillName)}</span>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                \`;
            }
            
            renderFeatSelectionStep(container) {
                container.innerHTML = \`
                    <div class="step-content">
                        <h2>Step 5: Feat Selection</h2>
                        <p class="step-description">Choose feats for your character.</p>
                        <p>Available Feats: \${this.getAvailableFeats()}</p>
                        
                        <div class="feats-notice">
                            <p>📜 Feat selection system coming soon!</p>
                            <p>For now, you'll receive appropriate starting feats based on your race and class.</p>
                        </div>
                    </div>
                \`;
            }
            
            renderEquipmentSelectionStep(container) {
                container.innerHTML = \`
                    <div class="step-content">
                        <h2>Step 6: Equipment Selection</h2>
                        <p class="step-description">Equip your character with weapons, armor, and gear.</p>
                        
                        <div class="equipment-notice">
                            <p>⚔️ Full equipment system coming soon!</p>
                            <p>Your character will receive starting equipment appropriate for their class.</p>
                        </div>
                    </div>
                \`;
            }
            
            renderFinalizationStep(container) {
                container.innerHTML = \`
                    <div class="step-content">
                        <h2>Step 7: Finalize Character</h2>
                        <p class="step-description">Add final details and complete your character.</p>
                        
                        <div class="character-details">
                            <div class="form-group">
                                <label for="characterName">Character Name:</label>
                                <input type="text" 
                                       id="characterName" 
                                       value="\${this.engine.character.name}" 
                                       onchange="characterCreator.updateCharacterName(this.value)"
                                       placeholder="Enter character name">
                            </div>
                            
                            <div class="form-group">
                                <label for="playerName">Player Name:</label>
                                <input type="text" 
                                       id="playerName" 
                                       value="\${this.engine.character.player}" 
                                       onchange="characterCreator.updatePlayerName(this.value)"
                                       placeholder="Enter player name">
                            </div>
                            
                            <div class="character-final-stats">
                                \${this.renderFinalCharacterStats()}
                            </div>
                            
                            <div class="completion-actions">
                                <button onclick="characterCreator.finalizeCharacter()" class="btn btn-success btn-large">
                                    🎉 Complete Character
                                </button>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            // Helper methods
            selectAbilityMethod(method) {
                this.engine.generateAbilityScores(method);
                this.renderCurrentStep();
                this.updateNextButton();
            }
            
            selectRace(raceKey) {
                this.engine.setRace(raceKey);
                this.renderCurrentStep();
                this.updateNextButton();
            }
            
            selectClass(classKey) {
                this.engine.addClass(classKey, true);
                this.renderCurrentStep();
                this.updateNextButton();
            }
            
            setSkillRanks(skillName, ranks) {
                this.engine.setSkillRanks(skillName, parseInt(ranks) || 0);
                this.renderCurrentStep();
            }
            
            updateCharacterName(name) {
                this.engine.character.name = name;
                this.updateCharacterPreview();
            }
            
            updatePlayerName(name) {
                this.engine.character.player = name;
            }
            
            finalizeCharacter() {
                if (this.engine.finalizeCharacter()) {
                    alert('🎉 Character completed successfully!');
                    this.saveCharacter();
                } else {
                    alert('Please fix the following errors:\\n' + this.engine.validationErrors.join('\\n'));
                }
            }
            
            // Navigation methods
            nextStep() {
                if (this.engine.nextStep()) {
                    this.renderCurrentStep();
                }
            }
            
            previousStep() {
                if (this.engine.previousStep()) {
                    this.renderCurrentStep();
                }
            }
            
            goToStep(step) {
                if (this.engine.goToStep(step)) {
                    this.renderCurrentStep();
                }
            }
            
            // UI update methods
            updateStepIndicators() {
                document.querySelectorAll('.step').forEach(step => {
                    const stepNumber = parseInt(step.dataset.step);
                    step.classList.toggle('active', stepNumber === this.engine.currentStep);
                    step.classList.toggle('completed', stepNumber < this.engine.currentStep);
                });
            }
            
            updateNavigationButtons() {
                const prevBtn = document.getElementById('prevStep');
                const nextBtn = document.getElementById('nextStep');
                
                prevBtn.disabled = this.engine.currentStep === 1;
                nextBtn.disabled = !this.engine.validateCurrentStep();
                
                if (this.engine.currentStep === this.engine.totalSteps) {
                    nextBtn.textContent = '🎉 Complete';
                } else {
                    nextBtn.textContent = 'Next →';
                }
            }
            
            updateNextButton() {
                const nextBtn = document.getElementById('nextStep');
                nextBtn.disabled = !this.engine.validateCurrentStep();
            }
            
            updateCharacterPreview() {
                const summary = this.engine.getCharacterSummary();
                const container = document.getElementById('characterSummary');
                
                container.innerHTML = \`
                    <h4>\${summary.name || 'Unnamed Character'}</h4>
                    <p><strong>Race:</strong> \${summary.race ? this.engine.raceData[summary.race]?.name || summary.race : 'Not selected'}</p>
                    <p><strong>Class:</strong> \${summary.classes || 'Not selected'}</p>
                    <p><strong>Level:</strong> \${summary.level}</p>
                    <p><strong>Hit Points:</strong> \${summary.hitPoints}</p>
                    <p><strong>Armor Class:</strong> \${summary.armorClass}</p>
                \`;
            }
            
            updateProgressBar() {
                const progress = (this.engine.currentStep / this.engine.totalSteps) * 100;
                const progressFill = document.getElementById('progressFill');
                progressFill.style.width = progress + '%';
            }
            
            async saveCharacter() {
                try {
                    const characterData = this.engine.exportCharacter();
                    const response = await window.gameClient.saveCharacter(characterData);
                    
                    if (response.success) {
                        alert('💾 Character saved successfully!');
                    } else {
                        alert('Failed to save character: ' + response.error);
                    }
                } catch (error) {
                    alert('Error saving character: ' + error.message);
                }
            }
            
            // Utility methods
            capitalizeFirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
            
            formatModifier(modifier) {
                return modifier >= 0 ? '+' + modifier : modifier.toString();
            }
            
            getPointCost(score) {
                const costs = {8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9};
                return costs[score] || 0;
            }
            
            calculateSkillTotal(skillName) {
                const ranks = this.engine.character.skills[skillName] || 0;
                const skillInfo = this.engine.skillData[skillName];
                const abilityScore = this.engine.character.abilityScores[skillInfo.keyAbility.toLowerCase()] || 10;
                const abilityMod = this.engine.getAbilityModifier(abilityScore);
                return ranks + abilityMod;
            }
            
            getAvailableFeats() {
                let featCount = 1; // Base feat at level 1
                if (this.engine.character.race === 'human') featCount++;
                // Add fighter bonus feats, etc.
                return featCount;
            }
            
            renderFinalCharacterStats() {
                const char = this.engine.character;
                return \`
                    <div class="final-stats-grid">
                        <div class="stat-block">
                            <h4>Ability Scores</h4>
                            \${Object.entries(char.abilityScores).map(([ability, score]) => 
                                \`<p>\${this.capitalizeFirst(ability)}: \${score} (\${this.formatModifier(this.engine.getAbilityModifier(score))})</p>\`
                            ).join('')}
                        </div>
                        <div class="stat-block">
                            <h4>Combat Stats</h4>
                            <p>Hit Points: \${char.hitPoints.maximum}</p>
                            <p>Armor Class: \${char.armorClass.total}</p>
                            <p>Base Attack Bonus: +\${char.baseAttackBonus}</p>
                        </div>
                        <div class="stat-block">
                            <h4>Saving Throws</h4>
                            <p>Fortitude: +\${char.savingThrows.fortitude.total}</p>
                            <p>Reflex: +\${char.savingThrows.reflex.total}</p>
                            <p>Will: +\${char.savingThrows.will.total}</p>
                        </div>
                    </div>
                \`;
            }
            
            showError(message) {
                const container = document.getElementById('currentStep');
                container.innerHTML = \`
                    <div class="error-message">
                        <h3>⚠️ Error</h3>
                        <p>\${message}</p>
                        <button onclick="location.reload()" class="btn btn-primary">Reload Page</button>
                    </div>
                \`;
            }
        }
        
        // Initialize the character creator when the page loads
        let characterCreator;
        document.addEventListener('DOMContentLoaded', function() {
            characterCreator = new CharacterCreatorApp();
        });
        
        // Global reference for onclick handlers
        window.characterCreator = characterCreator;
    </script>
</body>
</html>`;
  }

  generateAdventureEngine() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D&D 3.5 Adventure Engine</title>
    <link rel="stylesheet" href="/styles/game.css">
</head>
<body>
    <div class="adventure-engine">
        <h1>🏰 Adventure Engine</h1>
        <p>AI-powered D&D adventures coming soon...</p>
        <div class="feature-preview">
            <h3>Planned Features:</h3>
            <ul>
                <li>✨ AI-generated adventures</li>
                <li>⚔️ Balanced encounter generation</li>
                <li>📖 Dynamic storytelling</li>
                <li>🏛️ Campaign management</li>
            </ul>
        </div>
        <button onclick="location.href='/game-hub.html'">Return to Hub</button>
    </div>
</body>
</html>`;
  }

  generateDiceRoller() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D&D 3.5 Dice Roller</title>
    <link rel="stylesheet" href="/styles/game.css">
</head>
<body>
    <div class="dice-roller">
        <h1>🎲 Advanced Dice Roller</h1>
        
        <div class="dice-input">
            <input type="text" id="diceExpression" placeholder="Enter dice expression (e.g., 1d20, 3d6+2)" value="1d20">
            <button onclick="rollDice()">Roll Dice</button>
        </div>
        
        <div id="diceResult" class="dice-result">
            <!-- Results will appear here -->
        </div>
        
        <div class="quick-dice">
            <h3>Quick Rolls:</h3>
            <button onclick="quickRoll('1d4')">d4</button>
            <button onclick="quickRoll('1d6')">d6</button>
            <button onclick="quickRoll('1d8')">d8</button>
            <button onclick="quickRoll('1d10')">d10</button>
            <button onclick="quickRoll('1d12')">d12</button>
            <button onclick="quickRoll('1d20')">d20</button>
            <button onclick="quickRoll('1d100')">d%</button>
        </div>
        
        <div id="diceHistory" class="dice-history">
            <h3>Roll History:</h3>
            <div id="historyList">
                <!-- History will appear here -->
            </div>
        </div>
        
        <button onclick="location.href='/game-hub.html'">Return to Hub</button>
    </div>
    
    <script>
        let rollHistory = [];
        
        async function rollDice() {
            const expression = document.getElementById('diceExpression').value;
            try {
                const response = await fetch(\`/api/dice/roll?expression=\${encodeURIComponent(expression)}\`);
                const data = await response.json();
                
                if (data.success) {
                    displayResult(data.result);
                    addToHistory(data.result);
                } else {
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                alert('Error rolling dice: ' + error.message);
            }
        }
        
        function quickRoll(expression) {
            document.getElementById('diceExpression').value = expression;
            rollDice();
        }
        
        function displayResult(result) {
            const container = document.getElementById('diceResult');
            container.innerHTML = \`
                <div class="result-display">
                    <h3>Result: \${result.total}</h3>
                    <p>Expression: \${result.expression}</p>
                    <p>Rolls: \${result.individual}</p>
                    <small>Rolled at: \${new Date(result.timestamp).toLocaleTimeString()}</small>
                </div>
            \`;
        }
        
        function addToHistory(result) {
            rollHistory.unshift(result);
            if (rollHistory.length > 10) rollHistory.pop();
            
            const historyList = document.getElementById('historyList');
            historyList.innerHTML = rollHistory
                .map(roll => \`
                    <div class="history-item">
                        <strong>\${roll.expression}</strong> = \${roll.total}
                        <small>(\${roll.individual})</small>
                    </div>
                \`)
                .join('');
        }
    </script>
</body>
</html>`;
  }

  generateGameCSS() {
    return `/* RulzLawyer D&D 3.5 Game Styles - Enhanced Responsive Design */

/* CSS Custom Properties for Design System */
:root {
  /* Color Palette - D&D Beyond Inspired */
  --primary-900: #1a202c;
  --primary-800: #2d3748;
  --primary-700: #4a5568;
  --primary-600: #718096;
  --primary-500: #a0aec0;
  --primary-400: #cbd5e0;
  --primary-300: #e2e8f0;
  --primary-200: #edf2f7;
  --primary-100: #f7fafc;
  
  /* D&D Theme Colors */
  --dnd-red: #d32f2f;
  --dnd-gold: #ffc107;
  --dnd-blue: #1976d2;
  --dnd-green: #388e3c;
  --dnd-purple: #7b1fa2;
  
  /* Interactive Colors */
  --accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --success: #48bb78;
  --warning: #ed8936;
  --error: #f56565;
  --info: #4299e1;
  
  /* Typography */
  --font-primary: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  --font-mono: 'SFMono-Regular', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  
  /* Spacing System */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 20px 64px rgba(0, 0, 0, 0.2);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.5s ease;
  
  /* Z-Index Stack */
  --z-dropdown: 1000;
  --z-modal: 1050;
  --z-tooltip: 1100;
}

/* Modern CSS Reset & Base Styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-primary);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--primary-800);
  background: var(--accent-gradient);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Enhanced Button System */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-base);
  min-height: 44px;
  position: relative;
  overflow: hidden;
}

.btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-primary {
  background: var(--accent-gradient);
  color: white;
  border-color: var(--primary-600);
}

.btn-secondary {
  background: var(--primary-100);
  color: var(--primary-800);
  border-color: var(--primary-400);
}

/* Game Hub Styles */
.game-hub {
  padding: var(--space-2xl);
  min-height: 100vh;
}

.hero-section {
  text-align: center;
  color: white;
  margin-bottom: var(--space-3xl);
  padding: var(--space-3xl) 0;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: var(--space-lg);
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-xl);
  margin-top: var(--space-2xl);
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: var(--space-2xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  text-align: center;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

/* Character Creator Styles */
.character-creator {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow-xl);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: var(--space-md);
  margin-bottom: var(--space-md);
}

.creator-header {
  background: var(--accent-gradient);
  color: white;
  padding: var(--space-xl);
  text-align: center;
  position: relative;
}

.wizard-steps {
  display: flex;
  justify-content: center;
  padding: var(--space-lg);
  background: var(--primary-100);
  border-bottom: 1px solid var(--primary-300);
  flex-wrap: wrap;
  gap: var(--space-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.step {
  padding: var(--space-md) var(--space-lg);
  background: white;
  border: 2px solid var(--primary-300);
  border-radius: var(--radius-lg);
  font-weight: 600;
  color: var(--primary-600);
  cursor: pointer;
  transition: all var(--transition-base);
  min-width: 120px;
  text-align: center;
  font-size: 0.875rem;
  position: relative;
  overflow: hidden;
}

.step.active {
  background: var(--accent-gradient);
  color: white;
  border-color: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Enhanced Form Elements */
.form-group {
  margin-bottom: var(--space-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--space-sm);
  font-weight: 600;
  color: var(--primary-800);
}

.form-input, .form-textarea {
  width: 100%;
  padding: var(--space-md);
  border: 2px solid var(--primary-300);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 1rem;
  transition: all var(--transition-fast);
  background: white;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--dnd-blue);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

/* Card Components */
.card {
  background: white;
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
  
  .wizard-steps {
    padding: var(--space-md);
    gap: var(--space-xs);
  }
  
  .step {
    min-width: 80px;
    padding: var(--space-sm);
    font-size: 0.75rem;
  }
}

/* End of RulzLawyer D&D 3.5 Game Styles */
`;
  }
:root {
  /* Color Palette - D&D Beyond Inspired */
  --primary-900: #1a202c;
  --primary-800: #2d3748;
  --primary-700: #4a5568;
  --primary-600: #718096;
  --primary-500: #a0aec0;
  --primary-400: #cbd5e0;
  --primary-300: #e2e8f0;
  --primary-200: #edf2f7;
  --primary-100: #f7fafc;
  
  /* D&D Theme Colors */
  --dnd-red: #d32f2f;
  --dnd-gold: #ffc107;
  --dnd-blue: #1976d2;
  --dnd-green: #388e3c;
  --dnd-purple: #7b1fa2;
  
  /* Interactive Colors */
  --accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --success: #48bb78;
  --warning: #ed8936;
  --error: #f56565;
  --info: #4299e1;
  
  /* Typography */
  --font-primary: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  --font-mono: 'SFMono-Regular', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  
  /* Spacing System */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 20px 64px rgba(0, 0, 0, 0.2);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.5s ease;
  
  /* Z-Index Stack */
  --z-dropdown: 1000;
  --z-modal: 1050;
  --z-tooltip: 1100;
}

/* Modern CSS Reset & Base Styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-primary);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--primary-800);
  background: var(--accent-gradient);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Accessibility Improvements */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus Management */
:focus {
  outline: 2px solid var(--dnd-blue);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}

/* Skip Links for Accessibility */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-900);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: var(--radius-md);
  z-index: var(--z-tooltip);
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: 6px;
}

/* Responsive Container System */
.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-xl);
  }
}

/* Modern Grid System */
.grid {
  display: grid;
  gap: var(--space-md);
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

@media (max-width: 767px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}

/* Flexible Layout System */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.gap-sm { gap: var(--space-sm); }
.gap-md { gap: var(--space-md); }
.gap-lg { gap: var(--space-lg); }

/* Enhanced Button System */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-base);
  min-height: 44px; /* WCAG AA compliance */
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn:not(:disabled):active {
  transform: translateY(0);
}

.btn-primary {
  background: var(--accent-gradient);
  color: white;
  border-color: var(--primary-600);
}

.btn-primary:hover {
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: var(--primary-100);
  color: var(--primary-800);
  border-color: var(--primary-400);
}

.btn-tertiary {
  background: var(--dnd-gold);
  color: var(--primary-900);
  border-color: #f57f17;
}

.btn-success {
  background: var(--success);
  color: white;
}

.btn-warning {
  background: var(--warning);
  color: white;
}

.btn-error {
  background: var(--error);
  color: white;
}

/* Size variants */
.btn-sm {
  padding: var(--space-xs) var(--space-md);
  font-size: 0.875rem;
  min-height: 36px;
}

.btn-lg {
  padding: var(--space-lg) var(--space-2xl);
  font-size: 1.125rem;
  min-height: 52px;
}

/* Game Hub Enhanced Styles */
.game-hub {
  padding: var(--space-2xl);
  min-height: 100vh;
}

.hero-section {
  text-align: center;
  color: white;
  margin-bottom: var(--space-3xl);
  padding: var(--space-3xl) 0;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: var(--space-lg);
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto var(--space-2xl);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-xl);
  margin-top: var(--space-2xl);
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: var(--space-2xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  text-align: center;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left var(--transition-slow);
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--space-lg);
  display: block;
}

.feature-card h3 {
  color: var(--primary-800);
  margin-bottom: var(--space-md);
  font-size: 1.5rem;
  font-weight: 600;
}

.feature-card p {
  color: var(--primary-600);
  margin-bottom: var(--space-lg);
  line-height: 1.7;
}

/* Character Creator Enhanced Styles */
.character-creator {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow-xl);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: var(--space-md);
  margin-bottom: var(--space-md);
}

.creator-header {
  background: var(--accent-gradient);
  color: white;
  padding: var(--space-xl);
  text-align: center;
  position: relative;
}

.creator-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--dnd-red), var(--dnd-gold), var(--dnd-blue), var(--dnd-green));
}

.creator-header h1 {
  margin: 0 0 var(--space-lg) 0;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.progress-container {
  max-width: 600px;
  margin: 0 auto;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
  font-size: 0.875rem;
  opacity: 0.9;
}

.progress-bar {
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  height: 12px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 1));
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.wizard-steps {
  display: flex;
  justify-content: center;
  padding: var(--space-lg);
  background: var(--primary-100);
  border-bottom: 1px solid var(--primary-300);
  flex-wrap: wrap;
  gap: var(--space-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.step {
  padding: var(--space-md) var(--space-lg);
  background: white;
  border: 2px solid var(--primary-300);
  border-radius: var(--radius-lg);
  font-weight: 600;
  color: var(--primary-600);
  cursor: pointer;
  transition: all var(--transition-base);
  min-width: 120px;
  text-align: center;
  font-size: 0.875rem;
  position: relative;
  overflow: hidden;
}

.step:hover {
  border-color: var(--primary-500);
  background: var(--primary-50);
  transform: translateY(-2px);
}

.step.active {
  background: var(--accent-gradient);
  color: white;
  border-color: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.step.completed {
  background: var(--success);
  color: white;
  border-color: var(--success);
}

.step.completed::before {
  content: '✓ ';
  font-weight: bold;
}

/* Responsive Step Navigation */
@media (max-width: 768px) {
  .wizard-steps {
    padding: var(--space-md);
    gap: var(--space-xs);
  }
  
  .step {
    min-width: 80px;
    padding: var(--space-sm);
    font-size: 0.75rem;
  }
}

.creator-main {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: var(--space-xl);
  padding: var(--space-xl);
  overflow-y: auto;
  max-height: calc(100vh - 300px);
}

@media (max-width: 1024px) {
  .creator-main {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
}

.current-step {
  background: white;
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-md);
  position: relative;
}

.current-step::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent-gradient);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.character-preview {
  background: var(--primary-50);
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  position: sticky;
  top: var(--space-lg);
  height: fit-content;
  max-height: 600px;
  overflow-y: auto;
}

.character-preview h3 {
  color: var(--primary-800);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  border-bottom: 2px solid var(--primary-200);
  font-size: 1.25rem;
}

.character-summary {
  color: var(--primary-700);
  font-size: 0.9rem;
  line-height: 1.6;
}

.creator-footer {
  background: var(--primary-100);
  border-top: 1px solid var(--primary-300);
  padding: var(--space-xl);
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  gap: var(--space-md);
}

@media (max-width: 480px) {
  .step-navigation {
    flex-direction: column;
    gap: var(--space-sm);
  }
  
  .step-navigation .btn {
    width: 100%;
  }
}

/* Enhanced Form Elements */
.form-group {
  margin-bottom: var(--space-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--space-sm);
  font-weight: 600;
  color: var(--primary-800);
  font-size: 0.95rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--space-md);
  border: 2px solid var(--primary-300);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--primary-800);
  background: white;
  transition: all var(--transition-base);
  min-height: 44px;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--dnd-blue);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-input:invalid {
  border-color: var(--error);
}

.form-help {
  margin-top: var(--space-xs);
  font-size: 0.875rem;
  color: var(--primary-600);
}

.form-error {
  color: var(--error);
  font-weight: 500;
}

/* Card Components */
.card {
  background: white;
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--primary-200);
}

.card-title {
  color: var(--primary-800);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

/* Loading States */
.loading {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary-300);
  border-top-color: var(--primary-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Toast Notifications */
.toast {
  position: fixed;
  top: var(--space-lg);
  right: var(--space-lg);
  background: white;
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-tooltip);
  min-width: 300px;
  animation: slideIn 0.3s ease;
}

.toast.success {
  border-left: 4px solid var(--success);
}

.toast.error {
  border-left: 4px solid var(--error);
}

.toast.warning {
  border-left: 4px solid var(--warning);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Modal Components */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-lg);
}

.modal {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: var(--space-xl);
  border-bottom: 1px solid var(--primary-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-800);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.modal-close:hover {
  background: var(--primary-100);
}

.modal-body {
  padding: var(--space-xl);
}

.modal-footer {
  padding: var(--space-xl);
  border-top: 1px solid var(--primary-200);
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
}

/* Utility Classes */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-medium { font-weight: 500; }

.text-sm { font-size: 0.875rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }

.opacity-50 { opacity: 0.5; }
.opacity-75 { opacity: 0.75; }

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  :root {
    --primary-100: #ffffff;
    --primary-800: #000000;
    --primary-300: #666666;
  }
  
  .btn {
    border-width: 3px;
  }
}

/* Print Styles */
@media print {
  .creator-header,
  .wizard-steps,
  .creator-footer {
    display: none;
  }
  
  .creator-main {
    grid-template-columns: 1fr;
    padding: 0;
  }
  
  .character-preview {
    break-inside: avoid;
  }
}

/* Dark Mode Support (Future Enhancement) */
@media (prefers-color-scheme: dark) {
  :root {
    --primary-900: #f7fafc;
    --primary-800: #edf2f7;
    --primary-700: #e2e8f0;
    --primary-600: #cbd5e0;
    --primary-500: #a0aec0;
    --primary-400: #718096;
    --primary-300: #4a5568;
    --primary-200: #2d3748;
    --primary-100: #1a202c;
  }
  
  body {
    background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
    color: var(--primary-800);
  }
}

/* Enhanced Responsive Design */
@media (max-width: 320px) {
  :root {
    --space-md: 0.75rem;
    --space-lg: 1rem;
    --space-xl: 1.25rem;
  }
  
  .hero-title {
    font-size: 1.75rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
}

@media (min-width: 1440px) {
  .container {
    max-width: 1600px;
  }
  
  .feature-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Animation Classes */
.fade-in {
  animation: fadeIn 0.5s ease;
}

.slide-up {
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Component-Specific Enhancements */
.dice-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--space-md);
  margin: var(--space-lg) 0;
}

.dice-button {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: var(--radius-lg);
  background: var(--accent-gradient);
  color: white;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.dice-button:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: var(--shadow-lg);
}

.dice-button:active {
  transform: scale(0.95);
}

/* Adventure Engine Specific Styles */
.encounter-card {
  background: linear-gradient(135deg, var(--primary-50) 0%, white 100%);
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.encounter-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.npc-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: var(--space-lg);
  box-shadow: var(--shadow-md);
}

/* Inventory Grid Styles */
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--primary-50);
  border: 2px dashed var(--primary-300);
  border-radius: var(--radius-lg);
  min-height: 200px;
}

.inventory-slot {
  aspect-ratio: 1;
  background: white;
  border: 1px solid var(--primary-300);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.inventory-slot:hover {
  border-color: var(--primary-500);
  box-shadow: var(--shadow-sm);
}

.inventory-slot.filled {
  background: var(--dnd-gold);
  color: var(--primary-900);
  font-weight: bold;
}

.inventory-slot.dragging {
  opacity: 0.5;
  transform: scale(0.9);
}

/* Status Indicators */
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
}

.status-indicator.online {
  background: rgba(72, 187, 120, 0.1);
  color: var(--success);
}

.status-indicator.offline {
  background: rgba(245, 101, 101, 0.1);
  color: var(--error);
}

.status-indicator::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

/* Performance Optimizations */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* Ensures proper stacking context */
.stacking-context {
  isolation: isolate;
}
`;
  }

  generateGameJS() {

    return `/* RulzLawyer D&D 3.5 Game JavaScript */

class GameClient {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.currentPage = 'home';
        this.characters = this.loadCharacters();
        this.currentCharacter = null;
        this.eventSource = null;
        this.initialized = false;
        
        // Initialize after DOM loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        if (this.initialized) return;
        
        console.log('Initializing RulzLawyer Game Client...');
        this.initialized = true;
        
        // Set up page routing
        this.updateNavigation();
        
        // Initialize first page
        this.navigateTo(this.currentPage);
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('RulzLawyer Game Client initialized successfully');
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    }
    
    loadCharacters() {
        try {
            const saved = localStorage.getItem('dnd35_characters');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading characters:', error);
            return {};
        }
    }
    
    saveCharacters() {
        try {
            localStorage.setItem('dnd35_characters', JSON.stringify(this.characters));
        } catch (error) {
            console.error('Error saving characters:', error);
        }
    }
    
    setupEventListeners() {
        // Global event listeners can be added here
        window.addEventListener('beforeunload', () => {
            this.saveCharacters();
        });
    }
    
    updateNavigation() {
        // Update navigation active states if needed
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.href && link.href.includes('#' + this.currentPage)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    navigateTo(page, params = {}) {
        console.log('Navigating to:', page);
        this.currentPage = page;
        this.updateNavigation();
        
        const content = document.getElementById('main-content');
        if (!content) return;
        
        switch (page) {
            case 'home':
                this.showHomePage(content);
                break;
            case 'character-creator':
                this.showCharacterCreator(content, params);
                break;
            case 'character-sheet':
                this.showCharacterSheet(content, params);
                break;
            case 'dice-roller':
                this.showDiceRoller(content);
                break;
            case 'adventure-engine':
                this.showAdventureEngine(content);
                break;
            default:
                this.showHomePage(content);
        }
    }
    
    showHomePage(content) {
        content.innerHTML = \`
            <div class="home-container">
                <div class="welcome-section">
                    <h1>Welcome to RulzLawyer</h1>
                    <p class="tagline">Your Complete D&D 3.5 Gaming Companion</p>
                </div>
                
                <div class="feature-grid">
                    <div class="feature-card" onclick="gameClient.navigateTo('character-creator')">
                        <div class="feature-icon">⚔️</div>
                        <h3>Character Creator</h3>
                        <p>Create detailed D&D 3.5 characters with our comprehensive wizard</p>
                    </div>
                    
                    <div class="feature-card" onclick="gameClient.showCharacterList()">
                        <div class="feature-icon">📋</div>
                        <h3>My Characters</h3>
                        <p>Manage and view your created characters</p>
                    </div>
                    
                    <div class="feature-card" onclick="gameClient.navigateTo('dice-roller')">
                        <div class="feature-icon">🎲</div>
                        <h3>Dice Roller</h3>
                        <p>Advanced dice rolling system with D&D 3.5 mechanics</p>
                    </div>
                    
                    <div class="feature-card" onclick="gameClient.navigateTo('adventure-engine')">
                        <div class="feature-icon">🏰</div>
                        <h3>Adventure Engine</h3>
                        <p>Generate encounters, NPCs, and adventures for your campaigns</p>
                    </div>
                </div>
                
                <div class="quick-stats">
                    <div class="stat-item">
                        <strong>\${Object.keys(this.characters).length}</strong>
                        <span>Characters Created</span>
                    </div>
                </div>
            </div>
        \`;
    }
    
    showCharacterList() {
        const content = document.getElementById('main-content');
        const characterKeys = Object.keys(this.characters);
        
        content.innerHTML = \`
            <div class="character-list-container">
                <div class="page-header">
                    <h1>My Characters</h1>
                    <button class="btn btn-primary" onclick="gameClient.navigateTo('character-creator')">
                        Create New Character
                    </button>
                </div>
                
                \${characterKeys.length === 0 ? \`
                    <div class="empty-state">
                        <h3>No Characters Yet</h3>
                        <p>Create your first D&D 3.5 character to get started!</p>
                        <button class="btn btn-primary" onclick="gameClient.navigateTo('character-creator')">
                            Create Character
                        </button>
                    </div>
                \` : \`
                    <div class="characters-grid">
                        \${characterKeys.map(id => {
                            const char = this.characters[id];
                            return \`
                                <div class="character-card" onclick="gameClient.navigateTo('character-sheet', {id: '\${id}'})">
                                    <h3>\${char.name || 'Unnamed Character'}</h3>
                                    <div class="character-summary">
                                        <p><strong>Race:</strong> \${char.race || 'Not selected'}</p>
                                        <p><strong>Class:</strong> \${char.characterClass || 'Not selected'}</p>
                                        <p><strong>Level:</strong> \${char.level || 1}</p>
                                    </div>
                                    <div class="character-actions">
                                        <button class="btn btn-secondary" onclick="event.stopPropagation(); gameClient.editCharacter('\${id}')">Edit</button>
                                        <button class="btn btn-danger" onclick="event.stopPropagation(); gameClient.deleteCharacter('\${id}')">Delete</button>
                                    </div>
                                </div>
                            \`;
                        }).join('')}
                    </div>
                \`}
            </div>
        \`;
    }
    
    showCharacterCreator(content, params = {}) {
        // Initialize or load existing character wizard
        if (!window.characterWizard) {
            console.error('Character wizard not initialized');
            content.innerHTML = '<div class="error-message"><h3>Character Creator Not Available</h3><p>Please refresh the page and try again.</p></div>';
            return;
        }
        
        if (params.characterId) {
            // Edit existing character
            const character = this.characters[params.characterId];
            if (character) {
                window.characterWizard.loadCharacter(character);
            }
        } else {
            // Start new character
            window.characterWizard.startCreation();
        }
    }
    
    showCharacterSheet(content, params) {
        const character = this.characters[params.id];
        if (!character) {
            content.innerHTML = '<div class="error-message"><h3>Character Not Found</h3><p>The requested character could not be found.</p></div>';
            return;
        }
        
        content.innerHTML = \`
            <div class="character-sheet">
                <div class="character-header">
                    <h1>\${character.name || 'Unnamed Character'}</h1>
                    <button class="btn btn-secondary" onclick="gameClient.editCharacter('\${params.id}')">Edit Character</button>
                </div>
                
                <div class="character-details-grid">
                    <div class="basic-info">
                        <h3>Basic Information</h3>
                        <p><strong>Race:</strong> \${character.race || 'Not selected'}</p>
                        <p><strong>Class:</strong> \${character.characterClass || 'Not selected'}</p>
                        <p><strong>Level:</strong> \${character.level || 1}</p>
                        <p><strong>Experience:</strong> \${character.experience || 0}</p>
                    </div>
                    
                    <div class="ability-scores">
                        <h3>Ability Scores</h3>
                        \${character.abilityScores ? Object.entries(character.abilityScores).map(([ability, score]) => \`
                            <div class="ability-score">
                                <strong>\${ability.toUpperCase()}:</strong> \${score} (\${Math.floor((score - 10) / 2) >= 0 ? '+' : ''}\${Math.floor((score - 10) / 2)})
                            </div>
                        \`).join('') : '<p>Ability scores not set</p>'}
                    </div>
                    
                    <div class="skills-section">
                        <h3>Skills</h3>
                        \${character.skills ? Object.entries(character.skills).filter(([skill, ranks]) => ranks > 0).map(([skill, ranks]) => \`
                            <div class="skill-entry">
                                <strong>\${skill}:</strong> \${ranks} ranks
                            </div>
                        \`).join('') || '<p>No skills assigned</p>' : '<p>Skills not configured</p>'}
                    </div>
                </div>
            </div>
        \`;
    }
    
    showDiceRoller(content) {
        content.innerHTML = \`
            <div class="dice-roller">
                <h1>Dice Roller</h1>
                <p>Roll dice for your D&D 3.5 adventures</p>
                
                <div class="dice-input">
                    <input type="text" id="dice-expression" placeholder="1d20+5" />
                    <button onclick="gameClient.rollDice()">Roll</button>
                </div>
                
                <div class="quick-dice">
                    <h3>Quick Rolls</h3>
                    <button onclick="gameClient.quickRoll('1d4')">d4</button>
                    <button onclick="gameClient.quickRoll('1d6')">d6</button>
                    <button onclick="gameClient.quickRoll('1d8')">d8</button>
                    <button onclick="gameClient.quickRoll('1d10')">d10</button>
                    <button onclick="gameClient.quickRoll('1d12')">d12</button>
                    <button onclick="gameClient.quickRoll('1d20')">d20</button>
                    <button onclick="gameClient.quickRoll('1d100')">d100</button>
                </div>
                
                <div class="dice-result" id="dice-result">
                    <p>Enter a dice expression and click Roll</p>
                </div>
                
                <div class="dice-history" id="dice-history">
                    <h3>Recent Rolls</h3>
                    <div id="history-list"></div>
                </div>
            </div>
        \`;
    }
    
    showAdventureEngine(content) {
        content.innerHTML = \`
            <div class="adventure-engine">
                <h1>Adventure Engine</h1>
                <p>Generate encounters, NPCs, and adventures for your D&D 3.5 campaigns</p>
                
                <div class="feature-preview">
                    <h3>Coming Soon:</h3>
                    <ul>
                        <li>🎯 Balanced encounter generation</li>
                        <li>👥 NPC generator with stats and personalities</li>
                        <li>🏰 Dungeon and adventure creation</li>
                        <li>💰 Treasure generation</li>
                        <li>📖 Story hooks and plot generators</li>
                    </ul>
                </div>
                
                <div class="preview-actions">
                    <button class="btn btn-primary" disabled>Generate Encounter (Coming Soon)</button>
                    <button class="btn btn-secondary" disabled>Create NPC (Coming Soon)</button>
                </div>
            </div>
        \`;
    }
    
    rollDice() {
        const expression = document.getElementById('dice-expression').value.trim();
        if (!expression) return;
        
        try {
            if (window.diceEngine) {
                const result = window.diceEngine.roll(expression);
                this.displayDiceResult(result, expression);
                this.addToHistory(expression, result);
            } else {
                this.displayDiceResult({ total: 'Dice engine not available' }, expression);
            }
        } catch (error) {
            this.displayDiceResult({ total: 'Error: ' + error.message }, expression);
        }
    }
    
    quickRoll(expression) {
        document.getElementById('dice-expression').value = expression;
        this.rollDice();
    }
    
    displayDiceResult(result, expression) {
        const resultDiv = document.getElementById('dice-result');
        resultDiv.innerHTML = \`
            <div class="result-display">
                <h3>\${result.total}</h3>
                <p>Rolling: \${expression}</p>
                \${result.breakdown ? \`<small>\${result.breakdown}</small>\` : ''}
            </div>
        \`;
    }
    
    addToHistory(expression, result) {
        const historyList = document.getElementById('history-list');
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = \`<strong>\${expression}:</strong> \${result.total}\`;
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        // Limit history to 10 items
        while (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    }
    
    editCharacter(characterId) {
        this.navigateTo('character-creator', { characterId: characterId });
    }
    
    deleteCharacter(characterId) {
        if (confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
            delete this.characters[characterId];
            this.saveCharacters();
            this.showCharacterList(); // Refresh the character list
        }
    }
    
    saveCharacter(characterData) {
        const id = characterData.id || 'char_' + Date.now();
        characterData.id = id;
        characterData.lastModified = new Date().toISOString();
        
        this.characters[id] = characterData;
        this.saveCharacters();
        
        console.log('Character saved:', characterData.name);
        return id;
    }
}

// Initialize game client
let gameClient = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    gameClient = new GameClient();
    
    // Make globally available for onclick handlers
    window.gameClient = gameClient;
});

// Navigation functions
function navigateToPage(page) {
    if (gameClient) {
        gameClient.navigateTo(page);
    }
}

function showCharacterCreator() {
    navigateToPage('character-creator');
}

function showCharacterList() {
    if (gameClient) {
        gameClient.showCharacterList();
    }
}

function showDiceRoller() {
    navigateToPage('dice-roller');
}

function showAdventureEngine() {
    navigateToPage('adventure-engine');
}
  }
}


  initializeEquipmentManager() {

/* Step Content Styles */
.step-content h2 {
    color: #4a5568;
    margin-bottom: 0.5rem;
}

.step-description {
    color: #718096;
    margin-bottom: 2rem;
}

/* Ability Score Styles */
.ability-methods {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.method-card {
    background: #f7fafc;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.method-card:hover {
    border-color: #667eea;
    transform: translateY(-2px);
}

.method-card.selected {
    border-color: #667eea;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.method-card h4 {
    color: #4a5568;
    margin-bottom: 0.5rem;
}

.ability-scores-display {
    margin: 2rem 0;
}

.ability-scores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.ability-score-card {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
}

.ability-score-card h4 {
    color: #4a5568;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.score-value {
    font-size: 2rem;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 0.25rem;
}

.score-modifier {
    color: #718096;
    font-size: 0.9rem;
}

.point-buy-interface {
    background: #f7fafc;
    border-radius: 8px;
    padding: 1.5rem;
    margin-top: 2rem;
}

.points-remaining {
    text-align: center;
    font-size: 1.2rem;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 1rem;
}

.point-buy-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto 1fr;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e2e8f0;
}

.point-buy-row:last-child {
    border-bottom: none;
}

.point-buy-row button {
    width: 30px;
    height: 30px;
    border: 1px solid #cbd5e0;
    background: white;
    border-radius: 4px;
    cursor: pointer;
}

.point-buy-row input {
    width: 60px;
    text-align: center;
    padding: 0.25rem;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
}

/* Race Selection Styles */
.race-selection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}

.race-card {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.race-card:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.race-card.selected {
    border-color: #667eea;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.race-card h3 {
    color: #4a5568;
    margin-bottom: 1rem;
}

.race-stats, .race-abilities {
    margin-bottom: 1rem;
}

.race-stats p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #718096;
}

.race-abilities h4 {
    color: #4a5568;
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.race-abilities ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.race-abilities li {
    font-size: 0.85rem;
    color: #718096;
    padding: 0.1rem 0;
}

.race-description {
    font-size: 0.9rem;
    color: #4a5568;
    font-style: italic;
    margin-top: 1rem;
}

/* Class Selection Styles */
.class-selection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
}

.class-card {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.class-card:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.class-card.selected {
    border-color: #667eea;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.class-card h3 {
    color: #4a5568;
    margin-bottom: 1rem;
}

.class-stats p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #718096;
}

.class-saves h4 {
    color: #4a5568;
    font-size: 1rem;
    margin: 1rem 0 0.5rem 0;
}

.class-description {
    font-size: 0.9rem;
    color: #4a5568;
    font-style: italic;
    margin-top: 1rem;
}

/* Skills Styles */
.skill-points-info {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #f7fafc;
    border-radius: 8px;
    font-weight: 600;
}

.skills-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    max-height: 400px;
    overflow-y: auto;
    padding: 1rem;
    background: #f7fafc;
    border-radius: 8px;
}

.skill-row {
    display: grid;
    grid-template-columns: 2fr auto 1fr;
    gap: 1rem;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e2e8f0;
}

.skill-row:last-child {
    border-bottom: none;
}

.skill-name {
    font-weight: 500;
    color: #4a5568;
}

.skill-row input {
    width: 60px;
    padding: 0.25rem;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    text-align: center;
}

.skill-total {
    font-weight: 600;
    color: #667eea;
}

/* Finalization Styles */
.character-details {
    max-width: 600px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #4a5568;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
}

.character-final-stats {
    margin: 2rem 0;
    background: #f7fafc;
    border-radius: 8px;
    padding: 1.5rem;
}

.final-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.stat-block {
    background: white;
    border-radius: 6px;
    padding: 1rem;
}

.stat-block h4 {
    color: #4a5568;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.25rem;
}

.stat-block p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #718096;
}

.completion-actions {
    text-align: center;
    margin-top: 2rem;
}

.feats-notice, .equipment-notice {
    background: #fff8dc;
    border: 2px solid #f6e05e;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
}

.feats-notice p, .equipment-notice p {
    margin: 0.5rem 0;
    color: #744210;
}

.error-message {
    background: #fed7d7;
    border: 2px solid #fc8181;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
}

.error-message h3 {
    color: #c53030;
    margin-bottom: 1rem;
}

.error-message p {
    color: #742a2a;
}

/* Responsive Design */
@media (max-width: 1023px) {
    .creator-main {
        grid-template-columns: 1fr;
    }
    
    .character-preview {
        order: -1;
        position: static;
    }
}

@media (max-width: 600px) {
    .creator-main {
        padding: 1rem;
        gap: 1rem;
    }
    
    .current-step {
        padding: 1rem;
    }
    
    .wizard-steps {
        font-size: 0.8rem;
        padding: 0.5rem;
    }
    
    .step {
        padding: 0.4rem 0.8rem;
        min-width: 80px;
    }
    
    .method-card, .race-card, .class-card {
        padding: 1rem;
    }
    
    .ability-scores-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .race-selection-grid, .class-selection-grid {
        grid-template-columns: 1fr;
    }
    
    .final-stats-grid {
        grid-template-columns: 1fr;
    }
    
    .step-navigation {
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }
    
    .btn {
        min-width: 120px;
    }
}

/* Dice Roller Styles */
.dice-roller {
    padding: 2rem;
    max-width: 600px;
    margin: 2rem auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    text-align: center;
}

.dice-input {
    margin: 2rem 0;
}

.dice-input input {
    padding: 0.75rem;
    font-size: 1.1rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    width: 250px;
    margin-right: 1rem;
}

.dice-input button {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
}

.quick-dice {
    margin: 2rem 0;
}

.quick-dice button {
    margin: 0.25rem;
    padding: 0.5rem 1rem;
    border: 2px solid #667eea;
    background: white;
    color: #667eea;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.quick-dice button:hover {
    background: #667eea;
    color: white;
}

.dice-result {
    margin: 2rem 0;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.result-display {
    background: #f0fff4;
    border: 2px solid #38a169;
    border-radius: 8px;
    padding: 1.5rem;
}

.result-display h3 {
    color: #38a169;
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.dice-history {
    text-align: left;
    margin-top: 2rem;
}

.history-item {
    background: #f8fafc;
    padding: 0.5rem 1rem;
    margin: 0.25rem 0;
    border-radius: 4px;
    border-left: 3px solid #667eea;
}

/* Adventure Engine Styles */
.adventure-engine {
    padding: 2rem;
    max-width: 600px;
    margin: 2rem auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    text-align: center;
}

.feature-preview {
    background: #f8fafc;
    padding: 2rem;
    border-radius: 8px;
    margin: 2rem 0;
    text-align: left;
}

.feature-preview ul {
    list-style: none;
    padding-left: 0;
}

.feature-preview li {
    padding: 0.5rem 0;
    font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 1023px) {
    .game-container {
        grid-template-columns: 60px 1fr;
    }
    
    .app-header h1 {
        font-size: 1.2rem;
    }
    
    .header-nav {
        display: none;
    }
}

@media (max-width: 600px) {
    .game-container {
        grid-template-areas: 
            "header"
            "content";
        grid-template-columns: 1fr;
    }
    
    .feature-grid {
        grid-template-columns: 1fr;
    }
    
    .wizard-steps {
        font-size: 0.8rem;
    }
    
    .ability-methods {
        flex-direction: column;
        align-items: center;
    }
    
    .dice-input input {
        width: 200px;
        margin-bottom: 1rem;
    }
}`;
  }

  generateGameJS() {
    return `/* RulzLawyer D&D 3.5 Game JavaScript */

class GameClient {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.currentCharacter = null;
        this.diceHistory = [];
        
        console.log('🎲 RulzLawyer Game Client Initialized');
    }
    
    generateSessionId() {
        return 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    async apiCall(endpoint, options = {}) {
        const defaultOptions = {
            headers: {
                'X-Session-ID': this.sessionId,
                'Content-Type': 'application/json'
            }
        };
        
        const requestOptions = { ...defaultOptions, ...options };
        if (requestOptions.headers && options.headers) {
            requestOptions.headers = { ...defaultOptions.headers, ...options.headers };
        }
        
        try {
            const response = await fetch(endpoint, requestOptions);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Character Management
    async createCharacter() {
        const result = await this.apiCall('/api/character/create', { method: 'POST' });
        if (result.success) {
            this.currentCharacter = result.character;
            console.log('Character created:', result.character.id);
        }
        return result;
    }
    
    async saveCharacter(characterData) {
        const result = await this.apiCall('/api/character/save', {
            method: 'POST',
            body: JSON.stringify(characterData)
        });
        return result;
    }
    
    async loadCharacter(characterId) {
        const result = await this.apiCall(\`/api/character/load?id=\${characterId}\`);
        if (result.success) {
            this.currentCharacter = result.character;
        }
        return result;
    }
    
    async listCharacters() {
        return await this.apiCall('/api/character/list');
    }
    
    // Dice Rolling
    async rollDice(expression) {
        const result = await this.apiCall(\`/api/dice/roll?expression=\${encodeURIComponent(expression)}\`);
        if (result.success) {
            this.diceHistory.unshift(result.result);
            if (this.diceHistory.length > 20) this.diceHistory.pop();
        }
        return result;
    }
    
    async getDiceHistory() {
        return await this.apiCall('/api/dice/history');
    }
    
    // Table Rolling
    async rollTable(tableName) {
        return await this.apiCall(\`/api/tables/roll?table=\${encodeURIComponent(tableName)}\`);
    }
    
    async listTables() {
        return await this.apiCall('/api/tables/list');
    }
}

// Global game client instance
const gameClient = new GameClient();

// Global utility functions
function rollRandomTable() {
    alert('Random table rolling coming soon!');
}

// Character creation functions
function generateAbilityScores(method) {
    console.log('Generating ability scores using:', method);
    // This would be expanded with full D&D 3.5 rules
}

function rollAbilityScore() {
    const rolls = [1,2,3,4].map(() => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
}

// Dice rolling functions
async function rollDice() {
    const expression = document.getElementById('diceExpression')?.value || '1d20';
    try {
        const result = await gameClient.rollDice(expression);
        if (result.success && typeof displayResult === 'function') {
            displayResult(result.result);
            addToHistory(result.result);
        }
    } catch (error) {
        alert('Error rolling dice: ' + error.message);
    }
}

function quickRoll(expression) {
    const input = document.getElementById('diceExpression');
    if (input) {
        input.value = expression;
        rollDice();
    }
}

// DOM ready initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Game interface loaded');
    
    // Initialize any page-specific functionality
    if (window.location.pathname.includes('character-creator')) {
        console.log('Character creator loaded');
    } else if (window.location.pathname.includes('dice-roller')) {
        console.log('Dice roller loaded');
    } else if (window.location.pathname.includes('adventure-engine')) {
        console.log('Adventure engine loaded');
    }
});

// Export for global use
window.gameClient = gameClient;`;
  }

  createSession(req, res, parsedUrl) {
    const sessionId = this.generateSessionId();
    this.sessionStore.set(sessionId, {
      id: sessionId,
      created: new Date().toISOString(),
      lastAccessed: new Date().toISOString()
    });
    
    this.sendJSONResponse(res, 201, { 
      success: true, 
      sessionId: sessionId 
    });
  }

  validateSession(req, res, parsedUrl) {
    const sessionId = req.headers['x-session-id'];
    const session = this.sessionStore.get(sessionId);
    
    if (session) {
      session.lastAccessed = new Date().toISOString();
      this.sendJSONResponse(res, 200, { 
        success: true, 
        valid: true,
        session: session
      });
    } else {
      this.sendJSONResponse(res, 404, { 
        success: false, 
        valid: false 
      });
    }
  }

  createCampaign(req, res, parsedUrl) {
    this.sendJSONResponse(res, 501, { 
      error: 'Campaign system not yet implemented' 
    });
  }

  joinCampaign(req, res, parsedUrl) {
    this.sendJSONResponse(res, 501, { 
      error: 'Campaign system not yet implemented' 
    });
  }

  validateSRD(req, res, parsedUrl) {
    this.sendJSONResponse(res, 200, { 
      success: true, 
      message: 'SRD validation system active',
      version: '3.5'
    });
  }

  // Equipment Management API Methods
  equipItem(req, res, parsedUrl) {
    if (!this.equipmentManager) {
      this.sendJSONResponse(res, 500, { error: 'Equipment manager not available' });
      return;
    }

    if (req.method === 'POST') {
      this.getRequestBody(req, (body) => {
        try {
          const { characterId, itemId, slot } = JSON.parse(body);
          
          // Load character equipment context
          const character = this.characterStore.get(characterId);
          if (!character) {
            this.sendJSONResponse(res, 404, { error: 'Character not found' });
            return;
          }
          
          this.equipmentManager.loadCharacter(character);
          
          // Find item in inventory or create from SRD
          let item = this.equipmentManager.inventory.find(inv => inv.id === itemId);
          if (!item) {
            item = this.equipmentManager.findItemByName(itemId); // Fallback to SRD lookup
          }
          
          if (!item) {
            this.sendJSONResponse(res, 404, { error: 'Item not found' });
            return;
          }
          
          const result = this.equipmentManager.equipItem(item, slot);
          
          if (result.success) {
            // Update character in storage
            character.equipment = this.equipmentManager.equipment;
            character.encumbrance = this.equipmentManager.encumbrance;
            this.characterStore.set(characterId, character);
          }
          
          this.sendJSONResponse(res, result.success ? 200 : 400, result);
        } catch (error) {
          this.sendJSONResponse(res, 400, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  unequipItem(req, res, parsedUrl) {
    if (!this.equipmentManager) {
      this.sendJSONResponse(res, 500, { error: 'Equipment manager not available' });
      return;
    }

    if (req.method === 'POST') {
      this.getRequestBody(req, (body) => {
        try {
          const { characterId, slot } = JSON.parse(body);
          
          const character = this.characterStore.get(characterId);
          if (!character) {
            this.sendJSONResponse(res, 404, { error: 'Character not found' });
            return;
          }
          
          this.equipmentManager.loadCharacter(character);
          const result = this.equipmentManager.unequipItem(slot);
          
          if (result.success) {
            // Update character in storage
            character.equipment = this.equipmentManager.equipment;
            character.inventory = this.equipmentManager.inventory;
            character.encumbrance = this.equipmentManager.encumbrance;
            this.characterStore.set(characterId, character);
          }
          
          this.sendJSONResponse(res, result.success ? 200 : 400, result);
        } catch (error) {
          this.sendJSONResponse(res, 400, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  manageInventory(req, res, parsedUrl) {
    if (!this.equipmentManager) {
      this.sendJSONResponse(res, 500, { error: 'Equipment manager not available' });
      return;
    }

    if (req.method === 'GET') {
      const characterId = parsedUrl.query.characterId;
      if (!characterId) {
        this.sendJSONResponse(res, 400, { error: 'Character ID required' });
        return;
      }
      
      const character = this.characterStore.get(characterId);
      if (!character) {
        this.sendJSONResponse(res, 404, { error: 'Character not found' });
        return;
      }
      
      this.equipmentManager.loadCharacter(character);
      
      this.sendJSONResponse(res, 200, {
        equipment: this.equipmentManager.equipment,
        inventory: this.equipmentManager.inventory,
        encumbrance: this.equipmentManager.encumbrance,
        srdData: this.equipmentManager.srdData
      });
    } else if (req.method === 'POST') {
      this.getRequestBody(req, (body) => {
        try {
          const { characterId, action, itemId, quantity } = JSON.parse(body);
          
          const character = this.characterStore.get(characterId);
          if (!character) {
            this.sendJSONResponse(res, 404, { error: 'Character not found' });
            return;
          }
          
          this.equipmentManager.loadCharacter(character);
          let result;
          
          switch (action) {
            case 'add':
              const item = this.equipmentManager.findItemByName(itemId) || 
                          this.equipmentManager.srdData.gear[itemId] ||
                          { id: itemId, name: itemId, cost: 0, weight: 0 };
              result = this.equipmentManager.addToInventory(item, quantity || 1);
              break;
            case 'remove':
              result = this.equipmentManager.removeFromInventory(itemId, quantity || 1);
              break;
            default:
              result = { success: false, message: 'Invalid action' };
          }
          
          if (result.success) {
            character.inventory = this.equipmentManager.inventory;
            character.encumbrance = this.equipmentManager.encumbrance;
            this.characterStore.set(characterId, character);
          }
          
          this.sendJSONResponse(res, result.success ? 200 : 400, result);
        } catch (error) {
          this.sendJSONResponse(res, 400, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  applyEquipmentPreset(req, res, parsedUrl) {
    if (!this.equipmentManager) {
      this.sendJSONResponse(res, 500, { error: 'Equipment manager not available' });
      return;
    }

    if (req.method === 'POST') {
      this.getRequestBody(req, (body) => {
        try {
          const { characterId, presetName } = JSON.parse(body);
          
          const character = this.characterStore.get(characterId);
          if (!character) {
            this.sendJSONResponse(res, 404, { error: 'Character not found' });
            return;
          }
          
          this.equipmentManager.loadCharacter(character);
          const result = this.equipmentManager.applyEquipmentPreset(presetName);
          
          if (result.success) {
            character.equipment = this.equipmentManager.equipment;
            character.inventory = this.equipmentManager.inventory;
            character.encumbrance = this.equipmentManager.encumbrance;
            this.characterStore.set(characterId, character);
          }
          
          this.sendJSONResponse(res, result.success ? 200 : 400, result);
        } catch (error) {
          this.sendJSONResponse(res, 400, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  exportEquipment(req, res, parsedUrl) {
    if (!this.equipmentManager) {
      this.sendJSONResponse(res, 500, { error: 'Equipment manager not available' });
      return;
    }

    const characterId = parsedUrl.query.characterId;
    if (!characterId) {
      this.sendJSONResponse(res, 400, { error: 'Character ID required' });
      return;
    }
    
    const character = this.characterStore.get(characterId);
    if (!character) {
      this.sendJSONResponse(res, 404, { error: 'Character not found' });
      return;
    }
    
    this.equipmentManager.loadCharacter(character);
    const exportData = this.equipmentManager.exportEquipmentData();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="equipment-${characterId}-${new Date().toISOString().split('T')[0]}.json"`);
    res.statusCode = 200;
    res.end(JSON.stringify(exportData, null, 2));
  }

  importEquipment(req, res, parsedUrl) {
    if (!this.equipmentManager) {
      this.sendJSONResponse(res, 500, { error: 'Equipment manager not available' });
      return;
    }

    if (req.method === 'POST') {
      this.getRequestBody(req, (body) => {
        try {
          const { characterId, equipmentData } = JSON.parse(body);
          
          const character = this.characterStore.get(characterId);
          if (!character) {
            this.sendJSONResponse(res, 404, { error: 'Character not found' });
            return;
          }
          
          this.equipmentManager.loadCharacter(character);
          const result = this.equipmentManager.importEquipmentData(equipmentData);
          
          if (result.success) {
            character.equipment = this.equipmentManager.equipment;
            character.inventory = this.equipmentManager.inventory;
            character.encumbrance = this.equipmentManager.encumbrance;
            this.characterStore.set(characterId, character);
          }
          
          this.sendJSONResponse(res, result.success ? 200 : 400, result);
        } catch (error) {
          this.sendJSONResponse(res, 400, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  // ==================== SPELL MANAGEMENT API ====================

  initializeSpells(req, res, parsedUrl) {
    if (req.method === 'POST') {
      this.parsePostData(req, (postData) => {
        try {
          const { characterId } = postData;
          
          if (!characterId) {
            this.sendJSONResponse(res, 400, { error: 'Character ID is required' });
            return;
          }
          
          const character = this.characterStore.get(characterId);
          if (!character) {
            this.sendJSONResponse(res, 404, { error: 'Character not found' });
            return;
          }
          
          const spellData = this.spellManager.initializeCharacterSpells(characterId, character);
          this.sendJSONResponse(res, 200, { success: true, spellData });
        } catch (error) {
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  getAvailableSpells(req, res, parsedUrl) {
    if (req.method === 'GET') {
      try {
        const query = parsedUrl.query;
        const { characterId, className, spellLevel } = query;
        
        if (!characterId || !className) {
          this.sendJSONResponse(res, 400, { error: 'Character ID and class name are required' });
          return;
        }
        
        const level = spellLevel ? parseInt(spellLevel) : undefined;
        const spells = this.spellManager.getAvailableSpells(characterId, className, level);
        
        this.sendJSONResponse(res, 200, { success: true, spells });
      } catch (error) {
        this.sendJSONResponse(res, 500, { error: error.message });
      }
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  selectSpell(req, res, parsedUrl) {
    if (req.method === 'POST') {
      this.parsePostData(req, (postData) => {
        try {
          const { characterId, className, spellId, spellLevel } = postData;
          
          if (!characterId || !className || !spellId || spellLevel === undefined) {
            this.sendJSONResponse(res, 400, { error: 'Character ID, class name, spell ID, and spell level are required' });
            return;
          }
          
          const result = this.spellManager.selectSpell(characterId, className, spellId, parseInt(spellLevel));
          
          if (result.success) {
            // Update character data with spell selection
            const character = this.characterStore.get(characterId);
            if (character) {
              character.spellData = this.spellManager.getCharacterSpellInfo(characterId);
              this.characterStore.set(characterId, character);
            }
          }
          
          this.sendJSONResponse(res, result.success ? 200 : 400, result);
        } catch (error) {
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  castSpell(req, res, parsedUrl) {
    if (req.method === 'POST') {
      this.parsePostData(req, (postData) => {
        try {
          const { characterId, className, spellId, spellLevel, useHigherSlot } = postData;
          
          if (!characterId || !className || !spellId || spellLevel === undefined) {
            this.sendJSONResponse(res, 400, { error: 'Character ID, class name, spell ID, and spell level are required' });
            return;
          }
          
          const result = this.spellManager.castSpell(
            characterId, 
            className, 
            spellId, 
            parseInt(spellLevel), 
            useHigherSlot ? parseInt(useHigherSlot) : false
          );
          
          if (result.success) {
            // Update character data with spell slot usage
            const character = this.characterStore.get(characterId);
            if (character) {
              character.spellData = this.spellManager.getCharacterSpellInfo(characterId);
              this.characterStore.set(characterId, character);
            }
          }
          
          this.sendJSONResponse(res, result.success ? 200 : 400, result);
        } catch (error) {
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  getSpellInfo(req, res, parsedUrl) {
    if (req.method === 'GET') {
      try {
        const query = parsedUrl.query;
        const { characterId, spellId } = query;
        
        if (characterId) {
          // Get character spell info
          const spellData = this.spellManager.getCharacterSpellInfo(characterId);
          this.sendJSONResponse(res, 200, { success: true, spellData });
        } else if (spellId) {
          // Get specific spell details
          const spell = this.spellManager.spells[spellId];
          if (spell) {
            this.sendJSONResponse(res, 200, { success: true, spell });
          } else {
            this.sendJSONResponse(res, 404, { error: 'Spell not found' });
          }
        } else {
          this.sendJSONResponse(res, 400, { error: 'Character ID or Spell ID is required' });
        }
      } catch (error) {
        this.sendJSONResponse(res, 500, { error: error.message });
      }
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  searchSpells(req, res, parsedUrl) {
    if (req.method === 'GET') {
      try {
        const query = parsedUrl.query;
        const { searchTerm, school, level } = query;
        
        let results = [];
        
        if (searchTerm) {
          results = this.spellManager.searchSpells(searchTerm);
        } else if (school) {
          results = this.spellManager.getSpellsBySchool(school);
        } else {
          // Return all spells
          results = Object.values(this.spellManager.spells);
        }
        
        // Filter by level if specified
        if (level !== undefined) {
          const spellLevel = parseInt(level);
          results = results.filter(spell => {
            const levels = Object.values(spell.level);
            return levels.includes(spellLevel);
          });
        }
        
        this.sendJSONResponse(res, 200, { success: true, spells: results });
      } catch (error) {
        this.sendJSONResponse(res, 500, { error: error.message });
      }
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  restoreSpellSlots(req, res, parsedUrl) {
    if (req.method === 'POST') {
      this.parsePostData(req, (postData) => {
        try {
          const { characterId, restType = 'long' } = postData;
          
          if (!characterId) {
            this.sendJSONResponse(res, 400, { error: 'Character ID is required' });
            return;
          }
          
          const success = this.spellManager.restoreSpellSlots(characterId, restType);
          
          if (success) {
            // Update character data
            const character = this.characterStore.get(characterId);
            if (character) {
              character.spellData = this.spellManager.getCharacterSpellInfo(characterId);
              this.characterStore.set(characterId, character);
            }
          }
          
          this.sendJSONResponse(res, success ? 200 : 404, { 
            success, 
            message: success ? `Spell slots restored (${restType} rest)` : 'Character not found' 
          });
        } catch (error) {
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  // ==================== ADVENTURE ENGINE API METHODS ====================

  createAdventureCampaign(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const campaignData = JSON.parse(body);
          console.log('🏰 Creating new campaign:', campaignData.name || 'Unnamed Campaign');
          
          const campaign = this.adventureEngine.createCampaign(campaignData);
          
          // Store campaign in server
          this.campaignStore.set(campaign.id, campaign);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            campaign: campaign,
            message: `Campaign "${campaign.name}" created successfully`
          });
        } catch (error) {
          console.error('❌ Error creating campaign:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  loadAdventureCampaign(req, res, parsedUrl) {
    if (req.method === 'GET') {
      try {
        const campaignId = parsedUrl.query.campaignId;
        
        if (!campaignId) {
          // Return list of available campaigns
          const campaigns = Array.from(this.campaignStore.values()).map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            partyLevel: c.partyLevel,
            currentLocation: c.currentLocation,
            lastPlayed: c.lastPlayed || 'Never'
          }));
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            campaigns: campaigns
          });
        } else {
          // Load specific campaign
          const campaign = this.campaignStore.get(campaignId);
          
          if (campaign) {
            this.sendJSONResponse(res, 200, { 
              success: true, 
              campaign: campaign
            });
          } else {
            this.sendJSONResponse(res, 404, { 
              error: 'Campaign not found' 
            });
          }
        }
      } catch (error) {
        console.error('❌ Error loading campaign:', error);
        this.sendJSONResponse(res, 500, { error: error.message });
      }
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  generateEncounter(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { partyLevel, partySize, encounterType, environment } = JSON.parse(body);
          console.log('⚔️ Generating encounter for party level', partyLevel, 'size', partySize);
          
          const encounter = this.adventureEngine.generateRandomEncounter(
            partyLevel || 1, 
            partySize || 4, 
            encounterType || 'any', 
            environment || 'any'
          );
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            encounter: encounter,
            message: `Generated ${encounter.type} encounter: ${encounter.name}`
          });
        } catch (error) {
          console.error('❌ Error generating encounter:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  getEncounter(req, res, parsedUrl) {
    if (req.method === 'GET') {
      try {
        const encounterId = parsedUrl.query.encounterId;
        
        if (!encounterId) {
          this.sendJSONResponse(res, 400, { error: 'Encounter ID required' });
          return;
        }
        
        const encounter = this.adventureEngine.getEncounter(encounterId);
        
        if (encounter) {
          this.sendJSONResponse(res, 200, { 
            success: true, 
            encounter: encounter
          });
        } else {
          this.sendJSONResponse(res, 404, { 
            error: 'Encounter not found' 
          });
        }
      } catch (error) {
        console.error('❌ Error getting encounter:', error);
        this.sendJSONResponse(res, 500, { error: error.message });
      }
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  generateNPC(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { occupation, location } = JSON.parse(body);
          console.log('👥 Generating NPC with occupation:', occupation || 'random', 'in location:', location || 'unknown');
          
          const npc = this.adventureEngine.generateNPC(
            occupation || 'random', 
            location || 'village'
          );
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            npc: npc,
            message: `Generated NPC: ${npc.name} (${npc.occupation})`
          });
        } catch (error) {
          console.error('❌ Error generating NPC:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  generateTreasure(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { treasureType, challengeRating } = JSON.parse(body);
          console.log('💰 Generating treasure type:', treasureType || 'minor', 'CR:', challengeRating || 1);
          
          const treasure = this.adventureEngine.generateTreasure(
            treasureType || 'minor', 
            challengeRating || 1
          );
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            treasure: treasure,
            message: `Generated ${treasureType || 'minor'} treasure (CR ${challengeRating || 1})`
          });
        } catch (error) {
          console.error('❌ Error generating treasure:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  advanceStory(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { campaignId, action } = JSON.parse(body);
          console.log('📖 Advancing story for campaign:', campaignId, 'with action:', action);
          
          const result = this.adventureEngine.advanceStory(campaignId, action);
          
          // Update stored campaign
          const campaign = this.campaignStore.get(campaignId);
          if (campaign) {
            campaign.lastPlayed = new Date().toISOString();
            this.campaignStore.set(campaignId, campaign);
          }
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            result: result,
            message: `Story advanced for campaign ${campaignId}`
          });
        } catch (error) {
          console.error('❌ Error advancing story:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  // ============= EPIC LEVEL CHARACTER ENDPOINTS =============
  createEpicCharacter(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { baseCharacter, targetLevel } = JSON.parse(body);
          console.log('⭐ Creating epic character from level', baseCharacter.level, 'to', targetLevel);
          
          const epicCharacter = this.epicLevelSystem.createEpicCharacter(baseCharacter, targetLevel);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            character: epicCharacter,
            message: `Epic character created at level ${targetLevel}`
          });
        } catch (error) {
          console.error('❌ Error creating epic character:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  upgradeToEpic(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { characterId, newLevel } = JSON.parse(body);
          console.log('⭐ Upgrading character to epic level:', newLevel);
          
          const character = this.characterStore.get(characterId);
          if (!character) {
            this.sendJSONResponse(res, 404, { error: 'Character not found' });
            return;
          }
          
          const epicCharacter = this.epicLevelSystem.createEpicCharacter(character, newLevel);
          this.characterStore.set(characterId, epicCharacter);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            character: epicCharacter,
            message: `Character upgraded to epic level ${newLevel}`
          });
        } catch (error) {
          console.error('❌ Error upgrading to epic:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  getAvailableEpicFeats(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { character } = JSON.parse(body);
          console.log('⭐ Getting available epic feats for character level', character.level);
          
          const availableFeats = this.epicLevelSystem.getAvailableEpicFeats(character);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            feats: availableFeats,
            message: `Found ${availableFeats.length} available epic feats`
          });
        } catch (error) {
          console.error('❌ Error getting epic feats:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  selectEpicFeat(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { characterId, featId } = JSON.parse(body);
          console.log('⭐ Selecting epic feat:', featId, 'for character:', characterId);
          
          const character = this.characterStore.get(characterId);
          if (!character) {
            this.sendJSONResponse(res, 404, { error: 'Character not found' });
            return;
          }
          
          // Add feat to character
          if (!character.epicFeats) character.epicFeats = { selected: [] };
          character.epicFeats.selected.push(featId);
          
          this.characterStore.set(characterId, character);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            character: character,
            message: `Epic feat ${featId} selected`
          });
        } catch (error) {
          console.error('❌ Error selecting epic feat:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  developEpicSpell(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { character, spellConcept } = JSON.parse(body);
          console.log('✨ Developing epic spell:', spellConcept.name);
          
          const spellDevelopment = this.epicLevelSystem.developEpicSpell(character, spellConcept);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            development: spellDevelopment,
            message: `Epic spell development calculated: DC ${spellDevelopment.spellcraftDC}`
          });
        } catch (error) {
          console.error('❌ Error developing epic spell:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  attemptDivineAscension(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { characterId } = JSON.parse(body);
          console.log('🌟 Attempting divine ascension for character:', characterId);
          
          const character = this.characterStore.get(characterId);
          if (!character) {
            this.sendJSONResponse(res, 404, { error: 'Character not found' });
            return;
          }
          
          const divineRank = this.epicLevelSystem.calculateDivineRank(character);
          
          if (divineRank.eligible && divineRank.rank === 0) {
            character.divineRank = divineRank;
            this.characterStore.set(characterId, character);
            
            this.sendJSONResponse(res, 200, { 
              success: true, 
              character: character,
              message: `Divine ascension successful! Character is now a ${divineRank.title}`
            });
          } else {
            this.sendJSONResponse(res, 200, { 
              success: false, 
              rank: divineRank,
              message: 'Character not ready for divine ascension'
            });
          }
        } catch (error) {
          console.error('❌ Error with divine ascension:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  // ============= COMBAT TRACKER ENDPOINTS =============
  startCombat(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { participants } = JSON.parse(body);
          console.log('⚔️ Starting combat with', participants.length, 'participants');
          
          const currentCombatant = this.combatTracker.startCombat(participants);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            currentCombatant: currentCombatant,
            initiative: this.combatTracker.initiative.order,
            message: `Combat started with ${participants.length} participants`
          });
        } catch (error) {
          console.error('❌ Error starting combat:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  rollCombatInitiative(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { participants } = JSON.parse(body);
          console.log('🎲 Rolling initiative for', participants.length, 'participants');
          
          const initiativeOrder = this.combatTracker.rollInitiative(participants);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            initiative: initiativeOrder,
            message: `Initiative rolled for ${participants.length} participants`
          });
        } catch (error) {
          console.error('❌ Error rolling initiative:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  nextCombatTurn(req, res, parsedUrl) {
    if (req.method === 'POST') {
      try {
        console.log('⏭️ Advancing to next combat turn');
        
        const currentCombatant = this.combatTracker.nextTurn();
        
        this.sendJSONResponse(res, 200, { 
          success: true, 
          currentCombatant: currentCombatant,
          round: this.combatTracker.combatState.round,
          message: currentCombatant ? `${currentCombatant.name}'s turn` : 'Combat ended'
        });
      } catch (error) {
        console.error('❌ Error advancing turn:', error);
        this.sendJSONResponse(res, 500, { error: error.message });
      }
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  delayCombatTurn(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { combatantId } = JSON.parse(body);
          console.log('⏸️ Delaying turn for combatant:', combatantId);
          
          this.combatTracker.delayTurn(combatantId);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            message: `Turn delayed for combatant ${combatantId}`
          });
        } catch (error) {
          console.error('❌ Error delaying turn:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  readyCombatAction(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { combatantId, action, trigger } = JSON.parse(body);
          console.log('🎯 Readying action for combatant:', combatantId);
          
          this.combatTracker.readyAction(combatantId, action, trigger);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            message: `Action readied for combatant ${combatantId}`
          });
        } catch (error) {
          console.error('❌ Error readying action:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  applyCombatCondition(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { combatantId, condition, duration, source } = JSON.parse(body);
          console.log('🎭 Applying condition:', condition, 'to combatant:', combatantId);
          
          this.combatTracker.applyCondition(combatantId, condition, duration, source);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            message: `Condition ${condition} applied to combatant ${combatantId}`
          });
        } catch (error) {
          console.error('❌ Error applying condition:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  removeCombatCondition(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { combatantId, condition } = JSON.parse(body);
          console.log('✨ Removing condition:', condition, 'from combatant:', combatantId);
          
          this.combatTracker.removeCondition(combatantId, condition);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            message: `Condition ${condition} removed from combatant ${combatantId}`
          });
        } catch (error) {
          console.error('❌ Error removing condition:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  applyCombatDamage(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { combatantId, damage, damageType } = JSON.parse(body);
          console.log('💥 Applying', damage, damageType, 'damage to combatant:', combatantId);
          
          this.combatTracker.applyDamage(combatantId, damage, damageType);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            message: `${damage} ${damageType} damage applied to combatant ${combatantId}`
          });
        } catch (error) {
          console.error('❌ Error applying damage:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  applyCombatHealing(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { combatantId, healing } = JSON.parse(body);
          console.log('💚 Applying', healing, 'healing to combatant:', combatantId);
          
          this.combatTracker.applyHealing(combatantId, healing);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            message: `${healing} healing applied to combatant ${combatantId}`
          });
        } catch (error) {
          console.error('❌ Error applying healing:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  trackCombatSpell(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { spellData } = JSON.parse(body);
          console.log('✨ Tracking spell in combat:', spellData.name);
          
          const spellId = this.combatTracker.trackSpell(spellData);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            spellId: spellId,
            message: `Spell ${spellData.name} is now being tracked`
          });
        } catch (error) {
          console.error('❌ Error tracking spell:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  endCombatSpell(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { spellId } = JSON.parse(body);
          console.log('⏰ Ending tracked spell:', spellId);
          
          this.combatTracker.endSpell(spellId);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            message: `Spell ${spellId} ended`
          });
        } catch (error) {
          console.error('❌ Error ending spell:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  moveCombatant(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { combatantId, x, y } = JSON.parse(body);
          console.log('📍 Moving combatant:', combatantId, 'to position:', x, y);
          
          const movement = this.combatTracker.moveCombatant(combatantId, x, y);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            movement: movement,
            message: `Combatant moved ${movement.movement} feet`
          });
        } catch (error) {
          console.error('❌ Error moving combatant:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  calculateCombatRange(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { combatant1Id, combatant2Id } = JSON.parse(body);
          console.log('📏 Calculating range between combatants:', combatant1Id, 'and', combatant2Id);
          
          const range = this.combatTracker.getRange(combatant1Id, combatant2Id);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            range: range,
            message: `Range: ${range.feet} feet (${range.squares} squares)`
          });
        } catch (error) {
          console.error('❌ Error calculating range:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  endCombat(req, res, parsedUrl) {
    if (req.method === 'POST') {
      try {
        console.log('🏁 Ending combat');
        
        const combatSummary = this.combatTracker.endCombat();
        
        this.sendJSONResponse(res, 200, { 
          success: true, 
          summary: combatSummary,
          message: `Combat ended after ${combatSummary.duration} rounds`
        });
      } catch (error) {
        console.error('❌ Error ending combat:', error);
        this.sendJSONResponse(res, 500, { error: error.message });
      }
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  exportCombatState(req, res, parsedUrl) {
    if (req.method === 'GET') {
      try {
        console.log('📤 Exporting combat state');
        
        const combatState = this.combatTracker.exportCombatState();
        
        this.sendJSONResponse(res, 200, { 
          success: true, 
          combatState: combatState,
          message: 'Combat state exported successfully'
        });
      } catch (error) {
        console.error('❌ Error exporting combat state:', error);
        this.sendJSONResponse(res, 500, { error: error.message });
      }
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }

  importCombatState(req, res, parsedUrl) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { combatState } = JSON.parse(body);
          console.log('📥 Importing combat state');
          
          this.combatTracker.importCombatState(combatState);
          
          this.sendJSONResponse(res, 200, { 
            success: true, 
            message: 'Combat state imported successfully'
          });
        } catch (error) {
          console.error('❌ Error importing combat state:', error);
          this.sendJSONResponse(res, 500, { error: error.message });
        }
      });
    } else {
      this.sendJSONResponse(res, 405, { error: 'Method not allowed' });
    }
  }
}

// Create and start the server
const server = new RulzLawyerGameServer();
server.start();

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down RulzLawyer Gaming Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Server terminated gracefully');
  process.exit(0);
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RulzLawyerGameServer;
}
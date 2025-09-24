# ⚙️ Technical Architecture

![Technical Architecture](https://img.shields.io/badge/Technical%20Architecture-System%20Design-2E8B57?style=for-the-badge&logo=code&logoColor=FFD700)

> **Complete Technical Documentation**  
> System architecture, APIs, deployment, and development guidelines for RulzLawyer.

---

## 🏗️ **System Architecture**

### 📊 **High-Level Overview**

```
RULZLAWYER SYSTEM ARCHITECTURE
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                       │
├─────────────────────────────────────────────────────────┤
│ 🎮 Character Creator   📊 Dice Roller   ⚔️ Adventure UI │
│ 🧙‍♂️ Spell Manager     📋 Inventory     🎭 Campaign Tools│
└─────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────┐
│                    Core Engine Layer                    │
├─────────────────────────────────────────────────────────┤
│ 🎲 Dice Engine      📚 Rules Engine    🧮 Calculator    │
│ ⚔️ Adventure Engine  🎭 NPC Generator  🗺️ Map Generator │
│ 💾 Data Manager     🔒 Validator      📊 Analytics     │
└─────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────┐
│                     Data Layer                          │
├─────────────────────────────────────────────────────────┤
│ 📖 D&D 3.5 SRD     🧙‍♂️ Character Data  🏰 Campaign Data │
│ 🎲 Random Tables   ⚔️ Monster Manual   💎 Treasure Data│
│ 💾 Local Storage   📁 File System     🌐 Web Storage   │
└─────────────────────────────────────────────────────────┘
```

### 🔧 **Technology Stack**

#### **Frontend Technologies**
```javascript
FRONTEND_STACK = {
    core: {
        html: "HTML5 with semantic markup",
        css: "CSS3 with custom properties and grid/flexbox",
        javascript: "ES6+ modern JavaScript, no framework dependencies"
    },
    
    features: {
        responsive: "Mobile-first responsive design",
        accessibility: "WCAG 2.1 AA compliance",
        performance: "Optimized loading and rendering",
        offline: "Service Worker for offline functionality"
    },
    
    libraries: {
        fonts: "Google Fonts (Cinzel, Inter)",
        icons: "FontAwesome 6",
        charts: "Chart.js for analytics", 
        pdf: "jsPDF for character sheet export"
    }
}
```

#### **Backend Technologies**
```javascript
BACKEND_STACK = {
    runtime: "Node.js 18+",
    server: "Express.js with enhanced middleware",
    
    core_modules: [
        "DiceEngine.js - Advanced dice rolling system",
        "RandomTablesEngine.js - All D&D 3.5 random tables",
        "CharacterManager.js - Character creation and management", 
        "AdventureEngine.js - Dynamic adventure generation",
        "StorageManager.js - Data persistence and validation"
    ],
    
    data_format: "JSON with schema validation",
    persistence: "File system + localStorage hybrid",
    validation: "Comprehensive D&D 3.5 rule compliance"
}
```

---

## 🏛️ **Module Architecture**

### 🎲 **Core Engine Modules**

#### **DiceEngine Architecture**
```javascript
class DiceEngine {
    constructor() {
        this.rollHistory = [];
        this.statistics = new DiceStatistics();
        this.plugins = new Map();
    }
    
    // Core rolling functionality
    roll(expression, context = "Generic Roll") {
        let parsedRoll = this.parseDiceExpression(expression);
        let result = this.executeRoll(parsedRoll);
        
        this.recordRoll(result, context);
        return this.formatResult(result);
    }
    
    // Advanced D&D 3.5 mechanics
    rollWithAdvantage(expression, context) {
        let roll1 = this.roll(expression, context + " (Roll 1)");
        let roll2 = this.roll(expression, context + " (Roll 2)");
        return roll1.total > roll2.total ? roll1 : roll2;
    }
    
    rollWithDisadvantage(expression, context) {
        let roll1 = this.roll(expression, context + " (Roll 1)");
        let roll2 = this.roll(expression, context + " (Roll 2)");
        return roll1.total < roll2.total ? roll1 : roll2;
    }
    
    // Critical hit mechanics
    rollCritical(weaponDice, criticalMultiplier, extraDamage = 0) {
        let normalDamage = this.roll(weaponDice, "Base Damage");
        let criticalDamage = this.roll(weaponDice, "Critical Damage");
        
        return {
            normal: normalDamage,
            critical: criticalDamage,
            total: normalDamage.total + criticalDamage.total + extraDamage,
            multiplier: criticalMultiplier
        };
    }
}

// Module exports for dual environment compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiceEngine;
} else if (typeof window !== 'undefined') {
    window.DiceEngine = DiceEngine;
}
```

#### **RandomTablesEngine Architecture**
```javascript
class RandomTablesEngine {
    constructor() {
        this.tables = this.initializeTables();
        this.cache = new Map();
    }
    
    // Master table access
    rollOnTable(tableName, modifier = 0) {
        if (!this.tables.has(tableName)) {
            throw new Error(`Table '${tableName}' not found`);
        }
        
        let table = this.tables.get(tableName);
        let roll = this.diceEngine.roll(table.dice) + modifier;
        
        return this.lookupResult(table, roll);
    }
    
    // Treasure generation
    generateTreasure(challengeRating, encounterType = "standard") {
        let treasureType = this.determineTreasureType(challengeRating);
        let baseCoins = this.rollOnTable("treasure_coins_" + treasureType);
        let items = this.rollOnTable("treasure_items_" + treasureType);
        let magic = this.rollOnTable("magic_items_" + treasureType);
        
        return this.compileTreasure(baseCoins, items, magic);
    }
    
    // Monster encounter generation  
    generateEncounter(environment, partyLevel) {
        let encounterTable = "encounters_" + environment + "_" + this.levelToTier(partyLevel);
        let encounter = this.rollOnTable(encounterTable);
        
        return this.expandEncounter(encounter, partyLevel);
    }
}
```

#### **CharacterManager Architecture**
```javascript
class CharacterManager {
    constructor() {
        this.characters = new Map();
        this.validator = new CharacterValidator();
        this.calculator = new CharacterCalculator();
    }
    
    // Character creation workflow
    startCreation() {
        return new CharacterCreationWizard({
            steps: [
                "basicInfo",
                "raceSelection", 
                "abilityScores",
                "classSelection",
                "skillsAndFeats",
                "equipment",
                "spells"
            ],
            validator: this.validator,
            calculator: this.calculator
        });
    }
    
    // Character persistence
    saveCharacter(character, format = "json") {
        let validated = this.validator.validateCharacter(character);
        if (!validated.isValid) {
            throw new Error("Character validation failed: " + validated.errors.join(", "));
        }
        
        let serialized = this.serializeCharacter(character, format);
        return this.storageManager.save(serialized, character.name);
    }
    
    loadCharacter(characterId) {
        let data = this.storageManager.load(characterId);
        let character = this.deserializeCharacter(data);
        
        return this.upgradeCharacterVersion(character);
    }
}
```

### 🌐 **Web Integration Layer**

#### **Browser Compatibility System**
```javascript
class BrowserIntegration {
    constructor() {
        this.initializeGlobalReferences();
        this.setupEventHandlers();
        this.detectCapabilities();
    }
    
    // Critical: Global window references for HTML onclick handlers
    initializeGlobalReferences() {
        // Make core engines available globally for HTML integration
        window.diceEngine = new DiceEngine();
        window.randomTablesEngine = new RandomTablesEngine(window.diceEngine);
        window.characterWizard = new CharacterCreationWizard();
        window.gameActions = {
            rollDice: this.rollDice.bind(this),
            startCharacterCreation: this.startCharacterCreation.bind(this),
            generateAdventure: this.generateAdventure.bind(this)
        };
    }
    
    // HTML interface compatibility
    rollDice(expression) {
        try {
            let result = window.diceEngine.roll(expression);
            this.displayResult(result);
            return result;
        } catch (error) {
            this.displayError("Roll failed: " + error.message);
            return null;
        }
    }
    
    startCharacterCreation() {
        try {
            let wizard = window.characterWizard;
            wizard.start(document.getElementById('character-creator-container'));
        } catch (error) {
            this.displayError("Character creation failed: " + error.message);
        }
    }
}
```

---

## 💾 **Data Architecture**

### 📊 **Database Schema**

#### **Character Data Schema**
```javascript
CHARACTER_SCHEMA = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    required: ["version", "basic", "race", "abilities", "classes"],
    
    properties: {
        version: {
            type: "string",
            pattern: "^\\d+\\.\\d+\\.\\d+$"
        },
        
        basic: {
            type: "object",
            required: ["name", "level", "experience"],
            properties: {
                name: {type: "string", minLength: 1, maxLength: 100},
                player: {type: "string", maxLength: 100},
                level: {type: "integer", minimum: 1, maximum: 20},
                experience: {type: "integer", minimum: 0},
                alignment: {
                    type: "string", 
                    enum: ["LG", "LN", "LE", "NG", "N", "NE", "CG", "CN", "CE"]
                }
            }
        },
        
        race: {
            type: "object",
            required: ["name", "size", "speed"],
            properties: {
                name: {type: "string", enum: ["Human", "Elf", "Dwarf", "Halfling", "Gnome", "Half-Elf", "Half-Orc"]},
                size: {type: "string", enum: ["Fine", "Diminutive", "Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan", "Colossal"]},
                speed: {type: "integer", minimum: 0},
                abilityModifiers: {
                    type: "object",
                    properties: {
                        strength: {type: "integer"},
                        dexterity: {type: "integer"},
                        constitution: {type: "integer"},
                        intelligence: {type: "integer"},
                        wisdom: {type: "integer"},
                        charisma: {type: "integer"}
                    }
                }
            }
        },
        
        abilities: {
            type: "object",
            required: ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"],
            properties: {
                strength: {type: "integer", minimum: 1, maximum: 50},
                dexterity: {type: "integer", minimum: 1, maximum: 50},
                constitution: {type: "integer", minimum: 1, maximum: 50},
                intelligence: {type: "integer", minimum: 1, maximum: 50},
                wisdom: {type: "integer", minimum: 1, maximum: 50},
                charisma: {type: "integer", minimum: 1, maximum: 50}
            }
        },
        
        classes: {
            type: "array",
            minItems: 1,
            items: {
                type: "object",
                required: ["name", "level"],
                properties: {
                    name: {type: "string"},
                    level: {type: "integer", minimum: 1, maximum: 20},
                    hitPointsRolled: {
                        type: "array",
                        items: {type: "integer", minimum: 1}
                    }
                }
            }
        }
    }
}
```

#### **Campaign Data Schema**
```javascript
CAMPAIGN_SCHEMA = {
    type: "object",
    required: ["name", "created", "sessions"],
    
    properties: {
        name: {type: "string", minLength: 1, maxLength: 200},
        description: {type: "string", maxLength: 2000},
        created: {type: "string", format: "date-time"},
        lastPlayed: {type: "string", format: "date-time"},
        
        settings: {
            type: "object",
            properties: {
                theme: {type: "string", enum: ["classic", "urban", "wilderness", "planar", "underdark"]},
                difficulty: {type: "string", enum: ["easy", "moderate", "hard", "epic"]},
                startingLevel: {type: "integer", minimum: 1, maximum: 20},
                allowedRaces: {type: "array", items: {type: "string"}},
                allowedClasses: {type: "array", items: {type: "string"}}
            }
        },
        
        party: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    characterId: {type: "string"},
                    playerName: {type: "string"},
                    active: {type: "boolean"}
                }
            }
        },
        
        sessions: {
            type: "array",
            items: {
                type: "object",
                required: ["date", "encounters"],
                properties: {
                    date: {type: "string", format: "date-time"},
                    duration: {type: "integer", minimum: 0},
                    encounters: {type: "array", items: {type: "object"}},
                    treasureFound: {type: "array", items: {type: "object"}},
                    experienceAwarded: {type: "integer", minimum: 0}
                }
            }
        }
    }
}
```

### 🔄 **Data Persistence System**

#### **Storage Manager Architecture**
```javascript
class StorageManager {
    constructor() {
        this.storageTypes = {
            localStorage: new LocalStorageProvider(),
            fileSystem: new FileSystemProvider(),
            indexedDB: new IndexedDBProvider()
        };
        
        this.primaryStorage = this.detectBestStorage();
        this.backupStorage = this.getBackupStorage();
    }
    
    // Intelligent storage selection
    detectBestStorage() {
        if (this.supportsIndexedDB() && this.estimateStorageQuota() > 100) {
            return this.storageTypes.indexedDB;
        } else if (this.supportsLocalStorage()) {
            return this.storageTypes.localStorage;
        } else {
            return this.storageTypes.fileSystem;
        }
    }
    
    // Unified save interface
    async saveCharacter(character) {
        try {
            // Validate before saving
            let validation = this.validateCharacter(character);
            if (!validation.isValid) {
                throw new Error("Character validation failed: " + validation.errors.join(", "));
            }
            
            // Primary storage
            let primaryResult = await this.primaryStorage.save(character.id, character);
            
            // Backup storage (if different)
            if (this.backupStorage !== this.primaryStorage) {
                await this.backupStorage.save(character.id, character);
            }
            
            return primaryResult;
        } catch (error) {
            console.error("Save failed:", error);
            throw error;
        }
    }
    
    // Unified load interface with fallback
    async loadCharacter(characterId) {
        try {
            return await this.primaryStorage.load(characterId);
        } catch (error) {
            console.warn("Primary storage failed, trying backup:", error);
            
            try {
                return await this.backupStorage.load(characterId);
            } catch (backupError) {
                console.error("All storage methods failed:", backupError);
                throw new Error("Character could not be loaded from any storage method");
            }
        }
    }
}
```

---

## 🌐 **Server Architecture**

### 🚀 **Enhanced HTTP Server**

#### **Server Implementation**
```javascript
const express = require('express');
const path = require('path');
const compression = require('compression');

class RulzLawyerServer {
    constructor(port = 3000) {
        this.app = express();
        this.port = port;
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    
    setupMiddleware() {
        // Compression for better performance
        this.app.use(compression());
        
        // Static file serving with caching
        this.app.use(express.static('.', {
            maxAge: '1d',
            etag: true,
            lastModified: true,
            setHeaders: (res, path) => {
                if (path.endsWith('.html')) {
                    res.setHeader('Cache-Control', 'no-cache');
                }
            }
        }));
        
        // JSON parsing for API requests
        this.app.use(express.json({limit: '10mb'}));
        
        // CORS for development
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
    }
    
    setupRoutes() {
        // Main application routes
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });
        
        this.app.get('/character-creator', (req, res) => {
            res.sendFile(path.join(__dirname, 'new-character-creator.html'));
        });
        
        this.app.get('/dice-roller', (req, res) => {
            res.sendFile(path.join(__dirname, 'dice-roller.html'));
        });
        
        // API routes for character management
        this.app.post('/api/characters', this.saveCharacter.bind(this));
        this.app.get('/api/characters/:id', this.loadCharacter.bind(this));
        this.app.get('/api/characters', this.listCharacters.bind(this));
        this.app.delete('/api/characters/:id', this.deleteCharacter.bind(this));
        
        // API routes for adventure generation
        this.app.post('/api/adventures/generate', this.generateAdventure.bind(this));
        this.app.post('/api/encounters/generate', this.generateEncounter.bind(this));
        this.app.get('/api/random-tables/:table', this.rollRandomTable.bind(this));
        
        // Health check endpoint
        this.app.get('/api/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            });
        });
    }
    
    // Character API implementation
    async saveCharacter(req, res) {
        try {
            const character = req.body;
            const validation = this.validateCharacter(character);
            
            if (!validation.isValid) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validation.errors
                });
            }
            
            const result = await this.characterManager.saveCharacter(character);
            res.json({success: true, characterId: result.id});
            
        } catch (error) {
            console.error('Save character error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            });
        }
    }
    
    start() {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.port, (error) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(`🎲 RulzLawyer Server running on http://localhost:${this.port}`);
                    console.log('🏠 Main Page: http://localhost:' + this.port);
                    console.log('🧙‍♂️ Character Creator: http://localhost:' + this.port + '/character-creator');
                    console.log('🎯 Dice Roller: http://localhost:' + this.port + '/dice-roller');
                    resolve(this.server);
                }
            });
        });
    }
}
```

### 🔌 **API Documentation**

#### **REST API Endpoints**
```javascript
API_ENDPOINTS = {
    // Character Management
    "POST /api/characters": {
        description: "Save a new or updated character",
        body: "Character object (JSON)",
        response: "{success: boolean, characterId: string}",
        errors: ["400: Validation failed", "500: Server error"]
    },
    
    "GET /api/characters/:id": {
        description: "Load a specific character by ID",
        parameters: {id: "Character UUID"},
        response: "Character object (JSON)",
        errors: ["404: Character not found", "500: Server error"]
    },
    
    "GET /api/characters": {
        description: "List all saved characters",
        response: "Array of character summaries",
        errors: ["500: Server error"]
    },
    
    "DELETE /api/characters/:id": {
        description: "Delete a character by ID",
        parameters: {id: "Character UUID"},
        response: "{success: boolean}",
        errors: ["404: Character not found", "500: Server error"]
    },
    
    // Adventure Generation
    "POST /api/adventures/generate": {
        description: "Generate a new adventure",
        body: "{partyLevel: number, theme: string, length: string}",
        response: "Adventure object with encounters, NPCs, treasure",
        errors: ["400: Invalid parameters", "500: Generation failed"]
    },
    
    "POST /api/encounters/generate": {
        description: "Generate a single encounter",
        body: "{party: Array, difficulty: string, environment: string}",
        response: "Encounter object with enemies, terrain, tactics",
        errors: ["400: Invalid party data", "500: Generation failed"]
    },
    
    "GET /api/random-tables/:table": {
        description: "Roll on a random table",
        parameters: {table: "Table name", modifier: "Optional modifier"},
        response: "Random table result object",
        errors: ["404: Table not found", "500: Roll failed"]
    }
}
```

---

## 🧪 **Testing Architecture**

### ✅ **Comprehensive Test Suite**

#### **Unit Testing Framework**
```javascript
describe("RulzLawyer System Tests", () => {
    
    describe("DiceEngine", () => {
        let diceEngine;
        
        beforeEach(() => {
            diceEngine = new DiceEngine();
        });
        
        test("Basic dice rolling", () => {
            let result = diceEngine.roll("1d20");
            expect(result.total).toBeGreaterThanOrEqual(1);
            expect(result.total).toBeLessThanOrEqual(20);
            expect(result.dice).toHaveLength(1);
        });
        
        test("Complex expressions", () => {
            let result = diceEngine.roll("2d6+3");
            expect(result.total).toBeGreaterThanOrEqual(5); // 2 + 3
            expect(result.total).toBeLessThanOrEqual(15);   // 12 + 3
            expect(result.dice).toHaveLength(2);
        });
        
        test("Critical hit mechanics", () => {
            let critical = diceEngine.rollCritical("1d8", 2, 3);
            expect(critical.total).toBeGreaterThanOrEqual(5); // min: 1+1+3
            expect(critical.multiplier).toBe(2);
        });
    });
    
    describe("CharacterManager", () => {
        let characterManager;
        
        beforeEach(() => {
            characterManager = new CharacterManager();
        });
        
        test("Character validation", () => {
            let testCharacter = createTestCharacter();
            let validation = characterManager.validator.validateCharacter(testCharacter);
            expect(validation.isValid).toBe(true);
        });
        
        test("Ability score calculations", () => {
            let testCharacter = createTestCharacter();
            testCharacter.abilities.strength = 16;
            
            let modifier = characterManager.calculator.calculateModifier(16);
            expect(modifier).toBe(3);
        });
        
        test("Character serialization", () => {
            let testCharacter = createTestCharacter();
            let serialized = characterManager.serializeCharacter(testCharacter);
            let deserialized = characterManager.deserializeCharacter(serialized);
            
            expect(deserialized.name).toBe(testCharacter.name);
            expect(deserialized.level).toBe(testCharacter.level);
        });
    });
    
    describe("AdventureEngine", () => {
        let adventureEngine;
        
        beforeEach(() => {
            adventureEngine = new AdventureEngine();
        });
        
        test("Encounter generation", () => {
            let party = [
                {level: 5, class: "Fighter"},
                {level: 5, class: "Wizard"}
            ];
            
            let encounter = adventureEngine.generateEncounter(party, "moderate");
            expect(encounter.challengeRating).toBeCloseTo(5, 1);
            expect(encounter.enemies.length).toBeGreaterThan(0);
        });
        
        test("Dungeon generation", () => {
            let dungeon = adventureEngine.generateDungeon("medium", "classic");
            expect(dungeon.rooms.length).toBeGreaterThan(10);
            expect(dungeon.rooms.length).toBeLessThan(30);
            
            // Test connectivity
            let entranceRoom = dungeon.rooms[0];
            expect(entranceRoom.exits.length).toBeGreaterThan(0);
        });
    });
});
```

#### **Integration Testing**
```javascript
describe("Integration Tests", () => {
    
    test("Full character creation workflow", async () => {
        // Start character creation
        let wizard = new CharacterCreationWizard();
        wizard.start();
        
        // Complete all steps
        await wizard.setBasicInfo({name: "Test Hero", player: "Tester"});
        await wizard.selectRace("Human");
        await wizard.setAbilityScores({str: 16, dex: 14, con: 15, int: 12, wis: 13, cha: 10});
        await wizard.selectClass("Fighter");
        await wizard.allocateSkills({"Climb": 4, "Jump": 4, "Intimidate": 2});
        await wizard.selectFeats(["Power Attack", "Weapon Focus (Longsword)"]);
        await wizard.selectEquipment({armor: "Chain Mail", weapon: "Longsword", shield: "Large Steel Shield"});
        
        let character = wizard.finishCharacter();
        
        expect(character.name).toBe("Test Hero");
        expect(character.race.name).toBe("Human");
        expect(character.classes[0].name).toBe("Fighter");
        expect(character.calculated.hitPoints.total).toBeGreaterThan(8); // d10 + Con
        expect(character.calculated.armorClass.total).toBeGreaterThan(15); // Base + Chain + Shield + Dex
    });
    
    test("Adventure generation and character integration", () => {
        let party = [createTestFighter(), createTestWizard()];
        let adventure = adventureEngine.generateAdventure("dungeon", party);
        
        expect(adventure.encounters.length).toBeGreaterThan(5);
        expect(adventure.treasure.total).toBeGreaterThan(1000); // Appropriate for party level
        
        // Test encounter balance
        adventure.encounters.forEach(encounter => {
            let avgPartyLevel = party.reduce((sum, char) => sum + char.level, 0) / party.length;
            expect(encounter.challengeRating).toBeLessThanOrEqual(avgPartyLevel + 3);
            expect(encounter.challengeRating).toBeGreaterThanOrEqual(avgPartyLevel - 2);
        });
    });
    
    test("Server API integration", async () => {
        let server = new RulzLawyerServer(3001);
        await server.start();
        
        let testCharacter = createTestCharacter();
        
        // Test character save
        let response = await fetch("http://localhost:3001/api/characters", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(testCharacter)
        });
        
        let saveResult = await response.json();
        expect(saveResult.success).toBe(true);
        expect(saveResult.characterId).toBeDefined();
        
        // Test character load
        let loadResponse = await fetch(`http://localhost:3001/api/characters/${saveResult.characterId}`);
        let loadedCharacter = await loadResponse.json();
        
        expect(loadedCharacter.name).toBe(testCharacter.name);
        
        server.close();
    });
});
```

---

## 🚀 **Deployment Architecture**

### 📦 **Build System**

#### **Build Configuration**
```javascript
BUILD_CONFIGURATION = {
    environments: {
        development: {
            minification: false,
            sourceMaps: true,
            debugging: true,
            hotReload: true,
            port: 3000
        },
        
        production: {
            minification: true,
            sourceMaps: false,
            debugging: false,
            compression: true,
            caching: true,
            port: 80
        },
        
        testing: {
            minification: false,
            sourceMaps: true,
            debugging: true,
            mockData: true,
            coverage: true,
            port: 3001
        }
    },
    
    buildSteps: [
        "validateCode",
        "runTests", 
        "bundleAssets",
        "optimizeImages",
        "generateServiceWorker",
        "createBuildManifest"
    ]
}
```

#### **Deployment Script**
```bash
#!/bin/bash
# deploy.sh - RulzLawyer Deployment Script

set -e

echo "🎲 Starting RulzLawyer Deployment"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
mkdir -p dist/

# Copy source files
echo "📁 Copying source files..."
cp -r code-repository/* dist/
cp index.html dist/
cp new-character-creator.html dist/
cp dice-roller.html dist/
cp server-enhanced.js dist/

# Validate all modules
echo "✅ Validating modules..."
node -e "
const DiceEngine = require('./dist/src/DiceEngine.js');
const RandomTablesEngine = require('./dist/src/RandomTablesEngine.js');
const CharacterManager = require('./dist/src/CharacterManager.js');
console.log('All modules loaded successfully');
"

# Run test suite  
echo "🧪 Running test suite..."
npm test

# Minify CSS and JS for production
if [ "$1" == "production" ]; then
    echo "🗜️ Minifying assets..."
    # Add minification commands here
fi

# Start server
echo "🚀 Starting production server..."
cd dist/
node server-enhanced.js

echo "✅ Deployment complete!"
echo "🏠 Access at: http://localhost:3000"
```

### 🌐 **Production Configuration**

#### **Server Optimization**
```javascript
class ProductionServer extends RulzLawyerServer {
    constructor(port = 3000) {
        super(port);
        this.setupProductionMiddleware();
        this.setupMonitoring();
        this.setupSecurity();
    }
    
    setupProductionMiddleware() {
        // Enhanced compression
        this.app.use(compression({
            level: 6,
            threshold: 1024,
            filter: (req, res) => {
                if (req.headers['x-no-compression']) return false;
                return compression.filter(req, res);
            }
        }));
        
        // Security headers
        this.app.use((req, res, next) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Strict-Transport-Security', 'max-age=31536000');
            next();
        });
        
        // Rate limiting
        const rateLimit = require('express-rate-limit');
        this.app.use('/api/', rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP'
        }));
    }
    
    setupMonitoring() {
        // Performance monitoring
        this.app.use((req, res, next) => {
            const startTime = Date.now();
            
            res.on('finish', () => {
                const duration = Date.now() - startTime;
                console.log(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
                
                if (duration > 1000) {
                    console.warn(`Slow request detected: ${req.url} took ${duration}ms`);
                }
            });
            
            next();
        });
        
        // Health monitoring endpoint  
        this.app.get('/api/metrics', (req, res) => {
            res.json({
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                cpu: process.cpuUsage(),
                timestamp: new Date().toISOString()
            });
        });
    }
}
```

---

## 📚 **Development Guidelines**

### 🔧 **Code Standards**

#### **JavaScript Style Guide**
```javascript
// RulzLawyer Coding Standards

// 1. Use modern ES6+ syntax
const preferConst = true;
let useLetForVariables = true;

// 2. Descriptive naming
function calculateCharacterArmorClass(character, equipment) {
    const baseAC = 10;
    const armorBonus = equipment.armor?.acBonus || 0;
    const dexterityModifier = Math.floor((character.dexterity - 10) / 2);
    
    return baseAC + armorBonus + dexterityModifier;
}

// 3. Error handling
function rollDice(expression) {
    try {
        const parsed = this.parseDiceExpression(expression);
        return this.executeRoll(parsed);
    } catch (error) {
        console.error('Dice roll failed:', error.message);
        throw new Error(`Invalid dice expression: ${expression}`);
    }
}

// 4. Documentation
/**
 * Generates a balanced encounter for the given party
 * @param {Array} party - Array of character objects
 * @param {string} difficulty - "easy", "moderate", "hard", or "epic"  
 * @param {string} environment - Environment type for encounter
 * @returns {Object} Generated encounter with enemies, terrain, and treasure
 */
function generateEncounter(party, difficulty = "moderate", environment = "dungeon") {
    // Implementation here
}

// 5. Module pattern for browser/Node.js compatibility
(function(global) {
    'use strict';
    
    class MyModule {
        constructor() {
            // Initialize
        }
    }
    
    // Export for both environments
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MyModule;
    } else {
        global.MyModule = MyModule;
    }
    
})(typeof window !== 'undefined' ? window : global);
```

#### **CSS Architecture**
```css
/* RulzLawyer CSS Standards */

/* 1. CSS Custom Properties for theming */
:root {
    --primary-color: #8B0000;
    --secondary-color: #FFD700;
    --background-dark: #1a1a1a;
    --text-light: #f4f4f4;
    
    --font-primary: 'Cinzel', serif;
    --font-secondary: 'Inter', sans-serif;
    
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;
    --spacing-xl: 4rem;
}

/* 2. Mobile-first responsive design */
.character-card {
    display: grid;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    
    /* Mobile layout */
    grid-template-columns: 1fr;
}

@media (min-width: 768px) {
    .character-card {
        /* Tablet layout */  
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-lg);
    }
}

@media (min-width: 1024px) {
    .character-card {
        /* Desktop layout */
        grid-template-columns: 1fr 2fr 1fr;
        gap: var(--spacing-xl);
    }
}

/* 3. Component-based naming */
.btn {
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--font-secondary);
    transition: all 0.2s ease;
}

.btn--primary {
    background: var(--primary-color);
    color: var(--text-light);
}

.btn--secondary {
    background: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
}
```

### 🧪 **Testing Standards**

#### **Test Coverage Requirements**
```javascript
TEST_COVERAGE_REQUIREMENTS = {
    minimumCoverage: {
        statements: 80,
        branches: 75,
        functions: 85,
        lines: 80
    },
    
    testTypes: {
        unit: "Test individual functions and classes",
        integration: "Test module interactions",
        endToEnd: "Test complete user workflows",
        performance: "Test system performance under load"
    },
    
    testData: {
        useRealData: true,
        mockExternalDependencies: true,
        testEdgeCases: true,
        validateErrorHandling: true
    }
}
```

---

<div align="center">

### ⚙️ **Build Legendary Systems**

**[Documentation Hub](../README.md)** | **[Character Creator](../../new-character-creator.html)** | **[D&D Rules](../game-rules/dnd-35-srd-rules.md)**

---

*The technical foundation for epic D&D adventures!*

</div>
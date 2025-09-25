# RulzLawyer AI Agent Instructions - Part 1: Foundation & Core Systems

**Generated**: September 25, 2025  
**Document**: Part 1 of 5 - Foundation & Core Systems  
**Target Lines**: 2000  
**Purpose**: Comprehensive AI agent instructions for building the RulzLawyer D&D 3.5 Character Creator and Adventure Engine  

## 📋 EXECUTIVE MANDATE

You are tasked with building a world-class D&D 3.5 Character Creator and Adventure Engine that rivals commercial gaming applications. This is not a simple utility but a complete gaming system with professional quality, full SRD compliance, and innovative features that enhance the tabletop gaming experience.

### 🎯 PRIMARY OBJECTIVES

1. **Complete D&D 3.5 Character Creation System**: 7-step wizard with award-winning UX
2. **Advanced Inventory Management**: Drag-and-drop interface with equipment presets
3. **AI-Powered Adventure Engine**: Dynamic encounter and narrative generation
4. **Interactive 3D Dice System**: Physics-based rolling with visual effects
5. **Epic Level Support**: Character progression to level 100 with divine ascension
6. **Professional Gaming UI**: Responsive design with accessibility compliance

### 🚨 CRITICAL SUCCESS FACTORS

- **D&D 3.5 SRD Compliance**: 100% accurate rule implementation
- **Performance Standards**: Sub-2-second load times, 60fps interactions
- **Error-Free Execution**: Comprehensive testing and validation
- **Cross-Platform Compatibility**: Desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 AA compliance for all users
- **Professional Quality**: Commercial-grade user experience

## 🏗️ SYSTEM ARCHITECTURE OVERVIEW

### Core Technology Stack
- **Backend**: Node.js with Express framework
- **Frontend**: Modern JavaScript (ES6+) with dual browser/Node.js compatibility
- **Database**: JSON-based SRD data with efficient caching
- **UI Framework**: Custom responsive design with CSS Grid and Flexbox
- **Testing**: Comprehensive unit, integration, and end-to-end testing
- **Development**: Modular architecture with dependency injection

### Directory Structure Requirements
```
code-repository/
├── src/                           # ALL AI-generated code goes here
│   ├── character/                 # Character creation and management
│   │   ├── character-manager.js           # Core character data management
│   │   ├── character-generator.js         # Random character generation
│   │   ├── character-creation-wizard.js   # 7-step creation wizard
│   │   ├── ability-scores.js              # Ability score generation
│   │   ├── race-manager.js                # Race selection and bonuses
│   │   ├── class-manager.js               # Class selection and progression
│   │   ├── multiclass-engine.js           # Multiclass rule implementation
│   │   ├── character-model.js             # Character data structure
│   │   ├── character-sheet-renderer.js    # Character sheet display
│   │   └── character-storage-manager.js   # Character persistence
│   ├── adventure/                 # AI-Powered Adventure Engine
│   │   ├── adventure-engine.js            # Core adventure orchestration
│   │   ├── ai-integration.js              # ChatGPT/Copilot API integration
│   │   ├── encounter-engine.js            # Combat simulation and encounters
│   │   ├── narrative-generator.js         # AI story generation
│   │   └── world-state-manager.js         # Adventure state persistence
│   ├── dice/                      # High-performance dice engine
│   │   └── dice-engine.js                 # Optimized random generation
│   ├── epic/                      # Epic level progression system
│   │   ├── epic-level-engine.js           # Levels 21-100 progression
│   │   ├── epic-level-manager.js          # Epic level management
│   │   ├── epic-progression-tracker.js    # Progression tracking
│   │   ├── epic-feat-database.js          # Epic feat definitions
│   │   ├── epic-spell-database.js         # Epic spell system
│   │   ├── epic-ability-manager.js        # Epic ability management
│   │   └── divine-ascension-manager.js    # Divine rank and powers
│   ├── portrait/                  # Character portrait generation
│   │   ├── portrait-engine.js             # SVG/Canvas portrait system
│   │   ├── asset-library.js               # Portrait asset management
│   │   ├── customization-engine.js        # Manual customization
│   │   ├── layer-manager.js               # Portrait layer management
│   │   ├── svg-renderer.js                # SVG rendering system
│   │   ├── performance-monitor.js         # Portrait performance
│   │   └── portrait-export-manager.js     # Export functionality
│   ├── story/                     # Story tracker and backstory system
│   │   ├── story-tracker.js               # Character backstory management
│   │   ├── backstory-generator.js         # Automatic story generation
│   │   ├── relationship-manager.js        # NPC and PC relationships
│   │   ├── plot-generator.js              # Plot hook generation
│   │   ├── narrative-ai.js                # AI narrative assistance
│   │   └── story-performance-monitor.js   # Story system performance
│   ├── spells/                    # Complete spellcasting system
│   │   └── spell-manager.js               # Spell selection and management
│   ├── combat/                    # Combat system implementation
│   │   └── combat-manager.js              # Combat resolution engine
│   ├── inventory/                 # Advanced inventory management
│   │   └── [inventory system files]       # Drag-and-drop inventory
│   ├── integration/               # System integration utilities
│   │   └── [integration files]            # Cross-system communication
│   ├── data/                      # SRD data and rule databases
│   │   ├── srd-data-manager.js            # Complete SRD 3.5 rules
│   │   ├── classes.json                   # Class definitions
│   │   ├── classes-expanded.json          # Extended class data
│   │   ├── races.json                     # Race definitions
│   │   ├── races-expanded.json            # Extended race data
│   │   ├── spells.json                    # Spell database
│   │   ├── spells-expanded.json           # Extended spell data
│   │   ├── feats.json                     # Feat definitions
│   │   ├── feats-expanded.json            # Extended feat data
│   │   ├── equipment.json                 # Equipment database
│   │   ├── equipment-expanded.json        # Extended equipment data
│   │   ├── skills.json                    # Skill definitions
│   │   ├── calculations.json              # Calculation formulas
│   │   └── complete-dnd-data.json         # Consolidated SRD data
│   ├── enhanced-character-engine.js       # Main character engine
│   ├── system-integration.js              # System integration layer
│   ├── data-manager.js                    # Data access layer
│   ├── calculation-engine.js              # D&D 3.5 calculations
│   ├── integrated-character-creator.js    # Integrated creation system
│   ├── demo-character-creation.js         # Demo and testing
│   └── test-integration.js                # Integration testing
├── web/                           # Web interface files
│   ├── js/                               # Frontend JavaScript
│   │   └── character-creator-interface.js # Character creator UI
│   ├── css/                              # Stylesheets
│   │   ├── character-creator.css          # Character creator styling
│   │   └── character-sheet.css            # Character sheet styling
│   └── tools/                            # Web tools
│       └── dice-roller.html               # Dice rolling interface
├── server/                        # Server infrastructure
│   └── game-server-enhanced.js           # Production server
├── tests/                         # Testing framework
│   ├── unit/                             # Unit tests
│   ├── integration/                      # Integration tests
│   ├── srd-compliance/                   # SRD compliance tests
│   ├── performance/                      # Performance tests
│   ├── navigation/                       # Navigation tests
│   ├── debug-game-system.js              # System debugging
│   └── IMPLEMENTATION_GUIDE.md           # Testing documentation
├── tables/                        # D&D random tables
│   ├── encounter-tables.js               # Encounter generation
│   ├── treasure-tables.js                # Treasure generation
│   ├── character-generation-tables.js    # Character backgrounds
│   ├── npc-tables.js                     # NPC generation
│   ├── location-tables.js                # Location generation
│   ├── environment-tables.js             # Environmental effects
│   ├── plot-development-tables.js        # Plot hooks
│   ├── random-tables-index.js            # Table coordination
│   ├── random-tables-data-legacy.js      # Legacy table data
│   ├── usage-examples.js                 # Usage demonstrations
│   └── Random_Tables_Compendium_v1.1.pdf # Reference document
├── SRD/                           # Complete D&D 3.5 SRD
│   ├── spells/                           # Spell descriptions
│   ├── monsters/                         # Monster statistics
│   ├── psionics/                         # Psionic system
│   └── README.md                         # SRD organization
├── docs/                          # Code documentation
├── examples/                      # Code examples and demos
└── README.md                      # Code repository overview
```

### 🚨 MANDATORY CODE PLACEMENT RULES

**CRITICAL**: ALL generated code MUST be placed exclusively in `code-repository/` folder or its subfolders. Never place code in root directory or other folders. This is enforced for:
- Project organization and maintainability
- Clear separation between documentation and implementation
- Consistent development patterns across all AI agents
- Quality assurance and testing procedures

## 🎯 CORE SYSTEM IMPLEMENTATION REQUIREMENTS

### 1. CHARACTER CREATION SYSTEM

#### 1.1 Seven-Step Character Creation Wizard
**File**: `code-repository/src/character/character-creation-wizard.js`  
**Priority**: HIGHEST - This is the core user experience

**Requirements**:
- **Step 1: Welcome & Method Selection**
  - Guided vs. Quick creation modes
  - Character concept generator with inspirational artwork
  - Ability score generation method selection (4d6 drop lowest, point buy, standard array)
  - Character creation tutorial for new users

- **Step 2: Ability Score Generation**
  - Interactive ability score assignment with drag-and-drop
  - Real-time racial modifier preview
  - Multiple generation methods with statistical analysis
  - Ability score validation and optimization suggestions

- **Step 3: Race Selection**
  - Rich race descriptions with detailed artwork and lore
  - Ability modifier previews with before/after comparisons
  - Racial features and special abilities explanation
  - Size, speed, language, and skill modifier information

- **Step 4: Class Selection**
  - Comprehensive class feature previews with progression tables
  - Starting equipment packages with customization options
  - Spell access information for spellcasting classes
  - Multiclass compatibility and requirements display

- **Step 5: Skills & Feats**
  - Skill point allocation with maximum ranks enforcement
  - Feat selection with comprehensive prerequisite checking
  - Synergy bonus highlighting and explanation
  - Skill description tooltips and usage examples

- **Step 6: Starting Equipment**
  - Equipment packages vs. individual selection modes
  - Weight and encumbrance calculation with visual feedback
  - Starting gold alternative with shopping interface
  - Equipment customization and magical item options

- **Step 7: Finishing Touches**
  - Character background and personality generation
  - Portrait selection or custom portrait creation
  - Name generation tools with cultural appropriate options
  - Character sheet preview and final validation

**Technical Implementation**:
```javascript
class DnD35CharacterWizard {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.currentStep = 1;
        this.characterData = {};
        this.validationResults = {};
        this.uiElements = {};
    }

    startCreation() {
        // Initialize wizard UI
        this.renderWizardInterface();
        this.setupEventListeners();
        this.showStep(1);
    }

    showStep(stepNumber) {
        // Validate previous step
        if (stepNumber > 1 && !this.validateStep(stepNumber - 1)) {
            return false;
        }
        
        // Render step content
        this.renderStep(stepNumber);
        this.currentStep = stepNumber;
    }

    validateStep(stepNumber) {
        // Comprehensive step validation
        switch(stepNumber) {
            case 1: return this.validateWelcomeStep();
            case 2: return this.validateAbilityScores();
            case 3: return this.validateRaceSelection();
            case 4: return this.validateClassSelection();
            case 5: return this.validateSkillsAndFeats();
            case 6: return this.validateEquipment();
            case 7: return this.validateFinishingTouches();
        }
    }
}
```

#### 1.2 Character Data Model
**File**: `code-repository/src/character/character-model.js`  
**Priority**: HIGH - Foundation for all character operations

**Requirements**:
- Complete D&D 3.5 character data structure
- Real-time calculation integration
- Validation and error checking
- Version control and migration support
- Export/import functionality

**Data Structure**:
```javascript
class DnDCharacter {
    constructor() {
        this.basicInfo = {
            name: '',
            player: '',
            race: '',
            classes: [],
            level: 1,
            alignment: '',
            deity: '',
            size: 'Medium',
            age: 0,
            gender: '',
            height: '',
            weight: '',
            eyes: '',
            hair: '',
            skin: ''
        };

        this.abilities = {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        };

        this.abilityModifiers = {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
        };

        this.combatStats = {
            hitPoints: { current: 0, max: 0, temporary: 0 },
            armorClass: { total: 10, touch: 10, flatFooted: 10 },
            baseAttackBonus: 0,
            grapple: 0,
            initiative: 0,
            speed: { base: 30, armored: 30, fly: 0, swim: 0, climb: 0 }
        };

        this.savingThrows = {
            fortitude: { base: 0, total: 0 },
            reflex: { base: 0, total: 0 },
            will: { base: 0, total: 0 }
        };

        this.skills = {};
        this.feats = [];
        this.equipment = {
            weapons: [],
            armor: [],
            shield: null,
            items: [],
            money: { cp: 0, sp: 0, gp: 0, pp: 0 }
        };

        this.spells = {
            known: {},
            prepared: {},
            slots: {}
        };

        this.racialFeatures = [];
        this.classFeatures = [];
        this.languages = [];
        this.proficiencies = [];
    }
}
```

#### 1.3 Ability Score Generation System
**File**: `code-repository/src/character/ability-scores.js`  
**Priority**: HIGH - Core character foundation

**Requirements**:
- Multiple generation methods (4d6 drop lowest, point buy, standard array)
- Statistical analysis and validation
- Interactive assignment interface
- Racial modifier integration
- Elite array and custom methods

**Implementation**:
```javascript
class AbilityScoreGenerator {
    constructor(diceEngine) {
        this.diceEngine = diceEngine;
        this.methods = {
            'rolling': this.generateByRolling.bind(this),
            'pointBuy': this.generateByPointBuy.bind(this),
            'standardArray': this.generateByStandardArray.bind(this),
            'eliteArray': this.generateByEliteArray.bind(this),
            'custom': this.generateCustom.bind(this)
        };
    }

    generateByRolling(method = '4d6dl1') {
        const scores = [];
        for (let i = 0; i < 6; i++) {
            const roll = this.diceEngine.roll(method);
            scores.push(roll.total);
        }
        return {
            method: 'rolling',
            scores: scores,
            total: scores.reduce((a, b) => a + b, 0),
            statistics: this.calculateStatistics(scores)
        };
    }

    generateByPointBuy(points = 25, minStat = 8, maxStat = 15) {
        return {
            method: 'pointBuy',
            availablePoints: points,
            minStat: minStat,
            maxStat: maxStat,
            costs: this.getPointBuyCosts(),
            scores: [15, 14, 13, 12, 10, 8]
        };
    }

    applyRacialModifiers(baseScores, race) {
        const racialMods = this.getRacialModifiers(race);
        const modifiedScores = { ...baseScores };
        
        Object.keys(racialMods).forEach(ability => {
            modifiedScores[ability] += racialMods[ability];
        });
        
        return modifiedScores;
    }
}
```

### 2. DICE ENGINE SYSTEM

#### 2.1 High-Performance Dice Engine
**File**: `code-repository/src/dice/dice-engine.js`  
**Priority**: HIGH - Used throughout the entire system

**Requirements**:
- Cryptographically secure random number generation
- Complex expression parsing (3d6+2, 4d6dl1, 2d20kh1, etc.)
- Advantage/disadvantage mechanics
- Statistical validation and bias detection
- Performance optimization (<1ms individual rolls)
- Visual dice rolling with 3D physics
- Sound effects and animations
- Roll history and statistics

**Implementation**:
```javascript
class DiceEngine {
    constructor() {
        this.random = this.initializeSecureRandom();
        this.rollHistory = [];
        this.statistics = {
            totalRolls: 0,
            averages: {},
            distributions: {}
        };
        this.expressionCache = new Map();
    }

    initializeSecureRandom() {
        // Use Web Crypto API for secure random generation
        if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
            return (max) => {
                const array = new Uint32Array(1);
                window.crypto.getRandomValues(array);
                return Math.floor((array[0] / (0xffffffff + 1)) * max) + 1;
            };
        } else if (typeof require !== 'undefined') {
            const crypto = require('crypto');
            return (max) => {
                const bytes = crypto.randomBytes(4);
                const value = bytes.readUInt32BE(0);
                return Math.floor((value / (0xffffffff + 1)) * max) + 1;
            };
        } else {
            // Fallback to Math.random (not cryptographically secure)
            return (max) => Math.floor(Math.random() * max) + 1;
        }
    }

    roll(expression) {
        const startTime = performance.now();
        
        // Parse expression
        const parsedExpression = this.parseExpression(expression);
        
        // Execute roll
        const result = this.executeRoll(parsedExpression);
        
        // Record statistics
        const endTime = performance.now();
        result.executionTime = endTime - startTime;
        
        this.recordRoll(result);
        
        return result;
    }

    parseExpression(expression) {
        // Cache parsed expressions for performance
        if (this.expressionCache.has(expression)) {
            return this.expressionCache.get(expression);
        }

        const parsed = this.parseComplexExpression(expression);
        this.expressionCache.set(expression, parsed);
        return parsed;
    }

    parseComplexExpression(expression) {
        // Handle complex expressions like "3d6+2d4-1+5"
        const parts = expression.match(/([+-]?)(\d*d\d+(?:[dk][hl]\d+)?|\d+)/g);
        
        return parts.map(part => {
            const sign = part.startsWith('-') ? -1 : 1;
            const cleanPart = part.replace(/^[+-]/, '');
            
            if (cleanPart.includes('d')) {
                return { type: 'dice', ...this.parseDiceNotation(cleanPart), sign };
            } else {
                return { type: 'modifier', value: parseInt(cleanPart), sign };
            }
        });
    }

    parseDiceNotation(notation) {
        // Parse dice notation like "4d6dl1" or "2d20kh1"
        const match = notation.match(/(\d+)d(\d+)(?:([dk])([hl])(\d+))?/);
        
        if (!match) {
            throw new Error(`Invalid dice notation: ${notation}`);
        }

        return {
            count: parseInt(match[1]),
            sides: parseInt(match[2]),
            modifier: match[3] ? {
                type: match[3], // 'd' for drop, 'k' for keep
                direction: match[4], // 'h' for highest, 'l' for lowest
                amount: parseInt(match[5])
            } : null
        };
    }

    executeRoll(parsedExpression) {
        const results = {
            expression: this.reconstructExpression(parsedExpression),
            parts: [],
            total: 0,
            breakdown: []
        };

        parsedExpression.forEach(part => {
            if (part.type === 'dice') {
                const diceResult = this.rollDice(part);
                results.parts.push(diceResult);
                results.total += diceResult.total * part.sign;
                results.breakdown.push(`${diceResult.total}${part.sign === -1 ? ' (negative)' : ''}`);
            } else if (part.type === 'modifier') {
                const value = part.value * part.sign;
                results.total += value;
                results.breakdown.push(`${value > 0 ? '+' : ''}${value}`);
            }
        });

        return results;
    }

    rollDice(diceSpec) {
        const rolls = [];
        
        // Roll all dice
        for (let i = 0; i < diceSpec.count; i++) {
            rolls.push(this.random(diceSpec.sides));
        }

        let finalRolls = [...rolls];

        // Apply modifiers (drop/keep)
        if (diceSpec.modifier) {
            finalRolls = this.applyDiceModifier(rolls, diceSpec.modifier);
        }

        return {
            notation: this.reconstructDiceNotation(diceSpec),
            allRolls: rolls,
            finalRolls: finalRolls,
            total: finalRolls.reduce((sum, roll) => sum + roll, 0),
            modifier: diceSpec.modifier
        };
    }

    applyDiceModifier(rolls, modifier) {
        const sortedRolls = [...rolls].sort((a, b) => 
            modifier.direction === 'h' ? b - a : a - b
        );

        if (modifier.type === 'd') {
            // Drop dice
            return sortedRolls.slice(modifier.amount);
        } else if (modifier.type === 'k') {
            // Keep dice
            return sortedRolls.slice(0, modifier.amount);
        }

        return rolls;
    }

    // Advantage/Disadvantage system
    rollWithAdvantage(expression) {
        if (!expression.includes('d20')) {
            throw new Error('Advantage only applies to d20 rolls');
        }

        const roll1 = this.roll(expression);
        const roll2 = this.roll(expression);

        return {
            type: 'advantage',
            roll1: roll1,
            roll2: roll2,
            result: roll1.total >= roll2.total ? roll1 : roll2,
            total: Math.max(roll1.total, roll2.total)
        };
    }

    rollWithDisadvantage(expression) {
        if (!expression.includes('d20')) {
            throw new Error('Disadvantage only applies to d20 rolls');
        }

        const roll1 = this.roll(expression);
        const roll2 = this.roll(expression);

        return {
            type: 'disadvantage',
            roll1: roll1,
            roll2: roll2,
            result: roll1.total <= roll2.total ? roll1 : roll2,
            total: Math.min(roll1.total, roll2.total)
        };
    }

    // Statistical analysis
    recordRoll(result) {
        this.rollHistory.push({
            timestamp: Date.now(),
            expression: result.expression,
            total: result.total,
            executionTime: result.executionTime
        });

        this.updateStatistics(result);
    }

    updateStatistics(result) {
        this.statistics.totalRolls++;
        
        if (!this.statistics.averages[result.expression]) {
            this.statistics.averages[result.expression] = {
                total: 0,
                count: 0,
                average: 0
            };
        }

        const expr = this.statistics.averages[result.expression];
        expr.total += result.total;
        expr.count++;
        expr.average = expr.total / expr.count;
    }

    getStatistics() {
        return {
            ...this.statistics,
            recentRolls: this.rollHistory.slice(-50),
            performanceMetrics: {
                averageExecutionTime: this.calculateAverageExecutionTime(),
                totalExecutionTime: this.calculateTotalExecutionTime()
            }
        };
    }
}
```

### 3. DATA MANAGEMENT SYSTEM

#### 3.1 D&D 3.5 SRD Data Manager
**File**: `code-repository/src/data/srd-data-manager.js`  
**Priority**: HIGHEST - Foundation for all D&D rules

**Requirements**:
- Complete D&D 3.5 SRD data integration
- Efficient data loading and caching
- Rule validation and compliance checking
- Data versioning and updates
- Performance optimization

**Implementation**:
```javascript
class SRDDataManager {
    constructor() {
        this.data = {
            classes: null,
            races: null,
            spells: null,
            feats: null,
            equipment: null,
            skills: null,
            monsters: null
        };
        this.cache = new Map();
        this.isLoaded = false;
        this.version = '3.5.0';
    }

    async initialize() {
        if (this.isLoaded) return;

        console.log('Loading D&D 3.5 SRD data...');
        
        try {
            // Load all SRD data files
            await Promise.all([
                this.loadClasses(),
                this.loadRaces(),
                this.loadSpells(),
                this.loadFeats(),
                this.loadEquipment(),
                this.loadSkills(),
                this.loadMonsters()
            ]);

            this.isLoaded = true;
            console.log('D&D 3.5 SRD data loaded successfully');
            
        } catch (error) {
            console.error('Failed to load SRD data:', error);
            throw error;
        }
    }

    async loadClasses() {
        const classesData = await this.loadDataFile('classes.json');
        const expandedData = await this.loadDataFile('classes-expanded.json');
        
        this.data.classes = this.mergeDataSets(classesData, expandedData);
        this.validateClassData();
    }

    async loadRaces() {
        const racesData = await this.loadDataFile('races.json');
        const expandedData = await this.loadDataFile('races-expanded.json');
        
        this.data.races = this.mergeDataSets(racesData, expandedData);
        this.validateRaceData();
    }

    async loadSpells() {
        const spellsData = await this.loadDataFile('spells.json');
        const expandedData = await this.loadDataFile('spells-expanded.json');
        
        this.data.spells = this.mergeDataSets(spellsData, expandedData);
        this.validateSpellData();
    }

    async loadDataFile(filename) {
        const cacheKey = `dataFile:${filename}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            let data;
            
            if (typeof window !== 'undefined') {
                // Browser environment
                const response = await fetch(`/code-repository/src/data/${filename}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                data = await response.json();
            } else {
                // Node.js environment
                const fs = require('fs').promises;
                const path = require('path');
                const filePath = path.join(__dirname, filename);
                const fileContent = await fs.readFile(filePath, 'utf8');
                data = JSON.parse(fileContent);
            }

            this.cache.set(cacheKey, data);
            return data;
            
        } catch (error) {
            console.error(`Failed to load ${filename}:`, error);
            throw error;
        }
    }

    // Data access methods
    getClasses() {
        this.ensureLoaded();
        return this.data.classes;
    }

    getClass(className) {
        const classes = this.getClasses();
        return classes.find(cls => cls.name.toLowerCase() === className.toLowerCase());
    }

    getRaces() {
        this.ensureLoaded();
        return this.data.races;
    }

    getRace(raceName) {
        const races = this.getRaces();
        return races.find(race => race.name.toLowerCase() === raceName.toLowerCase());
    }

    getSpells(filters = {}) {
        this.ensureLoaded();
        let spells = this.data.spells;

        // Apply filters
        if (filters.class) {
            spells = spells.filter(spell => 
                spell.classes.some(cls => cls.name.toLowerCase() === filters.class.toLowerCase())
            );
        }

        if (filters.level !== undefined) {
            spells = spells.filter(spell =>
                spell.classes.some(cls => 
                    cls.name.toLowerCase() === filters.class.toLowerCase() && 
                    cls.level === filters.level
                )
            );
        }

        if (filters.school) {
            spells = spells.filter(spell => 
                spell.school.toLowerCase() === filters.school.toLowerCase()
            );
        }

        return spells;
    }

    getFeats(filters = {}) {
        this.ensureLoaded();
        let feats = this.data.feats;

        if (filters.type) {
            feats = feats.filter(feat => feat.type === filters.type);
        }

        if (filters.availableFor) {
            // Filter feats available for a specific character
            feats = feats.filter(feat => this.isFeatAvailable(feat, filters.availableFor));
        }

        return feats;
    }

    isFeatAvailable(feat, character) {
        // Check all prerequisites
        if (feat.prerequisites) {
            return this.checkPrerequisites(feat.prerequisites, character);
        }
        return true;
    }

    checkPrerequisites(prerequisites, character) {
        for (const prereq of prerequisites) {
            switch (prereq.type) {
                case 'ability':
                    if (character.abilities[prereq.ability] < prereq.value) {
                        return false;
                    }
                    break;
                case 'skill':
                    const skillRanks = character.skills[prereq.skill]?.ranks || 0;
                    if (skillRanks < prereq.ranks) {
                        return false;
                    }
                    break;
                case 'feat':
                    if (!character.feats.includes(prereq.feat)) {
                        return false;
                    }
                    break;
                case 'class':
                    const hasClass = character.classes.some(cls => 
                        cls.name === prereq.class && cls.level >= prereq.level
                    );
                    if (!hasClass) {
                        return false;
                    }
                    break;
                case 'race':
                    if (character.race !== prereq.race) {
                        return false;
                    }
                    break;
            }
        }
        return true;
    }

    // Data validation methods
    validateClassData() {
        const requiredFields = ['name', 'hitDie', 'skillPoints', 'classSkills', 'proficiencies'];
        this.data.classes.forEach(cls => {
            requiredFields.forEach(field => {
                if (!cls[field]) {
                    throw new Error(`Class ${cls.name} missing required field: ${field}`);
                }
            });
        });
    }

    validateRaceData() {
        const requiredFields = ['name', 'size', 'speed', 'abilityAdjustments'];
        this.data.races.forEach(race => {
            requiredFields.forEach(field => {
                if (race[field] === undefined) {
                    throw new Error(`Race ${race.name} missing required field: ${field}`);
                }
            });
        });
    }

    validateSpellData() {
        const requiredFields = ['name', 'school', 'level', 'castingTime', 'range', 'duration'];
        this.data.spells.forEach(spell => {
            requiredFields.forEach(field => {
                if (!spell[field]) {
                    throw new Error(`Spell ${spell.name} missing required field: ${field}`);
                }
            });
        });
    }

    ensureLoaded() {
        if (!this.isLoaded) {
            throw new Error('SRD data not loaded. Call initialize() first.');
        }
    }

    getAllData() {
        this.ensureLoaded();
        return { ...this.data };
    }

    clearCache() {
        this.cache.clear();
    }

    getDataVersion() {
        return this.version;
    }
}
```

### 4. CALCULATION ENGINE

#### 4.1 D&D 3.5 Calculation Engine
**File**: `code-repository/src/calculation-engine.js`  
**Priority**: HIGHEST - All D&D rules calculations

**Requirements**:
- Complete D&D 3.5 rule calculations
- Ability score modifiers
- Saving throws and combat statistics
- Skill bonuses and synergies
- Spell save DCs and caster levels
- Multiclass penalties and bonuses

**Implementation**:
```javascript
class DnDCalculationEngine {
    constructor() {
        this.gameData = null;
        this.calculationCache = new Map();
    }

    initialize(gameData) {
        this.gameData = gameData;
        this.calculationCache.clear();
    }

    // Ability Score Calculations
    calculateAbilityModifier(abilityScore) {
        return Math.floor((abilityScore - 10) / 2);
    }

    calculateAllAbilityModifiers(abilities) {
        const modifiers = {};
        Object.keys(abilities).forEach(ability => {
            modifiers[ability] = this.calculateAbilityModifier(abilities[ability]);
        });
        return modifiers;
    }

    applyRacialAbilityAdjustments(baseAbilities, raceName) {
        const race = this.gameData.races.find(r => r.name === raceName);
        if (!race || !race.abilityAdjustments) {
            return { ...baseAbilities };
        }

        const adjustedAbilities = { ...baseAbilities };
        Object.keys(race.abilityAdjustments).forEach(ability => {
            adjustedAbilities[ability] += race.abilityAdjustments[ability];
            
            // Ensure abilities don't go below 1
            if (adjustedAbilities[ability] < 1) {
                adjustedAbilities[ability] = 1;
            }
        });

        return adjustedAbilities;
    }

    // Combat Statistics
    calculateArmorClass(character) {
        const dexMod = this.calculateAbilityModifier(character.abilities.dexterity);
        let ac = {
            base: 10,
            dexterity: dexMod,
            armor: 0,
            shield: 0,
            natural: 0,
            deflection: 0,
            dodge: 0,
            size: this.getSizeModifier(character.size),
            misc: 0
        };

        // Calculate armor bonus
        if (character.equipment.armor.length > 0) {
            const armor = character.equipment.armor[0]; // Primary armor
            ac.armor = armor.acBonus || 0;
            
            // Apply max dex bonus
            if (armor.maxDexBonus !== undefined) {
                ac.dexterity = Math.min(ac.dexterity, armor.maxDexBonus);
            }
        }

        // Calculate shield bonus
        if (character.equipment.shield) {
            ac.shield = character.equipment.shield.acBonus || 0;
        }

        // Calculate total AC
        ac.total = Object.values(ac).reduce((sum, value) => sum + value, 0);
        ac.touch = ac.base + ac.dexterity + ac.deflection + ac.dodge + ac.size;
        ac.flatFooted = ac.total - ac.dexterity - ac.dodge;

        return ac;
    }

    calculateBaseAttackBonus(character) {
        let totalBAB = 0;
        
        character.classes.forEach(cls => {
            const classData = this.gameData.classes.find(c => c.name === cls.name);
            if (classData) {
                totalBAB += this.getClassBAB(classData, cls.level);
            }
        });

        return totalBAB;
    }

    getClassBAB(classData, level) {
        const progression = classData.baseAttackBonus || 'poor';
        
        switch (progression) {
            case 'good':
                return level;
            case 'average':
                return Math.floor(level * 3 / 4);
            case 'poor':
            default:
                return Math.floor(level / 2);
        }
    }

    calculateSavingThrows(character) {
        const saves = {
            fortitude: { base: 0, ability: 0, misc: 0 },
            reflex: { base: 0, ability: 0, misc: 0 },
            will: { base: 0, ability: 0, misc: 0 }
        };

        // Calculate base saves from classes
        character.classes.forEach(cls => {
            const classData = this.gameData.classes.find(c => c.name === cls.name);
            if (classData && classData.savingThrows) {
                saves.fortitude.base += this.getClassSave(classData.savingThrows.fortitude, cls.level);
                saves.reflex.base += this.getClassSave(classData.savingThrows.reflex, cls.level);
                saves.will.base += this.getClassSave(classData.savingThrows.will, cls.level);
            }
        });

        // Apply ability modifiers
        saves.fortitude.ability = this.calculateAbilityModifier(character.abilities.constitution);
        saves.reflex.ability = this.calculateAbilityModifier(character.abilities.dexterity);
        saves.will.ability = this.calculateAbilityModifier(character.abilities.wisdom);

        // Calculate totals
        Object.keys(saves).forEach(save => {
            saves[save].total = saves[save].base + saves[save].ability + saves[save].misc;
        });

        return saves;
    }

    getClassSave(saveProgression, level) {
        if (saveProgression === 'good') {
            return 2 + Math.floor(level / 2);
        } else {
            return Math.floor(level / 3);
        }
    }

    // Skill Calculations
    calculateSkillBonus(character, skillName) {
        const skill = character.skills[skillName];
        if (!skill) return 0;

        const skillData = this.gameData.skills.find(s => s.name === skillName);
        if (!skillData) return 0;

        let bonus = {
            ranks: skill.ranks || 0,
            ability: this.calculateAbilityModifier(character.abilities[skillData.keyAbility]),
            misc: skill.miscModifier || 0,
            synergy: 0
        };

        // Calculate synergy bonuses
        bonus.synergy = this.calculateSynergyBonus(character, skillName);

        // Apply armor check penalty if applicable
        if (skillData.armorCheckPenalty) {
            bonus.armorCheckPenalty = this.calculateArmorCheckPenalty(character);
        }

        bonus.total = Object.values(bonus).reduce((sum, value) => sum + value, 0);
        return bonus;
    }

    calculateSynergyBonus(character, skillName) {
        let synergyBonus = 0;
        const synergySkills = this.getSynergySkills(skillName);
        
        synergySkills.forEach(synergySkill => {
            const skill = character.skills[synergySkill];
            if (skill && skill.ranks >= 5) {
                synergyBonus += 2;
            }
        });

        return synergyBonus;
    }

    getSynergySkills(skillName) {
        // Define synergy relationships
        const synergies = {
            'Bluff': ['Diplomacy', 'Disguise', 'Intimidate', 'Sleight of Hand'],
            'Knowledge (arcana)': ['Spellcraft'],
            'Knowledge (dungeoneering)': ['Survival'],
            'Knowledge (engineering)': ['Search'],
            'Knowledge (geography)': ['Survival'],
            'Knowledge (history)': ['Bardic Knowledge'],
            'Knowledge (local)': ['Gather Information'],
            'Knowledge (nature)': ['Survival'],
            'Knowledge (nobility)': ['Diplomacy'],
            'Knowledge (religion)': ['Turn Undead'],
            'Knowledge (the planes)': ['Survival'],
            'Search': ['Survival'],
            'Spellcraft': ['Use Magic Device'],
            'Tumble': ['Balance', 'Jump']
        };

        return synergies[skillName] || [];
    }

    calculateArmorCheckPenalty(character) {
        let penalty = 0;
        
        if (character.equipment.armor.length > 0) {
            penalty += character.equipment.armor[0].armorCheckPenalty || 0;
        }
        
        if (character.equipment.shield) {
            penalty += character.equipment.shield.armorCheckPenalty || 0;
        }

        return penalty;
    }

    // Spell Calculations
    calculateSpellSaveDC(spell, character, casterClass) {
        const classData = this.gameData.classes.find(c => c.name === casterClass);
        if (!classData) return 10;

        const spellLevel = this.getSpellLevel(spell, casterClass);
        const keyAbility = classData.spellcasting?.keyAbility || 'intelligence';
        const abilityMod = this.calculateAbilityModifier(character.abilities[keyAbility]);

        return 10 + spellLevel + abilityMod;
    }

    getSpellLevel(spell, casterClass) {
        const classSpell = spell.classes.find(c => c.name === casterClass);
        return classSpell ? classSpell.level : 0;
    }

    calculateCasterLevel(character, casterClass) {
        const cls = character.classes.find(c => c.name === casterClass);
        return cls ? cls.level : 0;
    }

    // Utility Methods
    getSizeModifier(size) {
        const sizeModifiers = {
            'Fine': 8,
            'Diminutive': 4,
            'Tiny': 2,
            'Small': 1,
            'Medium': 0,
            'Large': -1,
            'Huge': -2,
            'Gargantuan': -4,
            'Colossal': -8
        };
        
        return sizeModifiers[size] || 0;
    }

    // Performance optimization
    clearCalculationCache() {
        this.calculationCache.clear();
    }

    getCachedCalculation(key, calculationFunction) {
        if (this.calculationCache.has(key)) {
            return this.calculationCache.get(key);
        }

        const result = calculationFunction();
        this.calculationCache.set(key, result);
        return result;
    }
}
```

### 5. WEB INTERFACE INTEGRATION

#### 5.1 Browser Compatibility and Global References
**Files**: Multiple files with global exports  
**Priority**: CRITICAL - Required for HTML integration

**Requirements**:
- Dual browser/Node.js compatibility
- Global window object exports for HTML onclick handlers
- Module loading with proper initialization order
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

**Global Export Pattern**:
```javascript
// At the end of every module file
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = ClassName;
} else if (typeof window !== 'undefined') {
    // Browser environment
    window.ClassName = ClassName;
}

// Example for enhanced-character-engine.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RulzLawyerCharacterEngine };
} else if (typeof window !== 'undefined') {
    window.RulzLawyerCharacterEngine = RulzLawyerCharacterEngine;
    
    // Initialize global references for HTML integration
    window.characterEngine = null;
    window.gameActions = {};
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCharacterSystem);
    } else {
        initializeCharacterSystem();
    }
}

function initializeCharacterSystem() {
    try {
        window.characterEngine = new RulzLawyerCharacterEngine();
        window.characterEngine.initialize();
        
        // Set up global action handlers for HTML buttons
        window.gameActions = {
            startCharacterCreation: () => window.characterEngine.startCharacterWizard(),
            generateRandomCharacter: () => window.characterEngine.generateRandomCharacter(),
            saveCharacter: () => window.characterEngine.saveCurrentCharacter(),
            loadCharacter: () => window.characterEngine.showLoadCharacterDialog(),
            rollDice: (expression) => window.diceEngine.roll(expression),
            startAdventure: () => window.adventureEngine.startNewAdventure()
        };
        
        console.log('✅ RulzLawyer character system initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize character system:', error);
        
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'system-error';
        errorDiv.innerHTML = `
            <h3>System Initialization Error</h3>
            <p>Failed to initialize character system. Please refresh and try again.</p>
            <details>
                <summary>Technical Details</summary>
                <pre>${error.message}</pre>
            </details>
        `;
        document.body.appendChild(errorDiv);
    }
}
```

This completes Part 1 of the comprehensive AI agent instructions, covering the foundation systems, core architecture, character creation, dice engine, data management, calculation engine, and web interface integration. The document provides detailed implementation requirements with code examples and technical specifications for building the RulzLawyer D&D 3.5 gaming system.

**Total Lines**: Approximately 2000 lines  
**Next Document**: Part 2 will cover Adventure Engine, Inventory Management, Spell Systems, and Combat Engine implementation.
/**
 * Enhanced Character Engine - Main Integration Hub for RulzLawyer D&D 3.5
 * 
 * Features:
 * - Complete character creation workflow integration
 * - Real-time stat calculations and validation
 * - Spell system integration for spellcasting classes
 * - Equipment and inventory management
 * - Save/load character functionality
 * - Web interface connectivity
 * - Performance optimization with caching
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

// Import core systems
const DiceEngine = require('./dice/dice-engine.js');
const CalculationEngine = require('./calculation-engine.js');
const SRDDataManager = require('./data/srd-data-manager.js');
const CharacterModel = require('./character/character-model.js');
const CharacterCreationWizard = require('./character/character-creation-wizard.js');

class RulzLawyerCharacterEngine {
    constructor() {
        // Core system instances
        this.diceEngine = new DiceEngine();
        this.calculationEngine = new CalculationEngine();
        this.srdDataManager = new SRDDataManager();
        
        // Character management
        this.currentCharacter = null;
        this.characterHistory = [];
        this.activeWizard = null;
        
        // System state
        this.isInitialized = false;
        this.eventListeners = new Map();
        this.cache = new Map();
        
        // Configuration
        this.config = {
            autoSave: true,
            autoCalculate: true,
            validateInput: true,
            cacheResults: true,
            maxCharacterHistory: 50
        };

        console.log('🎲 RulzLawyer Character Engine created');
    }

    /**
     * Initialize all systems and load data
     */
    async initialize() {
        if (this.isInitialized) {
            console.log('⚠️ Character Engine already initialized');
            return;
        }

        try {
            console.log('🚀 Initializing RulzLawyer Character Engine...');
            
            // Initialize calculation engine with SRD data
            this.calculationEngine.initialize(this.srdDataManager.getAllData());
            
            // Set up event system
            this.setupEventSystem();
            
            // Load any saved characters
            await this.loadSavedCharacters();
            
            this.isInitialized = true;
            console.log('✅ RulzLawyer Character Engine initialized successfully');
            
            // Emit initialization complete event
            this.emit('initialized', { timestamp: Date.now() });
            
        } catch (error) {
            console.error('❌ Failed to initialize Character Engine:', error);
            throw error;
        }
    }

    /**
     * Set up event system for component communication
     */
    setupEventSystem() {
        this.events = {
            CHARACTER_CREATED: 'character_created',
            CHARACTER_UPDATED: 'character_updated',
            CHARACTER_LOADED: 'character_loaded',
            CHARACTER_SAVED: 'character_saved',
            WIZARD_STEP_COMPLETED: 'wizard_step_completed',
            CALCULATION_UPDATED: 'calculation_updated',
            ERROR_OCCURRED: 'error_occurred'
        };
    }

    /**
     * Event listener management
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // ===== CHARACTER CREATION METHODS =====

    /**
     * Start the character creation wizard
     */
    startCharacterWizard(options = {}) {
        console.log('🧙‍♂️ Starting Character Creation Wizard');
        
        try {
            this.activeWizard = new CharacterCreationWizard();
            this.activeWizard.initialize(this.srdDataManager);
            
            // Set up wizard event handlers
            this.setupWizardEventHandlers();
            
            // Configure wizard options
            if (options.autoAdvance) {
                this.activeWizard.setAutoAdvance(true);
            }
            
            if (options.skipValidation) {
                this.activeWizard.setValidation(false);
            }
            
            // Start wizard
            this.activeWizard.start();
            
            this.emit(this.events.WIZARD_STEP_COMPLETED, {
                step: 0,
                total: this.activeWizard.totalSteps,
                message: 'Character wizard started'
            });
            
            return this.activeWizard;
            
        } catch (error) {
            console.error('❌ Failed to start character wizard:', error);
            this.emit(this.events.ERROR_OCCURRED, { error: error.message, context: 'wizard_start' });
            throw error;
        }
    }

    /**
     * Set up wizard event handlers
     */
    setupWizardEventHandlers() {
        if (!this.activeWizard) return;
        
        this.activeWizard.on('step_completed', (data) => {
            this.emit(this.events.WIZARD_STEP_COMPLETED, data);
            
            // Auto-calculate stats if enabled
            if (this.config.autoCalculate && this.activeWizard.character) {
                this.updateCharacterStats(this.activeWizard.character);
            }
        });
        
        this.activeWizard.on('character_completed', (character) => {
            this.currentCharacter = character;
            this.addToHistory(character);
            this.emit(this.events.CHARACTER_CREATED, { character });
            
            if (this.config.autoSave) {
                this.saveCharacter(character);
            }
        });
        
        this.activeWizard.on('validation_error', (error) => {
            this.emit(this.events.ERROR_OCCURRED, { error: error.message, context: 'wizard_validation' });
        });
    }

    /**
     * Generate a random character
     */
    async generateRandomCharacter(options = {}) {
        console.log('🎲 Generating random character...');
        
        try {
            const character = new CharacterModel(this.srdDataManager);
            
            // Generate random race
            const races = this.srdDataManager.getRaces();
            const randomRace = races[Math.floor(Math.random() * races.length)];
            character.setRace(randomRace.name);
            
            // Generate random class
            const classes = this.srdDataManager.getClasses();
            const randomClass = classes[Math.floor(Math.random() * classes.length)];
            character.setClass(randomClass.name, options.level || 1);
            
            // Generate ability scores
            const abilityScores = this.diceEngine.rollAbilityScores(options.method || '4d6dl1');
            const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
            
            abilities.forEach((ability, index) => {
                character.setAbilityScore(ability, abilityScores.scores[index]);
            });
            
            // Apply racial modifiers
            character.applyRacialModifiers();
            
            // Generate random name
            character.name = this.generateRandomName(randomRace.name);
            
            // Generate random alignment
            const alignments = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 
                              'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
                              'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];
            character.alignment = alignments[Math.floor(Math.random() * alignments.length)];
            
            // Allocate skills automatically
            await this.autoAllocateSkills(character);
            
            // Select starting feats
            await this.autoSelectFeats(character);
            
            // Generate starting equipment
            await this.generateStartingEquipment(character);
            
            // Calculate all stats
            this.updateCharacterStats(character);
            
            this.currentCharacter = character;
            this.addToHistory(character);
            
            console.log(`✅ Generated random ${character.race} ${character.characterClass}: ${character.name}`);
            
            this.emit(this.events.CHARACTER_CREATED, { character, type: 'random' });
            
            return character;
            
        } catch (error) {
            console.error('❌ Failed to generate random character:', error);
            this.emit(this.events.ERROR_OCCURRED, { error: error.message, context: 'random_generation' });
            throw error;
        }
    }

    /**
     * Update all character statistics
     */
    updateCharacterStats(character) {
        if (!character) return;
        
        try {
            // Calculate ability modifiers
            const abilityModifiers = this.calculationEngine.calculateAllAbilityModifiers(character.abilities);
            character.abilityModifiers = abilityModifiers;
            
            // Calculate armor class
            const armorClass = this.calculationEngine.calculateArmorClass(character);
            character.armorClass = armorClass.total;
            character.touchAC = armorClass.touch;
            character.flatFootedAC = armorClass.flatFooted;
            
            // Calculate saving throws
            const savingThrows = this.calculationEngine.calculateSavingThrows(character);
            character.savingThrows = savingThrows;
            
            // Calculate base attack bonus
            character.baseAttackBonus = this.calculationEngine.calculateBaseAttackBonus(character);
            
            // Calculate hit points
            const hitPoints = this.calculationEngine.calculateHitPoints(character);
            character.hitPoints = hitPoints.current;
            character.maxHitPoints = hitPoints.max;
            
            // Calculate initiative
            const initiative = this.calculationEngine.calculateInitiative(character);
            character.initiative = initiative.total;
            
            // Update skill bonuses
            if (character.skills) {
                Object.keys(character.skills).forEach(skillName => {
                    const skillBonus = this.calculationEngine.calculateSkillBonus(character, skillName);
                    character.skills[skillName].totalBonus = skillBonus.total;
                    character.skills[skillName].breakdown = skillBonus.breakdown;
                });
            }
            
            this.emit(this.events.CALCULATION_UPDATED, { character });
            
        } catch (error) {
            console.error('❌ Error updating character stats:', error);
            this.emit(this.events.ERROR_OCCURRED, { error: error.message, context: 'stat_calculation' });
        }
    }

    // ===== AUTOMATIC GENERATION HELPERS =====

    /**
     * Generate random name based on race
     */
    generateRandomName(raceName) {
        const nameData = {
            'Human': ['Aerdeth', 'Ahern', 'Aramil', 'Bereris', 'Cithreth', 'Dayereth', 'Drannor', 'Enna', 'Galinndan', 'Hadarai'],
            'Elf': ['Adran', 'Aelar', 'Aramil', 'Berrian', 'Dayereth', 'Drannor', 'Enna', 'Galinndan', 'Hadarai', 'Halimath'],
            'Dwarf': ['Adrik', 'Alberich', 'Baern', 'Darrak', 'Delg', 'Eberk', 'Einkil', 'Fargrim', 'Flint', 'Gardain'],
            'Halfling': ['Alton', 'Ander', 'Cade', 'Corrin', 'Eldon', 'Errich', 'Finnan', 'Garret', 'Lindal', 'Lyle'],
            'Gnome': ['Alston', 'Alvyn', 'Boddynock', 'Brocc', 'Burgell', 'Dimble', 'Eldon', 'Erky', 'Fonkin', 'Frug'],
            'Half-Elf': ['Aerdeth', 'Aramil', 'Berrian', 'Dayereth', 'Drannor', 'Enna', 'Galinndan', 'Hadarai', 'Halimath', 'Heian'],
            'Half-Orc': ['Dench', 'Feng', 'Gell', 'Henk', 'Holg', 'Imsh', 'Keth', 'Krusk', 'Mhurren', 'Ront']
        };
        
        const names = nameData[raceName] || nameData['Human'];
        return names[Math.floor(Math.random() * names.length)];
    }

    /**
     * Automatically allocate skill points
     */
    async autoAllocateSkills(character) {
        const characterClass = this.srdDataManager.findClass(character.characterClass);
        if (!characterClass) return;
        
        const skillPoints = characterClass.skillPoints + this.calculationEngine.calculateAbilityModifier(character.abilities.intelligence);
        const availableSkills = this.srdDataManager.getSkillsForClass(character.characterClass);
        
        // Prioritize class skills
        const classSkills = availableSkills.filter(skill => skill.isClassSkill);
        const crossClassSkills = availableSkills.filter(skill => !skill.isClassSkill);
        
        let remainingPoints = skillPoints;
        character.skills = {};
        
        // Allocate to class skills first
        classSkills.forEach(skill => {
            if (remainingPoints > 0) {
                const ranks = Math.min(remainingPoints, 4); // Max 4 ranks at level 1
                character.skills[skill.name] = {
                    ranks: ranks,
                    isClassSkill: true,
                    miscModifier: 0
                };
                remainingPoints -= ranks;
            }
        });
        
        // Use remaining points on cross-class skills
        crossClassSkills.forEach(skill => {
            if (remainingPoints > 1) {
                const ranks = Math.min(Math.floor(remainingPoints / 2), 2); // Max 2 ranks at level 1 for cross-class
                character.skills[skill.name] = {
                    ranks: ranks,
                    isClassSkill: false,
                    miscModifier: 0
                };
                remainingPoints -= ranks * 2;
            }
        });
    }

    /**
     * Automatically select appropriate feats
     */
    async autoSelectFeats(character) {
        const availableFeats = this.srdDataManager.getFeatsForLevel(character.level);
        const characterClass = this.srdDataManager.findClass(character.characterClass);
        
        character.feats = [];
        
        // Every character gets a feat at level 1
        let numFeats = 1;
        
        // Humans get bonus feat
        if (character.race === 'Human') {
            numFeats++;
        }
        
        // Some classes get bonus feats
        if (characterClass && characterClass.bonusFeats) {
            numFeats += characterClass.bonusFeats.filter(f => f.level <= character.level).length;
        }
        
        // Select appropriate feats
        const combatFeats = availableFeats.filter(f => f.type === 'Combat');
        const generalFeats = availableFeats.filter(f => f.type === 'General');
        
        for (let i = 0; i < numFeats && availableFeats.length > 0; i++) {
            let selectedFeat;
            
            // Prefer combat feats for martial classes
            if (['Fighter', 'Ranger', 'Paladin', 'Barbarian'].includes(character.characterClass) && combatFeats.length > 0) {
                selectedFeat = combatFeats[Math.floor(Math.random() * combatFeats.length)];
            } else {
                selectedFeat = availableFeats[Math.floor(Math.random() * availableFeats.length)];
            }
            
            character.feats.push(selectedFeat.name);
            
            // Remove selected feat from available list
            const index = availableFeats.indexOf(selectedFeat);
            if (index > -1) {
                availableFeats.splice(index, 1);
            }
        }
    }

    /**
     * Generate starting equipment
     */
    async generateStartingEquipment(character) {
        const characterClass = this.srdDataManager.findClass(character.characterClass);
        if (!characterClass) return;
        
        character.equipment = {
            weapons: [],
            armor: [],
            shield: null,
            items: [],
            money: { cp: 0, sp: 0, gp: 0, pp: 0 }
        };
        
        // Starting gold based on class
        const startingGold = {
            'Barbarian': this.diceEngine.roll('4d4').total * 10,
            'Bard': this.diceEngine.roll('4d4').total * 10,
            'Cleric': this.diceEngine.roll('5d4').total * 10,
            'Druid': this.diceEngine.roll('2d4').total * 10,
            'Fighter': this.diceEngine.roll('6d4').total * 10,
            'Monk': this.diceEngine.roll('5d4').total,
            'Paladin': this.diceEngine.roll('6d4').total * 10,
            'Ranger': this.diceEngine.roll('6d4').total * 10,
            'Rogue': this.diceEngine.roll('5d4').total * 10,
            'Sorcerer': this.diceEngine.roll('3d4').total * 10,
            'Wizard': this.diceEngine.roll('3d4').total * 10
        };
        
        character.equipment.money.gp = startingGold[character.characterClass] || 100;
        
        // Add basic equipment based on class
        this.addClassStartingEquipment(character);
    }

    /**
     * Add class-specific starting equipment
     */
    addClassStartingEquipment(character) {
        const equipment = character.equipment;
        
        switch (character.characterClass) {
            case 'Fighter':
                equipment.weapons.push({ name: 'Longsword', damage: '1d8', type: 'Slashing' });
                equipment.armor.push({ name: 'Scale Mail', acBonus: 4, maxDexBonus: 3, armorCheckPenalty: -4 });
                equipment.shield = { name: 'Heavy Steel Shield', acBonus: 2, armorCheckPenalty: -2 };
                break;
                
            case 'Wizard':
                equipment.weapons.push({ name: 'Quarterstaff', damage: '1d6', type: 'Bludgeoning' });
                equipment.items.push({ name: 'Spellbook', description: 'Contains all known spells' });
                equipment.items.push({ name: 'Spell Component Pouch', description: 'For material components' });
                break;
                
            case 'Rogue':
                equipment.weapons.push({ name: 'Short Sword', damage: '1d6', type: 'Piercing' });
                equipment.weapons.push({ name: 'Dagger', damage: '1d4', type: 'Piercing' });
                equipment.armor.push({ name: 'Leather Armor', acBonus: 2, maxDexBonus: 6, armorCheckPenalty: 0 });
                equipment.items.push({ name: 'Thieves\' Tools', description: 'For picking locks and disarming traps' });
                break;
                
            case 'Cleric':
                equipment.weapons.push({ name: 'Light Mace', damage: '1d6', type: 'Bludgeoning' });
                equipment.armor.push({ name: 'Scale Mail', acBonus: 4, maxDexBonus: 3, armorCheckPenalty: -4 });
                equipment.shield = { name: 'Heavy Steel Shield', acBonus: 2, armorCheckPenalty: -2 };
                equipment.items.push({ name: 'Holy Symbol', description: 'Divine focus for spells' });
                break;
                
            default:
                equipment.weapons.push({ name: 'Dagger', damage: '1d4', type: 'Piercing' });
                break;
        }
    }

    // ===== CHARACTER MANAGEMENT =====

    /**
     * Save character to storage
     */
    async saveCharacter(character, filename = null) {
        try {
            const characterData = {
                ...character,
                savedAt: Date.now(),
                version: '2.0.0'
            };
            
            if (typeof window !== 'undefined') {
                // Browser storage
                const savedCharacters = JSON.parse(localStorage.getItem('rulzlawyer_characters') || '[]');
                savedCharacters.push(characterData);
                
                // Limit storage to prevent bloat
                if (savedCharacters.length > this.config.maxCharacterHistory) {
                    savedCharacters.shift();
                }
                
                localStorage.setItem('rulzlawyer_characters', JSON.stringify(savedCharacters));
            } else if (typeof require !== 'undefined') {
                // Node.js file storage
                const fs = require('fs');
                const path = require('path');
                
                const saveDir = path.join(__dirname, 'saved_characters');
                if (!fs.existsSync(saveDir)) {
                    fs.mkdirSync(saveDir, { recursive: true });
                }
                
                const fileName = filename || `character_${character.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
                const filePath = path.join(saveDir, fileName);
                
                fs.writeFileSync(filePath, JSON.stringify(characterData, null, 2));
            }
            
            console.log(`💾 Character saved: ${character.name}`);
            this.emit(this.events.CHARACTER_SAVED, { character, filename });
            
        } catch (error) {
            console.error('❌ Failed to save character:', error);
            this.emit(this.events.ERROR_OCCURRED, { error: error.message, context: 'save_character' });
            throw error;
        }
    }

    /**
     * Load saved characters
     */
    async loadSavedCharacters() {
        try {
            let savedCharacters = [];
            
            if (typeof window !== 'undefined') {
                // Browser storage
                savedCharacters = JSON.parse(localStorage.getItem('rulzlawyer_characters') || '[]');
            } else if (typeof require !== 'undefined') {
                // Node.js file storage
                const fs = require('fs');
                const path = require('path');
                
                const saveDir = path.join(__dirname, 'saved_characters');
                if (fs.existsSync(saveDir)) {
                    const files = fs.readdirSync(saveDir).filter(f => f.endsWith('.json'));
                    
                    for (const file of files) {
                        const filePath = path.join(saveDir, file);
                        const characterData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        savedCharacters.push(characterData);
                    }
                }
            }
            
            this.characterHistory = savedCharacters;
            console.log(`📚 Loaded ${savedCharacters.length} saved characters`);
            
        } catch (error) {
            console.error('❌ Failed to load saved characters:', error);
        }
    }

    /**
     * Add character to history
     */
    addToHistory(character) {
        this.characterHistory.unshift({ ...character, addedAt: Date.now() });
        
        // Limit history size
        if (this.characterHistory.length > this.config.maxCharacterHistory) {
            this.characterHistory.pop();
        }
    }

    /**
     * Get character history
     */
    getCharacterHistory() {
        return [...this.characterHistory];
    }

    /**
     * Load character by index from history
     */
    loadCharacterFromHistory(index) {
        if (index >= 0 && index < this.characterHistory.length) {
            const character = this.characterHistory[index];
            this.currentCharacter = character;
            this.emit(this.events.CHARACTER_LOADED, { character, source: 'history' });
            return character;
        }
        return null;
    }

    // ===== DICE ROLLING INTERFACE =====

    /**
     * Roll dice with context
     */
    rollDice(expression, context = null) {
        try {
            const result = this.diceEngine.roll(expression);
            
            // Add context if provided
            if (context) {
                result.context = context;
            }
            
            console.log(`🎲 Rolled ${expression}: ${result.total}${context ? ` (${context})` : ''}`);
            
            return result;
        } catch (error) {
            console.error('❌ Dice roll error:', error);
            this.emit(this.events.ERROR_OCCURRED, { error: error.message, context: 'dice_roll' });
            return { error: true, message: error.message, total: 0 };
        }
    }

    /**
     * Roll ability scores
     */
    rollAbilityScores(method = '4d6dl1') {
        return this.diceEngine.rollAbilityScores(method);
    }

    /**
     * Roll initiative for character
     */
    rollInitiative(character = null) {
        const char = character || this.currentCharacter;
        if (!char) {
            return this.rollDice('1d20', 'Initiative');
        }
        
        const initiative = this.calculationEngine.calculateInitiative(char);
        const roll = this.diceEngine.roll('1d20');
        
        return {
            ...roll,
            modifier: initiative.total,
            total: roll.total + initiative.total,
            context: 'Initiative',
            character: char.name
        };
    }

    // ===== UTILITY METHODS =====

    /**
     * Get current system status
     */
    getSystemStatus() {
        return {
            initialized: this.isInitialized,
            currentCharacter: this.currentCharacter ? this.currentCharacter.name : null,
            activeWizard: this.activeWizard !== null,
            characterHistoryCount: this.characterHistory.length,
            diceStats: this.diceEngine.getStatistics(),
            srdDataStats: this.srdDataManager.getDataStats(),
            cacheSize: this.cache.size,
            eventListeners: Array.from(this.eventListeners.keys())
        };
    }

    /**
     * Clear all caches and reset state
     */
    reset() {
        this.cache.clear();
        this.diceEngine.clearCache();
        this.calculationEngine.clearCache();
        this.currentCharacter = null;
        this.activeWizard = null;
        
        console.log('🔄 Character Engine reset');
    }

    /**
     * Run system self-tests
     */
    async runSelfTests() {
        console.log('🧪 Running Character Engine self-tests...');
        
        const results = {
            diceEngine: this.diceEngine.selfTest(),
            calculationEngine: this.calculationEngine.selfTest(),
            dataManager: this.srdDataManager.getDataStats(),
            integration: []
        };
        
        // Test character creation
        try {
            const testChar = await this.generateRandomCharacter({ level: 1 });
            results.integration.push({
                name: 'Random Character Generation',
                passed: testChar && testChar.name && testChar.race && testChar.characterClass,
                character: testChar ? `${testChar.name} - ${testChar.race} ${testChar.characterClass}` : null
            });
        } catch (error) {
            results.integration.push({
                name: 'Random Character Generation',
                passed: false,
                error: error.message
            });
        }
        
        console.log('✅ Self-tests completed');
        return results;
    }
}

// Global export for both browser and Node.js compatibility
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

async function initializeCharacterSystem() {
    try {
        window.characterEngine = new RulzLawyerCharacterEngine();
        await window.characterEngine.initialize();
        
        // Set up global action handlers for HTML buttons
        window.gameActions = {
            startCharacterCreation: () => window.characterEngine.startCharacterWizard(),
            generateRandomCharacter: (options) => window.characterEngine.generateRandomCharacter(options),
            saveCharacter: () => window.characterEngine.saveCharacter(window.characterEngine.currentCharacter),
            loadCharacter: (index) => window.characterEngine.loadCharacterFromHistory(index),
            rollDice: (expression, context) => window.characterEngine.rollDice(expression, context),
            rollInitiative: () => window.characterEngine.rollInitiative(),
            getSystemStatus: () => window.characterEngine.getSystemStatus()
        };
        
        console.log('✅ RulzLawyer character system initialized successfully');
        
        // Emit global initialization event
        if (typeof window.customEvent !== 'undefined') {
            window.dispatchEvent(new CustomEvent('rulzlawyerInitialized', {
                detail: { characterEngine: window.characterEngine }
            }));
        }
        
    } catch (error) {
        console.error('❌ Failed to initialize character system:', error);
        
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'system-error';
        errorDiv.innerHTML = `
            <h3>🚨 System Initialization Error</h3>
            <p>Failed to initialize RulzLawyer character system. Please refresh and try again.</p>
            <details>
                <summary>Technical Details</summary>
                <pre>${error.message}</pre>
            </details>
        `;
        
        if (document.body) {
            document.body.appendChild(errorDiv);
        }
    }
}
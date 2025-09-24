/**
 * D&D 3.5 System Integration Module
 * Connects data management and calculation engine with character creation system
 * Provides unified interface for complete character management
 */

class DnDSystemIntegration {
    constructor() {
        this.dataManager = null;
        this.calculationEngine = null;
        this.isInitialized = false;
        
        // Character validation cache
        this.validationCache = new Map();
        
        // Event system for character updates
        this.eventListeners = {};
    }

    /**
     * Initialize the system integration
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) {
            return Promise.resolve();
        }

        try {
            console.log('Initializing D&D 3.5 System Integration...');
            
            // Initialize data manager
            if (typeof window !== 'undefined' && window.dndDataManager) {
                this.dataManager = window.dndDataManager;
            } else if (typeof require !== 'undefined') {
                const { DnDDataManager } = require('./data-manager.js');
                this.dataManager = new DnDDataManager();
            } else {
                throw new Error('Data manager not available');
            }
            
            await this.dataManager.initialize();
            
            // Initialize calculation engine
            if (typeof window !== 'undefined' && window.DnDCalculationEngine) {
                this.calculationEngine = new window.DnDCalculationEngine();
            } else if (typeof require !== 'undefined') {
                const DnDCalculationEngine = require('./calculation-engine.js');
                this.calculationEngine = new DnDCalculationEngine();
            } else {
                throw new Error('Calculation engine not available');
            }
            
            // Initialize calculation engine with game data
            const gameData = this.dataManager.getAllData();
            this.calculationEngine.initialize(gameData);
            
            this.isInitialized = true;
            console.log('D&D 3.5 System Integration initialized successfully');
            
            // Emit initialization complete event
            this.emit('initialized', { dataManager: this.dataManager, calculationEngine: this.calculationEngine });
            
        } catch (error) {
            console.error('Failed to initialize D&D System Integration:', error);
            throw error;
        }
    }

    /**
     * Create a new character with basic validation
     * @param {Object} characterData - Initial character data
     * @returns {Object} Complete character object with calculated stats
     */
    createCharacter(characterData) {
        this.ensureInitialized();
        
        // Set defaults for required fields
        const character = {
            name: characterData.name || 'Unnamed Character',
            race: characterData.race || 'Human',
            classes: characterData.classes || [{ className: 'Fighter', level: 1 }],
            alignment: characterData.alignment || 'Neutral',
            abilities: characterData.abilities || this.generateDefaultAbilities(),
            baseAbilities: characterData.baseAbilities || characterData.abilities || this.generateDefaultAbilities(),
            skills: characterData.skills || {},
            feats: characterData.feats || [],
            equipment: characterData.equipment || [],
            spells: characterData.spells || {},
            hitPoints: characterData.hitPoints || { current: 0, max: 0, temporary: 0 },
            ...characterData
        };

        // Apply racial ability adjustments if needed
        if (!character.abilities || JSON.stringify(character.abilities) === JSON.stringify(character.baseAbilities)) {
            character.abilities = this.calculationEngine.applyRacialAbilityAdjustments(
                character.baseAbilities,
                character.race
            );
        }

        // Calculate all derived statistics
        const calculatedStats = this.calculationEngine.calculateAllStats(character);
        
        // Handle hit points specially - convert single number to object format
        const hitPointsMax = calculatedStats.hitPoints;
        calculatedStats.hitPoints = {
            max: hitPointsMax,
            current: character.hitPoints?.current || hitPointsMax,
            temporary: character.hitPoints?.temporary || 0
        };
        
        // Merge calculated stats with character
        const completeCharacter = {
            ...character,
            ...calculatedStats,
            lastUpdated: new Date().toISOString()
        };

        // Set hit points if not already set
        if (completeCharacter.hitPoints.max === 0) {
            completeCharacter.hitPoints.max = hitPointsMax;
            completeCharacter.hitPoints.current = hitPointsMax;
        }

        // Emit character created event
        this.emit('characterCreated', completeCharacter);

        return completeCharacter;
    }

    /**
     * Validate character build and return detailed results
     * @param {Object} character - Character to validate
     * @param {boolean} useCache - Whether to use validation cache
     * @returns {Object} Detailed validation results
     */
    validateCharacter(character, useCache = true) {
        this.ensureInitialized();
        
        const cacheKey = this.generateCharacterHash(character);
        
        if (useCache && this.validationCache.has(cacheKey)) {
            return this.validationCache.get(cacheKey);
        }
        
        // Basic validation from calculation engine
        const basicValidation = this.calculationEngine.validateCharacter(character);
        
        // Extended validation
        const extendedValidation = this.performExtendedValidation(character);
        
        const fullValidation = {
            ...basicValidation,
            warnings: [...(basicValidation.warnings || []), ...(extendedValidation.warnings || [])],
            errors: [...(basicValidation.errors || []), ...(extendedValidation.errors || [])],
            suggestions: extendedValidation.suggestions || []
        };
        
        fullValidation.valid = fullValidation.errors.length === 0;
        
        if (useCache) {
            this.validationCache.set(cacheKey, fullValidation);
        }
        
        return fullValidation;
    }

    /**
     * Perform extended character validation
     * @param {Object} character - Character to validate
     * @returns {Object} Extended validation results
     */
    performExtendedValidation(character) {
        const warnings = [];
        const errors = [];
        const suggestions = [];

        // Validate race exists
        const race = this.dataManager.getRace(character.race);
        if (!race) {
            errors.push(`Unknown race: ${character.race}`);
        }

        // Validate classes exist
        for (const classLevel of character.classes || []) {
            const classData = this.dataManager.getClass(classLevel.className);
            if (!classData) {
                errors.push(`Unknown class: ${classLevel.className}`);
            }
            
            if (classLevel.level < 1 || classLevel.level > 20) {
                errors.push(`Invalid level ${classLevel.level} for ${classLevel.className}`);
            }
        }

        return { warnings, errors, suggestions };
    }

    /**
     * Generate default ability scores (standard array)
     * @param {string} method - Generation method
     * @returns {Object} Generated ability scores
     */
    generateDefaultAbilities(method = 'standardarray') {
        return {
            strength: 15,
            dexterity: 14,
            constitution: 13,
            intelligence: 12,
            wisdom: 10,
            charisma: 8
        };
    }

    /**
     * Generate character hash for caching
     * @param {Object} character - Character object
     * @returns {string} Hash string
     */
    generateCharacterHash(character) {
        const relevantData = {
            race: character.race,
            classes: character.classes,
            abilities: character.abilities,
            feats: character.feats,
            skills: character.skills
        };
        return JSON.stringify(relevantData);
    }

    /**
     * Ensure system is initialized
     * @throws {Error} If not initialized
     */
    ensureInitialized() {
        if (!this.isInitialized) {
            throw new Error('D&D System Integration not initialized. Call initialize() first.');
        }
    }

    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
        }
    }

    /**
     * Emit event to all listeners
     * @param {string} event - Event name
     * @param {...*} args - Event arguments
     */
    emit(event, ...args) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Get system status information
     * @returns {Object} System status information
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            dataManager: this.dataManager ? this.dataManager.getStatus() : null,
            calculationEngine: this.calculationEngine ? 'Available' : 'Not Available',
            cacheSize: this.validationCache.size,
            eventListeners: Object.keys(this.eventListeners).length
        };
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DnDSystemIntegration };
} else if (typeof window !== 'undefined') {
    window.DnDSystemIntegration = DnDSystemIntegration;
}
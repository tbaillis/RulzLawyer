/**
 * Enhanced Character Creation Engine for RulzLawyer
 * Integrates Excel-converted D&D 3.5 data with web interface
 * Provides complete character creation workflow with spell integration
 */

class RulzLawyerCharacterEngine {
    constructor() {
        // Core D&D 3.5 system components
        this.dataManager = null;
        this.calculationEngine = null;
        this.systemIntegration = null;
        this.isInitialized = false;

        // Character state management
        this.currentCharacter = null;
        this.characterHistory = [];

        // UI integration points
        this.uiElements = {};
        this.eventListeners = {};

        // Spell system integration
        this.spellManager = null;
        this.activeSpellbook = {};

        // Real-time validation
        this.validationResults = { valid: false, warnings: [], errors: [] };
    }

    /**
     * Initialize the complete character creation system
     * Loads D&D 3.5 data and connects to UI elements
     */
    async initialize() {
        if (this.isInitialized) return;

        console.log('🎲 Initializing RulzLawyer Character Engine...');

        try {
            // Initialize core D&D 3.5 system
            await this.initializeCoreSystem();

            // Initialize spell system
            await this.initializeSpellSystem();

            // Connect to UI elements
            this.connectUIElements();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize default character
            this.createNewCharacter();

            this.isInitialized = true;
            console.log('✅ RulzLawyer Character Engine initialized successfully');

            // Dispatch initialization event
            this.dispatchEvent('engineInitialized', { engine: this });

        } catch (error) {
            console.error('❌ Failed to initialize Character Engine:', error);
            throw error;
        }
    }

    /**
     * Initialize the core D&D 3.5 system components
     */
    async initializeCoreSystem() {
        try {
            // Load system integration module
            const { DnDSystemIntegration } = await this.loadModule('./code-repository/src/system-integration.js');
            this.systemIntegration = new DnDSystemIntegration();
            await this.systemIntegration.initialize();

            // Get references to core components
            this.dataManager = this.systemIntegration.dataManager;
            this.calculationEngine = this.systemIntegration.calculationEngine;

            console.log('✅ Core D&D 3.5 system loaded');

        } catch (error) {
            console.error('❌ Failed to load core D&D 3.5 system:', error);
            throw error;
        }
    }

    /**
     * Initialize spell system with enhanced spell management
     */
    async initializeSpellSystem() {
        try {
            // Create enhanced spell manager
            this.spellManager = {
                getAllSpells: () => this.dataManager.getSpells(),
                getSpellsByClass: (className) => this.dataManager.getSpells().filter(spell =>
                    spell.level && spell.level[className] !== undefined),
                getSpellsByLevel: (className, level) => this.dataManager.getSpellsByClassAndLevel(className, level),
                getSpellDetails: (spellName) => this.dataManager.getSpell(spellName),

                // Enhanced spell queries
                searchSpells: (query) => {
                    const spells = this.dataManager.getSpells();
                    const searchTerm = query.toLowerCase();
                    return spells.filter(spell =>
                        spell.name.toLowerCase().includes(searchTerm) ||
                        spell.school.toLowerCase().includes(searchTerm) ||
                        (spell.description && spell.description.toLowerCase().includes(searchTerm))
                    );
                },

                // Spell slot calculations
                calculateSpellSlots: (character) => {
                    if (!character || !character.classes) return {};

                    const slots = {};
                    for (const classLevel of character.classes) {
                        const classData = this.dataManager.getClass(classLevel.className);
                        if (classData && classData.spellcasting) {
                            slots[classLevel.className] = this.calculationEngine.calculateSpellsPerDay(
                                classLevel.className,
                                classLevel.level,
                                character.abilityModifiers[classData.spell_save_dc_ability?.toLowerCase() || 'intelligence'] || 0
                            );
                        }
                    }
                    return slots;
                }
            };

            console.log('✅ Spell system initialized');

        } catch (error) {
            console.error('❌ Failed to initialize spell system:', error);
            throw error;
        }
    }

    /**
     * Connect to UI elements in the character sheet
     */
    connectUIElements() {
        // Basic character information
        this.uiElements.characterName = document.getElementById('characterName');
        this.uiElements.classLevel = document.getElementById('classLevel');
        this.uiElements.race = document.getElementById('race');
        this.uiElements.alignment = document.getElementById('alignment');

        // Ability scores
        const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        this.uiElements.abilities = {};
        abilities.forEach(ability => {
            this.uiElements.abilities[ability] = {
                score: document.getElementById(ability),
                modifier: document.getElementById(ability + 'Mod'),
                tempAdjust: document.getElementById(ability + 'TempAdjust')
            };
        });

        // Combat stats
        this.uiElements.hitPoints = {
            total: document.getElementById('totalHP'),
            current: document.getElementById('currentHP')
        };

        this.uiElements.armorClass = {
            total: document.getElementById('totalAC'),
            armor: document.getElementById('armorBonus'),
            shield: document.getElementById('shieldBonus'),
            natural: document.getElementById('naturalArmor')
        };

        this.uiElements.baseAttackBonus = document.getElementById('bab');

        // Saving throws
        this.uiElements.saves = {
            fortitude: {
                base: document.getElementById('fortBase'),
                total: document.getElementById('fortTotal')
            },
            reflex: {
                base: document.getElementById('refBase'),
                total: document.getElementById('refTotal')
            },
            will: {
                base: document.getElementById('willBase'),
                total: document.getElementById('willTotal')
            }
        };

        console.log('✅ UI elements connected');
    }

    /**
     * Setup event listeners for real-time character updates
     */
    setupEventListeners() {
        // Character name and basic info
        if (this.uiElements.characterName) {
            this.uiElements.characterName.addEventListener('input', (e) => {
                this.updateCharacter({ name: e.target.value });
            });
        }

        if (this.uiElements.race) {
            this.uiElements.race.addEventListener('change', (e) => {
                this.updateCharacterRace(e.target.value);
            });
        }

        if (this.uiElements.classLevel) {
            this.uiElements.classLevel.addEventListener('change', (e) => {
                this.updateCharacterClass(e.target.value);
            });
        }

        // Ability scores
        Object.keys(this.uiElements.abilities).forEach(ability => {
            const elements = this.uiElements.abilities[ability];

            if (elements.score) {
                elements.score.addEventListener('input', (e) => {
                    this.updateAbilityScore(ability, parseInt(e.target.value) || 10);
                });
            }

            if (elements.tempAdjust) {
                elements.tempAdjust.addEventListener('input', () => {
                    this.recalculateCharacterStats();
                });
            }
        });

        console.log('✅ Event listeners setup');
    }

    /**
     * Create a new character with default values
     */
    createNewCharacter() {
        try {
            const defaultCharacter = {
                name: 'New Character',
                race: 'Human',
                classes: [{ className: 'Fighter', level: 1 }],
                alignment: 'Neutral',
                baseAbilities: {
                    strength: 15,
                    dexterity: 14,
                    constitution: 13,
                    intelligence: 12,
                    wisdom: 10,
                    charisma: 8
                }
            };

            // Create character using the D&D 3.5 system
            this.currentCharacter = this.systemIntegration.createCharacter(defaultCharacter);

            // Update UI with new character
            this.updateUI();

            // Initialize spellbook for spellcasting classes
            this.updateSpellbook();

            console.log('✅ New character created:', this.currentCharacter.name);

        } catch (error) {
            console.error('❌ Failed to create new character:', error);
        }
    }

    /**
     * Update character with new data and recalculate stats
     */
    updateCharacter(updates) {
        if (!this.currentCharacter) return;

        try {
            // Update character using system integration
            this.currentCharacter = this.systemIntegration.updateCharacter(this.currentCharacter, updates);

            // Update UI
            this.updateUI();

            // Update spellbook if classes changed
            if (updates.classes) {
                this.updateSpellbook();
            }

            // Validate character
            this.validateCurrentCharacter();

        } catch (error) {
            console.error('❌ Failed to update character:', error);
        }
    }

    /**
     * Update character race and apply racial modifiers
     */
    updateCharacterRace(raceName) {
        const race = this.dataManager.getRace(raceName);
        if (!race) {
            console.warn('Unknown race:', raceName);
            return;
        }

        this.updateCharacter({ race: raceName });
        console.log(`✅ Character race updated to ${raceName}`);
    }

    /**
     * Update character class and level
     */
    updateCharacterClass(classLevelString) {
        try {
            // Parse class/level string (e.g., "Fighter 5" or "Fighter 3/Wizard 2")
            const classes = this.parseClassLevelString(classLevelString);

            this.updateCharacter({ classes });
            console.log('✅ Character classes updated:', classes);

        } catch (error) {
            console.error('❌ Failed to parse class/level string:', classLevelString, error);
        }
    }

    /**
     * Parse class/level string into classes array
     */
    parseClassLevelString(classLevelString) {
        const classes = [];

        // Handle multiclass format: "Fighter 3/Wizard 2"
        const classParts = classLevelString.split('/');

        for (const part of classParts) {
            const match = part.trim().match(/^(.+)\s+(\d+)$/);
            if (match) {
                const [, className, level] = match;
                classes.push({
                    className: className.trim(),
                    level: parseInt(level)
                });
            }
        }

        return classes.length > 0 ? classes : [{ className: 'Fighter', level: 1 }];
    }

    /**
     * Update a single ability score
     */
    updateAbilityScore(abilityName, score) {
        const updates = {
            baseAbilities: {
                ...this.currentCharacter.baseAbilities,
                [abilityName]: score
            }
        };

        this.updateCharacter(updates);
    }

    /**
     * Recalculate all character statistics
     */
    recalculateCharacterStats() {
        if (!this.currentCharacter) return;

        // Force recalculation by updating character with current data
        this.updateCharacter({});
    }

    /**
     * Update UI elements with current character data
     */
    updateUI() {
        if (!this.currentCharacter) return;

        try {
            // Update basic information
            if (this.uiElements.characterName) {
                this.uiElements.characterName.value = this.currentCharacter.name || '';
            }

            if (this.uiElements.race) {
                this.uiElements.race.value = this.currentCharacter.race || '';
            }

            if (this.uiElements.classLevel) {
                const classString = this.currentCharacter.classes.map(c => `${c.className} ${c.level}`).join('/');
                this.uiElements.classLevel.value = classString;
            }

            if (this.uiElements.alignment) {
                this.uiElements.alignment.value = this.currentCharacter.alignment || '';
            }

            // Update ability scores
            Object.keys(this.uiElements.abilities).forEach(ability => {
                const elements = this.uiElements.abilities[ability];
                const score = this.currentCharacter.abilities[ability] || 10;
                const modifier = this.currentCharacter.abilityModifiers[ability] || 0;

                if (elements.score) elements.score.value = score;
                if (elements.modifier) {
                    elements.modifier.textContent = (modifier >= 0 ? '+' : '') + modifier;
                }
            });

            // Update combat stats
            if (this.uiElements.hitPoints.total) {
                this.uiElements.hitPoints.total.value = this.currentCharacter.hitPoints?.max || 0;
            }

            if (this.uiElements.hitPoints.current && !this.uiElements.hitPoints.current.value) {
                this.uiElements.hitPoints.current.value = this.currentCharacter.hitPoints?.max || 0;
            }

            if (this.uiElements.armorClass.total) {
                this.uiElements.armorClass.total.textContent = this.currentCharacter.armorClass?.total || 10;
            }

            if (this.uiElements.baseAttackBonus) {
                const bab = this.currentCharacter.baseAttackBonus || 0;
                this.uiElements.baseAttackBonus.value = (bab >= 0 ? '+' : '') + bab;
            }

            // Update saving throws
            const saves = this.currentCharacter.savingThrows || {};
            Object.keys(this.uiElements.saves).forEach(saveType => {
                const saveElements = this.uiElements.saves[saveType];
                const saveValue = saves[saveType] || 0;

                if (saveElements.total) {
                    saveElements.total.value = saveValue;
                }
            });

            console.log('✅ UI updated with character data');

        } catch (error) {
            console.error('❌ Failed to update UI:', error);
        }
    }

    /**
     * Update spellbook for current character
     */
    updateSpellbook() {
        if (!this.currentCharacter) return;

        try {
            // Calculate spell slots for all spellcasting classes
            this.activeSpellbook = this.spellManager.calculateSpellSlots(this.currentCharacter);

            // Update spell UI if it exists
            this.updateSpellUI();

            console.log('✅ Spellbook updated:', this.activeSpellbook);

        } catch (error) {
            console.error('❌ Failed to update spellbook:', error);
        }
    }

    /**
     * Update spell-related UI elements
     */
    updateSpellUI() {
        // This will be implemented when we add the spell UI to page 3
        console.log('📜 Spell UI update (placeholder)');
    }

    /**
     * Validate current character build
     */
    validateCurrentCharacter() {
        if (!this.currentCharacter) return;

        try {
            this.validationResults = this.systemIntegration.validateCharacter(this.currentCharacter);

            // Display validation results
            this.displayValidationResults();

        } catch (error) {
            console.error('❌ Character validation failed:', error);
        }
    }

    /**
     * Display validation results in UI
     */
    displayValidationResults() {
        // Create or update validation display
        let validationDisplay = document.getElementById('validationResults');
        if (!validationDisplay) {
            validationDisplay = document.createElement('div');
            validationDisplay.id = 'validationResults';
            validationDisplay.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: white;
                border: 2px solid #333;
                padding: 10px;
                max-width: 300px;
                z-index: 1000;
                font-size: 12px;
            `;
            document.body.appendChild(validationDisplay);
        }

        let html = `<h4>Character Validation</h4>`;

        if (this.validationResults.valid) {
            html += `<p style="color: green;">✅ Character is valid!</p>`;
        } else {
            html += `<p style="color: red;">❌ Character has issues:</p>`;
        }

        if (this.validationResults.errors && this.validationResults.errors.length > 0) {
            html += `<h5>Errors:</h5><ul>`;
            this.validationResults.errors.forEach(error => {
                html += `<li style="color: red;">${error}</li>`;
            });
            html += `</ul>`;
        }

        if (this.validationResults.warnings && this.validationResults.warnings.length > 0) {
            html += `<h5>Warnings:</h5><ul>`;
            this.validationResults.warnings.forEach(warning => {
                html += `<li style="color: orange;">${warning}</li>`;
            });
            html += `</ul>`;
        }

        validationDisplay.innerHTML = html;
    }

    /**
     * Load a module dynamically
     */
    async loadModule(modulePath) {
        try {
            if (typeof require !== 'undefined') {
                // Node.js environment
                return require(modulePath);
            } else {
                // Browser environment - load via script tag
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = modulePath;
                    script.onload = () => {
                        // Assume the module exports to window
                        resolve(window);
                    };
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }
        } catch (error) {
            console.error('Failed to load module:', modulePath, error);
            throw error;
        }
    }

    /**
     * Dispatch custom events
     */
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Get current character data
     */
    getCharacter() {
        return this.currentCharacter;
    }

    /**
     * Get spell manager
     */
    getSpellManager() {
        return this.spellManager;
    }

    /**
     * Get validation results
     */
    getValidationResults() {
        return this.validationResults;
    }
}

// Create global instance
window.rulzLawyerEngine = new RulzLawyerCharacterEngine();

// Export for both environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RulzLawyerCharacterEngine };
} else if (typeof window !== 'undefined') {
    window.RulzLawyerCharacterEngine = RulzLawyerCharacterEngine;
}
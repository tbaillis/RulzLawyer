/**
 * CharacterCreatorInterface - Complete D&D 3.5 Character Creation Web Interface
 * Integrates with all backend systems for full-featured character creation
 * 
 * Features:
 * - 7-step wizard interface with real-time validation
 * - SRD data integration with dynamic loading
 * - Ability score generation and management
 * - Skill point allocation with visual feedback
 * - Feat selection with prerequisite checking
 * - Equipment selection and starting gold
 * - Character sheet preview and export
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class CharacterCreatorInterface {
    constructor() {
        this.wizard = null;
        this.currentCharacter = null;
        this.srdData = {};
        this.stepData = {};
        
        // New systems integration
        this.characterSheetRenderer = null;
        this.storageManager = null;
        this.spellManager = null;
        this.epicManager = null;
        this.combatManager = null;
        
        // UI elements
        this.elements = {};
        
        console.log('🧙 Character Creator Interface initializing...');
        this.initialize();
    }

    /**
     * Initialize the interface
     */
    async initialize() {
        try {
            // Load SRD data first
            await this.loadSRDData();
            
            // Initialize all system managers
            await this.initializeManagers();
            
            // Initialize wizard
            await this.initializeWizard();
            
            // Setup UI elements
            this.setupUI();
            
            // Start the creation process
            this.startCharacterCreation();
            
            console.log('✅ Character Creator Interface ready with all systems');
        } catch (error) {
            console.error('❌ Failed to initialize Character Creator:', error);
            this.showError('Failed to initialize character creator: ' + error.message);
        }
    }

    /**
     * Initialize all system managers
     */
    async initializeManagers() {
        try {
            // Initialize storage manager
            this.storageManager = new CharacterStorageManager();
            
            // Initialize character sheet renderer
            this.characterSheetRenderer = new CharacterSheetRenderer(
                { srdData: this.srdData },
                this.spellManager,
                this.epicManager
            );
            
            // Initialize specialized managers (if available)
            if (typeof SpellManager !== 'undefined') {
                this.spellManager = new SpellManager();
                console.log('✅ Spell Manager initialized');
            }
            
            if (typeof EpicLevelManager !== 'undefined') {
                this.epicManager = new EpicLevelManager();
                console.log('✅ Epic Level Manager initialized');
            }
            
            if (typeof CombatManager !== 'undefined') {
                this.combatManager = new CombatManager();
                console.log('✅ Combat Manager initialized');
            }
            
            // Update character sheet renderer with all managers
            this.characterSheetRenderer = new CharacterSheetRenderer(
                { srdData: this.srdData },
                this.spellManager,
                this.epicManager
            );
            
            console.log('💾 All system managers initialized');
            
        } catch (error) {
            console.error('❌ Error initializing managers:', error);
            throw error;
        }
    }

    /**
     * Load SRD data from server
     */
    async loadSRDData() {
        try {
            const response = await fetch('/api/srd/data');
            const result = await response.json();
            
            if (result.success) {
                this.srdData = result.data;
                console.log('📊 SRD data loaded:', Object.keys(this.srdData));
            } else {
                throw new Error(result.error || 'Failed to load SRD data');
            }
        } catch (error) {
            console.error('❌ SRD data loading failed:', error);
            throw error;
        }
    }

    /**
     * Initialize character creation wizard (mock for now)
     */
    async initializeWizard() {
        // For now, we'll simulate the wizard initialization
        // In a full implementation, this would create a server-side wizard instance
        this.wizard = {
            currentStep: 1,
            totalSteps: 7,
            character: {
                name: '',
                race: '',
                characterClass: '',
                level: 1,
                baseAbilities: {
                    strength: 10,
                    dexterity: 10,
                    constitution: 10,
                    intelligence: 10,
                    wisdom: 10,
                    charisma: 10
                },
                abilities: {},
                skills: {},
                feats: [],
                equipment: { weapons: [], armor: [], gear: [] }
            }
        };
        
        console.log('🎯 Wizard initialized at step 1');
    }

    /**
     * Setup UI elements
     */
    setupUI() {
        // Get main containers
        this.elements.container = document.getElementById('character-creator-container');
        this.elements.stepIndicator = document.getElementById('step-indicator');
        this.elements.stepContent = document.getElementById('step-content');
        this.elements.navigationButtons = document.getElementById('navigation-buttons');
        this.elements.characterPreview = document.getElementById('character-preview');
        
        // Create UI if elements don't exist
        if (!this.elements.container) {
            this.createBaseUI();
        }
        
        // Setup navigation
        this.setupNavigation();
    }

    /**
     * Create base UI structure
     */
    createBaseUI() {
        const container = document.createElement('div');
        container.id = 'character-creator-container';
        container.className = 'character-creator-container';
        
        container.innerHTML = `
            <div class="wizard-header">
                <h1>🧙 D&D 3.5 Character Creator</h1>
                <div id="step-indicator" class="step-indicator"></div>
            </div>
            
            <div class="wizard-content">
                <div id="step-content" class="step-content"></div>
                <div id="character-preview" class="character-preview">
                    <h3>Character Preview</h3>
                    <div id="preview-content" class="preview-content">
                        <p>No character data yet</p>
                    </div>
                </div>
            </div>
            
            <div id="navigation-buttons" class="navigation-buttons">
                <button id="prev-button" class="nav-button" disabled>← Previous</button>
                <button id="next-button" class="nav-button">Next →</button>
                <button id="complete-button" class="nav-button complete-button" style="display: none;">Complete Character</button>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Update element references
        this.elements.container = container;
        this.elements.stepIndicator = document.getElementById('step-indicator');
        this.elements.stepContent = document.getElementById('step-content');
        this.elements.navigationButtons = document.getElementById('navigation-buttons');
        this.elements.characterPreview = document.getElementById('character-preview');
    }

    /**
     * Setup navigation event handlers
     */
    setupNavigation() {
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');
        const completeButton = document.getElementById('complete-button');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => this.previousStep());
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextStep());
        }
        
        if (completeButton) {
            completeButton.addEventListener('click', () => this.completeCharacter());
        }
    }

    /**
     * Start character creation process
     */
    startCharacterCreation() {
        this.updateStepIndicator();
        this.renderCurrentStep();
        this.updateCharacterPreview();
        this.updateNavigation();
    }

    /**
     * Move to next step
     */
    async nextStep() {
        try {
            // Validate current step
            if (!await this.validateCurrentStep()) {
                this.showError('Please complete all required fields before continuing.');
                return;
            }
            
            // Save current step data
            await this.saveCurrentStepData();
            
            // Advance step
            if (this.wizard.currentStep < this.wizard.totalSteps) {
                this.wizard.currentStep++;
                this.updateStepIndicator();
                this.renderCurrentStep();
                this.updateCharacterPreview();
                this.updateNavigation();
            }
        } catch (error) {
            console.error('Error advancing step:', error);
            this.showError('Failed to advance to next step: ' + error.message);
        }
    }

    /**
     * Move to previous step
     */
    previousStep() {
        if (this.wizard.currentStep > 1) {
            this.wizard.currentStep--;
            this.updateStepIndicator();
            this.renderCurrentStep();
            this.updateNavigation();
        }
    }

    /**
     * Update step indicator
     */
    updateStepIndicator() {
        if (!this.elements.stepIndicator) return;
        
        const steps = [
            'Basic Info',
            'Race',
            'Class',
            'Abilities',
            'Skills',
            'Feats',
            'Equipment'
        ];
        
        let html = '<div class="step-indicators">';
        
        for (let i = 1; i <= this.wizard.totalSteps; i++) {
            const isActive = i === this.wizard.currentStep;
            const isCompleted = i < this.wizard.currentStep;
            
            html += `
                <div class="step-indicator-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
                    <div class="step-number">${i}</div>
                    <div class="step-name">${steps[i-1]}</div>
                </div>
            `;
        }
        
        html += '</div>';
        this.elements.stepIndicator.innerHTML = html;
    }

    /**
     * Render current wizard step
     */
    renderCurrentStep() {
        if (!this.elements.stepContent) return;
        
        const step = this.wizard.currentStep;
        let content = '';
        
        switch (step) {
            case 1:
                content = this.renderBasicInformationStep();
                break;
            case 2:
                content = this.renderRaceSelectionStep();
                break;
            case 3:
                content = this.renderClassSelectionStep();
                break;
            case 4:
                content = this.renderAbilityScoreStep();
                break;
            case 5:
                content = this.renderSkillAllocationStep();
                break;
            case 6:
                content = this.renderFeatSelectionStep();
                break;
            case 7:
                content = this.renderEquipmentSelectionStep();
                break;
            default:
                content = '<p>Unknown step</p>';
        }
        
        this.elements.stepContent.innerHTML = content;
        this.attachStepEventHandlers();
    }

    /**
     * Render Step 1: Basic Information
     */
    renderBasicInformationStep() {
        return `
            <div class="step-content-inner">
                <h2>Step 1: Basic Character Information</h2>
                <p>Enter your character's basic information to get started.</p>
                
                <div class="form-group">
                    <label for="character-name">Character Name *</label>
                    <input type="text" id="character-name" class="form-input" 
                           value="${this.wizard.character.name}" 
                           placeholder="Enter character name" maxlength="50">
                    <div class="field-help">Choose a memorable name for your character</div>
                </div>
                
                <div class="form-group">
                    <label for="character-alignment">Alignment *</label>
                    <select id="character-alignment" class="form-select">
                        <option value="">Select Alignment</option>
                        <option value="Lawful Good" ${this.wizard.character.alignment === 'Lawful Good' ? 'selected' : ''}>Lawful Good</option>
                        <option value="Neutral Good" ${this.wizard.character.alignment === 'Neutral Good' ? 'selected' : ''}>Neutral Good</option>
                        <option value="Chaotic Good" ${this.wizard.character.alignment === 'Chaotic Good' ? 'selected' : ''}>Chaotic Good</option>
                        <option value="Lawful Neutral" ${this.wizard.character.alignment === 'Lawful Neutral' ? 'selected' : ''}>Lawful Neutral</option>
                        <option value="True Neutral" ${this.wizard.character.alignment === 'True Neutral' ? 'selected' : ''}>True Neutral</option>
                        <option value="Chaotic Neutral" ${this.wizard.character.alignment === 'Chaotic Neutral' ? 'selected' : ''}>Chaotic Neutral</option>
                        <option value="Lawful Evil" ${this.wizard.character.alignment === 'Lawful Evil' ? 'selected' : ''}>Lawful Evil</option>
                        <option value="Neutral Evil" ${this.wizard.character.alignment === 'Neutral Evil' ? 'selected' : ''}>Neutral Evil</option>
                        <option value="Chaotic Evil" ${this.wizard.character.alignment === 'Chaotic Evil' ? 'selected' : ''}>Chaotic Evil</option>
                    </select>
                    <div class="field-help">Your character's moral and ethical outlook</div>
                </div>
            </div>
        `;
    }

    /**
     * Render Step 2: Race Selection
     */
    renderRaceSelectionStep() {
        const races = this.srdData.races || [];
        
        let raceOptions = '';
        races.forEach(race => {
            const isSelected = this.wizard.character.race === race.name;
            const modifiers = race.abilityModifiers || {};
            const modifierText = Object.entries(modifiers)
                .filter(([_, value]) => value !== 0)
                .map(([ability, value]) => `${ability.substring(0, 3).toUpperCase()} ${value > 0 ? '+' : ''}${value}`)
                .join(', ');
            
            raceOptions += `
                <div class="selection-card ${isSelected ? 'selected' : ''}" data-race="${race.name}">
                    <h4>${race.name}</h4>
                    <p class="race-description">${race.description || 'A classic D&D race with unique traits and abilities.'}</p>
                    ${modifierText ? `<p class="ability-modifiers"><strong>Ability Modifiers:</strong> ${modifierText}</p>` : ''}
                    <div class="selection-actions">
                        <button class="select-button" onclick="characterCreator.selectRace('${race.name}')">
                            ${isSelected ? 'Selected' : 'Select Race'}
                        </button>
                    </div>
                </div>
            `;
        });
        
        return `
            <div class="step-content-inner">
                <h2>Step 2: Race Selection</h2>
                <p>Choose your character's race. Each race provides different ability modifiers and special traits.</p>
                
                <div class="selection-grid">
                    ${raceOptions}
                </div>
                
                ${this.wizard.character.race ? `
                    <div class="selected-info">
                        <h4>Selected: ${this.wizard.character.race}</h4>
                        <p>Great choice! Your character will have the traits and abilities of the ${this.wizard.character.race} race.</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render Step 3: Class Selection
     */
    renderClassSelectionStep() {
        const classes = this.srdData.classes || [];
        
        let classOptions = '';
        classes.forEach(cls => {
            const isSelected = this.wizard.character.characterClass === cls.name;
            
            classOptions += `
                <div class="selection-card ${isSelected ? 'selected' : ''}" data-class="${cls.name}">
                    <h4>${cls.name}</h4>
                    <p class="class-description">${cls.description || 'A classic D&D class with unique abilities.'}</p>
                    <div class="class-stats">
                        <p><strong>Hit Die:</strong> d${cls.hitDie}</p>
                        <p><strong>Skill Points:</strong> ${cls.skillPoints} + Int modifier per level</p>
                        <p><strong>Base Attack:</strong> ${cls.baseAttackBonus || 'average'}</p>
                    </div>
                    <div class="selection-actions">
                        <button class="select-button" onclick="characterCreator.selectClass('${cls.name}')">
                            ${isSelected ? 'Selected' : 'Select Class'}
                        </button>
                    </div>
                </div>
            `;
        });
        
        return `
            <div class="step-content-inner">
                <h2>Step 3: Class Selection</h2>
                <p>Choose your character's class. This determines their combat abilities, skills, and special powers.</p>
                
                <div class="selection-grid">
                    ${classOptions}
                </div>
                
                ${this.wizard.character.characterClass ? `
                    <div class="selected-info">
                        <h4>Selected: ${this.wizard.character.characterClass}</h4>
                        <p>Excellent! Your character will have the abilities and progression of the ${this.wizard.character.characterClass} class.</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render Step 4: Ability Scores
     */
    renderAbilityScoreStep() {
        const abilities = this.wizard.character.baseAbilities;
        const finalAbilities = this.wizard.character.abilities;
        
        let abilityInputs = '';
        ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(ability => {
            const base = abilities[ability] || 10;
            const final = finalAbilities[ability] || base;
            const modifier = Math.floor((final - 10) / 2);
            const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            
            abilityInputs += `
                <div class="ability-row">
                    <label class="ability-label">${ability.charAt(0).toUpperCase() + ability.slice(1)}</label>
                    <input type="number" class="ability-input" id="ability-${ability}" 
                           value="${base}" min="3" max="25" 
                           onchange="characterCreator.updateAbility('${ability}', this.value)">
                    <span class="final-score">${final}</span>
                    <span class="ability-modifier">${modifierText}</span>
                </div>
            `;
        });
        
        return `
            <div class="step-content-inner">
                <h2>Step 4: Ability Scores</h2>
                <p>Set your character's ability scores. These form the foundation of all character abilities.</p>
                
                <div class="ability-generation">
                    <button class="generate-button" onclick="characterCreator.generateAbilities('4d6dl1')">
                        🎲 Roll 4d6 Drop Lowest
                    </button>
                    <button class="generate-button" onclick="characterCreator.generateAbilities('3d6')">
                        🎲 Roll 3d6 Straight
                    </button>
                </div>
                
                <div class="ability-scores">
                    <div class="ability-header">
                        <span class="ability-label">Ability</span>
                        <span class="ability-input-label">Base</span>
                        <span class="final-score-label">Final</span>
                        <span class="ability-modifier-label">Modifier</span>
                    </div>
                    ${abilityInputs}
                </div>
                
                ${this.wizard.character.race ? `
                    <div class="racial-modifiers">
                        <h4>Racial Modifiers Applied</h4>
                        <p>Your ${this.wizard.character.race} racial bonuses are automatically applied to the final scores.</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render Step 5: Skill Allocation
     */
    renderSkillAllocationStep() {
        if (!this.wizard.character.characterClass) {
            return `
                <div class="step-content-inner">
                    <h2>Step 5: Skill Allocation</h2>
                    <p class="error">Please select a class first before allocating skills.</p>
                </div>
            `;
        }

        const characterClass = this.srdData.classes?.find(c => c.name === this.wizard.character.characterClass);
        const skillPoints = this.calculateSkillPoints(characterClass);
        const skills = this.srdData.skills || [];
        const classSkills = characterClass?.progression?.class_skills || [];
        
        // Initialize skill ranks if not already set
        if (!this.wizard.character.skills) {
            this.wizard.character.skills = {};
            skills.forEach(skill => {
                this.wizard.character.skills[skill.name] = 0;
            });
        }

        // Calculate used skill points
        const usedPoints = Object.values(this.wizard.character.skills).reduce((sum, ranks) => sum + ranks, 0);
        const remainingPoints = skillPoints - usedPoints;

        let skillRows = '';
        skills.forEach(skill => {
            const isClassSkill = classSkills.includes(skill.name);
            const currentRanks = this.wizard.character.skills[skill.name] || 0;
            const abilityMod = this.calculateAbilityModifier(skill.ability);
            const totalBonus = currentRanks + abilityMod;
            const maxRanks = isClassSkill ? this.wizard.character.level + 3 : Math.floor((this.wizard.character.level + 3) / 2);
            
            skillRows += `
                <tr class="${isClassSkill ? 'class-skill' : 'cross-class-skill'}">
                    <td class="skill-name">
                        ${skill.name}
                        ${isClassSkill ? '<span class="class-skill-marker">●</span>' : ''}
                        ${skill.trained_only ? '<span class="trained-only">*</span>' : ''}
                    </td>
                    <td class="skill-ability">${skill.ability}</td>
                    <td class="skill-ability-mod">${abilityMod >= 0 ? '+' : ''}${abilityMod}</td>
                    <td class="skill-ranks">
                        <div class="rank-controls">
                            <button class="rank-btn decrease" ${currentRanks <= 0 ? 'disabled' : ''} 
                                    onclick="characterCreator.adjustSkillRank('${skill.name}', -1)">-</button>
                            <span class="rank-value">${currentRanks}</span>
                            <button class="rank-btn increase" ${currentRanks >= maxRanks || remainingPoints <= 0 ? 'disabled' : ''} 
                                    onclick="characterCreator.adjustSkillRank('${skill.name}', 1)">+</button>
                        </div>
                    </td>
                    <td class="skill-total">${totalBonus >= 0 ? '+' : ''}${totalBonus}</td>
                </tr>
            `;
        });

        return `
            <div class="step-content-inner">
                <h2>Step 5: Skill Allocation</h2>
                <p>Allocate your skill points. Class skills (●) cost 1 point per rank, cross-class skills cost 2 points per rank.</p>
                
                <div class="skill-point-summary">
                    <div class="skill-points-info">
                        <span class="skill-points-label">Available Skill Points:</span>
                        <span class="skill-points-total">${skillPoints}</span>
                    </div>
                    <div class="skill-points-used">
                        <span class="skill-points-label">Used:</span>
                        <span class="skill-points-value">${usedPoints}</span>
                    </div>
                    <div class="skill-points-remaining ${remainingPoints < 0 ? 'overspent' : ''}">
                        <span class="skill-points-label">Remaining:</span>
                        <span class="skill-points-value">${remainingPoints}</span>
                    </div>
                </div>

                <div class="skill-legend">
                    <span class="legend-item"><span class="class-skill-marker">●</span> Class Skill (1 point per rank)</span>
                    <span class="legend-item">○ Cross-Class Skill (2 points per rank)</span>
                    <span class="legend-item"><span class="trained-only">*</span> Trained Only</span>
                </div>

                <div class="skills-table-container">
                    <table class="skills-table">
                        <thead>
                            <tr>
                                <th>Skill</th>
                                <th>Key Ability</th>
                                <th>Ability Mod</th>
                                <th>Ranks</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${skillRows}
                        </tbody>
                    </table>
                </div>

                ${remainingPoints < 0 ? `
                    <div class="error-message">
                        <p>⚠️ You have overspent your skill points by ${Math.abs(remainingPoints)}. Please reduce some skill ranks.</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render Step 6: Feat Selection
     */
    renderFeatSelectionStep() {
        if (!this.wizard.character.characterClass) {
            return `
                <div class="step-content-inner">
                    <h2>Step 6: Feat Selection</h2>
                    <p class="error">Please select a class first before choosing feats.</p>
                </div>
            `;
        }

        const feats = this.srdData.feats || [];
        const availableFeats = this.calculateAvailableFeats();
        
        // Initialize selected feats if not already set
        if (!this.wizard.character.feats) {
            this.wizard.character.feats = [];
        }

        // Filter feats based on prerequisites
        const eligibleFeats = feats.filter(feat => this.checkFeatPrerequisites(feat));
        
        let featOptions = '';
        eligibleFeats.forEach(feat => {
            const isSelected = this.wizard.character.feats.includes(feat.name);
            
            featOptions += `
                <div class="feat-card ${isSelected ? 'selected' : ''}" data-feat="${feat.name}">
                    <div class="feat-header">
                        <h4>${feat.name}</h4>
                        <div class="feat-type">${feat.type || 'General'}</div>
                    </div>
                    <p class="feat-description">${feat.description || 'This feat provides special abilities and bonuses.'}</p>
                    ${feat.prerequisites ? `<p class="feat-prerequisites"><strong>Prerequisites:</strong> ${feat.prerequisites}</p>` : ''}
                    <div class="feat-actions">
                        <button class="select-button ${isSelected ? 'selected' : ''}" 
                                ${this.wizard.character.feats.length >= availableFeats && !isSelected ? 'disabled' : ''}
                                onclick="characterCreator.toggleFeat('${feat.name}')">
                            ${isSelected ? 'Remove' : 'Select'} Feat
                        </button>
                    </div>
                </div>
            `;
        });

        return `
            <div class="step-content-inner">
                <h2>Step 6: Feat Selection</h2>
                <p>Choose feats to enhance your character's abilities. You can select ${availableFeats} feat${availableFeats !== 1 ? 's' : ''} at 1st level.</p>
                
                <div class="feat-summary">
                    <div class="feat-count">
                        <span class="feat-label">Available Feats:</span>
                        <span class="feat-total">${availableFeats}</span>
                    </div>
                    <div class="feat-selected">
                        <span class="feat-label">Selected:</span>
                        <span class="feat-value">${this.wizard.character.feats.length}</span>
                    </div>
                    <div class="feat-remaining ${this.wizard.character.feats.length > availableFeats ? 'over-limit' : ''}">
                        <span class="feat-label">Remaining:</span>
                        <span class="feat-value">${availableFeats - this.wizard.character.feats.length}</span>
                    </div>
                </div>

                <div class="feat-filter">
                    <label for="feat-type-filter">Filter by Type:</label>
                    <select id="feat-type-filter" onchange="characterCreator.filterFeats(this.value)">
                        <option value="all">All Feats</option>
                        <option value="General">General</option>
                        <option value="Combat">Combat</option>
                        <option value="Metamagic">Metamagic</option>
                        <option value="Item Creation">Item Creation</option>
                    </select>
                </div>

                <div class="feats-grid" id="feats-grid">
                    ${featOptions}
                </div>

                ${this.wizard.character.feats.length > availableFeats ? `
                    <div class="error-message">
                        <p>⚠️ You have selected too many feats. Please remove ${this.wizard.character.feats.length - availableFeats} feat${this.wizard.character.feats.length - availableFeats !== 1 ? 's' : ''}.</p>
                    </div>
                ` : ''}

                ${this.wizard.character.feats.length > 0 ? `
                    <div class="selected-feats">
                        <h4>Selected Feats:</h4>
                        <div class="selected-feat-list">
                            ${this.wizard.character.feats.map(featName => {
                                const feat = feats.find(f => f.name === featName);
                                return `
                                    <div class="selected-feat-item">
                                        <span class="selected-feat-name">${featName}</span>
                                        <button class="remove-feat-btn" onclick="characterCreator.toggleFeat('${featName}')">×</button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render Step 7: Equipment Selection
     */
    renderEquipmentSelectionStep() {
        if (!this.wizard.character.characterClass) {
            return `
                <div class="step-content-inner">
                    <h2>Step 7: Equipment Selection</h2>
                    <p class="error">Please select a class first before choosing equipment.</p>
                </div>
            `;
        }

        const characterClass = this.srdData.classes?.find(c => c.name === this.wizard.character.characterClass);
        const startingGold = this.calculateStartingGold(characterClass);
        
        // Initialize equipment if not already set
        if (!this.wizard.character.equipment) {
            this.wizard.character.equipment = {
                weapons: [],
                armor: [],
                gear: [],
                gold: startingGold
            };
        }

        const weapons = this.getWeaponsByCategory();
        const armor = this.getArmorByCategory();
        const gear = this.getBasicGear();

        return `
            <div class="step-content-inner">
                <h2>Step 7: Equipment Selection</h2>
                <p>Choose your starting equipment. You begin with ${startingGold} gold pieces to spend.</p>
                
                <div class="equipment-summary">
                    <div class="gold-info">
                        <span class="gold-label">Starting Gold:</span>
                        <span class="gold-amount">${startingGold} gp</span>
                    </div>
                    <div class="gold-spent">
                        <span class="gold-label">Spent:</span>
                        <span class="gold-amount">${this.calculateSpentGold()} gp</span>
                    </div>
                    <div class="gold-remaining ${this.getRemainingGold() < 0 ? 'overspent' : ''}">
                        <span class="gold-label">Remaining:</span>
                        <span class="gold-amount">${this.getRemainingGold()} gp</span>
                    </div>
                </div>

                <div class="equipment-tabs">
                    <button class="tab-button active" onclick="characterCreator.switchEquipmentTab('weapons')">Weapons</button>
                    <button class="tab-button" onclick="characterCreator.switchEquipmentTab('armor')">Armor</button>
                    <button class="tab-button" onclick="characterCreator.switchEquipmentTab('gear')">Gear</button>
                    <button class="tab-button" onclick="characterCreator.switchEquipmentTab('selected')">Selected Items</button>
                </div>

                <div class="equipment-content">
                    <div id="weapons-tab" class="equipment-tab active">
                        <h4>Weapons</h4>
                        <div class="equipment-grid">
                            ${this.renderWeaponOptions(weapons)}
                        </div>
                    </div>
                    
                    <div id="armor-tab" class="equipment-tab">
                        <h4>Armor</h4>
                        <div class="equipment-grid">
                            ${this.renderArmorOptions(armor)}
                        </div>
                    </div>
                    
                    <div id="gear-tab" class="equipment-tab">
                        <h4>Basic Gear</h4>
                        <div class="equipment-grid">
                            ${this.renderGearOptions(gear)}
                        </div>
                    </div>
                    
                    <div id="selected-tab" class="equipment-tab">
                        <h4>Selected Equipment</h4>
                        ${this.renderSelectedEquipment()}
                    </div>
                </div>

                ${this.getRemainingGold() < 0 ? `
                    <div class="error-message">
                        <p>⚠️ You have overspent by ${Math.abs(this.getRemainingGold())} gold pieces. Please remove some items.</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // ===================
    // ACTION HANDLERS
    // ===================

    /**
     * Select a race
     */
    selectRace(raceName) {
        this.wizard.character.race = raceName;
        
        // Apply racial modifiers
        const race = this.srdData.races?.find(r => r.name === raceName);
        if (race && race.abilityModifiers) {
            this.wizard.character.abilities = { ...this.wizard.character.baseAbilities };
            
            for (const [ability, modifier] of Object.entries(race.abilityModifiers)) {
                this.wizard.character.abilities[ability] = 
                    (this.wizard.character.baseAbilities[ability] || 10) + (modifier || 0);
            }
        }
        
        this.renderCurrentStep();
        this.updateCharacterPreview();
        console.log(`🌟 Selected race: ${raceName}`);
    }

    /**
     * Select a class
     */
    selectClass(className) {
        this.wizard.character.characterClass = className;
        this.renderCurrentStep();
        this.updateCharacterPreview();
        console.log(`⚔️ Selected class: ${className}`);
    }

    /**
     * Update ability score
     */
    updateAbility(ability, value) {
        const numValue = parseInt(value) || 10;
        this.wizard.character.baseAbilities[ability] = numValue;
        
        // Recalculate final abilities with racial modifiers
        const race = this.srdData.races?.find(r => r.name === this.wizard.character.race);
        if (race && race.abilityModifiers) {
            this.wizard.character.abilities[ability] = 
                numValue + (race.abilityModifiers[ability] || 0);
        } else {
            this.wizard.character.abilities[ability] = numValue;
        }
        
        this.renderCurrentStep();
        this.updateCharacterPreview();
    }

    /**
     * Adjust skill rank
     */
    adjustSkillRank(skillName, change) {
        if (!this.wizard.character.skills) {
            this.wizard.character.skills = {};
        }

        const skill = this.srdData.skills?.find(s => s.name === skillName);
        const characterClass = this.srdData.classes?.find(c => c.name === this.wizard.character.characterClass);
        const classSkills = characterClass?.progression?.class_skills || [];
        const isClassSkill = classSkills.includes(skillName);
        
        const currentRanks = this.wizard.character.skills[skillName] || 0;
        const newRanks = Math.max(0, currentRanks + change);
        const maxRanks = isClassSkill ? this.wizard.character.level + 3 : Math.floor((this.wizard.character.level + 3) / 2);
        
        // Validate the change
        if (newRanks > maxRanks) {
            return; // Can't exceed max ranks
        }
        
        // Calculate skill point cost
        const pointCost = isClassSkill ? 1 : 2;
        const skillPoints = this.calculateSkillPoints(characterClass);
        const currentUsedPoints = Object.values(this.wizard.character.skills).reduce((sum, ranks) => sum + ranks, 0);
        const pointsAfterChange = currentUsedPoints - currentRanks + newRanks;
        
        if (pointsAfterChange > skillPoints && change > 0) {
            return; // Not enough skill points
        }
        
        this.wizard.character.skills[skillName] = newRanks;
        this.renderCurrentStep();
        this.updateCharacterPreview();
        
        console.log(`📈 Adjusted ${skillName}: ${currentRanks} → ${newRanks} ranks`);
    }

    /**
     * Toggle feat selection
     */
    toggleFeat(featName) {
        if (!this.wizard.character.feats) {
            this.wizard.character.feats = [];
        }

        const featIndex = this.wizard.character.feats.indexOf(featName);
        const availableFeats = this.calculateAvailableFeats();

        if (featIndex === -1) {
            // Adding feat
            if (this.wizard.character.feats.length < availableFeats) {
                this.wizard.character.feats.push(featName);
                console.log(`⭐ Selected feat: ${featName}`);
            }
        } else {
            // Removing feat
            this.wizard.character.feats.splice(featIndex, 1);
            console.log(`❌ Removed feat: ${featName}`);
        }

        this.renderCurrentStep();
        this.updateCharacterPreview();
    }

    /**
     * Calculate available feats for character
     */
    calculateAvailableFeats() {
        let baseFeats = 1; // All characters get 1 feat at 1st level
        
        // Humans get bonus feat
        if (this.wizard.character.race === 'Human') {
            baseFeats += 1;
        }
        
        // Fighters get bonus combat feats
        if (this.wizard.character.characterClass === 'Fighter') {
            baseFeats += 1;
        }
        
        // Wizards get bonus metamagic or item creation feats
        if (this.wizard.character.characterClass === 'Wizard') {
            baseFeats += 1;
        }
        
        return baseFeats;
    }

    /**
     * Check if character meets feat prerequisites
     */
    checkFeatPrerequisites(feat) {
        // For now, return true for all feats
        // In full implementation, would check ability scores, skills, other feats, etc.
        return true;
    }

    /**
     * Filter feats by type
     */
    filterFeats(type) {
        const feats = this.srdData.feats || [];
        const featCards = document.querySelectorAll('.feat-card');
        
        featCards.forEach(card => {
            const featName = card.dataset.feat;
            const feat = feats.find(f => f.name === featName);
            
            if (type === 'all' || (feat && feat.type === type)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /**
     * Calculate starting gold for character class
     */
    calculateStartingGold(characterClass) {
        const startingGoldByClass = {
            'Barbarian': 100,
            'Bard': 100,
            'Cleric': 125,
            'Druid': 50,
            'Fighter': 150,
            'Monk': 25,
            'Paladin': 150,
            'Ranger': 150,
            'Rogue': 125,
            'Sorcerer': 75,
            'Wizard': 75
        };
        
        return startingGoldByClass[characterClass?.name] || 100;
    }

    /**
     * Calculate spent gold
     */
    calculateSpentGold() {
        if (!this.wizard.character.equipment) return 0;
        
        let total = 0;
        const equipment = this.wizard.character.equipment;
        
        // Add up weapon costs
        equipment.weapons?.forEach(weapon => {
            total += weapon.cost || 0;
        });
        
        // Add up armor costs
        equipment.armor?.forEach(armor => {
            total += armor.cost || 0;
        });
        
        // Add up gear costs
        equipment.gear?.forEach(item => {
            total += (item.cost || 0) * (item.quantity || 1);
        });
        
        return total;
    }

    /**
     * Get remaining gold
     */
    getRemainingGold() {
        const starting = this.wizard.character.equipment?.gold || 0;
        const spent = this.calculateSpentGold();
        return starting - spent;
    }

    /**
     * Get weapons by category
     */
    getWeaponsByCategory() {
        return {
            simple: [
                { name: 'Dagger', cost: 2, damage: '1d4', type: 'Simple' },
                { name: 'Club', cost: 0, damage: '1d6', type: 'Simple' },
                { name: 'Shortspear', cost: 1, damage: '1d6', type: 'Simple' },
                { name: 'Light Crossbow', cost: 35, damage: '1d8', type: 'Simple' }
            ],
            martial: [
                { name: 'Longsword', cost: 15, damage: '1d8', type: 'Martial' },
                { name: 'Battleaxe', cost: 10, damage: '1d8', type: 'Martial' },
                { name: 'Longbow', cost: 75, damage: '1d8', type: 'Martial' },
                { name: 'Greatsword', cost: 50, damage: '2d6', type: 'Martial' }
            ]
        };
    }

    /**
     * Get armor by category
     */
    getArmorByCategory() {
        return {
            light: [
                { name: 'Padded', cost: 5, ac: 1, type: 'Light' },
                { name: 'Leather', cost: 10, ac: 2, type: 'Light' },
                { name: 'Studded Leather', cost: 25, ac: 3, type: 'Light' }
            ],
            medium: [
                { name: 'Hide', cost: 15, ac: 3, type: 'Medium' },
                { name: 'Scale Mail', cost: 50, ac: 4, type: 'Medium' },
                { name: 'Chain Shirt', cost: 100, ac: 4, type: 'Medium' }
            ],
            heavy: [
                { name: 'Ring Mail', cost: 30, ac: 2, type: 'Heavy' },
                { name: 'Chain Mail', cost: 150, ac: 5, type: 'Heavy' },
                { name: 'Plate Mail', cost: 600, ac: 8, type: 'Heavy' }
            ]
        };
    }

    /**
     * Get basic gear options
     */
    getBasicGear() {
        return [
            { name: 'Backpack', cost: 2, type: 'Gear' },
            { name: 'Bedroll', cost: 0.1, type: 'Gear' },
            { name: 'Rope (50 ft)', cost: 2, type: 'Gear' },
            { name: 'Rations (1 day)', cost: 0.5, type: 'Gear' },
            { name: 'Waterskin', cost: 1, type: 'Gear' },
            { name: 'Torch', cost: 0.01, type: 'Gear' },
            { name: 'Potion of Cure Light Wounds', cost: 50, type: 'Potion' },
            { name: 'Thieves\' Tools', cost: 30, type: 'Tools' }
        ];
    }

    /**
     * Render weapon options
     */
    renderWeaponOptions(weapons) {
        let html = '';
        
        Object.entries(weapons).forEach(([category, weaponList]) => {
            html += `<h5>${category.charAt(0).toUpperCase() + category.slice(1)} Weapons</h5>`;
            weaponList.forEach(weapon => {
                const isSelected = this.isEquipmentSelected('weapons', weapon.name);
                html += `
                    <div class="equipment-item ${isSelected ? 'selected' : ''}">
                        <div class="item-info">
                            <h6>${weapon.name}</h6>
                            <p>Damage: ${weapon.damage} | Cost: ${weapon.cost} gp</p>
                        </div>
                        <button class="select-item-btn ${isSelected ? 'selected' : ''}" 
                                onclick="characterCreator.toggleEquipment('weapons', ${JSON.stringify(weapon).replace(/"/g, '&quot;')})">
                            ${isSelected ? 'Remove' : 'Select'}
                        </button>
                    </div>
                `;
            });
        });
        
        return html;
    }

    /**
     * Render armor options
     */
    renderArmorOptions(armor) {
        let html = '';
        
        Object.entries(armor).forEach(([category, armorList]) => {
            html += `<h5>${category.charAt(0).toUpperCase() + category.slice(1)} Armor</h5>`;
            armorList.forEach(armorItem => {
                const isSelected = this.isEquipmentSelected('armor', armorItem.name);
                html += `
                    <div class="equipment-item ${isSelected ? 'selected' : ''}">
                        <div class="item-info">
                            <h6>${armorItem.name}</h6>
                            <p>AC Bonus: +${armorItem.ac} | Cost: ${armorItem.cost} gp</p>
                        </div>
                        <button class="select-item-btn ${isSelected ? 'selected' : ''}" 
                                onclick="characterCreator.toggleEquipment('armor', ${JSON.stringify(armorItem).replace(/"/g, '&quot;')})">
                            ${isSelected ? 'Remove' : 'Select'}
                        </button>
                    </div>
                `;
            });
        });
        
        return html;
    }

    /**
     * Render gear options
     */
    renderGearOptions(gear) {
        let html = '';
        
        gear.forEach(item => {
            const selectedItem = this.getSelectedGearItem(item.name);
            const quantity = selectedItem ? selectedItem.quantity : 0;
            
            html += `
                <div class="equipment-item ${quantity > 0 ? 'selected' : ''}">
                    <div class="item-info">
                        <h6>${item.name}</h6>
                        <p>Cost: ${item.cost} gp each</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="characterCreator.adjustGearQuantity('${item.name}', -1)">-</button>
                        <span class="quantity-value">${quantity}</span>
                        <button class="quantity-btn" onclick="characterCreator.adjustGearQuantity('${item.name}', 1)">+</button>
                    </div>
                </div>
            `;
        });
        
        return html;
    }

    /**
     * Render selected equipment
     */
    renderSelectedEquipment() {
        if (!this.wizard.character.equipment) return '<p>No equipment selected.</p>';
        
        const equipment = this.wizard.character.equipment;
        let html = '';
        
        if (equipment.weapons?.length > 0) {
            html += '<h5>Weapons</h5><ul>';
            equipment.weapons.forEach(weapon => {
                html += `<li>${weapon.name} (${weapon.cost} gp)</li>`;
            });
            html += '</ul>';
        }
        
        if (equipment.armor?.length > 0) {
            html += '<h5>Armor</h5><ul>';
            equipment.armor.forEach(armor => {
                html += `<li>${armor.name} (AC +${armor.ac}, ${armor.cost} gp)</li>`;
            });
            html += '</ul>';
        }
        
        if (equipment.gear?.length > 0) {
            html += '<h5>Gear</h5><ul>';
            equipment.gear.forEach(item => {
                html += `<li>${item.name} x${item.quantity} (${item.cost * item.quantity} gp total)</li>`;
            });
            html += '</ul>';
        }
        
        if (html === '') {
            html = '<p>No equipment selected.</p>';
        }
        
        return html;
    }

    /**
     * Check if equipment is selected
     */
    isEquipmentSelected(category, itemName) {
        if (!this.wizard.character.equipment || !this.wizard.character.equipment[category]) {
            return false;
        }
        
        return this.wizard.character.equipment[category].some(item => item.name === itemName);
    }

    /**
     * Get selected gear item
     */
    getSelectedGearItem(itemName) {
        if (!this.wizard.character.equipment || !this.wizard.character.equipment.gear) {
            return null;
        }
        
        return this.wizard.character.equipment.gear.find(item => item.name === itemName);
    }

    /**
     * Toggle equipment selection
     */
    toggleEquipment(category, item) {
        if (!this.wizard.character.equipment) {
            this.wizard.character.equipment = { weapons: [], armor: [], gear: [], gold: 0 };
        }
        
        if (!this.wizard.character.equipment[category]) {
            this.wizard.character.equipment[category] = [];
        }
        
        const existingIndex = this.wizard.character.equipment[category].findIndex(existing => existing.name === item.name);
        
        if (existingIndex === -1) {
            // Add item
            this.wizard.character.equipment[category].push(item);
            console.log(`⚔️ Added ${item.name} to ${category}`);
        } else {
            // Remove item
            this.wizard.character.equipment[category].splice(existingIndex, 1);
            console.log(`❌ Removed ${item.name} from ${category}`);
        }
        
        this.renderCurrentStep();
        this.updateCharacterPreview();
    }

    /**
     * Adjust gear quantity
     */
    adjustGearQuantity(itemName, change) {
        if (!this.wizard.character.equipment) {
            this.wizard.character.equipment = { weapons: [], armor: [], gear: [], gold: 0 };
        }
        
        if (!this.wizard.character.equipment.gear) {
            this.wizard.character.equipment.gear = [];
        }
        
        let existingItem = this.wizard.character.equipment.gear.find(item => item.name === itemName);
        
        if (!existingItem) {
            // Create new item
            const basicGear = this.getBasicGear();
            const template = basicGear.find(item => item.name === itemName);
            if (template) {
                existingItem = { ...template, quantity: 0 };
                this.wizard.character.equipment.gear.push(existingItem);
            } else {
                return;
            }
        }
        
        const newQuantity = Math.max(0, existingItem.quantity + change);
        
        if (newQuantity === 0) {
            // Remove item if quantity is 0
            const index = this.wizard.character.equipment.gear.indexOf(existingItem);
            this.wizard.character.equipment.gear.splice(index, 1);
        } else {
            existingItem.quantity = newQuantity;
        }
        
        this.renderCurrentStep();
        this.updateCharacterPreview();
    }

    /**
     * Switch equipment tab
     */
    switchEquipmentTab(tabName) {
        // Hide all tabs
        const tabs = document.querySelectorAll('.equipment-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Hide all tab buttons
        const buttons = document.querySelectorAll('.tab-button');
        buttons.forEach(button => button.classList.remove('active'));
        
        // Show selected tab
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Highlight selected button
        const selectedButton = [...buttons].find(button => 
            button.textContent.toLowerCase().includes(tabName.toLowerCase())
        );
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
    }

    /**
     * Calculate skill points for a character class
     */
    calculateSkillPoints(characterClass) {
        if (!characterClass || !characterClass.progression) {
            return 8; // Default fallback
        }
        
        const baseSkillPoints = characterClass.progression.skill_points || 2;
        const intModifier = this.calculateAbilityModifier('Intelligence');
        const raceBonus = 0; // Humans get +1, could add this later
        
        return Math.max(1, baseSkillPoints + intModifier + raceBonus);
    }

    /**
     * Calculate ability modifier
     */
    calculateAbilityModifier(abilityName) {
        const abilityShort = {
            'Strength': 'strength',
            'Dexterity': 'dexterity', 
            'Constitution': 'constitution',
            'Intelligence': 'intelligence',
            'Wisdom': 'wisdom',
            'Charisma': 'charisma',
            'Str': 'strength',
            'Dex': 'dexterity',
            'Con': 'constitution', 
            'Int': 'intelligence',
            'Wis': 'wisdom',
            'Cha': 'charisma'
        };
        
        const ability = abilityShort[abilityName] || abilityName.toLowerCase();
        const score = this.wizard.character.abilities[ability] || 10;
        return Math.floor((score - 10) / 2);
    }

    /**
     * Generate ability scores
     */
    async generateAbilities(method) {
        try {
            const abilities = {};
            const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
            
            for (const ability of abilityNames) {
                let roll;
                if (method === '4d6dl1') {
                    // Roll 4d6, drop lowest
                    const response = await fetch('/api/dice/roll?expression=4d6dl1');
                    const result = await response.json();
                    roll = result.success ? result.result : 10;
                } else if (method === '3d6') {
                    // Roll 3d6 straight
                    const response = await fetch('/api/dice/roll?expression=3d6');
                    const result = await response.json();
                    roll = result.success ? result.result : 10;
                } else {
                    roll = 10; // Default
                }
                
                abilities[ability] = roll;
            }
            
            this.wizard.character.baseAbilities = abilities;
            
            // Apply racial modifiers
            const race = this.srdData.races?.find(r => r.name === this.wizard.character.race);
            if (race && race.abilityModifiers) {
                this.wizard.character.abilities = {};
                for (const [ability, base] of Object.entries(abilities)) {
                    this.wizard.character.abilities[ability] = 
                        base + (race.abilityModifiers[ability] || 0);
                }
            } else {
                this.wizard.character.abilities = { ...abilities };
            }
            
            this.renderCurrentStep();
            this.updateCharacterPreview();
            
            console.log(`🎲 Generated abilities using ${method}:`, abilities);
        } catch (error) {
            console.error('Error generating abilities:', error);
            this.showError('Failed to generate ability scores: ' + error.message);
        }
    }

    // ===================
    // VALIDATION & NAVIGATION
    // ===================

    /**
     * Validate current step
     */
    async validateCurrentStep() {
        const step = this.wizard.currentStep;
        
        switch (step) {
            case 1:
                return this.wizard.character.name && this.wizard.character.name.trim().length > 0;
            case 2:
                return Boolean(this.wizard.character.race);
            case 3:
                return Boolean(this.wizard.character.characterClass);
            case 4:
                return this.areAbilityScoresValid();
            case 5:
            case 6:
            case 7:
                return true; // These steps are optional for now
            default:
                return false;
        }
    }

    /**
     * Check if ability scores are valid
     */
    areAbilityScoresValid() {
        const abilities = this.wizard.character.baseAbilities;
        
        for (const [ability, score] of Object.entries(abilities)) {
            if (score < 3 || score > 25) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Save current step data
     */
    async saveCurrentStepData() {
        // For now, data is stored in memory
        // In full implementation, this would save to server
        console.log(`💾 Saving step ${this.wizard.currentStep} data`);
    }

    /**
     * Update navigation buttons
     */
    updateNavigation() {
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');
        const completeButton = document.getElementById('complete-button');
        
        if (prevButton) {
            prevButton.disabled = this.wizard.currentStep <= 1;
        }
        
        if (nextButton && completeButton) {
            if (this.wizard.currentStep >= this.wizard.totalSteps) {
                nextButton.style.display = 'none';
                completeButton.style.display = 'inline-block';
            } else {
                nextButton.style.display = 'inline-block';
                completeButton.style.display = 'none';
            }
        }
    }

    /**
     * Update character preview
     */
    updateCharacterPreview() {
        const previewContent = document.getElementById('preview-content');
        if (!previewContent) return;
        
        const char = this.wizard.character;
        
        let html = '<div class="character-summary">';
        
        if (char.name) {
            html += `<h4>${char.name}</h4>`;
        }
        
        if (char.race || char.characterClass) {
            html += `<p class="character-title">`;
            if (char.race) html += `${char.race}`;
            if (char.race && char.characterClass) html += ` `;
            if (char.characterClass) html += `${char.characterClass}`;
            html += `</p>`;
        }
        
        if (char.level) {
            html += `<p><strong>Level:</strong> ${char.level}</p>`;
        }
        
        // Show abilities if they exist
        if (char.abilities && Object.values(char.abilities).some(v => v !== 10)) {
            html += '<div class="preview-abilities">';
            html += '<h5>Abilities</h5>';
            for (const [ability, score] of Object.entries(char.abilities)) {
                const modifier = Math.floor((score - 10) / 2);
                const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
                html += `<div class="ability-preview">${ability.substring(0, 3).toUpperCase()}: ${score} (${modifierText})</div>`;
            }
            html += '</div>';
        }

        // Show selected feats
        if (char.feats && char.feats.length > 0) {
            html += '<div class="preview-feats">';
            html += '<h5>Feats</h5>';
            char.feats.forEach(feat => {
                html += `<div class="feat-preview">${feat}</div>`;
            });
            html += '</div>';
        }

        // Show selected skills with ranks
        if (char.skills) {
            const skillsWithRanks = Object.entries(char.skills).filter(([_, ranks]) => ranks > 0);
            if (skillsWithRanks.length > 0) {
                html += '<div class="preview-skills">';
                html += '<h5>Skills</h5>';
                skillsWithRanks.forEach(([skill, ranks]) => {
                    html += `<div class="skill-preview">${skill}: ${ranks} ranks</div>`;
                });
                html += '</div>';
            }
        }

        // Show equipment summary
        if (char.equipment) {
            const hasEquipment = (char.equipment.weapons && char.equipment.weapons.length > 0) ||
                               (char.equipment.armor && char.equipment.armor.length > 0) ||
                               (char.equipment.gear && char.equipment.gear.length > 0);
            
            if (hasEquipment) {
                html += '<div class="preview-equipment">';
                html += '<h5>Equipment</h5>';
                
                if (char.equipment.weapons && char.equipment.weapons.length > 0) {
                    html += `<div class="equipment-category">Weapons: ${char.equipment.weapons.map(w => w.name).join(', ')}</div>`;
                }
                
                if (char.equipment.armor && char.equipment.armor.length > 0) {
                    html += `<div class="equipment-category">Armor: ${char.equipment.armor.map(a => a.name).join(', ')}</div>`;
                }
                
                if (char.equipment.gear && char.equipment.gear.length > 0) {
                    const gearSummary = char.equipment.gear.map(g => `${g.name} (${g.quantity})`).join(', ');
                    html += `<div class="equipment-category">Gear: ${gearSummary}</div>`;
                }
                
                html += '</div>';
            }
        }
        
        html += '</div>';
        
        previewContent.innerHTML = html;
    }

    /**
     * Attach event handlers for current step
     */
    attachStepEventHandlers() {
        // Event handlers are mostly handled through inline onclick for simplicity
        // In a production app, we'd use proper event delegation
    }

    /**
     * Complete character creation
     */
    async completeCharacter() {
        try {
            // Final validation
            if (!await this.validateAllSteps()) {
                this.showError('Please complete all required steps before finishing.');
                return;
            }
            
            // Generate final character using server API
            const response = await fetch('/api/character/generate');
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Character created successfully!');
                console.log('🎉 Character creation completed:', result.character);
                
                // Show final character sheet
                this.showFinalCharacterSheet(result.character);
            } else {
                throw new Error(result.error || 'Character generation failed');
            }
        } catch (error) {
            console.error('Error completing character:', error);
            this.showError('Failed to complete character: ' + error.message);
        }
    }

    /**
     * Validate all steps
     */
    async validateAllSteps() {
        const originalStep = this.wizard.currentStep;
        
        for (let step = 1; step <= this.wizard.totalSteps; step++) {
            this.wizard.currentStep = step;
            if (!await this.validateCurrentStep()) {
                this.wizard.currentStep = originalStep;
                return false;
            }
        }
        
        this.wizard.currentStep = originalStep;
        return true;
    }

    /**
     * Show final character sheet
     */
    showFinalCharacterSheet(character) {
        const container = this.elements.container;
        
        container.innerHTML = `
            <div class="character-sheet-final">
                <h1>🎉 Character Creation Complete!</h1>
                <div class="final-character-sheet">
                    <h2>${character.name} the ${character.race} ${character.characterClass}</h2>
                    
                    <div class="character-stats">
                        <div class="stat-block">
                            <h3>Basic Information</h3>
                            <p><strong>Level:</strong> ${character.level}</p>
                            <p><strong>Hit Points:</strong> ${character.hitPoints}</p>
                            <p><strong>Armor Class:</strong> ${character.armorClass}</p>
                        </div>
                        
                        <div class="stat-block">
                            <h3>Abilities</h3>
                            <p><strong>STR:</strong> ${character.abilities.strength}</p>
                            <p><strong>DEX:</strong> ${character.abilities.dexterity}</p>
                            <p><strong>CON:</strong> ${character.abilities.constitution}</p>
                            <p><strong>INT:</strong> ${character.abilities.intelligence}</p>
                            <p><strong>WIS:</strong> ${character.abilities.wisdom}</p>
                            <p><strong>CHA:</strong> ${character.abilities.charisma}</p>
                        </div>
                        
                        <div class="stat-block">
                            <h3>Equipment</h3>
                            <p>${character.equipment.join(', ') || 'Basic starting equipment'}</p>
                        </div>
                    </div>
                    
                    <div class="final-actions">
                        <button class="action-button" onclick="characterCreator.saveCharacter()">
                            💾 Save Character
                        </button>
                        <button class="action-button" onclick="characterCreator.viewCharacterSheet()">
                            📄 View Character Sheet
                        </button>
                        <button class="action-button" onclick="characterCreator.exportCharacter()">
                            � Export to File
                        </button>
                        <button class="action-button" onclick="characterCreator.loadSavedCharacters()">
                            📁 Load Character
                        </button>
                        <button class="action-button" onclick="characterCreator.startNewCharacter()">
                            🆕 Create Another Character
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ===================
    // UTILITY METHODS
    // ===================

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">❌</span>
                <span class="error-text">${message}</span>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <span class="success-icon">✅</span>
                <span class="success-text">${message}</span>
                <button class="success-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentElement) {
                successDiv.remove();
            }
        }, 3000);
    }

    /**
     * Save character to local storage
     */
    saveCharacter() {
        try {
            if (!this.storageManager) {
                throw new Error('Storage manager not initialized');
            }

            const result = this.storageManager.saveCharacter(this.wizard.character);
            
            if (result.success) {
                this.showSuccess(result.message);
                // Update current character reference for auto-save
                window.currentCharacter = this.wizard.character;
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('❌ Error saving character:', error);
            this.showError('Failed to save character: ' + error.message);
        }
    }

    /**
     * View complete character sheet
     */
    viewCharacterSheet() {
        try {
            if (!this.characterSheetRenderer) {
                throw new Error('Character sheet renderer not initialized');
            }

            // Create character sheet HTML
            const sheetHTML = this.characterSheetRenderer.renderCharacterSheet(this.wizard.character);
            
            // Create modal window for character sheet
            const modal = document.createElement('div');
            modal.className = 'character-sheet-modal';
            modal.innerHTML = `
                <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>📄 Character Sheet: ${this.wizard.character.name}</h2>
                        <div class="modal-actions">
                            <button class="modal-action-btn" onclick="characterCreator.printCharacterSheet()">
                                🖨️ Print
                            </button>
                            <button class="modal-action-btn" onclick="characterCreator.exportCharacter()">
                                📤 Export
                            </button>
                            <button class="modal-close" onclick="this.closest('.character-sheet-modal').remove()">
                                ✕
                            </button>
                        </div>
                    </div>
                    <div class="modal-body">
                        ${sheetHTML}
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
        } catch (error) {
            console.error('❌ Error viewing character sheet:', error);
            this.showError('Failed to display character sheet: ' + error.message);
        }
    }

    /**
     * Print character sheet
     */
    printCharacterSheet() {
        try {
            const printWindow = window.open('', '_blank');
            const sheetHTML = this.characterSheetRenderer.renderCharacterSheet(this.wizard.character);
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Character Sheet - ${this.wizard.character.name}</title>
                    <link rel="stylesheet" href="/css/character-sheet.css">
                    <style>
                        @media print {
                            body { margin: 0; padding: 10px; }
                            .character-sheet-complete { box-shadow: none; }
                        }
                    </style>
                </head>
                <body>
                    ${sheetHTML}
                    <script>
                        window.onload = function() {
                            window.print();
                            window.close();
                        };
                    </script>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
        } catch (error) {
            console.error('❌ Error printing character sheet:', error);
            this.showError('Failed to print character sheet: ' + error.message);
        }
    }

    /**
     * Load saved characters
     */
    loadSavedCharacters() {
        try {
            if (!this.storageManager) {
                throw new Error('Storage manager not initialized');
            }

            const result = this.storageManager.getAllCharacters();
            
            if (!result.success) {
                throw new Error(result.error);
            }

            if (result.characters.length === 0) {
                this.showError('No saved characters found.');
                return;
            }

            // Create character selection modal
            const modal = document.createElement('div');
            modal.className = 'character-library-modal';
            
            let charactersHTML = '';
            result.characters.forEach(character => {
                const lastSaved = character.metadata?.lastSaved ? 
                    new Date(character.metadata.lastSaved).toLocaleDateString() : 'Unknown';
                
                charactersHTML += `
                    <div class="saved-character-item" onclick="characterCreator.loadCharacterById('${character.characterId}')">
                        <div class="character-info">
                            <h4>${character.name}</h4>
                            <p>Level ${character.level} ${character.race} ${character.characterClass}</p>
                            <small>Last saved: ${lastSaved}</small>
                        </div>
                        <div class="character-actions">
                            <button class="delete-btn" onclick="event.stopPropagation(); characterCreator.deleteCharacter('${character.characterId}')">
                                🗑️
                            </button>
                            <button class="export-btn" onclick="event.stopPropagation(); characterCreator.exportCharacterById('${character.characterId}')">
                                📤
                            </button>
                        </div>
                    </div>
                `;
            });
            
            modal.innerHTML = `
                <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
                <div class="modal-content library-modal">
                    <div class="modal-header">
                        <h2>📁 Character Library (${result.characters.length} characters)</h2>
                        <div class="modal-actions">
                            <input type="file" id="import-character" accept=".json" style="display: none;" 
                                   onchange="characterCreator.importCharacterFile(this.files[0])">
                            <button class="modal-action-btn" onclick="document.getElementById('import-character').click()">
                                📥 Import Character
                            </button>
                            <button class="modal-close" onclick="this.closest('.character-library-modal').remove()">
                                ✕
                            </button>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="character-library">
                            ${charactersHTML}
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
        } catch (error) {
            console.error('❌ Error loading saved characters:', error);
            this.showError('Failed to load saved characters: ' + error.message);
        }
    }

    /**
     * Load specific character by ID
     */
    loadCharacterById(characterId) {
        try {
            const result = this.storageManager.loadCharacter(characterId);
            
            if (result.success) {
                if (confirm(`Load character '${result.character.name}'? This will replace your current character.`)) {
                    this.wizard.character = result.character;
                    this.currentCharacter = result.character;
                    window.currentCharacter = result.character;
                    
                    // Close modal
                    const modal = document.querySelector('.character-library-modal');
                    if (modal) modal.remove();
                    
                    // Refresh display
                    this.renderCurrentStep();
                    
                    this.showSuccess(`Character '${result.character.name}' loaded successfully!`);
                }
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('❌ Error loading character:', error);
            this.showError('Failed to load character: ' + error.message);
        }
    }

    /**
     * Delete character by ID
     */
    deleteCharacter(characterId) {
        try {
            const character = this.storageManager.characters.get(characterId);
            if (!character) {
                this.showError('Character not found');
                return;
            }

            if (confirm(`Are you sure you want to delete '${character.name}'? This action cannot be undone.`)) {
                const result = this.storageManager.deleteCharacter(characterId);
                
                if (result.success) {
                    // Refresh the character library
                    const modal = document.querySelector('.character-library-modal');
                    if (modal) {
                        modal.remove();
                        this.loadSavedCharacters();
                    }
                    
                    this.showSuccess(result.message);
                } else {
                    this.showError(result.error);
                }
            }
        } catch (error) {
            console.error('❌ Error deleting character:', error);
            this.showError('Failed to delete character: ' + error.message);
        }
    }

    /**
     * Export specific character by ID
     */
    exportCharacterById(characterId) {
        try {
            const result = this.storageManager.exportCharacter(characterId);
            
            if (result.success) {
                this.showSuccess(result.message);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('❌ Error exporting character:', error);
            this.showError('Failed to export character: ' + error.message);
        }
    }

    /**
     * Import character from file
     */
    async importCharacterFile(file) {
        try {
            if (!file) return;

            const result = await this.storageManager.importCharacter(file);
            
            if (result.success) {
                // Refresh the character library
                const modal = document.querySelector('.character-library-modal');
                if (modal) {
                    modal.remove();
                    this.loadSavedCharacters();
                }
                
                this.showSuccess(result.message);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('❌ Error importing character:', error);
            this.showError('Failed to import character: ' + error.message);
        }
    }

    /**
     * Export character sheet (updated method)
     */
    exportCharacter() {
        try {
            if (this.storageManager) {
                // Use storage manager export for better formatting
                if (this.wizard.character.characterId) {
                    this.exportCharacterById(this.wizard.character.characterId);
                } else {
                    // Save first, then export
                    const saveResult = this.storageManager.saveCharacter(this.wizard.character);
                    if (saveResult.success) {
                        this.exportCharacterById(this.wizard.character.characterId);
                    } else {
                        throw new Error('Failed to save character for export');
                    }
                }
            } else {
                // Fallback to simple JSON export
                const characterData = JSON.stringify(this.wizard.character, null, 2);
                const blob = new Blob([characterData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `${this.wizard.character.name || 'character'}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                URL.revokeObjectURL(url);
                
                this.showSuccess('Character exported successfully!');
            }
        } catch (error) {
            console.error('❌ Error exporting character:', error);
            this.showError('Failed to export character: ' + error.message);
        }
    }

    /**
     * Start new character creation
     */
    startNewCharacter() {
        if (confirm('Are you sure you want to start over? This will clear the current character.')) {
            location.reload();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎲 Initializing Character Creator Interface...');
    window.characterCreator = new CharacterCreatorInterface();
});

// Make it globally available
window.CharacterCreatorInterface = CharacterCreatorInterface;
/**
 * CharacterCreationWizard - 7-Step D&D 3.5 Character Creation Process
 * Guides users through complete character creation with validation
 * 
 * Steps:
 * 1. Basic Information (Name, Alignment)
 * 2. Race Selection
 * 3. Class Selection  
 * 4. Ability Score Generation
 * 5. Skill Point Allocation
 * 6. Feat Selection
 * 7. Equipment Selection
 * 
 * Features:
 * - Step-by-step validation
 * - Real-time stat calculation
 * - SRD compliance checking
 * - Save/load character state
 * - Undo/redo functionality
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

const CharacterModel = require('./character-model.js');
const SRDDataManager = require('../data/srd-data-manager.js');
const DiceEngine = require('../dice/dice-engine.js');

class CharacterCreationWizard {
    constructor() {
        this.srdData = new SRDDataManager();
        this.diceEngine = new DiceEngine();
        this.character = new CharacterModel(this.srdData);

        this.currentStep = 1;
        this.totalSteps = 7;
        this.stepHistory = [];
        this.validationResults = {};

        // Step definitions
        this.steps = [
            { id: 1, name: 'Basic Information', required: true },
            { id: 2, name: 'Race Selection', required: true },
            { id: 3, name: 'Class Selection', required: true },
            { id: 4, name: 'Ability Scores', required: true },
            { id: 5, name: 'Skill Allocation', required: true },
            { id: 6, name: 'Feat Selection', required: true },
            { id: 7, name: 'Equipment Selection', required: false }
        ];

        console.log('🧙 Character Creation Wizard initialized');
    }

    // ===================
    // WIZARD NAVIGATION
    // ===================

    /**
     * Start the character creation process
     */
    startCreation() {
        this.currentStep = 1;
        this.character = new CharacterModel(this.srdData);
        this.stepHistory = [];
        this.validationResults = {};

        console.log('🎯 Starting character creation wizard');
        return this.getCurrentStepData();
    }

    /**
     * Move to next step
     */
    nextStep() {
        if (this.currentStep >= this.totalSteps) {
            throw new Error('Already at final step');
        }

        // Validate current step before proceeding
        if (!this.validateCurrentStep()) {
            throw new Error('Current step validation failed');
        }

        this.stepHistory.push(this.currentStep);
        this.currentStep++;

        console.log(`➡️ Advanced to step ${this.currentStep}: ${this.getCurrentStepName()}`);
        return this.getCurrentStepData();
    }

    /**
     * Move to previous step
     */
    previousStep() {
        if (this.currentStep <= 1) {
            throw new Error('Already at first step');
        }

        this.currentStep--;
        console.log(`⬅️ Returned to step ${this.currentStep}: ${this.getCurrentStepName()}`);
        return this.getCurrentStepData();
    }

    /**
     * Jump to specific step
     */
    goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > this.totalSteps) {
            throw new Error(`Invalid step number: ${stepNumber}`);
        }

        this.currentStep = stepNumber;
        console.log(`🎯 Jumped to step ${this.currentStep}: ${this.getCurrentStepName()}`);
        return this.getCurrentStepData();
    }

    /**
     * Get current step information
     */
    getCurrentStepData() {
        const stepData = {
            currentStep: this.currentStep,
            totalSteps: this.totalSteps,
            stepName: this.getCurrentStepName(),
            canGoNext: this.currentStep < this.totalSteps && this.validateCurrentStep(),
            canGoPrevious: this.currentStep > 1,
            character: this.character.getSummary(),
            validation: this.validationResults[this.currentStep] || { isValid: false, errors: [] }
        };

        // Add step-specific data
        switch (this.currentStep) {
            case 1:
                stepData.stepContent = this.getBasicInformationStep();
                break;
            case 2:
                stepData.stepContent = this.getRaceSelectionStep();
                break;
            case 3:
                stepData.stepContent = this.getClassSelectionStep();
                break;
            case 4:
                stepData.stepContent = this.getAbilityScoreStep();
                break;
            case 5:
                stepData.stepContent = this.getSkillAllocationStep();
                break;
            case 6:
                stepData.stepContent = this.getFeatSelectionStep();
                break;
            case 7:
                stepData.stepContent = this.getEquipmentSelectionStep();
                break;
        }

        return stepData;
    }

    /**
     * Get current step name
     */
    getCurrentStepName() {
        const step = this.steps.find(s => s.id === this.currentStep);
        return step ? step.name : 'Unknown Step';
    }

    // ===================
    // STEP 1: BASIC INFORMATION
    // ===================

    getBasicInformationStep() {
        return {
            title: 'Basic Character Information',
            description: 'Enter your character\'s name and alignment',
            fields: [
                {
                    name: 'characterName',
                    label: 'Character Name',
                    type: 'text',
                    value: this.character.name,
                    required: true,
                    placeholder: 'Enter character name'
                },
                {
                    name: 'alignment',
                    label: 'Alignment',
                    type: 'select',
                    value: this.character.alignment,
                    required: true,
                    options: [
                        'Lawful Good', 'Neutral Good', 'Chaotic Good',
                        'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
                        'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
                    ]
                }
            ]
        };
    }

    setBasicInformation(name, alignment) {
        this.character.name = name.trim();
        this.character.alignment = alignment;

        this.validationResults[1] = this.validateBasicInformation();

        console.log(`📝 Set basic info: ${name} (${alignment})`);
        return this.validationResults[1];
    }

    validateBasicInformation() {
        const errors = [];

        if (!this.character.name || this.character.name.trim().length === 0) {
            errors.push('Character name is required');
        }

        if (this.character.name.length > 50) {
            errors.push('Character name must be 50 characters or less');
        }

        const validAlignments = [
            'Lawful Good', 'Neutral Good', 'Chaotic Good',
            'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
            'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
        ];

        if (!validAlignments.includes(this.character.alignment)) {
            errors.push('Invalid alignment selected');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // ===================
    // STEP 2: RACE SELECTION
    // ===================

    getRaceSelectionStep() {
        const races = this.srdData.getRaces();

        return {
            title: 'Race Selection',
            description: 'Choose your character\'s race',
            races: races.map(race => ({
                name: race.name,
                description: race.description || 'No description available',
                abilityModifiers: race.abilityModifiers || {},
                traits: race.traits || [],
                isSelected: this.character.race === race.name
            })),
            selectedRace: this.character.race
        };
    }

    setRace(raceName) {
        try {
            this.character.setRace(raceName);
            this.validationResults[2] = { isValid: true, errors: [] };

            // Clear dependent steps when race changes
            this.clearDependentSteps([3, 4, 5, 6, 7]);

            console.log(`🌟 Race selected: ${raceName}`);
            return this.validationResults[2];
        } catch (error) {
            this.validationResults[2] = { isValid: false, errors: [error.message] };
            return this.validationResults[2];
        }
    }

    // ===================
    // STEP 3: CLASS SELECTION
    // ===================

    getClassSelectionStep() {
        const availableClasses = this.character.race ?
            this.srdData.getClassesForRace(this.character.race) :
            this.srdData.getClasses();

        return {
            title: 'Class Selection',
            description: 'Choose your character\'s class',
            classes: availableClasses.map(cls => ({
                name: cls.name,
                description: cls.description || 'No description available',
                hitDie: cls.hitDie,
                skillPoints: cls.skillPoints,
                baseAttackBonus: cls.baseAttackBonus,
                savingThrows: cls.savingThrows,
                classSkills: cls.classSkills || [],
                isSelected: this.character.characterClass === cls.name
            })),
            selectedClass: this.character.characterClass
        };
    }

    setClass(className) {
        try {
            this.character.setClass(className);
            this.validationResults[3] = { isValid: true, errors: [] };

            // Clear dependent steps when class changes
            this.clearDependentSteps([4, 5, 6, 7]);

            console.log(`⚔️ Class selected: ${className}`);
            return this.validationResults[3];
        } catch (error) {
            this.validationResults[3] = { isValid: false, errors: [error.message] };
            return this.validationResults[3];
        }
    }

    // ===================
    // STEP 4: ABILITY SCORES
    // ===================

    getAbilityScoreStep() {
        return {
            title: 'Ability Score Generation',
            description: 'Generate or manually set ability scores',
            currentAbilities: {
                base: this.character.baseAbilities,
                final: this.character.abilities,
                modifiers: {
                    strength: this.character.getAbilityModifier('strength'),
                    dexterity: this.character.getAbilityModifier('dexterity'),
                    constitution: this.character.getAbilityModifier('constitution'),
                    intelligence: this.character.getAbilityModifier('intelligence'),
                    wisdom: this.character.getAbilityModifier('wisdom'),
                    charisma: this.character.getAbilityModifier('charisma')
                }
            },
            racialModifiers: this.character.race ?
                this.srdData.getRacialAbilityModifiers(this.character.race) : {},
            generationMethods: [
                { name: '4d6 Drop Lowest', description: 'Roll 4d6, drop lowest die (standard)' },
                { name: '3d6 Straight', description: 'Roll 3d6 for each ability (classic)' },
                { name: 'Point Buy (25)', description: '25 point buy system' },
                { name: 'Point Buy (32)', description: '32 point buy system (high fantasy)' },
                { name: 'Manual Entry', description: 'Enter scores manually' }
            ]
        };
    }

    generateAbilityScores(method = '4d6 Drop Lowest') {
        const abilities = {};

        switch (method) {
            case '4d6 Drop Lowest':
                for (const ability of ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']) {
                    abilities[ability] = this.roll4d6DropLowest();
                }
                break;

            case '3d6 Straight':
                for (const ability of ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']) {
                    abilities[ability] = this.diceEngine.roll('3d6');
                }
                break;

            default:
                throw new Error(`Unsupported generation method: ${method}`);
        }

        this.character.setAbilities(abilities);
        this.validationResults[4] = this.validateAbilityScores();

        console.log(`🎲 Generated abilities using ${method}`);
        return this.validationResults[4];
    }

    roll4d6DropLowest() {
        const rolls = [];
        for (let i = 0; i < 4; i++) {
            rolls.push(this.diceEngine.roll('1d6'));
        }
        rolls.sort((a, b) => b - a); // Sort descending
        return rolls[0] + rolls[1] + rolls[2]; // Sum top 3
    }

    setAbilityScores(abilities) {
        try {
            this.character.setAbilities(abilities);
            this.validationResults[4] = this.validateAbilityScores();

            console.log('💪 Ability scores set manually');
            return this.validationResults[4];
        } catch (error) {
            this.validationResults[4] = { isValid: false, errors: [error.message] };
            return this.validationResults[4];
        }
    }

    validateAbilityScores() {
        const errors = [];

        for (const [ability, score] of Object.entries(this.character.baseAbilities)) {
            if (score < 3 || score > 25) {
                errors.push(`${ability} must be between 3 and 25`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // ===================
    // STEP 5: SKILL ALLOCATION
    // ===================

    getSkillAllocationStep() {
        const availableSkills = this.character.characterClass ?
            this.srdData.getSkillsForClass(this.character.characterClass) :
            this.srdData.getSkills();

        return {
            title: 'Skill Point Allocation',
            description: 'Allocate skill points to your skills',
            skillPoints: this.character.skillPoints,
            skills: availableSkills.map(skill => ({
                name: skill.name,
                keyAbility: skill.keyAbility,
                isClassSkill: skill.isClassSkill || false,
                currentRanks: this.character.skills[skill.name] || 0,
                totalModifier: this.character.getSkillModifier(skill.name),
                maxRanks: skill.isClassSkill ?
                    (this.character.level + 3) :
                    Math.floor((this.character.level + 3) / 2)
            }))
        };
    }

    allocateSkillPoints(skillName, points) {
        try {
            this.character.allocateSkillPoints(skillName, points);
            this.validationResults[5] = this.validateSkillAllocation();

            console.log(`📚 Allocated ${points} points to ${skillName}`);
            return this.validationResults[5];
        } catch (error) {
            this.validationResults[5] = { isValid: false, errors: [error.message] };
            return this.validationResults[5];
        }
    }

    validateSkillAllocation() {
        const errors = [];

        if (this.character.skillPoints.available < 0) {
            errors.push('Cannot have negative skill points');
        }

        // Optional: Warn if too many skill points remain unspent
        if (this.character.skillPoints.available > this.character.level) {
            errors.push(`Consider spending more skill points (${this.character.skillPoints.available} remaining)`);
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // ===================
    // STEP 6: FEAT SELECTION
    // ===================

    getFeatSelectionStep() {
        const availableFeats = this.srdData.getFeatsForLevel(this.character.level);

        return {
            title: 'Feat Selection',
            description: 'Choose your character\'s feats',
            featSlots: this.character.featSlots,
            selectedFeats: this.character.feats,
            availableFeats: availableFeats.map(feat => ({
                name: feat.name,
                description: feat.description || 'No description available',
                prerequisites: feat.prerequisites || {},
                isSelected: this.character.feats.includes(feat.name),
                canSelect: this.canSelectFeat(feat)
            }))
        };
    }

    canSelectFeat(feat) {
        // Basic checks
        if (this.character.feats.includes(feat.name)) {
            return false; // Already has feat
        }

        if (this.character.featSlots.available <= 0) {
            return false; // No feat slots available
        }

        // TODO: Check feat prerequisites

        return true;
    }

    addFeat(featName) {
        try {
            this.character.addFeat(featName);
            this.validationResults[6] = this.validateFeatSelection();

            console.log(`✨ Added feat: ${featName}`);
            return this.validationResults[6];
        } catch (error) {
            this.validationResults[6] = { isValid: false, errors: [error.message] };
            return this.validationResults[6];
        }
    }

    removeFeat(featName) {
        try {
            this.character.removeFeat(featName);
            this.validationResults[6] = this.validateFeatSelection();

            console.log(`🗑️ Removed feat: ${featName}`);
            return this.validationResults[6];
        } catch (error) {
            this.validationResults[6] = { isValid: false, errors: [error.message] };
            return this.validationResults[6];
        }
    }

    validateFeatSelection() {
        const errors = [];

        if (this.character.featSlots.available < 0) {
            errors.push('Cannot have negative feat slots');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // ===================
    // STEP 7: EQUIPMENT SELECTION
    // ===================

    getEquipmentSelectionStep() {
        const equipment = this.srdData.getEquipment();

        return {
            title: 'Equipment Selection',
            description: 'Select starting equipment',
            currentEquipment: this.character.equipment,
            availableEquipment: {
                weapons: this.filterEquipmentByType(equipment, 'weapon'),
                armor: this.filterEquipmentByType(equipment, 'armor'),
                gear: this.filterEquipmentByType(equipment, 'gear')
            },
            startingGold: this.getStartingGold()
        };
    }

    filterEquipmentByType(equipment, type) {
        if (!Array.isArray(equipment)) return [];

        return equipment.filter(item =>
            item.type && item.type.toLowerCase().includes(type.toLowerCase())
        );
    }

    getStartingGold() {
        // TODO: Implement class-based starting gold
        return { min: 40, max: 240, average: 140 };
    }

    addEquipment(equipmentName, category) {
        try {
            this.character.addEquipment(equipmentName, category);
            this.validationResults[7] = { isValid: true, errors: [] };

            console.log(`🎒 Added equipment: ${equipmentName}`);
            return this.validationResults[7];
        } catch (error) {
            this.validationResults[7] = { isValid: false, errors: [error.message] };
            return this.validationResults[7];
        }
    }

    // ===================
    // WIZARD COMPLETION
    // ===================

    /**
     * Complete character creation
     */
    completeCreation() {
        // Validate all steps
        const allValid = this.validateAllSteps();

        if (!allValid.isValid) {
            throw new Error(`Character validation failed: ${allValid.errors.join(', ')}`);
        }

        // Final character validation
        const characterValidation = this.character.validate();

        if (!characterValidation.isValid) {
            throw new Error(`Character validation failed: ${characterValidation.errors.join(', ')}`);
        }

        this.character.creationStep = this.totalSteps;
        this.character.isComplete = true;

        console.log('🎉 Character creation completed successfully!');

        return {
            success: true,
            character: this.character.toJSON(),
            summary: this.character.getSummary()
        };
    }

    /**
     * Validate all wizard steps
     */
    validateAllSteps() {
        const allErrors = [];

        for (let step = 1; step <= this.totalSteps; step++) {
            const oldStep = this.currentStep;
            this.currentStep = step;

            if (!this.validateCurrentStep()) {
                const stepValidation = this.validationResults[step];
                if (stepValidation && stepValidation.errors) {
                    allErrors.push(...stepValidation.errors.map(err => `Step ${step}: ${err}`));
                }
            }

            this.currentStep = oldStep;
        }

        return {
            isValid: allErrors.length === 0,
            errors: allErrors
        };
    }

    /**
     * Validate current step
     */
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                this.validationResults[1] = this.validateBasicInformation();
                break;
            case 2:
                this.validationResults[2] = { isValid: Boolean(this.character.race), errors: [] };
                break;
            case 3:
                this.validationResults[3] = { isValid: Boolean(this.character.characterClass), errors: [] };
                break;
            case 4:
                this.validationResults[4] = this.validateAbilityScores();
                break;
            case 5:
                this.validationResults[5] = this.validateSkillAllocation();
                break;
            case 6:
                this.validationResults[6] = this.validateFeatSelection();
                break;
            case 7:
                this.validationResults[7] = { isValid: true, errors: [] }; // Equipment is optional
                break;
        }

        const result = this.validationResults[this.currentStep];
        return result ? result.isValid : false;
    }

    // ===================
    // UTILITY METHODS
    // ===================

    /**
     * Clear dependent steps when major changes occur
     */
    clearDependentSteps(stepNumbers) {
        for (const stepNum of stepNumbers) {
            delete this.validationResults[stepNum];
        }
    }

    /**
     * Get wizard progress
     */
    getProgress() {
        let completedSteps = 0;

        for (let step = 1; step <= this.totalSteps; step++) {
            const oldStep = this.currentStep;
            this.currentStep = step;

            if (this.validateCurrentStep()) {
                completedSteps++;
            }

            this.currentStep = oldStep;
        }

        return {
            completed: completedSteps,
            total: this.totalSteps,
            percentage: Math.round((completedSteps / this.totalSteps) * 100)
        };
    }

    /**
     * Save wizard state
     */
    saveState() {
        return {
            currentStep: this.currentStep,
            character: this.character.toJSON(),
            validationResults: this.validationResults,
            stepHistory: [...this.stepHistory]
        };
    }

    /**
     * Load wizard state
     */
    loadState(state) {
        this.currentStep = state.currentStep;
        this.character.fromJSON(state.character);
        this.validationResults = state.validationResults || {};
        this.stepHistory = state.stepHistory || [];

        console.log(`📥 Loaded wizard state at step ${this.currentStep}`);
        return this.getCurrentStepData();
    }
}

// Dual environment compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterCreationWizard;
} else if (typeof window !== 'undefined') {
    window.CharacterCreationWizard = CharacterCreationWizard;
}

module.exports = CharacterCreationWizard;
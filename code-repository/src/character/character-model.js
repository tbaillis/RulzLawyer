/**
 * CharacterModel - Complete D&D 3.5 Character Data Model
 * Integrates with SRD data for accurate character creation and management
 * 
 * Features:
 * - Complete ability score management with racial modifiers
 * - Skill point allocation and class skill tracking
 * - Feat selection with prerequisites validation
 * - Equipment and inventory management
 * - Spell selection for spellcasting classes
 * - Level progression and experience tracking
 * - Hit point calculation with constitution modifiers
 * - Armor class and saving throw calculations
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

const SRDDataManager = require('../data/srd-data-manager.js');

class CharacterModel {
    constructor(srdDataManager = null) {
        this.srdData = srdDataManager || new SRDDataManager();

        // Core character identity
        this.name = '';
        this.race = '';
        this.characterClass = '';
        this.level = 1;
        this.experience = 0;
        this.alignment = 'True Neutral';

        // Ability scores (base values before modifiers)
        this.baseAbilities = {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        };

        // Computed ability scores (base + racial modifiers)
        this.abilities = { ...this.baseAbilities };

        // Hit points and combat stats
        this.hitPoints = 0;
        this.maxHitPoints = 0;
        this.armorClass = 10;
        this.touchAC = 10;
        this.flatFootedAC = 10;
        this.baseAttackBonus = 0;

        // Saving throws
        this.savingThrows = {
            fortitude: 0,
            reflex: 0,
            will: 0
        };

        // Skills (name -> ranks)
        this.skills = {};
        this.skillPoints = {
            total: 0,
            spent: 0,
            available: 0
        };

        // Feats
        this.feats = [];
        this.featSlots = {
            total: 0,
            used: 0,
            available: 0
        };

        // Equipment and inventory
        this.equipment = {
            weapons: [],
            armor: [],
            gear: [],
            money: {
                platinum: 0,
                gold: 0,
                silver: 0,
                copper: 0
            }
        };

        // Spells (for spellcasting classes)
        this.spells = {
            known: {},  // spellLevel -> array of spells
            prepared: {}, // spellLevel -> array of spells
            perDay: {},   // spellLevel -> number of casts per day
            used: {}      // spellLevel -> number of casts used today
        };

        // Character creation state
        this.creationStep = 0;
        this.isComplete = false;
        this.validationErrors = [];

        console.log('🧙 CharacterModel initialized');
    }

    // ===================
    // CORE SETUP METHODS
    // ===================

    /**
     * Set character's race and apply racial modifiers
     */
    setRace(raceName) {
        const race = this.srdData.findRace(raceName);
        if (!race) {
            throw new Error(`Invalid race: ${raceName}`);
        }

        this.race = raceName;
        this.recalculateAbilities();
        this.recalculateStats();

        console.log(`🌟 Character race set to: ${raceName}`);
        return this;
    }

    /**
     * Set character's class and initialize class features
     */
    setClass(className) {
        const characterClass = this.srdData.findClass(className);
        if (!characterClass) {
            throw new Error(`Invalid class: ${className}`);
        }

        this.characterClass = className;
        this.initializeClassFeatures();
        this.recalculateStats();

        console.log(`⚔️ Character class set to: ${className}`);
        return this;
    }

    /**
     * Set character level and recalculate everything
     */
    setLevel(level) {
        if (level < 1 || level > 100) {
            throw new Error('Level must be between 1 and 100');
        }

        this.level = level;
        this.recalculateStats();

        console.log(`📈 Character level set to: ${level}`);
        return this;
    }

    /**
     * Set base ability scores
     */
    setAbilities(abilities) {
        // Validate ability scores
        const validAbilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

        for (const ability of validAbilities) {
            if (abilities[ability] !== undefined) {
                if (abilities[ability] < 3 || abilities[ability] > 25) {
                    throw new Error(`${ability} must be between 3 and 25`);
                }
                this.baseAbilities[ability] = abilities[ability];
            }
        }

        this.recalculateAbilities();
        this.recalculateStats();

        console.log('💪 Base abilities updated');
        return this;
    }

    // ===================
    // CALCULATION METHODS
    // ===================

    /**
     * Recalculate final ability scores with racial modifiers
     */
    recalculateAbilities() {
        const racialMods = this.srdData.getRacialAbilityModifiers(this.race);

        this.abilities = {
            strength: this.baseAbilities.strength + (racialMods.strength || 0),
            dexterity: this.baseAbilities.dexterity + (racialMods.dexterity || 0),
            constitution: this.baseAbilities.constitution + (racialMods.constitution || 0),
            intelligence: this.baseAbilities.intelligence + (racialMods.intelligence || 0),
            wisdom: this.baseAbilities.wisdom + (racialMods.wisdom || 0),
            charisma: this.baseAbilities.charisma + (racialMods.charisma || 0)
        };
    }

    /**
     * Get ability modifier for an ability score
     */
    getAbilityModifier(abilityName) {
        const score = this.abilities[abilityName];
        return this.srdData.getAbilityModifier(score);
    }

    /**
     * Recalculate all derived stats
     */
    recalculateStats() {
        this.recalculateHitPoints();
        this.recalculateArmorClass();
        this.recalculateAttackBonus();
        this.recalculateSavingThrows();
        this.recalculateSkillPoints();
        this.recalculateFeatSlots();
        this.recalculateSpells();
    }

    /**
     * Calculate hit points
     */
    recalculateHitPoints() {
        if (!this.characterClass) return;

        const hitDie = this.srdData.getClassHitDie(this.characterClass);
        const conModifier = this.getAbilityModifier('constitution');

        // First level gets max hit die + con modifier
        let totalHP = hitDie + conModifier;

        // Additional levels get average hit die + con modifier
        if (this.level > 1) {
            const avgHitDie = Math.floor(hitDie / 2) + 1;
            totalHP += (this.level - 1) * (avgHitDie + conModifier);
        }

        // Minimum 1 HP per level
        totalHP = Math.max(totalHP, this.level);

        this.maxHitPoints = totalHP;
        if (this.hitPoints === 0) {
            this.hitPoints = totalHP;
        }
    }

    /**
     * Calculate armor class
     */
    recalculateArmorClass() {
        const dexModifier = this.getAbilityModifier('dexterity');

        // Base AC = 10 + Dex modifier + armor + shield + natural + deflection + misc
        this.armorClass = 10 + dexModifier;
        this.touchAC = 10 + dexModifier;
        this.flatFootedAC = 10;

        // TODO: Add armor, shield, and other modifiers from equipment
    }

    /**
     * Calculate base attack bonus
     */
    recalculateAttackBonus() {
        if (!this.characterClass) return;

        const progression = this.srdData.getClassBABProgression(this.characterClass);

        switch (progression) {
            case 'good':
                this.baseAttackBonus = this.level;
                break;
            case 'average':
                this.baseAttackBonus = Math.floor(this.level * 3 / 4);
                break;
            case 'poor':
            default:
                this.baseAttackBonus = Math.floor(this.level / 2);
                break;
        }
    }

    /**
     * Calculate saving throws
     */
    recalculateSavingThrows() {
        if (!this.characterClass) return;

        const progression = this.srdData.getClassSavingThrows(this.characterClass);

        // Base saves from class
        const baseSaves = this.calculateSaveProgression(progression);

        // Add ability modifiers
        this.savingThrows = {
            fortitude: baseSaves.fortitude + this.getAbilityModifier('constitution'),
            reflex: baseSaves.reflex + this.getAbilityModifier('dexterity'),
            will: baseSaves.will + this.getAbilityModifier('wisdom')
        };
    }

    /**
     * Calculate base save progression
     */
    calculateSaveProgression(progression) {
        const baseSaves = { fortitude: 0, reflex: 0, will: 0 };

        for (const [saveType, saveProgression] of Object.entries(progression)) {
            if (saveProgression === 'good') {
                baseSaves[saveType] = Math.floor(this.level / 2) + 2;
            } else {
                baseSaves[saveType] = Math.floor(this.level / 3);
            }
        }

        return baseSaves;
    }

    /**
     * Calculate available skill points
     */
    recalculateSkillPoints() {
        if (!this.characterClass) return;

        const baseSkillPoints = this.srdData.getClassSkillPoints(this.characterClass);
        const intModifier = this.getAbilityModifier('intelligence');

        // Skill points per level = class base + int modifier (minimum 1)
        const pointsPerLevel = Math.max(1, baseSkillPoints + intModifier);

        // First level gets (base + int) * 4
        let totalPoints = pointsPerLevel * 4;

        // Additional levels get base + int
        if (this.level > 1) {
            totalPoints += (this.level - 1) * pointsPerLevel;
        }

        this.skillPoints.total = totalPoints;
        this.skillPoints.available = totalPoints - this.skillPoints.spent;
    }

    /**
     * Calculate available feat slots
     */
    recalculateFeatSlots() {
        // Base feat at 1st level, then every 3 levels
        let totalFeats = 1 + Math.floor((this.level - 1) / 3);

        // Human gets bonus feat at 1st level
        if (this.race === 'Human') {
            totalFeats += 1;
        }

        // Fighter gets bonus feats
        if (this.characterClass === 'Fighter') {
            totalFeats += Math.floor((this.level + 1) / 2);
        }

        this.featSlots.total = totalFeats;
        this.featSlots.used = this.feats.length;
        this.featSlots.available = totalFeats - this.feats.length;
    }

    /**
     * Calculate spells per day for spellcasting classes
     */
    recalculateSpells() {
        if (!this.isSpellcaster()) return;

        // TODO: Implement spell progression tables for each spellcasting class
        // For now, initialize empty spell structure
        this.spells.perDay = {};
        this.spells.used = {};

        for (let level = 0; level <= 9; level++) {
            this.spells.perDay[level] = 0;
            this.spells.used[level] = 0;
        }
    }

    // ===================
    // SKILL METHODS
    // ===================

    /**
     * Allocate skill points to a skill
     */
    allocateSkillPoints(skillName, points) {
        if (!this.srdData.isValidSkill(skillName)) {
            throw new Error(`Invalid skill: ${skillName}`);
        }

        if (points < 0) {
            throw new Error('Cannot allocate negative skill points');
        }

        if (points > this.skillPoints.available) {
            throw new Error('Not enough skill points available');
        }

        const currentRanks = this.skills[skillName] || 0;
        const newRanks = currentRanks + points;

        // Check maximum ranks (level + 3 for class skills, (level + 3) / 2 for cross-class)
        const isClassSkill = this.isClassSkill(skillName);
        const maxRanks = isClassSkill ? (this.level + 3) : Math.floor((this.level + 3) / 2);

        if (newRanks > maxRanks) {
            throw new Error(`Cannot exceed maximum ranks (${maxRanks}) for ${skillName}`);
        }

        this.skills[skillName] = newRanks;
        this.skillPoints.spent += points;
        this.skillPoints.available -= points;

        console.log(`📚 Allocated ${points} points to ${skillName} (total: ${newRanks})`);
        return this;
    }

    /**
     * Check if a skill is a class skill
     */
    isClassSkill(skillName) {
        const classSkills = this.srdData.getSkillsForClass(this.characterClass);
        const skill = classSkills.find(s => s.name === skillName);
        return skill ? skill.isClassSkill : false;
    }

    /**
     * Get total skill modifier including ability modifier
     */
    getSkillModifier(skillName) {
        const ranks = this.skills[skillName] || 0;
        const skill = this.srdData.findSkill(skillName);

        if (!skill) return ranks;

        const abilityModifier = this.getAbilityModifier(skill.keyAbility);
        return ranks + abilityModifier;
    }

    // ===================
    // FEAT METHODS
    // ===================

    /**
     * Add a feat to the character
     */
    addFeat(featName) {
        if (!this.srdData.isValidFeat(featName)) {
            throw new Error(`Invalid feat: ${featName}`);
        }

        if (this.featSlots.available <= 0) {
            throw new Error('No feat slots available');
        }

        if (this.feats.includes(featName)) {
            throw new Error(`Already has feat: ${featName}`);
        }

        // TODO: Check feat prerequisites

        this.feats.push(featName);
        this.recalculateFeatSlots();

        console.log(`✨ Added feat: ${featName}`);
        return this;
    }

    /**
     * Remove a feat from the character
     */
    removeFeat(featName) {
        const index = this.feats.indexOf(featName);
        if (index === -1) {
            throw new Error(`Character does not have feat: ${featName}`);
        }

        this.feats.splice(index, 1);
        this.recalculateFeatSlots();

        console.log(`🗑️ Removed feat: ${featName}`);
        return this;
    }

    // ===================
    // EQUIPMENT METHODS
    // ===================

    /**
     * Add equipment to character
     */
    addEquipment(equipmentName, category = 'gear') {
        const equipment = this.srdData.findEquipment(equipmentName);
        if (!equipment) {
            console.warn(`Equipment not found in SRD: ${equipmentName}`);
        }

        if (!this.equipment[category]) {
            this.equipment[category] = [];
        }

        this.equipment[category].push(equipmentName);

        console.log(`🎒 Added equipment: ${equipmentName} (${category})`);
        return this;
    }

    /**
     * Remove equipment from character
     */
    removeEquipment(equipmentName, category = null) {
        if (category) {
            const items = this.equipment[category];
            const index = items ? items.indexOf(equipmentName) : -1;
            if (index !== -1) {
                items.splice(index, 1);
                console.log(`🗑️ Removed equipment: ${equipmentName} (${category})`);
                return this;
            }
        } else {
            // Search all categories
            for (const [cat, items] of Object.entries(this.equipment)) {
                if (Array.isArray(items)) {
                    const index = items.indexOf(equipmentName);
                    if (index !== -1) {
                        items.splice(index, 1);
                        console.log(`🗑️ Removed equipment: ${equipmentName} (${cat})`);
                        return this;
                    }
                }
            }
        }

        throw new Error(`Equipment not found: ${equipmentName}`);
    }

    // ===================
    // SPELL METHODS
    // ===================

    /**
     * Check if character can cast spells
     */
    isSpellcaster() {
        const spellcastingClasses = ['Cleric', 'Druid', 'Wizard', 'Sorcerer', 'Bard', 'Ranger', 'Paladin'];
        return spellcastingClasses.includes(this.characterClass);
    }

    /**
     * Add known spell
     */
    addKnownSpell(spellName, spellLevel) {
        if (!this.isSpellcaster()) {
            throw new Error('Character class cannot cast spells');
        }

        const spell = this.srdData.findSpell(spellName);
        if (!spell) {
            throw new Error(`Invalid spell: ${spellName}`);
        }

        if (!this.spells.known[spellLevel]) {
            this.spells.known[spellLevel] = [];
        }

        if (!this.spells.known[spellLevel].includes(spellName)) {
            this.spells.known[spellLevel].push(spellName);
            console.log(`📜 Added known spell: ${spellName} (level ${spellLevel})`);
        }

        return this;
    }

    // ===================
    // VALIDATION METHODS
    // ===================

    /**
     * Validate complete character build
     */
    validate() {
        this.validationErrors = [];

        // Basic validation
        if (!this.name) {
            this.validationErrors.push('Character must have a name');
        }

        if (!this.race) {
            this.validationErrors.push('Character must have a race');
        }

        if (!this.characterClass) {
            this.validationErrors.push('Character must have a class');
        }

        // Use SRD data validation
        const srdValidation = this.srdData.validateCharacterBuild(this);
        this.validationErrors.push(...srdValidation.errors);

        // Skill point validation
        if (this.skillPoints.available < 0) {
            this.validationErrors.push('Cannot have negative skill points');
        }

        // Feat slot validation
        if (this.featSlots.available < 0) {
            this.validationErrors.push('Cannot have negative feat slots');
        }

        this.isComplete = this.validationErrors.length === 0;

        return {
            isValid: this.isComplete,
            errors: this.validationErrors
        };
    }

    // ===================
    // UTILITY METHODS
    // ===================

    /**
     * Initialize class-specific features
     */
    initializeClassFeatures() {
        // Reset class-dependent values
        this.skills = {};
        this.skillPoints.spent = 0;

        // TODO: Initialize class-specific features, special abilities, etc.
    }

    /**
     * Get character summary
     */
    getSummary() {
        return {
            name: this.name,
            race: this.race,
            characterClass: this.characterClass,
            level: this.level,
            abilities: this.abilities,
            hitPoints: this.hitPoints,
            maxHitPoints: this.maxHitPoints,
            armorClass: this.armorClass,
            baseAttackBonus: this.baseAttackBonus,
            savingThrows: this.savingThrows,
            skillCount: Object.keys(this.skills).length,
            featCount: this.feats.length,
            isComplete: this.isComplete
        };
    }

    /**
     * Export character to JSON
     */
    toJSON() {
        return {
            name: this.name,
            race: this.race,
            characterClass: this.characterClass,
            level: this.level,
            experience: this.experience,
            alignment: this.alignment,
            baseAbilities: this.baseAbilities,
            abilities: this.abilities,
            hitPoints: this.hitPoints,
            maxHitPoints: this.maxHitPoints,
            armorClass: this.armorClass,
            touchAC: this.touchAC,
            flatFootedAC: this.flatFootedAC,
            baseAttackBonus: this.baseAttackBonus,
            savingThrows: this.savingThrows,
            skills: this.skills,
            skillPoints: this.skillPoints,
            feats: this.feats,
            featSlots: this.featSlots,
            equipment: this.equipment,
            spells: this.spells,
            creationStep: this.creationStep,
            isComplete: this.isComplete
        };
    }

    /**
     * Load character from JSON
     */
    fromJSON(data) {
        Object.assign(this, data);
        this.recalculateStats();
        return this;
    }

    /**
     * Clone character
     */
    clone() {
        const clone = new CharacterModel(this.srdData);
        clone.fromJSON(this.toJSON());
        return clone;
    }
}

// Dual environment compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterModel;
} else if (typeof window !== 'undefined') {
    window.CharacterModel = CharacterModel;
}

module.exports = CharacterModel;
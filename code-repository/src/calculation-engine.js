/**
 * D&D 3.5 Character Calculation Engine
 * Based on Excel formulas from Rackem19.xlsm character sheet
 * Implements complete D&D 3.5 rule calculations for real-time character updates
 */

class DnDCalculationEngine {
    constructor() {
        this.raceData = null;
        this.classData = null;
        this.featData = null;
        this.spellData = null;
        this.equipmentData = null;
        this.skillData = null;

        // Cache for calculated values
        this.cache = {
            abilityModifiers: {},
            savingThrows: {},
            attackBonuses: {},
            skillModifiers: {}
        };
    }

    /**
     * Initialize the calculation engine with game data
     * @param {Object} gameData - Complete D&D 3.5 game data
     */
    initialize(gameData) {
        this.raceData = gameData.races || [];
        this.classData = gameData.classes || [];
        this.featData = gameData.feats || [];
        this.spellData = gameData.spells || [];
        this.equipmentData = gameData.equipment || {};
        this.skillData = gameData.skills || [];
    }

    /**
     * Calculate ability score modifier
     * Formula: (Score - 10) / 2 (rounded down)
     * @param {number} abilityScore - Raw ability score
     * @returns {number} Ability modifier
     */
    calculateAbilityModifier(abilityScore) {
        if (typeof abilityScore !== 'number' || abilityScore < 1) {
            return 0;
        }
        return Math.floor((abilityScore - 10) / 2);
    }

    /**
     * Calculate all ability modifiers for a character
     * @param {Object} abilities - Character's ability scores
     * @returns {Object} All ability modifiers
     */
    calculateAllAbilityModifiers(abilities) {
        const modifiers = {};
        const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

        for (const ability of abilityNames) {
            modifiers[ability] = this.calculateAbilityModifier(abilities[ability] || 10);
        }

        this.cache.abilityModifiers = modifiers;
        return modifiers;
    }

    /**
     * Apply racial ability adjustments
     * @param {Object} baseAbilities - Base rolled ability scores
     * @param {string} raceName - Character's race
     * @returns {Object} Adjusted ability scores
     */
    applyRacialAbilityAdjustments(baseAbilities, raceName) {
        const race = this.raceData.find(r => r.name === raceName);
        if (!race || !race.ability_adjustments) {
            return { ...baseAbilities };
        }

        const adjustedAbilities = { ...baseAbilities };

        for (const [ability, adjustment] of Object.entries(race.ability_adjustments)) {
            if (adjustedAbilities[ability]) {
                adjustedAbilities[ability] += adjustment;
            }
        }

        return adjustedAbilities;
    }

    /**
     * Calculate base attack bonus for multiclass character
     * @param {Array} classes - Array of {className, level} objects
     * @returns {number} Total base attack bonus
     */
    calculateBaseAttackBonus(classes) {
        let totalBAB = 0;

        for (const classLevel of classes) {
            const classData = this.classData.find(c => c.name === classLevel.className);
            if (!classData) continue;

            const level = classLevel.level;
            let classBAB = 0;

            switch (classData.base_attack_bonus_progression) {
                case 'Good':
                    classBAB = level;
                    break;
                case 'Medium':
                    classBAB = Math.floor(level * 0.75);
                    break;
                case 'Poor':
                    classBAB = Math.floor(level * 0.5);
                    break;
            }

            totalBAB += classBAB;
        }

        return totalBAB;
    }

    /**
     * Calculate saving throw bonuses
     * @param {Array} classes - Character's classes and levels
     * @param {Object} abilityModifiers - Character's ability modifiers
     * @returns {Object} Saving throw bonuses
     */
    calculateSavingThrows(classes, abilityModifiers) {
        const saves = { fortitude: 0, reflex: 0, will: 0 };
        const saveProgression = {
            'Good': [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12],
            'Poor': [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6]
        };

        for (const classLevel of classes) {
            const classData = this.classData.find(c => c.name === classLevel.className);
            if (!classData) continue;

            const level = classLevel.level;
            const levelIndex = Math.min(level - 1, 19);

            // Fortitude save (Constitution modifier)
            const fortProgression = classData.fort_save_progression === 'Good' ? saveProgression.Good : saveProgression.Poor;
            saves.fortitude += fortProgression[levelIndex];

            // Reflex save (Dexterity modifier)
            const refProgression = classData.ref_save_progression === 'Good' ? saveProgression.Good : saveProgression.Poor;
            saves.reflex += refProgression[levelIndex];

            // Will save (Wisdom modifier)
            const willProgression = classData.will_save_progression === 'Good' ? saveProgression.Good : saveProgression.Poor;
            saves.will += willProgression[levelIndex];
        }

        // Add ability modifiers
        saves.fortitude += abilityModifiers.constitution || 0;
        saves.reflex += abilityModifiers.dexterity || 0;
        saves.will += abilityModifiers.wisdom || 0;

        this.cache.savingThrows = saves;
        return saves;
    }

    /**
     * Calculate armor class
     * @param {Object} character - Complete character object
     * @returns {Object} AC breakdown
     */
    calculateArmorClass(character) {
        let ac = {
            base: 10,
            armor: 0,
            shield: 0,
            dexterity: 0,
            size: 0,
            natural: 0,
            deflection: 0,
            misc: 0,
            total: 10,
            touch: 10,
            flatFooted: 10
        };

        // Dexterity modifier to AC
        const dexMod = this.calculateAbilityModifier(character.abilities?.dexterity || 10);
        ac.dexterity = dexMod;

        // Size modifier
        const race = this.raceData.find(r => r.name === character.race);
        if (race?.size === 'Small') {
            ac.size = 1;
        } else if (race?.size === 'Large') {
            ac.size = -1;
        }

        // Equipment bonuses (if equipment is equipped)
        if (character.equipment) {
            for (const item of character.equipment) {
                if (item.equipped && item.type === 'armor') {
                    ac.armor = Math.max(ac.armor, item.armor_bonus || 0);
                    // Apply max dex bonus limitation
                    if (item.max_dex_bonus !== undefined) {
                        ac.dexterity = Math.min(ac.dexterity, item.max_dex_bonus);
                    }
                }
                if (item.equipped && item.category === 'Shield') {
                    ac.shield += item.armor_bonus || 0;
                }
            }
        }

        // Calculate total AC
        ac.total = ac.base + ac.armor + ac.shield + ac.dexterity + ac.size + ac.natural + ac.deflection + ac.misc;

        // Touch AC (no armor, shield, or natural armor)
        ac.touch = ac.base + ac.dexterity + ac.size + ac.deflection + ac.misc;

        // Flat-footed AC (no dexterity bonus)
        ac.flatFooted = ac.base + ac.armor + ac.shield + ac.size + ac.natural + ac.deflection + ac.misc;

        return ac;
    }

    /**
     * Calculate attack bonuses
     * @param {Object} character - Complete character object
     * @returns {Object} Attack bonus breakdown
     */
    calculateAttackBonuses(character) {
        const baseAttackBonus = this.calculateBaseAttackBonus(character.classes || []);
        const strMod = this.calculateAbilityModifier(character.abilities?.strength || 10);
        const dexMod = this.calculateAbilityModifier(character.abilities?.dexterity || 10);

        // Size modifier
        let sizeModifier = 0;
        const race = this.raceData.find(r => r.name === character.race);
        if (race?.size === 'Small') {
            sizeModifier = 1;
        } else if (race?.size === 'Large') {
            sizeModifier = -1;
        }

        const attacks = {
            melee: {
                base: baseAttackBonus,
                ability: strMod,
                size: sizeModifier,
                misc: 0,
                total: baseAttackBonus + strMod + sizeModifier
            },
            ranged: {
                base: baseAttackBonus,
                ability: dexMod,
                size: sizeModifier,
                misc: 0,
                total: baseAttackBonus + dexMod + sizeModifier
            }
        };

        // Multiple attacks for high BAB
        if (baseAttackBonus >= 6) {
            attacks.melee.iterative = [];
            attacks.ranged.iterative = [];

            for (let bab = baseAttackBonus - 5; bab > 0; bab -= 5) {
                const iterativeBonus = Math.max(1, bab);
                attacks.melee.iterative.push(iterativeBonus + strMod + sizeModifier);
                attacks.ranged.iterative.push(iterativeBonus + dexMod + sizeModifier);
            }
        }

        this.cache.attackBonuses = attacks;
        return attacks;
    }

    /**
     * Calculate skill points per level
     * @param {string} className - Character class
     * @param {number} intModifier - Intelligence modifier
     * @param {string} race - Character race
     * @param {boolean} isFirstLevel - Whether this is first level
     * @returns {number} Skill points gained
     */
    calculateSkillPointsPerLevel(className, intModifier, race, isFirstLevel = false) {
        const classData = this.classData.find(c => c.name === className);
        if (!classData) return 0;

        let skillPoints = classData.skill_points_per_level + intModifier;

        // Minimum 1 skill point per level
        skillPoints = Math.max(1, skillPoints);

        // Humans get +1 skill point per level
        if (race === 'Human') {
            skillPoints += 1;
        }

        // First level gets x4 skill points
        if (isFirstLevel) {
            skillPoints *= 4;
        }

        return skillPoints;
    }

    /**
     * Calculate total hit points
     * @param {Array} classes - Character's classes and levels
     * @param {number} conModifier - Constitution modifier
     * @returns {number} Total hit points
     */
    calculateHitPoints(classes, conModifier) {
        let totalHp = 0;

        for (const classLevel of classes) {
            const classData = this.classData.find(c => c.name === classLevel.className);
            if (!classData) continue;

            const hitDie = parseInt(classData.hit_die.replace('d', ''));
            const level = classLevel.level;

            // First level gets max hit die
            if (level >= 1) {
                totalHp += hitDie; // First level

                // Subsequent levels (assuming average hit die + 1)
                const avgHitDie = Math.floor(hitDie / 2) + 1;
                totalHp += (level - 1) * avgHitDie;
            }

            // Constitution modifier applies to each level
            totalHp += level * conModifier;
        }

        return Math.max(1, totalHp); // Minimum 1 HP
    }

    /**
     * Calculate spell slots for spellcasting classes
     * @param {string} className - Spellcasting class name
     * @param {number} level - Class level
     * @param {number} abilityModifier - Relevant ability modifier (Int, Wis, or Cha)
     * @returns {Array} Spells per day by spell level [0th, 1st, 2nd, ...]
     */
    calculateSpellsPerDay(className, level, abilityModifier) {
        const classData = this.classData.find(c => c.name === className);
        if (!classData || !classData.spellcasting || !classData.spells_per_day) {
            return [];
        }

        const baseSpells = classData.spells_per_day[level.toString()] || [];
        const bonusSpells = this.calculateBonusSpells(abilityModifier);
        const totalSpells = [...baseSpells];

        // Add bonus spells
        for (let spellLevel = 1; spellLevel < Math.min(totalSpells.length, bonusSpells.length); spellLevel++) {
            if (totalSpells[spellLevel] > 0) { // Only if base spells exist for that level
                totalSpells[spellLevel] += bonusSpells[spellLevel] || 0;
            }
        }

        return totalSpells;
    }

    /**
     * Calculate bonus spells from high ability scores
     * @param {number} abilityModifier - Spellcasting ability modifier
     * @returns {Array} Bonus spells by spell level
     */
    calculateBonusSpells(abilityModifier) {
        const bonusSpells = [0]; // No bonus 0-level spells

        for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
            const minAbilityForLevel = 10 + spellLevel;
            const requiredModifier = spellLevel;

            if (abilityModifier >= requiredModifier) {
                // Bonus spells formula: (ability modifier - spell level + 4) / 4
                const bonus = Math.floor((abilityModifier - spellLevel + 4) / 4);
                bonusSpells.push(Math.max(0, bonus));
            } else {
                bonusSpells.push(0);
            }
        }

        return bonusSpells;
    }

    /**
     * Calculate carrying capacity
     * @param {number} strength - Strength score
     * @param {string} size - Character size (Medium, Small, etc.)
     * @returns {Object} Carrying capacity breakdown
     */
    calculateCarryingCapacity(strength, size = 'Medium') {
        // Base carrying capacity for Medium creatures
        let lightLoad, mediumLoad, heavyLoad;

        if (strength <= 10) {
            const baseCapacities = [
                [10, 20, 30], [13, 26, 40], [16, 33, 50], [20, 40, 60], [23, 46, 70],
                [26, 53, 80], [30, 60, 90], [33, 66, 100], [36, 73, 110], [40, 80, 120]
            ];
            const index = Math.max(0, strength - 1);
            [lightLoad, mediumLoad, heavyLoad] = baseCapacities[Math.min(index, 9)];
        } else {
            // For Str 11-20, use base table
            const str10Base = [40, 80, 120]; // Str 10 values
            const multiplier = Math.pow(2, Math.floor((strength - 10) / 10));
            const remainder = (strength - 10) % 10;

            [lightLoad, mediumLoad, heavyLoad] = str10Base.map(base =>
                Math.floor(base * multiplier * (1 + remainder * 0.25))
            );
        }

        // Size adjustments
        const sizeMultipliers = {
            'Fine': 1 / 8, 'Diminutive': 1 / 4, 'Tiny': 1 / 2, 'Small': 3 / 4,
            'Medium': 1, 'Large': 2, 'Huge': 4, 'Gargantuan': 8, 'Colossal': 16
        };

        const multiplier = sizeMultipliers[size] || 1;

        return {
            light: Math.floor(lightLoad * multiplier),
            medium: Math.floor(mediumLoad * multiplier),
            heavy: Math.floor(heavyLoad * multiplier),
            maxLoad: Math.floor(heavyLoad * multiplier),
            liftOverHead: Math.floor(heavyLoad * multiplier),
            liftOffGround: Math.floor(heavyLoad * multiplier * 2),
            dragOrPush: Math.floor(heavyLoad * multiplier * 5)
        };
    }

    /**
     * Calculate total character level
     * @param {Array} classes - Character's classes and levels
     * @returns {number} Total character level
     */
    calculateTotalLevel(classes) {
        return classes.reduce((total, classLevel) => total + classLevel.level, 0);
    }

    /**
     * Calculate experience points needed for next level
     * @param {number} currentLevel - Current total character level
     * @returns {Object} XP information
     */
    calculateExperiencePoints(currentLevel) {
        // D&D 3.5 XP table
        const xpTable = [
            0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000,
            55000, 66000, 78000, 91000, 105000, 120000, 136000, 153000, 171000, 190000
        ];

        const currentXP = xpTable[Math.min(currentLevel - 1, 19)] || 0;
        const nextLevelXP = xpTable[Math.min(currentLevel, 19)] || (currentXP + 10000);

        return {
            current: currentXP,
            next: nextLevelXP,
            needed: nextLevelXP - currentXP
        };
    }

    /**
     * Validate character build for rules compliance
     * @param {Object} character - Complete character object
     * @returns {Object} Validation results
     */
    validateCharacter(character) {
        const errors = [];
        const warnings = [];

        // Validate ability scores
        for (const [ability, score] of Object.entries(character.abilities || {})) {
            if (score < 3 || score > 25) {
                errors.push(`${ability} score ${score} is outside normal range (3-25)`);
            }
        }

        // Validate class/alignment restrictions
        for (const classLevel of character.classes || []) {
            const classData = this.classData.find(c => c.name === classLevel.className);
            if (classData && classData.alignment_restrictions !== 'Any') {
                // Check alignment restrictions
                if (!this.validateAlignment(character.alignment, classData.alignment_restrictions)) {
                    errors.push(`${classLevel.className} alignment restriction violated`);
                }
            }
        }

        // Validate multiclass XP penalty
        const xpPenalty = this.calculateMulticlassXPPenalty(character.race, character.classes);
        if (xpPenalty > 0) {
            warnings.push(`Multiclass XP penalty: -${xpPenalty * 20}%`);
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Calculate multiclass experience penalty
     * @param {string} race - Character race
     * @param {Array} classes - Character classes and levels
     * @returns {number} XP penalty percentage (0-1)
     */
    calculateMulticlassXPPenalty(race, classes) {
        if (classes.length <= 1) return 0;

        const raceData = this.raceData.find(r => r.name === race);
        const favoredClass = raceData?.favored_class;

        // Sort classes by level (highest first)
        const sortedClasses = [...classes].sort((a, b) => b.level - a.level);
        const highestLevel = sortedClasses[0].level;

        let penaltyClasses = 0;
        for (const classLevel of sortedClasses) {
            // Skip favored class and highest level class
            if (classLevel.className === favoredClass || classLevel.level === highestLevel) {
                continue;
            }

            // Check if class is within one level of highest
            if (highestLevel - classLevel.level > 1) {
                penaltyClasses++;
            }
        }

        return penaltyClasses * 0.2; // 20% penalty per offending class
    }

    /**
     * Check if alignment meets class requirements
     * @param {string} alignment - Character alignment
     * @param {string} requirement - Class alignment requirement
     * @returns {boolean} Whether alignment is valid
     */
    validateAlignment(alignment, requirement) {
        if (requirement === 'Any') return true;

        const alignmentMap = {
            'LG': 'Lawful Good', 'NG': 'Neutral Good', 'CG': 'Chaotic Good',
            'LN': 'Lawful Neutral', 'N': 'True Neutral', 'CN': 'Chaotic Neutral',
            'LE': 'Lawful Evil', 'NE': 'Neutral Evil', 'CE': 'Chaotic Evil'
        };

        // Handle specific requirements
        if (requirement === 'Lawful Good only') {
            return alignment === 'LG' || alignment === 'Lawful Good';
        }

        if (requirement === 'Any nonlawful') {
            return !alignment.includes('Lawful') && alignment !== 'LN';
        }

        // Add more specific alignment validation as needed
        return true;
    }

    /**
     * Calculate all derived statistics for a character
     * @param {Object} character - Complete character object
     * @returns {Object} All calculated statistics
     */
    calculateAllStats(character) {
        const abilities = this.applyRacialAbilityAdjustments(character.baseAbilities || character.abilities, character.race);
        const abilityModifiers = this.calculateAllAbilityModifiers(abilities);

        const stats = {
            abilities,
            abilityModifiers,
            level: this.calculateTotalLevel(character.classes || []),
            hitPoints: this.calculateHitPoints(character.classes || [], abilityModifiers.constitution),
            armorClass: this.calculateArmorClass(character),
            attackBonuses: this.calculateAttackBonuses(character),
            savingThrows: this.calculateSavingThrows(character.classes || [], abilityModifiers),
            baseAttackBonus: this.calculateBaseAttackBonus(character.classes || []),
            carryingCapacity: this.calculateCarryingCapacity(abilities.strength, character.size),
            experiencePoints: this.calculateExperiencePoints(this.calculateTotalLevel(character.classes || [])),
            validation: this.validateCharacter(character)
        };

        // Calculate spells for spellcasting classes
        stats.spellsPerDay = {};
        for (const classLevel of character.classes || []) {
            const classData = this.classData.find(c => c.name === classLevel.className);
            if (classData && classData.spellcasting) {
                const abilityName = classData.spell_save_dc_ability?.toLowerCase();
                const abilityMod = abilityModifiers[abilityName] || 0;
                stats.spellsPerDay[classLevel.className] = this.calculateSpellsPerDay(
                    classLevel.className,
                    classLevel.level,
                    abilityMod
                );
            }
        }

        return stats;
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DnDCalculationEngine;
} else if (typeof window !== 'undefined') {
    window.DnDCalculationEngine = DnDCalculationEngine;
}
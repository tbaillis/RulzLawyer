/**
 * CalculationEngine - Complete D&D 3.5 Rule Calculations
 * 
 * Features:
 * - All D&D 3.5 ability score modifier calculations
 * - Saving throws and combat statistics
 * - Skill bonuses and synergies
 * - Spell save DCs and caster levels
 * - Multiclass penalties and bonuses
 * - Armor class calculations
 * - Base attack bonus calculations
 * - Experience point requirements
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class CalculationEngine {
    constructor() {
        this.gameData = null;
        this.calculationCache = new Map();
        this.maxCacheSize = 1000;
        
        // D&D 3.5 constants
        this.constants = {
            ABILITY_MODIFIER_BASE: 10,
            ABILITY_MODIFIER_DIVISOR: 2,
            BASE_AC: 10,
            EPIC_LEVEL_THRESHOLD: 21,
            MAX_SKILL_RANKS_MULTIPLIER: 1,
            CROSS_CLASS_DIVISOR: 2
        };
        
        // Size modifiers for various calculations
        this.sizeModifiers = {
            'Fine': { ac: 8, attack: 8, hide: 16, grapple: -16 },
            'Diminutive': { ac: 4, attack: 4, hide: 12, grapple: -12 },
            'Tiny': { ac: 2, attack: 2, hide: 8, grapple: -8 },
            'Small': { ac: 1, attack: 1, hide: 4, grapple: -4 },
            'Medium': { ac: 0, attack: 0, hide: 0, grapple: 0 },
            'Large': { ac: -1, attack: -1, hide: -4, grapple: 4 },
            'Huge': { ac: -2, attack: -2, hide: -8, grapple: 8 },
            'Gargantuan': { ac: -4, attack: -4, hide: -12, grapple: 12 },
            'Colossal': { ac: -8, attack: -8, hide: -16, grapple: 16 }
        };
        
        // Base attack bonus progressions
        this.babProgressions = {
            'good': (level) => level,
            'average': (level) => Math.floor(level * 3 / 4),
            'poor': (level) => Math.floor(level / 2)
        };
        
        // Saving throw progressions
        this.saveProgressions = {
            'good': (level) => 2 + Math.floor(level / 2),
            'poor': (level) => Math.floor(level / 3)
        };
        
        // Skill synergies (5+ ranks in these skills provide +2 to target skill)
        this.skillSynergies = {
            'Bluff': ['Diplomacy', 'Disguise', 'Intimidate', 'Sleight of Hand'],
            'Climb': ['Jump'],
            'Handle Animal': ['Ride', 'Wild Empathy'],
            'Jump': ['Tumble'],
            'Knowledge (arcana)': ['Spellcraft'],
            'Knowledge (dungeoneering)': ['Survival (underground)'],
            'Knowledge (engineering)': ['Search (for secret doors and hidden compartments)'],
            'Knowledge (geography)': ['Survival (avoid getting lost)'],
            'Knowledge (history)': ['Bardic Knowledge'],
            'Knowledge (local)': ['Gather Information'],
            'Knowledge (nature)': ['Survival (natural environments)'],
            'Knowledge (nobility and royalty)': ['Diplomacy'],
            'Knowledge (religion)': ['Turn Undead checks'],
            'Knowledge (the planes)': ['Survival (on other planes)'],
            'Profession': ['related Profession checks'],
            'Search': ['Survival (follow tracks)'],
            'Spellcraft': ['Use Magic Device (scrolls)'],
            'Survival': ['Knowledge (nature)'],
            'Tumble': ['Balance', 'Jump'],
            'Use Rope': ['Climb (with ropes)', 'Escape Artist (ropes)']
        };
    }

    /**
     * Initialize with game data
     */
    initialize(gameData) {
        this.gameData = gameData;
        this.calculationCache.clear();
        console.log('✅ Calculation Engine initialized');
    }

    // ===== ABILITY SCORE CALCULATIONS =====

    /**
     * Calculate ability modifier from ability score
     */
    calculateAbilityModifier(abilityScore) {
        if (typeof abilityScore !== 'number' || abilityScore < 1) {
            return 0;
        }
        return Math.floor((abilityScore - this.constants.ABILITY_MODIFIER_BASE) / this.constants.ABILITY_MODIFIER_DIVISOR);
    }

    /**
     * Calculate all ability modifiers
     */
    calculateAllAbilityModifiers(abilities) {
        const modifiers = {};
        const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        
        abilityNames.forEach(ability => {
            modifiers[ability] = this.calculateAbilityModifier(abilities[ability] || 10);
        });
        
        return modifiers;
    }

    /**
     * Apply racial ability adjustments
     */
    applyRacialAbilityAdjustments(baseAbilities, raceName) {
        if (!this.gameData || !this.gameData.races) {
            console.warn('Race data not available');
            return { ...baseAbilities };
        }

        const race = this.gameData.races.find(r => r.name.toLowerCase() === raceName.toLowerCase());
        if (!race || !race.abilityAdjustments) {
            return { ...baseAbilities };
        }

        const adjustedAbilities = { ...baseAbilities };
        
        Object.keys(race.abilityAdjustments).forEach(ability => {
            if (adjustedAbilities[ability] !== undefined) {
                adjustedAbilities[ability] += race.abilityAdjustments[ability];
                
                // Ensure abilities don't go below 1
                if (adjustedAbilities[ability] < 1) {
                    adjustedAbilities[ability] = 1;
                }
            }
        });

        return adjustedAbilities;
    }

    // ===== COMBAT CALCULATIONS =====

    /**
     * Calculate comprehensive armor class
     */
    calculateArmorClass(character) {
        const dexMod = this.calculateAbilityModifier(character.abilities.dexterity);
        const sizeMod = this.getSizeModifier(character.size || 'Medium', 'ac');
        
        const ac = {
            base: this.constants.BASE_AC,
            dexterity: dexMod,
            armor: 0,
            shield: 0,
            natural: 0,
            deflection: 0,
            dodge: 0,
            size: sizeMod,
            misc: 0
        };

        // Calculate armor bonus
        if (character.equipment && character.equipment.armor && character.equipment.armor.length > 0) {
            const armor = character.equipment.armor[0]; // Primary armor
            ac.armor = armor.acBonus || 0;
            
            // Apply max dex bonus restriction
            if (armor.maxDexBonus !== undefined && armor.maxDexBonus < dexMod) {
                ac.dexterity = armor.maxDexBonus;
            }
        }

        // Calculate shield bonus
        if (character.equipment && character.equipment.shield) {
            ac.shield = character.equipment.shield.acBonus || 0;
        }

        // Add natural armor from race or effects
        if (character.naturalArmor) {
            ac.natural = character.naturalArmor;
        }

        // Calculate totals
        ac.total = Object.values(ac).reduce((sum, value) => sum + value, 0);
        ac.touch = ac.base + ac.dexterity + ac.deflection + ac.dodge + ac.size + ac.misc;
        ac.flatFooted = ac.total - ac.dexterity - ac.dodge;

        return ac;
    }

    /**
     * Calculate base attack bonus from classes
     */
    calculateBaseAttackBonus(character) {
        if (!character.classes || character.classes.length === 0) {
            return 0;
        }

        let totalBAB = 0;
        
        character.classes.forEach(cls => {
            const classData = this.getClassData(cls.name);
            if (classData && classData.baseAttackBonus) {
                const progression = classData.baseAttackBonus.toLowerCase();
                const babFunction = this.babProgressions[progression];
                if (babFunction) {
                    totalBAB += babFunction(cls.level);
                }
            }
        });

        return totalBAB;
    }

    /**
     * Calculate all saving throws
     */
    calculateSavingThrows(character) {
        const saves = {
            fortitude: { base: 0, ability: 0, misc: 0, race: 0 },
            reflex: { base: 0, ability: 0, misc: 0, race: 0 },
            will: { base: 0, ability: 0, misc: 0, race: 0 }
        };

        // Calculate base saves from classes
        if (character.classes) {
            character.classes.forEach(cls => {
                const classData = this.getClassData(cls.name);
                if (classData && classData.savingThrows) {
                    saves.fortitude.base += this.getClassSave(classData.savingThrows.fortitude, cls.level);
                    saves.reflex.base += this.getClassSave(classData.savingThrows.reflex, cls.level);
                    saves.will.base += this.getClassSave(classData.savingThrows.will, cls.level);
                }
            });
        }

        // Apply ability modifiers
        saves.fortitude.ability = this.calculateAbilityModifier(character.abilities.constitution);
        saves.reflex.ability = this.calculateAbilityModifier(character.abilities.dexterity);
        saves.will.ability = this.calculateAbilityModifier(character.abilities.wisdom);

        // Apply racial bonuses
        const raceData = this.getRaceData(character.race);
        if (raceData && raceData.savingThrowBonuses) {
            saves.fortitude.race = raceData.savingThrowBonuses.fortitude || 0;
            saves.reflex.race = raceData.savingThrowBonuses.reflex || 0;
            saves.will.race = raceData.savingThrowBonuses.will || 0;
        }

        // Calculate totals
        Object.keys(saves).forEach(save => {
            const s = saves[save];
            s.total = s.base + s.ability + s.misc + s.race;
        });

        return saves;
    }

    /**
     * Get class save progression value
     */
    getClassSave(saveProgression, level) {
        if (typeof saveProgression === 'string') {
            const progression = saveProgression.toLowerCase();
            const saveFunction = this.saveProgressions[progression];
            return saveFunction ? saveFunction(level) : 0;
        }
        return saveProgression || 0;
    }

    /**
     * Calculate initiative modifier
     */
    calculateInitiative(character) {
        const dexMod = this.calculateAbilityModifier(character.abilities.dexterity);
        let misc = 0;
        
        // Add Improved Initiative feat bonus
        if (character.feats && character.feats.includes('Improved Initiative')) {
            misc += 4;
        }
        
        return {
            dexterity: dexMod,
            misc: misc,
            total: dexMod + misc
        };
    }

    // ===== SKILL CALCULATIONS =====

    /**
     * Calculate skill bonus with all modifiers
     */
    calculateSkillBonus(character, skillName) {
        const skill = character.skills ? character.skills[skillName] : null;
        if (!skill) {
            return { total: 0, breakdown: { ranks: 0, ability: 0, misc: 0, synergy: 0, racial: 0 } };
        }

        const skillData = this.getSkillData(skillName);
        if (!skillData) {
            return { total: 0, breakdown: { ranks: 0, ability: 0, misc: 0, synergy: 0, racial: 0 } };
        }

        const bonus = {
            ranks: skill.ranks || 0,
            ability: this.calculateAbilityModifier(character.abilities[skillData.keyAbility]),
            misc: skill.miscModifier || 0,
            synergy: this.calculateSynergyBonus(character, skillName),
            racial: this.getRacialSkillBonus(character.race, skillName),
            armorCheckPenalty: 0
        };

        // Apply armor check penalty if applicable
        if (skillData.armorCheckPenalty) {
            bonus.armorCheckPenalty = this.calculateArmorCheckPenalty(character);
        }

        // Apply class skill bonus (+3 if trained and class skill)
        if (skill.ranks > 0 && this.isClassSkill(character, skillName)) {
            bonus.classSkill = 3;
        } else {
            bonus.classSkill = 0;
        }

        bonus.total = Object.values(bonus).reduce((sum, value) => sum + value, 0);
        
        return { total: bonus.total, breakdown: bonus };
    }

    /**
     * Calculate synergy bonuses for skills
     */
    calculateSynergyBonus(character, skillName) {
        let synergyBonus = 0;
        
        // Find skills that provide synergy to this skill
        Object.keys(this.skillSynergies).forEach(sourceSkill => {
            if (this.skillSynergies[sourceSkill].includes(skillName)) {
                const sourceSkillData = character.skills ? character.skills[sourceSkill] : null;
                if (sourceSkillData && sourceSkillData.ranks >= 5) {
                    synergyBonus += 2;
                }
            }
        });

        return synergyBonus;
    }

    /**
     * Calculate armor check penalty
     */
    calculateArmorCheckPenalty(character) {
        let penalty = 0;
        
        if (character.equipment) {
            // Armor penalty
            if (character.equipment.armor && character.equipment.armor.length > 0) {
                penalty += Math.abs(character.equipment.armor[0].armorCheckPenalty || 0);
            }
            
            // Shield penalty
            if (character.equipment.shield) {
                penalty += Math.abs(character.equipment.shield.armorCheckPenalty || 0);
            }
        }

        return -penalty; // Return as negative value
    }

    /**
     * Check if skill is a class skill for character
     */
    isClassSkill(character, skillName) {
        if (!character.classes) return false;
        
        return character.classes.some(cls => {
            const classData = this.getClassData(cls.name);
            return classData && classData.classSkills && classData.classSkills.includes(skillName);
        });
    }

    /**
     * Get racial skill bonus
     */
    getRacialSkillBonus(raceName, skillName) {
        const raceData = this.getRaceData(raceName);
        if (raceData && raceData.skillBonuses && raceData.skillBonuses[skillName]) {
            return raceData.skillBonuses[skillName];
        }
        return 0;
    }

    // ===== SPELL CALCULATIONS =====

    /**
     * Calculate spell save DC
     */
    calculateSpellSaveDC(spell, character, casterClass) {
        const classData = this.getClassData(casterClass);
        if (!classData || !classData.spellcasting) {
            return 10; // Default DC
        }

        const spellLevel = this.getSpellLevel(spell, casterClass);
        const keyAbility = classData.spellcasting.keyAbility || 'intelligence';
        const abilityMod = this.calculateAbilityModifier(character.abilities[keyAbility]);
        
        let baseDC = 10 + spellLevel + abilityMod;
        
        // Add spell focus bonuses
        if (character.feats && character.feats.includes('Spell Focus')) {
            baseDC += 1;
        }
        if (character.feats && character.feats.includes('Greater Spell Focus')) {
            baseDC += 1;
        }

        return baseDC;
    }

    /**
     * Get spell level for specific class
     */
    getSpellLevel(spell, casterClass) {
        if (spell.classes) {
            const classSpell = spell.classes.find(c => c.name.toLowerCase() === casterClass.toLowerCase());
            return classSpell ? classSpell.level : 0;
        }
        return spell.level || 0;
    }

    /**
     * Calculate caster level
     */
    calculateCasterLevel(character, casterClass) {
        if (!character.classes) return 0;
        
        const cls = character.classes.find(c => c.name.toLowerCase() === casterClass.toLowerCase());
        return cls ? cls.level : 0;
    }

    /**
     * Calculate bonus spells per day
     */
    calculateBonusSpells(character, casterClass, spellLevel) {
        const classData = this.getClassData(casterClass);
        if (!classData || !classData.spellcasting) return 0;

        const keyAbility = classData.spellcasting.keyAbility;
        const abilityScore = character.abilities[keyAbility];
        const abilityMod = this.calculateAbilityModifier(abilityScore);

        if (abilityMod <= 0 || spellLevel === 0) return 0;

        // Calculate bonus spells based on ability modifier and spell level
        const bonusSpells = Math.floor((abilityMod - spellLevel + 4) / 4);
        return Math.max(0, bonusSpells);
    }

    // ===== EXPERIENCE AND LEVEL CALCULATIONS =====

    /**
     * Calculate experience required for next level
     */
    calculateExperienceRequired(level) {
        if (level < 1) return 0;
        
        // D&D 3.5 experience table
        const xpTable = [
            0,     // Level 1
            1000,  // Level 2
            3000,  // Level 3
            6000,  // Level 4
            10000, // Level 5
            15000, // Level 6
            21000, // Level 7
            28000, // Level 8
            36000, // Level 9
            45000, // Level 10
            55000, // Level 11
            66000, // Level 12
            78000, // Level 13
            91000, // Level 14
            105000, // Level 15
            120000, // Level 16
            136000, // Level 17
            153000, // Level 18
            171000, // Level 19
            190000  // Level 20
        ];

        if (level <= 20) {
            return xpTable[level - 1] || 0;
        }

        // Epic levels (21+): each level requires 1000 * new level XP beyond 190,000
        let epicXP = 190000;
        for (let i = 21; i <= level; i++) {
            epicXP += 1000 * i;
        }
        return epicXP;
    }

    /**
     * Calculate character level from experience
     */
    calculateLevelFromExperience(experience) {
        for (let level = 1; level <= 100; level++) {
            if (experience < this.calculateExperienceRequired(level + 1)) {
                return level;
            }
        }
        return 100; // Max level
    }

    // ===== HIT POINTS CALCULATIONS =====

    /**
     * Calculate hit points for character
     */
    calculateHitPoints(character) {
        if (!character.classes || character.classes.length === 0) {
            return { current: 1, max: 1, temporary: 0 };
        }

        const conMod = this.calculateAbilityModifier(character.abilities.constitution);
        let totalHP = 0;

        character.classes.forEach(cls => {
            const classData = this.getClassData(cls.name);
            if (classData) {
                const hitDie = classData.hitDie || 4;
                
                // First level gets max HP
                if (cls.level >= 1) {
                    totalHP += hitDie + conMod;
                }
                
                // Subsequent levels (assuming average HP gain)
                for (let level = 2; level <= cls.level; level++) {
                    const averageHP = Math.floor(hitDie / 2) + 1;
                    totalHP += averageHP + conMod;
                }
            }
        });

        // Minimum 1 HP per level
        const totalLevel = character.classes.reduce((sum, cls) => sum + cls.level, 0);
        totalHP = Math.max(totalHP, totalLevel);

        return {
            current: character.currentHP || totalHP,
            max: totalHP,
            temporary: character.temporaryHP || 0
        };
    }

    // ===== UTILITY METHODS =====

    /**
     * Get size modifier for specific calculation type
     */
    getSizeModifier(size, type) {
        const sizeData = this.sizeModifiers[size] || this.sizeModifiers['Medium'];
        return sizeData[type] || 0;
    }

    /**
     * Get class data by name
     */
    getClassData(className) {
        if (!this.gameData || !this.gameData.classes) return null;
        return this.gameData.classes.find(c => c.name.toLowerCase() === className.toLowerCase());
    }

    /**
     * Get race data by name
     */
    getRaceData(raceName) {
        if (!this.gameData || !this.gameData.races) return null;
        return this.gameData.races.find(r => r.name.toLowerCase() === raceName.toLowerCase());
    }

    /**
     * Get skill data by name
     */
    getSkillData(skillName) {
        if (!this.gameData || !this.gameData.skills) return null;
        return this.gameData.skills.find(s => s.name === skillName);
    }

    /**
     * Clear calculation cache
     */
    clearCache() {
        this.calculationCache.clear();
    }

    /**
     * Get cached calculation or compute new one
     */
    getCachedCalculation(key, calculationFunction) {
        if (this.calculationCache.has(key)) {
            return this.calculationCache.get(key);
        }

        const result = calculationFunction();
        
        // Manage cache size
        if (this.calculationCache.size >= this.maxCacheSize) {
            const firstKey = this.calculationCache.keys().next().value;
            this.calculationCache.delete(firstKey);
        }
        
        this.calculationCache.set(key, result);
        return result;
    }

    /**
     * Validate calculation engine
     */
    selfTest() {
        const tests = [
            {
                name: 'Ability Modifier Calculation',
                test: () => {
                    const mod10 = this.calculateAbilityModifier(10);
                    const mod18 = this.calculateAbilityModifier(18);
                    const mod8 = this.calculateAbilityModifier(8);
                    return mod10 === 0 && mod18 === 4 && mod8 === -1;
                }
            },
            {
                name: 'Base AC Calculation',
                test: () => {
                    const testChar = { abilities: { dexterity: 14 }, size: 'Medium' };
                    const ac = this.calculateArmorClass(testChar);
                    return ac.total === 12; // 10 base + 2 dex
                }
            },
            {
                name: 'Experience Table',
                test: () => {
                    const level2XP = this.calculateExperienceRequired(2);
                    const level20XP = this.calculateExperienceRequired(20);
                    return level2XP === 1000 && level20XP === 190000;
                }
            }
        ];

        return tests.map(test => ({
            name: test.name,
            passed: test.test(),
            error: null
        }));
    }
}

// Global export for both browser and Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculationEngine;
} else if (typeof window !== 'undefined') {
    window.CalculationEngine = CalculationEngine;
}
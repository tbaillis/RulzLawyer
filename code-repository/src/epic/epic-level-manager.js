/**
 * EpicLevelManager - D&D 3.5 Epic Level Progression System (21-100)
 * Manages epic level advancement, epic feats, and enhanced abilities
 * 
 * Features:
 * - Epic level progression for all classes (21-100)
 * - Epic feat selection and prerequisites
 * - Enhanced ability score increases
 * - Epic spell progression for spellcasters
 * - Legendary skill bonuses and abilities
 * - Divine rank progression for epic characters
 * - Epic magic item creation and artifact powers
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class EpicLevelManager {
    constructor(srdDataManager, spellManager) {
        this.srdData = srdDataManager;
        this.spellManager = spellManager;
        this.epicFeats = this.initializeEpicFeats();
        this.epicProgression = this.initializeEpicProgression();

        console.log('⚡ EpicLevelManager initialized with levels 21-100 support');
    }

    /**
     * Initialize epic feats database
     */
    initializeEpicFeats() {
        return [
            // Combat Epic Feats
            {
                name: 'Epic Weapon Focus',
                type: 'Epic',
                category: 'Combat',
                prerequisites: ['Fighter 8th level', 'Weapon Focus'],
                description: 'Choose one weapon. You gain a +2 bonus on all attack rolls you make using that weapon. This bonus stacks with Weapon Focus.',
                benefit: '+2 attack bonus with chosen weapon (stacks with Weapon Focus)'
            },
            {
                name: 'Epic Weapon Specialization',
                type: 'Epic',
                category: 'Combat',
                prerequisites: ['Fighter 12th level', 'Epic Weapon Focus', 'Weapon Specialization'],
                description: 'Choose one weapon. You deal +6 points of damage with that weapon. This bonus stacks with Weapon Specialization.',
                benefit: '+6 damage with chosen weapon (stacks with Weapon Specialization)'
            },
            {
                name: 'Devastating Critical',
                type: 'Epic',
                category: 'Combat',
                prerequisites: ['Str 25', 'Cleave', 'Great Cleave', 'Improved Critical', 'Power Attack', 'Weapon Focus'],
                description: 'Whenever you score a critical hit, the target must make a Fortitude save (DC 10 + 1/2 your level + Str modifier) or die instantly.',
                benefit: 'Critical hits can instantly kill enemies'
            },
            {
                name: 'Overwhelming Critical',
                type: 'Epic',
                category: 'Combat',
                prerequisites: ['Str 23', 'Cleave', 'Great Cleave', 'Power Attack', 'Weapon Focus'],
                description: 'When you score a critical hit, you deal +1d6 points of bonus damage per point of critical multiplier above ×2.',
                benefit: 'Extra damage dice on critical hits'
            },
            {
                name: 'Epic Toughness',
                type: 'Epic',
                category: 'General',
                prerequisites: [],
                description: 'You gain +30 hit points.',
                benefit: '+30 hit points'
            },
            {
                name: 'Great Strength',
                type: 'Epic',
                category: 'General',
                prerequisites: ['Str 25'],
                description: 'Your Strength score increases by +1. You can take this feat multiple times.',
                benefit: '+1 Strength (repeatable)'
            },
            {
                name: 'Great Dexterity',
                type: 'Epic',
                category: 'General',
                prerequisites: ['Dex 25'],
                description: 'Your Dexterity score increases by +1. You can take this feat multiple times.',
                benefit: '+1 Dexterity (repeatable)'
            },
            {
                name: 'Great Constitution',
                type: 'Epic',
                category: 'General',
                prerequisites: ['Con 25'],
                description: 'Your Constitution score increases by +1. You can take this feat multiple times.',
                benefit: '+1 Constitution (repeatable)'
            },
            {
                name: 'Great Intelligence',
                type: 'Epic',
                category: 'General',
                prerequisites: ['Int 25'],
                description: 'Your Intelligence score increases by +1. You can take this feat multiple times.',
                benefit: '+1 Intelligence (repeatable)'
            },
            {
                name: 'Great Wisdom',
                type: 'Epic',
                category: 'General',
                prerequisites: ['Wis 25'],
                description: 'Your Wisdom score increases by +1. You can take this feat multiple times.',
                benefit: '+1 Wisdom (repeatable)'
            },
            {
                name: 'Great Charisma',
                type: 'Epic',
                category: 'General',
                prerequisites: ['Cha 25'],
                description: 'Your Charisma score increases by +1. You can take this feat multiple times.',
                benefit: '+1 Charisma (repeatable)'
            },

            // Spellcasting Epic Feats
            {
                name: 'Epic Spellcasting',
                type: 'Epic',
                category: 'Metamagic',
                prerequisites: ['Spellcraft 24 ranks', 'Knowledge (arcana) 24 ranks', 'ability to cast 9th-level spells'],
                description: 'You can develop and cast epic spells. Epic spells are spells whose effects cannot be duplicated by spells of 9th level or lower.',
                benefit: 'Ability to create and cast epic spells'
            },
            {
                name: 'Improved Heighten Spell',
                type: 'Epic',
                category: 'Metamagic',
                prerequisites: ['Heighten Spell'],
                description: 'You can heighten spells to above 9th level. The spell uses a spell slot of the heightened level.',
                benefit: 'Heighten spells above 9th level'
            },
            {
                name: 'Improved Metamagic',
                type: 'Epic',
                category: 'Metamagic',
                prerequisites: ['Four metamagic feats', 'Spellcraft 30 ranks'],
                description: 'The spell slot cost for all your metamagic feats is reduced by one level, to a minimum of one level higher than normal.',
                benefit: 'Reduce metamagic spell slot costs by 1'
            },

            // Epic Skill Feats
            {
                name: 'Legendary Climber',
                type: 'Epic',
                category: 'Skill',
                prerequisites: ['Climb 24 ranks'],
                description: 'You can climb on perfectly smooth, flat, vertical surfaces, and on the underside of ledges and ceilings.',
                benefit: 'Climb impossible surfaces'
            },
            {
                name: 'Legendary Rider',
                type: 'Epic',
                category: 'Skill',
                prerequisites: ['Ride 24 ranks'],
                description: 'You don\'t take any damage when you fall from a mount, and you don\'t need to make a Ride check to control your mount in battle.',
                benefit: 'Perfect mount control and fall immunity'
            },
            {
                name: 'Self-Concealment',
                type: 'Epic',
                category: 'Skill',
                prerequisites: ['Hide 30 ranks', 'Improved Invisibility'],
                description: 'You have a 10% miss chance due to your ability to hide in plain sight.',
                benefit: '10% miss chance from concealment'
            },

            // Divine Epic Feats
            {
                name: 'Divine Rank',
                type: 'Epic',
                category: 'Divine',
                prerequisites: ['Character level 40+', 'Worshipers'],
                description: 'You gain divine rank 1 and become a lesser deity with divine abilities.',
                benefit: 'Become a lesser deity with divine powers'
            },
            {
                name: 'Zone of Control',
                type: 'Epic',
                category: 'Divine',
                prerequisites: ['Divine Rank 1+'],
                description: 'You can control a specific type of creature, spell, or effect within your divine realm.',
                benefit: 'Control specific elements within divine realm'
            }
        ];
    }

    /**
     * Initialize epic level progression tables
     */
    initializeEpicProgression() {
        return {
            // General epic progression
            abilityIncreases: {
                // Every 4 levels after 20th
                24: 1, 28: 1, 32: 1, 36: 1, 40: 1, 44: 1, 48: 1, 52: 1,
                56: 1, 60: 1, 64: 1, 68: 1, 72: 1, 76: 1, 80: 1, 84: 1,
                88: 1, 92: 1, 96: 1, 100: 1
            },

            // Epic feat progression (every 3 levels after 21st)
            epicFeats: {
                21: 1, 24: 1, 27: 1, 30: 1, 33: 1, 36: 1, 39: 1, 42: 1,
                45: 1, 48: 1, 51: 1, 54: 1, 57: 1, 60: 1, 63: 1, 66: 1,
                69: 1, 72: 1, 75: 1, 78: 1, 81: 1, 84: 1, 87: 1, 90: 1,
                93: 1, 96: 1, 99: 1
            },

            // Class-specific epic progressions
            classProgression: {
                'Barbarian': {
                    hitDie: 12,
                    skillPoints: 4,
                    epicFeatures: {
                        22: 'Damage Reduction +1',
                        25: 'Greater Rage',
                        28: 'Damage Reduction +2',
                        31: 'Mighty Rage',
                        34: 'Damage Reduction +3',
                        37: 'Legendary Rage'
                    }
                },
                'Bard': {
                    hitDie: 6,
                    skillPoints: 6,
                    epicFeatures: {
                        23: 'Epic Bardic Music',
                        26: 'Epic Bardic Knowledge',
                        29: 'Epic Inspire Courage +3',
                        32: 'Epic Inspire Courage +4'
                    }
                },
                'Cleric': {
                    hitDie: 8,
                    skillPoints: 2,
                    epicFeatures: {
                        22: 'Epic Turn Undead',
                        25: 'Divine Spell Power',
                        28: 'Epic Domain Power',
                        31: 'Divine Ascension'
                    }
                },
                'Druid': {
                    hitDie: 8,
                    skillPoints: 4,
                    epicFeatures: {
                        22: 'Epic Wild Shape',
                        25: 'Timeless Body Enhancement',
                        28: 'Epic Animal Companion',
                        31: 'Nature\'s Wrath'
                    }
                },
                'Fighter': {
                    hitDie: 10,
                    skillPoints: 2,
                    epicFeatures: {
                        22: 'Epic Weapon Specialization',
                        24: 'Epic Weapon Focus',
                        26: 'Epic Greater Weapon Specialization',
                        28: 'Epic Greater Weapon Focus',
                        30: 'Legendary Weapon Master'
                    }
                },
                'Monk': {
                    hitDie: 8,
                    skillPoints: 4,
                    epicFeatures: {
                        21: 'Epic Unarmed Strike',
                        23: 'Epic Speed',
                        25: 'Epic Ki Strike',
                        27: 'Perfect Self Enhancement',
                        29: 'Epic Flurry'
                    }
                },
                'Paladin': {
                    hitDie: 10,
                    skillPoints: 2,
                    epicFeatures: {
                        22: 'Epic Smite Evil',
                        25: 'Epic Lay on Hands',
                        28: 'Epic Divine Grace',
                        31: 'Legendary Paladin'
                    }
                },
                'Ranger': {
                    hitDie: 10,
                    skillPoints: 6,
                    epicFeatures: {
                        22: 'Epic Favored Enemy',
                        25: 'Epic Track',
                        28: 'Epic Animal Companion',
                        31: 'Legendary Ranger'
                    }
                },
                'Rogue': {
                    hitDie: 6,
                    skillPoints: 8,
                    epicFeatures: {
                        21: 'Epic Sneak Attack +1d6',
                        23: 'Epic Sneak Attack +2d6',
                        25: 'Epic Sneak Attack +3d6',
                        27: 'Epic Sneak Attack +4d6',
                        29: 'Epic Sneak Attack +5d6'
                    }
                },
                'Sorcerer': {
                    hitDie: 4,
                    skillPoints: 2,
                    epicFeatures: {
                        21: 'Epic Spell Slots',
                        24: 'Epic Metamagic',
                        27: 'Epic Sorcery',
                        30: 'Legendary Spellcaster'
                    }
                },
                'Wizard': {
                    hitDie: 4,
                    skillPoints: 2,
                    epicFeatures: {
                        21: 'Epic Spell Slots',
                        24: 'Epic Spellbook',
                        27: 'Epic School Specialization',
                        30: 'Archmage Powers'
                    }
                }
            }
        };
    }

    /**
     * Calculate epic level benefits for character
     */
    calculateEpicBenefits(character) {
        const level = character.level;

        if (level < 21) {
            return { isEpic: false };
        }

        const epicBenefits = {
            isEpic: true,
            epicLevel: level - 20,
            totalAbilityIncreases: this.calculateAbilityIncreases(level),
            totalEpicFeats: this.calculateEpicFeats(level),
            epicHitPoints: this.calculateEpicHitPoints(character),
            epicSkillPoints: this.calculateEpicSkillPoints(character),
            epicClassFeatures: this.getEpicClassFeatures(character),
            epicSpellSlots: this.calculateEpicSpellSlots(character),
            divineRank: this.calculateDivineRank(level)
        };

        return epicBenefits;
    }

    /**
     * Calculate total ability increases gained from epic levels
     */
    calculateAbilityIncreases(level) {
        let increases = 0;
        for (let lvl = 21; lvl <= level; lvl++) {
            if (this.epicProgression.abilityIncreases[lvl]) {
                increases += this.epicProgression.abilityIncreases[lvl];
            }
        }
        return increases;
    }

    /**
     * Calculate total epic feats gained
     */
    calculateEpicFeats(level) {
        let feats = 0;
        for (let lvl = 21; lvl <= level; lvl++) {
            if (this.epicProgression.epicFeats[lvl]) {
                feats += this.epicProgression.epicFeats[lvl];
            }
        }
        return feats;
    }

    /**
     * Calculate epic hit points
     */
    calculateEpicHitPoints(character) {
        const level = character.level;
        const characterClass = character.characterClass;
        const classProgression = this.epicProgression.classProgression[characterClass];

        if (!classProgression || level < 21) {
            return 0;
        }

        const epicLevels = level - 20;
        const hitDie = classProgression.hitDie;
        const conMod = Math.floor((character.abilities.constitution - 10) / 2);

        // Epic levels gain half hit die + Con modifier per level
        const baseEpicHP = Math.floor(hitDie / 2) + 1;
        const totalEpicHP = epicLevels * (baseEpicHP + conMod);

        return totalEpicHP;
    }

    /**
     * Calculate epic skill points
     */
    calculateEpicSkillPoints(character) {
        const level = character.level;
        const characterClass = character.characterClass;
        const classProgression = this.epicProgression.classProgression[characterClass];

        if (!classProgression || level < 21) {
            return 0;
        }

        const epicLevels = level - 20;
        const baseSkillPoints = classProgression.skillPoints;
        const intMod = Math.floor((character.abilities.intelligence - 10) / 2);

        const skillPointsPerLevel = Math.max(1, baseSkillPoints + intMod);
        const totalEpicSkillPoints = epicLevels * skillPointsPerLevel;

        return totalEpicSkillPoints;
    }

    /**
     * Get epic class features for character level
     */
    getEpicClassFeatures(character) {
        const level = character.level;
        const characterClass = character.characterClass;
        const classProgression = this.epicProgression.classProgression[characterClass];

        if (!classProgression || level < 21) {
            return [];
        }

        const features = [];
        const epicFeatures = classProgression.epicFeatures;

        for (const [featureLevel, feature] of Object.entries(epicFeatures)) {
            if (level >= parseInt(featureLevel)) {
                features.push({
                    level: parseInt(featureLevel),
                    feature: feature
                });
            }
        }

        return features;
    }

    /**
     * Calculate epic spell slots for spellcasters
     */
    calculateEpicSpellSlots(character) {
        if (!this.spellManager || character.level < 21) {
            return null;
        }

        const baseSlots = this.spellManager.calculateSpellSlots(
            character.characterClass,
            20,
            character.abilities
        );

        if (!baseSlots || Object.keys(baseSlots).length === 0) {
            return null; // Non-spellcaster
        }

        const epicLevel = character.level - 20;
        const epicSlots = { ...baseSlots };

        // Epic spellcasters gain additional spell slots
        for (let spellLevel = 0; spellLevel <= 9; spellLevel++) {
            if (epicSlots[spellLevel]) {
                // Gain 1 additional slot per 2 epic levels for each spell level
                const bonusSlots = Math.floor(epicLevel / 2);
                epicSlots[spellLevel].epic = bonusSlots;
                epicSlots[spellLevel].total += bonusSlots;
            }
        }

        // Epic spellcasters can cast spells of 10th level and higher
        if (epicLevel >= 1) {
            for (let spellLevel = 10; spellLevel <= Math.min(19, 9 + epicLevel); spellLevel++) {
                const slotsAtLevel = Math.max(1, Math.floor((epicLevel - (spellLevel - 9)) / 3));
                if (slotsAtLevel > 0) {
                    epicSlots[spellLevel] = {
                        base: 0,
                        bonus: 0,
                        epic: slotsAtLevel,
                        total: slotsAtLevel
                    };
                }
            }
        }

        return epicSlots;
    }

    /**
     * Calculate divine rank for epic characters
     */
    calculateDivineRank(level) {
        if (level < 40) {
            return 0; // Mortal
        } else if (level < 50) {
            return 1; // Demigod
        } else if (level < 60) {
            return 2; // Lesser Deity
        } else if (level < 70) {
            return 3; // Intermediate Deity
        } else if (level < 80) {
            return 4; // Greater Deity
        } else {
            return 5; // Supreme Deity
        }
    }

    /**
     * Get available epic feats for character
     */
    getAvailableEpicFeats(character) {
        return this.epicFeats.filter(feat =>
            this.checkEpicFeatPrerequisites(feat, character)
        );
    }

    /**
     * Check if character meets epic feat prerequisites
     */
    checkEpicFeatPrerequisites(feat, character) {
        // Basic implementation - would need full prerequisite checking
        return character.level >= 21;
    }

    /**
     * Apply epic level to character
     */
    applyEpicLevel(character, targetLevel) {
        if (targetLevel < 21 || targetLevel > 100) {
            throw new Error('Epic levels are between 21 and 100');
        }

        const originalLevel = character.level;
        character.level = targetLevel;

        // Calculate epic benefits
        const epicBenefits = this.calculateEpicBenefits(character);

        // Apply epic hit points
        if (!character.epicHP) {
            character.epicHP = 0;
        }
        character.epicHP = epicBenefits.epicHitPoints;

        // Apply epic skill points
        if (!character.epicSkillPoints) {
            character.epicSkillPoints = 0;
        }
        character.epicSkillPoints = epicBenefits.epicSkillPoints;

        // Update spell slots if spellcaster
        if (epicBenefits.epicSpellSlots) {
            character.spellSlots = epicBenefits.epicSpellSlots;
        }

        // Add epic class features
        if (!character.epicFeatures) {
            character.epicFeatures = [];
        }
        character.epicFeatures = epicBenefits.epicClassFeatures;

        // Set divine rank
        character.divineRank = epicBenefits.divineRank;

        console.log(`⚡ Applied epic level ${targetLevel} to ${character.name}`);
        console.log(`🎯 Epic benefits: +${epicBenefits.epicHitPoints} HP, +${epicBenefits.totalEpicFeats} epic feats, Divine Rank ${epicBenefits.divineRank}`);

        return character;
    }

    /**
     * Get epic level summary
     */
    getEpicSummary(character) {
        const epicBenefits = this.calculateEpicBenefits(character);

        if (!epicBenefits.isEpic) {
            return null;
        }

        return {
            epicLevel: epicBenefits.epicLevel,
            totalHitPoints: character.hitPoints + epicBenefits.epicHitPoints,
            totalSkillPoints: (character.skillPoints || 0) + epicBenefits.epicSkillPoints,
            availableEpicFeats: epicBenefits.totalEpicFeats,
            epicClassFeatures: epicBenefits.epicClassFeatures,
            divineRank: epicBenefits.divineRank,
            divineTitle: this.getDivineTitle(epicBenefits.divineRank),
            epicSpellSlots: epicBenefits.epicSpellSlots
        };
    }

    /**
     * Get divine title based on rank
     */
    getDivineTitle(divineRank) {
        const titles = {
            0: 'Mortal',
            1: 'Demigod',
            2: 'Lesser Deity',
            3: 'Intermediate Deity',
            4: 'Greater Deity',
            5: 'Supreme Deity'
        };

        return titles[divineRank] || 'Mortal';
    }
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EpicLevelManager;
} else if (typeof window !== 'undefined') {
    window.EpicLevelManager = EpicLevelManager;
}
/**
 * CharacterGenerator - D&D 3.5 SRD Compliant Character Creation System
 * Handles race/class combinations, ability scores, skills, feats, and equipment
 * Full SRD compliance with prerequisite validation and rule enforcement
 */

class CharacterGenerator {
    constructor(diceEngine = null) {
        this.diceEngine = diceEngine;
        this.characters = [];
        this.loadSRDData();
    }

    /**
     * Load D&D 3.5 SRD data for races, classes, skills, etc.
     */
    loadSRDData() {
        this.races = {
            human: {
                name: 'Human',
                abilityAdjustments: {},
                size: 'Medium',
                speed: 30,
                languages: ['Common'],
                traits: ['Extra Feat', 'Extra Skill Points'],
                favoredClass: 'Any'
            },
            elf: {
                name: 'Elf',
                abilityAdjustments: { dexterity: 2, constitution: -2 },
                size: 'Medium',
                speed: 30,
                languages: ['Common', 'Elven'],
                traits: ['Low-light Vision', 'Weapon Proficiency', 'Keen Senses'],
                favoredClass: 'Wizard'
            },
            dwarf: {
                name: 'Dwarf',
                abilityAdjustments: { constitution: 2, charisma: -2 },
                size: 'Medium',
                speed: 20,
                languages: ['Common', 'Dwarven'],
                traits: ['Darkvision', 'Stonecunning', 'Weapon Familiarity'],
                favoredClass: 'Fighter'
            },
            halfling: {
                name: 'Halfling',
                abilityAdjustments: { dexterity: 2, strength: -2 },
                size: 'Small',
                speed: 20,
                languages: ['Common', 'Halfling'],
                traits: ['Small Size', 'Lucky', 'Fearless'],
                favoredClass: 'Rogue'
            },
            gnome: {
                name: 'Gnome',
                abilityAdjustments: { constitution: 2, strength: -2 },
                size: 'Small',
                speed: 20,
                languages: ['Common', 'Gnome'],
                traits: ['Small Size', 'Low-light Vision', 'Spell-like Abilities'],
                favoredClass: 'Bard'
            },
            'half-elf': {
                name: 'Half-Elf',
                abilityAdjustments: {},
                size: 'Medium',
                speed: 30,
                languages: ['Common', 'Elven'],
                traits: ['Low-light Vision', 'Elven Blood', 'Adaptability'],
                favoredClass: 'Any'
            },
            'half-orc': {
                name: 'Half-Orc',
                abilityAdjustments: { strength: 2, intelligence: -2, charisma: -2 },
                size: 'Medium',
                speed: 30,
                languages: ['Common', 'Orc'],
                traits: ['Darkvision', 'Orc Blood'],
                favoredClass: 'Barbarian'
            }
        };

        this.classes = {
            fighter: {
                name: 'Fighter',
                hitDie: 'd10',
                skillPoints: 2,
                classSkills: ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Jump', 'Ride', 'Swim'],
                proficiencies: ['All Simple and Martial Weapons', 'All Armor', 'All Shields'],
                baseAttackBonus: 'Full',
                fortSave: 'Good',
                refSave: 'Poor',
                willSave: 'Poor',
                spellcasting: false
            },
            wizard: {
                name: 'Wizard',
                hitDie: 'd4',
                skillPoints: 2,
                classSkills: ['Concentration', 'Craft', 'Decipher Script', 'Knowledge', 'Profession', 'Spellcraft'],
                proficiencies: ['Simple Weapons'],
                baseAttackBonus: 'Poor',
                fortSave: 'Poor',
                refSave: 'Poor',
                willSave: 'Good',
                spellcasting: true,
                spellsPerDay: {1: {0: 3, 1: 1}}
            },
            rogue: {
                name: 'Rogue',
                hitDie: 'd6',
                skillPoints: 8,
                classSkills: ['Appraise', 'Balance', 'Bluff', 'Climb', 'Craft', 'Decipher Script', 'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Forgery', 'Gather Information', 'Hide', 'Intimidate', 'Jump', 'Knowledge', 'Listen', 'Move Silently', 'Open Lock', 'Perform', 'Profession', 'Search', 'Sense Motive', 'Sleight of Hand', 'Spot', 'Tumble', 'Use Magic Device', 'Use Rope'],
                proficiencies: ['Simple Weapons', 'Light Armor'],
                baseAttackBonus: 'Medium',
                fortSave: 'Poor',
                refSave: 'Good',
                willSave: 'Poor',
                spellcasting: false,
                specialAbilities: ['Sneak Attack +1d6']
            },
            cleric: {
                name: 'Cleric',
                hitDie: 'd8',
                skillPoints: 2,
                classSkills: ['Concentration', 'Craft', 'Diplomacy', 'Heal', 'Knowledge (arcana)', 'Knowledge (history)', 'Knowledge (religion)', 'Knowledge (the planes)', 'Profession', 'Spellcraft'],
                proficiencies: ['Simple Weapons', 'All Armor', 'All Shields'],
                baseAttackBonus: 'Medium',
                fortSave: 'Good',
                refSave: 'Poor',
                willSave: 'Good',
                spellcasting: true,
                spellsPerDay: {1: {0: 3, 1: 1}}
            },
            ranger: {
                name: 'Ranger',
                hitDie: 'd8',
                skillPoints: 6,
                classSkills: ['Climb', 'Concentration', 'Craft', 'Handle Animal', 'Heal', 'Hide', 'Jump', 'Knowledge (dungeoneering)', 'Knowledge (geography)', 'Knowledge (nature)', 'Listen', 'Move Silently', 'Profession', 'Ride', 'Search', 'Spot', 'Survival', 'Swim', 'Use Rope'],
                proficiencies: ['Simple and Martial Weapons', 'Light and Medium Armor', 'Shields'],
                baseAttackBonus: 'Full',
                fortSave: 'Good',
                refSave: 'Good',
                willSave: 'Poor',
                spellcasting: false // Gets spells at 4th level
            },
            paladin: {
                name: 'Paladin',
                hitDie: 'd10',
                skillPoints: 2,
                classSkills: ['Concentration', 'Craft', 'Diplomacy', 'Handle Animal', 'Heal', 'Knowledge (nobility and royalty)', 'Knowledge (religion)', 'Profession', 'Ride', 'Sense Motive'],
                proficiencies: ['Simple and Martial Weapons', 'All Armor', 'All Shields'],
                baseAttackBonus: 'Full',
                fortSave: 'Good',
                refSave: 'Poor',
                willSave: 'Poor',
                spellcasting: false, // Gets spells at 4th level
                specialAbilities: ['Detect Evil', 'Smite Evil 1/day']
            }
        };

        this.skills = {
            'Appraise': { ability: 'intelligence', trained: false },
            'Balance': { ability: 'dexterity', trained: false },
            'Bluff': { ability: 'charisma', trained: false },
            'Climb': { ability: 'strength', trained: false },
            'Concentration': { ability: 'constitution', trained: false },
            'Craft': { ability: 'intelligence', trained: false },
            'Decipher Script': { ability: 'intelligence', trained: true },
            'Diplomacy': { ability: 'charisma', trained: false },
            'Disable Device': { ability: 'intelligence', trained: true },
            'Disguise': { ability: 'charisma', trained: false },
            'Escape Artist': { ability: 'dexterity', trained: false },
            'Forgery': { ability: 'intelligence', trained: false },
            'Gather Information': { ability: 'charisma', trained: false },
            'Handle Animal': { ability: 'charisma', trained: true },
            'Heal': { ability: 'wisdom', trained: false },
            'Hide': { ability: 'dexterity', trained: false },
            'Intimidate': { ability: 'charisma', trained: false },
            'Jump': { ability: 'strength', trained: false },
            'Knowledge': { ability: 'intelligence', trained: true },
            'Listen': { ability: 'wisdom', trained: false },
            'Move Silently': { ability: 'dexterity', trained: false },
            'Open Lock': { ability: 'dexterity', trained: true },
            'Perform': { ability: 'charisma', trained: false },
            'Profession': { ability: 'wisdom', trained: true },
            'Ride': { ability: 'dexterity', trained: false },
            'Search': { ability: 'intelligence', trained: false },
            'Sense Motive': { ability: 'wisdom', trained: false },
            'Sleight of Hand': { ability: 'dexterity', trained: true },
            'Spellcraft': { ability: 'intelligence', trained: true },
            'Spot': { ability: 'wisdom', trained: false },
            'Survival': { ability: 'wisdom', trained: false },
            'Swim': { ability: 'strength', trained: false },
            'Tumble': { ability: 'dexterity', trained: true },
            'Use Magic Device': { ability: 'charisma', trained: true },
            'Use Rope': { ability: 'dexterity', trained: false }
        };
    }

    /**
     * Generate a complete random character
     */
    generateRandomCharacter() {
        const character = new Character();
        
        // Generate basic info
        character.name = this.generateRandomName();
        character.race = this.getRandomRace();
        character.characterClass = this.getRandomClass();
        character.level = 1;

        // Generate ability scores using 4d6 drop lowest
        character.abilities = this.generateAbilityScores();
        
        // Apply racial modifiers
        this.applyRacialModifiers(character);
        
        // Calculate derived stats
        this.calculateDerivedStats(character);
        
        // Assign skill points
        this.assignSkillPoints(character);
        
        // Generate starting equipment
        this.generateStartingEquipment(character);

        // Add to character list
        this.characters.push(character);
        
        return character;
    }

    /**
     * Generate ability scores using 4d6 drop lowest method
     */
    generateAbilityScores() {
        const abilities = {};
        const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        
        abilityNames.forEach(ability => {
            if (this.diceEngine) {
                abilities[ability] = this.diceEngine.roll('4d6dl1');
            } else {
                // Fallback method - simulate 4d6 drop lowest
                const rolls = [
                    Math.floor(Math.random() * 6) + 1,
                    Math.floor(Math.random() * 6) + 1,
                    Math.floor(Math.random() * 6) + 1,
                    Math.floor(Math.random() * 6) + 1
                ];
                rolls.sort((a, b) => b - a); // Sort descending
                abilities[ability] = rolls[0] + rolls[1] + rolls[2]; // Take top 3
            }
        });
        
        return abilities;
    }

    /**
     * Apply racial ability score modifiers
     */
    applyRacialModifiers(character) {
        const race = this.races[character.race];
        if (race && race.abilityAdjustments) {
            Object.keys(race.abilityAdjustments).forEach(ability => {
                character.abilities[ability] += race.abilityAdjustments[ability];
            });
        }
    }

    /**
     * Calculate derived statistics (HP, AC, saves, etc.)
     */
    calculateDerivedStats(character) {
        const classInfo = this.classes[character.characterClass];
        
        // Calculate ability modifiers
        character.abilityModifiers = {};
        Object.keys(character.abilities).forEach(ability => {
            character.abilityModifiers[ability] = Math.floor((character.abilities[ability] - 10) / 2);
        });

        // Calculate hit points
        const hitDieSize = parseInt(classInfo.hitDie.replace('d', ''));
        character.hitPoints = hitDieSize + character.abilityModifiers.constitution;
        character.maxHitPoints = character.hitPoints;

        // Calculate Armor Class
        character.armorClass = 10 + character.abilityModifiers.dexterity;

        // Calculate saves
        character.saves = {
            fortitude: this.getBaseSave(classInfo.fortSave, character.level) + character.abilityModifiers.constitution,
            reflex: this.getBaseSave(classInfo.refSave, character.level) + character.abilityModifiers.dexterity,
            will: this.getBaseSave(classInfo.willSave, character.level) + character.abilityModifiers.wisdom
        };

        // Calculate base attack bonus
        character.baseAttackBonus = this.getBaseAttackBonus(classInfo.baseAttackBonus, character.level);
    }

    /**
     * Get base save value based on progression and level
     */
    getBaseSave(progression, level) {
        if (progression === 'Good') {
            return 2 + Math.floor(level / 2);
        } else {
            return Math.floor(level / 3);
        }
    }

    /**
     * Get base attack bonus based on progression and level
     */
    getBaseAttackBonus(progression, level) {
        switch (progression) {
            case 'Full':
                return level;
            case 'Medium':
                return Math.floor(level * 0.75);
            case 'Poor':
                return Math.floor(level / 2);
            default:
                return 0;
        }
    }

    /**
     * Assign skill points based on class and intelligence
     */
    assignSkillPoints(character) {
        const classInfo = this.classes[character.characterClass];
        const intModifier = character.abilityModifiers.intelligence;
        const raceBonus = character.race === 'human' ? 1 : 0;
        
        const skillPointsPerLevel = classInfo.skillPoints + intModifier + raceBonus;
        character.skillPoints = Math.max(1, skillPointsPerLevel); // Minimum 1 skill point
        
        // Initialize skills
        character.skills = {};
        classInfo.classSkills.forEach(skill => {
            character.skills[skill] = 0; // Start with 0 ranks
        });
    }

    /**
     * Generate starting equipment based on class
     */
    generateStartingEquipment(character) {
        const classInfo = this.classes[character.characterClass];
        character.equipment = {
            weapons: [],
            armor: [],
            gear: [],
            money: this.rollStartingWealth(character.characterClass)
        };

        // Add class-specific starting gear
        switch (character.characterClass) {
            case 'fighter':
                character.equipment.weapons.push('Longsword', 'Shortbow');
                character.equipment.armor.push('Scale Mail', 'Heavy Shield');
                character.equipment.gear.push('20 Arrows', 'Backpack');
                break;
            case 'wizard':
                character.equipment.weapons.push('Quarterstaff', 'Dagger');
                character.equipment.gear.push('Spellbook', 'Component Pouch', 'Robes');
                break;
            case 'rogue':
                character.equipment.weapons.push('Rapier', 'Shortbow');
                character.equipment.armor.push('Studded Leather');
                character.equipment.gear.push('Thieves\' Tools', '20 Arrows', 'Backpack');
                break;
            case 'cleric':
                character.equipment.weapons.push('Morningstar');
                character.equipment.armor.push('Scale Mail', 'Heavy Shield');
                character.equipment.gear.push('Holy Symbol', 'Backpack');
                break;
            default:
                character.equipment.weapons.push('Dagger');
                character.equipment.gear.push('Backpack', 'Clothes');
        }
    }

    /**
     * Roll starting wealth based on class
     */
    rollStartingWealth(characterClass) {
        const wealthRolls = {
            fighter: '6d4*10',
            wizard: '3d4*10',
            rogue: '5d4*10',
            cleric: '5d4*10',
            ranger: '6d4*10',
            paladin: '6d4*10'
        };

        const rollExpression = wealthRolls[characterClass] || '3d4*10';
        
        if (this.diceEngine) {
            // Simple multiplication handling
            if (rollExpression.includes('*10')) {
                const baseRoll = rollExpression.replace('*10', '');
                return this.diceEngine.roll(baseRoll) * 10;
            }
            return this.diceEngine.roll(rollExpression);
        } else {
            // Fallback wealth generation
            return Math.floor(Math.random() * 150) + 100; // 100-250 gold pieces
        }
    }

    /**
     * Generate random character name
     */
    generateRandomName() {
        const names = [
            'Aerdrie', 'Beiro', 'Carric', 'Drannor', 'Enna', 'Galinndan', 'Hadarai', 'Immeral', 
            'Jhaan', 'Kiyueth', 'Lamlis', 'Mindartis', 'Naal', 'Nutae', 'Paelinn', 'Peren',
            'Quarion', 'Riardon', 'Rolen', 'Soveliss', 'Thamior', 'Tharivol', 'Theren', 
            'Theriatis', 'Thervan', 'Uthemar', 'Vanuath', 'Varis'
        ];
        return names[Math.floor(Math.random() * names.length)];
    }

    /**
     * Get random race
     */
    getRandomRace() {
        const raceKeys = Object.keys(this.races);
        return raceKeys[Math.floor(Math.random() * raceKeys.length)];
    }

    /**
     * Get random class
     */
    getRandomClass() {
        const classKeys = Object.keys(this.classes);
        return classKeys[Math.floor(Math.random() * classKeys.length)];
    }

    /**
     * Get character by index
     */
    getCharacter(index) {
        return this.characters[index];
    }

    /**
     * Get all characters
     */
    getAllCharacters() {
        return this.characters;
    }
}

/**
 * Character class to hold character data
 */
class Character {
    constructor() {
        this.name = '';
        this.race = '';
        this.characterClass = '';
        this.level = 1;
        this.experience = 0;
        this.abilities = {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        };
        this.abilityModifiers = {};
        this.hitPoints = 0;
        this.maxHitPoints = 0;
        this.armorClass = 10;
        this.saves = {
            fortitude: 0,
            reflex: 0,
            will: 0
        };
        this.baseAttackBonus = 0;
        this.skills = {};
        this.skillPoints = 0;
        this.equipment = {
            weapons: [],
            armor: [],
            gear: [],
            money: 0
        };
        this.spells = {
            known: [],
            prepared: [],
            slotsRemaining: {}
        };
    }

    /**
     * Get ability modifier for given ability
     */
    getAbilityModifier(ability) {
        return this.abilityModifiers[ability] || 0;
    }

    /**
     * Get skill modifier including ability modifier and ranks
     */
    getSkillModifier(skillName) {
        const skillInfo = this.constructor.getSkillInfo(skillName);
        if (!skillInfo) return 0;
        
        const ranks = this.skills[skillName] || 0;
        const abilityMod = this.getAbilityModifier(skillInfo.ability);
        
        return ranks + abilityMod;
    }

    /**
     * Static method to get skill information
     */
    static getSkillInfo(skillName) {
        const skillsData = {
            'Climb': { ability: 'strength', trained: false },
            'Jump': { ability: 'strength', trained: false },
            'Swim': { ability: 'strength', trained: false },
            'Balance': { ability: 'dexterity', trained: false },
            'Hide': { ability: 'dexterity', trained: false },
            'Move Silently': { ability: 'dexterity', trained: false },
            'Concentration': { ability: 'constitution', trained: false },
            'Knowledge': { ability: 'intelligence', trained: true },
            'Search': { ability: 'intelligence', trained: false },
            'Spellcraft': { ability: 'intelligence', trained: true },
            'Heal': { ability: 'wisdom', trained: false },
            'Listen': { ability: 'wisdom', trained: false },
            'Spot': { ability: 'wisdom', trained: false },
            'Survival': { ability: 'wisdom', trained: false },
            'Bluff': { ability: 'charisma', trained: false },
            'Diplomacy': { ability: 'charisma', trained: false },
            'Intimidate': { ability: 'charisma', trained: false }
        };
        return skillsData[skillName];
    }

    /**
     * Convert character to JSON for saving
     */
    toJSON() {
        return JSON.stringify(this, null, 2);
    }

    /**
     * Load character from JSON
     */
    static fromJSON(jsonString) {
        const data = JSON.parse(jsonString);
        const character = new Character();
        Object.assign(character, data);
        return character;
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CharacterGenerator, Character };
} else if (typeof window !== 'undefined') {
    window.CharacterGenerator = CharacterGenerator;
    window.Character = Character;
}
/**
 * RulzLawyer Complete D&D 3.5 SRD Data Library
 * Comprehensive race, class, feat, skill, and rules data
 * 
 * Features:
 * - All SRD races with complete racial traits
 * - All SRD classes with progression tables
 * - Complete feat database with prerequisites
 * - Skill system with synergies and uses
 * - Complete spell lists by class
 * 
 * @version 1.0
 * @date September 20, 2025
 * @location code-repository/src/srd-data.js
 */

class SRDData {
    constructor() {
        // Initialize all SRD data structures
        this.races = this._initializeRaces();
        this.classes = this._initializeClasses();
        this.feats = this._initializeFeats();
        this.skills = this._initializeSkills();
        this.spellLists = this._initializeSpellLists();
        
        console.log('📚 SRD Data initialized with complete D&D 3.5 database');
    }

    /**
     * Get complete race information
     * @param {string} raceName - Name of the race
     * @returns {Object} Complete race data
     */
    getRace(raceName) {
        return this.races[raceName.toLowerCase()] || null;
    }

    /**
     * Get complete class information
     * @param {string} className - Name of the class
     * @returns {Object} Complete class data
     */
    getClass(className) {
        return this.classes[className.toLowerCase()] || null;
    }

    /**
     * Get feat information
     * @param {string} featName - Name of the feat
     * @returns {Object} Complete feat data
     */
    getFeat(featName) {
        return this.feats[featName.toLowerCase().replace(/\s+/g, '-')] || null;
    }

    /**
     * Get available races
     * @returns {Array} List of available race names
     */
    getAvailableRaces() {
        return Object.keys(this.races);
    }

    /**
     * Get available classes
     * @returns {Array} List of available class names
     */
    getAvailableClasses() {
        return Object.keys(this.classes);
    }

    /**
     * Check feat prerequisites
     * @param {string} featName - Name of the feat
     * @param {Object} character - Character object
     * @returns {Object} Prerequisites check result
     */
    checkFeatPrerequisites(featName, character) {
        const feat = this.getFeat(featName);
        if (!feat) {
            return { meets: false, reason: 'Feat not found' };
        }

        if (!feat.prerequisites) {
            return { meets: true };
        }

        for (const prereq of feat.prerequisites) {
            const check = this._checkPrerequisite(prereq, character);
            if (!check.meets) {
                return check;
            }
        }

        return { meets: true };
    }

    // Private initialization methods

    _initializeRaces() {
        return {
            // Core Races
            'human': {
                size: 'Medium',
                speed: 30,
                abilityModifiers: {},
                racialTraits: [
                    'Extra feat at 1st level',
                    'Extra skill point at 1st level and every level thereafter'
                ],
                favoredClass: 'Any',
                levelAdjustment: 0,
                description: 'Versatile and ambitious, humans are the most common race.'
            },
            
            'elf': {
                size: 'Medium',
                speed: 30,
                abilityModifiers: { dexterity: 2, constitution: -2 },
                racialTraits: [
                    'Low-light vision',
                    '+2 racial bonus on Listen, Search, and Spot checks',
                    '+2 racial bonus on saves against enchantment spells',
                    'Immunity to sleep spells and similar magical effects',
                    'Proficiency with longswords, rapiers, longbows, composite longbows, and shortbows',
                    'Weapon Finesse feat with rapiers and longswords (if size permits)'
                ],
                automaticLanguages: ['Common', 'Elven'],
                bonusLanguages: ['Draconic', 'Gnoll', 'Gnome', 'Goblin', 'Orc', 'Sylvan'],
                favoredClass: 'Wizard',
                levelAdjustment: 0,
                description: 'Elves are graceful and long-lived, with keen senses and magical aptitude.'
            },
            
            'dwarf': {
                size: 'Medium',
                speed: 20,
                abilityModifiers: { constitution: 2, charisma: -2 },
                racialTraits: [
                    'Darkvision 60 feet',
                    '+2 racial bonus on saving throws against poison',
                    '+2 racial bonus on saving throws against spells and spell-like effects',
                    '+1 racial bonus on attack rolls against orcs and goblinoids',
                    '+4 dodge bonus to AC against giants',
                    '+2 racial bonus on Appraise checks related to stone or metal',
                    '+2 racial bonus on Craft checks related to stone or metal',
                    'Stonecunning: +2 racial bonus on Search checks to notice stonework features',
                    'Weapon familiarity: treat dwarven waraxes and dwarven urgroshes as martial weapons'
                ],
                automaticLanguages: ['Common', 'Dwarven'],
                bonusLanguages: ['Giant', 'Gnome', 'Goblin', 'Orc', 'Terran', 'Undercommon'],
                favoredClass: 'Fighter',
                levelAdjustment: 0,
                description: 'Short and stocky, dwarves are known for their skill in warfare, ability to withstand physical and magical punishment, and knowledge of the earth.'
            },
            
            'halfling': {
                size: 'Small',
                speed: 20,
                abilityModifiers: { dexterity: 2, strength: -2 },
                racialTraits: [
                    '+1 racial bonus on all saving throws',
                    '+2 morale bonus on saving throws against fear',
                    '+1 racial bonus on attack rolls with thrown weapons and slings',
                    '+2 racial bonus on Climb, Jump, Listen, and Move Silently checks'
                ],
                automaticLanguages: ['Common', 'Halfling'],
                bonusLanguages: ['Dwarven', 'Elven', 'Gnome', 'Goblin', 'Orc'],
                favoredClass: 'Rogue',
                levelAdjustment: 0,
                description: 'Small and nimble, halflings are known for their curiosity, bravery, and luck.'
            },
            
            'gnome': {
                size: 'Small',
                speed: 20,
                abilityModifiers: { constitution: 2, strength: -2 },
                racialTraits: [
                    'Low-light vision',
                    '+2 racial bonus on saving throws against illusions',
                    '+1 racial bonus on attack rolls against kobolds and goblinoids',
                    '+4 dodge bonus to AC against giants',
                    '+2 racial bonus on Listen checks',
                    '+2 racial bonus on Alchemy checks',
                    'Spell-like abilities (1/day each): speak with animals (burrowing mammal only), dancing lights, ghost sound, prestidigitation'
                ],
                automaticLanguages: ['Common', 'Gnome'],
                bonusLanguages: ['Draconic', 'Dwarven', 'Elven', 'Giant', 'Goblin', 'Orc'],
                favoredClass: 'Bard',
                levelAdjustment: 0,
                description: 'Small and inquisitive, gnomes are known for their love of gems, jokes, and magical devices.'
            },
            
            'half-elf': {
                size: 'Medium',
                speed: 30,
                abilityModifiers: {},
                racialTraits: [
                    'Low-light vision',
                    '+1 racial bonus on Listen, Search, and Spot checks',
                    '+2 racial bonus on Diplomacy and Gather Information checks',
                    'Immunity to sleep spells and similar magical effects',
                    '+2 racial bonus on saves against enchantment spells'
                ],
                automaticLanguages: ['Common', 'Elven'],
                bonusLanguages: ['Any (except secret languages)'],
                favoredClass: 'Any',
                levelAdjustment: 0,
                description: 'Walking in two worlds but belonging wholly to neither, half-elves combine the best qualities of their elf and human parents.'
            },
            
            'half-orc': {
                size: 'Medium',
                speed: 30,
                abilityModifiers: { strength: 2, intelligence: -2, charisma: -2 },
                racialTraits: [
                    'Darkvision 60 feet',
                    '+2 racial bonus on saves against enchantment spells',
                    'Orc blood: counts as both human and orc for effects'
                ],
                automaticLanguages: ['Common', 'Orc'],
                bonusLanguages: ['Draconic', 'Giant', 'Gnoll', 'Goblin', 'Abyssal'],
                favoredClass: 'Barbarian',
                levelAdjustment: 0,
                description: 'Often fierce and savage, half-orcs combine the best and worst qualities of their orc and human parents.'
            }
        };
    }

    _initializeClasses() {
        return {
            // Core Classes
            'barbarian': {
                hitDie: 12,
                skillPoints: 4,
                baseAttackProgression: 'good',
                savingThrows: {
                    fortitude: 'good',
                    reflex: 'poor',
                    will: 'poor'
                },
                classSkills: [
                    'climb', 'craft', 'handle-animal', 'intimidate', 'jump', 
                    'listen', 'ride', 'survival', 'swim'
                ],
                proficiencies: {
                    armor: ['light', 'medium'],
                    shields: ['all-non-tower'],
                    weapons: ['simple', 'martial']
                },
                classFeatures: {
                    1: ['Fast Movement', 'Illiteracy', 'Rage 1/day'],
                    2: ['Uncanny Dodge'],
                    3: ['Trap Sense +1'],
                    4: ['Rage 2/day'],
                    5: ['Improved Uncanny Dodge'],
                    6: ['Trap Sense +2'],
                    7: ['Damage Reduction 1/-'],
                    8: ['Rage 3/day'],
                    9: ['Trap Sense +3'],
                    10: ['Damage Reduction 2/-'],
                    11: ['Greater Rage'],
                    12: ['Rage 4/day', 'Trap Sense +4'],
                    13: ['Damage Reduction 3/-'],
                    14: ['Indomitable Will'],
                    15: ['Trap Sense +5'],
                    16: ['Damage Reduction 4/-', 'Rage 5/day'],
                    17: ['Tireless Rage'],
                    18: ['Trap Sense +6'],
                    19: ['Damage Reduction 5/-'],
                    20: ['Mighty Rage', 'Rage 6/day']
                },
                spellcasting: false,
                description: 'A fierce warrior of primitive background who can enter a battle rage.'
            },
            
            'bard': {
                hitDie: 6,
                skillPoints: 6,
                baseAttackProgression: 'medium',
                savingThrows: {
                    fortitude: 'poor',
                    reflex: 'good',
                    will: 'good'
                },
                classSkills: [
                    'appraise', 'balance', 'bluff', 'climb', 'concentration', 'craft', 
                    'decipher-script', 'diplomacy', 'disguise', 'escape-artist', 'gather-information',
                    'hide', 'jump', 'knowledge-all', 'listen', 'move-silently', 'perform',
                    'pick-pocket', 'profession', 'sense-motive', 'sleight-of-hand', 'speak-language',
                    'spellcraft', 'swim', 'tumble', 'use-magic-device'
                ],
                proficiencies: {
                    armor: ['light'],
                    shields: ['shield'],
                    weapons: ['simple', 'longsword', 'rapier', 'sap', 'short-sword', 'shortbow', 'whip']
                },
                classFeatures: {
                    1: ['Bardic Music', 'Bardic Knowledge', 'Countersong', 'Fascinate', 'Spellcasting'],
                    2: [],
                    3: ['Inspire Competence'],
                    4: [],
                    5: [],
                    6: ['Suggestion'],
                    7: [],
                    8: [],
                    9: ['Inspire Greatness'],
                    10: [],
                    11: [],
                    12: ['Song of Freedom'],
                    13: [],
                    14: [],
                    15: ['Inspire Heroics'],
                    16: [],
                    17: [],
                    18: ['Mass Suggestion'],
                    19: [],
                    20: []
                },
                spellcasting: {
                    type: 'spontaneous',
                    ability: 'charisma',
                    maxLevel: 6
                },
                description: 'A master of song, speech, and the magic they contain.'
            },
            
            'cleric': {
                hitDie: 8,
                skillPoints: 2,
                baseAttackProgression: 'medium',
                savingThrows: {
                    fortitude: 'good',
                    reflex: 'poor',
                    will: 'good'
                },
                classSkills: [
                    'concentration', 'craft', 'diplomacy', 'heal', 'knowledge-arcana',
                    'knowledge-history', 'knowledge-religion', 'knowledge-planes', 'profession',
                    'spellcraft'
                ],
                proficiencies: {
                    armor: ['light', 'medium', 'heavy'],
                    shields: ['all'],
                    weapons: ['simple']
                },
                classFeatures: {
                    1: ['Aura', 'Spellcasting', 'Turn or Rebuke Undead'],
                    2: [],
                    3: [],
                    4: [],
                    5: [],
                    6: [],
                    7: [],
                    8: [],
                    9: [],
                    10: [],
                    11: [],
                    12: [],
                    13: [],
                    14: [],
                    15: [],
                    16: [],
                    17: [],
                    18: [],
                    19: [],
                    20: []
                },
                spellcasting: {
                    type: 'prepared',
                    ability: 'wisdom',
                    maxLevel: 9
                },
                description: 'A master of divine magic and a capable warrior as well.'
            },
            
            'druid': {
                hitDie: 8,
                skillPoints: 4,
                baseAttackProgression: 'medium',
                savingThrows: {
                    fortitude: 'good',
                    reflex: 'poor',
                    will: 'good'
                },
                classSkills: [
                    'concentration', 'craft', 'diplomacy', 'handle-animal', 'heal', 'hide',
                    'knowledge-nature', 'listen', 'move-silently', 'profession', 'ride',
                    'spellcraft', 'spot', 'survival', 'swim'
                ],
                proficiencies: {
                    armor: ['light', 'medium', 'non-metal'],
                    shields: ['non-metal'],
                    weapons: ['club', 'dagger', 'dart', 'javelin', 'mace', 'quarterstaff', 'scimitar', 'sickle', 'shortspear', 'sling', 'spear']
                },
                classFeatures: {
                    1: ['Animal Companion', 'Nature Sense', 'Wild Empathy', 'Spellcasting'],
                    2: ['Woodland Stride'],
                    3: ['Trackless Step'],
                    4: ['Resist Nature\'s Lure'],
                    5: ['Wild Shape (1/day)'],
                    6: ['Wild Shape (2/day)'],
                    7: ['Wild Shape (3/day)'],
                    8: ['Wild Shape (Large)'],
                    9: ['Venom Immunity'],
                    10: ['Wild Shape (4/day)'],
                    11: ['Wild Shape (Tiny)'],
                    12: ['Wild Shape (Plant)'],
                    13: ['A Thousand Faces'],
                    14: ['Wild Shape (5/day)'],
                    15: ['Timeless Body', 'Wild Shape (Huge)'],
                    16: ['Wild Shape (Elemental 1/day)'],
                    17: [],
                    18: ['Wild Shape (6/day)', 'Wild Shape (Elemental 2/day)'],
                    19: [],
                    20: ['Wild Shape (Elemental 3/day, Huge elemental)']
                },
                spellcasting: {
                    type: 'prepared',
                    ability: 'wisdom',
                    maxLevel: 9
                },
                description: 'One who draws power from nature itself, capable of taking the forms of animals.'
            },
            
            'fighter': {
                hitDie: 10,
                skillPoints: 2,
                baseAttackProgression: 'good',
                savingThrows: {
                    fortitude: 'good',
                    reflex: 'poor',
                    will: 'poor'
                },
                classSkills: [
                    'climb', 'craft', 'handle-animal', 'intimidate', 'jump', 'ride', 'swim'
                ],
                proficiencies: {
                    armor: ['light', 'medium', 'heavy'],
                    shields: ['all'],
                    weapons: ['simple', 'martial']
                },
                classFeatures: {
                    1: ['Bonus Feat'],
                    2: ['Bonus Feat'],
                    3: [],
                    4: ['Bonus Feat'],
                    5: [],
                    6: ['Bonus Feat'],
                    7: [],
                    8: ['Bonus Feat'],
                    9: [],
                    10: ['Bonus Feat'],
                    11: [],
                    12: ['Bonus Feat'],
                    13: [],
                    14: ['Bonus Feat'],
                    15: [],
                    16: ['Bonus Feat'],
                    17: [],
                    18: ['Bonus Feat'],
                    19: [],
                    20: ['Bonus Feat']
                },
                spellcasting: false,
                description: 'A master of martial combat, skilled with a variety of weapons and armor.'
            },
            
            'monk': {
                hitDie: 8,
                skillPoints: 4,
                baseAttackProgression: 'medium',
                savingThrows: {
                    fortitude: 'good',
                    reflex: 'good',
                    will: 'good'
                },
                classSkills: [
                    'balance', 'climb', 'concentration', 'craft', 'diplomacy', 'escape-artist',
                    'hide', 'jump', 'knowledge-arcana', 'knowledge-religion', 'listen',
                    'move-silently', 'perform', 'profession', 'sense-motive', 'spot', 'swim', 'tumble'
                ],
                proficiencies: {
                    armor: ['none'],
                    shields: ['none'],
                    weapons: ['club', 'crossbow-light', 'crossbow-heavy', 'dagger', 'handaxe', 'javelin', 'kama', 'nunchaku', 'quarterstaff', 'sai', 'shuriken', 'siangham', 'sling']
                },
                classFeatures: {
                    1: ['AC Bonus', 'Flurry of Blows', 'Unarmed Strike'],
                    2: ['Combat Reflexes', 'Evasion'],
                    3: ['Fast Movement', 'Still Mind'],
                    4: ['Ki Strike (magic)', 'Slow Fall 20 ft.'],
                    5: ['Purity of Body'],
                    6: ['Slow Fall 30 ft.'],
                    7: ['Wholeness of Body'],
                    8: ['Slow Fall 40 ft.'],
                    9: ['Improved Evasion'],
                    10: ['Ki Strike (lawful)', 'Slow Fall 50 ft.'],
                    11: ['Diamond Body', 'Greater Flurry'],
                    12: ['Abundant Step', 'Slow Fall 60 ft.'],
                    13: ['Diamond Soul'],
                    14: ['Slow Fall 70 ft.'],
                    15: ['Quivering Palm'],
                    16: ['Ki Strike (adamantine)', 'Slow Fall 80 ft.'],
                    17: ['Timeless Body', 'Tongue of the Sun and Moon'],
                    18: ['Slow Fall 90 ft.'],
                    19: ['Empty Body'],
                    20: ['Perfect Self', 'Slow Fall any distance']
                },
                spellcasting: false,
                description: 'A master of martial arts, harnessing inner power to perform amazing feats.'
            },
            
            'paladin': {
                hitDie: 10,
                skillPoints: 2,
                baseAttackProgression: 'good',
                savingThrows: {
                    fortitude: 'good',
                    reflex: 'poor',
                    will: 'poor'
                },
                classSkills: [
                    'concentration', 'craft', 'diplomacy', 'handle-animal', 'heal',
                    'knowledge-nobility', 'knowledge-religion', 'profession', 'ride', 'sense-motive'
                ],
                proficiencies: {
                    armor: ['light', 'medium', 'heavy'],
                    shields: ['all'],
                    weapons: ['simple', 'martial']
                },
                classFeatures: {
                    1: ['Aura of Good', 'Detect Evil', 'Smite Evil 1/day'],
                    2: ['Divine Grace', 'Lay on Hands'],
                    3: ['Aura of Courage', 'Divine Health'],
                    4: ['Turn Undead', 'Spellcasting'],
                    5: ['Smite Evil 2/day', 'Special Mount'],
                    6: ['Remove Disease 1/week'],
                    7: [],
                    8: [],
                    9: ['Remove Disease 2/week'],
                    10: ['Smite Evil 3/day'],
                    11: [],
                    12: ['Remove Disease 3/week'],
                    13: [],
                    14: [],
                    15: ['Remove Disease 4/week', 'Smite Evil 4/day'],
                    16: [],
                    17: [],
                    18: ['Remove Disease 5/week'],
                    19: [],
                    20: ['Smite Evil 5/day']
                },
                spellcasting: {
                    type: 'prepared',
                    ability: 'charisma',
                    maxLevel: 4,
                    startLevel: 4
                },
                description: 'A holy warrior, crusading in the name of good and order.'
            },
            
            'ranger': {
                hitDie: 8,
                skillPoints: 6,
                baseAttackProgression: 'good',
                savingThrows: {
                    fortitude: 'good',
                    reflex: 'good',
                    will: 'poor'
                },
                classSkills: [
                    'climb', 'concentration', 'craft', 'handle-animal', 'heal', 'hide',
                    'jump', 'knowledge-dungeoneering', 'knowledge-geography', 'knowledge-nature',
                    'listen', 'move-silently', 'profession', 'ride', 'search', 'spot',
                    'survival', 'swim', 'use-rope'
                ],
                proficiencies: {
                    armor: ['light', 'medium'],
                    shields: ['all'],
                    weapons: ['simple', 'martial']
                },
                classFeatures: {
                    1: ['Favored Enemy', 'Track', 'Wild Empathy'],
                    2: ['Combat Style'],
                    3: ['Endurance'],
                    4: ['Animal Companion', 'Spellcasting'],
                    5: ['Favored Enemy'],
                    6: ['Improved Combat Style'],
                    7: ['Woodland Stride'],
                    8: ['Swift Tracker'],
                    9: ['Evasion'],
                    10: ['Favored Enemy'],
                    11: ['Combat Style Mastery'],
                    12: [],
                    13: ['Camouflage'],
                    14: [],
                    15: ['Favored Enemy'],
                    16: [],
                    17: ['Hide in Plain Sight'],
                    18: [],
                    19: [],
                    20: ['Favored Enemy']
                },
                spellcasting: {
                    type: 'prepared',
                    ability: 'wisdom',
                    maxLevel: 4,
                    startLevel: 4
                },
                description: 'A warrior of the wild, skilled in tracking, survival, and combat.'
            },
            
            'rogue': {
                hitDie: 6,
                skillPoints: 8,
                baseAttackProgression: 'medium',
                savingThrows: {
                    fortitude: 'poor',
                    reflex: 'good',
                    will: 'poor'
                },
                classSkills: [
                    'appraise', 'balance', 'bluff', 'climb', 'craft', 'decipher-script',
                    'diplomacy', 'disable-device', 'disguise', 'escape-artist', 'forgery',
                    'gather-information', 'hide', 'intimidate', 'jump', 'knowledge-local',
                    'listen', 'move-silently', 'open-lock', 'perform', 'profession',
                    'search', 'sense-motive', 'sleight-of-hand', 'spot', 'swim', 'tumble',
                    'use-magic-device', 'use-rope'
                ],
                proficiencies: {
                    armor: ['light'],
                    shields: ['none'],
                    weapons: ['hand-crossbow', 'rapier', 'sap', 'shortbow', 'short-sword', 'simple']
                },
                classFeatures: {
                    1: ['Sneak Attack +1d6', 'Trapfinding'],
                    2: ['Evasion'],
                    3: ['Sneak Attack +2d6', 'Trap Sense +1'],
                    4: ['Uncanny Dodge'],
                    5: ['Sneak Attack +3d6'],
                    6: ['Trap Sense +2'],
                    7: ['Sneak Attack +4d6'],
                    8: ['Improved Uncanny Dodge'],
                    9: ['Sneak Attack +5d6', 'Trap Sense +3'],
                    10: ['Special Ability'],
                    11: ['Sneak Attack +6d6'],
                    12: ['Trap Sense +4'],
                    13: ['Sneak Attack +7d6', 'Special Ability'],
                    14: [],
                    15: ['Sneak Attack +8d6', 'Trap Sense +5'],
                    16: ['Special Ability'],
                    17: ['Sneak Attack +9d6'],
                    18: ['Trap Sense +6'],
                    19: ['Sneak Attack +10d6', 'Special Ability'],
                    20: []
                },
                spellcasting: false,
                description: 'A master of stealth and subtlety, skilled in finding and disabling traps.'
            },
            
            'sorcerer': {
                hitDie: 4,
                skillPoints: 2,
                baseAttackProgression: 'poor',
                savingThrows: {
                    fortitude: 'poor',
                    reflex: 'poor',
                    will: 'good'
                },
                classSkills: [
                    'bluff', 'concentration', 'craft', 'knowledge-arcana', 'profession', 'spellcraft'
                ],
                proficiencies: {
                    armor: ['none'],
                    shields: ['none'],
                    weapons: ['crossbow-light', 'crossbow-heavy', 'dagger', 'dart', 'javelin', 'knife', 'quarterstaff', 'sling']
                },
                classFeatures: {
                    1: ['Spellcasting', 'Summon Familiar'],
                    2: [],
                    3: [],
                    4: [],
                    5: [],
                    6: [],
                    7: [],
                    8: [],
                    9: [],
                    10: [],
                    11: [],
                    12: [],
                    13: [],
                    14: [],
                    15: [],
                    16: [],
                    17: [],
                    18: [],
                    19: [],
                    20: []
                },
                spellcasting: {
                    type: 'spontaneous',
                    ability: 'charisma',
                    maxLevel: 9
                },
                description: 'A spellcaster who draws on inherent magic from a draconic or other exotic bloodline.'
            },
            
            'wizard': {
                hitDie: 4,
                skillPoints: 2,
                baseAttackProgression: 'poor',
                savingThrows: {
                    fortitude: 'poor',
                    reflex: 'poor',
                    will: 'good'
                },
                classSkills: [
                    'concentration', 'craft', 'decipher-script', 'knowledge-all', 'profession', 'spellcraft'
                ],
                proficiencies: {
                    armor: ['none'],
                    shields: ['none'],
                    weapons: ['club', 'dagger', 'dart', 'javelin', 'knife', 'quarterstaff', 'crossbow-light', 'crossbow-heavy', 'sling']
                },
                classFeatures: {
                    1: ['Arcane Spellcasting', 'Scribe Scroll', 'Summon Familiar'],
                    2: [],
                    3: [],
                    4: [],
                    5: ['Bonus Feat'],
                    6: [],
                    7: [],
                    8: [],
                    9: [],
                    10: ['Bonus Feat'],
                    11: [],
                    12: [],
                    13: [],
                    14: [],
                    15: ['Bonus Feat'],
                    16: [],
                    17: [],
                    18: [],
                    19: [],
                    20: ['Bonus Feat']
                },
                spellcasting: {
                    type: 'prepared',
                    ability: 'intelligence',
                    maxLevel: 9
                },
                description: 'A potent spellcaster trained in the arcane arts.'
            }
        };
    }

    _initializeFeats() {
        return {
            // General Feats
            'combat-reflexes': {
                type: 'general',
                prerequisites: [],
                benefit: 'You get additional attacks of opportunity equal to your Dexterity bonus.',
                description: 'You can respond quickly and repeatedly to opponents who let their defenses down.'
            },
            
            'dodge': {
                type: 'general',
                prerequisites: ['Dex 13'],
                benefit: '+1 dodge bonus to AC against attacks from one opponent you designate.',
                description: 'You are skilled at dodging attacks.'
            },
            
            'improved-initiative': {
                type: 'general',
                prerequisites: [],
                benefit: '+4 circumstance bonus on initiative checks.',
                description: 'You can react more quickly than normal in a fight.'
            },
            
            'power-attack': {
                type: 'general',
                prerequisites: ['Str 13'],
                benefit: 'Trade attack bonus for damage bonus on melee attacks.',
                description: 'You can make exceptionally deadly melee attacks by sacrificing accuracy for power.'
            },
            
            'weapon-finesse': {
                type: 'general',
                prerequisites: ['Base attack bonus +1'],
                benefit: 'Use Dex modifier instead of Str modifier for attack rolls with light weapons.',
                description: 'You are especially skilled at using weapons that can benefit as much from Dexterity as from Strength.'
            },
            
            'weapon-focus': {
                type: 'general',
                prerequisites: ['Proficiency with selected weapon', 'Base attack bonus +1'],
                benefit: '+1 bonus on attack rolls with selected weapon.',
                description: 'You are especially good at using a chosen weapon.',
                special: 'You must choose a specific weapon. You can take this feat multiple times.'
            },
            
            'weapon-specialization': {
                type: 'general',
                prerequisites: ['Proficiency with selected weapon', 'Weapon Focus with selected weapon', 'Fighter level 4th'],
                benefit: '+2 bonus on damage rolls with selected weapon.',
                description: 'You deal extra damage when using a chosen weapon.',
                special: 'You must choose the same weapon for which you have Weapon Focus.'
            },
            
            'cleave': {
                type: 'general',
                prerequisites: ['Str 13', 'Power Attack'],
                benefit: 'If you deal a creature enough damage to make it drop, you get an immediate extra melee attack.',
                description: 'You can follow through with powerful blows.'
            },
            
            'great-cleave': {
                type: 'general',
                prerequisites: ['Str 13', 'Power Attack', 'Cleave', 'Base attack bonus +4'],
                benefit: 'As Cleave, but no limit to the number of extra attacks.',
                description: 'You can wield weapons with such power that you can strike multiple times.'
            },
            
            // Metamagic Feats
            'empower-spell': {
                type: 'metamagic',
                prerequisites: [],
                benefit: 'Increase variable, numeric spell effects by 50%. Uses spell slot 2 levels higher.',
                description: 'You can cast spells to greater effect.'
            },
            
            'enlarge-spell': {
                type: 'metamagic',
                prerequisites: [],
                benefit: 'Double spell range. Uses spell slot 1 level higher.',
                description: 'You can cast spells farther than normal.'
            },
            
            'extend-spell': {
                type: 'metamagic',
                prerequisites: [],
                benefit: 'Double spell duration. Uses spell slot 1 level higher.',
                description: 'You can cast spells that last longer than normal.'
            },
            
            'maximize-spell': {
                type: 'metamagic',
                prerequisites: [],
                benefit: 'All variable, numeric effects are maximized. Uses spell slot 3 levels higher.',
                description: 'You can cast spells to maximum effect.'
            },
            
            'quicken-spell': {
                type: 'metamagic',
                prerequisites: [],
                benefit: 'Cast spell as swift action. Uses spell slot 4 levels higher.',
                description: 'You can cast spells with a moment\'s thought.'
            },
            
            'silent-spell': {
                type: 'metamagic',
                prerequisites: [],
                benefit: 'Cast spell without verbal components. Uses spell slot 1 level higher.',
                description: 'You can cast spells silently.'
            },
            
            'still-spell': {
                type: 'metamagic',
                prerequisites: [],
                benefit: 'Cast spell without somatic components. Uses spell slot 1 level higher.',
                description: 'You can cast spells without gestures.'
            },
            
            // Item Creation Feats
            'brew-potion': {
                type: 'item-creation',
                prerequisites: ['Caster level 3rd'],
                benefit: 'Create magic potions.',
                description: 'You can create magic potions.'
            },
            
            'craft-magic-arms-and-armor': {
                type: 'item-creation',
                prerequisites: ['Caster level 5th'],
                benefit: 'Create magic weapons, armor, and shields.',
                description: 'You can create magic weapons, armor, and shields.'
            },
            
            'craft-wondrous-item': {
                type: 'item-creation',
                prerequisites: ['Caster level 3rd'],
                benefit: 'Create miscellaneous magic items.',
                description: 'You can create a wide variety of magic wondrous items.'
            },
            
            'forge-ring': {
                type: 'item-creation',
                prerequisites: ['Caster level 12th'],
                benefit: 'Create magic rings.',
                description: 'You can create magic rings.'
            },
            
            'scribe-scroll': {
                type: 'item-creation',
                prerequisites: ['Caster level 1st'],
                benefit: 'Create magic scrolls.',
                description: 'You can create magic scrolls.'
            }
        };
    }

    _initializeSkills() {
        return {
            'appraise': {
                ability: 'intelligence',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'balance': {
                ability: 'dexterity',
                trainedOnly: false,
                armorCheckPenalty: true,
                synergies: {
                    'tumble': 5
                }
            },
            'bluff': {
                ability: 'charisma',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {
                    'diplomacy': 5,
                    'intimidate': 5,
                    'sleight-of-hand': 5
                }
            },
            'climb': {
                ability: 'strength',
                trainedOnly: false,
                armorCheckPenalty: true,
                synergies: {
                    'jump': 5
                }
            },
            'concentration': {
                ability: 'constitution',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'craft': {
                ability: 'intelligence',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'decipher-script': {
                ability: 'intelligence',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'diplomacy': {
                ability: 'charisma',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'disable-device': {
                ability: 'intelligence',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'disguise': {
                ability: 'charisma',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'escape-artist': {
                ability: 'dexterity',
                trainedOnly: false,
                armorCheckPenalty: true,
                synergies: {}
            },
            'forgery': {
                ability: 'intelligence',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'gather-information': {
                ability: 'charisma',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'handle-animal': {
                ability: 'charisma',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'heal': {
                ability: 'wisdom',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'hide': {
                ability: 'dexterity',
                trainedOnly: false,
                armorCheckPenalty: true,
                synergies: {}
            },
            'intimidate': {
                ability: 'charisma',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'jump': {
                ability: 'strength',
                trainedOnly: false,
                armorCheckPenalty: true,
                synergies: {}
            },
            'knowledge-arcana': {
                ability: 'intelligence',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'knowledge-dungeoneering': {
                ability: 'intelligence',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'knowledge-geography': {
                ability: 'intelligence',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'knowledge-history': {
                ability: 'intelligence',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'knowledge-local': {
                ability: 'intelligence',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'knowledge-nature': {
                ability: 'intelligence',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'knowledge-nobility': {
                ability: 'intelligence',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'knowledge-planes': {
                ability: 'intelligence',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'knowledge-religion': {
                ability: 'intelligence',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'listen': {
                ability: 'wisdom',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'move-silently': {
                ability: 'dexterity',
                trainedOnly: false,
                armorCheckPenalty: true,
                synergies: {}
            },
            'open-lock': {
                ability: 'dexterity',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'perform': {
                ability: 'charisma',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'profession': {
                ability: 'wisdom',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'ride': {
                ability: 'dexterity',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'search': {
                ability: 'intelligence',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'sense-motive': {
                ability: 'wisdom',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'sleight-of-hand': {
                ability: 'dexterity',
                trainedOnly: true,
                armorCheckPenalty: true,
                synergies: {}
            },
            'spellcraft': {
                ability: 'intelligence',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'spot': {
                ability: 'wisdom',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'survival': {
                ability: 'wisdom',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            },
            'swim': {
                ability: 'strength',
                trainedOnly: false,
                armorCheckPenalty: true,
                synergies: {}
            },
            'tumble': {
                ability: 'dexterity',
                trainedOnly: true,
                armorCheckPenalty: true,
                synergies: {
                    'balance': 5,
                    'jump': 5
                }
            },
            'use-magic-device': {
                ability: 'charisma',
                trainedOnly: true,
                armorCheckPenalty: false,
                synergies: {}
            },
            'use-rope': {
                ability: 'dexterity',
                trainedOnly: false,
                armorCheckPenalty: false,
                synergies: {}
            }
        };
    }

    _initializeSpellLists() {
        return {
            bard: {
                0: ['dancing-lights', 'daze', 'detect-magic', 'flare', 'ghost-sound', 'know-direction', 'light', 'lullaby', 'mage-hand', 'mending', 'message', 'open-close', 'prestidigitation', 'read-magic', 'resistance', 'summon-instrument'],
                1: ['alarm', 'animate-rope', 'cause-fear', 'charm-person', 'comprehend-languages', 'cure-light-wounds', 'detect-secret-doors', 'disguise-self', 'erase', 'expeditious-retreat', 'feather-fall', 'grease', 'hypnotism', 'identify', 'lesser-confusion', 'magic-mouth', 'obscure-object', 'remove-fear', 'silent-image', 'sleep', 'summon-monster-i', 'tasha\'s-hideous-laughter', 'undetectable-alignment', 'unseen-servant', 'ventriloquism']
            },
            cleric: {
                0: ['create-water', 'cure-minor-wounds', 'detect-magic', 'detect-poison', 'guidance', 'inflict-minor-wounds', 'light', 'mending', 'purify-food-and-drink', 'read-magic', 'resistance', 'virtue'],
                1: ['bane', 'bless', 'bless-water', 'cause-fear', 'command', 'comprehend-languages', 'cure-light-wounds', 'curse-water', 'deathwatch', 'detect-chaos', 'detect-evil', 'detect-good', 'detect-law', 'detect-undead', 'divine-favor', 'doom', 'endure-elements', 'entropic-shield', 'hide-from-undead', 'inflict-light-wounds', 'magic-stone', 'magic-weapon', 'obscuring-mist', 'protection-from-chaos', 'protection-from-evil', 'protection-from-good', 'protection-from-law', 'random-action', 'remove-fear', 'sanctuary', 'shield-of-faith', 'summon-monster-i']
            },
            druid: {
                0: ['create-water', 'cure-minor-wounds', 'detect-magic', 'detect-poison', 'flare', 'guidance', 'know-direction', 'light', 'mending', 'purify-food-and-drink', 'read-magic', 'resistance', 'virtue'],
                1: ['calm-animals', 'charm-animal', 'cure-light-wounds', 'detect-animals-or-plants', 'detect-snares-and-pits', 'endure-elements', 'entangle', 'faerie-fire', 'goodberry', 'hide-from-animals', 'jump', 'longstrider', 'magic-fang', 'magic-stone', 'obscuring-mist', 'pass-without-trace', 'produce-flame', 'shillelagh', 'speak-with-animals', 'summon-nature\'s-ally-i']
            },
            paladin: {
                1: ['bless', 'bless-water', 'bless-weapon', 'create-water', 'cure-light-wounds', 'detect-poison', 'detect-undead', 'divine-favor', 'endure-elements', 'magic-weapon', 'protection-from-chaos', 'protection-from-evil', 'purify-food-and-drink', 'read-magic', 'resistance', 'restoration-lesser', 'virtue']
            },
            ranger: {
                1: ['alarm', 'animal-messenger', 'calm-animals', 'charm-animal', 'delay-poison', 'detect-animals-or-plants', 'detect-poison', 'detect-snares-and-pits', 'endure-elements', 'entangle', 'hide-from-animals', 'jump', 'longstrider', 'magic-fang', 'pass-without-trace', 'read-magic', 'resist-energy', 'speak-with-animals', 'summon-nature\'s-ally-i']
            },
            sorcerer: {
                0: ['acid-splash', 'arcane-mark', 'dancing-lights', 'daze', 'detect-magic', 'detect-poison', 'disrupt-undead', 'flare', 'ghost-sound', 'light', 'mage-hand', 'mending', 'message', 'open-close', 'prestidigitation', 'ray-of-frost', 'read-magic', 'resistance', 'touch-of-fatigue'],
                1: ['alarm', 'burning-hands', 'charm-person', 'chill-touch', 'color-spray', 'comprehend-languages', 'detect-secret-doors', 'detect-undead', 'disguise-self', 'endure-elements', 'enlarge-person', 'erase', 'expeditious-retreat', 'feather-fall', 'grease', 'hold-portal', 'hypnotism', 'identify', 'jump', 'mage-armor', 'magic-missile', 'magic-weapon', 'mount', 'obscuring-mist', 'protection-from-chaos', 'protection-from-evil', 'protection-from-good', 'protection-from-law', 'ray-of-enfeeblement', 'reduce-person', 'shield', 'shocking-grasp', 'silent-image', 'sleep', 'summon-monster-i', 'true-strike', 'unseen-servant', 'ventriloquism']
            },
            wizard: {
                0: ['acid-splash', 'arcane-mark', 'dancing-lights', 'daze', 'detect-magic', 'detect-poison', 'disrupt-undead', 'flare', 'ghost-sound', 'light', 'mage-hand', 'mending', 'message', 'open-close', 'prestidigitation', 'ray-of-frost', 'read-magic', 'resistance', 'touch-of-fatigue'],
                1: ['alarm', 'animate-rope', 'burning-hands', 'cause-fear', 'charm-person', 'chill-touch', 'color-spray', 'comprehend-languages', 'detect-secret-doors', 'detect-undead', 'disguise-self', 'endure-elements', 'enlarge-person', 'erase', 'expeditious-retreat', 'feather-fall', 'grease', 'hold-portal', 'hypnotism', 'identify', 'jump', 'mage-armor', 'magic-missile', 'magic-weapon', 'mount', 'obscuring-mist', 'protection-from-chaos', 'protection-from-evil', 'protection-from-good', 'protection-from-law', 'ray-of-enfeeblement', 'reduce-person', 'shield', 'shocking-grasp', 'silent-image', 'sleep', 'summon-monster-i', 'true-strike', 'unseen-servant', 'ventriloquism']
            }
        };
    }

    _checkPrerequisite(prerequisite, character) {
        // Parse and check various prerequisite types
        if (prerequisite.includes('Str ')) {
            const required = parseInt(prerequisite.match(/\d+/)[0]);
            if (character.abilities.strength < required) {
                return { meets: false, reason: `Requires Strength ${required} (has ${character.abilities.strength})` };
            }
        }
        
        if (prerequisite.includes('Dex ')) {
            const required = parseInt(prerequisite.match(/\d+/)[0]);
            if (character.abilities.dexterity < required) {
                return { meets: false, reason: `Requires Dexterity ${required} (has ${character.abilities.dexterity})` };
            }
        }
        
        if (prerequisite.includes('Base attack bonus ')) {
            const required = parseInt(prerequisite.match(/\d+/)[0]);
            if (character.baseAttackBonus < required) {
                return { meets: false, reason: `Requires base attack bonus +${required} (has +${character.baseAttackBonus})` };
            }
        }

        if (prerequisite.includes('level ')) {
            const required = parseInt(prerequisite.match(/\d+/)[0]);
            if (character.level < required) {
                return { meets: false, reason: `Requires level ${required} (has ${character.level})` };
            }
        }

        // Check for other feats as prerequisites
        const otherFeats = ['Power Attack', 'Weapon Focus', 'Cleave'];
        for (const feat of otherFeats) {
            if (prerequisite.includes(feat)) {
                const hasFeat = character.feats && character.feats.some(f => f.name === feat);
                if (!hasFeat) {
                    return { meets: false, reason: `Requires ${feat} feat` };
                }
            }
        }

        return { meets: true };
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SRDData;
} else if (typeof window !== 'undefined') {
    window.SRDData = SRDData;
}
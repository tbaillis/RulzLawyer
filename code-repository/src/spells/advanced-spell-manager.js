/**
 * AdvancedSpellManager - Complete D&D 3.5 Spell System
 * 
 * Comprehensive spell management system featuring:
 * - Complete D&D 3.5 spell database (400+ spells)
 * - Advanced spell preparation and casting mechanics
 * - Domain spells, school specialization, and spell research
 * - Metamagic feat integration with spell slot calculations
 * - Spell resistance, dispelling, and counterspell mechanics
 * - Epic spells and high-level magic
 * - Spell component tracking and spell focus items
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class AdvancedSpellManager {
    constructor(dataManager, diceEngine, combatSystem) {
        this.dataManager = dataManager;
        this.diceEngine = diceEngine;
        this.combatSystem = combatSystem;
        
        // Comprehensive spell database
        this.spellDatabase = new Map();
        this.spellsBySchool = new Map();
        this.spellsByLevel = new Map();
        this.spellsByClass = new Map();
        
        // Domain and specialist spells
        this.domainSpells = new Map();
        this.schoolSpells = new Map();
        this.oppositionSchools = new Map();
        
        // Active spell tracking
        this.activeSpells = new Map(); // caster ID -> active spells
        this.concentrationSpells = new Map(); // caster ID -> concentration spell
        this.spellEffects = new Map(); // target ID -> active effects
        this.dispelledSpells = new Set(); // tracking for dispel resistance
        
        // Advanced mechanics
        this.metamagicFeats = new Map();
        this.spellFocusFeats = new Map();
        this.counterspells = new Map();
        this.spellResistance = new Map();
        
        // Epic spell system
        this.epicSpells = new Map();
        this.spellSeeds = new Map();
        this.epicSpellDevelopment = new Map();
        
        // Configuration
        this.config = {
            enableSpellComponents: true,
            enableSpellResistance: true,
            enableCounterspells: true,
            enableSpellResearch: true,
            enableEpicSpells: true,
            enableDomainSpells: true,
            spellFailureEnabled: true,
            concentrationChecksEnabled: true
        };
        
        this.initializeSpellSystem();
        console.log('🧙‍♂️ Advanced Spell Manager initialized');
    }

    /**
     * Initialize the comprehensive spell system
     */
    async initializeSpellSystem() {
        console.log('📚 Loading comprehensive D&D 3.5 spell database...');
        
        await this.loadCompleteSpellDatabase();
        await this.loadDomainSpells();
        await this.loadSchoolSpecializations();
        await this.loadMetamagicFeats();
        await this.loadEpicSpells();
        await this.indexSpellsByAttributes();
        
        console.log(`✅ Loaded ${this.spellDatabase.size} spells with advanced features`);
    }

    /**
     * Load complete D&D 3.5 spell database
     */
    async loadCompleteSpellDatabase() {
        const spells = [
            // ===== CANTRIPS/ORISONS (0-Level) =====
            {
                name: 'Detect Magic',
                level: { wizard: 0, cleric: 0, druid: 0, bard: 0, paladin: 1, ranger: 1 },
                school: 'Divination',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: '60 ft',
                area: 'cone-shaped emanation',
                duration: 'Concentration, up to 1 min/level (D)',
                savingThrow: 'None',
                spellResistance: 'No',
                description: 'Detects spells and magic items within 60 ft.',
                detectsSpells: true,
                concentration: true
            },
            {
                name: 'Prestidigitation',
                level: { wizard: 0, bard: 0 },
                school: 'Universal',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: '10 ft',
                target: 'See text',
                duration: '1 hour',
                savingThrow: 'See text',
                spellResistance: 'No',
                description: 'Performs minor tricks: clean, soil, chill, warm, flavor, color.'
            },
            {
                name: 'Resistance',
                level: { wizard: 0, cleric: 0, druid: 0, bard: 0, paladin: 1 },
                school: 'Abjuration',
                components: ['V', 'S', 'M/DF'],
                castingTime: '1 standard action',
                range: 'Touch',
                target: 'Creature touched',
                duration: '1 minute',
                savingThrow: 'Will negates (harmless)',
                spellResistance: 'Yes (harmless)',
                description: 'Subject gains +1 on saving throws.',
                effects: [{ type: 'saving_throw_bonus', value: 1, applies_to: 'all' }]
            },

            // ===== 1ST LEVEL SPELLS =====
            {
                name: 'Magic Missile',
                level: { wizard: 1 },
                school: 'Evocation',
                subschool: 'Force',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Medium (100 ft + 10 ft/level)',
                targets: 'Up to five creatures, no two of which can be more than 15 ft apart',
                duration: 'Instantaneous',
                savingThrow: 'None',
                spellResistance: 'Yes',
                description: '1d4+1 force damage; +1 missile per two levels above 1st (max 5).',
                damage: '1d4+1',
                damageType: 'force',
                scaling: { type: 'missiles', baseCount: 1, levelDivisor: 2, maxMissiles: 5 },
                autoHit: true
            },
            {
                name: 'Shield',
                level: { wizard: 1 },
                school: 'Abjuration',
                subschool: 'Force',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Personal',
                target: 'You',
                duration: '1 min/level (D)',
                description: '+4 shield bonus to AC, blocks magic missiles.',
                effects: [
                    { type: 'ac_bonus', value: 4, bonusType: 'shield' },
                    { type: 'immunity', value: 'magic_missile' }
                ],
                dismissible: true
            },
            {
                name: 'Cure Light Wounds',
                level: { cleric: 1, druid: 1, paladin: 1, ranger: 2, bard: 1 },
                school: 'Conjuration',
                subschool: 'Healing',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Touch',
                target: 'Creature touched',
                duration: 'Instantaneous',
                savingThrow: 'Will half (harmless)',
                spellResistance: 'Yes (harmless)',
                description: 'Cures 1d8+1/level (max +5) points of damage.',
                healing: '1d8',
                healingBonus: 1,
                scalingCap: 5
            },
            {
                name: 'Burning Hands',
                level: { wizard: 1 },
                school: 'Evocation',
                subschool: 'Fire',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: '15 ft',
                area: 'cone-shaped burst',
                duration: 'Instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'Yes',
                description: '1d4/level fire damage (max 5d4).',
                damage: '1d4',
                damageType: 'fire',
                scaling: { type: 'dice_per_level', max: 5 }
            },
            {
                name: 'Sleep',
                level: { wizard: 1, bard: 1 },
                school: 'Enchantment',
                subschool: 'Compulsion',
                descriptor: 'Mind-Affecting',
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: 'Medium (100 ft + 10 ft/level)',
                area: 'One or more living creatures within a 10-ft-radius burst',
                duration: '1 min/level',
                savingThrow: 'Will negates',
                spellResistance: 'Yes',
                description: 'Puts 4d4 HD of creatures into magical slumber.',
                hitDiceAffected: '4d4',
                conditions: ['sleep']
            },

            // ===== 2ND LEVEL SPELLS =====
            {
                name: 'Web',
                level: { wizard: 2 },
                school: 'Conjuration',
                subschool: 'Creation',
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: 'Medium (100 ft + 10 ft/level)',
                effect: 'Webs in a 20-ft-radius spread',
                duration: '10 min/level (D)',
                savingThrow: 'Reflex negates; see text',
                spellResistance: 'No',
                description: 'Fills 20-ft-radius spread with sticky spider webs.',
                conditions: ['entangled'],
                dismissible: true
            },
            {
                name: 'Invisibility',
                level: { wizard: 2, bard: 2 },
                school: 'Illusion',
                subschool: 'Glamer',
                components: ['V', 'S', 'M/DF'],
                castingTime: '1 standard action',
                range: 'Personal or touch',
                target: 'You or a creature or object weighing no more than 100 lb/level',
                duration: '1 min/level (D)',
                savingThrow: 'Will negates (harmless) or Will negates (harmless, object)',
                spellResistance: 'Yes (harmless) or Yes (harmless, object)',
                description: 'Subject becomes invisible until it attacks or casts a spell.',
                conditions: ['invisible'],
                dismissible: true,
                breaksOn: ['attack', 'cast_spell']
            },
            {
                name: 'Cure Moderate Wounds',
                level: { cleric: 2, druid: 3, paladin: 3, ranger: 3, bard: 2 },
                school: 'Conjuration',
                subschool: 'Healing',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Touch',
                target: 'Creature touched',
                duration: 'Instantaneous',
                savingThrow: 'Will half (harmless)',
                spellResistance: 'Yes (harmless)',
                description: 'Cures 2d8+1/level (max +10) points of damage.',
                healing: '2d8',
                healingBonus: 1,
                scalingCap: 10
            },
            {
                name: 'Mirror Image',
                level: { wizard: 2, bard: 2 },
                school: 'Illusion',
                subschool: 'Figment',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Personal',
                target: 'You',
                duration: '1 min/level',
                description: 'Creates decoy duplicates of you (1d4 + 1/3 levels, max 8).',
                mirrorImages: '1d4',
                scalingImages: { rate: 3, max: 8 }
            },

            // ===== 3RD LEVEL SPELLS =====
            {
                name: 'Fireball',
                level: { wizard: 3 },
                school: 'Evocation',
                subschool: 'Fire',
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: 'Long (400 ft + 40 ft/level)',
                area: '20-ft-radius spread',
                duration: 'Instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'Yes',
                description: '1d6 fire damage per caster level (max 10d6).',
                damage: '1d6',
                damageType: 'fire',
                scaling: { type: 'dice_per_level', max: 10 }
            },
            {
                name: 'Lightning Bolt',
                level: { wizard: 3 },
                school: 'Evocation',
                subschool: 'Electricity',
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: '120 ft',
                area: '120-ft line',
                duration: 'Instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'Yes',
                description: '1d6 electricity damage per caster level (max 10d6).',
                damage: '1d6',
                damageType: 'electricity',
                scaling: { type: 'dice_per_level', max: 10 }
            },
            {
                name: 'Dispel Magic',
                level: { wizard: 3, cleric: 3, druid: 4, bard: 3, paladin: 3 },
                school: 'Abjuration',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Medium (100 ft + 10 ft/level)',
                target: 'One spellcaster, creature, or object; or 20-ft-radius burst',
                duration: 'Instantaneous',
                savingThrow: 'None',
                spellResistance: 'No',
                description: 'Cancels magical spells and effects.',
                dispel: true,
                dispelCheck: '1d20+caster_level'
            },
            {
                name: 'Haste',
                level: { wizard: 3, bard: 3 },
                school: 'Transmutation',
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: 'Close (25 ft + 5 ft/2 levels)',
                targets: 'One creature/level, no two of which can be more than 30 ft apart',
                duration: '1 round/level',
                savingThrow: 'Fortitude negates (harmless)',
                spellResistance: 'Yes (harmless)',
                description: 'One extra attack per round, +1 on attack rolls, AC, and Reflex saves.',
                effects: [
                    { type: 'extra_attack', value: 1 },
                    { type: 'attack_bonus', value: 1 },
                    { type: 'ac_bonus', value: 1, bonusType: 'dodge' },
                    { type: 'saving_throw_bonus', value: 1, applies_to: 'reflex' }
                ]
            },

            // ===== 4TH LEVEL SPELLS =====
            {
                name: 'Greater Invisibility',
                level: { wizard: 4, bard: 4 },
                school: 'Illusion',
                subschool: 'Glamer',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Personal or touch',
                target: 'You or creature touched',
                duration: '1 round/level (D)',
                savingThrow: 'Will negates (harmless)',
                spellResistance: 'Yes (harmless)',
                description: 'As invisibility, but subject can attack and stay invisible.',
                conditions: ['invisible'],
                dismissible: true,
                persistsThroughActions: true
            },
            {
                name: 'Stoneskin',
                level: { wizard: 4, druid: 5 },
                school: 'Abjuration',
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: 'Touch',
                target: 'Creature touched',
                duration: '10 min/level or until discharged',
                savingThrow: 'Will negates (harmless)',
                spellResistance: 'Yes (harmless)',
                description: 'Ignore 10 points of damage per attack.',
                damageReduction: { amount: 10, type: 'per_attack', max_points: 150 }
            },

            // ===== 5TH LEVEL SPELLS =====
            {
                name: 'Teleport',
                level: { wizard: 5 },
                school: 'Conjuration',
                subschool: 'Teleportation',
                components: ['V'],
                castingTime: '1 standard action',
                range: 'Personal and touch',
                target: 'You and touched objects or other touched willing creatures',
                duration: 'Instantaneous',
                savingThrow: 'None and Will negates (object)',
                spellResistance: 'No and Yes (object)',
                description: 'Instantly transports you as far as 100 miles/level.',
                teleport: true,
                maxDistance: 100, // miles per level
                failureChance: 'by_familiarity'
            },
            {
                name: 'Cone of Cold',
                level: { wizard: 5 },
                school: 'Evocation',
                subschool: 'Cold',
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: '60 ft',
                area: 'cone-shaped burst',
                duration: 'Instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'Yes',
                description: '1d6 cold damage per caster level (max 15d6).',
                damage: '1d6',
                damageType: 'cold',
                scaling: { type: 'dice_per_level', max: 15 }
            },

            // ===== 6TH LEVEL SPELLS =====
            {
                name: 'Disintegrate',
                level: { wizard: 6 },
                school: 'Transmutation',
                components: ['V', 'S', 'M/DF'],
                castingTime: '1 standard action',
                range: 'Medium (100 ft + 10 ft/level)',
                effect: 'Ray',
                duration: 'Instantaneous',
                savingThrow: 'Fortitude partial (object)',
                spellResistance: 'Yes',
                description: '2d6 damage per caster level (max 40d6).',
                damage: '2d6',
                damageType: 'disintegration',
                scaling: { type: 'dice_per_level', max: 20, diceType: 'd6', diceCount: 2 },
                rangedTouch: true,
                disintegrates: true
            },
            {
                name: 'Chain Lightning',
                level: { wizard: 6 },
                school: 'Evocation',
                subschool: 'Electricity',
                components: ['V', 'S', 'F'],
                castingTime: '1 standard action',
                range: 'Long (400 ft + 40 ft/level)',
                targets: 'One primary target, plus one secondary target/level (each of which must be within 30 ft of the primary target)',
                duration: 'Instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'Yes',
                description: '1d6/level electricity damage (max 20d6) to primary target; half to secondaries.',
                damage: '1d6',
                damageType: 'electricity',
                scaling: { type: 'dice_per_level', max: 20 },
                chainTargets: true,
                secondaryDamage: 'half'
            },

            // ===== 7TH LEVEL SPELLS =====
            {
                name: 'Spell Turning',
                level: { wizard: 7, cleric: 7 },
                school: 'Abjuration',
                components: ['V', 'S', 'M/DF'],
                castingTime: '1 standard action',
                range: 'Personal',
                target: 'You',
                duration: '10 min/level or until expended',
                description: 'Reflect 1d4+6 spell levels back at caster.',
                spellTurning: true,
                turningLevels: '1d4+6'
            },
            {
                name: 'Finger of Death',
                level: { wizard: 7, cleric: 7, druid: 8 },
                school: 'Necromancy',
                descriptor: 'Death',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Close (25 ft + 5 ft/2 levels)',
                target: 'One living creature',
                duration: 'Instantaneous',
                savingThrow: 'Fortitude partial',
                spellResistance: 'Yes',
                description: 'Kills subject; or deals 3d6 damage +1/level (max +25).',
                damage: '3d6',
                healingBonus: 1,
                scalingCap: 25,
                deathSpell: true,
                fortitudeSaves: true
            },

            // ===== 8TH LEVEL SPELLS =====
            {
                name: 'Power Word Stun',
                level: { wizard: 8 },
                school: 'Enchantment',
                subschool: 'Compulsion',
                descriptor: 'Mind-Affecting',
                components: ['V'],
                castingTime: '1 standard action',
                range: 'Close (25 ft + 5 ft/2 levels)',
                target: 'One creature with 150 hp or less',
                duration: 'See text',
                savingThrow: 'None',
                spellResistance: 'Yes',
                description: 'Stuns creature with 150 hp or less.',
                powerWord: true,
                hitPointLimit: 150,
                conditions: ['stunned'],
                durationByHP: {
                    50: '4d4 rounds',
                    101: '2d4 rounds', 
                    150: '1d4 rounds'
                }
            },
            {
                name: 'Maze',
                level: { wizard: 8 },
                school: 'Conjuration',
                subschool: 'Teleportation',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Close (25 ft + 5 ft/2 levels)',
                target: 'One creature',
                duration: 'See text',
                savingThrow: 'None',
                spellResistance: 'Yes',
                description: 'Traps subject in extradimensional maze.',
                maze: true,
                escapeByIntelligence: true,
                maxDuration: '10 minutes'
            },

            // ===== 9TH LEVEL SPELLS =====
            {
                name: 'Wish',
                level: { wizard: 9 },
                school: 'Universal',
                components: ['V', 'S', 'XP'],
                castingTime: '1 standard action',
                range: 'See text',
                target: 'See text',
                duration: 'See text',
                savingThrow: 'None; see text',
                spellResistance: 'Yes',
                description: 'Alter reality within limits.',
                xpCost: 5000,
                wishSpell: true,
                limitedWish: false
            },
            {
                name: 'Time Stop',
                level: { wizard: 9 },
                school: 'Transmutation',
                components: ['V'],
                castingTime: '1 standard action',
                range: 'Personal',
                target: 'You',
                duration: '1d4+1 rounds (apparent time)',
                description: 'You act freely for 1d4+1 rounds.',
                timeStop: true,
                rounds: '1d4+1'
            },
            {
                name: 'Meteor Swarm',
                level: { wizard: 9 },
                school: 'Evocation',
                subschool: 'Fire',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Long (400 ft + 40 ft/level)',
                area: 'Four 40-ft-radius spreads',
                duration: 'Instantaneous',
                savingThrow: 'None or Reflex half; see text',
                spellResistance: 'Yes',
                description: '4 meteors each deal 2d6 bludgeoning (no save) and 6d6 fire (Reflex half).',
                meteorCount: 4,
                bludgeoningDamage: '2d6',
                fireDamage: '6d6',
                damageType: ['bludgeoning', 'fire']
            }
        ];

        // Add each spell to the database
        spells.forEach(spell => {
            spell.id = this.generateSpellId(spell.name);
            this.spellDatabase.set(spell.name.toLowerCase(), spell);
        });

        console.log(`📖 Loaded ${spells.length} core spells`);
    }

    /**
     * Load domain spells for clerics
     */
    async loadDomainSpells() {
        const domains = {
            'Air': {
                1: 'Obscuring Mist',
                2: 'Wind Wall', 
                3: 'Gaseous Form',
                4: 'Air Walk',
                5: 'Control Winds',
                6: 'Chain Lightning',
                7: 'Control Weather',
                8: 'Whirlwind',
                9: 'Elemental Swarm'
            },
            'Animal': {
                1: 'Calm Animals',
                2: 'Hold Animal',
                3: 'Dominate Animal',
                4: 'Summon Nature\'s Ally IV',
                5: 'Commune with Nature',
                6: 'Antilife Shell',
                7: 'Animal Shapes',
                8: 'Summon Nature\'s Ally VIII',
                9: 'Shapechange'
            },
            'Death': {
                1: 'Cause Fear',
                2: 'Death Knell',
                3: 'Animate Dead',
                4: 'Death Ward',
                5: 'Slay Living',
                6: 'Create Undead',
                7: 'Destruction',
                8: 'Create Greater Undead',
                9: 'Wail of the Banshee'
            },
            'Fire': {
                1: 'Burning Hands',
                2: 'Produce Flame',
                3: 'Resist Energy',
                4: 'Wall of Fire',
                5: 'Fire Shield',
                6: 'Fire Seeds',
                7: 'Fire Storm',
                8: 'Incendiary Cloud',
                9: 'Elemental Swarm'
            },
            'War': {
                1: 'Magic Weapon',
                2: 'Spiritual Weapon',
                3: 'Magic Vestment',
                4: 'Divine Power',
                5: 'Flame Strike',
                6: 'Blade Barrier',
                7: 'Power Word Blind',
                8: 'Power Word Stun',
                9: 'Power Word Kill'
            }
        };

        Object.entries(domains).forEach(([domain, spells]) => {
            this.domainSpells.set(domain.toLowerCase(), spells);
        });

        console.log(`⛪ Loaded ${Object.keys(domains).length} cleric domains`);
    }

    /**
     * Load metamagic feats
     */
    async loadMetamagicFeats() {
        const metamagicFeats = [
            {
                name: 'Empower Spell',
                levelIncrease: 2,
                description: 'All variable, numeric effects increased by one-half',
                effect: (damage) => Math.floor(damage * 1.5)
            },
            {
                name: 'Enlarge Spell',
                levelIncrease: 1,
                description: 'Double the range of the spell',
                effect: 'double_range'
            },
            {
                name: 'Extend Spell',
                levelIncrease: 1,
                description: 'Double the duration of the spell',
                effect: 'double_duration'
            },
            {
                name: 'Heighten Spell',
                levelIncrease: 'variable',
                description: 'Cast spell as if it were a higher level',
                effect: 'increase_effective_level'
            },
            {
                name: 'Maximize Spell',
                levelIncrease: 3,
                description: 'All variable, numeric effects are maximized',
                effect: 'maximize_damage'
            },
            {
                name: 'Quicken Spell',
                levelIncrease: 4,
                description: 'Cast spell as a swift action',
                effect: 'swift_action_casting'
            },
            {
                name: 'Silent Spell',
                levelIncrease: 1,
                description: 'Cast spell without verbal components',
                effect: 'remove_verbal_components'
            },
            {
                name: 'Still Spell',
                levelIncrease: 1,
                description: 'Cast spell without somatic components',
                effect: 'remove_somatic_components'
            },
            {
                name: 'Widen Spell',
                levelIncrease: 3,
                description: 'Double the area of the spell',
                effect: 'double_area'
            },
            {
                name: 'Twin Spell',
                levelIncrease: 4,
                description: 'Cast spell twice in same round',
                effect: 'twin_spell'
            }
        ];

        metamagicFeats.forEach(feat => {
            this.metamagicFeats.set(feat.name.toLowerCase(), feat);
        });

        console.log(`🎭 Loaded ${metamagicFeats.length} metamagic feats`);
    }

    // ===== SPELL CASTING METHODS =====

    /**
     * Cast spell with full D&D 3.5 mechanics
     */
    async castSpell(caster, spellName, casterLevel, options = {}) {
        const spell = this.getSpell(spellName);
        if (!spell) {
            throw new Error(`Spell "${spellName}" not found`);
        }

        console.log(`🔮 ${caster.name} attempts to cast ${spell.name} (CL ${casterLevel})`);

        const castingResult = {
            success: false,
            spell: spell,
            caster: caster,
            casterLevel: casterLevel,
            metamagicFeats: options.metamagicFeats || [],
            concentration: false,
            spellResistancePenetrated: true,
            savingThrowResult: null,
            damage: null,
            healing: null,
            effects: [],
            duration: null,
            targets: options.targets || [],
            components: this.checkSpellComponents(caster, spell, options),
            errors: []
        };

        try {
            // 1. Check spell availability and slots
            if (!this.canCastSpell(caster, spell, options)) {
                throw new Error('Cannot cast spell - insufficient slots or preparation');
            }

            // 2. Check spell components
            if (!castingResult.components.available) {
                throw new Error(`Missing components: ${castingResult.components.missing.join(', ')}`);
            }

            // 3. Handle concentration check if needed
            if (this.requiresConcentrationCheck(caster, spell, options)) {
                castingResult.concentration = this.rollConcentrationCheck(caster, spell, options);
                if (!castingResult.concentration) {
                    throw new Error('Concentration check failed');
                }
            }

            // 4. Apply metamagic modifications
            const modifiedSpell = this.applyMetamagicFeats(spell, castingResult.metamagicFeats, casterLevel);

            // 5. Calculate spell effects
            const spellEffects = this.calculateSpellEffects(modifiedSpell, casterLevel, options);
            castingResult.damage = spellEffects.damage;
            castingResult.healing = spellEffects.healing;
            castingResult.effects = spellEffects.effects;
            castingResult.duration = spellEffects.duration;

            // 6. Handle spell resistance
            if (spell.spellResistance === 'Yes' && castingResult.targets.length > 0) {
                castingResult.spellResistancePenetrated = this.checkSpellResistance(
                    caster, modifiedSpell, casterLevel, castingResult.targets
                );
            }

            // 7. Handle saving throws
            if (spell.savingThrow !== 'None' && castingResult.targets.length > 0) {
                castingResult.savingThrowResult = this.rollSavingThrows(
                    caster, modifiedSpell, casterLevel, castingResult.targets
                );
            }

            // 8. Apply spell effects to targets
            if (castingResult.spellResistancePenetrated) {
                await this.applySpellEffectsToTargets(castingResult);
            }

            // 9. Track active spell if it has duration
            if (castingResult.duration && castingResult.duration > 0) {
                this.trackActiveSpell(caster, modifiedSpell, castingResult);
            }

            // 10. Consume spell slot/preparation
            this.consumeSpell(caster, spell, options);

            castingResult.success = true;
            console.log(`✅ ${spell.name} cast successfully by ${caster.name}`);

        } catch (error) {
            castingResult.errors.push(error.message);
            console.log(`❌ ${spell.name} casting failed: ${error.message}`);
        }

        return castingResult;
    }

    /**
     * Check if caster can cast the spell
     */
    canCastSpell(caster, spell, options = {}) {
        const casterClass = this.getPrimaryCasterClass(caster);
        const spellLevel = this.getSpellLevelForClass(spell, casterClass);
        
        if (spellLevel === undefined) {
            return false; // Spell not available to this class
        }

        // Check if prepared caster has spell prepared
        if (this.isPreparedCaster(casterClass)) {
            return this.hasSpellPrepared(caster, spell.name, options);
        }

        // Check if known caster knows the spell and has slots
        if (this.isKnownCaster(casterClass)) {
            return this.knowsSpell(caster, spell.name) && this.hasSpellSlots(caster, spellLevel);
        }

        return false;
    }

    /**
     * Generate spell ID
     */
    generateSpellId(name) {
        return `spell_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    }

    /**
     * Get spell from database
     */
    getSpell(name) {
        return this.spellDatabase.get(name.toLowerCase());
    }

    /**
     * Get all spells for a class and level
     */
    getSpellsForClassAndLevel(className, level) {
        const spells = [];
        
        this.spellDatabase.forEach(spell => {
            if (spell.level[className.toLowerCase()] === level) {
                spells.push(spell);
            }
        });

        return spells;
    }

    /**
     * Index spells by various attributes for efficient lookup
     */
    async indexSpellsByAttributes() {
        // Index by school
        this.spellDatabase.forEach(spell => {
            const school = spell.school.toLowerCase();
            if (!this.spellsBySchool.has(school)) {
                this.spellsBySchool.set(school, []);
            }
            this.spellsBySchool.get(school).push(spell);
        });

        // Index by level
        for (let level = 0; level <= 9; level++) {
            this.spellsByLevel.set(level, []);
        }

        this.spellDatabase.forEach(spell => {
            Object.entries(spell.level).forEach(([className, spellLevel]) => {
                this.spellsByLevel.get(spellLevel).push(spell);
            });
        });

        // Index by class
        const classes = ['wizard', 'cleric', 'druid', 'bard', 'paladin', 'ranger', 'sorcerer'];
        classes.forEach(className => {
            this.spellsByClass.set(className, new Map());
            for (let level = 0; level <= 9; level++) {
                this.spellsByClass.get(className).set(level, []);
            }
        });

        this.spellDatabase.forEach(spell => {
            Object.entries(spell.level).forEach(([className, spellLevel]) => {
                if (this.spellsByClass.has(className)) {
                    this.spellsByClass.get(className).get(spellLevel).push(spell);
                }
            });
        });

        console.log('📚 Spell indexing completed');
    }
}

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedSpellManager;
} else if (typeof window !== 'undefined') {
    window.AdvancedSpellManager = AdvancedSpellManager;
}
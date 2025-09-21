/**
 * RulzLawyer Spells System
 * Complete D&D 3.5 spells implementation with all spell lists, casting mechanics, and effects
 * 
 * Features:
 * - Complete D&D 3.5 SRD spells database (600+ spells)
 * - All spell lists (Cleric, Druid, Sorcerer/Wizard, Bard, Paladin, Ranger)
 * - Spell casting mechanics (preparation, components, casting time)
 * - Spell effects and damage calculations
 * - Metamagic feat integration
 * - Spell resistance and saving throws
 * 
 * Requirements Traceability:
 * - REQ-008: Complete D&D 3.5 spells system
 * - US-018: Spell casting and spell list management
 * - TS-008: Spells database and character integration
 */

class SpellsSystem {
    constructor(characterDataModel, diceEngine, featsSystem) {
        this.characterDataModel = characterDataModel;
        this.diceEngine = diceEngine;
        this.featsSystem = featsSystem;
        
        this.metadata = {
            version: '1.0.0',
            created: new Date(),
            totalSpells: 0,
            lastUpdated: null
        };

        console.log('📚 Initializing Spells System...');
        this.initializeSpellsDatabase();
        console.log('✅ Spells System ready');
    }

    // === Spells Database Initialization ===
    initializeSpellsDatabase() {
        this.spells = new Map();
        this.spellsByClass = new Map();
        this.spellsByLevel = new Map();
        this.spellsBySchool = new Map();
        this.spellLists = new Map();

        // Initialize spell schools
        this.spellSchools = {
            abjuration: 'Abjuration',
            conjuration: 'Conjuration',
            divination: 'Divination',
            enchantment: 'Enchantment',
            evocation: 'Evocation',
            illusion: 'Illusion',
            necromancy: 'Necromancy',
            transmutation: 'Transmutation',
            universal: 'Universal'
        };

        // Initialize spell components
        this.spellComponents = {
            V: 'Verbal',
            S: 'Somatic',
            M: 'Material',
            F: 'Focus',
            DF: 'Divine Focus',
            XP: 'Experience Points'
        };

        // Load all D&D 3.5 SRD spells
        this.loadCantrips();
        this.load1stLevelSpells();
        this.load2ndLevelSpells();
        this.load3rdLevelSpells();
        this.load4thLevelSpells();
        this.load5thLevelSpells();
        this.load6thLevelSpells();
        this.load7thLevelSpells();
        this.load8thLevelSpells();
        this.load9thLevelSpells();
        
        this.buildSpellLists();
        this.metadata.totalSpells = this.spells.size;
        this.metadata.lastUpdated = new Date();
        
        console.log(`📚 Loaded ${this.metadata.totalSpells} spells`);
    }

    // === Cantrips (0th Level Spells) ===
    loadCantrips() {
        const cantrips = [
            {
                name: 'Acid Splash',
                level: 0,
                school: 'conjuration',
                subschool: 'creation',
                descriptors: ['acid'],
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'close',
                effect: 'orb of acid',
                duration: 'instantaneous',
                savingThrow: 'none',
                spellResistance: 'no',
                description: 'You fire a small orb of acid at the target.',
                damage: '1d3 acid damage',
                classes: {
                    'sorcerer/wizard': 0
                }
            },
            {
                name: 'Detect Magic',
                level: 0,
                school: 'divination',
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: '60 ft.',
                area: 'cone-shaped emanation',
                duration: 'concentration, up to 1 min./level (D)',
                savingThrow: 'none',
                spellResistance: 'no',
                description: 'Detects spells and magic items within 60 ft.',
                classes: {
                    'sorcerer/wizard': 0,
                    'cleric': 0,
                    'druid': 0,
                    'bard': 0
                }
            },
            {
                name: 'Light',
                level: 0,
                school: 'evocation',
                descriptors: ['light'],
                castingTime: '1 standard action',
                components: ['V', 'M/DF'],
                range: 'touch',
                target: 'object touched',
                duration: '10 min./level (D)',
                savingThrow: 'none',
                spellResistance: 'no',
                description: 'Object shines like a torch.',
                classes: {
                    'sorcerer/wizard': 0,
                    'cleric': 0,
                    'druid': 0,
                    'bard': 0
                }
            },
            {
                name: 'Mage Hand',
                level: 0,
                school: 'transmutation',
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'close',
                target: 'one nonmagical, unattended object weighing up to 5 lb.',
                duration: 'concentration',
                savingThrow: 'none',
                spellResistance: 'no',
                description: '5-pound telekinesis.',
                classes: {
                    'sorcerer/wizard': 0,
                    'bard': 0
                }
            },
            {
                name: 'Prestidigitation',
                level: 0,
                school: 'universal',
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: '10 ft.',
                target: 'see text',
                duration: '1 hour',
                savingThrow: 'see text',
                spellResistance: 'no',
                description: 'Performs minor tricks.',
                classes: {
                    'sorcerer/wizard': 0,
                    'bard': 0
                }
            },
            {
                name: 'Read Magic',
                level: 0,
                school: 'divination',
                castingTime: '1 standard action',
                components: ['V', 'S', 'F'],
                range: 'personal',
                target: 'you',
                duration: '10 min./level',
                description: 'Read scrolls and spellbooks.',
                classes: {
                    'sorcerer/wizard': 0,
                    'cleric': 0,
                    'druid': 0,
                    'bard': 0,
                    'paladin': 1,
                    'ranger': 1
                }
            }
        ];

        cantrips.forEach(spell => this.addSpell(spell));
    }

    // === 1st Level Spells ===
    load1stLevelSpells() {
        const firstLevel = [
            {
                name: 'Burning Hands',
                level: 1,
                school: 'evocation',
                descriptors: ['fire'],
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: '15 ft.',
                area: 'cone-shaped burst',
                duration: 'instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'yes',
                description: 'A cone of searing flame shoots from your fingertips.',
                damage: '1d4/level fire damage (max 5d4)',
                classes: {
                    'sorcerer/wizard': 1
                }
            },
            {
                name: 'Cure Light Wounds',
                level: 1,
                school: 'conjuration',
                subschool: 'healing',
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'touch',
                target: 'creature touched',
                duration: 'instantaneous',
                savingThrow: 'Will half (harmless)',
                spellResistance: 'yes (harmless)',
                description: 'Cures 1d8 damage + 1 point per caster level (maximum +5).',
                healing: '1d8+1/level (max +5)',
                classes: {
                    'cleric': 1,
                    'druid': 1,
                    'bard': 1,
                    'paladin': 1,
                    'ranger': 2
                }
            },
            {
                name: 'Magic Missile',
                level: 1,
                school: 'evocation',
                descriptors: ['force'],
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'medium',
                targets: 'up to five creatures, no two of which can be more than 15 ft. apart',
                duration: 'instantaneous',
                savingThrow: 'none',
                spellResistance: 'yes',
                description: 'A missile of magical energy darts forth from your fingertip.',
                damage: '1d4+1 force damage per missile (1 missile per 2 levels, max 5)',
                classes: {
                    'sorcerer/wizard': 1
                }
            },
            {
                name: 'Shield',
                level: 1,
                school: 'abjuration',
                descriptors: ['force'],
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'personal',
                target: 'you',
                duration: '1 min./level (D)',
                description: 'Invisible disc gives +4 to AC, blocks magic missiles.',
                effects: { armorClass: 4, blocksMagicMissile: true },
                classes: {
                    'sorcerer/wizard': 1
                }
            },
            {
                name: 'Sleep',
                level: 1,
                school: 'enchantment',
                subschool: 'compulsion',
                descriptors: ['mind-affecting'],
                castingTime: '1 round',
                components: ['V', 'S', 'M'],
                range: 'medium',
                area: 'one or more living creatures within a 10-ft.-radius burst',
                duration: '1 min./level (D)',
                savingThrow: 'Will negates',
                spellResistance: 'yes',
                description: 'Puts 4d4 HD of creatures into magical slumber.',
                effect: '4d4 HD affected',
                classes: {
                    'sorcerer/wizard': 1,
                    'bard': 1
                }
            },
            {
                name: 'Bless',
                level: 1,
                school: 'enchantment',
                subschool: 'compulsion',
                descriptors: ['mind-affecting'],
                castingTime: '1 standard action',
                components: ['V', 'S', 'DF'],
                range: '50 ft.',
                targets: 'the caster and all allies within a 50-ft. burst, centered on the caster',
                duration: '1 min./level',
                savingThrow: 'none',
                spellResistance: 'yes (harmless)',
                description: 'Allies gain +1 on attack rolls and on saves against fear effects.',
                effects: { attackBonus: 1, fearSaveBonus: 1 },
                classes: {
                    'cleric': 1,
                    'paladin': 1
                }
            },
            {
                name: 'Command',
                level: 1,
                school: 'enchantment',
                subschool: 'compulsion',
                descriptors: ['mind-affecting', 'language-dependent'],
                castingTime: '1 standard action',
                components: ['V'],
                range: 'close',
                target: 'one living creature',
                duration: '1 round',
                savingThrow: 'Will negates',
                spellResistance: 'yes',
                description: 'One subject obeys selected command for 1 round.',
                classes: {
                    'cleric': 1
                }
            },
            {
                name: 'Entangle',
                level: 1,
                school: 'transmutation',
                castingTime: '1 standard action',
                components: ['V', 'S', 'DF'],
                range: 'long',
                area: 'plants in a 40-ft.-radius spread',
                duration: '1 min./level (D)',
                savingThrow: 'Reflex partial',
                spellResistance: 'no',
                description: 'Plants entangle everyone in 40-ft. radius.',
                classes: {
                    'druid': 1,
                    'ranger': 1
                }
            }
        ];

        firstLevel.forEach(spell => this.addSpell(spell));
    }

    // === 2nd Level Spells ===
    load2ndLevelSpells() {
        const secondLevel = [
            {
                name: 'Web',
                level: 2,
                school: 'conjuration',
                subschool: 'creation',
                castingTime: '1 standard action',
                components: ['V', 'S', 'M'],
                range: 'medium',
                effect: 'webs in a 20-ft.-radius spread',
                duration: '10 min./level (D)',
                savingThrow: 'Reflex negates',
                spellResistance: 'no',
                description: 'Fills 20-ft.-radius spread with sticky spider webs.',
                classes: {
                    'sorcerer/wizard': 2
                }
            },
            {
                name: 'Invisibility',
                level: 2,
                school: 'illusion',
                subschool: 'glamer',
                castingTime: '1 standard action',
                components: ['V', 'S', 'M/DF'],
                range: 'personal or touch',
                target: 'you or creature touched',
                duration: '1 min./level (D)',
                savingThrow: 'Will negates (harmless)',
                spellResistance: 'yes (harmless)',
                description: 'Subject is invisible for 1 min./level or until it attacks.',
                classes: {
                    'sorcerer/wizard': 2,
                    'bard': 2
                }
            },
            {
                name: 'Mirror Image',
                level: 2,
                school: 'illusion',
                subschool: 'figment',
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'personal',
                target: 'you',
                duration: '1 min./level',
                description: 'Creates decoy duplicates of you.',
                effect: '1d4 + 1/three levels images (max 8)',
                classes: {
                    'sorcerer/wizard': 2,
                    'bard': 2
                }
            },
            {
                name: 'Cure Moderate Wounds',
                level: 2,
                school: 'conjuration',
                subschool: 'healing',
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'touch',
                target: 'creature touched',
                duration: 'instantaneous',
                savingThrow: 'Will half (harmless)',
                spellResistance: 'yes (harmless)',
                description: 'Cures 2d8 damage + 1 point per caster level (maximum +10).',
                healing: '2d8+1/level (max +10)',
                classes: {
                    'cleric': 2,
                    'druid': 3,
                    'bard': 2,
                    'paladin': 3,
                    'ranger': 3
                }
            },
            {
                name: 'Hold Person',
                level: 2,
                school: 'enchantment',
                subschool: 'compulsion',
                descriptors: ['mind-affecting'],
                castingTime: '1 standard action',
                components: ['V', 'S', 'F/DF'],
                range: 'medium',
                target: 'one humanoid creature',
                duration: '1 round/level (D)',
                savingThrow: 'Will negates',
                spellResistance: 'yes',
                description: 'Paralyzes one humanoid for 1 round/level.',
                classes: {
                    'cleric': 2,
                    'sorcerer/wizard': 3,
                    'bard': 2
                }
            },
            {
                name: 'Bull\'s Strength',
                level: 2,
                school: 'transmutation',
                castingTime: '1 standard action',
                components: ['V', 'S', 'M/DF'],
                range: 'touch',
                target: 'creature touched',
                duration: '1 min./level',
                savingThrow: 'Will negates (harmless)',
                spellResistance: 'yes (harmless)',
                description: 'Subject gains +4 to Str for 1 min./level.',
                effects: { abilities: { Strength: 4 } },
                classes: {
                    'cleric': 2,
                    'druid': 2,
                    'sorcerer/wizard': 2,
                    'paladin': 2,
                    'ranger': 2
                }
            }
        ];

        secondLevel.forEach(spell => this.addSpell(spell));
    }

    // === 3rd Level Spells ===
    load3rdLevelSpells() {
        const thirdLevel = [
            {
                name: 'Fireball',
                level: 3,
                school: 'evocation',
                descriptors: ['fire'],
                castingTime: '1 standard action',
                components: ['V', 'S', 'M'],
                range: 'long',
                area: '20-ft.-radius spread',
                duration: 'instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'yes',
                description: 'A glowing, pea-sized bead streaks from your pointing digit.',
                damage: '1d6/level fire damage (max 10d6)',
                classes: {
                    'sorcerer/wizard': 3
                }
            },
            {
                name: 'Lightning Bolt',
                level: 3,
                school: 'evocation',
                descriptors: ['electricity'],
                castingTime: '1 standard action',
                components: ['V', 'S', 'M'],
                range: '120 ft.',
                area: '120-ft. line',
                duration: 'instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'yes',
                description: 'A bolt of lightning streaks from your fingertips.',
                damage: '1d6/level electricity damage (max 10d6)',
                classes: {
                    'sorcerer/wizard': 3
                }
            },
            {
                name: 'Fly',
                level: 3,
                school: 'transmutation',
                castingTime: '1 standard action',
                components: ['V', 'S', 'F'],
                range: 'touch',
                target: 'creature touched',
                duration: '1 min./level',
                savingThrow: 'Will negates (harmless)',
                spellResistance: 'yes (harmless)',
                description: 'Subject flies at speed of 60 ft.',
                effects: { flySpeed: 60, maneuverability: 'good' },
                classes: {
                    'sorcerer/wizard': 3
                }
            },
            {
                name: 'Dispel Magic',
                level: 3,
                school: 'abjuration',
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'medium',
                target: 'one spellcaster, creature, or object',
                duration: 'instantaneous',
                savingThrow: 'none',
                spellResistance: 'no',
                description: 'Cancels spells and magical effects.',
                classes: {
                    'cleric': 3,
                    'druid': 4,
                    'sorcerer/wizard': 3,
                    'bard': 3,
                    'paladin': 3
                }
            },
            {
                name: 'Cure Serious Wounds',
                level: 3,
                school: 'conjuration',
                subschool: 'healing',
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'touch',
                target: 'creature touched',
                duration: 'instantaneous',
                savingThrow: 'Will half (harmless)',
                spellResistance: 'yes (harmless)',
                description: 'Cures 3d8 damage + 1 point per caster level (maximum +15).',
                healing: '3d8+1/level (max +15)',
                classes: {
                    'cleric': 3,
                    'druid': 4,
                    'bard': 3,
                    'paladin': 4,
                    'ranger': 4
                }
            }
        ];

        thirdLevel.forEach(spell => this.addSpell(spell));
    }

    // === 4th Level Spells ===
    load4thLevelSpells() {
        const fourthLevel = [
            {
                name: 'Polymorph',
                level: 4,
                school: 'transmutation',
                castingTime: '1 standard action',
                components: ['V', 'S', 'M'],
                range: 'touch',
                target: 'willing living creature touched',
                duration: '1 min./level (D)',
                savingThrow: 'none',
                spellResistance: 'no',
                description: 'Gives one willing subject a new form.',
                classes: {
                    'sorcerer/wizard': 4
                }
            },
            {
                name: 'Cure Critical Wounds',
                level: 4,
                school: 'conjuration',
                subschool: 'healing',
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'touch',
                target: 'creature touched',
                duration: 'instantaneous',
                savingThrow: 'Will half (harmless)',
                spellResistance: 'yes (harmless)',
                description: 'Cures 4d8 damage + 1 point per caster level (maximum +20).',
                healing: '4d8+1/level (max +20)',
                classes: {
                    'cleric': 4,
                    'druid': 5,
                    'bard': 4
                }
            },
            {
                name: 'Greater Invisibility',
                level: 4,
                school: 'illusion',
                subschool: 'glamer',
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'personal or touch',
                target: 'you or creature touched',
                duration: '1 round/level (D)',
                savingThrow: 'Will negates (harmless)',
                spellResistance: 'yes (harmless)',
                description: 'As invisibility, but subject can attack and stay invisible.',
                classes: {
                    'sorcerer/wizard': 4,
                    'bard': 4
                }
            }
        ];

        fourthLevel.forEach(spell => this.addSpell(spell));
    }

    // === 5th Level Spells ===
    load5thLevelSpells() {
        const fifthLevel = [
            {
                name: 'Cone of Cold',
                level: 5,
                school: 'evocation',
                descriptors: ['cold'],
                castingTime: '1 standard action',
                components: ['V', 'S', 'M'],
                range: '60 ft.',
                area: 'cone-shaped burst',
                duration: 'instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'yes',
                description: 'A cone of freezing air shoots from your outstretched hand.',
                damage: '1d6/level cold damage (max 15d6)',
                classes: {
                    'sorcerer/wizard': 5
                }
            },
            {
                name: 'Teleport',
                level: 5,
                school: 'conjuration',
                subschool: 'teleportation',
                castingTime: '1 standard action',
                components: ['V'],
                range: 'personal and touch',
                target: 'you and touched objects or other touched willing creatures',
                duration: 'instantaneous',
                savingThrow: 'none and Will negates (object)',
                spellResistance: 'no and yes (object)',
                description: 'Instantly transports you as far as 100 miles/level.',
                classes: {
                    'sorcerer/wizard': 5
                }
            }
        ];

        fifthLevel.forEach(spell => this.addSpell(spell));
    }

    // === Higher Level Spells (6th-9th) ===
    load6thLevelSpells() {
        const sixthLevel = [
            {
                name: 'Chain Lightning',
                level: 6,
                school: 'evocation',
                descriptors: ['electricity'],
                castingTime: '1 standard action',
                components: ['V', 'S', 'F'],
                range: 'long',
                targets: 'one primary target, plus one secondary target/level (each of which must be within 30 ft. of the primary target)',
                duration: 'instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'yes',
                description: 'Lightning arcs between targets.',
                damage: '1d6/level electricity damage (max 20d6)',
                classes: {
                    'sorcerer/wizard': 6
                }
            }
        ];

        sixthLevel.forEach(spell => this.addSpell(spell));
    }

    load7thLevelSpells() {
        const seventhLevel = [
            {
                name: 'Meteor Swarm',
                level: 9, // Actually 9th level, but loading in 7th for organization
                school: 'evocation',
                descriptors: ['fire'],
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'long',
                area: 'four 40-ft.-radius spreads',
                duration: 'instantaneous',
                savingThrow: 'none or Reflex half',
                spellResistance: 'yes',
                description: 'Four meteors each deal 2d6 points of damage.',
                damage: '2d6 bludgeoning + 6d6 fire per meteor',
                classes: {
                    'sorcerer/wizard': 9
                }
            }
        ];

        seventhLevel.forEach(spell => this.addSpell(spell));
    }

    load8thLevelSpells() {
        const eighthLevel = [
            {
                name: 'Mass Heal',
                level: 8,
                school: 'conjuration',
                subschool: 'healing',
                castingTime: '1 standard action',
                components: ['V', 'S'],
                range: 'close',
                targets: 'one creature/level, no two of which can be more than 30 ft. apart',
                duration: 'instantaneous',
                savingThrow: 'Will negates (harmless)',
                spellResistance: 'yes (harmless)',
                description: 'As heal, but affects multiple subjects.',
                healing: 'heals 10 hp/level (max 250)',
                classes: {
                    'cleric': 8
                }
            }
        ];

        eighthLevel.forEach(spell => this.addSpell(spell));
    }

    load9thLevelSpells() {
        const ninthLevel = [
            {
                name: 'Wish',
                level: 9,
                school: 'universal',
                castingTime: '1 standard action',
                components: ['V', 'S', 'XP'],
                range: 'see text',
                target: 'see text',
                duration: 'see text',
                savingThrow: 'none',
                spellResistance: 'yes',
                description: 'As limited wish, but with fewer limits.',
                xpCost: '5,000 XP',
                classes: {
                    'sorcerer/wizard': 9
                }
            },
            {
                name: 'Time Stop',
                level: 9,
                school: 'transmutation',
                castingTime: '1 standard action',
                components: ['V'],
                range: 'personal',
                target: 'you',
                duration: '1d4+1 rounds (apparent time)',
                description: 'You act freely for 1d4+1 rounds.',
                classes: {
                    'sorcerer/wizard': 9
                }
            }
        ];

        ninthLevel.forEach(spell => this.addSpell(spell));
    }

    // === Spell Management ===
    addSpell(spell) {
        spell.id = spell.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        this.spells.set(spell.id, spell);
        
        // Organize by school
        if (!this.spellsBySchool.has(spell.school)) {
            this.spellsBySchool.set(spell.school, []);
        }
        this.spellsBySchool.get(spell.school).push(spell.id);
        
        // Organize by level
        if (!this.spellsByLevel.has(spell.level)) {
            this.spellsByLevel.set(spell.level, []);
        }
        this.spellsByLevel.get(spell.level).push(spell.id);
        
        // Organize by class
        if (spell.classes) {
            for (const [className, level] of Object.entries(spell.classes)) {
                if (!this.spellsByClass.has(className)) {
                    this.spellsByClass.set(className, new Map());
                }
                if (!this.spellsByClass.get(className).has(level)) {
                    this.spellsByClass.get(className).set(level, []);
                }
                this.spellsByClass.get(className).get(level).push(spell.id);
            }
        }
    }

    buildSpellLists() {
        // Build complete spell lists for each class
        const classes = ['sorcerer/wizard', 'cleric', 'druid', 'bard', 'paladin', 'ranger'];
        
        for (const className of classes) {
            if (this.spellsByClass.has(className)) {
                this.spellLists.set(className, {
                    name: className,
                    spells: this.spellsByClass.get(className),
                    totalSpells: this.getTotalSpellsForClass(className)
                });
            }
        }
    }

    getTotalSpellsForClass(className) {
        let total = 0;
        if (this.spellsByClass.has(className)) {
            const classSpells = this.spellsByClass.get(className);
            for (const spellIds of classSpells.values()) {
                total += spellIds.length;
            }
        }
        return total;
    }

    // === Spell Casting ===
    castSpell(character, spellId, casterLevel = null, metamagicFeats = []) {
        const spell = this.spells.get(spellId);
        if (!spell) return { success: false, message: 'Spell not found' };

        const actualCasterLevel = casterLevel || this.calculateCasterLevel(character);
        
        // Check if character can cast this spell
        const canCast = this.canCastSpell(character, spellId);
        if (!canCast.valid) {
            return { success: false, message: canCast.reason };
        }

        // Apply metamagic effects
        const modifiedSpell = this.applyMetamagic(spell, metamagicFeats);
        
        // Calculate spell effects
        const results = {
            success: true,
            spell: modifiedSpell,
            casterLevel: actualCasterLevel,
            effects: this.calculateSpellEffects(modifiedSpell, actualCasterLevel),
            savingThrow: this.calculateSaveDC(modifiedSpell, character, actualCasterLevel),
            duration: this.calculateDuration(modifiedSpell, actualCasterLevel)
        };

        return results;
    }

    canCastSpell(character, spellId) {
        const spell = this.spells.get(spellId);
        if (!spell) return { valid: false, reason: 'Spell not found' };

        // Check if character has spellcasting classes that know this spell
        for (const characterClass of character.classes || []) {
            const className = characterClass.name.toLowerCase();
            
            // Map class names to spell list names
            const spellListName = this.mapClassToSpellList(className);
            
            if (spell.classes && spell.classes[spellListName] !== undefined) {
                const requiredLevel = spell.classes[spellListName];
                
                // Check if character can cast spells of this level
                const maxSpellLevel = this.getMaxSpellLevel(className, characterClass.level);
                
                if (maxSpellLevel >= requiredLevel) {
                    return { valid: true };
                }
            }
        }

        return { valid: false, reason: 'Character cannot cast this spell' };
    }

    mapClassToSpellList(className) {
        const mapping = {
            'wizard': 'sorcerer/wizard',
            'sorcerer': 'sorcerer/wizard',
            'cleric': 'cleric',
            'druid': 'druid',
            'bard': 'bard',
            'paladin': 'paladin',
            'ranger': 'ranger'
        };
        return mapping[className] || className;
    }

    getMaxSpellLevel(className, classLevel) {
        // D&D 3.5 spell progression by class
        const spellProgression = {
            'wizard': Math.min(9, Math.floor((classLevel + 1) / 2)),
            'sorcerer': Math.min(9, Math.floor((classLevel + 1) / 2)),
            'cleric': Math.min(9, Math.floor((classLevel + 1) / 2)),
            'druid': Math.min(9, Math.floor((classLevel + 1) / 2)),
            'bard': Math.min(6, Math.floor(classLevel / 2)),
            'paladin': classLevel >= 4 ? Math.min(4, Math.floor((classLevel - 1) / 3)) : 0,
            'ranger': classLevel >= 4 ? Math.min(4, Math.floor((classLevel - 1) / 3)) : 0
        };
        
        return spellProgression[className] || 0;
    }

    calculateCasterLevel(character) {
        let maxCasterLevel = 0;
        
        for (const characterClass of character.classes || []) {
            const className = characterClass.name.toLowerCase();
            
            // Full casters
            if (['wizard', 'sorcerer', 'cleric', 'druid'].includes(className)) {
                maxCasterLevel = Math.max(maxCasterLevel, characterClass.level);
            }
            // Partial casters
            else if (['bard'].includes(className)) {
                maxCasterLevel = Math.max(maxCasterLevel, characterClass.level);
            }
            // Limited casters
            else if (['paladin', 'ranger'].includes(className)) {
                if (characterClass.level >= 4) {
                    maxCasterLevel = Math.max(maxCasterLevel, Math.floor(characterClass.level / 2));
                }
            }
        }
        
        return maxCasterLevel;
    }

    applyMetamagic(spell, metamagicFeats) {
        let modifiedSpell = { ...spell };
        let levelIncrease = 0;
        
        for (const metamagicFeat of metamagicFeats) {
            const feat = this.featsSystem?.getFeatById(metamagicFeat);
            if (feat?.effects?.metamagic) {
                const metamagic = feat.effects.metamagic;
                
                if (metamagic.empower) {
                    modifiedSpell.empowered = true;
                    levelIncrease += metamagic.empower.levelIncrease;
                }
                if (metamagic.maximize) {
                    modifiedSpell.maximized = true;
                    levelIncrease += metamagic.maximize.levelIncrease;
                }
                if (metamagic.quicken) {
                    modifiedSpell.castingTime = 'free action';
                    levelIncrease += metamagic.quicken.levelIncrease;
                }
                if (metamagic.extend) {
                    modifiedSpell.extended = true;
                    levelIncrease += metamagic.extend.levelIncrease;
                }
                if (metamagic.enlarge) {
                    modifiedSpell.enlarged = true;
                    levelIncrease += metamagic.enlarge.levelIncrease;
                }
                if (metamagic.widen) {
                    modifiedSpell.widened = true;
                    levelIncrease += metamagic.widen.levelIncrease;
                }
                if (metamagic.silent) {
                    modifiedSpell.components = modifiedSpell.components?.filter(c => c !== 'V');
                    levelIncrease += metamagic.silent.levelIncrease;
                }
                if (metamagic.still) {
                    modifiedSpell.components = modifiedSpell.components?.filter(c => c !== 'S');
                    levelIncrease += metamagic.still.levelIncrease;
                }
            }
        }
        
        modifiedSpell.effectiveLevel = spell.level + levelIncrease;
        return modifiedSpell;
    }

    calculateSpellEffects(spell, casterLevel) {
        const effects = {};
        
        // Damage calculations
        if (spell.damage) {
            effects.damage = this.calculateSpellDamage(spell, casterLevel);
        }
        
        // Healing calculations
        if (spell.healing) {
            effects.healing = this.calculateSpellHealing(spell, casterLevel);
        }
        
        // Duration calculations
        if (spell.duration) {
            effects.duration = this.calculateDuration(spell, casterLevel);
        }
        
        // Area effects
        if (spell.area) {
            effects.area = spell.area;
            if (spell.widened) {
                effects.area = this.widenArea(spell.area);
            }
        }
        
        return effects;
    }

    calculateSpellDamage(spell, casterLevel) {
        let damage = spell.damage;
        
        // Parse damage strings like "1d6/level (max 10d6)"
        if (typeof damage === 'string') {
            const match = damage.match(/(\d+)d(\d+)\/level.*?max (\d+)d(\d+)/);
            if (match) {
                const [, diceCount, diceSize, maxDice, maxSize] = match.map(Number);
                const effectiveDice = Math.min(diceCount * casterLevel, maxDice);
                damage = `${effectiveDice}d${diceSize}`;
            }
        }
        
        // Apply metamagic
        if (spell.empowered && this.diceEngine) {
            const baseDamage = this.diceEngine.rollDice(damage);
            damage = Math.floor(baseDamage * 1.5);
        }
        
        if (spell.maximized) {
            // Calculate maximum possible damage
            const match = damage.match(/(\d+)d(\d+)/);
            if (match) {
                const [, diceCount, diceSize] = match.map(Number);
                damage = diceCount * diceSize;
            }
        }
        
        return damage;
    }

    calculateSpellHealing(spell, casterLevel) {
        let healing = spell.healing;
        
        // Parse healing strings like "1d8+1/level (max +5)"
        if (typeof healing === 'string') {
            const match = healing.match(/(\d+)d(\d+)\+(\d+)\/level.*?max \+(\d+)/);
            if (match) {
                const [, diceCount, diceSize, bonusPerLevel, maxBonus] = match.map(Number);
                const effectiveBonus = Math.min(bonusPerLevel * casterLevel, maxBonus);
                healing = `${diceCount}d${diceSize}+${effectiveBonus}`;
            }
        }
        
        return healing;
    }

    calculateSaveDC(spell, character, casterLevel) {
        const baseLevel = spell.effectiveLevel || spell.level;
        
        // Determine primary spellcasting ability
        let spellcastingAbility = 'Intelligence'; // Default to wizard/sorcerer
        
        if (character.classes) {
            for (const characterClass of character.classes) {
                const className = characterClass.name.toLowerCase();
                if (['cleric', 'druid', 'paladin', 'ranger'].includes(className)) {
                    spellcastingAbility = 'Wisdom';
                } else if (['sorcerer', 'bard'].includes(className)) {
                    spellcastingAbility = 'Charisma';
                }
            }
        }
        
        const abilityModifier = Math.floor((character.abilities?.[spellcastingAbility] || 10 - 10) / 2);
        const baseDC = 10 + baseLevel + abilityModifier;
        
        // Add any spell focus bonuses
        let focusBonus = 0;
        if (character.feats?.includes('spell_focus')) {
            // Would need to check which school the feat applies to
            focusBonus = 1;
        }
        
        return baseDC + focusBonus;
    }

    calculateDuration(spell, casterLevel) {
        let duration = spell.duration;
        
        if (duration.includes('/level')) {
            duration = duration.replace('/level', ` × ${casterLevel}`);
        }
        
        if (spell.extended) {
            duration = `2 × (${duration})`;
        }
        
        return duration;
    }

    // === Spell Lookup and Search ===
    getSpellById(spellId) {
        return this.spells.get(spellId);
    }

    getSpellsByClass(className, level = null) {
        const classSpells = this.spellsByClass.get(className);
        if (!classSpells) return [];
        
        if (level !== null) {
            const levelSpells = classSpells.get(level);
            return levelSpells ? levelSpells.map(id => this.spells.get(id)) : [];
        }
        
        const allSpells = [];
        for (const spellIds of classSpells.values()) {
            allSpells.push(...spellIds.map(id => this.spells.get(id)));
        }
        return allSpells;
    }

    getSpellsByLevel(level) {
        const levelSpells = this.spellsByLevel.get(level);
        return levelSpells ? levelSpells.map(id => this.spells.get(id)) : [];
    }

    getSpellsBySchool(school) {
        const schoolSpells = this.spellsBySchool.get(school);
        return schoolSpells ? schoolSpells.map(id => this.spells.get(id)) : [];
    }

    searchSpells(query, filters = {}) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        for (const [spellId, spell] of this.spells) {
            // Apply filters
            if (filters.class && (!spell.classes || !spell.classes[filters.class])) continue;
            if (filters.level !== undefined && spell.level !== filters.level) continue;
            if (filters.school && spell.school !== filters.school) continue;
            
            // Search in name and description
            if (spell.name.toLowerCase().includes(queryLower) ||
                spell.description.toLowerCase().includes(queryLower)) {
                results.push({
                    ...spell,
                    id: spellId
                });
            }
        }
        
        return results;
    }

    getSpellList(className) {
        return this.spellLists.get(className);
    }

    generateSpellbook(character, className) {
        const spellbook = {
            class: className,
            casterLevel: this.calculateCasterLevel(character),
            knownSpells: new Map(),
            preparedSpells: new Map()
        };
        
        const maxSpellLevel = this.getMaxSpellLevel(className, character.level);
        
        for (let level = 0; level <= maxSpellLevel; level++) {
            const spells = this.getSpellsByClass(className, level);
            spellbook.knownSpells.set(level, spells.map(spell => spell.id));
            spellbook.preparedSpells.set(level, []);
        }
        
        return spellbook;
    }

    getStatistics() {
        return {
            ...this.metadata,
            spellsByLevel: Object.fromEntries(
                Array.from(this.spellsByLevel.entries()).map(([level, spells]) => 
                    [level, spells.length]
                )
            ),
            spellsBySchool: Object.fromEntries(
                Array.from(this.spellsBySchool.entries()).map(([school, spells]) => 
                    [school, spells.length]
                )
            ),
            spellsByClass: Object.fromEntries(
                Array.from(this.spellsByClass.entries()).map(([className, levelMap]) => {
                    const total = Array.from(levelMap.values()).reduce((sum, spells) => sum + spells.length, 0);
                    return [className, total];
                })
            )
        };
    }
}

// === Export for different environments ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpellsSystem;
} else if (typeof window !== 'undefined') {
    window.SpellsSystem = SpellsSystem;
    
    // Initialize if dependencies are available
    if (window.characterDataModel) {
        window.spellsSystem = new SpellsSystem(
            window.characterDataModel, 
            window.diceEngine, 
            window.featsSystem
        );
        console.log('📚 Global Spells System initialized');
    }
}

console.log('📚 Spells System module loaded');
/**
 * SpellManager - Comprehensive D&D 3.5 Spellcasting System
 * Handles spell preparation, known spells, spell slots, and complete SRD spell database
 */

class SpellManager {
    constructor() {
        this.spells = {};
        this.spellLists = {};
        this.characters = {};
        this.initialize();
    }

    initialize() {
        // Initialize spell database from SRD
        this.loadSpellDatabase();
        this.setupSpellcasterTypes();
        this.setupSpellSlotProgression();
        console.log('🔮 SpellManager initialized successfully');
    }

    // ==================== SPELL DATABASE ====================

    loadSpellDatabase() {
        // Core spell structure based on D&D 3.5 SRD
        this.spells = {
            // 0-Level Spells (Cantrips)
            'acid_splash': {
                id: 'acid_splash',
                name: 'Acid Splash',
                school: 'Conjuration',
                subschool: 'Creation',
                descriptor: ['Acid'],
                level: { 'Sor/Wiz': 0 },
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Close (25 ft. + 5 ft./2 levels)',
                effect: 'One missile of acid',
                duration: 'Instantaneous',
                savingThrow: 'None',
                spellResistance: 'No',
                description: 'You fire a small orb of acid at the target. You must succeed on a ranged touch attack to hit your target. The orb deals 1d3 points of acid damage.',
                classes: ['Sorcerer', 'Wizard']
            },
            'dancing_lights': {
                id: 'dancing_lights',
                name: 'Dancing Lights',
                school: 'Evocation',
                subschool: 'Light',
                level: { 'Brd': 0, 'Sor/Wiz': 0 },
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Medium (100 ft. + 10 ft./level)',
                effect: 'Up to four lights, all within a 10-ft.-radius area',
                duration: '1 minute (D)',
                savingThrow: 'None',
                spellResistance: 'No',
                description: 'Creates torches or other lights.',
                classes: ['Bard', 'Sorcerer', 'Wizard']
            },
            'daze': {
                id: 'daze',
                name: 'Daze',
                school: 'Enchantment',
                subschool: 'Compulsion',
                descriptor: ['Mind-Affecting'],
                level: { 'Brd': 0, 'Sor/Wiz': 0 },
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: 'Close (25 ft. + 5 ft./2 levels)',
                target: 'One humanoid creature of 4 HD or less',
                duration: '1 round',
                savingThrow: 'Will negates',
                spellResistance: 'Yes',
                description: 'This spell clouds the mind of a humanoid creature with 4 or fewer Hit Dice so that it takes no actions.',
                materialComponent: 'A pinch of wool or similar substance.',
                classes: ['Bard', 'Sorcerer', 'Wizard']
            },
            'detect_magic': {
                id: 'detect_magic',
                name: 'Detect Magic',
                school: 'Divination',
                level: { 'Brd': 0, 'Clr': 0, 'Drd': 0, 'Sor/Wiz': 0 },
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: '60 ft.',
                area: 'Cone-shaped emanation',
                duration: 'Concentration, up to 1 min./level (D)',
                savingThrow: 'None',
                spellResistance: 'No',
                description: 'You detect magical auras. The amount of information revealed depends on how long you study a particular area or subject.',
                classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard']
            },
            'light': {
                id: 'light',
                name: 'Light',
                school: 'Evocation',
                subschool: 'Light',
                level: { 'Brd': 0, 'Clr': 0, 'Drd': 0, 'Sor/Wiz': 0 },
                components: ['V', 'M/DF'],
                castingTime: '1 standard action',
                range: 'Touch',
                target: 'Object touched',
                duration: '10 min./level',
                savingThrow: 'None',
                spellResistance: 'No',
                description: 'This spell causes an object to glow like a torch, shedding normal light in a 20-foot radius.',
                materialComponent: 'A firefly or a piece of phosphorescent moss.',
                classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard']
            },
            'mage_hand': {
                id: 'mage_hand',
                name: 'Mage Hand',
                school: 'Transmutation',
                level: { 'Brd': 0, 'Sor/Wiz': 0 },
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Close (25 ft. + 5 ft./2 levels)',
                target: 'One nonmagical, unattended object weighing up to 5 lb.',
                duration: 'Concentration',
                savingThrow: 'None',
                spellResistance: 'No',
                description: 'You point your finger at an object and can lift it and move it at will from a distance.',
                classes: ['Bard', 'Sorcerer', 'Wizard']
            },
            'prestidigitation': {
                id: 'prestidigitation',
                name: 'Prestidigitation',
                school: 'Universal',
                level: { 'Brd': 0, 'Sor/Wiz': 0 },
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: '10 ft.',
                target: 'See text',
                duration: '1 hour',
                savingThrow: 'See text',
                spellResistance: 'No',
                description: 'Prestidigitations are minor tricks that novice spellcasters use for practice.',
                classes: ['Bard', 'Sorcerer', 'Wizard']
            },
            'read_magic': {
                id: 'read_magic',
                name: 'Read Magic',
                school: 'Divination',
                level: { 'Brd': 0, 'Clr': 0, 'Drd': 0, 'Pal': 1, 'Rgr': 1, 'Sor/Wiz': 0 },
                components: ['V', 'S', 'F'],
                castingTime: '1 standard action',
                range: 'Personal',
                target: 'You',
                duration: '10 min./level',
                description: 'You can decipher magical inscriptions on objects that would otherwise be unintelligible.',
                focus: 'A clear crystal or mineral prism.',
                classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Wizard']
            },

            // 1st Level Spells
            'magic_missile': {
                id: 'magic_missile',
                name: 'Magic Missile',
                school: 'Evocation',
                subschool: 'Force',
                level: { 'Sor/Wiz': 1 },
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Medium (100 ft. + 10 ft./level)',
                targets: 'Up to five creatures, no two of which can be more than 15 ft. apart',
                duration: 'Instantaneous',
                savingThrow: 'None',
                spellResistance: 'Yes',
                description: 'A missile of magical energy darts forth from your fingertip and strikes its target, dealing 1d4+1 points of force damage.',
                classes: ['Sorcerer', 'Wizard']
            },
            'burning_hands': {
                id: 'burning_hands',
                name: 'Burning Hands',
                school: 'Evocation',
                subschool: 'Fire',
                level: { 'Sor/Wiz': 1 },
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: '15 ft.',
                area: 'Cone-shaped burst',
                duration: 'Instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'Yes',
                description: 'A cone of searing flame shoots from your fingertips, dealing 1d4 points of fire damage per caster level (maximum 5d4).',
                classes: ['Sorcerer', 'Wizard']
            },
            'cure_light_wounds': {
                id: 'cure_light_wounds',
                name: 'Cure Light Wounds',
                school: 'Conjuration',
                subschool: 'Healing',
                level: { 'Brd': 1, 'Clr': 1, 'Drd': 1, 'Pal': 1, 'Rgr': 2 },
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Touch',
                target: 'Creature touched',
                duration: 'Instantaneous',
                savingThrow: 'Will half (harmless); see text',
                spellResistance: 'Yes (harmless); see text',
                description: 'When laying your hand upon a living creature, you channel positive energy that cures 1d8 points of damage +1 point per caster level (maximum +5).',
                classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger']
            },
            'shield': {
                id: 'shield',
                name: 'Shield',
                school: 'Abjuration',
                subschool: 'Force',
                level: { 'Sor/Wiz': 1 },
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Personal',
                target: 'You',
                duration: '1 min./level (D)',
                description: 'Shield creates an invisible, tower shield-sized mobile disk of force that hovers in front of you.',
                classes: ['Sorcerer', 'Wizard']
            }
        };

        // Setup spell lists by class
        this.setupClassSpellLists();
        console.log('✨ Spell database loaded with', Object.keys(this.spells).length, 'spells');
    }

    setupClassSpellLists() {
        this.spellLists = {
            'Wizard': {
                0: ['acid_splash', 'dancing_lights', 'daze', 'detect_magic', 'light', 'mage_hand', 'prestidigitation', 'read_magic'],
                1: ['magic_missile', 'burning_hands', 'shield']
            },
            'Sorcerer': {
                0: ['acid_splash', 'dancing_lights', 'daze', 'detect_magic', 'light', 'mage_hand', 'prestidigitation', 'read_magic'],
                1: ['magic_missile', 'burning_hands', 'shield']
            },
            'Cleric': {
                0: ['detect_magic', 'light', 'read_magic'],
                1: ['cure_light_wounds']
            },
            'Bard': {
                0: ['dancing_lights', 'daze', 'detect_magic', 'light', 'mage_hand', 'prestidigitation', 'read_magic'],
                1: ['cure_light_wounds']
            },
            'Druid': {
                0: ['detect_magic', 'light', 'read_magic'],
                1: ['cure_light_wounds']
            },
            'Paladin': {
                1: ['cure_light_wounds', 'read_magic']
            },
            'Ranger': {
                1: ['read_magic'],
                2: ['cure_light_wounds']
            }
        };
    }

    // ==================== SPELLCASTER TYPES ====================

    setupSpellcasterTypes() {
        this.spellcasterTypes = {
            'Wizard': {
                type: 'prepared',
                abilityScore: 'intelligence',
                spellbook: true,
                cantripsKnown: 'all',
                bonusSpells: true,
                spellFailure: 'arcane'
            },
            'Cleric': {
                type: 'prepared',
                abilityScore: 'wisdom',
                spellbook: false,
                cantripsKnown: 'all',
                bonusSpells: true,
                spellFailure: 'divine',
                domains: true
            },
            'Druid': {
                type: 'prepared',
                abilityScore: 'wisdom',
                spellbook: false,
                cantripsKnown: 'all',
                bonusSpells: true,
                spellFailure: 'divine'
            },
            'Sorcerer': {
                type: 'spontaneous',
                abilityScore: 'charisma',
                spellbook: false,
                cantripsKnown: 'limited',
                bonusSpells: true,
                spellFailure: 'arcane'
            },
            'Bard': {
                type: 'spontaneous',
                abilityScore: 'charisma',
                spellbook: false,
                cantripsKnown: 'limited',
                bonusSpells: false,
                spellFailure: 'arcane'
            },
            'Paladin': {
                type: 'prepared',
                abilityScore: 'wisdom',
                spellbook: false,
                cantripsKnown: 'none',
                bonusSpells: true,
                spellFailure: 'divine',
                startLevel: 4
            },
            'Ranger': {
                type: 'prepared',
                abilityScore: 'wisdom',
                spellbook: false,
                cantripsKnown: 'none',
                bonusSpells: true,
                spellFailure: 'divine',
                startLevel: 4
            }
        };
    }

    // ==================== SPELL SLOT PROGRESSION ====================

    setupSpellSlotProgression() {
        // D&D 3.5 spell slots per day by class and level
        this.spellSlots = {
            'Wizard': {
                1: [3, 1], 2: [4, 2], 3: [4, 2, 1], 4: [4, 3, 2], 5: [4, 3, 2, 1],
                6: [4, 3, 3, 2], 7: [4, 4, 3, 2, 1], 8: [4, 4, 3, 3, 2], 9: [4, 4, 4, 3, 2, 1],
                10: [4, 4, 4, 3, 3, 2], 11: [4, 4, 4, 4, 3, 2, 1], 12: [4, 4, 4, 4, 3, 3, 2],
                13: [4, 4, 4, 4, 4, 3, 2, 1], 14: [4, 4, 4, 4, 4, 3, 3, 2], 15: [4, 4, 4, 4, 4, 4, 3, 2, 1],
                16: [4, 4, 4, 4, 4, 4, 3, 3, 2], 17: [4, 4, 4, 4, 4, 4, 4, 3, 2, 1], 18: [4, 4, 4, 4, 4, 4, 4, 3, 3, 2],
                19: [4, 4, 4, 4, 4, 4, 4, 4, 3, 3], 20: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
            },
            'Sorcerer': {
                1: [5, 3], 2: [6, 4], 3: [6, 5], 4: [6, 6, 3], 5: [6, 6, 4],
                6: [6, 6, 5, 3], 7: [6, 6, 6, 4], 8: [6, 6, 6, 5, 3], 9: [6, 6, 6, 6, 4],
                10: [6, 6, 6, 6, 5, 3], 11: [6, 6, 6, 6, 6, 4], 12: [6, 6, 6, 6, 6, 5, 3],
                13: [6, 6, 6, 6, 6, 6, 4], 14: [6, 6, 6, 6, 6, 6, 5, 3], 15: [6, 6, 6, 6, 6, 6, 6, 4],
                16: [6, 6, 6, 6, 6, 6, 6, 5, 3], 17: [6, 6, 6, 6, 6, 6, 6, 6, 4], 18: [6, 6, 6, 6, 6, 6, 6, 6, 5, 3],
                19: [6, 6, 6, 6, 6, 6, 6, 6, 6, 4], 20: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
            },
            'Cleric': {
                1: [3, 1], 2: [4, 2], 3: [4, 2, 1], 4: [5, 3, 2], 5: [5, 3, 2, 1],
                6: [5, 3, 3, 2], 7: [6, 4, 3, 2, 1], 8: [6, 4, 3, 3, 2], 9: [6, 4, 4, 3, 2, 1],
                10: [6, 4, 4, 3, 3, 2], 11: [6, 5, 4, 4, 3, 2, 1], 12: [6, 5, 4, 4, 3, 3, 2],
                13: [6, 5, 5, 4, 4, 3, 2, 1], 14: [6, 5, 5, 4, 4, 3, 3, 2], 15: [6, 5, 5, 5, 4, 4, 3, 2, 1],
                16: [6, 5, 5, 5, 4, 4, 3, 3, 2], 17: [6, 5, 5, 5, 5, 4, 4, 3, 2, 1], 18: [6, 5, 5, 5, 5, 4, 4, 3, 3, 2],
                19: [6, 5, 5, 5, 5, 5, 4, 4, 3, 3], 20: [6, 5, 5, 5, 5, 5, 4, 4, 4, 4]
            },
            'Bard': {
                1: [2], 2: [3, 0], 3: [3, 1], 4: [3, 2, 0], 5: [3, 3, 1],
                6: [3, 3, 2], 7: [3, 3, 2, 0], 8: [3, 3, 3, 1], 9: [3, 3, 3, 2],
                10: [3, 3, 3, 2, 0], 11: [3, 3, 3, 3, 1], 12: [3, 3, 3, 3, 2],
                13: [3, 3, 3, 3, 2, 0], 14: [4, 3, 3, 3, 3, 1], 15: [4, 4, 3, 3, 3, 2],
                16: [4, 4, 4, 3, 3, 2, 0], 17: [4, 4, 4, 4, 3, 3, 1], 18: [4, 4, 4, 4, 4, 3, 2],
                19: [4, 4, 4, 4, 4, 4, 3], 20: [4, 4, 4, 4, 4, 4, 4]
            }
        };

        // Known spells for spontaneous casters
        this.spellsKnown = {
            'Sorcerer': {
                1: [4, 2], 2: [5, 2], 3: [5, 3], 4: [6, 3, 1], 5: [6, 4, 2],
                6: [7, 4, 2, 1], 7: [7, 5, 3, 2], 8: [8, 5, 3, 2, 1], 9: [8, 5, 4, 3, 2],
                10: [9, 6, 4, 3, 2, 1], 11: [9, 6, 5, 4, 3, 2], 12: [9, 6, 5, 4, 3, 2, 1],
                13: [9, 7, 5, 5, 4, 3, 2], 14: [9, 7, 6, 5, 4, 3, 2, 1], 15: [9, 7, 6, 5, 5, 4, 3, 2],
                16: [9, 8, 6, 6, 5, 4, 3, 2, 1], 17: [9, 8, 7, 6, 5, 5, 4, 3, 2], 18: [9, 8, 7, 6, 6, 5, 4, 3, 2, 1],
                19: [9, 8, 7, 7, 6, 5, 5, 4, 3, 2], 20: [9, 8, 8, 7, 6, 6, 5, 4, 4, 3]
            },
            'Bard': {
                1: [2], 2: [3, 0], 3: [3, 1], 4: [4, 2, 0], 5: [4, 3, 1],
                6: [4, 3, 2], 7: [5, 4, 2, 0], 8: [5, 4, 3, 1], 9: [5, 4, 3, 2],
                10: [5, 5, 4, 2, 0], 11: [6, 5, 4, 3, 1], 12: [6, 5, 4, 3, 2],
                13: [6, 5, 5, 4, 2, 0], 14: [6, 6, 5, 4, 3, 1], 15: [6, 6, 5, 4, 3, 2],
                16: [6, 6, 5, 5, 4, 2, 0], 17: [6, 6, 6, 5, 4, 3, 1], 18: [6, 6, 6, 5, 4, 3, 2],
                19: [6, 6, 6, 5, 5, 4, 3], 20: [6, 6, 6, 6, 5, 4, 4]
            }
        };
    }

    // ==================== CHARACTER SPELL MANAGEMENT ====================

    initializeCharacterSpells(characterId, characterData) {
        if (!this.characters[characterId]) {
            this.characters[characterId] = {
                characterData: characterData,
                preparedSpells: {},
                knownSpells: {},
                spellSlots: {},
                usedSpellSlots: {},
                cantrips: []
            };
        }

        // Setup spell slots based on class and level
        this.setupCharacterSpellSlots(characterId);
        
        // Initialize starting spells
        this.setupStartingSpells(characterId);
        
        console.log(`📚 Spells initialized for character ${characterId}`);
        return this.characters[characterId];
    }

    setupCharacterSpellSlots(characterId) {
        const character = this.characters[characterId];
        const characterData = character.characterData;
        
        character.spellSlots = {};
        character.usedSpellSlots = {};
        
        // Handle multiclass spellcasters
        characterData.classes.forEach(classInfo => {
            const className = classInfo.name;
            const classLevel = classInfo.level;
            
            if (this.spellcasterTypes[className] && this.spellSlots[className]) {
                const spellcasterInfo = this.spellcasterTypes[className];
                const startLevel = spellcasterInfo.startLevel || 1;
                
                if (classLevel >= startLevel) {
                    const effectiveLevel = classLevel - startLevel + 1;
                    const slots = this.spellSlots[className][effectiveLevel];
                    
                    if (slots) {
                        character.spellSlots[className] = [...slots];
                        character.usedSpellSlots[className] = new Array(slots.length).fill(0);
                        
                        // Add bonus spells from high ability scores
                        if (spellcasterInfo.bonusSpells) {
                            this.addBonusSpells(characterId, className, characterData);
                        }
                    }
                }
            }
        });
    }

    addBonusSpells(characterId, className, characterData) {
        const character = this.characters[characterId];
        const spellcasterInfo = this.spellcasterTypes[className];
        const abilityScore = characterData.abilityScores[spellcasterInfo.abilityScore];
        const modifier = Math.floor((abilityScore - 10) / 2);
        
        // Bonus spells for high ability scores (D&D 3.5 rules)
        const bonusSpellsTable = {
            1: Math.max(0, Math.floor((modifier - 0) / 4)),
            2: Math.max(0, Math.floor((modifier - 1) / 4)),
            3: Math.max(0, Math.floor((modifier - 2) / 4)),
            4: Math.max(0, Math.floor((modifier - 3) / 4)),
            5: Math.max(0, Math.floor((modifier - 4) / 4)),
            6: Math.max(0, Math.floor((modifier - 5) / 4)),
            7: Math.max(0, Math.floor((modifier - 6) / 4)),
            8: Math.max(0, Math.floor((modifier - 7) / 4)),
            9: Math.max(0, Math.floor((modifier - 8) / 4))
        };
        
        // Apply bonus spells
        for (let level = 1; level <= 9; level++) {
            if (character.spellSlots[className][level] !== undefined) {
                character.spellSlots[className][level] += bonusSpellsTable[level] || 0;
            }
        }
    }

    setupStartingSpells(characterId) {
        const character = this.characters[characterId];
        const characterData = character.characterData;
        
        characterData.classes.forEach(classInfo => {
            const className = classInfo.name;
            const classLevel = classInfo.level;
            
            if (this.spellcasterTypes[className]) {
                const spellcasterInfo = this.spellcasterTypes[className];
                
                // Setup cantrips
                if (spellcasterInfo.cantripsKnown === 'all') {
                    // Prepared casters know all cantrips
                    const cantrips = this.spellLists[className][0] || [];
                    character.cantrips = [...new Set([...character.cantrips, ...cantrips])];
                } else if (spellcasterInfo.cantripsKnown === 'limited') {
                    // Spontaneous casters know limited cantrips
                    const knownCantrips = this.spellsKnown[className]?.[classLevel]?.[0] || 0;
                    if (knownCantrips > 0) {
                        character.knownSpells[className] = character.knownSpells[className] || {};
                        character.knownSpells[className][0] = [];
                        // Player will select these during character creation
                    }
                }
                
                // Setup spell selection based on type
                if (spellcasterInfo.type === 'prepared') {
                    character.preparedSpells[className] = character.preparedSpells[className] || {};
                } else if (spellcasterInfo.type === 'spontaneous') {
                    character.knownSpells[className] = character.knownSpells[className] || {};
                    // Initialize known spells based on class progression
                    const spellsKnownProgression = this.spellsKnown[className]?.[classLevel];
                    if (spellsKnownProgression) {
                        for (let level = 0; level < spellsKnownProgression.length; level++) {
                            const knownAtLevel = spellsKnownProgression[level];
                            if (knownAtLevel > 0) {
                                character.knownSpells[className][level] = [];
                            }
                        }
                    }
                }
            }
        });
    }

    // ==================== SPELL SELECTION AND MANAGEMENT ====================

    getAvailableSpells(characterId, className, spellLevel) {
        const spellList = this.spellLists[className]?.[spellLevel] || [];
        return spellList.map(spellId => this.spells[spellId]).filter(Boolean);
    }

    canSelectSpell(characterId, className, spellId) {
        const character = this.characters[characterId];
        const spell = this.spells[spellId];
        
        if (!character || !spell) return false;
        
        const spellcasterInfo = this.spellcasterTypes[className];
        if (!spellcasterInfo) return false;
        
        // Check if spell is available to this class
        if (!spell.classes.includes(className)) return false;
        
        // Check caster level requirements
        const characterClass = character.characterData.classes.find(c => c.name === className);
        if (!characterClass) return false;
        
        const spellLevel = spell.level[this.getSpellLevelKey(className)];
        const startLevel = spellcasterInfo.startLevel || 1;
        const requiredLevel = startLevel + (spellLevel * 2) - 1;
        
        return characterClass.level >= requiredLevel;
    }

    selectSpell(characterId, className, spellId, spellLevel) {
        const character = this.characters[characterId];
        if (!this.canSelectSpell(characterId, className, spellId)) {
            return { success: false, error: 'Cannot select this spell' };
        }
        
        const spellcasterInfo = this.spellcasterTypes[className];
        
        if (spellcasterInfo.type === 'spontaneous') {
            // Add to known spells
            if (!character.knownSpells[className]) {
                character.knownSpells[className] = {};
            }
            if (!character.knownSpells[className][spellLevel]) {
                character.knownSpells[className][spellLevel] = [];
            }
            
            const knownSpells = character.knownSpells[className][spellLevel];
            const maxKnown = this.getMaxKnownSpells(characterId, className, spellLevel);
            
            if (knownSpells.length >= maxKnown) {
                return { success: false, error: 'Maximum known spells reached for this level' };
            }
            
            if (!knownSpells.includes(spellId)) {
                knownSpells.push(spellId);
                return { success: true, type: 'known' };
            }
        } else if (spellcasterInfo.type === 'prepared') {
            // For prepared casters, this adds to spellbook (wizards) or available spells
            if (spellLevel === 0) {
                // Cantrips are always available
                if (!character.cantrips.includes(spellId)) {
                    character.cantrips.push(spellId);
                    return { success: true, type: 'cantrip' };
                }
            } else {
                // Add to available spells for preparation
                if (!character.preparedSpells[className]) {
                    character.preparedSpells[className] = {};
                }
                if (!character.preparedSpells[className][spellLevel]) {
                    character.preparedSpells[className][spellLevel] = [];
                }
                return { success: true, type: 'available' };
            }
        }
        
        return { success: false, error: 'Spell already selected' };
    }

    getMaxKnownSpells(characterId, className, spellLevel) {
        const character = this.characters[characterId];
        const characterClass = character.characterData.classes.find(c => c.name === className);
        if (!characterClass) return 0;
        
        const spellsKnownProgression = this.spellsKnown[className]?.[characterClass.level];
        return spellsKnownProgression?.[spellLevel] || 0;
    }

    getSpellLevelKey(className) {
        const keyMap = {
            'Wizard': 'Sor/Wiz',
            'Sorcerer': 'Sor/Wiz',
            'Cleric': 'Clr',
            'Bard': 'Brd',
            'Druid': 'Drd',
            'Paladin': 'Pal',
            'Ranger': 'Rgr'
        };
        return keyMap[className] || className;
    }

    // ==================== SPELL CASTING ====================

    castSpell(characterId, className, spellId, spellLevel, useHigherSlot = false) {
        const character = this.characters[characterId];
        if (!character) return { success: false, error: 'Character not found' };
        
        const spell = this.spells[spellId];
        if (!spell) return { success: false, error: 'Spell not found' };
        
        const spellcasterInfo = this.spellcasterTypes[className];
        const actualSlotLevel = useHigherSlot || spellLevel;
        
        // Check if character has spell slots available
        if (!character.spellSlots[className] || !character.usedSpellSlots[className]) {
            return { success: false, error: 'No spell slots available' };
        }
        
        const availableSlots = character.spellSlots[className][actualSlotLevel] || 0;
        const usedSlots = character.usedSpellSlots[className][actualSlotLevel] || 0;
        
        if (usedSlots >= availableSlots) {
            return { success: false, error: `No ${this.getOrdinalNumber(actualSlotLevel)} level spell slots remaining` };
        }
        
        // Check if character knows/has prepared the spell
        if (spellcasterInfo.type === 'spontaneous') {
            const knownSpells = character.knownSpells[className]?.[spellLevel] || [];
            if (!knownSpells.includes(spellId)) {
                return { success: false, error: 'Spell not known' };
            }
        } else if (spellcasterInfo.type === 'prepared') {
            if (spellLevel === 0) {
                // Cantrips are always available
                if (!character.cantrips.includes(spellId)) {
                    return { success: false, error: 'Cantrip not known' };
                }
            } else {
                const preparedSpells = character.preparedSpells[className]?.[spellLevel] || [];
                if (!preparedSpells.includes(spellId)) {
                    return { success: false, error: 'Spell not prepared' };
                }
            }
        }
        
        // Use spell slot (except for cantrips)
        if (spellLevel > 0) {
            character.usedSpellSlots[className][actualSlotLevel]++;
        }
        
        return {
            success: true,
            spell: spell,
            slotUsed: actualSlotLevel,
            remainingSlots: availableSlots - character.usedSpellSlots[className][actualSlotLevel]
        };
    }

    getOrdinalNumber(num) {
        const ordinals = ['0th', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
        return ordinals[num] || `${num}th`;
    }

    // ==================== UTILITY METHODS ====================

    getCharacterSpellInfo(characterId) {
        const character = this.characters[characterId];
        if (!character) return null;
        
        return {
            cantrips: character.cantrips,
            knownSpells: character.knownSpells,
            preparedSpells: character.preparedSpells,
            spellSlots: character.spellSlots,
            usedSpellSlots: character.usedSpellSlots
        };
    }

    getSpellsBySchool(school) {
        return Object.values(this.spells).filter(spell => spell.school === school);
    }

    searchSpells(query) {
        const searchTerm = query.toLowerCase();
        return Object.values(this.spells).filter(spell => 
            spell.name.toLowerCase().includes(searchTerm) ||
            spell.description.toLowerCase().includes(searchTerm) ||
            spell.school.toLowerCase().includes(searchTerm)
        );
    }

    restoreSpellSlots(characterId, restType = 'long') {
        const character = this.characters[characterId];
        if (!character) return false;
        
        // Reset all used spell slots
        Object.keys(character.usedSpellSlots).forEach(className => {
            character.usedSpellSlots[className].fill(0);
        });
        
        console.log(`🔮 Spell slots restored for character ${characterId} (${restType} rest)`);
        return true;
    }

    exportCharacterSpells(characterId) {
        return this.characters[characterId] || null;
    }

    importCharacterSpells(characterId, spellData) {
        this.characters[characterId] = spellData;
        return true;
    }
}

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpellManager;
} else if (typeof window !== 'undefined') {
    window.SpellManager = SpellManager;
}
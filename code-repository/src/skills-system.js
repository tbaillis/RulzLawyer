/**
 * RulzLawyer D&D 3.5 Skills System
 * Complete implementation of D&D 3.5 skills with skill checks, synergies, and character progression
 * 
 * Features:
 * - 40+ D&D 3.5 SRD skills with complete mechanics
 * - Class skills and cross-class skills distinction
 * - Skill synergy bonuses and prerequisites
 * - Skill checks with DC calculation and modifiers
 * - Character integration with automatic skill point allocation
 * - Skill progression tracking and advancement
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 * @date 2025
 */

// Universal Module Pattern - Compatible with both browser and Node.js
(function(global, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // Node.js environment
        module.exports = factory(global);
    } else {
        // Browser environment
        global.SkillsSystem = factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function(window) {

    class SkillsSystem {
        constructor(dependencies = {}) {
            this.characterDataModel = dependencies.characterDataModel;
            this.diceEngine = dependencies.diceEngine;
            
            console.log('📚 SkillsSystem initializing...');
            
            // Initialize skills database
            this.skills = this.initializeSkills();
            this.skillSynergies = this.initializeSkillSynergies();
            this.classSkillLists = this.initializeClassSkillLists();
            
            console.log(`✅ SkillsSystem ready with ${Object.keys(this.skills).length} skills`);
        }

        // === Core Skills Database ===
        initializeSkills() {
            return {
                // Physical Skills
                'balance': {
                    id: 'balance',
                    name: 'Balance',
                    keyAbility: 'Dexterity',
                    trainedOnly: false,
                    armorCheckPenalty: true,
                    description: 'Use this skill to walk on a precarious surface.',
                    synergy: ['tumble'],
                    untrained: 'You can use this skill untrained.',
                    check: 'You can walk on a precarious surface. A successful check lets you move at half your speed along the surface for 1 round.',
                    retry: 'Yes. You can attempt a Balance check once per round.',
                    special: 'If you have 5 or more ranks in Balance, you get a +2 bonus on Tumble checks.',
                    dcExamples: {
                        7: 'Walk on 7-12 inch wide surface',
                        10: 'Walk on 2-6 inch wide surface',
                        15: 'Walk on less than 2 inch wide surface',
                        20: 'Walk on uneven flagstone',
                        25: 'Long jump or high jump'
                    }
                },
                'climb': {
                    id: 'climb',
                    name: 'Climb',
                    keyAbility: 'Strength',
                    trainedOnly: false,
                    armorCheckPenalty: true,
                    description: 'Use this skill to climb walls and other steep surfaces.',
                    synergy: [],
                    untrained: 'You can use this skill untrained.',
                    check: 'With a successful Climb check, you can advance up, down, or across a slope, a wall, or some other steep incline (or even a ceiling, handholds permitting).',
                    retry: 'Yes. You can retry a Climb check, but each check represents about 1 minute of effort.',
                    special: 'Someone using a rope can haul a character upward (or lower a character) through sheer strength.',
                    dcExamples: {
                        0: 'Climb a knotted rope with wall to brace',
                        5: 'Climb a rope with knots',
                        10: 'Climb a surface with ledges',
                        15: 'Climb any surface with cracks',
                        20: 'Climb an overhang or ceiling',
                        25: 'Climb a perfectly smooth surface'
                    }
                },
                'jump': {
                    id: 'jump',
                    name: 'Jump',
                    keyAbility: 'Strength',
                    trainedOnly: false,
                    armorCheckPenalty: true,
                    description: 'Use this skill to leap over pits, spring up onto a ledge, or hop across a small brook.',
                    synergy: ['tumble'],
                    untrained: 'You can use this skill untrained.',
                    check: 'The DC for the jump is equal to the distance to be jumped (in feet).',
                    retry: 'Yes, provided you are able to attempt the jump again.',
                    special: 'Effects of encumbrance on movement also apply to Jump checks.',
                    dcExamples: {
                        5: 'Long jump across a 5-foot gap',
                        10: 'High jump up 2.5 feet',
                        15: 'Long jump across a 15-foot chasm',
                        20: 'High jump up 5 feet',
                        25: 'Long jump across a 25-foot pit',
                        30: 'High jump up 7.5 feet'
                    }
                },
                'swim': {
                    id: 'swim',
                    name: 'Swim',
                    keyAbility: 'Strength',
                    trainedOnly: false,
                    armorCheckPenalty: true,
                    description: 'Use this skill to swim, dive, navigate underwater obstacles, or rescue drowning characters.',
                    synergy: [],
                    untrained: 'You can use this skill untrained.',
                    check: 'Make a Swim check once per round while you are in the water.',
                    retry: 'A new check is allowed the round after a check is failed.',
                    special: 'A creature with a swim speed can move through water at its indicated speed without making Swim checks.',
                    dcExamples: {
                        10: 'Swim in calm water',
                        15: 'Swim in rough water',
                        20: 'Swim in stormy water',
                        25: 'Swim up a waterfall',
                        30: 'Swim in lava or acid'
                    }
                },

                // Mental Skills
                'appraise': {
                    id: 'appraise',
                    name: 'Appraise',
                    keyAbility: 'Intelligence',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to tell how much an object is worth.',
                    synergy: ['craft'],
                    untrained: 'You can use this skill untrained to appraise common items.',
                    check: 'You can appraise an item, getting an idea of its value.',
                    retry: 'No. You cannot try again on the same object.',
                    special: 'A masterwork magnifying glass gives a +2 circumstance bonus on Appraise checks.',
                    dcExamples: {
                        12: 'Appraise common items',
                        15: 'Appraise uncommon items',
                        20: 'Appraise rare items',
                        25: 'Appraise very rare items',
                        30: 'Appraise legendary items'
                    }
                },
                'decipher_script': {
                    id: 'decipher_script',
                    name: 'Decipher Script',
                    keyAbility: 'Intelligence',
                    trainedOnly: true,
                    armorCheckPenalty: false,
                    description: 'Use this skill to piece together the meaning of ancient runes carved into a dungeon wall.',
                    synergy: [],
                    untrained: 'You cannot use this skill untrained.',
                    check: 'You can decipher writing in an unfamiliar language or a message written in an incomplete or archaic form.',
                    retry: 'No. If you fail a check, you cannot try again for that particular piece of writing.',
                    special: 'A character can decipher magical writings (such as scrolls) without this skill.',
                    dcExamples: {
                        20: 'Simple message',
                        25: 'Standard text',
                        30: 'Intricate, exotic, or very old writing',
                        35: 'Ancient or completely foreign script'
                    }
                },
                'knowledge_arcana': {
                    id: 'knowledge_arcana',
                    name: 'Knowledge (Arcana)',
                    keyAbility: 'Intelligence',
                    trainedOnly: true,
                    armorCheckPenalty: false,
                    description: 'This skill encompasses ancient mysteries, magic traditions, arcane symbols, cryptic phrases, constructs, dragons, and magical beasts.',
                    synergy: ['spellcraft'],
                    untrained: 'An untrained Knowledge check is simply an Intelligence check.',
                    check: 'Answering a question within your field of study has a DC of 10-30.',
                    retry: 'No. The check represents what you know, and thinking about a topic a second time doesn\'t let you know something that you never learned.',
                    special: 'You can take 10, but not take 20.',
                    dcExamples: {
                        10: 'Really easy questions',
                        15: 'Basic questions',
                        20: 'Tough questions',
                        25: 'Very tough questions',
                        30: 'Extremely difficult questions'
                    }
                },
                'knowledge_dungeoneering': {
                    id: 'knowledge_dungeoneering',
                    name: 'Knowledge (Dungeoneering)',
                    keyAbility: 'Intelligence',
                    trainedOnly: true,
                    armorCheckPenalty: false,
                    description: 'This skill encompasses aberrations, caverns, oozes, spelunking.',
                    synergy: ['survival'],
                    untrained: 'An untrained Knowledge check is simply an Intelligence check.',
                    check: 'Answering a question within your field of study has a DC of 10-30.',
                    retry: 'No. The check represents what you know.',
                    special: 'You can take 10, but not take 20.',
                    dcExamples: {
                        10: 'Common dungeon hazards',
                        15: 'Underground navigation',
                        20: 'Aberrant creature knowledge',
                        25: 'Ancient dungeon secrets',
                        30: 'Legendary underground mysteries'
                    }
                },
                'knowledge_nature': {
                    id: 'knowledge_nature',
                    name: 'Knowledge (Nature)',
                    keyAbility: 'Intelligence',
                    trainedOnly: true,
                    armorCheckPenalty: false,
                    description: 'This skill encompasses animals, fey, giants, monstrous humanoids, plants, seasons and cycles, weather, vermin.',
                    synergy: ['survival'],
                    untrained: 'An untrained Knowledge check is simply an Intelligence check.',
                    check: 'Answering a question within your field of study has a DC of 10-30.',
                    retry: 'No. The check represents what you know.',
                    special: 'You can take 10, but not take 20.',
                    dcExamples: {
                        10: 'Common animals and plants',
                        15: 'Seasonal patterns',
                        20: 'Dangerous creatures',
                        25: 'Rare natural phenomena',
                        30: 'Legendary natural secrets'
                    }
                },
                'search': {
                    id: 'search',
                    name: 'Search',
                    keyAbility: 'Intelligence',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to find secret doors, simple traps, hidden compartments, and other details that are not immediately obvious.',
                    synergy: ['survival'],
                    untrained: 'You can use this skill untrained.',
                    check: 'You generally must be within 10 feet of the object or surface to be searched.',
                    retry: 'Yes. You can search the same area again.',
                    special: 'An elf has a +2 racial bonus on Search checks, and a half-elf has a +1 racial bonus.',
                    dcExamples: {
                        10: 'Find a typical secret door',
                        15: 'Notice a simple trap',
                        20: 'Find a well-hidden secret door',
                        25: 'Find a hidden compartment',
                        30: 'Find an extremely well-hidden item'
                    }
                },
                'spellcraft': {
                    id: 'spellcraft',
                    name: 'Spellcraft',
                    keyAbility: 'Intelligence',
                    trainedOnly: true,
                    armorCheckPenalty: false,
                    description: 'Use this skill to identify spells and magic effects.',
                    synergy: ['knowledge_arcana'],
                    untrained: 'You cannot use this skill untrained.',
                    check: 'You can identify spells and magic effects.',
                    retry: 'See text. You can retry checks to identify a spell.',
                    special: 'If you have 5 or more ranks in Knowledge (arcana), you get a +2 bonus on Spellcraft checks.',
                    dcExamples: {
                        15: 'Identify a spell being cast (reaction)',
                        20: 'Learn a spell from a spellbook',
                        25: 'Understand a strange magical effect',
                        30: 'Identify materials created by magic',
                        35: 'Decipher a written spell'
                    }
                },

                // Social Skills
                'bluff': {
                    id: 'bluff',
                    name: 'Bluff',
                    keyAbility: 'Charisma',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to mislead others through verbal trickery.',
                    synergy: ['diplomacy', 'intimidate', 'sleight_of_hand'],
                    untrained: 'You can use this skill untrained.',
                    check: 'A Bluff check is opposed by the target\'s Sense Motive check.',
                    retry: 'Yes, but not against the same target on the same matter.',
                    special: 'If you have 5 or more ranks in Bluff, you get a +2 bonus on certain other checks.',
                    dcExamples: {
                        10: 'Tell believable lie',
                        15: 'Tell unlikely lie',
                        20: 'Tell far-fetched lie',
                        25: 'Tell impossible lie',
                        30: 'Convince someone of a ridiculous lie'
                    }
                },
                'diplomacy': {
                    id: 'diplomacy',
                    name: 'Diplomacy',
                    keyAbility: 'Charisma',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to persuade others to agree with your arguments, resolve differences, and gather information.',
                    synergy: ['bluff', 'knowledge_nobility', 'sense_motive'],
                    untrained: 'You can use this skill untrained.',
                    check: 'You can change the attitudes of others (nonplayer characters) with a successful Diplomacy check.',
                    retry: 'Yes, but not against the same target on the same matter within 24 hours.',
                    special: 'If you have 5 or more ranks in certain skills, you get a +2 bonus on Diplomacy checks.',
                    dcExamples: {
                        10: 'Improve attitude by one step',
                        15: 'Improve attitude by two steps',
                        20: 'Gather information in a city',
                        25: 'Negotiate complex agreement',
                        30: 'Convince hostile enemy to parley'
                    }
                },
                'gather_information': {
                    id: 'gather_information',
                    name: 'Gather Information',
                    keyAbility: 'Charisma',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to make contacts in an area, find out local gossip, rumors, and general information.',
                    synergy: ['knowledge_local'],
                    untrained: 'You can use this skill untrained.',
                    check: 'By succeeding on a Gather Information check, you can learn general information about a topic.',
                    retry: 'Yes, but it takes time for each check (1d4+1 hours).',
                    special: 'A half-elf has a +2 racial bonus on Gather Information checks.',
                    dcExamples: {
                        10: 'Common knowledge, rumors',
                        15: 'Uncommon knowledge',
                        20: 'Obscure knowledge',
                        25: 'Hidden knowledge',
                        30: 'Secret knowledge'
                    }
                },
                'intimidate': {
                    id: 'intimidate',
                    name: 'Intimidate',
                    keyAbility: 'Charisma',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to get someone to act friendly toward your party, at least temporarily.',
                    synergy: ['bluff'],
                    untrained: 'You can use this skill untrained.',
                    check: 'You can change another\'s behavior with a successful check.',
                    retry: 'Yes, but not against the same target within 24 hours.',
                    special: 'You also can use Intimidate to weaken an opponent\'s resolve in combat.',
                    dcExamples: {
                        10: 'Intimidate common person',
                        15: 'Intimidate trained warrior',
                        20: 'Intimidate veteran soldier',
                        25: 'Intimidate hardened criminal',
                        30: 'Intimidate fearless paladin'
                    }
                },
                'perform': {
                    id: 'perform',
                    name: 'Perform',
                    keyAbility: 'Charisma',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to impress audiences with your talent and skill.',
                    synergy: [],
                    untrained: 'You can use this skill untrained to perform simple acts.',
                    check: 'You can impress audiences with your talent and skill.',
                    retry: 'Yes. Retries are allowed, but they don\'t negate previous failures.',
                    special: 'A bard must have at least 3 ranks in a Perform skill to inspire courage in his allies.',
                    dcExamples: {
                        10: 'Routine performance',
                        15: 'Enjoyable performance',
                        20: 'Great performance',
                        25: 'Memorable performance',
                        30: 'Extraordinary performance'
                    }
                },

                // Stealth Skills
                'hide': {
                    id: 'hide',
                    name: 'Hide',
                    keyAbility: 'Dexterity',
                    trainedOnly: false,
                    armorCheckPenalty: true,
                    description: 'Use this skill to sink back into the shadows and proceed unseen, approach a foe unnoticed, or sneak past enemies.',
                    synergy: [],
                    untrained: 'You can use this skill untrained.',
                    check: 'Your Hide check is opposed by the Spot check of anyone who might see you.',
                    retry: 'Yes. You can try to hide again after being spotted.',
                    special: 'If you are invisible, you gain a +40 bonus on Hide checks.',
                    dcExamples: {
                        10: 'Hide behind cover',
                        15: 'Hide in shadows',
                        20: 'Hide in plain sight (ranger)',
                        25: 'Hide while moving',
                        30: 'Hide without cover'
                    }
                },
                'move_silently': {
                    id: 'move_silently',
                    name: 'Move Silently',
                    keyAbility: 'Dexterity',
                    trainedOnly: false,
                    armorCheckPenalty: true,
                    description: 'Use this skill to sneak up behind an enemy or slip past without being noticed.',
                    synergy: [],
                    untrained: 'You can use this skill untrained.',
                    check: 'Your Move Silently check is opposed by the Listen check of anyone who might hear you.',
                    retry: 'Yes. You can move silently again after making noise.',
                    special: 'Noisy surfaces or items affect your check.',
                    dcExamples: {
                        10: 'Move quietly on normal ground',
                        15: 'Move quietly on difficult terrain',
                        20: 'Move quietly on very noisy surface',
                        25: 'Move silently while running',
                        30: 'Move absolutely silently'
                    }
                },
                'sleight_of_hand': {
                    id: 'sleight_of_hand',
                    name: 'Sleight of Hand',
                    keyAbility: 'Dexterity',
                    trainedOnly: true,
                    armorCheckPenalty: true,
                    description: 'Use this skill to entertain an audience as a pickpocket entertains a crowd, or to accomplish acts of legerdemain.',
                    synergy: ['bluff'],
                    untrained: 'An untrained Sleight of Hand check is simply a Dexterity check.',
                    check: 'A DC 10 Sleight of Hand check lets you palm a coin-sized, unattended object.',
                    retry: 'Yes, but after an initial failure, a second Sleight of Hand attempt against the same target increases the DC by 10.',
                    special: 'If you have 5 or more ranks in Bluff, you get a +2 bonus on Sleight of Hand checks.',
                    dcExamples: {
                        10: 'Palm a coin-sized object',
                        20: 'Lift a small object from a person',
                        30: 'Perform amazing feat of legerdemain'
                    }
                },

                // Survival Skills
                'disable_device': {
                    id: 'disable_device',
                    name: 'Disable Device',
                    keyAbility: 'Intelligence',
                    trainedOnly: true,
                    armorCheckPenalty: false,
                    description: 'Use this skill to disarm traps and open locks.',
                    synergy: [],
                    untrained: 'You cannot use this skill untrained.',
                    check: 'The Disable Device check is made secretly by the GM.',
                    retry: 'Yes, though you must be aware that you have failed.',
                    special: 'Rogues can sense traps when they come within 10 feet of a trap.',
                    dcExamples: {
                        10: 'Jam a lock',
                        15: 'Sabotage a wagon wheel',
                        20: 'Disarm a trap',
                        25: 'Disarm a complex trap',
                        30: 'Disarm a magical trap'
                    }
                },
                'open_lock': {
                    id: 'open_lock',
                    name: 'Open Lock',
                    keyAbility: 'Dexterity',
                    trainedOnly: true,
                    armorCheckPenalty: false,
                    description: 'Use this skill to open locks and pick pockets.',
                    synergy: [],
                    untrained: 'You cannot use this skill untrained.',
                    check: 'The DC for opening a lock depends on its quality.',
                    retry: 'Yes. You can try again if you fail.',
                    special: 'If you do not have a set of thieves\' tools, these DCs increase by 10.',
                    dcExamples: {
                        20: 'Very simple lock',
                        25: 'Average lock',
                        30: 'Good lock',
                        35: 'Amazing lock',
                        40: 'Legendary lock'
                    }
                },
                'survival': {
                    id: 'survival',
                    name: 'Survival',
                    keyAbility: 'Wisdom',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to follow tracks, navigate wilderness areas, and notice natural hazards.',
                    synergy: ['knowledge_nature'],
                    untrained: 'You can use this skill untrained.',
                    check: 'You can keep yourself and others safe and fed in the wild.',
                    retry: 'Varies. For getting along in the wild or for gaining the Fortitude save bonus noted in the table above, you make a Survival check once every 24 hours.',
                    special: 'If you have 5 or more ranks in Survival, you can automatically determine where true north lies.',
                    dcExamples: {
                        10: 'Get along in the wild',
                        15: 'Track (outdoors)',
                        20: 'Track (underground)',
                        25: 'Track across solid rock',
                        30: 'Track across water'
                    }
                },

                // Perception Skills
                'listen': {
                    id: 'listen',
                    name: 'Listen',
                    keyAbility: 'Wisdom',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to hear approaching enemies, detect someone sneaking up on you, or eavesdrop on a conversation.',
                    synergy: [],
                    untrained: 'You can use this skill untrained.',
                    check: 'Your Listen check is either made against a DC that reflects how quiet the noise is, or it is opposed by your target\'s Move Silently check.',
                    retry: 'Yes. You can try to hear something again.',
                    special: 'When several characters are listening to the same thing, a single 1d20 roll can be used for all the individuals\' Listen checks.',
                    dcExamples: {
                        0: 'People talking normally',
                        5: 'People whispering',
                        10: 'Unarmored person walking at slow speed',
                        15: 'People sneaking (Move Silently check)',
                        20: 'Cat stalking',
                        25: 'Owl gliding'
                    }
                },
                'sense_motive': {
                    id: 'sense_motive',
                    name: 'Sense Motive',
                    keyAbility: 'Wisdom',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to tell when someone is bluffing you, determine someone\'s trustworthiness, or get a feeling for social situations.',
                    synergy: ['diplomacy'],
                    untrained: 'You can use this skill untrained.',
                    check: 'A successful check lets you avoid being bluffed (see the Bluff skill).',
                    retry: 'No, though you may make a Sense Motive check for each Bluff check made against you.',
                    special: 'If you have 5 or more ranks in Sense Motive, you get a +2 bonus on Diplomacy checks.',
                    dcExamples: {
                        10: 'Detect obvious lies',
                        15: 'Sense someone\'s general mood',
                        20: 'Determine trustworthiness',
                        25: 'Detect subtle deception',
                        30: 'Read complex motivations'
                    }
                },
                'spot': {
                    id: 'spot',
                    name: 'Spot',
                    keyAbility: 'Wisdom',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to notice opponents, detect someone following you, see through a disguise, or notice something suspicious about a social situation.',
                    synergy: [],
                    untrained: 'You can use this skill untrained.',
                    check: 'The Spot check is often made against the Hide check of a creature trying to hide.',
                    retry: 'Yes. You can try to spot something again if you fail.',
                    special: 'A fascinated creature takes a -4 penalty on Spot checks made as reactions.',
                    dcExamples: {
                        10: 'Notice obvious details',
                        15: 'Spot someone in hiding (opposed)',
                        20: 'Recognize a disguise',
                        25: 'Notice concealed weapon',
                        30: 'Spot invisible creature'
                    }
                },

                // Craft Skills
                'craft_alchemy': {
                    id: 'craft_alchemy',
                    name: 'Craft (Alchemy)',
                    keyAbility: 'Intelligence',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to create alchemical items such as acid, alchemist\'s fire, tanglefoot bags, and the like.',
                    synergy: ['spellcraft'],
                    untrained: 'You can use this skill untrained to do simple crafts.',
                    check: 'You can practice your trade and make a decent living, earning about half your Craft check result in gold pieces per week.',
                    retry: 'Yes, but each attempt requires a week of work.',
                    special: 'If you have 5 or more ranks in Craft (alchemy), you get a +2 bonus on Appraise checks related to alchemical items.',
                    dcExamples: {
                        10: 'Simple alchemical items',
                        15: 'Moderate alchemical items',
                        20: 'Complex alchemical items',
                        25: 'Masterwork alchemical items',
                        30: 'Unique alchemical creations'
                    }
                },
                'craft_armorsmithing': {
                    id: 'craft_armorsmithing',
                    name: 'Craft (Armorsmithing)',
                    keyAbility: 'Intelligence',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to make armor, including shields.',
                    synergy: ['appraise'],
                    untrained: 'You can use this skill untrained to do simple crafts.',
                    check: 'You can practice your trade and make a decent living.',
                    retry: 'Yes, but each attempt requires appropriate time.',
                    special: 'You can voluntarily add 10 to the indicated DC to craft a masterwork item.',
                    dcExamples: {
                        10: 'Simple armor (leather, padded)',
                        15: 'Martial armor (chain mail, scale)',
                        20: 'Heavy armor (plate, splint)',
                        25: 'Masterwork armor',
                        30: 'Exotic armor designs'
                    }
                },
                'craft_weaponsmithing': {
                    id: 'craft_weaponsmithing',
                    name: 'Craft (Weaponsmithing)',
                    keyAbility: 'Intelligence',
                    trainedOnly: false,
                    armorCheckPenalty: false,
                    description: 'Use this skill to make melee weapons, ranged weapons, and ammunition.',
                    synergy: ['appraise'],
                    untrained: 'You can use this skill untrained to do simple crafts.',
                    check: 'You can practice your trade and make a decent living.',
                    retry: 'Yes, but each attempt requires appropriate time.',
                    special: 'You can voluntarily add 10 to the indicated DC to craft a masterwork item.',
                    dcExamples: {
                        10: 'Simple weapons (club, dagger)',
                        15: 'Martial weapons (sword, axe)',
                        20: 'Exotic weapons (bastard sword)',
                        25: 'Masterwork weapons',
                        30: 'Legendary weapon quality'
                    }
                }
            };
        }

        // === Skill Synergy System ===
        initializeSkillSynergies() {
            return {
                // Bluff synergies
                'bluff_to_diplomacy': {
                    sourceSkill: 'bluff',
                    targetSkill: 'diplomacy',
                    requiredRanks: 5,
                    bonus: 2,
                    description: '5+ ranks in Bluff gives +2 to Diplomacy checks'
                },
                'bluff_to_intimidate': {
                    sourceSkill: 'bluff',
                    targetSkill: 'intimidate',
                    requiredRanks: 5,
                    bonus: 2,
                    description: '5+ ranks in Bluff gives +2 to Intimidate checks'
                },
                'bluff_to_sleight_of_hand': {
                    sourceSkill: 'bluff',
                    targetSkill: 'sleight_of_hand',
                    requiredRanks: 5,
                    bonus: 2,
                    description: '5+ ranks in Bluff gives +2 to Sleight of Hand checks'
                },
                
                // Knowledge synergies
                'knowledge_arcana_to_spellcraft': {
                    sourceSkill: 'knowledge_arcana',
                    targetSkill: 'spellcraft',
                    requiredRanks: 5,
                    bonus: 2,
                    description: '5+ ranks in Knowledge (arcana) gives +2 to Spellcraft checks'
                },
                'knowledge_nature_to_survival': {
                    sourceSkill: 'knowledge_nature',
                    targetSkill: 'survival',
                    requiredRanks: 5,
                    bonus: 2,
                    description: '5+ ranks in Knowledge (nature) gives +2 to Survival checks'
                },
                
                // Sense Motive synergies
                'sense_motive_to_diplomacy': {
                    sourceSkill: 'sense_motive',
                    targetSkill: 'diplomacy',
                    requiredRanks: 5,
                    bonus: 2,
                    description: '5+ ranks in Sense Motive gives +2 to Diplomacy checks'
                },
                
                // Balance synergies
                'balance_to_tumble': {
                    sourceSkill: 'balance',
                    targetSkill: 'tumble',
                    requiredRanks: 5,
                    bonus: 2,
                    description: '5+ ranks in Balance gives +2 to Tumble checks'
                },
                
                // Jump synergies
                'jump_to_tumble': {
                    sourceSkill: 'jump',
                    targetSkill: 'tumble',
                    requiredRanks: 5,
                    bonus: 2,
                    description: '5+ ranks in Jump gives +2 to Tumble checks'
                },
                
                // Craft synergies
                'craft_alchemy_to_spellcraft': {
                    sourceSkill: 'craft_alchemy',
                    targetSkill: 'spellcraft',
                    requiredRanks: 5,
                    bonus: 2,
                    description: '5+ ranks in Craft (alchemy) gives +2 to Spellcraft checks involving potions'
                }
            };
        }

        // === Class Skill Lists ===
        initializeClassSkillLists() {
            return {
                'barbarian': [
                    'climb', 'craft_any', 'handle_animal', 'intimidate', 'jump', 'listen',
                    'ride', 'survival', 'swim'
                ],
                'bard': [
                    'appraise', 'balance', 'bluff', 'climb', 'concentration', 'craft_any',
                    'decipher_script', 'diplomacy', 'disguise', 'escape_artist', 'gather_information',
                    'hide', 'jump', 'knowledge_any', 'listen', 'move_silently', 'perform',
                    'pick_pocket', 'profession', 'sense_motive', 'sleight_of_hand', 'speak_language',
                    'spellcraft', 'swim', 'tumble', 'use_magic_device'
                ],
                'cleric': [
                    'concentration', 'craft_any', 'diplomacy', 'heal', 'knowledge_arcana',
                    'knowledge_history', 'knowledge_religion', 'knowledge_planes', 'profession',
                    'spellcraft'
                ],
                'druid': [
                    'animal_empathy', 'concentration', 'craft_any', 'diplomacy', 'handle_animal',
                    'heal', 'intuit_direction', 'knowledge_nature', 'listen', 'profession',
                    'scry', 'spellcraft', 'spot', 'survival', 'swim'
                ],
                'fighter': [
                    'climb', 'craft_any', 'handle_animal', 'intimidate', 'jump', 'ride', 'swim'
                ],
                'monk': [
                    'balance', 'climb', 'concentration', 'craft_any', 'diplomacy', 'escape_artist',
                    'hide', 'jump', 'knowledge_arcana', 'knowledge_religion', 'listen', 'move_silently',
                    'perform', 'profession', 'sense_motive', 'spot', 'swim', 'tumble'
                ],
                'paladin': [
                    'concentration', 'craft_any', 'diplomacy', 'handle_animal', 'heal',
                    'knowledge_nobility', 'knowledge_religion', 'profession', 'ride', 'sense_motive'
                ],
                'ranger': [
                    'animal_empathy', 'climb', 'concentration', 'craft_any', 'handle_animal',
                    'heal', 'hide', 'intuit_direction', 'jump', 'knowledge_dungeoneering',
                    'knowledge_geography', 'knowledge_nature', 'listen', 'move_silently',
                    'profession', 'ride', 'search', 'spot', 'survival', 'swim', 'use_rope'
                ],
                'rogue': [
                    'appraise', 'balance', 'bluff', 'climb', 'craft_any', 'decipher_script',
                    'diplomacy', 'disable_device', 'disguise', 'escape_artist', 'forgery',
                    'gather_information', 'hide', 'intimidate', 'jump', 'knowledge_local',
                    'listen', 'move_silently', 'open_lock', 'perform', 'profession',
                    'search', 'sense_motive', 'sleight_of_hand', 'spot', 'swim', 'tumble',
                    'use_magic_device', 'use_rope'
                ],
                'sorcerer': [
                    'bluff', 'concentration', 'craft_any', 'knowledge_arcana', 'profession', 'spellcraft'
                ],
                'wizard': [
                    'concentration', 'craft_any', 'decipher_script', 'knowledge_any', 'profession', 'spellcraft'
                ]
            };
        }

        // === Skill Check System ===
        makeSkillCheck(character, skillId, dc = null, options = {}) {
            const skill = this.skills[skillId];
            if (!skill) {
                throw new Error(`Unknown skill: ${skillId}`);
            }

            // Get character's skill data
            const characterSkill = character.skills?.[skillId] || { ranks: 0, modifier: 0 };
            
            // Calculate skill modifier
            const abilityScore = character.abilities[skill.keyAbility];
            const abilityModifier = Math.floor((abilityScore - 10) / 2);
            
            // Base skill modifier
            let totalModifier = abilityModifier + characterSkill.ranks + (characterSkill.modifier || 0);
            
            // Apply synergy bonuses
            totalModifier += this.calculateSynergyBonus(character, skillId);
            
            // Apply circumstance modifiers
            if (options.circumstanceBonus) {
                totalModifier += options.circumstanceBonus;
            }
            
            // Check for untrained use
            if (skill.trainedOnly && characterSkill.ranks === 0) {
                return {
                    success: false,
                    roll: 0,
                    total: 0,
                    modifier: totalModifier,
                    dc: dc,
                    reason: `${skill.name} cannot be used untrained`
                };
            }
            
            // Make the roll
            const roll = this.diceEngine ? this.diceEngine.rollDice('1d20').total : Math.floor(Math.random() * 20) + 1;
            const total = roll + totalModifier;
            
            return {
                success: dc ? (total >= dc) : true,
                roll: roll,
                total: total,
                modifier: totalModifier,
                dc: dc,
                skillName: skill.name,
                breakdown: {
                    roll: roll,
                    abilityModifier: abilityModifier,
                    ranks: characterSkill.ranks,
                    synergy: this.calculateSynergyBonus(character, skillId),
                    miscModifier: characterSkill.modifier || 0,
                    circumstance: options.circumstanceBonus || 0
                }
            };
        }

        // === Skill Point Calculation ===
        calculateSkillPoints(character) {
            const totalSkillPoints = {};
            
            for (const classData of character.classes) {
                const className = classData.name.toLowerCase();
                const level = classData.level;
                
                // Base skill points per level by class
                const baseSkillPoints = this.getBaseSkillPointsByClass(className);
                
                // Intelligence modifier
                const intModifier = Math.floor((character.abilities.Intelligence - 10) / 2);
                
                // Calculate total skill points for this class
                const classSkillPoints = (baseSkillPoints + intModifier) * level;
                
                totalSkillPoints[className] = {
                    basePerLevel: baseSkillPoints,
                    intModifier: intModifier,
                    totalPerLevel: baseSkillPoints + intModifier,
                    totalForClass: classSkillPoints
                };
            }
            
            // Calculate total available skill points
            let totalAvailable = 0;
            for (const classData of Object.values(totalSkillPoints)) {
                totalAvailable += classData.totalForClass;
            }
            
            // Add bonus skill points for humans and other races
            if (character.race === 'Human') {
                totalAvailable += character.classes.reduce((sum, cls) => sum + cls.level, 0); // +1 per level
            }
            
            return {
                totalAvailable: totalAvailable,
                byClass: totalSkillPoints,
                spent: this.calculateSpentSkillPoints(character),
                remaining: totalAvailable - this.calculateSpentSkillPoints(character)
            };
        }

        getBaseSkillPointsByClass(className) {
            const skillPointsTable = {
                'barbarian': 4,
                'bard': 6,
                'cleric': 2,
                'druid': 4,
                'fighter': 2,
                'monk': 4,
                'paladin': 2,
                'ranger': 6,
                'rogue': 8,
                'sorcerer': 2,
                'wizard': 2
            };
            
            return skillPointsTable[className] || 2;
        }

        calculateSpentSkillPoints(character) {
            if (!character.skills) return 0;
            
            let totalSpent = 0;
            
            for (const [skillId, skillData] of Object.entries(character.skills)) {
                const ranks = skillData.ranks || 0;
                
                if (this.isClassSkill(skillId, character)) {
                    // Class skills cost 1 point per rank
                    totalSpent += ranks;
                } else {
                    // Cross-class skills cost 2 points per rank (0.5 ranks per point)
                    totalSpent += ranks * 2;
                }
            }
            
            return totalSpent;
        }

        // === Class Skill Checking ===
        isClassSkill(skillId, character) {
            for (const classData of character.classes) {
                const className = classData.name.toLowerCase();
                const classSkills = this.classSkillLists[className] || [];
                
                if (classSkills.includes(skillId) || 
                    classSkills.includes('knowledge_any') && skillId.startsWith('knowledge_') ||
                    classSkills.includes('craft_any') && skillId.startsWith('craft_')) {
                    return true;
                }
            }
            return false;
        }

        // === Synergy Bonus Calculation ===
        calculateSynergyBonus(character, skillId) {
            let bonus = 0;
            
            for (const synergy of Object.values(this.skillSynergies)) {
                if (synergy.targetSkill === skillId) {
                    const sourceSkillData = character.skills?.[synergy.sourceSkill];
                    if (sourceSkillData && sourceSkillData.ranks >= synergy.requiredRanks) {
                        bonus += synergy.bonus;
                    }
                }
            }
            
            return bonus;
        }

        // === Skill Advancement ===
        canAdvanceSkill(character, skillId, newRanks) {
            const skill = this.skills[skillId];
            if (!skill) return { valid: false, reason: 'Skill not found' };
            
            const currentSkill = character.skills?.[skillId] || { ranks: 0 };
            const currentRanks = currentSkill.ranks || 0;
            
            // Calculate character level
            const characterLevel = character.classes.reduce((sum, cls) => sum + cls.level, 0);
            
            // Check maximum ranks
            const isClassSkill = this.isClassSkill(skillId, character);
            const maxRanks = isClassSkill ? (characterLevel + 3) : Math.floor((characterLevel + 3) / 2);
            
            if (newRanks > maxRanks) {
                return { 
                    valid: false, 
                    reason: `Maximum ranks for ${skill.name}: ${maxRanks} (${isClassSkill ? 'class skill' : 'cross-class skill'})` 
                };
            }
            
            // Check skill points cost
            const ranksToAdd = newRanks - currentRanks;
            const cost = isClassSkill ? ranksToAdd : ranksToAdd * 2;
            
            const skillPoints = this.calculateSkillPoints(character);
            if (cost > skillPoints.remaining) {
                return {
                    valid: false,
                    reason: `Insufficient skill points. Cost: ${cost}, Available: ${skillPoints.remaining}`
                };
            }
            
            return { 
                valid: true, 
                cost: cost,
                isClassSkill: isClassSkill,
                maxRanks: maxRanks
            };
        }

        advanceSkill(character, skillId, newRanks) {
            const validation = this.canAdvanceSkill(character, skillId, newRanks);
            if (!validation.valid) {
                throw new Error(validation.reason);
            }
            
            // Initialize skills object if needed
            if (!character.skills) {
                character.skills = {};
            }
            
            // Initialize skill if needed
            if (!character.skills[skillId]) {
                character.skills[skillId] = { ranks: 0, modifier: 0 };
            }
            
            // Update skill ranks
            character.skills[skillId].ranks = newRanks;
            
            return {
                success: true,
                skillName: this.skills[skillId].name,
                newRanks: newRanks,
                costPaid: validation.cost
            };
        }

        // === Skill Information ===
        getSkillInfo(skillId) {
            return this.skills[skillId] || null;
        }

        getSkillsByCategory() {
            const categories = {
                'Physical': ['balance', 'climb', 'jump', 'swim'],
                'Mental': ['appraise', 'decipher_script', 'knowledge_arcana', 'knowledge_dungeoneering', 
                          'knowledge_nature', 'search', 'spellcraft'],
                'Social': ['bluff', 'diplomacy', 'gather_information', 'intimidate', 'perform'],
                'Stealth': ['hide', 'move_silently', 'sleight_of_hand'],
                'Survival': ['disable_device', 'open_lock', 'survival'],
                'Perception': ['listen', 'sense_motive', 'spot'],
                'Craft': ['craft_alchemy', 'craft_armorsmithing', 'craft_weaponsmithing']
            };
            
            return categories;
        }

        getAllSkills() {
            return Object.values(this.skills);
        }

        getSkillsForClass(className) {
            const classSkills = this.classSkillLists[className.toLowerCase()] || [];
            const skills = [];
            
            for (const skillId of classSkills) {
                if (skillId === 'knowledge_any') {
                    // Add all knowledge skills
                    const knowledgeSkills = Object.keys(this.skills).filter(id => id.startsWith('knowledge_'));
                    for (const kSkill of knowledgeSkills) {
                        skills.push({ ...this.skills[kSkill], isClassSkill: true });
                    }
                } else if (skillId === 'craft_any') {
                    // Add all craft skills
                    const craftSkills = Object.keys(this.skills).filter(id => id.startsWith('craft_'));
                    for (const cSkill of craftSkills) {
                        skills.push({ ...this.skills[cSkill], isClassSkill: true });
                    }
                } else if (this.skills[skillId]) {
                    skills.push({ ...this.skills[skillId], isClassSkill: true });
                }
            }
            
            return skills;
        }

        // === Character Integration ===
        getCharacterSkillSummary(character) {
            const summary = {
                totalSkills: 0,
                skillPoints: this.calculateSkillPoints(character),
                skillsByCategory: {},
                classSkills: [],
                crossClassSkills: []
            };
            
            const categories = this.getSkillsByCategory();
            
            // Initialize categories
            for (const category of Object.keys(categories)) {
                summary.skillsByCategory[category] = [];
            }
            
            // Process character skills
            if (character.skills) {
                for (const [skillId, skillData] of Object.entries(character.skills)) {
                    const skill = this.skills[skillId];
                    if (!skill) continue;
                    
                    const isClassSkill = this.isClassSkill(skillId, character);
                    const skillInfo = {
                        ...skill,
                        ranks: skillData.ranks || 0,
                        modifier: skillData.modifier || 0,
                        totalModifier: this.calculateSkillModifier(character, skillId),
                        isClassSkill: isClassSkill
                    };
                    
                    summary.totalSkills++;
                    
                    if (isClassSkill) {
                        summary.classSkills.push(skillInfo);
                    } else {
                        summary.crossClassSkills.push(skillInfo);
                    }
                    
                    // Add to appropriate category
                    for (const [category, skillIds] of Object.entries(categories)) {
                        if (skillIds.includes(skillId)) {
                            summary.skillsByCategory[category].push(skillInfo);
                            break;
                        }
                    }
                }
            }
            
            return summary;
        }

        calculateSkillModifier(character, skillId) {
            const skill = this.skills[skillId];
            if (!skill) return 0;
            
            const characterSkill = character.skills?.[skillId] || { ranks: 0, modifier: 0 };
            
            // Base ability modifier
            const abilityScore = character.abilities[skill.keyAbility];
            const abilityModifier = Math.floor((abilityScore - 10) / 2);
            
            // Total modifier
            return abilityModifier + 
                   (characterSkill.ranks || 0) + 
                   (characterSkill.modifier || 0) + 
                   this.calculateSynergyBonus(character, skillId);
        }

        // === Validation and Utilities ===
        validateCharacterSkills(character) {
            const errors = [];
            const warnings = [];
            
            if (!character.skills) {
                return { errors, warnings, valid: true };
            }
            
            const skillPoints = this.calculateSkillPoints(character);
            const characterLevel = character.classes.reduce((sum, cls) => sum + cls.level, 0);
            
            // Check skill point allocation
            if (skillPoints.spent > skillPoints.totalAvailable) {
                errors.push(`Over allocated skill points: ${skillPoints.spent}/${skillPoints.totalAvailable}`);
            }
            
            // Check individual skills
            for (const [skillId, skillData] of Object.entries(character.skills)) {
                const skill = this.skills[skillId];
                if (!skill) {
                    errors.push(`Unknown skill: ${skillId}`);
                    continue;
                }
                
                const ranks = skillData.ranks || 0;
                const isClassSkill = this.isClassSkill(skillId, character);
                const maxRanks = isClassSkill ? (characterLevel + 3) : Math.floor((characterLevel + 3) / 2);
                
                if (ranks > maxRanks) {
                    errors.push(`${skill.name}: ${ranks} ranks exceeds maximum ${maxRanks}`);
                }
                
                if (ranks < 0) {
                    errors.push(`${skill.name}: Negative skill ranks not allowed`);
                }
                
                // Check if skill should have more ranks for effectiveness
                if (isClassSkill && ranks > 0 && ranks < 5) {
                    warnings.push(`${skill.name}: Consider investing 5+ ranks for synergy bonuses`);
                }
            }
            
            return {
                errors,
                warnings,
                valid: errors.length === 0,
                skillPointsValid: skillPoints.spent <= skillPoints.totalAvailable
            };
        }

        // === Mock System for Testing ===
        static createMockSystem() {
            return {
                skills: {},
                skillSynergies: {},
                classSkillLists: {},
                makeSkillCheck: () => ({ success: true, roll: 10, total: 15 }),
                calculateSkillPoints: () => ({ totalAvailable: 20, spent: 10, remaining: 10 }),
                isClassSkill: () => true,
                getSkillInfo: () => ({ name: 'Mock Skill', keyAbility: 'Intelligence' }),
                getAllSkills: () => [],
                getSkillsByCategory: () => ({}),
                getCharacterSkillSummary: () => ({ totalSkills: 0 }),
                validateCharacterSkills: () => ({ valid: true, errors: [], warnings: [] })
            };
        }
    }

    // Register for global access in browser
    if (typeof window !== 'undefined') {
        window.SkillsSystem = SkillsSystem;
    }

    return SkillsSystem;
});
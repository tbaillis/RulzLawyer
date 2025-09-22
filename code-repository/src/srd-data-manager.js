/**
 * D&D 3.5 SRD Data Manager
 * Comprehensive integration of System Reference Document data for character creation
 */

class SRDDataManager {
    constructor() {
        this.races = {};
        this.classes = {};
        this.skills = {};
        this.feats = {};
        this.spells = {};
        this.equipment = {};
        this.loaded = false;
    }

    async initialize() {
        if (this.loaded) return;
        
        console.log('🏛️ Loading D&D 3.5 SRD Data...');
        
        // Load core data
        this.loadRaceData();
        this.loadClassData();
        this.loadSkillData();
        this.loadFeatData();
        this.loadEquipmentData();
        
        this.loaded = true;
        console.log('✅ SRD Data loaded successfully');
    }

    loadRaceData() {
        this.races = {
            'human': {
                id: 'human',
                name: 'Human',
                abilityMods: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
                size: 'Medium',
                speed: 30,
                languages: ['Common'],
                bonusLanguages: ['any'],
                favored_class: 'any',
                special_abilities: [
                    'Extra feat at 1st level',
                    '4 extra skill points at 1st level and 1 extra per level'
                ],
                description: 'Versatile and ambitious, humans are the most common race.'
            },
            'dwarf': {
                id: 'dwarf',
                name: 'Dwarf',
                abilityMods: { str: 0, dex: 0, con: 2, int: 0, wis: 0, cha: -2 },
                size: 'Medium',
                speed: 20,
                languages: ['Common', 'Dwarven'],
                bonusLanguages: ['Giant', 'Gnome', 'Goblin', 'Orc', 'Terran', 'Undercommon'],
                favored_class: 'fighter',
                special_abilities: [
                    'Darkvision 60 ft',
                    'Stonecunning (+2 Search checks for stonework)',
                    'Weapon Familiarity (dwarven waraxe, urgrosh)',
                    'Stability (+4 vs bull rush/trip)',
                    '+2 saves vs poison and spells',
                    '+1 attack vs orcs and goblinoids',
                    '+4 AC vs giants'
                ],
                description: 'Short and stocky, dwarves are known for their skill in warfare, ability to withstand physical and magical punishment, and hatred of orcs and goblins.'
            },
            'elf': {
                id: 'elf',
                name: 'Elf',
                abilityMods: { str: 0, dex: 2, con: -2, int: 0, wis: 0, cha: 0 },
                size: 'Medium',
                speed: 30,
                languages: ['Common', 'Elven'],
                bonusLanguages: ['Draconic', 'Gnoll', 'Gnome', 'Goblin', 'Orc', 'Sylvan'],
                favored_class: 'wizard',
                special_abilities: [
                    'Immunity to sleep spells and effects',
                    '+2 saves vs enchantment',
                    'Low-light Vision',
                    'Weapon Proficiency (longsword, rapier, longbow, shortbow)',
                    '+2 Listen, Search, Spot checks',
                    'Secret door detection'
                ],
                description: 'Tall, noble, and often haughty, elves are long-lived masters of magic and song.'
            },
            'gnome': {
                id: 'gnome',
                name: 'Gnome',
                abilityMods: { str: -2, dex: 0, con: 2, int: 0, wis: 0, cha: 0 },
                size: 'Small',
                speed: 20,
                languages: ['Common', 'Gnome'],
                bonusLanguages: ['Draconic', 'Dwarven', 'Elven', 'Giant', 'Goblin', 'Orc'],
                favored_class: 'bard',
                special_abilities: [
                    'Small size (+1 AC, +1 attack, +4 Hide)',
                    'Low-light Vision',
                    '+2 saves vs illusions',
                    '+1 DC for illusion spells cast',
                    '+1 attack vs kobolds and goblinoids',
                    '+4 AC vs giants',
                    'Spell-like abilities (dancing lights, ghost sound, prestidigitation)',
                    'Speak with burrowing mammals'
                ],
                description: 'Small and often overlooked, gnomes are a clever race of small humanoids with a love of jokes, pranks, and engineering.'
            },
            'halfelf': {
                id: 'halfelf',
                name: 'Half-Elf',
                abilityMods: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
                size: 'Medium',
                speed: 30,
                languages: ['Common', 'Elven'],
                bonusLanguages: ['any'],
                favored_class: 'any',
                special_abilities: [
                    'Immunity to sleep spells',
                    '+2 saves vs enchantment',
                    'Low-light Vision',
                    '+1 Listen, Search, Spot checks',
                    '+2 Diplomacy and Gather Information',
                    'Elven Blood (counts as elf for effects)'
                ],
                description: 'Walking in two worlds but belonging to neither, half-elves combine human curiosity with elven refinement.'
            },
            'halforc': {
                id: 'halforc',
                name: 'Half-Orc',
                abilityMods: { str: 2, dex: 0, con: 0, int: -2, wis: 0, cha: -2 },
                size: 'Medium',
                speed: 30,
                languages: ['Common', 'Orc'],
                bonusLanguages: ['Draconic', 'Giant', 'Gnoll', 'Goblin', 'Abyssal'],
                favored_class: 'barbarian',
                special_abilities: [
                    'Darkvision 60 ft',
                    'Orc Blood (counts as orc for effects)'
                ],
                description: 'Often fierce and savage, sometimes noble and resolute, half-orcs can manifest the best and worst qualities of their two races.'
            },
            'halfling': {
                id: 'halfling',
                name: 'Halfling',
                abilityMods: { str: -2, dex: 2, con: 0, int: 0, wis: 0, cha: 0 },
                size: 'Small',
                speed: 20,
                languages: ['Common', 'Halfling'],
                bonusLanguages: ['Dwarven', 'Elven', 'Gnome', 'Goblin', 'Orc'],
                favored_class: 'rogue',
                special_abilities: [
                    'Small size (+1 AC, +1 attack, +4 Hide)',
                    '+2 saves vs fear',
                    '+1 morale bonus on saves',
                    '+1 racial bonus with thrown weapons and slings',
                    '+2 Climb, Jump, Move Silently, Listen checks'
                ],
                description: 'Small, clever, and courageous, halflings value the comforts of home but their natural wanderlust often gets the better of them.'
            }
        };
    }

    loadClassData() {
        this.classes = {
            'barbarian': {
                id: 'barbarian',
                name: 'Barbarian',
                hit_die: 'd12',
                skill_points: 4,
                class_skills: ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Jump', 'Listen', 'Ride', 'Survival', 'Swim'],
                weapon_prof: ['simple', 'martial'],
                armor_prof: ['light', 'medium', 'shields'],
                spell_progression: null,
                special_abilities: {
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
                bab_progression: 'full',
                save_progression: { fort: 'good', ref: 'poor', will: 'poor' },
                description: 'A fierce warrior of primitive background who can enter a battle rage.'
            },
            'bard': {
                id: 'bard',
                name: 'Bard',
                hit_die: 'd6',
                skill_points: 6,
                class_skills: ['Appraise', 'Balance', 'Bluff', 'Climb', 'Concentration', 'Craft', 'Decipher Script', 'Diplomacy', 'Disguise', 'Escape Artist', 'Gather Information', 'Hide', 'Jump', 'Knowledge', 'Listen', 'Move Silently', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Speak Language', 'Spellcraft', 'Swim', 'Tumble', 'Use Magic Device'],
                weapon_prof: ['simple', 'longsword', 'rapier', 'sap', 'short sword', 'shortbow', 'whip'],
                armor_prof: ['light', 'shields'],
                spell_progression: 'bard',
                special_abilities: {
                    1: ['Bardic Music', 'Bardic Knowledge', 'Countersong', 'Fascinate', 'Inspire Courage +1'],
                    3: ['Inspire Competence'],
                    6: ['Suggestion'],
                    8: ['Inspire Courage +2'],
                    9: ['Inspire Greatness'],
                    12: ['Song of Freedom'],
                    14: ['Inspire Courage +3'],
                    15: ['Inspire Heroics'],
                    18: ['Mass Suggestion'],
                    20: ['Inspire Courage +4']
                },
                bab_progression: 'medium',
                save_progression: { fort: 'poor', ref: 'good', will: 'good' },
                description: 'A performer whose music works magic—a wandering troubadour, a court jester, or a scholar of occult lore.'
            },
            'cleric': {
                id: 'cleric',
                name: 'Cleric',
                hit_die: 'd8',
                skill_points: 2,
                class_skills: ['Concentration', 'Craft', 'Diplomacy', 'Heal', 'Knowledge (arcana)', 'Knowledge (history)', 'Knowledge (religion)', 'Knowledge (the planes)', 'Profession', 'Spellcraft'],
                weapon_prof: ['simple'],
                armor_prof: ['light', 'medium', 'heavy', 'shields', 'tower shields'],
                spell_progression: 'cleric',
                special_abilities: {
                    1: ['Turn or Rebuke Undead', 'Domain Powers'],
                    // Domain-specific abilities vary
                },
                bab_progression: 'medium',
                save_progression: { fort: 'good', ref: 'poor', will: 'good' },
                description: 'A master of divine magic and a capable warrior as well.'
            },
            'druid': {
                id: 'druid',
                name: 'Druid',
                hit_die: 'd8',
                skill_points: 4,
                class_skills: ['Concentration', 'Craft', 'Diplomacy', 'Handle Animal', 'Heal', 'Knowledge (nature)', 'Listen', 'Profession', 'Ride', 'Spellcraft', 'Spot', 'Survival', 'Swim'],
                weapon_prof: ['simple', 'specific natural weapons'],
                armor_prof: ['light', 'medium', 'shields (non-metal only)'],
                spell_progression: 'druid',
                special_abilities: {
                    1: ['Animal Companion', 'Nature Sense'],
                    2: ['Woodland Stride'],
                    3: ['Trackless Step'],
                    4: ['Resist Nature\'s Lure'],
                    5: ['Wild Shape 1/day'],
                    6: ['Wild Shape 2/day'],
                    8: ['Wild Shape 3/day'],
                    9: ['Venom Immunity'],
                    10: ['Wild Shape 4/day'],
                    11: ['Wild Shape (Large)'],
                    12: ['Wild Shape 5/day'],
                    13: ['A Thousand Faces'],
                    15: ['Wild Shape (Huge)', 'Timeless Body'],
                    16: ['Wild Shape 6/day'],
                    18: ['Wild Shape (elemental)'],
                    20: ['Wild Shape (elemental, Huge)']
                },
                bab_progression: 'medium',
                save_progression: { fort: 'good', ref: 'poor', will: 'good' },
                description: 'One who draws power from nature itself, capable of taking animal forms.'
            },
            'fighter': {
                id: 'fighter',
                name: 'Fighter',
                hit_die: 'd10',
                skill_points: 2,
                class_skills: ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Jump', 'Ride', 'Swim'],
                weapon_prof: ['simple', 'martial'],
                armor_prof: ['light', 'medium', 'heavy', 'shields', 'tower shields'],
                spell_progression: null,
                special_abilities: {
                    1: ['Bonus Feat'],
                    2: ['Bonus Feat'],
                    4: ['Bonus Feat'],
                    6: ['Bonus Feat'],
                    8: ['Bonus Feat'],
                    10: ['Bonus Feat'],
                    12: ['Bonus Feat'],
                    14: ['Bonus Feat'],
                    16: ['Bonus Feat'],
                    18: ['Bonus Feat'],
                    20: ['Bonus Feat']
                },
                bab_progression: 'full',
                save_progression: { fort: 'good', ref: 'poor', will: 'poor' },
                description: 'A warrior with exceptional combat capability and unequaled skill with weapons.'
            },
            'monk': {
                id: 'monk',
                name: 'Monk',
                hit_die: 'd8',
                skill_points: 4,
                class_skills: ['Balance', 'Climb', 'Concentration', 'Craft', 'Diplomacy', 'Escape Artist', 'Hide', 'Jump', 'Knowledge (arcana)', 'Knowledge (religion)', 'Listen', 'Move Silently', 'Perform', 'Profession', 'Sense Motive', 'Spot', 'Swim', 'Tumble'],
                weapon_prof: ['simple', 'specific monk weapons'],
                armor_prof: ['none'],
                spell_progression: null,
                special_abilities: {
                    1: ['AC Bonus', 'Flurry of Blows', 'Unarmed Strike'],
                    2: ['Evasion', 'Bonus Feat'],
                    3: ['Still Mind'],
                    4: ['Ki Strike (magic)', 'Slow Fall 20 ft'],
                    5: ['Purity of Body'],
                    6: ['Bonus Feat', 'Slow Fall 30 ft'],
                    7: ['Wholeness of Body'],
                    8: ['Slow Fall 40 ft'],
                    9: ['Improved Evasion'],
                    10: ['Ki Strike (lawful)', 'Slow Fall 50 ft'],
                    11: ['Diamond Body', 'Greater Flurry'],
                    12: ['Abundant Step', 'Slow Fall 60 ft'],
                    13: ['Diamond Soul'],
                    14: ['Slow Fall 70 ft'],
                    15: ['Quivering Palm'],
                    16: ['Ki Strike (adamantine)', 'Slow Fall 80 ft'],
                    17: ['Timeless Body', 'Tongue of the Sun and Moon'],
                    18: ['Slow Fall 90 ft'],
                    19: ['Empty Body'],
                    20: ['Perfect Self', 'Slow Fall any distance']
                },
                bab_progression: 'medium',
                save_progression: { fort: 'good', ref: 'good', will: 'good' },
                description: 'A martial artist whose unarmed strikes hit fast and hard—a master of exotic powers.'
            },
            'paladin': {
                id: 'paladin',
                name: 'Paladin',
                hit_die: 'd10',
                skill_points: 2,
                class_skills: ['Concentration', 'Craft', 'Diplomacy', 'Handle Animal', 'Heal', 'Knowledge (nobility)', 'Knowledge (religion)', 'Profession', 'Ride', 'Sense Motive'],
                weapon_prof: ['simple', 'martial'],
                armor_prof: ['light', 'medium', 'heavy', 'shields'],
                spell_progression: 'paladin',
                special_abilities: {
                    1: ['Detect Evil', 'Smite Evil 1/day'],
                    2: ['Divine Grace', 'Lay on Hands'],
                    3: ['Aura of Courage', 'Divine Health'],
                    4: ['Turn Undead'],
                    5: ['Smite Evil 2/day', 'Special Mount'],
                    6: ['Remove Disease 1/week'],
                    9: ['Remove Disease 2/week'],
                    10: ['Smite Evil 3/day'],
                    12: ['Remove Disease 3/week'],
                    15: ['Remove Disease 4/week', 'Smite Evil 4/day'],
                    18: ['Remove Disease 5/week'],
                    20: ['Smite Evil 5/day']
                },
                bab_progression: 'full',
                save_progression: { fort: 'good', ref: 'poor', will: 'poor' },
                description: 'A holy warrior dedicated to good and law, with some divine spellcasting ability.'
            },
            'ranger': {
                id: 'ranger',
                name: 'Ranger',
                hit_die: 'd8',
                skill_points: 6,
                class_skills: ['Climb', 'Concentration', 'Craft', 'Handle Animal', 'Heal', 'Hide', 'Jump', 'Knowledge (dungeoneering)', 'Knowledge (geography)', 'Knowledge (nature)', 'Listen', 'Move Silently', 'Profession', 'Ride', 'Search', 'Spot', 'Survival', 'Swim', 'Use Rope'],
                weapon_prof: ['simple', 'martial'],
                armor_prof: ['light', 'medium', 'shields'],
                spell_progression: 'ranger',
                special_abilities: {
                    1: ['Favored Enemy', 'Track'],
                    2: ['Combat Style'],
                    3: ['Endurance'],
                    4: ['Animal Companion'],
                    5: ['Favored Enemy'],
                    6: ['Improved Combat Style'],
                    7: ['Woodland Stride'],
                    8: ['Swift Tracker'],
                    9: ['Evasion'],
                    10: ['Favored Enemy'],
                    11: ['Combat Style Mastery'],
                    13: ['Camouflage'],
                    15: ['Favored Enemy'],
                    17: ['Hide in Plain Sight'],
                    20: ['Favored Enemy']
                },
                bab_progression: 'full',
                save_progression: { fort: 'good', ref: 'good', will: 'poor' },
                description: 'A skilled hunter and tracker, and a warrior of the wilderness.'
            },
            'rogue': {
                id: 'rogue',
                name: 'Rogue',
                hit_die: 'd6',
                skill_points: 8,
                class_skills: ['Appraise', 'Balance', 'Bluff', 'Climb', 'Craft', 'Decipher Script', 'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Forgery', 'Gather Information', 'Hide', 'Intimidate', 'Jump', 'Knowledge (local)', 'Listen', 'Move Silently', 'Open Lock', 'Perform', 'Profession', 'Search', 'Sense Motive', 'Sleight of Hand', 'Spot', 'Swim', 'Tumble', 'Use Magic Device', 'Use Rope'],
                weapon_prof: ['simple', 'hand crossbow', 'rapier', 'sap', 'shortbow', 'short sword'],
                armor_prof: ['light'],
                spell_progression: null,
                special_abilities: {
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
                    15: ['Sneak Attack +8d6', 'Trap Sense +5'],
                    16: ['Special Ability'],
                    17: ['Sneak Attack +9d6'],
                    18: ['Trap Sense +6'],
                    19: ['Sneak Attack +10d6', 'Special Ability'],
                },
                bab_progression: 'medium',
                save_progression: { fort: 'poor', ref: 'good', will: 'poor' },
                description: 'A tricky, skillful scout and spy who wins the battle by stealth rather than brute force.'
            },
            'sorcerer': {
                id: 'sorcerer',
                name: 'Sorcerer',
                hit_die: 'd4',
                skill_points: 2,
                class_skills: ['Bluff', 'Concentration', 'Craft', 'Knowledge (arcana)', 'Profession', 'Spellcraft'],
                weapon_prof: ['simple'],
                armor_prof: ['none'],
                spell_progression: 'sorcerer',
                special_abilities: {
                    1: ['Familiar'],
                },
                bab_progression: 'poor',
                save_progression: { fort: 'poor', ref: 'poor', will: 'good' },
                description: 'A spellcaster with inborn magical ability rather than studied magic.'
            },
            'wizard': {
                id: 'wizard',
                name: 'Wizard',
                hit_die: 'd4',
                skill_points: 2,
                class_skills: ['Concentration', 'Craft', 'Decipher Script', 'Knowledge', 'Profession', 'Spellcraft'],
                weapon_prof: ['simple'],
                armor_prof: ['none'],
                spell_progression: 'wizard',
                special_abilities: {
                    1: ['Familiar', 'Scribe Scroll'],
                    5: ['Bonus Feat'],
                    10: ['Bonus Feat'],
                    15: ['Bonus Feat'],
                    20: ['Bonus Feat']
                },
                bab_progression: 'poor',
                save_progression: { fort: 'poor', ref: 'poor', will: 'good' },
                description: 'A potent spellcaster schooled in the arcane arts, with a spellbook of magical knowledge.'
            }
        };
    }

    loadSkillData() {
        this.skills = {
            'Appraise': { key_ability: 'int', trained_only: false },
            'Balance': { key_ability: 'dex', trained_only: false },
            'Bluff': { key_ability: 'cha', trained_only: false },
            'Climb': { key_ability: 'str', trained_only: false },
            'Concentration': { key_ability: 'con', trained_only: false },
            'Craft': { key_ability: 'int', trained_only: false },
            'Decipher Script': { key_ability: 'int', trained_only: true },
            'Diplomacy': { key_ability: 'cha', trained_only: false },
            'Disable Device': { key_ability: 'int', trained_only: true },
            'Disguise': { key_ability: 'cha', trained_only: false },
            'Escape Artist': { key_ability: 'dex', trained_only: false },
            'Forgery': { key_ability: 'int', trained_only: false },
            'Gather Information': { key_ability: 'cha', trained_only: false },
            'Handle Animal': { key_ability: 'cha', trained_only: true },
            'Heal': { key_ability: 'wis', trained_only: false },
            'Hide': { key_ability: 'dex', trained_only: false },
            'Intimidate': { key_ability: 'cha', trained_only: false },
            'Jump': { key_ability: 'str', trained_only: false },
            'Knowledge (arcana)': { key_ability: 'int', trained_only: true },
            'Knowledge (architecture)': { key_ability: 'int', trained_only: true },
            'Knowledge (dungeoneering)': { key_ability: 'int', trained_only: true },
            'Knowledge (geography)': { key_ability: 'int', trained_only: true },
            'Knowledge (history)': { key_ability: 'int', trained_only: true },
            'Knowledge (local)': { key_ability: 'int', trained_only: true },
            'Knowledge (nature)': { key_ability: 'int', trained_only: true },
            'Knowledge (nobility)': { key_ability: 'int', trained_only: true },
            'Knowledge (religion)': { key_ability: 'int', trained_only: true },
            'Knowledge (the planes)': { key_ability: 'int', trained_only: true },
            'Listen': { key_ability: 'wis', trained_only: false },
            'Move Silently': { key_ability: 'dex', trained_only: false },
            'Open Lock': { key_ability: 'dex', trained_only: true },
            'Perform': { key_ability: 'cha', trained_only: false },
            'Profession': { key_ability: 'wis', trained_only: true },
            'Ride': { key_ability: 'dex', trained_only: false },
            'Search': { key_ability: 'int', trained_only: false },
            'Sense Motive': { key_ability: 'wis', trained_only: false },
            'Sleight of Hand': { key_ability: 'dex', trained_only: true },
            'Speak Language': { key_ability: 'none', trained_only: true },
            'Spellcraft': { key_ability: 'int', trained_only: true },
            'Spot': { key_ability: 'wis', trained_only: false },
            'Survival': { key_ability: 'wis', trained_only: false },
            'Swim': { key_ability: 'str', trained_only: false },
            'Tumble': { key_ability: 'dex', trained_only: true },
            'Use Magic Device': { key_ability: 'cha', trained_only: true },
            'Use Rope': { key_ability: 'dex', trained_only: false }
        };
    }

    loadFeatData() {
        this.feats = {
            'Alertness': {
                name: 'Alertness',
                type: 'General',
                prerequisites: [],
                benefit: '+2 bonus on Listen and Spot checks',
                description: 'You have finely tuned senses.'
            },
            'Combat Expertise': {
                name: 'Combat Expertise',
                type: 'General',
                prerequisites: ['Int 13'],
                benefit: 'Trade attack bonus for AC bonus',
                description: 'You are trained at using your combat skill for defense as well as offense.'
            },
            'Dodge': {
                name: 'Dodge',
                type: 'General',
                prerequisites: ['Dex 13'],
                benefit: '+1 dodge bonus to AC against one opponent',
                description: 'You are adept at dodging blows.'
            },
            'Improved Initiative': {
                name: 'Improved Initiative',
                type: 'General',
                prerequisites: [],
                benefit: '+4 bonus on initiative checks',
                description: 'You can react faster than normal in a fight.'
            },
            'Iron Will': {
                name: 'Iron Will',
                type: 'General',
                prerequisites: [],
                benefit: '+2 bonus on Will saves',
                description: 'You have a stronger will than normal.'
            },
            'Lightning Reflexes': {
                name: 'Lightning Reflexes',
                type: 'General',
                prerequisites: [],
                benefit: '+2 bonus on Reflex saves',
                description: 'You have faster than normal reflexes.'
            },
            'Power Attack': {
                name: 'Power Attack',
                type: 'General',
                prerequisites: ['Str 13'],
                benefit: 'Trade attack bonus for damage bonus',
                description: 'You can make exceptionally deadly melee attacks by sacrificing accuracy for power.'
            },
            'Toughness': {
                name: 'Toughness',
                type: 'General',
                prerequisites: [],
                benefit: '+3 hit points',
                description: 'You are tougher than normal.'
            },
            'Weapon Focus': {
                name: 'Weapon Focus',
                type: 'General',
                prerequisites: ['Proficiency with selected weapon', 'base attack bonus +1'],
                benefit: '+1 bonus on attack rolls with selected weapon',
                description: 'Choose one type of weapon. You are especially good at using that weapon.'
            },
            'Weapon Finesse': {
                name: 'Weapon Finesse',
                type: 'General',
                prerequisites: ['Proficiency with selected weapon', 'base attack bonus +1'],
                benefit: 'Use Dex instead of Str for attack rolls with light weapons',
                description: 'You are skilled at using your agility in melee combat, as opposed to brute strength.'
            }
        };
    }

    loadEquipmentData() {
        this.equipment = {
            weapons: {
                'dagger': {
                    name: 'Dagger',
                    cost: 2,
                    damage: '1d4',
                    critical: '19-20/x2',
                    range: 10,
                    weight: 1,
                    type: 'simple',
                    category: 'light'
                },
                'longsword': {
                    name: 'Longsword',
                    cost: 15,
                    damage: '1d8',
                    critical: '19-20/x2',
                    weight: 4,
                    type: 'martial',
                    category: 'one-handed'
                },
                'shortbow': {
                    name: 'Shortbow',
                    cost: 30,
                    damage: '1d6',
                    critical: 'x3',
                    range: 60,
                    weight: 2,
                    type: 'martial',
                    category: 'ranged'
                }
            },
            armor: {
                'leather': {
                    name: 'Leather Armor',
                    cost: 10,
                    ac_bonus: 2,
                    max_dex: 6,
                    check_penalty: 0,
                    spell_failure: 10,
                    weight: 15,
                    type: 'light'
                },
                'chainmail': {
                    name: 'Chainmail',
                    cost: 150,
                    ac_bonus: 5,
                    max_dex: 2,
                    check_penalty: -5,
                    spell_failure: 30,
                    weight: 40,
                    type: 'medium'
                }
            },
            gear: {
                'backpack': { name: 'Backpack', cost: 2, weight: 2 },
                'rope': { name: 'Rope (50 ft)', cost: 2, weight: 10 },
                'torch': { name: 'Torch', cost: 0.01, weight: 1 },
                'waterskin': { name: 'Waterskin', cost: 1, weight: 4 }
            }
        };
    }

    // Point-buy system with official D&D 3.5 costs
    getPointBuyCosts() {
        return {
            8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 
            14: 6, 15: 8, 16: 10, 17: 13, 18: 16
        };
    }

    calculatePointBuyTotal(abilities) {
        const costs = this.getPointBuyCosts();
        return Object.values(abilities).reduce((total, score) => {
            return total + (costs[score] || 0);
        }, 0);
    }

    // Race helpers
    getRaceData(raceId) {
        return this.races[raceId] || null;
    }

    applyRacialModifiers(baseAbilities, raceId) {
        const race = this.getRaceData(raceId);
        if (!race) return baseAbilities;

        const modified = { ...baseAbilities };
        for (const [ability, modifier] of Object.entries(race.abilityMods)) {
            modified[ability] = (modified[ability] || 10) + modifier;
        }
        return modified;
    }

    // Class helpers
    getClassData(classId) {
        return this.classes[classId] || null;
    }

    getClassSkillPoints(classId, level, intMod) {
        const classData = this.getClassData(classId);
        if (!classData) return 0;

        const basePoints = classData.skill_points + intMod;
        return level === 1 ? basePoints * 4 : basePoints;
    }

    isClassSkill(skill, classId) {
        const classData = this.getClassData(classId);
        return classData ? classData.class_skills.includes(skill) : false;
    }

    // Starting equipment by class
    getStartingEquipment(classId) {
        const equipment = {
            'fighter': ['longsword', 'shortbow', 'leather', 'backpack'],
            'wizard': ['dagger', 'leather', 'backpack', 'spellbook'],
            'rogue': ['dagger', 'shortbow', 'leather', 'backpack'],
            'cleric': ['mace', 'chainmail', 'backpack'],
            'barbarian': ['longsword', 'leather', 'backpack'],
            'bard': ['longsword', 'leather', 'backpack'],
            'druid': ['scimitar', 'leather', 'backpack'],
            'monk': ['quarterstaff', 'backpack'],
            'paladin': ['longsword', 'chainmail', 'backpack'],
            'ranger': ['longsword', 'shortbow', 'leather', 'backpack'],
            'sorcerer': ['dagger', 'leather', 'backpack']
        };
        
        return equipment[classId] || ['dagger', 'leather', 'backpack'];
    }

    // Get starting gold for class
    getStartingGold(className) {
        // Return average value for simplicity
        const averages = {
            barbarian: 100,
            bard: 100,
            cleric: 125,
            druid: 50,
            fighter: 150,
            monk: 125,
            paladin: 150,
            ranger: 150,
            rogue: 125,
            sorcerer: 75,
            wizard: 75
        };
        
        return averages[className.toLowerCase()] || 100;
    }

    // Check if class can cast spells
    isSpellcaster(classId) {
        const spellcastingClasses = ['bard', 'cleric', 'druid', 'sorcerer', 'wizard', 'paladin', 'ranger'];
        return spellcastingClasses.includes(classId.toLowerCase());
    }

    // Get spells per day for class and level
    getSpellsPerDay(classId, level) {
        const spellsPerDay = {
            bard: {
                1: { 0: 2 }
            },
            cleric: {
                1: { 0: 3, 1: 1 }
            },
            druid: {
                1: { 0: 3, 1: 1 }
            },
            sorcerer: {
                1: { 0: 5, 1: 3 }
            },
            wizard: {
                1: { 0: 3, 1: 1 }
            },
            paladin: {
                1: { 0: 0, 1: 0 } // No spells at 1st level
            },
            ranger: {
                1: { 0: 0, 1: 0 } // No spells at 1st level
            }
        };
        
        return spellsPerDay[classId.toLowerCase()]?.[level] || {};
    }

    // Get basic spell list for each class (simplified for 1st level)
    getClassSpells(classId, level) {
        const spells = {
            bard: {
                0: ['Dancing Lights', 'Daze', 'Detect Magic', 'Flare', 'Ghost Sound', 'Know Direction', 'Light', 'Lullaby', 'Mage Hand', 'Mending', 'Message', 'Open/Close', 'Prestidigitation', 'Read Magic', 'Resistance', 'Summon Instrument'],
                1: ['Alarm', 'Animate Rope', 'Cause Fear', 'Charm Person', 'Comprehend Languages', 'Cure Light Wounds', 'Detect Secret Doors', 'Disguise Self', 'Erase', 'Expeditious Retreat', 'Feather Fall', 'Grease', 'Hideous Laughter', 'Hypnotism', 'Identify', 'Lesser Confusion', 'Magic Mouth', 'Obscure Object', 'Remove Fear', 'Silent Image', 'Sleep', 'Summon Monster I', 'Undetectable Alignment', 'Unseen Servant', 'Ventriloquism']
            },
            cleric: {
                0: ['Create Water', 'Cure Minor Wounds', 'Detect Magic', 'Detect Poison', 'Guidance', 'Inflict Minor Wounds', 'Light', 'Mending', 'Purify Food and Drink', 'Read Magic', 'Resistance', 'Virtue'],
                1: ['Bane', 'Bless', 'Bless Water', 'Cause Fear', 'Command', 'Comprehend Languages', 'Cure Light Wounds', 'Curse Water', 'Deathwatch', 'Detect Chaos/Evil/Good/Law', 'Detect Undead', 'Divine Favor', 'Doom', 'Endure Elements', 'Entropic Shield', 'Hide from Undead', 'Inflict Light Wounds', 'Magic Stone', 'Magic Weapon', 'Obscuring Mist', 'Protection from Chaos/Evil/Good/Law', 'Random Action', 'Remove Fear', 'Sanctuary', 'Shield of Faith', 'Summon Monster I']
            },
            druid: {
                0: ['Create Water', 'Cure Minor Wounds', 'Detect Magic', 'Detect Poison', 'Flare', 'Guidance', 'Know Direction', 'Light', 'Mending', 'Purify Food and Drink', 'Read Magic', 'Resistance', 'Virtue'],
                1: ['Calm Animals', 'Charm Animal', 'Cure Light Wounds', 'Detect Animals or Plants', 'Detect Snares and Pits', 'Endure Elements', 'Entangle', 'Faerie Fire', 'Goodberry', 'Hide from Animals', 'Jump', 'Longstrider', 'Magic Fang', 'Magic Stone', 'Obscuring Mist', 'Pass without Trace', 'Produce Flame', 'Shillelagh', 'Speak with Animals', 'Summon Nature\'s Ally I']
            },
            sorcerer: {
                0: ['Arcane Mark', 'Dancing Lights', 'Daze', 'Detect Magic', 'Detect Poison', 'Disrupt Undead', 'Flare', 'Ghost Sound', 'Light', 'Mage Hand', 'Mending', 'Message', 'Open/Close', 'Prestidigitation', 'Ray of Frost', 'Read Magic', 'Resistance', 'Touch of Fatigue'],
                1: ['Alarm', 'Burning Hands', 'Cause Fear', 'Charm Person', 'Chill Touch', 'Color Spray', 'Comprehend Languages', 'Detect Secret Doors', 'Detect Undead', 'Disguise Self', 'Endure Elements', 'Enlarge Person', 'Erase', 'Expeditious Retreat', 'Feather Fall', 'Grease', 'Hold Portal', 'Hypnotism', 'Identify', 'Jump', 'Mage Armor', 'Magic Missile', 'Magic Weapon', 'Mount', 'Obscuring Mist', 'Protection from Chaos/Evil/Good/Law', 'Ray of Enfeeblement', 'Reduce Person', 'Shield', 'Shocking Grasp', 'Silent Image', 'Sleep', 'Summon Monster I', 'True Strike', 'Unseen Servant', 'Ventriloquism']
            },
            wizard: {
                0: ['Arcane Mark', 'Dancing Lights', 'Daze', 'Detect Magic', 'Detect Poison', 'Disrupt Undead', 'Flare', 'Ghost Sound', 'Light', 'Mage Hand', 'Mending', 'Message', 'Open/Close', 'Prestidigitation', 'Ray of Frost', 'Read Magic', 'Resistance', 'Touch of Fatigue'],
                1: ['Alarm', 'Burning Hands', 'Cause Fear', 'Charm Person', 'Chill Touch', 'Color Spray', 'Comprehend Languages', 'Detect Secret Doors', 'Detect Undead', 'Disguise Self', 'Endure Elements', 'Enlarge Person', 'Erase', 'Expeditious Retreat', 'Feather Fall', 'Grease', 'Hold Portal', 'Hypnotism', 'Identify', 'Jump', 'Mage Armor', 'Magic Missile', 'Magic Weapon', 'Mount', 'Obscuring Mist', 'Protection from Chaos/Evil/Good/Law', 'Ray of Enfeeblement', 'Reduce Person', 'Shield', 'Shocking Grasp', 'Silent Image', 'Sleep', 'Summon Monster I', 'True Strike', 'Unseen Servant', 'Ventriloquism']
            }
        };
        
        const classSpells = spells[classId.toLowerCase()];
        if (!classSpells) return {};
        
        const availableSpells = {};
        for (let spellLevel = 0; spellLevel <= level; spellLevel++) {
            if (classSpells[spellLevel]) {
                availableSpells[spellLevel] = classSpells[spellLevel];
            }
        }
        
        return availableSpells;
    }
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SRDDataManager;
} else if (typeof window !== 'undefined') {
    window.SRDDataManager = SRDDataManager;
}
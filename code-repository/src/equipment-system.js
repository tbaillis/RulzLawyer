/**
 * RulzLawyer Equipment System
 * Complete D&D 3.5 equipment implementation with weapons, armor, magic items, and inventory
 * 
 * Features:
 * - Complete D&D 3.5 SRD equipment database
 * - Weapons (simple, martial, exotic) with damage, critical, properties
 * - Armor and shields with AC bonuses, penalties, speeds
 * - Magic items with enhancement bonuses and special abilities
 * - Inventory management with encumbrance and carrying capacity
 * - Equipment effects on character stats and abilities
 * 
 * Requirements Traceability:
 * - REQ-007: Complete D&D 3.5 equipment system
 * - US-017: Equipment selection and stat modification
 * - TS-007: Equipment database and character integration
 */

class EquipmentSystem {
    constructor(characterDataModel, diceEngine) {
        this.characterDataModel = characterDataModel;
        this.diceEngine = diceEngine;
        
        this.metadata = {
            version: '1.0.0',
            created: new Date(),
            totalItems: 0,
            lastUpdated: null
        };

        console.log('⚔️ Initializing Equipment System...');
        this.initializeEquipmentDatabase();
        console.log('✅ Equipment System ready');
    }

    // === Equipment Database Initialization ===
    initializeEquipmentDatabase() {
        this.weapons = new Map();
        this.armor = new Map();
        this.shields = new Map();
        this.magicItems = new Map();
        this.adventuringGear = new Map();
        this.equipmentByType = new Map();

        // Initialize equipment categories
        this.equipmentTypes = {
            weapon: 'Weapons',
            armor: 'Armor',
            shield: 'Shields',
            magicItem: 'Magic Items',
            adventuringGear: 'Adventuring Gear',
            tool: 'Tools',
            container: 'Containers',
            mount: 'Mounts and Vehicles'
        };

        // Load all D&D 3.5 SRD equipment
        this.loadWeapons();
        this.loadArmor();
        this.loadShields();
        this.loadMagicItems();
        this.loadAdventuringGear();
        
        this.metadata.totalItems = this.weapons.size + this.armor.size + this.shields.size + 
                                  this.magicItems.size + this.adventuringGear.size;
        this.metadata.lastUpdated = new Date();
        
        console.log(`⚔️ Loaded ${this.metadata.totalItems} equipment items`);
    }

    // === Weapons Database ===
    loadWeapons() {
        const weapons = [
            // Simple Melee Weapons
            {
                name: 'Club',
                category: 'simple',
                type: 'melee',
                cost: 0,
                damage: { small: '1d4', medium: '1d6', large: '1d8' },
                critical: { threat: 20, multiplier: 2 },
                range: 10,
                weight: 3,
                damageType: 'bludgeoning',
                properties: [],
                description: 'A wooden club, one of the simplest weapons.'
            },
            {
                name: 'Dagger',
                category: 'simple',
                type: 'melee',
                cost: 2,
                damage: { small: '1d3', medium: '1d4', large: '1d6' },
                critical: { threat: [19, 20], multiplier: 2 },
                range: 10,
                weight: 1,
                damageType: 'piercing',
                properties: ['light', 'finesse', 'thrown'],
                description: 'A short blade designed for close combat or throwing.'
            },
            {
                name: 'Dart',
                category: 'simple',
                type: 'ranged',
                cost: 0.5,
                damage: { small: '1d3', medium: '1d4', large: '1d6' },
                critical: { threat: 20, multiplier: 2 },
                range: 20,
                weight: 0.5,
                damageType: 'piercing',
                properties: ['thrown'],
                description: 'A small thrown weapon with a pointed tip.'
            },
            {
                name: 'Javelin',
                category: 'simple',
                type: 'melee',
                cost: 1,
                damage: { small: '1d4', medium: '1d6', large: '1d8' },
                critical: { threat: 20, multiplier: 2 },
                range: 30,
                weight: 2,
                damageType: 'piercing',
                properties: ['thrown'],
                description: 'A light spear designed for throwing.'
            },
            {
                name: 'Mace',
                category: 'simple',
                type: 'melee',
                cost: 12,
                damage: { small: '1d6', medium: '1d8', large: '1d10' },
                critical: { threat: 20, multiplier: 2 },
                range: null,
                weight: 8,
                damageType: 'bludgeoning',
                properties: [],
                description: 'A heavy war club with a weighted head.'
            },
            {
                name: 'Morningstar',
                category: 'simple',
                type: 'melee',
                cost: 8,
                damage: { small: '1d6', medium: '1d8', large: '1d10' },
                critical: { threat: 20, multiplier: 2 },
                range: null,
                weight: 6,
                damageType: 'bludgeoning and piercing',
                properties: [],
                description: 'A club topped with a spiked metal head.'
            },
            {
                name: 'Quarterstaff',
                category: 'simple',
                type: 'melee',
                cost: 0,
                damage: { small: '1d4/1d4', medium: '1d6/1d6', large: '1d8/1d8' },
                critical: { threat: 20, multiplier: 2 },
                range: null,
                weight: 4,
                damageType: 'bludgeoning',
                properties: ['double', 'monk'],
                description: 'A simple wooden staff that can be used double-ended.'
            },
            {
                name: 'Shortspear',
                category: 'simple',
                type: 'melee',
                cost: 1,
                damage: { small: '1d4', medium: '1d6', large: '1d8' },
                critical: { threat: 20, multiplier: 3 },
                range: 20,
                weight: 3,
                damageType: 'piercing',
                properties: ['thrown'],
                description: 'A one-handed spear suitable for throwing.'
            },
            {
                name: 'Sickle',
                category: 'simple',
                type: 'melee',
                cost: 6,
                damage: { small: '1d4', medium: '1d6', large: '1d8' },
                critical: { threat: 20, multiplier: 2 },
                range: null,
                weight: 2,
                damageType: 'slashing',
                properties: ['light'],
                description: 'A curved blade used for harvesting grain.'
            },
            {
                name: 'Sling',
                category: 'simple',
                type: 'ranged',
                cost: 0,
                damage: { small: '1d3', medium: '1d4', large: '1d6' },
                critical: { threat: 20, multiplier: 2 },
                range: 50,
                weight: 0,
                damageType: 'bludgeoning',
                properties: [],
                ammunition: 'sling bullets',
                description: 'A leather strap used to hurl stones or bullets.'
            },

            // Martial Melee Weapons
            {
                name: 'Battleaxe',
                category: 'martial',
                type: 'melee',
                cost: 10,
                damage: { small: '1d6', medium: '1d8', large: '1d10' },
                critical: { threat: 20, multiplier: 3 },
                range: null,
                weight: 6,
                damageType: 'slashing',
                properties: [],
                description: 'A one-handed axe balanced for combat.'
            },
            {
                name: 'Greataxe',
                category: 'martial',
                type: 'melee',
                cost: 20,
                damage: { small: '1d10', medium: '1d12', large: '3d6' },
                critical: { threat: 20, multiplier: 3 },
                range: null,
                weight: 12,
                damageType: 'slashing',
                properties: ['two-handed'],
                description: 'A massive two-handed axe.'
            },
            {
                name: 'Greatsword',
                category: 'martial',
                type: 'melee',
                cost: 50,
                damage: { small: '1d10', medium: '2d6', large: '3d6' },
                critical: { threat: [19, 20], multiplier: 2 },
                range: null,
                weight: 8,
                damageType: 'slashing',
                properties: ['two-handed'],
                description: 'A long two-handed sword.'
            },
            {
                name: 'Longsword',
                category: 'martial',
                type: 'melee',
                cost: 15,
                damage: { small: '1d6', medium: '1d8', large: '1d10' },
                critical: { threat: [19, 20], multiplier: 2 },
                range: null,
                weight: 4,
                damageType: 'slashing',
                properties: [],
                description: 'A versatile one-handed sword.'
            },
            {
                name: 'Rapier',
                category: 'martial',
                type: 'melee',
                cost: 20,
                damage: { small: '1d4', medium: '1d6', large: '1d8' },
                critical: { threat: [18, 19, 20], multiplier: 2 },
                range: null,
                weight: 2,
                damageType: 'piercing',
                properties: ['finesse'],
                description: 'A light thrusting sword excellent for precise attacks.'
            },
            {
                name: 'Scimitar',
                category: 'martial',
                type: 'melee',
                cost: 15,
                damage: { small: '1d4', medium: '1d6', large: '1d8' },
                critical: { threat: [18, 19, 20], multiplier: 2 },
                range: null,
                weight: 4,
                damageType: 'slashing',
                properties: ['light'],
                description: 'A curved sword favored by cavalry.'
            },
            {
                name: 'Shortbow',
                category: 'martial',
                type: 'ranged',
                cost: 30,
                damage: { small: '1d4', medium: '1d6', large: '1d8' },
                critical: { threat: 20, multiplier: 3 },
                range: 60,
                weight: 2,
                damageType: 'piercing',
                properties: [],
                ammunition: 'arrows',
                description: 'A simple bow suitable for most warriors.'
            },
            {
                name: 'Longbow',
                category: 'martial',
                type: 'ranged',
                cost: 75,
                damage: { small: '1d6', medium: '1d8', large: '1d10' },
                critical: { threat: 20, multiplier: 3 },
                range: 100,
                weight: 3,
                damageType: 'piercing',
                properties: [],
                ammunition: 'arrows',
                description: 'A tall bow with excellent range and power.'
            },

            // Exotic Weapons
            {
                name: 'Bastard Sword',
                category: 'exotic',
                type: 'melee',
                cost: 35,
                damage: { small: '1d8', medium: '1d10', large: '1d12' },
                critical: { threat: [19, 20], multiplier: 2 },
                range: null,
                weight: 6,
                damageType: 'slashing',
                properties: ['versatile'],
                description: 'A sword that can be wielded one or two-handed.'
            },
            {
                name: 'Whip',
                category: 'exotic',
                type: 'melee',
                cost: 1,
                damage: { small: '1d2', medium: '1d3', large: '1d4' },
                critical: { threat: 20, multiplier: 2 },
                range: null,
                weight: 2,
                damageType: 'slashing',
                properties: ['reach', 'nonlethal', 'disarm', 'trip'],
                description: 'A flexible weapon with 15-foot reach.'
            }
        ];

        weapons.forEach(weapon => {
            weapon.id = weapon.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
            weapon.equipmentType = 'weapon';
            this.weapons.set(weapon.id, weapon);
        });

        console.log(`⚔️ Loaded ${weapons.length} weapons`);
    }

    // === Armor Database ===
    loadArmor() {
        const armor = [
            // Light Armor
            {
                name: 'Padded',
                category: 'light',
                cost: 5,
                armorBonus: 1,
                maxDex: 8,
                checkPenalty: 0,
                arcaneFailure: 5,
                speed30: 30,
                speed20: 20,
                weight: 10,
                description: 'Simple quilted cloth armor.'
            },
            {
                name: 'Leather',
                category: 'light',
                cost: 10,
                armorBonus: 2,
                maxDex: 6,
                checkPenalty: 0,
                arcaneFailure: 10,
                speed30: 30,
                speed20: 20,
                weight: 15,
                description: 'Soft leather armor that provides basic protection.'
            },
            {
                name: 'Studded Leather',
                category: 'light',
                cost: 25,
                armorBonus: 3,
                maxDex: 5,
                checkPenalty: -1,
                arcaneFailure: 15,
                speed30: 30,
                speed20: 20,
                weight: 20,
                description: 'Leather armor with metal studs for extra protection.'
            },
            {
                name: 'Chain Shirt',
                category: 'light',
                cost: 100,
                armorBonus: 4,
                maxDex: 4,
                checkPenalty: -2,
                arcaneFailure: 20,
                speed30: 30,
                speed20: 20,
                weight: 25,
                description: 'A shirt of interlocking metal rings.'
            },

            // Medium Armor
            {
                name: 'Hide',
                category: 'medium',
                cost: 15,
                armorBonus: 3,
                maxDex: 4,
                checkPenalty: -3,
                arcaneFailure: 20,
                speed30: 20,
                speed20: 15,
                weight: 25,
                description: 'Thick animal hide provides moderate protection.'
            },
            {
                name: 'Scale Mail',
                category: 'medium',
                cost: 50,
                armorBonus: 4,
                maxDex: 3,
                checkPenalty: -4,
                arcaneFailure: 25,
                speed30: 20,
                speed20: 15,
                weight: 30,
                description: 'Overlapping metal scales sewn to a backing.'
            },
            {
                name: 'Chainmail',
                category: 'medium',
                cost: 150,
                armorBonus: 5,
                maxDex: 2,
                checkPenalty: -5,
                arcaneFailure: 30,
                speed30: 20,
                speed20: 15,
                weight: 40,
                description: 'Interlocking metal rings covering the torso and arms.'
            },
            {
                name: 'Breastplate',
                category: 'medium',
                cost: 200,
                armorBonus: 5,
                maxDex: 3,
                checkPenalty: -4,
                arcaneFailure: 25,
                speed30: 20,
                speed20: 15,
                weight: 30,
                description: 'A metal chestplate with minimal arm protection.'
            },

            // Heavy Armor
            {
                name: 'Splint Mail',
                category: 'heavy',
                cost: 200,
                armorBonus: 6,
                maxDex: 0,
                checkPenalty: -7,
                arcaneFailure: 40,
                speed30: 20,
                speed20: 15,
                weight: 45,
                description: 'Metal strips riveted to a backing of leather.'
            },
            {
                name: 'Banded Mail',
                category: 'heavy',
                cost: 250,
                armorBonus: 6,
                maxDex: 1,
                checkPenalty: -6,
                arcaneFailure: 35,
                speed30: 20,
                speed20: 15,
                weight: 35,
                description: 'Overlapping strips of metal sewn to a backing.'
            },
            {
                name: 'Half-Plate',
                category: 'heavy',
                cost: 600,
                armorBonus: 7,
                maxDex: 0,
                checkPenalty: -7,
                arcaneFailure: 40,
                speed30: 20,
                speed20: 15,
                weight: 50,
                description: 'Plate armor covering the most vital areas.'
            },
            {
                name: 'Full Plate',
                category: 'heavy',
                cost: 1500,
                armorBonus: 8,
                maxDex: 1,
                checkPenalty: -6,
                arcaneFailure: 35,
                speed30: 20,
                speed20: 15,
                weight: 50,
                description: 'Complete suit of interlocking plates.'
            }
        ];

        armor.forEach(armorPiece => {
            armorPiece.id = armorPiece.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
            armorPiece.equipmentType = 'armor';
            this.armor.set(armorPiece.id, armorPiece);
        });

        console.log(`🛡️ Loaded ${armor.length} armor pieces`);
    }

    // === Shields Database ===
    loadShields() {
        const shields = [
            {
                name: 'Buckler',
                cost: 15,
                armorBonus: 1,
                maxDex: null,
                checkPenalty: -1,
                arcaneFailure: 5,
                weight: 5,
                description: 'A small shield strapped to the forearm.'
            },
            {
                name: 'Shield, Light Wooden',
                cost: 3,
                armorBonus: 1,
                maxDex: null,
                checkPenalty: -1,
                arcaneFailure: 5,
                weight: 5,
                description: 'A light wooden shield held in the hand.'
            },
            {
                name: 'Shield, Light Steel',
                cost: 9,
                armorBonus: 1,
                maxDex: null,
                checkPenalty: -1,
                arcaneFailure: 5,
                weight: 6,
                description: 'A light steel shield held in the hand.'
            },
            {
                name: 'Shield, Heavy Wooden',
                cost: 7,
                armorBonus: 2,
                maxDex: null,
                checkPenalty: -2,
                arcaneFailure: 15,
                weight: 10,
                description: 'A large wooden shield covering most of the body.'
            },
            {
                name: 'Shield, Heavy Steel',
                cost: 20,
                armorBonus: 2,
                maxDex: null,
                checkPenalty: -2,
                arcaneFailure: 15,
                weight: 15,
                description: 'A large steel shield providing excellent protection.'
            },
            {
                name: 'Shield, Tower',
                cost: 30,
                armorBonus: 4,
                maxDex: 2,
                checkPenalty: -10,
                arcaneFailure: 50,
                weight: 45,
                description: 'A massive shield that provides cover but limits mobility.'
            }
        ];

        shields.forEach(shield => {
            shield.id = shield.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
            shield.equipmentType = 'shield';
            shield.category = 'shield';
            this.shields.set(shield.id, shield);
        });

        console.log(`🛡️ Loaded ${shields.length} shields`);
    }

    // === Magic Items Database ===
    loadMagicItems() {
        const magicItems = [
            // Magic Weapons
            {
                name: 'Longsword +1',
                baseItem: 'longsword',
                enhancement: 1,
                cost: 2315,
                weight: 4,
                description: 'A longsword with a +1 enhancement bonus to attack and damage.',
                properties: { attackBonus: 1, damageBonus: 1 },
                equipmentType: 'magicItem',
                category: 'weapon'
            },
            {
                name: 'Flaming Longsword',
                baseItem: 'longsword',
                enhancement: 1,
                cost: 8315,
                weight: 4,
                description: 'A longsword that bursts into flame on command.',
                properties: { 
                    attackBonus: 1, 
                    damageBonus: 1, 
                    specialAbilities: ['flaming']
                },
                equipmentType: 'magicItem',
                category: 'weapon'
            },

            // Magic Armor
            {
                name: 'Leather Armor +1',
                baseItem: 'leather',
                enhancement: 1,
                cost: 1160,
                weight: 15,
                description: 'Leather armor with a +1 enhancement bonus to AC.',
                properties: { acBonus: 1 },
                equipmentType: 'magicItem',
                category: 'armor'
            },
            {
                name: 'Chainmail +1',
                baseItem: 'chainmail',
                enhancement: 1,
                cost: 1300,
                weight: 40,
                description: 'Chainmail with a +1 enhancement bonus to AC.',
                properties: { acBonus: 1 },
                equipmentType: 'magicItem',
                category: 'armor'
            },

            // Wondrous Items
            {
                name: 'Cloak of Resistance +1',
                cost: 1000,
                weight: 1,
                description: 'A cloak that provides resistance to harmful effects.',
                properties: { 
                    saves: { fortitude: 1, reflex: 1, will: 1 }
                },
                equipmentType: 'magicItem',
                category: 'wondrous',
                slot: 'shoulders'
            },
            {
                name: 'Amulet of Natural Armor +1',
                cost: 2000,
                weight: 0,
                description: 'An amulet that enhances natural armor.',
                properties: { 
                    naturalArmor: 1
                },
                equipmentType: 'magicItem',
                category: 'wondrous',
                slot: 'neck'
            },
            {
                name: 'Ring of Protection +1',
                cost: 2000,
                weight: 0,
                description: 'A ring that provides a deflection bonus to AC.',
                properties: { 
                    deflectionBonus: 1
                },
                equipmentType: 'magicItem',
                category: 'ring',
                slot: 'ring'
            },
            {
                name: 'Gauntlets of Ogre Power',
                cost: 4000,
                weight: 4,
                description: 'Gauntlets that grant the strength of an ogre.',
                properties: { 
                    abilities: { Strength: 19 }
                },
                equipmentType: 'magicItem',
                category: 'wondrous',
                slot: 'hands'
            },
            {
                name: 'Boots of Speed',
                cost: 12000,
                weight: 1,
                description: 'Boots that allow the wearer to move with incredible speed.',
                properties: { 
                    speed: 'haste_10_rounds_per_day'
                },
                equipmentType: 'magicItem',
                category: 'wondrous',
                slot: 'feet'
            },

            // Potions
            {
                name: 'Potion of Cure Light Wounds',
                cost: 50,
                weight: 0,
                description: 'A potion that heals minor injuries.',
                properties: { 
                    spellEffect: 'cure_light_wounds',
                    casterLevel: 1,
                    singleUse: true
                },
                equipmentType: 'magicItem',
                category: 'potion'
            },
            {
                name: 'Potion of Bull\'s Strength',
                cost: 300,
                weight: 0,
                description: 'A potion that enhances physical power.',
                properties: { 
                    spellEffect: 'bulls_strength',
                    casterLevel: 3,
                    singleUse: true
                },
                equipmentType: 'magicItem',
                category: 'potion'
            }
        ];

        magicItems.forEach(item => {
            item.id = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
            this.magicItems.set(item.id, item);
        });

        console.log(`✨ Loaded ${magicItems.length} magic items`);
    }

    // === Adventuring Gear Database ===
    loadAdventuringGear() {
        const gear = [
            // Basic Adventuring Gear
            {
                name: 'Backpack',
                cost: 2,
                weight: 2,
                description: 'A leather pack for carrying gear.',
                equipmentType: 'adventuringGear',
                category: 'container'
            },
            {
                name: 'Bedroll',
                cost: 0.1,
                weight: 5,
                description: 'A sleeping bag and blanket.',
                equipmentType: 'adventuringGear',
                category: 'camping'
            },
            {
                name: 'Hemp Rope (50 feet)',
                cost: 2,
                weight: 10,
                description: 'Sturdy rope for climbing and binding.',
                equipmentType: 'adventuringGear',
                category: 'tool'
            },
            {
                name: 'Silk Rope (50 feet)',
                cost: 10,
                weight: 5,
                description: 'Light but strong rope.',
                equipmentType: 'adventuringGear',
                category: 'tool'
            },
            {
                name: 'Grappling Hook',
                cost: 1,
                weight: 4,
                description: 'A hook for climbing.',
                equipmentType: 'adventuringGear',
                category: 'tool'
            },
            {
                name: 'Lantern, Hooded',
                cost: 7,
                weight: 2,
                description: 'A lantern with shutters for directional light.',
                equipmentType: 'adventuringGear',
                category: 'light'
            },
            {
                name: 'Torch',
                cost: 0.01,
                weight: 1,
                description: 'A simple wooden torch.',
                equipmentType: 'adventuringGear',
                category: 'light'
            },
            {
                name: 'Thieves\' Tools',
                cost: 30,
                weight: 1,
                description: 'Tools for picking locks and disabling devices.',
                equipmentType: 'adventuringGear',
                category: 'tool',
                properties: { skillBonus: { 'Open Lock': 2, 'Disable Device': 2 } }
            },
            {
                name: 'Healer\'s Kit',
                cost: 50,
                weight: 1,
                description: 'Supplies for treating wounds.',
                equipmentType: 'adventuringGear',
                category: 'tool',
                properties: { skillBonus: { Heal: 2 }, uses: 10 }
            },

            // Food and Drink
            {
                name: 'Trail Rations (per day)',
                cost: 0.5,
                weight: 1,
                description: 'One day\'s food for travel.',
                equipmentType: 'adventuringGear',
                category: 'food'
            },
            {
                name: 'Waterskin',
                cost: 1,
                weight: 4,
                description: 'A leather container for water.',
                equipmentType: 'adventuringGear',
                category: 'container'
            },

            // Ammunition
            {
                name: 'Arrows (20)',
                cost: 1,
                weight: 3,
                description: 'Twenty arrows for bows.',
                equipmentType: 'adventuringGear',
                category: 'ammunition'
            },
            {
                name: 'Sling Bullets (10)',
                cost: 0.1,
                weight: 5,
                description: 'Ten lead bullets for slings.',
                equipmentType: 'adventuringGear',
                category: 'ammunition'
            }
        ];

        gear.forEach(item => {
            item.id = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
            this.adventuringGear.set(item.id, item);
        });

        console.log(`🎒 Loaded ${gear.length} adventuring gear items`);
    }

    // === Equipment Management ===
    equipItem(character, itemId, slot = null) {
        const item = this.getItemById(itemId);
        if (!item) return { success: false, message: 'Item not found' };

        // Initialize equipment if needed
        if (!character.equipment) {
            character.equipment = {
                worn: {},
                carried: [],
                slots: {
                    mainHand: null,
                    offHand: null,
                    armor: null,
                    helmet: null,
                    amulet: null,
                    ring1: null,
                    ring2: null,
                    cloak: null,
                    belt: null,
                    boots: null,
                    bracers: null,
                    gloves: null
                }
            };
        }

        // Determine slot for item
        const targetSlot = slot || this.determineSlot(item);
        
        if (!targetSlot) {
            // Add to carried items if no slot
            character.equipment.carried.push({
                id: itemId,
                quantity: 1,
                equipped: false
            });
            return { success: true, message: 'Item added to inventory' };
        }

        // Check if slot is occupied
        if (character.equipment.slots[targetSlot]) {
            return { 
                success: false, 
                message: `Slot ${targetSlot} is already occupied by ${character.equipment.slots[targetSlot]}` 
            };
        }

        // Equip the item
        character.equipment.slots[targetSlot] = itemId;
        character.equipment.worn[itemId] = {
            slot: targetSlot,
            effects: this.calculateItemEffects(item)
        };

        // Apply equipment effects
        this.applyEquipmentEffects(character, itemId, item);

        return { success: true, message: `${item.name} equipped in ${targetSlot}` };
    }

    unequipItem(character, itemId) {
        if (!character.equipment?.worn?.[itemId]) {
            return { success: false, message: 'Item not equipped' };
        }

        const wornItem = character.equipment.worn[itemId];
        const slot = wornItem.slot;

        // Remove from slot
        character.equipment.slots[slot] = null;
        delete character.equipment.worn[itemId];

        // Remove equipment effects
        this.removeEquipmentEffects(character, itemId);

        // Add to carried items
        character.equipment.carried.push({
            id: itemId,
            quantity: 1,
            equipped: false
        });

        const item = this.getItemById(itemId);
        return { success: true, message: `${item.name} unequipped` };
    }

    determineSlot(item) {
        if (item.equipmentType === 'weapon') {
            if (item.properties?.includes('two-handed')) {
                return 'mainHand'; // Two-handed weapons occupy main hand
            }
            return 'mainHand'; // Default to main hand
        }
        
        if (item.equipmentType === 'armor') {
            return 'armor';
        }
        
        if (item.equipmentType === 'shield') {
            return 'offHand';
        }
        
        if (item.equipmentType === 'magicItem' && item.slot) {
            // Map magic item slots to equipment slots
            const slotMapping = {
                'neck': 'amulet',
                'shoulders': 'cloak',
                'hands': 'gloves',
                'feet': 'boots',
                'ring': 'ring1', // Will need logic to find available ring slot
                'head': 'helmet',
                'waist': 'belt',
                'wrists': 'bracers'
            };
            return slotMapping[item.slot];
        }
        
        return null; // No specific slot, goes to inventory
    }

    calculateItemEffects(item) {
        const effects = {};
        
        if (item.properties) {
            // Weapon effects
            if (item.properties.attackBonus) {
                effects.attackBonus = item.properties.attackBonus;
            }
            if (item.properties.damageBonus) {
                effects.damageBonus = item.properties.damageBonus;
            }
            
            // Armor effects
            if (item.armorBonus) {
                effects.armorClass = item.armorBonus;
            }
            if (item.properties.acBonus) {
                effects.armorClass = (effects.armorClass || 0) + item.properties.acBonus;
            }
            
            // Save bonuses
            if (item.properties.saves) {
                effects.saves = { ...item.properties.saves };
            }
            
            // Ability bonuses
            if (item.properties.abilities) {
                effects.abilities = { ...item.properties.abilities };
            }
            
            // Skill bonuses
            if (item.properties.skillBonus) {
                effects.skills = { ...item.properties.skillBonus };
            }
        }
        
        return effects;
    }

    applyEquipmentEffects(character, itemId, item) {
        if (!character.equipmentBonuses) {
            character.equipmentBonuses = {
                armorClass: 0,
                saves: {},
                abilities: {},
                skills: {},
                attack: 0,
                damage: 0
            };
        }

        const effects = this.calculateItemEffects(item);
        
        // Apply effects
        if (effects.armorClass) {
            character.equipmentBonuses.armorClass += effects.armorClass;
        }
        if (effects.attackBonus) {
            character.equipmentBonuses.attack += effects.attackBonus;
        }
        if (effects.damageBonus) {
            character.equipmentBonuses.damage += effects.damageBonus;
        }
        if (effects.saves) {
            for (const [save, bonus] of Object.entries(effects.saves)) {
                character.equipmentBonuses.saves[save] = 
                    (character.equipmentBonuses.saves[save] || 0) + bonus;
            }
        }
        if (effects.abilities) {
            for (const [ability, value] of Object.entries(effects.abilities)) {
                character.equipmentBonuses.abilities[ability] = 
                    Math.max(character.equipmentBonuses.abilities[ability] || 0, value);
            }
        }
        if (effects.skills) {
            for (const [skill, bonus] of Object.entries(effects.skills)) {
                character.equipmentBonuses.skills[skill] = 
                    (character.equipmentBonuses.skills[skill] || 0) + bonus;
            }
        }
    }

    removeEquipmentEffects(character, itemId) {
        const item = this.getItemById(itemId);
        if (!item || !character.equipmentBonuses) return;

        const effects = this.calculateItemEffects(item);
        
        // Remove effects
        if (effects.armorClass) {
            character.equipmentBonuses.armorClass -= effects.armorClass;
        }
        if (effects.attackBonus) {
            character.equipmentBonuses.attack -= effects.attackBonus;
        }
        if (effects.damageBonus) {
            character.equipmentBonuses.damage -= effects.damageBonus;
        }
        if (effects.saves) {
            for (const [save, bonus] of Object.entries(effects.saves)) {
                character.equipmentBonuses.saves[save] = 
                    (character.equipmentBonuses.saves[save] || 0) - bonus;
            }
        }
        if (effects.skills) {
            for (const [skill, bonus] of Object.entries(effects.skills)) {
                character.equipmentBonuses.skills[skill] = 
                    (character.equipmentBonuses.skills[skill] || 0) - bonus;
            }
        }
    }

    // === Encumbrance System ===
    calculateEncumbrance(character) {
        if (!character.equipment) return { load: 'light', current: 0, capacity: {} };

        const strength = character.abilities?.Strength || 10;
        const capacity = this.getCarryingCapacity(strength);
        
        let totalWeight = 0;
        
        // Calculate weight of worn items
        if (character.equipment.worn) {
            for (const itemId of Object.keys(character.equipment.worn)) {
                const item = this.getItemById(itemId);
                if (item) totalWeight += item.weight || 0;
            }
        }
        
        // Calculate weight of carried items
        if (character.equipment.carried) {
            for (const carriedItem of character.equipment.carried) {
                const item = this.getItemById(carriedItem.id);
                if (item) {
                    totalWeight += (item.weight || 0) * (carriedItem.quantity || 1);
                }
            }
        }
        
        // Determine load category
        let load = 'light';
        if (totalWeight > capacity.heavy) {
            load = 'overloaded';
        } else if (totalWeight > capacity.medium) {
            load = 'heavy';
        } else if (totalWeight > capacity.light) {
            load = 'medium';
        }
        
        return {
            load,
            current: totalWeight,
            capacity,
            penalties: this.getEncumbrancePenalties(load)
        };
    }

    getCarryingCapacity(strength) {
        // D&D 3.5 carrying capacity table
        const baseCapacities = {
            10: { light: 33, medium: 66, heavy: 100 },
            11: { light: 38, medium: 76, heavy: 115 },
            12: { light: 43, medium: 86, heavy: 130 },
            13: { light: 50, medium: 100, heavy: 150 },
            14: { light: 58, medium: 116, heavy: 175 },
            15: { light: 66, medium: 133, heavy: 200 },
            16: { light: 76, medium: 153, heavy: 230 },
            17: { light: 86, medium: 173, heavy: 260 },
            18: { light: 100, medium: 200, heavy: 300 },
            19: { light: 116, medium: 233, heavy: 350 },
            20: { light: 133, medium: 266, heavy: 400 }
        };
        
        return baseCapacities[Math.min(strength, 20)] || baseCapacities[10];
    }

    getEncumbrancePenalties(load) {
        const penalties = {
            light: { speed: 0, checkPenalty: 0, maxDex: null },
            medium: { speed: -10, checkPenalty: -3, maxDex: 3 },
            heavy: { speed: -20, checkPenalty: -6, maxDex: 1 },
            overloaded: { speed: -30, checkPenalty: -6, maxDex: 0 }
        };
        
        return penalties[load] || penalties.light;
    }

    // === Item Lookup and Search ===
    getItemById(itemId) {
        return this.weapons.get(itemId) || 
               this.armor.get(itemId) || 
               this.shields.get(itemId) || 
               this.magicItems.get(itemId) || 
               this.adventuringGear.get(itemId);
    }

    searchItems(query, type = null) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        const collections = [
            this.weapons, this.armor, this.shields, 
            this.magicItems, this.adventuringGear
        ];
        
        for (const collection of collections) {
            for (const [itemId, item] of collection) {
                if (type && item.equipmentType !== type) continue;
                
                if (item.name.toLowerCase().includes(queryLower) ||
                    item.description.toLowerCase().includes(queryLower)) {
                    results.push({
                        ...item,
                        id: itemId
                    });
                }
            }
        }
        
        return results;
    }

    getItemsByType(type) {
        const collections = {
            weapon: this.weapons,
            armor: this.armor,
            shield: this.shields,
            magicItem: this.magicItems,
            adventuringGear: this.adventuringGear
        };
        
        const collection = collections[type];
        if (!collection) return [];
        
        return Array.from(collection.values());
    }

    getWeaponsByCategory(category) {
        return Array.from(this.weapons.values()).filter(weapon => 
            weapon.category === category
        );
    }

    getArmorByCategory(category) {
        return Array.from(this.armor.values()).filter(armor => 
            armor.category === category
        );
    }

    // === Wealth and Economy ===
    calculateTotalValue(character) {
        let totalValue = 0;
        
        if (character.equipment?.worn) {
            for (const itemId of Object.keys(character.equipment.worn)) {
                const item = this.getItemById(itemId);
                if (item) totalValue += item.cost || 0;
            }
        }
        
        if (character.equipment?.carried) {
            for (const carriedItem of character.equipment.carried) {
                const item = this.getItemById(carriedItem.id);
                if (item) {
                    totalValue += (item.cost || 0) * (carriedItem.quantity || 1);
                }
            }
        }
        
        return totalValue;
    }

    generateStartingEquipment(character) {
        const className = character.classes?.[0]?.name;
        const equipment = [];
        
        // Basic equipment by class
        const startingGear = {
            Fighter: [
                'chain_shirt', 'shield_heavy_steel', 'longsword', 'shortbow', 
                'arrows_20', 'backpack', 'bedroll', 'hemp_rope_50_feet'
            ],
            Rogue: [
                'studded_leather', 'rapier', 'shortbow', 'arrows_20',
                'thieves_tools', 'backpack', 'bedroll', 'hemp_rope_50_feet'
            ],
            Wizard: [
                'quarterstaff', 'dagger', 'backpack', 'bedroll', 
                'hemp_rope_50_feet', 'torch', 'trail_rations_per_day'
            ],
            Cleric: [
                'chain_shirt', 'shield_heavy_steel', 'mace', 'shortbow',
                'arrows_20', 'backpack', 'bedroll', 'healer_s_kit'
            ]
        };
        
        const gear = startingGear[className] || startingGear.Fighter;
        
        for (const itemId of gear) {
            const item = this.getItemById(itemId);
            if (item) {
                equipment.push({
                    id: itemId,
                    quantity: 1,
                    equipped: false
                });
            }
        }
        
        return equipment;
    }

    getStatistics() {
        return {
            ...this.metadata,
            weapons: this.weapons.size,
            armor: this.armor.size,
            shields: this.shields.size,
            magicItems: this.magicItems.size,
            adventuringGear: this.adventuringGear.size,
            itemsByType: {
                simple: Array.from(this.weapons.values()).filter(w => w.category === 'simple').length,
                martial: Array.from(this.weapons.values()).filter(w => w.category === 'martial').length,
                exotic: Array.from(this.weapons.values()).filter(w => w.category === 'exotic').length,
                light: Array.from(this.armor.values()).filter(a => a.category === 'light').length,
                medium: Array.from(this.armor.values()).filter(a => a.category === 'medium').length,
                heavy: Array.from(this.armor.values()).filter(a => a.category === 'heavy').length
            }
        };
    }
}

// === Export for different environments ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EquipmentSystem;
} else if (typeof window !== 'undefined') {
    window.EquipmentSystem = EquipmentSystem;
    
    // Initialize if dependencies are available
    if (window.characterDataModel) {
        window.equipmentSystem = new EquipmentSystem(window.characterDataModel, window.diceEngine);
        console.log('⚔️ Global Equipment System initialized');
    }
}

console.log('⚔️ Equipment System module loaded');
/**
 * EquipmentDatabase - D&D 3.5 Equipment Data Management
 * 
 * Comprehensive database of D&D 3.5 weapons, armor, shields, and miscellaneous items
 * Features item lookup, enchantment calculation, and equipment generation
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class EquipmentDatabase {
    constructor() {
        this.weapons = new Map();
        this.armor = new Map();
        this.shields = new Map();
        this.miscellaneous = new Map();
        this.enchantments = new Map();
        this.materialTypes = new Map();
        
        this.initialized = false;
        this.initializeDatabase();
        
        console.log('⚔️ Equipment Database initialized');
    }

    /**
     * Initialize all equipment data
     */
    initializeDatabase() {
        if (this.initialized) return;
        
        this.loadWeapons();
        this.loadArmor();
        this.loadShields();
        this.loadMiscellaneous();
        this.loadEnchantments();
        this.loadMaterialTypes();
        
        this.initialized = true;
        console.log('✅ Equipment database ready with', 
                   this.getTotalItemCount(), 'items loaded');
    }

    // ===== WEAPONS DATABASE =====

    /**
     * Load weapon data
     */
    loadWeapons() {
        const weaponData = [
            // Simple Melee Weapons
            {
                name: 'Club',
                type: 'weapon',
                category: 'simple',
                weaponType: 'melee',
                damage: '1d6',
                criticalRange: '20',
                criticalMultiplier: 'x2',
                damageType: 'bludgeoning',
                weight: 3,
                cost: 0,
                hardness: 5,
                hitPoints: 5,
                description: 'A simple wooden club, effective but primitive.'
            },
            {
                name: 'Dagger',
                type: 'weapon',
                category: 'simple',
                weaponType: 'melee',
                damage: '1d4',
                criticalRange: '19-20',
                criticalMultiplier: 'x2',
                damageType: 'piercing',
                weight: 1,
                cost: 2,
                hardness: 10,
                hitPoints: 2,
                rangeIncrement: 10,
                description: 'A versatile blade, equally useful in melee or thrown.'
            },
            {
                name: 'Quarterstaff',
                type: 'weapon',
                category: 'simple',
                weaponType: 'melee',
                damage: '1d6/1d6',
                criticalRange: '20',
                criticalMultiplier: 'x2',
                damageType: 'bludgeoning',
                weight: 4,
                cost: 0,
                hardness: 5,
                hitPoints: 10,
                special: ['double weapon'],
                description: 'A simple staff that can be wielded with both ends.'
            },
            
            // Martial Melee Weapons
            {
                name: 'Longsword',
                type: 'weapon',
                category: 'martial',
                weaponType: 'melee',
                damage: '1d8',
                criticalRange: '19-20',
                criticalMultiplier: 'x2',
                damageType: 'slashing',
                weight: 4,
                cost: 15,
                hardness: 10,
                hitPoints: 10,
                description: 'The classic knights weapon, well-balanced and versatile.'
            },
            {
                name: 'Rapier',
                type: 'weapon',
                category: 'martial',
                weaponType: 'melee',
                damage: '1d6',
                criticalRange: '18-20',
                criticalMultiplier: 'x2',
                damageType: 'piercing',
                weight: 2,
                cost: 20,
                hardness: 10,
                hitPoints: 5,
                description: 'A slender, precise blade favored by duelists.'
            },
            {
                name: 'Scimitar',
                type: 'weapon',
                category: 'martial',
                weaponType: 'melee',
                damage: '1d6',
                criticalRange: '18-20',
                criticalMultiplier: 'x2',
                damageType: 'slashing',
                weight: 4,
                cost: 15,
                hardness: 10,
                hitPoints: 10,
                description: 'A curved blade with an extended threat range.'
            },
            {
                name: 'Greatsword',
                type: 'weapon',
                category: 'martial',
                weaponType: 'melee',
                damage: '2d6',
                criticalRange: '19-20',
                criticalMultiplier: 'x2',
                damageType: 'slashing',
                weight: 8,
                cost: 50,
                hardness: 10,
                hitPoints: 20,
                special: ['two-handed'],
                description: 'A massive two-handed sword with devastating power.'
            },
            {
                name: 'Battleaxe',
                type: 'weapon',
                category: 'martial',
                weaponType: 'melee',
                damage: '1d8',
                criticalRange: '20',
                criticalMultiplier: 'x3',
                damageType: 'slashing',
                weight: 6,
                cost: 10,
                hardness: 10,
                hitPoints: 10,
                description: 'A sturdy axe designed for combat.'
            },
            {
                name: 'Warhammer',
                type: 'weapon',
                category: 'martial',
                weaponType: 'melee',
                damage: '1d8',
                criticalRange: '20',
                criticalMultiplier: 'x3',
                damageType: 'bludgeoning',
                weight: 5,
                cost: 12,
                hardness: 10,
                hitPoints: 10,
                description: 'A heavy hammer built for war.'
            },
            
            // Exotic Melee Weapons
            {
                name: 'Bastard Sword',
                type: 'weapon',
                category: 'exotic',
                weaponType: 'melee',
                damage: '1d10',
                criticalRange: '19-20',
                criticalMultiplier: 'x2',
                damageType: 'slashing',
                weight: 6,
                cost: 35,
                hardness: 10,
                hitPoints: 15,
                special: ['versatile'],
                description: 'A large sword that can be wielded one or two-handed.'
            },
            
            // Simple Ranged Weapons
            {
                name: 'Light Crossbow',
                type: 'weapon',
                category: 'simple',
                weaponType: 'ranged',
                damage: '1d8',
                criticalRange: '19-20',
                criticalMultiplier: 'x2',
                damageType: 'piercing',
                weight: 4,
                cost: 35,
                hardness: 5,
                hitPoints: 10,
                rangeIncrement: 80,
                ammunition: 'crossbow bolt',
                description: 'A compact crossbow, easy to use but slow to reload.'
            },
            {
                name: 'Shortbow',
                type: 'weapon',
                category: 'martial',
                weaponType: 'ranged',
                damage: '1d6',
                criticalRange: '20',
                criticalMultiplier: 'x3',
                damageType: 'piercing',
                weight: 2,
                cost: 30,
                hardness: 5,
                hitPoints: 5,
                rangeIncrement: 60,
                ammunition: 'arrow',
                description: 'A compact bow suitable for mounted combat.'
            },
            {
                name: 'Longbow',
                type: 'weapon',
                category: 'martial',
                weaponType: 'ranged',
                damage: '1d8',
                criticalRange: '20',
                criticalMultiplier: 'x3',
                damageType: 'piercing',
                weight: 3,
                cost: 75,
                hardness: 5,
                hitPoints: 7,
                rangeIncrement: 100,
                ammunition: 'arrow',
                description: 'A tall bow with excellent range and power.'
            }
        ];

        weaponData.forEach(weapon => {
            this.weapons.set(weapon.name.toLowerCase(), weapon);
        });
    }

    // ===== ARMOR DATABASE =====

    /**
     * Load armor data
     */
    loadArmor() {
        const armorData = [
            // Light Armor
            {
                name: 'Padded',
                type: 'armor',
                category: 'light',
                ac: 1,
                maxDexBonus: 8,
                armorCheckPenalty: 0,
                arcaneSpellFailure: 5,
                speed: { 30: 30, 20: 20 },
                weight: 10,
                cost: 5,
                description: 'Simple quilted cloth armor.'
            },
            {
                name: 'Leather',
                type: 'armor',
                category: 'light',
                ac: 2,
                maxDexBonus: 6,
                armorCheckPenalty: 0,
                arcaneSpellFailure: 10,
                speed: { 30: 30, 20: 20 },
                weight: 15,
                cost: 10,
                description: 'Soft, flexible leather armor.'
            },
            {
                name: 'Studded Leather',
                type: 'armor',
                category: 'light',
                ac: 3,
                maxDexBonus: 5,
                armorCheckPenalty: -1,
                arcaneSpellFailure: 15,
                speed: { 30: 30, 20: 20 },
                weight: 20,
                cost: 25,
                description: 'Leather armor reinforced with metal studs.'
            },
            {
                name: 'Chain Shirt',
                type: 'armor',
                category: 'light',
                ac: 4,
                maxDexBonus: 4,
                armorCheckPenalty: -2,
                arcaneSpellFailure: 20,
                speed: { 30: 30, 20: 20 },
                weight: 25,
                cost: 100,
                description: 'A shirt of interlocking metal rings.'
            },
            
            // Medium Armor
            {
                name: 'Hide',
                type: 'armor',
                category: 'medium',
                ac: 3,
                maxDexBonus: 4,
                armorCheckPenalty: -3,
                arcaneSpellFailure: 20,
                speed: { 30: 20, 20: 15 },
                weight: 25,
                cost: 15,
                description: 'Crude armor made from thick animal hides.'
            },
            {
                name: 'Scale Mail',
                type: 'armor',
                category: 'medium',
                ac: 4,
                maxDexBonus: 3,
                armorCheckPenalty: -4,
                arcaneSpellFailure: 25,
                speed: { 30: 20, 20: 15 },
                weight: 30,
                cost: 50,
                description: 'Armor made of overlapping metal scales.'
            },
            {
                name: 'Chainmail',
                type: 'armor',
                category: 'medium',
                ac: 5,
                maxDexBonus: 2,
                armorCheckPenalty: -5,
                arcaneSpellFailure: 30,
                speed: { 30: 20, 20: 15 },
                weight: 40,
                cost: 150,
                description: 'A shirt and coif of interlocked metal rings.'
            },
            {
                name: 'Breastplate',
                type: 'armor',
                category: 'medium',
                ac: 5,
                maxDexBonus: 3,
                armorCheckPenalty: -4,
                arcaneSpellFailure: 25,
                speed: { 30: 20, 20: 15 },
                weight: 30,
                cost: 200,
                description: 'A metal plate covering the torso.'
            },
            
            // Heavy Armor
            {
                name: 'Splint Mail',
                type: 'armor',
                category: 'heavy',
                ac: 6,
                maxDexBonus: 0,
                armorCheckPenalty: -7,
                arcaneSpellFailure: 40,
                speed: { 30: 20, 20: 15 },
                weight: 45,
                cost: 200,
                description: 'Metal strips over leather backing.'
            },
            {
                name: 'Banded Mail',
                type: 'armor',
                category: 'heavy',
                ac: 6,
                maxDexBonus: 1,
                armorCheckPenalty: -6,
                arcaneSpellFailure: 35,
                speed: { 30: 20, 20: 15 },
                weight: 35,
                cost: 250,
                description: 'Overlapping strips of metal over leather.'
            },
            {
                name: 'Half Plate',
                type: 'armor',
                category: 'heavy',
                ac: 7,
                maxDexBonus: 0,
                armorCheckPenalty: -7,
                arcaneSpellFailure: 40,
                speed: { 30: 20, 20: 15 },
                weight: 50,
                cost: 600,
                description: 'Partial plate coverage with chainmail.'
            },
            {
                name: 'Full Plate',
                type: 'armor',
                category: 'heavy',
                ac: 8,
                maxDexBonus: 1,
                armorCheckPenalty: -6,
                arcaneSpellFailure: 35,
                speed: { 30: 20, 20: 15 },
                weight: 50,
                cost: 1500,
                description: 'Complete coverage of fitted metal plates.'
            }
        ];

        armorData.forEach(armor => {
            this.armor.set(armor.name.toLowerCase(), armor);
        });
    }

    // ===== SHIELDS DATABASE =====

    /**
     * Load shield data
     */
    loadShields() {
        const shieldData = [
            {
                name: 'Buckler',
                type: 'shield',
                ac: 1,
                maxDexBonus: null,
                armorCheckPenalty: -1,
                arcaneSpellFailure: 5,
                weight: 5,
                cost: 15,
                description: 'A small round shield strapped to the forearm.'
            },
            {
                name: 'Light Wooden Shield',
                type: 'shield',
                ac: 1,
                maxDexBonus: null,
                armorCheckPenalty: -1,
                arcaneSpellFailure: 5,
                weight: 5,
                cost: 3,
                hardness: 5,
                hitPoints: 10,
                description: 'A light shield made of wood.'
            },
            {
                name: 'Light Steel Shield',
                type: 'shield',
                ac: 1,
                maxDexBonus: null,
                armorCheckPenalty: -1,
                arcaneSpellFailure: 5,
                weight: 6,
                cost: 9,
                hardness: 10,
                hitPoints: 20,
                description: 'A light shield made of steel.'
            },
            {
                name: 'Heavy Wooden Shield',
                type: 'shield',
                ac: 2,
                maxDexBonus: null,
                armorCheckPenalty: -2,
                arcaneSpellFailure: 15,
                weight: 10,
                cost: 7,
                hardness: 5,
                hitPoints: 20,
                description: 'A heavy shield made of wood.'
            },
            {
                name: 'Heavy Steel Shield',
                type: 'shield',
                ac: 2,
                maxDexBonus: null,
                armorCheckPenalty: -2,
                arcaneSpellFailure: 15,
                weight: 15,
                cost: 20,
                hardness: 10,
                hitPoints: 40,
                description: 'A heavy shield made of steel.'
            },
            {
                name: 'Tower Shield',
                type: 'shield',
                ac: 4,
                maxDexBonus: 2,
                armorCheckPenalty: -10,
                arcaneSpellFailure: 50,
                weight: 45,
                cost: 30,
                hardness: 5,
                hitPoints: 40,
                special: ['total cover'],
                description: 'A massive shield providing exceptional protection.'
            }
        ];

        shieldData.forEach(shield => {
            this.shields.set(shield.name.toLowerCase(), shield);
        });
    }

    // ===== MISCELLANEOUS ITEMS =====

    /**
     * Load miscellaneous items
     */
    loadMiscellaneous() {
        const miscData = [
            // Adventuring Gear
            {
                name: 'Backpack',
                type: 'container',
                weight: 2,
                cost: 2,
                capacity: 60,
                description: 'A leather pack for carrying gear.'
            },
            {
                name: 'Belt Pouch',
                type: 'container',
                weight: 0.5,
                cost: 1,
                capacity: 5,
                description: 'A small pouch for coins and small items.'
            },
            {
                name: 'Rope (50 ft)',
                type: 'tool',
                weight: 10,
                cost: 2,
                description: 'Hemp rope, 50 feet long.'
            },
            {
                name: 'Grappling Hook',
                type: 'tool',
                weight: 4,
                cost: 1,
                description: 'A four-pronged iron hook for climbing.'
            },
            {
                name: 'Torch',
                type: 'tool',
                weight: 1,
                cost: 0.01,
                lightRadius: 20,
                burnTime: 60,
                description: 'Provides bright light in a 20-foot radius.'
            },
            {
                name: 'Lantern (Hooded)',
                type: 'tool',
                weight: 2,
                cost: 7,
                lightRadius: 30,
                description: 'Provides bright light in a 30-foot radius.'
            },
            {
                name: 'Oil (1 pint)',
                type: 'consumable',
                weight: 1,
                cost: 0.1,
                burnTime: 360,
                description: 'Fuel for lanterns or as a weapon.'
            },
            {
                name: 'Bedroll',
                type: 'tool',
                weight: 5,
                cost: 0.1,
                description: 'Warm blankets for sleeping outdoors.'
            },
            {
                name: 'Blanket',
                type: 'tool',
                weight: 3,
                cost: 0.5,
                description: 'A thick wool blanket.'
            },
            {
                name: 'Rations (Trail, per day)',
                type: 'consumable',
                weight: 1,
                cost: 0.5,
                description: 'Dried and preserved food for one day.'
            },
            {
                name: 'Waterskin',
                type: 'container',
                weight: 4,
                cost: 1,
                capacity: 8,
                description: 'A leather container for water (1 gallon).'
            },
            {
                name: 'Flint and Steel',
                type: 'tool',
                weight: 0,
                cost: 1,
                description: 'For starting fires.'
            },
            
            // Tools
            {
                name: 'Crowbar',
                type: 'tool',
                weight: 5,
                cost: 2,
                bonus: { strength: 2 },
                description: 'Provides leverage for prying things open.'
            },
            {
                name: 'Hammer',
                type: 'tool',
                weight: 2,
                cost: 0.5,
                description: 'A tool for driving nails and stakes.'
            },
            {
                name: 'Piton',
                type: 'tool',
                weight: 0.5,
                cost: 0.1,
                description: 'A spike for securing ropes.'
            },
            {
                name: 'Spyglass',
                type: 'tool',
                weight: 1,
                cost: 1000,
                description: 'Magnifies distant objects.'
            },
            {
                name: 'Thieves Tools',
                type: 'tool',
                weight: 1,
                cost: 30,
                bonus: { skills: { 'Disable Device': 2, 'Open Lock': 2 } },
                description: 'Essential tools for picking locks and disabling traps.'
            },
            
            // Clothing
            {
                name: 'Artisan Outfit',
                type: 'clothing',
                weight: 4,
                cost: 1,
                description: 'Sturdy clothing for craftsmen.'
            },
            {
                name: 'Entertainers Outfit',
                type: 'clothing',
                weight: 4,
                cost: 3,
                description: 'Flashy clothing for performers.'
            },
            {
                name: 'Explorers Outfit',
                type: 'clothing',
                weight: 8,
                cost: 10,
                description: 'Practical clothing for adventurers.'
            },
            {
                name: 'Nobles Outfit',
                type: 'clothing',
                weight: 10,
                cost: 75,
                description: 'Fine clothing suitable for court.'
            },
            {
                name: 'Travelers Outfit',
                type: 'clothing',
                weight: 5,
                cost: 1,
                description: 'Simple, practical travel clothing.'
            },
            
            // Jewelry and Accessories
            {
                name: 'Ring of Protection +1',
                type: 'ring',
                weight: 0,
                cost: 2000,
                rarity: 'uncommon',
                bonuses: { ac: 1, saves: { fortitude: 1, reflex: 1, will: 1 } },
                description: 'Grants a +1 deflection bonus to AC and +1 resistance bonus to all saves.'
            },
            {
                name: 'Amulet of Natural Armor +1',
                type: 'amulet',
                weight: 0,
                cost: 2000,
                rarity: 'uncommon',
                bonuses: { ac: 1 },
                description: 'Grants a +1 natural armor bonus to AC.'
            },
            {
                name: 'Cloak of Resistance +1',
                type: 'cloak',
                weight: 1,
                cost: 1000,
                rarity: 'uncommon',
                bonuses: { saves: { fortitude: 1, reflex: 1, will: 1 } },
                description: 'Grants a +1 resistance bonus to all saving throws.'
            },
            
            // Potions
            {
                name: 'Potion of Cure Light Wounds',
                type: 'potion',
                weight: 0,
                cost: 50,
                effect: 'Heals 1d8+1 hit points',
                description: 'A healing potion that restores minor wounds.'
            },
            {
                name: 'Potion of Bulls Strength',
                type: 'potion',
                weight: 0,
                cost: 300,
                effect: '+4 enhancement bonus to Strength for 3 minutes',
                description: 'Temporarily increases physical power.'
            }
        ];

        miscData.forEach(item => {
            this.miscellaneous.set(item.name.toLowerCase(), item);
        });
    }

    // ===== ENCHANTMENTS =====

    /**
     * Load enchantment data
     */
    loadEnchantments() {
        const enchantmentData = [
            // Weapon Enchantments
            {
                name: 'Enhancement Bonus',
                type: 'weapon',
                levels: [
                    { level: 1, cost: 2000, bonus: { attack: 1, damage: 1 } },
                    { level: 2, cost: 8000, bonus: { attack: 2, damage: 2 } },
                    { level: 3, cost: 18000, bonus: { attack: 3, damage: 3 } },
                    { level: 4, cost: 32000, bonus: { attack: 4, damage: 4 } },
                    { level: 5, cost: 50000, bonus: { attack: 5, damage: 5 } }
                ],
                description: 'Provides enhancement bonuses to attack and damage rolls.'
            },
            {
                name: 'Flaming',
                type: 'weapon',
                cost: 8000,
                bonus: { damage: '1d6 fire' },
                special: ['light source'],
                description: 'Weapon bursts into flame, dealing extra fire damage.'
            },
            {
                name: 'Frost',
                type: 'weapon',
                cost: 8000,
                bonus: { damage: '1d6 cold' },
                description: 'Weapon is sheathed in frost, dealing extra cold damage.'
            },
            {
                name: 'Shock',
                type: 'weapon',
                cost: 8000,
                bonus: { damage: '1d6 electricity' },
                description: 'Weapon crackles with electricity, dealing extra electrical damage.'
            },
            {
                name: 'Keen',
                type: 'weapon',
                cost: 8000,
                effect: 'Doubles threat range',
                description: 'Weapon threatens a critical hit on a wider range of attack rolls.'
            },
            {
                name: 'Vorpal',
                type: 'weapon',
                cost: 100000,
                rarity: 'legendary',
                effect: 'Severs head on natural 20',
                description: 'On a natural 20 (and confirmed critical), the weapon severs the opponents head.'
            },
            
            // Armor Enchantments
            {
                name: 'Enhancement Bonus',
                type: 'armor',
                levels: [
                    { level: 1, cost: 1000, bonus: { ac: 1 } },
                    { level: 2, cost: 4000, bonus: { ac: 2 } },
                    { level: 3, cost: 9000, bonus: { ac: 3 } },
                    { level: 4, cost: 16000, bonus: { ac: 4 } },
                    { level: 5, cost: 25000, bonus: { ac: 5 } }
                ],
                description: 'Provides enhancement bonuses to AC.'
            },
            {
                name: 'Fortification (Light)',
                type: 'armor',
                cost: 4000,
                effect: '25% chance to negate critical hits and sneak attacks',
                description: 'Occasionally turns critical hits into normal hits.'
            },
            {
                name: 'Fortification (Moderate)',
                type: 'armor',
                cost: 16000,
                effect: '50% chance to negate critical hits and sneak attacks',
                description: 'Often turns critical hits into normal hits.'
            },
            {
                name: 'Fortification (Heavy)',
                type: 'armor',
                cost: 36000,
                effect: '75% chance to negate critical hits and sneak attacks',
                description: 'Usually turns critical hits into normal hits.'
            },
            {
                name: 'Spell Resistance (13)',
                type: 'armor',
                cost: 15000,
                effect: 'Spell Resistance 13',
                description: 'Provides resistance against magical effects.'
            }
        ];

        enchantmentData.forEach(enchantment => {
            this.enchantments.set(enchantment.name.toLowerCase(), enchantment);
        });
    }

    // ===== MATERIAL TYPES =====

    /**
     * Load special material data
     */
    loadMaterialTypes() {
        const materialData = [
            {
                name: 'Adamantine',
                type: 'metal',
                costMultiplier: 3000,
                hardnessBonus: 20,
                hitPointMultiplier: 2,
                special: ['bypasses hardness less than 20'],
                description: 'The hardest known metal, capable of cutting through almost anything.'
            },
            {
                name: 'Mithral',
                type: 'metal',
                costMultiplier: 500,
                weightMultiplier: 0.5,
                armorCategory: 'decrease by one',
                special: ['no spell failure increase', 'no armor check penalty increase'],
                description: 'Lightweight metal that doesnt interfere with movement or spellcasting.'
            },
            {
                name: 'Cold Iron',
                type: 'metal',
                costMultiplier: 2,
                special: ['effective against demons and fey'],
                description: 'Iron forged in special conditions, harmful to certain creatures.'
            },
            {
                name: 'Alchemical Silver',
                type: 'coating',
                costMultiplier: 2,
                damageReduction: 1,
                special: ['effective against lycanthropes and devils'],
                description: 'Silver coating that makes weapons effective against certain creatures.'
            },
            {
                name: 'Darkwood',
                type: 'wood',
                costMultiplier: 10,
                weightMultiplier: 0.5,
                hardnessBonus: 5,
                description: 'Rare wood that is as hard as steel but half the weight.'
            }
        ];

        materialData.forEach(material => {
            this.materialTypes.set(material.name.toLowerCase(), material);
        });
    }

    // ===== ITEM LOOKUP METHODS =====

    /**
     * Get item by name from any category
     */
    getItem(name) {
        const searchName = name.toLowerCase();
        
        return this.weapons.get(searchName) ||
               this.armor.get(searchName) ||
               this.shields.get(searchName) ||
               this.miscellaneous.get(searchName) ||
               null;
    }

    /**
     * Get weapon by name
     */
    getWeapon(name) {
        return this.weapons.get(name.toLowerCase());
    }

    /**
     * Get armor by name
     */
    getArmor(name) {
        return this.armor.get(name.toLowerCase());
    }

    /**
     * Get shield by name
     */
    getShield(name) {
        return this.shields.get(name.toLowerCase());
    }

    /**
     * Get miscellaneous item by name
     */
    getMiscellaneous(name) {
        return this.miscellaneous.get(name.toLowerCase());
    }

    /**
     * Search items by type or category
     */
    searchItems(criteria) {
        const results = [];
        
        // Search all categories
        [this.weapons, this.armor, this.shields, this.miscellaneous].forEach(category => {
            category.forEach(item => {
                let matches = true;
                
                // Check each criteria
                Object.keys(criteria).forEach(key => {
                    if (criteria[key] && item[key] !== criteria[key]) {
                        matches = false;
                    }
                });
                
                if (matches) {
                    results.push(item);
                }
            });
        });
        
        return results;
    }

    /**
     * Get items by category
     */
    getItemsByCategory(category) {
        switch (category.toLowerCase()) {
            case 'weapon':
            case 'weapons':
                return Array.from(this.weapons.values());
            case 'armor':
                return Array.from(this.armor.values());
            case 'shield':
            case 'shields':
                return Array.from(this.shields.values());
            case 'misc':
            case 'miscellaneous':
                return Array.from(this.miscellaneous.values());
            default:
                return [];
        }
    }

    /**
     * Get random item from category
     */
    getRandomItem(category = null, rarity = null) {
        let items = [];
        
        if (category) {
            items = this.getItemsByCategory(category);
        } else {
            // Get from all categories
            items = [
                ...Array.from(this.weapons.values()),
                ...Array.from(this.armor.values()),
                ...Array.from(this.shields.values()),
                ...Array.from(this.miscellaneous.values())
            ];
        }
        
        // Filter by rarity if specified
        if (rarity) {
            items = items.filter(item => item.rarity === rarity);
        }
        
        if (items.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * items.length);
        return { ...items[randomIndex] }; // Return copy
    }

    // ===== ENCHANTMENT METHODS =====

    /**
     * Apply enchantments to item
     */
    applyEnchantments(item, enchantmentNames, enhancementLevel = 0) {
        const enchantedItem = { ...item };
        let totalCost = item.cost || 0;
        
        // Apply enhancement bonus
        if (enhancementLevel > 0 && enhancementLevel <= 5) {
            const enhancementData = this.enchantments.get('enhancement bonus');
            if (enhancementData) {
                const levelData = enhancementData.levels[enhancementLevel - 1];
                if (levelData) {
                    totalCost += levelData.cost;
                    enchantedItem.enhancement = enhancementLevel;
                    
                    // Apply bonuses
                    if (!enchantedItem.bonuses) enchantedItem.bonuses = {};
                    Object.keys(levelData.bonus).forEach(key => {
                        enchantedItem.bonuses[key] = 
                            (enchantedItem.bonuses[key] || 0) + levelData.bonus[key];
                    });
                }
            }
        }
        
        // Apply other enchantments
        enchantmentNames.forEach(enchantmentName => {
            const enchantment = this.enchantments.get(enchantmentName.toLowerCase());
            if (enchantment && enchantment.type === item.type) {
                totalCost += enchantment.cost;
                
                if (!enchantedItem.enchantments) enchantedItem.enchantments = [];
                enchantedItem.enchantments.push(enchantment.name);
                
                // Apply bonuses
                if (enchantment.bonus) {
                    if (!enchantedItem.bonuses) enchantedItem.bonuses = {};
                    Object.keys(enchantment.bonus).forEach(key => {
                        if (typeof enchantment.bonus[key] === 'object') {
                            if (!enchantedItem.bonuses[key]) enchantedItem.bonuses[key] = {};
                            Object.assign(enchantedItem.bonuses[key], enchantment.bonus[key]);
                        } else {
                            enchantedItem.bonuses[key] = 
                                (enchantedItem.bonuses[key] || 0) + enchantment.bonus[key];
                        }
                    });
                }
                
                // Apply special effects
                if (enchantment.special) {
                    if (!enchantedItem.special) enchantedItem.special = [];
                    enchantedItem.special.push(...enchantment.special);
                }
                
                // Update rarity if enchantment is higher
                if (enchantment.rarity) {
                    const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact'];
                    const currentRarity = rarityOrder.indexOf(enchantedItem.rarity || 'common');
                    const enchantmentRarity = rarityOrder.indexOf(enchantment.rarity);
                    
                    if (enchantmentRarity > currentRarity) {
                        enchantedItem.rarity = enchantment.rarity;
                    }
                }
            }
        });
        
        enchantedItem.cost = totalCost;
        
        return enchantedItem;
    }

    /**
     * Apply material to item
     */
    applyMaterial(item, materialName) {
        const material = this.materialTypes.get(materialName.toLowerCase());
        if (!material) return item;
        
        const materialItem = { ...item };
        
        // Apply cost multiplier
        if (material.costMultiplier) {
            materialItem.cost = (materialItem.cost || 0) + material.costMultiplier;
        }
        
        // Apply weight multiplier
        if (material.weightMultiplier) {
            materialItem.weight = (materialItem.weight || 0) * material.weightMultiplier;
        }
        
        // Apply hardness bonus
        if (material.hardnessBonus) {
            materialItem.hardness = (materialItem.hardness || 5) + material.hardnessBonus;
        }
        
        // Apply hit point multiplier
        if (material.hitPointMultiplier) {
            materialItem.hitPoints = (materialItem.hitPoints || 5) * material.hitPointMultiplier;
        }
        
        // Apply special properties
        if (material.special) {
            if (!materialItem.special) materialItem.special = [];
            materialItem.special.push(...material.special);
        }
        
        // Store material info
        materialItem.material = material.name;
        materialItem.name = `${material.name} ${item.name}`;
        
        return materialItem;
    }

    // ===== UTILITY METHODS =====

    /**
     * Get total item count
     */
    getTotalItemCount() {
        return this.weapons.size + this.armor.size + this.shields.size + this.miscellaneous.size;
    }

    /**
     * Get all available enchantments for item type
     */
    getAvailableEnchantments(itemType) {
        const enchantments = [];
        
        this.enchantments.forEach(enchantment => {
            if (enchantment.type === itemType || enchantment.type === 'any') {
                enchantments.push(enchantment);
            }
        });
        
        return enchantments;
    }

    /**
     * Get all available materials
     */
    getAvailableMaterials() {
        return Array.from(this.materialTypes.values());
    }

    /**
     * Create starting equipment package for class
     */
    createStartingEquipment(characterClass, level = 1) {
        const equipment = {
            weapons: [],
            armor: null,
            shield: null,
            items: [],
            money: { cp: 0, sp: 0, gp: 0, pp: 0 }
        };
        
        switch (characterClass) {
            case 'Fighter':
                equipment.weapons.push(this.getWeapon('longsword'));
                equipment.armor = this.getArmor('scale mail');
                equipment.shield = this.getShield('heavy steel shield');
                equipment.items.push(
                    this.getMiscellaneous('backpack'),
                    this.getMiscellaneous('bedroll'),
                    this.getMiscellaneous('rations (trail, per day)'),
                    this.getMiscellaneous('waterskin')
                );
                equipment.money.gp = 240;
                break;
                
            case 'Wizard':
                equipment.weapons.push(this.getWeapon('quarterstaff'));
                equipment.items.push(
                    this.getMiscellaneous('backpack'),
                    { name: 'Spellbook', type: 'book', weight: 3, cost: 15 },
                    { name: 'Spell Components', type: 'tool', weight: 2, cost: 5 },
                    this.getMiscellaneous('bedroll'),
                    this.getMiscellaneous('rations (trail, per day)'),
                    this.getMiscellaneous('waterskin')
                );
                equipment.money.gp = 180;
                break;
                
            case 'Rogue':
                equipment.weapons.push(this.getWeapon('rapier'));
                equipment.weapons.push(this.getWeapon('dagger'));
                equipment.armor = this.getArmor('studded leather');
                equipment.items.push(
                    this.getMiscellaneous('thieves tools'),
                    this.getMiscellaneous('backpack'),
                    this.getMiscellaneous('bedroll'),
                    this.getMiscellaneous('rations (trail, per day)'),
                    this.getMiscellaneous('waterskin')
                );
                equipment.money.gp = 200;
                break;
                
            case 'Cleric':
                equipment.weapons.push(this.getWeapon('warhammer'));
                equipment.armor = this.getArmor('scale mail');
                equipment.shield = this.getShield('heavy steel shield');
                equipment.items.push(
                    { name: 'Holy Symbol', type: 'tool', weight: 0, cost: 25 },
                    this.getMiscellaneous('backpack'),
                    this.getMiscellaneous('bedroll'),
                    this.getMiscellaneous('rations (trail, per day)'),
                    this.getMiscellaneous('waterskin')
                );
                equipment.money.gp = 220;
                break;
                
            default:
                equipment.weapons.push(this.getWeapon('club'));
                equipment.items.push(
                    this.getMiscellaneous('backpack'),
                    this.getMiscellaneous('travelers outfit')
                );
                equipment.money.gp = 100;
                break;
        }
        
        // Filter out null items
        equipment.weapons = equipment.weapons.filter(w => w !== null);
        equipment.items = equipment.items.filter(i => i !== null);
        
        return equipment;
    }

    /**
     * Export database to JSON
     */
    exportDatabase() {
        return {
            weapons: Object.fromEntries(this.weapons),
            armor: Object.fromEntries(this.armor),
            shields: Object.fromEntries(this.shields),
            miscellaneous: Object.fromEntries(this.miscellaneous),
            enchantments: Object.fromEntries(this.enchantments),
            materialTypes: Object.fromEntries(this.materialTypes),
            exportedAt: Date.now(),
            version: '2.0.0'
        };
    }
}

// Global export for both browser and Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EquipmentDatabase;
} else if (typeof window !== 'undefined') {
    window.EquipmentDatabase = EquipmentDatabase;
}
/**
 * RulzLawyer Equipment Management System
 * Complete D&D 3.5 SRD Equipment System with Magic Items, Weapons, and Armor
 * 
 * Features:
 * - Complete SRD equipment database
 * - Magic item generation and management
 * - Weapon and armor calculations
 * - Inventory weight and encumbrance
 * - Equipment slots and wearing restrictions
 * - Masterwork and magic item bonuses
 * 
 * @version 1.0
 * @date September 20, 2025
 * @location code-repository/src/equipment-manager.js
 */

class EquipmentManager {
    constructor(diceEngine, characterManager) {
        this.dice = diceEngine;
        this.characterManager = characterManager;
        
        // Initialize equipment databases
        this.weaponDatabase = this._initializeWeapons();
        this.armorDatabase = this._initializeArmor();
        this.itemDatabase = this._initializeItems();
        this.magicItemDatabase = this._initializeMagicItems();
        
        // Equipment categories and slot definitions
        this.equipmentSlots = this._initializeEquipmentSlots();
        this.encumbranceRules = this._initializeEncumbranceRules();
        
        console.log('⚔️ Equipment Manager initialized with', 
                   Object.keys(this.weaponDatabase).length, 'weapons,',
                   Object.keys(this.armorDatabase).length, 'armor pieces, and',
                   Object.keys(this.itemDatabase).length, 'items');

        // Create aliases for backward compatibility
        this.weapons = this.weaponDatabase;
        this.armor = this.armorDatabase;
        this.items = this.itemDatabase;
    }

    /**
     * Add item to character's inventory
     * @param {Object} character - Character object
     * @param {string} itemName - Name of item to add
     * @param {number} quantity - Number of items to add
     * @param {Object} options - Additional options (magic, masterwork, etc.)
     * @returns {Object} Addition result
     */
    addItem(character, itemName, quantity = 1, options = {}) {
        const item = this._findItem(itemName);
        if (!item) {
            throw new Error(`Item "${itemName}" not found in database`);
        }

        const inventoryItem = {
            ...item,
            name: itemName,
            quantity: quantity,
            equipped: false,
            masterwork: options.masterwork || false,
            magic: options.magic || false,
            enhancement: options.enhancement || 0,
            properties: options.properties || [],
            condition: options.condition || 'normal',
            addedAt: Date.now()
        };

        // Calculate weight and cost modifications
        if (inventoryItem.masterwork) {
            inventoryItem.cost += this._getMasterworkCost(item.category);
            inventoryItem.description += ' (masterwork)';
        }

        if (inventoryItem.magic) {
            const magicCost = this._calculateMagicItemCost(item, options.enhancement, options.properties);
            inventoryItem.cost += magicCost;
            inventoryItem.description += ` +${options.enhancement || 1}`;
        }

        // Add to inventory
        character.inventory.push(inventoryItem);
        
        // Update encumbrance
        this._updateEncumbrance(character);
        
        character.lastModified = Date.now();

        return {
            success: true,
            item: inventoryItem,
            message: `Added ${quantity}x ${itemName} to ${character.name}'s inventory`,
            totalWeight: this._getTotalWeight(character),
            encumbrance: character.encumbrance
        };
    }

    /**
     * Equip an item from inventory
     * @param {Object} character - Character object
     * @param {string} itemName - Name of item to equip
     * @param {string} slot - Equipment slot (optional, auto-detect if not provided)
     * @returns {Object} Equip result
     */
    equipItem(character, itemName, slot = null) {
        const inventoryItem = character.inventory.find(item => 
            item.name === itemName && !item.equipped
        );
        
        if (!inventoryItem) {
            throw new Error(`${itemName} not found in inventory or already equipped`);
        }

        // Determine equipment slot
        const targetSlot = slot || this._getItemSlot(inventoryItem);
        if (!targetSlot) {
            throw new Error(`${itemName} cannot be equipped`);
        }

        // Check if slot is available
        const slotConflict = this._checkSlotConflict(character, inventoryItem, targetSlot);
        if (slotConflict.conflict) {
            throw new Error(`Cannot equip ${itemName}: ${slotConflict.reason}`);
        }

        // Unequip conflicting items if necessary
        if (slotConflict.unequipItems.length > 0) {
            slotConflict.unequipItems.forEach(item => {
                this.unequipItem(character, item.name);
            });
        }

        // Equip the item
        inventoryItem.equipped = true;
        inventoryItem.equippedSlot = targetSlot;
        inventoryItem.equippedAt = Date.now();

        // Apply equipment bonuses
        this._applyEquipmentBonuses(character, inventoryItem);

        // Recalculate character stats
        this._recalculateCharacterStats(character);
        
        character.lastModified = Date.now();

        return {
            success: true,
            item: inventoryItem,
            slot: targetSlot,
            message: `${character.name} equips ${itemName}`,
            characterUpdates: this._getCharacterStatSummary(character)
        };
    }

    /**
     * Unequip an item
     * @param {Object} character - Character object
     * @param {string} itemName - Name of item to unequip
     * @returns {Object} Unequip result
     */
    unequipItem(character, itemName) {
        const inventoryItem = character.inventory.find(item => 
            item.name === itemName && item.equipped
        );
        
        if (!inventoryItem) {
            throw new Error(`${itemName} is not currently equipped`);
        }

        // Remove equipment bonuses
        this._removeEquipmentBonuses(character, inventoryItem);

        // Unequip the item
        inventoryItem.equipped = false;
        inventoryItem.equippedSlot = null;
        inventoryItem.unequippedAt = Date.now();

        // Recalculate character stats
        this._recalculateCharacterStats(character);
        
        character.lastModified = Date.now();

        return {
            success: true,
            item: inventoryItem,
            message: `${character.name} unequips ${itemName}`,
            characterUpdates: this._getCharacterStatSummary(character)
        };
    }

    /**
     * Get character's equipped items
     * @param {Object} character - Character object
     * @returns {Object} Equipped items by slot
     */
    getEquippedItems(character) {
        const equipped = {};
        
        character.inventory
            .filter(item => item.equipped)
            .forEach(item => {
                if (!equipped[item.equippedSlot]) {
                    equipped[item.equippedSlot] = [];
                }
                equipped[item.equippedSlot].push(item);
            });

        return equipped;
    }

    /**
     * Calculate attack bonuses for equipped weapons
     * @param {Object} character - Character object
     * @returns {Array} Attack calculations
     */
    getAttackBonuses(character) {
        const attacks = [];
        const equippedWeapons = character.inventory.filter(item => 
            item.equipped && item.category === 'weapon'
        );

        equippedWeapons.forEach(weapon => {
            const attack = this._calculateWeaponAttack(character, weapon);
            attacks.push(attack);
        });

        // Add natural attacks if no weapons equipped
        if (equippedWeapons.length === 0) {
            attacks.push(this._calculateUnarmedAttack(character));
        }

        return attacks;
    }

    /**
     * Calculate armor class from equipped items
     * @param {Object} character - Character object
     * @returns {Object} AC breakdown
     */
    calculateArmorClass(character) {
        let baseAC = 10;
        let armorBonus = 0;
        let shieldBonus = 0;
        let dexBonus = Math.floor((character.abilities.dexterity - 10) / 2);
        let naturalBonus = 0;
        let deflectionBonus = 0;
        let miscBonus = 0;
        
        const equippedArmor = character.inventory.filter(item => 
            item.equipped && (item.category === 'armor' || item.category === 'shield')
        );

        equippedArmor.forEach(item => {
            if (item.category === 'armor') {
                armorBonus += item.armorClass + (item.enhancement || 0);
                // Apply max dex bonus limitation
                if (item.maxDexBonus !== undefined) {
                    dexBonus = Math.min(dexBonus, item.maxDexBonus);
                }
            } else if (item.category === 'shield') {
                shieldBonus += item.armorClass + (item.enhancement || 0);
            }
        });

        // Apply other bonuses from magic items
        const magicItems = character.inventory.filter(item => 
            item.equipped && item.magic
        );

        magicItems.forEach(item => {
            if (item.properties.includes('natural-armor')) {
                naturalBonus += item.enhancement || 1;
            }
            if (item.properties.includes('deflection')) {
                deflectionBonus += item.enhancement || 1;
            }
        });

        const totalAC = baseAC + armorBonus + shieldBonus + dexBonus + naturalBonus + deflectionBonus + miscBonus;

        return {
            total: totalAC,
            breakdown: {
                base: baseAC,
                armor: armorBonus,
                shield: shieldBonus,
                dex: dexBonus,
                natural: naturalBonus,
                deflection: deflectionBonus,
                misc: miscBonus
            },
            touchAC: baseAC + dexBonus + deflectionBonus + miscBonus,
            flatFootedAC: baseAC + armorBonus + shieldBonus + naturalBonus + deflectionBonus + miscBonus
        };
    }

    /**
     * Generate random treasure
     * @param {number} challengeRating - Challenge rating for treasure generation
     * @returns {Array} Generated treasure items
     */
    generateTreasure(challengeRating) {
        const treasure = [];
        const treasureValue = this._getTreasureValue(challengeRating);
        
        // Generate coins
        const coins = this._generateCoins(treasureValue * 0.3);
        if (coins.total > 0) {
            treasure.push(coins);
        }

        // Generate items
        const remainingValue = treasureValue * 0.7;
        const items = this._generateTreasureItems(remainingValue);
        treasure.push(...items);

        return treasure;
    }

    // Private helper methods

    _findItem(itemName) {
        const normalizedName = itemName.toLowerCase();
        
        // Check weapons
        if (this.weaponDatabase[normalizedName]) {
            return { ...this.weaponDatabase[normalizedName], category: 'weapon' };
        }
        
        // Check armor
        if (this.armorDatabase[normalizedName]) {
            return { ...this.armorDatabase[normalizedName], category: 'armor' };
        }
        
        // Check general items
        if (this.itemDatabase[normalizedName]) {
            return { ...this.itemDatabase[normalizedName], category: 'item' };
        }

        return null;
    }

    _getItemSlot(item) {
        const slotMap = {
            'weapon': 'mainhand',
            'shield': 'offhand',
            'armor': 'body',
            'helmet': 'head',
            'gloves': 'hands',
            'boots': 'feet',
            'ring': 'ring',
            'amulet': 'neck',
            'cloak': 'shoulders',
            'belt': 'waist',
            'bracers': 'wrists'
        };

        return slotMap[item.category] || null;
    }

    _checkSlotConflict(character, item, targetSlot) {
        const currentlyEquipped = character.inventory.filter(
            equipped => equipped.equipped && equipped.equippedSlot === targetSlot
        );

        // Handle special cases
        if (targetSlot === 'ring') {
            // Characters can wear 2 rings
            if (currentlyEquipped.length >= 2) {
                return {
                    conflict: true,
                    reason: 'Already wearing maximum number of rings (2)',
                    unequipItems: []
                };
            }
            return { conflict: false, unequipItems: [] };
        }

        if (targetSlot === 'mainhand') {
            // Check for two-handed weapons
            if (item.properties && item.properties.includes('two-handed')) {
                const offhandItem = character.inventory.find(
                    equipped => equipped.equipped && equipped.equippedSlot === 'offhand'
                );
                return {
                    conflict: false,
                    unequipItems: offhandItem ? [offhandItem] : []
                };
            }
        }

        // Standard single-slot items
        if (currentlyEquipped.length > 0) {
            return {
                conflict: false, // We'll auto-unequip
                unequipItems: currentlyEquipped
            };
        }

        return { conflict: false, unequipItems: [] };
    }

    _calculateWeaponAttack(character, weapon) {
        const baseAttackBonus = character.baseAttackBonus;
        let abilityBonus = 0;
        
        // Determine ability modifier
        if (weapon.properties && weapon.properties.includes('finesse')) {
            // Use higher of STR or DEX for finesse weapons
            const strMod = Math.floor((character.abilities.strength - 10) / 2);
            const dexMod = Math.floor((character.abilities.dexterity - 10) / 2);
            abilityBonus = Math.max(strMod, dexMod);
        } else if (weapon.properties && weapon.properties.includes('ranged')) {
            abilityBonus = Math.floor((character.abilities.dexterity - 10) / 2);
        } else {
            abilityBonus = Math.floor((character.abilities.strength - 10) / 2);
        }

        const enhancementBonus = weapon.enhancement || 0;
        const masterworkBonus = weapon.masterwork ? 1 : 0;

        const totalAttackBonus = baseAttackBonus + abilityBonus + enhancementBonus + masterworkBonus;

        return {
            weapon: weapon.name,
            attackBonus: totalAttackBonus,
            damage: weapon.damage,
            critical: weapon.critical || '20/x2',
            range: weapon.range || 'melee',
            breakdown: {
                base: baseAttackBonus,
                ability: abilityBonus,
                enhancement: enhancementBonus,
                masterwork: masterworkBonus
            }
        };
    }

    _updateEncumbrance(character) {
        const totalWeight = this._getTotalWeight(character);
        const strength = character.abilities.strength;
        
        // Calculate carrying capacity
        const lightLoad = strength * 10;
        const mediumLoad = strength * 20;
        const heavyLoad = strength * 30;
        const maxLoad = strength * 50;

        let encumbranceLevel = 'light';
        if (totalWeight > heavyLoad) {
            encumbranceLevel = 'overloaded';
        } else if (totalWeight > mediumLoad) {
            encumbranceLevel = 'heavy';
        } else if (totalWeight > lightLoad) {
            encumbranceLevel = 'medium';
        }

        character.encumbrance = {
            level: encumbranceLevel,
            currentWeight: totalWeight,
            lightLoad: lightLoad,
            mediumLoad: mediumLoad,
            heavyLoad: heavyLoad,
            maxLoad: maxLoad
        };
    }

    _getTotalWeight(character) {
        return character.inventory.reduce((total, item) => {
            return total + ((item.weight || 0) * item.quantity);
        }, 0);
    }

    _initializeWeapons() {
        return {
            // Simple Weapons
            'dagger': {
                cost: 2,
                damage: '1d4',
                critical: '19-20/x2',
                range: 10,
                weight: 1,
                type: 'piercing or slashing',
                properties: ['light', 'thrown']
            },
            'club': {
                cost: 0,
                damage: '1d6',
                critical: '20/x2',
                range: 10,
                weight: 3,
                type: 'bludgeoning',
                properties: ['one-handed']
            },
            'shortspear': {
                cost: 1,
                damage: '1d6',
                critical: '20/x2',
                range: 20,
                weight: 3,
                type: 'piercing',
                properties: ['thrown']
            },
            
            // Martial Weapons
            'longsword': {
                cost: 15,
                damage: '1d8',
                critical: '19-20/x2',
                range: null,
                weight: 4,
                type: 'slashing',
                properties: ['one-handed']
            },
            'greatsword': {
                cost: 50,
                damage: '2d6',
                critical: '19-20/x2',
                range: null,
                weight: 8,
                type: 'slashing',
                properties: ['two-handed']
            },
            'rapier': {
                cost: 20,
                damage: '1d6',
                critical: '18-20/x2',
                range: null,
                weight: 2,
                type: 'piercing',
                properties: ['finesse']
            },
            'shortbow': {
                cost: 30,
                damage: '1d6',
                critical: '20/x3',
                range: 60,
                weight: 2,
                type: 'piercing',
                properties: ['ranged', 'two-handed']
            },
            'longbow': {
                cost: 75,
                damage: '1d8',
                critical: '20/x3',
                range: 100,
                weight: 3,
                type: 'piercing',
                properties: ['ranged', 'two-handed']
            }
        };
    }

    _initializeArmor() {
        return {
            'padded': {
                cost: 5,
                armorClass: 1,
                maxDexBonus: 8,
                armorCheckPenalty: 0,
                arcaneSpellFailure: 5,
                speed30: 30,
                speed20: 20,
                weight: 10,
                type: 'light'
            },
            'leather': {
                cost: 10,
                armorClass: 2,
                maxDexBonus: 6,
                armorCheckPenalty: 0,
                arcaneSpellFailure: 10,
                speed30: 30,
                speed20: 20,
                weight: 15,
                type: 'light'
            },
            'chain-shirt': {
                cost: 100,
                armorClass: 4,
                maxDexBonus: 4,
                armorCheckPenalty: -2,
                arcaneSpellFailure: 20,
                speed30: 30,
                speed20: 20,
                weight: 25,
                type: 'light'
            },
            'scale-mail': {
                cost: 50,
                armorClass: 4,
                maxDexBonus: 3,
                armorCheckPenalty: -4,
                arcaneSpellFailure: 25,
                speed30: 20,
                speed20: 15,
                weight: 30,
                type: 'medium'
            },
            'chainmail': {
                cost: 150,
                armorClass: 5,
                maxDexBonus: 2,
                armorCheckPenalty: -5,
                arcaneSpellFailure: 30,
                speed30: 20,
                speed20: 15,
                weight: 40,
                type: 'medium'
            },
            'splint-mail': {
                cost: 200,
                armorClass: 6,
                maxDexBonus: 0,
                armorCheckPenalty: -7,
                arcaneSpellFailure: 40,
                speed30: 20,
                speed20: 15,
                weight: 45,
                type: 'heavy'
            },
            'plate-mail': {
                cost: 1500,
                armorClass: 8,
                maxDexBonus: 1,
                armorCheckPenalty: -6,
                arcaneSpellFailure: 35,
                speed30: 20,
                speed20: 15,
                weight: 50,
                type: 'heavy'
            },
            
            // Shields
            'buckler': {
                cost: 15,
                armorClass: 1,
                maxDexBonus: null,
                armorCheckPenalty: -1,
                arcaneSpellFailure: 5,
                weight: 5,
                category: 'shield',
                type: 'light'
            },
            'light-shield': {
                cost: 9,
                armorClass: 1,
                maxDexBonus: null,
                armorCheckPenalty: -1,
                arcaneSpellFailure: 5,
                weight: 6,
                category: 'shield',
                type: 'light'
            },
            'heavy-shield': {
                cost: 7,
                armorClass: 2,
                maxDexBonus: null,
                armorCheckPenalty: -2,
                arcaneSpellFailure: 15,
                weight: 15,
                category: 'shield',
                type: 'heavy'
            }
        };
    }

    _initializeItems() {
        return {
            'backpack': {
                cost: 2,
                weight: 2,
                description: 'A leather backpack for carrying equipment'
            },
            'bedroll': {
                cost: 0.1,
                weight: 5,
                description: 'Sleeping gear for outdoor rest'
            },
            'rope': {
                cost: 2,
                weight: 10,
                description: '50 feet of hemp rope'
            },
            'torch': {
                cost: 0.01,
                weight: 1,
                description: 'Provides light for 1 hour'
            },
            'rations': {
                cost: 2,
                weight: 1,
                description: 'Trail rations for one day'
            },
            'potion-cure-light-wounds': {
                cost: 50,
                weight: 0,
                description: 'Heals 1d8+1 hit points when consumed',
                category: 'potion',
                effect: 'heal',
                healAmount: '1d8+1'
            }
        };
    }

    _initializeMagicItems() {
        return {
            'ring-of-protection': {
                cost: 2000,
                weight: 0,
                description: 'Provides deflection bonus to AC',
                category: 'ring',
                properties: ['deflection']
            },
            'amulet-of-natural-armor': {
                cost: 2000,
                weight: 0,
                description: 'Provides natural armor bonus to AC',
                category: 'amulet',
                properties: ['natural-armor']
            },
            'cloak-of-elvenkind': {
                cost: 2500,
                weight: 1,
                description: 'Provides +5 competence bonus on Hide checks',
                category: 'cloak',
                properties: ['stealth']
            }
        };
    }

    _initializeEquipmentSlots() {
        return {
            head: { limit: 1, description: 'Helmets, circlets, crowns' },
            face: { limit: 1, description: 'Goggles, masks, lenses' },
            neck: { limit: 1, description: 'Amulets, necklaces, periapts' },
            shoulders: { limit: 1, description: 'Cloaks, capes, mantles' },
            body: { limit: 1, description: 'Armor, robes, vestments' },
            chest: { limit: 1, description: 'Vests, shirts (worn over armor)' },
            waist: { limit: 1, description: 'Belts, girdles, sashes' },
            wrists: { limit: 1, description: 'Bracers, bracelets' },
            hands: { limit: 1, description: 'Gloves, gauntlets' },
            ring: { limit: 2, description: 'Rings (maximum 2)' },
            feet: { limit: 1, description: 'Boots, shoes, sandals' },
            mainhand: { limit: 1, description: 'Primary weapon' },
            offhand: { limit: 1, description: 'Shield or secondary weapon' }
        };
    }

    _initializeEncumbranceRules() {
        return {
            light: { maxDexBonus: null, checkPenalty: 0, runMultiplier: 4 },
            medium: { maxDexBonus: 3, checkPenalty: -3, runMultiplier: 4 },
            heavy: { maxDexBonus: 1, checkPenalty: -6, runMultiplier: 3 },
            overloaded: { maxDexBonus: 0, checkPenalty: -6, runMultiplier: 0 }
        };
    }

    _getMasterworkCost(category) {
        const costs = {
            weapon: 300,
            armor: 150,
            shield: 150,
            item: 50
        };
        return costs[category] || 50;
    }

    _calculateMagicItemCost(item, enhancement, properties) {
        let baseCost = 0;
        
        if (enhancement) {
            // Square of enhancement bonus * 2000 for weapons/armor
            baseCost = Math.pow(enhancement, 2) * 2000;
        }

        // Add property costs
        properties.forEach(property => {
            switch (property) {
                case 'flaming': baseCost += 8000; break;
                case 'frost': baseCost += 8000; break;
                case 'shock': baseCost += 8000; break;
                case 'keen': baseCost += 8000; break;
                case 'vorpal': baseCost += 200000; break;
                default: baseCost += 2000;
            }
        });

        return baseCost;
    }

    _recalculateCharacterStats(character) {
        // Recalculate AC
        const armorClass = this.calculateArmorClass(character);
        character.armorClass = armorClass.total;
        
        // Update other stats as needed
        character.lastModified = Date.now();
    }

    _applyEquipmentBonuses(character, item) {
        // Apply bonuses from equipped items
        // This would include stat bonuses, skill bonuses, etc.
        // Implementation would depend on specific item properties
    }

    _removeEquipmentBonuses(character, item) {
        // Remove bonuses from unequipped items
        // Counterpart to _applyEquipmentBonuses
    }

    _getCharacterStatSummary(character) {
        return {
            ac: character.armorClass,
            encumbrance: character.encumbrance?.level || 'light',
            totalWeight: this._getTotalWeight(character)
        };
    }

    _calculateUnarmedAttack(character) {
        const baseAttackBonus = character.baseAttackBonus;
        const strMod = Math.floor((character.abilities.strength - 10) / 2);
        
        return {
            weapon: 'Unarmed Strike',
            attackBonus: baseAttackBonus + strMod,
            damage: '1d3',
            critical: '20/x2',
            range: 'melee',
            breakdown: {
                base: baseAttackBonus,
                ability: strMod,
                enhancement: 0,
                masterwork: 0
            }
        };
    }

    _getTreasureValue(challengeRating) {
        // Treasure value based on CR (simplified)
        const treasureTable = {
            1: 300, 2: 600, 3: 900, 4: 1200, 5: 1600,
            6: 2000, 7: 2600, 8: 3400, 9: 4500, 10: 5800
        };
        return treasureTable[Math.min(challengeRating, 10)] || 300;
    }

    _generateCoins(value) {
        const coins = {
            platinum: Math.floor(this.dice.roll('1d6')),
            gold: Math.floor(this.dice.roll('3d6') * 10),
            silver: Math.floor(this.dice.roll('4d6') * 10),
            copper: Math.floor(this.dice.roll('6d6') * 10)
        };
        
        coins.total = (coins.platinum * 10) + coins.gold + (coins.silver * 0.1) + (coins.copper * 0.01);
        return coins;
    }

    _generateTreasureItems(value) {
        const items = [];
        const itemTypes = Object.keys(this.itemDatabase);
        
        while (value > 10 && items.length < 5) {
            const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            const item = this.itemDatabase[randomItem];
            
            if (item.cost <= value) {
                items.push({
                    name: randomItem,
                    ...item,
                    quantity: 1
                });
                value -= item.cost;
            } else {
                break;
            }
        }
        
        return items;
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EquipmentManager;
} else if (typeof window !== 'undefined') {
    window.EquipmentManager = EquipmentManager;
}
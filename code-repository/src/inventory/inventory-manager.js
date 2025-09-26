/**
 * InventoryManager - Advanced D&D 3.5 Inventory Management System
 * 
 * Features:
 * - Drag-and-drop interface with equipment presets
 * - Weight and encumbrance calculations
 * - Equipment slot management (worn/carried/stored)
 * - Automatic equipment bonuses calculation
 * - Equipment preset configurations (Combat/Exploration/Social/Survival)
 * - Container and storage management
 * - Item identification and magical properties
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class InventoryManager {
    constructor(calculationEngine, dataManager) {
        this.calculationEngine = calculationEngine;
        this.dataManager = dataManager;
        
        // Equipment slots
        this.equipmentSlots = {
            head: null,
            neck: null,
            shoulders: null,
            body: null,
            torso: null,
            arms: null,
            hands: null,
            ring1: null,
            ring2: null,
            feet: null,
            mainHand: null,
            offHand: null,
            ranged: null,
            belt: null,
            eyes: null,
            headband: null,
            wrists: null,
            shield: null
        };
        
        // Inventory containers
        this.containers = {
            backpack: {
                name: 'Backpack',
                capacity: 60, // pounds
                items: [],
                type: 'container'
            },
            beltPouch: {
                name: 'Belt Pouch',
                capacity: 5,
                items: [],
                type: 'quick_access'
            },
            quiver: {
                name: 'Quiver',
                capacity: 20, // arrows/bolts
                items: [],
                type: 'ammunition'
            }
        };
        
        // Equipment presets
        this.equipmentPresets = {
            combat: {
                name: 'Combat Ready',
                description: 'Optimized for battle encounters',
                equipment: {},
                quickAccess: ['healing_potion', 'weapon_oil', 'rope']
            },
            exploration: {
                name: 'Exploration Kit',
                description: 'Tools for dungeon delving and wilderness travel',
                equipment: {},
                quickAccess: ['torch', 'rope', 'rations', 'water']
            },
            social: {
                name: 'Social Gathering',
                description: 'Appropriate attire for noble courts and formal events',
                equipment: {},
                quickAccess: ['noble_outfit', 'jewelry', 'perfume']
            },
            survival: {
                name: 'Wilderness Survival',
                description: 'Essential gear for extended outdoor adventures',
                equipment: {},
                quickAccess: ['bedroll', 'rations', 'flint_steel', 'hunting_knife']
            }
        };
        
        // Current inventory state
        this.currentInventory = {
            equipped: { ...this.equipmentSlots },
            containers: { ...this.containers },
            coins: { cp: 0, sp: 0, gp: 0, pp: 0 },
            totalWeight: 0,
            encumbrance: 'light',
            carryingCapacity: { light: 0, medium: 0, heavy: 0, maximum: 0 }
        };
        
        console.log('🎒 Inventory Manager initialized');
    }

    /**
     * Initialize inventory for character
     */
    initializeInventory(character) {
        // Calculate carrying capacity
        this.calculateCarryingCapacity(character);
        
        // Set up starting equipment if provided
        if (character.equipment) {
            this.loadCharacterEquipment(character);
        }
        
        // Initialize equipment presets for character class
        this.initializeClassPresets(character);
        
        return this.currentInventory;
    }

    /**
     * Calculate carrying capacity based on strength
     */
    calculateCarryingCapacity(character) {
        const strength = character.abilities.strength;
        let baseCapacity = 0;
        
        // D&D 3.5 carrying capacity table
        if (strength <= 10) {
            baseCapacity = strength * 10;
        } else if (strength <= 20) {
            const capacities = [100, 115, 130, 150, 175, 200, 230, 260, 300, 350];
            baseCapacity = capacities[strength - 11];
        } else {
            // For strength above 20, use formula
            baseCapacity = Math.floor(350 * Math.pow(1.5, Math.floor((strength - 21) / 5)));
        }
        
        // Apply size modifiers
        const sizeMultipliers = {
            'Fine': 0.125,
            'Diminutive': 0.25,
            'Tiny': 0.5,
            'Small': 0.75,
            'Medium': 1,
            'Large': 2,
            'Huge': 4,
            'Gargantuan': 8,
            'Colossal': 16
        };
        
        const sizeMultiplier = sizeMultipliers[character.size || 'Medium'];
        baseCapacity *= sizeMultiplier;
        
        this.currentInventory.carryingCapacity = {
            light: baseCapacity,
            medium: baseCapacity * 2,
            heavy: baseCapacity * 3,
            maximum: baseCapacity * 5
        };
    }

    /**
     * Load character's existing equipment
     */
    loadCharacterEquipment(character) {
        const equipment = character.equipment;
        
        // Load weapons
        if (equipment.weapons) {
            equipment.weapons.forEach((weapon, index) => {
                if (index === 0) {
                    this.equipItem(weapon, 'mainHand');
                } else {
                    this.addToContainer(weapon, 'backpack');
                }
            });
        }
        
        // Load armor
        if (equipment.armor && equipment.armor.length > 0) {
            this.equipItem(equipment.armor[0], 'body');
        }
        
        // Load shield
        if (equipment.shield) {
            this.equipItem(equipment.shield, 'shield');
        }
        
        // Load other items
        if (equipment.items) {
            equipment.items.forEach(item => {
                this.addToContainer(item, 'backpack');
            });
        }
        
        // Load coins
        if (equipment.money) {
            this.currentInventory.coins = { ...equipment.money };
        }
        
        this.updateInventoryStats();
    }

    /**
     * Initialize class-specific equipment presets
     */
    initializeClassPresets(character) {
        const characterClass = character.characterClass;
        
        switch (characterClass) {
            case 'Fighter':
                this.setupFighterPresets();
                break;
            case 'Wizard':
                this.setupWizardPresets();
                break;
            case 'Rogue':
                this.setupRoguePresets();
                break;
            case 'Cleric':
                this.setupClericPresets();
                break;
            case 'Ranger':
                this.setupRangerPresets();
                break;
            default:
                this.setupDefaultPresets();
                break;
        }
    }

    /**
     * Set up fighter equipment presets
     */
    setupFighterPresets() {
        this.equipmentPresets.combat.equipment = {
            mainHand: 'longsword',
            offHand: 'heavy_steel_shield',
            body: 'full_plate',
            quickAccess: ['healing_potion', 'weapon_oil', 'whetstone']
        };
        
        this.equipmentPresets.exploration.equipment = {
            mainHand: 'longsword',
            body: 'chain_mail',
            quickAccess: ['rope', 'grappling_hook', 'torch', 'crowbar']
        };
    }

    /**
     * Set up wizard equipment presets
     */
    setupWizardPresets() {
        this.equipmentPresets.combat.equipment = {
            mainHand: 'quarterstaff',
            body: 'robe_of_protection',
            quickAccess: ['scroll_case', 'spell_components', 'wand']
        };
        
        this.equipmentPresets.exploration.equipment = {
            mainHand: 'light_crossbow',
            quickAccess: ['spellbook', 'magnifying_glass', 'chalk', 'ink_quill']
        };
    }

    // ===== EQUIPMENT MANAGEMENT =====

    /**
     * Equip item to specific slot
     */
    equipItem(item, slot) {
        // Validate slot compatibility
        if (!this.isValidSlot(item, slot)) {
            throw new Error(`Item ${item.name} cannot be equipped to ${slot}`);
        }
        
        // Check if slot is occupied
        const currentItem = this.currentInventory.equipped[slot];
        if (currentItem) {
            // Move current item to backpack
            this.addToContainer(currentItem, 'backpack');
        }
        
        // Equip new item
        this.currentInventory.equipped[slot] = {
            ...item,
            equipped: true,
            equippedAt: Date.now(),
            slot: slot
        };
        
        // Remove from container if it was there
        this.removeFromAllContainers(item);
        
        // Update stats
        this.updateInventoryStats();
        
        console.log(`⚔️ Equipped ${item.name} to ${slot}`);
        
        return true;
    }

    /**
     * Unequip item from slot
     */
    unequipItem(slot, targetContainer = 'backpack') {
        const item = this.currentInventory.equipped[slot];
        if (!item) {
            throw new Error(`No item equipped in ${slot}`);
        }
        
        // Remove from slot
        this.currentInventory.equipped[slot] = null;
        
        // Add to container
        this.addToContainer(item, targetContainer);
        
        // Update stats
        this.updateInventoryStats();
        
        console.log(`🎒 Unequipped ${item.name} from ${slot}`);
        
        return item;
    }

    /**
     * Add item to container
     */
    addToContainer(item, containerName) {
        const container = this.currentInventory.containers[containerName];
        if (!container) {
            throw new Error(`Container ${containerName} not found`);
        }
        
        // Check capacity
        if (!this.hasContainerCapacity(container, item)) {
            throw new Error(`Container ${containerName} is full`);
        }
        
        // Add item
        container.items.push({
            ...item,
            addedAt: Date.now(),
            container: containerName
        });
        
        this.updateInventoryStats();
        
        return true;
    }

    /**
     * Remove item from container
     */
    removeFromContainer(item, containerName) {
        const container = this.currentInventory.containers[containerName];
        if (!container) return false;
        
        const index = container.items.findIndex(i => i.name === item.name);
        if (index === -1) return false;
        
        container.items.splice(index, 1);
        this.updateInventoryStats();
        
        return true;
    }

    /**
     * Remove item from all containers
     */
    removeFromAllContainers(item) {
        Object.keys(this.currentInventory.containers).forEach(containerName => {
            this.removeFromContainer(item, containerName);
        });
    }

    /**
     * Move item between containers
     */
    moveItem(item, fromContainer, toContainer) {
        if (this.removeFromContainer(item, fromContainer)) {
            return this.addToContainer(item, toContainer);
        }
        return false;
    }

    // ===== PRESET MANAGEMENT =====

    /**
     * Apply equipment preset
     */
    applyPreset(presetName) {
        const preset = this.equipmentPresets[presetName];
        if (!preset) {
            throw new Error(`Preset ${presetName} not found`);
        }
        
        console.log(`🔄 Applying preset: ${preset.name}`);
        
        // Store current configuration for undo
        const previousState = this.saveCurrentState();
        
        try {
            // Unequip all current items
            this.unequipAllItems();
            
            // Apply preset equipment
            Object.keys(preset.equipment).forEach(slot => {
                const itemName = preset.equipment[slot];
                const item = this.findItemByName(itemName);
                
                if (item) {
                    this.equipItem(item, slot);
                }
            });
            
            // Organize quick access items
            this.organizeQuickAccess(preset.quickAccess);
            
            console.log(`✅ Applied preset: ${preset.name}`);
            
            return {
                success: true,
                preset: preset,
                previousState: previousState
            };
            
        } catch (error) {
            // Restore previous state on error
            this.restoreState(previousState);
            throw error;
        }
    }

    /**
     * Save equipment preset
     */
    savePreset(name, description) {
        const preset = {
            name: name,
            description: description,
            equipment: {},
            quickAccess: [],
            createdAt: Date.now()
        };
        
        // Save currently equipped items
        Object.keys(this.currentInventory.equipped).forEach(slot => {
            const item = this.currentInventory.equipped[slot];
            if (item) {
                preset.equipment[slot] = item.name;
            }
        });
        
        // Save quick access items
        const beltPouch = this.currentInventory.containers.beltPouch;
        preset.quickAccess = beltPouch.items.map(item => item.name);
        
        this.equipmentPresets[name] = preset;
        
        console.log(`💾 Saved preset: ${name}`);
        
        return preset;
    }

    /**
     * Organize quick access items
     */
    organizeQuickAccess(quickAccessItems) {
        const beltPouch = this.currentInventory.containers.beltPouch;
        
        // Clear current quick access
        beltPouch.items = [];
        
        // Add quick access items
        quickAccessItems.forEach(itemName => {
            const item = this.findItemByName(itemName);
            if (item) {
                this.addToContainer(item, 'beltPouch');
            }
        });
    }

    // ===== UTILITY METHODS =====

    /**
     * Update inventory statistics
     */
    updateInventoryStats() {
        this.calculateTotalWeight();
        this.calculateEncumbrance();
        this.calculateEquipmentBonuses();
    }

    /**
     * Calculate total weight
     */
    calculateTotalWeight() {
        let totalWeight = 0;
        
        // Add equipped items weight
        Object.values(this.currentInventory.equipped).forEach(item => {
            if (item && item.weight) {
                totalWeight += item.weight;
            }
        });
        
        // Add container items weight
        Object.values(this.currentInventory.containers).forEach(container => {
            container.items.forEach(item => {
                if (item.weight) {
                    totalWeight += item.weight;
                }
            });
        });
        
        // Add coin weight (50 coins = 1 pound)
        const coins = this.currentInventory.coins;
        const totalCoins = coins.cp + coins.sp + coins.gp + coins.pp;
        totalWeight += Math.floor(totalCoins / 50);
        
        this.currentInventory.totalWeight = totalWeight;
    }

    /**
     * Calculate encumbrance level
     */
    calculateEncumbrance() {
        const weight = this.currentInventory.totalWeight;
        const capacity = this.currentInventory.carryingCapacity;
        
        if (weight <= capacity.light) {
            this.currentInventory.encumbrance = 'light';
        } else if (weight <= capacity.medium) {
            this.currentInventory.encumbrance = 'medium';
        } else if (weight <= capacity.heavy) {
            this.currentInventory.encumbrance = 'heavy';
        } else {
            this.currentInventory.encumbrance = 'overloaded';
        }
    }

    /**
     * Calculate equipment bonuses
     */
    calculateEquipmentBonuses() {
        const bonuses = {
            ac: 0,
            attack: 0,
            damage: 0,
            saves: { fortitude: 0, reflex: 0, will: 0 },
            skills: {},
            abilities: {},
            special: []
        };
        
        // Process equipped items
        Object.values(this.currentInventory.equipped).forEach(item => {
            if (item && item.bonuses) {
                this.applyItemBonuses(bonuses, item.bonuses);
            }
        });
        
        this.currentInventory.equipmentBonuses = bonuses;
        
        return bonuses;
    }

    /**
     * Apply item bonuses to total
     */
    applyItemBonuses(totalBonuses, itemBonuses) {
        // AC bonuses
        if (itemBonuses.ac) {
            totalBonuses.ac += itemBonuses.ac;
        }
        
        // Attack bonuses
        if (itemBonuses.attack) {
            totalBonuses.attack += itemBonuses.attack;
        }
        
        // Damage bonuses
        if (itemBonuses.damage) {
            totalBonuses.damage += itemBonuses.damage;
        }
        
        // Saving throw bonuses
        if (itemBonuses.saves) {
            ['fortitude', 'reflex', 'will'].forEach(save => {
                if (itemBonuses.saves[save]) {
                    totalBonuses.saves[save] += itemBonuses.saves[save];
                }
            });
        }
        
        // Skill bonuses
        if (itemBonuses.skills) {
            Object.keys(itemBonuses.skills).forEach(skill => {
                if (!totalBonuses.skills[skill]) {
                    totalBonuses.skills[skill] = 0;
                }
                totalBonuses.skills[skill] += itemBonuses.skills[skill];
            });
        }
        
        // Ability bonuses
        if (itemBonuses.abilities) {
            Object.keys(itemBonuses.abilities).forEach(ability => {
                if (!totalBonuses.abilities[ability]) {
                    totalBonuses.abilities[ability] = 0;
                }
                totalBonuses.abilities[ability] += itemBonuses.abilities[ability];
            });
        }
        
        // Special abilities
        if (itemBonuses.special) {
            totalBonuses.special.push(...itemBonuses.special);
        }
    }

    /**
     * Validate if item can be equipped to slot
     */
    isValidSlot(item, slot) {
        const slotCompatibilities = {
            head: ['helmet', 'hat', 'circlet', 'crown'],
            neck: ['amulet', 'necklace', 'collar'],
            body: ['armor', 'robe', 'clothing'],
            mainHand: ['weapon', 'tool', 'wand', 'staff'],
            offHand: ['shield', 'weapon', 'orb', 'tome'],
            hands: ['gloves', 'gauntlets', 'bracers'],
            feet: ['boots', 'shoes', 'sandals'],
            ring1: ['ring'],
            ring2: ['ring'],
            belt: ['belt', 'girdle', 'sash']
        };
        
        const validTypes = slotCompatibilities[slot] || [];
        return validTypes.includes(item.type) || item.slots?.includes(slot);
    }

    /**
     * Check if container has capacity for item
     */
    hasContainerCapacity(container, item) {
        const currentWeight = container.items.reduce((sum, i) => sum + (i.weight || 0), 0);
        const itemWeight = item.weight || 0;
        
        return (currentWeight + itemWeight) <= container.capacity;
    }

    /**
     * Find item by name in inventory
     */
    findItemByName(name) {
        // Check equipped items
        for (const item of Object.values(this.currentInventory.equipped)) {
            if (item && item.name === name) {
                return item;
            }
        }
        
        // Check containers
        for (const container of Object.values(this.currentInventory.containers)) {
            const found = container.items.find(item => item.name === name);
            if (found) {
                return found;
            }
        }
        
        return null;
    }

    /**
     * Unequip all items
     */
    unequipAllItems() {
        Object.keys(this.currentInventory.equipped).forEach(slot => {
            if (this.currentInventory.equipped[slot]) {
                this.unequipItem(slot, 'backpack');
            }
        });
    }

    /**
     * Save current inventory state
     */
    saveCurrentState() {
        return JSON.parse(JSON.stringify(this.currentInventory));
    }

    /**
     * Restore inventory state
     */
    restoreState(state) {
        this.currentInventory = JSON.parse(JSON.stringify(state));
    }

    /**
     * Get inventory summary
     */
    getInventorySummary() {
        return {
            totalWeight: this.currentInventory.totalWeight,
            encumbrance: this.currentInventory.encumbrance,
            carryingCapacity: this.currentInventory.carryingCapacity,
            equippedItems: Object.keys(this.currentInventory.equipped).filter(slot => 
                this.currentInventory.equipped[slot] !== null
            ).length,
            containerItems: Object.values(this.currentInventory.containers).reduce((sum, container) => 
                sum + container.items.length, 0
            ),
            totalValue: this.calculateTotalValue(),
            coins: this.currentInventory.coins,
            equipmentBonuses: this.currentInventory.equipmentBonuses
        };
    }

    /**
     * Calculate total inventory value
     */
    calculateTotalValue() {
        let totalValue = 0;
        
        // Add equipped items value
        Object.values(this.currentInventory.equipped).forEach(item => {
            if (item && item.value) {
                totalValue += item.value;
            }
        });
        
        // Add container items value
        Object.values(this.currentInventory.containers).forEach(container => {
            container.items.forEach(item => {
                if (item.value) {
                    totalValue += item.value;
                }
            });
        });
        
        // Add coin value (in gold pieces)
        const coins = this.currentInventory.coins;
        totalValue += coins.pp * 10 + coins.gp + coins.sp * 0.1 + coins.cp * 0.01;
        
        return Math.round(totalValue * 100) / 100; // Round to 2 decimal places
    }

    /**
     * Export inventory data
     */
    exportInventory() {
        return {
            ...this.currentInventory,
            exportedAt: Date.now(),
            version: '2.0.0'
        };
    }

    /**
     * Import inventory data
     */
    importInventory(data) {
        this.currentInventory = {
            ...data,
            importedAt: Date.now()
        };
        
        this.updateInventoryStats();
        
        console.log('📥 Inventory imported successfully');
    }
}

// Global export for both browser and Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryManager;
} else if (typeof window !== 'undefined') {
    window.InventoryManager = InventoryManager;
}
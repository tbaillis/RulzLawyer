/**
 * Advanced Equipment Management System
 * Enhanced D&D 3.5 Equipment Management with Drag-and-Drop Interface
 * Supports: Encumbrance, Equipment Comparison, Magical Items, Preset Packages
 */
class AdvancedEquipmentManager {
  constructor() {
    this.inventory = {
      equipped: {
        armor: null,
        shield: null,
        weapons: [],
        rings: [],
        wondrous: [],
        tools: []
      },
      carried: [],
      stored: []
    };
    
    this.encumbranceData = {
      lightLoad: 0,
      mediumLoad: 0,
      heavyLoad: 0,
      lift: 0,
      drag: 0
    };
    
    this.equipmentPresets = this.initializePresets();
    this.magicalProperties = this.initializeMagicalProperties();
    this.comparisonData = new Map();
    
    // Initialize drag and drop system
    this.dragDropEnabled = false;
    this.currentDragItem = null;
    this.dropZones = new Map();
    
    console.log('🛡️ Advanced Equipment Manager initialized');
  }

  // ============= EQUIPMENT DATABASE =============
  initializeEquipmentDatabase() {
    return {
      // Armor
      armor: {
        leather: {
          name: 'Leather Armor',
          type: 'light',
          acBonus: 2,
          maxDex: 6,
          armorCheckPenalty: 0,
          arcaneSpellFailure: 10,
          weight: 15,
          cost: 10,
          description: 'This armor is made from tough but flexible leather'
        },
        studded: {
          name: 'Studded Leather',
          type: 'light',
          acBonus: 3,
          maxDex: 5,
          armorCheckPenalty: -1,
          arcaneSpellFailure: 15,
          weight: 20,
          cost: 25,
          description: 'Made from tough but flexible leather, studded leather is reinforced with close-set metal rivets'
        },
        chainShirt: {
          name: 'Chain Shirt',
          type: 'light',
          acBonus: 4,
          maxDex: 4,
          armorCheckPenalty: -2,
          arcaneSpellFailure: 20,
          weight: 25,
          cost: 100,
          description: 'Covering the torso, this armor is made up of thousands of interlocking metal rings'
        },
        // Medium armor
        scalemail: {
          name: 'Scale Mail',
          type: 'medium',
          acBonus: 4,
          maxDex: 3,
          armorCheckPenalty: -4,
          arcaneSpellFailure: 25,
          weight: 30,
          cost: 50,
          description: 'This is a coat and leggings of leather covered with overlapping pieces of metal'
        },
        chainmail: {
          name: 'Chainmail',
          type: 'medium',
          acBonus: 5,
          maxDex: 2,
          armorCheckPenalty: -5,
          arcaneSpellFailure: 30,
          weight: 40,
          cost: 150,
          description: 'This armor is made up of thousands of interlocking metal rings'
        },
        // Heavy armor
        splint: {
          name: 'Splint Mail',
          type: 'heavy',
          acBonus: 6,
          maxDex: 0,
          armorCheckPenalty: -7,
          arcaneSpellFailure: 40,
          weight: 45,
          cost: 200,
          description: 'Made of interlocking metal strips, splint mail includes gauntlets'
        },
        plate: {
          name: 'Full Plate',
          type: 'heavy',
          acBonus: 8,
          maxDex: 1,
          armorCheckPenalty: -6,
          arcaneSpellFailure: 35,
          weight: 50,
          cost: 1500,
          description: 'This armor consists of shaped and fitted metal plates riveted and interlocked'
        }
      },
      
      // Weapons
      weapons: {
        dagger: {
          name: 'Dagger',
          type: 'simple',
          category: 'light',
          damage: '1d4',
          critical: '19-20/x2',
          range: 10,
          weight: 1,
          cost: 2,
          damageType: 'piercing',
          special: ['thrown']
        },
        shortsword: {
          name: 'Short Sword',
          type: 'martial',
          category: 'light',
          damage: '1d6',
          critical: '19-20/x2',
          range: 0,
          weight: 2,
          cost: 10,
          damageType: 'piercing',
          special: []
        },
        longsword: {
          name: 'Longsword',
          type: 'martial',
          category: 'one-handed',
          damage: '1d8',
          critical: '19-20/x2',
          range: 0,
          weight: 4,
          cost: 15,
          damageType: 'slashing',
          special: []
        },
        greatsword: {
          name: 'Greatsword',
          type: 'martial',
          category: 'two-handed',
          damage: '2d6',
          critical: '19-20/x2',
          range: 0,
          weight: 8,
          cost: 50,
          damageType: 'slashing',
          special: []
        }
      },
      
      // Equipment
      equipment: {
        backpack: {
          name: 'Backpack',
          weight: 2,
          cost: 2,
          description: 'A leather pack carried on the back, typically with straps to secure it'
        },
        rope: {
          name: 'Rope, Silk (50 ft.)',
          weight: 5,
          cost: 10,
          description: 'This rope has 4 hit points and can be burst with a DC 24 Strength check'
        },
        torch: {
          name: 'Torch',
          weight: 1,
          cost: 1,
          description: 'A torch burns for 1 hour, shedding bright light in a 20-foot radius'
        }
      }
    };
  }

  // ============= ENCUMBRANCE SYSTEM =============
  calculateEncumbrance(character) {
    const strength = character.abilities?.strength?.score || 10;
    const size = character.size || 'Medium';
    
    // Base carrying capacity (D&D 3.5 rules)
    let baseCapacity;
    if (strength <= 10) {
      baseCapacity = strength * 10;
    } else {
      // For Str 11+, multiply by 4 for every +10
      const strMod = strength - 10;
      const multiplier = Math.pow(4, Math.floor(strMod / 10));
      baseCapacity = (10 + (strMod % 10)) * 10 * multiplier;
    }
    
    // Size modifiers
    const sizeMultipliers = {
      'Fine': 1/8,
      'Diminutive': 1/4,
      'Tiny': 1/2,
      'Small': 3/4,
      'Medium': 1,
      'Large': 2,
      'Huge': 4,
      'Gargantuan': 8,
      'Colossal': 16
    };
    
    const sizeMultiplier = sizeMultipliers[size] || 1;
    const adjustedCapacity = baseCapacity * sizeMultiplier;
    
    this.encumbranceData = {
      lightLoad: adjustedCapacity,
      mediumLoad: adjustedCapacity * 2,
      heavyLoad: adjustedCapacity * 3,
      lift: adjustedCapacity * 6,
      drag: adjustedCapacity * 15
    };
    
    return this.encumbranceData;
  }

  getCurrentWeight() {
    let totalWeight = 0;
    
    // Equipped items
    Object.values(this.inventory.equipped).forEach(slot => {
      if (Array.isArray(slot)) {
        slot.forEach(item => {
          if (item) totalWeight += item.weight || 0;
        });
      } else if (slot) {
        totalWeight += slot.weight || 0;
      }
    });
    
    // Carried items
    this.inventory.carried.forEach(item => {
      totalWeight += (item.weight || 0) * (item.quantity || 1);
    });
    
    return totalWeight;
  }

  getEncumbranceLevel(character) {
    const currentWeight = this.getCurrentWeight();
    const encumbrance = this.calculateEncumbrance(character);
    
    if (currentWeight <= encumbrance.lightLoad) {
      return { 
        level: 'Light', 
        maxDex: null, 
        checkPenalty: 0, 
        speed: 'normal',
        runMultiplier: 4 
      };
    } else if (currentWeight <= encumbrance.mediumLoad) {
      return { 
        level: 'Medium', 
        maxDex: 3, 
        checkPenalty: -3, 
        speed: 'reduced',
        runMultiplier: 4 
      };
    } else if (currentWeight <= encumbrance.heavyLoad) {
      return { 
        level: 'Heavy', 
        maxDex: 1, 
        checkPenalty: -6, 
        speed: 'reduced',
        runMultiplier: 3 
      };
    } else {
      return { 
        level: 'Overloaded', 
        maxDex: 0, 
        checkPenalty: -6, 
        speed: 'heavily_reduced',
        runMultiplier: 3 
      };
    }
  }

  // ============= EQUIPMENT PRESETS =============
  initializePresets() {
    return {
      combat: {
        name: 'Combat Ready',
        description: 'Optimized for battle encounters',
        equipment: [
          { id: 'longsword', slot: 'weapons' },
          { id: 'chainmail', slot: 'armor' },
          { id: 'shield', slot: 'shield' },
          { id: 'potion_cure_light', quantity: 3 }
        ]
      },
      exploration: {
        name: 'Dungeon Explorer',
        description: 'Essential gear for dungeon crawling',
        equipment: [
          { id: 'leather', slot: 'armor' },
          { id: 'shortsword', slot: 'weapons' },
          { id: 'backpack' },
          { id: 'torch', quantity: 10 },
          { id: 'rope' },
          { id: 'thieves_tools' }
        ]
      },
      social: {
        name: 'Court Attire',
        description: 'Appropriate for social encounters',
        equipment: [
          { id: 'noble_outfit', slot: 'armor' },
          { id: 'ceremonial_dagger', slot: 'weapons' },
          { id: 'signet_ring', slot: 'rings' }
        ]
      },
      survival: {
        name: 'Wilderness Survivor',
        description: 'Essential for outdoor adventures',
        equipment: [
          { id: 'studded', slot: 'armor' },
          { id: 'shortbow', slot: 'weapons' },
          { id: 'arrows', quantity: 50 },
          { id: 'bedroll' },
          { id: 'rations', quantity: 7 },
          { id: 'waterskin', quantity: 2 }
        ]
      }
    };
  }

  applyPreset(presetName, character) {
    const preset = this.equipmentPresets[presetName];
    if (!preset) {
      throw new Error(`Preset '${presetName}' not found`);
    }

    const equipmentDb = this.initializeEquipmentDatabase();
    const results = {
      equipped: [],
      added: [],
      failed: []
    };

    preset.equipment.forEach(item => {
      try {
        const equipmentItem = this.findEquipmentItem(item.id, equipmentDb);
        if (equipmentItem) {
          if (item.slot) {
            // Equipment that goes in a specific slot
            this.equipItem(equipmentItem, item.slot);
            results.equipped.push(equipmentItem.name);
          } else {
            // General inventory item
            this.addToInventory(equipmentItem, item.quantity || 1);
            results.added.push(`${equipmentItem.name}${item.quantity ? ` (${item.quantity})` : ''}`);
          }
        } else {
          results.failed.push(item.id);
        }
      } catch (error) {
        results.failed.push(`${item.id}: ${error.message}`);
      }
    });

    return results;
  }

  // ============= MAGICAL ITEM SYSTEM =============
  initializeMagicalProperties() {
    return {
      // Weapon enhancements
      weapon: {
        enhancement: {
          '+1': { bonus: 1, cost: 2000, description: '+1 enhancement bonus to attack and damage' },
          '+2': { bonus: 2, cost: 8000, description: '+2 enhancement bonus to attack and damage' },
          '+3': { bonus: 3, cost: 18000, description: '+3 enhancement bonus to attack and damage' }
        },
        special: {
          flaming: { cost: 8000, description: 'Deals +1d6 fire damage' },
          frost: { cost: 8000, description: 'Deals +1d6 cold damage' },
          shock: { cost: 8000, description: 'Deals +1d6 electricity damage' },
          keen: { cost: 8000, description: 'Doubles critical threat range' },
          vicious: { cost: 8000, description: '+2d6 damage, 1d6 to wielder' }
        }
      },
      // Armor enhancements
      armor: {
        enhancement: {
          '+1': { bonus: 1, cost: 1000, description: '+1 enhancement bonus to AC' },
          '+2': { bonus: 2, cost: 4000, description: '+2 enhancement bonus to AC' },
          '+3': { bonus: 3, cost: 9000, description: '+3 enhancement bonus to AC' }
        },
        special: {
          fortification_light: { cost: 4000, description: '25% chance to negate critical hits' },
          fortification_moderate: { cost: 16000, description: '75% chance to negate critical hits' },
          fire_resistance: { cost: 18000, description: 'Fire resistance 10' },
          spell_resistance: { cost: 9000, description: 'Spell resistance 13' }
        }
      }
    };
  }

  identifyMagicalItem(item) {
    // Simulate magical item identification
    const identificationDC = item.identificationDC || 15;
    const spellcraftBonus = 0; // Would come from character sheet
    
    // Simple identification check (would use actual dice rolling in practice)
    const roll = Math.floor(Math.random() * 20) + 1 + spellcraftBonus;
    
    if (roll >= identificationDC) {
      return {
        success: true,
        properties: item.magicalProperties || [],
        description: item.magicalDescription || 'No magical properties detected',
        value: item.magicalValue || item.cost
      };
    } else {
      return {
        success: false,
        message: 'Unable to identify magical properties'
      };
    }
  }

  // ============= DRAG AND DROP SYSTEM =============
  enableDragDrop(container) {
    this.dragDropEnabled = true;
    this.initializeDragDropHandlers(container);
  }

  initializeDragDropHandlers(container) {
    // Make inventory items draggable
    container.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('equipment-item')) {
        this.currentDragItem = {
          element: e.target,
          data: JSON.parse(e.target.dataset.item || '{}'),
          source: e.target.dataset.source || 'inventory'
        };
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    // Handle drag over equipment slots
    container.addEventListener('dragover', (e) => {
      if (e.target.classList.contains('equipment-slot')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.target.classList.add('drag-over');
      }
    });

    container.addEventListener('dragleave', (e) => {
      if (e.target.classList.contains('equipment-slot')) {
        e.target.classList.remove('drag-over');
      }
    });

    // Handle drop
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('equipment-slot') && this.currentDragItem) {
        const targetSlot = e.target.dataset.slot;
        const item = this.currentDragItem.data;
        
        try {
          this.handleEquipmentDrop(item, targetSlot, this.currentDragItem.source);
          this.updateInventoryDisplay();
        } catch (error) {
          console.error('Equipment drop failed:', error);
          this.showEquipmentError(error.message);
        }
        
        e.target.classList.remove('drag-over');
        this.currentDragItem = null;
      }
    });
  }

  handleEquipmentDrop(item, targetSlot, sourceSlot) {
    // Validate that item can be equipped in target slot
    if (!this.canEquipInSlot(item, targetSlot)) {
      throw new Error(`${item.name} cannot be equipped in ${targetSlot} slot`);
    }

    // Handle slot-specific logic
    switch (targetSlot) {
      case 'armor':
        if (this.inventory.equipped.armor) {
          // Move current armor back to inventory
          this.addToInventory(this.inventory.equipped.armor);
        }
        this.inventory.equipped.armor = item;
        break;
        
      case 'weapons':
        // Handle weapon slots (main hand, off hand, etc.)
        if (this.inventory.equipped.weapons.length >= 2) {
          throw new Error('Maximum weapons equipped');
        }
        this.inventory.equipped.weapons.push(item);
        break;
        
      case 'rings':
        if (this.inventory.equipped.rings.length >= 2) {
          throw new Error('Maximum rings equipped');
        }
        this.inventory.equipped.rings.push(item);
        break;
    }

    // Remove from source location
    if (sourceSlot === 'inventory') {
      this.removeFromInventory(item);
    }
  }

  canEquipInSlot(item, slot) {
    const itemType = item.type || item.category;
    
    switch (slot) {
      case 'armor':
        return ['light', 'medium', 'heavy'].includes(itemType);
      case 'shield':
        return itemType === 'shield';
      case 'weapons':
        return ['simple', 'martial', 'exotic'].includes(item.weaponType);
      case 'rings':
        return itemType === 'ring';
      default:
        return false;
    }
  }

  // ============= EQUIPMENT COMPARISON =============
  compareEquipment(item1, item2) {
    const comparison = {
      item1: item1,
      item2: item2,
      differences: [],
      recommendation: null
    };

    // Compare AC bonus (for armor)
    if (item1.acBonus !== undefined && item2.acBonus !== undefined) {
      if (item1.acBonus > item2.acBonus) {
        comparison.differences.push(`${item1.name} provides +${item1.acBonus - item2.acBonus} better AC`);
      } else if (item2.acBonus > item1.acBonus) {
        comparison.differences.push(`${item2.name} provides +${item2.acBonus - item1.acBonus} better AC`);
      }
    }

    // Compare damage (for weapons)
    if (item1.damage && item2.damage) {
      comparison.differences.push(`Damage: ${item1.name} (${item1.damage}) vs ${item2.name} (${item2.damage})`);
    }

    // Compare weight
    if (item1.weight !== item2.weight) {
      const weightDiff = Math.abs(item1.weight - item2.weight);
      const lighter = item1.weight < item2.weight ? item1.name : item2.name;
      comparison.differences.push(`${lighter} is ${weightDiff} lbs lighter`);
    }

    // Compare cost
    if (item1.cost !== item2.cost) {
      const costDiff = Math.abs(item1.cost - item2.cost);
      const cheaper = item1.cost < item2.cost ? item1.name : item2.name;
      comparison.differences.push(`${cheaper} costs ${costDiff} gp less`);
    }

    // Generate recommendation
    comparison.recommendation = this.generateEquipmentRecommendation(item1, item2);

    return comparison;
  }

  generateEquipmentRecommendation(item1, item2) {
    // Simple scoring system for recommendations
    let score1 = 0, score2 = 0;

    // AC bonus scoring (armor)
    if (item1.acBonus) score1 += item1.acBonus * 10;
    if (item2.acBonus) score2 += item2.acBonus * 10;

    // Weight penalty
    score1 -= (item1.weight || 0) * 0.1;
    score2 -= (item2.weight || 0) * 0.1;

    // Cost consideration (higher cost usually means better item)
    score1 += (item1.cost || 0) * 0.01;
    score2 += (item2.cost || 0) * 0.01;

    if (score1 > score2) {
      return `${item1.name} is recommended based on overall effectiveness`;
    } else if (score2 > score1) {
      return `${item2.name} is recommended based on overall effectiveness`;
    } else {
      return 'Items are roughly equivalent - choose based on preference';
    }
  }

  // ============= INVENTORY MANAGEMENT =============
  addToInventory(item, quantity = 1, location = 'carried') {
    const inventoryItem = {
      ...item,
      quantity: quantity,
      id: this.generateItemId()
    };

    this.inventory[location].push(inventoryItem);
    return inventoryItem;
  }

  removeFromInventory(item, quantity = 1) {
    ['carried', 'stored'].forEach(location => {
      const index = this.inventory[location].findIndex(inv => 
        inv.id === item.id || inv.name === item.name
      );
      
      if (index !== -1) {
        const inventoryItem = this.inventory[location][index];
        if (inventoryItem.quantity > quantity) {
          inventoryItem.quantity -= quantity;
        } else {
          this.inventory[location].splice(index, 1);
        }
      }
    });
  }

  equipItem(item, slot) {
    if (!this.canEquipInSlot(item, slot)) {
      throw new Error(`Cannot equip ${item.name} in ${slot} slot`);
    }

    // Handle existing item in slot
    if (this.inventory.equipped[slot] && !Array.isArray(this.inventory.equipped[slot])) {
      this.addToInventory(this.inventory.equipped[slot]);
    }

    this.inventory.equipped[slot] = item;
    this.removeFromInventory(item);
  }

  unequipItem(slot, index = 0) {
    let item;
    
    if (Array.isArray(this.inventory.equipped[slot])) {
      item = this.inventory.equipped[slot].splice(index, 1)[0];
    } else {
      item = this.inventory.equipped[slot];
      this.inventory.equipped[slot] = null;
    }

    if (item) {
      this.addToInventory(item);
    }

    return item;
  }

  // ============= UTILITY METHODS =============
  generateItemId() {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  findEquipmentItem(itemId, database) {
    // Search through all equipment categories
    for (const category of Object.values(database)) {
      if (category[itemId]) {
        return { ...category[itemId], id: itemId };
      }
    }
    return null;
  }

  getInventorySummary() {
    const summary = {
      totalWeight: this.getCurrentWeight(),
      totalValue: 0,
      itemCount: 0,
      equipped: Object.keys(this.inventory.equipped).reduce((count, slot) => {
        const items = this.inventory.equipped[slot];
        if (Array.isArray(items)) {
          return count + items.length;
        } else if (items) {
          return count + 1;
        }
        return count;
      }, 0),
      carried: this.inventory.carried.length,
      stored: this.inventory.stored.length
    };

    // Calculate total value and item count
    ['carried', 'stored'].forEach(location => {
      this.inventory[location].forEach(item => {
        summary.totalValue += (item.cost || 0) * (item.quantity || 1);
        summary.itemCount += item.quantity || 1;
      });
    });

    return summary;
  }

  exportInventory() {
    return {
      timestamp: new Date().toISOString(),
      inventory: this.inventory,
      encumbranceData: this.encumbranceData,
      summary: this.getInventorySummary()
    };
  }

  importInventory(data) {
    if (data.inventory) {
      this.inventory = data.inventory;
    }
    if (data.encumbranceData) {
      this.encumbranceData = data.encumbranceData;
    }
    
    console.log('📦 Inventory imported from', data.timestamp || 'unknown date');
  }

  // ============= UI INTEGRATION =============
  updateInventoryDisplay() {
    // This would be called to refresh the UI after inventory changes
    const event = new CustomEvent('inventoryUpdated', {
      detail: {
        inventory: this.inventory,
        summary: this.getInventorySummary(),
        encumbrance: this.getEncumbranceLevel()
      }
    });
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(event);
    }
  }

  showEquipmentError(message) {
    console.error('Equipment Error:', message);
    // In a full implementation, this would show a user-friendly error message
  }

  // ============= API METHODS =============
  getEquippedItems() {
    return this.inventory.equipped;
  }

  getCarriedItems() {
    return this.inventory.carried;
  }

  getStoredItems() {
    return this.inventory.stored;
  }

  getAllItems() {
    return {
      equipped: this.inventory.equipped,
      carried: this.inventory.carried,
      stored: this.inventory.stored
    };
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedEquipmentManager;
} else if (typeof window !== 'undefined') {
  window.AdvancedEquipmentManager = AdvancedEquipmentManager;
}

console.log('🛡️ AdvancedEquipmentManager module loaded');
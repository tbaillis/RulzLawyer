---
description: "Inventory and equipment management system with drag-and-drop UI"
applyTo: "**/inventory/**,**/equipment/**,**/ui/**"
---

# Inventory Management System Implementation Guide

## Core Requirements
Build an advanced inventory management system with drag-and-drop interface, encumbrance tracking, equipment presets, and D&D 3.5 compliance.

## System Architecture
```javascript
class InventoryManager {
    constructor(characterData) {
        this.character = characterData;
        this.inventory = {
            equipped: {},      // Currently equipped items
            backpack: [],      // Carried but not equipped
            stash: []          // Storage location items
        };
        this.encumbrance = this.calculateEncumbrance();
        this.presets = this.initializePresets();
    }
}
```

## Inventory Data Structure
```javascript
// Complete item tracking system
const itemStructure = {
    id: 'unique-item-id',
    name: 'Longsword +1',
    type: 'weapon',
    subtype: 'martial melee',
    quantity: 1,
    weight: 4,
    value: 2315,
    equipped: true,
    location: 'main_hand',
    properties: {
        enhancement: 1,
        damage: '1d8+1',
        critical: '19-20/x2',
        hardness: 10,
        hit_points: 5
    },
    magic: true,
    description: 'A finely crafted longsword with magical enhancement'
};
```

## Encumbrance System (D&D 3.5 Rules)
```javascript
calculateEncumbrance() {
    const str = this.character.abilities.str;
    const totalWeight = this.getTotalWeight();
    
    const carryingCapacity = {
        light: this.getLightLoad(str),
        medium: this.getMediumLoad(str),
        heavy: this.getHeavyLoad(str),
        max: this.getMaxLoad(str)
    };
    
    let loadLevel = 'light';
    if (totalWeight > carryingCapacity.heavy) loadLevel = 'overloaded';
    else if (totalWeight > carryingCapacity.medium) loadLevel = 'heavy';
    else if (totalWeight > carryingCapacity.light) loadLevel = 'medium';
    
    return {
        current: totalWeight,
        capacity: carryingCapacity,
        level: loadLevel,
        penalties: this.getEncumbrancePenalties(loadLevel)
    };
},

// Official D&D 3.5 carrying capacity table
getLightLoad(str) {
    const carryTable = {
        1: 3, 2: 6, 3: 10, 4: 13, 5: 16, 6: 20, 7: 23, 8: 26, 9: 30,
        10: 33, 11: 38, 12: 43, 13: 50, 14: 58, 15: 66, 16: 76, 17: 86,
        18: 100, 19: 116, 20: 133, 21: 153, 22: 173, 23: 200, 24: 233,
        25: 266, 26: 306, 27: 346, 28: 400, 29: 466
    };
    return carryTable[str] || Math.floor(carryTable[29] * Math.pow(4, (str - 29) / 10));
},

getEncumbrancePenalties(loadLevel) {
    const penalties = {
        light: { speed: 0, skill: 0, run: 'x4' },
        medium: { speed: -10, skill: -3, run: 'x4' },
        heavy: { speed: -20, skill: -6, run: 'x3' },
        overloaded: { speed: -20, skill: -6, run: 'x3', dodge_ac: false }
    };
    return penalties[loadLevel] || penalties.light;
}
```

## Equipment Slot Management
```javascript
equipmentSlots: {
    // Armor slots
    armor: null,
    shield: null,
    
    // Weapon slots  
    main_hand: null,
    off_hand: null,
    
    // Jewelry and accessories
    ring1: null,
    ring2: null,
    amulet: null,
    belt: null,
    boots: null,
    bracers: null,
    cloak: null,
    gloves: null,
    headband: null,
    helmet: null,
    vest: null
},

canEquipItem(item, slot) {
    const validation = { canEquip: true, reasons: [] };
    
    // Check slot compatibility
    if (!this.isValidSlot(item.type, slot)) {
        validation.canEquip = false;
        validation.reasons.push(`Cannot equip ${item.type} in ${slot} slot`);
    }
    
    // Check proficiency requirements
    if (item.type === 'weapon' || item.type === 'armor') {
        if (!this.character.isProficientWith(item)) {
            validation.reasons.push(`Not proficient with ${item.name}`);
        }
    }
    
    // Check size requirements
    if (item.size && item.size !== this.character.size) {
        validation.canEquip = false;
        validation.reasons.push(`Item size ${item.size} doesn't match character size ${this.character.size}`);
    }
    
    return validation;
}
```

## Equipment Preset System
```javascript
presets: {
    combat: {
        name: 'Combat Ready',
        description: 'Optimized for battle encounters',
        equipment: {
            armor: 'chain_mail',
            main_hand: 'longsword',
            off_hand: 'heavy_steel_shield',
            belt: 'potion_belt',
            boots: 'boots_of_speed'
        },
        quickItems: ['healing_potion', 'alchemist_fire', 'tanglefoot_bag']
    },
    exploration: {
        name: 'Exploration Gear',
        description: 'Tools for dungeon delving',
        equipment: {
            armor: 'leather_armor',
            main_hand: 'dagger',
            belt: 'utility_belt'
        },
        quickItems: ['rope_silk', 'grappling_hook', 'torch', 'lockpicks']
    },
    social: {
        name: 'Social Encounter',
        description: 'Dressed for diplomacy',
        equipment: {
            armor: null, // No armor for social situations
            main_hand: null,
            cloak: 'cloak_of_charisma'
        },
        quickItems: ['wine_fine', 'scroll_case', 'signet_ring']
    },
    stealth: {
        name: 'Infiltration Setup',
        description: 'Silent movement and concealment',
        equipment: {
            armor: 'studded_leather',
            main_hand: 'dagger',
            boots: 'boots_of_elvenkind',
            cloak: 'cloak_of_elvenkind'
        },
        quickItems: ['thieves_tools', 'caltrops', 'smokestick']
    }
},

applyPreset(presetName) {
    const preset = this.presets[presetName];
    if (!preset) return { success: false, message: 'Preset not found' };
    
    // Store current equipment state for undo
    this.previousState = JSON.parse(JSON.stringify(this.inventory.equipped));
    
    // Apply preset equipment
    Object.entries(preset.equipment).forEach(([slot, itemId]) => {
        if (itemId) {
            this.equipItemFromInventory(itemId, slot);
        } else {
            this.unequipSlot(slot);
        }
    });
    
    // Update quick access items
    this.quickAccessItems = preset.quickItems.slice();
    
    return { success: true, message: `Applied ${preset.name} preset` };
}
```

## Drag-and-Drop Interface
```html
<!-- Drag-and-Drop HTML Structure -->
<div class="inventory-container">
    <div class="equipment-slots">
        <div class="slot armor-slot" data-slot="armor" ondrop="handleDrop(event)" ondragover="allowDrop(event)">
            <div class="slot-label">Armor</div>
            <div class="equipped-item" draggable="true" ondragstart="handleDragStart(event)">
                <!-- Equipped item display -->
            </div>
        </div>
        <!-- Additional equipment slots -->
    </div>
    
    <div class="inventory-sections">
        <div class="backpack" ondrop="handleDrop(event)" ondragover="allowDrop(event)">
            <h3>Backpack</h3>
            <div class="inventory-grid">
                <!-- Draggable inventory items -->
            </div>
        </div>
        
        <div class="quick-access">
            <h3>Quick Access</h3>
            <!-- Hotbar items -->
        </div>
    </div>
</div>
```

```javascript
// Drag-and-drop JavaScript implementation
function handleDragStart(event) {
    const itemData = {
        itemId: event.target.dataset.itemId,
        sourceLocation: event.target.dataset.location,
        sourceSlot: event.target.dataset.slot
    };
    event.dataTransfer.setData('text/plain', JSON.stringify(itemData));
    event.target.classList.add('dragging');
}

function allowDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drop-target');
}

function handleDrop(event) {
    event.preventDefault();
    const itemData = JSON.parse(event.dataTransfer.getData('text/plain'));
    const targetSlot = event.currentTarget.dataset.slot;
    const targetLocation = event.currentTarget.dataset.location;
    
    // Validate and execute the drop
    const result = inventoryManager.moveItem(itemData, targetSlot, targetLocation);
    
    if (result.success) {
        updateInventoryDisplay();
        showMessage(result.message, 'success');
    } else {
        showMessage(result.message, 'error');
    }
    
    // Clean up visual feedback
    document.querySelectorAll('.dragging, .drop-target').forEach(el => {
        el.classList.remove('dragging', 'drop-target');
    });
}
```

## Weight and Value Calculations
```javascript
getTotalWeight() {
    let totalWeight = 0;
    
    // Equipped items
    Object.values(this.inventory.equipped).forEach(item => {
        if (item) totalWeight += item.weight * item.quantity;
    });
    
    // Backpack items
    this.inventory.backpack.forEach(item => {
        totalWeight += item.weight * item.quantity;
    });
    
    return totalWeight;
},

getTotalValue() {
    let totalValue = 0;
    
    Object.values(this.inventory.equipped).forEach(item => {
        if (item) totalValue += item.value * item.quantity;
    });
    
    this.inventory.backpack.forEach(item => {
        totalValue += item.value * item.quantity;
    });
    
    return totalValue;
},

// Currency management (D&D 3.5 standard)
currency: {
    platinum: 0,
    gold: 0,
    silver: 0,
    copper: 0
},

convertCurrency() {
    // Convert excess lower denominations to higher ones
    if (this.currency.copper >= 10) {
        this.currency.silver += Math.floor(this.currency.copper / 10);
        this.currency.copper %= 10;
    }
    if (this.currency.silver >= 10) {
        this.currency.gold += Math.floor(this.currency.silver / 10);
        this.currency.silver %= 10;
    }
    if (this.currency.gold >= 10) {
        this.currency.platinum += Math.floor(this.currency.gold / 10);
        this.currency.gold %= 10;
    }
}
```

## Auto-Sort and Organization
```javascript
sortInventory(criteria = 'type') {
    const sortFunctions = {
        type: (a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name),
        name: (a, b) => a.name.localeCompare(b.name),
        weight: (a, b) => a.weight - b.weight,
        value: (a, b) => b.value - a.value,
        quantity: (a, b) => b.quantity - a.quantity
    };
    
    this.inventory.backpack.sort(sortFunctions[criteria]);
    this.updateInventoryDisplay();
},

stackSimilarItems() {
    const itemMap = new Map();
    const stackedItems = [];
    
    this.inventory.backpack.forEach(item => {
        const key = `${item.name}_${JSON.stringify(item.properties)}`;
        
        if (itemMap.has(key)) {
            itemMap.get(key).quantity += item.quantity;
        } else {
            itemMap.set(key, { ...item });
            stackedItems.push(itemMap.get(key));
        }
    });
    
    this.inventory.backpack = stackedItems;
    this.updateInventoryDisplay();
}
```

## Integration Requirements
- Must integrate with Character Manager for stat calculations
- Real-time updates to character AC, attack bonuses, and saves
- Export/import functionality for character persistence  
- Responsive design for mobile and desktop use
- Accessibility compliance for screen readers
- Performance optimization for large inventories

## Testing Requirements
- Unit tests for encumbrance calculations
- Integration tests with character system
- UI tests for drag-and-drop functionality
- Performance tests with 500+ items
- Cross-browser compatibility verification
---
description: "D&D 3.5 SRD data management and rule implementation guidance"
applyTo: "**/srd/**,**/rules/**,**/data/**"
---

# D&D 3.5 SRD Data Manager Implementation Guide

## Core Requirements
Create a comprehensive D&D 3.5 System Reference Document data manager with complete rules implementation, accurate calculations, and validation.

## Class Architecture
```javascript
class SRDDataManager {
    constructor() {
        // Initialize complete D&D 3.5 data structures
        this.races = this.initializeRaces();           // 8 core races
        this.classes = this.initializeClasses();       // 11 core classes  
        this.skills = this.initializeSkills();         // 40+ skills
        this.feats = this.initializeFeats();           // Complete feat database
        this.equipment = this.initializeEquipment();   // Weapons, armor, gear
        this.spells = this.initializeSpells();         // Complete spell lists
        this.pointBuyCosts = this.initializePointBuy(); // Official 28-point system
    }
}
```

## Data Structure Specifications

### Race Data (8 Races Required)
```javascript
races: {
    human: {
        name: 'Human',
        size: 'Medium',
        speed: 30,
        ability_adjustments: {}, // No racial modifiers
        special_abilities: [
            'Extra feat at 1st level',
            'Extra skill points at each level',
            '4 extra skill points at 1st level'
        ],
        languages: ['Common']
    },
    elf: {
        name: 'Elf',
        size: 'Medium',
        speed: 30,
        ability_adjustments: { dex: 2, con: -2 },
        special_abilities: [
            'Low-light vision',
            'Weapon Proficiency (longsword, rapier, longbow, shortbow)',
            '+2 racial bonus on Listen, Search, and Spot checks',
            'Immunity to magic sleep effects',
            '+2 racial saving throw bonus against enchantment spells'
        ],
        languages: ['Common', 'Elven']
    }
    // ... implement dwarf, halfling, gnome, half-elf, half-orc, dragonborn
}
```

### Class Data (11 Classes Required)
```javascript
classes: {
    fighter: {
        name: 'Fighter',
        hit_die: 10,
        skill_points_per_level: 2,
        class_skills: ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Jump', 'Ride', 'Swim'],
        base_saves: { fort: 'good', ref: 'poor', will: 'poor' },
        bab_progression: 'full',
        spellcasting: false,
        special_abilities: [
            'Proficient with all simple and martial weapons',
            'Proficient with all armor and shields',
            'Bonus feat at 1st level',
            'Bonus feat every even-numbered level'
        ]
    },
    wizard: {
        name: 'Wizard',
        hit_die: 4,
        skill_points_per_level: 2,
        class_skills: ['Concentration', 'Craft', 'Decipher Script', 'Knowledge (all)', 'Profession', 'Spellcraft'],
        base_saves: { fort: 'poor', ref: 'poor', will: 'good' },
        bab_progression: 'poor',
        spellcasting: true,
        spells_per_day: { 1: { 0: 3, 1: 1 } },
        special_abilities: [
            'Spellcasting (arcane)',
            'Scribe Scroll bonus feat',
            'Bonus feat every 5 levels',
            'Familiar'
        ]
    }
    // ... implement barbarian, bard, cleric, druid, monk, paladin, ranger, rogue, sorcerer
}
```

## Rule Calculation Methods

### Point Buy System (Official D&D 3.5)
```javascript
pointBuyCosts: {
    8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5,
    14: 6, 15: 8, 16: 10, 17: 13, 18: 16
},

calculatePointBuyCost(score) {
    return this.pointBuyCosts[score] || 0;
},

validatePointBuy(abilities, maxPoints = 28) {
    let totalCost = 0;
    const validation = { valid: true, reasons: [] };
    
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(ability => {
        const score = abilities[ability] || 10;
        if (score < 8 || score > 18) {
            validation.valid = false;
            validation.reasons.push(`${ability} out of valid range (8-18)`);
        }
        totalCost += this.calculatePointBuyCost(score);
    });
    
    if (totalCost > maxPoints) {
        validation.valid = false;
        validation.reasons.push(`Total cost ${totalCost} exceeds ${maxPoints} points`);
    }
    
    return { ...validation, cost: totalCost, remaining: maxPoints - totalCost };
}
```

### Character Statistics Calculations
```javascript
// Ability modifier calculation
calculateAbilityModifier(abilityScore) {
    return Math.floor((abilityScore - 10) / 2);
},

// Base Attack Bonus calculation
getClassBAB(classId, level) {
    const classData = this.classes[classId];
    switch (classData.bab_progression) {
        case 'full': return level;
        case 'medium': return Math.floor(level * 3 / 4);
        case 'poor': return Math.floor(level / 2);
        default: return 0;
    }
},

// Saving throw calculation
getClassSaves(classId, level) {
    const classData = this.classes[classId];
    return {
        fort: this.calculateSave(classData.base_saves.fort, level),
        ref: this.calculateSave(classData.base_saves.ref, level),  
        will: this.calculateSave(classData.base_saves.will, level)
    };
},

calculateSave(progression, level) {
    return progression === 'good' ? 2 + Math.floor(level / 2) : Math.floor(level / 3);
}
```

### Skill Point Calculations
```javascript
getClassSkillPoints(classId, level, intModifier) {
    const classData = this.classes[classId];
    let basePoints = classData.skill_points_per_level + intModifier;
    
    // Minimum 1 skill point per level
    if (basePoints < 1) basePoints = 1;
    
    // First level gets 4x multiplier
    if (level === 1) basePoints *= 4;
    
    return basePoints;
},

isClassSkill(skillName, classId) {
    const classData = this.classes[classId];
    return classData.class_skills.includes(skillName);
}
```

## Spellcasting System
```javascript
isSpellcaster(classId) {
    const spellcastingClasses = ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'wizard'];
    return spellcastingClasses.includes(classId);
},

getSpellsPerDay(classId, level) {
    const classData = this.classes[classId];
    return classData.spells_per_day?.[level] || {};
},

calculateSpellDC(spellLevel, abilityModifier) {
    return 10 + spellLevel + abilityModifier;
}
```

## Equipment System
```javascript
equipment: {
    weapons: {
        longsword: {
            name: 'Longsword',
            cost: 15,
            damage: '1d8',
            critical: '19-20/x2',
            weight: 4,
            type: 'martial melee'
        }
        // ... complete weapon database
    },
    armor: {
        leather: {
            name: 'Leather Armor',
            cost: 10,
            ac_bonus: 2,
            max_dex: 6,
            check_penalty: 0,
            spell_failure: 10,
            weight: 15
        }
        // ... complete armor database
    }
}
```

## Dual Environment Compatibility
```javascript
// Required for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SRDDataManager;
} else if (typeof window !== 'undefined') {
    window.SRDDataManager = SRDDataManager;
}
```

## Validation Requirements
- All calculations must match official D&D 3.5 SRD exactly
- Comprehensive error handling for invalid inputs
- Performance optimization for real-time character updates
- Complete feat prerequisite validation system
- Equipment encumbrance and carrying capacity calculations

## Testing Requirements
- Unit tests for all calculation methods
- Integration tests with character creator
- Performance tests for large datasets
- Validation tests against known D&D characters
- Cross-browser compatibility testing
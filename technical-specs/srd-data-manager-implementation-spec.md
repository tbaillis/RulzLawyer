# SRD Data Manager - Complete Implementation Specification

## Overview
The SRD Data Manager is the cornerstone component that provides comprehensive D&D 3.5 System Reference Document data and rule implementations. This document captures the complete architecture and implementation patterns developed during the production-ready character creator project.

## File Location
- **Primary File**: `code-repository/src/srd-data-manager.js`
- **Size**: 600+ lines of production code
- **Dependencies**: None (standalone module)
- **Compatibility**: Dual Node.js/Browser environment

## Architecture Pattern

### Class Structure
```javascript
class SRDDataManager {
    constructor() {
        // Initialize all D&D 3.5 data structures
        this.races = { /* 8 complete races */ };
        this.classes = { /* 11 complete classes */ };
        this.skills = { /* 40+ complete skills */ };
        this.feats = { /* comprehensive feat database */ };
        this.equipment = { /* weapons, armor, gear */ };
        this.pointBuyCosts = { /* official 28-point system */ };
    }
    
    // Data access methods
    getRaceData(raceId) { /* returns complete race data */ }
    getClassData(classId) { /* returns complete class data */ }
    
    // Rule calculation methods
    getClassSkillPoints(classId, level, intModifier) { /* official calculations */ }
    getClassBAB(classId, level) { /* base attack bonus progression */ }
    isClassSkill(skillName, classId) { /* class skill validation */ }
    
    // Character generation methods
    calculatePointBuyCost(score) { /* official D&D 3.5 costs */ }
    isSpellcaster(classId) { /* spellcasting validation */ }
    getSpellsPerDay(classId, level) { /* spell slot calculations */ }
    getClassSpells(classId, level) { /* available spell lists */ }
}
```

### Environment Compatibility
```javascript
// Dual environment export pattern
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SRDDataManager;
} else if (typeof window !== 'undefined') {
    window.SRDDataManager = SRDDataManager;
}
```

## Data Structure Specifications

### Race Data Structure
```javascript
races: {
    'human': {
        name: 'Human',
        size: 'Medium',
        speed: 30,
        ability_adjustments: {}, // No racial modifiers
        special_abilities: [
            'Extra feat at 1st level',
            'Extra skill points at each level', 
            'Bonus skill points at 1st level'
        ],
        languages: ['Common'],
        description: 'Comprehensive description text...'
    },
    'elf': {
        name: 'Elf',
        size: 'Medium', 
        speed: 30,
        ability_adjustments: { dex: 2, con: -2 },
        special_abilities: [
            'Low-light vision',
            'Weapon Proficiency (martial)',
            'Keen Senses (+2 Listen, Search, Spot)',
            'Immunity to sleep spells',
            '+2 save vs enchantment spells'
        ],
        languages: ['Common', 'Elven'],
        description: 'Comprehensive description text...'
    }
    // ... 6 additional complete races
}
```

### Class Data Structure
```javascript
classes: {
    'fighter': {
        name: 'Fighter',
        hit_die: 10,
        skill_points_per_level: 2,
        class_skills: [
            'Climb', 'Craft', 'Handle Animal', 'Intimidate',
            'Jump', 'Ride', 'Swim'
        ],
        base_saves: { fort: 2, ref: 0, will: 0 },
        bab_progression: 'full', // +1 per level
        special_abilities: [
            'Weapon and Armor Proficiency (all)',
            'Bonus feat at 1st level',
            'Bonus feat every even level'
        ],
        spellcasting: false,
        description: 'Comprehensive description text...'
    },
    'wizard': {
        name: 'Wizard',
        hit_die: 4,
        skill_points_per_level: 2,
        class_skills: [
            'Concentration', 'Craft', 'Decipher Script',
            'Knowledge (all)', 'Profession', 'Spellcraft'
        ],
        base_saves: { fort: 0, ref: 0, will: 2 },
        bab_progression: 'poor', // +1 every 2 levels
        special_abilities: [
            'Spellcasting (arcane)',
            'Bonus feat at 1st level',
            'Bonus feat every 5 levels',
            'Familiar'
        ],
        spellcasting: true,
        spells_per_day: { 1: { 0: 3, 1: 1 } },
        description: 'Comprehensive description text...'
    }
    // ... 9 additional complete classes
}
```

### Skills Data Structure
```javascript
skills: {
    'Appraise': { key_ability: 'int', description: 'Skill description...' },
    'Balance': { key_ability: 'dex', description: 'Skill description...' },
    'Bluff': { key_ability: 'cha', description: 'Skill description...' },
    'Climb': { key_ability: 'str', description: 'Skill description...' },
    'Concentration': { key_ability: 'con', description: 'Skill description...' },
    'Craft': { key_ability: 'int', description: 'Skill description...' },
    'Decipher Script': { key_ability: 'int', description: 'Skill description...' },
    'Diplomacy': { key_ability: 'cha', description: 'Skill description...' },
    'Disable Device': { key_ability: 'int', description: 'Skill description...' },
    'Disguise': { key_ability: 'cha', description: 'Skill description...' },
    'Escape Artist': { key_ability: 'dex', description: 'Skill description...' },
    'Forgery': { key_ability: 'int', description: 'Skill description...' },
    'Gather Information': { key_ability: 'cha', description: 'Skill description...' },
    'Handle Animal': { key_ability: 'cha', description: 'Skill description...' },
    'Heal': { key_ability: 'wis', description: 'Skill description...' },
    'Hide': { key_ability: 'dex', description: 'Skill description...' },
    'Intimidate': { key_ability: 'cha', description: 'Skill description...' },
    'Jump': { key_ability: 'str', description: 'Skill description...' },
    'Knowledge (Arcana)': { key_ability: 'int', description: 'Skill description...' },
    'Knowledge (History)': { key_ability: 'int', description: 'Skill description...' },
    'Knowledge (Religion)': { key_ability: 'int', description: 'Skill description...' },
    'Listen': { key_ability: 'wis', description: 'Skill description...' },
    'Move Silently': { key_ability: 'dex', description: 'Skill description...' },
    'Open Lock': { key_ability: 'dex', description: 'Skill description...' },
    'Perform': { key_ability: 'cha', description: 'Skill description...' },
    'Profession': { key_ability: 'wis', description: 'Skill description...' },
    'Ride': { key_ability: 'dex', description: 'Skill description...' },
    'Search': { key_ability: 'int', description: 'Skill description...' },
    'Sense Motive': { key_ability: 'wis', description: 'Skill description...' },
    'Sleight of Hand': { key_ability: 'dex', description: 'Skill description...' },
    'Spellcraft': { key_ability: 'int', description: 'Skill description...' },
    'Spot': { key_ability: 'wis', description: 'Skill description...' },
    'Survival': { key_ability: 'wis', description: 'Skill description...' },
    'Swim': { key_ability: 'str', description: 'Skill description...' },
    'Tumble': { key_ability: 'dex', description: 'Skill description...' },
    'Use Magic Device': { key_ability: 'cha', description: 'Skill description...' },
    'Use Rope': { key_ability: 'dex', description: 'Skill description...' }
    // ... additional skills
}
```

### Point Buy Cost Structure
```javascript
pointBuyCosts: {
    8: 0,   // 8 ability score costs 0 points
    9: 1,   // 9 ability score costs 1 point
    10: 2,  // 10 ability score costs 2 points
    11: 3,  // 11 ability score costs 3 points
    12: 4,  // 12 ability score costs 4 points
    13: 5,  // 13 ability score costs 5 points
    14: 6,  // 14 ability score costs 6 points
    15: 8,  // 15 ability score costs 8 points
    16: 10, // 16 ability score costs 10 points
    17: 13, // 17 ability score costs 13 points
    18: 16  // 18 ability score costs 16 points
}
```

### Equipment Data Structure
```javascript
equipment: {
    weapons: {
        'longsword': {
            name: 'Longsword',
            cost: 15,
            damage: '1d8',
            critical: '19-20/x2',
            weight: 4,
            type: 'martial'
        },
        'dagger': {
            name: 'Dagger',
            cost: 2,
            damage: '1d4',
            critical: '19-20/x2', 
            weight: 1,
            type: 'simple'
        }
        // ... additional weapons
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
        // ... additional armor
    },
    gear: {
        'backpack': { name: 'Backpack', cost: 2, weight: 2 },
        'rope': { name: 'Rope (50 ft)', cost: 2, weight: 10 },
        'torch': { name: 'Torch', cost: 0.01, weight: 1 },
        'waterskin': { name: 'Waterskin', cost: 1, weight: 4 }
        // ... additional gear
    }
}
```

## Key Method Implementations

### Point Buy Calculation
```javascript
calculatePointBuyCost(score) {
    return this.pointBuyCosts[score] || 0;
}

validatePointBuy(abilities, maxPoints = 28) {
    let totalCost = 0;
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(ability => {
        const score = abilities[ability] || 10;
        if (score < 8 || score > 18) return { valid: false, reason: `${ability} out of range` };
        totalCost += this.calculatePointBuyCost(score);
    });
    
    if (totalCost > maxPoints) {
        return { valid: false, reason: `Total cost ${totalCost} exceeds ${maxPoints} points` };
    }
    
    return { valid: true, cost: totalCost, remaining: maxPoints - totalCost };
}
```

### Skill Point Calculation
```javascript
getClassSkillPoints(classId, level, intModifier) {
    const classData = this.classes[classId];
    if (!classData) return 0;
    
    let skillPoints = classData.skill_points_per_level + intModifier;
    if (skillPoints < 1) skillPoints = 1; // Minimum 1 skill point
    
    // Multiply by 4 at first level
    if (level === 1) skillPoints *= 4;
    
    // Human bonus
    return skillPoints;
}
```

### Base Attack Bonus Calculation
```javascript
getClassBAB(classId, level) {
    const classData = this.classes[classId];
    if (!classData) return 0;
    
    switch (classData.bab_progression) {
        case 'full': return level; // Fighter, Barbarian, Paladin, Ranger
        case 'medium': return Math.floor(level * 3 / 4); // Bard, Cleric, Druid, Monk, Rogue
        case 'poor': return Math.floor(level / 2); // Sorcerer, Wizard
        default: return 0;
    }
}
```

### Spell System Implementation
```javascript
isSpellcaster(classId) {
    const spellcastingClasses = ['bard', 'cleric', 'druid', 'sorcerer', 'wizard', 'paladin', 'ranger'];
    return spellcastingClasses.includes(classId.toLowerCase());
}

getSpellsPerDay(classId, level) {
    const spellsPerDay = {
        bard: { 1: { 0: 2 } },
        cleric: { 1: { 0: 3, 1: 1 } },
        druid: { 1: { 0: 3, 1: 1 } },
        sorcerer: { 1: { 0: 5, 1: 3 } },
        wizard: { 1: { 0: 3, 1: 1 } },
        paladin: { 1: { 0: 0, 1: 0 } }, // No spells at 1st level
        ranger: { 1: { 0: 0, 1: 0 } }   // No spells at 1st level
    };
    
    return spellsPerDay[classId.toLowerCase()]?.[level] || {};
}
```

## Usage Patterns

### Initialization
```javascript
// In HTML file
const srdData = new SRDDataManager();
```

### Data Access
```javascript
// Get race information
const humanData = srdData.getRaceData('human');
const elfData = srdData.getRaceData('elf');

// Get class information
const fighterData = srdData.getClassData('fighter');
const wizardData = srdData.getClassData('wizard');

// Check spell casting ability
if (srdData.isSpellcaster(classId)) {
    const spells = srdData.getSpellsPerDay(classId, 1);
}
```

### Character Statistics Calculation
```javascript
// Calculate skill points for a 1st level character
const intMod = Math.floor((character.abilities.int - 10) / 2);
const skillPoints = srdData.getClassSkillPoints(classId, 1, intMod);

// Calculate base attack bonus
const bab = srdData.getClassBAB(classId, 1);

// Validate point buy
const validation = srdData.validatePointBuy(character.abilities, 28);
```

## Integration Points

### HTML Integration
```html
<script src="/code-repository/src/srd-data-manager.js"></script>
<script>
    const srdData = new SRDDataManager();
    // Now available globally for character creator
</script>
```

### Server Routing Required
```javascript
// In game-server.js
} else if (parsedUrl.pathname === '/code-repository/src/srd-data-manager.js') {
    content = fs.readFileSync('./code-repository/src/srd-data-manager.js', 'utf8');
    res.setHeader('Content-Type', 'application/javascript');
```

## Testing and Validation

### Data Integrity Tests
- All 8 races have complete data structures
- All 11 classes have accurate progressions
- Point buy costs match official D&D 3.5 specifications
- Skill lists include all required abilities
- Equipment data includes costs, weights, and game statistics

### Calculation Tests
- Point buy validation correctly enforces 28-point limit
- BAB calculations match class progression tables
- Skill point calculations include intelligence modifier and first level bonuses
- Spell slot calculations match official spellcaster progressions

## Known Dependencies and Requirements
- **No external dependencies** - completely self-contained
- **Dual environment support** - works in both Node.js and browser
- **File size**: Approximately 600+ lines when fully implemented
- **Memory usage**: Minimal - all data stored as static objects
- **Performance**: O(1) lookup for all data access methods

## Extension Points
- Additional races can be added to the `races` object
- Additional classes can be added to the `classes` object
- Feat prerequisite validation can be enhanced with more complex parsers
- Equipment database can be expanded with magical items
- Spell databases can include full spell descriptions and effects

This implementation provides the foundation for a complete, SRD-compliant D&D 3.5 character creation system with professional-grade data management and rule validation.
# D&D Character Creator - Class Selection Test  

## Test Information
- **Test ID**: TEST-003
- **Test Suite**: Character Creation Components  
- **Feature**: Class Selection and Progression
- **User Story**: US-003
- **Priority**: High
- **Type**: Component
- **Status**: Not Started

## Test Objective
Validate that all D&D 3.5 SRD classes can be selected and their class features, hit dice, skill points, saves, and BAB progressions are correctly applied to the character object.

## Prerequisites
- Character creation tool loaded in browser
- SRD class data loaded (srd-classes.js) 
- Character Manager initialized
- Rules Engine available
- Base ability scores assigned

## Test Data Sets

### Core Classes Test Data
| Class | Hit Die | BAB | Fort | Ref | Will | Skill Points | Key Features |
|-------|---------|-----|------|-----|------|--------------|--------------|
| Barbarian | d12 | High | Good | Poor | Poor | 4 + Int | Rage, fast movement |
| Bard | d6 | Medium | Poor | Good | Good | 6 + Int | Spells, bardic music |
| Cleric | d8 | Medium | Good | Poor | Good | 2 + Int | Spells, turn undead |
| Druid | d8 | Medium | Good | Poor | Good | 4 + Int | Spells, wild shape |
| Fighter | d10 | High | Good | Poor | Poor | 2 + Int | Bonus feats |
| Monk | d8 | Medium | Good | Good | Good | 4 + Int | Unarmed combat, AC bonus |
| Paladin | d10 | High | Good | Poor | Poor | 2 + Int | Spells, divine grace |
| Ranger | d8 | High | Good | Good | Poor | 6 + Int | Spells, favored enemy |
| Rogue | d6 | Medium | Poor | Good | Poor | 8 + Int | Sneak attack, skills |
| Sorcerer | d4 | Low | Poor | Poor | Good | 2 + Int | Spontaneous spells |
| Wizard | d4 | Low | Poor | Poor | Good | 2 + Int | Prepared spells |

### Spell Progression Test Data
| Class | Level 1 | Level 2 | Level 3 | Spellcasting Type |
|-------|---------|---------|---------|-------------------|
| Cleric | 1+1 | 2+1 | 2+1+1 | Prepared, Divine |
| Sorcerer | 5 | 6 | 6 | Spontaneous, Arcane |
| Wizard | 3+1 | 4+1 | 4+1+1 | Prepared, Arcane |
| Bard | - | 0 | 1 | Spontaneous, Arcane |

## Detailed Test Cases

### Test Case 1: Fighter Class Selection
**Objective**: Verify fighter class basics are applied correctly

**Steps**:
1. Create character with 14 Constitution, 12 Intelligence
2. Select "Fighter" class
3. Verify class features applied

**Expected Results**:
- `character.class.name` = "Fighter"
- `character.hitDie` = "d10"
- `character.hitPoints` = 10 + Con modifier (12 total)
- `character.baseAttackBonus` = +1
- `character.saves.fortitude.base` = +2
- `character.saves.reflex.base` = +0  
- `character.saves.will.base` = +0
- `character.skillPoints.total` = 2 + Int modifier (3 total)
- `character.classFeatures` includes bonus feat at 1st level

**Verification**:
```javascript
assert(character.class.name === "Fighter");
assert(character.hitDie === "d10");
assert(character.hitPoints.total === 12); // 10 + 2 Con mod
assert(character.baseAttackBonus === 1);
assert(character.saves.fortitude.base === 2);
```

### Test Case 2: Wizard Spellcasting
**Objective**: Verify wizard spellcasting is implemented correctly

**Steps**:
1. Create character with 16 Intelligence 
2. Select "Wizard" class
3. Check spell slots and spellbook

**Expected Results**:
- Base spell slots: 3 level-0, 1 level-1
- Bonus spells from Intelligence: +1 level-1 spell
- Total: 3 level-0 spells, 2 level-1 spells
- Spellbook contains all level-0 spells + 3+Int level-1 spells
- Scribe Scroll feat granted

**Verification**:
```javascript
assert(character.spells.level0.perDay === 3);
assert(character.spells.level1.perDay === 2);
assert(character.spellbook.level1.length === 6); // 3 + 3 Int mod
assert(character.classFeatures.includes("Scribe Scroll"));
```

### Test Case 3: Rogue Skill Points
**Objective**: Verify rogue gets maximum skill points

**Steps**:
1. Create character with 14 Intelligence (+2 modifier)
2. Select "Rogue" class
3. Verify skill point calculation

**Expected Results**:
- Base skill points: 8 per level
- Intelligence bonus: +2 per level  
- Human bonus (if applicable): +1 per level
- Total for human rogue: 11 skill points at 1st level

**Verification**:
```javascript
assert(character.skillPoints.base === 8);
assert(character.skillPoints.intelligence === 2);  
assert(character.skillPoints.total >= 10);
```

### Test Case 4: Monk AC Bonus
**Objective**: Verify monk Wisdom AC bonus applies correctly

**Steps**:
1. Create character with 16 Wisdom (+3 modifier)
2. Select "Monk" class
3. Check AC calculations

**Expected Results**:
- AC = 10 + Dex modifier + Wisdom modifier + size + natural
- Wisdom modifier (+3) added to AC
- Flurry of blows available
- Unarmed strike damage = 1d6

**Verification**:
```javascript
assert(character.combat.armorClass.wisdom === 3);
assert(character.classFeatures.includes("Flurry of Blows"));
assert(character.combat.unarmedDamage === "1d6");
```

### Test Case 5: Barbarian Rage
**Objective**: Verify barbarian rage mechanics

**Steps**:
1. Select "Barbarian" class
2. Verify rage ability added
3. Check rage bonuses

**Expected Results**:
- Rage ability available (1/day at 1st level)
- Rage provides +4 Str, +4 Con, +2 Will saves, -2 AC
- Fast movement (+10 ft speed)
- Cannot use Dex/Int/Cha based skills while raging

**Verification**:
```javascript
assert(character.specialAbilities.rage.perDay === 1);
assert(character.race.speed + character.classFeatures.fastMovement === baseSpeed + 10);
```

### Test Case 6: Cleric Turn Undead
**Objective**: Verify cleric divine abilities

**Steps**:
1. Create character with 14 Charisma
2. Select "Cleric" class
3. Check turn undead and domains

**Expected Results**:
- Turn undead attempts = 3 + Cha modifier (6 total)
- Must select 2 domains
- Domain spells added to spell list
- Domain powers granted

### Test Case 7: Multi-Class Scenarios
**Objective**: Test level progression in multiple classes

**Steps**:
1. Create 1st level Fighter
2. Add 2nd level as Rogue (multi-classing)
3. Verify combined progression

**Expected Results**:
- Hit points from both classes
- BAB calculated correctly (no stacking penalties)
- Save bonuses from both classes
- Class features from both classes maintained

## Spellcasting Integration Tests

### Prepared Spellcasters (Cleric, Wizard)
**Test**: Spell preparation and casting mechanics
**Verification**: 
- Daily spell slots calculated correctly
- Bonus spells from ability scores
- Spell preparation interface functional

### Spontaneous Spellcasters (Sorcerer, Bard)
**Test**: Known spells vs spells per day
**Verification**:
- Spells known limitations enforced
- Spells per day calculated with bonuses
- No spell preparation required

## Class Feature Progression Tests

### Level-Dependent Features
**Test**: Features that scale with level
**Examples**: 
- Sneak attack damage increases
- Spells per day progression  
- BAB improvements
- Save bonus increases

### Prerequisite-Based Features
**Test**: Features requiring specific prerequisites
**Examples**:
- Paladin code of conduct
- Monk lawful alignment requirement
- Barbarian literacy restrictions

## Error Handling Tests

### Invalid Class Selection
- **Test**: Select non-existent class
- **Expected**: Error handling, no character changes

### Alignment Restrictions  
- **Test**: Select class with alignment conflict
- **Expected**: Warning message, prevent selection or alignment change

### Ability Score Requirements
- **Test**: Select class without minimum ability scores
- **Expected**: Warning about sub-optimal choice

## Performance Tests

### Class Data Loading
- **Metric**: Time to load class definitions
- **Target**: < 150ms for all classes

### Class Application Speed
- **Metric**: Time to apply class to character  
- **Target**: < 15ms per class application

### Multi-Class Calculations
- **Metric**: Time to calculate multi-class penalties
- **Target**: < 25ms for complex multi-class builds

## Browser Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Class selection | ✓ | ✓ | ✓ | ✓ |
| Spell slot calculation | ✓ | ✓ | ✓ | ✓ |
| Feature progression | ✓ | ✓ | ✓ | ✓ |
| Multi-classing | ✓ | ✓ | ✓ | ✓ |

## Pass/Fail Criteria

### Pass Criteria
- All 11 core classes selectable
- Hit dice, BAB, and saves applied correctly
- Skill points calculated accurately  
- Class features granted appropriately
- Spellcasting mechanics functional
- Multi-classing rules enforced
- **🚨 All code in `code-repository/` folder structure**

### Fail Criteria
- Missing class features
- Incorrect statistical progressions
- Spellcasting calculation errors
- Multi-class penalty bugs
- Performance below targets

## Dependencies
- `code-repository/src/data/srd-classes.js` - Class definitions
- `code-repository/src/managers/class-manager.js` - Class application logic
- `code-repository/src/managers/spell-manager.js` - Spellcasting mechanics
- `code-repository/src/models/character.js` - Character object
- `code-repository/src/engines/rules-engine.js` - Rules validation

## Automation Framework

### Unit Test Structure
```javascript
describe('Class Selection', () => {
  test('Fighter grants correct hit die', () => {
    character.selectClass('Fighter');
    expect(character.hitDie).toBe('d10');
  });

  test('Wizard spells calculated correctly', () => {
    character.abilities.intelligence.total = 16;
    character.selectClass('Wizard');
    expect(character.spells.level1.perDay).toBe(2);
  });
});
```

## Risk Assessment
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Complex spell calculations | High | Medium | Automated testing suite |
| Multi-class rule errors | High | Medium | Comprehensive test scenarios |
| Class feature interactions | Medium | High | Integration testing |
| Performance with many classes | Low | Low | Load testing |

## Test Results Template
| Date | Tester | Classes Tested | Pass/Fail | Issues Found |
|------|--------|----------------|-----------|--------------|
| TBD | QA | All 11 Core | Pending | None yet |

---
**Created**: September 20, 2025  
**Last Updated**: September 20, 2025  
**Status**: Ready for implementation testing
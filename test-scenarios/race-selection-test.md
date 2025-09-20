# D&D Character Creator - Race Selection Test

## Test Information
- **Test ID**: TEST-002  
- **Test Suite**: Character Creation Components
- **Feature**: Race Selection and Application
- **User Story**: US-002
- **Priority**: High
- **Type**: Component
- **Status**: Not Started

## Test Objective
Validate that all D&D 3.5 SRD races can be selected and their racial features, ability modifiers, and special abilities are correctly applied to the character object.

## Prerequisites
- Character creation tool loaded in browser
- SRD race data loaded (srd-races.js)
- Character Manager initialized
- Rules Engine available

## Test Data Sets

### Core Races Test Data
| Race | Ability Modifiers | Size | Speed | Special Features |
|------|------------------|------|-------|------------------|
| Human | None | Medium | 30 ft | Bonus feat, bonus skill points |
| Dwarf | +2 Con, -2 Cha | Medium | 20 ft | Darkvision, stonecunning, dwarven traits |
| Elf | +2 Dex, -2 Con | Medium | 30 ft | Low-light vision, elven traits |
| Halfling | +2 Dex, -2 Str | Small | 20 ft | Small size bonuses, halfling traits |
| Gnome | +2 Con, -2 Str | Small | 20 ft | Small size bonuses, gnome traits |
| Half-Elf | None | Medium | 30 ft | Low-light vision, mixed heritage |
| Half-Orc | +2 Str, -2 Int, -2 Cha | Medium | 30 ft | Darkvision, orc blood |

### Edge Case Test Data
| Race | Test Scenario | Expected Behavior |
|------|---------------|-------------------|
| Dwarf | Con modifier affects HP | HP recalculated with +2 Con bonus |
| Elf | Dex modifier affects AC | AC increases with +2 Dex bonus |
| Halfling | Small size affects AC/Attack | +1 AC and +1 attack from size |
| Gnome | Multiple ability modifiers | Both +2 Con and -2 Str applied |

## Detailed Test Cases

### Test Case 1: Human Race Selection
**Objective**: Verify human racial features are applied correctly

**Steps**:
1. Initialize new character with neutral ability scores (10 in all)
2. Select "Human" race
3. Verify character object updates

**Expected Results**:
- `character.race.name` = "Human"
- `character.race.size` = "Medium"
- `character.race.speed` = 30
- `character.bonusFeats` increased by 1
- `character.skillPoints` increased by 1 per level
- No ability score modifiers applied

**Verification**:
```javascript
assert(character.race.name === "Human");
assert(character.race.abilityModifiers.length === 0);
assert(character.bonusFeats.racial === 1);
assert(character.skillPoints.racial === 1);
```

### Test Case 2: Dwarf Race Selection  
**Objective**: Verify dwarf racial modifiers and features

**Steps**:
1. Initialize character with Constitution 12, Charisma 12
2. Select "Dwarf" race  
3. Verify ability modifications and features

**Expected Results**:
- Constitution increased to 14 (+2 modifier)
- Charisma decreased to 10 (-2 modifier)
- Darkvision 60 ft added to special abilities
- Movement speed = 20 ft
- Dwarven weapon familiarity added
- +4 dodge bonus vs giants added

**Verification**:
```javascript
assert(character.abilities.constitution.total === 14);
assert(character.abilities.charisma.total === 10);
assert(character.specialAbilities.includes("Darkvision 60 ft"));
assert(character.race.speed === 20);
```

### Test Case 3: Small Size Race (Halfling)
**Objective**: Verify small size bonuses are applied correctly

**Steps**:
1. Initialize character with base stats
2. Select "Halfling" race
3. Check AC, attack, and skill bonuses

**Expected Results**:  
- +1 size bonus to AC
- +1 size bonus to attack rolls
- +4 racial bonus to Hide checks
- +2 racial bonus to saves vs fear
- Strength reduced by 2, Dexterity increased by 2

**Verification**:
```javascript
assert(character.combat.armorClass.size === 1);
assert(character.combat.attackBonus.size === 1);
assert(character.skills.hide.racial === 4);
assert(character.abilities.strength.total === originalStr - 2);
```

### Test Case 4: Multiple Ability Modifiers (Gnome)
**Objective**: Verify multiple ability modifiers applied simultaneously

**Steps**:
1. Set Strength to 12, Constitution to 12
2. Select "Gnome" race
3. Verify both modifiers applied

**Expected Results**:
- Strength decreased to 10 (-2 modifier)
- Constitution increased to 14 (+2 modifier)
- Small size bonuses applied
- Spell-like abilities added

### Test Case 5: Race Change Scenario
**Objective**: Verify previous race features are removed when changing races

**Steps**:
1. Select "Human" race (gains bonus feat)
2. Change to "Elf" race
3. Verify human features removed, elf features added

**Expected Results**:
- Human bonus feat removed
- Human bonus skill points removed
- Elf low-light vision added
- Elf ability modifiers applied

## Automated Test Framework

### Test Runner Setup
```javascript
// Example test structure for automation
describe('Race Selection Tests', () => {
  beforeEach(() => {
    character = new Character();
    raceManager = new RaceManager(srdRaceData);
  });

  test('Human race applies correctly', () => {
    raceManager.applyRace(character, 'Human');
    expect(character.race.name).toBe('Human');
    expect(character.bonusFeats.racial).toBe(1);
  });

  test('Dwarf ability modifiers applied', () => {
    character.abilities.constitution.base = 10;
    raceManager.applyRace(character, 'Dwarf');
    expect(character.abilities.constitution.total).toBe(12);
  });
});
```

## Error Handling Tests

### Invalid Race Selection
- **Test**: Attempt to select non-existent race
- **Expected**: Error message displayed, no character changes
- **Verification**: Character object unchanged

### Race Data Corruption
- **Test**: Corrupt race data in SRD file
- **Expected**: Fallback to safe defaults or error handling
- **Verification**: Application remains functional

## Performance Tests

### Race Loading Performance
- **Metric**: Time to load all race data
- **Target**: < 100ms for initial load
- **Test**: Load srd-races.js and measure parsing time

### Race Application Performance  
- **Metric**: Time to apply race to character
- **Target**: < 10ms per race application
- **Test**: Apply each race and measure execution time

## Browser Compatibility

### Cross-Browser Race Selection
Test race selection in:
- Chrome 100+ (primary target)
- Firefox 90+
- Safari 15+  
- Edge 100+

### Mobile Browser Testing
- iOS Safari
- Chrome Mobile
- Samsung Internet

## Pass/Fail Criteria

### Pass Criteria
- All 7 core races selectable
- Ability modifiers applied correctly
- Special abilities added to character
- Size bonuses calculated properly
- Race changes handled cleanly
- **🚨 All implementation in `code-repository/` folder**

### Fail Criteria  
- Missing or incorrect ability modifiers
- Special abilities not applied
- Size calculations wrong
- Race change bugs
- JavaScript errors during selection

## Dependencies
- `code-repository/src/data/srd-races.js` - Race definitions
- `code-repository/src/managers/race-manager.js` - Race application logic  
- `code-repository/src/models/character.js` - Character object model
- `code-repository/src/engines/rules-engine.js` - Rules validation

## Risk Assessment
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| SRD race data errors | High | Low | Validate against official sources |
| Ability modifier bugs | High | Medium | Comprehensive unit testing |
| Size calculation errors | Medium | Medium | Automated regression tests |
| Race change state bugs | High | Medium | State management testing |

## Test Execution Log
| Date | Version | Result | Notes |
|------|---------|--------|-------|
| TBD | v1.0 | Pending | Awaiting implementation |

## Defect Tracking
| Bug ID | Description | Priority | Status | Assigned |
|--------|-------------|----------|--------|---------|
| TBD | TBD | TBD | TBD | TBD |

---
**Test Created**: September 20, 2025  
**Last Updated**: September 20, 2025  
**Next Review**: Upon implementation completion
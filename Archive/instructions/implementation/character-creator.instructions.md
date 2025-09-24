---
description: "Implementation guidance for D&D 3.5 character creation system"
applyTo: "**/character-creator/**,**/character/**,**/srd/**"
---

# Character Creator Implementation Guide

## Core Requirements
Build a complete 7-step D&D 3.5 character creation wizard with full SRD compliance:

### Step 1: Ability Scores (28-Point Buy)
- Implement official D&D 3.5 28-point buy system with accurate cost tables
- Validate ability score ranges (8-18) and point allocation
- Provide real-time cost calculation and remaining points display
- Include ability modifier calculations

### Step 2: Race Selection  
- Support all 8 core D&D 3.5 races with complete racial abilities
- Apply racial ability modifiers automatically
- Display special abilities, languages, and size/speed information
- Handle racial bonuses (humans get extra feat and skill points)

### Step 3: Class Selection
- Implement all 11 core D&D 3.5 classes with accurate progressions
- Display hit die, skill points, BAB progression, and save bonuses
- Show class features and spellcasting information
- Calculate derived statistics (HP, AC, saves, BAB)

### Step 4: Skill Allocation
- Present all D&D 3.5 skills with key ability associations  
- Distinguish class skills vs. cross-class skills
- Enforce maximum ranks (level + 3 for class skills)
- Track skill point allocation with intelligence modifier

### Step 5: Feat Selection
- Comprehensive feat database with prerequisite validation
- Support multiple feat sources (base, human bonus, fighter bonus)
- Provide feat search and filtering capabilities
- Validate all prerequisites automatically

### Step 6: Equipment & Spells
- Starting gold calculation by class
- Equipment purchasing with weapons, armor, and gear
- Spell selection for spellcasting classes
- Encumbrance calculation and display

### Step 7: Character Finalization
- Complete character sheet generation
- Character validation against all D&D 3.5 rules
- Save/export functionality (localStorage + JSON)
- Print-friendly character sheet format

## Technical Implementation

### File Structure
```
code-repository/src/
├── character-creator/
│   ├── character-creator.html     # Main interface
│   ├── character-creator.js       # Core logic
│   └── character-creator.css      # Styling
├── srd/
│   ├── srd-data-manager.js       # Complete D&D 3.5 data
│   ├── character-rules.js        # Rule calculations
│   └── validation.js             # Prerequisites validation
└── server/
    └── game-server.js            # HTTP server with routing
```

### Key Classes & Methods
```javascript
class SRDDataManager {
  // Complete D&D 3.5 race, class, skill, feat, equipment data
  getRaceData(raceId) { /* 8 races with abilities */ }
  getClassData(classId) { /* 11 classes with progressions */ }
  calculatePointBuyCost(score) { /* Official 28-point costs */ }
  validateFeatPrerequisites(featId, character) { /* Rule validation */ }
}

class CharacterCreator {
  // 7-step wizard implementation  
  renderStep(stepNumber) { /* Dynamic step rendering */ }
  calculateCharacterStats() { /* Real-time stat calculation */ }
  validateCharacter() { /* Complete character validation */ }
}
```

### Integration Requirements
- Server routing for character creator and SRD data
- Global window references for HTML onclick handlers
- Dual Node.js/browser compatibility for all modules
- Real-time character preview with live stat updates

### D&D 3.5 Rule Compliance
- Point buy costs: 8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=6, 15=8, 16=10, 17=13, 18=16
- BAB progressions: Full (+1/level), Medium (3/4 level), Poor (1/2 level)
- Saves: Good (2 + level/2), Poor (level/3)
- Skill points: (Class base + Int modifier) × 4 at 1st level
- Maximum skill ranks: Level + 3 (class skills), (Level + 3)/2 (cross-class)

### Testing Requirements
- Test complete character creation workflow (all 7 steps)
- Validate all D&D 3.5 calculations against SRD
- Test character save/load functionality
- Verify browser compatibility and responsive design
- Performance testing (stat calculations <100ms)
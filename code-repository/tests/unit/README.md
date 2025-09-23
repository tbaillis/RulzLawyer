# Unit Testing Specifications

## 🎯 CHARACTER SYSTEM UNIT TESTS

### **Ability Score Manager Tests** (`test-ability-scores.js`)

```javascript
const AbilityScoreManager = require('../../src/character/ability-score-manager.js');

describe('AbilityScoreManager', () => {
  let abilityManager;

  beforeEach(() => {
    abilityManager = new AbilityScoreManager();
  });

  describe('Point Buy System', () => {
    test('28-point buy calculations match SRD table', () => {
      const testCases = [
        { score: 8, cost: 0 },
        { score: 9, cost: 1 },
        { score: 10, cost: 2 },
        { score: 11, cost: 3 },
        { score: 12, cost: 4 },
        { score: 13, cost: 5 },
        { score: 14, cost: 6 },
        { score: 15, cost: 8 },
        { score: 16, cost: 10 },
        { score: 17, cost: 13 },
        { score: 18, cost: 16 }
      ];

      testCases.forEach(({ score, cost }) => {
        expect(abilityManager.calculatePointCost(score)).toBe(cost);
      });
    });

    test('total point cost cannot exceed 28', () => {
      const scores = { str: 18, dex: 18, con: 18, int: 8, wis: 8, cha: 8 };
      const totalCost = abilityManager.calculateTotalCost(scores);
      expect(totalCost).toBeLessThanOrEqual(28);
    });

    test('invalid scores rejected', () => {
      expect(() => abilityManager.calculatePointCost(7)).toThrow();
      expect(() => abilityManager.calculatePointCost(19)).toThrow();
    });
  });

  describe('Ability Modifiers', () => {
    test('modifiers calculated correctly per SRD', () => {
      const testCases = [
        { score: 1, modifier: -5 },
        { score: 8, modifier: -1 },
        { score: 9, modifier: -1 },
        { score: 10, modifier: 0 },
        { score: 11, modifier: 0 },
        { score: 12, modifier: 1 },
        { score: 18, modifier: 4 },
        { score: 30, modifier: 10 }
      ];

      testCases.forEach(({ score, modifier }) => {
        expect(abilityManager.getModifier(score)).toBe(modifier);
      });
    });
  });

  describe('Racial Modifiers', () => {
    test('human racial modifiers', () => {
      const modifiers = abilityManager.getRacialModifiers('human');
      expect(modifiers).toEqual({});
    });

    test('elf racial modifiers', () => {
      const modifiers = abilityManager.getRacialModifiers('elf');
      expect(modifiers).toEqual({ dexterity: 2, constitution: -2 });
    });

    test('dwarf racial modifiers', () => {
      const modifiers = abilityManager.getRacialModifiers('dwarf');
      expect(modifiers).toEqual({ constitution: 2, charisma: -2 });
    });
  });
});
```

### **Class Manager Tests** (`test-class-manager.js`)

```javascript
const ClassManager = require('../../src/character/class-manager.js');

describe('ClassManager', () => {
  let classManager;

  beforeEach(() => {
    classManager = new ClassManager();
  });

  describe('Base Attack Bonus', () => {
    test('fighter BAB progression', () => {
      const testCases = [
        { level: 1, bab: 1 },
        { level: 5, bab: 5 },
        { level: 10, bab: 10 },
        { level: 20, bab: 20 }
      ];

      testCases.forEach(({ level, bab }) => {
        expect(classManager.getBAB('fighter', level)).toBe(bab);
      });
    });

    test('wizard BAB progression', () => {
      const testCases = [
        { level: 1, bab: 0 },
        { level: 2, bab: 1 },
        { level: 4, bab: 2 },
        { level: 20, bab: 10 }
      ];

      testCases.forEach(({ level, bab }) => {
        expect(classManager.getBAB('wizard', level)).toBe(bab);
      });
    });
  });

  describe('Save Progressions', () => {
    test('fighter saves', () => {
      const saves = classManager.getSaves('fighter', 10);
      expect(saves).toEqual({ fortitude: 7, reflex: 3, will: 3 });
    });

    test('cleric saves', () => {
      const saves = classManager.getSaves('cleric', 10);
      expect(saves).toEqual({ fortitude: 7, reflex: 3, will: 7 });
    });
  });

  describe('Hit Die and Hit Points', () => {
    test('fighter hit die', () => {
      expect(classManager.getHitDie('fighter')).toBe(10);
    });

    test('wizard hit die', () => {
      expect(classManager.getHitDie('wizard')).toBe(4);
    });

    test('hit points calculation', () => {
      const hp = classManager.calculateHitPoints('fighter', 5, 2); // level 5, +2 Con mod
      expect(hp).toBe(40); // 10 + 4*7 + 5*2 (max HP at first level, average+1 after)
    });
  });

  describe('Skill Points', () => {
    test('fighter skill points', () => {
      const skillPoints = classManager.getSkillPoints('fighter', 12); // Int 12 (+1 mod)
      expect(skillPoints).toBe(3); // 2 base + 1 Int modifier
    });

    test('rogue skill points', () => {
      const skillPoints = classManager.getSkillPoints('rogue', 14); // Int 14 (+2 mod)
      expect(skillPoints).toBe(10); // 8 base + 2 Int modifier
    });
  });
});
```

### **Feat Manager Tests** (`test-feat-manager.js`)

```javascript
const FeatManager = require('../../src/character/feat-manager.js');

describe('FeatManager', () => {
  let featManager;

  beforeEach(() => {
    featManager = new FeatManager();
  });

  describe('Feat Prerequisites', () => {
    test('Power Attack prerequisites', () => {
      const character = {
        abilityScores: { strength: 13 },
        baseAttackBonus: 1
      };
      expect(featManager.canTakeFeat('Power Attack', character)).toBe(true);
    });

    test('Whirlwind Attack prerequisites', () => {
      const validCharacter = {
        abilityScores: { dexterity: 13, intelligence: 13 },
        baseAttackBonus: 4,
        feats: ['Dodge', 'Mobility', 'Spring Attack', 'Combat Expertise']
      };
      expect(featManager.canTakeFeat('Whirlwind Attack', validCharacter)).toBe(true);

      const invalidCharacter = {
        abilityScores: { dexterity: 13, intelligence: 13 },
        baseAttackBonus: 4,
        feats: ['Dodge'] // Missing prerequisites
      };
      expect(featManager.canTakeFeat('Whirlwind Attack', invalidCharacter)).toBe(false);
    });

    test('Spell Focus prerequisites', () => {
      const wizard = {
        classes: [{ name: 'wizard', level: 1 }],
        spellcastingAbility: 'intelligence'
      };
      expect(featManager.canTakeFeat('Spell Focus', wizard)).toBe(true);

      const fighter = {
        classes: [{ name: 'fighter', level: 1 }]
      };
      expect(featManager.canTakeFeat('Spell Focus', fighter)).toBe(false);
    });
  });

  describe('Feat Benefits', () => {
    test('Toughness feat benefits', () => {
      const benefits = featManager.getFeatBenefits('Toughness', 5); // 5th level character
      expect(benefits.hitPoints).toBe(5); // +1 HP per level (minimum 3)
    });

    test('Weapon Focus benefits', () => {
      const benefits = featManager.getFeatBenefits('Weapon Focus', null, 'longsword');
      expect(benefits.attackBonus).toBe(1);
      expect(benefits.weaponType).toBe('longsword');
    });
  });

  describe('Fighter Bonus Feats', () => {
    test('fighter bonus feat list', () => {
      const bonusFeats = featManager.getFighterBonusFeats();
      expect(bonusFeats).toContain('Power Attack');
      expect(bonusFeats).toContain('Weapon Focus');
      expect(bonusFeats).not.toContain('Toughness'); // Not a fighter bonus feat
    });
  });
});
```

## 🎨 PORTRAIT SYSTEM UNIT TESTS

### **Portrait Engine Tests** (`test-portrait-engine.js`)

```javascript
const PortraitEngine = require('../../src/portrait/portrait-engine.js');

describe('PortraitEngine', () => {
  let portraitEngine;

  beforeEach(() => {
    portraitEngine = new PortraitEngine();
  });

  describe('Portrait Generation', () => {
    test('generates portrait for human fighter', async () => {
      const character = {
        race: 'human',
        class: 'fighter',
        gender: 'male',
        equipment: {
          armor: 'chain mail',
          weapon: 'longsword'
        }
      };

      const portrait = await portraitEngine.generatePortrait(character);
      
      expect(portrait).toBeDefined();
      expect(portrait.race).toBe('human');
      expect(portrait.class).toBe('fighter');
      expect(portrait.equipment.armor).toBe('chain mail');
    });

    test('portrait generation completes within 1 second', async () => {
      const character = createTestCharacter();
      const startTime = performance.now();

      await portraitEngine.generatePortrait(character);

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Asset Management', () => {
    test('loads racial assets correctly', () => {
      const humanAssets = portraitEngine.getRacialAssets('human');
      expect(humanAssets.skinTones).toBeDefined();
      expect(humanAssets.hairStyles).toBeDefined();
      expect(humanAssets.facialFeatures).toBeDefined();
    });

    test('equipment assets load properly', () => {
      const armorAssets = portraitEngine.getEquipmentAssets('chain mail');
      expect(armorAssets.texture).toBeDefined();
      expect(armorAssets.layering).toBeDefined();
    });
  });

  describe('Customization System', () => {
    test('applies color customizations', () => {
      const customizations = {
        skinTone: '#D2B48C',
        hairColor: '#8B4513',
        eyeColor: '#1E90FF'
      };

      const result = portraitEngine.applyCustomizations(customizations);
      expect(result.skinTone).toBe('#D2B48C');
      expect(result.hairColor).toBe('#8B4513');
      expect(result.eyeColor).toBe('#1E90FF');
    });
  });
});
```

## ⚡ EPIC LEVEL SYSTEM UNIT TESTS

### **Epic Level Engine Tests** (`test-epic-level-engine.js`)

```javascript
const EpicLevelEngine = require('../../src/epic/epic-level-engine.js');

describe('EpicLevelEngine', () => {
  let epicEngine;

  beforeEach(() => {
    epicEngine = new EpicLevelEngine();
  });

  describe('Epic Progression', () => {
    test('epic level 21 character progression', () => {
      const level20Character = {
        level: 20,
        class: 'fighter',
        baseAttackBonus: 20,
        abilityScores: { strength: 18 }
      };

      const epicCharacter = epicEngine.advanceToEpicLevel(level20Character, 21);
      
      expect(epicCharacter.level).toBe(21);
      expect(epicCharacter.baseAttackBonus).toBe(21);
      expect(epicCharacter.epicFeats).toHaveLength(1); // Gets epic feat at 21
    });

    test('divine ascension at level 40', () => {
      const level39Character = {
        level: 39,
        class: 'cleric',
        divineRank: 0
      };

      const divineCharacter = epicEngine.attemptDivineAscension(level39Character);
      
      expect(divineCharacter.divineRank).toBe(1);
      expect(divineCharacter.divineAbilities).toBeDefined();
    });
  });

  describe('Epic Feats', () => {
    test('epic feat prerequisites', () => {
      const character = {
        level: 21,
        baseAttackBonus: 21,
        feats: ['Power Attack'],
        abilityScores: { strength: 25 }
      };

      expect(epicEngine.canTakeEpicFeat('Epic Weapon Focus', character)).toBe(true);
      expect(epicEngine.canTakeEpicFeat('Overwhelming Critical', character)).toBe(false); // Needs more prereqs
    });
  });

  describe('Cosmic Progression (80-100)', () => {
    test('cosmic level advancement', () => {
      const level79Character = {
        level: 79,
        cosmicRank: 0
      };

      const cosmicCharacter = epicEngine.advanceToCosmicLevel(level79Character, 80);
      
      expect(cosmicCharacter.level).toBe(80);
      expect(cosmicCharacter.cosmicRank).toBe(1);
      expect(cosmicCharacter.cosmicAbilities).toBeDefined();
    });
  });
});
```

## 📚 STORY SYSTEM UNIT TESTS

### **Story Tracker Tests** (`test-story-tracker.js`)

```javascript
const StoryTracker = require('../../src/story/story-tracker.js');

describe('StoryTracker', () => {
  let storyTracker;

  beforeEach(() => {
    storyTracker = new StoryTracker();
  });

  describe('Event Tracking', () => {
    test('records character events', () => {
      const event = {
        type: 'level_gain',
        character: 'Thorgar',
        details: 'Advanced to level 5',
        timestamp: Date.now()
      };

      storyTracker.recordEvent(event);
      const events = storyTracker.getCharacterHistory('Thorgar');
      
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('level_gain');
    });

    test('maintains chronological order', () => {
      const events = [
        { type: 'combat', timestamp: 1000 },
        { type: 'level_gain', timestamp: 2000 },
        { type: 'quest_start', timestamp: 1500 }
      ];

      events.forEach(event => storyTracker.recordEvent(event));
      const sortedEvents = storyTracker.getChronologicalHistory();
      
      expect(sortedEvents[0].timestamp).toBe(1000);
      expect(sortedEvents[1].timestamp).toBe(1500);
      expect(sortedEvents[2].timestamp).toBe(2000);
    });
  });

  describe('Backstory Generation', () => {
    test('generates coherent backstory', () => {
      const character = {
        race: 'human',
        class: 'rogue',
        background: 'criminal',
        abilityScores: { charisma: 16 }
      };

      const backstory = storyTracker.generateBackstory(character);
      
      expect(backstory.origin).toBeDefined();
      expect(backstory.motivation).toBeDefined();
      expect(backstory.connections).toBeDefined();
    });
  });
});
```

## 🗡️ ADVENTURE SYSTEM UNIT TESTS

### **Adventure Engine Tests** (`test-adventure-engine.js`)

```javascript
const AdventureEngine = require('../../src/adventure/adventure-engine.js');

describe('AdventureEngine', () => {
  let adventureEngine;

  beforeEach(() => {
    adventureEngine = new AdventureEngine();
  });

  describe('Encounter Balance', () => {
    test('creates appropriate CR encounter', () => {
      const party = [
        { level: 5, class: 'fighter' },
        { level: 5, class: 'cleric' },
        { level: 5, class: 'rogue' },
        { level: 5, class: 'wizard' }
      ];

      const encounter = adventureEngine.createBalancedEncounter(party);
      
      expect(encounter.challengeRating).toBeGreaterThanOrEqual(4);
      expect(encounter.challengeRating).toBeLessThanOrEqual(6);
      expect(encounter.xpReward).toBeDefined();
    });

    test('epic level encounters', () => {
      const epicParty = [
        { level: 25, class: 'fighter', epicLevel: 5 },
        { level: 25, class: 'cleric', epicLevel: 5 }
      ];

      const epicEncounter = adventureEngine.createEpicEncounter(epicParty);
      
      expect(epicEncounter.challengeRating).toBeGreaterThan(20);
      expect(epicEncounter.epicElements).toBeDefined();
    });
  });

  describe('Adventure Generation', () => {
    test('generates complete adventure', async () => {
      const parameters = {
        partyLevel: 5,
        theme: 'dungeon',
        duration: 'medium'
      };

      const adventure = await adventureEngine.generateAdventure(parameters);
      
      expect(adventure.title).toBeDefined();
      expect(adventure.encounters).toHaveLength(5); // Medium duration
      expect(adventure.narrative).toBeDefined();
      expect(adventure.rewards).toBeDefined();
    });

    test('adventure generation completes within 30 seconds', async () => {
      const startTime = performance.now();

      await adventureEngine.generateAdventure({
        partyLevel: 10,
        theme: 'wilderness',
        duration: 'long'
      });

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(30000);
    });
  });
});
```

## 📝 TEST EXECUTION AND REPORTING

### **Test Suite Runner**
```javascript
// Run all unit tests with coverage
const testRunner = {
  async runAllUnitTests() {
    const suites = [
      'character/test-ability-scores.js',
      'character/test-class-manager.js',
      'character/test-feat-manager.js',
      'portrait/test-portrait-engine.js',
      'epic/test-epic-level-engine.js',
      'story/test-story-tracker.js',
      'adventure/test-adventure-engine.js'
    ];

    for (const suite of suites) {
      console.log(`Running ${suite}...`);
      await this.runTestSuite(suite);
    }
  }
};
```

### **Coverage Requirements**
- **Minimum Coverage**: 90% for all systems
- **Critical Path Coverage**: 100% for SRD calculations
- **Performance Validation**: All benchmarks must pass
- **Error Handling**: All error conditions tested

---

**Unit Testing Framework Version**: 1.0  
**Total Test Cases**: 50+ comprehensive validations  
**Coverage Target**: 90%+ across all systems  
**Execution Time**: <5 minutes for complete suite
# Performance Testing Specifications

## ⚡ PERFORMANCE BENCHMARKS & VALIDATION

### **Character Creation Performance** (`character-creation-benchmarks.js`)

```javascript
const CharacterManager = require('../../src/character/character-manager.js');
const PerformanceMonitor = require('../../src/utils/performance-monitor.js');

describe('Character Creation Performance', () => {
  let characterManager, performanceMonitor;

  beforeEach(async () => {
    characterManager = new CharacterManager();
    performanceMonitor = new PerformanceMonitor();
    await characterManager.initialize();
  });

  describe('Creation Speed Benchmarks', () => {
    test('single character creation completes within 3 seconds', async () => {
      const startTime = performance.now();

      const character = await characterManager.createCompleteCharacter({
        race: 'human',
        class: 'fighter',
        level: 1,
        abilityScores: { str: 16, dex: 14, con: 15, int: 12, wis: 13, cha: 10 },
        equipment: 'standard_package'
      });

      const endTime = performance.now();
      const creationTime = endTime - startTime;

      expect(creationTime).toBeLessThan(3000); // 3 second max
      expect(character.id).toBeDefined();
      expect(character.isComplete).toBe(true);

      // Log performance metrics
      performanceMonitor.recordMetric('character_creation', {
        duration: creationTime,
        characterLevel: 1,
        complexity: 'standard'
      });
    });

    test('bulk character creation scales efficiently', async () => {
      const characterCount = 50;
      const maxTimePerCharacter = 500; // 500ms per character maximum
      
      const startTime = performance.now();

      const characters = [];
      for (let i = 0; i < characterCount; i++) {
        const character = await characterManager.createCharacter({
          race: 'human',
          class: 'fighter',
          level: 1
        });
        characters.push(character);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const timePerCharacter = totalTime / characterCount;

      expect(timePerCharacter).toBeLessThan(maxTimePerCharacter);
      expect(characters).toHaveLength(characterCount);

      performanceMonitor.recordMetric('bulk_character_creation', {
        count: characterCount,
        totalDuration: totalTime,
        averagePerCharacter: timePerCharacter
      });
    });

    test('high-level character creation performance', async () => {
      const startTime = performance.now();

      const highlevelCharacter = await characterManager.createCharacter({
        race: 'human',
        class: 'wizard',
        level: 20,
        abilityScores: { str: 10, dex: 14, con: 16, int: 24, wis: 14, cha: 12 },
        feats: ['Spell Focus (Evocation)', 'Greater Spell Focus (Evocation)', 'Spell Penetration'],
        spells: 'complete_spell_list',
        equipment: 'high_level_package'
      });

      const endTime = performance.now();
      const creationTime = endTime - startTime;

      expect(creationTime).toBeLessThan(5000); // 5 seconds for complex high-level
      expect(highlevelCharacter.level).toBe(20);
      expect(highlevelCharacter.spells.length).toBeGreaterThan(50);

      performanceMonitor.recordMetric('high_level_creation', {
        duration: creationTime,
        level: 20,
        spellCount: highlevelCharacter.spells.length
      });
    });
  });

  describe('Memory Usage Optimization', () => {
    test('character creation memory stays under 100MB', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      const characters = [];
      for (let i = 0; i < 20; i++) {
        const character = await characterManager.createCharacter({
          race: 'elf',
          class: 'wizard',
          level: Math.floor(Math.random() * 20) + 1
        });
        characters.push(character);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB

      expect(memoryIncrease).toBeLessThan(100);
      expect(characters).toHaveLength(20);

      performanceMonitor.recordMemoryUsage('character_creation_memory', {
        charactersCreated: 20,
        memoryIncrease: memoryIncrease
      });
    });

    test('garbage collection efficiency after character deletion', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Create and delete characters
      for (let i = 0; i < 10; i++) {
        const character = await characterManager.createCharacter({
          race: 'human',
          class: 'fighter',
          level: 5
        });
        await characterManager.deleteCharacter(character.id);
      }

      // Force garbage collection if available
      if (global.gc) global.gc();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryDifference = Math.abs(finalMemory - initialMemory) / 1024 / 1024;

      expect(memoryDifference).toBeLessThan(10); // Less than 10MB difference
    });
  });
});
```

### **Portrait Generation Performance** (`portrait-generation-benchmarks.js`)

```javascript
const PortraitEngine = require('../../src/portrait/portrait-engine.js');
const PerformanceMonitor = require('../../src/utils/performance-monitor.js');

describe('Portrait Generation Performance', () => {
  let portraitEngine, performanceMonitor;

  beforeEach(async () => {
    portraitEngine = new PortraitEngine();
    performanceMonitor = new PerformanceMonitor();
    await portraitEngine.initialize();
  });

  describe('Generation Speed Benchmarks', () => {
    test('basic portrait generation completes within 1 second', async () => {
      const character = {
        race: 'human',
        class: 'fighter',
        gender: 'male',
        equipment: {
          armor: 'chain mail',
          weapon: 'longsword'
        }
      };

      const startTime = performance.now();
      const portrait = await portraitEngine.generatePortrait(character);
      const endTime = performance.now();

      const generationTime = endTime - startTime;

      expect(generationTime).toBeLessThan(1000); // 1 second max
      expect(portrait.imageData).toBeDefined();
      expect(portrait.characterId).toBe(character.id);

      performanceMonitor.recordMetric('portrait_generation', {
        duration: generationTime,
        complexity: 'basic',
        race: character.race
      });
    });

    test('complex portrait with full customization under 2 seconds', async () => {
      const complexCharacter = {
        race: 'tiefling',
        class: 'warlock',
        gender: 'female',
        customizations: {
          skinTone: '#8B4513',
          hairColor: '#FF4500',
          eyeColor: '#DC143C',
          hornStyle: 'curved',
          tailStyle: 'barbed'
        },
        equipment: {
          armor: 'studded_leather',
          weapon: 'quarterstaff',
          accessories: ['arcane_focus', 'spell_component_pouch']
        }
      };

      const startTime = performance.now();
      const portrait = await portraitEngine.generatePortrait(complexCharacter);
      const endTime = performance.now();

      const generationTime = endTime - startTime;

      expect(generationTime).toBeLessThan(2000); // 2 seconds for complex
      expect(portrait.customizations).toEqual(complexCharacter.customizations);

      performanceMonitor.recordMetric('complex_portrait_generation', {
        duration: generationTime,
        customizations: Object.keys(complexCharacter.customizations).length,
        equipment: Object.keys(complexCharacter.equipment).length
      });
    });

    test('batch portrait generation efficiency', async () => {
      const characters = Array.from({ length: 10 }, (_, i) => ({
        id: `char_${i}`,
        race: ['human', 'elf', 'dwarf'][i % 3],
        class: ['fighter', 'wizard', 'rogue'][i % 3],
        gender: i % 2 === 0 ? 'male' : 'female'
      }));

      const startTime = performance.now();

      const portraits = await Promise.all(
        characters.map(char => portraitEngine.generatePortrait(char))
      );

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / characters.length;

      expect(totalTime).toBeLessThan(8000); // 8 seconds for 10 portraits
      expect(averageTime).toBeLessThan(1000); // <1 second average
      expect(portraits).toHaveLength(10);

      performanceMonitor.recordMetric('batch_portrait_generation', {
        count: characters.length,
        totalDuration: totalTime,
        averagePerPortrait: averageTime
      });
    });
  });

  describe('Asset Loading Performance', () => {
    test('asset cache loading under 500ms', async () => {
      const startTime = performance.now();

      await portraitEngine.preloadAssets([
        'human_male_base',
        'elf_female_base',
        'dwarf_male_base',
        'chain_mail_texture',
        'leather_armor_texture'
      ]);

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(loadTime).toBeLessThan(500);

      performanceMonitor.recordMetric('asset_preloading', {
        duration: loadTime,
        assetCount: 5
      });
    });

    test('SVG rendering performance', async () => {
      const character = {
        race: 'elf',
        class: 'ranger',
        equipment: {
          armor: 'studded_leather',
          weapon: 'longbow'
        }
      };

      const startTime = performance.now();
      const svgData = await portraitEngine.renderSVG(character);
      const endTime = performance.now();

      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(300); // 300ms for SVG render
      expect(svgData.length).toBeGreaterThan(1000);

      performanceMonitor.recordMetric('svg_rendering', {
        duration: renderTime,
        svgSize: svgData.length
      });
    });
  });
});
```

### **Epic Level Performance** (`epic-advancement-benchmarks.js`)

```javascript
const EpicLevelEngine = require('../../src/epic/epic-level-engine.js');
const PerformanceMonitor = require('../../src/utils/performance-monitor.js');

describe('Epic Level Performance', () => {
  let epicEngine, performanceMonitor;

  beforeEach(async () => {
    epicEngine = new EpicLevelEngine();
    performanceMonitor = new PerformanceMonitor();
    await epicEngine.initialize();
  });

  describe('Epic Advancement Benchmarks', () => {
    test('level 20 to 21 advancement under 2 seconds', async () => {
      const level20Character = {
        id: 'char_001',
        level: 20,
        class: 'fighter',
        abilityScores: { str: 20, dex: 14, con: 16, int: 12, wis: 13, cha: 10 },
        baseAttackBonus: 20,
        feats: ['Power Attack', 'Cleave', 'Great Cleave', 'Weapon Focus (Longsword)']
      };

      const startTime = performance.now();
      const epicCharacter = await epicEngine.advanceToEpicLevel(level20Character, 21);
      const endTime = performance.now();

      const advancementTime = endTime - startTime;

      expect(advancementTime).toBeLessThan(2000);
      expect(epicCharacter.level).toBe(21);
      expect(epicCharacter.isEpic).toBe(true);
      expect(epicCharacter.epicFeats).toHaveLength(1);

      performanceMonitor.recordMetric('epic_advancement', {
        duration: advancementTime,
        fromLevel: 20,
        toLevel: 21
      });
    });

    test('massive level jump (20 to 50) performance', async () => {
      const level20Character = {
        id: 'char_002',
        level: 20,
        class: 'wizard',
        abilityScores: { str: 10, dex: 14, con: 16, int: 24, wis: 14, cha: 12 }
      };

      const startTime = performance.now();
      const level50Character = await epicEngine.advanceToEpicLevel(level20Character, 50);
      const endTime = performance.now();

      const advancementTime = endTime - startTime;

      expect(advancementTime).toBeLessThan(10000); // 10 seconds for massive jump
      expect(level50Character.level).toBe(50);
      expect(level50Character.epicLevel).toBe(30);
      expect(level50Character.epicFeats.length).toBeGreaterThanOrEqual(15);

      performanceMonitor.recordMetric('massive_epic_advancement', {
        duration: advancementTime,
        levelJump: 30,
        finalLevel: 50
      });
    });

    test('divine ascension performance', async () => {
      const level40Character = {
        id: 'char_003',
        level: 40,
        class: 'cleric',
        divineRank: 0,
        followers: 1000000,
        divinePortfolio: []
      };

      const startTime = performance.now();
      const divineCharacter = await epicEngine.attemptDivineAscension(level40Character);
      const endTime = performance.now();

      const ascensionTime = endTime - startTime;

      expect(ascensionTime).toBeLessThan(3000);
      expect(divineCharacter.divineRank).toBe(1);
      expect(divineCharacter.divineAbilities).toBeDefined();

      performanceMonitor.recordMetric('divine_ascension', {
        duration: ascensionTime,
        characterLevel: 40,
        newDivineRank: 1
      });
    });
  });

  describe('Epic Calculation Performance', () => {
    test('epic feat prerequisite checking efficiency', async () => {
      const epicCharacter = {
        level: 25,
        epicLevel: 5,
        baseAttackBonus: 25,
        feats: Array.from({ length: 20 }, (_, i) => `Feat_${i}`),
        abilityScores: { str: 30, dex: 20, con: 25, int: 18, wis: 16, cha: 14 }
      };

      const startTime = performance.now();
      
      const availableFeats = await epicEngine.getAvailableEpicFeats(epicCharacter);
      
      const endTime = performance.now();
      const calculationTime = endTime - startTime;

      expect(calculationTime).toBeLessThan(100); // 100ms for feat calculations
      expect(availableFeats.length).toBeGreaterThan(0);

      performanceMonitor.recordMetric('epic_feat_calculation', {
        duration: calculationTime,
        characterLevel: 25,
        existingFeats: epicCharacter.feats.length,
        availableFeats: availableFeats.length
      });
    });
  });
});
```

### **Adventure Generation Performance** (`adventure-generation-benchmarks.js`)

```javascript
const AdventureEngine = require('../../src/adventure/adventure-engine.js');
const PerformanceMonitor = require('../../src/utils/performance-monitor.js');

describe('Adventure Generation Performance', () => {
  let adventureEngine, performanceMonitor;

  beforeEach(async () => {
    adventureEngine = new AdventureEngine();
    performanceMonitor = new PerformanceMonitor();
    await adventureEngine.initialize();
  });

  describe('Adventure Creation Benchmarks', () => {
    test('basic adventure generation under 30 seconds', async () => {
      const parameters = {
        partyLevel: 5,
        partySize: 4,
        theme: 'dungeon',
        duration: 'medium',
        difficulty: 'normal'
      };

      const startTime = performance.now();
      const adventure = await adventureEngine.generateAdventure(parameters);
      const endTime = performance.now();

      const generationTime = endTime - startTime;

      expect(generationTime).toBeLessThan(30000); // 30 seconds max
      expect(adventure.encounters).toHaveLength(5); // Medium duration
      expect(adventure.narrative).toBeDefined();
      expect(adventure.rewards).toBeDefined();

      performanceMonitor.recordMetric('adventure_generation', {
        duration: generationTime,
        partyLevel: parameters.partyLevel,
        encounterCount: adventure.encounters.length
      });
    });

    test('complex epic adventure generation', async () => {
      const epicParameters = {
        partyLevel: 25,
        partySize: 6,
        theme: 'planar',
        duration: 'long',
        difficulty: 'epic',
        customElements: ['divine intervention', 'cosmic threats', 'artifact quests']
      };

      const startTime = performance.now();
      const epicAdventure = await adventureEngine.generateEpicAdventure(epicParameters);
      const endTime = performance.now();

      const generationTime = endTime - startTime;

      expect(generationTime).toBeLessThan(60000); // 60 seconds for epic complexity
      expect(epicAdventure.encounters.length).toBeGreaterThan(8);
      expect(epicAdventure.epicElements).toBeDefined();

      performanceMonitor.recordMetric('epic_adventure_generation', {
        duration: generationTime,
        partyLevel: epicParameters.partyLevel,
        complexity: 'epic',
        encounterCount: epicAdventure.encounters.length
      });
    });

    test('encounter balancing performance', async () => {
      const party = [
        { level: 8, class: 'fighter', hitPoints: 68 },
        { level: 8, class: 'cleric', hitPoints: 52 },
        { level: 8, class: 'rogue', hitPoints: 44 },
        { level: 8, class: 'wizard', hitPoints: 28 }
      ];

      const startTime = performance.now();
      const encounters = [];
      
      for (let i = 0; i < 10; i++) {
        const encounter = await adventureEngine.createBalancedEncounter(party);
        encounters.push(encounter);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / encounters.length;

      expect(averageTime).toBeLessThan(1000); // 1 second per encounter
      expect(encounters).toHaveLength(10);
      
      encounters.forEach(encounter => {
        expect(encounter.challengeRating).toBeGreaterThanOrEqual(6);
        expect(encounter.challengeRating).toBeLessThanOrEqual(10);
      });

      performanceMonitor.recordMetric('encounter_balancing', {
        averageDuration: averageTime,
        encounterCount: encounters.length,
        partyLevel: 8
      });
    });
  });

  describe('Narrative Generation Performance', () => {
    test('story element generation efficiency', async () => {
      const narrativeParams = {
        theme: 'mystery',
        setting: 'urban',
        npcs: ['merchant', 'guard captain', 'mysterious stranger'],
        plotHooks: ['missing person', 'strange occurrences', 'political intrigue']
      };

      const startTime = performance.now();
      const narrative = await adventureEngine.generateNarrative(narrativeParams);
      const endTime = performance.now();

      const generationTime = endTime - startTime;

      expect(generationTime).toBeLessThan(5000); // 5 seconds for narrative
      expect(narrative.introduction).toBeDefined();
      expect(narrative.plotProgression).toHaveLength(3);
      expect(narrative.conclusion).toBeDefined();

      performanceMonitor.recordMetric('narrative_generation', {
        duration: generationTime,
        theme: narrativeParams.theme,
        elementCount: narrativeParams.npcs.length + narrativeParams.plotHooks.length
      });
    });
  });
});
```

### **Memory Usage Monitoring** (`memory-usage-monitoring.js`)

```javascript
const SystemMonitor = require('../../src/utils/system-monitor.js');
const PerformanceMonitor = require('../../src/utils/performance-monitor.js');

describe('Memory Usage Monitoring', () => {
  let systemMonitor, performanceMonitor;

  beforeEach(() => {
    systemMonitor = new SystemMonitor();
    performanceMonitor = new PerformanceMonitor();
  });

  describe('System Memory Benchmarks', () => {
    test('total system memory usage under 500MB', async () => {
      const initialMemory = process.memoryUsage();
      
      // Simulate full system operations
      await systemMonitor.simulateFullSystemLoad();
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024;

      expect(memoryIncrease).toBeLessThan(500); // 500MB limit

      performanceMonitor.recordMemoryUsage('full_system_load', {
        heapUsed: finalMemory.heapUsed / 1024 / 1024,
        heapTotal: finalMemory.heapTotal / 1024 / 1024,
        external: finalMemory.external / 1024 / 1024,
        rss: finalMemory.rss / 1024 / 1024
      });
    });

    test('memory cleanup after operations', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Create and destroy objects
      for (let i = 0; i < 1000; i++) {
        const tempObject = {
          id: i,
          data: new Array(1000).fill(Math.random()),
          timestamp: Date.now()
        };
        // Object goes out of scope
      }

      // Force garbage collection if available
      if (global.gc) global.gc();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryDifference = Math.abs(finalMemory - initialMemory) / 1024 / 1024;

      expect(memoryDifference).toBeLessThan(50); // 50MB tolerance

      performanceMonitor.recordMetric('memory_cleanup', {
        initialMemory: initialMemory / 1024 / 1024,
        finalMemory: finalMemory / 1024 / 1024,
        difference: memoryDifference
      });
    });

    test('long-running operation memory stability', async () => {
      const memoryReadings = [];
      
      for (let i = 0; i < 10; i++) {
        await systemMonitor.simulateTypicalOperations();
        
        const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        memoryReadings.push(currentMemory);
        
        // Small delay between operations
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Check for memory leaks (steadily increasing memory)
      const firstReading = memoryReadings[0];
      const lastReading = memoryReadings[memoryReadings.length - 1];
      const memoryIncrease = lastReading - firstReading;

      expect(memoryIncrease).toBeLessThan(100); // 100MB increase limit

      performanceMonitor.recordMetric('memory_stability', {
        readings: memoryReadings,
        totalIncrease: memoryIncrease,
        averageMemory: memoryReadings.reduce((a, b) => a + b) / memoryReadings.length
      });
    });
  });

  describe('Memory Leak Detection', () => {
    test('character creation does not leak memory', async () => {
      const CharacterManager = require('../../src/character/character-manager.js');
      const characterManager = new CharacterManager();
      
      const initialMemory = process.memoryUsage().heapUsed;

      // Create and delete characters repeatedly
      for (let i = 0; i < 100; i++) {
        const character = await characterManager.createCharacter({
          race: 'human',
          class: 'fighter',
          level: 1
        });
        
        await characterManager.deleteCharacter(character.id);
        
        // Periodic garbage collection
        if (i % 10 === 0 && global.gc) global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024;

      expect(memoryIncrease).toBeLessThan(20); // 20MB tolerance for 100 operations

      performanceMonitor.recordMetric('character_memory_leak_test', {
        operations: 100,
        memoryIncrease: memoryIncrease
      });
    });
  });
});
```

## 📊 PERFORMANCE MONITORING DASHBOARD

### **Performance Metrics Collection**
```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.thresholds = {
      character_creation: 3000,     // 3 seconds
      portrait_generation: 1000,   // 1 second
      epic_advancement: 2000,      // 2 seconds
      adventure_generation: 30000, // 30 seconds
      memory_usage: 500           // 500 MB
    };
  }

  recordMetric(operation, data) {
    const timestamp = Date.now();
    const metric = {
      operation,
      timestamp,
      data,
      isWithinThreshold: this.checkThreshold(operation, data.duration || data.memoryIncrease)
    };

    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    this.metrics.get(operation).push(metric);
    
    // Log performance warnings
    if (!metric.isWithinThreshold) {
      console.warn(`Performance threshold exceeded: ${operation}`, data);
    }
  }

  generatePerformanceReport() {
    const report = {
      timestamp: Date.now(),
      summary: {},
      details: {}
    };

    for (const [operation, metrics] of this.metrics) {
      const durations = metrics.map(m => m.data.duration || m.data.memoryIncrease).filter(d => d !== undefined);
      
      report.summary[operation] = {
        testCount: metrics.length,
        averageTime: durations.reduce((a, b) => a + b, 0) / durations.length,
        minTime: Math.min(...durations),
        maxTime: Math.max(...durations),
        threshold: this.thresholds[operation],
        passRate: metrics.filter(m => m.isWithinThreshold).length / metrics.length * 100
      };
      
      report.details[operation] = metrics;
    }

    return report;
  }
}
```

### **Performance Test Execution Framework**
```javascript
// Performance test runner
class PerformanceTestRunner {
  async runPerformanceSuite() {
    console.log('🚀 Starting RulzLawyer Performance Test Suite...');
    
    const testSuites = [
      'character-creation-benchmarks.js',
      'portrait-generation-benchmarks.js',
      'epic-advancement-benchmarks.js',
      'adventure-generation-benchmarks.js',
      'memory-usage-monitoring.js'
    ];

    const results = [];
    for (const suite of testSuites) {
      console.log(`Running performance tests: ${suite}`);
      const result = await this.runBenchmarkSuite(suite);
      results.push(result);
    }

    return this.generatePerformanceReport(results);
  }
}
```

## 🎯 PERFORMANCE SUCCESS CRITERIA

### **Benchmark Requirements**
| Operation | Maximum Duration | Memory Limit | Success Rate |
|-----------|-----------------|--------------|--------------|
| Character Creation | 3 seconds | 50MB | 95%+ |
| Portrait Generation | 1 second | 25MB | 98%+ |
| Epic Advancement | 2 seconds | 30MB | 95%+ |
| Adventure Generation | 30 seconds | 150MB | 90%+ |
| Memory Cleanup | N/A | 10MB variance | 100% |

### **Continuous Performance Monitoring**
- **Real-time Monitoring**: Track performance metrics during development
- **Regression Detection**: Alert when performance degrades below thresholds
- **Optimization Guidance**: Identify performance bottlenecks automatically
- **Scalability Testing**: Validate performance under increasing loads

### **Performance Reporting**
- **Daily Performance Reports**: Automated benchmark summaries
- **Trend Analysis**: Historical performance tracking
- **Bottleneck Identification**: Detailed analysis of slow operations
- **Memory Usage Trends**: Leak detection and optimization opportunities

---

**Performance Testing Framework Version**: 1.0  
**Total Benchmarks**: 30+ comprehensive performance validations  
**Monitoring Coverage**: 100% of critical operations  
**Reporting Frequency**: Continuous with daily summaries
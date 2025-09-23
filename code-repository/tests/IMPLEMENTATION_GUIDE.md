# Testing Framework Implementation Guide

## 🚀 IMMEDIATE IMPLEMENTATION STEPS FOR AI AGENTS

### **1. Testing Framework Setup**

```javascript
// package.json dependencies for testing
{
  "name": "rulzlawyer-testing-framework",
  "devDependencies": {
    "jest": "^29.0.0",                    // Primary testing framework
    "puppeteer": "^21.0.0",               // Browser automation testing
    "benchmark": "^2.1.4",                // Performance benchmarking
    "istanbul": "^0.4.5",                 // Code coverage analysis
    "@testing-library/dom": "^9.0.0",     // DOM testing utilities
    "jsdom": "^22.0.0",                   // DOM simulation for Node.js
    "supertest": "^6.3.0",                // HTTP endpoint testing
    "sinon": "^15.0.0"                    // Mocking and stubbing
  },
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:performance": "jest tests/performance",
    "test:srd": "jest tests/srd-compliance",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### **2. Jest Configuration** (`jest.config.js`)

```javascript
module.exports = {
  // Test environment setup
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Test file patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.spec.js'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  
  // Performance settings
  testTimeout: 30000,
  maxWorkers: 4,
  
  // Module path mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  
  // Transform configuration
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
```

### **3. Test Setup File** (`tests/setup.js`)

```javascript
// Global test setup and utilities
const { JSDOM } = require('jsdom');

// Setup DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Performance measurement utilities
global.performance = dom.window.performance;

// Test utilities
global.createTestCharacter = (overrides = {}) => {
  return {
    id: 'test_char_001',
    race: 'human',
    class: 'fighter',
    level: 1,
    abilityScores: { str: 15, dex: 14, con: 13, int: 12, wis: 11, cha: 10 },
    hitPoints: 11,
    armorClass: 16,
    baseAttackBonus: 1,
    saves: { fortitude: 2, reflex: 0, will: 0 },
    ...overrides
  };
};

global.createTestEquipment = (type = 'weapon') => {
  const equipment = {
    weapon: {
      id: 'longsword_001',
      name: 'Longsword',
      type: 'weapon',
      damage: '1d8',
      weight: 4,
      cost: '15 gp'
    },
    armor: {
      id: 'chainmail_001',
      name: 'Chain Mail',
      type: 'armor',
      armorClass: 5,
      weight: 40,
      cost: '150 gp'
    }
  };
  
  return equipment[type];
};

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  if (global.gc) global.gc();
});

// Global timeout for async operations
jest.setTimeout(30000);
```

### **4. Test Execution Commands**

```bash
# Install testing dependencies
npm install --save-dev jest puppeteer benchmark istanbul @testing-library/dom

# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration  
npm run test:performance
npm run test:srd

# Generate coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch

# CI/CD pipeline tests
npm run test:ci
```

## 🎯 CRITICAL TESTING IMPLEMENTATION PRIORITIES

### **Priority 1: SRD Compliance Tests** (MUST IMPLEMENT FIRST)
```javascript
// Create these test files immediately:
// tests/srd-compliance/ability-score-calculations.test.js
// tests/srd-compliance/character-advancement-rules.test.js
// tests/srd-compliance/combat-calculations.test.js
// tests/srd-compliance/spell-system-validation.test.js
// tests/srd-compliance/feat-prerequisite-validation.test.js
// tests/srd-compliance/epic-level-rule-compliance.test.js

// Critical SRD validation utility
class SRDValidator {
  validateRule(ruleName, expected, actual, reference) {
    if (expected !== actual) {
      throw new Error(`SRD Rule Violation: ${ruleName}
        Expected: ${expected}
        Actual: ${actual}
        Reference: ${reference}`);
    }
    return true;
  }
}
```

### **Priority 2: Unit Tests for Core Systems**
```javascript
// tests/unit/character/test-ability-scores.test.js
// tests/unit/character/test-class-manager.test.js
// tests/unit/character/test-feat-manager.test.js
// tests/unit/portrait/test-portrait-engine.test.js
// tests/unit/epic/test-epic-level-engine.test.js

// Core character system validation
describe('Character System Core', () => {
  test('character creation follows 7-step wizard', async () => {
    const character = await CharacterManager.createCompleteCharacter({
      race: 'human',
      class: 'fighter',
      abilityScores: { str: 16, dex: 14, con: 15, int: 12, wis: 13, cha: 10 }
    });
    
    expect(character).toHaveProperty('id');
    expect(character.level).toBe(1);
    expect(character.hitPoints).toBeGreaterThan(0);
  });
});
```

### **Priority 3: Integration Tests**
```javascript
// tests/integration/complete-character-workflow.test.js
// tests/integration/character-portrait-sync.test.js
// tests/integration/epic-character-progression.test.js

// End-to-end workflow validation
describe('Complete Character Workflow', () => {
  test('full character creation and advancement', async () => {
    const character = await createCompleteCharacter();
    const portrait = await generatePortrait(character);
    await advanceCharacterLevel(character, 5);
    
    expect(character.level).toBe(5);
    expect(portrait.characterId).toBe(character.id);
  });
});
```

### **Priority 4: Performance Benchmarks**
```javascript
// tests/performance/character-creation-benchmarks.test.js
// tests/performance/portrait-generation-benchmarks.test.js

// Performance validation
describe('Performance Benchmarks', () => {
  test('character creation under 3 seconds', async () => {
    const start = performance.now();
    await CharacterManager.createCompleteCharacter(testData);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(3000);
  });
});
```

## 🔧 TESTING UTILITIES AND HELPERS

### **Character Test Factory** (`tests/utils/character-factory.js`)
```javascript
class CharacterTestFactory {
  static createLevel1Fighter() {
    return {
      race: 'human',
      class: 'fighter',
      level: 1,
      abilityScores: { str: 16, dex: 14, con: 15, int: 12, wis: 13, cha: 10 },
      hitPoints: 11,
      armorClass: 16,
      baseAttackBonus: 1,
      saves: { fortitude: 2, reflex: 0, will: 0 }
    };
  }

  static createLevel20Wizard() {
    return {
      race: 'human',
      class: 'wizard',
      level: 20,
      abilityScores: { str: 10, dex: 14, con: 16, int: 24, wis: 14, cha: 12 },
      spellsPerDay: [4, 4, 4, 4, 4, 4, 4, 4, 4],
      spellbook: ['Magic Missile', 'Fireball', 'Lightning Bolt', /* ... */]
    };
  }

  static createEpicLevel25Character() {
    return {
      race: 'human',
      class: 'fighter',
      level: 25,
      epicLevel: 5,
      abilityScores: { str: 28, dex: 16, con: 20, int: 14, wis: 15, cha: 12 },
      epicFeats: ['Epic Weapon Focus', 'Epic Weapon Specialization']
    };
  }
}
```

### **Performance Monitor** (`tests/utils/performance-monitor.js`)
```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startTiming(operationName) {
    this.metrics.set(operationName, performance.now());
  }

  endTiming(operationName, threshold) {
    const startTime = this.metrics.get(operationName);
    const duration = performance.now() - startTime;
    
    if (threshold && duration > threshold) {
      throw new Error(`Performance threshold exceeded for ${operationName}: ${duration}ms > ${threshold}ms`);
    }
    
    return duration;
  }

  recordMetric(operation, duration, metadata = {}) {
    const metric = {
      operation,
      duration,
      timestamp: Date.now(),
      metadata
    };
    
    console.log(`Performance: ${operation} completed in ${duration}ms`);
    return metric;
  }
}
```

### **SRD Data Validator** (`tests/utils/srd-data.js`)
```javascript
// Official D&D 3.5 SRD reference data
const SRD_DATA = {
  pointBuyCosts: {
    8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5,
    14: 6, 15: 8, 16: 10, 17: 13, 18: 16
  },
  
  abilityModifiers: {
    1: -5, 6: -2, 8: -1, 10: 0, 12: 1, 18: 4, 30: 10
  },
  
  xpRequirements: {
    1: 0, 2: 1000, 3: 3000, 4: 6000, 5: 10000,
    10: 45000, 15: 105000, 20: 190000
  },
  
  racialModifiers: {
    human: {},
    elf: { dexterity: 2, constitution: -2 },
    dwarf: { constitution: 2, charisma: -2 },
    halfling: { dexterity: 2, strength: -2 }
  }
};

module.exports = { SRD_DATA };
```

## 📋 TEST EXECUTION WORKFLOW

### **1. Pre-Implementation Checklist**
- [ ] Install Jest and testing dependencies
- [ ] Create jest.config.js configuration
- [ ] Set up tests/setup.js with global utilities
- [ ] Create test directory structure
- [ ] Implement SRD validation utilities

### **2. Implementation Phase Testing**
- [ ] Write SRD compliance tests FIRST (before implementation)
- [ ] Implement unit tests for each system module
- [ ] Create integration tests for cross-system interactions
- [ ] Add performance benchmarks with thresholds
- [ ] Set up continuous integration pipeline

### **3. Quality Gates**
- [ ] 90%+ code coverage across all systems
- [ ] 100% SRD rule compliance
- [ ] All performance benchmarks passing
- [ ] Zero critical bugs or failures
- [ ] Complete integration test coverage

### **4. Continuous Validation**
- [ ] Run tests on every code change
- [ ] Performance monitoring in development
- [ ] Automated SRD validation
- [ ] Regular regression testing
- [ ] Documentation updates with test results

## 🎯 SUCCESS METRICS AND REPORTING

### **Testing Dashboard** (`tests/utils/test-reporter.js`)
```javascript
class TestReporter {
  generateReport(testResults) {
    return {
      summary: {
        totalTests: testResults.numTotalTests,
        passedTests: testResults.numPassedTests,
        failedTests: testResults.numFailedTests,
        coverage: testResults.coverageMap.getCoverageSummary(),
        duration: testResults.testResults[0].perfStats.runtime
      },
      
      performance: {
        characterCreation: this.getPerformanceMetrics('character_creation'),
        portraitGeneration: this.getPerformanceMetrics('portrait_generation'),
        epicAdvancement: this.getPerformanceMetrics('epic_advancement')
      },
      
      srdCompliance: {
        totalRules: this.getSRDValidationCount(),
        passedRules: this.getSRDPassCount(),
        failedRules: this.getSRDFailCount(),
        complianceRate: this.getSRDComplianceRate()
      }
    };
  }
}
```

### **Final Validation Checklist**
- [ ] **Unit Tests**: 90%+ coverage, all critical functions tested
- [ ] **Integration Tests**: All system interactions validated
- [ ] **Performance Tests**: All benchmarks under thresholds
- [ ] **SRD Compliance**: 100% D&D 3.5 rule accuracy
- [ ] **Error Handling**: All failure scenarios covered
- [ ] **Documentation**: Complete test specifications provided

---

**Implementation Priority**: CRITICAL - Implement testing framework alongside system development  
**Quality Standard**: 100% SRD compliance, 90%+ coverage, performance benchmarks met  
**Validation Frequency**: Continuous during development, comprehensive before release  
**Success Criteria**: Zero blocking issues, complete test suite passing, ready for production
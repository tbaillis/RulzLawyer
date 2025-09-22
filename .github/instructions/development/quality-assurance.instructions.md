---
description: "Quality standards, code review checklists, and D&D 3.5 compliance validation procedures"
applyTo: "**/quality/**,**/review/**,**/standards/**"
---

# Quality Assurance and Standards Guidelines

## 🎯 D&D 3.5 SRD Compliance Standards

### Rule Accuracy Requirements
**Critical:** Every calculation must match official D&D 3.5 System Reference Document exactly.

#### Ability Score Calculations
```javascript
// REQUIRED: Exact D&D 3.5 ability modifier calculation
function calculateAbilityModifier(score) {
    // SRD Standard: (Score - 10) / 2, rounded down
    return Math.floor((score - 10) / 2);
}

// Validation test cases (MANDATORY)
const abilityModifierTests = [
    { score: 1, expected: -5 },   { score: 8, expected: -1 },
    { score: 9, expected: -1 },   { score: 10, expected: 0 },
    { score: 11, expected: 0 },   { score: 12, expected: 1 },
    { score: 18, expected: 4 },   { score: 20, expected: 5 }
];
```

#### Point Buy System Compliance
```javascript
// REQUIRED: Official D&D 3.5 point buy costs
const OFFICIAL_POINT_BUY_COSTS = {
    8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5,
    14: 6, 15: 8, 16: 10, 17: 13, 18: 16
};

// Validation: Must reject invalid builds
function validatePointBuyCompliance(abilities, budget = 28) {
    const totalCost = Object.values(abilities).reduce((sum, score) => 
        sum + OFFICIAL_POINT_BUY_COSTS[score], 0
    );
    
    if (totalCost > budget) {
        return { valid: false, reason: `Cost ${totalCost} exceeds budget ${budget}` };
    }
    
    return { valid: true, cost: totalCost, remaining: budget - totalCost };
}
```

#### Class Progression Accuracy
```javascript
// REQUIRED: Exact BAB progressions from SRD
const BAB_PROGRESSIONS = {
    full: level => level,                    // Fighter, Paladin, Ranger
    medium: level => Math.floor(level * 3 / 4),  // Cleric, Druid, Monk, Rogue
    poor: level => Math.floor(level / 2)          // Wizard, Sorcerer, Bard
};

// REQUIRED: Exact save progressions from SRD  
const SAVE_PROGRESSIONS = {
    good: level => 2 + Math.floor(level / 2),    // Strong saves
    poor: level => Math.floor(level / 3)          // Weak saves
};
```

### Code Quality Standards

#### Mandatory Code Patterns
```javascript
// REQUIRED: Dual environment compatibility
class GameSystem {
    constructor() {
        // Implementation
    }
}

// REQUIRED: Universal export pattern
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameSystem;
} else if (typeof window !== 'undefined') {
    window.GameSystem = GameSystem;
}

// REQUIRED: Error handling for all public methods
validateInput(input) {
    if (!input || typeof input !== 'object') {
        throw new Error('Input must be a valid object');
    }
    
    // Additional validation logic
}
```

#### Performance Standards
```javascript
// REQUIRED: Performance benchmarks
const PERFORMANCE_REQUIREMENTS = {
    abilityScoreCalculation: 10,    // < 10ms
    characterValidation: 50,        // < 50ms  
    inventoryOperation: 100,        // < 100ms
    encounterGeneration: 500,       // < 500ms
    pageLoad: 2000                  // < 2 seconds
};

// Performance testing implementation
function validatePerformance(operation, maxTime) {
    const startTime = performance.now();
    operation();
    const duration = performance.now() - startTime;
    
    if (duration > maxTime) {
        throw new Error(`Performance failure: ${operation.name} took ${duration}ms, max allowed: ${maxTime}ms`);
    }
}
```

## 📋 Code Review Checklist

### Pre-Submission Requirements
**Every code submission must pass ALL checklist items**

#### D&D 3.5 Rule Compliance
- [ ] **SRD Accuracy:** All calculations verified against official D&D 3.5 SRD
- [ ] **Rule Citations:** Comments reference specific SRD sections where applicable
- [ ] **Edge Case Handling:** Unusual but legal character builds work correctly
- [ ] **Multiclass Support:** If applicable, multiclass rules implemented correctly
- [ ] **Level Range Support:** Supports levels 1-20 (standard) and 21-100 (epic) if applicable

#### Code Quality
- [ ] **Naming Conventions:** Clear, descriptive variable and function names
- [ ] **Function Size:** Functions are focused and under 50 lines when possible
- [ ] **Error Handling:** All public methods have proper error handling
- [ ] **Input Validation:** All user inputs are validated and sanitized
- [ ] **Performance:** Meets specified performance benchmarks

#### Documentation
- [ ] **JSDoc Comments:** All public methods have complete JSDoc documentation
- [ ] **Inline Comments:** Complex logic is explained with inline comments
- [ ] **Examples:** Usage examples provided for complex APIs
- [ ] **Change Log:** Significant changes documented in commit messages

#### Testing
- [ ] **Unit Tests:** 80%+ code coverage with meaningful tests
- [ ] **Integration Tests:** Component interactions tested
- [ ] **Edge Cases:** Boundary conditions and error scenarios tested
- [ ] **Performance Tests:** Critical operations benchmarked
- [ ] **Browser Tests:** Verified in Chrome, Firefox, Safari, Edge

#### Compatibility
- [ ] **Dual Environment:** Works in both Node.js and browser
- [ ] **Mobile Responsive:** Functions properly on mobile devices
- [ ] **Accessibility:** Meets WCAG 2.1 AA standards
- [ ] **Browser Support:** Compatible with specified browser versions

### Review Process

#### Level 1: Automated Checks
```javascript
// Automated code quality checks
const qualityChecks = {
    syntaxValid: () => checkSyntax(),
    testsPass: () => runTestSuite(),
    performanceMet: () => runPerformanceBenchmarks(),
    lintingClean: () => runLinter(),
    coverageAdequate: () => checkCodeCoverage(80)
};

function runAutomatedChecks() {
    Object.entries(qualityChecks).forEach(([check, test]) => {
        if (!test()) {
            throw new Error(`Automated check failed: ${check}`);
        }
    });
}
```

#### Level 2: D&D 3.5 Validation
```javascript
// D&D rule compliance validation
const srdValidation = {
    raceDataAccurate: () => validateRaceImplementations(),
    classDataCorrect: () => validateClassProgressions(), 
    calculationsExact: () => validateAllCalculations(),
    prereqsValid: () => validateFeatPrerequisites(),
    equipmentCorrect: () => validateEquipmentStats()
};

function validateSRDCompliance() {
    const results = {};
    Object.entries(srdValidation).forEach(([rule, validator]) => {
        results[rule] = validator();
        if (!results[rule].valid) {
            console.error(`SRD Compliance Error: ${rule} - ${results[rule].reason}`);
        }
    });
    return results;
}
```

#### Level 3: Manual Review
- [ ] **Architecture Alignment:** Code follows established patterns
- [ ] **Integration Points:** Properly integrates with existing systems
- [ ] **User Experience:** Intuitive and responsive interface
- [ ] **Security Considerations:** No XSS or injection vulnerabilities
- [ ] **Future Maintainability:** Code is easy to understand and extend

## 🧪 Testing Standards and Procedures

### Test Categories and Requirements

#### Unit Testing Standards
```javascript
// REQUIRED: Test structure for all D&D calculations
describe('D&D 3.5 Calculations', () => {
    describe('Ability Modifiers', () => {
        test('calculates modifiers correctly for all scores 1-30', () => {
            for (let score = 1; score <= 30; score++) {
                const expected = Math.floor((score - 10) / 2);
                expect(calculateAbilityModifier(score)).toBe(expected);
            }
        });
        
        test('handles edge cases and invalid inputs', () => {
            expect(() => calculateAbilityModifier(null)).toThrow();
            expect(() => calculateAbilityModifier('invalid')).toThrow();
        });
    });
    
    describe('Point Buy Validation', () => {
        test('accepts valid 28-point builds', () => {
            const validBuild = { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
            const result = validatePointBuy(validBuild, 28);
            expect(result.valid).toBe(true);
            expect(result.cost).toBeLessThanOrEqual(28);
        });
        
        test('rejects overspend builds', () => {
            const invalidBuild = { str: 18, dex: 18, con: 18, int: 18, wis: 18, cha: 18 };
            const result = validatePointBuy(invalidBuild, 28);
            expect(result.valid).toBe(false);
            expect(result.cost).toBeGreaterThan(28);
        });
    });
});
```

#### Integration Testing Standards
```javascript
// REQUIRED: Complete workflow testing
describe('Character Creation Integration', () => {
    test('complete character creation workflow', async () => {
        const wizard = new CharacterCreationWizard();
        
        // Step 1: Ability Scores
        wizard.setAbilityScores({ str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 });
        expect(wizard.canAdvanceStep()).toBe(true);
        
        // Step 2: Race Selection
        wizard.nextStep();
        wizard.selectRace('human');
        expect(wizard.character.race).toBe('human');
        expect(wizard.canAdvanceStep()).toBe(true);
        
        // Continue through all steps...
        
        // Final validation
        const character = wizard.finalizeCharacter();
        expect(character.isValid()).toBe(true);
        expect(character.meetsAllRequirements()).toBe(true);
    });
});
```

#### Performance Testing Standards
```javascript
// REQUIRED: Performance benchmarking
describe('Performance Benchmarks', () => {
    test('character calculations under 100ms', () => {
        const character = createComplexTestCharacter();
        
        const startTime = performance.now();
        character.recalculateAllStats();
        const duration = performance.now() - startTime;
        
        expect(duration).toBeLessThan(100);
    });
    
    test('inventory operations handle 500+ items smoothly', () => {
        const inventory = new InventoryManager();
        const items = generateTestItems(500);
        
        const startTime = performance.now();
        items.forEach(item => inventory.addItem(item));
        inventory.calculateEncumbrance();
        inventory.sortInventory('type');
        const duration = performance.now() - startTime;
        
        expect(duration).toBeLessThan(200);
    });
});
```

### Browser Compatibility Testing

#### Required Browser Support
- **Chrome:** Version 90+ (primary development target)
- **Firefox:** Version 88+ (full feature support)
- **Safari:** Version 14+ (WebKit compatibility)
- **Edge:** Version 90+ (Chromium-based)
- **Mobile Safari:** iOS 14+ (touch interactions)
- **Chrome Mobile:** Android 90+ (responsive design)

#### Compatibility Test Suite
```javascript
// Cross-browser testing checklist
const browserTests = {
    localStorage: () => testLocalStorageSupport(),
    dragAndDrop: () => testDragDropEvents(),
    es6Features: () => testModernJavaScript(),
    touchEvents: () => testMobileInteractions(),
    performance: () => testPerformanceAPIs(),
    accessibility: () => testAccessibilityFeatures()
};

function runBrowserCompatibilityTests() {
    const results = {};
    Object.entries(browserTests).forEach(([feature, test]) => {
        try {
            results[feature] = test();
        } catch (error) {
            results[feature] = { supported: false, error: error.message };
        }
    });
    return results;
}
```

## 📊 Quality Metrics and Monitoring

### Code Quality Metrics
```javascript
const qualityMetrics = {
    // Test coverage targets
    unitTestCoverage: 80,           // Minimum 80% line coverage
    integrationCoverage: 70,        // Minimum 70% feature coverage
    
    // Performance benchmarks
    calculationPerformance: 100,    // < 100ms for stat calculations
    uiResponseTime: 16,             // < 16ms for 60fps UI updates
    pageLoadTime: 2000,             // < 2 seconds initial load
    
    // Code quality scores
    cyclomaticComplexity: 10,       // Maximum complexity score
    functionLength: 50,             // Maximum lines per function
    fileLength: 500,                // Maximum lines per file
    
    // D&D compliance metrics
    srdAccuracy: 100,               // 100% SRD rule compliance
    calculationPrecision: 0,        // 0 rounding errors allowed
    validationCoverage: 95          // 95% of edge cases covered
};

// Automated quality monitoring
function monitorQuality() {
    const currentMetrics = measureCurrentQuality();
    
    Object.entries(qualityMetrics).forEach(([metric, target]) => {
        const current = currentMetrics[metric];
        
        if (current < target) {
            console.warn(`Quality metric below target: ${metric} (${current} < ${target})`);
        }
    });
    
    return currentMetrics;
}
```

### Continuous Quality Assurance

#### Daily Quality Checks
- [ ] **Automated Test Suite:** All tests pass
- [ ] **Performance Benchmarks:** All benchmarks meet targets
- [ ] **Code Coverage:** Maintains minimum coverage levels
- [ ] **SRD Compliance:** All D&D calculations remain accurate
- [ ] **Browser Compatibility:** No regressions in supported browsers

#### Weekly Quality Reviews
- [ ] **Code Quality Analysis:** Review complexity and maintainability
- [ ] **Performance Trending:** Monitor performance over time
- [ ] **User Experience Testing:** Manual testing of key workflows
- [ ] **Documentation Updates:** Keep documentation current with code
- [ ] **Security Review:** Check for potential vulnerabilities

#### Monthly Quality Audits
- [ ] **Comprehensive Testing:** Full regression testing
- [ ] **Performance Profiling:** Detailed performance analysis
- [ ] **Accessibility Audit:** Complete accessibility compliance check
- [ ] **SRD Verification:** Verify all D&D rules against latest SRD
- [ ] **Code Architecture Review:** Assess overall system architecture

## 🚨 Error Prevention and Handling

### Common Error Patterns and Prevention

#### D&D Rule Implementation Errors
```javascript
// WRONG: Inconsistent with SRD
function calculateBAB(level) {
    return level; // Assumes full BAB for all classes
}

// CORRECT: Class-specific progression
function calculateBAB(classId, level) {
    const classData = this.classes[classId];
    if (!classData) {
        throw new Error(`Invalid class: ${classId}`);
    }
    
    switch (classData.babProgression) {
        case 'full': return level;
        case 'medium': return Math.floor(level * 3 / 4);
        case 'poor': return Math.floor(level / 2);
        default: throw new Error(`Invalid BAB progression: ${classData.babProgression}`);
    }
}
```

#### Input Validation Patterns
```javascript
// REQUIRED: Comprehensive input validation
function validateCharacterData(character) {
    const errors = [];
    
    // Validate required fields
    if (!character.name || character.name.trim().length === 0) {
        errors.push('Character name is required');
    }
    
    // Validate ability scores
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(ability => {
        const score = character.abilities[ability];
        if (!Number.isInteger(score) || score < 3 || score > 50) {
            errors.push(`Invalid ${ability} score: ${score}`);
        }
    });
    
    // Validate race and class
    if (!this.isValidRace(character.race)) {
        errors.push(`Invalid race: ${character.race}`);
    }
    
    if (!this.isValidClass(character.class)) {
        errors.push(`Invalid class: ${character.class}`);
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}
```

### Error Recovery Strategies
```javascript
// Graceful degradation patterns
class CharacterManager {
    constructor() {
        this.fallbackData = this.loadFallbackData();
    }
    
    loadCharacter(characterId) {
        try {
            return this.loadFromStorage(characterId);
        } catch (error) {
            console.warn(`Failed to load character ${characterId}:`, error);
            return this.createDefaultCharacter();
        }
    }
    
    saveCharacter(character) {
        try {
            this.saveToStorage(character);
            return { success: true };
        } catch (error) {
            console.error('Save failed:', error);
            // Attempt alternative storage
            return this.saveToFallbackStorage(character);
        }
    }
}
```

## ✅ Quality Assurance Certification

### Pre-Release Certification Checklist

#### Core Functionality
- [ ] **Character Creation:** All 7 steps work correctly
- [ ] **D&D 3.5 Compliance:** All calculations verified against SRD
- [ ] **Data Persistence:** Save/load functions reliably
- [ ] **Browser Compatibility:** Works in all required browsers
- [ ] **Mobile Support:** Full functionality on mobile devices
- [ ] **Performance:** Meets all performance benchmarks

#### Quality Standards
- [ ] **Code Coverage:** Minimum 80% unit test coverage
- [ ] **Error Handling:** Graceful handling of all error conditions
- [ ] **Input Validation:** All user inputs properly validated
- [ ] **Security:** No XSS or injection vulnerabilities
- [ ] **Accessibility:** WCAG 2.1 AA compliance verified
- [ ] **Documentation:** Complete user and developer documentation

#### Production Readiness
- [ ] **Load Testing:** Handles expected user load
- [ ] **Error Monitoring:** Proper error logging and alerting
- [ ] **Performance Monitoring:** Real-time performance tracking
- [ ] **Backup Systems:** Data recovery procedures in place
- [ ] **Deployment Process:** Automated and reliable deployment
- [ ] **Rollback Capability:** Quick rollback in case of issues

### Quality Certification Process
1. **Development Team Verification:** All checklist items completed
2. **Automated Testing Suite:** 100% pass rate on all tests
3. **Manual Quality Review:** Independent quality assessment
4. **Performance Validation:** All benchmarks met or exceeded
5. **Security Audit:** No critical or high-severity vulnerabilities
6. **Final Approval:** Quality assurance sign-off for production release
---
description: "Comprehensive testing and validation procedures for D&D 3.5 compliance"
applyTo: "**/test/**,**/spec/**,**/validation/**"
---

# Testing and Validation Instructions

## Core Testing Requirements
Implement comprehensive testing suite covering unit tests, integration tests, D&D 3.5 rule validation, browser compatibility, and performance benchmarks.

## Test Architecture
```javascript
class TestSuite {
    constructor() {
        this.unitTests = new UnitTestRunner();
        this.integrationTests = new IntegrationTestRunner();
        this.validationTests = new D35ValidationRunner();
        this.performanceTests = new PerformanceTestRunner();
        this.browserTests = new CrossBrowserTestRunner();
    }
}
```

## Unit Testing Framework
```javascript
// Core D&D 3.5 calculation tests
describe('D&D 3.5 Rule Calculations', () => {
    describe('Ability Score Modifiers', () => {
        test('calculates ability modifiers correctly', () => {
            expect(calculateAbilityModifier(8)).toBe(-1);
            expect(calculateAbilityModifier(10)).toBe(0);
            expect(calculateAbilityModifier(11)).toBe(0);
            expect(calculateAbilityModifier(12)).toBe(1);
            expect(calculateAbilityModifier(18)).toBe(4);
            expect(calculateAbilityModifier(20)).toBe(5);
        });
    });
    
    describe('Point Buy System', () => {
        test('validates official point buy costs', () => {
            const pointBuyCosts = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 6, 15: 8, 16: 10, 17: 13, 18: 16 };
            Object.entries(pointBuyCosts).forEach(([score, cost]) => {
                expect(calculatePointBuyCost(parseInt(score))).toBe(cost);
            });
        });
        
        test('rejects invalid point buy allocations', () => {
            const invalidBuild = { str: 18, dex: 18, con: 18, int: 18, wis: 18, cha: 18 };
            const validation = validatePointBuy(invalidBuild, 28);
            expect(validation.valid).toBe(false);
            expect(validation.cost).toBeGreaterThan(28);
        });
    });
    
    describe('Base Attack Bonus', () => {
        test('calculates BAB progressions correctly', () => {
            // Full BAB (Fighter)
            expect(getClassBAB('fighter', 1)).toBe(1);
            expect(getClassBAB('fighter', 5)).toBe(5);
            expect(getClassBAB('fighter', 20)).toBe(20);
            
            // Medium BAB (Cleric)
            expect(getClassBAB('cleric', 1)).toBe(0);
            expect(getClassBAB('cleric', 4)).toBe(3);
            expect(getClassBAB('cleric', 20)).toBe(15);
            
            // Poor BAB (Wizard)
            expect(getClassBAB('wizard', 1)).toBe(0);
            expect(getClassBAB('wizard', 2)).toBe(1);
            expect(getClassBAB('wizard', 20)).toBe(10);
        });
    });
    
    describe('Saving Throws', () => {
        test('calculates save progressions correctly', () => {
            // Good saves (Cleric Will)
            expect(calculateSave('good', 1)).toBe(2);
            expect(calculateSave('good', 10)).toBe(7);
            expect(calculateSave('good', 20)).toBe(12);
            
            // Poor saves (Cleric Reflex)
            expect(calculateSave('poor', 1)).toBe(0);
            expect(calculateSave('poor', 3)).toBe(1);
            expect(calculateSave('poor', 20)).toBe(6);
        });
    });
});
```

## Integration Testing
```javascript
describe('Character Creation Integration', () => {
    test('complete character creation workflow', async () => {
        const character = new Character();
        
        // Step 1: Ability Scores
        character.setAbilityScores({ str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 });
        expect(character.abilities.str.total).toBe(15);
        
        // Step 2: Race Selection
        character.setRace('human');
        expect(character.race).toBe('human');
        // Humans get no racial ability modifiers
        expect(character.abilities.str.total).toBe(15);
        
        // Step 3: Class Selection
        character.setClass('fighter');
        expect(character.class).toBe('fighter');
        expect(character.hitDie).toBe(10);
        
        // Step 4: Skills
        const skillPoints = character.getAvailableSkillPoints();
        expect(skillPoints).toBe((2 + 1) * 4); // (base 2 + Int mod 1) × 4 for first level
        
        // Step 5: Feats
        const availableFeats = character.getAvailableFeats();
        expect(availableFeats.length).toBeGreaterThan(0);
        
        // Complete validation
        const validation = character.validate();
        expect(validation.valid).toBe(true);
    });
    
    test('character data persistence', () => {
        const character = createTestCharacter();
        const serialized = character.serialize();
        const restored = Character.deserialize(serialized);
        
        expect(restored.name).toBe(character.name);
        expect(restored.race).toBe(character.race);
        expect(restored.class).toBe(character.class);
        expect(restored.abilities.str.total).toBe(character.abilities.str.total);
    });
});
```

## D&D 3.5 SRD Compliance Tests
```javascript
describe('SRD Compliance Validation', () => {
    describe('Race Implementation', () => {
        test('human racial features', () => {
            const human = races.human;
            expect(human.size).toBe('Medium');
            expect(human.speed).toBe(30);
            expect(human.ability_adjustments).toEqual({});
            expect(human.special_abilities).toContain('Extra feat at 1st level');
        });
        
        test('elf racial features', () => {
            const elf = races.elf;
            expect(elf.ability_adjustments).toEqual({ dex: 2, con: -2 });
            expect(elf.special_abilities).toContain('Low-light vision');
        });
    });
    
    describe('Class Implementation', () => {
        test('fighter class features', () => {
            const fighter = classes.fighter;
            expect(fighter.hit_die).toBe(10);
            expect(fighter.skill_points_per_level).toBe(2);
            expect(fighter.bab_progression).toBe('full');
            expect(fighter.base_saves.fort).toBe('good');
        });
        
        test('wizard class features', () => {
            const wizard = classes.wizard;
            expect(wizard.hit_die).toBe(4);
            expect(wizard.spellcasting).toBe(true);
            expect(wizard.base_saves.will).toBe('good');
        });
    });
    
    describe('Equipment System', () => {
        test('weapon properties', () => {
            const longsword = equipment.weapons.longsword;
            expect(longsword.damage).toBe('1d8');
            expect(longsword.critical).toBe('19-20/x2');
            expect(longsword.type).toBe('martial melee');
        });
        
        test('armor properties', () => {
            const chainmail = equipment.armor.chain_mail;
            expect(chainmail.ac_bonus).toBe(5);
            expect(chainmail.max_dex).toBe(2);
            expect(chainmail.check_penalty).toBe(-5);
        });
    });
});
```

## Performance Testing
```javascript
describe('Performance Benchmarks', () => {
    test('character stat calculations under 100ms', () => {
        const character = createComplexCharacter();
        const startTime = performance.now();
        
        character.recalculateAll();
        
        const endTime = performance.now();
        expect(endTime - startTime).toBeLessThan(100);
    });
    
    test('large inventory operations under 200ms', () => {
        const inventory = new InventoryManager();
        const items = generateLargeItemSet(500);
        
        const startTime = performance.now();
        
        items.forEach(item => inventory.addItem(item));
        inventory.calculateEncumbrance();
        inventory.sortInventory();
        
        const endTime = performance.now();
        expect(endTime - startTime).toBeLessThan(200);
    });
    
    test('encounter generation under 500ms', () => {
        const adventureEngine = new AdventureEngine();
        const party = createTestParty(4, 5); // 4 characters, level 5
        
        const startTime = performance.now();
        
        const encounter = adventureEngine.generateBalancedEncounter(party, 'challenging');
        
        const endTime = performance.now();
        expect(endTime - startTime).toBeLessThan(500);
        expect(encounter.creatures.length).toBeGreaterThan(0);
    });
});
```

## Browser Compatibility Testing
```javascript
describe('Cross-Browser Compatibility', () => {
    test('localStorage functionality', () => {
        const testData = { test: 'value' };
        
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('test', JSON.stringify(testData));
            const retrieved = JSON.parse(localStorage.getItem('test'));
            expect(retrieved).toEqual(testData);
            localStorage.removeItem('test');
        }
    });
    
    test('drag and drop support', () => {
        const element = document.createElement('div');
        expect(element.draggable).toBeDefined();
        expect(typeof element.ondragstart).toBe('object');
    });
    
    test('modern JavaScript features', () => {
        // ES6+ feature support
        expect(() => {
            const obj = { a: 1, b: 2 };
            const { a, ...rest } = obj;
            return [a, rest];
        }).not.toThrow();
    });
});
```

## UI/UX Testing
```javascript
describe('User Interface Testing', () => {
    test('character creation wizard navigation', () => {
        const wizard = new CharacterCreationWizard();
        
        expect(wizard.currentStep).toBe(1);
        expect(wizard.canAdvance()).toBe(false); // No abilities set yet
        
        wizard.setAbilityScores({ str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 });
        expect(wizard.canAdvance()).toBe(true);
        
        wizard.nextStep();
        expect(wizard.currentStep).toBe(2);
    });
    
    test('form validation feedback', () => {
        const form = new CharacterForm();
        const validation = form.validateStep('abilities', { str: 25 }); // Invalid score
        
        expect(validation.valid).toBe(false);
        expect(validation.errors).toContain('Strength score too high');
    });
    
    test('responsive design breakpoints', () => {
        // Test mobile layout
        Object.defineProperty(window, 'innerWidth', { value: 768 });
        window.dispatchEvent(new Event('resize'));
        
        const layout = getComputedStyle(document.querySelector('.character-sheet'));
        expect(layout.display).toBe('block'); // Should stack on mobile
    });
});
```

## Error Handling Tests
```javascript
describe('Error Handling', () => {
    test('handles invalid character data gracefully', () => {
        expect(() => {
            const character = new Character();
            character.setAbilityScore('invalid_ability', 15);
        }).toThrow('Invalid ability score name');
    });
    
    test('provides helpful error messages', () => {
        const character = new Character();
        
        try {
            character.addFeat('power-attack'); // Without prerequisites
        } catch (error) {
            expect(error.message).toContain('Strength 13 required');
        }
    });
    
    test('recovers from corrupted save data', () => {
        const corruptData = '{"invalid": "json"'; // Malformed JSON
        
        expect(() => {
            Character.loadFromStorage(corruptData);
        }).not.toThrow();
        
        // Should return default character instead
        const character = Character.loadFromStorage(corruptData);
        expect(character).toBeInstanceOf(Character);
    });
});
```

## Test Utilities
```javascript
// Test data generators
function createTestCharacter() {
    const character = new Character();
    character.name = 'Test Fighter';
    character.setAbilityScores({ str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 });
    character.setRace('human');
    character.setClass('fighter');
    return character;
}

function createTestParty(size = 4, level = 1) {
    const party = [];
    const classes = ['fighter', 'wizard', 'cleric', 'rogue'];
    
    for (let i = 0; i < size; i++) {
        const character = createTestCharacter();
        character.setClass(classes[i % classes.length]);
        character.level = level;
        party.push(character);
    }
    
    return party;
}

function generateLargeItemSet(count) {
    const items = [];
    const itemTypes = ['weapon', 'armor', 'gear', 'consumable'];
    
    for (let i = 0; i < count; i++) {
        items.push({
            id: `item-${i}`,
            name: `Test Item ${i}`,
            type: itemTypes[i % itemTypes.length],
            weight: Math.random() * 10,
            value: Math.floor(Math.random() * 1000),
            quantity: 1
        });
    }
    
    return items;
}
```

## Automated Testing Pipeline
```javascript
// Test runner configuration
const testConfig = {
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    setupFiles: ['<rootDir>/test/setup.js'],
    testEnvironment: 'jsdom' // For DOM testing
};

// Continuous integration testing
const runAllTests = async () => {
    console.log('Running unit tests...');
    await runUnitTests();
    
    console.log('Running integration tests...');
    await runIntegrationTests();
    
    console.log('Running performance tests...');
    await runPerformanceTests();
    
    console.log('Running browser compatibility tests...');
    await runBrowserTests();
    
    console.log('Generating coverage report...');
    await generateCoverageReport();
};
```

## Test Data Validation
- All test scenarios must use official D&D 3.5 SRD data
- Character builds must be legally possible within SRD rules
- Equipment combinations must follow encumbrance and proficiency rules
- Spell selections must meet class and level requirements
- Feat prerequisites must be validated against SRD specifications

## Performance Benchmarks
- Character stat calculations: < 100ms
- Inventory operations (500+ items): < 200ms
- Encounter generation: < 500ms
- Page load time: < 2 seconds
- Memory usage: < 50MB for typical character

## Browser Support Requirements
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile Safari (iOS 14+), Chrome Mobile (90+)
- Progressive enhancement for older browsers
- Graceful degradation of advanced features

## Accessibility Testing
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Keyboard navigation for all functionality
- Color contrast ratios meet WCAG 2.1 AA standards
- Focus management and ARIA labels
- Alternative text for all images and icons
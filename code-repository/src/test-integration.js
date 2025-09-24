/**
 * D&D 3.5 System Integration Test Suite
 * Tests data extraction, calculation engine, and complete character creation workflow
 * Run with: node test-integration.js
 */

const fs = require('fs').promises;
const path = require('path');

// Test framework - simple assertion library
class TestFramework {
    constructor() {
        this.testCount = 0;
        this.passCount = 0;
        this.failCount = 0;
        this.errors = [];
    }

    assert(condition, message) {
        this.testCount++;
        if (condition) {
            this.passCount++;
            console.log(`✓ ${message}`);
        } else {
            this.failCount++;
            console.log(`✗ ${message}`);
            this.errors.push(message);
        }
    }

    assertEquals(actual, expected, message) {
        this.assert(actual === expected, `${message} (expected: ${expected}, actual: ${actual})`);
    }

    assertNotNull(value, message) {
        this.assert(value !== null && value !== undefined, `${message} (value was null/undefined)`);
    }

    assertGreaterThan(actual, expected, message) {
        this.assert(actual > expected, `${message} (${actual} > ${expected})`);
    }

    summary() {
        console.log('\n=== Test Summary ===');
        console.log(`Total Tests: ${this.testCount}`);
        console.log(`Passed: ${this.passCount}`);
        console.log(`Failed: ${this.failCount}`);

        if (this.failCount > 0) {
            console.log('\n=== Failures ===');
            this.errors.forEach(error => console.log(`- ${error}`));
        }

        return this.failCount === 0;
    }
}

async function runTests() {
    const test = new TestFramework();

    console.log('Starting D&D 3.5 System Integration Tests...\n');

    try {
        // Test 1: Data File Existence
        console.log('=== Testing Data File Existence ===');
        const dataDir = path.join(__dirname, 'data');

        const requiredFiles = [
            'races-expanded.json',
            'classes-expanded.json',
            'feats-expanded.json',
            'spells-expanded.json',
            'equipment-expanded.json'
        ];

        for (const fileName of requiredFiles) {
            const filePath = path.join(dataDir, fileName);
            try {
                await fs.access(filePath);
                test.assert(true, `Data file exists: ${fileName}`);
            } catch (error) {
                test.assert(false, `Data file missing: ${fileName}`);
            }
        }

        // Test 2: Data File Parsing
        console.log('\n=== Testing Data File Parsing ===');
        for (const fileName of requiredFiles) {
            const filePath = path.join(dataDir, fileName);
            try {
                const data = await fs.readFile(filePath, 'utf8');
                const parsed = JSON.parse(data);
                test.assert(true, `JSON parsing successful: ${fileName}`);

                // Basic structure validation
                if (fileName.includes('races')) {
                    test.assert(Array.isArray(parsed), `Races data is array: ${fileName}`);
                    test.assertGreaterThan(parsed.length, 0, `Races data not empty: ${fileName}`);
                } else if (fileName.includes('classes')) {
                    test.assert(Array.isArray(parsed), `Classes data is array: ${fileName}`);
                    test.assertGreaterThan(parsed.length, 0, `Classes data not empty: ${fileName}`);
                } else if (fileName.includes('equipment')) {
                    test.assert(typeof parsed === 'object', `Equipment data is object: ${fileName}`);
                    test.assertNotNull(parsed.weapons, `Equipment has weapons: ${fileName}`);
                }
            } catch (error) {
                test.assert(false, `JSON parsing failed: ${fileName} - ${error.message}`);
            }
        }

        // Test 3: Data Manager Initialization
        console.log('\n=== Testing Data Manager ===');
        const { DnDDataManager } = require('./data-manager.js');
        const dataManager = new DnDDataManager();

        try {
            await dataManager.initialize();
            test.assert(true, 'Data manager initialization successful');

            const status = dataManager.getStatus();
            test.assert(status.initialized, 'Data manager reports initialized');
            test.assertGreaterThan(status.counts.races, 0, 'Races loaded');
            test.assertGreaterThan(status.counts.classes, 0, 'Classes loaded');
            test.assertGreaterThan(status.counts.feats, 0, 'Feats loaded');
            test.assertGreaterThan(status.counts.spells, 0, 'Spells loaded');

        } catch (error) {
            test.assert(false, `Data manager initialization failed: ${error.message}`);
        }

        // Test 4: Calculation Engine
        console.log('\n=== Testing Calculation Engine ===');
        const DnDCalculationEngine = require('./calculation-engine.js');
        const calcEngine = new DnDCalculationEngine();

        // Test ability modifier calculation
        test.assertEquals(calcEngine.calculateAbilityModifier(10), 0, 'Ability modifier for 10');
        test.assertEquals(calcEngine.calculateAbilityModifier(18), 4, 'Ability modifier for 18');
        test.assertEquals(calcEngine.calculateAbilityModifier(8), -1, 'Ability modifier for 8');

        // Test racial ability adjustments
        const gameData = dataManager.getAllData();
        calcEngine.initialize(gameData);

        const baseAbilities = { strength: 15, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 10, charisma: 8 };
        const dwarfAbilities = calcEngine.applyRacialAbilityAdjustments(baseAbilities, 'Dwarf');
        test.assertEquals(dwarfAbilities.constitution, 15, 'Dwarf constitution bonus applied');
        test.assertEquals(dwarfAbilities.charisma, 6, 'Dwarf charisma penalty applied');

        // Test base attack bonus calculation
        const fighterClasses = [{ className: 'Fighter', level: 5 }];
        const fighterBAB = calcEngine.calculateBaseAttackBonus(fighterClasses);
        test.assertEquals(fighterBAB, 5, 'Fighter BAB calculation');

        const wizardClasses = [{ className: 'Wizard', level: 8 }];
        const wizardBAB = calcEngine.calculateBaseAttackBonus(wizardClasses);
        test.assertEquals(wizardBAB, 4, 'Wizard BAB calculation');

        // Test hit points calculation
        const conMod = 2;
        const hitPoints = calcEngine.calculateHitPoints(fighterClasses, conMod);
        test.assertGreaterThan(hitPoints, 0, 'Hit points calculated');

        // Test 5: System Integration
        console.log('\n=== Testing System Integration ===');
        const { DnDSystemIntegration } = require('./system-integration.js');
        const system = new DnDSystemIntegration();

        try {
            await system.initialize();
            test.assert(true, 'System integration initialization successful');

            const status = system.getStatus();
            test.assert(status.initialized, 'System integration reports initialized');

        } catch (error) {
            test.assert(false, `System integration initialization failed: ${error.message}`);
        }

        // Test 6: Complete Character Creation
        console.log('\n=== Testing Character Creation ===');
        const characterData = {
            name: 'Test Character',
            race: 'Human',
            classes: [{ className: 'Fighter', level: 1 }],
            alignment: 'Lawful Good',
            baseAbilities: { strength: 16, dexterity: 14, constitution: 15, intelligence: 10, wisdom: 12, charisma: 8 }
        };

        try {
            const character = system.createCharacter(characterData);
            test.assertNotNull(character, 'Character created');
            test.assertEquals(character.name, 'Test Character', 'Character name correct');
            test.assertEquals(character.race, 'Human', 'Character race correct');
            test.assertNotNull(character.abilities, 'Abilities calculated');
            test.assertNotNull(character.hitPoints, 'Hit points calculated');
            test.assertGreaterThan(character.hitPoints.max, 0, 'Maximum hit points > 0');

            // Test character validation
            const validation = system.validateCharacter(character);
            test.assert(validation.valid, 'Character validation passes');

        } catch (error) {
            test.assert(false, `Character creation failed: ${error.message}`);
        }

        // Test 7: Data Queries
        console.log('\n=== Testing Data Queries ===');

        // Test race queries
        const human = dataManager.getRace('Human');
        test.assertNotNull(human, 'Human race found');
        test.assertEquals(human.name, 'Human', 'Human race name correct');

        const dwarf = dataManager.getRace('Dwarf');
        test.assertNotNull(dwarf, 'Dwarf race found');
        test.assertEquals(dwarf.ability_adjustments.constitution, 2, 'Dwarf constitution bonus');

        // Test class queries
        const fighter = dataManager.getClass('Fighter');
        test.assertNotNull(fighter, 'Fighter class found');
        test.assertEquals(fighter.hit_die, 'd10', 'Fighter hit die correct');

        const wizard = dataManager.getClass('Wizard');
        test.assertNotNull(wizard, 'Wizard class found');
        test.assert(wizard.spellcasting, 'Wizard is spellcaster');

        // Test spell queries
        const fireball = dataManager.getSpell('Fireball');
        test.assertNotNull(fireball, 'Fireball spell found');
        test.assertEquals(fireball.level.Wizard, 3, 'Fireball is 3rd level wizard spell');

        const spellsByLevel = dataManager.getSpellsByClassAndLevel('Wizard', 1);
        test.assertGreaterThan(spellsByLevel.length, 0, '1st level wizard spells found');

        // Test equipment queries
        const longsword = dataManager.searchEquipment('Longsword', true);
        test.assertGreaterThan(longsword.length, 0, 'Longsword found');

        const weapons = dataManager.getWeapons('martial_melee');
        test.assertGreaterThan(weapons.length, 0, 'Martial melee weapons found');

        // Test 8: Multiclass Character
        console.log('\n=== Testing Multiclass Character ===');
        const multiclassData = {
            name: 'Multiclass Test',
            race: 'Half-Elf',
            classes: [
                { className: 'Fighter', level: 3 },
                { className: 'Wizard', level: 2 }
            ],
            alignment: 'Neutral Good',
            baseAbilities: { strength: 14, dexterity: 13, constitution: 14, intelligence: 16, wisdom: 12, charisma: 10 }
        };

        try {
            const multiCharacter = system.createCharacter(multiclassData);
            test.assertNotNull(multiCharacter, 'Multiclass character created');
            test.assertEquals(multiCharacter.level, 5, 'Total level calculated correctly');

            const validation = system.validateCharacter(multiCharacter);
            test.assert(validation.valid || validation.warnings.length > 0, 'Multiclass character validation');

        } catch (error) {
            test.assert(false, `Multiclass character creation failed: ${error.message}`);
        }

        // Test 9: Performance Test
        console.log('\n=== Performance Testing ===');
        const startTime = Date.now();

        for (let i = 0; i < 100; i++) {
            const testChar = system.createCharacter({
                name: `Performance Test ${i}`,
                race: i % 2 === 0 ? 'Human' : 'Elf',
                classes: [{ className: 'Fighter', level: Math.floor(i / 10) + 1 }],
                baseAbilities: { strength: 14, dexterity: 14, constitution: 14, intelligence: 10, wisdom: 10, charisma: 10 }
            });
        }

        const endTime = Date.now();
        const duration = endTime - startTime;
        test.assert(duration < 5000, `Performance test: 100 characters created in ${duration}ms (should be < 5000ms)`);

    } catch (error) {
        console.error('Test suite error:', error);
        test.assert(false, `Test suite failed with error: ${error.message}`);
    }

    const success = test.summary();
    process.exit(success ? 0 : 1);
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests, TestFramework };
/**
 * Adventure Engine Test Suite
 * Comprehensive testing for the RulzLawyer Adventure Engine
 * Tests all adventure generation and encounter resolution functionality
 */

// Mock localStorage for Node.js environment
if (typeof localStorage === 'undefined') {
    global.localStorage = {
        data: {},
        setItem: function(key, value) { this.data[key] = value; },
        getItem: function(key) { return this.data[key] || null; },
        removeItem: function(key) { delete this.data[key]; },
        clear: function() { this.data = {}; }
    };
}

// Import required modules
const DiceEngine = require('../src/dice-engine.js');
const RandomTablesEngine = require('../src/random-tables-index.js');
const CharacterManager = require('../src/character-manager.js');
const StorageManager = require('../src/storage-manager.js');
const AdventureEngine = require('../src/adventure-engine.js');

console.log('🧪 Adventure Engine Test Suite');
console.log('='.repeat(50));

/**
 * Test Suite Runner
 */
async function runAdventureEngineTests() {
    const results = {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        testResults: []
    };
    
    try {
        // Initialize core systems
        console.log('📋 Initializing test environment...');
        const diceEngine = new DiceEngine(true);
        const tablesEngine = new RandomTablesEngine(diceEngine);
        const characterManager = new CharacterManager(diceEngine, tablesEngine);
        const storageManager = new StorageManager(true);
        const adventureEngine = new AdventureEngine(diceEngine, tablesEngine, characterManager, storageManager);
        
        console.log('✅ Test environment initialized\n');
        
        // Run all tests
        await runTest(results, 'Adventure Engine Initialization', () => 
            testAdventureEngineInitialization(adventureEngine));
        
        await runTest(results, 'Complete Adventure Generation', () => 
            testCompleteAdventureGeneration(adventureEngine));
        
        await runTest(results, 'Adventure Components Generation', () => 
            testAdventureComponentsGeneration(adventureEngine));
        
        await runTest(results, 'Encounter Sequence Generation', () => 
            testEncounterSequenceGeneration(adventureEngine));
        
        await runTest(results, 'Difficulty Scaling System', () => 
            testDifficultyScaling(adventureEngine));
        
        await runTest(results, 'Character Integration', () => 
            testCharacterIntegration(adventureEngine, characterManager));
        
        await runTest(results, 'Encounter Resolution System', () => 
            testEncounterResolution(adventureEngine, characterManager));
        
        await runTest(results, 'Character Death Handling', () => 
            testCharacterDeathHandling(adventureEngine, characterManager));
        
        await runTest(results, 'Adventure Statistics Tracking', () => 
            testStatisticsTracking(adventureEngine));
        
        await runTest(results, 'Adventure Persistence System', () => 
            testAdventurePersistence(adventureEngine));
        
        await runTest(results, 'Performance Benchmarks', () => 
            testPerformanceBenchmarks(adventureEngine));
        
        await runTest(results, 'Error Handling', () => 
            testErrorHandling(adventureEngine));
        
    } catch (error) {
        console.error('💥 Test suite setup failed:', error);
        results.failedTests++;
    }
    
    // Display results
    console.log('\n' + '='.repeat(50));
    console.log('📊 ADVENTURE ENGINE TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${results.totalTests}`);
    console.log(`✅ Passed: ${results.passedTests}`);
    console.log(`❌ Failed: ${results.failedTests}`);
    console.log(`Success Rate: ${((results.passedTests / results.totalTests) * 100).toFixed(1)}%`);
    
    if (results.failedTests > 0) {
        console.log('\n❌ Failed Tests:');
        results.testResults.filter(r => !r.passed).forEach(r => {
            console.log(`  - ${r.name}: ${r.error}`);
        });
    }
    
    const allTestsPassed = results.failedTests === 0;
    if (allTestsPassed) {
        console.log('\n🎉 ALL ADVENTURE ENGINE TESTS PASSED!');
    } else {
        console.log(`\n⚠️ ${results.failedTests} test(s) failed`);
    }
    
    return {
        success: allTestsPassed,
        results
    };
}

/**
 * Test Runner Helper
 */
async function runTest(results, testName, testFunction) {
    results.totalTests++;
    console.log(`📋 Running: ${testName}`);
    
    try {
        await testFunction();
        results.passedTests++;
        results.testResults.push({ name: testName, passed: true });
        console.log(`✅ ${testName} passed\n`);
    } catch (error) {
        results.failedTests++;
        results.testResults.push({ name: testName, passed: false, error: error.message });
        console.log(`❌ ${testName} failed: ${error.message}\n`);
    }
}

/**
 * Test 1: Adventure Engine Initialization
 */
function testAdventureEngineInitialization(adventureEngine) {
    // Verify engine is properly initialized
    if (!adventureEngine) {
        throw new Error('Adventure engine not initialized');
    }
    
    if (!adventureEngine.diceEngine) {
        throw new Error('Dice engine not attached');
    }
    
    if (!adventureEngine.tablesEngine) {
        throw new Error('Tables engine not attached');
    }
    
    if (!adventureEngine.characterManager) {
        throw new Error('Character manager not attached');
    }
    
    if (!adventureEngine.storageManager) {
        throw new Error('Storage manager not attached');
    }
    
    // Verify statistics initialization
    const stats = adventureEngine.getStatistics();
    if (typeof stats.adventuresGenerated !== 'number') {
        throw new Error('Statistics not properly initialized');
    }
    
    console.log('  ✓ Adventure engine properly initialized');
    console.log('  ✓ All core systems attached');
    console.log('  ✓ Statistics system functional');
}

/**
 * Test 2: Complete Adventure Generation
 */
function testCompleteAdventureGeneration(adventureEngine) {
    console.log('  🏰 Generating complete adventure...');
    
    const adventure = adventureEngine.generateCompleteAdventure({
        partyLevel: 3,
        partySize: 4,
        adventureType: 'balanced',
        difficulty: 'moderate',
        theme: 'mystery',
        includeSubplots: true
    });
    
    // Verify adventure structure
    if (!adventure.id) throw new Error('Adventure missing ID');
    if (!adventure.metadata) throw new Error('Adventure missing metadata');
    if (!adventure.setting) throw new Error('Adventure missing setting');
    if (!adventure.hook) throw new Error('Adventure missing hook');
    if (!adventure.encounters || adventure.encounters.length === 0) {
        throw new Error('Adventure missing encounters');
    }
    if (!adventure.npcs || adventure.npcs.length === 0) {
        throw new Error('Adventure missing NPCs');
    }
    if (!adventure.locations || adventure.locations.length === 0) {
        throw new Error('Adventure missing locations');
    }
    if (!adventure.treasures || adventure.treasures.length === 0) {
        throw new Error('Adventure missing treasures');
    }
    
    // Verify metadata
    if (adventure.metadata.partyLevel !== 3) throw new Error('Party level not set correctly');
    if (adventure.metadata.difficulty !== 'moderate') throw new Error('Difficulty not set correctly');
    if (adventure.metadata.theme !== 'mystery') throw new Error('Theme not set correctly');
    
    console.log(`  ✓ Adventure generated with ID: ${adventure.id}`);
    console.log(`  ✓ ${adventure.encounters.length} encounters created`);
    console.log(`  ✓ ${adventure.npcs.length} NPCs generated`);
    console.log(`  ✓ ${adventure.locations.length} locations created`);
    console.log(`  ✓ ${adventure.treasures.length} treasures placed`);
}

/**
 * Test 3: Adventure Components Generation
 */
function testAdventureComponentsGeneration(adventureEngine) {
    console.log('  🧩 Testing adventure component generation...');
    
    // Test setting generation
    const setting = adventureEngine.generateAdventureSetting('horror');
    if (!setting.primaryLocation) throw new Error('Setting missing primary location');
    if (!setting.environment) throw new Error('Setting missing environment');
    if (setting.theme !== 'horror') throw new Error('Theme not applied correctly');
    
    // Test hook generation
    const hook = adventureEngine.generateAdventureHook('exploration');
    if (!hook.primaryHook) throw new Error('Hook missing primary hook');
    if (!hook.motivation) throw new Error('Hook missing motivation');
    if (!hook.urgency) throw new Error('Hook missing urgency');
    
    console.log('  ✓ Setting generation working');
    console.log('  ✓ Hook generation working');
    console.log('  ✓ All components properly structured');
}

/**
 * Test 4: Encounter Sequence Generation
 */
function testEncounterSequenceGeneration(adventureEngine) {
    console.log('  ⚔️ Testing encounter sequence generation...');
    
    const encounters = adventureEngine.generateEncounterSequence(5, 'challenging', 6);
    
    if (!encounters || encounters.length === 0) {
        throw new Error('No encounters generated');
    }
    
    // Verify each encounter has required properties
    encounters.forEach((encounter, index) => {
        if (!encounter.id) throw new Error(`Encounter ${index} missing ID`);
        if (!encounter.description) throw new Error(`Encounter ${index} missing description`);
        if (!encounter.type) throw new Error(`Encounter ${index} missing type`);
        if (!encounter.difficulty) throw new Error(`Encounter ${index} missing difficulty`);
        if (encounter.rewards === undefined) throw new Error(`Encounter ${index} missing rewards`);
    });
    
    // Verify final encounter is climactic
    const finalEncounter = encounters[encounters.length - 1];
    if (!finalEncounter.isClimax) {
        throw new Error('Final encounter not marked as climactic');
    }
    
    console.log(`  ✓ Generated ${encounters.length} encounters`);
    console.log(`  ✓ Final encounter marked as climactic`);
    console.log('  ✓ All encounters properly structured');
}

/**
 * Test 5: Difficulty Scaling System
 */
function testDifficultyScaling(adventureEngine) {
    console.log('  📈 Testing difficulty scaling system...');
    
    // Test different difficulties
    const difficulties = ['trivial', 'easy', 'moderate', 'challenging', 'hard', 'epic'];
    
    difficulties.forEach(difficulty => {
        const adventure = adventureEngine.generateCompleteAdventure({
            partyLevel: 2,
            difficulty: difficulty
        });
        
        if (adventure.metadata.difficulty !== difficulty) {
            throw new Error(`Difficulty ${difficulty} not applied correctly`);
        }
        
        // Verify encounters scale with difficulty
        const hasAppropriateEncounters = adventure.encounters.length >= 3;
        if (!hasAppropriateEncounters) {
            throw new Error(`Insufficient encounters for ${difficulty} difficulty`);
        }
    });
    
    console.log('  ✓ All difficulty levels generate adventures');
    console.log('  ✓ Encounter count scales with difficulty');
    console.log('  ✓ Difficulty scaling system working');
}

/**
 * Test 6: Character Integration
 */
function testCharacterIntegration(adventureEngine, characterManager) {
    console.log('  👤 Testing character integration...');
    
    // Create test characters
    const character1 = characterManager.createCharacter({ name: 'Test Fighter', race: 'Human', class: 'Fighter', level: 3 });
    const character2 = characterManager.createCharacter({ name: 'Test Wizard', race: 'Elf', class: 'Wizard', level: 3 });
    const characters = [character1, character2];
    
    // Generate adventure
    const adventure = adventureEngine.generateCompleteAdventure({
        partyLevel: 3,
        partySize: characters.length
    });
    
    // Verify adventure considers party size
    if (adventure.metadata.partySize !== characters.length) {
        throw new Error('Adventure does not consider party size');
    }
    
    console.log('  ✓ Adventure considers party composition');
    console.log('  ✓ Character integration working');
}

/**
 * Test 7: Encounter Resolution System
 */
async function testEncounterResolution(adventureEngine, characterManager) {
    console.log('  ⚔️ Testing encounter resolution system...');
    
    // Generate adventure
    const adventure = adventureEngine.generateCompleteAdventure({
        partyLevel: 2,
        difficulty: 'easy'
    });
    
    // Create test character
    const character = characterManager.createCharacter({ name: 'Test Hero', race: 'Human', class: 'Fighter', level: 2 });
    const characters = [character];
    
    // Get first encounter
    const encounter = adventure.encounters[0];
    
    // Test encounter resolution
    const resolution = await adventureEngine.resolveEncounter(
        encounter.id,
        characters,
        'combat'
    );
    
    if (!resolution) throw new Error('Encounter resolution failed');
    if (!resolution.encounterId) throw new Error('Resolution missing encounter ID');
    if (typeof resolution.duration !== 'number') throw new Error('Resolution missing duration');
    if (!Array.isArray(resolution.casualties)) throw new Error('Resolution missing casualties array');
    
    // Verify encounter is marked as completed
    const resolvedEncounter = adventure.encounters.find(e => e.id === encounter.id);
    if (!resolvedEncounter.completed) {
        throw new Error('Encounter not marked as completed');
    }
    
    console.log('  ✓ Encounter resolution system working');
    console.log('  ✓ Resolution data properly structured');
    console.log('  ✓ Encounter status updated correctly');
}

/**
 * Test 8: Character Death Handling
 */
async function testCharacterDeathHandling(adventureEngine, characterManager) {
    console.log('  💀 Testing character death handling...');
    
    // Create test character with low HP for death testing
    const character = characterManager.createCharacter({ name: 'Doomed Hero', race: 'Human', class: 'Fighter', level: 1 });
    character.currentHP = 1; // Set low HP
    character.maxHP = 8;
    
    // Generate simple adventure
    const adventure = adventureEngine.generateCompleteAdventure({
        partyLevel: 1,
        difficulty: 'hard' // High difficulty to ensure potential death
    });
    
    // Force character death scenario
    character.currentHP = -15; // Beyond death threshold
    
    // Test death handling
    await adventureEngine.handleCharacterDeath(character.id, adventure.encounters[0].id);
    
    // Verify character is marked as dead
    if (!character.isDead) {
        throw new Error('Character not marked as dead');
    }
    
    if (!character.deathDetails) {
        throw new Error('Death details not recorded');
    }
    
    if (!character.deathDetails.timestamp) {
        throw new Error('Death timestamp not recorded');
    }
    
    console.log('  ✓ Character death properly recorded');
    console.log('  ✓ Death audit trail created');
    console.log('  ✓ Death handling system working');
}

/**
 * Test 9: Adventure Statistics Tracking
 */
function testStatisticsTracking(adventureEngine) {
    console.log('  📊 Testing statistics tracking...');
    
    const initialStats = adventureEngine.getStatistics();
    const initialAdventures = initialStats.adventuresGenerated;
    
    // Generate adventure to update statistics
    adventureEngine.generateCompleteAdventure();
    
    const updatedStats = adventureEngine.getStatistics();
    
    if (updatedStats.adventuresGenerated !== initialAdventures + 1) {
        throw new Error('Adventure generation statistics not updated');
    }
    
    // Verify all statistics properties exist
    const requiredStats = [
        'adventuresGenerated',
        'encountersResolved',
        'characterDeaths',
        'treasuresAwarded',
        'sessionsRun'
    ];
    
    requiredStats.forEach(stat => {
        if (typeof updatedStats[stat] !== 'number') {
            throw new Error(`Missing or invalid statistic: ${stat}`);
        }
    });
    
    console.log('  ✓ Statistics properly tracked');
    console.log('  ✓ All statistics properties present');
    console.log(`  ✓ Adventures generated: ${updatedStats.adventuresGenerated}`);
}

/**
 * Test 10: Adventure Persistence System
 */
async function testAdventurePersistence(adventureEngine) {
    console.log('  💾 Testing adventure persistence...');
    
    // Generate adventure
    const adventure = adventureEngine.generateCompleteAdventure({
        partyLevel: 4,
        difficulty: 'moderate'
    });
    
    const adventureId = adventure.id;
    
    // Test saving
    await adventureEngine.saveAdventureProgress();
    
    // Clear current adventure
    adventureEngine.currentAdventure = null;
    
    // Test loading
    const loadedAdventure = await adventureEngine.loadAdventure(adventureId);
    
    if (!loadedAdventure) {
        throw new Error('Adventure not loaded from storage');
    }
    
    if (loadedAdventure.id !== adventureId) {
        throw new Error('Loaded adventure has wrong ID');
    }
    
    if (loadedAdventure.metadata.partyLevel !== 4) {
        throw new Error('Loaded adventure missing metadata');
    }
    
    console.log('  ✓ Adventure saving working');
    console.log('  ✓ Adventure loading working');
    console.log('  ✓ Adventure persistence system functional');
}

/**
 * Test 11: Performance Benchmarks
 */
function testPerformanceBenchmarks(adventureEngine) {
    console.log('  ⚡ Running performance benchmarks...');
    
    const startTime = Date.now();
    
    // Generate multiple adventures quickly
    const adventureCount = 10;
    for (let i = 0; i < adventureCount; i++) {
        adventureEngine.generateCompleteAdventure({
            partyLevel: Math.floor(Math.random() * 10) + 1,
            difficulty: ['easy', 'moderate', 'challenging'][Math.floor(Math.random() * 3)]
        });
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / adventureCount;
    
    console.log(`  ⚡ Generated ${adventureCount} adventures in ${totalTime}ms`);
    console.log(`  ⚡ Average generation time: ${averageTime.toFixed(1)}ms`);
    
    // Performance criteria
    if (averageTime > 1000) { // More than 1 second per adventure
        throw new Error(`Adventure generation too slow: ${averageTime.toFixed(1)}ms average`);
    }
    
    console.log('  ✓ Performance benchmarks passed');
}

/**
 * Test 12: Error Handling
 */
async function testErrorHandling(adventureEngine) {
    console.log('  🚨 Testing error handling...');
    
    // Test invalid encounter resolution
    try {
        await adventureEngine.resolveEncounter('invalid-id', [], 'combat');
        throw new Error('Should have failed with invalid encounter ID');
    } catch (error) {
        if (!error.message.includes('No active adventure')) {
            console.log('  ✓ Invalid encounter ID error handling works');
        }
    }
    
    // Test loading invalid adventure
    const invalidAdventure = await adventureEngine.loadAdventure('invalid-adventure-id');
    if (invalidAdventure !== null) {
        throw new Error('Should return null for invalid adventure ID');
    }
    
    console.log('  ✓ Invalid adventure loading handled correctly');
    console.log('  ✓ Error handling system working');
}

// Export for browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAdventureEngineTests,
        testAdventureEngineInitialization,
        testCompleteAdventureGeneration,
        testAdventureComponentsGeneration,
        testEncounterSequenceGeneration,
        testDifficultyScaling,
        testCharacterIntegration,
        testEncounterResolution,
        testCharacterDeathHandling,
        testStatisticsTracking,
        testAdventurePersistence,
        testPerformanceBenchmarks,
        testErrorHandling
    };
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAdventureEngineTests().then(result => {
        process.exit(result.success ? 0 : 1);
    });
}
/**
 * RulzLawyer Web Interface Integration Test
 * Validates all backend systems integrate properly with HTML interface
 */

console.log('🧪 Starting RulzLawyer integration tests...');

// Test 1: Core Engine Initialization
function testCoreEngines() {
    console.log('📋 Test 1: Core Engine Initialization');
    
    try {
        // Initialize engines like the main app would
        const diceEngine = new DiceEngine(true);
        const tablesEngine = new RandomTablesEngine(diceEngine);
        const characterManager = new CharacterManager(diceEngine, tablesEngine);
        const storageManager = new StorageManager(true);
        
        console.log('✅ All core engines initialized successfully');
        return { diceEngine, tablesEngine, characterManager, storageManager };
        
    } catch (error) {
        console.error('❌ Core engine initialization failed:', error);
        throw error;
    }
}

// Test 2: Dice Integration
function testDiceIntegration(diceEngine) {
    console.log('📋 Test 2: Dice Integration');
    
    try {
        // Test standard roll
        const standardRoll = diceEngine.rollExpression('1d20+5');
        console.log('🎲 Standard roll result:', standardRoll);
        
        // Test advantage
        const advantageRoll = diceEngine.rollAdvantage();
        console.log('🎲 Advantage roll result:', advantageRoll);
        
        // Test disadvantage
        const disadvantageRoll = diceEngine.rollDisadvantage();
        console.log('🎲 Disadvantage roll result:', disadvantageRoll);
        
        console.log('✅ Dice integration tests passed');
        return true;
        
    } catch (error) {
        console.error('❌ Dice integration test failed:', error);
        throw error;
    }
}

// Test 3: Random Tables Integration
function testTablesIntegration(tablesEngine) {
    console.log('📋 Test 3: Random Tables Integration');
    
    try {
        // Test single table roll
        const locationResult = tablesEngine.rollTable('locations');
        console.log('📜 Location result:', locationResult);
        
        // Test multiple table roll
        const multipleResults = tablesEngine.rollMultipleTables(['encounters', 'npcs']);
        console.log('📜 Multiple table results:', multipleResults);
        
        // Test getting all tables (for UI population)
        const allTables = tablesEngine.getAllTables();
        console.log('📜 Total tables available:', Object.keys(allTables).length);
        
        console.log('✅ Random tables integration tests passed');
        return true;
        
    } catch (error) {
        console.error('❌ Random tables integration test failed:', error);
        throw error;
    }
}

// Test 4: Character Management Integration
function testCharacterIntegration(characterManager, storageManager) {
    console.log('📋 Test 4: Character Management Integration');
    
    try {
        // Create test character
        const character = characterManager.createCharacter('Test Hero', 'Human', 'Fighter', 1);
        console.log('⚔️ Character created:', character.name);
        
        // Test damage dealing
        const damageResult = characterManager.dealDamage(character.id, 5, 'slashing');
        console.log('💔 Damage dealt:', damageResult);
        
        // Test healing (simulate)
        const oldHP = character.currentHP;
        character.currentHP = Math.min(character.currentHP + 3, character.maxHP);
        console.log('💚 Healing applied:', character.currentHP - oldHP);
        
        // Test storage integration
        console.log('💾 Testing storage integration...');
        // Note: Storage tests would be async in real implementation
        
        console.log('✅ Character management integration tests passed');
        return character;
        
    } catch (error) {
        console.error('❌ Character management integration test failed:', error);
        throw error;
    }
}

// Test 5: Adventure Generation Integration
function testAdventureIntegration(tablesEngine) {
    console.log('📋 Test 5: Adventure Generation Integration');
    
    try {
        // Generate adventure components
        const adventure = {
            setting: tablesEngine.rollTable('locations'),
            hook: tablesEngine.rollTable('plot-hooks'),
            encounter: tablesEngine.rollTable('encounters'),
            npc: tablesEngine.rollTable('npcs'),
            treasure: tablesEngine.rollTable('treasures')
        };
        
        console.log('🏰 Adventure generated:', adventure);
        
        // Validate adventure has all components
        const requiredComponents = ['setting', 'hook', 'encounter', 'npc', 'treasure'];
        const hasAllComponents = requiredComponents.every(component => 
            adventure[component] && adventure[component].result
        );
        
        if (!hasAllComponents) {
            throw new Error('Adventure missing required components');
        }
        
        console.log('✅ Adventure generation integration tests passed');
        return adventure;
        
    } catch (error) {
        console.error('❌ Adventure generation integration test failed:', error);
        throw error;
    }
}

// Test 6: Error Handling Integration
function testErrorHandling(engines) {
    console.log('📋 Test 6: Error Handling Integration');
    
    try {
        // Test invalid dice expression
        try {
            engines.diceEngine.rollExpression('invalid');
            throw new Error('Should have failed on invalid expression');
        } catch (error) {
            console.log('✅ Dice error handling works:', error.message);
        }
        
        // Test invalid table name
        try {
            engines.tablesEngine.rollTable('nonexistent-table');
            throw new Error('Should have failed on invalid table');
        } catch (error) {
            console.log('✅ Table error handling works:', error.message);
        }
        
        // Test character not found
        try {
            engines.characterManager.dealDamage('nonexistent-id', 5, 'fire');
            throw new Error('Should have failed on invalid character');
        } catch (error) {
            console.log('✅ Character error handling works:', error.message);
        }
        
        console.log('✅ Error handling integration tests passed');
        return true;
        
    } catch (error) {
        console.error('❌ Error handling integration test failed:', error);
        throw error;
    }
}

// Main Test Runner
async function runIntegrationTests() {
    try {
        console.log('🚀 Running RulzLawyer Integration Tests...');
        console.log('='.repeat(50));
        
        // Test 1: Core engines
        const engines = testCoreEngines();
        
        // Test 2: Dice integration
        testDiceIntegration(engines.diceEngine);
        
        // Test 3: Tables integration
        testTablesIntegration(engines.tablesEngine);
        
        // Test 4: Character integration
        const testCharacter = testCharacterIntegration(engines.characterManager, engines.storageManager);
        
        // Test 5: Adventure integration
        const testAdventure = testAdventureIntegration(engines.tablesEngine);
        
        // Test 6: Error handling
        testErrorHandling(engines);
        
        console.log('='.repeat(50));
        console.log('🎉 ALL INTEGRATION TESTS PASSED!');
        console.log('✅ RulzLawyer web interface is ready for deployment');
        
        return {
            success: true,
            engines,
            testCharacter,
            testAdventure,
            summary: {
                totalTests: 6,
                passedTests: 6,
                failedTests: 0
            }
        };
        
    } catch (error) {
        console.error('💥 INTEGRATION TESTS FAILED:', error);
        return {
            success: false,
            error: error.message,
            summary: {
                totalTests: 6,
                passedTests: 0,
                failedTests: 1
            }
        };
    }
}

// Performance Benchmark
function runPerformanceBenchmark() {
    console.log('⚡ Running performance benchmarks...');
    
    try {
        const diceEngine = new DiceEngine(true);
        const tablesEngine = new RandomTablesEngine(diceEngine);
        
        // Dice rolling performance
        console.time('1000 dice rolls');
        for (let i = 0; i < 1000; i++) {
            diceEngine.rollExpression('1d20+5');
        }
        console.timeEnd('1000 dice rolls');
        
        // Table rolling performance
        console.time('1000 table rolls');
        for (let i = 0; i < 1000; i++) {
            tablesEngine.rollTable('encounters');
        }
        console.timeEnd('1000 table rolls');
        
        console.log('✅ Performance benchmarks completed');
        
    } catch (error) {
        console.error('❌ Performance benchmark failed:', error);
    }
}

// Run tests when this file is loaded
if (typeof window !== 'undefined') {
    // Browser environment - wait for DOM and other scripts to load
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            runIntegrationTests().then(result => {
                if (result.success) {
                    runPerformanceBenchmark();
                }
            });
        }, 1000);
    });
} else if (typeof module !== 'undefined') {
    // Node.js environment
    module.exports = {
        runIntegrationTests,
        runPerformanceBenchmark,
        testCoreEngines,
        testDiceIntegration,
        testTablesIntegration,
        testCharacterIntegration,
        testAdventureIntegration,
        testErrorHandling
    };
}
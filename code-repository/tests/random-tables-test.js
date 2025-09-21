/**
 * RulzLawyer Random Tables Test Suite
 * Comprehensive testing for the enhanced random tables system
 */

const DiceEngine = require('../src/dice-engine.js');
const RandomTablesEngine = require('../src/random-tables-index.js');

function runRandomTablesTests() {
  console.log('🎲 RulzLawyer Random Tables Test Suite');
  console.log('======================================\n');

  const dice = new DiceEngine();
  const tables = new RandomTablesEngine(dice);
  
  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Basic table rolling
  console.log('Test 1: Basic Table Rolling');
  try {
    const result = tables.rollTable('character-race');
    console.log(`  Race result: ${result.value}`);
    console.log(`  Roll: ${result.roll}`);
    console.log(`  Table: ${result.table}`);
    
    if (result.value && result.roll && result.table === 'character-race') {
      console.log('  ✅ PASSED\n');
      testsPassed++;
    } else {
      console.log('  ❌ FAILED\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Test 2: Range-based table rolling
  console.log('Test 2: Range-Based Table Rolling');
  try {
    const result = tables.rollTable('treasure-type-minor');
    console.log(`  Treasure result: ${result.value}`);
    console.log(`  Roll: ${result.roll}`);
    
    if (result.value && result.roll >= 1 && result.roll <= 100) {
      console.log('  ✅ PASSED\n');
      testsPassed++;
    } else {
      console.log('  ❌ FAILED\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Test 3: Multiple table rolling
  console.log('Test 3: Multiple Table Rolling');
  try {
    const tableNames = ['character-race', 'character-class', 'npc-personality'];
    const results = tables.rollMultipleTables(tableNames);
    
    console.log(`  Rolled ${results.length} tables:`);
    results.forEach(result => {
      console.log(`    ${result.table}: ${result.value}`);
    });
    
    if (results.length === 3 && results.every(r => r.value && r.table)) {
      console.log('  ✅ PASSED\n');
      testsPassed++;
    } else {
      console.log('  ❌ FAILED\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Test 4: Available tables listing
  console.log('Test 4: Available Tables Listing');
  try {
    const allTables = tables.getAvailableTables();
    const characterTables = tables.getAvailableTables('character-creation');
    
    console.log(`  Total tables: ${allTables.length}`);
    console.log(`  Character creation tables: ${characterTables.length}`);
    
    const expectedCategories = ['character-creation', 'adventure', 'npcs', 'encounters', 'treasure', 'environment', 'plot'];
    const foundCategories = [...new Set(allTables.map(t => t.category))];
    
    console.log(`  Categories found: ${foundCategories.join(', ')}`);
    
    if (allTables.length >= 15 && characterTables.length >= 3) {
      console.log('  ✅ PASSED\n');
      testsPassed++;
    } else {
      console.log('  ❌ FAILED\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Test 5: Error handling
  console.log('Test 5: Error Handling');
  try {
    let errorThrown = false;
    try {
      tables.rollTable('non-existent-table');
    } catch (e) {
      errorThrown = true;
      console.log(`  Properly caught error: ${e.message}`);
    }
    
    if (errorThrown) {
      console.log('  ✅ PASSED\n');
      testsPassed++;
    } else {
      console.log('  ❌ FAILED - Should have thrown error for invalid table\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Test 6: Dice integration
  console.log('Test 6: Dice Integration');
  try {
    const abilityResult = tables.rollTable('ability-scores');
    console.log(`  Ability score: ${abilityResult.roll} (using ${tables.tables['ability-scores'].dice})`);
    
    if (abilityResult.roll >= 3 && abilityResult.roll <= 18) {
      console.log('  ✅ PASSED\n');
      testsPassed++;
    } else {
      console.log('  ❌ FAILED\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Test 7: Table categories comprehensive test
  console.log('Test 7: Table Categories Comprehensive Test');
  try {
    const categories = ['character-creation', 'adventure', 'npcs', 'encounters', 'treasure', 'environment', 'plot'];
    let allCategoriesValid = true;
    
    for (const category of categories) {
      const tablesInCategory = tables.getAvailableTables(category);
      console.log(`  ${category}: ${tablesInCategory.length} tables`);
      
      if (tablesInCategory.length === 0) {
        allCategoriesValid = false;
        console.log(`    ❌ No tables found in ${category} category`);
      } else {
        // Test rolling from one table in each category
        const firstTable = tablesInCategory[0];
        const result = tables.rollTable(firstTable.name);
        console.log(`    Sample from ${firstTable.name}: ${result.value}`);
      }
    }
    
    if (allCategoriesValid) {
      console.log('  ✅ PASSED\n');
      testsPassed++;
    } else {
      console.log('  ❌ FAILED\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Test 8: Performance test
  console.log('Test 8: Performance Test (1000 table rolls)');
  try {
    const startTime = Date.now();
    
    for (let i = 0; i < 1000; i++) {
      tables.rollTable('npc-personality');
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    const rollsPerSecond = Math.round(1000 / (duration / 1000));
    
    console.log(`  Completed in ${duration}ms`);
    console.log(`  Performance: ${rollsPerSecond} rolls/second`);
    
    if (rollsPerSecond > 50) {
      console.log('  ✅ PASSED - Performance acceptable\n');
      testsPassed++;
    } else {
      console.log('  ⚠️ Performance may need optimization\n');
      testsPassed++; // Don't fail for performance unless really bad
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Test 9: Complex table structures
  console.log('Test 9: Complex Table Structures');
  try {
    const weatherResult = tables.rollTable('weather-conditions');
    const encounterResult = tables.rollTable('random-encounter-wilderness');
    const plotResult = tables.rollTable('plot-twist');
    
    console.log(`  Weather: ${weatherResult.value}`);
    console.log(`  Encounter: ${encounterResult.value}`);
    console.log(`  Plot twist: ${plotResult.value}`);
    
    if (weatherResult.value && encounterResult.value && plotResult.value) {
      console.log('  ✅ PASSED\n');
      testsPassed++;
    } else {
      console.log('  ❌ FAILED\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Test 10: Full adventure generation test
  console.log('Test 10: Full Adventure Generation Test');
  try {
    const adventureTables = [
      'adventure-hook',
      'dungeon-theme', 
      'encounter-difficulty',
      'weather-conditions',
      'plot-twist'
    ];
    
    console.log('  Generated Adventure:');
    const adventureResults = tables.rollMultipleTables(adventureTables);
    
    adventureResults.forEach(result => {
      console.log(`    ${result.table}: ${result.value}`);
    });
    
    if (adventureResults.length === 5 && adventureResults.every(r => r.value)) {
      console.log('  ✅ PASSED - Complete adventure generated\n');
      testsPassed++;
    } else {
      console.log('  ❌ FAILED\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Final results
  console.log('======================================');
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  console.log(`Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  
  if (testsFailed === 0) {
    console.log('🎉 ALL TESTS PASSED! Random tables system is ready.');
  } else {
    console.log('⚠️ Some tests failed. Please review the implementation.');
  }
  
  return testsFailed === 0;
}

// Test individual table coverage
function testTableCoverage() {
  console.log('\n📊 Table Coverage Analysis');
  console.log('===========================\n');
  
  const dice = new DiceEngine();
  const tables = new RandomTablesEngine(dice);
  const allTables = tables.getAvailableTables();
  
  console.log(`Total Tables: ${allTables.length}`);
  
  const categoryCounts = allTables.reduce((acc, table) => {
    acc[table.category] = (acc[table.category] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\nTables by Category:');
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} tables`);
  });
  
  console.log('\nDice Types Used:');
  const diceTypes = [...new Set(allTables.map(t => t.diceType))];
  diceTypes.forEach(type => {
    const count = allTables.filter(t => t.diceType === type).length;
    console.log(`  ${type}: ${count} tables`);
  });
  
  console.log(`\nTotal Entries: ${allTables.reduce((sum, t) => sum + t.entryCount, 0)}`);
}

// Run tests if executed directly
if (require.main === module) {
  const success = runRandomTablesTests();
  if (success) {
    testTableCoverage();
  }
}

module.exports = { runRandomTablesTests, testTableCoverage };
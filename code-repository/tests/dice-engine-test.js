/**
 * RulzLawyer Dice Engine Test Suite
 * Comprehensive testing for the dice rolling system
 */

// Import the DiceEngine
const DiceEngine = require('../src/dice-engine.js');

// Test runner function
function runTests() {
  console.log('🎲 RulzLawyer Dice Engine Test Suite');
  console.log('=====================================\n');

  const dice = new DiceEngine();
  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Basic dice rolling
  console.log('Test 1: Basic Dice Rolling');
  try {
    const result = dice.rollExpression('1d20');
    console.log(`  Roll result: ${result.total}`);
    console.log(`  Dice: [${result.dice.join(', ')}]`);
    console.log(`  Execution time: ${result.executionTime.toFixed(3)}ms`);
    
    if (result.total >= 1 && result.total <= 20 && result.dice.length === 1) {
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

  // Test 2: Complex expressions
  console.log('Test 2: Complex Expressions');
  try {
    const result = dice.rollExpression('3d6+2');
    console.log(`  Roll result: ${result.total}`);
    console.log(`  Dice: [${result.dice.join(', ')}]`);
    console.log(`  Modifier: ${result.modifier}`);
    console.log(`  Breakdown:`, result.breakdown);
    
    if (result.total >= 5 && result.total <= 20 && result.dice.length === 3 && result.modifier === 2) {
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

  // Test 3: Advantage rolling
  console.log('Test 3: Advantage Rolling');
  try {
    const result = dice.rollAdvantage('1d20');
    console.log(`  Chosen roll: ${result.chosenRoll}`);
    console.log(`  Discarded roll: ${result.discardedRoll}`);
    console.log(`  Advantage: ${result.advantage}`);
    
    if (result.advantage && result.chosenRoll >= result.discardedRoll) {
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

  // Test 4: Disadvantage rolling
  console.log('Test 4: Disadvantage Rolling');
  try {
    const result = dice.rollDisadvantage('1d20');
    console.log(`  Chosen roll: ${result.chosenRoll}`);
    console.log(`  Discarded roll: ${result.discardedRoll}`);
    console.log(`  Disadvantage: ${result.disadvantage}`);
    
    if (result.disadvantage && result.chosenRoll <= result.discardedRoll) {
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

  // Test 5: Expression validation
  console.log('Test 5: Expression Validation');
  const validExpressions = ['1d20', '3d6+2', '2d8-1', '1d4+1d6', '4d6'];
  const invalidExpressions = ['1d21', '0d6', '1d', 'd20', '1x20', ''];
  
  let validationPassed = true;
  
  validExpressions.forEach(expr => {
    if (!dice.validateExpression(expr)) {
      console.log(`  ❌ Valid expression "${expr}" marked as invalid`);
      validationPassed = false;
    }
  });
  
  invalidExpressions.forEach(expr => {
    if (dice.validateExpression(expr)) {
      console.log(`  ❌ Invalid expression "${expr}" marked as valid`);
      validationPassed = false;
    }
  });
  
  if (validationPassed) {
    console.log('  ✅ PASSED\n');
    testsPassed++;
  } else {
    console.log('  ❌ FAILED\n');
    testsFailed++;
  }

  // Test 6: Batch rolling
  console.log('Test 6: Batch Rolling');
  try {
    const expressions = ['1d20', '3d6', '1d8+2', '2d10'];
    const results = dice.rollBatch(expressions);
    
    console.log(`  Rolled ${results.length} expressions`);
    results.forEach((result, i) => {
      console.log(`    ${expressions[i]}: ${result.total}`);
    });
    
    if (results.length === expressions.length && results.every(r => r.total > 0)) {
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

  // Test 7: Statistics tracking
  console.log('Test 7: Statistics Tracking');
  try {
    // Roll a few times to generate statistics
    for (let i = 0; i < 5; i++) {
      dice.rollExpression('1d6');
    }
    
    const stats = dice.getStatistics();
    console.log(`  Total rolls: ${stats.totalRolls}`);
    console.log(`  Total dice: ${stats.totalDice}`);
    console.log(`  Average roll: ${stats.averageRoll.toFixed(2)}`);
    
    if (stats.totalRolls >= 9 && stats.totalDice >= 9) { // Including previous tests
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

  // Test 8: Distribution testing
  console.log('Test 8: Distribution Testing (100 rolls)');
  try {
    const distTest = dice.testDistribution('1d6', 100);
    console.log(`  Expression: ${distTest.expression}`);
    console.log(`  Mean: ${distTest.results.mean} (expected ~3.5)`);
    console.log(`  Std Dev: ${distTest.results.stdDev}`);
    console.log(`  Min/Max: ${distTest.results.min}/${distTest.results.max}`);
    console.log(`  Performance: ${distTest.performance.rollsPerSecond} rolls/second`);
    
    if (distTest.results.mean >= 2.5 && distTest.results.mean <= 4.5 && 
        distTest.results.min >= 1 && distTest.results.max <= 6) {
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

  // Performance test
  console.log('Performance Test: 1000 rolls of 3d6+2');
  const startTime = Date.now();
  for (let i = 0; i < 1000; i++) {
    dice.rollExpression('3d6+2');
  }
  const endTime = Date.now();
  const duration = endTime - startTime;
  const rollsPerSecond = Math.round(1000 / (duration / 1000));
  
  console.log(`  Completed in ${duration}ms`);
  console.log(`  Performance: ${rollsPerSecond} rolls/second`);
  
  if (rollsPerSecond > 100) {
    console.log('  ✅ Performance acceptable\n');
  } else {
    console.log('  ⚠️ Performance may need optimization\n');
  }

  // Final results
  console.log('=====================================');
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  console.log(`Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  
  if (testsFailed === 0) {
    console.log('🎉 ALL TESTS PASSED! Dice engine is ready.');
  } else {
    console.log('⚠️ Some tests failed. Please review the implementation.');
  }
  
  return testsFailed === 0;
}

// Run tests if executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
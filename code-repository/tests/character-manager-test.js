/**
 * RulzLawyer Character Manager Test Suite
 * Comprehensive testing for character creation, damage, death mechanics
 */

const DiceEngine = require('../src/dice-engine.js');
const RandomTablesEngine = require('../src/random-tables-index.js');
const CharacterManager = require('../src/character-manager.js');

function runCharacterManagerTests() {
  console.log('🎲 RulzLawyer Character Manager Test Suite');
  console.log('==========================================\n');

  const dice = new DiceEngine();
  const tables = new RandomTablesEngine(dice);
  const charManager = new CharacterManager(dice, tables);
  
  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Basic character creation
  console.log('Test 1: Basic Character Creation');
  try {
    const character = charManager.createCharacter({
      name: 'Test Hero',
      race: 'Human',
      class: 'Fighter'
    });
    
    console.log(`  Created character: ${character.name}`);
    console.log(`  Race: ${character.race}, Class: ${character.class}`);
    console.log(`  Level: ${character.level}, HP: ${character.hitPoints.current}/${character.hitPoints.maximum}`);
    console.log(`  Status: ${character.status}`);
    console.log(`  Abilities: STR=${character.abilities.strength} DEX=${character.abilities.dexterity} CON=${character.abilities.constitution}`);
    
    if (character.name === 'Test Hero' && 
        character.race === 'Human' && 
        character.class === 'Fighter' &&
        character.status === 'alive' &&
        character.hitPoints.maximum > 0) {
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

  // Test 2: Random character creation
  console.log('Test 2: Random Character Creation');
  try {
    const randomChar = charManager.createCharacter();
    
    console.log(`  Created random character: ${randomChar.name}`);
    console.log(`  Race: ${randomChar.race}, Class: ${randomChar.class}`);
    console.log(`  Background: ${randomChar.background}`);
    console.log(`  Starting gold: ${randomChar.equipment.money.gp} gp`);
    
    if (randomChar.name && 
        randomChar.race && 
        randomChar.class &&
        randomChar.status === 'alive') {
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

  // Test 3: Damage dealing and status changes
  console.log('Test 3: Damage Dealing and Status Changes');
  try {
    const fighter = charManager.createCharacter({
      name: 'Tank Fighter',
      class: 'Fighter'
    });
    
    const originalHp = fighter.hitPoints.current;
    console.log(`  Fighter starts with ${originalHp} HP`);
    
    // Deal moderate damage
    const damageResult = charManager.dealDamage(fighter.id, 5, 'slashing');
    console.log(`  ${damageResult.message}`);
    console.log(`  HP changed: ${damageResult.oldHp} → ${damageResult.newHp}`);
    
    if (damageResult.newHp === originalHp - 5 && fighter.hitPoints.current === originalHp - 5) {
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

  // Test 4: Character dying and death saves
  console.log('Test 4: Character Dying and Death Saves');
  try {
    const victim = charManager.createCharacter({
      name: 'Unlucky Rogue',
      class: 'Rogue'
    });
    
    // Deal massive damage (current HP + max HP = instant death)
    const massiveDamage = victim.hitPoints.maximum + victim.hitPoints.maximum;
    const damageResult = charManager.dealDamage(victim.id, massiveDamage, 'fire');
    
    console.log(`  ${damageResult.message}`);
    console.log(`  Character status: ${damageResult.newStatus}`);
    
    if (damageResult.newStatus === 'dead' && damageResult.isDead) {
      console.log('  ✅ PASSED - Massive damage correctly caused instant death\n');
      testsPassed++;
    } else {
      console.log('  ❌ FAILED - Should have caused instant death\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Test 5: Death saves progression
  console.log('Test 5: Death Saves Progression');
  try {
    const dying = charManager.createCharacter({
      name: 'Death Save Test',
      class: 'Cleric'
    });
    
    // Reduce to dying state (damage equal to current HP but not massive)
    const dyingDamage = dying.hitPoints.current + 1; // Just enough to go into negatives
    const damageResult = charManager.dealDamage(dying.id, dyingDamage, 'necrotic');
    
    console.log(`  Applied ${dyingDamage} damage, character HP: ${dying.hitPoints.current}`);
    console.log(`  Character is now ${dying.status}`);
    
    if (dying.status !== 'dying') {
      console.log('  ❌ FAILED - Character should be in dying state\n');
      testsFailed++;
    } else {
      // Make several death saves
      let deathSaveCount = 0;
      while (dying.status === 'dying' && deathSaveCount < 10) { // Prevent infinite loop
        const saveResult = charManager.makeDeathSave(dying.id);
        console.log(`  Death save ${deathSaveCount + 1}: ${saveResult.message}`);
        
        if (saveResult.statusChanged) {
          console.log(`  Status changed to: ${saveResult.newStatus}`);
          break;
        }
        deathSaveCount++;
      }
      
      if (dying.status === 'dead' || dying.status === 'unconscious') {
        console.log('  ✅ PASSED - Death saves resolved correctly\n');
        testsPassed++;
      } else {
        console.log('  ❌ FAILED - Death saves should have resolved\n');
        testsFailed++;
      }
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Test 6: Healing mechanics
  console.log('Test 6: Healing Mechanics');
  try {
    const injured = charManager.createCharacter({
      name: 'Wounded Warrior',
      class: 'Barbarian'
    });
    
    // Damage the character
    charManager.dealDamage(injured.id, 8, 'piercing');
    const damagedHp = injured.hitPoints.current;
    console.log(`  Character has ${damagedHp} HP after damage`);
    
    // Heal the character
    const healResult = charManager.healCharacter(injured.id, 5);
    console.log(`  ${healResult.message}`);
    
    if (healResult.newHp === damagedHp + 5) {
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

  // Test 7: Level up mechanics
  console.log('Test 7: Level Up Mechanics');
  try {
    const student = charManager.createCharacter({
      name: 'Advancing Student',
      class: 'Wizard'
    });
    
    const originalLevel = student.level;
    const originalMaxHp = student.hitPoints.maximum;
    
    const levelResult = charManager.levelUp(student.id);
    console.log(`  ${levelResult.message}`);
    console.log(`  Level: ${levelResult.oldLevel} → ${levelResult.newLevel}`);
    console.log(`  Max HP: ${originalMaxHp} → ${levelResult.newMaxHp}`);
    
    if (student.level === originalLevel + 1 && student.hitPoints.maximum > originalMaxHp) {
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

  // Test 8: Character death permanence
  console.log('Test 8: Character Death Permanence');
  try {
    const doomed = charManager.createCharacter({
      name: 'Doomed Character',
      class: 'Sorcerer'
    });
    
    // Kill the character with massive damage
    const massiveDamage = doomed.hitPoints.maximum * 2;
    charManager.dealDamage(doomed.id, massiveDamage, 'lightning');
    
    console.log(`  Character status after massive damage: ${doomed.status}`);
    
    // Try to set as active character (should fail)
    let cannotActivate = false;
    try {
      charManager.setActiveCharacter(doomed.id);
    } catch (error) {
      cannotActivate = true;
      console.log(`  Cannot activate dead character: ${error.message}`);
    }
    
    // Try to heal (should not work)
    const healResult = charManager.healCharacter(doomed.id, 20);
    console.log(`  Heal attempt: ${healResult.message}`);
    
    // Try to level up (should fail)
    let cannotLevel = false;
    try {
      charManager.levelUp(doomed.id);
    } catch (error) {
      cannotLevel = true;
      console.log(`  Cannot level dead character: ${error.message}`);
    }
    
    if (doomed.status === 'dead' && cannotActivate && cannotLevel && !healResult.healed) {
      console.log('  ✅ PASSED - Death permanence working correctly\n');
      testsPassed++;
    } else {
      console.log('  ❌ FAILED - Death should be permanent\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }

  // Test 9: Character roster management
  console.log('Test 9: Character Roster Management');
  try {
    // Create several characters
    const char1 = charManager.createCharacter({ name: 'Hero 1', class: 'Fighter' });
    const char2 = charManager.createCharacter({ name: 'Hero 2', class: 'Wizard' });
    const char3 = charManager.createCharacter({ name: 'Hero 3', class: 'Cleric' });
    
    // Kill one character
    charManager.dealDamage(char2.id, char2.hitPoints.maximum * 2, 'fire');
    
    const livingChars = charManager.getLivingCharacters();
    const deadChars = charManager.getDeadCharacters();
    
    console.log(`  Living characters: ${livingChars.length}`);
    console.log(`  Dead characters: ${deadChars.length}`);
    console.log(`  Living: ${livingChars.map(c => c.name).join(', ')}`);
    console.log(`  Dead: ${deadChars.map(c => c.name).join(', ')}`);
    
    if (livingChars.length >= 2 && deadChars.length >= 1) {
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

  // Test 10: Statistics tracking
  console.log('Test 10: Statistics Tracking');
  try {
    const stats = charManager.getStatistics();
    
    console.log(`  Total characters: ${stats.totalCharacters}`);
    console.log(`  Living: ${stats.livingCharacters}, Dead: ${stats.deadCharacters}`);
    console.log(`  Average level: ${stats.averageLevel}`);
    console.log(`  Most common race: ${stats.mostCommonRace}`);
    console.log(`  Most common class: ${stats.mostCommonClass}`);
    console.log(`  Death rate: ${stats.deathRate}`);
    console.log(`  Total deaths: ${stats.totalDeaths}`);
    
    if (stats.totalCharacters > 0 && 
        stats.livingCharacters >= 0 && 
        stats.deadCharacters >= 0 &&
        typeof stats.deathRate === 'string') {
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

  // Final results
  console.log('==========================================');
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  console.log(`Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  
  if (testsFailed === 0) {
    console.log('🎉 ALL TESTS PASSED! Character management system is ready.');
  } else {
    console.log('⚠️ Some tests failed. Please review the implementation.');
  }
  
  return testsFailed === 0;
}

// Performance test for character operations
function performanceTest() {
  console.log('\n⚡ Character Manager Performance Test');
  console.log('====================================\n');
  
  const dice = new DiceEngine();
  const tables = new RandomTablesEngine(dice);
  const charManager = new CharacterManager(dice, tables);
  
  // Test character creation performance
  console.log('Creating 100 random characters...');
  const startTime = Date.now();
  
  for (let i = 0; i < 100; i++) {
    charManager.createCharacter();
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  const charactersPerSecond = Math.round(100 / (duration / 1000));
  
  console.log(`Completed in ${duration}ms`);
  console.log(`Performance: ${charactersPerSecond} characters/second`);
  
  if (charactersPerSecond > 10) {
    console.log('✅ Performance acceptable');
  } else {
    console.log('⚠️ Performance may need optimization');
  }
  
  // Test damage dealing performance
  const chars = charManager.getLivingCharacters();
  console.log(`\nTesting damage performance on ${chars.length} characters...`);
  
  const damageStart = Date.now();
  
  chars.forEach(char => {
    for (let i = 0; i < 10; i++) {
      if (char.status !== 'dead') {
        charManager.dealDamage(char.id, 1, 'test');
      }
    }
  });
  
  const damageEnd = Date.now();
  const damageDuration = damageEnd - damageStart;
  const damagePerSecond = Math.round((chars.length * 10) / (damageDuration / 1000));
  
  console.log(`Damage operations completed in ${damageDuration}ms`);
  console.log(`Performance: ${damagePerSecond} damage operations/second`);
  
  if (damagePerSecond > 100) {
    console.log('✅ Damage performance acceptable');
  } else {
    console.log('⚠️ Damage performance may need optimization');
  }
}

// Run tests if executed directly
if (require.main === module) {
  const success = runCharacterManagerTests();
  if (success) {
    performanceTest();
  }
}

module.exports = { runCharacterManagerTests, performanceTest };
/**
 * RulzLawyer Storage Manager Test Suite
 * Comprehensive testing for data persistence and storage management
 * Node.js compatible with localStorage simulation
 */

// Mock localStorage for Node.js testing
class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  
  getItem(key) {
    return this.store.get(key) || null;
  }
  
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  
  removeItem(key) {
    this.store.delete(key);
  }
  
  get length() {
    return this.store.size;
  }
  
  key(index) {
    const keys = Array.from(this.store.keys());
    return keys[index] || null;
  }
  
  clear() {
    this.store.clear();
  }
}

// Set up global mocks for Node.js
if (typeof global !== 'undefined' && !global.window) {
  global.window = {
    localStorage: new MockLocalStorage(),
    addEventListener: () => {}
  };
  global.localStorage = global.window.localStorage;
  global.Blob = class MockBlob {
    constructor(data) {
      this.size = JSON.stringify(data[0]).length;
    }
  };
}

const StorageManager = require('../src/storage-manager.js');

function runStorageManagerTests() {
  console.log('🎲 RulzLawyer Storage Manager Test Suite');
  console.log('=========================================\n');

  let testsPassed = 0;
  let testsFailed = 0;
  let storageManager;

  // Test 1: Storage initialization
  console.log('Test 1: Storage Initialization');
  try {
    storageManager = new StorageManager();
    
    const initPromise = storageManager.initialize();
    
    // Since we're in Node.js without IndexedDB, it should fallback to localStorage
    initPromise.then((result) => {
      console.log(`  Storage initialized: ${result}`);
      console.log(`  Storage type: ${storageManager.storageType}`);
      console.log(`  Is initialized: ${storageManager.isInitialized}`);
      
      if (storageManager.isInitialized && storageManager.storageType === 'localStorage') {
        console.log('  ✅ PASSED\n');
        testsPassed++;
      } else {
        console.log('  ❌ FAILED\n');
        testsFailed++;
      }
      
      runRemainingTests();
    }).catch((error) => {
      console.log(`  ❌ FAILED: ${error.message}\n`);
      testsFailed++;
      runRemainingTests();
    });
    
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    testsFailed++;
    runRemainingTests();
  }

  function runRemainingTests() {
    setTimeout(async () => {
      // Test 2: Character saving
      console.log('Test 2: Character Saving');
      try {
        const testCharacter = {
          id: 'test_char_1',
          name: 'Test Hero',
          race: 'Human',
          class: 'Fighter',
          level: 1,
          abilities: {
            strength: 15,
            dexterity: 14,
            constitution: 13,
            intelligence: 12,
            wisdom: 11,
            charisma: 10
          },
          status: 'alive',
          hitPoints: { current: 10, maximum: 10, temporary: 0 },
          createdAt: Date.now()
        };

        const saveResult = await storageManager.saveCharacter(testCharacter);
        console.log(`  Character saved: ${saveResult}`);

        if (saveResult) {
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

      // Test 3: Character loading
      console.log('Test 3: Character Loading');
      try {
        const loadedCharacter = await storageManager.loadCharacter('test_char_1');
        
        if (loadedCharacter) {
          console.log(`  Loaded character: ${loadedCharacter.name}`);
          console.log(`  Race: ${loadedCharacter.race}, Class: ${loadedCharacter.class}`);
          console.log(`  Status: ${loadedCharacter.status}`);
          
          if (loadedCharacter.name === 'Test Hero' && loadedCharacter.status === 'alive') {
            console.log('  ✅ PASSED\n');
            testsPassed++;
          } else {
            console.log('  ❌ FAILED\n');
            testsFailed++;
          }
        } else {
          console.log('  ❌ FAILED - Character not found\n');
          testsFailed++;
        }
      } catch (error) {
        console.log(`  ❌ FAILED: ${error.message}\n`);
        testsFailed++;
      }

      // Test 4: Dead character immutability
      console.log('Test 4: Dead Character Immutability');
      try {
        const deadCharacter = {
          id: 'dead_char_1',
          name: 'Dead Hero',
          race: 'Elf',
          class: 'Wizard',
          level: 3,
          abilities: {
            strength: 10,
            dexterity: 16,
            constitution: 12,
            intelligence: 18,
            wisdom: 14,
            charisma: 8
          },
          status: 'dead',
          hitPoints: { current: 0, maximum: 15, temporary: 0 },
          deaths: 1,
          causeOfDeath: 'Dragon breath',
          createdAt: Date.now()
        };

        // First save (death event)
        await storageManager.saveCharacter(deadCharacter);
        console.log(`  Dead character saved: ${deadCharacter.name}`);

        // Try to modify and save again (should fail)
        let modificationBlocked = false;
        try {
          deadCharacter.level = 4; // Try to modify
          await storageManager.saveCharacter(deadCharacter);
        } catch (error) {
          modificationBlocked = true;
          console.log(`  Modification blocked: ${error.message}`);
        }

        // Load and verify it's frozen
        const loadedDead = await storageManager.loadCharacter('dead_char_1');
        const isFrozen = Object.isFrozen(loadedDead);
        
        console.log(`  Dead character is frozen: ${isFrozen}`);

        if (modificationBlocked && isFrozen) {
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

      // Test 5: Settings management
      console.log('Test 5: Settings Management');
      try {
        const testSettings = {
          theme: 'dark',
          autoSave: false,
          soundEnabled: false,
          customSetting: 'test_value'
        };

        const saveResult = await storageManager.saveSettings(testSettings);
        console.log(`  Settings saved: ${saveResult}`);

        const loadedSettings = await storageManager.loadSettings();
        console.log(`  Loaded settings theme: ${loadedSettings.theme}`);
        console.log(`  Auto-save: ${loadedSettings.autoSave}`);

        if (saveResult && loadedSettings.theme === 'dark' && loadedSettings.autoSave === false) {
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

      // Test 6: Load all characters
      console.log('Test 6: Load All Characters');
      try {
        const allCharacters = await storageManager.loadAllCharacters();
        console.log(`  Total characters loaded: ${allCharacters.length}`);
        
        const livingChars = allCharacters.filter(c => c.status !== 'dead');
        const deadChars = allCharacters.filter(c => c.status === 'dead');
        
        console.log(`  Living: ${livingChars.length}, Dead: ${deadChars.length}`);

        // Verify dead characters are frozen
        const allDeadFrozen = deadChars.every(char => Object.isFrozen(char));
        console.log(`  All dead characters frozen: ${allDeadFrozen}`);

        if (allCharacters.length >= 2 && allDeadFrozen) {
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

      // Test 7: Death audit log
      console.log('Test 7: Death Audit Log');
      try {
        const deathLog = await storageManager.getDeathAuditLog();
        console.log(`  Death audit entries: ${deathLog.length}`);
        
        if (deathLog.length > 0) {
          const firstEntry = deathLog[0];
          console.log(`  First death: ${firstEntry.characterName} - ${firstEntry.causeOfDeath}`);
          
          if (firstEntry.characterName === 'Dead Hero' && firstEntry.causeOfDeath === 'Dragon breath') {
            console.log('  ✅ PASSED\n');
            testsPassed++;
          } else {
            console.log('  ❌ FAILED\n');
            testsFailed++;
          }
        } else {
          console.log('  ❌ FAILED - No death audit entries\n');
          testsFailed++;
        }
      } catch (error) {
        console.log(`  ❌ FAILED: ${error.message}\n`);
        testsFailed++;
      }

      // Test 8: Data validation
      console.log('Test 8: Data Validation');
      try {
        const invalidCharacter = {
          id: 'invalid_char',
          name: 'Invalid Character'
          // Missing required fields
        };

        let validationFailed = false;
        try {
          await storageManager.saveCharacter(invalidCharacter);
        } catch (error) {
          validationFailed = true;
          console.log(`  Validation correctly rejected invalid data: ${error.message}`);
        }

        if (validationFailed) {
          console.log('  ✅ PASSED\n');
          testsPassed++;
        } else {
          console.log('  ❌ FAILED - Should have rejected invalid data\n');
          testsFailed++;
        }
      } catch (error) {
        console.log(`  ❌ FAILED: ${error.message}\n`);
        testsFailed++;
      }

      // Test 9: Storage statistics
      console.log('Test 9: Storage Statistics');
      try {
        const stats = await storageManager.getStorageStats();
        
        console.log(`  Storage type: ${stats.storageType}`);
        console.log(`  Total characters: ${stats.totalCharacters}`);
        console.log(`  Dead characters: ${stats.deadCharacters}`);
        console.log(`  Death audit entries: ${stats.deathAuditEntries}`);
        console.log(`  Storage used: ${stats.storageUsed} bytes`);

        if (stats.storageType && 
            typeof stats.totalCharacters === 'number' && 
            typeof stats.deadCharacters === 'number') {
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

      // Test 10: Data export/import
      console.log('Test 10: Data Export/Import');
      try {
        const exportedData = await storageManager.exportData();
        
        console.log(`  Exported data version: ${exportedData.version}`);
        console.log(`  Exported characters: ${exportedData.characters.length}`);
        console.log(`  Export metadata: Living=${exportedData.metadata.livingCharacters}, Dead=${exportedData.metadata.deadCharacters}`);

        // Validate export structure
        const hasRequiredFields = exportedData.version && 
                                  exportedData.exportDate && 
                                  Array.isArray(exportedData.characters) && 
                                  exportedData.settings && 
                                  Array.isArray(exportedData.deathAuditLog);

        if (hasRequiredFields && exportedData.characters.length >= 2) {
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

      // Test 11: Character deletion restrictions
      console.log('Test 11: Character Deletion Restrictions');
      
      // First test: delete living character
      let livingDeleteResult = false;
      try {
        livingDeleteResult = await storageManager.deleteCharacter('test_char_1');
        console.log(`  Living character deletion: ${livingDeleteResult}`);
      } catch (error) {
        console.log(`  ❌ Living character deletion failed: ${error.message}`);
      }
      
      // Second test: try to delete dead character  
      let deadDeletionBlocked = false;
      try {
        const deadResult = await storageManager.deleteCharacter('dead_char_1');
        console.log('  ❌ Dead character deletion should have been blocked but succeeded');
      } catch (error) {
        deadDeletionBlocked = true;
        console.log(`  Dead character deletion properly blocked: ${error.message}`);
      }

      if (livingDeleteResult && deadDeletionBlocked) {
        console.log('  ✅ PASSED\n');
        testsPassed++;
      } else {
        console.log('  ❌ FAILED\n');
        testsFailed++;
      }

      // Final results
      console.log('=========================================');
      console.log(`Tests Passed: ${testsPassed}`);
      console.log(`Tests Failed: ${testsFailed}`);
      console.log(`Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
      
      if (testsFailed === 0) {
        console.log('🎉 ALL TESTS PASSED! Storage management system is ready.');
      } else {
        console.log('⚠️ Some tests failed. Please review the implementation.');
      }
    }, 100); // Small delay to allow initialization
  }
}

// Performance test for storage operations
async function performanceTest() {
  console.log('\n⚡ Storage Manager Performance Test');
  console.log('===================================\n');
  
  const storageManager = new StorageManager();
  await storageManager.initialize();
  
  // Test character saving performance
  console.log('Testing character save performance (100 characters)...');
  const startTime = Date.now();
  
  const characters = [];
  for (let i = 0; i < 100; i++) {
    const character = {
      id: `perf_char_${i}`,
      name: `Performance Test ${i}`,
      race: 'Human',
      class: 'Fighter',
      level: 1,
      abilities: {
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 11,
        charisma: 10
      },
      status: 'alive',
      hitPoints: { current: 10, maximum: 10, temporary: 0 },
      createdAt: Date.now()
    };
    
    characters.push(character);
    await storageManager.saveCharacter(character);
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  const savesPerSecond = Math.round(100 / (duration / 1000));
  
  console.log(`Completed in ${duration}ms`);
  console.log(`Performance: ${savesPerSecond} saves/second`);
  
  if (savesPerSecond > 10) {
    console.log('✅ Save performance acceptable');
  } else {
    console.log('⚠️ Save performance may need optimization');
  }
  
  // Test loading performance
  console.log('\nTesting character load performance...');
  const loadStartTime = Date.now();
  
  const loadedChars = await storageManager.loadAllCharacters();
  
  const loadEndTime = Date.now();
  const loadDuration = loadEndTime - loadStartTime;
  
  console.log(`Loaded ${loadedChars.length} characters in ${loadDuration}ms`);
  console.log(`Load performance: ${Math.round(loadedChars.length / (loadDuration / 1000))} loads/second`);
  
  if (loadDuration < 1000) {
    console.log('✅ Load performance acceptable');
  } else {
    console.log('⚠️ Load performance may need optimization');
  }
}

// Run tests if executed directly
if (require.main === module) {
  runStorageManagerTests();
  
  // Run performance test after main tests
  setTimeout(() => {
    performanceTest().catch(console.error);
  }, 2000);
}

module.exports = { runStorageManagerTests, performanceTest };
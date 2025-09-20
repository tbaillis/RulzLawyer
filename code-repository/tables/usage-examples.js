/**
 * Random Tables Usage Examples v2.0
 * Demonstrates practical usage of the Modular Random Tables Data system
 * with the High-Performance Dice Rolling Subsystem
 * 
 * @version 2.0
 * @date September 20, 2025
 * @location code-repository/tables/usage-examples.js
 */

// Import the modular random tables data (would be actual import in production)
// const RandomTablesData = require('./random-tables-index.js');

/**
 * Example 1: Basic Adventure Setup Generator
 * Creates a complete adventure scenario using multiple tables
 */
function generateAdventureSetup() {
  console.log("=== ADVENTURE GENERATOR ===");
  
  // Mock dice engine results for demonstration
  const mockDiceEngine = {
    rollExpression: (expression) => {
      // Simplified mock - in reality would use actual DiceEngine
      const mockResults = {
        '1d12': Math.floor(Math.random() * 12) + 1,
        '1d10': Math.floor(Math.random() * 10) + 1,
        '2d6': Math.floor(Math.random() * 11) + 2,
        '1d20': Math.floor(Math.random() * 20) + 1,
        '1d100': Math.floor(Math.random() * 100) + 1
      };
      
      return {
        expression: expression,
        total: mockResults[expression] || 10,
        dice: [mockResults[expression] || 10]
      };
    }
  };
  
  // Generate adventure components
  const hook = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'adventure-hooks');
  const complication = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'complications');
  const weather = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'weather-conditions');
  const location = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'tavern-names');
  
  console.log(`📖 Plot Hook: ${hook.result.result}`);
  console.log(`⚡ Complication: ${complication.result.result}`);
  console.log(`🌤️  Weather: ${weather.result.result} - ${weather.result.description}`);
  console.log(`🏠 Starting Location: ${location.result.result}`);
  console.log();
  
  return {
    plotHook: hook.result.result,
    complication: complication.result.result,
    weather: weather.result.result,
    startingLocation: location.result.result,
    weatherDescription: weather.result.description
  };
}

/**
 * Example 2: NPC Generator
 * Creates detailed NPCs with names, motivations, and quirks
 */
function generateNPC() {
  console.log("=== NPC GENERATOR ===");
  
  const mockDiceEngine = {
    rollExpression: (expression) => ({
      total: Math.floor(Math.random() * 100) + 1,
      expression: expression,
      dice: [Math.floor(Math.random() * 100) + 1]
    })
  };
  
  const name = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'npc-names');
  const motivation = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'npc-motivations');
  const quirk = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'character-quirks');
  
  console.log(`👤 Name: ${name.result.result}`);
  console.log(`   ${name.result.description || 'Mysterious individual'}`);
  console.log(`🎯 Motivation: ${motivation.result.result}`);
  console.log(`🎭 Quirk: ${quirk.result.result}`);
  console.log();
  
  return {
    name: name.result.result,
    description: name.result.description,
    motivation: motivation.result.result,
    quirk: quirk.result.result
  };
}

/**
 * Example 3: Encounter Generator
 * Creates location-appropriate encounters with context
 */
function generateEncounter(environment = 'forest') {
  console.log("=== ENCOUNTER GENERATOR ===");
  
  const mockDiceEngine = {
    rollExpression: (expression) => {
      const maxRoll = expression.includes('d12') ? 12 : 
                    expression.includes('d20') ? 20 :
                    expression.includes('2d10') ? 20 : 10;
      return {
        total: Math.floor(Math.random() * maxRoll) + 1,
        expression: expression,
        dice: [Math.floor(Math.random() * maxRoll) + 1]
      };
    }
  };
  
  // Choose encounter table based on environment
  const encounterTable = environment === 'forest' ? 'forest-encounters' : 'urban-encounters';
  
  const encounter = RandomTablesData.rollWithDiceEngine(mockDiceEngine, encounterTable);
  const complication = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'complications');
  const weather = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'weather-conditions');
  
  console.log(`🌲 Environment: ${environment}`);
  console.log(`⚔️  Encounter: ${encounter.result.result}`);
  console.log(`   ${encounter.result.description || 'No additional details'}`);
  console.log(`⚡ Complication: ${complication.result.result}`);
  console.log(`🌤️  Weather: ${weather.result.result}`);
  console.log();
  
  return {
    environment: environment,
    encounter: encounter.result.result,
    encounterDescription: encounter.result.description,
    complication: complication.result.result,
    weather: weather.result.result
  };
}

/**
 * Example 4: Treasure Generator
 * Creates appropriate treasure hoards for different challenge levels
 */
function generateTreasure(level = 'minor') {
  console.log("=== TREASURE GENERATOR ===");
  
  const mockDiceEngine = {
    rollExpression: (expression) => ({
      total: Math.floor(Math.random() * 100) + 1,
      expression: expression,
      dice: [Math.floor(Math.random() * 100) + 1]
    })
  };
  
  // Roll for both mundane and magical treasure
  const mundane = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'mundane-treasure');
  const magic = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'magic-items-minor');
  
  console.log(`💰 Mundane Treasure: ${mundane.result.result}`);
  console.log(`✨ Magic Item: ${magic.result.result}`);
  console.log(`   ${magic.result.description || 'No additional details'}`);
  console.log();
  
  return {
    mundane: mundane.result.result,
    magic: magic.result.result,
    magicDescription: magic.result.description
  };
}

/**
 * Example 5: Character Creation Helper
 * Assists with random character generation decisions
 */
function generateCharacterTraits() {
  console.log("=== CHARACTER CREATION HELPER ===");
  
  const mockDiceEngine = {
    rollExpression: (expression) => ({
      total: Math.floor(Math.random() * 6) + 1,
      expression: expression,
      dice: [Math.floor(Math.random() * 6) + 1]
    })
  };
  
  const abilityMethod = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'ability-score-generation');
  const quirk = RandomTablesData.rollWithDiceEngine(mockDiceEngine, 'character-quirks');
  
  console.log(`🎲 Ability Score Method: ${abilityMethod.result.result}`);
  console.log(`   ${abilityMethod.result.description}`);
  console.log(`🎭 Character Quirk: ${quirk.result.result}`);
  console.log();
  
  return {
    abilityMethod: abilityMethod.result.result,
    abilityDescription: abilityMethod.result.description,
    quirk: quirk.result.result
  };
}

/**
 * Example 6: Table Analysis and Statistics
 * Shows how to analyze table structure and probabilities
 */
function analyzeTable(tableId) {
  console.log(`=== TABLE ANALYSIS: ${tableId.toUpperCase()} ===`);
  
  const table = RandomTablesData.getTable(tableId);
  if (!table) {
    console.log(`❌ Table '${tableId}' not found`);
    return;
  }
  
  console.log(`📊 Table Name: ${table.name}`);
  console.log(`📝 Description: ${table.description}`);
  console.log(`🎲 Dice Expression: ${table.diceExpression}`);
  console.log(`📂 Category: ${table.category}`);
  console.log(`📋 Number of Results: ${table.results.length}`);
  
  // Analyze probability distribution
  const totalRanges = table.results.map(result => result.range[1] - result.range[0] + 1);
  const totalPossibilities = Math.max(...table.results.map(result => result.range[1]));
  
  console.log(`🎯 Total Possible Outcomes: ${totalPossibilities}`);
  console.log(`📈 Average Range Size: ${(totalRanges.reduce((a, b) => a + b, 0) / totalRanges.length).toFixed(2)}`);
  
  // Show first few results as examples
  console.log(`📝 Sample Results:`);
  table.results.slice(0, 3).forEach(result => {
    const probability = ((result.range[1] - result.range[0] + 1) / totalPossibilities * 100).toFixed(1);
    console.log(`   ${result.range[0]}-${result.range[1]} (${probability}%): ${result.result}`);
  });
  
  if (table.results.length > 3) {
    console.log(`   ... and ${table.results.length - 3} more results`);
  }
  
  // Validate table structure
  const validation = RandomTablesData.validateTable(tableId);
  console.log(`✅ Table Valid: ${validation.valid}`);
  if (!validation.valid) {
    console.log(`❌ Errors: ${validation.errors.join(', ')}`);
  }
  
  console.log();
}

/**
 * Example 7: Campaign Session Generator
 * Creates complete session content with multiple elements
 */
function generateSession() {
  console.log("=== COMPLETE SESSION GENERATOR ===");
  
  const adventure = generateAdventureSetup();
  const keyNPC = generateNPC();
  const encounter = generateEncounter('forest');
  const treasure = generateTreasure();
  
  console.log("🎮 SESSION SUMMARY:");
  console.log(`The party begins at ${adventure.startingLocation} during ${adventure.weather}.`);
  console.log(`They encounter ${keyNPC.name}, who ${keyNPC.motivation.toLowerCase()}.`);
  console.log(`${keyNPC.name} ${keyNPC.quirk.toLowerCase()}.`);
  console.log(`The adventure hook: ${adventure.plotHook}`);
  console.log(`However, ${adventure.complication.toLowerCase()}.`);
  console.log(`During their journey, they face: ${encounter.encounter}`);
  console.log(`If successful, they may find: ${treasure.mundane} and ${treasure.magic}`);
  console.log();
  
  return {
    adventure,
    keyNPC,
    encounter, 
    treasure
  };
}

/**
 * Example 8: Module-Specific Operations
 * Demonstrates working with individual table modules
 */
function demonstrateModularFeatures() {
  console.log("=== MODULAR FEATURES DEMONSTRATION ===");
  
  // Show statistics about the table collection
  const stats = RandomTablesData.getStatistics();
  console.log(`📊 Total Tables: ${stats.totalTables}`);
  console.log(`📚 Total Modules: ${stats.totalModules}`);
  console.log(`🎲 Total Results: ${stats.totalResults}`);
  console.log();
  
  // Show tables by module
  console.log("📂 Tables by Module:");
  Object.keys(stats.modules).forEach(moduleName => {
    console.log(`   ${moduleName}: ${stats.modules[moduleName]} tables`);
  });
  console.log();
  
  // Show dice expression usage
  console.log("🎲 Dice Expression Usage:");
  Object.entries(stats.diceExpressions).forEach(([dice, count]) => {
    console.log(`   ${dice}: ${count} tables`);
  });
  console.log();
  
  // Demonstrate quick generators
  console.log("⚡ Quick Generators:");
  const mockDiceEngine = {
    rollExpression: (expression) => ({
      total: Math.floor(Math.random() * 100) + 1,
      expression: expression,
      dice: [Math.floor(Math.random() * 100) + 1]
    })
  };
  
  if (RandomTablesData.quickGenerators) {
    const npc = RandomTablesData.quickGenerators.generateNPC(mockDiceEngine);
    console.log(`👤 Generated NPC: ${npc.name} (${npc.occupation})`);
    console.log(`   Motivation: ${npc.motivation}`);
    console.log(`   Secret: ${npc.secret}`);
    console.log();
    
    const location = RandomTablesData.quickGenerators.generateLocation(mockDiceEngine);
    console.log(`🏠 Generated Location with tavern: ${location.tavern}`);
    console.log(`   Shop: ${location.shop}`);
    console.log(`   Feature: ${location.notableFeature}`);
    console.log();
    
    const adventure = RandomTablesData.quickGenerators.generateAdventure(mockDiceEngine);
    console.log(`🎯 Generated Adventure:`);
    console.log(`   Hook: ${adventure.hook}`);
    console.log(`   Objective: ${adventure.objective}`);
    console.log(`   Complication: ${adventure.complication}`);
    console.log(`   Twist: ${adventure.twist}`);
    console.log();
  }
  
  // Validate all tables
  const validation = RandomTablesData.validateAllTables();
  const validTables = Object.values(validation).filter(v => v.valid).length;
  const totalTables = Object.keys(validation).length;
  console.log(`✅ Table Validation: ${validTables}/${totalTables} tables valid`);
  
  const invalidTables = Object.entries(validation).filter(([_, v]) => !v.valid);
  if (invalidTables.length > 0) {
    console.log("❌ Invalid Tables:");
    invalidTables.forEach(([tableId, result]) => {
      console.log(`   ${tableId}: ${result.errors.join(', ')}`);
    });
  }
  console.log();
}

/**
 * Demo Runner - Executes all examples including new modular features
 */
function runDemo() {
  console.log("🎯 MODULAR RANDOM TABLES DATA USAGE DEMONSTRATION");
  console.log("=================================================");
  console.log();
  
  // Initialize if not already done
  if (typeof RandomTablesData.init === 'function') {
    RandomTablesData.init();
  }
  
  // Run all examples
  generateAdventureSetup();
  generateNPC();
  generateEncounter('urban');
  generateTreasure();
  generateCharacterTraits();
  analyzeTable('tavern-names');
  analyzeTable('forest-encounters');
  generateSession();
  
  // NEW: Demonstrate modular features
  demonstrateModularFeatures();
  
  // Show category overview
  console.log("=== AVAILABLE CATEGORIES ===");
  RandomTablesData.getAllCategories().forEach(category => {
    const tables = RandomTablesData.getTablesByCategory(category);
    console.log(`📂 ${category}: ${tables.length} tables`);
    tables.forEach(table => {
      console.log(`   - ${table.name} (${table.diceExpression})`);
    });
  });
  console.log();
  
  // Show module overview
  console.log("=== AVAILABLE MODULES ===");
  RandomTablesData.getAllModules().forEach(moduleName => {
    const tables = RandomTablesData.getTablesByModule(moduleName);
    const module = RandomTablesData.modules[moduleName];
    console.log(`🔧 ${moduleName}: ${tables.length} tables`);
    console.log(`   ${module.description}`);
    tables.forEach(table => {
      console.log(`   - ${table.name} (${table.diceExpression})`);
    });
    console.log();
  });
  
  console.log("✅ Demo complete! All tables organized in modular structure.");
}

// Export functions for testing and external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateAdventureSetup,
    generateNPC,
    generateEncounter,
    generateTreasure,
    generateCharacterTraits,
    analyzeTable,
    generateSession,
    demonstrateModularFeatures,
    runDemo
  };
}

// Auto-run demo if loaded directly in browser
if (typeof window !== 'undefined' && window.RandomTablesData) {
  window.RandomTablesExamples = {
    generateAdventureSetup,
    generateNPC,
    generateEncounter,
    generateTreasure,
    generateCharacterTraits,
    analyzeTable,
    generateSession,
    demonstrateModularFeatures,
    runDemo
  };
  
  // Uncomment to auto-run demo
  // runDemo();
}
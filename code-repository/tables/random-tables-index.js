/**
 * Random Tables Data v2.0 - Modular Structure
 * JavaScript data set for the High-Performance Dice Rolling Subsystem
 * 
 * This file combines all random table modules into a unified interface
 * while maintaining modular organization for better maintainability.
 * 
 * @version 2.0
 * @date September 20, 2025
 * @location code-repository/tables/random-tables-index.js
 */

// Import all table modules (in Node.js environment)
if (typeof require !== 'undefined') {
  var CharacterGenerationTables = require('./character-generation-tables.js');
  var LocationTables = require('./location-tables.js');
  var EncounterTables = require('./encounter-tables.js');
  var NPCTables = require('./npc-tables.js');
  var TreasureTables = require('./treasure-tables.js');
  var EnvironmentTables = require('./environment-tables.js');
  var PlotDevelopmentTables = require('./plot-development-tables.js');
}

const RandomTablesData = {
  // Metadata
  version: "2.0",
  created: "2025-09-20",
  description: "Comprehensive modular random tables for D&D and RPG gaming",
  
  // Table Categories
  categories: [
    "character-generation",
    "locations", 
    "encounters",
    "treasure",
    "npcs",
    "events",
    "weather",
    "atmosphere",
    "names",
    "plot-hooks",
    "complications",
    "items"
  ],

  // Module references
  modules: {
    characterGeneration: CharacterGenerationTables,
    locations: LocationTables,
    encounters: EncounterTables,
    npcs: NPCTables,
    treasure: TreasureTables,
    environment: EnvironmentTables,
    plotDevelopment: PlotDevelopmentTables
  },

  // Combined tables from all modules
  tables: {},

  // Initialize by combining all module tables
  init: function() {
    this.tables = {};
    
    // Combine tables from all modules
    Object.values(this.modules).forEach(module => {
      if (module && module.tables) {
        Object.assign(this.tables, module.tables);
      }
    });
    
    return this;
  },

  // Utility Functions for Rolling Tables
  rollTable: function(tableId, customDice = null) {
    const table = this.tables[tableId];
    if (!table) {
      throw new Error(`Table with ID '${tableId}' not found`);
    }
    
    // Use custom dice expression or table's default
    const diceExpression = customDice || table.diceExpression;
    
    // This would integrate with the DiceEngine when implemented
    // For now, return a mock result structure
    return {
      tableId: tableId,
      tableName: table.name,
      diceExpression: diceExpression,
      roll: null, // Would be filled by DiceEngine
      result: table.results[0], // Placeholder - would be determined by roll
      timestamp: new Date()
    };
  },

  getTable: function(tableId) {
    return this.tables[tableId] || null;
  },

  getTablesByCategory: function(category) {
    return Object.values(this.tables).filter(table => table.category === category);
  },

  getTablesByModule: function(moduleName) {
    const module = this.modules[moduleName];
    if (!module || !module.tables) {
      return [];
    }
    return Object.values(module.tables);
  },

  getAllCategories: function() {
    return this.categories;
  },

  getAllModules: function() {
    return Object.keys(this.modules);
  },

  searchTables: function(query) {
    const lowerQuery = query.toLowerCase();
    return Object.values(this.tables).filter(table => 
      table.name.toLowerCase().includes(lowerQuery) ||
      table.description.toLowerCase().includes(lowerQuery) ||
      table.category.toLowerCase().includes(lowerQuery)
    );
  },

  // Integration function for DiceEngine
  rollWithDiceEngine: function(diceEngine, tableId, customDice = null) {
    const table = this.tables[tableId];
    if (!table) {
      throw new Error(`Table with ID '${tableId}' not found`);
    }
    
    const diceExpression = customDice || table.diceExpression;
    const rollResult = diceEngine.rollExpression(diceExpression);
    
    // Find the appropriate result based on roll
    const matchingResult = table.results.find(result => {
      const [min, max] = result.range;
      return rollResult.total >= min && rollResult.total <= max;
    });
    
    return {
      tableId: tableId,
      tableName: table.name,
      diceExpression: diceExpression,
      rollData: rollResult,
      result: matchingResult || table.results[table.results.length - 1],
      timestamp: new Date()
    };
  },

  // Validation function
  validateTable: function(tableId) {
    const table = this.tables[tableId];
    if (!table) return { valid: false, errors: [`Table '${tableId}' not found`] };
    
    const errors = [];
    
    // Check required fields
    if (!table.name) errors.push("Missing table name");
    if (!table.description) errors.push("Missing table description");
    if (!table.diceExpression) errors.push("Missing dice expression");
    if (!table.category) errors.push("Missing category");
    if (!table.results || !Array.isArray(table.results)) {
      errors.push("Missing or invalid results array");
    }
    
    // Validate results array
    if (table.results) {
      table.results.forEach((result, index) => {
        if (!result.range || !Array.isArray(result.range) || result.range.length !== 2) {
          errors.push(`Result ${index}: Invalid range format`);
        }
        if (!result.result) {
          errors.push(`Result ${index}: Missing result text`);
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  // Validate all tables across all modules
  validateAllTables: function() {
    const results = {};
    Object.keys(this.tables).forEach(tableId => {
      results[tableId] = this.validateTable(tableId);
    });
    return results;
  },

  // Export function for data backup
  exportTables: function(format = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.tables, null, 2);
    } else if (format === 'csv') {
      // CSV export for spreadsheet analysis
      let csv = "Table ID,Table Name,Category,Dice Expression,Range Min,Range Max,Result,Description\n";
      Object.values(this.tables).forEach(table => {
        table.results.forEach(result => {
          csv += `"${table.id}","${table.name}","${table.category}","${table.diceExpression}",${result.range[0]},${result.range[1]},"${result.result}","${result.description || ''}"\n`;
        });
      });
      return csv;
    } else if (format === 'modules') {
      // Export by module for organizational purposes
      const moduleExport = {};
      Object.keys(this.modules).forEach(moduleName => {
        const module = this.modules[moduleName];
        if (module && module.tables) {
          moduleExport[moduleName] = {
            category: module.category,
            description: module.description,
            tables: module.tables
          };
        }
      });
      return JSON.stringify(moduleExport, null, 2);
    }
    return null;
  },

  // Get statistics about the table collection
  getStatistics: function() {
    const stats = {
      totalTables: Object.keys(this.tables).length,
      totalModules: Object.keys(this.modules).length,
      categories: {},
      modules: {},
      diceExpressions: {},
      totalResults: 0
    };

    // Count by category
    this.categories.forEach(category => {
      stats.categories[category] = this.getTablesByCategory(category).length;
    });

    // Count by module
    Object.keys(this.modules).forEach(moduleName => {
      stats.modules[moduleName] = this.getTablesByModule(moduleName).length;
    });

    // Count dice expressions and results
    Object.values(this.tables).forEach(table => {
      // Count dice expressions
      const dice = table.diceExpression;
      stats.diceExpressions[dice] = (stats.diceExpressions[dice] || 0) + 1;
      
      // Count total results
      stats.totalResults += table.results.length;
    });

    return stats;
  },

  // Quick access to commonly used table combinations
  quickGenerators: {
    // Generate a complete NPC
    generateNPC: function(diceEngine) {
      const name = RandomTablesData.rollWithDiceEngine(diceEngine, 'npc-names');
      const motivation = RandomTablesData.rollWithDiceEngine(diceEngine, 'npc-motivations');
      const occupation = RandomTablesData.rollWithDiceEngine(diceEngine, 'npc-occupations');
      const secret = RandomTablesData.rollWithDiceEngine(diceEngine, 'npc-secrets');
      
      return {
        name: name.result.result,
        description: name.result.description,
        motivation: motivation.result.result,
        occupation: occupation.result.result,
        secret: secret.result.result
      };
    },

    // Generate a location
    generateLocation: function(diceEngine) {
      const tavernName = RandomTablesData.rollWithDiceEngine(diceEngine, 'tavern-names');
      const shopName = RandomTablesData.rollWithDiceEngine(diceEngine, 'shop-names');
      const feature = RandomTablesData.rollWithDiceEngine(diceEngine, 'settlement-features');
      
      return {
        tavern: tavernName.result.result,
        shop: shopName.result.result,
        notableFeature: feature.result.result
      };
    },

    // Generate adventure setup
    generateAdventure: function(diceEngine) {
      const hook = RandomTablesData.rollWithDiceEngine(diceEngine, 'adventure-hooks');
      const complication = RandomTablesData.rollWithDiceEngine(diceEngine, 'complications');
      const objective = RandomTablesData.rollWithDiceEngine(diceEngine, 'quest-objectives');
      const twist = RandomTablesData.rollWithDiceEngine(diceEngine, 'story-twists');
      
      return {
        hook: hook.result.result,
        complication: complication.result.result,
        objective: objective.result.result,
        twist: twist.result.result
      };
    }
  }
};

// Initialize the combined tables
if (typeof CharacterGenerationTables !== 'undefined') {
  RandomTablesData.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RandomTablesData;
}

// Global namespace for browser use
if (typeof window !== 'undefined') {
  window.RandomTablesData = RandomTablesData;
  
  // Load modules in browser environment
  if (window.CharacterGenerationTables) {
    RandomTablesData.modules.characterGeneration = window.CharacterGenerationTables;
  }
  if (window.LocationTables) {
    RandomTablesData.modules.locations = window.LocationTables;
  }
  if (window.EncounterTables) {
    RandomTablesData.modules.encounters = window.EncounterTables;
  }
  if (window.NPCTables) {
    RandomTablesData.modules.npcs = window.NPCTables;
  }
  if (window.TreasureTables) {
    RandomTablesData.modules.treasure = window.TreasureTables;
  }
  if (window.EnvironmentTables) {
    RandomTablesData.modules.environment = window.EnvironmentTables;
  }
  if (window.PlotDevelopmentTables) {
    RandomTablesData.modules.plotDevelopment = window.PlotDevelopmentTables;
  }
  
  // Initialize after loading modules
  RandomTablesData.init();
}
# Random Tables Data Documentation v2.0

## Overview
The Random Tables Data system provides a comprehensive collection of RPG random tables that integrate seamlessly with the High-Performance Dice Rolling Subsystem. This modular data set is based on the Random Tables Compendium v1.1 and contains structured random tables organized by category for better maintainability and extensibility.

## File Structure
```
code-repository/tables/
├── README.md                          # This documentation file
├── random-tables-index.js             # Main entry point combining all modules
├── character-generation-tables.js     # Character creation and development tables
├── location-tables.js                 # Places, buildings, and areas
├── encounter-tables.js                # Combat and encounter situations  
├── npc-tables.js                      # Non-player character generation
├── treasure-tables.js                 # Loot, items, and magical treasures
├── environment-tables.js              # Weather, events, and atmosphere
├── plot-development-tables.js         # Story hooks, complications, and narrative elements
├── usage-examples.js                  # Practical usage demonstrations
└── Random_Tables_Compendium_v1.1.pdf  # Original source document
```

- **Format**: Modular JavaScript objects with utility functions
- **Version**: 2.0  
- **Tables**: 35+ comprehensive random tables across 7 specialized modules
- **Integration**: Full compatibility with DiceEngine API

## Modular Architecture

### 🎭 **Character Generation Module** 
- `ability-score-generation`: Methods for rolling ability scores
- `character-quirks`: Personality traits and mannerisms  
- `character-backgrounds`: Background elements and history

### 🏠 **Location Module**
- `tavern-names`: Names for inns and taverns
- `dungeon-rooms`: Contents of dungeon chambers
- `shop-names`: Business and shop names
- `settlement-features`: Town and city landmarks

### ⚔️ **Encounter Module**  
- `forest-encounters`: Woodland area encounters
- `urban-encounters`: City and town encounters
- `mountain-encounters`: Highland and peak encounters
- `swamp-encounters`: Wetland and marsh encounters

### 👥 **NPC Module**
- `npc-names`: Quick names for characters
- `npc-motivations`: Goals and drives
- `npc-occupations`: Professions and jobs  
- `npc-secrets`: Hidden character information

### 💰 **Treasure Module**
- `mundane-treasure`: Common valuables and coins
- `magic-items-minor`: Lesser magical items
- `gems-and-jewelry`: Precious stones and ornaments
- `art-objects`: Valuable cultural items
- `magic-weapons`: Enchanted armaments

### 🌦️ **Environment Module** 
- `weather-conditions`: Environmental conditions
- `random-events`: Unexpected occurrences
- `seasonal-events`: Time-specific events
- `natural-disasters`: Major catastrophes
- `atmospheric-phenomena`: Unusual weather

### 📖 **Plot Development Module**
- `adventure-hooks`: Story seeds for adventures
- `complications`: Adventure challenges  
- `story-twists`: Narrative revelations
- `quest-objectives`: Mission goals
- `moral-dilemmas`: Ethical challenges

## Usage Examples

### Basic Table Rolling
```javascript
// Import the main index (combines all modules)
const RandomTablesData = require('./random-tables-index.js');

// Get a random tavern name
const tavernResult = RandomTablesData.rollTable('tavern-names');
console.log(tavernResult.result.result); // e.g., "The Prancing Pony"

// Roll on character quirks table
const quirkResult = RandomTablesData.rollTable('character-quirks');
console.log(quirkResult.result.result); // e.g., "Always speaks in rhyme when nervous"
```

### Module-Specific Access
```javascript
// Import individual modules for focused functionality
const NPCTables = require('./npc-tables.js');
const LocationTables = require('./location-tables.js');

// Access tables from specific modules
const npcName = NPCTables.tables['npc-names'];
const tavernName = LocationTables.tables['tavern-names'];
```

### Integration with Dice Engine
```javascript
// Assuming DiceEngine is available
const diceEngine = new DiceEngine();

// Roll using dice engine for accurate probability
const encounterResult = RandomTablesData.rollWithDiceEngine(
  diceEngine, 
  'forest-encounters'
);
console.log(`Rolled ${encounterResult.rollData.total}: ${encounterResult.result.result}`);

// Use custom dice expression
const customResult = RandomTablesData.rollWithDiceEngine(
  diceEngine,
  'npc-names',
  '2d10' // Override default 1d100
);
```

### Quick Generators
```javascript
// Use built-in quick generators for common combinations
const npc = RandomTablesData.quickGenerators.generateNPC(diceEngine);
console.log(`Generated: ${npc.name}, ${npc.occupation}`);
console.log(`Motivation: ${npc.motivation}`);
console.log(`Secret: ${npc.secret}`);

const adventure = RandomTablesData.quickGenerators.generateAdventure(diceEngine);
console.log(`Adventure Hook: ${adventure.hook}`);
console.log(`Complication: ${adventure.complication}`);
```

### Module Management
```javascript
// Get all tables in a specific module
const npcTables = RandomTablesData.getTablesByModule('npcs');
npcTables.forEach(table => {
  console.log(`${table.name}: ${table.description}`);
});

// Get statistics about the table collection
const stats = RandomTablesData.getStatistics();
console.log(`Total tables: ${stats.totalTables}`);
console.log(`Total modules: ${stats.totalModules}`);
console.log(`Total results: ${stats.totalResults}`);

// Validate all tables across all modules
const validation = RandomTablesData.validateAllTables();
const validTables = Object.values(validation).filter(v => v.valid).length;
console.log(`${validTables}/${Object.keys(validation).length} tables valid`);
```

## Table Structure

Each table follows this consistent structure:

```javascript
{
  id: "unique-table-identifier",
  name: "Human Readable Table Name",
  description: "Brief description of table purpose",
  diceExpression: "1d100", // Dice notation for rolling
  category: "table-category",
  results: [
    {
      range: [1, 10], // Roll range for this result
      result: "The actual result text",
      description: "Optional additional description" // Optional
    },
    // ... more results
  ]
}
```

## Dice Expressions Supported

The tables use standard RPG dice notation that integrates with the DiceEngine:

- `1d100`: Single percentile die (1-100)
- `1d20`: Single twenty-sided die (1-20)  
- `2d6`: Two six-sided dice (2-12)
- `2d10`: Two ten-sided dice (2-20)
- `1d12`: Single twelve-sided die (1-12)
- `1d6`: Single six-sided die (1-6)

## Migration from Legacy Version

If you're upgrading from the monolithic `random-tables-data.js` file:

```javascript
// Old way (legacy file - now random-tables-data-legacy.js)
const RandomTablesData = require('./random-tables-data-legacy.js');

// New modular way  
const RandomTablesData = require('./random-tables-index.js');
// All existing functions work the same, but now with modular organization!

// Access individual modules if needed
const NPCTables = require('./npc-tables.js');
const treasures = NPCTables.tables['npc-names'];
```

The API remains backward compatible - all existing code will continue to work with the new modular structure.

## Benefits of Modular Structure

- **Better Organization**: Tables grouped by logical categories
- **Easier Maintenance**: Edit specific modules without affecting others
- **Faster Loading**: Import only needed modules in performance-critical applications  
- **Better Extensibility**: Add new modules or extend existing ones easily
- **Clearer Code**: Smaller, focused files are easier to understand and modify
- **Team Development**: Multiple developers can work on different modules simultaneously

## Future Enhancements

- **Dynamic Table Loading**: Load tables from external files or APIs
- **User-Defined Tables**: Allow players to create custom tables
- **Weighted Results**: Support for non-uniform probability distributions  
- **Conditional Tables**: Tables that reference other tables
- **Multi-Language Support**: Internationalization for table content
- **Table Relationships**: Link related tables for coherent results
- **Template System**: Generate tables from templates and parameters

## Related Documentation

- [High-Performance Dice Rolling Subsystem](../technical-specs/dnd-character-creator-tech-spec.md#component-7-high-performance-dice-rolling-subsystem)
- [Dice Rolling Requirements](../requirements/dnd-character-creator-requirements.md#fr-011-high-performance-dice-rolling-subsystem)
- [Dice Rolling User Stories](../user-stories/dice-rolling-subsystem-story.md)
- [Dice Rolling Test Scenarios](../test-scenarios/dice-rolling-subsystem-test.md)

---

**Version 2.0 - Modular Architecture** | Updated September 20, 2025  
*Backward compatible with all existing code while providing improved organization and maintainability.*
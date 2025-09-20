/**
 * Random Tables Compendium Data v1.1
 * JavaScript data set for the High-Performance Dice Rolling Subsystem
 * 
 * This file contains structured random table data that can be used with
 * the dice rolling subsystem to generate random results for RPG gameplay.
 * 
 * Table Structure:
 * - id: Unique identifier for the table
 * - name: Human-readable table name
 * - description: Brief description of table purpose
 * - diceExpression: Dice notation for rolling (e.g., "1d100", "2d6")
 * - category: Table category for organization
 * - results: Array of possible results with roll ranges
 * 
 * Usage with DiceEngine:
 * const result = RandomTablesData.rollTable('tavern-names');
 * const customRoll = RandomTablesData.rollCustomTable('encounters-forest', '1d20');
 * 
 * @version 1.1
 * @date September 20, 2025
 * @location code-repository/tables/random-tables-data.js
 */

const RandomTablesData = {
  // Metadata
  version: "1.1",
  created: "2025-09-20",
  description: "Comprehensive random tables for D&D and RPG gaming",
  
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

  // Random Tables Collection
  tables: {
    // CHARACTER GENERATION TABLES
    "ability-score-generation": {
      id: "ability-score-generation",
      name: "Ability Score Generation Methods",
      description: "Different methods for generating character ability scores",
      diceExpression: "1d6",
      category: "character-generation",
      results: [
        { range: [1, 1], result: "4d6 drop lowest", description: "Roll 4d6, drop the lowest die" },
        { range: [2, 2], result: "3d6 straight", description: "Roll 3d6 for each ability in order" },
        { range: [3, 3], result: "Point buy (25 points)", description: "Distribute 25 points among abilities" },
        { range: [4, 4], result: "Point buy (32 points)", description: "Distribute 32 points among abilities" },
        { range: [5, 5], result: "4d6 drop lowest, arrange", description: "Roll 4d6dl1 six times, arrange as desired" },
        { range: [6, 6], result: "2d6+6", description: "Roll 2d6+6 for each ability score" }
      ]
    },

    "character-quirks": {
      id: "character-quirks",
      name: "Character Personality Quirks",
      description: "Random personality traits and mannerisms for characters",
      diceExpression: "1d100",
      category: "character-generation",
      results: [
        { range: [1, 5], result: "Always speaks in rhyme when nervous" },
        { range: [6, 10], result: "Constantly fidgets with a lucky charm" },
        { range: [11, 15], result: "Has an irrational fear of birds" },
        { range: [16, 20], result: "Collects unusual stones or pebbles" },
        { range: [21, 25], result: "Never sits with back to a door" },
        { range: [26, 30], result: "Hums old tavern songs while working" },
        { range: [31, 35], result: "Always counts things in groups of three" },
        { range: [36, 40], result: "Speaks to animals as if they understand" },
        { range: [41, 45], result: "Refuses to eat meat on certain days" },
        { range: [46, 50], result: "Draws small sketches when thinking" },
        { range: [51, 55], result: "Always knows which way is north" },
        { range: [56, 60], result: "Tells elaborate lies about mundane things" },
        { range: [61, 65], result: "Cannot sleep unless facing east" },
        { range: [66, 70], result: "Compulsively organizes everything" },
        { range: [71, 75], result: "Speaks in third person when stressed" },
        { range: [76, 80], result: "Has an encyclopedic knowledge of local gossip" },
        { range: [81, 85], result: "Always wears mismatched socks" },
        { range: [86, 90], result: "Insists on paying for everything with exact change" },
        { range: [91, 95], result: "Remembers everyone's birthday but forgets names" },
        { range: [96, 100], result: "Believes their shadow is a separate entity" }
      ]
    },

    // LOCATION TABLES
    "tavern-names": {
      id: "tavern-names",
      name: "Tavern Names",
      description: "Random names for taverns, inns, and drinking establishments",
      diceExpression: "1d100",
      category: "locations",
      results: [
        { range: [1, 5], result: "The Prancing Pony" },
        { range: [6, 10], result: "The Golden Griffin" },
        { range: [11, 15], result: "The Rusty Anchor" },
        { range: [16, 20], result: "The Dancing Dragon" },
        { range: [21, 25], result: "The Silver Stag" },
        { range: [26, 30], result: "The Broken Wheel" },
        { range: [31, 35], result: "The Laughing Maiden" },
        { range: [36, 40], result: "The Weary Traveler" },
        { range: [41, 45], result: "The Black Boar" },
        { range: [46, 50], result: "The Crooked Crown" },
        { range: [51, 55], result: "The Drunken Dwarf" },
        { range: [56, 60], result: "The Red Rose Inn" },
        { range: [61, 65], result: "The Howling Wolf" },
        { range: [66, 70], result: "The Green Goblet" },
        { range: [71, 75], result: "The Sleeping Giant" },
        { range: [76, 80], result: "The Mermaid's Rest" },
        { range: [81, 85], result: "The Copper Cauldron" },
        { range: [86, 90], result: "The Wanderer's Welcome" },
        { range: [91, 95], result: "The Moonlit Manor" },
        { range: [96, 100], result: "The Dragon's Den" }
      ]
    },

    "dungeon-rooms": {
      id: "dungeon-rooms",
      name: "Dungeon Room Contents",
      description: "What the party finds when they enter a dungeon room",
      diceExpression: "1d20",
      category: "locations",
      results: [
        { range: [1, 2], result: "Empty room with strange echoes" },
        { range: [3, 4], result: "Monster lair with treasure hoard" },
        { range: [5, 6], result: "Trapped corridor with pressure plates" },
        { range: [7, 8], result: "Ancient library with crumbling books" },
        { range: [9, 10], result: "Flooded chamber with murky water" },
        { range: [11, 12], result: "Magical laboratory with bubbling potions" },
        { range: [13, 14], result: "Prison cells with mysterious prisoners" },
        { range: [15, 16], result: "Shrine to forgotten deity" },
        { range: [17, 17], result: "Armory filled with ancient weapons" },
        { range: [18, 18], result: "Puzzle room with riddles and mechanisms" },
        { range: [19, 19], result: "Teleportation circle to unknown location" },
        { range: [20, 20], result: "Dragon's sleeping chamber" }
      ]
    },

    // ENCOUNTER TABLES
    "forest-encounters": {
      id: "forest-encounters",
      name: "Forest Random Encounters",
      description: "Random encounters for forest and woodland areas",
      diceExpression: "1d12",
      category: "encounters",
      results: [
        { range: [1, 1], result: "Pack of wolves (2d4)", description: "Hungry wolves hunting for food" },
        { range: [2, 2], result: "Lost merchant caravan", description: "Merchants need directions or protection" },
        { range: [3, 3], result: "Bandit ambush (1d6+2 bandits)", description: "Bandits demand toll or valuables" },
        { range: [4, 4], result: "Friendly druid and animal companion", description: "Druid offers forest knowledge" },
        { range: [5, 5], result: "Ancient stone circle", description: "Mysterious druids' gathering place" },
        { range: [6, 6], result: "Owlbear hunting party", description: "1d2 owlbears searching for prey" },
        { range: [7, 7], result: "Elven patrol", description: "1d4+2 elves protecting the forest" },
        { range: [8, 8], result: "Talking animals", description: "Awakened animals with quest or information" },
        { range: [9, 9], result: "Treant grove", description: "Ancient treant offers wisdom or warning" },
        { range: [10, 10], result: "Poacher's camp", description: "Illegal hunters with trapped animals" },
        { range: [11, 11], result: "Fairy ring", description: "Portal to feywild or fey creatures" },
        { range: [12, 12], result: "Ancient ruins", description: "Overgrown temple or tower with secrets" }
      ]
    },

    "urban-encounters": {
      id: "urban-encounters", 
      name: "Urban Random Encounters",
      description: "Random encounters for cities and towns",
      diceExpression: "2d10",
      category: "encounters",
      results: [
        { range: [2, 2], result: "Pickpocket attempt", description: "Skilled thief tries to steal from party" },
        { range: [3, 4], result: "Street performer", description: "Bard or entertainer gathering crowd" },
        { range: [5, 6], result: "City guard patrol", description: "Guards on routine patrol or investigation" },
        { range: [7, 8], result: "Merchant with rare goods", description: "Traveling merchant with unusual items" },
        { range: [9, 10], result: "Beggar with information", description: "Street person knows valuable secrets" },
        { range: [11, 12], result: "Noble's procession", description: "Important person traveling through streets" },
        { range: [13, 14], result: "Street fight", description: "Brawl between locals or gangs" },
        { range: [15, 16], result: "Lost child", description: "Child needs help finding family" },
        { range: [17, 18], result: "Cult recruitment", description: "Cultists trying to recruit new members" },
        { range: [19, 19], result: "Assassin stalking party", description: "Professional killer following the group" },
        { range: [20, 20], result: "Royal summons", description: "Official messenger with urgent request" }
      ]
    },

    // NPC TABLES
    "npc-names": {
      id: "npc-names",
      name: "Random NPC Names",
      description: "Quick names for NPCs the party encounters",
      diceExpression: "1d100",
      category: "npcs",
      results: [
        { range: [1, 5], result: "Aldric Stonehammer", description: "Human male blacksmith" },
        { range: [6, 10], result: "Lyra Nightwhisper", description: "Elven female ranger" },
        { range: [11, 15], result: "Thorin Goldbeard", description: "Dwarven male merchant" },
        { range: [16, 20], result: "Aria Swiftarrow", description: "Human female archer" },
        { range: [21, 25], result: "Bren Ironfoot", description: "Dwarven male guard" },
        { range: [26, 30], result: "Celeste Moonweaver", description: "Elven female mage" },
        { range: [31, 35], result: "Gareth Strongarm", description: "Human male warrior" },
        { range: [36, 40], result: "Mira Lightfinger", description: "Halfling female thief" },
        { range: [41, 45], result: "Thane Stormcrow", description: "Human male cleric" },
        { range: [46, 50], result: "Zara Flametouch", description: "Tiefling female sorcerer" },
        { range: [51, 55], result: "Pip Goodbarrel", description: "Halfling male innkeeper" },
        { range: [56, 60], result: "Raven Blackthorn", description: "Human female assassin" },
        { range: [61, 65], result: "Magnus Spellwright", description: "Human male wizard" },
        { range: [66, 70], result: "Ivy Greenthumb", description: "Human female druid" },
        { range: [71, 75], result: "Drake Shadowbane", description: "Human male paladin" },
        { range: [76, 80], result: "Luna Stargazer", description: "Elven female oracle" },
        { range: [81, 85], result: "Rex Ironwill", description: "Human male captain" },
        { range: [86, 90], result: "Sage Whisperwind", description: "Elven male sage" },
        { range: [91, 95], result: "Ruby Brightblade", description: "Human female knight" },
        { range: [96, 100], result: "Void the Nameless", description: "Mysterious hooded figure" }
      ]
    },

    "npc-motivations": {
      id: "npc-motivations",
      name: "NPC Motivations",
      description: "What drives this NPC and their goals",
      diceExpression: "1d20",
      category: "npcs",
      results: [
        { range: [1, 1], result: "Seeking revenge against old enemy" },
        { range: [2, 2], result: "Protecting family or loved ones" },
        { range: [3, 3], result: "Accumulating wealth and power" },
        { range: [4, 4], result: "Uncovering ancient secrets" },
        { range: [5, 5], result: "Proving worth to society" },
        { range: [6, 6], result: "Redemption for past mistakes" },
        { range: [7, 7], result: "Finding lost family member" },
        { range: [8, 8], result: "Serving divine purpose" },
        { range: [9, 9], result: "Escaping troubled past" },
        { range: [10, 10], result: "Gaining recognition and fame" },
        { range: [11, 11], result: "Preserving ancient knowledge" },
        { range: [12, 12], result: "Building lasting legacy" },
        { range: [13, 13], result: "Overcoming personal fears" },
        { range: [14, 14], result: "Mastering specific skill or art" },
        { range: [15, 15], result: "Fulfilling prophetic destiny" },
        { range: [16, 16], result: "Restoring family honor" },
        { range: [17, 17], result: "Defeating specific monster" },
        { range: [18, 18], result: "Finding rare magical artifact" },
        { range: [19, 19], result: "Saving homeland from threat" },
        { range: [20, 20], result: "Ascending to divine status" }
      ]
    },

    // TREASURE TABLES
    "mundane-treasure": {
      id: "mundane-treasure",
      name: "Mundane Treasure",
      description: "Common valuables and coin hoards",
      diceExpression: "1d20",
      category: "treasure",
      results: [
        { range: [1, 3], result: "2d6 copper pieces" },
        { range: [4, 6], result: "1d8 silver pieces" },
        { range: [7, 9], result: "1d4 gold pieces" },
        { range: [10, 11], result: "Precious gems worth 50gp" },
        { range: [12, 13], result: "Silk cloth worth 25gp" },
        { range: [14, 15], result: "Masterwork tools worth 100gp" },
        { range: [16, 16], result: "Art object worth 250gp" },
        { range: [17, 17], result: "Rare spices worth 75gp" },
        { range: [18, 18], result: "Fine wine collection worth 150gp" },
        { range: [19, 19], result: "Ancient coins worth 500gp" },
        { range: [20, 20], result: "Royal jewelry worth 1000gp" }
      ]
    },

    "magic-items-minor": {
      id: "magic-items-minor",
      name: "Minor Magic Items",
      description: "Lesser magical treasures and utility items",
      diceExpression: "1d100",
      category: "treasure",
      results: [
        { range: [1, 10], result: "Potion of Healing", description: "Restores 2d4+2 hit points" },
        { range: [11, 20], result: "Scroll of Magic Missile", description: "Casts magic missile spell" },
        { range: [21, 30], result: "Ring of Protection +1", description: "+1 bonus to AC and saves" },
        { range: [31, 40], result: "Cloak of Elvenkind", description: "+5 bonus to Hide checks" },
        { range: [41, 50], result: "Bag of Holding", description: "Extradimensional storage space" },
        { range: [51, 60], result: "Boots of Speed", description: "Double movement speed for 10 rounds" },
        { range: [61, 70], result: "Wand of Magic Missile", description: "50 charges, 1d4+1 force damage" },
        { range: [71, 80], result: "Amulet of Natural Armor +1", description: "+1 natural armor bonus" },
        { range: [81, 90], result: "Gloves of Dexterity +2", description: "+2 enhancement to Dexterity" },
        { range: [91, 100], result: "Headband of Intellect +2", description: "+2 enhancement to Intelligence" }
      ]
    },

    // WEATHER TABLES
    "weather-conditions": {
      id: "weather-conditions",
      name: "Weather Conditions",
      description: "Random weather for outdoor adventures",
      diceExpression: "2d6",
      category: "weather",
      results: [
        { range: [2, 2], result: "Severe storm", description: "Heavy rain, strong winds, possible lightning" },
        { range: [3, 4], result: "Rain", description: "Steady rainfall, muddy conditions" },
        { range: [5, 6], result: "Overcast", description: "Cloudy skies, no precipitation" },
        { range: [7, 8], result: "Clear", description: "Pleasant weather, good visibility" },
        { range: [9, 10], result: "Partly cloudy", description: "Some clouds, mostly pleasant" },
        { range: [11, 11], result: "Fog", description: "Heavy mist reduces visibility" },
        { range: [12, 12], result: "Extreme weather", description: "Blizzard, hurricane, or supernatural weather" }
      ]
    },

    // EVENT TABLES
    "random-events": {
      id: "random-events",
      name: "Random Events",
      description: "Unexpected events during travel or downtime",
      diceExpression: "1d20",
      category: "events",
      results: [
        { range: [1, 2], result: "Festival or celebration in nearby settlement" },
        { range: [3, 4], result: "Messenger arrives with urgent news" },
        { range: [5, 6], result: "Strange lights appear in the sky" },
        { range: [7, 8], result: "Local wildlife acts unusually" },
        { range: [9, 10], result: "Old friend or ally appears unexpectedly" },
        { range: [11, 12], result: "Merchant offers rare trade opportunity" },
        { range: [13, 14], result: "Natural disaster threatens area" },
        { range: [15, 16], result: "Mysterious stranger asks for help" },
        { range: [17, 18], result: "Evidence of recent magical activity" },
        { range: [19, 19], result: "Portal to another plane opens nearby" },
        { range: [20, 20], result: "Time loop or temporal anomaly occurs" }
      ]
    },

    // PLOT HOOK TABLES
    "adventure-hooks": {
      id: "adventure-hooks",
      name: "Adventure Plot Hooks",
      description: "Story seeds to start new adventures",
      diceExpression: "1d12",
      category: "plot-hooks",
      results: [
        { range: [1, 1], result: "Ancient tomb has been unsealed, releasing unknown dangers" },
        { range: [2, 2], result: "Local children are disappearing near the old forest" },
        { range: [3, 3], result: "Merchant caravan needs protection through dangerous territory" },
        { range: [4, 4], result: "Strange plague affects only magic users in the city" },
        { range: [5, 5], result: "Dragon has claimed local mountain, demanding tribute" },
        { range: [6, 6], result: "Rival adventuring party seeks same artifact as heroes" },
        { range: [7, 7], result: "Cult is performing ritual to summon extraplanar entity" },
        { range: [8, 8], result: "Noble's heir has been replaced by doppelganger" },
        { range: [9, 9], result: "Magic academy students have unleashed dangerous experiment" },
        { range: [10, 10], result: "Pirates have established base threatening trade routes" },
        { range: [11, 11], result: "Ancient prophecy suggests heroes are key to preventing disaster" },
        { range: [12, 12], result: "Gods themselves seek mortal agents for cosmic conflict" }
      ]
    },

    // COMPLICATION TABLES
    "complications": {
      id: "complications",
      name: "Adventure Complications",
      description: "Things that make adventures more interesting",
      diceExpression: "1d10",
      category: "complications",
      results: [
        { range: [1, 1], result: "Important NPC has hidden agenda" },
        { range: [2, 2], result: "Weather turns severe at worst possible moment" },
        { range: [3, 3], result: "Key information was deliberately false" },
        { range: [4, 4], result: "Local authority opposes heroes' mission" },
        { range: [5, 5], result: "Required item is owned by former enemy" },
        { range: [6, 6], result: "Time limit is shorter than originally thought" },
        { range: [7, 7], result: "Innocent bystanders are in danger" },
        { range: [8, 8], result: "Heroes' reputation precedes them negatively" },
        { range: [9, 9], result: "Equipment failure at critical moment" },
        { range: [10, 10], result: "Moral dilemma requires choosing between two goods" }
      ]
    }
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

  getAllCategories: function() {
    return this.categories;
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
    }
    return null;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RandomTablesData;
}

// Global namespace for browser use
if (typeof window !== 'undefined') {
  window.RandomTablesData = RandomTablesData;
}
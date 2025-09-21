/**
 * RulzLawyer Enhanced Random Tables System
 * Comprehensive D&D 3.5 Random Tables with weighted probability distributions
 * 
 * @version 2.0
 * @date September 20, 2025
 * @location code-repository/src/random-tables-index.js
 */

class RandomTablesEngine {
  constructor(diceEngine) {
    this.dice = diceEngine;
    this.tables = this._initializeTables();
    this.rollHistory = [];
  }

  /**
   * Roll on a specific table by name
   * @param {string} tableName - Name of the table to roll on
   * @param {Object} options - Optional parameters for table rolling
   * @returns {Object} Table result with details
   */
  rollTable(tableName, options = {}) {
    const table = this.tables[tableName];
    if (!table) {
      throw new Error(`Table "${tableName}" not found`);
    }

    const startTime = performance.now();
    const result = this._executeTableRoll(table, options);
    const endTime = performance.now();

    const rollRecord = {
      table: tableName,
      result: result.value,
      roll: result.roll,
      timestamp: Date.now(),
      executionTime: endTime - startTime,
      options
    };

    this.rollHistory.push(rollRecord);

    return {
      table: tableName,
      value: result.value,
      roll: result.roll,
      details: result.details || {},
      source: table.source || 'RulzLawyer',
      timestamp: rollRecord.timestamp,
      executionTime: rollRecord.executionTime
    };
  }

  /**
   * Roll multiple tables in sequence
   * @param {Array} tableNames - Array of table names to roll
   * @param {Object} globalOptions - Options applied to all rolls
   * @returns {Array} Array of table results
   */
  rollMultipleTables(tableNames, globalOptions = {}) {
    return tableNames.map(tableName => {
      try {
        return this.rollTable(tableName, globalOptions);
      } catch (error) {
        return {
          table: tableName,
          error: error.message,
          timestamp: Date.now()
        };
      }
    });
  }

  /**
   * Get list of available tables
   * @param {string} category - Optional category filter
   * @returns {Array} Array of table information
   */
  getAvailableTables(category = null) {
    const tableList = Object.entries(this.tables).map(([name, table]) => ({
      name,
      category: table.category,
      description: table.description,
      diceType: table.dice,
      entryCount: table.entries ? 
        (Array.isArray(table.entries) ? table.entries.length : Object.keys(table.entries).length) : 
        1 // For direct dice results like ability scores
    }));

    return category ? tableList.filter(t => t.category === category) : tableList;
  }

  /**
   * Execute a table roll with proper dice mechanics
   * @private
   */
  _executeTableRoll(table, options) {
    const roll = this.dice.rollExpression(table.dice);
    let result;

    // Handle direct dice result tables (like ability scores)
    if (table.type === 'direct' || table.entries === null) {
      return {
        value: roll.total,
        roll: roll.total,
        details: { diceRoll: roll }
      };
    }

    if (Array.isArray(table.entries)) {
      // Simple array-based table
      const index = Math.min(roll.total - 1, table.entries.length - 1);
      result = table.entries[index];
    } else {
      // Range-based table (e.g., 01-05: "Result")
      result = this._findRangeResult(table.entries, roll.total);
    }

    // Handle special table types
    if (table.type === 'nested' && result.subtable) {
      const subResult = this.rollTable(result.subtable);
      return {
        value: `${result.value} (${subResult.value})`,
        roll: roll.total,
        details: { mainResult: result, subResult }
      };
    }

    if (table.type === 'multiple' && result.count) {
      const multipleResults = [];
      for (let i = 0; i < result.count; i++) {
        multipleResults.push(this._executeTableRoll(table, options));
      }
      return {
        value: multipleResults.map(r => r.value).join(', '),
        roll: roll.total,
        details: { results: multipleResults }
      };
    }

    return {
      value: typeof result === 'string' ? result : result.value || result,
      roll: roll.total,
      details: typeof result === 'object' ? result : {}
    };
  }

  /**
   * Find result in range-based table
   * @private
   */
  _findRangeResult(entries, roll) {
    for (const [range, result] of Object.entries(entries)) {
      if (this._rollInRange(roll, range)) {
        return result;
      }
    }
    return "No result found";
  }

  /**
   * Check if roll falls within range
   * @private
   */
  _rollInRange(roll, range) {
    if (range.includes('-')) {
      const [min, max] = range.split('-').map(n => parseInt(n));
      return roll >= min && roll <= max;
    } else {
      return roll === parseInt(range);
    }
  }

  /**
   * Initialize all random tables
   * @private
   */
  _initializeTables() {
    return {
      // ================== CHARACTER CREATION TABLES ==================
      
      'ability-scores': {
        category: 'character-creation',
        description: 'Generate ability scores using 3d6',
        dice: '3d6',
        type: 'direct',
        source: 'D&D 3.5 SRD',
        entries: null // Direct dice result
      },

      'character-race': {
        category: 'character-creation',
        description: 'Random character race selection',
        dice: '1d20',
        entries: [
          'Human', 'Elf (High)', 'Elf (Wood)', 'Elf (Dark)',
          'Dwarf (Mountain)', 'Dwarf (Hill)', 'Halfling (Lightfoot)', 'Halfling (Stout)',
          'Gnome (Forest)', 'Gnome (Rock)', 'Half-Elf', 'Half-Orc',
          'Dragonborn', 'Tiefling', 'Aasimar', 'Genasi',
          'Goliath', 'Tabaxi', 'Kenku', 'Yuan-Ti Pureblood'
        ]
      },

      'character-class': {
        category: 'character-creation',
        description: 'Random character class selection',
        dice: '1d20',
        entries: [
          'Fighter', 'Ranger', 'Paladin', 'Barbarian',
          'Rogue', 'Bard', 'Monk', 'Cleric',
          'Druid', 'Sorcerer', 'Wizard', 'Warlock',
          'Artificer', 'Blood Hunter', 'Mystic', 'Death Knight',
          'Favored Soul', 'Hexblade', 'Scout', 'Spellsword'
        ]
      },

      'starting-wealth': {
        category: 'character-creation',
        description: 'Starting wealth by class',
        dice: '1d12',
        entries: {
          '1-2': { value: '4d4 × 10 gp', class: 'Barbarian/Druid' },
          '3-4': { value: '5d4 × 10 gp', class: 'Fighter/Ranger' },
          '5-6': { value: '6d4 × 10 gp', class: 'Cleric/Rogue' },
          '7-8': { value: '5d4 × 10 gp', class: 'Bard/Paladin' },
          '9-10': { value: '3d4 × 10 gp', class: 'Monk' },
          '11-12': { value: '4d4 × 10 gp', class: 'Sorcerer/Wizard' }
        }
      },

      // ================== ADVENTURE GENERATION TABLES ==================

      'adventure-hook': {
        category: 'adventure',
        description: 'Adventure hooks and plot seeds',
        dice: '1d20',
        entries: [
          'A merchant offers gold to clear monsters from trade route',
          'Ancient tomb discovered, locals report strange lights',
          'Noble\'s daughter kidnapped by bandits in nearby forest',
          'Mysterious plague affecting livestock, druids suspected',
          'Underground fighting ring needs new gladiators',
          'Haunted mansion inherited, previous owners died mysteriously',
          'Dragon sighted near mining town, miners refuse to work',
          'Cult gathering in abandoned temple, townspeople worried',
          'Magical artifact stolen from local wizard\'s tower',
          'Strange creatures emerging from recently opened cave',
          'Caravan master seeks guards for dangerous journey',
          'Local lord accused of murdering his brother for inheritance',
          'Pirates raiding coastal villages, naval response needed',
          'Ancient forest withering, elven emissaries seek aid',
          'Dwarven mine collapsed, survivors trapped below',
          'Necromancer raising army of undead in nearby graveyard',
          'Political marriage needs protection from assassins',
          'Magical portal opened in town square, creatures emerging',
          'Local tavern keeper\'s son joined thieves\' guild',
          'Orc warband gathering, scouts report unusual tactics'
        ]
      },

      'dungeon-theme': {
        category: 'adventure',
        description: 'Dungeon themes and atmospheres',
        dice: '1d12',
        entries: [
          'Ancient Tomb - Undead guardians and burial treasures',
          'Abandoned Mine - Cave-ins, gas pockets, and mining equipment',
          'Ruined Temple - Religious artifacts and divine/infernal influence',
          'Natural Cavern - Underground rivers, crystal formations',
          'Wizard\'s Tower - Magical traps, constructs, and spell research',
          'Thieves\' Den - Hidden passages, poison traps, stolen goods',
          'Monster Lair - Territorial creatures with hoarded treasure',
          'Prison Complex - Cells, torture chambers, desperate inmates',
          'Military Fort - Defensive positions, armories, war strategies',
          'Noble Estate - Servants\' quarters, libraries, family secrets',
          'Cult Sanctuary - Ritual chambers, sacrificial altars',
          'Planar Gateway - Otherworldly influence and strange phenomena'
        ]
      },

      'encounter-difficulty': {
        category: 'adventure',
        description: 'Encounter difficulty scaling',
        dice: '1d100',
        entries: {
          '01-40': 'Easy - Single weak enemy or simple obstacle',
          '41-70': 'Moderate - Balanced challenge for the party',
          '71-90': 'Hard - Dangerous fight requiring tactics',
          '91-98': 'Deadly - Potential character death if not careful',
          '99-100': 'Legendary - Epic encounter with major consequences'
        }
      },

      // ================== NPC GENERATION TABLES ==================

      'npc-personality': {
        category: 'npcs',
        description: 'NPC personality traits',
        dice: '1d20',
        entries: [
          'Suspicious and paranoid, trusts no one',
          'Cheerful and optimistic despite hardships',
          'Greedy and always looking for profit',
          'Honor-bound and follows strict moral code',
          'Cowardly but tries to appear brave',
          'Scholarly and quotes ancient texts',
          'Romantic and sees adventure in everything',
          'Pragmatic and focused on practical solutions',
          'Superstitious and fears bad omens',
          'Arrogant and looks down on others',
          'Curious and asks many questions',
          'Loyal to friends but ruthless to enemies',
          'Melancholic and dwells on past failures',
          'Energetic and always in motion',
          'Secretive and speaks in riddles',
          'Compassionate and helps those in need',
          'Stubborn and refuses to change mind',
          'Witty and makes jokes even in danger',
          'Ambitious and seeks power or fame',
          'Wise but speaks little unless necessary'
        ]
      },

      'npc-occupation': {
        category: 'npcs',
        description: 'NPC occupations and roles',
        dice: '1d100',
        entries: {
          '01-05': 'Blacksmith - Creates and repairs metal goods',
          '06-10': 'Merchant - Trades in various goods',
          '11-15': 'Farmer - Grows crops and raises livestock',
          '16-20': 'Tavern Keeper - Runs local drinking establishment',
          '21-25': 'Guard - Protects town or specific location',
          '26-30': 'Priest - Serves local temple or shrine',
          '31-35': 'Hunter - Provides game and furs',
          '36-40': 'Craftsman - Makes specialized items',
          '41-45': 'Scholar - Studies ancient knowledge',
          '46-50': 'Healer - Provides medical aid',
          '51-55': 'Bard - Entertains and spreads news',
          '56-60': 'Soldier - Professional warrior',
          '61-65': 'Noble - Local aristocracy',
          '66-70': 'Beggar - Lives on charity',
          '71-75': 'Thief - Lives outside the law',
          '76-80': 'Sailor - Works on ships and docks',
          '81-85': 'Miner - Extracts valuable materials',
          '86-90': 'Wizard - Practices arcane magic',
          '91-95': 'Assassin - Kills for money',
          '96-100': 'Spy - Gathers information secretly'
        }
      },

      // ================== ENCOUNTER TABLES ==================

      'random-encounter-wilderness': {
        category: 'encounters',
        description: 'Wilderness encounters by environment',
        dice: '1d20',
        entries: [
          'Pack of wolves hunting for food',
          'Bandits demanding toll on road',
          'Injured traveler seeking help',
          'Merchant caravan under attack',
          'Wild boar protecting territory',
          'Lost child from nearby settlement',
          'Hermit wizard living in solitude',
          'Bear protecting cubs in cave',
          'Group of pilgrims traveling to shrine',
          'Orc scouts gathering information',
          'Treant defending ancient grove',
          'Goblin warband raiding settlements',
          'Mysterious fog with strange voices',
          'Abandoned campsite with clues',
          'Wild unicorn in sacred glade',
          'Dragon circling overhead',
          'Dryad asking for environmental aid',
          'Owlbear hunting in territory',
          'Ruins with guardian constructs',
          'Portal to elemental plane'
        ]
      },

      'random-encounter-dungeon': {
        category: 'encounters',
        description: 'Dungeon encounters and obstacles',
        dice: '1d20',
        entries: [
          'Skeleton guardians in ancient armor',
          'Pressure plate triggering dart trap',
          'Gelatinous cube blocking corridor',
          'Locked door requiring specific key',
          'Pit trap with spikes below',
          'Undead zombie shambling patrol',
          'Magical darkness spell area',
          'Poisonous gas filling chamber',
          'Giant spider in web-filled room',
          'Illusory wall hiding passage',
          'Rust monster seeking metal',
          'Riddle requiring intelligence to solve',
          'Acid pool corroding equipment',
          'Mimic disguised as treasure chest',
          'Spectral guardian demanding password',
          'Collapsing ceiling structural damage',
          'Magical ward preventing passage',
          'Giant rat colony in storage room',
          'Crystal formation with magical properties',
          'Ancient golem still following orders'
        ]
      },

      // ================== TREASURE TABLES ==================

      'treasure-type-minor': {
        category: 'treasure',
        description: 'Minor treasure for low-level adventures',
        dice: '1d100',
        entries: {
          '01-20': '1d6 × 10 copper pieces',
          '21-40': '1d4 × 10 silver pieces',
          '41-60': '1d3 × 10 gold pieces',
          '61-70': 'Potion of Healing',
          '71-80': 'Simple weapon (+1 enhancement)',
          '81-85': 'Scroll with 1st level spell',
          '86-90': 'Gem worth 10-50 gp',
          '91-95': 'Piece of jewelry worth 25-100 gp',
          '96-98': 'Minor wondrous item',
          '99-100': 'Roll on Major Treasure Table'
        }
      },

      'treasure-type-major': {
        category: 'treasure',
        description: 'Major treasure for high-level adventures',
        dice: '1d100',
        entries: {
          '01-10': '1d4 × 1000 gold pieces',
          '11-20': '2d4 platinum pieces × 100',
          '21-30': 'Magic weapon (+2 enhancement)',
          '31-40': 'Magic armor (+1 AC bonus)',
          '41-50': 'Wondrous item (moderate power)',
          '51-60': 'Scroll with 3rd-5th level spells',
          '61-70': 'Potion of greater power',
          '71-80': 'Ring of protection or similar',
          '81-85': 'Rod, staff, or wand',
          '86-90': 'Gem worth 500-1000 gp',
          '91-95': 'Art object worth 750-1500 gp',
          '96-98': 'Powerful wondrous item',
          '99-100': 'Artifact or legendary item'
        }
      },

      // ================== ENVIRONMENTAL TABLES ==================

      'weather-conditions': {
        category: 'environment',
        description: 'Weather conditions affecting travel',
        dice: '1d12',
        entries: [
          'Clear skies - Perfect traveling weather',
          'Light rain - Reduces visibility slightly',
          'Heavy storm - Difficult travel, seek shelter',
          'Fog - Severely reduced visibility',
          'Snow - Cold weather, slippery surfaces',
          'Wind - Strong gusts affect ranged attacks',
          'Hot - Exhaustion risk in armor',
          'Cold - Risk of hypothermia',
          'Overcast - Dim light conditions',
          'Drizzle - Wet but manageable conditions',
          'Hail - Dangerous precipitation',
          'Magical weather - Supernatural effects'
        ]
      },

      'terrain-features': {
        category: 'environment',
        description: 'Notable terrain features',
        dice: '1d20',
        entries: [
          'Ancient stone bridge over deep chasm',
          'Dense forest with intertwining branches',
          'Rocky outcropping with cave entrance',
          'Swift-flowing river requiring crossing',
          'Marshland with treacherous footing',
          'Hill with commanding view of area',
          'Ravine with steep walls',
          'Grove of unusually large trees',
          'Natural spring with clear water',
          'Boulder field from ancient avalanche',
          'Cliff face with potential climbing route',
          'Hidden valley accessible by narrow pass',
          'Ruins of ancient watchtower',
          'Crater from meteorite or magic',
          'Natural amphitheater in hills',
          'Series of interconnected caves',
          'Quicksand pit disguised as solid ground',
          'Crystalline formation with magical aura',
          'Abandoned mine shaft entrance',
          'Circle of standing stones'
        ]
      },

      // ================== PLOT DEVELOPMENT TABLES ==================

      'plot-twist': {
        category: 'plot',
        description: 'Unexpected plot developments',
        dice: '1d12',
        entries: [
          'Ally revealed as secret enemy',
          'Enemy offers to join party for mutual benefit',
          'Mission objective was deception or test',
          'Apparent villain is actually trying to help',
          'Real threat is much larger than expected',
          'Character\'s past comes back to haunt them',
          'Seemingly dead NPC returns alive',
          'Magic item has hidden curse or intelligence',
          'Authority figure is corrupt or compromised',
          'Time limit suddenly imposed on mission',
          'Innocent bystander holds crucial information',
          'Environment itself becomes hostile'
        ]
      },

      'quest-complication': {
        category: 'plot',
        description: 'Complications that arise during quests',
        dice: '1d20',
        entries: [
          'Another party competing for same objective',
          'Key NPC captured or goes missing',
          'Weather makes travel dangerous or impossible',
          'Equipment breaks or gets lost at crucial moment',
          'Law enforcement interferes with mission',
          'Monster lair discovered in planned route',
          'Political situation changes affecting quest',
          'Party member falls ill or gets cursed',
          'Information proves inaccurate or incomplete',
          'Local population hostile to outsiders',
          'Magic in area behaves unpredictably',
          'Time pressure increases unexpectedly',
          'Required resources cost more than expected',
          'Moral dilemma forces difficult choice',
          'Hidden faction working against party',
          'Natural disaster disrupts plans',
          'Key location is heavily guarded',
          'Betrayal by trusted contact',
          'Ancient protections activate',
          'Multiple solutions available, must choose wisely'
        ]
      }
    };
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RandomTablesEngine;
} else if (typeof window !== 'undefined') {
  window.RandomTablesEngine = RandomTablesEngine;
}
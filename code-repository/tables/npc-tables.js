/**
 * NPC Tables
 * Random tables for generating non-player characters
 * 
 * @version 1.1
 * @date September 20, 2025
 * @location code-repository/tables/npc-tables.js
 */

const NPCTables = {
  category: "npcs",
  description: "Tables for generating NPCs with names, traits, and motivations",
  
  tables: {
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

    "npc-occupations": {
      id: "npc-occupations",
      name: "NPC Occupations",
      description: "Random professions and jobs for NPCs",
      diceExpression: "1d100",
      category: "npcs",
      results: [
        { range: [1, 5], result: "Blacksmith" },
        { range: [6, 10], result: "Innkeeper" },
        { range: [11, 15], result: "Merchant" },
        { range: [16, 20], result: "Guard Captain" },
        { range: [21, 25], result: "Scholar" },
        { range: [26, 30], result: "Priest/Cleric" },
        { range: [31, 35], result: "Farmer" },
        { range: [36, 40], result: "Bard/Entertainer" },
        { range: [41, 45], result: "Healer/Herbalist" },
        { range: [46, 50], result: "Ship Captain" },
        { range: [51, 55], result: "Noble/Aristocrat" },
        { range: [56, 60], result: "Thieves' Guild Member" },
        { range: [61, 65], result: "Wizard/Mage" },
        { range: [66, 70], result: "Craftsperson" },
        { range: [71, 75], result: "Caravan Master" },
        { range: [76, 80], result: "Town Official" },
        { range: [81, 85], result: "Adventurer (Retired)" },
        { range: [86, 90], result: "Spy/Information Broker" },
        { range: [91, 95], result: "Cult Leader" },
        { range: [96, 100], result: "Mysterious Wanderer" }
      ]
    },

    "npc-secrets": {
      id: "npc-secrets",
      name: "NPC Secrets",
      description: "Hidden secrets that NPCs might be keeping",
      diceExpression: "1d20",
      category: "npcs",
      results: [
        { range: [1, 1], result: "Is secretly working for the enemy" },
        { range: [2, 2], result: "Has a hidden magical ability" },
        { range: [3, 3], result: "Is not who they claim to be" },
        { range: [4, 4], result: "Owes a dangerous debt" },
        { range: [5, 5], result: "Is cursed or under a spell" },
        { range: [6, 6], result: "Has a twin or doppelganger" },
        { range: [7, 7], result: "Is secretly nobility in hiding" },
        { range: [8, 8], result: "Has committed a serious crime" },
        { range: [9, 9], result: "Knows the location of treasure" },
        { range: [10, 10], result: "Is being blackmailed" },
        { range: [11, 11], result: "Has a terminal illness" },
        { range: [12, 12], result: "Is part of a secret organization" },
        { range: [13, 13], result: "Has prophetic visions" },
        { range: [14, 14], result: "Is protecting someone important" },
        { range: [15, 15], result: "Has access to forbidden knowledge" },
        { range: [16, 16], result: "Is actually much older than they appear" },
        { range: [17, 17], result: "Has a secret romantic relationship" },
        { range: [18, 18], result: "Is planning to disappear soon" },
        { range: [19, 19], result: "Possesses a powerful magical item" },
        { range: [20, 20], result: "Is not entirely human" }
      ]
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NPCTables;
}

// Global namespace for browser use
if (typeof window !== 'undefined') {
  window.NPCTables = NPCTables;
}
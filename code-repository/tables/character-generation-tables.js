/**
 * Character Generation Tables
 * Random tables for character creation and development
 * 
 * @version 1.1
 * @date September 20, 2025
 * @location code-repository/tables/character-generation-tables.js
 */

const CharacterGenerationTables = {
  category: "character-generation",
  description: "Tables for generating character traits, abilities, and background elements",
  
  tables: {
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

    "character-backgrounds": {
      id: "character-backgrounds",
      name: "Character Background Elements",
      description: "Random background elements to flesh out character history",
      diceExpression: "1d20",
      category: "character-generation",
      results: [
        { range: [1, 1], result: "Grew up in a traveling circus" },
        { range: [2, 2], result: "Apprenticed to a famous artisan" },
        { range: [3, 3], result: "Survived a major disaster" },
        { range: [4, 4], result: "Raised by religious order" },
        { range: [5, 5], result: "Noble family fallen from grace" },
        { range: [6, 6], result: "Street orphan turned scholar" },
        { range: [7, 7], result: "Former soldier seeking redemption" },
        { range: [8, 8], result: "Merchant family with dark secrets" },
        { range: [9, 9], result: "Lost memory of early childhood" },
        { range: [10, 10], result: "Prophesied to fulfill ancient destiny" },
        { range: [11, 11], result: "Descendant of legendary hero" },
        { range: [12, 12], result: "Marked by divine intervention" },
        { range: [13, 13], result: "Survivor of magical experiment" },
        { range: [14, 14], result: "Former criminal seeking new life" },
        { range: [15, 15], result: "Wilderness hermit returned to society" },
        { range: [16, 16], result: "Court entertainer with hidden talents" },
        { range: [17, 17], result: "Sailor from distant foreign lands" },
        { range: [18, 18], result: "Academic prodigy seeking field experience" },
        { range: [19, 19], result: "Haunted by vengeful spirit" },
        { range: [20, 20], result: "Bearer of cursed family bloodline" }
      ]
    },

    "character-race": {
      id: "character-race",
      name: "Character Race Selection",
      description: "Random races for character generation",
      diceExpression: "1d20",
      category: "character-generation",
      results: [
        { range: [1, 3], result: "Human" },
        { range: [4, 5], result: "Elf" },
        { range: [6, 7], result: "Dwarf" },
        { range: [8, 9], result: "Halfling" },
        { range: [10, 10], result: "Gnome" },
        { range: [11, 11], result: "Half-Elf" },
        { range: [12, 12], result: "Half-Orc" },
        { range: [13, 13], result: "Dragonborn" },
        { range: [14, 14], result: "Tiefling" },
        { range: [15, 15], result: "Aasimar" },
        { range: [16, 16], result: "Genasi" },
        { range: [17, 17], result: "Goliath" },
        { range: [18, 18], result: "Tabaxi" },
        { range: [19, 19], result: "Firbolg" },
        { range: [20, 20], result: "Kenku" }
      ]
    },

    "character-class": {
      id: "character-class",
      name: "Character Class Selection",
      description: "Random classes for character generation",
      diceExpression: "1d20",
      category: "character-generation",
      results: [
        { range: [1, 2], result: "Fighter" },
        { range: [3, 4], result: "Wizard" },
        { range: [5, 6], result: "Rogue" },
        { range: [7, 8], result: "Cleric" },
        { range: [9, 9], result: "Ranger" },
        { range: [10, 10], result: "Paladin" },
        { range: [11, 11], result: "Barbarian" },
        { range: [12, 12], result: "Bard" },
        { range: [13, 13], result: "Druid" },
        { range: [14, 14], result: "Monk" },
        { range: [15, 15], result: "Sorcerer" },
        { range: [16, 16], result: "Warlock" },
        { range: [17, 17], result: "Artificer" },
        { range: [18, 18], result: "Blood Hunter" },
        { range: [19, 19], result: "Mystic" },
        { range: [20, 20], result: "Death Knight" }
      ]
    },

    "starting-wealth": {
      id: "starting-wealth",
      name: "Starting Wealth by Class",
      description: "Starting gold pieces for new characters by class",
      diceExpression: "1d100",
      category: "character-generation",
      results: [
        { range: [1, 10], result: "2d4 × 10 gp", description: "Barbarian, Ranger" },
        { range: [11, 20], result: "2d4 × 10 gp", description: "Fighter, Paladin" },
        { range: [21, 30], result: "3d4 × 10 gp", description: "Bard, Rogue" },
        { range: [31, 40], result: "4d4 × 10 gp", description: "Cleric, Druid" },
        { range: [41, 50], result: "3d4 × 10 gp", description: "Monk, Sorcerer" },
        { range: [51, 60], result: "2d4 × 10 gp", description: "Wizard" },
        { range: [61, 70], result: "5d4 × 10 gp", description: "Warlock" },
        { range: [71, 80], result: "4d4 × 10 gp", description: "Artificer" },
        { range: [81, 90], result: "3d4 × 10 gp", description: "Blood Hunter" },
        { range: [91, 100], result: "6d4 × 10 gp", description: "Mystic, Death Knight" }
      ]
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CharacterGenerationTables;
}

// Global namespace for browser use
if (typeof window !== 'undefined') {
  window.CharacterGenerationTables = CharacterGenerationTables;
}
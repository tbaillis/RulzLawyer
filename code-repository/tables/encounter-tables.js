/**
 * Encounter Tables
 * Random tables for generating encounters and combat situations
 * 
 * @version 1.1
 * @date September 20, 2025
 * @location code-repository/tables/encounter-tables.js
 */

const EncounterTables = {
  category: "encounters",
  description: "Tables for generating random encounters across different environments",
  
  tables: {
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

    "mountain-encounters": {
      id: "mountain-encounters",
      name: "Mountain Random Encounters",
      description: "Random encounters for mountainous and highland areas",
      diceExpression: "1d20",
      category: "encounters",
      results: [
        { range: [1, 2], result: "Rockslide blocks the path" },
        { range: [3, 4], result: "Mountain goats on narrow ledge" },
        { range: [5, 6], result: "Eagle or griffon nest nearby" },
        { range: [7, 8], result: "Dwarven mining expedition" },
        { range: [9, 10], result: "Hermit's cave dwelling" },
        { range: [11, 12], result: "Ancient dwarven ruins" },
        { range: [13, 14], result: "Orc or goblin war party" },
        { range: [15, 16], result: "Avalanche warning signs" },
        { range: [17, 17], result: "Dragon's lair entrance" },
        { range: [18, 18], result: "Stone giant territory" },
        { range: [19, 19], result: "Sacred mountain shrine" },
        { range: [20, 20], result: "Portal to elemental plane of earth" }
      ]
    },

    "swamp-encounters": {
      id: "swamp-encounters",
      name: "Swamp Random Encounters",
      description: "Random encounters for swamps, marshes, and wetlands",
      diceExpression: "1d12",
      category: "encounters",
      results: [
        { range: [1, 1], result: "Crocodiles sunning on logs" },
        { range: [2, 2], result: "Will-o'-wisps leading travelers astray" },
        { range: [3, 3], result: "Lizardfolk hunting party" },
        { range: [4, 4], result: "Witch's hut on stilts" },
        { range: [5, 5], result: "Shambling mound guarding territory" },
        { range: [6, 6], result: "Poisonous gas vents from bog" },
        { range: [7, 7], result: "Black dragon's lair entrance" },
        { range: [8, 8], result: "Quicksand trap with treasure" },
        { range: [9, 9], result: "Plague-bearing insects swarm" },
        { range: [10, 10], result: "Bullywug village on platforms" },
        { range: [11, 11], result: "Ancient temple sinking into marsh" },
        { range: [12, 12], result: "Hydra's multiple-headed silhouette" }
      ]
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EncounterTables;
}

// Global namespace for browser use
if (typeof window !== 'undefined') {
  window.EncounterTables = EncounterTables;
}
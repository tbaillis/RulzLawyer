/**
 * Location Tables
 * Random tables for generating locations and areas
 * 
 * @version 1.1
 * @date September 20, 2025
 * @location code-repository/tables/location-tables.js
 */

const LocationTables = {
  category: "locations",
  description: "Tables for generating locations, buildings, and areas of interest",
  
  tables: {
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

    "shop-names": {
      id: "shop-names",
      name: "Shop Names",
      description: "Random names for shops and businesses",
      diceExpression: "1d100",
      category: "locations",
      results: [
        { range: [1, 5], result: "The Golden Hammer Smithy" },
        { range: [6, 10], result: "Moonbeam's Magical Emporium" },
        { range: [11, 15], result: "The Dusty Tome Bookshop" },
        { range: [16, 20], result: "Silver Thread Tailoring" },
        { range: [21, 25], result: "The Rusty Blade Weaponry" },
        { range: [26, 30], result: "Crimson Rose Apothecary" },
        { range: [31, 35], result: "The Wanderer's Pack Trading Post" },
        { range: [36, 40], result: "Brightforge Armaments" },
        { range: [41, 45], result: "The Curious Cat Curiosities" },
        { range: [46, 50], result: "Starlight Jewelry & Gems" },
        { range: [51, 55], result: "The Iron Horse Stables" },
        { range: [56, 60], result: "Greenleaf Herbalism" },
        { range: [61, 65], result: "The Singing Lute Music Shop" },
        { range: [66, 70], result: "Cobblestone Shoe Repairs" },
        { range: [71, 75], result: "The Mage's Tower Supplies" },
        { range: [76, 80], result: "Dragonscale Exotic Goods" },
        { range: [81, 85], result: "The Clockwork Workshop" },
        { range: [86, 90], result: "Shadowmere Imports" },
        { range: [91, 95], result: "The Phoenix Feather Fine Goods" },
        { range: [96, 100], result: "Voidwalker's Mysterious Wares" }
      ]
    },

    "settlement-features": {
      id: "settlement-features",
      name: "Settlement Features",
      description: "Notable features and landmarks in towns and cities",
      diceExpression: "1d20",
      category: "locations",
      results: [
        { range: [1, 1], result: "Ancient statue in the town square" },
        { range: [2, 2], result: "Covered bridge over a rushing river" },
        { range: [3, 3], result: "Tall watchtower with warning bells" },
        { range: [4, 4], result: "Public fountain with fresh spring water" },
        { range: [5, 5], result: "Market square with colorful stalls" },
        { range: [6, 6], result: "Temple with distinctive architecture" },
        { range: [7, 7], result: "Academy or school of learning" },
        { range: [8, 8], result: "Guildhall for local craftspeople" },
        { range: [9, 9], result: "Defensive wall with sturdy gates" },
        { range: [10, 10], result: "Harbor with merchant vessels" },
        { range: [11, 11], result: "Grand library open to the public" },
        { range: [12, 12], result: "Theatre for performances and plays" },
        { range: [13, 13], result: "Arena for contests and competitions" },
        { range: [14, 14], result: "Maze-like old quarter with narrow streets" },
        { range: [15, 15], result: "Cemetery with elaborate monuments" },
        { range: [16, 16], result: "Mill powered by water or wind" },
        { range: [17, 17], result: "Magical light posts throughout streets" },
        { range: [18, 18], result: "Underground tunnel system" },
        { range: [19, 19], result: "Floating district held aloft by magic" },
        { range: [20, 20], result: "Portal gate to another location" }
      ]
    },

    "terrain-features": {
      id: "terrain-features",
      name: "Terrain Features",
      description: "Natural and magical terrain features for outdoor adventures",
      diceExpression: "1d20",
      category: "locations",
      results: [
        { range: [1, 1], result: "Dense forest with ancient trees" },
        { range: [2, 2], result: "Rocky hills with hidden caves" },
        { range: [3, 3], result: "Rushing river with treacherous currents" },
        { range: [4, 4], result: "Misty swampland with hidden dangers" },
        { range: [5, 5], result: "Open grasslands stretching to horizon" },
        { range: [6, 6], result: "Jagged mountain peaks covered in snow" },
        { range: [7, 7], result: "Desert dunes shifting in the wind" },
        { range: [8, 8], result: "Frozen tundra with howling winds" },
        { range: [9, 9], result: "Magical grove glowing with energy" },
        { range: [10, 10], result: "Deep canyon with narrow passages" },
        { range: [11, 11], result: "Volcanic region with lava flows" },
        { range: [12, 12], result: "Crystal formations jutting from ground" },
        { range: [13, 13], result: "Floating islands connected by bridges" },
        { range: [14, 14], result: "Underground cavern system" },
        { range: [15, 15], result: "Coastal cliffs overlooking the sea" },
        { range: [16, 16], result: "Badlands with strange rock formations" },
        { range: [17, 17], result: "Jungle canopy blocking out sunlight" },
        { range: [18, 18], result: "Plateau rising high above surrounding land" },
        { range: [19, 19], result: "Portal-scarred wasteland with reality tears" },
        { range: [20, 20], result: "Time-dilated zone where past and present merge" }
      ]
    },

    "dungeon-theme": {
      id: "dungeon-theme",
      name: "Dungeon Theme",
      description: "Thematic elements and background for dungeon adventures",
      diceExpression: "1d20",
      category: "locations",
      results: [
        { range: [1, 1], result: "Ancient tomb of forgotten ruler" },
        { range: [2, 2], result: "Abandoned wizard's tower" },
        { range: [3, 3], result: "Underground temple to dark deity" },
        { range: [4, 4], result: "Natural cave system with monsters" },
        { range: [5, 5], result: "Ruined castle overrun by evil" },
        { range: [6, 6], result: "Mine shaft with dangerous creatures" },
        { range: [7, 7], result: "Underwater palace of sea creatures" },
        { range: [8, 8], result: "Elemental plane gateway complex" },
        { range: [9, 9], result: "Prison complex with escaped inmates" },
        { range: [10, 10], result: "Laboratory of mad alchemist" },
        { range: [11, 11], result: "Cultist hideout in sewers" },
        { range: [12, 12], result: "Dragon's lair in mountain cave" },
        { range: [13, 13], result: "Demonic fortress in hellish realm" },
        { range: [14, 14], result: "Time-lost ruins from another era" },
        { range: [15, 15], result: "Living dungeon that changes layout" },
        { range: [16, 16], result: "Extraplanar maze created by entity" },
        { range: [17, 17], result: "Abandoned city district with secrets" },
        { range: [18, 18], result: "Necromancer's crypt with undead army" },
        { range: [19, 19], result: "Planar convergence point with reality shifts" },
        { range: [20, 20], result: "Artifact vault guarded by constructs" }
      ]
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocationTables;
}

// Global namespace for browser use
if (typeof window !== 'undefined') {
  window.LocationTables = LocationTables;
}
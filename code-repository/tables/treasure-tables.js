/**
 * Treasure Tables
 * Random tables for generating treasure, loot, and magical items
 * 
 * @version 1.1
 * @date September 20, 2025
 * @location code-repository/tables/treasure-tables.js
 */

const TreasureTables = {
  category: "treasure",
  description: "Tables for generating various types of treasure and magical items",
  
  tables: {
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

    "gems-and-jewelry": {
      id: "gems-and-jewelry",
      name: "Gems and Jewelry",
      description: "Precious stones and ornamental items",
      diceExpression: "1d20",
      category: "treasure",
      results: [
        { range: [1, 2], result: "Rough gemstone (10gp value)" },
        { range: [3, 4], result: "Polished agate (25gp value)" },
        { range: [5, 6], result: "Small pearl (50gp value)" },
        { range: [7, 8], result: "Garnet stone (100gp value)" },
        { range: [9, 10], result: "Silver ring (75gp value)" },
        { range: [11, 12], result: "Gold bracelet (150gp value)" },
        { range: [13, 14], result: "Sapphire gem (250gp value)" },
        { range: [15, 15], result: "Ruby gem (500gp value)" },
        { range: [16, 16], result: "Emerald gem (750gp value)" },
        { range: [17, 17], result: "Diamond gem (1000gp value)" },
        { range: [18, 18], result: "Ornate crown (2500gp value)" },
        { range: [19, 19], result: "Royal scepter (5000gp value)" },
        { range: [20, 20], result: "Ancient royal regalia (10000gp value)" }
      ]
    },

    "art-objects": {
      id: "art-objects",
      name: "Art Objects",
      description: "Valuable artistic and cultural items",
      diceExpression: "1d20",
      category: "treasure",
      results: [
        { range: [1, 2], result: "Carved bone figurine (25gp)" },
        { range: [3, 4], result: "Small bronze statue (75gp)" },
        { range: [5, 6], result: "Illuminated manuscript (150gp)" },
        { range: [7, 8], result: "Fine silk tapestry (250gp)" },
        { range: [9, 10], result: "Ornate silver chalice (400gp)" },
        { range: [11, 12], result: "Masterwork painting (600gp)" },
        { range: [13, 14], result: "Golden ceremonial mask (1000gp)" },
        { range: [15, 15], result: "Jeweled musical instrument (1500gp)" },
        { range: [16, 16], result: "Ancient ceremonial armor (2500gp)" },
        { range: [17, 17], result: "Platinum religious icon (4000gp)" },
        { range: [18, 18], result: "Legendary weapon replica (6000gp)" },
        { range: [19, 19], result: "Royal family portrait (8000gp)" },
        { range: [20, 20], result: "Priceless cultural artifact (15000gp)" }
      ]
    },

    "magic-weapons": {
      id: "magic-weapons",
      name: "Magic Weapons",
      description: "Enchanted weapons and armaments",
      diceExpression: "1d20",
      category: "treasure",
      results: [
        { range: [1, 3], result: "+1 Dagger" },
        { range: [4, 6], result: "+1 Shortsword" },
        { range: [7, 9], result: "+1 Longsword" },
        { range: [10, 11], result: "+1 Crossbow" },
        { range: [12, 13], result: "+1 Warhammer" },
        { range: [14, 15], result: "Flaming Longsword (+1, 1d6 fire damage)" },
        { range: [16, 16], result: "Frost Brand (+1, 1d6 cold damage)" },
        { range: [17, 17], result: "Shocking Weapon (+1, 1d6 electricity damage)" },
        { range: [18, 18], result: "Keen Rapier (+1, 19-20 critical threat)" },
        { range: [19, 19], result: "Holy Avenger (+2, extra damage vs evil)" },
        { range: [20, 20], result: "Vorpal Blade (+3, chance to sever head)" }
      ]
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TreasureTables;
}

// Global namespace for browser use
if (typeof window !== 'undefined') {
  window.TreasureTables = TreasureTables;
}
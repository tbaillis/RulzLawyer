/**
 * RulzLawyer Random Tables Engine
 * Complete D&D 3.5 random table generation system
 * 
 * Features:
 * - 17+ comprehensive D&D 3.5 random tables
 * - Names, encounters, treasures, weather, NPCs, settlements
 * - Dungeons, magic items, adventure hooks, and more
 * - Weighted probability distributions
 * - Contextual generation based on parameters
 * - Integration with dice engine and character data
 */

class RandomTablesEngine {
    constructor(diceEngine) {
        this.diceEngine = diceEngine;
        this.tables = {};
        this.metadata = {
            version: '1.0.0',
            created: new Date(),
            totalTables: 0,
            lastGenerated: null
        };

        console.log('🎲 Initializing Random Tables Engine...');
        this.initializeTables();
        console.log(`✅ Random Tables Engine ready with ${this.metadata.totalTables} tables`);
    }

    // === Core Generation Method ===
    generateFromTable(tableName, parameters = {}) {
        try {
            if (!this.tables[tableName]) {
                throw new Error(`Table '${tableName}' not found`);
            }

            const table = this.tables[tableName];
            const result = this.rollOnTable(table, parameters);

            // Update metadata
            this.metadata.lastGenerated = new Date();

            console.log(`🎯 Generated from ${tableName}:`, result);
            return {
                table: tableName,
                result: result,
                parameters: parameters,
                timestamp: new Date(),
                metadata: {
                    tableSize: table.entries.length,
                    method: table.method || 'standard'
                }
            };

        } catch (error) {
            console.error(`❌ Random table generation failed for ${tableName}:`, error);
            throw error;
        }
    }

    // === Table Rolling Logic ===
    rollOnTable(table, parameters = {}) {
        const diceRoll = this.diceEngine ? 
            this.diceEngine.roll(table.dice) : 
            this.rollFallback(table.dice);

        // Handle different table types
        switch (table.method) {
            case 'percentile':
                return this.rollPercentileTable(table, diceRoll.total, parameters);
            case 'weighted':
                return this.rollWeightedTable(table, parameters);
            case 'conditional':
                return this.rollConditionalTable(table, parameters);
            case 'nested':
                return this.rollNestedTable(table, diceRoll.total, parameters);
            default:
                return this.rollStandardTable(table, diceRoll.total, parameters);
        }
    }

    // === Rolling Methods ===
    rollStandardTable(table, roll, parameters) {
        const entry = table.entries.find(e => roll >= e.min && roll <= e.max);
        if (!entry) {
            return this.handleMissedRoll(table, roll);
        }

        return this.processEntry(entry, parameters);
    }

    rollPercentileTable(table, roll, parameters) {
        const entry = table.entries.find(e => roll >= e.min && roll <= e.max);
        if (!entry) {
            return this.handleMissedRoll(table, roll);
        }

        return this.processEntry(entry, parameters);
    }

    rollWeightedTable(table, parameters) {
        const totalWeight = table.entries.reduce((sum, entry) => sum + (entry.weight || 1), 0);
        const roll = Math.random() * totalWeight;
        
        let currentWeight = 0;
        for (const entry of table.entries) {
            currentWeight += (entry.weight || 1);
            if (roll <= currentWeight) {
                return this.processEntry(entry, parameters);
            }
        }

        return this.processEntry(table.entries[table.entries.length - 1], parameters);
    }

    rollConditionalTable(table, parameters) {
        // Filter entries based on conditions
        const validEntries = table.entries.filter(entry => {
            if (!entry.conditions) return true;
            
            return entry.conditions.every(condition => {
                return this.checkCondition(condition, parameters);
            });
        });

        if (validEntries.length === 0) {
            return this.handleNoValidEntries(table, parameters);
        }

        const roll = this.diceEngine ? 
            this.diceEngine.roll('1d' + validEntries.length) : 
            { total: Math.floor(Math.random() * validEntries.length) + 1 };

        return this.processEntry(validEntries[roll.total - 1], parameters);
    }

    rollNestedTable(table, roll, parameters) {
        const entry = this.rollStandardTable(table, roll, parameters);
        
        if (entry.subtable) {
            const subtableResult = this.generateFromTable(entry.subtable, parameters);
            return {
                ...entry,
                subtableResult: subtableResult.result
            };
        }

        return entry;
    }

    // === Entry Processing ===
    processEntry(entry, parameters) {
        let result = { ...entry };

        // Process text substitutions
        if (typeof result.text === 'string') {
            result.text = this.processTextSubstitutions(result.text, parameters);
        }

        // Process dynamic values
        if (result.value && typeof result.value === 'function') {
            result.value = result.value(parameters);
        }

        // Process dice rolls within entries
        if (result.dice) {
            const diceResult = this.diceEngine ? 
                this.diceEngine.roll(result.dice) : 
                this.rollFallback(result.dice);
            result.diceResult = diceResult;
        }

        // Process additional rolls
        if (result.additionalRolls) {
            result.additionalResults = [];
            for (const additionalRoll of result.additionalRolls) {
                const additionalResult = this.generateFromTable(additionalRoll.table, {
                    ...parameters,
                    ...additionalRoll.parameters
                });
                result.additionalResults.push(additionalResult);
            }
        }

        return result;
    }

    // === Text Processing ===
    processTextSubstitutions(text, parameters) {
        let processedText = text;

        // Replace parameter substitutions
        processedText = processedText.replace(/\{(\w+)\}/g, (match, key) => {
            return parameters[key] || match;
        });

        // Replace table references
        processedText = processedText.replace(/\[TABLE:(\w+)\]/g, (match, tableName) => {
            try {
                const result = this.generateFromTable(tableName, parameters);
                return result.result.text || result.result.name || 'Unknown';
            } catch (error) {
                return match;
            }
        });

        // Replace dice rolls
        processedText = processedText.replace(/\[ROLL:([^\]]+)\]/g, (match, dice) => {
            const roll = this.diceEngine ? 
                this.diceEngine.roll(dice) : 
                this.rollFallback(dice);
            return roll.total.toString();
        });

        return processedText;
    }

    // === Utility Methods ===
    checkCondition(condition, parameters) {
        switch (condition.type) {
            case 'parameter':
                return parameters[condition.key] === condition.value;
            case 'range':
                const value = parameters[condition.key];
                return value >= condition.min && value <= condition.max;
            case 'exists':
                return parameters[condition.key] !== undefined;
            default:
                return true;
        }
    }

    handleMissedRoll(table, roll) {
        console.warn(`⚠️  Missed roll ${roll} for table ${table.name}, using fallback`);
        return {
            text: 'Unusual result (reroll or DM discretion)',
            roll: roll,
            fallback: true
        };
    }

    handleNoValidEntries(table, parameters) {
        console.warn(`⚠️  No valid entries for table ${table.name} with parameters:`, parameters);
        return {
            text: 'No suitable result (check parameters)',
            parameters: parameters,
            fallback: true
        };
    }

    rollFallback(dice) {
        // Simple fallback for when dice engine is not available
        const match = dice.match(/(\d+)d(\d+)([+-]\d+)?/);
        if (!match) return { total: 1 };

        const count = parseInt(match[1]);
        const sides = parseInt(match[2]);
        const modifier = match[3] ? parseInt(match[3]) : 0;

        let total = 0;
        for (let i = 0; i < count; i++) {
            total += Math.floor(Math.random() * sides) + 1;
        }

        return { total: total + modifier };
    }

    // === Table Initialization ===
    initializeTables() {
        console.log('📚 Loading D&D 3.5 random tables...');

        // Character Names
        this.tables.characterNames = this.createCharacterNamesTable();
        this.tables.surnames = this.createSurnamesTable();

        // Encounters & Creatures
        this.tables.encounters = this.createEncountersTable();
        this.tables.animals = this.createAnimalsTable();
        this.tables.humanoids = this.createHumanoidsTable();

        // Treasure & Items
        this.tables.treasures = this.createTreasuresTable();
        this.tables.magicItems = this.createMagicItemsTable();
        this.tables.gems = this.createGemsTable();
        this.tables.mundaneItems = this.createMundaneItemsTable();

        // Locations & Environment
        this.tables.settlements = this.createSettlementsTable();
        this.tables.buildings = this.createBuildingsTable();
        this.tables.weather = this.createWeatherTable();
        this.tables.terrain = this.createTerrainTable();

        // Dungeons & Adventures
        this.tables.dungeonRooms = this.createDungeonRoomsTable();
        this.tables.traps = this.createTrapsTable();
        this.tables.adventureHooks = this.createAdventureHooksTable();

        // NPCs & Social
        this.tables.npcPersonalities = this.createNpcPersonalitiesTable();
        this.tables.motivations = this.createMotivationsTable();
        this.tables.quirks = this.createQuirksTable();

        // Count tables
        this.metadata.totalTables = Object.keys(this.tables).length;
        console.log(`✅ Loaded ${this.metadata.totalTables} random tables`);
    }

    // === CHARACTER NAMES TABLE ===
    createCharacterNamesTable() {
        return {
            name: 'Character Names',
            dice: '1d100',
            method: 'percentile',
            entries: [
                // Human Names (1-40)
                { min: 1, max: 5, text: 'Aerdrie', race: 'human', gender: 'female' },
                { min: 6, max: 10, text: 'Ahvain', race: 'human', gender: 'male' },
                { min: 11, max: 15, text: 'Aramil', race: 'human', gender: 'male' },
                { min: 16, max: 20, text: 'Berris', race: 'human', gender: 'female' },
                { min: 21, max: 25, text: 'Cithreth', race: 'human', gender: 'female' },
                { min: 26, max: 30, text: 'Drannor', race: 'human', gender: 'male' },
                { min: 31, max: 35, text: 'Enna', race: 'human', gender: 'female' },
                { min: 36, max: 40, text: 'Galinndan', race: 'human', gender: 'male' },

                // Elven Names (41-65)
                { min: 41, max: 45, text: 'Halimath', race: 'elf', gender: 'male' },
                { min: 46, max: 50, text: 'Immeral', race: 'elf', gender: 'male' },
                { min: 51, max: 55, text: 'Ivellios', race: 'elf', gender: 'male' },
                { min: 56, max: 60, text: 'Korfel', race: 'elf', gender: 'male' },
                { min: 61, max: 65, text: 'Lamlis', race: 'elf', gender: 'female' },

                // Dwarven Names (66-85)
                { min: 66, max: 70, text: 'Baern', race: 'dwarf', gender: 'male' },
                { min: 71, max: 75, text: 'Darrak', race: 'dwarf', gender: 'male' },
                { min: 76, max: 80, text: 'Eberk', race: 'dwarf', gender: 'male' },
                { min: 81, max: 85, text: 'Gunnloda', race: 'dwarf', gender: 'female' },

                // Halfling Names (86-100)
                { min: 86, max: 90, text: 'Alton', race: 'halfling', gender: 'male' },
                { min: 91, max: 95, text: 'Cora', race: 'halfling', gender: 'female' },
                { min: 96, max: 100, text: 'Garret', race: 'halfling', gender: 'male' }
            ]
        };
    }

    // === SURNAMES TABLE ===
    createSurnamesTable() {
        return {
            name: 'Surnames',
            dice: '1d50',
            method: 'standard',
            entries: [
                { min: 1, max: 3, text: 'Amakir' },
                { min: 4, max: 6, text: 'Amakura' },
                { min: 7, max: 9, text: 'Galanodel' },
                { min: 10, max: 12, text: 'Holimion' },
                { min: 13, max: 15, text: 'Liadon' },
                { min: 16, max: 18, text: 'Meliamne' },
                { min: 19, max: 21, text: 'Nailo' },
                { min: 22, max: 24, text: 'Siannodel' },
                { min: 25, max: 27, text: 'Xiloscient' },
                { min: 28, max: 30, text: 'Battlehammer' },
                { min: 31, max: 33, text: 'Brawnanvil' },
                { min: 34, max: 36, text: 'Dankil' },
                { min: 37, max: 39, text: 'Fireforge' },
                { min: 40, max: 42, text: 'Frostbeard' },
                { min: 43, max: 45, text: 'Gorunn' },
                { min: 46, max: 48, text: 'Holderhek' },
                { min: 49, max: 50, text: 'Ironfist' }
            ]
        };
    }

    // === ENCOUNTERS TABLE ===
    createEncountersTable() {
        return {
            name: 'Random Encounters',
            dice: '1d100',
            method: 'percentile',
            entries: [
                // Common Animals (1-30)
                { min: 1, max: 5, text: 'Badger', cr: 0, type: 'animal', hostile: false },
                { min: 6, max: 10, text: 'Bear, Brown', cr: 4, type: 'animal', hostile: true },
                { min: 11, max: 15, text: 'Boar', cr: 2, type: 'animal', hostile: true },
                { min: 16, max: 20, text: 'Eagle', cr: 1, type: 'animal', hostile: false },
                { min: 21, max: 25, text: 'Wolf', cr: 1, type: 'animal', hostile: true },
                { min: 26, max: 30, text: 'Dire Wolf', cr: 3, type: 'animal', hostile: true },

                // Humanoids (31-50)
                { min: 31, max: 35, text: 'Bandits (1d4+1)', cr: 2, type: 'humanoid', hostile: true },
                { min: 36, max: 40, text: 'Merchants with Guards', cr: 3, type: 'humanoid', hostile: false },
                { min: 41, max: 45, text: 'Pilgrims', cr: 1, type: 'humanoid', hostile: false },
                { min: 46, max: 50, text: 'Patrol (1d6 guards)', cr: 4, type: 'humanoid', hostile: false },

                // Monsters (51-85)
                { min: 51, max: 55, text: 'Goblin Scouts (1d4)', cr: 2, type: 'humanoid', hostile: true },
                { min: 56, max: 60, text: 'Orc Warriors (1d3)', cr: 3, type: 'humanoid', hostile: true },
                { min: 61, max: 65, text: 'Owlbear', cr: 4, type: 'magical beast', hostile: true },
                { min: 66, max: 70, text: 'Skeleton Warriors (1d6)', cr: 3, type: 'undead', hostile: true },
                { min: 71, max: 75, text: 'Giant Spider', cr: 1, type: 'vermin', hostile: true },
                { min: 76, max: 80, text: 'Troll', cr: 5, type: 'giant', hostile: true },
                { min: 81, max: 85, text: 'Wyvern', cr: 6, type: 'dragon', hostile: true },

                // Special/Rare (86-100)
                { min: 86, max: 90, text: 'Unicorn', cr: 4, type: 'magical beast', hostile: false },
                { min: 91, max: 95, text: 'Ancient Ruins', cr: 0, type: 'location', hostile: false },
                { min: 96, max: 98, text: 'Mysterious Traveler', cr: 5, type: 'humanoid', hostile: false },
                { min: 99, max: 100, text: 'Dragon (Young)', cr: 8, type: 'dragon', hostile: true }
            ]
        };
    }

    // === ANIMALS TABLE ===
    createAnimalsTable() {
        return {
            name: 'Animals',
            dice: '1d20',
            method: 'standard',
            entries: [
                { min: 1, max: 2, text: 'Badger', cr: 0, size: 'Small' },
                { min: 3, max: 4, text: 'Bear, Black', cr: 2, size: 'Medium' },
                { min: 5, max: 6, text: 'Bear, Brown', cr: 4, size: 'Large' },
                { min: 7, max: 8, text: 'Boar', cr: 2, size: 'Medium' },
                { min: 9, max: 10, text: 'Eagle', cr: 1, size: 'Small' },
                { min: 11, max: 12, text: 'Hawk', cr: 1/3, size: 'Tiny' },
                { min: 13, max: 14, text: 'Horse, Heavy', cr: 1, size: 'Large' },
                { min: 15, max: 16, text: 'Lion', cr: 3, size: 'Large' },
                { min: 17, max: 18, text: 'Owl', cr: 1/4, size: 'Tiny' },
                { min: 19, max: 20, text: 'Wolf', cr: 1, size: 'Medium' }
            ]
        };
    }

    // === HUMANOIDS TABLE ===
    createHumanoidsTable() {
        return {
            name: 'Humanoids',
            dice: '1d12',
            method: 'standard',
            entries: [
                { min: 1, max: 2, text: 'Commoner', cr: 1/2, class: 'Commoner' },
                { min: 3, max: 4, text: 'Warrior', cr: 1, class: 'Warrior' },
                { min: 5, max: 6, text: 'Adept', cr: 1, class: 'Adept' },
                { min: 7, max: 8, text: 'Expert', cr: 1, class: 'Expert' },
                { min: 9, max: 10, text: 'Aristocrat', cr: 1, class: 'Aristocrat' },
                { min: 11, max: 12, text: 'Guard', cr: 1, class: 'Warrior' }
            ]
        };
    }

    // === TREASURES TABLE ===
    createTreasuresTable() {
        return {
            name: 'Treasure Hoard',
            dice: '1d100',
            method: 'percentile',
            entries: [
                // Coins (1-60)
                { min: 1, max: 20, text: 'Copper pieces', dice: '4d6x10', type: 'coins', value: 'cp' },
                { min: 21, max: 40, text: 'Silver pieces', dice: '3d6x10', type: 'coins', value: 'sp' },
                { min: 41, max: 55, text: 'Gold pieces', dice: '2d6x10', type: 'coins', value: 'gp' },
                { min: 56, max: 60, text: 'Platinum pieces', dice: '1d4x5', type: 'coins', value: 'pp' },

                // Gems (61-75)
                { min: 61, max: 65, text: 'Semi-precious stones', dice: '1d4', type: 'gems', value: 10, subtable: 'gems' },
                { min: 66, max: 70, text: 'Fancy stones', dice: '1d3', type: 'gems', value: 50, subtable: 'gems' },
                { min: 71, max: 75, text: 'Precious stones', dice: '1d2', type: 'gems', value: 100, subtable: 'gems' },

                // Art Objects (76-85)
                { min: 76, max: 80, text: 'Decorative items', dice: '1d3', type: 'art', value: 25 },
                { min: 81, max: 85, text: 'Fine artwork', dice: '1d2', type: 'art', value: 250 },

                // Magic Items (86-100)
                { min: 86, max: 90, text: 'Potion', type: 'magic', subtable: 'magicItems' },
                { min: 91, max: 95, text: 'Scroll', type: 'magic', subtable: 'magicItems' },
                { min: 96, max: 98, text: 'Wand', type: 'magic', subtable: 'magicItems' },
                { min: 99, max: 100, text: 'Wondrous item', type: 'magic', subtable: 'magicItems' }
            ]
        };
    }

    // === MAGIC ITEMS TABLE ===
    createMagicItemsTable() {
        return {
            name: 'Magic Items',
            dice: '1d100',
            method: 'percentile',
            entries: [
                // Potions (1-30)
                { min: 1, max: 10, text: 'Potion of Cure Light Wounds', type: 'potion', casterLevel: 1 },
                { min: 11, max: 15, text: 'Potion of Bull\'s Strength', type: 'potion', casterLevel: 3 },
                { min: 16, max: 20, text: 'Potion of Cat\'s Grace', type: 'potion', casterLevel: 3 },
                { min: 21, max: 25, text: 'Potion of Eagle\'s Splendor', type: 'potion', casterLevel: 3 },
                { min: 26, max: 30, text: 'Potion of Invisibility', type: 'potion', casterLevel: 3 },

                // Scrolls (31-55)
                { min: 31, max: 35, text: 'Scroll of Magic Missile', type: 'scroll', spellLevel: 1 },
                { min: 36, max: 40, text: 'Scroll of Shield', type: 'scroll', spellLevel: 1 },
                { min: 41, max: 45, text: 'Scroll of Detect Magic', type: 'scroll', spellLevel: 0 },
                { min: 46, max: 50, text: 'Scroll of Cure Moderate Wounds', type: 'scroll', spellLevel: 2 },
                { min: 51, max: 55, text: 'Scroll of Web', type: 'scroll', spellLevel: 2 },

                // Weapons & Armor (56-80)
                { min: 56, max: 60, text: '+1 Longsword', type: 'weapon', enhancement: 1 },
                { min: 61, max: 65, text: '+1 Chain Mail', type: 'armor', enhancement: 1 },
                { min: 66, max: 70, text: '+1 Shield', type: 'shield', enhancement: 1 },
                { min: 71, max: 75, text: 'Masterwork Weapon', type: 'weapon', enhancement: 0 },
                { min: 76, max: 80, text: 'Masterwork Armor', type: 'armor', enhancement: 0 },

                // Wondrous Items (81-100)
                { min: 81, max: 85, text: 'Bag of Holding (Type I)', type: 'wondrous' },
                { min: 86, max: 90, text: 'Cloak of Resistance +1', type: 'wondrous' },
                { min: 91, max: 95, text: 'Boots of Elvenkind', type: 'wondrous' },
                { min: 96, max: 98, text: 'Ring of Protection +1', type: 'ring' },
                { min: 99, max: 100, text: 'Amulet of Natural Armor +1', type: 'wondrous' }
            ]
        };
    }

    // === GEMS TABLE ===
    createGemsTable() {
        return {
            name: 'Gems and Jewels',
            dice: '1d20',
            method: 'standard',
            entries: [
                { min: 1, max: 4, text: 'Agate', value: 10, type: 'semi-precious' },
                { min: 5, max: 8, text: 'Quartz', value: 10, type: 'semi-precious' },
                { min: 9, max: 12, text: 'Amethyst', value: 100, type: 'fancy' },
                { min: 13, max: 16, text: 'Garnet', value: 100, type: 'fancy' },
                { min: 17, max: 18, text: 'Ruby', value: 1000, type: 'precious' },
                { min: 19, max: 20, text: 'Diamond', value: 5000, type: 'precious' }
            ]
        };
    }

    // === MUNDANE ITEMS TABLE ===
    createMundaneItemsTable() {
        return {
            name: 'Mundane Items',
            dice: '1d100',
            method: 'percentile',
            entries: [
                // Tools & Equipment (1-40)
                { min: 1, max: 5, text: 'Rope, hemp (50 ft.)', value: 1, weight: 10 },
                { min: 6, max: 10, text: 'Torch', value: 0.01, weight: 1 },
                { min: 11, max: 15, text: 'Backpack', value: 2, weight: 2 },
                { min: 16, max: 20, text: 'Bedroll', value: 0.1, weight: 5 },
                { min: 21, max: 25, text: 'Blanket', value: 0.5, weight: 3 },
                { min: 26, max: 30, text: 'Candle', value: 0.01, weight: 0 },
                { min: 31, max: 35, text: 'Chain (10 ft.)', value: 30, weight: 20 },
                { min: 36, max: 40, text: 'Crowbar', value: 2, weight: 5 },

                // Clothing (41-60)
                { min: 41, max: 45, text: 'Cloak, common', value: 0.5, weight: 1 },
                { min: 46, max: 50, text: 'Clothes, common', value: 0.5, weight: 2 },
                { min: 51, max: 55, text: 'Clothes, noble\'s', value: 75, weight: 10 },
                { min: 56, max: 60, text: 'Hat', value: 0.1, weight: 0 },

                // Food & Drink (61-80)
                { min: 61, max: 65, text: 'Rations, trail (1 day)', value: 0.5, weight: 1 },
                { min: 66, max: 70, text: 'Waterskin', value: 1, weight: 4 },
                { min: 71, max: 75, text: 'Wine, common (pitcher)', value: 0.2, weight: 6 },
                { min: 76, max: 80, text: 'Ale, mug', value: 0.04, weight: 1 },

                // Miscellaneous (81-100)
                { min: 81, max: 85, text: 'Flint and steel', value: 1, weight: 0 },
                { min: 86, max: 90, text: 'Lantern, hooded', value: 7, weight: 2 },
                { min: 91, max: 95, text: 'Mirror, small steel', value: 10, weight: 0.5 },
                { min: 96, max: 100, text: 'Spyglass', value: 1000, weight: 1 }
            ]
        };
    }

    // === SETTLEMENTS TABLE ===
    createSettlementsTable() {
        return {
            name: 'Settlements',
            dice: '1d100',
            method: 'percentile',
            entries: [
                // Villages (1-40)
                { min: 1, max: 10, text: 'Thorp', size: 'thorp', population: '20-80', government: 'council' },
                { min: 11, max: 25, text: 'Hamlet', size: 'hamlet', population: '81-400', government: 'elder' },
                { min: 26, max: 40, text: 'Village', size: 'village', population: '401-900', government: 'mayor' },

                // Towns (41-70)
                { min: 41, max: 55, text: 'Small Town', size: 'small town', population: '901-2000', government: 'council' },
                { min: 56, max: 70, text: 'Large Town', size: 'large town', population: '2001-5000', government: 'mayor' },

                // Cities (71-95)
                { min: 71, max: 85, text: 'Small City', size: 'small city', population: '5001-12000', government: 'lord' },
                { min: 86, max: 95, text: 'Large City', size: 'large city', population: '12001-25000', government: 'council' },

                // Special (96-100)
                { min: 96, max: 98, text: 'Metropolis', size: 'metropolis', population: '25000+', government: 'overlord' },
                { min: 99, max: 100, text: 'Ruins', size: 'ruins', population: '0', government: 'none' }
            ]
        };
    }

    // === BUILDINGS TABLE ===
    createBuildingsTable() {
        return {
            name: 'Buildings',
            dice: '1d100',
            method: 'percentile',
            entries: [
                // Residential (1-30)
                { min: 1, max: 10, text: 'Hovel', type: 'residential', quality: 'poor' },
                { min: 11, max: 20, text: 'House, average', type: 'residential', quality: 'average' },
                { min: 21, max: 25, text: 'House, good', type: 'residential', quality: 'good' },
                { min: 26, max: 30, text: 'Manor house', type: 'residential', quality: 'excellent' },

                // Commercial (31-60)
                { min: 31, max: 35, text: 'Tavern', type: 'commercial', services: ['food', 'drink', 'lodging'] },
                { min: 36, max: 40, text: 'Inn', type: 'commercial', services: ['lodging', 'food', 'stables'] },
                { min: 41, max: 45, text: 'General Store', type: 'commercial', services: ['goods'] },
                { min: 46, max: 50, text: 'Blacksmith', type: 'commercial', services: ['weapons', 'armor', 'tools'] },
                { min: 51, max: 55, text: 'Alchemist', type: 'commercial', services: ['potions', 'components'] },
                { min: 56, max: 60, text: 'Temple', type: 'religious', services: ['healing', 'divination'] },

                // Special (61-100)
                { min: 61, max: 70, text: 'Warehouse', type: 'storage', contents: 'trade goods' },
                { min: 71, max: 80, text: 'Guard post', type: 'military', occupants: '2d4 guards' },
                { min: 81, max: 85, text: 'Wizard\'s tower', type: 'special', occupants: 'wizard' },
                { min: 86, max: 90, text: 'Noble\'s villa', type: 'residential', quality: 'luxury' },
                { min: 91, max: 95, text: 'Guildhall', type: 'special', services: ['training', 'information'] },
                { min: 96, max: 100, text: 'Ruins', type: 'abandoned', hazards: 'possible' }
            ]
        };
    }

    // === WEATHER TABLE ===
    createWeatherTable() {
        return {
            name: 'Weather',
            dice: '1d100',
            method: 'percentile',
            entries: [
                // Clear (1-70)
                { min: 1, max: 70, text: 'Clear', temperature: 'normal', wind: 'light', precipitation: 'none' },

                // Overcast (71-80)
                { min: 71, max: 80, text: 'Overcast', temperature: 'normal', wind: 'light', precipitation: 'none' },

                // Precipitation (81-95)
                { min: 81, max: 85, text: 'Fog', temperature: 'cool', wind: 'calm', visibility: 'limited' },
                { min: 86, max: 90, text: 'Rain', temperature: 'cool', wind: 'moderate', precipitation: 'rain' },
                { min: 91, max: 95, text: 'Storm', temperature: 'cool', wind: 'strong', precipitation: 'heavy rain' },

                // Extreme (96-100)
                { min: 96, max: 98, text: 'Blizzard', temperature: 'cold', wind: 'severe', precipitation: 'heavy snow' },
                { min: 99, max: 100, text: 'Hurricane', temperature: 'normal', wind: 'windstorm', precipitation: 'torrential' }
            ]
        };
    }

    // === TERRAIN TABLE ===
    createTerrainTable() {
        return {
            name: 'Terrain Features',
            dice: '1d20',
            method: 'standard',
            entries: [
                { min: 1, max: 3, text: 'Hills', movement: 'difficult', cover: 'partial' },
                { min: 4, max: 6, text: 'Forest', movement: 'difficult', cover: 'heavy', visibility: 'limited' },
                { min: 7, max: 9, text: 'Plains', movement: 'normal', cover: 'none', visibility: 'excellent' },
                { min: 10, max: 12, text: 'River', movement: 'special', hazards: 'drowning', width: '2d6x10 feet' },
                { min: 13, max: 15, text: 'Mountains', movement: 'difficult', cover: 'heavy', hazards: 'falling' },
                { min: 16, max: 17, text: 'Swamp', movement: 'difficult', hazards: 'disease', visibility: 'limited' },
                { min: 18, max: 19, text: 'Desert', movement: 'normal', hazards: 'heat', water: 'scarce' },
                { min: 20, max: 20, text: 'Chasm', movement: 'impassable', hazards: 'falling', depth: '2d6x10 feet' }
            ]
        };
    }

    // === DUNGEON ROOMS TABLE ===
    createDungeonRoomsTable() {
        return {
            name: 'Dungeon Rooms',
            dice: '1d100',
            method: 'percentile',
            entries: [
                // Empty Rooms (1-20)
                { min: 1, max: 12, text: 'Empty Room', contents: 'none', size: 'small' },
                { min: 13, max: 20, text: 'Empty Room', contents: 'none', size: 'medium' },

                // Monsters (21-60)
                { min: 21, max: 30, text: 'Monster', encounter: true, dice: '1d4', type: 'random' },
                { min: 31, max: 40, text: 'Monster with Treasure', encounter: true, treasure: true },
                { min: 41, max: 50, text: 'Undead', encounter: true, type: 'undead' },
                { min: 51, max: 60, text: 'Vermin Nest', encounter: true, type: 'vermin', number: '2d6' },

                // Special Rooms (61-85)
                { min: 61, max: 65, text: 'Armory', contents: 'weapons and armor', condition: 'varies' },
                { min: 66, max: 70, text: 'Library', contents: 'books and scrolls', knowledge: 'possible' },
                { min: 71, max: 75, text: 'Laboratory', contents: 'alchemical supplies', hazards: 'possible' },
                { min: 76, max: 80, text: 'Temple/Shrine', contents: 'religious items', blessing: 'possible' },
                { min: 81, max: 85, text: 'Tomb', contents: 'sarcophagus', undead: 'likely', treasure: 'possible' },

                // Hazards (86-95)
                { min: 86, max: 90, text: 'Trap', trap: true, type: 'mechanical' },
                { min: 91, max: 95, text: 'Magic Trap', trap: true, type: 'magical' },

                // Special (96-100)
                { min: 96, max: 98, text: 'Treasure Room', treasure: true, guardian: 'possible' },
                { min: 99, max: 100, text: 'Portal/Gate', type: 'magical transport', destination: 'unknown' }
            ]
        };
    }

    // === TRAPS TABLE ===
    createTrapsTable() {
        return {
            name: 'Traps',
            dice: '1d20',
            method: 'standard',
            entries: [
                { min: 1, max: 3, text: 'Pit Trap', damage: '1d6', save: 'Reflex DC 15', cr: 1 },
                { min: 4, max: 6, text: 'Spiked Pit', damage: '2d6', save: 'Reflex DC 20', cr: 2 },
                { min: 7, max: 9, text: 'Poison Needle', damage: 'poison', save: 'Reflex DC 17', cr: 2 },
                { min: 10, max: 12, text: 'Crossbow Bolt', damage: '1d8+1', save: 'Reflex DC 20', cr: 1 },
                { min: 13, max: 15, text: 'Crushing Wall', damage: '6d6', save: 'Reflex DC 25', cr: 5 },
                { min: 16, max: 17, text: 'Lightning Bolt', damage: '5d6', save: 'Reflex DC 16', cr: 3 },
                { min: 18, max: 19, text: 'Fireball', damage: '6d6', save: 'Reflex DC 16', cr: 4 },
                { min: 20, max: 20, text: 'Teleportation Circle', effect: 'teleport', save: 'Will DC 19', cr: 6 }
            ]
        };
    }

    // === ADVENTURE HOOKS TABLE ===
    createAdventureHooksTable() {
        return {
            name: 'Adventure Hooks',
            dice: '1d100',
            method: 'percentile',
            entries: [
                // Rescue Missions (1-20)
                { min: 1, max: 5, text: 'Missing person needs rescue from [ROLL:1d4] (1=bandits, 2=monsters, 3=cultists, 4=rival)', type: 'rescue' },
                { min: 6, max: 10, text: 'Kidnapped noble\'s child held for ransom in [TABLE:settlements]', type: 'rescue', reward: 'high' },
                { min: 11, max: 15, text: 'Merchant caravan overdue, last seen near [TABLE:terrain]', type: 'rescue' },
                { min: 16, max: 20, text: 'Village elder trapped in ancient ruins by magical ward', type: 'rescue' },

                // Investigation (21-40)
                { min: 21, max: 25, text: 'Mysterious murders plague [TABLE:settlements], suspect is [ROLL:1d6] (1-2=cultist, 3-4=monster, 5-6=possessed)', type: 'mystery' },
                { min: 26, max: 30, text: 'Ancient artifact stolen from museum/temple, thieves fled to [TABLE:dungeonRooms]', type: 'mystery' },
                { min: 31, max: 35, text: 'Strange lights seen in abandoned [TABLE:buildings], locals fear supernatural cause', type: 'mystery' },
                { min: 36, max: 40, text: 'Livestock disappearing near forest, tracks lead to unknown creature', type: 'mystery' },

                // Exploration (41-60)
                { min: 41, max: 45, text: 'Newly discovered dungeon entrance found after [TABLE:weather] revealed hidden door', type: 'exploration' },
                { min: 46, max: 50, text: 'Map to lost treasure vault discovered in old [TABLE:magicItems], authenticity unknown', type: 'exploration' },
                { min: 51, max: 55, text: 'Portal to unknown plane opens in [TABLE:terrain], magical energies attract monsters', type: 'exploration' },
                { min: 56, max: 60, text: 'Ancient tower appears overnight in [TABLE:settlements], locals fear magic', type: 'exploration' },

                // Protection (61-75)
                { min: 61, max: 65, text: 'Bandits threaten trade route, [TABLE:settlements] offers reward for clearing path', type: 'protection' },
                { min: 66, max: 70, text: 'Monster attacks threaten [TABLE:settlements], survivors report [TABLE:encounters]', type: 'protection' },
                { min: 71, max: 75, text: 'Cult plans ritual sacrifice during next full moon, must be stopped before completion', type: 'protection' },

                // Delivery (76-85)
                { min: 76, max: 80, text: 'Important message must reach [TABLE:settlements] before enemy forces arrive', type: 'delivery', urgent: true },
                { min: 81, max: 85, text: 'Sacred relic needs transport to distant temple through dangerous [TABLE:terrain]', type: 'delivery' },

                // Political (86-95)
                { min: 86, max: 90, text: 'Border dispute between [TABLE:settlements] and neighboring realm, mediation needed', type: 'diplomatic' },
                { min: 91, max: 95, text: 'Succession crisis in [TABLE:settlements] as rightful heir has disappeared', type: 'political' },

                // Epic (96-100)
                { min: 96, max: 98, text: 'Ancient evil stirs beneath [TABLE:settlements], only legendary [TABLE:magicItems] can stop it', type: 'epic' },
                { min: 99, max: 100, text: 'Planar convergence threatens reality itself, heroes must close rifts across multiple planes', type: 'epic' }
            ]
        };
    }

    // === NPC PERSONALITIES TABLE ===
    createNpcPersonalitiesTable() {
        return {
            name: 'NPC Personalities',
            dice: '1d100',
            method: 'percentile',
            entries: [
                // Positive Traits (1-40)
                { min: 1, max: 5, text: 'Brave and courageous', modifier: 'fearless' },
                { min: 6, max: 10, text: 'Honest and trustworthy', modifier: 'reliable' },
                { min: 11, max: 15, text: 'Wise and insightful', modifier: 'good advice' },
                { min: 16, max: 20, text: 'Cheerful and optimistic', modifier: 'morale boost' },
                { min: 21, max: 25, text: 'Generous and kind', modifier: 'helpful' },
                { min: 26, max: 30, text: 'Scholarly and knowledgeable', modifier: 'information' },
                { min: 31, max: 35, text: 'Patient and understanding', modifier: 'good listener' },
                { min: 36, max: 40, text: 'Loyal and devoted', modifier: 'steadfast ally' },

                // Neutral Traits (41-60)
                { min: 41, max: 45, text: 'Curious and inquisitive', modifier: 'asks questions' },
                { min: 46, max: 50, text: 'Cautious and careful', modifier: 'risk averse' },
                { min: 51, max: 55, text: 'Ambitious and driven', modifier: 'goal focused' },
                { min: 56, max: 60, text: 'Reserved and quiet', modifier: 'speaks little' },

                // Negative Traits (61-100)
                { min: 61, max: 65, text: 'Greedy and selfish', modifier: 'wants payment' },
                { min: 66, max: 70, text: 'Cowardly and fearful', modifier: 'flees danger' },
                { min: 71, max: 75, text: 'Arrogant and prideful', modifier: 'condescending' },
                { min: 76, max: 80, text: 'Suspicious and paranoid', modifier: 'trusts no one' },
                { min: 81, max: 85, text: 'Hot-tempered and rash', modifier: 'quick to anger' },
                { min: 86, max: 90, text: 'Lazy and unmotivated', modifier: 'avoids work' },
                { min: 91, max: 95, text: 'Dishonest and deceitful', modifier: 'lies frequently' },
                { min: 96, max: 100, text: 'Cruel and vindictive', modifier: 'seeks revenge' }
            ]
        };
    }

    // === MOTIVATIONS TABLE ===
    createMotivationsTable() {
        return {
            name: 'NPC Motivations',
            dice: '1d20',
            method: 'standard',
            entries: [
                { min: 1, max: 2, text: 'Seeking wealth and riches', type: 'material' },
                { min: 3, max: 4, text: 'Protecting family and loved ones', type: 'personal' },
                { min: 5, max: 6, text: 'Gaining power and influence', type: 'political' },
                { min: 7, max: 8, text: 'Pursuing knowledge and truth', type: 'intellectual' },
                { min: 9, max: 10, text: 'Seeking redemption for past sins', type: 'spiritual' },
                { min: 11, max: 12, text: 'Proving worth and capability', type: 'personal' },
                { min: 13, max: 14, text: 'Avenging a great wrong', type: 'emotional' },
                { min: 15, max: 16, text: 'Following religious calling', type: 'spiritual' },
                { min: 17, max: 18, text: 'Escaping a dark past', type: 'personal' },
                { min: 19, max: 20, text: 'Fulfilling ancient prophecy', type: 'mystical' }
            ]
        };
    }

    // === QUIRKS TABLE ===
    createQuirksTable() {
        return {
            name: 'NPC Quirks',
            dice: '1d100',
            method: 'percentile',
            entries: [
                // Physical Quirks (1-30)
                { min: 1, max: 5, text: 'Always adjusts clothing nervously', type: 'physical' },
                { min: 6, max: 10, text: 'Taps fingers when thinking', type: 'physical' },
                { min: 11, max: 15, text: 'Squints even in normal light', type: 'physical' },
                { min: 16, max: 20, text: 'Walks with unusual gait', type: 'physical' },
                { min: 21, max: 25, text: 'Constantly fidgets with objects', type: 'physical' },
                { min: 26, max: 30, text: 'Makes odd facial expressions', type: 'physical' },

                // Speech Quirks (31-60)
                { min: 31, max: 35, text: 'Speaks in rhymes when excited', type: 'speech' },
                { min: 36, max: 40, text: 'Uses elaborate metaphors', type: 'speech' },
                { min: 41, max: 45, text: 'Constantly quotes old sayings', type: 'speech' },
                { min: 46, max: 50, text: 'Repeats important words twice', type: 'speech' },
                { min: 51, max: 55, text: 'Whispers secrets loudly', type: 'speech' },
                { min: 56, max: 60, text: 'Changes topic mid-conversation', type: 'speech' },

                // Behavioral Quirks (61-90)
                { min: 61, max: 65, text: 'Collects unusual objects', type: 'behavioral' },
                { min: 66, max: 70, text: 'Always sits in same spot', type: 'behavioral' },
                { min: 71, max: 75, text: 'Suspicious of left-handed people', type: 'behavioral' },
                { min: 76, max: 80, text: 'Lucky charm never leaves side', type: 'behavioral' },
                { min: 81, max: 85, text: 'Counts things obsessively', type: 'behavioral' },
                { min: 86, max: 90, text: 'Refuses certain foods', type: 'behavioral' },

                // Unusual Quirks (91-100)
                { min: 91, max: 95, text: 'Claims to speak with animals', type: 'unusual' },
                { min: 96, max: 98, text: 'Believes in conspiracy theories', type: 'unusual' },
                { min: 99, max: 100, text: 'Thinks everyone is related to them', type: 'unusual' }
            ]
        };
    }

    // === Public API Methods ===
    getAvailableTables() {
        return Object.keys(this.tables);
    }

    getTableInfo(tableName) {
        if (!this.tables[tableName]) {
            return null;
        }

        const table = this.tables[tableName];
        return {
            name: table.name,
            dice: table.dice,
            method: table.method,
            entryCount: table.entries.length,
            description: table.description || 'No description available'
        };
    }

    generateMultiple(tableName, count = 1, parameters = {}) {
        const results = [];
        for (let i = 0; i < count; i++) {
            try {
                const result = this.generateFromTable(tableName, parameters);
                results.push(result);
            } catch (error) {
                console.error(`❌ Failed to generate result ${i + 1}:`, error);
            }
        }
        return results;
    }

    // === Quick Generation Methods ===
    generateName(race = null, gender = null) {
        const parameters = {};
        if (race) parameters.race = race;
        if (gender) parameters.gender = gender;

        const nameResult = this.generateFromTable('characterNames', parameters);
        const surnameResult = this.generateFromTable('surnames', parameters);

        return {
            fullName: `${nameResult.result.text} ${surnameResult.result.text}`,
            firstName: nameResult.result.text,
            surname: surnameResult.result.text,
            race: nameResult.result.race,
            gender: nameResult.result.gender
        };
    }

    generateEncounter(environment = null, partyLevel = 1) {
        const parameters = { environment, partyLevel };
        return this.generateFromTable('encounters', parameters);
    }

    generateTreasure(level = 1) {
        const parameters = { level };
        return this.generateFromTable('treasures', parameters);
    }

    generateSettlement(size = null) {
        const parameters = size ? { size } : {};
        return this.generateFromTable('settlements', parameters);
    }

    generateNPC() {
        const personality = this.generateFromTable('npcPersonalities');
        const motivation = this.generateFromTable('motivations');
        const quirk = this.generateFromTable('quirks');
        const name = this.generateName();

        return {
            name: name,
            personality: personality.result,
            motivation: motivation.result,
            quirk: quirk.result,
            generated: new Date()
        };
    }

    generateAdventure() {
        const hook = this.generateFromTable('adventureHooks');
        const location = this.generateFromTable('settlements');
        const weather = this.generateFromTable('weather');

        return {
            hook: hook.result,
            location: location.result,
            weather: weather.result,
            title: `The ${hook.result.text.split(' ')[0]} of ${location.result.text}`,
            generated: new Date()
        };
    }

    // === Statistics & Metadata ===
    getStatistics() {
        return {
            ...this.metadata,
            tables: Object.keys(this.tables).map(name => ({
                name,
                entries: this.tables[name].entries.length,
                method: this.tables[name].method
            }))
        };
    }
}

// === Export for different environments ===
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = RandomTablesEngine;
} else if (typeof window !== 'undefined') {
    // Browser environment
    window.RandomTablesEngine = RandomTablesEngine;
    
    // Initialize if dice engine is available
    if (window.diceEngine) {
        window.randomTablesEngine = new RandomTablesEngine(window.diceEngine);
        console.log('🎲 Global Random Tables Engine initialized');
    }
}

console.log('📚 Random Tables Engine module loaded');
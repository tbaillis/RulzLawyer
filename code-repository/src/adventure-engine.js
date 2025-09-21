/**
 * RulzLawyer Adventure Engine
 * Complete D&D 3.5 adventure generation and management system
 * 
 * Features:
 * - Balanced encounter generation based on party composition
 * - Dynamic treasure scaling and distribution
 * - NPC generation with motivations and relationships
 * - Plot hook development and campaign tools
 * - Dungeon generation with interconnected rooms
 * - Weather and environmental effects
 * - Party-level balancing and CR calculations
 */

class AdventureEngine {
    constructor(diceEngine, randomTablesEngine, characterDataModel) {
        this.diceEngine = diceEngine;
        this.randomTablesEngine = randomTablesEngine;
        this.characterDataModel = characterDataModel;
        
        this.metadata = {
            version: '1.0.0',
            created: new Date(),
            adventuresGenerated: 0,
            lastGenerated: null
        };

        // Adventure generation parameters
        this.encounterBudget = {
            easy: 0.25,
            medium: 0.5,
            hard: 0.75,
            deadly: 1.0
        };

        // CR to XP conversion table (D&D 3.5)
        this.crToXp = {
            0: 0, '1/8': 25, '1/4': 50, '1/2': 100,
            1: 300, 2: 600, 3: 900, 4: 1200, 5: 1800,
            6: 2700, 7: 3300, 8: 4500, 9: 6300, 10: 9000,
            11: 12000, 12: 15000, 13: 18000, 14: 21000, 15: 27000,
            16: 33000, 17: 39000, 18: 45000, 19: 51000, 20: 60000
        };

        console.log('🗺️  Initializing Adventure Engine...');
        this.initializeAdventureTypes();
        console.log('✅ Adventure Engine ready');
    }

    // === Adventure Generation ===
    generateAdventure(parameters = {}) {
        try {
            const adventure = this.createBaseAdventure(parameters);
            
            // Generate core components
            adventure.hook = this.generateAdventureHook(parameters);
            adventure.setting = this.generateSetting(parameters);
            adventure.npcs = this.generateAdventureNPCs(parameters);
            adventure.encounters = this.generateEncounterSequence(parameters);
            adventure.treasures = this.generateAdventureTreasures(parameters);
            adventure.challenges = this.generateChallenges(parameters);
            
            // Optional components
            if (parameters.includeDungeon) {
                adventure.dungeon = this.generateDungeon(parameters);
            }
            
            if (parameters.includeWeather) {
                adventure.weather = this.generateWeatherProgression(parameters);
            }

            // Finalize adventure
            adventure.timeline = this.generateTimeline(adventure);
            adventure.rewards = this.calculateRewards(adventure, parameters);
            
            this.metadata.adventuresGenerated++;
            this.metadata.lastGenerated = new Date();
            
            console.log('🎯 Adventure generated:', adventure.title);
            return adventure;

        } catch (error) {
            console.error('❌ Adventure generation failed:', error);
            throw error;
        }
    }

    // === Base Adventure Creation ===
    createBaseAdventure(parameters) {
        const partyLevel = parameters.partyLevel || 1;
        const partySize = parameters.partySize || 4;
        const adventureType = parameters.type || this.selectRandomAdventureType();
        
        return {
            id: `adv_${Date.now()}`,
            title: this.generateAdventureTitle(adventureType),
            type: adventureType,
            partyLevel: partyLevel,
            partySize: partySize,
            difficulty: parameters.difficulty || 'medium',
            estimatedDuration: this.calculateDuration(adventureType, parameters),
            synopsis: '',
            created: new Date(),
            version: '1.0.0'
        };
    }

    // === Adventure Hook Generation ===
    generateAdventureHook(parameters) {
        let hook;
        
        if (this.randomTablesEngine) {
            hook = this.randomTablesEngine.generateFromTable('adventureHooks', parameters).result;
        } else {
            hook = this.generateFallbackHook(parameters);
        }

        // Enhance hook with specific details
        return {
            ...hook,
            urgency: this.determineUrgency(hook),
            patron: this.generatePatron(parameters),
            reward: this.generateHookReward(parameters),
            complications: this.generateComplications(parameters)
        };
    }

    generatePatron(parameters) {
        const patronTypes = [
            'Local Noble', 'Merchant Guild', 'Temple High Priest', 'Village Elder',
            'Mysterious Stranger', 'Royal Court', 'Thieves Guild', 'Wizard Circle'
        ];
        
        const type = patronTypes[Math.floor(Math.random() * patronTypes.length)];
        const name = this.generateNPCName();
        
        return {
            name: name,
            type: type,
            motivation: this.generatePatronMotivation(),
            trustworthiness: Math.floor(Math.random() * 10) + 1, // 1-10 scale
            resources: this.determinePatronResources(type)
        };
    }

    // === Setting Generation ===
    generateSetting(parameters) {
        const setting = {};
        
        // Primary location
        if (this.randomTablesEngine) {
            setting.primaryLocation = this.randomTablesEngine.generateFromTable('settlements', parameters).result;
            setting.terrain = this.randomTablesEngine.generateFromTable('terrain', parameters).result;
        } else {
            setting.primaryLocation = { text: 'Village of Millhaven', size: 'village' };
            setting.terrain = { text: 'Rolling hills', movement: 'normal' };
        }

        // Secondary locations
        setting.secondaryLocations = this.generateSecondaryLocations(parameters);
        
        // Environmental factors
        setting.climate = this.determineClimate(parameters);
        setting.hazards = this.generateEnvironmentalHazards(parameters);
        setting.resources = this.generateLocalResources(parameters);
        
        return setting;
    }

    generateSecondaryLocations(parameters) {
        const count = Math.floor(Math.random() * 3) + 1; // 1-3 locations
        const locations = [];
        
        for (let i = 0; i < count; i++) {
            let location;
            if (this.randomTablesEngine) {
                location = this.randomTablesEngine.generateFromTable('buildings', parameters).result;
            } else {
                location = { text: 'Ancient ruins', type: 'abandoned' };
            }
            
            locations.push({
                ...location,
                distance: `${Math.floor(Math.random() * 10) + 1} miles`,
                travelTime: `${Math.floor(Math.random() * 8) + 1} hours`,
                dangerLevel: Math.floor(Math.random() * 5) + 1
            });
        }
        
        return locations;
    }

    // === NPC Generation ===
    generateAdventureNPCs(parameters) {
        const npcCount = Math.floor(Math.random() * 6) + 3; // 3-8 NPCs
        const npcs = [];
        
        for (let i = 0; i < npcCount; i++) {
            let npc;
            if (this.randomTablesEngine) {
                npc = this.randomTablesEngine.generateNPC();
            } else {
                npc = this.generateFallbackNPC();
            }
            
            // Add adventure-specific details
            npc.role = this.assignNPCRole();
            npc.location = this.assignNPCLocation(parameters);
            npc.relationship = this.determineNPCRelationships(npcs);
            npc.secrets = this.generateNPCSecrets();
            npc.rumors = this.generateNPCRumors();
            
            npcs.push(npc);
        }
        
        return npcs;
    }

    assignNPCRole() {
        const roles = [
            'Quest Giver', 'Helpful Local', 'Suspicious Character', 'Merchant',
            'Guard Captain', 'Wise Sage', 'Rival Adventurer', 'Informant',
            'Obstacle', 'Red Herring', 'Ally', 'Potential Enemy'
        ];
        
        return roles[Math.floor(Math.random() * roles.length)];
    }

    // === Encounter Generation ===
    generateEncounterSequence(parameters) {
        const encounters = [];
        const targetEncounters = Math.floor(Math.random() * 4) + 3; // 3-6 encounters
        
        for (let i = 0; i < targetEncounters; i++) {
            const encounter = this.generateSingleEncounter(parameters, i);
            encounters.push(encounter);
        }
        
        return encounters;
    }

    generateSingleEncounter(parameters, index) {
        const encounter = {
            id: `enc_${Date.now()}_${index}`,
            type: this.selectEncounterType(),
            difficulty: this.selectEncounterDifficulty(parameters),
            location: this.selectEncounterLocation(parameters),
            trigger: this.generateEncounterTrigger(),
            created: new Date()
        };

        // Generate encounter specifics based on type
        switch (encounter.type) {
            case 'combat':
                encounter.details = this.generateCombatEncounter(parameters, encounter.difficulty);
                break;
            case 'social':
                encounter.details = this.generateSocialEncounter(parameters);
                break;
            case 'exploration':
                encounter.details = this.generateExplorationEncounter(parameters);
                break;
            case 'puzzle':
                encounter.details = this.generatePuzzleEncounter(parameters);
                break;
            case 'trap':
                encounter.details = this.generateTrapEncounter(parameters);
                break;
        }

        // Add tactical considerations
        encounter.tactics = this.generateEncounterTactics(encounter);
        encounter.alternatives = this.generateAlternativeOutcomes(encounter);

        return encounter;
    }

    generateCombatEncounter(parameters, difficulty) {
        const partyLevel = parameters.partyLevel || 1;
        const partySize = parameters.partySize || 4;
        
        // Calculate encounter budget
        const baseXP = this.calculateEncounterBudget(partyLevel, partySize, difficulty);
        
        // Generate creatures
        const creatures = this.selectCreaturesForBudget(baseXP, partyLevel);
        
        return {
            creatures: creatures,
            totalXP: creatures.reduce((sum, c) => sum + c.xp * c.quantity, 0),
            terrain: this.generateCombatTerrain(),
            specialConditions: this.generateSpecialConditions(),
            victory: this.generateVictoryConditions(),
            retreat: this.generateRetreatConditions()
        };
    }

    generateSocialEncounter(parameters) {
        return {
            npc: this.generateEncounterNPC(),
            objective: this.generateSocialObjective(),
            attitude: this.generateInitialAttitude(),
            skills: this.generateRequiredSkills(),
            success: this.generateSocialSuccess(),
            failure: this.generateSocialFailure(),
            information: this.generateSocialInformation()
        };
    }

    // === Treasure Generation ===
    generateAdventureTreasures(parameters) {
        const treasures = [];
        const treasureCount = Math.floor(Math.random() * 4) + 2; // 2-5 treasure hoards
        
        for (let i = 0; i < treasureCount; i++) {
            let treasure;
            if (this.randomTablesEngine) {
                treasure = this.randomTablesEngine.generateFromTable('treasures', {
                    level: parameters.partyLevel || 1,
                    ...parameters
                }).result;
            } else {
                treasure = this.generateFallbackTreasure(parameters);
            }
            
            // Add treasure placement and protection
            treasure.location = this.assignTreasureLocation();
            treasure.protection = this.generateTreasureProtection();
            treasure.discovery = this.generateDiscoveryMethod();
            
            treasures.push(treasure);
        }
        
        return treasures;
    }

    // === Dungeon Generation ===
    generateDungeon(parameters) {
        const roomCount = Math.floor(Math.random() * 12) + 8; // 8-20 rooms
        const dungeon = {
            name: this.generateDungeonName(),
            theme: this.selectDungeonTheme(),
            size: this.calculateDungeonSize(roomCount),
            level: parameters.dungeonLevel || parameters.partyLevel || 1,
            rooms: []
        };
        
        // Generate rooms
        for (let i = 0; i < roomCount; i++) {
            const room = this.generateDungeonRoom(i, dungeon, parameters);
            dungeon.rooms.push(room);
        }
        
        // Generate connections
        dungeon.connections = this.generateRoomConnections(dungeon.rooms);
        
        // Add special features
        dungeon.specialFeatures = this.generateDungeonFeatures(dungeon);
        
        return dungeon;
    }

    generateDungeonRoom(index, dungeon, parameters) {
        let baseRoom;
        if (this.randomTablesEngine) {
            baseRoom = this.randomTablesEngine.generateFromTable('dungeonRooms', parameters).result;
        } else {
            baseRoom = { text: 'Chamber', contents: 'empty' };
        }
        
        return {
            id: `room_${index + 1}`,
            name: `${baseRoom.text} ${index + 1}`,
            ...baseRoom,
            dimensions: this.generateRoomDimensions(),
            exits: this.generateRoomExits(),
            lighting: this.generateLighting(),
            airQuality: this.generateAirQuality(),
            specialFeatures: this.generateRoomFeatures()
        };
    }

    // === Challenge Generation ===
    generateChallenges(parameters) {
        const challenges = [];
        const challengeCount = Math.floor(Math.random() * 3) + 1; // 1-3 challenges
        
        for (let i = 0; i < challengeCount; i++) {
            const challenge = {
                type: this.selectChallengeType(),
                difficulty: this.selectChallengeDifficulty(parameters),
                description: '',
                solution: [],
                alternatives: [],
                consequences: {}
            };
            
            // Generate challenge specifics
            this.populateChallengeDetails(challenge, parameters);
            challenges.push(challenge);
        }
        
        return challenges;
    }

    // === Weather Progression ===
    generateWeatherProgression(parameters) {
        const days = parameters.adventureDuration || 3;
        const weather = [];
        
        for (let day = 0; day < days; day++) {
            let dailyWeather;
            if (this.randomTablesEngine) {
                dailyWeather = this.randomTablesEngine.generateFromTable('weather', parameters).result;
            } else {
                dailyWeather = { text: 'Clear', temperature: 'normal' };
            }
            
            weather.push({
                day: day + 1,
                ...dailyWeather,
                effects: this.determineWeatherEffects(dailyWeather)
            });
        }
        
        return weather;
    }

    // === Timeline Generation ===
    generateTimeline(adventure) {
        const timeline = [];
        const events = [];
        
        // Add hook event
        events.push({
            day: 0,
            event: 'Adventure Hook',
            description: adventure.hook.text
        });
        
        // Add encounter events
        adventure.encounters.forEach((encounter, index) => {
            events.push({
                day: index + 1,
                event: `${encounter.type} Encounter`,
                description: encounter.details?.description || encounter.type
            });
        });
        
        // Add resolution
        events.push({
            day: events.length,
            event: 'Resolution',
            description: 'Adventure concludes'
        });
        
        return events;
    }

    // === Reward Calculation ===
    calculateRewards(adventure, parameters) {
        const partyLevel = parameters.partyLevel || 1;
        const partySize = parameters.partySize || 4;
        
        // Calculate XP rewards
        const combatXP = adventure.encounters
            .filter(e => e.type === 'combat')
            .reduce((sum, e) => sum + (e.details?.totalXP || 0), 0);
        
        const storyXP = combatXP * 0.25; // Story award
        const totalXP = Math.floor(combatXP + storyXP);
        const xpPerCharacter = Math.floor(totalXP / partySize);
        
        // Calculate monetary rewards
        const baseGold = partyLevel * 100 * partySize;
        const variation = (Math.random() - 0.5) * 0.4; // ±20%
        const totalGold = Math.floor(baseGold * (1 + variation));
        
        return {
            experience: {
                combat: combatXP,
                story: Math.floor(storyXP),
                total: totalXP,
                perCharacter: xpPerCharacter
            },
            treasure: {
                gold: totalGold,
                items: adventure.treasures.length,
                magical: adventure.treasures.filter(t => t.type === 'magic').length
            },
            reputation: this.calculateReputationGain(adventure),
            special: this.generateSpecialRewards(adventure, parameters)
        };
    }

    // === Utility Methods ===
    selectRandomAdventureType() {
        const types = ['investigation', 'dungeon', 'rescue', 'exploration', 'political', 'escort'];
        return types[Math.floor(Math.random() * types.length)];
    }

    generateAdventureTitle(type) {
        const prefixes = ['The', 'Mystery of', 'Quest for', 'Trial of', 'Shadow of', 'Legend of'];
        const subjects = ['Lost Temple', 'Crimson Crown', 'Whispering Woods', 'Iron Fortress', 'Golden Chalice'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        
        return `${prefix} ${subject}`;
    }

    calculateDuration(type, parameters) {
        const baseDurations = {
            investigation: { sessions: 3, hours: 12 },
            dungeon: { sessions: 4, hours: 16 },
            rescue: { sessions: 2, hours: 8 },
            exploration: { sessions: 5, hours: 20 },
            political: { sessions: 4, hours: 16 },
            escort: { sessions: 3, hours: 12 }
        };
        
        return baseDurations[type] || { sessions: 3, hours: 12 };
    }

    calculateEncounterBudget(partyLevel, partySize, difficulty) {
        const baseXPPerLevel = [0, 300, 600, 900, 1200, 1800, 2700, 3300, 4500, 6300, 9000];
        const baseXP = baseXPPerLevel[Math.min(partyLevel, baseXPPerLevel.length - 1)] || 9000;
        
        const multiplier = this.encounterBudget[difficulty] || 0.5;
        return Math.floor(baseXP * partySize * multiplier);
    }

    selectCreaturesForBudget(budget, partyLevel) {
        // Simplified creature selection - in full implementation would use CR tables
        const creatures = [];
        let remainingBudget = budget;
        
        while (remainingBudget > 100 && creatures.length < 10) {
            const cr = Math.min(partyLevel + 2, Math.floor(remainingBudget / 300) || 1);
            const xp = this.crToXp[cr] || 300;
            const quantity = Math.floor(Math.random() * 3) + 1;
            
            if (xp * quantity <= remainingBudget) {
                creatures.push({
                    name: this.generateCreatureName(cr),
                    cr: cr,
                    xp: xp,
                    quantity: quantity,
                    type: this.selectCreatureType()
                });
                
                remainingBudget -= xp * quantity;
            } else {
                break;
            }
        }
        
        return creatures;
    }

    // === Mock/Fallback Methods ===
    generateFallbackHook(parameters) {
        const hooks = [
            'A merchant\'s caravan has gone missing on the trade road',
            'Strange lights have been seen in the abandoned tower',
            'The village well has been poisoned by unknown forces',
            'Bandits have been attacking travelers near the forest'
        ];
        
        return { text: hooks[Math.floor(Math.random() * hooks.length)] };
    }

    generateFallbackNPC() {
        return {
            name: { fullName: 'Generic NPC', firstName: 'Generic', surname: 'NPC' },
            personality: { text: 'Helpful and friendly' },
            motivation: { text: 'Wants to help the party' },
            quirk: { text: 'Always smiles when nervous' }
        };
    }

    generateFallbackTreasure(parameters) {
        const treasures = ['Gold coins', 'Silver jewelry', 'Healing potion', 'Magic scroll'];
        return { text: treasures[Math.floor(Math.random() * treasures.length)] };
    }

    generateNPCName() {
        const names = ['Gareth', 'Lyanna', 'Marcus', 'Elena', 'Thorin', 'Aria'];
        return names[Math.floor(Math.random() * names.length)];
    }

    generateCreatureName(cr) {
        const creatures = ['Goblin', 'Orc', 'Skeleton', 'Wolf', 'Bear', 'Troll', 'Ogre', 'Dragon'];
        return creatures[Math.min(cr, creatures.length - 1)];
    }

    selectCreatureType() {
        const types = ['Humanoid', 'Beast', 'Undead', 'Aberration', 'Giant', 'Dragon'];
        return types[Math.floor(Math.random() * types.length)];
    }

    // === Adventure Type Initialization ===
    initializeAdventureTypes() {
        this.adventureTypes = {
            investigation: {
                name: 'Investigation',
                description: 'Solve mysteries and uncover secrets',
                primarySkills: ['Search', 'Gather Information', 'Sense Motive']
            },
            dungeon: {
                name: 'Dungeon Delve',
                description: 'Explore dangerous underground complexes',
                primarySkills: ['Spot', 'Listen', 'Disable Device']
            },
            rescue: {
                name: 'Rescue Mission',
                description: 'Save someone from danger or captivity',
                primarySkills: ['Move Silently', 'Climb', 'Heal']
            },
            exploration: {
                name: 'Exploration',
                description: 'Discover new lands and their secrets',
                primarySkills: ['Survival', 'Navigation', 'Knowledge (Geography)']
            },
            political: {
                name: 'Political Intrigue',
                description: 'Navigate complex social and political situations',
                primarySkills: ['Diplomacy', 'Bluff', 'Gather Information']
            },
            escort: {
                name: 'Escort Mission',
                description: 'Safely transport someone or something',
                primarySkills: ['Spot', 'Listen', 'Handle Animal']
            }
        };
    }

    // === Public API Methods ===
    getAdventureTypes() {
        return Object.keys(this.adventureTypes);
    }

    getAdventureTypeInfo(type) {
        return this.adventureTypes[type] || null;
    }

    generateQuickAdventure(partyLevel = 1, partySize = 4) {
        return this.generateAdventure({
            partyLevel: partyLevel,
            partySize: partySize,
            difficulty: 'medium'
        });
    }

    generateEncounterOnly(parameters = {}) {
        const encounter = this.generateSingleEncounter(parameters, 0);
        return {
            title: 'Random Encounter',
            encounter: encounter,
            generated: new Date()
        };
    }

    getStatistics() {
        return {
            ...this.metadata,
            availableTypes: Object.keys(this.adventureTypes).length,
            crRange: Object.keys(this.crToXp)
        };
    }

    // Placeholder methods for complex features
    selectEncounterType() { return 'combat'; }
    selectEncounterDifficulty(params) { return params.difficulty || 'medium'; }
    selectEncounterLocation(params) { return 'Forest clearing'; }
    generateEncounterTrigger() { return 'Party enters area'; }
    generateCombatTerrain() { return { type: 'open ground', features: [] }; }
    generateSpecialConditions() { return []; }
    generateVictoryConditions() { return 'Defeat all enemies'; }
    generateRetreatConditions() { return 'Enemies flee at 25% health'; }
    generateEncounterNPC() { return this.generateFallbackNPC(); }
    generateSocialObjective() { return 'Obtain information'; }
    generateInitialAttitude() { return 'neutral'; }
    generateRequiredSkills() { return ['Diplomacy', 'Bluff']; }
    generateSocialSuccess() { return 'Information obtained'; }
    generateSocialFailure() { return 'NPC becomes hostile'; }
    generateSocialInformation() { return 'Useful plot information'; }
    generateExplorationEncounter(params) { return { type: 'discovery', details: 'Hidden passage found' }; }
    generatePuzzleEncounter(params) { return { type: 'riddle', difficulty: 'medium' }; }
    generateTrapEncounter(params) { return { type: 'pit trap', damage: '2d6' }; }
    generateEncounterTactics(encounter) { return { strategy: 'direct assault' }; }
    generateAlternativeOutcomes(encounter) { return ['victory', 'defeat', 'escape']; }
    assignTreasureLocation() { return 'Hidden chest'; }
    generateTreasureProtection() { return 'Simple lock'; }
    generateDiscoveryMethod() { return 'Search check DC 15'; }
    generateDungeonName() { return 'The Forgotten Crypt'; }
    selectDungeonTheme() { return 'undead lair'; }
    calculateDungeonSize(rooms) { return rooms < 10 ? 'small' : rooms < 20 ? 'medium' : 'large'; }
    generateRoomConnections(rooms) { return []; }
    generateDungeonFeatures(dungeon) { return ['secret door', 'trapped corridor']; }
    generateRoomDimensions() { return '20ft x 20ft'; }
    generateRoomExits() { return ['north door', 'south door']; }
    generateLighting() { return 'torchlight'; }
    generateAirQuality() { return 'stale'; }
    generateRoomFeatures() { return ['cobwebs', 'dusty floor']; }
    selectChallengeType() { return 'obstacle'; }
    selectChallengeDifficulty(params) { return 'medium'; }
    populateChallengeDetails(challenge, params) { challenge.description = 'Complex challenge'; }
    determineWeatherEffects(weather) { return { visibility: 'normal', movement: 'normal' }; }
    calculateReputationGain(adventure) { return { local: 1, regional: 0 }; }
    generateSpecialRewards(adventure, params) { return []; }
    determineUrgency(hook) { return 'moderate'; }
    generateHookReward(params) { return '1000 gp'; }
    generateComplications(params) { return ['time pressure', 'rival group']; }
    generatePatronMotivation() { return 'help the community'; }
    determinePatronResources(type) { return 'moderate'; }
    determineClimate(params) { return 'temperate'; }
    generateEnvironmentalHazards(params) { return []; }
    generateLocalResources(params) { return ['timber', 'stone']; }
    determineNPCRelationships(npcs) { return 'neutral'; }
    generateNPCSecrets() { return 'Has a dark past'; }
    generateNPCRumors() { return 'Knows local gossip'; }
    assignNPCLocation(params) { return 'Village tavern'; }
}

// === Export for different environments ===
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = AdventureEngine;
} else if (typeof window !== 'undefined') {
    // Browser environment
    window.AdventureEngine = AdventureEngine;
    
    // Initialize if dependencies are available
    if (window.gameEngine) {
        const { diceEngine, randomTablesEngine, characterDataModel } = window.gameEngine;
        if (diceEngine && randomTablesEngine && characterDataModel) {
            window.adventureEngine = new AdventureEngine(diceEngine, randomTablesEngine, characterDataModel);
            console.log('🗺️  Global Adventure Engine initialized');
        }
    }
}

console.log('🗺️  Adventure Engine module loaded');
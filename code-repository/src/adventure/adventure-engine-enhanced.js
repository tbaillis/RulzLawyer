/**
 * AdventureEngine - AI-Powered D&D 3.5 Adventure Generation System
 * 
 * Features:
 * - Dynamic encounter generation with appropriate challenge ratings
 * - Environmental adventure types (wilderness, dungeon, urban, planar)
 * - Narrative generation with character integration
 * - Treasure and reward distribution
 * - Experience point calculation and character advancement
 * - Adventure state persistence and save/load functionality
 * - AI-powered story generation and plot hooks
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class AdventureEngine {
    constructor(diceEngine, characterManager, dataManager) {
        this.diceEngine = diceEngine;
        this.characterManager = characterManager;
        this.dataManager = dataManager;
        
        // Adventure state
        this.currentAdventure = null;
        this.activeEncounters = [];
        this.adventureHistory = [];
        this.worldState = {};
        
        // Configuration
        this.difficultySettings = {
            easy: 0.75,
            normal: 1.0,
            hard: 1.25,
            extreme: 1.5
        };
        
        // Adventure templates
        this.adventureTemplates = [
            'goblin_raid', 'ancient_tomb', 'city_investigation', 'wilderness_survival',
            'planar_intrusion', 'dragon_encounter', 'cultist_conspiracy', 'haunted_mansion',
            'bandit_stronghold', 'missing_caravan', 'corrupted_grove', 'underground_cult',
            'noble_intrigue', 'demon_summoning', 'lost_expedition', 'mysterious_plague'
        ];
        
        // Environment types
        this.environments = [
            'forest', 'mountain', 'desert', 'swamp', 'urban', 'dungeon', 
            'cave', 'ruins', 'plane', 'underwater', 'arctic', 'volcanic'
        ];
        
        // Load encounter tables and AI patterns
        this.loadEncounterTables();
        this.initializeAINarratives();
        
        console.log('🗺️ Adventure Engine initialized');
    }

    /**
     * Initialize AI narrative patterns and story templates
     */
    initializeAINarratives() {
        this.narrativePatterns = {
            openings: [
                "The party finds themselves at the edge of {environment}, where rumors speak of {threat}...",
                "A desperate {npc} approaches the party with tales of {mystery} in the {location}...",
                "Ancient whispers echo through {environment}, telling of {treasure} guarded by {danger}...",
                "The road to {destination} has become treacherous due to {complication}...",
                "A {weather} night brings unexpected {encounter} to the party's camp..."
            ],
            complications: [
                "the local authorities have placed a bounty on {target}",
                "a rival adventuring party seeks the same {objective}",
                "the area is cursed by ancient {magic}",
                "political tensions make travel dangerous",
                "natural disasters have altered the landscape"
            ],
            climaxes: [
                "The party must confront {bigBad} in their {stronghold}",
                "A race against time to prevent {catastrophe}",
                "The truth behind {mystery} is more dangerous than expected",
                "Ancient powers stir, threatening {consequence}",
                "The party's actions have attracted unwanted {attention}"
            ]
        };

        this.plotHooks = {
            'goblin_raid': [
                "Goblins have been attacking merchant caravans on the main trade road",
                "A goblin shaman has united the local tribes under a dark banner",
                "Stolen livestock points to a goblin stronghold in the nearby hills"
            ],
            'ancient_tomb': [
                "Archaeologists have discovered an entrance to a long-lost tomb",
                "Undead have been spotted near ancient burial grounds",
                "A map recovered from bandits shows the location of a pharaoh's treasure"
            ],
            'city_investigation': [
                "A series of mysterious disappearances plague the merchant district",
                "The city guard requests help investigating strange cult activities",
                "A noble family's dark secret threatens the stability of the realm"
            ]
        };
    }

    /**
     * Load comprehensive encounter tables
     */
    loadEncounterTables() {
        this.encounterTables = {
            wilderness: {
                combat: [
                    { name: 'Wolf Pack', cr: 1, count: '2d4', tactics: 'Pack hunting, flank weak targets' },
                    { name: 'Brown Bear', cr: 4, count: 1, tactics: 'Charge and grapple, defend cubs' },
                    { name: 'Bandit Group', cr: 2, count: '1d6+2', tactics: 'Ambush from concealment, demand surrender' },
                    { name: 'Goblin Patrol', cr: 1, count: '2d6', tactics: 'Hit and run, use terrain advantage' },
                    { name: 'Owlbear', cr: 5, count: 1, tactics: 'Charge with claws, territorial defense' },
                    { name: 'Dire Wolf', cr: 3, count: '1d2', tactics: 'Trip attacks, coordinated hunting' }
                ],
                social: [
                    { name: 'Traveling Merchant', reaction: 'friendly', opportunity: 'Trade goods, information' },
                    { name: 'Lost Traveler', reaction: 'neutral', opportunity: 'Directions, local knowledge' },
                    { name: 'Hermit Druid', reaction: 'cautious', opportunity: 'Natural lore, healing' },
                    { name: 'Ranger Patrol', reaction: 'professional', opportunity: 'Law enforcement, tracking' }
                ],
                exploration: [
                    { name: 'Ancient Ruins', discovery: 'Historical artifacts, hidden passages' },
                    { name: 'Natural Cave', discovery: 'Shelter, mineral deposits, cave paintings' },
                    { name: 'Overgrown Trail', discovery: 'Shortcut, abandoned campsite' },
                    { name: 'Sacred Grove', discovery: 'Druidic circle, magical plants' }
                ]
            },
            dungeon: {
                combat: [
                    { name: 'Skeleton Warriors', cr: 1, count: '2d4', tactics: 'Formation fighting, undead immunities' },
                    { name: 'Zombie Horde', cr: 1, count: '3d4', tactics: 'Overwhelming numbers, grapple attacks' },
                    { name: 'Orc Guards', cr: 2, count: '1d4+1', tactics: 'Shield wall, crossbow support' },
                    { name: 'Giant Rats', cr: 1, count: '4d4', tactics: 'Swarm tactics, disease transmission' },
                    { name: 'Gelatinous Cube', cr: 3, count: 1, tactics: 'Engulf, acid damage' },
                    { name: 'Minotaur', cr: 4, count: 1, tactics: 'Charge attacks, maze knowledge' }
                ],
                traps: [
                    { name: 'Pit Trap', cr: 1, damage: '1d6', detection: 'DC 15 Search' },
                    { name: 'Poison Dart', cr: 2, damage: '1d4+poison', detection: 'DC 18 Search' },
                    { name: 'Crushing Wall', cr: 3, damage: '2d6', detection: 'DC 20 Search' },
                    { name: 'Fire Trap', cr: 2, damage: '1d6 fire', detection: 'DC 16 Search' }
                ],
                puzzles: [
                    { name: 'Symbol Lock', difficulty: 'Medium', hint: 'Ancient symbols tell a story' },
                    { name: 'Riddle Door', difficulty: 'Hard', hint: 'Speak friend and enter' },
                    { name: 'Weight Puzzle', difficulty: 'Easy', hint: 'Balance the scales of justice' }
                ]
            },
            urban: {
                combat: [
                    { name: 'Thieves Guild', cr: 2, count: '1d4+1', tactics: 'Sneak attacks, escape routes' },
                    { name: 'City Watch', cr: 1, count: '2d4', tactics: 'Formation, non-lethal capture' },
                    { name: 'Tavern Brawlers', cr: 1, count: '2d6', tactics: 'Improvised weapons, chaos' },
                    { name: 'Assassins', cr: 4, count: '1d2', tactics: 'Poison, stealth kills' }
                ],
                social: [
                    { name: 'Noble Patron', reaction: 'interested', opportunity: 'Quests, political favor' },
                    { name: 'Information Broker', reaction: 'mercenary', opportunity: 'Intelligence, contacts' },
                    { name: 'Merchant Prince', reaction: 'calculating', opportunity: 'Trade deals, resources' },
                    { name: 'Temple Priest', reaction: 'helpful', opportunity: 'Healing, divine knowledge' }
                ],
                intrigue: [
                    { name: 'Political Conspiracy', complexity: 'High', stakes: 'Kingdom stability' },
                    { name: 'Merchant Rivalry', complexity: 'Medium', stakes: 'Economic control' },
                    { name: 'Religious Schism', complexity: 'High', stakes: 'Spiritual authority' }
                ]
            }
        };
    }

    // ===== ADVENTURE GENERATION =====

    /**
     * Generate a complete adventure
     */
    generateAdventure(partyLevel, adventureType = null, environment = null, difficulty = 'normal') {
        console.log(`🎭 Generating adventure for level ${partyLevel} party...`);
        
        const template = adventureType || this.selectRandomTemplate();
        const env = environment || this.selectRandomEnvironment();
        
        const adventure = {
            id: this.generateAdventureId(),
            title: this.generateAdventureTitle(template, env),
            description: this.generateAdventureDescription(template, env),
            type: template,
            environment: env,
            partyLevel: partyLevel,
            difficulty: difficulty,
            challengeRating: this.calculateAdventureCR(partyLevel, difficulty),
            encounters: this.generateEncounters(partyLevel, template, env, difficulty),
            rewards: this.generateRewards(partyLevel, difficulty),
            objectives: this.generateObjectives(template),
            npcs: this.generateNPCs(template, env),
            locations: this.generateLocations(env),
            plotHooks: this.generatePlotHooks(template),
            narrative: null,
            estimatedDuration: this.estimateAdventureDuration(template),
            createdAt: Date.now()
        };

        // Generate narrative elements
        adventure.narrative = this.generateNarrative(adventure);
        
        console.log(`✅ Generated adventure: "${adventure.title}"`);
        return adventure;
    }

    /**
     * Generate adventure encounters
     */
    generateEncounters(partyLevel, template, environment, difficulty) {
        const encounterCount = this.calculateEncounterCount(template);
        const encounters = [];
        
        for (let i = 0; i < encounterCount; i++) {
            const encounter = this.generateSingleEncounter(partyLevel, template, environment, i, difficulty);
            encounters.push(encounter);
        }
        
        return encounters;
    }

    /**
     * Generate a single encounter
     */
    generateSingleEncounter(partyLevel, template, environment, index, difficulty) {
        const encounterTypes = this.getEncounterTypesForTemplate(template);
        const type = this.selectEncounterType(encounterTypes, index);
        
        const encounter = {
            id: `encounter_${index + 1}`,
            type: type,
            title: this.generateEncounterTitle(type, environment),
            description: this.generateEncounterDescription(type, environment),
            challengeRating: this.calculateEncounterCR(partyLevel, index, difficulty),
            environment: environment,
            setup: this.generateEncounterSetup(type, environment),
            resolution: this.generateEncounterResolution(type),
            rewards: this.generateEncounterRewards(partyLevel, type),
            consequences: this.generateEncounterConsequences(type)
        };

        // Add type-specific details
        switch (type) {
            case 'combat':
                encounter.monsters = this.selectMonsters(partyLevel, environment, difficulty);
                encounter.tactics = this.generateCombatTactics(encounter.monsters);
                encounter.terrain = this.generateCombatTerrain(environment);
                break;
                
            case 'social':
                encounter.npcs = this.generateSocialNPCs(environment);
                encounter.objectives = this.generateSocialObjectives();
                encounter.dialogueOptions = this.generateDialogueOptions();
                encounter.outcomes = this.generateSocialOutcomes();
                break;
                
            case 'exploration':
                encounter.areas = this.generateExplorationAreas(environment);
                encounter.secrets = this.generateSecrets(partyLevel);
                encounter.hazards = this.generateEnvironmentalHazards(environment);
                encounter.discoveries = this.generateDiscoveries(environment);
                break;
                
            case 'trap':
                encounter.trap = this.generateTrap(partyLevel, environment, difficulty);
                encounter.detectDC = this.calculateTrapDetectDC(partyLevel, difficulty);
                encounter.disarmDC = this.calculateTrapDisarmDC(partyLevel, difficulty);
                encounter.consequences = this.generateTrapConsequences();
                break;
                
            case 'puzzle':
                encounter.puzzle = this.generatePuzzle(partyLevel, difficulty);
                encounter.hints = this.generatePuzzleHints();
                encounter.solutions = this.generatePuzzleSolutions();
                encounter.timeLimit = this.calculatePuzzleTimeLimit(difficulty);
                break;
        }
        
        return encounter;
    }

    /**
     * Select monsters for combat encounters
     */
    selectMonsters(partyLevel, environment, difficulty) {
        const targetCR = this.calculateEncounterCR(partyLevel, 0, difficulty);
        const environmentalMonsters = this.getEnvironmentalMonsters(environment);
        
        // Build encounter within CR budget
        const selectedMonsters = this.buildEncounterByBudget(targetCR, environmentalMonsters);
        
        return selectedMonsters.map(monster => ({
            ...monster,
            initiative: 0,
            currentHitPoints: monster.hitPoints,
            status: 'active',
            position: this.generateMonsterPosition(),
            tactics: this.generateMonsterTactics(monster),
            treasure: this.generateMonsterTreasure(monster)
        }));
    }

    /**
     * Build encounter within CR budget
     */
    buildEncounterByBudget(targetCR, availableMonsters) {
        const budget = this.getCRBudget(targetCR);
        const encounter = [];
        let remainingBudget = budget;
        
        // Sort monsters by CR for efficient selection
        const sortedMonsters = availableMonsters.sort((a, b) => a.challengeRating - b.challengeRating);
        
        while (remainingBudget > 0 && sortedMonsters.length > 0) {
            // Select monsters that fit within budget
            const affordableMonsters = sortedMonsters.filter(m => 
                this.getCRBudget(m.challengeRating) <= remainingBudget
            );
            
            if (affordableMonsters.length === 0) break;
            
            // Select random monster from affordable options
            const selectedMonster = affordableMonsters[this.diceEngine.roll(`1d${affordableMonsters.length}`).total - 1];
            encounter.push({ ...selectedMonster });
            
            remainingBudget -= this.getCRBudget(selectedMonster.challengeRating);
        }
        
        return encounter;
    }

    /**
     * Get environmental monsters for location
     */
    getEnvironmentalMonsters(environment) {
        const monstersByEnvironment = {
            forest: [
                { name: 'Wolf', challengeRating: 1, hitPoints: 13, type: 'Animal' },
                { name: 'Brown Bear', challengeRating: 4, hitPoints: 51, type: 'Animal' },
                { name: 'Owlbear', challengeRating: 5, hitPoints: 52, type: 'Magical Beast' },
                { name: 'Dryad', challengeRating: 3, hitPoints: 22, type: 'Fey' },
                { name: 'Treant', challengeRating: 8, hitPoints: 66, type: 'Plant' }
            ],
            dungeon: [
                { name: 'Skeleton', challengeRating: 1, hitPoints: 6, type: 'Undead' },
                { name: 'Zombie', challengeRating: 1, hitPoints: 16, type: 'Undead' },
                { name: 'Orc', challengeRating: 1, hitPoints: 5, type: 'Humanoid' },
                { name: 'Gelatinous Cube', challengeRating: 3, hitPoints: 50, type: 'Ooze' },
                { name: 'Minotaur', challengeRating: 4, hitPoints: 39, type: 'Monstrous Humanoid' }
            ],
            urban: [
                { name: 'Human Warrior', challengeRating: 1, hitPoints: 8, type: 'Humanoid' },
                { name: 'Human Rogue', challengeRating: 2, hitPoints: 12, type: 'Humanoid' },
                { name: 'City Watch', challengeRating: 1, hitPoints: 8, type: 'Humanoid' },
                { name: 'Assassin', challengeRating: 4, hitPoints: 32, type: 'Humanoid' }
            ],
            mountain: [
                { name: 'Giant Eagle', challengeRating: 3, hitPoints: 26, type: 'Magical Beast' },
                { name: 'Stone Giant', challengeRating: 8, hitPoints: 119, type: 'Giant' },
                { name: 'Griffon', challengeRating: 4, hitPoints: 59, type: 'Magical Beast' },
                { name: 'Wyvern', challengeRating: 6, hitPoints: 60, type: 'Dragon' }
            ]
        };
        
        return monstersByEnvironment[environment] || monstersByEnvironment.forest;
    }

    /**
     * Generate narrative for adventure
     */
    generateNarrative(adventure) {
        const narrative = {
            opening: this.generateOpening(adventure),
            acts: this.generateActs(adventure),
            climax: this.generateClimax(adventure),
            resolution: this.generateResolution(adventure),
            epilogue: this.generateEpilogue(adventure)
        };
        
        return narrative;
    }

    /**
     * Generate adventure opening
     */
    generateOpening(adventure) {
        const templates = this.narrativePatterns.openings;
        const template = templates[this.diceEngine.roll(`1d${templates.length}`).total - 1];
        
        return template
            .replace('{environment}', adventure.environment)
            .replace('{threat}', this.generateThreat(adventure.type))
            .replace('{npc}', this.generateNPCTitle())
            .replace('{mystery}', this.generateMystery(adventure.type))
            .replace('{location}', this.generateLocationName(adventure.environment));
    }

    /**
     * Generate acts for adventure structure
     */
    generateActs(adventure) {
        const acts = [];
        const encounterGroups = this.groupEncountersByAct(adventure.encounters);
        
        encounterGroups.forEach((group, index) => {
            acts.push({
                number: index + 1,
                title: this.generateActTitle(index, adventure.type),
                description: this.generateActDescription(index, group, adventure),
                encounters: group,
                objective: this.generateActObjective(index, adventure.type)
            });
        });
        
        return acts;
    }

    // ===== REWARD AND XP SYSTEM =====

    /**
     * Generate rewards for adventure
     */
    generateRewards(partyLevel, difficulty) {
        const baseGold = this.calculateBaseGold(partyLevel, difficulty);
        const treasureRolls = this.calculateTreasureRolls(partyLevel);
        
        return {
            experience: this.calculateAdventureXP(partyLevel, difficulty),
            gold: baseGold,
            items: this.generateTreasureItems(treasureRolls, partyLevel),
            reputation: this.generateReputationRewards(),
            contacts: this.generateContactRewards(),
            information: this.generateInformationRewards()
        };
    }

    /**
     * Calculate adventure experience points
     */
    calculateAdventureXP(partyLevel, difficulty) {
        const baseXP = partyLevel * 300; // Base XP per level
        const difficultyMultiplier = this.difficultySettings[difficulty] || 1.0;
        
        return Math.floor(baseXP * difficultyMultiplier);
    }

    /**
     * Generate treasure items
     */
    generateTreasureItems(rolls, level) {
        const items = [];
        
        for (let i = 0; i < rolls; i++) {
            const itemType = this.selectTreasureType(level);
            const item = this.generateTreasureItem(itemType, level);
            items.push(item);
        }
        
        return items;
    }

    // ===== UTILITY METHODS =====

    /**
     * Calculate encounter challenge rating
     */
    calculateEncounterCR(partyLevel, encounterIndex, difficulty = 'normal') {
        const baseCR = partyLevel;
        const difficultyMod = this.difficultySettings[difficulty] || 1.0;
        const variationMod = (encounterIndex % 3) * 0.5 - 0.5; // -0.5, 0, +0.5 variation
        
        return Math.max(1, Math.floor((baseCR + variationMod) * difficultyMod));
    }

    /**
     * Get CR budget for encounter building
     */
    getCRBudget(challengeRating) {
        // Simplified CR to XP budget conversion
        const crToXP = {
            0: 10, 1: 400, 2: 600, 3: 800, 4: 1200, 5: 1600,
            6: 2400, 7: 3200, 8: 4800, 9: 6400, 10: 9600
        };
        
        return crToXP[challengeRating] || (challengeRating * 1000);
    }

    /**
     * Generate random adventure ID
     */
    generateAdventureId() {
        return `adv_${Date.now()}_${this.diceEngine.roll('1d10000').total}`;
    }

    /**
     * Select random template
     */
    selectRandomTemplate() {
        const roll = this.diceEngine.roll(`1d${this.adventureTemplates.length}`);
        return this.adventureTemplates[roll.total - 1];
    }

    /**
     * Select random environment
     */
    selectRandomEnvironment() {
        const roll = this.diceEngine.roll(`1d${this.environments.length}`);
        return this.environments[roll.total - 1];
    }

    /**
     * Generate adventure title
     */
    generateAdventureTitle(template, environment) {
        const titles = {
            'goblin_raid': ['The Goblin Menace', 'Raiders of the Green Hills', 'The Goblin King\'s Revenge'],
            'ancient_tomb': ['Secrets of the Lost Pharaoh', 'The Cursed Sepulcher', 'Tomb of the Forgotten King'],
            'city_investigation': ['Shadows in the Capital', 'The Merchant\'s Conspiracy', 'Mystery of the Missing Guild']
        };
        
        const templateTitles = titles[template] || ['The ' + environment + ' Adventure'];
        const roll = this.diceEngine.roll(`1d${templateTitles.length}`);
        
        return templateTitles[roll.total - 1];
    }

    /**
     * Start a generated adventure
     */
    startAdventure(adventure) {
        this.currentAdventure = adventure;
        this.activeEncounters = [...adventure.encounters];
        
        console.log(`🎬 Starting adventure: "${adventure.title}"`);
        
        // Initialize world state
        this.worldState = {
            adventureId: adventure.id,
            currentAct: 1,
            completedEncounters: [],
            partyStatus: 'active',
            timeElapsed: 0,
            reputation: 0
        };
        
        return {
            adventure: adventure,
            currentEncounter: this.activeEncounters[0] || null,
            status: 'started'
        };
    }

    /**
     * Get next encounter in sequence
     */
    getNextEncounter() {
        if (this.activeEncounters.length === 0) {
            return { completed: true, message: 'Adventure completed!' };
        }
        
        return this.activeEncounters.shift();
    }

    /**
     * Complete current encounter
     */
    completeEncounter(encounterId, outcome) {
        this.worldState.completedEncounters.push({
            id: encounterId,
            outcome: outcome,
            completedAt: Date.now()
        });
        
        // Check if adventure is complete
        if (this.activeEncounters.length === 0) {
            return this.completeAdventure();
        }
        
        return { status: 'continuing', nextEncounter: this.getNextEncounter() };
    }

    /**
     * Complete current adventure
     */
    completeAdventure() {
        if (!this.currentAdventure) return null;
        
        const completedAdventure = {
            ...this.currentAdventure,
            completedAt: Date.now(),
            worldState: this.worldState,
            status: 'completed'
        };
        
        this.adventureHistory.push(completedAdventure);
        this.currentAdventure = null;
        this.activeEncounters = [];
        
        console.log(`🏆 Adventure completed: "${completedAdventure.title}"`);
        
        return {
            adventure: completedAdventure,
            rewards: completedAdventure.rewards,
            experience: completedAdventure.rewards.experience,
            status: 'completed'
        };
    }

    /**
     * Save adventure state
     */
    saveAdventureState() {
        if (!this.currentAdventure) return null;
        
        return {
            currentAdventure: this.currentAdventure,
            activeEncounters: this.activeEncounters,
            worldState: this.worldState,
            savedAt: Date.now()
        };
    }

    /**
     * Load adventure state
     */
    loadAdventureState(state) {
        this.currentAdventure = state.currentAdventure;
        this.activeEncounters = state.activeEncounters;
        this.worldState = state.worldState;
        
        console.log(`📖 Loaded adventure: "${this.currentAdventure.title}"`);
    }

    /**
     * Get adventure statistics
     */
    getAdventureStats() {
        return {
            currentAdventure: this.currentAdventure ? this.currentAdventure.title : null,
            activeEncounters: this.activeEncounters.length,
            completedAdventures: this.adventureHistory.length,
            totalExperience: this.adventureHistory.reduce((sum, adv) => sum + (adv.rewards?.experience || 0), 0),
            worldState: this.worldState
        };
    }
}

// Global export for both browser and Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdventureEngine;
} else if (typeof window !== 'undefined') {
    window.AdventureEngine = AdventureEngine;
}
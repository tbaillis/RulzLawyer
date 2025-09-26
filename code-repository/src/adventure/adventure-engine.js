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
    constructor(diceEngine, characterManager, dataManager, systemIntegrations = {}) {
        this.diceEngine = diceEngine;
        this.characterManager = characterManager;
        this.dataManager = dataManager;
        
        // System integrations
        this.inventoryIntegration = systemIntegrations.inventoryIntegration;
        this.combatIntegration = systemIntegrations.combatIntegration;
        this.spellSystem = systemIntegrations.spellSystem;
        
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
     * Load D&D 3.5 encounter tables and adventure data
     */
    loadEncounterTables() {
        this.encounterTables = {
            wilderness: [
                { name: 'Wolf Pack', cr: 1, type: 'combat', description: 'A pack of 2-4 wolves hunting for prey' },
                { name: 'Bandit Group', cr: 2, type: 'combat', description: '3-6 bandits demanding toll or treasure' },
                { name: 'Traveling Merchant', cr: 0, type: 'social', description: 'A friendly merchant with goods to trade' },
                { name: 'Ancient Ruins', cr: 1, type: 'exploration', description: 'Crumbling ruins with hidden secrets' },
                { name: 'Wild Boar', cr: 1, type: 'combat', description: 'An aggressive wild boar defending territory' },
                { name: 'Lost Traveler', cr: 0, type: 'social', description: 'A confused traveler seeking directions' },
                { name: 'Goblin Patrol', cr: 1, type: 'combat', description: '2-5 goblins on a scouting mission' },
                { name: 'Hidden Cache', cr: 0, type: 'treasure', description: 'A buried cache of supplies and coins' },
                { name: 'Wounded Knight', cr: 0, type: 'social', description: 'An injured knight needing assistance' },
                { name: 'Spider Nest', cr: 2, type: 'combat', description: 'Large spiders defending their web-filled lair' }
            ],
            dungeon: [
                { name: 'Skeleton Guards', cr: 1, type: 'combat', description: 'Animated skeletons guarding a passage' },
                { name: 'Pit Trap', cr: 1, type: 'trap', description: 'A concealed pit with spikes at the bottom' },
                { name: 'Treasure Chest', cr: 0, type: 'treasure', description: 'An ornate chest containing valuable items' },
                { name: 'Zombie Patrol', cr: 1, type: 'combat', description: 'Shambling zombies wandering the halls' },
                { name: 'Secret Door', cr: 0, type: 'exploration', description: 'A hidden passage to unknown areas' },
                { name: 'Poison Gas Trap', cr: 2, type: 'trap', description: 'Ancient mechanism releases toxic fumes' },
                { name: 'Giant Rat Swarm', cr: 1, type: 'combat', description: 'Dozens of aggressive giant rats' },
                { name: 'Magic Fountain', cr: 0, type: 'exploration', description: 'A mystical fountain with unknown properties' },
                { name: 'Orc Warriors', cr: 2, type: 'combat', description: 'Well-armed orc soldiers on patrol' },
                { name: 'Locked Door', cr: 0, type: 'puzzle', description: 'A sturdy door requiring key or skill to open' }
            ],
            urban: [
                { name: 'Pickpocket Attempt', cr: 1, type: 'social', description: 'A thief attempts to steal from the party' },
                { name: 'City Watch', cr: 1, type: 'social', description: 'Guards questioning suspicious activities' },
                { name: 'Tavern Brawl', cr: 1, type: 'combat', description: 'A bar fight erupts around the characters' },
                { name: 'Merchant Dispute', cr: 0, type: 'social', description: 'Two traders arguing over a business deal' },
                { name: 'Cult Meeting', cr: 2, type: 'exploration', description: 'Discovery of a secret cult gathering' },
                { name: 'Corrupt Official', cr: 1, type: 'social', description: 'A government official demanding bribes' },
                { name: 'Thieves Guild', cr: 2, type: 'social', description: 'Contact with the local criminal organization' },
                { name: 'Noble\'s Request', cr: 0, type: 'social', description: 'A wealthy noble seeks the party\'s assistance' },
                { name: 'Street Performance', cr: 0, type: 'social', description: 'Entertaining performers gathering crowds' },
                { name: 'Smuggler\'s Deal', cr: 1, type: 'social', description: 'Opportunity to participate in illegal trade' }
            ]
        };

        this.treasureTables = {
            minor: [
                { item: 'Potion of Cure Light Wounds', value: 50 },
                { item: 'Masterwork Dagger', value: 302 },
                { item: 'Silver Pieces', value: 100 },
                { item: 'Scroll of Magic Missile', value: 25 },
                { item: 'Gold Pieces', value: 50 },
                { item: 'Gems (small)', value: 75 },
                { item: 'Masterwork Thieves\' Tools', value: 100 }
            ],
            major: [
                { item: '+1 Longsword', value: 2315 },
                { item: 'Ring of Protection +1', value: 2000 },
                { item: 'Cloak of Resistance +1', value: 1000 },
                { item: 'Potion of Cure Moderate Wounds', value: 300 },
                { item: 'Scroll of Fireball', value: 375 },
                { item: 'Bag of Holding (Type I)', value: 2500 },
                { item: 'Boots of Elvenkind', value: 2500 }
            ]
        };

        this.adventureTemplates = {
            'Goblin Raid': {
                description: 'Goblins have been raiding nearby settlements',
                encounters: ['Goblin Patrol', 'Goblin Patrol', 'Goblin Chief'],
                environment: 'wilderness',
                estimatedDuration: 4,
                reward: 'minor'
            },
            'Ancient Tomb': {
                description: 'Explore a recently discovered ancient burial site',
                encounters: ['Skeleton Guards', 'Pit Trap', 'Treasure Chest', 'Zombie Patrol'],
                environment: 'dungeon',
                estimatedDuration: 6,
                reward: 'major'
            },
            'City Investigation': {
                description: 'Investigate mysterious disappearances in the city',
                encounters: ['City Watch', 'Pickpocket Attempt', 'Cult Meeting', 'Corrupt Official'],
                environment: 'urban',
                estimatedDuration: 8,
                reward: 'minor'
            }
        };
    }

    /**
     * Generate a new adventure based on party level and preferences
     */
    generateAdventure(partyLevel = 1, preferredType = 'random', duration = 6) {
        const adventureTypes = Object.keys(this.adventureTemplates);
        let selectedType;

        if (preferredType === 'random') {
            selectedType = adventureTypes[Math.floor(Math.random() * adventureTypes.length)];
        } else {
            selectedType = preferredType;
        }

        const template = this.adventureTemplates[selectedType] || this.adventureTemplates['Goblin Raid'];

        const adventure = {
            title: selectedType,
            description: template.description,
            partyLevel: partyLevel,
            environment: template.environment,
            estimatedDuration: duration,
            encounters: [],
            treasure: [],
            experience: 0,
            status: 'active',
            currentEncounter: 0,
            startTime: Date.now()
        };

        // Generate encounters based on party level
        const numEncounters = Math.min(duration, template.encounters.length + 2);
        for (let i = 0; i < numEncounters; i++) {
            const encounter = this.generateEncounter(template.environment, partyLevel);
            adventure.encounters.push(encounter);
        }

        // Add final treasure encounter
        if (template.reward) {
            const treasureEncounter = this.generateTreasureEncounter(template.reward, partyLevel);
            adventure.encounters.push(treasureEncounter);
        }

        this.activeAdventure = adventure;
        return adventure;
    }

    /**
     * Generate individual encounter based on environment and party level
     */
    generateEncounter(environment = 'wilderness', partyLevel = 1) {
        const encounters = this.encounterTables[environment] || this.encounterTables.wilderness;
        const baseEncounter = encounters[Math.floor(Math.random() * encounters.length)];

        // Scale encounter to party level
        const scaledCR = Math.max(1, baseEncounter.cr + partyLevel - 1);

        const encounter = {
            ...baseEncounter,
            cr: scaledCR,
            resolved: false,
            experience: this.calculateExperience(scaledCR),
            environment: environment
        };

        return encounter;
    }

    /**
     * Generate treasure encounter
     */
    generateTreasureEncounter(treasureType = 'minor', partyLevel = 1) {
        const treasures = this.treasureTables[treasureType] || this.treasureTables.minor;
        const selectedTreasure = treasures[Math.floor(Math.random() * treasures.length)];

        // Scale treasure value to party level
        const scaledValue = Math.floor(selectedTreasure.value * (1 + (partyLevel - 1) * 0.5));

        return {
            name: 'Treasure Discovery',
            type: 'treasure',
            cr: 0,
            description: `You discover ${selectedTreasure.item}`,
            treasure: {
                item: selectedTreasure.item,
                value: scaledValue
            },
            resolved: false,
            experience: 0,
            environment: 'any'
        };
    }

    /**
     * Calculate experience points for encounter based on CR
     */
    calculateExperience(challengeRating) {
        const baseXP = [
            0,    // CR 0
            400,  // CR 1
            600,  // CR 2
            800,  // CR 3
            1200, // CR 4
            1600, // CR 5
            2400, // CR 6
            3200, // CR 7
            4800, // CR 8
            6400, // CR 9
            9600  // CR 10
        ];

        return baseXP[Math.min(challengeRating, baseXP.length - 1)] || 400;
    }

    /**
     * Resolve current encounter
     */
    resolveCurrentEncounter(outcome = 'success') {
        if (!this.activeAdventure) {
            throw new Error('No active adventure');
        }

        const adventure = this.activeAdventure;
        const currentIndex = adventure.currentEncounter;

        if (currentIndex >= adventure.encounters.length) {
            throw new Error('No more encounters in this adventure');
        }

        const encounter = adventure.encounters[currentIndex];
        encounter.resolved = true;
        encounter.outcome = outcome;

        let resultText = '';
        let experienceGained = 0;
        let treasureGained = null;

        switch (outcome) {
            case 'success':
                if (encounter.type === 'combat') {
                    resultText = `Successfully defeated ${encounter.name}!`;
                    experienceGained = encounter.experience;
                } else if (encounter.type === 'treasure') {
                    resultText = `Found treasure: ${encounter.treasure.item}`;
                    treasureGained = encounter.treasure;
                } else if (encounter.type === 'social') {
                    resultText = `Successfully handled ${encounter.name}`;
                    experienceGained = Math.floor(encounter.experience / 2);
                } else {
                    resultText = `Successfully resolved ${encounter.name}`;
                    experienceGained = Math.floor(encounter.experience / 2);
                }
                break;
            case 'failure':
                resultText = `Failed to resolve ${encounter.name}`;
                experienceGained = Math.floor(encounter.experience / 4);
                break;
            case 'avoided':
                resultText = `Avoided encounter with ${encounter.name}`;
                experienceGained = Math.floor(encounter.experience / 3);
                break;
        }

        adventure.experience += experienceGained;
        this.experienceAwarded += experienceGained;

        if (treasureGained) {
            adventure.treasure.push(treasureGained);
            this.treasureGenerated += treasureGained.value;
        }

        adventure.currentEncounter++;

        // Check if adventure is complete
        if (adventure.currentEncounter >= adventure.encounters.length) {
            adventure.status = 'completed';
            adventure.endTime = Date.now();
        }

        return {
            resultText,
            experienceGained,
            treasureGained,
            adventureComplete: adventure.status === 'completed'
        };
    }

    /**
     * Get current encounter
     */
    getCurrentEncounter() {
        if (!this.activeAdventure) return null;

        const adventure = this.activeAdventure;
        const currentIndex = adventure.currentEncounter;

        if (currentIndex >= adventure.encounters.length) return null;

        return adventure.encounters[currentIndex];
    }

    /**
     * Get adventure progress
     */
    getAdventureProgress() {
        if (!this.activeAdventure) return null;

        const adventure = this.activeAdventure;
        return {
            title: adventure.title,
            description: adventure.description,
            currentEncounter: adventure.currentEncounter + 1,
            totalEncounters: adventure.encounters.length,
            experienceEarned: adventure.experience,
            treasureFound: adventure.treasure,
            status: adventure.status,
            estimatedTimeRemaining: this.getEstimatedTimeRemaining()
        };
    }

    /**
     * Get estimated time remaining in adventure
     */
    getEstimatedTimeRemaining() {
        if (!this.activeAdventure) return 0;

        const adventure = this.activeAdventure;
        const remainingEncounters = adventure.encounters.length - adventure.currentEncounter;
        const averageTimePerEncounter = 15; // minutes

        return remainingEncounters * averageTimePerEncounter;
    }

    /**
     * Simulate automatic encounter resolution (for testing/demo)
     */
    simulateEncounter(encounter) {
        if (!encounter) return null;

        let outcome;
        let roll = this.diceEngine ? this.diceEngine.roll('1d20') : Math.floor(Math.random() * 20) + 1;

        // Simple outcome determination
        if (encounter.type === 'combat') {
            outcome = roll >= 10 ? 'success' : 'failure';
        } else if (encounter.type === 'treasure') {
            outcome = 'success'; // Always find treasure
        } else {
            outcome = roll >= 8 ? 'success' : 'failure';
        }

        return this.resolveCurrentEncounter(outcome);
    }

    /**
     * Get adventure statistics
     */
    getStatistics() {
        return {
            totalExperienceAwarded: this.experienceAwarded,
            totalTreasureGenerated: this.treasureGenerated,
            encountersResolved: this.encounters.length,
            activeAdventure: this.activeAdventure ? this.activeAdventure.title : null
        };
    }

    // ===== SYSTEM INTEGRATION METHODS =====

    /**
     * Execute integrated combat encounter
     */
    async executeIntegratedCombat(encounter, party) {
        if (!this.combatIntegration) {
            console.warn('Combat integration not available, using basic resolution');
            return this.resolveEncounter(encounter);
        }
        
        console.log(`⚔️ Starting integrated combat: ${encounter.name}`);
        
        // Initialize combat with full integration
        const combatSetup = {
            enemies: encounter.enemies || this.generateEnemiesForEncounter(encounter),
            environment: encounter.environment || 'standard',
            terrain: encounter.terrain || 'normal',
            lighting: encounter.lighting || 'normal'
        };
        
        // Run combat through combat integration system
        const combat = await this.combatIntegration.initializeCombat(
            party, 
            combatSetup.enemies, 
            combatSetup.environment
        );
        
        const combatResult = await this.combatIntegration.runCombat(combat);
        
        // Process combat rewards through inventory integration
        if (combatResult.success && this.inventoryIntegration) {
            await this.processIntegratedRewards(combatResult, party);
        }
        
        return {
            ...combatResult,
            encounter: encounter,
            integratedSystems: true
        };
    }

    /**
     * Process rewards through integrated systems
     */
    async processIntegratedRewards(combatResult, party) {
        if (!this.inventoryIntegration) return;
        
        // Distribute treasure through inventory system
        if (combatResult.treasure) {
            for (const item of combatResult.treasure) {
                await this.inventoryIntegration.distributeLoot(party, item);
            }
        }
        
        // Handle experience distribution
        if (combatResult.experience) {
            this.distributeExperience(party, combatResult.experience);
        }
        
        console.log('💰 Rewards processed through integrated inventory system');
    }

    /**
     * Cast spells during adventure events
     */
    async castAdventureSpell(caster, spellName, targets = [], context = {}) {
        if (!this.spellSystem) {
            console.warn('Spell system not available');
            return { success: false, error: 'Spell system not integrated' };
        }
        
        console.log(`🔮 ${caster.name} attempts to cast ${spellName}`);
        
        // Determine caster level
        const casterLevel = this.characterManager.getCharacterLevel(caster);
        
        // Attempt spell casting
        const castingResult = await this.spellSystem.castSpell(
            caster, 
            spellName, 
            casterLevel, 
            context.metamagicFeats || []
        );
        
        if (castingResult.success) {
            // Apply spell effects to targets
            if (targets.length > 0) {
                await this.applySpellEffects(castingResult, targets);
            }
            
            // Track spell usage in adventure log
            this.logAdventureEvent({
                type: 'spell_cast',
                caster: caster.name,
                spell: spellName,
                targets: targets.map(t => t.name),
                success: true,
                timestamp: Date.now()
            });
        }
        
        return castingResult;
    }

    /**
     * Apply spell effects to targets
     */
    async applySpellEffects(castingResult, targets) {
        const { effects, damage, healing } = castingResult;
        
        for (const target of targets) {
            // Apply damage
            if (damage && damage.total > 0) {
                target.hitPoints = Math.max(0, (target.hitPoints || target.maxHitPoints) - damage.total);
                console.log(`⚡ ${target.name} takes ${damage.total} ${damage.type} damage`);
            }
            
            // Apply healing
            if (healing && healing.total > 0) {
                target.hitPoints = Math.min(
                    target.maxHitPoints, 
                    (target.hitPoints || 0) + healing.total
                );
                console.log(`💚 ${target.name} heals ${healing.total} hit points`);
            }
            
            // Apply conditions and effects
            if (effects.conditions) {
                target.conditions = target.conditions || [];
                effects.conditions.forEach(condition => {
                    target.conditions.push({
                        ...condition,
                        duration: castingResult.duration,
                        source: castingResult.spell.name
                    });
                });
            }
        }
    }

    /**
     * Generate adventure with integrated systems
     */
    generateIntegratedAdventure(options = {}) {
        const adventure = this.generateAdventure(options);
        
        // Enhance encounters with integration data
        if (adventure.encounters) {
            adventure.encounters = adventure.encounters.map(encounter => {
                return this.enhanceEncounterWithIntegration(encounter, options);
            });
        }
        
        // Set up adventure-specific inventory tracking
        if (this.inventoryIntegration && options.party) {
            adventure.sharedInventory = this.inventoryIntegration.createSharedInventory(options.party);
        }
        
        // Initialize spell tracking for adventure
        if (this.spellSystem && options.party) {
            adventure.spellTracking = {
                dailySpells: new Map(),
                activeSpells: new Map(),
                spellComponents: new Map()
            };
        }
        
        console.log('🎲 Generated integrated adventure with full system support');
        
        return adventure;
    }

    /**
     * Enhance encounter with integration features
     */
    enhanceEncounterWithIntegration(encounter, options) {
        const enhanced = { ...encounter };
        
        // Add combat integration features
        if (encounter.type === 'combat' && this.combatIntegration) {
            enhanced.combatTactics = this.generateCombatTactics(encounter);
            enhanced.battlefieldFeatures = this.generateBattlefieldFeatures(encounter);
        }
        
        // Add inventory integration features
        if (this.inventoryIntegration) {
            enhanced.lootTable = this.generateEnhancedLootTable(encounter);
            enhanced.environmentalItems = this.generateEnvironmentalItems(encounter);
        }
        
        // Add spell integration features
        if (this.spellSystem) {
            enhanced.magicalEffects = this.generateMagicalEffects(encounter);
            enhanced.spellTriggers = this.generateSpellTriggers(encounter);
        }
        
        return enhanced;
    }

    /**
     * Log adventure events for integrated tracking
     */
    logAdventureEvent(event) {
        if (!this.activeAdventure) return;
        
        this.activeAdventure.eventLog = this.activeAdventure.eventLog || [];
        this.activeAdventure.eventLog.push({
            ...event,
            adventureTime: this.activeAdventure.currentTime || Date.now(),
            location: this.activeAdventure.currentLocation || 'unknown'
        });
        
        // Limit log size to prevent memory issues
        if (this.activeAdventure.eventLog.length > 1000) {
            this.activeAdventure.eventLog = this.activeAdventure.eventLog.slice(-900);
        }
    }

    /**
     * Get integrated system status
     */
    getIntegrationStatus() {
        return {
            inventoryIntegration: !!this.inventoryIntegration,
            combatIntegration: !!this.combatIntegration,
            spellSystem: !!this.spellSystem,
            fullyIntegrated: !!(this.inventoryIntegration && this.combatIntegration && this.spellSystem)
        };
    }

    /**
     * Generate enhanced loot table with inventory integration
     */
    generateEnhancedLootTable(encounter) {
        if (!this.inventoryIntegration) return encounter.treasure || [];
        
        return this.inventoryIntegration.generateContextualLoot({
            encounterType: encounter.type,
            challengeRating: encounter.cr,
            environment: encounter.environment,
            enemyTypes: encounter.enemies
        });
    }

    /**
     * Distribute experience with character progression tracking
     */
    distributeExperience(party, totalExperience) {
        const experiencePerCharacter = Math.floor(totalExperience / party.length);
        
        party.forEach(character => {
            const oldLevel = this.characterManager.getCharacterLevel(character);
            character.experience = (character.experience || 0) + experiencePerCharacter;
            const newLevel = this.characterManager.getCharacterLevel(character);
            
            if (newLevel > oldLevel) {
                this.logAdventureEvent({
                    type: 'level_up',
                    character: character.name,
                    oldLevel: oldLevel,
                    newLevel: newLevel,
                    experienceGained: experiencePerCharacter
                });
                
                console.log(`🎉 ${character.name} advances to level ${newLevel}!`);
            }
        });
        
        this.experienceAwarded += totalExperience;
    }

    /**
     * Reset adventure engine
     */
    reset() {
        this.activeAdventure = null;
        this.encounters = [];
        this.experienceAwarded = 0;
        this.treasureGenerated = 0;
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdventureEngine;
} else if (typeof window !== 'undefined') {
    window.AdventureEngine = AdventureEngine;
}
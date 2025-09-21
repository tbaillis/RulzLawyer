/**
 * RulzLawyer Adventure Engine
 * Comprehensive adventure generation using all random tables
 * D&D 3.5 SRD Compliant Adventure System
 * 
 * Features:
 * - Complete adventure generation using all 17+ random tables
 * - Encounter resolution system with character integration
 * - Adventure templates and structured narratives
 * - Character death handling and consequence management
 * - Session tracking and adventure progression
 * - Difficulty scaling and party level adaptation
 */

class AdventureEngine {
    constructor(diceEngine, tablesEngine, characterManager, storageManager) {
        this.diceEngine = diceEngine;
        this.tablesEngine = tablesEngine;
        this.characterManager = characterManager;
        this.storageManager = storageManager;
        
        // Adventure generation statistics
        this.stats = {
            adventuresGenerated: 0,
            encountersResolved: 0,
            characterDeaths: 0,
            treasuresAwarded: 0,
            sessionsRun: 0
        };
        
        // Current adventure state
        this.currentAdventure = null;
        this.activeSession = null;
        
        // Adventure difficulty scaling
        this.difficultyScaling = {
            trivial: { encounterMultiplier: 0.5, treasureMultiplier: 0.5 },
            easy: { encounterMultiplier: 0.75, treasureMultiplier: 0.75 },
            moderate: { encounterMultiplier: 1.0, treasureMultiplier: 1.0 },
            challenging: { encounterMultiplier: 1.5, treasureMultiplier: 1.25 },
            hard: { encounterMultiplier: 2.0, treasureMultiplier: 1.5 },
            epic: { encounterMultiplier: 3.0, treasureMultiplier: 2.0 }
        };
        
        console.log('🏰 Adventure Engine initialized');
    }
    
    /**
     * Generate Complete Adventure
     * Creates a full adventure using all available random tables
     */
    generateCompleteAdventure(options = {}) {
        try {
            const {
                partyLevel = 1,
                partySize = 4,
                adventureType = 'balanced',
                difficulty = 'moderate',
                theme = null,
                includeSubplots = true
            } = options;
            
            console.log(`🏰 Generating ${difficulty} adventure for level ${partyLevel} party...`);
            
            // Core adventure components
            const adventure = {
                id: this.generateAdventureId(),
                metadata: {
                    partyLevel,
                    partySize,
                    adventureType,
                    difficulty,
                    theme,
                    generatedAt: new Date().toISOString(),
                    estimatedDuration: this.calculateAdventureDuration(partyLevel, difficulty)
                },
                
                // Primary adventure elements
                setting: this.generateAdventureSetting(theme),
                hook: this.generateAdventureHook(adventureType),
                background: this.generateAdventureBackground(),
                
                // Encounter structure
                encounters: this.generateEncounterSequence(partyLevel, difficulty, partySize),
                
                // Supporting elements
                npcs: this.generateAdventureNPCs(partyLevel),
                locations: this.generateAdventureLocations(),
                treasures: this.generateAdventureTreasures(partyLevel, difficulty),
                
                // Narrative elements
                complications: this.generateAdventureComplications(),
                plotTwists: this.generatePlotTwists(),
                subplots: includeSubplots ? this.generateSubplots() : [],
                
                // Environmental factors
                environment: this.generateEnvironmentalFactors(),
                
                // Resolution tracking
                progress: {
                    encountersCompleted: 0,
                    npcsEncountered: 0,
                    treasuresFound: 0,
                    complicationsResolved: 0,
                    characterDeaths: 0,
                    sessionNumber: 1
                }
            };
            
            // Store adventure
            this.currentAdventure = adventure;
            this.stats.adventuresGenerated++;
            
            console.log('✅ Complete adventure generated:', adventure.id);
            return adventure;
            
        } catch (error) {
            console.error('❌ Adventure generation failed:', error);
            throw new Error(`Adventure generation failed: ${error.message}`);
        }
    }
    
    /**
     * Generate Adventure Setting
     */
    generateAdventureSetting(theme = null) {
        try {
            const location = this.tablesEngine.rollTable('terrain-features');
            const environment = this.tablesEngine.rollTable('weather-conditions');
            
            // Apply theme if specified
            let setting = {
                primaryLocation: location.value,
                environment: environment.value,
                theme: theme || this.determineTheme(location.value),
                atmosphere: this.generateAtmosphere(),
                keyFeatures: this.generateLocationFeatures()
            };
            
            // Add weather and time factors
            setting.weather = this.generateWeather();
            setting.timeOfDay = this.generateTimeOfDay();
            setting.season = this.generateSeason();
            
            return setting;
            
        } catch (error) {
            console.error('Setting generation error:', error);
            throw error;
        }
    }
    
    /**
     * Generate Adventure Hook
     */
    generateAdventureHook(adventureType = 'balanced') {
        try {
            const plotHook = this.tablesEngine.rollTable('adventure-hook');
            
            const hook = {
                primaryHook: plotHook.value,
                motivation: this.generateMotivation(adventureType),
                urgency: this.generateUrgency(),
                stakesLevel: this.generateStakes(),
                personalConnection: this.generatePersonalConnection()
            };
            
            return hook;
            
        } catch (error) {
            console.error('Hook generation error:', error);
            throw error;
        }
    }
    
    /**
     * Generate Encounter Sequence
     */
    generateEncounterSequence(partyLevel, difficulty, partySize) {
        try {
            const scaling = this.difficultyScaling[difficulty];
            const encounterCount = Math.max(3, Math.floor(partyLevel / 2) + 2);
            
            const encounters = [];
            
            // Available encounter environments
            const encounterEnvironments = ['random-encounter-wilderness', 'random-encounter-dungeon'];
            
            for (let i = 0; i < encounterCount; i++) {
                // Randomly select an environment for variety
                const environmentTable = encounterEnvironments[Math.floor(Math.random() * encounterEnvironments.length)];
                const encounterResult = this.tablesEngine.rollTable(environmentTable);
                
                const encounter = {
                    id: `encounter_${i + 1}`,
                    type: this.categorizeEncounter(encounterResult.value),
                    description: encounterResult.value,
                    difficulty: this.scaleEncounterDifficulty(difficulty, i, encounterCount),
                    partyLevel,
                    estimatedDuration: this.estimateEncounterDuration(partyLevel),
                    rewards: this.generateEncounterRewards(partyLevel, scaling),
                    consequences: this.generateEncounterConsequences(),
                    environment: this.generateEncounterEnvironment(),
                    tactics: this.generateEncounterTactics(),
                    completed: false,
                    casualties: [],
                    resolution: null
                };
                
                encounters.push(encounter);
            }
            
            // Ensure final encounter is climactic
            if (encounters.length > 0) {
                encounters[encounters.length - 1].isClimax = true;
                encounters[encounters.length - 1].difficulty = 'climactic';
                encounters[encounters.length - 1].rewards = this.generateClimaxRewards(partyLevel, scaling);
            }
            
            return encounters;
            
        } catch (error) {
            console.error('Encounter sequence generation error:', error);
            throw error;
        }
    }
    
    /**
     * Generate Adventure NPCs
     */
    generateAdventureNPCs(partyLevel) {
        try {
            const npcCount = 2 + Math.floor(partyLevel / 3);
            const npcs = [];
            
            for (let i = 0; i < npcCount; i++) {
                const npcResult = this.tablesEngine.rollTable('npc-occupation');
                
                const npc = {
                    id: `npc_${i + 1}`,
                    description: npcResult.value,
                    role: this.determineNPCRole(i, npcCount),
                    attitude: this.generateNPCAttitude(),
                    motivation: this.generateNPCMotivation(),
                    secrets: this.generateNPCSecrets(),
                    relationship: this.generateNPCRelationship(),
                    powerLevel: this.scaleNPCPower(partyLevel),
                    encountered: false,
                    alive: true,
                    disposition: 'neutral'
                };
                
                npcs.push(npc);
            }
            
            return npcs;
            
        } catch (error) {
            console.error('NPC generation error:', error);
            throw error;
        }
    }
    
    /**
     * Generate Adventure Locations
     */
    generateAdventureLocations() {
        try {
            const locationCount = 3 + (Math.floor(Math.random() * 3) + 1);
            const locations = [];
            
            for (let i = 0; i < locationCount; i++) {
                const locationResult = this.tablesEngine.rollTable('terrain-features');
                
                const location = {
                    id: `location_${i + 1}`,
                    description: locationResult.value,
                    type: this.categorizeLocation(locationResult.value),
                    accessibility: this.generateLocationAccessibility(),
                    hazards: this.generateLocationHazards(),
                    secrets: this.generateLocationSecrets(),
                    connections: this.generateLocationConnections(),
                    visited: false,
                    searchedThoroughly: false
                };
                
                locations.push(location);
            }
            
            return locations;
            
        } catch (error) {
            console.error('Location generation error:', error);
            throw error;
        }
    }
    
    /**
     * Generate Adventure Treasures
     */
    generateAdventureTreasures(partyLevel, difficulty) {
        try {
            const scaling = this.difficultyScaling[difficulty];
            const treasureCount = Math.floor(2 + (partyLevel / 2) * scaling.treasureMultiplier);
            const treasures = [];
            
            for (let i = 0; i < treasureCount; i++) {
                const treasureResult = this.tablesEngine.rollTable('treasure-type-minor');
                
                const treasure = {
                    id: `treasure_${i + 1}`,
                    description: treasureResult.value,
                    type: this.categorizeTreasure(treasureResult.value),
                    value: this.calculateTreasureValue(partyLevel, scaling),
                    location: this.assignTreasureLocation(),
                    protection: this.generateTreasureProtection(),
                    curse: this.generateTreasureCurse(),
                    found: false,
                    identified: false,
                    claimed: false
                };
                
                treasures.push(treasure);
            }
            
            return treasures;
            
        } catch (error) {
            console.error('Treasure generation error:', error);
            throw error;
        }
    }
    
    /**
     * Generate Adventure Complications
     */
    generateAdventureComplications() {
        try {
            const complicationCount = 1 + (Math.floor(Math.random() * 2) + 1);
            const complications = [];
            
            for (let i = 0; i < complicationCount; i++) {
                const complicationResult = this.tablesEngine.rollTable('quest-complication');
                
                const complication = {
                    id: `complication_${i + 1}`,
                    description: complicationResult.value,
                    severity: this.generateComplicationSeverity(),
                    timing: this.generateComplicationTiming(),
                    resolution: this.generateComplicationResolution(),
                    triggered: false,
                    resolved: false,
                    consequences: []
                };
                
                complications.push(complication);
            }
            
            return complications;
            
        } catch (error) {
            console.error('Complication generation error:', error);
            throw error;
        }
    }
    
    /**
     * Resolve Encounter
     * Handles encounter resolution with character integration
     */
    async resolveEncounter(encounterId, characters = [], resolution = 'combat') {
        try {
            if (!this.currentAdventure) {
                throw new Error('No active adventure');
            }
            
            const encounter = this.currentAdventure.encounters.find(e => e.id === encounterId);
            if (!encounter) {
                throw new Error('Encounter not found');
            }
            
            if (encounter.completed) {
                throw new Error('Encounter already completed');
            }
            
            console.log(`⚔️ Resolving encounter: ${encounter.description}`);
            
            let result = {
                encounterId,
                resolution,
                casualties: [],
                rewards: [],
                experience: 0,
                consequences: [],
                duration: 0,
                startTime: new Date().toISOString()
            };
            
            // Simulate encounter resolution based on type
            switch (resolution) {
                case 'combat':
                    result = await this.resolveCombatEncounter(encounter, characters);
                    break;
                case 'negotiation':
                    result = await this.resolveNegotiationEncounter(encounter, characters);
                    break;
                case 'stealth':
                    result = await this.resolveStealthEncounter(encounter, characters);
                    break;
                case 'magic':
                    result = await this.resolveMagicEncounter(encounter, characters);
                    break;
                default:
                    result = await this.resolveGenericEncounter(encounter, characters);
            }
            
            // Update encounter status
            encounter.completed = true;
            encounter.resolution = result;
            encounter.casualties = result.casualties;
            
            // Update adventure progress
            this.currentAdventure.progress.encountersCompleted++;
            
            // Track statistics
            this.stats.encountersResolved++;
            this.stats.characterDeaths += result.casualties.filter(c => c.died).length;
            
            // Handle permanent character deaths
            for (const casualty of result.casualties) {
                if (casualty.died) {
                    await this.handleCharacterDeath(casualty.characterId, encounterId);
                }
            }
            
            console.log('✅ Encounter resolved:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Encounter resolution failed:', error);
            throw new Error(`Encounter resolution failed: ${error.message}`);
        }
    }
    
    /**
     * Resolve Combat Encounter
     */
    async resolveCombatEncounter(encounter, characters) {
        try {
            const result = {
                encounterId: encounter.id,
                type: 'combat',
                casualties: [],
                rewards: encounter.rewards,
                experience: this.calculateExperience(encounter),
                consequences: [],
                duration: this.diceEngine.rollExpression('2d6+5').total * 10 // minutes
            };
            
            // Simulate combat rounds
            const rounds = this.diceEngine.rollExpression('1d6+2').total;
            
            for (let round = 1; round <= rounds; round++) {
                console.log(`⚔️ Combat Round ${round}`);
                
                // Check each character for potential damage
                for (const character of characters) {
                    if (character.isDead || character.currentHP <= 0) continue;
                    
                    // Damage roll based on encounter difficulty
                    const damageChance = this.getDamageChance(encounter.difficulty);
                    const damageRoll = this.diceEngine.rollExpression('1d100').total;
                    
                    if (damageRoll <= damageChance) {
                        const damage = this.calculateEncounterDamage(encounter, character);
                        
                        // Apply damage using character manager
                        const damageResult = this.characterManager.dealDamage(
                            character.id, 
                            damage.amount, 
                            damage.type
                        );
                        
                        console.log(`💔 ${character.name} takes ${damage.amount} ${damage.type} damage`);
                        
                        // Check for death
                        if (character.currentHP <= -10) {
                            character.isDead = true;
                            result.casualties.push({
                                characterId: character.id,
                                characterName: character.name,
                                died: true,
                                deathCause: `${damage.amount} ${damage.type} damage in ${encounter.description}`,
                                round
                            });
                            
                            console.log(`💀 ${character.name} has died!`);
                        } else if (character.currentHP <= 0) {
                            console.log(`💔 ${character.name} is dying!`);
                        }
                    }
                }
            }
            
            // Award treasures if combat was successful
            const aliveCharacters = characters.filter(c => !c.isDead && c.currentHP > 0);
            if (aliveCharacters.length > 0) {
                result.treasuresAwarded = encounter.rewards;
                this.stats.treasuresAwarded += encounter.rewards.length;
            }
            
            return result;
            
        } catch (error) {
            console.error('Combat resolution error:', error);
            throw error;
        }
    }
    
    /**
     * Resolve Negotiation Encounter
     */
    async resolveNegotiationEncounter(encounter, characters) {
        try {
            const result = {
                encounterId: encounter.id,
                type: 'negotiation',
                casualties: [],
                rewards: encounter.rewards,
                experience: this.calculateExperience(encounter) * 0.75,
                consequences: ['diplomatic solution'],
                duration: this.diceEngine.rollExpression('1d6+3').total * 5 // minutes
            };
            
            // Negotiation success based on character abilities
            const negotiationRoll = this.diceEngine.rollExpression('1d20').total;
            const success = negotiationRoll >= 12; // Moderate difficulty
            
            if (success) {
                result.rewards = encounter.rewards.map(reward => ({
                    ...reward,
                    description: `Negotiated ${reward.description}`
                }));
                console.log('✅ Negotiation successful');
            } else {
                result.rewards = [];
                result.consequences.push('negotiation failed - may escalate');
                console.log('❌ Negotiation failed');
            }
            
            return result;
            
        } catch (error) {
            console.error('Negotiation resolution error:', error);
            throw error;
        }
    }
    
    /**
     * Resolve Stealth Encounter
     */
    async resolveStealthEncounter(encounter, characters) {
        try {
            const result = {
                encounterId: encounter.id,
                type: 'stealth',
                casualties: [],
                rewards: encounter.rewards,
                experience: this.calculateExperience(encounter) * 0.9,
                consequences: ['avoided detection'],
                duration: this.diceEngine.rollExpression('1d4+2').total * 10 // minutes
            };
            
            // Stealth success roll
            const stealthRoll = this.diceEngine.rollExpression('1d20').total;
            const success = stealthRoll >= 10;
            
            if (success) {
                result.consequences.push('bypassed encounter');
                console.log('🥷 Stealth successful - encounter bypassed');
            } else {
                // Failed stealth leads to combat
                result.consequences.push('stealth failed - combat initiated');
                const combatResult = await this.resolveCombatEncounter(encounter, characters);
                result.casualties = combatResult.casualties;
                console.log('💥 Stealth failed - combat initiated');
            }
            
            return result;
            
        } catch (error) {
            console.error('Stealth resolution error:', error);
            throw error;
        }
    }
    
    /**
     * Resolve Magic Encounter
     */
    async resolveMagicEncounter(encounter, characters) {
        try {
            const result = {
                encounterId: encounter.id,
                type: 'magic',
                casualties: [],
                rewards: encounter.rewards,
                experience: this.calculateExperience(encounter) * 1.1,
                consequences: ['magical resolution'],
                duration: this.diceEngine.rollExpression('1d6+1').total * 5 // minutes
            };
            
            // Magic resolution roll
            const magicRoll = this.diceEngine.rollExpression('1d20').total;
            const success = magicRoll >= 14; // Higher difficulty for magic
            
            if (success) {
                result.rewards = encounter.rewards.map(reward => ({
                    ...reward,
                    description: `Magically enhanced ${reward.description}`,
                    value: reward.value * 1.5
                }));
                result.consequences.push('magical enhancement gained');
                console.log('✨ Magic encounter resolved successfully');
            } else {
                // Magic backfire
                const backfireDamage = this.diceEngine.rollExpression('1d6').total;
                characters.forEach(character => {
                    if (!character.isDead) {
                        character.currentHP = Math.max(0, character.currentHP - backfireDamage);
                        console.log(`⚡ ${character.name} takes ${backfireDamage} magical backlash damage`);
                    }
                });
                result.consequences.push('magical backlash occurred');
            }
            
            return result;
            
        } catch (error) {
            console.error('Magic resolution error:', error);
            throw error;
        }
    }
    
    /**
     * Resolve Generic Encounter
     */
    async resolveGenericEncounter(encounter, characters) {
        try {
            const result = {
                encounterId: encounter.id,
                type: 'general',
                casualties: [],
                rewards: encounter.rewards,
                experience: this.calculateExperience(encounter),
                consequences: ['encounter resolved'],
                duration: this.diceEngine.rollExpression('1d8+2').total * 5 // minutes
            };
            
            // Generic resolution - skill-based
            const resolutionRoll = this.diceEngine.rollExpression('1d20').total;
            const success = resolutionRoll >= 11;
            
            if (success) {
                console.log('✅ Encounter resolved successfully');
            } else {
                result.rewards = encounter.rewards.map(reward => ({
                    ...reward,
                    value: reward.value * 0.5
                }));
                result.consequences.push('partial success');
                console.log('⚠️ Encounter partially resolved');
            }
            
            return result;
            
        } catch (error) {
            console.error('Generic resolution error:', error);
            throw error;
        }
    }
    
    /**
     * Handle Character Death
     * Manages permanent death with audit logging
     */
    async handleCharacterDeath(characterId, encounterId) {
        try {
            const character = this.characterManager.getCharacter(characterId);
            if (!character) return;
            
            // Mark character as permanently dead
            character.isDead = true;
            character.deathDetails = {
                encounterId,
                adventureId: this.currentAdventure?.id,
                timestamp: new Date().toISOString(),
                cause: 'adventure encounter',
                location: this.currentAdventure?.setting?.primaryLocation || 'unknown'
            };
            
            // Save with death audit
            await this.storageManager.saveCharacter(character);
            
            console.log(`💀 Character death recorded: ${character.name}`);
            
            // Update adventure statistics
            if (this.currentAdventure) {
                this.currentAdventure.progress.characterDeaths++;
            }
            
        } catch (error) {
            console.error('Character death handling error:', error);
        }
    }
    
    /**
     * Calculate Adventure Duration
     */
    calculateAdventureDuration(partyLevel, difficulty) {
        const baseDuration = 4; // hours
        const levelMultiplier = 1 + (partyLevel * 0.1);
        const difficultyMultipliers = {
            trivial: 0.5,
            easy: 0.75,
            moderate: 1.0,
            challenging: 1.5,
            hard: 2.0,
            epic: 3.0
        };
        
        return Math.round(baseDuration * levelMultiplier * difficultyMultipliers[difficulty]);
    }
    
    /**
     * Calculate Encounter Damage
     */
    calculateEncounterDamage(encounter, character) {
        const baseDamage = Math.max(1, character.maxHP * 0.15);
        
        const difficultyMultipliers = {
            trivial: 0.5,
            easy: 0.75,
            moderate: 1.0,
            challenging: 1.25,
            hard: 1.5,
            climactic: 2.0
        };
        
        const multiplier = difficultyMultipliers[encounter.difficulty] || 1.0;
        const damageAmount = Math.floor(baseDamage * multiplier);
        
        const damageTypes = ['slashing', 'piercing', 'bludgeoning', 'fire', 'cold', 'lightning'];
        const damageType = damageTypes[this.diceEngine.rollExpression('1d6').total - 1];
        
        return {
            amount: Math.max(1, damageAmount),
            type: damageType
        };
    }
    
    /**
     * Get Damage Chance
     */
    getDamageChance(difficulty) {
        const chances = {
            trivial: 20,
            easy: 30,
            moderate: 45,
            challenging: 60,
            hard: 75,
            climactic: 85
        };
        
        return chances[difficulty] || 45;
    }
    
    /**
     * Generate Plot Twists
     */
    generatePlotTwists() {
        try {
            const twistCount = 1 + (Math.floor(Math.random() * 2) + 1);
            const twists = [];
            
            for (let i = 0; i < twistCount; i++) {
                const twistResult = this.tablesEngine.rollTable('plot-twist');
                
                const twist = {
                    id: `twist_${i + 1}`,
                    description: twistResult.value,
                    timing: this.generateTwistTiming(),
                    severity: this.generateTwistSeverity(),
                    triggered: false,
                    resolved: false
                };
                
                twists.push(twist);
            }
            
            return twists;
            
        } catch (error) {
            console.error('Plot twist generation error:', error);
            throw error;
        }
    }
    
    /**
     * Generate Subplots
     */
    generateSubplots() {
        try {
            const subplotCount = Math.floor(Math.random() * 3) + 1;
            const subplots = [];
            
            for (let i = 0; i < subplotCount; i++) {
                const subplot = {
                    id: `subplot_${i + 1}`,
                    description: this.tablesEngine.rollTable('adventure-hook').value,
                    importance: this.generateSubplotImportance(),
                    connection: this.generateSubplotConnection(),
                    resolved: false
                };
                
                subplots.push(subplot);
            }
            
            return subplots;
            
        } catch (error) {
            console.error('Subplot generation error:', error);
            return []; // Return empty array on error
        }
    }
    
    /**
     * Generate Environmental Factors
     */
    generateEnvironmentalFactors() {
        try {
            const weather = this.tablesEngine.rollTable('weather-conditions');
            const terrain = this.tablesEngine.rollTable('terrain-features');
            
            return {
                weather: weather.value,
                terrain: terrain.value,
                visibility: this.generateVisibility(),
                temperature: this.generateTemperature(),
                specialConditions: this.generateSpecialConditions()
            };
            
        } catch (error) {
            console.error('Environmental factors generation error:', error);
            return {
                weather: 'Clear skies',
                terrain: 'Open plains',
                visibility: 'Normal',
                temperature: 'Moderate',
                specialConditions: 'None'
            };
        }
    }
    
    /**
     * Generate Adventure ID
     */
    generateAdventureId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `adv_${timestamp}_${random}`;
    }
    
    /**
     * Utility Methods for Adventure Generation
     */
    
    determineTheme(location) {
        const themes = ['mystery', 'exploration', 'political', 'survival', 'magical', 'horror'];
        return themes[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateAtmosphere() {
        const atmospheres = ['tense', 'mysterious', 'foreboding', 'exciting', 'peaceful', 'chaotic'];
        return atmospheres[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateLocationFeatures() {
        const features = ['ancient ruins', 'hidden passages', 'magical anomalies', 'natural hazards', 'strategic positions', 'resource deposits'];
        return features[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateWeather() {
        const weatherTypes = ['clear', 'cloudy', 'rainy', 'stormy', 'foggy', 'windy'];
        return weatherTypes[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateTimeOfDay() {
        const times = ['dawn', 'morning', 'midday', 'afternoon', 'dusk', 'night'];
        return times[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateSeason() {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        return seasons[this.diceEngine.rollExpression('1d4').total - 1];
    }
    
    generateAdventureBackground() {
        return this.tablesEngine.rollTable('dungeon-theme').value;
    }
    
    generateMotivation(adventureType) {
        const motivations = ['rescue', 'treasure', 'revenge', 'discovery', 'protection', 'glory'];
        return motivations[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateUrgency() {
        const urgencies = ['immediate', 'soon', 'moderate', 'eventual'];
        return urgencies[this.diceEngine.rollExpression('1d4').total - 1];
    }
    
    generateStakes() {
        const stakes = ['personal', 'local', 'regional', 'national', 'global', 'cosmic'];
        return stakes[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generatePersonalConnection() {
        const connections = ['family', 'friend', 'mentor', 'rival', 'employer', 'stranger'];
        return connections[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateEncounterEnvironment() {
        return this.tablesEngine.rollTable('terrain-features').value;
    }
    
    generateEncounterTactics() {
        const tactics = ['ambush', 'direct assault', 'defensive', 'hit-and-run', 'psychological', 'magical'];
        return tactics[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateEncounterConsequences() {
        const consequences = ['reputation change', 'resource loss', 'information gained', 'ally made', 'enemy created', 'location revealed'];
        return consequences[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateClimaxRewards(partyLevel, scaling) {
        const rewards = this.generateEncounterRewards(partyLevel, scaling);
        // Double the rewards for climax encounters
        return rewards.map(reward => ({
            ...reward,
            value: reward.value * 2,
            description: `Epic ${reward.description}`
        }));
    }
    
    determineNPCRole(index, total) {
        if (index === 0) return 'primary';
        if (index === total - 1) return 'antagonist';
        return 'supporting';
    }
    
    generateNPCAttitude() {
        const attitudes = ['friendly', 'neutral', 'hostile', 'suspicious', 'helpful', 'indifferent'];
        return attitudes[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateNPCMotivation() {
        const motivations = ['power', 'wealth', 'love', 'revenge', 'knowledge', 'survival'];
        return motivations[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateNPCSecrets() {
        const secrets = ['hidden identity', 'dark past', 'secret mission', 'forbidden knowledge', 'tragic loss', 'hidden agenda'];
        return secrets[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateNPCRelationship() {
        const relationships = ['ally', 'enemy', 'neutral', 'informant', 'patron', 'rival'];
        return relationships[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    scaleNPCPower(partyLevel) {
        return Math.max(1, partyLevel + this.diceEngine.rollExpression('1d4').total - 2);
    }
    
    categorizeLocation(description) {
        // Safety check for undefined description
        if (!description || typeof description !== 'string') {
            return 'general';
        }
        
        if (description.toLowerCase().includes('dungeon') || description.toLowerCase().includes('cave')) {
            return 'underground';
        } else if (description.toLowerCase().includes('forest') || description.toLowerCase().includes('wilderness')) {
            return 'wilderness';
        } else if (description.toLowerCase().includes('city') || description.toLowerCase().includes('town')) {
            return 'urban';
        } else {
            return 'general';
        }
    }
    
    generateLocationAccessibility() {
        const accessibility = ['easy', 'moderate', 'difficult', 'hidden', 'trapped', 'magical'];
        return accessibility[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateLocationHazards() {
        const hazards = ['none', 'environmental', 'magical', 'trapped', 'guarded', 'cursed'];
        return hazards[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateLocationSecrets() {
        const secrets = ['hidden treasure', 'secret passage', 'ancient history', 'magical properties', 'strategic value', 'dark secret'];
        return secrets[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateLocationConnections() {
        return `connects to ${Math.floor(Math.random() * 3) + 1} other locations`;
    }
    
    categorizeTreasure(description) {
        // Ensure description is a string
        if (!description || typeof description !== 'string') {
            return 'general';
        }
        
        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes('gold') || lowerDesc.includes('coin')) {
            return 'currency';
        } else if (lowerDesc.includes('weapon') || lowerDesc.includes('armor')) {
            return 'equipment';
        } else if (lowerDesc.includes('magic') || lowerDesc.includes('potion')) {
            return 'magical';
        } else {
            return 'general';
        }
    }
    
    calculateTreasureValue(partyLevel, scaling) {
        const baseValue = 100;
        return Math.floor(baseValue * partyLevel * scaling.treasureMultiplier);
    }
    
    assignTreasureLocation() {
        const locations = ['encounter reward', 'hidden cache', 'NPC possession', 'location feature', 'quest completion', 'random discovery'];
        return locations[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateTreasureProtection() {
        const protections = ['none', 'lock', 'trap', 'guardian', 'puzzle', 'magic ward'];
        return protections[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateTreasureCurse() {
        const roll = this.diceEngine.rollExpression('1d10').total;
        if (roll <= 7) return 'none';
        const curses = ['minor curse', 'major curse', 'beneficial curse'];
        return curses[Math.floor(Math.random() * 3)];
    }
    
    generateComplicationSeverity() {
        const severities = ['minor', 'moderate', 'major', 'critical'];
        return severities[this.diceEngine.rollExpression('1d4').total - 1];
    }
    
    generateComplicationTiming() {
        const timings = ['immediate', 'early', 'middle', 'late', 'climax', 'resolution'];
        return timings[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateComplicationResolution() {
        const resolutions = ['combat', 'negotiation', 'stealth', 'magic', 'skill check', 'sacrifice'];
        return resolutions[this.diceEngine.rollExpression('1d6').total - 1];
    }
    
    generateTwistTiming() {
        const timings = ['early revelation', 'midpoint surprise', 'climax shock', 'resolution twist'];
        return timings[this.diceEngine.rollExpression('1d4').total - 1];
    }
    
    generateTwistSeverity() {
        const severities = ['minor', 'significant', 'major', 'campaign-changing'];
        return severities[this.diceEngine.rollExpression('1d4').total - 1];
    }
    
    generateSubplotImportance() {
        const importance = ['background flavor', 'minor plot thread', 'significant storyline', 'major campaign arc'];
        return importance[this.diceEngine.rollExpression('1d4').total - 1];
    }
    
    generateSubplotConnection() {
        const connections = ['tangentially related', 'directly connected', 'parallel development', 'contrasting theme'];
        return connections[this.diceEngine.rollExpression('1d4').total - 1];
    }
    
    generateVisibility() {
        const visibility = ['clear', 'light obscuration', 'heavy obscuration', 'magical darkness'];
        return visibility[this.diceEngine.rollExpression('1d4').total - 1];
    }
    
    generateTemperature() {
        const temperatures = ['frigid', 'cold', 'cool', 'moderate', 'warm', 'hot', 'scorching'];
        return temperatures[Math.floor(Math.random() * 7)];
    }
    
    generateSpecialConditions() {
        const roll = this.diceEngine.rollExpression('1d10').total;
        if (roll <= 6) return 'none';
        const conditions = ['magical effect', 'temporal anomaly', 'planar influence', 'divine presence'];
        return conditions[this.diceEngine.rollExpression('1d4').total - 1];
    }
    
    categorizeEncounter(description) {
        // Safety check for undefined description
        if (!description || typeof description !== 'string') {
            return 'general';
        }
        
        if (description.toLowerCase().includes('combat') || description.toLowerCase().includes('fight')) {
            return 'combat';
        } else if (description.toLowerCase().includes('trap') || description.toLowerCase().includes('puzzle')) {
            return 'trap';
        } else if (description.toLowerCase().includes('social') || description.toLowerCase().includes('negotiate')) {
            return 'social';
        } else {
            return 'general';
        }
    }
    
    scaleEncounterDifficulty(baseDifficulty, encounterIndex, totalEncounters) {
        if (encounterIndex === totalEncounters - 1) return 'climactic';
        if (encounterIndex === 0) return 'easy';
        return baseDifficulty;
    }
    
    estimateEncounterDuration(partyLevel) {
        return Math.max(15, 30 + (partyLevel * 5)); // minutes
    }
    
    generateEncounterRewards(partyLevel, scaling) {
        const rewardCount = Math.floor(1 + (partyLevel / 3) * scaling.treasureMultiplier);
        const rewards = [];
        
        for (let i = 0; i < rewardCount; i++) {
            rewards.push({
                type: 'treasure',
                description: 'Minor treasure',
                value: Math.floor(50 * partyLevel * scaling.treasureMultiplier)
            });
        }
        
        return rewards;
    }
    
    calculateExperience(encounter) {
        const baseXP = 100;
        const difficultyMultipliers = {
            trivial: 0.5,
            easy: 0.75,
            moderate: 1.0,
            challenging: 1.5,
            hard: 2.0,
            climactic: 3.0
        };
        
        return Math.floor(baseXP * (difficultyMultipliers[encounter.difficulty] || 1.0));
    }
    
    /**
     * Get Adventure Statistics
     */
    getStatistics() {
        return {
            ...this.stats,
            currentAdventureId: this.currentAdventure?.id,
            currentAdventureProgress: this.currentAdventure?.progress
        };
    }
    
    /**
     * Get Current Adventure
     */
    getCurrentAdventure() {
        return this.currentAdventure;
    }
    
    /**
     * Save Adventure Progress
     */
    async saveAdventureProgress() {
        if (this.currentAdventure && this.storageManager) {
            try {
                // Save adventure to storage
                const adventureKey = `adventure_${this.currentAdventure.id}`;
                await this.storageManager.saveData(adventureKey, this.currentAdventure);
                console.log('💾 Adventure progress saved');
            } catch (error) {
                console.error('Failed to save adventure progress:', error);
            }
        }
    }
    
    /**
     * Load Adventure Progress
     */
    async loadAdventure(adventureId) {
        if (this.storageManager) {
            try {
                const adventureKey = `adventure_${adventureId}`;
                const adventure = await this.storageManager.loadData(adventureKey);
                if (adventure) {
                    this.currentAdventure = adventure;
                    console.log('📁 Adventure loaded:', adventureId);
                    return adventure;
                }
            } catch (error) {
                console.error('Failed to load adventure:', error);
            }
        }
        return null;
    }
}

// Export for Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdventureEngine;
}

/**
 * NarrativeAdventureSystem - Dynamic Storytelling Engine for D&D 3.5 Adventures
 * 
 * Advanced narrative system featuring:
 * - Dynamic story generation with branching narratives
 * - Character-driven plot development and personalized storylines
 * - Interactive dialogue system with NPC personality AI
 * - Quest management with procedural and scripted content
 * - Campaign continuity tracking and world state management
 * - Adaptive difficulty scaling based on party composition
 * - Integration with character progression and equipment systems
 * - Multi-threading story elements and parallel plot lines
 * - Rich environmental storytelling and atmospheric descriptions
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class NarrativeAdventureSystem {
    constructor(characterSystem, worldState, adventureEngine) {
        this.characterSystem = characterSystem;
        this.worldState = worldState;
        this.adventureEngine = adventureEngine;
        
        // Narrative configuration
        this.config = {
            storyComplexity: 'medium', // simple, medium, complex, epic
            adaptiveDifficulty: true,
            personalizedContent: true,
            narrativeStyle: 'classic_fantasy', // classic_fantasy, dark_fantasy, heroic, gritty
            branchingFactor: 3, // Number of choices per decision point
            maxConcurrentPlots: 5,
            storyPersistence: true
        };
        
        // Story generation templates
        this.storyTemplates = {
            'classic_hero_journey': {
                name: 'Classic Hero\'s Journey',
                description: 'Traditional hero\'s journey with call to adventure',
                phases: ['call_to_adventure', 'refusal_of_call', 'meeting_mentor', 'crossing_threshold', 'tests_trials', 'revelation', 'transformation', 'return_triumph'],
                archetypes: ['hero', 'mentor', 'threshold_guardian', 'ally', 'shapeshifter', 'shadow', 'trickster'],
                themes: ['courage', 'sacrifice', 'growth', 'redemption']
            },
            'political_intrigue': {
                name: 'Political Intrigue',
                description: 'Complex political maneuvering and court intrigue',
                phases: ['initial_incident', 'investigation', 'alliance_building', 'betrayal', 'revelation', 'confrontation', 'resolution'],
                archetypes: ['noble', 'spy', 'diplomat', 'conspirator', 'innocent', 'power_broker'],
                themes: ['power', 'loyalty', 'betrayal', 'justice']
            },
            'dungeon_delve': {
                name: 'Classic Dungeon Delve',
                description: 'Exploration of dangerous underground complexes',
                phases: ['discovery', 'preparation', 'entry', 'exploration', 'guardian_encounter', 'treasure_chamber', 'escape_complications'],
                archetypes: ['guardian', 'prisoner', 'mad_wizard', 'undead_lord', 'trapped_spirit'],
                themes: ['exploration', 'courage', 'greed', 'ancient_secrets']
            },
            'planar_adventure': {
                name: 'Planar Adventure',
                description: 'Epic adventures across multiple planes of existence',
                phases: ['planar_breach', 'plane_exploration', 'planar_politics', 'cosmic_threat', 'planar_war', 'reality_shaping'],
                archetypes: ['planar_native', 'cosmic_entity', 'planar_refugee', 'dimension_guardian', 'reality_shaper'],
                themes: ['cosmic_balance', 'reality', 'transcendence', 'ultimate_power']
            }
        };
        
        // Narrative elements
        this.narrativeElements = {
            plotHooks: new Map(),
            activeStorylines: new Map(),
            characterArcs: new Map(),
            worldEvents: new Map(),
            questChains: new Map()
        };
        
        // NPC personality system
        this.npcPersonalities = {
            traits: ['brave', 'cowardly', 'greedy', 'noble', 'cunning', 'naive', 'wise', 'foolish', 'loyal', 'treacherous'],
            motivations: ['power', 'wealth', 'knowledge', 'love', 'revenge', 'survival', 'duty', 'freedom', 'glory', 'redemption'],
            speechPatterns: ['formal', 'casual', 'archaic', 'scholarly', 'street_smart', 'mystical', 'militaristic', 'poetic']
        };
        
        // Story state tracking
        this.storyState = {
            currentChapter: 1,
            activeNarratives: new Set(),
            completedArcs: new Set(),
            worldChanges: [],
            characterRelationships: new Map(),
            reputationSystem: new Map()
        };
        
        // Event system for story progression
        this.eventBus = {
            listeners: new Map(),
            emit: (event, data) => this.handleStoryEvent(event, data),
            on: (event, callback) => this.addStoryListener(event, callback)
        };
        
        console.log('📚 Narrative Adventure System initialized with dynamic storytelling');
    }

    /**
     * Initialize the narrative system
     */
    async initialize() {
        console.log('📚 Initializing Narrative Adventure System');
        
        try {
            // Load story templates and resources
            await this.loadStoryResources();
            
            // Initialize world state tracking
            this.initializeWorldState();
            
            // Set up NPC generation system
            this.initializeNPCSystem();
            
            // Initialize quest management
            this.initializeQuestSystem();
            
            // Set up story event handlers
            this.setupStoryEventHandlers();
            
            console.log('✅ Narrative Adventure System initialized');
            
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize Narrative Adventure System:', error);
            throw error;
        }
    }

    /**
     * Generate a new adventure based on party composition and preferences
     */
    async generateAdventure(party, preferences = {}) {
        console.log(`📚 Generating adventure for party of ${party.length} characters`);
        
        const adventureSpec = {
            partyLevel: this.calculateAveragePartyLevel(party),
            partySize: party.length,
            partyClasses: party.map(char => char.characterClass),
            preferences: {
                template: preferences.template || this.selectAppropriateTemplate(party),
                complexity: preferences.complexity || this.config.storyComplexity,
                duration: preferences.duration || 'medium', // short, medium, long, campaign
                themes: preferences.themes || this.analyzePartyThemes(party)
            }
        };
        
        try {
            // Generate main storyline
            const mainStoryline = await this.generateMainStoryline(adventureSpec);
            
            // Create character-specific subplots
            const characterArcs = await this.generateCharacterArcs(party, mainStoryline);
            
            // Generate supporting NPCs
            const npcs = await this.generateStoryNPCs(mainStoryline, party);
            
            // Create quest structure
            const questStructure = await this.generateQuestStructure(mainStoryline, characterArcs);
            
            // Generate environmental narratives
            const environments = await this.generateEnvironmentalNarratives(mainStoryline);
            
            const adventure = {
                id: `adventure_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: mainStoryline.title,
                description: mainStoryline.description,
                template: adventureSpec.preferences.template,
                
                // Core narrative structure
                mainStoryline: mainStoryline,
                characterArcs: characterArcs,
                questStructure: questStructure,
                
                // Supporting elements
                npcs: npcs,
                environments: environments,
                
                // Dynamic elements
                activeChoices: [],
                storyState: 'beginning',
                worldChanges: [],
                
                // Metadata
                targetParty: party.map(char => char.id),
                createdAt: new Date().toISOString(),
                estimatedDuration: this.estimateAdventureDuration(questStructure),
                difficultyRating: this.calculateDifficultyRating(adventureSpec)
            };
            
            // Register adventure in system
            this.narrativeElements.activeStorylines.set(adventure.id, adventure);
            
            console.log(`✅ Generated adventure: "${adventure.title}"`);
            console.log(`   Template: ${adventure.template}`);
            console.log(`   Estimated Duration: ${adventure.estimatedDuration}`);
            console.log(`   Character Arcs: ${adventure.characterArcs.length}`);
            console.log(`   NPCs: ${adventure.npcs.length}`);
            
            return adventure;
            
        } catch (error) {
            console.error('❌ Failed to generate adventure:', error);
            throw error;
        }
    }

    /**
     * Generate main storyline based on template and party
     */
    async generateMainStoryline(adventureSpec) {
        const template = this.storyTemplates[adventureSpec.preferences.template];
        
        const storyline = {
            title: await this.generateStoryTitle(template, adventureSpec),
            description: await this.generateStoryDescription(template, adventureSpec),
            template: adventureSpec.preferences.template,
            
            // Story structure
            acts: await this.generateStoryActs(template, adventureSpec),
            themes: template.themes,
            archetypes: template.archetypes,
            
            // Dynamic elements
            branchingPoints: await this.generateBranchingPoints(template, adventureSpec),
            climaxOptions: await this.generateClimaxOptions(template, adventureSpec),
            
            // Adaptive content
            scalingMechanics: await this.generateScalingMechanics(adventureSpec),
            personalizedHooks: await this.generatePersonalizedHooks(adventureSpec)
        };
        
        return storyline;
    }

    /**
     * Generate character-specific story arcs
     */
    async generateCharacterArcs(party, mainStoryline) {
        const characterArcs = [];
        
        for (const character of party) {
            console.log(`Creating character arc for ${character.name}`);
            
            const arc = {
                characterId: character.id,
                characterName: character.name,
                arcType: this.determineArcType(character, mainStoryline),
                
                // Arc progression
                personalConflict: await this.generatePersonalConflict(character),
                growthOpportunities: await this.generateGrowthOpportunities(character),
                relationshipDynamics: await this.generateRelationshipDynamics(character, party),
                
                // Integration with main story
                connectionPoints: await this.findStoryConnectionPoints(character, mainStoryline),
                specialMoments: await this.generateSpecialMoments(character, mainStoryline),
                
                // Character development
                skillChallenges: await this.generateSkillChallenges(character),
                moralDilemmas: await this.generateMoralDilemmas(character),
                
                // Arc resolution
                possibleOutcomes: await this.generateArcOutcomes(character, mainStoryline)
            };
            
            characterArcs.push(arc);
            this.narrativeElements.characterArcs.set(character.id, arc);
        }
        
        return characterArcs;
    }

    /**
     * Generate intelligent NPCs with personalities and motivations
     */
    async generateStoryNPCs(storyline, party) {
        const npcs = [];
        
        // Generate major NPCs for each archetype
        for (const archetype of storyline.archetypes) {
            const npc = await this.generateArchetypeNPC(archetype, storyline, party);
            npcs.push(npc);
        }
        
        // Generate supporting NPCs
        const supportingNPCs = await this.generateSupportingNPCs(storyline, party);
        npcs.push(...supportingNPCs);
        
        return npcs;
    }

    /**
     * Generate NPC with personality and AI behavior
     */
    async generateArchetypeNPC(archetype, storyline, party) {
        const personality = {
            traits: this.selectRandomTraits(3),
            motivations: this.selectRandomMotivations(2),
            speechPattern: this.selectRandomSpeechPattern(),
            relationshipToParty: this.determineInitialRelationship(archetype, party)
        };
        
        const npc = {
            id: `npc_${archetype}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: await this.generateNPCName(archetype, personality),
            archetype: archetype,
            personality: personality,
            
            // Physical and social attributes
            race: await this.selectAppropriateRace(archetype, storyline),
            class: await this.selectAppropriateClass(archetype, storyline),
            level: this.calculateNPCLevel(archetype, party),
            
            // Story role
            storyRole: await this.defineStoryRole(archetype, storyline),
            plotImportance: this.calculatePlotImportance(archetype),
            
            // AI behavior system
            behaviorTree: await this.generateNPCBehaviorTree(archetype, personality),
            dialoguePatterns: await this.generateDialoguePatterns(personality),
            relationshipRules: await this.generateRelationshipRules(personality),
            
            // Dynamic state
            currentMood: 'neutral',
            relationshipScores: new Map(),
            questsGiven: [],
            secretsKnown: await this.generateNPCSecrets(archetype, storyline),
            
            // Interaction history
            conversationHistory: [],
            actionHistory: [],
            reputationModifiers: new Map()
        };
        
        return npc;
    }

    /**
     * Process story choices and advance narrative
     */
    async processStoryChoice(adventure, choiceId, selectedOption) {
        console.log(`📚 Processing story choice: ${choiceId} -> ${selectedOption}`);
        
        try {
            // Find the choice in the adventure
            const choice = adventure.activeChoices.find(c => c.id === choiceId);
            if (!choice) {
                throw new Error(`Choice ${choiceId} not found`);
            }
            
            // Get the selected option details
            const option = choice.options.find(o => o.id === selectedOption);
            if (!option) {
                throw new Error(`Option ${selectedOption} not found for choice ${choiceId}`);
            }
            
            // Apply choice consequences
            const consequences = await this.applyChoiceConsequences(adventure, choice, option);
            
            // Update story state
            adventure.storyState = await this.updateStoryState(adventure, choice, option);
            
            // Generate next story beats
            const nextBeats = await this.generateNextStoryBeats(adventure, consequences);
            
            // Update character relationships
            await this.updateCharacterRelationships(adventure, choice, option);
            
            // Update world state
            await this.updateWorldState(adventure, consequences);
            
            // Generate new choices
            adventure.activeChoices = await this.generateNewChoices(adventure, nextBeats);
            
            // Emit story progression event
            this.eventBus.emit('storyProgression', {
                adventure: adventure,
                choice: choice,
                option: option,
                consequences: consequences,
                nextBeats: nextBeats
            });
            
            console.log(`✅ Story choice processed, generated ${nextBeats.length} new story beats`);
            
            return {
                consequences: consequences,
                nextBeats: nextBeats,
                newChoices: adventure.activeChoices,
                updatedState: adventure.storyState
            };
            
        } catch (error) {
            console.error('❌ Failed to process story choice:', error);
            throw error;
        }
    }

    /**
     * Generate dynamic narrative content based on current state
     */
    async generateNarrativeContent(adventure, context = {}) {
        console.log('📚 Generating dynamic narrative content');
        
        const content = {
            // Scene description
            sceneDescription: await this.generateSceneDescription(adventure, context),
            
            // Character reactions
            characterReactions: await this.generateCharacterReactions(adventure, context),
            
            // Environmental details
            environmentalDetails: await this.generateEnvironmentalDetails(adventure, context),
            
            // NPC interactions
            npcInteractions: await this.generateNPCInteractions(adventure, context),
            
            // Atmospheric elements
            atmosphere: await this.generateAtmosphere(adventure, context),
            
            // Foreshadowing and callbacks
            narrativeConnections: await this.generateNarrativeConnections(adventure, context)
        };
        
        return content;
    }

    /**
     * Manage NPC dialogue and interactions
     */
    async handleNPCDialogue(npc, party, conversationContext) {
        console.log(`💬 Handling dialogue with ${npc.name}`);
        
        // Analyze conversation context
        const contextAnalysis = await this.analyzeConversationContext(npc, party, conversationContext);
        
        // Generate appropriate response based on personality and state
        const response = await this.generateNPCResponse(npc, contextAnalysis);
        
        // Update NPC state based on interaction
        await this.updateNPCState(npc, party, response);
        
        // Check for triggered events or revelations
        const triggeredEvents = await this.checkTriggeredEvents(npc, party, response);
        
        // Update conversation history
        npc.conversationHistory.push({
            timestamp: new Date().toISOString(),
            context: conversationContext,
            response: response,
            partyMembers: party.map(char => char.id)
        });
        
        return {
            response: response,
            npcState: {
                mood: npc.currentMood,
                relationshipScores: Object.fromEntries(npc.relationshipScores)
            },
            triggeredEvents: triggeredEvents
        };
    }

    /**
     * Track and manage campaign continuity
     */
    async manageCampaignContinuity(adventures, worldState) {
        console.log('🌍 Managing campaign continuity');
        
        const continuityData = {
            // Cross-adventure connections
            narrativeThreads: await this.trackNarrativeThreads(adventures),
            
            // Character development across adventures
            characterProgression: await this.trackCharacterProgression(adventures),
            
            // World state evolution
            worldChanges: await this.trackWorldChanges(adventures, worldState),
            
            // NPC continuity
            npcEvolution: await this.trackNPCEvolution(adventures),
            
            // Reputation and relationship systems
            reputationSystems: await this.updateReputationSystems(adventures),
            
            // Foreshadowing and payoff tracking
            foreshadowingElements: await this.trackForeshadowing(adventures)
        };
        
        return continuityData;
    }

    // ===== UTILITY METHODS =====

    calculateAveragePartyLevel(party) {
        return Math.round(party.reduce((sum, char) => sum + char.level, 0) / party.length);
    }

    selectAppropriateTemplate(party) {
        const avgLevel = this.calculateAveragePartyLevel(party);
        const partyClasses = party.map(char => char.characterClass);
        
        if (avgLevel >= 15) return 'planar_adventure';
        if (partyClasses.includes('Rogue') || partyClasses.includes('Bard')) return 'political_intrigue';
        if (partyClasses.includes('Fighter') || partyClasses.includes('Paladin')) return 'classic_hero_journey';
        
        return 'dungeon_delve';
    }

    analyzePartyThemes(party) {
        const themes = [];
        const classes = party.map(char => char.characterClass);
        
        if (classes.includes('Paladin') || classes.includes('Cleric')) themes.push('good_vs_evil');
        if (classes.includes('Rogue') || classes.includes('Ranger')) themes.push('survival');
        if (classes.includes('Wizard') || classes.includes('Sorcerer')) themes.push('knowledge_power');
        if (classes.includes('Barbarian') || classes.includes('Fighter')) themes.push('strength_courage');
        
        return themes.length > 0 ? themes : ['adventure', 'heroism'];
    }

    selectRandomTraits(count) {
        const traits = [...this.npcPersonalities.traits];
        const selected = [];
        
        for (let i = 0; i < count && traits.length > 0; i++) {
            const index = Math.floor(Math.random() * traits.length);
            selected.push(traits.splice(index, 1)[0]);
        }
        
        return selected;
    }

    selectRandomMotivations(count) {
        const motivations = [...this.npcPersonalities.motivations];
        const selected = [];
        
        for (let i = 0; i < count && motivations.length > 0; i++) {
            const index = Math.floor(Math.random() * motivations.length);
            selected.push(motivations.splice(index, 1)[0]);
        }
        
        return selected;
    }

    selectRandomSpeechPattern() {
        const patterns = this.npcPersonalities.speechPatterns;
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    /**
     * Get narrative system status
     */
    getNarrativeStatus() {
        return {
            activeStorylines: this.narrativeElements.activeStorylines.size,
            activeCharacterArcs: this.narrativeElements.characterArcs.size,
            worldEvents: this.narrativeElements.worldEvents.size,
            questChains: this.narrativeElements.questChains.size,
            storyState: this.storyState,
            systemConfig: this.config
        };
    }
}

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NarrativeAdventureSystem;
} else if (typeof window !== 'undefined') {
    window.NarrativeAdventureSystem = NarrativeAdventureSystem;
}
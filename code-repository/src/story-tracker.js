/**
 * D&D 3.5 Story Tracker & Backstory System
 * Manages character backgrounds, relationships, goals, achievements, and narrative progression
 * Tracks character development throughout campaigns with timeline and relationship mapping
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class StoryTracker {
    constructor() {
        this.characters = new Map();
        this.campaigns = new Map();
        this.timelines = new Map();
        this.relationships = new Map();
        this.achievements = new Map();
        
        this.initializeStoryTemplates();
        this.initializeRelationshipTypes();
        this.initializeAchievementCategories();
        
        console.log('📖 Story Tracker initialized');
    }
    
    /**
     * Create or update character backstory
     */
    createCharacterStory(characterId, storyData) {
        const story = {
            characterId,
            personalityTraits: storyData.personalityTraits || [],
            ideals: storyData.ideals || [],
            bonds: storyData.bonds || [],
            flaws: storyData.flaws || [],
            background: {
                origin: storyData.background?.origin || '',
                family: storyData.background?.family || {},
                hometown: storyData.background?.hometown || '',
                education: storyData.background?.education || '',
                profession: storyData.background?.profession || '',
                significantEvents: storyData.background?.significantEvents || []
            },
            goals: {
                shortTerm: storyData.goals?.shortTerm || [],
                longTerm: storyData.goals?.longTerm || [],
                lifeGoals: storyData.goals?.lifeGoals || []
            },
            timeline: [],
            relationships: new Map(),
            secrets: storyData.secrets || [],
            fears: storyData.fears || [],
            motivations: storyData.motivations || [],
            reputation: {
                organizations: new Map(),
                locations: new Map(),
                general: 0
            },
            memoryPalace: new Map(), // Important memories and their emotional impact
            characterArcs: [], // Major story arcs for this character
            createdAt: new Date(),
            lastUpdated: new Date()
        };
        
        this.characters.set(characterId, story);
        
        // Create initial timeline entry
        this.addTimelineEvent(characterId, {
            type: 'character_creation',
            title: 'Character Created',
            description: 'Character backstory established',
            date: new Date(),
            importance: 'medium',
            emotional_impact: 'neutral'
        });
        
        console.log(`📖 Created story for character ${characterId}`);
        return story;
    }
    
    /**
     * Add event to character timeline
     */
    addTimelineEvent(characterId, event) {
        const story = this.characters.get(characterId);
        if (!story) {
            throw new Error(`Character ${characterId} not found in story tracker`);
        }
        
        const timelineEvent = {
            id: this.generateEventId(),
            characterId,
            type: event.type || 'general',
            title: event.title,
            description: event.description,
            date: event.date || new Date(),
            location: event.location || '',
            npcsInvolved: event.npcsInvolved || [],
            importance: event.importance || 'medium', // low, medium, high, critical
            emotional_impact: event.emotional_impact || 'neutral', // very_negative, negative, neutral, positive, very_positive
            consequences: event.consequences || [],
            tags: event.tags || [],
            relatedGoals: event.relatedGoals || [],
            campaignId: event.campaignId || null,
            sessionNumber: event.sessionNumber || null,
            notes: event.notes || ''
        };
        
        story.timeline.push(timelineEvent);
        story.timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
        story.lastUpdated = new Date();
        
        // Update character development based on event
        this.processCharacterDevelopment(characterId, timelineEvent);
        
        console.log(`📖 Added timeline event: ${event.title}`);
        return timelineEvent;
    }
    
    /**
     * Add or update relationship
     */
    addRelationship(characterId, relationshipData) {
        const story = this.characters.get(characterId);
        if (!story) {
            throw new Error(`Character ${characterId} not found`);
        }
        
        const relationship = {
            id: relationshipData.id || this.generateRelationshipId(),
            targetId: relationshipData.targetId,
            targetName: relationshipData.targetName,
            type: relationshipData.type || 'acquaintance', // enemy, rival, acquaintance, friend, ally, family, romantic, mentor, student
            strength: relationshipData.strength || 1, // 1-10 scale
            status: relationshipData.status || 'active', // active, inactive, deceased, unknown
            description: relationshipData.description || '',
            history: relationshipData.history || [],
            secrets_known: relationshipData.secrets_known || [],
            trust_level: relationshipData.trust_level || 5, // 1-10 scale
            influence: relationshipData.influence || 0, // -10 to +10 (negative = they hate you, positive = they help you)
            first_met: relationshipData.first_met || new Date(),
            last_interaction: relationshipData.last_interaction || new Date(),
            tags: relationshipData.tags || [],
            notes: relationshipData.notes || ''
        };
        
        story.relationships.set(relationship.id, relationship);
        story.lastUpdated = new Date();
        
        console.log(`📖 Added relationship: ${relationship.targetName} (${relationship.type})`);
        return relationship;
    }
    
    /**
     * Track goal progression
     */
    updateGoalProgress(characterId, goalId, progressData) {
        const story = this.characters.get(characterId);
        if (!story) {
            throw new Error(`Character ${characterId} not found`);
        }
        
        // Find goal in any category
        let goal = null;
        let goalCategory = null;
        
        ['shortTerm', 'longTerm', 'lifeGoals'].forEach(category => {
            const foundGoal = story.goals[category].find(g => g.id === goalId);
            if (foundGoal) {
                goal = foundGoal;
                goalCategory = category;
            }
        });
        
        if (!goal) {
            throw new Error(`Goal ${goalId} not found`);
        }
        
        // Update goal progress
        goal.progress = progressData.progress || goal.progress || 0;
        goal.status = progressData.status || goal.status || 'in_progress';
        goal.lastUpdated = new Date();
        
        if (progressData.notes) {
            if (!goal.progressNotes) goal.progressNotes = [];
            goal.progressNotes.push({
                date: new Date(),
                note: progressData.notes,
                progress: goal.progress
            });
        }
        
        // Add timeline event for significant progress
        if (progressData.progress >= 100 || progressData.status === 'completed') {
            this.addTimelineEvent(characterId, {
                type: 'goal_completed',
                title: `Goal Completed: ${goal.title}`,
                description: goal.description,
                importance: goalCategory === 'lifeGoals' ? 'critical' : 'high',
                emotional_impact: 'very_positive',
                relatedGoals: [goalId]
            });
        }
        
        story.lastUpdated = new Date();
        
        console.log(`📖 Updated goal progress: ${goal.title} (${goal.progress}%)`);
        return goal;
    }
    
    /**
     * Add achievement or milestone
     */
    addAchievement(characterId, achievementData) {
        const story = this.characters.get(characterId);
        if (!story) {
            throw new Error(`Character ${characterId} not found`);
        }
        
        const achievement = {
            id: achievementData.id || this.generateAchievementId(),
            category: achievementData.category || 'general',
            title: achievementData.title,
            description: achievementData.description,
            date: achievementData.date || new Date(),
            rarity: achievementData.rarity || 'common', // common, uncommon, rare, legendary, mythic
            points: achievementData.points || 0,
            prerequisites: achievementData.prerequisites || [],
            rewards: achievementData.rewards || [],
            hidden: achievementData.hidden || false,
            campaignSpecific: achievementData.campaignSpecific || false,
            relatedEvents: achievementData.relatedEvents || [],
            witnesses: achievementData.witnesses || [],
            evidence: achievementData.evidence || []
        };
        
        if (!this.achievements.has(characterId)) {
            this.achievements.set(characterId, []);
        }
        
        this.achievements.get(characterId).push(achievement);
        
        // Add timeline event
        this.addTimelineEvent(characterId, {
            type: 'achievement',
            title: `Achievement Unlocked: ${achievement.title}`,
            description: achievement.description,
            importance: this.getImportanceFromRarity(achievement.rarity),
            emotional_impact: 'very_positive'
        });
        
        console.log(`📖 Achievement unlocked: ${achievement.title} (${achievement.rarity})`);
        return achievement;
    }
    
    /**
     * Create campaign connection
     */
    createCampaignStory(campaignId, campaignData) {
        const campaign = {
            id: campaignId,
            name: campaignData.name,
            description: campaignData.description || '',
            setting: campaignData.setting || '',
            startDate: campaignData.startDate || new Date(),
            currentDate: campaignData.currentDate || new Date(),
            characters: new Set(),
            majorEvents: [],
            plotThreads: [],
            organizations: new Map(),
            locations: new Map(),
            npcs: new Map(),
            themes: campaignData.themes || [],
            tone: campaignData.tone || 'balanced', // dark, serious, balanced, light, comedic
            status: 'active', // planning, active, hiatus, completed, archived
            sessions: []
        };
        
        this.campaigns.set(campaignId, campaign);
        
        console.log(`📖 Created campaign story: ${campaign.name}`);
        return campaign;
    }
    
    /**
     * Add character to campaign
     */
    addCharacterToCampaign(characterId, campaignId) {
        const campaign = this.campaigns.get(campaignId);
        const story = this.characters.get(characterId);
        
        if (!campaign) {
            throw new Error(`Campaign ${campaignId} not found`);
        }
        
        if (!story) {
            throw new Error(`Character ${characterId} not found`);
        }
        
        campaign.characters.add(characterId);
        
        // Add campaign introduction event
        this.addTimelineEvent(characterId, {
            type: 'campaign_start',
            title: `Joined Campaign: ${campaign.name}`,
            description: 'Character begins their adventure',
            campaignId,
            importance: 'high',
            emotional_impact: 'positive'
        });
        
        console.log(`📖 Added character ${characterId} to campaign ${campaign.name}`);
    }
    
    /**
     * Process character development based on events
     */
    processCharacterDevelopment(characterId, event) {
        const story = this.characters.get(characterId);
        if (!story) return;
        
        // Analyze event for character growth opportunities
        const developmentSuggestions = this.analyzeEventForDevelopment(event, story);
        
        // Auto-update reputation based on event type
        this.updateReputation(characterId, event);
        
        // Check for trauma or positive growth
        this.checkEmotionalImpact(characterId, event);
        
        // Update relationship dynamics
        this.updateRelationshipsFromEvent(characterId, event);
        
        if (developmentSuggestions.length > 0) {
            console.log(`📖 Character development suggestions: ${developmentSuggestions.join(', ')}`);
        }
    }
    
    /**
     * Analyze relationships and suggest development
     */
    analyzeRelationships(characterId) {
        const story = this.characters.get(characterId);
        if (!story) return null;
        
        const analysis = {
            totalRelationships: story.relationships.size,
            relationshipTypes: {},
            strongestBonds: [],
            conflictSources: [],
            networkInfluence: 0,
            socialCircles: [],
            recommendations: []
        };
        
        // Analyze relationship distribution
        story.relationships.forEach(rel => {
            if (!analysis.relationshipTypes[rel.type]) {
                analysis.relationshipTypes[rel.type] = 0;
            }
            analysis.relationshipTypes[rel.type]++;
            
            // Track strong relationships
            if (rel.strength >= 8) {
                analysis.strongestBonds.push(rel);
            }
            
            // Track conflicts
            if (rel.influence < -5) {
                analysis.conflictSources.push(rel);
            }
            
            // Calculate network influence
            analysis.networkInfluence += rel.influence * (rel.strength / 10);
        });
        
        // Generate recommendations
        if (analysis.totalRelationships < 3) {
            analysis.recommendations.push('Consider developing more relationships');
        }
        
        if (analysis.strongestBonds.length === 0) {
            analysis.recommendations.push('No strong relationships - develop deeper bonds');
        }
        
        if (analysis.conflictSources.length > analysis.strongestBonds.length) {
            analysis.recommendations.push('More enemies than friends - consider conflict resolution');
        }
        
        return analysis;
    }
    
    /**
     * Generate character development suggestions
     */
    generateDevelopmentSuggestions(characterId) {
        const story = this.characters.get(characterId);
        if (!story) return [];
        
        const suggestions = [];
        
        // Analyze personality trait balance
        const traitAnalysis = this.analyzePersonalityTraits(story);
        suggestions.push(...traitAnalysis.suggestions);
        
        // Analyze goal progression
        const goalAnalysis = this.analyzeGoalProgression(story);
        suggestions.push(...goalAnalysis.suggestions);
        
        // Analyze relationship health
        const relationshipAnalysis = this.analyzeRelationships(characterId);
        if (relationshipAnalysis) {
            suggestions.push(...relationshipAnalysis.recommendations);
        }
        
        // Analyze recent timeline events for patterns
        const recentEvents = story.timeline.slice(-10);
        const patternSuggestions = this.analyzeEventPatterns(recentEvents);
        suggestions.push(...patternSuggestions);
        
        return suggestions;
    }
    
    /**
     * Export character story data
     */
    exportCharacterStory(characterId, format = 'json') {
        const story = this.characters.get(characterId);
        if (!story) {
            throw new Error(`Character ${characterId} not found`);
        }
        
        const achievements = this.achievements.get(characterId) || [];
        
        const exportData = {
            character: story,
            achievements,
            exportDate: new Date(),
            format: format
        };
        
        switch (format.toLowerCase()) {
            case 'json':
                return this.exportAsJSON(exportData);
            case 'markdown':
                return this.exportAsMarkdown(exportData);
            case 'pdf':
                return this.exportAsPDF(exportData);
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }
    
    /**
     * Search story elements
     */
    searchStory(characterId, query, filters = {}) {
        const story = this.characters.get(characterId);
        if (!story) return [];
        
        const results = [];
        const searchTerm = query.toLowerCase();
        
        // Search timeline events
        if (!filters.exclude || !filters.exclude.includes('timeline')) {
            story.timeline.forEach(event => {
                if (this.matchesSearch(event, searchTerm, filters)) {
                    results.push({
                        type: 'timeline_event',
                        data: event,
                        relevance: this.calculateRelevance(event, searchTerm)
                    });
                }
            });
        }
        
        // Search relationships
        if (!filters.exclude || !filters.exclude.includes('relationships')) {
            story.relationships.forEach(rel => {
                if (this.matchesSearch(rel, searchTerm, filters)) {
                    results.push({
                        type: 'relationship',
                        data: rel,
                        relevance: this.calculateRelevance(rel, searchTerm)
                    });
                }
            });
        }
        
        // Search goals
        if (!filters.exclude || !filters.exclude.includes('goals')) {
            Object.values(story.goals).flat().forEach(goal => {
                if (this.matchesSearch(goal, searchTerm, filters)) {
                    results.push({
                        type: 'goal',
                        data: goal,
                        relevance: this.calculateRelevance(goal, searchTerm)
                    });
                }
            });
        }
        
        // Search achievements
        const achievements = this.achievements.get(characterId) || [];
        if (!filters.exclude || !filters.exclude.includes('achievements')) {
            achievements.forEach(achievement => {
                if (this.matchesSearch(achievement, searchTerm, filters)) {
                    results.push({
                        type: 'achievement',
                        data: achievement,
                        relevance: this.calculateRelevance(achievement, searchTerm)
                    });
                }
            });
        }
        
        // Sort by relevance
        return results.sort((a, b) => b.relevance - a.relevance);
    }
    
    /**
     * Initialize story templates and defaults
     */
    initializeStoryTemplates() {
        this.storyTemplates = {
            backgrounds: {
                'Noble': {
                    personalityTraits: ['I have a refined manner of speaking', 'I carry myself with dignity'],
                    ideals: ['Honor - My word is my bond', 'Responsibility - I must lead by example'],
                    bonds: ['My family name must be protected', 'I have a duty to my people'],
                    flaws: ['I am overly proud', 'I look down on commoners']
                },
                'Folk Hero': {
                    personalityTraits: ['I am humble about my accomplishments', 'I help others without expecting reward'],
                    ideals: ['Justice - Everyone deserves fair treatment', 'Community - We are stronger together'],
                    bonds: ['My village depends on me', 'I fight for the common folk'],
                    flaws: ['I trust too easily', 'I have a weakness for simple pleasures']
                },
                'Criminal': {
                    personalityTraits: ['I always have an escape plan', 'I speak in thieves\' cant'],
                    ideals: ['Freedom - Chains are meant to be broken', 'Greed - I will do whatever it takes to get rich'],
                    bonds: ['My criminal contact knows my secrets', 'I owe everything to my mentor'],
                    flaws: ['I can\'t resist taking risks', 'I have a debt that must be paid']
                }
            },
            
            goalTemplates: {
                shortTerm: [
                    'Find better equipment',
                    'Complete the current quest',
                    'Gain a level',
                    'Make a new ally',
                    'Earn gold for living expenses'
                ],
                longTerm: [
                    'Defeat a major enemy',
                    'Establish a stronghold',
                    'Master a new skill or spell',
                    'Uncover family secrets',
                    'Gain recognition in a guild'
                ],
                lifeGoals: [
                    'Become a legendary hero',
                    'Protect my homeland',
                    'Achieve immortality',
                    'Find true love',
                    'Leave a lasting legacy'
                ]
            },
            
            eventTypes: [
                'character_creation', 'level_up', 'major_victory', 'devastating_defeat',
                'new_relationship', 'relationship_change', 'goal_completed', 'goal_failed',
                'achievement', 'trauma', 'revelation', 'betrayal', 'sacrifice',
                'campaign_start', 'campaign_end', 'character_death', 'character_resurrection'
            ]
        };
    }
    
    initializeRelationshipTypes() {
        this.relationshipTypes = {
            'family': { color: '#8B4513', icon: '👨‍👩‍👧‍👦', description: 'Blood relatives and adopted family' },
            'romantic': { color: '#FF69B4', icon: '💕', description: 'Romantic interests and partners' },
            'friend': { color: '#32CD32', icon: '👫', description: 'Close friends and companions' },
            'ally': { color: '#4169E1', icon: '🤝', description: 'Political or strategic allies' },
            'mentor': { color: '#9932CC', icon: '🎓', description: 'Teachers and guides' },
            'student': { color: '#FF8C00', icon: '📚', description: 'Those you teach or guide' },
            'rival': { color: '#FFD700', icon: '⚔️', description: 'Competitive but not hostile' },
            'enemy': { color: '#DC143C', icon: '💀', description: 'Active opponents and threats' },
            'acquaintance': { color: '#808080', icon: '👋', description: 'Casual contacts and known individuals' }
        };
    }
    
    initializeAchievementCategories() {
        this.achievementCategories = {
            'combat': { name: 'Combat', icon: '⚔️', color: '#DC143C' },
            'social': { name: 'Social', icon: '🗣️', color: '#32CD32' },
            'exploration': { name: 'Exploration', icon: '🗺️', color: '#4169E1' },
            'magic': { name: 'Magic', icon: '✨', color: '#9932CC' },
            'crafting': { name: 'Crafting', icon: '🔨', color: '#B8860B' },
            'roleplay': { name: 'Roleplay', icon: '🎭', color: '#FF69B4' },
            'story': { name: 'Story', icon: '📖', color: '#8B4513' },
            'character': { name: 'Character', icon: '🎯', color: '#FF8C00' },
            'campaign': { name: 'Campaign', icon: '🏰', color: '#6A5ACD' },
            'meta': { name: 'Meta', icon: '🎲', color: '#708090' }
        };
    }
    
    // Utility methods
    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateRelationshipId() {
        return 'rel_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateAchievementId() {
        return 'ach_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getImportanceFromRarity(rarity) {
        const rarityMap = {
            'common': 'low',
            'uncommon': 'medium',
            'rare': 'high',
            'legendary': 'critical',
            'mythic': 'critical'
        };
        return rarityMap[rarity] || 'medium';
    }
    
    analyzeEventForDevelopment(event, story) {
        const suggestions = [];
        
        if (event.emotional_impact === 'very_negative') {
            suggestions.push('Consider adding a flaw or fear related to this traumatic event');
        }
        
        if (event.emotional_impact === 'very_positive' && event.type === 'major_victory') {
            suggestions.push('This victory might inspire a new ideal or strengthen existing bonds');
        }
        
        if (event.npcsInvolved.length > 0) {
            suggestions.push('Consider updating relationships with involved NPCs');
        }
        
        return suggestions;
    }
    
    updateReputation(characterId, event) {
        const story = this.characters.get(characterId);
        if (!story) return;
        
        let reputationChange = 0;
        
        switch (event.type) {
            case 'major_victory':
                reputationChange = 2;
                break;
            case 'achievement':
                reputationChange = 1;
                break;
            case 'betrayal':
                reputationChange = -3;
                break;
            case 'devastating_defeat':
                reputationChange = -1;
                break;
        }
        
        if (reputationChange !== 0) {
            story.reputation.general += reputationChange;
            console.log(`📖 Reputation changed by ${reputationChange} for ${characterId}`);
        }
    }
    
    checkEmotionalImpact(characterId, event) {
        const story = this.characters.get(characterId);
        if (!story) return;
        
        // Store important memories in the memory palace
        if (event.importance === 'critical' || event.emotional_impact !== 'neutral') {
            story.memoryPalace.set(event.id, {
                event: event,
                emotional_weight: this.getEmotionalWeight(event.emotional_impact),
                triggers: this.identifyMemoryTriggers(event),
                learned_lessons: []
            });
        }
    }
    
    updateRelationshipsFromEvent(characterId, event) {
        const story = this.characters.get(characterId);
        if (!story || !event.npcsInvolved.length) return;
        
        event.npcsInvolved.forEach(npcId => {
            // Find existing relationship or create suggestion for new one
            let relationship = null;
            story.relationships.forEach(rel => {
                if (rel.targetId === npcId) {
                    relationship = rel;
                }
            });
            
            if (relationship) {
                // Update last interaction
                relationship.last_interaction = event.date;
                
                // Adjust relationship strength based on event
                if (event.emotional_impact === 'very_positive') {
                    relationship.strength = Math.min(10, relationship.strength + 1);
                    relationship.trust_level = Math.min(10, relationship.trust_level + 0.5);
                } else if (event.emotional_impact === 'very_negative') {
                    relationship.strength = Math.max(1, relationship.strength - 1);
                    relationship.trust_level = Math.max(1, relationship.trust_level - 1);
                }
            }
        });
    }
    
    analyzePersonalityTraits(story) {
        const analysis = {
            balance: {},
            suggestions: []
        };
        
        if (story.personalityTraits.length < 2) {
            analysis.suggestions.push('Consider adding more personality traits to flesh out the character');
        }
        
        if (story.flaws.length === 0) {
            analysis.suggestions.push('Add character flaws for more realistic development');
        }
        
        if (story.bonds.length === 0) {
            analysis.suggestions.push('Establish bonds to tie the character to the world');
        }
        
        return analysis;
    }
    
    analyzeGoalProgression(story) {
        const analysis = {
            total: 0,
            completed: 0,
            inProgress: 0,
            stalled: 0,
            suggestions: []
        };
        
        Object.values(story.goals).flat().forEach(goal => {
            analysis.total++;
            
            switch (goal.status) {
                case 'completed':
                    analysis.completed++;
                    break;
                case 'in_progress':
                    analysis.inProgress++;
                    break;
                case 'stalled':
                    analysis.stalled++;
                    break;
            }
        });
        
        if (analysis.total === 0) {
            analysis.suggestions.push('Set some goals to drive character motivation');
        }
        
        if (analysis.stalled > analysis.inProgress) {
            analysis.suggestions.push('Many goals are stalled - consider revising or breaking them down');
        }
        
        return analysis;
    }
    
    analyzeEventPatterns(events) {
        const suggestions = [];
        
        if (events.length === 0) return suggestions;
        
        // Check for repeated failure patterns
        const failures = events.filter(e => e.emotional_impact === 'very_negative').length;
        if (failures > events.length * 0.6) {
            suggestions.push('Recent events have been largely negative - consider a positive development');
        }
        
        // Check for social isolation
        const socialEvents = events.filter(e => e.npcsInvolved.length > 0).length;
        if (socialEvents < events.length * 0.3) {
            suggestions.push('Character may be becoming isolated - consider social interactions');
        }
        
        return suggestions;
    }
    
    matchesSearch(item, searchTerm, filters) {
        const searchableText = JSON.stringify(item).toLowerCase();
        
        if (!searchableText.includes(searchTerm)) return false;
        
        // Apply additional filters
        if (filters.importance && item.importance !== filters.importance) return false;
        if (filters.type && item.type !== filters.type) return false;
        if (filters.dateRange) {
            const itemDate = new Date(item.date);
            if (itemDate < new Date(filters.dateRange.start) || 
                itemDate > new Date(filters.dateRange.end)) {
                return false;
            }
        }
        
        return true;
    }
    
    calculateRelevance(item, searchTerm) {
        let relevance = 0;
        
        const title = (item.title || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        
        // Title matches are most relevant
        if (title.includes(searchTerm)) relevance += 3;
        
        // Description matches are moderately relevant
        if (description.includes(searchTerm)) relevance += 2;
        
        // Exact matches boost relevance
        if (title === searchTerm || description === searchTerm) relevance += 5;
        
        // Recent items get slight boost
        if (item.date) {
            const daysSince = (new Date() - new Date(item.date)) / (1000 * 60 * 60 * 24);
            if (daysSince < 30) relevance += 1;
        }
        
        return relevance;
    }
    
    getEmotionalWeight(impact) {
        const weights = {
            'very_negative': -3,
            'negative': -1,
            'neutral': 0,
            'positive': 1,
            'very_positive': 3
        };
        return weights[impact] || 0;
    }
    
    identifyMemoryTriggers(event) {
        const triggers = [];
        
        if (event.location) triggers.push(event.location);
        if (event.npcsInvolved.length > 0) triggers.push(...event.npcsInvolved);
        if (event.tags.length > 0) triggers.push(...event.tags);
        
        return triggers;
    }
    
    exportAsJSON(data) {
        return JSON.stringify(data, null, 2);
    }
    
    exportAsMarkdown(data) {
        const story = data.character;
        let markdown = `# Character Story: ${story.characterId}\n\n`;
        
        markdown += `## Background\n`;
        markdown += `**Origin:** ${story.background.origin}\n`;
        markdown += `**Hometown:** ${story.background.hometown}\n\n`;
        
        if (story.personalityTraits.length > 0) {
            markdown += `## Personality Traits\n`;
            story.personalityTraits.forEach(trait => {
                markdown += `- ${trait}\n`;
            });
            markdown += '\n';
        }
        
        if (story.timeline.length > 0) {
            markdown += `## Timeline\n`;
            story.timeline.forEach(event => {
                markdown += `### ${event.title}\n`;
                markdown += `**Date:** ${new Date(event.date).toLocaleDateString()}\n`;
                markdown += `${event.description}\n\n`;
            });
        }
        
        return markdown;
    }
    
    exportAsPDF(data) {
        // Placeholder for PDF export functionality
        // Would integrate with a library like jsPDF or similar
        return 'PDF export not yet implemented';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoryTracker;
} else if (typeof window !== 'undefined') {
    window.StoryTracker = StoryTracker;
}
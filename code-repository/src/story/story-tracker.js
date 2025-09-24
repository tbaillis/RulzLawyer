// code-repository/src/story/story-tracker.js
class StoryTracker {
  constructor() {
    this.stories = new Map();
    this.backstories = new Map();
    this.plotHooks = new Map();
    this.narrativeThreads = new Map();
    this.characterDevelopment = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('📖 Initializing Story Tracker...');
    const startTime = performance.now();

    try {
      await this.loadDefaultPlotHooks();
      await this.initializeNarrativeFramework();

      const initTime = performance.now() - startTime;
      console.log(`✅ Story Tracker initialized in ${initTime.toFixed(2)}ms`);

      this.initialized = true;
    } catch (error) {
      console.error('❌ Story Tracker initialization failed:', error);
      throw new StoryTrackerError(error.message);
    }
  }

  async loadDefaultPlotHooks() {
    // Default plot hooks for D&D campaigns
    const plotHooksData = [
      {
        id: 'ancient_prophecy',
        name: 'Ancient Prophecy',
        type: 'prophecy',
        description: 'An ancient prophecy foretells the character\'s destiny',
        triggers: ['level_up', 'major_quest_completion'],
        rarity: 'rare'
      },
      {
        id: 'family_secret',
        name: 'Family Secret',
        type: 'personal',
        description: 'A dark family secret comes to light',
        triggers: ['backstory_reveal', 'family_encounter'],
        rarity: 'common'
      },
      {
        id: 'lost_artifact',
        name: 'Lost Artifact',
        type: 'quest',
        description: 'The character discovers they are connected to a legendary artifact',
        triggers: ['artifact_discovery', 'ancient_ruins'],
        rarity: 'uncommon'
      },
      {
        id: 'rival_organization',
        name: 'Rival Organization',
        type: 'conflict',
        description: 'A powerful organization has taken interest in the character',
        triggers: ['political_intrigue', 'assassination_attempt'],
        rarity: 'common'
      },
      {
        id: 'mysterious_mentor',
        name: 'Mysterious Mentor',
        type: 'guidance',
        description: 'A mysterious figure offers guidance and training',
        triggers: ['dream_sequence', 'chance_encounter'],
        rarity: 'uncommon'
      },
      {
        id: 'cosmic_destiny',
        name: 'Cosmic Destiny',
        type: 'epic',
        description: 'The character\'s actions affect the balance of cosmic forces',
        triggers: ['epic_level_achievement', 'divine_intervention'],
        rarity: 'rare'
      }
    ];

    for (const hook of plotHooksData) {
      this.plotHooks.set(hook.id, hook);
    }

    console.log(`🎭 Loaded ${this.plotHooks.size} default plot hooks`);
  }

  async initializeNarrativeFramework() {
    // Initialize narrative tracking structures
    this.narrativeThreads.set('main_plot', {
      id: 'main_plot',
      name: 'Main Campaign Arc',
      status: 'active',
      chapters: [],
      keyEvents: [],
      resolution: null
    });

    console.log('📚 Initialized narrative framework');
  }

  // Public API methods
  async createCharacterBackstory(character, backstoryData) {
    const backstory = {
      characterId: character.id || character.name,
      characterName: character.name,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      ...backstoryData,
      developmentHistory: [],
      plotHooks: [],
      relationships: [],
      motivations: backstoryData.motivations || [],
      flaws: backstoryData.flaws || [],
      ideals: backstoryData.ideals || [],
      bonds: backstoryData.bonds || [],
      personalityTraits: backstoryData.personalityTraits || []
    };

    this.backstories.set(backstory.characterId, backstory);

    // Initialize character development tracking
    await this.initializeCharacterDevelopment(character);

    console.log(`📝 Created backstory for ${character.name}`);
    return backstory;
  }

  async initializeCharacterDevelopment(character) {
    const development = {
      characterId: character.id || character.name,
      arcProgression: {
        hero_journey: 0, // 0-100% through hero's journey
        personal_growth: 0,
        relationship_development: 0,
        power_progression: 0
      },
      keyMoments: [],
      characterGrowth: {
        confidence: 50,
        wisdom: 50,
        compassion: 50,
        ruthlessness: 50,
        leadership: 50
      },
      relationships: new Map(),
      achievements: [],
      failures: [],
      lessonsLearned: []
    };

    this.characterDevelopment.set(development.characterId, development);
    return development;
  }

  async addStoryEvent(characterId, eventData) {
    const storyEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      characterId,
      timestamp: new Date().toISOString(),
      ...eventData,
      impact: eventData.impact || 'minor',
      consequences: eventData.consequences || [],
      relatedCharacters: eventData.relatedCharacters || [],
      location: eventData.location || null
    };

    // Add to character's story
    if (!this.stories.has(characterId)) {
      this.stories.set(characterId, {
        characterId,
        events: [],
        chapters: [],
        themes: [],
        plotPoints: []
      });
    }

    const characterStory = this.stories.get(characterId);
    characterStory.events.push(storyEvent);

    // Update character development
    await this.updateCharacterDevelopment(characterId, storyEvent);

    // Check for plot hook triggers
    await this.checkPlotHookTriggers(characterId, storyEvent);

    console.log(`📖 Added story event: ${storyEvent.title} for character ${characterId}`);
    return storyEvent;
  }

  async updateCharacterDevelopment(characterId, storyEvent) {
    const development = this.characterDevelopment.get(characterId);
    if (!development) return;

    // Update arc progression based on event type
    switch (storyEvent.type) {
      case 'victory':
      case 'achievement':
        development.arcProgression.hero_journey += 5;
        development.arcProgression.personal_growth += 3;
        development.characterGrowth.confidence += 2;
        development.achievements.push(storyEvent.id);
        break;

      case 'defeat':
      case 'failure':
        development.arcProgression.hero_journey += 3;
        development.arcProgression.personal_growth += 5;
        development.characterGrowth.wisdom += 3;
        development.failures.push(storyEvent.id);
        break;

      case 'betrayal':
      case 'loss':
        development.arcProgression.relationship_development += 5;
        development.characterGrowth.compassion += 2;
        development.characterGrowth.ruthlessness += 1;
        break;

      case 'leadership':
        development.arcProgression.relationship_development += 3;
        development.characterGrowth.leadership += 4;
        break;

      case 'power_gain':
        development.arcProgression.power_progression += 10;
        development.characterGrowth.confidence += 3;
        break;
    }

    // Cap progression at 100%
    for (const key in development.arcProgression) {
      development.arcProgression[key] = Math.min(100, development.arcProgression[key]);
    }

    // Cap character growth traits at 100
    for (const trait in development.characterGrowth) {
      development.characterGrowth[trait] = Math.min(100, Math.max(0, development.characterGrowth[trait]));
    }

    development.keyMoments.push({
      eventId: storyEvent.id,
      timestamp: storyEvent.timestamp,
      impact: storyEvent.impact,
      lesson: storyEvent.lesson || null
    });

    this.characterDevelopment.set(characterId, development);
  }

  async checkPlotHookTriggers(characterId, storyEvent) {
    const backstory = this.backstories.get(characterId);
    if (!backstory) return;

    for (const [hookId, hook] of this.plotHooks) {
      if (hook.triggers.includes(storyEvent.type)) {
        // Check if hook is already active
        if (!backstory.plotHooks.some(h => h.id === hookId)) {
          const activatedHook = {
            id: hookId,
            activatedAt: new Date().toISOString(),
            triggeredBy: storyEvent.id,
            status: 'active',
            progress: 0
          };

          backstory.plotHooks.push(activatedHook);
          console.log(`🎭 Activated plot hook: ${hook.name} for ${characterId}`);
        }
      }
    }

    this.backstories.set(characterId, backstory);
  }

  async addRelationship(characterId, relationshipData) {
    const backstory = this.backstories.get(characterId);
    if (!backstory) {
      throw new StoryTrackerError('Character backstory not found');
    }

    const relationship = {
      id: `rel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...relationshipData,
      createdAt: new Date().toISOString(),
      status: relationshipData.status || 'active',
      history: []
    };

    backstory.relationships.push(relationship);

    // Also add to character development
    const development = this.characterDevelopment.get(characterId);
    if (development) {
      development.relationships.set(relationship.id, {
        name: relationship.name,
        type: relationship.type,
        status: relationship.status,
        affection: relationship.affection || 50
      });
    }

    this.backstories.set(characterId, backstory);
    console.log(`👥 Added relationship: ${relationship.name} for ${characterId}`);
    return relationship;
  }

  async updateRelationshipStatus(characterId, relationshipId, newStatus, reason) {
    const backstory = this.backstories.get(characterId);
    if (!backstory) {
      throw new StoryTrackerError('Character backstory not found');
    }

    const relationship = backstory.relationships.find(r => r.id === relationshipId);
    if (!relationship) {
      throw new StoryTrackerError('Relationship not found');
    }

    const statusChange = {
      timestamp: new Date().toISOString(),
      oldStatus: relationship.status,
      newStatus,
      reason
    };

    relationship.status = newStatus;
    relationship.history.push(statusChange);

    // Update character development
    const development = this.characterDevelopment.get(characterId);
    if (development && development.relationships.has(relationshipId)) {
      const relData = development.relationships.get(relationshipId);
      relData.status = newStatus;

      // Adjust affection based on status change
      if (newStatus === 'improved') relData.affection = Math.min(100, relData.affection + 10);
      else if (newStatus === 'strained') relData.affection = Math.max(0, relData.affection - 15);
      else if (newStatus === 'broken') relData.affection = Math.max(0, relData.affection - 30);
    }

    this.backstories.set(characterId, backstory);
    console.log(`📈 Updated relationship status: ${relationship.name} - ${newStatus}`);
    return relationship;
  }

  async createStoryChapter(characterId, chapterData) {
    const chapter = {
      id: `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      characterId,
      createdAt: new Date().toISOString(),
      ...chapterData,
      events: [],
      status: 'active',
      themes: chapterData.themes || [],
      keyCharacters: chapterData.keyCharacters || [],
      locations: chapterData.locations || []
    };

    const characterStory = this.stories.get(characterId);
    if (characterStory) {
      characterStory.chapters.push(chapter);
    }

    console.log(`📚 Created story chapter: ${chapter.title} for ${characterId}`);
    return chapter;
  }

  async getCharacterStory(characterId) {
    const story = this.stories.get(characterId);
    const backstory = this.backstories.get(characterId);
    const development = this.characterDevelopment.get(characterId);

    if (!story && !backstory) {
      throw new StoryTrackerError('Character story not found');
    }

    return {
      characterId,
      story: story || { events: [], chapters: [], themes: [], plotPoints: [] },
      backstory: backstory || null,
      development: development || null,
      summary: await this.generateStorySummary(characterId)
    };
  }

  async generateStorySummary(characterId) {
    const story = this.stories.get(characterId);
    const backstory = this.backstories.get(characterId);
    const development = this.characterDevelopment.get(characterId);

    if (!story && !backstory) return null;

    const summary = {
      totalEvents: story?.events.length || 0,
      totalChapters: story?.chapters.length || 0,
      activeRelationships: backstory?.relationships.filter(r => r.status === 'active').length || 0,
      activePlotHooks: backstory?.plotHooks.filter(h => h.status === 'active').length || 0,
      heroJourneyProgress: development?.arcProgression.hero_journey || 0,
      characterGrowth: development?.characterGrowth || {},
      majorAchievements: development?.achievements.length || 0,
      significantFailures: development?.failures.length || 0,
      lessonsLearned: development?.lessonsLearned.length || 0
    };

    return summary;
  }

  async getStoryRecommendations(characterId) {
    const development = this.characterDevelopment.get(characterId);
    const backstory = this.backstories.get(characterId);

    if (!development || !backstory) return [];

    const recommendations = [];

    // Check arc progression
    if (development.arcProgression.hero_journey < 30) {
      recommendations.push({
        type: 'plot_development',
        priority: 'high',
        message: 'Consider introducing a mentor figure or call to adventure to advance the hero\'s journey'
      });
    }

    // Check relationships
    const activeRelationships = backstory.relationships.filter(r => r.status === 'active');
    if (activeRelationships.length < 3) {
      recommendations.push({
        type: 'character_development',
        priority: 'medium',
        message: 'Develop more character relationships to add depth to the story'
      });
    }

    // Check plot hooks
    const activeHooks = backstory.plotHooks.filter(h => h.status === 'active');
    if (activeHooks.length === 0) {
      recommendations.push({
        type: 'plot_hooks',
        priority: 'medium',
        message: 'Consider activating a plot hook to drive the story forward'
      });
    }

    // Check character growth
    const lowTraits = Object.entries(development.characterGrowth)
      .filter(([trait, value]) => value < 40)
      .map(([trait]) => trait);

    if (lowTraits.length > 0) {
      recommendations.push({
        type: 'character_growth',
        priority: 'low',
        message: `Focus on developing: ${lowTraits.join(', ')}`
      });
    }

    return recommendations;
  }

  async exportStoryData() {
    const exportData = {
      stories: Object.fromEntries(this.stories),
      backstories: Object.fromEntries(this.backstories),
      plotHooks: Object.fromEntries(this.plotHooks),
      narrativeThreads: Object.fromEntries(this.narrativeThreads),
      characterDevelopment: Object.fromEntries(this.characterDevelopment),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return exportData;
  }

  // Utility methods
  async getAllPlotHooks() {
    return Array.from(this.plotHooks.values());
  }

  async getAvailablePlotHooks(characterId) {
    const backstory = this.backstories.get(characterId);
    if (!backstory) return Array.from(this.plotHooks.values());

    const activeHookIds = new Set(backstory.plotHooks.map(h => h.id));
    return Array.from(this.plotHooks.values()).filter(hook => !activeHookIds.has(hook.id));
  }

  async activatePlotHook(characterId, hookId) {
    const backstory = this.backstories.get(characterId);
    if (!backstory) {
      throw new StoryTrackerError('Character backstory not found');
    }

    const hook = this.plotHooks.get(hookId);
    if (!hook) {
      throw new StoryTrackerError('Plot hook not found');
    }

    // Check if already active
    if (backstory.plotHooks.some(h => h.id === hookId)) {
      throw new StoryTrackerError('Plot hook already active');
    }

    const activatedHook = {
      id: hookId,
      activatedAt: new Date().toISOString(),
      triggeredBy: 'manual_activation',
      status: 'active',
      progress: 0
    };

    backstory.plotHooks.push(activatedHook);
    this.backstories.set(characterId, backstory);

    console.log(`🎭 Manually activated plot hook: ${hook.name} for ${characterId}`);
    return activatedHook;
  }
}

// Error Classes
class StoryTrackerError extends Error {
  constructor(message) { super(message); this.name = 'StoryTrackerError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StoryTracker;
} else if (typeof window !== 'undefined') {
  window.StoryTracker = StoryTracker;
}
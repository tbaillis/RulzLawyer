// code-repository/src/epic/epic-progression-tracker.js
class EpicProgressionTracker {
  constructor() {
    this.progressionHistory = new Map();
    this.milestones = new Map();
    this.achievements = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('📊 Initializing Epic Progression Tracker...');
    const startTime = performance.now();

    try {
      await this.loadMilestones();
      await this.loadAchievements();

      const initTime = performance.now() - startTime;
      console.log(`✅ Epic Progression Tracker initialized in ${initTime.toFixed(2)}ms`);

      this.initialized = true;
    } catch (error) {
      console.error('❌ Epic Progression Tracker initialization failed:', error);
      throw new EpicProgressionTrackerError(error.message);
    }
  }

  async loadMilestones() {
    // Key epic progression milestones
    const milestonesData = [
      {
        id: 'first_epic_level',
        name: 'First Epic Level',
        description: 'Reached level 21, entering epic progression',
        level: 21,
        type: 'level',
        reward: 'Access to epic feats and abilities'
      },
      {
        id: 'epic_feat_master',
        name: 'Epic Feat Master',
        description: 'Acquired 10 epic feats',
        type: 'feat',
        threshold: 10,
        reward: 'Legendary status among adventurers'
      },
      {
        id: 'ability_score_30',
        name: 'Superhuman Ability',
        description: 'Reached ability score of 30 in any ability',
        type: 'ability',
        threshold: 30,
        reward: 'Transcendent physical/mental capabilities'
      },
      {
        id: 'level_30_legend',
        name: 'Living Legend',
        description: 'Reached level 30',
        level: 30,
        type: 'level',
        reward: 'Legendary status, songs written about you'
      },
      {
        id: 'divine_ascension_ready',
        name: 'Divine Ascension Ready',
        description: 'Met all requirements for divine ascension',
        type: 'divine',
        reward: 'Path to godhood opens'
      },
      {
        id: 'cosmic_power_master',
        name: 'Cosmic Power Master',
        description: 'Acquired 10 cosmic powers',
        type: 'cosmic',
        threshold: 10,
        reward: 'Mastery over cosmic forces'
      },
      {
        id: 'epic_spellcaster',
        name: 'Epic Spellcaster',
        description: 'Learned 5 epic spells',
        type: 'spell',
        threshold: 5,
        reward: 'Command over reality-bending magic'
      },
      {
        id: 'level_40_myth',
        name: 'Living Myth',
        description: 'Reached level 40',
        level: 40,
        type: 'level',
        reward: 'Mythical status, worshipped by some'
      },
      {
        id: 'divine_rank_10',
        name: 'Demi-God',
        description: 'Achieved divine rank 10',
        type: 'divine',
        threshold: 10,
        reward: 'Demi-god status, divine realm established'
      },
      {
        id: 'cosmic_power_supreme',
        name: 'Cosmic Power Supreme',
        description: 'Acquired all cosmic powers',
        type: 'cosmic',
        threshold: 25, // All powers
        reward: 'Supreme mastery over cosmic forces'
      },
      {
        id: 'level_50_deity',
        name: 'True Deity',
        description: 'Reached level 50 and divine ascension',
        level: 50,
        type: 'level',
        reward: 'Full deity status, divine portfolio'
      }
    ];

    for (const milestone of milestonesData) {
      this.milestones.set(milestone.id, milestone);
    }

    console.log(`🏆 Loaded ${this.milestones.size} epic milestones`);
  }

  async loadAchievements() {
    // Special achievements and accomplishments
    const achievementsData = [
      {
        id: 'epic_quest_completer',
        name: 'Epic Quest Completer',
        description: 'Completed 10 epic-level quests',
        category: 'adventure',
        points: 100
      },
      {
        id: 'artifact_creator',
        name: 'Artifact Creator',
        description: 'Created a major artifact',
        category: 'crafting',
        points: 200
      },
      {
        id: 'plane_walker',
        name: 'Plane Walker',
        description: 'Visited all major planes',
        category: 'exploration',
        points: 150
      },
      {
        id: 'dragon_slayer',
        name: 'Dragon Slayer',
        description: 'Defeated 50 dragons',
        category: 'combat',
        points: 300
      },
      {
        id: 'realm_founder',
        name: 'Realm Founder',
        description: 'Founded a kingdom or empire',
        category: 'leadership',
        points: 250
      },
      {
        id: 'spell_inventor',
        name: 'Spell Inventor',
        description: 'Created 10 new spells',
        category: 'magic',
        points: 180
      },
      {
        id: 'undead_lord',
        name: 'Undead Lord',
        description: 'Commanded an army of 10,000 undead',
        category: 'necromancy',
        points: 220
      },
      {
        id: 'time_traveler',
        name: 'Time Traveler',
        description: 'Successfully traveled through time',
        category: 'chronomancy',
        points: 500
      }
    ];

    for (const achievement of achievementsData) {
      this.achievements.set(achievement.id, achievement);
    }

    console.log(`🎖️ Loaded ${this.achievements.size} epic achievements`);
  }

  // Public API methods
  async startTracking(character) {
    const characterId = character.id || character.name;
    const progressionData = {
      characterId,
      characterName: character.name,
      startDate: new Date().toISOString(),
      currentLevel: character.level,
      epicLevel: Math.max(0, character.level - 20),
      milestonesAchieved: [],
      achievementsEarned: [],
      progressionLog: [],
      statistics: {
        totalXP: character.experience || 0,
        epicXP: character.epicExperience || 0,
        epicFeats: character.epicFeats?.length || 0,
        abilityIncreases: this.calculateTotalAbilityIncreases(character),
        divineRank: character.divineRank || 0,
        cosmicPowers: character.cosmicPowers?.length || 0
      }
    };

    this.progressionHistory.set(characterId, progressionData);
    console.log(`📊 Started tracking epic progression for ${character.name}`);
    return progressionData;
  }

  async updateProgression(character, event) {
    const characterId = character.id || character.name;
    let progressionData = this.progressionHistory.get(characterId);

    if (!progressionData) {
      progressionData = await this.startTracking(character);
    }

    // Update basic stats
    progressionData.currentLevel = character.level;
    progressionData.epicLevel = Math.max(0, character.level - 20);
    progressionData.lastUpdated = new Date().toISOString();

    // Update statistics
    progressionData.statistics = {
      totalXP: character.experience || 0,
      epicXP: character.epicExperience || 0,
      epicFeats: character.epicFeats?.length || 0,
      abilityIncreases: this.calculateTotalAbilityIncreases(character),
      divineRank: character.divineRank || 0,
      cosmicPowers: character.cosmicPowers?.length || 0
    };

    // Log the event
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event.type,
      details: event.details,
      level: character.level,
      statistics: { ...progressionData.statistics }
    };

    progressionData.progressionLog.push(logEntry);

    // Check for milestone achievements
    const newMilestones = await this.checkMilestoneAchievements(character);
    for (const milestone of newMilestones) {
      if (!progressionData.milestonesAchieved.includes(milestone.id)) {
        progressionData.milestonesAchieved.push(milestone.id);
        console.log(`🏆 ${character.name} achieved milestone: ${milestone.name}`);
      }
    }

    // Check for achievement unlocks
    const newAchievements = await this.checkAchievementUnlocks(character);
    for (const achievement of newAchievements) {
      if (!progressionData.achievementsEarned.includes(achievement.id)) {
        progressionData.achievementsEarned.push(achievement.id);
        console.log(`🎖️ ${character.name} earned achievement: ${achievement.name}`);
      }
    }

    this.progressionHistory.set(characterId, progressionData);
    return progressionData;
  }

  async checkMilestoneAchievements(character) {
    const achieved = [];

    for (const [milestoneId, milestone] of this.milestones) {
      if (this.hasAchievedMilestone(character, milestone)) {
        achieved.push(milestone);
      }
    }

    return achieved;
  }

  hasAchievedMilestone(character, milestone) {
    switch (milestone.type) {
      case 'level':
        return character.level >= milestone.level;

      case 'feat':
        return (character.epicFeats?.length || 0) >= milestone.threshold;

      case 'ability':
        const abilities = character.abilities || {};
        for (const ability of Object.values(abilities)) {
          if (ability.totalScore >= milestone.threshold) {
            return true;
          }
        }
        return false;

      case 'divine':
        if (milestone.id === 'divine_ascension_ready') {
          // Check divine ascension requirements
          return character.level >= 50 &&
            (character.abilities?.charisma?.totalScore || 0) >= 30 &&
            (character.abilities?.wisdom?.totalScore || 0) >= 25;
        }
        return (character.divineRank || 0) >= milestone.threshold;

      case 'cosmic':
        return (character.cosmicPowers?.length || 0) >= milestone.threshold;

      case 'spell':
        return (character.epicSpells?.length || 0) >= milestone.threshold;

      default:
        return false;
    }
  }

  async checkAchievementUnlocks(character) {
    const earned = [];

    for (const [achievementId, achievement] of this.achievements) {
      if (this.hasEarnedAchievement(character, achievement)) {
        earned.push(achievement);
      }
    }

    return earned;
  }

  hasEarnedAchievement(character, achievement) {
    // This would check character's adventure log, etc.
    // For now, return false as we don't have this data
    return false;
  }

  calculateTotalAbilityIncreases(character) {
    if (!character.abilities) return 0;

    let total = 0;
    for (const ability of Object.values(character.abilities)) {
      // Assuming base scores start at 10, anything above is from increases
      total += Math.max(0, ability.baseScore - 10);
    }
    return total;
  }

  async getProgressionReport(characterId) {
    const progressionData = this.progressionHistory.get(characterId);
    if (!progressionData) {
      throw new EpicProgressionTrackerError('Character progression data not found');
    }

    const report = {
      ...progressionData,
      completionPercentage: this.calculateCompletionPercentage(progressionData),
      nextMilestones: await this.getNextMilestones(progressionData),
      recentActivity: progressionData.progressionLog.slice(-10) // Last 10 events
    };

    return report;
  }

  calculateCompletionPercentage(progressionData) {
    const totalMilestones = this.milestones.size;
    const achievedMilestones = progressionData.milestonesAchieved.length;
    return Math.round((achievedMilestones / totalMilestones) * 100);
  }

  async getNextMilestones(progressionData) {
    const nextMilestones = [];
    const achievedIds = new Set(progressionData.milestonesAchieved);

    for (const [milestoneId, milestone] of this.milestones) {
      if (!achievedIds.has(milestoneId)) {
        nextMilestones.push(milestone);
      }
    }

    // Sort by relevance (level, then type)
    nextMilestones.sort((a, b) => {
      if (a.level && b.level) return a.level - b.level;
      if (a.level) return -1;
      if (b.level) return 1;
      return 0;
    });

    return nextMilestones.slice(0, 5); // Return next 5 milestones
  }

  async getProgressionHistory(characterId) {
    return this.progressionHistory.get(characterId);
  }

  async exportProgressionData() {
    const exportData = {
      progressionHistory: Object.fromEntries(this.progressionHistory),
      milestones: Object.fromEntries(this.milestones),
      achievements: Object.fromEntries(this.achievements),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return exportData;
  }

  // Get all tracked characters
  async getTrackedCharacters() {
    return Array.from(this.progressionHistory.keys());
  }

  // Remove character tracking
  async stopTracking(characterId) {
    const removed = this.progressionHistory.delete(characterId);
    if (removed) {
      console.log(`📊 Stopped tracking progression for character: ${characterId}`);
    }
    return removed;
  }
}

// Error Classes
class EpicProgressionTrackerError extends Error {
  constructor(message) { super(message); this.name = 'EpicProgressionTrackerError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EpicProgressionTracker;
} else if (typeof window !== 'undefined') {
  window.EpicProgressionTracker = EpicProgressionTracker;
}
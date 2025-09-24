// code-repository/src/epic/epic-level-engine.js
class EpicLevelEngine {
  constructor(characterManager, spellManager, featManager) {
    this.characterManager = characterManager;
    this.spellManager = spellManager;
    this.featManager = featManager;
    this.epicFeatDatabase = new EpicFeatDatabase();
    this.divineAscensionManager = new DivineAscensionManager();
    this.epicSpellDatabase = new EpicSpellDatabase();
    this.epicAbilityManager = new EpicAbilityManager();
    this.epicProgressionTracker = new EpicProgressionTracker();
    this.performanceMonitor = new EpicLevelPerformanceMonitor();
    this.initialized = false;

    // Epic level calculation constants
    this.EPIC_LEVEL_THRESHOLD = 21;
    this.MAX_EPIC_LEVEL = 100;
    this.DIVINE_ASCENSION_THRESHOLD = 50;
    this.COSMIC_ASCENSION_THRESHOLD = 80;

    // XP progression for epic levels (exponential growth)
    this.epicXPTable = this.generateEpicXPTable();

    // Epic feat progression (every 3 levels)
    this.epicFeatLevels = this.generateEpicFeatProgression();

    // Ability score increases (every 4 levels, up to epic maximums)
    this.epicAbilityProgression = this.generateEpicAbilityProgression();
  }

  async initialize() {
    if (this.initialized) return;

    console.log('⚡ Initializing Epic Level Engine...');
    const startTime = performance.now();

    try {
      await Promise.all([
        this.epicFeatDatabase.initialize(),
        this.divineAscensionManager.initialize(),
        this.epicSpellDatabase.initialize(),
        this.epicAbilityManager.initialize(),
        this.epicProgressionTracker.initialize()
      ]);

      const initTime = performance.now() - startTime;
      console.log(`✅ Epic Level Engine initialized in ${initTime.toFixed(2)}ms`);

      this.initialized = true;
      this.validateEpicSystemIntegrity();

    } catch (error) {
      console.error('❌ Epic Level Engine initialization failed:', error);
      throw new EpicLevelEngineError(error.message);
    }
  }

  // Epic XP Table Generation (21-100)
  generateEpicXPTable() {
    const xpTable = new Map();

    // Starting XP for level 21 (standard D&D 3.5)
    let currentXP = 210000;

    for (let level = 21; level <= this.MAX_EPIC_LEVEL; level++) {
      xpTable.set(level, currentXP);

      // Epic level XP progression: increasingly difficult
      const levelDifference = level - 20;
      const baseIncrease = 10000;
      const exponentialFactor = Math.pow(1.15, levelDifference - 1);
      const increase = Math.floor(baseIncrease * exponentialFactor);

      currentXP += increase;
    }

    console.log(`📊 Epic XP Table generated: Level 21 (210,000 XP) to Level 100 (${currentXP.toLocaleString()} XP)`);
    return xpTable;
  }

  // Epic Feat Progression Calculation
  generateEpicFeatProgression() {
    const epicFeatLevels = [];

    // Epic feats every 3 levels starting at 21
    for (let level = 21; level <= this.MAX_EPIC_LEVEL; level += 3) {
      epicFeatLevels.push(level);
    }

    console.log(`🎯 Epic feat progression: ${epicFeatLevels.length} epic feat opportunities (levels 21, 24, 27, ...)`);
    return epicFeatLevels;
  }

  // Epic Ability Score Progression
  generateEpicAbilityProgression() {
    const progression = new Map();

    // Ability increases every 4 levels (24, 28, 32, etc.)
    for (let level = 24; level <= this.MAX_EPIC_LEVEL; level += 4) {
      progression.set(level, {
        increase: 1,
        maxBonus: this.calculateEpicAbilityMaximum(level),
        specialRules: this.getEpicAbilitySpecialRules(level)
      });
    }

    return progression;
  }

  // Core Epic Level Advancement
  async advanceToEpicLevel(character, targetLevel) {
    if (!this.initialized) await this.initialize();

    const startTime = performance.now();
    const currentLevel = character.level;

    console.log(`⚡ Advancing character from level ${currentLevel} to epic level ${targetLevel}`);

    try {
      // Validate epic level advancement
      const validation = await this.validateEpicLevelAdvancement(character, targetLevel);
      if (!validation.valid) {
        throw new EpicLevelAdvancementError(validation.reason);
      }

      // Track progression steps
      const progressionSteps = [];

      for (let level = Math.max(currentLevel + 1, this.EPIC_LEVEL_THRESHOLD); level <= targetLevel; level++) {
        const stepResult = await this.advanceSingleEpicLevel(character, level);
        progressionSteps.push(stepResult);
      }

      // Update character's epic status
      character.level = targetLevel;
      character.epicLevel = targetLevel - 20;
      character.isEpicCharacter = true;
      character.epicProgression = {
        totalEpicLevels: targetLevel - 20,
        epicFeatsGained: this.calculateEpicFeatsGained(targetLevel),
        divinityRank: await this.calculateDivinityRank(character),
        cosmicAwareness: await this.calculateCosmicAwareness(character),
        lastAdvancement: new Date()
      };

      // Apply epic-specific bonuses
      await this.applyEpicLevelBonuses(character);

      // Record progression for analytics
      this.epicProgressionTracker.recordAdvancement(character.id, progressionSteps);

      const advancementTime = performance.now() - startTime;
      this.performanceMonitor.recordEpicAdvancement(advancementTime);

      console.log(`✅ Epic level advancement complete in ${advancementTime.toFixed(2)}ms`);

      return {
        success: true,
        finalLevel: targetLevel,
        epicLevel: targetLevel - 20,
        progressionSteps: progressionSteps,
        epicStatus: character.epicProgression,
        newAbilities: await this.getNewEpicAbilities(character, targetLevel),
        performanceMetrics: { advancementTime }
      };

    } catch (error) {
      console.error(`❌ Epic level advancement failed for character ${character.id}:`, error);
      throw new EpicLevelAdvancementError(error.message);
    }
  }

  // Single Epic Level Advancement
  async advanceSingleEpicLevel(character, targetLevel) {
    const stepStart = performance.now();
    const step = {
      level: targetLevel,
      epicLevel: targetLevel - 20,
      changes: [],
      newAbilities: [],
      requirements: []
    };

    // Base epic level progression
    step.changes.push('Base epic level progression');

    // Hit points (Constitution modifier + class hit die)
    const hitPointIncrease = await this.calculateEpicHitPointIncrease(character, targetLevel);
    character.hitPoints.maximum += hitPointIncrease;
    step.changes.push(`Hit Points +${hitPointIncrease}`);

    // Skill points (Intelligence modifier + class skill points)
    const skillPointIncrease = await this.calculateEpicSkillPointIncrease(character, targetLevel);
    character.skillPoints += skillPointIncrease;
    step.changes.push(`Skill Points +${skillPointIncrease}`);

    // Base attack bonus progression
    const babIncrease = await this.calculateEpicBABProgression(character, targetLevel);
    if (babIncrease > 0) {
      character.baseAttackBonus += babIncrease;
      step.changes.push(`Base Attack Bonus +${babIncrease}`);
    }

    // Saving throw progression
    const savingThrowBonuses = await this.calculateEpicSavingThrowProgression(character, targetLevel);
    for (const [save, bonus] of Object.entries(savingThrowBonuses)) {
      if (bonus > 0) {
        character.savingThrows[save].base += bonus;
        step.changes.push(`${save} Save +${bonus}`);
      }
    }

    // Epic feat progression
    if (this.epicFeatLevels.includes(targetLevel)) {
      const availableEpicFeats = await this.getAvailableEpicFeats(character, targetLevel);
      step.requirements.push({
        type: 'epicFeatSelection',
        options: availableEpicFeats,
        required: true,
        description: `Choose an epic feat at level ${targetLevel}`
      });
      step.changes.push('Epic Feat Selection Available');
    }

    // Ability score increase
    if (this.epicAbilityProgression.has(targetLevel)) {
      const abilityInfo = this.epicAbilityProgression.get(targetLevel);
      step.requirements.push({
        type: 'abilityScoreIncrease',
        increase: abilityInfo.increase,
        maxBonus: abilityInfo.maxBonus,
        required: true,
        description: `Increase an ability score by ${abilityInfo.increase} at level ${targetLevel}`
      });
      step.changes.push(`Ability Score Increase +${abilityInfo.increase}`);
    }

    // Epic spell progression
    const epicSpellProgression = await this.calculateEpicSpellProgression(character, targetLevel);
    if (epicSpellProgression.newSpells.length > 0) {
      step.newAbilities.push({
        type: 'epicSpells',
        spells: epicSpellProgression.newSpells,
        description: 'New epic spells available'
      });
      step.changes.push(`Epic Spells: ${epicSpellProgression.newSpells.length} new spells`);
    }

    // Special epic abilities by level ranges
    const specialAbilities = await this.getEpicSpecialAbilities(character, targetLevel);
    for (const ability of specialAbilities) {
      step.newAbilities.push(ability);
      step.changes.push(`Special Ability: ${ability.name}`);
    }

    // Divine rank progression
    if (targetLevel >= this.DIVINE_ASCENSION_THRESHOLD) {
      const divineRankProgression = await this.calculateDivineRankProgression(character, targetLevel);
      if (divineRankProgression.rankIncrease > 0) {
        step.newAbilities.push({
          type: 'divineRank',
          rank: divineRankProgression.newRank,
          powers: divineRankProgression.newPowers,
          description: `Divine Rank increased to ${divineRankProgression.newRank}`
        });
        step.changes.push(`Divine Rank: ${divineRankProgression.newRank}`);
      }
    }

    // Cosmic ascension (levels 80+)
    if (targetLevel >= this.COSMIC_ASCENSION_THRESHOLD) {
      const cosmicProgression = await this.calculateCosmicProgression(character, targetLevel);
      if (cosmicProgression.newPowers.length > 0) {
        step.newAbilities.push({
          type: 'cosmicPowers',
          powers: cosmicProgression.newPowers,
          description: 'New cosmic powers gained'
        });
        step.changes.push(`Cosmic Powers: ${cosmicProgression.newPowers.length} new powers`);
      }
    }

    const stepTime = performance.now() - stepStart;
    step.processingTime = stepTime;

    console.log(`📈 Epic level ${targetLevel} advancement completed in ${stepTime.toFixed(2)}ms`);

    return step;
  }

  // Validation Methods
  async validateEpicLevelAdvancement(character, targetLevel) {
    const validation = {
      valid: true,
      warnings: [],
      errors: []
    };

    // Check if character is eligible for epic levels
    if (character.level < 20) {
      validation.valid = false;
      validation.errors.push('Character must reach level 20 before advancing to epic levels');
    }

    // Check target level bounds
    if (targetLevel < this.EPIC_LEVEL_THRESHOLD || targetLevel > this.MAX_EPIC_LEVEL) {
      validation.valid = false;
      validation.errors.push(`Target level must be between ${this.EPIC_LEVEL_THRESHOLD} and ${this.MAX_EPIC_LEVEL}`);
    }

    // Check XP requirements
    const requiredXP = this.epicXPTable.get(targetLevel);
    if (character.experiencePoints < requiredXP) {
      validation.valid = false;
      validation.errors.push(`Insufficient XP: ${character.experiencePoints} / ${requiredXP} required`);
    }

    // Check for level regression
    if (targetLevel <= character.level) {
      validation.valid = false;
      validation.errors.push('Target level must be higher than current level');
    }

    // Validate epic prerequisites
    const prerequisiteCheck = await this.checkEpicPrerequisites(character);
    if (!prerequisiteCheck.met) {
      validation.valid = false;
      validation.errors.push(...prerequisiteCheck.reasons);
    }

    validation.reason = validation.errors.length > 0 ? validation.errors.join('; ') : null;

    return validation;
  }

  async checkEpicPrerequisites(character) {
    const check = {
      met: true,
      reasons: []
    };

    // Must have at least one class at level 20
    const hasLevel20Class = character.classes.some(classInfo => classInfo.level >= 20);
    if (!hasLevel20Class) {
      check.met = false;
      check.reasons.push('Character must have at least one class at level 20');
    }

    // Must have appropriate ability scores for epic progression
    const totalAbilityScore = Object.values(character.abilities).reduce((sum, ability) => sum + ability.baseScore, 0);
    if (totalAbilityScore < 80) { // Rough guideline
      check.reasons.push('Warning: Low ability scores may limit epic progression options');
    }

    return check;
  }

  // Calculation Methods
  async calculateEpicHitPointIncrease(character, targetLevel) {
    // Constitution modifier + class hit die average
    const conModifier = Math.floor((character.abilities.constitution.totalScore - 10) / 2);
    const classHitDie = await this.getCharacterHitDie(character);

    // Epic characters get max hit die + Con modifier
    return classHitDie + conModifier;
  }

  async calculateEpicSkillPointIncrease(character, targetLevel) {
    // Intelligence modifier + class skill points
    const intModifier = Math.floor((character.abilities.intelligence.totalScore - 10) / 2);
    const classSkillPoints = await this.getCharacterSkillPointsPerLevel(character);

    return Math.max(1, intModifier + classSkillPoints);
  }

  async calculateEpicBABProgression(character, targetLevel) {
    // BAB progression continues based on class
    const classBABProgression = await this.getCharacterBABProgression(character);
    return classBABProgression; // Simplified - would need full calculation
  }

  async calculateEpicSavingThrowProgression(character, targetLevel) {
    // Saving throws continue to improve based on class
    const classSavingThrows = await this.getCharacterSavingThrowProgression(character);
    return classSavingThrows; // Simplified - would need full calculation
  }

  async calculateEpicSpellProgression(character, targetLevel) {
    // Epic spellcasting progression
    const progression = {
      newSpells: [],
      spellSlots: {}
    };

    if (character.spellcasting) {
      // Add epic spells based on level and class
      const epicSpells = await this.epicSpellDatabase.getSpellsForLevel(character, targetLevel);
      progression.newSpells = epicSpells;
    }

    return progression;
  }

  async getEpicSpecialAbilities(character, targetLevel) {
    const abilities = [];

    // Legendary weapon specialization (level 21)
    if (targetLevel === 21) {
      abilities.push({
        name: 'Legendary Weapon Specialization',
        type: 'combat',
        description: '+2 damage with chosen weapon type',
        requirements: ['Choose a weapon type']
      });
    }

    // Epic toughness variants
    if (targetLevel >= 23 && targetLevel % 3 === 0) {
      abilities.push({
        name: 'Epic Toughness',
        type: 'defense',
        description: '+1 HP per epic level',
        automatic: true
      });
    }

    return abilities;
  }

  async calculateDivineRankProgression(character, targetLevel) {
    const progression = {
      rankIncrease: 0,
      newRank: character.divineRank || 0,
      newPowers: []
    };

    // Divine rank increases every 10 levels after 50
    if (targetLevel >= 50 && targetLevel % 10 === 0) {
      progression.rankIncrease = 1;
      progression.newRank = Math.floor((targetLevel - 40) / 10);

      // Add divine powers based on rank
      progression.newPowers = await this.divineAscensionManager.getPowersForRank(progression.newRank);
    }

    return progression;
  }

  async calculateCosmicProgression(character, targetLevel) {
    const progression = {
      newPowers: []
    };

    // Cosmic powers at levels 80, 85, 90, 95, 100
    if (targetLevel >= 80 && targetLevel % 5 === 0) {
      progression.newPowers = await this.divineAscensionManager.getCosmicPowers(targetLevel);
    }

    return progression;
  }

  // Helper Methods
  calculateEpicAbilityMaximum(level) {
    // Epic characters can exceed normal ability maximums
    return 40 + Math.floor((level - 20) / 4);
  }

  getEpicAbilitySpecialRules(level) {
    const rules = [];

    if (level >= 40) {
      rules.push('Ability scores can exceed racial maximums');
    }

    if (level >= 60) {
      rules.push('Ability scores can exceed 40');
    }

    return rules;
  }

  calculateEpicFeatsGained(level) {
    // Epic feats every 3 levels starting at 21
    return Math.floor((level - 21) / 3) + 1;
  }

  async calculateDivinityRank(character) {
    if (character.level < 50) return 0;
    return Math.floor((character.level - 40) / 10);
  }

  async calculateCosmicAwareness(character) {
    if (character.level < 80) return 0;
    return Math.floor((character.level - 75) / 5);
  }

  async applyEpicLevelBonuses(character) {
    // Apply any automatic epic bonuses
    if (character.level >= 21) {
      // Epic characters get various automatic bonuses
      character.epicBonuses = character.epicBonuses || {};
      character.epicBonuses.damageReduction = Math.floor(character.level / 10);
      character.epicBonuses.spellResistance = character.level + 10;
    }
  }

  async getNewEpicAbilities(character, targetLevel) {
    const abilities = [];

    // Collect all new abilities gained during advancement
    const progressionSteps = await this.epicProgressionTracker.getProgressionSteps(character.id);
    const latestStep = progressionSteps[progressionSteps.length - 1];

    if (latestStep) {
      abilities.push(...latestStep.newAbilities);
    }

    return abilities;
  }

  // Epic Feat Management
  async getAvailableEpicFeats(character, level) {
    const epicFeats = await this.epicFeatDatabase.getAllEpicFeats();
    const availableFeats = [];

    for (const feat of epicFeats) {
      const prerequisiteCheck = await this.checkEpicFeatPrerequisites(character, feat, level);

      if (prerequisiteCheck.meetsPrerequisites) {
        availableFeats.push({
          ...feat,
          prerequisiteStatus: prerequisiteCheck
        });
      }
    }

    // Sort by prerequisite satisfaction and feat power
    availableFeats.sort((a, b) => {
      const powerA = this.calculateEpicFeatPower(a);
      const powerB = this.calculateEpicFeatPower(b);
      return powerB - powerA;
    });

    console.log(`🎯 ${availableFeats.length} epic feats available at level ${level}`);
    return availableFeats;
  }

  async checkEpicFeatPrerequisites(character, feat, level) {
    const check = {
      meetsPrerequisites: true,
      failedRequirements: [],
      warnings: []
    };

    // Level requirements
    if (feat.minimumLevel && level < feat.minimumLevel) {
      check.meetsPrerequisites = false;
      check.failedRequirements.push(`Requires level ${feat.minimumLevel}`);
    }

    // Ability score requirements
    if (feat.abilityRequirements) {
      for (const [ability, requirement] of Object.entries(feat.abilityRequirements)) {
        const currentScore = character.abilities[ability].totalScore;
        if (currentScore < requirement) {
          check.meetsPrerequisites = false;
          check.failedRequirements.push(`Requires ${ability} ${requirement} (current: ${currentScore})`);
        }
      }
    }

    // Feat prerequisites
    if (feat.featPrerequisites) {
      for (const requiredFeat of feat.featPrerequisites) {
        if (!this.characterHasFeat(character, requiredFeat)) {
          check.meetsPrerequisites = false;
          check.failedRequirements.push(`Requires feat: ${requiredFeat}`);
        }
      }
    }

    // Epic feat prerequisites
    if (feat.epicFeatPrerequisites) {
      for (const requiredEpicFeat of feat.epicFeatPrerequisites) {
        if (!this.characterHasEpicFeat(character, requiredEpicFeat)) {
          check.meetsPrerequisites = false;
          check.failedRequirements.push(`Requires epic feat: ${requiredEpicFeat}`);
        }
      }
    }

    // Class requirements
    if (feat.classRequirements) {
      for (const classReq of feat.classRequirements) {
        const classLevel = this.getCharacterClassLevel(character, classReq.className);
        if (classLevel < classReq.minimumLevel) {
          check.meetsPrerequisites = false;
          check.failedRequirements.push(`Requires ${classReq.className} level ${classReq.minimumLevel}`);
        }
      }
    }

    return check;
  }

  characterHasFeat(character, featName) {
    return character.feats && character.feats.some(feat => feat.name === featName);
  }

  characterHasEpicFeat(character, epicFeatName) {
    return character.epicFeats && character.epicFeats.some(feat => feat.name === epicFeatName);
  }

  getCharacterClassLevel(character, className) {
    const classInfo = character.classes.find(c => c.name === className);
    return classInfo ? classInfo.level : 0;
  }

  calculateEpicFeatPower(feat) {
    // Calculate relative power level of epic feat
    let power = 0;

    if (feat.combatBonus) power += feat.combatBonus * 2;
    if (feat.magicBonus) power += feat.magicBonus * 3;
    if (feat.saveBonus) power += feat.saveBonus * 2;
    if (feat.specialAbilities) power += feat.specialAbilities.length * 5;

    return power;
  }

  // Placeholder methods (would be implemented with full character system integration)
  async getCharacterHitDie(character) { return 6; } // Default d6
  async getCharacterSkillPointsPerLevel(character) { return 2; } // Default 2
  async getCharacterBABProgression(character) { return 1; } // Simplified
  async getCharacterSavingThrowProgression(character) { return { fortitude: 0, reflex: 0, will: 0 }; }

  // System Integrity Validation
  validateEpicSystemIntegrity() {
    const issues = [];

    if (this.epicXPTable.size !== 80) {
      issues.push('Epic XP table incomplete');
    }

    if (this.epicFeatLevels.length === 0) {
      issues.push('Epic feat progression not generated');
    }

    if (issues.length > 0) {
      console.warn('⚠️ Epic system integrity issues:', issues);
    } else {
      console.log('✅ Epic system integrity validated');
    }
  }

  // Get XP required for epic level
  getEpicXPRequirement(level) {
    return this.epicXPTable.get(level) || 0;
  }

  // Check if character can advance to epic levels
  canAdvanceToEpic(character) {
    return character.level >= 20 && character.experiencePoints >= 210000;
  }

  // Get epic level information
  getEpicLevelInfo(level) {
    if (level < 21 || level > 100) return null;

    return {
      level: level,
      epicLevel: level - 20,
      xpRequired: this.epicXPTable.get(level),
      hasEpicFeat: this.epicFeatLevels.includes(level),
      hasAbilityIncrease: this.epicAbilityProgression.has(level),
      divineRank: level >= 50 ? Math.floor((level - 40) / 10) : 0,
      cosmicPowers: level >= 80 && level % 5 === 0
    };
  }
}

// Supporting Classes (placeholders for now)
class EpicFeatDatabase {
  async initialize() { console.log('EpicFeatDatabase initialized'); }
  async getAllEpicFeats() { return []; }
}

class DivineAscensionManager {
  async initialize() { console.log('DivineAscensionManager initialized'); }
  async getPowersForRank(rank) { return []; }
  async getCosmicPowers(level) { return []; }
}

class EpicSpellDatabase {
  async initialize() { console.log('EpicSpellDatabase initialized'); }
  async getSpellsForLevel(character, level) { return []; }
}

class EpicAbilityManager {
  async initialize() { console.log('EpicAbilityManager initialized'); }
}

class EpicProgressionTracker {
  async initialize() { console.log('EpicProgressionTracker initialized'); }
  async recordAdvancement(characterId, steps) { /* Record advancement */ }
  async getProgressionSteps(characterId) { return []; }
}

class EpicLevelPerformanceMonitor {
  recordEpicAdvancement(time) { console.log(`Epic advancement took ${time}ms`); }
}

// Error Classes
class EpicLevelEngineError extends Error {
  constructor(message) { super(message); this.name = 'EpicLevelEngineError'; }
}

class EpicLevelAdvancementError extends Error {
  constructor(message) { super(message); this.name = 'EpicLevelAdvancementError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EpicLevelEngine;
} else if (typeof window !== 'undefined') {
  window.EpicLevelEngine = EpicLevelEngine;
}
// code-repository/src/epic/epic-ability-manager.js
class EpicAbilityManager {
  constructor() {
    this.epicAbilities = new Map();
    this.abilityIncreases = new Map();
    this.epicProgressionRules = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('💪 Initializing Epic Ability Manager...');
    const startTime = performance.now();

    try {
      await this.loadEpicAbilities();
      await this.loadAbilityIncreases();
      await this.buildProgressionRules();

      const initTime = performance.now() - startTime;
      console.log(`✅ Epic Ability Manager initialized in ${initTime.toFixed(2)}ms`);

      this.initialized = true;
    } catch (error) {
      console.error('❌ Epic Ability Manager initialization failed:', error);
      throw new EpicAbilityManagerError(error.message);
    }
  }

  async loadEpicAbilities() {
    // Epic ability score increases and special abilities
    const epicAbilitiesData = [
      {
        id: 'strength_epic_1',
        name: 'Epic Strength +1',
        type: 'ability_increase',
        ability: 'strength',
        value: 1,
        minimumLevel: 21,
        description: 'Your Strength score increases by 1.',
        prerequisites: []
      },
      {
        id: 'dexterity_epic_1',
        name: 'Epic Dexterity +1',
        type: 'ability_increase',
        ability: 'dexterity',
        value: 1,
        minimumLevel: 21,
        description: 'Your Dexterity score increases by 1.',
        prerequisites: []
      },
      {
        id: 'constitution_epic_1',
        name: 'Epic Constitution +1',
        type: 'ability_increase',
        ability: 'constitution',
        value: 1,
        minimumLevel: 21,
        description: 'Your Constitution score increases by 1.',
        prerequisites: []
      },
      {
        id: 'intelligence_epic_1',
        name: 'Epic Intelligence +1',
        type: 'ability_increase',
        ability: 'intelligence',
        value: 1,
        minimumLevel: 21,
        description: 'Your Intelligence score increases by 1.',
        prerequisites: []
      },
      {
        id: 'wisdom_epic_1',
        name: 'Epic Wisdom +1',
        type: 'ability_increase',
        ability: 'wisdom',
        value: 1,
        minimumLevel: 21,
        description: 'Your Wisdom score increases by 1.',
        prerequisites: []
      },
      {
        id: 'charisma_epic_1',
        name: 'Epic Charisma +1',
        type: 'ability_increase',
        ability: 'charisma',
        value: 1,
        minimumLevel: 21,
        description: 'Your Charisma score increases by 1.',
        prerequisites: []
      },
      {
        id: 'epic_toughness_1',
        name: 'Epic Toughness I',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You gain +20 hit points.',
        benefit: '+20 hit points',
        prerequisites: ['Toughness']
      },
      {
        id: 'epic_toughness_2',
        name: 'Epic Toughness II',
        type: 'special_ability',
        minimumLevel: 24,
        description: 'You gain an additional +20 hit points.',
        benefit: '+20 hit points',
        prerequisites: ['Epic Toughness I']
      },
      {
        id: 'epic_toughness_3',
        name: 'Epic Toughness III',
        type: 'special_ability',
        minimumLevel: 27,
        description: 'You gain an additional +20 hit points.',
        benefit: '+20 hit points',
        prerequisites: ['Epic Toughness II']
      },
      {
        id: 'epic_toughness_4',
        name: 'Epic Toughness IV',
        type: 'special_ability',
        minimumLevel: 30,
        description: 'You gain an additional +20 hit points.',
        benefit: '+20 hit points',
        prerequisites: ['Epic Toughness III']
      },
      {
        id: 'epic_fortitude',
        name: 'Epic Fortitude',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You gain a +4 bonus on Fortitude saves.',
        benefit: '+4 Fortitude saves',
        prerequisites: ['Great Fortitude']
      },
      {
        id: 'epic_reflexes',
        name: 'Epic Reflexes',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You gain a +4 bonus on Reflex saves.',
        benefit: '+4 Reflex saves',
        prerequisites: ['Lightning Reflexes']
      },
      {
        id: 'epic_will',
        name: 'Epic Will',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You gain a +4 bonus on Will saves.',
        benefit: '+4 Will saves',
        prerequisites: ['Iron Will']
      },
      {
        id: 'epic_prowess',
        name: 'Epic Prowess',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You gain a +1 bonus on all attack rolls.',
        benefit: '+1 attack rolls',
        prerequisites: ['Str 21']
      },
      {
        id: 'epic_endurance',
        name: 'Epic Endurance',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You gain a +4 bonus on checks for running, swimming, and other physical exertion.',
        benefit: '+4 physical exertion checks',
        prerequisites: ['Con 21', 'Endurance']
      },
      {
        id: 'epic_speed',
        name: 'Epic Speed',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'Your base land speed increases by 30 feet.',
        benefit: '+30 ft. base land speed',
        prerequisites: ['Dex 21']
      },
      {
        id: 'epic_initiative',
        name: 'Epic Initiative',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You gain a +4 bonus on initiative checks.',
        benefit: '+4 initiative',
        prerequisites: ['Dex 21', 'Improved Initiative']
      },
      {
        id: 'epic_leader',
        name: 'Epic Leader',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You can attract a larger number of followers.',
        benefit: 'Leadership score treated as 4 points higher',
        prerequisites: ['Cha 25', 'Leadership']
      },
      {
        id: 'epic_reputation',
        name: 'Epic Reputation',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'Your reputation precedes you.',
        benefit: '+4 Bluff, Diplomacy, Gather Information, Intimidate, Perform',
        prerequisites: ['Cha 21']
      },
      {
        id: 'legendary_climber',
        name: 'Legendary Climber',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You can climb any surface.',
        benefit: '+20 Climb checks',
        prerequisites: ['Dex 21', '24 ranks in Climb']
      },
      {
        id: 'legendary_leaper',
        name: 'Legendary Leaper',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You can leap incredible distances.',
        benefit: '+10 Jump checks',
        prerequisites: ['Str 21', 'Power Attack', '24 ranks in Jump']
      },
      {
        id: 'legendary_rider',
        name: 'Legendary Rider',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You are a master of mounted combat.',
        benefit: '+10 Ride checks',
        prerequisites: ['Dex 21', '24 ranks in Ride', 'Mounted Combat']
      },
      {
        id: 'legendary_tracker',
        name: 'Legendary Tracker',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You can track creatures with amazing skill.',
        benefit: '+20 Survival checks (tracking)',
        prerequisites: ['Wis 21', '30 ranks in Survival', 'Track']
      },
      {
        id: 'legendary_wrestler',
        name: 'Legendary Wrestler',
        type: 'special_ability',
        minimumLevel: 21,
        description: 'You are a master of grappling.',
        benefit: '+10 grapple checks',
        prerequisites: ['Str 25', 'Improved Grapple', 'Improved Unarmed Strike']
      }
    ];

    for (const ability of epicAbilitiesData) {
      this.epicAbilities.set(ability.id, ability);
    }

    console.log(`💪 Loaded ${this.epicAbilities.size} epic abilities`);
  }

  async loadAbilityIncreases() {
    // Ability score increases every 4 levels starting at level 21
    const abilityIncreasesData = [
      { level: 21, increases: 1 },
      { level: 22, increases: 0 },
      { level: 23, increases: 0 },
      { level: 24, increases: 1 },
      { level: 25, increases: 0 },
      { level: 26, increases: 0 },
      { level: 27, increases: 1 },
      { level: 28, increases: 0 },
      { level: 29, increases: 0 },
      { level: 30, increases: 1 },
      { level: 31, increases: 0 },
      { level: 32, increases: 0 },
      { level: 33, increases: 1 },
      { level: 34, increases: 0 },
      { level: 35, increases: 0 },
      { level: 36, increases: 1 },
      { level: 37, increases: 0 },
      { level: 38, increases: 0 },
      { level: 39, increases: 1 },
      { level: 40, increases: 1 } // Two increases at level 40
    ];

    for (const increase of abilityIncreasesData) {
      this.abilityIncreases.set(increase.level, increase);
    }

    console.log('📈 Loaded ability increase schedule');
  }

  async buildProgressionRules() {
    // Rules for epic progression
    const rules = {
      abilityScoreCap: 40, // Epic characters can exceed normal ability caps
      hitDieProgression: 'd6', // Epic hit die (minimum)
      baseAttackBonus: 'continues at +1 every level',
      saves: 'continue at +1 every 2 levels',
      skillPoints: 'continues at class rate + Int modifier',
      feats: 'every 3 levels starting at level 21',
      abilityIncreases: 'every 4 levels starting at level 21',
      specialAbilities: 'various epic abilities available'
    };

    this.epicProgressionRules.set('general', rules);
    console.log('📋 Built epic progression rules');
  }

  // Public API methods
  async getEpicAbility(abilityId) {
    return this.epicAbilities.get(abilityId);
  }

  async getAllEpicAbilities() {
    return Array.from(this.epicAbilities.values());
  }

  async getEpicAbilitiesByType(type) {
    const abilities = [];
    for (const [abilityId, ability] of this.epicAbilities) {
      if (ability.type === type) {
        abilities.push(ability);
      }
    }
    return abilities;
  }

  async getEpicAbilitiesForLevel(level) {
    const abilities = [];
    for (const [abilityId, ability] of this.epicAbilities) {
      if (ability.minimumLevel <= level) {
        abilities.push(ability);
      }
    }
    return abilities;
  }

  async getAbilityIncreasesForLevel(level) {
    return this.abilityIncreases.get(level) || { increases: 0 };
  }

  async canTakeEpicAbility(character, abilityId) {
    const ability = this.epicAbilities.get(abilityId);
    if (!ability) {
      return { canTake: false, reason: 'Ability not found' };
    }

    // Check level requirement
    if (character.level < ability.minimumLevel) {
      return { canTake: false, reason: `Level ${ability.minimumLevel} required` };
    }

    // Check prerequisites
    for (const prereq of ability.prerequisites) {
      if (!this.characterMeetsPrerequisite(character, prereq)) {
        return { canTake: false, reason: `Prerequisite not met: ${prereq}` };
      }
    }

    // Check if already taken
    if (character.epicAbilities && character.epicAbilities.includes(abilityId)) {
      return { canTake: false, reason: 'Ability already taken' };
    }

    return { canTake: true };
  }

  async grantEpicAbility(character, abilityId) {
    const canTake = await this.canTakeEpicAbility(character, abilityId);
    if (!canTake.canTake) {
      throw new EpicAbilityManagerError(`Cannot grant ability: ${canTake.reason}`);
    }

    const ability = this.epicAbilities.get(abilityId);

    // Initialize epic abilities array if needed
    if (!character.epicAbilities) {
      character.epicAbilities = [];
    }

    // Add the ability
    character.epicAbilities.push(abilityId);

    // Apply ability effects
    await this.applyEpicAbilityEffects(character, ability);

    console.log(`💪 Granted epic ability: ${ability.name} to ${character.name}`);
    return character;
  }

  async applyEpicAbilityEffects(character, ability) {
    switch (ability.type) {
      case 'ability_increase':
        if (!character.abilities) {
          character.abilities = {};
        }
        const abilityKey = ability.ability.toLowerCase();
        if (!character.abilities[abilityKey]) {
          character.abilities[abilityKey] = { baseScore: 10, totalScore: 10 };
        }
        character.abilities[abilityKey].baseScore += ability.value;
        character.abilities[abilityKey].totalScore += ability.value;
        break;

      case 'special_ability':
        // Apply special ability effects
        await this.applySpecialAbilityEffect(character, ability);
        break;
    }
  }

  async applySpecialAbilityEffect(character, ability) {
    // Apply various special ability effects
    switch (ability.id) {
      case 'epic_toughness_1':
      case 'epic_toughness_2':
      case 'epic_toughness_3':
      case 'epic_toughness_4':
        character.hitPoints = (character.hitPoints || 0) + 20;
        break;

      case 'epic_fortitude':
        character.saves = character.saves || {};
        character.saves.fortitude = (character.saves.fortitude || 0) + 4;
        break;

      case 'epic_reflexes':
        character.saves = character.saves || {};
        character.saves.reflex = (character.saves.reflex || 0) + 4;
        break;

      case 'epic_will':
        character.saves = character.saves || {};
        character.saves.will = (character.saves.will || 0) + 4;
        break;

      case 'epic_prowess':
        character.attackBonus = (character.attackBonus || 0) + 1;
        break;

      case 'epic_endurance':
        character.enduranceBonus = (character.enduranceBonus || 0) + 4;
        break;

      case 'epic_speed':
        character.speed = (character.speed || 30) + 30;
        break;

      case 'epic_initiative':
        character.initiativeBonus = (character.initiativeBonus || 0) + 4;
        break;

      case 'epic_leader':
        character.leadershipBonus = (character.leadershipBonus || 0) + 4;
        break;

      case 'epic_reputation':
        character.reputationBonus = (character.reputationBonus || 0) + 4;
        break;

      case 'legendary_climber':
        character.climbBonus = (character.climbBonus || 0) + 20;
        break;

      case 'legendary_leaper':
        character.jumpBonus = (character.jumpBonus || 0) + 10;
        break;

      case 'legendary_rider':
        character.rideBonus = (character.rideBonus || 0) + 10;
        break;

      case 'legendary_tracker':
        character.trackingBonus = (character.trackingBonus || 0) + 20;
        break;

      case 'legendary_wrestler':
        character.grappleBonus = (character.grappleBonus || 0) + 10;
        break;
    }
  }

  async getAvailableAbilityIncreases(character) {
    const levelData = this.abilityIncreases.get(character.level);
    if (!levelData || levelData.increases === 0) {
      return 0;
    }

    // Check how many increases have been used this level
    const usedThisLevel = character.abilityIncreasesUsedThisLevel || 0;
    return Math.max(0, levelData.increases - usedThisLevel);
  }

  async increaseAbilityScore(character, abilityName, amount = 1) {
    const available = await this.getAvailableAbilityIncreases(character);
    if (available < amount) {
      throw new EpicAbilityManagerError(`Not enough ability increases available. Have ${available}, need ${amount}`);
    }

    const abilityKey = abilityName.toLowerCase();
    if (!character.abilities) {
      character.abilities = {};
    }
    if (!character.abilities[abilityKey]) {
      character.abilities[abilityKey] = { baseScore: 10, totalScore: 10 };
    }

    // Check epic ability cap
    const newScore = character.abilities[abilityKey].totalScore + amount;
    if (newScore > 40) {
      throw new EpicAbilityManagerError(`Ability score cannot exceed 40. Current: ${character.abilities[abilityKey].totalScore}, requested: ${newScore}`);
    }

    character.abilities[abilityKey].baseScore += amount;
    character.abilities[abilityKey].totalScore += amount;
    character.abilityIncreasesUsedThisLevel = (character.abilityIncreasesUsedThisLevel || 0) + amount;

    console.log(`📈 Increased ${abilityName} by ${amount} for ${character.name}`);
    return character;
  }

  async getEpicProgressionSummary(character) {
    const summary = {
      level: character.level,
      isEpic: character.level >= 21,
      abilityIncreasesAvailable: await this.getAvailableAbilityIncreases(character),
      epicAbilitiesTaken: character.epicAbilities || [],
      availableEpicAbilities: [],
      nextFeatLevel: this.getNextFeatLevel(character.level),
      nextAbilityIncreaseLevel: this.getNextAbilityIncreaseLevel(character.level)
    };

    // Get available epic abilities
    for (const [abilityId, ability] of this.epicAbilities) {
      const canTake = await this.canTakeEpicAbility(character, abilityId);
      if (canTake.canTake) {
        summary.availableEpicAbilities.push(ability);
      }
    }

    return summary;
  }

  getNextFeatLevel(currentLevel) {
    if (currentLevel < 21) return 21;
    const levelsSince21 = currentLevel - 21;
    const featsTaken = Math.floor(levelsSince21 / 3) + 1;
    const nextFeatLevel = 21 + (featsTaken * 3);
    return nextFeatLevel;
  }

  getNextAbilityIncreaseLevel(currentLevel) {
    if (currentLevel < 21) return 21;
    const levelsSince21 = currentLevel - 21;
    const increasesTaken = Math.floor(levelsSince21 / 4) + 1;
    const nextIncreaseLevel = 21 + (increasesTaken * 4);
    return nextIncreaseLevel;
  }

  characterMeetsPrerequisite(character, prerequisite) {
    // Parse prerequisite (simplified version)
    if (prerequisite.includes('Str')) {
      const strReq = parseInt(prerequisite.match(/\d+/)[0]);
      return character.abilities?.strength?.totalScore >= strReq;
    }
    if (prerequisite.includes('Dex')) {
      const dexReq = parseInt(prerequisite.match(/\d+/)[0]);
      return character.abilities?.dexterity?.totalScore >= dexReq;
    }
    if (prerequisite.includes('Con')) {
      const conReq = parseInt(prerequisite.match(/\d+/)[0]);
      return character.abilities?.constitution?.totalScore >= conReq;
    }
    if (prerequisite.includes('Int')) {
      const intReq = parseInt(prerequisite.match(/\d+/)[0]);
      return character.abilities?.intelligence?.totalScore >= intReq;
    }
    if (prerequisite.includes('Wis')) {
      const wisReq = parseInt(prerequisite.match(/\d+/)[0]);
      return character.abilities?.wisdom?.totalScore >= wisReq;
    }
    if (prerequisite.includes('Cha')) {
      const chaReq = parseInt(prerequisite.match(/\d+/)[0]);
      return character.abilities?.charisma?.totalScore >= chaReq;
    }

    // Check for feat prerequisites
    return character.feats && character.feats.some(feat => feat.name === prerequisite);
  }

  // Export ability data
  async exportAbilityData() {
    const exportData = {
      epicAbilities: Object.fromEntries(this.epicAbilities),
      abilityIncreases: Object.fromEntries(this.abilityIncreases),
      progressionRules: Object.fromEntries(this.epicProgressionRules),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return exportData;
  }
}

// Error Classes
class EpicAbilityManagerError extends Error {
  constructor(message) { super(message); this.name = 'EpicAbilityManagerError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EpicAbilityManager;
} else if (typeof window !== 'undefined') {
  window.EpicAbilityManager = EpicAbilityManager;
}
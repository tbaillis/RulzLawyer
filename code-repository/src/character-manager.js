/**
 * RulzLawyer Character Management System
 * Complete D&D 3.5 Character Objects with Death Mechanics
 * 
 * @version 1.0
 * @date September 20, 2025
 * @location code-repository/src/character-manager.js
 */

class CharacterManager {
  constructor(diceEngine, tablesEngine, spellManager, equipmentManager, srdData) {
    this.dice = diceEngine;
    this.tables = tablesEngine;
    this.spellManager = spellManager;
    this.equipmentManager = equipmentManager;
    this.srdData = srdData;
    this.characters = new Map();
    this.activeCharacter = null;
    
    // Initialize with SRD data if available
    this.raceDefinitions = srdData ? srdData.races : this._initializeRaces();
    this.classDefinitions = srdData ? srdData.classes : this._initializeClasses();
    this.characterHistory = [];
    
    console.log('👤 Character Manager initialized with enhanced SRD integration');
  }

  /**
   * Create a new character with random or specified attributes
   * @param {Object} options - Character creation options
   * @returns {Object} Created character object
   */
  createCharacter(options = {}) {
    const character = {
      id: this._generateCharacterId(),
      name: options.name || this._generateRandomName(),
      race: options.race || this._rollRace(),
      class: options.class || this._rollClass(),
      level: options.level || 1,
      
      // Core ability scores
      abilities: options.abilities || this._rollAbilities(),
      
      // Derived stats
      hitPoints: { current: 0, maximum: 0, temporary: 0 },
      armorClass: 10,
      savingThrows: { fortitude: 0, reflex: 0, will: 0 },
      baseAttackBonus: 0,
      
      // Character status
      status: 'alive', // alive, unconscious, dying, dead
      deathSaves: { successes: 0, failures: 0 },
      conditions: [], // poisoned, paralyzed, etc.
      
      // Skills and feats
      skills: {},
      feats: [],
      
      // Spell system integration
      spells: {
        known: [], // For spontaneous casters (sorcerer, bard)
        prepared: [], // For preparation casters (wizard, cleric, druid)
        slotsUsed: {}, // Spell slots used by level
        spellbook: [], // Wizard spellbook
        domains: [], // Cleric domains
        school: null, // Wizard specialization
        casterLevel: 0 // Effective caster level
      },
      
      // Equipment and inventory
      equipment: {
        weapons: [],
        armor: null,
        shield: null,
        items: [],
        money: { cp: 0, sp: 0, gp: 0, pp: 0 }
      },
      
      // Skills and feats
      skills: {},
      feats: [],
      spells: { known: [], prepared: [], slotsUsed: {} },
      
      // Character metadata
      createdAt: Date.now(),
      lastModified: Date.now(),
      experiencePoints: 0,
      background: options.background || this._generateBackground(),
      personality: options.personality || this._generatePersonality(),
      
      // Death tracking (permanent)
      deaths: 0,
      causeOfDeath: null,
      canBeResurrected: true
    };

    // Calculate derived statistics
    this._calculateDerivedStats(character);
    this._applyRacialModifiers(character);
    this._applyClassFeatures(character);
    
    // Assign starting equipment and wealth
    this._assignStartingEquipment(character);
    
    // Store character
    this.characters.set(character.id, character);
    this.activeCharacter = character.id;
    
    // Log creation
    this.characterHistory.push({
      type: 'character_created',
      characterId: character.id,
      characterName: character.name,
      timestamp: Date.now()
    });

    return character;
  }

  /**
   * Level up a character
   * @param {string} characterId - Character ID
   * @param {string} className - Class to level up in (for multiclass)
   * @param {Object} options - Level up options
   * @returns {Object} Level up result
   */
  levelUpCharacter(characterId, className = null, options = {}) {
    const character = this.getCharacter(characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    if (character.status === 'dead') {
      throw new Error('Dead characters cannot level up');
    }

    // Determine class to level in
    const levelClass = className || character.class;
    const classData = this.srdData ? this.srdData.getClass(levelClass) : this.classDefinitions[levelClass.toLowerCase()];
    
    if (!classData) {
      throw new Error(`Class ${levelClass} not found`);
    }

    // Initialize multiclass tracking if not exists
    if (!character.classes) {
      character.classes = {};
      character.classes[character.class.toLowerCase()] = character.level;
    }

    // Level up in specified class
    const currentClassLevel = character.classes[levelClass.toLowerCase()] || 0;
    character.classes[levelClass.toLowerCase()] = currentClassLevel + 1;
    character.level += 1;

    // Calculate new hit points
    const hitDie = classData.hitDie;
    const constitutionMod = Math.floor((character.abilities.constitution - 10) / 2);
    const hitPointGain = options.hitPointRoll || this.dice.roll(`1d${hitDie}`) + constitutionMod;
    character.hitPoints.maximum += Math.max(1, hitPointGain); // Minimum 1 HP per level
    character.hitPoints.current += Math.max(1, hitPointGain);

    // Update base attack bonus
    this._recalculateBaseAttackBonus(character);

    // Update saving throws
    this._recalculateSavingThrows(character);

    // Add skill points
    this._addSkillPoints(character, classData);

    // Check for class features and feats
    this._applyLevelFeatures(character, levelClass, character.classes[levelClass.toLowerCase()]);

    // Update spell progression
    if (classData.spellcasting) {
      this._updateSpellProgression(character, levelClass);
    }

    character.lastModified = Date.now();

    // Log level up
    this.characterHistory.push({
      type: 'level_up',
      characterId: character.id,
      characterName: character.name,
      newLevel: character.level,
      class: levelClass,
      timestamp: Date.now()
    });

    return {
      success: true,
      character: character,
      newLevel: character.level,
      hitPointGain: Math.max(1, hitPointGain),
      message: `${character.name} levels up to ${character.level}! (+${Math.max(1, hitPointGain)} HP)`
    };
  }

  /**
   * Add feat to character
   * @param {string} characterId - Character ID
   * @param {string} featName - Name of feat to add
   * @param {Object} options - Feat options (for variable feats like Weapon Focus)
   * @returns {Object} Add feat result
   */
  addFeat(characterId, featName, options = {}) {
    const character = this.getCharacter(characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    const featData = this.srdData ? this.srdData.getFeat(featName) : null;
    if (!featData) {
      throw new Error(`Feat ${featName} not found`);
    }

    // Check prerequisites
    const prereqCheck = this.srdData ? this.srdData.checkFeatPrerequisites(featName, character) : { meets: true };
    if (!prereqCheck.meets) {
      throw new Error(`Prerequisites not met: ${prereqCheck.reason}`);
    }

    // Check if already has feat (unless it can be taken multiple times)
    const existingFeat = character.feats.find(f => f.name === featName);
    if (existingFeat && !featData.special?.includes('multiple times')) {
      throw new Error(`Already has ${featName} feat`);
    }

    const feat = {
      name: featName,
      type: featData.type,
      benefit: featData.benefit,
      options: options,
      gainedAt: character.level,
      addedAt: Date.now()
    };

    character.feats.push(feat);
    character.lastModified = Date.now();

    return {
      success: true,
      feat: feat,
      message: `${character.name} gains ${featName} feat!`
    };
  }

  /**
   * Train skill for character
   * @param {string} characterId - Character ID
   * @param {string} skillName - Skill to train
   * @param {number} ranks - Number of ranks to add
   * @returns {Object} Training result
   */
  trainSkill(characterId, skillName, ranks = 1) {
    const character = this.getCharacter(characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    const skillData = this.srdData ? this.srdData.skills[skillName] : null;
    if (!skillData) {
      throw new Error(`Skill ${skillName} not found`);
    }

    // Initialize skill if not exists
    if (!character.skills[skillName]) {
      character.skills[skillName] = {
        ranks: 0,
        modifier: 0,
        classSkill: this._isClassSkill(character, skillName)
      };
    }

    const skill = character.skills[skillName];
    const currentRanks = skill.ranks;
    const maxRanks = character.level + 3; // Max ranks in any skill
    const maxCrossClassRanks = Math.floor((character.level + 3) / 2); // Max cross-class ranks

    // Check rank limits
    const isClassSkill = skill.classSkill;
    const effectiveMaxRanks = isClassSkill ? maxRanks : maxCrossClassRanks;

    if (currentRanks + ranks > effectiveMaxRanks) {
      throw new Error(`Cannot exceed maximum ranks (${effectiveMaxRanks}) for ${isClassSkill ? 'class' : 'cross-class'} skill`);
    }

    // Apply skill points
    skill.ranks += ranks;
    
    // Recalculate skill modifier
    const abilityMod = Math.floor((character.abilities[skillData.ability] - 10) / 2);
    skill.modifier = skill.ranks + abilityMod;
    
    // Apply synergy bonuses
    this._applySynergyBonuses(character, skillName);
    
    character.lastModified = Date.now();

    return {
      success: true,
      skill: skillName,
      ranks: skill.ranks,
      modifier: skill.modifier,
      message: `${character.name} trains ${skillName} (+${ranks} ranks)`
    };
  }

  // Private helper methods for character management

  /**
   * Recalculate base attack bonus from all classes
   * @private
   */
  _recalculateBaseAttackBonus(character) {
    let totalBAB = 0;
    
    if (character.classes) {
      for (const [className, level] of Object.entries(character.classes)) {
        const classData = this.srdData ? this.srdData.getClass(className) : this.classDefinitions[className];
        if (classData) {
          totalBAB += this._getBaseAttackBonusForLevel(classData.baseAttackProgression, level);
        }
      }
    } else {
      // Single class character
      const classData = this.srdData ? this.srdData.getClass(character.class) : this.classDefinitions[character.class.toLowerCase()];
      if (classData) {
        totalBAB = this._getBaseAttackBonusForLevel(classData.baseAttackProgression, character.level);
      }
    }
    
    character.baseAttackBonus = totalBAB;
  }

  /**
   * Get base attack bonus for a specific level and progression type
   * @private
   */
  _getBaseAttackBonusForLevel(progression, level) {
    switch (progression) {
      case 'good': return Math.floor(level * 1.0); // Full BAB progression
      case 'medium': return Math.floor(level * 0.75); // 3/4 BAB progression
      case 'poor': return Math.floor(level * 0.5); // 1/2 BAB progression
      default: return 0;
    }
  }

  /**
   * Recalculate saving throws from all classes
   * @private
   */
  _recalculateSavingThrows(character) {
    const saves = { fortitude: 0, reflex: 0, will: 0 };
    
    if (character.classes) {
      for (const [className, level] of Object.entries(character.classes)) {
        const classData = this.srdData ? this.srdData.getClass(className) : this.classDefinitions[className];
        if (classData && classData.savingThrows) {
          if (classData.savingThrows.fortitude === 'good') {
            saves.fortitude += Math.floor(level / 2) + 2;
          } else if (classData.savingThrows.fortitude === 'poor') {
            saves.fortitude += Math.floor(level / 3);
          }
          
          if (classData.savingThrows.reflex === 'good') {
            saves.reflex += Math.floor(level / 2) + 2;
          } else if (classData.savingThrows.reflex === 'poor') {
            saves.reflex += Math.floor(level / 3);
          }
          
          if (classData.savingThrows.will === 'good') {
            saves.will += Math.floor(level / 2) + 2;
          } else if (classData.savingThrows.will === 'poor') {
            saves.will += Math.floor(level / 3);
          }
        }
      }
    } else {
      // Single class character
      const classData = this.srdData ? this.srdData.getClass(character.class) : this.classDefinitions[character.class.toLowerCase()];
      if (classData) {
        saves.fortitude = this._getSaveBonus(classData.fortSave || 'poor', character.level);
        saves.reflex = this._getSaveBonus(classData.reflexSave || 'poor', character.level);
        saves.will = this._getSaveBonus(classData.willSave || 'poor', character.level);
      }
    }
    
    // Add ability modifiers
    saves.fortitude += Math.floor((character.abilities.constitution - 10) / 2);
    saves.reflex += Math.floor((character.abilities.dexterity - 10) / 2);
    saves.will += Math.floor((character.abilities.wisdom - 10) / 2);
    
    character.savingThrows = saves;
  }

  /**
   * Get save bonus for progression type and level
   * @private
   */
  _getSaveBonus(progression, level) {
    if (progression === 'good') {
      return Math.floor(level / 2) + 2;
    } else {
      return Math.floor(level / 3);
    }
  }

  /**
   * Add skill points for leveling up
   * @private
   */
  _addSkillPoints(character, classData) {
    const skillPoints = classData.skillPoints || 2;
    const intMod = Math.floor((character.abilities.intelligence - 10) / 2);
    const totalSkillPoints = Math.max(1, skillPoints + intMod); // Minimum 1 skill point
    
    // For simplicity, we'll just track that skill points are available
    if (!character.availableSkillPoints) {
      character.availableSkillPoints = 0;
    }
    character.availableSkillPoints += totalSkillPoints;
  }

  /**
   * Apply level-based class features
   * @private
   */
  _applyLevelFeatures(character, className, classLevel) {
    const classData = this.srdData ? this.srdData.getClass(className) : this.classDefinitions[className.toLowerCase()];
    if (!classData || !classData.classFeatures) return;

    const features = classData.classFeatures[classLevel];
    if (features) {
      if (!character.classFeatures) {
        character.classFeatures = [];
      }
      
      features.forEach(feature => {
        character.classFeatures.push({
          name: feature,
          class: className,
          level: classLevel,
          gainedAt: Date.now()
        });
      });
    }
  }

  /**
   * Update spell progression for spellcasting classes
   * @private
   */
  _updateSpellProgression(character, className) {
    if (this.spellManager) {
      const classLevel = character.classes[className.toLowerCase()];
      const spellSlots = this.spellManager.getSpellSlots(character);
      
      // Update caster level
      character.spells.casterLevel = this._getSpellcasterLevel(character);
      
      // For wizards, add spells to spellbook
      if (className.toLowerCase() === 'wizard') {
        this._addWizardSpells(character, classLevel);
      }
      
      // For spontaneous casters, handle known spells
      if (['sorcerer', 'bard'].includes(className.toLowerCase())) {
        this._updateKnownSpells(character, className, classLevel);
      }
    }
  }

  /**
   * Check if skill is a class skill for character
   * @private
   */
  _isClassSkill(character, skillName) {
    if (character.classes) {
      // Multiclass character - check all classes
      for (const className of Object.keys(character.classes)) {
        const classData = this.srdData ? this.srdData.getClass(className) : this.classDefinitions[className];
        if (classData && classData.classSkills && classData.classSkills.includes(skillName)) {
          return true;
        }
      }
      return false;
    } else {
      // Single class character
      const classData = this.srdData ? this.srdData.getClass(character.class) : this.classDefinitions[character.class.toLowerCase()];
      return classData && classData.classSkills && classData.classSkills.includes(skillName);
    }
  }

  /**
   * Apply synergy bonuses between skills
   * @private
   */
  _applySynergyBonuses(character, modifiedSkill) {
    const skillData = this.srdData ? this.srdData.skills[modifiedSkill] : null;
    if (!skillData || !skillData.synergies) return;

    // Apply synergies FROM this skill TO other skills
    for (const [targetSkill, requiredRanks] of Object.entries(skillData.synergies)) {
      if (character.skills[modifiedSkill] && character.skills[modifiedSkill].ranks >= requiredRanks) {
        if (character.skills[targetSkill]) {
          // Add +2 synergy bonus
          const targetSkillData = this.srdData.skills[targetSkill];
          if (targetSkillData) {
            const abilityMod = Math.floor((character.abilities[targetSkillData.ability] - 10) / 2);
            character.skills[targetSkill].modifier = character.skills[targetSkill].ranks + abilityMod + 2;
          }
        }
      }
    }

    // Check all other skills for synergies TO this skill
    for (const [skillName, skill] of Object.entries(character.skills)) {
      const otherSkillData = this.srdData ? this.srdData.skills[skillName] : null;
      if (otherSkillData && otherSkillData.synergies && otherSkillData.synergies[modifiedSkill]) {
        const requiredRanks = otherSkillData.synergies[modifiedSkill];
        if (skill.ranks >= requiredRanks) {
          // Add +2 synergy bonus to modified skill
          if (character.skills[modifiedSkill]) {
            const modifiedSkillData = this.srdData.skills[modifiedSkill];
            if (modifiedSkillData) {
              const abilityMod = Math.floor((character.abilities[modifiedSkillData.ability] - 10) / 2);
              character.skills[modifiedSkill].modifier = character.skills[modifiedSkill].ranks + abilityMod + 2;
            }
          }
        }
      }
    }
  }

  /**
   * Get effective spellcaster level for character
   * @private
   */
  _getSpellcasterLevel(character) {
    let casterLevel = 0;
    
    if (character.classes) {
      for (const [className, level] of Object.entries(character.classes)) {
        if (['wizard', 'cleric', 'druid', 'sorcerer'].includes(className)) {
          casterLevel += level; // Full casters
        } else if (['ranger', 'paladin'].includes(className)) {
          casterLevel += Math.floor(level / 2); // Half casters
        } else if (className === 'bard') {
          casterLevel += level; // Bards are full casters
        }
      }
    } else {
      // Single class
      const className = character.class.toLowerCase();
      if (['wizard', 'cleric', 'druid', 'sorcerer', 'bard'].includes(className)) {
        casterLevel = character.level;
      } else if (['ranger', 'paladin'].includes(className)) {
        casterLevel = Math.floor(character.level / 2);
      }
    }
    
    return casterLevel;
  }

  /**
   * Get character by ID
   * @param {string} characterId - Character ID
   * @returns {Object} Character object or null
   */
  getCharacter(characterId) {
    return this.characters.get(characterId) || null;
  }

  /**
   * Get active character
   * @returns {Object} Active character object or null
   */
  getActiveCharacter() {
    return this.activeCharacter ? this.characters.get(this.activeCharacter) : null;
  }

  /**
   * Set active character
   * @param {string} characterId - Character ID to set as active
   * @returns {boolean} Success status
   */
  setActiveCharacter(characterId) {
    if (this.characters.has(characterId)) {
      const character = this.characters.get(characterId);
      if (character.status === 'dead') {
        throw new Error(`Cannot activate dead character: ${character.name}. Dead characters cannot be loaded.`);
      }
      this.activeCharacter = characterId;
      return true;
    }
    return false;
  }

  /**
   * Deal damage to a character
   * @param {string} characterId - Character ID
   * @param {number} damage - Damage amount
   * @param {string} type - Damage type (optional)
   * @returns {Object} Damage result with status changes
   */
  dealDamage(characterId, damage, type = 'unspecified') {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    if (character.status === 'dead') {
      return {
        message: `${character.name} is already dead. No further damage can be dealt.`,
        statusChanged: false,
        newStatus: 'dead'
      };
    }

    const oldHp = character.hitPoints.current;
    const oldStatus = character.status;
    
    // Apply damage
    character.hitPoints.current -= damage;
    character.lastModified = Date.now();

    let statusChanged = false;
    let message = '';

    // Determine new status based on HP
    if (character.hitPoints.current <= 0) {
      const negativeDamage = Math.abs(character.hitPoints.current);
      
      if (negativeDamage >= character.hitPoints.maximum) {
        // Massive damage - instant death
        this._killCharacter(character, `Massive damage (${damage} ${type})`);
        statusChanged = true;
        message = `${character.name} has died from massive damage! Character is permanently dead.`;
      } else {
        // Unconscious/dying - set to exactly 0 HP for dying state
        character.hitPoints.current = -1; // Negative HP but not massive damage
        if (character.status !== 'dying') {
          character.status = 'dying';
          character.deathSaves = { successes: 0, failures: 0 };
          statusChanged = true;
          message = `${character.name} is now dying and must make death saving throws.`;
        } else {
          message = `${character.name} takes ${damage} damage and remains dying.`;
        }
      }
    } else {
      message = `${character.name} takes ${damage} ${type} damage. HP: ${character.hitPoints.current}/${character.hitPoints.maximum}`;
    }

    // Log damage event
    this.characterHistory.push({
      type: 'damage_taken',
      characterId,
      damage,
      damageType: type,
      oldHp,
      newHp: character.hitPoints.current,
      oldStatus,
      newStatus: character.status,
      timestamp: Date.now()
    });

    return {
      message,
      statusChanged,
      oldStatus,
      newStatus: character.status,
      oldHp,
      newHp: character.hitPoints.current,
      isDead: character.status === 'dead'
    };
  }

  /**
   * Make a death saving throw
   * @param {string} characterId - Character ID
   * @returns {Object} Death save result
   */
  makeDeathSave(characterId) {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    if (character.status !== 'dying') {
      return {
        message: `${character.name} is not dying and doesn't need death saving throws.`,
        canMakeDeathSave: false
      };
    }

    if (character.status === 'dead') {
      return {
        message: `${character.name} is already dead. Death saves are no longer possible.`,
        canMakeDeathSave: false
      };
    }

    const roll = this.dice.rollExpression('1d20');
    const success = roll.total >= 10;
    
    if (success) {
      character.deathSaves.successes++;
    } else {
      character.deathSaves.failures++;
    }

    let message = `${character.name} rolled ${roll.total} for death save: ${success ? 'SUCCESS' : 'FAILURE'}`;
    let statusChanged = false;

    // Check for stabilization (3 successes)
    if (character.deathSaves.successes >= 3) {
      character.status = 'unconscious';
      character.hitPoints.current = 1;
      character.deathSaves = { successes: 0, failures: 0 };
      statusChanged = true;
      message += `. ${character.name} is now stable and unconscious.`;
    }
    
    // Check for death (3 failures)
    else if (character.deathSaves.failures >= 3) {
      this._killCharacter(character, 'Failed death saving throws');
      statusChanged = true;
      message += `. ${character.name} has died! Character is permanently dead.`;
    }

    character.lastModified = Date.now();

    // Log death save
    this.characterHistory.push({
      type: 'death_save',
      characterId,
      roll: roll.total,
      success,
      successes: character.deathSaves.successes,
      failures: character.deathSaves.failures,
      newStatus: character.status,
      timestamp: Date.now()
    });

    return {
      message,
      roll: roll.total,
      success,
      successes: character.deathSaves.successes,
      failures: character.deathSaves.failures,
      statusChanged,
      newStatus: character.status,
      isDead: character.status === 'dead',
      canMakeDeathSave: character.status === 'dying'
    };
  }

  /**
   * Heal a character
   * @param {string} characterId - Character ID
   * @param {number} healing - Healing amount
   * @returns {Object} Healing result
   */
  healCharacter(characterId, healing) {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    if (character.status === 'dead') {
      return {
        message: `${character.name} is dead and cannot be healed through normal means. Only resurrection magic can restore them.`,
        healed: false
      };
    }

    const oldHp = character.hitPoints.current;
    const oldStatus = character.status;
    
    character.hitPoints.current = Math.min(
      character.hitPoints.current + healing,
      character.hitPoints.maximum
    );
    
    let statusChanged = false;
    if (character.status === 'unconscious' && character.hitPoints.current > 0) {
      character.status = 'alive';
      statusChanged = true;
    }
    if (character.status === 'dying' && character.hitPoints.current > 0) {
      character.status = 'alive';
      character.deathSaves = { successes: 0, failures: 0 };
      statusChanged = true;
    }

    character.lastModified = Date.now();

    const actualHealing = character.hitPoints.current - oldHp;
    const message = `${character.name} healed for ${actualHealing} HP. Current HP: ${character.hitPoints.current}/${character.hitPoints.maximum}`;

    // Log healing event
    this.characterHistory.push({
      type: 'healing_received',
      characterId,
      healing: actualHealing,
      oldHp,
      newHp: character.hitPoints.current,
      oldStatus,
      newStatus: character.status,
      timestamp: Date.now()
    });

    return {
      message,
      healing: actualHealing,
      oldHp,
      newHp: character.hitPoints.current,
      statusChanged,
      newStatus: character.status
    };
  }

  /**
   * Level up a character
   * @param {string} characterId - Character ID
   * @returns {Object} Level up result
   */
  levelUp(characterId) {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    if (character.status === 'dead') {
      throw new Error(`${character.name} is dead and cannot gain levels. Dead characters are permanently inactive.`);
    }

    const oldLevel = character.level;
    character.level++;
    
    // Roll for hit points (using class hit die)
    const hitDie = this.classDefinitions[character.class.toLowerCase()]?.hitDie || 8;
    const hpRoll = this.dice.rollExpression(`1d${hitDie}`);
    const conModifier = this._getAbilityModifier(character.abilities.constitution);
    const hpGain = Math.max(1, hpRoll.total + conModifier);
    
    character.hitPoints.maximum += hpGain;
    character.hitPoints.current += hpGain; // Restore full HP on level up
    
    // Recalculate derived stats
    this._calculateDerivedStats(character);
    character.lastModified = Date.now();

    // Log level up
    this.characterHistory.push({
      type: 'level_up',
      characterId,
      oldLevel,
      newLevel: character.level,
      hpGain,
      timestamp: Date.now()
    });

    return {
      message: `${character.name} reached level ${character.level}! Gained ${hpGain} hit points.`,
      oldLevel,
      newLevel: character.level,
      hpGain,
      newMaxHp: character.hitPoints.maximum
    };
  }

  /**
   * Get all living characters
   * @returns {Array} Array of living characters
   */
  getLivingCharacters() {
    return Array.from(this.characters.values()).filter(char => char.status !== 'dead');
  }

  /**
   * Get all dead characters (for memorial purposes)
   * @returns {Array} Array of dead characters
   */
  getDeadCharacters() {
    return Array.from(this.characters.values()).filter(char => char.status === 'dead');
  }

  /**
   * Get character creation statistics
   * @returns {Object} Creation statistics
   */
  getStatistics() {
    const allChars = Array.from(this.characters.values());
    
    return {
      totalCharacters: allChars.length,
      livingCharacters: allChars.filter(c => c.status !== 'dead').length,
      deadCharacters: allChars.filter(c => c.status === 'dead').length,
      averageLevel: allChars.length > 0 ? 
        (allChars.reduce((sum, c) => sum + c.level, 0) / allChars.length).toFixed(1) : 0,
      mostCommonRace: this._getMostCommon(allChars.map(c => c.race)),
      mostCommonClass: this._getMostCommon(allChars.map(c => c.class)),
      totalDeaths: allChars.reduce((sum, c) => sum + c.deaths, 0),
      deathRate: allChars.length > 0 ? 
        ((allChars.filter(c => c.status === 'dead').length / allChars.length) * 100).toFixed(1) + '%' : '0%'
    };
  }

  /**
   * Permanently kill a character
   * @private
   */
  _killCharacter(character, cause) {
    character.status = 'dead';
    character.deaths++;
    character.causeOfDeath = cause;
    character.deathSaves = { successes: 0, failures: 0 };
    character.hitPoints.current = 0;
    character.lastModified = Date.now();
    
    // If this was the active character, clear active status
    if (this.activeCharacter === character.id) {
      this.activeCharacter = null;
    }

    // Log death
    this.characterHistory.push({
      type: 'character_death',
      characterId: character.id,
      characterName: character.name,
      cause,
      level: character.level,
      timestamp: Date.now()
    });
  }

  /**
   * Roll ability scores using 3d6
   * @private
   */
  _rollAbilities() {
    return {
      strength: this.dice.rollExpression('3d6').total,
      dexterity: this.dice.rollExpression('3d6').total,
      constitution: this.dice.rollExpression('3d6').total,
      intelligence: this.dice.rollExpression('3d6').total,
      wisdom: this.dice.rollExpression('3d6').total,
      charisma: this.dice.rollExpression('3d6').total
    };
  }

  /**
   * Roll random race
   * @private
   */
  _rollRace() {
    const raceRoll = this.tables.rollTable('character-race');
    return raceRoll.value;
  }

  /**
   * Roll random class
   * @private
   */
  _rollClass() {
    const classRoll = this.tables.rollTable('character-class');
    return classRoll.value;
  }

  /**
   * Calculate ability modifier
   * @private
   */
  _getAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
  }

  /**
   * Calculate derived statistics
   * @private
   */
  _calculateDerivedStats(character) {
    // Base Attack Bonus (simplified)
    character.baseAttackBonus = Math.floor(character.level * 0.75);
    
    // Hit Points (if not set)
    if (character.hitPoints.maximum === 0) {
      const hitDie = this.classDefinitions[character.class.toLowerCase()]?.hitDie || 8;
      const conModifier = this._getAbilityModifier(character.abilities.constitution);
      character.hitPoints.maximum = Math.max(1, hitDie + conModifier);
      character.hitPoints.current = character.hitPoints.maximum;
    }
    
    // Armor Class (base 10 + Dex modifier)
    const dexModifier = this._getAbilityModifier(character.abilities.dexterity);
    character.armorClass = 10 + dexModifier;
    
    // Saving Throws (simplified base values)
    const conModifier = this._getAbilityModifier(character.abilities.constitution);
    const wisModifier = this._getAbilityModifier(character.abilities.wisdom);
    
    character.savingThrows = {
      fortitude: Math.floor(character.level / 3) + conModifier,
      reflex: Math.floor(character.level / 3) + dexModifier,
      will: Math.floor(character.level / 3) + wisModifier
    };
  }

  /**
   * Recalculate character statistics after level or attribute changes
   * @param {Object} character - The character to recalculate
   * @public
   */
  recalculateCharacterStats(character) {
    try {
      // Store current HP ratio to maintain relative health
      const hpRatio = character.hitPoints.current / character.hitPoints.maximum;
      
      // Recalculate all derived stats
      this._calculateDerivedStats(character);
      
      // Adjust current HP to maintain the same ratio (but not exceed new maximum)
      character.hitPoints.current = Math.min(
        Math.floor(character.hitPoints.maximum * hpRatio),
        character.hitPoints.maximum
      );
      
      // Ensure current HP is at least 1 if character was alive
      if (hpRatio > 0 && character.hitPoints.current <= 0) {
        character.hitPoints.current = 1;
      }
      
      console.log(`📊 Recalculated stats for ${character.name}`);
    } catch (error) {
      console.error('Error recalculating character stats:', error);
    }
  }

  /**
   * Apply racial modifiers
   * @private
   */
  _applyRacialModifiers(character) {
    const race = this.raceDefinitions[character.race.toLowerCase()];
    if (race && race.abilityModifiers) {
      Object.entries(race.abilityModifiers).forEach(([ability, modifier]) => {
        character.abilities[ability] += modifier;
      });
    }
  }

  /**
   * Apply class features
   * @private
   */
  _applyClassFeatures(character) {
    const classInfo = this.classDefinitions[character.class.toLowerCase()];
    if (classInfo) {
      // Class-specific modifications would go here
      // For now, we'll just ensure hit points are calculated correctly
      this._calculateDerivedStats(character);
    }
  }

  /**
   * Assign starting equipment
   * @private
   */
  _assignStartingEquipment(character) {
    const wealthRoll = this.tables.rollTable('starting-wealth');
    const diceExpression = wealthRoll.value.match(/(\d+d\d+)/)?.[1] || '4d4';
    const multiplier = wealthRoll.value.match(/× (\d+)/)?.[1] || '10';
    
    const goldRoll = this.dice.rollExpression(diceExpression);
    character.equipment.money.gp = goldRoll.total * parseInt(multiplier);
  }

  /**
   * Generate random character name
   * @private
   */
  _generateRandomName() {
    const firstNames = [
      'Aelar', 'Aramil', 'Arannis', 'Berris', 'Cithreth', 'Drannor', 'Galinndan', 'Hadarai',
      'Halimath', 'Heian', 'Himo', 'Immeral', 'Lamlis', 'Laucian', 'Mindartis', 'Naal',
      'Nutae', 'Paelynn', 'Peren', 'Quarion', 'Riardon', 'Rolen', 'Silvyr', 'Suhnaal',
      'Thamior', 'Tharivol', 'Theren', 'Theriatis', 'Thervan', 'Uthemar', 'Vanuath', 'Varis'
    ];
    
    const lastNames = [
      'Amakir', 'Amarthen', 'Amaruilos', 'Helder', 'Hornraven', 'Lackman', 'Stormwind',
      'Windrivver', 'Heradra', 'Kornauth', 'Moonwhisper', 'Schien', 'Telynnar', 'Tiltathana',
      'Wasanthi', 'Ilphelkiir', 'Iranapha', 'Liadon', 'Meliamne', 'Nailo', 'Siannodel',
      'Xiloscient', 'Alderleaf', 'Brushgather', 'Goodbarrel', 'Greenbottle', 'High-hill',
      'Hilltopple', 'Leagallow', 'Tealeaf', 'Thorngage', 'Tosscobble', 'Underbough'
    ];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  }

  /**
   * Generate random background
   * @private
   */
  _generateBackground() {
    const backgrounds = [
      'Acolyte', 'Criminal', 'Folk Hero', 'Noble', 'Sage', 'Soldier',
      'Charlatan', 'Entertainer', 'Guild Artisan', 'Hermit', 'Outlander', 'Sailor'
    ];
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  }

  /**
   * Generate random personality
   * @private
   */
  _generatePersonality() {
    const personalityResult = this.tables.rollTable('npc-personality');
    return personalityResult.value;
  }

  /**
   * Generate unique character ID
   * @private
   */
  _generateCharacterId() {
    return 'char_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Get most common element from array
   * @private
   */
  _getMostCommon(arr) {
    if (arr.length === 0) return 'None';
    
    const frequency = {};
    arr.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
    });
    
    return Object.keys(frequency).reduce((a, b) => 
      frequency[a] > frequency[b] ? a : b
    );
  }

  /**
   * Initialize race definitions
   * @private
   */
  _initializeRaces() {
    return {
      'human': { abilityModifiers: {}, size: 'Medium', speed: 30 },
      'elf': { abilityModifiers: { dexterity: 2, constitution: -2 }, size: 'Medium', speed: 30 },
      'dwarf': { abilityModifiers: { constitution: 2, charisma: -2 }, size: 'Medium', speed: 20 },
      'halfling': { abilityModifiers: { dexterity: 2, strength: -2 }, size: 'Small', speed: 20 },
      'gnome': { abilityModifiers: { constitution: 2, strength: -2 }, size: 'Small', speed: 20 },
      'half-elf': { abilityModifiers: {}, size: 'Medium', speed: 30 },
      'half-orc': { abilityModifiers: { strength: 2, intelligence: -2, charisma: -2 }, size: 'Medium', speed: 30 }
    };
  }

  /**
   * Initialize class definitions
   * @private
   */
  _initializeClasses() {
    return {
      'fighter': { hitDie: 10, baseAttackProgression: 'good', fortSave: 'good' },
      'wizard': { hitDie: 4, baseAttackProgression: 'poor', willSave: 'good' },
      'cleric': { hitDie: 8, baseAttackProgression: 'medium', fortSave: 'good', willSave: 'good' },
      'rogue': { hitDie: 6, baseAttackProgression: 'medium', reflexSave: 'good' },
      'ranger': { hitDie: 8, baseAttackProgression: 'good', fortSave: 'good', reflexSave: 'good' },
      'barbarian': { hitDie: 12, baseAttackProgression: 'good', fortSave: 'good' },
      'bard': { hitDie: 6, baseAttackProgression: 'medium', reflexSave: 'good', willSave: 'good' },
      'druid': { hitDie: 8, baseAttackProgression: 'medium', fortSave: 'good', willSave: 'good' },
      'monk': { hitDie: 8, baseAttackProgression: 'medium', fortSave: 'good', reflexSave: 'good', willSave: 'good' },
      'paladin': { hitDie: 10, baseAttackProgression: 'good', fortSave: 'good' },
      'sorcerer': { hitDie: 4, baseAttackProgression: 'poor', willSave: 'good' }
    };
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CharacterManager;
} else if (typeof window !== 'undefined') {
  window.CharacterManager = CharacterManager;
}
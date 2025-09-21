/**
 * D&D 3.5 Character Data Model
 * 
 * Complete character data structure following D&D 3.5 System Reference Document (SRD).
 * Handles all aspects of character creation, progression, and management including:
 * - Ability scores and modifiers
 * - Races and racial modifiers
 * - Classes and class features
 * - Skills and feats
 * - Equipment and inventory
 * - Spells and spell slots
 * - Combat statistics
 * - Experience and level progression
 * 
 * Requirements Traceability:
 * - REQ-003: D&D 3.5 SRD compliance
 * - US-001: Character creation core user story
 * - US-002: Race selection user story
 * - TS-003: Character data model specification
 * 
 * @version 1.0
 * @created September 21, 2025
 * @location code-repository/src/character-data-model.js
 */

class CharacterDataModel {
  constructor() {
    this.version = '1.0.0';
    this.srdVersion = '3.5';
    
    // Initialize data structures
    this.initializeDataStructures();
  }

  /**
   * Create a new character with default values
   * @param {Object} options - Character creation options
   * @returns {Object} New character object
   */
  createCharacter(options = {}) {
    const character = {
      // === Basic Information ===
      id: this.generateCharacterId(),
      name: options.name || '',
      player: options.player || '',
      race: options.race || 'Human',
      classes: options.classes || [{ name: 'Fighter', level: 1 }],
      level: this.calculateTotalLevel(options.classes || [{ name: 'Fighter', level: 1 }]),
      alignment: options.alignment || 'Neutral',
      deity: options.deity || '',
      experience: options.experience || 0,
      nextLevelXP: this.getNextLevelXP(1),
      
      // === Ability Scores ===
      abilities: {
        strength: options.abilities?.strength || 10,
        dexterity: options.abilities?.dexterity || 10,
        constitution: options.abilities?.constitution || 10,
        intelligence: options.abilities?.intelligence || 10,
        wisdom: options.abilities?.wisdom || 10,
        charisma: options.abilities?.charisma || 10
      },
      
      // Ability modifiers (calculated)
      abilityModifiers: {},
      
      // === Hit Points and Health ===
      hitPoints: {
        current: 0,
        maximum: 0,
        temporary: 0,
        nonlethalDamage: 0
      },
      
      // === Armor Class and Defense ===
      armorClass: {
        total: 10,
        base: 10,
        armor: 0,
        shield: 0,
        dexterity: 0,
        size: 0,
        natural: 0,
        deflection: 0,
        miscellaneous: 0,
        touch: 10,
        flatFooted: 10
      },
      
      // === Saving Throws ===
      savingThrows: {
        fortitude: { base: 0, ability: 0, magic: 0, miscellaneous: 0, total: 0 },
        reflex: { base: 0, ability: 0, magic: 0, miscellaneous: 0, total: 0 },
        will: { base: 0, ability: 0, magic: 0, miscellaneous: 0, total: 0 }
      },
      
      // === Combat Statistics ===
      combat: {
        baseAttackBonus: 0,
        meleeAttackBonus: 0,
        rangedAttackBonus: 0,
        initiative: 0,
        speed: 30, // Base speed in feet
        size: 'Medium',
        grapple: 0
      },
      
      // === Skills ===
      skills: this.initializeSkills(),
      
      // === Feats ===
      feats: [],
      
      // === Equipment and Inventory ===
      equipment: {
        armor: null,
        shield: null,
        weapons: [],
        gear: [],
        treasure: {
          platinum: 0,
          gold: 0,
          silver: 0,
          copper: 0
        }
      },
      
      // === Spells (for spellcasting classes) ===
      spells: {
        spellsKnown: {},
        spellsPerDay: {},
        spellsPrepared: {},
        spellLikeAbilities: [],
        casterLevel: 0
      },
      
      // === Race and Class Features ===
      raceFeatures: [],
      classFeatures: [],
      
      // === Physical Description ===
      description: {
        age: options.description?.age || 25,
        gender: options.description?.gender || '',
        height: options.description?.height || '',
        weight: options.description?.weight || '',
        eyes: options.description?.eyes || '',
        hair: options.description?.hair || '',
        skin: options.description?.skin || '',
        size: 'Medium'
      },
      
      // === Background and Roleplay ===
      background: {
        backstory: options.background?.backstory || '',
        personality: options.background?.personality || '',
        ideals: options.background?.ideals || '',
        bonds: options.background?.bonds || '',
        flaws: options.background?.flaws || ''
      },
      
      // === Character Notes ===
      notes: options.notes || '',
      
      // === Metadata ===
      metadata: {
        created: new Date(),
        lastModified: new Date(),
        version: this.version,
        srdCompliant: true,
        validationErrors: []
      }
    };
    
    // Calculate derived stats
    this.calculateDerivedStats(character);
    
    // Apply racial modifiers
    this.applyRacialModifiers(character);
    
    // Apply class features
    this.applyClassFeatures(character);
    
    // Validate character
    this.validateCharacter(character);
    
    return character;
  }

  /**
   * Calculate all derived statistics
   */
  calculateDerivedStats(character) {
    // Calculate ability modifiers
    for (const ability in character.abilities) {
      character.abilityModifiers[ability] = this.calculateAbilityModifier(character.abilities[ability]);
    }
    
    // Calculate hit points
    this.calculateHitPoints(character);
    
    // Calculate armor class
    this.calculateArmorClass(character);
    
    // Calculate saving throws
    this.calculateSavingThrows(character);
    
    // Calculate combat stats
    this.calculateCombatStats(character);
    
    // Calculate skill totals
    this.calculateSkillTotals(character);
    
    // Update last modified
    character.metadata.lastModified = new Date();
  }

  /**
   * Calculate ability modifier
   */
  calculateAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
  }

  /**
   * Calculate character hit points
   */
  calculateHitPoints(character) {
    let hitPoints = 0;
    const conModifier = character.abilityModifiers.constitution || 0;
    
    // Calculate HP for each class level
    for (const characterClass of character.classes) {
      const classData = this.classData[characterClass.name];
      if (classData) {
        // First level gets maximum hit die
        if (characterClass.level >= 1) {
          hitPoints += classData.hitDie;
        }
        
        // Subsequent levels get average (or could be rolled)
        if (characterClass.level > 1) {
          const averageHitDie = Math.floor(classData.hitDie / 2) + 1;
          hitPoints += averageHitDie * (characterClass.level - 1);
        }
        
        // Add constitution modifier per level
        hitPoints += conModifier * characterClass.level;
      }
    }
    
    // Minimum 1 HP per level
    hitPoints = Math.max(hitPoints, character.level);
    
    character.hitPoints.maximum = hitPoints;
    
    // Set current HP to maximum if not already set
    if (character.hitPoints.current === 0) {
      character.hitPoints.current = hitPoints;
    }
  }

  /**
   * Calculate armor class
   */
  calculateArmorClass(character) {
    const dexMod = character.abilityModifiers.dexterity || 0;
    const sizeMod = this.getSizeModifier(character.description.size);
    
    // Base AC calculation
    let ac = 10 + dexMod + sizeMod;
    ac += character.armorClass.armor;
    ac += character.armorClass.shield;
    ac += character.armorClass.natural;
    ac += character.armorClass.deflection;
    ac += character.armorClass.miscellaneous;
    
    character.armorClass.total = ac;
    character.armorClass.dexterity = dexMod;
    character.armorClass.size = sizeMod;
    
    // Touch AC (no armor, shield, or natural armor)
    character.armorClass.touch = 10 + dexMod + sizeMod + character.armorClass.deflection + character.armorClass.miscellaneous;
    
    // Flat-footed AC (no dex bonus)
    character.armorClass.flatFooted = ac - Math.max(dexMod, 0);
  }

  /**
   * Calculate saving throws
   */
  calculateSavingThrows(character) {
    // Base saves from classes
    character.savingThrows.fortitude.base = this.getBaseSave(character.classes, 'fortitude');
    character.savingThrows.reflex.base = this.getBaseSave(character.classes, 'reflex');
    character.savingThrows.will.base = this.getBaseSave(character.classes, 'will');
    
    // Ability modifiers
    character.savingThrows.fortitude.ability = character.abilityModifiers.constitution || 0;
    character.savingThrows.reflex.ability = character.abilityModifiers.dexterity || 0;
    character.savingThrows.will.ability = character.abilityModifiers.wisdom || 0;
    
    // Calculate totals
    for (const saveType in character.savingThrows) {
      const save = character.savingThrows[saveType];
      save.total = save.base + save.ability + save.magic + save.miscellaneous;
    }
  }

  /**
   * Calculate combat statistics
   */
  calculateCombatStats(character) {
    // Base attack bonus
    character.combat.baseAttackBonus = this.getBaseAttackBonus(character.classes);
    
    // Attack bonuses
    character.combat.meleeAttackBonus = character.combat.baseAttackBonus + (character.abilityModifiers.strength || 0);
    character.combat.rangedAttackBonus = character.combat.baseAttackBonus + (character.abilityModifiers.dexterity || 0);
    
    // Initiative
    character.combat.initiative = character.abilityModifiers.dexterity || 0;
    
    // Grapple
    character.combat.grapple = character.combat.baseAttackBonus + (character.abilityModifiers.strength || 0) + this.getSizeModifier(character.description.size, 'grapple');
  }

  /**
   * Calculate skill totals
   */
  calculateSkillTotals(character) {
    for (const skillName in character.skills) {
      const skill = character.skills[skillName];
      const skillData = this.skillData[skillName];
      
      if (skillData) {
        const abilityMod = character.abilityModifiers[skillData.keyAbility] || 0;
        skill.total = skill.ranks + abilityMod + skill.miscellaneous;
        
        // Check if skill is a class skill for any of the character's classes
        skill.isClassSkill = this.isClassSkill(skillName, character.classes);
        
        // Apply armor check penalty if applicable
        if (skillData.armorCheckPenalty) {
          skill.total += this.getArmorCheckPenalty(character);
        }
        
        // Trained only skills
        if (skillData.trainedOnly && skill.ranks === 0) {
          skill.total = 0;
          skill.canUse = false;
        } else {
          skill.canUse = true;
        }
      }
    }
  }

  /**
   * Apply racial modifiers and features
   */
  applyRacialModifiers(character) {
    const raceData = this.raceData[character.race];
    
    if (raceData) {
      // Apply ability score modifiers
      if (raceData.abilityModifiers) {
        for (const ability in raceData.abilityModifiers) {
          character.abilities[ability] += raceData.abilityModifiers[ability];
        }
      }
      
      // Apply size changes
      if (raceData.size) {
        character.description.size = raceData.size;
        character.combat.size = raceData.size;
      }
      
      // Apply speed changes
      if (raceData.speed) {
        character.combat.speed = raceData.speed;
      }
      
      // Add racial features
      if (raceData.features) {
        character.raceFeatures = [...raceData.features];
      }
      
      // Add racial skills
      if (raceData.skillBonuses) {
        for (const skillName in raceData.skillBonuses) {
          if (character.skills[skillName]) {
            character.skills[skillName].miscellaneous += raceData.skillBonuses[skillName];
          }
        }
      }
    }
  }

  /**
   * Apply class features and abilities
   */
  applyClassFeatures(character) {
    for (const characterClass of character.classes) {
      const classData = this.classData[characterClass.name];
      
      if (classData) {
        // Add class features for each level
        for (let level = 1; level <= characterClass.level; level++) {
          const levelFeatures = classData.features[level];
          if (levelFeatures) {
            character.classFeatures.push(...levelFeatures);
          }
        }
        
        // Set up spellcasting if applicable
        if (classData.spellcasting) {
          this.setupSpellcasting(character, characterClass, classData);
        }
      }
    }
  }

  /**
   * Set up spellcasting for a class
   */
  setupSpellcasting(character, characterClass, classData) {
    const spellcasting = classData.spellcasting;
    
    if (spellcasting.type === 'arcane' || spellcasting.type === 'divine') {
      character.spells.casterLevel = Math.max(character.spells.casterLevel, characterClass.level);
      
      // Set spells per day
      for (let spellLevel = 0; spellLevel <= 9; spellLevel++) {
        const spellsAtLevel = this.getSpellsPerDay(characterClass.name, characterClass.level, spellLevel);
        if (spellsAtLevel > 0) {
          if (!character.spells.spellsPerDay[characterClass.name]) {
            character.spells.spellsPerDay[characterClass.name] = {};
          }
          character.spells.spellsPerDay[characterClass.name][spellLevel] = spellsAtLevel;
        }
      }
    }
  }

  /**
   * Validate character for SRD compliance
   */
  validateCharacter(character) {
    const errors = [];
    
    // Validate ability scores
    for (const ability in character.abilities) {
      const score = character.abilities[ability];
      if (score < 1 || score > 50) {
        errors.push(`Invalid ${ability} score: ${score}. Must be between 1 and 50.`);
      }
    }
    
    // Validate classes
    if (character.classes.length === 0) {
      errors.push('Character must have at least one class.');
    }
    
    for (const characterClass of character.classes) {
      if (!this.classData[characterClass.name]) {
        errors.push(`Unknown class: ${characterClass.name}`);
      }
      
      if (characterClass.level < 1 || characterClass.level > 20) {
        errors.push(`Invalid class level: ${characterClass.level}. Must be between 1 and 20.`);
      }
    }
    
    // Validate race
    if (!this.raceData[character.race]) {
      errors.push(`Unknown race: ${character.race}`);
    }
    
    // Validate skill points
    const totalSkillPoints = this.calculateAvailableSkillPoints(character);
    const usedSkillPoints = this.calculateUsedSkillPoints(character);
    
    if (usedSkillPoints > totalSkillPoints) {
      errors.push(`Too many skill points used: ${usedSkillPoints}/${totalSkillPoints}`);
    }
    
    character.metadata.validationErrors = errors;
    character.metadata.srdCompliant = errors.length === 0;
    
    return errors.length === 0;
  }

  // === Helper Methods ===

  calculateTotalLevel(classes) {
    return classes.reduce((total, characterClass) => total + characterClass.level, 0);
  }

  generateCharacterId() {
    return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getSizeModifier(size, type = 'ac') {
    const sizeModifiers = {
      'Fine': { ac: 8, grapple: -16 },
      'Diminutive': { ac: 4, grapple: -12 },
      'Tiny': { ac: 2, grapple: -8 },
      'Small': { ac: 1, grapple: -4 },
      'Medium': { ac: 0, grapple: 0 },
      'Large': { ac: -1, grapple: 4 },
      'Huge': { ac: -2, grapple: 8 },
      'Gargantuan': { ac: -4, grapple: 12 },
      'Colossal': { ac: -8, grapple: 16 }
    };
    
    return sizeModifiers[size]?.[type] || 0;
  }

  getNextLevelXP(level) {
    // Standard XP progression
    const xpTable = [0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000, 55000, 66000, 78000, 91000, 105000, 120000, 136000, 153000, 171000, 190000];
    return xpTable[level] || (190000 + ((level - 19) * 20000));
  }

  getBaseSave(classes, saveType) {
    let baseSave = 0;
    for (const characterClass of classes) {
      const classData = this.classData[characterClass.name];
      if (classData && classData.baseSaves) {
        baseSave += this.getClassBaseSave(characterClass.name, characterClass.level, saveType);
      }
    }
    return baseSave;
  }

  getClassBaseSave(className, level, saveType) {
    const classData = this.classData[className];
    if (!classData || !classData.baseSaves) return 0;
    
    const progression = classData.baseSaves[saveType];
    if (progression === 'good') {
      return Math.floor(level / 2) + 2;
    } else if (progression === 'poor') {
      return Math.floor(level / 3);
    }
    return 0;
  }

  getBaseAttackBonus(classes) {
    let bab = 0;
    for (const characterClass of classes) {
      const classData = this.classData[characterClass.name];
      if (classData) {
        bab += this.getClassBaseAttackBonus(characterClass.name, characterClass.level);
      }
    }
    return bab;
  }

  getClassBaseAttackBonus(className, level) {
    const classData = this.classData[className];
    if (!classData) return 0;
    
    switch (classData.baseAttackBonus) {
      case 'full': return level;
      case 'medium': return Math.floor(3 * level / 4);
      case 'poor': return Math.floor(level / 2);
      default: return 0;
    }
  }

  // === Data Initialization ===

  initializeDataStructures() {
    this.initializeRaceData();
    this.initializeClassData();
    this.initializeSkillData();
    this.initializeFeatData();
  }

  initializeSkills() {
    const skills = {};
    
    // Initialize all skills with default values
    const skillList = [
      'Appraise', 'Balance', 'Bluff', 'Climb', 'Concentration', 'Craft',
      'Decipher Script', 'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist',
      'Forgery', 'Gather Information', 'Handle Animal', 'Heal', 'Hide',
      'Intimidate', 'Jump', 'Knowledge', 'Listen', 'Move Silently',
      'Open Lock', 'Perform', 'Profession', 'Ride', 'Search',
      'Sense Motive', 'Sleight of Hand', 'Speak Language', 'Spellcraft', 'Spot',
      'Survival', 'Swim', 'Tumble', 'Use Magic Device', 'Use Rope'
    ];
    
    for (const skillName of skillList) {
      skills[skillName] = {
        ranks: 0,
        miscellaneous: 0,
        total: 0,
        isClassSkill: false,
        canUse: true
      };
    }
    
    return skills;
  }

  initializeRaceData() {
    this.raceData = {
      'Human': {
        abilityModifiers: {},
        size: 'Medium',
        speed: 30,
        features: ['Extra Feat', 'Extra Skill Points'],
        skillBonuses: {},
        favoredClass: 'any'
      },
      'Elf': {
        abilityModifiers: { dexterity: 2, constitution: -2 },
        size: 'Medium',
        speed: 30,
        features: ['Low-light Vision', 'Keen Senses', 'Elven Immunities', 'Elven Magic'],
        skillBonuses: { 'Listen': 2, 'Search': 2, 'Spot': 2 },
        favoredClass: 'Wizard'
      },
      'Dwarf': {
        abilityModifiers: { constitution: 2, charisma: -2 },
        size: 'Medium',
        speed: 20,
        features: ['Darkvision 60ft', 'Stonecunning', 'Weapon Familiarity', 'Stability', 'Poison Resistance', 'Spell Resistance'],
        skillBonuses: { 'Appraise': 2, 'Craft': 2 },
        favoredClass: 'Fighter'
      },
      'Halfling': {
        abilityModifiers: { dexterity: 2, strength: -2 },
        size: 'Small',
        speed: 20,
        features: ['Small Size', 'Lucky', 'Fearless', 'Halfling Luck', 'Good Aim'],
        skillBonuses: { 'Climb': 2, 'Jump': 2, 'Listen': 2, 'Move Silently': 2 },
        favoredClass: 'Rogue'
      }
      // Additional races can be added here
    };
  }

  initializeClassData() {
    this.classData = {
      'Fighter': {
        hitDie: 10,
        skillPoints: 2,
        baseAttackBonus: 'full',
        baseSaves: { fortitude: 'good', reflex: 'poor', will: 'poor' },
        classSkills: ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Jump', 'Ride', 'Swim'],
        features: {
          1: ['Bonus Feat', 'Weapon and Armor Proficiency'],
          2: ['Bonus Feat'],
          3: [],
          4: ['Bonus Feat'],
          5: [],
          6: ['Bonus Feat']
          // Continue for all 20 levels
        },
        spellcasting: null
      },
      'Wizard': {
        hitDie: 4,
        skillPoints: 2,
        baseAttackBonus: 'poor',
        baseSaves: { fortitude: 'poor', reflex: 'poor', will: 'good' },
        classSkills: ['Concentration', 'Craft', 'Decipher Script', 'Knowledge', 'Profession', 'Spellcraft'],
        features: {
          1: ['Arcane Spells', 'Bonus Feat', 'Familiar'],
          5: ['Bonus Feat'],
          10: ['Bonus Feat'],
          15: ['Bonus Feat'],
          20: ['Bonus Feat']
        },
        spellcasting: {
          type: 'arcane',
          ability: 'intelligence',
          preparation: 'prepared'
        }
      },
      'Rogue': {
        hitDie: 6,
        skillPoints: 8,
        baseAttackBonus: 'medium',
        baseSaves: { fortitude: 'poor', reflex: 'good', will: 'poor' },
        classSkills: ['Appraise', 'Balance', 'Bluff', 'Climb', 'Craft', 'Decipher Script', 'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Forgery', 'Gather Information', 'Hide', 'Intimidate', 'Jump', 'Knowledge', 'Listen', 'Move Silently', 'Open Lock', 'Perform', 'Profession', 'Search', 'Sense Motive', 'Sleight of Hand', 'Spot', 'Swim', 'Tumble', 'Use Magic Device', 'Use Rope'],
        features: {
          1: ['Sneak Attack +1d6', 'Trapfinding'],
          2: ['Evasion'],
          3: ['Sneak Attack +2d6', 'Trap Sense +1'],
          4: ['Uncanny Dodge']
          // Continue for all levels
        },
        spellcasting: null
      }
      // Additional classes can be added here
    };
  }

  initializeSkillData() {
    this.skillData = {
      'Appraise': { keyAbility: 'intelligence', trainedOnly: false, armorCheckPenalty: false },
      'Balance': { keyAbility: 'dexterity', trainedOnly: false, armorCheckPenalty: true },
      'Bluff': { keyAbility: 'charisma', trainedOnly: false, armorCheckPenalty: false },
      'Climb': { keyAbility: 'strength', trainedOnly: false, armorCheckPenalty: true },
      'Concentration': { keyAbility: 'constitution', trainedOnly: false, armorCheckPenalty: false },
      'Craft': { keyAbility: 'intelligence', trainedOnly: false, armorCheckPenalty: false },
      'Decipher Script': { keyAbility: 'intelligence', trainedOnly: true, armorCheckPenalty: false },
      'Diplomacy': { keyAbility: 'charisma', trainedOnly: false, armorCheckPenalty: false },
      'Disable Device': { keyAbility: 'intelligence', trainedOnly: true, armorCheckPenalty: false },
      'Disguise': { keyAbility: 'charisma', trainedOnly: false, armorCheckPenalty: false },
      'Escape Artist': { keyAbility: 'dexterity', trainedOnly: false, armorCheckPenalty: true },
      'Forgery': { keyAbility: 'intelligence', trainedOnly: false, armorCheckPenalty: false },
      'Gather Information': { keyAbility: 'charisma', trainedOnly: false, armorCheckPenalty: false },
      'Handle Animal': { keyAbility: 'charisma', trainedOnly: true, armorCheckPenalty: false },
      'Heal': { keyAbility: 'wisdom', trainedOnly: false, armorCheckPenalty: false },
      'Hide': { keyAbility: 'dexterity', trainedOnly: false, armorCheckPenalty: true },
      'Intimidate': { keyAbility: 'charisma', trainedOnly: false, armorCheckPenalty: false },
      'Jump': { keyAbility: 'strength', trainedOnly: false, armorCheckPenalty: true },
      'Knowledge': { keyAbility: 'intelligence', trainedOnly: true, armorCheckPenalty: false },
      'Listen': { keyAbility: 'wisdom', trainedOnly: false, armorCheckPenalty: false },
      'Move Silently': { keyAbility: 'dexterity', trainedOnly: false, armorCheckPenalty: true },
      'Open Lock': { keyAbility: 'dexterity', trainedOnly: true, armorCheckPenalty: false },
      'Perform': { keyAbility: 'charisma', trainedOnly: false, armorCheckPenalty: false },
      'Profession': { keyAbility: 'wisdom', trainedOnly: true, armorCheckPenalty: false },
      'Ride': { keyAbility: 'dexterity', trainedOnly: false, armorCheckPenalty: false },
      'Search': { keyAbility: 'intelligence', trainedOnly: false, armorCheckPenalty: false },
      'Sense Motive': { keyAbility: 'wisdom', trainedOnly: false, armorCheckPenalty: false },
      'Sleight of Hand': { keyAbility: 'dexterity', trainedOnly: true, armorCheckPenalty: true },
      'Speak Language': { keyAbility: null, trainedOnly: true, armorCheckPenalty: false },
      'Spellcraft': { keyAbility: 'intelligence', trainedOnly: true, armorCheckPenalty: false },
      'Spot': { keyAbility: 'wisdom', trainedOnly: false, armorCheckPenalty: false },
      'Survival': { keyAbility: 'wisdom', trainedOnly: false, armorCheckPenalty: false },
      'Swim': { keyAbility: 'strength', trainedOnly: false, armorCheckPenalty: true },
      'Tumble': { keyAbility: 'dexterity', trainedOnly: true, armorCheckPenalty: true },
      'Use Magic Device': { keyAbility: 'charisma', trainedOnly: true, armorCheckPenalty: false },
      'Use Rope': { keyAbility: 'dexterity', trainedOnly: false, armorCheckPenalty: false }
    };
  }

  initializeFeatData() {
    this.featData = {
      'Alertness': { type: 'General', prerequisites: [], description: '+2 bonus on Listen and Spot checks' },
      'Combat Reflexes': { type: 'General', prerequisites: [], description: 'Additional attacks of opportunity' },
      'Dodge': { type: 'General', prerequisites: ['Dex 13'], description: '+1 dodge bonus to AC' },
      'Improved Initiative': { type: 'General', prerequisites: [], description: '+4 bonus on initiative checks' },
      'Iron Will': { type: 'General', prerequisites: [], description: '+2 bonus on Will saves' },
      'Lightning Reflexes': { type: 'General', prerequisites: [], description: '+2 bonus on Reflex saves' },
      'Great Fortitude': { type: 'General', prerequisites: [], description: '+2 bonus on Fortitude saves' },
      'Power Attack': { type: 'General', prerequisites: ['Str 13'], description: 'Trade attack bonus for damage' },
      'Weapon Focus': { type: 'General', prerequisites: ['BAB +1'], description: '+1 bonus on attack rolls with one weapon' }
      // Additional feats can be added here
    };
  }

  // === Additional Helper Methods ===

  isClassSkill(skillName, classes) {
    for (const characterClass of classes) {
      const classData = this.classData[characterClass.name];
      if (classData && classData.classSkills.includes(skillName)) {
        return true;
      }
    }
    return false;
  }

  getArmorCheckPenalty(character) {
    // Calculate armor check penalty from equipped armor and shield
    let penalty = 0;
    
    if (character.equipment.armor && character.equipment.armor.armorCheckPenalty) {
      penalty += character.equipment.armor.armorCheckPenalty;
    }
    
    if (character.equipment.shield && character.equipment.shield.armorCheckPenalty) {
      penalty += character.equipment.shield.armorCheckPenalty;
    }
    
    return penalty;
  }

  calculateAvailableSkillPoints(character) {
    let totalPoints = 0;
    
    for (const characterClass of character.classes) {
      const classData = this.classData[characterClass.name];
      if (classData) {
        let classPoints = (classData.skillPoints + (character.abilityModifiers.intelligence || 0)) * characterClass.level;
        
        // Humans get +1 skill point per level
        if (character.race === 'Human') {
          classPoints += characterClass.level;
        }
        
        // Minimum 1 skill point per level
        classPoints = Math.max(classPoints, characterClass.level);
        
        totalPoints += classPoints;
      }
    }
    
    return totalPoints;
  }

  calculateUsedSkillPoints(character) {
    let usedPoints = 0;
    
    for (const skillName in character.skills) {
      usedPoints += character.skills[skillName].ranks;
    }
    
    return usedPoints;
  }

  getSpellsPerDay(className, level, spellLevel) {
    // Simplified spells per day calculation
    // In a full implementation, this would reference spell progression tables
    if (className === 'Wizard') {
      const spellsPerDay = {
        0: [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        1: [1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4],
        // Add more spell levels...
      };
      
      return spellsPerDay[spellLevel]?.[level - 1] || 0;
    }
    
    return 0;
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CharacterDataModel;
}

if (typeof window !== 'undefined') {
  window.CharacterDataModel = CharacterDataModel;
}
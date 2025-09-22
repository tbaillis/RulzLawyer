/**
 * D&D 3.5 Character Creation Engine v1.0
 * Complete implementation of D&D 3.5 SRD character creation rules
 * 
 * Based on official SRD data and modern gaming interface patterns
 * Research-driven implementation following D&D Beyond design principles
 */

class CharacterCreationEngine {
  constructor(gameClient = null) {
    this.gameClient = gameClient;
    this.currentStep = 1;
    this.totalSteps = 7;
    this.character = this.initializeCharacter();
    this.validationErrors = [];
    
    // D&D 3.5 SRD Data
    this.raceData = this.initializeRaceData();
    this.classData = this.initializeClassData();
    this.skillData = this.initializeSkillData();
    
    console.log('🧙‍♂️ D&D 3.5 Character Creation Engine Initialized');
  }
  
  initializeCharacter() {
    return {
      id: this.generateId(),
      name: '',
      player: '',
      
      // Step 1: Ability Scores
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      },
      abilityMethod: null, // 'pointBuy', 'standardArray', 'rolled'
      
      // Step 2: Race
      race: null,
      raceFeatures: [],
      languages: ['Common'],
      
      // Step 3: Class
      classes: [], // Array to support multiclassing
      level: 1,
      hitDie: null,
      classFeatures: [],
      
      // Step 4: Skills
      skills: {},
      skillPoints: {
        available: 0,
        spent: 0
      },
      
      // Step 5: Feats
      feats: [],
      
      // Step 6: Equipment
      equipment: [],
      startingGold: 0,
      armorClass: {
        total: 10,
        base: 10,
        armor: 0,
        shield: 0,
        dexterity: 0,
        size: 0,
        natural: 0,
        deflection: 0,
        misc: 0
      },
      
      // Calculated Values
      hitPoints: {
        maximum: 0,
        current: 0,
        temporary: 0
      },
      savingThrows: {
        fortitude: { base: 0, ability: 0, magic: 0, misc: 0, total: 0 },
        reflex: { base: 0, ability: 0, magic: 0, misc: 0, total: 0 },
        will: { base: 0, ability: 0, magic: 0, misc: 0, total: 0 }
      },
      baseAttackBonus: 0,
      
      // Step 7: Finalization
      alignment: null,
      description: {
        age: '',
        gender: '',
        height: '',
        weight: '',
        eyes: '',
        hair: '',
        skin: ''
      },
      personality: {
        traits: '',
        ideals: '',
        bonds: '',
        flaws: ''
      },
      background: '',
      
      // Metadata
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isComplete: false
    };
  }
  
  initializeRaceData() {
    return {
      human: {
        name: 'Human',
        size: 'Medium',
        speed: 30,
        abilityAdjustments: {},
        specialAbilities: [
          'Extra Feat at 1st level',
          '4 extra skill points at 1st level',
          '1 extra skill point at each additional level'
        ],
        automaticLanguages: ['Common'],
        bonusLanguages: 'Any (except secret languages)',
        favoredClass: 'Any',
        description: 'Versatile and ambitious, humans are the most common race.'
      },
      dwarf: {
        name: 'Dwarf',
        size: 'Medium',
        speed: 20, // Not reduced by armor or load
        abilityAdjustments: { constitution: 2, charisma: -2 },
        specialAbilities: [
          'Darkvision 60 ft',
          'Stonecunning (+2 on Search checks for stonework)',
          'Weapon Familiarity (dwarven waraxe, dwarven urgrosh)',
          'Stability (+4 vs bull rush and trip)',
          '+2 vs poison saves',
          '+2 vs spells and spell-like effects',
          '+1 attack vs orcs and goblinoids',
          '+4 dodge AC vs giants',
          '+2 Appraise (stone/metal)',
          '+2 Craft (stone/metal)'
        ],
        automaticLanguages: ['Common', 'Dwarven'],
        bonusLanguages: ['Giant', 'Gnome', 'Goblin', 'Orc', 'Terran', 'Undercommon'],
        favoredClass: 'Fighter',
        description: 'Short, sturdy, and fond of the underground. Dwarves are known for their skill in warfare, their ability to withstand physical and magical punishment, their knowledge of the earth\'s secrets, their hard work, and their capacity for drinking ale.'
      },
      elf: {
        name: 'Elf',
        size: 'Medium',
        speed: 30,
        abilityAdjustments: { dexterity: 2, constitution: -2 },
        specialAbilities: [
          'Immunity to sleep effects',
          '+2 vs enchantment saves',
          'Low-light vision',
          'Weapon Proficiency (longsword, rapier, longbow, shortbow)',
          '+2 Listen, Search, and Spot',
          'Automatic Search check within 5 ft of secret doors'
        ],
        automaticLanguages: ['Common', 'Elven'],
        bonusLanguages: ['Draconic', 'Gnoll', 'Gnome', 'Goblin', 'Orc', 'Sylvan'],
        favoredClass: 'Wizard',
        description: 'Elves are known for their poetry, song, and magical arts, but when danger threatens they show great skill with weapons and strategy.'
      },
      gnome: {
        name: 'Gnome',
        size: 'Small',
        speed: 20,
        abilityAdjustments: { constitution: 2, strength: -2 },
        specialAbilities: [
          '+1 size bonus to AC and attack rolls',
          '+4 size bonus to Hide checks',
          'Low-light vision',
          'Weapon Familiarity (gnome hooked hammer)',
          '+2 vs illusion saves',
          '+1 DC for illusion spells cast by gnomes',
          '+1 attack vs kobolds and goblinoids',
          '+4 dodge AC vs giants',
          '+2 Listen checks',
          '+2 Craft (alchemy)',
          'Speak with burrowing mammals',
          'Spell-like abilities: dancing lights, ghost sound, prestidigitation (if Cha 10+)'
        ],
        automaticLanguages: ['Common', 'Gnome'],
        bonusLanguages: ['Draconic', 'Dwarven', 'Elven', 'Giant', 'Goblin', 'Orc'],
        favoredClass: 'Bard',
        description: 'Gnomes are welcome everywhere as technicians, alchemists, and inventors. Despite the demand for their skills, most gnomes prefer to remain among their own kind.'
      },
      'half-elf': {
        name: 'Half-Elf',
        size: 'Medium',
        speed: 30,
        abilityAdjustments: {},
        specialAbilities: [
          'Immunity to sleep effects',
          '+2 vs enchantment saves',
          'Low-light vision',
          '+1 Listen, Search, and Spot',
          '+2 Diplomacy and Gather Information',
          'Elven Blood (counts as elf for effects)'
        ],
        automaticLanguages: ['Common', 'Elven'],
        bonusLanguages: 'Any (except secret languages)',
        favoredClass: 'Any',
        description: 'Half-elves have no lands of their own, though they are welcome in human cities and elven forests. They are most common in areas where elves and humans interact.'
      },
      'half-orc': {
        name: 'Half-Orc',
        size: 'Medium',
        speed: 30,
        abilityAdjustments: { strength: 2, intelligence: -2, charisma: -2 },
        specialAbilities: [
          'Darkvision 60 ft',
          'Orc Blood (counts as orc for effects)'
        ],
        automaticLanguages: ['Common', 'Orc'],
        bonusLanguages: ['Draconic', 'Giant', 'Gnoll', 'Goblin', 'Abyssal'],
        favoredClass: 'Barbarian',
        description: 'Half-orcs are the short-tempered and sullen result of human and orc pairings. They are not evil by nature, but evil does lurk within them, whether they embrace it or rebel against it.',
        minIntelligence: 3
      },
      halfling: {
        name: 'Halfling',
        size: 'Small',
        speed: 20,
        abilityAdjustments: { dexterity: 2, strength: -2 },
        specialAbilities: [
          '+1 size bonus to AC and attack rolls',
          '+4 size bonus to Hide checks',
          '+2 Climb, Jump, and Move Silently',
          '+1 on all saving throws',
          '+2 morale bonus vs fear',
          '+1 attack with thrown weapons and slings',
          '+2 Listen checks'
        ],
        automaticLanguages: ['Common', 'Halfling'],
        bonusLanguages: ['Dwarven', 'Elven', 'Gnome', 'Goblin', 'Orc'],
        favoredClass: 'Rogue',
        description: 'Halflings are clever, capable opportunists. They demonstrate deft fingers and keen minds wherever they go.'
      }
    };
  }
  
  initializeClassData() {
    return {
      barbarian: {
        name: 'Barbarian',
        hitDie: 12,
        skillPoints: 4,
        primaryAbility: 'Strength',
        alignment: 'Any nonlawful',
        baseAttackBonus: 'High',
        fortitudeSave: 'High',
        reflexSave: 'Low',
        willSave: 'Low',
        classSkills: [
          'Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Jump',
          'Listen', 'Ride', 'Survival', 'Swim'
        ],
        weaponProficiencies: ['Simple', 'Martial'],
        armorProficiencies: ['Light', 'Medium', 'Shields (except tower)'],
        specialAbilities: {
          1: ['Fast Movement', 'Illiteracy', 'Rage 1/day'],
          2: ['Uncanny Dodge'],
          3: ['Trap Sense +1'],
          4: ['Rage 2/day'],
          5: ['Improved Uncanny Dodge']
        },
        description: 'A ferocious warrior who fights with primal fury. Barbarians are never truly civilized.'
      },
      bard: {
        name: 'Bard',
        hitDie: 6,
        skillPoints: 6,
        primaryAbility: 'Charisma',
        alignment: 'Any nonlawful',
        baseAttackBonus: 'Medium',
        fortitudeSave: 'Low',
        reflexSave: 'High',
        willSave: 'High',
        classSkills: [
          'Appraise', 'Balance', 'Bluff', 'Climb', 'Concentration',
          'Craft', 'Decipher Script', 'Diplomacy', 'Disguise',
          'Escape Artist', 'Gather Information', 'Hide', 'Jump',
          'Knowledge (all)', 'Listen', 'Move Silently', 'Perform',
          'Profession', 'Sense Motive', 'Sleight of Hand', 'Speak Language',
          'Spellcraft', 'Swim', 'Tumble', 'Use Magic Device'
        ],
        spellcasting: 'Spontaneous',
        spellAttribute: 'Charisma',
        description: 'A master of song, speech, and the magic they contain. Bards are artists above all else.'
      },
      cleric: {
        name: 'Cleric',
        hitDie: 8,
        skillPoints: 2,
        primaryAbility: 'Wisdom',
        alignment: 'Any',
        baseAttackBonus: 'Medium',
        fortitudeSave: 'High',
        reflexSave: 'Low',
        willSave: 'High',
        classSkills: [
          'Concentration', 'Craft', 'Diplomacy', 'Heal',
          'Knowledge (arcana)', 'Knowledge (history)', 'Knowledge (religion)',
          'Knowledge (the planes)', 'Profession', 'Spellcraft'
        ],
        spellcasting: 'Prepared',
        spellAttribute: 'Wisdom',
        description: 'A divine spellcaster who serves a particular deity and can heal wounds, cast divine spells, and guide others.'
      },
      druid: {
        name: 'Druid',
        hitDie: 8,
        skillPoints: 4,
        primaryAbility: 'Wisdom',
        alignment: 'Any neutral',
        baseAttackBonus: 'Medium',
        fortitudeSave: 'High',
        reflexSave: 'Low',
        willSave: 'High',
        classSkills: [
          'Concentration', 'Craft', 'Diplomacy', 'Handle Animal', 'Heal',
          'Knowledge (nature)', 'Listen', 'Profession', 'Ride',
          'Spellcraft', 'Spot', 'Survival', 'Swim'
        ],
        spellcasting: 'Prepared',
        spellAttribute: 'Wisdom',
        description: 'A divine spellcaster empowered by nature itself or by a nature deity.'
      },
      fighter: {
        name: 'Fighter',
        hitDie: 10,
        skillPoints: 2,
        primaryAbility: 'Strength or Dexterity',
        alignment: 'Any',
        baseAttackBonus: 'High',
        fortitudeSave: 'High',
        reflexSave: 'Low',
        willSave: 'Low',
        classSkills: [
          'Climb', 'Craft', 'Handle Animal', 'Intimidate',
          'Jump', 'Ride', 'Swim'
        ],
        weaponProficiencies: ['Simple', 'Martial'],
        armorProficiencies: ['All', 'Shields (including tower)'],
        specialAbilities: {
          1: ['Bonus Feat'],
          2: ['Bonus Feat'],
          4: ['Bonus Feat'],
          6: ['Bonus Feat']
        },
        description: 'A master of martial combat, skilled with a variety of weapons and armor.'
      },
      monk: {
        name: 'Monk',
        hitDie: 8,
        skillPoints: 4,
        primaryAbility: 'Dexterity and Wisdom',
        alignment: 'Any lawful',
        baseAttackBonus: 'Medium',
        fortitudeSave: 'High',
        reflexSave: 'High',
        willSave: 'High',
        classSkills: [
          'Balance', 'Climb', 'Concentration', 'Craft', 'Diplomacy',
          'Escape Artist', 'Hide', 'Jump', 'Knowledge (arcana)',
          'Knowledge (religion)', 'Listen', 'Move Silently', 'Perform',
          'Profession', 'Sense Motive', 'Spot', 'Swim', 'Tumble'
        ],
        description: 'A martial artist whose unarmed strikes hit fast and hard. Monks care little for material possessions.'
      },
      paladin: {
        name: 'Paladin',
        hitDie: 10,
        skillPoints: 2,
        primaryAbility: 'Charisma',
        alignment: 'Lawful good only',
        baseAttackBonus: 'High',
        fortitudeSave: 'High',
        reflexSave: 'Low',
        willSave: 'Low',
        classSkills: [
          'Concentration', 'Craft', 'Diplomacy', 'Handle Animal',
          'Heal', 'Knowledge (nobility)', 'Knowledge (religion)',
          'Profession', 'Ride', 'Sense Motive'
        ],
        spellcasting: 'Prepared (limited)',
        spellAttribute: 'Wisdom',
        description: 'A holy warrior dedicated to good and law, and to the service of a good deity.'
      },
      ranger: {
        name: 'Ranger',
        hitDie: 8,
        skillPoints: 6,
        primaryAbility: 'Dexterity',
        alignment: 'Any',
        baseAttackBonus: 'High',
        fortitudeSave: 'High',
        reflexSave: 'High',
        willSave: 'Low',
        classSkills: [
          'Climb', 'Concentration', 'Craft', 'Handle Animal', 'Heal',
          'Hide', 'Jump', 'Knowledge (dungeoneering)', 'Knowledge (geography)',
          'Knowledge (nature)', 'Listen', 'Move Silently', 'Profession',
          'Ride', 'Search', 'Spot', 'Survival', 'Swim', 'Use Rope'
        ],
        spellcasting: 'Prepared (limited)',
        spellAttribute: 'Wisdom',
        description: 'A skilled hunter and tracker who knows the ways of the wilderness.'
      },
      rogue: {
        name: 'Rogue',
        hitDie: 6,
        skillPoints: 8,
        primaryAbility: 'Dexterity',
        alignment: 'Any',
        baseAttackBonus: 'Medium',
        fortitudeSave: 'Low',
        reflexSave: 'High',
        willSave: 'Low',
        classSkills: [
          'Appraise', 'Balance', 'Bluff', 'Climb', 'Craft', 'Decipher Script',
          'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist',
          'Forgery', 'Gather Information', 'Hide', 'Intimidate', 'Jump',
          'Knowledge (local)', 'Listen', 'Move Silently', 'Open Lock',
          'Perform', 'Profession', 'Search', 'Sense Motive',
          'Sleight of Hand', 'Spot', 'Swim', 'Tumble', 'Use Magic Device',
          'Use Rope'
        ],
        description: 'A scoundrel who fights with guile rather than brute force. Rogues are skilled at what they do.'
      },
      sorcerer: {
        name: 'Sorcerer',
        hitDie: 4,
        skillPoints: 2,
        primaryAbility: 'Charisma',
        alignment: 'Any',
        baseAttackBonus: 'Low',
        fortitudeSave: 'Low',
        reflexSave: 'Low',
        willSave: 'High',
        classSkills: [
          'Bluff', 'Concentration', 'Craft', 'Knowledge (arcana)',
          'Profession', 'Spellcraft'
        ],
        spellcasting: 'Spontaneous',
        spellAttribute: 'Charisma',
        description: 'A spellcaster who draws on inherent magic from a draconic bloodline, a fey influence, or exposure to elemental forces.'
      },
      wizard: {
        name: 'Wizard',
        hitDie: 4,
        skillPoints: 2,
        primaryAbility: 'Intelligence',
        alignment: 'Any',
        baseAttackBonus: 'Low',
        fortitudeSave: 'Low',
        reflexSave: 'Low',
        willSave: 'High',
        classSkills: [
          'Concentration', 'Craft', 'Decipher Script', 'Knowledge (all)',
          'Profession', 'Spellcraft'
        ],
        spellcasting: 'Prepared',
        spellAttribute: 'Intelligence',
        description: 'A potent spellcaster trained in the arcane arts. Wizards are supreme magic-users.'
      }
    };
  }
  
  initializeSkillData() {
    return {
      'Appraise': { keyAbility: 'Int', trainedOnly: false },
      'Balance': { keyAbility: 'Dex', trainedOnly: false },
      'Bluff': { keyAbility: 'Cha', trainedOnly: false },
      'Climb': { keyAbility: 'Str', trainedOnly: false },
      'Concentration': { keyAbility: 'Con', trainedOnly: false },
      'Craft': { keyAbility: 'Int', trainedOnly: false },
      'Decipher Script': { keyAbility: 'Int', trainedOnly: true },
      'Diplomacy': { keyAbility: 'Cha', trainedOnly: false },
      'Disable Device': { keyAbility: 'Int', trainedOnly: true },
      'Disguise': { keyAbility: 'Cha', trainedOnly: false },
      'Escape Artist': { keyAbility: 'Dex', trainedOnly: false },
      'Forgery': { keyAbility: 'Int', trainedOnly: false },
      'Gather Information': { keyAbility: 'Cha', trainedOnly: false },
      'Handle Animal': { keyAbility: 'Cha', trainedOnly: true },
      'Heal': { keyAbility: 'Wis', trainedOnly: false },
      'Hide': { keyAbility: 'Dex', trainedOnly: false },
      'Intimidate': { keyAbility: 'Cha', trainedOnly: false },
      'Jump': { keyAbility: 'Str', trainedOnly: false },
      'Knowledge (arcana)': { keyAbility: 'Int', trainedOnly: true },
      'Knowledge (history)': { keyAbility: 'Int', trainedOnly: true },
      'Knowledge (local)': { keyAbility: 'Int', trainedOnly: true },
      'Knowledge (nature)': { keyAbility: 'Int', trainedOnly: true },
      'Knowledge (nobility)': { keyAbility: 'Int', trainedOnly: true },
      'Knowledge (religion)': { keyAbility: 'Int', trainedOnly: true },
      'Listen': { keyAbility: 'Wis', trainedOnly: false },
      'Move Silently': { keyAbility: 'Dex', trainedOnly: false },
      'Open Lock': { keyAbility: 'Dex', trainedOnly: true },
      'Perform': { keyAbility: 'Cha', trainedOnly: false },
      'Profession': { keyAbility: 'Wis', trainedOnly: true },
      'Ride': { keyAbility: 'Dex', trainedOnly: false },
      'Search': { keyAbility: 'Int', trainedOnly: false },
      'Sense Motive': { keyAbility: 'Wis', trainedOnly: false },
      'Sleight of Hand': { keyAbility: 'Dex', trainedOnly: true },
      'Speak Language': { keyAbility: 'None', trainedOnly: true },
      'Spellcraft': { keyAbility: 'Int', trainedOnly: true },
      'Spot': { keyAbility: 'Wis', trainedOnly: false },
      'Survival': { keyAbility: 'Wis', trainedOnly: false },
      'Swim': { keyAbility: 'Str', trainedOnly: false },
      'Tumble': { keyAbility: 'Dex', trainedOnly: true },
      'Use Magic Device': { keyAbility: 'Cha', trainedOnly: true },
      'Use Rope': { keyAbility: 'Dex', trainedOnly: false }
    };
  }
  
  // Step Navigation
  nextStep() {
    if (this.currentStep < this.totalSteps && this.validateCurrentStep()) {
      this.currentStep++;
      this.updateCharacterCalculations();
      return true;
    }
    return false;
  }
  
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      return true;
    }
    return false;
  }
  
  goToStep(step) {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
      return true;
    }
    return false;
  }
  
  // Step 1: Ability Scores
  generateAbilityScores(method) {
    this.character.abilityMethod = method;
    
    switch (method) {
      case 'pointBuy':
        this.character.abilityScores = {
          strength: 8,
          dexterity: 8,
          constitution: 8,
          intelligence: 8,
          wisdom: 8,
          charisma: 8
        };
        // Player will allocate 28 points
        break;
        
      case 'standardArray':
        // Standard array: 15, 14, 13, 12, 10, 8
        this.character.abilityScores = {
          strength: 15,
          dexterity: 14,
          constitution: 13,
          intelligence: 12,
          wisdom: 10,
          charisma: 8
        };
        break;
        
      case 'rolled':
        for (let ability in this.character.abilityScores) {
          this.character.abilityScores[ability] = this.rollAbilityScore();
        }
        break;
    }
    
    return this.character.abilityScores;
  }
  
  rollAbilityScore() {
    const rolls = [];
    for (let i = 0; i < 4; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
  }
  
  setAbilityScore(ability, value) {
    if (this.character.abilityScores.hasOwnProperty(ability)) {
      this.character.abilityScores[ability] = Math.max(1, Math.min(50, value));
      this.updateCharacterCalculations();
      return true;
    }
    return false;
  }
  
  getAbilityModifier(abilityScore) {
    return Math.floor((abilityScore - 10) / 2);
  }
  
  // Step 2: Race Selection
  setRace(raceKey) {
    if (this.raceData[raceKey]) {
      this.character.race = raceKey;
      this.applyRacialAdjustments();
      this.updateCharacterCalculations();
      return true;
    }
    return false;
  }
  
  applyRacialAdjustments() {
    const race = this.raceData[this.character.race];
    if (!race) return;
    
    // Apply ability score adjustments
    for (let [ability, adjustment] of Object.entries(race.abilityAdjustments || {})) {
      this.character.abilityScores[ability] += adjustment;
      
      // Handle half-orc minimum intelligence
      if (this.character.race === 'half-orc' && ability === 'intelligence') {
        this.character.abilityScores.intelligence = Math.max(3, this.character.abilityScores.intelligence);
      }
    }
    
    // Set languages
    this.character.languages = [...race.automaticLanguages];
    
    // Store racial features
    this.character.raceFeatures = [...race.specialAbilities];
  }
  
  // Step 3: Class Selection  
  addClass(classKey, isPrimary = false) {
    if (this.classData[classKey]) {
      const classInfo = this.classData[classKey];
      const classLevel = {
        name: classKey,
        level: 1,
        hitDie: classInfo.hitDie,
        skillPoints: classInfo.skillPoints,
        isPrimary: isPrimary
      };
      
      if (isPrimary || this.character.classes.length === 0) {
        this.character.classes.unshift(classLevel);
      } else {
        this.character.classes.push(classLevel);
      }
      
      this.calculateSkillPoints();
      this.updateCharacterCalculations();
      return true;
    }
    return false;
  }
  
  calculateSkillPoints() {
    let totalSkillPoints = 0;
    
    for (let classLevel of this.character.classes) {
      const classInfo = this.classData[classLevel.name];
      let classSkillPoints = classInfo.skillPoints + this.getAbilityModifier(this.character.abilityScores.intelligence);
      
      // Humans get +1 skill point per level
      if (this.character.race === 'human') {
        classSkillPoints += 1;
      }
      
      // First level gets x4 skill points
      if (this.character.level === 1) {
        classSkillPoints *= 4;
      }
      
      totalSkillPoints += classSkillPoints * classLevel.level;
    }
    
    this.character.skillPoints.available = totalSkillPoints;
  }
  
  // Step 4: Skills
  setSkillRanks(skillName, ranks) {
    const maxRanks = this.character.level + 3; // Max ranks at 1st level
    ranks = Math.max(0, Math.min(maxRanks, ranks));
    
    const oldRanks = this.character.skills[skillName] || 0;
    const rankDifference = ranks - oldRanks;
    
    if (this.character.skillPoints.spent + rankDifference <= this.character.skillPoints.available) {
      this.character.skills[skillName] = ranks;
      this.character.skillPoints.spent += rankDifference;
      return true;
    }
    return false;
  }
  
  // Step 5: Feats
  addFeat(featName) {
    this.character.feats.push(featName);
  }
  
  // Step 6: Equipment
  addEquipment(item) {
    this.character.equipment.push(item);
    this.updateCharacterCalculations();
  }
  
  // Calculations
  updateCharacterCalculations() {
    this.calculateHitPoints();
    this.calculateArmorClass();
    this.calculateSavingThrows();
    this.calculateBaseAttackBonus();
    this.character.lastModified = new Date().toISOString();
  }
  
  calculateHitPoints() {
    let totalHitPoints = 0;
    
    for (let classLevel of this.character.classes) {
      // First level gets max hit die
      if (classLevel.level === 1) {
        totalHitPoints += classLevel.hitDie;
      } else {
        // For simplicity, use average for additional levels
        totalHitPoints += Math.floor(classLevel.hitDie / 2 + 1) * (classLevel.level - 1);
      }
    }
    
    // Add Constitution modifier per level
    const conModifier = this.getAbilityModifier(this.character.abilityScores.constitution);
    totalHitPoints += conModifier * this.character.level;
    
    this.character.hitPoints.maximum = Math.max(1, totalHitPoints);
    this.character.hitPoints.current = this.character.hitPoints.maximum;
  }
  
  calculateArmorClass() {
    const dexModifier = this.getAbilityModifier(this.character.abilityScores.dexterity);
    let sizeBonus = 0;
    
    // Size bonus from race
    if (this.character.race) {
      const race = this.raceData[this.character.race];
      if (race && race.size === 'Small') {
        sizeBonus = 1;
      }
    }
    
    this.character.armorClass = {
      base: 10,
      armor: 0, // Will be calculated from equipment
      shield: 0, // Will be calculated from equipment
      dexterity: dexModifier,
      size: sizeBonus,
      natural: 0,
      deflection: 0,
      misc: 0,
      total: 10 + dexModifier + sizeBonus
    };
  }
  
  calculateSavingThrows() {
    const conModifier = this.getAbilityModifier(this.character.abilityScores.constitution);
    const dexModifier = this.getAbilityModifier(this.character.abilityScores.dexterity);
    const wisModifier = this.getAbilityModifier(this.character.abilityScores.wisdom);
    
    // Base saves from classes
    let fortBase = 0, refBase = 0, willBase = 0;
    
    for (let classLevel of this.character.classes) {
      const classInfo = this.classData[classLevel.name];
      // Simplified calculation - would need full progression tables
      if (classInfo.fortitudeSave === 'High') fortBase += Math.floor(classLevel.level / 2) + 2;
      else fortBase += Math.floor(classLevel.level / 3);
      
      if (classInfo.reflexSave === 'High') refBase += Math.floor(classLevel.level / 2) + 2;
      else refBase += Math.floor(classLevel.level / 3);
      
      if (classInfo.willSave === 'High') willBase += Math.floor(classLevel.level / 2) + 2;
      else willBase += Math.floor(classLevel.level / 3);
    }
    
    this.character.savingThrows = {
      fortitude: {
        base: fortBase,
        ability: conModifier,
        magic: 0,
        misc: 0,
        total: fortBase + conModifier
      },
      reflex: {
        base: refBase,
        ability: dexModifier,
        magic: 0,
        misc: 0,
        total: refBase + dexModifier
      },
      will: {
        base: willBase,
        ability: wisModifier,
        magic: 0,
        misc: 0,
        total: willBase + wisModifier
      }
    };
  }
  
  calculateBaseAttackBonus() {
    let totalBAB = 0;
    
    for (let classLevel of this.character.classes) {
      const classInfo = this.classData[classLevel.name];
      
      if (classInfo.baseAttackBonus === 'High') {
        totalBAB += classLevel.level;
      } else if (classInfo.baseAttackBonus === 'Medium') {
        totalBAB += Math.floor(classLevel.level * 3 / 4);
      } else { // Low
        totalBAB += Math.floor(classLevel.level / 2);
      }
    }
    
    this.character.baseAttackBonus = totalBAB;
  }
  
  // Validation
  validateCurrentStep() {
    this.validationErrors = [];
    
    switch (this.currentStep) {
      case 1: // Ability Scores
        if (!this.character.abilityMethod) {
          this.validationErrors.push('Please select an ability score generation method');
        }
        break;
        
      case 2: // Race
        if (!this.character.race) {
          this.validationErrors.push('Please select a race');
        }
        break;
        
      case 3: // Class
        if (this.character.classes.length === 0) {
          this.validationErrors.push('Please select at least one class');
        }
        break;
        
      case 4: // Skills
        if (this.character.skillPoints.spent > this.character.skillPoints.available) {
          this.validationErrors.push('You have allocated more skill points than available');
        }
        break;
    }
    
    return this.validationErrors.length === 0;
  }
  
  // Character completion
  finalizeCharacter() {
    if (this.character.name.trim().length === 0) {
      this.validationErrors.push('Character must have a name');
    }
    
    if (this.validationErrors.length === 0) {
      this.character.isComplete = true;
      this.updateCharacterCalculations();
      return true;
    }
    return false;
  }
  
  // Utility methods
  generateId() {
    return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  getCharacterSummary() {
    return {
      id: this.character.id,
      name: this.character.name,
      race: this.character.race,
      classes: this.character.classes.map(c => `${c.name} ${c.level}`).join('/'),
      level: this.character.level,
      hitPoints: this.character.hitPoints.maximum,
      armorClass: this.character.armorClass.total,
      abilityScores: this.character.abilityScores,
      isComplete: this.character.isComplete
    };
  }
  
  exportCharacter() {
    return JSON.parse(JSON.stringify(this.character));
  }
  
  importCharacter(characterData) {
    this.character = { ...this.character, ...characterData };
    this.updateCharacterCalculations();
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CharacterCreationEngine;
} else if (typeof window !== 'undefined') {
  window.CharacterCreationEngine = CharacterCreationEngine;
}
/**
 * Complete D&D 3.5 Character Data Model
 * Based on official SRD specifications
 * 
 * @version 1.0
 * @date December 2024
 * @location code-repository/src/dnd-character-model.js
 */

class DnD35CharacterModel {
  static createEmptyCharacter() {
    return {
      // Basic Identity
      id: null,
      name: '',
      race: '',
      alignment: '',
      class: '',
      level: 1,
      
      // Ability Scores (6 core abilities)
      abilities: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      },
      
      // Ability Modifiers (calculated from scores)
      abilityModifiers: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
      },
      
      // Hit Points and Combat Stats
      hitPoints: {
        current: 0,
        maximum: 0,
        temporary: 0
      },
      
      armorClass: {
        total: 10,
        armor: 0,
        shield: 0,
        dexterity: 0,
        size: 0,
        natural: 0,
        deflection: 0,
        misc: 0,
        touch: 10,
        flatFooted: 10
      },
      
      baseAttackBonus: 0,
      
      // Saving Throws
      savingThrows: {
        fortitude: { base: 0, ability: 0, magic: 0, misc: 0, total: 0 },
        reflex: { base: 0, ability: 0, magic: 0, misc: 0, total: 0 },
        will: { base: 0, ability: 0, magic: 0, misc: 0, total: 0 }
      },
      
      // Skills (Complete D&D 3.5 skill list)
      skills: {
        appraise: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'intelligence' },
        balance: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'dexterity' },
        bluff: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'charisma' },
        climb: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'strength' },
        concentration: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'constitution' },
        craft: {}, // Multiple craft skills
        decipherScript: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'intelligence' },
        diplomacy: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'charisma' },
        disableDevice: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'intelligence' },
        disguise: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'charisma' },
        escapeArtist: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'dexterity' },
        forgery: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'intelligence' },
        gatherInformation: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'charisma' },
        handleAnimal: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'charisma' },
        heal: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'wisdom' },
        hide: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'dexterity' },
        intimidate: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'charisma' },
        jump: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'strength' },
        knowledge: {}, // Multiple knowledge skills
        listen: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'wisdom' },
        moveSilently: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'dexterity' },
        openLock: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'dexterity' },
        perform: {}, // Multiple perform skills
        profession: {}, // Multiple profession skills
        ride: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'dexterity' },
        search: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'intelligence' },
        senseMotive: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'wisdom' },
        sleightOfHand: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'dexterity' },
        speakLanguage: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'none' },
        spellcraft: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'intelligence' },
        spot: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'wisdom' },
        survival: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'wisdom' },
        swim: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'strength' },
        tumble: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'dexterity' },
        useMagicDevice: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'charisma' },
        useRope: { ranks: 0, modifier: 0, classSkill: false, abilityMod: 'dexterity' }
      },
      
      // Available skill points for spending
      skillPoints: {
        available: 0,
        spent: 0,
        total: 0
      },
      
      // Feats
      feats: [],
      
      // Languages
      languages: ['Common'],
      
      // Equipment
      equipment: {
        weapons: [],
        armor: null,
        shield: null,
        items: [],
        money: {
          copper: 0,
          silver: 0,
          gold: 0,
          platinum: 0
        }
      },
      
      // Spellcasting (if applicable)
      spellcasting: {
        casterLevel: 0,
        spellsKnown: [], // For spontaneous casters
        spellsPrepared: [], // For preparation casters
        spellSlots: {
          0: { max: 0, used: 0 },
          1: { max: 0, used: 0 },
          2: { max: 0, used: 0 },
          3: { max: 0, used: 0 },
          4: { max: 0, used: 0 },
          5: { max: 0, used: 0 },
          6: { max: 0, used: 0 },
          7: { max: 0, used: 0 },
          8: { max: 0, used: 0 },
          9: { max: 0, used: 0 }
        },
        bonusSpells: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
          6: 0, 7: 0, 8: 0, 9: 0
        },
        spellbook: [], // For wizards
        domains: [], // For clerics
        school: null, // For specialist wizards
        forbiddenSchools: [] // For specialist wizards
      },
      
      // Class Features
      classFeatures: [],
      
      // Racial Features
      racialFeatures: [],
      
      // Experience and Advancement
      experience: {
        current: 0,
        needed: 1000
      },
      
      // Physical Description
      description: {
        age: 0,
        gender: '',
        height: '',
        weight: '',
        eyes: '',
        hair: '',
        skin: ''
      },
      
      // Background and Personality
      background: {
        personality: '',
        ideals: '',
        bonds: '',
        flaws: '',
        backstory: ''
      },
      
      // Character Status
      status: 'alive', // alive, unconscious, dying, stable, dead
      conditions: [], // poisoned, diseased, cursed, etc.
      
      // Multiclass Support
      classes: {}, // For tracking multiple class levels
      
      // Character Creation Method
      creationMethod: {
        abilityScoreMethod: '', // 4d6dl1, 3d6, point-buy, etc.
        pointBuyPoints: 0,
        startingWealth: 0
      },
      
      // Metadata
      createdAt: null,
      lastModified: null,
      version: '3.5'
    };
  }

  /**
   * Calculate ability modifier from ability score
   * @param {number} score - Ability score
   * @returns {number} Modifier
   */
  static calculateAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
  }

  /**
   * Update all calculated fields for a character
   * @param {Object} character - Character object
   */
  static updateCalculatedFields(character) {
    // Update ability modifiers
    for (const ability in character.abilities) {
      character.abilityModifiers[ability] = this.calculateAbilityModifier(character.abilities[ability]);
    }
    
    // Update skill modifiers
    for (const skillName in character.skills) {
      const skill = character.skills[skillName];
      if (skill.abilityMod && skill.abilityMod !== 'none') {
        skill.modifier = skill.ranks + character.abilityModifiers[skill.abilityMod];
      }
    }
    
    // Update saving throws
    character.savingThrows.fortitude.ability = character.abilityModifiers.constitution;
    character.savingThrows.reflex.ability = character.abilityModifiers.dexterity;
    character.savingThrows.will.ability = character.abilityModifiers.wisdom;
    
    // Calculate totals
    for (const save in character.savingThrows) {
      const saveData = character.savingThrows[save];
      saveData.total = saveData.base + saveData.ability + saveData.magic + saveData.misc;
    }
    
    // Update AC
    character.armorClass.dexterity = character.abilityModifiers.dexterity;
    character.armorClass.total = 10 + character.armorClass.armor + character.armorClass.shield + 
                               character.armorClass.dexterity + character.armorClass.size + 
                               character.armorClass.natural + character.armorClass.deflection + 
                               character.armorClass.misc;
    character.armorClass.touch = 10 + character.armorClass.dexterity + character.armorClass.size + 
                               character.armorClass.deflection + character.armorClass.misc;
    character.armorClass.flatFooted = character.armorClass.total - character.armorClass.dexterity;
    
    // Update last modified timestamp
    character.lastModified = Date.now();
  }

  /**
   * Get next level experience requirements
   * @param {number} level - Current level
   * @returns {number} Experience needed for next level
   */
  static getExperienceForLevel(level) {
    const xpTable = [
      0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000,
      55000, 66000, 78000, 91000, 105000, 120000, 136000, 153000, 171000, 190000
    ];
    return xpTable[level] || xpTable[19] + ((level - 19) * 20000);
  }

  /**
   * Validate character data integrity
   * @param {Object} character - Character object
   * @returns {Object} Validation result
   */
  static validateCharacter(character) {
    const errors = [];
    
    // Check required fields
    if (!character.name || character.name.trim() === '') {
      errors.push('Character name is required');
    }
    
    if (!character.race) {
      errors.push('Character race is required');
    }
    
    if (!character.class) {
      errors.push('Character class is required');
    }
    
    if (!character.alignment) {
      errors.push('Character alignment is required');
    }
    
    // Validate ability scores (3-18 for normal characters)
    for (const ability in character.abilities) {
      const score = character.abilities[ability];
      if (score < 3 || score > 25) {
        errors.push(`${ability} score (${score}) is outside normal range (3-25)`);
      }
    }
    
    // Validate level
    if (character.level < 1 || character.level > 20) {
      errors.push(`Character level (${character.level}) must be between 1 and 20`);
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Clone character object (deep copy)
   * @param {Object} character - Character to clone
   * @returns {Object} Cloned character
   */
  static cloneCharacter(character) {
    return JSON.parse(JSON.stringify(character));
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.DnD35CharacterModel = DnD35CharacterModel;
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = DnD35CharacterModel;
}
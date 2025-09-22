/**
 * Epic Level Character Support System
 * Complete D&D 3.5 Epic Level Rules Implementation (Levels 21-100)
 * Supports: Epic Progression, Epic Feats, Epic Spells, Divine Ascension
 */
class EpicLevelCharacterSystem {
  constructor() {
    this.epicProgression = this.initializeEpicProgression();
    this.epicFeats = this.initializeEpicFeats();
    this.epicSpells = this.initializeEpicSpells();
    this.divineRanks = this.initializeDivineRanks();
    this.epicSkills = this.initializeEpicSkills();
    this.epicClasses = this.initializeEpicClasses();
    
    console.log('⭐ Epic Level Character System initialized');
  }

  // ============= EPIC LEVEL PROGRESSION =============
  initializeEpicProgression() {
    return {
      // General epic progression rules
      general: {
        hitDiceProgression: 'continued',
        skillPointsPerLevel: 'normal_plus_int',
        savingThrowProgression: 'every_second_level',
        baseAttackProgression: 'by_class',
        spellProgression: 'stops_at_9th_level',
        epicBonusFeats: 'every_even_level'
      },

      // Epic attack bonus progression
      attackProgression: {
        fighter: { progression: 'full', bonusEveryLevel: 1 },
        barbarian: { progression: 'full', bonusEveryLevel: 1 },
        ranger: { progression: 'full', bonusEveryLevel: 1 },
        paladin: { progression: 'full', bonusEveryLevel: 1 },
        cleric: { progression: 'medium', bonusEveryLevel: 0.75 },
        druid: { progression: 'medium', bonusEveryLevel: 0.75 },
        rogue: { progression: 'medium', bonusEveryLevel: 0.75 },
        bard: { progression: 'medium', bonusEveryLevel: 0.75 },
        wizard: { progression: 'poor', bonusEveryLevel: 0.5 },
        sorcerer: { progression: 'poor', bonusEveryLevel: 0.5 }
      },

      // Epic saving throw progression
      savingThrowProgression: {
        good: { progression: '+1 every 2 levels', base: 12 },
        poor: { progression: '+1 every 3 levels', base: 6 }
      },

      // Epic level benefits
      epicBenefits: {
        21: { feats: ['epic_feat'], abilityIncrease: true },
        22: { bonusFeat: true },
        24: { feats: ['epic_feat'], bonusFeat: true, abilityIncrease: true },
        25: { divineAscensionEligible: true },
        26: { bonusFeat: true },
        27: { feats: ['epic_feat'], abilityIncrease: true },
        28: { bonusFeat: true },
        30: { feats: ['epic_feat'], bonusFeat: true, abilityIncrease: true }
      }
    };
  }

  // ============= EPIC FEATS SYSTEM =============
  initializeEpicFeats() {
    return {
      // Combat Epic Feats
      combat: {
        devastating_critical: {
          name: 'Devastating Critical',
          type: 'epic',
          prerequisites: {
            weaponFocus: 'selected_weapon',
            criticalFocus: true,
            improvedCritical: 'selected_weapon',
            baseAttackBonus: 25
          },
          benefit: 'Instantly slay living creatures on critical hit',
          description: 'When you score a critical hit with the chosen weapon, the target must make a Fortitude save (DC 20 + ½ your level + Str modifier) or die.'
        },
        
        overwhelming_critical: {
          name: 'Overwhelming Critical',
          type: 'epic',
          prerequisites: {
            weaponFocus: 'selected_weapon',
            improvedCritical: 'selected_weapon',
            baseAttackBonus: 23
          },
          benefit: '+1d6 bonus damage on critical hits',
          description: 'Add +1d6 points of bonus damage when you score a critical hit. This damage is not multiplied by the critical hit.'
        },

        superior_initiative: {
          name: 'Superior Initiative',
          type: 'epic',
          prerequisites: {
            improvedInitiative: true
          },
          benefit: '+8 initiative bonus',
          description: 'You get an additional +4 bonus to initiative checks (total +8 with Improved Initiative).'
        },

        epic_weapon_focus: {
          name: 'Epic Weapon Focus',
          type: 'epic',
          prerequisites: {
            weaponFocus: 'selected_weapon',
            fighterLevel: 8
          },
          benefit: '+2 additional attack bonus',
          description: 'Add +2 to attack rolls with chosen weapon (stacks with Weapon Focus for +3 total).'
        }
      },

      // Spellcasting Epic Feats
      spellcasting: {
        epic_spell_focus: {
          name: 'Epic Spell Focus',
          type: 'epic',
          prerequisites: {
            spellFocus: 'selected_school',
            greaterSpellFocus: 'selected_school'
          },
          benefit: '+4 additional DC to saves',
          description: 'Add +4 to the Difficulty Class for all saves against spells from the school you select (stacks with other Spell Focus feats).'
        },

        epic_spell_penetration: {
          name: 'Epic Spell Penetration',
          type: 'epic',
          prerequisites: {
            spellPenetration: true,
            greaterSpellPenetration: true
          },
          benefit: '+4 additional caster level for spell resistance',
          description: 'Add +4 to caster level checks to beat spell resistance (stacks with other Spell Penetration feats for +6 total).'
        },

        automatic_quicken_spell: {
          name: 'Automatic Quicken Spell',
          type: 'epic',
          prerequisites: {
            quickenSpell: true,
            spellcraftRanks: 30,
            abilityToKnowOrCast: '9th_level_spells'
          },
          benefit: 'Automatically quicken spells without using higher level slots',
          description: 'Cast spells of chosen level as quickened spells without using higher level spell slots. Choose spell level when taking feat.'
        }
      },

      // Skill Epic Feats
      skill: {
        legendary_climber: {
          name: 'Legendary Climber',
          type: 'epic',
          prerequisites: {
            climbRanks: 24
          },
          benefit: 'Climb at normal speed with no penalty',
          description: 'You can climb at your normal speed without penalty. You retain your Dex bonus to AC while climbing.'
        },

        perfect_two_weapon_fighting: {
          name: 'Perfect Two-Weapon Fighting',
          type: 'epic',
          prerequisites: {
            twoWeaponFighting: true,
            improvedTwoWeaponFighting: true,
            greaterTwoWeaponFighting: true,
            baseAttackBonus: 25,
            dexterity: 25
          },
          benefit: 'No penalties for two-weapon fighting',
          description: 'You do not suffer any penalties for fighting with two weapons.'
        }
      },

      // Divine Epic Feats
      divine: {
        divine_rank: {
          name: 'Divine Rank',
          type: 'epic_divine',
          prerequisites: {
            characterLevel: 25,
            worship: 'significant_following'
          },
          benefit: 'Gain divine rank 0 (demigod status)',
          description: 'You achieve divinity and gain the benefits of divine rank 0.'
        },

        planar_turning: {
          name: 'Planar Turning',
          type: 'epic',
          prerequisites: {
            turnUndead: true,
            characterLevel: 21
          },
          benefit: 'Turn extraplanar creatures',
          description: 'You can turn or destroy outsiders as if they were undead.'
        }
      }
    };
  }

  // ============= EPIC SPELLS SYSTEM =============
  initializeEpicSpells() {
    return {
      // Epic Spell Development Rules
      development: {
        spellcraftDC: 'variable',
        baseDC: 50,
        developmentTime: '1 day per 50,000 gp',
        researchCosts: '25,000 gp base',
        prerequisites: {
          spellcraftRanks: 24,
          knowledge_arcana: 24,
          abilityToKnow9thLevel: true
        }
      },

      // Epic Spell Factors
      factors: {
        energy: {
          baseDC: 19,
          damage: '1d6 per DC',
          maxDamage: '300d6',
          description: 'Deal energy damage to targets'
        },
        
        heal: {
          baseDC: 25,
          healing: '1d4+1 per DC',
          maxHealing: 'no_limit',
          description: 'Heal hit point damage'
        },

        transport: {
          baseDC: 27,
          range: 'cross_planar',
          subjects: 'unlimited',
          description: 'Transport subjects across planes'
        },

        ward: {
          baseDC: 14,
          protection: '+1 AC per 2 DC',
          duration: 'permanent_possible',
          description: 'Provide protection against attacks'
        }
      },

      // Sample Epic Spells
      spells: {
        mummy_dust: {
          name: 'Mummy Dust',
          school: 'necromancy',
          level: 'epic',
          spellcraftDC: 38,
          components: ['V', 'S', 'M', 'XP'],
          castingTime: '1 minute',
          range: '300 ft.',
          duration: 'instantaneous',
          effect: 'One or more 21-HD mummies',
          description: 'Transform corpses into powerful mummy guardians under your control.',
          materialComponent: '500 gp diamond dust per mummy',
          xpCost: '1,000 XP per mummy'
        },

        dragon_knight: {
          name: 'Dragon Knight',
          school: 'conjuration',
          subschool: 'calling',
          level: 'epic',
          spellcraftDC: 38,
          components: ['V', 'S', 'DF', 'XP'],
          castingTime: '1 minute',
          range: '75 ft.',
          duration: '20 hours',
          effect: 'One called dragon and one called rider',
          description: 'Call an adult dragon with a fighter rider to serve you.',
          xpCost: '1,000 XP'
        },

        epic_mage_armor: {
          name: 'Epic Mage Armor',
          school: 'conjuration',
          subschool: 'creation',
          level: 'epic',
          spellcraftDC: 46,
          components: ['V', 'S'],
          castingTime: '1 minute',
          range: 'touch',
          duration: '24 hours',
          effect: 'Armor bonus to AC',
          description: 'Creates an invisible but tangible field of force around the subject, providing a +20 armor bonus to AC.',
          armorBonus: 20
        },

        raise_island: {
          name: 'Raise Island',
          school: 'transmutation',
          level: 'epic',
          spellcraftDC: 81,
          components: ['V', 'S', 'XP'],
          castingTime: '1 year and 1 day',
          range: '0 ft.',
          duration: 'instantaneous',
          effect: 'New island',
          description: 'Raises a new island from the ocean floor, complete with basic ecosystem.',
          xpCost: '17,500 XP',
          islandSize: '2 square miles per caster level'
        }
      }
    };
  }

  // ============= DIVINE ASCENSION SYSTEM =============
  initializeDivineRanks() {
    return {
      // Divine Rank Progression
      ranks: {
        0: {
          title: 'Demigod',
          requirements: { level: 25, divineRankFeat: true },
          benefits: {
            divineImmunities: ['ability_drain', 'energy_drain', 'mind_effects'],
            damageReduction: '10/epic',
            spellResistance: 25,
            renewedDaily: ['hit_points', 'ability_damage', 'spell_slots']
          },
          followers: 'up_to_1000',
          domains: 2
        },

        1: {
          title: 'Lesser Deity',
          requirements: { divineRank: 0, followers: 10000 },
          benefits: {
            damageReduction: '15/epic',
            spellResistance: 30,
            divineAura: 'awe_10_feet',
            domains: 3,
            grantedPowers: 'moderate'
          },
          portfolios: 'one_major_sphere',
          planarRealm: 'small_realm'
        },

        2: {
          title: 'Lesser Deity',
          requirements: { divineRank: 1, followers: 100000 },
          benefits: {
            damageReduction: '20/epic',
            spellResistance: 35,
            divineAura: 'fear_30_feet',
            domains: 4,
            alterReality: 'limited'
          }
        },

        3: {
          title: 'Lesser Deity',
          requirements: { divineRank: 2, followers: 500000 },
          benefits: {
            damageReduction: '25/epic',
            spellResistance: 40,
            domains: 5,
            alterReality: 'moderate',
            createLife: 'basic_creatures'
          }
        },

        4: {
          title: 'Lesser Deity',
          requirements: { divineRank: 3, followers: 1000000 },
          benefits: {
            damageReduction: '30/epic',
            spellResistance: 45,
            domains: 6,
            alterReality: 'significant',
            createLife: 'intelligent_creatures'
          }
        },

        5: {
          title: 'Lesser Deity',
          requirements: { divineRank: 4, followers: 5000000 },
          benefits: {
            damageReduction: '35/epic',
            spellResistance: 50,
            domains: 'all_available',
            alterReality: 'major',
            createArtifacts: true
          }
        }
      },

      // Divine Powers by Rank
      powers: {
        all_ranks: [
          'divine_immortality',
          'perfect_initiative',
          'increased_damage_reduction',
          'spell_resistance',
          'divine_senses',
          'portfolio_sense',
          'automatic_actions',
          'create_magic_items'
        ],

        rank_1_plus: [
          'command_creatures',
          'divine_aura',
          'divine_blast',
          'divine_shield',
          'divine_weapon_focus',
          'energy_immunity',
          'mass_life_and_death',
          'shapechange'
        ],

        rank_6_plus: [
          'alter_reality',
          'alter_form',
          'annihilating_strike',
          'area_divine_shield',
          'banestrike',
          'create_greater_object',
          'divine_air_mastery',
          'divine_archery',
          'divine_battle_mastery'
        ]
      }
    };
  }

  // ============= EPIC SKILLS SYSTEM =============
  initializeEpicSkills() {
    return {
      // Epic Skill Uses (DC 40+)
      epicUses: {
        climb: {
          40: 'Climb perfectly smooth, slick surfaces',
          60: 'Climb overhanging surfaces with handholds',
          80: 'Climb perfectly smooth, overhanging surfaces',
          100: 'Climb on ceilings and similar surfaces'
        },

        diplomacy: {
          40: 'Make a creature friendly in 1 minute',
          50: 'Make a creature helpful in 1 minute',
          60: 'Make a hostile creature indifferent in 1 round',
          80: 'Make a hostile creature friendly in 1 round'
        },

        intimidate: {
          40: 'Demoralize opponent as a move action',
          50: 'Cause opponent to cower for 1 round',
          60: 'Cause opponent to panic for 1d4 rounds',
          80: 'Cause opponent to become paralyzed with fear'
        },

        jump: {
          40: 'Long jump 32 feet (no running start needed)',
          80: 'High jump 16 feet (no running start needed)',
          120: 'Make impossible jumps (limited flight)'
        },

        sense_motive: {
          40: 'Discern surface thoughts',
          60: 'Determine specific lies vs truth',
          80: 'Read emotional state and motivations',
          100: 'Understand complex mental states'
        },

        spellcraft: {
          40: 'Identify spell being cast (no action)',
          60: 'Counter spell without preparation',
          80: 'Alter existing spells on the fly',
          100: 'Create new spells during casting'
        }
      },

      // Epic Skill Synergies
      synergies: {
        legendary_skill: {
          name: 'Legendary Skill Performance',
          threshold: 50,
          benefit: 'Always take 10, even under stress',
          description: 'At 50+ ranks, you can always take 10 on the skill, even in stressful situations'
        },

        perfect_skill: {
          name: 'Perfect Skill Mastery',
          threshold: 100,
          benefit: 'Minimum result is always 20',
          description: 'At 100+ ranks, treat any d20 roll of 19 or less as a 20 for this skill'
        }
      }
    };
  }

  // ============= EPIC CLASSES =============
  initializeEpicClasses() {
    return {
      // Epic Progressions for existing classes
      barbarian: {
        hitDie: 'd12',
        skillPoints: 4,
        epicProgression: {
          21: { rageUsesPerDay: 7, rageDuration: '+2 rounds' },
          22: { bonusFeat: 'epic' },
          24: { rageUsesPerDay: 8, bonusFeat: 'epic' },
          26: { bonusFeat: 'epic' },
          27: { rageUsesPerDay: 9 },
          28: { bonusFeat: 'epic' },
          30: { rageUsesPerDay: 10, bonusFeat: 'epic' }
        }
      },

      fighter: {
        hitDie: 'd10',
        skillPoints: 2,
        epicProgression: {
          21: { bonusFeat: 'fighter_or_epic' },
          22: { bonusFeat: 'fighter_or_epic' },
          23: { bonusFeat: 'fighter_or_epic' },
          24: { bonusFeat: 'fighter_or_epic' },
          25: { bonusFeat: 'fighter_or_epic' }
        }
      },

      wizard: {
        hitDie: 'd4',
        skillPoints: 2,
        epicProgression: {
          21: { bonusMetamagicFeat: true },
          23: { bonusMetamagicFeat: true },
          25: { bonusMetamagicFeat: true, bonusItemCreationFeat: true },
          27: { bonusMetamagicFeat: true },
          29: { bonusMetamagicFeat: true }
        }
      },

      // Prestige Classes with Epic Progressions
      archmage: {
        name: 'Epic Archmage',
        requirements: {
          baseClass: 'archmage',
          level: 21,
          spellcraftRanks: 24
        },
        epicProgression: {
          21: { highArcana: 'additional', spellPower: '+2 caster levels' },
          22: { bonusEpicFeat: true },
          23: { highArcana: 'additional' },
          24: { bonusEpicFeat: true, spellPower: '+3 caster levels' }
        }
      }
    };
  }

  // ============= EPIC CHARACTER CREATION =============
  createEpicCharacter(baseCharacter, targetLevel) {
    if (targetLevel < 21 || targetLevel > 100) {
      throw new Error('Epic character level must be between 21 and 100');
    }

    const epicCharacter = {
      ...baseCharacter,
      level: targetLevel,
      isEpic: true,
      epicProgression: this.calculateEpicProgression(baseCharacter, targetLevel),
      epicFeats: this.calculateEpicFeats(baseCharacter, targetLevel),
      epicAbilities: this.calculateEpicAbilities(baseCharacter, targetLevel),
      divineRank: this.calculateDivineRank(baseCharacter)
    };

    return epicCharacter;
  }

  calculateEpicProgression(character, targetLevel) {
    const progression = {
      hitPoints: this.calculateEpicHitPoints(character, targetLevel),
      baseAttackBonus: this.calculateEpicBAB(character, targetLevel),
      savingThrows: this.calculateEpicSaves(character, targetLevel),
      skillPoints: this.calculateEpicSkillPoints(character, targetLevel),
      abilityScoreIncreases: this.calculateEpicAbilityIncreases(character, targetLevel)
    };

    return progression;
  }

  calculateEpicHitPoints(character, targetLevel) {
    const baseClass = character.class.toLowerCase();
    const hitDie = this.getClassHitDie(baseClass);
    const levelsToGain = targetLevel - character.level;
    
    // Epic hit points: average hit die result + Con modifier per level
    const averageHitDie = (hitDie + 1) / 2;
    const conModifier = Math.floor((character.abilities.constitution.score - 10) / 2);
    
    return character.hitPoints + (levelsToGain * (averageHitDie + conModifier));
  }

  calculateEpicBAB(character, targetLevel) {
    const baseClass = character.class.toLowerCase();
    const progression = this.epicProgression.attackProgression[baseClass];
    
    if (!progression) return character.baseAttackBonus;
    
    const levelsToGain = targetLevel - character.level;
    const bonusPerLevel = progression.bonusEveryLevel;
    
    return character.baseAttackBonus + Math.floor(levelsToGain * bonusPerLevel);
  }

  calculateEpicSaves(character, targetLevel) {
    const levelsToGain = targetLevel - character.level;
    const epicSaveBonuses = Math.floor(levelsToGain / 2); // +1 every 2 levels
    
    return {
      fortitude: character.savingThrows.fortitude + epicSaveBonuses,
      reflex: character.savingThrows.reflex + epicSaveBonuses,
      will: character.savingThrows.will + epicSaveBonuses
    };
  }

  calculateEpicSkillPoints(character, targetLevel) {
    const baseClass = character.class.toLowerCase();
    const skillPointsPerLevel = this.getClassSkillPoints(baseClass);
    const intModifier = Math.floor((character.abilities.intelligence.score - 10) / 2);
    const levelsToGain = targetLevel - character.level;
    
    return character.skillPoints + (levelsToGain * (skillPointsPerLevel + intModifier));
  }

  calculateEpicAbilityIncreases(character, targetLevel) {
    const levelsToGain = targetLevel - character.level;
    const abilityIncreases = Math.floor(levelsToGain / 4); // +1 every 4 levels
    
    return {
      increases: abilityIncreases,
      available: abilityIncreases,
      applied: {}
    };
  }

  // ============= EPIC FEAT MANAGEMENT =============
  calculateEpicFeats(character, targetLevel) {
    const levelsToGain = targetLevel - character.level;
    const epicBonusFeats = Math.floor(levelsToGain / 2); // Every even epic level
    
    return {
      bonusFeats: epicBonusFeats,
      available: this.getAvailableEpicFeats(character),
      selected: []
    };
  }

  getAvailableEpicFeats(character) {
    const availableFeats = [];
    
    // Check prerequisites for each epic feat
    for (const [category, feats] of Object.entries(this.epicFeats)) {
      for (const [featId, feat] of Object.entries(feats)) {
        if (this.checkEpicFeatPrerequisites(character, feat.prerequisites)) {
          availableFeats.push({
            id: featId,
            category: category,
            ...feat
          });
        }
      }
    }
    
    return availableFeats;
  }

  checkEpicFeatPrerequisites(character, prerequisites) {
    if (!prerequisites) return true;
    
    // Check each prerequisite
    for (const [reqType, reqValue] of Object.entries(prerequisites)) {
      switch (reqType) {
        case 'baseAttackBonus':
          if (character.baseAttackBonus < reqValue) return false;
          break;
        case 'spellcraftRanks':
          if (!character.skills?.spellcraft || character.skills.spellcraft < reqValue) return false;
          break;
        case 'characterLevel':
          if (character.level < reqValue) return false;
          break;
        // Add more prerequisite checks as needed
      }
    }
    
    return true;
  }

  // ============= DIVINE ASCENSION =============
  calculateDivineRank(character) {
    if (character.level < 25) {
      return { rank: null, eligible: false };
    }
    
    // Check for divine rank eligibility
    const hasFollowers = character.followers && character.followers.length > 0;
    const hasPortfolio = character.divinePortfolio && character.divinePortfolio.length > 0;
    
    if (hasFollowers && hasPortfolio) {
      return {
        rank: 0,
        eligible: true,
        title: 'Demigod',
        benefits: this.divineRanks.ranks[0].benefits
      };
    }
    
    return { rank: null, eligible: true, requirements: 'followers_and_portfolio' };
  }

  // ============= EPIC SPELL DEVELOPMENT =============
  developEpicSpell(character, spellConcept) {
    // Check prerequisites
    if (!this.canDevelopEpicSpells(character)) {
      throw new Error('Character does not meet epic spell development prerequisites');
    }
    
    const spellcraftDC = this.calculateSpellcraftDC(spellConcept);
    const developmentCost = this.calculateDevelopmentCost(spellcraftDC);
    const developmentTime = this.calculateDevelopmentTime(developmentCost);
    
    return {
      spell: spellConcept,
      spellcraftDC: spellcraftDC,
      developmentCost: developmentCost,
      developmentTime: developmentTime,
      canDevelop: character.gold >= developmentCost
    };
  }

  canDevelopEpicSpells(character) {
    const requirements = this.epicSpells.development.prerequisites;
    
    return (
      character.skills?.spellcraft >= requirements.spellcraftRanks &&
      character.skills?.knowledge_arcana >= requirements.knowledge_arcana &&
      this.canKnow9thLevelSpells(character)
    );
  }

  calculateSpellcraftDC(spellConcept) {
    let baseDC = this.epicSpells.development.baseDC;
    
    // Add DC based on spell effects
    spellConcept.effects.forEach(effect => {
      const factor = this.epicSpells.factors[effect.type];
      if (factor) {
        baseDC += factor.baseDC * effect.magnitude;
      }
    });
    
    return baseDC;
  }

  // ============= UTILITY METHODS =============
  getClassHitDie(className) {
    const hitDice = {
      barbarian: 12,
      fighter: 10,
      ranger: 10,
      paladin: 10,
      cleric: 8,
      druid: 8,
      rogue: 6,
      bard: 6,
      wizard: 4,
      sorcerer: 4
    };
    
    return hitDice[className] || 8;
  }

  getClassSkillPoints(className) {
    const skillPoints = {
      barbarian: 4,
      fighter: 2,
      ranger: 6,
      paladin: 2,
      cleric: 2,
      druid: 4,
      rogue: 8,
      bard: 6,
      wizard: 2,
      sorcerer: 2
    };
    
    return skillPoints[className] || 4;
  }

  canKnow9thLevelSpells(character) {
    const fullCasters = ['wizard', 'sorcerer', 'cleric', 'druid'];
    return fullCasters.includes(character.class.toLowerCase()) && character.level >= 17;
  }

  calculateDevelopmentCost(spellcraftDC) {
    return Math.max(25000, (spellcraftDC - 50) * 1000);
  }

  calculateDevelopmentTime(cost) {
    return Math.ceil(cost / 50000); // 1 day per 50,000 gp
  }

  // ============= EXPORT/IMPORT =============
  exportEpicCharacter(character) {
    return {
      timestamp: new Date().toISOString(),
      character: character,
      epicData: {
        progression: character.epicProgression,
        feats: character.epicFeats,
        abilities: character.epicAbilities,
        divineRank: character.divineRank
      }
    };
  }

  importEpicCharacter(data) {
    const character = data.character;
    character.epicProgression = data.epicData.progression;
    character.epicFeats = data.epicData.feats;
    character.epicAbilities = data.epicData.abilities;
    character.divineRank = data.epicData.divineRank;
    
    console.log('⭐ Epic character imported:', character.name, `Level ${character.level}`);
    return character;
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EpicLevelCharacterSystem;
} else if (typeof window !== 'undefined') {
  window.EpicLevelCharacterSystem = EpicLevelCharacterSystem;
}

console.log('⭐ EpicLevelCharacterSystem module loaded');
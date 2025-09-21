/**
 * Complete D&D 3.5 SRD Data
 * Official races, classes, feats, skills, spells, and equipment
 * 
 * @version 1.0
 * @date December 2024
 * @location code-repository/src/dnd35-srd-data.js
 */

const DnD35SRDData = {
  // D&D 3.5 Races with official SRD stats
  races: {
    Human: {
      name: 'Human',
      size: 'Medium',
      speed: 30,
      abilityAdjustments: {},
      racialTraits: [
        'Extra feat at 1st level',
        '4 extra skill points at 1st level',
        '1 extra skill point at each additional level'
      ],
      favoredClass: 'Any',
      languages: ['Common'],
      bonusLanguages: ['Any'],
      description: 'Humans are the most adaptable and ambitious people among the common races.'
    },
    
    Dwarf: {
      name: 'Dwarf',
      size: 'Medium',
      speed: 20,
      abilityAdjustments: { constitution: 2, charisma: -2 },
      racialTraits: [
        'Darkvision 60 feet',
        'Stonecunning: +2 racial bonus on Search checks for unusual stonework',
        'Weapon Familiarity: dwarven waraxe and dwarven urgrosh as martial weapons',
        'Stability: +4 bonus on ability checks against bull rush or trip when on ground',
        '+2 racial bonus on saving throws against poison',
        '+2 racial bonus on saving throws against spells and spell-like effects',
        '+1 racial bonus on attack rolls against orcs and goblinoids',
        '+4 dodge bonus to AC against giants',
        '+2 racial bonus on Appraise and Craft checks related to stone or metal'
      ],
      favoredClass: 'Fighter',
      languages: ['Common', 'Dwarven'],
      bonusLanguages: ['Giant', 'Gnome', 'Goblin', 'Orc', 'Terran', 'Undercommon'],
      description: 'Dwarves are known for their skill in warfare, their ability to withstand physical and magical punishment, and their knowledge of the earth.'
    },
    
    Elf: {
      name: 'Elf',
      size: 'Medium',
      speed: 30,
      abilityAdjustments: { dexterity: 2, constitution: -2 },
      racialTraits: [
        'Immunity to magic sleep effects',
        '+2 racial saving throw bonus against enchantment spells or effects',
        'Low-light vision',
        'Weapon Proficiency: longsword, rapier, longbow, shortbow (including composite versions)',
        '+2 racial bonus on Listen, Search, and Spot checks',
        'Automatic Search check when passing within 5 feet of secret or concealed door'
      ],
      favoredClass: 'Wizard',
      languages: ['Common', 'Elven'],
      bonusLanguages: ['Draconic', 'Gnoll', 'Gnome', 'Goblin', 'Orc', 'Sylvan'],
      description: 'Elves are known for their poetry, song, and magical arts, but when danger threatens they show great skill with weapons and strategy.'
    },
    
    Gnome: {
      name: 'Gnome',
      size: 'Small',
      speed: 20,
      abilityAdjustments: { constitution: 2, strength: -2 },
      racialTraits: [
        'Small size: +1 AC, +1 attack rolls, +4 Hide checks, -4 grapple checks',
        'Low-light vision',
        'Weapon Familiarity: gnome hooked hammer as martial weapon',
        '+2 racial bonus on saving throws against illusions',
        '+1 DC for all illusion spells cast by gnomes',
        '+1 racial bonus on attack rolls against kobolds and goblinoids',
        '+4 dodge bonus to AC against giants',
        '+2 racial bonus on Listen checks',
        '+2 racial bonus on Craft (alchemy) checks',
        'Spell-like abilities: speak with animals (burrowing mammals only), dancing lights, ghost sound, prestidigitation'
      ],
      favoredClass: 'Bard',
      languages: ['Common', 'Gnome'],
      bonusLanguages: ['Draconic', 'Dwarven', 'Elven', 'Giant', 'Goblin', 'Orc'],
      description: 'Gnomes are welcome everywhere as technicians, alchemists, and inventors.'
    },
    
    'Half-Elf': {
      name: 'Half-Elf',
      size: 'Medium',
      speed: 30,
      abilityAdjustments: {},
      racialTraits: [
        'Immunity to sleep spells and similar magical effects',
        '+2 racial bonus on saving throws against enchantment spells or effects',
        'Low-light vision',
        '+1 racial bonus on Listen, Search, and Spot checks',
        '+2 racial bonus on Diplomacy and Gather Information checks',
        'Elven Blood: considered an elf for all effects related to race'
      ],
      favoredClass: 'Any',
      languages: ['Common', 'Elven'],
      bonusLanguages: ['Any'],
      description: 'Half-elves have no lands of their own, though they are welcome in human cities and somewhat less welcome in elven forests.'
    },
    
    'Half-Orc': {
      name: 'Half-Orc',
      size: 'Medium',
      speed: 30,
      abilityAdjustments: { strength: 2, intelligence: -2, charisma: -2 },
      racialTraits: [
        'Darkvision 60 feet',
        'Orc Blood: considered an orc for all effects related to race'
      ],
      favoredClass: 'Barbarian',
      languages: ['Common', 'Orc'],
      bonusLanguages: ['Draconic', 'Giant', 'Gnoll', 'Goblin', 'Abyssal'],
      description: 'Half-orcs are the short-tempered and sullen result of human and orc pairings.'
    },
    
    Halfling: {
      name: 'Halfling',
      size: 'Small',
      speed: 20,
      abilityAdjustments: { dexterity: 2, strength: -2 },
      racialTraits: [
        'Small size: +1 AC, +1 attack rolls, +4 Hide checks, -4 grapple checks',
        '+2 racial bonus on Climb, Jump, Listen, and Move Silently checks',
        '+1 racial bonus on all saving throws',
        '+2 morale bonus on saving throws against fear',
        '+1 racial bonus on attack rolls with thrown weapons and slings'
      ],
      favoredClass: 'Rogue',
      languages: ['Common', 'Halfling'],
      bonusLanguages: ['Dwarven', 'Elven', 'Gnome', 'Goblin', 'Orc'],
      description: 'Halflings are clever, capable opportunists who prefer comfort and safety to glory.'
    }
  },

  // D&D 3.5 Classes with official progression
  classes: {
    Barbarian: {
      name: 'Barbarian',
      hitDie: 12,
      skillPoints: 4,
      classSkills: ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Jump', 'Listen', 'Ride', 'Survival', 'Swim'],
      baseAttackBonus: 'good',
      savingThrows: { fortitude: 'good', reflex: 'poor', will: 'poor' },
      spellcasting: false,
      description: 'A ferocious warrior of primitive background who can enter a battle rage.'
    },
    
    Bard: {
      name: 'Bard',
      hitDie: 6,
      skillPoints: 6,
      classSkills: ['Appraise', 'Balance', 'Bluff', 'Climb', 'Concentration', 'Craft', 'Decipher Script', 'Diplomacy', 'Disguise', 'Escape Artist', 'Gather Information', 'Hide', 'Jump', 'Knowledge', 'Listen', 'Move Silently', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Speak Language', 'Spellcraft', 'Swim', 'Tumble', 'Use Magic Device'],
      baseAttackBonus: 'medium',
      savingThrows: { fortitude: 'poor', reflex: 'good', will: 'good' },
      spellcasting: true,
      spellcastingAbility: 'charisma',
      description: 'A master of song, speech, and the magic they contain.'
    },
    
    Cleric: {
      name: 'Cleric',
      hitDie: 8,
      skillPoints: 2,
      classSkills: ['Concentration', 'Craft', 'Diplomacy', 'Heal', 'Knowledge (arcana)', 'Knowledge (history)', 'Knowledge (religion)', 'Knowledge (the planes)', 'Profession', 'Spellcraft'],
      baseAttackBonus: 'medium',
      savingThrows: { fortitude: 'good', reflex: 'poor', will: 'good' },
      spellcasting: true,
      spellcastingAbility: 'wisdom',
      description: 'A master of divine magic and a capable warrior as well.'
    },
    
    Druid: {
      name: 'Druid',
      hitDie: 8,
      skillPoints: 4,
      classSkills: ['Concentration', 'Craft', 'Diplomacy', 'Handle Animal', 'Heal', 'Knowledge (nature)', 'Listen', 'Profession', 'Ride', 'Spellcraft', 'Spot', 'Survival', 'Swim'],
      baseAttackBonus: 'medium',
      savingThrows: { fortitude: 'good', reflex: 'poor', will: 'good' },
      spellcasting: true,
      spellcastingAbility: 'wisdom',
      description: 'One who draws power from nature itself or from a nature deity.'
    },
    
    Fighter: {
      name: 'Fighter',
      hitDie: 10,
      skillPoints: 2,
      classSkills: ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Jump', 'Ride', 'Swim'],
      baseAttackBonus: 'good',
      savingThrows: { fortitude: 'good', reflex: 'poor', will: 'poor' },
      spellcasting: false,
      description: 'A master of combat, skilled with a variety of weapons and armor.'
    },
    
    Monk: {
      name: 'Monk',
      hitDie: 8,
      skillPoints: 4,
      classSkills: ['Balance', 'Climb', 'Concentration', 'Craft', 'Diplomacy', 'Escape Artist', 'Hide', 'Jump', 'Knowledge (arcana)', 'Knowledge (religion)', 'Listen', 'Move Silently', 'Perform', 'Profession', 'Sense Motive', 'Spot', 'Swim', 'Tumble'],
      baseAttackBonus: 'medium',
      savingThrows: { fortitude: 'good', reflex: 'good', will: 'good' },
      spellcasting: false,
      description: 'A martial artist whose unarmed strikes hit fast and hard—a master of exotic powers.'
    },
    
    Paladin: {
      name: 'Paladin',
      hitDie: 10,
      skillPoints: 2,
      classSkills: ['Concentration', 'Craft', 'Diplomacy', 'Handle Animal', 'Heal', 'Knowledge (nobility and royalty)', 'Knowledge (religion)', 'Profession', 'Ride', 'Sense Motive'],
      baseAttackBonus: 'good',
      savingThrows: { fortitude: 'good', reflex: 'poor', will: 'poor' },
      spellcasting: true,
      spellcastingAbility: 'wisdom',
      description: 'A champion of justice and destroyer of evil, protected and strengthened by divine powers.'
    },
    
    Ranger: {
      name: 'Ranger',
      hitDie: 8,
      skillPoints: 6,
      classSkills: ['Climb', 'Concentration', 'Craft', 'Handle Animal', 'Heal', 'Hide', 'Jump', 'Knowledge (dungeoneering)', 'Knowledge (geography)', 'Knowledge (nature)', 'Listen', 'Move Silently', 'Profession', 'Ride', 'Search', 'Spot', 'Survival', 'Swim', 'Use Rope'],
      baseAttackBonus: 'good',
      savingThrows: { fortitude: 'good', reflex: 'good', will: 'poor' },
      spellcasting: true,
      spellcastingAbility: 'wisdom',
      description: 'A skilled hunter and tracker, and a warrior of the wilderness.'
    },
    
    Rogue: {
      name: 'Rogue',
      hitDie: 6,
      skillPoints: 8,
      classSkills: ['Appraise', 'Balance', 'Bluff', 'Climb', 'Craft', 'Decipher Script', 'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Forgery', 'Gather Information', 'Hide', 'Intimidate', 'Jump', 'Knowledge (local)', 'Listen', 'Move Silently', 'Open Lock', 'Perform', 'Profession', 'Search', 'Sense Motive', 'Sleight of Hand', 'Spot', 'Swim', 'Tumble', 'Use Magic Device', 'Use Rope'],
      baseAttackBonus: 'medium',
      savingThrows: { fortitude: 'poor', reflex: 'good', will: 'poor' },
      spellcasting: false,
      description: 'A tricky, skillful scout and spy who wins the battle by stealth rather than brute force.'
    },
    
    Sorcerer: {
      name: 'Sorcerer',
      hitDie: 4,
      skillPoints: 2,
      classSkills: ['Bluff', 'Concentration', 'Craft', 'Knowledge (arcana)', 'Profession', 'Spellcraft'],
      baseAttackBonus: 'poor',
      savingThrows: { fortitude: 'poor', reflex: 'poor', will: 'good' },
      spellcasting: true,
      spellcastingAbility: 'charisma',
      description: 'A spellcaster who draws on inherent magic from a draconic or other exotic bloodline.'
    },
    
    Wizard: {
      name: 'Wizard',
      hitDie: 4,
      skillPoints: 2,
      classSkills: ['Concentration', 'Craft', 'Decipher Script', 'Knowledge (all skills, taken individually)', 'Profession', 'Spellcraft'],
      baseAttackBonus: 'poor',
      savingThrows: { fortitude: 'poor', reflex: 'poor', will: 'good' },
      spellcasting: true,
      spellcastingAbility: 'intelligence',
      description: 'A potent spellcaster schooled in the arcane arts.'
    }
  },

  // D&D 3.5 Alignments
  alignments: [
    { name: 'Lawful Good', abbreviation: 'LG', description: 'A lawful good character acts as a good person is expected or required to act.' },
    { name: 'Neutral Good', abbreviation: 'NG', description: 'A neutral good character does the best that a good person can do.' },
    { name: 'Chaotic Good', abbreviation: 'CG', description: 'A chaotic good character acts as his conscience directs him.' },
    { name: 'Lawful Neutral', abbreviation: 'LN', description: 'A lawful neutral character acts as law, tradition, or a personal code directs her.' },
    { name: 'True Neutral', abbreviation: 'N', description: 'A neutral character does what seems to be a good idea.' },
    { name: 'Chaotic Neutral', abbreviation: 'CN', description: 'A chaotic neutral character follows his whims.' },
    { name: 'Lawful Evil', abbreviation: 'LE', description: 'A lawful evil villain methodically takes what he wants.' },
    { name: 'Neutral Evil', abbreviation: 'NE', description: 'A neutral evil villain does whatever she can get away with.' },
    { name: 'Chaotic Evil', abbreviation: 'CE', description: 'A chaotic evil character does whatever his greed, hatred, and lust for destruction drive him to do.' }
  ],

  // Common D&D 3.5 Feats
  feats: {
    'Alertness': {
      name: 'Alertness',
      type: 'General',
      prerequisites: 'None',
      benefit: '+2 bonus on Listen and Spot checks'
    },
    'Combat Casting': {
      name: 'Combat Casting',
      type: 'General',
      prerequisites: 'None',
      benefit: '+4 bonus on Concentration checks made to cast spells while on the defensive or grappled'
    },
    'Dodge': {
      name: 'Dodge',
      type: 'General',
      prerequisites: 'Dex 13',
      benefit: '+1 dodge bonus to AC against attacks from one opponent'
    },
    'Great Fortitude': {
      name: 'Great Fortitude',
      type: 'General',
      prerequisites: 'None',
      benefit: '+2 bonus on Fortitude saving throws'
    },
    'Improved Initiative': {
      name: 'Improved Initiative',
      type: 'General',
      prerequisites: 'None',
      benefit: '+4 bonus on initiative checks'
    },
    'Iron Will': {
      name: 'Iron Will',
      type: 'General',
      prerequisites: 'None',
      benefit: '+2 bonus on Will saving throws'
    },
    'Lightning Reflexes': {
      name: 'Lightning Reflexes',
      type: 'General',
      prerequisites: 'None',
      benefit: '+2 bonus on Reflex saving throws'
    },
    'Power Attack': {
      name: 'Power Attack',
      type: 'General',
      prerequisites: 'Str 13',
      benefit: 'Trade attack bonus for damage on melee attacks'
    },
    'Skill Focus': {
      name: 'Skill Focus',
      type: 'General',
      prerequisites: 'None',
      benefit: '+3 bonus on checks made using the selected skill'
    },
    'Toughness': {
      name: 'Toughness',
      type: 'General',
      prerequisites: 'None',
      benefit: '+3 hit points'
    },
    'Weapon Focus': {
      name: 'Weapon Focus',
      type: 'General',
      prerequisites: 'Proficiency with selected weapon, base attack bonus +1',
      benefit: '+1 bonus on attack rolls with selected weapon'
    },
    'Weapon Finesse': {
      name: 'Weapon Finesse',
      type: 'General',
      prerequisites: 'Proficiency with selected weapon, base attack bonus +1',
      benefit: 'Use Dex modifier instead of Str modifier for attack rolls with light weapons'
    }
  },

  // Ability Score Generation Methods
  abilityScoreMethods: {
    '4d6dl1': {
      name: '4d6 Drop Lowest',
      description: 'Roll 4d6, drop the lowest die',
      generate: function() {
        // This will be implemented in the dice engine
        return { method: '4d6dl1', average: 12.24 };
      }
    },
    '3d6': {
      name: '3d6 Straight',
      description: 'Roll 3d6 for each ability in order',
      generate: function() {
        return { method: '3d6', average: 10.5 };
      }
    },
    'pointBuy25': {
      name: 'Point Buy (25 points)',
      description: 'Distribute 25 points among abilities',
      points: 25
    },
    'pointBuy32': {
      name: 'Point Buy (32 points)',
      description: 'Distribute 32 points among abilities (elite array)',
      points: 32
    }
  },

  // Starting wealth by class (in gold pieces)
  startingWealth: {
    Barbarian: { dice: '4d4', multiplier: 10 },
    Bard: { dice: '4d4', multiplier: 10 },
    Cleric: { dice: '5d4', multiplier: 10 },
    Druid: { dice: '2d4', multiplier: 10 },
    Fighter: { dice: '6d4', multiplier: 10 },
    Monk: { dice: '5d4', multiplier: 1 },
    Paladin: { dice: '6d4', multiplier: 10 },
    Ranger: { dice: '6d4', multiplier: 10 },
    Rogue: { dice: '5d4', multiplier: 10 },
    Sorcerer: { dice: '3d4', multiplier: 10 },
    Wizard: { dice: '3d4', multiplier: 10 }
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.DnD35SRDData = DnD35SRDData;
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = DnD35SRDData;
}
// code-repository/src/epic/epic-spell-database.js
class EpicSpellDatabase {
  constructor() {
    this.epicSpells = new Map();
    this.spellPrerequisites = new Map();
    this.spellSeeds = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('📖 Initializing Epic Spell Database...');
    const startTime = performance.now();

    try {
      await this.loadSpellSeeds();
      await this.loadEpicSpells();
      await this.buildSpellPrerequisites();

      const initTime = performance.now() - startTime;
      console.log(`✅ Epic Spell Database initialized in ${initTime.toFixed(2)}ms with ${this.epicSpells.size} epic spells`);

      this.initialized = true;
    } catch (error) {
      console.error('❌ Epic Spell Database initialization failed:', error);
      throw new EpicSpellDatabaseError(error.message);
    }
  }

  async loadSpellSeeds() {
    // Epic spell seeds - the building blocks of epic spells
    const spellSeedsData = [
      {
        id: 'afflict',
        name: 'Afflict',
        description: 'Impose penalties or conditions on targets',
        spellcraftDC: 19,
        examples: ['Feeblemind', 'Harm', 'Bestow Curse']
      },
      {
        id: 'animate',
        name: 'Animate',
        description: 'Give life or animation to objects or creatures',
        spellcraftDC: 21,
        examples: ['Animate Objects', 'Animate Dead', 'Awaken']
      },
      {
        id: 'avert',
        name: 'Avert',
        description: 'Prevent unwanted outcomes or effects',
        spellcraftDC: 17,
        examples: ['Protection from Evil', 'Death Ward', 'Avoid Planar Effects']
      },
      {
        id: 'banish',
        name: 'Banish',
        description: 'Send creatures or effects to another plane',
        spellcraftDC: 23,
        examples: ['Banishment', 'Dismissal', 'Plane Shift']
      },
      {
        id: 'compel',
        name: 'Compel',
        description: 'Force creatures to act against their will',
        spellcraftDC: 19,
        examples: ['Dominate Person', 'Geas', 'Command']
      },
      {
        id: 'conceal',
        name: 'Conceal',
        description: 'Hide creatures, objects, or areas from detection',
        spellcraftDC: 17,
        examples: ['Invisibility', 'Illusion', 'Mislead']
      },
      {
        id: 'conjure',
        name: 'Conjure',
        description: 'Bring creatures, objects, or energy from elsewhere',
        spellcraftDC: 21,
        examples: ['Summon Monster', 'Conjure Elemental', 'Gate']
      },
      {
        id: 'contact',
        name: 'Contact',
        description: 'Communicate with other beings or planes',
        spellcraftDC: 19,
        examples: ['Contact Other Plane', 'Commune', 'Speak with Dead']
      },
      {
        id: 'delude',
        name: 'Delude',
        description: 'Create false perceptions or beliefs',
        spellcraftDC: 19,
        examples: ['Illusion', 'Phantasm', 'Mirage Arcana']
      },
      {
        id: 'destroy',
        name: 'Destroy',
        description: 'Destroy creatures, objects, or effects',
        spellcraftDC: 25,
        examples: ['Disintegrate', 'Destruction', 'Implosion']
      },
      {
        id: 'disguise',
        name: 'Disguise',
        description: 'Alter appearance or form',
        spellcraftDC: 17,
        examples: ['Polymorph', 'Alter Self', 'Disguise Self']
      },
      {
        id: 'energy',
        name: 'Energy',
        description: 'Manipulate energy types or create energy effects',
        spellcraftDC: 19,
        examples: ['Fireball', 'Lightning Bolt', 'Cone of Cold']
      },
      {
        id: 'foresee',
        name: 'Foresee',
        description: 'Gain information about the future or past',
        spellcraftDC: 21,
        examples: ['Foresight', 'Divination', 'Scrying']
      },
      {
        id: 'fortify',
        name: 'Fortify',
        description: 'Strengthen creatures, objects, or areas',
        spellcraftDC: 17,
        examples: ['Stoneskin', 'Protection from Energy', 'Shield']
      },
      {
        id: 'heal',
        name: 'Heal',
        description: 'Restore health or cure conditions',
        spellcraftDC: 21,
        examples: ['Heal', 'Regeneration', 'Restoration']
      },
      {
        id: 'life',
        name: 'Life',
        description: 'Create, extend, or manipulate life',
        spellcraftDC: 23,
        examples: ['Raise Dead', 'Resurrection', 'Clone']
      },
      {
        id: 'reflect',
        name: 'Reflect',
        description: 'Bounce effects back at their source',
        spellcraftDC: 23,
        examples: ['Spell Turning', 'Reflect Spell', 'Mirror Image']
      },
      {
        id: 'reveal',
        name: 'Reveal',
        description: 'Uncover hidden information or things',
        spellcraftDC: 19,
        examples: ['Detect Magic', 'True Seeing', 'Arcane Sight']
      },
      {
        id: 'slay',
        name: 'Slay',
        description: 'Kill creatures instantly or cause death',
        spellcraftDC: 25,
        examples: ['Death Spell', 'Finger of Death', 'Slay Living']
      },
      {
        id: 'summon',
        name: 'Summon',
        description: 'Call creatures to your location',
        spellcraftDC: 21,
        examples: ['Summon Monster', 'Planar Ally', 'Call Celestial']
      },
      {
        id: 'transport',
        name: 'Transport',
        description: 'Move creatures or objects through space',
        spellcraftDC: 21,
        examples: ['Teleport', 'Dimension Door', 'Passwall']
      },
      {
        id: 'ward',
        name: 'Ward',
        description: 'Protect against specific effects or creatures',
        spellcraftDC: 17,
        examples: ['Protection from Evil', 'Death Ward', 'Antimagic Field']
      }
    ];

    for (const seed of spellSeedsData) {
      this.spellSeeds.set(seed.id, seed);
    }

    console.log(`🌱 Loaded ${this.spellSeeds.size} spell seeds`);
  }

  async loadEpicSpells() {
    // Epic spells from D&D 3.5 Epic Level Handbook
    const epicSpellsData = [
      {
        id: 'moments_respite',
        name: 'Moment\'s Respite',
        school: 'conjuration',
        subschool: 'healing',
        descriptor: 'good',
        spellcraftDC: 46,
        level: 10,
        components: ['V', 'S', 'DF'],
        castingTime: '1 standard action',
        range: 'Touch',
        target: 'Creature touched',
        duration: 'Instantaneous',
        savingThrow: 'Will negates (harmless)',
        spellResistance: 'Yes (harmless)',
        description: 'You instantly heal 10 points of damage per caster level (maximum 250 points).',
        seeds: ['heal'],
        prerequisites: ['Heal', 'Cure Critical Wounds']
      },
      {
        id: 'ruin',
        name: 'Ruin',
        school: 'transmutation',
        descriptor: '',
        spellcraftDC: 53,
        level: 10,
        components: ['V', 'S', 'M'],
        castingTime: '1 standard action',
        range: '300 ft.',
        area: '300-ft.-radius burst, centered on you',
        duration: 'Instantaneous',
        savingThrow: 'Fortitude half',
        spellResistance: 'Yes',
        description: 'This spell instantly destroys all nonliving matter in the area, dealing 10d6 points of damage to each creature in the area.',
        seeds: ['destroy'],
        prerequisites: ['Disintegrate', 'Shatter']
      },
      {
        id: 'contingent_resurrection',
        name: 'Contingent Resurrection',
        school: 'conjuration',
        subschool: 'healing',
        descriptor: '',
        spellcraftDC: 61,
        level: 11,
        components: ['V', 'S', 'M', 'DF'],
        castingTime: '10 minutes',
        range: 'Touch',
        target: 'Dead creature touched',
        duration: 'Permanent until triggered',
        savingThrow: 'None',
        spellResistance: 'Yes (harmless)',
        description: 'This spell functions like resurrection, except that it takes effect only when a specified condition is met.',
        seeds: ['life'],
        prerequisites: ['Resurrection', 'Contingency']
      },
      {
        id: 'damnation',
        name: 'Damnation',
        school: 'enchantment',
        subschool: 'compulsion',
        descriptor: 'evil, mind-affecting',
        spellcraftDC: 66,
        level: 11,
        components: ['V', 'S'],
        castingTime: '1 standard action',
        range: '60 ft.',
        area: '60-ft.-radius burst, centered on you',
        duration: '1 round/level',
        savingThrow: 'Will negates',
        spellResistance: 'Yes',
        description: 'All creatures in the area are affected as if by a dominate monster spell.',
        seeds: ['compel'],
        prerequisites: ['Dominate Monster', 'Greater Command']
      },
      {
        id: 'genesis',
        name: 'Genesis',
        school: 'conjuration',
        subschool: 'creation',
        descriptor: '',
        spellcraftDC: 71,
        level: 12,
        components: ['V', 'S', 'M', 'XP'],
        castingTime: '1 week (8 hours/day)',
        range: '60 ft.',
        effect: 'A demiplane coterminous with the Ethereal Plane, centered on your location',
        duration: 'Instantaneous',
        savingThrow: 'None',
        spellResistance: 'No',
        description: 'You create a small demiplane, 30 feet in radius, with limited access to the Material Plane.',
        seeds: ['conjure', 'fortify'],
        prerequisites: ['Wish', 'Limited Wish', 'Gate']
      },
      {
        id: 'mass_hold_monster',
        name: 'Mass Hold Monster',
        school: 'enchantment',
        subschool: 'compulsion',
        descriptor: 'mind-affecting',
        spellcraftDC: 76,
        level: 12,
        components: ['V', 'S', 'M/DF'],
        castingTime: '1 standard action',
        range: 'Medium (100 ft. + 10 ft./level)',
        target: 'One or more creatures, no two of which are more than 30 ft. apart',
        duration: '1 round/level (D)',
        savingThrow: 'Will negates',
        spellResistance: 'Yes',
        description: 'This spell functions like hold monster, except that it affects multiple creatures.',
        seeds: ['compel'],
        prerequisites: ['Hold Monster', 'Mass Hold Person']
      },
      {
        id: 'epic_spell_mimicry',
        name: 'Epic Spell Mimicry',
        school: 'universal',
        descriptor: '',
        spellcraftDC: 81,
        level: 13,
        components: ['V', 'S'],
        castingTime: '1 standard action',
        range: '60 ft.',
        target: 'Any creature',
        duration: '1 round/level',
        savingThrow: 'Will negates',
        spellResistance: 'Yes',
        description: 'You can cast any spell as if you knew it, but with a higher spell level.',
        seeds: ['delude'],
        prerequisites: ['Spell Mimicry', 'Greater Spell Mimicry']
      },
      {
        id: 'living_vault',
        name: 'Living Vault',
        school: 'conjuration',
        subschool: 'creation',
        descriptor: '',
        spellcraftDC: 86,
        level: 13,
        components: ['V', 'S', 'M'],
        castingTime: '1 standard action',
        range: 'Close (25 ft. + 5 ft./2 levels)',
        effect: 'One or more living vaults',
        duration: '1 hour/level (D)',
        savingThrow: 'None',
        spellResistance: 'No',
        description: 'You create one or more vaultlike creatures that can store items.',
        seeds: ['animate', 'conjure'],
        prerequisites: ['Leomund\'s Secret Chest', 'Major Creation']
      },
      {
        id: 'peripety',
        name: 'Peripety',
        school: 'enchantment',
        subschool: 'compulsion',
        descriptor: 'mind-affecting',
        spellcraftDC: 91,
        level: 14,
        components: ['V', 'S'],
        castingTime: '1 standard action',
        range: '60 ft.',
        target: 'One creature',
        duration: '1 round/level',
        savingThrow: 'Will negates',
        spellResistance: 'Yes',
        description: 'You can force a creature to reroll any roll it has just made.',
        seeds: ['compel'],
        prerequisites: ['Modify Memory', 'Reality Revision']
      },
      {
        id: 'arcane_sword',
        name: 'Arcane Sword',
        school: 'evocation',
        descriptor: 'force',
        spellcraftDC: 96,
        level: 14,
        components: ['V', 'S', 'F'],
        castingTime: '1 standard action',
        range: 'Close (25 ft. + 5 ft./2 levels)',
        effect: 'Sword of force',
        duration: '1 round/level',
        savingThrow: 'None',
        spellResistance: 'Yes',
        description: 'You create a swordlike beam of force that attacks your enemies.',
        seeds: ['energy'],
        prerequisites: ['Mordenkainen\'s Sword', 'Spiritual Weapon']
      },
      {
        id: 'deific_vengeance',
        name: 'Deific Vengeance',
        school: 'evocation',
        descriptor: '',
        spellcraftDC: 101,
        level: 15,
        components: ['V', 'S', 'DF'],
        castingTime: '1 standard action',
        range: '60 ft.',
        target: 'One creature',
        duration: 'Instantaneous',
        savingThrow: 'Fortitude partial',
        spellResistance: 'Yes',
        description: 'You call down the vengeance of your deity on a creature that has wronged you.',
        seeds: ['slay'],
        prerequisites: ['Flame Strike', 'Divine Wrath']
      },
      {
        id: 'dire_winter',
        name: 'Dire Winter',
        school: 'evocation',
        descriptor: 'cold',
        spellcraftDC: 106,
        level: 15,
        components: ['V', 'S', 'M'],
        castingTime: '1 standard action',
        range: 'Long (400 ft. + 40 ft./level)',
        area: '40-ft.-radius spread',
        duration: '1 round/level',
        savingThrow: 'Fortitude partial',
        spellResistance: 'Yes',
        description: 'You create an area of extreme cold that damages creatures and freezes water.',
        seeds: ['energy'],
        prerequisites: ['Cone of Cold', 'Ice Storm']
      },
      {
        id: 'verdigris',
        name: 'Verdigris',
        school: 'transmutation',
        descriptor: '',
        spellcraftDC: 111,
        level: 16,
        components: ['V', 'S', 'M'],
        castingTime: '1 standard action',
        range: '300 ft.',
        area: '300-ft.-radius burst',
        duration: 'Instantaneous',
        savingThrow: 'Fortitude half',
        spellResistance: 'Yes',
        description: 'You cause all metal in the area to corrode and become brittle.',
        seeds: ['destroy'],
        prerequisites: ['Rust Ray', 'Transmute Metal to Wood']
      },
      {
        id: 'create_shadow_stuff',
        name: 'Create Shadow Stuff',
        school: 'conjuration',
        subschool: 'creation',
        descriptor: 'shadow',
        spellcraftDC: 116,
        level: 16,
        components: ['V', 'S'],
        castingTime: '1 standard action',
        range: '0 ft.',
        effect: 'Up to 1 cu. ft./level of shadow stuff',
        duration: '1 hour/level (D)',
        savingThrow: 'None',
        spellResistance: 'No',
        description: 'You create tangible shadow stuff that can be shaped into objects.',
        seeds: ['conjure'],
        prerequisites: ['Shadow Conjuration', 'Major Creation']
      },
      {
        id: 'fortify_relations',
        name: 'Fortify Relations',
        school: 'enchantment',
        subschool: 'compulsion',
        descriptor: 'mind-affecting',
        spellcraftDC: 121,
        level: 17,
        components: ['V', 'S', 'M'],
        castingTime: '1 standard action',
        range: 'Close (25 ft. + 5 ft./2 levels)',
        target: 'One creature/level, no two of which are more than 30 ft. apart',
        duration: '1 hour/level',
        savingThrow: 'Will negates',
        spellResistance: 'Yes',
        description: 'You improve the attitude of creatures toward each other.',
        seeds: ['compel'],
        prerequisites: ['Charm Monster', 'Suggestion']
      },
      {
        id: 'epic_counterspell',
        name: 'Epic Counterspell',
        school: 'abjuration',
        descriptor: '',
        spellcraftDC: 126,
        level: 17,
        components: ['V', 'S'],
        castingTime: '1 standard action',
        range: '300 ft.',
        target: 'One spell',
        duration: 'Instantaneous',
        savingThrow: 'None',
        spellResistance: 'No',
        description: 'You can counter any spell, even epic spells.',
        seeds: ['avert'],
        prerequisites: ['Greater Dispel Magic', 'Spell Turning']
      },
      {
        id: 'dragon_king',
        name: 'Dragon King',
        school: 'transmutation',
        descriptor: '',
        spellcraftDC: 131,
        level: 18,
        components: ['V', 'S', 'DF'],
        castingTime: '1 standard action',
        range: 'Personal',
        target: 'You',
        duration: '1 round/level',
        savingThrow: 'None',
        spellResistance: 'No',
        description: 'You take on aspects of a dragon king, gaining various abilities.',
        seeds: ['disguise', 'fortify'],
        prerequisites: ['Shapechange', 'Dragonform']
      },
      {
        id: 'epic_mage_armor',
        name: 'Epic Mage Armor',
        school: 'conjuration',
        subschool: 'creation',
        descriptor: 'force',
        spellcraftDC: 136,
        level: 18,
        components: ['V', 'S', 'F'],
        castingTime: '1 standard action',
        range: 'Touch',
        target: 'Creature touched',
        duration: '1 hour/level (D)',
        savingThrow: 'Will negates (harmless)',
        spellResistance: 'Yes (harmless)',
        description: 'You create a suit of force armor that provides excellent protection.',
        seeds: ['fortify'],
        prerequisites: ['Mage Armor', 'Shield']
      },
      {
        id: 'hellball',
        name: 'Hellball',
        school: 'evocation',
        descriptor: 'evil, fire',
        spellcraftDC: 141,
        level: 19,
        components: ['V', 'S', 'M'],
        castingTime: '1 standard action',
        range: 'Long (400 ft. + 40 ft./level)',
        area: '20-ft.-radius spread',
        duration: 'Instantaneous',
        savingThrow: 'Reflex half',
        spellResistance: 'Yes',
        description: 'You create a ball of hellfire that explodes in a devastating blast.',
        seeds: ['energy'],
        prerequisites: ['Fireball', 'Meteor Swarm']
      },
      {
        id: 'mummy_dust',
        name: 'Mummy Dust',
        school: 'necromancy',
        descriptor: 'evil',
        spellcraftDC: 146,
        level: 19,
        components: ['V', 'S', 'M'],
        castingTime: '1 standard action',
        range: 'Medium (100 ft. + 10 ft./level)',
        area: '20-ft.-radius spread',
        duration: 'Instantaneous',
        savingThrow: 'Fortitude negates',
        spellResistance: 'Yes',
        description: 'You create a cloud of mummy dust that can kill or paralyze creatures.',
        seeds: ['slay'],
        prerequisites: ['Halt Undead', 'Destruction']
      },
      {
        id: 'superb_dispelling',
        name: 'Superb Dispelling',
        school: 'abjuration',
        descriptor: '',
        spellcraftDC: 151,
        level: 20,
        components: ['V', 'S'],
        castingTime: '1 standard action',
        range: 'Medium (100 ft. + 10 ft./level)',
        target: 'One creature, object, or area',
        duration: 'Instantaneous',
        savingThrow: 'None',
        spellResistance: 'No',
        description: 'You can dispel any magical effect, even epic spells and artifacts.',
        seeds: ['avert'],
        prerequisites: ['Greater Dispel Magic', 'Mordenkainen\'s Disjunction']
      }
    ];

    for (const spell of epicSpellsData) {
      this.epicSpells.set(spell.id, spell);
    }

    console.log(`📚 Loaded ${this.epicSpells.size} epic spells`);
  }

  async buildSpellPrerequisites() {
    // Build prerequisite relationships for epic spells
    for (const [spellId, spell] of this.epicSpells) {
      const prerequisites = {
        spellcraftDC: spell.spellcraftDC,
        level: spell.level,
        seeds: spell.seeds,
        requiredSpells: spell.prerequisites || [],
        components: spell.components,
        castingTime: spell.castingTime
      };

      this.spellPrerequisites.set(spellId, prerequisites);
    }

    console.log('🔗 Built spell prerequisite graph');
  }

  // Public API methods
  async getAllEpicSpells() {
    return Array.from(this.epicSpells.values());
  }

  async getEpicSpell(spellId) {
    return this.epicSpells.get(spellId);
  }

  async getEpicSpellsByLevel(minLevel, maxLevel = 20) {
    const spells = [];
    for (const [spellId, spell] of this.epicSpells) {
      if (spell.level >= minLevel && spell.level <= maxLevel) {
        spells.push(spell);
      }
    }
    return spells;
  }

  async getEpicSpellsBySchool(school) {
    const spells = [];
    for (const [spellId, spell] of this.epicSpells) {
      if (spell.school === school) {
        spells.push(spell);
      }
    }
    return spells;
  }

  async getSpellPrerequisites(spellId) {
    return this.spellPrerequisites.get(spellId);
  }

  async getSpellSeeds() {
    return Array.from(this.spellSeeds.values());
  }

  async getSpellSeed(seedId) {
    return this.spellSeeds.get(seedId);
  }

  async canCastEpicSpell(character, spellId) {
    const spell = this.epicSpells.get(spellId);
    if (!spell) {
      return { canCast: false, reason: 'Spell not found' };
    }

    const prereqs = this.spellPrerequisites.get(spellId);
    if (!prereqs) {
      return { canCast: false, reason: 'Prerequisites not found' };
    }

    // Check caster level
    if (character.level < spell.level) {
      return { canCast: false, reason: `Level ${spell.level} required, currently ${character.level}` };
    }

    // Check Spellcraft skill
    const spellcraftSkill = character.skills?.spellcraft;
    if (!spellcraftSkill || spellcraftSkill.ranks < prereqs.spellcraftDC) {
      return { canCast: false, reason: `Spellcraft ${prereqs.spellcraftDC} required` };
    }

    // Check required spells
    for (const requiredSpell of prereqs.requiredSpells) {
      if (!this.characterKnowsSpell(character, requiredSpell)) {
        return { canCast: false, reason: `Required spell not known: ${requiredSpell}` };
      }
    }

    // Check spell seeds (must know the seeds)
    for (const seedId of prereqs.seeds) {
      if (!this.characterKnowsSpellSeed(character, seedId)) {
        return { canCast: false, reason: `Required spell seed not known: ${seedId}` };
      }
    }

    return { canCast: true };
  }

  async searchEpicSpells(query) {
    const results = [];
    const searchTerm = query.toLowerCase();

    for (const [spellId, spell] of this.epicSpells) {
      if (spell.name.toLowerCase().includes(searchTerm) ||
          spell.description.toLowerCase().includes(searchTerm) ||
          spell.school.toLowerCase().includes(searchTerm)) {
        results.push(spell);
      }
    }

    return results;
  }

  async getEpicSpellsForCharacter(character) {
    const availableSpells = [];

    for (const [spellId, spell] of this.epicSpells) {
      const canCast = await this.canCastEpicSpell(character, spellId);
      if (canCast.canCast) {
        availableSpells.push(spell);
      }
    }

    return availableSpells;
  }

  characterKnowsSpell(character, spellName) {
    return character.spells && character.spells.some(spell => spell.name === spellName);
  }

  characterKnowsSpellSeed(character, seedId) {
    return character.spellSeeds && character.spellSeeds.includes(seedId);
  }

  // Calculate spellcraft DC for custom epic spells
  async calculateSpellcraftDC(seeds, modifiers = {}) {
    let baseDC = 20; // Base DC for epic spells

    // Add DC for each seed
    for (const seedId of seeds) {
      const seed = this.spellSeeds.get(seedId);
      if (seed) {
        baseDC += seed.spellcraftDC - 20; // Add the seed's DC modifier
      }
    }

    // Apply modifiers
    if (modifiers.area) baseDC += 2;
    if (modifiers.damage) baseDC += 2;
    if (modifiers.duration) baseDC += 2;
    if (modifiers.range) baseDC += 2;
    if (modifiers.targets) baseDC += 2;

    return Math.max(baseDC, 21); // Minimum DC of 21 for epic spells
  }

  // Export spell data
  async exportSpellData() {
    const exportData = {
      epicSpells: Object.fromEntries(this.epicSpells),
      spellPrerequisites: Object.fromEntries(this.spellPrerequisites),
      spellSeeds: Object.fromEntries(this.spellSeeds),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return exportData;
  }
}

// Error Classes
class EpicSpellDatabaseError extends Error {
  constructor(message) { super(message); this.name = 'EpicSpellDatabaseError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EpicSpellDatabase;
} else if (typeof window !== 'undefined') {
  window.EpicSpellDatabase = EpicSpellDatabase;
}
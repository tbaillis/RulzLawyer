// code-repository/src/story/backstory-generator.js
class BackstoryGenerator {
  constructor() {
    this.backgrounds = new Map();
    this.origins = new Map();
    this.motivations = new Map();
    this.flaws = new Map();
    this.ideals = new Map();
    this.bonds = new Map();
    this.personalityTraits = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('🎲 Initializing Backstory Generator...');
    const startTime = performance.now();

    try {
      await this.loadBackgrounds();
      await this.loadOrigins();
      await this.loadMotivations();
      await this.loadFlaws();
      await this.loadIdeals();
      await this.loadBonds();
      await this.loadPersonalityTraits();

      const initTime = performance.now() - startTime;
      console.log(`✅ Backstory Generator initialized in ${initTime.toFixed(2)}ms`);

      this.initialized = true;
    } catch (error) {
      console.error('❌ Backstory Generator initialization failed:', error);
      throw new BackstoryGeneratorError(error.message);
    }
  }

  async loadBackgrounds() {
    // Character backgrounds from D&D 3.5
    const backgroundsData = [
      {
        id: 'noble',
        name: 'Noble',
        description: 'Born into aristocracy, trained in courtly arts and politics',
        skillProficiencies: ['Diplomacy', 'Sense Motive', 'Knowledge (nobility)'],
        equipment: ['Fine clothes', 'Signet ring', 'Letter of marque'],
        features: ['Position of Privilege', 'Noble Education']
      },
      {
        id: 'merchant',
        name: 'Merchant',
        description: 'Trained in the arts of trade and commerce',
        skillProficiencies: ['Appraise', 'Diplomacy', 'Sense Motive'],
        equipment: ['Fine clothes', 'Scale', 'Merchant\'s license'],
        features: ['Guild Membership', 'Barter Master']
      },
      {
        id: 'scholar',
        name: 'Scholar',
        description: 'Dedicated to the pursuit of knowledge and learning',
        skillProficiencies: ['Knowledge (any)', 'Decipher Script', 'Research'],
        equipment: ['Bottle of ink', 'Quill', 'Book of lore'],
        features: ['Researcher', 'Librarian Access']
      },
      {
        id: 'criminal',
        name: 'Criminal',
        description: 'Skilled in the arts of stealth and deception',
        skillProficiencies: ['Bluff', 'Hide', 'Sleight of Hand'],
        equipment: ['Crowbar', 'Dark clothes', 'Thieves\' tools'],
        features: ['Criminal Contact', 'Street Knowledge']
      },
      {
        id: 'soldier',
        name: 'Soldier',
        description: 'Trained in the discipline of military service',
        skillProficiencies: ['Athletics', 'Intimidate', 'Survival'],
        equipment: ['Uniform', 'Insignia of rank', 'Common weapon'],
        features: ['Military Rank', 'Tactics Training']
      },
      {
        id: 'priest',
        name: 'Priest',
        description: 'Devoted to service of a deity or religious order',
        skillProficiencies: ['Knowledge (religion)', 'Diplomacy', 'Heal'],
        equipment: ['Holy symbol', 'Prayer book', 'Incense'],
        features: ['Divine Blessing', 'Temple Access']
      },
      {
        id: 'artisan',
        name: 'Artisan',
        description: 'Master of a particular craft or trade skill',
        skillProficiencies: ['Craft (any)', 'Appraise', 'Profession'],
        equipment: ['Artisan\'s tools', 'Guild letter', 'Fine clothes'],
        features: ['Guild Membership', 'Masterwork Item']
      },
      {
        id: 'adventurer',
        name: 'Adventurer',
        description: 'Veteran of many dangerous expeditions',
        skillProficiencies: ['Survival', 'Knowledge (dungeoneering)', 'Spot'],
        equipment: ['Backpack', 'Map case', 'Lucky charm'],
        features: ['Adventurer\'s Luck', 'Explorer\'s Knowledge']
      }
    ];

    for (const background of backgroundsData) {
      this.backgrounds.set(background.id, background);
    }

    console.log(`📜 Loaded ${this.backgrounds.size} character backgrounds`);
  }

  async loadOrigins() {
    // Character origins and upbringings
    const originsData = [
      {
        id: 'city_raised',
        name: 'City-Raised',
        description: 'Grew up in a bustling urban environment',
        influences: ['Street-smart', 'Cultured', 'Ambitious'],
        commonMotivations: ['wealth', 'power', 'fame']
      },
      {
        id: 'rural_raised',
        name: 'Rural-Raised',
        description: 'Raised in a quiet countryside setting',
        influences: ['Hard-working', 'Traditional', 'Nature-loving'],
        commonMotivations: ['family', 'community', 'tradition']
      },
      {
        id: 'noble_birth',
        name: 'Noble Birth',
        description: 'Born into wealth and privilege',
        influences: ['Refined', 'Ambitious', 'Entitled'],
        commonMotivations: ['legacy', 'honor', 'power']
      },
      {
        id: 'street_urchin',
        name: 'Street Urchin',
        description: 'Survived on the streets from a young age',
        influences: ['Resourceful', 'Cynical', 'Independent'],
        commonMotivations: ['survival', 'revenge', 'redemption']
      },
      {
        id: 'military_family',
        name: 'Military Family',
        description: 'Raised in a family with strong military traditions',
        influences: ['Disciplined', 'Loyal', 'Strategic'],
        commonMotivations: ['duty', 'honor', 'service']
      },
      {
        id: 'religious_upbringing',
        name: 'Religious Upbringing',
        description: 'Raised in a devout religious household',
        influences: ['Spiritual', 'Moral', 'Devout'],
        commonMotivations: ['faith', 'redemption', 'divine_purpose']
      },
      {
        id: 'tragic_loss',
        name: 'Marked by Tragedy',
        description: 'Life shaped by significant loss or trauma',
        influences: ['Resilient', 'Guarded', 'Driven'],
        commonMotivations: ['revenge', 'justice', 'healing']
      },
      {
        id: 'mysterious_past',
        name: 'Mysterious Past',
        description: 'Background shrouded in mystery and secrets',
        influences: ['Enigmatic', 'Cautious', 'Curious'],
        commonMotivations: ['discovery', 'identity', 'freedom']
      }
    ];

    for (const origin of originsData) {
      this.origins.set(origin.id, origin);
    }

    console.log(`🏠 Loaded ${this.origins.size} character origins`);
  }

  async loadMotivations() {
    // Character motivations and drives
    const motivationsData = [
      {
        id: 'wealth',
        name: 'Pursuit of Wealth',
        description: 'Driven by the desire for riches and material success',
        alignmentTendency: 'any',
        commonBackgrounds: ['merchant', 'noble', 'criminal']
      },
      {
        id: 'power',
        name: 'Quest for Power',
        description: 'Seeks influence and control over others',
        alignmentTendency: 'lawful or evil',
        commonBackgrounds: ['noble', 'soldier', 'criminal']
      },
      {
        id: 'knowledge',
        name: 'Thirst for Knowledge',
        description: 'Driven to understand the mysteries of the world',
        alignmentTendency: 'any',
        commonBackgrounds: ['scholar', 'priest', 'adventurer']
      },
      {
        id: 'justice',
        name: 'Fight for Justice',
        description: 'Committed to righting wrongs and protecting the innocent',
        alignmentTendency: 'good',
        commonBackgrounds: ['soldier', 'priest', 'adventurer']
      },
      {
        id: 'revenge',
        name: 'Path of Revenge',
        description: 'Motivated by the need to avenge past wrongs',
        alignmentTendency: 'any',
        commonBackgrounds: ['criminal', 'adventurer']
      },
      {
        id: 'redemption',
        name: 'Search for Redemption',
        description: 'Seeking to atone for past mistakes',
        alignmentTendency: 'good',
        commonBackgrounds: ['criminal', 'priest']
      },
      {
        id: 'freedom',
        name: 'Love of Freedom',
        description: 'Values personal liberty above all else',
        alignmentTendency: 'chaotic',
        commonBackgrounds: ['criminal', 'adventurer']
      },
      {
        id: 'duty',
        name: 'Sense of Duty',
        description: 'Driven by obligations and responsibilities',
        alignmentTendency: 'lawful',
        commonBackgrounds: ['soldier', 'noble', 'priest']
      },
      {
        id: 'honor',
        name: 'Code of Honor',
        description: 'Guided by a strict personal code of ethics',
        alignmentTendency: 'lawful good',
        commonBackgrounds: ['soldier', 'noble']
      },
      {
        id: 'curiosity',
        name: 'Insatiable Curiosity',
        description: 'Driven by the need to explore and discover',
        alignmentTendency: 'any',
        commonBackgrounds: ['scholar', 'adventurer']
      }
    ];

    for (const motivation of motivationsData) {
      this.motivations.set(motivation.id, motivation);
    }

    console.log(`🎯 Loaded ${this.motivations.size} character motivations`);
  }

  async loadFlaws() {
    // Character flaws and weaknesses
    const flawsData = [
      {
        id: 'greedy',
        name: 'Greed',
        description: 'Obsessed with acquiring wealth and possessions',
        impact: 'May take unnecessary risks for treasure'
      },
      {
        id: 'arrogant',
        name: 'Arrogance',
        description: 'Believes oneself superior to others',
        impact: 'May underestimate opponents or allies'
      },
      {
        id: 'impulsive',
        name: 'Impulsiveness',
        description: 'Acts without thinking through consequences',
        impact: 'May make rash decisions in critical moments'
      },
      {
        id: 'cowardly',
        name: 'Cowardice',
        description: 'Flees from danger rather than facing it',
        impact: 'May abandon allies in combat'
      },
      {
        id: 'deceptive',
        name: 'Deception',
        description: 'Habitually lies and misleads others',
        impact: 'Allies may not trust the character'
      },
      {
        id: 'reckless',
        name: 'Recklessness',
        description: 'Takes unnecessary risks without regard for safety',
        impact: 'May endanger self and others'
      },
      {
        id: 'vengeful',
        name: 'Vengefulness',
        description: 'Obsessed with getting even with those who wronged them',
        impact: 'May prioritize revenge over more important goals'
      },
      {
        id: 'addictive',
        name: 'Addiction',
        description: 'Dependent on a substance or behavior',
        impact: 'May suffer withdrawal or make poor decisions'
      },
      {
        id: 'paranoid',
        name: 'Paranoia',
        description: 'Believes others are plotting against them',
        impact: 'May alienate allies and miss opportunities'
      },
      {
        id: 'selfish',
        name: 'Selfishness',
        description: 'Puts own needs above others\' welfare',
        impact: 'May sacrifice allies for personal gain'
      }
    ];

    for (const flaw of flawsData) {
      this.flaws.set(flaw.id, flaw);
    }

    console.log(`⚠️ Loaded ${this.flaws.size} character flaws`);
  }

  async loadIdeals() {
    // Character ideals and beliefs
    const idealsData = [
      {
        id: 'tradition',
        name: 'Tradition',
        description: 'The ancient ways of our ancestors must be preserved',
        alignment: 'lawful'
      },
      {
        id: 'charity',
        name: 'Charity',
        description: 'I help the less fortunate and protect the weak',
        alignment: 'good'
      },
      {
        id: 'change',
        name: 'Change',
        description: 'We must change the world for the better',
        alignment: 'chaotic'
      },
      {
        id: 'power',
        name: 'Power',
        description: 'The strong should rule over the weak',
        alignment: 'evil'
      },
      {
        id: 'knowledge',
        name: 'Knowledge',
        description: 'The pursuit of knowledge is the highest calling',
        alignment: 'neutral'
      },
      {
        id: 'freedom',
        name: 'Freedom',
        description: 'Everyone should be free to pursue their own destiny',
        alignment: 'chaotic'
      },
      {
        id: 'justice',
        name: 'Justice',
        description: 'Justice must be served, no matter the cost',
        alignment: 'lawful'
      },
      {
        id: 'community',
        name: 'Community',
        description: 'The needs of the community come before individual desires',
        alignment: 'good'
      },
      {
        id: 'ambition',
        name: 'Ambition',
        description: 'I strive for greatness and will not be held back',
        alignment: 'neutral'
      },
      {
        id: 'honor',
        name: 'Honor',
        description: 'My word is my bond, and I will die before breaking it',
        alignment: 'lawful good'
      }
    ];

    for (const ideal of idealsData) {
      this.ideals.set(ideal.id, ideal);
    }

    console.log(`⭐ Loaded ${this.ideals.size} character ideals`);
  }

  async loadBonds() {
    // Character bonds and connections
    const bondsData = [
      {
        id: 'family',
        name: 'Family',
        description: 'I would do anything for my family',
        strength: 'strong'
      },
      {
        id: 'mentor',
        name: 'Mentor',
        description: 'My mentor gave me purpose and direction',
        strength: 'strong'
      },
      {
        id: 'romantic_partner',
        name: 'Romantic Partner',
        description: 'My love gives me strength and hope',
        strength: 'strong'
      },
      {
        id: 'close_friend',
        name: 'Close Friend',
        description: 'My closest friend has always been there for me',
        strength: 'strong'
      },
      {
        id: 'guild',
        name: 'Guild Membership',
        description: 'My guild is my extended family',
        strength: 'medium'
      },
      {
        id: 'homeland',
        name: 'Homeland',
        description: 'I will defend my homeland to the death',
        strength: 'strong'
      },
      {
        id: 'deity',
        name: 'Devotion to Deity',
        description: 'My deity guides my every action',
        strength: 'strong'
      },
      {
        id: 'oath',
        name: 'Sacred Oath',
        description: 'I have sworn an oath that I will uphold',
        strength: 'strong'
      },
      {
        id: 'artifact',
        name: 'Sacred Artifact',
        description: 'I must protect this artifact at all costs',
        strength: 'medium'
      },
      {
        id: 'cause',
        name: 'Greater Cause',
        description: 'I fight for a cause greater than myself',
        strength: 'strong'
      }
    ];

    for (const bond of bondsData) {
      this.bonds.set(bond.id, bond);
    }

    console.log(`🔗 Loaded ${this.bonds.size} character bonds`);
  }

  async loadPersonalityTraits() {
    // Character personality traits
    const traitsData = [
      {
        id: 'brave',
        name: 'Brave',
        description: 'I face danger without fear',
        positive: true
      },
      {
        id: 'curious',
        name: 'Curious',
        description: 'I am always eager to learn new things',
        positive: true
      },
      {
        id: 'loyal',
        name: 'Loyal',
        description: 'I stand by my friends and allies',
        positive: true
      },
      {
        id: 'wise',
        name: 'Wise',
        description: 'I have learned much from my experiences',
        positive: true
      },
      {
        id: 'charismatic',
        name: 'Charismatic',
        description: 'I can charm and persuade others easily',
        positive: true
      },
      {
        id: 'stubborn',
        name: 'Stubborn',
        description: 'I refuse to change my mind once it\'s made up',
        positive: false
      },
      {
        id: 'suspicious',
        name: 'Suspicious',
        description: 'I trust no one until they prove themselves',
        positive: false
      },
      {
        id: 'reckless',
        name: 'Reckless',
        description: 'I act without considering the consequences',
        positive: false
      },
      {
        id: 'moody',
        name: 'Moody',
        description: 'My emotions change quickly and unpredictably',
        positive: false
      },
      {
        id: 'obsessive',
        name: 'Obsessive',
        description: 'I become fixated on certain ideas or objects',
        positive: false
      },
      {
        id: 'optimistic',
        name: 'Optimistic',
        description: 'I always look on the bright side of things',
        positive: true
      },
      {
        id: 'pessimistic',
        name: 'Pessimistic',
        description: 'I expect the worst in every situation',
        positive: false
      },
      {
        id: 'generous',
        name: 'Generous',
        description: 'I give freely of my time and resources',
        positive: true
      },
      {
        id: 'selfish',
        name: 'Selfish',
        description: 'I put my own needs above others\'',
        positive: false
      },
      {
        id: 'patient',
        name: 'Patient',
        description: 'I can wait calmly for the right moment',
        positive: true
      },
      {
        id: 'impatient',
        name: 'Impatient',
        description: 'I want everything done immediately',
        positive: false
      },
      {
        id: 'honest',
        name: 'Honest',
        description: 'I always tell the truth, even when it hurts',
        positive: true
      },
      {
        id: 'deceptive',
        name: 'Deceptive',
        description: 'I use lies and tricks to get what I want',
        positive: false
      },
      {
        id: 'confident',
        name: 'Confident',
        description: 'I believe in my own abilities',
        positive: true
      },
      {
        id: 'insecure',
        name: 'Insecure',
        description: 'I doubt my own worth and abilities',
        positive: false
      }
    ];

    for (const trait of traitsData) {
      this.personalityTraits.set(trait.id, trait);
    }

    console.log(`🧠 Loaded ${this.personalityTraits.size} personality traits`);
  }

  // Public API methods
  async generateRandomBackstory(characterClass = null, race = null, alignment = null) {
    const backstory = {
      background: await this.selectRandomBackground(characterClass),
      origin: await this.selectRandomOrigin(),
      motivations: await this.selectMotivations(2),
      flaws: await this.selectFlaws(1),
      ideals: await this.selectIdeals(1),
      bonds: await this.selectBonds(1),
      personalityTraits: await this.selectPersonalityTraits(2)
    };

    // Generate narrative description
    backstory.narrative = await this.generateNarrativeDescription(backstory);

    return backstory;
  }

  async selectRandomBackground(characterClass) {
    const backgrounds = Array.from(this.backgrounds.values());

    // Filter by class compatibility if specified
    let filteredBackgrounds = backgrounds;
    if (characterClass) {
      // Simple compatibility filtering
      const classCompatible = {
        'fighter': ['soldier', 'noble', 'criminal'],
        'wizard': ['scholar', 'noble', 'merchant'],
        'cleric': ['priest', 'noble', 'soldier'],
        'rogue': ['criminal', 'merchant', 'artisan'],
        'ranger': ['adventurer', 'soldier', 'criminal'],
        'paladin': ['soldier', 'noble', 'priest'],
        'barbarian': ['adventurer', 'soldier', 'criminal'],
        'bard': ['noble', 'merchant', 'criminal'],
        'druid': ['adventurer', 'priest', 'scholar'],
        'monk': ['priest', 'criminal', 'adventurer']
      };

      const compatibleIds = classCompatible[characterClass.toLowerCase()] || [];
      filteredBackgrounds = backgrounds.filter(bg => compatibleIds.includes(bg.id));
    }

    if (filteredBackgrounds.length === 0) {
      filteredBackgrounds = backgrounds; // Fallback to all backgrounds
    }

    return filteredBackgrounds[Math.floor(Math.random() * filteredBackgrounds.length)];
  }

  async selectRandomOrigin() {
    const origins = Array.from(this.origins.values());
    return origins[Math.floor(Math.random() * origins.length)];
  }

  async selectMotivations(count) {
    const motivations = Array.from(this.motivations.values());
    const selected = [];
    const shuffled = [...motivations].sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(count, motivations.length); i++) {
      selected.push(shuffled[i]);
    }

    return selected;
  }

  async selectFlaws(count) {
    const flaws = Array.from(this.flaws.values());
    const selected = [];
    const shuffled = [...flaws].sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(count, flaws.length); i++) {
      selected.push(shuffled[i]);
    }

    return selected;
  }

  async selectIdeals(count) {
    const ideals = Array.from(this.ideals.values());
    const selected = [];
    const shuffled = [...ideals].sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(count, ideals.length); i++) {
      selected.push(shuffled[i]);
    }

    return selected;
  }

  async selectBonds(count) {
    const bonds = Array.from(this.bonds.values());
    const selected = [];
    const shuffled = [...bonds].sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(count, bonds.length); i++) {
      selected.push(shuffled[i]);
    }

    return selected;
  }

  async selectPersonalityTraits(count) {
    const traits = Array.from(this.personalityTraits.values());
    const selected = [];
    const shuffled = [...traits].sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(count, traits.length); i++) {
      selected.push(shuffled[i]);
    }

    return selected;
  }

  async generateNarrativeDescription(backstory) {
    const originDesc = backstory.origin.description;
    const backgroundDesc = backstory.background.description;
    const motivationDesc = backstory.motivations.map(m => m.name).join(' and ');
    const flawDesc = backstory.flaws.map(f => f.name.toLowerCase()).join(' and ');
    const idealDesc = backstory.ideals.map(i => i.name.toLowerCase()).join(' and ');
    const bondDesc = backstory.bonds.map(b => b.description.toLowerCase()).join(' and ');
    const traitDesc = backstory.personalityTraits.map(t => t.name.toLowerCase()).join(' and ');

    const narrative = `${originDesc}. ${backgroundDesc}. ` +
      `Driven by ${motivationDesc}, though plagued by ${flawDesc}. ` +
      `You believe in ${idealDesc}, and ${bondDesc}. ` +
      `Your personality is marked by being ${traitDesc}.`;

    return narrative;
  }

  async customizeBackstory(baseBackstory, customizations) {
    const customized = { ...baseBackstory };

    // Apply customizations
    if (customizations.background) {
      customized.background = this.backgrounds.get(customizations.background) || customized.background;
    }
    if (customizations.origin) {
      customized.origin = this.origins.get(customizations.origin) || customized.origin;
    }
    if (customizations.motivations) {
      customized.motivations = customizations.motivations.map(id => this.motivations.get(id)).filter(m => m);
    }
    if (customizations.flaws) {
      customized.flaws = customizations.flaws.map(id => this.flaws.get(id)).filter(f => f);
    }
    if (customizations.ideals) {
      customized.ideals = customizations.ideals.map(id => this.ideals.get(id)).filter(i => i);
    }
    if (customizations.bonds) {
      customized.bonds = customizations.bonds.map(id => this.bonds.get(id)).filter(b => b);
    }
    if (customizations.personalityTraits) {
      customized.personalityTraits = customizations.personalityTraits.map(id => this.personalityTraits.get(id)).filter(t => t);
    }

    // Regenerate narrative
    customized.narrative = await this.generateNarrativeDescription(customized);

    return customized;
  }

  // Get all options for UI
  async getAllBackgrounds() {
    return Array.from(this.backgrounds.values());
  }

  async getAllOrigins() {
    return Array.from(this.origins.values());
  }

  async getAllMotivations() {
    return Array.from(this.motivations.values());
  }

  async getAllFlaws() {
    return Array.from(this.flaws.values());
  }

  async getAllIdeals() {
    return Array.from(this.ideals.values());
  }

  async getAllBonds() {
    return Array.from(this.bonds.values());
  }

  async getAllPersonalityTraits() {
    return Array.from(this.personalityTraits.values());
  }

  async exportBackstoryData() {
    const exportData = {
      backgrounds: Object.fromEntries(this.backgrounds),
      origins: Object.fromEntries(this.origins),
      motivations: Object.fromEntries(this.motivations),
      flaws: Object.fromEntries(this.flaws),
      ideals: Object.fromEntries(this.ideals),
      bonds: Object.fromEntries(this.bonds),
      personalityTraits: Object.fromEntries(this.personalityTraits),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return exportData;
  }
}

// Error Classes
class BackstoryGeneratorError extends Error {
  constructor(message) { super(message); this.name = 'BackstoryGeneratorError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BackstoryGenerator;
} else if (typeof window !== 'undefined') {
  window.BackstoryGenerator = BackstoryGenerator;
}
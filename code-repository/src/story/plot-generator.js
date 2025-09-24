// code-repository/src/story/plot-generator.js
class PlotGenerator {
  constructor() {
    this.plotHooks = new Map();
    this.plotArcs = new Map();
    this.encounters = new Map();
    this.twists = new Map();
    this.resolutions = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('📖 Initializing Plot Generator...');
    const startTime = performance.now();

    try {
      await this.loadPlotHooks();
      await this.loadPlotArcs();
      await this.loadEncounters();
      await this.loadTwists();
      await this.loadResolutions();

      const initTime = performance.now() - startTime;
      console.log(`✅ Plot Generator initialized in ${initTime.toFixed(2)}ms`);

      this.initialized = true;
    } catch (error) {
      console.error('❌ Plot Generator initialization failed:', error);
      throw new PlotGeneratorError(error.message);
    }
  }

  async loadPlotHooks() {
    // Plot hooks to draw characters into adventures
    const plotHooksData = [
      {
        id: 'mysterious_letter',
        name: 'Mysterious Letter',
        description: 'A sealed letter arrives with no return address, containing cryptic information',
        type: 'personal',
        difficulty: 'low',
        commonSettings: ['urban', 'rural', 'dungeon']
      },
      {
        id: 'disappearing_villagers',
        name: 'Disappearing Villagers',
        description: 'Local villagers have been vanishing without a trace',
        type: 'mystery',
        difficulty: 'medium',
        commonSettings: ['rural', 'forest', 'mountain']
      },
      {
        id: 'ancient_ruins',
        name: 'Ancient Ruins Discovery',
        description: 'Explorers uncover ruins containing strange artifacts',
        type: 'exploration',
        difficulty: 'medium',
        commonSettings: ['desert', 'jungle', 'mountain']
      },
      {
        id: 'cursed_artifact',
        name: 'Cursed Artifact',
        description: 'A powerful item brings doom to its possessor',
        type: 'supernatural',
        difficulty: 'high',
        commonSettings: ['dungeon', 'tomb', 'ruins']
      },
      {
        id: 'political_intrigue',
        name: 'Political Intrigue',
        description: 'Court politics and assassination plots threaten the realm',
        type: 'political',
        difficulty: 'high',
        commonSettings: ['urban', 'castle', 'court']
      },
      {
        id: 'monster_attack',
        name: 'Monster Attack',
        description: 'A terrifying creature rampages through civilized lands',
        type: 'combat',
        difficulty: 'medium',
        commonSettings: ['rural', 'forest', 'mountain']
      },
      {
        id: 'lost_heir',
        name: 'Lost Heir',
        description: 'A noble family searches for their missing child',
        type: 'personal',
        difficulty: 'medium',
        commonSettings: ['urban', 'rural', 'forest']
      },
      {
        id: 'prophecy',
        name: 'Ancient Prophecy',
        description: 'An old prophecy foretells doom unless heroes intervene',
        type: 'supernatural',
        difficulty: 'high',
        commonSettings: ['temple', 'ruins', 'library']
      },
      {
        id: 'bandit_problem',
        name: 'Bandit Problem',
        description: 'Local bandits terrorize trade routes and villages',
        type: 'combat',
        difficulty: 'low',
        commonSettings: ['rural', 'forest', 'road']
      },
      {
        id: 'magical_mishap',
        name: 'Magical Mishap',
        description: 'A spell gone wrong causes chaos in the local area',
        type: 'supernatural',
        difficulty: 'medium',
        commonSettings: ['urban', 'tower', 'laboratory']
      },
      {
        id: 'treasure_map',
        name: 'Treasure Map',
        description: 'An old map leads to hidden riches',
        type: 'exploration',
        difficulty: 'medium',
        commonSettings: ['coast', 'island', 'mountain']
      },
      {
        id: 'haunted_location',
        name: 'Haunted Location',
        description: 'A place is plagued by supernatural occurrences',
        type: 'supernatural',
        difficulty: 'high',
        commonSettings: ['ruins', 'graveyard', 'manor']
      }
    ];

    for (const hook of plotHooksData) {
      this.plotHooks.set(hook.id, hook);
    }

    console.log(`🎣 Loaded ${this.plotHooks.size} plot hooks`);
  }

  async loadPlotArcs() {
    // Classic story arcs and progression patterns
    const plotArcsData = [
      {
        id: 'hero_journey',
        name: 'Hero\'s Journey',
        description: 'The classic monomyth: call to adventure, trials, transformation, return',
        stages: ['ordinary_world', 'call_to_adventure', 'refusal', 'mentor', 'crossing_threshold', 'tests', 'approach', 'ordeal', 'reward', 'road_back', 'resurrection', 'return'],
        themes: ['growth', 'transformation', 'destiny']
      },
      {
        id: 'revenge_tragedy',
        name: 'Revenge Tragedy',
        description: 'A quest for vengeance that consumes the seeker',
        stages: ['inciting_incident', 'quest_begins', 'first_success', 'escalation', 'moral_dilemma', 'downfall', 'tragic_end'],
        themes: ['revenge', 'corruption', 'tragedy']
      },
      {
        id: 'redemption_arc',
        name: 'Redemption Arc',
        description: 'A character seeks to atone for past wrongs',
        stages: ['past_revealed', 'guilt', 'first_step', 'setback', 'growth', 'sacrifice', 'redemption'],
        themes: ['forgiveness', 'change', 'atonement']
      },
      {
        id: 'power_corruption',
        name: 'Power and Corruption',
        description: 'The corrupting influence of power and authority',
        stages: ['rise_to_power', 'first_taste', 'moral_compromise', 'corruption', 'confrontation', 'fall', 'aftermath'],
        themes: ['power', 'corruption', 'hubris']
      },
      {
        id: 'lost_and_found',
        name: 'Lost and Found',
        description: 'Searching for something precious that was lost',
        stages: ['loss', 'search_begins', 'clues', 'obstacles', 'discovery', 'reunion', 'resolution'],
        themes: ['loss', 'hope', 'recovery']
      },
      {
        id: 'forbidden_knowledge',
        name: 'Forbidden Knowledge',
        description: 'The pursuit of dangerous or forbidden information',
        stages: ['curiosity', 'first_discovery', 'warning', 'deeper_search', 'danger', 'consequences', 'choice'],
        themes: ['knowledge', 'danger', 'consequences']
      },
      {
        id: 'alliance_betrayal',
        name: 'Alliance and Betrayal',
        description: 'Forming alliances that lead to betrayal and conflict',
        stages: ['meeting', 'alliance', 'cooperation', 'doubt', 'betrayal', 'conflict', 'resolution'],
        themes: ['trust', 'betrayal', 'loyalty']
      },
      {
        id: 'coming_age',
        name: 'Coming of Age',
        description: 'A young character matures through trials and experiences',
        stages: ['innocence', 'first_challenge', 'failure', 'growth', 'mastery', 'responsibility', 'maturity'],
        themes: ['growth', 'maturity', 'responsibility']
      }
    ];

    for (const arc of plotArcsData) {
      this.plotArcs.set(arc.id, arc);
    }

    console.log(`📈 Loaded ${this.plotArcs.size} plot arcs`);
  }

  async loadEncounters() {
    // Random encounters and complications
    const encountersData = [
      {
        id: 'bandit_ambush',
        name: 'Bandit Ambush',
        description: 'Highway robbers attack the party',
        type: 'combat',
        difficulty: 'medium',
        outcomes: ['victory', 'defeat', 'negotiation', 'escape']
      },
      {
        id: 'mysterious_stranger',
        name: 'Mysterious Stranger',
        description: 'A enigmatic figure offers help or hindrance',
        type: 'social',
        difficulty: 'low',
        outcomes: ['alliance', 'betrayal', 'information', 'conflict']
      },
      {
        id: 'natural_disaster',
        name: 'Natural Disaster',
        description: 'Storm, earthquake, or other natural calamity',
        type: 'environmental',
        difficulty: 'high',
        outcomes: ['survival', 'rescue', 'loss', 'opportunity']
      },
      {
        id: 'magical_anomaly',
        name: 'Magical Anomaly',
        description: 'Strange magical effects in the area',
        type: 'supernatural',
        difficulty: 'medium',
        outcomes: ['exploitation', 'avoidance', 'study', 'danger']
      },
      {
        id: 'lost_caravan',
        name: 'Lost Caravan',
        description: 'Travelers who have lost their way',
        type: 'social',
        difficulty: 'low',
        outcomes: ['rescue', 'trade', 'information', 'threat']
      },
      {
        id: 'ancient_guardian',
        name: 'Ancient Guardian',
        description: 'A construct or being protecting something',
        type: 'combat',
        difficulty: 'high',
        outcomes: ['defeat', 'bypass', 'alliance', 'destruction']
      },
      {
        id: 'moral_dilemma',
        name: 'Moral Dilemma',
        description: 'A choice between right and wrong actions',
        type: 'social',
        difficulty: 'medium',
        outcomes: ['good_choice', 'evil_choice', 'compromise', 'avoidance']
      },
      {
        id: 'valuable_discovery',
        name: 'Valuable Discovery',
        description: 'Finding treasure, artifacts, or useful items',
        type: 'exploration',
        difficulty: 'low',
        outcomes: ['claim', 'share', 'hide', 'trade']
      },
      {
        id: 'rival_party',
        name: 'Rival Adventurers',
        description: 'Competing group with similar goals',
        type: 'social',
        difficulty: 'medium',
        outcomes: ['alliance', 'competition', 'conflict', 'cooperation']
      },
      {
        id: 'supernatural_event',
        name: 'Supernatural Event',
        description: 'Ghosts, visions, or otherworldly occurrences',
        type: 'supernatural',
        difficulty: 'high',
        outcomes: ['investigation', 'exorcism', 'embrace', 'flight']
      }
    ];

    for (const encounter of encountersData) {
      this.encounters.set(encounter.id, encounter);
    }

    console.log(`⚔️ Loaded ${this.encounters.size} encounters`);
  }

  async loadTwists() {
    // Plot twists and complications
    const twistsData = [
      {
        id: 'betrayal',
        name: 'Betrayal',
        description: 'An ally turns against the party',
        impact: 'high',
        timing: 'mid_story'
      },
      {
        id: 'hidden_identity',
        name: 'Hidden Identity',
        description: 'A character is not who they seem',
        impact: 'high',
        timing: 'any'
      },
      {
        id: 'false_goal',
        name: 'False Goal',
        description: 'The objective was a deception',
        impact: 'medium',
        timing: 'climax'
      },
      {
        id: 'unexpected_ally',
        name: 'Unexpected Ally',
        description: 'An enemy becomes an ally',
        impact: 'medium',
        timing: 'mid_story'
      },
      {
        id: 'personal_connection',
        name: 'Personal Connection',
        description: 'The plot connects to a character\'s backstory',
        impact: 'high',
        timing: 'any'
      },
      {
        id: 'greater_threat',
        name: 'Greater Threat',
        description: 'The real danger is much worse than expected',
        impact: 'high',
        timing: 'mid_story'
      },
      {
        id: 'moral_ambiguity',
        name: 'Moral Ambiguity',
        description: 'The villains have understandable motives',
        impact: 'medium',
        timing: 'any'
      },
      {
        id: 'time_pressure',
        name: 'Time Pressure',
        description: 'A deadline makes the situation urgent',
        impact: 'medium',
        timing: 'mid_story'
      },
      {
        id: 'illusion_reality',
        name: 'Illusion vs Reality',
        description: 'Much of what seemed real was illusion',
        impact: 'high',
        timing: 'climax'
      },
      {
        id: 'sacrifice_required',
        name: 'Required Sacrifice',
        description: 'Success demands a great personal cost',
        impact: 'high',
        timing: 'climax'
      }
    ];

    for (const twist of twistsData) {
      this.twists.set(twist.id, twist);
    }

    console.log(`🔄 Loaded ${this.twists.size} plot twists`);
  }

  async loadResolutions() {
    // Story resolution patterns
    const resolutionsData = [
      {
        id: 'victory',
        name: 'Heroic Victory',
        description: 'The heroes triumph through skill and courage',
        themes: ['triumph', 'justice', 'heroism']
      },
      {
        id: 'bittersweet',
        name: 'Bittersweet Resolution',
        description: 'Success comes at a great personal cost',
        themes: ['sacrifice', 'loss', 'growth']
      },
      {
        id: 'tragic',
        name: 'Tragic Ending',
        description: 'The heroes fail despite their best efforts',
        themes: ['failure', 'tragedy', 'consequences']
      },
      {
        id: 'compromise',
        name: 'Compromise',
        description: 'A middle ground is reached between extremes',
        themes: ['balance', 'understanding', 'peace']
      },
      {
        id: 'transformation',
        name: 'Transformation',
        description: 'The characters are forever changed by their experiences',
        themes: ['change', 'growth', 'evolution']
      },
      {
        id: 'cycle_continues',
        name: 'Cycle Continues',
        description: 'The threat is defeated but similar problems remain',
        themes: ['ongoing_struggle', 'hope', 'resilience']
      },
      {
        id: 'new_beginning',
        name: 'New Beginning',
        description: 'The adventure opens doors to new possibilities',
        themes: ['renewal', 'opportunity', 'future']
      },
      {
        id: 'moral_victory',
        name: 'Moral Victory',
        description: 'The heroes lose the battle but win ethically',
        themes: ['integrity', 'principles', 'character']
      }
    ];

    for (const resolution of resolutionsData) {
      this.resolutions.set(resolution.id, resolution);
    }

    console.log(`🏁 Loaded ${this.resolutions.size} resolutions`);
  }

  // Public API methods
  async generatePlotHook(characterLevel = 1, setting = null, theme = null) {
    const hooks = Array.from(this.plotHooks.values());

    // Filter by difficulty based on character level
    let filteredHooks = hooks;
    if (characterLevel <= 3) {
      filteredHooks = hooks.filter(h => h.difficulty === 'low');
    } else if (characterLevel <= 7) {
      filteredHooks = hooks.filter(h => ['low', 'medium'].includes(h.difficulty));
    } else {
      filteredHooks = hooks.filter(h => ['medium', 'high'].includes(h.difficulty));
    }

    // Filter by setting if specified
    if (setting) {
      filteredHooks = filteredHooks.filter(h => h.commonSettings.includes(setting));
    }

    if (filteredHooks.length === 0) {
      filteredHooks = hooks; // Fallback
    }

    const selectedHook = filteredHooks[Math.floor(Math.random() * filteredHooks.length)];

    // Generate additional details
    const hookDetails = {
      ...selectedHook,
      complications: await this.generateComplications(2),
      rewards: await this.generateRewards(characterLevel),
      npcs: await this.generateNPCs(1)
    };

    return hookDetails;
  }

  async generatePlotArc(characterBackstory = null) {
    const arcs = Array.from(this.plotArcs.values());

    // Select arc based on character backstory if provided
    let selectedArc;
    if (characterBackstory) {
      // Match arc themes to character motivations/flaws
      const motivations = characterBackstory.motivations || [];
      const flaws = characterBackstory.flaws || [];

      // Simple theme matching
      const motivationThemes = motivations.flatMap(m => m.name.toLowerCase().split(' '));
      const flawThemes = flaws.flatMap(f => f.name.toLowerCase().split(' '));

      const matchingArcs = arcs.filter(arc => {
        return arc.themes.some(theme =>
          motivationThemes.includes(theme) || flawThemes.includes(theme)
        );
      });

      selectedArc = matchingArcs.length > 0
        ? matchingArcs[Math.floor(Math.random() * matchingArcs.length)]
        : arcs[Math.floor(Math.random() * arcs.length)];
    } else {
      selectedArc = arcs[Math.floor(Math.random() * arcs.length)];
    }

    return {
      ...selectedArc,
      currentStage: 0,
      progress: []
    };
  }

  async generateEncounter(difficulty = 'medium', type = null) {
    const encounters = Array.from(this.encounters.values());

    let filteredEncounters = encounters;
    if (difficulty) {
      filteredEncounters = encounters.filter(e => e.difficulty === difficulty);
    }
    if (type) {
      filteredEncounters = filteredEncounters.filter(e => e.type === type);
    }

    if (filteredEncounters.length === 0) {
      filteredEncounters = encounters;
    }

    const selectedEncounter = filteredEncounters[Math.floor(Math.random() * filteredEncounters.length)];

    return {
      ...selectedEncounter,
      outcome: selectedEncounter.outcomes[Math.floor(Math.random() * selectedEncounter.outcomes.length)]
    };
  }

  async generatePlotTwist(timing = 'any') {
    const twists = Array.from(this.twists.values());

    let filteredTwists = twists;
    if (timing !== 'any') {
      filteredTwists = twists.filter(t => t.timing === timing || t.timing === 'any');
    }

    const selectedTwist = filteredTwists[Math.floor(Math.random() * filteredTwists.length)];

    return {
      ...selectedTwist,
      revealMoment: await this.generateRevealMoment()
    };
  }

  async generateResolution(arcType = null) {
    const resolutions = Array.from(this.resolutions.values());

    let selectedResolution;
    if (arcType) {
      // Match resolution to arc type
      const arc = this.plotArcs.get(arcType);
      if (arc) {
        const matchingResolutions = resolutions.filter(r =>
          r.themes.some(theme => arc.themes.includes(theme))
        );
        selectedResolution = matchingResolutions.length > 0
          ? matchingResolutions[Math.floor(Math.random() * matchingResolutions.length)]
          : resolutions[Math.floor(Math.random() * resolutions.length)];
      } else {
        selectedResolution = resolutions[Math.floor(Math.random() * resolutions.length)];
      }
    } else {
      selectedResolution = resolutions[Math.floor(Math.random() * resolutions.length)];
    }

    return selectedResolution;
  }

  async generateComplications(count) {
    const complications = [
      'Time-sensitive deadline',
      'Limited resources available',
      'Hostile local authorities',
      'Rival groups competing for the same goal',
      'Unreliable information sources',
      'Personal stakes for party members',
      'Moral dilemmas to resolve',
      'Environmental hazards',
      'Magical interference',
      'Political complications'
    ];

    const selected = [];
    const shuffled = [...complications].sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(count, complications.length); i++) {
      selected.push(shuffled[i]);
    }

    return selected;
  }

  async generateRewards(characterLevel) {
    const baseGP = characterLevel * 100;
    const rewards = {
      gold: Math.floor(baseGP * (0.5 + Math.random())),
      experience: characterLevel * 300,
      magicItems: Math.random() < 0.3 ? 1 : 0,
      allies: Math.random() < 0.2 ? 1 : 0,
      information: Math.random() < 0.8 ? 1 : 0
    };

    return rewards;
  }

  async generateNPCs(count) {
    const npcTypes = [
      'mysterious informant',
      'local guide',
      'skeptical official',
      'fellow adventurer',
      'mystical sage',
      'shady merchant',
      'loyal retainer',
      'child with information',
      'rival explorer',
      'supernatural being'
    ];

    const selected = [];
    const shuffled = [...npcTypes].sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(count, npcTypes.length); i++) {
      selected.push(shuffled[i]);
    }

    return selected;
  }

  async generateRevealMoment() {
    const moments = [
      'During a quiet conversation',
      'In the heat of battle',
      'Through a magical vision',
      'When examining evidence',
      'During a moment of crisis',
      'Through an overheard conversation',
      'In a dream or nightmare',
      'When consulting ancient texts',
      'During a ritual or ceremony',
      'At the climax of the adventure'
    ];

    return moments[Math.floor(Math.random() * moments.length)];
  }

  async createCampaignOutline(characterCount = 4, campaignLength = 10) {
    const outline = {
      title: await this.generateCampaignTitle(),
      plotArc: await this.generatePlotArc(),
      plotHooks: [],
      encounters: [],
      twists: [],
      resolution: null,
      chapters: []
    };

    // Generate plot hooks
    for (let i = 0; i < campaignLength; i++) {
      const level = Math.floor(i / 2) + 1;
      outline.plotHooks.push(await this.generatePlotHook(level));
    }

    // Generate encounters
    const encounterCount = Math.floor(campaignLength * 1.5);
    for (let i = 0; i < encounterCount; i++) {
      outline.encounters.push(await this.generateEncounter());
    }

    // Generate twists (1-2 per campaign)
    const twistCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < twistCount; i++) {
      outline.twists.push(await this.generatePlotTwist());
    }

    // Generate resolution
    outline.resolution = await this.generateResolution(outline.plotArc.id);

    // Create chapter structure
    for (let i = 0; i < campaignLength; i++) {
      outline.chapters.push({
        number: i + 1,
        plotHook: outline.plotHooks[i],
        encounters: outline.encounters.slice(i * 1.5, (i + 1) * 1.5),
        twist: i === Math.floor(campaignLength / 2) ? outline.twists[0] : null
      });
    }

    return outline;
  }

  async generateCampaignTitle() {
    const adjectives = ['Ancient', 'Lost', 'Forgotten', 'Dark', 'Hidden', 'Eternal', 'Cursed', 'Sacred', 'Forbidden', 'Legendary'];
    const nouns = ['Secrets', 'Empire', 'Prophecy', 'Crown', 'Sword', 'Tomb', 'Temple', 'Kingdom', 'Legacy', 'Doom'];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `The ${adjective} ${noun}`;
  }

  // Get all options for UI
  async getAllPlotHooks() {
    return Array.from(this.plotHooks.values());
  }

  async getAllPlotArcs() {
    return Array.from(this.plotArcs.values());
  }

  async getAllEncounters() {
    return Array.from(this.encounters.values());
  }

  async getAllTwists() {
    return Array.from(this.twists.values());
  }

  async getAllResolutions() {
    return Array.from(this.resolutions.values());
  }

  async exportPlotData() {
    const exportData = {
      plotHooks: Object.fromEntries(this.plotHooks),
      plotArcs: Object.fromEntries(this.plotArcs),
      encounters: Object.fromEntries(this.encounters),
      twists: Object.fromEntries(this.twists),
      resolutions: Object.fromEntries(this.resolutions),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return exportData;
  }
}

// Error Classes
class PlotGeneratorError extends Error {
  constructor(message) { super(message); this.name = 'PlotGeneratorError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PlotGenerator;
} else if (typeof window !== 'undefined') {
  window.PlotGenerator = PlotGenerator;
}
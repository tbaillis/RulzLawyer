// code-repository/src/story/narrative-ai.js
class NarrativeAI {
  constructor() {
    this.storyPatterns = new Map();
    this.characterArcs = new Map();
    this.themes = new Map();
    this.tropes = new Map();
    this.narrativeTechniques = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('🧠 Initializing Narrative AI...');
    const startTime = performance.now();

    try {
      await this.loadStoryPatterns();
      await this.loadCharacterArcs();
      await this.loadThemes();
      await this.loadTropes();
      await this.loadNarrativeTechniques();

      const initTime = performance.now() - startTime;
      console.log(`✅ Narrative AI initialized in ${initTime.toFixed(2)}ms`);

      this.initialized = true;
    } catch (error) {
      console.error('❌ Narrative AI initialization failed:', error);
      throw new NarrativeAIError(error.message);
    }
  }

  async loadStoryPatterns() {
    // Classic story structures and patterns
    const storyPatternsData = [
      {
        id: 'three_act_structure',
        name: 'Three-Act Structure',
        description: 'Setup, confrontation, resolution',
        acts: ['setup', 'confrontation', 'resolution'],
        keyElements: ['inciting_incident', 'plot_point_one', 'midpoint', 'plot_point_two', 'climax', 'denouement']
      },
      {
        id: 'hero_journey',
        name: 'Hero\'s Journey',
        description: 'Monomyth pattern of transformation',
        acts: ['ordinary_world', 'call_to_adventure', 'transformation', 'return'],
        keyElements: ['mentor', 'allies', 'enemies', 'tests', 'abyss', 'transformation', 'atonement']
      },
      {
        id: 'tragedy',
        name: 'Tragedy',
        description: 'Fall from grace due to fatal flaw',
        acts: ['rise', 'fall', 'catastrophe'],
        keyElements: ['hubris', 'nemesis', 'peripeteia', 'anagnorisis', 'catastrophe']
      },
      {
        id: 'comedy',
        name: 'Comedy',
        description: 'Humorous resolution of conflicts',
        acts: ['confusion', 'complication', 'clarification'],
        keyElements: ['mistaken_identity', 'misunderstanding', 'reconciliation', 'celebration']
      },
      {
        id: 'quest',
        name: 'Quest',
        description: 'Journey to achieve a goal',
        acts: ['preparation', 'journey', 'achievement'],
        keyElements: ['call', 'companions', 'challenges', 'triumph', 'return']
      },
      {
        id: 'revenge',
        name: 'Revenge Story',
        description: 'Pursuit of vengeance and justice',
        acts: ['wrong', 'quest', 'confrontation'],
        keyElements: ['injustice', 'obsession', 'pursuit', 'climax', 'resolution']
      },
      {
        id: 'redemption',
        name: 'Redemption Arc',
        description: 'Path to atonement and forgiveness',
        acts: ['sin', 'realization', 'atonement'],
        keyElements: ['past_mistakes', 'guilt', 'change', 'sacrifice', 'forgiveness']
      },
      {
        id: 'coming_of_age',
        name: 'Coming of Age',
        description: 'Transition from youth to adulthood',
        acts: ['innocence', 'awakening', 'maturity'],
        keyElements: ['naivety', 'challenge', 'growth', 'responsibility', 'wisdom']
      }
    ];

    for (const pattern of storyPatternsData) {
      this.storyPatterns.set(pattern.id, pattern);
    }

    console.log(`📖 Loaded ${this.storyPatterns.size} story patterns`);
  }

  async loadCharacterArcs() {
    // Character development trajectories
    const characterArcsData = [
      {
        id: 'positive_arc',
        name: 'Positive Arc',
        description: 'Character grows and improves',
        stages: ['flawed', 'challenged', 'transformed', 'victorious'],
        traits: ['growth', 'learning', 'overcoming_weakness']
      },
      {
        id: 'negative_arc',
        name: 'Negative Arc',
        description: 'Character deteriorates morally',
        stages: ['moral', 'tempted', 'corrupted', 'doomed'],
        traits: ['corruption', 'downfall', 'tragedy']
      },
      {
        id: 'flat_arc',
        name: 'Flat Arc',
        description: 'Character teaches others to change',
        stages: ['wise', 'teaching', 'inspiring', 'catalytic'],
        traits: ['wisdom', 'teaching', 'inspiration']
      },
      {
        id: 'corruption_arc',
        name: 'Corruption Arc',
        description: 'Gradual moral decline',
        stages: ['pure', 'compromised', 'tainted', 'evil'],
        traits: ['temptation', 'rationalization', 'embrace_of_darkness']
      },
      {
        id: 'redemption_arc',
        name: 'Redemption Arc',
        description: 'Return from darkness to light',
        stages: ['fallen', 'remorseful', 'atoning', 'redeemed'],
        traits: ['regret', 'change', 'atonement']
      },
      {
        id: 'tragic_hero',
        name: 'Tragic Hero',
        description: 'Noble character brought low by flaw',
        stages: ['noble', 'flawed_decision', 'downfall', 'recognition'],
        traits: ['nobility', 'hubris', 'catharsis']
      },
      {
        id: 'anti_hero',
        name: 'Anti-Hero',
        description: 'Unconventional hero with questionable methods',
        stages: ['outsider', 'effective', 'conflicted', 'redeemed'],
        traits: ['amorality', 'effectiveness', 'internal_conflict']
      },
      {
        id: 'mentor_figure',
        name: 'Mentor Figure',
        description: 'Wise guide who helps others grow',
        stages: ['experienced', 'teaching', 'sacrificing', 'legacy'],
        traits: ['wisdom', 'sacrifice', 'lasting_impact']
      }
    ];

    for (const arc of characterArcsData) {
      this.characterArcs.set(arc.id, arc);
    }

    console.log(`📈 Loaded ${this.characterArcs.size} character arcs`);
  }

  async loadThemes() {
    // Narrative themes and motifs
    const themesData = [
      {
        id: 'power_corruption',
        name: 'Power and Corruption',
        description: 'How power changes people',
        motifs: ['temptation', 'ambition', 'downfall'],
        examples: ['ruler_becoming_tyrant', 'hero_corrupted', 'power_struggle']
      },
      {
        id: 'love_sacrifice',
        name: 'Love and Sacrifice',
        description: 'Giving up for those you love',
        motifs: ['romantic_love', 'familial_love', 'self_sacrifice'],
        examples: ['parent_child_bond', 'forbidden_love', 'heroic_sacrifice']
      },
      {
        id: 'identity_discovery',
        name: 'Identity and Self-Discovery',
        description: 'Finding who you really are',
        motifs: ['lost_heritage', 'hidden_potential', 'personal_growth'],
        examples: ['royal_blood_discovery', 'latent_talents', 'philosophical_journey']
      },
      {
        id: 'justice_vengeance',
        name: 'Justice vs Vengeance',
        description: 'Righting wrongs and moral choices',
        motifs: ['revenge_cycle', 'moral_dilemmas', 'redemption'],
        examples: ['avenging_family', 'corrupt_system', 'forgiveness_choice']
      },
      {
        id: 'good_evil_blur',
        name: 'Blurring Good and Evil',
        description: 'Moral ambiguity and gray areas',
        motifs: ['anti_hero', 'necessary_evil', 'sympathetic_villain'],
        examples: ['villain_with_reasons', 'heroic_crimes', 'complex_motivations']
      },
      {
        id: 'fate_free_will',
        name: 'Fate vs Free Will',
        description: 'Destiny versus personal choice',
        motifs: ['prophecies', 'chosen_ones', 'breaking_fate'],
        examples: ['prophecy_fulfillment', 'destiny_rejection', 'fateful_decisions']
      },
      {
        id: 'loss_grief',
        name: 'Loss and Grief',
        description: 'Dealing with death and change',
        motifs: ['mourning', 'acceptance', 'moving_forward'],
        examples: ['lost_loved_ones', 'changing_world', 'personal_loss']
      },
      {
        id: 'friendship_loyalty',
        name: 'Friendship and Loyalty',
        description: 'Bonds between companions',
        motifs: ['brotherhood', 'betrayal', 'reconciliation'],
        examples: ['loyal_companions', 'friendship_tests', 'forged_bonds']
      },
      {
        id: 'knowledge_danger',
        name: 'Knowledge and Its Dangers',
        description: 'Forbidden knowledge and consequences',
        motifs: ['ancient_secrets', 'madness', 'enlightenment'],
        examples: ['cursed_tomes', 'dangerous_discoveries', 'wisdom_price']
      },
      {
        id: 'change_tradition',
        name: 'Change vs Tradition',
        description: 'Progress versus established ways',
        motifs: ['cultural_clash', 'innovation', 'preservation'],
        examples: ['new_vs_old_ways', 'revolutionary_ideas', 'cultural_conflict']
      }
    ];

    for (const theme of themesData) {
      this.themes.set(theme.id, theme);
    }

    console.log(`🎭 Loaded ${this.themes.size} narrative themes`);
  }

  async loadTropes() {
    // Common story tropes and conventions
    const tropesData = [
      {
        id: 'chosen_one',
        name: 'The Chosen One',
        description: 'Prophesied hero destined for greatness',
        usage: 'classic_fantasy_setup',
        variations: ['reluctant_hero', 'false_chosen_one', 'multiple_chosen']
      },
      {
        id: 'mentor_death',
        name: 'Mentor\'s Death',
        description: 'Wise teacher dies to motivate hero',
        usage: 'character_motivation',
        variations: ['sacrifice', 'betrayal', 'natural_causes']
      },
      {
        id: 'evil_overlord',
        name: 'Evil Overlord',
        description: 'Cartoonishly evil villain with grandiose plans',
        usage: 'clear_antagonist',
        variations: ['competent_evil', 'sympathetic_evil', 'parody']
      },
      {
        id: 'quest_companions',
        name: 'Colorful Companions',
        description: 'Diverse party with complementary skills',
        usage: 'party_dynamics',
        variations: ['fighter_mage_thief', 'racial_diversity', 'personality_clash']
      },
      {
        id: 'magical_artifact',
        name: 'Powerful Artifact',
        description: 'Ancient item with great power and curse',
        usage: 'plot_device',
        variations: ['sword_of_power', 'cursed_jewelry', 'lost_relic']
      },
      {
        id: 'hidden_royalty',
        name: 'Secret Royal Heritage',
        description: 'Commoner discovers noble blood',
        usage: 'character_reveal',
        variations: ['lost_prince', 'magical_heritage', 'adopted_royal']
      },
      {
        id: 'betrayed_ally',
        name: 'Betrayed by Ally',
        description: 'Trusted companion turns traitor',
        usage: 'plot_twist',
        variations: ['mind_control', 'greed_motivated', 'secret_agenda']
      },
      {
        id: 'final_boss',
        name: 'Final Confrontation',
        description: 'Epic battle with main antagonist',
        usage: 'climax_structure',
        variations: ['one_on_one', 'team_battle', 'cosmic_scale']
      },
      {
        id: 'training_montage',
        name: 'Intensive Training',
        description: 'Hero undergoes rigorous preparation',
        usage: 'character_growth',
        variations: ['mentor_training', 'self_training', 'magical_enhancement']
      },
      {
        id: 'love_triangle',
        name: 'Romantic Triangle',
        description: 'Three-way romantic tension',
        usage: 'relationship_drama',
        variations: ['rival_suitors', 'forbidden_love', 'jealousy_driven']
      }
    ];

    for (const trope of tropesData) {
      this.tropes.set(trope.id, trope);
    }

    console.log(`🎪 Loaded ${this.tropes.size} story tropes`);
  }

  async loadNarrativeTechniques() {
    // Literary and storytelling techniques
    const techniquesData = [
      {
        id: 'foreshadowing',
        name: 'Foreshadowing',
        description: 'Hinting at future events',
        purpose: 'build_tension',
        examples: ['ominous_prophecy', 'subtle_clues', 'recurring_symbols']
      },
      {
        id: 'irony',
        name: 'Dramatic Irony',
        description: 'Audience knows what characters don\'t',
        purpose: 'create_tension',
        examples: ['doomed_hero', 'hidden_identity', 'impending_danger']
      },
      {
        id: 'flashback',
        name: 'Flashback',
        description: 'Interrupting present with past events',
        purpose: 'character_development',
        examples: ['tragic_backstory', 'important_memory', 'context_reveal']
      },
      {
        id: 'cliffhanger',
        name: 'Cliffhanger',
        description: 'Ending on moment of high tension',
        purpose: 'maintain_interest',
        examples: ['life_threatening_situation', 'major_reveal', 'unresolved_conflict']
      },
      {
        id: 'parallel_storytelling',
        name: 'Parallel Narratives',
        description: 'Multiple storylines running simultaneously',
        purpose: 'complex_world_building',
        examples: ['different_perspectives', 'connected_events', 'thematic_contrast']
      },
      {
        id: 'unreliable_narrator',
        name: 'Unreliable Narrator',
        description: 'Narrator whose credibility is questionable',
        purpose: 'create_uncertainty',
        examples: ['lying_character', 'biased_viewpoint', 'unstable_mind']
      },
      {
        id: 'symbolism',
        name: 'Symbolism',
        description: 'Using objects/events to represent ideas',
        purpose: 'thematic_depth',
        examples: ['magical_artifacts', 'recurring_motifs', 'metaphorical_elements']
      },
      {
        id: 'pacing_variation',
        name: 'Pacing Variation',
        description: 'Alternating fast and slow narrative speed',
        purpose: 'maintain_engagement',
        examples: ['action_sequences', 'quiet_reflection', 'information_dumps']
      }
    ];

    for (const technique of techniquesData) {
      this.narrativeTechniques.set(technique.id, technique);
    }

    console.log(`🎨 Loaded ${this.narrativeTechniques.size} narrative techniques`);
  }

  // Public API methods
  async generateStoryOutline(characterData, campaignLength = 10) {
    const outline = {
      title: await this.generateTitle(characterData),
      pattern: await this.selectStoryPattern(characterData),
      characterArcs: await this.assignCharacterArcs(characterData),
      themes: await this.selectThemes(characterData),
      acts: [],
      keyEvents: [],
      resolution: null
    };

    // Generate acts based on pattern
    const pattern = this.storyPatterns.get(outline.pattern);
    for (let i = 0; i < pattern.acts.length; i++) {
      const act = {
        number: i + 1,
        name: pattern.acts[i],
        chapters: Math.ceil(campaignLength / pattern.acts.length),
        keyElements: await this.generateActElements(pattern.keyElements, i),
        conflicts: await this.generateActConflicts(i, pattern.acts.length)
      };
      outline.acts.push(act);
    }

    // Generate key events
    outline.keyEvents = await this.generateKeyEvents(outline, campaignLength);

    // Generate resolution
    outline.resolution = await this.generateResolution(outline.themes, outline.characterArcs);

    return outline;
  }

  async generateTitle(characterData) {
    const titlePatterns = [
      'The {adjective} {noun} of {character}',
      '{character} and the {noun}',
      'Quest for the {adjective} {noun}',
      'The {character} {verb}',
      'Rise of the {adjective} {character}'
    ];

    const adjectives = ['Ancient', 'Lost', 'Dark', 'Hidden', 'Eternal', 'Cursed', 'Sacred', 'Legendary', 'Forgotten', 'Mighty'];
    const nouns = ['Crown', 'Sword', 'Empire', 'Prophecy', 'Kingdom', 'Legacy', 'Doom', 'Destiny', 'Power', 'Truth'];
    const verbs = ['Chronicles', 'Saga', 'Tale', 'Legend', 'Epic'];

    const pattern = titlePatterns[Math.floor(Math.random() * titlePatterns.length)];
    const character = characterData.name || 'Hero';
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];

    return pattern
      .replace('{character}', character)
      .replace('{adjective}', adjective)
      .replace('{noun}', noun)
      .replace('{verb}', verb);
  }

  async selectStoryPattern(characterData) {
    // Select pattern based on character motivations and background
    const motivations = characterData.motivations || [];
    const background = characterData.background || {};

    // Simple pattern matching
    if (motivations.some(m => m.name.toLowerCase().includes('redemption'))) {
      return 'redemption';
    }
    if (motivations.some(m => m.name.toLowerCase().includes('revenge'))) {
      return 'revenge';
    }
    if (background.name === 'adventurer' || background.name === 'criminal') {
      return 'quest';
    }

    // Default to hero's journey
    return 'hero_journey';
  }

  async assignCharacterArcs(characterData) {
    const arcs = Array.from(this.characterArcs.keys());
    const assignedArcs = {};

    // Assign arcs based on character traits
    for (const character of characterData) {
      const flaws = character.flaws || [];
      const ideals = character.ideals || [];

      if (flaws.some(f => f.name.toLowerCase().includes('greed') || f.name.toLowerCase().includes('arrogance'))) {
        assignedArcs[character.id] = 'corruption_arc';
      } else if (flaws.some(f => f.name.toLowerCase().includes('cowardly') || f.name.toLowerCase().includes('reckless'))) {
        assignedArcs[character.id] = 'redemption_arc';
      } else {
        assignedArcs[character.id] = arcs[Math.floor(Math.random() * arcs.length)];
      }
    }

    return assignedArcs;
  }

  async selectThemes(characterData) {
    const themes = Array.from(this.themes.keys());
    const selectedThemes = [];

    // Select 2-3 themes based on character motivations
    const motivations = characterData.flatMap(c => c.motivations || []);
    const motivationNames = motivations.map(m => m.name.toLowerCase());

    if (motivationNames.some(m => m.includes('power'))) {
      selectedThemes.push('power_corruption');
    }
    if (motivationNames.some(m => m.includes('justice') || m.includes('revenge'))) {
      selectedThemes.push('justice_vengeance');
    }
    if (motivationNames.some(m => m.includes('knowledge'))) {
      selectedThemes.push('knowledge_danger');
    }

    // Fill remaining slots randomly
    while (selectedThemes.length < 3) {
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      if (!selectedThemes.includes(randomTheme)) {
        selectedThemes.push(randomTheme);
      }
    }

    return selectedThemes.slice(0, 3);
  }

  async generateActElements(keyElements, actIndex) {
    const elements = keyElements.slice(actIndex * 2, (actIndex + 1) * 2);
    return elements.map(element => ({
      type: element,
      description: this.generateElementDescription(element)
    }));
  }

  async generateElementDescription(elementType) {
    const descriptions = {
      inciting_incident: 'An event that disrupts the normal world',
      plot_point_one: 'Major turning point that ends the setup',
      midpoint: 'Central reversal that changes everything',
      plot_point_two: 'Final turning point leading to climax',
      climax: 'Moment of greatest confrontation',
      denouement: 'Final resolution and aftermath'
    };

    return descriptions[elementType] || 'A significant story moment';
  }

  async generateActConflicts(actIndex, totalActs) {
    const conflictTypes = ['personal', 'social', 'supernatural', 'environmental'];
    const conflicts = [];

    // Generate 1-3 conflicts per act
    const conflictCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < conflictCount; i++) {
      conflicts.push({
        type: conflictTypes[Math.floor(Math.random() * conflictTypes.length)],
        severity: actIndex === totalActs - 1 ? 'high' : 'medium',
        description: await this.generateConflictDescription()
      });
    }

    return conflicts;
  }

  async generateConflictDescription() {
    const descriptions = [
      'A direct confrontation with antagonistic forces',
      'Internal struggle with personal doubts and fears',
      'Social conflict with allies or authority figures',
      'Environmental challenges testing survival skills',
      'Moral dilemma requiring difficult choices',
      'Supernatural threat beyond mortal comprehension'
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  async generateKeyEvents(outline, campaignLength) {
    const events = [];
    const tropes = Array.from(this.tropes.keys());

    for (let i = 0; i < campaignLength; i++) {
      const event = {
        chapter: i + 1,
        trope: tropes[Math.floor(Math.random() * tropes.length)],
        description: await this.generateEventDescription(),
        impact: await this.generateEventImpact(i, campaignLength)
      };
      events.push(event);
    }

    return events;
  }

  async generateEventDescription() {
    const descriptions = [
      'A mysterious stranger offers cryptic advice',
      'An ancient artifact reveals hidden knowledge',
      'Betrayal by a trusted ally shakes the group',
      'Discovery of a long-lost secret changes everything',
      'Epic battle tests the limits of courage and skill',
      'Moment of personal growth transforms a character',
      'Alliance with unexpected forces shifts the balance',
      'Sacrificial act demonstrates true heroism'
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  async generateEventImpact(chapterIndex, totalChapters) {
    if (chapterIndex < totalChapters * 0.3) return 'setup';
    if (chapterIndex < totalChapters * 0.7) return 'development';
    return 'climax';
  }

  async generateResolution(themes, characterArcs) {
    // Generate resolution based on themes and character arcs
    const resolutions = ['triumphant', 'bittersweet', 'tragic', 'transformative', 'ambiguous'];

    // Check for tragic elements
    const hasTragicArc = Object.values(characterArcs).some(arc => arc.includes('tragic') || arc.includes('corruption'));
    if (hasTragicArc) {
      return 'tragic';
    }

    // Check for redemption themes
    if (themes.includes('justice_vengeance') || themes.includes('loss_grief')) {
      return Math.random() < 0.7 ? 'bittersweet' : 'triumphant';
    }

    return resolutions[Math.floor(Math.random() * resolutions.length)];
  }

  async generateCharacterDevelopment(characterId, currentChapter, totalChapters) {
    const development = {
      characterId,
      chapter: currentChapter,
      growth: await this.calculateCharacterGrowth(currentChapter, totalChapters),
      challenges: await this.generateCharacterChallenges(),
      insights: await this.generateCharacterInsights(),
      relationships: await this.generateRelationshipChanges()
    };

    return development;
  }

  async calculateCharacterGrowth(currentChapter, totalChapters) {
    const progress = currentChapter / totalChapters;
    const growthStages = ['novice', 'experienced', 'master', 'legendary'];

    const stageIndex = Math.floor(progress * growthStages.length);
    return growthStages[Math.min(stageIndex, growthStages.length - 1)];
  }

  async generateCharacterChallenges() {
    const challenges = [
      'Overcoming a personal fear',
      'Making a difficult moral choice',
      'Learning to trust others',
      'Confronting a past trauma',
      'Developing new skills or abilities',
      'Breaking harmful habits or patterns'
    ];

    return challenges.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  async generateCharacterInsights() {
    const insights = [
      'True strength comes from within',
      'Trust must be earned, not given freely',
      'The past shapes us but does not define us',
      'Power without wisdom leads to ruin',
      'True friendship transcends differences',
      'Sometimes the hardest person to forgive is yourself'
    ];

    return insights[Math.floor(Math.random() * insights.length)];
  }

  async generateRelationshipChanges() {
    const changes = [
      'Forming a new alliance',
      'Resolving an old conflict',
      'Deepening an existing friendship',
      'Straining a previously strong bond',
      'Developing romantic feelings',
      'Gaining a new mentor or student'
    ];

    return changes[Math.floor(Math.random() * changes.length)];
  }

  async adaptStoryToPlayerChoices(choices, currentOutline) {
    // Adapt story based on player decisions
    const adaptations = {
      outline: { ...currentOutline },
      changes: []
    };

    for (const choice of choices) {
      const adaptation = await this.generateAdaptation(choice);
      adaptations.changes.push(adaptation);

      // Apply adaptation to outline
      if (adaptation.type === 'theme_shift') {
        adaptations.outline.themes = adaptations.outline.themes.map(theme =>
          theme === adaptation.oldTheme ? adaptation.newTheme : theme
        );
      } else if (adaptation.type === 'character_arc_change') {
        adaptations.outline.characterArcs[adaptation.characterId] = adaptation.newArc;
      }
    }

    return adaptations;
  }

  async generateAdaptation(choice) {
    const adaptations = [
      {
        type: 'theme_shift',
        oldTheme: 'power_corruption',
        newTheme: 'justice_vengeance',
        reason: 'Player chose path of righteous vengeance'
      },
      {
        type: 'character_arc_change',
        characterId: choice.characterId,
        newArc: 'redemption_arc',
        reason: 'Character showed remorse for past actions'
      },
      {
        type: 'plot_complication',
        complication: 'additional_antagonist',
        reason: 'Player actions attracted unwanted attention'
      }
    ];

    return adaptations[Math.floor(Math.random() * adaptations.length)];
  }

  // Get all options for UI
  async getAllStoryPatterns() {
    return Array.from(this.storyPatterns.values());
  }

  async getAllCharacterArcs() {
    return Array.from(this.characterArcs.values());
  }

  async getAllThemes() {
    return Array.from(this.themes.values());
  }

  async getAllTropes() {
    return Array.from(this.tropes.values());
  }

  async getAllNarrativeTechniques() {
    return Array.from(this.narrativeTechniques.values());
  }

  async exportNarrativeData() {
    const exportData = {
      storyPatterns: Object.fromEntries(this.storyPatterns),
      characterArcs: Object.fromEntries(this.characterArcs),
      themes: Object.fromEntries(this.themes),
      tropes: Object.fromEntries(this.tropes),
      narrativeTechniques: Object.fromEntries(this.narrativeTechniques),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return exportData;
  }
}

// Error Classes
class NarrativeAIError extends Error {
  constructor(message) { super(message); this.name = 'NarrativeAIError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NarrativeAI;
} else if (typeof window !== 'undefined') {
  window.NarrativeAI = NarrativeAI;
}
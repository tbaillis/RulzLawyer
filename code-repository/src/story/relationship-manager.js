// code-repository/src/story/relationship-manager.js
class RelationshipManager {
  constructor() {
    this.relationships = new Map();
    this.relationshipTypes = new Map();
    this.socialDynamics = new Map();
    this.conflictTypes = new Map();
    this.alliances = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('🤝 Initializing Relationship Manager...');
    const startTime = performance.now();

    try {
      await this.loadRelationshipTypes();
      await this.loadSocialDynamics();
      await this.loadConflictTypes();
      await this.loadAlliances();

      const initTime = performance.now() - startTime;
      console.log(`✅ Relationship Manager initialized in ${initTime.toFixed(2)}ms`);

      this.initialized = true;
    } catch (error) {
      console.error('❌ Relationship Manager initialization failed:', error);
      throw new RelationshipManagerError(error.message);
    }
  }

  async loadRelationshipTypes() {
    // Different types of relationships between characters
    const relationshipTypesData = [
      {
        id: 'mentor_student',
        name: 'Mentor-Student',
        description: 'A wise teacher guiding a younger learner',
        positive: true,
        dynamics: ['teaching', 'growth', 'respect'],
        commonConflicts: ['disagreement', 'betrayal', 'separation']
      },
      {
        id: 'rival_competitor',
        name: 'Rival-Competitor',
        description: 'Competitors vying for the same goals',
        positive: false,
        dynamics: ['competition', 'jealousy', 'respect'],
        commonConflicts: ['sabotage', 'confrontation', 'alliance']
      },
      {
        id: 'loyal_companion',
        name: 'Loyal Companion',
        description: 'Trustworthy friend and ally',
        positive: true,
        dynamics: ['loyalty', 'support', 'trust'],
        commonConflicts: ['misunderstanding', 'sacrifice', 'loss']
      },
      {
        id: 'romantic_partner',
        name: 'Romantic Partner',
        description: 'Lovers with deep emotional connection',
        positive: true,
        dynamics: ['love', 'passion', 'commitment'],
        commonConflicts: ['jealousy', 'betrayal', 'separation']
      },
      {
        id: 'family_bond',
        name: 'Family Bond',
        description: 'Blood relatives with shared history',
        positive: true,
        dynamics: ['loyalty', 'obligation', 'heritage'],
        commonConflicts: ['inheritance', 'disagreement', 'estrangement']
      },
      {
        id: 'patron_client',
        name: 'Patron-Client',
        description: 'Benefactor providing support for service',
        positive: true,
        dynamics: ['obligation', 'service', 'protection'],
        commonConflicts: ['debt', 'betrayal', 'independence']
      },
      {
        id: 'adversary_enemy',
        name: 'Adversary-Enemy',
        description: 'Hostile opponents with personal vendetta',
        positive: false,
        dynamics: ['hatred', 'revenge', 'conflict'],
        commonConflicts: ['escalation', 'alliance', 'truce']
      },
      {
        id: 'professional_colleague',
        name: 'Professional Colleague',
        description: 'Work associates with shared profession',
        positive: true,
        dynamics: ['cooperation', 'respect', 'competition'],
        commonConflicts: ['politics', 'resources', 'advancement']
      },
      {
        id: 'spiritual_guide',
        name: 'Spiritual Guide',
        description: 'Religious or philosophical mentor',
        positive: true,
        dynamics: ['faith', 'guidance', 'enlightenment'],
        commonConflicts: ['doubt', 'heresy', 'crisis_of_faith']
      },
      {
        id: 'child_parent',
        name: 'Child-Parent',
        description: 'Parental figure and offspring relationship',
        positive: true,
        dynamics: ['nurture', 'authority', 'growth'],
        commonConflicts: ['rebellion', 'disappointment', 'independence']
      },
      {
        id: 'savior_grateful',
        name: 'Savior-Grateful',
        description: 'Someone saved who owes a life debt',
        positive: true,
        dynamics: ['gratitude', 'loyalty', 'service'],
        commonConflicts: ['debt_repayment', 'independence', 'betrayal']
      },
      {
        id: 'former_lover',
        name: 'Former Lover',
        description: 'Past romantic partners with lingering feelings',
        positive: false,
        dynamics: ['nostalgia', 'regret', 'awkwardness'],
        commonConflicts: ['reconciliation', 'revenge', 'moving_on']
      }
    ];

    for (const type of relationshipTypesData) {
      this.relationshipTypes.set(type.id, type);
    }

    console.log(`💑 Loaded ${this.relationshipTypes.size} relationship types`);
  }

  async loadSocialDynamics() {
    // Social interaction patterns and dynamics
    const socialDynamicsData = [
      {
        id: 'trust_building',
        name: 'Trust Building',
        description: 'Gradually establishing confidence and reliability',
        stages: ['acquaintance', 'casual_friend', 'trusted_ally', 'confidant'],
        triggers: ['shared_experience', 'proven_loyalty', 'mutual_benefit']
      },
      {
        id: 'power_struggle',
        name: 'Power Struggle',
        description: 'Competition for dominance and control',
        stages: ['tension', 'confrontation', 'escalation', 'resolution'],
        triggers: ['authority_challenge', 'resource_competition', 'leadership_vacuum']
      },
      {
        id: 'romantic_tension',
        name: 'Romantic Tension',
        description: 'Building attraction and emotional connection',
        stages: ['attraction', 'flirting', 'courtship', 'commitment'],
        triggers: ['physical_attraction', 'shared_values', 'emotional_vulnerability']
      },
      {
        id: 'loyalty_test',
        name: 'Loyalty Test',
        description: 'Challenging the strength of commitment',
        stages: ['doubt', 'test', 'proof', 'reinforcement'],
        triggers: ['crisis_situation', 'temptation', 'conflicting_interests']
      },
      {
        id: 'betrayal_recovery',
        name: 'Betrayal Recovery',
        description: 'Healing from broken trust and rebuilding',
        stages: ['shock', 'confrontation', 'forgiveness', 'rebuilding'],
        triggers: ['discovered_deception', 'broken_promise', 'abandonment']
      },
      {
        id: 'alliance_formation',
        name: 'Alliance Formation',
        description: 'Creating cooperative partnerships',
        stages: ['negotiation', 'agreement', 'cooperation', 'strengthening'],
        triggers: ['common_goal', 'mutual_threat', 'shared_benefits']
      },
      {
        id: 'rivalry_escalation',
        name: 'Rivalry Escalation',
        description: 'Growing competitive tension',
        stages: ['competition', 'sabotage', 'confrontation', 'feud'],
        triggers: ['resource_scarcity', 'personal_ambition', 'past_grudge']
      },
      {
        id: 'mentor_guidance',
        name: 'Mentor Guidance',
        description: 'Teaching and personal development',
        stages: ['assessment', 'teaching', 'testing', 'graduation'],
        triggers: ['recognized_potential', 'willing_student', 'knowledge_gap']
      }
    ];

    for (const dynamic of socialDynamicsData) {
      this.socialDynamics.set(dynamic.id, dynamic);
    }

    console.log(`🔄 Loaded ${this.socialDynamics.size} social dynamics`);
  }

  async loadConflictTypes() {
    // Types of interpersonal conflicts
    const conflictTypesData = [
      {
        id: 'ideological_difference',
        name: 'Ideological Difference',
        description: 'Fundamental disagreement on beliefs or principles',
        resolution_methods: ['debate', 'compromise', 'conversion', 'tolerance'],
        escalation_risk: 'medium'
      },
      {
        id: 'resource_competition',
        name: 'Resource Competition',
        description: 'Fighting over limited resources or opportunities',
        resolution_methods: ['negotiation', 'sharing', 'competition', 'stealing'],
        escalation_risk: 'high'
      },
      {
        id: 'personal_betrayal',
        name: 'Personal Betrayal',
        description: 'Violation of trust or loyalty',
        resolution_methods: ['confrontation', 'forgiveness', 'revenge', 'separation'],
        escalation_risk: 'high'
      },
      {
        id: 'authority_challenge',
        name: 'Authority Challenge',
        description: 'Questioning or resisting leadership',
        resolution_methods: ['negotiation', 'force', 'compromise', 'replacement'],
        escalation_risk: 'medium'
      },
      {
        id: 'romantic_rivalry',
        name: 'Romantic Rivalry',
        description: 'Competition for romantic affection',
        resolution_methods: ['confrontation', 'courtship', 'sabotage', 'acceptance'],
        escalation_risk: 'medium'
      },
      {
        id: 'family_dishonor',
        name: 'Family Dishonor',
        description: 'Bringing shame to family or heritage',
        resolution_methods: ['atonement', 'exile', 'redemption', 'forgiveness'],
        escalation_risk: 'high'
      },
      {
        id: 'professional_jealousy',
        name: 'Professional Jealousy',
        description: 'Envy of another\'s success or position',
        resolution_methods: ['self_improvement', 'sabotage', 'alliance', 'acceptance'],
        escalation_risk: 'low'
      },
      {
        id: 'cultural_clash',
        name: 'Cultural Clash',
        description: 'Conflict between different cultural backgrounds',
        resolution_methods: ['education', 'tolerance', 'integration', 'separation'],
        escalation_risk: 'medium'
      },
      {
        id: 'moral_dilemma',
        name: 'Moral Dilemma',
        description: 'Ethical choices that strain relationships',
        resolution_methods: ['discussion', 'compromise', 'sacrifice', 'division'],
        escalation_risk: 'medium'
      },
      {
        id: 'debt_obligation',
        name: 'Debt Obligation',
        description: 'Unpaid debts creating tension',
        resolution_methods: ['payment', 'forgiveness', 'service', 'default'],
        escalation_risk: 'medium'
      }
    ];

    for (const conflict of conflictTypesData) {
      this.conflictTypes.set(conflict.id, conflict);
    }

    console.log(`⚔️ Loaded ${this.conflictTypes.size} conflict types`);
  }

  async loadAlliances() {
    // Types of alliances and cooperative arrangements
    const alliancesData = [
      {
        id: 'military_alliance',
        name: 'Military Alliance',
        description: 'Cooperative defense and warfare agreement',
        benefits: ['shared_defense', 'combined_forces', 'strategic_advantage'],
        risks: ['betrayal', 'unequal_commitment', 'leadership_conflicts']
      },
      {
        id: 'trade_agreement',
        name: 'Trade Agreement',
        description: 'Economic cooperation and commerce partnership',
        benefits: ['economic_growth', 'resource_access', 'market_expansion'],
        risks: ['cheating', 'market_disruption', 'dependency']
      },
      {
        id: 'political_marriage',
        name: 'Political Marriage',
        description: 'Alliance sealed through marriage',
        benefits: ['family_ties', 'political_stability', 'heir_production'],
        risks: ['personal_incompatibility', 'scandal', 'inheritance_conflicts']
      },
      {
        id: 'guild_membership',
        name: 'Guild Membership',
        description: 'Professional organization affiliation',
        benefits: ['training', 'networking', 'protection'],
        risks: ['dues_obligations', 'guild_politics', 'expulsion']
      },
      {
        id: 'blood_oath',
        name: 'Blood Oath',
        description: 'Sacred binding agreement with severe consequences',
        benefits: ['unbreakable_loyalty', 'magical_binding', 'honor_enforcement'],
        risks: ['severe_penalties', 'magical_interference', 'honor_conflicts']
      },
      {
        id: 'mutual_defense_pact',
        name: 'Mutual Defense Pact',
        description: 'Agreement to defend each other against threats',
        benefits: ['security', 'deterrence', 'coordinated_response'],
        risks: ['false_flags', 'alliance_stretching', 'resource_drain']
      },
      {
        id: 'research_collaboration',
        name: 'Research Collaboration',
        description: 'Joint intellectual or magical research efforts',
        benefits: ['knowledge_sharing', 'resource_pooling', 'accelerated_progress'],
        risks: ['intellectual_property', 'research_sabotage', 'discovery_conflicts']
      },
      {
        id: 'criminal_syndicate',
        name: 'Criminal Syndicate',
        description: 'Organized crime cooperative network',
        benefits: ['resource_sharing', 'protection', 'market_control'],
        risks: ['law_enforcement', 'internal_betrayal', 'competition']
      }
    ];

    for (const alliance of alliancesData) {
      this.alliances.set(alliance.id, alliance);
    }

    console.log(`🤝 Loaded ${this.alliances.size} alliance types`);
  }

  // Public API methods
  async createRelationship(character1Id, character2Id, relationshipType, initialStatus = 'neutral') {
    const relationshipId = `${character1Id}_${character2Id}`;

    if (this.relationships.has(relationshipId)) {
      throw new RelationshipManagerError(`Relationship between ${character1Id} and ${character2Id} already exists`);
    }

    const relationship = {
      id: relationshipId,
      characters: [character1Id, character2Id],
      type: relationshipType,
      status: initialStatus,
      trustLevel: 0,
      history: [],
      conflicts: [],
      alliances: [],
      createdAt: new Date(),
      lastInteraction: new Date()
    };

    this.relationships.set(relationshipId, relationship);
    return relationship;
  }

  async updateRelationshipStatus(relationshipId, newStatus, reason = '') {
    const relationship = this.relationships.get(relationshipId);
    if (!relationship) {
      throw new RelationshipManagerError(`Relationship ${relationshipId} not found`);
    }

    const oldStatus = relationship.status;
    relationship.status = newStatus;
    relationship.lastInteraction = new Date();

    relationship.history.push({
      timestamp: new Date(),
      action: 'status_change',
      oldStatus,
      newStatus,
      reason
    });

    return relationship;
  }

  async addRelationshipEvent(relationshipId, eventType, description, impact = 0) {
    const relationship = this.relationships.get(relationshipId);
    if (!relationship) {
      throw new RelationshipManagerError(`Relationship ${relationshipId} not found`);
    }

    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: eventType,
      description,
      impact,
      timestamp: new Date()
    };

    relationship.history.push(event);
    relationship.trustLevel = Math.max(-100, Math.min(100, relationship.trustLevel + impact));
    relationship.lastInteraction = new Date();

    return event;
  }

  async createConflict(relationshipId, conflictType, description, severity = 'minor') {
    const relationship = this.relationships.get(relationshipId);
    if (!relationship) {
      throw new RelationshipManagerError(`Relationship ${relationshipId} not found`);
    }

    const conflictTypeData = this.conflictTypes.get(conflictType);
    if (!conflictTypeData) {
      throw new RelationshipManagerError(`Unknown conflict type: ${conflictType}`);
    }

    const conflict = {
      id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: conflictType,
      description,
      severity,
      status: 'active',
      resolutionMethods: conflictTypeData.resolution_methods,
      escalationRisk: conflictTypeData.escalation_risk,
      createdAt: new Date(),
      resolvedAt: null
    };

    relationship.conflicts.push(conflict);

    // Impact trust based on severity
    const trustImpact = severity === 'minor' ? -10 : severity === 'major' ? -25 : -50;
    relationship.trustLevel = Math.max(-100, Math.min(100, relationship.trustLevel + trustImpact));

    return conflict;
  }

  async resolveConflict(relationshipId, conflictId, resolutionMethod, outcome = 'resolved') {
    const relationship = this.relationships.get(relationshipId);
    if (!relationship) {
      throw new RelationshipManagerError(`Relationship ${relationshipId} not found`);
    }

    const conflict = relationship.conflicts.find(c => c.id === conflictId);
    if (!conflict) {
      throw new RelationshipManagerError(`Conflict ${conflictId} not found in relationship ${relationshipId}`);
    }

    conflict.status = outcome;
    conflict.resolvedAt = new Date();
    conflict.resolutionMethod = resolutionMethod;

    // Adjust trust based on resolution
    let trustAdjustment = 0;
    if (outcome === 'resolved') {
      trustAdjustment = resolutionMethod === 'forgiveness' ? 20 : 10;
    } else if (outcome === 'escalated') {
      trustAdjustment = -30;
    }

    relationship.trustLevel = Math.max(-100, Math.min(100, relationship.trustLevel + trustAdjustment));

    return conflict;
  }

  async formAlliance(relationshipId, allianceType, terms = {}) {
    const relationship = this.relationships.get(relationshipId);
    if (!relationship) {
      throw new RelationshipManagerError(`Relationship ${relationshipId} not found`);
    }

    const allianceTypeData = this.alliances.get(allianceType);
    if (!allianceTypeData) {
      throw new RelationshipManagerError(`Unknown alliance type: ${allianceType}`);
    }

    const alliance = {
      id: `alliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: allianceType,
      terms,
      benefits: allianceTypeData.benefits,
      risks: allianceTypeData.risks,
      status: 'active',
      formedAt: new Date(),
      dissolvedAt: null
    };

    relationship.alliances.push(alliance);

    // Boost trust for alliance formation
    relationship.trustLevel = Math.max(-100, Math.min(100, relationship.trustLevel + 15));

    return alliance;
  }

  async dissolveAlliance(relationshipId, allianceId, reason = '') {
    const relationship = this.relationships.get(relationshipId);
    if (!relationship) {
      throw new RelationshipManagerError(`Relationship ${relationshipId} not found`);
    }

    const alliance = relationship.alliances.find(a => a.id === allianceId);
    if (!alliance) {
      throw new RelationshipManagerError(`Alliance ${allianceId} not found in relationship ${relationshipId}`);
    }

    alliance.status = 'dissolved';
    alliance.dissolvedAt = new Date();
    alliance.dissolutionReason = reason;

    // Reduce trust for alliance dissolution
    relationship.trustLevel = Math.max(-100, Math.min(100, relationship.trustLevel - 20));

    return alliance;
  }

  async getRelationshipStatus(relationshipId) {
    const relationship = this.relationships.get(relationshipId);
    if (!relationship) {
      return null;
    }

    return {
      id: relationship.id,
      characters: relationship.characters,
      type: relationship.type,
      status: relationship.status,
      trustLevel: relationship.trustLevel,
      trustDescription: this.getTrustLevelDescription(relationship.trustLevel),
      activeConflicts: relationship.conflicts.filter(c => c.status === 'active').length,
      activeAlliances: relationship.alliances.filter(a => a.status === 'active').length,
      lastInteraction: relationship.lastInteraction
    };
  }

  getTrustLevelDescription(trustLevel) {
    if (trustLevel >= 80) return 'Unwavering Trust';
    if (trustLevel >= 60) return 'Strong Trust';
    if (trustLevel >= 40) return 'Moderate Trust';
    if (trustLevel >= 20) return 'Limited Trust';
    if (trustLevel >= 0) return 'Neutral';
    if (trustLevel >= -20) return 'Distrust';
    if (trustLevel >= -40) return 'Strong Distrust';
    if (trustLevel >= -60) return 'Deep Distrust';
    if (trustLevel >= -80) return 'Hatred';
    return 'Utter Loathing';
  }

  async getCharacterRelationships(characterId) {
    const characterRelationships = [];

    for (const [relationshipId, relationship] of this.relationships) {
      if (relationship.characters.includes(characterId)) {
        const otherCharacter = relationship.characters.find(id => id !== characterId);
        characterRelationships.push({
          relationshipId,
          otherCharacter,
          ...await this.getRelationshipStatus(relationshipId)
        });
      }
    }

    return characterRelationships;
  }

  async generateSocialEncounter(character1Id, character2Id, context = 'neutral') {
    // Generate a random social encounter between two characters
    const relationshipId = `${character1Id}_${character2Id}`;
    let relationship = this.relationships.get(relationshipId);

    if (!relationship) {
      // Create a new relationship if none exists
      const randomType = Array.from(this.relationshipTypes.keys())[Math.floor(Math.random() * this.relationshipTypes.size)];
      relationship = await this.createRelationship(character1Id, character2Id, randomType);
    }

    const encounterTypes = ['conversation', 'conflict', 'alliance_offer', 'betrayal', 'support', 'romance'];
    const encounterType = encounterTypes[Math.floor(Math.random() * encounterTypes.length)];

    const encounter = {
      type: encounterType,
      description: await this.generateEncounterDescription(encounterType, relationship),
      possibleOutcomes: await this.generateEncounterOutcomes(encounterType, relationship),
      context
    };

    return encounter;
  }

  async generateEncounterDescription(encounterType, relationship) {
    const descriptions = {
      conversation: [
        'A casual conversation reveals shared interests',
        'Deep discussion uncovers personal philosophies',
        'Light banter builds rapport and understanding'
      ],
      conflict: [
        'Disagreement sparks heated argument',
        'Competing goals create immediate tension',
        'Past grievances resurface in confrontation'
      ],
      alliance_offer: [
        'Proposal of mutual cooperation and benefit',
        'Suggestion of joint venture or partnership',
        'Offer of assistance in time of need'
      ],
      betrayal: [
        'Discovery of hidden agenda or deception',
        'Broken promise damages trust irreparably',
        'Secret alliance with enemies revealed'
      ],
      support: [
        'Offer of help during difficult circumstances',
        'Emotional support and encouragement provided',
        'Practical assistance offered freely'
      ],
      romance: [
        'Sparks of attraction begin to develop',
        'Romantic tension builds between characters',
        'Expressions of affection and interest'
      ]
    };

    const typeDescriptions = descriptions[encounterType] || ['An unexpected social interaction occurs'];
    return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
  }

  async generateEncounterOutcomes(encounterType, relationship) {
    const outcomes = {
      conversation: ['trust_increase', 'understanding', 'friendship'],
      conflict: ['escalation', 'resolution', 'avoidance'],
      alliance_offer: ['acceptance', 'rejection', 'negotiation'],
      betrayal: ['confrontation', 'forgiveness', 'revenge'],
      support: ['gratitude', 'reciprocation', 'dependence'],
      romance: ['reciprocation', 'rejection', 'complication']
    };

    return outcomes[encounterType] || ['neutral'];
  }

  async simulateRelationshipProgression(relationshipId, timePeriod = 'month') {
    const relationship = this.relationships.get(relationshipId);
    if (!relationship) {
      throw new RelationshipManagerError(`Relationship ${relationshipId} not found`);
    }

    // Simulate natural progression based on relationship type and current status
    const progressionEvents = [];

    // Random events based on relationship type
    const typeData = this.relationshipTypes.get(relationship.type);
    if (typeData) {
      // Chance for positive or negative events
      const eventChance = Math.random();

      if (eventChance < 0.3) {
        // Positive event
        const positiveDynamics = typeData.dynamics.filter(d => this.isPositiveDynamic(d));
        if (positiveDynamics.length > 0) {
          const dynamic = positiveDynamics[Math.floor(Math.random() * positiveDynamics.length)];
          const event = await this.addRelationshipEvent(relationshipId, 'positive_progression',
            `Relationship strengthened through ${dynamic}`, 5);
          progressionEvents.push(event);
        }
      } else if (eventChance < 0.6) {
        // Neutral event
        const event = await this.addRelationshipEvent(relationshipId, 'maintenance',
          'Relationship continues with regular interaction', 0);
        progressionEvents.push(event);
      } else {
        // Potential conflict
        const conflictChance = Math.random();
        if (conflictChance < 0.2) {
          const conflicts = typeData.commonConflicts;
          if (conflicts.length > 0) {
            const conflictType = conflicts[Math.floor(Math.random() * conflicts.length)];
            const conflict = await this.createConflict(relationshipId, conflictType,
              `A ${conflictType} situation arises`, 'minor');
            progressionEvents.push({ type: 'conflict_created', conflict });
          }
        }
      }
    }

    return progressionEvents;
  }

  isPositiveDynamic(dynamic) {
    const positiveDynamics = ['teaching', 'growth', 'respect', 'loyalty', 'support', 'trust', 'love', 'passion', 'commitment'];
    return positiveDynamics.includes(dynamic);
  }

  // Get all options for UI
  async getAllRelationshipTypes() {
    return Array.from(this.relationshipTypes.values());
  }

  async getAllSocialDynamics() {
    return Array.from(this.socialDynamics.values());
  }

  async getAllConflictTypes() {
    return Array.from(this.conflictTypes.values());
  }

  async getAllAlliances() {
    return Array.from(this.alliances.values());
  }

  async exportRelationshipData() {
    const exportData = {
      relationships: Object.fromEntries(this.relationships),
      relationshipTypes: Object.fromEntries(this.relationshipTypes),
      socialDynamics: Object.fromEntries(this.socialDynamics),
      conflictTypes: Object.fromEntries(this.conflictTypes),
      alliances: Object.fromEntries(this.alliances),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return exportData;
  }
}

// Error Classes
class RelationshipManagerError extends Error {
  constructor(message) { super(message); this.name = 'RelationshipManagerError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RelationshipManager;
} else if (typeof window !== 'undefined') {
  window.RelationshipManager = RelationshipManager;
}
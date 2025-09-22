/**
 * Advanced Combat & Initiative Tracker
 * Complete D&D 3.5 Combat Management System
 * Real-time initiative tracking, condition monitoring, spell duration management
 */
class AdvancedCombatTracker {
  constructor() {
    this.combatState = {
      active: false,
      round: 0,
      currentTurn: 0,
      turnTimer: null,
      combatLog: []
    };
    
    this.initiative = {
      order: [],
      rolled: false,
      delayedActions: [],
      readiedActions: []
    };
    
    this.conditions = this.initializeConditions();
    this.spellDurations = new Map();
    this.combatants = new Map();
    this.battlemap = this.initializeBattlemap();
    
    console.log('⚔️ Advanced Combat Tracker initialized');
  }

  // ============= INITIATIVE SYSTEM =============
  rollInitiative(participants) {
    this.initiative.order = [];
    
    participants.forEach(participant => {
      const initiativeRoll = this.rollD20() + participant.initiativeModifier;
      const initiativeData = {
        id: participant.id,
        name: participant.name,
        initiative: initiativeRoll,
        modifier: participant.initiativeModifier,
        roll: initiativeRoll - participant.initiativeModifier,
        type: participant.type || 'player', // player, npc, monster
        delayedTurn: false,
        readiedAction: null,
        combatant: participant
      };
      
      this.initiative.order.push(initiativeData);
    });
    
    // Sort by initiative (highest first), then by modifier
    this.initiative.order.sort((a, b) => {
      if (b.initiative !== a.initiative) {
        return b.initiative - a.initiative;
      }
      return b.modifier - a.modifier;
    });
    
    this.initiative.rolled = true;
    this.combatState.currentTurn = 0;
    
    this.logCombatEvent('Initiative rolled', this.initiative.order.map(i => 
      `${i.name}: ${i.initiative} (${i.roll > 0 ? '+' : ''}${i.roll})`
    ));
    
    console.log('🎲 Initiative rolled:', this.initiative.order);
    return this.initiative.order;
  }

  getCurrentCombatant() {
    if (!this.initiative.rolled || this.initiative.order.length === 0) {
      return null;
    }
    return this.initiative.order[this.combatState.currentTurn];
  }

  nextTurn() {
    if (!this.combatState.active) return;
    
    const currentCombatant = this.getCurrentCombatant();
    if (currentCombatant) {
      // Process end-of-turn effects
      this.processEndOfTurnEffects(currentCombatant.id);
      
      // Log turn end
      this.logCombatEvent(`${currentCombatant.name} ends turn`, 
        `Round ${this.combatState.round}, Turn ${this.combatState.currentTurn + 1}`);
    }
    
    this.combatState.currentTurn++;
    
    // Check for new round
    if (this.combatState.currentTurn >= this.initiative.order.length) {
      this.startNewRound();
    }
    
    const newCombatant = this.getCurrentCombatant();
    if (newCombatant) {
      // Process start-of-turn effects
      this.processStartOfTurnEffects(newCombatant.id);
      
      // Log turn start
      this.logCombatEvent(`${newCombatant.name} begins turn`, 
        `Round ${this.combatState.round}, Initiative ${newCombatant.initiative}`);
      
      // Update spell durations
      this.updateSpellDurations();
    }
    
    return newCombatant;
  }

  startNewRound() {
    this.combatState.round++;
    this.combatState.currentTurn = 0;
    
    // Process start-of-round effects
    this.processStartOfRoundEffects();
    
    this.logCombatEvent(`Round ${this.combatState.round} begins`);
    
    console.log(`⚔️ Round ${this.combatState.round} begins`);
  }

  delayTurn(combatantId) {
    const combatant = this.findCombatantInInitiative(combatantId);
    if (combatant) {
      combatant.delayedTurn = true;
      this.initiative.delayedActions.push(combatant);
      
      this.logCombatEvent(`${combatant.name} delays their turn`);
      
      // Skip to next combatant
      this.nextTurn();
    }
  }

  actOnDelayedTurn(combatantId) {
    const delayedIndex = this.initiative.delayedActions.findIndex(d => d.id === combatantId);
    if (delayedIndex !== -1) {
      const combatant = this.initiative.delayedActions.splice(delayedIndex, 1)[0];
      combatant.delayedTurn = false;
      
      // Insert back into initiative order at current position
      combatant.initiative = this.getCurrentCombatant()?.initiative - 0.1 || 0;
      
      this.logCombatEvent(`${combatant.name} acts on delayed turn`);
      
      return combatant;
    }
    return null;
  }

  readyAction(combatantId, action, trigger) {
    const combatant = this.findCombatantInInitiative(combatantId);
    if (combatant) {
      combatant.readiedAction = {
        action: action,
        trigger: trigger,
        resolved: false
      };
      
      this.initiative.readiedActions.push({
        combatantId: combatantId,
        action: action,
        trigger: trigger
      });
      
      this.logCombatEvent(`${combatant.name} readies action`, `Trigger: ${trigger}`);
    }
  }

  // ============= CONDITION SYSTEM =============
  initializeConditions() {
    return {
      // Physical Conditions
      blinded: {
        name: 'Blinded',
        type: 'physical',
        effects: {
          attackPenalty: -2,
          acPenalty: -2,
          skillPenalties: { spot: -4, search: -4 },
          movementReduction: 0.5,
          autoFail: ['spot_checks_based_on_sight']
        },
        description: 'Cannot see, -2 to attacks and AC, half movement speed'
      },
      
      deafened: {
        name: 'Deafened',
        type: 'physical',
        effects: {
          skillPenalties: { listen: -4 },
          spellFailure: 0.2, // 20% spell failure for verbal components
          autoFail: ['listen_checks']
        },
        description: 'Cannot hear, -4 to Listen checks, 20% spell failure'
      },
      
      paralyzed: {
        name: 'Paralyzed',
        type: 'physical',
        effects: {
          cannotMove: true,
          cannotAct: true,
          dexBonus: 0,
          acPenalty: -4,
          autoFail: ['reflex_saves', 'dexterity_checks']
        },
        description: 'Cannot move or act, effective Dex 0, -4 AC penalty'
      },
      
      stunned: {
        name: 'Stunned',
        type: 'physical',
        effects: {
          cannotAct: true,
          acPenalty: -2,
          autoFail: ['reflex_saves']
        },
        description: 'Cannot act, -2 AC penalty, automatically fail Reflex saves'
      },
      
      prone: {
        name: 'Prone',
        type: 'positional',
        effects: {
          meleeAttackPenalty: -4,
          acBonusVsRanged: -4,
          acBonusVsMelee: 4,
          movementType: 'crawling'
        },
        description: 'Lying down, -4 to melee attacks, +4 AC vs ranged, -4 AC vs melee'
      },
      
      // Mental Conditions
      confused: {
        name: 'Confused',
        type: 'mental',
        effects: {
          randomBehavior: true,
          behaviorTable: {
            1: 'attack_caster',
            2: 'act_normally',
            3: 'babble_incoherently',
            4: 'flee_at_top_speed',
            5: 'attack_nearest_creature'
          }
        },
        description: 'Acts randomly each round according to confusion table'
      },
      
      charmed: {
        name: 'Charmed',
        type: 'mental',
        effects: {
          regardsCharmerAsFriend: true,
          noHostileActions: true,
          saveBonusIfThreatened: 2
        },
        description: 'Regards charmer as friend, will not take hostile actions'
      },
      
      dominated: {
        name: 'Dominated',
        type: 'mental',
        effects: {
          controlledByDominator: true,
          canTakeNoActions: true,
          mentalLink: true
        },
        description: 'Completely controlled by dominating creature'
      },
      
      feared: {
        name: 'Feared',
        type: 'mental',
        effects: {
          mustFlee: true,
          moraleBonus: -2,
          shakingPenalty: -2,
          cannotCharge: true
        },
        description: 'Must flee from fear source, -2 to attacks and saves'
      },
      
      // Magical Conditions
      invisible: {
        name: 'Invisible',
        type: 'magical',
        effects: {
          totalConcealment: true,
          attackBonus: 2,
          acBonus: 2,
          skillBonuses: { hide: 40 }
        },
        description: '+2 to attacks and AC, +40 to Hide checks, total concealment'
      },
      
      hasted: {
        name: 'Hasted',
        type: 'magical',
        effects: {
          extraAttack: true,
          movementBonus: 30,
          acBonus: 1,
          reflexBonus: 1
        },
        description: 'Extra attack, +30 ft movement, +1 AC and Reflex saves'
      },
      
      slowed: {
        name: 'Slowed',
        type: 'magical',
        effects: {
          movementReduction: 0.5,
          attackPenalty: -1,
          acPenalty: -1,
          reflexPenalty: -1,
          reducedActions: true
        },
        description: 'Half movement, -1 to attacks, AC, and Reflex saves'
      },
      
      // Status Effects
      dying: {
        name: 'Dying',
        type: 'status',
        effects: {
          unconscious: true,
          loseHitPoint: true, // Each round
          stabilizationCheck: true // DC 10 Constitution
        },
        description: 'Unconscious, losing 1 hp per round, requires stabilization'
      },
      
      disabled: {
        name: 'Disabled',
        type: 'status',
        effects: {
          limitedActions: 'single_move_or_standard',
          strenuousActionDamage: 1
        },
        description: 'Can take only single move or standard action, strenuous actions deal 1 damage'
      },
      
      exhausted: {
        name: 'Exhausted',
        type: 'status',
        effects: {
          strengthPenalty: -6,
          dexterityPenalty: -6,
          movementReduction: 0.5,
          cannotRun: true
        },
        description: '-6 Str and Dex, half movement, cannot run'
      },
      
      fatigued: {
        name: 'Fatigued',
        type: 'status',
        effects: {
          strengthPenalty: -2,
          dexterityPenalty: -2,
          cannotRun: true
        },
        description: '-2 Str and Dex, cannot run'
      }
    };
  }

  applyCondition(combatantId, conditionName, duration = null, source = null) {
    let combatant = this.combatants.get(combatantId);
    if (!combatant) {
      combatant = { id: combatantId, conditions: new Map() };
      this.combatants.set(combatantId, combatant);
    }
    
    const condition = this.conditions[conditionName];
    if (!condition) {
      console.warn(`Unknown condition: ${conditionName}`);
      return;
    }
    
    const conditionData = {
      ...condition,
      appliedRound: this.combatState.round,
      duration: duration,
      source: source,
      remaining: duration
    };
    
    combatant.conditions.set(conditionName, conditionData);
    
    this.logCombatEvent(`${this.getCombatantName(combatantId)} affected by ${condition.name}`, 
      duration ? `Duration: ${duration} rounds` : 'Permanent until removed');
    
    console.log(`🎭 Applied ${conditionName} to ${this.getCombatantName(combatantId)}`);
  }

  removeCondition(combatantId, conditionName) {
    const combatant = this.combatants.get(combatantId);
    if (combatant && combatant.conditions.has(conditionName)) {
      combatant.conditions.delete(conditionName);
      
      this.logCombatEvent(`${this.getCombatantName(combatantId)} recovers from ${conditionName}`);
      
      console.log(`✨ Removed ${conditionName} from ${this.getCombatantName(combatantId)}`);
    }
  }

  getActiveConditions(combatantId) {
    const combatant = this.combatants.get(combatantId);
    return combatant ? Array.from(combatant.conditions.values()) : [];
  }

  // ============= SPELL DURATION TRACKING =============
  trackSpell(spellData) {
    const spellId = `${spellData.casterId}_${spellData.name}_${Date.now()}`;
    
    const trackedSpell = {
      id: spellId,
      name: spellData.name,
      level: spellData.level,
      school: spellData.school,
      caster: spellData.casterId,
      targets: spellData.targets || [],
      duration: this.parseDuration(spellData.duration),
      concentration: spellData.concentration || false,
      dismissible: spellData.dismissible || false,
      castRound: this.combatState.round,
      remainingDuration: this.parseDuration(spellData.duration),
      effects: spellData.effects || []
    };
    
    this.spellDurations.set(spellId, trackedSpell);
    
    this.logCombatEvent(`${this.getCombatantName(spellData.casterId)} casts ${spellData.name}`, 
      `Duration: ${spellData.duration}`);
    
    console.log(`✨ Tracking spell: ${spellData.name} (${spellId})`);
    return spellId;
  }

  parseDuration(durationString) {
    const duration = { type: 'rounds', value: 1 };
    
    if (typeof durationString === 'string') {
      const lower = durationString.toLowerCase();
      
      if (lower.includes('instant')) {
        duration.type = 'instantaneous';
        duration.value = 0;
      } else if (lower.includes('permanent')) {
        duration.type = 'permanent';
        duration.value = -1;
      } else if (lower.includes('concentration')) {
        duration.type = 'concentration';
        duration.value = -2;
      } else if (lower.includes('round')) {
        const match = lower.match(/(\d+)\s*round/);
        duration.type = 'rounds';
        duration.value = match ? parseInt(match[1]) : 1;
      } else if (lower.includes('minute')) {
        const match = lower.match(/(\d+)\s*minute/);
        duration.type = 'rounds';
        duration.value = match ? parseInt(match[1]) * 10 : 10; // 10 rounds per minute
      } else if (lower.includes('hour')) {
        const match = lower.match(/(\d+)\s*hour/);
        duration.type = 'rounds';
        duration.value = match ? parseInt(match[1]) * 600 : 600; // 600 rounds per hour
      }
    }
    
    return duration;
  }

  updateSpellDurations() {
    for (const [spellId, spell] of this.spellDurations) {
      if (spell.duration.type === 'rounds' && spell.remainingDuration.value > 0) {
        spell.remainingDuration.value--;
        
        if (spell.remainingDuration.value <= 0) {
          this.endSpell(spellId);
        } else if (spell.remainingDuration.value <= 3) {
          this.logCombatEvent(`${spell.name} expires in ${spell.remainingDuration.value} rounds`);
        }
      }
    }
  }

  endSpell(spellId) {
    const spell = this.spellDurations.get(spellId);
    if (spell) {
      // Remove spell effects from targets
      spell.targets.forEach(targetId => {
        this.removeSpellEffects(targetId, spell);
      });
      
      this.spellDurations.delete(spellId);
      
      this.logCombatEvent(`${spell.name} ends`);
      
      console.log(`⏰ Spell ended: ${spell.name}`);
    }
  }

  removeSpellEffects(targetId, spell) {
    // Remove conditions applied by the spell
    spell.effects.forEach(effect => {
      if (effect.type === 'condition') {
        this.removeCondition(targetId, effect.condition);
      }
    });
  }

  dismissSpell(spellId, casterId) {
    const spell = this.spellDurations.get(spellId);
    if (spell && spell.dismissible && spell.caster === casterId) {
      this.endSpell(spellId);
      this.logCombatEvent(`${this.getCombatantName(casterId)} dismisses ${spell.name}`);
      return true;
    }
    return false;
  }

  // ============= BATTLEMAP SYSTEM =============
  initializeBattlemap() {
    return {
      grid: {
        type: 'square', // square or hex
        size: 5, // feet per square
        width: 40, // grid width in squares
        height: 30  // grid height in squares
      },
      positions: new Map(), // combatantId -> {x, y}
      terrain: new Map(), // position -> terrain type
      effects: new Map(), // position -> area effects
      visibility: new Map() // position -> visibility data
    };
  }

  placeCombatant(combatantId, x, y) {
    if (x < 0 || x >= this.battlemap.grid.width || y < 0 || y >= this.battlemap.grid.height) {
      throw new Error('Position outside battlemap bounds');
    }
    
    this.battlemap.positions.set(combatantId, { x, y });
    
    this.logCombatEvent(`${this.getCombatantName(combatantId)} moves to (${x}, ${y})`);
    
    console.log(`📍 Placed ${this.getCombatantName(combatantId)} at (${x}, ${y})`);
  }

  moveCombatant(combatantId, newX, newY) {
    const currentPos = this.battlemap.positions.get(combatantId);
    if (!currentPos) {
      throw new Error('Combatant not on battlemap');
    }
    
    const distance = this.calculateDistance(currentPos.x, currentPos.y, newX, newY);
    
    this.placeCombatant(combatantId, newX, newY);
    
    return {
      distance: distance,
      movement: distance * this.battlemap.grid.size // Convert to feet
    };
  }

  calculateDistance(x1, y1, x2, y2) {
    if (this.battlemap.grid.type === 'square') {
      // D&D 3.5 diagonal movement: every other diagonal counts as 2 squares
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
      const diagonals = Math.min(dx, dy);
      const straight = Math.max(dx, dy) - diagonals;
      
      // Every other diagonal costs 2
      const diagonalCost = Math.floor(diagonals / 2) * 3 + (diagonals % 2);
      
      return straight + diagonalCost;
    } else {
      // Hex grid - count hexes
      return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(x1 + y1 - x2 - y2));
    }
  }

  getRange(combatant1Id, combatant2Id) {
    const pos1 = this.battlemap.positions.get(combatant1Id);
    const pos2 = this.battlemap.positions.get(combatant2Id);
    
    if (!pos1 || !pos2) {
      return null;
    }
    
    const squareDistance = this.calculateDistance(pos1.x, pos1.y, pos2.x, pos2.y);
    const feetDistance = squareDistance * this.battlemap.grid.size;
    
    return {
      squares: squareDistance,
      feet: feetDistance,
      rangeIncrement: Math.ceil(feetDistance / 100) // Range increments for ranged attacks
    };
  }

  // ============= DAMAGE AND HEALING =============
  applyDamage(combatantId, damage, damageType = 'untyped') {
    const combatant = this.getCombatantData(combatantId);
    if (!combatant) return;
    
    // Apply damage reduction if any
    const actualDamage = this.calculateDamageAfterReduction(combatant, damage, damageType);
    
    combatant.currentHitPoints = Math.max(0, combatant.currentHitPoints - actualDamage);
    
    // Check for death/unconsciousness
    this.checkHealthStatus(combatantId);
    
    this.logCombatEvent(`${this.getCombatantName(combatantId)} takes ${actualDamage} ${damageType} damage`, 
      `HP: ${combatant.currentHitPoints}/${combatant.maxHitPoints}`);
    
    console.log(`💥 ${this.getCombatantName(combatantId)} takes ${actualDamage} damage`);
  }

  applyHealing(combatantId, healing) {
    const combatant = this.getCombatantData(combatantId);
    if (!combatant) return;
    
    const oldHP = combatant.currentHitPoints;
    combatant.currentHitPoints = Math.min(combatant.maxHitPoints, combatant.currentHitPoints + healing);
    const actualHealing = combatant.currentHitPoints - oldHP;
    
    // Remove conditions if healed above threshold
    if (combatant.currentHitPoints > 0) {
      this.removeCondition(combatantId, 'dying');
      this.removeCondition(combatantId, 'unconscious');
    }
    
    this.logCombatEvent(`${this.getCombatantName(combatantId)} healed for ${actualHealing} points`, 
      `HP: ${combatant.currentHitPoints}/${combatant.maxHitPoints}`);
    
    console.log(`💚 ${this.getCombatantName(combatantId)} healed for ${actualHealing}`);
  }

  checkHealthStatus(combatantId) {
    const combatant = this.getCombatantData(combatantId);
    if (!combatant) return;
    
    if (combatant.currentHitPoints <= -10) {
      this.applyCondition(combatantId, 'dead');
      this.logCombatEvent(`${this.getCombatantName(combatantId)} dies`);
    } else if (combatant.currentHitPoints < 0) {
      this.applyCondition(combatantId, 'dying');
    } else if (combatant.currentHitPoints === 0) {
      this.applyCondition(combatantId, 'disabled');
    }
  }

  // ============= COMBAT MANAGEMENT =============
  startCombat(participants) {
    this.combatState.active = true;
    this.combatState.round = 1;
    this.combatState.currentTurn = 0;
    
    // Roll initiative
    this.rollInitiative(participants);
    
    // Set up combatants
    participants.forEach(participant => {
      this.combatants.set(participant.id, {
        ...participant,
        conditions: new Map(),
        startingHP: participant.currentHitPoints || participant.hitPoints
      });
    });
    
    this.logCombatEvent('Combat begins!', 
      `${participants.length} combatants, Round ${this.combatState.round}`);
    
    console.log('⚔️ Combat started with', participants.length, 'combatants');
    
    return this.getCurrentCombatant();
  }

  endCombat() {
    this.combatState.active = false;
    
    // Clear all temporary effects
    this.spellDurations.clear();
    this.initiative.delayedActions = [];
    this.initiative.readiedActions = [];
    
    // Log combat end
    const duration = this.combatState.round;
    this.logCombatEvent(`Combat ends after ${duration} rounds`);
    
    console.log(`🏁 Combat ended after ${duration} rounds`);
    
    return {
      duration: duration,
      combatLog: this.combatState.combatLog,
      survivors: this.getSurvivors()
    };
  }

  getSurvivors() {
    const survivors = [];
    for (const [id, combatant] of this.combatants) {
      if (combatant.currentHitPoints > 0 && !combatant.conditions.has('dead')) {
        survivors.push({
          id: id,
          name: combatant.name,
          hitPoints: combatant.currentHitPoints,
          maxHitPoints: combatant.maxHitPoints
        });
      }
    }
    return survivors;
  }

  // ============= TURN EFFECTS PROCESSING =============
  processStartOfTurnEffects(combatantId) {
    const combatant = this.combatants.get(combatantId);
    if (!combatant) return;
    
    // Process conditions that activate at start of turn
    for (const [conditionName, condition] of combatant.conditions) {
      if (condition.effects.loseHitPoint) {
        this.applyDamage(combatantId, 1, 'bleeding');
      }
      
      if (condition.effects.stabilizationCheck) {
        const constitutionCheck = this.rollD20() + this.getAbilityModifier(combatant.constitution);
        if (constitutionCheck >= 10) {
          this.removeCondition(combatantId, 'dying');
          this.applyCondition(combatantId, 'disabled');
          this.logCombatEvent(`${combatant.name} stabilizes`);
        }
      }
    }
    
    // Reduce condition durations
    this.updateConditionDurations(combatantId);
  }

  processEndOfTurnEffects(combatantId) {
    // Currently no end-of-turn effects, but framework is here
  }

  processStartOfRoundEffects() {
    // Process effects that happen at the start of each round
    for (const [spellId, spell] of this.spellDurations) {
      if (spell.effects.some(effect => effect.timing === 'start_of_round')) {
        // Process spell effects that trigger at start of round
      }
    }
  }

  updateConditionDurations(combatantId) {
    const combatant = this.combatants.get(combatantId);
    if (!combatant) return;
    
    for (const [conditionName, condition] of combatant.conditions) {
      if (condition.remaining > 0) {
        condition.remaining--;
        
        if (condition.remaining <= 0) {
          this.removeCondition(combatantId, conditionName);
        }
      }
    }
  }

  // ============= UTILITY METHODS =============
  rollD20() {
    return Math.floor(Math.random() * 20) + 1;
  }

  getAbilityModifier(abilityScore) {
    return Math.floor((abilityScore - 10) / 2);
  }

  calculateDamageAfterReduction(combatant, damage, damageType) {
    // Apply damage reduction
    if (combatant.damageReduction) {
      const reduction = combatant.damageReduction.amount || 0;
      return Math.max(0, damage - reduction);
    }
    return damage;
  }

  getCombatantName(combatantId) {
    const combatant = this.combatants.get(combatantId);
    return combatant ? combatant.name : `Combatant ${combatantId}`;
  }

  getCombatantData(combatantId) {
    return this.combatants.get(combatantId);
  }

  findCombatantInInitiative(combatantId) {
    return this.initiative.order.find(i => i.id === combatantId);
  }

  logCombatEvent(event, details = '') {
    const logEntry = {
      round: this.combatState.round,
      turn: this.combatState.currentTurn + 1,
      timestamp: new Date().toISOString(),
      event: event,
      details: details
    };
    
    this.combatState.combatLog.push(logEntry);
    
    if (details) {
      console.log(`📜 [R${logEntry.round}T${logEntry.turn}] ${event}: ${details}`);
    } else {
      console.log(`📜 [R${logEntry.round}T${logEntry.turn}] ${event}`);
    }
  }

  // ============= EXPORT/IMPORT =============
  exportCombatState() {
    return {
      timestamp: new Date().toISOString(),
      combatState: this.combatState,
      initiative: this.initiative,
      combatants: Array.from(this.combatants.entries()),
      spells: Array.from(this.spellDurations.entries()),
      battlemap: {
        ...this.battlemap,
        positions: Array.from(this.battlemap.positions.entries()),
        terrain: Array.from(this.battlemap.terrain.entries()),
        effects: Array.from(this.battlemap.effects.entries())
      }
    };
  }

  importCombatState(data) {
    this.combatState = data.combatState;
    this.initiative = data.initiative;
    this.combatants = new Map(data.combatants);
    this.spellDurations = new Map(data.spells);
    
    this.battlemap = {
      ...data.battlemap,
      positions: new Map(data.battlemap.positions),
      terrain: new Map(data.battlemap.terrain),
      effects: new Map(data.battlemap.effects)
    };
    
    console.log('⚔️ Combat state imported');
  }

  // ============= COMBAT STATISTICS =============
  getCombatStatistics() {
    return {
      rounds: this.combatState.round,
      totalTurns: this.combatState.combatLog.filter(log => log.event.includes('begins turn')).length,
      activeCombatants: this.combatants.size,
      activeSpells: this.spellDurations.size,
      activeConditions: Array.from(this.combatants.values())
        .reduce((total, combatant) => total + combatant.conditions.size, 0),
      damageDealt: this.combatState.combatLog
        .filter(log => log.event.includes('takes') && log.event.includes('damage'))
        .length,
      healingApplied: this.combatState.combatLog
        .filter(log => log.event.includes('healed'))
        .length
    };
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedCombatTracker;
} else if (typeof window !== 'undefined') {
  window.AdvancedCombatTracker = AdvancedCombatTracker;
}

console.log('⚔️ AdvancedCombatTracker module loaded');
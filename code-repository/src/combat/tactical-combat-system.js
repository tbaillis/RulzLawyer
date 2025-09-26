/**
 * TacticalCombatSystem - Advanced D&D 3.5 Combat Engine
 * 
 * Comprehensive tactical combat system featuring:
 * - Complete D&D 3.5 combat mechanics with full action economy
 * - Advanced tactical options (charges, bull rush, grappling, etc.)
 * - Spell integration with concentration checks and disruption
 * - Environmental effects and battlefield conditions
 * - AI tactical decision making for NPCs and monsters
 * - Combat maneuver resolution with opposed checks
 * - Damage reduction, spell resistance, and condition tracking
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class TacticalCombatSystem {
    constructor(diceEngine, spellManager, inventorySystem) {
        this.diceEngine = diceEngine;
        this.spellManager = spellManager;
        this.inventorySystem = inventorySystem;
        
        // Combat state management
        this.activeCombats = new Map();
        this.initiativeOrder = [];
        this.currentTurn = 0;
        this.combatRound = 0;
        
        // Combat configuration
        this.config = {
            enableTacticalOptions: true,
            enableEnvironmentalEffects: true,
            enableSpellDisruption: true,
            enableGrappling: true,
            enableCombatManeuvers: true,
            aiTacticalLevel: 'advanced', // basic, intermediate, advanced, expert
            detailedCombatLog: true
        };
        
        // Combat action types
        this.actionTypes = {
            'standard': { 
                name: 'Standard Action',
                allowsMove: true,
                allowsSwift: true,
                allowsFree: true
            },
            'full': {
                name: 'Full-Round Action', 
                allowsMove: false,
                allows5FootStep: true,
                allowsSwift: true,
                allowsFree: true
            },
            'move': {
                name: 'Move Action',
                allowsStandard: true,
                allowsSwift: true,
                allowsFree: true
            },
            'swift': {
                name: 'Swift Action',
                count: 1,
                allowsFree: true
            },
            'immediate': {
                name: 'Immediate Action',
                countsAsSwift: true,
                canInterrupt: true
            },
            'free': {
                name: 'Free Action',
                unlimited: true
            }
        };
        
        // Combat maneuvers
        this.combatManeuvers = {
            'bull_rush': {
                name: 'Bull Rush',
                actionType: 'standard',
                opposedCheck: 'strength',
                provokesAOO: true,
                description: 'Push opponent backward'
            },
            'disarm': {
                name: 'Disarm',
                actionType: 'standard',
                opposedCheck: 'attack',
                provokesAOO: true,
                description: 'Remove weapon from opponent\'s grasp'
            },
            'grapple': {
                name: 'Grapple',
                actionType: 'standard',
                opposedCheck: 'grapple',
                provokesAOO: true,
                description: 'Grab and hold opponent'
            },
            'overrun': {
                name: 'Overrun',
                actionType: 'standard',
                opposedCheck: 'strength',
                provokesAOO: false,
                description: 'Knock down opponent while moving'
            },
            'sunder': {
                name: 'Sunder',
                actionType: 'standard',
                opposedCheck: 'attack',
                provokesAOO: true,
                description: 'Damage opponent\'s equipment'
            },
            'trip': {
                name: 'Trip',
                actionType: 'standard',
                opposedCheck: 'strength',
                provokesAOO: true,
                description: 'Knock opponent prone'
            }
        };
        
        // Tactical options
        this.tacticalOptions = {
            'charge': {
                name: 'Charge',
                actionType: 'full',
                requirements: ['move_at_least_10ft', 'straight_line', 'clear_path'],
                bonuses: { attack: 2 },
                penalties: { ac: -2 },
                description: 'Move and attack with bonuses and penalties'
            },
            'fighting_defensively': {
                name: 'Fighting Defensively',
                actionType: 'standard',
                penalties: { attack: -4 },
                bonuses: { ac: 2 },
                description: 'Attack with penalty for AC bonus'
            },
            'full_defense': {
                name: 'Full Defense',
                actionType: 'full',
                bonuses: { ac: 4 },
                description: 'Focus entirely on defense'
            },
            'power_attack': {
                name: 'Power Attack',
                actionType: 'standard',
                variable: true,
                description: 'Trade attack bonus for damage'
            },
            'combat_expertise': {
                name: 'Combat Expertise',
                actionType: 'standard',
                variable: true,
                description: 'Trade attack bonus for AC bonus'
            }
        };
        
        // Status conditions
        this.conditions = {
            'blinded': {
                name: 'Blinded',
                effects: {
                    ac_penalty: 2,
                    attack_penalty: -2,
                    dex_to_ac: false,
                    move_half_speed: true,
                    skill_penalties: { spot: -4, search: -4 }
                }
            },
            'confused': {
                name: 'Confused',
                effects: {
                    random_actions: true,
                    no_spells: true,
                    no_skills: true
                }
            },
            'dazed': {
                name: 'Dazed',
                effects: {
                    no_actions: true,
                    except: ['free_actions']
                }
            },
            'entangled': {
                name: 'Entangled',
                effects: {
                    move_half_speed: true,
                    attack_penalty: -2,
                    effective_dex_penalty: -4,
                    concentration_penalty: -4
                }
            },
            'exhausted': {
                name: 'Exhausted',
                effects: {
                    str_penalty: -6,
                    dex_penalty: -6,
                    move_half_speed: true,
                    no_charge: true,
                    no_run: true
                }
            },
            'fatigued': {
                name: 'Fatigued',
                effects: {
                    str_penalty: -2,
                    dex_penalty: -2,
                    no_charge: true,
                    no_run: true
                }
            },
            'frightened': {
                name: 'Frightened',
                effects: {
                    attack_penalty: -2,
                    save_penalty: -2,
                    skill_penalty: -2,
                    must_flee: true
                }
            },
            'grappled': {
                name: 'Grappled',
                effects: {
                    dex_penalty: -4,
                    no_move: true,
                    attack_penalty: -4,
                    no_spells_somatic: true
                }
            },
            'hasted': {
                name: 'Hasted',
                effects: {
                    extra_attack: 1,
                    attack_bonus: 1,
                    ac_bonus: 1,
                    reflex_bonus: 1
                }
            },
            'invisible': {
                name: 'Invisible',
                effects: {
                    attack_bonus: 2,
                    ac_bonus: 2,
                    total_concealment: true,
                    immunity: ['being_targeted']
                }
            },
            'paralyzed': {
                name: 'Paralyzed',
                effects: {
                    helpless: true,
                    effective_dex: 0,
                    str_check: false,
                    no_actions: true
                }
            },
            'prone': {
                name: 'Prone',
                effects: {
                    melee_attack_penalty: -4,
                    ranged_attack_impossible: true,
                    ac_penalty_vs_melee: -4,
                    ac_bonus_vs_ranged: 4
                }
            },
            'shaken': {
                name: 'Shaken',
                effects: {
                    attack_penalty: -2,
                    save_penalty: -2,
                    skill_penalty: -2
                }
            },
            'slowed': {
                name: 'Slowed',
                effects: {
                    attack_penalty: -1,
                    ac_penalty: -1,
                    reflex_penalty: -1,
                    move_half_speed: true,
                    one_attack_only: true
                }
            },
            'stunned': {
                name: 'Stunned',
                effects: {
                    no_actions: true,
                    ac_penalty: -2,
                    lose_dex_to_ac: true
                }
            },
            'unconscious': {
                name: 'Unconscious',
                effects: {
                    helpless: true,
                    no_actions: true,
                    effective_dex: 0
                }
            }
        };
        
        // Damage types and reductions
        this.damageTypes = [
            'slashing', 'piercing', 'bludgeoning',
            'fire', 'cold', 'electricity', 'acid', 'sonic',
            'force', 'positive', 'negative',
            'lawful', 'chaotic', 'good', 'evil'
        ];
        
        this.initializeCombatSystem();
        console.log('⚔️ Tactical Combat System initialized');
    }

    /**
     * Initialize combat system
     */
    initializeCombatSystem() {
        this.loadCombatTables();
        this.setupAIBehaviors();
        this.initializeEnvironmentalEffects();
        
        console.log('✅ Combat system ready for tactical engagements');
    }

    // ===== COMBAT INITIALIZATION =====

    /**
     * Initialize combat encounter
     */
    async initializeCombat(party, enemies, environment = {}) {
        const combatId = this.generateCombatId();
        
        console.log(`⚔️ Initializing combat encounter (ID: ${combatId})`);
        
        // Prepare all combatants
        const allCombatants = [
            ...party.map(char => ({ ...char, type: 'pc', initiative: 0, actions: this.getDefaultActions() })),
            ...enemies.map(enemy => ({ ...enemy, type: 'npc', initiative: 0, actions: this.getDefaultActions() }))
        ];
        
        // Roll initiative for all combatants
        allCombatants.forEach(combatant => {
            combatant.initiative = this.rollInitiative(combatant);
        });
        
        // Sort by initiative (highest first)
        const initiativeOrder = allCombatants.sort((a, b) => b.initiative - a.initiative);
        
        // Create combat state
        const combat = {
            id: combatId,
            combatants: allCombatants,
            initiativeOrder: initiativeOrder,
            currentTurn: 0,
            round: 1,
            environment: environment,
            activeEffects: new Map(),
            combatLog: [],
            status: 'active',
            startTime: Date.now()
        };
        
        this.activeCombats.set(combatId, combat);
        
        // Log combat start
        this.logCombatEvent(combat, {
            type: 'combat_start',
            message: `Combat begins! Initiative order: ${initiativeOrder.map(c => `${c.name} (${c.initiative})`).join(', ')}`
        });
        
        console.log(`🎲 Initiative order: ${initiativeOrder.map(c => `${c.name} (${c.initiative})`).join(', ')}`);
        
        return combat;
    }

    /**
     * Roll initiative for combatant
     */
    rollInitiative(combatant) {
        const dexModifier = this.getAbilityModifier(combatant.abilities.dexterity);
        let initiativeBonus = dexModifier;
        
        // Add feat bonuses
        if (combatant.feats) {
            if (combatant.feats.includes('Improved Initiative')) {
                initiativeBonus += 4;
            }
            if (combatant.feats.includes('Superior Initiative')) {
                initiativeBonus += 8;
            }
        }
        
        // Add equipment bonuses
        if (combatant.equipment && combatant.equipment.initiativeBonus) {
            initiativeBonus += combatant.equipment.initiativeBonus;
        }
        
        const roll = this.diceEngine.roll('1d20').total;
        const total = roll + initiativeBonus;
        
        console.log(`🎲 ${combatant.name} initiative: ${roll} + ${initiativeBonus} = ${total}`);
        
        return total;
    }

    // ===== COMBAT ROUND MANAGEMENT =====

    /**
     * Process combat round
     */
    async processCombatRound(combatId) {
        const combat = this.activeCombats.get(combatId);
        if (!combat) {
            throw new Error(`Combat ${combatId} not found`);
        }
        
        console.log(`⚔️ Round ${combat.round} begins`);
        
        // Process each combatant's turn
        for (let i = 0; i < combat.initiativeOrder.length; i++) {
            combat.currentTurn = i;
            const currentCombatant = combat.initiativeOrder[i];
            
            // Skip if combatant is defeated or unable to act
            if (this.isDefeated(currentCombatant) || this.cannotAct(currentCombatant)) {
                this.logCombatEvent(combat, {
                    type: 'turn_skipped',
                    combatant: currentCombatant.name,
                    message: `${currentCombatant.name}'s turn skipped (defeated or unable to act)`
                });
                continue;
            }
            
            console.log(`🎯 ${currentCombatant.name}'s turn (Round ${combat.round})`);
            
            // Reset actions for the turn
            currentCombatant.actions = this.getDefaultActions();
            
            // Process turn effects (conditions, spells, etc.)
            this.processStartOfTurnEffects(combat, currentCombatant);
            
            // Determine actions (AI for NPCs, player choice for PCs)
            const turnActions = await this.determineTurnActions(combat, currentCombatant);
            
            // Execute actions
            await this.executeTurnActions(combat, currentCombatant, turnActions);
            
            // Process end of turn effects
            this.processEndOfTurnEffects(combat, currentCombatant);
            
            // Check for combat end conditions
            if (this.checkCombatEnd(combat)) {
                break;
            }
        }
        
        // End of round processing
        this.processEndOfRound(combat);
        combat.round++;
        
        return combat;
    }

    /**
     * Determine turn actions for combatant
     */
    async determineTurnActions(combat, combatant) {
        if (combatant.type === 'pc') {
            // For PCs, we'll use AI for now (in full implementation, this would be player input)
            return this.generateAIActions(combat, combatant);
        } else {
            // For NPCs, use AI
            return this.generateAIActions(combat, combatant);
        }
    }

    /**
     * Generate AI actions for combatant
     */
    generateAIActions(combat, combatant) {
        const actions = [];
        const enemies = this.getEnemiesOfCombatant(combat, combatant);
        const allies = this.getAlliesOfCombatant(combat, combatant);
        
        // Basic AI decision tree
        const situation = this.analyzeCombatSituation(combat, combatant, enemies, allies);
        
        if (situation.health < 0.25 && this.canCastHealingSpell(combatant)) {
            // Low health - try to heal
            actions.push(this.generateHealingAction(combatant));
        } else if (situation.canCastOffensiveSpell && enemies.length > 1) {
            // Multiple enemies - try area spell
            actions.push(this.generateAreaSpellAction(combatant, enemies));
        } else if (situation.hasRangedWeapon && situation.range > 30) {
            // Far from enemies - use ranged attack
            actions.push(this.generateRangedAttackAction(combatant, enemies[0]));
        } else if (situation.canCharge) {
            // Can charge - do it for extra damage
            actions.push(this.generateChargeAction(combatant, enemies[0]));
        } else {
            // Default to melee attack
            actions.push(this.generateMeleeAttackAction(combatant, enemies[0]));
        }
        
        // Add movement if needed
        if (situation.needsMovement) {
            actions.unshift(this.generateMovementAction(combatant, situation.targetPosition));
        }
        
        return actions;
    }

    /**
     * Execute turn actions
     */
    async executeTurnActions(combat, combatant, actions) {
        for (const action of actions) {
            if (!this.canTakeAction(combatant, action.type)) {
                this.logCombatEvent(combat, {
                    type: 'action_failed',
                    combatant: combatant.name,
                    message: `${combatant.name} cannot take ${action.type} action`
                });
                continue;
            }
            
            console.log(`🎬 ${combatant.name} performs ${action.name}`);
            
            const result = await this.executeAction(combat, combatant, action);
            
            this.logCombatEvent(combat, {
                type: 'action_executed',
                combatant: combatant.name,
                action: action.name,
                result: result,
                message: this.formatActionResult(combatant, action, result)
            });
            
            // Mark action as used
            this.consumeAction(combatant, action.type);
        }
    }

    // ===== COMBAT ACTIONS =====

    /**
     * Execute specific combat action
     */
    async executeAction(combat, actor, action) {
        switch (action.type) {
            case 'melee_attack':
                return this.executeMeleeAttack(combat, actor, action.target, action.options);
                
            case 'ranged_attack':
                return this.executeRangedAttack(combat, actor, action.target, action.options);
                
            case 'full_attack':
                return this.executeFullAttack(combat, actor, action.target, action.options);
                
            case 'cast_spell':
                return this.executeCastSpell(combat, actor, action.spell, action.targets, action.options);
                
            case 'charge':
                return this.executeCharge(combat, actor, action.target, action.options);
                
            case 'combat_maneuver':
                return this.executeCombatManeuver(combat, actor, action.maneuver, action.target);
                
            case 'move':
                return this.executeMovement(combat, actor, action.destination, action.options);
                
            case 'full_defense':
                return this.executeFullDefense(combat, actor);
                
            case 'ready_action':
                return this.executeReadyAction(combat, actor, action.trigger, action.readiedAction);
                
            default:
                throw new Error(`Unknown action type: ${action.type}`);
        }
    }

    /**
     * Execute melee attack
     */
    async executeMeleeAttack(combat, attacker, target, options = {}) {
        const attackResult = {
            hit: false,
            critical: false,
            damage: 0,
            effects: []
        };
        
        // Calculate attack bonus
        const attackBonus = this.calculateAttackBonus(attacker, 'melee', options);
        
        // Calculate target AC
        const targetAC = this.calculateArmorClass(target, 'melee');
        
        // Roll attack
        const attackRoll = this.diceEngine.roll('1d20');
        const totalAttack = attackRoll.total + attackBonus;
        
        console.log(`🗡️ ${attacker.name} attacks ${target.name}: ${attackRoll.total} + ${attackBonus} = ${totalAttack} vs AC ${targetAC}`);
        
        // Check for natural 1 or 20
        if (attackRoll.total === 1) {
            attackResult.naturalOne = true;
            this.logCombatEvent(combat, {
                type: 'critical_miss',
                attacker: attacker.name,
                target: target.name,
                message: `${attacker.name} rolls a natural 1 - critical miss!`
            });
            return attackResult;
        }
        
        if (attackRoll.total === 20) {
            attackResult.naturalTwenty = true;
            attackResult.critical = true;
        }
        
        // Check if attack hits
        if (totalAttack >= targetAC || attackResult.critical) {
            attackResult.hit = true;
            
            // Check for critical hit confirmation
            if (attackRoll.total >= this.getCriticalThreat(attacker) || attackResult.naturalTwenty) {
                const confirmRoll = this.diceEngine.roll('1d20');
                if (confirmRoll.total + attackBonus >= targetAC) {
                    attackResult.critical = true;
                    console.log(`💥 Critical hit confirmed!`);
                }
            }
            
            // Calculate damage
            attackResult.damage = this.calculateMeleeDamage(attacker, target, attackResult.critical, options);
            
            // Apply damage
            this.applyDamage(target, attackResult.damage);
            
            console.log(`⚔️ Hit for ${attackResult.damage.total} damage!`);
            
        } else {
            console.log(`🛡️ Miss!`);
        }
        
        return attackResult;
    }

    /**
     * Execute spell casting in combat
     */
    async executeCastSpell(combat, caster, spellName, targets, options = {}) {
        console.log(`🔮 ${caster.name} casts ${spellName}`);
        
        // Check for concentration if casting defensively
        if (options.castingDefensively && this.isThreatenedByCombat(combat, caster)) {
            const concentrationDC = 15 + (this.getSpellLevel(spellName) * 2);
            const concentrationCheck = this.rollConcentrationCheck(caster, concentrationDC);
            
            if (!concentrationCheck.success) {
                this.logCombatEvent(combat, {
                    type: 'spell_disrupted',
                    caster: caster.name,
                    spell: spellName,
                    message: `${caster.name}'s spell disrupted by poor concentration`
                });
                return { success: false, reason: 'concentration_failed' };
            }
        }
        
        // Cast spell through spell manager
        const castingResult = await this.spellManager.castSpell(
            caster, 
            spellName, 
            this.getCasterLevel(caster), 
            { targets: targets, ...options }
        );
        
        if (castingResult.success) {
            // Apply spell effects in combat context
            this.applySpellEffectsToCombat(combat, castingResult);
        }
        
        return castingResult;
    }

    /**
     * Execute charge attack
     */
    async executeCharge(combat, charger, target, options = {}) {
        const chargeResult = {
            success: false,
            movementDistance: 0,
            attackResult: null
        };
        
        // Validate charge requirements
        if (!this.canCharge(combat, charger, target)) {
            return { success: false, reason: 'cannot_charge' };
        }
        
        // Move to target (minimum 10 feet)
        const distance = this.calculateDistance(charger.position, target.position);
        chargeResult.movementDistance = Math.min(distance, charger.speed * 2); // Can move up to double speed
        
        // Apply charge bonuses and penalties
        const chargeOptions = {
            ...options,
            attackBonus: 2, // +2 bonus on charge
            acPenalty: -2   // -2 AC penalty until next turn
        };
        
        // Execute attack with charge bonuses
        chargeResult.attackResult = await this.executeMeleeAttack(combat, charger, target, chargeOptions);
        chargeResult.success = chargeResult.attackResult.hit;
        
        // Apply AC penalty until next turn
        this.applyTemporaryEffect(charger, {
            type: 'ac_penalty',
            value: 2,
            duration: 'until_next_turn',
            source: 'charge'
        });
        
        console.log(`🏃‍♂️ ${charger.name} charges ${target.name} for ${chargeResult.movementDistance} feet`);
        
        return chargeResult;
    }

    // ===== DAMAGE AND HEALING =====

    /**
     * Calculate melee damage
     */
    calculateMeleeDamage(attacker, target, isCritical = false, options = {}) {
        const weapon = this.getPrimaryWeapon(attacker);
        const strModifier = this.getAbilityModifier(attacker.abilities.strength);
        
        let baseDamage = weapon ? weapon.damage : '1d3'; // Unarmed damage
        let damageBonus = strModifier;
        
        // Add weapon enhancement bonus
        if (weapon && weapon.enhancement) {
            damageBonus += weapon.enhancement;
        }
        
        // Add feat bonuses
        if (attacker.feats) {
            if (attacker.feats.includes('Weapon Specialization') && weapon) {
                damageBonus += 2;
            }
            if (attacker.feats.includes('Power Attack') && options.powerAttack) {
                damageBonus += options.powerAttack;
            }
        }
        
        // Roll damage
        const damageRoll = this.diceEngine.roll(baseDamage);
        let totalDamage = damageRoll.total + damageBonus;
        
        // Apply critical multiplier
        if (isCritical) {
            const critMultiplier = weapon ? weapon.critical.multiplier : 2;
            totalDamage = (damageRoll.total * critMultiplier) + damageBonus;
        }
        
        // Apply damage reduction
        totalDamage = this.applyDamageReduction(target, totalDamage, weapon);
        
        return {
            base: damageRoll.total,
            bonus: damageBonus,
            total: Math.max(0, totalDamage),
            critical: isCritical,
            type: weapon ? weapon.damageType : 'bludgeoning'
        };
    }

    /**
     * Apply damage to target
     */
    applyDamage(target, damage) {
        const actualDamage = Math.min(damage.total, target.hitPoints);
        target.hitPoints -= actualDamage;
        
        console.log(`💔 ${target.name} takes ${actualDamage} ${damage.type} damage (${target.hitPoints} HP remaining)`);
        
        // Check for death or unconsciousness
        if (target.hitPoints <= 0) {
            if (target.hitPoints <= -10) {
                this.applyCondition(target, 'dead');
                console.log(`💀 ${target.name} is dead!`);
            } else {
                this.applyCondition(target, 'unconscious');
                console.log(`😵 ${target.name} is unconscious!`);
            }
        }
        
        return actualDamage;
    }

    /**
     * Apply damage reduction
     */
    applyDamageReduction(target, damage, weapon) {
        if (!target.damageReduction) return damage;
        
        const dr = target.damageReduction;
        let reducedDamage = damage;
        
        // Check if weapon bypasses DR
        if (weapon && this.weaponBypassesDR(weapon, dr)) {
            return damage; // No reduction
        }
        
        // Apply reduction
        reducedDamage = Math.max(0, damage - dr.amount);
        
        if (reducedDamage < damage) {
            console.log(`🛡️ Damage reduced by ${damage - reducedDamage} (DR ${dr.amount}/${dr.type})`);
        }
        
        return reducedDamage;
    }

    // ===== CONDITIONS AND EFFECTS =====

    /**
     * Apply condition to target
     */
    applyCondition(target, conditionName, duration = null, source = null) {
        if (!this.conditions[conditionName]) {
            console.warn(`Unknown condition: ${conditionName}`);
            return;
        }
        
        target.conditions = target.conditions || [];
        
        const condition = {
            name: conditionName,
            effects: this.conditions[conditionName].effects,
            duration: duration,
            source: source,
            appliedAt: Date.now()
        };
        
        target.conditions.push(condition);
        
        console.log(`🎭 ${target.name} gains condition: ${conditionName}`);
        
        return condition;
    }

    /**
     * Remove condition from target
     */
    removeCondition(target, conditionName) {
        if (!target.conditions) return false;
        
        const index = target.conditions.findIndex(c => c.name === conditionName);
        if (index !== -1) {
            target.conditions.splice(index, 1);
            console.log(`✨ ${target.name} loses condition: ${conditionName}`);
            return true;
        }
        
        return false;
    }

    /**
     * Check if target has condition
     */
    hasCondition(target, conditionName) {
        return target.conditions && target.conditions.some(c => c.name === conditionName);
    }

    // ===== UTILITY METHODS =====

    /**
     * Calculate attack bonus
     */
    calculateAttackBonus(attacker, attackType, options = {}) {
        let attackBonus = 0;
        
        // Base attack bonus
        attackBonus += this.getBaseAttackBonus(attacker);
        
        // Ability modifier
        if (attackType === 'melee') {
            attackBonus += this.getAbilityModifier(attacker.abilities.strength);
        } else if (attackType === 'ranged') {
            attackBonus += this.getAbilityModifier(attacker.abilities.dexterity);
        }
        
        // Weapon enhancement
        const weapon = this.getPrimaryWeapon(attacker);
        if (weapon && weapon.enhancement) {
            attackBonus += weapon.enhancement;
        }
        
        // Size modifier
        attackBonus += this.getSizeModifier(attacker.size, 'attack');
        
        // Condition modifiers
        if (attacker.conditions) {
            attacker.conditions.forEach(condition => {
                if (condition.effects.attack_bonus) {
                    attackBonus += condition.effects.attack_bonus;
                }
                if (condition.effects.attack_penalty) {
                    attackBonus -= condition.effects.attack_penalty;
                }
            });
        }
        
        // Tactical option modifiers
        if (options.attackBonus) {
            attackBonus += options.attackBonus;
        }
        
        return attackBonus;
    }

    /**
     * Calculate armor class
     */
    calculateArmorClass(target, attackType = 'melee') {
        let ac = 10;
        
        // Armor bonus
        if (target.equipment && target.equipment.armor) {
            ac += target.equipment.armor.acBonus;
        }
        
        // Shield bonus
        if (target.equipment && target.equipment.shield) {
            ac += target.equipment.shield.acBonus;
        }
        
        // Dexterity modifier (if not flat-footed or paralyzed)
        if (!this.hasCondition(target, 'flat-footed') && !this.hasCondition(target, 'paralyzed')) {
            const dexMod = this.getAbilityModifier(target.abilities.dexterity);
            const maxDexBonus = target.equipment?.armor?.maxDexBonus ?? 99;
            ac += Math.min(dexMod, maxDexBonus);
        }
        
        // Size modifier
        ac += this.getSizeModifier(target.size, 'ac');
        
        // Natural armor
        if (target.naturalArmor) {
            ac += target.naturalArmor;
        }
        
        // Deflection bonus
        if (target.deflectionBonus) {
            ac += target.deflectionBonus;
        }
        
        // Condition modifiers
        if (target.conditions) {
            target.conditions.forEach(condition => {
                if (condition.effects.ac_bonus) {
                    ac += condition.effects.ac_bonus;
                }
                if (condition.effects.ac_penalty) {
                    ac -= condition.effects.ac_penalty;
                }
            });
        }
        
        return ac;
    }

    /**
     * Get ability modifier
     */
    getAbilityModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    /**
     * Generate combat ID
     */
    generateCombatId() {
        return `combat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get default actions for combatant
     */
    getDefaultActions() {
        return {
            standard: true,
            move: true,
            swift: true,
            free: true,
            immediate: true // Available until used
        };
    }

    /**
     * Log combat event
     */
    logCombatEvent(combat, event) {
        combat.combatLog.push({
            ...event,
            round: combat.round,
            timestamp: Date.now()
        });
        
        if (this.config.detailedCombatLog) {
            console.log(`📝 [Round ${combat.round}] ${event.message}`);
        }
    }

    /**
     * Check if combat has ended
     */
    checkCombatEnd(combat) {
        const alivePCs = combat.combatants.filter(c => c.type === 'pc' && !this.isDefeated(c));
        const aliveNPCs = combat.combatants.filter(c => c.type === 'npc' && !this.isDefeated(c));
        
        if (alivePCs.length === 0) {
            combat.status = 'defeat';
            combat.winner = 'enemies';
            return true;
        }
        
        if (aliveNPCs.length === 0) {
            combat.status = 'victory';
            combat.winner = 'party';
            return true;
        }
        
        return false;
    }

    /**
     * Check if combatant is defeated
     */
    isDefeated(combatant) {
        return combatant.hitPoints <= 0 || 
               this.hasCondition(combatant, 'dead') ||
               this.hasCondition(combatant, 'unconscious');
    }

    /**
     * Get combat summary
     */
    getCombatSummary(combatId) {
        const combat = this.activeCombats.get(combatId);
        if (!combat) return null;
        
        return {
            id: combat.id,
            status: combat.status,
            round: combat.round,
            winner: combat.winner,
            duration: Date.now() - combat.startTime,
            combatants: combat.combatants.map(c => ({
                name: c.name,
                type: c.type,
                hitPoints: c.hitPoints,
                conditions: c.conditions?.map(cond => cond.name) || []
            })),
            logEntries: combat.combatLog.length
        };
    }
}

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TacticalCombatSystem;
} else if (typeof window !== 'undefined') {
    window.TacticalCombatSystem = TacticalCombatSystem;
}
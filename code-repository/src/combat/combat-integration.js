/**
 * CombatIntegration - Adventure Engine Combat System Integration
 * 
 * Integrates the adventure engine with combat mechanics, initiative tracking,
 * and spell system foundations for seamless battle encounters
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class CombatIntegration {
    constructor(adventureEngine, inventoryIntegration, diceEngine) {
        this.adventureEngine = adventureEngine;
        this.inventoryIntegration = inventoryIntegration;
        this.diceEngine = diceEngine;
        
        // Combat state management
        this.activeCombats = new Map();
        this.combatHistory = [];
        
        // Combat configuration
        this.combatConfig = {
            initiativeBonus: {
                dexterity: true,
                improvedInitiative: 4,
                alertness: 2,
                superior: 8
            },
            attackTypes: {
                melee: { range: 5, abilityScore: 'strength' },
                ranged: { range: 100, abilityScore: 'dexterity' },
                spell: { range: 'varies', abilityScore: 'varies' },
                natural: { range: 5, abilityScore: 'strength' }
            },
            conditions: {
                flanking: { attackBonus: 2 },
                prone: { acPenalty: -4, attackPenalty: -4 },
                grappled: { acPenalty: -4, dexPenalty: 0 },
                stunned: { acPenalty: -2, dexPenalty: 0 },
                paralyzed: { acPenalty: 0, dexPenalty: 0, helpless: true }
            }
        };
        
        console.log('⚔️ Combat Integration initialized');
    }

    // ===== COMBAT ENCOUNTER GENERATION =====

    /**
     * Generate combat encounter from adventure context
     */
    generateCombatEncounter(adventureContext, partyLevel, encounterDifficulty = 'medium') {
        const encounter = {
            id: this.generateEncounterId(),
            adventureId: adventureContext.id,
            difficulty: encounterDifficulty,
            environment: adventureContext.currentLocation || 'dungeon',
            partyLevel: partyLevel,
            enemies: [],
            terrain: this.generateTerrain(adventureContext),
            objectives: this.generateCombatObjectives(adventureContext),
            specialRules: [],
            initiative: new Map(),
            rounds: 0,
            status: 'preparing',
            startTime: null,
            endTime: null
        };
        
        // Generate appropriate enemies based on adventure context
        encounter.enemies = this.generateEnemiesForEncounter(
            adventureContext, 
            partyLevel, 
            encounterDifficulty
        );
        
        // Add environmental hazards if appropriate
        if (adventureContext.hazards) {
            encounter.hazards = this.generateEnvironmentalHazards(adventureContext);
        }
        
        // Generate tactical positioning
        encounter.positioning = this.generateInitialPositioning(encounter);
        
        console.log(`⚔️ Generated ${encounterDifficulty} combat encounter: ${encounter.enemies.length} enemies`);
        
        return encounter;
    }

    /**
     * Generate enemies for encounter based on challenge rating
     */
    generateEnemiesForEncounter(adventureContext, partyLevel, difficulty) {
        const challengeRating = this.calculateTargetCR(partyLevel, difficulty);
        const enemies = [];
        
        // Determine enemy composition based on adventure theme
        const enemyTypes = this.getEnemyTypesForTheme(adventureContext.theme);
        
        let remainingCR = challengeRating;
        let enemyCount = 0;
        
        while (remainingCR > 0.25 && enemies.length < 8) {
            const enemyType = this.selectEnemyType(enemyTypes, remainingCR);
            const enemy = this.createCombatEnemy(enemyType, adventureContext);
            
            if (enemy.challengeRating <= remainingCR) {
                enemies.push(enemy);
                remainingCR -= enemy.challengeRating;
                enemyCount++;
            } else {
                break;
            }
        }
        
        return enemies;
    }

    /**
     * Create combat-ready enemy from base data
     */
    createCombatEnemy(enemyType, adventureContext) {
        const enemy = {
            id: `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            name: enemyType.name,
            type: enemyType.type,
            challengeRating: enemyType.cr,
            hitPoints: {
                current: enemyType.hitPoints,
                max: enemyType.hitPoints,
                temporary: 0
            },
            armorClass: enemyType.ac,
            abilities: { ...enemyType.abilities },
            speeds: { ...enemyType.speeds },
            attacks: enemyType.attacks.map(attack => ({
                ...attack,
                id: `attack_${Math.random().toString(36).substr(2, 6)}`
            })),
            specialAbilities: [ ...(enemyType.specialAbilities || []) ],
            savingThrows: { ...enemyType.savingThrows },
            skills: { ...enemyType.skills },
            resistances: [ ...(enemyType.resistances || []) ],
            immunities: [ ...(enemyType.immunities || []) ],
            vulnerabilities: [ ...(enemyType.vulnerabilities || []) ],
            senses: { ...enemyType.senses },
            languages: [ ...(enemyType.languages || []) ],
            position: { x: 0, y: 0, facing: 0 },
            conditions: [],
            initiative: 0,
            actionsTaken: { move: false, standard: false, swift: false, full: false },
            spellsKnown: enemyType.spells ? [ ...enemyType.spells ] : [],
            spellSlots: enemyType.spellSlots ? { ...enemyType.spellSlots } : {},
            status: 'active'
        };
        
        // Apply adventure-specific modifications
        this.applyAdventureModifications(enemy, adventureContext);
        
        return enemy;
    }

    // ===== INITIATIVE SYSTEM =====

    /**
     * Roll initiative for all combatants
     */
    rollInitiativeForAll(encounter, partyMembers) {
        const initiativeResults = [];
        
        // Roll for party members
        partyMembers.forEach(character => {
            const initiative = this.rollInitiative(character);
            initiativeResults.push({
                type: 'character',
                id: character.id,
                name: character.name,
                initiative: initiative,
                entity: character
            });
        });
        
        // Roll for enemies
        encounter.enemies.forEach(enemy => {
            const initiative = this.rollInitiative(enemy);
            initiativeResults.push({
                type: 'enemy',
                id: enemy.id,
                name: enemy.name,
                initiative: initiative,
                entity: enemy
            });
        });
        
        // Sort by initiative (highest first)
        initiativeResults.sort((a, b) => b.initiative - a.initiative);
        
        // Handle initiative ties (dexterity modifier tiebreaker)
        for (let i = 0; i < initiativeResults.length - 1; i++) {
            if (initiativeResults[i].initiative === initiativeResults[i + 1].initiative) {
                const currentDex = this.getAbilityModifier(initiativeResults[i].entity.abilities.dexterity);
                const nextDex = this.getAbilityModifier(initiativeResults[i + 1].entity.abilities.dexterity);
                
                if (nextDex > currentDex) {
                    // Swap positions
                    [initiativeResults[i], initiativeResults[i + 1]] = 
                    [initiativeResults[i + 1], initiativeResults[i]];
                }
            }
        }
        
        encounter.initiative = new Map(
            initiativeResults.map((result, index) => [result.id, { ...result, order: index }])
        );
        
        console.log(`🎲 Initiative rolled for ${initiativeResults.length} combatants`);
        
        return initiativeResults;
    }

    /**
     * Roll initiative for single combatant
     */
    rollInitiative(combatant) {
        const dexModifier = this.getAbilityModifier(combatant.abilities.dexterity);
        let initiativeBonus = dexModifier;
        
        // Check for initiative-enhancing feats/abilities
        if (combatant.feats) {
            if (combatant.feats.includes('Improved Initiative')) {
                initiativeBonus += this.combatConfig.initiativeBonus.improvedInitiative;
            }
            if (combatant.feats.includes('Superior Initiative')) {
                initiativeBonus += this.combatConfig.initiativeBonus.superior;
            }
        }
        
        // Check for equipment bonuses
        if (combatant.equipmentBonuses && combatant.equipmentBonuses.initiative) {
            initiativeBonus += combatant.equipmentBonuses.initiative;
        }
        
        const roll = this.diceEngine.roll('1d20');
        const totalInitiative = roll.total + initiativeBonus;
        
        return {
            roll: roll.total,
            bonus: initiativeBonus,
            total: totalInitiative
        };
    }

    // ===== COMBAT ROUND MANAGEMENT =====

    /**
     * Start combat encounter
     */
    startCombat(encounter, partyMembers) {
        // Roll initiative
        const initiativeOrder = this.rollInitiativeForAll(encounter, partyMembers);
        
        // Set up combat state
        const combat = {
            id: encounter.id,
            encounter: encounter,
            partyMembers: partyMembers,
            currentRound: 1,
            currentTurn: 0,
            initiativeOrder: initiativeOrder,
            status: 'active',
            startTime: Date.now(),
            combatLog: [],
            turnHistory: []
        };
        
        encounter.status = 'active';
        encounter.startTime = Date.now();
        
        this.activeCombats.set(encounter.id, combat);
        
        this.logCombatEvent(combat, 'combat_started', {
            encounter: encounter.id,
            participants: initiativeOrder.length,
            round: 1
        });
        
        console.log(`⚔️ Combat started: ${encounter.enemies.length} enemies vs ${partyMembers.length} heroes`);
        
        return combat;
    }

    /**
     * Process combat turn
     */
    processCombatTurn(combatId, actions) {
        const combat = this.activeCombats.get(combatId);
        if (!combat) {
            throw new Error(`Combat ${combatId} not found`);
        }
        
        const currentCombatant = combat.initiativeOrder[combat.currentTurn];
        const turnResults = {
            combatantId: currentCombatant.id,
            combatantName: currentCombatant.name,
            round: combat.currentRound,
            turn: combat.currentTurn,
            actions: [],
            effects: [],
            damage: [],
            conditions: []
        };
        
        // Process each action
        for (const action of actions) {
            const actionResult = this.processAction(combat, currentCombatant, action);
            turnResults.actions.push(actionResult);
            
            // Apply effects
            if (actionResult.effects) {
                turnResults.effects.push(...actionResult.effects);
            }
            
            // Apply damage
            if (actionResult.damage) {
                turnResults.damage.push(...actionResult.damage);
            }
        }
        
        // Check for combat end conditions
        const combatStatus = this.checkCombatEndConditions(combat);
        if (combatStatus.ended) {
            return this.endCombat(combat, combatStatus.result);
        }
        
        // Advance to next turn
        this.advanceTurn(combat);
        
        // Record turn in history
        combat.turnHistory.push(turnResults);
        
        this.logCombatEvent(combat, 'turn_completed', turnResults);
        
        return {
            turnResults: turnResults,
            combat: this.getCombatStatus(combat),
            nextCombatant: combat.initiativeOrder[combat.currentTurn]
        };
    }

    /**
     * Process individual action
     */
    processAction(combat, combatant, action) {
        const actionResult = {
            type: action.type,
            success: false,
            roll: null,
            damage: null,
            effects: [],
            description: ''
        };
        
        switch (action.type) {
            case 'attack':
                return this.processAttackAction(combat, combatant, action);
            case 'spell':
                return this.processSpellAction(combat, combatant, action);
            case 'move':
                return this.processMoveAction(combat, combatant, action);
            case 'full_attack':
                return this.processFullAttackAction(combat, combatant, action);
            case 'defensive':
                return this.processDefensiveAction(combat, combatant, action);
            case 'special':
                return this.processSpecialAction(combat, combatant, action);
            default:
                actionResult.description = `Unknown action type: ${action.type}`;
                return actionResult;
        }
    }

    /**
     * Process attack action
     */
    processAttackAction(combat, attacker, action) {
        const target = this.findCombatant(combat, action.targetId);
        if (!target) {
            return {
                type: 'attack',
                success: false,
                description: 'Target not found'
            };
        }
        
        const weapon = action.weapon || this.getPrimaryWeapon(attacker.entity);
        const attackResult = this.resolveAttack(attacker.entity, target.entity, weapon);
        
        // Apply damage if hit
        if (attackResult.hit && attackResult.damage > 0) {
            this.applyDamage(target.entity, attackResult.damage, attackResult.damageType);
        }
        
        // Check for special effects
        if (attackResult.critical) {
            this.processCriticalHitEffects(attacker.entity, target.entity, weapon);
        }
        
        this.logCombatEvent(combat, 'attack', {
            attacker: attacker.name,
            target: target.name,
            weapon: weapon.name,
            hit: attackResult.hit,
            damage: attackResult.damage,
            critical: attackResult.critical
        });
        
        return {
            type: 'attack',
            success: attackResult.hit,
            roll: attackResult.attackRoll,
            damage: attackResult.damage,
            critical: attackResult.critical,
            effects: attackResult.effects || [],
            description: this.formatAttackDescription(attacker, target, attackResult)
        };
    }

    /**
     * Resolve attack mechanics
     */
    resolveAttack(attacker, target, weapon) {
        // Calculate attack bonus
        const attackBonus = this.calculateAttackBonus(attacker, weapon);
        
        // Roll attack
        const attackRoll = this.diceEngine.roll('1d20');
        const totalAttack = attackRoll.total + attackBonus;
        
        // Check for natural 1 (automatic miss) or natural 20 (automatic hit)
        const naturalRoll = attackRoll.total;
        const automaticMiss = naturalRoll === 1;
        const automaticHit = naturalRoll === 20;
        
        // Calculate target AC
        const targetAC = this.calculateArmorClass(target);
        
        // Determine hit/miss
        const hit = automaticHit || (!automaticMiss && totalAttack >= targetAC);
        
        let damage = 0;
        let critical = false;
        let effects = [];
        
        if (hit) {
            // Check for critical threat
            const criticalThreat = this.checkCriticalThreat(naturalRoll, weapon);
            
            if (criticalThreat) {
                // Roll to confirm critical
                const confirmRoll = this.diceEngine.roll('1d20');
                const confirmTotal = confirmRoll.total + attackBonus;
                
                if (confirmTotal >= targetAC) {
                    critical = true;
                }
            }
            
            // Calculate damage
            damage = this.calculateDamage(attacker, weapon, critical);
            
            // Apply weapon special effects
            effects = this.applyWeaponEffects(attacker, target, weapon);
        }
        
        return {
            attackRoll: { roll: naturalRoll, bonus: attackBonus, total: totalAttack },
            targetAC: targetAC,
            hit: hit,
            damage: damage,
            critical: critical,
            effects: effects,
            automaticHit: automaticHit,
            automaticMiss: automaticMiss
        };
    }

    /**
     * Calculate attack bonus
     */
    calculateAttackBonus(attacker, weapon) {
        let attackBonus = 0;
        
        // Base attack bonus
        attackBonus += attacker.baseAttackBonus || 0;
        
        // Ability modifier
        const abilityScore = weapon.weaponType === 'ranged' ? 'dexterity' : 'strength';
        attackBonus += this.getAbilityModifier(attacker.abilities[abilityScore]);
        
        // Weapon enhancement bonus
        if (weapon.enhancement) {
            attackBonus += weapon.enhancement;
        }
        
        // Equipment bonuses
        if (attacker.equipmentBonuses && attacker.equipmentBonuses.attack) {
            attackBonus += attacker.equipmentBonuses.attack;
        }
        
        // Size modifier
        const sizeModifier = this.getSizeModifier(attacker.size || 'Medium');
        attackBonus += sizeModifier;
        
        // Condition modifiers
        const conditionModifiers = this.getConditionModifiers(attacker, 'attack');
        attackBonus += conditionModifiers;
        
        return attackBonus;
    }

    /**
     * Calculate damage
     */
    calculateDamage(attacker, weapon, critical = false) {
        // Roll base weapon damage
        const baseDamage = this.diceEngine.roll(weapon.damage);
        let totalDamage = baseDamage.total;
        
        // Add ability modifier
        const abilityScore = weapon.weaponType === 'ranged' ? 'dexterity' : 'strength';
        const abilityModifier = this.getAbilityModifier(attacker.abilities[abilityScore]);
        
        // Strength bonus applies to melee and thrown weapons
        if (weapon.weaponType === 'melee' || weapon.thrown) {
            totalDamage += abilityModifier;
        }
        
        // Enhancement bonus
        if (weapon.enhancement) {
            totalDamage += weapon.enhancement;
        }
        
        // Equipment bonuses
        if (attacker.equipmentBonuses && attacker.equipmentBonuses.damage) {
            totalDamage += attacker.equipmentBonuses.damage;
        }
        
        // Apply critical multiplier
        if (critical) {
            const multiplier = weapon.criticalMultiplier || 2;
            totalDamage *= multiplier;
        }
        
        // Add weapon special damage (flaming, frost, etc.)
        if (weapon.specialDamage) {
            weapon.specialDamage.forEach(special => {
                const specialDamage = this.diceEngine.roll(special.damage);
                totalDamage += specialDamage.total;
            });
        }
        
        return Math.max(0, Math.floor(totalDamage));
    }

    // ===== SPELL SYSTEM INTEGRATION =====

    /**
     * Process spell casting action
     */
    processSpellAction(combat, caster, action) {
        const spell = action.spell;
        const targets = action.targets || [];
        
        // Validate spell casting
        const castingValidation = this.validateSpellCasting(caster.entity, spell);
        if (!castingValidation.valid) {
            return {
                type: 'spell',
                success: false,
                description: castingValidation.reason
            };
        }
        
        // Check for concentration if needed
        if (spell.requiresConcentration && this.hasConcentrationSpell(caster.entity)) {
            const concentrationCheck = this.rollConcentrationCheck(caster.entity);
            if (!concentrationCheck.success) {
                return {
                    type: 'spell',
                    success: false,
                    description: 'Lost concentration on previous spell',
                    effects: [{ type: 'concentration_lost', spell: concentrationCheck.previousSpell }]
                };
            }
        }
        
        // Consume spell slot
        this.consumeSpellSlot(caster.entity, spell);
        
        // Process spell effects
        const spellResults = this.processSpellEffects(combat, caster.entity, spell, targets);
        
        this.logCombatEvent(combat, 'spell_cast', {
            caster: caster.name,
            spell: spell.name,
            level: spell.level,
            targets: targets.map(t => t.name),
            success: spellResults.success
        });
        
        return {
            type: 'spell',
            success: spellResults.success,
            spell: spell,
            targets: targets,
            effects: spellResults.effects,
            damage: spellResults.damage,
            description: this.formatSpellDescription(caster, spell, spellResults)
        };
    }

    /**
     * Process spell effects on targets
     */
    processSpellEffects(combat, caster, spell, targets) {
        const results = {
            success: true,
            effects: [],
            damage: [],
            healing: [],
            conditions: []
        };
        
        switch (spell.school) {
            case 'Evocation':
                return this.processEvocationSpell(combat, caster, spell, targets);
            case 'Conjuration':
                return this.processConjurationSpell(combat, caster, spell, targets);
            case 'Enchantment':
                return this.processEnchantmentSpell(combat, caster, spell, targets);
            case 'Illusion':
                return this.processIllusionSpell(combat, caster, spell, targets);
            case 'Necromancy':
                return this.processNecromancySpell(combat, caster, spell, targets);
            case 'Transmutation':
                return this.processTransmutationSpell(combat, caster, spell, targets);
            case 'Abjuration':
                return this.processAbjurationSpell(combat, caster, spell, targets);
            case 'Divination':
                return this.processDivinationSpell(combat, caster, spell, targets);
            default:
                return this.processGenericSpell(combat, caster, spell, targets);
        }
    }

    // ===== COMBAT STATUS MANAGEMENT =====

    /**
     * Check if combat should end
     */
    checkCombatEndConditions(combat) {
        const partyDefeated = combat.partyMembers.every(member => 
            member.hitPoints.current <= 0 || member.status === 'unconscious'
        );
        
        const enemiesDefeated = combat.encounter.enemies.every(enemy => 
            enemy.hitPoints.current <= 0 || enemy.status === 'defeated'
        );
        
        if (partyDefeated) {
            return { ended: true, result: 'defeat' };
        } else if (enemiesDefeated) {
            return { ended: true, result: 'victory' };
        }
        
        // Check for special conditions (retreat, surrender, etc.)
        if (combat.encounter.specialEndConditions) {
            const specialEnd = this.checkSpecialEndConditions(combat);
            if (specialEnd.ended) {
                return specialEnd;
            }
        }
        
        return { ended: false };
    }

    /**
     * End combat encounter
     */
    endCombat(combat, result) {
        combat.status = 'completed';
        combat.result = result;
        combat.endTime = Date.now();
        combat.encounter.endTime = Date.now();
        
        // Calculate experience points
        const experienceAwarded = this.calculateExperienceReward(combat, result);
        
        // Calculate treasure
        const treasureAwarded = this.generateCombatTreasure(combat, result);
        
        // Update adventure state
        this.updateAdventureFromCombat(combat, result);
        
        // Move from active to history
        this.activeCombats.delete(combat.id);
        this.combatHistory.push(combat);
        
        this.logCombatEvent(combat, 'combat_ended', {
            result: result,
            duration: combat.endTime - combat.startTime,
            rounds: combat.currentRound,
            experience: experienceAwarded,
            treasure: treasureAwarded
        });
        
        console.log(`⚔️ Combat ended: ${result} after ${combat.currentRound} rounds`);
        
        return {
            result: result,
            combat: combat,
            experience: experienceAwarded,
            treasure: treasureAwarded,
            duration: combat.endTime - combat.startTime
        };
    }

    // ===== UTILITY METHODS =====

    /**
     * Get ability modifier
     */
    getAbilityModifier(abilityScore) {
        return Math.floor((abilityScore - 10) / 2);
    }

    /**
     * Generate encounter ID
     */
    generateEncounterId() {
        return `encounter_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    }

    /**
     * Log combat event
     */
    logCombatEvent(combat, eventType, data) {
        const event = {
            type: eventType,
            timestamp: Date.now(),
            round: combat.currentRound,
            turn: combat.currentTurn,
            data: data
        };
        
        combat.combatLog.push(event);
    }

    /**
     * Get combat status summary
     */
    getCombatStatus(combat) {
        return {
            id: combat.id,
            status: combat.status,
            currentRound: combat.currentRound,
            currentTurn: combat.currentTurn,
            currentCombatant: combat.initiativeOrder[combat.currentTurn],
            partyStatus: combat.partyMembers.map(member => ({
                id: member.id,
                name: member.name,
                hitPoints: member.hitPoints,
                conditions: member.conditions || [],
                status: member.status || 'active'
            })),
            enemyStatus: combat.encounter.enemies.map(enemy => ({
                id: enemy.id,
                name: enemy.name,
                hitPoints: enemy.hitPoints,
                conditions: enemy.conditions || [],
                status: enemy.status || 'active'
            })),
            roundsElapsed: combat.currentRound,
            timeElapsed: Date.now() - combat.startTime
        };
    }

    /**
     * Apply damage to combatant
     */
    applyDamage(target, damage, damageType = 'physical') {
        // Apply damage reduction if applicable
        const actualDamage = this.calculateActualDamage(target, damage, damageType);
        
        target.hitPoints.current -= actualDamage;
        
        // Check for unconsciousness/death
        if (target.hitPoints.current <= 0) {
            if (target.hitPoints.current <= -10) {
                target.status = 'dead';
            } else {
                target.status = 'unconscious';
            }
        }
        
        return actualDamage;
    }

    /**
     * Advance to next turn
     */
    advanceTurn(combat) {
        combat.currentTurn++;
        
        if (combat.currentTurn >= combat.initiativeOrder.length) {
            combat.currentTurn = 0;
            combat.currentRound++;
            
            // Process end-of-round effects
            this.processEndOfRoundEffects(combat);
        }
        
        // Reset action economy for current combatant
        const currentCombatant = combat.initiativeOrder[combat.currentTurn];
        if (currentCombatant.entity.actionsTaken) {
            currentCombatant.entity.actionsTaken = {
                move: false,
                standard: false,
                swift: false,
                full: false
            };
        }
    }

    /**
     * Update adventure state from combat results
     */
    updateAdventureFromCombat(combat, result) {
        const adventure = this.adventureEngine.getActiveAdventure(combat.encounter.adventureId);
        if (!adventure) return;
        
        // Update adventure progress
        adventure.combatEncounters = adventure.combatEncounters || [];
        adventure.combatEncounters.push({
            encounterId: combat.id,
            result: result,
            experience: this.calculateExperienceReward(combat, result),
            duration: combat.endTime - combat.startTime
        });
        
        // Update story progression based on combat outcome
        if (result === 'victory') {
            this.adventureEngine.progressAdventureStory(adventure.id, 'combat_victory', {
                encounterType: combat.encounter.difficulty,
                enemiesDefeated: combat.encounter.enemies.length
            });
        } else if (result === 'defeat') {
            this.adventureEngine.progressAdventureStory(adventure.id, 'combat_defeat', {
                encounterType: combat.encounter.difficulty
            });
        }
    }

    /**
     * Get active combat by ID
     */
    getActiveCombat(combatId) {
        return this.activeCombats.get(combatId);
    }

    /**
     * Get all active combats
     */
    getAllActiveCombats() {
        return Array.from(this.activeCombats.values());
    }
}

// Global export for both browser and Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CombatIntegration;
} else if (typeof window !== 'undefined') {
    window.CombatIntegration = CombatIntegration;
}
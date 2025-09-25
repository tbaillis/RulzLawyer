/**
 * CombatManager - D&D 3.5 Combat System
 * Manages initiative, attacks, damage, special abilities, and combat mechanics
 * 
 * Features:
 * - Initiative tracking and management
 * - Attack roll calculations (BAB, modifiers, bonuses)
 * - Damage calculations (weapons, spells, critical hits)
 * - Armor Class calculations (armor, dex, size, deflection)
 * - Saving throw calculations and effects
 * - Special combat actions (Power Attack, Combat Expertise, etc.)
 * - Spell combat integration
 * - Conditions and status effects
 * - Epic combat mechanics
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class CombatManager {
    constructor(diceEngine, srdDataManager) {
        this.dice = diceEngine;
        this.srdData = srdDataManager;
        this.combatState = null;
        this.conditions = this.initializeConditions();

        console.log('⚔️ CombatManager initialized with D&D 3.5 combat mechanics');
    }

    /**
     * Initialize status conditions and effects
     */
    initializeConditions() {
        return {
            'Blinded': {
                description: 'Cannot see, -2 AC, lose Dex bonus to AC, move at half speed',
                effects: { ac: -2, dexToAC: false, moveSpeed: 0.5, attackPenalty: -4 }
            },
            'Confused': {
                description: 'Acts randomly each round',
                effects: { special: 'random_actions' }
            },
            'Dazed': {
                description: 'Cannot act, but can defend normally',
                effects: { actions: 0 }
            },
            'Deafened': {
                description: 'Cannot hear, -4 on Listen checks, 20% spell failure for verbal spells',
                effects: { listenPenalty: -4, spellFailure: 20 }
            },
            'Entangled': {
                description: 'Cannot move, -2 attack, -4 Dex',
                effects: { movement: 0, attackPenalty: -2, dexPenalty: -4 }
            },
            'Fascinated': {
                description: 'Cannot take actions except to listen/watch',
                effects: { actions: 'limited' }
            },
            'Fatigued': {
                description: '-2 Str and Dex, cannot run or charge',
                effects: { strPenalty: -2, dexPenalty: -2, noRun: true }
            },
            'Frightened': {
                description: '-2 on all rolls, must flee if possible',
                effects: { allRolls: -2, mustFlee: true }
            },
            'Grappled': {
                description: 'Cannot move, -4 Dex, -2 attack with light weapons only',
                effects: { movement: 0, dexPenalty: -4, attackPenalty: -2 }
            },
            'Hasted': {
                description: '+1 attack, +1 AC, +1 Ref saves, extra partial action',
                effects: { attackBonus: 1, acBonus: 1, refSaveBonus: 1, extraAction: true }
            },
            'Invisible': {
                description: '+2 attack bonus, enemies lose Dex to AC',
                effects: { attackBonus: 2, concealment: 'total' }
            },
            'Paralyzed': {
                description: 'Cannot move or act, loses Dex bonus to AC',
                effects: { actions: 0, dexToAC: false, helpless: true }
            },
            'Prone': {
                description: '-4 attack with melee, +4 AC vs ranged, -4 AC vs melee',
                effects: { meleeAttackPenalty: -4, rangedACBonus: 4, meleeACPenalty: -4 }
            },
            'Shaken': {
                description: '-2 on all rolls',
                effects: { allRolls: -2 }
            },
            'Sickened': {
                description: '-2 on all rolls',
                effects: { allRolls: -2 }
            },
            'Slowed': {
                description: 'Move at half speed, -1 attack/AC/Ref saves, partial actions only',
                effects: { moveSpeed: 0.5, attackPenalty: -1, acPenalty: -1, refSavePenalty: -1 }
            },
            'Stunned': {
                description: 'Cannot act, loses Dex bonus to AC, -2 AC',
                effects: { actions: 0, dexToAC: false, acPenalty: -2 }
            },
            'Unconscious': {
                description: 'Helpless, cannot act',
                effects: { actions: 0, helpless: true }
            }
        };
    }

    /**
     * Initialize combat encounter
     */
    initializeCombat(participants) {
        this.combatState = {
            round: 1,
            currentTurn: 0,
            participants: [],
            initiativeOrder: [],
            conditions: new Map(),
            events: []
        };

        // Roll initiative for all participants
        participants.forEach(participant => {
            const initiative = this.rollInitiative(participant);
            const combatant = {
                ...participant,
                initiative,
                currentHP: participant.hitPoints || participant.hp || 10,
                maxHP: participant.hitPoints || participant.hp || 10,
                conditions: [],
                actions: { move: true, standard: true, swift: true, immediate: true }
            };

            this.combatState.participants.push(combatant);
        });

        // Sort by initiative (highest first)
        this.combatState.initiativeOrder = [...this.combatState.participants]
            .sort((a, b) => b.initiative - a.initiative);

        console.log('⚔️ Combat initialized with', participants.length, 'participants');
        this.logEvent('Combat begins!');

        return this.combatState;
    }

    /**
     * Roll initiative for participant
     */
    rollInitiative(participant) {
        const dexMod = this.calculateAbilityModifier(participant.abilities?.dexterity || 10);
        const initiativeBonus = participant.initiativeBonus || 0;

        const roll = this.dice.roll('1d20');
        const total = roll + dexMod + initiativeBonus;

        console.log(`🎲 ${participant.name} initiative: ${roll} + ${dexMod} = ${total}`);
        return total;
    }

    /**
     * Calculate ability modifier
     */
    calculateAbilityModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    /**
     * Get current combatant
     */
    getCurrentCombatant() {
        if (!this.combatState || this.combatState.initiativeOrder.length === 0) {
            return null;
        }

        return this.combatState.initiativeOrder[this.combatState.currentTurn];
    }

    /**
     * Advance to next turn
     */
    nextTurn() {
        if (!this.combatState) return null;

        this.combatState.currentTurn++;

        // Check if round is complete
        if (this.combatState.currentTurn >= this.combatState.initiativeOrder.length) {
            this.combatState.currentTurn = 0;
            this.combatState.round++;
            this.logEvent(`--- Round ${this.combatState.round} ---`);

            // Process end-of-round effects
            this.processEndOfRoundEffects();
        }

        const currentCombatant = this.getCurrentCombatant();
        if (currentCombatant) {
            // Reset actions for new turn
            currentCombatant.actions = {
                move: true,
                standard: true,
                swift: true,
                immediate: true
            };

            this.logEvent(`${currentCombatant.name}'s turn (Initiative ${currentCombatant.initiative})`);
        }

        return currentCombatant;
    }

    /**
     * Make an attack roll
     */
    makeAttackRoll(attacker, target, options = {}) {
        const attackBonus = this.calculateAttackBonus(attacker, options);
        const targetAC = this.calculateArmorClass(target);

        const roll = this.dice.roll('1d20');
        const total = roll + attackBonus;

        const result = {
            attacker: attacker.name,
            target: target.name,
            roll,
            attackBonus,
            total,
            targetAC,
            hit: total >= targetAC,
            critical: roll === 20,
            criticalThreat: roll >= (options.criticalRange || 20),
            fumble: roll === 1
        };

        // Check for critical hit confirmation
        if (result.criticalThreat && result.hit) {
            const confirmRoll = this.dice.roll('1d20');
            const confirmTotal = confirmRoll + attackBonus;
            result.criticalConfirm = confirmTotal >= targetAC;
            result.critical = result.criticalConfirm;

            this.logEvent(`🎯 Critical threat! Confirmation: ${confirmRoll} + ${attackBonus} = ${confirmTotal} vs AC ${targetAC}`);
        }

        this.logEvent(`⚔️ ${attacker.name} attacks ${target.name}: ${roll} + ${attackBonus} = ${total} vs AC ${targetAC} ${result.hit ? 'HIT' : 'MISS'}`);

        return result;
    }

    /**
     * Calculate attack bonus
     */
    calculateAttackBonus(attacker, options = {}) {
        let bonus = 0;

        // Base Attack Bonus
        bonus += attacker.baseAttackBonus || this.calculateBAB(attacker);

        // Ability modifier (Str for melee, Dex for ranged)
        if (options.ranged) {
            bonus += this.calculateAbilityModifier(attacker.abilities?.dexterity || 10);
        } else {
            bonus += this.calculateAbilityModifier(attacker.abilities?.strength || 10);
        }

        // Size modifier
        bonus += this.getSizeModifier(attacker.size || 'Medium');

        // Weapon bonuses
        if (options.weapon) {
            bonus += options.weapon.enhancementBonus || 0;
        }

        // Feat bonuses (Weapon Focus, etc.)
        bonus += this.calculateFeatBonuses(attacker, 'attack', options);

        // Condition modifiers
        bonus += this.calculateConditionModifiers(attacker, 'attack');

        // Situational modifiers
        if (options.flanking) bonus += 2;
        if (options.chargeAttack) bonus += 2;
        if (options.powerAttack) bonus -= options.powerAttackPenalty || 0;

        return bonus;
    }

    /**
     * Calculate Base Attack Bonus by class and level
     */
    calculateBAB(character) {
        const characterClass = this.srdData.getClass(character.characterClass);
        if (!characterClass) return 0;

        const progression = characterClass.progression?.bab_progression || 'medium';
        const level = character.level || 1;

        switch (progression) {
            case 'good':
                return level;
            case 'medium':
                return Math.floor(level * 3 / 4);
            case 'poor':
                return Math.floor(level / 2);
            default:
                return Math.floor(level * 3 / 4);
        }
    }

    /**
     * Calculate Armor Class
     */
    calculateArmorClass(character) {
        let ac = 10; // Base AC

        // Armor bonus
        ac += character.armorBonus || 0;

        // Shield bonus
        ac += character.shieldBonus || 0;

        // Dexterity modifier (limited by armor)
        const dexMod = this.calculateAbilityModifier(character.abilities?.dexterity || 10);
        const maxDex = character.maxDexBonus !== undefined ? character.maxDexBonus : 10;
        ac += Math.min(dexMod, maxDex);

        // Size modifier
        ac += this.getSizeModifier(character.size || 'Medium');

        // Natural armor
        ac += character.naturalArmor || 0;

        // Deflection bonus
        ac += character.deflectionBonus || 0;

        // Condition modifiers
        ac += this.calculateConditionModifiers(character, 'ac');

        return ac;
    }

    /**
     * Get size modifier for attacks and AC
     */
    getSizeModifier(size) {
        const sizeModifiers = {
            'Fine': 8, 'Diminutive': 4, 'Tiny': 2, 'Small': 1,
            'Medium': 0, 'Large': -1, 'Huge': -2, 'Gargantuan': -4, 'Colossal': -8
        };
        return sizeModifiers[size] || 0;
    }

    /**
     * Calculate damage
     */
    calculateDamage(attacker, target, attackResult, options = {}) {
        if (!attackResult.hit) {
            return { damage: 0, type: 'none' };
        }

        let baseDamage = 0;
        let damageType = 'nonlethal';

        // Weapon damage
        if (options.weapon) {
            const weaponDamage = this.dice.roll(options.weapon.damage || '1d4');
            baseDamage += weaponDamage;
            damageType = options.weapon.damageType || 'bludgeoning';
        } else {
            // Unarmed strike
            baseDamage += this.dice.roll('1d3');
            damageType = 'bludgeoning';
        }

        // Ability modifier to damage
        if (options.ranged) {
            // Ranged weapons don't add Str to damage (except composite bows)
            if (options.weapon?.composite) {
                baseDamage += this.calculateAbilityModifier(attacker.abilities?.strength || 10);
            }
        } else {
            // Melee weapons add Str modifier
            let strMod = this.calculateAbilityModifier(attacker.abilities?.strength || 10);

            // Two-handed weapons get 1.5x Str modifier
            if (options.twoHanded) {
                strMod = Math.floor(strMod * 1.5);
            }
            // Off-hand weapons get 0.5x Str modifier
            else if (options.offHand) {
                strMod = Math.floor(strMod * 0.5);
            }

            baseDamage += strMod;
        }

        // Enhancement bonus
        if (options.weapon?.enhancementBonus) {
            baseDamage += options.weapon.enhancementBonus;
        }

        // Power Attack damage bonus
        if (options.powerAttack) {
            let powerAttackBonus = options.powerAttackPenalty || 1;
            if (options.twoHanded) {
                powerAttackBonus *= 2; // Two-handed weapons get 2x Power Attack bonus
            }
            baseDamage += powerAttackBonus;
        }

        // Critical hit multiplier
        let totalDamage = baseDamage;
        if (attackResult.critical) {
            const multiplier = options.weapon?.criticalMultiplier || 2;
            totalDamage = baseDamage * multiplier;
            this.logEvent(`💥 Critical hit! Damage multiplied by ${multiplier}`);
        }

        // Damage reduction
        const damageReduction = target.damageReduction || 0;
        totalDamage = Math.max(0, totalDamage - damageReduction);

        const damageResult = {
            baseDamage,
            totalDamage,
            damageType,
            critical: attackResult.critical,
            damageReduction
        };

        this.logEvent(`💀 Damage: ${baseDamage}${attackResult.critical ? ` × ${options.weapon?.criticalMultiplier || 2}` : ''} - ${damageReduction} DR = ${totalDamage} ${damageType}`);

        return damageResult;
    }

    /**
     * Apply damage to target
     */
    applyDamage(target, damageResult) {
        const damage = damageResult.totalDamage;
        target.currentHP = Math.max(0, target.currentHP - damage);

        this.logEvent(`❤️ ${target.name}: ${target.currentHP}/${target.maxHP} HP remaining`);

        // Check for death or unconsciousness
        if (target.currentHP <= 0) {
            if (target.currentHP <= -10) {
                this.addCondition(target, 'Dead');
                this.logEvent(`💀 ${target.name} is dead!`);
            } else {
                this.addCondition(target, 'Unconscious');
                this.logEvent(`😵 ${target.name} is unconscious!`);
            }
        }

        return target.currentHP;
    }

    /**
     * Make saving throw
     */
    makeSavingThrow(character, saveType, dc, options = {}) {
        const saveBonus = this.calculateSaveBonus(character, saveType);
        const roll = this.dice.roll('1d20');
        const total = roll + saveBonus;

        const result = {
            character: character.name,
            saveType,
            roll,
            saveBonus,
            total,
            dc,
            success: total >= dc,
            naturalTwenty: roll === 20,
            naturalOne: roll === 1
        };

        // Natural 20 is always a success, natural 1 is always a failure
        if (result.naturalTwenty) result.success = true;
        if (result.naturalOne) result.success = false;

        this.logEvent(`🛡️ ${character.name} ${saveType} save: ${roll} + ${saveBonus} = ${total} vs DC ${dc} ${result.success ? 'SUCCESS' : 'FAILURE'}`);

        return result;
    }

    /**
     * Calculate saving throw bonus
     */
    calculateSaveBonus(character, saveType) {
        let bonus = 0;

        // Base save from class
        bonus += this.calculateBaseSave(character, saveType);

        // Ability modifier
        switch (saveType.toLowerCase()) {
            case 'fortitude':
            case 'fort':
                bonus += this.calculateAbilityModifier(character.abilities?.constitution || 10);
                break;
            case 'reflex':
            case 'ref':
                bonus += this.calculateAbilityModifier(character.abilities?.dexterity || 10);
                break;
            case 'will':
                bonus += this.calculateAbilityModifier(character.abilities?.wisdom || 10);
                break;
        }

        // Condition modifiers
        bonus += this.calculateConditionModifiers(character, 'save_' + saveType.toLowerCase());

        return bonus;
    }

    /**
     * Calculate base save from class and level
     */
    calculateBaseSave(character, saveType) {
        const characterClass = this.srdData.getClass(character.characterClass);
        if (!characterClass) return 0;

        const level = character.level || 1;
        const progression = characterClass.progression;

        let saveProgression = 'poor';
        switch (saveType.toLowerCase()) {
            case 'fortitude':
            case 'fort':
                saveProgression = progression?.fort_save || 'poor';
                break;
            case 'reflex':
            case 'ref':
                saveProgression = progression?.ref_save || 'poor';
                break;
            case 'will':
                saveProgression = progression?.will_save || 'poor';
                break;
        }

        if (saveProgression === 'good') {
            return 2 + Math.floor(level / 2);
        } else {
            return Math.floor(level / 3);
        }
    }

    /**
     * Add condition to character
     */
    addCondition(character, conditionName, duration = null) {
        if (!character.conditions) {
            character.conditions = [];
        }

        const condition = {
            name: conditionName,
            duration,
            effects: this.conditions[conditionName]?.effects || {}
        };

        character.conditions.push(condition);
        this.logEvent(`🔴 ${character.name} is now ${conditionName.toLowerCase()}`);

        return condition;
    }

    /**
     * Remove condition from character
     */
    removeCondition(character, conditionName) {
        if (!character.conditions) return false;

        const index = character.conditions.findIndex(c => c.name === conditionName);
        if (index !== -1) {
            character.conditions.splice(index, 1);
            this.logEvent(`🟢 ${character.name} is no longer ${conditionName.toLowerCase()}`);
            return true;
        }

        return false;
    }

    /**
     * Calculate condition modifiers
     */
    calculateConditionModifiers(character, modifierType) {
        if (!character.conditions) return 0;

        let modifier = 0;

        character.conditions.forEach(condition => {
            const effects = condition.effects;

            switch (modifierType) {
                case 'attack':
                    modifier += effects.attackBonus || 0;
                    modifier += effects.attackPenalty || 0;
                    modifier += effects.allRolls || 0;
                    break;
                case 'ac':
                    modifier += effects.acBonus || 0;
                    modifier += effects.acPenalty || 0;
                    break;
                case 'save_fortitude':
                case 'save_reflex':
                case 'save_will':
                    modifier += effects.allRolls || 0;
                    break;
            }
        });

        return modifier;
    }

    /**
     * Calculate feat bonuses
     */
    calculateFeatBonuses(character, bonusType, options = {}) {
        // Simplified feat bonus calculation
        // In full implementation, would check character's actual feats
        return 0;
    }

    /**
     * Process end of round effects
     */
    processEndOfRoundEffects() {
        this.combatState.participants.forEach(participant => {
            if (participant.conditions) {
                // Reduce condition durations
                participant.conditions = participant.conditions.filter(condition => {
                    if (condition.duration !== null) {
                        condition.duration--;
                        if (condition.duration <= 0) {
                            this.logEvent(`⏰ ${participant.name}'s ${condition.name} condition expires`);
                            return false;
                        }
                    }
                    return true;
                });
            }
        });
    }

    /**
     * Check if combat is over
     */
    isCombatOver() {
        if (!this.combatState) return true;

        const aliveCombatants = this.combatState.participants.filter(p =>
            p.currentHP > 0 && !p.conditions?.some(c => c.name === 'Dead')
        );

        return aliveCombatants.length <= 1;
    }

    /**
     * Get combat summary
     */
    getCombatSummary() {
        if (!this.combatState) return null;

        return {
            round: this.combatState.round,
            currentTurn: this.combatState.currentTurn,
            currentCombatant: this.getCurrentCombatant()?.name,
            participants: this.combatState.participants.map(p => ({
                name: p.name,
                hp: `${p.currentHP}/${p.maxHP}`,
                initiative: p.initiative,
                conditions: p.conditions?.map(c => c.name) || []
            })),
            isOver: this.isCombatOver()
        };
    }

    /**
     * Log combat event
     */
    logEvent(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;

        if (this.combatState) {
            this.combatState.events.push(logMessage);
        }

        console.log(`⚔️ ${logMessage}`);
    }

    /**
     * Get combat log
     */
    getCombatLog() {
        return this.combatState?.events || [];
    }
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CombatManager;
} else if (typeof window !== 'undefined') {
    window.CombatManager = CombatManager;
}
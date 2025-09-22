/**
 * AdvancedDiceEngine - Enhanced D&D 3.5 Dice System with Character Integration
 * Provides comprehensive dice rolling with automatic character modifiers
 */

class AdvancedDiceEngine {
    constructor() {
        this.rollHistory = [];
        this.maxHistorySize = 100;
        this.advantageSystem = true; // Enable 5e-style advantage/disadvantage for modern play
        this.initialize();
    }

    initialize() {
        this.setupBasicDice();
        this.setupD20System();
        this.setupDamageSystem();
        this.setupSkillSystem();
        this.setupSavingThrowSystem();
        this.setupAttackSystem();
        this.setupSpellSystem();
        console.log('🎲 AdvancedDiceEngine initialized successfully');
    }

    // ==================== BASIC DICE SYSTEM ====================

    setupBasicDice() {
        this.diceTypes = [4, 6, 8, 10, 12, 20, 100];
        this.standardDice = {
            'd4': 4, 'd6': 6, 'd8': 8, 'd10': 10, 'd12': 12, 'd20': 20, 'd100': 100,
            'percentile': 100
        };
    }

    rollDice(sides, count = 1, modifier = 0, label = '') {
        if (count <= 0) return { rolls: [], total: 0, expression: '', label };

        const rolls = [];
        for (let i = 0; i < count; i++) {
            rolls.push(Math.floor(Math.random() * sides) + 1);
        }

        const rollTotal = rolls.reduce((sum, roll) => sum + roll, 0);
        const total = rollTotal + modifier;

        const expression = this.formatExpression(count, sides, modifier, rolls, total);
        
        const result = {
            rolls,
            modifier,
            rollTotal,
            total,
            expression,
            label,
            timestamp: Date.now(),
            type: 'basic'
        };

        this.addToHistory(result);
        return result;
    }

    formatExpression(count, sides, modifier, rolls, total) {
        let expression = `${count}d${sides}`;
        if (modifier !== 0) {
            expression += modifier >= 0 ? `+${modifier}` : `${modifier}`;
        }
        expression += ` [${rolls.join(', ')}]`;
        if (modifier !== 0) {
            expression += ` = ${total}`;
        }
        return expression;
    }

    // ==================== D20 SYSTEM ====================

    setupD20System() {
        this.d20Mechanics = {
            naturalCritical: 20,
            naturalFumble: 1,
            confirmCritical: true,
            threatRange: { default: 20 }, // Can be modified by weapons
            criticalMultiplier: { default: 2 }
        };
    }

    rollD20(modifier = 0, advantage = null, label = '') {
        let rolls = [Math.floor(Math.random() * 20) + 1];
        let rollType = 'normal';

        // Handle advantage/disadvantage system
        if (advantage === true) {
            rolls.push(Math.floor(Math.random() * 20) + 1);
            rollType = 'advantage';
        } else if (advantage === false) {
            rolls.push(Math.floor(Math.random() * 20) + 1);
            rollType = 'disadvantage';
        }

        let selectedRoll;
        if (rollType === 'advantage') {
            selectedRoll = Math.max(...rolls);
        } else if (rollType === 'disadvantage') {
            selectedRoll = Math.min(...rolls);
        } else {
            selectedRoll = rolls[0];
        }

        const total = selectedRoll + modifier;
        const isNatural20 = selectedRoll === 20;
        const isNatural1 = selectedRoll === 1;

        const result = {
            rolls,
            selectedRoll,
            modifier,
            total,
            rollType,
            isNatural20,
            isNatural1,
            label,
            expression: this.formatD20Expression(rolls, selectedRoll, modifier, total, rollType),
            timestamp: Date.now(),
            type: 'd20'
        };

        this.addToHistory(result);
        return result;
    }

    formatD20Expression(rolls, selectedRoll, modifier, total, rollType) {
        let expression = 'd20';
        if (rollType !== 'normal') {
            expression += ` (${rollType})`;
        }
        if (modifier !== 0) {
            expression += modifier >= 0 ? `+${modifier}` : `${modifier}`;
        }
        
        if (rollType === 'normal') {
            expression += ` [${selectedRoll}]`;
        } else {
            expression += ` [${rolls.join(', ')} → ${selectedRoll}]`;
        }
        
        expression += ` = ${total}`;
        return expression;
    }

    // ==================== CHARACTER-INTEGRATED ROLLING ====================

    rollAttack(character, weapon, targetAC = null, options = {}) {
        if (!character) {
            return this.rollD20(0, null, 'Attack Roll (No Character)');
        }

        const attackBonus = this.calculateAttackBonus(character, weapon);
        const advantage = options.advantage || null;
        
        const result = this.rollD20(attackBonus, advantage, `Attack: ${weapon?.name || 'Unarmed'}`);
        
        // Check if attack hits
        if (targetAC) {
            result.hits = result.total >= targetAC;
            result.targetAC = targetAC;
            result.label += ` vs AC ${targetAC} (${result.hits ? 'HIT' : 'MISS'})`;
        }

        // Check for critical threat
        const threatRange = weapon?.criticalThreat || 20;
        result.isCriticalThreat = result.selectedRoll >= threatRange;
        
        if (result.isCriticalThreat && this.d20Mechanics.confirmCritical) {
            result.criticalConfirmation = this.rollD20(attackBonus, advantage, 'Critical Confirmation');
            result.isCriticalHit = targetAC ? result.criticalConfirmation.total >= targetAC : false;
        }

        result.type = 'attack';
        this.addToHistory(result);
        return result;
    }

    rollDamage(character, weapon, isCritical = false, options = {}) {
        if (!weapon) {
            return this.rollDice(4, 1, 0, 'Unarmed Damage');
        }

        const baseDamage = this.parseDiceExpression(weapon.damage);
        const damageBonus = this.calculateDamageBonus(character, weapon);
        
        let totalDamage = 0;
        let rolls = [];
        let expression = '';

        // Roll base damage (potentially multiple times for critical)
        const criticalMultiplier = weapon.criticalMultiplier || 2;
        const diceRollCount = isCritical ? criticalMultiplier : 1;
        
        for (let i = 0; i < diceRollCount; i++) {
            const damageRoll = this.rollDice(baseDamage.sides, baseDamage.count, 0, '');
            rolls.push(...damageRoll.rolls);
            totalDamage += damageRoll.rollTotal;
        }

        // Add damage bonus (only once, even on critical)
        totalDamage += damageBonus;

        expression = `${weapon.damage}`;
        if (isCritical) {
            expression += ` x${criticalMultiplier}`;
        }
        if (damageBonus !== 0) {
            expression += damageBonus >= 0 ? `+${damageBonus}` : `${damageBonus}`;
        }
        expression += ` [${rolls.join(', ')}]`;
        if (damageBonus !== 0) {
            expression += ` = ${totalDamage}`;
        }

        const result = {
            rolls,
            modifier: damageBonus,
            total: totalDamage,
            isCritical,
            weapon: weapon.name,
            expression,
            label: `${weapon.name} Damage${isCritical ? ' (CRITICAL)' : ''}`,
            timestamp: Date.now(),
            type: 'damage'
        };

        this.addToHistory(result);
        return result;
    }

    rollSkillCheck(character, skillName, modifier = 0, advantage = null) {
        if (!character || !character.skills) {
            return this.rollD20(modifier, advantage, `${skillName} Check`);
        }

        const skill = character.skills.find(s => s.name === skillName);
        const skillModifier = skill ? skill.totalModifier : 0;
        const totalModifier = skillModifier + modifier;

        const result = this.rollD20(totalModifier, advantage, `${skillName} Check`);
        result.skillModifier = skillModifier;
        result.additionalModifier = modifier;
        result.type = 'skill';
        
        this.addToHistory(result);
        return result;
    }

    rollSavingThrow(character, saveType, modifier = 0, advantage = null) {
        if (!character || !character.saves) {
            return this.rollD20(modifier, advantage, `${saveType} Save`);
        }

        const saveModifier = character.saves[saveType.toLowerCase()] || 0;
        const totalModifier = saveModifier + modifier;

        const result = this.rollD20(totalModifier, advantage, `${saveType} Save`);
        result.saveModifier = saveModifier;
        result.additionalModifier = modifier;
        result.type = 'save';
        
        this.addToHistory(result);
        return result;
    }

    rollInitiative(character, modifier = 0) {
        if (!character) {
            return this.rollD20(modifier, null, 'Initiative');
        }

        const dexModifier = this.getAbilityModifier(character.abilities?.dexterity || 10);
        const improvedInitiative = character.feats?.some(f => f.name === 'Improved Initiative') ? 4 : 0;
        const totalModifier = dexModifier + improvedInitiative + modifier;

        const result = this.rollD20(totalModifier, null, 'Initiative');
        result.dexterityModifier = dexModifier;
        result.improvedInitiative = improvedInitiative;
        result.additionalModifier = modifier;
        result.type = 'initiative';
        
        this.addToHistory(result);
        return result;
    }

    // ==================== SPELL INTEGRATION ====================

    setupSpellSystem() {
        this.spellDamageTypes = {
            'fire': { color: '#ff4444', icon: '🔥' },
            'cold': { color: '#4488ff', icon: '❄️' },
            'lightning': { color: '#ffff44', icon: '⚡' },
            'acid': { color: '#44ff44', icon: '🧪' },
            'sonic': { color: '#ff44ff', icon: '🔊' },
            'force': { color: '#8844ff', icon: '✨' }
        };
    }

    rollSpellDamage(character, spell, casterLevel = null, options = {}) {
        if (!spell || !spell.damage) {
            return { error: 'No spell damage information available' };
        }

        const effectiveCasterLevel = casterLevel || character?.level || 1;
        const damage = this.calculateSpellDamage(spell, effectiveCasterLevel);
        
        const result = this.rollDice(damage.sides, damage.count, damage.modifier, 
                                    `${spell.name} Damage (CL ${effectiveCasterLevel})`);
        
        result.spell = spell.name;
        result.casterLevel = effectiveCasterLevel;
        result.damageType = spell.damageType || 'untyped';
        result.type = 'spell';
        
        this.addToHistory(result);
        return result;
    }

    rollSpellAttack(character, spell, targetAC = null, options = {}) {
        if (!character) {
            return this.rollD20(0, null, `${spell?.name || 'Spell'} Attack`);
        }

        const spellAttackBonus = this.calculateSpellAttackBonus(character);
        const advantage = options.advantage || null;
        
        const result = this.rollD20(spellAttackBonus, advantage, `${spell?.name || 'Spell'} Attack`);
        
        if (targetAC) {
            result.hits = result.total >= targetAC;
            result.targetAC = targetAC;
            result.label += ` vs AC ${targetAC} (${result.hits ? 'HIT' : 'MISS'})`;
        }

        result.spell = spell?.name;
        result.type = 'spell-attack';
        
        this.addToHistory(result);
        return result;
    }

    // ==================== CALCULATION HELPERS ====================

    calculateAttackBonus(character, weapon) {
        if (!character) return 0;

        const baseAttackBonus = character.baseAttackBonus || 0;
        const abilityModifier = weapon?.finesse && character.abilities?.dexterity > character.abilities?.strength
            ? this.getAbilityModifier(character.abilities.dexterity)
            : this.getAbilityModifier(character.abilities?.strength || 10);
        
        const weaponBonus = weapon?.enhancementBonus || 0;
        const miscBonus = 0; // TODO: Calculate misc bonuses from feats/effects
        
        return baseAttackBonus + abilityModifier + weaponBonus + miscBonus;
    }

    calculateDamageBonus(character, weapon) {
        if (!character) return 0;

        const abilityModifier = weapon?.finesse && character.abilities?.dexterity > character.abilities?.strength
            ? this.getAbilityModifier(character.abilities.dexterity)
            : this.getAbilityModifier(character.abilities?.strength || 10);
        
        const weaponBonus = weapon?.enhancementBonus || 0;
        const miscBonus = 0; // TODO: Calculate misc bonuses from feats/effects
        
        return abilityModifier + weaponBonus + miscBonus;
    }

    calculateSpellAttackBonus(character) {
        if (!character) return 0;

        const baseAttackBonus = character.baseAttackBonus || 0;
        const primaryCasterAbility = this.getPrimaryCasterAbility(character);
        const abilityModifier = this.getAbilityModifier(character.abilities?.[primaryCasterAbility] || 10);
        
        return baseAttackBonus + abilityModifier;
    }

    calculateSpellDamage(spell, casterLevel) {
        const damage = this.parseDiceExpression(spell.damage);
        
        // Apply caster level scaling if specified
        if (spell.damageScaling) {
            const scaledCount = Math.floor(casterLevel / spell.damageScaling.perLevels) * spell.damageScaling.additional;
            damage.count += scaledCount;
        }

        return damage;
    }

    getPrimaryCasterAbility(character) {
        if (!character.classes) return 'intelligence';
        
        const casterClasses = character.classes.filter(c => 
            ['Wizard', 'Sorcerer', 'Cleric', 'Bard', 'Druid', 'Paladin', 'Ranger'].includes(c.name)
        );
        
        if (casterClasses.length === 0) return 'intelligence';
        
        const primaryClass = casterClasses.reduce((a, b) => a.level > b.level ? a : b);
        
        const abilityMap = {
            'Wizard': 'intelligence',
            'Sorcerer': 'charisma',
            'Cleric': 'wisdom',
            'Bard': 'charisma',
            'Druid': 'wisdom',
            'Paladin': 'charisma',
            'Ranger': 'wisdom'
        };
        
        return abilityMap[primaryClass.name] || 'intelligence';
    }

    getAbilityModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    parseDiceExpression(expression) {
        const match = expression.match(/(\d+)d(\d+)(?:\+(\d+))?/);
        if (match) {
            return {
                count: parseInt(match[1]),
                sides: parseInt(match[2]),
                modifier: parseInt(match[3]) || 0
            };
        }
        return { count: 1, sides: 4, modifier: 0 };
    }

    // ==================== UTILITY METHODS ====================

    addToHistory(result) {
        this.rollHistory.unshift(result);
        if (this.rollHistory.length > this.maxHistorySize) {
            this.rollHistory.pop();
        }
    }

    getHistory(count = 10) {
        return this.rollHistory.slice(0, count);
    }

    clearHistory() {
        this.rollHistory = [];
    }

    // ==================== BATCH OPERATIONS ====================

    rollMultipleAttacks(character, weapon, attackCount, targetAC = null, options = {}) {
        const results = [];
        let currentAttackBonus = this.calculateAttackBonus(character, weapon);
        
        for (let i = 0; i < attackCount; i++) {
            const iterativeBonus = i * -5; // D&D 3.5 iterative attack penalty
            const finalBonus = currentAttackBonus + iterativeBonus;
            
            const attack = this.rollD20(finalBonus, options.advantage, 
                                       `Attack ${i + 1}/${attackCount}: ${weapon?.name || 'Unarmed'}`);
            
            if (targetAC) {
                attack.hits = attack.total >= targetAC;
                attack.targetAC = targetAC;
                attack.label += ` vs AC ${targetAC} (${attack.hits ? 'HIT' : 'MISS'})`;
            }

            attack.attackNumber = i + 1;
            attack.totalAttacks = attackCount;
            attack.iterativePenalty = iterativeBonus;
            
            results.push(attack);
        }

        const batchResult = {
            attacks: results,
            weapon: weapon?.name,
            timestamp: Date.now(),
            type: 'full-attack'
        };

        this.addToHistory(batchResult);
        return batchResult;
    }

    rollGroupInitiative(characters) {
        const results = characters.map(character => {
            const initiative = this.rollInitiative(character);
            return {
                character: character.name || 'Unnamed',
                initiative: initiative.total,
                roll: initiative
            };
        });

        // Sort by initiative (highest first)
        results.sort((a, b) => b.initiative - a.initiative);

        const batchResult = {
            initiatives: results,
            timestamp: Date.now(),
            type: 'group-initiative'
        };

        this.addToHistory(batchResult);
        return batchResult;
    }

    // ==================== COMPLEX DICE EXPRESSIONS ====================

    parseComplexExpression(expression) {
        // Handle complex expressions like "2d6+1d4+3" or "1d20+5-2"
        const terms = expression.split(/([+\-])/);
        const results = [];
        let total = 0;

        for (let i = 0; i < terms.length; i += 2) {
            const term = terms[i].trim();
            const operator = i > 0 ? terms[i - 1] : '+';
            
            let termValue = 0;
            
            if (term.includes('d')) {
                const dice = this.parseDiceExpression(term);
                const roll = this.rollDice(dice.sides, dice.count, dice.modifier, '');
                termValue = roll.total;
                results.push({ type: 'dice', term, value: termValue, rolls: roll.rolls });
            } else {
                termValue = parseInt(term);
                results.push({ type: 'constant', term, value: termValue });
            }
            
            if (operator === '+') {
                total += termValue;
            } else if (operator === '-') {
                total -= termValue;
            }
        }

        return {
            expression,
            terms: results,
            total,
            timestamp: Date.now(),
            type: 'complex'
        };
    }

    // ==================== SETUP METHODS ====================

    setupDamageSystem() {
        // Damage type information for resistance/immunity calculations
        this.damageTypes = {
            'slashing': { physical: true, icon: '⚔️' },
            'piercing': { physical: true, icon: '🗡️' },
            'bludgeoning': { physical: true, icon: '🔨' },
            'fire': { energy: true, icon: '🔥', color: '#ff4444' },
            'cold': { energy: true, icon: '❄️', color: '#4488ff' },
            'electricity': { energy: true, icon: '⚡', color: '#ffff44' },
            'acid': { energy: true, icon: '🧪', color: '#44ff44' },
            'sonic': { energy: true, icon: '🔊', color: '#ff44ff' },
            'force': { energy: true, icon: '✨', color: '#8844ff' },
            'negative': { energy: true, icon: '💀', color: '#444444' },
            'positive': { energy: true, icon: '✨', color: '#ffffff' }
        };
    }

    setupSkillSystem() {
        // D&D 3.5 skill information
        this.skills = {
            'Appraise': { ability: 'intelligence', trained: false },
            'Balance': { ability: 'dexterity', trained: false },
            'Bluff': { ability: 'charisma', trained: false },
            'Climb': { ability: 'strength', trained: false },
            'Concentration': { ability: 'constitution', trained: false },
            'Craft': { ability: 'intelligence', trained: false },
            'Decipher Script': { ability: 'intelligence', trained: true },
            'Diplomacy': { ability: 'charisma', trained: false },
            'Disable Device': { ability: 'intelligence', trained: true },
            'Disguise': { ability: 'charisma', trained: false },
            'Escape Artist': { ability: 'dexterity', trained: false },
            'Forgery': { ability: 'intelligence', trained: false },
            'Gather Information': { ability: 'charisma', trained: false },
            'Handle Animal': { ability: 'charisma', trained: true },
            'Heal': { ability: 'wisdom', trained: false },
            'Hide': { ability: 'dexterity', trained: false },
            'Intimidate': { ability: 'charisma', trained: false },
            'Jump': { ability: 'strength', trained: false },
            'Knowledge': { ability: 'intelligence', trained: true },
            'Listen': { ability: 'wisdom', trained: false },
            'Move Silently': { ability: 'dexterity', trained: false },
            'Open Lock': { ability: 'dexterity', trained: true },
            'Perform': { ability: 'charisma', trained: false },
            'Profession': { ability: 'wisdom', trained: true },
            'Ride': { ability: 'dexterity', trained: false },
            'Search': { ability: 'intelligence', trained: false },
            'Sense Motive': { ability: 'wisdom', trained: false },
            'Sleight of Hand': { ability: 'dexterity', trained: true },
            'Spellcraft': { ability: 'intelligence', trained: true },
            'Spot': { ability: 'wisdom', trained: false },
            'Survival': { ability: 'wisdom', trained: false },
            'Swim': { ability: 'strength', trained: false },
            'Tumble': { ability: 'dexterity', trained: true },
            'Use Magic Device': { ability: 'charisma', trained: true },
            'Use Rope': { ability: 'dexterity', trained: false }
        };
    }

    setupSavingThrowSystem() {
        // D&D 3.5 saving throw information
        this.savingThrows = {
            'fortitude': { ability: 'constitution', abbreviation: 'Fort' },
            'reflex': { ability: 'dexterity', abbreviation: 'Ref' },
            'will': { ability: 'wisdom', abbreviation: 'Will' }
        };
    }

    setupAttackSystem() {
        // Attack type information
        this.attackTypes = {
            'melee': { ability: 'strength', rangeIncrement: 0 },
            'ranged': { ability: 'dexterity', rangeIncrement: null },
            'thrown': { ability: 'strength', rangeIncrement: null }
        };
    }
}

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedDiceEngine;
} else if (typeof window !== 'undefined') {
    window.AdvancedDiceEngine = AdvancedDiceEngine;
}
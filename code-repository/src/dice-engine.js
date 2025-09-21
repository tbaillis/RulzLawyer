/**
 * Advanced Dice Engine for RulzLawyer D&D 3.5 System
 * 
 * Provides comprehensive dice rolling capabilities including:
 * - Standard RPG dice (d4, d6, d8, d10, d12, d20, d100)
 * - Complex dice expressions (3d6+2, 2d10+1d4+5, etc.)
 * - Advantage/disadvantage mechanics
 * - Statistical tracking and analysis
 * - 3D visual rolling simulation (placeholder for future implementation)
 * - Dice roll history and replay
 * 
 * Requirements Traceability:
 * - REQ-002: Advanced dice rolling system
 * - US-009: Dice rolling subsystem user story
 * - TS-002: Dice engine technical specification
 * 
 * @version 1.0
 * @created September 21, 2025
 * @location code-repository/src/dice-engine.js
 */

class DiceEngine {
  constructor(options = {}) {
    this.version = '1.0.0';
    this.debug = options.debug || false;
    this.enableHistory = options.enableHistory !== false;
    this.maxHistorySize = options.maxHistorySize || 1000;
    
    // Roll history for statistics and replay
    this.rollHistory = [];
    
    // Statistical tracking
    this.statistics = {
      totalRolls: 0,
      diceTypeCount: {},
      averageResults: {},
      extremeRolls: { twenties: 0, ones: 0 }
    };
    
    // Standard dice types
    this.standardDice = [4, 6, 8, 10, 12, 20, 100];
    
    this.log('🎲 DiceEngine v' + this.version + ' initialized');
  }

  /**
   * Roll a single die
   * @param {number} sides - Number of sides on the die
   * @param {Object} options - Rolling options
   * @returns {Object} Roll result with metadata
   */
  roll(sides, options = {}) {
    if (!Number.isInteger(sides) || sides < 1) {
      throw new Error(`Invalid dice sides: ${sides}. Must be a positive integer.`);
    }
    
    const rollId = this.generateRollId();
    const timestamp = new Date();
    
    // Generate random result
    let result;
    if (options.advantage) {
      const roll1 = Math.floor(Math.random() * sides) + 1;
      const roll2 = Math.floor(Math.random() * sides) + 1;
      result = Math.max(roll1, roll2);
      this.log(`🎯 Advantage roll: ${roll1}, ${roll2} → ${result}`);
    } else if (options.disadvantage) {
      const roll1 = Math.floor(Math.random() * sides) + 1;
      const roll2 = Math.floor(Math.random() * sides) + 1;
      result = Math.min(roll1, roll2);
      this.log(`⚠️  Disadvantage roll: ${roll1}, ${roll2} → ${result}`);
    } else {
      result = Math.floor(Math.random() * sides) + 1;
    }
    
    // Create roll result object
    const rollResult = {
      id: rollId,
      type: 'single',
      dice: { sides: sides, count: 1 },
      result: result,
      timestamp: timestamp,
      advantage: options.advantage || false,
      disadvantage: options.disadvantage || false,
      metadata: {
        diceNotation: `1d${sides}`,
        rollTime: timestamp.toISOString()
      }
    };
    
    // Track statistics
    this.updateStatistics('single', sides, result);
    
    // Add to history
    if (this.enableHistory) {
      this.addToHistory(rollResult);
    }
    
    return rollResult;
  }

  /**
   * Roll multiple dice
   * @param {number} count - Number of dice to roll
   * @param {number} sides - Number of sides per die
   * @param {Object} options - Rolling options
   * @returns {Object} Roll result with individual rolls and total
   */
  rollMultiple(count, sides, options = {}) {
    if (!Number.isInteger(count) || count < 1) {
      throw new Error(`Invalid dice count: ${count}. Must be a positive integer.`);
    }
    
    if (!Number.isInteger(sides) || sides < 1) {
      throw new Error(`Invalid dice sides: ${sides}. Must be a positive integer.`);
    }
    
    if (count > 100) {
      throw new Error(`Too many dice: ${count}. Maximum allowed is 100.`);
    }
    
    const rollId = this.generateRollId();
    const timestamp = new Date();
    const rolls = [];
    
    // Roll each die
    for (let i = 0; i < count; i++) {
      const individualRoll = this.roll(sides, { 
        advantage: options.advantage, 
        disadvantage: options.disadvantage 
      });
      rolls.push(individualRoll.result);
    }
    
    // Calculate total and statistics
    const total = rolls.reduce((sum, roll) => sum + roll, 0);
    const average = total / count;
    const min = Math.min(...rolls);
    const max = Math.max(...rolls);
    
    const rollResult = {
      id: rollId,
      type: 'multiple',
      dice: { sides: sides, count: count },
      rolls: rolls,
      total: total,
      statistics: { average, min, max },
      timestamp: timestamp,
      advantage: options.advantage || false,
      disadvantage: options.disadvantage || false,
      metadata: {
        diceNotation: `${count}d${sides}`,
        rollTime: timestamp.toISOString()
      }
    };
    
    // Track statistics
    this.updateStatistics('multiple', sides, total, count);
    
    // Add to history
    if (this.enableHistory) {
      this.addToHistory(rollResult);
    }
    
    this.log(`🎲 Rolled ${count}d${sides}: [${rolls.join(', ')}] = ${total}`);
    
    return rollResult;
  }

  /**
   * Roll dice from expression (e.g., "3d6+2", "2d10+1d4+5")
   * @param {string} expression - Dice expression to evaluate
   * @param {Object} options - Rolling options
   * @returns {Object} Complete roll result with breakdown
   */
  rollExpression(expression, options = {}) {
    if (typeof expression !== 'string') {
      throw new Error('Dice expression must be a string');
    }
    
    const originalExpression = expression.trim();
    
    if (!originalExpression) {
      throw new Error('Empty dice expression');
    }
    
    const rollId = this.generateRollId();
    const timestamp = new Date();
    
    try {
      // Parse and evaluate the expression
      const parseResult = this.parseExpression(originalExpression);
      const evaluationResult = this.evaluateExpression(parseResult, options);
      
      const rollResult = {
        id: rollId,
        type: 'expression',
        expression: originalExpression,
        parsedComponents: parseResult,
        breakdown: evaluationResult.breakdown,
        total: evaluationResult.total,
        timestamp: timestamp,
        advantage: options.advantage || false,
        disadvantage: options.disadvantage || false,
        metadata: {
          rollTime: timestamp.toISOString(),
          componentCount: parseResult.length
        }
      };
      
      // Track statistics
      this.updateStatistics('expression', null, evaluationResult.total);
      
      // Add to history
      if (this.enableHistory) {
        this.addToHistory(rollResult);
      }
      
      this.log(`🎯 Expression "${originalExpression}" = ${evaluationResult.total}`);
      
      return rollResult;
      
    } catch (error) {
      this.logError(`Failed to evaluate expression "${originalExpression}": ${error.message}`);
      throw new Error(`Invalid dice expression: ${error.message}`);
    }
  }

  /**
   * Parse dice expression into components
   * @param {string} expression - Expression to parse
   * @returns {Array} Array of parsed components
   */
  parseExpression(expression) {
    // Remove all spaces
    const cleanExpression = expression.replace(/\s+/g, '');
    
    // Regular expression to match dice components and modifiers
    const diceRegex = /([+-]?)(\d*)d(\d+)|([+-]?)(\d+)(?!d)/g;
    const components = [];
    let match;
    
    while ((match = diceRegex.exec(cleanExpression)) !== null) {
      if (match[2] !== undefined && match[3] !== undefined) {
        // Dice component (e.g., "3d6", "+2d8", "-1d4")
        const sign = match[1] === '-' ? -1 : 1;
        const count = parseInt(match[2]) || 1;
        const sides = parseInt(match[3]);
        
        components.push({
          type: 'dice',
          sign: sign,
          count: count,
          sides: sides,
          notation: `${sign === -1 ? '-' : '+'}${count}d${sides}`
        });
      } else if (match[4] !== undefined && match[5] !== undefined) {
        // Modifier component (e.g., "+5", "-2")
        const sign = match[4] === '-' ? -1 : 1;
        const value = parseInt(match[5]);
        
        components.push({
          type: 'modifier',
          sign: sign,
          value: value,
          notation: `${sign === -1 ? '-' : '+'}${value}`
        });
      }
    }
    
    if (components.length === 0) {
      throw new Error('No valid dice or modifier components found');
    }
    
    // Handle the first component's sign (if missing '+' prefix)
    if (components[0] && !cleanExpression.startsWith('-') && !cleanExpression.startsWith('+')) {
      components[0].sign = 1;
    }
    
    return components;
  }

  /**
   * Evaluate parsed expression components
   * @param {Array} components - Parsed components
   * @param {Object} options - Rolling options
   * @returns {Object} Evaluation result with breakdown
   */
  evaluateExpression(components, options = {}) {
    let total = 0;
    const breakdown = [];
    
    for (const component of components) {
      if (component.type === 'dice') {
        // Roll dice component
        const diceResult = this.rollMultiple(component.count, component.sides, options);
        const componentValue = diceResult.total * component.sign;
        
        total += componentValue;
        breakdown.push({
          type: 'dice',
          notation: component.notation,
          rolls: diceResult.rolls,
          subtotal: diceResult.total,
          signedSubtotal: componentValue,
          count: component.count,
          sides: component.sides
        });
        
      } else if (component.type === 'modifier') {
        // Add modifier component
        const componentValue = component.value * component.sign;
        total += componentValue;
        
        breakdown.push({
          type: 'modifier',
          notation: component.notation,
          value: componentValue
        });
      }
    }
    
    return {
      total: total,
      breakdown: breakdown
    };
  }

  /**
   * Generate unique roll ID
   * @returns {string} Unique identifier
   */
  generateRollId() {
    return 'roll_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Update internal statistics
   */
  updateStatistics(type, sides, result, count = 1) {
    this.statistics.totalRolls += count;
    
    if (sides) {
      if (!this.statistics.diceTypeCount[sides]) {
        this.statistics.diceTypeCount[sides] = 0;
        this.statistics.averageResults[sides] = [];
      }
      
      this.statistics.diceTypeCount[sides] += count;
      this.statistics.averageResults[sides].push(result);
      
      // Track extreme rolls for d20
      if (sides === 20) {
        if (result === 20) this.statistics.extremeRolls.twenties++;
        if (result === 1) this.statistics.extremeRolls.ones++;
      }
    }
  }

  /**
   * Add roll to history
   */
  addToHistory(rollResult) {
    this.rollHistory.unshift(rollResult);
    
    // Maintain history size limit
    if (this.rollHistory.length > this.maxHistorySize) {
      this.rollHistory = this.rollHistory.slice(0, this.maxHistorySize);
    }
  }

  /**
   * Get roll history
   * @param {number} limit - Maximum number of rolls to return
   * @returns {Array} Array of recent rolls
   */
  getHistory(limit = 50) {
    return this.rollHistory.slice(0, Math.min(limit, this.rollHistory.length));
  }

  /**
   * Get comprehensive statistics
   * @returns {Object} Detailed statistics object
   */
  getStatistics() {
    const stats = { ...this.statistics };
    
    // Calculate averages for each dice type
    stats.calculatedAverages = {};
    for (const [sides, results] of Object.entries(this.statistics.averageResults)) {
      if (results.length > 0) {
        stats.calculatedAverages[sides] = {
          average: results.reduce((sum, val) => sum + val, 0) / results.length,
          rollCount: results.length,
          theoretical: (parseInt(sides) + 1) / 2
        };
      }
    }
    
    return stats;
  }

  /**
   * Clear history and statistics
   */
  clearHistory() {
    this.rollHistory = [];
    this.statistics = {
      totalRolls: 0,
      diceTypeCount: {},
      averageResults: {},
      extremeRolls: { twenties: 0, ones: 0 }
    };
    
    this.log('📊 History and statistics cleared');
  }

  /**
   * Replay a roll by ID
   * @param {string} rollId - ID of roll to replay
   * @returns {Object} Original roll result or null if not found
   */
  replayRoll(rollId) {
    const roll = this.rollHistory.find(r => r.id === rollId);
    if (roll) {
      this.log(`🔄 Replaying roll ${rollId}: ${roll.result || roll.total}`);
      return roll;
    } else {
      this.logWarning(`Roll ${rollId} not found in history`);
      return null;
    }
  }

  /**
   * Get system status and health
   * @returns {Object} Engine status information
   */
  getStatus() {
    return {
      version: this.version,
      initialized: true,
      historyEnabled: this.enableHistory,
      historySize: this.rollHistory.length,
      maxHistorySize: this.maxHistorySize,
      totalRolls: this.statistics.totalRolls,
      supportedDice: this.standardDice,
      features: [
        'Standard dice rolling',
        'Multiple dice rolling',
        'Complex expressions',
        'Advantage/disadvantage',
        'Statistical tracking',
        'Roll history',
        'Roll replay'
      ]
    };
  }

  /**
   * Validate dice expression syntax
   * @param {string} expression - Expression to validate
   * @returns {Object} Validation result
   */
  validateExpression(expression) {
    try {
      const parsed = this.parseExpression(expression);
      return {
        valid: true,
        components: parsed.length,
        parsedExpression: parsed
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // === Convenience Methods for Common D&D Rolls ===

  /**
   * Roll ability scores (4d6 drop lowest)
   * @returns {Object} Ability score roll result
   */
  rollAbilityScore() {
    const rolls = [];
    for (let i = 0; i < 4; i++) {
      rolls.push(this.roll(6).result);
    }
    
    rolls.sort((a, b) => b - a); // Sort descending
    const topThree = rolls.slice(0, 3);
    const total = topThree.reduce((sum, roll) => sum + roll, 0);
    
    return {
      id: this.generateRollId(),
      type: 'ability_score',
      allRolls: rolls,
      usedRolls: topThree,
      droppedRoll: rolls[3],
      total: total,
      timestamp: new Date(),
      metadata: {
        diceNotation: '4d6 drop lowest',
        method: 'standard'
      }
    };
  }

  /**
   * Roll initiative (1d20 + modifier)
   * @param {number} modifier - Initiative modifier
   * @returns {Object} Initiative roll result
   */
  rollInitiative(modifier = 0) {
    const baseRoll = this.roll(20);
    const total = baseRoll.result + modifier;
    
    return {
      id: this.generateRollId(),
      type: 'initiative',
      baseRoll: baseRoll.result,
      modifier: modifier,
      total: total,
      timestamp: new Date(),
      metadata: {
        diceNotation: `1d20${modifier >= 0 ? '+' : ''}${modifier}`,
        rollType: 'initiative'
      }
    };
  }

  /**
   * Roll attack (1d20 + attack bonus)
   * @param {number} attackBonus - Attack bonus to add
   * @param {Object} options - Attack options (advantage, etc.)
   * @returns {Object} Attack roll result
   */
  rollAttack(attackBonus = 0, options = {}) {
    const baseRoll = this.roll(20, options);
    const total = baseRoll.result + attackBonus;
    
    return {
      id: this.generateRollId(),
      type: 'attack',
      baseRoll: baseRoll.result,
      attackBonus: attackBonus,
      total: total,
      advantage: options.advantage || false,
      disadvantage: options.disadvantage || false,
      criticalThreat: baseRoll.result === 20,
      criticalFailure: baseRoll.result === 1,
      timestamp: new Date(),
      metadata: {
        diceNotation: `1d20${attackBonus >= 0 ? '+' : ''}${attackBonus}`,
        rollType: 'attack'
      }
    };
  }

  // Logging utilities
  log(message) {
    if (this.debug) {
      console.log(`\x1b[36m[DiceEngine] ${message}\x1b[0m`);
    }
  }

  logWarning(message) {
    console.log(`\x1b[33m[DiceEngine] ${message}\x1b[0m`);
  }

  logError(message) {
    console.error(`\x1b[31m[DiceEngine] ${message}\x1b[0m`);
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiceEngine;
}

if (typeof window !== 'undefined') {
  window.DiceEngine = DiceEngine;
}
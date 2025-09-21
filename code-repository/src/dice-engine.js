/**
 * RulzLawyer High-Performance Dice Rolling Engine
 * Comprehensive dice rolling system for D&D 3.5 with statistical tracking
 * 
 * @version 1.0
 * @date September 20, 2025
 * @location code-repository/src/dice-engine.js
 */

class DiceEngine {
  constructor() {
    this.rollHistory = [];
    this.statistics = {
      totalRolls: 0,
      totalDice: 0,
      averageRoll: 0,
      distributionData: {},
      sessionStart: Date.now()
    };
  }

  /**
   * Roll a dice expression and return detailed results
   * @param {string} expression - Dice notation (e.g., "3d6+2", "1d20", "2d10+1d4")
   * @returns {Object} Roll result with total, dice array, modifier, and metadata
   */
  rollExpression(expression) {
    if (!this.validateExpression(expression)) {
      throw new Error(`Invalid dice expression: ${expression}`);
    }

    const startTime = performance.now();
    const result = this._parseAndRoll(expression);
    const endTime = performance.now();

    // Add to history and statistics
    const rollRecord = {
      expression,
      result: result.total,
      dice: result.dice,
      modifier: result.modifier,
      timestamp: Date.now(),
      executionTime: endTime - startTime
    };

    this.rollHistory.push(rollRecord);
    this._updateStatistics(rollRecord);

    return {
      expression,
      total: result.total,
      dice: result.dice,
      modifier: result.modifier,
      breakdown: result.breakdown,
      timestamp: rollRecord.timestamp,
      executionTime: rollRecord.executionTime
    };
  }

  /**
   * Alias for rollExpression - for backward compatibility
   * @param {string} expression - Dice notation
   * @returns {number} Just the total result for simple usage
   */
  roll(expression) {
    return this.rollExpression(expression).total;
  }

  /**
   * Roll with advantage (roll twice, take higher)
   * @param {string} expression - Dice expression
   * @returns {Object} Roll result with advantage details
   */
  rollAdvantage(expression) {
    const roll1 = this.rollExpression(expression);
    const roll2 = this.rollExpression(expression);
    
    const chosen = roll1.total >= roll2.total ? roll1 : roll2;
    const discarded = roll1.total >= roll2.total ? roll2 : roll1;

    return {
      ...chosen,
      advantage: true,
      chosenRoll: chosen.total,
      discardedRoll: discarded.total,
      bothRolls: [roll1, roll2]
    };
  }

  /**
   * Roll with disadvantage (roll twice, take lower)
   * @param {string} expression - Dice expression
   * @returns {Object} Roll result with disadvantage details
   */
  rollDisadvantage(expression) {
    const roll1 = this.rollExpression(expression);
    const roll2 = this.rollExpression(expression);
    
    const chosen = roll1.total <= roll2.total ? roll1 : roll2;
    const discarded = roll1.total <= roll2.total ? roll2 : roll1;

    return {
      ...chosen,
      disadvantage: true,
      chosenRoll: chosen.total,
      discardedRoll: discarded.total,
      bothRolls: [roll1, roll2]
    };
  }

  /**
   * Validate dice expression format
   * @param {string} expression - Expression to validate
   * @returns {boolean} True if valid
   */
  validateExpression(expression) {
    if (!expression || typeof expression !== 'string') {
      return false;
    }

    // Remove spaces and convert to lowercase
    const clean = expression.replace(/\s/g, '').toLowerCase();
    
    // Basic pattern: XdY+Z, XdY-Z, XdY, or just Z
    const pattern = /^(\d*d\d+([+-]\d+)?([+-]\d*d\d+)*([+-]\d+)?|\d+)$/;
    
    if (!pattern.test(clean)) {
      return false;
    }

    // Check for invalid patterns like starting with 'd' or ending with 'd'
    if (clean.startsWith('d') || clean.endsWith('d')) {
      return false;
    }

    // Validate individual dice types
    const dicePattern = /(\d*)d(\d+)/g;
    let match;
    
    while ((match = dicePattern.exec(clean)) !== null) {
      const count = parseInt(match[1] || '1');
      const sides = parseInt(match[2]);
      
      // Validate dice count (1-100) and sides (valid D&D dice)
      if (count < 1 || count > 100) return false;
      if (![4, 6, 8, 10, 12, 20, 100].includes(sides)) return false;
    }

    return true;
  }

  /**
   * Roll multiple expressions in batch for performance
   * @param {Array} expressions - Array of dice expressions
   * @returns {Array} Array of roll results
   */
  rollBatch(expressions) {
    const results = [];
    const startTime = performance.now();

    for (const expression of expressions) {
      try {
        results.push(this.rollExpression(expression));
      } catch (error) {
        results.push({
          expression,
          error: error.message,
          total: 0,
          dice: [],
          modifier: 0
        });
      }
    }

    const endTime = performance.now();
    console.log(`Batch rolled ${expressions.length} expressions in ${(endTime - startTime).toFixed(2)}ms`);

    return results;
  }

  /**
   * Get rolling statistics and history
   * @returns {Object} Statistics object
   */
  getStatistics() {
    return {
      ...this.statistics,
      recentRolls: this.rollHistory.slice(-20),
      sessionDuration: Date.now() - this.statistics.sessionStart
    };
  }

  /**
   * Clear roll history and reset statistics
   */
  clearHistory() {
    this.rollHistory = [];
    this.statistics = {
      totalRolls: 0,
      totalDice: 0,
      averageRoll: 0,
      distributionData: {},
      sessionStart: Date.now()
    };
  }

  /**
   * Parse dice expression and execute rolls
   * @private
   * @param {string} expression - Clean dice expression
   * @returns {Object} Parsed roll result
   */
  _parseAndRoll(expression) {
    const clean = expression.replace(/\s/g, '').toLowerCase();
    
    // Split by + and - while keeping the operators
    const parts = clean.split(/([+-])/).filter(part => part !== '');
    
    let total = 0;
    let allDice = [];
    let totalModifier = 0;
    let breakdown = [];

    let currentSign = 1; // 1 for positive, -1 for negative

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (part === '+') {
        currentSign = 1;
      } else if (part === '-') {
        currentSign = -1;
      } else {
        if (part.includes('d')) {
          // Dice roll
          const [countStr, sidesStr] = part.split('d');
          const count = parseInt(countStr) || 1;
          const sides = parseInt(sidesStr);
          
          const diceRolls = [];
          let diceSum = 0;
          
          for (let j = 0; j < count; j++) {
            const roll = this._rollSingleDie(sides);
            diceRolls.push(roll);
            diceSum += roll;
          }
          
          const contribution = diceSum * currentSign;
          total += contribution;
          allDice.push(...diceRolls.map(d => d * currentSign));
          
          breakdown.push({
            type: 'dice',
            expression: `${count}d${sides}`,
            rolls: diceRolls,
            sum: diceSum,
            contribution: contribution,
            sign: currentSign
          });
          
        } else {
          // Modifier
          const modifier = parseInt(part);
          const contribution = modifier * currentSign;
          total += contribution;
          totalModifier += contribution;
          
          breakdown.push({
            type: 'modifier',
            value: modifier,
            contribution: contribution,
            sign: currentSign
          });
        }
      }
    }

    return {
      total,
      dice: allDice,
      modifier: totalModifier,
      breakdown
    };
  }

  /**
   * Roll a single die with the specified number of sides
   * @private
   * @param {number} sides - Number of sides on the die
   * @returns {number} Die roll result (1 to sides)
   */
  _rollSingleDie(sides) {
    // Use crypto.getRandomValues for better randomness if available
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return Math.floor((array[0] / (0xFFFFFFFF + 1)) * sides) + 1;
    } else {
      return Math.floor(Math.random() * sides) + 1;
    }
  }

  /**
   * Update rolling statistics
   * @private
   * @param {Object} rollRecord - Roll record to add to statistics
   */
  _updateStatistics(rollRecord) {
    this.statistics.totalRolls++;
    this.statistics.totalDice += rollRecord.dice.length;
    
    // Update average
    const totalSum = this.rollHistory.reduce((sum, roll) => sum + roll.result, 0);
    this.statistics.averageRoll = totalSum / this.statistics.totalRolls;
    
    // Update distribution data
    const key = rollRecord.expression;
    if (!this.statistics.distributionData[key]) {
      this.statistics.distributionData[key] = {
        count: 0,
        sum: 0,
        min: rollRecord.result,
        max: rollRecord.result,
        average: 0
      };
    }
    
    const dist = this.statistics.distributionData[key];
    dist.count++;
    dist.sum += rollRecord.result;
    dist.min = Math.min(dist.min, rollRecord.result);
    dist.max = Math.max(dist.max, rollRecord.result);
    dist.average = dist.sum / dist.count;
  }

  /**
   * Test dice distribution for statistical validation
   * @param {string} expression - Dice expression to test
   * @param {number} iterations - Number of test rolls (default: 1000)
   * @returns {Object} Statistical analysis results
   */
  testDistribution(expression, iterations = 1000) {
    const results = [];
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      const result = this.rollExpression(expression);
      results.push(result.total);
    }
    
    const endTime = performance.now();
    
    // Calculate statistics
    const sum = results.reduce((a, b) => a + b, 0);
    const mean = sum / results.length;
    const variance = results.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / results.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate expected values for common dice expressions
    let expectedMean = 0;
    if (expression === '1d20') expectedMean = 10.5;
    else if (expression === '3d6') expectedMean = 10.5;
    else if (expression === '1d6') expectedMean = 3.5;
    
    return {
      expression,
      iterations,
      executionTime: endTime - startTime,
      results: {
        mean: parseFloat(mean.toFixed(2)),
        variance: parseFloat(variance.toFixed(2)),
        stdDev: parseFloat(stdDev.toFixed(2)),
        min: Math.min(...results),
        max: Math.max(...results)
      },
      expected: {
        mean: expectedMean
      },
      performance: {
        avgTimePerRoll: (endTime - startTime) / iterations,
        rollsPerSecond: Math.round(iterations / ((endTime - startTime) / 1000))
      }
    };
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiceEngine;
} else if (typeof window !== 'undefined') {
  window.DiceEngine = DiceEngine;
}
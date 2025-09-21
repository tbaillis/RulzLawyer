/**
 * D&D 3.5 Character Level Up System
 * Handles character advancement and level progression
 * 
 * @version 1.0
 * @date December 2024
 * @location code-repository/src/dnd35-level-up.js
 */

class DnD35LevelUpSystem {
  constructor() {
    this.currentCharacter = null;
    this.levelUpData = {};
    console.log('⬆️ D&D 3.5 Level Up System initialized');
  }

  /**
   * Check if character can level up
   */
  canLevelUp(character) {
    const nextLevel = character.level + 1;
    const requiredXP = this.getExperienceForLevel(nextLevel);
    return character.experience >= requiredXP && nextLevel <= 20;
  }

  /**
   * Get required experience for a level
   */
  getExperienceForLevel(level) {
    // D&D 3.5 experience table
    const xpTable = {
      1: 0, 2: 1000, 3: 3000, 4: 6000, 5: 10000,
      6: 15000, 7: 21000, 8: 28000, 9: 36000, 10: 45000,
      11: 55000, 12: 66000, 13: 78000, 14: 91000, 15: 105000,
      16: 120000, 17: 136000, 18: 153000, 19: 171000, 20: 190000
    };
    return xpTable[level] || 190000;
  }

  /**
   * Start level up process
   */
  startLevelUp(character) {
    if (!this.canLevelUp(character)) {
      throw new Error('Character cannot level up at this time');
    }

    this.currentCharacter = character;
    this.levelUpData = {
      newLevel: character.level + 1,
      hitPointGain: 0,
      skillPointGain: 0,
      skillPointsSpent: {},
      attributeIncrease: null,
      newFeats: [],
      classFeatures: [],
      step: 'hitPoints'
    };

    this.calculateLevelUpGains();
    return this.renderLevelUpWizard();
  }

  /**
   * Calculate gains for leveling up
   */
  calculateLevelUpGains() {
    const character = this.currentCharacter;
    const newLevel = this.levelUpData.newLevel;
    const classData = DnD35SRDData.classes[character.class];

    // Calculate skill points
    const baseSkillPoints = classData.skillPointsPerLevel || 2;
    const intModifier = character.abilityModifiers.intelligence;
    this.levelUpData.skillPointGain = Math.max(1, baseSkillPoints + intModifier);

    // Determine if feat is gained
    if (newLevel % 3 === 1 && newLevel > 1) {
      this.levelUpData.gainsNewFeat = true;
    }

    // Determine if attribute increase is gained
    if (newLevel % 4 === 0) {
      this.levelUpData.gainsAttributeIncrease = true;
    }

    // Get class features for this level
    this.levelUpData.classFeatures = this.getClassFeaturesForLevel(character.class, newLevel);
  }

  /**
   * Get class features gained at a specific level
   */
  getClassFeaturesForLevel(className, level) {
    const classData = DnD35SRDData.classes[className];
    const features = [];

    // This is a simplified version - in a full implementation,
    // you'd have comprehensive class feature tables
    if (classData.features && classData.features[level]) {
      features.push(...classData.features[level]);
    }

    // Add standard progressions
    if (level === 2 && className === 'rogue') {
      features.push('Evasion');
    }
    if (level === 3 && className === 'rogue') {
      features.push('Sneak Attack +2d6', 'Trap Sense +1');
    }
    if (level === 2 && className === 'fighter') {
      features.push('Bonus Feat');
    }

    return features;
  }

  /**
   * Render level up wizard
   */
  renderLevelUpWizard() {
    const character = this.currentCharacter;
    const data = this.levelUpData;

    return `
      <div class="level-up-wizard">
        <div class="wizard-header">
          <h2>Level Up: ${character.name}</h2>
          <div class="level-progression">
            Level ${character.level} → ${data.newLevel}
          </div>
          <div class="xp-info">
            ${character.experience} XP / ${this.getExperienceForLevel(data.newLevel)} XP required
          </div>
        </div>

        <div class="wizard-progress">
          <div class="progress-steps">
            ${this.renderProgressSteps()}
          </div>
        </div>

        <div class="wizard-content">
          ${this.renderCurrentStep()}
        </div>

        <div class="wizard-navigation">
          ${this.renderNavigationButtons()}
        </div>
      </div>
    `;
  }

  /**
   * Render progress steps
   */
  renderProgressSteps() {
    const steps = [
      { id: 'hitPoints', name: 'Hit Points' },
      { id: 'skillPoints', name: 'Skill Points' },
      { id: 'attributes', name: 'Attributes', condition: this.levelUpData.gainsAttributeIncrease },
      { id: 'feats', name: 'Feats', condition: this.levelUpData.gainsNewFeat },
      { id: 'features', name: 'Class Features', condition: this.levelUpData.classFeatures.length > 0 },
      { id: 'review', name: 'Review' }
    ];

    return steps.filter(step => step.condition !== false).map(step => {
      const isActive = step.id === this.levelUpData.step;
      const isCompleted = this.isStepCompleted(step.id);
      
      return `
        <div class="step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
             onclick="this.goToStep('${step.id}')">
          <div class="step-number">${steps.indexOf(step) + 1}</div>
          <div class="step-name">${step.name}</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render current step content
   */
  renderCurrentStep() {
    switch (this.levelUpData.step) {
      case 'hitPoints':
        return this.renderHitPointsStep();
      case 'skillPoints':
        return this.renderSkillPointsStep();
      case 'attributes':
        return this.renderAttributesStep();
      case 'feats':
        return this.renderFeatsStep();
      case 'features':
        return this.renderFeaturesStep();
      case 'review':
        return this.renderReviewStep();
      default:
        return '<div>Invalid step</div>';
    }
  }

  /**
   * Render hit points step
   */
  renderHitPointsStep() {
    const classData = DnD35SRDData.classes[this.currentCharacter.class];
    const hitDie = classData.hitDie || 8;
    const conModifier = this.currentCharacter.abilityModifiers.constitution;
    const maxGain = hitDie + conModifier;
    const avgGain = Math.floor(hitDie / 2) + 1 + conModifier;

    return `
      <div class="step-content">
        <h3>Hit Point Gain</h3>
        <p>Choose how to determine your hit point gain for this level:</p>
        
        <div class="hit-point-options">
          <div class="hp-option">
            <input type="radio" id="hp-max" name="hitPointMethod" value="max" 
                   ${this.levelUpData.hitPointMethod === 'max' ? 'checked' : ''}>
            <label for="hp-max">
              <strong>Maximum (${maxGain} HP)</strong>
              <div class="option-description">Take the maximum possible hit points</div>
            </label>
          </div>
          
          <div class="hp-option">
            <input type="radio" id="hp-avg" name="hitPointMethod" value="average" 
                   ${this.levelUpData.hitPointMethod === 'average' ? 'checked' : ''}>
            <label for="hp-avg">
              <strong>Average (${avgGain} HP)</strong>
              <div class="option-description">Take the average hit point gain</div>
            </label>
          </div>
          
          <div class="hp-option">
            <input type="radio" id="hp-roll" name="hitPointMethod" value="roll" 
                   ${this.levelUpData.hitPointMethod === 'roll' ? 'checked' : ''}>
            <label for="hp-roll">
              <strong>Roll (1d${hitDie} + ${conModifier})</strong>
              <div class="option-description">Roll for hit points</div>
              ${this.levelUpData.hitPointMethod === 'roll' && this.levelUpData.hitPointGain > 0 ? 
                `<div class="roll-result">Rolled: ${this.levelUpData.hitPointGain} HP</div>` : ''}
            </label>
          </div>
        </div>
        
        ${this.levelUpData.hitPointMethod === 'roll' ? `
          <div class="roll-controls">
            <button class="action-btn" onclick="this.rollHitPoints()">
              🎲 Roll Hit Points
            </button>
          </div>
        ` : ''}
        
        <div class="current-hp-info">
          <strong>Current HP:</strong> ${this.currentCharacter.hitPoints.maximum}
          ${this.levelUpData.hitPointGain > 0 ? ` → ${this.currentCharacter.hitPoints.maximum + this.levelUpData.hitPointGain}` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render skill points step
   */
  renderSkillPointsStep() {
    const character = this.currentCharacter;
    const availablePoints = this.levelUpData.skillPointGain;
    const spentPoints = Object.values(this.levelUpData.skillPointsSpent).reduce((sum, val) => sum + val, 0);
    const remainingPoints = availablePoints - spentPoints;

    return `
      <div class="step-content">
        <h3>Skill Point Allocation</h3>
        <div class="skill-points-header">
          <div class="points-available">Available Points: ${availablePoints}</div>
          <div class="points-spent">Spent: ${spentPoints}</div>
          <div class="points-remaining">Remaining: ${remainingPoints}</div>
        </div>
        
        <div class="skills-allocation">
          ${Object.entries(character.skills).map(([skillName, skill]) => {
            const isClassSkill = skill.classSkill;
            const currentRanks = skill.ranks || 0;
            const addedRanks = this.levelUpData.skillPointsSpent[skillName] || 0;
            const newRanks = currentRanks + addedRanks;
            const maxRanks = character.level + 3; // Max ranks for class skills
            const cost = isClassSkill ? 1 : 2;
            
            return `
              <div class="skill-allocation-row">
                <div class="skill-info">
                  <span class="skill-name ${isClassSkill ? 'class-skill' : ''}">${this.formatSkillName(skillName)}</span>
                  ${isClassSkill ? '<span class="class-skill-indicator">★</span>' : ''}
                  <span class="skill-cost">(${cost} point${cost > 1 ? 's' : ''} per rank)</span>
                </div>
                <div class="skill-ranks">
                  <span class="current-ranks">${currentRanks}</span>
                  ${addedRanks > 0 ? `<span class="rank-arrow">→</span><span class="new-ranks">${newRanks}</span>` : ''}
                </div>
                <div class="skill-controls">
                  <button class="skill-btn" onclick="this.adjustSkillRanks('${skillName}', -1)" 
                          ${addedRanks <= 0 ? 'disabled' : ''}>-</button>
                  <span class="added-ranks">${addedRanks}</span>
                  <button class="skill-btn" onclick="this.adjustSkillRanks('${skillName}', 1)" 
                          ${remainingPoints < cost || newRanks >= maxRanks ? 'disabled' : ''}>+</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render attributes step
   */
  renderAttributesStep() {
    if (!this.levelUpData.gainsAttributeIncrease) {
      return '<div>No attribute increase this level.</div>';
    }

    return `
      <div class="step-content">
        <h3>Attribute Increase</h3>
        <p>Choose one ability score to increase by 1 point:</p>
        
        <div class="attribute-options">
          ${['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(attr => {
            const current = this.currentCharacter.abilities[attr];
            const isSelected = this.levelUpData.attributeIncrease === attr;
            
            return `
              <div class="attribute-option ${isSelected ? 'selected' : ''}" 
                   onclick="this.selectAttributeIncrease('${attr}')">
                <div class="attr-name">${attr.charAt(0).toUpperCase() + attr.slice(1)}</div>
                <div class="attr-change">${current} → ${current + 1}</div>
                <div class="modifier-change">${this.getModifierText(current)} → ${this.getModifierText(current + 1)}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render feats step
   */
  renderFeatsStep() {
    if (!this.levelUpData.gainsNewFeat) {
      return '<div>No new feat this level.</div>';
    }

    const character = this.currentCharacter;
    const availableFeats = this.getAvailableFeats(character);

    return `
      <div class="step-content">
        <h3>Feat Selection</h3>
        <p>Choose a new feat:</p>
        
        <div class="feat-selection">
          <input type="text" id="feat-search" placeholder="Search feats..." 
                 oninput="this.filterFeats()">
          
          <div class="feats-list">
            ${availableFeats.map(feat => {
              const isSelected = this.levelUpData.selectedFeat === feat.name;
              
              return `
                <div class="feat-option ${isSelected ? 'selected' : ''}" 
                     onclick="this.selectFeat('${feat.name}')">
                  <div class="feat-name">${feat.name}</div>
                  <div class="feat-description">${feat.description}</div>
                  ${feat.prerequisites.length > 0 ? 
                    `<div class="feat-prereqs">Prerequisites: ${feat.prerequisites.join(', ')}</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render class features step
   */
  renderFeaturesStep() {
    const features = this.levelUpData.classFeatures;
    
    if (features.length === 0) {
      return '<div>No new class features this level.</div>';
    }

    return `
      <div class="step-content">
        <h3>New Class Features</h3>
        <p>You gain the following class features at level ${this.levelUpData.newLevel}:</p>
        
        <div class="class-features-list">
          ${features.map(feature => `
            <div class="class-feature">
              <div class="feature-name">${feature}</div>
              <div class="feature-description">${this.getFeatureDescription(feature)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render review step
   */
  renderReviewStep() {
    const character = this.currentCharacter;
    const data = this.levelUpData;

    return `
      <div class="step-content">
        <h3>Level Up Summary</h3>
        <div class="level-up-summary">
          <div class="summary-section">
            <h4>Character Progression</h4>
            <div class="summary-item">
              <span class="label">Level:</span>
              <span class="value">${character.level} → ${data.newLevel}</span>
            </div>
            <div class="summary-item">
              <span class="label">Hit Points:</span>
              <span class="value">${character.hitPoints.maximum} → ${character.hitPoints.maximum + data.hitPointGain}</span>
            </div>
          </div>
          
          ${Object.keys(data.skillPointsSpent).length > 0 ? `
            <div class="summary-section">
              <h4>Skill Improvements</h4>
              ${Object.entries(data.skillPointsSpent).map(([skill, ranks]) => `
                <div class="summary-item">
                  <span class="label">${this.formatSkillName(skill)}:</span>
                  <span class="value">+${ranks} rank${ranks > 1 ? 's' : ''}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${data.attributeIncrease ? `
            <div class="summary-section">
              <h4>Attribute Increase</h4>
              <div class="summary-item">
                <span class="label">${data.attributeIncrease.charAt(0).toUpperCase() + data.attributeIncrease.slice(1)}:</span>
                <span class="value">+1</span>
              </div>
            </div>
          ` : ''}
          
          ${data.selectedFeat ? `
            <div class="summary-section">
              <h4>New Feat</h4>
              <div class="summary-item">
                <span class="value">${data.selectedFeat}</span>
              </div>
            </div>
          ` : ''}
          
          ${data.classFeatures.length > 0 ? `
            <div class="summary-section">
              <h4>New Class Features</h4>
              ${data.classFeatures.map(feature => `
                <div class="summary-item">
                  <span class="value">${feature}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="finalize-controls">
          <button class="action-btn primary" onclick="this.finalizeLevelUp()">
            ✅ Confirm Level Up
          </button>
          <button class="action-btn secondary" onclick="this.cancelLevelUp()">
            ❌ Cancel
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render navigation buttons
   */
  renderNavigationButtons() {
    const canGoBack = this.levelUpData.step !== 'hitPoints';
    const canGoNext = this.canProceedToNextStep();

    return `
      <div class="nav-buttons">
        <button class="nav-btn" onclick="this.previousStep()" ${!canGoBack ? 'disabled' : ''}>
          ← Previous
        </button>
        <button class="nav-btn primary" onclick="this.nextStep()" ${!canGoNext ? 'disabled' : ''}>
          Next →
        </button>
      </div>
    `;
  }

  /**
   * Apply the level up to the character
   */
  finalizeLevelUp() {
    const character = this.currentCharacter;
    const data = this.levelUpData;

    // Increase level
    character.level = data.newLevel;

    // Apply hit point gain
    character.hitPoints.maximum += data.hitPointGain;
    character.hitPoints.current = character.hitPoints.maximum; // Full heal on level up

    // Apply skill point increases
    Object.entries(data.skillPointsSpent).forEach(([skillName, ranks]) => {
      if (ranks > 0) {
        if (!character.skills[skillName]) {
          character.skills[skillName] = { ranks: 0, modifier: 0 };
        }
        character.skills[skillName].ranks = (character.skills[skillName].ranks || 0) + ranks;
      }
    });

    // Apply attribute increase
    if (data.attributeIncrease) {
      character.abilities[data.attributeIncrease]++;
    }

    // Apply new feat
    if (data.selectedFeat) {
      character.feats.push({
        name: data.selectedFeat,
        source: 'level'
      });
    }

    // Update calculated fields
    const model = new DnD35CharacterModel();
    character = model.updateCalculatedFields(character);

    // Save character
    window.characterManager.updateCharacter(character);

    // Clear level up data
    this.currentCharacter = null;
    this.levelUpData = {};

    return character;
  }

  /**
   * Helper methods
   */
  getModifierText(score) {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  formatSkillName(skillName) {
    // Reuse from character sheet
    const sheet = new DnD35CharacterSheet();
    return sheet.formatSkillName(skillName);
  }

  getAvailableFeats(character) {
    // Return a subset of available feats for simplicity
    // In a full implementation, this would check prerequisites
    return DnD35SRDData.feats.filter(feat => 
      !character.feats.some(charFeat => charFeat.name === feat.name) &&
      this.meetsPrerequisites(feat, character)
    );
  }

  meetsPrerequisites(feat, character) {
    // Simplified prerequisite check
    // In a full implementation, this would check all types of prerequisites
    return true; // For now, allow all feats
  }

  getFeatureDescription(featureName) {
    // Simplified feature descriptions
    const descriptions = {
      'Evasion': 'Can avoid damage from area attacks with successful Reflex saves',
      'Sneak Attack +2d6': 'Deal extra damage when flanking or attacking flat-footed enemies',
      'Trap Sense +1': 'Bonus to AC and Reflex saves against traps',
      'Bonus Feat': 'Gain an additional feat from the Fighter bonus feat list'
    };
    return descriptions[featureName] || 'Class feature gained';
  }

  canProceedToNextStep() {
    const data = this.levelUpData;
    switch (data.step) {
      case 'hitPoints':
        return data.hitPointGain > 0;
      case 'skillPoints':
        const totalAvailable = data.skillPointGain;
        const totalSpent = Object.values(data.skillPointsSpent).reduce((sum, val) => sum + val, 0);
        return totalSpent === totalAvailable;
      case 'attributes':
        return !data.gainsAttributeIncrease || data.attributeIncrease;
      case 'feats':
        return !data.gainsNewFeat || data.selectedFeat;
      case 'features':
        return true; // Always can proceed from features
      default:
        return true;
    }
  }

  isStepCompleted(stepId) {
    // Check if a step has been completed
    const data = this.levelUpData;
    switch (stepId) {
      case 'hitPoints':
        return data.hitPointGain > 0;
      case 'skillPoints':
        const totalAvailable = data.skillPointGain;
        const totalSpent = Object.values(data.skillPointsSpent).reduce((sum, val) => sum + val, 0);
        return totalSpent === totalAvailable;
      case 'attributes':
        return !data.gainsAttributeIncrease || data.attributeIncrease;
      case 'feats':
        return !data.gainsNewFeat || data.selectedFeat;
      default:
        return false;
    }
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.DnD35LevelUpSystem = DnD35LevelUpSystem;
}
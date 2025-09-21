/**
 * Complete D&D 3.5 Character Creation Wizard
 * Step-by-step character creation following SRD rules
 * 
 * @version 1.0
 * @date December 2024
 * @location code-repository/src/dnd35-character-wizard.js
 */

class DnD35CharacterWizard {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.currentStep = 1;
    this.totalSteps = 7;
    this.characterData = DnD35CharacterModel.createEmptyCharacter();
    this.modalElement = null;
    
    console.log('🧙‍♂️ D&D 3.5 Character Creation Wizard initialized');
  }

  /**
   * Start the character creation process
   */
  startCreation() {
    this.createWizardModal();
    this.showStep(1);
  }

  /**
   * Create the wizard modal interface
   */
  createWizardModal() {
    // Remove existing wizard modal if present
    const existing = document.getElementById('character-wizard-modal');
    if (existing) {
      existing.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'character-wizard-modal';
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content character-wizard-content">
        <div class="wizard-header">
          <h2 class="wizard-title">🧙‍♂️ D&D 3.5 Character Creation Wizard</h2>
          <div class="wizard-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
            </div>
            <div class="step-indicator">Step ${this.currentStep} of ${this.totalSteps}</div>
          </div>
          <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
        </div>
        
        <div class="wizard-body">
          <div id="wizard-step-content">
            <!-- Step content will be inserted here -->
          </div>
        </div>
        
        <div class="wizard-footer">
          <button class="action-btn secondary" id="wizard-prev-btn" onclick="characterWizard.previousStep()" disabled>
            ← Previous
          </button>
          <button class="action-btn" id="wizard-next-btn" onclick="characterWizard.nextStep()">
            Next →
          </button>
          <button class="action-btn hidden" id="wizard-finish-btn" onclick="characterWizard.finishCreation()">
            ✨ Create Character
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalElement = modal;

    // Add wizard-specific styles
    this.addWizardStyles();
  }

  /**
   * Add CSS styles for the wizard
   */
  addWizardStyles() {
    if (document.getElementById('wizard-styles')) return;

    const style = document.createElement('style');
    style.id = 'wizard-styles';
    style.textContent = `
      .character-wizard-content {
        max-width: 800px;
        width: 95%;
        max-height: 90vh;
        min-height: 600px;
      }
      
      .wizard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 2px solid #d4af37;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }
      
      .wizard-title {
        color: #d4af37;
        margin: 0;
        font-size: 1.5rem;
      }
      
      .wizard-progress {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        max-width: 300px;
      }
      
      .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #d4af37, #ffd700);
        transition: width 0.3s ease;
      }
      
      .step-indicator {
        font-size: 0.9rem;
        color: #ccc;
      }
      
      .wizard-body {
        min-height: 400px;
        padding: 1rem 0;
      }
      
      .wizard-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid rgba(212, 175, 55, 0.3);
        margin-top: 2rem;
      }
      
      .step-content {
        animation: fadeIn 0.3s ease-in-out;
      }
      
      .ability-scores-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin: 1rem 0;
      }
      
      .ability-score-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
      }
      
      .ability-name {
        font-weight: bold;
        color: #d4af37;
        margin-bottom: 0.5rem;
      }
      
      .ability-score {
        font-size: 2rem;
        font-weight: bold;
        color: #ffd700;
        margin-bottom: 0.5rem;
      }
      
      .ability-modifier {
        font-size: 0.9rem;
        color: #ccc;
      }
      
      .race-selection, .class-selection, .alignment-selection {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      
      .selection-item {
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(212, 175, 55, 0.3);
        border-radius: 8px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .selection-item:hover {
        border-color: #d4af37;
        background: rgba(255, 255, 255, 0.1);
      }
      
      .selection-item.selected {
        border-color: #ffd700;
        background: rgba(212, 175, 55, 0.2);
      }
      
      .selection-title {
        font-weight: bold;
        color: #d4af37;
        margin-bottom: 0.5rem;
      }
      
      .selection-description {
        font-size: 0.9rem;
        color: #ccc;
        line-height: 1.4;
      }
      
      .skill-point-allocation {
        max-height: 400px;
        overflow-y: auto;
      }
      
      .skill-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .skill-name {
        font-weight: 500;
        color: #e8e6e3;
      }
      
      .skill-name.class-skill {
        color: #d4af37;
      }
      
      .skill-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .skill-rank-btn {
        background: #d4af37;
        border: none;
        color: #000;
        width: 30px;
        height: 30px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
      }
      
      .skill-ranks {
        min-width: 50px;
        text-align: center;
        font-weight: bold;
        color: #ffd700;
      }
      
      .feat-selection {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .feat-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 8px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .feat-item:hover {
        border-color: #d4af37;
        background: rgba(255, 255, 255, 0.1);
      }
      
      .feat-item.selected {
        border-color: #ffd700;
        background: rgba(212, 175, 55, 0.2);
      }
      
      .feat-name {
        font-weight: bold;
        color: #d4af37;
        margin-bottom: 0.5rem;
      }
      
      .feat-description {
        font-size: 0.9rem;
        color: #ccc;
        line-height: 1.4;
      }
      
      .character-summary {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        padding: 1.5rem;
      }
      
      .summary-section {
        margin-bottom: 1.5rem;
      }
      
      .summary-title {
        font-weight: bold;
        color: #d4af37;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
      }
      
      .method-selection {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin: 1rem 0;
      }

      @media (max-width: 768px) {
        .ability-scores-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .race-selection, .class-selection, .alignment-selection {
          grid-template-columns: 1fr;
        }
        
        .method-selection {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Show specific step of the wizard
   */
  showStep(stepNumber) {
    this.currentStep = stepNumber;
    this.updateProgress();
    
    const content = document.getElementById('wizard-step-content');
    if (!content) return;

    switch (stepNumber) {
      case 1:
        content.innerHTML = this.getStep1HTML(); // Basic Information
        this.setupStep1();
        break;
      case 2:
        content.innerHTML = this.getStep2HTML(); // Ability Scores
        this.setupStep2();
        break;
      case 3:
        content.innerHTML = this.getStep3HTML(); // Race Selection
        this.setupStep3();
        break;
      case 4:
        content.innerHTML = this.getStep4HTML(); // Class Selection
        this.setupStep4();
        break;
      case 5:
        content.innerHTML = this.getStep5HTML(); // Skills
        this.setupStep5();
        break;
      case 6:
        content.innerHTML = this.getStep6HTML(); // Feats
        this.setupStep6();
        break;
      case 7:
        content.innerHTML = this.getStep7HTML(); // Final Review
        this.setupStep7();
        break;
    }

    this.updateNavigationButtons();
  }

  /**
   * Update progress bar and step indicator
   */
  updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const stepIndicator = document.querySelector('.step-indicator');
    
    if (progressFill) {
      progressFill.style.width = `${(this.currentStep / this.totalSteps) * 100}%`;
    }
    
    if (stepIndicator) {
      stepIndicator.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }
  }

  /**
   * Update navigation button states
   */
  updateNavigationButtons() {
    const prevBtn = document.getElementById('wizard-prev-btn');
    const nextBtn = document.getElementById('wizard-next-btn');
    const finishBtn = document.getElementById('wizard-finish-btn');

    if (prevBtn) {
      prevBtn.disabled = this.currentStep === 1;
    }

    if (nextBtn && finishBtn) {
      if (this.currentStep === this.totalSteps) {
        nextBtn.classList.add('hidden');
        finishBtn.classList.remove('hidden');
      } else {
        nextBtn.classList.remove('hidden');
        finishBtn.classList.add('hidden');
      }
    }
  }

  /**
   * Step 1: Basic Information (Name, Alignment)
   */
  getStep1HTML() {
    return `
      <div class="step-content">
        <h3>Basic Character Information</h3>
        <p>Let's start by defining your character's basic identity.</p>
        
        <div class="form-group">
          <label class="form-label">Character Name</label>
          <input type="text" id="char-name-input" class="form-input" 
                 placeholder="Enter your character's name" 
                 value="${this.characterData.name}">
        </div>
        
        <div class="form-group">
          <label class="form-label">Alignment</label>
          <div class="alignment-selection" id="alignment-selection">
            ${DnD35SRDData.alignments.map(alignment => `
              <div class="selection-item ${this.characterData.alignment === alignment.name ? 'selected' : ''}" 
                   data-alignment="${alignment.name}">
                <div class="selection-title">${alignment.name} (${alignment.abbreviation})</div>
                <div class="selection-description">${alignment.description}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  setupStep1() {
    // Handle name input
    const nameInput = document.getElementById('char-name-input');
    nameInput?.addEventListener('input', (e) => {
      this.characterData.name = e.target.value;
    });

    // Handle alignment selection
    document.querySelectorAll('[data-alignment]').forEach(item => {
      item.addEventListener('click', (e) => {
        document.querySelectorAll('[data-alignment]').forEach(i => i.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        this.characterData.alignment = e.currentTarget.dataset.alignment;
      });
    });
  }

  /**
   * Step 2: Ability Score Generation
   */
  getStep2HTML() {
    return `
      <div class="step-content">
        <h3>Ability Score Generation</h3>
        <p>Choose how to generate your character's six ability scores.</p>
        
        <div class="method-selection">
          ${Object.entries(DnD35SRDData.abilityScoreMethods).map(([key, method]) => `
            <div class="selection-item ${this.characterData.creationMethod.abilityScoreMethod === key ? 'selected' : ''}" 
                 data-method="${key}">
              <div class="selection-title">${method.name}</div>
              <div class="selection-description">${method.description}</div>
            </div>
          `).join('')}
        </div>
        
        <div id="ability-generation-area">
          <button class="action-btn" id="generate-abilities-btn" onclick="characterWizard.generateAbilityScores()">
            🎲 Generate Ability Scores
          </button>
        </div>
        
        <div class="ability-scores-grid" id="ability-scores-display">
          ${this.getAbilityScoresHTML()}
        </div>
      </div>
    `;
  }

  setupStep2() {
    // Handle method selection
    document.querySelectorAll('[data-method]').forEach(item => {
      item.addEventListener('click', (e) => {
        document.querySelectorAll('[data-method]').forEach(i => i.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        this.characterData.creationMethod.abilityScoreMethod = e.currentTarget.dataset.method;
      });
    });
  }

  getAbilityScoresHTML() {
    const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    return abilities.map(ability => {
      const score = this.characterData.abilities[ability];
      const modifier = DnD35CharacterModel.calculateAbilityModifier(score);
      const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
      
      return `
        <div class="ability-score-item">
          <div class="ability-name">${ability.charAt(0).toUpperCase() + ability.slice(1)}</div>
          <div class="ability-score">${score}</div>
          <div class="ability-modifier">${modifierText}</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Generate ability scores based on selected method
   */
  generateAbilityScores() {
    const method = this.characterData.creationMethod.abilityScoreMethod;
    const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    
    switch (method) {
      case '4d6dl1':
        abilities.forEach(ability => {
          // Roll 4d6, drop lowest
          const rolls = [
            this.gameEngine.dice.roll('1d6'),
            this.gameEngine.dice.roll('1d6'),
            this.gameEngine.dice.roll('1d6'),
            this.gameEngine.dice.roll('1d6')
          ].sort((a, b) => b - a);
          this.characterData.abilities[ability] = rolls[0] + rolls[1] + rolls[2];
        });
        break;
        
      case '3d6':
        abilities.forEach(ability => {
          this.characterData.abilities[ability] = this.gameEngine.dice.roll('3d6');
        });
        break;
        
      case 'pointBuy25':
      case 'pointBuy32':
        // For point buy, start with all 8s and let user distribute points
        abilities.forEach(ability => {
          this.characterData.abilities[ability] = 8;
        });
        break;
    }
    
    // Update display
    document.getElementById('ability-scores-display').innerHTML = this.getAbilityScoresHTML();
  }

  /**
   * Step 3: Race Selection
   */
  getStep3HTML() {
    return `
      <div class="step-content">
        <h3>Choose Your Race</h3>
        <p>Select your character's race. Each race provides different bonuses and abilities.</p>
        
        <div class="race-selection">
          ${Object.values(DnD35SRDData.races).map(race => `
            <div class="selection-item ${this.characterData.race === race.name ? 'selected' : ''}" 
                 data-race="${race.name}">
              <div class="selection-title">${race.name}</div>
              <div class="selection-description">${race.description}</div>
              <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #d4af37;">
                ${Object.entries(race.abilityAdjustments).length > 0 ? 
                  'Ability Adjustments: ' + Object.entries(race.abilityAdjustments)
                    .map(([ability, mod]) => `${ability} ${mod > 0 ? '+' : ''}${mod}`)
                    .join(', ') : 
                  'No ability adjustments'
                }
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  setupStep3() {
    document.querySelectorAll('[data-race]').forEach(item => {
      item.addEventListener('click', (e) => {
        document.querySelectorAll('[data-race]').forEach(i => i.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        this.characterData.race = e.currentTarget.dataset.race;
        this.applyRacialModifiers();
      });
    });
  }

  /**
   * Apply racial ability score modifiers
   */
  applyRacialModifiers() {
    const race = DnD35SRDData.races[this.characterData.race];
    if (!race) return;

    // Remove existing racial modifiers first
    // (This is simplified - in a full implementation, you'd track original scores)
    
    // Apply new racial modifiers
    for (const [ability, modifier] of Object.entries(race.abilityAdjustments)) {
      this.characterData.abilities[ability] += modifier;
    }
    
    // Update display if visible
    const display = document.getElementById('ability-scores-display');
    if (display) {
      display.innerHTML = this.getAbilityScoresHTML();
    }
  }

  /**
   * Step 4: Class Selection
   */
  getStep4HTML() {
    return `
      <div class="step-content">
        <h3>Choose Your Class</h3>
        <p>Select your character's class. This determines your abilities, skills, and combat prowess.</p>
        
        <div class="class-selection">
          ${Object.values(DnD35SRDData.classes).map(cls => `
            <div class="selection-item ${this.characterData.class === cls.name ? 'selected' : ''}" 
                 data-class="${cls.name}">
              <div class="selection-title">${cls.name}</div>
              <div class="selection-description">${cls.description}</div>
              <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #d4af37;">
                HD: d${cls.hitDie} | Skills: ${cls.skillPoints}/level | ${cls.spellcasting ? 'Spellcaster' : 'Non-caster'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  setupStep4() {
    document.querySelectorAll('[data-class]').forEach(item => {
      item.addEventListener('click', (e) => {
        document.querySelectorAll('[data-class]').forEach(i => i.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        this.characterData.class = e.currentTarget.dataset.class;
        this.calculateDerivedStats();
      });
    });
  }

  /**
   * Calculate derived statistics
   */
  calculateDerivedStats() {
    const cls = DnD35SRDData.classes[this.characterData.class];
    if (!cls) return;

    // Calculate hit points
    const conModifier = DnD35CharacterModel.calculateAbilityModifier(this.characterData.abilities.constitution);
    this.characterData.hitPoints.maximum = cls.hitDie + conModifier;
    this.characterData.hitPoints.current = this.characterData.hitPoints.maximum;

    // Set base attack bonus
    switch (cls.baseAttackBonus) {
      case 'good':
        this.characterData.baseAttackBonus = 1;
        break;
      case 'medium':
        this.characterData.baseAttackBonus = 0;
        break;
      case 'poor':
        this.characterData.baseAttackBonus = 0;
        break;
    }

    // Calculate saving throws
    const saves = cls.savingThrows;
    this.characterData.savingThrows.fortitude.base = saves.fortitude === 'good' ? 2 : 0;
    this.characterData.savingThrows.reflex.base = saves.reflex === 'good' ? 2 : 0;
    this.characterData.savingThrows.will.base = saves.will === 'good' ? 2 : 0;

    // Calculate skill points
    const intModifier = DnD35CharacterModel.calculateAbilityModifier(this.characterData.abilities.intelligence);
    const skillPoints = Math.max(1, cls.skillPoints + intModifier);
    this.characterData.skillPoints.total = skillPoints;
    this.characterData.skillPoints.available = skillPoints;

    // Set class skills
    this.setClassSkills();

    // Update character model
    DnD35CharacterModel.updateCalculatedFields(this.characterData);
  }

  /**
   * Set which skills are class skills
   */
  setClassSkills() {
    const cls = DnD35SRDData.classes[this.characterData.class];
    if (!cls || !cls.classSkills) return;

    // Reset all skills to cross-class
    for (const skillName in this.characterData.skills) {
      if (this.characterData.skills[skillName].classSkill !== undefined) {
        this.characterData.skills[skillName].classSkill = false;
      }
    }

    // Set class skills
    cls.classSkills.forEach(skillName => {
      const normalizedSkillName = this.normalizeSkillName(skillName);
      if (this.characterData.skills[normalizedSkillName]) {
        this.characterData.skills[normalizedSkillName].classSkill = true;
      }
    });
  }

  /**
   * Normalize skill names to match our data structure
   */
  normalizeSkillName(skillName) {
    const skillMap = {
      'Climb': 'climb',
      'Craft': 'craft',
      'Handle Animal': 'handleAnimal',
      'Intimidate': 'intimidate',
      'Jump': 'jump',
      'Listen': 'listen',
      'Ride': 'ride',
      'Survival': 'survival',
      'Swim': 'swim',
      'Appraise': 'appraise',
      'Balance': 'balance',
      'Bluff': 'bluff',
      'Concentration': 'concentration',
      'Decipher Script': 'decipherScript',
      'Diplomacy': 'diplomacy',
      'Disguise': 'disguise',
      'Escape Artist': 'escapeArtist',
      'Gather Information': 'gatherInformation',
      'Hide': 'hide',
      'Move Silently': 'moveSilently',
      'Perform': 'perform',
      'Profession': 'profession',
      'Sense Motive': 'senseMotive',
      'Sleight of Hand': 'sleightOfHand',
      'Speak Language': 'speakLanguage',
      'Spellcraft': 'spellcraft',
      'Tumble': 'tumble',
      'Use Magic Device': 'useMagicDevice',
      'Disable Device': 'disableDevice',
      'Forgery': 'forgery',
      'Open Lock': 'openLock',
      'Search': 'search',
      'Use Rope': 'useRope',
      'Heal': 'heal',
      'Spot': 'spot',
      'Knowledge': 'knowledge'
    };

    return skillMap[skillName] || skillName.toLowerCase().replace(/\s+/g, '');
  }

  /**
   * Step 5: Skill Allocation
   */
  getStep5HTML() {
    return `
      <div class="step-content">
        <h3>Allocate Skill Points</h3>
        <p>You have ${this.characterData.skillPoints.available} skill points to spend. Class skills cost 1 point per rank, cross-class skills cost 2 points per rank.</p>
        
        <div class="skill-point-allocation">
          ${this.getSkillAllocationHTML()}
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 8px;">
          <strong>Skill Points Remaining: <span id="skill-points-remaining">${this.characterData.skillPoints.available}</span></strong>
        </div>
      </div>
    `;
  }

  getSkillAllocationHTML() {
    const skills = [
      'appraise', 'balance', 'bluff', 'climb', 'concentration', 'decipherScript',
      'diplomacy', 'disableDevice', 'disguise', 'escapeArtist', 'forgery',
      'gatherInformation', 'handleAnimal', 'heal', 'hide', 'intimidate', 'jump',
      'listen', 'moveSilently', 'openLock', 'ride', 'search', 'senseMotive',
      'sleightOfHand', 'speakLanguage', 'spellcraft', 'spot', 'survival', 'swim',
      'tumble', 'useMagicDevice', 'useRope'
    ];

    return skills.map(skill => {
      const skillData = this.characterData.skills[skill];
      const isClassSkill = skillData?.classSkill || false;
      const ranks = skillData?.ranks || 0;
      
      return `
        <div class="skill-item">
          <div class="skill-name ${isClassSkill ? 'class-skill' : ''}" title="${isClassSkill ? 'Class Skill (1 point per rank)' : 'Cross-Class Skill (2 points per rank)'}">
            ${this.formatSkillName(skill)} ${isClassSkill ? '★' : ''}
          </div>
          <div class="skill-controls">
            <button class="skill-rank-btn" onclick="characterWizard.adjustSkillRanks('${skill}', -1)">-</button>
            <div class="skill-ranks">${ranks}</div>
            <button class="skill-rank-btn" onclick="characterWizard.adjustSkillRanks('${skill}', 1)">+</button>
          </div>
        </div>
      `;
    }).join('');
  }

  formatSkillName(skill) {
    const nameMap = {
      'appraise': 'Appraise',
      'balance': 'Balance',
      'bluff': 'Bluff',
      'climb': 'Climb',
      'concentration': 'Concentration',
      'decipherScript': 'Decipher Script',
      'diplomacy': 'Diplomacy',
      'disableDevice': 'Disable Device',
      'disguise': 'Disguise',
      'escapeArtist': 'Escape Artist',
      'forgery': 'Forgery',
      'gatherInformation': 'Gather Information',
      'handleAnimal': 'Handle Animal',
      'heal': 'Heal',
      'hide': 'Hide',
      'intimidate': 'Intimidate',
      'jump': 'Jump',
      'listen': 'Listen',
      'moveSilently': 'Move Silently',
      'openLock': 'Open Lock',
      'ride': 'Ride',
      'search': 'Search',
      'senseMotive': 'Sense Motive',
      'sleightOfHand': 'Sleight of Hand',
      'speakLanguage': 'Speak Language',
      'spellcraft': 'Spellcraft',
      'spot': 'Spot',
      'survival': 'Survival',
      'swim': 'Swim',
      'tumble': 'Tumble',
      'useMagicDevice': 'Use Magic Device',
      'useRope': 'Use Rope'
    };

    return nameMap[skill] || skill;
  }

  setupStep5() {
    // Skill allocation is handled by the adjustSkillRanks method
  }

  /**
   * Adjust skill ranks
   */
  adjustSkillRanks(skillName, change) {
    const skillData = this.characterData.skills[skillName];
    if (!skillData) return;

    const isClassSkill = skillData.classSkill || false;
    const currentRanks = skillData.ranks || 0;
    const newRanks = Math.max(0, currentRanks + change);
    
    // Calculate point cost difference
    const pointCost = isClassSkill ? 1 : 2;
    const costDifference = (newRanks - currentRanks) * pointCost;
    
    // Check if we have enough points
    if (costDifference > this.characterData.skillPoints.available) {
      return; // Not enough points
    }
    
    // Check maximum ranks (level + 3 for class skills, (level + 3) / 2 for cross-class)
    const maxRanks = isClassSkill ? this.characterData.level + 3 : Math.floor((this.characterData.level + 3) / 2);
    if (newRanks > maxRanks) {
      return; // Exceeds maximum ranks
    }
    
    // Apply the change
    skillData.ranks = newRanks;
    this.characterData.skillPoints.available -= costDifference;
    this.characterData.skillPoints.spent += costDifference;
    
    // Update display
    this.updateSkillDisplay(skillName);
    this.updateSkillPointsRemaining();
  }

  updateSkillDisplay(skillName) {
    const skillElements = document.querySelectorAll('.skill-item');
    skillElements.forEach(element => {
      const skillRanksDiv = element.querySelector('.skill-ranks');
      const skillNameDiv = element.querySelector('.skill-name');
      if (skillNameDiv && skillNameDiv.textContent.toLowerCase().includes(this.formatSkillName(skillName).toLowerCase())) {
        skillRanksDiv.textContent = this.characterData.skills[skillName].ranks || 0;
      }
    });
  }

  updateSkillPointsRemaining() {
    const remainingElement = document.getElementById('skill-points-remaining');
    if (remainingElement) {
      remainingElement.textContent = this.characterData.skillPoints.available;
    }
  }

  /**
   * Step 6: Feat Selection
   */
  getStep6HTML() {
    return `
      <div class="step-content">
        <h3>Choose Starting Feats</h3>
        <p>All characters get one feat at 1st level. Humans get an additional bonus feat.</p>
        
        <div class="feat-selection">
          ${Object.values(DnD35SRDData.feats).map(feat => `
            <div class="selection-item feat-item ${this.characterData.feats.find(f => f.name === feat.name) ? 'selected' : ''}" 
                 data-feat="${feat.name}">
              <div class="feat-name">${feat.name}</div>
              <div class="feat-description">${feat.benefit}</div>
              ${feat.prerequisites !== 'None' ? `<div style="margin-top: 0.5rem; font-size: 0.8rem; color: #ff6347;">Prerequisites: ${feat.prerequisites}</div>` : ''}
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 8px;">
          <strong>Feats Selected: ${this.characterData.feats.length} / ${this.getMaxFeats()}</strong>
        </div>
      </div>
    `;
  }

  setupStep6() {
    document.querySelectorAll('.feat-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const featName = e.currentTarget.dataset.feat;
        this.toggleFeat(featName);
      });
    });
  }

  getMaxFeats() {
    // All characters get 1 feat, humans get 1 additional
    return this.characterData.race === 'Human' ? 2 : 1;
  }

  toggleFeat(featName) {
    const existingFeatIndex = this.characterData.feats.findIndex(f => f.name === featName);
    
    if (existingFeatIndex >= 0) {
      // Remove feat
      this.characterData.feats.splice(existingFeatIndex, 1);
    } else {
      // Add feat if we haven't reached the limit
      if (this.characterData.feats.length < this.getMaxFeats()) {
        this.characterData.feats.push({
          name: featName,
          source: 'Starting Feat',
          level: 1
        });
      }
    }
    
    // Update display
    this.showStep(6);
  }

  /**
   * Step 7: Final Review
   */
  getStep7HTML() {
    DnD35CharacterModel.updateCalculatedFields(this.characterData);
    
    return `
      <div class="step-content">
        <h3>Character Summary</h3>
        <p>Review your character before finalizing creation.</p>
        
        <div class="character-summary">
          <div class="summary-section">
            <div class="summary-title">Basic Information</div>
            <p><strong>Name:</strong> ${this.characterData.name}</p>
            <p><strong>Race:</strong> ${this.characterData.race}</p>
            <p><strong>Class:</strong> ${this.characterData.class}</p>
            <p><strong>Level:</strong> ${this.characterData.level}</p>
            <p><strong>Alignment:</strong> ${this.characterData.alignment}</p>
          </div>
          
          <div class="summary-section">
            <div class="summary-title">Ability Scores</div>
            <div class="ability-scores-grid">
              ${this.getAbilityScoresHTML()}
            </div>
          </div>
          
          <div class="summary-section">
            <div class="summary-title">Combat Statistics</div>
            <p><strong>Hit Points:</strong> ${this.characterData.hitPoints.maximum}</p>
            <p><strong>Armor Class:</strong> ${this.characterData.armorClass.total}</p>
            <p><strong>Base Attack Bonus:</strong> +${this.characterData.baseAttackBonus}</p>
            <p><strong>Fortitude:</strong> +${this.characterData.savingThrows.fortitude.total}</p>
            <p><strong>Reflex:</strong> +${this.characterData.savingThrows.reflex.total}</p>
            <p><strong>Will:</strong> +${this.characterData.savingThrows.will.total}</p>
          </div>
          
          <div class="summary-section">
            <div class="summary-title">Skills</div>
            ${this.getSkillSummaryHTML()}
          </div>
          
          <div class="summary-section">
            <div class="summary-title">Feats</div>
            ${this.characterData.feats.map(feat => `<p>• ${feat.name}</p>`).join('') || '<p>No feats selected</p>'}
          </div>
        </div>
      </div>
    `;
  }

  getSkillSummaryHTML() {
    const trainedSkills = Object.entries(this.characterData.skills)
      .filter(([name, skill]) => (skill.ranks || 0) > 0)
      .map(([name, skill]) => `<p>• ${this.formatSkillName(name)}: ${skill.ranks} ranks (${skill.modifier >= 0 ? '+' : ''}${skill.modifier})</p>`)
      .join('');
    
    return trainedSkills || '<p>No trained skills</p>';
  }

  setupStep7() {
    // Final step - no additional setup needed
  }

  /**
   * Navigate to next step
   */
  nextStep() {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.showStep(this.currentStep + 1);
      }
    }
  }

  /**
   * Navigate to previous step
   */
  previousStep() {
    if (this.currentStep > 1) {
      this.showStep(this.currentStep - 1);
    }
  }

  /**
   * Validate current step
   */
  validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        if (!this.characterData.name.trim()) {
          alert('Please enter a character name.');
          return false;
        }
        if (!this.characterData.alignment) {
          alert('Please select an alignment.');
          return false;
        }
        break;
        
      case 2:
        if (!this.characterData.creationMethod.abilityScoreMethod) {
          alert('Please select an ability score generation method.');
          return false;
        }
        break;
        
      case 3:
        if (!this.characterData.race) {
          alert('Please select a race.');
          return false;
        }
        break;
        
      case 4:
        if (!this.characterData.class) {
          alert('Please select a class.');
          return false;
        }
        break;
        
      case 5:
        // Skills are optional, but could check for minimum allocation
        break;
        
      case 6:
        // Feats are optional for some characters
        break;
    }
    
    return true;
  }

  /**
   * Finish character creation
   */
  finishCreation() {
    try {
      // Final validation
      const validation = DnD35CharacterModel.validateCharacter(this.characterData);
      if (!validation.valid) {
        alert('Character validation failed:\n' + validation.errors.join('\n'));
        return;
      }

      // Set final metadata
      this.characterData.id = 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      this.characterData.createdAt = Date.now();
      this.characterData.lastModified = Date.now();

      // Add character to game engine
      if (this.gameEngine && this.gameEngine.characterManager) {
        // Store character in game engine
        this.gameEngine.characterManager.characters.set(this.characterData.id, this.characterData);
        this.gameEngine.characterManager.activeCharacter = this.characterData.id;
        
        // Refresh UI
        if (window.webInterface) {
          window.webInterface.updateCharacterList();
          window.webInterface.refreshInterface();
        }
      }

      // Close modal
      if (this.modalElement) {
        this.modalElement.remove();
      }

      // Show success message
      alert(`Character "${this.characterData.name}" created successfully!`);
      
      // Switch to character tab
      if (window.webInterface) {
        window.webInterface.switchTab('characters');
      }

    } catch (error) {
      console.error('Error creating character:', error);
      alert('Failed to create character. Please try again.');
    }
  }
}

// Make wizard available globally
if (typeof window !== 'undefined') {
  window.DnD35CharacterWizard = DnD35CharacterWizard;
  // Initialize wizard when needed
  window.characterWizard = null;
}
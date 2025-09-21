/**
 * Complete D&D 3.5 Character Sheet Display
 * Comprehensive character sheet rendering and management
 * 
 * @version 1.0
 * @date December 2024
 * @location code-repository/src/dnd35-character-sheet.js
 */

class DnD35CharacterSheet {
  constructor() {
    this.currentCharacter = null;
    console.log('📋 D&D 3.5 Character Sheet Display initialized');
  }

  /**
   * Render complete character sheet
   */
  renderCharacterSheet(character) {
    if (!character) {
      return this.renderEmptySheet();
    }

    this.currentCharacter = character;

    return `
      <div class="character-sheet">
        ${this.renderCharacterHeader(character)}
        ${this.renderAbilityScores(character)}
        ${this.renderCombatStats(character)}
        ${this.renderSavingThrows(character)}
        ${this.renderSkillsSection(character)}
        ${this.renderFeatsSection(character)}
        ${this.renderEquipmentSection(character)}
        ${this.renderSpellsSection(character)}
        ${this.renderCharacterNotes(character)}
        ${this.renderCharacterActions(character)}
      </div>
    `;
  }

  /**
   * Render empty character sheet placeholder
   */
  renderEmptySheet() {
    return `
      <div class="character-sheet-empty">
        <div class="empty-state">
          <h3>No Character Selected</h3>
          <p>Select a character from the list to view their character sheet, or create a new character.</p>
          <button class="action-btn" onclick="this.startCharacterCreation()">
            ✨ Create New Character
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render character header with basic info
   */
  renderCharacterHeader(character) {
    return `
      <div class="character-header">
        <div class="character-identity">
          <h2 class="character-name">${character.name}</h2>
          <div class="character-basic-info">
            <span class="info-item">Level ${character.level} ${character.race} ${character.class}</span>
            <span class="info-item">${character.alignment}</span>
            <span class="status-indicator status-${character.status}">${character.status.toUpperCase()}</span>
          </div>
        </div>
        
        <div class="character-portrait">
          <div class="portrait-placeholder">
            ${character.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render ability scores section
   */
  renderAbilityScores(character) {
    const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    
    return `
      <div class="character-section">
        <h3 class="section-title">Ability Scores</h3>
        <div class="ability-scores-grid">
          ${abilities.map(ability => {
            const score = character.abilities[ability];
            const modifier = character.abilityModifiers[ability];
            const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            
            return `
              <div class="ability-score-block">
                <div class="ability-name">${ability.charAt(0).toUpperCase() + ability.slice(1).substr(0, 2)}</div>
                <div class="ability-score">${score}</div>
                <div class="ability-modifier">${modifierText}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render combat statistics
   */
  renderCombatStats(character) {
    return `
      <div class="character-section">
        <h3 class="section-title">Combat Statistics</h3>
        
        <div class="combat-stats-grid">
          <div class="hit-points-section">
            <h4>Hit Points</h4>
            <div class="hp-display">
              <div class="hp-bar-container">
                <div class="hp-bar">
                  <div class="hp-bar-fill" style="width: ${(character.hitPoints.current / character.hitPoints.maximum) * 100}%"></div>
                  <div class="hp-text">${character.hitPoints.current} / ${character.hitPoints.maximum}</div>
                </div>
              </div>
              ${character.hitPoints.temporary > 0 ? `<div class="temp-hp">Temporary: ${character.hitPoints.temporary}</div>` : ''}
            </div>
            <div class="hp-controls">
              <button class="action-btn danger" onclick="this.openDamageModal()">Damage</button>
              <button class="action-btn" onclick="this.openHealingModal()">Heal</button>
            </div>
          </div>
          
          <div class="armor-class-section">
            <h4>Armor Class</h4>
            <div class="ac-display">
              <div class="ac-total">${character.armorClass.total}</div>
              <div class="ac-breakdown">
                <div>Touch: ${character.armorClass.touch}</div>
                <div>Flat-footed: ${character.armorClass.flatFooted}</div>
              </div>
              <div class="ac-components">
                <div class="component-grid">
                  <span>Base: 10</span>
                  <span>Armor: ${character.armorClass.armor}</span>
                  <span>Shield: ${character.armorClass.shield}</span>
                  <span>Dex: ${character.armorClass.dexterity}</span>
                  <span>Size: ${character.armorClass.size}</span>
                  <span>Natural: ${character.armorClass.natural}</span>
                  <span>Deflection: ${character.armorClass.deflection}</span>
                  <span>Misc: ${character.armorClass.misc}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="attack-section">
            <h4>Attack Bonuses</h4>
            <div class="attack-display">
              <div class="bab">Base Attack: +${character.baseAttackBonus}</div>
              <div class="attack-bonuses">
                <div>Melee: +${character.baseAttackBonus + character.abilityModifiers.strength}</div>
                <div>Ranged: +${character.baseAttackBonus + character.abilityModifiers.dexterity}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render saving throws
   */
  renderSavingThrows(character) {
    return `
      <div class="character-section">
        <h3 class="section-title">Saving Throws</h3>
        <div class="saving-throws-grid">
          ${Object.entries(character.savingThrows).map(([saveName, saveData]) => `
            <div class="saving-throw-block">
              <div class="save-name">${saveName.charAt(0).toUpperCase() + saveName.slice(1)}</div>
              <div class="save-total">+${saveData.total}</div>
              <div class="save-breakdown">
                Base: ${saveData.base}, 
                Ability: ${saveData.ability >= 0 ? '+' : ''}${saveData.ability}
                ${saveData.magic > 0 ? `, Magic: +${saveData.magic}` : ''}
                ${saveData.misc > 0 ? `, Misc: +${saveData.misc}` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render skills section
   */
  renderSkillsSection(character) {
    const trainedSkills = Object.entries(character.skills)
      .filter(([name, skill]) => (skill.ranks || 0) > 0)
      .sort(([a], [b]) => this.formatSkillName(a).localeCompare(this.formatSkillName(b)));

    const untrainedSkills = Object.entries(character.skills)
      .filter(([name, skill]) => (skill.ranks || 0) === 0 && this.canUseUntrained(name))
      .sort(([a], [b]) => this.formatSkillName(a).localeCompare(this.formatSkillName(b)));

    return `
      <div class="character-section">
        <h3 class="section-title">Skills 
          <span class="skill-points-info">
            (${character.skillPoints.spent}/${character.skillPoints.total} points spent)
          </span>
        </h3>
        
        ${trainedSkills.length > 0 ? `
          <div class="skills-subsection">
            <h4>Trained Skills</h4>
            <div class="skills-list">
              ${trainedSkills.map(([skillName, skill]) => this.renderSkillItem(skillName, skill, true)).join('')}
            </div>
          </div>
        ` : ''}
        
        ${untrainedSkills.length > 0 ? `
          <div class="skills-subsection">
            <h4>Untrained Skills</h4>
            <div class="skills-list">
              ${untrainedSkills.slice(0, 10).map(([skillName, skill]) => this.renderSkillItem(skillName, skill, false)).join('')}
            </div>
            ${untrainedSkills.length > 10 ? `<div class="skills-more">...and ${untrainedSkills.length - 10} more</div>` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  renderSkillItem(skillName, skill, showRanks = true) {
    const modifier = skill.modifier || 0;
    const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
    const isClassSkill = skill.classSkill || false;
    const ranks = skill.ranks || 0;

    return `
      <div class="skill-item">
        <div class="skill-info">
          <span class="skill-name ${isClassSkill ? 'class-skill' : ''}">${this.formatSkillName(skillName)}</span>
          ${isClassSkill ? '<span class="class-skill-indicator">★</span>' : ''}
        </div>
        <div class="skill-value">
          ${showRanks ? `<span class="skill-ranks">${ranks}</span>` : ''}
          <span class="skill-modifier">${modifierText}</span>
        </div>
      </div>
    `;
  }

  /**
   * Render feats section
   */
  renderFeatsSection(character) {
    return `
      <div class="character-section">
        <h3 class="section-title">Feats</h3>
        <div class="feats-list">
          ${character.feats.length > 0 ? 
            character.feats.map(feat => `
              <div class="feat-item">
                <div class="feat-name">${feat.name}</div>
                ${feat.source ? `<div class="feat-source">(${feat.source})</div>` : ''}
              </div>
            `).join('') : 
            '<div class="no-items">No feats acquired</div>'
          }
        </div>
      </div>
    `;
  }

  /**
   * Render equipment section
   */
  renderEquipmentSection(character) {
    return `
      <div class="character-section">
        <h3 class="section-title">Equipment</h3>
        
        <div class="equipment-grid">
          <div class="worn-equipment">
            <h4>Worn Equipment</h4>
            <div class="equipment-slots">
              <div class="equipment-slot">
                <span class="slot-name">Armor:</span>
                <span class="slot-item">${character.equipment.armor?.name || 'None'}</span>
              </div>
              <div class="equipment-slot">
                <span class="slot-name">Shield:</span>
                <span class="slot-item">${character.equipment.shield?.name || 'None'}</span>
              </div>
            </div>
          </div>
          
          <div class="weapons-section">
            <h4>Weapons</h4>
            <div class="weapons-list">
              ${character.equipment.weapons.length > 0 ?
                character.equipment.weapons.map(weapon => `
                  <div class="weapon-item">
                    <span class="weapon-name">${weapon.name}</span>
                    <span class="weapon-damage">${weapon.damage}</span>
                  </div>
                `).join('') :
                '<div class="no-items">No weapons equipped</div>'
              }
            </div>
          </div>
          
          <div class="money-section">
            <h4>Money</h4>
            <div class="money-display">
              <div class="coin-amount">
                <span class="coin-type">Platinum:</span>
                <span class="coin-value">${character.equipment.money.platinum || 0}</span>
              </div>
              <div class="coin-amount">
                <span class="coin-type">Gold:</span>
                <span class="coin-value">${character.equipment.money.gold || 0}</span>
              </div>
              <div class="coin-amount">
                <span class="coin-type">Silver:</span>
                <span class="coin-value">${character.equipment.money.silver || 0}</span>
              </div>
              <div class="coin-amount">
                <span class="coin-type">Copper:</span>
                <span class="coin-value">${character.equipment.money.copper || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render spells section (if applicable)
   */
  renderSpellsSection(character) {
    const cls = DnD35SRDData.classes[character.class];
    if (!cls || !cls.spellcasting) {
      return ''; // Non-spellcasters don't need this section
    }

    return `
      <div class="character-section">
        <h3 class="section-title">Spellcasting</h3>
        
        <div class="spellcasting-info">
          <div class="caster-level">Caster Level: ${character.spellcasting.casterLevel}</div>
          <div class="spell-ability">Spellcasting Ability: ${cls.spellcastingAbility}</div>
        </div>
        
        <div class="spell-slots-grid">
          ${Object.entries(character.spellcasting.spellSlots).map(([level, slots]) => {
            if (level === '0' || slots.max > 0) {
              return `
                <div class="spell-slot-level">
                  <div class="spell-level">${level === '0' ? 'Cantrips' : `Level ${level}`}</div>
                  <div class="slots-display">
                    <div class="slots-used">${slots.used}</div>
                    <div class="slots-separator">/</div>
                    <div class="slots-max">${slots.max}</div>
                  </div>
                </div>
              `;
            }
            return '';
          }).join('')}
        </div>
        
        ${character.spellcasting.spellsKnown.length > 0 ? `
          <div class="spells-known">
            <h4>Spells Known</h4>
            <div class="spells-list">
              ${character.spellcasting.spellsKnown.map(spell => `
                <div class="spell-item">${spell.name} (Level ${spell.level})</div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${character.spellcasting.spellsPrepared.length > 0 ? `
          <div class="spells-prepared">
            <h4>Prepared Spells</h4>
            <div class="spells-list">
              ${character.spellcasting.spellsPrepared.map(spell => `
                <div class="spell-item">${spell.name} (Level ${spell.level})</div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Render character notes and background
   */
  renderCharacterNotes(character) {
    return `
      <div class="character-section">
        <h3 class="section-title">Character Background</h3>
        
        <div class="background-grid">
          <div class="physical-description">
            <h4>Physical Description</h4>
            <div class="description-item">
              <span class="desc-label">Age:</span>
              <span class="desc-value">${character.description.age || 'Unknown'}</span>
            </div>
            <div class="description-item">
              <span class="desc-label">Gender:</span>
              <span class="desc-value">${character.description.gender || 'Unknown'}</span>
            </div>
            <div class="description-item">
              <span class="desc-label">Height:</span>
              <span class="desc-value">${character.description.height || 'Unknown'}</span>
            </div>
            <div class="description-item">
              <span class="desc-label">Weight:</span>
              <span class="desc-value">${character.description.weight || 'Unknown'}</span>
            </div>
            <div class="description-item">
              <span class="desc-label">Eyes:</span>
              <span class="desc-value">${character.description.eyes || 'Unknown'}</span>
            </div>
            <div class="description-item">
              <span class="desc-label">Hair:</span>
              <span class="desc-value">${character.description.hair || 'Unknown'}</span>
            </div>
          </div>
          
          <div class="personality-traits">
            <h4>Personality & Background</h4>
            <div class="trait-item">
              <span class="trait-label">Personality:</span>
              <span class="trait-value">${character.background.personality || 'Not defined'}</span>
            </div>
            <div class="trait-item">
              <span class="trait-label">Ideals:</span>
              <span class="trait-value">${character.background.ideals || 'Not defined'}</span>
            </div>
            <div class="trait-item">
              <span class="trait-label">Bonds:</span>
              <span class="trait-value">${character.background.bonds || 'Not defined'}</span>
            </div>
            <div class="trait-item">
              <span class="trait-label">Flaws:</span>
              <span class="trait-value">${character.background.flaws || 'Not defined'}</span>
            </div>
          </div>
        </div>
        
        ${character.background.backstory ? `
          <div class="backstory">
            <h4>Backstory</h4>
            <div class="backstory-text">${character.background.backstory}</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Render character action buttons
   */
  renderCharacterActions(character) {
    return `
      <div class="character-section">
        <h3 class="section-title">Character Actions</h3>
        <div class="character-actions">
          <button class="action-btn" onclick="this.editCharacter('${character.id}')">
            ✏️ Edit Character
          </button>
          <button class="action-btn secondary" onclick="this.levelUpCharacter('${character.id}')">
            ⬆️ Level Up
          </button>
          <button class="action-btn secondary" onclick="this.manageEquipment('${character.id}')">
            ⚔️ Manage Equipment
          </button>
          <button class="action-btn secondary" onclick="this.manageSpells('${character.id}')">
            ✨ Manage Spells
          </button>
          <button class="action-btn danger" onclick="this.deleteCharacter('${character.id}')">
            🗑️ Delete Character
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Format skill name for display
   */
  formatSkillName(skillName) {
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

    return nameMap[skillName] || skillName;
  }

  /**
   * Check if skill can be used untrained
   */
  canUseUntrained(skillName) {
    const trainedOnlySkills = ['disableDevice', 'openLock', 'speakLanguage', 'spellcraft', 'useMagicDevice'];
    return !trainedOnlySkills.includes(skillName);
  }

  /**
   * Add character sheet specific styles
   */
  static addCharacterSheetStyles() {
    if (document.getElementById('character-sheet-styles')) return;

    const style = document.createElement('style');
    style.id = 'character-sheet-styles';
    style.textContent = `
      .character-sheet {
        max-height: 80vh;
        overflow-y: auto;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
      }
      
      .character-sheet-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 400px;
        text-align: center;
        color: #ccc;
      }
      
      .character-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: rgba(212, 175, 55, 0.1);
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid rgba(212, 175, 55, 0.3);
      }
      
      .character-name {
        color: #d4af37;
        margin: 0;
        font-size: 1.5rem;
      }
      
      .character-basic-info {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 0.5rem;
      }
      
      .info-item {
        color: #ccc;
        font-size: 0.9rem;
      }
      
      .status-indicator {
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: bold;
        text-transform: uppercase;
      }
      
      .portrait-placeholder {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #d4af37, #ffd700);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        color: #000;
      }
      
      .character-section {
        margin-bottom: 2rem;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .section-title {
        color: #d4af37;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(212, 175, 55, 0.3);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .ability-scores-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 0.5rem;
      }
      
      .ability-score-block {
        text-align: center;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        border: 1px solid rgba(212, 175, 55, 0.3);
      }
      
      .ability-name {
        font-size: 0.8rem;
        color: #d4af37;
        font-weight: bold;
        text-transform: uppercase;
      }
      
      .ability-score {
        font-size: 1.2rem;
        font-weight: bold;
        color: #ffd700;
        margin: 0.2rem 0;
      }
      
      .ability-modifier {
        font-size: 0.8rem;
        color: #ccc;
      }
      
      .combat-stats-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 1rem;
      }
      
      .hp-display {
        margin-bottom: 0.5rem;
      }
      
      .hp-bar-container {
        background: rgba(0, 0, 0, 0.5);
        border-radius: 6px;
        padding: 0.3rem;
        margin-bottom: 0.5rem;
      }
      
      .hp-bar {
        background: #8b0000;
        height: 20px;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
      }
      
      .hp-bar-fill {
        background: linear-gradient(90deg, #228b22, #32cd32);
        height: 100%;
        transition: width 0.5s ease;
      }
      
      .hp-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-weight: bold;
        font-size: 0.8rem;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      }
      
      .hp-controls {
        display: flex;
        gap: 0.5rem;
      }
      
      .ac-display {
        text-align: center;
      }
      
      .ac-total {
        font-size: 2rem;
        font-weight: bold;
        color: #d4af37;
        margin-bottom: 0.5rem;
      }
      
      .ac-breakdown {
        font-size: 0.8rem;
        color: #ccc;
        margin-bottom: 0.5rem;
      }
      
      .component-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.2rem;
        font-size: 0.7rem;
        color: #aaa;
      }
      
      .saving-throws-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }
      
      .saving-throw-block {
        text-align: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        border: 1px solid rgba(212, 175, 55, 0.3);
      }
      
      .save-name {
        font-weight: bold;
        color: #d4af37;
        margin-bottom: 0.5rem;
      }
      
      .save-total {
        font-size: 1.5rem;
        font-weight: bold;
        color: #ffd700;
        margin-bottom: 0.5rem;
      }
      
      .save-breakdown {
        font-size: 0.7rem;
        color: #ccc;
      }
      
      .skills-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 0.3rem;
      }
      
      .skill-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
      }
      
      .skill-info {
        display: flex;
        align-items: center;
        gap: 0.3rem;
      }
      
      .skill-name.class-skill {
        color: #d4af37;
        font-weight: bold;
      }
      
      .class-skill-indicator {
        color: #ffd700;
        font-size: 0.8rem;
      }
      
      .skill-value {
        display: flex;
        gap: 0.3rem;
        font-weight: bold;
      }
      
      .skill-ranks {
        color: #ffd700;
        font-size: 0.8rem;
      }
      
      .feats-list, .equipment-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.5rem;
      }
      
      .feat-item {
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        border-left: 3px solid #d4af37;
      }
      
      .feat-name {
        font-weight: bold;
        color: #d4af37;
      }
      
      .equipment-slots, .weapons-list, .money-display {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      
      .equipment-slot, .weapon-item, .coin-amount {
        display: flex;
        justify-content: space-between;
        padding: 0.3rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
      }
      
      .character-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      
      .no-items {
        color: #666;
        font-style: italic;
        text-align: center;
        padding: 1rem;
      }
      
      @media (max-width: 768px) {
        .ability-scores-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        
        .combat-stats-grid {
          grid-template-columns: 1fr;
        }
        
        .saving-throws-grid {
          grid-template-columns: 1fr;
        }
        
        .character-header {
          flex-direction: column;
          text-align: center;
          gap: 1rem;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.DnD35CharacterSheet = DnD35CharacterSheet;
  // Add styles when script loads
  DnD35CharacterSheet.addCharacterSheetStyles();
}
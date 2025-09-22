/**
 * DiceIntegrationInterface - Character Sheet Integrated Dice Rolling Interface
 * Provides seamless dice rolling integration with D&D 3.5 character data
 */

class DiceIntegrationInterface {
    constructor(diceEngine, targetContainer, characterRef = null) {
        this.diceEngine = diceEngine;
        this.container = targetContainer;
        this.characterRef = characterRef;
        this.currentCharacter = null;
        this.rollHistory = [];
        this.initialize();
    }

    initialize() {
        this.createDiceHTML();
        this.attachEventListeners();
        this.setupCharacterIntegration();
        console.log('🎲 DiceIntegrationInterface initialized successfully');
    }

    // ==================== HTML GENERATION ====================

    createDiceHTML() {
        this.container.innerHTML = `
            <div class="dice-interface-container">
                <!-- Dice Interface Header -->
                <div class="dice-header">
                    <h2><i class="icon-dice"></i> D&D 3.5 Dice System</h2>
                    <div class="dice-controls">
                        <button class="btn btn-secondary" id="clearHistoryBtn">
                            <i class="icon-clear"></i> Clear History
                        </button>
                        <div class="character-selector">
                            <select id="activeCharacterSelect" class="form-select">
                                <option value="">No Character</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Quick Action Buttons -->
                <div class="quick-actions" id="quickActions">
                    <div class="action-group">
                        <h3>Combat Actions</h3>
                        <button class="quick-btn combat-btn" data-action="attack">
                            <i class="icon-sword"></i> Attack Roll
                        </button>
                        <button class="quick-btn combat-btn" data-action="damage">
                            <i class="icon-damage"></i> Damage Roll
                        </button>
                        <button class="quick-btn combat-btn" data-action="initiative">
                            <i class="icon-speed"></i> Initiative
                        </button>
                        <button class="quick-btn combat-btn" data-action="full-attack">
                            <i class="icon-multi-attack"></i> Full Attack
                        </button>
                    </div>

                    <div class="action-group">
                        <h3>Saving Throws</h3>
                        <button class="quick-btn save-btn" data-action="fortitude">
                            <i class="icon-fort"></i> Fortitude
                        </button>
                        <button class="quick-btn save-btn" data-action="reflex">
                            <i class="icon-ref"></i> Reflex
                        </button>
                        <button class="quick-btn save-btn" data-action="will">
                            <i class="icon-will"></i> Will
                        </button>
                    </div>

                    <div class="action-group">
                        <h3>Skill Checks</h3>
                        <select id="skillSelect" class="form-select skill-select">
                            <option value="">Select Skill...</option>
                        </select>
                        <button class="quick-btn skill-btn" id="skillCheckBtn">
                            <i class="icon-skill"></i> Skill Check
                        </button>
                    </div>

                    <div class="action-group">
                        <h3>Basic Dice</h3>
                        <div class="basic-dice-grid">
                            <button class="dice-btn" data-sides="4">d4</button>
                            <button class="dice-btn" data-sides="6">d6</button>
                            <button class="dice-btn" data-sides="8">d8</button>
                            <button class="dice-btn" data-sides="10">d10</button>
                            <button class="dice-btn" data-sides="12">d12</button>
                            <button class="dice-btn" data-sides="20">d20</button>
                            <button class="dice-btn" data-sides="100">d%</button>
                        </div>
                    </div>
                </div>

                <!-- Custom Roll Interface -->
                <div class="custom-roll-section">
                    <h3>Custom Roll</h3>
                    <div class="custom-roll-controls">
                        <input type="text" id="customExpression" class="form-input" 
                               placeholder="e.g., 2d6+3, 1d20+5, 3d8+1d4+2" value="1d20">
                        <input type="text" id="rollLabel" class="form-input" 
                               placeholder="Roll description...">
                        <div class="advantage-controls">
                            <label><input type="radio" name="advantage" value="none" checked> Normal</label>
                            <label><input type="radio" name="advantage" value="advantage"> Advantage</label>
                            <label><input type="radio" name="advantage" value="disadvantage"> Disadvantage</label>
                        </div>
                        <button class="btn btn-primary" id="customRollBtn">
                            <i class="icon-dice"></i> Roll
                        </button>
                    </div>
                </div>

                <!-- Roll Results Display -->
                <div class="roll-results-section">
                    <h3>Roll Results</h3>
                    <div class="roll-history" id="rollHistory">
                        <div class="empty-state">No rolls yet. Make some rolls to see results here!</div>
                    </div>
                </div>

                <!-- Character Integration Panel -->
                <div class="character-integration" id="characterIntegration" style="display: none;">
                    <h3>Character Information</h3>
                    <div class="character-stats-quick" id="characterStatsQuick">
                        <!-- Character stats will be displayed here -->
                    </div>
                    <div class="equipped-weapons" id="equippedWeapons">
                        <h4>Equipped Weapons</h4>
                        <!-- Weapon quick access will be displayed here -->
                    </div>
                </div>

                <!-- Roll Detail Modal -->
                <div class="modal" id="rollDetailModal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 id="rollDetailTitle">Roll Details</h3>
                            <button class="modal-close" id="closeRollDetailModal">&times;</button>
                        </div>
                        <div class="modal-body" id="rollDetailBody">
                            <!-- Roll details will be loaded here -->
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" id="closeRollDetailBtn">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== EVENT LISTENERS ====================

    attachEventListeners() {
        // Clear history
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());

        // Character selection
        document.getElementById('activeCharacterSelect').addEventListener('change', (e) => {
            this.setActiveCharacter(e.target.value);
        });

        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e.target.dataset.action));
        });

        // Skill check
        document.getElementById('skillCheckBtn').addEventListener('click', () => this.handleSkillCheck());

        // Basic dice buttons
        document.querySelectorAll('.dice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.rollBasicDice(parseInt(e.target.dataset.sides)));
        });

        // Custom roll
        document.getElementById('customRollBtn').addEventListener('click', () => this.handleCustomRoll());
        document.getElementById('customExpression').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleCustomRoll();
        });

        // Modal controls
        document.getElementById('closeRollDetailModal').addEventListener('click', () => this.hideRollDetailModal());
        document.getElementById('closeRollDetailBtn').addEventListener('click', () => this.hideRollDetailModal());
    }

    // ==================== CHARACTER INTEGRATION ====================

    setupCharacterIntegration() {
        this.populateSkillSelect();
        this.updateCharacterSelector();
    }

    populateSkillSelect() {
        const skillSelect = document.getElementById('skillSelect');
        const skills = [
            'Appraise', 'Balance', 'Bluff', 'Climb', 'Concentration', 'Craft', 
            'Decipher Script', 'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist',
            'Forgery', 'Gather Information', 'Handle Animal', 'Heal', 'Hide', 'Intimidate',
            'Jump', 'Knowledge', 'Listen', 'Move Silently', 'Open Lock', 'Perform',
            'Profession', 'Ride', 'Search', 'Sense Motive', 'Sleight of Hand', 'Spellcraft',
            'Spot', 'Survival', 'Swim', 'Tumble', 'Use Magic Device', 'Use Rope'
        ];

        skills.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill;
            option.textContent = skill;
            skillSelect.appendChild(option);
        });
    }

    updateCharacterSelector() {
        const selector = document.getElementById('activeCharacterSelect');
        
        // Clear existing options except "No Character"
        while (selector.children.length > 1) {
            selector.removeChild(selector.lastChild);
        }

        // Get available characters (this would integrate with character storage)
        if (window.currentCharacter) {
            const option = document.createElement('option');
            option.value = 'current';
            option.textContent = window.currentCharacter.name || 'Current Character';
            selector.appendChild(option);
        }
    }

    setActiveCharacter(characterId) {
        if (characterId === 'current' && window.currentCharacter) {
            this.currentCharacter = window.currentCharacter;
            this.showCharacterIntegration();
        } else {
            this.currentCharacter = null;
            this.hideCharacterIntegration();
        }
        
        this.updateCharacterDisplay();
    }

    showCharacterIntegration() {
        document.getElementById('characterIntegration').style.display = 'block';
    }

    hideCharacterIntegration() {
        document.getElementById('characterIntegration').style.display = 'none';
    }

    updateCharacterDisplay() {
        if (!this.currentCharacter) return;

        const statsContainer = document.getElementById('characterStatsQuick');
        const weaponsContainer = document.getElementById('equippedWeapons');

        // Display quick stats
        statsContainer.innerHTML = `
            <div class="quick-stats-grid">
                <div class="stat-item">
                    <label>STR</label>
                    <span>${this.currentCharacter.abilities?.strength || 10} (${this.formatModifier(this.getAbilityModifier(this.currentCharacter.abilities?.strength || 10))})</span>
                </div>
                <div class="stat-item">
                    <label>DEX</label>
                    <span>${this.currentCharacter.abilities?.dexterity || 10} (${this.formatModifier(this.getAbilityModifier(this.currentCharacter.abilities?.dexterity || 10))})</span>
                </div>
                <div class="stat-item">
                    <label>CON</label>
                    <span>${this.currentCharacter.abilities?.constitution || 10} (${this.formatModifier(this.getAbilityModifier(this.currentCharacter.abilities?.constitution || 10))})</span>
                </div>
                <div class="stat-item">
                    <label>INT</label>
                    <span>${this.currentCharacter.abilities?.intelligence || 10} (${this.formatModifier(this.getAbilityModifier(this.currentCharacter.abilities?.intelligence || 10))})</span>
                </div>
                <div class="stat-item">
                    <label>WIS</label>
                    <span>${this.currentCharacter.abilities?.wisdom || 10} (${this.formatModifier(this.getAbilityModifier(this.currentCharacter.abilities?.wisdom || 10))})</span>
                </div>
                <div class="stat-item">
                    <label>CHA</label>
                    <span>${this.currentCharacter.abilities?.charisma || 10} (${this.formatModifier(this.getAbilityModifier(this.currentCharacter.abilities?.charisma || 10))})</span>
                </div>
                <div class="stat-item">
                    <label>BAB</label>
                    <span>${this.formatModifier(this.currentCharacter.baseAttackBonus || 0)}</span>
                </div>
                <div class="stat-item">
                    <label>AC</label>
                    <span>${this.currentCharacter.armorClass || 10}</span>
                </div>
            </div>
        `;

        // Display equipped weapons
        const equippedWeapons = this.getEquippedWeapons();
        weaponsContainer.innerHTML = `
            <h4>Equipped Weapons</h4>
            <div class="weapon-quick-access">
                ${equippedWeapons.map(weapon => `
                    <button class="weapon-btn" data-weapon='${JSON.stringify(weapon)}'>
                        <div class="weapon-name">${weapon.name}</div>
                        <div class="weapon-damage">${weapon.damage}</div>
                        <div class="weapon-type">${weapon.type}</div>
                    </button>
                `).join('')}
            </div>
        `;

        // Add weapon button listeners
        document.querySelectorAll('.weapon-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const weapon = JSON.parse(e.currentTarget.dataset.weapon);
                this.handleWeaponAttack(weapon);
            });
        });
    }

    // ==================== DICE ROLLING HANDLERS ====================

    handleQuickAction(action) {
        if (!this.currentCharacter && ['attack', 'damage', 'initiative', 'full-attack', 'fortitude', 'reflex', 'will'].includes(action)) {
            this.showNotification('Please select a character first', 'warning');
            return;
        }

        switch (action) {
            case 'attack':
                this.promptWeaponSelection('attack');
                break;
            case 'damage':
                this.promptWeaponSelection('damage');
                break;
            case 'initiative':
                this.rollInitiative();
                break;
            case 'full-attack':
                this.promptWeaponSelection('full-attack');
                break;
            case 'fortitude':
                this.rollSavingThrow('Fortitude');
                break;
            case 'reflex':
                this.rollSavingThrow('Reflex');
                break;
            case 'will':
                this.rollSavingThrow('Will');
                break;
        }
    }

    handleSkillCheck() {
        const skillName = document.getElementById('skillSelect').value;
        if (!skillName) {
            this.showNotification('Please select a skill', 'warning');
            return;
        }

        const result = this.diceEngine.rollSkillCheck(this.currentCharacter, skillName);
        this.displayRollResult(result);
    }

    handleCustomRoll() {
        const expression = document.getElementById('customExpression').value.trim();
        const label = document.getElementById('rollLabel').value.trim() || 'Custom Roll';
        const advantageRadio = document.querySelector('input[name="advantage"]:checked');
        
        let advantage = null;
        if (advantageRadio.value === 'advantage') advantage = true;
        else if (advantageRadio.value === 'disadvantage') advantage = false;

        let result;
        
        if (expression.includes('d20') && (advantage !== null)) {
            // Extract modifier from d20 expression
            const match = expression.match(/d20([+\-]\d+)?/);
            const modifier = match && match[1] ? parseInt(match[1]) : 0;
            result = this.diceEngine.rollD20(modifier, advantage, label);
        } else if (expression.includes('d') && !expression.includes('+') && !expression.includes('-')) {
            // Simple dice expression
            const dice = this.diceEngine.parseDiceExpression(expression);
            result = this.diceEngine.rollDice(dice.sides, dice.count, dice.modifier, label);
        } else if (expression.includes('+') || expression.includes('-')) {
            // Complex expression
            result = this.diceEngine.parseComplexExpression(expression);
            result.label = label;
        } else {
            this.showNotification('Invalid dice expression', 'error');
            return;
        }

        this.displayRollResult(result);
    }

    rollBasicDice(sides) {
        const result = this.diceEngine.rollDice(sides, 1, 0, `d${sides} roll`);
        this.displayRollResult(result);
    }

    rollInitiative() {
        const result = this.diceEngine.rollInitiative(this.currentCharacter);
        this.displayRollResult(result);
    }

    rollSavingThrow(saveType) {
        const result = this.diceEngine.rollSavingThrow(this.currentCharacter, saveType);
        this.displayRollResult(result);
    }

    handleWeaponAttack(weapon, attackType = 'single') {
        if (attackType === 'attack' || attackType === 'single') {
            const result = this.diceEngine.rollAttack(this.currentCharacter, weapon);
            this.displayRollResult(result);
        } else if (attackType === 'damage') {
            const result = this.diceEngine.rollDamage(this.currentCharacter, weapon);
            this.displayRollResult(result);
        } else if (attackType === 'full-attack') {
            const attackCount = this.calculateIterativeAttacks();
            const result = this.diceEngine.rollMultipleAttacks(this.currentCharacter, weapon, attackCount);
            this.displayRollResult(result);
        }
    }

    // ==================== DISPLAY METHODS ====================

    displayRollResult(result) {
        const historyContainer = document.getElementById('rollHistory');
        
        // Remove empty state if present
        const emptyState = historyContainer.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        // Create result element
        const resultElement = this.createRollResultElement(result);
        historyContainer.insertBefore(resultElement, historyContainer.firstChild);

        // Limit history display
        while (historyContainer.children.length > 20) {
            historyContainer.removeChild(historyContainer.lastChild);
        }

        // Add to internal history
        this.rollHistory.unshift(result);
        
        // Show notification for important results
        this.showRollNotification(result);
    }

    createRollResultElement(result) {
        const element = document.createElement('div');
        element.className = `roll-result ${result.type || 'basic'}`;
        
        let html = `
            <div class="roll-result-header">
                <span class="roll-label">${result.label || 'Roll'}</span>
                <span class="roll-total ${this.getRollTotalClass(result)}">${result.total}</span>
                <span class="roll-time">${new Date(result.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="roll-expression">${result.expression}</div>
        `;

        // Add special information based on roll type
        if (result.type === 'attack' && result.isCriticalThreat) {
            html += `<div class="roll-special critical-threat">CRITICAL THREAT!</div>`;
        }
        if (result.type === 'damage' && result.isCritical) {
            html += `<div class="roll-special critical-damage">CRITICAL DAMAGE!</div>`;
        }
        if (result.isNatural20) {
            html += `<div class="roll-special natural-20">NATURAL 20!</div>`;
        }
        if (result.isNatural1) {
            html += `<div class="roll-special natural-1">NATURAL 1!</div>`;
        }

        element.innerHTML = html;
        
        // Add click handler for details
        element.addEventListener('click', () => this.showRollDetails(result));
        
        return element;
    }

    getRollTotalClass(result) {
        if (result.isNatural20) return 'natural-20';
        if (result.isNatural1) return 'natural-1';
        if (result.isCriticalThreat) return 'critical';
        if (result.total >= 20) return 'high';
        if (result.total <= 5) return 'low';
        return 'normal';
    }

    showRollDetails(result) {
        document.getElementById('rollDetailTitle').textContent = result.label || 'Roll Details';
        
        let detailsHTML = `
            <div class="roll-details-content">
                <div class="detail-section">
                    <h4>Basic Information</h4>
                    <p><strong>Expression:</strong> ${result.expression}</p>
                    <p><strong>Total:</strong> ${result.total}</p>
                    <p><strong>Type:</strong> ${result.type || 'basic'}</p>
                    <p><strong>Time:</strong> ${new Date(result.timestamp).toLocaleString()}</p>
                </div>
        `;

        if (result.rolls && result.rolls.length > 0) {
            detailsHTML += `
                <div class="detail-section">
                    <h4>Individual Rolls</h4>
                    <div class="individual-rolls">
                        ${result.rolls.map(roll => `<span class="individual-roll">${roll}</span>`).join(' ')}
                    </div>
                </div>
            `;
        }

        if (result.type === 'attack') {
            detailsHTML += `
                <div class="detail-section">
                    <h4>Attack Details</h4>
                    ${result.weapon ? `<p><strong>Weapon:</strong> ${result.weapon}</p>` : ''}
                    ${result.targetAC ? `<p><strong>Target AC:</strong> ${result.targetAC} (${result.hits ? 'HIT' : 'MISS'})</p>` : ''}
                    ${result.isCriticalThreat ? '<p class="critical-info">This is a critical threat!</p>' : ''}
                </div>
            `;
        }

        detailsHTML += '</div>';
        
        document.getElementById('rollDetailBody').innerHTML = detailsHTML;
        document.getElementById('rollDetailModal').style.display = 'flex';
    }

    hideRollDetailModal() {
        document.getElementById('rollDetailModal').style.display = 'none';
    }

    // ==================== UTILITY METHODS ====================

    promptWeaponSelection(action) {
        const weapons = this.getEquippedWeapons();
        if (weapons.length === 0) {
            // Use unarmed attack
            this.handleWeaponAttack(null, action);
            return;
        }

        if (weapons.length === 1) {
            this.handleWeaponAttack(weapons[0], action);
            return;
        }

        // Multiple weapons - could show selection dialog
        this.handleWeaponAttack(weapons[0], action); // For now, use first weapon
    }

    getEquippedWeapons() {
        if (!this.currentCharacter || !this.currentCharacter.equipment) {
            return [{
                name: 'Unarmed Strike',
                damage: '1d3',
                type: 'melee',
                criticalThreat: 20,
                criticalMultiplier: 2
            }];
        }

        // Extract weapons from equipment
        const weapons = [];
        if (this.currentCharacter.equipment.weapons) {
            weapons.push(...this.currentCharacter.equipment.weapons.filter(w => w.equipped));
        }

        return weapons.length > 0 ? weapons : [{
            name: 'Unarmed Strike',
            damage: '1d3',
            type: 'melee',
            criticalThreat: 20,
            criticalMultiplier: 2
        }];
    }

    calculateIterativeAttacks() {
        if (!this.currentCharacter) return 1;
        
        const bab = this.currentCharacter.baseAttackBonus || 0;
        if (bab >= 16) return 4;
        if (bab >= 11) return 3;
        if (bab >= 6) return 2;
        return 1;
    }

    getAbilityModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    formatModifier(modifier) {
        return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    }

    clearHistory() {
        document.getElementById('rollHistory').innerHTML = '<div class="empty-state">No rolls yet. Make some rolls to see results here!</div>';
        this.rollHistory = [];
        this.diceEngine.clearHistory();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    showRollNotification(result) {
        if (result.isNatural20) {
            this.showNotification('Natural 20!', 'success');
        } else if (result.isNatural1) {
            this.showNotification('Natural 1!', 'warning');
        } else if (result.isCriticalThreat) {
            this.showNotification('Critical Threat!', 'success');
        }
    }

    // ==================== PUBLIC API ====================

    setCharacter(character) {
        this.currentCharacter = character;
        this.updateCharacterSelector();
        this.updateCharacterDisplay();
        
        if (character) {
            document.getElementById('activeCharacterSelect').value = 'current';
            this.showCharacterIntegration();
        } else {
            document.getElementById('activeCharacterSelect').value = '';
            this.hideCharacterIntegration();
        }
    }

    getLastRoll() {
        return this.rollHistory[0] || null;
    }

    getRollHistory(count = 10) {
        return this.rollHistory.slice(0, count);
    }
}

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiceIntegrationInterface;
} else if (typeof window !== 'undefined') {
    window.DiceIntegrationInterface = DiceIntegrationInterface;
}
/**
 * RulzLawyer Complete D&D 3.5 Web Interface
 * Comprehensive JavaScript controller for all game systems
 * 
 * Features:
 * - Character creation and management
 * - Spell system integration
 * - Equipment management
 * - Adventure generation
 * - Dice rolling system
 * - Complete SRD integration
 * 
 * @version 1.0
 * @date September 20, 2025
 * @location code-repository/src/web-interface.js
 */

class RulzLawyerWebInterface {
    constructor() {
        this.gameEngine = null;
        this.currentCharacter = null;
        this.rollHistory = [];
        this.maxHistoryItems = 20;
        
        console.log('🌐 RulzLawyer Web Interface initializing...');
        this.initializeInterface();
    }

    async initializeInterface() {
        try {
            // Wait for game engine to be available
            await this.waitForGameEngine();
            
            // Initialize event listeners
            this.setupEventListeners();
            
            // Initialize interface
            this.initializeTabs();
            this.populateRandomTables();
            this.updateCharacterList();
            this.refreshInterface();
            
            console.log('✅ Web Interface initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize web interface:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    async waitForGameEngine() {
        const maxAttempts = 50;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            if (window.gameEngine) {
                this.gameEngine = window.gameEngine;
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        throw new Error('Game engine not found after waiting');
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Character creation form
        const characterForm = document.getElementById('character-form');
        if (characterForm) {
            characterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCharacterCreation();
            });
        }

        // Dice buttons
        document.querySelectorAll('.dice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dice = e.target.dataset.dice;
                if (dice) {
                    document.getElementById('dice-expression').value = dice;
                }
            });
        });

        // Form auto-updates
        document.getElementById('character-race')?.addEventListener('change', () => {
            this.updateCharacterPreview();
        });

        document.getElementById('character-class')?.addEventListener('change', () => {
            this.updateCharacterPreview();
        });

        // Real-time spell search
        document.getElementById('spell-search')?.addEventListener('input', () => {
            this.searchSpells();
        });
    }

    initializeTabs() {
        // Initialize all tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });

        // Show active tab
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            activeTab.style.display = 'block';
        }
    }

    switchTab(tabId) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
            tab.style.display = 'none';
        });

        // Remove active class from nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        const selectedTab = document.getElementById(tabId);
        const navTab = document.querySelector(`[data-tab="${tabId}"]`);
        
        if (selectedTab && navTab) {
            selectedTab.classList.add('active');
            selectedTab.style.display = 'block';
            navTab.classList.add('active');
            
            // Refresh tab-specific content
            this.refreshTabContent(tabId);
        }
    }

    refreshTabContent(tabId) {
        switch (tabId) {
            case 'character-sheet':
                this.refreshCharacterSheet();
                break;
            case 'spell-management':
                this.refreshSpellManagement();
                break;
            case 'equipment':
                this.refreshEquipment();
                break;
            case 'adventure-generation':
                this.refreshAdventureGeneration();
                break;
            case 'dice-roller':
                this.refreshDiceRoller();
                break;
        }
    }

    // Character Creation Functions
    generateRandomCharacter() {
        try {
            const character = this.gameEngine.characterManager.createCharacter({
                name: this.generateRandomName(),
                race: this.getRandomRace(),
                class: this.getRandomClass(),
                level: 1
            });

            this.currentCharacter = character;
            this.populateCharacterForm(character);
            this.showSuccess(`Generated random character: ${character.name}!`);
        } catch (error) {
            console.error('Error generating random character:', error);
            this.showError('Failed to generate random character.');
        }
    }

    rollAbilityScores() {
        try {
            const abilities = this.gameEngine.characterManager._rollAbilities();
            this.displayAbilityScores(abilities);
        } catch (error) {
            console.error('Error rolling ability scores:', error);
            this.showError('Failed to roll ability scores.');
        }
    }

    displayAbilityScores(abilities) {
        const abilityNames = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        const abilityKeys = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        
        abilityNames.forEach((name, index) => {
            const value = abilities[abilityKeys[index]];
            const modifier = Math.floor((value - 10) / 2);
            const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            
            document.getElementById(`${name}-value`).textContent = value;
            document.getElementById(`${name}-mod`).textContent = modifierText;
        });
    }

    createCharacter() {
        try {
            const name = document.getElementById('character-name')?.value;
            const race = document.getElementById('character-race')?.value;
            const characterClass = document.getElementById('character-class')?.value;
            const level = parseInt(document.getElementById('character-level')?.value) || 1;

            if (!name || !race || !characterClass) {
                this.showError('Please fill in all character details.');
                return;
            }

            const abilities = this.getCurrentAbilityScores();
            
            const character = this.gameEngine.characterManager.createCharacter({
                name,
                race,
                class: characterClass,
                level,
                abilities
            });

            this.currentCharacter = character;
            this.showSuccess(`Character ${name} created successfully!`);
            this.switchTab('character-sheet');
        } catch (error) {
            console.error('Error creating character:', error);
            this.showError('Failed to create character: ' + error.message);
        }
    }

    getCurrentAbilityScores() {
        return {
            strength: parseInt(document.getElementById('str-value')?.textContent) || 10,
            dexterity: parseInt(document.getElementById('dex-value')?.textContent) || 10,
            constitution: parseInt(document.getElementById('con-value')?.textContent) || 10,
            intelligence: parseInt(document.getElementById('int-value')?.textContent) || 10,
            wisdom: parseInt(document.getElementById('wis-value')?.textContent) || 10,
            charisma: parseInt(document.getElementById('cha-value')?.textContent) || 10
        };
    }

    // Character Sheet Functions
    refreshCharacterSheet() {
        if (!this.currentCharacter) {
            this.showNoCharacterMessage();
            return;
        }

        this.updateCharacterDisplay();
        this.updateAbilityDisplay();
        this.updateSkillsAndFeats();
        this.updateCombatStats();
    }

    updateCharacterDisplay() {
        const char = this.currentCharacter;
        
        document.getElementById('current-character-name').textContent = char.name;
        document.getElementById('character-display-race').textContent = char.race;
        document.getElementById('character-display-class').textContent = char.class;
        document.getElementById('character-display-level').textContent = char.level;
        document.getElementById('character-hp').textContent = `${char.hitPoints.current}/${char.hitPoints.maximum}`;
        document.getElementById('character-ac').textContent = char.armorClass;
        document.getElementById('character-bab').textContent = `+${char.baseAttackBonus}`;
        
        // Update status indicator
        const statusElement = document.getElementById('character-status');
        statusElement.textContent = char.status.charAt(0).toUpperCase() + char.status.slice(1);
        statusElement.className = `status-indicator status-${char.status}`;
    }

    updateAbilityDisplay() {
        const char = this.currentCharacter;
        const container = document.getElementById('character-abilities');
        
        const abilities = [
            { name: 'STR', key: 'strength' },
            { name: 'DEX', key: 'dexterity' },
            { name: 'CON', key: 'constitution' },
            { name: 'INT', key: 'intelligence' },
            { name: 'WIS', key: 'wisdom' },
            { name: 'CHA', key: 'charisma' }
        ];

        container.innerHTML = abilities.map(ability => {
            const value = char.abilities[ability.key];
            const modifier = Math.floor((value - 10) / 2);
            const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            
            return `
                <div class="ability-score">
                    <div class="ability-name">${ability.name}</div>
                    <div class="ability-value">${value}</div>
                    <div class="ability-modifier">${modifierText}</div>
                </div>
            `;
        }).join('');
    }

    // Spell Management Functions
    refreshSpellManagement() {
        if (!this.currentCharacter) {
            this.showNoCharacterMessage();
            return;
        }

        this.updateSpellSlots();
        this.updateAvailableSpells();
    }

    updateSpellSlots() {
        if (!this.gameEngine.spellManager) return;

        const spellSlots = this.gameEngine.spellManager.getSpellSlots(this.currentCharacter);
        const container = document.getElementById('spell-slots-container');
        
        if (Object.keys(spellSlots).length === 0) {
            container.innerHTML = '<p>Character is not a spellcaster.</p>';
            return;
        }

        const slotsHTML = Object.entries(spellSlots).map(([level, slots]) => {
            const usedSlots = Array(slots.used).fill('used');
            const availableSlots = Array(slots.available).fill('available');
            const allSlots = [...usedSlots, ...availableSlots];
            
            return `
                <div style="margin-bottom: 1rem;">
                    <h4 style="color: #d4af37;">Level ${level} (${slots.available}/${slots.total})</h4>
                    <div class="spell-slots">
                        ${allSlots.map((slot, index) => `
                            <div class="spell-slot ${slot}" onclick="toggleSpellSlot(${level}, ${index})">
                                <div class="spell-level">${level}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = slotsHTML;
    }

    // Equipment Functions
    refreshEquipment() {
        if (!this.currentCharacter) {
            this.showNoCharacterMessage();
            return;
        }

        this.updateEquipmentSlots();
        this.updateInventory();
        this.updateEncumbrance();
    }

    updateEquipmentSlots() {
        const container = document.getElementById('equipment-slots');
        const slots = [
            { name: 'Head', id: 'head' },
            { name: 'Neck', id: 'neck' },
            { name: 'Shoulders', id: 'shoulders' },
            { name: 'Body', id: 'body' },
            { name: 'Waist', id: 'waist' },
            { name: 'Wrists', id: 'wrists' },
            { name: 'Hands', id: 'hands' },
            { name: 'Ring 1', id: 'ring1' },
            { name: 'Ring 2', id: 'ring2' },
            { name: 'Feet', id: 'feet' },
            { name: 'Main Hand', id: 'mainhand' },
            { name: 'Off Hand', id: 'offhand' }
        ];

        container.innerHTML = slots.map(slot => {
            const equippedItem = this.getEquippedItemInSlot(slot.id);
            return `
                <div class="equipment-slot ${equippedItem ? 'equipped' : ''}" 
                     data-slot="${slot.id}" 
                     onclick="manageEquipmentSlot('${slot.id}')">
                    <h4>${slot.name}</h4>
                    ${equippedItem ? `<p>${equippedItem.name}</p>` : '<p>Empty</p>'}
                </div>
            `;
        }).join('');
    }

    // Adventure Generation Functions
    generateAdventure() {
        try {
            const level = parseInt(document.getElementById('adventure-level')?.value) || 1;
            const type = document.getElementById('adventure-type')?.value || 'dungeon';
            const length = document.getElementById('adventure-length')?.value || 'medium';

            const adventure = this.gameEngine.adventureEngine.generateAdventure({
                partyLevel: level,
                adventureType: type,
                length: length
            });

            document.getElementById('adventure-output').textContent = adventure.description;
            this.showSuccess('Adventure generated successfully!');
        } catch (error) {
            console.error('Error generating adventure:', error);
            this.showError('Failed to generate adventure: ' + error.message);
        }
    }

    generateEncounter() {
        try {
            const level = parseInt(document.getElementById('adventure-level')?.value) || 1;
            const encounter = this.gameEngine.adventureEngine.generateEncounter(level);
            
            document.getElementById('encounter-output').innerHTML = `
                <h4 style="color: #d4af37;">${encounter.type}</h4>
                <p><strong>Challenge Rating:</strong> ${encounter.challengeRating}</p>
                <p><strong>Encounter:</strong> ${encounter.description}</p>
                <p><strong>Tactics:</strong> ${encounter.tactics}</p>
            `;
        } catch (error) {
            console.error('Error generating encounter:', error);
            this.showError('Failed to generate encounter.');
        }
    }

    generateNPC() {
        try {
            const npc = this.gameEngine.characterManager.createCharacter({
                name: this.generateRandomName(),
                race: this.getRandomRace(),
                class: this.getRandomClass(),
                level: Math.ceil(Math.random() * 10)
            });

            document.getElementById('npc-output').innerHTML = `
                <h4 style="color: #d4af37;">${npc.name}</h4>
                <p><strong>Race:</strong> ${npc.race}</p>
                <p><strong>Class:</strong> ${npc.class}</p>
                <p><strong>Level:</strong> ${npc.level}</p>
                <p><strong>HP:</strong> ${npc.hitPoints.maximum}</p>
                <p><strong>AC:</strong> ${npc.armorClass}</p>
            `;
        } catch (error) {
            console.error('Error generating NPC:', error);
            this.showError('Failed to generate NPC.');
        }
    }

    // Dice Rolling Functions
    rollDice(sides) {
        try {
            // If no sides provided, use the expression from the input field
            let expression, result;
            if (sides) {
                expression = `1d${sides}`;
                result = this.gameEngine.diceEngine.rollExpression(expression);
            } else {
                // Get expression from input field
                const input = document.getElementById('dice-expression');
                expression = input?.value || '1d20';
                result = this.gameEngine.diceEngine.rollExpression(expression);
            }
            
            // Update result display
            const resultElement = document.getElementById('dice-result');
            if (resultElement) {
                resultElement.innerHTML = `
                    <div class="result-total">${result.total}</div>
                    <div class="result-breakdown">
                        <strong>Expression:</strong> ${expression}<br>
                        <strong>Individual Rolls:</strong> ${result.rolls ? result.rolls.join(', ') : result.total}<br>
                        <strong>Modifiers:</strong> ${result.modifier || 0}<br>
                        <strong>Total:</strong> ${result.total}
                    </div>
                `;
            }
            
            this.addToRollHistory(expression, result.total);
        } catch (error) {
            console.error('Error rolling dice:', error);
            this.showError('Failed to roll dice: ' + error.message);
        }
    }

    rollAdvantage() {
        try {
            const result1 = this.gameEngine.diceEngine.rollExpression('1d20');
            const result2 = this.gameEngine.diceEngine.rollExpression('1d20');
            const advantage = Math.max(result1.total, result2.total);
            
            const resultElement = document.getElementById('dice-result');
            if (resultElement) {
                resultElement.innerHTML = `
                    <div class="result-total">${advantage}</div>
                    <div class="result-breakdown">
                        <strong>Advantage Roll:</strong><br>
                        First Roll: ${result1.total}<br>
                        Second Roll: ${result2.total}<br>
                        <strong>Taking Higher:</strong> ${advantage}
                    </div>
                `;
            }
            
            this.addToRollHistory('1d20 (Advantage)', advantage);
        } catch (error) {
            console.error('Error rolling advantage:', error);
            this.showError('Failed to roll advantage.');
        }
    }

    rollDisadvantage() {
        try {
            const result1 = this.gameEngine.diceEngine.rollExpression('1d20');
            const result2 = this.gameEngine.diceEngine.rollExpression('1d20');
            const disadvantage = Math.min(result1.total, result2.total);
            
            const resultElement = document.getElementById('dice-result');
            if (resultElement) {
                resultElement.innerHTML = `
                    <div class="result-total">${disadvantage}</div>
                    <div class="result-breakdown">
                        <strong>Disadvantage Roll:</strong><br>
                        First Roll: ${result1.total}<br>
                        Second Roll: ${result2.total}<br>
                        <strong>Taking Lower:</strong> ${disadvantage}
                    </div>
                `;
            }
            
            this.addToRollHistory('1d20 (Disadvantage)', disadvantage);
        } catch (error) {
            console.error('Error rolling disadvantage:', error);
            this.showError('Failed to roll disadvantage.');
        }
    }

    createNewCharacter() {
        try {
            // Reset form state for new character creation
            this.resetCharacterForm();
            
            // Show character creation modal
            const modal = document.getElementById('character-modal');
            if (modal) {
                modal.classList.add('active');
                modal.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error opening character creation:', error);
            this.showError('Failed to open character creation.');
        }
    }

    handleCharacterCreation() {
        try {
            // Check if we're editing an existing character
            if (this.editingCharacterId) {
                this.updateCharacter();
                return;
            }

            // Get form data
            const name = document.getElementById('char-name')?.value;
            const race = document.getElementById('char-race')?.value;
            const charClass = document.getElementById('char-class')?.value;
            const level = parseInt(document.getElementById('char-level')?.value) || 1;

            if (!name) {
                this.showError('Character name is required.');
                return;
            }

            // Create character using the game engine
            const characterData = {
                name: name,
                race: race || 'Human',
                class: charClass || 'Fighter',
                level: level
            };

            const character = this.gameEngine.characterManager.createCharacter(characterData);
            
            // Close modal
            this.closeModal('character-modal');
            
            // Update character list display
            this.updateCharacterList();
            
            // Show success message
            this.showSuccess(`Character "${name}" created successfully!`);
            
            // Clear form
            this.resetCharacterForm();
            
        } catch (error) {
            console.error('Error creating character:', error);
            this.showError('Failed to create character: ' + error.message);
        }
    }

    updateCharacterList() {
        try {
            const characters = this.gameEngine.storageManager?.getAllCharacters() || [];
            const listContainer = document.getElementById('character-list');
            
            if (!listContainer) return;

            if (characters.length === 0) {
                listContainer.innerHTML = `
                    <div class="text-center" style="padding: 2rem; color: #ccc;">
                        No characters created yet.<br>
                        <button class="action-btn mt-2" onclick="createNewCharacter()">Create Your First Character</button>
                    </div>
                `;
                return;
            }

            let html = '';
            characters.forEach(char => {
                const isActive = this.currentCharacter && this.currentCharacter.id === char.id;
                const activeClass = isActive ? 'active' : '';
                
                html += `
                    <div class="character-item ${activeClass}" onclick="selectCharacter('${char.id}')">
                        <div class="character-name">${char.name}</div>
                        <div class="character-info">Level ${char.level} ${char.race} ${char.class}</div>
                        <div class="character-stats">HP: ${char.hitPoints.current || char.hitPoints.maximum}/${char.hitPoints.maximum}</div>
                        <div class="character-actions">
                            <button class="btn-small edit-btn" onclick="event.stopPropagation(); editCharacter('${char.id}')">Edit</button>
                        </div>
                    </div>
                `;
            });

            listContainer.innerHTML = html;
        } catch (error) {
            console.error('Error updating character list:', error);
        }
    }

    selectCharacter(characterId) {
        try {
            const character = this.gameEngine.storageManager.getCharacter(characterId);
            if (!character) {
                this.showError('Character not found.');
                return;
            }

            this.currentCharacter = character;
            this.updateCharacterDetails();
            this.updateCharacterList(); // Refresh to show active state
            this.showSuccess(`Selected character: ${character.name}`);
        } catch (error) {
            console.error('Error selecting character:', error);
            this.showError('Failed to select character.');
        }
    }

    updateCharacterDetails() {
        try {
            if (!this.currentCharacter) return;

            const char = this.currentCharacter;
            const detailsContainer = document.getElementById('character-details');
            
            if (detailsContainer) {
                detailsContainer.innerHTML = `
                    <div class="character-sheet">
                        <div class="character-header">
                            <h3>${char.name}</h3>
                            <p>Level ${char.level} ${char.race} ${char.class}</p>
                        </div>
                        <div class="character-stats">
                            <div class="stat-group">
                                <h4>Ability Scores</h4>
                                <div class="abilities">
                                    <div class="ability">STR: ${char.abilities.strength} (${this.getModifier(char.abilities.strength)})</div>
                                    <div class="ability">DEX: ${char.abilities.dexterity} (${this.getModifier(char.abilities.dexterity)})</div>
                                    <div class="ability">CON: ${char.abilities.constitution} (${this.getModifier(char.abilities.constitution)})</div>
                                    <div class="ability">INT: ${char.abilities.intelligence} (${this.getModifier(char.abilities.intelligence)})</div>
                                    <div class="ability">WIS: ${char.abilities.wisdom} (${this.getModifier(char.abilities.wisdom)})</div>
                                    <div class="ability">CHA: ${char.abilities.charisma} (${this.getModifier(char.abilities.charisma)})</div>
                                </div>
                            </div>
                            <div class="stat-group">
                                <h4>Combat Stats</h4>
                                <div class="combat-stats">
                                    <div>HP: ${char.hitPoints.current || char.hitPoints.maximum}/${char.hitPoints.maximum}</div>
                                    <div>AC: ${char.armorClass.total}</div>
                                    <div>BAB: +${char.baseAttackBonus}</div>
                                </div>
                            </div>
                            <div class="stat-group">
                                <h4>Saving Throws</h4>
                                <div class="saves">
                                    <div>Fortitude: +${char.savingThrows.fortitude}</div>
                                    <div>Reflex: +${char.savingThrows.reflex}</div>
                                    <div>Will: +${char.savingThrows.will}</div>
                                </div>
                            </div>
                        </div>
                        <div class="character-actions">
                            <button class="action-btn" onclick="editCharacter('${char.id}')">Edit Character</button>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error updating character details:', error);
        }
    }

    editCharacter(characterId) {
        try {
            const character = this.gameEngine.storageManager.getCharacter(characterId);
            if (!character) {
                this.showError('Character not found.');
                return;
            }

            // Populate the edit form with current character data
            document.getElementById('char-name').value = character.name;
            document.getElementById('char-race').value = character.race;
            document.getElementById('char-class').value = character.class;
            document.getElementById('char-level').value = character.level;

            // Store the character ID for update
            this.editingCharacterId = characterId;

            // Change the form title and button text to indicate editing
            const modalTitle = document.querySelector('#character-modal .modal-title');
            if (modalTitle) modalTitle.textContent = 'Edit Character';

            const submitBtn = document.querySelector('#character-form button[type="submit"]');
            if (submitBtn) submitBtn.textContent = 'Update Character';

            // Show the modal
            const modal = document.getElementById('character-modal');
            if (modal) {
                modal.classList.add('active');
                modal.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error editing character:', error);
            this.showError('Failed to open character editor.');
        }
    }

    updateCharacter() {
        try {
            if (!this.editingCharacterId) {
                this.showError('No character selected for editing.');
                return;
            }

            // Get form data
            const name = document.getElementById('char-name')?.value;
            const race = document.getElementById('char-race')?.value;
            const charClass = document.getElementById('char-class')?.value;
            const level = parseInt(document.getElementById('char-level')?.value) || 1;

            if (!name) {
                this.showError('Character name is required.');
                return;
            }

            // Get the existing character
            const character = this.gameEngine.storageManager.getCharacter(this.editingCharacterId);
            if (!character) {
                this.showError('Character not found.');
                return;
            }

            // Update character properties
            character.name = name;
            character.race = race || 'Human';
            character.class = charClass || 'Fighter';
            
            // If level changed, recalculate stats
            if (character.level !== level) {
                character.level = level;
                // Recalculate level-dependent stats
                this.gameEngine.characterManager.recalculateCharacterStats(character);
            }

            // Save the updated character
            this.gameEngine.storageManager.saveCharacter(character);

            // Update current character if it's the one being edited
            if (this.currentCharacter && this.currentCharacter.id === this.editingCharacterId) {
                this.currentCharacter = character;
                this.updateCharacterDetails();
            }

            // Close modal and refresh list
            this.closeModal('character-modal');
            this.updateCharacterList();
            
            // Reset form state
            this.resetCharacterForm();
            
            this.showSuccess(`Character "${name}" updated successfully!`);
            
        } catch (error) {
            console.error('Error updating character:', error);
            this.showError('Failed to update character: ' + error.message);
        }
    }

    resetCharacterForm() {
        // Reset form title and button text
        const modalTitle = document.querySelector('#character-modal .modal-title');
        if (modalTitle) modalTitle.textContent = 'Create New Character';

        const submitBtn = document.querySelector('#character-form button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Create Character';

        // Clear editing state
        this.editingCharacterId = null;

        // Clear form
        document.getElementById('character-form')?.reset();
    }

    getModifier(abilityScore) {
        return Math.floor((abilityScore - 10) / 2);
    }

    showCharacterStats() {
        try {
            // Show character statistics
            const characters = this.gameEngine.storageManager.getAllCharacters();
            let statsHtml = '<h3>Character Statistics</h3>';
            
            if (characters.length === 0) {
                statsHtml += '<p>No characters created yet.</p>';
            } else {
                statsHtml += `<p>Total Characters: ${characters.length}</p>`;
                characters.forEach(char => {
                    statsHtml += `<div class="character-stat">
                        <strong>${char.name}</strong> - Level ${char.level} ${char.race} ${char.class}
                    </div>`;
                });
            }
            
            alert(statsHtml); // Simple implementation, could be improved with a proper modal
        } catch (error) {
            console.error('Error showing character stats:', error);
            this.showError('Failed to show character statistics.');
        }
    }

    rollRandomTables() {
        try {
            // Roll multiple random tables
            const tables = ['random-encounter-wilderness', 'treasure-type-a', 'random-weather'];
            let results = '<h3>Random Table Results:</h3>';
            
            tables.forEach(tableName => {
                try {
                    const result = this.gameEngine.randomTablesIndex.rollTable(tableName);
                    results += `<div><strong>${tableName}:</strong> ${result.value || result}</div>`;
                } catch (err) {
                    results += `<div><strong>${tableName}:</strong> Table not found</div>`;
                }
            });
            
            const resultElement = document.getElementById('table-results');
            if (resultElement) {
                resultElement.innerHTML = results;
            }
        } catch (error) {
            console.error('Error rolling random tables:', error);
            this.showError('Failed to roll random tables.');
        }
    }

    closeModal(modalId) {
        try {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                modal.style.display = 'none';
            }
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    }

    rollCustomDice() {
        try {
            const expression = document.getElementById('custom-dice')?.value;
            if (!expression) return;

            const result = this.gameEngine.diceEngine.roll(expression);
            document.getElementById('dice-result').textContent = result;
            
            this.addToRollHistory(expression, result);
            this.animateDiceRoll();
        } catch (error) {
            console.error('Error rolling custom dice:', error);
            this.showError('Invalid dice expression: ' + error.message);
        }
    }

    addToRollHistory(expression, result) {
        const timestamp = new Date().toLocaleTimeString();
        this.rollHistory.unshift({ expression, result, timestamp });
        
        // Keep history limited
        if (this.rollHistory.length > this.maxHistoryItems) {
            this.rollHistory = this.rollHistory.slice(0, this.maxHistoryItems);
        }

        this.updateRollHistoryDisplay();
    }

    updateRollHistoryDisplay() {
        const container = document.getElementById('roll-history-list');
        if (!container) return;

        container.innerHTML = this.rollHistory.map(roll => `
            <div style="padding: 0.5rem; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
                <span style="color: #d4af37; font-weight: bold;">${roll.expression}</span> = 
                <span style="color: #e8e6e3; font-size: 1.2rem;">${roll.result}</span>
                <span style="color: #aaa; font-size: 0.8rem; float: right;">${roll.timestamp}</span>
            </div>
        `).join('');
    }

    animateDiceRoll() {
        const resultElement = document.getElementById('dice-result');
        resultElement.style.transform = 'scale(1.2)';
        resultElement.style.color = '#d4af37';
        
        setTimeout(() => {
            resultElement.style.transform = 'scale(1)';
            resultElement.style.color = '#d4af37';
        }, 200);
    }

    // Utility Functions
    generateRandomName() {
        const names = [
            'Aerdrie', 'Bhaal', 'Cyric', 'Drizzt', 'Elminster', 'Farideh',
            'Gareth', 'Halaster', 'Imoen', 'Jarl', 'Khelben', 'Laeral',
            'Minsc', 'Nalia', 'Oghma', 'Pikel', 'Qilue', 'Regis',
            'Shandril', 'Tyr', 'Ulraunt', 'Viconia', 'Wulfgar', 'Xan',
            'Yoshimo', 'Zhentarim'
        ];
        return names[Math.floor(Math.random() * names.length)];
    }

    getRandomRace() {
        const races = ['human', 'elf', 'dwarf', 'halfling', 'gnome', 'half-elf', 'half-orc'];
        return races[Math.floor(Math.random() * races.length)];
    }

    getRandomClass() {
        const classes = [
            'barbarian', 'bard', 'cleric', 'druid', 'fighter',
            'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'wizard'
        ];
        return classes[Math.floor(Math.random() * classes.length)];
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;

        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }

    showNoCharacterMessage() {
        const container = document.querySelector('.tab-content.active .card');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h2 style="color: #d4af37; margin-bottom: 1rem;">No Character Selected</h2>
                    <p>Please create a character in the Character Creation tab first.</p>
                    <button class="btn" onclick="webInterface.switchTab('character-creation')" style="margin-top: 1rem;">
                        Create Character
                    </button>
                </div>
            `;
        }
    }

    refreshInterface() {
        // Refresh current tab content
        const activeTab = document.querySelector('.nav-tab.active');
        if (activeTab) {
            this.refreshTabContent(activeTab.dataset.tab);
        }
    }

    // Additional helper methods for specific functionality
    populateCharacterForm(character) {
        document.getElementById('character-name').value = character.name;
        document.getElementById('character-race').value = character.race;
        document.getElementById('character-class').value = character.class;
        document.getElementById('character-level').value = character.level;
        
        this.displayAbilityScores(character.abilities);
    }

    getEquippedItemInSlot(slotId) {
        if (!this.currentCharacter || !this.gameEngine.equipmentManager) return null;
        
        const equipped = this.gameEngine.equipmentManager.getEquippedItems(this.currentCharacter);
        return equipped[slotId] ? equipped[slotId][0] : null;
    }
}

// Global functions for HTML event handlers
let webInterface;

// Character Management
window.generateRandomCharacter = () => webInterface?.generateRandomCharacter();
window.rollAbilityScores = () => webInterface?.rollAbilityScores();
window.createCharacter = () => webInterface?.createCharacter();
window.levelUpCharacter = () => webInterface?.levelUpCharacter();
window.addFeat = () => webInterface?.addFeat();
window.trainSkills = () => webInterface?.trainSkills();
window.dealDamage = () => webInterface?.dealDamage();

// Spell Management
window.restoreSpells = () => webInterface?.restoreSpells();
window.searchSpells = () => webInterface?.searchSpells();
window.prepareSpells = () => webInterface?.prepareSpells();
window.castSpell = (spellName) => webInterface?.castSpell(spellName);
window.toggleSpellSlot = (level, index) => webInterface?.toggleSpellSlot(level, index);

// Equipment Management
window.addItem = () => webInterface?.addItem();
window.manageEquipmentSlot = (slotId) => webInterface?.manageEquipmentSlot(slotId);

// Adventure Generation
window.generateAdventure = () => webInterface?.generateAdventure();
window.generateEncounter = () => webInterface?.generateEncounter();
window.generateNPC = () => webInterface?.generateNPC();

// Dice Rolling
window.rollDice = (sides) => webInterface?.rollDice(sides);
window.rollAdvantage = () => webInterface?.rollAdvantage();
window.rollDisadvantage = () => webInterface?.rollDisadvantage();
window.rollCustomDice = () => webInterface?.rollCustomDice();

// Character Management
window.createNewCharacter = () => webInterface?.createNewCharacter();
window.showCharacterStats = () => webInterface?.showCharacterStats();
window.selectCharacter = (characterId) => webInterface?.selectCharacter(characterId);
window.editCharacter = (characterId) => webInterface?.editCharacter(characterId);

// Random Tables
window.rollRandomTables = () => webInterface?.rollRandomTables();
window.rollSingleTable = (tableName) => webInterface?.rollSingleTable(tableName);

// Modal Management
window.closeModal = (modalId) => webInterface?.closeModal(modalId);

// Initialize interface when page loads
document.addEventListener('DOMContentLoaded', () => {
    webInterface = new RulzLawyerWebInterface();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RulzLawyerWebInterface;
} else if (typeof window !== 'undefined') {
    window.RulzLawyerWebInterface = RulzLawyerWebInterface;
}
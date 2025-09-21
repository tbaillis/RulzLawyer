/**
 * RulzLawyer Complete D&D 3.5 Web Interface
 * Comprehensive JavaScript controller for all game systems
 * 
 * Features:
 * - D&D 3.5 Character creation and management
 * - Spell system integration
 * - Equipment management
 * - Adventure generation
 * - Dice rolling system
 * - Complete SRD integration
 * 
 * @version 2.0
 * @date December 2024
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

        // Enter key for dice rolling
        const diceInput = document.getElementById('dice-expression');
        if (diceInput) {
            diceInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.rollDice();
                }
            });
        }
    }

    switchTab(tabName) {
        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedContent = document.getElementById(tabName);
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
        
        // Add active class to clicked tab
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        console.log(`Switched to ${tabName} tab`);
    }

    initializeTabs() {
        // Ensure the first tab is active by default
        const firstTab = document.querySelector('.nav-tab');
        const firstContent = document.querySelector('.tab-content');
        
        if (firstTab && firstContent) {
            firstTab.classList.add('active');
            firstContent.classList.add('active');
        }
    }

    // Dice Rolling System
    rollDice() {
        try {
            const expression = document.getElementById('dice-expression').value.trim();
            if (!expression) {
                this.showError('Please enter a dice expression');
                return;
            }

            const result = this.gameEngine.diceEngine.roll(expression);
            this.displayDiceResult(expression, result);
            this.addToRollHistory(expression, result);
        } catch (error) {
            console.error('Error rolling dice:', error);
            this.showError('Invalid dice expression. Try something like "1d20" or "3d6+2"');
        }
    }

    displayDiceResult(expression, result) {
        const resultContainer = document.getElementById('dice-result');
        if (!resultContainer) return;

        const breakdown = result.dice ? result.dice.map(d => d.result).join(', ') : '';
        
        resultContainer.innerHTML = `
            <div class="roll-result-display">
                <div class="result-header">
                    <strong>Rolling ${expression}</strong>
                </div>
                <div class="result-value">
                    <span class="final-result">${result.total || result}</span>
                </div>
                ${breakdown ? `
                    <div class="result-breakdown">
                        Individual dice: [${breakdown}]
                        ${result.modifier ? ` + ${result.modifier}` : ''}
                    </div>
                ` : ''}
                <div class="result-timestamp">
                    ${new Date().toLocaleTimeString()}
                </div>
            </div>
        `;
    }

    addToRollHistory(expression, result) {
        const roll = {
            expression,
            result: result.total || result,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.rollHistory.unshift(roll);
        if (this.rollHistory.length > this.maxHistoryItems) {
            this.rollHistory.pop();
        }
    }

    rollAdvantage() {
        try {
            const result1 = this.gameEngine.diceEngine.roll('1d20');
            const result2 = this.gameEngine.diceEngine.roll('1d20');
            const final = Math.max(result1.total, result2.total);
            
            this.displayDiceResult('Advantage (2d20)', { 
                total: final,
                dice: [
                    { result: result1.total },
                    { result: result2.total }
                ]
            });
            
            this.addToRollHistory('Advantage', final);
        } catch (error) {
            console.error('Error rolling advantage:', error);
            this.showError('Failed to roll advantage.');
        }
    }

    rollDisadvantage() {
        try {
            const result1 = this.gameEngine.diceEngine.roll('1d20');
            const result2 = this.gameEngine.diceEngine.roll('1d20');
            const final = Math.min(result1.total, result2.total);
            
            this.displayDiceResult('Disadvantage (2d20)', {
                total: final,
                dice: [
                    { result: result1.total },
                    { result: result2.total }
                ]
            });
            
            this.addToRollHistory('Disadvantage', final);
        } catch (error) {
            console.error('Error rolling disadvantage:', error);
            this.showError('Failed to roll disadvantage.');
        }
    }

    // Character Management
    createNewCharacter() {
        try {
            // Check if D&D 3.5 Character Wizard is available
            if (typeof DnD35CharacterWizard !== 'undefined') {
                console.log('🧙 Starting D&D 3.5 Character Wizard...');
                
                // Create and start the D&D 3.5 character wizard
                const wizard = new DnD35CharacterWizard(this.gameEngine);
                
                // Store wizard globally for button callbacks
                window.characterWizard = wizard;
                
                wizard.startCreation();
                return; // Exit early since wizard handles its own modal
            }
            
            // Fallback to old character creation method
            console.log('⚠️ D&D 3.5 Character Wizard not available, using legacy method');
            
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
                        <div class="character-stats">HP: ${char.hitPoints?.current || char.hitPoints?.maximum || 0}/${char.hitPoints?.maximum || 0}</div>
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
            const detailsContainer = document.getElementById('character-details');
            if (!detailsContainer) return;

            if (!this.currentCharacter) {
                detailsContainer.innerHTML = `
                    <div class="text-center" style="color: #ccc; padding: 2rem;">
                        Select a character to view details
                    </div>
                `;
                return;
            }

            const char = this.currentCharacter;
            
            // Check if D&D 3.5 Character Sheet is available
            if (typeof DnD35CharacterSheet !== 'undefined') {
                const characterSheet = new DnD35CharacterSheet();
                detailsContainer.innerHTML = characterSheet.renderCharacterSheet(char);
                console.log('✅ Displayed character using D&D 3.5 Character Sheet');
            } else {
                // Fallback to basic character display
                console.log('⚠️ D&D 3.5 Character Sheet not available, using basic display');
                detailsContainer.innerHTML = `
                    <div class="character-sheet">
                        <div class="character-header">
                            <h3>${char.name}</h3>
                            <p>Level ${char.level} ${char.race} ${char.class}</p>
                            <div class="status-indicator">${char.status || 'Active'}</div>
                        </div>
                        <div class="character-stats">
                            <div class="stat-block">
                                <h4>Basic Info</h4>
                                <div>Name: ${char.name}</div>
                                <div>Race: ${char.race}</div>
                                <div>Class: ${char.class}</div>
                                <div>Level: ${char.level}</div>
                            </div>
                            <div class="character-actions">
                                <button class="action-btn" onclick="editCharacter('${char.id}')">Edit Character</button>
                                <button class="action-btn danger" onclick="deleteCharacter('${char.id}')">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error updating character details:', error);
            const detailsContainer = document.getElementById('character-details');
            if (detailsContainer) {
                detailsContainer.innerHTML = '<div class="error">Failed to load character details</div>';
            }
        }
    }

    // Random Tables
    populateRandomTables() {
        try {
            if (!this.gameEngine.randomTablesIndex) {
                console.log('Random tables system not available');
                return;
            }

            const categoriesContainer = document.getElementById('table-categories');
            if (!categoriesContainer) return;

            const categories = this.gameEngine.randomTablesIndex.getCategories();
            let html = '';
            
            categories.forEach(category => {
                const tables = this.gameEngine.randomTablesIndex.getTablesInCategory(category);
                
                html += `
                    <div class="table-category">
                        <h3 class="category-title">${category}</h3>
                        <ul class="table-list">
                            ${tables.map(tableName => 
                                `<li class="table-item" onclick="rollFromTable('${tableName}')">${tableName}</li>`
                            ).join('')}
                        </ul>
                    </div>
                `;
            });

            categoriesContainer.innerHTML = html;
        } catch (error) {
            console.error('Error populating random tables:', error);
        }
    }

    rollFromTable(tableName) {
        try {
            const result = this.gameEngine.randomTablesIndex.rollOnTable(tableName);
            
            const resultsContainer = document.getElementById('table-results');
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div class="table-result">
                        <h4>${tableName}</h4>
                        <div class="result-value">${result.value || result}</div>
                        <div class="result-timestamp">${new Date().toLocaleTimeString()}</div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error rolling from table:', error);
            this.showError(`Failed to roll from ${tableName} table.`);
        }
    }

    // Adventure Generation
    generateAdventure() {
        try {
            if (!this.gameEngine.adventureEngine) {
                this.showError('Adventure engine not available');
                return;
            }

            const adventure = this.gameEngine.adventureEngine.generateAdventure();
            
            const displayContainer = document.getElementById('adventure-display');
            if (displayContainer) {
                displayContainer.innerHTML = `
                    <div class="adventure-content">
                        <h3>${adventure.title}</h3>
                        <div class="adventure-section">
                            <h4>Overview</h4>
                            <p>${adventure.overview}</p>
                        </div>
                        <div class="adventure-section">
                            <h4>Setting</h4>
                            <p>${adventure.setting}</p>
                        </div>
                        <div class="adventure-section">
                            <h4>Main Quest</h4>
                            <p>${adventure.mainQuest}</p>
                        </div>
                        <div class="adventure-section">
                            <h4>Key NPCs</h4>
                            <ul>
                                ${adventure.npcs.map(npc => `<li>${npc}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="adventure-section">
                            <h4>Encounters</h4>
                            <ul>
                                ${adventure.encounters.map(encounter => `<li>${encounter}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="adventure-section">
                            <h4>Treasure</h4>
                            <p>${adventure.treasure}</p>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error generating adventure:', error);
            this.showError('Failed to generate adventure.');
        }
    }

    // UI Helpers
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles
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
        
        // Set background color based on type
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #dc3545, #e74c3c)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #17a2b8, #6f42c1)';
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    }

    refreshInterface() {
        this.updateCharacterList();
        this.populateRandomTables();
    }
}

// Global functions for HTML event handlers
let webInterface;

// D&D 3.5 Character Wizard Functions
window.closeDnD35Wizard = () => {
    const modal = document.getElementById('dnd35-wizard-modal');
    if (modal) {
        modal.remove();
    }
    window.currentWizard = null;
    window.wizardModal = null;
};

window.finishCharacterCreation = (character) => {
    try {
        console.log('✅ Character creation completed:', character);
        
        // Save character using character manager
        if (webInterface?.gameEngine?.characterManager) {
            webInterface.gameEngine.characterManager.characters.push(character);
            webInterface.gameEngine.characterManager.saveCharacters();
            
            // Update the character list display
            webInterface.updateCharacterList();
            
            // Close wizard
            window.closeDnD35Wizard();
            
            // Switch to characters tab to show the new character
            webInterface.switchTab('characters');
            
            // Show success message
            webInterface.showSuccess(`Character "${character.name}" created successfully!`);
        } else {
            throw new Error('Character manager not available');
        }
    } catch (error) {
        console.error('Error finishing character creation:', error);
        webInterface?.showError('Failed to save character: ' + error.message);
    }
};

// Global Event Handlers
window.createNewCharacter = () => webInterface?.createNewCharacter();
window.selectCharacter = (characterId) => webInterface?.selectCharacter(characterId);
window.editCharacter = (characterId) => console.log('Edit character:', characterId);
window.deleteCharacter = (characterId) => console.log('Delete character:', characterId);
window.rollDice = () => webInterface?.rollDice();
window.rollAdvantage = () => webInterface?.rollAdvantage();
window.rollDisadvantage = () => webInterface?.rollDisadvantage();
window.rollFromTable = (tableName) => webInterface?.rollFromTable(tableName);
window.generateAdventure = () => webInterface?.generateAdventure();
window.closeModal = (modalId) => webInterface?.closeModal(modalId);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 Initializing Web Interface...');
    webInterface = new RulzLawyerWebInterface();
    window.webInterface = webInterface; // Make available globally
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RulzLawyerWebInterface;
} else if (typeof window !== 'undefined') {
    window.RulzLawyerWebInterface = RulzLawyerWebInterface;
}
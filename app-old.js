/**
 * RulzLawyer - Main Application Controller
 * Integrates all backend systems with the web interface
 * D&D 3.5 SRD Compliant Adventure Engine
 */

// Global application state
const RulzLawyer = {
    // Core engine instances
    diceEngine: null,
    tablesEngine: null,
    characterManager: null,
    adventureEngine: null,
    storageManager: null,
    
    // UI state
    currentTab: 'dice',
    selectedCharacter: null,
    
    // Statistics
    sessionStats: {
        diceRolls: 0,
        tablesRolled: 0,
        charactersCreated: 0,
        adventuresGenerated: 0
    }
};

/**
 * Application Initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎲 Initializing RulzLawyer...');
    
    // Initialize core engines
    initializeCoreEngines();
    
    // Setup UI event listeners
    setupEventListeners();
    
    // Load saved data
    loadApplicationData();
    
    // Initialize random tables display
    initializeRandomTables();
    
    console.log('✅ RulzLawyer initialized successfully!');
});

/**
 * Initialize Core Game Engines
 */
function initializeCoreEngines() {
    try {
        // Initialize dice engine with crypto-secure randomness
        RulzLawyer.diceEngine = new DiceEngine(true);
        
        // Initialize random tables engine
        RulzLawyer.tablesEngine = new RandomTablesEngine(RulzLawyer.diceEngine);
        
        // Initialize character manager
        RulzLawyer.characterManager = new CharacterManager(RulzLawyer.diceEngine, RulzLawyer.tablesEngine);
        
        // Initialize adventure engine
        RulzLawyer.adventureEngine = new AdventureEngine(RulzLawyer.diceEngine, RulzLawyer.tablesEngine);
        
        // Initialize storage manager with character death audit logging
        RulzLawyer.storageManager = new StorageManager(true);
        
        console.log('✅ All core engines initialized');
    } catch (error) {
        console.error('❌ Failed to initialize core engines:', error);
        showError('Failed to initialize game engines. Please refresh the page.');
    }
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });
    
    // Dice roller events
    document.getElementById('dice-expression').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') rollDice();
    });
    
    document.querySelectorAll('[data-dice]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.getElementById('dice-expression').value = e.target.dataset.dice;
            rollDice();
        });
    });
    
    // Character form events
    document.getElementById('character-form').addEventListener('submit', handleCharacterCreation);
    document.getElementById('damage-form').addEventListener('submit', handleDamageDealing);
    document.getElementById('healing-form').addEventListener('submit', handleHealing);
    
    // Modal close events
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal(modal.id);
        });
    });
}

/**
 * Tab Navigation System
 */
function switchTab(tabName) {
    // Update nav buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update content areas
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
    
    RulzLawyer.currentTab = tabName;
    
    // Tab-specific initialization
    if (tabName === 'characters') {
        refreshCharacterList();
    } else if (tabName === 'tables') {
        refreshTableCategories();
    }
}

/**
 * ===== DICE ROLLING SYSTEM =====
 */

function rollDice() {
    const expression = document.getElementById('dice-expression').value.trim();
    if (!expression) {
        showError('Please enter a dice expression');
        return;
    }
    
    try {
        const result = RulzLawyer.diceEngine.rollExpression(expression);
        displayDiceResult(result, expression);
        RulzLawyer.sessionStats.diceRolls++;
        updateDiceStatistics();
    } catch (error) {
        console.error('Dice roll error:', error);
        showError(`Invalid dice expression: ${error.message}`);
    }
}

function rollAdvantage() {
    try {
        const result = RulzLawyer.diceEngine.rollAdvantage();
        displayDiceResult(result, '1d20 Advantage');
        RulzLawyer.sessionStats.diceRolls++;
        updateDiceStatistics();
    } catch (error) {
        console.error('Advantage roll error:', error);
        showError('Failed to roll with advantage');
    }
}

function rollDisadvantage() {
    try {
        const result = RulzLawyer.diceEngine.rollDisadvantage();
        displayDiceResult(result, '1d20 Disadvantage');
        RulzLawyer.sessionStats.diceRolls++;
        updateDiceStatistics();
    } catch (error) {
        console.error('Disadvantage roll error:', error);
        showError('Failed to roll with disadvantage');
    }
}

function displayDiceResult(result, expression) {
    const resultDiv = document.getElementById('dice-result');
    
    let html = `<div class="result-total">${result.total}</div>`;
    
    if (result.breakdown) {
        html += `<div class="result-breakdown">`;
        html += `<strong>Expression:</strong> ${expression}<br>`;
        html += `<strong>Breakdown:</strong> ${result.breakdown}<br>`;
        html += `<strong>Individual Rolls:</strong> [${result.individualRolls.join(', ')}]<br>`;
        
        if (result.advantage) {
            html += `<strong>Advantage:</strong> Rolled ${result.individualRolls.join(', ')}, took higher<br>`;
        } else if (result.disadvantage) {
            html += `<strong>Disadvantage:</strong> Rolled ${result.individualRolls.join(', ')}, took lower<br>`;
        }
        
        html += `<strong>Timestamp:</strong> ${new Date().toLocaleTimeString()}`;
        html += `</div>`;
    }
    
    resultDiv.innerHTML = html;
}

function updateDiceStatistics() {
    const statsElement = document.getElementById('dice-statistics');
    if (statsElement) {
        statsElement.textContent = `Rolls: ${RulzLawyer.sessionStats.diceRolls}`;
    }
}

/**
 * ===== ADVENTURE ENGINE SYSTEM =====
 */

function generateAdventure() {
    try {
        // Generate comprehensive adventure using the AdventureEngine
        const adventure = RulzLawyer.adventureEngine.generateCompleteAdventure();
        
        displayAdventure(adventure);
        RulzLawyer.sessionStats.adventuresGenerated++;
        
        console.log('🏰 Adventure generated:', adventure);
        
    } catch (error) {
        console.error('Adventure generation error:', error);
        showError('Failed to generate adventure: ' + error.message);
    }
}

function displayAdventure(adventure) {
    const displayDiv = document.getElementById('adventure-display');
    
    const html = `
        <div class="adventure-section">
            <div class="adventure-section-title">🏰 Adventure: ${adventure.id}</div>
            <div><strong>Difficulty:</strong> ${adventure.metadata.difficulty} | <strong>Party Level:</strong> ${adventure.metadata.partyLevel} | <strong>Duration:</strong> ${adventure.metadata.estimatedDuration}</div>
        </div>
        
        <div class="adventure-section">
            <div class="adventure-section-title">🌍 Adventure Setting</div>
            <div><strong>Primary Location:</strong> ${adventure.setting.primaryLocation.value}</div>
            <div><strong>Secondary Location:</strong> ${adventure.setting.secondaryLocation.value}</div>
            <div><strong>Atmosphere:</strong> ${adventure.setting.atmosphere.value}</div>
        </div>
        
        <div class="adventure-section">
            <div class="adventure-section-title">📜 Adventure Hook</div>
            <div><strong>Primary Hook:</strong> ${adventure.hook.primaryHook}</div>
            <div><strong>Motivation:</strong> ${adventure.hook.motivation}</div>
            <div><strong>Stakes:</strong> ${adventure.hook.stakesLevel}</div>
        </div>
        
        <div class="adventure-section">
            <div class="adventure-section-title">⚔️ Encounters (${adventure.encounters.length} total)</div>
            ${adventure.encounters.map((enc, idx) => `
                <div style="margin: 0.5rem 0; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <strong>Encounter ${idx + 1}:</strong> ${enc.description} 
                    <span style="color: #d4af37;">(${enc.difficulty})</span>
                </div>
            `).join('')}
        </div>
        
        <div class="adventure-section">
            <div class="adventure-section-title">👥 Key NPCs</div>
            ${adventure.npcs.map(npc => `
                <div style="margin: 0.5rem 0;">
                    <strong>${npc.role}:</strong> ${npc.character.value} (${npc.disposition})
                </div>
            `).join('')}
        </div>
        
        <div class="adventure-section">
            <div class="adventure-section-title">📍 Adventure Locations</div>
            ${adventure.locations.map(loc => `
                <div style="margin: 0.5rem 0;">
                    <strong>${loc.purpose}:</strong> ${loc.description.value}
                </div>
            `).join('')}
        </div>
        
        <div class="adventure-section">
            <div class="adventure-section-title">💎 Treasures & Rewards</div>
            ${adventure.treasures.map(treasure => `
                <div style="margin: 0.5rem 0;">
                    <strong>${treasure.type}:</strong> ${treasure.description.value}
                </div>
            `).join('')}
        </div>
        
        <div class="adventure-section">
            <div class="adventure-section-title">🌪️ Complications & Twists</div>
            <div><strong>Primary Complication:</strong> ${adventure.complications.primaryComplication.value}</div>
            <div><strong>Plot Twist:</strong> ${adventure.plotTwists.majorTwist.value}</div>
        </div>
        
        <div class="adventure-section">
            <div class="adventure-section-title">🌿 Environment</div>
            <div><strong>Weather:</strong> ${adventure.environment.weather.value}</div>
            <div><strong>Hazard:</strong> ${adventure.environment.environmentalHazard.value}</div>
        </div>
        
        <div style="text-align: center; margin-top: 2rem; font-size: 0.9rem; color: #ccc;">
            <strong>Generated:</strong> ${new Date().toLocaleTimeString()}<br>
            <strong>Sessions:</strong> ${RulzLawyer.sessionStats.adventuresGenerated} adventures created
        </div>
    `;
    
    displayDiv.innerHTML = html;
}

/**
 * ===== CHARACTER MANAGEMENT SYSTEM =====
 */

function createNewCharacter() {
    showModal('character-modal');
    // Clear form
    document.getElementById('character-form').reset();
}

function handleCharacterCreation(event) {
    event.preventDefault();
    
    const name = document.getElementById('char-name').value.trim();
    const race = document.getElementById('char-race').value || null;
    const characterClass = document.getElementById('char-class').value || null;
    const level = parseInt(document.getElementById('char-level').value) || 1;
    
    if (!name) {
        showError('Please enter a character name');
        return;
    }
    
    try {
        const character = RulzLawyer.characterManager.createCharacter({
            name,
            race,
            class: characterClass,
            level
        });
        
        RulzLawyer.sessionStats.charactersCreated++;
        closeModal('character-modal');
        refreshCharacterList();
        selectCharacter(character.id);
        
        showSuccess(`Character ${character.name} created successfully!`);
        
    } catch (error) {
        console.error('Character creation error:', error);
        showError('Failed to create character: ' + error.message);
    }
}

function refreshCharacterList() {
    const characterList = document.getElementById('character-list');
    const characters = RulzLawyer.characterManager.getAllCharacters();
    
    if (characters.length === 0) {
        characterList.innerHTML = `
            <div class="text-center" style="padding: 2rem; color: #ccc;">
                No characters created yet.<br>
                <button class="action-btn mt-2" onclick="createNewCharacter()">Create Your First Character</button>
            </div>
        `;
        return;
    }
    
    const html = characters.map(character => {
        const statusClass = character.status === 'dead' ? 'dead' : 'alive';
        const statusText = character.status.charAt(0).toUpperCase() + character.status.slice(1);
        
        return `
            <div class="character-item ${statusClass} ${RulzLawyer.selectedCharacter === character.id ? 'active' : ''}" 
                 onclick="selectCharacter('${character.id}')">
                <div class="character-name">${character.name}</div>
                <div class="character-info">${character.race} ${character.class} (Level ${character.level})</div>
                <div class="character-status status-${statusClass}">${statusText}</div>
            </div>
        `;
    }).join('');
    
    characterList.innerHTML = html;
}

function selectCharacter(characterId) {
    RulzLawyer.selectedCharacter = characterId;
    refreshCharacterList();
    displayCharacterDetails(characterId);
}

function displayCharacterDetails(characterId) {
    const character = RulzLawyer.characterManager.getCharacter(characterId);
    if (!character) {
        document.getElementById('character-details').innerHTML = `
            <div class="text-center" style="color: #ccc; padding: 2rem;">
                Character not found
            </div>
        `;
        return;
    }
    
    const hpPercentage = Math.max(0, (character.currentHP / character.maxHP) * 100);
    const statusClass = character.status === 'dead' ? 'dead' : 'alive';
    const statusText = character.status.charAt(0).toUpperCase() + character.status.slice(1);
    
    const html = `
        <div class="text-center mb-2">
            <h3 class="text-gold">${character.name}</h3>
            <div class="character-status status-${statusClass}">${statusText}</div>
        </div>
        
        <div class="stat-grid">
            <div class="stat-item">
                <div class="stat-label">Level</div>
                <div class="stat-value">${character.level}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Race</div>
                <div class="stat-value">${character.race}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Class</div>
                <div class="stat-value">${character.class}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">AC</div>
                <div class="stat-value">${character.armorClass}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Initiative</div>
                <div class="stat-value">+${character.initiative}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Speed</div>
                <div class="stat-value">${character.speed} ft</div>
            </div>
        </div>
        
        <div class="hp-bar-container">
            <div class="hp-bar">
                <div class="hp-bar-fill" style="width: ${hpPercentage}%"></div>
                <div class="hp-text">HP: ${character.currentHP} / ${character.maxHP}</div>
            </div>
        </div>
        
        <div class="stat-grid">
            <div class="stat-item">
                <div class="stat-label">STR</div>
                <div class="stat-value">${character.abilities.strength}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">DEX</div>
                <div class="stat-value">${character.abilities.dexterity}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">CON</div>
                <div class="stat-value">${character.abilities.constitution}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">INT</div>
                <div class="stat-value">${character.abilities.intelligence}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">WIS</div>
                <div class="stat-value">${character.abilities.wisdom}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">CHA</div>
                <div class="stat-value">${character.abilities.charisma}</div>
            </div>
        </div>
        
        <div class="action-buttons">
            <button class="action-btn danger" onclick="dealDamage('${characterId}')">Deal Damage</button>
            <button class="action-btn" onclick="healCharacter('${characterId}')">Heal</button>
            <button class="action-btn secondary" onclick="levelUpCharacter('${characterId}')">Level Up</button>
            <button class="action-btn danger" onclick="deleteCharacter('${characterId}')">Delete</button>
        </div>
    `;
    
    document.getElementById('character-details').innerHTML = html;
}

function dealDamage(characterId) {
    RulzLawyer.selectedCharacter = characterId;
    showModal('damage-modal');
}

function healCharacter(characterId) {
    RulzLawyer.selectedCharacter = characterId;
    showModal('healing-modal');
}

function handleDamageDealing(event) {
    event.preventDefault();
    
    const damage = parseInt(document.getElementById('damage-amount').value);
    const damageType = document.getElementById('damage-type').value;
    
    if (!damage || damage < 1) {
        showError('Please enter a valid damage amount');
        return;
    }
    
    try {
        const character = RulzLawyer.characterManager.getCharacter(RulzLawyer.selectedCharacter);
        if (!character) {
            showError('Character not found');
            return;
        }
        
        const result = RulzLawyer.characterManager.applyDamage(RulzLawyer.selectedCharacter, damage, damageType);
        
        closeModal('damage-modal');
        displayCharacterDetails(RulzLawyer.selectedCharacter);
        refreshCharacterList();
        
        if (result.died) {
            showWarning(`${character.name} has died from ${damage} ${damageType} damage!`);
        } else {
            showSuccess(`Dealt ${damage} ${damageType} damage to ${character.name}`);
        }
        
    } catch (error) {
        console.error('Damage dealing error:', error);
        showError('Failed to deal damage: ' + error.message);
    }
}

function handleHealing(event) {
    event.preventDefault();
    
    const healing = parseInt(document.getElementById('healing-amount').value);
    
    if (!healing || healing < 1) {
        showError('Please enter a valid healing amount');
        return;
    }
    
    try {
        const character = RulzLawyer.characterManager.getCharacter(RulzLawyer.selectedCharacter);
        if (!character) {
            showError('Character not found');
            return;
        }
        
        RulzLawyer.characterManager.healCharacter(RulzLawyer.selectedCharacter, healing);
        
        closeModal('healing-modal');
        displayCharacterDetails(RulzLawyer.selectedCharacter);
        refreshCharacterList();
        
        showSuccess(`Healed ${character.name} for ${healing} HP`);
        
    } catch (error) {
        console.error('Healing error:', error);
        showError('Failed to heal character: ' + error.message);
    }
}

function levelUpCharacter(characterId) {
    try {
        const character = RulzLawyer.characterManager.getCharacter(characterId);
        if (!character) {
            showError('Character not found');
            return;
        }
        
        if (character.status === 'dead') {
            showError('Cannot level up a dead character');
            return;
        }
        
        // Simple level up (you could add more complex leveling logic)
        character.level += 1;
        character.maxHP += RulzLawyer.diceEngine.rollDice(1, 8).total; // Simple HP increase
        character.currentHP = character.maxHP; // Full heal on level up
        
        displayCharacterDetails(characterId);
        refreshCharacterList();
        
        showSuccess(`${character.name} leveled up to level ${character.level}!`);
        
    } catch (error) {
        console.error('Level up error:', error);
        showError('Failed to level up character: ' + error.message);
    }
}

function deleteCharacter(characterId) {
    try {
        const character = RulzLawyer.characterManager.getCharacter(characterId);
        if (!character) {
            showError('Character not found');
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${character.name}? This cannot be undone.`)) {
            RulzLawyer.characterManager.deleteCharacter(characterId);
            
            if (RulzLawyer.selectedCharacter === characterId) {
                RulzLawyer.selectedCharacter = null;
            }
            
            refreshCharacterList();
            document.getElementById('character-details').innerHTML = `
                <div class="text-center" style="color: #ccc; padding: 2rem;">
                    Select a character to view details
                </div>
            `;
            
            showSuccess(`${character.name} has been deleted`);
        }
        
    } catch (error) {
        console.error('Character deletion error:', error);
        showError('Failed to delete character: ' + error.message);
    }
}

/**
 * ===== RANDOM TABLES SYSTEM =====
 */

function initializeRandomTables() {
    refreshTableCategories();
}

function refreshTableCategories() {
    const tablesContainer = document.getElementById('table-categories');
    const availableTables = RulzLawyer.tablesEngine.getAvailableTables();
    
    // Group tables by category
    const categories = {};
    availableTables.forEach(tableName => {
        const parts = tableName.split('-');
        const category = parts[0] === 'random' ? parts[1] : parts[0];
        
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(tableName);
    });
    
    const html = Object.entries(categories).map(([category, tables]) => `
        <div class="table-category">
            <div class="category-title">${category.replace('-', ' ')}</div>
            <ul class="table-list">
                ${tables.map(table => `
                    <li class="table-item" onclick="rollTable('${table}')">
                        ${table.replace(/-/g, ' ').replace(/^random\s/, '')}
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
    
    tablesContainer.innerHTML = html;
}

function rollTable(tableName) {
    try {
        const result = RulzLawyer.tablesEngine.rollTable(tableName);
        displayTableResult(tableName, result);
        RulzLawyer.sessionStats.tablesRolled++;
    } catch (error) {
        console.error('Table roll error:', error);
        showError(`Failed to roll table ${tableName}: ${error.message}`);
    }
}

function displayTableResult(tableName, result) {
    const resultsDiv = document.getElementById('table-results');
    
    const html = `
        <div style="border-bottom: 1px solid rgba(212, 175, 55, 0.3); padding-bottom: 1rem; margin-bottom: 1rem;">
            <div style="font-weight: bold; color: #d4af37; margin-bottom: 0.5rem;">
                📜 ${tableName.replace(/-/g, ' ').toUpperCase()}
            </div>
            <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">
                ${result.value}
            </div>
            <div style="font-size: 0.8rem; color: #ccc;">
                Roll: ${result.roll} | Timestamp: ${new Date().toLocaleTimeString()}
            </div>
        </div>
        ${resultsDiv.innerHTML}
    `;
    
    resultsDiv.innerHTML = html;
}

function rollRandomTables() {
    try {
        const availableTables = RulzLawyer.tablesEngine.getAvailableTables();
        const numberOfTables = Math.min(5, availableTables.length);
        const selectedTables = [];
        
        // Select random tables
        while (selectedTables.length < numberOfTables) {
            const randomTable = availableTables[Math.floor(Math.random() * availableTables.length)];
            if (!selectedTables.includes(randomTable)) {
                selectedTables.push(randomTable);
            }
        }
        
        // Roll all selected tables
        selectedTables.forEach(tableName => {
            setTimeout(() => rollTable(tableName), selectedTables.indexOf(tableName) * 200);
        });
        
        showSuccess(`Rolling ${numberOfTables} random tables...`);
        
    } catch (error) {
        console.error('Multiple table roll error:', error);
        showError('Failed to roll multiple tables: ' + error.message);
    }
}

function showCharacterStats() {
    const characters = RulzLawyer.characterManager.getAllCharacters();
    if (characters.length === 0) {
        showWarning('No characters to display statistics for');
        return;
    }
    
    const aliveCharacters = characters.filter(c => c.status !== 'dead');
    const deadCharacters = characters.filter(c => c.status === 'dead');
    
    const stats = `
Character Statistics:
• Total Characters: ${characters.length}
• Alive: ${aliveCharacters.length}
• Dead: ${deadCharacters.length}
• Average Level: ${Math.round(characters.reduce((sum, c) => sum + c.level, 0) / characters.length)}

Session Statistics:
• Dice Rolls: ${RulzLawyer.sessionStats.diceRolls}
• Tables Rolled: ${RulzLawyer.sessionStats.tablesRolled}
• Adventures Generated: ${RulzLawyer.sessionStats.adventuresGenerated}
    `.trim();
    
    alert(stats);
}

/**
 * ===== DATA MANAGEMENT =====
 */

function loadApplicationData() {
    try {
        // Load any saved data from storage
        const savedData = RulzLawyer.storageManager.loadData('rulzlawyer_session');
        if (savedData) {
            RulzLawyer.sessionStats = { ...RulzLawyer.sessionStats, ...savedData.sessionStats };
            console.log('✅ Application data loaded');
        }
    } catch (error) {
        console.warn('⚠️ Failed to load saved data:', error);
    }
}

function saveApplicationData() {
    try {
        const dataToSave = {
            sessionStats: RulzLawyer.sessionStats,
            timestamp: new Date().toISOString()
        };
        RulzLawyer.storageManager.saveData('rulzlawyer_session', dataToSave);
        console.log('✅ Application data saved');
    } catch (error) {
        console.warn('⚠️ Failed to save data:', error);
    }
}

// Auto-save every 30 seconds
setInterval(saveApplicationData, 30000);

/**
 * ===== UTILITY FUNCTIONS =====
 */

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showSuccess(message) {
    console.log('✅', message);
    // Simple alert for now - could be replaced with toast notifications
    alert(`✅ ${message}`);
}

function showError(message) {
    console.error('❌', message);
    alert(`❌ ${message}`);
}

function showWarning(message) {
    console.warn('⚠️', message);
    alert(`⚠️ ${message}`);
}

// Error handling for uncaught errors
window.addEventListener('error', function(event) {
    console.error('💥 Uncaught error:', event.error);
    showError('An unexpected error occurred. Please check the console for details.');
});

// Log successful initialization
console.log('🎲 RulzLawyer Application Controller Loaded');
/**
 * Epic Level Interface - UI for managing epic character progression
 * Provides interface for level advancement, feat selection, and divine ascension
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class EpicLevelInterface {
    constructor(containerId, epicManager, characterManager) {
        this.container = document.getElementById(containerId);
        this.epicManager = epicManager;
        this.characterManager = characterManager;
        this.currentCharacter = null;
        
        if (!this.container) {
            throw new Error(`Container element with ID "${containerId}" not found`);
        }
        
        this.initialize();
        
        console.log('⚡ Epic Level Interface initialized');
    }
    
    initialize() {
        this.container.className = 'epic-level-interface';
        this.createInterface();
        this.attachEventListeners();
        
        // Listen for character changes
        if (this.characterManager) {
            this.characterManager.addEventListener('characterChanged', (event) => {
                this.loadCharacter(event.detail.character);
            });
        }
    }
    
    createInterface() {
        this.container.innerHTML = `
            <div class="epic-header">
                <h2>⚡ Epic Level Progression</h2>
                <div class="epic-character-info" id="epicCharacterInfo">
                    <p>No character selected</p>
                </div>
            </div>
            
            <div class="epic-content" id="epicContent">
                <div class="epic-tabs">
                    <button class="epic-tab active" data-tab="advancement">Level Advancement</button>
                    <button class="epic-tab" data-tab="feats">Epic Feats</button>
                    <button class="epic-tab" data-tab="divine">Divine Ascension</button>
                    <button class="epic-tab" data-tab="analysis">Character Analysis</button>
                </div>
                
                <div class="epic-tab-content">
                    <div class="epic-panel active" id="advancementPanel">
                        ${this.createAdvancementPanel()}
                    </div>
                    <div class="epic-panel" id="featsPanel">
                        ${this.createFeatsPanel()}
                    </div>
                    <div class="epic-panel" id="divinePanel">
                        ${this.createDivinePanel()}
                    </div>
                    <div class="epic-panel" id="analysisPanel">
                        ${this.createAnalysisPanel()}
                    </div>
                </div>
            </div>
            
            <style>
                .epic-level-interface {
                    background: linear-gradient(135deg, #1a0033, #330066);
                    color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    border: 2px solid #6600cc;
                }
                
                .epic-header {
                    text-align: center;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #6600cc;
                }
                
                .epic-header h2 {
                    margin: 0 0 10px 0;
                    font-size: 28px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                    background: linear-gradient(45deg, #ff6600, #ffcc00);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .epic-character-info {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 10px;
                    border-radius: 5px;
                    backdrop-filter: blur(10px);
                }
                
                .epic-tabs {
                    display: flex;
                    gap: 5px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                
                .epic-tab {
                    background: linear-gradient(135deg, #4d0099, #6600cc);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px 8px 0 0;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    flex: 1;
                    min-width: 120px;
                }
                
                .epic-tab:hover {
                    background: linear-gradient(135deg, #6600cc, #8800ff);
                    transform: translateY(-2px);
                }
                
                .epic-tab.active {
                    background: linear-gradient(135deg, #ff6600, #ffcc00);
                    color: #000;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(255, 102, 0, 0.4);
                }
                
                .epic-panel {
                    display: none;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 0 10px 10px 10px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .epic-panel.active {
                    display: block;
                }
                
                .level-controls {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                
                .level-input {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid #6600cc;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 5px;
                    font-size: 16px;
                    width: 80px;
                }
                
                .level-button {
                    background: linear-gradient(135deg, #ff6600, #ffcc00);
                    color: #000;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }
                
                .level-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(255, 102, 0, 0.4);
                }
                
                .level-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                
                .progression-summary {
                    background: rgba(0, 255, 0, 0.1);
                    border-left: 4px solid #00ff00;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                
                .feat-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 15px;
                    margin-top: 20px;
                }
                
                .feat-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid #6600cc;
                    border-radius: 8px;
                    padding: 15px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .feat-card:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: #ff6600;
                    transform: translateY(-2px);
                }
                
                .feat-card.selected {
                    border-color: #00ff00;
                    background: rgba(0, 255, 0, 0.1);
                }
                
                .feat-card.unavailable {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .feat-card.unavailable:hover {
                    transform: none;
                    border-color: #6600cc;
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .feat-name {
                    font-size: 18px;
                    font-weight: bold;
                    color: #ff6600;
                    margin-bottom: 8px;
                }
                
                .feat-type {
                    font-size: 12px;
                    color: #cccccc;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                }
                
                .feat-prerequisites {
                    font-size: 11px;
                    color: #ffcc00;
                    margin-bottom: 8px;
                }
                
                .feat-benefit {
                    font-size: 13px;
                    font-weight: bold;
                    color: #00ff00;
                    margin-bottom: 8px;
                }
                
                .feat-description {
                    font-size: 12px;
                    color: #cccccc;
                    line-height: 1.4;
                }
                
                .divine-status {
                    background: linear-gradient(135deg, #6600cc, #cc00ff);
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .divine-rank {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                
                .divine-benefits {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                    margin-top: 15px;
                }
                
                .divine-benefit {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 10px;
                    border-radius: 5px;
                    font-size: 12px;
                }
                
                .analysis-section {
                    margin-bottom: 25px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    border-left: 4px solid #ff6600;
                }
                
                .analysis-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #ff6600;
                    margin-bottom: 15px;
                }
                
                .stat-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 10px;
                    margin-bottom: 15px;
                }
                
                .stat-item {
                    text-align: center;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 5px;
                }
                
                .stat-value {
                    font-size: 24px;
                    font-weight: bold;
                    color: #00ff00;
                }
                
                .stat-label {
                    font-size: 12px;
                    color: #cccccc;
                    text-transform: uppercase;
                }
                
                .recommendations {
                    background: rgba(255, 204, 0, 0.1);
                    border-left: 4px solid #ffcc00;
                    padding: 15px;
                    border-radius: 5px;
                }
                
                .recommendations ul {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                
                .recommendations li {
                    margin: 5px 0;
                    color: #ffcc00;
                }
                
                .error-message {
                    background: rgba(255, 0, 0, 0.1);
                    border-left: 4px solid #ff0000;
                    color: #ff6666;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 15px 0;
                }
                
                @media (max-width: 768px) {
                    .epic-tabs {
                        flex-direction: column;
                    }
                    
                    .level-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .feat-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .stat-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            </style>
        `;
    }
    
    createAdvancementPanel() {
        return `
            <div class="advancement-panel">
                <h3>Level Advancement</h3>
                <div class="level-controls">
                    <label>Target Level:</label>
                    <input type="number" id="targetLevel" class="level-input" min="21" max="100" value="21">
                    <button id="advanceLevel" class="level-button">Advance Level</button>
                    <button id="previewAdvancement" class="level-button">Preview Changes</button>
                </div>
                
                <div id="advancementPreview" class="progression-summary" style="display: none;">
                    <!-- Preview content will be populated dynamically -->
                </div>
                
                <div id="advancementResult" class="progression-summary" style="display: none;">
                    <!-- Result content will be populated dynamically -->
                </div>
            </div>
        `;
    }
    
    createFeatsPanel() {
        return `
            <div class="feats-panel">
                <h3>Epic Feats</h3>
                
                <div class="feat-controls">
                    <div class="feat-filters">
                        <label>Filter by Type:</label>
                        <select id="featTypeFilter" class="level-input">
                            <option value="all">All Types</option>
                            <option value="combat">Combat</option>
                            <option value="spellcasting">Spellcasting</option>
                            <option value="skill">Skill</option>
                            <option value="divine">Divine</option>
                            <option value="general">General</option>
                        </select>
                        <button id="refreshFeats" class="level-button">Refresh Available</button>
                    </div>
                </div>
                
                <div id="availableFeats" class="feat-grid">
                    <!-- Feats will be populated dynamically -->
                </div>
                
                <div id="learnedFeats" style="margin-top: 30px;">
                    <h4>Learned Epic Feats</h4>
                    <div id="learnedFeatsList">
                        <!-- Learned feats will be populated dynamically -->
                    </div>
                </div>
            </div>
        `;
    }
    
    createDivinePanel() {
        return `
            <div class="divine-panel">
                <h3>Divine Ascension</h3>
                
                <div id="divineStatus" class="divine-status">
                    <!-- Divine status will be populated dynamically -->
                </div>
                
                <div id="divineProgression" class="divine-progression">
                    <!-- Divine progression options will be populated dynamically -->
                </div>
                
                <div id="divineBenefits" class="divine-benefits">
                    <!-- Divine benefits will be populated dynamically -->
                </div>
            </div>
        `;
    }
    
    createAnalysisPanel() {
        return `
            <div class="analysis-panel">
                <h3>Epic Character Analysis</h3>
                
                <div id="characterStats" class="analysis-section">
                    <div class="analysis-title">Epic Statistics</div>
                    <div id="epicStats" class="stat-grid">
                        <!-- Stats will be populated dynamically -->
                    </div>
                </div>
                
                <div id="characterBonuses" class="analysis-section">
                    <div class="analysis-title">Epic Bonuses</div>
                    <div id="epicBonuses" class="stat-grid">
                        <!-- Bonuses will be populated dynamically -->
                    </div>
                </div>
                
                <div id="characterRecommendations" class="recommendations">
                    <h4>Recommendations</h4>
                    <div id="recommendationsList">
                        <!-- Recommendations will be populated dynamically -->
                    </div>
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        // Tab switching
        this.container.querySelectorAll('.epic-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
        
        // Level advancement
        const advanceButton = this.container.querySelector('#advanceLevel');
        const previewButton = this.container.querySelector('#previewAdvancement');
        const targetLevelInput = this.container.querySelector('#targetLevel');
        
        if (advanceButton) {
            advanceButton.addEventListener('click', () => {
                this.advanceCharacterLevel();
            });
        }
        
        if (previewButton) {
            previewButton.addEventListener('click', () => {
                this.previewLevelAdvancement();
            });
        }
        
        if (targetLevelInput) {
            targetLevelInput.addEventListener('change', () => {
                this.updateAdvancementControls();
            });
        }
        
        // Feat management
        const featTypeFilter = this.container.querySelector('#featTypeFilter');
        const refreshFeatsButton = this.container.querySelector('#refreshFeats');
        
        if (featTypeFilter) {
            featTypeFilter.addEventListener('change', () => {
                this.updateAvailableFeats();
            });
        }
        
        if (refreshFeatsButton) {
            refreshFeatsButton.addEventListener('click', () => {
                this.updateAvailableFeats();
            });
        }
    }
    
    loadCharacter(character) {
        this.currentCharacter = character;
        this.updateCharacterInfo();
        this.updateAllPanels();
        
        console.log(`⚡ Loaded character: ${character.name}`);
    }
    
    updateCharacterInfo() {
        const infoElement = this.container.querySelector('#epicCharacterInfo');
        if (!infoElement || !this.currentCharacter) return;
        
        const character = this.currentCharacter;
        const isEpic = character.level > 20;
        
        if (isEpic) {
            const epicLevel = character.level - 20;
            infoElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                    <div>
                        <strong>${character.name}</strong><br>
                        Level ${character.level} (Epic ${epicLevel})
                    </div>
                    <div>
                        ${character.classes.map(c => `${c.name} ${c.level}`).join(', ')}
                    </div>
                    <div>
                        Epic Attack: +${character.epicBonuses?.attack || 0}<br>
                        Epic Saves: +${character.epicBonuses?.save || 0}
                    </div>
                </div>
            `;
        } else {
            infoElement.innerHTML = `
                <div style="text-align: center;">
                    <strong>${character.name}</strong><br>
                    Level ${character.level} - <span style="color: #ffcc00;">Ready for Epic Advancement</span>
                </div>
            `;
        }
    }
    
    updateAllPanels() {
        this.updateAdvancementPanel();
        this.updateFeatsPanel();
        this.updateDivinePanel();
        this.updateAnalysisPanel();
    }
    
    updateAdvancementPanel() {
        if (!this.currentCharacter) return;
        
        const targetLevelInput = this.container.querySelector('#targetLevel');
        const advanceButton = this.container.querySelector('#advanceLevel');
        const previewButton = this.container.querySelector('#previewAdvancement');
        
        if (targetLevelInput) {
            targetLevelInput.value = Math.max(21, this.currentCharacter.level + 1);
            targetLevelInput.min = Math.max(21, this.currentCharacter.level + 1);
        }
        
        this.updateAdvancementControls();
    }
    
    updateAdvancementControls() {
        if (!this.currentCharacter) return;
        
        const targetLevelInput = this.container.querySelector('#targetLevel');
        const advanceButton = this.container.querySelector('#advanceLevel');
        const previewButton = this.container.querySelector('#previewAdvancement');
        
        const targetLevel = parseInt(targetLevelInput.value);
        const currentLevel = this.currentCharacter.level;
        
        const isValidLevel = targetLevel > currentLevel && targetLevel <= 100;
        
        if (advanceButton) advanceButton.disabled = !isValidLevel;
        if (previewButton) previewButton.disabled = !isValidLevel;
    }
    
    previewLevelAdvancement() {
        if (!this.currentCharacter) return;
        
        const targetLevelInput = this.container.querySelector('#targetLevel');
        const targetLevel = parseInt(targetLevelInput.value);
        const previewElement = this.container.querySelector('#advancementPreview');
        
        try {
            // Create a copy for preview
            const previewCharacter = JSON.parse(JSON.stringify(this.currentCharacter));
            const currentLevel = previewCharacter.level;
            
            // Calculate what would change
            const levelGain = targetLevel - currentLevel;
            const epicLevel = targetLevel - 20;
            
            const hitPointsGained = this.calculateHitPointsGained(previewCharacter, currentLevel, targetLevel);
            const skillPointsGained = this.calculateSkillPointsGained(previewCharacter, currentLevel, targetLevel);
            const featsGained = this.calculateFeatsGained(previewCharacter, currentLevel, targetLevel);
            
            const epicAttackBonus = Math.floor((epicLevel + 1) / 2);
            const epicSaveBonus = Math.floor(epicLevel / 2);
            
            previewElement.innerHTML = `
                <h4>Preview: Advancing to Level ${targetLevel}</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div>
                        <strong>Level Gain:</strong><br>
                        +${levelGain} levels (Epic ${epicLevel})
                    </div>
                    <div>
                        <strong>Hit Points:</strong><br>
                        +${hitPointsGained} HP
                    </div>
                    <div>
                        <strong>Skill Points:</strong><br>
                        +${skillPointsGained} points
                    </div>
                    <div>
                        <strong>Epic Attack Bonus:</strong><br>
                        +${epicAttackBonus}
                    </div>
                    <div>
                        <strong>Epic Save Bonus:</strong><br>
                        +${epicSaveBonus}
                    </div>
                    <div>
                        <strong>Feats Gained:</strong><br>
                        ${featsGained.regular} regular, ${featsGained.epic} epic
                    </div>
                </div>
            `;
            
            previewElement.style.display = 'block';
            
        } catch (error) {
            this.showError('Error previewing advancement: ' + error.message);
        }
    }
    
    advanceCharacterLevel() {
        if (!this.currentCharacter) return;
        
        const targetLevelInput = this.container.querySelector('#targetLevel');
        const targetLevel = parseInt(targetLevelInput.value);
        const resultElement = this.container.querySelector('#advancementResult');
        
        try {
            const oldLevel = this.currentCharacter.level;
            this.epicManager.advanceToEpicLevel(this.currentCharacter, targetLevel);
            
            resultElement.innerHTML = `
                <h4>✅ Successfully Advanced!</h4>
                <p><strong>${this.currentCharacter.name}</strong> advanced from level ${oldLevel} to level ${targetLevel}</p>
                <p>Check the Analysis tab for updated character statistics.</p>
            `;
            resultElement.style.display = 'block';
            
            // Update character manager if available
            if (this.characterManager) {
                this.characterManager.updateCharacter(this.currentCharacter);
            }
            
            // Refresh all panels
            this.updateAllPanels();
            
            console.log(`⚡ ${this.currentCharacter.name} advanced to level ${targetLevel}`);
            
        } catch (error) {
            this.showError('Error advancing level: ' + error.message);
        }
    }
    
    updateFeatsPanel() {
        if (!this.currentCharacter) return;
        
        this.updateAvailableFeats();
        this.updateLearnedFeats();
    }
    
    updateAvailableFeats() {
        if (!this.currentCharacter) return;
        
        const featsContainer = this.container.querySelector('#availableFeats');
        const typeFilter = this.container.querySelector('#featTypeFilter');
        
        if (!featsContainer) return;
        
        try {
            const availableFeats = this.epicManager.getAvailableEpicFeats(this.currentCharacter);
            const filterType = typeFilter ? typeFilter.value : 'all';
            
            const filteredFeats = filterType === 'all' ? 
                availableFeats : 
                availableFeats.filter(feat => feat.type === filterType);
            
            if (filteredFeats.length === 0) {
                featsContainer.innerHTML = `
                    <div style="text-align: center; color: #cccccc; grid-column: 1/-1;">
                        No ${filterType === 'all' ? '' : filterType + ' '}epic feats available for this character.
                    </div>
                `;
                return;
            }
            
            featsContainer.innerHTML = filteredFeats.map(feat => `
                <div class="feat-card" data-feat="${feat.name}">
                    <div class="feat-name">${feat.name}</div>
                    <div class="feat-type">${feat.type}</div>
                    <div class="feat-prerequisites">Prerequisites: ${feat.prerequisites.join(', ')}</div>
                    <div class="feat-benefit">${feat.benefit}</div>
                    <div class="feat-description">${feat.description}</div>
                </div>
            `).join('');
            
            // Add click handlers for feat selection
            featsContainer.querySelectorAll('.feat-card').forEach(card => {
                card.addEventListener('click', () => {
                    this.selectFeat(card.getAttribute('data-feat'));
                });
            });
            
        } catch (error) {
            featsContainer.innerHTML = `<div class="error-message">Error loading feats: ${error.message}</div>`;
        }
    }
    
    updateLearnedFeats() {
        if (!this.currentCharacter) return;
        
        const learnedContainer = this.container.querySelector('#learnedFeatsList');
        if (!learnedContainer) return;
        
        const epicFeats = this.currentCharacter.epicFeats || [];
        
        if (epicFeats.length === 0) {
            learnedContainer.innerHTML = '<p style="color: #cccccc;">No epic feats learned yet.</p>';
            return;
        }
        
        learnedContainer.innerHTML = `
            <div class="feat-grid">
                ${epicFeats.map(feat => `
                    <div class="feat-card learned">
                        <div class="feat-name">${feat.name}</div>
                        <div class="feat-type">${feat.type}</div>
                        <div class="feat-benefit">${feat.benefit}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    selectFeat(featName) {
        if (!this.currentCharacter) return;
        
        if (!confirm(`Learn epic feat "${featName}"?`)) return;
        
        try {
            this.epicManager.learnEpicFeat(this.currentCharacter, featName);
            
            // Update character manager if available
            if (this.characterManager) {
                this.characterManager.updateCharacter(this.currentCharacter);
            }
            
            // Refresh feats panel
            this.updateFeatsPanel();
            
            console.log(`⚡ ${this.currentCharacter.name} learned feat: ${featName}`);
            
        } catch (error) {
            this.showError('Error learning feat: ' + error.message);
        }
    }
    
    updateDivinePanel() {
        if (!this.currentCharacter) return;
        
        const statusElement = this.container.querySelector('#divineStatus');
        const progressionElement = this.container.querySelector('#divineProgression');
        const benefitsElement = this.container.querySelector('#divineBenefits');
        
        if (!statusElement) return;
        
        const analysis = this.epicManager.analyzeEpicCharacter(this.currentCharacter);
        const divineStatus = analysis.divineStatus;
        
        if (divineStatus.isDivine) {
            statusElement.innerHTML = `
                <div class="divine-rank">Divine Rank ${divineStatus.rank}</div>
                <div style="font-size: 18px; margin-bottom: 10px;">${divineStatus.title}</div>
                <div style="font-style: italic;">${divineStatus.status}</div>
            `;
            
            if (benefitsElement && divineStatus.benefits.length > 0) {
                benefitsElement.innerHTML = divineStatus.benefits.map(benefit => `
                    <div class="divine-benefit">${benefit}</div>
                `).join('');
            }
        } else {
            const qualifies = this.epicManager.qualifiesForDivineAscension(this.currentCharacter);
            
            statusElement.innerHTML = `
                <div class="divine-rank">Mortal Being</div>
                <div style="font-size: 18px; margin-bottom: 10px;">
                    ${qualifies ? 'Qualifies for Divine Ascension' : 'Does Not Qualify for Divinity'}
                </div>
                <div style="font-style: italic;">
                    ${qualifies ? 
                        'This character meets the requirements for divine ascension.' : 
                        'Character must reach epic levels and achieve great deeds.'}
                </div>
            `;
            
            if (qualifies && progressionElement) {
                progressionElement.innerHTML = `
                    <button class="level-button" onclick="this.parentElement.parentElement.parentElement.parentElement.epicInterface.beginDivineAscension()">
                        Begin Divine Ascension
                    </button>
                `;
            }
        }
    }
    
    updateAnalysisPanel() {
        if (!this.currentCharacter) return;
        
        const statsElement = this.container.querySelector('#epicStats');
        const bonusesElement = this.container.querySelector('#epicBonuses');
        const recommendationsElement = this.container.querySelector('#recommendationsList');
        
        if (!statsElement) return;
        
        try {
            const analysis = this.epicManager.analyzeEpicCharacter(this.currentCharacter);
            
            statsElement.innerHTML = `
                <div class="stat-item">
                    <div class="stat-value">${this.currentCharacter.level}</div>
                    <div class="stat-label">Character Level</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${analysis.epicLevel}</div>
                    <div class="stat-label">Epic Level</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${analysis.availableFeats.total}</div>
                    <div class="stat-label">Available Feats</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.currentCharacter.epicFeats?.length || 0}</div>
                    <div class="stat-label">Epic Feats</div>
                </div>
            `;
            
            if (bonusesElement) {
                bonusesElement.innerHTML = `
                    <div class="stat-item">
                        <div class="stat-value">+${analysis.epicBonuses.attack || 0}</div>
                        <div class="stat-label">Epic Attack</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">+${analysis.epicBonuses.save || 0}</div>
                        <div class="stat-label">Epic Saves</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${this.currentCharacter.hitPoints?.maximum || 0}</div>
                        <div class="stat-label">Hit Points</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${analysis.divineStatus.rank || 'None'}</div>
                        <div class="stat-label">Divine Rank</div>
                    </div>
                `;
            }
            
            if (recommendationsElement && analysis.recommendations.length > 0) {
                recommendationsElement.innerHTML = `
                    <ul>
                        ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                `;
            } else if (recommendationsElement) {
                recommendationsElement.innerHTML = '<p>No recommendations at this time.</p>';
            }
            
        } catch (error) {
            if (statsElement) {
                statsElement.innerHTML = `<div class="error-message">Error analyzing character: ${error.message}</div>`;
            }
        }
    }
    
    switchTab(tabName) {
        // Update tab buttons
        this.container.querySelectorAll('.epic-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        this.container.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update panels
        this.container.querySelectorAll('.epic-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetPanel = this.container.querySelector(`#${tabName}Panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
        
        console.log(`⚡ Switched to ${tabName} tab`);
    }
    
    // Utility methods
    calculateHitPointsGained(character, fromLevel, toLevel) {
        let totalGained = 0;
        const primaryClass = character.classes[0];
        const hitDie = this.epicManager.getClassHitDie(primaryClass.name);
        const conModifier = this.epicManager.getAbilityModifier(character.abilities?.constitution || 10);
        
        for (let level = fromLevel + 1; level <= toLevel; level++) {
            // Use average for preview
            totalGained += Math.floor(hitDie / 2) + 1 + conModifier;
        }
        
        return totalGained;
    }
    
    calculateSkillPointsGained(character, fromLevel, toLevel) {
        let totalGained = 0;
        const primaryClass = character.classes[0];
        const baseSkillPoints = this.epicManager.getClassSkillPoints(primaryClass.name);
        const intModifier = this.epicManager.getAbilityModifier(character.abilities?.intelligence || 10);
        
        const skillPointsPerLevel = baseSkillPoints + intModifier;
        totalGained = (toLevel - fromLevel) * skillPointsPerLevel;
        
        return totalGained;
    }
    
    calculateFeatsGained(character, fromLevel, toLevel) {
        let regularFeats = 0;
        let epicFeats = 0;
        
        for (let level = fromLevel + 1; level <= toLevel; level++) {
            if (level % 3 === 0) regularFeats++;
            
            // Calculate epic feats based on class progression
            character.classes.forEach(charClass => {
                const epicProgression = this.epicManager.getClassEpicProgression(charClass.name);
                if (level > 20 && epicProgression.feetEvery > 0) {
                    const epicClassLevel = level - 20;
                    if (epicClassLevel % epicProgression.feetEvery === 0) {
                        epicFeats++;
                    }
                }
            });
        }
        
        return { regular: regularFeats, epic: epicFeats };
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Insert at top of content area
        const content = this.container.querySelector('.epic-content');
        if (content) {
            content.insertBefore(errorDiv, content.firstChild);
            
            // Remove after 5 seconds
            setTimeout(() => {
                if (errorDiv.parentElement) {
                    errorDiv.parentElement.removeChild(errorDiv);
                }
            }, 5000);
        }
        
        console.error('⚡ Epic Level Interface Error:', message);
    }
    
    // Store reference to this instance for button callbacks
    constructor(containerId, epicManager, characterManager) {
        this.container = document.getElementById(containerId);
        this.epicManager = epicManager;
        this.characterManager = characterManager;
        this.currentCharacter = null;
        
        if (!this.container) {
            throw new Error(`Container element with ID "${containerId}" not found`);
        }
        
        // Store reference for callbacks
        this.container.epicInterface = this;
        
        this.initialize();
        
        console.log('⚡ Epic Level Interface initialized');
    }
    
    beginDivineAscension() {
        if (!this.currentCharacter) return;
        
        if (!confirm('Begin divine ascension? This will grant quasi-deity status.')) return;
        
        try {
            this.currentCharacter.divineRank = 0;
            this.currentCharacter.divineAscension = {
                type: 'quasi-deity',
                portfolio: [],
                domains: [],
                followers: 0
            };
            
            // Update character manager if available
            if (this.characterManager) {
                this.characterManager.updateCharacter(this.currentCharacter);
            }
            
            // Refresh divine panel
            this.updateDivinePanel();
            this.updateAnalysisPanel();
            
            console.log(`⚡ ${this.currentCharacter.name} began divine ascension`);
            
        } catch (error) {
            this.showError('Error beginning divine ascension: ' + error.message);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EpicLevelInterface;
} else if (typeof window !== 'undefined') {
    window.EpicLevelInterface = EpicLevelInterface;
}
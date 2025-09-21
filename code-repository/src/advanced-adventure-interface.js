/**
 * Advanced Adventure Engine Interface
 * Comprehensive UI for campaign management, encounter design, and session tools
 * 
 * Features:
 * - Campaign creation and management dashboard
 * - Real-time combat tracker with initiative order
 * - Session planning and note-taking tools
 * - NPC generator and relationship tracker
 * - Treasure generator with magic items
 * - Environmental effects manager
 * - Adventure hooks and plot generator
 * - Experience tracking and leveling
 * - Multi-party campaign support
 * - Adventure sharing and templates
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class AdvancedAdventureInterface {
    constructor(adventureEngine, characterManager, diceEngine, options = {}) {
        this.adventureEngine = adventureEngine;
        this.characterManager = characterManager;
        this.diceEngine = diceEngine;
        
        this.options = {
            autoSave: options.autoSave !== false,
            realTimeUpdates: options.realTimeUpdates !== false,
            soundEffects: options.soundEffects || false,
            animations: options.animations !== false,
            keyboardShortcuts: options.keyboardShortcuts !== false,
            ...options
        };
        
        // Interface state
        this.activeTab = 'campaigns';
        this.selectedCampaign = null;
        this.selectedEncounter = null;
        this.combatActive = false;
        this.sessionActive = false;
        
        // UI elements
        this.containerElement = null;
        this.tabElements = new Map();
        this.modalElements = new Map();
        this.formElements = new Map();
        
        // Combat tracker state
        this.initiativeOrder = [];
        this.currentTurn = 0;
        this.currentRound = 1;
        this.combatants = new Map();
        
        // Session state
        this.sessionNotes = '';
        this.sessionTimer = null;
        this.sessionStartTime = null;
        
        // Event handlers
        this.eventHandlers = new Map();
        
        this.initialize();
        
        console.log('⚔️ Advanced Adventure Interface initialized');
    }
    
    initialize() {
        this.createInterface();
        this.setupEventHandlers();
        this.setupKeyboardShortcuts();
        this.loadStoredState();
        
        if (this.options.autoSave) {
            this.setupAutoSave();
        }
        
        console.log('⚔️ Adventure Interface ready');
    }
    
    createInterface() {
        // Main container
        this.containerElement = document.createElement('div');
        this.containerElement.className = 'advanced-adventure-interface';
        this.containerElement.innerHTML = this.generateMainHTML();
        
        // Append to document
        document.body.appendChild(this.containerElement);
        
        // Initialize tab system
        this.initializeTabs();
        this.createCampaignTab();
        this.createEncounterTab();
        this.createCombatTab();
        this.createNPCTab();
        this.createSessionTab();
        this.createToolsTab();
        
        console.log('⚔️ Interface created');
    }
    
    generateMainHTML() {
        return `
            <div class="adventure-interface-header">
                <div class="interface-title">
                    <h1>⚔️ Adventure Master</h1>
                    <div class="interface-status">
                        <span id="campaign-status">No Campaign Active</span>
                        <span id="session-status">No Session Active</span>
                    </div>
                </div>
                <div class="interface-actions">
                    <button id="save-all-btn" class="btn btn-primary">💾 Save All</button>
                    <button id="settings-btn" class="btn btn-secondary">⚙️ Settings</button>
                    <button id="help-btn" class="btn btn-info">❓ Help</button>
                </div>
            </div>
            
            <div class="adventure-interface-tabs">
                <nav class="tab-navigation">
                    <button class="tab-btn active" data-tab="campaigns">🏰 Campaigns</button>
                    <button class="tab-btn" data-tab="encounters">⚔️ Encounters</button>
                    <button class="tab-btn" data-tab="combat">🎯 Combat Tracker</button>
                    <button class="tab-btn" data-tab="npcs">👥 NPCs</button>
                    <button class="tab-btn" data-tab="session">📋 Session</button>
                    <button class="tab-btn" data-tab="tools">🛠️ Tools</button>
                </nav>
                
                <div class="tab-content">
                    <div id="campaigns-tab" class="tab-panel active"></div>
                    <div id="encounters-tab" class="tab-panel"></div>
                    <div id="combat-tab" class="tab-panel"></div>
                    <div id="npcs-tab" class="tab-panel"></div>
                    <div id="session-tab" class="tab-panel"></div>
                    <div id="tools-tab" class="tab-panel"></div>
                </div>
            </div>
            
            <div class="adventure-interface-modals"></div>
            <div class="adventure-interface-notifications"></div>
        `;
    }
    
    initializeTabs() {
        const tabButtons = this.containerElement.querySelectorAll('.tab-btn');
        const tabPanels = this.containerElement.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab);
            });
        });
        
        console.log('⚔️ Tabs initialized');
    }
    
    switchTab(tabName) {
        // Update active tab
        this.activeTab = tabName;
        
        // Update button states
        this.containerElement.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update panel states
        this.containerElement.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}-tab`);
        });
        
        // Refresh tab content
        this.refreshTabContent(tabName);
        
        console.log(`⚔️ Switched to tab: ${tabName}`);
    }
    
    createCampaignTab() {
        const campaignTab = this.containerElement.querySelector('#campaigns-tab');
        campaignTab.innerHTML = `
            <div class="campaign-manager">
                <div class="campaign-header">
                    <h2>Campaign Management</h2>
                    <div class="campaign-actions">
                        <button id="new-campaign-btn" class="btn btn-primary">➕ New Campaign</button>
                        <button id="import-campaign-btn" class="btn btn-secondary">📥 Import</button>
                        <button id="campaign-templates-btn" class="btn btn-secondary">📋 Templates</button>
                    </div>
                </div>
                
                <div class="campaign-list">
                    <div id="campaigns-grid" class="campaigns-grid"></div>
                    <div id="no-campaigns" class="no-content">
                        <h3>No Campaigns Created</h3>
                        <p>Create your first campaign to start managing adventures</p>
                        <button class="btn btn-primary" onclick="this.closest('.advanced-adventure-interface').querySelector('#new-campaign-btn').click()">Create Campaign</button>
                    </div>
                </div>
                
                <div class="campaign-details" id="campaign-details" style="display: none;">
                    <div class="campaign-info">
                        <h3 id="campaign-name">Campaign Name</h3>
                        <div class="campaign-meta">
                            <span id="campaign-players">0 Players</span>
                            <span id="campaign-sessions">0 Sessions</span>
                            <span id="campaign-level">Level 1</span>
                        </div>
                    </div>
                    
                    <div class="campaign-tabs">
                        <button class="campaign-tab-btn active" data-tab="overview">Overview</button>
                        <button class="campaign-tab-btn" data-tab="characters">Characters</button>
                        <button class="campaign-tab-btn" data-tab="sessions">Sessions</button>
                        <button class="campaign-tab-btn" data-tab="notes">Notes</button>
                    </div>
                    
                    <div class="campaign-content">
                        <div id="campaign-overview" class="campaign-panel active"></div>
                        <div id="campaign-characters" class="campaign-panel"></div>
                        <div id="campaign-sessions" class="campaign-panel"></div>
                        <div id="campaign-notes" class="campaign-panel"></div>
                    </div>
                    
                    <div class="campaign-actions-footer">
                        <button id="start-session-btn" class="btn btn-success">🎮 Start Session</button>
                        <button id="edit-campaign-btn" class="btn btn-primary">✏️ Edit</button>
                        <button id="export-campaign-btn" class="btn btn-secondary">📤 Export</button>
                        <button id="archive-campaign-btn" class="btn btn-warning">📦 Archive</button>
                    </div>
                </div>
            </div>
        `;
        
        this.setupCampaignEvents();
    }
    
    createEncounterTab() {
        const encounterTab = this.containerElement.querySelector('#encounters-tab');
        encounterTab.innerHTML = `
            <div class="encounter-manager">
                <div class="encounter-header">
                    <h2>Encounter Design</h2>
                    <div class="encounter-actions">
                        <button id="new-encounter-btn" class="btn btn-primary">⚔️ Create Encounter</button>
                        <button id="random-encounter-btn" class="btn btn-secondary">🎲 Random Encounter</button>
                        <button id="encounter-library-btn" class="btn btn-secondary">📚 Library</button>
                    </div>
                </div>
                
                <div class="encounter-builder">
                    <div class="encounter-setup">
                        <div class="setup-section">
                            <h3>Basic Information</h3>
                            <div class="form-group">
                                <label for="encounter-name">Encounter Name</label>
                                <input type="text" id="encounter-name" class="form-control" placeholder="Enter encounter name">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="encounter-type">Type</label>
                                    <select id="encounter-type" class="form-control">
                                        <option value="combat">Combat</option>
                                        <option value="social">Social</option>
                                        <option value="exploration">Exploration</option>
                                        <option value="puzzle">Puzzle</option>
                                        <option value="trap">Trap/Hazard</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="encounter-difficulty">Difficulty</label>
                                    <select id="encounter-difficulty" class="form-control">
                                        <option value="easy">Easy</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="hard">Hard</option>
                                        <option value="deadly">Deadly</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="encounter-environment">Environment</label>
                                    <select id="encounter-environment" class="form-control">
                                        <option value="dungeon">Dungeon</option>
                                        <option value="wilderness">Wilderness</option>
                                        <option value="urban">Urban</option>
                                        <option value="underwater">Underwater</option>
                                        <option value="aerial">Aerial</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="setup-section">
                            <h3>Creatures & Opponents</h3>
                            <div id="creatures-list" class="creatures-list"></div>
                            <button id="add-creature-btn" class="btn btn-secondary">➕ Add Creature</button>
                            <button id="balance-encounter-btn" class="btn btn-info">⚖️ Balance Encounter</button>
                        </div>
                        
                        <div class="setup-section">
                            <h3>Environmental Effects</h3>
                            <div id="environmental-effects" class="effects-list">
                                <div class="effect-item">
                                    <input type="checkbox" id="dim-light"> <label for="dim-light">Dim Light</label>
                                </div>
                                <div class="effect-item">
                                    <input type="checkbox" id="difficult-terrain"> <label for="difficult-terrain">Difficult Terrain</label>
                                </div>
                                <div class="effect-item">
                                    <input type="checkbox" id="extreme-weather"> <label for="extreme-weather">Extreme Weather</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="encounter-preview">
                        <h3>Encounter Preview</h3>
                        <div id="encounter-preview-content" class="preview-content">
                            <p>Configure your encounter settings to see a preview</p>
                        </div>
                        <div class="encounter-stats">
                            <div class="stat-item">
                                <label>CR Rating:</label>
                                <span id="encounter-cr">-</span>
                            </div>
                            <div class="stat-item">
                                <label>XP Award:</label>
                                <span id="encounter-xp">-</span>
                            </div>
                            <div class="stat-item">
                                <label>Est. Duration:</label>
                                <span id="encounter-duration">-</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="encounter-actions-footer">
                    <button id="save-encounter-btn" class="btn btn-primary">💾 Save Encounter</button>
                    <button id="run-encounter-btn" class="btn btn-success">▶️ Run Encounter</button>
                    <button id="clear-encounter-btn" class="btn btn-warning">🗑️ Clear</button>
                </div>
            </div>
        `;
        
        this.setupEncounterEvents();
    }
    
    createCombatTab() {
        const combatTab = this.containerElement.querySelector('#combat-tab');
        combatTab.innerHTML = `
            <div class="combat-tracker">
                <div class="combat-header">
                    <h2>Combat Tracker</h2>
                    <div class="combat-status">
                        <div class="round-counter">
                            <label>Round:</label>
                            <span id="combat-round">-</span>
                        </div>
                        <div class="turn-indicator">
                            <label>Current Turn:</label>
                            <span id="current-turn">-</span>
                        </div>
                        <div class="combat-timer">
                            <label>Duration:</label>
                            <span id="combat-duration">00:00</span>
                        </div>
                    </div>
                    <div class="combat-actions">
                        <button id="start-combat-btn" class="btn btn-success">⚔️ Start Combat</button>
                        <button id="end-combat-btn" class="btn btn-danger" disabled>🏁 End Combat</button>
                        <button id="reset-combat-btn" class="btn btn-warning">🔄 Reset</button>
                    </div>
                </div>
                
                <div class="combat-main">
                    <div class="initiative-tracker">
                        <h3>Initiative Order</h3>
                        <div class="initiative-controls">
                            <button id="roll-initiative-btn" class="btn btn-secondary">🎲 Roll Initiative</button>
                            <button id="add-combatant-btn" class="btn btn-secondary">➕ Add Combatant</button>
                            <button id="next-turn-btn" class="btn btn-primary" disabled>➡️ Next Turn</button>
                        </div>
                        <div id="initiative-list" class="initiative-list">
                            <div class="no-combatants">
                                <p>No combatants added</p>
                                <button class="btn btn-primary" onclick="document.getElementById('add-combatant-btn').click()">Add Combatant</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="combat-details">
                        <div class="active-combatant" id="active-combatant-details">
                            <h3>Active Combatant</h3>
                            <div class="combatant-info">
                                <p>No active combatant</p>
                            </div>
                        </div>
                        
                        <div class="combat-actions-panel">
                            <h4>Quick Actions</h4>
                            <div class="quick-actions">
                                <button class="action-btn" data-action="attack">⚔️ Attack</button>
                                <button class="action-btn" data-action="damage">💔 Deal Damage</button>
                                <button class="action-btn" data-action="heal">❤️ Heal</button>
                                <button class="action-btn" data-action="effect">✨ Add Effect</button>
                                <button class="action-btn" data-action="condition">🔄 Condition</button>
                                <button class="action-btn" data-action="note">📝 Add Note</button>
                            </div>
                        </div>
                        
                        <div class="combat-log">
                            <h4>Combat Log</h4>
                            <div id="combat-log-content" class="log-content">
                                <p class="log-empty">Combat log will appear here</p>
                            </div>
                            <div class="log-controls">
                                <button id="clear-log-btn" class="btn btn-sm btn-warning">Clear Log</button>
                                <button id="export-log-btn" class="btn btn-sm btn-secondary">Export Log</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupCombatEvents();
    }
    
    createNPCTab() {
        const npcTab = this.containerElement.querySelector('#npcs-tab');
        npcTab.innerHTML = `
            <div class="npc-manager">
                <div class="npc-header">
                    <h2>NPC Management</h2>
                    <div class="npc-actions">
                        <button id="generate-npc-btn" class="btn btn-primary">🎭 Generate NPC</button>
                        <button id="import-npc-btn" class="btn btn-secondary">📥 Import</button>
                        <button id="npc-templates-btn" class="btn btn-secondary">📋 Templates</button>
                    </div>
                </div>
                
                <div class="npc-content">
                    <div class="npc-generator">
                        <h3>NPC Generator</h3>
                        <div class="generator-options">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="npc-race">Race</label>
                                    <select id="npc-race" class="form-control">
                                        <option value="">Random</option>
                                        <option value="human">Human</option>
                                        <option value="elf">Elf</option>
                                        <option value="dwarf">Dwarf</option>
                                        <option value="halfling">Halfling</option>
                                        <option value="half-elf">Half-Elf</option>
                                        <option value="half-orc">Half-Orc</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="npc-class">Class</label>
                                    <select id="npc-class" class="form-control">
                                        <option value="">Random</option>
                                        <option value="commoner">Commoner</option>
                                        <option value="expert">Expert</option>
                                        <option value="warrior">Warrior</option>
                                        <option value="adept">Adept</option>
                                        <option value="aristocrat">Aristocrat</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="npc-level">Level</label>
                                    <select id="npc-level" class="form-control">
                                        <option value="">Random</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="npc-role">Role</label>
                                    <select id="npc-role" class="form-control">
                                        <option value="">Random</option>
                                        <option value="merchant">Merchant</option>
                                        <option value="guard">Guard</option>
                                        <option value="noble">Noble</option>
                                        <option value="innkeeper">Innkeeper</option>
                                        <option value="priest">Priest</option>
                                    </select>
                                </div>
                            </div>
                            <button id="quick-generate-npc-btn" class="btn btn-success">⚡ Quick Generate</button>
                        </div>
                        
                        <div id="generated-npc" class="generated-npc" style="display: none;">
                            <h4>Generated NPC</h4>
                            <div id="npc-display" class="npc-display"></div>
                            <div class="npc-actions-footer">
                                <button id="save-npc-btn" class="btn btn-primary">💾 Save NPC</button>
                                <button id="regenerate-npc-btn" class="btn btn-secondary">🔄 Regenerate</button>
                                <button id="add-to-encounter-btn" class="btn btn-success">⚔️ Add to Encounter</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="npc-library">
                        <h3>NPC Library</h3>
                        <div class="npc-search">
                            <input type="text" id="npc-search" class="form-control" placeholder="Search NPCs...">
                            <div class="search-filters">
                                <select id="filter-campaign" class="form-control">
                                    <option value="">All Campaigns</option>
                                </select>
                                <select id="filter-type" class="form-control">
                                    <option value="">All Types</option>
                                    <option value="ally">Ally</option>
                                    <option value="enemy">Enemy</option>
                                    <option value="neutral">Neutral</option>
                                </select>
                            </div>
                        </div>
                        <div id="npc-list" class="npc-list">
                            <div class="no-npcs">
                                <p>No NPCs created yet</p>
                                <button class="btn btn-primary" onclick="document.getElementById('quick-generate-npc-btn').click()">Generate First NPC</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupNPCEvents();
    }
    
    createSessionTab() {
        const sessionTab = this.containerElement.querySelector('#session-tab');
        sessionTab.innerHTML = `
            <div class="session-manager">
                <div class="session-header">
                    <h2>Session Management</h2>
                    <div class="session-status">
                        <div class="session-info">
                            <span id="session-name">No Active Session</span>
                            <span id="session-duration" class="session-timer">00:00:00</span>
                        </div>
                        <div class="session-actions">
                            <button id="start-new-session-btn" class="btn btn-success">🎮 Start Session</button>
                            <button id="pause-session-btn" class="btn btn-warning" disabled>⏸️ Pause</button>
                            <button id="end-session-btn" class="btn btn-danger" disabled>🏁 End Session</button>
                        </div>
                    </div>
                </div>
                
                <div class="session-content">
                    <div class="session-planning">
                        <h3>Session Planning</h3>
                        <div class="planning-sections">
                            <div class="planning-section">
                                <h4>Objectives</h4>
                                <textarea id="session-objectives" class="form-control" rows="3" placeholder="What do you want to accomplish this session?"></textarea>
                            </div>
                            <div class="planning-section">
                                <h4>Key NPCs</h4>
                                <div id="session-npcs" class="session-npcs">
                                    <button id="add-session-npc-btn" class="btn btn-secondary btn-sm">➕ Add NPC</button>
                                </div>
                            </div>
                            <div class="planning-section">
                                <h4>Encounters</h4>
                                <div id="session-encounters" class="session-encounters">
                                    <button id="add-session-encounter-btn" class="btn btn-secondary btn-sm">➕ Add Encounter</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="session-tracking">
                        <div class="session-notes">
                            <h3>Session Notes</h3>
                            <div class="notes-toolbar">
                                <button class="toolbar-btn" title="Bold"><b>B</b></button>
                                <button class="toolbar-btn" title="Italic"><i>I</i></button>
                                <button class="toolbar-btn" title="Add Timestamp">🕒</button>
                                <button class="toolbar-btn" title="Add Character">👤</button>
                                <button class="toolbar-btn" title="Add Location">🗺️</button>
                            </div>
                            <textarea id="session-notes-content" class="form-control session-notes-textarea" rows="10" placeholder="Session notes will appear here..."></textarea>
                        </div>
                        
                        <div class="session-stats">
                            <h4>Session Statistics</h4>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <label>Encounters:</label>
                                    <span id="session-encounter-count">0</span>
                                </div>
                                <div class="stat-item">
                                    <label>NPCs Met:</label>
                                    <span id="session-npc-count">0</span>
                                </div>
                                <div class="stat-item">
                                    <label>XP Awarded:</label>
                                    <span id="session-xp-total">0</span>
                                </div>
                                <div class="stat-item">
                                    <label>Treasure Found:</label>
                                    <span id="session-treasure-count">0</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="session-timeline">
                            <h4>Session Timeline</h4>
                            <div id="session-timeline-content" class="timeline-content">
                                <div class="timeline-empty">
                                    <p>Session events will appear here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="session-history">
                    <h3>Session History</h3>
                    <div id="session-history-list" class="history-list">
                        <div class="no-history">
                            <p>No previous sessions</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupSessionEvents();
    }
    
    createToolsTab() {
        const toolsTab = this.containerElement.querySelector('#tools-tab');
        toolsTab.innerHTML = `
            <div class="adventure-tools">
                <div class="tools-header">
                    <h2>Adventure Tools</h2>
                    <div class="tools-quick-access">
                        <button id="quick-dice-btn" class="btn btn-primary">🎲 Quick Roll</button>
                        <button id="quick-treasure-btn" class="btn btn-secondary">💎 Treasure</button>
                        <button id="quick-name-btn" class="btn btn-secondary">📝 Names</button>
                    </div>
                </div>
                
                <div class="tools-grid">
                    <div class="tool-section">
                        <h3>🎲 Dice & Random</h3>
                        <div class="tool-content">
                            <div class="dice-roller">
                                <div class="dice-presets">
                                    <button class="dice-btn" data-dice="1d4">d4</button>
                                    <button class="dice-btn" data-dice="1d6">d6</button>
                                    <button class="dice-btn" data-dice="1d8">d8</button>
                                    <button class="dice-btn" data-dice="1d10">d10</button>
                                    <button class="dice-btn" data-dice="1d12">d12</button>
                                    <button class="dice-btn" data-dice="1d20">d20</button>
                                    <button class="dice-btn" data-dice="1d100">d100</button>
                                </div>
                                <div class="custom-dice">
                                    <input type="text" id="custom-dice-input" class="form-control" placeholder="3d6+2">
                                    <button id="roll-custom-btn" class="btn btn-primary">Roll</button>
                                </div>
                                <div id="dice-results" class="dice-results"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tool-section">
                        <h3>💎 Treasure Generator</h3>
                        <div class="tool-content">
                            <div class="treasure-generator">
                                <div class="treasure-options">
                                    <label for="treasure-level">Party Level:</label>
                                    <input type="number" id="treasure-level" class="form-control" value="1" min="1" max="20">
                                    <label for="treasure-type">Type:</label>
                                    <select id="treasure-type" class="form-control">
                                        <option value="individual">Individual</option>
                                        <option value="hoard">Treasure Hoard</option>
                                        <option value="magic">Magic Items</option>
                                    </select>
                                    <button id="generate-treasure-btn" class="btn btn-success">Generate</button>
                                </div>
                                <div id="treasure-results" class="treasure-results"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tool-section">
                        <h3>📝 Name Generators</h3>
                        <div class="tool-content">
                            <div class="name-generators">
                                <div class="name-type-selector">
                                    <select id="name-type" class="form-control">
                                        <option value="character">Character Names</option>
                                        <option value="place">Place Names</option>
                                        <option value="tavern">Tavern Names</option>
                                        <option value="shop">Shop Names</option>
                                        <option value="organization">Organization Names</option>
                                    </select>
                                    <button id="generate-name-btn" class="btn btn-primary">Generate</button>
                                </div>
                                <div id="name-results" class="name-results"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tool-section">
                        <h3>🗺️ Adventure Hooks</h3>
                        <div class="tool-content">
                            <div class="hook-generator">
                                <div class="hook-options">
                                    <label for="hook-theme">Theme:</label>
                                    <select id="hook-theme" class="form-control">
                                        <option value="">Any</option>
                                        <option value="mystery">Mystery</option>
                                        <option value="exploration">Exploration</option>
                                        <option value="political">Political</option>
                                        <option value="survival">Survival</option>
                                        <option value="rescue">Rescue</option>
                                    </select>
                                    <button id="generate-hook-btn" class="btn btn-primary">Generate Hook</button>
                                </div>
                                <div id="hook-results" class="hook-results"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tool-section">
                        <h3>🌤️ Weather & Environment</h3>
                        <div class="tool-content">
                            <div class="weather-generator">
                                <div class="weather-options">
                                    <label for="weather-season">Season:</label>
                                    <select id="weather-season" class="form-control">
                                        <option value="">Random</option>
                                        <option value="spring">Spring</option>
                                        <option value="summer">Summer</option>
                                        <option value="autumn">Autumn</option>
                                        <option value="winter">Winter</option>
                                    </select>
                                    <button id="generate-weather-btn" class="btn btn-primary">Generate</button>
                                </div>
                                <div id="weather-results" class="weather-results"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tool-section">
                        <h3>⚖️ CR Calculator</h3>
                        <div class="tool-content">
                            <div class="cr-calculator">
                                <div class="cr-inputs">
                                    <label>Party Size:</label>
                                    <input type="number" id="cr-party-size" class="form-control" value="4" min="1" max="8">
                                    <label>Party Level:</label>
                                    <input type="number" id="cr-party-level" class="form-control" value="1" min="1" max="20">
                                    <label>Difficulty:</label>
                                    <select id="cr-difficulty" class="form-control">
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                        <option value="deadly">Deadly</option>
                                    </select>
                                    <button id="calculate-cr-btn" class="btn btn-primary">Calculate</button>
                                </div>
                                <div id="cr-results" class="cr-results"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupToolsEvents();
    }
    
    // Event handlers for each tab
    setupCampaignEvents() {
        // Campaign management events
        const newCampaignBtn = this.containerElement.querySelector('#new-campaign-btn');
        if (newCampaignBtn) {
            newCampaignBtn.addEventListener('click', () => this.showNewCampaignModal());
        }
        
        const startSessionBtn = this.containerElement.querySelector('#start-session-btn');
        if (startSessionBtn) {
            startSessionBtn.addEventListener('click', () => this.startNewSession());
        }
        
        console.log('⚔️ Campaign events setup complete');
    }
    
    setupEncounterEvents() {
        // Encounter building events
        const newEncounterBtn = this.containerElement.querySelector('#new-encounter-btn');
        if (newEncounterBtn) {
            newEncounterBtn.addEventListener('click', () => this.createNewEncounter());
        }
        
        const randomEncounterBtn = this.containerElement.querySelector('#random-encounter-btn');
        if (randomEncounterBtn) {
            randomEncounterBtn.addEventListener('click', () => this.generateRandomEncounter());
        }
        
        const balanceEncounterBtn = this.containerElement.querySelector('#balance-encounter-btn');
        if (balanceEncounterBtn) {
            balanceEncounterBtn.addEventListener('click', () => this.balanceEncounter());
        }
        
        console.log('⚔️ Encounter events setup complete');
    }
    
    setupCombatEvents() {
        // Combat tracker events
        const startCombatBtn = this.containerElement.querySelector('#start-combat-btn');
        if (startCombatBtn) {
            startCombatBtn.addEventListener('click', () => this.startCombat());
        }
        
        const endCombatBtn = this.containerElement.querySelector('#end-combat-btn');
        if (endCombatBtn) {
            endCombatBtn.addEventListener('click', () => this.endCombat());
        }
        
        const nextTurnBtn = this.containerElement.querySelector('#next-turn-btn');
        if (nextTurnBtn) {
            nextTurnBtn.addEventListener('click', () => this.nextTurn());
        }
        
        const rollInitiativeBtn = this.containerElement.querySelector('#roll-initiative-btn');
        if (rollInitiativeBtn) {
            rollInitiativeBtn.addEventListener('click', () => this.rollInitiative());
        }
        
        console.log('⚔️ Combat events setup complete');
    }
    
    setupNPCEvents() {
        // NPC generation events
        const quickGenerateBtn = this.containerElement.querySelector('#quick-generate-npc-btn');
        if (quickGenerateBtn) {
            quickGenerateBtn.addEventListener('click', () => this.generateQuickNPC());
        }
        
        const saveNPCBtn = this.containerElement.querySelector('#save-npc-btn');
        if (saveNPCBtn) {
            saveNPCBtn.addEventListener('click', () => this.saveGeneratedNPC());
        }
        
        console.log('⚔️ NPC events setup complete');
    }
    
    setupSessionEvents() {
        // Session management events
        const startNewSessionBtn = this.containerElement.querySelector('#start-new-session-btn');
        if (startNewSessionBtn) {
            startNewSessionBtn.addEventListener('click', () => this.startNewSession());
        }
        
        const endSessionBtn = this.containerElement.querySelector('#end-session-btn');
        if (endSessionBtn) {
            endSessionBtn.addEventListener('click', () => this.endCurrentSession());
        }
        
        console.log('⚔️ Session events setup complete');
    }
    
    setupToolsEvents() {
        // Tool events
        const diceButtons = this.containerElement.querySelectorAll('.dice-btn');
        diceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const diceExpression = e.target.dataset.dice;
                this.rollDice(diceExpression);
            });
        });
        
        const rollCustomBtn = this.containerElement.querySelector('#roll-custom-btn');
        if (rollCustomBtn) {
            rollCustomBtn.addEventListener('click', () => {
                const expression = this.containerElement.querySelector('#custom-dice-input').value;
                this.rollDice(expression);
            });
        }
        
        const generateTreasureBtn = this.containerElement.querySelector('#generate-treasure-btn');
        if (generateTreasureBtn) {
            generateTreasureBtn.addEventListener('click', () => this.generateTreasure());
        }
        
        const generateNameBtn = this.containerElement.querySelector('#generate-name-btn');
        if (generateNameBtn) {
            generateNameBtn.addEventListener('click', () => this.generateName());
        }
        
        console.log('⚔️ Tools events setup complete');
    }
    
    setupEventHandlers() {
        // Global event handlers
        const saveAllBtn = this.containerElement.querySelector('#save-all-btn');
        if (saveAllBtn) {
            saveAllBtn.addEventListener('click', () => this.saveAll());
        }
        
        // Adventure Engine events
        this.adventureEngine.on('campaignCreated', (campaign) => {
            this.showNotification('Campaign created successfully', 'success');
            this.refreshCampaignsList();
        });
        
        this.adventureEngine.on('sessionStarted', (session) => {
            this.showNotification('Session started', 'success');
            this.updateSessionStatus(session);
        });
        
        this.adventureEngine.on('encounterEnded', (encounter) => {
            this.showNotification(`Encounter "${encounter.name}" completed`, 'info');
            this.addSessionEvent('encounter', `Completed: ${encounter.name}`);
        });
        
        console.log('⚔️ Event handlers setup complete');
    }
    
    setupKeyboardShortcuts() {
        if (!this.options.keyboardShortcuts) return;
        
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveAll();
                        break;
                    case 'n':
                        e.preventDefault();
                        if (this.activeTab === 'campaigns') {
                            this.showNewCampaignModal();
                        } else if (this.activeTab === 'encounters') {
                            this.createNewEncounter();
                        }
                        break;
                    case 'r':
                        e.preventDefault();
                        this.rollDice('1d20');
                        break;
                }
            }
            
            // Tab switching with numbers
            if (e.altKey && !isNaN(e.key)) {
                const tabIndex = parseInt(e.key) - 1;
                const tabs = ['campaigns', 'encounters', 'combat', 'npcs', 'session', 'tools'];
                if (tabs[tabIndex]) {
                    this.switchTab(tabs[tabIndex]);
                }
            }
        });
        
        console.log('⚔️ Keyboard shortcuts enabled');
    }
    
    setupAutoSave() {
        setInterval(() => {
            this.autoSave();
        }, 30000); // Auto-save every 30 seconds
        
        console.log('⚔️ Auto-save enabled');
    }
    
    // Main functionality methods
    showNewCampaignModal() {
        const modal = this.createModal('new-campaign', 'Create New Campaign', `
            <form id="new-campaign-form" class="campaign-form">
                <div class="form-group">
                    <label for="campaign-name-input">Campaign Name *</label>
                    <input type="text" id="campaign-name-input" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="campaign-description">Description</label>
                    <textarea id="campaign-description" class="form-control" rows="3"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="campaign-setting">Setting</label>
                        <select id="campaign-setting" class="form-control">
                            <option value="generic-fantasy">Generic Fantasy</option>
                            <option value="forgotten-realms">Forgotten Realms</option>
                            <option value="greyhawk">Greyhawk</option>
                            <option value="eberron">Eberron</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="campaign-start-level">Starting Level</label>
                        <input type="number" id="campaign-start-level" class="form-control" value="1" min="1" max="20">
                    </div>
                </div>
                <div class="form-group">
                    <label for="campaign-players">Players (comma-separated)</label>
                    <input type="text" id="campaign-players" class="form-control" placeholder="Alice, Bob, Charlie">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Create Campaign</button>
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </form>
        `);
        
        modal.querySelector('#new-campaign-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createCampaign(e.target);
            modal.remove();
        });
    }
    
    createCampaign(formElement) {
        const formData = new FormData(formElement);
        const players = formData.get('campaign-players') ? 
            formData.get('campaign-players').split(',').map(p => p.trim()).filter(p => p) : [];
        
        const campaign = this.adventureEngine.createCampaign({
            name: formData.get('campaign-name-input'),
            description: formData.get('campaign-description'),
            setting: formData.get('campaign-setting'),
            currentLevel: parseInt(formData.get('campaign-start-level')),
            players: players
        });
        
        this.showNotification(`Campaign "${campaign.name}" created successfully!`, 'success');
        this.refreshCampaignsList();
    }
    
    generateRandomEncounter() {
        if (!this.selectedCampaign) {
            this.showNotification('Please select a campaign first', 'warning');
            return;
        }
        
        const encounter = this.adventureEngine.generateRandomEncounter({
            partyLevel: this.selectedCampaign.currentLevel,
            environment: 'wilderness',
            difficulty: 'medium'
        });
        
        if (encounter) {
            this.showNotification('Random encounter generated!', 'success');
            this.displayEncounter(encounter);
        }
    }
    
    generateQuickNPC() {
        const raceSelect = this.containerElement.querySelector('#npc-race');
        const classSelect = this.containerElement.querySelector('#npc-class');
        const levelSelect = this.containerElement.querySelector('#npc-level');
        const roleSelect = this.containerElement.querySelector('#npc-role');
        
        const npc = this.adventureEngine.generateNPC({
            race: raceSelect.value || null,
            class: classSelect.value || null,
            level: levelSelect.value ? parseInt(levelSelect.value) : null,
            role: roleSelect.value || null
        });
        
        this.displayGeneratedNPC(npc);
        this.showNotification('NPC generated successfully!', 'success');
    }
    
    startNewSession() {
        if (!this.selectedCampaign) {
            this.showNotification('Please select a campaign first', 'warning');
            return;
        }
        
        const session = this.adventureEngine.startSession({
            campaignId: this.selectedCampaign.id,
            players: this.selectedCampaign.players,
            characters: this.selectedCampaign.characters
        });
        
        this.sessionActive = true;
        this.sessionStartTime = Date.now();
        this.startSessionTimer();
        
        this.showNotification('Session started!', 'success');
        this.switchTab('session');
    }
    
    startCombat() {
        if (this.initiativeOrder.length === 0) {
            this.showNotification('Add combatants before starting combat', 'warning');
            return;
        }
        
        this.combatActive = true;
        this.currentRound = 1;
        this.currentTurn = 0;
        
        // Enable combat controls
        this.containerElement.querySelector('#end-combat-btn').disabled = false;
        this.containerElement.querySelector('#next-turn-btn').disabled = false;
        this.containerElement.querySelector('#start-combat-btn').disabled = true;
        
        this.updateCombatDisplay();
        this.addCombatLogEntry('Combat started!', 'system');
        
        this.showNotification('Combat started!', 'success');
    }
    
    rollDice(expression) {
        try {
            const result = this.diceEngine.rollExpression(expression);
            const resultsDiv = this.containerElement.querySelector('#dice-results');
            
            if (resultsDiv) {
                const resultHTML = `
                    <div class="dice-result">
                        <strong>${expression}:</strong> ${result.total}
                        ${result.rolls ? `<small>(${result.rolls.join(', ')})</small>` : ''}
                    </div>
                `;
                
                resultsDiv.innerHTML = resultHTML + resultsDiv.innerHTML;
                
                // Keep only last 10 results
                const results = resultsDiv.querySelectorAll('.dice-result');
                if (results.length > 10) {
                    for (let i = 10; i < results.length; i++) {
                        results[i].remove();
                    }
                }
            }
            
            this.showNotification(`${expression}: ${result.total}`, 'info');
        } catch (error) {
            this.showNotification(`Invalid dice expression: ${expression}`, 'error');
        }
    }
    
    // Utility methods
    createModal(id, title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        const modalsContainer = this.containerElement.querySelector('.adventure-interface-modals');
        modalsContainer.appendChild(modal);
        
        return modal;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        const notificationsContainer = this.containerElement.querySelector('.adventure-interface-notifications');
        notificationsContainer.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
        
        console.log(`${type.toUpperCase()}: ${message}`);
    }
    
    refreshTabContent(tabName) {
        switch (tabName) {
            case 'campaigns':
                this.refreshCampaignsList();
                break;
            case 'encounters':
                this.refreshEncountersList();
                break;
            case 'combat':
                this.refreshCombatTracker();
                break;
            case 'npcs':
                this.refreshNPCList();
                break;
            case 'session':
                this.refreshSessionContent();
                break;
            case 'tools':
                this.refreshToolsContent();
                break;
        }
    }
    
    refreshCampaignsList() {
        const campaignsGrid = this.containerElement.querySelector('#campaigns-grid');
        const noCampaigns = this.containerElement.querySelector('#no-campaigns');
        
        if (!campaignsGrid) return;
        
        const campaigns = Array.from(this.adventureEngine.campaigns.values());
        
        if (campaigns.length === 0) {
            campaignsGrid.style.display = 'none';
            noCampaigns.style.display = 'block';
            return;
        }
        
        campaignsGrid.style.display = 'grid';
        noCampaigns.style.display = 'none';
        
        campaignsGrid.innerHTML = campaigns.map(campaign => `
            <div class="campaign-card" data-campaign-id="${campaign.id}">
                <div class="campaign-card-header">
                    <h4>${campaign.name}</h4>
                    <span class="campaign-status ${campaign.status}">${campaign.status}</span>
                </div>
                <div class="campaign-card-body">
                    <p>${campaign.description || 'No description'}</p>
                    <div class="campaign-meta">
                        <span>📅 ${new Date(campaign.created).toLocaleDateString()}</span>
                        <span>👥 ${campaign.players.length} players</span>
                        <span>🎲 Level ${campaign.currentLevel}</span>
                    </div>
                </div>
                <div class="campaign-card-actions">
                    <button class="btn btn-primary btn-sm" onclick="window.adventureInterface.selectCampaign('${campaign.id}')">Select</button>
                    <button class="btn btn-secondary btn-sm" onclick="window.adventureInterface.editCampaign('${campaign.id}')">Edit</button>
                </div>
            </div>
        `).join('');
    }
    
    // Stub methods for other refresh functions
    refreshEncountersList() {
        console.log('⚔️ Refreshing encounters list');
    }
    
    refreshCombatTracker() {
        console.log('⚔️ Refreshing combat tracker');
    }
    
    refreshNPCList() {
        console.log('⚔️ Refreshing NPC list');
    }
    
    refreshSessionContent() {
        console.log('⚔️ Refreshing session content');
    }
    
    refreshToolsContent() {
        console.log('⚔️ Refreshing tools content');
    }
    
    // Data persistence
    saveAll() {
        try {
            this.adventureEngine.saveAdventureProgress();
            this.saveInterfaceState();
            this.showNotification('All data saved successfully', 'success');
        } catch (error) {
            console.error('Save failed:', error);
            this.showNotification('Save failed: ' + error.message, 'error');
        }
    }
    
    autoSave() {
        try {
            this.saveInterfaceState();
            console.log('⚔️ Auto-save completed');
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }
    
    saveInterfaceState() {
        const state = {
            activeTab: this.activeTab,
            selectedCampaign: this.selectedCampaign?.id,
            sessionActive: this.sessionActive,
            combatActive: this.combatActive,
            sessionNotes: this.sessionNotes
        };
        
        localStorage.setItem('adventure-interface-state', JSON.stringify(state));
    }
    
    loadStoredState() {
        try {
            const stored = localStorage.getItem('adventure-interface-state');
            if (stored) {
                const state = JSON.parse(stored);
                
                if (state.activeTab) {
                    this.switchTab(state.activeTab);
                }
                
                if (state.selectedCampaign) {
                    this.selectedCampaign = this.adventureEngine.campaigns.get(state.selectedCampaign);
                }
                
                this.sessionActive = state.sessionActive || false;
                this.combatActive = state.combatActive || false;
                this.sessionNotes = state.sessionNotes || '';
            }
        } catch (error) {
            console.error('Failed to load stored state:', error);
        }
    }
    
    // Cleanup
    destroy() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        if (this.containerElement && this.containerElement.parentElement) {
            this.containerElement.remove();
        }
        
        console.log('⚔️ Adventure Interface destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAdventureInterface;
} else if (typeof window !== 'undefined') {
    window.AdvancedAdventureInterface = AdvancedAdventureInterface;
}
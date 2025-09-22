/**
 * AdventureInterface - Campaign Management and Adventure Generation UI
 * Provides comprehensive interface for D&D campaign management
 */

class AdventureInterface {
    constructor(adventureEngine, targetContainer) {
        this.adventureEngine = adventureEngine;
        this.container = targetContainer;
        this.currentCampaign = null;
        this.activeEncounter = null;
        this.initialize();
    }

    initialize() {
        this.createAdventureHTML();
        this.attachEventListeners();
        console.log('🏰 AdventureInterface initialized successfully');
    }

    // ==================== HTML GENERATION ====================

    createAdventureHTML() {
        this.container.innerHTML = `
            <div class="adventure-interface-container">
                <!-- Campaign Header -->
                <div class="campaign-header">
                    <h2><i class="icon-castle"></i> Adventure Engine</h2>
                    <div class="campaign-controls">
                        <button class="btn btn-primary" id="newCampaignBtn">
                            <i class="icon-plus"></i> New Campaign
                        </button>
                        <button class="btn btn-secondary" id="loadCampaignBtn">
                            <i class="icon-folder"></i> Load Campaign
                        </button>
                        <button class="btn btn-success" id="generateEncounterBtn" style="display: none;">
                            <i class="icon-dice"></i> Generate Encounter
                        </button>
                    </div>
                </div>

                <!-- Campaign Creation Modal -->
                <div class="modal" id="campaignModal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Create New Campaign</h3>
                            <button class="modal-close" id="closeCampaignModal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Campaign Name:</label>
                                <input type="text" id="campaignName" class="form-input" placeholder="Enter campaign name...">
                            </div>
                            <div class="form-group">
                                <label>Description:</label>
                                <textarea id="campaignDescription" class="form-textarea" placeholder="Describe your campaign..."></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Setting:</label>
                                    <select id="campaignSetting" class="form-select">
                                        <option value="generic fantasy">Generic Fantasy</option>
                                        <option value="high fantasy">High Fantasy</option>
                                        <option value="dark fantasy">Dark Fantasy</option>
                                        <option value="urban fantasy">Urban Fantasy</option>
                                        <option value="steampunk">Steampunk</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Starting Location:</label>
                                    <input type="text" id="currentLocation" class="form-input" placeholder="e.g., Greenwood Village">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Party Level:</label>
                                    <input type="number" id="partyLevel" class="form-input" value="1" min="1" max="20">
                                </div>
                                <div class="form-group">
                                    <label>Party Size:</label>
                                    <input type="number" id="partySize" class="form-input" value="4" min="1" max="8">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" id="cancelCampaignBtn">Cancel</button>
                            <button class="btn btn-primary" id="createCampaignBtn">Create Campaign</button>
                        </div>
                    </div>
                </div>

                <!-- Campaign Dashboard -->
                <div class="campaign-dashboard" id="campaignDashboard" style="display: none;">
                    <div class="dashboard-sidebar">
                        <div class="campaign-info">
                            <h3 id="campaignTitle">Campaign Name</h3>
                            <div class="campaign-stats">
                                <div class="stat-item">
                                    <span class="stat-label">Chapter:</span>
                                    <span class="stat-value" id="currentChapter">1</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Party Level:</span>
                                    <span class="stat-value" id="displayPartyLevel">1</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Location:</span>
                                    <span class="stat-value" id="displayLocation">Unknown</span>
                                </div>
                            </div>
                        </div>

                        <div class="navigation-menu">
                            <button class="nav-btn active" data-section="encounters">
                                <i class="icon-sword"></i> Encounters
                            </button>
                            <button class="nav-btn" data-section="npcs">
                                <i class="icon-people"></i> NPCs
                            </button>
                            <button class="nav-btn" data-section="story">
                                <i class="icon-book"></i> Story
                            </button>
                            <button class="nav-btn" data-section="treasure">
                                <i class="icon-treasure"></i> Treasure
                            </button>
                            <button class="nav-btn" data-section="notes">
                                <i class="icon-notes"></i> Notes
                            </button>
                        </div>
                    </div>

                    <div class="dashboard-content">
                        <!-- Encounters Section -->
                        <div class="content-section" id="encountersSection">
                            <div class="section-header">
                                <h3>Encounter Management</h3>
                                <div class="encounter-controls">
                                    <select id="encounterType" class="form-select">
                                        <option value="any">Any Type</option>
                                        <option value="combat">Combat</option>
                                        <option value="social">Social</option>
                                        <option value="exploration">Exploration</option>
                                        <option value="puzzle">Puzzle</option>
                                    </select>
                                    <select id="encounterEnvironment" class="form-select">
                                        <option value="any">Any Environment</option>
                                        <option value="village">Village</option>
                                        <option value="forest">Forest</option>
                                        <option value="dungeon">Dungeon</option>
                                        <option value="ruins">Ruins</option>
                                        <option value="mountains">Mountains</option>
                                        <option value="road">Road</option>
                                    </select>
                                    <button class="btn btn-primary" id="quickEncounterBtn">Generate</button>
                                </div>
                            </div>
                            
                            <div class="encounters-list" id="encountersList">
                                <!-- Encounters will be loaded here -->
                            </div>
                        </div>

                        <!-- NPCs Section -->
                        <div class="content-section" id="npcsSection" style="display: none;">
                            <div class="section-header">
                                <h3>NPC Management</h3>
                                <button class="btn btn-primary" id="generateNPCBtn">
                                    <i class="icon-plus"></i> Generate NPC
                                </button>
                            </div>
                            <div class="npcs-grid" id="npcsList">
                                <!-- NPCs will be loaded here -->
                            </div>
                        </div>

                        <!-- Story Section -->
                        <div class="content-section" id="storySection" style="display: none;">
                            <div class="section-header">
                                <h3>Story & Plot Hooks</h3>
                                <button class="btn btn-primary" id="advanceStoryBtn">
                                    <i class="icon-forward"></i> Advance Story
                                </button>
                            </div>
                            <div class="story-content">
                                <div class="plot-hooks" id="plotHooks">
                                    <!-- Plot hooks will be loaded here -->
                                </div>
                                <div class="story-timeline" id="storyTimeline">
                                    <!-- Timeline will be loaded here -->
                                </div>
                            </div>
                        </div>

                        <!-- Treasure Section -->
                        <div class="content-section" id="treasureSection" style="display: none;">
                            <div class="section-header">
                                <h3>Treasure Generator</h3>
                                <div class="treasure-controls">
                                    <select id="treasureType" class="form-select">
                                        <option value="minor">Minor Treasure</option>
                                        <option value="moderate">Moderate Treasure</option>
                                        <option value="major">Major Treasure</option>
                                        <option value="ancient_artifact">Ancient Artifact</option>
                                    </select>
                                    <input type="number" id="treasureCR" class="form-input" placeholder="CR" min="1" max="20" value="1">
                                    <button class="btn btn-primary" id="generateTreasureBtn">Generate</button>
                                </div>
                            </div>
                            <div class="treasure-results" id="treasureResults">
                                <!-- Treasure results will be displayed here -->
                            </div>
                        </div>

                        <!-- Notes Section -->
                        <div class="content-section" id="notesSection" style="display: none;">
                            <div class="section-header">
                                <h3>Campaign Notes</h3>
                                <button class="btn btn-primary" id="saveNotesBtn">
                                    <i class="icon-save"></i> Save Notes
                                </button>
                            </div>
                            <textarea id="campaignNotes" class="campaign-notes-editor" placeholder="Write your campaign notes here..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- Encounter Detail Modal -->
                <div class="modal" id="encounterModal" style="display: none;">
                    <div class="modal-content large">
                        <div class="modal-header">
                            <h3 id="encounterTitle">Encounter Details</h3>
                            <button class="modal-close" id="closeEncounterModal">&times;</button>
                        </div>
                        <div class="modal-body" id="encounterDetails">
                            <!-- Encounter details will be loaded here -->
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" id="closeEncounterBtn">Close</button>
                            <button class="btn btn-success" id="runEncounterBtn">Run Encounter</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== EVENT LISTENERS ====================

    attachEventListeners() {
        // Campaign creation
        document.getElementById('newCampaignBtn').addEventListener('click', () => this.showCampaignModal());
        document.getElementById('createCampaignBtn').addEventListener('click', () => this.createCampaign());
        document.getElementById('cancelCampaignBtn').addEventListener('click', () => this.hideCampaignModal());
        document.getElementById('closeCampaignModal').addEventListener('click', () => this.hideCampaignModal());

        // Quick encounter generation
        document.getElementById('generateEncounterBtn').addEventListener('click', () => this.generateQuickEncounter());
        document.getElementById('quickEncounterBtn').addEventListener('click', () => this.generateCustomEncounter());

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section, e.target));
        });

        // NPC generation
        document.getElementById('generateNPCBtn').addEventListener('click', () => this.generateNPC());

        // Story progression
        document.getElementById('advanceStoryBtn').addEventListener('click', () => this.advanceStory());

        // Treasure generation
        document.getElementById('generateTreasureBtn').addEventListener('click', () => this.generateTreasure());

        // Notes saving
        document.getElementById('saveNotesBtn').addEventListener('click', () => this.saveNotes());

        // Modal controls
        document.getElementById('closeEncounterModal').addEventListener('click', () => this.hideEncounterModal());
        document.getElementById('closeEncounterBtn').addEventListener('click', () => this.hideEncounterModal());
        document.getElementById('runEncounterBtn').addEventListener('click', () => this.runEncounter());
    }

    // ==================== CAMPAIGN MANAGEMENT ====================

    showCampaignModal() {
        document.getElementById('campaignModal').style.display = 'flex';
    }

    hideCampaignModal() {
        document.getElementById('campaignModal').style.display = 'none';
    }

    createCampaign() {
        const campaignData = {
            name: document.getElementById('campaignName').value || 'New Campaign',
            description: document.getElementById('campaignDescription').value,
            setting: document.getElementById('campaignSetting').value,
            currentLocation: document.getElementById('currentLocation').value || 'Starting Village',
            partyLevel: parseInt(document.getElementById('partyLevel').value) || 1,
            partySize: parseInt(document.getElementById('partySize').value) || 4
        };

        this.currentCampaign = this.adventureEngine.createCampaign(campaignData);
        this.loadCampaignDashboard();
        this.hideCampaignModal();
        this.showNotification('Campaign created successfully!', 'success');
    }

    loadCampaignDashboard() {
        if (!this.currentCampaign) return;

        document.getElementById('campaignDashboard').style.display = 'flex';
        document.getElementById('generateEncounterBtn').style.display = 'inline-block';

        // Update campaign info
        document.getElementById('campaignTitle').textContent = this.currentCampaign.name;
        document.getElementById('currentChapter').textContent = this.currentCampaign.storyProgress.currentChapter;
        document.getElementById('displayPartyLevel').textContent = this.currentCampaign.partyLevel;
        document.getElementById('displayLocation').textContent = this.currentCampaign.currentLocation;

        // Load initial content
        this.loadEncounters();
        this.loadPlotHooks();
    }

    // ==================== ENCOUNTER MANAGEMENT ====================

    generateQuickEncounter() {
        if (!this.currentCampaign) return;

        const encounter = this.adventureEngine.generateRandomEncounter(
            this.currentCampaign.partyLevel,
            this.currentCampaign.partySize
        );

        this.currentCampaign.encounters.upcoming.push(encounter.id);
        this.loadEncounters();
        this.showNotification(`Generated: ${encounter.name}`, 'success');
    }

    generateCustomEncounter() {
        if (!this.currentCampaign) return;

        const type = document.getElementById('encounterType').value;
        const environment = document.getElementById('encounterEnvironment').value;

        const encounter = this.adventureEngine.generateRandomEncounter(
            this.currentCampaign.partyLevel,
            this.currentCampaign.partySize,
            type,
            environment
        );

        this.currentCampaign.encounters.upcoming.push(encounter.id);
        this.loadEncounters();
        this.showNotification(`Generated: ${encounter.name}`, 'success');
    }

    loadEncounters() {
        const container = document.getElementById('encountersList');
        container.innerHTML = '';

        if (!this.currentCampaign) return;

        // Load upcoming encounters
        const upcomingEncounters = this.currentCampaign.encounters.upcoming
            .map(id => this.adventureEngine.getEncounter(id))
            .filter(Boolean);

        if (upcomingEncounters.length === 0) {
            container.innerHTML = '<div class="empty-state">No encounters yet. Generate some encounters to get started!</div>';
            return;
        }

        upcomingEncounters.forEach(encounter => {
            const encounterCard = this.createEncounterCard(encounter);
            container.appendChild(encounterCard);
        });
    }

    createEncounterCard(encounter) {
        const card = document.createElement('div');
        card.className = `encounter-card ${encounter.type}`;
        
        card.innerHTML = `
            <div class="encounter-header">
                <h4>${encounter.name}</h4>
                <div class="encounter-badges">
                    <span class="badge badge-${encounter.type}">${encounter.type}</span>
                    <span class="badge badge-cr">CR ${encounter.challengeRating}</span>
                </div>
            </div>
            <div class="encounter-description">
                ${encounter.description}
            </div>
            <div class="encounter-environment">
                <strong>Environment:</strong> ${Array.isArray(encounter.environment) ? encounter.environment.join(', ') : encounter.environment}
            </div>
            <div class="encounter-actions">
                <button class="btn btn-sm btn-info" onclick="adventureInterface.showEncounterDetails('${encounter.id}')">
                    <i class="icon-eye"></i> View Details
                </button>
                <button class="btn btn-sm btn-success" onclick="adventureInterface.runEncounter('${encounter.id}')">
                    <i class="icon-play"></i> Run
                </button>
            </div>
        `;

        return card;
    }

    showEncounterDetails(encounterId) {
        const encounter = this.adventureEngine.getEncounter(encounterId);
        if (!encounter) return;

        document.getElementById('encounterTitle').textContent = encounter.name;
        document.getElementById('encounterDetails').innerHTML = this.generateEncounterDetailsHTML(encounter);
        document.getElementById('encounterModal').style.display = 'flex';
        this.activeEncounter = encounter;
    }

    generateEncounterDetailsHTML(encounter) {
        let html = `
            <div class="encounter-full-details">
                <div class="encounter-basic-info">
                    <p><strong>Description:</strong> ${encounter.description}</p>
                    <p><strong>Type:</strong> ${encounter.type}</p>
                    <p><strong>Challenge Rating:</strong> ${encounter.challengeRating}</p>
                    <p><strong>Environment:</strong> ${Array.isArray(encounter.environment) ? encounter.environment.join(', ') : encounter.environment}</p>
                </div>
        `;

        if (encounter.creatures) {
            html += `
                <div class="encounter-creatures">
                    <h4>Creatures</h4>
                    ${encounter.creatures.map(creature => 
                        `<div class="creature-entry">
                            <strong>${creature.name}</strong> (${creature.count}) - CR ${creature.cr}
                        </div>`
                    ).join('')}
                    <div class="tactics">
                        <strong>Tactics:</strong> ${encounter.tactics}
                    </div>
                </div>
            `;
        }

        if (encounter.npcs) {
            html += `
                <div class="encounter-npcs">
                    <h4>NPCs</h4>
                    ${encounter.npcs.map(npc => 
                        `<div class="npc-entry">
                            <strong>${npc.name}</strong> - ${npc.occupation}<br>
                            <em>${npc.personality}</em>
                        </div>`
                    ).join('')}
                </div>
            `;
        }

        if (encounter.features) {
            html += `
                <div class="encounter-features">
                    <h4>Environmental Features</h4>
                    <ul>
                        ${encounter.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (encounter.puzzle) {
            html += `
                <div class="encounter-puzzle">
                    <h4>Puzzle</h4>
                    <p><strong>Riddle:</strong> ${encounter.puzzle.riddle}</p>
                    <p><strong>Answer:</strong> ${encounter.puzzle.answer}</p>
                    <p><strong>Hint:</strong> ${encounter.puzzle.hint}</p>
                </div>
            `;
        }

        if (encounter.treasure) {
            html += `
                <div class="encounter-treasure">
                    <h4>Treasure</h4>
                    ${this.formatTreasure(encounter.treasure)}
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    // ==================== SECTION NAVIGATION ====================

    switchSection(sectionName, buttonElement) {
        // Update active navigation
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        buttonElement.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        document.getElementById(sectionName + 'Section').style.display = 'block';

        // Load section-specific content
        switch(sectionName) {
            case 'encounters':
                this.loadEncounters();
                break;
            case 'npcs':
                this.loadNPCs();
                break;
            case 'story':
                this.loadStoryContent();
                break;
            case 'notes':
                this.loadNotes();
                break;
        }
    }

    // ==================== NPC MANAGEMENT ====================

    generateNPC() {
        if (!this.currentCampaign) return;

        const npc = this.adventureEngine.generateNPC('random', this.currentCampaign.currentLocation);
        this.currentCampaign.npcs[npc.id] = npc;
        this.loadNPCs();
        this.showNotification(`Generated NPC: ${npc.name}`, 'success');
    }

    loadNPCs() {
        const container = document.getElementById('npcsList');
        container.innerHTML = '';

        if (!this.currentCampaign) return;

        const npcs = Object.values(this.currentCampaign.npcs);
        if (npcs.length === 0) {
            container.innerHTML = '<div class="empty-state">No NPCs yet. Generate some NPCs for your campaign!</div>';
            return;
        }

        npcs.forEach(npc => {
            const npcCard = this.createNPCCard(npc);
            container.appendChild(npcCard);
        });
    }

    createNPCCard(npc) {
        const card = document.createElement('div');
        card.className = 'npc-card';
        
        card.innerHTML = `
            <div class="npc-header">
                <h4>${npc.name}</h4>
                <span class="npc-occupation">${npc.occupation}</span>
            </div>
            <div class="npc-details">
                <p><strong>Personality:</strong> ${npc.personality}</p>
                <p><strong>Motivation:</strong> ${npc.motivation}</p>
                <p><strong>Appearance:</strong> ${npc.appearance}</p>
                <p><strong>Speech:</strong> ${npc.speechPattern}</p>
            </div>
            <div class="npc-secret">
                <strong>Secret:</strong> ${npc.secret}
            </div>
        `;

        return card;
    }

    // ==================== STORY MANAGEMENT ====================

    loadPlotHooks() {
        const container = document.getElementById('plotHooks');
        if (!this.currentCampaign) return;

        const hooks = this.currentCampaign.storyProgress.plotPoints;
        container.innerHTML = hooks.map(hook => `
            <div class="plot-hook">
                <h4>${hook.title}</h4>
                <p>${hook.description}</p>
                <div class="hook-details">
                    <span class="urgency urgency-${hook.urgency}">${hook.urgency} urgency</span>
                    <span class="reward">Reward: ${hook.reward}</span>
                </div>
            </div>
        `).join('');
    }

    loadStoryContent() {
        this.loadPlotHooks();
        this.loadTimeline();
    }

    loadTimeline() {
        const container = document.getElementById('storyTimeline');
        if (!this.currentCampaign) return;

        const timeline = this.currentCampaign.timeline;
        container.innerHTML = `
            <h4>Story Timeline</h4>
            <div class="timeline-events">
                ${timeline.map(event => `
                    <div class="timeline-event">
                        <div class="event-time">${new Date(event.timestamp).toLocaleString()}</div>
                        <div class="event-action">${event.action}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    advanceStory() {
        if (!this.currentCampaign) return;

        const action = `Story advanced by DM - Chapter ${this.currentCampaign.storyProgress.currentChapter}`;
        this.adventureEngine.advanceStory(this.currentCampaign.id, action);
        this.loadCampaignDashboard();
        this.showNotification('Story advanced!', 'success');
    }

    // ==================== TREASURE MANAGEMENT ====================

    generateTreasure() {
        const type = document.getElementById('treasureType').value;
        const cr = parseInt(document.getElementById('treasureCR').value) || 1;

        const treasure = this.adventureEngine.generateTreasure(type, cr);
        
        const container = document.getElementById('treasureResults');
        container.innerHTML = `
            <div class="treasure-result">
                <h4>Generated Treasure (${type}, CR ${cr})</h4>
                ${this.formatTreasure(treasure)}
            </div>
        `;

        this.showNotification('Treasure generated!', 'success');
    }

    formatTreasure(treasure) {
        let html = '<div class="treasure-breakdown">';
        
        // Coins
        if (Object.keys(treasure.coins).length > 0) {
            html += '<div class="treasure-coins"><h5>Coins</h5>';
            for (const [type, amount] of Object.entries(treasure.coins)) {
                if (amount > 0) {
                    html += `<div class="coin-entry">${amount} ${type}</div>`;
                }
            }
            html += '</div>';
        }
        
        // Items
        if (treasure.items && treasure.items.length > 0) {
            html += '<div class="treasure-items"><h5>Items</h5>';
            treasure.items.forEach(item => {
                html += `<div class="item-entry">${item}</div>`;
            });
            html += '</div>';
        }
        
        html += `<div class="treasure-total">Total Value: ~${treasure.totalValue} gp</div>`;
        html += '</div>';
        
        return html;
    }

    // ==================== UTILITY METHODS ====================

    hideEncounterModal() {
        document.getElementById('encounterModal').style.display = 'none';
        this.activeEncounter = null;
    }

    runEncounter(encounterId) {
        const encounter = encounterId ? this.adventureEngine.getEncounter(encounterId) : this.activeEncounter;
        if (!encounter) return;

        // Move encounter from upcoming to active
        if (this.currentCampaign) {
            const index = this.currentCampaign.encounters.upcoming.indexOf(encounter.id);
            if (index > -1) {
                this.currentCampaign.encounters.upcoming.splice(index, 1);
                this.currentCampaign.encounters.active.push(encounter.id);
            }
        }

        this.hideEncounterModal();
        this.loadEncounters();
        this.showNotification(`Running encounter: ${encounter.name}`, 'success');
    }

    saveNotes() {
        if (!this.currentCampaign) return;

        const notes = document.getElementById('campaignNotes').value;
        this.currentCampaign.notes = notes;
        this.showNotification('Notes saved!', 'success');
    }

    loadNotes() {
        if (!this.currentCampaign) return;

        document.getElementById('campaignNotes').value = this.currentCampaign.notes || '';
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

    // ==================== PUBLIC API ====================

    getCurrentCampaign() {
        return this.currentCampaign;
    }

    getActiveEncounter() {
        return this.activeEncounter;
    }
}

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdventureInterface;
} else if (typeof window !== 'undefined') {
    window.AdventureInterface = AdventureInterface;
}
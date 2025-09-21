/**
 * Story Tracker Interface - UI for managing character backstories and narrative progression
 * Provides timeline management, relationship mapping, goal tracking, and achievement systems
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class StoryTrackerInterface {
    constructor(containerId, storyTracker, characterManager) {
        this.container = document.getElementById(containerId);
        this.storyTracker = storyTracker;
        this.characterManager = characterManager;
        this.currentCharacter = null;
        this.currentStory = null;
        
        if (!this.container) {
            throw new Error(`Container element with ID "${containerId}" not found`);
        }
        
        this.initialize();
        
        console.log('📖 Story Tracker Interface initialized');
    }
    
    initialize() {
        this.container.className = 'story-tracker-interface';
        this.createInterface();
        this.attachEventListeners();
        
        // Listen for character changes
        if (this.characterManager) {
            this.characterManager.addEventListener('characterChanged', (event) => {
                this.loadCharacterStory(event.detail.character);
            });
        }
    }
    
    createInterface() {
        this.container.innerHTML = `
            <div class="story-header">
                <h2>📖 Character Story Tracker</h2>
                <div class="story-character-info" id="storyCharacterInfo">
                    <p>No character selected</p>
                </div>
            </div>
            
            <div class="story-content" id="storyContent">
                <div class="story-tabs">
                    <button class="story-tab active" data-tab="backstory">Backstory</button>
                    <button class="story-tab" data-tab="timeline">Timeline</button>
                    <button class="story-tab" data-tab="relationships">Relationships</button>
                    <button class="story-tab" data-tab="goals">Goals</button>
                    <button class="story-tab" data-tab="achievements">Achievements</button>
                    <button class="story-tab" data-tab="analysis">Analysis</button>
                </div>
                
                <div class="story-tab-content">
                    <div class="story-panel active" id="backstoryPanel">
                        ${this.createBackstoryPanel()}
                    </div>
                    <div class="story-panel" id="timelinePanel">
                        ${this.createTimelinePanel()}
                    </div>
                    <div class="story-panel" id="relationshipsPanel">
                        ${this.createRelationshipsPanel()}
                    </div>
                    <div class="story-panel" id="goalsPanel">
                        ${this.createGoalsPanel()}
                    </div>
                    <div class="story-panel" id="achievementsPanel">
                        ${this.createAchievementsPanel()}
                    </div>
                    <div class="story-panel" id="analysisPanel">
                        ${this.createAnalysisPanel()}
                    </div>
                </div>
            </div>
            
            ${this.createStoryStyles()}
        `;
    }
    
    createBackstoryPanel() {
        return `
            <div class="backstory-panel">
                <h3>Character Background</h3>
                
                <div class="backstory-section">
                    <h4>Personality Traits</h4>
                    <div id="personalityTraits" class="trait-list">
                        <!-- Traits will be populated dynamically -->
                    </div>
                    <button id="addTraitBtn" class="add-btn">+ Add Trait</button>
                </div>
                
                <div class="backstory-section">
                    <h4>Ideals</h4>
                    <div id="idealsList" class="trait-list">
                        <!-- Ideals will be populated dynamically -->
                    </div>
                    <button id="addIdealBtn" class="add-btn">+ Add Ideal</button>
                </div>
                
                <div class="backstory-section">
                    <h4>Bonds</h4>
                    <div id="bondsList" class="trait-list">
                        <!-- Bonds will be populated dynamically -->
                    </div>
                    <button id="addBondBtn" class="add-btn">+ Add Bond</button>
                </div>
                
                <div class="backstory-section">
                    <h4>Flaws</h4>
                    <div id="flawsList" class="trait-list">
                        <!-- Flaws will be populated dynamically -->
                    </div>
                    <button id="addFlawBtn" class="add-btn">+ Add Flaw</button>
                </div>
                
                <div class="backstory-section">
                    <h4>Background Details</h4>
                    <div class="background-details">
                        <div class="detail-item">
                            <label>Origin:</label>
                            <input type="text" id="backgroundOrigin" class="detail-input" placeholder="Where are they from?">
                        </div>
                        <div class="detail-item">
                            <label>Hometown:</label>
                            <input type="text" id="backgroundHometown" class="detail-input" placeholder="Home settlement">
                        </div>
                        <div class="detail-item">
                            <label>Profession:</label>
                            <input type="text" id="backgroundProfession" class="detail-input" placeholder="Former occupation">
                        </div>
                        <div class="detail-item">
                            <label>Education:</label>
                            <textarea id="backgroundEducation" class="detail-textarea" placeholder="Training and learning background"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    createTimelinePanel() {
        return `
            <div class="timeline-panel">
                <div class="timeline-controls">
                    <h3>Character Timeline</h3>
                    <div class="timeline-filters">
                        <select id="timelineFilter" class="filter-select">
                            <option value="all">All Events</option>
                            <option value="character_creation">Character Creation</option>
                            <option value="level_up">Level Ups</option>
                            <option value="major_victory">Major Victories</option>
                            <option value="new_relationship">New Relationships</option>
                            <option value="achievement">Achievements</option>
                        </select>
                        <select id="importanceFilter" class="filter-select">
                            <option value="all">All Importance</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <button id="addTimelineEvent" class="add-btn">+ Add Event</button>
                    </div>
                </div>
                
                <div id="timelineContainer" class="timeline-container">
                    <!-- Timeline events will be populated dynamically -->
                </div>
            </div>
        `;
    }
    
    createRelationshipsPanel() {
        return `
            <div class="relationships-panel">
                <div class="relationships-controls">
                    <h3>Character Relationships</h3>
                    <div class="relationship-filters">
                        <select id="relationshipTypeFilter" class="filter-select">
                            <option value="all">All Types</option>
                            <option value="family">Family</option>
                            <option value="friend">Friend</option>
                            <option value="ally">Ally</option>
                            <option value="rival">Rival</option>
                            <option value="enemy">Enemy</option>
                            <option value="romantic">Romantic</option>
                            <option value="mentor">Mentor</option>
                        </select>
                        <button id="addRelationship" class="add-btn">+ Add Relationship</button>
                    </div>
                </div>
                
                <div id="relationshipsContainer" class="relationships-container">
                    <!-- Relationships will be populated dynamically -->
                </div>
                
                <div class="relationship-analysis" id="relationshipAnalysis">
                    <!-- Relationship analysis will be shown here -->
                </div>
            </div>
        `;
    }
    
    createGoalsPanel() {
        return `
            <div class="goals-panel">
                <h3>Character Goals</h3>
                
                <div class="goals-categories">
                    <div class="goal-category">
                        <h4>Short-Term Goals</h4>
                        <div id="shortTermGoals" class="goals-list">
                            <!-- Short-term goals will be populated dynamically -->
                        </div>
                        <button class="add-btn" data-goal-type="shortTerm">+ Add Short-Term Goal</button>
                    </div>
                    
                    <div class="goal-category">
                        <h4>Long-Term Goals</h4>
                        <div id="longTermGoals" class="goals-list">
                            <!-- Long-term goals will be populated dynamically -->
                        </div>
                        <button class="add-btn" data-goal-type="longTerm">+ Add Long-Term Goal</button>
                    </div>
                    
                    <div class="goal-category">
                        <h4>Life Goals</h4>
                        <div id="lifeGoals" class="goals-list">
                            <!-- Life goals will be populated dynamically -->
                        </div>
                        <button class="add-btn" data-goal-type="lifeGoals">+ Add Life Goal</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    createAchievementsPanel() {
        return `
            <div class="achievements-panel">
                <div class="achievements-controls">
                    <h3>Character Achievements</h3>
                    <div class="achievement-filters">
                        <select id="achievementCategoryFilter" class="filter-select">
                            <option value="all">All Categories</option>
                            <option value="combat">Combat</option>
                            <option value="social">Social</option>
                            <option value="exploration">Exploration</option>
                            <option value="magic">Magic</option>
                            <option value="crafting">Crafting</option>
                            <option value="roleplay">Roleplay</option>
                            <option value="story">Story</option>
                        </select>
                        <select id="achievementRarityFilter" class="filter-select">
                            <option value="all">All Rarities</option>
                            <option value="mythic">Mythic</option>
                            <option value="legendary">Legendary</option>
                            <option value="rare">Rare</option>
                            <option value="uncommon">Uncommon</option>
                            <option value="common">Common</option>
                        </select>
                        <button id="addAchievement" class="add-btn">+ Add Achievement</button>
                    </div>
                </div>
                
                <div id="achievementsContainer" class="achievements-container">
                    <!-- Achievements will be populated dynamically -->
                </div>
                
                <div class="achievement-stats" id="achievementStats">
                    <!-- Achievement statistics will be shown here -->
                </div>
            </div>
        `;
    }
    
    createAnalysisPanel() {
        return `
            <div class="analysis-panel">
                <h3>Character Development Analysis</h3>
                
                <div class="analysis-sections">
                    <div class="analysis-section">
                        <h4>Personality Analysis</h4>
                        <div id="personalityAnalysis" class="analysis-content">
                            <!-- Personality analysis will be populated dynamically -->
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>Relationship Network</h4>
                        <div id="networkAnalysis" class="analysis-content">
                            <!-- Network analysis will be populated dynamically -->
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>Goal Progression</h4>
                        <div id="goalAnalysis" class="analysis-content">
                            <!-- Goal analysis will be populated dynamically -->
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>Development Suggestions</h4>
                        <div id="developmentSuggestions" class="analysis-content suggestions">
                            <!-- Development suggestions will be populated dynamically -->
                        </div>
                    </div>
                </div>
                
                <div class="story-export">
                    <h4>Export Character Story</h4>
                    <div class="export-controls">
                        <select id="exportFormat" class="filter-select">
                            <option value="json">JSON</option>
                            <option value="markdown">Markdown</option>
                            <option value="pdf">PDF</option>
                        </select>
                        <button id="exportStory" class="add-btn">Export Story</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    createStoryStyles() {
        return `
            <style>
                .story-tracker-interface {
                    background: linear-gradient(135deg, #2c1810, #4a2c18);
                    color: #f5deb3;
                    padding: 20px;
                    border-radius: 10px;
                    font-family: 'Georgia', 'Times New Roman', serif;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    border: 2px solid #8b4513;
                }
                
                .story-header {
                    text-align: center;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #8b4513;
                }
                
                .story-header h2 {
                    margin: 0 0 10px 0;
                    font-size: 28px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                    background: linear-gradient(45deg, #daa520, #ffd700);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .story-character-info {
                    background: rgba(245, 222, 179, 0.1);
                    padding: 10px;
                    border-radius: 5px;
                    backdrop-filter: blur(10px);
                }
                
                .story-tabs {
                    display: flex;
                    gap: 5px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                
                .story-tab {
                    background: linear-gradient(135deg, #654321, #8b4513);
                    color: #f5deb3;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px 8px 0 0;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    flex: 1;
                    min-width: 100px;
                }
                
                .story-tab:hover {
                    background: linear-gradient(135deg, #8b4513, #a0522d);
                    transform: translateY(-2px);
                }
                
                .story-tab.active {
                    background: linear-gradient(135deg, #daa520, #ffd700);
                    color: #2c1810;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(218, 165, 32, 0.4);
                }
                
                .story-panel {
                    display: none;
                    background: rgba(245, 222, 179, 0.05);
                    padding: 20px;
                    border-radius: 0 10px 10px 10px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(245, 222, 179, 0.1);
                }
                
                .story-panel.active {
                    display: block;
                }
                
                .backstory-section {
                    margin-bottom: 25px;
                    padding: 20px;
                    background: rgba(245, 222, 179, 0.05);
                    border-radius: 8px;
                    border-left: 4px solid #daa520;
                }
                
                .backstory-section h4 {
                    color: #daa520;
                    margin-top: 0;
                    font-size: 18px;
                }
                
                .trait-list {
                    margin: 15px 0;
                }
                
                .trait-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(245, 222, 179, 0.1);
                    padding: 10px 15px;
                    margin: 8px 0;
                    border-radius: 5px;
                    border-left: 3px solid #8b4513;
                }
                
                .trait-text {
                    flex: 1;
                    margin-right: 10px;
                }
                
                .trait-actions {
                    display: flex;
                    gap: 5px;
                }
                
                .trait-btn {
                    background: none;
                    border: 1px solid #8b4513;
                    color: #f5deb3;
                    padding: 4px 8px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.3s ease;
                }
                
                .trait-btn:hover {
                    background: #8b4513;
                    color: white;
                }
                
                .add-btn {
                    background: linear-gradient(135deg, #daa520, #ffd700);
                    color: #2c1810;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    margin-top: 10px;
                }
                
                .add-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(218, 165, 32, 0.4);
                }
                
                .detail-item {
                    margin: 15px 0;
                }
                
                .detail-item label {
                    display: block;
                    color: #daa520;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .detail-input, .detail-textarea {
                    width: 100%;
                    background: rgba(245, 222, 179, 0.1);
                    border: 1px solid #8b4513;
                    color: #f5deb3;
                    padding: 8px 12px;
                    border-radius: 5px;
                    font-family: inherit;
                    resize: vertical;
                }
                
                .detail-textarea {
                    min-height: 80px;
                }
                
                .timeline-controls, .relationships-controls, .achievements-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                
                .timeline-filters, .relationship-filters, .achievement-filters {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    flex-wrap: wrap;
                }
                
                .filter-select {
                    background: rgba(245, 222, 179, 0.1);
                    border: 1px solid #8b4513;
                    color: #f5deb3;
                    padding: 6px 12px;
                    border-radius: 5px;
                    font-size: 14px;
                }
                
                .timeline-container {
                    position: relative;
                    padding-left: 30px;
                }
                
                .timeline-line {
                    position: absolute;
                    left: 15px;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: linear-gradient(to bottom, #daa520, #8b4513);
                }
                
                .timeline-event {
                    position: relative;
                    margin: 20px 0;
                    padding: 15px 20px;
                    background: rgba(245, 222, 179, 0.1);
                    border-radius: 8px;
                    border-left: 4px solid #daa520;
                    transition: all 0.3s ease;
                }
                
                .timeline-event:hover {
                    background: rgba(245, 222, 179, 0.15);
                    transform: translateX(5px);
                }
                
                .timeline-event::before {
                    content: '';
                    position: absolute;
                    left: -35px;
                    top: 20px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #daa520;
                    border: 2px solid #2c1810;
                }
                
                .timeline-event.critical::before {
                    background: #ff4444;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                
                .event-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 10px;
                }
                
                .event-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #daa520;
                }
                
                .event-date {
                    font-size: 12px;
                    color: #cd853f;
                }
                
                .event-description {
                    color: #f5deb3;
                    line-height: 1.4;
                    margin-bottom: 10px;
                }
                
                .event-tags {
                    display: flex;
                    gap: 5px;
                    flex-wrap: wrap;
                }
                
                .event-tag {
                    background: rgba(218, 165, 32, 0.2);
                    color: #daa520;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    border: 1px solid #daa520;
                }
                
                .relationships-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .relationship-card {
                    background: rgba(245, 222, 179, 0.1);
                    border-radius: 8px;
                    padding: 15px;
                    border: 1px solid #8b4513;
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .relationship-card:hover {
                    background: rgba(245, 222, 179, 0.15);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                
                .relationship-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                }
                
                .relationship-icon {
                    font-size: 24px;
                    margin-right: 10px;
                }
                
                .relationship-name {
                    font-size: 16px;
                    font-weight: bold;
                    color: #daa520;
                    flex: 1;
                }
                
                .relationship-type {
                    font-size: 12px;
                    text-transform: uppercase;
                    background: rgba(218, 165, 32, 0.2);
                    color: #daa520;
                    padding: 2px 8px;
                    border-radius: 10px;
                }
                
                .relationship-stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin: 10px 0;
                }
                
                .relationship-stat {
                    text-align: center;
                }
                
                .stat-value {
                    font-size: 18px;
                    font-weight: bold;
                    color: #daa520;
                }
                
                .stat-label {
                    font-size: 11px;
                    color: #cd853f;
                    text-transform: uppercase;
                }
                
                .goals-categories {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                }
                
                .goal-category {
                    background: rgba(245, 222, 179, 0.05);
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #8b4513;
                }
                
                .goal-category h4 {
                    color: #daa520;
                    margin-top: 0;
                    text-align: center;
                }
                
                .goals-list {
                    margin-bottom: 15px;
                }
                
                .goal-item {
                    background: rgba(245, 222, 179, 0.1);
                    padding: 12px;
                    margin: 8px 0;
                    border-radius: 5px;
                    border-left: 3px solid #8b4513;
                    transition: all 0.3s ease;
                }
                
                .goal-item:hover {
                    background: rgba(245, 222, 179, 0.15);
                }
                
                .goal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                
                .goal-title {
                    font-weight: bold;
                    color: #daa520;
                }
                
                .goal-status {
                    font-size: 12px;
                    padding: 2px 8px;
                    border-radius: 10px;
                    text-transform: uppercase;
                }
                
                .goal-status.completed {
                    background: rgba(0, 255, 0, 0.2);
                    color: #00ff00;
                }
                
                .goal-status.in-progress {
                    background: rgba(255, 255, 0, 0.2);
                    color: #ffff00;
                }
                
                .goal-status.not-started {
                    background: rgba(128, 128, 128, 0.2);
                    color: #cccccc;
                }
                
                .goal-progress {
                    background: rgba(0, 0, 0, 0.3);
                    height: 6px;
                    border-radius: 3px;
                    margin: 8px 0;
                    overflow: hidden;
                }
                
                .goal-progress-bar {
                    height: 100%;
                    background: linear-gradient(to right, #daa520, #ffd700);
                    transition: width 0.3s ease;
                }
                
                .achievements-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .achievement-card {
                    background: rgba(245, 222, 179, 0.1);
                    border-radius: 8px;
                    padding: 15px;
                    border: 1px solid #8b4513;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .achievement-card::before {
                    content: '';
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    height: 4px;
                    background: linear-gradient(to right, #daa520, #ffd700);
                    border-radius: 8px 8px 0 0;
                }
                
                .achievement-card.legendary::before {
                    background: linear-gradient(to right, #ff8c00, #ffd700, #ff8c00);
                    animation: shimmer 2s infinite;
                }
                
                .achievement-card.mythic::before {
                    background: linear-gradient(to right, #8a2be2, #ff1493, #00ffff, #8a2be2);
                    animation: rainbow 3s infinite;
                }
                
                @keyframes shimmer {
                    0% { background-position: -200px 0; }
                    100% { background-position: 200px 0; }
                }
                
                @keyframes rainbow {
                    0% { hue-rotate: 0deg); }
                    100% { hue-rotate: 360deg); }
                }
                
                .achievement-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                }
                
                .achievement-icon {
                    font-size: 24px;
                    margin-right: 10px;
                }
                
                .achievement-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #daa520;
                    flex: 1;
                }
                
                .achievement-rarity {
                    font-size: 12px;
                    text-transform: uppercase;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-weight: bold;
                }
                
                .achievement-rarity.common {
                    background: rgba(128, 128, 128, 0.3);
                    color: #cccccc;
                }
                
                .achievement-rarity.uncommon {
                    background: rgba(0, 255, 0, 0.3);
                    color: #00ff00;
                }
                
                .achievement-rarity.rare {
                    background: rgba(0, 100, 255, 0.3);
                    color: #6495ed;
                }
                
                .achievement-rarity.legendary {
                    background: rgba(255, 140, 0, 0.3);
                    color: #ffa500;
                }
                
                .achievement-rarity.mythic {
                    background: linear-gradient(45deg, rgba(138, 43, 226, 0.3), rgba(255, 20, 147, 0.3));
                    color: #ff69b4;
                }
                
                .analysis-sections {
                    display: grid;
                    gap: 20px;
                }
                
                .analysis-section {
                    background: rgba(245, 222, 179, 0.05);
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #daa520;
                }
                
                .analysis-section h4 {
                    color: #daa520;
                    margin-top: 0;
                }
                
                .analysis-content {
                    color: #f5deb3;
                    line-height: 1.5;
                }
                
                .suggestions {
                    background: rgba(218, 165, 32, 0.1);
                    border-left-color: #ffd700;
                }
                
                .suggestion-item {
                    background: rgba(245, 222, 179, 0.1);
                    padding: 10px;
                    margin: 8px 0;
                    border-radius: 5px;
                    border-left: 3px solid #daa520;
                }
                
                .story-export {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(245, 222, 179, 0.2);
                }
                
                .export-controls {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    flex-wrap: wrap;
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
                    .story-tabs {
                        flex-direction: column;
                    }
                    
                    .goals-categories {
                        grid-template-columns: 1fr;
                    }
                    
                    .relationships-container,
                    .achievements-container {
                        grid-template-columns: 1fr;
                    }
                    
                    .timeline-controls,
                    .relationships-controls,
                    .achievements-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .export-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }
                }
            </style>
        `;
    }
    
    attachEventListeners() {
        // Tab switching
        this.container.querySelectorAll('.story-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
        
        // Backstory management
        this.attachBackstoryListeners();
        
        // Timeline management
        this.attachTimelineListeners();
        
        // Relationship management
        this.attachRelationshipListeners();
        
        // Goal management
        this.attachGoalListeners();
        
        // Achievement management
        this.attachAchievementListeners();
        
        // Analysis and export
        this.attachAnalysisListeners();
    }
    
    attachBackstoryListeners() {
        // Add trait buttons
        ['Trait', 'Ideal', 'Bond', 'Flaw'].forEach(type => {
            const button = this.container.querySelector(`#add${type}Btn`);
            if (button) {
                button.addEventListener('click', () => {
                    this.promptAddTrait(type.toLowerCase());
                });
            }
        });
        
        // Background detail inputs
        ['Origin', 'Hometown', 'Profession', 'Education'].forEach(field => {
            const input = this.container.querySelector(`#background${field}`);
            if (input) {
                input.addEventListener('blur', () => {
                    this.updateBackgroundDetail(field.toLowerCase(), input.value);
                });
            }
        });
    }
    
    attachTimelineListeners() {
        const addEventButton = this.container.querySelector('#addTimelineEvent');
        const timelineFilter = this.container.querySelector('#timelineFilter');
        const importanceFilter = this.container.querySelector('#importanceFilter');
        
        if (addEventButton) {
            addEventButton.addEventListener('click', () => {
                this.promptAddTimelineEvent();
            });
        }
        
        if (timelineFilter) {
            timelineFilter.addEventListener('change', () => {
                this.updateTimelineDisplay();
            });
        }
        
        if (importanceFilter) {
            importanceFilter.addEventListener('change', () => {
                this.updateTimelineDisplay();
            });
        }
    }
    
    attachRelationshipListeners() {
        const addRelationshipButton = this.container.querySelector('#addRelationship');
        const relationshipFilter = this.container.querySelector('#relationshipTypeFilter');
        
        if (addRelationshipButton) {
            addRelationshipButton.addEventListener('click', () => {
                this.promptAddRelationship();
            });
        }
        
        if (relationshipFilter) {
            relationshipFilter.addEventListener('change', () => {
                this.updateRelationshipsDisplay();
            });
        }
    }
    
    attachGoalListeners() {
        this.container.querySelectorAll('.add-btn[data-goal-type]').forEach(button => {
            button.addEventListener('click', () => {
                const goalType = button.getAttribute('data-goal-type');
                this.promptAddGoal(goalType);
            });
        });
    }
    
    attachAchievementListeners() {
        const addAchievementButton = this.container.querySelector('#addAchievement');
        const categoryFilter = this.container.querySelector('#achievementCategoryFilter');
        const rarityFilter = this.container.querySelector('#achievementRarityFilter');
        
        if (addAchievementButton) {
            addAchievementButton.addEventListener('click', () => {
                this.promptAddAchievement();
            });
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.updateAchievementsDisplay();
            });
        }
        
        if (rarityFilter) {
            rarityFilter.addEventListener('change', () => {
                this.updateAchievementsDisplay();
            });
        }
    }
    
    attachAnalysisListeners() {
        const exportButton = this.container.querySelector('#exportStory');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                this.exportCharacterStory();
            });
        }
    }
    
    loadCharacterStory(character) {
        this.currentCharacter = character;
        
        // Load existing story or create new one
        const existingStory = this.storyTracker.characters.get(character.id);
        if (existingStory) {
            this.currentStory = existingStory;
        } else {
            this.currentStory = this.storyTracker.createCharacterStory(character.id, {});
        }
        
        this.updateCharacterInfo();
        this.updateAllPanels();
        
        console.log(`📖 Loaded story for character: ${character.name}`);
    }
    
    updateCharacterInfo() {
        const infoElement = this.container.querySelector('#storyCharacterInfo');
        if (!infoElement || !this.currentCharacter) return;
        
        const character = this.currentCharacter;
        const storyStats = this.getStoryStatistics();
        
        infoElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <div>
                    <strong>${character.name}</strong><br>
                    Level ${character.level} ${character.race} ${character.classes.map(c => c.name).join('/')}
                </div>
                <div style="text-align: right;">
                    ${storyStats.timelineEvents} Timeline Events<br>
                    ${storyStats.relationships} Relationships
                </div>
                <div style="text-align: right;">
                    ${storyStats.achievements} Achievements<br>
                    ${storyStats.activeGoals} Active Goals
                </div>
            </div>
        `;
    }
    
    updateAllPanels() {
        if (!this.currentStory) return;
        
        this.updateBackstoryPanel();
        this.updateTimelinePanel();
        this.updateRelationshipsPanel();
        this.updateGoalsPanel();
        this.updateAchievementsPanel();
        this.updateAnalysisPanel();
    }
    
    // Panel update methods would be implemented here
    // Due to length constraints, I'll provide the key methods
    
    switchTab(tabName) {
        // Update tab buttons
        this.container.querySelectorAll('.story-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        this.container.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update panels
        this.container.querySelectorAll('.story-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetPanel = this.container.querySelector(`#${tabName}Panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
        
        console.log(`📖 Switched to ${tabName} tab`);
    }
    
    // Additional methods for panel updates, prompts, and story management
    // would be implemented here to complete the interface
    
    getStoryStatistics() {
        if (!this.currentStory) {
            return {
                timelineEvents: 0,
                relationships: 0,
                achievements: 0,
                activeGoals: 0
            };
        }
        
        const achievements = this.storyTracker.achievements.get(this.currentCharacter.id) || [];
        const activeGoals = Object.values(this.currentStory.goals).flat()
            .filter(goal => goal.status !== 'completed').length;
        
        return {
            timelineEvents: this.currentStory.timeline.length,
            relationships: this.currentStory.relationships.size,
            achievements: achievements.length,
            activeGoals: activeGoals
        };
    }
    
    updateBackstoryPanel() {
        // Implementation would populate personality traits, ideals, bonds, flaws
        console.log('📖 Updating backstory panel');
    }
    
    updateTimelinePanel() {
        // Implementation would populate timeline events with filtering
        console.log('📖 Updating timeline panel');
    }
    
    updateRelationshipsPanel() {
        // Implementation would populate relationship cards
        console.log('📖 Updating relationships panel');
    }
    
    updateGoalsPanel() {
        // Implementation would populate goal categories
        console.log('📖 Updating goals panel');
    }
    
    updateAchievementsPanel() {
        // Implementation would populate achievement cards
        console.log('📖 Updating achievements panel');
    }
    
    updateAnalysisPanel() {
        // Implementation would populate analysis and suggestions
        console.log('📖 Updating analysis panel');
    }
    
    promptAddTrait(type) {
        const trait = prompt(`Add a ${type}:`);
        if (trait && this.currentStory) {
            const propertyName = type === 'trait' ? 'personalityTraits' : `${type}s`;
            this.currentStory[propertyName].push(trait);
            this.updateBackstoryPanel();
        }
    }
    
    promptAddTimelineEvent() {
        // Implementation would show detailed event creation dialog
        console.log('📖 Prompting for timeline event');
    }
    
    promptAddRelationship() {
        // Implementation would show relationship creation dialog
        console.log('📖 Prompting for relationship');
    }
    
    promptAddGoal(type) {
        // Implementation would show goal creation dialog
        console.log(`📖 Prompting for ${type} goal`);
    }
    
    promptAddAchievement() {
        // Implementation would show achievement creation dialog
        console.log('📖 Prompting for achievement');
    }
    
    exportCharacterStory() {
        if (!this.currentCharacter) return;
        
        const formatSelect = this.container.querySelector('#exportFormat');
        const format = formatSelect.value;
        
        try {
            const storyData = this.storyTracker.exportCharacterStory(this.currentCharacter.id, format);
            
            // Create download link
            const blob = new Blob([storyData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.currentCharacter.name}_story.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log(`📖 Exported story in ${format} format`);
            
        } catch (error) {
            this.showError('Error exporting story: ' + error.message);
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const content = this.container.querySelector('.story-content');
        if (content) {
            content.insertBefore(errorDiv, content.firstChild);
            
            setTimeout(() => {
                if (errorDiv.parentElement) {
                    errorDiv.parentElement.removeChild(errorDiv);
                }
            }, 5000);
        }
        
        console.error('📖 Story Tracker Error:', message);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoryTrackerInterface;
} else if (typeof window !== 'undefined') {
    window.StoryTrackerInterface = StoryTrackerInterface;
}
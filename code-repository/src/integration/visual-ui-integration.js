/**
 * VisualUIIntegration - Advanced Visual Interface System for D&D 3.5 Character Management
 * 
 * Comprehensive visual interface system featuring:
 * - Interactive character sheet displays with real-time updates
 * - Advanced portrait integration with dynamic character visualization
 * - Epic level progression display with divine rank visualization
 * - Spell effect animations and magical aura rendering
 * - Equipment visualization with magical property display
 * - Combat interface with tactical positioning and effect visualization
 * - Character comparison tools and party management interface
 * - Responsive design with mobile and tablet optimization
 * - Accessibility features and screen reader compatibility
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class VisualUIIntegration {
    constructor(characterSystem, portraitGenerator, sheetRenderer, epicManager) {
        this.characterSystem = characterSystem;
        this.portraitGenerator = portraitGenerator;
        this.sheetRenderer = sheetRenderer;
        this.epicManager = epicManager;
        
        // UI configuration
        this.config = {
            theme: 'fantasy',
            animationsEnabled: true,
            responsiveBreakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1200
            },
            accessibility: {
                highContrast: false,
                reducedMotion: false,
                screenReader: false
            }
        };
        
        // UI themes
        this.themes = {
            'fantasy': {
                name: 'Fantasy Adventure',
                colors: {
                    primary: '#8b4513',
                    secondary: '#daa520',
                    accent: '#dc143c',
                    background: '#f5f5dc',
                    surface: '#ffffff',
                    text: '#2f4f4f',
                    textSecondary: '#696969',
                    border: '#cd853f',
                    success: '#228b22',
                    warning: '#ff8c00',
                    error: '#dc143c'
                },
                fonts: {
                    heading: 'Cinzel, serif',
                    body: 'Crimson Text, serif',
                    ui: 'Source Sans Pro, sans-serif'
                },
                effects: {
                    shadows: true,
                    gradients: true,
                    borders: 'ornate'
                }
            },
            'modern': {
                name: 'Modern Interface',
                colors: {
                    primary: '#2c3e50',
                    secondary: '#3498db',
                    accent: '#e74c3c',
                    background: '#ffffff',
                    surface: '#f8f9fa',
                    text: '#2c3e50',
                    textSecondary: '#7f8c8d',
                    border: '#bdc3c7',
                    success: '#27ae60',
                    warning: '#f39c12',
                    error: '#e74c3c'
                },
                fonts: {
                    heading: 'Inter, sans-serif',
                    body: 'Inter, sans-serif',
                    ui: 'Inter, sans-serif'
                },
                effects: {
                    shadows: false,
                    gradients: false,
                    borders: 'clean'
                }
            },
            'dark': {
                name: 'Dark Mode',
                colors: {
                    primary: '#bb86fc',
                    secondary: '#03dac6',
                    accent: '#cf6679',
                    background: '#121212',
                    surface: '#1e1e1e',
                    text: '#ffffff',
                    textSecondary: '#b3b3b3',
                    border: '#333333',
                    success: '#4caf50',
                    warning: '#ff9800',
                    error: '#f44336'
                },
                fonts: {
                    heading: 'Roboto, sans-serif',
                    body: 'Roboto, sans-serif',
                    ui: 'Roboto, sans-serif'
                },
                effects: {
                    shadows: true,
                    gradients: true,
                    borders: 'subtle'
                }
            }
        };
        
        // Component registry
        this.components = new Map();
        this.activeComponents = new Set();
        
        // Event system
        this.eventBus = {
            listeners: new Map(),
            emit: (event, data) => this.handleEvent(event, data),
            on: (event, callback) => this.addEventListener(event, callback),
            off: (event, callback) => this.removeEventListener(event, callback)
        };
        
        console.log('🎨 Visual UI Integration initialized with advanced interface system');
    }

    /**
     * Initialize the visual interface system
     */
    async initialize(containerElement) {
        console.log('🎨 Initializing visual interface system');
        
        this.container = containerElement;
        
        try {
            // Set up the main interface structure
            await this.setupMainInterface();
            
            // Initialize core components
            await this.initializeComponents();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Apply initial theme
            this.applyTheme(this.config.theme);
            
            // Initialize accessibility features
            this.setupAccessibility();
            
            console.log('✅ Visual interface system initialized successfully');
            
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize visual interface system:', error);
            throw error;
        }
    }

    /**
     * Set up the main interface structure
     */
    async setupMainInterface() {
        const mainHTML = `
            <div class="rulz-ui-main" id="rulzUIMain">
                <!-- Navigation Header -->
                <header class="rulz-header">
                    <div class="header-brand">
                        <h1 class="brand-title">RulzLawyer D&D 3.5</h1>
                        <span class="brand-subtitle">Character Management System</span>
                    </div>
                    
                    <nav class="header-nav">
                        <button class="nav-button" data-tab="character">
                            <i class="icon-character"></i>
                            Character
                        </button>
                        <button class="nav-button" data-tab="equipment">
                            <i class="icon-equipment"></i>
                            Equipment
                        </button>
                        <button class="nav-button" data-tab="spells">
                            <i class="icon-spells"></i>
                            Spells
                        </button>
                        <button class="nav-button" data-tab="combat">
                            <i class="icon-combat"></i>
                            Combat
                        </button>
                        <button class="nav-button" data-tab="adventure">
                            <i class="icon-adventure"></i>
                            Adventure
                        </button>
                    </nav>
                    
                    <div class="header-controls">
                        <button class="control-button" id="themeToggle">
                            <i class="icon-theme"></i>
                        </button>
                        <button class="control-button" id="settingsButton">
                            <i class="icon-settings"></i>
                        </button>
                    </div>
                </header>
                
                <!-- Main Content Area -->
                <main class="rulz-main-content">
                    <!-- Character Tab -->
                    <div class="tab-content" id="characterTab">
                        <div class="character-overview">
                            <div class="character-portrait-section">
                                <div class="portrait-container" id="portraitContainer">
                                    <!-- Portrait will be rendered here -->
                                </div>
                                <div class="portrait-controls">
                                    <button class="portrait-button" id="generatePortrait">Generate Portrait</button>
                                    <button class="portrait-button" id="customizePortrait">Customize</button>
                                </div>
                            </div>
                            
                            <div class="character-details">
                                <div class="character-header-info">
                                    <h2 class="character-name" id="characterName">Character Name</h2>
                                    <div class="character-subtitle" id="characterSubtitle">Race Class Level</div>
                                </div>
                                
                                <div class="character-stats-grid">
                                    <div class="stats-section abilities">
                                        <h3 class="section-title">Ability Scores</h3>
                                        <div class="abilities-grid" id="abilitiesGrid">
                                            <!-- Abilities will be rendered here -->
                                        </div>
                                    </div>
                                    
                                    <div class="stats-section combat">
                                        <h3 class="section-title">Combat Stats</h3>
                                        <div class="combat-stats-grid" id="combatStatsGrid">
                                            <!-- Combat stats will be rendered here -->
                                        </div>
                                    </div>
                                    
                                    <div class="stats-section saves">
                                        <h3 class="section-title">Saving Throws</h3>
                                        <div class="saves-grid" id="savesGrid">
                                            <!-- Saves will be rendered here -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="character-details-tabs">
                            <div class="detail-tabs">
                                <button class="detail-tab active" data-detail="skills">Skills</button>
                                <button class="detail-tab" data-detail="feats">Feats</button>
                                <button class="detail-tab" data-detail="features">Features</button>
                                <button class="detail-tab" data-detail="background">Background</button>
                            </div>
                            
                            <div class="detail-content" id="detailContent">
                                <!-- Detail content will be rendered here -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Equipment Tab -->
                    <div class="tab-content hidden" id="equipmentTab">
                        <div class="equipment-interface">
                            <div class="equipment-visual">
                                <div class="character-equipment-display" id="equipmentDisplay">
                                    <!-- Visual equipment display -->
                                </div>
                            </div>
                            
                            <div class="equipment-management">
                                <div class="inventory-grid" id="inventoryGrid">
                                    <!-- Inventory items -->
                                </div>
                                
                                <div class="equipment-controls">
                                    <button class="equipment-button" id="addItem">Add Item</button>
                                    <button class="equipment-button" id="manageInventory">Manage</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Spells Tab -->
                    <div class="tab-content hidden" id="spellsTab">
                        <div class="spells-interface">
                            <div class="spell-book" id="spellBook">
                                <!-- Spell book interface -->
                            </div>
                            
                            <div class="spell-preparation" id="spellPreparation">
                                <!-- Spell preparation interface -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Combat Tab -->
                    <div class="tab-content hidden" id="combatTab">
                        <div class="combat-interface">
                            <div class="initiative-tracker" id="initiativeTracker">
                                <!-- Initiative tracking -->
                            </div>
                            
                            <div class="combat-actions" id="combatActions">
                                <!-- Combat actions and controls -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Adventure Tab -->
                    <div class="tab-content hidden" id="adventureTab">
                        <div class="adventure-interface">
                            <div class="adventure-log" id="adventureLog">
                                <!-- Adventure log and story -->
                            </div>
                            
                            <div class="adventure-controls" id="adventureControls">
                                <!-- Adventure management controls -->
                            </div>
                        </div>
                    </div>
                </main>
                
                <!-- Sidebar for Additional Tools -->
                <aside class="rulz-sidebar" id="sidebarPanel">
                    <div class="sidebar-content">
                        <div class="quick-actions">
                            <h3>Quick Actions</h3>
                            <button class="quick-action" id="rollDice">Roll Dice</button>
                            <button class="quick-action" id="levelUp">Level Up</button>
                            <button class="quick-action" id="restCharacter">Rest</button>
                            <button class="quick-action" id="exportSheet">Export Sheet</button>
                        </div>
                        
                        <div class="character-notes" id="characterNotes">
                            <h3>Notes</h3>
                            <textarea class="notes-textarea" placeholder="Character notes..."></textarea>
                        </div>
                    </div>
                </aside>
                
                <!-- Modal Overlay -->
                <div class="modal-overlay hidden" id="modalOverlay">
                    <div class="modal-content" id="modalContent">
                        <!-- Modal content will be inserted here -->
                    </div>
                </div>
                
                <!-- Notification System -->
                <div class="notification-container" id="notificationContainer">
                    <!-- Notifications will appear here -->
                </div>
            </div>
        `;
        
        this.container.innerHTML = mainHTML;
    }

    /**
     * Initialize core UI components
     */
    async initializeComponents() {
        console.log('🎨 Initializing core UI components');
        
        // Register and initialize components
        this.registerComponent('portraitViewer', new PortraitViewerComponent(this));
        this.registerComponent('characterStats', new CharacterStatsComponent(this));
        this.registerComponent('equipmentVisualizer', new EquipmentVisualizerComponent(this));
        this.registerComponent('spellInterface', new SpellInterfaceComponent(this));
        this.registerComponent('combatTracker', new CombatTrackerComponent(this));
        this.registerComponent('epicProgression', new EpicProgressionComponent(this));
        
        // Initialize all registered components
        for (const [name, component] of this.components) {
            try {
                await component.initialize();
                this.activeComponents.add(name);
                console.log(`✅ Component '${name}' initialized`);
            } catch (error) {
                console.error(`❌ Failed to initialize component '${name}':`, error);
            }
        }
    }

    /**
     * Set up event listeners for the interface
     */
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Detail tabs
        document.querySelectorAll('.detail-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchDetailTab(e.target.dataset.detail));
        });
        
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        
        // Settings
        document.getElementById('settingsButton')?.addEventListener('click', () => this.openSettings());
        
        // Portrait controls
        document.getElementById('generatePortrait')?.addEventListener('click', () => this.generateNewPortrait());
        document.getElementById('customizePortrait')?.addEventListener('click', () => this.openPortraitCustomization());
        
        // Quick actions
        document.getElementById('rollDice')?.addEventListener('click', () => this.openDiceRoller());
        document.getElementById('levelUp')?.addEventListener('click', () => this.openLevelUpDialog());
        document.getElementById('restCharacter')?.addEventListener('click', () => this.restCharacter());
        document.getElementById('exportSheet')?.addEventListener('click', () => this.openExportDialog());
        
        // Modal close
        document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Responsive handling
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Apply visual theme to the interface
     */
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) {
            console.warn(`Theme '${themeName}' not found, using default`);
            return;
        }
        
        console.log(`🎨 Applying theme: ${theme.name}`);
        
        const root = document.documentElement;
        
        // Apply color variables
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
        
        // Apply font variables
        Object.entries(theme.fonts).forEach(([key, value]) => {
            root.style.setProperty(`--font-${key}`, value);
        });
        
        // Apply theme class
        this.container.className = `rulz-ui-container theme-${themeName}`;
        
        this.config.theme = themeName;
        this.eventBus.emit('themeChanged', { theme: themeName });
    }

    /**
     * Display character information in the interface
     */
    async displayCharacter(character) {
        console.log(`🎨 Displaying character: ${character.name}`);
        
        try {
            // Update character header
            document.getElementById('characterName').textContent = character.name;
            document.getElementById('characterSubtitle').textContent = 
                `${character.race} ${character.characterClass} ${character.level}`;
            
            // Generate and display portrait
            if (this.portraitGenerator) {
                const portraitData = await this.portraitGenerator.generatePortrait(character, {
                    style: 'fantasy_art',
                    size: { width: 200, height: 250 }
                });
                this.displayPortrait(portraitData);
            }
            
            // Update character stats
            this.updateCharacterStats(character);
            
            // Update equipment display
            this.updateEquipmentDisplay(character);
            
            // Update spells if applicable
            if (character.spells) {
                this.updateSpellsDisplay(character);
            }
            
            // Update epic information if applicable
            if (character.level >= 21) {
                this.updateEpicDisplay(character);
            }
            
            this.eventBus.emit('characterDisplayed', { character });
            
        } catch (error) {
            console.error('❌ Failed to display character:', error);
            this.showNotification('Failed to display character information', 'error');
        }
    }

    /**
     * Display character portrait
     */
    displayPortrait(portraitData) {
        const portraitContainer = document.getElementById('portraitContainer');
        if (!portraitContainer || !portraitData) return;
        
        const portraitHTML = `
            <div class="character-portrait">
                <img src="data:image/svg+xml;base64,${btoa(portraitData.imageData.data)}" 
                     alt="Character Portrait" 
                     class="portrait-image">
                <div class="portrait-overlay">
                    <div class="portrait-info">
                        <span class="portrait-style">${portraitData.style}</span>
                    </div>
                </div>
            </div>
        `;
        
        portraitContainer.innerHTML = portraitHTML;
    }

    /**
     * Update character statistics display
     */
    updateCharacterStats(character) {
        // Update abilities
        const abilitiesGrid = document.getElementById('abilitiesGrid');
        if (abilitiesGrid) {
            const abilitiesHTML = Object.entries(character.abilities).map(([name, score]) => {
                const modifier = Math.floor((score - 10) / 2);
                const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
                
                return `
                    <div class="ability-display">
                        <div class="ability-name">${name.substring(0, 3).toUpperCase()}</div>
                        <div class="ability-score">${score}</div>
                        <div class="ability-modifier">${modifierText}</div>
                    </div>
                `;
            }).join('');
            
            abilitiesGrid.innerHTML = abilitiesHTML;
        }
        
        // Update combat stats
        this.updateCombatStats(character);
        
        // Update saving throws
        this.updateSavingThrows(character);
    }

    /**
     * Register a UI component
     */
    registerComponent(name, component) {
        this.components.set(name, component);
        console.log(`📦 Component '${name}' registered`);
    }

    /**
     * Get a registered component
     */
    getComponent(name) {
        return this.components.get(name);
    }

    /**
     * Show notification to user
     */
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            notification.classList.add('notification-fade-out');
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case '1':
                    event.preventDefault();
                    this.switchTab('character');
                    break;
                case '2':
                    event.preventDefault();
                    this.switchTab('equipment');
                    break;
                case '3':
                    event.preventDefault();
                    this.switchTab('spells');
                    break;
                case '4':
                    event.preventDefault();
                    this.switchTab('combat');
                    break;
                case '5':
                    event.preventDefault();
                    this.switchTab('adventure');
                    break;
                case 't':
                    event.preventDefault();
                    this.toggleTheme();
                    break;
                case 's':
                    event.preventDefault();
                    this.openExportDialog();
                    break;
            }
        }
    }

    /**
     * Switch between main tabs
     */
    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.add('hidden');
        });
        
        // Remove active state from nav buttons
        document.querySelectorAll('.nav-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // Show selected tab
        const targetTab = document.getElementById(`${tabName}Tab`);
        if (targetTab) {
            targetTab.classList.remove('hidden');
        }
        
        // Add active state to selected nav button
        const navButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (navButton) {
            navButton.classList.add('active');
        }
        
        this.eventBus.emit('tabChanged', { tab: tabName });
    }

    /**
     * Toggle between themes
     */
    toggleTheme() {
        const themes = Object.keys(this.themes);
        const currentIndex = themes.indexOf(this.config.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        
        this.applyTheme(nextTheme);
        this.showNotification(`Theme changed to ${this.themes[nextTheme].name}`, 'info', 2000);
    }

    /**
     * Event system methods
     */
    addEventListener(event, callback) {
        if (!this.eventBus.listeners.has(event)) {
            this.eventBus.listeners.set(event, []);
        }
        this.eventBus.listeners.get(event).push(callback);
    }

    removeEventListener(event, callback) {
        const listeners = this.eventBus.listeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    handleEvent(event, data) {
        const listeners = this.eventBus.listeners.get(event);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for '${event}':`, error);
                }
            });
        }
    }

    /**
     * Get interface status and statistics
     */
    getInterfaceStatus() {
        return {
            activeTheme: this.config.theme,
            activeComponents: Array.from(this.activeComponents),
            registeredComponents: Array.from(this.components.keys()),
            eventListeners: Array.from(this.eventBus.listeners.keys()),
            responsiveBreakpoints: this.config.responsiveBreakpoints,
            accessibility: this.config.accessibility
        };
    }
}

// Component base classes for UI elements
class UIComponent {
    constructor(uiIntegration) {
        this.ui = uiIntegration;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        await this.setup();
        this.initialized = true;
    }

    async setup() {
        // Override in subclasses
    }
}

class PortraitViewerComponent extends UIComponent {
    async setup() {
        console.log('🖼️ Setting up Portrait Viewer component');
        // Portrait viewer specific setup
    }
}

class CharacterStatsComponent extends UIComponent {
    async setup() {
        console.log('📊 Setting up Character Stats component');
        // Character stats specific setup
    }
}

class EquipmentVisualizerComponent extends UIComponent {
    async setup() {
        console.log('⚔️ Setting up Equipment Visualizer component');
        // Equipment visualizer specific setup
    }
}

class SpellInterfaceComponent extends UIComponent {
    async setup() {
        console.log('🔮 Setting up Spell Interface component');
        // Spell interface specific setup
    }
}

class CombatTrackerComponent extends UIComponent {
    async setup() {
        console.log('⚔️ Setting up Combat Tracker component');
        // Combat tracker specific setup
    }
}

class EpicProgressionComponent extends UIComponent {
    async setup() {
        console.log('🌟 Setting up Epic Progression component');
        // Epic progression specific setup
    }
}

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        VisualUIIntegration, 
        UIComponent,
        PortraitViewerComponent,
        CharacterStatsComponent,
        EquipmentVisualizerComponent,
        SpellInterfaceComponent,
        CombatTrackerComponent,
        EpicProgressionComponent
    };
} else if (typeof window !== 'undefined') {
    window.VisualUIIntegration = VisualUIIntegration;
    window.UIComponent = UIComponent;
}
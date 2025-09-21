/**
 * Modern Gaming Interface UI System
 * Advanced user interface implementation with responsive layouts, 
 * interactive components, and comprehensive gaming-focused features
 * 
 * Features:
 * - Responsive grid layouts
 * - Interactive card components
 * - Modal dialog system
 * - Tabbed interfaces
 * - Progressive disclosure
 * - Gaming-optimized controls
 * - Real-time updates
 * - Drag and drop support
 * - Context menus
 * - Tooltip system
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class ModernGamingInterfaceUI {
    constructor(gamingInterface, options = {}) {
        this.gamingInterface = gamingInterface;
        this.container = gamingInterface.container;
        
        this.options = {
            enableDragDrop: options.enableDragDrop !== false,
            enableContextMenus: options.enableContextMenus !== false,
            enableTooltips: options.enableTooltips !== false,
            enableModals: options.enableModals !== false,
            enableNotifications: options.enableNotifications !== false,
            enableProgressBars: options.enableProgressBars !== false,
            animationDuration: options.animationDuration || 300,
            ...options
        };
        
        this.components = new Map();
        this.modals = new Map();
        this.tooltips = new Map();
        this.notifications = [];
        this.contextMenus = new Map();
        
        this.initialize();
        
        console.log('🎮 Modern Gaming Interface UI initialized');
    }
    
    initialize() {
        this.createUIComponents();
        this.setupEventHandlers();
        this.injectUIStyles();
        
        // Initialize component systems
        if (this.options.enableTooltips) this.initializeTooltipSystem();
        if (this.options.enableModals) this.initializeModalSystem();
        if (this.options.enableNotifications) this.initializeNotificationSystem();
        if (this.options.enableDragDrop) this.initializeDragDropSystem();
        if (this.options.enableContextMenus) this.initializeContextMenuSystem();
        
        console.log('🎮 UI component systems ready');
    }
    
    createUIComponents() {
        // Create main layout structure
        const mainLayout = this.createElement('div', {
            id: 'main-content',
            className: 'main-layout',
            'aria-label': 'Main application content'
        });
        
        // Create navigation area
        const navigation = this.createNavigationComponent();
        
        // Create content areas
        const contentAreas = this.createContentAreas();
        
        // Create sidebar
        const sidebar = this.createSidebarComponent();
        
        // Create footer
        const footer = this.createFooterComponent();
        
        // Assemble layout
        mainLayout.appendChild(navigation);
        mainLayout.appendChild(contentAreas);
        mainLayout.appendChild(sidebar);
        mainLayout.appendChild(footer);
        
        this.container.appendChild(mainLayout);
        
        // Store references
        this.mainLayout = mainLayout;
        this.navigation = navigation;
        this.contentAreas = contentAreas;
        this.sidebar = sidebar;
        this.footer = footer;
    }
    
    createNavigationComponent() {
        const nav = this.createElement('nav', {
            id: 'navigation',
            className: 'main-navigation',
            'aria-label': 'Main navigation'
        });
        
        const navItems = [
            { id: 'character', label: 'Character', icon: '👤', shortcut: 'C' },
            { id: 'equipment', label: 'Equipment', icon: '⚔️', shortcut: 'E' },
            { id: 'spells', label: 'Spells', icon: '✨', shortcut: 'S' },
            { id: 'adventure', label: 'Adventure', icon: '🗺️', shortcut: 'A' },
            { id: 'dice', label: 'Dice', icon: '🎲', shortcut: 'D' },
            { id: 'portrait', label: 'Portrait', icon: '🖼️', shortcut: 'P' },
            { id: 'story', label: 'Story', icon: '📖', shortcut: 'T' },
            { id: 'export', label: 'Export', icon: '💾', shortcut: 'X' }
        ];
        
        const navList = this.createElement('ul', {
            className: 'nav-list',
            role: 'tablist'
        });
        
        navItems.forEach((item, index) => {
            const listItem = this.createElement('li', {
                className: 'nav-item',
                role: 'presentation'
            });
            
            const button = this.createElement('button', {
                id: `nav-${item.id}`,
                className: 'nav-button',
                type: 'button',
                role: 'tab',
                'aria-selected': index === 0 ? 'true' : 'false',
                'aria-controls': `panel-${item.id}`,
                'data-shortcut': item.shortcut,
                title: `${item.label} (Alt+${item.shortcut})`
            });
            
            button.innerHTML = `
                <span class="nav-icon" aria-hidden="true">${item.icon}</span>
                <span class="nav-label">${item.label}</span>
                <span class="nav-shortcut sr-only">Alt+${item.shortcut}</span>
            `;
            
            listItem.appendChild(button);
            navList.appendChild(listItem);
            
            // Register keyboard shortcut
            this.gamingInterface.registerShortcut(
                `Alt+${item.shortcut}`, 
                () => this.switchToPanel(item.id),
                `Switch to ${item.label}`
            );
        });
        
        nav.appendChild(navList);
        return nav;
    }
    
    createContentAreas() {
        const contentContainer = this.createElement('main', {
            className: 'content-container',
            'aria-live': 'polite'
        });
        
        // Create panels for each navigation item
        const panels = [
            'character', 'equipment', 'spells', 'adventure', 
            'dice', 'portrait', 'story', 'export'
        ];
        
        panels.forEach((panelId, index) => {
            const panel = this.createPanel(panelId, index === 0);
            contentContainer.appendChild(panel);
        });
        
        return contentContainer;
    }
    
    createPanel(id, isActive = false) {
        const panel = this.createElement('div', {
            id: `panel-${id}`,
            className: `content-panel ${isActive ? 'active' : ''}`,
            role: 'tabpanel',
            'aria-labelledby': `nav-${id}`,
            'aria-hidden': isActive ? 'false' : 'true'
        });
        
        // Create panel-specific content
        switch (id) {
            case 'character':
                panel.appendChild(this.createCharacterPanel());
                break;
            case 'equipment':
                panel.appendChild(this.createEquipmentPanel());
                break;
            case 'spells':
                panel.appendChild(this.createSpellsPanel());
                break;
            case 'adventure':
                panel.appendChild(this.createAdventurePanel());
                break;
            case 'dice':
                panel.appendChild(this.createDicePanel());
                break;
            case 'portrait':
                panel.appendChild(this.createPortraitPanel());
                break;
            case 'story':
                panel.appendChild(this.createStoryPanel());
                break;
            case 'export':
                panel.appendChild(this.createExportPanel());
                break;
        }
        
        return panel;
    }
    
    createCharacterPanel() {
        const panel = this.createElement('div', { className: 'character-panel' });
        
        // Character overview card
        const overviewCard = this.createCard({
            title: 'Character Overview',
            className: 'character-overview-card',
            collapsible: true
        });
        
        overviewCard.appendChild(this.createCharacterOverview());
        
        // Ability scores section
        const abilityCard = this.createCard({
            title: 'Ability Scores',
            className: 'ability-scores-card'
        });
        
        abilityCard.appendChild(this.createAbilityScoresGrid());
        
        // Skills section
        const skillsCard = this.createCard({
            title: 'Skills',
            className: 'skills-card',
            collapsible: true
        });
        
        skillsCard.appendChild(this.createSkillsList());
        
        // Class features section
        const featuresCard = this.createCard({
            title: 'Class Features',
            className: 'features-card',
            collapsible: true
        });
        
        featuresCard.appendChild(this.createFeaturesList());
        
        panel.appendChild(overviewCard);
        panel.appendChild(abilityCard);
        panel.appendChild(skillsCard);
        panel.appendChild(featuresCard);
        
        return panel;
    }
    
    createCard(options = {}) {
        const card = this.createElement('div', {
            className: `ui-card ${options.className || ''}`,
            'data-collapsible': options.collapsible ? 'true' : 'false'
        });
        
        // Card header
        const header = this.createElement('div', {
            className: 'card-header'
        });
        
        const title = this.createElement('h3', {
            className: 'card-title'
        });
        title.textContent = options.title || 'Card';
        
        header.appendChild(title);
        
        if (options.collapsible) {
            const toggleButton = this.createElement('button', {
                className: 'card-toggle',
                type: 'button',
                'aria-expanded': 'true',
                'aria-label': `Toggle ${options.title || 'card'} content`
            });
            
            toggleButton.innerHTML = '<span class="toggle-icon">−</span>';
            
            toggleButton.addEventListener('click', (e) => {
                this.toggleCardCollapse(card);
            });
            
            header.appendChild(toggleButton);
        }
        
        // Card body
        const body = this.createElement('div', {
            className: 'card-body'
        });
        
        card.appendChild(header);
        card.appendChild(body);
        
        return card;
    }
    
    createCharacterOverview() {
        const overview = this.createElement('div', { className: 'character-overview' });
        
        const fields = [
            { label: 'Name', id: 'characterName', type: 'text' },
            { label: 'Race', id: 'characterRace', type: 'select' },
            { label: 'Class', id: 'characterClass', type: 'select' },
            { label: 'Level', id: 'characterLevel', type: 'number', min: 1, max: 100 },
            { label: 'Alignment', id: 'characterAlignment', type: 'select' },
            { label: 'Background', id: 'characterBackground', type: 'select' }
        ];
        
        const grid = this.createElement('div', { className: 'field-grid' });
        
        fields.forEach(field => {
            const fieldGroup = this.createElement('div', { className: 'field-group' });
            
            const label = this.createElement('label', {
                className: 'field-label',
                'for': field.id
            });
            label.textContent = field.label;
            
            let input;
            if (field.type === 'select') {
                input = this.createElement('select', {
                    id: field.id,
                    className: 'field-input field-select'
                });
                // Options would be populated based on field type
            } else {
                input = this.createElement('input', {
                    id: field.id,
                    type: field.type,
                    className: 'field-input',
                    min: field.min,
                    max: field.max
                });
            }
            
            fieldGroup.appendChild(label);
            fieldGroup.appendChild(input);
            grid.appendChild(fieldGroup);
        });
        
        overview.appendChild(grid);
        return overview;
    }
    
    createAbilityScoresGrid() {
        const grid = this.createElement('div', { className: 'ability-scores-grid' });
        
        const abilities = [
            { name: 'Strength', abbr: 'STR', id: 'str' },
            { name: 'Dexterity', abbr: 'DEX', id: 'dex' },
            { name: 'Constitution', abbr: 'CON', id: 'con' },
            { name: 'Intelligence', abbr: 'INT', id: 'int' },
            { name: 'Wisdom', abbr: 'WIS', id: 'wis' },
            { name: 'Charisma', abbr: 'CHA', id: 'cha' }
        ];
        
        abilities.forEach(ability => {
            const abilityCard = this.createElement('div', {
                className: 'ability-card',
                'data-ability': ability.id
            });
            
            const label = this.createElement('div', { className: 'ability-label' });
            label.textContent = ability.abbr;
            
            const score = this.createElement('input', {
                id: `${ability.id}Score`,
                type: 'number',
                className: 'ability-score',
                min: '1',
                max: '50',
                value: '10',
                'aria-label': `${ability.name} score`
            });
            
            const modifier = this.createElement('div', {
                className: 'ability-modifier',
                id: `${ability.id}Modifier`,
                'aria-label': `${ability.name} modifier`
            });
            modifier.textContent = '+0';
            
            abilityCard.appendChild(label);
            abilityCard.appendChild(score);
            abilityCard.appendChild(modifier);
            
            grid.appendChild(abilityCard);
            
            // Calculate modifier when score changes
            score.addEventListener('input', (e) => {
                const scoreValue = parseInt(e.target.value) || 10;
                const modifierValue = Math.floor((scoreValue - 10) / 2);
                modifier.textContent = modifierValue >= 0 ? `+${modifierValue}` : `${modifierValue}`;
            });
        });
        
        return grid;
    }
    
    createSidebarComponent() {
        const sidebar = this.createElement('aside', {
            id: 'sidebar',
            className: 'main-sidebar',
            'aria-label': 'Tools and quick actions'
        });
        
        // Quick actions section
        const quickActions = this.createElement('div', { className: 'sidebar-section' });
        const actionsTitle = this.createElement('h4', { className: 'sidebar-title' });
        actionsTitle.textContent = 'Quick Actions';
        
        const actionsList = this.createElement('div', { className: 'actions-list' });
        
        const actions = [
            { label: 'Roll Initiative', icon: '⚡', action: 'rollInitiative' },
            { label: 'Long Rest', icon: '🛌', action: 'longRest' },
            { label: 'Short Rest', icon: '☕', action: 'shortRest' },
            { label: 'Level Up', icon: '📈', action: 'levelUp' }
        ];
        
        actions.forEach(action => {
            const button = this.createElement('button', {
                className: 'action-button',
                type: 'button',
                'data-action': action.action
            });
            
            button.innerHTML = `
                <span class="action-icon">${action.icon}</span>
                <span class="action-label">${action.label}</span>
            `;
            
            actionsList.appendChild(button);
        });
        
        quickActions.appendChild(actionsTitle);
        quickActions.appendChild(actionsList);
        
        // Recent dice rolls section
        const recentRolls = this.createElement('div', { className: 'sidebar-section' });
        const rollsTitle = this.createElement('h4', { className: 'sidebar-title' });
        rollsTitle.textContent = 'Recent Rolls';
        
        const rollsList = this.createElement('div', {
            id: 'recentRollsList',
            className: 'rolls-list',
            'aria-live': 'polite'
        });
        
        recentRolls.appendChild(rollsTitle);
        recentRolls.appendChild(rollsList);
        
        // Character stats summary
        const statsSummary = this.createElement('div', { className: 'sidebar-section' });
        const statsTitle = this.createElement('h4', { className: 'sidebar-title' });
        statsTitle.textContent = 'Character Stats';
        
        const statsContent = this.createElement('div', {
            id: 'characterStatsSummary',
            className: 'stats-summary'
        });
        
        statsSummary.appendChild(statsTitle);
        statsSummary.appendChild(statsContent);
        
        sidebar.appendChild(quickActions);
        sidebar.appendChild(recentRolls);
        sidebar.appendChild(statsSummary);
        
        return sidebar;
    }
    
    createFooterComponent() {
        const footer = this.createElement('footer', {
            className: 'main-footer',
            'aria-label': 'Application status and information'
        });
        
        const statusBar = this.createElement('div', { className: 'status-bar' });
        
        const leftStatus = this.createElement('div', { className: 'status-left' });
        const centerStatus = this.createElement('div', { className: 'status-center' });
        const rightStatus = this.createElement('div', { className: 'status-right' });
        
        // Left: Character info
        leftStatus.innerHTML = `
            <span id="characterStatusInfo" class="status-item">
                <span class="status-label">Character:</span>
                <span class="status-value">Not Created</span>
            </span>
        `;
        
        // Center: Current operation
        centerStatus.innerHTML = `
            <span id="currentOperation" class="status-item">
                <span class="status-value">Ready</span>
            </span>
        `;
        
        // Right: System info
        rightStatus.innerHTML = `
            <span class="status-item">
                <span class="status-label">Theme:</span>
                <span id="currentTheme" class="status-value">Auto</span>
            </span>
            <span class="status-item">
                <span class="status-label">Screen:</span>
                <span id="currentScreen" class="status-value">Desktop</span>
            </span>
        `;
        
        statusBar.appendChild(leftStatus);
        statusBar.appendChild(centerStatus);
        statusBar.appendChild(rightStatus);
        
        footer.appendChild(statusBar);
        
        return footer;
    }
    
    initializeTooltipSystem() {
        this.tooltipContainer = this.createElement('div', {
            id: 'tooltip-container',
            className: 'tooltip-container',
            'aria-hidden': 'true',
            role: 'tooltip'
        });
        
        document.body.appendChild(this.tooltipContainer);
        
        // Setup tooltip event handlers
        this.container.addEventListener('mouseenter', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.showTooltip(target);
            }
        }, true);
        
        this.container.addEventListener('mouseleave', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.hideTooltip();
            }
        }, true);
        
        this.container.addEventListener('focus', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.showTooltip(target);
            }
        }, true);
        
        this.container.addEventListener('blur', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.hideTooltip();
            }
        }, true);
    }
    
    showTooltip(element) {
        const content = element.getAttribute('data-tooltip');
        const placement = element.getAttribute('data-tooltip-placement') || 'top';
        
        if (!content) return;
        
        this.tooltipContainer.textContent = content;
        this.tooltipContainer.className = `tooltip-container tooltip-${placement} visible`;
        this.tooltipContainer.setAttribute('aria-hidden', 'false');
        
        // Position tooltip
        this.positionTooltip(element, placement);
    }
    
    hideTooltip() {
        this.tooltipContainer.classList.remove('visible');
        this.tooltipContainer.setAttribute('aria-hidden', 'true');
    }
    
    positionTooltip(element, placement) {
        const rect = element.getBoundingClientRect();
        const tooltip = this.tooltipContainer;
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let x, y;
        
        switch (placement) {
            case 'top':
                x = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                y = rect.top - tooltipRect.height - 8;
                break;
            case 'bottom':
                x = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                y = rect.bottom + 8;
                break;
            case 'left':
                x = rect.left - tooltipRect.width - 8;
                y = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'right':
                x = rect.right + 8;
                y = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
        }
        
        // Keep tooltip within viewport
        x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
        y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));
        
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }
    
    initializeModalSystem() {
        this.modalOverlay = this.createElement('div', {
            id: 'modal-overlay',
            className: 'modal-overlay',
            'aria-hidden': 'true'
        });
        
        document.body.appendChild(this.modalOverlay);
        
        // Close modal on overlay click
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.closeModal();
            }
        });
        
        // Close modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen()) {
                this.closeModal();
            }
        });
    }
    
    showModal(options = {}) {
        const modal = this.createElement('div', {
            className: `modal ${options.className || ''}`,
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': options.titleId || 'modal-title'
        });
        
        const modalContent = this.createElement('div', {
            className: 'modal-content'
        });
        
        if (options.title) {
            const header = this.createElement('div', { className: 'modal-header' });
            const title = this.createElement('h2', {
                id: options.titleId || 'modal-title',
                className: 'modal-title'
            });
            title.textContent = options.title;
            
            const closeButton = this.createElement('button', {
                className: 'modal-close',
                type: 'button',
                'aria-label': 'Close modal'
            });
            closeButton.innerHTML = '×';
            closeButton.addEventListener('click', () => this.closeModal());
            
            header.appendChild(title);
            header.appendChild(closeButton);
            modalContent.appendChild(header);
        }
        
        if (options.content) {
            const body = this.createElement('div', { className: 'modal-body' });
            if (typeof options.content === 'string') {
                body.innerHTML = options.content;
            } else {
                body.appendChild(options.content);
            }
            modalContent.appendChild(body);
        }
        
        if (options.buttons) {
            const footer = this.createElement('div', { className: 'modal-footer' });
            options.buttons.forEach(button => {
                const btn = this.createElement('button', {
                    className: `modal-button ${button.className || ''}`,
                    type: 'button'
                });
                btn.textContent = button.text;
                btn.addEventListener('click', button.onclick || (() => this.closeModal()));
                footer.appendChild(btn);
            });
            modalContent.appendChild(footer);
        }
        
        modal.appendChild(modalContent);
        this.modalOverlay.appendChild(modal);
        
        // Show modal
        this.modalOverlay.classList.add('visible');
        this.modalOverlay.setAttribute('aria-hidden', 'false');
        
        // Focus management
        this.gamingInterface.trapFocus(modal);
        
        this.currentModal = modal;
        return modal;
    }
    
    closeModal() {
        if (this.currentModal) {
            this.modalOverlay.classList.remove('visible');
            this.modalOverlay.setAttribute('aria-hidden', 'true');
            this.modalOverlay.innerHTML = '';
            
            this.gamingInterface.releaseFocus();
            this.currentModal = null;
        }
    }
    
    isModalOpen() {
        return this.currentModal !== null;
    }
    
    // UI utility methods
    switchToPanel(panelId) {
        // Update navigation
        const navButtons = this.container.querySelectorAll('.nav-button');
        navButtons.forEach(btn => {
            btn.setAttribute('aria-selected', 'false');
        });
        
        const activeNav = this.container.querySelector(`#nav-${panelId}`);
        if (activeNav) {
            activeNav.setAttribute('aria-selected', 'true');
        }
        
        // Update panels
        const panels = this.container.querySelectorAll('.content-panel');
        panels.forEach(panel => {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        });
        
        const activePanel = this.container.querySelector(`#panel-${panelId}`);
        if (activePanel) {
            activePanel.classList.add('active');
            activePanel.setAttribute('aria-hidden', 'false');
            
            // Announce panel change
            this.gamingInterface.announceToScreenReader(`Switched to ${panelId} panel`);
        }
    }
    
    toggleCardCollapse(card) {
        const body = card.querySelector('.card-body');
        const toggle = card.querySelector('.card-toggle');
        const icon = toggle.querySelector('.toggle-icon');
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            body.style.display = 'none';
            toggle.setAttribute('aria-expanded', 'false');
            icon.textContent = '+';
        } else {
            body.style.display = 'block';
            toggle.setAttribute('aria-expanded', 'true');
            icon.textContent = '−';
        }
    }
    
    createElement(tagName, attributes = {}) {
        const element = document.createElement(tagName);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key.startsWith('data-') || key.startsWith('aria-') || 
                       ['id', 'role', 'type', 'for', 'min', 'max', 'value', 'title'].includes(key)) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });
        
        return element;
    }
    
    setupEventHandlers() {
        // Navigation event handlers
        this.container.addEventListener('click', (e) => {
            const navButton = e.target.closest('.nav-button');
            if (navButton) {
                const panelId = navButton.id.replace('nav-', '');
                this.switchToPanel(panelId);
            }
        });
        
        // Action button handlers
        this.container.addEventListener('click', (e) => {
            const actionButton = e.target.closest('.action-button');
            if (actionButton) {
                const action = actionButton.getAttribute('data-action');
                this.handleQuickAction(action);
            }
        });
    }
    
    handleQuickAction(action) {
        // This would integrate with other systems
        console.log(`🎮 Quick action: ${action}`);
        
        switch (action) {
            case 'rollInitiative':
                // Integrate with dice engine
                break;
            case 'longRest':
                // Integrate with character manager
                break;
            case 'shortRest':
                // Integrate with character manager
                break;
            case 'levelUp':
                // Show level up modal
                break;
        }
    }
    
    injectUIStyles() {
        const uiStyles = `
            /* Main Layout */
            .main-layout {
                display: grid;
                grid-template-areas:
                    "nav nav nav"
                    "content content sidebar"
                    "footer footer footer";
                grid-template-rows: auto 1fr auto;
                grid-template-columns: 1fr 1fr 300px;
                min-height: 100vh;
                gap: var(--spacing-md);
            }
            
            .main-navigation {
                grid-area: nav;
                background: var(--surface-color);
                border-bottom: 1px solid var(--border-color);
                padding: var(--spacing-md);
            }
            
            .content-container {
                grid-area: content;
                padding: var(--spacing-md);
                overflow-y: auto;
            }
            
            .main-sidebar {
                grid-area: sidebar;
                background: var(--surface-color);
                border-left: 1px solid var(--border-color);
                padding: var(--spacing-md);
                overflow-y: auto;
            }
            
            .main-footer {
                grid-area: footer;
                background: var(--surface-color);
                border-top: 1px solid var(--border-color);
                padding: var(--spacing-sm) var(--spacing-md);
            }
            
            /* Navigation */
            .nav-list {
                display: flex;
                list-style: none;
                margin: 0;
                padding: 0;
                gap: var(--spacing-sm);
                flex-wrap: wrap;
            }
            
            .nav-button {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--spacing-xs);
                padding: var(--spacing-sm) var(--spacing-md);
                background: transparent;
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                color: var(--text-color);
                cursor: pointer;
                transition: all var(--transition-fast);
                min-width: 80px;
            }
            
            .nav-button:hover {
                background: var(--primary-color);
                color: white;
                transform: translateY(-2px);
            }
            
            .nav-button[aria-selected="true"] {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }
            
            .nav-icon {
                font-size: var(--font-size-lg);
            }
            
            .nav-label {
                font-size: var(--font-size-sm);
                font-weight: 500;
            }
            
            /* Panels */
            .content-panel {
                display: none;
                animation: fadeIn var(--transition-medium);
            }
            
            .content-panel.active {
                display: block;
            }
            
            /* Cards */
            .ui-card {
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                margin-bottom: var(--spacing-md);
                box-shadow: var(--shadow-sm);
                transition: all var(--transition-fast);
            }
            
            .ui-card:hover {
                box-shadow: var(--shadow-md);
            }
            
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-md);
                border-bottom: 1px solid var(--border-color);
                background: var(--background-color);
                border-radius: var(--border-radius) var(--border-radius) 0 0;
            }
            
            .card-title {
                margin: 0;
                font-size: var(--font-size-lg);
                font-weight: 600;
                color: var(--text-color);
            }
            
            .card-toggle {
                background: none;
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-full);
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: var(--text-color);
                font-weight: bold;
                transition: all var(--transition-fast);
            }
            
            .card-toggle:hover {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }
            
            .card-body {
                padding: var(--spacing-md);
            }
            
            /* Form Elements */
            .field-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--spacing-md);
            }
            
            .field-group {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
            }
            
            .field-label {
                font-weight: 500;
                color: var(--text-color);
                font-size: var(--font-size-sm);
            }
            
            .field-input {
                padding: var(--spacing-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                background: var(--background-color);
                color: var(--text-color);
                font-size: var(--font-size-base);
                transition: all var(--transition-fast);
            }
            
            .field-input:focus {
                border-color: var(--primary-color);
                box-shadow: 0 0 0 2px var(--primary-color)33;
            }
            
            /* Ability Scores */
            .ability-scores-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                gap: var(--spacing-md);
            }
            
            .ability-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--spacing-xs);
                padding: var(--spacing-md);
                background: var(--background-color);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                text-align: center;
            }
            
            .ability-label {
                font-weight: 600;
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
            }
            
            .ability-score {
                width: 60px;
                text-align: center;
                font-weight: bold;
                font-size: var(--font-size-lg);
            }
            
            .ability-modifier {
                font-weight: bold;
                font-size: var(--font-size-sm);
                color: var(--primary-color);
                background: var(--primary-color)20;
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-full);
            }
            
            /* Sidebar */
            .sidebar-section {
                margin-bottom: var(--spacing-lg);
            }
            
            .sidebar-title {
                margin: 0 0 var(--spacing-md) 0;
                font-size: var(--font-size-base);
                font-weight: 600;
                color: var(--text-color);
                border-bottom: 1px solid var(--border-color);
                padding-bottom: var(--spacing-xs);
            }
            
            .actions-list {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-sm);
            }
            
            .action-button {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-sm);
                background: var(--background-color);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                color: var(--text-color);
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            
            .action-button:hover {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
                transform: translateX(4px);
            }
            
            .action-icon {
                font-size: var(--font-size-lg);
            }
            
            .action-label {
                font-size: var(--font-size-sm);
                font-weight: 500;
            }
            
            /* Status Bar */
            .status-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: var(--font-size-sm);
            }
            
            .status-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
            }
            
            .status-label {
                color: var(--text-secondary);
                font-weight: 500;
            }
            
            .status-value {
                color: var(--text-color);
                font-weight: 600;
            }
            
            /* Tooltips */
            .tooltip-container {
                position: fixed;
                background: var(--text-color);
                color: var(--background-color);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius);
                font-size: var(--font-size-sm);
                font-weight: 500;
                z-index: 10000;
                opacity: 0;
                pointer-events: none;
                transition: opacity var(--transition-fast);
                max-width: 200px;
                word-wrap: break-word;
            }
            
            .tooltip-container.visible {
                opacity: 1;
            }
            
            /* Modals */
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all var(--transition-medium);
            }
            
            .modal-overlay.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .modal {
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--shadow-lg);
                max-width: 90vw;
                max-height: 90vh;
                overflow: hidden;
                transform: scale(0.9);
                transition: transform var(--transition-medium);
            }
            
            .modal-overlay.visible .modal {
                transform: scale(1);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-md);
                border-bottom: 1px solid var(--border-color);
                background: var(--background-color);
            }
            
            .modal-title {
                margin: 0;
                font-size: var(--font-size-lg);
                font-weight: 600;
                color: var(--text-color);
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: var(--font-size-xl);
                cursor: pointer;
                color: var(--text-secondary);
                padding: var(--spacing-xs);
                border-radius: var(--border-radius);
                transition: all var(--transition-fast);
            }
            
            .modal-close:hover {
                background: var(--error-color);
                color: white;
            }
            
            .modal-body {
                padding: var(--spacing-md);
                overflow-y: auto;
            }
            
            .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: var(--spacing-sm);
                padding: var(--spacing-md);
                border-top: 1px solid var(--border-color);
                background: var(--background-color);
            }
            
            .modal-button {
                padding: var(--spacing-sm) var(--spacing-md);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                background: var(--surface-color);
                color: var(--text-color);
                cursor: pointer;
                font-weight: 500;
                transition: all var(--transition-fast);
            }
            
            .modal-button.primary {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }
            
            .modal-button:hover {
                transform: translateY(-1px);
                box-shadow: var(--shadow-md);
            }
            
            /* Responsive Design */
            @media (max-width: 1024px) {
                .main-layout {
                    grid-template-areas:
                        "nav nav"
                        "content sidebar"
                        "footer footer";
                    grid-template-columns: 1fr 250px;
                }
            }
            
            @media (max-width: 768px) {
                .main-layout {
                    grid-template-areas:
                        "nav"
                        "content"
                        "sidebar"
                        "footer";
                    grid-template-columns: 1fr;
                }
                
                .nav-list {
                    justify-content: center;
                }
                
                .field-grid {
                    grid-template-columns: 1fr;
                }
                
                .ability-scores-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
            
            @media (max-width: 480px) {
                .nav-button {
                    min-width: 60px;
                    padding: var(--spacing-xs);
                }
                
                .nav-label {
                    display: none;
                }
                
                .ability-scores-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        
        this.gamingInterface.injectStyles('ui-components', uiStyles);
    }
    
    // Stub methods for panel creation (would be implemented based on specific needs)
    createEquipmentPanel() { return this.createElement('div', { innerHTML: '<p>Equipment panel content...</p>' }); }
    createSpellsPanel() { return this.createElement('div', { innerHTML: '<p>Spells panel content...</p>' }); }
    createAdventurePanel() { return this.createElement('div', { innerHTML: '<p>Adventure panel content...</p>' }); }
    createDicePanel() { return this.createElement('div', { innerHTML: '<p>Dice panel content...</p>' }); }
    createPortraitPanel() { return this.createElement('div', { innerHTML: '<p>Portrait panel content...</p>' }); }
    createStoryPanel() { return this.createElement('div', { innerHTML: '<p>Story panel content...</p>' }); }
    createExportPanel() { return this.createElement('div', { innerHTML: '<p>Export panel content...</p>' }); }
    createSkillsList() { return this.createElement('div', { innerHTML: '<p>Skills list...</p>' }); }
    createFeaturesList() { return this.createElement('div', { innerHTML: '<p>Features list...</p>' }); }
    
    // Additional initialization methods (stubs)
    initializeNotificationSystem() { /* Implementation */ }
    initializeDragDropSystem() { /* Implementation */ }
    initializeContextMenuSystem() { /* Implementation */ }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernGamingInterfaceUI;
} else if (typeof window !== 'undefined') {
    window.ModernGamingInterfaceUI = ModernGamingInterfaceUI;
}
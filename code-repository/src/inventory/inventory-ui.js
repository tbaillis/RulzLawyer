/**
 * InventoryUI - Drag & Drop Interface for Inventory Management
 * 
 * Features:
 * - Visual drag-and-drop equipment management
 * - Equipment slot visualization
 * - Container management with visual weight/capacity indicators
 * - Equipment preset switching interface
 * - Real-time encumbrance and bonus calculations
 * - Item tooltips with detailed information
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class InventoryUI {
    constructor(inventoryManager, containerId = 'inventory-interface') {
        this.inventoryManager = inventoryManager;
        this.containerId = containerId;
        this.draggedItem = null;
        this.draggedFrom = null;
        
        // UI element references
        this.elements = {
            container: null,
            equipmentSlots: {},
            containers: {},
            presetSelector: null,
            statsPanel: null,
            tooltipElement: null
        };
        
        // Equipment slot positions for visual layout
        this.slotPositions = {
            head: { x: 250, y: 50 },
            neck: { x: 250, y: 100 },
            shoulders: { x: 150, y: 120 },
            body: { x: 250, y: 150 },
            arms: { x: 350, y: 120 },
            hands: { x: 250, y: 250 },
            mainHand: { x: 150, y: 200 },
            offHand: { x: 350, y: 200 },
            ring1: { x: 200, y: 300 },
            ring2: { x: 300, y: 300 },
            feet: { x: 250, y: 350 },
            belt: { x: 250, y: 200 },
            eyes: { x: 200, y: 50 },
            headband: { x: 300, y: 50 },
            wrists: { x: 180, y: 250 },
            shield: { x: 350, y: 200 }
        };
        
        this.initialized = false;
        console.log('🖼️ Inventory UI initialized');
    }

    /**
     * Initialize the drag & drop interface
     */
    initialize() {
        if (this.initialized) return;
        
        this.createInterface();
        this.setupEventListeners();
        this.updateDisplay();
        
        this.initialized = true;
        console.log('✅ Inventory drag & drop interface ready');
    }

    /**
     * Create the main interface structure
     */
    createInterface() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            throw new Error(`Container element '${this.containerId}' not found`);
        }
        
        container.innerHTML = `
            <div class="inventory-interface">
                <!-- Character Model & Equipment Slots -->
                <div class="equipment-panel">
                    <h3>Equipment</h3>
                    <div class="character-model">
                        ${this.createEquipmentSlots()}
                    </div>
                    <div class="preset-controls">
                        <select id="preset-selector">
                            <option value="">Select Preset...</option>
                            <option value="combat">Combat Ready</option>
                            <option value="exploration">Exploration Kit</option>
                            <option value="social">Social Gathering</option>
                            <option value="survival">Wilderness Survival</option>
                        </select>
                        <button id="apply-preset" class="btn-apply">Apply</button>
                        <button id="save-preset" class="btn-save">Save Current</button>
                    </div>
                </div>

                <!-- Inventory Containers -->
                <div class="containers-panel">
                    <h3>Inventory</h3>
                    ${this.createContainers()}
                </div>

                <!-- Stats Panel -->
                <div class="stats-panel">
                    <h3>Statistics</h3>
                    <div class="stat-group">
                        <div class="stat-item">
                            <label>Weight:</label>
                            <span id="current-weight">0</span> / 
                            <span id="weight-capacity">0</span> lbs
                        </div>
                        <div class="stat-item">
                            <label>Encumbrance:</label>
                            <span id="encumbrance-level" class="encumbrance-light">Light</span>
                        </div>
                        <div class="stat-item">
                            <label>Total Value:</label>
                            <span id="total-value">0</span> gp
                        </div>
                    </div>
                    
                    <div class="bonuses-section">
                        <h4>Equipment Bonuses</h4>
                        <div id="equipment-bonuses">
                            <!-- Bonuses will be populated dynamically -->
                        </div>
                    </div>
                    
                    <div class="coins-section">
                        <h4>Coins</h4>
                        <div class="coin-display">
                            <div class="coin-type">
                                <span class="coin-label">PP:</span>
                                <input type="number" id="coins-pp" value="0" min="0">
                            </div>
                            <div class="coin-type">
                                <span class="coin-label">GP:</span>
                                <input type="number" id="coins-gp" value="0" min="0">
                            </div>
                            <div class="coin-type">
                                <span class="coin-label">SP:</span>
                                <input type="number" id="coins-sp" value="0" min="0">
                            </div>
                            <div class="coin-type">
                                <span class="coin-label">CP:</span>
                                <input type="number" id="coins-cp" value="0" min="0">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Item Tooltip -->
            <div id="item-tooltip" class="item-tooltip hidden">
                <div class="tooltip-content">
                    <!-- Tooltip content populated dynamically -->
                </div>
            </div>

            <!-- Item Management Modal -->
            <div id="item-modal" class="item-modal hidden">
                <div class="modal-content">
                    <h3>Item Details</h3>
                    <div id="modal-item-details">
                        <!-- Item details populated dynamically -->
                    </div>
                    <div class="modal-actions">
                        <button id="modal-equip" class="btn-primary">Equip</button>
                        <button id="modal-move" class="btn-secondary">Move</button>
                        <button id="modal-drop" class="btn-danger">Drop</button>
                        <button id="modal-close" class="btn-cancel">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        this.elements.container = container;
        this.cacheElements();
    }

    /**
     * Create equipment slot elements
     */
    createEquipmentSlots() {
        let slotsHTML = '';
        
        Object.keys(this.slotPositions).forEach(slotName => {
            const position = this.slotPositions[slotName];
            slotsHTML += `
                <div class="equipment-slot" 
                     data-slot="${slotName}"
                     style="left: ${position.x}px; top: ${position.y}px;"
                     title="${this.getSlotDisplayName(slotName)}">
                    <div class="slot-label">${this.getSlotDisplayName(slotName)}</div>
                    <div class="slot-content" id="slot-${slotName}">
                        <!-- Item will be rendered here -->
                    </div>
                </div>
            `;
        });
        
        return slotsHTML;
    }

    /**
     * Create container elements
     */
    createContainers() {
        let containersHTML = '';
        
        Object.keys(this.inventoryManager.containers).forEach(containerName => {
            const container = this.inventoryManager.containers[containerName];
            containersHTML += `
                <div class="container-section">
                    <div class="container-header">
                        <h4>${container.name}</h4>
                        <span class="capacity-indicator">
                            <span id="container-${containerName}-weight">0</span>/${container.capacity}
                            ${container.type === 'ammunition' ? ' items' : ' lbs'}
                        </span>
                    </div>
                    <div class="container-items" 
                         data-container="${containerName}"
                         id="container-${containerName}">
                        <!-- Items will be rendered here -->
                    </div>
                </div>
            `;
        });
        
        return containersHTML;
    }

    /**
     * Cache DOM element references
     */
    cacheElements() {
        // Equipment slots
        Object.keys(this.slotPositions).forEach(slotName => {
            this.elements.equipmentSlots[slotName] = 
                document.getElementById(`slot-${slotName}`);
        });
        
        // Containers
        Object.keys(this.inventoryManager.containers).forEach(containerName => {
            this.elements.containers[containerName] = 
                document.getElementById(`container-${containerName}`);
        });
        
        // Other elements
        this.elements.presetSelector = document.getElementById('preset-selector');
        this.elements.statsPanel = document.querySelector('.stats-panel');
        this.elements.tooltipElement = document.getElementById('item-tooltip');
    }

    /**
     * Set up event listeners for drag & drop functionality
     */
    setupEventListeners() {
        // Preset controls
        document.getElementById('apply-preset').addEventListener('click', () => {
            this.applySelectedPreset();
        });
        
        document.getElementById('save-preset').addEventListener('click', () => {
            this.saveCurrentPreset();
        });
        
        // Coin inputs
        ['pp', 'gp', 'sp', 'cp'].forEach(coinType => {
            document.getElementById(`coins-${coinType}`).addEventListener('change', (e) => {
                this.updateCoins(coinType, parseInt(e.target.value) || 0);
            });
        });
        
        // Equipment slots drag & drop
        Object.keys(this.elements.equipmentSlots).forEach(slotName => {
            const slotElement = this.elements.equipmentSlots[slotName].parentElement;
            
            slotElement.addEventListener('dragover', this.handleDragOver.bind(this));
            slotElement.addEventListener('drop', (e) => this.handleSlotDrop(e, slotName));
        });
        
        // Container drag & drop
        Object.keys(this.elements.containers).forEach(containerName => {
            const containerElement = this.elements.containers[containerName];
            
            containerElement.addEventListener('dragover', this.handleDragOver.bind(this));
            containerElement.addEventListener('drop', (e) => this.handleContainerDrop(e, containerName));
        });
        
        // Modal controls
        document.getElementById('modal-close').addEventListener('click', () => {
            this.hideModal();
        });
        
        // Global escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
                this.hideTooltip();
            }
        });
    }

    /**
     * Update the entire display
     */
    updateDisplay() {
        this.updateEquipmentSlots();
        this.updateContainers();
        this.updateStats();
        this.updateBonuses();
        this.updateCoinsDisplay();
    }

    /**
     * Update equipment slot displays
     */
    updateEquipmentSlots() {
        Object.keys(this.elements.equipmentSlots).forEach(slotName => {
            const slotElement = this.elements.equipmentSlots[slotName];
            const equippedItem = this.inventoryManager.currentInventory.equipped[slotName];
            
            if (equippedItem) {
                slotElement.innerHTML = this.createItemElement(equippedItem, 'equipped', slotName);
            } else {
                slotElement.innerHTML = '<div class="empty-slot">Empty</div>';
            }
        });
    }

    /**
     * Update container displays
     */
    updateContainers() {
        Object.keys(this.inventoryManager.currentInventory.containers).forEach(containerName => {
            const containerElement = this.elements.containers[containerName];
            const container = this.inventoryManager.currentInventory.containers[containerName];
            
            // Update items
            containerElement.innerHTML = '';
            container.items.forEach((item, index) => {
                const itemElement = this.createItemElement(item, 'container', containerName, index);
                containerElement.appendChild(itemElement);
            });
            
            // Update capacity indicator
            const currentWeight = container.items.reduce((sum, item) => sum + (item.weight || 0), 0);
            const weightElement = document.getElementById(`container-${containerName}-weight`);
            if (weightElement) {
                weightElement.textContent = currentWeight.toFixed(1);
                
                // Update color based on capacity
                const capacityPercent = (currentWeight / container.capacity) * 100;
                weightElement.className = capacityPercent > 90 ? 'capacity-full' : 
                                         capacityPercent > 75 ? 'capacity-high' : 'capacity-normal';
            }
        });
    }

    /**
     * Create draggable item element
     */
    createItemElement(item, location, container, index = null) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.draggable = true;
        itemDiv.dataset.item = JSON.stringify(item);
        itemDiv.dataset.location = location;
        itemDiv.dataset.container = container;
        if (index !== null) itemDiv.dataset.index = index;
        
        // Add rarity class
        if (item.rarity) {
            itemDiv.classList.add(`rarity-${item.rarity.toLowerCase()}`);
        }
        
        itemDiv.innerHTML = `
            <div class="item-icon">
                ${this.getItemIcon(item)}
            </div>
            <div class="item-name">${item.name}</div>
            ${item.quantity > 1 ? `<div class="item-quantity">${item.quantity}</div>` : ''}
            ${item.enhancement ? `<div class="item-enhancement">+${item.enhancement}</div>` : ''}
        `;
        
        // Event listeners
        itemDiv.addEventListener('dragstart', (e) => this.handleDragStart(e, item, location, container));
        itemDiv.addEventListener('dragend', this.handleDragEnd.bind(this));
        itemDiv.addEventListener('click', () => this.showItemDetails(item));
        itemDiv.addEventListener('mouseenter', (e) => this.showTooltip(e, item));
        itemDiv.addEventListener('mouseleave', this.hideTooltip.bind(this));
        
        return itemDiv;
    }

    /**
     * Get appropriate icon for item type
     */
    getItemIcon(item) {
        const iconMap = {
            weapon: '⚔️',
            armor: '🛡️',
            shield: '🛡️',
            helmet: '⛑️',
            boots: '🥾',
            gloves: '🧤',
            ring: '💍',
            amulet: '📿',
            potion: '🧪',
            scroll: '📜',
            wand: '🪄',
            staff: '🦯',
            rod: '🪄',
            gem: '💎',
            coin: '🪙',
            tool: '🔧',
            rope: '🪢',
            torch: '🕯️',
            book: '📚',
            clothing: '👕'
        };
        
        return iconMap[item.type] || '📦';
    }

    /**
     * Handle drag start
     */
    handleDragStart(e, item, location, container) {
        this.draggedItem = item;
        this.draggedFrom = { location, container };
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', ''); // For Firefox compatibility
        
        e.target.classList.add('dragging');
        
        console.log(`🖱️ Dragging ${item.name} from ${location}`);
    }

    /**
     * Handle drag end
     */
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.clearDragTargets();
    }

    /**
     * Handle drag over
     */
    handleDragOver(e) {
        if (!this.draggedItem) return;
        
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        e.currentTarget.classList.add('drag-target');
    }

    /**
     * Handle drop on equipment slot
     */
    handleSlotDrop(e, slotName) {
        e.preventDefault();
        this.clearDragTargets();
        
        if (!this.draggedItem) return;
        
        try {
            // Validate slot compatibility
            if (!this.inventoryManager.isValidSlot(this.draggedItem, slotName)) {
                this.showMessage(`${this.draggedItem.name} cannot be equipped to ${this.getSlotDisplayName(slotName)}`, 'error');
                return;
            }
            
            // Remove from previous location
            this.removeItemFromPreviousLocation();
            
            // Equip to slot
            this.inventoryManager.equipItem(this.draggedItem, slotName);
            
            this.updateDisplay();
            this.showMessage(`Equipped ${this.draggedItem.name} to ${this.getSlotDisplayName(slotName)}`, 'success');
            
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
        
        this.draggedItem = null;
        this.draggedFrom = null;
    }

    /**
     * Handle drop on container
     */
    handleContainerDrop(e, containerName) {
        e.preventDefault();
        this.clearDragTargets();
        
        if (!this.draggedItem) return;
        
        try {
            // Remove from previous location
            this.removeItemFromPreviousLocation();
            
            // Add to container
            this.inventoryManager.addToContainer(this.draggedItem, containerName);
            
            this.updateDisplay();
            
            const container = this.inventoryManager.containers[containerName];
            this.showMessage(`Moved ${this.draggedItem.name} to ${container.name}`, 'success');
            
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
        
        this.draggedItem = null;
        this.draggedFrom = null;
    }

    /**
     * Remove item from its previous location
     */
    removeItemFromPreviousLocation() {
        if (!this.draggedFrom) return;
        
        if (this.draggedFrom.location === 'equipped') {
            // Don't remove from slot yet - equipItem will handle it
        } else if (this.draggedFrom.location === 'container') {
            this.inventoryManager.removeFromContainer(this.draggedItem, this.draggedFrom.container);
        }
    }

    /**
     * Clear drag target highlights
     */
    clearDragTargets() {
        document.querySelectorAll('.drag-target').forEach(element => {
            element.classList.remove('drag-target');
        });
    }

    /**
     * Get display name for equipment slot
     */
    getSlotDisplayName(slotName) {
        const displayNames = {
            mainHand: 'Main Hand',
            offHand: 'Off Hand',
            ring1: 'Ring 1',
            ring2: 'Ring 2'
        };
        
        return displayNames[slotName] || 
               slotName.charAt(0).toUpperCase() + slotName.slice(1);
    }

    /**
     * Update statistics display
     */
    updateStats() {
        const summary = this.inventoryManager.getInventorySummary();
        
        document.getElementById('current-weight').textContent = summary.totalWeight.toFixed(1);
        document.getElementById('weight-capacity').textContent = summary.carryingCapacity.light;
        
        const encumbranceElement = document.getElementById('encumbrance-level');
        encumbranceElement.textContent = summary.encumbrance.charAt(0).toUpperCase() + 
                                        summary.encumbrance.slice(1);
        encumbranceElement.className = `encumbrance-${summary.encumbrance}`;
        
        document.getElementById('total-value').textContent = summary.totalValue.toFixed(2);
    }

    /**
     * Update equipment bonuses display
     */
    updateBonuses() {
        const bonuses = this.inventoryManager.currentInventory.equipmentBonuses;
        const bonusesElement = document.getElementById('equipment-bonuses');
        
        let bonusesHTML = '';
        
        if (bonuses.ac !== 0) {
            bonusesHTML += `<div class="bonus-item">AC: ${bonuses.ac > 0 ? '+' : ''}${bonuses.ac}</div>`;
        }
        
        if (bonuses.attack !== 0) {
            bonusesHTML += `<div class="bonus-item">Attack: ${bonuses.attack > 0 ? '+' : ''}${bonuses.attack}</div>`;
        }
        
        if (bonuses.damage !== 0) {
            bonusesHTML += `<div class="bonus-item">Damage: ${bonuses.damage > 0 ? '+' : ''}${bonuses.damage}</div>`;
        }
        
        // Saving throws
        ['fortitude', 'reflex', 'will'].forEach(save => {
            if (bonuses.saves[save] !== 0) {
                const saveName = save.charAt(0).toUpperCase() + save.slice(1);
                bonusesHTML += `<div class="bonus-item">${saveName}: ${bonuses.saves[save] > 0 ? '+' : ''}${bonuses.saves[save]}</div>`;
            }
        });
        
        // Skills
        Object.keys(bonuses.skills).forEach(skill => {
            if (bonuses.skills[skill] !== 0) {
                bonusesHTML += `<div class="bonus-item">${skill}: ${bonuses.skills[skill] > 0 ? '+' : ''}${bonuses.skills[skill]}</div>`;
            }
        });
        
        // Special abilities
        bonuses.special.forEach(ability => {
            bonusesHTML += `<div class="bonus-item special">${ability}</div>`;
        });
        
        bonusesElement.innerHTML = bonusesHTML || '<div class="no-bonuses">No equipment bonuses</div>';
    }

    /**
     * Update coins display
     */
    updateCoinsDisplay() {
        const coins = this.inventoryManager.currentInventory.coins;
        
        document.getElementById('coins-pp').value = coins.pp;
        document.getElementById('coins-gp').value = coins.gp;
        document.getElementById('coins-sp').value = coins.sp;
        document.getElementById('coins-cp').value = coins.cp;
    }

    // ===== PRESET MANAGEMENT UI =====

    /**
     * Apply selected preset
     */
    applySelectedPreset() {
        const presetName = this.elements.presetSelector.value;
        if (!presetName) {
            this.showMessage('Please select a preset to apply', 'warning');
            return;
        }
        
        try {
            const result = this.inventoryManager.applyPreset(presetName);
            this.updateDisplay();
            this.showMessage(`Applied preset: ${result.preset.name}`, 'success');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    /**
     * Save current equipment as preset
     */
    saveCurrentPreset() {
        const name = prompt('Enter preset name:');
        if (!name) return;
        
        const description = prompt('Enter preset description (optional):') || '';
        
        try {
            const preset = this.inventoryManager.savePreset(name, description);
            
            // Add to selector
            const option = document.createElement('option');
            option.value = name;
            option.textContent = preset.name;
            this.elements.presetSelector.appendChild(option);
            
            this.showMessage(`Saved preset: ${preset.name}`, 'success');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    // ===== TOOLTIP & MODAL MANAGEMENT =====

    /**
     * Show item tooltip
     */
    showTooltip(e, item) {
        const tooltip = this.elements.tooltipElement;
        
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <div class="tooltip-header">
                    <strong>${item.name}</strong>
                    ${item.enhancement ? `<span class="enhancement">+${item.enhancement}</span>` : ''}
                </div>
                <div class="tooltip-type">${item.type}</div>
                ${item.damage ? `<div class="tooltip-damage">Damage: ${item.damage}</div>` : ''}
                ${item.ac ? `<div class="tooltip-ac">AC: ${item.ac}</div>` : ''}
                ${item.weight ? `<div class="tooltip-weight">Weight: ${item.weight} lbs</div>` : ''}
                ${item.value ? `<div class="tooltip-value">Value: ${item.value} gp</div>` : ''}
                ${item.description ? `<div class="tooltip-description">${item.description}</div>` : ''}
            </div>
        `;
        
        tooltip.classList.remove('hidden');
        
        // Position tooltip
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = `${rect.right + 10}px`;
        tooltip.style.top = `${rect.top}px`;
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        this.elements.tooltipElement.classList.add('hidden');
    }

    /**
     * Show item details modal
     */
    showItemDetails(item) {
        const modal = document.getElementById('item-modal');
        const detailsElement = document.getElementById('modal-item-details');
        
        detailsElement.innerHTML = `
            <div class="item-details">
                <div class="detail-header">
                    <h4>${item.name}</h4>
                    ${item.enhancement ? `<span class="enhancement">+${item.enhancement}</span>` : ''}
                    ${item.rarity ? `<span class="rarity rarity-${item.rarity.toLowerCase()}">${item.rarity}</span>` : ''}
                </div>
                
                <div class="detail-stats">
                    <div class="stat-row">
                        <label>Type:</label>
                        <span>${item.type}</span>
                    </div>
                    ${item.damage ? `
                        <div class="stat-row">
                            <label>Damage:</label>
                            <span>${item.damage}</span>
                        </div>
                    ` : ''}
                    ${item.ac ? `
                        <div class="stat-row">
                            <label>Armor Class:</label>
                            <span>${item.ac}</span>
                        </div>
                    ` : ''}
                    ${item.weight ? `
                        <div class="stat-row">
                            <label>Weight:</label>
                            <span>${item.weight} lbs</span>
                        </div>
                    ` : ''}
                    ${item.value ? `
                        <div class="stat-row">
                            <label>Value:</label>
                            <span>${item.value} gp</span>
                        </div>
                    ` : ''}
                </div>
                
                ${item.bonuses ? `
                    <div class="detail-bonuses">
                        <h5>Bonuses:</h5>
                        ${this.formatItemBonuses(item.bonuses)}
                    </div>
                ` : ''}
                
                ${item.description ? `
                    <div class="detail-description">
                        <h5>Description:</h5>
                        <p>${item.description}</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    /**
     * Hide modal
     */
    hideModal() {
        document.getElementById('item-modal').classList.add('hidden');
    }

    /**
     * Format item bonuses for display
     */
    formatItemBonuses(bonuses) {
        let bonusHTML = '';
        
        if (bonuses.ac) bonusHTML += `<div>AC: +${bonuses.ac}</div>`;
        if (bonuses.attack) bonusHTML += `<div>Attack: +${bonuses.attack}</div>`;
        if (bonuses.damage) bonusHTML += `<div>Damage: +${bonuses.damage}</div>`;
        
        if (bonuses.saves) {
            Object.keys(bonuses.saves).forEach(save => {
                if (bonuses.saves[save]) {
                    const saveName = save.charAt(0).toUpperCase() + save.slice(1);
                    bonusHTML += `<div>${saveName} Save: +${bonuses.saves[save]}</div>`;
                }
            });
        }
        
        if (bonuses.skills) {
            Object.keys(bonuses.skills).forEach(skill => {
                if (bonuses.skills[skill]) {
                    bonusHTML += `<div>${skill}: +${bonuses.skills[skill]}</div>`;
                }
            });
        }
        
        if (bonuses.special && bonuses.special.length > 0) {
            bonusHTML += '<div class="special-abilities">';
            bonuses.special.forEach(ability => {
                bonusHTML += `<div class="special-ability">${ability}</div>`;
            });
            bonusHTML += '</div>';
        }
        
        return bonusHTML || '<div>No bonuses</div>';
    }

    // ===== UTILITY METHODS =====

    /**
     * Update coin values
     */
    updateCoins(coinType, value) {
        this.inventoryManager.currentInventory.coins[coinType] = value;
        this.inventoryManager.updateInventoryStats();
        this.updateStats();
    }

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        // Create or update message element
        let messageElement = document.getElementById('inventory-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'inventory-message';
            messageElement.className = 'inventory-message';
            this.elements.container.appendChild(messageElement);
        }
        
        messageElement.textContent = message;
        messageElement.className = `inventory-message message-${type}`;
        messageElement.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }

    /**
     * Export current inventory
     */
    exportInventory() {
        const data = this.inventoryManager.exportInventory();
        const json = JSON.stringify(data, null, 2);
        
        // Create download link
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'character-inventory.json';
        a.click();
        
        URL.revokeObjectURL(url);
        this.showMessage('Inventory exported successfully', 'success');
    }

    /**
     * Import inventory from file
     */
    importInventory(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.inventoryManager.importInventory(data);
                this.updateDisplay();
                this.showMessage('Inventory imported successfully', 'success');
            } catch (error) {
                this.showMessage('Error importing inventory: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Global export for both browser and Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryUI;
} else if (typeof window !== 'undefined') {
    window.InventoryUI = InventoryUI;
}
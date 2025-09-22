/**
 * RulzLawyer Inventory Management Interface
 * Drag-and-Drop Equipment System with D&D Beyond-inspired UI
 */

class InventoryInterface {
    constructor(equipmentManager, containerId) {
        this.equipmentManager = equipmentManager;
        this.container = document.getElementById(containerId);
        this.currentFilter = 'all';
        this.sortBy = 'name';
        
        this.initializeInterface();
        this.bindEvents();
    }

    initializeInterface() {
        if (!this.container) {
            console.error('Inventory container not found');
            return;
        }

        this.container.innerHTML = `
            <div class="inventory-header">
                <div class="inventory-title">
                    <h2>Equipment & Inventory</h2>
                    <div class="encumbrance-display">
                        <div class="encumbrance-bar">
                            <div class="encumbrance-fill" id="encumbranceBar"></div>
                        </div>
                        <span class="encumbrance-text" id="encumbranceText">Light Load</span>
                    </div>
                </div>
                
                <div class="inventory-controls">
                    <div class="inventory-filters">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="weapons">Weapons</button>
                        <button class="filter-btn" data-filter="armor">Armor</button>
                        <button class="filter-btn" data-filter="gear">Gear</button>
                        <button class="filter-btn" data-filter="magic">Magic</button>
                    </div>
                    
                    <div class="inventory-sort">
                        <select id="sortSelect">
                            <option value="name">Sort by Name</option>
                            <option value="type">Sort by Type</option>
                            <option value="weight">Sort by Weight</option>
                            <option value="value">Sort by Value</option>
                        </select>
                    </div>
                    
                    <div class="preset-controls">
                        <button class="preset-btn" data-preset="combat">Combat</button>
                        <button class="preset-btn" data-preset="exploration">Exploration</button>
                        <button class="preset-btn" data-preset="social">Social</button>
                        <button class="preset-btn" data-preset="survival">Survival</button>
                    </div>
                </div>
            </div>

            <div class="inventory-body">
                <div class="character-sheet-panel">
                    <div class="equipment-slots">
                        <div class="equipment-section">
                            <h3>Equipped Items</h3>
                            <div class="equipment-grid">
                                <div class="equipment-slot" data-slot="head" id="headSlot">
                                    <div class="slot-label">Head</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                                <div class="equipment-slot" data-slot="neck" id="neckSlot">
                                    <div class="slot-label">Neck</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                                <div class="equipment-slot" data-slot="shoulders" id="shouldersSlot">
                                    <div class="slot-label">Shoulders</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                                <div class="equipment-slot" data-slot="body" id="bodySlot">
                                    <div class="slot-label">Body</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                                <div class="equipment-slot" data-slot="chest" id="chestSlot">
                                    <div class="slot-label">Chest</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                                <div class="equipment-slot" data-slot="mainhand" id="mainhandSlot">
                                    <div class="slot-label">Main Hand</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                                <div class="equipment-slot" data-slot="offhand" id="offhandSlot">
                                    <div class="slot-label">Off Hand</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                                <div class="equipment-slot" data-slot="hands" id="handsSlot">
                                    <div class="slot-label">Hands</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                                <div class="equipment-slot" data-slot="ring1" id="ring1Slot">
                                    <div class="slot-label">Ring 1</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                                <div class="equipment-slot" data-slot="ring2" id="ring2Slot">
                                    <div class="slot-label">Ring 2</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                                <div class="equipment-slot" data-slot="belt" id="beltSlot">
                                    <div class="slot-label">Belt</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                                <div class="equipment-slot" data-slot="legs" id="legsSlot">
                                    <div class="slot-label">Legs</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                                <div class="equipment-slot" data-slot="feet" id="feetSlot">
                                    <div class="slot-label">Feet</div>
                                    <div class="slot-content">
                                        <div class="empty-slot">+</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="character-stats">
                            <h3>Combat Stats</h3>
                            <div class="stat-row">
                                <span>Armor Class:</span>
                                <span id="acValue">10</span>
                            </div>
                            <div class="stat-row">
                                <span>Touch AC:</span>
                                <span id="touchAcValue">10</span>
                            </div>
                            <div class="stat-row">
                                <span>Flat-Footed AC:</span>
                                <span id="flatFootedAcValue">10</span>
                            </div>
                            <div class="stat-row">
                                <span>Max Dex Bonus:</span>
                                <span id="maxDexValue">—</span>
                            </div>
                            <div class="stat-row">
                                <span>Armor Check Penalty:</span>
                                <span id="checkPenaltyValue">0</span>
                            </div>
                            <div class="stat-row">
                                <span>Spell Failure:</span>
                                <span id="spellFailureValue">0%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="inventory-panel">
                    <div class="inventory-section">
                        <h3>Inventory</h3>
                        <div class="search-box">
                            <input type="text" id="searchInput" placeholder="Search items...">
                        </div>
                        <div class="inventory-grid" id="inventoryGrid">
                            <!-- Dynamic inventory items -->
                        </div>
                    </div>

                    <div class="currency-section">
                        <h3>Currency</h3>
                        <div class="currency-grid">
                            <div class="currency-item">
                                <span class="currency-label">PP:</span>
                                <input type="number" id="ppInput" min="0" value="0">
                            </div>
                            <div class="currency-item">
                                <span class="currency-label">GP:</span>
                                <input type="number" id="gpInput" min="0" value="0">
                            </div>
                            <div class="currency-item">
                                <span class="currency-label">SP:</span>
                                <input type="number" id="spInput" min="0" value="0">
                            </div>
                            <div class="currency-item">
                                <span class="currency-label">CP:</span>
                                <input type="number" id="cpInput" min="0" value="0">
                            </div>
                        </div>
                        <div class="currency-converter">
                            <button id="convertCurrency">Convert Currency</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="inventory-footer">
                <div class="weight-display">
                    <span>Total Weight: <span id="totalWeight">0</span> lbs</span>
                </div>
                <div class="action-buttons">
                    <button id="addItemBtn" class="action-btn">Add Item</button>
                    <button id="exportInventoryBtn" class="action-btn">Export</button>
                    <button id="importInventoryBtn" class="action-btn">Import</button>
                </div>
            </div>
        `;

        this.updateDisplay();
    }

    bindEvents() {
        // Filter buttons
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.setFilter(e.target.dataset.filter);
            }
        });

        // Preset buttons
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('preset-btn')) {
                this.applyPreset(e.target.dataset.preset);
            }
        });

        // Sort dropdown
        const sortSelect = this.container.querySelector('#sortSelect');
        sortSelect?.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.updateInventoryDisplay();
        });

        // Search input
        const searchInput = this.container.querySelector('#searchInput');
        searchInput?.addEventListener('input', (e) => {
            this.filterInventory(e.target.value);
        });

        // Drag and drop events
        this.initializeDragAndDrop();

        // Currency events
        this.bindCurrencyEvents();

        // Action buttons
        this.bindActionButtons();
    }

    initializeDragAndDrop() {
        // Make inventory items draggable
        this.container.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('inventory-item')) {
                const itemData = JSON.parse(e.target.dataset.itemData);
                this.equipmentManager.handleDragStart(itemData, e);
            }
        });

        this.container.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('inventory-item')) {
                this.equipmentManager.handleDragEnd(e);
            }
        });

        // Equipment slots as drop targets
        this.container.addEventListener('dragover', (e) => {
            if (e.target.closest('.equipment-slot')) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }
        });

        this.container.addEventListener('drop', (e) => {
            const slot = e.target.closest('.equipment-slot');
            if (slot) {
                const slotType = slot.dataset.slot;
                this.equipmentManager.handleDrop(slotType, e);
                this.updateDisplay();
            }
        });

        // Visual feedback for drag operations
        this.container.addEventListener('dragenter', (e) => {
            if (e.target.closest('.equipment-slot')) {
                e.target.closest('.equipment-slot').classList.add('drag-over');
            }
        });

        this.container.addEventListener('dragleave', (e) => {
            if (e.target.closest('.equipment-slot')) {
                e.target.closest('.equipment-slot').classList.remove('drag-over');
            }
        });
    }

    bindCurrencyEvents() {
        ['pp', 'gp', 'sp', 'cp'].forEach(currency => {
            const input = this.container.querySelector(`#${currency}Input`);
            input?.addEventListener('change', () => {
                this.updateCurrency();
            });
        });

        const convertBtn = this.container.querySelector('#convertCurrency');
        convertBtn?.addEventListener('click', () => {
            this.showCurrencyConverter();
        });
    }

    bindActionButtons() {
        const addItemBtn = this.container.querySelector('#addItemBtn');
        addItemBtn?.addEventListener('click', () => {
            this.showAddItemDialog();
        });

        const exportBtn = this.container.querySelector('#exportInventoryBtn');
        exportBtn?.addEventListener('click', () => {
            this.exportInventory();
        });

        const importBtn = this.container.querySelector('#importInventoryBtn');
        importBtn?.addEventListener('click', () => {
            this.showImportDialog();
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        this.container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.container.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.updateInventoryDisplay();
    }

    updateDisplay() {
        this.updateEquipmentSlots();
        this.updateInventoryDisplay();
        this.updateCharacterStats();
        this.updateEncumbranceDisplay();
    }

    updateEquipmentSlots() {
        // Clear all slots first
        this.container.querySelectorAll('.equipment-slot .slot-content').forEach(slot => {
            slot.innerHTML = '<div class="empty-slot">+</div>';
        });

        // Populate equipped items
        Object.entries(this.equipmentManager.equipment).forEach(([slot, item]) => {
            const slotElement = this.container.querySelector(`[data-slot="${slot}"] .slot-content`);
            if (slotElement) {
                slotElement.innerHTML = this.createEquippedItemHTML(item);
            }
        });
    }

    createEquippedItemHTML(item) {
        return `
            <div class="equipped-item" data-item-id="${item.id}">
                <div class="item-icon">
                    <img src="assets/icons/${item.category}/${item.id}.png" 
                         alt="${item.name}" 
                         onerror="this.src='assets/icons/default.png'">
                </div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    ${item.enhancement ? `<div class="item-enhancement">+${item.enhancement}</div>` : ''}
                </div>
                <div class="item-actions">
                    <button class="unequip-btn" onclick="inventoryInterface.unequipItem('${item.slot}')">
                        ✕
                    </button>
                </div>
            </div>
        `;
    }

    updateInventoryDisplay() {
        const inventoryGrid = this.container.querySelector('#inventoryGrid');
        if (!inventoryGrid) return;

        let items = [...this.equipmentManager.inventory];

        // Apply filter
        if (this.currentFilter !== 'all') {
            items = items.filter(item => item.category === this.currentFilter);
        }

        // Apply sort
        items.sort((a, b) => {
            switch (this.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'type':
                    return a.category.localeCompare(b.category);
                case 'weight':
                    return (a.weight || 0) - (b.weight || 0);
                case 'value':
                    return (a.cost || 0) - (b.cost || 0);
                default:
                    return 0;
            }
        });

        inventoryGrid.innerHTML = items.map(item => this.createInventoryItemHTML(item)).join('');
    }

    createInventoryItemHTML(item) {
        return `
            <div class="inventory-item" 
                 draggable="true" 
                 data-item-data='${JSON.stringify(item)}'
                 data-item-id="${item.id}">
                <div class="item-icon">
                    <img src="assets/icons/${item.category}/${item.id}.png" 
                         alt="${item.name}"
                         onerror="this.src='assets/icons/default.png'">
                    ${item.quantity > 1 ? `<div class="quantity-badge">${item.quantity}</div>` : ''}
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-stats">
                        ${item.damage ? `<span class="damage">${item.damage.medium}</span>` : ''}
                        ${item.armorBonus ? `<span class="ac">AC +${item.armorBonus}</span>` : ''}
                        ${item.weight ? `<span class="weight">${item.weight} lbs</span>` : ''}
                    </div>
                    <div class="item-value">
                        ${item.cost ? `${item.cost} gp` : ''}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="action-btn small" onclick="inventoryInterface.useItem('${item.id}')">Use</button>
                    <button class="action-btn small" onclick="inventoryInterface.dropItem('${item.id}')">Drop</button>
                </div>
            </div>
        `;
    }

    updateCharacterStats() {
        if (!this.equipmentManager.character) return;

        const character = this.equipmentManager.character;
        
        // Update AC values
        document.getElementById('acValue').textContent = character.combat?.armorClass || 10;
        document.getElementById('touchAcValue').textContent = character.combat?.touchAC || 10;
        document.getElementById('flatFootedAcValue').textContent = character.combat?.flatFootedAC || 10;

        // Update equipment effects
        const equipmentEffects = this.calculateEquipmentEffects();
        document.getElementById('maxDexValue').textContent = equipmentEffects.maxDex !== null ? `+${equipmentEffects.maxDex}` : '—';
        document.getElementById('checkPenaltyValue').textContent = equipmentEffects.checkPenalty;
        document.getElementById('spellFailureValue').textContent = `${equipmentEffects.spellFailure}%`;
    }

    calculateEquipmentEffects() {
        let maxDex = null;
        let checkPenalty = 0;
        let spellFailure = 0;

        Object.values(this.equipmentManager.equipment).forEach(item => {
            if (item.maxDex !== null && item.maxDex !== undefined) {
                maxDex = maxDex === null ? item.maxDex : Math.min(maxDex, item.maxDex);
            }
            checkPenalty += item.checkPenalty || 0;
            spellFailure += item.spellFailure || 0;
        });

        return { maxDex, checkPenalty, spellFailure };
    }

    updateEncumbranceDisplay() {
        const encumbrance = this.equipmentManager.encumbrance;
        const progressBar = this.container.querySelector('#encumbranceBar');
        const statusText = this.container.querySelector('#encumbranceText');
        const totalWeight = this.container.querySelector('#totalWeight');

        if (progressBar && statusText && totalWeight) {
            const percentage = Math.min(100, (encumbrance.current / encumbrance.heavy) * 100);
            progressBar.style.width = `${percentage}%`;
            
            // Color coding
            if (encumbrance.level === 'light') {
                progressBar.className = 'encumbrance-fill light';
                statusText.textContent = `Light Load (${encumbrance.current}/${encumbrance.light} lbs)`;
            } else if (encumbrance.level === 'medium') {
                progressBar.className = 'encumbrance-fill medium';
                statusText.textContent = `Medium Load (${encumbrance.current}/${encumbrance.medium} lbs)`;
            } else if (encumbrance.level === 'heavy') {
                progressBar.className = 'encumbrance-fill heavy';
                statusText.textContent = `Heavy Load (${encumbrance.current}/${encumbrance.heavy} lbs)`;
            } else {
                progressBar.className = 'encumbrance-fill overloaded';
                statusText.textContent = `Overloaded! (${encumbrance.current} lbs)`;
            }

            totalWeight.textContent = encumbrance.current;
        }
    }

    // Action Methods
    unequipItem(slot) {
        const result = this.equipmentManager.unequipItem(slot);
        if (result.success) {
            this.updateDisplay();
            this.showMessage(result.message, 'success');
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    useItem(itemId) {
        // Placeholder for item usage
        console.log(`Using item: ${itemId}`);
        this.showMessage('Item usage not yet implemented', 'info');
    }

    dropItem(itemId) {
        if (confirm('Are you sure you want to drop this item?')) {
            const result = this.equipmentManager.removeFromInventory(itemId);
            if (result.success) {
                this.updateDisplay();
                this.showMessage(result.message, 'success');
            }
        }
    }

    applyPreset(presetName) {
        if (confirm(`Apply ${presetName} equipment preset? This will replace current equipment.`)) {
            const result = this.equipmentManager.applyEquipmentPreset(presetName);
            if (result.success) {
                this.updateDisplay();
                this.showMessage(result.message, 'success');
            } else {
                this.showMessage(result.message, 'error');
            }
        }
    }

    filterInventory(searchTerm) {
        const items = this.container.querySelectorAll('.inventory-item');
        items.forEach(item => {
            const itemName = item.querySelector('.item-name').textContent.toLowerCase();
            if (itemName.includes(searchTerm.toLowerCase())) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    updateCurrency() {
        const currencies = {};
        ['pp', 'gp', 'sp', 'cp'].forEach(currency => {
            const input = this.container.querySelector(`#${currency}Input`);
            currencies[currency] = parseInt(input.value) || 0;
        });

        if (this.equipmentManager.character) {
            this.equipmentManager.character.currency = currencies;
            this.equipmentManager.calculateEncumbrance();
            this.updateEncumbranceDisplay();
        }
    }

    showAddItemDialog() {
        // Create modal dialog for adding items
        const dialog = document.createElement('div');
        dialog.className = 'modal-overlay';
        dialog.innerHTML = `
            <div class="modal-dialog add-item-dialog">
                <div class="modal-header">
                    <h3>Add Item to Inventory</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="item-categories">
                        <button class="category-btn active" data-category="weapons">Weapons</button>
                        <button class="category-btn" data-category="armor">Armor</button>
                        <button class="category-btn" data-category="gear">Gear</button>
                        <button class="category-btn" data-category="specialItems">Special</button>
                    </div>
                    <div class="item-search">
                        <input type="text" id="itemSearch" placeholder="Search items...">
                    </div>
                    <div class="item-list" id="addItemList">
                        <!-- Dynamic item list -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        this.populateAddItemDialog('weapons');

        // Bind dialog events
        dialog.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                dialog.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                this.populateAddItemDialog(e.target.dataset.category);
            }
            if (e.target.classList.contains('add-item-btn')) {
                this.addItemFromDialog(e.target.dataset.itemKey, e.target.dataset.category);
            }
        });
    }

    populateAddItemDialog(category) {
        const itemList = document.getElementById('addItemList');
        if (!itemList) return;

        const items = this.equipmentManager.srdData[category] || {};
        
        itemList.innerHTML = Object.entries(items).map(([key, item]) => `
            <div class="add-item-option">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">
                        ${item.cost ? `${item.cost} gp` : 'Free'} 
                        ${item.weight ? `• ${item.weight} lbs` : ''}
                        ${item.damage ? `• ${item.damage.medium} dmg` : ''}
                        ${item.armorBonus ? `• +${item.armorBonus} AC` : ''}
                    </div>
                </div>
                <button class="add-item-btn" data-item-key="${key}" data-category="${category}">Add</button>
            </div>
        `).join('');
    }

    addItemFromDialog(itemKey, category) {
        const itemData = this.equipmentManager.srdData[category][itemKey];
        if (itemData) {
            const item = { ...itemData, id: this.equipmentManager.generateItemId(), category };
            this.equipmentManager.addToInventory(item);
            this.updateDisplay();
            this.showMessage(`${item.name} added to inventory`, 'success');
        }
    }

    exportInventory() {
        const data = this.equipmentManager.exportEquipmentData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('Inventory exported successfully', 'success');
    }

    showImportDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        const result = this.equipmentManager.importEquipmentData(data);
                        if (result.success) {
                            this.updateDisplay();
                            this.showMessage(result.message, 'success');
                        }
                    } catch (error) {
                        this.showMessage('Invalid file format', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    showMessage(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
}

// Global instance for HTML integration
let inventoryInterface = null;

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryInterface;
} else if (typeof window !== 'undefined') {
    window.InventoryInterface = InventoryInterface;
}
/**
 * RulzLawyer Inventory Management System - Extended Methods
 * Additional functionality for drag-drop, virtual scrolling, accessibility, and mobile support
 * 
 * This file contains the remaining methods for the InventoryManagementSystem class
 * Part 2 of the complete inventory management implementation
 */

// === Drag and Drop Implementation ===
InventoryManagementSystem.prototype.handleItemDragStart = function(event, item) {
    this.state.draggedItem = item;
    event.dataTransfer.setData('text/plain', item.id);
    event.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback
    event.target.classList.add('dragging');
    
    console.log('🖱️  Started dragging:', item.name);
};

InventoryManagementSystem.prototype.handleItemDragEnd = function(event) {
    // Remove visual feedback
    event.target.classList.remove('dragging');
    this.state.draggedItem = null;
    
    // Remove any drag-over states
    this.elements.equipmentSlots.querySelectorAll('.equipment-slot').forEach(slot => {
        slot.classList.remove('drag-over');
    });
};

InventoryManagementSystem.prototype.handleSlotDragOver = function(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    // Add visual feedback
    event.currentTarget.classList.add('drag-over');
};

InventoryManagementSystem.prototype.handleSlotDrop = function(event) {
    event.preventDefault();
    
    const slotElement = event.currentTarget;
    const slotId = slotElement.dataset.slot;
    const itemId = event.dataTransfer.getData('text/plain');
    
    // Remove visual feedback
    slotElement.classList.remove('drag-over');
    
    // Attempt to equip the item
    if (itemId && slotId) {
        this.equipItem(itemId, slotId);
    }
};

// === Virtual Scrolling Implementation ===
InventoryManagementSystem.prototype.setupVirtualScrolling = function() {
    this.elements.grid.addEventListener('scroll', this.throttle(() => {
        this.updateVirtualScroll();
    }, 16)); // 60fps throttling
    
    // Initial calculation
    this.updateVirtualScrollParams();
};

InventoryManagementSystem.prototype.updateVirtualScrollParams = function() {
    const container = this.elements.grid;
    const containerHeight = container.clientHeight;
    const itemHeight = this.virtualScrollState.itemHeight;
    
    this.virtualScrollState.containerHeight = containerHeight;
    this.virtualScrollState.visibleItems = Math.ceil(containerHeight / itemHeight) + 2; // Buffer
};

InventoryManagementSystem.prototype.updateVirtualScroll = function() {
    const scrollTop = this.elements.grid.scrollTop;
    const itemHeight = this.virtualScrollState.itemHeight;
    
    this.virtualScrollState.startIndex = Math.floor(scrollTop / itemHeight);
    this.virtualScrollState.endIndex = this.virtualScrollState.startIndex + this.virtualScrollState.visibleItems;
    
    // Re-render visible items
    this.renderVirtualScrollItems(this.getFilteredAndSortedItems());
};

InventoryManagementSystem.prototype.renderVirtualScrollItems = function(items) {
    const container = this.elements.grid;
    const startIndex = this.virtualScrollState.startIndex;
    const endIndex = Math.min(this.virtualScrollState.endIndex, items.length);
    
    // Create virtual scroll container
    const totalHeight = items.length * this.virtualScrollState.itemHeight;
    const visibleItems = items.slice(startIndex, endIndex);
    
    container.innerHTML = `
        <div style="height: ${startIndex * this.virtualScrollState.itemHeight}px;"></div>
        ${visibleItems.map(item => this.createItemElement(item).outerHTML).join('')}
        <div style="height: ${(items.length - endIndex) * this.virtualScrollState.itemHeight}px;"></div>
    `;
    
    // Re-attach event listeners to new elements
    this.attachItemEventListeners(container);
};

// === Bulk Operations ===
InventoryManagementSystem.prototype.toggleBulkMode = function() {
    this.state.bulkMode = !this.state.bulkMode;
    
    const bulkBtn = document.getElementById('bulkModeBtn');
    const selectionInfo = document.getElementById('selectionInfo');
    
    if (this.state.bulkMode) {
        bulkBtn.classList.add('active');
        selectionInfo.style.display = 'flex';
    } else {
        bulkBtn.classList.remove('active');
        selectionInfo.style.display = 'none';
        this.clearSelection();
    }
    
    this.updateInventoryDisplay();
    console.log('📦 Bulk mode:', this.state.bulkMode ? 'enabled' : 'disabled');
};

InventoryManagementSystem.prototype.equipSelectedItems = function(slotId) {
    const selectedItems = Array.from(this.state.selectedItems);
    let equipped = 0;
    
    for (const itemId of selectedItems) {
        if (this.equipItem(itemId, slotId)) {
            equipped++;
            this.state.selectedItems.delete(itemId);
        }
    }
    
    if (equipped > 0) {
        this.showNotification(`Equipped ${equipped} item${equipped > 1 ? 's' : ''}`, 'success');
        this.updateItemSelection();
    }
};

InventoryManagementSystem.prototype.deleteSelectedItems = function() {
    const selectedItems = Array.from(this.state.selectedItems);
    
    if (selectedItems.length === 0) return;
    
    if (confirm(`Delete ${selectedItems.length} selected item${selectedItems.length > 1 ? 's' : ''}?`)) {
        let deleted = 0;
        
        for (const itemId of selectedItems) {
            if (this.removeItem(itemId)) {
                deleted++;
            }
        }
        
        this.clearSelection();
        this.showNotification(`Deleted ${deleted} item${deleted > 1 ? 's' : ''}`, 'info');
    }
};

// === Search and Filter Enhancement ===
InventoryManagementSystem.prototype.getFilteredAndSortedItems = function() {
    return this.getSortedItems(this.getFilteredItems());
};

InventoryManagementSystem.prototype.debounceFilterUpdate = function() {
    if (this.filterTimeout) {
        clearTimeout(this.filterTimeout);
    }
    
    this.filterTimeout = setTimeout(() => {
        this.updateInventoryDisplay();
    }, 300);
};

// === View Switching ===
InventoryManagementSystem.prototype.switchView = function(viewType) {
    if (this.state.view === viewType) return;
    
    this.state.view = viewType;
    
    // Update view buttons
    this.elements.container.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewType);
        btn.setAttribute('aria-selected', btn.dataset.view === viewType);
    });
    
    // Update grid classes
    this.elements.grid.className = `inventory-grid ${viewType}-view`;
    
    // Show/hide equipment panel for equipment view
    const equipmentPanel = document.getElementById('equipmentPanel');
    if (viewType === 'equipment') {
        equipmentPanel.style.display = 'block';
        this.elements.container.querySelector('.inventory-main').style.gridTemplateColumns = '350px 1fr';
    } else {
        equipmentPanel.style.display = viewType === 'equipment' ? 'block' : 'block'; // Always show for now
    }
    
    this.updateInventoryDisplay();
    console.log('👁️  Switched to view:', viewType);
};

// === Auto-Sort Functionality ===
InventoryManagementSystem.prototype.autoSortInventory = function() {
    if (!this.options.enableAutoSort) return;
    
    console.log('🔄 Auto-sorting inventory...');
    
    // Sort by category, then by name
    this.state.inventory.sort((a, b) => {
        const categoryOrder = ['weapon', 'armor', 'magic', 'gear', 'tool', 'container'];
        const aCategoryIndex = categoryOrder.indexOf(a.category);
        const bCategoryIndex = categoryOrder.indexOf(b.category);
        
        if (aCategoryIndex !== bCategoryIndex) {
            return aCategoryIndex - bCategoryIndex;
        }
        
        return a.name.localeCompare(b.name);
    });
    
    this.saveInventoryToCharacter();
    this.updateInventoryDisplay();
    this.showNotification('Inventory sorted automatically', 'success');
};

// === Modal Management ===
InventoryManagementSystem.prototype.showAddItemModal = function() {
    const modal = document.getElementById('addItemModal');
    modal.style.display = 'flex';
    
    // Focus the first input
    setTimeout(() => {
        const firstInput = modal.querySelector('select, input');
        if (firstInput) firstInput.focus();
    }, 100);
    
    // Populate equipment options
    this.updateItemTypeOptions('');
    
    console.log('➕ Opened add item modal');
};

InventoryManagementSystem.prototype.hideAddItemModal = function() {
    const modal = document.getElementById('addItemModal');
    modal.style.display = 'none';
    
    // Reset form
    document.getElementById('addItemForm').reset();
    
    console.log('✖️  Closed add item modal');
};

InventoryManagementSystem.prototype.updateItemTypeOptions = function(category) {
    const typeSelect = document.getElementById('itemType');
    typeSelect.innerHTML = '<option value="">Select Type...</option>';
    
    if (!category || !this.equipmentSystem) return;
    
    // Get available items from equipment system
    let items = [];
    
    switch (category) {
        case 'weapon':
            items = Array.from(this.equipmentSystem.weapons.keys());
            break;
        case 'armor':
            items = [...Array.from(this.equipmentSystem.armor.keys()), ...Array.from(this.equipmentSystem.shields.keys())];
            break;
        case 'magic':
            items = Array.from(this.equipmentSystem.magicItems.keys());
            break;
        case 'gear':
        case 'tool':
        case 'container':
            items = Array.from(this.equipmentSystem.adventuringGear.keys()).filter(item => {
                const itemData = this.equipmentSystem.adventuringGear.get(item);
                return itemData && itemData.category === category;
            });
            break;
    }
    
    items.sort().forEach(itemName => {
        const option = document.createElement('option');
        option.value = itemName;
        option.textContent = itemName;
        typeSelect.appendChild(option);
    });
};

InventoryManagementSystem.prototype.addItemFromForm = function() {
    const form = document.getElementById('addItemForm');
    const formData = new FormData(form);
    
    const category = formData.get('itemCategory');
    const type = formData.get('itemType');
    const customName = formData.get('itemName');
    const quantity = parseInt(formData.get('itemQuantity')) || 1;
    const enhancement = parseInt(formData.get('itemEnhancement')) || 0;
    const material = formData.get('itemMaterial');
    
    if (!category || !type) {
        this.showNotification('Please select both category and type', 'error');
        return;
    }
    
    // Get base item data from equipment system
    let baseItem = null;
    
    switch (category) {
        case 'weapon':
            baseItem = this.equipmentSystem.weapons.get(type);
            break;
        case 'armor':
            baseItem = this.equipmentSystem.armor.get(type) || this.equipmentSystem.shields.get(type);
            break;
        case 'magic':
            baseItem = this.equipmentSystem.magicItems.get(type);
            break;
        default:
            baseItem = this.equipmentSystem.adventuringGear.get(type);
    }
    
    if (!baseItem) {
        this.showNotification('Item type not found', 'error');
        return;
    }
    
    // Create new item
    const newItem = {
        ...baseItem,
        name: customName || baseItem.name,
        quantity: quantity,
        enhancement: enhancement,
        material: material,
        category: category,
        type: category
    };
    
    // Apply material modifications
    if (material && material !== 'standard') {
        this.applyMaterialModifications(newItem, material);
    }
    
    // Apply enhancement modifications
    if (enhancement > 0) {
        this.applyEnhancementModifications(newItem, enhancement);
    }
    
    // Add to inventory
    this.addItem(newItem);
    
    // Close modal
    this.hideAddItemModal();
};

// === Material and Enhancement System ===
InventoryManagementSystem.prototype.applyMaterialModifications = function(item, material) {
    const materialMods = {
        masterwork: {
            costMultiplier: 1.5,
            description: 'Masterwork quality provides +1 enhancement bonus to attack rolls (weapons) or -1 armor check penalty (armor)'
        },
        mithril: {
            costMultiplier: 5,
            weightMultiplier: 0.5,
            description: 'Mithril is lighter than normal metals and provides additional benefits'
        },
        adamantine: {
            costMultiplier: 10,
            description: 'Adamantine weapons and armor have exceptional hardness and durability'
        },
        silver: {
            costMultiplier: 2,
            description: 'Silver weapons are effective against lycanthropes and some undead'
        },
        'cold-iron': {
            costMultiplier: 2,
            description: 'Cold iron weapons are effective against fey creatures and some outsiders'
        }
    };
    
    const mod = materialMods[material];
    if (mod) {
        if (mod.costMultiplier) {
            item.cost = Math.floor((item.cost || 0) * mod.costMultiplier);
        }
        if (mod.weightMultiplier) {
            item.weight = Math.floor((item.weight || 0) * mod.weightMultiplier * 10) / 10;
        }
        
        item.description = (item.description || '') + ' ' + mod.description;
    }
};

InventoryManagementSystem.prototype.applyEnhancementModifications = function(item, enhancement) {
    item.enhancement = enhancement;
    
    // Enhancement cost: (enhancement^2 × 2000) + base cost
    const enhancementCost = enhancement * enhancement * 2000;
    item.cost = (item.cost || 0) + enhancementCost;
    
    // Update name to include enhancement
    if (!item.name.includes(`+${enhancement}`)) {
        item.name = `+${enhancement} ${item.name}`;
    }
    
    // Apply enhancement bonuses based on item type
    if (item.type === 'weapon') {
        item.attackBonus = (item.attackBonus || 0) + enhancement;
        item.damageBonus = (item.damageBonus || 0) + enhancement;
    } else if (item.type === 'armor') {
        item.acBonus = (item.acBonus || 0) + enhancement;
    }
};

// === Item Event Management ===
InventoryManagementSystem.prototype.setupItemEvents = function(element, item) {
    const checkbox = element.querySelector('.item-checkbox input');
    const equipBtn = element.querySelector('.equip-btn');
    const unequipBtn = element.querySelector('.unequip-btn');
    const removeBtn = element.querySelector('.remove-btn');
    
    // Checkbox for bulk selection
    if (checkbox) {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.selectItem(item.id);
            } else {
                this.deselectItem(item.id);
            }
        });
    }
    
    // Equip button
    if (equipBtn) {
        equipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showEquipmentSlotSelector(item.id);
        });
    }
    
    // Unequip button
    if (unequipBtn) {
        unequipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.unequipItem(item.id);
        });
    }
    
    // Remove button
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Remove ${item.name} from inventory?`)) {
                this.removeItem(item.id);
            }
        });
    }
    
    // Item click for details
    element.addEventListener('click', () => {
        this.showItemDetails(item);
    });
    
    // Tooltip events
    element.addEventListener('mouseenter', (e) => {
        this.showItemTooltip(e, item);
    });
    
    element.addEventListener('mouseleave', () => {
        this.hideItemTooltip();
    });
};

InventoryManagementSystem.prototype.attachItemEventListeners = function(container) {
    // Re-attach event listeners after virtual scroll update
    container.querySelectorAll('.inventory-item').forEach(itemElement => {
        const itemId = itemElement.dataset.itemId;
        const item = this.state.inventory.find(i => i.id === itemId);
        if (item) {
            this.setupItemEvents(itemElement, item);
        }
    });
};

// === Tooltip System ===
InventoryManagementSystem.prototype.showItemTooltip = function(event, item) {
    const tooltip = document.getElementById('itemTooltip');
    
    tooltip.innerHTML = this.generateTooltipHTML(item);
    tooltip.style.display = 'block';
    
    // Position tooltip
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.right + 10 + 'px';
    tooltip.style.top = rect.top + 'px';
    
    // Adjust if tooltip goes off screen
    setTimeout(() => {
        const tooltipRect = tooltip.getBoundingClientRect();
        if (tooltipRect.right > window.innerWidth) {
            tooltip.style.left = rect.left - tooltipRect.width - 10 + 'px';
        }
        if (tooltipRect.bottom > window.innerHeight) {
            tooltip.style.top = rect.bottom - tooltipRect.height + 'px';
        }
    }, 1);
};

InventoryManagementSystem.prototype.hideItemTooltip = function() {
    const tooltip = document.getElementById('itemTooltip');
    tooltip.style.display = 'none';
};

InventoryManagementSystem.prototype.generateTooltipHTML = function(item) {
    return `
        <div class="tooltip-content">
            <h4 class="tooltip-title">${item.name}</h4>
            <div class="tooltip-meta">
                <span class="tooltip-category">${this.formatCategory(item.category)}</span>
                ${item.enhancement ? `<span class="tooltip-enhancement">+${item.enhancement}</span>` : ''}
            </div>
            
            ${item.damage ? `
                <div class="tooltip-stat">
                    <strong>Damage:</strong> ${item.damage.medium || item.damage}
                </div>
            ` : ''}
            
            ${item.acBonus ? `
                <div class="tooltip-stat">
                    <strong>AC Bonus:</strong> +${item.acBonus}
                </div>
            ` : ''}
            
            ${item.weight ? `
                <div class="tooltip-stat">
                    <strong>Weight:</strong> ${item.weight} lbs
                </div>
            ` : ''}
            
            ${item.cost ? `
                <div class="tooltip-stat">
                    <strong>Value:</strong> ${item.cost} gp
                </div>
            ` : ''}
            
            ${item.description ? `
                <div class="tooltip-description">
                    ${item.description}
                </div>
            ` : ''}
        </div>
    `;
};

// === Selection Management ===
InventoryManagementSystem.prototype.updateItemSelection = function() {
    const selectedCount = this.state.selectedItems.size;
    const selectionInfo = document.getElementById('selectionInfo');
    
    if (selectedCount > 0) {
        selectionInfo.style.display = 'flex';
        selectionInfo.querySelector('.selected-count').textContent = 
            `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected`;
    } else if (!this.state.bulkMode) {
        selectionInfo.style.display = 'none';
    }
    
    // Update checkboxes
    this.elements.grid.querySelectorAll('.inventory-item').forEach(itemElement => {
        const itemId = itemElement.dataset.itemId;
        const checkbox = itemElement.querySelector('.item-checkbox input');
        const content = itemElement.querySelector('.item-content');
        
        if (checkbox) {
            checkbox.checked = this.state.selectedItems.has(itemId);
        }
        
        if (content) {
            content.classList.toggle('selected', this.state.selectedItems.has(itemId));
        }
    });
};

// === Accessibility Features ===
InventoryManagementSystem.prototype.setupAccessibilityFeatures = function() {
    // Keyboard navigation
    this.setupKeyboardNavigation();
    
    // Screen reader announcements
    this.setupScreenReaderSupport();
    
    // Focus management
    this.setupFocusManagement();
    
    console.log('♿ Accessibility features enabled');
};

InventoryManagementSystem.prototype.setupKeyboardNavigation = function() {
    // Grid navigation with arrow keys
    this.elements.grid.addEventListener('keydown', (e) => {
        const focusedItem = document.activeElement.closest('.inventory-item');
        if (!focusedItem) return;
        
        let targetItem = null;
        
        switch (e.key) {
            case 'ArrowRight':
                targetItem = focusedItem.nextElementSibling;
                break;
            case 'ArrowLeft':
                targetItem = focusedItem.previousElementSibling;
                break;
            case 'ArrowDown':
                // Move to item in next row (approximate)
                const gridCols = this.getGridColumnCount();
                const currentIndex = Array.from(focusedItem.parentNode.children).indexOf(focusedItem);
                targetItem = focusedItem.parentNode.children[currentIndex + gridCols];
                break;
            case 'ArrowUp':
                // Move to item in previous row (approximate)
                const gridColsUp = this.getGridColumnCount();
                const currentIndexUp = Array.from(focusedItem.parentNode.children).indexOf(focusedItem);
                targetItem = focusedItem.parentNode.children[currentIndexUp - gridColsUp];
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (e.ctrlKey || e.metaKey) {
                    // Toggle selection
                    const itemId = focusedItem.dataset.itemId;
                    if (this.state.selectedItems.has(itemId)) {
                        this.deselectItem(itemId);
                    } else {
                        this.selectItem(itemId);
                    }
                } else {
                    // Show item details
                    const itemId = focusedItem.dataset.itemId;
                    const item = this.state.inventory.find(i => i.id === itemId);
                    if (item) {
                        this.showItemDetails(item);
                    }
                }
                break;
        }
        
        if (targetItem) {
            e.preventDefault();
            targetItem.focus();
        }
    });
    
    // Make inventory items focusable
    this.elements.grid.querySelectorAll('.inventory-item').forEach(item => {
        item.tabIndex = 0;
    });
};

InventoryManagementSystem.prototype.getGridColumnCount = function() {
    const gridStyle = window.getComputedStyle(this.elements.grid);
    const gridColumns = gridStyle.gridTemplateColumns.split(' ').length;
    return gridColumns;
};

InventoryManagementSystem.prototype.setupScreenReaderSupport = function() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'inventory-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    
    document.body.appendChild(liveRegion);
    this.liveRegion = liveRegion;
};

InventoryManagementSystem.prototype.announceToScreenReader = function(message) {
    if (this.liveRegion) {
        this.liveRegion.textContent = message;
    }
};

InventoryManagementSystem.prototype.setupFocusManagement = function() {
    // Trap focus in modal
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('addItemModal');
        if (modal.style.display !== 'none' && e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll(
                'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
};

// === Utility Functions ===
InventoryManagementSystem.prototype.throttle = function(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
};

InventoryManagementSystem.prototype.updateInventorySummary = function() {
    const totalItems = this.state.inventory.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalValue = this.state.inventory.reduce((sum, item) => sum + ((item.cost || 0) * (item.quantity || 1)), 0);
    
    document.getElementById('totalItems').textContent = `${totalItems} items`;
    document.getElementById('totalValue').textContent = `${totalValue} gp value`;
};

InventoryManagementSystem.prototype.showEquipmentSlotSelector = function(itemId) {
    const item = this.state.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    // Find suitable slots for this item
    const suitableSlots = [];
    for (const [slotId, slotData] of Object.entries(this.equipmentSlots)) {
        if (this.canEquipItemInSlot(item, slotData)) {
            suitableSlots.push({ id: slotId, data: slotData });
        }
    }
    
    if (suitableSlots.length === 0) {
        this.showNotification(`${item.name} cannot be equipped in any slot`, 'error');
        return;
    }
    
    if (suitableSlots.length === 1) {
        // Auto-equip to the only suitable slot
        this.equipItem(itemId, suitableSlots[0].id);
    } else {
        // Show slot selection (for now, use first suitable slot)
        this.equipItem(itemId, suitableSlots[0].id);
    }
};

InventoryManagementSystem.prototype.showItemDetails = function(item) {
    // Create a detailed item view (could be a modal or side panel)
    console.log('📋 Showing details for:', item.name, item);
    
    // For now, show in notification
    this.showNotification(`${item.name} - ${this.formatCategory(item.category)}`, 'info');
};

// Export additional methods if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports.InventoryManagementSystemMethods = {
        handleItemDragStart: InventoryManagementSystem.prototype.handleItemDragStart,
        handleItemDragEnd: InventoryManagementSystem.prototype.handleItemDragEnd,
        handleSlotDragOver: InventoryManagementSystem.prototype.handleSlotDragOver,
        handleSlotDrop: InventoryManagementSystem.prototype.handleSlotDrop,
        // ... other methods would be included here
    };
}
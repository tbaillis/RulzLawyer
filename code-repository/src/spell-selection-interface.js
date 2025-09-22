/**
 * SpellSelectionInterface - Modern D&D 3.5 Spell Selection System
 * Provides comprehensive spell management UI with D&D Beyond-inspired design
 */

class SpellSelectionInterface {
    constructor(spellManager, targetContainer) {
        this.spellManager = spellManager;
        this.container = targetContainer;
        this.currentCharacter = null;
        this.currentClass = null;
        this.selectedSpells = {};
        this.filterOptions = {
            school: 'all',
            level: 'all',
            search: ''
        };
        this.initialize();
    }

    initialize() {
        this.createSpellSelectionHTML();
        this.attachEventListeners();
        console.log('🪄 SpellSelectionInterface initialized successfully');
    }

    // ==================== HTML GENERATION ====================

    createSpellSelectionHTML() {
        this.container.innerHTML = `
            <div class="spell-selection-container">
                <div class="spell-selection-header">
                    <h2><i class="icon-magic"></i> Spell Selection</h2>
                    <div class="spell-class-selector">
                        <label>Spellcasting Class:</label>
                        <select id="spellClassSelect" class="form-select">
                            <option value="">Select a spellcasting class...</option>
                        </select>
                    </div>
                </div>

                <div class="spell-selection-content" id="spellSelectionContent" style="display: none;">
                    <!-- Spell Slots Display -->
                    <div class="spell-slots-display" id="spellSlotsDisplay">
                        <h3>Spell Slots</h3>
                        <div class="spell-slots-grid" id="spellSlotsGrid"></div>
                    </div>

                    <!-- Spell Filters -->
                    <div class="spell-filters">
                        <div class="filter-group">
                            <label>Search Spells:</label>
                            <input type="text" id="spellSearchInput" class="form-input" placeholder="Search by name or description...">
                        </div>
                        <div class="filter-group">
                            <label>Spell School:</label>
                            <select id="spellSchoolFilter" class="form-select">
                                <option value="all">All Schools</option>
                                <option value="Abjuration">Abjuration</option>
                                <option value="Conjuration">Conjuration</option>
                                <option value="Divination">Divination</option>
                                <option value="Enchantment">Enchantment</option>
                                <option value="Evocation">Evocation</option>
                                <option value="Illusion">Illusion</option>
                                <option value="Necromancy">Necromancy</option>
                                <option value="Transmutation">Transmutation</option>
                                <option value="Universal">Universal</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>Spell Level:</label>
                            <select id="spellLevelFilter" class="form-select">
                                <option value="all">All Levels</option>
                                <option value="0">Cantrips (0-Level)</option>
                                <option value="1">1st Level</option>
                                <option value="2">2nd Level</option>
                                <option value="3">3rd Level</option>
                                <option value="4">4th Level</option>
                                <option value="5">5th Level</option>
                                <option value="6">6th Level</option>
                                <option value="7">7th Level</option>
                                <option value="8">8th Level</option>
                                <option value="9">9th Level</option>
                            </select>
                        </div>
                    </div>

                    <!-- Spell Lists -->
                    <div class="spell-lists-container">
                        <!-- Available Spells -->
                        <div class="spell-list-panel">
                            <h3>Available Spells</h3>
                            <div class="spell-list" id="availableSpellsList"></div>
                        </div>

                        <!-- Selected Spells -->
                        <div class="spell-list-panel">
                            <h3 id="selectedSpellsTitle">Known Spells</h3>
                            <div class="spell-list" id="selectedSpellsList"></div>
                        </div>
                    </div>

                    <!-- Spell Details Modal -->
                    <div class="spell-details-modal" id="spellDetailsModal" style="display: none;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h3 id="spellDetailsTitle"></h3>
                                <button class="modal-close" id="closeSpellDetails">&times;</button>
                            </div>
                            <div class="modal-body" id="spellDetailsBody"></div>
                            <div class="modal-footer">
                                <button class="btn btn-secondary" id="closeModalBtn">Close</button>
                                <button class="btn btn-primary" id="selectSpellBtn" style="display: none;">Select Spell</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== EVENT LISTENERS ====================

    attachEventListeners() {
        // Class selection
        const classSelect = document.getElementById('spellClassSelect');
        classSelect.addEventListener('change', (e) => this.handleClassSelection(e.target.value));

        // Filters
        document.getElementById('spellSearchInput').addEventListener('input', (e) => {
            this.filterOptions.search = e.target.value;
            this.updateSpellLists();
        });

        document.getElementById('spellSchoolFilter').addEventListener('change', (e) => {
            this.filterOptions.school = e.target.value;
            this.updateSpellLists();
        });

        document.getElementById('spellLevelFilter').addEventListener('change', (e) => {
            this.filterOptions.level = e.target.value;
            this.updateSpellLists();
        });

        // Modal controls
        document.getElementById('closeSpellDetails').addEventListener('click', () => this.hideSpellDetails());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.hideSpellDetails());
        document.getElementById('selectSpellBtn').addEventListener('click', () => this.selectSpellFromModal());

        // Close modal when clicking outside
        document.getElementById('spellDetailsModal').addEventListener('click', (e) => {
            if (e.target.id === 'spellDetailsModal') {
                this.hideSpellDetails();
            }
        });
    }

    // ==================== CHARACTER AND CLASS SETUP ====================

    loadCharacter(characterId, characterData) {
        this.currentCharacter = characterId;
        this.spellManager.initializeCharacterSpells(characterId, characterData);
        
        // Populate class selector with spellcasting classes
        const classSelect = document.getElementById('spellClassSelect');
        classSelect.innerHTML = '<option value="">Select a spellcasting class...</option>';
        
        characterData.classes.forEach(classInfo => {
            if (this.spellManager.spellcasterTypes[classInfo.name]) {
                const option = document.createElement('option');
                option.value = classInfo.name;
                option.textContent = `${classInfo.name} (Level ${classInfo.level})`;
                classSelect.appendChild(option);
            }
        });
        
        // Auto-select if only one spellcasting class
        const spellcastingClasses = characterData.classes.filter(c => this.spellManager.spellcasterTypes[c.name]);
        if (spellcastingClasses.length === 1) {
            classSelect.value = spellcastingClasses[0].name;
            this.handleClassSelection(spellcastingClasses[0].name);
        }
    }

    handleClassSelection(className) {
        if (!className) {
            document.getElementById('spellSelectionContent').style.display = 'none';
            return;
        }

        this.currentClass = className;
        document.getElementById('spellSelectionContent').style.display = 'block';
        
        this.updateSpellSlotsDisplay();
        this.updateSelectedSpellsTitle();
        this.updateSpellLists();
    }

    // ==================== SPELL SLOTS DISPLAY ====================

    updateSpellSlotsDisplay() {
        if (!this.currentCharacter || !this.currentClass) return;
        
        const character = this.spellManager.characters[this.currentCharacter];
        const spellSlots = character.spellSlots[this.currentClass] || [];
        const usedSlots = character.usedSpellSlots[this.currentClass] || [];
        
        const slotsGrid = document.getElementById('spellSlotsGrid');
        slotsGrid.innerHTML = '';
        
        spellSlots.forEach((slots, level) => {
            if (slots > 0) {
                const slotGroup = document.createElement('div');
                slotGroup.className = 'spell-slot-group';
                
                const levelLabel = level === 0 ? 'Cantrips' : `${this.getOrdinalNumber(level)} Level`;
                const used = usedSlots[level] || 0;
                const remaining = slots - used;
                
                slotGroup.innerHTML = `
                    <div class="spell-slot-header">
                        <span class="slot-level">${levelLabel}</span>
                        <span class="slot-count">${remaining}/${slots}</span>
                    </div>
                    <div class="spell-slot-dots">
                        ${this.generateSlotDots(slots, used)}
                    </div>
                `;
                
                slotsGrid.appendChild(slotGroup);
            }
        });
    }

    generateSlotDots(total, used) {
        let dots = '';
        for (let i = 0; i < total; i++) {
            const dotClass = i < used ? 'slot-dot used' : 'slot-dot available';
            dots += `<span class="${dotClass}"></span>`;
        }
        return dots;
    }

    updateSelectedSpellsTitle() {
        const spellcasterInfo = this.spellManager.spellcasterTypes[this.currentClass];
        const title = spellcasterInfo?.type === 'spontaneous' ? 'Known Spells' : 'Prepared Spells';
        document.getElementById('selectedSpellsTitle').textContent = title;
    }

    // ==================== SPELL LISTS ====================

    updateSpellLists() {
        if (!this.currentCharacter || !this.currentClass) return;
        
        this.updateAvailableSpells();
        this.updateSelectedSpells();
    }

    updateAvailableSpells() {
        const availableList = document.getElementById('availableSpellsList');
        availableList.innerHTML = '';
        
        // Get all spell levels this class can access
        const character = this.spellManager.characters[this.currentCharacter];
        const spellSlots = character.spellSlots[this.currentClass] || [];
        
        for (let level = 0; level < spellSlots.length; level++) {
            if (spellSlots[level] > 0 || level === 0) {
                const availableSpells = this.spellManager.getAvailableSpells(this.currentCharacter, this.currentClass, level);
                const filteredSpells = this.filterSpells(availableSpells);
                
                if (filteredSpells.length > 0) {
                    this.addSpellLevelSection(availableList, level, filteredSpells, 'available');
                }
            }
        }
    }

    updateSelectedSpells() {
        const selectedList = document.getElementById('selectedSpellsList');
        selectedList.innerHTML = '';
        
        const character = this.spellManager.characters[this.currentCharacter];
        const spellcasterInfo = this.spellManager.spellcasterTypes[this.currentClass];
        
        // Show cantrips
        if (character.cantrips && character.cantrips.length > 0) {
            const cantrips = character.cantrips.map(id => this.spellManager.spells[id]).filter(Boolean);
            this.addSpellLevelSection(selectedList, 0, cantrips, 'selected');
        }
        
        // Show known/prepared spells
        const spellCollection = spellcasterInfo.type === 'spontaneous' ? 
            character.knownSpells[this.currentClass] : 
            character.preparedSpells[this.currentClass];
            
        if (spellCollection) {
            Object.keys(spellCollection).forEach(level => {
                const spellLevel = parseInt(level);
                if (spellLevel > 0) {
                    const spells = spellCollection[level].map(id => this.spellManager.spells[id]).filter(Boolean);
                    if (spells.length > 0) {
                        this.addSpellLevelSection(selectedList, spellLevel, spells, 'selected');
                    }
                }
            });
        }
    }

    addSpellLevelSection(container, level, spells, type) {
        const section = document.createElement('div');
        section.className = 'spell-level-section';
        
        const header = document.createElement('div');
        header.className = 'spell-level-header';
        header.textContent = level === 0 ? 'Cantrips (0-Level)' : `${this.getOrdinalNumber(level)} Level Spells`;
        
        const spellGrid = document.createElement('div');
        spellGrid.className = 'spell-grid';
        
        spells.forEach(spell => {
            const spellCard = this.createSpellCard(spell, type);
            spellGrid.appendChild(spellCard);
        });
        
        section.appendChild(header);
        section.appendChild(spellGrid);
        container.appendChild(section);
    }

    createSpellCard(spell, type) {
        const card = document.createElement('div');
        card.className = `spell-card ${this.getSchoolClass(spell.school)}`;
        card.dataset.spellId = spell.id;
        card.dataset.type = type;
        
        const level = this.getSpellLevel(spell);
        const levelText = level === 0 ? 'Cantrip' : `Level ${level}`;
        
        card.innerHTML = `
            <div class="spell-card-header">
                <div class="spell-name">${spell.name}</div>
                <div class="spell-level">${levelText}</div>
            </div>
            <div class="spell-school">${spell.school}</div>
            <div class="spell-components">${spell.components.join(', ')}</div>
            <div class="spell-casting-time">${spell.castingTime}</div>
            <div class="spell-card-actions">
                <button class="btn-spell-details" data-spell-id="${spell.id}">
                    <i class="icon-info"></i> Details
                </button>
                ${type === 'available' ? 
                    `<button class="btn-select-spell" data-spell-id="${spell.id}" data-spell-level="${level}">
                        <i class="icon-plus"></i> Select
                    </button>` :
                    `<button class="btn-remove-spell" data-spell-id="${spell.id}" data-spell-level="${level}">
                        <i class="icon-minus"></i> Remove
                    </button>`
                }
            </div>
        `;
        
        // Add event listeners
        card.querySelector('.btn-spell-details').addEventListener('click', () => this.showSpellDetails(spell));
        
        const actionBtn = card.querySelector(type === 'available' ? '.btn-select-spell' : '.btn-remove-spell');
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (type === 'available') {
                    this.selectSpell(spell.id, parseInt(e.target.dataset.spellLevel));
                } else {
                    this.removeSpell(spell.id, parseInt(e.target.dataset.spellLevel));
                }
            });
        }
        
        return card;
    }

    // ==================== SPELL FILTERING ====================

    filterSpells(spells) {
        return spells.filter(spell => {
            // Search filter
            if (this.filterOptions.search) {
                const searchTerm = this.filterOptions.search.toLowerCase();
                const matchesSearch = spell.name.toLowerCase().includes(searchTerm) ||
                                   spell.description.toLowerCase().includes(searchTerm) ||
                                   spell.school.toLowerCase().includes(searchTerm);
                if (!matchesSearch) return false;
            }
            
            // School filter
            if (this.filterOptions.school !== 'all' && spell.school !== this.filterOptions.school) {
                return false;
            }
            
            // Level filter
            if (this.filterOptions.level !== 'all') {
                const spellLevel = this.getSpellLevel(spell);
                if (spellLevel !== parseInt(this.filterOptions.level)) {
                    return false;
                }
            }
            
            return true;
        });
    }

    // ==================== SPELL SELECTION ====================

    selectSpell(spellId, spellLevel) {
        const result = this.spellManager.selectSpell(this.currentCharacter, this.currentClass, spellId, spellLevel);
        
        if (result.success) {
            this.showNotification(`Spell selected: ${this.spellManager.spells[spellId].name}`, 'success');
            this.updateSpellLists();
        } else {
            this.showNotification(`Error: ${result.error}`, 'error');
        }
    }

    removeSpell(spellId, spellLevel) {
        const character = this.spellManager.characters[this.currentCharacter];
        const spellcasterInfo = this.spellManager.spellcasterTypes[this.currentClass];
        
        if (spellcasterInfo.type === 'spontaneous') {
            // Remove from known spells
            const knownSpells = character.knownSpells[this.currentClass]?.[spellLevel];
            if (knownSpells) {
                const index = knownSpells.indexOf(spellId);
                if (index > -1) {
                    knownSpells.splice(index, 1);
                    this.showNotification(`Spell removed: ${this.spellManager.spells[spellId].name}`, 'success');
                    this.updateSpellLists();
                }
            }
        } else {
            // Remove from cantrips or prepared spells
            if (spellLevel === 0) {
                const index = character.cantrips.indexOf(spellId);
                if (index > -1) {
                    character.cantrips.splice(index, 1);
                    this.showNotification(`Cantrip removed: ${this.spellManager.spells[spellId].name}`, 'success');
                    this.updateSpellLists();
                }
            }
        }
    }

    // ==================== SPELL DETAILS MODAL ====================

    showSpellDetails(spell) {
        const modal = document.getElementById('spellDetailsModal');
        const title = document.getElementById('spellDetailsTitle');
        const body = document.getElementById('spellDetailsBody');
        
        title.textContent = spell.name;
        body.innerHTML = this.generateSpellDetailsHTML(spell);
        
        modal.style.display = 'flex';
    }

    generateSpellDetailsHTML(spell) {
        const level = this.getSpellLevel(spell);
        const levelText = level === 0 ? 'Cantrip' : `${this.getOrdinalNumber(level)} Level`;
        
        let html = `
            <div class="spell-details">
                <div class="spell-basic-info">
                    <div class="spell-level-school">${levelText} ${spell.school}</div>
                    ${spell.subschool ? `<div class="spell-subschool">${spell.subschool}</div>` : ''}
                    ${spell.descriptor ? `<div class="spell-descriptor">[${spell.descriptor.join(', ')}]</div>` : ''}
                </div>
                
                <div class="spell-mechanics">
                    <div class="spell-stat"><strong>Casting Time:</strong> ${spell.castingTime}</div>
                    <div class="spell-stat"><strong>Range:</strong> ${spell.range}</div>
                    ${spell.target ? `<div class="spell-stat"><strong>Target:</strong> ${spell.target}</div>` : ''}
                    ${spell.area ? `<div class="spell-stat"><strong>Area:</strong> ${spell.area}</div>` : ''}
                    ${spell.effect ? `<div class="spell-stat"><strong>Effect:</strong> ${spell.effect}</div>` : ''}
                    <div class="spell-stat"><strong>Duration:</strong> ${spell.duration}</div>
                    <div class="spell-stat"><strong>Saving Throw:</strong> ${spell.savingThrow}</div>
                    <div class="spell-stat"><strong>Spell Resistance:</strong> ${spell.spellResistance}</div>
                    <div class="spell-stat"><strong>Components:</strong> ${spell.components.join(', ')}</div>
                </div>
                
                <div class="spell-description">
                    <h4>Description</h4>
                    <p>${spell.description}</p>
                </div>
                
                ${spell.materialComponent ? `<div class="spell-component"><strong>Material Component:</strong> ${spell.materialComponent}</div>` : ''}
                ${spell.focus ? `<div class="spell-component"><strong>Focus:</strong> ${spell.focus}</div>` : ''}
                
                <div class="spell-classes">
                    <strong>Classes:</strong> ${spell.classes.join(', ')}
                </div>
            </div>
        `;
        
        return html;
    }

    hideSpellDetails() {
        document.getElementById('spellDetailsModal').style.display = 'none';
    }

    selectSpellFromModal() {
        // Implementation for selecting spell from modal if needed
        this.hideSpellDetails();
    }

    // ==================== UTILITY METHODS ====================

    getSpellLevel(spell) {
        const key = this.spellManager.getSpellLevelKey(this.currentClass);
        return spell.level[key] || 0;
    }

    getSchoolClass(school) {
        return `school-${school.toLowerCase()}`;
    }

    getOrdinalNumber(num) {
        const ordinals = ['0th', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
        return ordinals[num] || `${num}th`;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // ==================== PUBLIC API ====================

    getSelectedSpells() {
        if (!this.currentCharacter) return null;
        return this.spellManager.getCharacterSpellInfo(this.currentCharacter);
    }

    exportSpells() {
        if (!this.currentCharacter) return null;
        return this.spellManager.exportCharacterSpells(this.currentCharacter);
    }

    importSpells(spellData) {
        if (!this.currentCharacter) return false;
        return this.spellManager.importCharacterSpells(this.currentCharacter, spellData);
    }
}

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpellSelectionInterface;
} else if (typeof window !== 'undefined') {
    window.SpellSelectionInterface = SpellSelectionInterface;
}
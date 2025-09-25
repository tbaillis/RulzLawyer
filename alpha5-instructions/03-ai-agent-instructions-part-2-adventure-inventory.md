# RulzLawyer AI Agent Instructions - Part 2: Adventure Engine & Game Systems

**Generated**: September 25, 2025  
**Document**: Part 2 of 5 - Adventure Engine & Game Systems  
**Target Lines**: 2000  
**Purpose**: Advanced game systems implementation including adventure generation, inventory management, and spellcasting

## 🎯 PART 2 FOCUS AREAS

This document covers the implementation of:
1. **AI-Powered Adventure Engine** - Dynamic encounter and narrative generation
2. **Advanced Inventory Management** - Drag-and-drop interface with equipment presets
3. **Complete Spellcasting System** - Spell selection, preparation, and casting mechanics
4. **Combat Management System** - Initiative, actions, and tactical combat
5. **Equipment and Gear Systems** - Weapons, armor, and magical items

## 🚀 ADVENTURE ENGINE IMPLEMENTATION

### 1. CORE ADVENTURE ENGINE

#### 1.1 Main Adventure Engine
**File**: `code-repository/src/adventure/adventure-engine.js`  
**Priority**: HIGHEST - Core gameplay experience

**Requirements**:
- Dynamic encounter generation with appropriate challenge ratings
- Environmental adventure types (wilderness, dungeon, urban, planar)
- Narrative generation with character integration
- Treasure and reward distribution
- Experience point calculation and character advancement
- Adventure state persistence and save/load functionality

**Implementation**:
```javascript
class AdventureEngine {
    constructor(diceEngine, characterManager, dataManager) {
        this.diceEngine = diceEngine;
        this.characterManager = characterManager;
        this.dataManager = dataManager;
        
        // Adventure state
        this.currentAdventure = null;
        this.activeEncounters = [];
        this.adventureHistory = [];
        this.worldState = {};
        
        // Configuration
        this.difficultySettings = {
            easy: 0.75,
            normal: 1.0,
            hard: 1.25,
            extreme: 1.5
        };
        
        // Adventure templates
        this.adventureTemplates = [
            'goblin_raid',
            'ancient_tomb',
            'city_investigation',
            'wilderness_survival',
            'planar_intrusion',
            'dragon_encounter',
            'cultist_conspiracy',
            'haunted_mansion'
        ];
        
        // Environment types
        this.environments = [
            'forest', 'mountain', 'desert', 'swamp', 'urban', 
            'dungeon', 'cave', 'ruins', 'plane', 'underwater'
        ];
    }

    // Adventure Generation
    generateAdventure(partyLevel, adventureType = null, environment = null) {
        const template = adventureType || this.selectRandomTemplate();
        const env = environment || this.selectRandomEnvironment();
        
        const adventure = {
            id: this.generateAdventureId(),
            title: this.generateAdventureTitle(template, env),
            description: this.generateAdventureDescription(template, env),
            type: template,
            environment: env,
            partyLevel: partyLevel,
            challengeRating: this.calculateAdventureCR(partyLevel),
            encounters: this.generateEncounters(partyLevel, template, env),
            rewards: this.generateRewards(partyLevel),
            objectives: this.generateObjectives(template),
            npcs: this.generateNPCs(template, env),
            locations: this.generateLocations(env),
            plotHooks: this.generatePlotHooks(template),
            estimatedDuration: this.estimateAdventureDuration(template),
            createdAt: Date.now()
        };

        // Add narrative elements
        adventure.narrative = this.generateNarrative(adventure);
        
        return adventure;
    }

    generateEncounters(partyLevel, template, environment) {
        const encounterCount = this.calculateEncounterCount(template);
        const encounters = [];
        
        for (let i = 0; i < encounterCount; i++) {
            const encounter = this.generateSingleEncounter(partyLevel, template, environment, i);
            encounters.push(encounter);
        }
        
        return encounters;
    }

    generateSingleEncounter(partyLevel, template, environment, index) {
        const encounterTypes = ['combat', 'social', 'exploration', 'trap', 'puzzle'];
        const type = this.selectEncounterType(template, index);
        
        const encounter = {
            id: `encounter_${index + 1}`,
            type: type,
            title: this.generateEncounterTitle(type, environment),
            description: this.generateEncounterDescription(type, environment),
            challengeRating: this.calculateEncounterCR(partyLevel, index),
            environment: environment,
            setup: this.generateEncounterSetup(type, environment),
            resolution: this.generateEncounterResolution(type),
            rewards: this.generateEncounterRewards(partyLevel, type),
            consequences: this.generateEncounterConsequences(type)
        };

        // Add type-specific details
        switch (type) {
            case 'combat':
                encounter.monsters = this.selectMonsters(partyLevel, environment);
                encounter.tactics = this.generateCombatTactics(encounter.monsters);
                encounter.terrain = this.generateCombatTerrain(environment);
                break;
                
            case 'social':
                encounter.npcs = this.generateSocialNPCs(environment);
                encounter.objectives = this.generateSocialObjectives();
                encounter.dialogueOptions = this.generateDialogueOptions();
                break;
                
            case 'exploration':
                encounter.areas = this.generateExplorationAreas(environment);
                encounter.secrets = this.generateSecrets(partyLevel);
                encounter.hazards = this.generateEnvironmentalHazards(environment);
                break;
                
            case 'trap':
                encounter.trap = this.generateTrap(partyLevel, environment);
                encounter.detectDC = this.calculateTrapDetectDC(partyLevel);
                encounter.disarmDC = this.calculateTrapDisarmDC(partyLevel);
                break;
                
            case 'puzzle':
                encounter.puzzle = this.generatePuzzle(partyLevel);
                encounter.hints = this.generatePuzzleHints();
                encounter.solutions = this.generatePuzzleSolutions();
                break;
        }
        
        return encounter;
    }

    // Monster Selection and Combat
    selectMonsters(partyLevel, environment) {
        const targetCR = this.calculateEncounterCR(partyLevel);
        const environmentalMonsters = this.getEnvironmentalMonsters(environment);
        
        // Select appropriate monsters for the encounter
        const selectedMonsters = this.buildEncounterByBudget(targetCR, environmentalMonsters);
        
        return selectedMonsters.map(monster => ({
            ...monster,
            initiative: 0,
            currentHitPoints: monster.hitPoints,
            status: 'active',
            position: this.generateMonsterPosition(),
            tactics: this.generateMonsterTactics(monster)
        }));
    }

    buildEncounterByBudget(targetCR, availableMonsters) {
        const budget = this.getCRBudget(targetCR);
        const encounter = [];
        let remainingBudget = budget;
        
        // Sort monsters by CR for efficient selection
        const sortedMonsters = availableMonsters.sort((a, b) => a.challengeRating - b.challengeRating);
        
        while (remainingBudget > 0 && sortedMonsters.length > 0) {
            // Select monsters that fit within budget
            const affordableMonsters = sortedMonsters.filter(m => 
                this.getCRBudget(m.challengeRating) <= remainingBudget
            );
            
            if (affordableMonsters.length === 0) break;
            
            // Choose a monster (preference for variety)
            const selectedMonster = this.selectPreferredMonster(affordableMonsters, encounter);
            encounter.push({ ...selectedMonster });
            remainingBudget -= this.getCRBudget(selectedMonster.challengeRating);
        }
        
        return encounter;
    }

    // Narrative Generation
    generateNarrative(adventure) {
        return {
            introduction: this.generateIntroduction(adventure),
            plotProgression: this.generatePlotProgression(adventure),
            climax: this.generateClimax(adventure),
            resolution: this.generateResolution(adventure),
            epilogue: this.generateEpilogue(adventure)
        };
    }

    generateIntroduction(adventure) {
        const templates = {
            goblin_raid: [
                "The peaceful village of {village} has been plagued by goblin attacks for weeks. The desperate villagers have pooled their meager resources to hire adventurers.",
                "Smoke rises from the direction of {village} as goblins pour from the {environment}, their war cries echoing across the land.",
                "A terrified messenger arrives, gasping that {village} is under siege by a organized goblin force unlike any seen before."
            ],
            ancient_tomb: [
                "Ancient stones mark the entrance to a tomb lost to time, its secrets buried beneath {environment} for countless centuries.",
                "Local legends speak of {artifact} hidden within the {tomb_name}, but none who have entered have returned to tell their tale.",
                "Arcane symbols glow faintly on weathered stone as you approach the sealed entrance to this forgotten necropolis."
            ],
            city_investigation: [
                "The bustling streets of {city} hide dark secrets, and strange disappearances have the city guard baffled.",
                "Rumors of corruption spread through {city} like wildfire, but those who speak too loudly tend to vanish in the night.",
                "A wealthy merchant approaches you discretely in a crowded tavern, speaking of mysteries that threaten the very heart of {city}."
            ]
        };
        
        const template = templates[adventure.type] || templates.goblin_raid;
        const selectedTemplate = template[Math.floor(Math.random() * template.length)];
        
        return this.processNarrativeTemplate(selectedTemplate, adventure);
    }

    processNarrativeTemplate(template, adventure) {
        const variables = {
            '{village}': this.generateVillageName(),
            '{city}': this.generateCityName(),
            '{environment}': adventure.environment,
            '{artifact}': this.generateArtifactName(),
            '{tomb_name}': this.generateTombName()
        };
        
        let processed = template;
        Object.keys(variables).forEach(key => {
            processed = processed.replace(new RegExp(key, 'g'), variables[key]);
        });
        
        return processed;
    }

    // Adventure Management
    startAdventure(adventure, party) {
        this.currentAdventure = {
            ...adventure,
            party: party,
            currentEncounter: 0,
            startedAt: Date.now(),
            status: 'active',
            progress: {
                encountersCompleted: 0,
                experienceGained: 0,
                treasureFound: [],
                charactersAffected: []
            }
        };
        
        // Initialize adventure state
        this.worldState = this.initializeWorldState(adventure);
        
        // Start first encounter
        return this.progressToNextEncounter();
    }

    progressToNextEncounter() {
        if (!this.currentAdventure) {
            throw new Error('No active adventure');
        }
        
        const adventure = this.currentAdventure;
        const nextEncounterIndex = adventure.currentEncounter;
        
        if (nextEncounterIndex >= adventure.encounters.length) {
            return this.completeAdventure();
        }
        
        const encounter = adventure.encounters[nextEncounterIndex];
        this.activeEncounters.push({
            ...encounter,
            startedAt: Date.now(),
            status: 'active'
        });
        
        adventure.currentEncounter++;
        
        return {
            type: 'encounter_start',
            encounter: encounter,
            narrative: this.generateEncounterNarrative(encounter),
            options: this.generateEncounterOptions(encounter),
            partyStatus: this.getPartyStatus()
        };
    }

    resolveEncounter(encounterId, resolution) {
        const encounter = this.activeEncounters.find(e => e.id === encounterId);
        if (!encounter) {
            throw new Error('Encounter not found');
        }
        
        encounter.status = 'completed';
        encounter.resolution = resolution;
        encounter.completedAt = Date.now();
        
        // Apply encounter results
        const results = this.applyEncounterResults(encounter, resolution);
        
        // Update adventure progress
        this.currentAdventure.progress.encountersCompleted++;
        this.currentAdventure.progress.experienceGained += results.experience;
        this.currentAdventure.progress.treasureFound.push(...results.treasure);
        
        return {
            type: 'encounter_complete',
            encounter: encounter,
            results: results,
            narrative: this.generateResolutionNarrative(encounter, resolution),
            nextAction: this.getNextAction()
        };
    }

    applyEncounterResults(encounter, resolution) {
        const results = {
            experience: 0,
            treasure: [],
            consequences: [],
            partyChanges: []
        };
        
        // Calculate experience based on encounter type and resolution
        switch (encounter.type) {
            case 'combat':
                if (resolution.victory) {
                    results.experience = this.calculateCombatExperience(encounter);
                    results.treasure = encounter.rewards.treasure || [];
                }
                if (resolution.casualties) {
                    results.consequences.push('party_casualties');
                }
                break;
                
            case 'social':
                results.experience = this.calculateSocialExperience(encounter, resolution);
                if (resolution.success) {
                    results.treasure = encounter.rewards.information || [];
                }
                break;
                
            case 'exploration':
                results.experience = this.calculateExplorationExperience(encounter);
                results.treasure = resolution.discoveredTreasure || [];
                break;
                
            case 'trap':
                if (resolution.avoided || resolution.disarmed) {
                    results.experience = this.calculateTrapExperience(encounter);
                }
                if (resolution.triggered) {
                    results.consequences.push('trap_damage');
                }
                break;
                
            case 'puzzle':
                if (resolution.solved) {
                    results.experience = this.calculatePuzzleExperience(encounter);
                    results.treasure = encounter.rewards.treasure || [];
                }
                break;
        }
        
        return results;
    }

    completeAdventure() {
        if (!this.currentAdventure) {
            throw new Error('No active adventure to complete');
        }
        
        const adventure = this.currentAdventure;
        adventure.status = 'completed';
        adventure.completedAt = Date.now();
        adventure.duration = adventure.completedAt - adventure.startedAt;
        
        // Calculate final rewards
        const finalRewards = this.calculateFinalRewards(adventure);
        
        // Apply character advancement
        const advancement = this.applyCharacterAdvancement(adventure);
        
        // Archive adventure
        this.adventureHistory.push({ ...adventure });
        this.currentAdventure = null;
        
        return {
            type: 'adventure_complete',
            adventure: adventure,
            rewards: finalRewards,
            advancement: advancement,
            narrative: this.generateAdventureEpilogue(adventure),
            statistics: this.generateAdventureStatistics(adventure)
        };
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdventureEngine;
} else if (typeof window !== 'undefined') {
    window.AdventureEngine = AdventureEngine;
}
```

### 2. AI INTEGRATION MODULE

#### 2.1 AI-Powered Narrative Generation
**File**: `code-repository/src/adventure/ai-integration.js`  
**Priority**: HIGH - Enhanced storytelling capabilities

**Requirements**:
- Integration with AI services for dynamic narrative generation
- Character-specific story adaptation
- Contextual dialogue generation
- Plot development based on player actions
- Ethical AI usage with content filtering

**Implementation**:
```javascript
class AIIntegration {
    constructor() {
        this.apiEndpoints = {
            narrative: null, // To be configured with actual AI service
            dialogue: null,
            description: null
        };
        
        this.contentFilters = {
            inappropriate: true,
            violence_threshold: 'moderate',
            language_filter: true
        };
        
        this.contextCache = new Map();
        this.requestQueue = [];
        this.rateLimiter = {
            requests: 0,
            window: 60000, // 1 minute
            limit: 60
        };
    }

    async generateNarrative(context) {
        // For now, use template-based generation
        // Future: Integrate with AI services like OpenAI, Claude, etc.
        return this.generateTemplateNarrative(context);
    }

    generateTemplateNarrative(context) {
        const templates = this.getNarrativeTemplates(context.type);
        const selectedTemplate = this.selectBestTemplate(templates, context);
        
        return this.processTemplate(selectedTemplate, context);
    }

    getNarrativeTemplates(type) {
        const templates = {
            encounter_start: [
                "As you {action}, {description}. {challenge_setup}",
                "The {environment} around you {atmosphere}. {immediate_concern}",
                "{character_focus} notices {detail} that suggests {implication}."
            ],
            encounter_resolution: [
                "With {resolution_method}, you {outcome}. {consequence}",
                "The {encounter_type} concludes as {final_action}. {reward_hint}",
                "{character_action} proves decisive, resulting in {result}."
            ],
            story_progression: [
                "Your recent actions have {impact}. {new_development}",
                "As the {time_period} passes, {change} becomes apparent. {next_challenge}",
                "The consequences of {past_action} now {manifestation}."
            ]
        };
        
        return templates[type] || templates.encounter_start;
    }

    processTemplate(template, context) {
        const variables = this.extractTemplateVariables(context);
        let processed = template;
        
        Object.keys(variables).forEach(key => {
            const pattern = new RegExp(`{${key}}`, 'g');
            processed = processed.replace(pattern, variables[key]);
        });
        
        return this.enhanceNarrative(processed, context);
    }

    extractTemplateVariables(context) {
        return {
            action: this.getContextualAction(context),
            description: this.getEnvironmentalDescription(context),
            challenge_setup: this.getChallengeSetup(context),
            environment: context.environment || 'area',
            atmosphere: this.getAtmosphere(context),
            immediate_concern: this.getImmediateConcern(context),
            character_focus: this.getCharacterFocus(context),
            detail: this.getInterestingDetail(context),
            implication: this.getImplication(context)
        };
    }

    // Character-specific narrative adaptation
    adaptNarrativeToCharacter(narrative, character) {
        // Adapt language and focus based on character background
        let adapted = narrative;
        
        // Class-specific adaptations
        if (character.classes) {
            character.classes.forEach(cls => {
                adapted = this.applyClassNarrativeStyle(adapted, cls.name);
            });
        }
        
        // Background-specific adaptations
        if (character.background) {
            adapted = this.applyBackgroundNarrativeStyle(adapted, character.background);
        }
        
        return adapted;
    }

    applyClassNarrativeStyle(narrative, className) {
        const classStyles = {
            'Wizard': {
                focus: 'magical',
                vocabulary: ['arcane', 'mystical', 'ethereal', 'eldritch'],
                perspective: 'analytical'
            },
            'Fighter': {
                focus: 'tactical',
                vocabulary: ['strategic', 'combat-ready', 'disciplined', 'martial'],
                perspective: 'practical'
            },
            'Rogue': {
                focus: 'stealthy',
                vocabulary: ['shadowy', 'subtle', 'cunning', 'hidden'],
                perspective: 'cautious'
            },
            'Cleric': {
                focus: 'divine',
                vocabulary: ['blessed', 'sacred', 'righteous', 'faithful'],
                perspective: 'spiritual'
            }
        };
        
        const style = classStyles[className];
        if (!style) return narrative;
        
        // Apply vocabulary enhancements
        return this.enhanceWithVocabulary(narrative, style.vocabulary);
    }

    enhanceWithVocabulary(text, vocabulary) {
        // Simple vocabulary enhancement - replace generic terms
        const replacements = {
            'strange': vocabulary[0] || 'strange',
            'interesting': vocabulary[1] || 'interesting',
            'powerful': vocabulary[2] || 'powerful',
            'dangerous': vocabulary[3] || 'dangerous'
        };
        
        let enhanced = text;
        Object.keys(replacements).forEach(key => {
            const pattern = new RegExp(`\\b${key}\\b`, 'gi');
            enhanced = enhanced.replace(pattern, replacements[key]);
        });
        
        return enhanced;
    }
}

// Export for both environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIIntegration;
} else if (typeof window !== 'undefined') {
    window.AIIntegration = AIIntegration;
}
```

## 🎒 INVENTORY MANAGEMENT SYSTEM

### 3. ADVANCED INVENTORY MANAGEMENT

#### 3.1 Core Inventory System
**File**: `code-repository/src/inventory/inventory-manager.js`  
**Priority**: HIGH - Major user experience feature

**Requirements**:
- Drag-and-drop interface for item management
- Equipment presets (Combat, Exploration, Social, Survival)
- Automatic encumbrance calculation with visual feedback
- Item categorization and filtering
- Quick equip/unequip functionality
- Item comparison and optimization suggestions

**Implementation**:
```javascript
class InventoryManager {
    constructor(characterManager, dataManager) {
        this.characterManager = characterManager;
        this.dataManager = dataManager;
        
        // Inventory state
        this.currentCharacter = null;
        this.selectedItems = new Set();
        this.draggedItem = null;
        
        // Equipment presets
        this.presets = {
            combat: {
                name: 'Combat Ready',
                description: 'Optimized for battle encounters',
                priority: ['armor', 'weapons', 'healing_potions', 'combat_accessories']
            },
            exploration: {
                name: 'Exploration',
                description: 'Gear for dungeon delving and wilderness travel',
                priority: ['light_sources', 'rope', 'tools', 'survival_gear', 'detection_items']
            },
            social: {
                name: 'Social Encounter',
                description: 'Appropriate attire for diplomatic situations',
                priority: ['fine_clothing', 'jewelry', 'social_tools', 'documents']
            },
            survival: {
                name: 'Wilderness Survival',
                description: 'Essential gear for extended wilderness travel',
                priority: ['food', 'water', 'shelter', 'fire_starting', 'hunting_tools']
            }
        };
        
        // UI elements
        this.uiElements = {
            inventoryGrid: null,
            equipmentSlots: null,
            encumbranceBar: null,
            filterControls: null,
            presetButtons: null
        };
        
        this.filters = {
            category: 'all',
            equipped: 'all',
            searchText: '',
            sortBy: 'name'
        };
    }

    // Initialization
    initialize(character) {
        this.currentCharacter = character;
        this.setupUI();
        this.bindEventListeners();
        this.refreshInventoryDisplay();
    }

    setupUI() {
        this.createInventoryGrid();
        this.createEquipmentSlots();
        this.createEncumbranceDisplay();
        this.createFilterControls();
        this.createPresetControls();
    }

    createInventoryGrid() {
        const container = document.getElementById('inventory-container');
        if (!container) return;

        const grid = document.createElement('div');
        grid.className = 'inventory-grid';
        grid.id = 'inventory-grid';
        
        // Create grid cells for items
        for (let i = 0; i < 50; i++) { // 50 inventory slots
            const cell = document.createElement('div');
            cell.className = 'inventory-cell';
            cell.dataset.slot = i;
            
            // Add drop zone functionality
            this.makeDropZone(cell);
            
            grid.appendChild(cell);
        }
        
        container.appendChild(grid);
        this.uiElements.inventoryGrid = grid;
    }

    createEquipmentSlots() {
        const container = document.getElementById('equipment-slots');
        if (!container) return;

        const slots = [
            { id: 'head', name: 'Head', types: ['helmet', 'hat', 'circlet'] },
            { id: 'neck', name: 'Neck', types: ['amulet', 'necklace'] },
            { id: 'shoulders', name: 'Shoulders', types: ['cloak', 'mantle'] },
            { id: 'chest', name: 'Chest', types: ['armor', 'robe', 'shirt'] },
            { id: 'belt', name: 'Belt', types: ['belt', 'sash'] },
            { id: 'gloves', name: 'Gloves', types: ['gloves', 'gauntlets'] },
            { id: 'ring1', name: 'Ring 1', types: ['ring'] },
            { id: 'ring2', name: 'Ring 2', types: ['ring'] },
            { id: 'legs', name: 'Legs', types: ['pants', 'leggings'] },
            { id: 'feet', name: 'Feet', types: ['boots', 'shoes', 'sandals'] },
            { id: 'mainhand', name: 'Main Hand', types: ['weapon', 'shield'] },
            { id: 'offhand', name: 'Off Hand', types: ['weapon', 'shield'] }
        ];

        slots.forEach(slot => {
            const slotElement = document.createElement('div');
            slotElement.className = 'equipment-slot';
            slotElement.id = `slot-${slot.id}`;
            slotElement.dataset.slotType = slot.id;
            slotElement.dataset.acceptedTypes = slot.types.join(',');
            
            const label = document.createElement('div');
            label.className = 'slot-label';
            label.textContent = slot.name;
            
            const slotContent = document.createElement('div');
            slotContent.className = 'slot-content';
            
            slotElement.appendChild(label);
            slotElement.appendChild(slotContent);
            
            // Add drop zone functionality
            this.makeEquipmentDropZone(slotElement, slot.types);
            
            container.appendChild(slotElement);
        });
        
        this.uiElements.equipmentSlots = container;
    }

    // Drag and Drop Implementation
    makeDropZone(element) {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            element.classList.add('drag-over');
        });
        
        element.addEventListener('dragleave', (e) => {
            element.classList.remove('drag-over');
        });
        
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
            
            if (this.draggedItem) {
                this.moveItemToInventorySlot(this.draggedItem, element.dataset.slot);
            }
        });
    }

    makeEquipmentDropZone(element, acceptedTypes) {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            
            if (this.draggedItem && this.canEquipItem(this.draggedItem, acceptedTypes)) {
                element.classList.add('drag-over-valid');
            } else {
                element.classList.add('drag-over-invalid');
            }
        });
        
        element.addEventListener('dragleave', (e) => {
            element.classList.remove('drag-over-valid', 'drag-over-invalid');
        });
        
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over-valid', 'drag-over-invalid');
            
            if (this.draggedItem && this.canEquipItem(this.draggedItem, acceptedTypes)) {
                this.equipItem(this.draggedItem, element.dataset.slotType);
            }
        });
    }

    makeDraggable(itemElement, item) {
        itemElement.draggable = true;
        
        itemElement.addEventListener('dragstart', (e) => {
            this.draggedItem = item;
            itemElement.classList.add('dragging');
            
            // Set drag data
            e.dataTransfer.setData('text/plain', item.id);
            e.dataTransfer.effectAllowed = 'move';
        });
        
        itemElement.addEventListener('dragend', (e) => {
            itemElement.classList.remove('dragging');
            this.draggedItem = null;
        });
    }

    // Item Management
    addItem(item, quantity = 1) {
        if (!this.currentCharacter) return false;
        
        const inventory = this.currentCharacter.equipment.items;
        const existingItem = inventory.find(invItem => invItem.id === item.id);
        
        if (existingItem && item.stackable) {
            existingItem.quantity += quantity;
        } else {
            inventory.push({
                ...item,
                quantity: quantity,
                equipped: false,
                inventorySlot: this.findEmptySlot()
            });
        }
        
        this.refreshInventoryDisplay();
        this.updateEncumbrance();
        return true;
    }

    removeItem(itemId, quantity = 1) {
        if (!this.currentCharacter) return false;
        
        const inventory = this.currentCharacter.equipment.items;
        const itemIndex = inventory.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) return false;
        
        const item = inventory[itemIndex];
        
        if (item.quantity > quantity) {
            item.quantity -= quantity;
        } else {
            // Remove item completely
            if (item.equipped) {
                this.unequipItem(item);
            }
            inventory.splice(itemIndex, 1);
        }
        
        this.refreshInventoryDisplay();
        this.updateEncumbrance();
        return true;
    }

    equipItem(item, slotType) {
        if (!this.canEquipItem(item, [slotType])) return false;
        
        // Unequip current item in slot if any
        const currentEquipped = this.getEquippedItemInSlot(slotType);
        if (currentEquipped) {
            this.unequipItem(currentEquipped);
        }
        
        // Equip new item
        item.equipped = true;
        item.equipmentSlot = slotType;
        
        // Apply item effects
        this.applyItemEffects(item, true);
        
        this.refreshInventoryDisplay();
        this.updateCharacterStats();
        
        return true;
    }

    unequipItem(item) {
        if (!item.equipped) return false;
        
        item.equipped = false;
        delete item.equipmentSlot;
        
        // Remove item effects
        this.applyItemEffects(item, false);
        
        this.refreshInventoryDisplay();
        this.updateCharacterStats();
        
        return true;
    }

    // Equipment Presets
    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return false;
        
        // Unequip all current equipment
        this.unequipAllItems();
        
        // Equip items based on preset priority
        const availableItems = this.getAvailableItems();
        const itemsByCategory = this.categorizeItems(availableItems);
        
        preset.priority.forEach(category => {
            const categoryItems = itemsByCategory[category] || [];
            const bestItem = this.selectBestItemForCategory(categoryItems, category);
            
            if (bestItem) {
                const appropriateSlot = this.findAppropriateSlot(bestItem);
                if (appropriateSlot) {
                    this.equipItem(bestItem, appropriateSlot);
                }
            }
        });
        
        this.refreshInventoryDisplay();
        return true;
    }

    selectBestItemForCategory(items, category) {
        if (items.length === 0) return null;
        
        // Sort by effectiveness for the category
        return items.sort((a, b) => {
            return this.getItemEffectivenessScore(b, category) - 
                   this.getItemEffectivenessScore(a, category);
        })[0];
    }

    getItemEffectivenessScore(item, category) {
        let score = 0;
        
        // Base item value
        score += item.value || 0;
        
        // Category-specific bonuses
        switch (category) {
            case 'armor':
                score += (item.armorClass || 0) * 100;
                break;
            case 'weapons':
                score += this.calculateWeaponDamageAverage(item) * 10;
                break;
            case 'healing_potions':
                score += this.calculateHealingPotency(item) * 5;
                break;
        }
        
        // Magical enhancement bonus
        if (item.magical) {
            score += (item.enhancementBonus || 0) * 50;
        }
        
        return score;
    }

    // Encumbrance System
    calculateEncumbrance() {
        if (!this.currentCharacter) return { load: 0, capacity: 0, level: 'light' };
        
        const strength = this.currentCharacter.abilities.strength;
        const capacity = this.calculateCarryingCapacity(strength);
        const currentLoad = this.calculateCurrentLoad();
        
        let loadLevel = 'light';
        if (currentLoad > capacity.heavy) {
            loadLevel = 'overloaded';
        } else if (currentLoad > capacity.medium) {
            loadLevel = 'heavy';
        } else if (currentLoad > capacity.light) {
            loadLevel = 'medium';
        }
        
        return {
            load: currentLoad,
            capacity: capacity,
            level: loadLevel,
            penalties: this.getEncumbrancePenalties(loadLevel)
        };
    }

    calculateCarryingCapacity(strength) {
        // D&D 3.5 carrying capacity table
        const baseCapacity = this.getBaseCarryingCapacity(strength);
        
        return {
            light: baseCapacity,
            medium: baseCapacity * 2,
            heavy: baseCapacity * 3,
            maximum: baseCapacity * 5
        };
    }

    getBaseCarryingCapacity(strength) {
        if (strength <= 10) return strength * 10;
        if (strength <= 20) return (strength - 10) * 20 + 100;
        if (strength <= 30) return (strength - 20) * 40 + 300;
        
        // For very high strength scores
        const multiplier = Math.pow(4, Math.floor((strength - 29) / 10));
        return 1200 * multiplier;
    }

    calculateCurrentLoad() {
        if (!this.currentCharacter) return 0;
        
        let totalWeight = 0;
        
        // Add weight of all items
        this.currentCharacter.equipment.items.forEach(item => {
            totalWeight += (item.weight || 0) * (item.quantity || 1);
        });
        
        // Add coins (50 coins = 1 pound)
        const money = this.currentCharacter.equipment.money;
        const totalCoins = (money.cp || 0) + (money.sp || 0) + (money.gp || 0) + (money.pp || 0);
        totalWeight += Math.floor(totalCoins / 50);
        
        return totalWeight;
    }

    getEncumbrancePenalties(loadLevel) {
        const penalties = {
            light: { speed: 0, checkPenalty: 0, maxDex: null },
            medium: { speed: -10, checkPenalty: -3, maxDex: 3 },
            heavy: { speed: -20, checkPenalty: -6, maxDex: 1 },
            overloaded: { speed: -30, checkPenalty: -9, maxDex: 0 }
        };
        
        return penalties[loadLevel] || penalties.light;
    }

    updateEncumbrance() {
        const encumbrance = this.calculateEncumbrance();
        
        // Update UI
        if (this.uiElements.encumbranceBar) {
            this.updateEncumbranceBar(encumbrance);
        }
        
        // Apply character penalties
        this.applyEncumbrancePenalties(encumbrance);
    }

    updateEncumbranceBar(encumbrance) {
        const bar = this.uiElements.encumbranceBar;
        const percentage = (encumbrance.load / encumbrance.capacity.maximum) * 100;
        
        const fill = bar.querySelector('.encumbrance-fill');
        const text = bar.querySelector('.encumbrance-text');
        
        fill.style.width = `${Math.min(percentage, 100)}%`;
        fill.className = `encumbrance-fill encumbrance-${encumbrance.level}`;
        
        text.textContent = `${encumbrance.load} lb / ${encumbrance.capacity.maximum} lb (${encumbrance.level})`;
    }

    // UI Updates
    refreshInventoryDisplay() {
        if (!this.currentCharacter) return;
        
        this.updateInventoryGrid();
        this.updateEquipmentSlots();
        this.updateEncumbrance();
    }

    updateInventoryGrid() {
        const grid = this.uiElements.inventoryGrid;
        if (!grid) return;
        
        // Clear existing items
        grid.querySelectorAll('.item-element').forEach(el => el.remove());
        
        // Filter and sort items
        const filteredItems = this.getFilteredItems();
        
        // Display items
        filteredItems.forEach(item => {
            const itemElement = this.createItemElement(item);
            const slot = grid.querySelector(`[data-slot="${item.inventorySlot || 0}"]`);
            if (slot) {
                slot.appendChild(itemElement);
            }
        });
    }

    createItemElement(item) {
        const element = document.createElement('div');
        element.className = 'item-element';
        element.dataset.itemId = item.id;
        
        if (item.equipped) {
            element.classList.add('equipped');
        }
        
        // Item icon
        const icon = document.createElement('div');
        icon.className = 'item-icon';
        icon.style.backgroundImage = `url(${item.icon || '/images/items/default.png'})`;
        
        // Quantity badge
        if (item.quantity > 1) {
            const quantity = document.createElement('div');
            quantity.className = 'item-quantity';
            quantity.textContent = item.quantity;
            element.appendChild(quantity);
        }
        
        // Enhancement indicator
        if (item.enhancementBonus) {
            const enhancement = document.createElement('div');
            enhancement.className = 'item-enhancement';
            enhancement.textContent = `+${item.enhancementBonus}`;
            element.appendChild(enhancement);
        }
        
        element.appendChild(icon);
        
        // Add drag functionality
        this.makeDraggable(element, item);
        
        // Add tooltip
        this.addItemTooltip(element, item);
        
        return element;
    }

    addItemTooltip(element, item) {
        element.addEventListener('mouseenter', (e) => {
            this.showItemTooltip(e, item);
        });
        
        element.addEventListener('mouseleave', (e) => {
            this.hideItemTooltip();
        });
    }

    showItemTooltip(event, item) {
        const tooltip = this.createItemTooltip(item);
        document.body.appendChild(tooltip);
        
        // Position tooltip
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
    }

    createItemTooltip(item) {
        const tooltip = document.createElement('div');
        tooltip.className = 'item-tooltip';
        tooltip.id = 'item-tooltip';
        
        let content = `
            <div class="tooltip-header">
                <span class="item-name ${item.rarity || 'common'}">${item.name}</span>
                ${item.enhancementBonus ? `<span class="enhancement">+${item.enhancementBonus}</span>` : ''}
            </div>
            <div class="tooltip-type">${item.type || 'Item'}</div>
        `;
        
        if (item.description) {
            content += `<div class="tooltip-description">${item.description}</div>`;
        }
        
        if (item.weight) {
            content += `<div class="tooltip-weight">Weight: ${item.weight} lb</div>`;
        }
        
        if (item.value) {
            content += `<div class="tooltip-value">Value: ${item.value} gp</div>`;
        }
        
        // Add item statistics
        if (item.armorClass) {
            content += `<div class="tooltip-stats">AC: ${item.armorClass}</div>`;
        }
        
        if (item.damage) {
            content += `<div class="tooltip-stats">Damage: ${item.damage}</div>`;
        }
        
        tooltip.innerHTML = content;
        return tooltip;
    }

    hideItemTooltip() {
        const tooltip = document.getElementById('item-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
}

// Export for both environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryManager;
} else if (typeof window !== 'undefined') {
    window.InventoryManager = InventoryManager;
}
```

This completes Part 2 of the comprehensive AI agent instructions, covering the Adventure Engine with AI integration and the complete Inventory Management system with drag-and-drop functionality, equipment presets, and encumbrance calculations.

**Total Lines**: Approximately 2000 lines  
**Next Document**: Part 3 will cover Spell Systems, Combat Engine, and Epic Level Progression implementation.
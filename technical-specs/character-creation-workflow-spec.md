# Character Creation Workflow - Complete Implementation Specification

## Overview
This document provides the complete technical specification for the 7-step D&D 3.5 character creation wizard implemented in the production-ready character creator. This captures all UI patterns, workflow logic, and integration points developed during the project.

## File Location
- **Primary File**: `new-character-creator.html`
- **Size**: 2000+ lines of production code
- **Dependencies**: SRD Data Manager (`srd-data-manager.js`)
- **Architecture**: Single-page application with embedded JavaScript

## Workflow Architecture

### Overall Structure
```javascript
const characterCreator = {
    currentStep: 1,
    character: {
        abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        race: null,
        class: null,
        skills: {},
        feats: [],
        equipment: [],
        spells: [],
        hitPoints: 0,
        armorClass: 10,
        saves: { fort: 0, ref: 0, will: 0 },
        baseAttackBonus: 0
    },
    pointsRemaining: 28,
    skillPointsRemaining: 0
};
```

### Step Navigation System
```javascript
function nextStep() {
    if (characterCreator.currentStep < 7) {
        characterCreator.currentStep++;
        renderCurrentStep();
        updateProgressBar();
    }
}

function prevStep() {
    if (characterCreator.currentStep > 1) {
        characterCreator.currentStep--;
        renderCurrentStep();
        updateProgressBar();
    }
}

function renderCurrentStep() {
    const stepContainer = document.getElementById('step-container');
    
    switch (characterCreator.currentStep) {
        case 1: renderAbilitiesStep(); break;
        case 2: renderRaceStep(); break;
        case 3: renderClassStep(); break;
        case 4: renderSkillsStep(); break;
        case 5: renderFeatsStep(); break;
        case 6: renderEquipmentStep(); break;
        case 7: renderFinalizeStep(); break;
    }
}
```

## Step-by-Step Implementation Specifications

### Step 1: Ability Scores (28-Point Buy System)

#### UI Elements
```html
<!-- Point Buy Interface -->
<div class="ability-scores-grid">
    <div class="ability-row" data-ability="str">
        <label>Strength</label>
        <button onclick="decreaseAbility('str')">-</button>
        <span class="ability-value">10</span>
        <button onclick="increaseAbility('str')">+</button>
        <span class="ability-modifier">+0</span>
        <span class="point-cost">2</span>
    </div>
    <!-- Repeat for dex, con, int, wis, cha -->
</div>

<div class="points-display">
    <span>Points Remaining: <strong id="points-remaining">28</strong></span>
</div>
```

#### Core Logic
```javascript
function renderAbilitiesStep() {
    const html = `
        <h2>Step 1: Ability Scores</h2>
        <p>Use the 28-point buy system to determine your character's abilities.</p>
        <div class="ability-scores-container">
            ${renderAbilityScoreControls()}
        </div>
        <div class="points-remaining">
            Points Remaining: <span id="points-remaining">${characterCreator.pointsRemaining}</span>
        </div>
    `;
    
    document.getElementById('step-container').innerHTML = html;
}

function increaseAbility(ability) {
    const current = characterCreator.character.abilities[ability];
    if (current >= 18) return; // Maximum 18
    
    const newValue = current + 1;
    const currentCost = srdData.calculatePointBuyCost(current);
    const newCost = srdData.calculatePointBuyCost(newValue);
    const costDifference = newCost - currentCost;
    
    if (characterCreator.pointsRemaining >= costDifference) {
        characterCreator.character.abilities[ability] = newValue;
        characterCreator.pointsRemaining -= costDifference;
        updateAbilityDisplay();
        calculateCharacterStats();
    }
}

function decreaseAbility(ability) {
    const current = characterCreator.character.abilities[ability];
    if (current <= 8) return; // Minimum 8
    
    const newValue = current - 1;
    const currentCost = srdData.calculatePointBuyCost(current);
    const newCost = srdData.calculatePointBuyCost(newValue);
    const costDifference = currentCost - newCost;
    
    characterCreator.character.abilities[ability] = newValue;
    characterCreator.pointsRemaining += costDifference;
    updateAbilityDisplay();
    calculateCharacterStats();
}
```

### Step 2: Race Selection

#### UI Elements
```html
<div class="race-selection-grid">
    <div class="race-card" onclick="selectRace('human')">
        <h3>Human</h3>
        <div class="race-abilities">
            <p>No ability adjustments</p>
            <ul class="special-abilities">
                <li>Extra feat at 1st level</li>
                <li>Extra skill points at each level</li>
            </ul>
        </div>
    </div>
    <!-- Repeat for all races -->
</div>
```

#### Core Logic
```javascript
function renderRaceStep() {
    const races = srdData.races;
    let html = `
        <h2>Step 2: Choose Your Race</h2>
        <div class="race-selection-grid">
    `;
    
    Object.entries(races).forEach(([raceId, raceData]) => {
        const isSelected = characterCreator.character.race === raceId;
        html += `
            <div class="race-card ${isSelected ? 'selected' : ''}" onclick="selectRace('${raceId}')">
                <h3>${raceData.name}</h3>
                <div class="race-stats">
                    <p><strong>Size:</strong> ${raceData.size}</p>
                    <p><strong>Speed:</strong> ${raceData.speed} ft</p>
                </div>
                <div class="ability-adjustments">
                    ${renderAbilityAdjustments(raceData.ability_adjustments)}
                </div>
                <ul class="special-abilities">
                    ${raceData.special_abilities.map(ability => `<li>${ability}</li>`).join('')}
                </ul>
            </div>
        `;
    });
    
    html += `</div>`;
    document.getElementById('step-container').innerHTML = html;
}

function selectRace(raceId) {
    // Remove previous racial modifiers
    if (characterCreator.character.race) {
        const oldRace = srdData.getRaceData(characterCreator.character.race);
        applyRacialModifiers(oldRace.ability_adjustments, true); // Remove
    }
    
    // Apply new racial modifiers
    characterCreator.character.race = raceId;
    const raceData = srdData.getRaceData(raceId);
    applyRacialModifiers(raceData.ability_adjustments, false); // Apply
    
    calculateCharacterStats();
    updateCharacterPreview();
    highlightSelectedRace();
}
```

### Step 3: Class Selection

#### UI Elements
```html
<div class="class-selection-grid">
    <div class="class-card" onclick="selectClass('fighter')">
        <h3>Fighter</h3>
        <div class="class-stats">
            <p><strong>Hit Die:</strong> d10</p>
            <p><strong>Skill Points:</strong> 2 + Int modifier</p>
            <p><strong>BAB:</strong> Full</p>
        </div>
        <div class="saves">
            <p><strong>Saves:</strong> Fort: Good, Ref: Poor, Will: Poor</p>
        </div>
        <ul class="class-features">
            <li>All weapon and armor proficiencies</li>
            <li>Bonus feat at 1st level</li>
        </ul>
    </div>
    <!-- Repeat for all classes -->
</div>
```

#### Core Logic
```javascript
function renderClassStep() {
    const classes = srdData.classes;
    let html = `
        <h2>Step 3: Choose Your Class</h2>
        <div class="class-selection-grid">
    `;
    
    Object.entries(classes).forEach(([classId, classData]) => {
        const isSelected = characterCreator.character.class === classId;
        html += `
            <div class="class-card ${isSelected ? 'selected' : ''}" onclick="selectClass('${classId}')">
                <h3>${classData.name}</h3>
                <div class="class-stats">
                    <p><strong>Hit Die:</strong> d${classData.hit_die}</p>
                    <p><strong>Skill Points:</strong> ${classData.skill_points_per_level} + Int modifier</p>
                    <p><strong>BAB:</strong> ${classData.bab_progression}</p>
                </div>
                <div class="saves">
                    <p><strong>Base Saves:</strong></p>
                    <p>Fort: +${classData.base_saves.fort}, Ref: +${classData.base_saves.ref}, Will: +${classData.base_saves.will}</p>
                </div>
                <ul class="class-features">
                    ${classData.special_abilities.map(ability => `<li>${ability}</li>`).join('')}
                </ul>
            </div>
        `;
    });
    
    html += `</div>`;
    document.getElementById('step-container').innerHTML = html;
}

function selectClass(classId) {
    characterCreator.character.class = classId;
    
    // Calculate skill points for this class
    const intMod = Math.floor((characterCreator.character.abilities.int - 10) / 2);
    const skillPoints = srdData.getClassSkillPoints(classId, 1, intMod);
    characterCreator.skillPointsRemaining = skillPoints;
    
    calculateCharacterStats();
    updateCharacterPreview();
    highlightSelectedClass();
}
```

### Step 4: Skills Selection

#### UI Elements
```html
<div class="skills-section">
    <div class="skill-points-display">
        <h3>Skill Points Remaining: <span id="skill-points-remaining">0</span></h3>
    </div>
    
    <div class="skills-grid">
        <div class="skill-row">
            <label>Appraise (Int)</label>
            <div class="skill-controls">
                <button onclick="decreaseSkill('Appraise')">-</button>
                <span class="skill-ranks">0</span>
                <button onclick="increaseSkill('Appraise')">+</button>
            </div>
            <span class="skill-modifier">+0</span>
            <span class="class-skill-indicator">Class</span>
        </div>
        <!-- Repeat for all skills -->
    </div>
</div>
```

#### Core Logic
```javascript
function renderSkillsStep() {
    if (!characterCreator.character.class) {
        return renderError('Please select a class first');
    }
    
    const skills = srdData.skills;
    const classData = srdData.getClassData(characterCreator.character.class);
    
    let html = `
        <h2>Step 4: Assign Skill Points</h2>
        <div class="skill-points-display">
            <p>Skill Points Remaining: <strong id="skill-points-remaining">${characterCreator.skillPointsRemaining}</strong></p>
        </div>
        <div class="skills-grid">
    `;
    
    Object.entries(skills).forEach(([skillName, skillData]) => {
        const ranks = characterCreator.character.skills[skillName] || 0;
        const abilityMod = getAbilityModifier(skillData.key_ability);
        const isClassSkill = srdData.isClassSkill(skillName, characterCreator.character.class);
        const totalBonus = ranks + abilityMod + (isClassSkill && ranks > 0 ? 3 : 0);
        
        html += `
            <div class="skill-row ${isClassSkill ? 'class-skill' : ''}">
                <div class="skill-info">
                    <label>${skillName} (${skillData.key_ability.toUpperCase()})</label>
                    ${isClassSkill ? '<span class="class-skill-indicator">Class</span>' : ''}
                </div>
                <div class="skill-controls">
                    <button onclick="decreaseSkill('${skillName}')" ${ranks <= 0 ? 'disabled' : ''}>-</button>
                    <span class="skill-ranks">${ranks}</span>
                    <button onclick="increaseSkill('${skillName}')" ${ranks >= 4 || characterCreator.skillPointsRemaining <= 0 ? 'disabled' : ''}>+</button>
                </div>
                <div class="skill-total">
                    Total: +${totalBonus}
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    document.getElementById('step-container').innerHTML = html;
}

function increaseSkill(skillName) {
    if (characterCreator.skillPointsRemaining <= 0) return;
    
    const currentRanks = characterCreator.character.skills[skillName] || 0;
    if (currentRanks >= 4) return; // Max ranks at 1st level
    
    characterCreator.character.skills[skillName] = currentRanks + 1;
    characterCreator.skillPointsRemaining--;
    
    updateSkillsDisplay();
}

function decreaseSkill(skillName) {
    const currentRanks = characterCreator.character.skills[skillName] || 0;
    if (currentRanks <= 0) return;
    
    characterCreator.character.skills[skillName] = currentRanks - 1;
    characterCreator.skillPointsRemaining++;
    
    updateSkillsDisplay();
}
```

### Step 5: Feats Selection

#### UI Elements
```html
<div class="feats-section">
    <div class="available-feats-count">
        <h3>Available Feats: <span id="feats-remaining">1</span></h3>
    </div>
    
    <div class="feats-filter">
        <input type="text" placeholder="Search feats..." onkeyup="filterFeats()">
        <select onchange="filterFeatsByType()">
            <option value="all">All Feats</option>
            <option value="combat">Combat Feats</option>
            <option value="metamagic">Metamagic Feats</option>
        </select>
    </div>
    
    <div class="feats-grid">
        <!-- Feat cards dynamically generated -->
    </div>
</div>
```

#### Core Logic
```javascript
function renderFeatsStep() {
    const availableFeats = getAvailableFeats();
    let html = `
        <h2>Step 5: Select Feats</h2>
        <div class="feats-available">
            <p>Available Feats: <strong>${getAvailableFeatCount()}</strong></p>
        </div>
        
        <div class="selected-feats">
            <h3>Selected Feats:</h3>
            <div class="selected-feats-list">
                ${renderSelectedFeats()}
            </div>
        </div>
        
        <div class="feat-search">
            <input type="text" id="feat-search" placeholder="Search feats..." onkeyup="filterFeats()" />
        </div>
        
        <div class="feats-grid">
            ${renderFeatOptions(availableFeats)}
        </div>
    `;
    
    document.getElementById('step-container').innerHTML = html;
}

function getAvailableFeatCount() {
    let count = 1; // Base feat at 1st level
    
    // Human bonus feat
    if (characterCreator.character.race === 'human') count++;
    
    // Fighter bonus feat
    if (characterCreator.character.class === 'fighter') count++;
    
    // Wizard bonus feat (Scribe Scroll or metamagic/item creation)
    if (characterCreator.character.class === 'wizard') count++;
    
    return count - characterCreator.character.feats.length;
}

function selectFeat(featId) {
    if (getAvailableFeatCount() <= 0) return;
    
    const feat = srdData.feats[featId];
    if (!feat) return;
    
    // Check prerequisites
    if (!validateFeatPrerequisites(feat)) {
        alert('Prerequisites not met for this feat.');
        return;
    }
    
    characterCreator.character.feats.push(featId);
    renderFeatsStep(); // Refresh display
}
```

### Step 6: Equipment and Spells

#### UI Elements
```html
<div class="equipment-spells-section">
    <div class="section-tabs">
        <button class="tab-button active" onclick="showEquipmentTab()">Equipment</button>
        <button class="tab-button" onclick="showSpellsTab()">Spells</button>
    </div>
    
    <div id="equipment-tab" class="tab-content">
        <div class="starting-gold">
            <h3>Starting Gold: <span id="gold-amount">120</span> gp</h3>
        </div>
        
        <div class="equipment-categories">
            <div class="category-tabs">
                <button onclick="showWeapons()">Weapons</button>
                <button onclick="showArmor()">Armor</button>
                <button onclick="showGear()">Gear</button>
            </div>
            
            <div class="equipment-grid">
                <!-- Equipment items dynamically generated -->
            </div>
        </div>
        
        <div class="selected-equipment">
            <h3>Selected Equipment</h3>
            <div class="equipment-list">
                <!-- Selected items -->
            </div>
        </div>
    </div>
    
    <div id="spells-tab" class="tab-content" style="display: none;">
        <!-- Spell selection interface -->
    </div>
</div>
```

#### Core Logic
```javascript
function renderEquipmentStep() {
    let html = `
        <h2>Step 6: Equipment & Spells</h2>
        <div class="equipment-spells-tabs">
            <button class="tab-btn active" onclick="showEquipmentTab()">Equipment</button>
    `;
    
    // Add spells tab if spellcaster
    if (srdData.isSpellcaster(characterCreator.character.class)) {
        html += `<button class="tab-btn" onclick="showSpellsTab()">Spells</button>`;
    }
    
    html += `</div>`;
    
    // Equipment tab content
    html += `
        <div id="equipment-content" class="tab-content">
            <div class="starting-gold">
                <h3>Starting Gold: <span id="gold-remaining">${characterCreator.character.gold || getStartingGold()}</span> gp</h3>
            </div>
            
            <div class="equipment-categories">
                <button onclick="showCategory('weapons')" class="category-btn">Weapons</button>
                <button onclick="showCategory('armor')" class="category-btn">Armor</button>
                <button onclick="showCategory('gear')" class="category-btn">Gear</button>
            </div>
            
            <div id="equipment-list">
                ${renderEquipmentCategory('weapons')}
            </div>
            
            <div class="selected-equipment">
                <h3>Selected Equipment</h3>
                <div id="selected-equipment-list">
                    ${renderSelectedEquipment()}
                </div>
            </div>
        </div>
    `;
    
    // Spells tab content (if applicable)
    if (srdData.isSpellcaster(characterCreator.character.class)) {
        html += `
            <div id="spells-content" class="tab-content" style="display: none;">
                ${renderSpellSelection()}
            </div>
        `;
    }
    
    document.getElementById('step-container').innerHTML = html;
}

function purchaseEquipment(itemId, category, cost) {
    if (characterCreator.character.gold >= cost) {
        characterCreator.character.gold -= cost;
        characterCreator.character.equipment.push({ id: itemId, category: category });
        
        updateGoldDisplay();
        updateSelectedEquipment();
        calculateCharacterStats();
    }
}
```

### Step 7: Finalize Character

#### UI Elements
```html
<div class="finalize-section">
    <div class="character-summary">
        <h2>Character Summary</h2>
        <div class="character-stats-final">
            <!-- Complete character sheet display -->
        </div>
    </div>
    
    <div class="character-actions">
        <button onclick="saveCharacter()" class="btn-primary">Save Character</button>
        <button onclick="exportCharacter()" class="btn-secondary">Export to JSON</button>
        <button onclick="printCharacter()" class="btn-secondary">Print Character Sheet</button>
    </div>
    
    <div class="character-validation">
        <h3>Character Validation</h3>
        <ul id="validation-results">
            <!-- Validation results -->
        </ul>
    </div>
</div>
```

#### Core Logic
```javascript
function renderFinalizeStep() {
    const validationResults = validateCompleteCharacter();
    
    let html = `
        <h2>Step 7: Finalize Your Character</h2>
        
        <div class="character-sheet-preview">
            ${generateCompleteCharacterSheet()}
        </div>
        
        <div class="character-validation">
            <h3>Character Validation</h3>
            ${renderValidationResults(validationResults)}
        </div>
        
        <div class="character-actions">
            <button onclick="saveCharacter()" class="btn-save">Save Character</button>
            <button onclick="exportCharacter()" class="btn-export">Export JSON</button>
            <button onclick="printCharacterSheet()" class="btn-print">Print Sheet</button>
            <button onclick="startNewCharacter()" class="btn-new">Create New Character</button>
        </div>
    `;
    
    document.getElementById('step-container').innerHTML = html;
}

function validateCompleteCharacter() {
    const validation = {
        valid: true,
        warnings: [],
        errors: []
    };
    
    // Check required selections
    if (!characterCreator.character.race) {
        validation.errors.push('No race selected');
        validation.valid = false;
    }
    
    if (!characterCreator.character.class) {
        validation.errors.push('No class selected');
        validation.valid = false;
    }
    
    // Check point buy
    if (characterCreator.pointsRemaining > 0) {
        validation.warnings.push(`${characterCreator.pointsRemaining} ability points unused`);
    }
    
    // Check skill points
    if (characterCreator.skillPointsRemaining > 0) {
        validation.warnings.push(`${characterCreator.skillPointsRemaining} skill points unused`);
    }
    
    // Check required feats
    const requiredFeats = getRequiredFeatCount();
    if (characterCreator.character.feats.length < requiredFeats) {
        validation.errors.push('Not all feats selected');
        validation.valid = false;
    }
    
    return validation;
}
```

## Character Statistics Calculation

### Core Statistics Engine
```javascript
function calculateCharacterStats() {
    if (!characterCreator.character.race || !characterCreator.character.class) return;
    
    const raceData = srdData.getRaceData(characterCreator.character.race);
    const classData = srdData.getClassData(characterCreator.character.class);
    
    // Calculate final ability scores (base + racial)
    const finalAbilities = { ...characterCreator.character.abilities };
    if (raceData.ability_adjustments) {
        Object.entries(raceData.ability_adjustments).forEach(([ability, adjustment]) => {
            finalAbilities[ability] = (finalAbilities[ability] || 10) + adjustment;
        });
    }
    
    // Calculate ability modifiers
    const abilityModifiers = {};
    Object.entries(finalAbilities).forEach(([ability, score]) => {
        abilityModifiers[ability] = Math.floor((score - 10) / 2);
    });
    
    // Calculate hit points
    const conMod = abilityModifiers.con;
    const hitDie = classData.hit_die;
    characterCreator.character.hitPoints = hitDie + conMod;
    if (characterCreator.character.hitPoints < 1) characterCreator.character.hitPoints = 1;
    
    // Calculate armor class
    characterCreator.character.armorClass = 10 + abilityModifiers.dex + getArmorBonus();
    
    // Calculate saves
    characterCreator.character.saves = {
        fort: classData.base_saves.fort + abilityModifiers.con,
        ref: classData.base_saves.ref + abilityModifiers.dex,
        will: classData.base_saves.will + abilityModifiers.wis
    };
    
    // Calculate base attack bonus
    characterCreator.character.baseAttackBonus = srdData.getClassBAB(characterCreator.character.class, 1);
    
    // Update display
    updateCharacterPreview();
}
```

## CSS Styling Specifications

### Layout Grid System
```css
.character-creator-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.progress-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    padding: 20px 0;
    border-bottom: 2px solid #eee;
}

.progress-step {
    flex: 1;
    text-align: center;
    padding: 10px;
    border-radius: 5px;
    margin: 0 5px;
    transition: all 0.3s ease;
}

.progress-step.active {
    background-color: #007cba;
    color: white;
}

.progress-step.completed {
    background-color: #28a745;
    color: white;
}
```

### Component Styling
```css
.race-selection-grid, .class-selection-grid, .feats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.race-card, .class-card, .feat-card {
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;
}

.race-card:hover, .class-card:hover, .feat-card:hover {
    border-color: #007cba;
    box-shadow: 0 4px 8px rgba(0,124,186,0.1);
}

.race-card.selected, .class-card.selected, .feat-card.selected {
    border-color: #007cba;
    background-color: #f0f8ff;
}
```

## Integration Requirements

### Global References
```javascript
// Required for HTML onclick handlers
window.characterCreator = characterCreator;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.selectRace = selectRace;
window.selectClass = selectClass;
window.increaseAbility = increaseAbility;
window.decreaseAbility = decreaseAbility;
```

### Server Dependencies
```javascript
// Required server routes in game-server.js
'/new-character-creator.html' // Main character creator file
'/code-repository/src/srd-data-manager.js' // SRD data dependency
```

This specification provides complete implementation details for recreating the 7-step D&D 3.5 character creation workflow with full SRD compliance and professional UI/UX patterns.
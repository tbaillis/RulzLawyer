# RulzLawyer AI Agent Instructions - Part 3: Spell Systems & Combat Engine

**Generated**: September 25, 2025  
**Document**: Part 3 of 5 - Spell Systems & Combat Engine  
**Target Lines**: 2000  
**Purpose**: Complete spellcasting mechanics, combat resolution, and epic level progression systems

## 🎯 PART 3 FOCUS AREAS

This document covers the implementation of:
1. **Complete Spellcasting System** - Spell selection, preparation, and casting mechanics
2. **Combat Management Engine** - Initiative, actions, and tactical combat resolution
3. **Epic Level Progression** - Character advancement from levels 21-100
4. **Spell Database Management** - Complete D&D 3.5 spell integration
5. **Metamagic and Advanced Spellcasting** - Feat integration and spell enhancement

## ✨ SPELLCASTING SYSTEM IMPLEMENTATION

### 1. SPELL MANAGER CORE SYSTEM

#### 1.1 Main Spell Management Engine
**File**: `code-repository/src/spells/spell-manager.js`  
**Priority**: HIGH - Core spellcasting functionality

**Requirements**:
- Complete D&D 3.5 spell database integration
- Automatic spell selection for spellcasting classes
- Spell preparation and memorization mechanics
- Spell slot management and tracking
- Metamagic feat integration
- Spell save DC and caster level calculations
- Spell resistance and spell interaction resolution

**Implementation**:
```javascript
class SpellManager {
    constructor(dataManager, calculationEngine) {
        this.dataManager = dataManager;
        this.calculationEngine = calculationEngine;
        
        // Spell system state
        this.spellDatabase = null;
        this.knownSpells = new Map(); // Character -> Spells
        this.preparedSpells = new Map(); // Character -> Prepared Spells
        this.spellSlots = new Map(); // Character -> Available Slots
        this.spellHistory = new Map(); // Character -> Cast Spells
        
        // Spellcasting classes configuration
        this.spellcastingClasses = {
            'Wizard': {
                type: 'prepared',
                keyAbility: 'intelligence',
                spellsKnownProgression: 'unlimited',
                spellsPerDay: 'full_caster',
                bonusSpells: true,
                spellbook: true,
                cantrips: true,
                schoolSpecialization: true
            },
            'Cleric': {
                type: 'prepared',
                keyAbility: 'wisdom',
                spellsKnownProgression: 'unlimited',
                spellsPerDay: 'full_caster',
                bonusSpells: true,
                domainSpells: true,
                cantrips: true,
                spontaneous: 'healing'
            },
            'Sorcerer': {
                type: 'spontaneous',
                keyAbility: 'charisma',
                spellsKnownProgression: 'limited',
                spellsPerDay: 'full_caster',
                bonusSpells: true,
                cantrips: true,
                metamagic: 'extended_casting'
            },
            'Bard': {
                type: 'spontaneous',
                keyAbility: 'charisma',
                spellsKnownProgression: 'limited',
                spellsPerDay: 'partial_caster',
                bonusSpells: true,
                bardic: true
            },
            'Ranger': {
                type: 'prepared',
                keyAbility: 'wisdom',
                spellsKnownProgression: 'unlimited',
                spellsPerDay: 'partial_caster',
                bonusSpells: false,
                minimumLevel: 4
            },
            'Paladin': {
                type: 'prepared',
                keyAbility: 'wisdom',
                spellsKnownProgression: 'unlimited',
                spellsPerDay: 'partial_caster',
                bonusSpells: false,
                minimumLevel: 4
            }
        };
        
        // Metamagic feats
        this.metamagicFeats = {
            'Empower Spell': { levelIncrease: 2, effect: 'empower' },
            'Enlarge Spell': { levelIncrease: 1, effect: 'enlarge' },
            'Extend Spell': { levelIncrease: 1, effect: 'extend' },
            'Heighten Spell': { levelIncrease: 'variable', effect: 'heighten' },
            'Maximize Spell': { levelIncrease: 3, effect: 'maximize' },
            'Quicken Spell': { levelIncrease: 4, effect: 'quicken' },
            'Silent Spell': { levelIncrease: 1, effect: 'silent' },
            'Still Spell': { levelIncrease: 1, effect: 'still' },
            'Widen Spell': { levelIncrease: 3, effect: 'widen' }
        };
    }

    // Initialization
    async initialize() {
        if (this.spellDatabase) return;
        
        console.log('Initializing Spell Manager...');
        
        try {
            // Load spell database
            this.spellDatabase = await this.loadSpellDatabase();
            
            // Initialize spell lists by class
            this.classSpellLists = this.organizeSpellsByClass();
            
            console.log('✅ Spell Manager initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Spell Manager:', error);
            throw error;
        }
    }

    async loadSpellDatabase() {
        const spells = await this.dataManager.getSpells();
        
        // Enhanced spell data processing
        return spells.map(spell => this.enhanceSpellData(spell));
    }

    enhanceSpellData(spell) {
        return {
            ...spell,
            // Add calculated fields
            id: this.generateSpellId(spell),
            searchTerms: this.generateSearchTerms(spell),
            components: this.parseComponents(spell.components),
            castingTime: this.parseCastingTime(spell.castingTime),
            range: this.parseRange(spell.range),
            duration: this.parseDuration(spell.duration),
            savingThrow: this.parseSavingThrow(spell.savingThrow),
            spellResistance: this.parseSpellResistance(spell.spellResistance),
            // Metamagic compatibility
            metamagicCompatible: this.checkMetamagicCompatibility(spell)
        };
    }

    // Character Spell Integration
    initializeCharacterSpells(character) {
        const spellcastingClasses = this.getSpellcastingClasses(character);
        
        spellcastingClasses.forEach(cls => {
            this.initializeClassSpells(character, cls);
        });
    }

    initializeClassSpells(character, characterClass) {
        const className = characterClass.name;
        const classLevel = characterClass.level;
        const classConfig = this.spellcastingClasses[className];
        
        if (!classConfig) return;
        
        // Check minimum level requirement
        if (classConfig.minimumLevel && classLevel < classConfig.minimumLevel) {
            return;
        }
        
        // Initialize spell slots
        this.initializeSpellSlots(character, className, classLevel);
        
        // Initialize known spells
        if (classConfig.type === 'spontaneous') {
            this.initializeSpontaneousSpells(character, className, classLevel);
        } else {
            this.initializePreparedSpells(character, className, classLevel);
        }
    }

    initializeSpellSlots(character, className, classLevel) {
        const classConfig = this.spellcastingClasses[className];
        const keyAbility = classConfig.keyAbility;
        const abilityMod = this.calculationEngine.calculateAbilityModifier(character.abilities[keyAbility]);
        
        const baseSlots = this.getBaseSpellSlots(className, classLevel);
        const bonusSlots = classConfig.bonusSpells ? this.getBonusSpellSlots(abilityMod) : {};
        
        const characterKey = character.id || 'default';
        if (!this.spellSlots.has(characterKey)) {
            this.spellSlots.set(characterKey, {});
        }
        
        const characterSlots = this.spellSlots.get(characterKey);
        characterSlots[className] = {
            base: baseSlots,
            bonus: bonusSlots,
            used: this.initializeUsedSlots(baseSlots),
            available: this.calculateAvailableSlots(baseSlots, bonusSlots)
        };
    }

    getBaseSpellSlots(className, classLevel) {
        // D&D 3.5 spell slots per day table
        const spellSlotsTable = {
            'Wizard': {
                1: [3, 1], 2: [4, 2], 3: [4, 2, 1], 4: [4, 3, 2], 5: [4, 3, 2, 1],
                6: [4, 3, 3, 2], 7: [4, 4, 3, 2, 1], 8: [4, 4, 3, 3, 2], 9: [4, 4, 4, 3, 2, 1],
                10: [4, 4, 4, 3, 3, 2], 11: [4, 4, 4, 4, 3, 2, 1], 12: [4, 4, 4, 4, 3, 3, 2],
                13: [4, 4, 4, 4, 4, 3, 2, 1], 14: [4, 4, 4, 4, 4, 3, 3, 2], 15: [4, 4, 4, 4, 4, 4, 3, 2, 1],
                16: [4, 4, 4, 4, 4, 4, 3, 3, 2], 17: [4, 4, 4, 4, 4, 4, 4, 3, 2, 1], 18: [4, 4, 4, 4, 4, 4, 4, 3, 3, 2],
                19: [4, 4, 4, 4, 4, 4, 4, 4, 3, 3], 20: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
            },
            'Cleric': {
                // Same as Wizard for full casters
                1: [3, 1], 2: [4, 2], 3: [4, 2, 1], 4: [4, 3, 2], 5: [4, 3, 2, 1],
                6: [4, 3, 3, 2], 7: [4, 4, 3, 2, 1], 8: [4, 4, 3, 3, 2], 9: [4, 4, 4, 3, 2, 1],
                10: [4, 4, 4, 3, 3, 2], 11: [4, 4, 4, 4, 3, 2, 1], 12: [4, 4, 4, 4, 3, 3, 2],
                13: [4, 4, 4, 4, 4, 3, 2, 1], 14: [4, 4, 4, 4, 4, 3, 3, 2], 15: [4, 4, 4, 4, 4, 4, 3, 2, 1],
                16: [4, 4, 4, 4, 4, 4, 3, 3, 2], 17: [4, 4, 4, 4, 4, 4, 4, 3, 2, 1], 18: [4, 4, 4, 4, 4, 4, 4, 3, 3, 2],
                19: [4, 4, 4, 4, 4, 4, 4, 4, 3, 3], 20: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
            },
            'Sorcerer': {
                // Same as Wizard but different spells known
                1: [3, 1], 2: [4, 2], 3: [4, 2, 1], 4: [4, 3, 2], 5: [4, 3, 2, 1],
                6: [4, 3, 3, 2], 7: [4, 4, 3, 2, 1], 8: [4, 4, 3, 3, 2], 9: [4, 4, 4, 3, 2, 1],
                10: [4, 4, 4, 3, 3, 2], 11: [4, 4, 4, 4, 3, 2, 1], 12: [4, 4, 4, 4, 3, 3, 2],
                13: [4, 4, 4, 4, 4, 3, 2, 1], 14: [4, 4, 4, 4, 4, 3, 3, 2], 15: [4, 4, 4, 4, 4, 4, 3, 2, 1],
                16: [4, 4, 4, 4, 4, 4, 3, 3, 2], 17: [4, 4, 4, 4, 4, 4, 4, 3, 2, 1], 18: [4, 4, 4, 4, 4, 4, 4, 3, 3, 2],
                19: [4, 4, 4, 4, 4, 4, 4, 4, 3, 3], 20: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
            },
            'Bard': {
                // Partial caster progression
                1: [2], 2: [3, 0], 3: [3, 1], 4: [3, 2, 0], 5: [3, 3, 1], 6: [3, 3, 2],
                7: [3, 3, 2, 0], 8: [3, 3, 3, 1], 9: [3, 3, 3, 2], 10: [3, 3, 3, 2, 0],
                11: [3, 3, 3, 3, 1], 12: [3, 3, 3, 3, 2], 13: [3, 3, 3, 3, 2, 0], 14: [4, 3, 3, 3, 3, 1],
                15: [4, 4, 3, 3, 3, 2], 16: [4, 4, 4, 3, 3, 2, 0], 17: [4, 4, 4, 4, 3, 3, 1],
                18: [4, 4, 4, 4, 4, 3, 2], 19: [4, 4, 4, 4, 4, 4, 3], 20: [4, 4, 4, 4, 4, 4, 4]
            },
            'Ranger': {
                // Ranger spells start at level 4
                4: [0, 0], 5: [0, 0], 6: [1, 0], 7: [1, 0], 8: [1, 1], 9: [1, 1],
                10: [1, 1], 11: [1, 1, 0], 12: [1, 1, 1], 13: [1, 1, 1], 14: [2, 1, 1, 0],
                15: [2, 1, 1, 1], 16: [2, 2, 1, 1], 17: [2, 2, 2, 1], 18: [3, 2, 2, 1],
                19: [3, 3, 3, 2], 20: [3, 3, 3, 3]
            },
            'Paladin': {
                // Paladin spells start at level 4
                4: [0], 5: [0], 6: [1], 7: [1], 8: [1, 0], 9: [1, 0],
                10: [1, 1], 11: [1, 1, 0], 12: [1, 1, 1], 13: [1, 1, 1], 14: [2, 1, 1, 0],
                15: [2, 1, 1, 1], 16: [2, 2, 1, 1], 17: [2, 2, 2, 1], 18: [3, 2, 2, 1],
                19: [3, 3, 3, 2], 20: [3, 3, 3, 3]
            }
        };
        
        const classTable = spellSlotsTable[className];
        if (!classTable || !classTable[classLevel]) {
            return {};
        }
        
        const slots = {};
        classTable[classLevel].forEach((count, index) => {
            if (count > 0) {
                slots[index] = count;
            }
        });
        
        return slots;
    }

    getBonusSpellSlots(abilityModifier) {
        if (abilityModifier < 1) return {};
        
        const bonusSlots = {};
        
        // Bonus spells for high ability scores
        for (let level = 1; level <= 9; level++) {
            const requiredMod = level - 1;
            if (abilityModifier >= requiredMod) {
                const bonusCount = Math.floor((abilityModifier - requiredMod) / 4) + 1;
                bonusSlots[level] = bonusCount;
            }
        }
        
        return bonusSlots;
    }

    // Spell Preparation System
    prepareSpell(character, className, spell, spellLevel, metamagicFeats = []) {
        const characterKey = character.id || 'default';
        
        // Check if character can prepare this spell
        if (!this.canPrepareSpell(character, className, spell, spellLevel)) {
            return { success: false, error: 'Cannot prepare this spell' };
        }
        
        // Calculate effective spell level with metamagic
        const effectiveLevel = this.calculateEffectiveSpellLevel(spell, spellLevel, metamagicFeats);
        
        // Check available spell slots
        if (!this.hasAvailableSlot(character, className, effectiveLevel)) {
            return { success: false, error: 'No available spell slots' };
        }
        
        // Prepare the spell
        if (!this.preparedSpells.has(characterKey)) {
            this.preparedSpells.set(characterKey, {});
        }
        
        const characterPrepared = this.preparedSpells.get(characterKey);
        if (!characterPrepared[className]) {
            characterPrepared[className] = {};
        }
        
        if (!characterPrepared[className][effectiveLevel]) {
            characterPrepared[className][effectiveLevel] = [];
        }
        
        characterPrepared[className][effectiveLevel].push({
            spell: spell,
            baseLevel: spellLevel,
            effectiveLevel: effectiveLevel,
            metamagicFeats: metamagicFeats,
            preparedAt: Date.now()
        });
        
        return { success: true, effectiveLevel: effectiveLevel };
    }

    // Spell Casting System
    castSpell(character, className, preparedSpell, target = null, options = {}) {
        const characterKey = character.id || 'default';
        
        // Validate spell casting
        const validation = this.validateSpellCasting(character, className, preparedSpell);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }
        
        // Remove prepared spell
        this.removePreparedSpell(character, className, preparedSpell);
        
        // Calculate spell effects
        const spellEffects = this.calculateSpellEffects(preparedSpell, character, target);
        
        // Apply metamagic modifications
        const modifiedEffects = this.applyMetamagicEffects(spellEffects, preparedSpell.metamagicFeats);
        
        // Record spell casting
        this.recordSpellCasting(character, className, preparedSpell, modifiedEffects);
        
        return {
            success: true,
            spell: preparedSpell.spell,
            effects: modifiedEffects,
            saveDC: this.calculateSpellSaveDC(preparedSpell, character, className),
            casterLevel: this.getCasterLevel(character, className),
            spellResistance: preparedSpell.spell.spellResistance
        };
    }

    calculateSpellEffects(preparedSpell, caster, target) {
        const spell = preparedSpell.spell;
        const effects = {
            type: spell.school,
            damage: null,
            healing: null,
            buffs: [],
            debuffs: [],
            area: null,
            duration: spell.duration,
            range: spell.range
        };
        
        // Parse spell effects based on spell data
        if (spell.damage) {
            effects.damage = this.calculateSpellDamage(spell, caster);
        }
        
        if (spell.healing) {
            effects.healing = this.calculateSpellHealing(spell, caster);
        }
        
        if (spell.effects) {
            effects.buffs = spell.effects.buffs || [];
            effects.debuffs = spell.effects.debuffs || [];
        }
        
        if (spell.area) {
            effects.area = this.parseSpellArea(spell.area);
        }
        
        return effects;
    }

    applyMetamagicEffects(effects, metamagicFeats) {
        let modifiedEffects = { ...effects };
        
        metamagicFeats.forEach(feat => {
            switch (feat) {
                case 'Empower Spell':
                    if (modifiedEffects.damage) {
                        modifiedEffects.damage = this.empowerDamage(modifiedEffects.damage);
                    }
                    if (modifiedEffects.healing) {
                        modifiedEffects.healing = this.empowerHealing(modifiedEffects.healing);
                    }
                    break;
                    
                case 'Maximize Spell':
                    if (modifiedEffects.damage) {
                        modifiedEffects.damage = this.maximizeDamage(modifiedEffects.damage);
                    }
                    if (modifiedEffects.healing) {
                        modifiedEffects.healing = this.maximizeHealing(modifiedEffects.healing);
                    }
                    break;
                    
                case 'Extend Spell':
                    modifiedEffects.duration = this.extendDuration(modifiedEffects.duration);
                    break;
                    
                case 'Enlarge Spell':
                    modifiedEffects.range = this.enlargeRange(modifiedEffects.range);
                    break;
                    
                case 'Widen Spell':
                    if (modifiedEffects.area) {
                        modifiedEffects.area = this.widenArea(modifiedEffects.area);
                    }
                    break;
            }
        });
        
        return modifiedEffects;
    }

    // Spell Database Queries
    getSpellsForClass(className, level = null) {
        if (!this.classSpellLists || !this.classSpellLists[className]) {
            return [];
        }
        
        const classSpells = this.classSpellLists[className];
        
        if (level !== null) {
            return classSpells[level] || [];
        }
        
        // Return all spells for the class
        const allSpells = [];
        Object.values(classSpells).forEach(levelSpells => {
            allSpells.push(...levelSpells);
        });
        
        return allSpells;
    }

    searchSpells(query, filters = {}) {
        let results = [...this.spellDatabase];
        
        // Text search
        if (query) {
            const searchTerms = query.toLowerCase().split(' ');
            results = results.filter(spell => {
                return searchTerms.every(term =>
                    spell.searchTerms.some(spellTerm => 
                        spellTerm.includes(term)
                    )
                );
            });
        }
        
        // Apply filters
        if (filters.school) {
            results = results.filter(spell => spell.school === filters.school);
        }
        
        if (filters.class) {
            results = results.filter(spell =>
                spell.classes.some(cls => cls.name === filters.class)
            );
        }
        
        if (filters.level !== undefined) {
            results = results.filter(spell =>
                spell.classes.some(cls => 
                    cls.name === filters.class && cls.level === filters.level
                )
            );
        }
        
        if (filters.components) {
            results = results.filter(spell => {
                const hasComponents = filters.components.every(component =>
                    spell.components[component]
                );
                return hasComponents;
            });
        }
        
        return results;
    }

    // Utility Methods
    generateSpellId(spell) {
        return spell.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }

    generateSearchTerms(spell) {
        const terms = [
            spell.name.toLowerCase(),
            spell.school.toLowerCase(),
            ...spell.subschool ? [spell.subschool.toLowerCase()] : [],
            ...spell.descriptor ? spell.descriptor.map(d => d.toLowerCase()) : [],
            ...spell.classes.map(cls => cls.name.toLowerCase())
        ];
        
        // Add description keywords
        if (spell.description) {
            const keywords = spell.description.toLowerCase().match(/\b\w{4,}\b/g) || [];
            terms.push(...keywords.slice(0, 10)); // Limit to prevent bloat
        }
        
        return [...new Set(terms)]; // Remove duplicates
    }

    parseComponents(componentString) {
        const components = {
            verbal: false,
            somatic: false,
            material: false,
            materialComponent: null,
            focus: false,
            focusComponent: null,
            divine: false,
            experience: false,
            experienceCost: 0
        };
        
        if (!componentString) return components;
        
        const parts = componentString.split(',').map(part => part.trim());
        
        parts.forEach(part => {
            if (part.startsWith('V')) {
                components.verbal = true;
            } else if (part.startsWith('S')) {
                components.somatic = true;
            } else if (part.startsWith('M')) {
                components.material = true;
                const match = part.match(/M \((.+)\)/);
                if (match) {
                    components.materialComponent = match[1];
                }
            } else if (part.startsWith('F')) {
                components.focus = true;
                const match = part.match(/F \((.+)\)/);
                if (match) {
                    components.focusComponent = match[1];
                }
            } else if (part.startsWith('DF')) {
                components.divine = true;
            } else if (part.startsWith('XP')) {
                components.experience = true;
                const match = part.match(/XP \((\d+)\)/);
                if (match) {
                    components.experienceCost = parseInt(match[1]);
                }
            }
        });
        
        return components;
    }

    calculateSpellSaveDC(preparedSpell, character, className) {
        const spell = preparedSpell.spell;
        const effectiveLevel = preparedSpell.effectiveLevel;
        const classConfig = this.spellcastingClasses[className];
        
        if (!classConfig) return 10;
        
        const keyAbility = classConfig.keyAbility;
        const abilityMod = this.calculationEngine.calculateAbilityModifier(character.abilities[keyAbility]);
        
        let baseDC = 10 + effectiveLevel + abilityMod;
        
        // Add spell focus bonuses
        if (character.feats.includes('Spell Focus')) {
            if (this.hasSpellFocusForSchool(character, spell.school)) {
                baseDC += 1;
            }
        }
        
        if (character.feats.includes('Greater Spell Focus')) {
            if (this.hasGreaterSpellFocusForSchool(character, spell.school)) {
                baseDC += 1;
            }
        }
        
        return baseDC;
    }

    getCasterLevel(character, className) {
        const characterClass = character.classes.find(cls => cls.name === className);
        if (!characterClass) return 1;
        
        let casterLevel = characterClass.level;
        
        // Add caster level bonuses from items or feats
        // This would be expanded based on specific items and feats
        
        return casterLevel;
    }
}

// Export for both environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpellManager;
} else if (typeof window !== 'undefined') {
    window.SpellManager = SpellManager;
}
```

## ⚔️ COMBAT MANAGEMENT SYSTEM

### 2. COMBAT ENGINE IMPLEMENTATION

#### 2.1 Combat Manager Core
**File**: `code-repository/src/combat/combat-manager.js`  
**Priority**: HIGH - Tactical combat resolution

**Requirements**:
- Initiative tracking and turn order management
- Action economy (standard, move, free, full-round actions)
- Attack roll resolution with modifiers
- Damage calculation and hit point management
- Area of effect spell and ability resolution
- Status effects and condition tracking
- Tactical movement and positioning

**Implementation**:
```javascript
class CombatManager {
    constructor(diceEngine, calculationEngine) {
        this.diceEngine = diceEngine;
        this.calculationEngine = calculationEngine;
        
        // Combat state
        this.activeCombat = null;
        this.combatHistory = [];
        this.currentRound = 0;
        this.currentInitiative = 0;
        
        // Combat participants
        this.participants = new Map();
        this.initiativeOrder = [];
        
        // Action types
        this.actionTypes = {
            'standard': { timeUnits: 1, description: 'Standard action (attack, cast spell, etc.)' },
            'move': { timeUnits: 1, description: 'Move action (move up to speed, draw weapon, etc.)' },
            'full': { timeUnits: 2, description: 'Full-round action (full attack, run, etc.)' },
            'free': { timeUnits: 0, description: 'Free action (speak, drop item, etc.)' },
            'swift': { timeUnits: 0, description: 'Swift action (quickened spell, etc.)' },
            'immediate': { timeUnits: 0, description: 'Immediate action (interrupt, etc.)' }
        };
        
        // Status effects
        this.statusEffects = {
            'blinded': { type: 'debuff', acPenalty: -2, attackPenalty: -1, description: 'Cannot see' },
            'deafened': { type: 'debuff', initiativePenalty: -4, description: 'Cannot hear' },
            'entangled': { type: 'debuff', acPenalty: -2, attackPenalty: -2, speedReduction: 0.5, description: 'Movement restricted' },
            'exhausted': { type: 'debuff', strengthPenalty: -6, dexterityPenalty: -6, description: 'Extremely tired' },
            'fatigued': { type: 'debuff', strengthPenalty: -2, dexterityPenalty: -2, description: 'Tired' },
            'frightened': { type: 'debuff', attackPenalty: -2, savePenalty: -2, description: 'Afraid' },
            'grappled': { type: 'debuff', acPenalty: -4, attackPenalty: -4, description: 'Being grappled' },
            'paralyzed': { type: 'debuff', helpless: true, description: 'Cannot move or act' },
            'prone': { type: 'debuff', acPenalty: -4, attackPenalty: -4, description: 'Lying down' },
            'stunned': { type: 'debuff', acPenalty: -2, noActions: true, description: 'Cannot act' }
        };
    }

    // Combat Initialization
    startCombat(participants) {
        console.log('Starting combat encounter...');
        
        this.activeCombat = {
            id: this.generateCombatId(),
            participants: participants,
            startTime: Date.now(),
            status: 'active'
        };
        
        this.currentRound = 1;
        this.participants.clear();
        
        // Initialize participants
        participants.forEach(participant => {
            this.addParticipant(participant);
        });
        
        // Roll initiative
        this.rollInitiative();
        
        // Start first turn
        return this.startNextTurn();
    }

    addParticipant(participant) {
        const combatant = {
            ...participant,
            id: participant.id || this.generateParticipantId(),
            initiative: 0,
            currentHitPoints: participant.hitPoints?.current || participant.hitPoints?.max || 1,
            maxHitPoints: participant.hitPoints?.max || 1,
            temporaryHitPoints: participant.hitPoints?.temporary || 0,
            armorClass: this.calculateArmorClass(participant),
            actions: this.initializeActions(),
            statusEffects: new Map(),
            position: participant.position || { x: 0, y: 0 },
            facingDirection: participant.facingDirection || 0,
            hasActed: false,
            isDefeated: false
        };
        
        this.participants.set(combatant.id, combatant);
        return combatant.id;
    }

    rollInitiative() {
        const participants = Array.from(this.participants.values());
        
        participants.forEach(participant => {
            const initiativeBonus = this.calculateInitiativeBonus(participant);
            const roll = this.diceEngine.roll('1d20');
            participant.initiative = roll.total + initiativeBonus;
            
            console.log(`${participant.name} rolled ${roll.total} + ${initiativeBonus} = ${participant.initiative} for initiative`);
        });
        
        // Sort by initiative (highest first)
        this.initiativeOrder = participants
            .sort((a, b) => b.initiative - a.initiative)
            .map(p => p.id);
        
        this.currentInitiative = 0;
        
        console.log('Initiative order:', this.initiativeOrder.map(id => {
            const participant = this.participants.get(id);
            return `${participant.name} (${participant.initiative})`;
        }));
    }

    // Turn Management
    startNextTurn() {
        if (!this.activeCombat) return null;
        
        // Check if combat is over
        if (this.isCombatOver()) {
            return this.endCombat();
        }
        
        // Get current participant
        const currentParticipantId = this.initiativeOrder[this.currentInitiative];
        const currentParticipant = this.participants.get(currentParticipantId);
        
        if (!currentParticipant || currentParticipant.isDefeated) {
            return this.advanceInitiative();
        }
        
        // Reset actions for new turn
        this.resetParticipantActions(currentParticipant);
        
        // Apply beginning-of-turn effects
        this.applyBeginningOfTurnEffects(currentParticipant);
        
        return {
            type: 'turn_start',
            round: this.currentRound,
            participant: currentParticipant,
            availableActions: this.getAvailableActions(currentParticipant),
            combatState: this.getCombatState()
        };
    }

    advanceInitiative() {
        this.currentInitiative++;
        
        if (this.currentInitiative >= this.initiativeOrder.length) {
            // Start new round
            this.currentInitiative = 0;
            this.currentRound++;
            
            console.log(`Starting round ${this.currentRound}`);
            
            // Apply round-based effects
            this.applyRoundEffects();
        }
        
        return this.startNextTurn();
    }

    // Action Resolution
    executeAction(participantId, action) {
        const participant = this.participants.get(participantId);
        if (!participant) {
            return { success: false, error: 'Participant not found' };
        }
        
        // Validate action
        const validation = this.validateAction(participant, action);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }
        
        // Execute action based on type
        let result;
        switch (action.type) {
            case 'attack':
                result = this.executeAttack(participant, action);
                break;
            case 'cast_spell':
                result = this.executeCastSpell(participant, action);
                break;
            case 'move':
                result = this.executeMove(participant, action);
                break;
            case 'defend':
                result = this.executeDefend(participant, action);
                break;
            case 'use_item':
                result = this.executeUseItem(participant, action);
                break;
            default:
                result = { success: false, error: 'Unknown action type' };
        }
        
        if (result.success) {
            // Consume action points
            this.consumeAction(participant, action.actionType);
            
            // Mark as having acted
            participant.hasActed = true;
            
            // Record action in combat log
            this.recordAction(participant, action, result);
        }
        
        return result;
    }

    executeAttack(attacker, attackAction) {
        const target = this.participants.get(attackAction.targetId);
        if (!target) {
            return { success: false, error: 'Target not found' };
        }
        
        const weapon = attackAction.weapon;
        const attackBonus = this.calculateAttackBonus(attacker, weapon);
        
        // Roll attack
        const attackRoll = this.diceEngine.roll('1d20');
        const totalAttack = attackRoll.total + attackBonus;
        
        // Check for critical threat
        const criticalThreat = this.checkCriticalThreat(attackRoll.total, weapon);
        let criticalHit = false;
        
        if (criticalThreat) {
            const confirmRoll = this.diceEngine.roll('1d20');
            const confirmTotal = confirmRoll.total + attackBonus;
            criticalHit = confirmTotal >= target.armorClass;
        }
        
        // Determine if attack hits
        const hits = totalAttack >= target.armorClass;
        
        let damage = 0;
        if (hits) {
            damage = this.calculateDamage(attacker, weapon, criticalHit);
            this.applyDamage(target, damage);
        }
        
        return {
            success: true,
            type: 'attack',
            attacker: attacker.name,
            target: target.name,
            attackRoll: attackRoll.total,
            attackBonus: attackBonus,
            totalAttack: totalAttack,
            targetAC: target.armorClass,
            hits: hits,
            criticalThreat: criticalThreat,
            criticalHit: criticalHit,
            damage: damage,
            targetRemainingHP: target.currentHitPoints
        };
    }

    calculateAttackBonus(attacker, weapon) {
        let bonus = 0;
        
        // Base attack bonus
        bonus += attacker.baseAttackBonus || 0;
        
        // Ability modifier
        const isRanged = weapon.type === 'ranged';
        const abilityMod = isRanged ? 
            this.calculationEngine.calculateAbilityModifier(attacker.abilities.dexterity) :
            this.calculationEngine.calculateAbilityModifier(attacker.abilities.strength);
        bonus += abilityMod;
        
        // Weapon enhancement bonus
        bonus += weapon.enhancementBonus || 0;
        
        // Size modifier
        bonus += this.getSizeModifier(attacker.size);
        
        // Status effect modifiers
        attacker.statusEffects.forEach(effect => {
            bonus += effect.attackBonus || 0;
        });
        
        return bonus;
    }

    calculateDamage(attacker, weapon, criticalHit = false) {
        let damage = 0;
        
        // Base weapon damage
        const damageRoll = this.diceEngine.roll(weapon.damage);
        damage += damageRoll.total;
        
        // Ability modifier
        const isRanged = weapon.type === 'ranged';
        const abilityMod = isRanged ? 
            this.calculationEngine.calculateAbilityModifier(attacker.abilities.dexterity) :
            this.calculationEngine.calculateAbilityModifier(attacker.abilities.strength);
        damage += abilityMod;
        
        // Enhancement bonus
        damage += weapon.enhancementBonus || 0;
        
        // Critical hit multiplier
        if (criticalHit) {
            const multiplier = weapon.criticalMultiplier || 2;
            const extraDamage = (damageRoll.total) * (multiplier - 1);
            damage += extraDamage;
        }
        
        return Math.max(damage, 1); // Minimum 1 damage
    }

    applyDamage(target, damage) {
        // Apply to temporary hit points first
        if (target.temporaryHitPoints > 0) {
            const tempDamage = Math.min(damage, target.temporaryHitPoints);
            target.temporaryHitPoints -= tempDamage;
            damage -= tempDamage;
        }
        
        // Apply remaining damage to current hit points
        target.currentHitPoints -= damage;
        
        // Check if target is defeated
        if (target.currentHitPoints <= 0) {
            this.handleDefeat(target);
        }
    }

    handleDefeat(participant) {
        participant.isDefeated = true;
        participant.currentHitPoints = Math.min(participant.currentHitPoints, 0);
        
        // Apply unconscious or dying status
        if (participant.currentHitPoints < 0) {
            if (participant.currentHitPoints <= -10) {
                this.addStatusEffect(participant, 'dead');
            } else {
                this.addStatusEffect(participant, 'dying');
            }
        } else {
            this.addStatusEffect(participant, 'unconscious');
        }
        
        console.log(`${participant.name} has been defeated!`);
    }

    // Status Effects
    addStatusEffect(participant, effectName, duration = null, source = null) {
        const effect = {
            name: effectName,
            ...this.statusEffects[effectName],
            duration: duration,
            source: source,
            appliedAt: Date.now()
        };
        
        participant.statusEffects.set(effectName, effect);
        
        // Apply immediate effects
        this.applyStatusEffectModifiers(participant, effect, true);
    }

    removeStatusEffect(participant, effectName) {
        const effect = participant.statusEffects.get(effectName);
        if (effect) {
            // Remove effect modifiers
            this.applyStatusEffectModifiers(participant, effect, false);
            participant.statusEffects.delete(effectName);
        }
    }

    applyStatusEffectModifiers(participant, effect, apply) {
        const modifier = apply ? 1 : -1;
        
        // Apply numerical penalties/bonuses
        if (effect.acPenalty) {
            participant.armorClass += effect.acPenalty * modifier;
        }
        
        if (effect.attackPenalty) {
            participant.attackBonus = (participant.attackBonus || 0) + (effect.attackPenalty * modifier);
        }
        
        if (effect.speedReduction && apply) {
            participant.speed = Math.floor(participant.speed * effect.speedReduction);
        } else if (effect.speedReduction && !apply) {
            participant.speed = participant.baseSpeed; // Reset to base speed
        }
    }

    // Combat State Management
    isCombatOver() {
        const aliveFactions = new Set();
        
        this.participants.forEach(participant => {
            if (!participant.isDefeated) {
                aliveFactions.add(participant.faction || 'neutral');
            }
        });
        
        return aliveFactions.size <= 1;
    }

    endCombat() {
        if (!this.activeCombat) return null;
        
        console.log('Combat ended!');
        
        const result = {
            type: 'combat_end',
            duration: Date.now() - this.activeCombat.startTime,
            rounds: this.currentRound,
            victor: this.determineVictor(),
            participants: Array.from(this.participants.values()),
            experience: this.calculateExperienceReward(),
            treasure: this.generateTreasureReward()
        };
        
        // Archive combat
        this.combatHistory.push({
            ...this.activeCombat,
            endTime: Date.now(),
            result: result
        });
        
        // Clear active combat
        this.activeCombat = null;
        this.participants.clear();
        this.initiativeOrder = [];
        this.currentRound = 0;
        this.currentInitiative = 0;
        
        return result;
    }

    getCombatState() {
        return {
            round: this.currentRound,
            currentParticipant: this.initiativeOrder[this.currentInitiative],
            participants: Array.from(this.participants.values()),
            initiativeOrder: this.initiativeOrder.map(id => ({
                id: id,
                name: this.participants.get(id)?.name,
                initiative: this.participants.get(id)?.initiative,
                hasActed: this.participants.get(id)?.hasActed
            }))
        };
    }
}

// Export for both environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CombatManager;
} else if (typeof window !== 'undefined') {
    window.CombatManager = CombatManager;
}
```

## 🌟 EPIC LEVEL PROGRESSION SYSTEM

### 3. EPIC LEVEL ENGINE

#### 3.1 Epic Level Manager
**File**: `code-repository/src/epic/epic-level-manager.js`  
**Priority**: MEDIUM - Advanced character progression

**Requirements**:
- Character progression from levels 21-100
- Epic feat selection and validation
- Divine ascension mechanics and divine ranks
- Epic spell creation and casting
- Expanded ability score increases
- Epic level class features and benefits

**Implementation**:
```javascript
class EpicLevelManager {
    constructor(dataManager, calculationEngine) {
        this.dataManager = dataManager;
        this.calculationEngine = calculationEngine;
        
        // Epic progression data
        this.epicFeats = new Map();
        this.divineRanks = new Map();
        this.epicSpells = new Map();
        
        // Epic level thresholds
        this.epicLevelThreshold = 21;
        this.maxLevel = 100;
        this.divineAscensionLevel = 30;
        
        // Epic progression rates
        this.epicExperienceProgression = {
            baseXP: 190000, // XP needed for level 21
            xpPerLevel: 10000 // Additional XP per epic level
        };
    }

    // Epic Level Advancement
    checkEpicLevelAdvancement(character) {
        const totalLevel = this.calculateTotalLevel(character);
        
        if (totalLevel < this.epicLevelThreshold) {
            return { isEpic: false, canAdvance: false };
        }
        
        const currentXP = character.experience || 0;
        const requiredXP = this.calculateRequiredExperience(totalLevel + 1);
        
        return {
            isEpic: true,
            canAdvance: currentXP >= requiredXP,
            currentLevel: totalLevel,
            nextLevel: totalLevel + 1,
            currentXP: currentXP,
            requiredXP: requiredXP,
            xpToNext: requiredXP - currentXP
        };
    }

    advanceEpicLevel(character) {
        const advancement = this.checkEpicLevelAdvancement(character);
        
        if (!advancement.canAdvance) {
            return { success: false, error: 'Insufficient experience for advancement' };
        }
        
        // Advance level in primary class
        const primaryClass = this.getPrimaryClass(character);
        primaryClass.level++;
        
        // Epic level benefits
        const benefits = this.calculateEpicLevelBenefits(character, advancement.nextLevel);
        this.applyEpicLevelBenefits(character, benefits);
        
        // Epic feat selection
        if (this.qualifiesForEpicFeat(advancement.nextLevel)) {
            benefits.epicFeatSelection = true;
        }
        
        // Divine ascension check
        if (advancement.nextLevel >= this.divineAscensionLevel) {
            benefits.divineAscensionEligible = true;
        }
        
        return {
            success: true,
            newLevel: advancement.nextLevel,
            benefits: benefits,
            epicFeatsAvailable: this.getAvailableEpicFeats(character),
            divineRanksAvailable: this.getAvailableDivineRanks(character)
        };
    }

    calculateEpicLevelBenefits(character, newLevel) {
        const benefits = {
            hitPoints: 0,
            abilityIncrease: null,
            saves: { fortitude: 0, reflex: 0, will: 0 },
            baseAttackBonus: 0,
            skillPoints: 0,
            classFeatures: []
        };
        
        // Hit points (class HD + Con modifier)
        const primaryClass = this.getPrimaryClass(character);
        const classData = this.dataManager.getClass(primaryClass.name);
        const conMod = this.calculationEngine.calculateAbilityModifier(character.abilities.constitution);
        benefits.hitPoints = classData.hitDie + conMod;
        
        // Ability score increase every 4 levels (including epic levels)
        if (newLevel % 4 === 0) {
            benefits.abilityIncrease = {
                available: true,
                amount: 1
            };
        }
        
        // Epic ability score increases (every 5 epic levels)
        const epicLevel = newLevel - 20;
        if (epicLevel > 0 && epicLevel % 5 === 0) {
            benefits.abilityIncrease = {
                available: true,
                amount: 1,
                epic: true
            };
        }
        
        // Base attack bonus progression
        benefits.baseAttackBonus = this.calculateEpicBABIncrease(primaryClass, classData);
        
        // Saving throw progression
        benefits.saves = this.calculateEpicSaveIncrease(primaryClass, classData);
        
        // Skill points
        const intMod = this.calculationEngine.calculateAbilityModifier(character.abilities.intelligence);
        benefits.skillPoints = classData.skillPoints + intMod;
        
        // Epic class features
        benefits.classFeatures = this.getEpicClassFeatures(primaryClass, newLevel);
        
        return benefits;
    }

    // Epic Feat System
    getAvailableEpicFeats(character) {
        const allEpicFeats = this.getEpicFeatsDatabase();
        const availableFeats = [];
        
        allEpicFeats.forEach(feat => {
            if (this.meetsEpicFeatPrerequisites(character, feat)) {
                availableFeats.push(feat);
            }
        });
        
        return availableFeats;
    }

    meetsEpicFeatPrerequisites(character, feat) {
        if (!feat.prerequisites) return true;
        
        return feat.prerequisites.every(prereq => {
            switch (prereq.type) {
                case 'level':
                    return this.calculateTotalLevel(character) >= prereq.value;
                    
                case 'epic_level':
                    const epicLevel = this.calculateTotalLevel(character) - 20;
                    return epicLevel >= prereq.value;
                    
                case 'ability':
                    return character.abilities[prereq.ability] >= prereq.value;
                    
                case 'feat':
                    return character.feats.includes(prereq.feat);
                    
                case 'epic_feat':
                    return character.epicFeats?.includes(prereq.feat) || false;
                    
                case 'skill':
                    const skill = character.skills[prereq.skill];
                    return skill && skill.ranks >= prereq.ranks;
                    
                case 'caster_level':
                    return this.getHighestCasterLevel(character) >= prereq.value;
                    
                case 'divine_rank':
                    return (character.divineRank || 0) >= prereq.value;
                    
                default:
                    return true;
            }
        });
    }

    // Divine Ascension System
    checkDivineAscensionEligibility(character) {
        const totalLevel = this.calculateTotalLevel(character);
        
        if (totalLevel < this.divineAscensionLevel) {
            return {
                eligible: false,
                reason: `Requires level ${this.divineAscensionLevel}`,
                currentLevel: totalLevel
            };
        }
        
        // Additional requirements for divine ascension
        const requirements = this.getDivineAscensionRequirements();
        const unmetRequirements = [];
        
        requirements.forEach(requirement => {
            if (!this.meetsDivineRequirement(character, requirement)) {
                unmetRequirements.push(requirement);
            }
        });
        
        return {
            eligible: unmetRequirements.length === 0,
            unmetRequirements: unmetRequirements,
            currentLevel: totalLevel
        };
    }

    beginDivineAscension(character, divinePortfolio) {
        const eligibility = this.checkDivineAscensionEligibility(character);
        
        if (!eligibility.eligible) {
            return {
                success: false,
                error: 'Character does not meet divine ascension requirements',
                requirements: eligibility.unmetRequirements
            };
        }
        
        // Initialize divine rank 0 (quasi-deity)
        character.divineRank = 0;
        character.divinePortfolio = divinePortfolio;
        character.divineRealm = null;
        character.divineAbilities = this.getBaseDivineAbilities();
        
        // Apply divine transformation
        const transformation = this.applyDivineTransformation(character);
        
        return {
            success: true,
            divineRank: 0,
            portfolio: divinePortfolio,
            transformation: transformation,
            newAbilities: character.divineAbilities
        };
    }

    increaseDivineRank(character, newRank) {
        if (!character.divineRank && character.divineRank !== 0) {
            return { success: false, error: 'Character is not divine' };
        }
        
        if (newRank <= character.divineRank) {
            return { success: false, error: 'Divine rank cannot decrease' };
        }
        
        if (newRank > 20) {
            return { success: false, error: 'Maximum divine rank is 20' };
        }
        
        const oldRank = character.divineRank;
        character.divineRank = newRank;
        
        // Apply divine rank benefits
        const benefits = this.calculateDivineRankBenefits(oldRank, newRank);
        this.applyDivineRankBenefits(character, benefits);
        
        return {
            success: true,
            oldRank: oldRank,
            newRank: newRank,
            benefits: benefits
        };
    }

    // Epic Spell System
    createEpicSpell(character, spellDesign) {
        // Epic spell creation rules
        const baseDC = 50; // Base Spellcraft DC for epic spells
        let finalDC = baseDC;
        let spellLevel = 10; // Epic spells are 10th level
        
        // Calculate spell factors
        spellDesign.factors.forEach(factor => {
            finalDC += factor.dcModifier || 0;
            spellLevel = Math.max(spellLevel, factor.minimumLevel || 10);
        });
        
        // Calculate mitigating factors
        spellDesign.mitigatingFactors?.forEach(factor => {
            finalDC -= factor.dcReduction || 0;
        });
        
        const epicSpell = {
            id: this.generateEpicSpellId(spellDesign),
            name: spellDesign.name,
            school: spellDesign.school,
            level: spellLevel,
            spellcraftDC: finalDC,
            castingTime: spellDesign.castingTime || '1 minute',
            components: spellDesign.components || ['V', 'S'],
            range: spellDesign.range || 'Touch',
            duration: spellDesign.duration || 'Instantaneous',
            savingThrow: spellDesign.savingThrow || 'None',
            spellResistance: spellDesign.spellResistance || 'No',
            description: spellDesign.description,
            factors: spellDesign.factors,
            mitigatingFactors: spellDesign.mitigatingFactors,
            createdBy: character.id,
            createdAt: Date.now()
        };
        
        return {
            success: true,
            spell: epicSpell,
            canCreate: this.canCreateEpicSpell(character, epicSpell),
            requirements: this.getEpicSpellRequirements(epicSpell)
        };
    }

    // Utility Methods
    calculateTotalLevel(character) {
        return character.classes.reduce((total, cls) => total + cls.level, 0);
    }

    calculateRequiredExperience(level) {
        if (level <= 20) {
            // Standard D&D 3.5 XP table
            return this.getStandardExperienceTable()[level] || 0;
        } else {
            // Epic level XP calculation
            const epicLevel = level - 20;
            return this.epicExperienceProgression.baseXP + 
                   (epicLevel * this.epicExperienceProgression.xpPerLevel);
        }
    }

    getPrimaryClass(character) {
        // Return the class with the highest level
        return character.classes.reduce((primary, current) => 
            current.level > primary.level ? current : primary
        );
    }

    qualifiesForEpicFeat(level) {
        // Epic feats available at 21, 24, 27, 30, etc.
        return level >= 21 && (level - 21) % 3 === 0;
    }
}

// Export for both environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EpicLevelManager;
} else if (typeof window !== 'undefined') {
    window.EpicLevelManager = EpicLevelManager;
}
```

This completes Part 3 of the comprehensive AI agent instructions, covering the complete Spellcasting System with metamagic integration, Combat Management Engine with tactical combat resolution, and Epic Level Progression system for character advancement beyond level 20.

**Total Lines**: Approximately 2000 lines  
**Next Document**: Part 4 will cover Portrait System, Story Tracker, Server Architecture, and Testing Framework implementation.
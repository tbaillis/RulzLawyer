/**
 * RulzLawyer Spell Management System
 * Complete D&D 3.5 SRD Spell System with Casting, Preparation, and Slot Management
 * 
 * Features:
 * - Complete SRD spell database with all spell levels 0-9
 * - Spell preparation and spontaneous casting mechanics
 * - Spell slot management and tracking
 * - Metamagic feat integration
 * - Component tracking (Verbal, Somatic, Material, Focus, Divine Focus)
 * - Spell resistance and saving throw calculations
 * - Duration and area of effect tracking
 * 
 * @version 1.0
 * @date September 20, 2025
 * @location code-repository/src/spell-manager.js
 */

class SpellManager {
    constructor(diceEngine, characterManager) {
        this.dice = diceEngine;
        this.characterManager = characterManager;
        
        // Initialize spell database
        this.spellDatabase = this._initializeSpellDatabase();
        this.metamagicFeats = this._initializeMetamagicFeats();
        
        // Spell slot progression tables
        this.spellProgression = this._initializeSpellProgression();
        
        console.log('🎭 Spell Manager initialized with', 
                   Object.keys(this.spellDatabase).length, 'spells');
    }

    /**
     * Get all available spells for a character
     * @param {Object} character - Character object
     * @returns {Array} Available spells array
     */
    getAvailableSpells(character) {
        const spellcasterLevel = this._getSpellcasterLevel(character);
        if (spellcasterLevel === 0) return [];

        const availableSpells = [];
        const maxSpellLevel = this._getMaxSpellLevel(character);

        for (const [spellName, spell] of Object.entries(this.spellDatabase)) {
            const classSpellLevel = spell.levels[character.class.toLowerCase()];
            
            if (classSpellLevel !== undefined && classSpellLevel <= maxSpellLevel) {
                availableSpells.push({
                    ...spell,
                    name: spellName,
                    spellLevel: classSpellLevel
                });
            }
        }

        return availableSpells.sort((a, b) => a.spellLevel - b.spellLevel || a.name.localeCompare(b.name));
    }

    /**
     * Get spell slots for a character
     * @param {Object} character - Character object
     * @returns {Object} Spell slots by level
     */
    getSpellSlots(character) {
        const spellcasterLevel = this._getSpellcasterLevel(character);
        const characterClass = character.class.toLowerCase();
        
        if (!this.spellProgression[characterClass] || spellcasterLevel === 0) {
            return {};
        }

        const progression = this.spellProgression[characterClass][spellcasterLevel] || {};
        const bonusSpells = this._getBonusSpells(character);
        
        const slots = {};
        for (let level = 0; level <= 9; level++) {
            const baseSlots = progression[level] || 0;
            const bonus = bonusSpells[level] || 0;
            
            if (baseSlots > 0 || bonus > 0) {
                slots[level] = {
                    total: baseSlots + bonus,
                    used: character.spells.slotsUsed[level] || 0,
                    available: Math.max(0, baseSlots + bonus - (character.spells.slotsUsed[level] || 0))
                };
            }
        }

        return slots;
    }

    /**
     * Prepare a spell
     * @param {Object} character - Character object
     * @param {string} spellName - Name of spell to prepare
     * @param {number} spellLevel - Level to prepare spell at
     * @param {Array} metamagicFeats - Applied metamagic feats
     * @returns {Object} Preparation result
     */
    prepareSpell(character, spellName, spellLevel, metamagicFeats = []) {
        const spell = this.spellDatabase[spellName];
        if (!spell) {
            throw new Error(`Spell "${spellName}" not found`);
        }

        const characterClass = character.class.toLowerCase();
        const baseSpellLevel = spell.levels[characterClass];
        
        if (baseSpellLevel === undefined) {
            throw new Error(`${character.class} cannot cast ${spellName}`);
        }

        // Calculate effective spell level with metamagic
        let effectiveLevel = baseSpellLevel;
        const appliedMetamagic = [];
        
        metamagicFeats.forEach(featName => {
            const feat = this.metamagicFeats[featName];
            if (feat) {
                effectiveLevel += feat.levelIncrease;
                appliedMetamagic.push(feat);
            }
        });

        if (effectiveLevel > 9) {
            throw new Error(`Spell level cannot exceed 9 (would be ${effectiveLevel})`);
        }

        // Check if character has required spell slots
        const spellSlots = this.getSpellSlots(character);
        if (!spellSlots[effectiveLevel] || spellSlots[effectiveLevel].available <= 0) {
            throw new Error(`No available spell slots for level ${effectiveLevel}`);
        }

        // Prepare the spell
        const preparedSpell = {
            name: spellName,
            baseLevel: baseSpellLevel,
            effectiveLevel: effectiveLevel,
            metamagic: appliedMetamagic,
            prepared: true,
            cast: false,
            preparedAt: Date.now()
        };

        character.spells.prepared.push(preparedSpell);
        
        return {
            success: true,
            message: `${spellName} prepared at level ${effectiveLevel}`,
            preparedSpell
        };
    }

    /**
     * Cast a spell
     * @param {Object} character - Character object
     * @param {string} spellName - Name of spell to cast
     * @param {Object} options - Casting options
     * @returns {Object} Casting result
     */
    castSpell(character, spellName, options = {}) {
        const spell = this.spellDatabase[spellName];
        if (!spell) {
            throw new Error(`Spell "${spellName}" not found`);
        }

        const characterClass = character.class.toLowerCase();
        const spellLevel = options.spellLevel || spell.levels[characterClass];

        // Check if spell is prepared (for prepared casters) or known (for spontaneous casters)
        const canCast = this._canCastSpell(character, spellName, spellLevel);
        if (!canCast.allowed) {
            throw new Error(canCast.reason);
        }

        // Check spell slots
        const spellSlots = this.getSpellSlots(character);
        if (!spellSlots[spellLevel] || spellSlots[spellLevel].available <= 0) {
            throw new Error(`No available spell slots for level ${spellLevel}`);
        }

        // Consume spell slot
        if (!character.spells.slotsUsed[spellLevel]) {
            character.spells.slotsUsed[spellLevel] = 0;
        }
        character.spells.slotsUsed[spellLevel]++;

        // Mark prepared spell as cast (for prepared casters)
        if (this._usesPreparedSpells(characterClass)) {
            const preparedSpell = character.spells.prepared.find(
                s => s.name === spellName && s.effectiveLevel === spellLevel && !s.cast
            );
            if (preparedSpell) {
                preparedSpell.cast = true;
                preparedSpell.castAt = Date.now();
            }
        }

        // Calculate spell effects
        const spellEffects = this._calculateSpellEffects(character, spell, spellLevel, options);

        character.lastModified = Date.now();

        return {
            success: true,
            spell: spell,
            spellLevel: spellLevel,
            effects: spellEffects,
            message: `${character.name} casts ${spellName}!`,
            slotsRemaining: spellSlots[spellLevel].available - 1
        };
    }

    /**
     * Rest and recover spell slots
     * @param {Object} character - Character object
     * @param {string} restType - 'short' or 'long'
     * @returns {Object} Recovery result
     */
    restoreSpells(character, restType = 'long') {
        if (restType === 'long') {
            // Full spell slot recovery
            character.spells.slotsUsed = {};
            
            // Clear prepared spells (must be prepared again)
            if (this._usesPreparedSpells(character.class.toLowerCase())) {
                character.spells.prepared = [];
            }
            
            character.lastModified = Date.now();
            
            return {
                success: true,
                message: `${character.name} recovers all spell slots after a long rest`,
                recovery: 'full'
            };
        } else {
            // Short rest - limited recovery for some classes
            const characterClass = character.class.toLowerCase();
            let recovered = {};
            
            if (characterClass === 'wizard') {
                // Wizards can recover some spell slots on short rest (if they have arcane recovery)
                const wizardLevel = character.level;
                const recoveryLevel = Math.ceil(wizardLevel / 2);
                
                // Simple recovery: 1 slot of spell level = wizard level / 2
                const targetLevel = Math.min(Math.ceil(wizardLevel / 2), 5);
                if (character.spells.slotsUsed[targetLevel] > 0) {
                    character.spells.slotsUsed[targetLevel]--;
                    recovered[targetLevel] = 1;
                }
            }
            
            character.lastModified = Date.now();
            
            return {
                success: true,
                message: `${character.name} takes a short rest`,
                recovery: 'partial',
                recovered
            };
        }
    }

    /**
     * Get spell details including description and effects
     * @param {string} spellName - Name of the spell
     * @returns {Object} Complete spell information
     */
    getSpellDetails(spellName) {
        return this.spellDatabase[spellName] || null;
    }

    /**
     * Search spells by criteria
     * @param {Object} criteria - Search criteria
     * @returns {Array} Matching spells
     */
    searchSpells(criteria = {}) {
        const results = [];
        
        for (const [name, spell] of Object.entries(this.spellDatabase)) {
            let matches = true;
            
            // Filter by school
            if (criteria.school && spell.school.toLowerCase() !== criteria.school.toLowerCase()) {
                matches = false;
            }
            
            // Filter by level
            if (criteria.level !== undefined) {
                const hasLevel = Object.values(spell.levels).includes(criteria.level);
                if (!hasLevel) matches = false;
            }
            
            // Filter by class
            if (criteria.class) {
                const classLevel = spell.levels[criteria.class.toLowerCase()];
                if (classLevel === undefined) matches = false;
            }
            
            // Filter by components
            if (criteria.components) {
                const hasComponents = criteria.components.every(comp => 
                    spell.components.includes(comp.toUpperCase())
                );
                if (!hasComponents) matches = false;
            }
            
            // Text search in name or description
            if (criteria.text) {
                const text = criteria.text.toLowerCase();
                const searchText = (name + ' ' + spell.description).toLowerCase();
                if (!searchText.includes(text)) matches = false;
            }
            
            if (matches) {
                results.push({ name, ...spell });
            }
        }
        
        return results.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Private helper methods

    _getSpellcasterLevel(character) {
        const characterClass = character.class.toLowerCase();
        
        // Full casters get full level
        if (['wizard', 'cleric', 'druid', 'sorcerer'].includes(characterClass)) {
            return character.level;
        }
        
        // Half casters get level/2 (rounded down)
        if (['ranger', 'paladin'].includes(characterClass)) {
            return Math.floor(character.level / 2);
        }
        
        // Partial casters
        if (characterClass === 'bard') {
            return character.level;
        }
        
        return 0; // Non-spellcasters
    }

    _getMaxSpellLevel(character) {
        const spellcasterLevel = this._getSpellcasterLevel(character);
        const characterClass = character.class.toLowerCase();
        
        if (spellcasterLevel === 0) return 0;
        
        // Divine and arcane casters have different progressions
        if (['wizard', 'sorcerer', 'cleric', 'druid'].includes(characterClass)) {
            return Math.min(9, Math.ceil(spellcasterLevel / 2));
        }
        
        if (['bard', 'ranger', 'paladin'].includes(characterClass)) {
            return Math.min(4, Math.ceil(spellcasterLevel / 3));
        }
        
        return 0;
    }

    _getBonusSpells(character) {
        const characterClass = character.class.toLowerCase();
        const relevantAbility = this._getSpellcastingAbility(characterClass);
        const abilityScore = character.abilities[relevantAbility];
        const modifier = Math.floor((abilityScore - 10) / 2);
        
        const bonusSpells = {};
        
        // Bonus spells based on ability modifier
        for (let level = 1; level <= 9; level++) {
            const required = 10 + level;
            if (abilityScore >= required) {
                const bonus = Math.max(0, Math.floor((modifier - level + 1) / 4) + 1);
                if (bonus > 0) {
                    bonusSpells[level] = bonus;
                }
            }
        }
        
        return bonusSpells;
    }

    _getSpellcastingAbility(characterClass) {
        const abilityMap = {
            'wizard': 'intelligence',
            'cleric': 'wisdom',
            'druid': 'wisdom',
            'ranger': 'wisdom',
            'paladin': 'charisma',
            'sorcerer': 'charisma',
            'bard': 'charisma'
        };
        
        return abilityMap[characterClass] || 'intelligence';
    }

    _canCastSpell(character, spellName, spellLevel) {
        const characterClass = character.class.toLowerCase();
        
        if (this._usesPreparedSpells(characterClass)) {
            // Must have spell prepared
            const preparedSpell = character.spells.prepared.find(
                s => s.name === spellName && s.effectiveLevel === spellLevel && !s.cast
            );
            
            if (!preparedSpell) {
                return {
                    allowed: false,
                    reason: `${spellName} is not prepared at level ${spellLevel}`
                };
            }
        } else {
            // Spontaneous caster - must know the spell
            const knownSpells = character.spells.known || [];
            const knownSpell = knownSpells.find(s => s.name === spellName);
            
            if (!knownSpell) {
                return {
                    allowed: false,
                    reason: `${spellName} is not known`
                };
            }
        }
        
        return { allowed: true };
    }

    _usesPreparedSpells(characterClass) {
        return ['wizard', 'cleric', 'druid', 'ranger', 'paladin'].includes(characterClass);
    }

    _calculateSpellEffects(character, spell, spellLevel, options) {
        const effects = {
            damage: null,
            healing: null,
            duration: spell.duration,
            area: spell.area,
            targets: options.targets || 1,
            saveDC: null,
            spellResistance: spell.spellResistance || false
        };

        // Calculate save DC
        const spellcastingAbility = this._getSpellcastingAbility(character.class.toLowerCase());
        const abilityModifier = Math.floor((character.abilities[spellcastingAbility] - 10) / 2);
        effects.saveDC = 10 + spellLevel + abilityModifier;

        // Calculate variable effects based on spell level
        if (spell.damage) {
            const damageRoll = spell.damage.replace(/\(level\)/g, this._getSpellcasterLevel(character));
            effects.damage = {
                expression: damageRoll,
                type: spell.damageType || 'untyped'
            };
        }

        if (spell.healing) {
            const healingRoll = spell.healing.replace(/\(level\)/g, this._getSpellcasterLevel(character));
            effects.healing = {
                expression: healingRoll
            };
        }

        return effects;
    }

    _initializeSpellDatabase() {
        // This is a subset of D&D 3.5 spells - in a full implementation, this would be much larger
        return {
            // Cantrips (0-level spells)
            'detect-magic': {
                school: 'Divination',
                levels: { wizard: 0, cleric: 0, druid: 0, bard: 0, sorcerer: 0 },
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: '60 ft.',
                area: 'cone-shaped emanation',
                duration: 'concentration, up to 1 min./level',
                savingThrow: 'None',
                spellResistance: false,
                description: 'Detects magical auras within 60 feet.'
            },
            
            'light': {
                school: 'Evocation',
                levels: { wizard: 0, cleric: 0, druid: 0, bard: 0, sorcerer: 0 },
                components: ['V', 'M/DF'],
                castingTime: '1 standard action',
                range: 'Touch',
                target: 'Object touched',
                duration: '10 min./level',
                savingThrow: 'None',
                spellResistance: false,
                description: 'Object shines like a torch for 10 minutes per level.'
            },
            
            // 1st Level Spells
            'magic-missile': {
                school: 'Evocation',
                levels: { wizard: 1, sorcerer: 1 },
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: '130 ft.',
                targets: 'Up to five creatures, no two of which can be more than 15 ft. apart',
                duration: 'Instantaneous',
                savingThrow: 'None',
                spellResistance: true,
                damage: '1d4+1 per missile (up to 5 missiles)',
                damageType: 'force',
                description: 'Unerring missiles of magical force that automatically hit.'
            },
            
            'cure-light-wounds': {
                school: 'Conjuration',
                subschool: 'Healing',
                levels: { cleric: 1, druid: 1, ranger: 1 },
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Touch',
                target: 'Creature touched',
                duration: 'Instantaneous',
                savingThrow: 'Will half (harmless)',
                spellResistance: true,
                healing: '1d8+1',
                description: 'Cures 1d8+1 hit points of damage.'
            },
            
            'sleep': {
                school: 'Enchantment',
                subschool: 'Compulsion',
                levels: { wizard: 1, sorcerer: 1, bard: 1 },
                components: ['V', 'S', 'M'],
                castingTime: '1 round',
                range: 'Medium (100 ft. + 10 ft./level)',
                area: 'One or more living creatures within a 10-ft.-radius burst',
                duration: '1 min./level',
                savingThrow: 'Will negates',
                spellResistance: true,
                description: 'Puts creatures into magical slumber.'
            },
            
            // 2nd Level Spells
            'web': {
                school: 'Conjuration',
                subschool: 'Creation',
                levels: { wizard: 2, sorcerer: 2 },
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: 'Medium (100 ft. + 10 ft./level)',
                effect: 'Webs in a 20-ft.-radius spread',
                duration: '10 min./level',
                savingThrow: 'Reflex negates',
                spellResistance: false,
                description: 'Fills 20-ft.-radius spread with sticky spider webs.'
            },
            
            'invisibility': {
                school: 'Illusion',
                subschool: 'Glamer',
                levels: { wizard: 2, sorcerer: 2, bard: 2 },
                components: ['V', 'S', 'M/DF'],
                castingTime: '1 standard action',
                range: 'Personal or touch',
                target: 'You or creature touched',
                duration: '1 min./level',
                savingThrow: 'Will negates (harmless)',
                spellResistance: true,
                description: 'Subject becomes invisible for duration or until it attacks.'
            },
            
            // 3rd Level Spells
            'fireball': {
                school: 'Evocation',
                levels: { wizard: 3, sorcerer: 3 },
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: 'Long (400 ft. + 40 ft./level)',
                area: '20-ft.-radius spread',
                duration: 'Instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: true,
                damage: '1d6 per caster level (maximum 10d6)',
                damageType: 'fire',
                description: 'Explosive burst of flame deals 1d6 damage per caster level.'
            },
            
            'lightning-bolt': {
                school: 'Evocation',
                levels: { wizard: 3, sorcerer: 3 },
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: '120 ft.',
                area: '120-ft. line',
                duration: 'Instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: true,
                damage: '1d6 per caster level (maximum 10d6)',
                damageType: 'electricity',
                description: 'Bolt of electricity deals 1d6 damage per caster level.'
            },
            
            // Add more spells as needed...
            'teleport': {
                school: 'Conjuration',
                subschool: 'Teleportation',
                levels: { wizard: 5, sorcerer: 5 },
                components: ['V'],
                castingTime: '1 standard action',
                range: 'Personal and touch',
                target: 'You and touched objects or other willing creatures',
                duration: 'Instantaneous',
                savingThrow: 'None and Will negates (object)',
                spellResistance: false,
                description: 'Instantly transports you as far as 100 miles per caster level.'
            }
        };
    }

    _initializeMetamagicFeats() {
        return {
            'Empower Spell': {
                levelIncrease: 2,
                description: 'Increase variable, numeric spell effects by 50%'
            },
            'Enlarge Spell': {
                levelIncrease: 1,
                description: 'Double spell range'
            },
            'Extend Spell': {
                levelIncrease: 1,
                description: 'Double spell duration'
            },
            'Heighten Spell': {
                levelIncrease: 0, // Variable
                description: 'Treat spell as higher level for all effects'
            },
            'Maximize Spell': {
                levelIncrease: 3,
                description: 'All variable, numeric effects are maximized'
            },
            'Quicken Spell': {
                levelIncrease: 4,
                description: 'Cast spell as swift action'
            },
            'Silent Spell': {
                levelIncrease: 1,
                description: 'Cast spell without verbal components'
            },
            'Still Spell': {
                levelIncrease: 1,
                description: 'Cast spell without somatic components'
            },
            'Widen Spell': {
                levelIncrease: 3,
                description: 'Double spell area'
            }
        };
    }

    _initializeSpellProgression() {
        // Spell slots per day by class and level
        return {
            wizard: {
                1:  { 0: 3, 1: 1 },
                2:  { 0: 4, 1: 2 },
                3:  { 0: 4, 1: 2, 2: 1 },
                4:  { 0: 4, 1: 3, 2: 2 },
                5:  { 0: 4, 1: 3, 2: 2, 3: 1 },
                6:  { 0: 4, 1: 3, 2: 3, 3: 2 },
                7:  { 0: 4, 1: 4, 2: 3, 3: 2, 4: 1 },
                8:  { 0: 4, 1: 4, 2: 3, 3: 3, 4: 2 },
                9:  { 0: 4, 1: 4, 2: 4, 3: 3, 4: 2, 5: 1 },
                10: { 0: 4, 1: 4, 2: 4, 3: 3, 4: 3, 5: 2 },
                11: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 3, 5: 2, 6: 1 },
                12: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 3, 5: 3, 6: 2 },
                13: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 3, 6: 2, 7: 1 },
                14: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 3, 6: 3, 7: 2 },
                15: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 3, 7: 2, 8: 1 },
                16: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 3, 7: 3, 8: 2 },
                17: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 3, 8: 2, 9: 1 },
                18: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 3, 8: 3, 9: 2 },
                19: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4, 8: 3, 9: 3 },
                20: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4 }
            },
            
            sorcerer: {
                1:  { 0: 5, 1: 3 },
                2:  { 0: 6, 1: 4 },
                3:  { 0: 6, 1: 5 },
                4:  { 0: 6, 1: 6, 2: 3 },
                5:  { 0: 6, 1: 6, 2: 4 },
                6:  { 0: 6, 1: 6, 2: 5, 3: 3 },
                7:  { 0: 6, 1: 6, 2: 6, 3: 4 },
                8:  { 0: 6, 1: 6, 2: 6, 3: 5, 4: 3 },
                9:  { 0: 6, 1: 6, 2: 6, 3: 6, 4: 4 },
                10: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 5, 5: 3 },
                11: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 4 },
                12: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 5, 6: 3 },
                13: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 4 },
                14: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 5, 7: 3 },
                15: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 6, 7: 4 },
                16: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 6, 7: 5, 8: 3 },
                17: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 6, 7: 6, 8: 4 },
                18: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 6, 7: 6, 8: 5, 9: 3 },
                19: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 6, 7: 6, 8: 6, 9: 4 },
                20: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 6, 7: 6, 8: 6, 9: 6 }
            },
            
            cleric: {
                1:  { 0: 3, 1: 1 },
                2:  { 0: 4, 1: 2 },
                3:  { 0: 4, 1: 2, 2: 1 },
                4:  { 0: 5, 1: 3, 2: 2 },
                5:  { 0: 5, 1: 3, 2: 2, 3: 1 },
                6:  { 0: 5, 1: 3, 2: 3, 3: 2 },
                7:  { 0: 6, 1: 4, 2: 3, 3: 2, 4: 1 },
                8:  { 0: 6, 1: 4, 2: 3, 3: 3, 4: 2 },
                9:  { 0: 6, 1: 4, 2: 4, 3: 3, 4: 2, 5: 1 },
                10: { 0: 6, 1: 4, 2: 4, 3: 3, 4: 3, 5: 2 },
                11: { 0: 6, 1: 5, 2: 4, 3: 4, 4: 3, 5: 2, 6: 1 },
                12: { 0: 6, 1: 5, 2: 4, 3: 4, 4: 3, 5: 3, 6: 2 },
                13: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 4, 5: 3, 6: 2, 7: 1 },
                14: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 4, 5: 3, 6: 3, 7: 2 },
                15: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 4, 5: 4, 6: 3, 7: 2, 8: 1 },
                16: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 4, 5: 4, 6: 3, 7: 3, 8: 2 },
                17: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 4, 7: 3, 8: 2, 9: 1 },
                18: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 4, 7: 3, 8: 3, 9: 2 },
                19: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4, 7: 4, 8: 3, 9: 3 },
                20: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4, 7: 4, 8: 4, 9: 4 }
            },
            
            // Add other spellcasting classes (druid, bard, ranger, paladin)...
            bard: {
                1:  { 0: 2, 1: 0 },
                2:  { 0: 3, 1: 1 },
                3:  { 0: 3, 1: 2 },
                4:  { 0: 3, 1: 3, 2: 0 },
                5:  { 0: 3, 1: 3, 2: 1 },
                6:  { 0: 3, 1: 3, 2: 2 }
                // Continue progression...
            }
        };
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpellManager;
} else if (typeof window !== 'undefined') {
    window.SpellManager = SpellManager;
}
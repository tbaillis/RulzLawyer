/**
 * SpellSystemFoundation - D&D 3.5 Spell System Integration
 * 
 * Comprehensive spell management system with preparation, casting mechanics,
 * metamagic feats, and combat integration for D&D 3.5
 * 
 * @version 2.0.0  
 * @author RulzLawyer Development Team
 */

class SpellSystemFoundation {
    constructor(dataManager, diceEngine) {
        this.dataManager = dataManager;
        this.diceEngine = diceEngine;
        
        // Spell databases
        this.spells = new Map();
        this.spellLists = new Map(); // By class
        this.metamagicFeats = new Map();
        this.spellComponents = new Map();
        
        // Active spell tracking
        this.activeSpells = new Map(); // By caster ID
        this.concentrationSpells = new Map();
        this.spellEffects = new Map();
        
        // Spell configuration
        this.spellConfig = {
            maxSpellLevel: 9,
            castingTimes: {
                '1 standard action': { actions: 1, type: 'standard' },
                '1 full round': { actions: 1, type: 'full' },
                '1 swift action': { actions: 1, type: 'swift' },
                '1 immediate action': { actions: 1, type: 'immediate' },
                '1 minute': { actions: 10, type: 'extended' },
                '10 minutes': { actions: 100, type: 'ritual' }
            },
            ranges: {
                'Personal': 0,
                'Touch': 5,
                'Close': 25, // 25 ft + 5 ft/2 levels
                'Medium': 100, // 100 ft + 10 ft/level
                'Long': 400, // 400 ft + 40 ft/level
                'Unlimited': -1
            },
            savingThrows: {
                'None': { type: 'none' },
                'Will negates': { type: 'will', result: 'negates' },
                'Fortitude half': { type: 'fortitude', result: 'half' },
                'Reflex half': { type: 'reflex', result: 'half' },
                'Will disbelief': { type: 'will', result: 'disbelief' }
            }
        };
        
        this.initializeSpellSystem();
        console.log('🔮 Spell System Foundation initialized');
    }

    /**
     * Initialize spell system with base data
     */
    async initializeSpellSystem() {
        await this.loadSpellDatabase();
        await this.loadMetamagicFeats();
        await this.loadSpellComponents();
        this.setupSpellLists();
        
        console.log(`✅ Loaded ${this.spells.size} spells for spell system`);
    }

    /**
     * Load D&D 3.5 spell database
     */
    async loadSpellDatabase() {
        const spellData = [
            // 0-Level Spells (Cantrips/Orisons)
            {
                name: 'Detect Magic',
                level: { wizard: 0, cleric: 0, bard: 0, druid: 0, paladin: 1, ranger: 1 },
                school: 'Divination',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: '60 ft',
                area: 'cone-shaped emanation',
                duration: 'Concentration, up to 1 min/level (D)',
                savingThrow: 'None',
                spellResistance: 'No',
                description: 'Detects spells and magic items within 60 ft.'
            },
            {
                name: 'Light',
                level: { wizard: 0, cleric: 0, bard: 0, druid: 0 },
                school: 'Evocation',
                subschool: 'Light',
                components: ['V', 'M/DF'],
                castingTime: '1 standard action',
                range: 'Touch',
                target: 'Object touched',
                duration: '10 min/level (D)',
                savingThrow: 'None',
                spellResistance: 'No',
                description: 'Object shines like a torch.'
            },
            {
                name: 'Mage Hand',
                level: { wizard: 0, bard: 0 },
                school: 'Transmutation',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Medium (100 ft + 10 ft/level)',
                target: 'One nonmagical, unattended object weighing up to 5 lb',
                duration: 'Concentration',
                savingThrow: 'None',
                spellResistance: 'No',
                description: 'Telekinetically move 5-pound object.'
            },
            
            // 1st Level Spells
            {
                name: 'Magic Missile',
                level: { wizard: 1 },
                school: 'Evocation',
                subschool: 'Force',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Medium (100 ft + 10 ft/level)',
                targets: 'Up to five creatures, no two of which can be more than 15 ft apart',
                duration: 'Instantaneous',
                savingThrow: 'None',
                spellResistance: 'Yes',
                description: '1d4+1 force damage; +1 missile per two levels above 1st (max 5).',
                damage: '1d4+1',
                scaling: { type: 'missiles', rate: 2, max: 5 }
            },
            {
                name: 'Cure Light Wounds',
                level: { cleric: 1, druid: 1, paladin: 1, ranger: 2, bard: 1 },
                school: 'Conjuration',
                subschool: 'Healing',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Touch',
                target: 'Creature touched',
                duration: 'Instantaneous',
                savingThrow: 'Will half (harmless)',
                spellResistance: 'Yes (harmless)',
                description: 'Cures 1d8+1/level (max +5) points of damage.',
                healing: '1d8+1',
                scaling: { type: 'bonus', rate: 1, max: 5 }
            },
            {
                name: 'Shield',
                level: { wizard: 1 },
                school: 'Abjuration',
                subschool: 'Force',
                components: ['V', 'S'],
                castingTime: '1 standard action',
                range: 'Personal',
                target: 'You',
                duration: '1 min/level (D)',
                description: '+4 AC, immune to magic missile.',
                effects: [
                    { type: 'ac_bonus', value: 4, bonusType: 'shield' },
                    { type: 'immunity', value: 'magic missile' }
                ]
            },
            {
                name: 'Sleep',
                level: { wizard: 1, bard: 1 },
                school: 'Enchantment',
                subschool: 'Compulsion',
                descriptor: 'Mind-Affecting',
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: 'Medium (100 ft + 10 ft/level)',
                area: 'One or more living creatures within a 10-ft-radius burst',
                duration: '1 min/level',
                savingThrow: 'Will negates',
                spellResistance: 'Yes',
                description: 'Puts 4d4 HD of creatures into magical slumber.',
                hitDiceAffected: '4d4'
            },
            
            // 2nd Level Spells
            {
                name: 'Web',
                level: { wizard: 2 },
                school: 'Conjuration',
                subschool: 'Creation',
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: 'Medium (100 ft + 10 ft/level)',
                effect: 'Webs in a 20-ft-radius spread',
                duration: '10 min/level (D)',
                savingThrow: 'Reflex negates; see text',
                spellResistance: 'No',
                description: 'Fills 20-ft-radius spread with sticky spider webs.'
            },
            {
                name: 'Invisibility',
                level: { wizard: 2, bard: 2 },
                school: 'Illusion',
                subschool: 'Glamer',
                components: ['V', 'S', 'M/DF'],
                castingTime: '1 standard action',
                range: 'Personal or touch',
                target: 'You or a creature or object weighing no more than 100 lb/level',
                duration: '1 min/level (D)',
                savingThrow: 'Will negates (harmless) or Will negates (harmless, object)',
                spellResistance: 'Yes (harmless) or Yes (harmless, object)',
                description: 'Subject becomes invisible until it attacks or casts a spell.',
                effects: [
                    { type: 'condition', value: 'invisible' },
                    { type: 'concealment', value: 'total' }
                ]
            },
            
            // 3rd Level Spells
            {
                name: 'Fireball',
                level: { wizard: 3 },
                school: 'Evocation',
                subschool: 'Fire',
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: 'Long (400 ft + 40 ft/level)',
                area: '20-ft-radius spread',
                duration: 'Instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'Yes',
                description: '1d6 fire damage per caster level (max 10d6).',
                damage: '1d6',
                damageType: 'fire',
                scaling: { type: 'dice', rate: 1, max: 10 }
            },
            {
                name: 'Lightning Bolt',
                level: { wizard: 3 },
                school: 'Evocation',
                subschool: 'Electricity',
                components: ['V', 'S', 'M'],
                castingTime: '1 standard action',
                range: '120 ft',
                area: '120-ft line',
                duration: 'Instantaneous',
                savingThrow: 'Reflex half',
                spellResistance: 'Yes',
                description: '1d6 electricity damage per caster level (max 10d6).',
                damage: '1d6',
                damageType: 'electricity',
                scaling: { type: 'dice', rate: 1, max: 10 }
            },
            
            // Higher Level Spells (examples)
            {
                name: 'Teleport',
                level: { wizard: 5 },
                school: 'Conjuration',
                subschool: 'Teleportation',
                components: ['V'],
                castingTime: '1 standard action',
                range: 'Personal and touch',
                target: 'You and touched objects or other touched willing creatures',
                duration: 'Instantaneous',
                savingThrow: 'None and Will negates (object)',
                spellResistance: 'No and Yes (object)',
                description: 'Instantly transports you as far as 100 miles/level.'
            },
            {
                name: 'Wish',
                level: { wizard: 9 },
                school: 'Universal',
                components: ['V', 'S', 'XP'],
                castingTime: '1 standard action',
                range: 'See text',
                target: 'See text',
                duration: 'See text',
                savingThrow: 'None; see text',
                spellResistance: 'Yes',
                description: 'Alter reality within limits.',
                xpCost: 5000
            }
        ];
        
        spellData.forEach(spell => {
            spell.id = this.generateSpellId(spell.name);
            this.spells.set(spell.name.toLowerCase(), spell);
        });
    }

    /**
     * Load metamagic feats
     */
    async loadMetamagicFeats() {
        const metamagicData = [
            {
                name: 'Empower Spell',
                levelIncrease: 2,
                description: 'All variable, numeric effects of an empowered spell are increased by one-half.',
                effect: 'multiply_damage_by_1.5'
            },
            {
                name: 'Enlarge Spell',
                levelIncrease: 1,
                description: 'Double the range of the spell.',
                effect: 'double_range'
            },
            {
                name: 'Extend Spell',
                levelIncrease: 1,
                description: 'Double the duration of the spell.',
                effect: 'double_duration'
            },
            {
                name: 'Heighten Spell',
                levelIncrease: 'variable',
                description: 'Cast spell as if it were a higher level.',
                effect: 'increase_effective_level'
            },
            {
                name: 'Maximize Spell',
                levelIncrease: 3,
                description: 'All variable, numeric effects of the spell are maximized.',
                effect: 'maximize_damage'
            },
            {
                name: 'Quicken Spell',
                levelIncrease: 4,
                description: 'Cast spell as a swift action.',
                effect: 'swift_action_casting'
            },
            {
                name: 'Silent Spell',
                levelIncrease: 1,
                description: 'Cast spell without verbal components.',
                effect: 'remove_verbal_components'
            },
            {
                name: 'Still Spell',
                levelIncrease: 1,
                description: 'Cast spell without somatic components.',
                effect: 'remove_somatic_components'
            },
            {
                name: 'Widen Spell',
                levelIncrease: 3,
                description: 'Double the area of the spell.',
                effect: 'double_area'
            }
        ];
        
        metamagicData.forEach(feat => {
            this.metamagicFeats.set(feat.name.toLowerCase(), feat);
        });
    }

    /**
     * Set up spell lists by class
     */
    setupSpellLists() {
        const classes = ['wizard', 'cleric', 'druid', 'bard', 'paladin', 'ranger'];
        
        classes.forEach(className => {
            const spellList = new Map();
            
            // Organize spells by level for this class
            for (let level = 0; level <= 9; level++) {
                spellList.set(level, []);
            }
            
            // Populate spell list
            this.spells.forEach(spell => {
                if (spell.level[className] !== undefined) {
                    const level = spell.level[className];
                    spellList.get(level).push(spell);
                }
            });
            
            this.spellLists.set(className, spellList);
        });
    }

    // ===== SPELL PREPARATION SYSTEM =====

    /**
     * Prepare spells for prepared casters (Wizard, Cleric, Druid, Paladin, Ranger)
     */
    prepareSpells(character, selectedSpells) {
        const characterClass = this.getPrimaryCasterClass(character);
        if (!this.isPreparedCaster(characterClass)) {
            throw new Error(`${characterClass} is not a prepared caster`);
        }
        
        // Validate spell slots available
        const spellSlots = this.calculateSpellSlots(character, characterClass);
        const validationResult = this.validateSpellPreparation(selectedSpells, spellSlots);
        
        if (!validationResult.valid) {
            throw new Error(`Invalid spell preparation: ${validationResult.errors.join(', ')}`);
        }
        
        // Prepare spells
        character.preparedSpells = character.preparedSpells || {};
        character.preparedSpells[characterClass] = {
            spells: selectedSpells,
            preparedAt: Date.now(),
            spellSlots: spellSlots,
            dailySlots: { ...spellSlots } // Track remaining slots
        };
        
        console.log(`🔮 Prepared ${selectedSpells.length} spells for ${character.name}`);
        
        return character.preparedSpells[characterClass];
    }

    /**
     * Cast prepared spell
     */
    castPreparedSpell(character, spellName, casterLevel, metamagicFeats = []) {
        const characterClass = this.getPrimaryCasterClass(character);
        const preparedSpells = character.preparedSpells?.[characterClass];
        
        if (!preparedSpells) {
            throw new Error('No spells prepared');
        }
        
        // Find prepared spell
        const preparedSpell = preparedSpells.spells.find(s => 
            s.name.toLowerCase() === spellName.toLowerCase()
        );
        
        if (!preparedSpell) {
            throw new Error(`Spell ${spellName} not prepared`);
        }
        
        // Calculate effective spell level with metamagic
        const effectiveLevel = this.calculateEffectiveSpellLevel(
            preparedSpell, metamagicFeats
        );
        
        // Check if slot available
        if (preparedSpells.dailySlots[effectiveLevel] <= 0) {
            throw new Error(`No ${effectiveLevel}-level spell slots remaining`);
        }
        
        // Cast spell
        const castingResult = this.castSpell(
            character, preparedSpell, casterLevel, metamagicFeats
        );
        
        // Consume spell slot
        preparedSpells.dailySlots[effectiveLevel]--;
        
        return castingResult;
    }

    /**
     * Cast known spell (Bard, Sorcerer)
     */
    castKnownSpell(character, spellName, casterLevel, metamagicFeats = []) {
        const characterClass = this.getPrimaryCasterClass(character);
        
        if (this.isPreparedCaster(characterClass)) {
            throw new Error(`${characterClass} must prepare spells`);
        }
        
        // Check if spell is known
        const knownSpells = character.knownSpells?.[characterClass] || [];
        const spell = knownSpells.find(s => s.name.toLowerCase() === spellName.toLowerCase());
        
        if (!spell) {
            throw new Error(`Spell ${spellName} not known`);
        }
        
        // Calculate effective spell level
        const effectiveLevel = this.calculateEffectiveSpellLevel(spell, metamagicFeats);
        
        // Check spell slots
        const spellSlots = character.spellSlots?.[characterClass] || {};
        if ((spellSlots[effectiveLevel] || 0) <= 0) {
            throw new Error(`No ${effectiveLevel}-level spell slots remaining`);
        }
        
        // Cast spell
        const castingResult = this.castSpell(character, spell, casterLevel, metamagicFeats);
        
        // Consume spell slot
        spellSlots[effectiveLevel]--;
        
        return castingResult;
    }

    // ===== SPELL CASTING MECHANICS =====

    /**
     * Core spell casting function
     */
    castSpell(caster, spell, casterLevel, metamagicFeats = []) {
        const castingResult = {
            success: false,
            spell: spell,
            casterLevel: casterLevel,
            metamagicFeats: metamagicFeats,
            effects: [],
            damage: null,
            healing: null,
            duration: null,
            targets: [],
            savingThrow: null,
            spellResistance: null
        };
        
        try {
            // Apply metamagic modifications
            const modifiedSpell = this.applyMetamagic(spell, metamagicFeats, casterLevel);
            
            // Calculate spell save DC
            const saveDC = this.calculateSpellSaveDC(caster, modifiedSpell, casterLevel);
            
            // Calculate spell effects based on caster level
            const spellEffects = this.calculateSpellEffects(modifiedSpell, casterLevel);
            
            // Apply spell effects
            castingResult.effects = spellEffects;
            castingResult.damage = spellEffects.damage;
            castingResult.healing = spellEffects.healing;
            castingResult.duration = this.calculateSpellDuration(modifiedSpell, casterLevel);
            castingResult.saveDC = saveDC;
            castingResult.success = true;
            
            // Track active spell if it has duration
            if (castingResult.duration && castingResult.duration > 0) {
                this.trackActiveSpell(caster, modifiedSpell, castingResult);
            }
            
            console.log(`🔮 Cast ${spell.name} at caster level ${casterLevel}`);
            
        } catch (error) {
            castingResult.error = error.message;
            console.error('Spell casting failed:', error);
        }
        
        return castingResult;
    }

    /**
     * Apply metamagic feat modifications
     */
    applyMetamagic(spell, metamagicFeats, casterLevel) {
        const modifiedSpell = { ...spell };
        
        metamagicFeats.forEach(featName => {
            const feat = this.metamagicFeats.get(featName.toLowerCase());
            if (!feat) return;
            
            switch (feat.effect) {
                case 'multiply_damage_by_1.5':
                    if (modifiedSpell.damage) {
                        modifiedSpell.empowered = true;
                    }
                    break;
                    
                case 'double_range':
                    if (modifiedSpell.range !== 'Personal' && modifiedSpell.range !== 'Touch') {
                        modifiedSpell.rangeMultiplier = (modifiedSpell.rangeMultiplier || 1) * 2;
                    }
                    break;
                    
                case 'double_duration':
                    modifiedSpell.durationMultiplier = (modifiedSpell.durationMultiplier || 1) * 2;
                    break;
                    
                case 'maximize_damage':
                    if (modifiedSpell.damage) {
                        modifiedSpell.maximized = true;
                    }
                    break;
                    
                case 'swift_action_casting':
                    modifiedSpell.castingTime = '1 swift action';
                    break;
                    
                case 'double_area':
                    modifiedSpell.areaMultiplier = (modifiedSpell.areaMultiplier || 1) * 2;
                    break;
            }
        });
        
        return modifiedSpell;
    }

    /**
     * Calculate spell save DC
     */
    calculateSpellSaveDC(caster, spell, casterLevel) {
        const spellLevel = this.getSpellLevelForClass(spell, this.getPrimaryCasterClass(caster));
        const abilityScore = this.getCastingAbilityScore(caster);
        const abilityModifier = Math.floor((abilityScore - 10) / 2);
        
        let saveDC = 10 + spellLevel + abilityModifier;
        
        // Add focus specialization bonus if applicable
        if (caster.specializations && caster.specializations.includes(spell.school)) {
            saveDC += 2;
        }
        
        // Add equipment bonuses
        if (caster.equipmentBonuses && caster.equipmentBonuses.spellDC) {
            saveDC += caster.equipmentBonuses.spellDC;
        }
        
        return saveDC;
    }

    /**
     * Calculate spell effects based on caster level
     */
    calculateSpellEffects(spell, casterLevel) {
        const effects = {
            damage: null,
            healing: null,
            hitDice: null,
            conditions: [],
            bonuses: []
        };
        
        // Calculate damage
        if (spell.damage) {
            effects.damage = this.calculateSpellDamage(spell, casterLevel);
        }
        
        // Calculate healing
        if (spell.healing) {
            effects.healing = this.calculateSpellHealing(spell, casterLevel);
        }
        
        // Calculate hit dice affected (for sleep, etc.)
        if (spell.hitDiceAffected) {
            effects.hitDice = this.diceEngine.roll(spell.hitDiceAffected);
        }
        
        // Apply spell-specific effects
        if (spell.effects) {
            effects.conditions = spell.effects.filter(e => e.type === 'condition');
            effects.bonuses = spell.effects.filter(e => e.type === 'bonus' || e.type === 'ac_bonus');
        }
        
        return effects;
    }

    /**
     * Calculate spell damage with scaling
     */
    calculateSpellDamage(spell, casterLevel) {
        if (!spell.damage) return null;
        
        let diceCount = 1;
        let diceSize = 6;
        let bonus = 0;
        
        // Parse damage string (e.g., "1d6", "1d4+1")
        const damageMatch = spell.damage.match(/(\d+)d(\d+)(\+\d+)?/);
        if (damageMatch) {
            diceCount = parseInt(damageMatch[1]);
            diceSize = parseInt(damageMatch[2]);
            bonus = damageMatch[3] ? parseInt(damageMatch[3]) : 0;
        }
        
        // Apply scaling
        if (spell.scaling) {
            switch (spell.scaling.type) {
                case 'dice':
                    diceCount = Math.min(casterLevel, spell.scaling.max || casterLevel);
                    break;
                case 'bonus':
                    bonus = Math.min(casterLevel, spell.scaling.max || casterLevel);
                    break;
                case 'missiles':
                    const missiles = Math.min(
                        1 + Math.floor((casterLevel - 1) / spell.scaling.rate),
                        spell.scaling.max
                    );
                    return this.rollMultipleMissiles(diceSize, bonus, missiles);
            }
        }
        
        // Roll damage
        const damageRoll = this.diceEngine.roll(`${diceCount}d${diceSize}${bonus > 0 ? '+' + bonus : ''}`);
        
        // Apply metamagic
        let finalDamage = damageRoll.total;
        if (spell.empowered) {
            finalDamage = Math.floor(finalDamage * 1.5);
        }
        if (spell.maximized) {
            finalDamage = (diceCount * diceSize) + bonus;
        }
        
        return {
            roll: damageRoll,
            total: finalDamage,
            type: spell.damageType || 'untyped',
            empowered: spell.empowered || false,
            maximized: spell.maximized || false
        };
    }

    // ===== SPELL SLOT CALCULATION =====

    /**
     * Calculate available spell slots for character
     */
    calculateSpellSlots(character, className) {
        const classLevel = this.getClassLevel(character, className);
        const castingAbility = this.getCastingAbilityScore(character, className);
        const abilityModifier = Math.floor((castingAbility - 10) / 2);
        
        const spellSlots = {};
        
        // Base spell slots by class and level
        const baseSlots = this.getBaseSpellSlots(className, classLevel);
        
        // Add bonus spells from high ability score
        const bonusSpells = this.getBonusSpells(abilityModifier);
        
        for (let level = 0; level <= 9; level++) {
            const base = baseSlots[level] || 0;
            const bonus = bonusSpells[level] || 0;
            
            if (base > 0 || level === 0) {
                spellSlots[level] = base + bonus;
            }
        }
        
        return spellSlots;
    }

    /**
     * Get base spell slots for class and level
     */
    getBaseSpellSlots(className, level) {
        const spellSlotTables = {
            wizard: {
                1: [3, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                2: [4, 2, 0, 0, 0, 0, 0, 0, 0, 0],
                3: [4, 2, 1, 0, 0, 0, 0, 0, 0, 0],
                4: [4, 3, 2, 0, 0, 0, 0, 0, 0, 0],
                5: [4, 3, 2, 1, 0, 0, 0, 0, 0, 0],
                10: [4, 4, 4, 4, 4, 3, 2, 1, 0, 0],
                20: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
            },
            cleric: {
                1: [3, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                2: [4, 2, 0, 0, 0, 0, 0, 0, 0, 0],
                3: [4, 2, 1, 0, 0, 0, 0, 0, 0, 0],
                20: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
            },
            bard: {
                1: [2, 0, 0, 0, 0, 0, 0],
                2: [3, 1, 0, 0, 0, 0, 0],
                3: [3, 2, 0, 0, 0, 0, 0],
                20: [6, 6, 6, 6, 6, 6, 6]
            }
        };
        
        const table = spellSlotTables[className.toLowerCase()];
        if (!table) return {};
        
        // Find appropriate level entry (use highest available if exact not found)
        const availableLevels = Object.keys(table).map(Number).sort((a, b) => a - b);
        let useLevel = availableLevels[0];
        
        for (const tableLevel of availableLevels) {
            if (level >= tableLevel) {
                useLevel = tableLevel;
            }
        }
        
        const slots = table[useLevel] || [];
        const result = {};
        
        for (let i = 0; i < slots.length; i++) {
            if (slots[i] > 0) {
                result[i] = slots[i];
            }
        }
        
        return result;
    }

    // ===== UTILITY METHODS =====

    /**
     * Get spell by name
     */
    getSpell(name) {
        return this.spells.get(name.toLowerCase());
    }

    /**
     * Get spells for class and level
     */
    getSpellsForClass(className, level) {
        const spellList = this.spellLists.get(className.toLowerCase());
        return spellList ? spellList.get(level) || [] : [];
    }

    /**
     * Check if class is prepared caster
     */
    isPreparedCaster(className) {
        const preparedCasters = ['wizard', 'cleric', 'druid', 'paladin', 'ranger'];
        return preparedCasters.includes(className.toLowerCase());
    }

    /**
     * Get primary caster class
     */
    getPrimaryCasterClass(character) {
        const casterClasses = ['wizard', 'cleric', 'druid', 'bard', 'paladin', 'ranger', 'sorcerer'];
        
        for (const charClass of character.classes) {
            if (casterClasses.includes(charClass.name.toLowerCase())) {
                return charClass.name.toLowerCase();
            }
        }
        
        return null;
    }

    /**
     * Get casting ability score
     */
    getCastingAbilityScore(character, className = null) {
        const casterClass = className || this.getPrimaryCasterClass(character);
        
        const castingAbilities = {
            wizard: 'intelligence',
            cleric: 'wisdom',
            druid: 'wisdom',
            bard: 'charisma',
            paladin: 'wisdom',
            ranger: 'wisdom',
            sorcerer: 'charisma'
        };
        
        const ability = castingAbilities[casterClass];
        return character.abilities[ability] || 10;
    }

    /**
     * Generate spell ID
     */
    generateSpellId(name) {
        return `spell_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    }

    /**
     * Track active spell
     */
    trackActiveSpell(caster, spell, castingResult) {
        const casterId = caster.id;
        
        if (!this.activeSpells.has(casterId)) {
            this.activeSpells.set(casterId, []);
        }
        
        const activeSpell = {
            id: this.generateSpellId(spell.name),
            spell: spell,
            caster: casterId,
            castingResult: castingResult,
            startTime: Date.now(),
            endTime: Date.now() + (castingResult.duration * 1000),
            concentration: spell.concentration || false
        };
        
        this.activeSpells.get(casterId).push(activeSpell);
        
        // Track concentration spell separately
        if (activeSpell.concentration) {
            this.concentrationSpells.set(casterId, activeSpell);
        }
    }

    /**
     * Get active spells for caster
     */
    getActiveSpells(casterId) {
        return this.activeSpells.get(casterId) || [];
    }

    /**
     * Remove expired spells
     */
    cleanupExpiredSpells() {
        const now = Date.now();
        
        this.activeSpells.forEach((spells, casterId) => {
            const activeSpells = spells.filter(spell => spell.endTime > now);
            this.activeSpells.set(casterId, activeSpells);
        });
    }
}

// Global export for both browser and Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpellSystemFoundation;
} else if (typeof window !== 'undefined') {
    window.SpellSystemFoundation = SpellSystemFoundation;
}
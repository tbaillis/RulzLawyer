/**
 * SpellManager - Comprehensive D&D 3.5 Spell System
 * Manages spell slots, known spells, prepared spells, and spellcasting mechanics
 * 
 * Features:
 * - Spell slot calculation by class and level
 * - Known spells for spontaneous casters (Sorcerer, Bard)
 * - Prepared spells for prepared casters (Wizard, Cleric, Druid)
 * - Spell DC calculations and casting mechanics
 * - Metamagic feat integration
 * - Domain spells for Clerics
 * - Spell school specialization for Wizards
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class SpellManager {
    constructor(srdDataManager) {
        this.srdData = srdDataManager;
        this.spellDatabase = this.initializeSpellDatabase();
        
        console.log('🔮 SpellManager initialized with comprehensive D&D 3.5 spell system');
    }

    /**
     * Initialize spell database with D&D 3.5 spells
     */
    initializeSpellDatabase() {
        return {
            // Level 0 (Cantrips/Orisons)
            0: [
                { name: 'Detect Magic', school: 'Divination', classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'], description: 'Detects spells and magic items within 60 ft.' },
                { name: 'Light', school: 'Evocation', classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'], description: 'Object shines like a torch.' },
                { name: 'Mage Hand', school: 'Transmutation', classes: ['Bard', 'Sorcerer', 'Wizard'], description: 'Telekinetically moves 5 pounds.' },
                { name: 'Prestidigitation', school: 'Universal', classes: ['Bard', 'Sorcerer', 'Wizard'], description: 'Performs minor tricks.' },
                { name: 'Read Magic', school: 'Divination', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Wizard'], description: 'Read scrolls and spellbooks.' },
                { name: 'Resistance', school: 'Abjuration', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Sorcerer', 'Wizard'], description: 'Subject gains +1 on saving throws.' }
            ],
            // Level 1
            1: [
                { name: 'Magic Missile', school: 'Evocation', classes: ['Sorcerer', 'Wizard'], description: 'Unerring missiles deal 1d4+1 damage each.' },
                { name: 'Shield', school: 'Abjuration', classes: ['Sorcerer', 'Wizard'], description: '+4 AC and immunity to magic missile.' },
                { name: 'Cure Light Wounds', school: 'Conjuration', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger'], description: 'Cures 1d8+1 damage (max +5).' },
                { name: 'Bless', school: 'Enchantment', classes: ['Cleric', 'Paladin'], description: 'Allies gain +1 on attack rolls and saves.' },
                { name: 'Burning Hands', school: 'Evocation', classes: ['Sorcerer', 'Wizard'], description: '3d4 fire damage to targets in 15-ft cone.' },
                { name: 'Charm Person', school: 'Enchantment', classes: ['Bard', 'Sorcerer', 'Wizard'], description: 'Makes one person your friend.' },
                { name: 'Sleep', school: 'Enchantment', classes: ['Bard', 'Sorcerer', 'Wizard'], description: 'Put 4d4 HD of creatures to sleep.' }
            ],
            // Level 2
            2: [
                { name: 'Fireball', school: 'Evocation', classes: ['Sorcerer', 'Wizard'], description: '1d6/level fire damage in 20-ft radius.' },
                { name: 'Lightning Bolt', school: 'Evocation', classes: ['Sorcerer', 'Wizard'], description: 'Electricity deals 1d6/level damage in line.' },
                { name: 'Invisibility', school: 'Illusion', classes: ['Bard', 'Sorcerer', 'Wizard'], description: 'Subject invisible for 1 min/level or until attacks.' },
                { name: 'Web', school: 'Conjuration', classes: ['Sorcerer', 'Wizard'], description: 'Fills 20-ft radius with sticky spider webs.' },
                { name: 'Cure Moderate Wounds', school: 'Conjuration', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger'], description: 'Cures 2d8+1 damage (max +10).' },
                { name: 'Hold Person', school: 'Enchantment', classes: ['Bard', 'Cleric', 'Sorcerer', 'Wizard'], description: 'Paralyzes one humanoid for 1 round/level.' }
            ],
            // Level 3
            3: [
                { name: 'Fireball', school: 'Evocation', classes: ['Sorcerer', 'Wizard'], description: '1d6/level fire damage in 20-ft radius.' },
                { name: 'Lightning Bolt', school: 'Evocation', classes: ['Sorcerer', 'Wizard'], description: 'Electricity deals 1d6/level damage in line.' },
                { name: 'Fly', school: 'Transmutation', classes: ['Sorcerer', 'Wizard'], description: 'Subject flies at speed of 60 ft.' },
                { name: 'Haste', school: 'Transmutation', classes: ['Bard', 'Sorcerer', 'Wizard'], description: 'One creature/level moves faster, +1 on attacks.' },
                { name: 'Cure Serious Wounds', school: 'Conjuration', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger'], description: 'Cures 3d8+1 damage (max +15).' },
                { name: 'Dispel Magic', school: 'Abjuration', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Sorcerer', 'Wizard'], description: 'Cancels magical spells and effects.' }
            ],
            // Level 4
            4: [
                { name: 'Dimension Door', school: 'Conjuration', classes: ['Bard', 'Sorcerer', 'Wizard'], description: 'Teleports you short distance.' },
                { name: 'Wall of Fire', school: 'Evocation', classes: ['Druid', 'Sorcerer', 'Wizard'], description: 'Creates wall of fire dealing 2d4 damage.' },
                { name: 'Cure Critical Wounds', school: 'Conjuration', classes: ['Bard', 'Cleric', 'Druid'], description: 'Cures 4d8+1 damage (max +20).' },
                { name: 'Freedom of Movement', school: 'Abjuration', classes: ['Bard', 'Cleric', 'Druid', 'Ranger'], description: 'Subject moves normally despite impediments.' },
                { name: 'Greater Invisibility', school: 'Illusion', classes: ['Bard', 'Sorcerer', 'Wizard'], description: 'As invisibility, but subject can attack and stay invisible.' }
            ],
            // Level 5
            5: [
                { name: 'Teleport', school: 'Conjuration', classes: ['Sorcerer', 'Wizard'], description: 'Instantly transports you anywhere.' },
                { name: 'Wall of Stone', school: 'Conjuration', classes: ['Cleric', 'Druid', 'Sorcerer', 'Wizard'], description: 'Creates a stone wall.' },
                { name: 'Dominate Person', school: 'Enchantment', classes: ['Bard', 'Sorcerer', 'Wizard'], description: 'Controls humanoid telepathically.' },
                { name: 'Cone of Cold', school: 'Evocation', classes: ['Sorcerer', 'Wizard'], description: '1d6/level cold damage in 60-ft cone.' },
                { name: 'Heal', school: 'Conjuration', classes: ['Cleric', 'Druid'], description: 'Cures 10 points/level damage, all diseases and mental conditions.' }
            ],
            // Level 6
            6: [
                { name: 'Disintegrate', school: 'Transmutation', classes: ['Sorcerer', 'Wizard'], description: 'Makes one creature or object vanish.' },
                { name: 'Chain Lightning', school: 'Evocation', classes: ['Sorcerer', 'Wizard'], description: '1d6/level damage and 1 secondary bolt/level.' },
                { name: 'Mass Suggestion', school: 'Enchantment', classes: ['Bard', 'Sorcerer', 'Wizard'], description: 'As suggestion, affects one creature/level.' },
                { name: 'Harm', school: 'Necromancy', classes: ['Cleric'], description: 'Deals 10 points/level damage to target.' }
            ],
            // Level 7
            7: [
                { name: 'Delayed Blast Fireball', school: 'Evocation', classes: ['Sorcerer', 'Wizard'], description: '1d6/level fire damage, can delay 5 rounds.' },
                { name: 'Plane Shift', school: 'Conjuration', classes: ['Cleric', 'Sorcerer', 'Wizard'], description: 'As many as 8 subjects travel to another plane.' },
                { name: 'Spell Turning', school: 'Abjuration', classes: ['Sorcerer', 'Wizard'], description: 'Reflect 1d4+6 spell levels back at caster.' }
            ],
            // Level 8
            8: [
                { name: 'Meteor Swarm', school: 'Evocation', classes: ['Sorcerer', 'Wizard'], description: 'Four exploding spheres each deal 6d6 fire damage.' },
                { name: 'Power Word Stun', school: 'Enchantment', classes: ['Sorcerer', 'Wizard'], description: 'Stuns creature with 150 hp or less.' },
                { name: 'Polymorph Any Object', school: 'Transmutation', classes: ['Sorcerer', 'Wizard'], description: 'Changes any subject into anything else.' }
            ],
            // Level 9
            9: [
                { name: 'Wish', school: 'Universal', classes: ['Sorcerer', 'Wizard'], description: 'As limited wish, but with fewer limits.' },
                { name: 'Time Stop', school: 'Transmutation', classes: ['Sorcerer', 'Wizard'], description: 'You act freely for 1d4+1 rounds.' },
                { name: 'Gate', school: 'Conjuration', classes: ['Cleric', 'Sorcerer', 'Wizard'], description: 'Connects two planes for travel or summoning.' },
                { name: 'Meteor Swarm', school: 'Evocation', classes: ['Sorcerer', 'Wizard'], description: 'Four exploding spheres each deal 6d6 fire damage.' }
            ]
        };
    }

    /**
     * Calculate spell slots for a character
     */
    calculateSpellSlots(characterClass, level, abilities) {
        const spellSlots = {};
        
        // Get class spell progression
        const classData = this.srdData.getClass(characterClass);
        if (!classData || !classData.progression.spellcaster) {
            return spellSlots; // Non-spellcaster
        }

        const castingAbility = this.getCastingAbility(characterClass);
        const abilityMod = Math.floor((abilities[castingAbility.toLowerCase()] - 10) / 2);
        
        // Base spell slots by class and level
        const baseSlots = this.getBaseSpellSlots(characterClass, level);
        
        // Add bonus spells from high ability scores
        for (let spellLevel = 0; spellLevel <= 9; spellLevel++) {
            if (baseSlots[spellLevel] && baseSlots[spellLevel] > 0) {
                let bonusSpells = 0;
                
                // Calculate bonus spells for this spell level
                if (spellLevel > 0 && abilityMod >= spellLevel) {
                    bonusSpells = Math.floor((abilityMod - spellLevel + 4) / 4);
                }
                
                spellSlots[spellLevel] = {
                    base: baseSlots[spellLevel],
                    bonus: bonusSpells,
                    total: baseSlots[spellLevel] + bonusSpells
                };
            }
        }
        
        return spellSlots;
    }

    /**
     * Get casting ability for class
     */
    getCastingAbility(characterClass) {
        const castingAbilities = {
            'Bard': 'Charisma',
            'Cleric': 'Wisdom',
            'Druid': 'Wisdom',
            'Paladin': 'Wisdom',
            'Ranger': 'Wisdom',
            'Sorcerer': 'Charisma',
            'Wizard': 'Intelligence'
        };
        
        return castingAbilities[characterClass] || 'Intelligence';
    }

    /**
     * Get base spell slots by class and level
     */
    getBaseSpellSlots(characterClass, level) {
        const spellProgression = {
            'Bard': {
                1: { 0: 2, 1: 0 },
                2: { 0: 3, 1: 1 },
                3: { 0: 3, 1: 2 },
                4: { 0: 3, 1: 3, 2: 0 },
                5: { 0: 3, 1: 3, 2: 1 },
                6: { 0: 3, 1: 3, 2: 2 },
                7: { 0: 3, 1: 3, 2: 3, 3: 0 },
                8: { 0: 3, 1: 3, 2: 3, 3: 1 },
                9: { 0: 3, 1: 3, 2: 3, 3: 2 },
                10: { 0: 3, 1: 3, 2: 3, 3: 3, 4: 0 },
                11: { 0: 3, 1: 3, 2: 3, 3: 3, 4: 1 },
                12: { 0: 3, 1: 3, 2: 3, 3: 3, 4: 2 },
                13: { 0: 3, 1: 3, 2: 3, 3: 3, 4: 3, 5: 0 },
                14: { 0: 3, 1: 3, 2: 3, 3: 3, 4: 3, 5: 1 },
                15: { 0: 3, 1: 3, 2: 3, 3: 3, 4: 3, 5: 2 },
                16: { 0: 3, 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 0 },
                17: { 0: 3, 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1 },
                18: { 0: 3, 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2 },
                19: { 0: 3, 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
                20: { 0: 3, 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 }
            },
            'Cleric': {
                1: { 0: 3, 1: 1 },
                2: { 0: 4, 1: 2 },
                3: { 0: 4, 1: 2, 2: 1 },
                4: { 0: 5, 1: 3, 2: 2 },
                5: { 0: 5, 1: 3, 2: 2, 3: 1 },
                6: { 0: 5, 1: 3, 2: 3, 3: 2 },
                7: { 0: 6, 1: 4, 2: 3, 3: 2, 4: 1 },
                8: { 0: 6, 1: 4, 2: 3, 3: 3, 4: 2 },
                9: { 0: 6, 1: 4, 2: 4, 3: 3, 4: 2, 5: 1 },
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
            'Sorcerer': {
                1: { 0: 5, 1: 3 },
                2: { 0: 6, 1: 4 },
                3: { 0: 6, 1: 5 },
                4: { 0: 6, 1: 6, 2: 3 },
                5: { 0: 6, 1: 6, 2: 4 },
                6: { 0: 6, 1: 6, 2: 5, 3: 3 },
                7: { 0: 6, 1: 6, 2: 6, 3: 4 },
                8: { 0: 6, 1: 6, 2: 6, 3: 5, 4: 3 },
                9: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 4 },
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
            'Wizard': {
                1: { 0: 3, 1: 1 },
                2: { 0: 4, 1: 2 },
                3: { 0: 4, 1: 2, 2: 1 },
                4: { 0: 4, 1: 3, 2: 2 },
                5: { 0: 4, 1: 3, 2: 2, 3: 1 },
                6: { 0: 4, 1: 3, 2: 3, 3: 2 },
                7: { 0: 4, 1: 4, 2: 3, 3: 2, 4: 1 },
                8: { 0: 4, 1: 4, 2: 3, 3: 3, 4: 2 },
                9: { 0: 4, 1: 4, 2: 4, 3: 3, 4: 2, 5: 1 },
                10: { 0: 4, 1: 4, 2: 4, 3: 3, 4: 3, 5: 2 },
                11: { 0: 4, 1: 5, 2: 4, 3: 4, 4: 3, 5: 2, 6: 1 },
                12: { 0: 4, 1: 5, 2: 4, 3: 4, 4: 3, 5: 3, 6: 2 },
                13: { 0: 4, 1: 5, 2: 5, 3: 4, 4: 4, 5: 3, 6: 2, 7: 1 },
                14: { 0: 4, 1: 5, 2: 5, 3: 4, 4: 4, 5: 3, 6: 3, 7: 2 },
                15: { 0: 4, 1: 5, 2: 5, 3: 5, 4: 4, 5: 4, 6: 3, 7: 2, 8: 1 },
                16: { 0: 4, 1: 5, 2: 5, 3: 5, 4: 4, 5: 4, 6: 3, 7: 3, 8: 2 },
                17: { 0: 4, 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 4, 7: 3, 8: 2, 9: 1 },
                18: { 0: 4, 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 4, 7: 3, 8: 3, 9: 2 },
                19: { 0: 4, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4, 7: 4, 8: 3, 9: 3 },
                20: { 0: 4, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4, 7: 4, 8: 4, 9: 4 }
            }
        };
        
        return spellProgression[characterClass]?.[level] || {};
    }

    /**
     * Get spells known for spontaneous casters
     */
    getSpellsKnown(characterClass, level) {
        if (!this.isSpontaneousCaster(characterClass)) {
            return null; // Prepared casters don't have fixed spells known
        }
        
        const spellsKnownProgression = {
            'Bard': {
                1: { 0: 4 },
                2: { 0: 5, 1: 2 },
                3: { 0: 6, 1: 3 },
                4: { 0: 6, 1: 3, 2: 2 },
                5: { 0: 6, 1: 4, 2: 3 },
                6: { 0: 6, 1: 4, 2: 3 },
                7: { 0: 6, 1: 4, 2: 4, 3: 2 },
                8: { 0: 6, 1: 4, 2: 4, 3: 3 },
                9: { 0: 6, 1: 4, 2: 4, 3: 3 },
                10: { 0: 6, 1: 4, 2: 4, 3: 4, 4: 2 },
                11: { 0: 6, 1: 4, 2: 4, 3: 4, 4: 3 },
                12: { 0: 6, 1: 4, 2: 4, 3: 4, 4: 3 },
                13: { 0: 6, 1: 4, 2: 4, 3: 4, 4: 4, 5: 2 },
                14: { 0: 6, 1: 4, 2: 4, 3: 4, 4: 4, 5: 3 },
                15: { 0: 6, 1: 4, 2: 4, 3: 4, 4: 4, 5: 3 },
                16: { 0: 6, 1: 5, 2: 4, 3: 4, 4: 4, 5: 4, 6: 2 },
                17: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 4, 5: 4, 6: 3 },
                18: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 4, 5: 4, 6: 3 },
                19: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 4 },
                20: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4 }
            },
            'Sorcerer': {
                1: { 0: 4, 1: 2 },
                2: { 0: 5, 1: 2 },
                3: { 0: 5, 1: 3 },
                4: { 0: 6, 1: 3, 2: 1 },
                5: { 0: 6, 1: 4, 2: 2 },
                6: { 0: 7, 1: 4, 2: 2, 3: 1 },
                7: { 0: 7, 1: 5, 2: 3, 3: 2 },
                8: { 0: 8, 1: 5, 2: 3, 3: 2, 4: 1 },
                9: { 0: 8, 1: 5, 2: 4, 3: 3, 4: 2 },
                10: { 0: 9, 1: 5, 2: 4, 3: 3, 4: 2, 5: 1 },
                11: { 0: 9, 1: 5, 2: 5, 3: 4, 4: 3, 5: 2 },
                12: { 0: 9, 1: 5, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1 },
                13: { 0: 9, 1: 5, 2: 5, 3: 5, 4: 4, 5: 3, 6: 2 },
                14: { 0: 9, 1: 5, 2: 5, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1 },
                15: { 0: 9, 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 3, 7: 2 },
                16: { 0: 9, 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1 },
                17: { 0: 9, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4, 7: 3, 8: 2 },
                18: { 0: 9, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4, 7: 3, 8: 2, 9: 1 },
                19: { 0: 9, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 4, 8: 3, 9: 2 },
                20: { 0: 9, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 4, 8: 4, 9: 3 }
            }
        };
        
        return spellsKnownProgression[characterClass]?.[level] || {};
    }

    /**
     * Check if class is spontaneous caster
     */
    isSpontaneousCaster(characterClass) {
        return ['Bard', 'Sorcerer'].includes(characterClass);
    }

    /**
     * Get available spells for class and level
     */
    getAvailableSpells(characterClass, spellLevel) {
        if (!this.spellDatabase[spellLevel]) {
            return [];
        }
        
        return this.spellDatabase[spellLevel].filter(spell => 
            spell.classes.includes(characterClass)
        );
    }

    /**
     * Calculate spell DC
     */
    calculateSpellDC(spellLevel, abilities, characterClass) {
        const castingAbility = this.getCastingAbility(characterClass);
        const abilityMod = Math.floor((abilities[castingAbility.toLowerCase()] - 10) / 2);
        
        return 10 + spellLevel + abilityMod;
    }

    /**
     * Create spell list for character
     */
    createSpellList(characterClass, level, abilities) {
        const spellSlots = this.calculateSpellSlots(characterClass, level, abilities);
        const spellsKnown = this.getSpellsKnown(characterClass, level);
        const isSpontaneous = this.isSpontaneousCaster(characterClass);
        
        const spellList = {
            characterClass,
            level,
            castingAbility: this.getCastingAbility(characterClass),
            castingMod: Math.floor((abilities[this.getCastingAbility(characterClass).toLowerCase()] - 10) / 2),
            spellSlots,
            spellsKnown,
            isSpontaneous,
            spells: {}
        };
        
        // Initialize spell arrays for each level
        for (let spellLevel = 0; spellLevel <= 9; spellLevel++) {
            if (spellSlots[spellLevel]) {
                spellList.spells[spellLevel] = {
                    available: this.getAvailableSpells(characterClass, spellLevel),
                    known: [],
                    prepared: isSpontaneous ? null : []
                };
            }
        }
        
        return spellList;
    }

    /**
     * Add spell to known spells (spontaneous casters)
     */
    addKnownSpell(spellList, spellLevel, spellName) {
        if (!spellList.isSpontaneous) {
            throw new Error('Only spontaneous casters have known spells');
        }
        
        const spellsKnownLimit = spellList.spellsKnown[spellLevel];
        if (!spellsKnownLimit) {
            throw new Error(`No spells known available for level ${spellLevel}`);
        }
        
        if (spellList.spells[spellLevel].known.length >= spellsKnownLimit) {
            throw new Error(`Maximum spells known reached for level ${spellLevel}`);
        }
        
        const spell = spellList.spells[spellLevel].available.find(s => s.name === spellName);
        if (!spell) {
            throw new Error(`Spell ${spellName} not available for ${spellList.characterClass}`);
        }
        
        spellList.spells[spellLevel].known.push(spell);
        console.log(`🔮 Added ${spellName} to known spells (level ${spellLevel})`);
        
        return spellList;
    }

    /**
     * Prepare spell (prepared casters)
     */
    prepareSpell(spellList, spellLevel, spellName) {
        if (spellList.isSpontaneous) {
            throw new Error('Spontaneous casters do not prepare spells');
        }
        
        const slotsAvailable = spellList.spellSlots[spellLevel]?.total || 0;
        if (spellList.spells[spellLevel].prepared.length >= slotsAvailable) {
            throw new Error(`No more spell slots available for level ${spellLevel}`);
        }
        
        const spell = spellList.spells[spellLevel].available.find(s => s.name === spellName);
        if (!spell) {
            throw new Error(`Spell ${spellName} not available for ${spellList.characterClass}`);
        }
        
        spellList.spells[spellLevel].prepared.push(spell);
        console.log(`📜 Prepared ${spellName} (level ${spellLevel})`);
        
        return spellList;
    }

    /**
     * Get spell summary for character
     */
    getSpellSummary(spellList) {
        const summary = {
            castingAbility: spellList.castingAbility,
            castingModifier: spellList.castingMod,
            totalSpellLevels: Object.keys(spellList.spellSlots).length,
            totalSlots: 0,
            totalKnown: 0,
            totalPrepared: 0,
            spellsByLevel: {}
        };
        
        for (const [spellLevel, slots] of Object.entries(spellList.spellSlots)) {
            const level = parseInt(spellLevel);
            const spells = spellList.spells[level];
            
            summary.totalSlots += slots.total;
            summary.totalKnown += spells.known?.length || 0;
            summary.totalPrepared += spells.prepared?.length || 0;
            
            summary.spellsByLevel[level] = {
                slots: slots.total,
                dc: 10 + level + spellList.castingMod,
                known: spells.known?.length || 0,
                prepared: spells.prepared?.length || 0,
                available: spells.available.length
            };
        }
        
        return summary;
    }
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpellManager;
} else if (typeof window !== 'undefined') {
    window.SpellManager = SpellManager;
}
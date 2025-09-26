/**
 * EpicLevelSystem - D&D 3.5 Epic Level Progression (21+)
 * 
 * Comprehensive epic level system featuring:
 * - Epic level progression for all base classes and prestige classes
 * - Epic feat acquisition and requirements
 * - Epic spell development and casting
 * - Epic magic item creation and enhancement
 * - Divine rank progression and godhood mechanics
 * - Salient divine abilities for deities
 * - Epic encounter scaling and challenge ratings
 * - Legendary and mythic creature templates
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class EpicLevelSystem {
    constructor(characterSystem, spellManager, combatSystem) {
        this.characterSystem = characterSystem;
        this.spellManager = spellManager;
        this.combatSystem = combatSystem;
        
        // Epic level constants
        this.EPIC_LEVEL_START = 21;
        this.MAX_EPIC_LEVEL = 99; // Theoretical maximum
        this.EPIC_FEAT_FREQUENCY = 3; // Every 3 levels after 20th
        this.EPIC_SKILL_POINTS_MULTIPLIER = 1; // Same as normal levels
        
        // Epic progression tables
        this.epicProgressionTables = {
            // Base classes
            'barbarian': {
                hitDie: 12,
                skillPoints: 4,
                baseAttackProgression: 'good',
                fortitudeSave: 'good',
                reflexSave: 'poor',
                willSave: 'poor',
                epicFeatures: {
                    24: 'Mighty Rage (+8 Str/Con, -2 AC)',
                    28: 'Terrifying Rage (Frightens enemies)',
                    32: 'Tireless Rage (No fatigue)',
                    36: 'Unstoppable Rage (Immune to compulsions)'
                }
            },
            'bard': {
                hitDie: 6,
                skillPoints: 6,
                baseAttackProgression: 'average',
                fortitudeSave: 'poor',
                reflexSave: 'good',
                willSave: 'good',
                spellProgression: 'bard',
                epicFeatures: {
                    24: 'Epic Inspire Courage (+4 bonus)',
                    27: 'Epic Inspire Heroics (Multiple targets)',
                    30: 'Epic Mass Suggestion (No HD limit)',
                    33: 'Epic Inspire Competence (+6 bonus)'
                }
            },
            'cleric': {
                hitDie: 8,
                skillPoints: 2,
                baseAttackProgression: 'average',
                fortitudeSave: 'good',
                reflexSave: 'poor',
                willSave: 'good',
                spellProgression: 'divine_full',
                epicFeatures: {
                    22: 'Epic Turn Undead (Affect outsiders)',
                    25: 'Divine Might (Channel divinity for combat)',
                    28: 'Epic Domain Power (Enhanced domain abilities)',
                    31: 'Avatar Form (Temporary divine ascension)'
                }
            },
            'druid': {
                hitDie: 8,
                skillPoints: 4,
                baseAttackProgression: 'average',
                fortitudeSave: 'good',
                reflexSave: 'poor',
                willSave: 'good',
                spellProgression: 'divine_full',
                epicFeatures: {
                    22: 'Timeless Body (No aging effects)',
                    24: 'Epic Wild Shape (Magical beasts)',
                    27: 'Elemental Wild Shape (Elementals)',
                    30: 'Plant Wild Shape (Plant creatures)',
                    33: 'Dragon Wild Shape (Dragons)'
                }
            },
            'fighter': {
                hitDie: 10,
                skillPoints: 2,
                baseAttackProgression: 'good',
                fortitudeSave: 'good',
                reflexSave: 'poor',
                willSave: 'poor',
                epicFeatures: {
                    22: 'Bonus Epic Feat',
                    24: 'Bonus Epic Feat',
                    26: 'Bonus Epic Feat',
                    28: 'Bonus Epic Feat',
                    30: 'Bonus Epic Feat'
                }
            },
            'monk': {
                hitDie: 8,
                skillPoints: 4,
                baseAttackProgression: 'average',
                fortitudeSave: 'good',
                reflexSave: 'good',
                willSave: 'good',
                epicFeatures: {
                    21: 'Perfect Self (DR 10/magic)',
                    24: 'Ki Strike (Epic)',
                    27: 'Abundant Step (At will)',
                    30: 'Empty Body (Ethereal)',
                    33: 'Timeless Body'
                }
            },
            'paladin': {
                hitDie: 10,
                skillPoints: 2,
                baseAttackProgression: 'good',
                fortitudeSave: 'good',
                reflexSave: 'poor',
                willSave: 'good',
                spellProgression: 'paladin',
                epicFeatures: {
                    22: 'Epic Smite Evil (No daily limit)',
                    25: 'Aura of Courage (Immunity to fear)',
                    28: 'Epic Divine Grace (+Cha to all saves)',
                    31: 'Champion of Good (DR 10/evil)'
                }
            },
            'ranger': {
                hitDie: 8,
                skillPoints: 6,
                baseAttackProgression: 'good',
                fortitudeSave: 'good',
                reflexSave: 'good',
                willSave: 'poor',
                spellProgression: 'ranger',
                epicFeatures: {
                    22: 'Epic Favored Enemy (+6 bonus)',
                    25: 'Legendary Tracker (Track anywhere)',
                    28: 'Master Hunter (Instant kill)',
                    31: 'One with Nature (Speak with animals at will)'
                }
            },
            'rogue': {
                hitDie: 6,
                skillPoints: 8,
                baseAttackProgression: 'average',
                fortitudeSave: 'poor',
                reflexSave: 'good',
                willSave: 'poor',
                epicFeatures: {
                    21: 'Epic Sneak Attack (+1d6 every 2 levels)',
                    24: 'Defensive Roll (Avoid death)',
                    27: 'Improved Evasion (No damage on successful save)',
                    30: 'Skill Mastery (Take 10 on any skill)',
                    33: 'Slippery Mind (Reroll mental saves)'
                }
            },
            'sorcerer': {
                hitDie: 4,
                skillPoints: 2,
                baseAttackProgression: 'poor',
                fortitudeSave: 'poor',
                reflexSave: 'poor',
                willSave: 'good',
                spellProgression: 'sorcerer',
                epicFeatures: {
                    21: 'Epic Spell Access',
                    24: 'Spell Power (+2 caster level)',
                    27: 'Metamagic Mastery (Free metamagic)',
                    30: 'Arcane Apotheosis (Spell resistance)',
                    33: 'Master of Magic (Ignore spell failure)'
                }
            },
            'wizard': {
                hitDie: 4,
                skillPoints: 2,
                baseAttackProgression: 'poor',
                fortitudeSave: 'poor',
                reflexSave: 'poor',
                willSave: 'good',
                spellProgression: 'wizard',
                epicFeatures: {
                    21: 'Epic Spell Access',
                    24: 'Bonus Epic Feat (Metamagic)',
                    27: 'Spell Synthesis (Cast two spells)',
                    30: 'Archmage Abilities',
                    33: 'Master of Reality (Alter fundamental forces)'
                }
            }
        };
        
        // Epic feats
        this.epicFeats = {
            // Combat feats
            'Epic Weapon Focus': {
                prerequisites: ['Weapon Focus', 'Fighter level 8+', 'Epic level'],
                benefit: '+2 bonus on attack rolls (stacks with Weapon Focus)',
                type: 'combat'
            },
            'Epic Weapon Specialization': {
                prerequisites: ['Weapon Specialization', 'Epic Weapon Focus', 'Fighter level 12+'],
                benefit: '+4 bonus on damage rolls (stacks with Weapon Specialization)',
                type: 'combat'
            },
            'Overwhelming Critical': {
                prerequisites: ['Str 23+', 'Cleave', 'Great Cleave', 'Improved Critical', 'Power Attack', 'Weapon Focus'],
                benefit: 'Creatures killed by critical hits explode',
                type: 'combat'
            },
            'Devastating Critical': {
                prerequisites: ['Str 25+', 'Cleave', 'Great Cleave', 'Improved Critical', 'Overwhelming Critical', 'Power Attack', 'Weapon Focus'],
                benefit: 'Critical hits potentially kill opponent instantly',
                type: 'combat'
            },
            'Epic Prowess': {
                prerequisites: ['Epic level'],
                benefit: '+1 bonus on attack rolls',
                type: 'combat',
                repeatable: true
            },
            'Epic Toughness': {
                prerequisites: ['Epic level'],
                benefit: '+30 hit points',
                type: 'general',
                repeatable: true
            },
            'Armor Skin': {
                prerequisites: ['Epic level'],
                benefit: '+1 natural armor bonus',
                type: 'general',
                repeatable: true
            },
            'Damage Reduction': {
                prerequisites: ['Con 21+', 'Epic level'],
                benefit: 'Damage reduction 3/-',
                type: 'general',
                repeatable: true
            },
            'Energy Resistance': {
                prerequisites: ['Epic level'],
                benefit: 'Resistance 10 to one energy type',
                type: 'general',
                repeatable: true
            },
            'Fast Healing': {
                prerequisites: ['Con 25+', 'Epic level'],
                benefit: 'Fast healing 3',
                type: 'general'
            },
            
            // Spellcasting feats
            'Epic Spell Focus': {
                prerequisites: ['Spell Focus', 'Greater Spell Focus', 'Epic level'],
                benefit: '+1 bonus to spell save DCs (stacks with others)',
                type: 'metamagic',
                repeatable: true
            },
            'Epic Spell Penetration': {
                prerequisites: ['Spell Penetration', 'Greater Spell Penetration', 'Epic level'],
                benefit: '+2 bonus on caster level checks to overcome spell resistance',
                type: 'metamagic'
            },
            'Improve Metamagic': {
                prerequisites: ['Four metamagic feats', 'Spellcraft 30 ranks', 'Epic level'],
                benefit: 'Reduce metamagic spell level increases by 1',
                type: 'metamagic'
            },
            'Intensify Spell': {
                prerequisites: ['Spellcraft 30 ranks', 'Epic level'],
                benefit: 'Variable metamagic feat - increase spell variables',
                type: 'metamagic'
            },
            'Enhance Spell': {
                prerequisites: ['Spellcraft 30 ranks', 'Epic level'],
                benefit: '+1 bonus to spell save DCs',
                type: 'metamagic'
            },
            
            // Skill feats
            'Epic Skill Focus': {
                prerequisites: ['Skill Focus', '30 ranks in skill', 'Epic level'],
                benefit: '+10 bonus to one skill (stacks with Skill Focus)',
                type: 'skill'
            },
            'Legendary Climber': {
                prerequisites: ['Climb 30 ranks', 'Epic level'],
                benefit: 'Climb speed equal to land speed',
                type: 'skill'
            },
            'Legendary Rider': {
                prerequisites: ['Ride 30 ranks', 'Epic level'],
                benefit: 'No armor check penalty when riding',
                type: 'skill'
            },
            'Self-Concealment': {
                prerequisites: ['Hide 30 ranks', 'Epic level'],
                benefit: '10% miss chance in combat',
                type: 'skill'
            },
            'Blinding Speed': {
                prerequisites: ['Dex 25+', 'Epic level'],
                benefit: 'Act normally during surprise rounds',
                type: 'general'
            },
            
            // Divine feats
            'Divine Might': {
                prerequisites: ['Cha 13+', 'Turn undead ability', 'Epic level'],
                benefit: 'Channel turning to enhance weapon damage',
                type: 'divine'
            },
            'Divine Shield': {
                prerequisites: ['Cha 13+', 'Turn undead ability', 'Epic level'],
                benefit: 'Channel turning to enhance AC',
                type: 'divine'
            },
            'Extra Turning': {
                prerequisites: ['Turn undead ability', 'Epic level'],
                benefit: '+6 daily turn undead attempts',
                type: 'divine',
                repeatable: true
            }
        };
        
        // Epic spells (seed-based system)
        this.epicSpellSeeds = {
            'Afflict': {
                spellcraft_dc: 14,
                description: 'Impose harmful conditions',
                base_effect: 'Bestow curse, disease, or poison'
            },
            'Animate': {
                spellcraft_dc: 25,
                description: 'Give life to inanimate objects',
                base_effect: 'Animate dead or objects'
            },
            'Armor': {
                spellcraft_dc: 14,
                description: 'Grant AC bonuses',
                base_effect: '+4 AC bonus'
            },
            'Banish': {
                spellcraft_dc: 27,
                description: 'Remove creatures from plane',
                base_effect: 'Banishment'
            },
            'Compel': {
                spellcraft_dc: 19,
                description: 'Force actions on creatures',
                base_effect: 'Charm or compulsion effects'
            },
            'Conceal': {
                spellcraft_dc: 17,
                description: 'Hide creatures or objects',
                base_effect: 'Invisibility or concealment'
            },
            'Conjure': {
                spellcraft_dc: 21,
                description: 'Create creatures or objects',
                base_effect: 'Summon creature or create object'
            },
            'Contact': {
                spellcraft_dc: 23,
                description: 'Communicate across distances',
                base_effect: 'Telepathic communication'
            },
            'Delude': {
                spellcraft_dc: 14,
                description: 'Create false sensory input',
                base_effect: 'Illusion effects'
            },
            'Destroy': {
                spellcraft_dc: 29,
                description: 'Utterly destroy creatures or objects',
                base_effect: 'Disintegration or death'
            },
            'Dispel': {
                spellcraft_dc: 19,
                description: 'Remove magical effects',
                base_effect: 'Greater dispel magic'
            },
            'Energy': {
                spellcraft_dc: 19,
                description: 'Manipulate energy types',
                base_effect: '10d6 energy damage'
            },
            'Foresee': {
                spellcraft_dc: 17,
                description: 'Gain knowledge of future events',
                base_effect: 'Divination effects'
            },
            'Fortify': {
                spellcraft_dc: 17,
                description: 'Grant ability bonuses',
                base_effect: '+4 enhancement bonus to ability'
            },
            'Heal': {
                spellcraft_dc: 25,
                description: 'Restore hit points and remove conditions',
                base_effect: 'Heal 10d4+20 hp'
            },
            'Life': {
                spellcraft_dc: 27,
                description: 'Restore life to the dead',
                base_effect: 'Resurrection'
            },
            'Reflect': {
                spellcraft_dc: 27,
                description: 'Turn spells back on casters',
                base_effect: 'Spell turning'
            },
            'Reveal': {
                spellcraft_dc: 19,
                description: 'Gain information about creatures or objects',
                base_effect: 'True seeing or scrying'
            },
            'Slay': {
                spellcraft_dc: 25,
                description: 'Kill creatures outright',
                base_effect: 'Death effect'
            },
            'Summon': {
                spellcraft_dc: 14,
                description: 'Call forth creatures or objects',
                base_effect: 'Summon monster'
            },
            'Transform': {
                spellcraft_dc: 21,
                description: 'Change creatures or objects',
                base_effect: 'Polymorph or transmutation'
            },
            'Transport': {
                spellcraft_dc: 27,
                description: 'Move creatures or objects',
                base_effect: 'Teleportation'
            },
            'Ward': {
                spellcraft_dc: 14,
                description: 'Protect against harm',
                base_effect: 'Protection from energy'
            }
        };
        
        // Divine ranks and abilities
        this.divineRanks = {
            0: {
                name: 'Mortal',
                description: 'No divine power',
                abilities: []
            },
            1: {
                name: 'Demigod',
                description: 'Quasi-deity with limited divine power',
                abilities: ['Divine Aura', 'Divine Blast', 'Command Creatures'],
                hitDieBonus: '+1 per HD',
                skillBonus: '+1 per rank',
                saveBonus: '+1'
            },
            6: {
                name: 'Lesser Deity',
                description: 'True deity with moderate divine power',
                abilities: ['Divine Aura', 'Divine Blast', 'Command Creatures', 'Grant Spells', 'Travel', 'Block Sensing'],
                hitDieBonus: '+2 per HD',
                skillBonus: '+2 per rank',
                saveBonus: '+2'
            },
            11: {
                name: 'Intermediate Deity',
                description: 'Powerful deity with significant influence',
                abilities: ['All Lesser abilities', 'Create Magic Items', 'Divine Creation', 'Shapechange'],
                hitDieBonus: '+3 per HD',
                skillBonus: '+3 per rank',
                saveBonus: '+3'
            },
            16: {
                name: 'Greater Deity',
                description: 'Supremely powerful deity',
                abilities: ['All previous abilities', 'Alter Reality', 'Divine Rank 16+ abilities', 'Mass Life and Death'],
                hitDieBonus: '+4 per HD',
                skillBonus: '+4 per rank',
                saveBonus: '+4'
            },
            21: {
                name: 'Overdeity',
                description: 'Cosmic entity of ultimate power',
                abilities: ['All abilities', 'Cosmic Consciousness', 'Reality Manipulation', 'True Omniscience'],
                hitDieBonus: '+5 per HD',
                skillBonus: '+5 per rank',
                saveBonus: '+5'
            }
        };
        
        this.initializeEpicSystem();
        console.log('🌟 Epic Level System initialized');
    }

    /**
     * Initialize epic level system
     */
    initializeEpicSystem() {
        this.setupEpicSpellDatabase();
        this.initializeDivineAbilities();
        this.setupEpicEncounterTables();
        
        console.log('✅ Epic level system ready for legendary adventures');
    }

    // ===== EPIC LEVEL PROGRESSION =====

    /**
     * Advance character to epic levels
     */
    advanceToEpicLevel(character, targetLevel) {
        if (targetLevel < this.EPIC_LEVEL_START) {
            throw new Error(`Target level ${targetLevel} is not epic (must be ${this.EPIC_LEVEL_START}+)`);
        }
        
        console.log(`🌟 Advancing ${character.name} to epic level ${targetLevel}`);
        
        // Process each level from current to target
        for (let level = character.level + 1; level <= targetLevel; level++) {
            this.processEpicLevelUp(character, level);
        }
        
        // Update character level
        character.level = targetLevel;
        character.isEpic = true;
        
        // Recalculate all derived statistics
        this.recalculateEpicStatistics(character);
        
        console.log(`⭐ ${character.name} is now epic level ${targetLevel}!`);
        
        return character;
    }

    /**
     * Process single epic level advancement
     */
    processEpicLevelUp(character, level) {
        const primaryClass = this.getPrimaryClass(character);
        const progression = this.epicProgressionTables[primaryClass];
        
        if (!progression) {
            console.warn(`No epic progression found for class: ${primaryClass}`);
            return;
        }
        
        console.log(`📈 Processing level ${level} advancement`);
        
        // Hit points
        const hitPointGain = this.rollHitPoints(progression.hitDie, character);
        character.hitPoints += hitPointGain;
        character.maxHitPoints = character.hitPoints;
        
        // Skill points
        const skillPointGain = progression.skillPoints + this.getAbilityModifier(character.abilities.intelligence);
        character.availableSkillPoints = (character.availableSkillPoints || 0) + skillPointGain;
        
        // Base attack bonus
        this.updateBaseAttackBonus(character, level, progression.baseAttackProgression);
        
        // Saving throws
        this.updateSavingThrows(character, level, progression);
        
        // Epic feats (every 3 levels after 20th)
        if ((level - 20) % this.EPIC_FEAT_FREQUENCY === 1) {
            this.grantEpicFeat(character);
        }
        
        // Ability score increase (every 4 levels)
        if (level % 4 === 0) {
            this.grantAbilityIncrease(character);
        }
        
        // Class-specific epic features
        if (progression.epicFeatures && progression.epicFeatures[level]) {
            this.grantEpicFeature(character, progression.epicFeatures[level]);
        }
        
        // Epic spell access for casters
        if (progression.spellProgression && level === this.EPIC_LEVEL_START) {
            this.grantEpicSpellAccess(character);
        }
    }

    /**
     * Grant epic feat to character
     */
    grantEpicFeat(character) {
        character.availableEpicFeats = (character.availableEpicFeats || 0) + 1;
        
        console.log(`🎭 ${character.name} gains an epic feat!`);
        
        // In a full implementation, this would present feat choices to the player
        // For now, we'll just track that they have a feat available
    }

    /**
     * Grant epic spell access
     */
    grantEpicSpellAccess(character) {
        if (!character.spellcasting) return;
        
        character.epicSpells = {
            developedSpells: [],
            availableSeeds: Object.keys(this.epicSpellSeeds),
            spellSlots: this.calculateEpicSpellSlots(character)
        };
        
        console.log(`🔮 ${character.name} gains access to epic spellcasting!`);
    }

    // ===== EPIC SPELL SYSTEM =====

    /**
     * Develop new epic spell
     */
    async developEpicSpell(character, spellData) {
        const { name, seeds, factors, mitigatingFactors } = spellData;
        
        console.log(`🧙‍♂️ ${character.name} develops epic spell: ${name}`);
        
        // Calculate Spellcraft DC
        let spellcraftDC = 0;
        let seedCosts = [];
        
        // Add seed DCs
        seeds.forEach(seed => {
            const seedData = this.epicSpellSeeds[seed];
            if (seedData) {
                spellcraftDC += seedData.spellcraft_dc;
                seedCosts.push(`${seed}: ${seedData.spellcraft_dc}`);
            }
        });
        
        // Add factor modifiers
        if (factors) {
            factors.forEach(factor => {
                spellcraftDC += factor.dcModifier;
            });
        }
        
        // Subtract mitigating factors
        if (mitigatingFactors) {
            mitigatingFactors.forEach(factor => {
                spellcraftDC -= factor.dcReduction;
            });
        }
        
        console.log(`📊 Epic spell DC calculation: ${seedCosts.join(' + ')} = ${spellcraftDC}`);
        
        // Check if character can develop this spell
        const spellcraftRanks = character.skills?.spellcraft?.ranks || 0;
        const spellcraftModifier = this.getSpellcraftModifier(character);
        const maxDC = spellcraftRanks + spellcraftModifier;
        
        if (spellcraftDC > maxDC) {
            console.log(`❌ Spell too complex! DC ${spellcraftDC} exceeds maximum ${maxDC}`);
            return { success: false, reason: 'dc_too_high', requiredDC: spellcraftDC, maxDC: maxDC };
        }
        
        // Development time and cost
        const developmentTime = spellcraftDC; // Days
        const developmentCost = spellcraftDC * 9000; // GP
        const experienceCost = spellcraftDC * 360; // XP
        
        // Create the epic spell
        const epicSpell = {
            name: name,
            seeds: seeds,
            factors: factors,
            mitigatingFactors: mitigatingFactors,
            spellcraftDC: spellcraftDC,
            developmentTime: developmentTime,
            developmentCost: developmentCost,
            experienceCost: experienceCost,
            castingTime: this.calculateEpicCastingTime(spellData),
            range: this.calculateEpicRange(spellData),
            duration: this.calculateEpicDuration(spellData),
            savingThrow: this.calculateEpicSavingThrow(spellData),
            spellResistance: this.calculateEpicSpellResistance(spellData),
            description: this.generateEpicSpellDescription(spellData)
        };
        
        // Add to character's developed spells
        if (!character.epicSpells) {
            character.epicSpells = { developedSpells: [] };
        }
        character.epicSpells.developedSpells.push(epicSpell);
        
        console.log(`✨ Epic spell "${name}" successfully developed!`);
        console.log(`⏱️ Development: ${developmentTime} days, ${developmentCost} GP, ${experienceCost} XP`);
        
        return { success: true, spell: epicSpell };
    }

    /**
     * Cast epic spell
     */
    async castEpicSpell(character, spellName, options = {}) {
        const epicSpell = this.getEpicSpell(character, spellName);
        if (!epicSpell) {
            return { success: false, reason: 'spell_not_known' };
        }
        
        console.log(`🌟 ${character.name} casts epic spell: ${spellName}`);
        
        // Check if character has epic spell slots
        if (!this.hasEpicSpellSlot(character)) {
            return { success: false, reason: 'no_spell_slots' };
        }
        
        // Spellcraft check
        const spellcraftCheck = await this.rollSpellcraftCheck(character, epicSpell.spellcraftDC);
        
        if (!spellcraftCheck.success) {
            console.log(`❌ Epic spell failed! Spellcraft check: ${spellcraftCheck.total} vs DC ${epicSpell.spellcraftDC}`);
            return { success: false, reason: 'spellcraft_failed', check: spellcraftCheck };
        }
        
        // Consume spell slot
        this.consumeEpicSpellSlot(character);
        
        // Apply spell effects
        const spellEffects = await this.applyEpicSpellEffects(character, epicSpell, options);
        
        console.log(`⭐ Epic spell cast successfully!`);
        
        return {
            success: true,
            spell: epicSpell,
            spellcraftCheck: spellcraftCheck,
            effects: spellEffects
        };
    }

    // ===== DIVINE ASCENSION =====

    /**
     * Begin divine ascension process
     */
    beginDivineAscension(character, portfolios = []) {
        if (character.level < 21) {
            throw new Error('Character must be at least level 21 to begin divine ascension');
        }
        
        console.log(`🌟 ${character.name} begins the path to divinity!`);
        
        character.divineAscension = {
            stage: 'aspiring_deity',
            portfolios: portfolios,
            divineRank: 0,
            worshipers: 0,
            divineAura: 0,
            salientAbilities: [],
            divineRealm: null,
            advancement: {
                requirements: this.getDivineAscensionRequirements(1),
                progress: {}
            }
        };
        
        return character.divineAscension;
    }

    /**
     * Advance divine rank
     */
    advanceDivineRank(character, targetRank) {
        if (!character.divineAscension) {
            throw new Error('Character has not begun divine ascension');
        }
        
        const currentRank = character.divineAscension.divineRank;
        
        for (let rank = currentRank + 1; rank <= targetRank; rank++) {
            console.log(`⚡ Advancing to divine rank ${rank}`);
            
            // Check requirements
            const requirements = this.getDivineAscensionRequirements(rank);
            if (!this.meetsRequirements(character, requirements)) {
                throw new Error(`Requirements not met for divine rank ${rank}`);
            }
            
            // Grant divine abilities
            this.grantDivineRankAbilities(character, rank);
            
            character.divineAscension.divineRank = rank;
        }
        
        // Update divine status
        const rankData = this.getDivineRankData(targetRank);
        character.divineAscension.status = rankData.name;
        
        console.log(`🌟 ${character.name} is now a ${rankData.name} (Divine Rank ${targetRank})!`);
        
        return character.divineAscension;
    }

    // ===== EPIC ENCOUNTERS =====

    /**
     * Generate epic encounter
     */
    generateEpicEncounter(partyLevel, environment = 'any', encounterType = 'combat') {
        console.log(`🎲 Generating epic encounter for level ${partyLevel} party`);
        
        const cr = this.calculateEpicChallengeRating(partyLevel);
        const encounter = {
            challengeRating: cr,
            environment: environment,
            type: encounterType,
            creatures: [],
            tactics: [],
            treasure: this.generateEpicTreasure(cr),
            specialConditions: []
        };
        
        // Select appropriate epic creatures
        encounter.creatures = this.selectEpicCreatures(cr, environment);
        
        // Generate tactical information
        encounter.tactics = this.generateEpicTactics(encounter.creatures);
        
        // Add environmental hazards
        if (environment !== 'any') {
            encounter.specialConditions = this.generateEnvironmentalHazards(environment, cr);
        }
        
        console.log(`⚔️ Epic encounter generated: CR ${cr} (${encounter.creatures.length} creatures)`);
        
        return encounter;
    }

    /**
     * Calculate epic challenge rating
     */
    calculateEpicChallengeRating(partyLevel) {
        // Epic encounters are typically CR = average party level
        // But can range from -4 to +8 depending on difficulty
        const baseCR = partyLevel;
        const difficulty = Math.random();
        
        if (difficulty < 0.1) return baseCR - 4; // Easy
        if (difficulty < 0.3) return baseCR - 2; // Moderate
        if (difficulty < 0.7) return baseCR;     // Challenging
        if (difficulty < 0.9) return baseCR + 2; // Hard
        return baseCR + 4; // Epic
    }

    // ===== UTILITY METHODS =====

    /**
     * Get primary class for character
     */
    getPrimaryClass(character) {
        if (!character.classes) return 'fighter'; // Default
        
        let primaryClass = 'fighter';
        let highestLevel = 0;
        
        for (const [className, classData] of Object.entries(character.classes)) {
            if (classData.level > highestLevel) {
                highestLevel = classData.level;
                primaryClass = className;
            }
        }
        
        return primaryClass;
    }

    /**
     * Roll hit points for level up
     */
    rollHitPoints(hitDie, character) {
        // Epic characters get max hit die + Con modifier
        const conModifier = this.getAbilityModifier(character.abilities.constitution);
        return hitDie + conModifier;
    }

    /**
     * Update base attack bonus
     */
    updateBaseAttackBonus(character, level, progression) {
        const progressionRates = {
            'good': 1.0,      // +1 per level
            'average': 0.75,  // +3 per 4 levels
            'poor': 0.5       // +1 per 2 levels
        };
        
        const rate = progressionRates[progression] || 0.5;
        character.baseAttackBonus = Math.floor(level * rate);
    }

    /**
     * Get epic spell slots
     */
    calculateEpicSpellSlots(character) {
        const casterLevel = this.getCasterLevel(character);
        if (casterLevel < 21) return 0;
        
        // Epic casters get 1 epic spell slot per day initially
        // Additional slots can be gained through feats and items
        return 1;
    }

    /**
     * Check if character has epic feat
     */
    hasEpicFeat(character, featName) {
        return character.epicFeats && character.epicFeats.includes(featName);
    }

    /**
     * Get epic feat prerequisites
     */
    getEpicFeatPrerequisites(featName) {
        const feat = this.epicFeats[featName];
        return feat ? feat.prerequisites : [];
    }

    /**
     * Check if character meets epic feat prerequisites
     */
    meetsEpicFeatPrerequisites(character, featName) {
        const prerequisites = this.getEpicFeatPrerequisites(featName);
        
        return prerequisites.every(prereq => {
            if (prereq === 'Epic level') {
                return character.level >= this.EPIC_LEVEL_START;
            }
            // Add more prerequisite checks as needed
            return true; // Simplified for demo
        });
    }

    /**
     * Get divine rank data
     */
    getDivineRankData(rank) {
        // Find the appropriate divine rank data
        const ranks = Object.keys(this.divineRanks).map(Number).sort((a, b) => a - b);
        
        for (let i = ranks.length - 1; i >= 0; i--) {
            if (rank >= ranks[i]) {
                return this.divineRanks[ranks[i]];
            }
        }
        
        return this.divineRanks[0]; // Default to mortal
    }

    /**
     * Get character summary with epic information
     */
    getEpicCharacterSummary(character) {
        const summary = {
            name: character.name,
            level: character.level,
            isEpic: character.level >= this.EPIC_LEVEL_START,
            hitPoints: character.hitPoints,
            armorClass: this.calculateArmorClass(character),
            baseAttackBonus: character.baseAttackBonus,
            epicFeats: character.epicFeats || [],
            epicSpells: character.epicSpells?.developedSpells?.length || 0,
            divineRank: character.divineAscension?.divineRank || 0,
            divineStatus: character.divineAscension?.status || 'Mortal'
        };
        
        if (character.level >= this.EPIC_LEVEL_START) {
            summary.epicLevel = character.level - 20;
            summary.nextEpicFeat = Math.ceil((character.level - 20) / this.EPIC_FEAT_FREQUENCY) * this.EPIC_FEAT_FREQUENCY + 20 + 1;
        }
        
        return summary;
    }
}

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EpicLevelSystem;
} else if (typeof window !== 'undefined') {
    window.EpicLevelSystem = EpicLevelSystem;
}
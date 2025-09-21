/**
 * D&D 3.5 Epic Level Progression System
 * Handles character advancement beyond level 20 according to Epic Level Handbook rules
 * Supports levels 21-100, epic feats, divine ascension, and epic spellcaster advancement
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class EpicLevelManager {
    constructor() {
        this.epicFeats = new Map();
        this.divineRanks = new Map();
        this.epicSpellProgression = new Map();
        
        this.initializeEpicFeats();
        this.initializeDivineRanks();
        this.initializeEpicSpellProgression();
        
        console.log('⚡ Epic Level Manager initialized');
    }
    
    /**
     * Advance character to epic levels (21+)
     */
    advanceToEpicLevel(character, newLevel) {
        if (newLevel <= 20) {
            throw new Error('Epic levels start at level 21');
        }
        
        const currentLevel = character.level || 1;
        const epicLevels = newLevel - 20;
        
        console.log(`⚡ Advancing ${character.name} to epic level ${newLevel}`);
        
        // Apply epic level bonuses
        this.applyEpicLevelProgression(character, currentLevel, newLevel);
        
        // Update character level
        character.level = newLevel;
        character.epicLevel = epicLevels;
        
        // Calculate epic bonuses
        this.updateEpicBonuses(character);
        
        // Handle epic feats
        this.handleEpicFeats(character, currentLevel, newLevel);
        
        // Handle ability score increases
        this.handleAbilityIncreases(character, currentLevel, newLevel);
        
        // Handle epic spellcasting
        if (this.isSpellcaster(character)) {
            this.handleEpicSpellcasting(character);
        }
        
        // Handle divine ascension if applicable
        this.handleDivineAscension(character);
        
        return character;
    }
    
    /**
     * Apply epic level progression to character
     */
    applyEpicLevelProgression(character, fromLevel, toLevel) {
        // Add hit dice for levels gained
        for (let level = fromLevel + 1; level <= toLevel; level++) {
            this.addHitDie(character, level);
            this.addSkillPoints(character, level);
        }
        
        // Update class features that continue to scale
        this.updateScalingClassFeatures(character);
    }
    
    /**
     * Add hit die for epic level
     */
    addHitDie(character, level) {
        if (!character.hitPoints) {
            character.hitPoints = { maximum: 0, current: 0, temporary: 0 };
        }
        
        // Get primary class hit die
        const primaryClass = character.classes[0];
        const hitDie = this.getClassHitDie(primaryClass.name);
        
        // Roll hit points (or take average)
        const hpGain = this.rollHitPoints(hitDie, character.abilities?.constitution || 10);
        
        character.hitPoints.maximum += hpGain;
        character.hitPoints.current += hpGain;
        
        console.log(`⚡ Level ${level}: Gained ${hpGain} hit points`);
    }
    
    /**
     * Add skill points for epic level
     */
    addSkillPoints(character, level) {
        if (!character.skills) character.skills = {};
        
        const primaryClass = character.classes[0];
        const baseSkillPoints = this.getClassSkillPoints(primaryClass.name);
        const intModifier = this.getAbilityModifier(character.abilities?.intelligence || 10);
        
        const skillPoints = baseSkillPoints + intModifier;
        
        if (!character.availableSkillPoints) character.availableSkillPoints = 0;
        character.availableSkillPoints += skillPoints;
        
        console.log(`⚡ Level ${level}: Gained ${skillPoints} skill points`);
    }
    
    /**
     * Update epic bonuses for attack rolls and saves
     */
    updateEpicBonuses(character) {
        const epicLevel = character.epicLevel || 0;
        
        // Epic attack bonus: +1 at odd epic levels (21, 23, 25, etc.)
        const epicAttackBonus = Math.floor((epicLevel + 1) / 2);
        
        // Epic save bonus: +1 at even epic levels (22, 24, 26, etc.)
        const epicSaveBonus = Math.floor(epicLevel / 2);
        
        if (!character.epicBonuses) character.epicBonuses = {};
        
        character.epicBonuses.attack = epicAttackBonus;
        character.epicBonuses.save = epicSaveBonus;
        
        // Update base attack bonus
        if (!character.baseAttackBonus) character.baseAttackBonus = 0;
        character.totalAttackBonus = character.baseAttackBonus + epicAttackBonus;
        
        // Update save bonuses
        if (!character.saves) {
            character.saves = {
                fortitude: { base: 0 },
                reflex: { base: 0 },
                will: { base: 0 }
            };
        }
        
        ['fortitude', 'reflex', 'will'].forEach(save => {
            character.saves[save].epic = epicSaveBonus;
            character.saves[save].total = (character.saves[save].base || 0) + epicSaveBonus;
        });
        
        console.log(`⚡ Epic bonuses - Attack: +${epicAttackBonus}, Saves: +${epicSaveBonus}`);
    }
    
    /**
     * Handle epic feat acquisition
     */
    handleEpicFeats(character, fromLevel, toLevel) {
        if (!character.feats) character.feats = [];
        if (!character.epicFeats) character.epicFeats = [];
        
        // Regular feats every 3 levels
        for (let level = fromLevel + 1; level <= toLevel; level++) {
            if (level % 3 === 0) {
                character.availableFeats = (character.availableFeats || 0) + 1;
                console.log(`⚡ Level ${level}: Gained regular feat`);
            }
        }
        
        // Epic feats from class progression
        this.handleClassEpicFeats(character, fromLevel, toLevel);
    }
    
    /**
     * Handle class-specific epic feat progression
     */
    handleClassEpicFeats(character, fromLevel, toLevel) {
        character.classes.forEach(charClass => {
            const epicProgression = this.getClassEpicProgression(charClass.name);
            
            for (let level = Math.max(fromLevel + 1, 21); level <= toLevel; level++) {
                const classLevel = this.getClassLevelAtCharacterLevel(character, charClass.name, level);
                
                if (classLevel > 20 && epicProgression.feetEvery > 0) {
                    const epicClassLevel = classLevel - 20;
                    if (epicClassLevel % epicProgression.feetEvery === 0) {
                        if (!character.availableEpicFeats) character.availableEpicFeats = {};
                        if (!character.availableEpicFeats[charClass.name]) {
                            character.availableEpicFeats[charClass.name] = 0;
                        }
                        character.availableEpicFeats[charClass.name]++;
                        
                        console.log(`⚡ Level ${level}: Gained ${charClass.name} epic feat`);
                    }
                }
            }
        });
    }
    
    /**
     * Handle ability score increases
     */
    handleAbilityIncreases(character, fromLevel, toLevel) {
        if (!character.abilityIncreases) character.abilityIncreases = 0;
        
        for (let level = fromLevel + 1; level <= toLevel; level++) {
            if (level % 4 === 0) {
                character.abilityIncreases++;
                console.log(`⚡ Level ${level}: Gained ability score increase`);
            }
        }
    }
    
    /**
     * Handle epic spellcasting progression
     */
    handleEpicSpellcasting(character) {
        character.classes.forEach(charClass => {
            const spellProgression = this.getClassSpellProgression(charClass.name);
            if (!spellProgression) return;
            
            const classLevel = charClass.level;
            if (classLevel <= 20) return;
            
            // Caster level continues to increase
            charClass.casterLevel = classLevel;
            
            // Spells known may continue to increase for some classes
            this.updateEpicSpellsKnown(character, charClass);
            
            // Spells per day only increase through Improved Spell Capacity feat
            console.log(`⚡ ${charClass.name} caster level: ${classLevel}`);
        });
    }
    
    /**
     * Handle divine ascension for qualifying characters
     */
    handleDivineAscension(character) {
        if (character.level >= 21 && this.qualifiesForDivineAscension(character)) {
            if (!character.divineRank) {
                character.divineRank = 0; // Quasi-deity
                character.divineAscension = {
                    type: 'quasi-deity',
                    portfolio: [],
                    domains: [],
                    followers: 0
                };
                
                console.log(`⚡ ${character.name} begins divine ascension as quasi-deity`);
            }
            
            // Calculate potential divine rank based on level and achievements
            const potentialRank = this.calculatePotentialDivineRank(character);
            if (potentialRank > character.divineRank) {
                console.log(`⚡ ${character.name} can ascend to divine rank ${potentialRank}`);
            }
        }
    }
    
    /**
     * Initialize epic feats database
     */
    initializeEpicFeats() {
        const epicFeats = [
            // Combat Epic Feats
            {
                name: 'Devastating Critical',
                type: 'combat',
                prerequisites: ['Overwhelming Critical', 'BAB +25', 'Str 25+'],
                benefit: 'Instantly kill creatures with critical hits (Fort save negates)',
                description: 'When you score a critical hit, the target must make a Fortitude save or die instantly.'
            },
            {
                name: 'Epic Weapon Focus',
                type: 'combat',
                prerequisites: ['Weapon Focus', 'Fighter 20+'],
                benefit: '+2 bonus on attack rolls with chosen weapon type',
                description: 'Additional +2 bonus to attack rolls with a weapon you already have Weapon Focus with.'
            },
            {
                name: 'Epic Weapon Specialization',
                type: 'combat',
                prerequisites: ['Epic Weapon Focus', 'Weapon Specialization', 'Fighter 20+'],
                benefit: '+4 bonus on damage rolls with chosen weapon type',
                description: 'Additional +4 bonus to damage rolls with a specialized weapon.'
            },
            {
                name: 'Overwhelming Critical',
                type: 'combat',
                prerequisites: ['Improved Critical', 'BAB +23', 'Str 23+'],
                benefit: 'Deal extra damage on critical hits',
                description: 'Critical hits deal an additional 1d6 points of damage.'
            },
            {
                name: 'Superior Initiative',
                type: 'combat',
                prerequisites: ['Improved Initiative'],
                benefit: '+8 bonus on initiative checks',
                description: 'You gain an additional +4 bonus to initiative (total +8 with Improved Initiative).'
            },
            
            // Spellcasting Epic Feats
            {
                name: 'Epic Spell Focus',
                type: 'spellcasting',
                prerequisites: ['Spell Focus', 'Spellcaster level 20+'],
                benefit: '+2 bonus to spell save DCs for chosen school',
                description: 'Additional +2 bonus to save DCs for spells of a chosen school.'
            },
            {
                name: 'Epic Spell Penetration',
                type: 'spellcasting',
                prerequisites: ['Spell Penetration', 'Greater Spell Penetration', 'Spellcaster level 20+'],
                benefit: '+2 bonus on caster level checks to overcome spell resistance',
                description: 'Additional +2 bonus to overcome spell resistance.'
            },
            {
                name: 'Improved Spell Capacity',
                type: 'spellcasting',
                prerequisites: ['Spellcaster level 20+'],
                benefit: 'Gain one additional spell slot of any level you can cast',
                description: 'You can prepare and cast one additional spell per day of any level you can cast.'
            },
            {
                name: 'Enhance Spell',
                type: 'spellcasting',
                prerequisites: ['Spellcaster level 20+'],
                benefit: 'Increase the effective level of a spell',
                description: 'Choose a spell you can cast. The spell is treated as one level higher for all purposes.'
            },
            {
                name: 'Automatic Quicken Spell',
                type: 'spellcasting',
                prerequisites: ['Quicken Spell', 'Spellcaster level 21+'],
                benefit: 'Automatically quicken spells of 6th level or lower',
                description: 'All spells of 6th level or lower are automatically quickened without using higher-level slots.'
            },
            
            // Skill Epic Feats
            {
                name: 'Epic Skill Focus',
                type: 'skill',
                prerequisites: ['Skill Focus', '20+ ranks in chosen skill'],
                benefit: '+10 bonus to chosen skill',
                description: 'You gain an additional +10 bonus to a skill you have Skill Focus in.'
            },
            {
                name: 'Legendary Climber',
                type: 'skill',
                prerequisites: ['30+ ranks in Climb'],
                benefit: 'Climb at normal speed without penalties',
                description: 'You can climb at your normal speed and retain your Dex bonus to AC while climbing.'
            },
            {
                name: 'Legendary Rider',
                type: 'skill',
                prerequisites: ['30+ ranks in Ride'],
                benefit: 'Remain mounted even when unconscious',
                description: 'You automatically succeed on Ride checks to remain mounted and can fight while unconscious.'
            },
            {
                name: 'Self-Concealment',
                type: 'skill',
                prerequisites: ['30+ ranks in Hide', 'Dex 30+'],
                benefit: '10% miss chance in any conditions',
                description: 'Opponents have a 10% miss chance against you due to your extraordinary hiding ability.'
            },
            
            // Divine Epic Feats
            {
                name: 'Divine Rank',
                type: 'divine',
                prerequisites: ['Character level 21+', 'Divine ascension'],
                benefit: 'Increase divine rank by 1',
                description: 'Your divine rank increases, granting additional divine abilities and power.'
            },
            {
                name: 'Extra Domain',
                type: 'divine',
                prerequisites: ['Divine rank 1+'],
                benefit: 'Gain additional domain',
                description: 'You gain access to an additional domain and its granted power.'
            },
            {
                name: 'Zone of Peace',
                type: 'divine',
                prerequisites: ['Divine rank 6+'],
                benefit: 'Create areas where violence is impossible',
                description: 'You can create zones where hostile actions are impossible.'
            },
            
            // General Epic Feats
            {
                name: 'Epic Endurance',
                type: 'general',
                prerequisites: ['Endurance', 'Con 25+'],
                benefit: 'Immunity to fatigue and exhaustion',
                description: 'You become immune to fatigue and exhaustion effects.'
            },
            {
                name: 'Epic Leadership',
                type: 'general',
                prerequisites: ['Leadership', 'Character level 21+'],
                benefit: 'Attract more and higher-level followers',
                description: 'Your leadership score increases, allowing more and higher-level followers.'
            },
            {
                name: 'Epic Reputation',
                type: 'general',
                prerequisites: ['Character level 21+'],
                benefit: '+4 bonus on reputation-based checks',
                description: 'Your epic deeds grant bonuses to social interactions.'
            },
            {
                name: 'Fast Healing',
                type: 'general',
                prerequisites: ['Con 25+'],
                benefit: 'Heal damage over time',
                description: 'You gain fast healing, recovering hit points each round.'
            },
            {
                name: 'Perfect Health',
                type: 'general',
                prerequisites: ['Con 25+', 'Epic Endurance'],
                benefit: 'Immunity to disease and poison',
                description: 'You become immune to all diseases, poisons, and similar effects.'
            }
        ];
        
        epicFeats.forEach(feat => {
            this.epicFeats.set(feat.name, feat);
        });
        
        console.log(`⚡ Loaded ${epicFeats.length} epic feats`);
    }
    
    /**
     * Initialize divine rank system
     */
    initializeDivineRanks() {
        const divineRanks = [
            {
                rank: 0,
                title: 'Quasi-Deity',
                description: 'Not truly divine but possesses some divine characteristics',
                benefits: ['Damage reduction 10/epic', 'Spell resistance 25', 'Immortality']
            },
            {
                rank: 1,
                title: 'Demigod',
                description: 'The weakest of the true deities',
                benefits: ['Divine aura', 'Domain mastery', 'Divine spellcasting']
            },
            {
                rank: 6,
                title: 'Lesser Deity',
                description: 'Moderately powerful divine being',
                benefits: ['Multiple avatars', 'Planar travel', 'Divine realm']
            },
            {
                rank: 11,
                title: 'Intermediate Deity',
                description: 'Powerful divine being with significant influence',
                benefits: ['Time manipulation', 'Reality alteration', 'Divine minions']
            },
            {
                rank: 16,
                title: 'Greater Deity',
                description: 'Among the most powerful divine beings',
                benefits: ['Omniscience in domain', 'Divine intervention', 'Cosmic influence']
            },
            {
                rank: 21,
                title: 'Overdeity',
                description: 'Supreme divine being with near-unlimited power',
                benefits: ['Universal awareness', 'Reality creation', 'Absolute domain control']
            }
        ];
        
        divineRanks.forEach(rank => {
            this.divineRanks.set(rank.rank, rank);
        });
        
        console.log(`⚡ Loaded ${divineRanks.length} divine rank tiers`);
    }
    
    /**
     * Initialize epic spell progression
     */
    initializeEpicSpellProgression() {
        const progressions = new Map([
            ['Wizard', { type: 'prepared', knownIncrease: false, bonusFeats: 5 }],
            ['Sorcerer', { type: 'spontaneous', knownIncrease: true, bonusFeats: 5 }],
            ['Cleric', { type: 'prepared', knownIncrease: false, bonusFeats: 4 }],
            ['Druid', { type: 'prepared', knownIncrease: false, bonusFeats: 4 }],
            ['Bard', { type: 'spontaneous', knownIncrease: true, bonusFeats: 6 }],
            ['Ranger', { type: 'prepared', knownIncrease: false, bonusFeats: 5 }],
            ['Paladin', { type: 'prepared', knownIncrease: false, bonusFeats: 5 }]
        ]);
        
        this.epicSpellProgression = progressions;
    }
    
    /**
     * Utility methods
     */
    getClassHitDie(className) {
        const hitDice = {
            'Barbarian': 12, 'Fighter': 10, 'Paladin': 10, 'Ranger': 10,
            'Bard': 6, 'Cleric': 8, 'Druid': 8, 'Monk': 8, 'Rogue': 6,
            'Sorcerer': 4, 'Wizard': 4
        };
        return hitDice[className] || 8;
    }
    
    getClassSkillPoints(className) {
        const skillPoints = {
            'Barbarian': 4, 'Bard': 6, 'Cleric': 2, 'Druid': 4, 'Fighter': 2,
            'Monk': 4, 'Paladin': 2, 'Ranger': 6, 'Rogue': 8, 'Sorcerer': 2,
            'Wizard': 2
        };
        return skillPoints[className] || 2;
    }
    
    getClassEpicProgression(className) {
        const progressions = {
            'Fighter': { feetEvery: 2 },
            'Barbarian': { feetEvery: 3 },
            'Ranger': { feetEvery: 3 },
            'Paladin': { feetEvery: 3 },
            'Cleric': { feetEvery: 3 },
            'Druid': { feetEvery: 3 },
            'Wizard': { feetEvery: 5 },
            'Sorcerer': { feetEvery: 5 },
            'Bard': { feetEvery: 6 },
            'Monk': { feetEvery: 5 },
            'Rogue': { feetEvery: 3 }
        };
        return progressions[className] || { feetEvery: 0 };
    }
    
    getClassSpellProgression(className) {
        const spellcasters = ['Wizard', 'Sorcerer', 'Cleric', 'Druid', 'Bard', 'Ranger', 'Paladin'];
        return spellcasters.includes(className) ? this.epicSpellProgression.get(className) : null;
    }
    
    getClassLevelAtCharacterLevel(character, className, characterLevel) {
        const charClass = character.classes.find(c => c.name === className);
        if (!charClass) return 0;
        
        // For single class characters
        if (character.classes.length === 1) {
            return characterLevel;
        }
        
        // For multiclass characters, need to track progression
        return charClass.level || 0;
    }
    
    rollHitPoints(hitDie, constitution) {
        const conModifier = this.getAbilityModifier(constitution);
        const baseRoll = Math.floor(Math.random() * hitDie) + 1;
        return Math.max(1, baseRoll + conModifier);
    }
    
    getAbilityModifier(abilityScore) {
        return Math.floor((abilityScore - 10) / 2);
    }
    
    isSpellcaster(character) {
        const spellcastingClasses = ['Wizard', 'Sorcerer', 'Cleric', 'Druid', 'Bard', 'Ranger', 'Paladin'];
        return character.classes.some(c => spellcastingClasses.includes(c.name));
    }
    
    qualifiesForDivineAscension(character) {
        // Basic requirements for divine ascension
        return (
            character.level >= 21 &&
            (character.epicFeats?.some(feat => feat.name === 'Epic Leadership') ||
             character.followers >= 1000 ||
             character.achievements?.includes('Defeated Greater Deity') ||
             character.achievements?.includes('Saved Multiverse'))
        );
    }
    
    calculatePotentialDivineRank(character) {
        let potentialRank = 0;
        
        if (character.level >= 21) potentialRank = 0; // Quasi-deity
        if (character.level >= 25) potentialRank = 1; // Demigod
        if (character.level >= 35) potentialRank = 6; // Lesser deity
        if (character.level >= 45) potentialRank = 11; // Intermediate deity
        if (character.level >= 55) potentialRank = 16; // Greater deity
        if (character.level >= 70) potentialRank = 21; // Overdeity
        
        // Modify based on followers and achievements
        if (character.followers >= 10000) potentialRank += 1;
        if (character.followers >= 100000) potentialRank += 2;
        if (character.followers >= 1000000) potentialRank += 3;
        
        return Math.min(potentialRank, 21);
    }
    
    updateScalingClassFeatures(character) {
        character.classes.forEach(charClass => {
            const className = charClass.name;
            const classLevel = charClass.level;
            
            // Update features that scale with level
            if (className === 'Monk') {
                this.updateMonkFeatures(character, classLevel);
            } else if (className === 'Barbarian') {
                this.updateBarbarianFeatures(character, classLevel);
            } else if (className === 'Ranger') {
                this.updateRangerFeatures(character, classLevel);
            }
            // Add other classes as needed
        });
    }
    
    updateMonkFeatures(character, level) {
        // Monk AC bonus, speed, and unarmed damage continue to scale
        if (!character.classFeatures) character.classFeatures = {};
        if (!character.classFeatures.monk) character.classFeatures.monk = {};
        
        const monkLevel = level;
        character.classFeatures.monk.acBonus = Math.floor((monkLevel - 1) / 5);
        character.classFeatures.monk.speedBonus = Math.floor(monkLevel / 3) * 10;
        character.classFeatures.monk.unarmedDamage = this.calculateMonkUnarmedDamage(monkLevel);
    }
    
    updateBarbarianFeatures(character, level) {
        // Barbarian rage uses per day continue
        if (!character.classFeatures) character.classFeatures = {};
        if (!character.classFeatures.barbarian) character.classFeatures.barbarian = {};
        
        character.classFeatures.barbarian.ragesPerDay = 1 + Math.floor((level - 1) / 4);
    }
    
    updateRangerFeatures(character, level) {
        // Ranger favored enemy bonuses and spells
        if (!character.classFeatures) character.classFeatures = {};
        if (!character.classFeatures.ranger) character.classFeatures.ranger = {};
        
        character.classFeatures.ranger.favoredEnemies = Math.floor((level - 1) / 5) + 1;
    }
    
    calculateMonkUnarmedDamage(level) {
        if (level < 4) return '1d6';
        if (level < 8) return '1d8';
        if (level < 12) return '1d10';
        if (level < 16) return '2d6';
        if (level < 20) return '2d8';
        if (level < 30) return '2d10';
        return '4d8';
    }
    
    updateEpicSpellsKnown(character, charClass) {
        const progression = this.epicSpellProgression.get(charClass.name);
        if (!progression || !progression.knownIncrease) return;
        
        const classLevel = charClass.level;
        if (classLevel <= 20) return;
        
        // For spontaneous casters, spells known can continue to increase
        if (!charClass.spellsKnown) charClass.spellsKnown = {};
        
        // Add additional spells known at epic levels
        const epicLevels = classLevel - 20;
        const additionalSpells = Math.floor(epicLevels / 2);
        
        for (let spellLevel = 0; spellLevel <= 9; spellLevel++) {
            if (!charClass.spellsKnown[spellLevel]) continue;
            charClass.spellsKnown[spellLevel] += Math.floor(additionalSpells / 2);
        }
    }
    
    /**
     * Character analysis methods
     */
    analyzeEpicCharacter(character) {
        if (character.level <= 20) {
            return { isEpic: false, message: 'Character is not epic level' };
        }
        
        const analysis = {
            isEpic: true,
            epicLevel: character.level - 20,
            epicBonuses: character.epicBonuses || {},
            availableFeats: this.countAvailableEpicFeats(character),
            divineStatus: this.analyzeDivineStatus(character),
            recommendations: []
        };
        
        // Add recommendations
        if (analysis.availableFeats.regular > 0) {
            analysis.recommendations.push(`${analysis.availableFeats.regular} regular feats available`);
        }
        
        if (analysis.availableFeats.epic > 0) {
            analysis.recommendations.push(`${analysis.availableFeats.epic} epic feats available`);
        }
        
        if (character.abilityIncreases > 0) {
            analysis.recommendations.push(`${character.abilityIncreases} ability score increases available`);
        }
        
        if (this.qualifiesForDivineAscension(character) && !character.divineRank) {
            analysis.recommendations.push('Qualifies for divine ascension');
        }
        
        return analysis;
    }
    
    countAvailableEpicFeats(character) {
        const regular = character.availableFeats || 0;
        let epic = 0;
        
        if (character.availableEpicFeats) {
            Object.values(character.availableEpicFeats).forEach(count => {
                epic += count;
            });
        }
        
        return { regular, epic, total: regular + epic };
    }
    
    analyzeDivineStatus(character) {
        if (!character.divineRank && character.divineRank !== 0) {
            return { isDivine: false, status: 'Mortal' };
        }
        
        const rankData = this.divineRanks.get(character.divineRank);
        return {
            isDivine: true,
            rank: character.divineRank,
            title: rankData?.title || 'Unknown',
            status: rankData?.description || 'Divine being',
            benefits: rankData?.benefits || []
        };
    }
    
    /**
     * Epic feat management
     */
    getAvailableEpicFeats(character) {
        const availableFeats = [];
        
        this.epicFeats.forEach((feat, name) => {
            if (this.meetsPrerequisites(character, feat)) {
                availableFeats.push(feat);
            }
        });
        
        return availableFeats;
    }
    
    meetsPrerequisites(character, feat) {
        // Simplified prerequisite checking
        // In a full implementation, this would parse and validate all prerequisites
        
        if (feat.prerequisites.includes('Character level 21+') && character.level < 21) {
            return false;
        }
        
        if (feat.prerequisites.some(req => req.includes('BAB +')) && character.level < 21) {
            return false;
        }
        
        if (feat.prerequisites.includes('Spellcaster level 20+') && !this.isSpellcaster(character)) {
            return false;
        }
        
        return true;
    }
    
    learnEpicFeat(character, featName) {
        const feat = this.epicFeats.get(featName);
        if (!feat) {
            throw new Error(`Epic feat "${featName}" not found`);
        }
        
        if (!this.meetsPrerequisites(character, feat)) {
            throw new Error(`Character does not meet prerequisites for ${featName}`);
        }
        
        if (!character.epicFeats) character.epicFeats = [];
        character.epicFeats.push({ ...feat, learned: true });
        
        // Apply feat benefits
        this.applyEpicFeatBenefits(character, feat);
        
        console.log(`⚡ ${character.name} learned epic feat: ${featName}`);
        return character;
    }
    
    applyEpicFeatBenefits(character, feat) {
        // Apply specific feat benefits
        switch (feat.name) {
            case 'Epic Weapon Focus':
                // Implementation would add +2 attack bonus
                break;
            case 'Improved Spell Capacity':
                // Implementation would add spell slot
                break;
            case 'Epic Endurance':
                if (!character.immunities) character.immunities = [];
                character.immunities.push('fatigue', 'exhaustion');
                break;
            // Add other feat implementations
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EpicLevelManager;
} else if (typeof window !== 'undefined') {
    window.EpicLevelManager = EpicLevelManager;
}
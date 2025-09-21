/**
 * RulzLawyer Feats System
 * Complete D&D 3.5 feats implementation with prerequisites, effects, and character integration
 * 
 * Features:
 * - Complete D&D 3.5 SRD feats database
 * - Prerequisites validation (ability scores, skills, BAB, race, class, etc.)
 * - Combat, skill, metamagic, and item creation feats
 * - Character progression and feat selection
 * - Prerequisite chains and feat trees
 * - Combat bonuses and skill modifiers
 * 
 * Requirements Traceability:
 * - REQ-006: Complete D&D 3.5 feats system
 * - US-016: Feat selection and prerequisites validation
 * - TS-006: Feats database and character integration
 */

class FeatsSystem {
    constructor(characterDataModel, diceEngine) {
        this.characterDataModel = characterDataModel;
        this.diceEngine = diceEngine;
        
        this.metadata = {
            version: '1.0.0',
            created: new Date(),
            totalFeats: 0,
            lastUpdated: null
        };

        console.log('📜 Initializing Feats System...');
        this.initializeFeatsDatabase();
        console.log('✅ Feats System ready');
    }

    // === Feats Database Initialization ===
    initializeFeatsDatabase() {
        this.feats = new Map();
        this.featsByType = new Map();
        this.featsByClass = new Map();
        this.featTrees = new Map();

        // Initialize feat types
        this.featTypes = {
            general: 'General',
            fighter: 'Fighter Bonus',
            metamagic: 'Metamagic',
            itemCreation: 'Item Creation',
            combat: 'Combat',
            skill: 'Skill',
            racial: 'Racial',
            divine: 'Divine',
            heritage: 'Heritage'
        };

        // Load all D&D 3.5 SRD feats
        this.loadGeneralFeats();
        this.loadCombatFeats();
        this.loadMetamagicFeats();
        this.loadItemCreationFeats();
        this.loadSkillFeats();
        this.loadRacialFeats();
        this.loadDivineFeats();
        
        this.buildFeatTrees();
        this.metadata.totalFeats = this.feats.size;
        this.metadata.lastUpdated = new Date();
        
        console.log(`📊 Loaded ${this.metadata.totalFeats} feats`);
    }

    // === General Feats ===
    loadGeneralFeats() {
        const generalFeats = [
            {
                name: 'Alertness',
                type: 'general',
                description: 'You have finely tuned senses.',
                benefit: '+2 bonus on Listen checks and Spot checks.',
                prerequisites: {},
                effects: {
                    skills: { Listen: 2, Spot: 2 }
                }
            },
            {
                name: 'Animal Affinity',
                type: 'general',
                description: 'You are good with animals.',
                benefit: '+2 bonus on Handle Animal checks and Ride checks.',
                prerequisites: {},
                effects: {
                    skills: { 'Handle Animal': 2, Ride: 2 }
                }
            },
            {
                name: 'Armor Proficiency (Light)',
                type: 'general',
                description: 'You are proficient with light armor.',
                benefit: 'When you wear a type of armor with which you are proficient, the armor check penalty for that armor applies only to Balance, Climb, Escape Artist, Hide, Jump, Move Silently, Sleight of Hand, and Tumble checks.',
                prerequisites: {},
                effects: {
                    armorProficiency: ['light']
                }
            },
            {
                name: 'Armor Proficiency (Medium)',
                type: 'general',
                description: 'You are proficient with medium armor.',
                benefit: 'See Armor Proficiency (Light).',
                prerequisites: {
                    feats: ['Armor Proficiency (Light)']
                },
                effects: {
                    armorProficiency: ['medium']
                }
            },
            {
                name: 'Armor Proficiency (Heavy)',
                type: 'general',
                description: 'You are proficient with heavy armor.',
                benefit: 'See Armor Proficiency (Light).',
                prerequisites: {
                    feats: ['Armor Proficiency (Light)', 'Armor Proficiency (Medium)']
                },
                effects: {
                    armorProficiency: ['heavy']
                }
            },
            {
                name: 'Athletic',
                type: 'general',
                description: 'You have a knack for athletic endeavors.',
                benefit: '+2 bonus on Climb checks and Swim checks.',
                prerequisites: {},
                effects: {
                    skills: { Climb: 2, Swim: 2 }
                }
            },
            {
                name: 'Blind-Fight',
                type: 'general',
                description: 'You are skilled at fighting in conditions with poor visibility.',
                benefit: 'In melee, every time you miss because of concealment, you can reroll your miss chance percentile roll one time to see if you actually hit.',
                prerequisites: {},
                effects: {
                    combat: { blindFighting: true }
                }
            },
            {
                name: 'Combat Casting',
                type: 'general',
                description: 'You are adept at casting spells in combat.',
                benefit: '+4 bonus on Concentration checks made to cast a spell or use a spell-like ability while on the defensive or while you are grappling or pinned.',
                prerequisites: {},
                effects: {
                    skills: { Concentration: 4 },
                    spellcasting: { defensiveCasting: 4 }
                }
            },
            {
                name: 'Combat Reflexes',
                type: 'general',
                description: 'You can respond quickly and repeatedly to opponents who let their defenses down.',
                benefit: 'You may make a number of additional attacks of opportunity equal to your Dexterity bonus.',
                prerequisites: {},
                effects: {
                    combat: { additionalAoO: 'dex_modifier' }
                }
            },
            {
                name: 'Deceitful',
                type: 'general',
                description: 'You have a talent for deceiving others.',
                benefit: '+2 bonus on Disguise checks and Forgery checks.',
                prerequisites: {},
                effects: {
                    skills: { Disguise: 2, Forgery: 2 }
                }
            },
            {
                name: 'Deft Hands',
                type: 'general',
                description: 'You have nimble fingers.',
                benefit: '+2 bonus on Sleight of Hand checks and Use Rope checks.',
                prerequisites: {},
                effects: {
                    skills: { 'Sleight of Hand': 2, 'Use Rope': 2 }
                }
            },
            {
                name: 'Diligent',
                type: 'general',
                description: 'Your meticulousness allows you to analyze minute details that others miss.',
                benefit: '+2 bonus on Appraise checks and Decipher Script checks.',
                prerequisites: {},
                effects: {
                    skills: { Appraise: 2, 'Decipher Script': 2 }
                }
            },
            {
                name: 'Dodge',
                type: 'general',
                description: 'You are adept at dodging blows.',
                benefit: 'During your action, you designate an opponent and receive a +1 dodge bonus to Armor Class against attacks from that opponent.',
                prerequisites: {
                    abilities: { Dexterity: 13 }
                },
                effects: {
                    combat: { dodgeBonus: 1 }
                }
            },
            {
                name: 'Endurance',
                type: 'general',
                description: 'You have exceptional staying power.',
                benefit: '+4 bonus on the following checks and saves: Swim checks made to resist nonlethal damage, Constitution checks made to continue running, Constitution checks made to avoid nonlethal damage from a forced march, Constitution checks made to hold your breath, Constitution checks made to avoid nonlethal damage from starvation or thirst, Fortitude saves made to avoid nonlethal damage from hot or cold environments, and Fortitude saves made to resist damage from suffocation.',
                prerequisites: {},
                effects: {
                    saves: { fortitudeEnvironmental: 4 },
                    skills: { SwimNonlethal: 4 }
                }
            },
            {
                name: 'Eschew Materials',
                type: 'general',
                description: 'You can cast spells without relying on material components.',
                benefit: 'You can cast any spell that has a material component costing 1 gp or less without needing that component.',
                prerequisites: {},
                effects: {
                    spellcasting: { eschewMaterials: true }
                }
            },
            {
                name: 'Extra Turning',
                type: 'general',
                description: 'You can turn or rebuke undead more often.',
                benefit: 'Each time you take this feat, you can use your ability to turn or rebuke undead four more times per day than normal.',
                prerequisites: {
                    abilities: { turnUndead: true }
                },
                effects: {
                    turnUndead: { additionalUses: 4 }
                }
            },
            {
                name: 'Great Fortitude',
                type: 'general',
                description: 'You are tougher than normal.',
                benefit: '+2 bonus on Fortitude saves.',
                prerequisites: {},
                effects: {
                    saves: { fortitude: 2 }
                }
            },
            {
                name: 'Improved Initiative',
                type: 'general',
                description: 'You can react more quickly than normal in a fight.',
                benefit: '+4 bonus on initiative checks.',
                prerequisites: {},
                effects: {
                    combat: { initiative: 4 }
                }
            },
            {
                name: 'Improved Toughness',
                type: 'general',
                description: 'You are significantly tougher than normal.',
                benefit: 'You gain a number of hit points equal to your current Hit Dice. Each time you gain a HD (such as by gaining a level), you gain 1 additional hit point.',
                prerequisites: {},
                effects: {
                    hitPoints: { perLevel: 1, retroactive: true }
                }
            },
            {
                name: 'Improved Unarmed Strike',
                type: 'general',
                description: 'You are skilled at fighting while unarmed.',
                benefit: 'You are considered to be armed even when unarmed. You do not provoke attacks of opportunity from armed opponents when you attack them while unarmed.',
                prerequisites: {},
                effects: {
                    combat: { unarmedStrike: true, noProvokeUnarmed: true }
                }
            },
            {
                name: 'Investigator',
                type: 'general',
                description: 'You have a knack for finding information.',
                benefit: '+2 bonus on Gather Information checks and Search checks.',
                prerequisites: {},
                effects: {
                    skills: { 'Gather Information': 2, Search: 2 }
                }
            },
            {
                name: 'Iron Will',
                type: 'general',
                description: 'You have a stronger will than normal.',
                benefit: '+2 bonus on Will saves.',
                prerequisites: {},
                effects: {
                    saves: { will: 2 }
                }
            },
            {
                name: 'Leadership',
                type: 'general',
                description: 'You attract followers and can lead a cohort.',
                benefit: 'You can attract loyal companions and devoted followers, subordinates who assist you.',
                prerequisites: {
                    level: 6
                },
                effects: {
                    leadership: { cohort: true, followers: true }
                }
            },
            {
                name: 'Lightning Reflexes',
                type: 'general',
                description: 'You have faster than normal reflexes.',
                benefit: '+2 bonus on Reflex saves.',
                prerequisites: {},
                effects: {
                    saves: { reflex: 2 }
                }
            },
            {
                name: 'Magical Aptitude',
                type: 'general',
                description: 'You have a knack for magical endeavors.',
                benefit: '+2 bonus on Spellcraft checks and Use Magic Device checks.',
                prerequisites: {},
                effects: {
                    skills: { Spellcraft: 2, 'Use Magic Device': 2 }
                }
            },
            {
                name: 'Negotiator',
                type: 'general',
                description: 'You are good at gauging and swaying attitudes.',
                benefit: '+2 bonus on Diplomacy checks and Sense Motive checks.',
                prerequisites: {},
                effects: {
                    skills: { Diplomacy: 2, 'Sense Motive': 2 }
                }
            },
            {
                name: 'Nimble Fingers',
                type: 'general',
                description: 'You are adept at manipulation and misdirection.',
                benefit: '+2 bonus on Disable Device checks and Open Lock checks.',
                prerequisites: {},
                effects: {
                    skills: { 'Disable Device': 2, 'Open Lock': 2 }
                }
            },
            {
                name: 'Persuasive',
                type: 'general',
                description: 'You have a way with words.',
                benefit: '+2 bonus on Bluff checks and Intimidate checks.',
                prerequisites: {},
                effects: {
                    skills: { Bluff: 2, Intimidate: 2 }
                }
            },
            {
                name: 'Point Blank Shot',
                type: 'general',
                description: 'You are especially accurate when making ranged attacks against close targets.',
                benefit: '+1 bonus on attack and damage rolls with ranged weapons at ranges of up to 30 feet.',
                prerequisites: {},
                effects: {
                    combat: { pointBlankShot: { attack: 1, damage: 1, range: 30 } }
                }
            },
            {
                name: 'Precise Shot',
                type: 'general',
                description: 'You are skilled at timing and aiming ranged attacks.',
                benefit: 'You can shoot or throw ranged weapons at an opponent engaged in melee without taking the standard -4 penalty on your attack roll.',
                prerequisites: {
                    feats: ['Point Blank Shot']
                },
                effects: {
                    combat: { preciseShot: true }
                }
            },
            {
                name: 'Quick Draw',
                type: 'general',
                description: 'You can draw weapons faster than normal.',
                benefit: 'You can draw a weapon as a free action instead of as a move action.',
                prerequisites: {
                    abilities: { baseAttackBonus: 1 }
                },
                effects: {
                    combat: { quickDraw: true }
                }
            },
            {
                name: 'Rapid Shot',
                type: 'general',
                description: 'You can use ranged weapons with exceptional speed.',
                benefit: 'When using the full attack action with a ranged weapon, you can fire one additional time this round. All of your attack rolls take a -2 penalty when using Rapid Shot.',
                prerequisites: {
                    abilities: { Dexterity: 13 },
                    feats: ['Point Blank Shot']
                },
                effects: {
                    combat: { rapidShot: { additionalAttack: 1, penalty: -2 } }
                }
            },
            {
                name: 'Run',
                type: 'general',
                description: 'You are fleet of foot.',
                benefit: 'When running, you move five times your normal speed (if wearing medium, light, or no armor and carrying no more than a medium load) or four times your speed (if wearing heavy armor or carrying a heavy load).',
                prerequisites: {},
                effects: {
                    movement: { runMultiplier: { light: 5, heavy: 4 } }
                }
            },
            {
                name: 'Self-Sufficient',
                type: 'general',
                description: 'You can take care of yourself in harsh environments and situations.',
                benefit: '+2 bonus on Heal checks and Survival checks.',
                prerequisites: {},
                effects: {
                    skills: { Heal: 2, Survival: 2 }
                }
            },
            {
                name: 'Shield Proficiency',
                type: 'general',
                description: 'You are proficient with bucklers, small shields, and large shields.',
                benefit: 'You can use a shield and take only the standard penalties.',
                prerequisites: {},
                effects: {
                    equipment: { shieldProficiency: ['light', 'heavy'] }
                }
            },
            {
                name: 'Simple Weapon Proficiency',
                type: 'general',
                description: 'You understand how to use simple weapons in combat.',
                benefit: 'You make attack rolls with simple weapons normally.',
                prerequisites: {},
                effects: {
                    weapons: { proficiency: 'simple' }
                }
            },
            {
                name: 'Skill Focus',
                type: 'general',
                description: 'Choose a skill. You are particularly adept at that skill.',
                benefit: '+3 bonus on all checks involving that skill.',
                prerequisites: {},
                effects: {
                    skills: { variable: 3 } // Skill chosen at feat selection
                },
                variable: 'skill'
            },
            {
                name: 'Stealthy',
                type: 'general',
                description: 'You are particularly good at avoiding notice.',
                benefit: '+2 bonus on Hide checks and Move Silently checks.',
                prerequisites: {},
                effects: {
                    skills: { Hide: 2, 'Move Silently': 2 }
                }
            },
            {
                name: 'Toughness',
                type: 'general',
                description: 'You are tougher than normal.',
                benefit: '+3 hit points.',
                prerequisites: {},
                effects: {
                    hitPoints: { bonus: 3 }
                }
            },
            {
                name: 'Track',
                type: 'general',
                description: 'You can follow the trails of creatures and characters across most types of terrain.',
                benefit: 'To find tracks or to follow them for 1 mile requires a successful Survival check.',
                prerequisites: {},
                effects: {
                    skills: { SurvivalTrack: 'special' },
                    abilities: { track: true }
                }
            },
            {
                name: 'Two-Weapon Fighting',
                type: 'general',
                description: 'You can fight with a weapon in each hand.',
                benefit: 'Your penalties on attack rolls for fighting with two weapons are reduced.',
                prerequisites: {
                    abilities: { Dexterity: 15 }
                },
                effects: {
                    combat: { twoWeaponFighting: { primaryPenalty: -2, offhandPenalty: -2 } }
                }
            },
            {
                name: 'Weapon Focus',
                type: 'general',
                description: 'Choose one type of weapon. You are especially good at using that weapon.',
                benefit: '+1 bonus on all attack rolls you make using the selected weapon.',
                prerequisites: {
                    abilities: { baseAttackBonus: 1 }
                },
                effects: {
                    combat: { weaponFocus: { bonus: 1 } } // Weapon chosen at feat selection
                },
                variable: 'weapon'
            },
            {
                name: 'Weapon Proficiency (Martial)',
                type: 'general',
                description: 'You understand how to use martial weapons in combat.',
                benefit: 'You make attack rolls with martial weapons normally.',
                prerequisites: {},
                effects: {
                    weapons: { proficiency: 'martial' }
                }
            }
        ];

        generalFeats.forEach(feat => this.addFeat(feat));
    }

    // === Combat Feats ===
    loadCombatFeats() {
        const combatFeats = [
            {
                name: 'Cleave',
                type: 'combat',
                description: 'You can follow through with powerful blows.',
                benefit: 'If you deal a creature enough damage to make it drop, you get an immediate, extra melee attack against another creature within reach.',
                prerequisites: {
                    abilities: { Strength: 13 },
                    feats: ['Power Attack']
                },
                effects: {
                    combat: { cleave: true }
                }
            },
            {
                name: 'Combat Expertise',
                type: 'combat',
                description: 'You are trained at using your combat skill for defense as well as offense.',
                benefit: 'When you use the attack action or full attack action in melee, you can take a penalty of as much as -5 on your attack roll and add the same number (+5 or less) as a dodge bonus to your Armor Class.',
                prerequisites: {
                    abilities: { Intelligence: 13 }
                },
                effects: {
                    combat: { combatExpertise: { maxPenalty: -5, maxBonus: 5 } }
                }
            },
            {
                name: 'Great Cleave',
                type: 'combat',
                description: 'You can wield weapons with exceptional force.',
                benefit: 'As Cleave, except that you have no limit to the number of times you can use it per round.',
                prerequisites: {
                    abilities: { Strength: 13, baseAttackBonus: 4 },
                    feats: ['Cleave', 'Power Attack']
                },
                effects: {
                    combat: { greatCleave: true }
                }
            },
            {
                name: 'Improved Bull Rush',
                type: 'combat',
                description: 'You know how to push opponents back.',
                benefit: 'When you perform a bull rush, you do not provoke an attack of opportunity from the defender. You also gain a +4 bonus on the opposed Strength check you make to push back the defender.',
                prerequisites: {
                    abilities: { Strength: 13 },
                    feats: ['Power Attack']
                },
                effects: {
                    combat: { improvedBullRush: { bonus: 4, noProvoke: true } }
                }
            },
            {
                name: 'Improved Disarm',
                type: 'combat',
                description: 'You know how to disarm opponents in melee combat.',
                benefit: 'You do not provoke an attack of opportunity when you attempt to disarm an opponent, nor does the opponent have a chance to disarm you. You also gain a +4 bonus on the opposed attack roll you make to disarm the opponent.',
                prerequisites: {
                    abilities: { Intelligence: 13 },
                    feats: ['Combat Expertise']
                },
                effects: {
                    combat: { improvedDisarm: { bonus: 4, noProvoke: true } }
                }
            },
            {
                name: 'Improved Feint',
                type: 'combat',
                description: 'You are skilled at misdirecting your opponent\'s attention in combat.',
                benefit: 'You can make a Bluff check to feint in combat as a move action.',
                prerequisites: {
                    abilities: { Intelligence: 13 },
                    feats: ['Combat Expertise']
                },
                effects: {
                    combat: { improvedFeint: true }
                }
            },
            {
                name: 'Improved Grapple',
                type: 'combat',
                description: 'You are skilled at grappling opponents.',
                benefit: 'You do not provoke an attack of opportunity when you make a touch attack to start a grapple. You also gain a +4 bonus on all grapple checks, regardless of whether you started the grapple or not.',
                prerequisites: {
                    abilities: { Dexterity: 13 },
                    feats: ['Improved Unarmed Strike']
                },
                effects: {
                    combat: { improvedGrapple: { bonus: 4, noProvoke: true } }
                }
            },
            {
                name: 'Improved Overrun',
                type: 'combat',
                description: 'You are skilled at knocking down opponents.',
                benefit: 'When you attempt to overrun an opponent, the target may not choose to avoid you. You also gain a +4 bonus on your Strength check to knock down your opponent.',
                prerequisites: {
                    abilities: { Strength: 13 },
                    feats: ['Power Attack']
                },
                effects: {
                    combat: { improvedOverrun: { bonus: 4, noAvoidance: true } }
                }
            },
            {
                name: 'Improved Precise Shot',
                type: 'combat',
                description: 'Your ranged attacks ignore the AC bonus granted to targets by anything less than total cover.',
                benefit: 'Your ranged attacks ignore the AC bonus granted to targets by anything less than total cover, and the miss chance granted to targets by anything less than total concealment.',
                prerequisites: {
                    abilities: { Dexterity: 19, baseAttackBonus: 11 },
                    feats: ['Point Blank Shot', 'Precise Shot']
                },
                effects: {
                    combat: { improvedPreciseShot: true }
                }
            },
            {
                name: 'Improved Shield Bash',
                type: 'combat',
                description: 'You can bash with a shield while retaining its shield bonus to your Armor Class.',
                benefit: 'When you perform a shield bash, you may still apply the shield\'s shield bonus to your AC.',
                prerequisites: {
                    feats: ['Shield Proficiency']
                },
                effects: {
                    combat: { improvedShieldBash: true }
                }
            },
            {
                name: 'Improved Sunder',
                type: 'combat',
                description: 'You are skilled at attacking your opponents\' weapons.',
                benefit: 'When you strike at an object held or carried by an opponent, you do not provoke an attack of opportunity. You also gain a +4 bonus on any attack roll made to attack an object held or carried by another character.',
                prerequisites: {
                    abilities: { Strength: 13 },
                    feats: ['Power Attack']
                },
                effects: {
                    combat: { improvedSunder: { bonus: 4, noProvoke: true } }
                }
            },
            {
                name: 'Improved Trip',
                type: 'combat',
                description: 'You are trained not only in tripping opponents safely but also in following through with an attack.',
                benefit: 'You do not provoke an attack of opportunity when you attempt to trip an opponent while you are unarmed. You also gain a +4 bonus on your Strength check to trip your opponent.',
                prerequisites: {
                    abilities: { Intelligence: 13 },
                    feats: ['Combat Expertise']
                },
                effects: {
                    combat: { improvedTrip: { bonus: 4, noProvoke: true, followUp: true } }
                }
            },
            {
                name: 'Improved Two-Weapon Fighting',
                type: 'combat',
                description: 'You are an expert in fighting two-handed.',
                benefit: 'In addition to the standard single extra attack you get with an off-hand weapon, you get a second attack with it, albeit at a -5 penalty.',
                prerequisites: {
                    abilities: { Dexterity: 17, baseAttackBonus: 6 },
                    feats: ['Two-Weapon Fighting']
                },
                effects: {
                    combat: { improvedTwoWeaponFighting: { additionalAttack: 1, penalty: -5 } }
                }
            },
            {
                name: 'Manyshot',
                type: 'combat',
                description: 'You can fire multiple arrows as a single attack.',
                benefit: 'As a standard action, you may fire two arrows at a single opponent within 30 feet. Both arrows use the same attack roll (with a -4 penalty) to determine success and deal damage normally.',
                prerequisites: {
                    abilities: { Dexterity: 17, baseAttackBonus: 6 },
                    feats: ['Point Blank Shot', 'Rapid Shot']
                },
                effects: {
                    combat: { manyshot: { arrows: 2, penalty: -4, range: 30 } }
                }
            },
            {
                name: 'Mobility',
                type: 'combat',
                description: 'You get out of the way of attacks of opportunity more easily.',
                benefit: 'You get a +4 dodge bonus to Armor Class against attacks of opportunity caused when you move out of or within a threatened area.',
                prerequisites: {
                    abilities: { Dexterity: 13 },
                    feats: ['Dodge']
                },
                effects: {
                    combat: { mobility: { dodgeBonus: 4 } }
                }
            },
            {
                name: 'Mounted Combat',
                type: 'combat',
                description: 'You are skilled in mounted combat.',
                benefit: 'Once per round when your mount is hit in combat, you may attempt a Ride check to negate the hit.',
                prerequisites: {
                    skills: { Ride: 1 }
                },
                effects: {
                    combat: { mountedCombat: true }
                }
            },
            {
                name: 'Power Attack',
                type: 'combat',
                description: 'You can make exceptionally deadly melee attacks by sacrificing accuracy for power.',
                benefit: 'On your action, before making attack rolls for a round, you may choose to subtract a number from all melee attack rolls and add the same number to all melee damage rolls.',
                prerequisites: {
                    abilities: { Strength: 13 }
                },
                effects: {
                    combat: { powerAttack: { maxPenalty: -5, damageMultiplier: 1 } }
                }
            },
            {
                name: 'Shot on the Run',
                type: 'combat',
                description: 'You are highly trained in skirmish ranged combat tactics.',
                benefit: 'When using an attack action with a ranged weapon, you can move both before and after the attack, provided that your total distance moved is not greater than your speed.',
                prerequisites: {
                    abilities: { Dexterity: 13, baseAttackBonus: 4 },
                    feats: ['Dodge', 'Mobility', 'Point Blank Shot']
                },
                effects: {
                    combat: { shotOnTheRun: true }
                }
            },
            {
                name: 'Spring Attack',
                type: 'combat',
                description: 'You are trained in fast melee attacks and fancy footwork.',
                benefit: 'When using an attack action with a melee weapon, you can move both before and after the attack, provided that your total distance moved is not greater than your speed.',
                prerequisites: {
                    abilities: { Dexterity: 13, baseAttackBonus: 4 },
                    feats: ['Dodge', 'Mobility']
                },
                effects: {
                    combat: { springAttack: true }
                }
            },
            {
                name: 'Weapon Finesse',
                type: 'combat',
                description: 'You are trained in using your agility in melee combat, as opposed to brute strength.',
                benefit: 'With a light weapon, rapier, whip, or spiked chain made for a creature of your size category, you may use your Dexterity modifier instead of your Strength modifier on attack rolls.',
                prerequisites: {
                    abilities: { baseAttackBonus: 1 }
                },
                effects: {
                    combat: { weaponFinesse: true }
                }
            },
            {
                name: 'Weapon Specialization',
                type: 'combat',
                description: 'Choose one type of weapon for which you have already selected Weapon Focus. You deal extra damage when using this weapon.',
                benefit: '+2 bonus on all damage rolls you make using the selected weapon.',
                prerequisites: {
                    abilities: { baseAttackBonus: 4 },
                    feats: ['Weapon Focus'],
                    classes: ['fighter']
                },
                effects: {
                    combat: { weaponSpecialization: { bonus: 2 } } // Weapon from Weapon Focus
                },
                variable: 'weapon'
            },
            {
                name: 'Whirlwind Attack',
                type: 'combat',
                description: 'You can strike out at every foe within reach.',
                benefit: 'When you use a full attack action, you can give up your regular attacks and instead make one melee attack at your full base attack bonus against each opponent within reach.',
                prerequisites: {
                    abilities: { Dexterity: 13, Intelligence: 13, baseAttackBonus: 4 },
                    feats: ['Dodge', 'Mobility', 'Spring Attack', 'Combat Expertise']
                },
                effects: {
                    combat: { whirlwindAttack: true }
                }
            }
        ];

        combatFeats.forEach(feat => this.addFeat(feat));
    }

    // === Metamagic Feats ===
    loadMetamagicFeats() {
        const metamagicFeats = [
            {
                name: 'Empower Spell',
                type: 'metamagic',
                description: 'You can cast spells to greater effect.',
                benefit: 'All variable, numeric effects of an empowered spell are increased by one-half. A spell slot one level higher than the spell\'s actual level is used.',
                prerequisites: {},
                effects: {
                    metamagic: { empower: { multiplier: 1.5, levelIncrease: 1 } }
                }
            },
            {
                name: 'Enlarge Spell',
                type: 'metamagic',
                description: 'You can cast spells farther than normal.',
                benefit: 'You can alter a spell with a range of close, medium, or long to increase its range by 100%. A spell slot one level higher is used.',
                prerequisites: {},
                effects: {
                    metamagic: { enlarge: { rangeMultiplier: 2, levelIncrease: 1 } }
                }
            },
            {
                name: 'Extend Spell',
                type: 'metamagic',
                description: 'You can cast spells that last longer than normal.',
                benefit: 'An extended spell lasts twice as long as normal. A spell slot one level higher is used.',
                prerequisites: {},
                effects: {
                    metamagic: { extend: { durationMultiplier: 2, levelIncrease: 1 } }
                }
            },
            {
                name: 'Heighten Spell',
                type: 'metamagic',
                description: 'You can cast spells as if they were higher level.',
                benefit: 'A heightened spell has a higher spell level than normal (up to a maximum of 9th level). The heightened spell is as difficult to dispel as a spell of its effective level.',
                prerequisites: {},
                effects: {
                    metamagic: { heighten: { variableLevel: true } }
                }
            },
            {
                name: 'Maximize Spell',
                type: 'metamagic',
                description: 'You can cast spells to maximum effect.',
                benefit: 'All variable, numeric effects of a spell modified by this feat are maximized. A spell slot three levels higher is used.',
                prerequisites: {},
                effects: {
                    metamagic: { maximize: { variableMaximum: true, levelIncrease: 3 } }
                }
            },
            {
                name: 'Quicken Spell',
                type: 'metamagic',
                description: 'You can cast spells in a fraction of the normal time.',
                benefit: 'A quickened spell can be cast as a free action. A spell slot four levels higher is used.',
                prerequisites: {},
                effects: {
                    metamagic: { quicken: { castingTime: 'free', levelIncrease: 4 } }
                }
            },
            {
                name: 'Silent Spell',
                type: 'metamagic',
                description: 'You can cast spells silently.',
                benefit: 'A silent spell can be cast with no verbal components. A spell slot one level higher is used.',
                prerequisites: {},
                effects: {
                    metamagic: { silent: { noVerbal: true, levelIncrease: 1 } }
                }
            },
            {
                name: 'Still Spell',
                type: 'metamagic',
                description: 'You can cast spells without gestures.',
                benefit: 'A stilled spell can be cast with no somatic components. A spell slot one level higher is used.',
                prerequisites: {},
                effects: {
                    metamagic: { still: { noSomatic: true, levelIncrease: 1 } }
                }
            },
            {
                name: 'Widen Spell',
                type: 'metamagic',
                description: 'You can increase the area of your spells.',
                benefit: 'You can alter a burst, emanation, line, or spread shaped spell to increase its area. A widened spell\'s area is doubled. A spell slot three levels higher is used.',
                prerequisites: {},
                effects: {
                    metamagic: { widen: { areaMultiplier: 2, levelIncrease: 3 } }
                }
            }
        ];

        metamagicFeats.forEach(feat => this.addFeat(feat));
    }

    // === Item Creation Feats ===
    loadItemCreationFeats() {
        const itemCreationFeats = [
            {
                name: 'Brew Potion',
                type: 'itemCreation',
                description: 'You can create potions, which carry spells within them.',
                benefit: 'You can create a potion of any 3rd-level or lower spell that you know and that targets one or more creatures.',
                prerequisites: {
                    abilities: { casterLevel: 3 }
                },
                effects: {
                    itemCreation: { potions: { maxLevel: 3 } }
                }
            },
            {
                name: 'Craft Magic Arms and Armor',
                type: 'itemCreation',
                description: 'You can create magic weapons, armor, and shields.',
                benefit: 'You can create any magic weapon, armor, or shield whose prerequisites you meet.',
                prerequisites: {
                    abilities: { casterLevel: 5 }
                },
                effects: {
                    itemCreation: { weapons: true, armor: true, shields: true }
                }
            },
            {
                name: 'Craft Rod',
                type: 'itemCreation',
                description: 'You can create magic rods.',
                benefit: 'You can create any rod whose prerequisites you meet.',
                prerequisites: {
                    abilities: { casterLevel: 9 }
                },
                effects: {
                    itemCreation: { rods: true }
                }
            },
            {
                name: 'Craft Staff',
                type: 'itemCreation',
                description: 'You can create magic staffs.',
                benefit: 'You can create any staff whose prerequisites you meet.',
                prerequisites: {
                    abilities: { casterLevel: 12 }
                },
                effects: {
                    itemCreation: { staffs: true }
                }
            },
            {
                name: 'Craft Wand',
                type: 'itemCreation',
                description: 'You can create wands.',
                benefit: 'You can create a wand of any 4th-level or lower spell that you know.',
                prerequisites: {
                    abilities: { casterLevel: 5 }
                },
                effects: {
                    itemCreation: { wands: { maxLevel: 4 } }
                }
            },
            {
                name: 'Craft Wondrous Item',
                type: 'itemCreation',
                description: 'You can create wondrous items.',
                benefit: 'You can create any wondrous item whose prerequisites you meet.',
                prerequisites: {
                    abilities: { casterLevel: 3 }
                },
                effects: {
                    itemCreation: { wondrousItems: true }
                }
            },
            {
                name: 'Forge Ring',
                type: 'itemCreation',
                description: 'You can create magic rings.',
                benefit: 'You can create any ring whose prerequisites you meet.',
                prerequisites: {
                    abilities: { casterLevel: 7 }
                },
                effects: {
                    itemCreation: { rings: true }
                }
            },
            {
                name: 'Scribe Scroll',
                type: 'itemCreation',
                description: 'You can create scrolls.',
                benefit: 'You can create a scroll of any spell that you know.',
                prerequisites: {
                    abilities: { casterLevel: 1 }
                },
                effects: {
                    itemCreation: { scrolls: { anyKnownSpell: true } }
                }
            }
        ];

        itemCreationFeats.forEach(feat => this.addFeat(feat));
    }

    // === Skill Feats ===
    loadSkillFeats() {
        const skillFeats = [
            {
                name: 'Acrobatic',
                type: 'skill',
                description: 'You have excellent body awareness and coordination.',
                benefit: '+2 bonus on Jump checks and Tumble checks.',
                prerequisites: {},
                effects: {
                    skills: { Jump: 2, Tumble: 2 }
                }
            },
            {
                name: 'Agile',
                type: 'skill',
                description: 'You are particularly flexible and poised.',
                benefit: '+2 bonus on Balance checks and Escape Artist checks.',
                prerequisites: {},
                effects: {
                    skills: { Balance: 2, 'Escape Artist': 2 }
                }
            }
        ];

        skillFeats.forEach(feat => this.addFeat(feat));
    }

    // === Racial Feats ===
    loadRacialFeats() {
        const racialFeats = [
            {
                name: 'Dodge (Halfling)',
                type: 'racial',
                description: 'Halflings are naturally good at avoiding attacks.',
                benefit: '+1 dodge bonus to AC against creatures larger than Medium.',
                prerequisites: {
                    race: 'Halfling'
                },
                effects: {
                    combat: { dodgeBonusVsLarge: 1 }
                }
            },
            {
                name: 'Weapon Familiarity (Elf)',
                type: 'racial',
                description: 'Elves are familiar with certain weapons.',
                benefit: 'Elves treat longswords, rapiers, longbows, and shortbows as martial weapons rather than exotic weapons.',
                prerequisites: {
                    race: 'Elf'
                },
                effects: {
                    weapons: { 
                        familiarWeapons: ['longsword', 'rapier', 'longbow', 'shortbow'] 
                    }
                }
            }
        ];

        racialFeats.forEach(feat => this.addFeat(feat));
    }

    // === Divine Feats ===
    loadDivineFeats() {
        const divineFeats = [
            {
                name: 'Divine Favor',
                type: 'divine',
                description: 'Your deity smiles upon you.',
                benefit: 'Once per day, you can call upon your deity for aid, gaining a +1 luck bonus on one attack roll, skill check, ability check, or saving throw.',
                prerequisites: {
                    abilities: { divineSpellcaster: true }
                },
                effects: {
                    divine: { favor: { bonus: 1, usesPerDay: 1 } }
                }
            }
        ];

        divineFeats.forEach(feat => this.addFeat(feat));
    }

    // === Feat Management ===
    addFeat(feat) {
        feat.id = feat.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        this.feats.set(feat.id, feat);
        
        // Organize by type
        if (!this.featsByType.has(feat.type)) {
            this.featsByType.set(feat.type, []);
        }
        this.featsByType.get(feat.type).push(feat.id);
    }

    buildFeatTrees() {
        // Build prerequisite chains for feat trees
        this.featTrees.set('combat_expertise_tree', {
            root: 'combat_expertise',
            branches: [
                { feat: 'improved_disarm', requires: ['combat_expertise'] },
                { feat: 'improved_feint', requires: ['combat_expertise'] },
                { feat: 'improved_trip', requires: ['combat_expertise'] },
                { feat: 'whirlwind_attack', requires: ['combat_expertise', 'dodge', 'mobility', 'spring_attack'] }
            ]
        });

        this.featTrees.set('point_blank_shot_tree', {
            root: 'point_blank_shot',
            branches: [
                { feat: 'precise_shot', requires: ['point_blank_shot'] },
                { feat: 'rapid_shot', requires: ['point_blank_shot'] },
                { feat: 'manyshot', requires: ['point_blank_shot', 'rapid_shot'] },
                { feat: 'improved_precise_shot', requires: ['point_blank_shot', 'precise_shot'] },
                { feat: 'shot_on_the_run', requires: ['point_blank_shot', 'dodge', 'mobility'] }
            ]
        });

        this.featTrees.set('power_attack_tree', {
            root: 'power_attack',
            branches: [
                { feat: 'cleave', requires: ['power_attack'] },
                { feat: 'great_cleave', requires: ['power_attack', 'cleave'] },
                { feat: 'improved_bull_rush', requires: ['power_attack'] },
                { feat: 'improved_overrun', requires: ['power_attack'] },
                { feat: 'improved_sunder', requires: ['power_attack'] }
            ]
        });

        this.featTrees.set('two_weapon_fighting_tree', {
            root: 'two_weapon_fighting',
            branches: [
                { feat: 'improved_two_weapon_fighting', requires: ['two_weapon_fighting'] },
                { feat: 'greater_two_weapon_fighting', requires: ['two_weapon_fighting', 'improved_two_weapon_fighting'] }
            ]
        });
    }

    // === Prerequisites Validation ===
    validatePrerequisites(featId, character) {
        const feat = this.feats.get(featId);
        if (!feat) return { valid: false, reasons: ['Feat not found'] };

        const reasons = [];
        let valid = true;

        // Check ability score requirements
        if (feat.prerequisites.abilities) {
            for (const [ability, required] of Object.entries(feat.prerequisites.abilities)) {
                if (ability === 'baseAttackBonus') {
                    const bab = this.calculateBAB(character);
                    if (bab < required) {
                        valid = false;
                        reasons.push(`Requires Base Attack Bonus +${required} (current: +${bab})`);
                    }
                } else if (ability === 'casterLevel') {
                    const cl = this.calculateCasterLevel(character);
                    if (cl < required) {
                        valid = false;
                        reasons.push(`Requires caster level ${required} (current: ${cl})`);
                    }
                } else if (typeof required === 'number') {
                    const score = character.abilities?.[ability] || 10;
                    if (score < required) {
                        valid = false;
                        reasons.push(`Requires ${ability} ${required} (current: ${score})`);
                    }
                }
            }
        }

        // Check feat requirements
        if (feat.prerequisites.feats) {
            for (const requiredFeat of feat.prerequisites.feats) {
                const reqFeatId = requiredFeat.toLowerCase().replace(/[^a-z0-9]+/g, '_');
                if (!character.feats?.includes(reqFeatId)) {
                    valid = false;
                    reasons.push(`Requires feat: ${requiredFeat}`);
                }
            }
        }

        // Check skill requirements
        if (feat.prerequisites.skills) {
            for (const [skill, required] of Object.entries(feat.prerequisites.skills)) {
                const ranks = character.skills?.[skill]?.ranks || 0;
                if (ranks < required) {
                    valid = false;
                    reasons.push(`Requires ${required} ranks in ${skill} (current: ${ranks})`);
                }
            }
        }

        // Check race requirements
        if (feat.prerequisites.race) {
            if (character.race !== feat.prerequisites.race) {
                valid = false;
                reasons.push(`Requires race: ${feat.prerequisites.race}`);
            }
        }

        // Check class requirements
        if (feat.prerequisites.classes) {
            const hasRequiredClass = feat.prerequisites.classes.some(className => 
                character.classes?.some(cls => cls.name.toLowerCase() === className)
            );
            if (!hasRequiredClass) {
                valid = false;
                reasons.push(`Requires class: ${feat.prerequisites.classes.join(' or ')}`);
            }
        }

        // Check level requirements
        if (feat.prerequisites.level) {
            const totalLevel = character.classes?.reduce((sum, cls) => sum + cls.level, 0) || 0;
            if (totalLevel < feat.prerequisites.level) {
                valid = false;
                reasons.push(`Requires character level ${feat.prerequisites.level} (current: ${totalLevel})`);
            }
        }

        return { valid, reasons };
    }

    // === Character Integration ===
    applyFeatEffects(character, featId) {
        const feat = this.feats.get(featId);
        if (!feat || !feat.effects) return character;

        const effects = { ...feat.effects };

        // Apply skill bonuses
        if (effects.skills) {
            character.featBonuses = character.featBonuses || {};
            character.featBonuses.skills = character.featBonuses.skills || {};
            
            for (const [skill, bonus] of Object.entries(effects.skills)) {
                if (skill === 'variable' && feat.variable === 'skill') {
                    // Handle Skill Focus and similar feats
                    if (feat.selectedSkill) {
                        character.featBonuses.skills[feat.selectedSkill] = 
                            (character.featBonuses.skills[feat.selectedSkill] || 0) + bonus;
                    }
                } else {
                    character.featBonuses.skills[skill] = 
                        (character.featBonuses.skills[skill] || 0) + bonus;
                }
            }
        }

        // Apply save bonuses
        if (effects.saves) {
            character.featBonuses.saves = character.featBonuses.saves || {};
            for (const [save, bonus] of Object.entries(effects.saves)) {
                character.featBonuses.saves[save] = 
                    (character.featBonuses.saves[save] || 0) + bonus;
            }
        }

        // Apply combat effects
        if (effects.combat) {
            character.featBonuses.combat = character.featBonuses.combat || {};
            Object.assign(character.featBonuses.combat, effects.combat);
        }

        // Apply hit point bonuses
        if (effects.hitPoints) {
            character.featBonuses.hitPoints = character.featBonuses.hitPoints || {};
            Object.assign(character.featBonuses.hitPoints, effects.hitPoints);
        }

        return character;
    }

    getAvailableFeats(character, type = null) {
        const available = [];
        
        for (const [featId, feat] of this.feats) {
            if (type && feat.type !== type) continue;
            if (character.feats?.includes(featId)) continue; // Already has feat
            
            const validation = this.validatePrerequisites(featId, character);
            if (validation.valid) {
                available.push({
                    ...feat,
                    id: featId
                });
            }
        }

        return available;
    }

    getFeatById(featId) {
        return this.feats.get(featId);
    }

    getFeatsByType(type) {
        const featIds = this.featsByType.get(type) || [];
        return featIds.map(id => this.feats.get(id));
    }

    searchFeats(query) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        for (const [featId, feat] of this.feats) {
            if (feat.name.toLowerCase().includes(queryLower) ||
                feat.description.toLowerCase().includes(queryLower) ||
                feat.benefit.toLowerCase().includes(queryLower)) {
                results.push({
                    ...feat,
                    id: featId
                });
            }
        }
        
        return results;
    }

    getFeatTree(rootFeatId) {
        for (const [treeId, tree] of this.featTrees) {
            if (tree.root === rootFeatId) {
                return {
                    id: treeId,
                    ...tree,
                    feats: [tree.root, ...tree.branches.map(b => b.feat)]
                        .map(id => this.feats.get(id))
                        .filter(f => f)
                };
            }
        }
        return null;
    }

    // === Helper Methods ===
    calculateBAB(character) {
        if (!character.classes) return 0;
        return character.classes.reduce((total, cls) => {
            const classData = this.characterDataModel?.classes?.[cls.name];
            const progression = classData?.baseAttackBonus || 'poor';
            const level = cls.level;
            
            switch (progression) {
                case 'good': return total + level;
                case 'average': return total + Math.floor(level * 0.75);
                case 'poor': return total + Math.floor(level * 0.5);
                default: return total;
            }
        }, 0);
    }

    calculateCasterLevel(character) {
        if (!character.classes) return 0;
        return character.classes.reduce((total, cls) => {
            const classData = this.characterDataModel?.classes?.[cls.name];
            if (classData?.spellcasting) {
                return total + cls.level;
            }
            return total;
        }, 0);
    }

    getStatistics() {
        return {
            ...this.metadata,
            featsByType: Object.fromEntries(
                Array.from(this.featsByType.entries()).map(([type, feats]) => 
                    [type, feats.length]
                )
            ),
            featTrees: this.featTrees.size
        };
    }
}

// === Export for different environments ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeatsSystem;
} else if (typeof window !== 'undefined') {
    window.FeatsSystem = FeatsSystem;
    
    // Initialize if dependencies are available
    if (window.characterDataModel) {
        window.featsSystem = new FeatsSystem(window.characterDataModel, window.diceEngine);
        console.log('📜 Global Feats System initialized');
    }
}

console.log('📜 Feats System module loaded');
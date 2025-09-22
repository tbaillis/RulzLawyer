---
description: "Adventure generation engine with encounter balance and AI assistance"
applyTo: "**/adventure/**,**/encounter/**,**/ai/**"
---

# Adventure Engine Implementation Guide

## Core Requirements
Build a comprehensive adventure generation engine with balanced encounters, treasure generation, NPC creation, and narrative flow management for D&D 3.5 campaigns.

## System Architecture
```javascript
class AdventureEngine {
    constructor(partyData, difficultySettings) {
        this.party = partyData;
        this.difficulty = difficultySettings;
        this.encounterCalculator = new EncounterCalculator();
        this.treasureGenerator = new TreasureGenerator();
        this.narrativeEngine = new NarrativeEngine();
        this.currentAdventure = null;
    }
}
```

## Party Analysis System
```javascript
analyzeParty() {
    const analysis = {
        averageLevel: this.calculateAverageLevel(),
        totalECL: this.calculateEffectiveCharacterLevel(),
        partySize: this.party.length,
        roles: this.identifyPartyRoles(),
        strengths: this.identifyStrengths(),
        weaknesses: this.identifyWeaknesses(),
        preferredChallenges: this.determineChallengeTypes()
    };
    
    return analysis;
},

calculateAverageLevel() {
    return Math.round(this.party.reduce((sum, char) => sum + char.level, 0) / this.party.length);
},

identifyPartyRoles() {
    const roles = {
        tank: [],      // High AC, HP - Fighter, Paladin
        damage: [],    // High damage output - Barbarian, Ranger
        support: [],   // Healing, buffs - Cleric, Bard
        utility: [],   // Skills, spells - Rogue, Wizard
        controller: [] // Crowd control - Wizard, Sorcerer
    };
    
    this.party.forEach(character => {
        const classRoles = this.getClassRoles(character.class);
        classRoles.forEach(role => {
            roles[role].push(character);
        });
    });
    
    return roles;
}
```

## Encounter Generation System
```javascript
class EncounterCalculator {
    constructor() {
        this.crTable = this.initializeCRTable();
        this.environmentModifiers = this.initializeEnvironmentModifiers();
    }
    
    generateBalancedEncounter(party, difficulty = 'average') {
        const targetEL = this.calculateTargetEncounterLevel(party, difficulty);
        
        const encounter = {
            encounterLevel: targetEL,
            creatures: this.selectCreatures(targetEL, party),
            terrain: this.generateTerrain(),
            tactics: this.generateTactics(),
            treasure: this.generateTreasure(targetEL, party.length),
            xpReward: this.calculateXPReward(targetEL, party)
        };
        
        return encounter;
    },
    
    calculateTargetEncounterLevel(party, difficulty) {
        const partyLevel = Math.round(party.reduce((sum, char) => sum + char.level, 0) / party.length);
        
        const difficultyModifiers = {
            easy: -1,
            average: 0,
            challenging: +1,
            hard: +2,
            epic: +3
        };
        
        let targetEL = partyLevel + (difficultyModifiers[difficulty] || 0);
        
        // Adjust for party size (D&D 3.5 rules)
        if (party.length < 4) targetEL -= 1;
        if (party.length > 5) targetEL += 1;
        if (party.length > 6) targetEL += 2;
        
        return Math.max(1, targetEL);
    }
}
```

## Monster Selection and Scaling
```javascript
monsterDatabase: {
    goblin: {
        name: 'Goblin',
        cr: 1/3,
        size: 'Small',
        type: 'Humanoid',
        hp: 5,
        ac: 15,
        attacks: [{ name: 'Morningstar', attack: '+2', damage: '1d8' }],
        saves: { fort: 1, ref: 1, will: 0 },
        environment: ['underground', 'forest', 'hills'],
        tactics: 'Uses cover and ranged attacks when possible'
    },
    // ... complete monster database
},

selectCreatures(targetEL, party) {
    const suitableMonsters = this.filterMonstersByEnvironment(this.currentEnvironment);
    const balancedEncounter = this.buildEncounterToBudget(targetEL, suitableMonsters);
    
    return balancedEncounter.map(monster => ({
        ...monster,
        quantity: monster.count,
        scalingAdjustments: this.calculateScaling(monster, party)
    }));
},

buildEncounterToBudget(targetEL, availableMonsters) {
    const budget = this.getEncounterBudget(targetEL);
    const encounter = [];
    let remainingBudget = budget;
    
    while (remainingBudget > 0 && availableMonsters.length > 0) {
        const suitable = availableMonsters.filter(monster => 
            this.getMonsterCost(monster.cr) <= remainingBudget
        );
        
        if (suitable.length === 0) break;
        
        const selectedMonster = suitable[Math.floor(Math.random() * suitable.length)];
        const cost = this.getMonsterCost(selectedMonster.cr);
        const maxCount = Math.floor(remainingBudget / cost);
        const count = Math.min(maxCount, this.getReasonableCount(selectedMonster));
        
        encounter.push({
            ...selectedMonster,
            count: count
        });
        
        remainingBudget -= cost * count;
    }
    
    return encounter;
}
```

## Environmental Challenges
```javascript
environments: {
    dungeon: {
        name: 'Underground Dungeon',
        hazards: ['pit_trap', 'poison_gas', 'cave_in', 'flooding'],
        lighting: 'dark',
        acoustics: 'echoing',
        typical_monsters: ['undead', 'aberrations', 'constructs'],
        movement_modifiers: { climb: 'difficult', swim: 'none' }
    },
    wilderness: {
        name: 'Wilderness',
        hazards: ['weather', 'difficult_terrain', 'getting_lost', 'animal_encounters'],
        lighting: 'natural',
        acoustics: 'normal',
        typical_monsters: ['animals', 'fey', 'plants'],
        movement_modifiers: { track: 'available', forage: 'available' }
    },
    urban: {
        name: 'City Environment',
        hazards: ['crowd_control', 'property_damage', 'authority_response'],
        lighting: 'variable',
        acoustics: 'noisy',
        typical_monsters: ['humanoids', 'undead', 'constructs'],
        movement_modifiers: { hide: 'easy', gather_info: 'available' }
    }
},

generateEnvironmentalChallenge(environment, party) {
    const envData = this.environments[environment];
    const challenge = {
        type: 'environmental',
        name: this.selectRandomHazard(envData.hazards),
        difficulty: this.calculateEnvironmentalDC(party),
        consequences: this.generateConsequences(),
        solutions: this.generateSolutions(party)
    };
    
    return challenge;
}
```

## NPC Generation System
```javascript
class NPCGenerator {
    generateNPC(role = 'random', level = 1) {
        const npc = {
            name: this.generateName(),
            race: this.selectRace(),
            class: role === 'random' ? this.selectClass() : role,
            level: level,
            abilities: this.generateAbilities(),
            personality: this.generatePersonality(),
            motivation: this.generateMotivation(),
            relationship: this.generateRelationship(),
            secrets: this.generateSecrets()
        };
        
        // Generate stats based on class and level
        npc.stats = this.calculateNPCStats(npc);
        npc.equipment = this.generateNPCEquipment(npc);
        npc.spells = this.generateNPCSpells(npc);
        
        return npc;
    },
    
    generatePersonality() {
        const traits = [
            'brave', 'cowardly', 'honest', 'deceptive', 'generous', 'greedy',
            'patient', 'impulsive', 'calm', 'hot-tempered', 'optimistic', 'pessimistic'
        ];
        
        return {
            primary: this.selectRandom(traits),
            secondary: this.selectRandom(traits.filter(t => t !== traits[0])),
            quirk: this.generateQuirk(),
            speech_pattern: this.generateSpeechPattern()
        };
    }
}
```

## Treasure Generation
```javascript
class TreasureGenerator {
    generateTreasure(encounterLevel, partySize) {
        const treasureBudget = this.getTreasureBudget(encounterLevel, partySize);
        
        const treasure = {
            coins: this.generateCoins(treasureBudget * 0.3),
            gems: this.generateGems(treasureBudget * 0.2),
            art: this.generateArtObjects(treasureBudget * 0.2),
            magic_items: this.generateMagicItems(treasureBudget * 0.3),
            total_value: treasureBudget
        };
        
        return treasure;
    },
    
    getTreasureBudget(encounterLevel, partySize) {
        // D&D 3.5 treasure per encounter guidelines
        const baseTreasure = {
            1: 300, 2: 600, 3: 900, 4: 1200, 5: 1600,
            6: 2000, 7: 2600, 8: 3400, 9: 4500, 10: 5800,
            11: 7500, 12: 9800, 13: 13000, 14: 17000, 15: 22000,
            16: 28000, 17: 36000, 18: 47000, 19: 61000, 20: 80000
        };
        
        const baseValue = baseTreasure[Math.min(encounterLevel, 20)] || 80000;
        return Math.round(baseValue * (partySize / 4));
    }
}
```

## Narrative Flow Management
```javascript
class NarrativeEngine {
    constructor() {
        this.storyBeats = this.initializeStoryBeats();
        this.plotHooks = this.initializePlotHooks();
        this.consequences = new ConsequenceTracker();
    }
    
    generateAdventureOutline(theme, length = 'short') {
        const structure = {
            short: ['hook', 'challenge1', 'climax', 'resolution'],
            medium: ['hook', 'challenge1', 'development', 'challenge2', 'climax', 'resolution'],
            long: ['hook', 'act1_challenge', 'plot_twist', 'act2_challenge', 
                  'dark_moment', 'final_challenge', 'climax', 'resolution']
        };
        
        const outline = structure[length].map(beat => ({
            type: beat,
            description: this.generateBeatDescription(beat, theme),
            encounters: this.suggestEncounters(beat, theme),
            npcs: this.suggestNPCs(beat),
            locations: this.suggestLocations(beat, theme)
        }));
        
        return outline;
    },
    
    trackConsequences(decision, outcome) {
        this.consequences.addDecision(decision, outcome);
        return this.consequences.getPotentialFutureEvents();
    }
}
```

## Adventure Session Management
```javascript
startAdventure(adventureTemplate) {
    this.currentAdventure = {
        ...adventureTemplate,
        sessionNumber: 1,
        currentScene: 0,
        partyStatus: this.analyzeParty(),
        narrative_state: 'introduction',
        active_npcs: [],
        environment_state: {},
        time_tracking: {
            game_time: 0, // In-game minutes
            real_time: Date.now()
        }
    };
    
    return this.currentAdventure;
},

advanceNarrative(playerActions, outcomes) {
    // Update story state based on player actions
    this.updateNarrativeState(playerActions);
    
    // Generate consequences and future plot threads
    const consequences = this.narrativeEngine.trackConsequences(playerActions, outcomes);
    
    // Suggest next encounters or scenes
    const nextScene = this.generateNextScene();
    
    return {
        narrative_update: consequences,
        suggested_scenes: nextScene,
        updated_npcs: this.updateNPCRelationships(playerActions),
        environmental_changes: this.updateEnvironment(outcomes)
    };
}
```

## Integration Requirements
- Real-time encounter balancing based on party performance
- Seamless integration with Character Manager for party analysis
- Save/load functionality for ongoing campaigns
- Export encounters for virtual tabletop systems
- Mobile-responsive interface for DM tools
- Performance optimization for complex encounter generation

## Testing Requirements
- Unit tests for encounter balance calculations
- Integration tests with character system
- Performance tests for large adventure generation
- Balance validation against official D&D 3.5 guidelines
- User experience testing for DM workflow efficiency
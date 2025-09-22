/**
 * Complete Adventure Engine for RulzLawyer D&D 3.5 Game
 * Handles encounter generation, NPC creation, quest hooks, environmental challenges, and treasure distribution
 */

class AdventureEngine {
    constructor() {
        this.encounterCR = this.initializeEncounterCR();
        this.npcTemplates = this.initializeNPCTemplates();
        this.questHooks = this.initializeQuestHooks();
        this.environments = this.initializeEnvironments();
        this.treasureTables = this.initializeTreasureTables();
        this.storyTemplates = this.initializeStoryTemplates();
        
        console.log('🏰 Complete Adventure Engine initialized');
    }

    // Encounter Generation System
    generateBalancedEncounter(partyLevel, partySize = 4, difficulty = 'moderate') {
        try {
            const targetCR = this.calculateTargetCR(partyLevel, partySize, difficulty);
            const environment = this.getRandomElement(this.environments);
            const encounterType = this.determineEncounterType();
            
            let encounter;
            
            switch (encounterType) {
                case 'combat':
                    encounter = this.generateCombatEncounter(targetCR, environment);
                    break;
                case 'social':
                    encounter = this.generateSocialEncounter(partyLevel, environment);
                    break;
                case 'exploration':
                    encounter = this.generateExplorationEncounter(partyLevel, environment);
                    break;
                case 'puzzle':
                    encounter = this.generatePuzzleEncounter(partyLevel, environment);
                    break;
                default:
                    encounter = this.generateCombatEncounter(targetCR, environment);
            }
            
            encounter.metadata = {
                targetCR: targetCR,
                partyLevel: partyLevel,
                partySize: partySize,
                difficulty: difficulty,
                environment: environment.name,
                type: encounterType
            };
            
            return {
                success: true,
                encounter: encounter
            };
            
        } catch (error) {
            console.error('❌ Error generating encounter:', error);
            return { success: false, error: error.message };
        }
    }

    generateCombatEncounter(targetCR, environment) {
        const creatures = this.selectCreatures(targetCR, environment);
        const tactics = this.generateTactics(creatures, environment);
        const terrain = this.generateTerrain(environment);
        
        return {
            type: 'combat',
            title: `${environment.name} Battle`,
            description: `A ${environment.description} encounter featuring ${creatures.length} hostile creature(s).`,
            creatures: creatures,
            tactics: tactics,
            terrain: terrain,
            environment: environment,
            rewards: this.generateRewards(targetCR),
            scalingOptions: this.generateScalingOptions(creatures)
        };
    }

    generateSocialEncounter(partyLevel, environment) {
        const npc = this.generateNPC(partyLevel, environment);
        const socialChallenge = this.generateSocialChallenge(partyLevel);
        
        return {
            type: 'social',
            title: `Meeting with ${npc.name}`,
            description: `A social encounter in ${environment.name} involving negotiation, diplomacy, or intrigue.`,
            npc: npc,
            challenge: socialChallenge,
            environment: environment,
            outcomes: this.generateSocialOutcomes(),
            skillChecks: this.generateSocialSkillChecks(partyLevel)
        };
    }

    generateExplorationEncounter(partyLevel, environment) {
        const challenge = this.generateExplorationChallenge(environment);
        const hazards = this.generateEnvironmentalHazards(environment, partyLevel);
        
        return {
            type: 'exploration',
            title: `Exploring ${environment.name}`,
            description: `An exploration challenge in ${environment.description}.`,
            challenge: challenge,
            hazards: hazards,
            environment: environment,
            discoveries: this.generateDiscoveries(partyLevel),
            skillChecks: this.generateExplorationSkillChecks(partyLevel)
        };
    }

    generatePuzzleEncounter(partyLevel, environment) {
        const puzzle = this.generatePuzzle(partyLevel, environment);
        
        return {
            type: 'puzzle',
            title: puzzle.title,
            description: puzzle.description,
            puzzle: puzzle,
            environment: environment,
            hints: puzzle.hints,
            solution: puzzle.solution,
            rewards: this.generateRewards(partyLevel)
        };
    }

    // NPC Generation System
    generateNPC(level = 1, environment = null) {
        const template = this.getRandomElement(this.npcTemplates);
        const race = this.getRandomElement(['Human', 'Elf', 'Dwarf', 'Halfling', 'Half-Elf', 'Half-Orc', 'Gnome']);
        const characterClass = this.getRandomElement(['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Bard', 'Barbarian', 'Sorcerer', 'Paladin', 'Druid']);
        
        const npc = {
            name: this.generateNPCName(race),
            race: race,
            class: characterClass,
            level: level,
            role: template.role,
            personality: this.generatePersonality(),
            appearance: this.generateAppearance(race),
            background: this.generateBackground(),
            motivations: this.generateMotivations(),
            secrets: this.generateSecrets(),
            relationships: this.generateRelationships(),
            equipment: this.generateNPCEquipment(level, characterClass),
            stats: this.generateNPCStats(level, characterClass),
            skills: this.generateNPCSkills(level, characterClass),
            spells: characterClass.includes('Wizard') || characterClass.includes('Sorcerer') || characterClass.includes('Cleric') || characterClass.includes('Druid') ? this.generateNPCSpells(level, characterClass) : null
        };
        
        if (environment) {
            npc.environmentalTies = this.generateEnvironmentalTies(environment);
        }
        
        return npc;
    }

    generatePersonality() {
        const traits = [
            'Ambitious', 'Cautious', 'Cheerful', 'Cynical', 'Determined', 'Eccentric',
            'Friendly', 'Grumpy', 'Honest', 'Impulsive', 'Jealous', 'Kind',
            'Lazy', 'Mysterious', 'Noble', 'Optimistic', 'Paranoid', 'Quiet',
            'Reckless', 'Secretive', 'Trustworthy', 'Unpredictable', 'Vain', 'Wise'
        ];
        
        return {
            primaryTrait: this.getRandomElement(traits),
            secondaryTrait: this.getRandomElement(traits.filter(t => t !== traits[0])),
            quirk: this.generateQuirk(),
            speech: this.generateSpeechPattern(),
            mannerisms: this.generateMannerisms()
        };
    }

    // Quest Generation System
    generateQuest(level = 1, questType = 'random') {
        const hookTemplate = this.getRandomElement(this.questHooks);
        const questStructure = this.generateQuestStructure(level, questType);
        
        const quest = {
            title: this.generateQuestTitle(hookTemplate),
            description: this.generateQuestDescription(hookTemplate),
            questGiver: this.generateNPC(level),
            objectives: this.generateObjectives(level, questType),
            locations: this.generateQuestLocations(),
            encounters: this.generateQuestEncounters(level),
            rewards: this.generateQuestRewards(level),
            complications: this.generateComplications(),
            timeLimit: this.generateTimeLimit(),
            level: level,
            type: questType,
            structure: questStructure
        };
        
        return quest;
    }

    generateQuestStructure(level, questType) {
        const structures = {
            linear: ['Introduction', 'Investigation', 'Confrontation', 'Resolution'],
            branching: ['Setup', 'Choice Point', 'Path A/B', 'Convergence', 'Climax'],
            sandbox: ['Situation', 'Multiple Objectives', 'Player Choice', 'Consequences'],
            mystery: ['Hook', 'Clues', 'Red Herrings', 'Revelation', 'Resolution']
        };
        
        return structures[questType] || structures.linear;
    }

    // Treasure Generation System
    generateTreasure(encounterLevel, treasureType = 'standard') {
        const treasureData = this.treasureTables[encounterLevel] || this.treasureTables[1];
        
        const treasure = {
            coins: this.generateCoins(encounterLevel),
            gems: this.generateGems(encounterLevel),
            art: this.generateArtObjects(encounterLevel),
            magicItems: this.generateMagicItems(encounterLevel, treasureType),
            mundaneItems: this.generateMundaneItems(encounterLevel)
        };
        
        treasure.totalValue = this.calculateTreasureValue(treasure);
        
        return treasure;
    }

    generateMagicItems(level, treasureType) {
        const magicItems = [];
        const itemCount = this.determineMagicItemCount(level, treasureType);
        
        for (let i = 0; i < itemCount; i++) {
            const itemType = this.getRandomElement(['weapon', 'armor', 'wondrous', 'potion', 'scroll', 'ring', 'wand', 'rod', 'staff']);
            const item = this.generateMagicItem(itemType, level);
            magicItems.push(item);
        }
        
        return magicItems;
    }

    // Environmental Challenge System
    generateEnvironmentalHazards(environment, level) {
        const hazards = [];
        const hazardTypes = environment.hazards || ['natural', 'magical', 'constructed'];
        
        hazardTypes.forEach(type => {
            if (Math.random() < 0.4) { // 40% chance for each hazard type
                const hazard = this.generateHazard(type, level, environment);
                hazards.push(hazard);
            }
        });
        
        return hazards;
    }

    generateHazard(type, level, environment) {
        const hazardTemplates = {
            natural: [
                { name: 'Unstable Ground', dc: 10 + level, damage: '1d6', type: 'Reflex' },
                { name: 'Extreme Weather', dc: 12 + level, damage: '1d4', type: 'Fortitude' },
                { name: 'Difficult Terrain', dc: 15, damage: 'none', type: 'Move' }
            ],
            magical: [
                { name: 'Wild Magic Zone', dc: 15 + level, damage: 'special', type: 'Will' },
                { name: 'Antimagic Field', dc: 20, damage: 'none', type: 'Special' },
                { name: 'Teleportation Trap', dc: 18 + level, damage: 'transport', type: 'Will' }
            ],
            constructed: [
                { name: 'Pressure Plate', dc: 15 + level, damage: '2d6', type: 'Reflex' },
                { name: 'Poison Gas', dc: 12 + level, damage: '1d4 Con', type: 'Fortitude' },
                { name: 'Blade Trap', dc: 18 + level, damage: '3d6', type: 'Reflex' }
            ]
        };
        
        const template = this.getRandomElement(hazardTemplates[type]);
        
        return {
            ...template,
            environment: environment.name,
            description: this.generateHazardDescription(template, environment),
            detection: this.generateDetectionInfo(template),
            disarm: this.generateDisarmInfo(template)
        };
    }

    // Story Template System
    generateStoryArc(length = 'medium') {
        const template = this.getRandomElement(this.storyTemplates);
        const arcLengths = {
            short: 3,
            medium: 5,
            long: 8,
            epic: 12
        };
        
        const sessionCount = arcLengths[length];
        const arc = {
            title: template.title,
            theme: template.theme,
            premise: template.premise,
            sessions: [],
            npcs: [],
            locations: [],
            overarchingPlot: template.plot
        };
        
        for (let i = 0; i < sessionCount; i++) {
            const session = this.generateSession(i + 1, sessionCount, template);
            arc.sessions.push(session);
        }
        
        return arc;
    }

    // Utility Methods
    calculateTargetCR(partyLevel, partySize, difficulty) {
        const baseCR = partyLevel;
        const sizeModifier = (partySize - 4) * 0.5;
        const difficultyModifiers = {
            easy: -1,
            moderate: 0,
            hard: 1,
            deadly: 2
        };
        
        return Math.max(1, baseCR + sizeModifier + (difficultyModifiers[difficulty] || 0));
    }

    selectCreatures(targetCR, environment) {
        // This would integrate with a creature database
        const creatureTypes = environment.creatures || ['humanoid', 'beast', 'undead'];
        const creatures = [];
        
        // For now, return placeholder creature data
        const creatureCount = Math.max(1, Math.floor(targetCR / 2) + 1);
        
        for (let i = 0; i < creatureCount; i++) {
            creatures.push({
                name: `${environment.name} Guardian`,
                cr: Math.max(1, Math.floor(targetCR / creatureCount)),
                type: this.getRandomElement(creatureTypes),
                hp: 20 + (targetCR * 5),
                ac: 12 + Math.floor(targetCR / 2),
                attacks: this.generateCreatureAttacks(targetCR)
            });
        }
        
        return creatures;
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Initialize Data Methods
    initializeEncounterCR() {
        return {
            1: { easy: 0.5, moderate: 1, hard: 1.5, deadly: 2 },
            2: { easy: 1, moderate: 1.5, hard: 2, deadly: 3 },
            3: { easy: 1.5, moderate: 2, hard: 3, deadly: 4 },
            4: { easy: 2, moderate: 3, hard: 4, deadly: 5 },
            5: { easy: 3, moderate: 4, hard: 5, deadly: 7 }
        };
    }

    initializeNPCTemplates() {
        return [
            { role: 'merchant', personality: ['greedy', 'friendly'], motivation: 'profit' },
            { role: 'guard', personality: ['dutiful', 'suspicious'], motivation: 'order' },
            { role: 'noble', personality: ['arrogant', 'influential'], motivation: 'power' },
            { role: 'scholar', personality: ['curious', 'knowledgeable'], motivation: 'knowledge' },
            { role: 'criminal', personality: ['cunning', 'untrustworthy'], motivation: 'survival' },
            { role: 'priest', personality: ['devout', 'helpful'], motivation: 'faith' },
            { role: 'warrior', personality: ['brave', 'honorable'], motivation: 'glory' },
            { role: 'rogue', personality: ['sneaky', 'independent'], motivation: 'freedom' }
        ];
    }

    initializeQuestHooks() {
        return [
            { type: 'rescue', template: 'Someone important has been kidnapped', complexity: 'medium' },
            { type: 'retrieve', template: 'A valuable item has been lost or stolen', complexity: 'low' },
            { type: 'explore', template: 'Ancient ruins have been discovered', complexity: 'high' },
            { type: 'protect', template: 'A location or person needs defending', complexity: 'medium' },
            { type: 'investigate', template: 'Strange events require investigation', complexity: 'high' },
            { type: 'deliver', template: 'An important message or item needs delivery', complexity: 'low' },
            { type: 'eliminate', template: 'A dangerous threat must be stopped', complexity: 'high' },
            { type: 'negotiate', template: 'Rival factions need mediation', complexity: 'medium' }
        ];
    }

    initializeEnvironments() {
        return [
            { 
                name: 'Forest', 
                description: 'a dense woodland environment',
                creatures: ['beast', 'fey', 'plant'],
                hazards: ['natural'],
                features: ['thick undergrowth', 'ancient trees', 'hidden paths']
            },
            { 
                name: 'Dungeon', 
                description: 'an underground complex of rooms and corridors',
                creatures: ['undead', 'aberration', 'construct'],
                hazards: ['constructed', 'magical'],
                features: ['narrow corridors', 'stone walls', 'hidden doors']
            },
            { 
                name: 'Mountain', 
                description: 'a treacherous mountainous region',
                creatures: ['dragon', 'giant', 'elemental'],
                hazards: ['natural'],
                features: ['steep cliffs', 'rocky terrain', 'thin air']
            },
            { 
                name: 'Swamp', 
                description: 'a murky wetland environment',
                creatures: ['undead', 'beast', 'plant'],
                hazards: ['natural'],
                features: ['thick mud', 'poisonous gas', 'treacherous footing']
            },
            { 
                name: 'City', 
                description: 'a bustling urban environment',
                creatures: ['humanoid', 'construct'],
                hazards: ['constructed'],
                features: ['crowded streets', 'tall buildings', 'busy markets']
            }
        ];
    }

    initializeTreasureTables() {
        return {
            1: { coins: '2d6', gems: 10, art: 5, magic: 15 },
            2: { coins: '3d6', gems: 15, art: 10, magic: 20 },
            3: { coins: '4d6', gems: 20, art: 15, magic: 25 },
            4: { coins: '5d6', gems: 25, art: 20, magic: 30 },
            5: { coins: '6d6', gems: 30, art: 25, magic: 35 }
        };
    }

    initializeStoryTemplates() {
        return [
            {
                title: 'The Lost Heir',
                theme: 'inheritance',
                premise: 'A rightful heir must reclaim their birthright',
                plot: ['discovery', 'journey', 'trials', 'confrontation', 'restoration']
            },
            {
                title: 'The Ancient Evil',
                theme: 'good vs evil',
                premise: 'An ancient evil awakens and threatens the world',
                plot: ['awakening', 'investigation', 'preparation', 'battle', 'sealing']
            },
            {
                title: 'The Political Intrigue',
                theme: 'politics',
                premise: 'Court politics and schemes threaten the kingdom',
                plot: ['introduction', 'discovery', 'investigation', 'revelation', 'resolution']
            }
        ];
    }

    // Additional helper methods would go here...
    determineEncounterType() {
        const types = ['combat', 'social', 'exploration', 'puzzle'];
        const weights = [50, 20, 20, 10]; // Combat more likely
        
        const random = Math.random() * 100;
        let cumulative = 0;
        
        for (let i = 0; i < types.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) {
                return types[i];
            }
        }
        
        return 'combat';
    }

    generateTactics(creatures, environment) {
        return {
            setup: `Creatures use ${environment.name} features for cover`,
            combatRounds: [
                'Round 1: Ranged attacks from concealment',
                'Round 2: Advance while maintaining cover',
                'Round 3+: Focus fire on weakest targets'
            ],
            retreat: 'Creatures flee when reduced to 25% HP'
        };
    }

    generateTerrain(environment) {
        return {
            type: environment.name,
            features: environment.features,
            visibility: 'Normal',
            movement: 'Standard',
            cover: 'Partial cover available'
        };
    }

    generateRewards(cr) {
        return {
            experience: cr * 100,
            treasure: this.generateTreasure(cr),
            story: 'Progress in main quest'
        };
    }

    generateScalingOptions(creatures) {
        return {
            easier: 'Remove one creature or reduce HP by 25%',
            harder: 'Add one creature or increase damage by 50%',
            much_harder: 'Double creature count or add environmental hazards'
        };
    }

    generateNPCName(race) {
        const nameLibrary = {
            Human: ['Aidan', 'Brenna', 'Connor', 'Deirdre', 'Eamon', 'Fiona'],
            Elf: ['Aerdrie', 'Berrian', 'Carric', 'Dayereth', 'Enna', 'Galinndan'],
            Dwarf: ['Adrik', 'Baern', 'Darrak', 'Eberk', 'Fargrim', 'Gardain'],
            Halfling: ['Ander', 'Bernie', 'Corrin', 'Danniel', 'Egart', 'Finnan'],
            'Half-Elf': ['Aerdrie', 'Berrian', 'Connor', 'Deirdre', 'Enna', 'Fiona'],
            'Half-Orc': ['Gell', 'Henk', 'Holg', 'Imsh', 'Keth', 'Krusk'],
            Gnome: ['Alston', 'Boddynock', 'Brocc', 'Burgell', 'Dimble', 'Eldon']
        };
        
        const names = nameLibrary[race] || nameLibrary.Human;
        return this.getRandomElement(names);
    }

    generateCreatureAttacks(cr) {
        return [
            {
                name: 'Primary Attack',
                bonus: Math.floor(cr / 2) + 3,
                damage: `1d8+${Math.floor(cr / 2)}`,
                type: 'melee'
            }
        ];
    }
}

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdventureEngine;
} else if (typeof window !== 'undefined') {
    window.AdventureEngine = AdventureEngine;
}
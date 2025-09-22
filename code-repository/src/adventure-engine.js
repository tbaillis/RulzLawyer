/**
 * AdventureEngine - AI-Powered D&D 3.5 Adventure Generation System
 * Creates balanced encounters, manages story progression, generates NPCs and treasures
 */

class AdventureEngine {
    constructor() {
        this.campaigns = {};
        this.encounters = {};
        this.npcs = {};
        this.treasures = {};
        this.storyNodes = {};
        this.initialize();
    }

    initialize() {
        this.setupEncounterTemplates();
        this.setupNPCTemplates();
        this.setupTreasureTemplates();
        this.setupStoryTemplates();
        console.log('🏰 AdventureEngine initialized successfully');
    }

    // ==================== ENCOUNTER GENERATION ====================

    setupEncounterTemplates() {
        this.encounterTemplates = {
            combat: {
                'goblin_ambush': {
                    name: 'Goblin Ambush',
                    description: 'A group of goblins attacks from the shadows',
                    environment: ['forest', 'hills', 'ruins'],
                    challengeRating: 2,
                    creatures: [
                        { name: 'Goblin Warrior', count: '2d4', cr: 0.33 },
                        { name: 'Goblin Leader', count: 1, cr: 1 }
                    ],
                    tactics: 'Goblins use cover and ranged attacks initially, then charge when enemies close',
                    treasure: 'minor'
                },
                'orc_patrol': {
                    name: 'Orc Patrol',
                    description: 'A scouting patrol of orcs on their territory',
                    environment: ['mountains', 'wilderness', 'borderlands'],
                    challengeRating: 4,
                    creatures: [
                        { name: 'Orc Warrior', count: '1d4+2', cr: 1 },
                        { name: 'Orc Sergeant', count: 1, cr: 2 }
                    ],
                    tactics: 'Orcs fight aggressively with coordinated attacks',
                    treasure: 'moderate'
                },
                'undead_guardians': {
                    name: 'Undead Guardians',
                    description: 'Ancient skeletons rise to protect their tomb',
                    environment: ['tomb', 'ruins', 'cemetery'],
                    challengeRating: 3,
                    creatures: [
                        { name: 'Skeleton Warrior', count: '2d3', cr: 0.5 },
                        { name: 'Skeleton Champion', count: 1, cr: 2 }
                    ],
                    tactics: 'Skeletons form defensive formations and fight until destroyed',
                    treasure: 'tomb_goods'
                },
                'owlbear_encounter': {
                    name: 'Territorial Owlbear',
                    description: 'A fierce owlbear defends its territory',
                    environment: ['forest', 'hills', 'wilderness'],
                    challengeRating: 5,
                    creatures: [
                        { name: 'Owlbear', count: 1, cr: 5 }
                    ],
                    tactics: 'The owlbear charges and uses powerful claw attacks',
                    treasure: 'none'
                }
            },
            social: {
                'merchant_caravan': {
                    name: 'Merchant Caravan',
                    description: 'A traveling merchant seeks protection or information',
                    environment: ['road', 'town', 'crossroads'],
                    challengeRating: 0,
                    npcs: [
                        { name: 'Merchant', role: 'trader', attitude: 'friendly' },
                        { name: 'Caravan Guard', role: 'protector', attitude: 'cautious' }
                    ],
                    outcomes: ['trade', 'information', 'job_offer', 'warning'],
                    treasure: 'trade_goods'
                },
                'village_elder': {
                    name: 'Village Council',
                    description: 'Local leaders seek help with a community problem',
                    environment: ['village', 'town', 'settlement'],
                    challengeRating: 0,
                    npcs: [
                        { name: 'Village Elder', role: 'leader', attitude: 'concerned' },
                        { name: 'Village Guard Captain', role: 'protector', attitude: 'suspicious' }
                    ],
                    outcomes: ['quest_offer', 'information', 'warning', 'assistance'],
                    treasure: 'reward_promise'
                }
            },
            exploration: {
                'ancient_ruins': {
                    name: 'Ancient Ruins',
                    description: 'Crumbling structures hide secrets and dangers',
                    environment: ['ruins', 'forest', 'desert'],
                    challengeRating: 3,
                    features: ['hidden_passage', 'trapped_door', 'ancient_inscription', 'magical_ward'],
                    challenges: ['perception', 'investigation', 'disable_device', 'knowledge'],
                    treasure: 'ancient_artifact'
                },
                'mysterious_cave': {
                    name: 'Mysterious Cave',
                    description: 'A cave system with unknown depths',
                    environment: ['hills', 'mountains', 'coastline'],
                    challengeRating: 2,
                    features: ['underground_river', 'crystal_formation', 'cave_painting', 'narrow_passage'],
                    challenges: ['survival', 'climb', 'navigation', 'perception'],
                    treasure: 'natural_resources'
                }
            },
            puzzle: {
                'riddle_door': {
                    name: 'The Riddle Door',
                    description: 'An ancient door that opens only to those who solve its riddle',
                    environment: ['dungeon', 'ruins', 'tower'],
                    challengeRating: 1,
                    riddle: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
                    answer: 'A map',
                    hint: 'Look for cartographic clues in the chamber',
                    failure: 'trap_activation',
                    success: 'hidden_passage'
                },
                'elemental_locks': {
                    name: 'Elemental Combination',
                    description: 'Four elemental symbols must be activated in the correct order',
                    environment: ['dungeon', 'tower', 'temple'],
                    challengeRating: 2,
                    elements: ['fire', 'water', 'earth', 'air'],
                    solution: 'The order of the seasons: Earth (spring), Fire (summer), Air (autumn), Water (winter)',
                    hints: ['seasonal murals', 'weather patterns', 'agricultural cycle'],
                    failure: 'elemental_damage',
                    success: 'treasure_chamber'
                }
            }
        };
    }

    // ==================== NPC GENERATION ====================

    setupNPCTemplates() {
        this.npcTemplates = {
            personalities: [
                'cheerful and optimistic', 'gruff but kind-hearted', 'mysterious and secretive',
                'nervous and twitchy', 'proud and arrogant', 'wise and patient',
                'greedy and calculating', 'brave and loyal', 'cynical and bitter',
                'eccentric and unpredictable', 'calm and methodical', 'passionate and intense'
            ],
            occupations: [
                'blacksmith', 'tavern keeper', 'merchant', 'scholar', 'guard captain',
                'farmer', 'priest', 'hunter', 'craftsman', 'noble', 'hermit',
                'entertainer', 'healer', 'guide', 'sage', 'criminal', 'soldier'
            ],
            motivations: [
                'protect family', 'gain wealth', 'seek knowledge', 'find redemption',
                'achieve fame', 'serve their god', 'preserve tradition', 'seek revenge',
                'find love', 'gain power', 'help others', 'survive', 'prove worth'
            ],
            secrets: [
                'is actually nobility in hiding', 'owes a large debt to criminals',
                'knows the location of a treasure', 'is secretly a spellcaster',
                'has a bounty on their head', 'is related to someone important',
                'witnessed a crime', 'possesses stolen goods', 'is cursed',
                'serves a hidden master', 'knows about an impending threat'
            ]
        };
    }

    generateNPC(role = 'random', environment = 'any') {
        const npcId = 'npc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const personality = this.getRandomElement(this.npcTemplates.personalities);
        const occupation = this.getRandomElement(this.npcTemplates.occupations);
        const motivation = this.getRandomElement(this.npcTemplates.motivations);
        const secret = this.getRandomElement(this.npcTemplates.secrets);
        
        const npc = {
            id: npcId,
            name: this.generateNPCName(),
            personality: personality,
            occupation: occupation,
            motivation: motivation,
            secret: secret,
            appearance: this.generateAppearance(),
            speechPattern: this.generateSpeechPattern(),
            environment: environment,
            role: role,
            relationshipToParty: 'neutral',
            questsOffered: [],
            inventory: this.generateNPCInventory(occupation),
            stats: this.generateNPCStats(occupation)
        };
        
        this.npcs[npcId] = npc;
        return npc;
    }

    generateNPCName() {
        const firstNames = [
            'Alaric', 'Brenna', 'Cedric', 'Dara', 'Ewan', 'Freya', 'Gareth', 'Helena',
            'Ivor', 'Jenna', 'Kael', 'Lyra', 'Magnus', 'Nora', 'Owen', 'Petra',
            'Quinton', 'Rhea', 'Soren', 'Thea', 'Ulric', 'Vera', 'Willem', 'Xara'
        ];
        const lastNames = [
            'Ironforge', 'Goldleaf', 'Stormwind', 'Shadowmere', 'Brightblade', 'Darkstone',
            'Swiftarrow', 'Moonwhisper', 'Flamebeard', 'Frostborn', 'Earthshaker', 'Starweaver',
            'Thornfield', 'Silverstream', 'Blackwood', 'Redmane', 'Whitehawk', 'Greycloak'
        ];
        
        return this.getRandomElement(firstNames) + ' ' + this.getRandomElement(lastNames);
    }

    generateAppearance() {
        const build = this.getRandomElement(['tall and lanky', 'short and stocky', 'average height', 'imposing and broad', 'petite and quick']);
        const hair = this.getRandomElement(['black hair', 'brown hair', 'blonde hair', 'red hair', 'gray hair', 'white hair', 'bald']);
        const eyes = this.getRandomElement(['brown eyes', 'blue eyes', 'green eyes', 'hazel eyes', 'gray eyes', 'amber eyes']);
        const feature = this.getRandomElement(['scarred hands', 'missing tooth', 'distinctive birthmark', 'ornate jewelry', 'weathered face', 'callused hands']);
        
        return `${build} with ${hair} and ${eyes}, notable for ${feature}`;
    }

    generateSpeechPattern() {
        return this.getRandomElement([
            'speaks with a thick accent',
            'uses complex, flowery language',
            'speaks in short, clipped sentences',
            'frequently quotes old sayings',
            'has a stutter when nervous',
            'speaks very loudly',
            'whispers conspiratorially',
            'uses sailor\'s language',
            'speaks formally and precisely',
            'uses outdated expressions'
        ]);
    }

    // ==================== TREASURE GENERATION ====================

    setupTreasureTemplates() {
        this.treasureTemplates = {
            minor: {
                coins: { copper: '3d6', silver: '2d6', gold: '1d4' },
                items: ['potion of cure light wounds', 'silvered dagger', 'masterwork tool', 'semi-precious gem']
            },
            moderate: {
                coins: { silver: '3d10', gold: '2d8', platinum: '1d4' },
                items: ['magic weapon +1', 'potion of bull\'s strength', 'cloak of resistance +1', 'pearl of power 1st level']
            },
            major: {
                coins: { gold: '5d10', platinum: '2d10' },
                items: ['magic armor +2', 'ring of protection +2', 'staff of healing', 'bag of holding type I']
            },
            ancient_artifact: {
                coins: { gold: '10d10', platinum: '5d10' },
                items: ['ancient magic weapon', 'artifact fragment', 'spellbook (rare spells)', 'crown of ancient kings']
            }
        };
    }

    generateTreasure(type = 'minor', encounterCR = 1) {
        const template = this.treasureTemplates[type];
        if (!template) return { coins: {}, items: [] };
        
        const treasure = {
            coins: {},
            items: [],
            totalValue: 0
        };
        
        // Generate coins
        for (const [coinType, diceExpression] of Object.entries(template.coins)) {
            treasure.coins[coinType] = this.rollDice(diceExpression);
        }
        
        // Calculate coin values for total
        const coinValues = { copper: 0.01, silver: 0.1, gold: 1, platinum: 10 };
        for (const [coinType, amount] of Object.entries(treasure.coins)) {
            treasure.totalValue += amount * coinValues[coinType];
        }
        
        // Generate items
        const itemCount = Math.min(template.items.length, Math.max(1, Math.floor(encounterCR / 2)));
        for (let i = 0; i < itemCount; i++) {
            const item = this.getRandomElement(template.items);
            treasure.items.push(item);
        }
        
        return treasure;
    }

    setupStoryTemplates() {
        // Initialize story and campaign templates
        this.storyTemplates = {
            plotHooks: [
                {
                    title: "The Missing Merchant",
                    description: "A local merchant hasn't returned from their regular trade route. Their family offers a reward for information.",
                    urgency: "medium",
                    reward: "50 gp + merchant connections"
                },
                {
                    title: "Ancient Ruins Discovered",
                    description: "Construction workers have uncovered old stone structures. Strange sounds echo from within at night.",
                    urgency: "low",
                    reward: "Historical artifacts + exploration XP"
                },
                {
                    title: "Bandits on the Road",
                    description: "Travelers report increased bandit activity on the main trade routes. The local militia is overwhelmed.",
                    urgency: "high",
                    reward: "100 gp bounty + community standing"
                },
                {
                    title: "The Cursed Well",
                    description: "The town's water source has been tainted. Locals suspect supernatural interference.",
                    urgency: "high",
                    reward: "Town's gratitude + clerical blessing"
                },
                {
                    title: "Noble's Secret Mission",
                    description: "A local noble seeks discrete adventurers for a sensitive task they cannot entrust to their regular guards.",
                    urgency: "medium",
                    reward: "200 gp + noble patronage"
                }
            ],
            campaignThemes: [
                {
                    name: "Classic Fantasy Adventure",
                    description: "Traditional D&D themes with dungeons, dragons, and heroic quests",
                    elements: ["ancient magic", "forgotten kingdoms", "heroic sacrifice"]
                },
                {
                    name: "Political Intrigue",
                    description: "Court politics, espionage, and power struggles between factions",
                    elements: ["noble houses", "secret alliances", "information warfare"]
                },
                {
                    name: "Dark Mystery",
                    description: "Investigation, horror elements, and uncovering hidden truths",
                    elements: ["supernatural threats", "hidden cults", "forbidden knowledge"]
                }
            ]
        };

        console.log('📖 Story templates initialized');
    }

    // ==================== ENCOUNTER BALANCING ====================

    generateBalancedEncounter(partyLevel, partySize, encounterType = 'combat', environment = 'any') {
        const encounterId = 'encounter_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const targetCR = this.calculateTargetCR(partyLevel, partySize);
        
        let availableTemplates = [];
        if (encounterType === 'any') {
            availableTemplates = Object.values(this.encounterTemplates).flat();
        } else {
            availableTemplates = Object.values(this.encounterTemplates[encounterType] || {});
        }
        
        // Filter by environment if specified
        if (environment !== 'any') {
            availableTemplates = availableTemplates.filter(template => 
                !template.environment || template.environment.includes(environment)
            );
        }
        
        // Find encounters within appropriate CR range
        const suitableTemplates = availableTemplates.filter(template => 
            Math.abs(template.challengeRating - targetCR) <= 1
        );
        
        if (suitableTemplates.length === 0) {
            // Fallback to any available template
            const fallbackTemplate = this.getRandomElement(availableTemplates);
            return this.createEncounterFromTemplate(encounterId, fallbackTemplate, targetCR);
        }
        
        const selectedTemplate = this.getRandomElement(suitableTemplates);
        return this.createEncounterFromTemplate(encounterId, selectedTemplate, targetCR);
    }

    calculateTargetCR(partyLevel, partySize) {
        // D&D 3.5 encounter balancing formula
        let baseCR = partyLevel;
        
        // Adjust for party size
        if (partySize < 4) {
            baseCR -= (4 - partySize);
        } else if (partySize > 4) {
            baseCR += Math.floor((partySize - 4) / 2);
        }
        
        return Math.max(1, baseCR);
    }

    createEncounterFromTemplate(encounterId, template, targetCR) {
        const encounter = {
            id: encounterId,
            name: template.name,
            description: template.description,
            type: this.determineEncounterType(template),
            challengeRating: targetCR,
            environment: template.environment,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Add type-specific content
        if (template.creatures) {
            encounter.creatures = template.creatures.map(creature => ({
                ...creature,
                count: this.rollDice(creature.count.toString())
            }));
            encounter.tactics = template.tactics;
        }
        
        if (template.npcs) {
            encounter.npcs = template.npcs.map(npcTemplate => 
                this.generateNPC(npcTemplate.role, encounter.environment)
            );
        }
        
        if (template.features) {
            encounter.features = this.getRandomElements(template.features, 1, 3);
        }
        
        if (template.challenges) {
            encounter.challenges = template.challenges;
        }
        
        if (template.riddle) {
            encounter.puzzle = {
                riddle: template.riddle,
                answer: template.answer,
                hint: template.hint,
                failure: template.failure,
                success: template.success
            };
        }
        
        // Generate appropriate treasure
        encounter.treasure = this.generateTreasure(template.treasure || 'minor', targetCR);
        
        this.encounters[encounterId] = encounter;
        return encounter;
    }

    determineEncounterType(template) {
        if (template.creatures) return 'combat';
        if (template.npcs) return 'social';
        if (template.features) return 'exploration';
        if (template.riddle) return 'puzzle';
        return 'general';
    }

    // ==================== CAMPAIGN MANAGEMENT ====================

    createCampaign(campaignData) {
        const campaignId = 'campaign_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const campaign = {
            id: campaignId,
            name: campaignData.name || 'New Campaign',
            description: campaignData.description || 'An epic D&D adventure',
            setting: campaignData.setting || 'generic fantasy',
            partyLevel: campaignData.partyLevel || 1,
            partySize: campaignData.partySize || 4,
            currentLocation: campaignData.currentLocation || 'starting village',
            storyProgress: {
                currentChapter: 1,
                plotPoints: [],
                completedQuests: [],
                activeQuests: []
            },
            encounters: {
                completed: [],
                active: [],
                upcoming: []
            },
            npcs: {},
            locations: {},
            timeline: [],
            notes: campaignData.notes || '',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        // Generate initial encounters
        this.generateCampaignStart(campaign);
        
        this.campaigns[campaignId] = campaign;
        return campaign;
    }

    generateCampaignStart(campaign) {
        // Create starting village encounters
        const villageEncounters = [
            this.generateBalancedEncounter(campaign.partyLevel, campaign.partySize, 'social', 'village'),
            this.generateBalancedEncounter(campaign.partyLevel, campaign.partySize, 'exploration', 'village'),
        ];
        
        campaign.encounters.upcoming = villageEncounters.map(e => e.id);
        
        // Generate some early adventure hooks
        const adventureHooks = this.generateAdventureHooks(campaign);
        campaign.storyProgress.plotPoints = adventureHooks;
    }

    generateAdventureHooks(campaign) {
        const hooks = [
            {
                title: 'Missing Merchant',
                description: 'A local merchant has disappeared on the road to the next town. Their goods are needed for an upcoming festival.',
                urgency: 'moderate',
                reward: 'gold and reputation',
                consequences: 'festival canceled, economic hardship'
            },
            {
                title: 'Strange Lights',
                description: 'Mysterious lights have been seen in the old ruins outside town. Locals are frightened and cattle have gone missing.',
                urgency: 'low',
                reward: 'mystery and potential treasure',
                consequences: 'escalating supernatural threat'
            },
            {
                title: 'Bandit Problem',
                description: 'Raiders have been attacking caravans on the main trade route. The town guard is overwhelmed.',
                urgency: 'high',
                reward: 'bounty and gratitude',
                consequences: 'trade route closure, isolation'
            }
        ];
        
        return this.getRandomElements(hooks, 2, 3);
    }

    // ==================== UTILITY METHODS ====================

    rollDice(expression) {
        // Simple dice rolling for treasure and encounter generation
        const match = expression.match(/(\d+)?d(\d+)(?:\+(\d+))?/);
        if (!match) return parseInt(expression) || 0;
        
        const numDice = parseInt(match[1]) || 1;
        const dieSize = parseInt(match[2]);
        const modifier = parseInt(match[3]) || 0;
        
        let total = 0;
        for (let i = 0; i < numDice; i++) {
            total += Math.floor(Math.random() * dieSize) + 1;
        }
        
        return total + modifier;
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomElements(array, min, max) {
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        const shuffled = [...array].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, array.length));
    }

    // ==================== STORY PROGRESSION ====================

    advanceStory(campaignId, action) {
        const campaign = this.campaigns[campaignId];
        if (!campaign) return null;
        
        campaign.timeline.push({
            timestamp: new Date().toISOString(),
            action: action,
            chapter: campaign.storyProgress.currentChapter
        });
        
        campaign.lastUpdated = new Date().toISOString();
        
        // Check if chapter should advance
        if (campaign.timeline.length % 5 === 0) {
            campaign.storyProgress.currentChapter++;
            this.generateNewPlotHooks(campaign);
        }
        
        return campaign;
    }

    generateNewPlotHooks(campaign) {
        const newHooks = this.generateAdventureHooks(campaign);
        campaign.storyProgress.plotPoints.push(...newHooks);
    }

    // ==================== PUBLIC API ====================

    getCampaign(campaignId) {
        return this.campaigns[campaignId];
    }

    getEncounter(encounterId) {
        return this.encounters[encounterId];
    }

    getNPC(npcId) {
        return this.npcs[npcId];
    }

    generateRandomEncounter(partyLevel = 1, partySize = 4, type = 'any', environment = 'any') {
        return this.generateBalancedEncounter(partyLevel, partySize, type, environment);
    }

    generateNPCStats(occupation) {
        // Basic NPC stat generation for D&D 3.5
        const baseStats = {
            level: Math.floor(Math.random() * 5) + 1,
            hitPoints: Math.floor(Math.random() * 20) + 10,
            armorClass: 10 + Math.floor(Math.random() * 5),
            abilities: {
                strength: 10 + Math.floor(Math.random() * 6),
                dexterity: 10 + Math.floor(Math.random() * 6),
                constitution: 10 + Math.floor(Math.random() * 6),
                intelligence: 10 + Math.floor(Math.random() * 6),
                wisdom: 10 + Math.floor(Math.random() * 6),
                charisma: 10 + Math.floor(Math.random() * 6)
            }
        };
        
        // Adjust based on occupation
        const occupationModifiers = {
            'blacksmith': { strength: +2, constitution: +1 },
            'scholar': { intelligence: +3, wisdom: +1 },
            'guard captain': { strength: +1, constitution: +2, charisma: +1 },
            'priest': { wisdom: +3, charisma: +1 },
            'merchant': { intelligence: +1, charisma: +2 }
        };
        
        const mods = occupationModifiers[occupation] || {};
        for (const [ability, modifier] of Object.entries(mods)) {
            baseStats.abilities[ability] += modifier;
        }
        
        return baseStats;
    }

    generateNPCInventory(occupation) {
        const baseItems = ['clothes', 'personal effects', 'small coin purse'];
        const occupationItems = {
            'blacksmith': ['smith\'s tools', 'leather apron', 'various metal ingots'],
            'scholar': ['books', 'writing materials', 'magnifying glass'],
            'guard captain': ['chain mail', 'longsword', 'badge of office'],
            'merchant': ['trade goods', 'ledger', 'scales'],
            'priest': ['holy symbol', 'ceremonial robes', 'prayer book']
        };
        
        return [...baseItems, ...(occupationItems[occupation] || ['trade tools'])];
    }
}

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdventureEngine;
} else if (typeof window !== 'undefined') {
    window.AdventureEngine = AdventureEngine;
}
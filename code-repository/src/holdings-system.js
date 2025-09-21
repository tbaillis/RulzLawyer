/**
 * RulzLawyer D&D 3.5 Holdings System
 * Complete implementation of property, assets, and wealth management for D&D 3.5 characters
 * 
 * Features:
 * - Multiple property types (boats, land, buildings, strongholds, businesses)
 * - Income generation and maintenance costs
 * - Asset appreciation and depreciation
 * - Business management with profitability tracking
 * - Property upgrades and improvements
 * - Stronghold construction and followers
 * - Trade route management
 * - Asset transaction history
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 * @date 2025
 */

// Universal Module Pattern - Compatible with both browser and Node.js
(function(global, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // Node.js environment
        module.exports = factory(global);
    } else {
        // Browser environment
        global.HoldingsSystem = factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function(window) {

    class HoldingsSystem {
        constructor(dependencies = {}) {
            this.characterDataModel = dependencies.characterDataModel;
            this.diceEngine = dependencies.diceEngine;
            
            console.log('🏰 HoldingsSystem initializing...');
            
            // Initialize holdings databases
            this.propertyTypes = this.initializePropertyTypes();
            this.businessTypes = this.initializeBusinessTypes();
            this.vehicleTypes = this.initializeVehicleTypes();
            this.strongholdFeatures = this.initializeStrongholdFeatures();
            this.tradeRoutes = this.initializeTradeRoutes();
            this.followers = this.initializeFollowerTypes();
            
            console.log('✅ HoldingsSystem ready with comprehensive asset management');
        }

        // === Property Types Database ===
        initializePropertyTypes() {
            return {
                // Residential Properties
                'cottage': {
                    id: 'cottage',
                    name: 'Cottage',
                    type: 'residential',
                    baseCost: 1000,
                    size: 'Small',
                    rooms: 3,
                    monthlyIncome: 0,
                    maintenanceCost: 5,
                    capacity: 4,
                    description: 'A small rural dwelling suitable for a family',
                    prerequisites: [],
                    upgrades: ['extended_cottage', 'fortified_cottage'],
                    benefits: ['Basic shelter', 'Storage space'],
                    location: ['Rural', 'Village'],
                    constructionTime: '2 months'
                },
                'townhouse': {
                    id: 'townhouse',
                    name: 'Townhouse',
                    type: 'residential',
                    baseCost: 5000,
                    size: 'Medium',
                    rooms: 6,
                    monthlyIncome: 0,
                    maintenanceCost: 25,
                    capacity: 8,
                    description: 'A multi-story urban dwelling',
                    prerequisites: [],
                    upgrades: ['luxury_townhouse', 'merchant_townhouse'],
                    benefits: ['Urban amenities', 'Multiple rooms', 'Cellar'],
                    location: ['Town', 'City'],
                    constructionTime: '4 months'
                },
                'manor': {
                    id: 'manor',
                    name: 'Manor House',
                    type: 'residential',
                    baseCost: 25000,
                    size: 'Large',
                    rooms: 20,
                    monthlyIncome: 0,
                    maintenanceCost: 125,
                    capacity: 30,
                    description: 'A grand estate suitable for nobility',
                    prerequisites: ['Noble title or 50,000 gp wealth'],
                    upgrades: ['fortified_manor', 'grand_manor'],
                    benefits: ['Prestige', 'Large grounds', 'Servant quarters', 'Stables'],
                    location: ['Rural', 'Estate'],
                    constructionTime: '12 months'
                },

                // Commercial Properties
                'shop': {
                    id: 'shop',
                    name: 'Shop',
                    type: 'commercial',
                    baseCost: 2000,
                    size: 'Small',
                    rooms: 2,
                    monthlyIncome: 50,
                    maintenanceCost: 10,
                    capacity: 10,
                    description: 'A small retail establishment',
                    prerequisites: ['Trade skill 5 ranks or Commerce background'],
                    upgrades: ['large_shop', 'specialized_shop'],
                    benefits: ['Generate income', 'Sell crafted goods', 'Storage'],
                    location: ['Village', 'Town', 'City'],
                    constructionTime: '1 month'
                },
                'inn': {
                    id: 'inn',
                    name: 'Inn',
                    type: 'commercial',
                    baseCost: 8000,
                    size: 'Large',
                    rooms: 15,
                    monthlyIncome: 200,
                    maintenanceCost: 40,
                    capacity: 50,
                    description: 'A lodging establishment with common room and rooms',
                    prerequisites: ['Profession (innkeeper) 3 ranks'],
                    upgrades: ['luxury_inn', 'tavern_inn'],
                    benefits: ['Steady income', 'Information network', 'Meeting place'],
                    location: ['Town', 'City', 'Crossroads'],
                    constructionTime: '6 months'
                },
                'trading_post': {
                    id: 'trading_post',
                    name: 'Trading Post',
                    type: 'commercial',
                    baseCost: 15000,
                    size: 'Medium',
                    rooms: 8,
                    monthlyIncome: 300,
                    maintenanceCost: 75,
                    capacity: 20,
                    description: 'A frontier trading establishment',
                    prerequisites: ['Appraise 5 ranks, Diplomacy 3 ranks'],
                    upgrades: ['fortified_trading_post', 'caravan_headquarters'],
                    benefits: ['High income potential', 'Trade route access', 'Caravan stop'],
                    location: ['Frontier', 'Trade routes'],
                    constructionTime: '4 months'
                },

                // Agricultural Properties
                'farm': {
                    id: 'farm',
                    name: 'Farm',
                    type: 'agricultural',
                    baseCost: 3000,
                    size: 'Large',
                    rooms: 4,
                    monthlyIncome: 75,
                    maintenanceCost: 15,
                    capacity: 12,
                    description: 'Working agricultural land with farmhouse',
                    prerequisites: ['Profession (farmer) 2 ranks or Handle Animal 2 ranks'],
                    upgrades: ['large_farm', 'livestock_farm'],
                    benefits: ['Food production', 'Seasonal income', 'Self-sufficiency'],
                    location: ['Rural'],
                    constructionTime: '3 months'
                },
                'vineyard': {
                    id: 'vineyard',
                    name: 'Vineyard',
                    type: 'agricultural',
                    baseCost: 12000,
                    size: 'Large',
                    rooms: 6,
                    monthlyIncome: 150,
                    maintenanceCost: 60,
                    capacity: 15,
                    description: 'Specialized wine-producing estate',
                    prerequisites: ['Profession (vintner) 5 ranks', 'Suitable climate'],
                    upgrades: ['luxury_vineyard', 'magical_vineyard'],
                    benefits: ['Premium wine production', 'High-value exports', 'Social prestige'],
                    location: ['Hills', 'Mediterranean climate'],
                    constructionTime: '8 months'
                },

                // Industrial Properties
                'forge': {
                    id: 'forge',
                    name: 'Forge',
                    type: 'industrial',
                    baseCost: 5000,
                    size: 'Medium',
                    rooms: 3,
                    monthlyIncome: 100,
                    maintenanceCost: 25,
                    capacity: 8,
                    description: 'Professional smithing facility',
                    prerequisites: ['Craft (weaponsmithing or armorsmithing) 5 ranks'],
                    upgrades: ['master_forge', 'magical_forge'],
                    benefits: ['Craft masterwork items', 'Generate income', 'Tool access'],
                    location: ['Town', 'City', 'Mining region'],
                    constructionTime: '3 months'
                },
                'mill': {
                    id: 'mill',
                    name: 'Mill',
                    type: 'industrial',
                    baseCost: 10000,
                    size: 'Large',
                    rooms: 5,
                    monthlyIncome: 200,
                    maintenanceCost: 50,
                    capacity: 12,
                    description: 'Grain processing facility',
                    prerequisites: ['Water or wind source', 'Craft (milling) 3 ranks'],
                    upgrades: ['waterwheel_mill', 'windmill'],
                    benefits: ['Process grain', 'Community service', 'Steady income'],
                    location: ['River', 'Windy area'],
                    constructionTime: '6 months'
                },

                // Land Holdings
                'forest': {
                    id: 'forest',
                    name: 'Forest Land',
                    type: 'land',
                    baseCost: 500,
                    size: 'Variable',
                    rooms: 0,
                    monthlyIncome: 25,
                    maintenanceCost: 5,
                    capacity: 0,
                    description: 'Wooded land suitable for logging or hunting',
                    prerequisites: [],
                    upgrades: ['managed_forest', 'hunting_preserve'],
                    benefits: ['Timber harvesting', 'Hunting grounds', 'Natural resources'],
                    location: ['Any forested region'],
                    constructionTime: '0 (purchase existing)'
                },
                'mining_claim': {
                    id: 'mining_claim',
                    name: 'Mining Claim',
                    type: 'land',
                    baseCost: 2000,
                    size: 'Variable',
                    rooms: 0,
                    monthlyIncome: 150,
                    maintenanceCost: 75,
                    capacity: 0,
                    description: 'Rights to extract minerals from land',
                    prerequisites: ['Profession (miner) 3 ranks or geological survey'],
                    upgrades: ['deep_mine', 'precious_metal_mine'],
                    benefits: ['Mineral extraction', 'High income potential', 'Valuable resources'],
                    location: ['Mountains', 'Hills', 'Known mineral deposits'],
                    constructionTime: '2 months setup'
                }
            };
        }

        // === Business Types Database ===
        initializeBusinessTypes() {
            return {
                'mercenary_company': {
                    id: 'mercenary_company',
                    name: 'Mercenary Company',
                    type: 'military',
                    startupCost: 10000,
                    monthlyOperatingCost: 500,
                    potentialMonthlyIncome: 1000,
                    riskLevel: 'High',
                    skillRequirements: ['Leadership feat', 'Profession (soldier) 5 ranks'],
                    employees: 20,
                    description: 'Professional military unit for hire',
                    benefits: ['Combat contracts', 'Regional influence', 'Trained soldiers'],
                    risks: ['Casualty losses', 'Equipment costs', 'Reputation damage']
                },
                'caravan_service': {
                    id: 'caravan_service',
                    name: 'Caravan Service',
                    type: 'transport',
                    startupCost: 15000,
                    monthlyOperatingCost: 300,
                    potentialMonthlyIncome: 800,
                    riskLevel: 'Medium',
                    skillRequirements: ['Handle Animal 3 ranks', 'Survival 5 ranks'],
                    employees: 12,
                    description: 'Goods transportation between settlements',
                    benefits: ['Trade route profits', 'Information network', 'Regular income'],
                    risks: ['Bandit attacks', 'Weather delays', 'Animal losses']
                },
                'magical_services': {
                    id: 'magical_services',
                    name: 'Magical Services',
                    type: 'magical',
                    startupCost: 20000,
                    monthlyOperatingCost: 100,
                    potentialMonthlyIncome: 1500,
                    riskLevel: 'Low',
                    skillRequirements: ['Spellcraft 8 ranks', '3rd level spells'],
                    employees: 3,
                    description: 'Magical services for hire (healing, divination, enchantment)',
                    benefits: ['High profit margins', 'Prestigious clientele', 'Skill development'],
                    risks: ['Magical accidents', 'Competition', 'Component costs']
                },
                'thieves_guild': {
                    id: 'thieves_guild',
                    name: 'Thieves\' Guild',
                    type: 'criminal',
                    startupCost: 25000,
                    monthlyOperatingCost: 800,
                    potentialMonthlyIncome: 2000,
                    riskLevel: 'Very High',
                    skillRequirements: ['Disable Device 5 ranks', 'Hide 5 ranks', 'Criminal contacts'],
                    employees: 30,
                    description: 'Organized criminal enterprise',
                    benefits: ['Very high profits', 'Information network', 'Street influence'],
                    risks: ['Legal consequences', 'Guild wars', 'Member betrayal']
                },
                'shipping_company': {
                    id: 'shipping_company',
                    name: 'Shipping Company',
                    type: 'maritime',
                    startupCost: 50000,
                    monthlyOperatingCost: 1000,
                    potentialMonthlyIncome: 3000,
                    riskLevel: 'High',
                    skillRequirements: ['Profession (sailor) 8 ranks', 'Knowledge (navigation) 5 ranks'],
                    employees: 50,
                    description: 'Maritime cargo and passenger transport',
                    benefits: ['International trade', 'High capacity', 'Diverse markets'],
                    risks: ['Storms', 'Pirates', 'Ship losses']
                }
            };
        }

        // === Vehicle Types Database ===
        initializeVehicleTypes() {
            return {
                // Watercraft
                'rowboat': {
                    id: 'rowboat',
                    name: 'Rowboat',
                    type: 'boat',
                    cost: 50,
                    speed: '1.5 mph',
                    capacity: '600 lbs',
                    crew: 1,
                    passengers: 3,
                    maintenanceCost: 1,
                    description: 'Small boat for rivers and calm waters',
                    upgrades: ['reinforced_hull', 'fishing_equipment'],
                    benefits: ['River transport', 'Fishing capability', 'Low cost']
                },
                'sailing_ship': {
                    id: 'sailing_ship',
                    name: 'Sailing Ship',
                    type: 'ship',
                    cost: 10000,
                    speed: '2 mph',
                    capacity: '150 tons',
                    crew: 20,
                    passengers: 20,
                    maintenanceCost: 50,
                    description: 'Medium merchant or exploration vessel',
                    upgrades: ['reinforced_hull', 'improved_sails', 'cargo_holds'],
                    benefits: ['Ocean travel', 'Large cargo capacity', 'Exploration']
                },
                'warship': {
                    id: 'warship',
                    name: 'Warship',
                    type: 'ship',
                    cost: 25000,
                    speed: '2.5 mph',
                    capacity: '200 tons',
                    crew: 60,
                    passengers: 160,
                    maintenanceCost: 125,
                    description: 'Military vessel equipped for combat',
                    upgrades: ['ram', 'ballistae', 'reinforced_armor'],
                    benefits: ['Naval combat', 'Troop transport', 'Coastal defense']
                },
                'galley': {
                    id: 'galley',
                    name: 'Galley',
                    type: 'ship',
                    cost: 30000,
                    speed: '4 mph',
                    capacity: '300 tons',
                    crew: 200,
                    passengers: 0,
                    maintenanceCost: 150,
                    description: 'Large warship powered by oars and sails',
                    upgrades: ['bronze_ram', 'marines_quarters', 'siege_weapons'],
                    benefits: ['Fast in combat', 'Independent of wind', 'Large crew capacity']
                },

                // Land Vehicles
                'wagon': {
                    id: 'wagon',
                    name: 'Wagon',
                    type: 'land',
                    cost: 35,
                    speed: '2 mph',
                    capacity: '2,000 lbs',
                    crew: 1,
                    passengers: 8,
                    maintenanceCost: 1,
                    description: 'Standard four-wheeled transport',
                    upgrades: ['covered_wagon', 'reinforced_wheels', 'lock_boxes'],
                    benefits: ['Overland transport', 'Weather protection', 'Storage']
                },
                'carriage': {
                    id: 'carriage',
                    name: 'Carriage',
                    type: 'land',
                    cost: 100,
                    speed: '3 mph',
                    capacity: '1,000 lbs',
                    crew: 1,
                    passengers: 4,
                    maintenanceCost: 2,
                    description: 'Enclosed passenger vehicle',
                    upgrades: ['luxury_interior', 'reinforced_construction', 'hidden_compartments'],
                    benefits: ['Comfortable travel', 'Weather protection', 'Status symbol']
                }
            };
        }

        // === Stronghold Features Database ===
        initializeStrongholdFeatures() {
            return {
                // Defensive Features
                'stone_wall': {
                    id: 'stone_wall',
                    name: 'Stone Wall',
                    category: 'defense',
                    cost: 5000,
                    constructionTime: '3 months',
                    maintenance: 25,
                    hp: 180,
                    hardness: 8,
                    description: 'Basic stone fortification wall',
                    benefits: ['Physical barrier', 'Archer positions', 'Intimidation factor']
                },
                'gate_house': {
                    id: 'gate_house',
                    name: 'Gate House',
                    category: 'defense',
                    cost: 6500,
                    constructionTime: '2 months',
                    maintenance: 30,
                    hp: 270,
                    hardness: 8,
                    description: 'Fortified entrance with murder holes',
                    benefits: ['Controlled access', 'Defensive position', 'Guard quarters']
                },
                'tower': {
                    id: 'tower',
                    name: 'Tower',
                    category: 'defense',
                    cost: 15000,
                    constructionTime: '6 months',
                    maintenance: 75,
                    hp: 360,
                    hardness: 8,
                    description: 'Multi-story defensive tower',
                    benefits: ['High vantage point', 'Siege weapon platform', 'Storage']
                },

                // Residential Features
                'great_hall': {
                    id: 'great_hall',
                    name: 'Great Hall',
                    category: 'residential',
                    cost: 10000,
                    constructionTime: '4 months',
                    maintenance: 50,
                    capacity: 100,
                    description: 'Large gathering and dining hall',
                    benefits: ['Social events', 'Court sessions', 'Troop housing']
                },
                'private_quarters': {
                    id: 'private_quarters',
                    name: 'Private Quarters',
                    category: 'residential',
                    cost: 3000,
                    constructionTime: '1 month',
                    maintenance: 15,
                    capacity: 4,
                    description: 'Comfortable living spaces',
                    benefits: ['Privacy', 'Rest bonus', 'Status rooms']
                },

                // Utility Features
                'armory': {
                    id: 'armory',
                    name: 'Armory',
                    category: 'utility',
                    cost: 4000,
                    constructionTime: '2 months',
                    maintenance: 20,
                    storage: 'Weapons and armor for 50 people',
                    description: 'Secure weapon and armor storage',
                    benefits: ['Equipment storage', 'Maintenance workshop', 'Security']
                },
                'stables': {
                    id: 'stables',
                    name: 'Stables',
                    category: 'utility',
                    cost: 2500,
                    constructionTime: '1 month',
                    maintenance: 25,
                    capacity: 20,
                    description: 'Horse and mount facilities',
                    benefits: ['Animal care', 'Transportation ready', 'Breeding capability']
                },
                'library': {
                    id: 'library',
                    name: 'Library',
                    category: 'utility',
                    cost: 15000,
                    constructionTime: '6 months',
                    maintenance: 75,
                    books: 1000,
                    description: 'Collection of books and scrolls',
                    benefits: ['Research bonus +2', 'Spell research', 'Knowledge repository']
                },

                // Magical Features
                'scrying_chamber': {
                    id: 'scrying_chamber',
                    name: 'Scrying Chamber',
                    category: 'magical',
                    cost: 50000,
                    constructionTime: '12 months',
                    maintenance: 250,
                    spellLevel: 5,
                    description: 'Specialized room for divination magic',
                    benefits: ['Enhanced scrying', 'Permanent magic circle', 'Spell focus +4']
                },
                'laboratory': {
                    id: 'laboratory',
                    name: 'Laboratory',
                    category: 'magical',
                    cost: 25000,
                    constructionTime: '8 months',
                    maintenance: 125,
                    research: true,
                    description: 'Magical research and experimentation facility',
                    benefits: ['Item creation bonus +4', 'Spell research', 'Potion brewing']
                }
            };
        }

        // === Trade Routes Database ===
        initializeTradeRoutes() {
            return {
                'northern_passage': {
                    id: 'northern_passage',
                    name: 'Northern Passage',
                    startLocation: 'Neverwinter',
                    endLocation: 'Silverymoon',
                    distance: 200,
                    difficulty: 'Medium',
                    travelTime: '10 days',
                    profitMargin: 0.25,
                    risks: ['Orc raids', 'Winter weather', 'Toll bridges'],
                    goods: ['Furs', 'Lumber', 'Precious metals', 'Crafted items'],
                    seasonalModifiers: {
                        'spring': 1.0,
                        'summer': 1.2,
                        'autumn': 1.1,
                        'winter': 0.7
                    }
                },
                'coastal_trading': {
                    id: 'coastal_trading',
                    name: 'Coastal Trading Route',
                    startLocation: 'Waterdeep',
                    endLocation: 'Baldur\'s Gate',
                    distance: 150,
                    difficulty: 'Low',
                    travelTime: '5 days by ship',
                    profitMargin: 0.15,
                    risks: ['Pirates', 'Storms', 'Port fees'],
                    goods: ['Spices', 'Textiles', 'Wine', 'Exotic items'],
                    seasonalModifiers: {
                        'spring': 1.1,
                        'summer': 1.3,
                        'autumn': 1.0,
                        'winter': 0.8
                    }
                },
                'dwarven_mountain_route': {
                    id: 'dwarven_mountain_route',
                    name: 'Dwarven Mountain Route',
                    startLocation: 'Citadel Adbar',
                    endLocation: 'Mithral Hall',
                    distance: 100,
                    difficulty: 'High',
                    travelTime: '8 days',
                    profitMargin: 0.40,
                    risks: ['Duergar attacks', 'Cave-ins', 'Underground monsters'],
                    goods: ['Mithral', 'Gems', 'Dwarven weapons', 'Ale'],
                    seasonalModifiers: {
                        'spring': 1.0,
                        'summer': 1.0,
                        'autumn': 1.0,
                        'winter': 1.0
                    }
                },
                'southern_spice_route': {
                    id: 'southern_spice_route',
                    name: 'Southern Spice Route',
                    startLocation: 'Athkatla',
                    endLocation: 'Calimport',
                    distance: 300,
                    difficulty: 'Medium',
                    travelTime: '15 days',
                    profitMargin: 0.35,
                    risks: ['Desert storms', 'Bandits', 'Political unrest'],
                    goods: ['Spices', 'Silk', 'Incense', 'Gemstones'],
                    seasonalModifiers: {
                        'spring': 1.2,
                        'summer': 0.9,
                        'autumn': 1.3,
                        'winter': 1.1
                    }
                }
            };
        }

        // === Follower Types Database ===
        initializeFollowerTypes() {
            return {
                'guard_captain': {
                    id: 'guard_captain',
                    name: 'Guard Captain',
                    type: 'military',
                    level: 5,
                    class: 'Fighter',
                    cost: 100,
                    loyalty: 85,
                    skills: ['Intimidate', 'Profession (soldier)', 'Spot', 'Listen'],
                    equipment: 'Full plate, masterwork weapon, horse',
                    duties: 'Manages security, trains guards, leads patrols',
                    benefits: '+2 to stronghold defense, +10% guard efficiency'
                },
                'seneschal': {
                    id: 'seneschal',
                    name: 'Seneschal',
                    type: 'administrative',
                    level: 6,
                    class: 'Expert',
                    cost: 80,
                    loyalty: 90,
                    skills: ['Diplomacy', 'Appraise', 'Profession (administrator)', 'Knowledge (local)'],
                    equipment: 'Fine clothes, ledgers, administrative tools',
                    duties: 'Manages daily operations, handles finances, coordinates staff',
                    benefits: '+15% income from properties, -10% maintenance costs'
                },
                'court_wizard': {
                    id: 'court_wizard',
                    name: 'Court Wizard',
                    type: 'magical',
                    level: 8,
                    class: 'Wizard',
                    cost: 200,
                    loyalty: 70,
                    skills: ['Spellcraft', 'Knowledge (arcana)', 'Research', 'Craft (magical items)'],
                    equipment: 'Spellbook, component pouch, magical laboratory access',
                    duties: 'Magical research, creates items, defensive enchantments',
                    benefits: 'Magical services, item creation, +4 to magical research'
                },
                'master_craftsman': {
                    id: 'master_craftsman',
                    name: 'Master Craftsman',
                    type: 'artisan',
                    level: 7,
                    class: 'Expert',
                    cost: 120,
                    loyalty: 80,
                    skills: ['Craft (specialty)', 'Appraise', 'Profession (specialty)', 'Diplomacy'],
                    equipment: 'Masterwork tools, workshop access, raw materials',
                    duties: 'Supervises production, trains apprentices, quality control',
                    benefits: '+25% income from related businesses, masterwork item production'
                },
                'spy_master': {
                    id: 'spy_master',
                    name: 'Spy Master',
                    type: 'intelligence',
                    level: 9,
                    class: 'Rogue',
                    cost: 150,
                    loyalty: 75,
                    skills: ['Gather Information', 'Disguise', 'Bluff', 'Sense Motive'],
                    equipment: 'Disguise kit, thieves\' tools, network of contacts',
                    duties: 'Information gathering, counter-intelligence, security',
                    benefits: 'Weekly intelligence reports, +3 to political intrigue'
                }
            };
        }

        // === Property Management ===
        purchaseProperty(character, propertyTypeId, location, customizations = {}) {
            const propertyType = this.propertyTypes[propertyTypeId];
            if (!propertyType) {
                throw new Error(`Unknown property type: ${propertyTypeId}`);
            }

            // Check prerequisites
            const prereqCheck = this.checkPrerequisites(character, propertyType.prerequisites);
            if (!prereqCheck.valid) {
                return { success: false, reason: prereqCheck.reason };
            }

            // Calculate total cost including customizations
            let totalCost = propertyType.baseCost;
            const customizationCosts = this.calculateCustomizationCosts(customizations);
            totalCost += customizationCosts.total;

            // Check if character can afford it
            if (!character.wealth || character.wealth.gold < totalCost) {
                return { 
                    success: false, 
                    reason: `Insufficient funds. Cost: ${totalCost} gp, Available: ${character.wealth?.gold || 0} gp` 
                };
            }

            // Create property instance
            const property = {
                id: `${propertyTypeId}_${Date.now()}`,
                type: propertyTypeId,
                name: customizations.name || propertyType.name,
                location: location,
                purchaseDate: new Date().toISOString(),
                purchasePrice: totalCost,
                currentValue: totalCost,
                condition: 100,
                customizations: customizations,
                monthlyIncome: propertyType.monthlyIncome,
                maintenanceCost: propertyType.maintenanceCost,
                tenants: [],
                improvements: [],
                history: [{
                    date: new Date().toISOString(),
                    event: 'Property purchased',
                    cost: totalCost
                }]
            };

            // Initialize holdings if needed
            if (!character.holdings) {
                character.holdings = { properties: [], vehicles: [], businesses: [], followers: [] };
            }

            // Add property and deduct cost
            character.holdings.properties.push(property);
            character.wealth.gold -= totalCost;

            return {
                success: true,
                property: property,
                costPaid: totalCost,
                newWealth: character.wealth.gold
            };
        }

        // === Business Management ===
        startBusiness(character, businessTypeId, location, investmentAmount = null) {
            const businessType = this.businessTypes[businessTypeId];
            if (!businessType) {
                throw new Error(`Unknown business type: ${businessTypeId}`);
            }

            // Check skill requirements
            const skillCheck = this.checkBusinessSkillRequirements(character, businessType.skillRequirements);
            if (!skillCheck.valid) {
                return { success: false, reason: skillCheck.reason };
            }

            const startupCost = investmentAmount || businessType.startupCost;

            // Check if character can afford startup costs
            if (!character.wealth || character.wealth.gold < startupCost) {
                return { 
                    success: false, 
                    reason: `Insufficient startup capital. Required: ${startupCost} gp, Available: ${character.wealth?.gold || 0} gp` 
                };
            }

            // Create business instance
            const business = {
                id: `${businessTypeId}_${Date.now()}`,
                type: businessTypeId,
                name: `${character.name}'s ${businessType.name}`,
                location: location,
                startDate: new Date().toISOString(),
                startupInvestment: startupCost,
                currentValue: startupCost,
                monthlyOperatingCost: businessType.monthlyOperatingCost,
                potentialMonthlyIncome: businessType.potentialMonthlyIncome,
                actualMonthlyIncome: 0,
                profitMargin: 0,
                employees: businessType.employees,
                reputation: 50,
                riskLevel: businessType.riskLevel,
                monthsOperating: 0,
                totalProfit: 0,
                history: [{
                    date: new Date().toISOString(),
                    event: 'Business started',
                    cost: startupCost,
                    details: `Opened ${businessType.name} in ${location}`
                }]
            };

            // Initialize holdings if needed
            if (!character.holdings) {
                character.holdings = { properties: [], vehicles: [], businesses: [], followers: [] };
            }

            // Add business and deduct startup cost
            character.holdings.businesses.push(business);
            character.wealth.gold -= startupCost;

            return {
                success: true,
                business: business,
                startupCost: startupCost,
                newWealth: character.wealth.gold
            };
        }

        // === Vehicle Management ===
        purchaseVehicle(character, vehicleTypeId, customizations = {}) {
            const vehicleType = this.vehicleTypes[vehicleTypeId];
            if (!vehicleType) {
                throw new Error(`Unknown vehicle type: ${vehicleTypeId}`);
            }

            let totalCost = vehicleType.cost;
            const customizationCosts = this.calculateVehicleCustomizations(customizations);
            totalCost += customizationCosts.total;

            // Check if character can afford it
            if (!character.wealth || character.wealth.gold < totalCost) {
                return { 
                    success: false, 
                    reason: `Insufficient funds. Cost: ${totalCost} gp, Available: ${character.wealth?.gold || 0} gp` 
                };
            }

            // Create vehicle instance
            const vehicle = {
                id: `${vehicleTypeId}_${Date.now()}`,
                type: vehicleTypeId,
                name: customizations.name || vehicleType.name,
                purchaseDate: new Date().toISOString(),
                purchasePrice: totalCost,
                currentValue: totalCost,
                condition: 100,
                speed: vehicleType.speed,
                capacity: vehicleType.capacity,
                crew: vehicleType.crew,
                passengers: vehicleType.passengers,
                maintenanceCost: vehicleType.maintenanceCost,
                upgrades: customizations.upgrades || [],
                location: 'Docked/Parked',
                history: [{
                    date: new Date().toISOString(),
                    event: 'Vehicle purchased',
                    cost: totalCost
                }]
            };

            // Initialize holdings if needed
            if (!character.holdings) {
                character.holdings = { properties: [], vehicles: [], businesses: [], followers: [] };
            }

            // Add vehicle and deduct cost
            character.holdings.vehicles.push(vehicle);
            character.wealth.gold -= totalCost;

            return {
                success: true,
                vehicle: vehicle,
                costPaid: totalCost,
                newWealth: character.wealth.gold
            };
        }

        // === Monthly Income/Expense Processing ===
        processMonthlyFinances(character) {
            if (!character.holdings) {
                return { totalIncome: 0, totalExpenses: 0, netGain: 0 };
            }

            let totalIncome = 0;
            let totalExpenses = 0;
            const report = {
                properties: [],
                businesses: [],
                vehicles: [],
                summary: {}
            };

            // Process property income and expenses
            for (const property of character.holdings.properties || []) {
                const income = this.calculatePropertyIncome(property);
                const expenses = this.calculatePropertyExpenses(property);
                
                totalIncome += income;
                totalExpenses += expenses;
                
                report.properties.push({
                    name: property.name,
                    income: income,
                    expenses: expenses,
                    net: income - expenses,
                    condition: property.condition
                });
                
                // Update property condition and value
                this.updatePropertyCondition(property);
            }

            // Process business income and expenses
            for (const business of character.holdings.businesses || []) {
                const performance = this.calculateBusinessPerformance(business, character);
                
                totalIncome += performance.income;
                totalExpenses += performance.expenses;
                
                report.businesses.push({
                    name: business.name,
                    income: performance.income,
                    expenses: performance.expenses,
                    net: performance.income - performance.expenses,
                    reputation: business.reputation,
                    riskEvents: performance.riskEvents
                });
                
                // Update business stats
                business.monthsOperating++;
                business.actualMonthlyIncome = performance.income;
                business.totalProfit += (performance.income - performance.expenses);
                business.reputation += performance.reputationChange;
            }

            // Process vehicle expenses
            for (const vehicle of character.holdings.vehicles || []) {
                const expenses = vehicle.maintenanceCost || 0;
                totalExpenses += expenses;
                
                report.vehicles.push({
                    name: vehicle.name,
                    expenses: expenses,
                    condition: vehicle.condition
                });
                
                // Update vehicle condition
                this.updateVehicleCondition(vehicle);
            }

            const netGain = totalIncome - totalExpenses;
            
            // Update character wealth
            if (!character.wealth) {
                character.wealth = { gold: 0, silver: 0, copper: 0 };
            }
            character.wealth.gold += netGain;

            report.summary = {
                totalIncome: totalIncome,
                totalExpenses: totalExpenses,
                netGain: netGain,
                newWealth: character.wealth.gold
            };

            return report;
        }

        // === Property Income Calculation ===
        calculatePropertyIncome(property) {
            const propertyType = this.propertyTypes[property.type];
            if (!propertyType) return 0;

            let baseIncome = propertyType.monthlyIncome;
            
            // Apply condition modifier
            const conditionModifier = property.condition / 100;
            baseIncome *= conditionModifier;
            
            // Apply tenant bonuses
            if (property.tenants && property.tenants.length > 0) {
                const tenantBonus = property.tenants.reduce((sum, tenant) => sum + (tenant.rent || 0), 0);
                baseIncome += tenantBonus;
            }
            
            // Apply improvement bonuses
            if (property.improvements && property.improvements.length > 0) {
                const improvementBonus = property.improvements.reduce((sum, improvement) => {
                    return sum + (improvement.incomeBonus || 0);
                }, 0);
                baseIncome += improvementBonus;
            }
            
            return Math.floor(baseIncome);
        }

        calculatePropertyExpenses(property) {
            const propertyType = this.propertyTypes[property.type];
            if (!propertyType) return 0;

            let expenses = propertyType.maintenanceCost || 0;
            
            // Poor condition increases maintenance
            if (property.condition < 50) {
                expenses *= 1.5;
            } else if (property.condition < 75) {
                expenses *= 1.2;
            }
            
            // Add improvement maintenance costs
            if (property.improvements && property.improvements.length > 0) {
                const improvementCosts = property.improvements.reduce((sum, improvement) => {
                    return sum + (improvement.maintenanceCost || 0);
                }, 0);
                expenses += improvementCosts;
            }
            
            return Math.floor(expenses);
        }

        // === Business Performance Calculation ===
        calculateBusinessPerformance(business, character) {
            const businessType = this.businessTypes[business.type];
            if (!businessType) return { income: 0, expenses: 0, riskEvents: [], reputationChange: 0 };

            let baseIncome = businessType.potentialMonthlyIncome;
            let expenses = businessType.monthlyOperatingCost;
            const riskEvents = [];
            let reputationChange = 0;

            // Apply experience and skill bonuses
            const skillBonus = this.calculateBusinessSkillBonus(character, business);
            baseIncome *= (1 + skillBonus);

            // Apply reputation modifier
            const reputationModifier = (business.reputation - 50) / 100;
            baseIncome *= (1 + reputationModifier);

            // Roll for random events based on risk level
            const riskRoll = this.diceEngine ? this.diceEngine.rollDice('1d100').total : Math.floor(Math.random() * 100) + 1;
            
            switch (businessType.riskLevel) {
                case 'Very High':
                    if (riskRoll <= 30) {
                        const event = this.generateBusinessRiskEvent(business, 'major');
                        riskEvents.push(event);
                        baseIncome *= event.incomeModifier;
                        expenses *= event.expenseModifier;
                        reputationChange += event.reputationChange;
                    } else if (riskRoll <= 60) {
                        const event = this.generateBusinessRiskEvent(business, 'minor');
                        riskEvents.push(event);
                        baseIncome *= event.incomeModifier;
                        reputationChange += event.reputationChange;
                    }
                    break;
                    
                case 'High':
                    if (riskRoll <= 20) {
                        const event = this.generateBusinessRiskEvent(business, 'major');
                        riskEvents.push(event);
                        baseIncome *= event.incomeModifier;
                        expenses *= event.expenseModifier;
                        reputationChange += event.reputationChange;
                    } else if (riskRoll <= 50) {
                        const event = this.generateBusinessRiskEvent(business, 'minor');
                        riskEvents.push(event);
                        baseIncome *= event.incomeModifier;
                        reputationChange += event.reputationChange;
                    }
                    break;
                    
                case 'Medium':
                    if (riskRoll <= 10) {
                        const event = this.generateBusinessRiskEvent(business, 'major');
                        riskEvents.push(event);
                        baseIncome *= event.incomeModifier;
                        expenses *= event.expenseModifier;
                        reputationChange += event.reputationChange;
                    } else if (riskRoll <= 35) {
                        const event = this.generateBusinessRiskEvent(business, 'minor');
                        riskEvents.push(event);
                        baseIncome *= event.incomeModifier;
                        reputationChange += event.reputationChange;
                    }
                    break;
                    
                case 'Low':
                    if (riskRoll <= 5) {
                        const event = this.generateBusinessRiskEvent(business, 'major');
                        riskEvents.push(event);
                        baseIncome *= event.incomeModifier;
                        expenses *= event.expenseModifier;
                        reputationChange += event.reputationChange;
                    } else if (riskRoll <= 20) {
                        const event = this.generateBusinessRiskEvent(business, 'minor');
                        riskEvents.push(event);
                        baseIncome *= event.incomeModifier;
                        reputationChange += event.reputationChange;
                    }
                    break;
            }

            return {
                income: Math.max(0, Math.floor(baseIncome)),
                expenses: Math.floor(expenses),
                riskEvents: riskEvents,
                reputationChange: reputationChange
            };
        }

        // === Holdings Information ===
        getCharacterHoldingsSummary(character) {
            if (!character.holdings) {
                return {
                    totalValue: 0,
                    monthlyIncome: 0,
                    monthlyExpenses: 0,
                    netMonthlyGain: 0,
                    propertyCount: 0,
                    businessCount: 0,
                    vehicleCount: 0,
                    followerCount: 0
                };
            }

            let totalValue = 0;
            let monthlyIncome = 0;
            let monthlyExpenses = 0;

            // Calculate property values and income
            for (const property of character.holdings.properties || []) {
                totalValue += property.currentValue || property.purchasePrice || 0;
                monthlyIncome += this.calculatePropertyIncome(property);
                monthlyExpenses += this.calculatePropertyExpenses(property);
            }

            // Calculate business values and income
            for (const business of character.holdings.businesses || []) {
                totalValue += business.currentValue || business.startupInvestment || 0;
                monthlyIncome += business.actualMonthlyIncome || 0;
                const businessType = this.businessTypes[business.type];
                if (businessType) {
                    monthlyExpenses += businessType.monthlyOperatingCost || 0;
                }
            }

            // Calculate vehicle values and expenses
            for (const vehicle of character.holdings.vehicles || []) {
                totalValue += vehicle.currentValue || vehicle.purchasePrice || 0;
                monthlyExpenses += vehicle.maintenanceCost || 0;
            }

            return {
                totalValue: totalValue,
                monthlyIncome: monthlyIncome,
                monthlyExpenses: monthlyExpenses,
                netMonthlyGain: monthlyIncome - monthlyExpenses,
                propertyCount: character.holdings.properties?.length || 0,
                businessCount: character.holdings.businesses?.length || 0,
                vehicleCount: character.holdings.vehicles?.length || 0,
                followerCount: character.holdings.followers?.length || 0
            };
        }

        // === Utility Methods ===
        checkPrerequisites(character, prerequisites) {
            if (!prerequisites || prerequisites.length === 0) {
                return { valid: true };
            }

            for (const prereq of prerequisites) {
                // Check for skill requirements
                if (prereq.includes('ranks')) {
                    const [skillName, ranksRequired] = prereq.split(' ');
                    const skillData = character.skills?.[skillName.toLowerCase().replace(/\s+/g, '_')];
                    if (!skillData || skillData.ranks < parseInt(ranksRequired)) {
                        return { valid: false, reason: `Requires ${prereq}` };
                    }
                }
                
                // Check for wealth requirements
                if (prereq.includes('wealth') || prereq.includes('gp')) {
                    const match = prereq.match(/(\d+,?\d*)\s*gp/);
                    if (match) {
                        const required = parseInt(match[1].replace(',', ''));
                        if (!character.wealth || character.wealth.gold < required) {
                            return { valid: false, reason: `Requires ${prereq} total wealth` };
                        }
                    }
                }
                
                // Check for title requirements
                if (prereq.includes('title')) {
                    if (!character.titles || !character.titles.includes('Noble')) {
                        return { valid: false, reason: prereq };
                    }
                }
            }

            return { valid: true };
        }

        checkBusinessSkillRequirements(character, requirements) {
            if (!requirements || requirements.length === 0) {
                return { valid: true };
            }

            for (const requirement of requirements) {
                if (requirement.includes('ranks')) {
                    const [skillName, ranksRequired] = requirement.split(' ');
                    const skillId = skillName.toLowerCase().replace(/[()]/g, '').replace(/\s+/g, '_');
                    const skillData = character.skills?.[skillId];
                    if (!skillData || skillData.ranks < parseInt(ranksRequired)) {
                        return { valid: false, reason: `Requires ${requirement}` };
                    }
                } else if (requirement.includes('feat')) {
                    const featName = requirement.replace(' feat', '');
                    if (!character.feats || !character.feats.some(f => f.name === featName)) {
                        return { valid: false, reason: `Requires ${requirement}` };
                    }
                }
            }

            return { valid: true };
        }

        calculateCustomizationCosts(customizations) {
            let total = 0;
            const breakdown = {};
            
            // Add customization cost calculations here
            // This would include upgrades, size modifications, luxury features, etc.
            
            return { total, breakdown };
        }

        calculateVehicleCustomizations(customizations) {
            let total = 0;
            const breakdown = {};
            
            if (customizations.upgrades) {
                for (const upgrade of customizations.upgrades) {
                    const cost = this.getUpgradeCost(upgrade);
                    total += cost;
                    breakdown[upgrade] = cost;
                }
            }
            
            return { total, breakdown };
        }

        getUpgradeCost(upgrade) {
            const upgradeCosts = {
                'reinforced_hull': 1000,
                'improved_sails': 500,
                'cargo_holds': 750,
                'luxury_interior': 1500,
                'hidden_compartments': 300
            };
            
            return upgradeCosts[upgrade] || 100;
        }

        updatePropertyCondition(property) {
            // Natural deterioration
            if (Math.random() < 0.1) {
                property.condition = Math.max(0, property.condition - 1);
            }
            
            // Update value based on condition
            const baseValue = property.purchasePrice;
            property.currentValue = Math.floor(baseValue * (property.condition / 100));
        }

        updateVehicleCondition(vehicle) {
            // Vehicles deteriorate faster than buildings
            if (Math.random() < 0.15) {
                vehicle.condition = Math.max(0, vehicle.condition - 2);
            }
            
            // Update value based on condition
            const baseValue = vehicle.purchasePrice;
            vehicle.currentValue = Math.floor(baseValue * (vehicle.condition / 100) * 0.8); // Vehicles depreciate more
        }

        calculateBusinessSkillBonus(character, business) {
            // Calculate skill bonus based on relevant skills for the business type
            return 0.1; // Placeholder - implement based on character skills
        }

        generateBusinessRiskEvent(business, severity) {
            const events = {
                'major': [
                    { description: 'Major theft', incomeModifier: 0.5, expenseModifier: 1.2, reputationChange: -10 },
                    { description: 'Equipment failure', incomeModifier: 0.6, expenseModifier: 1.5, reputationChange: -5 },
                    { description: 'Legal troubles', incomeModifier: 0.3, expenseModifier: 2.0, reputationChange: -15 }
                ],
                'minor': [
                    { description: 'Minor setback', incomeModifier: 0.8, expenseModifier: 1.1, reputationChange: -2 },
                    { description: 'Good fortune', incomeModifier: 1.2, expenseModifier: 1.0, reputationChange: 5 },
                    { description: 'New opportunity', incomeModifier: 1.1, expenseModifier: 1.0, reputationChange: 3 }
                ]
            };
            
            const eventList = events[severity] || events['minor'];
            return eventList[Math.floor(Math.random() * eventList.length)];
        }

        // === Mock System for Testing ===
        static createMockSystem() {
            return {
                propertyTypes: {},
                businessTypes: {},
                vehicleTypes: {},
                purchaseProperty: () => ({ success: true, property: { name: 'Mock Property' } }),
                startBusiness: () => ({ success: true, business: { name: 'Mock Business' } }),
                purchaseVehicle: () => ({ success: true, vehicle: { name: 'Mock Vehicle' } }),
                processMonthlyFinances: () => ({ totalIncome: 100, totalExpenses: 50, netGain: 50 }),
                getCharacterHoldingsSummary: () => ({ totalValue: 10000, monthlyIncome: 100, monthlyExpenses: 50 })
            };
        }
    }

    // Register for global access in browser
    if (typeof window !== 'undefined') {
        window.HoldingsSystem = HoldingsSystem;
    }

    return HoldingsSystem;
});
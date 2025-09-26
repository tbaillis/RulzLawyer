/**
 * Integrated System Demo - RulzLawyer D&D 3.5 System
 * 
 * Comprehensive demonstration of the fully integrated RulzLawyer system:
 * - Character creation with full system integration
 * - Inventory management and equipment tracking
 * - Combat resolution with spell integration
 * - Adventure generation and orchestration
 * - Cross-system communication and event handling
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class IntegratedSystemDemo {
    constructor() {
        this.systemIntegration = null;
        this.demoParty = [];
        this.currentAdventure = null;
        this.demoLog = [];
    }

    /**
     * Run comprehensive system integration demo
     */
    async runFullDemo() {
        console.log('🎲🎭 Starting RulzLawyer Integrated System Demo');
        console.log('='.repeat(60));
        
        try {
            // Phase 1: System Initialization
            await this.initializeIntegratedSystem();
            
            // Phase 2: Character Creation with Full Integration
            await this.demonstrateIntegratedCharacterCreation();
            
            // Phase 3: Party Formation and Inventory Setup
            await this.demonstratePartyFormation();
            
            // Phase 4: Adventure Generation
            await this.demonstrateAdventureGeneration();
            
            // Phase 5: Combat Integration Demo
            await this.demonstrateCombatIntegration();
            
            // Phase 6: Spell System Integration
            await this.demonstrateSpellIntegration();
            
            // Phase 7: Treasure and Progression
            await this.demonstrateTreasureAndProgression();
            
            // Phase 8: System Status and Analytics
            await this.demonstrateSystemAnalytics();
            
            console.log('✅ Integrated System Demo completed successfully!');
            return this.generateDemoReport();
            
        } catch (error) {
            console.error('❌ Demo failed:', error);
            throw error;
        }
    }

    /**
     * Phase 1: Initialize the integrated system
     */
    async initializeIntegratedSystem() {
        this.log('🔧 Initializing RulzLawyer Integrated System...');
        
        // Import and create system integration
        const { RulzLawyerSystemIntegration } = await import('../integration/rulz-lawyer-system-integration.js');
        this.systemIntegration = new RulzLawyerSystemIntegration();
        
        // Initialize all systems
        const initResult = await this.systemIntegration.initialize();
        
        this.log('✅ System Integration Status:', initResult);
        this.log(`🎯 Integration Level: ${initResult.integrationLevel}%`);
        
        // Verify systems are ready
        const status = this.systemIntegration.getSystemStatus();
        this.log('📊 Active Systems:', status.activeFeatures);
    }

    /**
     * Phase 2: Character Creation with Full Integration
     */
    async demonstrateIntegratedCharacterCreation() {
        this.log('👤 Creating integrated characters for demo party...');
        
        const characterConfigs = [
            {
                name: 'Sir Gareth',
                race: 'Human',
                classes: [{ name: 'Fighter', level: 5 }],
                abilities: { strength: 16, dexterity: 14, constitution: 15, intelligence: 12, wisdom: 13, charisma: 10 },
                background: 'Noble',
                alignment: 'Lawful Good'
            },
            {
                name: 'Lyralei',
                race: 'Elf',
                classes: [{ name: 'Wizard', level: 5 }],
                abilities: { strength: 8, dexterity: 14, constitution: 12, intelligence: 17, wisdom: 15, charisma: 11 },
                background: 'Scholar',
                alignment: 'Chaotic Good'
            },
            {
                name: 'Thorin',
                race: 'Dwarf',
                classes: [{ name: 'Cleric', level: 5 }],
                abilities: { strength: 14, dexterity: 10, constitution: 16, intelligence: 13, wisdom: 16, charisma: 12 },
                background: 'Acolyte',
                alignment: 'Lawful Good'
            },
            {
                name: 'Silara',
                race: 'Half-Elf',
                classes: [{ name: 'Rogue', level: 5 }],
                abilities: { strength: 12, dexterity: 17, constitution: 13, intelligence: 14, wisdom: 12, charisma: 15 },
                background: 'Criminal',
                alignment: 'Chaotic Neutral'
            }
        ];
        
        // Create characters with full integration
        for (const config of characterConfigs) {
            this.log(`🎭 Creating ${config.name} (${config.race} ${config.classes[0].name})...`);
            
            const character = await this.systemIntegration.createIntegratedCharacter(config);
            this.demoParty.push(character);
            
            this.log(`✅ ${character.name} created with:`, {
                level: character.classes[0].level,
                hitPoints: character.hitPoints,
                inventorySlots: character.inventory?.slots?.length || 0,
                spellsKnown: character.spellbook?.spells?.size || 0,
                combatStats: !!character.combatStats
            });
        }
        
        this.log(`🎉 Party of ${this.demoParty.length} characters created successfully!`);
    }

    /**
     * Phase 3: Party Formation and Inventory Setup
     */
    async demonstratePartyFormation() {
        this.log('🎭 Forming adventuring party and setting up shared resources...');
        
        // Create party through adventure engine
        if (this.systemIntegration.adventureEngine) {
            const party = this.systemIntegration.adventureEngine.createParty(
                this.demoParty, 
                'The Integrated Heroes'
            );
            
            this.log('✅ Party formed:', {
                name: party.name,
                memberCount: party.characters.length,
                formation: party.formation,
                sharedInventory: !!party.sharedInventory
            });
            
            // Demonstrate shared inventory
            if (this.systemIntegration.inventoryIntegration) {
                await this.demonstrateSharedInventory(party);
            }
        }
    }

    /**
     * Demonstrate shared inventory system
     */
    async demonstrateSharedInventory(party) {
        this.log('💰 Setting up shared party inventory...');
        
        const sharedItems = [
            { name: 'Rope (50 ft)', quantity: 2, weight: 10 },
            { name: 'Healing Potion', quantity: 6, weight: 0.5 },
            { name: 'Trail Rations', quantity: 20, weight: 2 },
            { name: 'Camping Supplies', quantity: 1, weight: 20 },
            { name: 'Gold Pieces', quantity: 500, weight: 0.02 }
        ];
        
        for (const item of sharedItems) {
            await this.systemIntegration.inventoryIntegration.addToSharedInventory(
                party.sharedInventory, 
                item
            );
        }
        
        this.log('✅ Shared inventory established with starting supplies');
    }

    /**
     * Phase 4: Adventure Generation
     */
    async demonstrateAdventureGeneration() {
        this.log('🗺️ Generating integrated adventure...');
        
        const adventureOptions = {
            type: 'dungeon_crawl',
            partyLevel: 5,
            duration: 'short',
            theme: 'classic_fantasy',
            difficulty: 'balanced',
            party: this.demoParty
        };
        
        this.currentAdventure = await this.systemIntegration.startIntegratedAdventure(adventureOptions);
        
        this.log('🎲 Adventure generated:', {
            title: this.currentAdventure.title,
            type: this.currentAdventure.type,
            estimatedDuration: this.currentAdventure.estimatedDuration,
            encounterCount: this.currentAdventure.encounters?.length || 0,
            treasureReward: this.currentAdventure.treasureReward,
            experienceReward: this.currentAdventure.experienceReward
        });
        
        // Show first few encounters
        if (this.currentAdventure.encounters && this.currentAdventure.encounters.length > 0) {
            this.log('🎯 Preview of encounters:');
            this.currentAdventure.encounters.slice(0, 3).forEach((encounter, index) => {
                this.log(`  ${index + 1}. ${encounter.name} (${encounter.type}, CR ${encounter.cr})`);
            });
        }
    }

    /**
     * Phase 5: Combat Integration Demo
     */
    async demonstrateCombatIntegration() {
        this.log('⚔️ Demonstrating integrated combat system...');
        
        if (!this.systemIntegration.combatIntegration || !this.currentAdventure) {
            this.log('⚠️ Combat integration or adventure not available');
            return;
        }
        
        // Find a combat encounter
        const combatEncounter = this.currentAdventure.encounters?.find(e => e.type === 'combat');
        if (!combatEncounter) {
            this.log('⚠️ No combat encounters available in adventure');
            return;
        }
        
        this.log(`🗡️ Starting combat: ${combatEncounter.name}`);
        
        try {
            // Execute integrated combat
            const combatResult = await this.systemIntegration.adventureEngine.executeIntegratedCombat(
                combatEncounter, 
                this.demoParty
            );
            
            this.log('⚔️ Combat completed:', {
                success: combatResult.success,
                duration: combatResult.duration,
                casualties: combatResult.casualties?.length || 0,
                experienceGained: combatResult.experience,
                treasureFound: combatResult.rewards?.treasure?.length || 0
            });
            
            // Show combat summary
            if (combatResult.combatLog) {
                this.log('📜 Combat highlights:');
                combatResult.combatLog.slice(0, 5).forEach(entry => {
                    this.log(`  - ${entry.description}`);
                });
            }
            
        } catch (error) {
            this.log('❌ Combat execution failed:', error.message);
        }
    }

    /**
     * Phase 6: Spell System Integration
     */
    async demonstrateSpellIntegration() {
        this.log('🔮 Demonstrating integrated spell system...');
        
        if (!this.systemIntegration.spellSystem) {
            this.log('⚠️ Spell system not available');
            return;
        }
        
        // Find spellcaster in party
        const spellcaster = this.demoParty.find(char => 
            char.classes.some(cls => ['Wizard', 'Cleric', 'Bard'].includes(cls.name))
        );
        
        if (!spellcaster) {
            this.log('⚠️ No spellcasters in party');
            return;
        }
        
        this.log(`🧙 ${spellcaster.name} demonstrates spellcasting...`);
        
        try {
            // Demonstrate spell preparation (for prepared casters)
            if (['Wizard', 'Cleric'].includes(spellcaster.classes[0].name)) {
                const spellsToPrepare = [
                    { name: 'Magic Missile', level: 1 },
                    { name: 'Shield', level: 1 },
                    { name: 'Detect Magic', level: 0 }
                ];
                
                await this.systemIntegration.spellSystem.prepareSpells(spellcaster, spellsToPrepare);
                this.log(`Prepared ${spellsToPrepare.length} spells`);
            }
            
            // Demonstrate spell casting
            const testTargets = [this.demoParty[0]]; // Cast on first party member
            
            const castingResult = await this.systemIntegration.adventureEngine.castAdventureSpell(
                spellcaster,
                'Magic Missile',
                testTargets,
                { context: 'demonstration' }
            );
            
            this.log('🔮 Spell casting result:', {
                success: castingResult.success,
                damage: castingResult.damage?.total || 0,
                effects: castingResult.effects?.length || 0,
                spellUsed: castingResult.spell?.name
            });
            
        } catch (error) {
            this.log('❌ Spell demonstration failed:', error.message);
        }
    }

    /**
     * Phase 7: Treasure and Progression
     */
    async demonstrateTreasureAndProgression() {
        this.log('💎 Demonstrating treasure distribution and character progression...');
        
        if (!this.systemIntegration.inventoryIntegration) {
            this.log('⚠️ Inventory integration not available');
            return;
        }
        
        // Simulate finding treasure
        const treasureHoard = [
            { name: '+1 Longsword', type: 'weapon', enhancement: 1, value: 2315 },
            { name: 'Cloak of Resistance +1', type: 'wondrous', value: 1000 },
            { name: 'Potion of Cure Light Wounds', type: 'potion', value: 50, quantity: 3 },
            { name: 'Gold Pieces', value: 1, quantity: 850 }
        ];
        
        this.log('Treasure discovered!');
        treasureHoard.forEach(item => {
            const displayName = item.quantity ? item.name + ' (' + item.quantity + ')' : item.name;
            const totalValue = item.value * (item.quantity || 1);
            this.log('  - ' + displayName + ' (' + totalValue + ' gp value)');
        });
        
        // Distribute treasure
        try {
            for (const item of treasureHoard) {
                await this.systemIntegration.inventoryIntegration.distributeLoot(this.demoParty, item);
            }
            this.log('Treasure distributed among party members');
        } catch (error) {
            this.log('❌ Treasure distribution failed:', error.message);
        }
        
        // Demonstrate experience gain and level progression
        const experienceGained = 1200; // Enough for potential level up
        
        if (this.systemIntegration.adventureEngine) {
            this.systemIntegration.adventureEngine.awardExperience(experienceGained, 'demo_encounters');
            this.log('Awarded ' + experienceGained + ' XP to party');
        }
    }

    /**
     * Phase 8: System Analytics and Status
     */
    async demonstrateSystemAnalytics() {
        this.log('📊 System Analytics and Integration Status');
        
        // Overall system status
        const systemStatus = this.systemIntegration.getSystemStatus();
        this.log('🔧 System Integration Status:', {
            initialized: systemStatus.initialized,
            integrationLevel: systemStatus.integrationLevel,
            activeSystems: systemStatus.activeFeatures,
            eventSystemActive: systemStatus.eventSystemActive
        });
        
        // Adventure engine statistics
        if (this.systemIntegration.adventureEngine) {
            const adventureStats = this.systemIntegration.adventureEngine.getStatistics();
            this.log('🎲 Adventure Engine Statistics:', adventureStats);
        }
        
        // Character progression summary
        this.log('Party Status Summary:');
        this.demoParty.forEach(character => {
            const statusText = '  ' + character.name + ': Level ' + character.classes[0].level + 
                             ', HP: ' + character.hitPoints + '/' + character.maxHitPoints + 
                             ', XP: ' + (character.experience || 0);
            this.log(statusText);
        });
        
        // Integration validation
        const validation = await this.systemIntegration.validateSystemIntegration();
        this.log('✅ Integration Validation:', validation);
    }

    /**
     * Utility method to log demo progress
     */
    log(message, data = null) {
        const timestamp = new Date().toISOString().substr(11, 8);
        const logEntry = {
            timestamp: timestamp,
            message: message,
            data: data
        };
        
        this.demoLog.push(logEntry);
        
        if (data) {
            console.log(`[${timestamp}] ${message}`, data);
        } else {
            console.log(`[${timestamp}] ${message}`);
        }
    }

    /**
     * Generate comprehensive demo report
     */
    generateDemoReport() {
        const report = {
            demoCompleted: true,
            timestamp: new Date().toISOString(),
            systemStatus: this.systemIntegration?.getSystemStatus(),
            partyCreated: this.demoParty.length,
            adventureGenerated: !!this.currentAdventure,
            integrationLevel: this.systemIntegration?.calculateIntegrationLevel() || 0,
            logEntries: this.demoLog.length,
            summary: {
                charactersCreated: this.demoParty.length,
                adventureTitle: this.currentAdventure?.title,
                systemsIntegrated: this.systemIntegration?.getActiveSystemsList() || [],
                demonstrationsCompleted: [
                    'Character Creation',
                    'Party Formation', 
                    'Adventure Generation',
                    'Combat Integration',
                    'Spell System',
                    'Treasure Distribution',
                    'System Analytics'
                ]
            }
        };
        
        console.log('\n' + '='.repeat(60));
        console.log('📋 DEMO REPORT SUMMARY');
        console.log('='.repeat(60));
        console.log('Integration Level: ' + report.integrationLevel + '%');
        console.log('Characters Created: ' + report.partyCreated);
        console.log('Adventure: ' + (report.summary.adventureTitle || 'N/A'));
        console.log('Active Systems: ' + report.summary.systemsIntegrated.join(', '));
        console.log('Log Entries: ' + report.logEntries);
        console.log('='.repeat(60));
        
        return report;
    }
}

// Export for both browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntegratedSystemDemo;
} else if (typeof window !== 'undefined') {
    window.IntegratedSystemDemo = IntegratedSystemDemo;
}

// Auto-run demo if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    const demo = new IntegratedSystemDemo();
    demo.runFullDemo().catch(console.error);
}
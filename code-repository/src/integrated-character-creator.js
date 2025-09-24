/**
 * IntegratedCharacterCreator - Main Game Controller
 * Coordinates DiceEngine, CharacterGenerator, and AdventureEngine
 */

class IntegratedCharacterCreator {
    constructor() {
        this.diceEngine = null;
        this.characterGenerator = null;
        this.adventureEngine = null;
        this.gameState = {
            currentCharacter: null,
            activeAdventure: null,
            sessionLog: []
        };

        this.initialize();
    }

    initialize() {
        console.log('🎲 Initializing RulzLawyer Game System...');
        
        try {
            if (typeof DiceEngine !== 'undefined') {
                this.diceEngine = new DiceEngine();
                this.log('✅ Dice engine initialized');
            }

            if (typeof CharacterGenerator !== 'undefined') {
                this.characterGenerator = new CharacterGenerator(this.diceEngine);
                this.log('✅ Character generator initialized');
            }

            if (typeof AdventureEngine !== 'undefined') {
                this.adventureEngine = new AdventureEngine(this.diceEngine);
                this.log('✅ Adventure engine initialized');
            }

            this.log('🎯 Game system ready!');
            return true;
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            return false;
        }
    }

    createRandomCharacter() {
        try {
            if (!this.characterGenerator) {
                throw new Error('Character generator not available');
            }

            const character = this.characterGenerator.generateRandomCharacter();
            this.gameState.currentCharacter = character;
            
            this.log(`📊 Generated: ${character.name} the ${character.race} ${character.characterClass}`);
            return character;
        } catch (error) {
            this.log('❌ Character creation failed: ' + error.message);
            throw error;
        }
    }

    startAdventure(adventureType = 'random', duration = 6) {
        try {
            if (!this.adventureEngine) {
                throw new Error('Adventure engine not available');
            }

            if (!this.gameState.currentCharacter) {
                throw new Error('No character selected. Create a character first.');
            }

            const character = this.gameState.currentCharacter;
            const adventure = this.adventureEngine.generateAdventure(character.level, adventureType, duration);
            this.gameState.activeAdventure = adventure;
            
            this.log(`🗡️ Adventure: ${adventure.title}`);
            this.log(`📖 ${adventure.description}`);
            
            return adventure;
        } catch (error) {
            this.log('❌ Adventure start failed: ' + error.message);
            throw error;
        }
    }

    processCurrentEncounter() {
        try {
            if (!this.adventureEngine || !this.gameState.activeAdventure) {
                throw new Error('No active adventure');
            }

            const encounter = this.adventureEngine.getCurrentEncounter();
            if (!encounter) {
                this.log('🏁 Adventure completed!');
                return this.completeAdventure();
            }

            this.log(`⚔️ Encounter: ${encounter.name} (CR ${encounter.cr})`);
            this.log(`📋 ${encounter.description}`);

            const result = this.adventureEngine.simulateEncounter(encounter);
            
            if (result) {
                this.log(`✨ ${result.resultText}`);
                if (result.experienceGained > 0) {
                    this.log(`📈 XP gained: ${result.experienceGained}`);
                }
                if (result.treasureGained) {
                    this.log(`💰 Found: ${result.treasureGained.item}`);
                }

                if (result.adventureComplete) {
                    return this.completeAdventure();
                }
            }

            return result;
        } catch (error) {
            this.log('❌ Encounter failed: ' + error.message);
            throw error;
        }
    }

    completeAdventure() {
        if (!this.gameState.activeAdventure) {
            return null;
        }

        const adventure = this.gameState.activeAdventure;
        this.log(`🎉 "${adventure.title}" completed!`);
        this.log(`📊 Total XP: ${adventure.experience}`);
        
        this.gameState.activeAdventure = null;
        return { completed: true, experience: adventure.experience };
    }

    rollDice(expression) {
        try {
            if (this.diceEngine) {
                return this.diceEngine.roll(expression);
            } else {
                // Fallback
                if (expression.includes('d20')) {
                    return Math.floor(Math.random() * 20) + 1;
                } else if (expression.includes('d6')) {
                    return Math.floor(Math.random() * 6) + 1;
                } else {
                    return Math.floor(Math.random() * 6) + 1;
                }
            }
        } catch (error) {
            this.log('❌ Dice roll failed: ' + error.message);
            return 1;
        }
    }

    log(message) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            message: message
        };
        
        this.gameState.sessionLog.push(logEntry);
        console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
        
        if (this.gameState.sessionLog.length > 50) {
            this.gameState.sessionLog.shift();
        }
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.IntegratedCharacterCreator = IntegratedCharacterCreator;
}
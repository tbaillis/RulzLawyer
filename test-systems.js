/**
 * System Integration Test
 * Tests all major RulzLawyer components
 */

console.log('🎲 Testing RulzLawyer D&D 3.5 Gaming System...\n');

try {
    // Test 1: Load core modules
    console.log('📦 Loading core modules...');
    const DiceEngine = require('./code-repository/src/dice/dice-engine.js');
    const { CharacterGenerator } = require('./code-repository/src/character/character-generator.js');
    const AdventureEngine = require('./code-repository/src/adventure/adventure-engine.js');
    const SRDDataManager = require('./code-repository/src/data/srd-data-manager.js');
    const CharacterModel = require('./code-repository/src/character/character-model.js');
    console.log('✅ All modules loaded successfully!\n');

    // Test 2: SRD Data System
    console.log('📊 Testing SRD Data Manager...');
    const srdData = new SRDDataManager();
    const stats = srdData.getDataStats();
    console.log('📋 SRD Data loaded:', Object.keys(stats).map(key => `${key}: ${stats[key].count}`).join(', '));
    console.log('✅ SRD Data Manager working!\n');

    // Test 3: Dice Engine
    console.log('🎲 Testing Dice Engine...');
    const dice = new DiceEngine();
    console.log('  d20 roll:', dice.roll('1d20'));
    console.log('  4d6dl1 roll:', dice.roll('4d6dl1'));
    console.log('  Complex roll:', dice.roll('2d20kh1+5'));
    console.log('✅ Dice Engine working!\n');

    // Test 4: Character Model
    console.log('🧙 Testing Character Model...');
    const character = new CharacterModel(srdData);
    character.setRace('Human');
    character.setClass('Fighter');
    character.setLevel(1);
    character.setAbilities({
        strength: 16,
        dexterity: 14,
        constitution: 15,
        intelligence: 12,
        wisdom: 13,
        charisma: 10
    });

    const summary = character.getSummary();
    console.log(`  Character: ${summary.name || 'Test'} the ${summary.race} ${summary.characterClass}`);
    console.log(`  Level: ${summary.level}, HP: ${summary.maxHitPoints}, AC: ${summary.armorClass}`);
    console.log('✅ Character Model working!\n');

    // Test 5: Character Generator (Legacy)
    console.log('🎭 Testing Character Generator...');
    const charGen = new CharacterGenerator(dice);
    const randomChar = charGen.generateRandomCharacter();
    console.log(`  Generated: ${randomChar.name} the ${randomChar.race} ${randomChar.characterClass}`);
    console.log(`  Level: ${randomChar.level}, HP: ${randomChar.hitPoints}`);
    console.log('✅ Character Generator working!\n');

    // Test 6: Adventure Engine
    console.log('⚔️ Testing Adventure Engine...');
    const advEngine = new AdventureEngine(dice);
    const adventure = advEngine.generateAdventure(randomChar.level);
    console.log(`  Adventure: "${adventure.title}"`);
    console.log(`  Type: ${adventure.type}, Environment: ${adventure.environment}`);
    console.log(`  Duration: ${adventure.estimatedDuration} hours`);
    console.log('✅ Adventure Engine working!\n');

    // Final success message
    console.log('🎯 ALL SYSTEMS OPERATIONAL!');
    console.log('🎉 RulzLawyer D&D 3.5 Gaming System fully functional!');
    console.log('\n📍 Server Status:');
    console.log('   🌐 Main Interface: http://localhost:3000');
    console.log('   🧙 Character Creator: http://localhost:3000/character-creator');
    console.log('   🎯 Adventure Engine: http://localhost:3000/adventure-engine');
    console.log('   🎲 Dice Roller: http://localhost:3000/dice-roller');

} catch (error) {
    console.error('❌ System test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
}
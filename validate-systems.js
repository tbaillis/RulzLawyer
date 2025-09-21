/**
 * Manual System Validation Script
 * Tests each major system component independently
 */

// Test all systems step by step
console.log('🧪 Starting manual system validation...');

// Test 1: Dice Engine
console.log('\n1️⃣ Testing Dice Engine...');
try {
    const diceEngine = new DiceEngine();
    const result = diceEngine.roll('3d6');
    console.log(`✅ Dice roll (3d6): ${result}`);
    console.log(`✅ Advanced roll (4d6kh3): ${diceEngine.roll('4d6kh3')}`);
} catch (error) {
    console.error('❌ Dice Engine failed:', error);
}

// Test 2: SRD Data
console.log('\n2️⃣ Testing SRD Data...');
try {
    if (typeof SRD_DATA !== 'undefined') {
        console.log(`✅ Races loaded: ${Object.keys(SRD_DATA.races).length}`);
        console.log(`✅ Classes loaded: ${Object.keys(SRD_DATA.classes).length}`);
        console.log(`✅ Example race - Human traits:`, SRD_DATA.races.human.traits);
    } else {
        console.error('❌ SRD_DATA not defined');
    }
} catch (error) {
    console.error('❌ SRD Data failed:', error);
}

// Test 3: Spell Manager
console.log('\n3️⃣ Testing Spell Manager...');
try {
    const spellManager = new SpellManager();
    const spellCount = Object.keys(spellManager.spellDatabase).length;
    console.log(`✅ Spells loaded: ${spellCount}`);
    
    // Test specific spell
    const fireball = spellManager.spellDatabase['fireball'];
    if (fireball) {
        console.log(`✅ Fireball spell:`, fireball.name, fireball.level, fireball.damage);
    }
} catch (error) {
    console.error('❌ Spell Manager failed:', error);
}

// Test 4: Equipment Manager
console.log('\n4️⃣ Testing Equipment Manager...');
try {
    const equipmentManager = new EquipmentManager();
    const weaponCount = Object.keys(equipmentManager.weapons).length;
    const armorCount = Object.keys(equipmentManager.armor).length;
    console.log(`✅ Weapons loaded: ${weaponCount}`);
    console.log(`✅ Armor loaded: ${armorCount}`);
    
    // Test specific weapon
    const longsword = equipmentManager.weapons['longsword'];
    if (longsword) {
        console.log(`✅ Longsword:`, longsword.name, longsword.damage, longsword.cost);
    }
} catch (error) {
    console.error('❌ Equipment Manager failed:', error);
}

// Test 5: Character Manager
console.log('\n5️⃣ Testing Character Manager...');
try {
    const characterManager = new CharacterManager();
    
    // Create test character
    const testChar = characterManager.createCharacter({
        name: 'Validation Wizard',
        race: 'elf',
        class: 'wizard',
        level: 3
    });
    
    console.log(`✅ Character created: ${testChar.name}`);
    console.log(`✅ Race: ${testChar.race}, Class: ${testChar.class}, Level: ${testChar.level}`);
    console.log(`✅ HP: ${testChar.hitPoints.current}/${testChar.hitPoints.maximum}`);
    console.log(`✅ AC: ${testChar.armorClass}`);
    console.log(`✅ Stats:`, testChar.abilities);
    
    // Test level up
    characterManager.levelUpCharacter(testChar, 'wizard');
    console.log(`✅ Leveled up to: ${testChar.level}`);
    
} catch (error) {
    console.error('❌ Character Manager failed:', error);
}

// Test 6: Adventure Engine
console.log('\n6️⃣ Testing Adventure Engine...');
try {
    const adventureEngine = new AdventureEngine();
    
    const adventure = adventureEngine.generateAdventure({
        partyLevel: 3,
        adventureType: 'dungeon',
        length: 'short'
    });
    
    console.log(`✅ Adventure generated: ${adventure.title}`);
    console.log(`✅ Description: ${adventure.description.substring(0, 100)}...`);
    
    // Test encounter generation
    const encounter = adventureEngine.generateEncounter(3);
    console.log(`✅ Encounter: ${encounter.type} (CR: ${encounter.challengeRating})`);
    
} catch (error) {
    console.error('❌ Adventure Engine failed:', error);
}

console.log('\n🎉 Manual validation complete!');
console.log('Check the console for any error messages.');
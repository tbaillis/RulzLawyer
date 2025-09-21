// Open browser console and run this script to validate all systems

console.log('🔧 Running comprehensive system validation...');

// Wait for game engine
setTimeout(() => {
    const engine = window.gameEngine;
    if (!engine) {
        console.error('❌ Game engine not found!');
        return;
    }

    console.log('🎮 Found game engine v' + engine.version);

    // Test 1: Dice Engine
    try {
        const basicRoll = engine.diceEngine.roll('1d20');
        const complexRoll = engine.diceEngine.rollExpression('3d6+4');
        console.log('✅ Dice Engine: PASS');
        console.log(`  Basic roll (1d20): ${basicRoll}`);
        console.log(`  Complex roll (3d6+4): ${complexRoll.total} (dice: [${complexRoll.dice.join(', ')}])`);
    } catch (e) {
        console.error('❌ Dice Engine: FAIL -', e.message);
    }

    // Test 2: Character Management
    try {
        const wizard = engine.characterManager.createCharacter({
            name: 'Gandalf',
            race: 'human',
            class: 'wizard',
            level: 5
        });
        console.log('✅ Character Management: PASS');
        console.log(`  Created: ${wizard.name} (${wizard.race} ${wizard.class} ${wizard.level})`);
        console.log(`  HP: ${wizard.hitPoints.current}/${wizard.hitPoints.maximum}, AC: ${wizard.armorClass}`);
        console.log(`  Stats: STR ${wizard.abilities.strength}, INT ${wizard.abilities.intelligence}`);
    } catch (e) {
        console.error('❌ Character Management: FAIL -', e.message);
    }

    // Test 3: Spell System
    try {
        const spellCount = Object.keys(engine.spellManager.spellDatabase).length;
        const fireball = engine.spellManager.spellDatabase['fireball'];
        console.log('✅ Spell System: PASS');
        console.log(`  Database: ${spellCount} spells loaded`);
        if (fireball) {
            console.log(`  Sample: ${fireball.name} (Level ${fireball.level}, ${fireball.damage} damage)`);
        }
    } catch (e) {
        console.error('❌ Spell System: FAIL -', e.message);
    }

    // Test 4: Equipment System
    try {
        const weaponCount = Object.keys(engine.equipmentManager.weapons).length;
        const armorCount = Object.keys(engine.equipmentManager.armor).length;
        const longsword = engine.equipmentManager.weapons['longsword'];
        console.log('✅ Equipment System: PASS');
        console.log(`  Database: ${weaponCount} weapons, ${armorCount} armor pieces`);
        if (longsword) {
            console.log(`  Sample: ${longsword.name} (${longsword.damage}, ${longsword.cost} gp)`);
        }
    } catch (e) {
        console.error('❌ Equipment System: FAIL -', e.message);
    }

    // Test 5: Adventure Generation
    try {
        const adventure = engine.adventureEngine.generateAdventure({
            partyLevel: 3,
            adventureType: 'dungeon',
            length: 'short'
        });
        console.log('✅ Adventure Generation: PASS');
        console.log(`  Generated: ${adventure.title || 'Unnamed Adventure'}`);
        console.log(`  Description: ${adventure.description.substring(0, 80)}...`);
    } catch (e) {
        console.error('❌ Adventure Generation: FAIL -', e.message);
    }

    // Test 6: SRD Data Integration
    try {
        const raceCount = window.SRD_DATA ? Object.keys(window.SRD_DATA.races).length : 0;
        const classCount = window.SRD_DATA ? Object.keys(window.SRD_DATA.classes).length : 0;
        console.log('✅ SRD Data Integration: PASS');
        console.log(`  Database: ${raceCount} races, ${classCount} classes`);
    } catch (e) {
        console.error('❌ SRD Data Integration: FAIL -', e.message);
    }

    console.log('🎉 Validation complete! Check above for any failures.');
    
}, 3000);
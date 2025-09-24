/**
 * D&D 3.5 System Demonstration
 * Shows complete functionality of Excel data conversion and character creation
 * Run with: node demo-character-creation.js
 */

const { DnDSystemIntegration } = require('./system-integration.js');

async function demonstrateSystem() {
    console.log('🎲 D&D 3.5 Character Creation System Demo');
    console.log('=' .repeat(50));
    
    // Initialize the system
    console.log('\n📚 Initializing D&D 3.5 System...');
    const system = new DnDSystemIntegration();
    await system.initialize();
    
    const status = system.getStatus();
    const dataStatus = status.dataManager;
    console.log('✅ System Status:');
    console.log(`   - Races: ${dataStatus.counts.races}`);
    console.log(`   - Classes: ${dataStatus.counts.classes}`);
    console.log(`   - Feats: ${dataStatus.counts.feats}`);
    console.log(`   - Spells: ${dataStatus.counts.spells}`);
    console.log(`   - Weapons: ${dataStatus.counts.weapons}`);
    console.log(`   - Armor: ${dataStatus.counts.armor}`);
    
    // Demonstrate character creation
    console.log('\n🧙‍♂️ Creating Sample Characters...');
    
    // Example 1: Human Fighter
    console.log('\n--- Character 1: Human Fighter ---');
    const fighter = system.createCharacter({
        name: 'Sir Galahad',
        race: 'Human',
        classes: [{ className: 'Fighter', level: 5 }],
        alignment: 'Lawful Good',
        baseAbilities: { 
            strength: 18, 
            dexterity: 14, 
            constitution: 16, 
            intelligence: 10, 
            wisdom: 12, 
            charisma: 8 
        }
    });
    
    displayCharacter(fighter);
    
    // Example 2: Elven Wizard
    console.log('\n--- Character 2: Elven Wizard ---');
    const wizard = system.createCharacter({
        name: 'Elaria Moonwhisper',
        race: 'Elf',
        classes: [{ className: 'Wizard', level: 7 }],
        alignment: 'Chaotic Good',
        baseAbilities: { 
            strength: 8, 
            dexterity: 16, 
            constitution: 12, 
            intelligence: 18, 
            wisdom: 14, 
            charisma: 10 
        }
    });
    
    displayCharacter(wizard);
    
    // Example 3: Halfling Rogue
    console.log('\n--- Character 3: Halfling Rogue ---');
    const rogue = system.createCharacter({
        name: 'Pip Lightfinger',
        race: 'Halfling',
        classes: [{ className: 'Rogue', level: 6 }],
        alignment: 'Chaotic Neutral',
        baseAbilities: { 
            strength: 10, 
            dexterity: 18, 
            constitution: 14, 
            intelligence: 14, 
            wisdom: 12, 
            charisma: 16 
        }
    });
    
    displayCharacter(rogue);
    
    // Example 4: Dwarven Cleric
    console.log('\n--- Character 4: Dwarven Cleric ---');
    const cleric = system.createCharacter({
        name: 'Thorin Stoneprayer',
        race: 'Dwarf',
        classes: [{ className: 'Cleric', level: 4 }],
        alignment: 'Lawful Good',
        baseAbilities: { 
            strength: 14, 
            dexterity: 10, 
            constitution: 16, 
            intelligence: 12, 
            wisdom: 18, 
            charisma: 8 
        }
    });
    
    displayCharacter(cleric);
    
    // Example 5: Multiclass Character
    console.log('\n--- Character 5: Multiclass Fighter/Wizard ---');
    const multiclass = system.createCharacter({
        name: 'Aerdrie the Spellsword',
        race: 'Half-Elf',
        classes: [
            { className: 'Fighter', level: 3 },
            { className: 'Wizard', level: 4 }
        ],
        alignment: 'Neutral Good',
        baseAbilities: { 
            strength: 16, 
            dexterity: 14, 
            constitution: 14, 
            intelligence: 16, 
            wisdom: 12, 
            charisma: 10 
        }
    });
    
    displayCharacter(multiclass);
    
    // Demonstrate data queries
    console.log('\n🔍 Data Query Demonstrations...');
    
    const dataManager = system.dataManager;
    
    console.log('\n--- Available Races ---');
    const races = dataManager.getRaces();
    races.forEach(race => {
        const adjustments = Object.entries(race.ability_adjustments || {})
            .map(([ability, mod]) => `${ability.substring(0,3).toUpperCase()}${mod >= 0 ? '+' : ''}${mod}`)
            .join(', ');
        console.log(`• ${race.name}: ${adjustments || 'No modifiers'}`);
    });
    
    console.log('\n--- Spellcasting Classes ---');
    const classes = dataManager.getClasses().filter(c => c.spellcasting);
    classes.forEach(cls => {
        const spellAbility = cls.spell_save_dc_ability || 'Unknown';
        console.log(`• ${cls.name}: Uses ${spellAbility} for spells`);
    });
    
    console.log('\n--- Sample 3rd Level Spells ---');
    const level3Spells = dataManager.getSpellsByClassAndLevel('Wizard', 3);
    level3Spells.slice(0, 5).forEach(spell => {
        console.log(`• ${spell.name}: Wizard (${spell.school})`);
    });
    
    console.log('\n--- Martial Weapons ---');
    const martialWeapons = dataManager.getWeapons('martial_melee');
    martialWeapons.slice(0, 5).forEach(weapon => {
        console.log(`• ${weapon.name}: ${weapon.damage} (${weapon.critical})`);
    });
    
    // Performance demonstration
    console.log('\n⚡ Performance Test...');
    const startTime = Date.now();
    const characters = [];
    
    for (let i = 0; i < 1000; i++) {
        const testCharacter = system.createCharacter({
            name: `Test Character ${i}`,
            race: ['Human', 'Elf', 'Dwarf', 'Halfling'][i % 4],
            classes: [{ className: ['Fighter', 'Wizard', 'Rogue', 'Cleric'][i % 4], level: (i % 10) + 1 }]
        });
        characters.push(testCharacter);
    }
    
    const endTime = Date.now();
    console.log(`✅ Created 1,000 characters in ${endTime - startTime}ms`);
    console.log(`   Average: ${((endTime - startTime) / 1000).toFixed(2)}ms per character`);
    
    // System statistics
    console.log('\n📊 System Statistics:');
    console.log(`   - Total characters created: ${characters.length}`);
    console.log(`   - Average HP: ${Math.round(characters.reduce((sum, c) => sum + c.hitPoints.max, 0) / characters.length)}`);
    console.log(`   - Highest level character: Level ${Math.max(...characters.map(c => c.level))}`);
    
    console.log('\n🎉 Demonstration Complete!');
    console.log('=' .repeat(50));
    console.log('Excel data successfully converted to fully functional D&D 3.5 web system!');
}

function displayCharacter(character) {
    console.log(`📋 ${character.name} (${character.race})`);
    console.log(`   Level ${character.level} ${character.classes.map(c => `${c.className} ${c.level}`).join('/')}`);
    console.log(`   Alignment: ${character.alignment}`);
    
    // Display abilities
    const abilities = character.abilities;
    const mods = character.abilityModifiers;
    console.log(`   Abilities: STR ${abilities.strength}(${mods.strength >= 0 ? '+' : ''}${mods.strength}) ` +
                `DEX ${abilities.dexterity}(${mods.dexterity >= 0 ? '+' : ''}${mods.dexterity}) ` +
                `CON ${abilities.constitution}(${mods.constitution >= 0 ? '+' : ''}${mods.constitution}) ` +
                `INT ${abilities.intelligence}(${mods.intelligence >= 0 ? '+' : ''}${mods.intelligence}) ` +
                `WIS ${abilities.wisdom}(${mods.wisdom >= 0 ? '+' : ''}${mods.wisdom}) ` +
                `CHA ${abilities.charisma}(${mods.charisma >= 0 ? '+' : ''}${mods.charisma})`);
    
    // Display combat stats
    console.log(`   HP: ${character.hitPoints.current}/${character.hitPoints.max}, AC: ${character.armorClass.total}, BAB: +${character.baseAttackBonus}`);
    
    // Display saves
    const saves = character.savingThrows;
    console.log(`   Saves: Fort +${saves.fortitude}, Ref +${saves.reflex}, Will +${saves.will}`);
    
    // Display spells if applicable
    if (character.spellsPerDay && Object.keys(character.spellsPerDay).length > 0) {
        console.log(`   Spells: ${Object.entries(character.spellsPerDay)
            .map(([cls, spells]) => `${cls} ${Object.entries(spells)
                .map(([level, count]) => `${level}:${count}`)
                .join(' ')}`).join(', ')}`);
    }
    
    // Validation status
    const validation = character.validation;
    if (validation.valid) {
        console.log('   ✅ Character is valid');
    } else {
        console.log('   ⚠️ Validation issues:', validation.errors.join(', '));
    }
}

// Run demonstration
if (require.main === module) {
    demonstrateSystem().catch(error => {
        console.error('Demo failed:', error);
        process.exit(1);
    });
}

module.exports = { demonstrateSystem };
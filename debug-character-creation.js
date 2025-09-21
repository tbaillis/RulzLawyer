console.log('🧪 COMPREHENSIVE CHARACTER CREATION TEST');
console.log('=' * 50);

// Wait for page to fully load
setTimeout(() => {
    console.log('\n🔍 Testing Character Creation System...');
    
    // Test 1: Check if game engine is available
    console.log('\n1. 🎮 Game Engine Availability:');
    if (window.gameEngine) {
        console.log('   ✅ Game engine found');
        console.log('   📝 Version:', window.gameEngine.version);
        
        // Check components
        if (window.gameEngine.characterManager) {
            console.log('   ✅ Character Manager available');
        } else {
            console.log('   ❌ Character Manager missing');
        }
        
        if (window.gameEngine.storageManager) {
            console.log('   ✅ Storage Manager available');
        } else {
            console.log('   ❌ Storage Manager missing');
        }
    } else {
        console.log('   ❌ Game engine not found');
        return;
    }
    
    // Test 2: Check if web interface is available
    console.log('\n2. 🌐 Web Interface:');
    if (window.webInterface) {
        console.log('   ✅ Web interface found');
    } else {
        console.log('   ❌ Web interface missing');
    }
    
    // Test 3: Check form elements
    console.log('\n3. 📝 Form Elements:');
    const formElements = {
        'character-form': document.getElementById('character-form'),
        'char-name': document.getElementById('char-name'),
        'char-race': document.getElementById('char-race'),
        'char-class': document.getElementById('char-class'),
        'char-level': document.getElementById('char-level'),
        'character-modal': document.getElementById('character-modal')
    };
    
    Object.entries(formElements).forEach(([name, element]) => {
        if (element) {
            console.log(`   ✅ ${name} found`);
        } else {
            console.log(`   ❌ ${name} missing`);
        }
    });
    
    // Test 4: Test character creation function
    console.log('\n4. 🧙‍♂️ Character Creation Test:');
    try {
        if (window.gameEngine && window.gameEngine.characterManager) {
            const testChar = window.gameEngine.characterManager.createCharacter({
                name: 'Console Test Hero',
                race: 'Human', 
                class: 'Fighter',
                level: 1
            });
            
            console.log('   ✅ Character creation successful');
            console.log('   📊 Character details:');
            console.log('      Name:', testChar.name);
            console.log('      Race:', testChar.race);
            console.log('      Class:', testChar.class);
            console.log('      Level:', testChar.level);
            console.log('      HP:', testChar.hitPoints.maximum);
            console.log('      ID:', testChar.id);
        }
    } catch (error) {
        console.log('   ❌ Character creation failed:', error.message);
    }
    
    // Test 5: Test global functions
    console.log('\n5. 🔗 Global Function Availability:');
    const globalFunctions = [
        'createNewCharacter',
        'rollDice',
        'closeModal'
    ];
    
    globalFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`   ✅ ${funcName} available`);
        } else {
            console.log(`   ❌ ${funcName} missing`);
        }
    });
    
    // Test 6: Storage test
    console.log('\n6. 💾 Storage Test:');
    try {
        if (window.gameEngine && window.gameEngine.storageManager) {
            const characters = window.gameEngine.storageManager.getAllCharacters();
            console.log(`   📋 Characters in storage: ${characters.length}`);
            
            if (characters.length > 0) {
                characters.forEach((char, index) => {
                    console.log(`   ${index + 1}. ${char.name} (${char.race} ${char.class})`);
                });
            }
        }
    } catch (error) {
        console.log('   ❌ Storage test failed:', error.message);
    }
    
    // Test 7: Modal functionality test
    console.log('\n7. 🎪 Modal Test:');
    try {
        if (typeof window.createNewCharacter === 'function') {
            console.log('   🧪 Testing createNewCharacter function...');
            window.createNewCharacter();
            
            const modal = document.getElementById('character-modal');
            if (modal && (modal.style.display === 'flex' || modal.classList.contains('active'))) {
                console.log('   ✅ Modal opens successfully');
                
                // Close it
                if (typeof window.closeModal === 'function') {
                    window.closeModal('character-modal');
                    console.log('   ✅ Modal closes successfully');
                }
            } else {
                console.log('   ❌ Modal did not open');
            }
        }
    } catch (error) {
        console.log('   ❌ Modal test failed:', error.message);
    }
    
    console.log('\n🎯 CHARACTER CREATION TEST COMPLETE');
    console.log('If you see errors above, character creation may not be working properly.');
    console.log('If all tests pass, try creating a character manually using the interface.');
    
}, 2000); // Wait 2 seconds for everything to load
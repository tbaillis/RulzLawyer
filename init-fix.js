/**
 * RulzLawyer Application Initialization Fix
 * This script ensures proper loading order and browser compatibility
 */

// Initialize the application step by step
console.log('🔧 Starting RulzLawyer initialization fix...');

// Step 1: Wait for all dependencies to load
function waitForDependencies() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50;
        
        const checkDependencies = () => {
            attempts++;
            
            // Check if all required classes are available
            const requiredClasses = [
                'DiceEngine', 'CharacterManager', 'AdventureEngine', 
                'StorageManager', 'SpellManager', 'EquipmentManager',
                'RandomTablesEngine', 'RulzLawyerGameEngine', 'RulzLawyerWebInterface'
            ];
            
            const missingClasses = requiredClasses.filter(className => 
                typeof window[className] === 'undefined'
            );
            
            if (missingClasses.length === 0) {
                console.log('✅ All dependencies loaded successfully');
                resolve();
            } else if (attempts >= maxAttempts) {
                console.error('❌ Failed to load dependencies:', missingClasses);
                reject(new Error(`Missing dependencies: ${missingClasses.join(', ')}`));
            } else {
                console.log(`⏳ Waiting for dependencies... (${attempts}/${maxAttempts}) Missing: ${missingClasses.join(', ')}`);
                setTimeout(checkDependencies, 100);
            }
        };
        
        checkDependencies();
    });
}

// Step 2: Initialize Game Engine
async function initializeGameEngine() {
    try {
        console.log('⚙️ Initializing Game Engine...');
        window.gameEngine = new window.RulzLawyerGameEngine();
        
        // Wait for game engine to be fully initialized
        let attempts = 0;
        while (attempts < 50 && (!window.gameEngine.diceEngine || !window.gameEngine.characterManager)) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (window.gameEngine.diceEngine && window.gameEngine.characterManager) {
            console.log('✅ Game Engine initialized successfully');
        } else {
            throw new Error('Game Engine initialization incomplete');
        }
    } catch (error) {
        console.error('❌ Game Engine initialization failed:', error);
        throw error;
    }
}

// Step 3: Initialize Web Interface  
async function initializeWebInterface() {
    try {
        console.log('🌐 Initializing Web Interface...');
        window.webInterface = new window.RulzLawyerWebInterface();
        
        // Wait for web interface to connect to game engine
        let attempts = 0;
        while (attempts < 50 && (!window.webInterface.gameEngine)) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (window.webInterface.gameEngine) {
            console.log('✅ Web Interface initialized successfully');
        } else {
            throw new Error('Web Interface failed to connect to game engine');
        }
    } catch (error) {
        console.error('❌ Web Interface initialization failed:', error);
        throw error;
    }
}

// Step 4: Verify Global Functions
function verifyGlobalFunctions() {
    console.log('🔍 Verifying global functions...');
    
    const requiredFunctions = [
        'rollDice', 'createNewCharacter', 'showCharacterStats',
        'rollAdvantage', 'rollDisadvantage', 'closeModal'
    ];
    
    const missingFunctions = requiredFunctions.filter(funcName => 
        typeof window[funcName] !== 'function'
    );
    
    if (missingFunctions.length === 0) {
        console.log('✅ All global functions are available');
        return true;
    } else {
        console.error('❌ Missing global functions:', missingFunctions);
        return false;
    }
}

// Step 5: Test Basic Functionality
function testBasicFunctionality() {
    console.log('🧪 Testing basic functionality...');
    
    try {
        // Test dice engine
        if (window.gameEngine?.diceEngine) {
            const testRoll = window.gameEngine.diceEngine.rollExpression('1d20');
            console.log('✅ Dice engine working - test roll:', testRoll.total);
        }
        
        // Test global function
        if (typeof window.rollDice === 'function') {
            console.log('✅ Global rollDice function available');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Basic functionality test failed:', error);
        return false;
    }
}

// Main initialization sequence
async function initializeApplication() {
    try {
        console.log('🚀 Starting RulzLawyer application initialization...');
        
        // Step 1: Wait for all scripts to load
        await waitForDependencies();
        
        // Step 2: Initialize Game Engine
        await initializeGameEngine();
        
        // Step 3: Initialize Web Interface
        await initializeWebInterface();
        
        // Step 4: Verify Global Functions
        const functionsReady = verifyGlobalFunctions();
        
        // Step 5: Test Basic Functionality
        const testsPass = testBasicFunctionality();
        
        if (functionsReady && testsPass) {
            console.log('🎉 RulzLawyer initialization complete! All systems operational.');
            
            // Show success message to user
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 10000;
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white; padding: 15px 20px; border-radius: 8px;
                font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            notification.textContent = '✅ RulzLawyer Ready!';
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 3000);
            
        } else {
            throw new Error('Application initialization incomplete');
        }
        
    } catch (error) {
        console.error('❌ Application initialization failed:', error);
        
        // Show error message to user
        const errorNotification = document.createElement('div');
        errorNotification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: linear-gradient(135deg, #dc3545, #c82333);
            color: white; padding: 15px 20px; border-radius: 8px;
            font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        errorNotification.textContent = '❌ Initialization Failed - Check Console';
        document.body.appendChild(errorNotification);
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Add a small delay to ensure all scripts are loaded
        setTimeout(initializeApplication, 500);
    });
} else {
    // DOM is already loaded
    setTimeout(initializeApplication, 500);
}
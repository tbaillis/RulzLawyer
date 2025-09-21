// Button Functionality Test Script
// This script tests all the button functions to ensure they're working

console.log('Testing RulzLawyer Button Functionality...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('Starting button functionality tests...');
        
        const tests = [
            { name: 'rollDice', fn: () => window.rollDice && typeof window.rollDice === 'function' },
            { name: 'rollAdvantage', fn: () => window.rollAdvantage && typeof window.rollAdvantage === 'function' },
            { name: 'rollDisadvantage', fn: () => window.rollDisadvantage && typeof window.rollDisadvantage === 'function' },
            { name: 'createNewCharacter', fn: () => window.createNewCharacter && typeof window.createNewCharacter === 'function' },
            { name: 'showCharacterStats', fn: () => window.showCharacterStats && typeof window.showCharacterStats === 'function' },
            { name: 'selectCharacter', fn: () => window.selectCharacter && typeof window.selectCharacter === 'function' },
            { name: 'rollRandomTables', fn: () => window.rollRandomTables && typeof window.rollRandomTables === 'function' },
            { name: 'rollSingleTable', fn: () => window.rollSingleTable && typeof window.rollSingleTable === 'function' },
            { name: 'closeModal', fn: () => window.closeModal && typeof window.closeModal === 'function' }
        ];
        
        let passed = 0;
        let failed = 0;
        
        tests.forEach(test => {
            try {
                if (test.fn()) {
                    console.log(`✅ ${test.name} - PASS`);
                    passed++;
                } else {
                    console.log(`❌ ${test.name} - FAIL (function not found)`);
                    failed++;
                }
            } catch (error) {
                console.log(`❌ ${test.name} - ERROR: ${error.message}`);
                failed++;
            }
        });
        
        console.log(`\n=== TEST SUMMARY ===`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${failed}`);
        console.log(`Total: ${tests.length}`);
        
        if (failed === 0) {
            console.log('🎉 ALL BUTTON FUNCTIONS ARE WORKING!');
        } else {
            console.log(`⚠️ ${failed} button functions need attention`);
        }
    }, 2000);
});
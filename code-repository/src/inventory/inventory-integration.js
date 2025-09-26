/**
 * InventoryIntegration - Character System Integration for Inventory
 * 
 * Connects the inventory management system with the character creation
 * and calculation systems for seamless equipment handling
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class InventoryIntegration {
    constructor(inventoryManager, calculationEngine, characterEngine) {
        this.inventoryManager = inventoryManager;
        this.calculationEngine = calculationEngine;
        this.characterEngine = characterEngine;
        
        // Event system for real-time updates
        this.eventHandlers = {
            equipmentChanged: [],
            inventoryUpdated: [],
            encumbranceChanged: []
        };
        
        console.log('🔗 Inventory Integration initialized');
    }

    // ===== CHARACTER INTEGRATION =====

    /**
     * Initialize inventory for a character
     */
    initializeCharacterInventory(character) {
        try {
            // Initialize inventory manager with character
            const inventory = this.inventoryManager.initializeInventory(character);
            
            // Update character with inventory reference
            character.inventory = inventory;
            
            // Calculate initial equipment effects
            this.updateCharacterFromInventory(character);
            
            // Trigger events
            this.triggerEvent('inventoryUpdated', { character, inventory });
            
            console.log(`📦 Initialized inventory for ${character.name || 'Character'}`);
            
            return inventory;
            
        } catch (error) {
            console.error('Error initializing character inventory:', error);
            throw error;
        }
    }

    /**
     * Update character stats based on equipped items
     */
    updateCharacterFromInventory(character) {
        const equipmentBonuses = this.inventoryManager.currentInventory.equipmentBonuses;
        const encumbrance = this.inventoryManager.currentInventory.encumbrance;
        
        // Store original values if not already stored
        if (!character.originalStats) {
            character.originalStats = {
                abilities: { ...character.abilities },
                savingThrows: { ...character.savingThrows },
                armorClass: character.armorClass,
                skills: { ...character.skills }
            };
        }
        
        // Reset to original stats
        character.abilities = { ...character.originalStats.abilities };
        character.savingThrows = { ...character.originalStats.savingThrows };
        character.armorClass = character.originalStats.armorClass;
        character.skills = { ...character.originalStats.skills };
        
        // Apply equipment bonuses
        this.applyEquipmentBonuses(character, equipmentBonuses);
        
        // Apply encumbrance effects
        this.applyEncumbranceEffects(character, encumbrance);
        
        // Recalculate derived stats
        this.recalculateCharacterStats(character);
        
        // Trigger events
        this.triggerEvent('equipmentChanged', { character, equipmentBonuses, encumbrance });
    }

    /**
     * Apply equipment bonuses to character
     */
    applyEquipmentBonuses(character, bonuses) {
        // Ability bonuses
        if (bonuses.abilities) {
            Object.keys(bonuses.abilities).forEach(ability => {
                if (character.abilities[ability] !== undefined) {
                    character.abilities[ability] += bonuses.abilities[ability];
                }
            });
        }
        
        // AC bonuses
        if (bonuses.ac) {
            character.armorClass += bonuses.ac;
        }
        
        // Saving throw bonuses
        if (bonuses.saves) {
            Object.keys(bonuses.saves).forEach(save => {
                if (character.savingThrows[save] !== undefined) {
                    character.savingThrows[save] += bonuses.saves[save];
                }
            });
        }
        
        // Skill bonuses
        if (bonuses.skills) {
            Object.keys(bonuses.skills).forEach(skill => {
                if (!character.skills[skill]) {
                    character.skills[skill] = 0;
                }
                character.skills[skill] += bonuses.skills[skill];
            });
        }
        
        // Store equipment bonuses for reference
        character.equipmentBonuses = bonuses;
    }

    /**
     * Apply encumbrance effects to character
     */
    applyEncumbranceEffects(character, encumbrance) {
        // Encumbrance affects movement and skills
        const encumbranceEffects = {
            light: { speedMultiplier: 1.0, maxDexBonus: null, checkPenalty: 0, runMultiplier: 4 },
            medium: { speedMultiplier: 0.75, maxDexBonus: 3, checkPenalty: -3, runMultiplier: 4 },
            heavy: { speedMultiplier: 0.5, maxDexBonus: 1, checkPenalty: -6, runMultiplier: 3 },
            overloaded: { speedMultiplier: 0, maxDexBonus: 0, checkPenalty: -6, runMultiplier: 0 }
        };
        
        const effects = encumbranceEffects[encumbrance];
        if (!effects) return;
        
        // Apply speed reduction
        if (character.speed) {
            character.speed.current = Math.floor(character.speed.base * effects.speedMultiplier);
        }
        
        // Apply max dex bonus to AC
        if (effects.maxDexBonus !== null) {
            const dexModifier = this.calculationEngine.getAbilityModifier(character.abilities.dexterity);
            const maxDexBonus = Math.min(dexModifier, effects.maxDexBonus);
            character.armorClass = character.armorClass - dexModifier + maxDexBonus;
        }
        
        // Apply armor check penalty to relevant skills
        if (effects.checkPenalty !== 0) {
            const affectedSkills = [
                'Balance', 'Climb', 'Escape Artist', 'Hide', 'Jump',
                'Move Silently', 'Sleight of Hand', 'Swim', 'Tumble'
            ];
            
            affectedSkills.forEach(skill => {
                if (character.skills[skill] !== undefined) {
                    character.skills[skill] += effects.checkPenalty;
                }
            });
        }
        
        // Store encumbrance info
        character.encumbrance = {
            level: encumbrance,
            effects: effects
        };
        
        // Trigger encumbrance change event if level changed
        if (character.previousEncumbrance !== encumbrance) {
            this.triggerEvent('encumbranceChanged', { character, oldLevel: character.previousEncumbrance, newLevel: encumbrance });
            character.previousEncumbrance = encumbrance;
        }
    }

    /**
     * Recalculate derived character stats
     */
    recalculateCharacterStats(character) {
        // Recalculate ability modifiers
        Object.keys(character.abilities).forEach(ability => {
            const modifier = this.calculationEngine.getAbilityModifier(character.abilities[ability]);
            character.abilityModifiers[ability] = modifier;
        });
        
        // Recalculate AC with new dex modifier
        const baseAC = 10;
        const dexModifier = character.abilityModifiers.dexterity;
        const armorBonus = this.getEquippedArmorBonus();
        const shieldBonus = this.getEquippedShieldBonus();
        const naturalArmorBonus = character.equipmentBonuses?.naturalArmor || 0;
        const deflectionBonus = character.equipmentBonuses?.deflection || 0;
        
        character.armorClass = baseAC + dexModifier + armorBonus + shieldBonus + naturalArmorBonus + deflectionBonus;
        
        // Recalculate hit points if constitution changed
        const conModifier = character.abilityModifiers.constitution;
        if (character.originalStats && character.originalStats.abilities.constitution !== character.abilities.constitution) {
            const conChange = conModifier - this.calculationEngine.getAbilityModifier(character.originalStats.abilities.constitution);
            const hpChange = conChange * character.level;
            character.hitPoints.max += hpChange;
            character.hitPoints.current += hpChange;
        }
        
        // Recalculate saving throws
        character.savingThrows.fortitude = this.calculationEngine.calculateSavingThrow(
            character, 'fortitude', character.abilityModifiers.constitution
        );
        character.savingThrows.reflex = this.calculationEngine.calculateSavingThrow(
            character, 'reflex', character.abilityModifiers.dexterity
        );
        character.savingThrows.will = this.calculationEngine.calculateSavingThrow(
            character, 'will', character.abilityModifiers.wisdom
        );
        
        // Recalculate skill totals
        Object.keys(character.skills).forEach(skill => {
            const skillData = this.calculationEngine.getSkillData(skill);
            if (skillData) {
                const abilityModifier = character.abilityModifiers[skillData.ability] || 0;
                const ranks = character.skillRanks[skill] || 0;
                const miscBonus = character.skillBonuses[skill] || 0;
                
                character.skills[skill] = ranks + abilityModifier + miscBonus;
            }
        });
    }

    /**
     * Get equipped armor AC bonus
     */
    getEquippedArmorBonus() {
        const equippedArmor = this.inventoryManager.currentInventory.equipped.body;
        return equippedArmor ? (equippedArmor.ac || 0) : 0;
    }

    /**
     * Get equipped shield AC bonus
     */
    getEquippedShieldBonus() {
        const equippedShield = this.inventoryManager.currentInventory.equipped.shield;
        return equippedShield ? (equippedShield.ac || 0) : 0;
    }

    // ===== EQUIPMENT MANAGEMENT =====

    /**
     * Equip item and update character
     */
    equipItem(character, item, slot) {
        try {
            // Use inventory manager to equip item
            const success = this.inventoryManager.equipItem(item, slot);
            
            if (success) {
                // Update character stats
                this.updateCharacterFromInventory(character);
                
                console.log(`⚔️ Equipped ${item.name} to ${slot} for ${character.name || 'Character'}`);
                
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('Error equipping item:', error);
            throw error;
        }
    }

    /**
     * Unequip item and update character
     */
    unequipItem(character, slot, targetContainer = 'backpack') {
        try {
            // Use inventory manager to unequip item
            const unequippedItem = this.inventoryManager.unequipItem(slot, targetContainer);
            
            if (unequippedItem) {
                // Update character stats
                this.updateCharacterFromInventory(character);
                
                console.log(`🎒 Unequipped ${unequippedItem.name} from ${slot} for ${character.name || 'Character'}`);
                
                return unequippedItem;
            }
            
            return null;
            
        } catch (error) {
            console.error('Error unequipping item:', error);
            throw error;
        }
    }

    /**
     * Add item to inventory and update character if needed
     */
    addItem(character, item, container = 'backpack') {
        try {
            // Use inventory manager to add item
            const success = this.inventoryManager.addToContainer(item, container);
            
            if (success) {
                // Update character stats (weight might have changed)
                this.updateCharacterFromInventory(character);
                
                console.log(`📦 Added ${item.name} to ${container} for ${character.name || 'Character'}`);
                
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('Error adding item:', error);
            throw error;
        }
    }

    /**
     * Remove item from inventory
     */
    removeItem(character, item, container) {
        try {
            // Use inventory manager to remove item
            const success = this.inventoryManager.removeFromContainer(item, container);
            
            if (success) {
                // Update character stats (weight might have changed)
                this.updateCharacterFromInventory(character);
                
                console.log(`🗑️ Removed ${item.name} from ${container} for ${character.name || 'Character'}`);
                
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('Error removing item:', error);
            throw error;
        }
    }

    /**
     * Apply equipment preset to character
     */
    applyPreset(character, presetName) {
        try {
            // Use inventory manager to apply preset
            const result = this.inventoryManager.applyPreset(presetName);
            
            if (result.success) {
                // Update character stats
                this.updateCharacterFromInventory(character);
                
                console.log(`🔄 Applied preset "${presetName}" to ${character.name || 'Character'}`);
                
                return result;
            }
            
            return null;
            
        } catch (error) {
            console.error('Error applying preset:', error);
            throw error;
        }
    }

    // ===== COMBAT INTEGRATION =====

    /**
     * Get character's combat statistics with equipment
     */
    getCombatStats(character) {
        const mainHandWeapon = this.inventoryManager.currentInventory.equipped.mainHand;
        const offHandWeapon = this.inventoryManager.currentInventory.equipped.offHand;
        const shield = this.inventoryManager.currentInventory.equipped.shield;
        
        const stats = {
            armorClass: character.armorClass,
            hitPoints: character.hitPoints,
            savingThrows: character.savingThrows,
            weapons: {
                mainHand: this.getWeaponStats(character, mainHandWeapon),
                offHand: this.getWeaponStats(character, offHandWeapon)
            },
            shield: shield ? this.getShieldStats(shield) : null,
            encumbrance: character.encumbrance,
            equipmentBonuses: character.equipmentBonuses
        };
        
        return stats;
    }

    /**
     * Get weapon statistics for combat
     */
    getWeaponStats(character, weapon) {
        if (!weapon) {
            // Unarmed attack
            return {
                name: 'Unarmed Strike',
                attackBonus: this.calculateAttackBonus(character, null),
                damage: '1d3',
                damageBonus: this.calculateDamageBonus(character, null),
                criticalRange: '20',
                criticalMultiplier: 'x2',
                damageType: 'bludgeoning'
            };
        }
        
        return {
            name: weapon.name,
            attackBonus: this.calculateAttackBonus(character, weapon),
            damage: weapon.damage,
            damageBonus: this.calculateDamageBonus(character, weapon),
            criticalRange: weapon.criticalRange,
            criticalMultiplier: weapon.criticalMultiplier,
            damageType: weapon.damageType,
            enhancement: weapon.enhancement || 0,
            special: weapon.special || []
        };
    }

    /**
     * Calculate attack bonus for weapon
     */
    calculateAttackBonus(character, weapon) {
        let attackBonus = character.baseAttackBonus;
        
        // Add ability modifier (Str for melee, Dex for ranged)
        if (!weapon || weapon.weaponType === 'melee') {
            attackBonus += character.abilityModifiers.strength;
        } else if (weapon.weaponType === 'ranged') {
            attackBonus += character.abilityModifiers.dexterity;
        }
        
        // Add weapon enhancement bonus
        if (weapon && weapon.enhancement) {
            attackBonus += weapon.enhancement;
        }
        
        // Add equipment bonuses
        if (character.equipmentBonuses && character.equipmentBonuses.attack) {
            attackBonus += character.equipmentBonuses.attack;
        }
        
        return attackBonus;
    }

    /**
     * Calculate damage bonus for weapon
     */
    calculateDamageBonus(character, weapon) {
        let damageBonus = 0;
        
        // Add ability modifier (Str for melee, usually no bonus for ranged)
        if (!weapon || weapon.weaponType === 'melee') {
            damageBonus += character.abilityModifiers.strength;
        }
        
        // Add weapon enhancement bonus
        if (weapon && weapon.enhancement) {
            damageBonus += weapon.enhancement;
        }
        
        // Add equipment bonuses
        if (character.equipmentBonuses && character.equipmentBonuses.damage) {
            damageBonus += character.equipmentBonuses.damage;
        }
        
        return damageBonus;
    }

    /**
     * Get shield statistics
     */
    getShieldStats(shield) {
        return {
            name: shield.name,
            acBonus: shield.ac,
            armorCheckPenalty: shield.armorCheckPenalty,
            arcaneSpellFailure: shield.arcaneSpellFailure,
            special: shield.special || []
        };
    }

    // ===== EVENT SYSTEM =====

    /**
     * Register event handler
     */
    on(eventType, handler) {
        if (this.eventHandlers[eventType]) {
            this.eventHandlers[eventType].push(handler);
        }
    }

    /**
     * Remove event handler
     */
    off(eventType, handler) {
        if (this.eventHandlers[eventType]) {
            const index = this.eventHandlers[eventType].indexOf(handler);
            if (index > -1) {
                this.eventHandlers[eventType].splice(index, 1);
            }
        }
    }

    /**
     * Trigger event
     */
    triggerEvent(eventType, data) {
        if (this.eventHandlers[eventType]) {
            this.eventHandlers[eventType].forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${eventType}:`, error);
                }
            });
        }
    }

    // ===== UTILITY METHODS =====

    /**
     * Get character inventory summary
     */
    getInventorySummary(character) {
        const summary = this.inventoryManager.getInventorySummary();
        
        return {
            ...summary,
            characterName: character.name || 'Unnamed Character',
            characterLevel: character.level,
            combatEffectiveness: this.calculateCombatEffectiveness(character),
            encumbranceEffects: character.encumbrance?.effects || null
        };
    }

    /**
     * Calculate combat effectiveness rating
     */
    calculateCombatEffectiveness(character) {
        const combatStats = this.getCombatStats(character);
        let rating = 0;
        
        // AC contribution (0-10 points)
        rating += Math.min(combatStats.armorClass - 10, 10);
        
        // Weapon contribution (0-10 points)
        const mainWeapon = combatStats.weapons.mainHand;
        if (mainWeapon.enhancement) {
            rating += mainWeapon.enhancement * 2;
        }
        
        // Encumbrance penalty (0 to -5 points)
        switch (combatStats.encumbrance?.level) {
            case 'medium': rating -= 1; break;
            case 'heavy': rating -= 3; break;
            case 'overloaded': rating -= 5; break;
        }
        
        // Normalize to 0-100 scale
        return Math.max(0, Math.min(100, (rating / 20) * 100));
    }

    /**
     * Validate character equipment
     */
    validateCharacterEquipment(character) {
        const issues = [];
        const inventory = this.inventoryManager.currentInventory;
        
        // Check for equipment conflicts
        const equipped = inventory.equipped;
        
        // Check if character can use equipped weapons
        Object.keys(equipped).forEach(slot => {
            const item = equipped[slot];
            if (item && item.type === 'weapon') {
                if (!this.canCharacterUseWeapon(character, item)) {
                    issues.push(`Character lacks proficiency with ${item.name}`);
                }
            }
        });
        
        // Check armor proficiency
        const armor = equipped.body;
        if (armor && !this.canCharacterUseArmor(character, armor)) {
            issues.push(`Character lacks proficiency with ${armor.category} armor`);
        }
        
        // Check shield proficiency
        const shield = equipped.shield;
        if (shield && !this.canCharacterUseShield(character, shield)) {
            issues.push(`Character lacks proficiency with shields`);
        }
        
        // Check encumbrance
        if (inventory.encumbrance === 'overloaded') {
            issues.push('Character is overloaded and cannot move');
        }
        
        return {
            valid: issues.length === 0,
            issues: issues
        };
    }

    /**
     * Check if character can use weapon
     */
    canCharacterUseWeapon(character, weapon) {
        // This would normally check weapon proficiencies
        // For now, assume all characters can use simple weapons
        return weapon.category === 'simple' || 
               (character.weaponProficiencies && character.weaponProficiencies.includes(weapon.name));
    }

    /**
     * Check if character can use armor
     */
    canCharacterUseArmor(character, armor) {
        // This would normally check armor proficiencies
        // For now, assume basic proficiency based on class
        const armorProficiencies = character.armorProficiencies || [];
        return armorProficiencies.includes(armor.category);
    }

    /**
     * Check if character can use shield
     */
    canCharacterUseShield(character, shield) {
        // This would normally check shield proficiencies
        const shieldProficiencies = character.shieldProficiencies || [];
        return shieldProficiencies.includes('shield');
    }

    /**
     * Export character with inventory
     */
    exportCharacterWithInventory(character) {
        return {
            character: character,
            inventory: this.inventoryManager.exportInventory(),
            combatStats: this.getCombatStats(character),
            inventorySummary: this.getInventorySummary(character),
            validation: this.validateCharacterEquipment(character),
            exportedAt: Date.now(),
            version: '2.0.0'
        };
    }
}

// Global export for both browser and Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryIntegration;
} else if (typeof window !== 'undefined') {
    window.InventoryIntegration = InventoryIntegration;
}
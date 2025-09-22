/**
 * RulzLawyer Equipment & Inventory Management System
 * Complete D&D 3.5 SRD Implementation with Modern UI
 * Based on research-driven requirements and D&D Beyond patterns
 */

class EquipmentManager {
    constructor() {
        this.character = null;
        this.equipment = {};
        this.inventory = [];
        this.equipmentPresets = {};
        this.encumbrance = { light: 0, medium: 0, heavy: 0, current: 0 };
        
        this.initializeEquipmentData();
        this.initializeEquipmentPresets();
        this.initializeEventHandlers();
    }

    initializeEquipmentData() {
        // Complete D&D 3.5 SRD Equipment Data
        this.srdData = {
            // Coinage System
            currency: {
                cp: { name: "Copper Piece", weight: 50, value: 1 }, // 50 coins = 1 lb
                sp: { name: "Silver Piece", weight: 50, value: 10 },
                gp: { name: "Gold Piece", weight: 50, value: 100 },
                pp: { name: "Platinum Piece", weight: 50, value: 1000 }
            },

            // Weapons Data (Simple, Martial, Exotic)
            weapons: {
                // Simple Weapons - Unarmed
                gauntlet: {
                    name: "Gauntlet", category: "simple", type: "unarmed",
                    cost: 2, damage: { small: "1d2", medium: "1d3" },
                    critical: "x2", weight: 1, damageType: "bludgeoning"
                },
                unarmedStrike: {
                    name: "Unarmed Strike", category: "simple", type: "unarmed",
                    cost: 0, damage: { small: "1d2*", medium: "1d3*" },
                    critical: "x2", weight: 0, damageType: "bludgeoning",
                    special: "nonlethal"
                },

                // Simple Weapons - Light Melee
                dagger: {
                    name: "Dagger", category: "simple", type: "light",
                    cost: 2, damage: { small: "1d3", medium: "1d4" },
                    critical: "19-20/x2", rangeIncrement: 10, weight: 1,
                    damageType: "piercing", special: "thrown"
                },
                daggerPunching: {
                    name: "Dagger, Punching", category: "simple", type: "light",
                    cost: 2, damage: { small: "1d3", medium: "1d4" },
                    critical: "x3", weight: 1, damageType: "piercing"
                },
                gauntletSpiked: {
                    name: "Gauntlet, Spiked", category: "simple", type: "light",
                    cost: 5, damage: { small: "1d3", medium: "1d4" },
                    critical: "x2", weight: 1, damageType: "piercing"
                },
                mace: {
                    name: "Mace, Light", category: "simple", type: "light",
                    cost: 5, damage: { small: "1d4", medium: "1d6" },
                    critical: "x2", weight: 4, damageType: "bludgeoning"
                },
                sickle: {
                    name: "Sickle", category: "simple", type: "light",
                    cost: 6, damage: { small: "1d4", medium: "1d6" },
                    critical: "x2", weight: 2, damageType: "slashing"
                },

                // Simple Weapons - One-Handed
                club: {
                    name: "Club", category: "simple", type: "onehanded",
                    cost: 0, damage: { small: "1d4", medium: "1d6" },
                    critical: "x2", rangeIncrement: 10, weight: 3,
                    damageType: "bludgeoning", special: "thrown"
                },
                maceHeavy: {
                    name: "Mace, Heavy", category: "simple", type: "onehanded",
                    cost: 12, damage: { small: "1d6", medium: "1d8" },
                    critical: "x2", weight: 8, damageType: "bludgeoning"
                },
                morningstar: {
                    name: "Morningstar", category: "simple", type: "onehanded",
                    cost: 8, damage: { small: "1d6", medium: "1d8" },
                    critical: "x2", weight: 6, damageType: "both"
                },
                shortspear: {
                    name: "Shortspear", category: "simple", type: "onehanded",
                    cost: 1, damage: { small: "1d4", medium: "1d6" },
                    critical: "x2", rangeIncrement: 20, weight: 3,
                    damageType: "piercing", special: "thrown"
                },

                // Simple Weapons - Two-Handed
                longspear: {
                    name: "Longspear", category: "simple", type: "twohanded",
                    cost: 5, damage: { small: "1d6", medium: "1d8" },
                    critical: "x3", weight: 9, damageType: "piercing",
                    special: "reach"
                },
                quarterstaff: {
                    name: "Quarterstaff", category: "simple", type: "twohanded",
                    cost: 0, damage: { small: "1d4/1d4", medium: "1d6/1d6" },
                    critical: "x2", weight: 4, damageType: "bludgeoning",
                    special: "double"
                },
                spear: {
                    name: "Spear", category: "simple", type: "twohanded",
                    cost: 2, damage: { small: "1d6", medium: "1d8" },
                    critical: "x3", rangeIncrement: 20, weight: 6,
                    damageType: "piercing", special: "brace,thrown"
                },

                // Simple Weapons - Ranged
                crossbowHeavy: {
                    name: "Crossbow, Heavy", category: "simple", type: "ranged",
                    cost: 50, damage: { small: "1d8", medium: "1d10" },
                    critical: "19-20/x2", rangeIncrement: 120, weight: 8,
                    damageType: "piercing"
                },
                crossbowLight: {
                    name: "Crossbow, Light", category: "simple", type: "ranged",
                    cost: 35, damage: { small: "1d6", medium: "1d8" },
                    critical: "19-20/x2", rangeIncrement: 80, weight: 4,
                    damageType: "piercing"
                },
                dart: {
                    name: "Dart", category: "simple", type: "ranged",
                    cost: 0.5, damage: { small: "1d3", medium: "1d4" },
                    critical: "x2", rangeIncrement: 20, weight: 0.5,
                    damageType: "piercing", special: "thrown"
                },
                javelin: {
                    name: "Javelin", category: "simple", type: "ranged",
                    cost: 1, damage: { small: "1d4", medium: "1d6" },
                    critical: "x2", rangeIncrement: 30, weight: 2,
                    damageType: "piercing", special: "thrown"
                },
                sling: {
                    name: "Sling", category: "simple", type: "ranged",
                    cost: 0, damage: { small: "1d3", medium: "1d4" },
                    critical: "x2", rangeIncrement: 50, weight: 0,
                    damageType: "bludgeoning"
                }
            },

            // Armor Data (Light, Medium, Heavy, Shields)
            armor: {
                // Light Armor
                padded: {
                    name: "Padded", category: "light",
                    cost: 5, armorBonus: 1, maxDex: 8, checkPenalty: 0,
                    spellFailure: 5, speed30: 30, speed20: 20, weight: 10
                },
                leather: {
                    name: "Leather", category: "light",
                    cost: 10, armorBonus: 2, maxDex: 6, checkPenalty: 0,
                    spellFailure: 10, speed30: 30, speed20: 20, weight: 15
                },
                studdedLeather: {
                    name: "Studded Leather", category: "light",
                    cost: 25, armorBonus: 3, maxDex: 5, checkPenalty: -1,
                    spellFailure: 15, speed30: 30, speed20: 20, weight: 20
                },
                chainShirt: {
                    name: "Chain Shirt", category: "light",
                    cost: 100, armorBonus: 4, maxDex: 4, checkPenalty: -2,
                    spellFailure: 20, speed30: 30, speed20: 20, weight: 25
                },

                // Medium Armor
                hide: {
                    name: "Hide", category: "medium",
                    cost: 15, armorBonus: 3, maxDex: 4, checkPenalty: -3,
                    spellFailure: 20, speed30: 20, speed20: 15, weight: 25
                },
                scaleMail: {
                    name: "Scale Mail", category: "medium",
                    cost: 50, armorBonus: 4, maxDex: 3, checkPenalty: -4,
                    spellFailure: 25, speed30: 20, speed20: 15, weight: 30
                },
                chainmail: {
                    name: "Chainmail", category: "medium",
                    cost: 150, armorBonus: 5, maxDex: 2, checkPenalty: -5,
                    spellFailure: 30, speed30: 20, speed20: 15, weight: 40
                },
                breastplate: {
                    name: "Breastplate", category: "medium",
                    cost: 200, armorBonus: 5, maxDex: 3, checkPenalty: -4,
                    spellFailure: 25, speed30: 20, speed20: 15, weight: 30
                },

                // Heavy Armor
                splintMail: {
                    name: "Splint Mail", category: "heavy",
                    cost: 200, armorBonus: 6, maxDex: 0, checkPenalty: -7,
                    spellFailure: 40, speed30: 20, speed20: 15, weight: 45
                },
                bandedMail: {
                    name: "Banded Mail", category: "heavy",
                    cost: 250, armorBonus: 6, maxDex: 1, checkPenalty: -6,
                    spellFailure: 35, speed30: 20, speed20: 15, weight: 35
                },
                halfPlate: {
                    name: "Half-Plate", category: "heavy",
                    cost: 600, armorBonus: 7, maxDex: 0, checkPenalty: -7,
                    spellFailure: 40, speed30: 20, speed20: 15, weight: 50
                },
                fullPlate: {
                    name: "Full Plate", category: "heavy",
                    cost: 1500, armorBonus: 8, maxDex: 1, checkPenalty: -6,
                    spellFailure: 35, speed30: 20, speed20: 15, weight: 50
                },

                // Shields
                buckler: {
                    name: "Buckler", category: "shield",
                    cost: 15, shieldBonus: 1, maxDex: null, checkPenalty: -1,
                    spellFailure: 5, weight: 5
                },
                shieldLightWooden: {
                    name: "Shield, Light Wooden", category: "shield",
                    cost: 3, shieldBonus: 1, maxDex: null, checkPenalty: -1,
                    spellFailure: 5, weight: 5
                },
                shieldLightSteel: {
                    name: "Shield, Light Steel", category: "shield",
                    cost: 9, shieldBonus: 1, maxDex: null, checkPenalty: -1,
                    spellFailure: 5, weight: 6
                },
                shieldHeavyWooden: {
                    name: "Shield, Heavy Wooden", category: "shield",
                    cost: 7, shieldBonus: 2, maxDex: null, checkPenalty: -2,
                    spellFailure: 15, weight: 10
                },
                shieldHeavySteel: {
                    name: "Shield, Heavy Steel", category: "shield",
                    cost: 20, shieldBonus: 2, maxDex: null, checkPenalty: -2,
                    spellFailure: 15, weight: 15
                },
                shieldTower: {
                    name: "Shield, Tower", category: "shield",
                    cost: 30, shieldBonus: 4, maxDex: 2, checkPenalty: -10,
                    spellFailure: 50, weight: 45, special: "cover"
                }
            },

            // Adventuring Gear
            gear: {
                backpack: { name: "Backpack", cost: 2, weight: 2, capacity: 30 },
                bedroll: { name: "Bedroll", cost: 0.1, weight: 5 },
                blanket: { name: "Blanket, Winter", cost: 0.5, weight: 3 },
                rope50ft: { name: "Rope, Hempen (50 ft.)", cost: 1, weight: 10 },
                ropesilk50ft: { name: "Rope, Silk (50 ft.)", cost: 10, weight: 5 },
                torch: { name: "Torch", cost: 0.01, weight: 1 },
                lanternHooded: { name: "Lantern, Hooded", cost: 7, weight: 2 },
                oil: { name: "Oil (1 pint flask)", cost: 0.1, weight: 1 },
                rations: { name: "Trail Rations (per day)", cost: 0.5, weight: 1 },
                waterskin: { name: "Waterskin", cost: 1, weight: 4 },
                grapplehook: { name: "Grappling Hook", cost: 1, weight: 4 },
                crowbar: { name: "Crowbar", cost: 2, weight: 5 },
                thieftools: { name: "Thieves' Tools", cost: 30, weight: 1 },
                thieftoolsmw: { name: "Thieves' Tools, Masterwork", cost: 100, weight: 2 },
                healerskit: { name: "Healer's Kit", cost: 50, weight: 1 },
                spellpouch: { name: "Spell Component Pouch", cost: 5, weight: 2 },
                spellbook: { name: "Spellbook, Wizard's (blank)", cost: 15, weight: 3 }
            },

            // Special Items & Alchemical
            specialItems: {
                acid: { name: "Acid (flask)", cost: 10, weight: 1, type: "splash" },
                alchemistfire: { name: "Alchemist's Fire (flask)", cost: 20, weight: 1, type: "splash" },
                antitoxin: { name: "Antitoxin (vial)", cost: 50, weight: 0 },
                holywater: { name: "Holy Water (flask)", cost: 25, weight: 1, type: "splash" },
                sunrod: { name: "Sunrod", cost: 2, weight: 1 },
                tanglefoot: { name: "Tanglefoot Bag", cost: 50, weight: 4 },
                thunderstone: { name: "Thunderstone", cost: 30, weight: 1 }
            }
        };
    }

    initializeEquipmentPresets() {
        // Equipment Presets based on research requirements
        this.equipmentPresets = {
            combat: {
                name: "Combat Loadout",
                description: "Optimized for battle encounters",
                items: [
                    { id: "sword", slot: "mainhand", name: "Longsword" },
                    { id: "shield", slot: "offhand", name: "Heavy Steel Shield" },
                    { id: "armor", slot: "body", name: "Chain Mail" },
                    { id: "helmet", slot: "head", name: "Steel Helmet" },
                    { id: "potion", slot: "belt", name: "Cure Light Wounds Potion", quantity: 2 }
                ]
            },
            exploration: {
                name: "Exploration Kit",
                description: "Essential gear for dungeon delving",
                items: [
                    { id: "backpack", slot: "back", name: "Backpack" },
                    { id: "torch", slot: "inventory", name: "Torch", quantity: 10 },
                    { id: "rope", slot: "inventory", name: "Rope, Hempen (50 ft.)" },
                    { id: "lantern", slot: "inventory", name: "Hooded Lantern" },
                    { id: "oil", slot: "inventory", name: "Oil", quantity: 5 },
                    { id: "rations", slot: "inventory", name: "Trail Rations", quantity: 7 },
                    { id: "waterskin", slot: "inventory", name: "Waterskin", quantity: 2 },
                    { id: "thieftools", slot: "inventory", name: "Thieves' Tools" }
                ]
            },
            social: {
                name: "Social Encounter",
                description: "Refined gear for diplomatic situations",
                items: [
                    { id: "outfit", slot: "body", name: "Courtier's Outfit" },
                    { id: "jewelry", slot: "neck", name: "Signet Ring" },
                    { id: "perfume", slot: "inventory", name: "Fine Perfume" },
                    { id: "coins", slot: "inventory", name: "Gold Pieces", quantity: 50 }
                ]
            },
            survival: {
                name: "Wilderness Survival",
                description: "Long-term outdoor adventure gear",
                items: [
                    { id: "tent", slot: "inventory", name: "Tent" },
                    { id: "bedroll", slot: "inventory", name: "Bedroll" },
                    { id: "blanket", slot: "inventory", name: "Winter Blanket" },
                    { id: "rations", slot: "inventory", name: "Trail Rations", quantity: 14 },
                    { id: "waterskin", slot: "inventory", name: "Waterskin", quantity: 4 },
                    { id: "firestarter", slot: "inventory", name: "Flint and Steel" },
                    { id: "huntingknife", slot: "belt", name: "Dagger" },
                    { id: "fishingkit", slot: "inventory", name: "Fishing Kit" }
                ]
            }
        };
    }

    // Equipment Slot Management
    equipItem(item, slot) {
        if (!this.character) return { success: false, message: "No character loaded" };
        
        const validation = this.validateEquipment(item, slot);
        if (!validation.valid) return { success: false, message: validation.reason };
        
        // Handle slot conflicts
        if (this.equipment[slot]) {
            this.unequipItem(slot);
        }
        
        this.equipment[slot] = {
            ...item,
            equipped: true,
            slot: slot,
            equippedAt: new Date()
        };
        
        this.updateCharacterStats();
        this.calculateEncumbrance();
        
        return { success: true, message: `${item.name} equipped in ${slot}` };
    }

    unequipItem(slot) {
        if (!this.equipment[slot]) return { success: false, message: "No item equipped in that slot" };
        
        const item = this.equipment[slot];
        item.equipped = false;
        delete item.slot;
        
        // Move to inventory
        this.inventory.push(item);
        delete this.equipment[slot];
        
        this.updateCharacterStats();
        this.calculateEncumbrance();
        
        return { success: true, message: `${item.name} unequipped` };
    }

    validateEquipment(item, slot) {
        const validation = { valid: true, reasons: [] };
        
        // Check proficiency
        if (item.category === "weapon") {
            const proficient = this.checkWeaponProficiency(item);
            if (!proficient) {
                validation.reasons.push("Not proficient with this weapon type");
            }
        }
        
        if (item.category === "armor") {
            const proficient = this.checkArmorProficiency(item);
            if (!proficient) {
                validation.reasons.push("Not proficient with this armor type");
            }
        }
        
        // Check size compatibility
        if (item.size && item.size !== this.character.size) {
            validation.reasons.push(`Item sized for ${item.size}, character is ${this.character.size}`);
        }
        
        // Check strength requirements
        if (item.minStrength && this.character.abilities.str.score < item.minStrength) {
            validation.reasons.push(`Requires ${item.minStrength} Strength (character has ${this.character.abilities.str.score})`);
        }
        
        if (validation.reasons.length > 0) {
            validation.valid = false;
            validation.reason = validation.reasons.join(", ");
        }
        
        return validation;
    }

    // Encumbrance Calculation (D&D 3.5 rules)
    calculateEncumbrance() {
        if (!this.character) return;
        
        const strScore = this.character.abilities.str.score;
        const strMod = Math.floor((strScore - 10) / 2);
        
        // Base carrying capacity
        const baseCapacity = this.getBaseCarryingCapacity(strScore);
        
        // Size modifiers
        const sizeMultiplier = this.getSizeMultiplier(this.character.size);
        
        // Calculate load thresholds
        this.encumbrance.light = Math.floor(baseCapacity * sizeMultiplier);
        this.encumbrance.medium = Math.floor(baseCapacity * 2 * sizeMultiplier);
        this.encumbrance.heavy = Math.floor(baseCapacity * 3 * sizeMultiplier);
        
        // Calculate current load
        this.encumbrance.current = this.getTotalWeight();
        
        // Determine load level
        if (this.encumbrance.current <= this.encumbrance.light) {
            this.encumbrance.level = "light";
            this.encumbrance.penalty = 0;
        } else if (this.encumbrance.current <= this.encumbrance.medium) {
            this.encumbrance.level = "medium";
            this.encumbrance.penalty = -3; // Check penalty and max Dex
        } else if (this.encumbrance.current <= this.encumbrance.heavy) {
            this.encumbrance.level = "heavy";
            this.encumbrance.penalty = -6; // Check penalty and max Dex +1
        } else {
            this.encumbrance.level = "overloaded";
            this.encumbrance.penalty = -10; // Cannot move
        }
    }

    getBaseCarryingCapacity(strength) {
        // D&D 3.5 carrying capacity table
        const capacityTable = {
            1: 3, 2: 6, 3: 10, 4: 13, 5: 16, 6: 20, 7: 23, 8: 26, 9: 30,
            10: 33, 11: 38, 12: 43, 13: 50, 14: 58, 15: 66, 16: 76, 17: 86,
            18: 100, 19: 116, 20: 133, 21: 153, 22: 173, 23: 200, 24: 233,
            25: 266, 26: 306, 27: 346, 28: 400, 29: 466
        };
        
        if (strength <= 29) {
            return capacityTable[strength] || 33;
        } else {
            // For strength > 29, multiply by 4 for every 10 points
            const base = capacityTable[29];
            const excess = strength - 29;
            const multiplier = Math.pow(4, Math.floor(excess / 10));
            return Math.floor(base * multiplier);
        }
    }

    getSizeMultiplier(size) {
        const multipliers = {
            'Fine': 1/8, 'Diminutive': 1/4, 'Tiny': 1/2, 'Small': 3/4,
            'Medium': 1, 'Large': 2, 'Huge': 4, 'Gargantuan': 8, 'Colossal': 16
        };
        return multipliers[size] || 1;
    }

    getTotalWeight() {
        let total = 0;
        
        // Equipment weight
        Object.values(this.equipment).forEach(item => {
            total += (item.weight || 0) * (item.quantity || 1);
        });
        
        // Inventory weight
        this.inventory.forEach(item => {
            total += (item.weight || 0) * (item.quantity || 1);
        });
        
        // Currency weight (50 coins = 1 lb)
        if (this.character && this.character.currency) {
            const totalCoins = Object.values(this.character.currency).reduce((sum, count) => sum + count, 0);
            total += Math.floor(totalCoins / 50);
        }
        
        return total;
    }

    // Equipment Preset System
    applyEquipmentPreset(presetName) {
        const preset = this.equipmentPresets[presetName];
        if (!preset) return { success: false, message: "Preset not found" };
        
        const results = [];
        
        preset.items.forEach(presetItem => {
            const item = this.findItemByName(presetItem.name);
            if (item) {
                if (presetItem.slot !== "inventory") {
                    const result = this.equipItem(item, presetItem.slot);
                    results.push(result);
                } else {
                    this.addToInventory(item, presetItem.quantity || 1);
                    results.push({ success: true, message: `${item.name} added to inventory` });
                }
            } else {
                results.push({ success: false, message: `${presetItem.name} not found` });
            }
        });
        
        return {
            success: true,
            message: `Applied ${preset.name} preset`,
            results: results
        };
    }

    // Drag & Drop Interface Support
    initializeEventHandlers() {
        // Will be enhanced with HTML drag-and-drop functionality
        this.draggedItem = null;
        this.dropTargets = [];
    }

    handleDragStart(item, event) {
        this.draggedItem = item;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/html", JSON.stringify(item));
        
        // Visual feedback
        event.target.classList.add('dragging');
    }

    handleDragEnd(event) {
        event.target.classList.remove('dragging');
        this.draggedItem = null;
    }

    handleDrop(slot, event) {
        event.preventDefault();
        
        if (this.draggedItem) {
            const result = this.equipItem(this.draggedItem, slot);
            
            // Provide visual feedback
            if (result.success) {
                event.target.classList.add('drop-success');
                setTimeout(() => event.target.classList.remove('drop-success'), 1000);
            } else {
                event.target.classList.add('drop-error');
                setTimeout(() => event.target.classList.remove('drop-error'), 1000);
                
                // Show error message
                this.showMessage(result.message, 'error');
            }
        }
    }

    // Character Integration
    loadCharacter(character) {
        this.character = character;
        this.calculateEncumbrance();
        this.updateCharacterStats();
    }

    updateCharacterStats() {
        if (!this.character) return;
        
        // Reset to base stats
        this.character.combat = {
            ...this.character.combat,
            armorClass: 10 + this.character.abilities.dex.modifier,
            touchAC: 10 + this.character.abilities.dex.modifier,
            flatFootedAC: 10
        };
        
        // Apply equipment bonuses
        Object.values(this.equipment).forEach(item => {
            this.applyItemEffects(item);
        });
    }

    applyItemEffects(item) {
        if (!this.character) return;
        
        // Armor bonuses
        if (item.armorBonus) {
            this.character.combat.armorClass += item.armorBonus;
            this.character.combat.flatFootedAC += item.armorBonus;
        }
        
        // Shield bonuses
        if (item.shieldBonus) {
            this.character.combat.armorClass += item.shieldBonus;
            this.character.combat.touchAC += item.shieldBonus;
            this.character.combat.flatFootedAC += item.shieldBonus;
        }
        
        // Dexterity restrictions
        if (item.maxDex !== null && item.maxDex !== undefined) {
            const currentDexMod = this.character.abilities.dex.modifier;
            const restrictedDexMod = Math.min(currentDexMod, item.maxDex);
            
            // Adjust AC based on Dex restriction
            this.character.combat.armorClass = this.character.combat.armorClass - currentDexMod + restrictedDexMod;
            this.character.combat.touchAC = this.character.combat.touchAC - currentDexMod + restrictedDexMod;
        }
        
        // Check penalties
        if (item.checkPenalty) {
            // Apply to skills and attacks if not proficient
            const penalty = item.checkPenalty;
            
            // Store for skill system to use
            this.character.equipmentPenalties = this.character.equipmentPenalties || {};
            this.character.equipmentPenalties.check = (this.character.equipmentPenalties.check || 0) + penalty;
        }
    }

    // Inventory Management
    addToInventory(item, quantity = 1) {
        const existingItem = this.inventory.find(inv => inv.id === item.id);
        
        if (existingItem && existingItem.stackable) {
            existingItem.quantity = (existingItem.quantity || 1) + quantity;
        } else {
            this.inventory.push({
                ...item,
                quantity: quantity,
                addedAt: new Date()
            });
        }
        
        this.calculateEncumbrance();
        return { success: true, message: `${item.name} added to inventory` };
    }

    removeFromInventory(itemId, quantity = 1) {
        const itemIndex = this.inventory.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return { success: false, message: "Item not found" };
        
        const item = this.inventory[itemIndex];
        
        if (item.quantity && item.quantity > quantity) {
            item.quantity -= quantity;
        } else {
            this.inventory.splice(itemIndex, 1);
        }
        
        this.calculateEncumbrance();
        return { success: true, message: `${item.name} removed from inventory` };
    }

    // Utility Functions
    findItemByName(name) {
        // Search in all equipment categories
        for (const category of Object.values(this.srdData)) {
            for (const item of Object.values(category)) {
                if (item.name === name) {
                    return { ...item, id: this.generateItemId() };
                }
            }
        }
        return null;
    }

    generateItemId() {
        return 'item_' + Math.random().toString(36).substr(2, 9);
    }

    checkWeaponProficiency(weapon) {
        if (!this.character) return false;
        
        const proficiencies = this.character.weaponProficiencies || [];
        
        // Check specific weapon
        if (proficiencies.includes(weapon.name.toLowerCase())) return true;
        
        // Check weapon category
        if (proficiencies.includes(weapon.category)) return true;
        
        // Check weapon type
        if (proficiencies.includes(weapon.type)) return true;
        
        return false;
    }

    checkArmorProficiency(armor) {
        if (!this.character) return false;
        
        const proficiencies = this.character.armorProficiencies || [];
        
        // Check specific armor
        if (proficiencies.includes(armor.name.toLowerCase())) return true;
        
        // Check armor category
        if (proficiencies.includes(armor.category)) return true;
        
        return false;
    }

    showMessage(message, type = 'info') {
        // Placeholder for UI message system
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    // Data Export/Import for Character Persistence
    exportEquipmentData() {
        return {
            equipment: this.equipment,
            inventory: this.inventory,
            encumbrance: this.encumbrance,
            timestamp: new Date().toISOString()
        };
    }

    importEquipmentData(data) {
        if (data.equipment) this.equipment = data.equipment;
        if (data.inventory) this.inventory = data.inventory;
        if (data.encumbrance) this.encumbrance = data.encumbrance;
        
        this.calculateEncumbrance();
        this.updateCharacterStats();
        
        return { success: true, message: "Equipment data imported successfully" };
    }
}

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EquipmentManager;
} else if (typeof window !== 'undefined') {
    window.EquipmentManager = EquipmentManager;
}
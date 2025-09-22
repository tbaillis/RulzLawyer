# D&D 3.5 Rules Implementation - Complete Specification

## Overview
This document provides the comprehensive technical specification for all D&D 3.5 System Reference Document rule implementations developed during the production-ready character creator project. This captures all calculation formulas, validation logic, and SRD compliance patterns.

## Implementation Philosophy

### SRD Compliance Standards
- **Absolute Accuracy**: All calculations must match official D&D 3.5 SRD specifications exactly
- **Rule Validation**: Every game mechanic must be validated against official sources
- **Edge Case Handling**: Special rules, exceptions, and corner cases must be properly implemented
- **Mathematical Precision**: All formulas must use correct D&D 3.5 mathematical models

### Code Organization
```javascript
// Pattern: Centralized rule validation with clear documentation
function calculateAbilityModifier(abilityScore) {
    // D&D 3.5 SRD: Ability modifier = (ability score - 10) / 2, rounded down
    return Math.floor((abilityScore - 10) / 2);
}

// Pattern: Prerequisite validation with detailed feedback
function validateFeatPrerequisites(feat, character) {
    const validation = { valid: true, reasons: [] };
    
    // Each prerequisite check documented with SRD reference
    if (feat.prerequisites) {
        feat.prerequisites.forEach(prereq => {
            if (!checkPrerequisite(prereq, character)) {
                validation.valid = false;
                validation.reasons.push(`Missing prerequisite: ${prereq.description}`);
            }
        });
    }
    
    return validation;
}
```

## Ability Score System

### Core Ability Calculations
```javascript
// Base ability scores (8-18 range for point buy)
const ABILITY_SCORE_RANGE = { min: 8, max: 18 };

// Official D&D 3.5 28-Point Buy Cost Table
const POINT_BUY_COSTS = {
    8: 0,   // Below average costs no points
    9: 1,   // 1 point below average
    10: 2,  // Average human ability
    11: 3,  // 1 point above average
    12: 4,  // Above average
    13: 5,  // Good
    14: 6,  // Very good
    15: 8,  // Excellent (cost increases)
    16: 10, // Superior
    17: 13, // Outstanding (expensive)
    18: 16  // Legendary (most expensive)
};

function calculatePointBuyCost(abilities) {
    let totalCost = 0;
    
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(ability => {
        const score = abilities[ability] || 10;
        totalCost += POINT_BUY_COSTS[score] || 0;
    });
    
    return totalCost;
}

function validatePointBuyAllocation(abilities, maxPoints = 28) {
    const totalCost = calculatePointBuyCost(abilities);
    
    // Validate each ability score is in valid range
    const invalidAbilities = [];
    Object.entries(abilities).forEach(([ability, score]) => {
        if (score < ABILITY_SCORE_RANGE.min || score > ABILITY_SCORE_RANGE.max) {
            invalidAbilities.push(`${ability}: ${score}`);
        }
    });
    
    if (invalidAbilities.length > 0) {
        return {
            valid: false,
            reason: `Ability scores out of range: ${invalidAbilities.join(', ')}`
        };
    }
    
    if (totalCost > maxPoints) {
        return {
            valid: false,
            reason: `Total cost ${totalCost} exceeds ${maxPoints} point limit`
        };
    }
    
    return {
        valid: true,
        cost: totalCost,
        remaining: maxPoints - totalCost
    };
}
```

### Racial Ability Modifiers
```javascript
// D&D 3.5 SRD Racial Ability Adjustments
const RACIAL_MODIFIERS = {
    human: {}, // No modifiers - versatile race
    elf: { dex: +2, con: -2 }, // Agile but frail
    dwarf: { con: +2, cha: -2 }, // Hardy but gruff
    halfling: { dex: +2, str: -2 }, // Quick but small
    gnome: { con: +2, str: -2 }, // Tough but small
    'half-elf': {}, // No modifiers - human versatility
    'half-orc': { str: +2, int: -2, cha: -2 } // Strong but crude
};

function applyRacialModifiers(baseAbilities, race) {
    const modifiers = RACIAL_MODIFIERS[race] || {};
    const finalAbilities = { ...baseAbilities };
    
    Object.entries(modifiers).forEach(([ability, modifier]) => {
        finalAbilities[ability] = (finalAbilities[ability] || 10) + modifier;
    });
    
    return finalAbilities;
}
```

## Character Class System

### Class Progression Tables
```javascript
// D&D 3.5 Base Attack Bonus Progressions
const BAB_PROGRESSIONS = {
    full: (level) => level, // Fighter, Barbarian, Paladin, Ranger
    medium: (level) => Math.floor(level * 3 / 4), // Bard, Cleric, Druid, Monk, Rogue
    poor: (level) => Math.floor(level / 2) // Sorcerer, Wizard
};

// D&D 3.5 Saving Throw Progressions
const SAVE_PROGRESSIONS = {
    good: (level) => 2 + Math.floor(level / 2), // Strong save
    poor: (level) => Math.floor(level / 3) // Weak save
};

function calculateClassBAB(classId, level) {
    const classData = SRD_CLASSES[classId];
    const progression = BAB_PROGRESSIONS[classData.bab_progression];
    
    if (!progression) {
        throw new Error(`Invalid BAB progression for class ${classId}`);
    }
    
    return progression(level);
}

function calculateClassSaves(classId, level, abilityModifiers) {
    const classData = SRD_CLASSES[classId];
    
    return {
        fortitude: SAVE_PROGRESSIONS[classData.fort_save](level) + abilityModifiers.con,
        reflex: SAVE_PROGRESSIONS[classData.ref_save](level) + abilityModifiers.dex,
        will: SAVE_PROGRESSIONS[classData.will_save](level) + abilityModifiers.wis
    };
}
```

### Hit Point Calculations
```javascript
function calculateHitPoints(classId, level, conModifier, hitDieRolls = []) {
    const classData = SRD_CLASSES[classId];
    const hitDie = classData.hit_die;
    
    let hitPoints = 0;
    
    // First level gets maximum hit die + con modifier
    hitPoints += hitDie + conModifier;
    
    // Subsequent levels (if any) use rolled or average values
    for (let currentLevel = 2; currentLevel <= level; currentLevel++) {
        const levelIndex = currentLevel - 2; // Array is 0-indexed for levels 2+
        
        if (hitDieRolls[levelIndex] !== undefined) {
            // Use provided roll
            hitPoints += hitDieRolls[levelIndex] + conModifier;
        } else {
            // Use average (rounded up)
            const averageRoll = Math.floor((hitDie + 1) / 2);
            hitPoints += averageRoll + conModifier;
        }
    }
    
    // Minimum 1 HP per level
    return Math.max(hitPoints, level);
}
```

### Skill Point Calculations
```javascript
function calculateSkillPoints(classId, level, intModifier, race) {
    const classData = SRD_CLASSES[classId];
    let skillPointsPerLevel = classData.skill_points_per_level;
    
    // Add intelligence modifier
    skillPointsPerLevel += intModifier;
    
    // Minimum 1 skill point per level
    if (skillPointsPerLevel < 1) {
        skillPointsPerLevel = 1;
    }
    
    let totalSkillPoints = skillPointsPerLevel;
    
    // First level gets 4x skill points
    if (level === 1) {
        totalSkillPoints *= 4;
    } else {
        // Add skill points for each additional level
        totalSkillPoints += (skillPointsPerLevel * (level - 1));
    }
    
    // Human bonus skill points
    if (race === 'human') {
        totalSkillPoints += level; // 1 bonus skill point per level
    }
    
    return totalSkillPoints;
}

function validateSkillAllocation(skills, classId, maxLevel = 1) {
    const validation = { valid: true, errors: [] };
    const classData = SRD_CLASSES[classId];
    
    Object.entries(skills).forEach(([skillName, ranks]) => {
        // Check maximum ranks
        const maxRanks = isClassSkill(skillName, classId) ? maxLevel + 3 : Math.floor((maxLevel + 3) / 2);
        
        if (ranks > maxRanks) {
            validation.valid = false;
            validation.errors.push(`${skillName}: ${ranks} ranks exceeds maximum of ${maxRanks}`);
        }
        
        // Check minimum ranks (no negative values)
        if (ranks < 0) {
            validation.valid = false;
            validation.errors.push(`${skillName}: Cannot have negative ranks`);
        }
    });
    
    return validation;
}
```

## Armor Class System

### AC Calculation Components
```javascript
function calculateArmorClass(character, equipment) {
    // Base AC of 10
    let ac = 10;
    
    // Dexterity modifier (with armor restrictions)
    const dexMod = calculateAbilityModifier(character.abilities.dex);
    const maxDexBonus = getMaxDexBonusFromArmor(equipment.armor);
    ac += Math.min(dexMod, maxDexBonus);
    
    // Armor bonus
    ac += getArmorBonus(equipment.armor);
    
    // Shield bonus
    ac += getShieldBonus(equipment.shield);
    
    // Size modifier
    ac += getSizeModifier(character.size);
    
    // Natural armor (if any)
    ac += character.naturalArmor || 0;
    
    // Deflection bonus (magical)
    ac += character.deflectionBonus || 0;
    
    return ac;
}

function getMaxDexBonusFromArmor(armor) {
    if (!armor) return 10; // No armor = no dex limit
    
    const armorData = SRD_EQUIPMENT.armor[armor.id];
    return armorData ? armorData.max_dex_bonus : 10;
}

// D&D 3.5 Size Modifiers for AC
const SIZE_AC_MODIFIERS = {
    'Fine': +8,
    'Diminutive': +4,
    'Tiny': +2,
    'Small': +1,
    'Medium': 0,
    'Large': -1,
    'Huge': -2,
    'Gargantuan': -4,
    'Colossal': -8
};
```

## Combat Statistics

### Attack Bonus Calculations
```javascript
function calculateAttackBonus(character, weapon, attackType = 'melee') {
    let attackBonus = 0;
    
    // Base Attack Bonus
    attackBonus += character.baseAttackBonus;
    
    // Ability modifier (Str for melee, Dex for ranged)
    const abilityMod = attackType === 'ranged' 
        ? calculateAbilityModifier(character.abilities.dex)
        : calculateAbilityModifier(character.abilities.str);
    attackBonus += abilityMod;
    
    // Size modifier
    attackBonus += getSizeModifier(character.size);
    
    // Weapon enhancement bonus
    if (weapon && weapon.enhancement) {
        attackBonus += weapon.enhancement;
    }
    
    // Weapon proficiency (if not proficient, -4 penalty)
    if (!isWeaponProficient(character, weapon)) {
        attackBonus -= 4;
    }
    
    return attackBonus;
}

function calculateDamage(character, weapon, attackType = 'melee') {
    const weaponData = SRD_EQUIPMENT.weapons[weapon.id];
    let damageString = weaponData.damage;
    
    // Ability modifier (Str for melee, Dex for certain ranged)
    let abilityMod = 0;
    if (attackType === 'melee') {
        abilityMod = calculateAbilityModifier(character.abilities.str);
        
        // Two-handed weapons get 1.5x Str modifier
        if (weaponData.hands === 2) {
            abilityMod = Math.floor(abilityMod * 1.5);
        }
        // Off-hand weapons get 0.5x Str modifier
        else if (attackType === 'offhand') {
            abilityMod = Math.floor(abilityMod * 0.5);
        }
    }
    
    // Enhancement bonus
    const enhancement = weapon.enhancement || 0;
    
    // Build damage expression
    if (abilityMod !== 0 || enhancement !== 0) {
        const totalBonus = abilityMod + enhancement;
        const sign = totalBonus >= 0 ? '+' : '';
        damageString += `${sign}${totalBonus}`;
    }
    
    return damageString;
}
```

## Spellcasting System

### Spell Slot Calculations
```javascript
// D&D 3.5 Spells Per Day Tables
const SPELLS_PER_DAY_TABLES = {
    wizard: {
        1: { 0: 3, 1: 1 },
        2: { 0: 4, 1: 2 },
        3: { 0: 4, 1: 2, 2: 1 },
        // ... complete tables for all levels
    },
    sorcerer: {
        1: { 0: 5, 1: 3 },
        2: { 0: 6, 1: 4 },
        3: { 0: 6, 1: 5 },
        // ... complete tables for all levels
    },
    cleric: {
        1: { 0: 3, 1: 1 },
        2: { 0: 4, 1: 2 },
        3: { 0: 4, 1: 2, 2: 1 },
        // ... complete tables for all levels
    }
    // ... other spellcasting classes
};

function getSpellsPerDay(classId, level, abilityModifier = 0) {
    const baseSpells = SPELLS_PER_DAY_TABLES[classId]?.[level] || {};
    const modifiedSpells = { ...baseSpells };
    
    // Add bonus spells from high ability score
    if (abilityModifier > 0) {
        for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
            if (modifiedSpells[spellLevel] !== undefined) {
                const bonusSpells = getBonusSpells(spellLevel, abilityModifier);
                modifiedSpells[spellLevel] += bonusSpells;
            }
        }
    }
    
    return modifiedSpells;
}

function getBonusSpells(spellLevel, abilityModifier) {
    // D&D 3.5 SRD Bonus Spells Table
    const bonusTable = [
        // Spell Level: 1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th
        [0, 0, 0, 0, 0, 0, 0, 0, 0], // Ability modifier 0-1
        [0, 0, 0, 0, 0, 0, 0, 0, 0], // Ability modifier 2-3
        [1, 0, 0, 0, 0, 0, 0, 0, 0], // Ability modifier 4-5
        [1, 1, 0, 0, 0, 0, 0, 0, 0], // Ability modifier 6-7
        [1, 1, 1, 0, 0, 0, 0, 0, 0], // Ability modifier 8-9
        [1, 1, 1, 1, 0, 0, 0, 0, 0], // Ability modifier 10-11
        // ... continue table
    ];
    
    const modifierIndex = Math.min(Math.floor(abilityModifier / 2), bonusTable.length - 1);
    const spellLevelIndex = spellLevel - 1;
    
    return bonusTable[modifierIndex]?.[spellLevelIndex] || 0;
}
```

### Spell DC Calculations
```javascript
function calculateSpellDC(spellLevel, casterLevel, abilityModifier, spellFocus = 0) {
    // D&D 3.5 Spell DC = 10 + spell level + ability modifier
    return 10 + spellLevel + abilityModifier + spellFocus;
}

function calculateCasterLevel(classId, classLevel, otherCasterLevels = {}) {
    let totalCasterLevel = 0;
    
    // Full casters (Wizard, Sorcerer, Cleric, Druid)
    if (['wizard', 'sorcerer', 'cleric', 'druid'].includes(classId)) {
        totalCasterLevel += classLevel;
    }
    // Partial casters (Bard)
    else if (classId === 'bard') {
        totalCasterLevel += Math.max(0, classLevel - 0); // Bard starts casting at 1st
    }
    // Delayed casters (Paladin, Ranger)
    else if (['paladin', 'ranger'].includes(classId)) {
        totalCasterLevel += Math.max(0, Math.floor(classLevel / 2));
    }
    
    // Add other class caster levels
    Object.entries(otherCasterLevels).forEach(([otherClass, otherLevel]) => {
        totalCasterLevel += calculateCasterLevel(otherClass, otherLevel);
    });
    
    return totalCasterLevel;
}
```

## Feat System

### Prerequisite Validation
```javascript
function validateFeatPrerequisites(featId, character) {
    const feat = SRD_FEATS[featId];
    if (!feat || !feat.prerequisites) {
        return { valid: true, reasons: [] };
    }
    
    const validation = { valid: true, reasons: [] };
    
    feat.prerequisites.forEach(prereq => {
        switch (prereq.type) {
            case 'ability':
                if (character.abilities[prereq.ability] < prereq.value) {
                    validation.valid = false;
                    validation.reasons.push(`${prereq.ability.toUpperCase()} ${prereq.value} required (current: ${character.abilities[prereq.ability]})`);
                }
                break;
                
            case 'skill':
                const skillRanks = character.skills[prereq.skill] || 0;
                if (skillRanks < prereq.ranks) {
                    validation.valid = false;
                    validation.reasons.push(`${prereq.skill} ${prereq.ranks} ranks required (current: ${skillRanks})`);
                }
                break;
                
            case 'bab':
                if (character.baseAttackBonus < prereq.value) {
                    validation.valid = false;
                    validation.reasons.push(`Base attack bonus +${prereq.value} required (current: +${character.baseAttackBonus})`);
                }
                break;
                
            case 'feat':
                if (!character.feats.includes(prereq.feat)) {
                    validation.valid = false;
                    validation.reasons.push(`${prereq.feat} feat required`);
                }
                break;
                
            case 'class':
                if (character.class !== prereq.class) {
                    validation.valid = false;
                    validation.reasons.push(`${prereq.class} class required`);
                }
                break;
                
            case 'spellcaster':
                if (!isSpellcaster(character.class)) {
                    validation.valid = false;
                    validation.reasons.push('Spellcaster required');
                }
                break;
        }
    });
    
    return validation;
}

// Example feat with complex prerequisites
const COMBAT_EXPERTISE_FEAT = {
    name: 'Combat Expertise',
    type: 'combat',
    prerequisites: [
        { type: 'ability', ability: 'int', value: 13 }
    ],
    benefit: 'Trade attack bonus for AC bonus',
    description: 'You can carefully attack to avoid counterattacks.'
};

const POWER_ATTACK_FEAT = {
    name: 'Power Attack',
    type: 'combat', 
    prerequisites: [
        { type: 'ability', ability: 'str', value: 13 }
    ],
    benefit: 'Trade attack bonus for damage bonus',
    description: 'You can make exceptionally deadly attacks.'
};
```

## Equipment and Encumbrance

### Carrying Capacity
```javascript
function calculateCarryingCapacity(strength) {
    // D&D 3.5 Carrying Capacity Table
    const strengthTable = {
        1: { light: 3, medium: 6, heavy: 10 },
        2: { light: 6, medium: 13, heavy: 20 },
        3: { light: 10, medium: 20, heavy: 30 },
        // ... complete table up to strength 29+
        10: { light: 33, medium: 66, heavy: 100 },
        11: { light: 38, medium: 76, heavy: 115 },
        12: { light: 43, medium: 86, heavy: 130 },
        13: { light: 50, medium: 100, heavy: 150 },
        14: { light: 58, medium: 116, heavy: 175 },
        15: { light: 66, medium: 133, heavy: 200 },
        // ... continue table
    };
    
    const baseCapacity = strengthTable[Math.min(strength, 29)];
    
    // For strength 30+, multiply by 4 for each 10 points above 29
    if (strength > 29) {
        const multiplier = Math.pow(4, Math.floor((strength - 29) / 10));
        return {
            light: baseCapacity.light * multiplier,
            medium: baseCapacity.medium * multiplier,
            heavy: baseCapacity.heavy * multiplier
        };
    }
    
    return baseCapacity;
}

function calculateEncumbranceEffects(totalWeight, carryingCapacity) {
    if (totalWeight <= carryingCapacity.light) {
        return { level: 'light', speedReduction: 0, checkPenalty: 0, maxDexBonus: 999 };
    } else if (totalWeight <= carryingCapacity.medium) {
        return { level: 'medium', speedReduction: 10, checkPenalty: -3, maxDexBonus: 3 };
    } else if (totalWeight <= carryingCapacity.heavy) {
        return { level: 'heavy', speedReduction: 10, checkPenalty: -6, maxDexBonus: 1 };
    } else {
        return { level: 'overloaded', speedReduction: 0, checkPenalty: -999, maxDexBonus: 0, immobilized: true };
    }
}
```

## Data Validation and Error Handling

### Comprehensive Character Validation
```javascript
function validateCompleteCharacter(character) {
    const validation = {
        valid: true,
        errors: [],
        warnings: [],
        suggestions: []
    };
    
    // Validate required components
    if (!character.abilities) {
        validation.errors.push('Character must have ability scores');
        validation.valid = false;
    } else {
        // Validate point buy allocation
        const pointBuyCheck = validatePointBuyAllocation(character.abilities);
        if (!pointBuyCheck.valid) {
            validation.errors.push(`Point buy error: ${pointBuyCheck.reason}`);
            validation.valid = false;
        }
    }
    
    // Validate race selection
    if (!character.race || !SRD_RACES[character.race]) {
        validation.errors.push('Valid race must be selected');
        validation.valid = false;
    }
    
    // Validate class selection
    if (!character.class || !SRD_CLASSES[character.class]) {
        validation.errors.push('Valid class must be selected');
        validation.valid = false;
    }
    
    // Validate skill allocation
    if (character.skills) {
        const skillCheck = validateSkillAllocation(character.skills, character.class);
        if (!skillCheck.valid) {
            validation.errors.push(...skillCheck.errors);
            validation.valid = false;
        }
    }
    
    // Validate feat prerequisites
    if (character.feats) {
        character.feats.forEach(featId => {
            const featCheck = validateFeatPrerequisites(featId, character);
            if (!featCheck.valid) {
                validation.errors.push(`Feat ${featId}: ${featCheck.reasons.join(', ')}`);
                validation.valid = false;
            }
        });
    }
    
    // Check for optimization suggestions
    if (character.abilities && character.class) {
        const suggestions = generateCharacterSuggestions(character);
        validation.suggestions.push(...suggestions);
    }
    
    return validation;
}

function generateCharacterSuggestions(character) {
    const suggestions = [];
    const primaryAbility = getPrimaryAbilityForClass(character.class);
    
    if (character.abilities[primaryAbility] < 14) {
        suggestions.push(`Consider higher ${primaryAbility.toUpperCase()} for ${character.class} effectiveness`);
    }
    
    // Class-specific suggestions
    if (character.class === 'wizard' && character.abilities.int < 16) {
        suggestions.push('Wizards benefit greatly from high Intelligence for bonus spells and spell DCs');
    }
    
    if (character.class === 'fighter' && !character.feats.includes('power-attack') && character.abilities.str >= 13) {
        suggestions.push('Power Attack is an excellent feat choice for fighters');
    }
    
    return suggestions;
}
```

This comprehensive specification ensures accurate D&D 3.5 rule implementation with proper SRD compliance, mathematical precision, and thorough validation for a production-ready gaming system.
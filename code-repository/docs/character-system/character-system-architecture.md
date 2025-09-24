# 🧙‍♂️ Character System Architecture

![Character System](https://img.shields.io/badge/Character%20System-Core%20Engine-4B0082?style=for-the-badge&logo=user&logoColor=FFD700)

> **Complete Character Management System**  
> From creation to epic levels - manage every aspect of your D&D 3.5 characters.

---

## 🎯 **System Overview**

### 🏗️ **Architecture Components**

```
CHARACTER SYSTEM STACK
├── 👤 Character Creator (Frontend)
├── 🧮 Character Calculator (Logic Engine)  
├── 📊 Character Data Manager (Storage)
├── 🎲 Dice Integration (Probability)
├── 📚 SRD Rules Engine (Validation)
└── 💾 Persistence Layer (Save/Load)
```

### 🌟 **Key Features**
- **7-Step Creation Wizard**: Complete D&D 3.5 character generation
- **Real-Time Calculations**: Instant stat updates and validation
- **Rule Compliance**: Strict adherence to SRD guidelines  
- **Multi-Format Export**: JSON, PDF, character sheets
- **Campaign Integration**: Ready for adventure engine

---

## 🛠️ **Character Creator Wizard**

### 📋 **Step-by-Step Process**

#### **Step 1: Basic Information** 
```javascript
CHARACTER_BASICS = {
    name: "Character Name",
    player: "Player Name", 
    campaign: "Campaign Name",
    experience: 0,
    level: 1,
    alignment: "Lawful Good", // 9 alignments
    deity: "Optional Deity",
    age: 25,
    height: "5'8\"", 
    weight: "150 lbs",
    gender: "Male/Female/Other",
    description: "Character background"
}
```

#### **Step 2: Race Selection**
```javascript  
RACE_OPTIONS = {
    human: {
        abilityMods: { /* none */ },
        bonusFeats: 1,
        bonusSkillPoints: 4,
        size: "Medium",
        speed: 30,
        specialAbilities: ["Extra Feat", "Versatile"]
    },
    elf: {
        abilityMods: { dexterity: 2, constitution: -2 },
        bonusFeats: 0, 
        bonusSkillPoints: 0,
        size: "Medium",
        speed: 30,
        specialAbilities: ["Low-Light Vision", "Keen Senses", "Weapon Training"]
    }
    // ... all core races
}
```

#### **Step 3: Ability Scores**
```javascript
ABILITY_GENERATION = {
    methods: {
        pointBuy: {
            points: 25, // or 27 for higher power
            costs: {
                8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5,
                14: 6, 15: 8, 16: 10, 17: 13, 18: 16
            }
        },
        rollStats: {
            method: "4d6 drop lowest",
            rerollOnes: false,
            times: 6
        },
        standardArray: [15, 14, 13, 12, 10, 8]
    },
    
    modifierCalculation: function(score) {
        return Math.floor((score - 10) / 2);
    }
}
```

#### **Step 4: Class Selection**  
```javascript
CLASS_FEATURES = {
    fighter: {
        hitDie: "d10",
        baseAttackBonus: "good", 
        savingThrows: {
            fortitude: "good",
            reflex: "poor", 
            will: "poor"
        },
        skillPoints: 2,
        classSkills: ["Climb", "Handle Animal", "Intimidate", "Jump", "Ride", "Swim"],
        bonusFeats: {
            1: 1, // bonus feat at 1st level
            2: 1, // bonus feat at 2nd level  
            4: 1, // every even level
            6: 1
        },
        weaponArmorProficiency: "all"
    },
    
    wizard: {
        hitDie: "d4",
        baseAttackBonus: "poor",
        savingThrows: {
            fortitude: "poor", 
            reflex: "poor",
            will: "good"
        },
        skillPoints: 2,
        classSkills: ["Concentration", "Craft", "Knowledge", "Spellcraft"],
        spellcasting: {
            type: "prepared",
            ability: "intelligence",
            spellbook: true,
            bonusSpells: true
        },
        bonusFeats: {
            1: 1, // Scribe Scroll
            5: 1, // every 5 levels
            10: 1
        }
    }
    // ... all base classes
}
```

#### **Step 5: Skills & Feats**
```javascript
SKILL_SYSTEM = {
    pointCalculation: function(intelligence, level, class) {
        return (class.skillPoints + intelligence.modifier) * level;
    },
    
    maxRanks: {
        classSkill: function(level) { return level + 3; },
        crossClassSkill: function(level) { return Math.floor((level + 3) / 2); }
    },
    
    costs: {
        classSkill: 1,
        crossClassSkill: 2
    },
    
    synergies: {
        "Jump": { from: "Tumble", ranks: 5, bonus: 2 },
        "Use Rope": { from: "Escape Artist", ranks: 5, bonus: 2 }
    }
}

FEAT_SYSTEM = {
    progression: {
        human: [1, 3, 6, 9, 12, 15, 18], // extra at 1st
        other: [1, 3, 6, 9, 12, 15, 18]
    },
    
    categories: {
        general: ["Toughness", "Skill Focus", "Alertness"],
        combat: ["Power Attack", "Combat Expertise", "Weapon Focus"], 
        metamagic: ["Empower Spell", "Maximize Spell", "Quicken Spell"],
        itemCreation: ["Craft Wondrous Item", "Forge Ring", "Scribe Scroll"]
    }
}
```

#### **Step 6: Equipment & Gear**
```javascript
STARTING_EQUIPMENT = {
    byClass: {
        fighter: {
            wealth: "6d4 × 10 gp",
            equipment: [
                "Scale mail or leather armor", 
                "Shield",
                "Martial weapon",
                "Simple weapon or second martial"
            ]
        },
        wizard: {
            wealth: "3d4 × 10 gp", 
            equipment: [
                "Spellbook with all 0-level spells + 3 1st-level",
                "Simple weapon",
                "No armor proficiency"
            ]
        }
    },
    
    wealthByLevel: {
        1: 0, 2: 900, 3: 2700, 4: 5400, 5: 9000,
        6: 13000, 7: 19000, 8: 27000, 9: 36000, 10: 49000
        // ... continues to level 20
    }
}
```

#### **Step 7: Spells (Spellcasters)**
```javascript
SPELL_SELECTION = {
    prepared: { // Wizards, Clerics, Druids
        known: "all in spellbook/domain/druid list",
        dailySlots: function(level, ability, class) {
            return baseSlots[level] + bonusSpells[ability];
        },
        preparation: "must prepare each morning"
    },
    
    spontaneous: { // Sorcerers, Bards
        known: "limited selection", 
        dailySlots: function(level, ability) {
            return baseSlots[level] + bonusSpells[ability];
        },
        preparation: "cast any known spell"
    },
    
    spellProgression: {
        wizard: [
            [3, 1], // Level 1: 3 cantrips, 1 first-level
            [4, 2], // Level 2: 4 cantrips, 2 first-level
            [4, 2, 1] // Level 3: 4 cantrips, 2 first, 1 second
        ]
    }
}
```

---

## ⚙️ **Character Calculator Engine**

### 🧮 **Calculation Systems**

#### **Ability Score Dependencies**
```javascript
class CharacterCalculator {
    
    calculateModifier(abilityScore) {
        return Math.floor((abilityScore - 10) / 2);
    }
    
    calculateHitPoints(character) {
        let hp = 0;
        for (let level = 1; level <= character.level; level++) {
            let hitDie = character.classes[level].hitDie;
            let conMod = this.calculateModifier(character.constitution);
            
            if (level === 1) {
                hp += hitDie.maximum + conMod; // max at 1st level
            } else {
                hp += character.hitPointRolls[level] + conMod;
            }
        }
        return Math.max(hp, character.level); // minimum 1 per level
    }
    
    calculateArmorClass(character) {
        let baseAC = 10;
        let armorBonus = character.equipment.armor?.acBonus || 0;
        let shieldBonus = character.equipment.shield?.acBonus || 0;
        let dexMod = this.calculateModifier(character.dexterity);
        let sizeMod = character.race.sizeModifier.ac;
        
        // Apply max dex from armor
        if (character.equipment.armor?.maxDex !== undefined) {
            dexMod = Math.min(dexMod, character.equipment.armor.maxDex);
        }
        
        return baseAC + armorBonus + shieldBonus + dexMod + sizeMod;
    }
    
    calculateAttackBonus(character, weapon) {
        let bab = this.calculateBAB(character);
        let abilityMod = weapon.ranged ? 
            this.calculateModifier(character.dexterity) :
            this.calculateModifier(character.strength);
        let sizeMod = character.race.sizeModifier.attack;
        let weaponBonus = weapon.enhancement || 0;
        
        return bab + abilityMod + sizeMod + weaponBonus;
    }
    
    calculateSavingThrows(character) {
        let saves = { fortitude: 0, reflex: 0, will: 0 };
        
        // Base saves from classes
        character.classes.forEach(classLevel => {
            saves.fortitude += classLevel.saves.fortitude;
            saves.reflex += classLevel.saves.reflex; 
            saves.will += classLevel.saves.will;
        });
        
        // Ability modifiers
        saves.fortitude += this.calculateModifier(character.constitution);
        saves.reflex += this.calculateModifier(character.dexterity);
        saves.will += this.calculateModifier(character.wisdom);
        
        return saves;
    }
}
```

### 📊 **Validation System**
```javascript
class CharacterValidator {
    
    validateAbilityScores(character) {
        let errors = [];
        
        // Check point buy limits
        if (character.generation.method === "pointBuy") {
            let pointsSpent = this.calculatePointsSpent(character.abilities);
            if (pointsSpent > character.generation.pointLimit) {
                errors.push(`Spent ${pointsSpent} points, limit is ${character.generation.pointLimit}`);
            }
        }
        
        // Check racial modifications applied
        let racialMods = character.race.abilityModifiers;
        for (let ability in racialMods) {
            let expectedScore = character.baseAbilities[ability] + racialMods[ability];
            if (character.abilities[ability] !== expectedScore) {
                errors.push(`${ability} should be ${expectedScore} with racial modifiers`);
            }
        }
        
        return errors;
    }
    
    validateSkills(character) {
        let errors = [];
        let availablePoints = this.calculateSkillPoints(character);
        let spentPoints = 0;
        
        for (let skill in character.skills) {
            let ranks = character.skills[skill].ranks;
            let maxRanks = this.getMaxRanks(skill, character);
            
            if (ranks > maxRanks) {
                errors.push(`${skill} ranks (${ranks}) exceed maximum (${maxRanks})`);
            }
            
            let cost = this.isClassSkill(skill, character) ? 1 : 2;
            spentPoints += ranks * cost;
        }
        
        if (spentPoints > availablePoints) {
            errors.push(`Spent ${spentPoints} skill points, have ${availablePoints}`);
        }
        
        return errors;
    }
    
    validateFeats(character) {
        let errors = [];
        
        for (let feat of character.feats) {
            let prerequisites = this.getFeatPrerequisites(feat);
            
            for (let prereq of prerequisites) {
                if (!this.meetsPrerequisite(character, prereq)) {
                    errors.push(`${feat} requires ${prereq.description}`);
                }
            }
        }
        
        return errors;
    }
}
```

---

## 💾 **Data Management**

### 📁 **Character Storage Format**
```javascript
CHARACTER_SCHEMA = {
    version: "1.0",
    metadata: {
        created: Date,
        modified: Date,
        creator: "RulzLawyer Character Creator",
        campaign: String
    },
    
    basic: {
        name: String,
        player: String,
        level: Number,
        experience: Number,
        alignment: String,
        deity: String,
        age: Number,
        gender: String,
        height: String,
        weight: String,
        description: String
    },
    
    race: {
        name: String,
        size: String,
        speed: Number,
        abilityModifiers: Object,
        specialAbilities: Array,
        languages: Array
    },
    
    abilities: {
        strength: Number,
        dexterity: Number,
        constitution: Number,
        intelligence: Number,
        wisdom: Number,
        charisma: Number
    },
    
    classes: Array, // [{name, level, hitPoints, features}]
    skills: Object, // {skillName: {ranks, misc, total}}
    feats: Array,   // [{name, type, prerequisites}]
    
    equipment: {
        weapons: Array,
        armor: Object,
        shield: Object,
        items: Array,
        money: {cp: 0, sp: 0, gp: 0, pp: 0}
    },
    
    spells: {
        known: Array,
        prepared: Array,
        slots: Object // {0: 3, 1: 2, 2: 1}  
    },
    
    calculated: {
        hitPoints: {total, current, temporary},
        armorClass: {total, touch, flatFooted},
        initiative: Number,
        speed: Number,
        saves: {fortitude, reflex, will},
        attacks: Array,
        skillTotals: Object
    }
}
```

### 🔄 **Import/Export System**
```javascript
class CharacterManager {
    
    exportCharacter(character, format = "json") {
        switch (format) {
            case "json":
                return JSON.stringify(character, null, 2);
                
            case "pdf":
                return this.generatePDF(character);
                
            case "txt": 
                return this.generateTextSheet(character);
                
            case "xml":
                return this.generateXML(character);
        }
    }
    
    importCharacter(data, format = "json") {
        let character;
        
        switch (format) {
            case "json":
                character = JSON.parse(data);
                break;
                
            case "pcgen":
                character = this.parsePCGen(data);
                break;
                
            case "herolab":
                character = this.parseHeroLab(data);
                break;
        }
        
        return this.validateAndUpgrade(character);
    }
    
    saveCharacter(character, filename) {
        let data = this.exportCharacter(character, "json");
        let blob = new Blob([data], {type: "application/json"});
        this.downloadFile(blob, filename + ".json");
    }
}
```

---

## 🎲 **Integration Systems**

### ⚙️ **Adventure Engine Interface**
```javascript
class AdventureCharacterInterface {
    
    prepareForAdventure(character) {
        return {
            level: character.level,
            hitPoints: character.calculated.hitPoints,
            armorClass: character.calculated.armorClass,
            saves: character.calculated.saves,
            skills: character.calculated.skillTotals,
            spells: character.spells.prepared,
            equipment: character.equipment,
            
            // Adventure-specific data
            initiativeBonus: this.calculateInitiative(character),
            speed: character.calculated.speed,
            attacks: this.formatAttacks(character),
            specialAbilities: this.getSpecialAbilities(character)
        };
    }
    
    updateFromAdventure(character, adventureData) {
        // Update current HP, spell slots, etc.
        character.calculated.hitPoints.current = adventureData.currentHP;
        character.spells.slots = adventureData.remainingSlots;
        character.equipment.items = adventureData.inventory;
        
        // Experience and level checks
        if (adventureData.experienceGained > 0) {
            this.addExperience(character, adventureData.experienceGained);
        }
        
        return character;
    }
}
```

### 🎯 **Dice Engine Integration**
```javascript
class CharacterDiceInterface {
    
    rollInitiative(character) {
        let bonus = this.calculateModifier(character.dexterity);
        return window.diceEngine.roll(`1d20+${bonus}`, "Initiative");
    }
    
    rollSave(character, saveType) {
        let bonus = character.calculated.saves[saveType];
        return window.diceEngine.roll(`1d20+${bonus}`, `${saveType} save`);
    }
    
    rollAttack(character, weapon) {
        let bonus = this.calculateAttackBonus(character, weapon);
        let result = window.diceEngine.roll(`1d20+${bonus}`, `${weapon.name} attack`);
        
        // Check for critical threat
        if (result.naturalRoll >= weapon.criticalThreat) {
            result.criticalThreat = true;
            result.confirmRoll = window.diceEngine.roll(`1d20+${bonus}`, "Critical confirmation");
        }
        
        return result;
    }
    
    rollDamage(character, weapon, critical = false) {
        let damageRoll = weapon.damage;
        let bonus = this.calculateDamageBonus(character, weapon);
        
        if (critical) {
            // Multiply weapon dice, not bonuses
            damageRoll = this.multiplyCritical(weapon.damage, weapon.criticalMultiplier);
        }
        
        return window.diceEngine.roll(`${damageRoll}+${bonus}`, `${weapon.name} damage`);
    }
}
```

---

## 🧪 **Testing & Quality Assurance**

### ✅ **Test Coverage**
```javascript
describe("Character System Tests", () => {
    
    test("Ability Score Calculations", () => {
        let character = createTestCharacter();
        character.abilities.strength = 16;
        
        expect(calculator.calculateModifier(16)).toBe(3);
        expect(character.calculated.meleeAttack).toBe(4); // BAB 1 + Str 3
    });
    
    test("Skill Point Allocation", () => {
        let wizard = createWizard();
        wizard.abilities.intelligence = 16; // +3 modifier
        
        let skillPoints = calculator.calculateSkillPoints(wizard);
        expect(skillPoints).toBe(20); // (2 + 3) * 4 for first level
    });
    
    test("Spell Slot Calculation", () => {
        let sorcerer = createSorcerer();
        sorcerer.abilities.charisma = 16; // +3 modifier
        sorcerer.level = 3;
        
        let slots = calculator.calculateSpellSlots(sorcerer);
        expect(slots[1]).toBe(6); // 5 base + 1 bonus for Cha 16
    });
});
```

### 🔍 **Validation Tests**
```javascript
describe("Character Validation", () => {
    
    test("Point Buy Validation", () => {
        let character = createPointBuyCharacter();
        character.abilities = {str: 18, dex: 16, con: 16, int: 14, wis: 12, cha: 8};
        
        let errors = validator.validateAbilityScores(character);
        expect(errors.length).toBeGreaterThan(0); // Should exceed point limit
    });
    
    test("Feat Prerequisites", () => {
        let fighter = createFighter();
        fighter.feats.push("Weapon Specialization (Longsword)");
        fighter.level = 1; // Should be at least 4th level
        
        let errors = validator.validateFeats(fighter);
        expect(errors).toContain("Weapon Specialization requires Fighter 4th level");
    });
});
```

---

## 📚 **API Reference**

### 🛠️ **Core Functions**
```javascript
// Character Creation
characterCreator.startWizard(container)
characterCreator.nextStep(stepData)
characterCreator.previousStep()
characterCreator.finishCharacter()

// Character Management  
characterManager.saveCharacter(character, filename)
characterManager.loadCharacter(filename)
characterManager.exportCharacter(character, format)
characterManager.importCharacter(data, format)

// Calculations
calculator.calculateHitPoints(character)
calculator.calculateArmorClass(character)
calculator.calculateSkillTotals(character)
calculator.calculateSpellSlots(character)

// Validation
validator.validateCharacter(character)
validator.validateAbilityScores(character)
validator.validateSkills(character)
validator.validateFeats(character)
```

---

<div align="center">

### 🧙‍♂️ **Build Epic Characters**

**[Start Character Creator](../../new-character-creator.html)** | **[D&D Rules](../game-rules/dnd-35-srd-rules.md)** | **[Player Guides](../player-guides/)**

---

*Power up your adventures with the ultimate character system!*

</div>
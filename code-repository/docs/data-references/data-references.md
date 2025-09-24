# 📚 Data References & Tables

![Data References](https://img.shields.io/badge/Data%20References-D%26D%203.5%20SRD-4169E1?style=for-the-badge&logo=database&logoColor=FFD700)

> **Complete D&D 3.5 SRD Data Repository**  
> Comprehensive tables, spell database, monster manual, and equipment reference.

---

## 🎲 **Random Tables Index**

### 📊 **Master Table Collection**

#### **Treasure Generation Tables**
```
TREASURE TABLES BY CHALLENGE RATING

CR 1-4 (Low Level):
├── Coins: 3d6 × 10 cp, 2d6 × 10 sp, 1d4 × 10 gp
├── Items: 50% mundane, 30% masterwork, 20% minor magic
└── Magic: Potions, scrolls, +1 weapons/armor

CR 5-10 (Mid Level):
├── Coins: 2d4 × 100 gp, 1d6 × 10 pp  
├── Items: 30% mundane, 40% masterwork, 30% magic
└── Magic: Wands, rings, +1/+2 items, moderate magic

CR 11-16 (High Level):
├── Coins: 3d4 × 1000 gp, 3d4 × 100 pp
├── Items: 20% mundane, 30% masterwork, 50% magic  
└── Magic: Staffs, major items, +3/+4 items, artifacts

CR 17+ (Epic Level):
├── Coins: 5d4 × 10000 gp, 2d4 × 1000 pp
├── Items: 10% mundane, 40% masterwork, 50% major magic
└── Magic: Legendary items, +5 items, epic artifacts
```

#### **Random Encounter Tables**
```javascript
ENCOUNTER_TABLES = {
    forest: {
        day: [
            {range: "01-05", encounter: "1 Dire Wolf", cr: 3},
            {range: "06-10", encounter: "2-4 Wolves", cr: 2},
            {range: "11-15", encounter: "1 Brown Bear", cr: 4},
            {range: "16-20", encounter: "1 Owlbear", cr: 5},
            {range: "21-25", encounter: "2-5 Orcs", cr: 3},
            {range: "26-30", encounter: "1 Dryad", cr: 3},
            {range: "31-35", encounter: "3-6 Dire Rats", cr: 2},
            {range: "36-40", encounter: "1 Displacer Beast", cr: 4},
            {range: "41-45", encounter: "2-4 Stirges", cr: 1},
            {range: "46-50", encounter: "1 Unicorn", cr: 4},
            {range: "51-55", encounter: "1-3 Satyrs", cr: 2},
            {range: "56-60", encounter: "2-8 Sprites", cr: 1},
            {range: "61-65", encounter: "1 Treant", cr: 8},
            {range: "66-70", encounter: "1-4 Centaurs", cr: 3},
            {range: "71-75", encounter: "1 Shambling Mound", cr: 5},
            {range: "76-80", encounter: "2-5 Hobgoblins", cr: 3},
            {range: "81-85", encounter: "1 Dire Boar", cr: 4},
            {range: "86-90", encounter: "1-2 Ettercaps", cr: 3},
            {range: "91-95", encounter: "1 Green Dragon (Young)", cr: 10},
            {range: "96-00", encounter: "DM's Choice", cr: "Variable"}
        ],
        night: [
            {range: "01-10", encounter: "2-5 Dire Rats", cr: 2},
            {range: "11-20", encounter: "1-3 Owls", cr: 1},
            {range: "21-30", encounter: "1-2 Will-o'-wisps", cr: 6},
            {range: "31-40", encounter: "1 Dire Wolf", cr: 3},
            {range: "41-50", encounter: "2-4 Wolves", cr: 2},
            {range: "51-60", encounter: "1-4 Stirges", cr: 1},
            {range: "61-70", encounter: "1 Shadow", cr: 3},
            {range: "71-80", encounter: "1-2 Wraiths", cr: 5},
            {range: "81-90", encounter: "1 Shambling Mound", cr: 5},
            {range: "91-00", encounter: "1 Ghost", cr: 7}
        ]
    },
    
    dungeon: {
        common: [
            {range: "01-15", encounter: "2-12 Rats", cr: 0},
            {range: "16-25", encounter: "3-18 Giant Ants", cr: 1},
            {range: "26-35", encounter: "2-8 Dire Rats", cr: 2},
            {range: "36-45", encounter: "1-6 Fire Beetles", cr: 1},
            {range: "46-55", encounter: "2-5 Orcs", cr: 3},
            {range: "56-65", encounter: "1-4 Skeletons", cr: 2},
            {range: "66-75", encounter: "1-3 Zombies", cr: 3},
            {range: "76-85", encounter: "1-2 Ghouls", cr: 3},
            {range: "86-95", encounter: "1 Gelatinous Cube", cr: 4},
            {range: "96-00", encounter: "1 Owlbear", cr: 5}
        ]
    },
    
    urban: {
        day: [
            {range: "01-20", encounter: "City Watch Patrol (4-8 guards)", cr: 3},
            {range: "21-30", encounter: "Noble with 2-4 bodyguards", cr: 4},
            {range: "31-40", encounter: "Merchant caravan", cr: 2},
            {range: "41-50", encounter: "Pickpocket (1st level rogue)", cr: 1},
            {range: "51-60", encounter: "Street performer", cr: 0},
            {range: "61-70", encounter: "Beggar seeking alms", cr: 0},  
            {range: "71-80", encounter: "Town crier with news", cr: 0},
            {range: "81-90", encounter: "Drunk causing trouble", cr: 1},
            {range: "91-95", encounter: "Mysterious hooded figure", cr: "Variable"},
            {range: "96-00", encounter: "DM's Choice", cr: "Variable"}
        ],
        night: [
            {range: "01-15", encounter: "2-5 Thugs", cr: 3},
            {range: "16-25", encounter: "1-2 Assassins", cr: 4},
            {range: "26-35", encounter: "Watch patrol (2-4 guards)", cr: 2},
            {range: "36-45", encounter: "Cutpurse gang (3-6 rogues)", cr: 4},
            {range: "46-55", encounter: "Drunk noble", cr: 1},
            {range: "56-65", encounter: "Prostitute", cr: 0},
            {range: "66-75", encounter: "Wererat", cr: 3},
            {range: "76-85", encounter: "Vampire spawn", cr: 4},
            {range: "86-95", encounter: "1-3 Shadows", cr: 5},
            {range: "96-00", encounter: "Vampire", cr: 8}
        ]
    }
}
```

### 🎯 **Magic Item Generation**

#### **Magic Item Tables by Type**
```javascript
MAGIC_ITEMS_BY_TYPE = {
    weapons: {
        minor: [
            {name: "+1 Weapon", probability: 0.30, gp: 2000},
            {name: "Masterwork Weapon", probability: 0.20, gp: 300},
            {name: "+1 Flaming Weapon", probability: 0.15, gp: 8000},
            {name: "+1 Frost Weapon", probability: 0.15, gp: 8000},
            {name: "+1 Shock Weapon", probability: 0.15, gp: 8000},
            {name: "Silvered Weapon", probability: 0.05, gp: 100}
        ],
        medium: [
            {name: "+2 Weapon", probability: 0.25, gp: 8000},
            {name: "+1 Keen Weapon", probability: 0.20, gp: 8000},
            {name: "+1 Wounding Weapon", probability: 0.15, gp: 8000},
            {name: "+2 Flaming Weapon", probability: 0.15, gp: 18000},
            {name: "+1 Holy Weapon", probability: 0.10, gp: 18000},
            {name: "+1 Unholy Weapon", probability: 0.10, gp: 18000},
            {name: "Weapon of Spell Storing", probability: 0.05, gp: 20000}
        ],
        major: [
            {name: "+3 Weapon", probability: 0.20, gp: 18000},
            {name: "+4 Weapon", probability: 0.15, gp: 32000},
            {name: "+5 Weapon", probability: 0.10, gp: 50000},
            {name: "+2 Holy Avenger", probability: 0.05, gp: 120000},
            {name: "Vorpal Sword", probability: 0.02, gp: 200000},
            {name: "Artifact Weapon", probability: 0.01, gp: "Priceless"}
        ]
    },
    
    armor: {
        minor: [
            {name: "+1 Armor", probability: 0.35, gp: 1000},
            {name: "Masterwork Armor", probability: 0.25, gp: 150},
            {name: "+1 Shadow Armor", probability: 0.15, gp: 3750},
            {name: "+1 Silent Moves Armor", probability: 0.15, gp: 3750},
            {name: "Elven Chain", probability: 0.10, gp: 4150}
        ],
        medium: [
            {name: "+2 Armor", probability: 0.30, gp: 4000},
            {name: "+3 Armor", probability: 0.20, gp: 9000},
            {name: "+1 Spell Resistance Armor", probability: 0.15, gp: 18000},
            {name: "+2 Shadow Armor", probability: 0.15, gp: 26500},
            {name: "Mithral Shirt", probability: 0.10, gp: 1100},
            {name: "Adamantine Plate", probability: 0.10, gp: 4000}
        ],
        major: [
            {name: "+4 Armor", probability: 0.25, gp: 16000},
            {name: "+5 Armor", probability: 0.15, gp: 25000},
            {name: "+3 Spell Resistance Armor", probability: 0.20, gp: 40000},
            {name: "Armor of Invulnerability", probability: 0.05, gp: 137650},
            {name: "Celestial Armor", probability: 0.03, gp: 22400}
        ]
    },
    
    rings: [
        {name: "Ring of Protection +1", probability: 0.20, gp: 2000},
        {name: "Ring of Feather Falling", probability: 0.15, gp: 2200},
        {name: "Ring of Swimming", probability: 0.10, gp: 2500},
        {name: "Ring of Invisibility", probability: 0.08, gp: 20000},
        {name: "Ring of Wizardry I", probability: 0.05, gp: 20000},
        {name: "Ring of Three Wishes", probability: 0.01, gp: 120000}
    ],
    
    wands: [
        {name: "Wand of Magic Missiles (1st)", probability: 0.25, gp: 750},
        {name: "Wand of Cure Light Wounds", probability: 0.20, gp: 750},
        {name: "Wand of Detect Magic", probability: 0.15, gp: 375},
        {name: "Wand of Fireball (5th)", probability: 0.10, gp: 11250},
        {name: "Wand of Lightning Bolt (5th)", probability: 0.08, gp: 11250},
        {name: "Wand of Polymorth", probability: 0.02, gp: 21000}
    ]
}
```

---

## 📖 **Spell Database**

### 🔮 **Complete Spell Reference**

#### **Spells by Level (Wizard/Sorcerer)**
```javascript
WIZARD_SPELLS = {
    level0: [
        {
            name: "Acid Splash",
            school: "Conjuration",
            components: ["V", "S"],
            castingTime: "1 standard action", 
            range: "Close (25 ft. + 5 ft./2 levels)",
            effect: "One missile of acid",
            duration: "Instantaneous",
            savingThrow: "None",
            spellResistance: "No",
            description: "You fire a small orb of acid at the target. You must succeed on a ranged touch attack to hit your target. The orb deals 1d3 points of acid damage."
        },
        {
            name: "Detect Magic",
            school: "Divination", 
            components: ["V", "S"],
            castingTime: "1 standard action",
            range: "60 ft.",
            area: "Cone-shaped emanation",
            duration: "Concentration, up to 1 min./level (D)",
            savingThrow: "None",
            spellResistance: "No",
            description: "You detect magical auras within 60 feet. The amount of information revealed depends on how long you study a particular area or subject."
        },
        {
            name: "Light",
            school: "Evocation",
            components: ["V", "M/DF"], 
            castingTime: "1 standard action",
            range: "Touch",
            target: "Object touched",
            duration: "10 min./level (D)",
            savingThrow: "None",
            spellResistance: "No",
            description: "This spell causes an object to glow like a torch, shedding bright light in a 20-foot radius."
        },
        {
            name: "Mage Hand",
            school: "Transmutation",
            components: ["V", "S"],
            castingTime: "1 standard action",
            range: "Close (25 ft. + 5 ft./2 levels)",
            target: "One nonmagical, unattended object weighing up to 5 lb.",
            duration: "Concentration",
            savingThrow: "None", 
            spellResistance: "No",
            description: "You point your finger at an object and can lift it and move it at will from a distance."
        }
    ],
    
    level1: [
        {
            name: "Magic Missile",
            school: "Evocation",
            components: ["V", "S"],
            castingTime: "1 standard action",
            range: "Medium (100 ft. + 10 ft./level)",
            targets: "Up to five creatures, no two of which can be more than 15 ft. apart",
            duration: "Instantaneous",
            savingThrow: "None",
            spellResistance: "Yes", 
            description: "A missile of magical energy darts forth from your fingertip and strikes its target, dealing 1d4+1 points of force damage. The missile strikes unerringly."
        },
        {
            name: "Shield", 
            school: "Abjuration",
            components: ["V", "S"],
            castingTime: "1 standard action",
            range: "Personal",
            target: "You",
            duration: "1 min./level (D)",
            description: "An invisible, tower shield-sized mobile disk of force hovers in front of you. This gives you a +4 shield bonus to AC."
        },
        {
            name: "Burning Hands",
            school: "Evocation",
            components: ["V", "S"],
            castingTime: "1 standard action",
            range: "15 ft.",
            area: "Cone-shaped burst",
            duration: "Instantaneous", 
            savingThrow: "Reflex half",
            spellResistance: "Yes",
            description: "A cone of searing flame shoots from your fingertips. Any creature in the area of the flames takes 1d4 points of fire damage per caster level (maximum 5d4)."
        }
    ],
    
    level2: [
        {
            name: "Fireball",
            school: "Evocation",
            components: ["V", "S", "M"],
            castingTime: "1 standard action",
            range: "Long (400 ft. + 40 ft./level)", 
            area: "20-ft.-radius spread",
            duration: "Instantaneous",
            savingThrow: "Reflex half",
            spellResistance: "Yes",
            description: "A fireball spell is an explosion of flame that detonates with a low roar and deals 1d6 points of fire damage per caster level (maximum 10d6) to every creature within the area."
        },
        {
            name: "Lightning Bolt",
            school: "Evocation",
            components: ["V", "S", "M"],
            castingTime: "1 standard action",
            range: "120 ft.",
            area: "120-ft. line",
            duration: "Instantaneous",
            savingThrow: "Reflex half",
            spellResistance: "Yes", 
            description: "You release a powerful stroke of electrical energy that deals 1d6 points of electricity damage per caster level (maximum 10d6) to each creature within its area."
        }
    ]
    // ... continues through level 9
}
```

#### **Spells by School**
```javascript
SPELLS_BY_SCHOOL = {
    abjuration: {
        description: "Protection, banishment, negation",
        opposition: "Conjuration and Necromancy (typical)",
        spells: {
            0: ["Resistance"],
            1: ["Alarm", "Endure Elements", "Protection from Evil", "Shield"],
            2: ["Arcane Lock", "Obscure Object", "Protection from Arrows"],
            3: ["Dispel Magic", "Explosive Runes", "Magic Circle against Evil", "Nondetection"],
            4: ["Dimensional Anchor", "Fire Trap", "Globe of Invulnerability, Lesser", "Remove Curse"],
            5: ["Break Enchantment", "Dismissal", "Mage's Private Sanctum"],
            6: ["Antimagic Field", "Dispel Magic, Greater", "Globe of Invulnerability", "Repulsion"],
            7: ["Banishment", "Sequester", "Spell Turning"],
            8: ["Dimensional Lock", "Mind Blank", "Prismatic Wall"],
            9: ["Freedom", "Imprisonment", "Mage's Disjunction", "Prismatic Sphere"]
        }
    },
    
    conjuration: {
        description: "Teleportation, summoning, creation",
        subschools: ["Calling", "Creation", "Healing", "Summoning", "Teleportation"],
        spells: {
            0: ["Acid Splash"],
            1: ["Grease", "Mage Armor", "Mount", "Summon Monster I"],
            2: ["Fog Cloud", "Glitterdust", "Summon Monster II", "Web"],
            3: ["Phantom Steed", "Sepia Snake Sigil", "Stinking Cloud", "Summon Monster III"],
            4: ["Dimension Door", "Evard's Black Tentacles", "Summon Monster IV"],
            5: ["Cloudkill", "Cone of Cold", "Summon Monster V", "Teleport"],
            6: ["Acid Fog", "Planar Binding", "Summon Monster VI"],
            7: ["Plane Shift", "Summon Monster VII", "Teleport, Greater"],
            8: ["Incendiary Cloud", "Maze", "Summon Monster VIII"],
            9: ["Gate", "Summon Monster IX", "Teleportation Circle"]
        }
    },
    
    divination: {
        description: "Knowledge, detection, scrying",
        spells: {
            0: ["Detect Magic", "Detect Poison", "Read Magic"],
            1: ["Comprehend Languages", "Detect Secret Doors", "Detect Undead", "Identify"],
            2: ["Detect Thoughts", "Locate Object", "See Invisibility"],
            3: ["Arcane Sight", "Clairaudience/Clairvoyance", "Tongues"],
            4: ["Arcane Eye", "Detect Scrying", "Locate Creature", "Scrying"],
            5: ["Contact Other Plane", "Prying Eyes", "Telepathic Bond"],
            6: ["Analyze Dweomer", "Legend Lore", "True Seeing"],
            7: ["Arcane Sight, Greater", "Scrying, Greater", "Vision"],
            8: ["Discern Location", "Moment of Prescience", "Prying Eyes, Greater"],
            9: ["Foresight", "Time Stop"]
        }
    }
    // ... all 8 schools
}
```

---

## 🏰 **Monster Manual Reference**

### 👹 **Creatures by Challenge Rating**

#### **CR 1/8 to CR 2 (Low-Level Threats)**
```javascript
LOW_LEVEL_MONSTERS = {
    cr_1_8: [
        {
            name: "Rat",
            type: "Animal",
            size: "Tiny", 
            hitDie: "1/4 d8 (1 hp)",
            initiative: "+2",
            speed: "15 ft., climb 15 ft., swim 15 ft.",
            armorClass: "14 (+2 size, +2 Dex)",
            attacks: "Bite +4 melee (1d3-4)",
            specialAttacks: "Disease",
            specialQualities: "Low-light vision, scent",
            saves: "Fort +2, Ref +4, Will +1",
            abilities: "Str 2, Dex 15, Con 11, Int 2, Wis 12, Cha 2",
            skills: "Balance +10, Climb +12, Hide +14, Move Silently +10, Swim +10",
            environment: "Any",
            treasure: "None"
        },
        {
            name: "Kobold",
            type: "Humanoid (reptilian)",
            size: "Small",
            hitDie: "1d8 (4 hp)",
            initiative: "+1", 
            speed: "30 ft.",
            armorClass: "15 (+1 size, +1 Dex, +2 natural, +1 leather armor)",
            attacks: "Spear +1 melee (1d6-1) or sling +3 ranged (1d3-1)",
            specialAttacks: "None",
            specialQualities: "Darkvision 60 ft., light sensitivity",
            saves: "Fort +0, Ref +1, Will -1",
            abilities: "Str 9, Dex 13, Con 10, Int 10, Wis 9, Cha 8",
            skills: "Craft (trapmaking) +2, Hide +6, Listen +2, Move Silently +2, Profession (miner) +2, Search +2, Spot +2",
            environment: "Temperate underground",
            treasure: "Standard"
        }
    ],
    
    cr_1: [
        {
            name: "Orc",
            type: "Humanoid (orc)",
            size: "Medium",
            hitDie: "1d8+1 (5 hp)",
            initiative: "+0",
            speed: "30 ft.",
            armorClass: "13 (+3 studded leather)",
            attacks: "Falchion +4 melee (2d4+4/18-20) or javelin +1 ranged (1d6+3)",
            specialAttacks: "None", 
            specialQualities: "Darkvision 60 ft., light sensitivity",
            saves: "Fort +3, Ref +0, Will -2",
            abilities: "Str 17, Dex 11, Con 12, Int 9, Wis 7, Cha 6",
            skills: "Listen +1, Spot +1", 
            environment: "Temperate hills",
            treasure: "Standard"
        },
        {
            name: "Skeleton",
            type: "Undead",
            size: "Medium",
            hitDie: "1d12 (6 hp)",
            initiative: "+5",
            speed: "30 ft.", 
            armorClass: "13 (+1 Dex, +2 natural)",
            attacks: "Claw +0 melee (1d4) or scimitar +0 melee (1d6)",
            specialAttacks: "None",
            specialQualities: "Damage reduction 5/bludgeoning, darkvision 60 ft., immunity to cold, undead traits",
            saves: "Fort +0, Ref +1, Will +2",
            abilities: "Str 10, Dex 12, Con -, Int -, Wis 10, Cha 11",
            environment: "Any",
            treasure: "None"
        }
    ],
    
    cr_2: [
        {
            name: "Ghoul",
            type: "Undead", 
            size: "Medium",
            hitDie: "2d12 (13 hp)",
            initiative: "+2",
            speed: "30 ft.",
            armorClass: "14 (+2 Dex, +2 natural)",
            attacks: "Bite +3 melee (1d6+1 plus paralysis) and 2 claws +0 melee (1d3 plus paralysis)",
            specialAttacks: "Ghoul fever, paralysis",
            specialQualities: "Darkvision 60 ft., undead traits, +2 turn resistance",
            saves: "Fort +0, Ref +2, Will +5",
            abilities: "Str 13, Dex 15, Con -, Int 13, Wis 14, Cha 12",
            skills: "Balance +6, Climb +5, Hide +6, Intuit Direction +3, Jump +5, Listen +6, Move Silently +6, Search +5, Spot +6",
            environment: "Any",
            treasure: "Standard"
        }
    ]
}
```

#### **CR 3-8 (Mid-Level Challenges)**
```javascript
MID_LEVEL_MONSTERS = {
    cr_3: [
        {
            name: "Owlbear",
            type: "Magical Beast",
            size: "Large", 
            hitDie: "5d10+25 (52 hp)",
            initiative: "+1",
            speed: "30 ft.",
            armorClass: "15 (-1 size, +1 Dex, +5 natural)",
            attacks: "2 claws +9 melee (1d6+5) and bite +4 melee (1d8+2)",
            specialAttacks: "Improved grab",
            specialQualities: "Darkvision 60 ft., low-light vision, scent",
            saves: "Fort +9, Ref +5, Will +2",
            abilities: "Str 21, Dex 12, Con 21, Int 2, Wis 12, Cha 10",
            skills: "Listen +8, Spot +8",
            environment: "Temperate forests",
            treasure: "None"
        }
    ],
    
    cr_5: [
        {
            name: "Troll",
            type: "Giant",
            size: "Large",
            hitDie: "6d8+36 (63 hp)", 
            initiative: "+2",
            speed: "30 ft.",
            armorClass: "16 (-1 size, +2 Dex, +5 natural)",
            attacks: "2 claws +9 melee (1d6+6) and bite +4 melee (1d6+3)",
            specialAttacks: "Rend 2d6+9",
            specialQualities: "Darkvision 90 ft., low-light vision, regeneration 5, scent",
            saves: "Fort +11, Ref +4, Will +3",
            abilities: "Str 23, Dex 14, Con 23, Int 9, Wis 9, Cha 6", 
            skills: "Listen +5, Spot +6",
            environment: "Cold mountains",
            treasure: "Standard"
        }
    ],
    
    cr_8: [
        {
            name: "Hill Giant",
            type: "Giant",
            size: "Large",
            hitDie: "12d8+48 (102 hp)",
            initiative: "-1",
            speed: "30 ft.",
            armorClass: "20 (-1 size, -1 Dex, +9 natural, +3 hide armor)",
            attacks: "Greatclub +16/+11 melee (2d8+10) or slam +15 melee (1d4+7) or rock +8/+3 ranged (2d6+7)",
            specialAttacks: "Rock throwing",
            specialQualities: "Low-light vision, rock catching", 
            saves: "Fort +12, Ref +3, Will +4",
            abilities: "Str 25, Dex 8, Con 19, Int 6, Wis 10, Cha 7",
            skills: "Climb +7, Jump +7, Listen +3, Spot +6",
            environment: "Temperate hills",
            treasure: "Standard"
        }
    ]
}
```

### 🐉 **Dragons by Age Category**

#### **Dragon Progression Table**
```javascript
DRAGON_AGE_CATEGORIES = {
    red_dragon: {
        wyrmling: {cr: 4, size: "Small", hd: "7d12+7", hp: 52, ac: 16, attacks: "Bite +10 (1d6+1), 2 claws +5 (1d4)", breath: "2d10 fire", spells: 0},
        very_young: {cr: 5, size: "Medium", hd: "10d12+20", hp: 85, ac: 18, attacks: "Bite +14 (1d8+3), 2 claws +9 (1d6+1)", breath: "4d10 fire", spells: 0},
        young: {cr: 7, size: "Medium", hd: "13d12+26", hp: 110, ac: 20, attacks: "Bite +17 (1d8+4), 2 claws +12 (1d6+2)", breath: "6d10 fire", spells: 1},
        juvenile: {cr: 10, size: "Large", hd: "16d12+48", hp: 152, ac: 22, attacks: "Bite +22 (2d6+7), 2 claws +17 (1d8+3), 2 wings +17 (1d6+3)", breath: "8d10 fire", spells: 3},
        young_adult: {cr: 13, size: "Large", hd: "19d12+76", hp: 199, ac: 24, attacks: "Bite +26 (2d6+9), 2 claws +21 (1d8+4), 2 wings +21 (1d6+4)", breath: "10d10 fire", spells: 5},
        adult: {cr: 15, size: "Huge", hd: "22d12+110", hp: 253, ac: 26, attacks: "Bite +32 (2d8+12), 2 claws +27 (2d6+6), 2 wings +27 (1d8+6), tail +27 (2d6+18)", breath: "12d10 fire", spells: 7},
        mature_adult: {cr: 18, size: "Huge", hd: "25d12+150", hp: 312, ac: 28, attacks: "Bite +36 (2d8+15), 2 claws +31 (2d6+7), 2 wings +31 (1d8+7), tail +31 (2d6+22)", breath: "14d10 fire", spells: 9},
        old: {cr: 20, size: "Huge", hd: "28d12+196", hp: 378, ac: 30, attacks: "Bite +40 (2d8+17), 2 claws +35 (2d6+8), 2 wings +35 (1d8+8), tail +35 (2d6+25)", breath: "16d10 fire", spells: 11},
        very_old: {cr: 22, size: "Gargantuan", hd: "31d12+248", hp: 449, ac: 32, attacks: "Bite +45 (4d6+19), 2 claws +40 (2d8+9), 2 wings +40 (2d6+9), tail +40 (2d8+28)", breath: "18d10 fire", spells: 13},
        ancient: {cr: 24, size: "Gargantuan", hd: "34d12+306", hp: 527, ac: 34, attacks: "Bite +49 (4d6+22), 2 claws +44 (2d8+11), 2 wings +44 (2d6+11), tail +44 (2d8+33)", breath: "20d10 fire", spells: 15},
        wyrm: {cr: 26, size: "Gargantuan", hd: "37d12+370", hp: 610, ac: 36, attacks: "Bite +54 (4d6+25), 2 claws +49 (2d8+12), 2 wings +49 (2d6+12), tail +49 (2d8+37)", breath: "22d10 fire", spells: 17},
        great_wyrm: {cr: 27, size: "Colossal", hd: "40d12+440", hp: 700, ac: 38, attacks: "Bite +60 (4d8+28), 2 claws +55 (4d6+14), 2 wings +55 (2d8+14), tail +55 (4d6+42)", breath: "24d10 fire", spells: 19}
    }
}
```

---

## ⚔️ **Equipment Database**

### 🗡️ **Weapons Reference**

#### **Simple Weapons**
```javascript
SIMPLE_WEAPONS = {
    light_melee: [
        {name: "Dagger", cost: "2 gp", damage: "1d4", critical: "19-20/×2", range: "10 ft.", weight: "1 lb.", type: "Piercing"},
        {name: "Punching dagger", cost: "2 gp", damage: "1d4", critical: "×3", range: "—", weight: "1 lb.", type: "Piercing"},
        {name: "Spiked gauntlet", cost: "5 gp", damage: "1d4", critical: "×2", range: "—", weight: "1 lb.", type: "Piercing"},
        {name: "Light mace", cost: "5 gp", damage: "1d6", critical: "×2", range: "—", weight: "4 lb.", type: "Bludgeoning"},
        {name: "Sickle", cost: "6 gp", damage: "1d6", critical: "×2", range: "—", weight: "2 lb.", type: "Slashing"}
    ],
    one_handed_melee: [
        {name: "Club", cost: "—", damage: "1d6", critical: "×2", range: "10 ft.", weight: "3 lb.", type: "Bludgeoning"},
        {name: "Heavy mace", cost: "12 gp", damage: "1d8", critical: "×2", range: "—", weight: "8 lb.", type: "Bludgeoning"},
        {name: "Morningstar", cost: "8 gp", damage: "1d8", critical: "×2", range: "—", weight: "6 lb.", type: "Bludgeoning and piercing"},
        {name: "Shortspear", cost: "1 gp", damage: "1d6", critical: "×2", range: "20 ft.", weight: "3 lb.", type: "Piercing"}
    ],
    two_handed_melee: [
        {name: "Longspear", cost: "5 gp", damage: "1d8", critical: "×3", range: "—", weight: "9 lb.", type: "Piercing", special: "Reach"},
        {name: "Quarterstaff", cost: "—", damage: "1d6/1d6", critical: "×2", range: "—", weight: "4 lb.", type: "Bludgeoning", special: "Double weapon"},
        {name: "Spear", cost: "2 gp", damage: "1d8", critical: "×3", range: "20 ft.", weight: "6 lb.", type: "Piercing"}
    ],
    ranged: [
        {name: "Crossbow, heavy", cost: "50 gp", damage: "1d10", critical: "19-20/×2", range: "120 ft.", weight: "8 lb.", type: "Piercing"},
        {name: "Crossbow, light", cost: "35 gp", damage: "1d8", critical: "19-20/×2", range: "80 ft.", weight: "4 lb.", type: "Piercing"},
        {name: "Dart", cost: "5 sp", damage: "1d4", critical: "×2", range: "20 ft.", weight: "1/2 lb.", type: "Piercing"},
        {name: "Javelin", cost: "1 gp", damage: "1d6", critical: "×2", range: "30 ft.", weight: "2 lb.", type: "Piercing"},
        {name: "Sling", cost: "—", damage: "1d4", critical: "×2", range: "50 ft.", weight: "0 lb.", type: "Bludgeoning"}
    ]
}
```

#### **Martial Weapons**
```javascript  
MARTIAL_WEAPONS = {
    light_melee: [
        {name: "Throwing axe", cost: "8 gp", damage: "1d6", critical: "×2", range: "10 ft.", weight: "2 lb.", type: "Slashing"},
        {name: "Light hammer", cost: "1 gp", damage: "1d4", critical: "×2", range: "20 ft.", weight: "2 lb.", type: "Bludgeoning"},
        {name: "Handaxe", cost: "6 gp", damage: "1d6", critical: "×3", range: "—", weight: "3 lb.", type: "Slashing"},
        {name: "Kukri", cost: "8 gp", damage: "1d4", critical: "18-20/×2", range: "—", weight: "1 lb.", type: "Slashing"},
        {name: "Light pick", cost: "4 gp", damage: "1d4", critical: "×4", range: "—", weight: "3 lb.", type: "Piercing"},
        {name: "Sap", cost: "1 gp", damage: "1d6", critical: "×2", range: "—", weight: "2 lb.", type: "Bludgeoning", special: "Nonlethal"},
        {name: "Short sword", cost: "10 gp", damage: "1d6", critical: "19-20/×2", range: "—", weight: "2 lb.", type: "Piercing"}
    ],
    one_handed_melee: [
        {name: "Battleaxe", cost: "10 gp", damage: "1d8", critical: "×3", range: "—", weight: "6 lb.", type: "Slashing"},
        {name: "Flail", cost: "8 gp", damage: "1d8", critical: "×2", range: "—", weight: "5 lb.", type: "Bludgeoning"},
        {name: "Longsword", cost: "15 gp", damage: "1d8", critical: "19-20/×2", range: "—", weight: "4 lb.", type: "Slashing"},
        {name: "Heavy pick", cost: "8 gp", damage: "1d6", critical: "×4", range: "—", weight: "6 lb.", type: "Piercing"},
        {name: "Rapier", cost: "20 gp", damage: "1d6", critical: "18-20/×2", range: "—", weight: "2 lb.", type: "Piercing"},
        {name: "Scimitar", cost: "15 gp", damage: "1d6", critical: "18-20/×2", range: "—", weight: "4 lb.", type: "Slashing"},
        {name: "Trident", cost: "15 gp", damage: "1d8", critical: "×2", range: "10 ft.", weight: "4 lb.", type: "Piercing"},
        {name: "Warhammer", cost: "12 gp", damage: "1d8", critical: "×3", range: "—", weight: "5 lb.", type: "Bludgeoning"}
    ],
    two_handed_melee: [
        {name: "Falchion", cost: "75 gp", damage: "2d4", critical: "18-20/×2", range: "—", weight: "8 lb.", type: "Slashing"},
        {name: "Glaive", cost: "8 gp", damage: "1d10", critical: "×3", range: "—", weight: "10 lb.", type: "Slashing", special: "Reach"},
        {name: "Greataxe", cost: "20 gp", damage: "1d12", critical: "×3", range: "—", weight: "12 lb.", type: "Slashing"},
        {name: "Greatclub", cost: "5 gp", damage: "1d10", critical: "×2", range: "—", weight: "8 lb.", type: "Bludgeoning"},
        {name: "Heavy flail", cost: "15 gp", damage: "1d10", critical: "19-20/×2", range: "—", weight: "10 lb.", type: "Bludgeoning"},
        {name: "Greatsword", cost: "50 gp", damage: "2d6", critical: "19-20/×2", range: "—", weight: "8 lb.", type: "Slashing"},
        {name: "Guisarme", cost: "9 gp", damage: "2d4", critical: "×3", range: "—", weight: "12 lb.", type: "Slashing", special: "Reach, trip"},
        {name: "Halberd", cost: "10 gp", damage: "1d10", critical: "×3", range: "—", weight: "12 lb.", type: "Piercing or slashing", special: "Brace, trip"},
        {name: "Lance", cost: "10 gp", damage: "1d8", critical: "×3", range: "—", weight: "10 lb.", type: "Piercing", special: "Reach"},
        {name: "Ranseur", cost: "10 gp", damage: "2d4", critical: "×3", range: "—", weight: "12 lb.", type: "Piercing", special: "Disarm, reach"},
        {name: "Scythe", cost: "18 gp", damage: "2d4", critical: "×4", range: "—", weight: "10 lb.", type: "Piercing or slashing", special: "Trip"}
    ],
    ranged: [
        {name: "Longbow", cost: "100 gp", damage: "1d8", critical: "×3", range: "100 ft.", weight: "3 lb.", type: "Piercing"},
        {name: "Longbow, composite", cost: "400 gp", damage: "1d8", critical: "×3", range: "110 ft.", weight: "3 lb.", type: "Piercing"},
        {name: "Shortbow", cost: "30 gp", damage: "1d6", critical: "×3", range: "60 ft.", weight: "2 lb.", type: "Piercing"},
        {name: "Shortbow, composite", cost: "150 gp", damage: "1d6", critical: "×3", range: "70 ft.", weight: "2 lb.", type: "Piercing"}
    ]
}
```

### 🛡️ **Armor & Shields**

#### **Armor Table**
```javascript
ARMOR_TABLE = {
    light: [
        {name: "Padded", cost: "5 gp", ac: "+1", maxDex: "+8", checkPenalty: "0", spellFailure: "5%", speed30: "30 ft.", speed20: "20 ft.", weight: "10 lb."},
        {name: "Leather", cost: "10 gp", ac: "+2", maxDex: "+6", checkPenalty: "0", spellFailure: "10%", speed30: "30 ft.", speed20: "20 ft.", weight: "15 lb."},
        {name: "Studded leather", cost: "25 gp", ac: "+3", maxDex: "+5", checkPenalty: "-1", spellFailure: "15%", speed30: "30 ft.", speed20: "20 ft.", weight: "20 lb."},
        {name: "Chain shirt", cost: "100 gp", ac: "+4", maxDex: "+4", checkPenalty: "-2", spellFailure: "20%", speed30: "30 ft.", speed20: "20 ft.", weight: "25 lb."}
    ],
    medium: [
        {name: "Hide", cost: "15 gp", ac: "+3", maxDex: "+4", checkPenalty: "-3", spellFailure: "20%", speed30: "20 ft.", speed20: "15 ft.", weight: "25 lb."},
        {name: "Scale mail", cost: "50 gp", ac: "+4", maxDex: "+3", checkPenalty: "-4", spellFailure: "25%", speed30: "20 ft.", speed20: "15 ft.", weight: "30 lb."},
        {name: "Chainmail", cost: "150 gp", ac: "+5", maxDex: "+2", checkPenalty: "-5", spellFailure: "30%", speed30: "20 ft.", speed20: "15 ft.", weight: "40 lb."},
        {name: "Breastplate", cost: "200 gp", ac: "+5", maxDex: "+3", checkPenalty: "-4", spellFailure: "25%", speed30: "20 ft.", speed20: "15 ft.", weight: "30 lb."}
    ],
    heavy: [
        {name: "Splint mail", cost: "200 gp", ac: "+6", maxDex: "+0", checkPenalty: "-7", spellFailure: "40%", speed30: "20 ft.", speed20: "15 ft.", weight: "45 lb."},
        {name: "Banded mail", cost: "250 gp", ac: "+6", maxDex: "+1", checkPenalty: "-6", spellFailure: "35%", speed30: "20 ft.", speed20: "15 ft.", weight: "35 lb."},
        {name: "Half-plate", cost: "600 gp", ac: "+7", maxDex: "+0", checkPenalty: "-7", spellFailure: "40%", speed30: "20 ft.", speed20: "15 ft.", weight: "50 lb."},
        {name: "Full plate", cost: "1,500 gp", ac: "+8", maxDex: "+1", checkPenalty: "-6", spellFailure: "35%", speed30: "20 ft.", speed20: "15 ft.", weight: "50 lb."}
    ],
    shields: [
        {name: "Buckler", cost: "15 gp", ac: "+1", maxDex: "—", checkPenalty: "-1", spellFailure: "5%", weight: "5 lb."},
        {name: "Shield, light wooden", cost: "3 gp", ac: "+1", maxDex: "—", checkPenalty: "-1", spellFailure: "5%", weight: "5 lb."},
        {name: "Shield, light steel", cost: "9 gp", ac: "+1", maxDex: "—", checkPenalty: "-1", spellFailure: "5%", weight: "6 lb."},
        {name: "Shield, heavy wooden", cost: "7 gp", ac: "+2", maxDex: "—", checkPenalty: "-2", spellFailure: "15%", weight: "10 lb."},
        {name: "Shield, heavy steel", cost: "20 gp", ac: "+2", maxDex: "—", checkPenalty: "-2", spellFailure: "15%", weight: "15 lb."},
        {name: "Shield, tower", cost: "30 gp", ac: "+4", maxDex: "+2", checkPenalty: "-10", spellFailure: "50%", weight: "45 lb.", special: "Provides cover"}
    ]
}
```

---

## 💰 **Economic Data**

### 💎 **Treasure Values by Level**

#### **Treasure Budget Guidelines**
```javascript
TREASURE_BY_LEVEL = {
    // Individual treasure (per character)
    individual: {
        1: {total: 900, coins: 50, goods: 350, items: 500},
        2: {total: 2700, coins: 150, goods: 1050, items: 1500},
        3: {total: 5400, coins: 300, goods: 2100, items: 3000},
        4: {total: 9000, coins: 500, goods: 3500, items: 5000},
        5: {total: 13500, coins: 750, goods: 5250, items: 7500},
        6: {total: 19000, coins: 1000, goods: 7400, items: 10600},
        7: {total: 27000, coins: 1500, goods: 10500, items: 15000},
        8: {total: 36000, coins: 2000, goods: 14000, items: 20000},
        9: {total: 49000, coins: 2750, goods: 19050, items: 27200},
        10: {total: 66000, coins: 3750, goods: 25650, items: 36600},
        11: {total: 88000, coins: 5000, goods: 34200, items: 48800},
        12: {total: 110000, coins: 6250, goods: 42750, items: 61000},
        13: {total: 150000, coins: 8500, goods: 58350, items: 83150},
        14: {total: 200000, coins: 11250, goods: 77750, items: 111000},
        15: {total: 260000, coins: 14500, goods: 101100, items: 144400},
        16: {total: 340000, coins: 19000, goods: 132200, items: 188800},
        17: {total: 440000, coins: 24500, goods: 171150, items: 244350},
        18: {total: 580000, coins: 32500, goods: 225750, items: 321750},
        19: {total: 760000, coins: 42500, goods: 295700, items: 421800},
        20: {total: 1000000, coins: 55000, goods: 389000, items: 556000}
    }
}
```

#### **Coin Distribution Tables**
```javascript
COIN_GENERATION = {
    copper: {
        small: "3d6 × 10",      // 30-180 cp (avg 105)
        medium: "5d6 × 10",     // 50-300 cp (avg 175) 
        large: "8d6 × 10"       // 80-480 cp (avg 280)
    },
    silver: {
        small: "2d6 × 10",      // 20-120 sp (avg 70)
        medium: "4d6 × 10",     // 40-240 sp (avg 140)
        large: "6d6 × 10"       // 60-360 sp (avg 210)
    },
    gold: {
        small: "1d6 × 10",      // 10-60 gp (avg 35)
        medium: "3d6 × 10",     // 30-180 gp (avg 105)
        large: "5d6 × 10"       // 50-300 gp (avg 175)
    },
    platinum: {
        small: "1d4",           // 1-4 pp (avg 2.5)
        medium: "1d6",          // 1-6 pp (avg 3.5) 
        large: "1d8"            // 1-8 pp (avg 4.5)
    }
}
```

---

## 🏺 **Art Objects & Gems**

### 💎 **Gemstone Values**
```javascript
GEMSTONE_VALUES = {
    ornamental_stones: { // 10 gp average
        values: [10, 50, 100, 500],
        stones: [
            "Azurite", "Banded agate", "Blue quartz", "Eye agate",
            "Hematite", "Lapis lazuli", "Malachite", "Moss agate",
            "Obsidian", "Rhodochrosite", "Tiger eye turquoise", "Freshwater pearl"
        ]
    },
    
    semi_precious: { // 50 gp average
        values: [50, 100, 500, 1000], 
        stones: [
            "Bloodstone", "Carnelian", "Chalcedony", "Chrysoprase",
            "Citrine", "Iolite", "Jasper", "Moonstone", "Onyx",
            "Peridot", "Rock crystal", "Sardonyx", "Rose quartz", "Smoky quartz", "Zircon"
        ]
    },
    
    fancy: { // 100 gp average
        values: [100, 500, 1000, 5000],
        stones: [
            "Amber", "Amethyst", "Chrysoberyl", "Coral", "Red garnet",
            "Brown-green garnet", "Jade", "Jet", "White pearl", "Golden pearl",
            "Pink pearl", "Silver pearl", "Red spinel", "Tourmaline"
        ]
    },
    
    precious: { // 500 gp average
        values: [500, 1000, 5000, 10000],
        stones: [
            "Aquamarine", "Violet garnet", "Black pearl", "Deep blue spinel",
            "Golden yellow topaz"
        ]
    },
    
    gem_stones: { // 1000 gp average  
        values: [1000, 2500, 5000, 10000],
        stones: [
            "Emerald", "White opal", "Black opal", "Fire opal", "Blue sapphire",
            "Black sapphire", "Star ruby", "Star sapphire", "Yellow sapphire"
        ]
    },
    
    jewels: { // 5000 gp average
        values: [2500, 5000, 10000, 25000],
        stones: [
            "Clearest bright green emerald", "Blue-white diamond",
            "Canary diamond", "Pink diamond", "Brown diamond",
            "Blue diamond", "Jacinth"
        ]
    }
}
```

### 🏺 **Art Objects**
```javascript
ART_OBJECTS = {
    tier_1: { // 10-60 gp
        items: [
            "Silver ewer", "Carved bone statuette", "Small gold bracelet",
            "Cloth-of-gold vestments", "Black velvet mask with pearls",
            "Copper chalice with silver inlay"
        ]
    },
    
    tier_2: { // 90-250 gp  
        items: [
            "Carved ivory statuette", "Gold ring with bloodstones",
            "Carved jade bracelet", "Silver necklace with gemstone pendant",
            "Bronze crown", "Silk robe with gold embroidery"
        ]
    },
    
    tier_3: { // 350-750 gp
        items: [
            "Silver chalice with moonstones", "Silver-plated steel longsword",
            "Carved harp of exotic wood with ivory inlay", "Small gold idol",
            "Gold dragon comb with red garnet eye", "Bottle stopper cork of gold and silver"
        ]
    },
    
    tier_4: { // 1000-2500 gp
        items: [
            "Golden yellow topaz pendant", "Ruby and gold ring",
            "Gold and silver hand mirror", "Fire opal pendant on gold chain",
            "Masterwork golden flute", "Ivory drinking horn with gold filigree"
        ]
    }
}
```

---

<div align="center">

### 📚 **Complete D&D 3.5 Reference Library**

**[Documentation Hub](../README.md)** | **[Character Creator](../../new-character-creator.html)** | **[D&D Rules](../game-rules/dnd-35-srd-rules.md)**

---

*Everything you need for legendary D&D 3.5 adventures!*

</div>
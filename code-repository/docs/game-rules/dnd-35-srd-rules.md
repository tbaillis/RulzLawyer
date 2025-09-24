# ⚔️ D&D 3.5 SRD Rules Reference

![D&D Rules](https://img.shields.io/badge/D%26D%203.5-SRD%20Rules%20Reference-8B0000?style=for-the-badge&logo=d3&logoColor=FFD700)

> **Complete System Reference Document for D&D 3.5 Edition**  
> Authoritative rules reference for players, DMs, and character creation systems.

---

## 🎲 **Core Mechanics**

### 🎯 **The d20 System**

#### **Basic Resolution**
```
d20 + Modifiers vs. Target Number

Examples:
- Attack Roll: d20 + BAB + Str/Dex + misc vs. AC
- Skill Check: d20 + Skill Ranks + Ability + misc vs. DC  
- Saving Throw: d20 + Base Save + Ability + misc vs. DC
- Ability Check: d20 + Ability Modifier vs. DC
```

#### **Difficulty Classes (DCs)**
| DC | Difficulty | Examples |
|----|------------|----------|
| **5** | Very Easy | Notice something large in plain sight |
| **10** | Easy | Hear an approaching guard |
| **15** | Moderate | Rig a wagon wheel to fall off |
| **20** | Hard | Swim in stormy water |
| **25** | Very Hard | Open an average lock without tools |
| **30** | Nearly Impossible | Track a squad across hard ground after rain |

### 🎲 **Dice & Probability**

#### **Common Die Types**
```
d4  - 1 to 4 (Dagger damage, some spells)
d6  - 1 to 6 (Shortsword, Fireball damage)  
d8  - 1 to 8 (Longsword, Cleric Hit Die)
d10 - 1 to 10 (Heavy crossbow, Fighter Hit Die)
d12 - 1 to 12 (Greataxe, Barbarian Hit Die)
d20 - 1 to 20 (All rolls, the core die)
d100 - 1 to 100 (Percentile rolls)
```

#### **Multiple Dice Notation**
- **3d6**: Roll 3 six-sided dice, add results (3-18)
- **2d4+2**: Roll 2 four-sided dice, add 2 (4-10)  
- **1d8+5**: Roll 1 eight-sided dice, add 5 (6-13)
- **4d6dl1**: Roll 4d6, drop lowest die (used for ability scores)

---

## 👤 **Character Creation**

### 📊 **Ability Scores**

#### **The Six Abilities**
| Ability | Abbreviation | Affects |
|---------|--------------|---------|
| **Strength** | Str | Melee attacks, damage, carrying capacity |
| **Dexterity** | Dex | Ranged attacks, AC, Reflex saves, some skills |
| **Constitution** | Con | Hit points, Fortitude saves, stamina |
| **Intelligence** | Int | Skill points, Wizard spells, some skills |
| **Wisdom** | Wis | Will saves, Cleric/Druid spells, awareness |
| **Charisma** | Cha | Sorcerer/Bard spells, social interactions |

#### **Ability Modifiers**
```
Modifier = (Ability Score - 10) / 2 (round down)

Ability Score → Modifier
1           → -5
2-3         → -4  
4-5         → -3
6-7         → -2
8-9         → -1
10-11       → +0
12-13       → +1
14-15       → +2
16-17       → +3
18-19       → +4
20-21       → +5
```

#### **Generation Methods**
1. **4d6 Drop Lowest**: Roll 4d6, drop lowest die (heroic)
2. **Point Buy**: 25 or 27 points to buy abilities (balanced)
3. **Standard Array**: 15, 14, 13, 12, 10, 8 (quick)
4. **3d6 Straight**: Roll 3d6 six times (gritty)

### 🧝 **Races**

#### **Core Races**
| Race | Size | Speed | Ability Mods | Special |
|------|------|-------|--------------|---------|
| **Human** | Medium | 30 ft | None | Extra feat, +4 skill points |
| **Elf** | Medium | 30 ft | +2 Dex, -2 Con | Low-light vision, weapon training |
| **Dwarf** | Medium | 20 ft | +2 Con, -2 Cha | Darkvision, stability, stonecunning |
| **Halfling** | Small | 20 ft | +2 Dex, -2 Str | +1 size bonus to AC and attacks |
| **Gnome** | Small | 20 ft | +2 Con, -2 Str | Darkvision, gnome magic |
| **Half-Elf** | Medium | 30 ft | None | Low-light vision, versatility |
| **Half-Orc** | Medium | 30 ft | +2 Str, -2 Int, -2 Cha | Darkvision, orc blood |

#### **Racial Features Detail**

**Human Versatility:**
- Extra feat at 1st level
- +4 skill points at 1st level  
- +1 skill point each additional level
- Favored class: Any (no multiclass penalty)

**Elf Abilities:**
- Low-light vision (see twice as far in dim light)
- Weapon Proficiency: longsword, rapier, longbow, shortbow
- +2 racial bonus: Listen, Search, Spot checks
- Immunity to magical sleep, +2 vs. enchantments

**Dwarf Resilience:**
- Darkvision 60 feet
- +4 dodge bonus vs. giants  
- +2 racial bonus vs. poison, spells, spell-like abilities
- +1 racial bonus on attacks vs. orcs and goblinoids
- Stonecunning: +2 to find unusual stonework

### ⚔️ **Classes**

#### **Base Attack Bonus Progression**
```
GOOD BAB (Fighters, Paladins, Rangers, Barbarians)
Level:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
BAB:   +1 +2 +3 +4 +5 +6 +7 +8 +9+10+11+12+13+14+15+16+17+18+19+20

AVERAGE BAB (Clerics, Druids, Monks, Rogues, Bards)  
Level:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
BAB:   +0 +1 +2 +3 +3 +4 +5 +6 +6 +7 +8 +9 +9+10+11+12+12+13+14+15

POOR BAB (Wizards, Sorcerers)
Level:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20  
BAB:   +0 +0 +1 +2 +2 +3 +3 +4 +4 +5 +5 +6 +6 +7 +7 +8 +8 +9 +9+10
```

#### **Saving Throw Progression**
```
GOOD SAVES (+2 base, +1/2 levels)
Level:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
Save:  +2 +3 +3 +4 +4 +5 +5 +6 +6 +7 +7 +8 +8 +9 +9+10+10+11+11+12

POOR SAVES (+0 base, +1/3 levels)  
Level:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
Save:  +0 +0 +1 +1 +1 +2 +2 +2 +3 +3 +3 +4 +4 +4 +5 +5 +5 +6 +6 +6
```

#### **Class Save Bonuses**
| Class | Fortitude | Reflex | Will |
|-------|-----------|--------|------|
| **Barbarian** | Good | Poor | Poor |
| **Bard** | Poor | Good | Good |  
| **Cleric** | Good | Poor | Good |
| **Druid** | Good | Poor | Good |
| **Fighter** | Good | Poor | Poor |
| **Monk** | Good | Good | Good |
| **Paladin** | Good | Poor | Poor |
| **Ranger** | Good | Good | Poor |
| **Rogue** | Poor | Good | Poor |
| **Sorcerer** | Poor | Poor | Good |
| **Wizard** | Poor | Poor | Good |

---

## ⚔️ **Combat System**

### 🎯 **Combat Sequence**

#### **Initiative & Actions**
```
1. INITIATIVE PHASE
   - Roll d20 + Dex modifier + misc
   - Act in order from highest to lowest
   
2. ACTION PHASE  
   Each character's turn:
   - Move action (up to speed)
   - Standard action (attack, cast spell, etc.)
   - Free actions (speak, drop item, etc.)
   - Swift/Immediate actions (if available)
```

#### **Action Types**
| Action | Examples | Notes |
|--------|----------|-------|
| **Standard** | Attack, cast spell, charge | Main combat action |
| **Move** | Move up to speed, draw weapon | Can be converted to standard |
| **Full-Round** | Full attack, run, coup de grace | Uses entire turn |
| **Free** | Speak, drop item, cease concentration | Any number per turn |
| **Swift** | Quickened spell, some feats | One per turn |
| **Immediate** | Interrupt action, counterspell | Even on others' turns |

### 🗡️ **Attack & Damage**

#### **Attack Roll Resolution**
```
Attack Roll = d20 + BAB + Ability Modifier + Size + Misc

Hit if Attack Roll ≥ Target's Armor Class

Ability Modifiers:
- Melee attacks: Strength modifier
- Ranged attacks: Dexterity modifier  
- Finesse weapons: Dex instead of Str (if higher)
```

#### **Damage Calculation**
```
Damage = Weapon Damage + Ability Modifier + Magic + Misc

Ability Modifiers:
- Melee: Strength modifier (1.5× for two-handed weapons)  
- Ranged: Usually none (except composite bows)
- Off-hand: 1/2 Strength modifier (minimum 0)
```

#### **Critical Hits**
```
CRITICAL THREAT
1. Roll natural 20 (or weapon's threat range)
2. Roll confirmation: d20 + attack bonus vs. AC
3. If hits, multiply damage by weapon's multiplier

Common Threat Ranges:
- Most weapons: 20 (5% chance)
- Longsword, Battleaxe: 19-20 (10% chance)  
- Rapier, Scimitar: 18-20 (15% chance)
- Falchion: 18-20/×2, Scythe: 20/×4
```

### 🛡️ **Armor Class (AC)**

#### **AC Calculation**
```
AC = 10 + Armor Bonus + Shield Bonus + Dex Modifier + Size + Misc

AC Types:
- Touch AC: 10 + Dex + Size + Misc (ignores armor/shield)
- Flat-Footed AC: Normal AC - Dex bonus (no Dex to AC)
```

#### **Size Modifiers**
| Size | AC Bonus | Attack Bonus | Hide Modifier |
|------|----------|--------------|---------------|
| **Fine** | +8 | +8 | +16 |
| **Diminutive** | +4 | +4 | +12 |
| **Tiny** | +2 | +2 | +8 |
| **Small** | +1 | +1 | +4 |
| **Medium** | +0 | +0 | +0 |
| **Large** | -1 | -1 | -4 |
| **Huge** | -2 | -2 | -8 |

### 💖 **Hit Points & Healing**

#### **Hit Point Calculation**
```
Hit Points = Class Hit Die + Constitution Modifier (per level)

1st Level: Maximum hit die + Con modifier
Additional Levels: Roll hit die + Con modifier (minimum 1)

Example - 5th Level Fighter (Con 14):
1st: 10 (max d10) + 2 (Con) = 12
2nd: 7 (rolled) + 2 = 9, Total = 21  
3rd: 4 (rolled) + 2 = 6, Total = 27
4th: 8 (rolled) + 2 = 10, Total = 37
5th: 6 (rolled) + 2 = 8, Total = 45
```

#### **Damage & Death**
```
DAMAGE STATES
- Normal: 1+ hit points, no penalties
- Disabled: 0 hit points, staggered condition
- Dying: -1 to -9 hit points, unconscious
- Dead: -10 hit points or below

STABILIZATION  
When dying, roll d20 each round:
- Natural 20: Become stable at current HP
- 1-19: Lose 1 hit point
- Stabilize at -10 or Constitution check DC 10
```

#### **Healing Methods**
| Method | Amount | Time | Notes |
|--------|--------|------|-------|
| **Natural** | 1 hp/day | 24 hours rest | 2 hp/day with complete bed rest |
| **Cure Light** | 1d8+1 | Standard action | Magical healing |
| **Heal Skill** | 1 hp | 1 hour | DC 15, once per day per healer |
| **Fast Healing** | X hp/round | Continuous | From special abilities |

---

## 🎯 **Skills System**

### 📚 **Skill Mechanics**

#### **Skill Check Resolution**
```
Skill Check = d20 + Skill Ranks + Ability Modifier + Misc

DC Examples:
- DC 10: Routine task under normal conditions
- DC 15: Typical challenging task  
- DC 20: Difficult task requiring focus
- DC 25: Very difficult task for experts
- DC 30: Nearly impossible task
```

#### **Skill Points & Ranks**
```
Skill Points per Level = Class Base + Intelligence Modifier

Maximum Ranks = Character Level + 3 (class skills)
Maximum Ranks = (Character Level + 3) / 2 (cross-class skills)

Class Skills cost 1 point per rank
Cross-Class Skills cost 2 points per rank
```

#### **Skill Synergies**
Having 5+ ranks in certain skills provides +2 synergy bonus:
- **Jump** benefits from Tumble
- **Spellcraft** benefits from Knowledge (Arcana)  
- **Use Rope** benefits from Escape Artist
- **Survival** benefits from Knowledge (Nature)

### 🎭 **Key Skills by Category**

#### **Physical Skills** (Strength/Dexterity-based)
| Skill | Ability | Untrained? | Common Uses |
|-------|---------|------------|-------------|
| **Balance** | Dex | Yes | Walk on narrow surfaces |
| **Climb** | Str | Yes | Scale walls and cliffs |
| **Escape Artist** | Dex | Yes | Slip bonds, squeeze through gaps |
| **Jump** | Str | Yes | Leap across chasms |
| **Swim** | Str | Yes | Move through water |
| **Tumble** | Dex | No | Avoid attacks of opportunity |

#### **Mental Skills** (Intelligence/Wisdom-based)  
| Skill | Ability | Untrained? | Common Uses |
|-------|---------|------------|-------------|
| **Appraise** | Int | Yes | Estimate item values |
| **Craft** | Int | Yes | Create items |
| **Knowledge** | Int | No | Recall information |
| **Search** | Int | Yes | Find hidden objects |
| **Spellcraft** | Int | No | Identify spells and magic |
| **Survival** | Wis | Yes | Track, navigate wilderness |

#### **Social Skills** (Charisma-based)
| Skill | Ability | Untrained? | Common Uses |
|-------|---------|------------|-------------|
| **Bluff** | Cha | Yes | Deceive others |
| **Diplomacy** | Cha | Yes | Negotiate, improve attitudes |
| **Gather Information** | Cha | Yes | Learn rumors and news |
| **Intimidate** | Cha | Yes | Frighten or coerce |
| **Perform** | Cha | Yes | Entertain audiences |

---

## 🎖️ **Feats System**

### 🏆 **Feat Categories**

#### **Combat Feats**
```
🗡️ WEAPON FEATS
   Weapon Focus: +1 attack with chosen weapon
   Weapon Specialization: +2 damage (Fighter only)  
   Improved Critical: Double threat range
   
⚔️ FIGHTING STYLE FEATS
   Two-Weapon Fighting: Reduce penalties for dual wielding
   Power Attack: Trade attack bonus for damage
   Combat Expertise: Trade attack bonus for AC
   
🏹 RANGED FEATS  
   Point Blank Shot: +1 attack/damage within 30 ft
   Precise Shot: No penalty for shooting into melee
   Far Shot: Increase range increments by 50%
```

#### **Spellcasting Feats**
```
🔮 METAMAGIC FEATS (Modify spell effects)
   Empower Spell: +50% variable effects (+2 levels)
   Maximize Spell: Maximum variable effects (+3 levels)  
   Quicken Spell: Cast as swift action (+4 levels)
   Silent Spell: No verbal components (+1 level)
   
📚 SPELL FEATS
   Spell Focus: +1 DC for spell school
   Greater Spell Focus: Additional +1 DC  
   Spell Penetration: +2 to overcome spell resistance
```

#### **General Feats**
```
💪 PHYSICAL FEATS
   Toughness: +3 hit points
   Great Fortitude: +2 Fortitude saves
   Lightning Reflexes: +2 Reflex saves
   Iron Will: +2 Will saves
   
🎯 SKILL FEATS
   Skill Focus: +3 bonus to chosen skill
   Alertness: +2 Listen and Spot
   Athletic: +2 Climb and Jump
```

### 📋 **Feat Prerequisites**

#### **Common Prerequisites**
- **Base Attack Bonus**: Many combat feats require minimum BAB
- **Ability Scores**: Some feats need minimum ability scores  
- **Other Feats**: Chain feats that build on each other
- **Class Features**: Fighter-only feats, spellcaster feats
- **Skills**: Minimum ranks in specific skills

#### **Feat Chains Examples**
```
POWER ATTACK CHAIN
   Power Attack → Cleave → Great Cleave
   Requirements: Str 13, BAB +1, BAB +4
   
TWO-WEAPON FIGHTING CHAIN  
   Two-Weapon Fighting → Improved TWF → Greater TWF
   Requirements: Dex 15, Dex 17, BAB +11
   
WEAPON SPECIALIZATION CHAIN
   Weapon Focus → Weapon Specialization → Greater Weapon Focus
   Requirements: Fighter 1st, Fighter 4th, Fighter 8th
```

---

## 🔮 **Magic System**

### 📖 **Spell Mechanics**

#### **Spell Completion Process**
```
1. DECLARE SPELL: Choose spell and target
2. CHECK COMPONENTS: Verify V, S, M, F requirements  
3. MAKE CONCENTRATION: If threatened or distracted
4. RESOLVE EFFECTS: Apply spell results
5. EXPEND SLOT: Remove from daily allotment
```

#### **Spell Components**
| Component | Symbol | Requirement |
|-----------|--------|-------------|
| **Verbal** | V | Speak clearly (not silenced) |
| **Somatic** | S | Free hand for gestures |
| **Material** | M | Physical components (consumed) |
| **Focus** | F | Reusable magical item |
| **Divine Focus** | DF | Holy/unholy symbol |

#### **Concentration Checks**
```
Concentration DC = 10 + Damage Taken + Spell Level

Common Situations:
- Cast defensively: DC 15 + spell level
- Injured while casting: DC 10 + damage + spell level  
- Vigorous motion: DC 10 + spell level
- Violent motion: DC 15 + spell level
- Weather: DC 5-20 + spell level
```

### 🎚️ **Caster Level & Spell DCs**

#### **Caster Level**
```
Caster Level = Class Level (for that class)

Effects:
- Spell duration, damage, range  
- Spell resistance checks
- Dispel magic attempts
- Maximum spell level available
```

#### **Spell Save DCs**
```
Save DC = 10 + Spell Level + Relevant Ability Modifier

Examples:
- Wizard Fireball (3rd): 10 + 3 + Int modifier
- Cleric Hold Person (2nd): 10 + 2 + Wis modifier
- Sorcerer Charm Person (1st): 10 + 1 + Cha modifier
```

### 🏫 **Spell Schools**

#### **Schools & Opposition**
| School | Focus | Cannot Learn |
|--------|-------|--------------|
| **Abjuration** | Protection, dispelling | 2 chosen schools |
| **Conjuration** | Summoning, creation | 2 chosen schools |
| **Divination** | Information, detection | None (Universalist) |
| **Enchantment** | Mind effects | 2 chosen schools |
| **Evocation** | Energy, force | 2 chosen schools |
| **Illusion** | Deception, images | 2 chosen schools |
| **Necromancy** | Death, undead, negative | 2 chosen schools |
| **Transmutation** | Change, enhancement | 2 chosen schools |

---

## 🏰 **Advanced Rules**

### ⚡ **Multiclassing**

#### **Experience Point Penalties**
```  
XP PENALTY CALCULATION
1. Determine highest level class
2. Count other classes within 1 level (no penalty)  
3. Each class 2+ levels behind: -20% XP

Example Character (Human Fighter 4/Rogue 2):
- Highest class: Fighter (4th)
- Rogue is 2 levels behind (4-2=2)  
- Penalty: -20% XP for being Human (favored class any)
- Final: No penalty (Human versatility)
```

#### **Class Feature Stacking**
- **Base Attack Bonus**: Add all class BAB together
- **Saving Throws**: Add all class save bonuses
- **Hit Points**: Add hit dice from all classes
- **Skill Points**: Get points from current class only
- **Spellcasting**: Generally don't stack (except Mystic Theurge)

### 🎭 **Prestige Classes**

#### **Popular Prestige Classes**  
| Class | Requirements | Benefits |
|-------|-------------|----------|
| **Arcane Archer** | Elf, Point Blank Shot, Weapon Focus (bow) | Enchant arrows, special shots |
| **Assassin** | Evil alignment, Death Attack ability | Poison, death attack progression |  
| **Blackguard** | Evil alignment, smite good ability | Fallen paladin abilities |
| **Mystic Theurge** | 2nd level arcane & divine spells | Progress both spell progressions |

### 🌟 **Epic Level Rules** *(Levels 21+)*

#### **Epic Progression**  
- **Hit Points**: Continue gaining based on class hit die
- **Base Attack Bonus**: Continue class progression  
- **Saving Throws**: Continue class progression
- **Skill Points**: Continue gaining based on class + Int
- **Epic Feats**: Special feats available every 3 levels (21, 24, 27, etc.)

#### **Epic Feat Examples**
- **Epic Weapon Focus**: Additional +2 to attack rolls (+3 total)
- **Epic Spell Focus**: Additional +2 to spell save DCs (+4 total)  
- **Great Charisma/Strength/etc**: +1 to ability score (no limit)
- **Perfect Health**: Immune to disease, poison, stunning, etc.

---

## 📊 **Quick Reference Tables**

### 🎲 **Common DCs**
| Task Difficulty | DC | Examples |
|----------------|----|-----------| 
| **Very Easy** | 5 | Spot something obvious |
| **Easy** | 10 | Climb a knotted rope |
| **Moderate** | 15 | Track humanoids on soft ground |
| **Hard** | 20 | Disarm a well-made trap |
| **Very Hard** | 25 | Swim up a waterfall |
| **Nearly Impossible** | 30 | Balance on a sword edge |

### ⚔️ **Weapon Properties**
| Size | Damage Examples | Critical |
|------|----------------|----------|
| **Light** | Dagger (1d4), Shortsword (1d6) | 19-20/×2, 19-20/×2 |
| **One-Handed** | Longsword (1d8), Battleaxe (1d8) | 19-20/×2, ×3 |
| **Two-Handed** | Greatsword (2d6), Greataxe (1d12) | 19-20/×2, ×3 |
| **Ranged** | Shortbow (1d6), Crossbow (1d8) | ×3, 19-20/×2 |

### 🛡️ **Armor Types**
| Armor Type | AC Bonus | Max Dex | Check Penalty | Speed (30ft/20ft) |
|------------|----------|---------|---------------|-------------------|
| **Padded** | +1 | +8 | 0 | 30ft/20ft |
| **Leather** | +2 | +6 | 0 | 30ft/20ft |
| **Chain Shirt** | +4 | +4 | -2 | 30ft/20ft |
| **Scale Mail** | +4 | +3 | -4 | 20ft/15ft |
| **Chain Mail** | +5 | +2 | -5 | 20ft/15ft |
| **Plate Mail** | +8 | +1 | -6 | 20ft/15ft |

---

<div align="center">

### ⚔️ **Master the Rules, Master the Game**

**[Character Creator](../../new-character-creator.html)** | **[Spell Database](../data-references/spell-database.md)** | **[Player Guides](../player-guides/)**

---

*The complete D&D 3.5 rules reference for legendary adventures!*

</div>
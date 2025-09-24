# Combat System Requirements - Rackem19 Enhanced

## Document Information
- **Document ID**: REQ-COMBAT-001
- **Title**: Advanced Combat System with Complete D&D 3.5 Tactical Support
- **Version**: 1.0
- **Created**: September 23, 2025
- **Status**: Enhanced with Rackem19 Analysis
- **Owner**: AI Development Team

## Executive Summary

This document defines the comprehensive combat system requirements for RulzLawyer, enhanced with insights from the Rackem19.xlsm analysis. The system must provide complete tactical support with sophisticated calculation engines matching the Excel system's complexity.

## Rackem19 Combat System Analysis Integration

Based on the Rackem19 system's sophisticated combat implementation, our system requires:

### Complete Tactical Support
- **Multi-class Base Attack Bonus** progression with fractional advancement
- **Comprehensive Armor Class** calculation with all 8+ component types
- **Advanced Saving Throws** with all modifiers and conditional bonuses
- **Complex Attack Calculations** including size, enhancement, and situational modifiers
- **Grapple System** with size category and special ability interactions

## Functional Requirements

### FR-COMBAT-001: Base Attack Bonus Engine (Priority: CRITICAL)

#### FR-COMBAT-001.1: Multi-Class BAB Progression
- **Description**: Accurate BAB calculation supporting complex multi-classing scenarios
- **Details**:
  - **Full BAB Classes**: Fighter, Paladin, Ranger, Barbarian (+1 per level)
  - **3/4 BAB Classes**: Cleric, Druid, Monk, Rogue (+3 per 4 levels)
  - **1/2 BAB Classes**: Wizard, Sorcerer, Bard (+1 per 2 levels)
  - **Fractional BAB Rules**: Proper multi-class advancement without rounding errors
  - **Epic Progression**: Continued +1 per level advancement past 20th level
- **Acceptance Criteria**:
  - BAB calculation matches Rackem19 precision for all class combinations
  - Multiple attack bonuses calculated correctly (+15/+10/+5 format)
  - Epic level BAB progression supported through level 60+

#### FR-COMBAT-001.2: Attack Bonus Calculations
- **Description**: Complete attack bonus system with all D&D 3.5 modifiers
- **Details**:
  - **Melee Attacks**: BAB + Strength modifier + enhancement + misc modifiers
  - **Ranged Attacks**: BAB + Dexterity modifier + enhancement + misc modifiers
  - **Size Modifiers**: Automatic calculation based on character size category
  - **Two-Weapon Fighting**: Proper penalty application and feat interactions
  - **Enhancement Bonuses**: Magical weapon improvements and temporary effects
- **Acceptance Criteria**:
  - Attack bonuses update automatically when stats or equipment change
  - All D&D 3.5 attack modifiers properly implemented and stacked
  - Combat calculations match official D&D 3.5 rules exactly

### FR-COMBAT-002: Armor Class System (Priority: CRITICAL)

#### FR-COMBAT-002.1: Complete AC Component Breakdown
- **Description**: Sophisticated AC calculation matching Rackem19's comprehensive system
- **Details**:
  ```
  AC = 10 + Armor Bonus + Shield Bonus + Dex Modifier + Size Modifier + 
       Natural Armor + Deflection Bonus + Dodge Bonus + Other Modifiers
  ```
  - **Armor Bonus**: Equipment-based AC improvements with enhancement bonuses
  - **Shield Bonus**: Buckler vs light/heavy/tower shield differentiation
  - **Dexterity Limitation**: Max Dex bonus enforcement from armor restrictions
  - **Size Modifiers**: +4 (Fine) to -8 (Colossal) size category bonuses
  - **Natural Armor**: Racial and template-based natural armor bonuses
  - **Deflection Bonuses**: Ring of protection and spell-based AC improvements
  - **Dodge Bonuses**: Feat and class-based AC improvements that stack
- **Acceptance Criteria**:
  - All AC components calculated and displayed separately
  - Enhancement bonuses and penalties properly applied
  - Touch AC and Flat-Footed AC calculated automatically
  - AC updates instantly when equipment or stats change

#### FR-COMBAT-002.2: Conditional AC Modifiers
- **Description**: Advanced AC system supporting situational and conditional modifiers
- **Details**:
  - **Combat Expertise**: AC bonus from defensive fighting
  - **Fighting Defensively**: +2 AC bonus with -4 attack penalty
  - **Total Defense**: +4 AC bonus when taking full-round defensive action
  - **Cover and Concealment**: AC bonuses from tactical positioning
  - **Class Features**: Monk AC bonus, Barbarian AC penalty during rage
- **Acceptance Criteria**:
  - Conditional modifiers can be toggled on/off during combat
  - AC calculations update in real-time with active conditions
  - Visual indicators show which modifiers are currently active

### FR-COMBAT-003: Saving Throws Engine (Priority: CRITICAL)

#### FR-COMBAT-003.1: Complete Save System Implementation
- **Description**: Comprehensive saving throw system with all D&D 3.5 modifiers
- **Details**:
  - **Fortitude Saves**: Base save + Constitution modifier + equipment + feats + class features
  - **Reflex Saves**: Base save + Dexterity modifier + equipment + feats + class features
  - **Will Saves**: Base save + Wisdom modifier + equipment + feats + class features
  - **Good vs Poor Progression**: Proper base save advancement by class
  - **Multi-Class Save Stacking**: Highest base save + secondary class bonuses
- **Acceptance Criteria**:
  - Save bonuses calculated accurately for all sources
  - Epic level save progression (+1/2 per level past 20th) implemented
  - All feat bonuses (Great Fortitude, Lightning Reflexes, Iron Will) applied

#### FR-COMBAT-003.2: Advanced Save Modifiers
- **Description**: Complex save modifier system matching Rackem19's sophistication
- **Details**:
  - **Racial Bonuses**: Halfling luck, dwarf poison resistance, elf enchantment resistance
  - **Class Features**: Paladin divine grace, monk evasion, bard countersong
  - **Equipment Bonuses**: Cloak of resistance, periapt of wisdom, etc.
  - **Conditional Modifiers**: Fear effects, charm resistance, situational bonuses
  - **Template Effects**: Undead immunity, construct immunities, fiend resistances
- **Acceptance Criteria**:
  - All PHB and supplement racial save bonuses implemented
  - Class feature save bonuses applied at appropriate levels
  - Equipment bonuses stack according to D&D 3.5 rules

### FR-COMBAT-004: Grapple System (Priority: HIGH)

#### FR-COMBAT-004.1: Complete Grappling Mechanics
- **Description**: Advanced grapple system with size category interactions
- **Details**:
  - **Grapple Check**: BAB + Strength modifier + size modifier + misc modifiers
  - **Size Modifiers**: +4 bonus per size category larger than opponent
  - **Special Abilities**: Improved Grab, Constrict, Rake attacks
  - **Grappling Conditions**: Grappled, pinned, helpless condition effects
- **Acceptance Criteria**:
  - Grapple calculations automatically include size differences
  - All grappling special attacks and defenses implemented
  - Condition tracking for grappled and pinned states

### FR-COMBAT-005: Damage and Hit Points (Priority: CRITICAL)

#### FR-COMBAT-005.1: Advanced Hit Point System
- **Description**: Comprehensive hit point management with all D&D 3.5 mechanics
- **Details**:
  - **Hit Dice by Class**: d4 (Wizard) through d12 (Barbarian)
  - **Constitution Modifier**: Applied to each level's hit points
  - **Multi-Class Hit Points**: Proper tracking across all classes
  - **Epic Level Hit Points**: Average hit die + Con modifier past 20th level
  - **Temporary Hit Points**: Separate tracking from permanent hit points
  - **Nonlethal Damage**: Separate damage tracking with unconsciousness rules
- **Acceptance Criteria**:
  - Hit points calculated accurately for all class combinations
  - Temporary and nonlethal damage tracked separately
  - Death, disabled, and unconscious conditions triggered correctly

#### FR-COMBAT-005.2: Damage Calculation Engine
- **Description**: Complete damage system with all weapon and spell effects
- **Details**:
  - **Weapon Damage**: Base damage + Strength/Dex modifier + enhancement
  - **Two-Handed Weapons**: 1.5x Strength bonus application
  - **Off-Hand Attacks**: Half Strength bonus for light weapons
  - **Critical Hits**: Threat range and multiplier calculations
  - **Sneak Attack**: Rogue and assassin precision damage
  - **Spell Damage**: Caster level and ability modifier scaling
- **Acceptance Criteria**:
  - All weapon damage bonuses calculated correctly
  - Critical hit mechanics implemented with proper threat ranges
  - Precision damage (sneak attack) applied under correct conditions

## Performance Requirements

### Combat Calculation Speed
- **Real-time Updates**: All combat statistics recalculate within 100ms of changes
- **Complex Scenarios**: System handles 20+ class combinations without performance degradation
- **Epic Level Support**: Calculations remain fast through level 60+ characters

### Memory Efficiency
- **Combat State**: Efficient storage of all active combat conditions and modifiers
- **Calculation Caching**: Repeated calculations cached to improve performance
- **Large Combats**: Support for tracking multiple characters simultaneously

## Integration Requirements

### Equipment System Integration
- **Weapon Statistics**: Automatic import of weapon damage, critical, and enhancement data
- **Armor Integration**: AC bonuses, max dex, and armor check penalties applied automatically
- **Magic Item Effects**: All combat-affecting magic items integrated into calculations

### Spell System Integration
- **Buff Spells**: Automatic application of spell bonuses to combat statistics
- **Condition Effects**: Integration with spell-based conditions (blind, haste, etc.)
- **Dispel Effects**: Proper removal of magical bonuses when dispelled

## Conclusion

This combat system represents the most sophisticated D&D 3.5 combat implementation, matching the complexity and accuracy of the Rackem19.xlsm system while providing a modern web interface. The system ensures complete rule compliance and supports all edge cases found in D&D 3.5 gameplay.
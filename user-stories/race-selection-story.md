# D&D Race Selection User Story

## Story Information
- **Story ID**: US-003
- **Epic**: Character Creation System
- **Theme**: Character Identity
- **Priority**: High
- **Story Points**: 8
- **Status**: Backlog

## User Story
**As a** D&D player  
**I want** to select a race for my character  
**So that** I can define my character's heritage and gain appropriate racial abilities

## Acceptance Criteria
### Scenario 1: Race Selection with Modifiers
**Given** I am on the race selection step  
**When** I select a race (e.g., Elf)  
**Then** the character object is updated with racial ability modifiers (+2 Dex, -2 Con)

### Scenario 2: Racial Special Abilities
**Given** I select a race with special abilities  
**When** the race is applied to my character  
**Then** all racial abilities are added to the character (e.g., Elf weapon proficiencies, low-light vision)

### Scenario 3: Size and Movement Updates
**Given** I select a Small race (e.g., Halfling)  
**When** the race is applied  
**Then** size bonuses and movement speed are correctly set

### Scenario 4: Language Assignment
**Given** I select any race  
**When** the race is applied  
**Then** automatic languages and available bonus languages are set correctly

## Definition of Done
- [ ] All SRD races available: Human, Dwarf, Elf, Gnome, Half-Elf, Half-Orc, Halfling
- [ ] Racial ability modifiers applied correctly
- [ ] All racial special abilities implemented
- [ ] Size modifiers calculated for Small races
- [ ] Movement speeds set correctly
- [ ] Languages assigned properly
- [ ] Favored class set for multiclassing
- [ ] Race data stored in character object

## Business Value
Allows players to choose from all official D&D races with complete and accurate implementation of racial features.

## Dependencies
- REQ-003: Race Selection
- US-002: Ability Score Generation (for applying modifiers)

## Technical Notes
- **🚨 CRITICAL: All code must be placed in `code-repository/src/races/` folder**
- Implement race data as JavaScript objects with all properties
- Small races get +1 AC, +1 attack, +4 Hide, 3/4 carrying capacity
- Must handle favored class for multiclassing penalties

## Racial Features Implementation
### Human
- +1 feat at 1st level, +4 skill points at 1st level, +1 per level
- Any favored class

### Dwarf
- +2 Con, -2 Cha, Darkvision, Stonecunning, weapon familiarity, stability
- +2 vs poison/spells, +1 vs orcs/goblinoids, +4 AC vs giants
- Favored class: Fighter

### Elf
- +2 Dex, -2 Con, Low-light vision, sleep immunity, +2 vs enchantment
- Weapon proficiencies, +2 Listen/Search/Spot, automatic secret door checks
- Favored class: Wizard

### Gnome
- +2 Con, -2 Str, Small size, Low-light vision, +2 vs illusions
- +1 DC illusion spells, +1 vs kobolds/goblinoids, +4 AC vs giants
- Spell-like abilities, +2 Listen, +2 Craft (alchemy)
- Favored class: Bard

### Half-Elf
- Sleep immunity, +2 vs enchantment, Low-light vision
- +1 Listen/Search/Spot, +2 Diplomacy/Gather Information
- Elven blood, any favored class

### Half-Orc
- +2 Str, -2 Int, -2 Cha, Darkvision
- Favored class: Barbarian

### Halfling
- +2 Dex, -2 Str, Small size, +2 vs fear, +1 thrown/sling attacks
- +2 Climb/Jump/Listen/Move Silently/Hide
- Favored class: Rogue

## Test Cases
### Test Case 1: Elf Racial Features
- **Preconditions**: Character creation in progress
- **Steps**: 
  1. Select Elf race
  2. Verify +2 Dex, -2 Con applied
  3. Check weapon proficiencies added
  4. Confirm low-light vision present
- **Expected Result**: All Elf racial features correctly applied

### Test Case 2: Halfling Size Effects
- **Preconditions**: Character creation in progress
- **Steps**: 
  1. Select Halfling race
  2. Verify Small size set
  3. Check +1 size bonus to AC and attacks
  4. Confirm movement speed reduced to 20 feet
- **Expected Result**: All size-related modifiers correctly calculated

---
**Created**: September 20, 2025  
**Last Updated**: September 20, 2025  
**Assigned To**: JavaScript Development Team
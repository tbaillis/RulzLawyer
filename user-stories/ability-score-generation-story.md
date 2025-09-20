# D&D Ability Score Generation User Story

## Story Information
- **Story ID**: US-002
- **Epic**: Character Creation System
- **Theme**: Character Statistics
- **Priority**: High
- **Story Points**: 5
- **Status**: Backlog

## User Story
**As a** D&D player  
**I want** to generate ability scores for my character  
**So that** I can create a character with appropriate statistics using official D&D methods

## Acceptance Criteria
### Scenario 1: 4d6 Drop Lowest Method
**Given** I choose the 4d6 drop lowest method  
**When** I generate ability scores  
**Then** six scores are generated, each being the sum of the highest 3 of 4d6 rolls

### Scenario 2: Point Buy System
**Given** I choose the point buy method  
**When** I allocate points to abilities  
**Then** I can distribute points according to D&D 3.5 point buy rules with proper costs

### Scenario 3: Manual Entry
**Given** I choose manual entry  
**When** I enter ability scores  
**Then** each score is validated to be between 3 and 18

### Scenario 4: Racial Modifiers
**Given** I have selected a race  
**When** ability scores are displayed  
**Then** racial modifiers are applied and both base and modified scores are shown

## Definition of Done
- [ ] 4d6 drop lowest generation implemented
- [ ] Point buy system with proper costs
- [ ] Manual entry with validation
- [ ] Racial modifiers applied correctly
- [ ] Ability modifiers calculated automatically
- [ ] All data stored in character object
- [ ] Real-time updates when changed

## Business Value
Provides multiple official methods for generating character abilities, accommodating different play styles and campaign preferences.

## Dependencies
- REQ-002: Ability Score Generation
- Character data object structure

## Technical Notes
- **🚨 CRITICAL: All code must be placed in `code-repository/src/abilities/` folder**
- Must implement proper randomization for 4d6 method
- Point buy costs: 8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=6, 15=8, 16=10, 17=13, 18=16 points
- Store both base and racial-modified scores in character object

## Test Cases
### Test Case 1: 4d6 Generation
- **Preconditions**: Character creation tool loaded
- **Steps**: 
  1. Select "4d6 Drop Lowest" method
  2. Click generate button
  3. Verify six ability scores generated
  4. Check each score is between 3-18
- **Expected Result**: Six valid ability scores generated and stored

### Test Case 2: Point Buy Validation
- **Preconditions**: Point buy method selected
- **Steps**: 
  1. Attempt to set all abilities to 18
  2. Verify point cost exceeds available points
  3. Create valid point distribution
- **Expected Result**: Invalid distributions rejected, valid ones accepted

## Related Requirements
- REQ-002: Ability Score Generation
- REQ-003: Race Selection (for modifiers)

---
**Created**: September 20, 2025  
**Last Updated**: September 20, 2025  
**Assigned To**: JavaScript Development Team
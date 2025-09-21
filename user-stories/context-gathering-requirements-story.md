# US-012: Comprehensive Context Gathering Before Code Changes

## User Story
**As a** coding agent working on complex JavaScript applications  
**I want** to gather comprehensive context about the codebase before making any changes  
**So that** I avoid making incorrect assumptions and introducing new bugs through insufficient understanding

## Acceptance Criteria

### AC-012.1: Mandatory Context Reading Requirements
- **GIVEN** I need to modify or debug JavaScript code
- **WHEN** I begin code investigation
- **THEN** I must:
  - Read at least 2000 lines of context around any code I plan to modify
  - Read complete class definitions, not just method signatures
  - Understand import/export patterns and module dependencies
  - Verify actual vs assumed class names, method names, and API contracts
  - **NEVER** make changes based on assumptions without code verification

### AC-012.2: System Architecture Understanding Protocol
- **GIVEN** working with interconnected JavaScript modules
- **WHEN** investigating code changes
- **THEN** I must:
  - Map all class dependencies and instantiation patterns
  - Understand the complete data flow between modules
  - Identify global variable requirements and browser compatibility needs
  - Trace function call chains and parameter passing
  - Document the intended vs actual system architecture

### AC-012.3: File Exploration Requirements
- **GIVEN** console errors or reported bugs
- **WHEN** investigating the codebase
- **THEN** I must:
  - Read complete files, not just error locations
  - Explore related files mentioned in stack traces or error messages
  - Use semantic search to find similar patterns and implementations
  - Cross-reference class names and method calls across the entire codebase
  - Verify export/import consistency across all related files

## Business Context
During the D&D 3.5 character creation debugging session, insufficient context gathering led to multiple incorrect assumptions and prolonged debugging:

### Critical Context Gathering Failures:
1. **Insufficient File Reading**: Made changes without reading enough context (need 2000+ lines)
2. **Class Name Assumptions**: Assumed `RandomTablesIndex` existed without verifying actual class name was `RandomTablesEngine`
3. **Method Name Guessing**: Called `startWizard()` without reading the class to find actual `startCreation()` method
4. **Global Reference Blindness**: Missed the critical need for `window.characterWizard` global reference
5. **Architecture Misunderstanding**: Didn't understand how HTML onclick handlers needed global function access
6. **Dependency Chain Ignorance**: Failed to map complete dependency relationships between modules

### Proper Context Gathering Should Include:
1. **Complete Class Reading**: Read entire class definitions with all methods and constructor parameters
2. **Cross-File Reference Checking**: Verify all imported/exported names match across files
3. **Global Pattern Recognition**: Identify where browser global variables are needed
4. **HTML Integration Understanding**: Recognize how JavaScript connects to HTML event handlers
5. **Module Dependency Mapping**: Understand complete initialization and dependency loading order

## Technical Implementation

### Required Context Gathering Workflow:
```markdown
1. **File Reading Phase**
   - [ ] Read complete files (minimum 2000 lines of context)
   - [ ] Read ALL related files mentioned in error messages
   - [ ] Use read_file tool with large line ranges, not small snippets
   - [ ] Document actual vs assumed class names, method names, exports

2. **Dependency Mapping Phase**
   - [ ] Map all import/require statements and their sources
   - [ ] Trace constructor parameters and method dependencies
   - [ ] Identify global variable declarations and window object assignments
   - [ ] Document the complete module instantiation order

3. **Architecture Analysis Phase**
   - [ ] Understand how modules communicate and share data
   - [ ] Identify browser-specific patterns (global references, HTML integration)
   - [ ] Map the complete user interaction flow (UI → JavaScript → data)
   - [ ] Document intended vs actual system behavior

4. **Cross-Reference Verification Phase**
   - [ ] Use semantic_search to find similar patterns across codebase
   - [ ] Verify consistency of class names and method signatures
   - [ ] Check export patterns match import expectations
   - [ ] Validate that HTML references match JavaScript globals

5. **Context Documentation Phase**
   - [ ] Document discovered architecture patterns
   - [ ] Note discrepancies between intended and actual implementation
   - [ ] Record global variable requirements and browser compatibility needs
   - [ ] Create reference guide for future modifications
```

### Context Reading Best Practices:
```javascript
// WRONG: Making assumptions about class names
if (typeof RandomTablesIndex !== 'undefined') {  // Assumed name
    this.randomTablesIndex = new RandomTablesIndex();

// RIGHT: Verifying actual class name from code
// After reading complete random-tables-index.js file (2000+ lines):
if (typeof RandomTablesEngine !== 'undefined') {  // Actual class name
    this.randomTablesIndex = new RandomTablesEngine(this.diceEngine);

// WRONG: Assuming method names without verification
const wizardHtml = wizard.startWizard();  // Method doesn't exist

// RIGHT: Reading complete class to find actual methods  
// After reading DnD35CharacterWizard class definition:
wizard.startCreation();  // Actual method discovered

// WRONG: Missing global reference requirement
const wizard = new DnD35CharacterWizard(this.gameEngine);
// HTML: <button onclick="characterWizard.nextStep()"> ❌ Fails

// RIGHT: Understanding browser global requirements
// After reading HTML integration patterns:
const wizard = new DnD35CharacterWizard(this.gameEngine);
window.characterWizard = wizard;  // CRITICAL for HTML callbacks
// HTML: <button onclick="characterWizard.nextStep()"> ✅ Works
```

### Required Reading Patterns:
```javascript
// Always read complete context for any modification:
read_file(filePath, 1, 2000);  // Minimum context
read_file(filePath, startLine - 50, startLine + 50);  // Around error location
read_file(relatedFile, 1, -1);  // Complete related files

// Use semantic search to understand patterns:
semantic_search("class instantiation patterns");
semantic_search("global variable declarations");
semantic_search("HTML onclick handler integration");
```

## Test Scenarios

### TS-012.1: Context Reading Validation
```javascript
// Verify sufficient context reading before changes
const contextRequirements = {
    minimumLinesRead: 2000,
    completeClassDefinitions: true,
    allRelatedFilesRead: true,
    globalPatternsIdentified: true
};

// Test context gathering completeness
assert(contextLinesRead >= contextRequirements.minimumLinesRead);
assert(classDefinitionsComplete === true);
assert(relatedFilesExplored.length > 0);
```

### TS-012.2: Architecture Understanding Verification
```javascript
// Verify complete system understanding before changes
const architectureMap = {
    classNames: ['DnD35CharacterWizard', 'RandomTablesEngine', 'AdventureEngine'],
    methodNames: ['startCreation', 'rollTable', 'generateCompleteAdventure'],
    globalReferences: ['window.characterWizard', 'window.gameEngine'],
    dependencies: ['diceEngine', 'randomTables', 'storageManager']
};

// Validate architecture mapping completeness
assert(discoveredClasses.every(cls => architectureMap.classNames.includes(cls)));
assert(globalReferencesIdentified.length > 0);
```

### TS-012.3: Cross-Reference Consistency Check
```javascript
// Verify import/export consistency
const consistencyChecks = {
    exportsMatchImports: true,
    classNamesConsistent: true,
    methodSignaturesMatch: true,
    globalReferencesValid: true
};

// Test that all references are valid after context gathering
assert(exportImportMatches.every(match => match.isValid));
assert(classNameReferences.every(ref => ref.exists));
```

## Definition of Done
- [ ] Complete context reading (2000+ lines minimum) performed before any code changes
- [ ] All related files explored and understood
- [ ] System architecture mapped and documented
- [ ] Cross-references verified for consistency
- [ ] Global variable requirements identified
- [ ] HTML integration patterns understood
- [ ] Context findings documented for future reference

## Priority
**CRITICAL** - Essential for preventing bugs caused by insufficient understanding

## Story Points
**5** - Moderate complexity requiring systematic file exploration and architecture understanding

## Dependencies
- REQ-001: Code Investigation Standards
- REQ-002: File Reading Requirements
- REQ-003: System Architecture Documentation

## Notes
This user story directly addresses the context gathering failures from the D&D 3.5 debugging session. The systematic approach prevents:

### Specific Failures Addressed:
1. **RandomTablesIndex vs RandomTablesEngine confusion** - Prevented by reading complete class definitions
2. **startWizard() vs startCreation() error** - Prevented by reading complete method lists
3. **Missing window.characterWizard global** - Prevented by understanding HTML integration patterns  
4. **Inadequate dependency understanding** - Prevented by mapping complete module relationships

### Key Learning:
**Never assume anything about code without verification.** The debugging session showed that assumptions about class names, method names, and system architecture led to multiple failed attempts. Reading 2000+ lines of context before making changes would have prevented most issues.

### Context Reading Tools Usage:
- Use `read_file` with large ranges (2000+ lines)
- Use `semantic_search` to find patterns and similar implementations
- Use `grep_search` to find specific references across the codebase
- Use `file_search` to locate related files and dependencies